'use client'; // nécessaire car cette page contient un formulaire interactif
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Save } from "lucide-react";

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
        <div className="space-y-8">

            <header className="space-y-1">
                {/* Lien retour vers la liste des enfants */}
                <Link href="/membre/enfants" className="inline-flex items-center gap-1.5 text-sm text-slate-500 hover:text-indigo-600 transition-colors mb-2">
                    <ArrowLeft className="w-4 h-4" aria-hidden /> Retour aux enfants
                </Link>
                <h1 className="text-3xl font-extrabold text-slate-900">Ajouter un enfant</h1>
                <p className="text-slate-500">Renseignez les informations de l'enfant.</p>
            </header>

            <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8 space-y-6 max-w-lg">

                <div className="space-y-2">
                    <label htmlFor="prenom" className="block text-sm font-semibold text-slate-700">Prénom</label>
                    <input
                        id="prenom" name="prenom" type="text" required
                        value={form.prenom} onChange={handleChange}
                        placeholder="ex : Lina"
                        className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                </div>

                <div className="space-y-2">
                    <label htmlFor="dateNaissance" className="block text-sm font-semibold text-slate-700">Date de naissance</label>
                    <input
                        id="dateNaissance" name="dateNaissance" type="date" required
                        value={form.dateNaissance} onChange={handleChange}
                        className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                </div>

                <div className="space-y-2">
                    <label htmlFor="notes" className="block text-sm font-semibold text-slate-700">
                        Notes <span className="text-slate-400 font-normal">(facultatif)</span>
                    </label>
                    <textarea
                        id="notes" name="notes" rows={3}
                        value={form.notes} onChange={handleChange}
                        placeholder="Allergies, besoins particuliers..."
                        className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none"
                    />
                </div>

                <button type="submit" className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full font-semibold text-white bg-indigo-600 hover:bg-indigo-700 transition-colors">
                    <Save className="w-4 h-4" aria-hidden /> Enregistrer
                </button>

            </form>
        </div>
    );
}
