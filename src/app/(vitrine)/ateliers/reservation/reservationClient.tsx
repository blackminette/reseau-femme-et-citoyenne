'use client';

import React, { useState, useEffect } from 'react';
import { useActionState } from 'react';
import { reserverAtelier } from './reservation';
import { useRouter } from 'next/navigation';

interface Enfant { id: string; prenom: string; }
interface User { id: string; prenom: string; enfants: Enfant[]; }

// Ajout du typage pour les ateliers basé sur ton modèle
interface Atelier {
  id: string;
  titre: string;
  dateDebut: string;
  placesMax: number;
  reservations: any[]; // Utilisé pour calculer les places restantes
}

export default function ReservationClient({ initialAteliers, user }: { initialAteliers: any[], user: User | null }) {
  const [state, action] = useActionState(reserverAtelier, { success: false, message: '' });
  const [selectedId, setSelectedId] = useState('');
  const [mode, setMode] = useState<'MOI' | 'ENFANT' | 'INVITE'>('MOI');
  const [showOverlay, setShowOverlay] = useState(false);
  const router = useRouter();

  useEffect(() => {
    if (state?.success) {
      setShowOverlay(true);
      // Optionnel : auto-fermeture après 3 secondes et refresh
      setTimeout(() => {
        router.refresh(); // Rafraîchit les données côté serveur
        setShowOverlay(false);
      }, 3000);
    }
  }, [state, router]);

  const currentUser = user || { id: "", prenom: "Invité", enfants: [] };

  return (
    
    <div className="w-full bg-[#fbf9fe] min-h-screen pb-20">
      {showOverlay && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white p-8 rounded-3xl shadow-xl text-center max-w-sm mx-4">
            <div className="text-4xl mb-4">✅</div>
            <h3 className="text-xl font-bold mb-2">Réservation confirmée !</h3>
            <p className="text-gray-600 mb-6">{state.message || "Votre inscription a bien été prise en compte."}</p>
            <button 
              onClick={() => { setShowOverlay(false); router.refresh(); }}
              className="bg-[#7461db] text-white px-6 py-2 rounded-full font-bold"
            >
              Fermer
            </button>
          </div>
        </div>
      )}

      <main className="max-w-6xl mx-auto px-4 pt-12">
        <div className="grid md:grid-cols-2 gap-8">
          
          {/* Section Liste des ateliers */}
          <div>
            <h2 className="text-2xl font-bold mb-6">Nos Ateliers</h2>
            <div className="space-y-4">
              {initialAteliers.map((atelier) => {
                const placesRestantes = atelier.placesMax - (atelier.reservations?.length || 0);
                const estComplet = placesRestantes <= 0;

                return (
                  <div 
                    key={atelier.id}
                    onClick={() => !estComplet && setSelectedId(atelier.id)}
                    className={`p-6 rounded-3xl border cursor-pointer transition-all ${
                      selectedId === atelier.id ? 'border-[#7461db] bg-[#f5f3ff]' : 'bg-white hover:shadow-md'
                    } ${estComplet ? 'opacity-50 cursor-not-allowed' : ''}`}
                  >
                    <h3 className="font-bold text-lg">{atelier.titre}</h3>
                    <div className="text-sm text-gray-600 mt-2 space-y-1">
                      <p>📅 {new Date(atelier.dateDebut).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', hour: '2-digit', minute: '2-digit' })}</p>
                      <p>✨ Places restantes : <span className={placesRestantes < 3 ? 'text-red-600 font-bold' : 'text-green-600'}>{placesRestantes}</span></p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Section Formulaire */}
          <div>
            <h2 className="text-2xl font-bold mb-6">Réserver</h2>
            <form action={action} className="bg-white p-8 rounded-3xl border shadow-sm">
              <input type="hidden" name="atelierId" value={selectedId} />
              
              {user && (
                <>
                  <label className="block text-sm font-bold mb-2">Réservation pour :</label>
                  <select onChange={(e) => setMode(e.target.value as any)} className="w-full p-3 border rounded-xl mb-4">
                    <option value="MOI">Moi-même ({user.prenom})</option>
                    {user.enfants?.map((enfant) => (
                      <option key={enfant.id} value={`ENFANT_${enfant.id}`}>Mon enfant : {enfant.prenom}</option>
                    ))}
                    <option value="INVITE">Autre personne (Invité)</option>
                  </select>
                </>
              )}

              <input type="hidden" name="utilisateurId" value={
                mode === 'INVITE' ? "" : (mode.startsWith('ENFANT') ? mode.split('_')[1] : currentUser.id)
              } />

              {(mode === 'INVITE' || !user) && (
                <div className="space-y-4 mb-4">
                  <input name="nom" placeholder="Nom complet" required className="w-full p-3 border rounded-xl" />
                  <input name="email" type="email" placeholder="Email" required className="w-full p-3 border rounded-xl" />
                </div>
              )}

              <div className="mb-4">
                <label className="block text-sm font-bold mb-2">Mode de paiement :</label>
                <select 
                  name="modePaiement" 
                  required 
                  className="w-full p-3 border rounded-xl bg-white"
                >
                  <option value="SUR_PLACE">Règlement sur place</option>
                  <option value="HELLOASSO">Paiement en ligne (HelloAsso)</option>
                </select>
              </div>

              <div className="p-3 border rounded-xl mb-4 bg-gray-50">
                {selectedId ? `Atelier sélectionné : ${initialAteliers.find(a => a.id === selectedId)?.titre}` : "Veuillez sélectionner un atelier dans la liste ci-contre."}
              </div>

              <button type="submit" disabled={!selectedId} className="w-full py-4 rounded-full bg-[#7461db] text-white font-bold disabled:opacity-50">
                Confirmer la réservation
              </button>
            </form>
          </div>

        </div>
      </main>
    </div>
  );
}