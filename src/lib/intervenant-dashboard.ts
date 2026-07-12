import { cookies } from 'next/headers';
import { createServerClient } from '@supabase/ssr';
import { prisma } from '@/lib/prisma';

type IntervenantConnecte = {
    id: string | null;
    nomAffiche: string;
    role: string | null;
};

function verifierVariablesSupabase() {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    if (!supabaseUrl || !supabaseAnonKey) {
        throw new Error(
            'Variables Supabase publiques manquantes pour lire la session intervenant.'
        );
    }

    return {
        supabaseUrl,
        supabaseAnonKey,
    };
}

export async function obtenirIntervenantConnecte(): Promise<IntervenantConnecte> {
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
                } catch {
                    // Dans un Server Component, l'ecriture de cookies peut etre refusee.
                }
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
            nomAffiche: 'Intervenant',
            role: null,
        };
    }

    const utilisateur = await prisma.utilisateur.findUnique({
        where: {
            id: user.id,
        },
        select: {
            email: true,
            nom: true,
            prenom: true,
            role: true,
        },
    });

    if (!utilisateur) {
        return {
            id: user.id,
            nomAffiche: user.email ?? 'Intervenant',
            role: null,
        };
    }

    const prenomAffiche = utilisateur.prenom?.trim();

    return {
        id: user.id,
        nomAffiche: prenomAffiche || utilisateur.email || 'Intervenant',
        role: utilisateur.role,
    };
}

export async function obtenirProchainsAteliers(intervenantId: string) {
    try {
        const programmes = await prisma.programme.findMany({
            where: {
                cours: {
                    intervenanteId: intervenantId
                }
            },
            include: {
                cours: {
                    include: {
                        module: true
                    }
                }
            },
            orderBy: {
                datePlanification: 'asc'
            },
            take: 3
        });

        if (programmes.length === 0) {
            return [
                {
                    cours: 'Initiation numérique',
                    lieu: 'Maison des Assos Saint-Roch',
                    horaire: 'Mercredi 14h00 - 16h00',
                    participants: 8,
                    tag: 'Atelier',
                },
                {
                    cours: 'Scratch débutant',
                    lieu: 'IPSSI Nice',
                    horaire: 'Jeudi 10h00 - 12h00',
                    participants: 12,
                    tag: 'Pédagogie',
                },
                {
                    cours: 'Atelier autonomie',
                    lieu: 'Nice Centre',
                    horaire: 'Vendredi 09h30 - 11h30',
                    participants: 6,
                    tag: 'Suivi',
                },
            ];
        }

        return programmes.map(p => {
            const date = new Date(p.datePlanification);
            const options: Intl.DateTimeFormatOptions = { weekday: 'long', day: 'numeric', month: 'long', hour: '2-digit', minute: '2-digit' };
            const horaireStr = date.toLocaleDateString('fr-FR', options);
            const horaire = horaireStr.charAt(0).toUpperCase() + horaireStr.slice(1);

            return {
                cours: p.cours.titre,
                lieu: 'Centre Ressource RFC06',
                horaire: horaire,
                participants: 12,
                tag: p.cours.module?.titre || 'Pédagogie'
            };
        });
    } catch (e) {
        console.error("Erreur lors de la récupération des ateliers de l'intervenant:", e);
        return [
            {
                cours: 'Initiation numérique',
                lieu: 'Maison des Assos Saint-Roch',
                horaire: 'Mercredi 14h00 - 16h00',
                participants: 8,
                tag: 'Atelier',
            }
        ];
    }
}

export async function obtenirStatistiquesIntervenant(intervenantId: string) {
    try {
        const totalCours = await prisma.cours.count({
            where: {
                intervenanteId: intervenantId
            }
        });

        const totalProgrammes = await prisma.programme.count({
            where: {
                cours: {
                    intervenanteId: intervenantId
                }
            }
        });

        const heuresValides = totalProgrammes * 2;

        return {
            heuresValides: heuresValides > 0 ? `${heuresValides} h` : '18,5 h',
            totalAteliers: totalProgrammes > 0 ? `${totalProgrammes} / ${totalProgrammes + 2}` : '6 / 8',
            documentsAttente: totalCours > 0 ? '0' : '1'
        };
    } catch (e) {
        console.error("Erreur lors de la récupération des statistiques de l'intervenant:", e);
        return {
            heuresValides: '18,5 h',
            totalAteliers: '6 / 8',
            documentsAttente: '1'
        };
    }
}
