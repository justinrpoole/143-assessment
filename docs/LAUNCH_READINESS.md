# Launch Readiness

This is the operator runbook for launch configuration and pre-release validation.

## Environment Variables

| Group | Variable | Required | Notes |
|---|---|---|---|
| Supabase | `SUPABASE_URL` OR `NEXT_PUBLIC_SUPABASE_URL` | Yes | At least one must be set. |
| Supabase | `SUPABASE_SERVICE_ROLE_KEY` | Yes | Required for server-side inserts and admin API routes. |
| Stripe | `STRIPE_SECRET_KEY` | Yes | Required for checkout and billing API routes. |
| Stripe | `STRIPE_WEBHOOK_SECRET` | Yes | Required to verify webhook signatures. |
| Stripe | `STRIPE_PRICE_PAID_43` | Yes | `$43` one-time Run #1 price ID. |
| Stripe | `STRIPE_PRICE_SUB_1433` | Yes | `$14.33/mo` subscription price ID. |
| Storage | `SUPABASE_URL` OR `NEXT_PUBLIC_SUPABASE_URL` | Yes | Storage operations use Supabase credentials from the Supabase group. |
| Storage | `SUPABASE_SERVICE_ROLE_KEY` | Yes | Required for private bucket upload/signing. |
| Email provider | `EMAIL_PROVIDER_API_URL` | Yes | Base URL for email provider integration. |
| Email provider | `EMAIL_PROVIDER_API_KEY` | Yes | API key for provider requests. |
| App base URL | `APP_BASE_URL` | Yes | Used for absolute callback links and environment-aware routing. |

### Recommended Variables
- `MAGIC_LINK_SECRET`
- `ENV_SPEC_CENTER_KEY`

## Local Dev Setup
1. Install dependencies.
```bash
npm install
```
2. Configure `.env.local` with all required variables.
3. Apply migrations.
```bash
supabase db push
```
4. Verify storage buckets exist and are private.
- `reports`
- `sharecards`
5. Start app locally.
```bash
npm run dev
```
6. Start Stripe webhook forwarding.
```bash
stripe listen --forward-to http://localhost:3000/api/stripe/webhook
```
7. Verify webhook handling.
- Trigger an event (example): `stripe trigger checkout.session.completed`
- Confirm server receives and processes the webhook.

## Staging Deploy
1. Set all required env vars in staging.
2. Deploy the current build.
3. Run migrations in staging DB.
4. Confirm storage buckets are present (`reports`, `sharecards`) and private.
5. Confirm Stripe webhook endpoint is set to staging `/api/stripe/webhook`.
6. Run:
```bash
npm run qa:env
npm run qa:all
```

## Production Deploy
1. Set all required env vars in production.
2. Apply all migrations.
3. Confirm bucket and webhook configuration.
4. Deploy.
5. Run post-deploy validation:
```bash
npm run qa:env
npm run qa:all
```

## Known-Good Smoke Path
`/preview` -> `/upgrade` -> Stripe webhook entitlement update -> `/assessment/setup` -> `/assessment` -> `/results` -> `/reports` PDF generation/download -> share card generation -> retake -> `/growth`

## Common Failures
- `503` from Stripe endpoints:
  - Missing Stripe env vars (`STRIPE_SECRET_KEY`, `STRIPE_PRICE_*`, webhook secret).
- PDF remains pending:
  - PDF job did not complete or storage upload/signing failed.
- Webhook changes not reflected in entitlements:
  - Webhook not forwarded or signature secret mismatch.
- `qa:env` reports `SKIP` in non-CI:
  - Required env vars are missing locally. Fill all required vars and rerun `npm run qa:env`.

## QA Commands
```bash
npm run qa:env
npm run qa:all
npm run qa:smoke
npm run qa:content
npm run qa:score
npm run qa:report
npm run qa:events
```
