// * src/app/(vitrine)/dons-materiels/page.tsx
'use client';

import React from 'react';

export default function DonsMaterielsPage() {
    return (
        <div className="min-h-screen bg-[#eedeff] pb-20">
            
            {/* 2. SECTION HERO */}
            <section className="py-20 px-4 text-center">
                <h1 className="text-4xl md:text-5xl font-black text-[#260936] mb-4">Nous soutenir</h1>
                <p className="text-xl text-[#260936]/80 mb-8 max-w-2xl mx-auto">Chaque geste compte pour faire avancer nos projets et renforcer notre impact.</p>
                
                <div className="flex flex-col sm:flex-row justify-center gap-4">
                    <a href="/dons" className="px-8 py-3 bg-white text-[#260936] font-bold rounded-full transition hover:bg-slate-100">
                        Dons Financiers
                    </a>
                    <a href="/dons-materiels" className="px-8 py-3 bg-[#260936] text-white font-bold rounded-full transition hover:scale-105 shadow-xl">
                        Dons Matériels
                    </a>
                </div>
            </section>

            {/* 3. SECTION WISHLIST DES ATELIERS */}
            <section className="py-16 max-w-7xl mx-auto px-4">
                <h2 className="text-2xl font-black text-[#260936] mb-8">WISHLIST DES ATELIERS</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {/* Carte 1 */}
                    <div className="bg-white p-8 rounded-2xl flex flex-col gap-4 shadow-xl border border-[#bc96e6]/20">
                        <div className="space-y-2 text-[#260936]">
                            <p className="font-black">Pour : Atelier Découverte Robotique</p>
                            <p className="font-medium text-slate-600">Date : Samedi 14 Octobre</p>
                            <p className="font-medium text-slate-600">Besoin : Kits Arduino Uno (ou equiv.)</p>
                        </div>
                        <div className="space-y-2 py-4">
                            <div className="w-full bg-slate-100 h-4 rounded-full overflow-hidden">
                                <div className="bg-[#260936] h-full" style={{ width: '60%' }}></div>
                            </div>
                            <p className="text-sm font-black text-[#260936]">3 / 5 collectés</p>
                        </div>
                        <button className="w-full py-3 bg-[#260936] text-white font-black rounded-full hover:bg-[#6026a3] transition mt-auto">
                            Je promets d'en apporter
                        </button>
                    </div>
                    {/* Carte 2 */}
                    <div className="bg-white p-8 rounded-2xl flex flex-col gap-4 shadow-xl border border-[#bc96e6]/20">
                        <div className="space-y-2 text-[#260936]">
                            <p className="font-black">Pour : Atelier 2</p>
                            <p className="font-medium text-slate-600">Date : XX/XX/XXXX</p>
                            <p className="font-medium text-slate-600">Besoin : ...</p>
                        </div>
                        <div className="space-y-2 py-4">
                            <div className="w-full bg-slate-100 h-4 rounded-full overflow-hidden">
                                <div className="bg-[#260936] h-full" style={{ width: '0%' }}></div>
                            </div>
                            <p className="text-sm font-black text-[#260936]">0 / X collectés</p>
                        </div>
                        <button className="w-full py-3 bg-[#260936] text-white font-black rounded-full hover:bg-[#6026a3] transition mt-auto">
                            Je promets d'en apporter
                        </button>
                    </div>
                </div>
            </section>

            {/* 4. SECTION PROPOSITION DE DON MATÉRIEL LIBRE */}
            <section className="py-16 max-w-7xl mx-auto px-4">
                <h2 className="text-2xl font-black text-[#260936] mb-8">PROPOSITION DE DON MATÉRIEL LIBRE</h2>
                <div className="bg-white p-8 rounded-2xl shadow-xl border border-[#bc96e6]/20">
                    <p className="mb-6 text-slate-700 font-medium">Votre matériel ne figure pas dans la liste mais peut nous être utile ? (Écrans, composants, etc.)</p>
                    
                    <div className="space-y-4">
                        <label className="block text-sm font-black text-[#260936] uppercase tracking-wider">Décrivez votre équipement :</label>
                        <textarea 
                            className="w-full p-4 rounded-xl border border-slate-200 bg-slate-50 focus:border-[#260936] focus:ring-1 focus:ring-[#260936] transition-all" 
                            rows={4}
                            placeholder="[ Ex: Je souhaite donner un vieil écran d'ordinateur Asus 24 pouces fonctionnel... ]"
                        ></textarea>
                        
                        <input 
                            type="text" 
                            className="w-full p-4 rounded-xl border border-slate-200 bg-slate-50 focus:border-[#260936] focus:ring-1 focus:ring-[#260936] transition-all" 
                            placeholder="[ Ex: Quantité : 1 ]"
                        />
                        
                        <button className="px-8 py-3 bg-[#260936] text-white font-black rounded-full hover:bg-[#6026a3] transition">
                            Soumettre ma proposition de don libre
                        </button>
                        
                        <p className="text-xs text-slate-500 font-medium">* Les propositions libres sont soumises à la validation de l'équipe technique de l'association.</p>
                    </div>
                </div>
            </section>

            {/* 5. SECTION NOTES DE DÉPÔT */}
            <section className="py-8 max-w-7xl mx-auto px-4 text-[#260936] space-y-2 font-medium">
                <p>Note de dépôt : Toute promesse de matériel génère un pense-bête sur votre Tableau de Bord.</p>
                <p>Le matériel est à déposer physiquement dans nos locaux lors de votre prochaine venue.</p>
            </section>
        </div>
    );
}
