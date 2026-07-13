function firstForwardedValue(value: string | null): string | null {
  return value?.split(",")[0]?.trim() || null;
}

function requestOrigin(request: Request): string {
  const url = new URL(request.url);
  const host = firstForwardedValue(request.headers.get("x-forwarded-host"))
    ?? request.headers.get("host")
    ?? url.host;
  const protocol = firstForwardedValue(request.headers.get("x-forwarded-proto"))
    ?? url.protocol.slice(0, -1);

  return new URL(`${protocol}://${host}`).origin;
}

// Browser requests include Origin. Reject a different explicit origin before
// authentication or any Gemini work; server-side callers may not send one.
export function hasTrustedMiloRequestOrigin(request: Request): boolean {
  const origin = request.headers.get("origin");

  if (!origin) return true;

  try {
    return new URL(origin).origin === requestOrigin(request);
  } catch {
    return false;
  }
}
