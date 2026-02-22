-- Daily Loop: Fear-Gratitude-Joy 3-minute morning practice
-- Step 1: Name It (affect labeling — reduces amygdala reactivity, Lieberman et al.)
-- Step 2: Ground It (attention shift — gratitude reframes attentional bias, Emmons & McCullough)
-- Step 3: Move (next action — implementation intention doubles follow-through, Gollwitzer)

create table if not exists public.daily_loops (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  entry_date date not null,
  name_it text not null,
  ground_it text not null,
  move_action text not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (user_id, entry_date)
);

create index if not exists idx_daily_loops_user_date
  on public.daily_loops(user_id, entry_date desc);

-- RLS
alter table public.daily_loops enable row level security;

create policy "Users can read own daily loops"
  on public.daily_loops for select
  using (auth.uid() = user_id);

create policy "Users can insert own daily loops"
  on public.daily_loops for insert
  with check (auth.uid() = user_id);

create policy "Users can update own daily loops"
  on public.daily_loops for update
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

-- Auto-update timestamp
drop trigger if exists trg_daily_loops_updated_at on public.daily_loops;
create trigger trg_daily_loops_updated_at
before update on public.daily_loops
for each row
execute function set_phase2d_updated_at();
