// * src/app/(auth)/signup/page.tsx
'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { signupAction } from './actions';

export default function SignupPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [nom, setNom] = useState('');
    const [prenom, setPrenom] = useState('');
    const [telephone, setTelephone] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const router = useRouter();


    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        
        if (!email || !password || !confirmPassword || !nom || !prenom) {
            setError("Veuillez remplir tous les champs obligatoires.");
            return;
        }

        if (password !== confirmPassword) {
            setError("Les mots de passe ne correspondent pas.");
            return;
        }

        setIsLoading(true);

        try {
            const result = await signupAction({
                email,
                password,
                confirmPassword,
                nom,
                prenom,
                telephone
            });

            if (result.success) {
                alert("Inscription réussie ! Vous pouvez maintenant vous connecter.");
                router.push('/login');
            } else {
                setError(result.error || "Une erreur est survenue.");
            }
        } catch (err) {
            setError("Une erreur inattendue est survenue.");
            console.error(err);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-slate-100 flex flex-col items-center justify-center p-6">
            <div className="max-w-md w-full bg-white rounded-xl shadow-md border border-slate-200 p-8">
                <h1 className="text-2xl font-bold text-center text-slate-800 mb-6">Inscription</h1>
                
                {error && (
                    <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit}>
                    <div className="grid grid-cols-2 gap-4 mb-4">
                        <div>
                            <label htmlFor="prenom" className="block text-sm font-medium text-slate-700 mb-1">
                                Prénom
                            </label>
                            <input
                                type="text"
                                id="prenom"
                                value={prenom}
                                onChange={(e) => setPrenom(e.target.value)}
                                required
                                className="w-full border border-slate-300 rounded-md py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                placeholder="Prénom"
                            />
                        </div>
                        <div>
                            <label htmlFor="nom" className="block text-sm font-medium text-slate-700 mb-1">
                                Nom
                            </label>
                            <input
                                type="text"
                                id="nom"
                                value={nom}
                                onChange={(e) => setNom(e.target.value)}
                                required
                                className="w-full border border-slate-300 rounded-md py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                placeholder="Nom"
                            />
                        </div>
                    </div>

                    <div className="mb-4">
                        <label htmlFor="telephone" className="block text-sm font-medium text-slate-700 mb-1">
                            Téléphone (optionnel)
                        </label>
                        <input
                            type="tel"
                            id="telephone"
                            value={telephone}
                            onChange={(e) => setTelephone(e.target.value)}
                            className="w-full border border-slate-300 rounded-md py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="06 00 00 00 00"
                        />
                    </div>

                    <div className="mb-4">
                        <label htmlFor="email" className="block text-sm font-medium text-slate-700 mb-1">
                            Email
                        </label>
                        <input
                            type="email"
                            id="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            className="w-full border border-slate-300 rounded-md py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="votre@email.com"
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
                            required
                            minLength={6}
                            className="w-full border border-slate-300 rounded-md py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="6 caractères min."
                        />
                    </div>
                    <div className="mb-6">
                        <label htmlFor="confirmPassword" className="block text-sm font-medium text-slate-700 mb-1">
                            Confirmez le mot de passe
                        </label>
                        <input
                            type="password"
                            id="confirmPassword"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            required
                            minLength={6}
                            className="w-full border border-slate-300 rounded-md py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="Répétez le mot de passe"
                        />
                    </div>
                    <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {isLoading ? 'Inscription en cours...' : 'S\'inscrire'}
                    </button>
                </form>
                
                <p className="mt-4 text-center text-sm text-slate-600">
                    Déjà un compte ?{' '}
                    <button 
                        onClick={() => router.push('/login')}
                        className="text-blue-500 hover:underline focus:outline-none"
                    >
                        Se connecter
                    </button>
                </p>
            </div>
        </div>
    );
}
