const ACTUALITES = [
    {
        id: 1,
        label: 'EVENT',
    },
    {
        id: 2,
        label: 'EVENT',
    },
    {
        id: 3,
        label: 'EVENT',
    },
    {
        id: 4,
        label: 'EVENT',
    },
];

export default function ActualitesPage() {
    return (
        <div className="min-h-screen bg-neutral-300 px-6 py-8">
            <div className="mx-auto max-w-7xl">
                <h1 className="mb-10 text-center text-3xl font-normal text-black">
                    Actualités
                </h1>

                <section className="space-y-8">
                    {ACTUALITES.map((actualite) => (
                        <article
                            key={actualite.id}
                            className="flex min-h-28 items-center bg-neutral-200 px-10 py-6"
                        >
                            <div className="flex w-full items-center gap-24">
                                <div className="h-20 w-44 border border-dashed border-neutral-700 bg-neutral-200" />

                                <p className="text-xs font-medium uppercase tracking-tight text-black">
                                    {actualite.label}
                                </p>
                            </div>
                        </article>
                    ))}
                </section>
            </div>
        </div>
    );
}
