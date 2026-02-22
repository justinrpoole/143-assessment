-- Phase 2D: retention loop persistence for email jobs, morning entries, and micro-joy entries.

create extension if not exists pgcrypto;
create table if not exists email_jobs (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  type text not null,
  payload jsonb not null default '{}'::jsonb,
  send_at timestamptz not null default now(),
  status text not null default 'queued' check (
    status in ('queued', 'processing', 'sent', 'failed', 'skipped', 'canceled')
  ),
  attempts int not null default 0,
  last_error text null,
  sent_at timestamptz null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index if not exists idx_email_jobs_status_send_at
  on email_jobs(status, send_at asc);
create index if not exists idx_email_jobs_user
  on email_jobs(user_id, created_at desc);
create table if not exists morning_entries (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  entry_date date not null,
  affirmation_text text not null,
  reps_logged int not null default 0 check (reps_logged >= 0),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (user_id, entry_date)
);
create index if not exists idx_morning_entries_user_date
  on morning_entries(user_id, entry_date desc);
create table if not exists micro_joy_entries (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  created_at timestamptz not null default now(),
  suggestion_text text not null,
  selected boolean not null default false,
  notes text null,
  category text null,
  template_key text null,
  local_date date not null default (now() at time zone 'utc')::date
);
create index if not exists idx_micro_joy_entries_user_created
  on micro_joy_entries(user_id, created_at desc);
create index if not exists idx_micro_joy_entries_user_date
  on micro_joy_entries(user_id, local_date desc);
create or replace function set_phase2d_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;
drop trigger if exists trg_email_jobs_updated_at on email_jobs;
create trigger trg_email_jobs_updated_at
before update on email_jobs
for each row
execute function set_phase2d_updated_at();
drop trigger if exists trg_morning_entries_updated_at on morning_entries;
create trigger trg_morning_entries_updated_at
before update on morning_entries
for each row
execute function set_phase2d_updated_at();
alter table email_jobs enable row level security;
alter table morning_entries enable row level security;
alter table micro_joy_entries enable row level security;
drop policy if exists email_jobs_select_own on email_jobs;
create policy email_jobs_select_own
  on email_jobs
  for select
  using (auth.uid() = user_id);
drop policy if exists morning_entries_select_own on morning_entries;
create policy morning_entries_select_own
  on morning_entries
  for select
  using (auth.uid() = user_id);
drop policy if exists morning_entries_insert_own on morning_entries;
create policy morning_entries_insert_own
  on morning_entries
  for insert
  with check (auth.uid() = user_id);
drop policy if exists morning_entries_update_own on morning_entries;
create policy morning_entries_update_own
  on morning_entries
  for update
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);
drop policy if exists micro_joy_entries_select_own on micro_joy_entries;
create policy micro_joy_entries_select_own
  on micro_joy_entries
  for select
  using (auth.uid() = user_id);
drop policy if exists micro_joy_entries_insert_own on micro_joy_entries;
create policy micro_joy_entries_insert_own
  on micro_joy_entries
  for insert
  with check (auth.uid() = user_id);
drop policy if exists micro_joy_entries_update_own on micro_joy_entries;
create policy micro_joy_entries_update_own
  on micro_joy_entries
  for update
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);
create or replace function phase2d_retention_schema_healthcheck()
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
      ('email_jobs'::text),
      ('morning_entries'::text),
      ('micro_joy_entries'::text)
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
revoke all on function phase2d_retention_schema_healthcheck() from public;
grant execute on function phase2d_retention_schema_healthcheck() to authenticated;
grant execute on function phase2d_retention_schema_healthcheck() to service_role;
