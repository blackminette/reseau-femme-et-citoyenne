function firstForwardedValue(value: string | null): string | null {
  return value?.split(",")[0]?.trim() || null;
}

function configuredTrustedOrigin(): string | null {
  const configuredValue = process.env.MILO_TRUSTED_ORIGIN?.trim();

  if (!configuredValue) return null;

  try {
    return new URL(configuredValue).origin;
  } catch {
    return null;
  }
}

function requestOrigin(request: Request): string {
  const configuredOrigin = configuredTrustedOrigin();

  if (configuredOrigin) return configuredOrigin;

  const url = new URL(request.url);
  const host = request.headers.get("host")
    ?? url.host;
  const protocol = firstForwardedValue(request.headers.get("x-forwarded-proto"))
    ?? url.protocol.slice(0, -1);

  return new URL(`${protocol}://${host}`).origin;
}

// Browser requests include Origin. Reject a different explicit origin before
// authentication or any Gemini work. A configured origin keeps this check
// stable behind a reverse proxy without trusting a client-supplied host.
export function hasTrustedMiloRequestOrigin(request: Request): boolean {
  const origin = request.headers.get("origin");

  if (!origin) {
    return request.headers.get("sec-fetch-site") !== "cross-site";
  }

  try {
    return new URL(origin).origin === requestOrigin(request);
  } catch {
    return false;
  }
}
