'use client';

import React, { useState, useEffect } from 'react';

interface AtelierProps {
  id: number;
  titre: string;
  description: string | null;
  dateDebut: string;
  dateFin: string;
  placesMax: number;
  countReservations: number;
  lieu: { nom: string; adresseTexte: string };
}

export default function PlanningClient({ initialAteliers }: { initialAteliers: AtelierProps[] }) {
  const [currentDate, setCurrentDate] = useState<Date | null>(null);

  useEffect(() => {
    // Initialisation à la date du jour (ou calée sur mai pour correspondre au visuel)
    setCurrentDate(new Date('2026-05-19'));
  }, []);

  if (!currentDate) return <div className="p-12 text-center text-purple-600 font-bold">Chargement du planning...</div>;

  const daysOfWeekLabels = ['LUNDI', 'MARDI', 'MERCREDI', 'JEUDI', 'VENDREDI', 'SAMEDI'];
  
  const timeSlots = [
    { label: '10h – 12h', startHour: 10 },
    { label: '14h – 16h', startHour: 14 },
    { label: '16h30 – 18h', startHour: 16 }
  ];

  // Calcul du lundi de la semaine courante
  const diff = currentDate.getDay() === 0 ? 6 : currentDate.getDay() - 1;
  const monday = new Date(currentDate);
  monday.setDate(currentDate.getDate() - diff);
  
  const saturday = new Date(monday);
  saturday.setDate(monday.getDate() + 5);

  const weekDays = Array.from({ length: 6 }, (_, i) => {
    const d = new Date(monday);
    d.setDate(monday.getDate() + i);
    return d;
  });

  const getAteliersForDateAndSlot = (date: Date, startHour: number) => {
    return initialAteliers.filter((a) => {
      const dDebut = new Date(a.dateDebut);
      return dDebut.toDateString() === date.toDateString() && dDebut.getHours() === startHour;
    });
  };

  return (
    <div className="w-full bg-[#fbf9fe] min-h-screen font-sans pb-20">
      
      {/* 1. HERO SECTION BANNER VIOLET DEGRADE */}
      <div className="w-full bg-gradient-to-r from-[#4d32a4] via-[#8c6ec9] to-[#bca7db] text-white py-20 px-8 relative">
        <div className="max-w-7xl mx-auto flex flex-col items-start justify-center">
          <span className="text-xs font-bold uppercase tracking-widest text-[#dfd3f7] mb-2">
            PLANNING
          </span>
          <h1 className="text-5xl font-black tracking-tight mb-3 leading-none">
            Le planning <br />de la semaine
          </h1>
          <p className="text-lg text-[#f0eaff] font-medium mb-8">
            Retrouvez tous les ateliers programmés.
          </p>
          <button className="px-6 py-3 rounded-full text-sm font-bold bg-gradient-to-r from-[#886fe6] to-[#ebc276] text-white shadow-md hover:opacity-90 transition">
            Réserver une place
          </button>
        </div>
      </div>

      {/* 2. TITRE DE LA SEMAINE EN COURS */}
      <section className="max-w-7xl mx-auto px-4 pt-16 pb-8 text-center">
        <h2 className="text-4xl font-black text-[#503d96] tracking-tight">
          Semaine du {monday.getDate()} au {saturday.getDate()} {monday.toLocaleDateString('fr-FR', { month: 'long' })}
        </h2>
        <p className="text-gray-500 text-sm mt-2 font-medium flex items-center justify-center gap-1">
          Cliquez sur un atelier pour réserver — les places sont limitées <span className="text-gray-600 text-xs">◆</span>
        </p>
      </section>

      {/* 3. GRILLE COMPACTE EN UN BLOC VIOLET INTERNE (STYLE D'ORIGINE SUBLIMÉ) */}
      <section className="max-w-7xl mx-auto px-4">
        <div className="bg-[#8b7fe7] p-6 rounded-[24px] shadow-lg overflow-x-auto">
          <div className="min-w-[1000px]">
            
            {/* Ligne En-tête des colonnes */}
            <div className="grid grid-cols-7 gap-3 mb-4 text-center">
              <div className="bg-[#6b5ec2] text-[#dfd3f7] text-[11px] font-extrabold py-2.5 rounded-xl uppercase tracking-wider">
                HORAIRES
              </div>
              {daysOfWeekLabels.map((day) => (
                <div key={day} className="bg-[#6b5ec2] text-[#dfd3f7] text-[11px] font-extrabold py-2.5 rounded-xl uppercase tracking-wider">
                  {day}
                </div>
              ))}
            </div>

            {/* Plages horaires */}
            {timeSlots.map((slot) => (
              <div key={slot.label} className="grid grid-cols-7 gap-3 mb-3 items-stretch">
                
                {/* Badge horaire blanc à gauche */}
                <div className="bg-white rounded-2xl flex items-center justify-center p-4 text-xs font-extrabold text-[#503d96] shadow-sm">
                  {slot.label}
                </div>

                {/* Génération dynamique des jours (Lundi à Samedi) */}
                {weekDays.map((wDate, idx) => {
                  const items = getAteliersForDateAndSlot(wDate, slot.startHour);
                  
                  if (items.length === 0) {
                    return (
                      <div key={idx} className="rounded-2xl bg-[#8b7fe7]/40 min-h-[110px]" />
                    );
                  }

                  const atelier = items[0];
                  const isComplet = atelier.countReservations >= atelier.placesMax;

                  return (
                    <div 
                      key={idx} 
                      className="bg-[#9c92eb] border border-[#b2a9f3] text-white rounded-2xl p-3.5 flex flex-col justify-between min-h-[110px] shadow-sm cursor-pointer hover:bg-[#a69df0] transition"
                    >
                      <div className="text-[11px] leading-tight">
                        <p className="font-extrabold text-[12px] mb-1 line-clamp-2">
                          {atelier.titre}
                        </p>
                        <p className="text-[#dfd3f7] font-semibold text-[10px]">
                          3 – 5 ans
                        </p>
                      </div>
                      
                      <div className="text-[10px] mt-2 pt-1 border-t border-[#b2a9f3]/40">
                        {isComplet ? (
                          <span className="text-[#ffd3d3] font-bold uppercase tracking-wide">Complet</span>
                        ) : (
                          <span className="text-[#f2effd] font-medium">
                            {atelier.placesMax - atelier.countReservations} places restantes
                          </span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            ))}

          </div>
        </div>

        {/* 4. LEGENDE BAS DE PAGE */}
        <div className="flex flex-wrap items-center justify-center gap-6 mt-8 text-[11px] text-gray-500 font-semibold tracking-wide">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-gray-600"></span> Atelier créatif
          </div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-gray-600"></span> Cuisine & nature
          </div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-gray-600"></span> Expression & jeux
          </div>
          <div className="text-gray-400 font-medium ml-2">
            ⏱ Durée : 1h30 à 2h
          </div>
          <div className="text-gray-400 font-medium">
            🔸 Goûter inclus
          </div>
        </div>
      </section>

    </div>
  );
}