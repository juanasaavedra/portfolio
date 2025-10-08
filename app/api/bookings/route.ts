import { NextResponse } from 'next/server';
import { addMinutes } from 'date-fns';
import { getCalendarClient } from '@/lib/calendar';
import { bookingSchema } from '@/lib/validation';
import { prisma } from '@/lib/prisma';
import { rateLimit } from '@/lib/rateLimit';
import { resend, BRAND_NAME } from '@/lib/email';

const timezone = process.env.TIMEZONE ?? 'America/Bogota';

export async function POST(request: Request) {
  const ip = request.headers.get('x-forwarded-for') ?? 'anonymous';
  const limited = rateLimit(`${ip}:booking`);
  if (!limited.success) {
    return NextResponse.json({ message: 'Demasiadas solicitudes' }, { status: 429 });
  }

  const body = await request.json().catch(() => null);
  const parsed = bookingSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json({ message: 'Datos inválidos', errors: parsed.error.flatten() }, { status: 400 });
  }

  const { name, email, topic, notes, start } = parsed.data;
  const startDate = new Date(start);
  const endDate = addMinutes(startDate, 60);

  try {
    const calendarId = process.env.GOOGLE_CALENDAR_ID;
    if (!calendarId) {
      throw new Error('Falta GOOGLE_CALENDAR_ID');
    }

    const calendar = getCalendarClient();

    const event = await calendar.events.insert({
      calendarId,
      requestBody: {
        summary: `${BRAND_NAME} · Tutoría: ${topic}`,
        description: `Estudiante: ${name}\nCorreo: ${email}\nNotas: ${notes ?? 'Sin notas adicionales'}`,
        start: {
          dateTime: startDate.toISOString(),
          timeZone: timezone
        },
        end: {
          dateTime: endDate.toISOString(),
          timeZone: timezone
        },
        attendees: [{ email }],
        reminders: {
          useDefault: false,
          overrides: [
            { method: 'email', minutes: 24 * 60 },
            { method: 'popup', minutes: 10 }
          ]
        }
      },
      sendUpdates: 'all'
    });

    await prisma.booking.create({
      data: {
        name,
        email,
        topic,
        notes: notes || null,
        start: startDate,
        end: endDate
      }
    });

    if (process.env.RESEND_API_KEY) {
      await resend.emails.send({
        from: `UNO Estudiante <agenda@unoestudiante.com>`,
        to: email,
        subject: `Tu tutoría está reservada: ${topic}`,
        html: `<!doctype html><html lang="es"><body style="font-family:Arial,sans-serif;background:#f7f3ed;padding:32px"><table width="100%" cellpadding="0" cellspacing="0" style="max-width:600px;margin:0 auto;background:#ffffff;border-radius:16px;overflow:hidden"><tr><td style="background:#0E0F12;color:#F7F3ED;padding:24px"><h1 style="margin:0;font-style:italic;font-weight:600">${BRAND_NAME}</h1><p style="margin:8px 0 0;color:#E6A3B2">Tu tutoría quedó agendada</p></td></tr><tr><td style="padding:24px;color:#2B2F38"><p>Hola ${name},</p><p>Confirmamos tu sesión sobre <strong>${topic}</strong>. Recibirás una invitación a tu correo con los detalles y el enlace a la videollamada.</p><p style="margin:24px 0">Fecha: ${new Intl.DateTimeFormat('es-CO', {
          dateStyle: 'full',
          timeStyle: 'short'
        }).format(startDate)}</p><p>Si necesitas reprogramar, responde a este mensaje.</p><p style="margin-top:24px">Equipo ${BRAND_NAME}</p></td></tr></table></body></html>`
      });
    }

    return NextResponse.json({
      message: 'Reserva creada',
      eventId: event.data.id
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: 'No fue posible agendar la tutoría' }, { status: 500 });
  }
}
