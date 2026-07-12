import { ArrowRight, BookOpen, Rocket, Sparkles } from 'lucide-react';

const ateliers = [
    {
        titre: 'Initiation numérique',
        note: 'Préparer le support visuel et vérifier le matériel.',
    },
    {
        titre: 'Scratch débutant',
        note: 'Revoir les blocs, les consignes et le rythme des étapes.',
    },
    {
        titre: 'Atelier autonomie',
        note: 'Anticiper les questions et le niveau d’accompagnement.',
    },
];

export default function IntervenantAnimerPage() {
    return (
        <div className="mx-auto max-w-[980px]">
            <div className="rounded-[28px] border border-[#eedeff] bg-white p-6 shadow-[0_18px_50px_rgba(117,47,187,0.08)]">
                <p className="inline-flex items-center gap-2 rounded-full bg-[#eedeff] px-3 py-1 text-xs font-bold uppercase tracking-[0.24em] text-[#752fbb]">
                    <Sparkles className="h-3.5 w-3.5" />
                    Préparation
                </p>
                <h1 className="mt-4 text-3xl font-black leading-tight text-[#260936]">
                    Animer
                </h1>
                <p className="mt-3 text-base leading-7 text-slate-600">
                    Consultez les ateliers à préparer et à animer. Les actions prioritaires sont
                    mises en avant.
                </p>
            </div>

            <section className="mt-6 grid gap-4 lg:grid-cols-3">
                {ateliers.map((atelier, index) => (
                    <article
                        key={atelier.titre}
                        className={`rounded-[24px] border p-5 shadow-[0_14px_36px_rgba(117,47,187,0.07)] ${
                            index === 1
                                ? 'border-[#bc96e6] bg-[#fcfaff]'
                                : 'border-[#f2e7ff] bg-white'
                        }`}
                    >
                        <div className="flex items-center justify-between gap-4">
                            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#ffd166]/25 text-[#9a6b00]">
                                {index === 1 ? <BookOpen className="h-5 w-5" /> : <Rocket className="h-5 w-5" />}
                            </div>
                            <ArrowRight className="h-4 w-4 text-[#bc96e6]" />
                        </div>

                        <h2 className="mt-4 text-lg font-bold text-[#260936]">{atelier.titre}</h2>
                        <p className="mt-3 text-sm leading-6 text-slate-600">{atelier.note}</p>
                    </article>
                ))}
            </section>
        </div>
    );
}
