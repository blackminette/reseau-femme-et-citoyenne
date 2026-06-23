import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

type ActualiteSource = {
    id: number;
    titre: string;
    tag: string;
    datePublication: Date;
    extrait: string;
    ctaLabel: string;
    ctaHref: string;
    ordre: number;
};

export type ActualiteVitrine = {
    id: number;
    label: string;
    date: string;
    title: string;
    excerpt: string;
    cta: string;
    href: string;
    accent: string;
};

const ACTUALITES_DE_TEST: ActualiteSource[] = [
    {
        id: 1,
        titre: 'Label "Association Engagée" renouvelé pour 2025',
        tag: 'EVENT',
        datePublication: new Date('2025-04-03T12:00:00.000Z'),
        extrait:
            'Pour la troisième année consécutive, la Ville de Nice renouvelle notre label qui récompense notre engagement auprès des familles.',
        ctaLabel: 'Lire la suite',
        ctaHref: '/ateliers',
        ordre: 1,
    },
    {
        id: 2,
        titre: 'Nouveau : ateliers jardinage et permaculture',
        tag: 'ATELIER',
        datePublication: new Date('2025-03-20T12:00:00.000Z'),
        extrait:
            'À partir d’avril, nous proposons des ateliers de jardinage urbain pour initier les enfants à la permaculture et au respect de la nature.',
        ctaLabel: 'Réserver',
        ctaHref: '/ateliers',
        ordre: 2,
    },
    {
        id: 3,
        titre: 'Le spectacle de Noël : un franc succès !',
        tag: 'SPECTACLE',
        datePublication: new Date('2025-01-10T12:00:00.000Z'),
        extrait:
            'Plus de 200 personnes ont assisté au spectacle de théâtre de décembre. Les enfants ont présenté une pièce écrite par eux-mêmes.',
        ctaLabel: 'Voir les vidéos',
        ctaHref: '/actualites',
        ordre: 3,
    },
    {
        id: 4,
        titre: 'Des actions construites avec les partenaires locaux',
        tag: 'VIE ASSOCIATIVE',
        datePublication: new Date('2026-05-28T12:00:00.000Z'),
        extrait:
            'L’association continue de structurer ses contenus et ses actions pour proposer des repères clairs, utiles et accessibles à tous.',
        ctaLabel: 'Découvrir',
        ctaHref: '/contact',
        ordre: 4,
    },
];

const ACCENT_PAR_TAG: Record<string, string> = {
    EVENT: 'bg-[#ffd166] text-[#2b1459]',
    ATELIER: 'bg-[#5fbf74] text-white',
    SPECTACLE: 'bg-[#ef4b87] text-white',
    'VIE ASSOCIATIVE': 'bg-[#752fbb] text-white',
};

function transformerActualite(source: ActualiteSource): ActualiteVitrine {
    return {
        id: source.id,
        label: source.tag,
        date: format(source.datePublication, 'd MMMM yyyy', { locale: fr }),
        title: source.titre,
        excerpt: source.extrait,
        cta: source.ctaLabel,
        href: source.ctaHref,
        accent: ACCENT_PAR_TAG[source.tag] ?? 'bg-[#752fbb] text-white',
    };
}

export async function obtenirActualitesVitrine(): Promise<ActualiteVitrine[]> {
    try {
        const { prisma } = await import('@/lib/prisma');
        const actualites = await prisma.$queryRaw<ActualiteSource[]>`
            SELECT
                id,
                titre,
                tag,
                "datePublication",
                extrait,
                "ctaLabel",
                "ctaHref",
                ordre
            FROM "Actualite"
            WHERE "estPublic" = true
            ORDER BY ordre ASC, "datePublication" DESC, id ASC
        `;

        if (actualites.length > 0) {
            return actualites.map(transformerActualite);
        }
    } catch (error) {
        console.error('Erreur lors du chargement des actualités publiques :', error);
    }

    return ACTUALITES_DE_TEST.map(transformerActualite);
}
