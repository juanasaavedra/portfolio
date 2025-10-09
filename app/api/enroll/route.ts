import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { enrollmentSchema } from '@/lib/validation';
import { rateLimit } from '@/lib/rateLimit';
import { resend, BRAND_NAME } from '@/lib/email';
import { CoursePaymentEmail } from '@/emails/CoursePayment';

export async function POST(request: Request) {
  const ip = request.headers.get('x-forwarded-for') ?? 'anonymous';
  const limited = rateLimit(`${ip}:enroll`);
  if (!limited.success) {
    return NextResponse.json({ message: 'Demasiadas solicitudes' }, { status: 429 });
  }

  const body = await request.json().catch(() => null);
  const parsed = enrollmentSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json({ message: 'Datos inválidos', errors: parsed.error.flatten() }, { status: 400 });
  }

  const { courseId, name, email } = parsed.data;
  const course = await prisma.course.findUnique({ where: { id: courseId } });

  if (!course) {
    return NextResponse.json({ message: 'Curso no encontrado' }, { status: 404 });
  }

  try {
    await prisma.enrollment.create({
      data: {
        courseId,
        name,
        email
      }
    });

    if (process.env.RESEND_API_KEY) {
      await resend.emails.send({
        from: `UNO Estudiante <cursos@unoestudiante.com>`,
        to: email,
        subject: `Confirma tu cupo: ${course.title}`,
        react: CoursePaymentEmail({
          courseTitle: course.title,
          paymentLink: course.paymentLink,
          studentName: name,
          brandName: BRAND_NAME
        })
      });
    }

    return NextResponse.json({ message: 'Inscripción registrada' });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: 'No fue posible registrar la inscripción' }, { status: 500 });
  }
}
