// * src/app/(app-avec-header)/(dashboard)/admin/ateliers/actions.ts
'use server'

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function listerAteliers() {
    try {
        const ateliers = await prisma.atelier.findMany();
        return { success: true, data: ateliers }
    } catch (error) {
        return { success: false, error: "Impossible de charger le calendrier" };
    }
}

export async function sauvegarderAteliers(data: { id?: string; title: string; start: Date; end: Date; description?: string }) {
    try {
        const donneesAtelier = {
            titre: data.title,
            description: data.description || null,
            dateDebut: data.start,
            dateFin: data.end,
        };

        if (data.id) {
            const idNumerique = Number(data.id);
            await prisma.atelier.update({
                where: { id: idNumerique },
                data: donneesAtelier
            });
        } else {
            await prisma.atelier.create({
                data: donneesAtelier as any
            });
        }

        revalidatePath('/admin/ateliers');
        return { success: true };
    } catch (error) {
        console.error("Erreur Prisma :", error);
        return { success: false, error: "Erreur d'enregistrement" };
    }
}

export async function supprimerAteliers(id: string) {
    try {
        const idNumerique = Number(id);
        await prisma.atelier.delete({ where: { id: idNumerique } });
        revalidatePath('/admin/ateliers');
        return { success: true };
    } catch (error) {
        return { success: false, error: "Erreur de suppression" };
    }
}
