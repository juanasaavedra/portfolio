import Link from 'next/link';

export function Footer() {
  return (
    <footer className="mt-20 border-t border-white/10 bg-brand-panel/60 py-12">
      <div className="mx-auto flex w-[min(960px,92vw)] flex-col gap-6 text-sm text-brand-text/70">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <span className="font-display text-lg italic text-brand-text">UNO Estudiante</span>
          <nav className="flex gap-4">
            <Link href="/tutorias" className="hover:text-brand-accent">
              Tutorías
            </Link>
            <Link href="/cursos" className="hover:text-brand-accent">
              Cursos
            </Link>
            <Link href="/guias" className="hover:text-brand-accent">
              Guías
            </Link>
          </nav>
        </div>
        <p>
          © {new Date().getFullYear()} UNO Estudiante. Lo único que necesitas como estudiante: cursos, guías y tutorías en un solo
          lugar.
        </p>
      </div>
    </footer>
  );
}
