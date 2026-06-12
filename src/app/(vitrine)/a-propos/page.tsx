// * src/app/(vitrine)/a-propos/page.tsx
'use client';

import React from 'react';

/**
 * Page statique "À propos" de l'application.
 * Accessible à tous les utilisateurs, même non authentifiés.
 * Contient des informations générales sur l'association et l'application.
 */

const AProposPage = () => {
    return (
        <div>
            <h1>À propos</h1>
            <p>Bienvenue sur la page À propos !</p>
        </div>
    );
};

export default AProposPage;