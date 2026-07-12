import Link from 'next/link';
import {
    ArrowUpRight,
    BadgeCheck,
    CalendarDays,
    ClipboardList,
    FileUp,
    MapPin,
    Sparkles,
    TimerReset,
    Users,
} from 'lucide-react';
import { obtenirIntervenantConnecte } from '@/lib/intervenant-dashboard';

const indicateurs = [
    {
        titre: 'Heures validées',
        valeur: '18,5 h',
        description: 'Depuis le début du mois',
        icone: TimerReset,
        accent: 'bg-[#eedeff] text-[#752fbb]',
    },
    {
        titre: 'Ateliers animés',
        valeur: '6 / 8',
        description: 'Sessions planifiées',
        icone: CalendarDays,
        accent: 'bg-[#ffd166]/25 text-[#9a6b00]',
    },
    {
        titre: 'Documents à fournir',
        valeur: '1',
        description: 'Feuille de temps en attente',
        icone: FileUp,
        accent: 'bg-[#bc96e6]/20 text-[#752fbb]',
    },
];

const prochainsAteliers = [
    {
        cours: 'Initiation numérique',
        lieu: 'Maison des Assos Saint-Roch',
        horaire: 'Mercredi 14h00 - 16h00',
        participants: '8',
        tag: 'Atelier',
    },
    {
        cours: 'Scratch débutant',
        lieu: 'IPSSI Nice',
        horaire: 'Jeudi 10h00 - 12h00',
        participants: '12',
        tag: 'Pédagogie',
    },
    {
        cours: 'Atelier autonomie',
        lieu: 'Nice Centre',
        horaire: 'Vendredi 09h30 - 11h30',
        participants: '6',
        tag: 'Suivi',
    },
];

const notesAdmin = [
    '[15 Juin] Pensez à téléverser votre feuille de temps signée avant le 25 du mois.',
    "[10 Juin] Le guide pédagogique Scratch a été mis à jour pour l'atelier Poussins.",
];

const statutsMateriel = [
    {
        demande: 'Demande #892',
        materiel: 'Arduino Kits x15',
        statut: 'Prêt',
    },
    {
        demande: 'Demande #899',
        materiel: 'Webcams Stop-Motion',
        statut: 'En attente',
        precision: 'Donateur requis',
    },
];

