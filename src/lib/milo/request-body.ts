export const MAX_MILO_REQUEST_BYTES = 16_000;

export type MiloRequestBodyResult =
  | { body: unknown }
  | { error: "invalid" | "too-large" };

function invalidBody(): MiloRequestBodyResult {
  return { error: "invalid" };
}

function tooLargeBody(): MiloRequestBodyResult {
  return { error: "too-large" };
}

// Read the stream with a hard byte cap. Content-Length is only an early reject:
// clients may omit it or send an incorrect value.
export async function readMiloRequestBody(request: Request): Promise<MiloRequestBodyResult> {
  const contentLength = Number(request.headers.get("content-length"));

  if (Number.isFinite(contentLength) && contentLength > MAX_MILO_REQUEST_BYTES) {
    return tooLargeBody();
  }

  if (!request.body) return invalidBody();

  const reader = request.body.getReader();
  const chunks: Uint8Array[] = [];
  let size = 0;

  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      size += value.byteLength;
      if (size > MAX_MILO_REQUEST_BYTES) {
        await reader.cancel();
        return tooLargeBody();
      }

      chunks.push(value);
    }
  } catch {
    return invalidBody();
  }

  const bytes = new Uint8Array(size);
  let offset = 0;

  for (const chunk of chunks) {
    bytes.set(chunk, offset);
    offset += chunk.byteLength;
  }

  try {
    return { body: JSON.parse(new TextDecoder().decode(bytes)) };
  } catch {
    return invalidBody();
  }
}
