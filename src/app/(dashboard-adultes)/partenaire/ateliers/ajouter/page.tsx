'use client';
// * src/app/(dashboard-adultes)/partenaire/ateliers/ajouter/page.tsx
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Send } from "lucide-react";
import PageHeader from "@/components/PageHeader";

// Style commun aux champs du formulaire (identique au reste de l'app).
const CHAMP = "w-full rounded-xl border border-violet-200 px-4 py-2.5 text-violet-900 placeholder:text-violet-300 focus:outline-none focus:ring-2 focus:ring-violet-500";

// Ateliers proposés à la réservation (à remplacer par la BDD).
const ATELIERS = [
    "Éveil musical",
    "Atelier lecture & contes",
    "Arts plastiques",
    "Atelier d'écriture",
    "Initiation numérique",
];

// Créneaux horaires disponibles (à remplacer par la BDD).
const CRENEAUX = [
    "09h30 – 11h00",
    "10h00 – 11h30",
    "14h00 – 15h30",
    "16h00 – 17h30",
];

export default function AjouterDemandePage() {
    const router = useRouter();
    const [form, setForm] = useState({
        atelier: "",
        date: "",
        creneau: "",
        beneficiaires: "",
        message: "",
    });

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
    ) => setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        // TODO : envoyer la demande à la base de données
        router.push("/partenaire/ateliers");
    };

    return (
        <div className="text-violet-900">

            <PageHeader
                retour={{ href: "/partenaire/ateliers", label: "Retour à mes demandes" }}
                titre="Nouvelle demande"
                sousTitre="Demandez la réservation d'un atelier pour vos bénéficiaires. L'équipe vous répondra rapidement."
            />

            <form onSubmit={handleSubmit} className="mt-6 max-w-lg space-y-6 rounded-2xl border border-violet-200 bg-white p-8 shadow-xs">

                <div className="space-y-2">
                    <label htmlFor="atelier" className="block text-sm font-semibold text-violet-800">Atelier souhaité</label>
                    <select
                        id="atelier" name="atelier" required
                        value={form.atelier} onChange={handleChange}
                        className={CHAMP}
                    >
                        <option value="" disabled>Choisir un atelier…</option>
                        {ATELIERS.map((a) => <option key={a} value={a}>{a}</option>)}
                    </select>
                </div>

                <div className="space-y-2">
                    <label htmlFor="date" className="block text-sm font-semibold text-violet-800">Date souhaitée</label>
                    <input
                        id="date" name="date" type="date" required
                        value={form.date} onChange={handleChange}
                        className={CHAMP}
                    />
                </div>

                <div className="space-y-2">
                    <label htmlFor="creneau" className="block text-sm font-semibold text-violet-800">Créneau souhaité</label>
                    <select
                        id="creneau" name="creneau" required
                        value={form.creneau} onChange={handleChange}
                        className={CHAMP}
                    >
                        <option value="" disabled>Choisir un créneau…</option>
                        {CRENEAUX.map((c) => <option key={c} value={c}>{c}</option>)}
                    </select>
                </div>

                <div className="space-y-2">
                    <label htmlFor="beneficiaires" className="block text-sm font-semibold text-violet-800">Nombre de bénéficiaires</label>
                    <input
                        id="beneficiaires" name="beneficiaires" type="number" min={1} required
                        value={form.beneficiaires} onChange={handleChange}
                        placeholder="ex : 15"
                        className={CHAMP}
                    />
                </div>

                <div className="space-y-2">
                    <label htmlFor="message" className="block text-sm font-semibold text-violet-800">
                        Précisions <span className="font-normal text-violet-400">(facultatif)</span>
                    </label>
                    <textarea
                        id="message" name="message" rows={3}
                        value={form.message} onChange={handleChange}
                        placeholder="Âge des bénéficiaires, besoins particuliers, contexte…"
                        className={`${CHAMP} resize-none`}
                    />
                </div>

                <button type="submit" className="inline-flex items-center gap-2 rounded-xl bg-violet-600 px-6 py-2.5 font-semibold text-white transition-colors hover:bg-violet-700">
                    <Send className="h-4 w-4" aria-hidden /> Envoyer la demande
                </button>

            </form>
        </div>
    );
}
