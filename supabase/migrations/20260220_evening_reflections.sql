-- Evening Reflection: 3-minute end-of-day protocol
-- Three prompts: What happened? What did I do? What will I try next?
-- Science: Metacognitive reflection converts experience into learning (Schon, reflective practice)

create table if not exists public.evening_reflections (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  entry_date date not null,
  what_happened text not null,
  what_i_did text not null,
  what_next text not null,
  quality_score smallint not null default 0 check (quality_score between 0 and 3),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (user_id, entry_date)
);

create index if not exists idx_evening_reflections_user_date
  on public.evening_reflections(user_id, entry_date desc);

-- RLS
alter table public.evening_reflections enable row level security;

create policy "Users can read own evening reflections"
  on public.evening_reflections for select
  using (auth.uid() = user_id);

create policy "Users can insert own evening reflections"
  on public.evening_reflections for insert
  with check (auth.uid() = user_id);

create policy "Users can update own evening reflections"
  on public.evening_reflections for update
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

-- Auto-update timestamp
drop trigger if exists trg_evening_reflections_updated_at on public.evening_reflections;
create trigger trg_evening_reflections_updated_at
before update on public.evening_reflections
for each row
execute function set_phase2d_updated_at();
