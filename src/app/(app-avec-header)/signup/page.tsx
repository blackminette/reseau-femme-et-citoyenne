// * src/app/(app-avec-header)/sign_in/page.tsx
'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';

/**
 * Page de connexion pour les utilisateurs.
 * Permet de simuler une connexion en choisissant un rôle.
**/

export default function SignInPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        // TODO: logique d'inscription ici

        console.log('Tentative d\'inscription avec :', { email, password });

        setTimeout(() => {
            setIsLoading(false);
            alert("Le visuel du formulaire d'inscription fonctionne ! Dès que Supabase sera prêt, cette action te permettra de créer un compte pour de vrai.");
            router.push('/login'); // Redirige vers la page de connexion après l'inscription
        }, 1000);
    };

    return (
        <div className="min-h-screen bg-slate-100 flex flex-col items-center justify-center p-6">
            <div className="max-w-md w-full bg-white rounded-xl shadow-md border border-slate-200 p-8">
                <h1 className="text-2xl font-bold text-center text-slate-800 mb-6">Inscription</h1>
                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <label htmlFor="email" className="block text-sm font-medium text-slate-700 mb-1">
                            Email
                        </label>
                        <input
                            type="email"
                            id="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="border border-slate-300 rounded-md py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="Votre email"
                        />
                    </div>
                    <div className="mb-6">
                        <label htmlFor="password" className="block text-sm font-medium text-slate-700 mb-1">
                            Mot de passe
                        </label>
                        <input
                            type="password"
                            id="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="border border-slate-300 rounded-md py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="Votre mot de passe"
                        />
                    </div>
                    <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity(50)"
                    >
                        {isLoading ? 'Inscription en cours...' : 'S\'inscrire'}
                    </button>
                </form>
            </div>
        </div>
    );
}