'use client';

import { useState } from 'react';
import { Send } from 'lucide-react';

export default function ContactForm() {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        subject: '',
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


            if (response.ok) {
                setStatus({ submitting: false, success: 'Message envoyé avec succès !' as any, error: null });
                setFormData({ name: '', email: '', subject: '', message: '' });
            } else {
                throw new Error("Une erreur est survenue lors de l'envoi.");
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


            <form onSubmit={handleSubmit} className="space-y-4">

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
                        <option value="General Inquiry">General Inquiry</option>
                        <option value="Support">Support / Technical</option>
                        <option value="Partnership">Partnership</option>
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
                            <Send className="w-4 h-4 text-[#260936] transition-colors duration-300" />
                        </>
                    )}
                </button>


                {/* Politique prive */}
                <p className="text-xs text-gray-500 mt-4 leading-relaxed">
                    Je comprends que mes données seront conservées en toute sécurité conformément à la {' '}
                    <a href="#" className="underline font-medium text-gray-900 hover:text-gray-700">
                        politique de confidentialité
                    </a>.
                </p>


                {/* Status du message */}
                {status.success && <p className="text-sm text-green-600 mt-2 font-medium">{status.success}</p>}
                {status.error && <p className="text-sm text-red-600 mt-2 font-medium">{status.error}</p>}

            </form>

        </div>
    );
}