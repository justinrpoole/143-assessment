-- Phase 3: user feedback capture for launch validation.

create extension if not exists pgcrypto;
create table if not exists user_feedback (
  id uuid primary key default gen_random_uuid(),
  user_id uuid null references auth.users(id) on delete set null,
  user_state text not null default 'public' check (
    user_state in ('public','free_email','paid_43','sub_active','sub_canceled','past_due')
  ),
  source_route text null,
  run_id uuid null references assessment_runs(id) on delete set null,
  feedback_type text not null,
  rating int null check (rating between 1 and 5),
  free_text text null,
  created_at timestamptz not null default now()
);
create index if not exists idx_user_feedback_created_at
  on user_feedback(created_at desc);
create index if not exists idx_user_feedback_feedback_type
  on user_feedback(feedback_type);
create index if not exists idx_user_feedback_user_id
  on user_feedback(user_id);
alter table user_feedback enable row level security;
drop policy if exists user_feedback_insert_own_authenticated on user_feedback;
create policy user_feedback_insert_own_authenticated
  on user_feedback
  for insert
  with check (
    auth.uid() is not null
    and user_id = auth.uid()
  );
drop policy if exists user_feedback_select_own on user_feedback;
create policy user_feedback_select_own
  on user_feedback
  for select
  using (
    auth.uid() is not null
    and user_id = auth.uid()
  );
