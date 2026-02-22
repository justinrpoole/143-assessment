-- Phase 2C: entitlements and Stripe webhook idempotency

create table if not exists user_entitlements (
  user_id uuid primary key references auth.users(id) on delete cascade,
  user_state text not null check (
    user_state in ('public','free_email','paid_43','sub_active','sub_canceled','past_due')
  ),
  stripe_customer_id text null,
  paid_43_at timestamptz null,
  sub_status text null,
  sub_current_period_end timestamptz null,
  updated_at timestamptz not null default now()
);
create index if not exists idx_user_entitlements_user_state
  on user_entitlements(user_state);
create index if not exists idx_user_entitlements_customer
  on user_entitlements(stripe_customer_id);
create table if not exists stripe_webhook_events (
  event_id text primary key,
  event_type text not null,
  status text not null check (status in ('processing','processed','failed')),
  payload_hash text null,
  failure_reason text null,
  received_at timestamptz not null default now(),
  processed_at timestamptz null
);
create index if not exists idx_stripe_webhook_events_status
  on stripe_webhook_events(status);
alter table user_entitlements enable row level security;
alter table stripe_webhook_events enable row level security;
drop policy if exists user_entitlements_select_own on user_entitlements;
create policy user_entitlements_select_own
  on user_entitlements
  for select
  using (auth.uid() = user_id);
drop policy if exists user_entitlements_insert_own on user_entitlements;
create policy user_entitlements_insert_own
  on user_entitlements
  for insert
  with check (auth.uid() = user_id);
drop policy if exists user_entitlements_update_own on user_entitlements;
create policy user_entitlements_update_own
  on user_entitlements
  for update
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);
drop policy if exists stripe_webhook_events_no_client_access on stripe_webhook_events;
create policy stripe_webhook_events_no_client_access
  on stripe_webhook_events
  for all
  using (false)
  with check (false);
