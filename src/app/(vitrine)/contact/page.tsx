// * src/app/(vitrine)/contact/page.tsx
import React from 'react';

export default function PageContact(){
    return (

        // Fond violet 
        <main className='bg-[#eedeff] py-16 px-4 flex flex-col justify-center items-center'>

            {/* Titre */}
            <h1 className='text-5xl font-bold text-center text-transparent leading-none 
                    bg-gradient-to-r from-[#260936] via-[#260936] via-35% to-[#ffd166] to-70% 
                    bg-clip-text uppercase'>Prendre contact</h1>

            {/* Petite accroche */}
            <h2 className='text-3xl font-semibold text-center text-transparent bg-clip-text
            bg-gradient-to-r from-[#260936] to-[#ffd166]'>
            Une question, une envie de vous engager ou besoin d'échanger ? Notre équipe est à votre écoute</h2>
            
            {/* Formulaire de contact */}
            <div className='w-full bg-[#260936]/60 rounded-[2.5rem] p-8 md:p-12 text-white shadow-2xl relative'></div>

            <form className='flex flex-col gap-6'>

                {/* Champ nom */} 
                <div className="flex flex-col gap-2">
                    <label htmlFor="name" className="text-sm font-semibold text-[#eedeff]">Nom complet</label>
                    <input 
                        type="text" 
                        id="name" 
                        placeholder="Votre nom"
                        className="w-full p-4 rounded-xl bg-white/10 border border-white/20 text-white placeholder-white/40 
                        focus:outline-none focus:border-[#ffd166] transition-colors"
                    />
                </div>

                {/* Champ email */}
                <div className='flex flex-col gap-2'>


                </div>

            </form>

        </main>
    )
}