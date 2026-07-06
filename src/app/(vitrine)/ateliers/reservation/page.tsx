import { prisma } from "@/lib/prisma"; 
import ReservationClient from "./reservationClient";
import { getSupabaseServer } from "@/lib/supabase"; // Ton utilitaire Supabase

export const revalidate = 0; 

export default async function ReservationPage() {
  const supabase = await getSupabaseServer();
  const { data: { session } } = await supabase.auth.getSession();
  
  let utilisateur = null;
  if (session?.user?.id) {
    // On récupère l'utilisateur en BDD (PostgreSQL) via Prisma
    utilisateur = await prisma.utilisateur.findUnique({
      where: { id: session.user.id }, // Vérifie bien que ton ID Supabase correspond à ton ID Prisma
      include: { enfants: true } 
    });
  }

  const ateliersBdd = await prisma.atelier.findMany({
    include: { reservations: true },
    orderBy: { dateDebut: 'asc' },
  });

  return <ReservationClient initialAteliers={ateliersBdd} user={utilisateur} />;
}