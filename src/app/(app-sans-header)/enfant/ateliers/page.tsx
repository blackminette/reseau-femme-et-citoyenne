// * src/app/(app-sans-header)/enfant/ateliers/page.tsx
import {
    Palette, MapPin, Baby, CreditCard, Banknote,
    Check, Clock, X, CalendarDays, Users, Sparkles,
} from "lucide-react";
import { ENFANT, ATELIERS_RESERVES, ATELIERS_CATALOGUE } from "@/lib/enfant-data";
import EnfantHeader from "@/components/EnfantHeader";

export const metadata = {
    title: "Mes ateliers",
    description: "Tes ateliers réservés et les propositions pour ton âge.",
};

// Style du statut d'une réservation (bordure gauche + pastille).
const STATUT: Record<string, { border: string; pill: string; Icon: typeof Check }> = {
    "Confirmé": { border: "border-l-emerald-500", pill: "bg-emerald-50 text-emerald-600", Icon: Check },
    "En attente": { border: "border-l-amber-500", pill: "bg-amber-50 text-amber-600", Icon: Clock },
    "Refusé": { border: "border-l-rose-500", pill: "bg-rose-50 text-rose-600", Icon: X },
};

export default function EnfantAteliersPage() {
    // Ateliers proposés pour l'âge de l'enfant.
    const proposes = ATELIERS_CATALOGUE.filter((a) => ENFANT.age >= a.ageMin && ENFANT.age <= a.ageMax);

    return (
        <div className="text-violet-900">

            {/* ─── Barre du haut : titre + chip enfant ─── */}
            <EnfantHeader
                Icon={Palette}
                titre="Mes ateliers"
                sousTitre="Retrouve ici tes ateliers réservés et les propositions pour ton âge."
            />

            {/* ─── Stat : nombre d'ateliers réservés ─── */}
            <div className="mt-6 flex max-w-[220px] items-center gap-4 rounded-2xl border border-violet-200 bg-white p-5 shadow-xs">
                <div className="rounded-xl bg-violet-50 p-3 text-violet-600">
                    <Palette className="h-6 w-6" aria-hidden />
                </div>
                <div>
                    <span className="text-2xl font-bold tracking-tight text-violet-950">{ATELIERS_RESERVES.length}</span>
                    <p className="text-sm font-medium text-violet-600">Ateliers réservés</p>
                </div>
            </div>

            {/* ─── Ateliers réservés ─── */}
            <section className="mt-8">
                <h3 className="flex items-center gap-2 text-lg font-semibold tracking-tight text-violet-800">
                    <CalendarDays className="h-5 w-5 text-violet-600" aria-hidden /> Mes ateliers réservés
                </h3>
                <div className="mt-4 grid gap-3">
                    {ATELIERS_RESERVES.map((r) => {
                        const st = STATUT[r.statut];
                        const PaiementIcon = r.paiement === "Carte bancaire" ? CreditCard : Banknote;
                        return (
                            <div key={r.id} className={`flex overflow-hidden rounded-2xl border border-violet-200 border-l-4 bg-white shadow-xs ${st.border}`}>
                                {/* Bloc date */}
                                <div className="flex min-w-[92px] flex-col items-center justify-center bg-gradient-to-br from-violet-50 to-violet-100 p-4 text-center">
                                    <div className="text-2xl font-extrabold leading-none text-violet-700">{r.jour}</div>
                                    <div className="mt-1 text-[11px] font-semibold uppercase text-violet-500">{r.mois}</div>
                                    <div className="text-[10px] text-violet-400">{r.annee}</div>
                                </div>
                                {/* Corps */}
                                <div className="flex-1 p-4">
                                    <div className="flex items-center gap-2 font-bold text-violet-950">
                                        <r.Icon className="h-[18px] w-[18px] text-violet-600" aria-hidden /> {r.atelier}
                                    </div>
                                    <div className="mt-1.5 space-y-1 text-[12.5px] text-violet-500">
                                        <div className="flex items-center gap-1.5">
                                            <MapPin className="h-3.5 w-3.5" aria-hidden /> {r.lieu}
                                            <span className="text-violet-300">·</span>
                                            <Baby className="h-3.5 w-3.5" aria-hidden /> {r.age} ans
                                        </div>
                                        <div className="flex items-center gap-1.5">
                                            <PaiementIcon className="h-3.5 w-3.5" aria-hidden /> {r.paiement}
                                            <span className="text-violet-300">·</span> Demandé le {r.demande}
                                        </div>
                                        {r.message && <div className="italic text-violet-400">« {r.message} »</div>}
                                    </div>
                                </div>
                                {/* Statut */}
                                <div className="flex items-center p-4">
                                    <span className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-[11px] font-semibold ${st.pill}`}>
                                        <st.Icon className="h-3.5 w-3.5" aria-hidden /> {r.statut}
                                    </span>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </section>

            {/* ─── Séparateur ─── */}
            <div className="my-7 flex items-center gap-3 text-sm font-bold text-violet-500">
                <div className="h-px flex-1 bg-violet-200" />
                <span className="flex items-center gap-1.5"><Sparkles className="h-4 w-4" aria-hidden /> Ateliers proposés pour ton âge</span>
                <div className="h-px flex-1 bg-violet-200" />
            </div>

            {/* ─── Catalogue proposé ─── */}
            <div className="mb-4 flex flex-wrap items-center gap-2 text-[13px] text-violet-400">
                Ce qui est proposé pour toi — si quelque chose te plaît, parle-en à tes parents !
                <span className="rounded-full bg-violet-50 px-3 py-0.5 text-[12px] font-semibold text-violet-600">{ENFANT.age} ans</span>
            </div>

            <section className="mb-4 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {proposes.map((a) => (
                    <div key={a.id} className="flex gap-3.5 rounded-2xl border border-violet-200 bg-white p-4 shadow-xs">
                        <div
                            className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl"
                            style={{ backgroundColor: `${a.couleur}22`, color: a.couleur }}
                        >
                            <a.Icon className="h-6 w-6" aria-hidden />
                        </div>
                        <div className="min-w-0 flex-1">
                            <div className="text-sm font-bold text-violet-950">{a.titre}</div>
                            <div className="mt-1 text-[11.5px] leading-snug text-violet-500">{a.desc}</div>
                            <div className="mt-2 flex flex-wrap gap-x-3 gap-y-1 text-[11.5px] text-violet-500">
                                <span className="inline-flex items-center gap-1"><CalendarDays className="h-3 w-3" aria-hidden /> {a.date}</span>
                                <span className="inline-flex items-center gap-1"><Clock className="h-3 w-3" aria-hidden /> {a.heure}</span>
                                <span className="inline-flex items-center gap-1"><MapPin className="h-3 w-3" aria-hidden /> {a.lieu}</span>
                                <span className="inline-flex items-center gap-1"><Users className="h-3 w-3" aria-hidden /> {a.places} places</span>
                            </div>
                            <span className="mt-2 inline-block rounded-full bg-gradient-to-r from-violet-500 to-purple-400 px-2.5 py-0.5 text-[10.5px] font-semibold text-white">{a.ageMin} – {a.ageMax} ans</span>
                        </div>
                    </div>
                ))}
            </section>
        </div>
    );
}
