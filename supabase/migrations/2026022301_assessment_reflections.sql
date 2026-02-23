-- Assessment reflections: open-text responses collected during the assessment.
-- Separate from assessment_responses (which stores numeric values only).

create table if not exists assessment_reflections (
  id uuid primary key default gen_random_uuid(),
  run_id uuid not null references assessment_runs(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  prompt_id text not null,
  response_text text not null default '',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (run_id, prompt_id)
);

create index if not exists idx_assessment_reflections_run_id
  on assessment_reflections(run_id);

drop trigger if exists trg_assessment_reflections_set_updated_at on assessment_reflections;
create trigger trg_assessment_reflections_set_updated_at
before update on assessment_reflections
for each row
execute function set_updated_at_column();

alter table assessment_reflections enable row level security;

drop policy if exists assessment_reflections_select_own on assessment_reflections;
create policy assessment_reflections_select_own
  on assessment_reflections
  for select
  using (auth.uid() = user_id);

drop policy if exists assessment_reflections_insert_own on assessment_reflections;
create policy assessment_reflections_insert_own
  on assessment_reflections
  for insert
  with check (
    auth.uid() = user_id
    and exists (
      select 1 from assessment_runs ar
      where ar.id = run_id
        and ar.user_id = auth.uid()
    )
  );

drop policy if exists assessment_reflections_update_own on assessment_reflections;
create policy assessment_reflections_update_own
  on assessment_reflections
  for update
  using (
    auth.uid() = user_id
    and exists (
      select 1 from assessment_runs ar
      where ar.id = run_id
        and ar.user_id = auth.uid()
        and ar.status <> 'completed'
    )
  )
  with check (auth.uid() = user_id);
