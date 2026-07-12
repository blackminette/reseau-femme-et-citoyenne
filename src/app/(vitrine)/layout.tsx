// * src/app/(vitrine)/layout.tsx
import Header from '@/components/Header';
import Footer from '@/components/Footer';

export default function VitrineLayout({ children }: { children: React.ReactNode }) {
    return (
        <main className="grow flex flex-col">
            {children}
        </main>
    );
}
