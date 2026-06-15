// * src/app/(auth)/login/page.tsx
'use client';

/**
 * Page du formulaire de connexion de l'application.
 * Elle envoie les identifiants à une action serveur pour authentifier l'utilisateur,
 * puis elle synchronise manuellement la session obtenue avec le client Supabase
 * pour mettre à jour instantanément l'état du Header avant la redirection.
 */

import React, { useState } from 'react';
import { loginAction } from './actions';
import { useRouter } from 'next/navigation';
import { supabaseClient } from '@/lib/supabaseClient';

export default function LoginPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const router = useRouter();

    // Gestion de la soumission du formulaire
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError(null);

        // Appel du traitement de connexion côté serveur
        const result = await loginAction({ email, password });

        if (result.success && result.role) {
            console.log("Connexion serveur réussie !");

            try {
                // Récupération de la session créée par le serveur
                const { data: { session } } = await supabaseClient.auth.getSession();

                // Injection de la session côté client pour synchroniser le Header
                if (session) {
                    await supabaseClient.auth.setSession({
                        access_token: session.access_token,
                        refresh_token: session.refresh_token
                    });
                } else {
                    await supabaseClient.auth.refreshSession();
                }
            } catch (syncError) {
                console.warn("Erreur de synchronisation client/serveur :", syncError);
            }

            // Rafraîchissement des composants serveur de la page
            router.refresh();

            // Redirection vers le tableau de bord lié au rôle
            const destination = `/${result.role.toLowerCase()}`;
            router.push(destination);

        } else {
            setIsLoading(false);
            setError(result.error || "Une erreur est survenue lors de la connexion.");
        }
    };

    return (
        <div className="min-h-screen bg-slate-100 flex flex-col items-center justify-center p-6">
            <div className="max-w-md w-full bg-white rounded-xl shadow-md border border-slate-200 p-8">

                {/* En-tête de la carte */}
                <div className="text-center mb-8">
                    <h1 className="text-2xl font-bold text-slate-800">Bienvenue</h1>
                    <p className="text-slate-500 text-sm mt-1">
                        Connectez-vous pour accéder à votre espace personnalisé
                    </p>
                </div>

                {/* Affichage de l'erreur */}
                {error && (
                    <div className="mb-4 p-3 bg-red-50 text-red-700 text-sm rounded-lg border border-red-200">
                        Attention : {error}
                    </div>
                )}

                {/* Formulaire */}
                <form onSubmit={handleSubmit} className="space-y-5">
                    <div>
                        <label htmlFor="email" className="block text-sm font-medium text-slate-700 mb-1">
                            Adresse e-mail
                        </label>
                        <input
                            id="email"
                            type="email"
                            required
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="exemple@association.fr"
                            className="w-full px-3 py-2 border border-slate-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm text-slate-800"
                        />
                    </div>

                    <div>
                        <label htmlFor="password" className="block text-sm font-medium text-slate-700 mb-1">
                            Mot de passe
                        </label>
                        <input
                            id="password"
                            type="password"
                            required
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="••••••••"
                            className="w-full px-3 py-2 border border-slate-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm text-slate-800"
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full py-2 px-4 bg-blue-500 hover:bg-blue-600 text-white font-medium rounded-lg text-sm shadow transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
                    >
                        {isLoading ? 'Connexion en cours...' : 'Se connecter'}
                    </button>
                </form>

                <p className="mt-6 text-center text-sm text-slate-600">
                    Pas encore de compte ?{' '}
                    <button 
                        onClick={() => router.push('/signup')}
                        className="text-blue-500 hover:underline focus:outline-none"
                    >
                        S'inscrire
                    </button>
                </p>

                {/* Note informative de test */}
                <div className="mt-6 p-3 bg-amber-50 rounded-lg border border-amber-200 text-xs text-amber-800 text-center">
                    Utilise les identifiants du Seeding (admin@rfc06.fr) pour valider le processus.
                </div>

            </div>
        </div>
    );
}