import { normalizeMiloText } from "@/lib/milo/matching";

const ANSWER_REQUEST =
  /(?:donne|dis) moi (?:directement )?la (bonne )?reponse|c est quoi la (bonne )?reponse|quelle est la (bonne )?reponse|donne la solution|choisis pour moi|reponds?(?: juste| seulement)?(?: par)? [a-d]\b|\b[a-d]\s+ou\s+[a-d]\b/i;

const ABUSIVE_LANGUAGE = /\b(idiot|debile|nul|ferme ta gueule|ta gueule|connard)\b/i;

export function findMiloGuardrailReply(message: string): string | null {
  const normalizedMessage = normalizeMiloText(message);

  if (ANSWER_REQUEST.test(normalizedMessage)) {
    return "Je ne te donne pas directement la reponse, sinon tu ne pourrais pas apprendre. Donne-moi la consigne ou les choix et je te donne un indice pour la trouver toi-meme.";
  }

  if (ABUSIVE_LANGUAGE.test(normalizedMessage)) {
    return "Je suis la pour t'aider. On peut reprendre calmement : explique-moi ce qui te bloque et je te donne un indice.";
  }

  return null;
}
