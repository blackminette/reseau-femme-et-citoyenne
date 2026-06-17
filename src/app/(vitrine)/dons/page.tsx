// * src/app/(vitrine)/dons/page.tsx
'use client';

import React from 'react';

export default function DonsPage() {
    return (
        <div className="min-h-screen bg-slate-50">
            
            {/* 2. SECTION HERO */}
            <section className="py-20 px-4 text-center">
                <h1 className="text-4xl md:text-5xl font-black text-[#260936] mb-4">Nous soutenir</h1>
                <p className="text-xl text-slate-600 mb-8 max-w-2xl mx-auto">Chaque geste compte pour faire avancer nos projets et renforcer notre impact.</p>
                
                <div className="flex flex-col sm:flex-row justify-center gap-4">
                    <button className="px-8 py-3 bg-slate-500 text-white font-bold rounded-lg hover:bg-slate-600 transition">
                        Dons Financiers
                    </button>
                    <button className="px-8 py-3 bg-white text-slate-800 font-bold rounded-lg border border-slate-300 hover:bg-slate-50 transition">
                        Dons Matériels
                    </button>
                </div>
            </section>

            {/* 3. SECTION FUTURS PROJETS */}
            <section className="py-16 max-w-7xl mx-auto px-4">
                <h2 className="text-2xl font-black text-[#260936] mb-8">FUTURS PROJETS</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {/* Carte 1 */}
                    <div className="bg-slate-200 p-8 rounded-2xl flex flex-col">
                        <h3 className="text-xl font-bold text-center mb-4">Caisse Générale</h3>
                        <p className="mb-4 text-slate-700">Descriptif détaillé de la caisse générale et de son utilité pour le fonctionnement quotidien.</p>
                        <p className="text-sm font-semibold text-slate-600 mt-auto mb-6">Statut : Soutien Continu</p>
                        <button className="w-full py-3 bg-[#260936] text-white font-bold rounded-lg hover:bg-[#6026a3] transition">
                            Faire un don général
                        </button>
                    </div>
                    {/* Carte 2 */}
                    <div className="bg-slate-200 p-8 rounded-2xl flex flex-col">
                        <h3 className="text-xl font-bold text-center mb-4">(Projet Temporaire)</h3>
                        <p className="mb-2 text-slate-700">Descriptif du projet temporaire spécifique.</p>
                        <p className="mb-4 text-sm text-slate-600">(Montant cible)</p>
                        <div className="space-y-2 mb-6">
                            <p className="text-sm">Deadline : 31/12/2026</p>
                            <div className="w-full bg-slate-300 h-4 rounded-full overflow-hidden">
                                <div className="bg-[#ffd166] h-full w-[50%]"></div>
                            </div>
                            <p className="text-sm font-bold">Reste : 1500€ à collecter</p>
                        </div>
                        <button className="w-full py-3 bg-[#260936] text-white font-bold rounded-lg hover:bg-[#6026a3] transition">
                            Financer ce projet
                        </button>
                    </div>
                </div>
            </section>

            {/* 4. SECTION PROJETS REALISES */}
            <section className="py-16 max-w-7xl mx-auto px-4">
                <h2 className="text-2xl font-black text-[#260936] mb-8">PROJETS REALISES <br/> GRACE A VOS DONS</h2>
                
                <div className="flex items-center justify-between gap-4">
                    <button className="p-4 bg-white rounded-lg shadow">
                        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6"/></svg>
                    </button>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 flex-grow">
                        <div className="h-64 bg-slate-200 rounded-lg"></div>
                        <div className="h-64 bg-slate-200 rounded-lg"></div>
                        <div className="h-64 bg-slate-200 rounded-lg"></div>
                    </div>
                    
                    <button className="p-4 bg-white rounded-lg shadow">
                        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m9 18 6-6-6-6"/></svg>
                    </button>
                </div>
            </section>

            {/* 5. FOOTER / ENCART D'INFORMATIONS */}
            <section className="py-16 px-4">
                <div className="max-w-4xl mx-auto bg-slate-200 p-8 rounded-2xl text-center space-y-4">
                    <p className="text-slate-800 font-medium">Déduction fiscale : Votre don ouvre droit à une réduction d'impôt de 66% sur le revenu.</p>
                    <p className="text-slate-700 text-sm italic">Transparence : En validant votre don, vous acceptez que si l'objectif d'un projet n'est pas atteint ou s'il est dépassé, l'association réaffecte les fonds vers un projet similaire.</p>
                </div>
            </section>
        </div>
    );
}
