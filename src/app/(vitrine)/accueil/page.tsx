// * src/app/(vitrine)/page.tsx
export default function Accueil() {
    return (
        <div className="bg-[#eedeff] pb-16 grow">
            {/* Section hero : grande bannière d'accueil avec image de fond */}
            <section className="relative min-h-[85vh] w-full bg-[url('/background.png')] bg-cover bg-center text-white flex items-center">
                {/* Voile dégradé violet pour une DA plus moderne */}
                <div className="absolute inset-0 bg-linear-to-b from-[#752fbb]/90 via-[#752fbb]/60 to-[#752fbb]/30"></div>

                {/* Conteneur principal placé au-dessus du voile grâce à z-10 */}
                <div className="relative z-10 w-full px-8 text-center max-w-7xl mx-auto py-20">
                    {/* Titre central */}
                    <div className="mb-8">
                        <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight drop-shadow-lg leading-tight">
                            Réseau Femme <span className="text-[#ffd166]">&</span> Citoyenne
                        </h1>
                    </div>

                    {/* Slogan */}
                    <div className="mb-12 max-w-3xl mx-auto">
                        <p className="text-xl md:text-3xl font-light text-[#eedeff] leading-relaxed">
                            Agir ensemble pour l’autonomie, la citoyenneté et l’inclusion.
                        </p>
                    </div>

                    {/* Boutons d'action Hero */}
                    <div className="flex flex-col sm:flex-row justify-center gap-6 items-center">
                        <a
                            href="/ateliers"
                            className="w-full sm:w-auto px-10 py-4 bg-[#ffd166] text-[#752fbb] font-bold rounded-full transition hover:scale-105 shadow-xl flex items-center justify-center gap-2"
                        >
                            Découvrir nos ateliers
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14" /><path d="m12 5 7 7-7 7" /></svg>
                        </a>
                        <a
                            href="/a-propos"
                            className="w-full sm:w-auto px-10 py-4 bg-white/10 backdrop-blur-md text-white border border-white/30 font-bold rounded-full transition hover:bg-white/20 flex items-center justify-center"
                        >
                            En savoir plus
                        </a>
                    </div>
                </div>

                {/* Bas : lien vers la section suivante - caché ou réduit sur tout petit mobile pour éviter chevauchement */}
                <a
                    href="#prochaine-section"
                    className="absolute bottom-6 left-1/2 -translate-x-1/2 z-10 hidden md:flex flex-col items-center transition hover:opacity-80 text-[#ffd166]"
                >
                    <span className="text-xs font-bold uppercase tracking-widest mb-2">Explorer</span>
                    <div className="animate-bounce p-2 bg-[#752fbb]/20 rounded-full backdrop-blur-sm">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="m6 9 6 6 6-6" /></svg>
                    </div>
                </a>
            </section>

            {/* Section de présentation rapide de l'association et de son impact */}
            <section
                id="prochaine-section"
                className="mx-4 mt-12 scroll-mt-24 rounded-2rem bg-white p-8 md:p-20 text-center text-gray-800 shadow-2xl shadow-[#bc96e6]/20 max-w-7xl md:mx-auto"
            >
                {/* Présentation : titre à gauche, texte à droite sur écran moyen et grand */}
                <div className="grid gap-12 md:grid-cols-[350px_1fr] items-center text-left">
                    <h2 className="text-4xl font-black text-[#752fbb] leading-[1.1]">
                        Notre mission <br />
                        <span className="text-[#bc96e6] font-medium text-2xl">Accompagner & Agir</span>
                    </h2>

                    <div className="relative">
                        {/* Ligne décorative */}
                        <div className="absolute -left-8 top-0 bottom-0 w-1.5 bg-[#ffd166] hidden md:block rounded-full" />
                        <p className="text-xl leading-relaxed text-slate-700 font-medium">
                            Le Réseau Femme et Citoyenne 06 accompagne les habitants du département dans leurs
                            démarches du quotidien, l’accès au numérique, la citoyenneté et
                            l’autonomie sociale. Nous créons des ponts vers l'indépendance.
                        </p>
                    </div>
                </div>

                {/* Bloc des statistiques d'impact */}
                <div className="mt-24">
                    <div className="flex flex-col items-center mb-16">
                        <h3 className="text-3xl font-black text-[#752fbb] mb-2">Notre Impact</h3>
                        <div className="w-24 h-1.5 bg-[#ffd166] rounded-full" />
                    </div>

                    <div className="grid gap-10 text-center sm:grid-cols-3">
                        <div className="group p-8 rounded-2rem bg-[#eedeff]/40 border border-[#bc96e6]/20 transition hover:bg-white hover:shadow-xl hover:-translate-y-1">
                            <div className="text-5xl font-black text-[#752fbb] mb-2 group-hover:scale-110 transition">150+</div>
                            <div className="text-lg font-bold text-[#bc96e6] uppercase tracking-wide">ateliers animés</div>
                            <div className="mt-2 text-sm text-slate-400 font-medium">Année en cours</div>
                        </div>

                        <div className="group p-8 rounded-2rem bg-[#ffd166]/15 border border-[#ffd166]/40 transition hover:bg-white hover:shadow-xl hover:-translate-y-1">
                            <div className="text-5xl font-black text-[#752fbb] mb-2 group-hover:scale-110 transition">1200</div>
                            <div className="text-lg font-bold text-[#bc96e6] uppercase tracking-wide">participations</div>
                            <div className="mt-2 text-sm text-slate-400 font-medium">Impact direct</div>
                        </div>

                        <div className="group p-8 rounded-2rem bg-[#bc96e6]/10 border border-[#bc96e6]/25 transition hover:bg-white hover:shadow-xl hover:-translate-y-1">
                            <div className="text-5xl font-black text-[#752fbb] mb-2 group-hover:scale-110 transition">45</div>
                            <div className="text-lg font-bold text-[#bc96e6] uppercase tracking-wide">bénévoles</div>
                            <div className="mt-2 text-sm text-slate-400 font-medium">Force vive</div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Section des dernières actualités */}
            <section className="mx-4 mt-16 rounded-[2.5rem] bg-[#752fbb] p-8 md:p-20 text-center text-white shadow-2xl max-w-7xl md:mx-auto relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-full opacity-5 pointer-events-none">
                    <svg width="100%" height="100%"><pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse"><path d="M 40 0 L 0 0 0 40" fill="none" stroke="white" strokeWidth="1" /></pattern><rect width="100%" height="100%" fill="url(#grid)" /></svg>
                </div>

                <div className="flex flex-col md:flex-row justify-between items-center gap-6 mb-12 relative z-10">
                    <h2 className="text-4xl font-black text-[#ffd166]">Dernières Actualités</h2>
                    <a href="/actualites" className="group flex items-center gap-2 px-6 py-2 bg-white/10 hover:bg-white/20 rounded-full font-bold transition">
                        Voir tout
                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="group-hover:translate-x-1 transition"><path d="M5 12h14" /><path d="m12 5 7 7-7 7" /></svg>
                    </a>
                </div>

                <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3 relative z-10">
                    {[1, 2, 3].map((i) => (
                        <article key={i} className="group flex flex-col h-full rounded-3xl bg-white/5 backdrop-blur-md p-6 md:p-8 border border-white/10 text-left transition hover:bg-white/15 hover:shadow-2xl">
                            <div className="mb-6 h-40 md:h-48 w-full bg-[#bc96e6]/20 rounded-2xl overflow-hidden shrink-0">
                                <div className="w-full h-full bg-linear-to-br from-[#bc96e6]/30 to-transparent animate-pulse" />
                            </div>
                            <div className="flex flex-col grow">
                                <h3 className="mb-3 text-xl md:text-2xl font-black text-[#ffd166] group-hover:text-white transition leading-tight">
                                    Titre de l’actualité {i}
                                </h3>
                                <p className="text-sm md:text-base text-[#eedeff]/80 line-clamp-3 mb-6 font-medium">
                                    Découvrez les derniers projets de l'association Réseau Femme et Citoyenne 06 et l'impact de nos actions sur le terrain...
                                </p>
                                <div className="mt-auto flex items-center gap-2 text-[#ffd166] font-black text-sm uppercase tracking-tighter">
                                    Lire l'article
                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14" /><path d="m12 5 7 7-7 7" /></svg>
                                </div>
                            </div>
                        </article>
                    ))}
                </div>
            </section>

            {/* Section soutien - Version uniformisée en couleur */}
            <section className="mx-4 mt-16 rounded-[2.5rem] bg-white p-8 md:p-20 text-center text-gray-800 shadow-2xl max-w-7xl md:mx-auto overflow-hidden relative">
                <div className="absolute top-0 right-0 w-80 h-80 bg-[#ffd166]/10 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl" />
                <div className="absolute bottom-0 left-0 w-64 h-64 bg-[#bc96e6]/10 rounded-full translate-y-1/2 -translate-x-1/2 blur-3xl" />

                <div className="relative z-10">
                    <h2 className="mb-4 text-4xl font-black text-[#752fbb]">
                        Comment nous soutenir ?
                    </h2>
                    <p className="mb-16 text-lg text-slate-600 max-w-2xl mx-auto font-medium leading-relaxed">Votre engagement, qu'il soit financier ou humain, permet à l'association de pérenniser ses actions essentielles.</p>

                    <div className="grid gap-8 md:grid-cols-3">
                        {/* Bloc Don */}
                        <div className="group p-10 rounded-3xl bg-white border border-[#bc96e6]/20 flex flex-col items-center shadow-lg hover:shadow-2xl hover:-translate-y-2 transition duration-300">
                            <div className="mb-8 p-5 bg-[#752fbb]/5 rounded-2xl group-hover:bg-[#752fbb] transition-colors duration-300">
                                <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-[#752fbb] group-hover:text-white transition-colors"><path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/></svg>
                            </div>
                            <h3 className="text-2xl font-black mb-2 text-[#752fbb]">Don ponctuel</h3>
                            <p className="text-sm text-slate-500 mb-8 font-medium">Soutenez nos projets financièrement</p>
                            <button
                                type="button"
                                className="w-full rounded-full bg-[#752fbb] text-white px-8 py-4 font-black transition hover:bg-[#bc96e6] shadow-lg shadow-[#752fbb]/20"
                            >
                                Faire un don
                            </button>
                        </div>

                        {/* Bloc Bénévolat */}
                        <div className="group p-10 rounded-3xl bg-white border border-[#bc96e6]/20 flex flex-col items-center shadow-lg hover:shadow-2xl hover:-translate-y-2 transition duration-300">
                            <div className="mb-8 p-5 bg-[#752fbb]/5 rounded-2xl group-hover:bg-[#752fbb] transition-colors duration-300">
                                <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-[#752fbb] group-hover:text-white transition-colors"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
                            </div>
                            <h3 className="text-2xl font-black mb-2 text-[#752fbb]">Engagement</h3>
                            <p className="text-sm text-slate-500 mb-8 font-medium">Offrez de votre temps et vos compétences</p>
                            <button
                                type="button"
                                className="w-full rounded-full bg-[#752fbb] text-white px-8 py-4 font-black transition hover:bg-[#bc96e6] shadow-lg shadow-[#752fbb]/20"
                            >
                                Devenir Bénévole
                            </button>
                        </div>

                        {/* Bloc Partenariat */}
                        <div className="group p-10 rounded-3xl bg-white border border-[#bc96e6]/20 flex flex-col items-center shadow-lg hover:shadow-2xl hover:-translate-y-2 transition duration-300">
                            <div className="mb-8 p-5 bg-[#752fbb]/5 rounded-2xl group-hover:bg-[#752fbb] transition-colors duration-300">
                                <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-[#752fbb] group-hover:text-white transition-colors"><rect width="8" height="8" x="2" y="2" rx="1"/><rect width="8" height="8" x="14" y="2" rx="1"/><rect width="8" height="8" x="2" y="14" rx="1"/><rect width="8" height="8" x="14" y="14" rx="1"/></svg>
                            </div>
                            <h3 className="text-2xl font-black mb-2 text-[#752fbb]">Partenariat</h3>
                            <p className="text-sm text-slate-500 mb-8 font-medium">Construisons ensemble des projets durables</p>
                            <button
                                type="button"
                                className="w-full rounded-full bg-[#752fbb] text-white px-8 py-4 font-black transition hover:bg-[#bc96e6] shadow-lg shadow-[#752fbb]/20"
                            >
                                Devenir Partenaire
                            </button>
                        </div>
                    </div>
                </div>
            </section>

            {/* Section localisation avec deux cartes séparées */}
            <section className="mx-4 mt-16 rounded-[2.5rem] bg-white p-8 md:p-20 text-center text-gray-800 shadow-2xl max-w-7xl md:mx-auto">
                <h2 className="mb-12 text-4xl font-black text-[#752fbb]">
                    Nous trouver
                </h2>

                <div className="grid gap-12 md:grid-cols-2 text-left">
                    {/* Carte 1 : Saint-Roch */}
                    <div className="group">
                        <div className="aspect-square w-full overflow-hidden rounded-2rem bg-slate-100 shadow-inner border border-slate-200 transition group-hover:shadow-xl">
                            <iframe
                                title="Carte Maison des Associations Saint-Roch"
                                src="https://www.google.com/maps?q=Maison+des+Associations+Saint-Roch+Nice&z=15&output=embed"
                                className="h-full w-full grayscale-[0.2] contrast-[1.1]"
                                style={{ border: 0 }}
                                allowFullScreen={false}
                                loading="lazy"
                                referrerPolicy="no-referrer-when-downgrade"
                            ></iframe>
                        </div>
                        <div className="mt-8 flex gap-5 items-start">
                            <div className="bg-[#752fbb] p-4 rounded-2xl text-white shadow-lg">
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" /><circle cx="12" cy="10" r="3" /></svg>
                            </div>
                            <div>
                                <p className="font-black text-xl text-[#752fbb] mb-1">Associations Saint Roch</p>
                                <p className="text-slate-600 font-medium">50 Boulevard Saint-Roch, Nice</p>
                                <div className="mt-3 inline-block px-3 py-1 bg-[#752fbb]/10 text-[#752fbb] text-xs font-bold rounded-full uppercase tracking-widest">Siège Principal</div>
                            </div>
                        </div>
                    </div>

                    {/* Carte 2 : Bensa */}
                    <div className="group">
                        <div className="aspect-square w-full overflow-hidden rounded-2rem bg-slate-100 shadow-inner border border-slate-200 transition group-hover:shadow-xl">
                            <iframe
                                title="Carte CR Bensa"
                                src="https://www.google.com/maps?q=43.706358,7.257943&z=15&output=embed"
                                className="h-full w-full grayscale-[0.2] contrast-[1.1]"
                                style={{ border: 0 }}
                                allowFullScreen={false}
                                loading="lazy"
                                referrerPolicy="no-referrer-when-downgrade"
                            ></iframe>
                        </div>
                        <div className="mt-8 flex gap-5 items-start">
                            <div className="bg-[#ffd166] p-4 rounded-2xl text-[#752fbb] shadow-lg border border-[#ffd166]/50">
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" /><circle cx="12" cy="10" r="3" /></svg>
                            </div>
                            <div>
                                <p className="font-black text-xl text-[#752fbb] mb-1">CR Bensa</p>
                                <p className="text-slate-600 font-medium">Nice Centre-Ville</p>
                                <div className="mt-3 inline-block px-3 py-1 bg-[#ffd166]/30 text-[#752fbb] text-xs font-bold rounded-full uppercase tracking-widest">Annexe Ateliers</div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="mt-16 p-6 rounded-2xl bg-[#eedeff]/40 border border-[#bc96e6]/30 inline-flex items-center gap-4">
                    <div className="p-3 bg-white rounded-xl shadow-sm text-[#752fbb]">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="4" r="1"/><path d="M18 19a6 6 0 1 0-12 0"/><path d="M10 8h4l1 7h-6z"/><path d="m14 8 1-3h1"/><path d="m10 8-1-3h-1"/></svg>
                    </div>
                    <p className="text-sm font-bold text-slate-700 leading-tight">Tous nos lieux sont accessibles aux PMR et poussettes.</p>
                </div>
            </section>
        </div>
    );
}
