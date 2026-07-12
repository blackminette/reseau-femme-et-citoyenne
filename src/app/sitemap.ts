import type { MetadataRoute } from 'next';
import { obtenirActualitesVitrine } from '@/lib/actualites';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    const siteUrl = 'https://reseau-femme-et-citoyenne.fr';

    // 1. Pages statiques de la vitrine
    const pagesStatiques = [
        '',
        '/accueil',
        '/a-propos',
        '/actualites',
        '/contact',
        '/ateliers',
        '/dons',
        '/dons-materiels',
    ];

    const sitemapStatique = pagesStatiques.map((route) => ({
        url: `${siteUrl}${route}`,
        lastModified: new Date(),
        changeFrequency: 'monthly' as const,
        priority: route === '' || route === '/accueil' ? 1.0 : 0.8,
    }));

    // 2. Pages d'actualités dynamiques (ex: /actualites/forum-engagement-2026)
    const actualites = await obtenirActualitesVitrine();
    
    // Filtrer les actualités qui pointent vers des pages d'articles internes (/actualites/...)
    const articlesSpecifiques = actualites.filter((act) => act.href.startsWith('/actualites/'));

    const sitemapDynamique = articlesSpecifiques.map((art) => ({
        url: `${siteUrl}${art.href}`,
        lastModified: new Date(),
        changeFrequency: 'weekly' as const,
        priority: 0.6,
    }));

    return [...sitemapStatique, ...sitemapDynamique];
}
