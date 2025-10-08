import type { Metadata } from "next";
import "@/styles/globals.css";
import { Plus_Jakarta_Sans, IBM_Plex_Mono } from "next/font/google";
import Link from "next/link";
import Image from "next/image";
import { MotionRoot } from "@/components/MotionRoot";
import { LangToggle } from "@/components/LangToggle";
import site from "@/content/site.es.json";

const sans = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-sans",
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

const mono = IBM_Plex_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  weight: ["400", "500", "600"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://juana-saavedra-portfolio.example"),
  title: `${site.brand} · Portfolio`,
  description: site.hero.subtitle,
  icons: {
    icon: "/icons/logo.svg",
  },
  openGraph: {
    title: `${site.brand} · Experiencias científicas`,
    description: site.hero.subtitle,
    type: "website",
    images: [
      {
        url: "/icons/logo.svg",
        width: 512,
        height: 512,
        alt: site.brand,
      },
    ],
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es" className={`${sans.variable} ${mono.variable}`} suppressHydrationWarning>
      <body className="bg-anthracite text-slate-100">
        <div className="relative min-h-screen">
          <div className="absolute inset-0 -z-10 bg-gridNoise opacity-30" aria-hidden />
          <header className="sticky top-0 z-30 border-b border-white/5 bg-anthracite/80 backdrop-blur-xl">
            <div className="mx-auto flex max-w-6xl items-center justify-between gap-6 px-6 py-5">
              <Link href="/" className="flex items-center gap-3 text-sm font-mono uppercase tracking-[0.3em] text-slate-200">
                <Image src="/icons/logo.svg" alt="Juana Saavedra" width={32} height={32} className="h-8 w-8" />
                {site.brand}
              </Link>
              <nav className="hidden items-center gap-6 text-xs font-mono uppercase tracking-[0.3em] text-slate-400 md:flex">
                <Link href="#servicios" className="hover:text-accent focus-visible:text-accent">
                  Servicios
                </Link>
                <Link href="#visualizaciones" className="hover:text-accent focus-visible:text-accent">
                  Visualizaciones
                </Link>
                <Link href="#casos" className="hover:text-accent focus-visible:text-accent">
                  Casos
                </Link>
                <Link href="#contacto" className="hover:text-accent focus-visible:text-accent">
                  Contacto
                </Link>
              </nav>
              <LangToggle />
            </div>
          </header>
          <MotionRoot>
            <div className="mx-auto flex max-w-6xl flex-col gap-12 px-6 py-16 pb-24">
              {children}
              <footer className="mt-20 border-t border-white/5 pt-6 text-xs text-slate-500">
                © {new Date().getFullYear()} {site.brand}. Construido con Next.js, R3F y ciencia visual.
              </footer>
            </div>
          </MotionRoot>
        </div>
      </body>
    </html>
  );
}
