import { notFound } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import { CourseCard } from '@/components/CourseCard';

interface CoursePageProps {
  params: { id: string };
}

export default async function CourseDetailPage({ params }: CoursePageProps) {
  const course = await prisma.course.findUnique({ where: { id: params.id } });

  if (!course) {
    notFound();
  }

  return (
    <div className="space-y-12">
      <header className="space-y-4">
        <span className="text-xs uppercase tracking-[0.24em] text-brand-support">Curso</span>
        <h1 className="font-display text-5xl italic text-brand-text">{course.title}</h1>
        <p className="max-w-[60ch] text-base text-brand-text/80">{course.description}</p>
      </header>
      <div className="max-w-xl">
        <CourseCard id={course.id} title={course.title} description={course.description} paymentLink={course.paymentLink} />
      </div>
    </div>
  );
}
