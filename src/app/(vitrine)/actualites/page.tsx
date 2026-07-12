import Image from 'next/image';
import { obtenirActualitesVitrine } from '@/lib/actualites';

export default async function ActualitesPage() {
    const actualites = await obtenirActualitesVitrine();

    return (
        <div className="min-h-screen bg-[#eedeff] px-5 py-6 text-[#2b1459]">
            <div className="mx-auto max-w-6xl">
                <div className="mb-6 text-center">
                    <h1 className="text-5xl font-semibold text-[#260936] md:text-6xl">
                        Actualit&eacute;s
                    </h1>

                    <p className="mx-auto mt-3 max-w-2xl text-base leading-7 text-[#5b4a78] md:text-lg">
                        Retrouvez les derni&egrave;res nouvelles, ateliers et temps forts de l&apos;association.
                    </p>
                </div>

                <section className="grid grid-cols-1 gap-4 lg:grid-cols-3">
                    {actualites.map((actualite) => {
                        const ombreCarte =
                                'shadow-[0_16px_36px_rgba(117,47,187,0.24)] ring-1 ring-[#752fbb]/20 hover:shadow-[0_22px_50px_rgba(117,47,187,0.34)] hover:ring-[#752fbb]/30';

                        return (
                            <article
                                key={actualite.id}
                                className={`flex h-full flex-col rounded-[1.5rem] border border-white/70 bg-white p-3 transition hover:-translate-y-1 md:p-4 ${ombreCarte}`}
                            >
                                {actualite.imageSrc ? (
                                    <div className="relative mb-3 aspect-[16/9] w-full overflow-hidden rounded-xl bg-[#f7efff]">
                                        <Image
                                            src={actualite.imageSrc}
                                            alt={actualite.imageAlt ?? actualite.title}
                                            fill
                                            sizes="(max-width: 1024px) 100vw, 33vw"
                                            className="object-cover"
                                        />
                                    </div>
                                ) : (
                                    <div className="mb-3 flex h-24 w-full items-center justify-center rounded-xl border-2 border-dashed border-[#8c8c8c] bg-[#f7efff] md:h-28">
                                        <span className="text-xs font-semibold uppercase tracking-[0.35em] text-[#8c8c8c]">
                                            Image
                                        </span>
                                    </div>
                                )}

                                <div className="flex flex-1 flex-col">
                                    <div className={`mb-1.5 inline-flex w-fit rounded-full px-3 py-1 text-xs font-bold ${actualite.accent}`}>
                                        {actualite.label}
                                    </div>

                                    <p className="text-[11px] font-medium uppercase tracking-[0.22em] text-slate-400">
                                        {actualite.date}
                                    </p>

                                    <h2 className="mt-1 text-lg font-black leading-tight text-[#2b1459] md:text-xl">
                                        {actualite.title}
                                    </h2>

                                    <p className="mt-1.5 text-sm leading-5 text-slate-600 md:text-[0.92rem]">
                                        {actualite.excerpt}
                                    </p>

                                    <a
                                        href={actualite.href}
                                        className="mt-2.5 inline-flex items-center gap-2 text-sm font-bold text-[#752fbb] transition hover:gap-3"
                                    >
                                        {actualite.cta}
                                        <span aria-hidden="true">&rarr;</span>
                                    </a>
                                </div>
                            </article>
                        );
                    })}
                </section>
            </div>
        </div>
    );
}
