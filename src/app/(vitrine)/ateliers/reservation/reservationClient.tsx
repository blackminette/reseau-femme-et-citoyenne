'use client';

import React, { useState } from 'react';
import { useActionState } from 'react';
import { reserverAtelier } from './reservation';

interface Enfant { id: string; prenom: string; }
interface User { id: string; prenom: string; enfants: Enfant[]; }

export default function ReservationClient({ initialAteliers, user }: { initialAteliers: any[], user: User | null }) {
  const [state, action] = useActionState(reserverAtelier, { success: false, message: '' });
  const [selectedId, setSelectedId] = useState('');
  const [mode, setMode] = useState<'MOI' | 'ENFANT' | 'INVITE'>('MOI');

  // Si utilisateur non connecté, on force le mode INVITE
  const currentUser = user || { id: "", prenom: "Invité", enfants: [] };

  return (
    <div className="w-full bg-[#fbf9fe] min-h-screen pb-20">
      <main className="max-w-4xl mx-auto px-4 pt-12">
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

          {/* ID de la personne ou null si invité */}
          <input type="hidden" name="utilisateurId" value={
            mode === 'INVITE' ? "" : (mode.startsWith('ENFANT') ? mode.split('_')[1] : currentUser.id)
          } />

          {/* Champs obligatoires pour invité ou si non connecté */}
          {(mode === 'INVITE' || !user) && (
            <div className="space-y-4 mb-4">
              <input name="nom" placeholder="Nom complet" required className="w-full p-3 border rounded-xl" />
              <input name="email" type="email" placeholder="Email" required className="w-full p-3 border rounded-xl" />
            </div>
          )}

          <select value={selectedId} onChange={(e) => setSelectedId(e.target.value)} required className="w-full p-3 border rounded-xl mb-4">
            <option value="">Choisir un atelier</option>
            {initialAteliers.map((a) => <option key={a.id} value={a.id}>{a.titre}</option>)}
          </select>

          <button type="submit" className="w-full py-4 rounded-full bg-[#7461db] text-white font-bold">
            Confirmer
          </button>
        </form>
      </main>
    </div>
  );
}