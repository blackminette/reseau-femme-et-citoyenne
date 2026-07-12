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
    imageSrc?: string;
    imageAlt?: string;
};

const ACTUALITES_DE_TEST: ActualiteSource[] = [
    {
        id: 1,
        titre: 'Label "Association Engagée" renouvelé pour 2025',
        tag: 'Vie associative',
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
        tag: 'Atelier à thème',
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
        tag: 'Événement',
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
        tag: 'Partenaire',
        datePublication: new Date('2026-05-28T12:00:00.000Z'),
        extrait:
            'L’association continue de structurer ses contenus et ses actions pour proposer des repères clairs, utiles et accessibles à tous.',
        ctaLabel: 'Découvrir',
        ctaHref: '/contact',
        ordre: 4,
    },
    {
        id: 5,
        titre: 'Forum de l’engagement : présence de l’association',
        tag: 'Événement',
        datePublication: new Date('2026-06-10T12:00:00.000Z'),
        extrait:
            'L’association participe à un temps fort local pour présenter ses actions, ses ateliers et ses besoins en bénévoles.',
        ctaLabel: 'Lire l’article',
        ctaHref: '/actualites/forum-engagement-2026',
        ordre: 5,
    },
    {
        id: 6,
        titre: 'Nouvelle session : accompagnement aux démarches',
        tag: 'Plateforme éducative',
        datePublication: new Date('2026-06-18T12:00:00.000Z'),
        extrait:
            'Un nouveau cycle de séances est prévu pour aider les publics à mieux comprendre les démarches du quotidien et avancer pas à pas.',
        ctaLabel: 'Découvrir',
        ctaHref: '/ateliers',
        ordre: 6,
    },
    {
        id: 7,
        titre: 'Maison des Associations Saint Roch : atelier inclusion numérique',
        tag: 'Atelier',
        datePublication: new Date('2026-06-19T12:00:00.000Z'),
        extrait:
            'Atelier inclusion numérique le lundi de 14h à 16h pour accompagner les publics sur les bases du numérique.',
        ctaLabel: 'Voir l’atelier',
        ctaHref: '/ateliers',
        ordre: 7,
    },
];

const ACCENT_PAR_TAG: Record<string, string> = {
    'Vie associative': 'bg-[#7C6CF5] text-white',
    'Événement': 'bg-[#FF9F1C] text-white',
    Atelier: 'bg-[#3B82F6] text-white',
    'Atelier à thème': 'bg-[#22C55E] text-white',
    Partenaire: 'bg-[#06B6D4] text-white',
    'Plateforme éducative': 'bg-[#FACC15] text-[#2b1459]',
};

function normaliserTag(tag: string): string {
    switch (tag) {
        case 'EVENT':
        case 'EVENEMENT':
        case 'ÉVÉNEMENT':
        case 'SPECTACLE':
            return 'Événement';
        case 'ATELIER':
            return 'Atelier';
        case 'ATELIER_A_THEME':
        case 'ATELIER À THÈME':
        case 'Atelier à thème':
            return 'Atelier à thème';
        case 'VIE ASSOCIATIVE':
            return 'Vie associative';
        case 'PARTENAIRE':
            return 'Partenaire';
        case 'PLATEFORME ÉDUCATIVE':
        case 'PLATEFORME EDUCATIVE':
        case 'Plateforme éducative':
            return 'Plateforme éducative';
        default:
            return tag;
    }
}

export function obtenirBadgeTagActualite(tag: string): string {
    const tagNormalise = normaliserTag(tag);
    return ACCENT_PAR_TAG[tagNormalise] ?? 'bg-[#7C6CF5] text-white';
}

function transformerActualite(source: ActualiteSource): ActualiteVitrine {
    const tagNormalise = normaliserTag(source.tag);
    const imageSrc = source.titre.includes('Forum de l’engagement')
        ? '/images/actualites/forum-engagement-2026.jpeg'
        : undefined;

    return {
        id: source.id,
        label: tagNormalise,
        date: format(source.datePublication, 'd MMMM yyyy', { locale: fr }),
        title: source.titre,
        excerpt: source.extrait,
        cta: source.ctaLabel,
        href: source.ctaHref,
        accent: obtenirBadgeTagActualite(tagNormalise),
        imageSrc,
        imageAlt: imageSrc
            ? 'Photo du Forum de l’Engagement 2026 à Nice'
            : undefined,
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
