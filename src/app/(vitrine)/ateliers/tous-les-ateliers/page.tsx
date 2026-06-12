import React from 'react';
import Link from 'next/link';
import { Quicksand } from 'next/font/google';

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
        // fond violet
        <div className='bg-[#eedeff] min-h-screen py-16 px-4'>
            <div className='max-w-5xl mx-auto'>

                {/* Titre principal */}
                <h1 className={`${quicksand.className} text-5xl font-bold text-center text-[#260936] mb-24`}>Tous nos Ateliers</h1>

                {/* Grille avec les encadres des ateliers */}
                <div className='grid grid-cols-2 gap-x-16 gap-y-20 justify-items-center'>
                    {listeAteliers.map((atelier) => (
                        <div key={atelier.id} className='bg-[#bc96e6] w-full max-w-md aspect-[4/3] p-8 flex flex-col justify-between items-center text-center shadow-md rounded-sm border border-[#752fbb] shadow-black'>
                            
                            {/* Encadré pointillé pour l'image */}
                            <div className="w-full h-1/2 border border-dashed border-black flex flex-col justify-center items-center"></div>


                            {/* Bloc Texte : Titre + Description sous l'image */}
                            <div className="flex flex-col gap-1 my-3 justify-center">
                                <h3 className="text-lg font-semibold text-[#260936]">{atelier.titre}</h3>
                                <p className="text-sm font-normal text-[#260936]-600 line-clamp-2 px-2">{atelier.description}</p>
                            </div>


                            {/* Bloc Prochain Atelier */}
                            <Link href='#' //je dois remplacer plus tard avec le vrai lien 
                            className="flex flex-col items-center gap-0.5 mt-auto group transition-all"
                            >
                                <p className="text-xs font-semibold text-[#752fbb] group-hover:text-[#260936]">{atelier.prochainAtelier}</p>
                                <span className="text-xs font-light text-[#752fbb] group-hover:text-[#260936] mt-0.5 font-mono">v</span>
                            </Link>
                        </div>
                    ))}
                </div>

            </div>
        </div>
    );
}