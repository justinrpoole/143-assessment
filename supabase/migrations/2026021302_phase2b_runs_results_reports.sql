-- Phase 2B: assessment run lifecycle persistence (draft -> in_progress -> completed)
-- Includes responses, computed results, HTML report storage, RLS, and run-number allocator.

create extension if not exists pgcrypto;
create table if not exists assessment_runs (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  status text not null check (status in ('draft','in_progress','completed','canceled')),
  run_number int not null,
  created_at timestamptz not null default now(),
  started_at timestamptz,
  completed_at timestamptz,
  context_scope text,
  focus_area text,
  source_route text,
  user_state_at_start text not null check (
    user_state_at_start in ('public','free_email','paid_43','sub_active','sub_canceled','past_due')
  ),
  entitlement_snapshot jsonb,
  unique (user_id, run_number)
);
create table if not exists assessment_responses (
  id uuid primary key default gen_random_uuid(),
  run_id uuid not null references assessment_runs(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  question_id text not null,
  value int not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (run_id, question_id)
);
create table if not exists assessment_results (
  id uuid primary key default gen_random_uuid(),
  run_id uuid not null unique references assessment_runs(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  computed_at timestamptz not null default now(),
  ray_scores jsonb not null,
  top_rays jsonb not null,
  ray_pair_id text not null,
  results_payload jsonb not null,
  report_version text not null default 'v1'
);
create table if not exists assessment_reports (
  id uuid primary key default gen_random_uuid(),
  run_id uuid not null unique references assessment_runs(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  created_at timestamptz not null default now(),
  format text not null check (format in ('html','pdf')),
  status text not null check (status in ('ready','pending','failed')),
  html text,
  storage_path text,
  meta jsonb
);
create index if not exists idx_assessment_runs_user_created
  on assessment_runs(user_id, created_at desc);
create index if not exists idx_assessment_responses_run_id
  on assessment_responses(run_id);
create index if not exists idx_assessment_results_user
  on assessment_results(user_id, computed_at desc);
create index if not exists idx_assessment_reports_user
  on assessment_reports(user_id, created_at desc);
create or replace function set_updated_at_column()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;
drop trigger if exists trg_assessment_responses_set_updated_at on assessment_responses;
create trigger trg_assessment_responses_set_updated_at
before update on assessment_responses
for each row
execute function set_updated_at_column();
create or replace function guard_assessment_runs_mutable_fields()
returns trigger
language plpgsql
as $$
begin
  if old.status = 'completed' then
    raise exception 'Completed runs are immutable.';
  end if;

  if new.id <> old.id
    or new.user_id <> old.user_id
    or new.run_number <> old.run_number
    or new.created_at <> old.created_at then
    raise exception 'Immutable run fields cannot be changed.';
  end if;

  return new;
end;
$$;
drop trigger if exists trg_guard_assessment_runs_mutable_fields on assessment_runs;
create trigger trg_guard_assessment_runs_mutable_fields
before update on assessment_runs
for each row
execute function guard_assessment_runs_mutable_fields();
create or replace function create_assessment_run(
  p_user_id uuid,
  p_user_state_at_start text,
  p_context_scope text default null,
  p_focus_area text default null,
  p_source_route text default null,
  p_entitlement_snapshot jsonb default '{}'::jsonb
)
returns table (
  id uuid,
  run_number int,
  status text
)
language plpgsql
security definer
set search_path = public
as $$
declare
  v_next_run_number int;
  v_run_id uuid;
begin
  if p_user_state_at_start not in ('public','free_email','paid_43','sub_active','sub_canceled','past_due') then
    raise exception 'Invalid user state at run start: %', p_user_state_at_start;
  end if;

  perform pg_advisory_xact_lock(hashtext(p_user_id::text));

  select coalesce(max(ar.run_number), 0) + 1
    into v_next_run_number
  from assessment_runs ar
  where ar.user_id = p_user_id;

  insert into assessment_runs (
    user_id,
    status,
    run_number,
    context_scope,
    focus_area,
    source_route,
    user_state_at_start,
    entitlement_snapshot
  )
  values (
    p_user_id,
    'draft',
    v_next_run_number,
    p_context_scope,
    p_focus_area,
    p_source_route,
    p_user_state_at_start,
    p_entitlement_snapshot
  )
  returning assessment_runs.id into v_run_id;

  return query
  select ar.id, ar.run_number, ar.status
  from assessment_runs ar
  where ar.id = v_run_id;
end;
$$;
revoke all on function create_assessment_run(uuid, text, text, text, text, jsonb) from public;
grant execute on function create_assessment_run(uuid, text, text, text, text, jsonb) to authenticated;
grant execute on function create_assessment_run(uuid, text, text, text, text, jsonb) to service_role;
create or replace function runs_schema_healthcheck()
returns table (
  table_name text,
  table_exists boolean,
  rls_enabled boolean
)
language sql
security definer
set search_path = public
as $$
  with expected(table_name) as (
    values
      ('assessment_runs'::text),
      ('assessment_responses'::text),
      ('assessment_results'::text),
      ('assessment_reports'::text)
  )
  select
    e.table_name,
    c.oid is not null as table_exists,
    coalesce(c.relrowsecurity, false) as rls_enabled
  from expected e
  left join pg_class c
    on c.relname = e.table_name
   and c.relkind = 'r'
  left join pg_namespace n
    on n.oid = c.relnamespace
   and n.nspname = 'public'
  order by e.table_name;
$$;
revoke all on function runs_schema_healthcheck() from public;
grant execute on function runs_schema_healthcheck() to authenticated;
grant execute on function runs_schema_healthcheck() to service_role;
alter table assessment_runs enable row level security;
alter table assessment_responses enable row level security;
alter table assessment_results enable row level security;
alter table assessment_reports enable row level security;
drop policy if exists assessment_runs_select_own on assessment_runs;
create policy assessment_runs_select_own
  on assessment_runs
  for select
  using (auth.uid() = user_id);
drop policy if exists assessment_runs_insert_own on assessment_runs;
create policy assessment_runs_insert_own
  on assessment_runs
  for insert
  with check (auth.uid() = user_id);
drop policy if exists assessment_runs_update_own on assessment_runs;
create policy assessment_runs_update_own
  on assessment_runs
  for update
  using (auth.uid() = user_id and status <> 'completed')
  with check (auth.uid() = user_id);
drop policy if exists assessment_responses_select_own on assessment_responses;
create policy assessment_responses_select_own
  on assessment_responses
  for select
  using (auth.uid() = user_id);
drop policy if exists assessment_responses_insert_own on assessment_responses;
create policy assessment_responses_insert_own
  on assessment_responses
  for insert
  with check (
    auth.uid() = user_id
    and exists (
      select 1
      from assessment_runs ar
      where ar.id = run_id
        and ar.user_id = auth.uid()
    )
  );
drop policy if exists assessment_responses_update_own on assessment_responses;
create policy assessment_responses_update_own
  on assessment_responses
  for update
  using (
    auth.uid() = user_id
    and exists (
      select 1
      from assessment_runs ar
      where ar.id = run_id
        and ar.user_id = auth.uid()
        and ar.status <> 'completed'
    )
  )
  with check (auth.uid() = user_id);
drop policy if exists assessment_results_select_own on assessment_results;
create policy assessment_results_select_own
  on assessment_results
  for select
  using (auth.uid() = user_id);
drop policy if exists assessment_results_insert_own on assessment_results;
create policy assessment_results_insert_own
  on assessment_results
  for insert
  with check (auth.uid() = user_id);
drop policy if exists assessment_results_update_own on assessment_results;
create policy assessment_results_update_own
  on assessment_results
  for update
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);
drop policy if exists assessment_reports_select_own on assessment_reports;
create policy assessment_reports_select_own
  on assessment_reports
  for select
  using (auth.uid() = user_id);
drop policy if exists assessment_reports_insert_own on assessment_reports;
create policy assessment_reports_insert_own
  on assessment_reports
  for insert
  with check (auth.uid() = user_id);
drop policy if exists assessment_reports_update_own on assessment_reports;
create policy assessment_reports_update_own
  on assessment_reports
  for update
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);
