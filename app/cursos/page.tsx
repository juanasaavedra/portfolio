import { prisma } from '@/lib/prisma';
import { CourseCard } from '@/components/CourseCard';

export const metadata = {
  title: 'Cursos',
  description: 'Cursos intensivos con seguimiento y materiales exclusivos.'
};

export default async function CursosPage() {
  const courses = await prisma.course.findMany({ orderBy: { createdAt: 'asc' } });

  return (
    <div className="space-y-16">
      <header className="space-y-4">
        <span className="text-xs uppercase tracking-[0.24em] text-brand-support">Cursos UNO</span>
        <h1 className="font-display text-5xl italic text-brand-text">Programas completos</h1>
        <p className="max-w-[60ch] text-base text-brand-text/80">
          Cada curso combina sesiones en vivo, materiales descargables y tutorías de seguimiento. Inscríbete para recibir el enlace
          de pago y asegurar tu lugar.
        </p>
      </header>
      <section className="grid gap-6 md:grid-cols-2">
        {courses.map((course) => (
          <CourseCard
            key={course.id}
            id={course.id}
            title={course.title}
            description={course.description}
            paymentLink={course.paymentLink}
          />
        ))}
      </section>
    </div>
  );
}
