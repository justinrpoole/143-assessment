# Beta Launch Checklist — 143 Leadership

## Environment Variables

- [ ] `BETA_FREE_MODE=true` — bypasses all payment gates
- [ ] `ADMIN_USER_IDS` — comma-separated UUIDs for admin audit access
- [ ] `NEXT_PUBLIC_SUPABASE_URL` — Supabase project URL
- [ ] `NEXT_PUBLIC_SUPABASE_ANON_KEY` — Supabase anon key
- [ ] `SUPABASE_SERVICE_ROLE_KEY` — Supabase service role (server-only)
- [ ] `HMAC_SECRET` — magic link signing secret (min 32 chars)
- [ ] `SITE_URL` — production URL for magic link emails
- [ ] `SMTP_*` — email delivery credentials (magic link, notifications)
- [ ] Stripe keys can remain but are inactive when `BETA_FREE_MODE=true`

## Database

- [ ] All migrations applied (check `supabase/migrations/` directory)
- [ ] `signature_pairs` table exists (migration 015)
- [ ] `assessment_runs` table has `status` column with correct enum values
- [ ] Row-level security policies enabled on all user-facing tables
- [ ] Test: create a run, complete it, verify signature pair is generated

## Auth Flow

- [ ] Magic link send works (test with a real email)
- [ ] Magic link verify works (click link, lands on portal)
- [ ] Session persists across page navigations
- [ ] Sign-out clears session and redirects to home
- [ ] Expired magic link shows clear error message

## Assessment Flow

- [ ] Assessment setup page renders with context selector
- [ ] Instructions page renders before questions begin
- [ ] All 143 questions load and render correctly
- [ ] Autosave works (answer a question, close browser, return, answer preserved)
- [ ] Progress bar shows correct count (X of 143)
- [ ] Assessment completes and triggers scoring
- [ ] Results page renders all sections (Light Signature, Eclipse, Rise Path, etc.)
- [ ] Results persist — return days later and see same report

## Scoring

- [ ] Run `npm run qa:stability` — all 40 fixtures pass
- [ ] Run `npm run qa:audit` — all 10 signature tests pass
- [ ] Run `npm run qa:score` — all fixtures pass with state invariance
- [ ] Scoring is deterministic: same inputs produce same outputs 3x
- [ ] Signature pairs generated and stored for every completed run

## Design / UX

- [ ] All pages use `cosmic-page-bg` — no white/light backgrounds
- [ ] All cards use `glass-card` styling
- [ ] All buttons use `btn-primary` (gold) or `btn-watch` (purple glass)
- [ ] Scroll-triggered FadeInSection animations working on results and portal
- [ ] Mobile responsive — test on iPhone Safari, Android Chrome
- [ ] `prefers-reduced-motion` respected — animations disabled when set

## Content

- [ ] Coaching page shows 10-week Light Activation Program (no certification content)
- [ ] Glossary page has all metric definitions
- [ ] Metric tooltips working on results page (hover/tap shows explanation)
- [ ] Assessment instructions are clear and accurate

## Admin

- [ ] `/admin/audit` accessible only to ADMIN_USER_IDS
- [ ] Audit dashboard shows completed runs, signature pairs, stats
- [ ] Non-admin users get redirected to home

## Monitoring

- [ ] Vercel deployment working (or target host)
- [ ] Error monitoring configured (Vercel logs or Sentry)
- [ ] Analytics events firing (page views, assessment start/complete)

## Rollback Plan

- [ ] To disable beta: set `BETA_FREE_MODE=false` and redeploy
- [ ] To revert code: `git revert` to last known-good commit
- [ ] Database: no destructive migrations — all additive

## Go / No-Go

- [ ] All QA scripts pass (`npm run qa:all`)
- [ ] Build succeeds (`npm run build`)
- [ ] Manual walkthrough: sign up → assess → results → portal → sign out → return
- [ ] At least one non-developer has completed the full flow
