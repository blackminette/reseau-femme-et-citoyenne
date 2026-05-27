// * src/app/login/page.tsx
'use client';

import React, { useState } from 'react';
import { loginAction } from './actions';
import { useRouter } from 'next/navigation';

/**
 * Page de connexion de l'application (/login).
 * Intègre un formulaire visuel et une simulation de connexion pour les tests.
 */
export default function LoginPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError(null);

        const result = await loginAction({ email, password }); // Appel de l'action côté serveur pour traiter la connexion

        setIsLoading(false);

        if (result.success && result.role) {
            const destination = `/${result.role.toLowerCase()}`; // Redirige en fonction du rôle
            router.push(destination);

        } else {
            setError(result.error || "Une erreur est survenue lors de la connexion.");
        }
    };

    return (
        <div className="min-h-screen bg-slate-100 flex flex-col items-center justify-center p-6">
            <div className="max-w-md w-full bg-white rounded-xl shadow-md border border-slate-200 p-8">

                {/* En-tête du formulaire */}
                <div className="text-center mb-8">
                    <h1 className="text-2xl font-bold text-slate-800">Bienvenue</h1>
                    <p className="text-slate-500 text-sm mt-1">
                        Connectez-vous pour accéder à votre espace personnalisé
                    </p>
                </div>

                {/* Formulaire de connexion */}
                <form onSubmit={handleSubmit} className="space-y-5">

                    {/* Champ Email */}
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
                            className="w-full px-3 py-2 border border-slate-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm text-slate-800"
                        />
                    </div>

                    {/* Champ Mot de passe */}
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
                            className="w-full px-3 py-2 border border-slate-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm text-slate-800"
                        />
                    </div>

                    {/* Bouton de soumission */}
                    <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full py-2 px-4 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-lg text-sm shadow transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:opacity-50"
                    >
                        {isLoading ? 'Connexion en cours...' : 'Se connecter'}
                    </button>
                </form>

                {/* Note d'attente pour le projet */}
                <div className="mt-6 p-3 bg-amber-50 rounded-lg border border-amber-200 text-xs text-amber-800 text-center">
                    ⏳ En attente des identifiants Supabase de ton collègue pour l'authentification réelle.
                </div>

            </div>
        </div>
    );
}