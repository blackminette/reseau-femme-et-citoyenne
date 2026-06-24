'use server';

import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';

export type ActualiteFormatee = {
    id: string;
    titre: string;
    tag: string;
    datePublication: string;
    extrait: string;
    ctaLabel: string;
    ctaHref: string;
    ordre: number;
    estPublic: boolean;
};

export type ActualiteFormData = {
    id?: string;
    titre: string;
    tag: string;
    datePublication: string;
    extrait: string;
    ctaLabel: string;
    ctaHref: string;
    ordre: string;
    estPublic: boolean;
};

export async function listerActualites() {
    try {
        const actualites = await prisma.actualite.findMany({
            orderBy: [{ ordre: 'asc' }, { datePublication: 'desc' }],
        });

        const data: ActualiteFormatee[] = actualites.map((actualite) => ({
            id: actualite.id.toString(),
            titre: actualite.titre,
            tag: actualite.tag,
            datePublication: actualite.datePublication.toISOString().slice(0, 10),
            extrait: actualite.extrait,
            ctaLabel: actualite.ctaLabel,
            ctaHref: actualite.ctaHref,
            ordre: actualite.ordre,
            estPublic: actualite.estPublic,
        }));

        return { success: true, data };
    } catch (error) {
        console.error('Erreur lors du chargement des actualités :', error);
        return { success: false, data: null, error: 'Impossible de charger les actualités.' };
    }
}

export async function sauvegarderActualite(form: ActualiteFormData) {
    try {
        const donnees = {
            titre: form.titre.trim(),
            tag: form.tag.trim().toUpperCase(),
            datePublication: new Date(form.datePublication),
            extrait: form.extrait.trim(),
            ctaLabel: form.ctaLabel.trim() || 'Lire la suite',
            ctaHref: form.ctaHref.trim() || '/ateliers',
            ordre: Number.parseInt(form.ordre, 10) || 1,
            estPublic: form.estPublic,
        };

        if (!form.titre.trim()) {
            return { success: false, error: 'Le titre est obligatoire.' };
        }

        if (!form.datePublication || Number.isNaN(donnees.datePublication.getTime())) {
            return { success: false, error: 'La date de publication est invalide.' };
        }

        if (form.id) {
            const idNumerique = Number.parseInt(form.id, 10);
            if (Number.isNaN(idNumerique)) {
                return { success: false, error: 'L’identifiant de l’actualité est invalide.' };
            }

            await prisma.actualite.update({
                where: { id: idNumerique },
                data: donnees,
            });
        } else {
            await prisma.actualite.create({
                data: donnees,
            });
        }

        revalidatePath('/actualites');
        revalidatePath('/admin/blog');

        return { success: true };
    } catch (error) {
        console.error('Erreur lors de l’enregistrement de l’actualité :', error);
        return { success: false, error: 'Impossible d’enregistrer l’actualité.' };
    }
}

export async function supprimerActualite(id: string) {
    try {
        const idNumerique = Number.parseInt(id, 10);
        if (Number.isNaN(idNumerique)) {
            return { success: false, error: 'L’identifiant de l’actualité est invalide.' };
        }

        await prisma.actualite.delete({
            where: { id: idNumerique },
        });

        revalidatePath('/actualites');
        revalidatePath('/admin/blog');

        return { success: true };
    } catch (error) {
        console.error('Erreur lors de la suppression de l’actualité :', error);
        return { success: false, error: 'Impossible de supprimer l’actualité.' };
    }
}
