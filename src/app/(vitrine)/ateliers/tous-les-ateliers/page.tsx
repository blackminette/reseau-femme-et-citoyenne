import Link from 'next/link';


const ateliersData = [
    {
        id: 1,
        titre: "Atelier mosaique",
        description: "Un atelier interactif pour développer votre potentiel creatif.",
        atelierPasse: "15 Juin 2026 à 10h00",
        slug: "atelier-mosaique",
        mediaUrl: "#",
    },
    {
        id: 2,
        titre: "Atelier jardinnage",
        description: "S'amuser tout en apprenant et en etant dans la nature.",
        atelierPasse: "11 Juin 2026 à 14h00",
        slug: "atelier-jardinnage",
        mediaUrl: "#",
    },
    {
        id: 3,
        titre: "Atelier Numérique & Code",
        description: "Initiation aux outils digitaux et aux bases du développement web pour toutes.",
        atelierPasse: "15 Juin 2026 à 14h00",
        slug: "numerique-et-code",
        mediaUrl: "#",
    },
    {
        id: 4,
        titre: "Prise de Parole en Public",
        description: "Maîtrisez votre voix, votre posture et apprenez à captiver votre auditoire en toute sérénité.",
        atelierPasse: "19 Juillet 2026 à 15h00",
        slug: "prise-de-parole",
        mediaUrl: "#",
    },
];



export default function Ateliers_Carreaux() {
    return (
        <section className="bg-[#eedeff] py-16 px-4 sm:px-6 lg:px-8 min-h-screen">
            <div className="max-w-6xl mx-auto">

                {/* En-tête */}
                <div className="text-center mb-12">
                    <h2 className="text-3xl font-bold text-[#260936] inline-block border-b-2 border-gray-900 pb-1">
                        Nos Ateliers</h2>
                    <p className="mt-4 text-black max-w-xl mx-auto">
                        Découvrez nos ateliers, échangez avec des personnes passionés et développez vos compétences.</p>
                </div>    


                {/* Grille */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {ateliersData.map((atelier) => (
                        <div 
                            key={atelier.id} 
                            className="bg-[#260936] rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow p-4 flex flex-col sm:flex-row gap-4 items-center sm:items-stretch"
                        >
                            {/* Zone Média (Image ou Vidéo) */}
                            <div className="w-full sm:w-2/5 min-h-[160px] relative rounded-xl overflow-hidden flex-shrink-0 bg-gray-100">
                                <img 
                                    src={atelier.mediaUrl} 
                                    alt={atelier.titre}
                                    className="w-full h-full object-cover"
                                />
                            </div>  


                            {/* Zone Contenu */}
                            <div className="w-full sm:w-3/5 flex flex-col justify-between py-1">
                                <div>
                                    {/* Section Titre & Description */}
                                    <h3 className="text-lg font-bold text-[#ffd166] hover:text-[#bc96e6]/80 transition-colors">
                                        {atelier.titre}</h3>
                                    <p className="text-sm text-white/85 mt-2 line-clamp-2">
                                        {atelier.description}</p>
                                </div>    


                                {/* Section Atelier passe & Bouton */}
                                <div className="mt-4 pt-3 border-t border-[#bc96e6] flex items-center justify-between gap-2">
                                    <div className="flex flex-col">
                                        <span className="text-[11px] font-semibold text-[#eedeff]/80 uppercase tracking-wider">
                                            Date de l'atelier passe</span>
                                        <span className="text-xs font-medium text-white/85 mt-0.5">
                                            {atelier.atelierPasse}</span>
                                    </div>


                                    {/* Lien de redirection */}
                                    <Link 
                                        href={`/ateliers/${atelier.slug}`}
                                        className="inline-flex items-center justify-center bg-[#ffd166] text-[#260936] hover:bg-[#bc96e6] hover:text-white text-xs font-medium px-4 py-2 rounded-xl transition-colors whitespace-nowrap shadow-sm"
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