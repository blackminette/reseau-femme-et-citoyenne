import type { ReactNode } from "react";
import Link from "next/link";
import {
    Landmark, BookOpen, Palette, GraduationCap, Leaf, Monitor,
    Lightbulb, Laptop, Rocket, Award, Globe,
    Users, Sparkles, History, Handshake, ChevronRight,
} from "lucide-react";

// Titre de l'onglet + description pour Google (bonne pratique Next.js)
export const metadata = {
    title: "À propos — Notre association",
    description: "Notre histoire, nos partenaires, notre équipe et les avis des familles.",
};

/* ---------- Contenu de la page (à brancher sur la base de données plus tard) ---------- */

const CHIFFRES = [
    { valeur: "500+", label: "Enfants accompagnés", couleur: "text-[#752fbb]" },
    { valeur: "15+", label: "Types d'ateliers", couleur: "text-orange-500" },
    { valeur: "6", label: "Années d'expérience", couleur: "text-amber-500" },
    { valeur: "4", label: "Animateurs diplômés", couleur: "text-pink-500" },
];

const ATOUTS = [
    { Icon: Palette, titre: "Créativité", texte: "Des activités artistiques adaptées aux enfants." },
    { Icon: Users, titre: "Partage", texte: "Apprendre ensemble en groupe." },
    { Icon: Sparkles, titre: "Épanouissement", texte: "Développer confiance et imagination." },
];

const NAV = [
    { href: "#histoire", Icon: History, label: "Histoire" },
    { href: "#partenaires", Icon: Handshake, label: "Partenaires" },
    { href: "#equipe", Icon: Users, label: "Équipe & avis" },
];

const HISTOIRE = [
    { annee: "2018", Icon: Lightbulb, titre: "La naissance d'une idée", texte: "Marie Dubois et Thomas Lefevre, amis de longue date, partagent une conviction : les enfants ont besoin d'espaces pour créer librement, sans pression ni jugement." },
    { annee: "2019", Icon: Palette, titre: "Premiers ateliers", texte: "Les premiers ateliers sont organisés dans un petit local associatif de Nice. Seulement 12 enfants au départ, mais un engagement immédiat des familles du quartier." },
    { annee: "2020", Icon: Laptop, titre: "Adaptation en ligne", texte: "Face à la pandémie, l'équipe s'adapte et propose des ateliers en visioconférence. Une expérience qui révèle la résilience et la créativité de l'association." },
    { annee: "2021", Icon: Rocket, titre: "Expansion de l'équipe", texte: "Sophie Martin et Lucas Bernard rejoignent l'aventure. L'offre s'élargit avec les ateliers cuisine, théâtre et éveil musical. Plus de 100 enfants inscrits." },
    { annee: "2022", Icon: Award, titre: "Reconnaissance officielle", texte: "L'association reçoit le label « Association Engagée » de la ville de Nice et noue des partenariats avec plusieurs écoles primaires du département." },
    { annee: "2024", Icon: Globe, titre: "Plateforme éducative", texte: "Lancement de la plateforme en ligne permettant aux parents de suivre la progression de leurs enfants et d'accéder à des exercices éducatifs depuis chez eux." },
];

const PARTENAIRES = [
    { Icon: Landmark, nom: "Ville de Nice", type: "Collectivité publique", texte: "Soutien financier et mise à disposition de locaux associatifs pour nos ateliers hebdomadaires." },
    { Icon: BookOpen, nom: "Médiathèque Centrale", type: "Partenaire culturel", texte: "Accès privilégié aux ressources pédagogiques et co-organisation d'ateliers lecture et conte." },
    { Icon: Palette, nom: "Galerie des Arts", type: "Partenaire artistique", texte: "Prêt de matériel artistique et expositions annuelles des œuvres créées par les enfants." },
    { Icon: GraduationCap, nom: "École Pasteur", type: "Partenaire scolaire", texte: "Interventions directement dans l'école pour des ateliers créatifs pendant le temps scolaire." },
    { Icon: Leaf, nom: "Biocoop Nice", type: "Partenaire commerce", texte: "Don de produits biologiques pour nos ateliers pâtisserie et cuisine, pour une alimentation saine." },
    { Icon: Monitor, nom: "TechForKids", type: "Partenaire numérique", texte: "Développement et hébergement de notre plateforme éducative destinée aux enfants en ligne." },
];

