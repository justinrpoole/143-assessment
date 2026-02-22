# Environment Setup

This file matches the live `qa:env` contract.

## Required Variables

### Supabase
- `SUPABASE_URL` OR `NEXT_PUBLIC_SUPABASE_URL`
- `SUPABASE_SERVICE_ROLE_KEY`

### Stripe
- `STRIPE_SECRET_KEY`
- `STRIPE_WEBHOOK_SECRET`
- `STRIPE_PRICE_PAID_43`
- `STRIPE_PRICE_SUB_1433`

### Storage
- No additional variables beyond Supabase credentials above.

### Email provider
- `EMAIL_PROVIDER_API_URL`
- `EMAIL_PROVIDER_API_KEY`

### App base URL
- `APP_BASE_URL`

## Recommended Variables
- `MAGIC_LINK_SECRET`
- `ENV_SPEC_CENTER_KEY`

## Local Behavior
- If required vars are missing and `CI` is not `true`, `qa:env` reports missing vars and returns `SKIP`.
- If required vars are missing and `CI=true`, `qa:env` fails.
