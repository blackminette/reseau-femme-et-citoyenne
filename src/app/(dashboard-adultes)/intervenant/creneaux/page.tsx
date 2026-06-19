import { CalendarDays, Clock3, MapPin, Sparkles } from 'lucide-react';

const creneaux = [
    {
        titre: 'Mercredi 14h00 - 16h00',
        lieu: 'Maison des Assos Saint-Roch',
        statut: 'Confirmé',
    },
    {
        titre: 'Jeudi 10h00 - 12h00',
        lieu: 'IPSSI Nice',
        statut: 'À préparer',
    },
    {
        titre: 'Vendredi 09h30 - 11h30',
        lieu: 'Nice Centre',
        statut: 'Suivi',
    },
];

export default function IntervenantCreneauxPage() {
    return (
        <div className="mx-auto max-w-[980px]">
            <div className="rounded-[28px] border border-[#eedeff] bg-white p-6 shadow-[0_18px_50px_rgba(117,47,187,0.08)]">
                <p className="inline-flex items-center gap-2 rounded-full bg-[#eedeff] px-3 py-1 text-xs font-bold uppercase tracking-[0.24em] text-[#752fbb]">
                    <Sparkles className="h-3.5 w-3.5" />
                    Planning
                </p>

                <h1 className="mt-4 text-3xl font-black leading-tight text-[#260936]">
                    Créneaux
                </h1>

                <p className="mt-3 text-base leading-7 text-slate-600">
                    Gérez vos disponibilités et vos horaires d’intervention avec une vue claire.
                </p>
            </div>

            <section className="mt-6 grid gap-4 md:grid-cols-3">
                {creneaux.map((creneau) => (
                    <article
                        key={creneau.titre}
                        className="rounded-[24px] border border-[#f2e7ff] bg-white p-5 shadow-[0_14px_36px_rgba(117,47,187,0.07)]"
                    >
                        <div className="flex items-center justify-between gap-4">
                            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#ffd166]/25 text-[#9a6b00]">
                                <CalendarDays className="h-5 w-5" />
                            </div>
                            <span className="rounded-full bg-[#eedeff] px-3 py-1 text-xs font-bold uppercase tracking-[0.2em] text-[#752fbb]">
                                {creneau.statut}
                            </span>
                        </div>

                        <h2 className="mt-4 text-lg font-bold text-[#260936]">{creneau.titre}</h2>
                        <p className="mt-3 flex items-center gap-2 text-sm text-slate-600">
                            <MapPin className="h-4 w-4 text-[#752fbb]" />
                            {creneau.lieu}
                        </p>
                        <p className="mt-2 flex items-center gap-2 text-sm text-slate-600">
                            <Clock3 className="h-4 w-4 text-[#bc96e6]" />
                            Présence à valider avant l’atelier
                        </p>
                    </article>
                ))}
            </section>
        </div>
    );
}
