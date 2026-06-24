// * src/types/auth.ts

export type UserRole = 'ADMIN' | 'INTERVENANT' | 'MEMBRE' | 'ENFANT' | 'PARTENAIRE' | 'BENEVOLE' | 'ETUDIANT';

export interface UserSession {
    id: string;
    email: string | null;
    nom: string;
    prenom: string;
    role: UserRole;
}