export default async function IntervenantPage() {
    const intervenant = await obtenirIntervenantConnecte();

    return (
        <div className="mx-auto max-w-[1100px]">
            <section className="overflow-hidden rounded-[28px] border border-[#eedeff] bg-white shadow-[0_22px_60px_rgba(117,47,187,0.10)]">
                <div className="border-b border-[#f2e7ff] bg-[#fdfbff] px-4 py-5 sm:px-6">
                    <div className="flex flex-wrap items-center gap-2 sm:gap-3">
                        <span className="inline-flex items-center gap-2 rounded-full bg-[#eedeff] px-3 py-1 text-xs font-bold uppercase tracking-[0.28em] text-[#752fbb]">
                            <Sparkles className="h-3.5 w-3.5" />
                            Espace intervenant
                        </span>
                        <span className="inline-flex items-center gap-2 rounded-full bg-[#ffd166]/25 px-3 py-1 text-xs font-bold uppercase tracking-[0.22em] text-[#9a6b00]">
                            <BadgeCheck className="h-3.5 w-3.5" />
                            Compte actif
                        </span>
                    </div>

                    <h1 className="mt-4 text-2xl font-black leading-tight text-[#260936] sm:text-3xl md:text-4xl">
                        Tableau de bord
                    </h1>

                    <p className="mt-3 max-w-3xl text-sm leading-6 text-slate-600 sm:text-base sm:leading-7 md:text-lg">
                        Bonjour {intervenant.nomAffiche}. Voici un résumé clair de votre activité,
                        des ateliers à préparer et des éléments à suivre.
                    </p>
                </div>

                <div className="grid gap-3 px-4 py-4 sm:gap-4 sm:px-6 sm:py-6 md:grid-cols-3">
                    {indicateurs.map((indicateur) => {
                        const Icon = indicateur.icone;

                        return (
                            <article
                                key={indicateur.titre}
                                className="rounded-2xl border border-[#f2e7ff] bg-[#fcfaff] p-4 shadow-sm sm:p-5"
                            >
                                <div className="flex items-start justify-between gap-3 sm:gap-4">
                                    <div>
                                        <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-slate-500 sm:text-sm">
                                            {indicateur.titre}
                                        </p>
                                        <p className="mt-2 text-2xl font-black text-[#260936] sm:mt-3 sm:text-3xl">
                                            {indicateur.valeur}
                                        </p>
                                        <p className="mt-2 text-xs text-slate-500 sm:text-sm">
                                            {indicateur.description}
                                        </p>
                                    </div>

                                    <div className={`flex h-10 w-10 items-center justify-center rounded-2xl sm:h-12 sm:w-12 ${indicateur.accent}`}>
                                        <Icon className="h-5 w-5" />
                                    </div>
                                </div>
                            </article>
                        );
                    })}
                </div>
            </section>

            <section className="mt-5 grid gap-5 lg:grid-cols-[1.4fr_0.9fr] sm:mt-6 sm:gap-6">
                <article className="rounded-[28px] border border-[#eedeff] bg-white p-4 shadow-[0_18px_50px_rgba(117,47,187,0.08)] sm:p-6">
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between sm:gap-4">
                        <div>
                            <p className="inline-flex items-center gap-2 rounded-full bg-[#eedeff] px-3 py-1 text-xs font-bold uppercase tracking-[0.24em] text-[#752fbb]">
                                <Users className="h-3.5 w-3.5" />
                                Prochains ateliers
                            </p>
                            <h2 className="mt-3 text-xl font-black text-[#260936] sm:text-2xl">
                                Planning à venir
                            </h2>
                        </div>
                        <Link
                            href="/intervenant/creneaux"
                            className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-[#752fbb] px-4 py-2 text-sm font-bold text-white transition hover:bg-[#6427a1] sm:w-auto"
                        >
                            Voir les créneaux
                            <ArrowUpRight className="h-4 w-4" />
                        </Link>
                    </div>

                    <div className="mt-4 space-y-3 sm:mt-5 sm:space-y-4">
                        {prochainsAteliers.map((atelier) => (
                            <div
                                key={`${atelier.cours}-${atelier.horaire}`}
                                className="rounded-2xl border border-[#f2e7ff] bg-[#fcfaff] p-4 shadow-[0_10px_28px_rgba(117,47,187,0.06)] sm:p-4"
                            >
                                <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center sm:justify-between sm:gap-3">
                                    <div className="flex items-center gap-2">
                                        <span className="inline-flex items-center rounded-full bg-[#ffd166]/25 px-3 py-1 text-xs font-bold uppercase tracking-[0.24em] text-[#9a6b00]">
                                            {atelier.tag}
                                        </span>
                                        <span className="text-sm font-semibold text-[#bc96e6]">
                                            {atelier.participants} participants
                                        </span>
                                    </div>
                                    <span className="text-sm font-medium text-slate-500">
                                        {atelier.horaire}
                                    </span>
                                </div>

                                <h3 className="mt-3 text-base font-bold text-[#260936] sm:text-lg">
                                    {atelier.cours}
                                </h3>

                                <p className="mt-2 flex items-center gap-2 text-sm text-slate-600">
                                    <MapPin className="h-4 w-4 text-[#752fbb]" />
                                    {atelier.lieu}
                                </p>
                            </div>
                        ))}
                    </div>
                </article>

                <div className="space-y-5 sm:space-y-6">
                    <article className="rounded-[28px] border border-[#eedeff] bg-white p-4 shadow-[0_18px_50px_rgba(117,47,187,0.08)] sm:p-6">
                        <div className="flex items-center gap-3">
                            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#eedeff] text-[#752fbb]">
                                <ClipboardList className="h-5 w-5" />
                            </div>
                            <div>
                                <h2 className="text-lg font-black text-[#260936] sm:text-xl">Notes admin</h2>
                                <p className="text-sm text-slate-500">Consignes utiles à suivre</p>
                            </div>
                        </div>

                        <ul className="mt-4 space-y-3 sm:mt-5">
                            {notesAdmin.map((note) => (
                                <li
                                    key={note}
                                    className="rounded-2xl border border-[#f2e7ff] bg-[#fcfaff] px-4 py-3 text-sm leading-6 text-slate-700"
                                >
                                    {note}
                                </li>
                            ))}
                        </ul>
                    </article>

                    <article className="rounded-[28px] border border-[#eedeff] bg-white p-4 shadow-[0_18px_50px_rgba(117,47,187,0.08)] sm:p-6">
                        <div className="flex items-center gap-3">
                            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#ffd166]/25 text-[#9a6b00]">
                                <FileUp className="h-5 w-5" />
                            </div>
                            <div>
                                <h2 className="text-lg font-black text-[#260936] sm:text-xl">Statut matériel</h2>
                                <p className="text-sm text-slate-500">Demandes en cours</p>
                            </div>
                        </div>

                        <ul className="mt-4 space-y-3 sm:mt-5">
                            {statutsMateriel.map((item) => (
                                <li
                                    key={item.demande}
                                    className="rounded-2xl border border-[#f2e7ff] bg-[#fcfaff] px-4 py-3 text-sm leading-6 text-slate-700"
                                >
                                    <p className="font-bold text-[#260936]">{item.demande}</p>
                                    <p className="mt-1">{item.materiel}</p>
                                    <p className="mt-1 font-semibold text-[#752fbb]">{item.statut}</p>
                                    {item.precision ? (
                                        <p className="mt-1 text-slate-500">{item.precision}</p>
                                    ) : null}
                                </li>
                            ))}
                        </ul>
                    </article>
                </div>
            </section>
        </div>
    );
}
