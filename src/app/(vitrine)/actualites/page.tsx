const ACTUALITES = [
    {
        id: 1,
        label: 'EVENT',
        date: '3 avril 2025',
        title: 'Label "Association Engagée" renouvelé pour 2025',
        excerpt:
            'Pour la troisième année consécutive, la Ville de Nice renouvelle notre label qui récompense notre engagement auprès des familles.',
        cta: 'Lire la suite',
        accent: 'bg-[#ffd166] text-[#2b1459]',
    },
    {
        id: 2,
        label: 'ATELIER',
        date: '20 mars 2025',
        title: 'Nouveau : ateliers jardinage et permaculture',
        excerpt:
            'À partir d’avril, nous proposons des ateliers de jardinage urbain pour initier les enfants à la permaculture et au respect de la nature.',
        cta: 'Réserver',
        accent: 'bg-[#5fbf74] text-white',
    },
    {
        id: 3,
        label: 'SPECTACLE',
        date: '10 janvier 2025',
        title: 'Le spectacle de Noël : un franc succès !',
        excerpt:
            'Plus de 200 personnes ont assisté au spectacle de théâtre de décembre. Les enfants ont présenté une pièce écrite par eux-mêmes.',
        cta: 'Voir les vidéos',
        accent: 'bg-[#ef4b87] text-white',
    },
    {
        id: 4,
        label: 'VIE ASSOCIATIVE',
        date: '28 mai 2026',
        title: 'Des actions construites avec les partenaires locaux',
        excerpt:
            'L’association continue de structurer ses contenus et ses actions pour proposer des repères clairs, utiles et accessibles à tous.',
        cta: 'Découvrir',
        accent: 'bg-[#752fbb] text-white',
    },
];

export default function ActualitesPage() {
    return (
        <div className="min-h-screen bg-[#eedeff] px-6 py-8 text-[#2b1459]">
            <div className="mx-auto max-w-7xl">
                <h1 className="mb-10 text-center text-3xl font-semibold text-[#752fbb]">
                    Actualités
                </h1>

                <section className="space-y-8">
                    {ACTUALITES.map((actualite) => (
                        <article
                            key={actualite.id}
                            className="flex items-center gap-10 rounded-[1.75rem] border border-white/70 bg-white px-10 py-8 shadow-[0_12px_30px_rgba(117,47,187,0.08)]"
                        >
                            <div className="flex h-28 w-40 items-center justify-center rounded-2xl border-2 border-dashed border-[#8c8c8c] bg-[#f7efff]">
                                <span className="text-sm font-semibold uppercase tracking-[0.25em] text-[#8c8c8c]">
                                    Image
                                </span>
                            </div>

                            <div className="flex-1">
                                <div className={`mb-3 inline-flex rounded-full px-4 py-2 text-sm font-bold ${actualite.accent}`}>
                                    {actualite.label}
                                </div>

                                <p className="text-sm font-medium uppercase tracking-[0.22em] text-slate-400">
                                    {actualite.date}
                                </p>

                                <h2 className="mt-3 text-2xl font-black leading-tight text-[#2b1459]">
                                    {actualite.title}
                                </h2>

                                <p className="mt-4 max-w-3xl text-base leading-7 text-slate-600">
                                    {actualite.excerpt}
                                </p>

                                <a
                                    href="/ateliers"
                                    className="mt-5 inline-flex items-center gap-2 text-sm font-bold text-[#752fbb] transition hover:gap-3"
                                >
                                    {actualite.cta}
                                    <span aria-hidden="true">→</span>
                                </a>
                            </div>
                        </article>
                    ))}
                </section>
            </div>
        </div>
    );
}
