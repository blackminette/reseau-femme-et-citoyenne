// * src/components/EmptyState.tsx
import Link from "next/link";
import { type LucideIcon } from "lucide-react";

/**
 * Carte « état vide » réutilisable (bordure en pointillés) :
 * icône, titre, texte d'explication et bouton d'action.
 */
type Props = {
    Icon: LucideIcon;
    titre: string;
    texte: string;
    action: { href: string; label: string; Icon: LucideIcon };
    className?: string;
};

export default function EmptyState({ Icon, titre, texte, action, className = "" }: Props) {
    return (
        <div className={`max-w-5xl rounded-2xl border-2 border-dashed border-violet-200 bg-white p-10 text-center shadow-xs${className ? ` ${className}` : ""}`}>
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-violet-50 text-violet-600">
                <Icon className="h-8 w-8" aria-hidden />
            </div>
            <h3 className="mt-5 text-xl font-bold text-violet-950">{titre}</h3>
            <p className="mx-auto mt-2 max-w-md text-sm text-violet-600">{texte}</p>
            <Link
                href={action.href}
                className="mt-6 inline-flex items-center gap-2 rounded-xl bg-violet-600 px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-violet-700"
            >
                <action.Icon className="h-4 w-4" aria-hidden /> {action.label}
            </Link>
        </div>
    );
}
