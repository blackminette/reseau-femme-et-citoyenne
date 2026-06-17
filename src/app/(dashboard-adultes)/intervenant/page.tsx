import { obtenirIntervenantConnecte } from '@/lib/intervenant-dashboard';

const prochainsAteliers = [
    {
        cours: 'Initiation numerique',
        lieu: 'Maison des Assos Saint-Roch',
        horaire: 'Mercredi 14h00 - 16h00',
        participants: '8',
    },
    {
        cours: 'Scratch debutant',
        lieu: 'IPSSI Nice',
        horaire: 'Jeudi 10h00 - 12h00',
        participants: '12',
    },
    {
        cours: 'Atelier autonomie',
        lieu: 'Nice Centre',
        horaire: 'Vendredi 09h30 - 11h30',
        participants: '6',
    },
];

const notesAdmin = [
    '[15 Juin] Pensez a televerser votre feuille de temps signee avant le 25 du mois.',
    "[10 Juin] Le guide pedagogique Scratch a ete mis a jour pour l'atelier Poussins.",
];

const statutsMateriel = [
    {
        demande: 'Demande #892',
        materiel: 'Arduino Kits x15',
        statut: 'Pret',
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
        <div className="mx-auto max-w-[980px]">
            <h1 className="text-[25px] font-bold leading-none text-slate-950">
                Tableau de Bord
            </h1>

            <p className="mt-3 text-[21px] leading-snug text-slate-700">
                Bonjour {intervenant.nomAffiche}{' '}! Voici un r&eacute;sum&eacute; de votre activit&eacute; pour ce mois-ci.
            </p>

            <section className="mt-6 rounded-2xl border-2 border-sky-400 bg-white px-5 py-4 shadow-sm">
                <h2 className="text-[21px] font-semibold text-slate-950">
                    Stats du mois de Juin
                </h2>

                <div className="mt-4 grid grid-cols-3 gap-12">
                    <div className="rounded-xl bg-slate-100 px-7 py-3 text-center text-[15px] text-slate-700">
                        <p className="font-medium">Heures valid&eacute;es :</p>
                        <p className="mt-2 text-lg font-bold text-slate-950">18,5 h</p>
                    </div>

                    <div className="rounded-xl bg-slate-100 px-7 py-3 text-center text-[15px] text-slate-700">
                        <p className="font-medium">Ateliers anim&eacute;s :</p>
                        <p className="mt-2 text-lg font-bold text-slate-950">6/8</p>
                    </div>

                    <div className="rounded-xl bg-slate-100 px-7 py-3 text-center text-[15px] text-slate-700">
                        <p className="font-medium">Doc &agrave; fournir :</p>
                        <p className="mt-2 text-lg font-bold text-slate-950">1</p>
                    </div>
                </div>
            </section>

            <section className="mt-5 grid grid-cols-3 gap-9">
                <article className="min-h-[350px] rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                    <h2 className="mb-4 text-center text-[22px] font-semibold text-slate-950">
                        Prochains Ateliers
                    </h2>

                    <div className="space-y-3">
                        {prochainsAteliers.map((atelier) => (
                            <div
                                key={`${atelier.cours}-${atelier.horaire}`}
                                className="rounded-xl bg-slate-100 p-3 text-[15px] leading-6 text-slate-800"
                            >
                                <p>
                                    <span className="font-semibold">Cours :</span> {atelier.cours}
                                </p>
                                <p>
                                    <span className="font-semibold">Lieu :</span> {atelier.lieu}
                                </p>
                                <p>
                                    <span className="font-semibold">Horaire :</span> {atelier.horaire}
                                </p>
                                <p>
                                    <span className="font-semibold">Nb Participants :</span> {atelier.participants}
                                </p>
                            </div>
                        ))}
                    </div>
                </article>

                <article className="min-h-[350px] rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                    <h2 className="mb-4 text-center text-[22px] font-semibold text-slate-950">
                        Notes Admin
                    </h2>

                    <div className="rounded-xl bg-slate-100 p-4 text-[15px] leading-6 text-slate-800">
                        <ul className="space-y-5">
                            {notesAdmin.map((note) => (
                                <li key={note}>
                                    <span className="font-bold">&bull;</span> {note}
                                </li>
                            ))}
                        </ul>
                    </div>
                </article>

                <article className="min-h-[350px] rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                    <h2 className="mb-4 text-center text-[22px] font-semibold text-slate-950">
                        Statut mat&eacute;riel
                    </h2>

                    <div className="rounded-xl bg-slate-100 p-4 text-[15px] leading-6 text-slate-800">
                        <ul className="space-y-4">
                            {statutsMateriel.map((item) => (
                                <li key={item.demande}>
                                    <p>
                                        <span className="font-bold">&bull;</span> {item.demande}
                                    </p>
                                    <p className="pl-4">{item.materiel}</p>
                                    <p className="pl-4 font-semibold">{item.statut}</p>
                                    {item.precision ? (
                                        <p className="pl-4 text-slate-600">
                                            ({item.precision})
                                        </p>
                                    ) : null}
                                </li>
                            ))}
                        </ul>
                    </div>
                </article>
            </section>
        </div>
    );
}
