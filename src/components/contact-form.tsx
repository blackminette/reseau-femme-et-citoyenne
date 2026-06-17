'use client';

import { useState } from 'react';
import { Mail, Phone, MapPin, Send } from 'lucide-react';

export default function ContactForm() {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        subject: '',
        message: '',
    });


    const [status, setStatus] = useState({
        submitting: false,
        success: null,
        error: null,
    });


    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
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
                body: JSON.stringify(formData),
        });


            if (response.ok) {
                setStatus({ submitting: false, success: 'Message envoyé avec succès !' as any, error: null });
                setFormData({ name: '', email: '', phone: '', subject: '', message: '' });
            } else {
                throw new Error("Une erreur est survenue lors de l'envoi.");
            }
        } catch (err: any) {
            setStatus({ submitting: false, success: null, error: err.message });
        }
    };




    return (
        <div className="w-full bg-[#eedeff] min-h-screen py-12 px-4 sm:px-8">

            <div className='max-w-6xl mx-auto'>

                <div className='text-center space-y-3 mt-12'>
                    <h1 className='text-5xl text-bold'>Restons en lien!</h1>

                    <h2 className='text-2xl'>Une question, une idée, un projet? Ecrivons ensemble l'avenir</h2>
                </div>

                {/* Grid Principal : 2 colonnes sur desktop */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start mt-12">  


                {/* ================= COLONNE GAUCHE : NOUS CONTACTER ================= */}
                    <div className="lg:col-span-5 space-y-6">

                        <div className="bg-[#71358F] text-white text-center py-3 px-6 rounded-md font-semibold tracking-wide shadow-sm">
                        NOUS CONTACTER</div>  

                        <div className="bg-white p-6 rounded-2xl shadow-sm border border-purple-50/50 space-y-6">

                            {/* Email */}
                            <div className="flex items-start gap-4">
                                <div className="p-3 bg-[#71358F] text-white rounded-full shrink-0">
                                    <Mail className="w-5 h-5" />
                                </div>
                                <div>
                                    <h4 className="font-bold text-[#333333] text-sm tracking-wide">EMAIL</h4>
                                    <p className="text-gray-600 text-sm break-all">contact@femmescitoyennes.org</p>
                                </div>
                            </div>    


                            {/* Téléphone */}
                            <div className="flex items-start gap-4">
                                <div className="p-3 bg-[#71358F] text-white rounded-full shrink-0">
                                    <Phone className="w-5 h-5" />
                                </div>
                                <div>
                                    <h4 className="font-bold text-[#333333] text-sm tracking-wide">TÉLÉPHONE</h4>
                                    <p className="text-gray-600 text-sm">06 12 34 56 78</p>
                                </div>
                            </div>    


                            {/* Adresse */}
                            <div className="flex items-start gap-4">
                                <div className="p-3 bg-[#71358F] text-white rounded-full shrink-0">
                                    <MapPin className="w-5 h-5" />
                                </div>
                                <div>
                                    <h4 className="font-bold text-[#333333] text-sm tracking-wide">ADRESSE</h4>
                                    <p className="text-gray-600 text-sm leading-relaxed">
                                        Réseau Femmes et Citoyennes 06<br />
                                        Maison des Associations<br />
                                        Saint-Roch - Nice
                                    </p>
                                </div>
                            </div>  

        
                            {/* Réseaux Sociaux */}
                            <div className="pt-4 border-t border-gray-100">
                                <h4 className="font-bold text-[#333333] text-sm tracking-wide text-center lg:text-left mb-3">SUIVEZ-NOUS</h4>
                                <div className="flex justify-center lg:justify-start gap-3">

                                    {/* Ig */}
                                    <a 
                                        href=" https://www.instagram.com/femme_citoyenne06/" 
                                        className="p-2 bg-[#71358F] text-white rounded-full hover:opacity-90 transition" aria-label='Instragram'>
                                        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                            <rect width="20" height="20" x="2" y="2" rx="5" ry="5"/>
                                            <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
                                            <line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/>
                                        </svg>
                                    </a>

                                    {/* Facebook */}
                                    <a 
                                        href="https://www.facebook.com/profile.php?id=100084877396335&locale=fr_FR" 
                                        className="p-2 bg-[#71358F] text-white rounded-full hover:opacity-90 transition aria-label='Facebook">
                                        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                            <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/>
                                        </svg>
                                    </a>

                                    {/* Linkedin */}
                                    <a 
                                        href="https://www.linkedin.com/in/johanna-domzalski-0966172a3/" 
                                        className="p-2 bg-[#71358F] text-white rounded-full hover:opacity-90 transition aria-label='Linkedin">
                                        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                            <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/>
                                            <rect width="4" height="12" x="2" y="9"/>
                                            <circle cx="4" cy="4" r="2"/>
                                        </svg>
                                    </a>

                                </div>
                            </div>
                        </div>
                    </div>    


                    {/* ================= COLONNE DROITE : FORMULAIRE ================= */}
                    <div className="lg:col-span-7 space-y-6">
                        <div className="bg-[#71358F] text-white text-center py-3 px-6 rounded-md font-semibold tracking-wide shadow-sm">
                            ENVOYEZ-NOUS UN MESSAGE</div>  

                        <form onSubmit={handleSubmit} className="bg-white p-6 rounded-2xl shadow-sm border border-purple-50/50 space-y-5">

                            {/* Nom & Email sur la même ligne */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div>
                                    <label htmlFor="name" className="block text-xs font-medium text-gray-500 mb-1">Votre nom*</label>
                                    <input
                                        type="text"
                                        id="name"
                                        name="name"
                                        required
                                        value={formData.name}
                                        onChange={handleChange}
                                        className="w-full px-4 py-2.5 bg-gray-50/50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#71358F]/20 focus:border-[#71358F] transition text-sm text-gray-800"
                                        placeholder="Votre nom"
                                    />
                                </div>


                                <div>
                                    <label htmlFor="email" className="block text-xs font-medium text-gray-500 mb-1">Votre email*</label>
                                    <input
                                        type="email"
                                        id="email"
                                        name="email"
                                        required
                                        value={formData.email}
                                        onChange={handleChange}
                                        className="w-full px-4 py-2.5 bg-gray-50/50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#71358F]/20 focus:border-[#71358F] transition text-sm text-gray-800"
                                        placeholder="Votre email"
                                    />
                                </div>
                            </div>   


                            {/* Sujet */}
                            <div>
                                <label htmlFor="subject" className="block text-xs font-medium text-gray-500 mb-1">Sujet de votre message*</label>
                                <input
                                    type="text"
                                    id="subject"
                                    name="subject"
                                    required
                                    value={formData.subject}
                                    onChange={handleChange}
                                    className="w-full px-4 py-2.5 bg-gray-50/50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#71358F]/20 focus:border-[#71358F] transition text-sm text-gray-800"
                                    placeholder="Sujet de votre message"
                                />
                            </div>  


                            {/* Message */}
                            <div>
                                <label htmlFor="message" className="block text-xs font-medium text-gray-500 mb-1">Votre message*</label>
                                <textarea
                                    id="message"
                                    name="message"
                                    required
                                    rows={5}
                                    value={formData.message}
                                    onChange={handleChange}
                                    className="w-full px-4 py-2.5 bg-gray-50/50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#71358F]/20 focus:border-[#71358F] transition text-sm text-gray-800 resize-none"
                                    placeholder="Votre message"
                                />
                            </div>    


                            {/* Checkbox RGPD */}
                            <div className="flex items-start gap-2.5 pt-1">
                                <input
                                    type="checkbox"
                                    id="rgpd"
                                    required
                                    className="mt-1 h-4 w-4 rounded border-gray-300 text-[#71358F] focus:ring-[#71358F]"
                                />
                                <label htmlFor="rgpd" className="text-xs text-gray-500 leading-normal cursor-pointer selection:bg-transparent">
                                    J'accepte que mes données soient utilisées uniquement pour répondre à ma demande.*
                                </label>
                            </div>    


                            {/* Bouton Envoyer */}
                            <div className="flex justify-center pt-2">
                                <button
                                    type="submit"
                                    disabled={status.submitting}
                                    className="w-full sm:w-auto min-w-[240px] bg-[#71358F] text-white font-semibold py-3 px-6 rounded-lg hover:bg-[#5c2a75] transition flex items-center justify-center gap-2 shadow-sm disabled:opacity-50 disabled:cursor-not-allowed text-sm uppercase tracking-wider"
                                >
                                    <Send className="w-4 h-4" />
                                    {status.submitting ? 'Envoi...' : 'ENVOYER LE MESSAGE'}
                                </button>
                            </div>    


                            {/* Notifications de Statut */}
                            {status.success && <p className="text-sm font-medium text-green-600 text-center">{status.success}</p>}
                            {status.error && <p className="text-sm font-medium text-red-600 text-center">{status.error}</p>}

                        </form>

                    </div>

                </div>

            </div>

        </div>

    );   
}