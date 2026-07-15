import { prisma } from "@/lib/prisma";
import { getSupabaseServer } from "@/lib/supabase";

export type MiloChildIdentity = {
  id: string;
  firstName: string;
};

export type MiloAuthenticationResult =
  | { status: "authorized"; child: MiloChildIdentity }
  | { status: "unauthenticated" }
  | { status: "forbidden" }
  | { status: "unavailable" };

// Milo must never fall back to another child account. An unavailable identity
// provider is a service error, not an authorization success.
export async function authenticateMiloChild(): Promise<MiloAuthenticationResult> {
  try {
    const supabase = await getSupabaseServer();
    const {
      data: { user },
      error,
    } = await supabase.auth.getUser();

    if (error) {
      if (error.name === "AuthSessionMissingError") {
        return { status: "unauthenticated" };
      }

      console.error("[Milo] Impossible de verifier la session Supabase.");
      return { status: "unavailable" };
    }

    if (!user) return { status: "unauthenticated" };

    const profile = await prisma.utilisateur.findUnique({
      where: { id: user.id },
      select: { id: true, prenom: true, role: true },
    });

    if (!profile || profile.role !== "ENFANT") return { status: "forbidden" };

    return {
      status: "authorized",
      child: {
        id: profile.id,
        firstName: profile.prenom.trim().slice(0, 80) || "toi",
      },
    };
  } catch {
    console.error("[Milo] Service d'authentification indisponible.");
    return { status: "unavailable" };
  }
}
