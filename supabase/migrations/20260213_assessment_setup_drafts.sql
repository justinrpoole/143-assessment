-- V1-lite assessment setup metadata draft storage.
-- Ties setup metadata to the upcoming run via run_binding_key.

create table if not exists assessment_setup_drafts (
  id uuid primary key,
  run_binding_key uuid not null unique,
  user_id uuid null references auth.users(id) on delete set null,
  user_state text not null check (
    user_state in ('public','free_email','paid_43','sub_active','sub_canceled','past_due')
  ),
  source_route text not null default '/assessment/setup',
  context_scope text not null check (
    context_scope in ('work','home','mixed')
  ),
  focus_target text not null,
  first_rep text not null,
  status text not null default 'draft' check (
    status in ('draft','bound','consumed')
  ),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index if not exists idx_assessment_setup_drafts_user_id
  on assessment_setup_drafts(user_id);
create index if not exists idx_assessment_setup_drafts_user_state
  on assessment_setup_drafts(user_state);
create index if not exists idx_assessment_setup_drafts_created_at
  on assessment_setup_drafts(created_at desc);
