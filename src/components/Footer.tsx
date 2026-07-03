// * src/components/Footer.tsx

/**
 * Pied de page principal (Footer) affiché en bas du site.
 * Il présente l'identité de Réseau Femme & Citoyenne 06,
 * les lieux de localisation de l'association, les liens utiles
 * ainsi que les informations légales et le copyright.
 */

import Link from 'next/link';


export default function Footer() {
    return (
        <footer className="border-t border-[#bc96e6]/30 bg-[#260936] px-6 py-12 text-sm text-[#eedeff] relative overflow-hidden">
            {/* Décoration subtile en arrière-plan */}
            <div className="absolute top-0 left-0 w-64 h-64 bg-[#bc96e6]/10 rounded-full -translate-x-1/2 -translate-y-1/2 blur-3xl pointer-events-none" />

            <div className="mx-auto grid max-w-7xl gap-10 md:grid-cols-4 relative z-10">
                {/* Identité de l'association */}
                <div className="flex flex-col gap-4">
                    <div className="flex flex-col">
                        <span className="text-xl font-black leading-none bg-gradient-to-r from-[#ffd166] to-[#eedeff] bg-clip-text text-transparent uppercase tracking-tighter">
                            Réseau Femme
                        </span>
                        <span className="text-sm font-bold leading-none text-[#eedeff]/70 uppercase tracking-[0.2em] ml-0.5 mt-2">
                            & Citoyenne 06
                        </span>
                    </div>
                    <p className="text-sm font-medium leading-relaxed opacity-80 mt-2">
                        Agir ensemble pour l’autonomie, la citoyenneté et l’inclusion des habitants du département.
                    </p>
                    {/* Réseaux sociaux - Icônes SVG directes */}
                    <div className="flex gap-4 mt-2">
                        <a href="https://www.instagram.com/femme_citoyenne06/" target="_blank" rel="noopener noreferrer" className="p-2 rounded-full bg-white/10 hover:bg-[#ffd166] hover:text-[#260936] transition-colors" aria-label="Instagram">
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line></svg>
                        </a>
                        <a href="https://www.facebook.com/profile.php?id=100084877396335&locale=fr_FR" target="_blank" rel="noopener noreferrer" className="p-2 rounded-full bg-white/10 hover:bg-[#ffd166] hover:text-[#260936] transition-colors" aria-label="Facebook">
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path></svg>
                        </a>
                        <a href="https://www.linkedin.com/in/johanna-domzalski-0966172a3/" target="_blank" rel="noopener noreferrer" className="p-2 rounded-full bg-white/10 hover:bg-[#ffd166] hover:text-[#260936] transition-colors" aria-label="LinkedIn">
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path><rect x="2" y="9" width="4" height="12"></rect><circle cx="4" cy="4" r="2"></circle></svg>
                        </a>
                    </div>
                </div>

                {/* Localisation */}
                <div>
                    <p className="font-bold text-lg text-white mb-4 flex items-center gap-2">
                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" /><circle cx="12" cy="10" r="3" /></svg>
                        Nous trouver
                    </p>
                    <div className="space-y-2 opacity-80">
                        <p className="font-semibold">Maison des Assos Saint-Roch</p>
                        <p>50 Boulevard Saint-Roch, Nice</p>
                        <p className="mt-4 font-semibold">CR Bensa</p>
                        <p>Nice Centre</p>
                    </div>
                </div>

                {/* Liens utiles */}
                <div>
                    <p className="font-bold text-lg text-white mb-4">Navigation</p>
                    <div className="flex flex-col gap-3 font-medium">
                        <Link href="/mentions-legales" className="hover:text-[#ffd166] transition-colors flex items-center gap-2">
                            <span className="h-1 w-1 bg-[#bc96e6] rounded-full"></span>
                            Mentions légales
                        </Link>
                        <a href="/confidentialite" className="hover:text-[#ffd166] transition-colors flex items-center gap-2">
                            <span className="h-1 w-1 bg-[#bc96e6] rounded-full"></span>
                            Confidentialité
                        </a>
                        <a href="/contact" className="hover:text-[#ffd166] transition-colors flex items-center gap-2">
                            <span className="h-1 w-1 bg-[#bc96e6] rounded-full"></span>
                            Contactez-nous
                        </a>
                    </div>
                </div>

                {/* Informations complémentaires */}
                <div>
                    <p className="font-bold text-lg text-white mb-4">Informations</p>
                    <p className="text-sm opacity-80 leading-relaxed">
                        Association loi 1901 à but non lucratif.
                        Partenaire actif de la ville de Nice et des acteurs sociaux locaux.
                    </p>
                    <div className="mt-6 pt-6 border-t border-white/10">
                        <p className="text-xs font-bold text-[#ffd166] tracking-widest uppercase">
                            © 2026 RFC06
                        </p>
                    </div>
                </div>
            </div>

            {/* Bandeau d'accessibilité en bas du footer */}
            <div className="mx-auto max-w-7xl mt-12 pt-8 border-t border-white/5 text-center">
                <p className="text-xs opacity-50 flex items-center justify-center gap-2">
                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><path d="M12 8v4" /><path d="M12 16h.01" /></svg>
                    Site conçu pour l'accessibilité numérique.
                </p>
            </div>
        </footer>
    );
}
