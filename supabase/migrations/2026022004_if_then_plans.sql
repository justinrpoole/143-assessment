-- If/Then Plan Builder: implementation intentions
-- "If [cue], then I will [rep]."
-- Science: Implementation intentions double follow-through rates (Peter Gollwitzer, NYU)

create table if not exists public.if_then_plans (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  if_cue text not null,
  then_action text not null,
  tool_name text,
  active boolean not null default true,
  completed_count int not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists idx_if_then_plans_user_active
  on public.if_then_plans(user_id, active, created_at desc);

-- RLS
alter table public.if_then_plans enable row level security;

create policy "Users can read own if_then_plans"
  on public.if_then_plans for select
  using (auth.uid() = user_id);

create policy "Users can insert own if_then_plans"
  on public.if_then_plans for insert
  with check (auth.uid() = user_id);

create policy "Users can update own if_then_plans"
  on public.if_then_plans for update
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

-- Auto-update timestamp
drop trigger if exists trg_if_then_plans_updated_at on public.if_then_plans;
create trigger trg_if_then_plans_updated_at
before update on public.if_then_plans
for each row
execute function set_phase2d_updated_at();
