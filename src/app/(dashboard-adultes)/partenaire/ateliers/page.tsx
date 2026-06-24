// * src/app/(dashboard-adultes)/partenaire/ateliers/page.tsx
import Link from "next/link";
import { CalendarPlus, ClipboardList } from "lucide-react";
import PageHeader from "@/components/PageHeader";
import EmptyState from "@/components/EmptyState";
import DemandeCard from "@/components/DemandeCard";
import { DEMANDES, type StatutDemande } from "@/lib/partenaire-data";

export const metadata = {
    title: "Mes demandes",
    description: "Suivez l'état de toutes vos demandes de réservation d'atelier.",
};

// Onglets de filtre : libellé affiché ↔ valeur URL ↔ statut filtré (null = toutes).
const FILTRES: { label: string; slug: string; statut: StatutDemande | null }[] = [
    { label: "Toutes", slug: "toutes", statut: null },
    { label: "Validées", slug: "validees", statut: "Validée" },
    { label: "En attente", slug: "en-attente", statut: "En attente" },
    { label: "Refusées", slug: "refusees", statut: "Refusée" },
];

export default async function PartenaireAteliersPage({
    searchParams,
}: {
    searchParams: Promise<{ statut?: string }>;
}) {
    const { statut } = await searchParams;
    const filtreActif = FILTRES.find((f) => f.slug === statut) ?? FILTRES[0];
    const demandes = filtreActif.statut
        ? DEMANDES.filter((d) => d.statut === filtreActif.statut)
        : DEMANDES;

    return (
        <div className="text-violet-900">
            <PageHeader
                titre="Mes demandes"
                sousTitre="Suivez l'état de toutes vos demandes de réservation d'atelier."
                action={{ href: "/partenaire/ateliers/ajouter", label: "Nouvelle demande", Icon: CalendarPlus }}
            />

            {/* ─── Filtres par statut ─── */}
            <div className="mt-6 flex flex-wrap gap-2">
                {FILTRES.map((f) => {
                    const isActive = f.slug === filtreActif.slug;
                    const count = f.statut ? DEMANDES.filter((d) => d.statut === f.statut).length : DEMANDES.length;
                    return (
                        <Link
                            key={f.slug}
                            href={f.slug === "toutes" ? "/partenaire/ateliers" : `/partenaire/ateliers?statut=${f.slug}`}
                            className={`inline-flex items-center gap-1.5 rounded-xl px-4 py-2 text-sm font-medium transition-colors ${
                                isActive
                                    ? "bg-violet-600 text-white"
                                    : "border border-violet-200 bg-white text-violet-600 hover:bg-violet-50"
                            }`}
                        >
                            {f.label}
                            <span className={`rounded-full px-1.5 py-0.5 text-[11px] font-bold ${
                                isActive ? "bg-white/20 text-white" : "bg-violet-50 text-violet-500"
                            }`}>
                                {count}
                            </span>
                        </Link>
                    );
                })}
            </div>

            {/* ─── Liste des demandes ─── */}
            {demandes.length > 0 ? (
                <div className="mt-6 grid gap-4">
                    {demandes.map((demande) => (
                        <DemandeCard key={demande.id} demande={demande} />
                    ))}
                </div>
            ) : (
                <EmptyState
                    className="mt-6"
                    Icon={ClipboardList}
                    titre="Aucune demande dans cette catégorie"
                    texte="Vous n'avez aucune demande avec ce statut pour le moment. Déposez une nouvelle demande de réservation pour vos bénéficiaires."
                    action={{ href: "/partenaire/ateliers/ajouter", label: "Nouvelle demande", Icon: CalendarPlus }}
                />
            )}
        </div>
    );
}
