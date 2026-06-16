import { obtenirActualitesVitrine } from '@/lib/actualites';

export default async function ActualitesPage() {
    const actualites = await obtenirActualitesVitrine();

    return (
        <div className="min-h-screen bg-[#eedeff] px-6 py-8 text-[#2b1459]">
            <div className="mx-auto max-w-7xl">
                <h1 className="mb-10 text-center text-3xl font-semibold text-[#752fbb]">
                    Actualit&eacute;s
                </h1>

                <section className="space-y-8">
                    {actualites.map((actualite) => (
                        <article
                            key={actualite.id}
                            className="flex items-center gap-10 rounded-[1.75rem] border border-white/70 bg-white px-10 py-8 shadow-[0_12px_30px_rgba(117,47,187,0.08)]"
                        >
                            <div className="flex h-48 w-72 shrink-0 items-center justify-center rounded-2xl border-2 border-dashed border-[#8c8c8c] bg-[#f7efff] md:h-56 md:w-80">
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
                                    href={actualite.href}
                                    className="mt-5 inline-flex items-center gap-2 text-sm font-bold text-[#752fbb] transition hover:gap-3"
                                >
                                    {actualite.cta}
                                    <span aria-hidden="true">&rarr;</span>
                                </a>
                            </div>
                        </article>
                    ))}
                </section>
            </div>
        </div>
    );
}
