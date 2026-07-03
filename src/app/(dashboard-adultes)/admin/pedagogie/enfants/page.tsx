// * src/app/(dashboard-adultes)/admin/pedagogie/enfants/page.tsx
'use client';

import React, { useEffect, useState, startTransition } from 'react';
import Link from 'next/link';
import { 
  Baby, ArrowLeft, Trophy, Calendar, Sparkles, AlertTriangle, 
  Search, ShieldAlert, CheckCircle2, ChevronRight, Play, BookOpen, Clock
} from 'lucide-react';
import { obtenirSuiviPedagogiqueEnfants, StudentPedagogicalProfile } from './actions';

export default function PedagogieEnfantsPage() {
  const [students, setStudents] = useState<StudentPedagogicalProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStudent, setSelectedStudent] = useState<StudentPedagogicalProfile | null>(null);

  useEffect(() => {
    async function loadData() {
      try {
        const res = await obtenirSuiviPedagogiqueEnfants();
        if (res.success && res.data) {
          setStudents(res.data);
          if (res.data.length > 0) {
            setSelectedStudent(res.data[0]);
          }
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  const filteredStudents = students.filter(s => 
    `${s.prenom} ${s.nom}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
    s.username.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusColor = (statut: string) => {
    switch(statut) {
      case 'ACQUISE': return 'bg-emerald-500 text-white';
      case 'FRAGILE': return 'bg-amber-400 text-slate-900';
      case 'DIFFICULTE_IMPORTANTE': return 'bg-orange-500 text-white';
      default: return 'bg-rose-500 text-white';
    }
  };

  const getStatusLabel = (statut: string) => {
    switch(statut) {
      case 'ACQUISE': return 'Acquise';
      case 'FRAGILE': return 'Fragile';
      case 'DIFFICULTE_IMPORTANTE': return 'Difficulté importante';
      default: return 'Non acquise';
    }
  };

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      
      {/* Back button and title */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-100 pb-5">
        <div className="space-y-1">
          <Link href="/admin/pedagogie" className="inline-flex items-center gap-1.5 text-sm text-slate-500 hover:text-indigo-600 transition-colors mb-2">
            <ArrowLeft className="h-4 w-4" />
            Retour à l'espace Pédagogie
          </Link>
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-orange-50 text-orange-600 rounded-xl">
              <Baby className="h-6 w-6" />
            </div>
            <div>
              <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">Suivi des Élèves & Progression (Enfants)</h1>
              <p className="text-sm text-slate-500">Consultez les compétences, les scores pédagogiques RFC06 et les recommandations adaptatives.</p>
            </div>
          </div>
        </div>
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center py-20 space-y-4">
          <div className="animate-spin rounded-full h-10 w-10 border-4 border-orange-500 border-t-transparent"></div>
          <p className="text-sm font-medium text-slate-500 animate-pulse">Chargement des données pédagogiques des enfants...</p>
        </div>
      ) : students.length === 0 ? (
        <div className="text-center py-16 bg-white border border-slate-200 rounded-2xl p-6">
          <Baby className="h-12 w-12 mx-auto text-slate-300 mb-3" />
          <h3 className="text-lg font-bold text-slate-800">Aucun élève trouvé</h3>
          <p className="text-sm text-slate-500 mt-1">Aucune tentative ou compte d'étudiant actif n'a pu être trouvé.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* List of students - left column */}
          <div className="lg:col-span-4 space-y-4">
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
              <input
                type="text"
                placeholder="Rechercher un enfant..."
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                className="w-full pl-9 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all"
              />
            </div>

            <div className="bg-white border border-slate-200 rounded-2xl divide-y divide-slate-100 overflow-hidden shadow-xs">
              <div className="p-3 bg-slate-50 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                Liste des Apprenants ({filteredStudents.length})
              </div>
              <div className="max-h-[600px] overflow-y-auto divide-y divide-slate-100">
                {filteredStudents.map(student => (
                  <button
                    key={student.id}
                    onClick={() => setSelectedStudent(student)}
                    className={`w-full p-4 text-left transition-all flex items-center justify-between hover:bg-slate-50 ${selectedStudent?.id === student.id ? 'bg-orange-50/50 border-r-4 border-orange-500' : ''}`}
                  >
                    <div className="space-y-1">
                      <h4 className="font-bold text-slate-800">{student.prenom} {student.nom}</h4>
                      <p className="text-xs text-slate-500">@{student.username}</p>
                      <div className="flex items-center gap-3 mt-1.5">
                        <span className="text-[10px] font-semibold text-orange-600 bg-orange-50 px-2 py-0.5 rounded-full">
                          RFC06 : {student.scorePedagogique}/100
                        </span>
                        <span className="text-[10px] font-medium text-slate-400">
                          Prog : {student.progressionGlobale}%
                        </span>
                      </div>
                    </div>
                    <ChevronRight className="h-4 w-4 text-slate-400" />
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Student details - right column */}
          <div className="lg:col-span-8 space-y-6">
            {selectedStudent && (
              <>
                {/* Header card with global indicators */}
                <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs space-y-6">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-5">
                    <div>
                      <h2 className="text-xl font-extrabold text-slate-800">{selectedStudent.prenom} {selectedStudent.nom}</h2>
                      <p className="text-xs text-slate-400 mt-0.5">Inscrit le {new Date(selectedStudent.createdAt).toLocaleDateString()} • Compte enfant</p>
                    </div>

                    <div className="flex items-center gap-3">
                      <div className="bg-slate-50 border border-slate-100 rounded-xl px-4 py-2 text-center">
                        <span className="block text-2xl font-black text-indigo-600">{selectedStudent.scorePedagogique}</span>
                        <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400">Score RFC06</span>
                      </div>
                      <div className="bg-slate-50 border border-slate-100 rounded-xl px-4 py-2 text-center">
                        <span className="block text-2xl font-black text-orange-500">{selectedStudent.progressionGlobale}%</span>
                        <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400">Progression</span>
                      </div>
                    </div>
                  </div>

                  {/* Summary indicators */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                    <div className="p-4 bg-slate-50/50 border border-slate-100 rounded-xl text-center space-y-1">
                      <Trophy className="h-5 w-5 text-amber-500 mx-auto" />
                      <span className="block text-lg font-bold text-slate-800">{selectedStudent.leconsTerminees}</span>
                      <span className="text-[10px] text-slate-400 font-semibold uppercase">Leçons finies</span>
                    </div>
                    <div className="p-4 bg-slate-50/50 border border-slate-100 rounded-xl text-center space-y-1">
                      <BookOpen className="h-5 w-5 text-indigo-500 mx-auto" />
                      <span className="block text-lg font-bold text-slate-800">{selectedStudent.exercicesRealises}</span>
                      <span className="text-[10px] text-slate-400 font-semibold uppercase">Exercices</span>
                    </div>
                    <div className="p-4 bg-slate-50/50 border border-slate-100 rounded-xl text-center space-y-1">
                      <Play className="h-5 w-5 text-emerald-500 mx-auto" />
                      <span className="block text-lg font-bold text-slate-800">{selectedStudent.quizRealises}</span>
                      <span className="text-[10px] text-slate-400 font-semibold uppercase">Quiz résolus</span>
                    </div>
                    <div className="p-4 bg-slate-50/50 border border-slate-100 rounded-xl text-center space-y-1">
                      <Clock className="h-5 w-5 text-rose-500 mx-auto" />
                      <span className="block text-lg font-bold text-slate-800">{selectedStudent.tentativesTotal}</span>
                      <span className="text-[10px] text-slate-400 font-semibold uppercase">Tentatives</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 text-xs text-slate-400 bg-slate-50 px-3 py-2 rounded-lg border border-slate-100">
                    <Calendar className="h-3.5 w-3.5 text-slate-400" />
                    <span>Dernière activité enregistrée : {selectedStudent.dernierConnexion ? new Date(selectedStudent.dernierConnexion).toLocaleString() : 'Jamais'}</span>
                  </div>
                </div>

                {/* Score breakdown notice */}
                <div className="bg-indigo-50 border border-indigo-100 rounded-2xl p-4 flex gap-3 text-indigo-900">
                  <Sparkles className="h-5 w-5 text-indigo-600 shrink-0 mt-0.5" />
                  <div className="space-y-1 text-xs">
                    <h5 className="font-bold text-indigo-950">Calcul du score pédagogique RFC06</h5>
                    <p className="leading-relaxed text-indigo-700">
                      Ce score prend en compte <strong>30% pour les exercices réalisés</strong>, <strong>40% pour la réussite des quiz</strong>, <strong>20% pour l'implication/la régularité</strong> et <strong>10% pour l'autonomie</strong> (réussite dès la première tentative).
                    </p>
                  </div>
                </div>

                {/* Competence Table */}
                <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs space-y-4">
                  <h3 className="text-lg font-extrabold text-slate-800">Maîtrise des Compétences</h3>
                  
                  {selectedStudent.competences.length === 0 ? (
                    <p className="text-xs text-slate-400 italic">Aucune donnée de compétence pour le moment.</p>
                  ) : (
                    <div className="space-y-4">
                      {selectedStudent.competences.map((c, idx) => (
                        <div key={idx} className="space-y-2 border-b border-slate-50 pb-3 last:border-0 last:pb-0">
                          <div className="flex justify-between items-center text-xs">
                            <span className="font-bold text-slate-700">{c.competence}</span>
                            <div className="flex items-center gap-2">
                              <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${getStatusColor(c.statut)}`}>
                                {getStatusLabel(c.statut)}
                              </span>
                              <span className="font-black text-slate-900">{c.pourcentage}%</span>
                            </div>
                          </div>
                          <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                            <div 
                              className={`h-full rounded-full transition-all duration-300 ${
                                c.pourcentage >= 80 ? 'bg-emerald-500' :
                                c.pourcentage >= 60 ? 'bg-amber-400' :
                                c.pourcentage >= 40 ? 'bg-orange-500' : 'bg-rose-500'
                              }`} 
                              style={{ width: `${c.pourcentage}%` }}
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Recommendations and Adaptability */}
                <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs space-y-4">
                  <h3 className="text-lg font-extrabold text-slate-800">Détection des difficultés & Recommandations</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    
                    {/* Weak skills warning list */}
                    <div className="border border-slate-100 rounded-xl p-4 bg-slate-50/50 space-y-3">
                      <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider">État d'acquisition</h4>
                      <div className="space-y-2.5">
                        {selectedStudent.competences.length === 0 ? (
                          <p className="text-xs text-slate-400 italic">Aucune information disponible.</p>
                        ) : (
                          selectedStudent.competences.map((c, idx) => {
                            const showWarn = c.statut === 'NON_ACQUISE' || c.statut === 'DIFFICULTE_IMPORTANTE';
                            return (
                              <div key={idx} className="flex items-center justify-between text-xs">
                                <span className="text-slate-600">{c.competence}</span>
                                <div className="flex items-center gap-1.5">
                                  {showWarn ? (
                                    <AlertTriangle className="h-3.5 w-3.5 text-orange-500" />
                                  ) : (
                                    <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" />
                                  )}
                                  <span className="font-semibold text-slate-800">{c.pourcentage}%</span>
                                </div>
                              </div>
                            );
                          })
                        )}
                      </div>
                    </div>

                    {/* Auto-recommendations generation */}
                    <div className="border border-orange-100 rounded-xl p-4 bg-orange-50/20 space-y-3">
                      <h4 className="text-xs font-bold text-orange-700 uppercase tracking-wider">Prochaines étapes conseillées</h4>
                      <div className="space-y-3">
                        {selectedStudent.recommandations.length === 0 ? (
                          <p className="text-xs text-slate-400 italic">Aucune recommandation requise ! L'élève excelle dans tous les domaines.</p>
                        ) : (
                          selectedStudent.recommandations.map((r, idx) => (
                            <div key={idx} className="space-y-1 bg-white border border-orange-100/55 p-3 rounded-lg text-xs shadow-2xs">
                              <div className="flex justify-between items-start gap-2">
                                <span className="font-bold text-slate-800">{r.titre}</span>
                                <span className="px-1.5 py-0.5 rounded-sm bg-orange-100 text-orange-700 text-[8px] font-black uppercase">
                                  {r.type}
                                </span>
                              </div>
                              <p className="text-[10px] text-slate-400">{r.moduleTitre}</p>
                              <p className="text-[10px] text-slate-500 pt-1 leading-relaxed border-t border-slate-50 mt-1">{r.raison}</p>
                            </div>
                          ))
                        )}
                      </div>
                    </div>

                  </div>
                </div>

                {/* Recent Activities list */}
                <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs space-y-4">
                  <h3 className="text-lg font-extrabold text-slate-800">Historique d'activité récent</h3>
                  
                  {selectedStudent.recentActivities.length === 0 ? (
                    <p className="text-xs text-slate-400 italic">Aucune activité enregistrée.</p>
                  ) : (
                    <div className="divide-y divide-slate-100">
                      {selectedStudent.recentActivities.map((act, idx) => (
                        <div key={idx} className="py-3 flex items-center justify-between text-xs first:pt-0 last:pb-0">
                          <div className="space-y-0.5">
                            <span className="font-bold text-slate-700">{act.titre}</span>
                            <div className="flex items-center gap-2">
                              <span className="text-[9px] font-medium text-slate-400 uppercase">{act.type}</span>
                              <span className="text-[9px] text-slate-400">• {new Date(act.createdAt).toLocaleString()}</span>
                            </div>
                          </div>
                          
                          <div className="text-right">
                            <span className="font-extrabold text-slate-900">{act.score}</span>
                            <span className="text-slate-400">/{act.maxScore}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </>
            )}
          </div>

        </div>
      )}
    </div>
  );
}