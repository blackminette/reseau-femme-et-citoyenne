export default function IntervenantTeleverserPage() {
    return (
        <div className="mx-auto max-w-[920px]">
            <h1 className="text-[25px] font-bold leading-none text-slate-950">
                T&eacute;l&eacute;verser
            </h1>

            <p className="mt-3 text-[21px] leading-snug text-slate-700">
                Ajoutez les documents utiles : mat&eacute;riel, budget et disponibilit&eacute;s.
            </p>

            <section className="mt-7 grid grid-cols-3 gap-9">
                <article className="h-[350px] rounded-2xl border border-slate-200 bg-white p-6 text-center text-[22px] font-semibold text-slate-950 shadow-sm">
                    Mat&eacute;riel n&eacute;cessaire
                </article>

                <article className="h-[350px] rounded-2xl border border-slate-200 bg-white p-6 text-center text-[22px] font-semibold text-slate-950 shadow-sm">
                    Budget
                </article>

                <article className="h-[350px] rounded-2xl border border-slate-200 bg-white p-6 text-center text-[22px] font-semibold text-slate-950 shadow-sm">
                    Horaires de disponibilit&eacute;
                </article>
            </section>
        </div>
    );
}
