-- Energy Audit: weekly allostatic load tracking
-- 8 dimensions scored 0-3 (none / mild / moderate / high)
-- Science: Allostatic load model (McEwen & Stellar) — cumulative stress cost is measurable

create table if not exists public.energy_audits (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  week_of date not null,
  sleep_debt smallint not null check (sleep_debt between 0 and 3),
  recovery_quality smallint not null check (recovery_quality between 0 and 3),
  fog smallint not null check (fog between 0 and 3),
  irritability smallint not null check (irritability between 0 and 3),
  impulsivity smallint not null check (impulsivity between 0 and 3),
  numbness smallint not null check (numbness between 0 and 3),
  somatic_signals smallint not null check (somatic_signals between 0 and 3),
  compulsion smallint not null check (compulsion between 0 and 3),
  total_load smallint not null check (total_load between 0 and 24),
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (user_id, week_of)
);

create index if not exists idx_energy_audits_user_week
  on public.energy_audits(user_id, week_of desc);

-- RLS
alter table public.energy_audits enable row level security;

create policy "Users can read own energy audits"
  on public.energy_audits for select
  using (auth.uid() = user_id);

create policy "Users can insert own energy audits"
  on public.energy_audits for insert
  with check (auth.uid() = user_id);

create policy "Users can update own energy audits"
  on public.energy_audits for update
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

-- Auto-update timestamp
drop trigger if exists trg_energy_audits_updated_at on public.energy_audits;
create trigger trg_energy_audits_updated_at
before update on public.energy_audits
for each row
execute function set_phase2d_updated_at();
