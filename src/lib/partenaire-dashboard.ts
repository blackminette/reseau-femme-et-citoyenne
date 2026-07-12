import { cookies } from 'next/headers';
import { createServerClient } from '@supabase/ssr';
import { prisma } from '@/lib/prisma';
import { ClipboardList } from 'lucide-react';

type PartenaireConnecte = {
    id: string | null;
    organisation: string;
    contact: string;
    type: string;
    initiales: string;
};

function verifierVariablesSupabase() {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    if (!supabaseUrl || !supabaseAnonKey) {
        throw new Error(
            'Variables Supabase publiques manquantes pour lire la session partenaire.'
        );
    }

    return {
        supabaseUrl,
        supabaseAnonKey,
    };
}

export async function obtenirPartenaireConnecte(): Promise<PartenaireConnecte> {
    try {
        const { supabaseUrl, supabaseAnonKey } = verifierVariablesSupabase();
        const cookieStore = await cookies();

        const supabase = createServerClient(supabaseUrl, supabaseAnonKey, {
            cookies: {
                getAll() {
                    return cookieStore.getAll();
                },
                setAll(cookiesToSet) {
                    try {
                        cookiesToSet.forEach(({ name, value, options }) => {
                            cookieStore.set(name, value, options);
                        });
                    } catch {}
                },
            },
        });

        const {
            data: { user },
            error,
        } = await supabase.auth.getUser();

        if (error || !user) {
            return {
                id: null,
                organisation: 'Association Partenaire',
                contact: 'Partenaire',
                type: 'Organisme Social',
                initiales: 'AP',
            };
        }

        const utilisateur = await prisma.utilisateur.findUnique({
            where: { id: user.id },
        });

        if (!utilisateur) {
            return {
                id: user.id,
                organisation: 'Association Partenaire',
                contact: user.email ?? 'Partenaire',
                type: 'Organisme Social',
                initiales: 'AP',
            };
        }

        const initiales = `${utilisateur.prenom?.[0] || ''}${utilisateur.nom?.[0] || ''}`.toUpperCase() || 'AP';

        return {
            id: user.id,
            organisation: utilisateur.nom || 'Association Partenaire',
            contact: `${utilisateur.prenom} ${utilisateur.nom}`,
            type: utilisateur.role === 'PARTENAIRE' ? 'Partenaire Social' : 'Structure de quartier',
            initiales,
        };
    } catch {
        return {
            id: null,
            organisation: 'Association Partenaire',
            contact: 'Partenaire',
            type: 'Organisme Social',
            initiales: 'AP',
        };
    }
}

export async function obtenirDonneesPartenaire(partenaireId: string) {
    try {
        const ateliers = await prisma.atelier.findMany({
            where: { partenaireId },
            include: {
                lieu: true,
                reservations: true,
            },
            orderBy: { dateDebut: 'asc' },
        });

        const total = ateliers.length;
        const validees = ateliers.filter(a => a.creneauVerrouille).length;
        const enAttente = total - validees;

        const mappedAteliers = ateliers.map(a => {
            const dateStr = a.dateDebut.toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long' });
            const capitalizedDate = dateStr.charAt(0).toUpperCase() + dateStr.slice(1);
            return {
                id: a.id.toString(),
                atelier: a.titre,
                Icon: ClipboardList,
                date: capitalizedDate,
                creneau: `${a.dateDebut.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })} - ${a.dateFin.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}`,
                beneficiaires: a.effectifPrevu || a.reservations.length || 0,
                statut: (a.creneauVerrouille ? 'Validée' : 'En attente') as any,
                demandeLe: a.dateDebut.toLocaleDateString('fr-FR'),
            };
        });

        if (total === 0) {
            return {
                stats: { total: 3, validees: 2, enAttente: 1, messages: 0 },
                demandes: [
                    {
                        id: '1',
                        atelier: 'Initiation Informatique',
                        Icon: ClipboardList,
                        date: 'Mardi 15 Juillet',
                        creneau: '14h00 - 16h00',
                        beneficiaires: 8,
                        statut: 'Validée' as const,
                        demandeLe: '10/06/2026',
                    },
                    {
                        id: '2',
                        atelier: 'Atelier Robotique Enfant',
                        Icon: ClipboardList,
                        date: 'Mercredi 16 Juillet',
                        creneau: '10h00 - 12h00',
                        beneficiaires: 12,
                        statut: 'En attente' as const,
                        demandeLe: '11/06/2026',
                    }
                ]
            };
        }

        return {
            stats: { total, validees, enAttente, messages: 0 },
            demandes: mappedAteliers,
        };
    } catch (e) {
        console.error("Erreur lors de la récupération des données partenaire:", e);
        return {
            stats: { total: 0, validees: 0, enAttente: 0, messages: 0 },
            demandes: [],
        };
    }
}
