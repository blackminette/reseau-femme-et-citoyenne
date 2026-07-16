import { miloKnowledgeBase, type MiloKnowledgeBaseEntry } from "@/lib/milo/knowledge-base";

export type MiloKnowledgeBaseMatch = Pick<
  MiloKnowledgeBaseEntry,
  "answer" | "label"
> & {
  source: "exact" | "fuzzy";
};

export function normalizeMiloText(value: string): string {
  return value
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

export function normalizeKidLanguage(value: string): string {
  let normalized = ` ${normalizeMiloText(value)} `;

  normalized = normalized
    .replace(/ ko[ia] /g, " quoi ")
    .replace(/ ki /g, " qui ")
    .replace(/ (koman|komen|comen) /g, " comment ")
    .replace(/ (pk|pkoi|pq|pourkoi|pourkoa) /g, " pourquoi ")
    .replace(/ (keske|kesske|kes ke) /g, " qu est ce que ")
    .replace(/ (c|ce|s|se|cet|cest) quoi /g, " c est quoi ")
    .replace(/ (sa|ca) (ve|veu) /g, " ca veut ")
    .replace(/ dir /g, " dire ");

  return normalized.replace(/\s+/g, " ").trim();
}

function approximateSubstringDistance(text: string, pattern: string): number {
  const textLength = text.length;
  const patternLength = pattern.length;

  if (patternLength === 0) return 0;

  let previous = new Array<number>(textLength + 1).fill(0);

  for (let patternIndex = 1; patternIndex <= patternLength; patternIndex += 1) {
    const current = new Array<number>(textLength + 1);
    current[0] = patternIndex;

    for (let textIndex = 1; textIndex <= textLength; textIndex += 1) {
      const cost = pattern[patternIndex - 1] === text[textIndex - 1] ? 0 : 1;
      current[textIndex] = Math.min(
        previous[textIndex] + 1,
        current[textIndex - 1] + 1,
        previous[textIndex - 1] + cost,
      );
    }

    previous = current;
  }

  return Math.min(...previous);
}

function levenshteinDistance(left: string, right: string): number {
  let previous = Array.from({ length: right.length + 1 }, (_, index) => index);

  for (let leftIndex = 1; leftIndex <= left.length; leftIndex += 1) {
    const current = [leftIndex];

    for (let rightIndex = 1; rightIndex <= right.length; rightIndex += 1) {
      const cost = left[leftIndex - 1] === right[rightIndex - 1] ? 0 : 1;
      current[rightIndex] = Math.min(
        current[rightIndex - 1] + 1,
        previous[rightIndex] + 1,
        previous[rightIndex - 1] + cost,
      );
    }

    previous = current;
  }

  return previous[right.length];
}

function hasFuzzyContentWordMatch(message: string, trigger: string): boolean {
  const messageWords = message.split(" ");
  const triggerWords = trigger.split(" ").filter((word) => word.length >= 5);

  return triggerWords.some((triggerWord) => {
    const allowedDistance = Math.max(1, Math.floor(triggerWord.length * 0.25));

    return messageWords.some(
      (messageWord) =>
        messageWord.length >= 5 &&
        levenshteinDistance(messageWord, triggerWord) <= allowedDistance,
    );
  });
}

export function findMiloKnowledgeBaseAnswer(
  message: string,
  currentModule: string | null,
): MiloKnowledgeBaseMatch | null {
  const normalizedMessage = normalizeKidLanguage(message);

  if (normalizedMessage.length < 3) return null;

  const entries = miloKnowledgeBase.filter(
    (entry) => entry.module === null || entry.module === currentModule,
  );

  let exactMatch: MiloKnowledgeBaseEntry | null = null;
  let exactLength = 0;

  for (const entry of entries) {
    for (const keyword of entry.keywords.split("|")) {
      const normalizedKeyword = normalizeKidLanguage(keyword);

      if (
        normalizedKeyword.length >= 4 &&
        normalizedMessage.includes(normalizedKeyword) &&
        normalizedKeyword.length > exactLength
      ) {
        exactMatch = entry;
        exactLength = normalizedKeyword.length;
      }
    }
  }

  if (exactMatch) {
    return {
      answer: exactMatch.answer,
      label: exactMatch.label,
      source: "exact",
    };
  }

  let fuzzyMatch: MiloKnowledgeBaseEntry | null = null;
  let fuzzyScore = Number.POSITIVE_INFINITY;

  for (const entry of entries) {
    for (const keyword of entry.keywords.split("|")) {
      const normalizedKeyword = normalizeKidLanguage(keyword);

      if (normalizedKeyword.length < 8) continue;

      if (!hasFuzzyContentWordMatch(normalizedMessage, normalizedKeyword)) {
        continue;
      }

      const distance = approximateSubstringDistance(
        normalizedMessage,
        normalizedKeyword,
      );
      const allowedDistance = Math.max(2, Math.floor(normalizedKeyword.length * 0.2));

      if (distance <= allowedDistance) {
        const score = distance / normalizedKeyword.length - normalizedKeyword.length / 1000;

        if (score < fuzzyScore) {
          fuzzyMatch = entry;
          fuzzyScore = score;
        }
      }
    }
  }

  if (!fuzzyMatch) return null;

  return {
    answer: fuzzyMatch.answer,
    label: fuzzyMatch.label,
    source: "fuzzy",
  };
}
