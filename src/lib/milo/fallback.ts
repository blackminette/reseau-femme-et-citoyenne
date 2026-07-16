const MODULE_LABELS: Record<string, string> = {
  lecture: "la lecture",
  numerique: "le numerique",
  robotique: "la robotique",
  anglais: "l'anglais",
  civique: "l'education civique",
  eco: "l'eco-citoyennete",
};

export function buildMiloFallbackReply({
  currentModule,
  currentQuestion,
}: {
  currentModule: string | null;
  currentQuestion: string | null;
}): string {
  const moduleLabel = currentModule
    ? MODULE_LABELS[currentModule] || "ton module"
    : "ton activite";
  const questionHint = currentQuestion
    ? ` Relis cette consigne : "${currentQuestion}".`
    : "";

  return `Je ne peux pas joindre Gemini pour le moment, mais je peux quand meme t'aider sur ${moduleLabel}.${questionHint} Commence par repérer les mots importants, puis elimine les reponses impossibles. Dis-moi ce qui te bloque exactement.`;
}
