// * src/app/(dashboard-adultes)/membre/enfants/ajouter/page.tsx
'use client'; // nécessaire car cette page contient un formulaire interactif
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Save } from "lucide-react";

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

            {/* Lien retour */}
            <Link href="/membre/enfants" className="inline-flex items-center gap-1.5 text-sm text-violet-500 transition-colors hover:text-violet-700">
                <ArrowLeft className="h-4 w-4" aria-hidden /> Retour aux enfants
            </Link>

            {/* En-tête */}
            <div className="mt-3 flex flex-col gap-1 border-b border-violet-200 pb-5">
                <h1 className="text-3xl font-bold tracking-tight text-violet-950">Ajouter un enfant</h1>
                <p className="text-sm text-violet-600">Renseignez les informations de l&apos;enfant.</p>
            </div>

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
