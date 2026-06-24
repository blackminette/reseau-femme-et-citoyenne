export default function MentionsLegalesPage() {
    return (
        <main className="max-w-4xl mx-auto px-4 py-12 text-gray-800">
            <h1 className="text-3xl font-bold mb-8 text-[#260936]">Mentions Légales</h1>
        
            <section className="mb-8">
                <h2 className="text-xl font-semibold mb-4">1. Éditeur du site</h2>
                <p className="text-sm text-gray-600 leading-relaxed">
                    Le site Réseau Femme & Citoyenne 06 est édité par l'association... [Vos infos ici]
                </p>
            </section> 

            
            {/* ID intercepte le #confidentialite dans lien contact ! */}
            <section id="confidentialite" className="mb-8 pt-4">
                <h2 className="text-xl font-semibold mb-4 text-[#260936]">2. Politique de Confidentialité</h2>
                <p className="text-sm text-gray-600 leading-relaxed mb-4">
                    Nous accordons une grande importance à la protection de vos données personnelles.
                </p>
                <h3 className="font-medium mb-2">Collecte des données</h3>
                <p className="text-sm text-gray-600 leading-relaxed">
                    Lorsque vous utilisez notre formulaire de contact, nous collectons votre nom, votre adresse e-mail et le contenu de votre message afin de pouvoir traiter votre demande. Ces données ne sont jamais cédées à des tiers.
                </p>
                
            </section>
        </main>
    );
}