import type { MiloChatRequest } from "@/lib/milo/request";

type GeminiResponse = {
  candidates?: Array<{
    content?: {
      parts?: Array<{ text?: string }>;
    };
  }>;
};

export class GeminiRequestError extends Error {
  constructor(
    message: string,
    public readonly status: number | null,
  ) {
    super(message);
  }
}

function escapePromptValue(value: string): string {
  return value
    .replace(/[\u0000-\u001F\u007F<>`]/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, 500);
}

export function redactMiloTextForGemini(value: string): string {
  return value
    .replace(/\b[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}\b/gi, "[adresse e-mail masquee]")
    .replace(/(?:\+33|0)(?:[ .-]?\d){9}\b/g, "[numero de telephone masque]")
    .replace(
      /\b(?:mot de passe|password)\b\s*(?:=|:)\s*[^\s,;!?]+/gi,
      "mot de passe [masque]",
    );
}

function buildSystemInstruction(
  request: MiloChatRequest,
  firstName: string,
): string {
  const moduleContext = request.currentModule
    ? `Le module actuel est: ${request.currentModule}.`
    : "Le module actuel n'est pas identifie.";
  const questionContext = request.currentQuestion
    ? `Question affichee: ${escapePromptValue(request.currentQuestion.text)}\nChoix proposes: ${request.currentQuestion.choices.map(escapePromptValue).join(" | ")}`
    : "Aucune question ecran n'est fournie.";

  return [
    "Tu es Milo, un assistant pedagogique francophone pour enfants.",
    `Tu parles a ${escapePromptValue(firstName)}.`,
    "Tu aides par petites etapes, avec un ton clair, calme et encourageant.",
    "Tu ne donnes jamais directement la bonne reponse d'un quiz ou d'un exercice.",
    "Tu n'inventes pas de faits. Si la question manque de contexte, demande la consigne exacte.",
    "Tu ne demandes jamais de nom complet, adresse, email, mot de passe ou autre donnee personnelle.",
    "Reponds en francais, en moins de 120 mots, avec au plus trois etapes.",
    moduleContext,
    questionContext,
  ].join("\n");
}

function readGeminiReply(payload: unknown): string | null {
  if (!payload || typeof payload !== "object") return null;

  const candidate = (payload as GeminiResponse).candidates?.[0];
  const parts = candidate?.content?.parts;

  if (!parts) return null;

  return parts
    .map((part) => (typeof part.text === "string" ? part.text : ""))
    .join("")
    .trim()
    .slice(0, 1800) || null;
}

function resolveModelName(): string {
  const configuredModel = process.env.GEMINI_MODEL?.trim();

  return configuredModel && /^[a-zA-Z0-9._-]{1,80}$/.test(configuredModel)
    ? configuredModel
    : "gemini-2.0-flash";
}

export async function requestGeminiReply(
  request: MiloChatRequest,
  firstName: string,
): Promise<string> {
  const apiKey = process.env.GEMINI_API_KEY?.trim();

  if (!apiKey) {
    throw new GeminiRequestError("Gemini n'est pas configure.", null);
  }

  const model = resolveModelName();
  const messages = [...request.history, { role: "user" as const, content: request.message }];
  const contents = messages.map((message) => ({
    role: message.role === "assistant" ? "model" : "user",
    parts: [{ text: redactMiloTextForGemini(message.content) }],
  }));

  let response: Response;

  try {
    response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${encodeURIComponent(apiKey)}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          systemInstruction: {
            parts: [{ text: buildSystemInstruction(request, firstName) }],
          },
          contents,
          generationConfig: {
            temperature: 0.3,
            maxOutputTokens: 350,
          },
        }),
        signal: AbortSignal.timeout(15_000),
        cache: "no-store",
      },
    );
  } catch (error) {
    const message = error instanceof Error ? error.message : "Erreur reseau Gemini.";
    throw new GeminiRequestError(message, null);
  }

  if (!response.ok) {
    throw new GeminiRequestError(`Gemini a repondu ${response.status}.`, response.status);
  }

  const reply = readGeminiReply(await response.json());

  if (!reply) {
    throw new GeminiRequestError("Gemini n'a pas renvoye de reponse exploitable.", response.status);
  }

  return reply;
}
