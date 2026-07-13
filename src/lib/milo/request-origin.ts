// Browser requests include Origin. Reject a different explicit origin before
// authentication or any Gemini work; server-side callers may not send one.
export function hasTrustedMiloRequestOrigin(request: Request): boolean {
  const origin = request.headers.get("origin");

  if (!origin) return true;

  try {
    return new URL(origin).origin === new URL(request.url).origin;
  } catch {
    return false;
  }
}
