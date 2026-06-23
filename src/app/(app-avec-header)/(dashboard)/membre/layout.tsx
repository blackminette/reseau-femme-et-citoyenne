// * src/app/(app-avec-header)/(dashboard)/membre/layout.tsx
import MemberLayoutClient from '@/components/MemberLayoutClient';

export default function MembreLayout({ children }: { children: React.ReactNode }) {
    return <MemberLayoutClient>{children}</MemberLayoutClient>;
}