import Link from 'next/link';

const actualites = [
    {
        title: 'Prévention numérique : repérer les pièges en ligne',
        date: 'Juin 2026',
        text: 'Des contenus simples et rassurants pour apprendre à reconnaître les messages suspects, les faux boutons et les demandes douteuses.',
    },
    {
        title: 'Supports pédagogiques : des visuels plus clairs pour apprendre',
        date: 'Juin 2026',
        text: 'L’association enrichit ses supports avec des illustrations plus lisibles pour faciliter la compréhension des ateliers et des démarches.',
    },
    {
        title: 'Vie associative : des actions construites avec les partenaires locaux',
        date: 'Juin 2026',
        text: 'Les actions menées s’appuient sur les besoins du terrain et sur des échanges réguliers avec les acteurs locaux du territoire.',
    },
];

const tags = ['Ateliers', 'Vie associative', 'Partenaires'];

const tempsForts = ['Ateliers d’initiation', 'Rencontres partenaires', 'Actions de sensibilisation'];

export default function ActualitesPage() {
    return (
        <main className="bg-[#f7f3ff] text-slate-800">
            <section className="border-b border-[#bc96e6]/20 bg-white">
                <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
                    <div className="max-w-3xl">
                        <p className="text-sm font-semibold uppercase tracking-[0.24em] text-[#752fbb]">
                            Réseau Femme et Citoyenne 06
                        </p>
                        <h1 className="mt-4 text-4xl font-black tracking-tight text-slate-900 sm:text-5xl">
                            Actualités
                        </h1>
                        <p className="mt-5 text-lg leading-8 text-slate-600">
                            Retrouvez les dernières actions, ateliers et événements portés par l’association à Nice
                            et dans les Alpes-Maritimes.
                        </p>

                        <div className="mt-8 flex flex-wrap gap-3">
                            {tags.map((tag) => (
                                <span
                                    key={tag}
                                    className="rounded-full bg-[#eedeff] px-4 py-2 text-sm font-semibold text-[#752fbb]"
                                >
                                    {tag}
                                </span>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            <section className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
                <article className="overflow-hidden rounded-[2rem] bg-white shadow-xl shadow-[#bc96e6]/10 ring-1 ring-[#bc96e6]/20">
                    <div className="grid lg:grid-cols-[0.95fr_1.05fr]">
                        <div className="bg-[linear-gradient(135deg,#752fbb_0%,#9a5ee8_100%)] p-8 text-white sm:p-10">
                            <p className="text-sm font-semibold uppercase tracking-[0.24em] text-[#ffd166]">
                                À la une
                            </p>
                            <h2 className="mt-4 text-3xl font-black leading-tight sm:text-4xl">
                                Ateliers numériques : accompagner les publics vers plus d’autonomie
                            </h2>
                            <p className="mt-6 text-sm font-semibold uppercase tracking-[0.2em] text-white/80">
                                Juin 2026
                            </p>
                        </div>

                        <div className="p-8 sm:p-10">
                            <p className="max-w-2xl text-lg leading-8 text-slate-600">
                                L’association poursuit la préparation de supports pédagogiques simples, visuels et
                                progressifs pour faciliter l’accès aux démarches numériques essentielles.
                            </p>

                            <div className="mt-8 grid gap-4 sm:grid-cols-3">
                                {[
                                    ['Simple', 'Des repères clairs et faciles à suivre.'],
                                    ['Visuel', 'Une lecture allégée pour mieux comprendre.'],
                                    ['Progressif', 'Une avancée par petites étapes.'],
                                ].map(([label, text]) => (
                                    <div key={label} className="rounded-2xl bg-slate-50 p-5 ring-1 ring-slate-100">
                                        <p className="text-sm font-bold uppercase tracking-[0.2em] text-[#752fbb]">
                                            {label}
                                        </p>
                                        <p className="mt-3 text-sm leading-6 text-slate-600">{text}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </article>
            </section>

            <section className="mx-auto max-w-7xl px-4 pb-14 sm:px-6 lg:px-8">
                <div className="mb-6">
                    <p className="text-sm font-semibold uppercase tracking-[0.24em] text-[#752fbb]">
                        Dernières actualités
                    </p>
                    <h2 className="mt-2 text-3xl font-black text-slate-900">Les nouvelles de l’association</h2>
                </div>

                <div className="grid gap-6 md:grid-cols-3">
                    {actualites.map((item, index) => (
                        <article
                            key={item.title}
                            className="rounded-[1.75rem] bg-white p-6 shadow-sm ring-1 ring-[#bc96e6]/15 transition hover:-translate-y-1 hover:shadow-xl"
                        >
                            <div
                                className={`mb-5 h-1.5 w-16 rounded-full ${
                                    index === 0 ? 'bg-[#752fbb]' : index === 1 ? 'bg-[#bc96e6]' : 'bg-[#ffd166]'
                                }`}
                            />
                            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-400">
                                {item.date}
                            </p>
                            <h3 className="mt-3 text-xl font-black leading-tight text-slate-900">{item.title}</h3>
                            <p className="mt-4 text-sm leading-7 text-slate-600">{item.text}</p>
                        </article>
                    ))}
                </div>
            </section>

            <section className="mx-auto max-w-7xl px-4 pb-14 sm:px-6 lg:px-8">
                <div className="mb-6">
                    <p className="text-sm font-semibold uppercase tracking-[0.24em] text-[#752fbb]">
                        Prochains temps forts
                    </p>
                    <h2 className="mt-2 text-3xl font-black text-slate-900">Les rendez-vous à venir</h2>
                </div>

                <div className="grid gap-4 sm:grid-cols-3">
                    {tempsForts.map((item) => (
                        <div
                            key={item}
                            className="rounded-[1.5rem] bg-white px-6 py-5 text-center shadow-sm ring-1 ring-slate-200"
                        >
                            <p className="text-base font-bold text-slate-800">{item}</p>
                        </div>
                    ))}
                </div>
            </section>

            <section className="mx-auto max-w-7xl px-4 pb-16 sm:px-6 lg:px-8">
                <div className="overflow-hidden rounded-[2rem] bg-[#752fbb] px-6 py-10 text-white sm:px-10">
                    <div className="grid gap-8 lg:grid-cols-[1.15fr_0.85fr] lg:items-center">
                        <div>
                            <h2 className="text-3xl font-black tracking-tight sm:text-4xl">
                                Vous souhaitez en savoir plus ?
                            </h2>
                            <p className="mt-4 max-w-2xl text-base leading-7 text-[#f4eaff]">
                                Contactez l’association pour connaître les prochaines actions ou proposer un
                                partenariat.
                            </p>
                        </div>

                        <div className="flex flex-col gap-3 sm:flex-row lg:justify-end">
                            <Link
                                href="/contact"
                                className="inline-flex items-center justify-center rounded-full bg-white px-6 py-3 text-sm font-black text-[#752fbb] transition hover:bg-[#f7f1ff]"
                            >
                                Contacter l’association
                            </Link>
                            <Link
                                href="/ateliers"
                                className="inline-flex items-center justify-center rounded-full border border-white/30 bg-white/10 px-6 py-3 text-sm font-black text-white transition hover:bg-white/20"
                            >
                                Voir les ateliers
                            </Link>
                        </div>
                    </div>
                </div>
            </section>
        </main>
    );
}
