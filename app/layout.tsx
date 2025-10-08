import type { Metadata } from 'next';
import { Manrope, DM_Sans } from 'next/font/google';
import './globals.css';
import { Providers } from '@/components/Providers';
import { Navigation } from '@/components/Navigation';
import { Footer } from '@/components/Footer';

const sans = Manrope({
  subsets: ['latin'],
  variable: '--font-sans'
});

const display = DM_Sans({
  subsets: ['latin'],
  variable: '--font-display',
  style: ['italic'],
  weight: ['500', '600']
});

export const metadata: Metadata = {
  metadataBase: new URL('https://uno-estudiante.example'),
  title: {
    default: 'UNO Estudiante',
    template: '%s | UNO Estudiante'
  },
  description: 'Lo único que necesitas como estudiante: cursos, guías y tutorías en un solo lugar.'
};

export default function RootLayout({
  children
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es" className={`${sans.variable} ${display.variable}`} suppressHydrationWarning>
      <body className="bg-brand-base text-brand-text antialiased">
        <Providers>
          <Navigation />
          <main className="mx-auto min-h-screen w-[min(1200px,94vw)] pb-16 pt-24">
            {children}
          </main>
          <Footer />
        </Providers>
      </body>
    </html>
  );
}
