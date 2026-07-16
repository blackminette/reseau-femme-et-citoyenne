import { NextResponse } from "next/server";

import { authenticateMiloChild } from "@/lib/milo/auth";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST() {
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

  return new NextResponse(null, { status: 204 });
}
