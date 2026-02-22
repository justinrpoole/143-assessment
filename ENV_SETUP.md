# ENV Setup (Phase 2E.2)

This file defines the environment bootstrap contract for local development and QA.

## Required Environment Variables

### Supabase
- `SUPABASE_SERVICE_ROLE_KEY`
- One of:
  - `SUPABASE_URL`
  - `NEXT_PUBLIC_SUPABASE_URL`

### Stripe
- `STRIPE_SECRET_KEY`
- `STRIPE_WEBHOOK_SECRET`
- `STRIPE_PRICE_PAID_43`
- `STRIPE_PRICE_SUB_1433`

### Storage (Supabase Storage)
- No extra keys beyond Supabase credentials above.
- Buckets required:
  - `reports`
  - `sharecards`

### Email Provider
- `EMAIL_PROVIDER_API_URL`
- `EMAIL_PROVIDER_API_KEY`

### App Base URL
- `APP_BASE_URL`

### Additional Runtime
- `MAGIC_LINK_SECRET` (strong secret in non-dev environments)
- `ENV_SPEC_CENTER_KEY` (required in production for `/spec-center`)

## Local Setup Steps

### 1) Supabase project link
```bash
supabase login
supabase link --project-ref <your-project-ref>
```

### 2) Apply migrations
```bash
supabase db push
```

Expected tables include:
- `assessment_runs`, `assessment_responses`, `assessment_results`, `assessment_reports`
- `user_entitlements`, `stripe_webhook_events`
- `email_jobs`, `morning_entries`, `micro_joy_entries`

### 3) Storage buckets
Phase 2C migration creates buckets automatically if permissions allow. Verify in Supabase:
- `reports` (private)
- `sharecards` (private)

If needed, create manually in Dashboard -> Storage.

### 4) Stripe CLI webhook forward (local)
Start app first:
```bash
npm run dev
```

Forward Stripe events:
```bash
stripe listen --forward-to http://localhost:3000/api/stripe/webhook
```

Copy the webhook signing secret from Stripe CLI output and set:
- `STRIPE_WEBHOOK_SECRET=whsec_...`

Example trigger commands:
```bash
stripe trigger checkout.session.completed
stripe trigger invoice.payment_failed
stripe trigger invoice.paid
```

### 5) Seed/test user steps
Create a test auth user in Supabase Auth (Dashboard or script), then seed app row:
```sql
insert into app_users (id, email, user_state, source_route)
values ('<auth_user_uuid>', 'test@example.com', 'free_email', '/upgrade-your-os')
on conflict (id) do nothing;
```

Optional entitlement seed:
```sql
insert into user_entitlements (user_id, user_state)
values ('<auth_user_uuid>', 'free_email')
on conflict (user_id) do update set user_state = excluded.user_state, updated_at = now();
```

## Known-Good Smoke Flow (Manual)

Run this sequence in order:
1. `/preview` -> start + complete preview
2. `/upgrade` -> start checkout
3. Stripe webhook received -> entitlement updated (`purchase_complete` server-side only)
4. `/assessment/setup` -> `/assessment` -> complete run
5. `/reports` -> generate PDF -> signed URL download
6. `/results` or `/growth` or `/morning` -> generate share card

Expected checkpoints:
- Entitlements update only via webhook events.
- `assessment_reports` has `html` and `pdf` records (when generated).
- Storage path pattern:
  - `reports/<user_id>/<run_id>/report_v1.pdf`
  - `sharecards/<user_id>/<type>/<run_id>.<ext>`
