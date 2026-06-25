export default function MentionsLegalesPage() {
    return (
        <main className="max-w-4xl mx-auto px-4 py-12 text-gray-800">
            <h1 className="text-3xl font-bold mb-8 text-[#260936]">Mentions Légales</h1>
            <div className="w-full h-[1px] bg-gray-200 mt-6 mb-12"></div>
        
            
            {/* Editeur du site */}
            <section className="mb-8">
                <h2 className="text-xl font-semibold mb-3 text-[#260936]">1. Éditeur du site</h2>
                <p className="text-sm text-gray-650 leading-relaxed mb-3">
                    Le présent site est édité par l'association{' '}
                    <strong>Réseau Femme et Citoyenne 06</strong>, association régie par la loi du 1er juillet 1901.
                </p>
                <ul className="list-none p-0 m-0 space-y-2 text-sm text-gray-650">
                    <li>
                        <strong>Siège social :</strong> 79 Boulevard Virgil Barel, 06300 Nice
                    </li>
                    <li>
                        <strong>Numéro RNA :</strong>{' '}
                        <span className="text-amber-600 font-semibold bg-amber-50 px-1 rounded">[À compléter]</span>
                    </li>
                    <li>
                        <strong>Email :</strong>{' '}
                        <span className="text-[#260936]"> femmecitoyenne06@gmail.com </span>
                    </li>
                    <li>
                        <strong>Téléphone :</strong>{' '}
                        <span className="text-amber-600 font-semibold bg-amber-50 px-1 rounded">[À compléter]</span>
                    </li>
                    <li>
                        <strong>Directeur de la publication :</strong>{' '}
                        <span className="text-amber-600 font-semibold bg-amber-50 px-1 rounded">[Prénom Nom du/de la président(e)]</span>
                    </li>
                </ul>
            </section>


            {/* Hebergement */}
            <section className="mb-8">
                <h2 className="text-xl font-semibold mb-3 text-[#260936]">2. Hébergement</h2>
                <p className="text-sm text-gray-650 leading-relaxed mb-2">Le site est hébergé par :</p>
                <ul className="list-none p-0 m-0 space-y-1 text-sm text-gray-650">
                    <li>
                        <strong>IONOS SE</strong>, société de droit allemand
                    </li>
                    <li>
                        <strong>Siège :</strong> Elgendorfer Str. 57, 56410 Montabaur, Allemagne
                    </li>
                    <li>
                        <strong>Site web :</strong>{' '}
                        <a
                            href="https://www.ionos.fr"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-[#260936] underline hover:text-purple-800 transition-colors"
                        >
                            www.ionos.fr
                        </a>
                    </li>
                </ul>
            </section>


            {/* Propriété intellectuelle */}
            <section className="mb-8">
                <h2 className="text-xl font-semibold mb-3 text-[#260936]">3. Propriété intellectuelle</h2>
                <p className="text-sm text-gray-650 leading-relaxed">
                    L'ensemble des contenus présents sur ce site (textes, images, logos, graphismes) sont la propriété exclusive de l'association Réseau Femme &amp; Citoyenne 06 ou sont utilisés avec l'autorisation de leurs auteurs. Toute reproduction, représentation ou diffusion, totale ou partielle, sans autorisation écrite préalable est interdite et constitue une contrefaçon sanctionnée par le Code de la propriété intellectuelle.
                </p>
            </section>


            {/* Responsabilite */}
            <section className="mb-8">
                <h2 className="text-xl font-semibold mb-3 text-[#260936]">4. Responsabilité</h2>
                <p className="text-sm text-gray-650 leading-relaxed">
                    L'association s'efforce d'assurer l'exactitude et la mise à jour des informations publiées sur ce site. Toutefois, elle ne peut garantir l'exhaustivité ou l'absence d'erreur des informations diffusées, et ne saurait être tenue responsable des dommages directs ou indirects résultant de l'utilisation du site ou de l'impossibilité d'y accéder.
                </p>
            </section>


            {/* Donnees personnelles */}
            <section className="mb-8">
                <h2 className="text-xl font-semibold mb-3 text-[#260936]">5. Données personnelles</h2>
                <p className="text-sm text-gray-650 leading-relaxed">
                    La collecte et le traitement des données personnelles effectués via ce site sont décrits dans notre{' '}
                    <a
                        href="/mentions-legales#confidentialite"
                        className="text-[#260936] underline hover:text-purple-800 transition-colors"
                    >
                        Politique de confidentialité
                    </a>
                    , conformément au Règlement Général sur la Protection des Données (RGPD).
                </p>
            </section>


            {/* Droit applicable */}
            <section className="mb-8">
                <h2 className="text-xl font-semibold mb-3 text-[#260936]">6. Droit applicable</h2>
                <p className="text-sm text-gray-650 leading-relaxed">
                    Le présent site et ses mentions légales sont soumis au droit français. Tout litige relatif à son utilisation sera soumis à la compétence exclusive des tribunaux du ressort de Nice, sauf disposition légale contraire.
                </p>
            </section> 






            
            {/* ID intercepte le #confidentialite dans lien contact ! */}
            <div className="pt-45"></div>

            <div id="confidentialite" className="scroll-mt-32">

                <div> 
                    <h2 className="text-3xl font-bold text-[#260936]">Politique de confidentialité</h2>
                    <p className="text-xs text-gray-500 mt-1">Dernière mise à jour : 25 juin 2026</p>
                    <div className="w-full h-[1px] bg-gray-200 mt-6 mb-12"></div>
                </div>


                {/* Article 1 */}
                <section className="mb-12">
                    <h2 className="text-xl font-semibold mb-3 text-[#260936]">1. Responsable du traitement</h2>
                    <p className="text-sm text-gray-600 leading-relaxed">
                        Le responsable du traitement est l'association <strong>Réseau Femme & Citoyenne 06</strong>, dont le siège est situé au <span className="text-[#260936] px-1 rounded font-medium">79 Boulevard Virgil Barel, 06300 Nice</span>.<br />
                        Pour toute question relative à vos données : <span className="text-[#260936] px-1 rounded font-medium">femmecitoyenne06@gmail.com</span>.<br />
                        Délégué à la protection des données (DPO), le cas échéant : <span className="text-[#260936] px-1 rounded font-medium">Aucun délégué à la protection des données n'a été désigné, cette désignation n'étant pas obligatoire pour notre structure</span>.
                    </p>
                </section>


                {/* Article 2 */}
                <section className="mb-12">
                    <h3 className="text-xl font-semibold mb-3 text-[#260936]">2. Données collectées et finalités</h3>
                    <div className="overflow-x-auto border border-black-100 rounded-lg shadow-sm my-4">
                        <table className="w-full text-left border-collapse text-sm">
                            <thead>
                                <tr className="bg-gray-50 border-b border-gray-100 text-gray-700 font-semibold">
                                    <th className="p-4 w-1/3">Donnée</th>
                                    <th className="p-4 w-1/3">Finalité</th>
                                    <th className="p-4 w-1/3">Base légale</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100 text-gray-600">
                                <tr className="hover:bg-gray-50/50 transition-colors">
                                    <td className="p-4">E-mail, mot de passe (haché), prénom/nom</td>
                                    <td className="p-4">Gestion du compte utilisateur</td>
                                    <td className="p-4">Exécution du contrat</td>
                                </tr>
                                <tr className="hover:bg-gray-50/50 transition-colors">
                                    <td className="p-4">Historique des ateliers réservés</td>
                                    <td className="p-4">Suivi de votre participation</td>
                                    <td className="p-4">Exécution du contrat</td>
                                </tr>
                                <tr className="hover:bg-gray-50/50 transition-colors">
                                    <td className="p-4">Prénom, nom, e-mail, téléphone, message (Formulaire de contact)</td>
                                    <td className="p-4">Répondre à vos demandes d'information ou d'assistance</td>
                                    <td className="p-4">Exécution de mesures précontractuelles</td>
                                </tr>
                                <tr className="hover:bg-gray-50/50 transition-colors">
                                    <td className="p-4">Adresse IP, données techniques de connexion</td>
                                    <td className="p-4">Sécurité, prévention des abus et limitation du nombre de tentatives (anti-spam)</td>
                                    <td className="p-4">Intérêt légitime</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </section>


                {/* Article 3 */}
                <section className="mb-12">
                    <h3 className="text-xl font-semibold mb-3 text-[#260936]">3. Destinataires et sous-traitants</h3>
                    <p className="text-sm text-gray-600 leading-relaxed mb-3">
                        Vos données sont traitées par notre équipe et par des sous-traitants qui agissent sur nos instructions et présentent des garanties conformes au RGPD :
                    </p>
                    <ul className="list-disc pl-5 text-sm text-gray-600 space-y-2">
                        <li><strong>NodeMailer :</strong> Gestion technique et envoi des e-mails du formulaire.</li>
                        <li><strong>IONOS SE :</strong> Hébergement du site web (hébergeur allemand situé au sein de l'Union européenne).</li>
                    </ul>
                    <p className="text-sm text-gray-600 leading-relaxed mt-4">
                        Nous ne vendons ni ne louons vos données personnelles à des tiers.
                    </p>
                </section>


                {/* Article 4 */}
                <section className="mb-12">
                    <h3 className="text-xl font-semibold mb-3 text-[#260936]">4. Durées de conservation</h3>
                    <ul className="list-disc pl-5 text-sm text-gray-600 space-y-2">
                        <li>
                            <strong>Comptes utilisateurs :</strong>
                            <ul className="list-circle pl-5 mt-1 space-y-1">
                                <li><strong>Durée :</strong> Conservés pendant toute la durée d'activité du compte.</li>
                                <li>
                                    <strong>Suppression :</strong> Définitivement après une période d'inactivité de{''}
                                    <span className="text-[#260936] px-1 rounded">3 ans</span>ou dès demande de suppression par l'utilisateur.
                                </li>
                            </ul>
                        </li>

                        <li>
                            <strong>Messages du formulaire de contact :</strong> 
                            <ul className="list-circle pl-5 mt-1 space-y-1"> 
                                <li><strong>Durée :</strong> Conservés pendant une durée de 3 ans à compter du dernier contact.</li>
                            </ul>
                        </li>
                        
                        <li>
                            <strong>Journaux techniques (logs) :</strong> 
                            <ul className="list-circle pl-5 mt-1 space-y-1">
                                <li><strong>Durée :</strong> Conservés 12 mois au maximum pour des raisons de sécurité et de gestion des incidents.</li>
                            </ul>
                        </li>
                    
                    </ul>
                </section>


                {/* Article 5 */}
                <section className="mb-12">
                    <h3 className="text-xl font-semibold mb-3 text-[#260936]">5. Suppression du compte</h3>
                    <p className="text-sm text-gray-600 leading-relaxed">
                        Les utilisateurs disposent de la faculté de demander la suppression de leur compte à tout moment. Cette action peut être effectuée en contactant notre support par e-mail. La suppression du compte entraîne l'effacement définitif de vos données d'identification sous un délai maximal de 30 jours, sauf obligations légales de conservation.
                    </p>
                </section>


                {/* Article 6 */}
                <section className="mb-12">
                    <h2 className="text-xl font-semibold mb-3 text-[#260936]">6. Vos droits</h2>
                    <p className="text-sm text-gray-600 leading-relaxed mb-4">
                        Conformément au RGPD, vous disposez des droits d'accès, de rectification, d'effacement, de limitation, d'opposition et de portabilité de vos données, ainsi que du droit de retirer votre consentement à tout moment.
                    </p>
                    <p className="text-sm text-gray-600 leading-relaxed mb-4">
                        Pour exercer ces droits, contactez-nous à : <span className="text-[#260936] px-1 rounded font-medium">femmecitoyenne06@gmail.com</span>. Une preuve d'identité pourra vous être demandée en cas de doute raisonnable sur votre identité.
                    </p>
                    <p className="text-sm text-gray-600 leading-relaxed">
                        Si vous estimez que vos droits ne sont pas respectés, vous pouvez introduire une réclamation auprès de la CNIL (<a href="https://www.cnil.fr" target="_blank" rel="noopener noreferrer" className="underline hover:text-[#260936]">www.cnil.fr</a>).
                    </p>
                </section>


                {/* Article 7 */}
                <section className="mb-12">
                    <h2 className="text-xl font-semibold mb-3 text-[#260936]">7. Cookies</h2>
                    <p className="text-sm text-gray-600 leading-relaxed">
                        Le site utilise uniquement des cookies strictement nécessaires, indispensables au bon fonctionnement technique du site, dispensés de consentement selon les recommandations de la CNIL.
                    </p>
                </section>


                {/* Article 8 */}
                <section className="mb-12">
                    <h2 className="text-xl font-semibold mb-3 text-[#260936]">8. Sécurité</h2>
                    <p className="text-sm text-gray-600 leading-relaxed">
                        Nous mettons en œuvre des mesures techniques et organisationnelles appropriées pour protéger vos données : transmission chiffrée (HTTPS), en-têtes de sécurité, et limitation des tentatives de connexion. Aucune transmission sur Internet ne pouvant être garantie à 100 %, nous mettons tout en œuvre pour assurer une sécurité maximale.
                    </p>
                </section>


                {/* Article 9 */}
                <section className="mb-12">
                    <h2 className="text-xl font-semibold mb-3 text-[#260936]">9. Modifications</h2>
                    <p className="text-sm text-gray-600 leading-relaxed">
                        La présente politique peut être mise à jour à tout moment. La date de dernière mise à jour figure en haut de page. Nous vous invitons à la consulter régulièrement.
                    </p>
                </section>

            </div>

        </main>

    );
}