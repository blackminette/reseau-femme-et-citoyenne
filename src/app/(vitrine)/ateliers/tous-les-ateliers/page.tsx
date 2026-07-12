import Link from 'next/link';

const ateliersData = [
    {
        id: 1,
        titre: "Atelier mosaïque",
        description: "Un atelier interactif pour développer votre potentiel créatif.",
        atelierPasse: "15 Juin 2026 à 10h00",
        slug: "atelier-mosaique",
        mediaUrl: "https://www.youtube.com/embed/b7Jx4m610GY",
    },
    {
        id: 2,
        titre: "Atelier jardinage",
        description: "S'amuser tout en apprenant et en étant dans la nature.",
        atelierPasse: "11 Juin 2026 à 14h00",
        slug: "atelier-jardinnage",
        mediaUrl: "https://www.youtube.com/embed/0hxnbkaiCmk",
    },
    {
        id: 3,
        titre: "Atelier Numérique & Code",
        description: "Initiation aux outils digitaux et aux bases du développement web pour toutes.",
        atelierPasse: "15 Juin 2026 à 14h00",
        slug: "numerique-et-code",
        mediaUrl: "https://www.youtube.com/embed/PXQSPRm24E8",
    },
    {
        id: 4,
        titre: "Prise de Parole en Public",
        description: "Maîtrisez votre voix, votre posture et apprenez à captiver votre auditoire en toute sérénité.",
        atelierPasse: "19 Juillet 2026 à 15h00",
        slug: "prise-de-parole",
        mediaUrl: "https://www.youtube.com/embed/hDgX2je_ll4",
    },
];

export default function Ateliers_Carreaux() {
    return (
        <section className="bg-[#eedeff] py-16 px-4 sm:px-6 lg:px-8 min-h-screen">
            <div className="max-w-6xl mx-auto">

                {/* Titres */}
                <div className="text-center mb-12">
                    <h2 className="text-3xl font-bold text-[#260936] inline-block border-b-2 border-gray-900 pb-1">
                        Nos Ateliers
                    </h2>
                    <p className="mt-4 text-black max-w-xl mx-auto">
                        Découvrez nos ateliers, échangez avec des personnes passionnées et développez vos compétences.
                    </p>
                </div> 


            
                {/* Grille */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {ateliersData.map((atelier) => (
                        <div
                            key={atelier.id}
                            className="bg-[#260936] rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow p-5 flex flex-col gap-5"
                        >
                            {/* Média */}
                            <div className={`w-full relative rounded-xl overflow-hidden flex-shrink-0 bg-black ${
                                atelier.mediaUrl && atelier.mediaUrl.includes('instagram')
                                ? 'aspect-[4/5] max-h-[420px]' // Format pour Instagram
                                : 'aspect-video' // Format pour YouTube 
                            }`}>
                                {atelier.mediaUrl && (atelier.mediaUrl.includes('youtube') || atelier.mediaUrl.includes('instagram')) ? (
                                <iframe
                                    src={atelier.mediaUrl}
                                    title={atelier.titre}
                                    className="w-full h-full absolute inset-0"
                                    scrolling="no"
                                    frameBorder="0"
                                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                                    allowFullScreen
                                />
                                ) : (
                                <img
                                    src={atelier.mediaUrl}
                                    alt={atelier.titre}
                                    className="w-full h-full object-cover"
                                />
                                )}
                            </div>  



                            {/* Zone Contenu */}
                            <div className="w-full flex flex-col justify-between flex-grow gap-4">
                                <div>

                                  {/* Section Titre & Description */}
                                    <h3 className="text-lg font-bold text-[#ffd166] hover:text-[#bc96e6]/80 transition-colors">
                                        {atelier.titre}
                                    </h3>
                                    <p className="text-sm text-white/85 mt-2 line-clamp-2">
                                        {atelier.description}
                                    </p>
                                </div>   

                            
                                {/* Section Atelier passé & Bouton */}
                                <div className="mt-auto pt-3 border-t border-[#bc96e6] flex items-center justify-between gap-2">
                                    <div className="flex flex-col">
                                        <span className="text-[11px] font-semibold text-[#1eedeff]/80 uppercase tracking-wider">
                                            Date de l'atelier passé
                                        </span>
                                        <span className="text-xs font-medium text-white/85 mt-0.5">
                                            {atelier.atelierPasse}
                                        </span>
                                    </div>  

                                    {/* Lien de redirection */}
                                    <Link
                                        href={`/ateliers/reservation`}
                                        className="inline-flex items-center justify-center bg-[#ffd166] text-[#260936] hover:bg-[#bc96e6] hover:text-white px-4 py-2 rounded-xl text-sm font-semibold transition-colors shadow-sm"
                                    >
                                        Prochain atelier
                                    </Link>
                                </div>
                            </div>  
                        </div>
                    ))}
                </div>    
            </div>
        </section>
    );
}