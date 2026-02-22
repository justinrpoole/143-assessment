## Summary

<!-- What changed and why? 1-3 bullet points. -->

## Type

- [ ] Feature (new functionality)
- [ ] Fix (bug fix)
- [ ] Refactor (no behavior change)
- [ ] Copy/Voice (content updates)
- [ ] Infra (build, deploy, CI)

## CLAUDE.md Checklist

- [ ] No banned words/phrases in user-facing copy
- [ ] No deficit framing or shame language
- [ ] Uses CSS custom properties (not hardcoded hex)
- [ ] `'use client'` added where hooks are used
- [ ] Animated components respect `useReducedMotion`
- [ ] New sections wrapped in `<FadeInSection>`
- [ ] Charts/instruments use `<RetroFrame>`
- [ ] API errors use `{ error: "code", message: "string" }` shape
- [ ] Imports use `@/` alias (no relative `../` across boundaries)
- [ ] Ran `npm run qa:tone` locally

## Test Plan

<!-- How did you verify this works? -->

## CLAUDE.md Updates

<!-- Did this PR reveal a new convention or pattern? If so, update CLAUDE.md in this PR. -->
- [ ] No CLAUDE.md update needed
- [ ] Updated CLAUDE.md with: ___
