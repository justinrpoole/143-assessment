-- Phase C: REPs logging table
-- REPs = Recognition + Encouragement → action regardless of outcome
-- Science: Reinforcement Learning / RAS rewiring (Reticular Activating System)

create table if not exists public.reps (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  run_id uuid references public.assessment_runs(id) on delete set null,
  tool_name text not null,
  trigger_type text,
  duration_seconds int,
  quality int check (quality between 1 and 3),
  reflection_note text,
  logged_at timestamptz not null default now()
);

create index if not exists reps_user_logged_at_idx
  on public.reps(user_id, logged_at desc);

create index if not exists reps_user_tool_idx
  on public.reps(user_id, tool_name);

-- RLS
alter table public.reps enable row level security;

create policy "Users can read own reps"
  on public.reps for select
  using (auth.uid() = user_id);

create policy "Users can insert own reps"
  on public.reps for insert
  with check (auth.uid() = user_id);
