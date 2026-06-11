// * src/app/admin/page.tsx
'use client';

import React from 'react';

/**
 * Panneau d'administration général de l'association.
 * Ultra-sécurisé, accessible uniquement pour le rôle 'ADMIN'.
 */

// export default function AdminDashboard() {
//     return (
//         <div className="min-h-screen bg-slate-900 text-slate-100 p-8">
//             <div className="max-w-6xl mx-auto">
//                 <header className="mb-8 border-b border-slate-800 pb-4">
//                     <h1 className="text-3xl font-bold text-white">Console d'Administration</h1>
//                     <p className="text-slate-400 text-sm mt-1">
//                         Contrôle global, modération des ateliers partenaires et traitement de la boîte à idées.
//                     </p>
//                 </header>

//                 <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//                     {/* Module Modération Partenaires */}
//                     <div className="bg-slate-800 rounded-lg p-6 border border-slate-700">
//                         <h2 className="text-lg font-semibold text-white mb-2">⚙️ Demandes de Locaux (Partenaires)</h2>
//                         <p className="text-slate-400 text-sm">
//                             Permet d'approuver fonctionnellement les créneaux et de gérer le verrouillage de confiance pour les règlements sur place.
//                         </p>
//                     </div>

//                     {/* Module Boîte à idées */}
//                     <div className="bg-slate-800 rounded-lg p-6 border border-slate-700">
//                         <h2 className="text-lg font-semibold text-white mb-2">📩 Boîte à idées des Membres</h2>
//                         <p className="text-slate-400 text-sm">
//                             Consultez les propositions envoyées par les adhérents majeurs de l'association.
//                         </p>
//                     </div>
//                 </div>
//             </div>
//         </div>
//     );
// }