const EQUIPE = [
    { initiales: "MD", nom: "Marie Dubois", role: "Responsable pédagogique", bio: "Directrice des ateliers avec 8 ans d'expérience en animation pour enfants. Passionnée par la créativité et l'épanouissement.", couleur: "from-orange-400 to-pink-500" },
    { initiales: "TL", nom: "Thomas Lefevre", role: "Animateur arts & bricolage", bio: "Artiste plasticien, il encadre les ateliers de peinture, sculpture et création. Grand enfant dans l'âme !", couleur: "from-amber-400 to-orange-500" },
    { initiales: "SM", nom: "Sophie Martin", role: "Animatrice cuisine & nature", bio: "Chef pâtissière bienveillante, elle transmet le goût des bons produits et des moments de partage et de découverte.", couleur: "from-pink-400 to-rose-500" },
    { initiales: "LB", nom: "Lucas Bernard", role: "Animateur expression & jeux", bio: "Formé au théâtre et à l'animation, il anime les ateliers d'éveil pour que chaque enfant puisse s'exprimer librement.", couleur: "from-[#bc96e6] to-[#752fbb]" },
];

const AVIS = [
    { note: 5, texte: "Mon fils n'arrête pas de parler de ses ateliers ! Il a découvert une passion pour la peinture. Vraiment excellent !", auteur: "Émilie R.", role: "Parent" },
    { note: 5, texte: "Équipe super bienveillante, ma fille se sent écoutée et encouragée. Elle a gagné en confiance et en autonomie. Merci !", auteur: "Julien D.", role: "Parent" },
    { note: 5, texte: "C'est trop cool ! J'ai appris à faire de la tarte et j'ai eu plein de nouvelles copines. Je veux y aller chaque semaine !", auteur: "Léa, 8 ans", role: "Enfant" },
    { note: 4, texte: "Une bonne ambiance, des activités variées et adaptées à l'âge des enfants. Le rapport qualité-prix est excellent.", auteur: "Céline M.", role: "Parent" },
    { note: 5, texte: "Mon enfant a trouvé son havre de paix. Les animateurs sont patients et attentionnés. Vivement recommandé !", auteur: "Marc L.", role: "Parent" },
    { note: 5, texte: "L'atelier théâtre : mon timide s'est transformé ! Il ne parlait jamais en public, le voilà à chanter et jouer. Magique !", auteur: "Nathalie P.", role: "Parent" },
];

/* ---------- Styles réutilisés + petit composant de section ---------- */

const CARD = "bg-white rounded-2xl shadow-sm border border-[#ece0f7]";
const BTN = "inline-flex items-center gap-2 px-6 py-3 rounded-full font-semibold transition-colors";

// Bloc de section avec son titre centré (réutilisé pour histoire, partenaires, équipe, avis)
function Section({ id, titre, sous, fond, children }: {
    id?: string; titre: string; sous: string; fond?: boolean; children: ReactNode;
}) {
    return (
        <section id={id} className={`py-20 ${fond ? "bg-white" : ""}`}>
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                <header className="text-center space-y-3 mb-14">
                    <h2 className="text-3xl font-extrabold text-[#260936]">{titre}</h2>
                    <p className="text-slate-500">{sous}</p>
                </header>
                {children}
            </div>
        </section>
    );
}

/* ---------- La page ---------- */

