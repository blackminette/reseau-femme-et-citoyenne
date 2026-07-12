// * src/app/(vitrine)/dons/page.tsx
'use client';

import React, { useState, useRef } from 'react';
import { 
  Heart, 
  Link2, 
  Users, 
  Monitor, 
  Sprout, 
  Palette, 
  Globe, 
  ShieldCheck, 
  Lock, 
  Play, 
  PieChart, 
  BookOpen, 
  Settings, 
  Check, 
  CheckCircle,
  Sparkles,
  Info,
  X
} from 'lucide-react';

export default function DonsPage() {
  // Video Modal State
  const [activeVideo, setActiveVideo] = useState<{
    title: string;
    description: string;
  } | null>(null);

  // Form reference for scrolling
  const formRef = useRef<HTMLDivElement>(null);

  // Helper to scroll to the form
  const handleScrollToForm = (amount?: number) => {
    formRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#f5f0fa] via-[#fbf9fe] to-white text-[#260936]">
      {/* 2. MAIN HERO SECTION */}
      <section className="relative pt-12 pb-20 px-4 md:px-8 max-w-7xl mx-auto">
        <div className="bg-gradient-to-br from-[#260936] via-[#3a1250] to-[#170422] text-white rounded-3xl p-8 md:p-16 relative overflow-hidden shadow-2xl border border-purple-950/40">
          {/* Subtle glowing elements */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl -mr-20 -mt-20 pointer-events-none"></div>
          <div className="absolute bottom-0 left-0 w-80 h-80 bg-indigo-500/10 rounded-full blur-3xl -ml-20 -mb-20 pointer-events-none"></div>
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center relative z-10">
            {/* Left Content */}
            <div className="lg:col-span-7 space-y-6 text-left">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-white/10 text-purple-200 border border-white/10 backdrop-blur-md">
                <Sparkles className="w-3.5 h-3.5" />
                Soutien & Solidarité
              </span>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight text-white leading-tight">
                Soutenir nos actions
              </h1>
              <p className="text-purple-100 text-lg md:text-xl font-light leading-relaxed max-w-xl">
                Chaque don permet à des enfants, des jeunes, des familles et des femmes d'accéder à nos ateliers éducatifs, numériques et citoyens.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 pt-4">
                <button 
                  onClick={() => handleScrollToForm()}
                  className="px-8 py-4 bg-white hover:bg-purple-100 text-[#260936] font-bold rounded-xl shadow-lg transition-all duration-300 transform hover:-translate-y-0.5 flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Heart className="w-5 h-5 text-rose-500 fill-rose-500" />
                  Faire un don
                </button>
                <a 
                  href="/contact"
                  className="px-8 py-4 bg-white/10 hover:bg-white/15 text-white font-semibold rounded-xl border border-white/20 transition-all duration-300 backdrop-blur-md flex items-center justify-center gap-2"
                >
                  <Link2 className="w-5 h-5 text-purple-200" />
                  Devenir partenaire
                </a>
              </div>
            </div>
            
            {/* Right Stack of Glassmorphism Cards */}
            <div className="lg:col-span-5 flex flex-col gap-4">
              {/* Card 1 - Inclusion */}
              <div className="bg-white/10 border border-white/10 rounded-2xl p-6 shadow-xl backdrop-blur-md hover:bg-white/15 transition-all duration-300 transform hover:translate-x-2">
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-white/10 rounded-xl text-white">
                    <Users className="w-6 h-6 text-purple-200" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-white mb-1">Inclusion</h3>
                    <p className="text-sm text-purple-200 font-light">Favoriser l'accès à tous</p>
                  </div>
                </div>
              </div>

              {/* Card 2 - Numérique */}
              <div className="bg-white/10 border border-white/10 rounded-2xl p-6 shadow-xl backdrop-blur-md hover:bg-white/15 transition-all duration-300 transform hover:translate-x-2">
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-white/10 rounded-xl text-white">
                    <Monitor className="w-6 h-6 text-purple-200" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-white mb-1">Numérique</h3>
                    <p className="text-sm text-purple-200 font-light">Développer l'autonomie</p>
                  </div>
                </div>
              </div>

              {/* Card 3 - Citoyenneté */}
              <div className="bg-white/10 border border-white/10 rounded-2xl p-6 shadow-xl backdrop-blur-md hover:bg-white/15 transition-all duration-300 transform hover:translate-x-2">
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-white/10 rounded-xl text-white">
                    <Sprout className="w-6 h-6 text-purple-200" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-white mb-1">Citoyenneté</h3>
                    <p className="text-sm text-purple-200 font-light">Agir pour demain</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. "CHANGE LIVES" DONATION GRID */}
      <section className="py-16 px-4 md:px-8 max-w-7xl mx-auto text-center">
        <h2 className="text-3xl md:text-4xl font-black text-[#260936] tracking-tight">
          Votre soutien change des vies
        </h2>
        <p className="text-slate-600 mt-3 mb-12 max-w-2xl mx-auto text-lg font-light">
          Quelques exemples concrets de ce que votre don permet de réaliser.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Card 1 - 10€ */}
          <div className="bg-white rounded-2xl p-6 shadow-md hover:shadow-xl transition-all duration-300 border border-slate-100 flex flex-col justify-between items-start text-left relative overflow-hidden group">
            <div className="absolute top-0 left-0 w-full h-1.5 bg-rose-400"></div>
            <div className="w-full">
              <div className="flex justify-between items-center mb-4">
                <span className="w-3 h-3 rounded-full bg-rose-400"></span>
                <Palette className="w-6 h-6 text-rose-400 group-hover:scale-110 transition-transform" />
              </div>
              <h3 className="text-3xl font-black text-[#260936] mb-2">10 €</h3>
              <h4 className="text-lg font-bold text-slate-800 mb-2 leading-snug">Matériel créatif pour un atelier</h4>
              <p className="text-sm text-slate-500 leading-relaxed font-light">Peintures, pinceaux, feuilles, accessoires...</p>
            </div>
            <button 
              onClick={() => handleScrollToForm(10)}
              className="mt-6 w-full py-2.5 bg-rose-50 hover:bg-rose-100 text-rose-750 font-semibold rounded-xl text-xs transition duration-300 text-center cursor-pointer"
            >
              Soutenir à hauteur de 10 €
            </button>
          </div>

          {/* Card 2 - 25€ */}
          <div className="bg-white rounded-2xl p-6 shadow-md hover:shadow-xl transition-all duration-300 border border-slate-100 flex flex-col justify-between items-start text-left relative overflow-hidden group">
            <div className="absolute top-0 left-0 w-full h-1.5 bg-amber-400"></div>
            <div className="w-full">
              <div className="flex justify-between items-center mb-4">
                <span className="w-3 h-3 rounded-full bg-amber-400"></span>
                <Users className="w-6 h-6 text-amber-500 group-hover:scale-110 transition-transform" />
              </div>
              <h3 className="text-3xl font-black text-[#260936] mb-2">25 €</h3>
              <h4 className="text-lg font-bold text-slate-800 mb-2 leading-snug">Participation d'un enfant</h4>
              <p className="text-sm text-slate-500 leading-relaxed font-light">Permet à un enfant de participer à un atelier.</p>
            </div>
            <button 
              onClick={() => handleScrollToForm(25)}
              className="mt-6 w-full py-2.5 bg-amber-50 hover:bg-amber-100 text-amber-700 font-semibold rounded-xl text-xs transition duration-300 text-center cursor-pointer"
            >
              Soutenir à hauteur de 25 €
            </button>
          </div>

          {/* Card 3 - 50€ */}
          <div className="bg-white rounded-2xl p-6 shadow-md hover:shadow-xl transition-all duration-300 border border-slate-100 flex flex-col justify-between items-start text-left relative overflow-hidden group">
            <div className="absolute top-0 left-0 w-full h-1.5 bg-slate-400"></div>
            <div className="w-full">
              <div className="flex justify-between items-center mb-4">
                <span className="w-3 h-3 rounded-full bg-slate-400"></span>
                <Monitor className="w-6 h-6 text-slate-500 group-hover:scale-110 transition-transform" />
              </div>
              <h3 className="text-3xl font-black text-[#260936] mb-2">50 €</h3>
              <h4 className="text-lg font-bold text-slate-800 mb-2 leading-snug">Atelier numérique</h4>
              <p className="text-sm text-slate-500 leading-relaxed font-light">Initiation informatique pour plusieurs enfants.</p>
            </div>
            <button 
              onClick={() => handleScrollToForm(50)}
              className="mt-6 w-full py-2.5 bg-slate-100 hover:bg-slate-200 text-[#260936]/80 font-semibold rounded-xl text-xs transition duration-300 text-center cursor-pointer"
            >
              Soutenir à hauteur de 50 €
            </button>
          </div>

          {/* Card 4 - 100€ */}
          <div className="bg-white rounded-2xl p-6 shadow-md hover:shadow-xl transition-all duration-300 border border-slate-100 flex flex-col justify-between items-start text-left relative overflow-hidden group">
            <div className="absolute top-0 left-0 w-full h-1.5 bg-emerald-400"></div>
            <div className="w-full">
              <div className="flex justify-between items-center mb-4">
                <span className="w-3 h-3 rounded-full bg-emerald-400"></span>
                <Globe className="w-6 h-6 text-emerald-500 group-hover:scale-110 transition-transform" />
              </div>
              <h3 className="text-3xl font-black text-[#260936] mb-2">100 €</h3>
              <h4 className="text-lg font-bold text-slate-800 mb-2 leading-snug">Projet citoyen ou événement</h4>
              <p className="text-sm text-slate-500 leading-relaxed font-light">Soutien à l'organisation d'un projet collectif.</p>
            </div>
            <button 
              onClick={() => handleScrollToForm(100)}
              className="mt-6 w-full py-2.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 font-semibold rounded-xl text-xs transition duration-300 text-center cursor-pointer"
            >
              Soutenir à hauteur de 100 €
            </button>
          </div>
        </div>
      </section>

      {/* 4. TIMELINE */}
      <section className="py-20 bg-purple-900/5 px-4 md:px-8 border-y border-purple-900/10">
        <div className="max-w-7xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-black text-[#260936] tracking-tight">
            Ce que votre soutien a rendu possible
          </h2>
          
          {/* Horizontal scroll container with absolute line behind */}
          <div className="relative mt-16 pb-6 overflow-x-auto scrollbar-thin">
            {/* Horizontal timeline track line */}
            <div className="absolute top-12 left-16 right-16 h-1 bg-purple-300/40 hidden md:block"></div>
            
            <div className="flex flex-col md:flex-row justify-between items-start gap-12 md:gap-4 px-6 min-w-[900px] md:min-w-0">
              
              {/* Point 1 */}
              <div className="flex-1 flex flex-col items-center md:items-center text-center relative group">
                <span className="text-sm font-black text-purple-700 mb-2 block bg-purple-100 px-3 py-1 rounded-full">
                  2022 - Février
                </span>
                <div className="w-6 h-6 rounded-full bg-purple-600 border-4 border-white shadow-md relative z-10 group-hover:scale-125 transition-transform duration-300 mb-4"></div>
                <h3 className="text-lg font-extrabold text-slate-800 mb-2">Premiers ateliers</h3>
                <p className="text-sm text-slate-600 leading-relaxed font-light max-w-[200px]">
                  Lancement des premiers ateliers créatifs et culturels dans le quartier.
                </p>
              </div>

              {/* Point 2 */}
              <div className="flex-1 flex flex-col items-center md:items-center text-center relative group">
                <span className="text-sm font-black text-purple-700 mb-2 block bg-purple-100 px-3 py-1 rounded-full">
                  2023 - Juin
                </span>
                <div className="w-6 h-6 rounded-full bg-purple-600 border-4 border-white shadow-md relative z-10 group-hover:scale-125 transition-transform duration-300 mb-4"></div>
                <h3 className="text-lg font-extrabold text-slate-800 mb-2">Développement des partenariats</h3>
                <p className="text-sm text-slate-600 leading-relaxed font-light max-w-[200px]">
                  Création de liens solides avec les écoles, associations et institutions locales.
                </p>
              </div>

              {/* Point 3 */}
              <div className="flex-1 flex flex-col items-center md:items-center text-center relative group">
                <span className="text-sm font-black text-purple-700 mb-2 block bg-purple-100 px-3 py-1 rounded-full">
                  2024 - Mars
                </span>
                <div className="w-6 h-6 rounded-full bg-purple-600 border-4 border-white shadow-md relative z-10 group-hover:scale-125 transition-transform duration-300 mb-4"></div>
                <h3 className="text-lg font-extrabold text-slate-800 mb-2">Ateliers numériques</h3>
                <p className="text-sm text-slate-600 leading-relaxed font-light max-w-[200px]">
                  Mise en place des ateliers numériques pour réduire la fracture digitale.
                </p>
              </div>

              {/* Point 4 */}
              <div className="flex-1 flex flex-col items-center md:items-center text-center relative group">
                <span className="text-sm font-black text-purple-700 mb-2 block bg-purple-100 px-3 py-1 rounded-full">
                  2025 - Septembre
                </span>
                <div className="w-6 h-6 rounded-full bg-purple-600 border-4 border-white shadow-md relative z-10 group-hover:scale-125 transition-transform duration-300 mb-4"></div>
                <h3 className="text-lg font-extrabold text-slate-800 mb-2">Accompagnement des familles</h3>
                <p className="text-sm text-slate-600 leading-relaxed font-light max-w-[200px]">
                  Création de moments de partage et d'écoute pour les parents et les enfants.
                </p>
              </div>

              {/* Point 5 */}
              <div className="flex-1 flex flex-col items-center md:items-center text-center relative group">
                <span className="text-sm font-black text-purple-700 mb-2 block bg-purple-100 px-3 py-1 rounded-full">
                  2026 - Décembre
                </span>
                <div className="w-6 h-6 rounded-full bg-purple-600 border-4 border-white shadow-md relative z-10 group-hover:scale-125 transition-transform duration-300 mb-4"></div>
                <h3 className="text-lg font-extrabold text-slate-800 mb-2">Vers de nouveaux horizons</h3>
                <p className="text-sm text-slate-600 leading-relaxed font-light max-w-[200px]">
                  Déploiement de la plateforme éducative et nouveaux projets citoyens.
                </p>
              </div>

            </div>
          </div>
        </div>
      </section>

      {/* 5. "ACTIONS IN IMAGES" SHOWCASE GRID */}
      <section className="py-20 px-4 md:px-8 max-w-7xl mx-auto text-center">
        <h2 className="text-3xl md:text-4xl font-black text-[#260936] tracking-tight">
          Nos actions en images
        </h2>
        <p className="text-slate-600 mt-3 mb-12 max-w-2xl mx-auto text-lg font-light">
          Découvrez quelques moments partagés lors de nos ateliers.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Card 1 */}
          <div 
            onClick={() => setActiveVideo({
              title: "Atelier Création & Peinture",
              description: "Découverte de l'art sous toutes ses formes par le biais d'activités artistiques enrichissantes telles que la peinture, le dessin, la couture et la mosaïque."
            })}
            className="bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 border border-slate-100 group cursor-pointer text-left"
          >
            <div className="relative aspect-[4/3] bg-slate-100 overflow-hidden">
              <img 
                src="/images/children_painting.png" 
                alt="Enfants qui peignent" 
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-black/35 opacity-70 group-hover:opacity-50 transition-opacity duration-300"></div>
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-14 h-14 bg-white/95 text-purple-750 hover:text-white hover:bg-purple-600 rounded-full flex items-center justify-center shadow-lg transform group-hover:scale-110 transition-all duration-300 backdrop-blur-sm">
                  <Play className="w-6 h-6 fill-current ml-1" />
                </div>
              </div>
            </div>
            <div className="p-6">
              <p className="text-sm text-slate-600 leading-relaxed font-light">
                Peinture, dessin, couture, mosaïque et plus encore.
              </p>
            </div>
          </div>

          {/* Card 2 */}
          <div 
            onClick={() => setActiveVideo({
              title: "Ateliers Numériques",
              description: "Apprentissage interactif et ludique de l'informatique pour développer l'autonomie et accompagner les enfants et leurs familles dans les démarches du quotidien."
            })}
            className="bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 border border-slate-100 group cursor-pointer text-left"
          >
            <div className="relative aspect-[4/3] bg-slate-100 overflow-hidden">
              <img 
                src="/images/children_laptops.png" 
                alt="Enfants sur ordinateurs portables" 
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-black/35 opacity-70 group-hover:opacity-50 transition-opacity duration-300"></div>
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-14 h-14 bg-white/95 text-purple-750 hover:text-white hover:bg-purple-600 rounded-full flex items-center justify-center shadow-lg transform group-hover:scale-110 transition-all duration-300 backdrop-blur-sm">
                  <Play className="w-6 h-6 fill-current ml-1" />
                </div>
              </div>
            </div>
            <div className="p-6">
              <p className="text-sm text-slate-600 leading-relaxed font-light">
                Ateliers informatiques, aide aux démarches et usages numériques.
              </p>
            </div>
          </div>

          {/* Card 3 */}
          <div 
            onClick={() => setActiveVideo({
              title: "Rencontres Intergénérationnelles",
              description: "Création de liens privilégiés et de moments de partage enrichissants autour de jeux comme les échecs et d'ateliers avec les résidents des EHPAD."
            })}
            className="bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 border border-slate-100 group cursor-pointer text-left"
          >
            <div className="relative aspect-[4/3] bg-slate-100 overflow-hidden">
              <img 
                src="/images/elder_child_chess.png" 
                alt="Aîné et enfant jouant aux échecs" 
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-black/35 opacity-70 group-hover:opacity-50 transition-opacity duration-300"></div>
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-14 h-14 bg-white/95 text-purple-750 hover:text-white hover:bg-purple-600 rounded-full flex items-center justify-center shadow-lg transform group-hover:scale-110 transition-all duration-300 backdrop-blur-sm">
                  <Play className="w-6 h-6 fill-current ml-1" />
                </div>
              </div>
            </div>
            <div className="p-6">
              <p className="text-sm text-slate-600 leading-relaxed font-light">
                Rencontres et activités partagées avec les résidents d'EHPAD.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 6. DONATION ALLOCATION GRID */}
      <section className="py-20 bg-purple-900/5 border-y border-purple-900/10 px-4 md:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-black text-[#260936] tracking-tight">
            Où vont vos dons?
          </h2>
          <p className="text-slate-600 mt-3 mb-12 max-w-2xl mx-auto text-lg font-light">
            Nous nous engageons à utiliser chaque don de manière transparente et efficace.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            {/* Allocation 1 - 40% */}
            <div className="bg-white rounded-2xl p-6 shadow-md border border-slate-100 hover:scale-[1.02] transition-transform duration-300 text-left">
              <div className="flex justify-between items-center mb-4">
                <span className="text-4xl font-black text-purple-700">40%</span>
                <PieChart className="w-7 h-7 text-purple-500" />
              </div>
              <h3 className="text-lg font-extrabold text-slate-800 mb-2">Actions éducatives</h3>
              <p className="text-sm text-slate-500 leading-relaxed font-light">
                Ateliers, accompagnement et projets pédagogiques.
              </p>
            </div>

            {/* Allocation 2 - 25% */}
            <div className="bg-white rounded-2xl p-6 shadow-md border border-slate-100 hover:scale-[1.02] transition-transform duration-300 text-left">
              <div className="flex justify-between items-center mb-4">
                <span className="text-4xl font-black text-purple-700">25%</span>
                <BookOpen className="w-7 h-7 text-purple-500" />
              </div>
              <h3 className="text-lg font-extrabold text-slate-800 mb-2">Matériel pédagogique</h3>
              <p className="text-sm text-slate-500 leading-relaxed font-light">
                Fournitures, équipements et ressources créatives.
              </p>
            </div>

            {/* Allocation 3 - 20% */}
            <div className="bg-white rounded-2xl p-6 shadow-md border border-slate-100 hover:scale-[1.02] transition-transform duration-300 text-left">
              <div className="flex justify-between items-center mb-4">
                <span className="text-4xl font-black text-purple-700">20%</span>
                <Monitor className="w-7 h-7 text-purple-500" />
              </div>
              <h3 className="text-lg font-extrabold text-slate-800 mb-2">Plateforme numérique</h3>
              <p className="text-sm text-slate-500 leading-relaxed font-light">
                Développement et maintenance de notre plateforme.
              </p>
            </div>

            {/* Allocation 4 - 15% */}
            <div className="bg-white rounded-2xl p-6 shadow-md border border-slate-100 hover:scale-[1.02] transition-transform duration-300 text-left">
              <div className="flex justify-between items-center mb-4">
                <span className="text-4xl font-black text-purple-700">15%</span>
                <Settings className="w-7 h-7 text-purple-500" />
              </div>
              <h3 className="text-lg font-extrabold text-slate-800 mb-2">Organisation & logistique</h3>
              <p className="text-sm text-slate-500 leading-relaxed font-light">
                Fonctionnement, communication et événements.
              </p>
            </div>
          </div>

          {/* Verification Badge */}
          <div className="inline-flex items-center gap-3 px-6 py-3 rounded-full bg-white shadow-sm border border-purple-100 text-sm font-semibold text-purple-800">
            <ShieldCheck className="w-5 h-5 text-emerald-500" />
            <span>RFC 06 s'engage à une gestion rigoureuse et transparente de vos dons.</span>
          </div>
        </div>
      </section>

      {/* 7. IMPACT AND DONATION FORM SECTION */}
      <section ref={formRef} id="donation-form" className="py-20 px-4 md:px-8 max-w-7xl mx-auto scroll-mt-24">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          
          {/* Left Column: Your Donation, Your Impact */}
          <div className="lg:col-span-5 space-y-6 text-left">
            <div>
              <h2 className="text-3xl font-black text-[#260936] tracking-tight">
                Votre don, votre impact
              </h2>
              <p className="text-slate-500 mt-1 font-light">Chaque contribution compte.</p>
            </div>

            {/* Structured Impact Table */}
            <div className="bg-white rounded-2xl border border-slate-100 shadow-md overflow-hidden">
              <div className="grid grid-cols-12 gap-4 bg-purple-900/5 px-6 py-3 border-b border-slate-100 text-xs font-bold uppercase tracking-wider text-purple-800">
                <div className="col-span-3">DON</div>
                <div className="col-span-9">IMPACT</div>
              </div>
              
              <div className="divide-y divide-slate-50">
                {/* Row 0 - 5€ */}
                <div 
                  onClick={() => handleScrollToForm(5)}
                  className="grid grid-cols-12 gap-4 px-6 py-4 items-center hover:bg-purple-50/40 transition cursor-pointer group"
                >
                  <div className="col-span-3">
                    <span className="inline-block px-3 py-1.5 rounded-full text-sm font-black bg-purple-50 text-purple-700 border border-purple-100 group-hover:bg-purple-100 transition">
                      5 €
                    </span>
                  </div>
                  <div className="col-span-9 flex items-center gap-3 text-slate-700 text-sm font-medium">
                    <BookOpen className="w-4 h-4 text-purple-500 shrink-0" />
                    <span>Fournitures pour un atelier créatif</span>
                  </div>
                </div>

                {/* Row 1 - 10€ */}
                <div 
                  onClick={() => handleScrollToForm(10)}
                  className="grid grid-cols-12 gap-4 px-6 py-4 items-center hover:bg-purple-50/40 transition cursor-pointer group"
                >
                  <div className="col-span-3">
                    <span className="inline-block px-3 py-1.5 rounded-full text-sm font-black bg-rose-50 text-rose-600 border border-rose-100 group-hover:bg-rose-100 transition">
                      10 €
                    </span>
                  </div>
                  <div className="col-span-9 flex items-center gap-3 text-slate-700 text-sm font-medium">
                    <Palette className="w-4 h-4 text-rose-455 shrink-0" />
                    <span>Matériel pour une activité manuelle</span>
                  </div>
                </div>

                {/* Row 2 - 25€ */}
                <div 
                  onClick={() => handleScrollToForm(25)}
                  className="grid grid-cols-12 gap-4 px-6 py-4 items-center hover:bg-purple-50/40 transition cursor-pointer group"
                >
                  <div className="col-span-3">
                    <span className="inline-block px-3 py-1.5 rounded-full text-sm font-black bg-amber-50 text-amber-600 border border-amber-100 group-hover:bg-amber-100 transition">
                      25 €
                    </span>
                  </div>
                  <div className="col-span-9 flex items-center gap-3 text-slate-700 text-sm font-medium">
                    <Users className="w-4 h-4 text-amber-500 shrink-0" />
                    <span>Participation d'un enfant à un atelier</span>
                  </div>
                </div>

                {/* Row 3 - 50€ */}
                <div 
                  onClick={() => handleScrollToForm(50)}
                  className="grid grid-cols-12 gap-4 px-6 py-4 items-center hover:bg-purple-50/40 transition cursor-pointer group"
                >
                  <div className="col-span-3">
                    <span className="inline-block px-3 py-1.5 rounded-full text-sm font-black bg-blue-50 text-blue-600 border border-blue-100 group-hover:bg-blue-100 transition">
                      50 €
                    </span>
                  </div>
                  <div className="col-span-9 flex items-center gap-3 text-slate-700 text-sm font-medium">
                    <Monitor className="w-4 h-4 text-blue-500 shrink-0" />
                    <span>Financement d'un atelier numérique</span>
                  </div>
                </div>

                {/* Row 4 - 100€ */}
                <div 
                  onClick={() => handleScrollToForm(100)}
                  className="grid grid-cols-12 gap-4 px-6 py-4 items-center hover:bg-purple-50/40 transition cursor-pointer group"
                >
                  <div className="col-span-3">
                    <span className="inline-block px-3 py-1.5 rounded-full text-sm font-black bg-emerald-50 text-emerald-600 border border-emerald-100 group-hover:bg-emerald-100 transition">
                      100 €
                    </span>
                  </div>
                  <div className="col-span-9 flex items-center gap-3 text-slate-700 text-sm font-medium">
                    <Globe className="w-4 h-4 text-emerald-500 shrink-0" />
                    <span>Soutien à un projet citoyen ou culturel</span>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="p-4 bg-purple-900/5 border border-purple-900/10 rounded-2xl text-xs text-slate-500 flex items-start gap-3">
              <Info className="w-4 h-4 text-purple-600 shrink-0 mt-0.5" />
              <div className="space-y-1 leading-relaxed font-light">
                <p>Déduction fiscale : Votre don ouvre droit à une réduction d'impôt de 66% sur le revenu.</p>
                <p className="italic">Transparence : En validant votre don, vous acceptez que si l'objectif d'un projet n'est pas atteint ou s'il est dépassé, l'association réaffecte les fonds vers un projet similaire.</p>
              </div>
            </div>
          </div>

          {/* Right Column: Embedded HelloAsso Iframe */}
          <div className="lg:col-span-7 bg-white rounded-3xl p-8 shadow-xl border border-purple-900/5 text-left flex flex-col">
            <div className="mb-6">
              <h2 className="text-3xl font-black text-[#260936] tracking-tight">
                Faire un don
              </h2>
              <p className="text-slate-500 mt-1 font-light text-sm">
                Soutenez nos projets directement en complétant le formulaire sécurisé HelloAsso ci-dessous.
              </p>
            </div>

            <iframe
              id="haWidget"
              allowTransparency={true}
              scrolling="auto"
              src="https://www.helloasso.com/associations/reseau-femme-et-citoyenne-06/formulaires/1/widget"
              style={{ width: '100%', height: '750px', border: 'none' }}
              className="rounded-2xl border border-slate-100 shadow-sm"
            ></iframe>

            <div className="flex items-center justify-center gap-2 text-xs text-slate-400 mt-6">
              <Lock className="w-3.5 h-3.5" />
              <span>Paiement 100% sécurisé via HelloAsso</span>
            </div>
          </div>

        </div>
      </section>

      {/* 8. FINAL CALL-TO-ACTION BAR */}
      <section className="px-4 md:px-8 pb-20 max-w-7xl mx-auto">
        <div className="bg-gradient-to-r from-[#260936] to-[#1d052a] text-white rounded-3xl p-10 md:p-16 relative overflow-hidden shadow-xl border border-purple-950">
          <div className="absolute top-0 right-0 w-80 h-80 bg-purple-500/10 rounded-full blur-2xl pointer-events-none"></div>
          
          <div className="flex flex-col lg:flex-row items-center justify-between gap-8 relative z-10 text-left">
            <div className="space-y-4 max-w-2xl">
              <h2 className="text-3xl font-black text-white leading-tight">
                Ensemble, faisons grandir les projets de demain
              </h2>
              <p className="text-purple-200 text-base font-light leading-relaxed font-light">
                Votre soutien permet de créer des opportunités, de développer l'autonomie et de renforcer le lien social sur notre territoire.
              </p>
            </div>
            
            <button
              onClick={() => handleScrollToForm()}
              className="px-8 py-4 bg-white hover:bg-purple-100 text-[#260936] font-bold rounded-xl shadow-lg transition-all duration-300 whitespace-nowrap shrink-0 flex items-center gap-2 cursor-pointer"
            >
              <Heart className="w-5 h-5 text-rose-500 fill-rose-500" />
              Faire un don maintenant
            </button>
          </div>
        </div>
      </section>

      {/* Video Modal (Mock Video Player) */}
      {activeVideo && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-2xl w-full overflow-hidden shadow-2xl relative border border-purple-100 text-left">
            <button 
              onClick={() => setActiveVideo(null)}
              className="absolute top-4 right-4 p-2 text-white bg-black/40 hover:bg-black/60 rounded-full transition z-10 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Video Box (Mock Screen) */}
            <div className="relative aspect-video bg-black flex flex-col items-center justify-center text-white p-8 overflow-hidden group">
              <div className="absolute inset-0 bg-gradient-to-b from-purple-900/30 to-black/80 pointer-events-none"></div>
              
              <div className="w-16 h-16 bg-white/10 border border-white/20 text-white rounded-full flex items-center justify-center shadow-lg animate-pulse mb-4 z-10 backdrop-blur-md">
                <Monitor className="w-8 h-8" />
              </div>
              
              <h4 className="text-xl font-bold text-white mb-2 z-10">{activeVideo.title}</h4>
              <p className="text-sm text-purple-200 max-w-md text-center z-10 leading-relaxed font-light">
                {activeVideo.description}
              </p>
              
              <div className="absolute bottom-4 left-4 right-4 flex items-center gap-4 text-[10px] text-slate-400 z-10 bg-white/5 px-3 py-1.5 rounded-full border border-white/5 backdrop-blur-md">
                <span className="w-2 h-2 rounded-full bg-red-500 animate-ping"></span>
                <span>Simulation de lecture vidéo de l'atelier RFC 06</span>
              </div>
            </div>

            <div className="p-6 bg-slate-50 flex items-center justify-between">
              <div className="text-xs text-slate-500 flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-purple-600" />
                <span>RFC 06 — Moments partagés</span>
              </div>
              <button
                onClick={() => setActiveVideo(null)}
                className="px-4 py-2 bg-slate-200 hover:bg-slate-300 text-slate-700 text-xs font-bold rounded-lg transition cursor-pointer"
              >
                Retour
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
