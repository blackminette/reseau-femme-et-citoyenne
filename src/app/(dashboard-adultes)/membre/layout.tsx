// * src/app/(app-avec-header)/(dashboard)/membre/layout.tsx
import React from 'react';
import DashboardShell from '@/components/DashboardShell';
import MemberSideMenu from '@/components/MemberSideMenu';

/** Layout de l'espace membre : sidebar desktop + tiroir burger mobile (voir DashboardShell). */
export default function MembreLayout({ children }: { children: React.ReactNode }) {
    return (
        <DashboardShell sidebar={<MemberSideMenu />} titre="Espace Membre" sousHeader>
            {children}
        </DashboardShell>
    );
}
