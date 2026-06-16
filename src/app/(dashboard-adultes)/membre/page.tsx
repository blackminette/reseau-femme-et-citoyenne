import Link from "next/link";
import { CalendarCheck, Users, CalendarPlus, ArrowRight, Sparkles } from "lucide-react";
import LogoutButton from "@/components/LogoutButton";

export const metadata = {
    title: "Mon espace membre",
    description: "Gérez vos réservations et le suivi de vos enfants.",
};

// Petits chiffres affichés en haut (à remplacer par la base de données plus tard)
const STATS = [
    { label: "Réservations", valeur: 3, Icon: CalendarCheck },
    { label: "Enfants",      valeur: 2, Icon: Users },
];

// Les raccourcis du tableau de bord (chaque carte est un lien)
// "couleur" = la teinte de la pastille d'icône, pour varier un peu les cartes
const ACTIONS = [
    { href: "/membre/reservations", Icon: CalendarCheck, couleur: "bg-indigo-50 text-indigo-600", titre: "Mes réservations", texte: "Consultez et gérez les ateliers réservés pour vos enfants." },
    { href: "/membre/enfants",      Icon: Users,         couleur: "bg-violet-50 text-violet-600", titre: "Mes enfants",      texte: "Ajoutez vos enfants et suivez leur progression pédagogique." },
    { href: "/membre/reserver",     Icon: CalendarPlus,  couleur: "bg-fuchsia-50 text-fuchsia-600", titre: "Réserver un atelier", texte: "Inscrivez un enfant à un nouvel atelier disponible." },
];

export default function MembreDashboard() {
    return (
        <div className="space-y-8">

            {/* Bandeau d'accueil avec dégradé violet (même esprit que la page de connexion) */}
            <header className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-indigo-500 to-purple-600 p-8 text-white shadow-lg">
                {/* Cercle décoratif en fond */}
                <div className="absolute -right-10 -top-10 w-40 h-40 rounded-full bg-white/10" aria-hidden />
                <div className="relative flex flex-wrap items-start justify-between gap-4">
                    <div className="space-y-2">
                        <span className="inline-flex items-center gap-1.5 text-xs font-semibold tracking-widest uppercase text-white/80">
                            <Sparkles className="w-4 h-4" aria-hidden /> Compte membre
                        </span>
                        <h1 className="text-3xl font-extrabold">Bienvenue dans votre espace</h1>
                        <p className="text-white/80">Gérez vos réservations et le suivi de vos enfants.</p>
                    </div>
                    <LogoutButton />
                </div>
            </header>

            {/* Petits compteurs */}
            <div className="grid gap-4 sm:grid-cols-2">
                {STATS.map(({ label, valeur, Icon }) => (
                    <div key={label} className="bg-white rounded-2xl shadow-sm border border-slate-200 p-5 flex items-center gap-4">
                        <div className="w-12 h-12 rounded-xl bg-indigo-50 flex items-center justify-center">
                            <Icon className="w-6 h-6 text-indigo-600" aria-hidden />
                        </div>
                        <div>
                            <p className="text-2xl font-extrabold text-slate-900 leading-none">{valeur}</p>
                            <p className="text-sm text-slate-500 mt-1">{label}</p>
                        </div>
                    </div>
                ))}
            </div>

            {/* Les raccourcis */}
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {ACTIONS.map(({ href, Icon, couleur, titre, texte }) => (
                    <Link key={href} href={href} className="group bg-white rounded-2xl shadow-sm border border-slate-200 p-6 hover:shadow-md hover:border-indigo-200 hover:-translate-y-0.5 transition-all">
                        <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${couleur}`}>
                            <Icon className="w-6 h-6" aria-hidden />
                        </div>
                        <h2 className="mt-4 text-lg font-bold text-slate-900">{titre}</h2>
                        <p className="mt-1 text-sm text-slate-600 leading-relaxed">{texte}</p>
                        <span className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-indigo-600">
                            Ouvrir <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" aria-hidden />
                        </span>
                    </Link>
                ))}
            </div>

        </div>
    );
}
