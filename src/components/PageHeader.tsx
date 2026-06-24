// * src/components/PageHeader.tsx
import Link from "next/link";
import { ArrowLeft, type LucideIcon } from "lucide-react";

/**
 * En-tête de page réutilisable de l'espace membre :
 * lien retour optionnel, titre, sous-titre et bouton d'action optionnel.
 */
type Props = {
    titre: string;
    sousTitre?: string;
    retour?: { href: string; label: string };
    action?: { href: string; label: string; Icon: LucideIcon };
};

export default function PageHeader({ titre, sousTitre, retour, action }: Props) {
    return (
        <>
            {retour && (
                <Link
                    href={retour.href}
                    className="inline-flex items-center gap-1.5 text-sm text-violet-500 transition-colors hover:text-violet-700"
                >
                    <ArrowLeft className="h-4 w-4" aria-hidden /> {retour.label}
                </Link>
            )}
            <div className={`flex flex-wrap items-end justify-between gap-4 border-b border-violet-200 pb-5${retour ? " mt-3" : ""}`}>
                <div className="flex flex-col gap-1">
                    <h1 className="text-3xl font-bold tracking-tight text-violet-950">{titre}</h1>
                    {sousTitre && <p className="text-sm text-violet-600">{sousTitre}</p>}
                </div>
                {action && (
                    <Link
                        href={action.href}
                        className="inline-flex items-center gap-2 rounded-xl bg-violet-600 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-violet-700"
                    >
                        <action.Icon className="h-4 w-4" aria-hidden /> {action.label}
                    </Link>
                )}
            </div>
        </>
    );
}
