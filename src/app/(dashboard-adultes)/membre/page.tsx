import Link from "next/link";
import { CalendarCheck, Users, ArrowRight } from "lucide-react";
import LogoutButton from "@/components/LogoutButton";

export const metadata = {
    title: "Mon espace membre",
    description: "Gérez vos réservations et le suivi de vos enfants.",
};

// Les raccourcis du tableau de bord (chaque carte est un lien)
const ACTIONS = [
    { href: "/membre/reservations", Icon: CalendarCheck, titre: "Mes réservations", texte: "Consultez et gérez les ateliers réservés pour vos enfants." },
    { href: "/membre/enfants", Icon: Users, titre: "Mes enfants", texte: "Ajoutez vos enfants et suivez leur progression pédagogique." },
];

export default function MembreDashboard() {
    return (
        <div className="space-y-8">

            {/* En-tête : titre à gauche, bouton de déconnexion à droite */}
            <header className="flex flex-wrap items-start justify-between gap-4">
                <div className="space-y-1">
                    <span className="text-xs font-semibold tracking-widest uppercase text-indigo-500">Compte membre</span>
                    <h1 className="text-3xl font-extrabold text-slate-900">Bienvenue dans votre espace</h1>
                    <p className="text-slate-500">Gérez vos réservations et le suivi de vos enfants.</p>
                </div>
                <LogoutButton />
            </header>

            {/* Les deux raccourcis */}
            <div className="grid gap-6 sm:grid-cols-2">
                {ACTIONS.map(({ href, Icon, titre, texte }) => (
                    <Link key={href} href={href} className="group bg-white rounded-2xl shadow-sm border border-slate-200 p-6 hover:shadow-md hover:border-indigo-200 transition-all">
                        <div className="w-12 h-12 rounded-full bg-indigo-50 flex items-center justify-center">
                            <Icon className="w-6 h-6 text-indigo-500" aria-hidden />
                        </div>
                        <h2 className="mt-4 text-lg font-bold text-slate-900">{titre}</h2>
                        <p className="mt-1 text-sm text-slate-600 leading-relaxed">{texte}</p>
                        <span className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-indigo-600">
                            Ouvrir <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" aria-hidden />
                        </span>
                    </Link>
                ))}
            </div>

        </div>
    );
}
