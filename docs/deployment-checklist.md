# Milo deployment checklist

Scope: assistant Milo only. No deployment, DNS, email or secret modification is
performed by this checklist.

## Repository

- [ ] Dedicated branch based on the current integration branch.
- [ ] `git status --short --branch --untracked-files=all` is understood.
- [ ] Only Milo files are staged.
- [ ] No `.env`, key, token, log or local database is staged.

## Next runtime

- [ ] `src/app/api/ai-chat/route.ts` exists and handles `POST /api/ai-chat`.
- [ ] The route checks Supabase session and Prisma role `ENFANT`.
- [ ] The route fails closed when identity services are unavailable.
- [ ] The route resolves the published child parcours from the route activity or module reference.
- [ ] The route uses only safe excerpts from published course/exercise JSON and excludes answer options and correct answers.
- [ ] `GEMINI_API_KEY` stays server-side.
- [ ] Missing key, timeout and Gemini rate limit return a safe fallback.
- [ ] The local answer library is queried before Gemini.
- [ ] The widget is loaded by `src/app/(dashboard-enfant)/layout.tsx`.

## Frontend behavior

- [ ] `/assistant.html` redirects to the protected `/enfant/assistant` route.
- [ ] A child page renders the floating Milo button.
- [ ] A known question returns a library answer.
- [ ] An unknown question reaches Gemini when configured.
- [ ] Empty and invalid `sessionStorage` do not crash the widget.
- [ ] The revision compatibility endpoints do not return 404.

## Deployment environment

- [ ] The target runs Next.js server-side routes, not static files only.
- [ ] `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY` and `DATABASE_URL` are configured.
- [ ] `GEMINI_API_KEY` is configured as a private server variable.
- [ ] `GEMINI_MODEL` is configured or the documented default is accepted.
- [ ] `/enfant/assistant` and `/api/ai-chat` are reachable on the target.
- [ ] Logs can be consulted without exposing secrets or child data.

## Final gate

- [ ] Unit tests pass.
- [ ] ESLint passes for Milo files.
- [ ] `git diff --check` passes.
- [ ] Build result is documented, including unrelated blockers if any.
- [ ] Browser test uses a real child session and a controlled Gemini key.
- [ ] Human validation is recorded before deployment.
