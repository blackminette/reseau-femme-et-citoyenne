// * src/app/(dashboard-adultes)/partenaire/planning/page.tsx
import Link from "next/link";
import { Clock, Users, CalendarPlus, CalendarDays } from "lucide-react";
import PageHeader from "@/components/PageHeader";
import { PLANNING, type Creneau } from "@/lib/partenaire-data";

export const metadata = {
    title: "Planning des ateliers",
    description: "Consultez les créneaux d'ateliers ouverts à la réservation.",
};

// Regroupe les créneaux par jour, en préservant l'ordre du planning.
function grouperParJour(creneaux: Creneau[]): { jour: string; items: Creneau[] }[] {
    const groupes: { jour: string; items: Creneau[] }[] = [];
    for (const c of creneaux) {
        const dernier = groupes[groupes.length - 1];
        if (dernier && dernier.jour === c.jour) dernier.items.push(c);
        else groupes.push({ jour: c.jour, items: [c] });
    }
    return groupes;
}

export default function PartenairePlanningPage() {
    const jours = grouperParJour(PLANNING);

    return (
        <div className="text-violet-900">
            <PageHeader
                titre="Planning des ateliers"
                sousTitre="Consultez les créneaux ouverts à la réservation pour vos bénéficiaires."
                action={{ href: "/partenaire/ateliers/ajouter", label: "Nouvelle demande", Icon: CalendarPlus }}
            />

            <div className="mt-6 space-y-8">
                {jours.map(({ jour, items }) => (
                    <section key={jour}>
                        <h2 className="mb-3 flex items-center gap-2 text-sm font-bold uppercase tracking-wider text-violet-500">
                            <CalendarDays className="h-4 w-4" aria-hidden /> {jour}
                        </h2>
                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                            {items.map(({ id, atelier, Icon, creneau, placesDispo, placesTotal }) => {
                                const complet = placesDispo === 0;
                                return (
                                    <article key={id} className="flex flex-col rounded-2xl border border-violet-200 bg-white p-5 shadow-xs">
                                        <div className="mb-3 flex items-center gap-3">
                                            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-violet-50 text-violet-600">
                                                <Icon className="h-5 w-5" aria-hidden />
                                            </div>
                                            <h3 className="font-bold text-violet-950">{atelier}</h3>
                                        </div>

                                        <div className="flex flex-wrap gap-x-4 gap-y-1.5 text-[13px] text-violet-500">
                                            <span className="inline-flex items-center gap-1.5"><Clock className="h-4 w-4" aria-hidden /> {creneau}</span>
                                            <span className="inline-flex items-center gap-1.5"><Users className="h-4 w-4" aria-hidden /> {placesDispo}/{placesTotal} places</span>
                                        </div>

                                        <div className="mt-4 flex items-center justify-between border-t border-violet-100 pt-3">
                                            <span className={`rounded-full px-3 py-1 text-xs font-semibold ${
                                                complet ? "bg-rose-50 text-rose-600" : "bg-emerald-50 text-emerald-600"
                                            }`}>
                                                {complet ? "Complet" : `${placesDispo} places dispo.`}
                                            </span>
                                            {complet ? (
                                                <span className="text-sm font-semibold text-violet-300">Indisponible</span>
                                            ) : (
                                                <Link
                                                    href="/partenaire/ateliers/ajouter"
                                                    className="inline-flex items-center gap-1.5 text-sm font-semibold text-violet-600 transition-colors hover:text-violet-800"
                                                >
                                                    <CalendarPlus className="h-4 w-4" aria-hidden /> Réserver
                                                </Link>
                                            )}
                                        </div>
                                    </article>
                                );
                            })}
                        </div>
                    </section>
                ))}
            </div>
        </div>
    );
}
