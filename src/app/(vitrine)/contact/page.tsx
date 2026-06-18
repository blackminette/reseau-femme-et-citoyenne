import { Phone, Mail, MapPin } from 'lucide-react';
import ContactForm from '@/components/contact-form';

export default function ContactPage() {
    const infoCards = [
        {
            icon: <Phone className="w-5 h-5 text-[#260936] group-hover:text-white transition-colors duration-300" />,
            title: 'Nous appeler',
            value: '06 12 34 56 78',
        },
        {
            icon: <Mail className="w-5 h-5 text-[#260936] group-hover:text-white transition-colors duration-300" />,
            title: 'Nous contacter par Email',
            value: 'contact@femmescitoyennes.org',
        },
        {
            icon: <MapPin className="w-5 h-5 text-[#260936] group-hover:text-white transition-colors duration-300" />,
            title: 'Nous rencontrer',
            value: (
                <>
                    Maison des Associations <br /> Saint-Roch - Nice
                </>
            ),

        },
    ];


    return (
        <main className="min-h-screen bg-[#eedeff] py-16 px-4 sm:px-6 lg:px-8 flex flex-col items-center justify-center">


            {/* Titres principaux */}
            <div className="text-center max-w-3xl flex flex-col items-center justify-center gap-2 mb-12 w-full">

                <span className="text-xs font-bold uppercase tracking-widest text-black">
                    RESTONS EN LIEN !
                </span>

                <h1 className="text-2xl sm:text-4xl font-extrabold text-[#260936] tracking-tight whitespace-nowrap">
                    Des Questions? N'hésitez pas à prendre contact!
                </h1>

                <p className="text-sm md:text-base text-black mt-2">
                    Une question, une idée, un projet ? Écrivons ensemble l'avenir.
                </p>

            </div>  


            {/* Infos Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 w-full max-w-5xl mb-12">
                {infoCards.map((card, idx) => (
                    <div
                        key={idx}
                        className="flex items-center space-x-4 bg-white p-5 rounded-2xl border border-gray-100 shadow-sm">
                        <div className="group p-3 bg-[#ffd166] hover:bg-[#260936] rounded-full shrink-0 flex items-center justify-center transition-colors duration-300">
                            {card.icon}</div>

                        <div>
                            <p className="text-black text-[#333333] text-sm tracking-wide">{card.title}</p>
                            <p className="text-sm font-bold text-[#260936]">{card.value}</p>
                        </div>
                    </div>
                ))}
            </div>  



            {/* Main (Image + Contact_form superpose) */}
            <div className="w-full max-w-5xl relative rounded-3xl overflow-hidden bg-gray-900 min-h-[500px] md:min-h-[600px] flex items-center justify-end p-6 md:p-12">


                {/* Container Image */}
                <div 
                    className="absolute inset-0 bg-cover bg-center opacity-40 mix-blend-luminosity"
                    style={{ 
                        backgroundImage: `url('https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&q=80&w=1200')` 
                    }}
                />

                {/* Overlay du Contact_form */}
                <div className="absolute inset-0 bg-gradient-to-r from-black/50 to-transparent pointer-events-none" />  

                
                {/* Floating Interactive du Contact_form */}
                <div className="relative z-10 w-full md:w-auto">
                    <ContactForm />
                </div>

            </div>

        </main>
    );
}