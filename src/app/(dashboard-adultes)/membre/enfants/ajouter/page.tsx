'use client';
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Save } from "lucide-react";
import PageHeader from "@/components/PageHeader";

// Style commun aux champs du formulaire.
const CHAMP = "w-full rounded-xl border border-violet-200 px-4 py-2.5 text-violet-900 placeholder:text-violet-300 focus:outline-none focus:ring-2 focus:ring-violet-500";

export default function AjouterEnfantPage() {
    const router = useRouter();
    const [form, setForm] = useState({ prenom: "", dateNaissance: "", notes: "" });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
        setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        // TODO : envoyer les données à la base de données
        router.push("/membre/enfants");
    };

    return (
        <div className="text-violet-900">

            <PageHeader
                retour={{ href: "/membre/enfants", label: "Retour aux enfants" }}
                titre="Ajouter un enfant"
                sousTitre="Renseignez les informations de l'enfant."
            />

            <form onSubmit={handleSubmit} className="mt-6 max-w-lg space-y-6 rounded-2xl border border-violet-200 bg-white p-8 shadow-xs">

                <div className="space-y-2">
                    <label htmlFor="prenom" className="block text-sm font-semibold text-violet-800">Prénom</label>
                    <input
                        id="prenom" name="prenom" type="text" required
                        value={form.prenom} onChange={handleChange}
                        placeholder="ex : Lina"
                        className={CHAMP}
                    />
                </div>

                <div className="space-y-2">
                    <label htmlFor="dateNaissance" className="block text-sm font-semibold text-violet-800">Date de naissance</label>
                    <input
                        id="dateNaissance" name="dateNaissance" type="date" required
                        value={form.dateNaissance} onChange={handleChange}
                        className={CHAMP}
                    />
                </div>

                <div className="space-y-2">
                    <label htmlFor="notes" className="block text-sm font-semibold text-violet-800">
                        Notes <span className="font-normal text-violet-400">(facultatif)</span>
                    </label>
                    <textarea
                        id="notes" name="notes" rows={3}
                        value={form.notes} onChange={handleChange}
                        placeholder="Allergies, besoins particuliers..."
                        className={`${CHAMP} resize-none`}
                    />
                </div>

                <button type="submit" className="inline-flex items-center gap-2 rounded-xl bg-violet-600 px-6 py-2.5 font-semibold text-white transition-colors hover:bg-violet-700">
                    <Save className="h-4 w-4" aria-hidden /> Enregistrer
                </button>

            </form>
        </div>
    );
}
