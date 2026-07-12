import Link from 'next/link';

const links = [
    { href: '/', label: 'Accueil' },
    { href: '/ateliers', label: 'Nos Ateliers' },
    { href: '/actualites', label: 'Actualités' },
    { href: '/a-propos', label: 'A propos' },
    { href: '/dons', label: 'Don' },
    { href: '/contact', label: 'Contact' },
];

export default function VitrineHeader() {
    return (
        <header className="w-full bg-white text-black">
            <div className="mx-auto flex h-14 max-w-7xl items-center justify-between px-8">
                <Link href="/" className="text-xl font-medium tracking-wide">
                    LOGO
                </Link>

                <nav className="flex items-center gap-8 text-base">
                    {links.map((link) => (
                        <Link key={link.href} href={link.href} className="transition hover:opacity-70">
                            {link.label}
                        </Link>
                    ))}
                </nav>

                <div className="flex items-center gap-3 text-base">
                    <Link href="/login" className="transition hover:opacity-70">
                        Connexion
                    </Link>
                    <Link href="/signup" className="transition hover:opacity-70">
                        Inscription
                    </Link>
                </div>
            </div>
        </header>
    );
}
