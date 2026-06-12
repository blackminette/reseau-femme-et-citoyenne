// * src/services/rbac/guards.ts

import { UserRole, UserSession } from '@/types/auth';

/**
 * Guard générique pour vérifier si l'utilisateur possède un rôle autorisé.
 * À utiliser pour les blocages simples en entrée d'API.
 */
export function hasRole(user: UserSession, allowedRoles: UserRole[]): boolean {
    return allowedRoles.includes(user.role);
}

/**
 * Spécification d'un Atelier pour les besoins des Guards.
 * Permet de valider la logique des ateliers sans dépendre immédiatement de Prisma.
 */
interface AtelierInput {
    type: 'PUBLIC' | 'PRIVE_PARTENAIRE';
    statutPaiement: 'EN_ATTENTE' | 'PAYE' | 'SUR_PLACE_VALIDE';
    isAdminApprouved: boolean;
}

/**
 * REGLÈ MÉTIER 1 : Validation et blocage des créneaux Partenaires.
 * Un atelier partenaire n'est "bloqué et visible par tous" que si :
 * - Il est approuvé par l'Admin ET payé en ligne
 * - OU Il est approuvé par l'Admin avec l'accord de confiance (Paiement sur place)
 */
export function isPartenaireSlotValidated(atelier: AtelierInput): boolean {
    if (atelier.type !== 'PRIVE_PARTENAIRE') return true; // Pas une contrainte partenaire

    // Condition A : En ligne + Validé Admin + Payé
    const virementEnLigneValide = atelier.isAdminApprouved && atelier.statutPaiement === 'PAYE';

    // Condition B : Sur place + Validé Admin (Relation de confiance = blocage immédiat)
    const confianceSurPlaceValide = atelier.isAdminApprouved && atelier.statutPaiement === 'SUR_PLACE_VALIDE';

    return virementEnLigneValide || confianceSurPlaceValide;
}

/**
 * REGLÈ MÉTIER 2 : Verrou d'encadrement sur les ateliers partenaires.
 * Bloque les membres ou bénévoles qui tenteraient de s'inscrire comme encadrant
 * sur un atelier privé géré par une entreprise partenaire externe.
 */
export function canUserEncadrerAtelier(user: UserSession, atelierType: 'PUBLIC' | 'PRIVE_PARTENAIRE'): boolean {
    // Si c'est un atelier privé partenaire, les membres/bénévoles ne peuvent pas encadrer
    if (atelierType === 'PRIVE_PARTENAIRE' && user.role === 'MEMBRE') {
        return false;
    }

    // Pour un atelier public, un membre ou un intervenant peut encadrer
    return ['ADMIN', 'INTERVENANT', 'MEMBRE'].includes(user.role);
}

/**
 * REGLÈ MÉTIER 3 : Autorisation de soumission dans la Boîte à idées.
 * Seuls les membres (parents/adultes) ont le droit de soumettre des suggestions.
 */
export function canSubmitToBoiteAIdees(user: UserSession): boolean {
    return user.role === 'MEMBRE';
}

/**
 * REGLÈ MÉTIER 4 : Validation du lien d'inscription Étudiant.
 * Vérifie si le jeton d'invitation interne est toujours exploitable.
 */
export function isStudentTokenValid(token: { expiresAt: Date; isUsed: boolean }): boolean {
    const now = new Date();
    const isExpired = now > new Date(token.expiresAt);

    // Le token doit ne pas être expiré ET ne pas avoir déjà été utilisé
    return !isExpired && !token.isUsed;
}