'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

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
  const router = useRouter();

  useEffect(() => {
    const aujourdhui = new Date();
    aujourdhui.setHours(0, 0, 0, 0);
    setCurrentDate(aujourdhui);
  }, []);

  if (!currentDate) return <div className="p-12 text-center text-purple-600 font-bold">Chargement du planning...</div>;

  // Modifié ici : Next.js ignore le dossier (vitrine) dans l'URL !
  const handleRedirection = () => {
    router.push('/ateliers/reservation');
  };

  const daysOfWeekLabels = ['LUNDI', 'MARDI', 'MERCREDI', 'JEUDI', 'VENDREDI', 'SAMEDI'];
  
  const timeSlots = [
    { label: '10h – 12h', startHour: 10 },
    { label: '14h – 16h', startHour: 14 },
    { label: '16h30 – 18h', startHour: 16 }
  ];

  const diff = currentDate.getDay() === 0 ? 6 : currentDate.getDay() - 1;
  const monday = new Date(currentDate);
  monday.setDate(currentDate.getDate() - diff);
  monday.setHours(0, 0, 0, 0);
  
  const saturday = new Date(monday);
  saturday.setDate(monday.getDate() + 5);
  saturday.setHours(23, 59, 59, 999);

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

  const ateliersDeLaSemaine = initialAteliers
    .filter((a) => {
      const dDebut = new Date(a.dateDebut);
      return dDebut >= monday && dDebut <= saturday;
    })
    .sort((a, b) => new Date(a.dateDebut).getTime() - new Date(b.dateDebut).getTime());

  return (
    <div className="w-full bg-[#fbf9fe] min-h-screen font-sans pb-20">
      
      {/* 1. HERO SECTION BANNER */}
      <div className="w-full bg-gradient-to-r from-[#4d32a4] via-[#8c6ec9] to-[#bca7db] text-white py-12 md:py-20 px-6 md:px-8 relative">
        <div className="max-w-7xl mx-auto flex flex-col items-start justify-center">
          <span className="text-xs font-bold uppercase tracking-widest text-[#dfd3f7] mb-2">
            PLANNING
          </span>
          <h1 className="text-3xl md:text-5xl font-black tracking-tight mb-3 leading-tight md:leading-none">
            Le planning <br className="hidden md:block" />de la semaine
          </h1>
          <p className="text-sm md:text-lg text-[#f0eaff] font-medium mb-6 md:mb-8">
            Retrouvez tous les ateliers programmés.
          </p>
          <button 
            onClick={handleRedirection}
            className="w-full md:w-auto px-6 py-3 rounded-full text-sm font-bold bg-gradient-to-r from-[#886fe6] to-[#ebc276] text-white shadow-md hover:opacity-90 transition"
          >
            Réserver une place
          </button>
        </div>
      </div>

      {/* 2. TITRE DE LA SEMAINE */}
      <section className="max-w-7xl mx-auto px-4 pt-10 md:pt-16 pb-6 md:pb-8 text-center">
        <h2 className="text-2xl md:text-4xl font-black text-[#503d96] tracking-tight">
          Semaine du {monday.getDate()} au {saturday.getDate()} {monday.toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' })}
        </h2>
        <p className="text-gray-500 text-xs md:text-sm mt-2 font-medium flex items-center justify-center flex-wrap gap-1">
          <span>Cliquez sur un atelier pour réserver</span> 
          <span className="hidden sm:inline">— les places sont limitées ◆</span>
        </p>
      </section>

      {/* 3. PLANNING RESPONSIVE */}
      <section className="max-w-7xl mx-auto px-4">
        
        {/* VERSION A : CLASSIQUE DESKTOP */}
        <div className="hidden lg:block bg-[#8b7fe7]/50 backdrop-blur-sm p-6 rounded-[24px] shadow-lg border border-[#8b7fe7]/20">
          <div className="grid grid-cols-7 gap-3 mb-4 text-center">
            <div className="bg-[#6b5ec2]/90 text-[#dfd3f7] text-[11px] font-extrabold py-2.5 rounded-xl uppercase tracking-wider">
              HORAIRES
            </div>
            {daysOfWeekLabels.map((day) => (
              <div key={day} className="bg-[#6b5ec2]/90 text-[#dfd3f7] text-[11px] font-extrabold py-2.5 rounded-xl uppercase tracking-wider">
                {day}
              </div>
            ))}
          </div>

          {timeSlots.map((slot) => (
            <div key={slot.label} className="grid grid-cols-7 gap-3 mb-3 items-stretch">
              <div className="bg-white rounded-2xl flex items-center justify-center p-4 text-xs font-extrabold text-[#503d96] shadow-sm">
                {slot.label}
              </div>

              {weekDays.map((wDate, idx) => {
                const items = getAteliersForDateAndSlot(wDate, slot.startHour);
                
                if (items.length === 0) {
                  return <div key={idx} className="rounded-2xl bg-white/15 border border-white/10 min-h-[110px]" />;
                }

                const atelier = items[0];
                const isComplet = atelier.countReservations >= atelier.placesMax;

                return (
                  <div 
                    key={idx} 
                    onClick={handleRedirection}
                    className="bg-[#9c92eb] border border-[#b2a9f3] text-white rounded-2xl p-3.5 flex flex-col justify-between min-h-[110px] shadow-sm cursor-pointer hover:bg-[#a69df0] transition"
                  >
                    <div className="text-[11px] leading-tight">
                      <p className="font-extrabold text-[12px] mb-1 line-clamp-2">
                        {atelier.titre}
                      </p>
                      <p className="text-[#dfd3f7] font-semibold text-[10px]">3 – 5 ans</p>
                    </div>
                    <div className="text-[10px] mt-2 pt-1 border-t border-[#b2a9f3]/40">
                      {isComplet ? (
                        <span className="text-[#ffd3d3] font-bold uppercase tracking-wide">Complet</span>
                      ) : (
                        <span className="text-[#f2effd] font-medium">
                          {atelier.placesMax - atelier.countReservations} places
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          ))}
        </div>

        {/* VERSION B : TABLETTE */}
        <div className="hidden sm:block lg:hidden bg-white rounded-[32px] p-8 shadow-sm border border-purple-100/50">
          <div className="grid grid-cols-3 gap-4 mb-6">
            <div className="bg-[#8572E3] text-white text-center font-bold py-3.5 rounded-xl text-xs uppercase tracking-wider">Jour</div>
            <div className="bg-[#8572E3] text-white text-center font-bold py-3.5 rounded-xl text-xs uppercase tracking-wider">Horaire</div>
            <div className="bg-[#8572E3] text-white text-center font-bold py-3.5 rounded-xl text-xs uppercase tracking-wider">Atelier</div>
          </div>

          <div className="space-y-4">
            {ateliersDeLaSemaine.map((atelier) => {
              const dateAtelier = new Date(atelier.dateDebut);
              const nomJour = dateAtelier.toLocaleDateString('fr-FR', { weekday: 'long' });
              const formatHoraire = `${dateAtelier.getHours()}h – ${new Date(atelier.dateFin).getHours()}h`;

              return (
                <div 
                  key={atelier.id} 
                  onClick={handleRedirection}
                  className="grid grid-cols-3 gap-4 text-center items-stretch cursor-pointer hover:opacity-80 transition"
                >
                  <div className="border border-purple-100 bg-white text-gray-600 py-4 rounded-xl font-semibold capitalize text-sm flex items-center justify-center">
                    {nomJour}
                  </div>
                  <div className="border border-purple-100 bg-white text-gray-500 py-4 rounded-xl text-sm flex items-center justify-center">
                    {formatHoraire}
                  </div>
                  <div className="border border-purple-100 bg-white text-[#5352D7] py-4 rounded-xl font-bold text-sm px-3 flex items-center justify-center line-clamp-1">
                    {atelier.titre}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* VERSION C : MOBILE */}
        <div className="block sm:hidden space-y-4">
          {ateliersDeLaSemaine.map((atelier) => {
            const dateAtelier = new Date(atelier.dateDebut);
            const nomJour = dateAtelier.toLocaleDateString('fr-FR', { weekday: 'long' });
            const formatHoraire = `${dateAtelier.getHours()}h – ${new Date(atelier.dateFin).getHours()}h`;
            const isComplet = atelier.countReservations >= atelier.placesMax;

            return (
              <div 
                key={atelier.id} 
                onClick={handleRedirection}
                className="bg-white rounded-2xl p-5 shadow-sm border border-purple-100/60 flex flex-col justify-between cursor-pointer hover:border-purple-200 transition"
              >
                <div>
                  <span className="text-[#8b7fe7] font-extrabold text-xs uppercase tracking-wider block mb-1 capitalize">
                    {nomJour}
                  </span>
                  <h4 className="text-gray-800 font-bold text-lg leading-snug">
                    {atelier.titre}
                  </h4>
                  <p className="text-gray-400 text-xs font-medium mt-0.5">Public : 3 – 5 ans</p>
                </div>

                <div className="flex justify-between items-center text-xs text-gray-500 pt-3 mt-4 border-t border-gray-50">
                  <span className="font-semibold text-gray-600 bg-purple-50 px-2.5 py-1 rounded-md">
                    ⏱ {formatHoraire}
                  </span>
                  <div>
                    {isComplet ? (
                      <span className="text-red-400 font-bold uppercase tracking-wide">Complet</span>
                    ) : (
                      <span className="text-[#8b7fe7] font-bold">
                        {atelier.placesMax - atelier.countReservations} places
                      </span>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

      </section>
    </div>
  );
}