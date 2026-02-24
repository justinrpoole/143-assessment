# Build Decisions — Full Remap + Customer Experience Build

## Audit Pass 1 Summary

### Route Inventory
48 page routes found under `src/app/`. No SITEMAP.md existed — decisions based on actual route inventory.

### Global Layout
- Root layout: `src/app/layout.tsx` wraps all pages with `<MarketingNav />` and `<SiteFooter />`
- Nav config: `src/lib/nav/nav-config.ts` (single source of truth for all links)
- Footer: `src/components/SiteFooter.tsx` (reads from nav config automatically)

### Auth Implementation
- Location: `src/lib/auth/` (magic-link tokens, user state, request context)
- Middleware: `src/middleware.ts` (cookie-based gating on protected routes)
- User states: `public`, `free_email`, `paid_43`, `sub_active`, `sub_canceled`, `past_due`
- Google OAuth: not implemented (magic link only)

### Stripe Integration
- Checkout: `src/app/api/stripe/checkout/route.ts`
- Webhooks: `src/app/api/stripe/webhook/route.ts`
- Price IDs: `STRIPE_PRICE_PAID_43` ($43 one-time), `STRIPE_PRICE_SUB_1433` ($14.33/mo)
- Customer portal: `src/app/api/stripe/portal/route.ts`

---

## Decisions

### 1. Redirect Strategy
**Decision:** Use `next.config.ts` permanent redirects (HTTP 308).
**Why:** Centralized, fast (handled before page rendering), no middleware complexity. Old page directories kept in place — redirects take priority, cleanup deferred to a separate PR.

### 2. Assessment Gating
**Decision:** Ungate `/assessment` landing page only. Keep `/assessment/instructions`, `/assessment/setup`, `/results`, `/reports` gated.
**Why:** Users can read about the assessment without logging in (reduces friction, increases interest). Full loginless flow (answering questions without auth) requires anonymous session support in the API layer — deferred to follow-up.

### 3. Canonical Coaching Page
**Decision:** Use existing `/coaches` route.
**Why:** Already has the 10-week program breakdown. Updated with $143/week pricing.

### 4. Offer Naming
**Decision:** Standardize across all pages:
- **Gravitational Stability Report** — $43 one-time (was "The 143 Assessment")
- **Portal Membership** — $14.33/month (was "The Coaching OS")
- **10-Week Coaching** — $143/week for 10 weeks ($1,430 total), Portal included
**Why:** Matches current positioning and avoids confusion between the assessment instrument and the report it produces.

### 5. Concept Pages
**Decision:** `/watch-me`, `/go-first`, `/be-the-light` are public teaching-only pages. No interactive tool flows. Interactive versions live inside Portal behind paywall.
**Why:** Public pages create recognition and drive assessment sign-ups. Paid interactive flows remain behind Portal entitlement.

### 6. Coaching Stripe Checkout
**Decision:** Link-only for now. Coaching CTA links to `/coaches` info page. No Stripe checkout wired.
**When ready:** Create `STRIPE_PRICE_COACHING_143` in Stripe dashboard, then add `coaching_143` mode to `src/app/api/stripe/checkout/route.ts` and `src/components/billing/UpgradeCheckoutClient.tsx`.

### 7. Google OAuth
**Decision:** Out of scope. Magic link login only. "Save your map" gate at results uses magic link.
**Follow-up:** Implement Supabase Google OAuth provider when ready.

### 8. Drift Pages
**Decision:** `/archetypes` and `/quiz` get `robots: noindex, nofollow` metadata. Copy repositioned (Light Signatures, Light Check). Not deleted — may be useful for SEO long-tail later.

### 9. Report Paywall
**Decision:** `/reports` page now checks `user_state` for `paid_43`, `sub_active`, `sub_canceled`, or `past_due` before rendering. Non-paid users are redirected to `/upgrade`.
**Why:** Middleware only checks authentication (any logged-in user), not payment status. Without this check, a `free_email` user with a guessed `run_id` could access the full report.

### 10. Stripe Coaching Tier (Future)
**Status:** Not wired. CTA on `/pricing` and `/coaches` links to `/coaches` info page only.
**When ready to wire checkout:**

1. Create `STRIPE_PRICE_COACHING_143` in Stripe dashboard ($143/week recurring, 10-week limit)
2. Add `coaching_143` mode to `src/app/api/stripe/checkout/route.ts` (follow `paid_43`/`subscription` pattern)
3. Add `coaching_143` button to `src/components/billing/UpgradeCheckoutClient.tsx`
4. Add `coaching_active` to the `CANONICAL_USER_STATES` set in `src/middleware.ts`
5. Handle `coaching_active` in `src/lib/auth/user-state.ts` state resolution

### 11. Weekly Scan Rename
**Decision:** "Weekly Review" renamed to "Weekly Scan" across the app (page title, metadata, ContextualActions label).
**Why:** "Scan" implies a quick snapshot read; "Review" implies evaluating performance. The tool shows patterns, not grades.

### 12. Portal Priority Actions
**Decision:** A "Today" card with 3 priority actions added to all three PortalDashboard render paths (high eclipse, no completed run, full dashboard).
**Actions:** Capture a moment (→ /reps), Take a small step (→ /watch-me), Daily Debrief (→ /reflect).
**Why:** Gives every user a clear first action when they open the portal, regardless of their state.
