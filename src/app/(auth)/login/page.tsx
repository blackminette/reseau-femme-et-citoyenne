import React from 'react';
import { loginAction } from './actions';

type LoginPageProps = {
    searchParams?: Promise<Record<string, string | string[] | undefined>>;
};

export default async function LoginPage({ searchParams }: LoginPageProps) {
    const resolvedSearchParams = searchParams ? await searchParams : {};
    const errorParam = resolvedSearchParams.error;
    const error = typeof errorParam === 'string' ? errorParam : null;

    return (
        <div className="min-h-screen bg-slate-100 flex flex-col items-center justify-center p-6">
            <div className="max-w-md w-full bg-white rounded-xl shadow-md border border-slate-200 p-8">
                <div className="text-center mb-8">
                    <h1 className="text-2xl font-bold text-slate-800">Bienvenue</h1>
                    <p className="text-slate-500 text-sm mt-1">
                        Connectez-vous pour acceder a votre espace personnalise
                    </p>
                </div>

                {error && (
                    <div className="mb-4 p-3 bg-red-50 text-red-700 text-sm rounded-lg border border-red-200">
                        Attention : {error}
                    </div>
                )}

                <form action={loginAction} className="space-y-5">
                    <div>
                        <label htmlFor="email" className="block text-sm font-medium text-slate-700 mb-1">
                            Adresse e-mail
                        </label>
                        <input
                            id="email"
                            name="email"
                            type="email"
                            autoComplete="email"
                            required
                            placeholder="exemple@association.fr"
                            className="w-full px-3 py-2 border border-slate-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm text-slate-800"
                        />
                    </div>

                    <div>
                        <label htmlFor="password" className="block text-sm font-medium text-slate-700 mb-1">
                            Mot de passe
                        </label>
                        <input
                            id="password"
                            name="password"
                            type="password"
                            autoComplete="current-password"
                            required
                            placeholder="********"
                            className="w-full px-3 py-2 border border-slate-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm text-slate-800"
                        />
                    </div>

                    <button
                        type="submit"
                        className="w-full py-2 px-4 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-lg text-sm shadow transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:opacity-50"
                    >
                        Se connecter
                    </button>
                </form>

                <div className="mt-6 p-3 bg-amber-50 rounded-lg border border-amber-200 text-xs text-amber-800 text-center">
                    Utilise les identifiants du Seeding (admin@rfc06.fr) pour valider le processus.
                </div>
            </div>
        </div>
    );
}
