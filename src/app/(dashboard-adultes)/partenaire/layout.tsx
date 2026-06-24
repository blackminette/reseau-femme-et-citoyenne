// * src/app/(dashboard-adultes)/partenaire/layout.tsx
import DashboardShell from '@/components/DashboardShell';
import PartenaireSideMenu from '@/components/PartenaireSideMenu';

/** Layout de l'espace partenaire : sidebar desktop + tiroir burger mobile (voir DashboardShell). */
export default function PartenaireLayout({ children }: { children: React.ReactNode }) {
    return (
        <DashboardShell sidebar={<PartenaireSideMenu />} titre="Espace Partenaire" sousHeader>
            {children}
        </DashboardShell>
    );
}
