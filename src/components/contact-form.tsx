'use client';

import { useState } from 'react';
import { Send } from 'lucide-react';

export default function ContactForm() {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        subject: 'General',
        message: '',
    });


    const [customSubject, setCustomSubject] = useState('');


    const [status, setStatus] = useState({
        submitting: false,
        success: null,
        error: null,
    });


    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };


    const handleSubmit = async (e: React.ChangeEvent<HTMLFormElement>) => {
        e.preventDefault();
        e.stopPropagation();
        setStatus({ submitting: true, success: null, error: null });

        try {
            const response = await fetch('/api/contact', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    ... formData,
                    subject: formData.subject === 'Autre' ? customSubject : formData.subject
                }),
            });

            const data = await response.json();

            if (response.ok) {
              // On utilise le message de succès dynamique envoyé par le backend
                setStatus({ submitting: false, success: data.message || "Message envoyé avec succès !", error: null });
                setFormData({ name: '', email: '', subject: '', message: '' });
            } else {
                // Si le serveur renvoie une erreur (ex: status 400), on extrait son propre message d'erreur
                throw new Error(data.error || "Une erreur est survenue lors de l'envoi.");
            }
        } catch (err: any) {
            setStatus({ submitting: false, success: null, error: err.message });
        }
    };



    return (
        <div className="bg-white rounded-2xl p-6 md:p-8 shadow-xl max-w-md w-full border border-gray-100">
            <h3 className="text-xl font-bold text-gray-900 mb-2">ENVOYEZ-NOUS UN MESSAGE</h3>
            <p className="text-sm text-gray-500 mb-6">
                Contactez-nous pour toute demande d'information ou d'assistance. Notre équipe est là pour vous accompagner.
            </p>


            <form 
                onSubmit={(e) => {
                    e.preventDefault(); 
                    handleSubmit(e);
                }} 
                className="space-y-4"
            >


                {/* Name */}
                <div>
                    <label className="block text-xs font-bold text-gray-900 mb-1 uppercase tracking-wide">Votre Nom</label>
                    <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        placeholder="Entrez votre nom ici..."
                        required
                        className="w-full px-4 py-3 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-black transition"
                    />
                </div>


                {/* Email */}
                <div>
                    <label className="block text-xs font-bold text-gray-900 mb-1 uppercase tracking-wide">Votre Email</label>
                    <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="Entrez votre email ici..."
                        required
                        className="w-full px-4 py-3 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-black transition"
                    />
                </div>


                {/* Subject */}
                <div>
                    <label className="block text-xs font-bold text-gray-900 mb-1 uppercase tracking-wide">Sujet de votre message</label>
                    <select
                        name="subject"
                        value={formData.subject}
                        onChange={handleChange}
                        className="w-full px-4 py-3 border border-gray-200 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-black transition appearance-none">
                        <option value="General Inquiry">General</option>
                        <option value="Support">Support / Technique</option>
                        <option value="Partnership">Partenariat</option>
                        <option value="Autre">Autre</option>
                    </select>

                    {/* S'affiche uniquement si 'Autre' est sélectionné */}
                    {formData.subject === 'Autre' && (
                        <input
                            type="text"
                            value={customSubject}
                            onChange={(e) => setCustomSubject(e.target.value)}
                            placeholder="Spécifiez votre sujet de message ici..."
                            required
                            className="w-full mt-2 px-4 py-3 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-black transition animate-fade-in"
                        />
                    )}
                </div>


                {/* Message */}
                <div>
                    <label className="block text-xs font-bold text-gray-900 mb-1 uppercase tracking-wide">Votre message</label>
                    <textarea
                        name="message"
                        value={formData.message}
                        onChange={handleChange}
                        placeholder="Entrez votre message ici..."
                        rows={4}
                        required
                        className="w-full px-4 py-3 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-black transition resize-none"
                    />
                </div>


                {/* Button envoyer */}
                <button
                    type="submit"
                    disabled={status.submitting}
                    className="w-full bg-[#260936] hover:bg-[#bc96e6] text-white font-medium py-3 rounded-lg text-sm 
                    transition-all duration-300 shadow-lg shadow-[#260936]/20 hover:-translate-y-0.5 active:translate-y-0
                    disabled:transform-none flex items-center justify-center gap-2"> 
                
                    {status.submitting ? (
                        'Envoi...' 
                    ) : (
                        <>
                            Envoyer le message
                            <Send className="w-4 h-4 text-white transition-colors duration-300" />
                        </>
                    )}
                </button>


                {/* Politique prive */}
                <div className="mt-4 flex items-start gap-2">
                    <input 
                        type="checkbox" 
                        required 
                        id="rgpd"
                        className="mt-1 h-4 w-4 rounded border-gray-300 text-[#260936] focus:ring-[#260936]" 
                    />
                    <label htmlFor="rgpd" className="text-xs text-gray-500 leading-relaxed cursor-pointer select-none">
                        Je comprends et j'accepte que mes données soient conservées en toute sécurité conformément à la{' '}
                        <a href="/mentions-legales#confidentialite" className="underline font-medium text-gray-900 hover:text-gray-700">
                            politique de confidentialité
                        </a>.
                    </label>
                </div>


                {/* Status du message */}
                {status.success && <p className="text-sm text-green-600 mt-2 font-medium">{status.success}</p>}
                {status.error && <p className="text-sm text-red-600 mt-2 font-medium">{status.error}</p>}

            </form>

        </div>
    );
}