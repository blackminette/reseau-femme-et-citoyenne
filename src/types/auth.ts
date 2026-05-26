export type UserRole = 'ADMIN' | 'INTERVENANT' | 'MEMBRE' | 'ENFANT' | 'PARTENAIRE' | 'ETUDIANT';

export interface UserSession {
    id: string;
    email: string | null;
    nom: string;
    prenom: string;
    role: UserRole;
}

// Type pour simuler un utilisateur connecté (pour les tests et le développement)
export type FakeRole = 'ADMIN' | 'PARTENAIRE' | 'MEMBRE' | null; //! Juste pour les tests et le développement, à supprimer en prod.

export interface FakeUser { //! Juste pour les tests et le développement, à supprimer en prod.
    id: string;
    role: FakeRole;
}