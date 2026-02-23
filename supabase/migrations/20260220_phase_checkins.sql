-- Phase Check-In: daily 30-second state scan
-- Detects current operating phase (Orbit / Gravity Shift / Eclipse Onset / Full Eclipse)
-- Science: interoceptive awareness (Lisa Feldman Barrett) — naming your state is the first regulation move.

create table if not exists public.phase_checkins (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  entry_date date not null,
  q1_score smallint not null check (q1_score between 0 and 3),
  q2_score smallint not null check (q2_score between 0 and 3),
  q3_score smallint not null check (q3_score between 0 and 3),
  total_score smallint not null check (total_score between 0 and 9),
  detected_phase text not null check (
    detected_phase in ('orbit', 'gravity_shift', 'eclipse_onset', 'full_eclipse')
  ),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (user_id, entry_date)
);

create index if not exists idx_phase_checkins_user_date
  on public.phase_checkins(user_id, entry_date desc);

-- RLS
alter table public.phase_checkins enable row level security;

create policy "Users can read own phase checkins"
  on public.phase_checkins for select
  using (auth.uid() = user_id);

create policy "Users can insert own phase checkins"
  on public.phase_checkins for insert
  with check (auth.uid() = user_id);

create policy "Users can update own phase checkins"
  on public.phase_checkins for update
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

-- Auto-update timestamp
drop trigger if exists trg_phase_checkins_updated_at on public.phase_checkins;
create trigger trg_phase_checkins_updated_at
before update on public.phase_checkins
for each row
execute function set_phase2d_updated_at();
