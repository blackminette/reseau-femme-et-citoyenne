// * src/app/premire-connexion/page.tsx
'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { changerMotDePasseInitial } from './actions';
import { Lock, Eye, EyeOff, CheckCircle2 } from 'lucide-react';

export default function PremiereConnexionPage() {
    const router = useRouter();
    const [mdp, setMdp] = useState('');
    const [confirmMdp, setConfirmMdp] = useState('');
    const [showMdp, setShowMdp] = useState(false);

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [erreur, setErreur] = useState<string | null>(null);
    const [success, setSuccess] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setErreur(null);

        if (mdp.length < 6) {
            setErreur("Le mot de passe doit contenir au moins 6 caractères.");
            return;
        }

        if (mdp !== confirmMdp) {
            setErreur("Les deux mots de passe ne correspondent pas.");
            return;
        }

        setIsSubmitting(true);
        const reponse = await changerMotDePasseInitial(mdp);

        if (reponse.success) {
            setSuccess(true);
            setTimeout(() => {
                router.push('/');
                router.refresh();
            }, 1500);
        } else {
            setErreur(reponse.error || "Impossible de mettre à jour le mot de passe.");
            setIsSubmitting(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-slate-50/50 px-4 py-12">
            <div className="w-full max-w-md bg-white border border-violet-100 rounded-2xl shadow-xl p-8 space-y-6">

                {/* En-tête */}
                <div className="text-center">
                    <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-violet-100 text-violet-600 mb-4">
                        <Lock className="h-6 w-6" />
                    </div>
                    <h1 className="text-2xl font-bold text-violet-950 tracking-tight">Première connexion</h1>
                    <p className="text-sm text-slate-500 mt-2">
                        Pour des raisons de sécurité, vous devez personnaliser votre mot de passe avant d'accéder à votre espace.
                    </p>
                </div>

                {success ? (
                    /* Écran de succès */
                    <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4 flex flex-col items-center text-center space-y-2 animate-fadeIn">
                        <CheckCircle2 className="h-8 w-8 text-emerald-600" />
                        <h3 className="font-semibold text-emerald-900 text-sm">Mot de passe enregistré !</h3>
                        <p className="text-xs text-emerald-700">Redirection vers votre tableau de bord...</p>
                    </div>
                ) : (
                    <form onSubmit={handleSubmit} className="space-y-4">

                        {erreur && (
                            <div className="bg-rose-50 border border-rose-200 text-rose-700 px-4 py-2.5 rounded-xl text-xs font-medium">
                                {erreur}
                            </div>
                        )}

                        {/* Champ : Nouveau Mot de Passe */}
                        <div>
                            <label className="block text-xs font-semibold text-violet-900 uppercase tracking-wider mb-1">
                                Nouveau mot de passe
                            </label>
                            <div className="relative">
                                <input
                                    type={showMdp ? "text" : "password"}
                                    value={mdp}
                                    onChange={(e) => setMdp(e.target.value)}
                                    placeholder="••••••••"
                                    disabled={isSubmitting}
                                    className="w-full pl-4 pr-10 py-2.5 bg-white border border-slate-200 rounded-xl text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500 transition-all disabled:opacity-50"
                                    required
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowMdp(!showMdp)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-violet-600 transition-colors"
                                >
                                    {showMdp ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                </button>
                            </div>
                        </div>

                        {/* Champ : Confirmation */}
                        <div>
                            <label className="block text-xs font-semibold text-violet-900 uppercase tracking-wider mb-1">
                                Confirmer le mot de passe
                            </label>
                            <input
                                type={showMdp ? "text" : "password"}
                                value={confirmMdp}
                                onChange={(e) => setConfirmMdp(e.target.value)}
                                placeholder="••••••••"
                                disabled={isSubmitting}
                                className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500 transition-all disabled:opacity-50"
                                required
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="w-full py-2.5 bg-violet-600 text-white rounded-xl shadow-md font-medium text-sm hover:bg-violet-700 focus:outline-none focus:ring-2 focus:ring-violet-500/40 transition-all disabled:opacity-50 cursor-pointer text-center flex items-center justify-center"
                        >
                            {isSubmitting ? "Enregistrement..." : "Définir mon mot de passe"}
                        </button>
                    </form>
                )}
            </div>
        </div>
    );
}