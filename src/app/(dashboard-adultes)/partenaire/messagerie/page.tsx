'use client';
// * src/app/(dashboard-adultes)/partenaire/messagerie/page.tsx
import { useState } from "react";
import { Send } from "lucide-react";
import { CONVERSATION, PARTENAIRE, type Message } from "@/lib/partenaire-data";

export default function PartenaireMessageriePage() {
    const [messages, setMessages] = useState<Message[]>(CONVERSATION);
    const [texte, setTexte] = useState("");

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const contenu = texte.trim();
        if (!contenu) return;
        // TODO : envoyer le message à la base de données
        setMessages((prev) => [
            ...prev,
            { id: Date.now(), auteur: "moi", nom: PARTENAIRE.organisation, texte: contenu, heure: "À l'instant" },
        ]);
        setTexte("");
    };

    return (
        <div className="flex flex-col text-violet-900">

            {/* En-tête de la conversation */}
            <div className="flex items-center gap-3 border-b border-violet-200 pb-4">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-violet-500 to-purple-600 text-sm font-bold text-white">
                    RFC
                </div>
                <div>
                    <h1 className="text-lg font-bold tracking-tight text-violet-950">Équipe Réseau Femme &amp; Citoyenne</h1>
                    <p className="text-xs text-violet-500">Votre interlocuteur pour les réservations d&apos;ateliers</p>
                </div>
            </div>

            {/* Fil des messages (zone de défilement à hauteur fixe, robuste mobile/desktop) */}
            <div className="flex h-[60vh] flex-col gap-3 overflow-y-auto py-5">
                {messages.map((m) => {
                    const estMoi = m.auteur === "moi";
                    return (
                        <div key={m.id} className={`flex flex-col ${estMoi ? "items-end" : "items-start"}`}>
                            <div
                                className={`max-w-[85%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed sm:max-w-[70%] ${
                                    estMoi
                                        ? "rounded-br-md bg-violet-600 text-white"
                                        : "rounded-bl-md border border-violet-200 bg-white text-violet-900"
                                }`}
                            >
                                {!estMoi && <div className="mb-0.5 text-[11px] font-bold text-violet-500">{m.nom}</div>}
                                {m.texte}
                            </div>
                            <span className="mt-1 px-1 text-[11px] text-violet-400">{m.heure}</span>
                        </div>
                    );
                })}
            </div>

            {/* Composer */}
            <form onSubmit={handleSubmit} className="flex items-center gap-2 border-t border-violet-200 pt-4">
                <input
                    type="text"
                    value={texte}
                    onChange={(e) => setTexte(e.target.value)}
                    placeholder="Écrire un message…"
                    className="min-w-0 flex-1 rounded-xl border border-violet-200 px-4 py-2.5 text-violet-900 placeholder:text-violet-300 focus:outline-none focus:ring-2 focus:ring-violet-500"
                />
                <button
                    type="submit"
                    disabled={!texte.trim()}
                    className="inline-flex shrink-0 items-center gap-2 rounded-xl bg-violet-600 px-4 py-2.5 font-semibold text-white transition-colors hover:bg-violet-700 disabled:cursor-not-allowed disabled:opacity-50"
                    aria-label="Envoyer"
                >
                    <Send className="h-4 w-4" aria-hidden />
                    <span className="hidden sm:inline">Envoyer</span>
                </button>
            </form>
        </div>
    );
}
