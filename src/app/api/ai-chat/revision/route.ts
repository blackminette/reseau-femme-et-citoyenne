import { NextResponse } from "next/server";

import { authenticateMiloChild } from "@/lib/milo/auth";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  const authentication = await authenticateMiloChild();

  if (authentication.status === "unauthenticated") {
    return NextResponse.json({ error: "Connexion requise pour utiliser Milo." }, { status: 401 });
  }

  if (authentication.status === "forbidden") {
    return NextResponse.json({ error: "Milo est reserve a l'espace enfant." }, { status: 403 });
  }

  if (authentication.status === "unavailable") {
    return NextResponse.json({ error: "Le service de connexion est indisponible." }, { status: 503 });
  }

  // The widget keeps its short-term learning state in sessionStorage. A shared,
  // long-term revision history requires a validated database model before use.
  return NextResponse.json(
    { revision: null },
    { headers: { "Cache-Control": "no-store" } },
  );
}
