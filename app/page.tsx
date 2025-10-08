import Image from 'next/image';
import Link from 'next/link';
import { prisma } from '@/lib/prisma';
import { CourseCard } from '@/components/CourseCard';
import { GuideCard } from '@/components/GuideCard';

export default async function HomePage() {
  const [courses, guides] = await Promise.all([
    prisma.course.findMany({ orderBy: { createdAt: 'asc' }, take: 3 }),
    prisma.guide.findMany({ orderBy: { createdAt: 'asc' }, take: 3 })
  ]);

  return (
    <div className="space-y-24">
      <section className="grid gap-12 md:grid-cols-[1.2fr_0.8fr]">
        <div className="space-y-6">
          <span className="inline-flex items-center rounded-full border border-brand-accent/40 bg-brand-support/10 px-4 py-2 text-xs uppercase tracking-[0.28em] text-brand-support">
            UNO ESTUDIANTE
          </span>
          <h1 className="font-display text-[clamp(42px,7vw,92px)] italic leading-[0.98] text-brand-text">
            Lo único que necesitas como estudiante: cursos, guías y tutorías en un solo lugar.
          </h1>
          <p className="max-w-[60ch] text-base text-brand-text/80">
            Acompañamos tu semestre con mentorías personalizadas, contenidos diseñados para la vida académica y recursos que se
            adaptan a tu ritmo. Un sistema integral para aprender, practicar y llegar tranquilo a cada entrega.
          </p>
          <div className="flex flex-wrap gap-3">
            <Link
              href="/tutorias"
              className="inline-flex items-center justify-center rounded-full border border-brand-support/60 bg-brand-accent px-6 py-3 font-semibold text-brand-base transition hover:bg-brand-support"
            >
              Reservar tutoría
            </Link>
            <Link
              href="/cursos"
              className="inline-flex items-center justify-center rounded-full border border-white/20 px-6 py-3 text-brand-text transition hover:border-brand-accent"
            >
              Ver cursos
            </Link>
          </div>
        </div>
        <div className="relative flex items-center justify-center">
          <div className="relative h-[360px] w-full max-w-[480px] overflow-hidden rounded-[32px] border border-white/10 bg-brand-panel/80 p-8 shadow-[0_18px_60px_rgba(0,0,0,0.3)]">
            <div className="absolute inset-0 bg-gradient-to-br from-black/40 via-transparent to-brand-support/10" />
            <Image src="/logo.svg" alt="UNO Estudiante" fill sizes="(min-width: 1024px) 480px, 90vw" className="object-contain opacity-40" />
            <div className="relative space-y-4 text-sm text-brand-text">
              <h2 className="font-display text-2xl italic text-brand-support">Agenda conectada</h2>
              <p>
                Un microcontrolador creativo sincroniza horarios, recordatorios y materiales para que cada tutoría esté lista antes de
                empezar.
              </p>
              <ul className="space-y-2 text-xs text-brand-text/70">
                <li>• Disponibilidad en tiempo real</li>
                <li>• Recordatorios automáticos</li>
                <li>• Notas compartidas después de cada sesión</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      <section className="space-y-10">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <span className="text-xs uppercase tracking-[0.24em] text-brand-support">Tutorías</span>
            <h2 className="font-display text-4xl italic text-brand-text">Agenda personalizada</h2>
          </div>
          <Link href="/tutorias" className="text-sm text-brand-support hover:text-brand-accent">
            Agendar ahora →
          </Link>
        </div>
        <div className="grid gap-6 md:grid-cols-3">
          {courses.map((course) => (
            <CourseCard
              key={course.id}
              id={course.id}
              title={course.title}
              description={course.description}
              paymentLink={course.paymentLink}
            />
          ))}
        </div>
      </section>

      <section className="space-y-10">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <span className="text-xs uppercase tracking-[0.24em] text-brand-support">Guías</span>
            <h2 className="font-display text-4xl italic text-brand-text">Recursos para tus entregas</h2>
          </div>
          <Link href="/guias" className="text-sm text-brand-support hover:text-brand-accent">
            Ver más guías →
          </Link>
        </div>
        <div className="grid gap-6 md:grid-cols-3">
          {guides.map((guide) => (
            <GuideCard
              key={guide.id}
              title={guide.title}
              description={guide.description}
              subject={guide.subject}
              price={guide.price}
            />
          ))}
        </div>
      </section>
    </div>
  );
}
