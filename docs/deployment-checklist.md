# Deployment checklist

Project scope for this audit:
- Milo backend and assistant widget in this repository.
- No deployment action.
- No secret inspection or modification.
- No DNS change.

## 1. Repository state

- [ ] `git branch --show-current` is a dedicated branch for this work.
- [ ] `git status --short --branch --untracked-files=all` is understood before any change.
- [ ] Only the intended files are modified.
- [ ] No secret file is changed.
- [ ] No unrelated module is touched.

## 2. Milo backend

- [ ] `server/routes/ai-chat.js` exists.
- [ ] `server/routes/ai-chat.js` exposes `POST /api/ai-chat`.
- [ ] `server/routes/ai-chat.js` reads `GEMINI_API_KEY`.
- [ ] `server/routes/ai-chat.js` reads `GEMINI_MODEL`.
- [ ] `server/routes/ai-chat.js` fails safely if the key is missing.
- [ ] `server/routes/ai-chat.js` keeps the child persona and module context logic coherent.
- [ ] `server/ai-chat-utils.js` is present and imported correctly.

## 3. Front assistant

- [ ] `public/ai-widget.js` exists.
- [ ] `public/ai-widget.js` calls `/api/ai-chat`.
- [ ] `public/ai-widget.js` can run in floating mode.
- [ ] `public/ai-widget.js` can run in standalone mode.
- [ ] `public/assistant.html` loads `public/ai-widget.js`.
- [ ] `public/assistant.html` opens correctly without extra app code.
- [ ] The widget handles empty or invalid session history without crashing.

## 4. Milo documentation

- [ ] `docs/ia-milo.md` matches the current runtime behavior.
- [ ] The document explains the backend / front / history split clearly.
- [ ] The document stays aligned with the current route names and widget behavior.

## 5. Deployment readiness

- [ ] Gemini API key is available in the deployment environment.
- [ ] Gemini model value is defined.
- [ ] The deployment target supports the backend process required by the assistant.
- [ ] Static files are served correctly.
- [ ] `/assistant.html` is reachable in the final environment.
- [ ] `/api/ai-chat` responds in the final environment.
- [ ] Logs are readable in case of AI failures.

## 6. Napoleonic module audit status

Important fact:
- The current repository does **not** contain the Napoleonic module source files under `src/`.
- Therefore, this repository cannot be used to audit or modify the Napoleonic page code directly.

If the Napoleonic module lives in another repository or another workspace copy, audit that copy separately before deployment:
- [ ] verify `/enfant/modules/napoleon`;
- [ ] verify lesson routing;
- [ ] verify exercise routing;
- [ ] verify image assets;
- [ ] verify that lesson content is unique;
- [ ] verify that no unrelated module is modified.

## 7. Final gate before publish

- [ ] Local tests passed.
- [ ] Browser verification done.
- [ ] No console error remains.
- [ ] No secret is exposed.
- [ ] No extra branch is left unreviewed.
- [ ] Human validation completed before any publish.
