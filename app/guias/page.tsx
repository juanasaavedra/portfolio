import { prisma } from '@/lib/prisma';
import { GuideCard } from '@/components/GuideCard';

interface GuidesPageProps {
  searchParams: { materia?: string };
}

export const metadata = {
  title: 'Guías',
  description: 'Guías descargables para reforzar tus materias favoritas.'
};

export default async function GuiasPage({ searchParams }: GuidesPageProps) {
  const materia = searchParams.materia?.toLowerCase() ?? '';

  const guides = await prisma.guide.findMany({
    orderBy: { createdAt: 'asc' }
  });

  const filtered = guides.filter((guide) => guide.subject.toLowerCase().includes(materia));

  return (
    <div className="space-y-16">
      <header className="space-y-4">
        <span className="text-xs uppercase tracking-[0.24em] text-brand-support">Guías descargables</span>
        <h1 className="font-display text-5xl italic text-brand-text">Material listo para usar</h1>
        <p className="max-w-[60ch] text-base text-brand-text/80">
          Explora por materia y descarga guías que condensan métodos, plantillas y ejemplos para entregar con seguridad.
        </p>
        <form className="mt-6 flex flex-wrap gap-3" action="/guias" method="get">
          <label className="flex min-w-[220px] flex-1 items-center gap-2 rounded-full border border-white/20 bg-black/30 px-4 py-2 text-sm">
            <span className="text-brand-support">Materia</span>
            <input
              type="search"
              name="materia"
              defaultValue={materia}
              placeholder="Ej. Matemáticas"
              className="flex-1 bg-transparent text-brand-text placeholder:text-brand-text/40 focus:outline-none"
            />
          </label>
          <button className="rounded-full border border-brand-support/60 bg-brand-accent px-5 py-2 text-sm font-semibold text-brand-base" type="submit">
            Buscar
          </button>
        </form>
      </header>
      <section className="grid gap-6 md:grid-cols-3">
        {filtered.map((guide) => (
          <GuideCard key={guide.id} title={guide.title} description={guide.description} subject={guide.subject} price={guide.price} />
        ))}
        {filtered.length === 0 && <p className="text-sm text-brand-support">No encontramos guías para esa materia.</p>}
      </section>
    </div>
  );
}
