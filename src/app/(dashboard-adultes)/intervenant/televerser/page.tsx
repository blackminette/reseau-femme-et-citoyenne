import { FileUp, Image as ImageIcon, Link2, Sparkles } from 'lucide-react';

export default function IntervenantTeleverserPage() {
    return (
        <div className="mx-auto max-w-[980px]">
            <div className="rounded-[28px] border border-[#eedeff] bg-white p-6 shadow-[0_18px_50px_rgba(117,47,187,0.08)]">
                <p className="inline-flex items-center gap-2 rounded-full bg-[#eedeff] px-3 py-1 text-xs font-bold uppercase tracking-[0.24em] text-[#752fbb]">
                    <Sparkles className="h-3.5 w-3.5" />
                    Ressources
                </p>
                <h1 className="mt-4 text-3xl font-black leading-tight text-[#260936]">
                    Téléverser
                </h1>
                <p className="mt-3 text-base leading-7 text-slate-600">
                    Ajoutez les documents utiles : matériel, budget et disponibilités.
                </p>
            </div>

            <section className="mt-6 grid gap-4 lg:grid-cols-3">
                <article className="rounded-[24px] border border-[#f2e7ff] bg-white p-5 shadow-[0_14px_36px_rgba(117,47,187,0.07)]">
                    <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#eedeff] text-[#752fbb]">
                        <ImageIcon className="h-5 w-5" />
                    </div>
                    <h2 className="mt-4 text-lg font-bold text-[#260936]">Matériel nécessaire</h2>
                    <p className="mt-2 text-sm leading-6 text-slate-600">
                        Ajouter une illustration ou un support visuel pour préparer la séance.
                    </p>
                </article>

                <article className="rounded-[24px] border border-[#f2e7ff] bg-[#fcfaff] p-5 shadow-[0_14px_36px_rgba(117,47,187,0.07)]">
                    <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#ffd166]/25 text-[#9a6b00]">
                        <FileUp className="h-5 w-5" />
                    </div>
                    <h2 className="mt-4 text-lg font-bold text-[#260936]">Budget</h2>
                    <p className="mt-2 text-sm leading-6 text-slate-600">
                        Centraliser les éléments budgétaires ou les pièces utiles au suivi.
                    </p>
                </article>

                <article className="rounded-[24px] border border-[#f2e7ff] bg-white p-5 shadow-[0_14px_36px_rgba(117,47,187,0.07)]">
                    <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#bc96e6]/20 text-[#752fbb]">
                        <Link2 className="h-5 w-5" />
                    </div>
                    <h2 className="mt-4 text-lg font-bold text-[#260936]">Horaires de disponibilité</h2>
                    <p className="mt-2 text-sm leading-6 text-slate-600">
                        Relier les documents et garder un suivi clair des créneaux disponibles.
                    </p>
                </article>
            </section>
        </div>
    );
}
