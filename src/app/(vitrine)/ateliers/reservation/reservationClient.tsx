'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';

interface AtelierProps {
  id: string | number;
  titre: string;
  description: string | null;
  ageText?: string;
}

export default function ReservationClient({ initialAteliers }: { initialAteliers: AtelierProps[] }) {
  const router = useRouter();

  const [formData, setFormData] = useState({
    nom: '',
    email: '',
    telephone: '',
    atelierId: '',
  });

  const handleContactRedirection = () => {
    router.push('/contact');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Formulaire soumis avec les vraies données de la BDD :', formData);
    // Ici tu pourras brancher ta Server Action pour enregistrer en BDD
  };

  return (
    <div className="w-full bg-[#fbf9fe] min-h-screen font-sans pb-20">
      
      {/* HERO BANNER */}
      <div className="w-full bg-gradient-to-r from-[#4d32a4] via-[#8c6ec9] to-[#bca7db] text-white py-12 md:py-20 px-6 md:px-8">
        <div className="max-w-6xl mx-auto flex flex-col items-start justify-center">
          <span className="text-xs font-bold uppercase tracking-widest text-[#dfd3f7] mb-2">
            ATELIERS
          </span>
          <h1 className="text-3xl md:text-5xl font-black tracking-tight mb-3 leading-tight md:leading-none">
            Réserver un atelier
          </h1>
          <p className="text-sm md:text-lg text-[#f0eaff] font-medium max-w-xl">
            Sélectionnez un atelier réel issu de notre planning pour bloquer votre place.
          </p>
          <button 
            onClick={handleContactRedirection}
            className="mt-6 px-6 py-2.5 rounded-full text-xs font-bold bg-white/20 text-white border border-white/40 hover:bg-white/30 transition"
          >
            Nous contacter
          </button>
        </div>
      </div>

      {/* ZONE PRINCIPALE */}
      <main className="max-w-6xl mx-auto px-4 pt-12">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
          
          {/* COLONNE GAUCHE : LES ATELIERS DE LA BDD */}
          <div className="md:col-span-6 lg:col-span-7 space-y-4">
            <h2 className="text-2xl md:text-3xl font-black text-[#503d96] tracking-tight mb-6">
              Nos ateliers disponibles
            </h2>
            
            <div className="space-y-4">
              {initialAteliers.length === 0 ? (
                <p className="text-gray-500 text-sm italic bg-white p-6 rounded-2xl border border-purple-100">
                  Aucun atelier n'est programmé pour le moment.
                </p>
              ) : (
                initialAteliers.map((atelier) => (
                  <div 
                    key={atelier.id}
                    onClick={() => setFormData({ ...formData, atelierId: atelier.id.toString() })}
                    className={`bg-white rounded-2xl p-6 shadow-sm border transition hover:shadow-md cursor-pointer ${
                      formData.atelierId === atelier.id.toString() 
                        ? 'border-[#8b7fe7] ring-2 ring-[#8b7fe7]/20 bg-purple-50/10' 
                        : 'border-purple-100/60'
                    }`}
                  >
                    <h3 className="text-gray-800 font-bold text-lg leading-snug">
                      {atelier.titre}
                    </h3>
                    <p className="text-gray-400 text-sm mt-1">
                      {atelier.description || "Aucune description fournie."}
                    </p>
                    <span className="inline-block text-[#8b7fe7] font-bold text-xs mt-3 bg-purple-50 px-2.5 py-1 rounded-md">
                      {atelier.ageText}
                    </span>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* COLONNE DROITE : LE FORMULAIRE */}
          <div className="md:col-span-6 lg:col-span-5 w-full">
            <div className="bg-white rounded-[32px] p-6 md:p-8 shadow-sm border border-purple-100/50">
              <h2 className="text-xl md:text-2xl font-black text-[#503d96] tracking-tight mb-6">
                Réserver une place
              </h2>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-[#503d96] uppercase tracking-wider mb-2">
                    Nom
                  </label>
                  <input
                    type="text"
                    placeholder="Marie Dupont"
                    className="w-full bg-[#fbf9fe] border border-purple-100/80 rounded-xl px-4 py-3 text-sm text-gray-700 placeholder-gray-400 focus:outline-none focus:border-[#8b7fe7] transition"
                    value={formData.nom}
                    onChange={(e) => setFormData({ ...formData, nom: e.target.value })}
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#503d96] uppercase tracking-wider mb-2">
                    Email
                  </label>
                  <input
                    type="email"
                    placeholder="marie@exemple.fr"
                    className="w-full bg-[#fbf9fe] border border-purple-100/80 rounded-xl px-4 py-3 text-sm text-gray-700 placeholder-gray-400 focus:outline-none focus:border-[#8b7fe7] transition"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#503d96] uppercase tracking-wider mb-2">
                    Téléphone
                  </label>
                  <input
                    type="tel"
                    placeholder="06 12 34 56 78"
                    className="w-full bg-[#fbf9fe] border border-purple-100/80 rounded-xl px-4 py-3 text-sm text-gray-700 placeholder-gray-400 focus:outline-none focus:border-[#8b7fe7] transition"
                    value={formData.telephone}
                    onChange={(e) => setFormData({ ...formData, telephone: e.target.value })}
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#503d96] uppercase tracking-wider mb-2">
                    Atelier sélectionné
                  </label>
                  <select
                    className="w-full bg-[#fbf9fe] border border-purple-100/80 rounded-xl px-4 py-3 text-sm text-gray-600 focus:outline-none focus:border-[#8b7fe7] transition appearance-none"
                    value={formData.atelierId}
                    onChange={(e) => setFormData({ ...formData, atelierId: e.target.value })}
                    required
                  >
                    <option value="">Choisir un atelier</option>
                    {initialAteliers.map((a) => (
                      <option key={a.id} value={a.id.toString()}>{a.titre}</option>
                    ))}
                  </select>
                </div>

                <div className="pt-4">
                  <button
                    type="submit"
                    className="w-full py-3.5 rounded-full text-sm font-bold bg-[#7461db] hover:bg-[#624ebd] text-white shadow-md transition tracking-wide"
                  >
                    Envoyer la demande
                  </button>
                </div>
              </form>
            </div>
          </div>

        </div>
      </main>

    </div>
  );
}