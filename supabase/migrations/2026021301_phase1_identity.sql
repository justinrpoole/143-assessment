-- Phase 1 minimal schema: identity + source route + optional event placeholders.
-- No Stripe and no assessment persistence in this migration.

create table if not exists app_users (
  id uuid primary key,
  email text unique not null,
  user_state text not null default 'public' check (
    user_state in ('public','free_email','paid_43','sub_active','sub_canceled','past_due')
  ),
  source_route text not null default '/upgrade-your-os',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create table if not exists event_log_placeholders (
  id bigserial primary key,
  user_id uuid null references app_users(id) on delete set null,
  event_name text not null,
  source_route text not null,
  user_state text not null check (
    user_state in ('public','free_email','paid_43','sub_active','sub_canceled','past_due')
  ),
  payload jsonb not null default '{}'::jsonb,
  event_ts_utc timestamptz not null default now()
);
create index if not exists idx_event_log_placeholders_event_name on event_log_placeholders(event_name);
create index if not exists idx_event_log_placeholders_source_route on event_log_placeholders(source_route);
create index if not exists idx_event_log_placeholders_user_state on event_log_placeholders(user_state);
