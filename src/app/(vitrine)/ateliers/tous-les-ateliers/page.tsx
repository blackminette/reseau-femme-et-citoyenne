import React from 'react';
import Link from 'next/link';
import { Quicksand } from 'next/font/google';

//import Header from '@/components/Header';
//import Footer from '@/components/Footer';

const quicksand = Quicksand({ 
    subsets: ['latin'],
    weight: ['400', '700'] 
});

const listeAteliers = [
    {
        id : 1,
        titre : "Titre",
        description : "description",
        prochainAtelier : "prochain atelier",
    },
    {
        id : 2,
        titre : "Titre",
        description : "description",
        prochainAtelier : "prochain atelier",
    },
    {
        id : 3,
        titre : "Titre",
        description : "description",
        prochainAtelier : "prochain atelier",
    },
    {
        id : 4,
        titre : "Titre",
        description : "description",
        prochainAtelier : "prochain atelier",
    }
];


export default function TousNosAteliers(){
    return (
        <>

            {/* Fond violet */}
            <div className='bg-[#eedeff] min-h-screen py-16 px-4'>
                <div className='w-7xl mx-auto'>

                    {/* Titre principal */}
                    <h1 className='text-5xl font-bold text-center text-transparent leading-none 
                    bg-gradient-to-r from-[#260936] via-[#260936] via-35% to-[#ffd166] to-70% 
                    bg-clip-text uppercase'>Tous nos ateliers</h1>


                    {/* Grille avec les encadres des ateliers */}
                    <section className="mx-8 my-32 rounded-[2.5rem] bg-[#260936] p-8 md:p-20 text-center text-white shadow-2xl max-w-[90rem] xl:mx-auto relative">
                        <div className="absolute top-0 left-0 w-full h-full opacity-5 pointer-events-none">
                            <svg width="100%" height="100%">
                                <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                                    <path d="M 40 0 L 0 0 0 40" fill="none" stroke="white" strokeWidth="1" /></pattern>
                                    <rect width="100%" height="100%" fill="url(#grid)" /></svg>
                        </div> 


                        <div className='grid grid-cols-1 md:grid-cols-2 gap-8 w-full justify-items-center'>
                            {listeAteliers.map((atelier) => (
                                <div key={atelier.id} className='bg-[#bc96e6]/20 rounded-2xl overflow-hidden w-full max-w-md aspect-[4/3] p-8 flex flex-col 
                                justify-between items-center shadow-[inset_0_1px_2px_rgba(255,255,255,0.4)]'>

                                    {/* Encadré pointillé pour l'image */}
                                    <div className="w-full h-1/2 rounded-[0.3rem] bg-white/10 border border-dashed border-black flex flex-col justify-center items-center"></div>


                                    {/* Bloc Texte : Titre + Description sous l'image */}
                                    <div className="flex flex-col gap-1 my-3 justify-center">
                                        <h3 className="text-lg font-semibold text-[#ffd166]">{atelier.titre}</h3>
                                        <p className="text-sm font-normal md:text-base text-[#eedeff]/80 line-clamp-2 px-2">{atelier.description}</p>
                                    </div>


                                    {/* Bloc Prochain Atelier */}
                                    <Link href='/ateliers/planning' //je dois remplacer plus tard avec le vrai lien 
                                    className="flex flex-col items-center gap-0.5 mt-auto group transition-all"
                                    >
                                        <p className="text-xs font-semibold text-[#ffd166] group-hover:text-[#260936]">{atelier.prochainAtelier}</p>
                                        <span className="text-xs font-light text-[#ffd166] group-hover:text-[#260936] mt-0.5 font-mono">v</span>
                                    </Link>
                                </div>
                            ))}
                        </div>
                    </section>

                </div>
            </div>

        </>
    );
}