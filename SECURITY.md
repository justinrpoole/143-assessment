# Security Notes

## Key Placement
- `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` are the only Supabase keys allowed in client-exposed env vars.
- `SUPABASE_SERVICE_ROLE_KEY` is server-only and must never be used in client code, client env, or `NEXT_PUBLIC_*`.
- Stripe secret values (`STRIPE_SECRET_KEY`, `STRIPE_WEBHOOK_SECRET`) are server-only.
- Email provider API keys are server-only.

## Authorization Header Rule
- For Supabase REST/Storage requests, always send `apikey`.
- Only add `Authorization: Bearer ...` when the token is a JWT (`eyJ...`) or a user access token.
- Never send `sb_secret_*` or `sb_publishable_*` in Bearer authorization headers.

## Environment Files
- `.env*` files are gitignored and must stay out of commits.
- Keep real secrets in local/runtime environment only.

## QA Enforcement
- Run `npm run qa:security` to enforce:
  - no `sb_secret_*` leakage in client paths
  - no server-role leakage to `NEXT_PUBLIC_*`
  - guarded Bearer header behavior for Supabase keys
