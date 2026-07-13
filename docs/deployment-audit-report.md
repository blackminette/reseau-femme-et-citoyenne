# Milo runtime audit report

## Scope

This report covers Milo only in the Next.js application. It does not validate
other modules, deployment hosting, DNS or production credentials.

## Verified implementation

- `src/app/api/ai-chat/route.ts` is the active Next server route for chat.
- `src/lib/milo/auth.ts` validates the Supabase user and requires a Prisma profile
  with role `ENFANT`; it never falls back to another child account.
- `src/lib/milo/context.ts` resolves the published child parcours from the module
  or activity route reference before selecting a module-specific answer.
- `src/lib/milo/matching.ts` checks Wael's local library first, with exact and
  typo-tolerant matching protected against cross-module false positives.
- `src/lib/milo/gemini.ts` uses the private `GEMINI_API_KEY` server-side only.
- Gemini failure returns a pedagogical fallback rather than crashing the widget.
- `src/app/(dashboard-enfant)/layout.tsx` loads the widget for the child area.
- `public/assistant.html` continues to provide standalone access.

## Validation evidence

- `npm ci` completed from the committed lockfile.
- `npx tsx tests/milo-runtime.test.ts` passed.
- `npx eslint src/lib/milo src/app/api/ai-chat tests/milo-runtime.test.ts` passed.
- `git diff --check` passed.
- `next build` compiled Milo successfully, then stopped on existing app pages
  requiring a reachable PostgreSQL database during static pre-rendering.

## Remaining gates

- A browser test requires a real child session and valid Supabase configuration.
- A Gemini success-path test requires a controlled server-side key.
- The full production build requires the real database reachable by pages outside
  Milo. This is an integration blocker, not a Milo route compilation failure.
- Long-term revision memory is intentionally not persisted until the team validates
  a shared data model and access rules.
