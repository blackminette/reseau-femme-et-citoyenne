export type UserRole = 'ADMIN' | 'INTERVENANT' | 'MEMBRE' | 'ENFANT' | 'PARTENAIRE' | 'ETUDIANT';

export interface UserSession {
    id: string;
    email: string | null;
    nom: string;
    prenom: string;
    role: UserRole;
}