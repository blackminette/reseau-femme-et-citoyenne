import Image from 'next/image';
import Link from 'next/link';
import { obtenirBadgeTagActualite } from '@/lib/actualites';

export default function ForumEngagement2026Page() {
    return (
        <main className="min-h-screen bg-[#eedeff] px-5 py-6 text-[#2b1459]">
            <article className="mx-auto max-w-6xl">
                <header className="mb-6 text-center">
                    <p className="text-sm font-semibold uppercase tracking-[0.3em] text-[#752fbb]">
                        Réseau Femme et Citoyenne 06
                    </p>
                    <h1 className="mt-3 text-4xl font-black leading-tight text-[#752fbb] md:text-5xl">
                        Forum de l’Engagement 2026 : présenter l’association et ouvrir des passerelles
                    </h1>
                    <p className="mx-auto mt-4 max-w-3xl text-base leading-7 text-[#5b4a78] md:text-lg">
                        Le mercredi 10 juin 2026, l’association a participé à un temps fort local à Nice
                        pour mettre en avant ses ateliers, ses actions citoyennes et ses besoins en bénévolat.
                    </p>
                </header>

                <section className="grid gap-6 lg:grid-cols-[1.15fr_0.85fr]">
                    <div className="overflow-hidden rounded-[1.75rem] border border-white/70 bg-white shadow-[0_12px_30px_rgba(117,47,187,0.08)]">
                        <div className="relative aspect-[4/3] w-full">
                            <Image
                                src="/images/actualites/forum-engagement-2026.jpeg"
                                alt="Équipe de Réseau Femme et Citoyenne 06 sur un stand au Forum de l'Engagement 2026"
                                fill
                                priority
                                className="object-cover"
                            />
                        </div>
                        <div className="border-t border-slate-100 px-5 py-4 text-sm text-slate-500">
                            Photo de présence associative lors du Forum de l’Engagement 2026.
                        </div>
                    </div>

                    <div className="space-y-5 rounded-[1.75rem] border border-white/70 bg-white p-5 shadow-[0_12px_30px_rgba(117,47,187,0.08)] md:p-6">
                        <div className="flex flex-wrap gap-2">
                            <span className={`rounded-full px-3 py-1 text-xs font-bold ${obtenirBadgeTagActualite('Événement')}`}>
                                Événement
                            </span>
                            <span className={`rounded-full px-3 py-1 text-xs font-bold ${obtenirBadgeTagActualite('Vie associative')}`}>
                                Vie associative
                            </span>
                            <span className={`rounded-full px-3 py-1 text-xs font-bold ${obtenirBadgeTagActualite('Partenaire')}`}>
                                Partenaires
                            </span>
                        </div>

                        <p className="text-xs font-semibold uppercase tracking-[0.26em] text-slate-400">
                            10 juin 2026
                        </p>

                        <section className="space-y-3">
                            <h2 className="text-xl font-black text-[#2b1459]">
                                Pourquoi cette présence est importante
                            </h2>
                            <p className="text-sm leading-6 text-slate-600">
                                Cette participation permet de rendre visible le travail de terrain réalisé par
                                l’association, de présenter ses ateliers numériques et d’expliquer les besoins
                                d’accompagnement des publics.
                            </p>
                        </section>

                        <section className="space-y-3">
                            <h2 className="text-xl font-black text-[#2b1459]">
                                Ce qui a été mis en avant
                            </h2>
                            <ul className="space-y-2 text-sm leading-6 text-slate-600">
                                <li className="flex gap-2">
                                    <span className="mt-2 h-2 w-2 shrink-0 rounded-full bg-[#752fbb]" />
                                    Les ateliers d’inclusion numérique destinés aux publics débutants.
                                </li>
                                <li className="flex gap-2">
                                    <span className="mt-2 h-2 w-2 shrink-0 rounded-full bg-[#752fbb]" />
                                    Les démarches administratives accompagnées pas à pas.
                                </li>
                                <li className="flex gap-2">
                                    <span className="mt-2 h-2 w-2 shrink-0 rounded-full bg-[#752fbb]" />
                                    Les besoins en bénévolat et les futurs partenariats locaux.
                                </li>
                            </ul>
                        </section>

                        <section className="space-y-3">
                            <h2 className="text-xl font-black text-[#2b1459]">
                                Ce que cette journée apporte au projet
                            </h2>
                            <p className="text-sm leading-6 text-slate-600">
                                Le forum a permis de rencontrer des acteurs associatifs et institutionnels,
                                d’échanger sur les besoins du territoire et de mieux situer les actions du projet
                                dans l’écosystème local.
                            </p>
                        </section>

                        <div className="flex flex-wrap gap-3 pt-2">
                            <Link
                                href="/actualites"
                                className="inline-flex items-center rounded-full bg-[#FACC15] px-4 py-2 text-sm font-bold text-[#2b1459] transition hover:bg-[#eab308]"
                            >
                                Retour aux actualités
                            </Link>
                            <Link
                                href="/contact"
                                className="inline-flex items-center rounded-full border border-[#752fbb] px-4 py-2 text-sm font-bold text-[#752fbb] transition hover:bg-[#f7efff]"
                            >
                                Contacter l’association
                            </Link>
                        </div>
                    </div>
                </section>
            </article>
        </main>
    );
}
