// * src/components/DemandeCard.tsx
import { CalendarDays, Clock, Users } from "lucide-react";
import type { Demande, StatutDemande } from "@/lib/partenaire-data";

/** Couleur du badge selon le statut de la demande (source unique). */
export const STATUT_STYLE: Record<StatutDemande, string> = {
    "Validée": "bg-emerald-50 text-emerald-600",
    "En attente": "bg-amber-50 text-amber-600",
    "Refusée": "bg-rose-50 text-rose-600",
};

/**
 * Carte d'une demande de réservation d'atelier.
 * Réutilisée sur le tableau de bord et la liste des demandes du partenaire.
 */
export default function DemandeCard({ demande }: { demande: Demande }) {
    const { atelier, Icon, date, creneau, beneficiaires, statut, demandeLe } = demande;
    return (
        <article className="flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-violet-200 bg-white p-5 shadow-xs">
            <div className="flex items-center gap-4">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-violet-50 text-violet-600">
                    <Icon className="h-5 w-5" aria-hidden />
                </div>
                <div className="space-y-1">
                    <h4 className="font-bold text-violet-950">{atelier}</h4>
                    <div className="flex flex-wrap gap-x-4 gap-y-1 text-[13px] text-violet-500">
                        <span className="inline-flex items-center gap-1.5"><CalendarDays className="h-4 w-4" aria-hidden /> {date}</span>
                        <span className="inline-flex items-center gap-1.5"><Clock className="h-4 w-4" aria-hidden /> {creneau}</span>
                        <span className="inline-flex items-center gap-1.5"><Users className="h-4 w-4" aria-hidden /> {beneficiaires} bénéficiaires</span>
                    </div>
                </div>
            </div>
            <div className="flex flex-col items-end gap-1.5">
                <span className={`rounded-full px-3 py-1 text-xs font-semibold ${STATUT_STYLE[statut]}`}>{statut}</span>
                <span className="text-[11px] text-violet-400">Demandé le {demandeLe}</span>
            </div>
        </article>
    );
}
