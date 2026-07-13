import { MILO_MODULES, type MiloModule } from "@/lib/milo/context";

const ALLOWED_MODULES = new Set<string>(MILO_MODULES);

export type MiloMessage = {
  role: "user" | "assistant";
  content: string;
};

export type MiloQuestionContext = {
  text: string;
  choices: string[];
};

export type MiloActivityContext = {
  kind: "lesson" | "exercise";
  title: string;
  excerpts: string[];
};

export type MiloChatRequest = {
  message: string;
  history: MiloMessage[];
  currentModule: MiloModule | null;
  moduleReference: string | null;
  activityReference: string | null;
  currentQuestion: MiloQuestionContext | null;
  activityContext: MiloActivityContext | null;
};

function asTrimmedString(value: unknown, maximumLength: number): string {
  return typeof value === "string" ? value.trim().slice(0, maximumLength) : "";
}

export function parseMiloChatRequest(body: unknown): MiloChatRequest | null {
  if (!body || typeof body !== "object") return null;

  const input = body as Record<string, unknown>;
  const message = asTrimmedString(input.message, 800);

  if (!message) return null;

  const currentModule = asTrimmedString(input.currentModule, 32);
  const moduleReference = asTrimmedString(input.moduleReference, 32);
  const activityReference = asTrimmedString(input.activityReference, 32);
  const history = Array.isArray(input.history)
    ? input.history
        .slice(-8)
        .flatMap((entry): MiloMessage[] => {
          if (!entry || typeof entry !== "object") return [];
          const candidate = entry as Record<string, unknown>;
          const role = candidate.role;
          const content = asTrimmedString(candidate.content, 500);

          return (role === "user" || role === "assistant") && content
            ? [{ role, content }]
            : [];
        })
    : [];

  const question = input.currentQuestion;
  const currentQuestion = question && typeof question === "object"
    ? (() => {
        const candidate = question as Record<string, unknown>;
        const text = asTrimmedString(candidate.text, 500);
        const choices = Array.isArray(candidate.choices)
          ? candidate.choices
              .slice(0, 6)
              .map((choice) => asTrimmedString(choice, 180))
              .filter(Boolean)
          : [];

        return text ? { text, choices } : null;
      })()
    : null;

  return {
    message,
    history,
    currentModule: ALLOWED_MODULES.has(currentModule)
      ? (currentModule as MiloModule)
      : null,
    moduleReference: moduleReference || null,
    activityReference: activityReference || null,
    currentQuestion,
    // This field is resolved on the server from published child content only.
    activityContext: null,
  };
}
