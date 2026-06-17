export default function IntervenantAnimerPage() {
    return (
        <div className="mx-auto max-w-[920px]">
            <h1 className="text-[25px] font-bold leading-none text-slate-950">
                Animer
            </h1>

            <p className="mt-3 text-[21px] leading-snug text-slate-700">
                Consultez les ateliers &agrave; pr&eacute;parer et &agrave; animer.
            </p>

            <section className="mt-7 h-[420px] rounded-2xl border border-slate-200 bg-white p-6 text-[20px] font-semibold text-slate-950 shadow-sm">
                {"Liste des ateliers associes a l'intervenant connecte."}
            </section>
        </div>
    );
}
