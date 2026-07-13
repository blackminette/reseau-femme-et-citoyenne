import { NextResponse } from "next/server";

import { authenticateMiloChild } from "@/lib/milo/auth";
import { resolveMiloModuleContext } from "@/lib/milo/context";
import { buildMiloFallbackReply } from "@/lib/milo/fallback";
import { requestGeminiReply } from "@/lib/milo/gemini";
import { findMiloGuardrailReply } from "@/lib/milo/guardrails";
import { findMiloKnowledgeBaseAnswer } from "@/lib/milo/matching";
import { checkMiloRateLimit } from "@/lib/milo/rate-limit";
import { parseMiloChatRequest } from "@/lib/milo/request";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function json(body: Record<string, unknown>, status = 200, headers?: HeadersInit) {
  return NextResponse.json(body, {
    status,
    headers: { "Cache-Control": "no-store", ...headers },
  });
}

export async function POST(request: Request) {
  let body: unknown;

  try {
    body = await request.json();
  } catch {
    return json({ error: "La demande envoyee a Milo est invalide." }, 400);
  }

  const chatRequest = parseMiloChatRequest(body);

  if (!chatRequest) {
    return json({ error: "Ecris un message avant d'envoyer." }, 400);
  }

  const authentication = await authenticateMiloChild();

  if (authentication.status === "unauthenticated") {
    return json({ error: "Connexion requise pour utiliser Milo." }, 401);
  }

  if (authentication.status === "forbidden") {
    return json({ error: "Milo est reserve a l'espace enfant." }, 403);
  }

  if (authentication.status === "unavailable") {
    return json({ error: "Le service de connexion est indisponible. Reessaie plus tard." }, 503);
  }

  const rateLimit = checkMiloRateLimit(authentication.child.id);

  if (!rateLimit.allowed) {
    return json(
      { error: "Tu as envoye beaucoup de messages. Attends un petit instant avant de continuer." },
      429,
      { "Retry-After": String(rateLimit.retryAfterSeconds) },
    );
  }

  const currentModule = await resolveMiloModuleContext(chatRequest);
  const requestWithContext = { ...chatRequest, currentModule };

  const guardrailReply = findMiloGuardrailReply(requestWithContext.message);

  if (guardrailReply) {
    return json({ reply: guardrailReply, source: "guardrail" });
  }

  const knowledgeBaseMatch = findMiloKnowledgeBaseAnswer(
    requestWithContext.message,
    requestWithContext.currentModule,
  );

  if (knowledgeBaseMatch) {
    return json({
      reply: knowledgeBaseMatch.answer,
      source: "knowledge-base",
      match: knowledgeBaseMatch.source,
    });
  }

  try {
    const reply = await requestGeminiReply(requestWithContext, authentication.child.firstName);
    return json({ reply, source: "gemini" });
  } catch (error) {
    const status = error instanceof Error && "status" in error ? error.status : null;
    console.warn("[Milo] Gemini indisponible, reponse de secours utilisee.", { status });

    return json({
      reply: buildMiloFallbackReply({
        currentModule: requestWithContext.currentModule,
        currentQuestion: requestWithContext.currentQuestion?.text ?? null,
      }),
      degraded: true,
      source: "fallback",
    });
  }
}
