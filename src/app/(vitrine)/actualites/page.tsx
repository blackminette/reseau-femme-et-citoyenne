import { obtenirActualitesVitrine } from '@/lib/actualites';

export default async function ActualitesPage() {
    const actualites = await obtenirActualitesVitrine();

    return (
        <div className="min-h-screen bg-[#eedeff] px-5 py-8 text-[#2b1459]">
            <div className="mx-auto max-w-6xl">
                <div className="mb-8 text-center">
                    <h1 className="text-5xl font-semibold text-[#752fbb] md:text-6xl">
                        Actualit&eacute;s
                    </h1>

                    <p className="mx-auto mt-3 max-w-2xl text-base leading-7 text-[#5b4a78] md:text-lg">
                        Retrouvez les derni&egrave;res nouvelles, ateliers et temps forts de l&apos;association.
                    </p>
                </div>

                <section className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                    {actualites.map((actualite) => (
                        <article
                            key={actualite.id}
                            className="flex h-full flex-col rounded-[1.5rem] border border-white/70 bg-white p-5 shadow-[0_10px_24px_rgba(117,47,187,0.08)] transition hover:-translate-y-1 hover:shadow-[0_16px_32px_rgba(117,47,187,0.13)]"
                        >
                            <div className="mb-5 flex h-40 w-full items-center justify-center rounded-xl border-2 border-dashed border-[#8c8c8c] bg-[#f7efff] md:h-44">
                                <span className="text-xs font-semibold uppercase tracking-[0.35em] text-[#8c8c8c]">
                                    Image
                                </span>
                            </div>

                            <div className="flex flex-1 flex-col">
                                <div className={`mb-3 inline-flex w-fit rounded-full px-3.5 py-1.5 text-xs font-bold ${actualite.accent}`}>
                                    {actualite.label}
                                </div>

                                <p className="text-xs font-medium uppercase tracking-[0.22em] text-slate-400">
                                    {actualite.date}
                                </p>

                                <h2 className="mt-2 text-xl font-black leading-tight text-[#2b1459] md:text-[1.35rem]">
                                    {actualite.title}
                                </h2>

                                <p className="mt-3 text-sm leading-6 text-slate-600 md:text-[0.95rem]">
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