export default function AProposPage() {
    return (
        <div className="bg-[#eedeff]">

            {/* Bandeau violet */}
            <section className="bg-gradient-to-br from-[#8a63c9] via-[#9a73d4] to-[#b38fe0] text-white">
                <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-20 grid md:grid-cols-2 gap-10 items-center">
                    <div className="space-y-6">
                        <span className="text-xs font-semibold tracking-widest uppercase text-[#ffd166]">Association</span>
                        <h1 className="text-5xl font-extrabold leading-tight">Notre association</h1>
                        <p className="text-lg text-[#eedeff] max-w-md">Une équipe engagée pour l'épanouissement des enfants.</p>
                        <a href="#histoire" className={`${BTN} bg-[#ffd166] text-[#260936] hover:bg-[#ffc94d]`}>
                            Notre histoire <ChevronRight className="w-4 h-4" aria-hidden />
                        </a>
                    </div>

                    <div className="space-y-4">
                        {ATOUTS.map(({ Icon, titre, texte }) => (
                            <div key={titre} className="flex gap-4 items-start bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-5">
                                <Icon className="w-6 h-6 mt-0.5 shrink-0 text-white/80" aria-hidden />
                                <div>
                                    <h3 className="font-semibold">{titre}</h3>
                                    <p className="text-sm text-[#eedeff]">{texte}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Menu d'ancres qui descend vers les sections */}
            <nav className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 -mt-6 relative z-10">
                <div className="flex flex-wrap justify-center gap-3 bg-white rounded-full shadow-sm border border-[#ece0f7] px-6 py-3 w-fit mx-auto">
                    {NAV.map(({ href, Icon, label }) => (
                        <a key={href} href={href} className="flex items-center gap-1.5 text-sm font-medium text-[#260936] hover:text-[#752fbb] px-3 py-1">
                            <Icon className="w-4 h-4" aria-hidden /> {label}
                        </a>
                    ))}
                </div>
            </nav>

            {/* Qui sommes-nous + chiffres clés */}
            <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-20 grid md:grid-cols-2 gap-12 items-center">
                <div className="space-y-5">
                    <span className="text-xs font-semibold tracking-widest uppercase text-[#752fbb]">Qui sommes-nous ?</span>
                    <h2 className="text-3xl font-extrabold text-[#260936]">Une association au service des enfants</h2>
                    <p className="text-slate-600 leading-relaxed">Fondée en 2018, notre association loi 1901 est dédiée à l'épanouissement des enfants de 3 à 12 ans à travers des ateliers créatifs, culturels et éducatifs.</p>
                    <p className="text-slate-600 leading-relaxed">Notre mission : offrir à chaque enfant un espace bienveillant pour explorer, créer et grandir, en complémentarité avec l'école et la famille.</p>
                    <Link href="#histoire" className={`${BTN} bg-[#752fbb] hover:bg-[#5e2596] text-white`}>
                        Découvrir notre histoire <ChevronRight className="w-4 h-4" aria-hidden />
                    </Link>
                </div>

                <div className="grid grid-cols-2 gap-5">
                    {CHIFFRES.map(({ valeur, label, couleur }) => (
                        <div key={label} className={`${CARD} p-6 text-center`}>
                            <p className={`text-4xl font-extrabold ${couleur}`}>{valeur}</p>
                            <p className="text-sm text-slate-500 mt-1">{label}</p>
                        </div>
                    ))}
                </div>
            </section>

            {/* Notre histoire (la frise) */}
            <Section id="histoire" titre="Notre histoire" sous="De l'idée à l'association — six années d'aventure créative et humaine." fond>
                <div className="grid md:grid-cols-2 gap-x-12 gap-y-10">
                    {HISTOIRE.map(({ annee, Icon, titre, texte }) => (
                        <article key={annee} className="flex gap-4 border-l-2 border-[#e3d3f5] pl-6 relative">
                            <span className="absolute -left-[9px] top-1 w-4 h-4 rounded-full bg-[#752fbb] border-2 border-white" />
                            <div className="space-y-1">
                                <span className="text-xs font-semibold text-[#752fbb]">{annee}</span>
                                <h3 className="font-bold text-[#260936] flex items-center gap-2">
                                    <Icon className="w-4 h-4 text-[#bc96e6] shrink-0" aria-hidden /> {titre}
                                </h3>
                                <p className="text-sm text-slate-600 leading-relaxed">{texte}</p>
                            </div>
                        </article>
                    ))}
                </div>
            </Section>

            {/* Nos partenaires + encart "Devenez partenaire" */}
            <Section id="partenaires" titre="Nos partenaires" sous="Grâce à leur soutien, nous pouvons offrir des activités de qualité à tous les enfants.">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {PARTENAIRES.map(({ Icon, nom, type, texte }) => (
                        <article key={nom} className={`${CARD} p-6 text-center hover:shadow-md transition-shadow`}>
                            <div className="w-14 h-14 mx-auto rounded-full bg-[#f3e9fc] flex items-center justify-center">
                                <Icon className="w-7 h-7 text-[#752fbb]" aria-hidden />
                            </div>
                            <h3 className="mt-4 font-bold text-[#260936]">{nom}</h3>
                            <p className="text-xs font-semibold tracking-wide uppercase text-[#752fbb] mt-1">{type}</p>
                            <p className="text-sm text-slate-600 mt-3 leading-relaxed">{texte}</p>
                        </article>
                    ))}
                </div>

                <div className="mt-12 bg-gradient-to-br from-[#9a73d4] to-[#b38fe0] rounded-2xl text-center text-white px-6 py-12">
                    <h3 className="text-2xl font-extrabold">Devenez partenaire</h3>
                    <p className="text-[#eedeff] max-w-lg mx-auto mt-3">Vous souhaitez soutenir nos actions et contribuer à l'épanouissement des enfants de notre région ? Rejoignez notre réseau de partenaires !</p>
                    <Link href="/contact" className={`${BTN} mt-6 bg-[#ffd166] text-[#260936] hover:bg-[#ffc94d]`}>
                        Nous écrire <ChevronRight className="w-4 h-4" aria-hidden />
                    </Link>
                </div>
            </Section>

            {/* Notre équipe */}
            <Section id="equipe" titre="Notre équipe" sous="Des personnes bienveillantes, créatives et engagées auprès de vos enfants." fond>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {EQUIPE.map(({ initiales, nom, role, bio, couleur }) => (
                        <article key={nom} className="bg-[#faf5ff] rounded-2xl border border-[#ece0f7] overflow-hidden">
                            <div className={`h-28 bg-gradient-to-br ${couleur} flex items-center justify-center`}>
                                <span className="text-2xl font-bold text-white">{initiales}</span>
                            </div>
                            <div className="p-5">
                                <h3 className="font-bold text-[#260936]">{nom}</h3>
                                <p className="text-sm font-medium text-[#752fbb]">{role}</p>
                                <p className="text-sm text-slate-600 mt-2 leading-relaxed">{bio}</p>
                            </div>
                        </article>
                    ))}
                </div>
            </Section>

            {/* Ils en parlent (les avis) */}
            <Section titre="Ils en parlent" sous="Les avis des parents et enfants qui ont participé à nos ateliers.">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {AVIS.map(({ note, texte, auteur, role }, i) => (
                        <article key={i} className={`${CARD} p-6 flex flex-col`}>
                            <div className="text-amber-400 text-sm" aria-label={`Note : ${note} sur 5`}>
                                {"★".repeat(note)}{"☆".repeat(5 - note)}
                            </div>
                            <p className="text-sm text-slate-600 italic mt-3 leading-relaxed flex-grow">« {texte} »</p>
                            <footer className="mt-4 pt-3 border-t border-[#f0e6fa]">
                                <p className="text-sm font-semibold text-[#260936]">{auteur}</p>
                                <p className="text-xs text-slate-400">{role}</p>
                            </footer>
                        </article>
                    ))}
                </div>
            </Section>

        </div>
    );
}