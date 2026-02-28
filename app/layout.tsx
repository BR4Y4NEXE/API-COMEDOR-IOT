import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
    title: 'PetCare Dashboard',
    description: 'Smart IoT Monitor for Pet Care',
};

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <html lang="es" className="dark">
            <body className={`${inter.className} bg-slate-950 text-slate-50 antialiased min-h-screen selection:bg-cyan-500/30`}>
                {children}
            </body>
        </html>
    );
}
