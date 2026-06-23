// * src/app/(app-sans-header)/enfant/layout.tsx
import DashboardShell from '@/components/DashboardShell';
import ChildSideMenu from '@/components/ChildSideMenu';

/** Layout de l'espace enfant : sidebar desktop + tiroir burger mobile (voir DashboardShell). */
export default function EnfantLayout({ children }: { children: React.ReactNode }) {
    return (
        <DashboardShell sidebar={<ChildSideMenu />} titre="Espace Enfant">
            {children}
        </DashboardShell>
    );
}
