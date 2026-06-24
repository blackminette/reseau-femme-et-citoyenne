// * src/app/(vitrine)/ateliers/page.tsx
import Link from 'next/link';


const FAKE_ATELIERS = [
    {
        id: "1",
        title: "Soutien Scolaire Intensif",
        category: "Éducation",
        description: "Un accompagnement personnalisé pour les devoirs et la méthodologie, du collège au lycée.",
        duration: "2h / semaine",
        spots: 5,
        icon: "📚"
    },
    {
        id: "2",
        title: "Initiation au Code & Robotique",
        category: "Technologie",
        description: "Découvrir la programmation par blocs et Python en construisant de petits robots connectés.",
        duration: "1h30 / semaine",
        spots: 0, // Complet pour tester le badge
        icon: "🤖"
    },
    {
        id: "3",
        title: "Arts Plastiques & Créativité",
        category: "Culture",
        description: "Atelier d'expression libre à travers la peinture, le dessin et la sculpture pour les enfants.",
        duration: "2h / quinzaine",
        spots: 3,
        icon: "🎨"
    }
];

export default function AteliersPage() {
    return (
        <div className="bg-slate-50 grow py-12">
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">

                {/* En-tête */}
                <div className="text-center space-y-4">
                    <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight">
                        Nos Ateliers & Activités
                    </h1>
                    <p className="max-w-2xl mx-auto text-lg text-slate-500">
                        Découvrez les programmes animés par nos intervenants. Inscrivez-vous ou réservez vos places depuis votre espace membre.
                    </p>
                </div>

                {/* Grille des Ateliers */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {FAKE_ATELIERS.map((atelier) => (
                        <div key={atelier.id} className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden flex flex-col justify-between hover:shadow-md transition-shadow">

                            <div className="p-6 space-y-4">
                                {/* Icône + Catégorie */}
                                <div className="flex justify-between items-center">
                                    <span className="text-3xl bg-slate-100 p-2 rounded-xl">{atelier.icon}</span>
                                    <span className="px-3 py-1 bg-indigo-50 text-indigo-700 text-xs font-semibold rounded-full">
                                        {atelier.category}
                                    </span>
                                </div>

                                {/* Titre & Description */}
                                <div className="space-y-2">
                                    <h3 className="text-xl font-bold text-slate-900">{atelier.title}</h3>
                                    <p className="text-sm text-slate-600 leading-relaxed line-clamp-3">
                                        {atelier.description}
                                    </p>
                                </div>

                                {/* Infos pratiques */}
                                <div className="pt-2 flex justify-between text-xs text-slate-500 border-t border-slate-100">
                                    <span>⏱️ {atelier.duration}</span>
                                    {atelier.spots > 0 ? (
                                        <span className="text-emerald-600 font-medium">🟢 {atelier.spots} places dispo</span>
                                    ) : (
                                        <span className="text-red-500 font-medium">🔴 Complet</span>
                                    )}
                                </div>
                            </div>

                            {/* Bouton d'action */}
                            <div className="px-6 pb-6">
                                {/* On passe l'id dynamiquement dans le lien */}
                                <Link
                                    href={`/ateliers/${atelier.id}`}
                                    className="block text-center w-full py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-medium text-sm rounded-xl transition-colors"
                                >
                                    Voir le détail
                                </Link>
                            </div>

                        </div>
                    ))}
                </div>

            </div>
        </div>
    );
}