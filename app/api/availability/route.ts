import { NextResponse } from 'next/server';
import { addDays, addMinutes, eachDayOfInterval, endOfDay, setHours, setMinutes, startOfDay } from 'date-fns';
import { getCalendarClient } from '@/lib/calendar';
import { availabilityQuerySchema } from '@/lib/validation';
import { rateLimit } from '@/lib/rateLimit';

const SLOT_MINUTES = 60;
const BUFFER_MINUTES = 10;
const BUSINESS_HOURS = { start: 9, end: 18 };

function parseDate(value?: string) {
  if (!value) return new Date();
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) {
    return new Date();
  }
  return parsed;
}

export async function GET(request: Request) {
  const ip = request.headers.get('x-forwarded-for') ?? 'anonymous';
  const limited = rateLimit(ip);
  if (!limited.success) {
    return NextResponse.json({ message: 'Demasiadas solicitudes' }, { status: 429 });
  }

  const url = new URL(request.url);
  const query = availabilityQuerySchema.safeParse(Object.fromEntries(url.searchParams.entries()));

  if (!query.success) {
    return NextResponse.json({ message: 'Parámetros inválidos' }, { status: 400 });
  }

  const calendarId = process.env.GOOGLE_CALENDAR_ID;
  if (!calendarId) {
    return NextResponse.json({ message: 'No hay calendario configurado' }, { status: 500 });
  }

  const timezone = process.env.TIMEZONE ?? 'America/Bogota';
  const startDate = startOfDay(parseDate(query.data.start));
  const endDate = endOfDay(addDays(startDate, 6));

  const calendar = getCalendarClient();
  const busyEvents = await calendar.events.list({
    calendarId,
    timeMin: startDate.toISOString(),
    timeMax: endDate.toISOString(),
    timeZone: timezone,
    singleEvents: true,
    orderBy: 'startTime'
  });

  const events = busyEvents.data.items ?? [];

  const slots: { start: string; end: string }[] = [];
  const days = eachDayOfInterval({ start: startDate, end: endDate });

  for (const day of days) {
    let current = setMinutes(setHours(day, BUSINESS_HOURS.start), 0);
    const limit = setMinutes(setHours(day, BUSINESS_HOURS.end), 0);

    while (current < limit) {
      const slotStart = current;
      const slotEnd = addMinutes(slotStart, SLOT_MINUTES);
      if (slotEnd > limit) {
        break;
      }

      const slotStartBuffered = addMinutes(slotStart, -BUFFER_MINUTES);
      const slotEndBuffered = addMinutes(slotEnd, BUFFER_MINUTES);

      const overlaps = events.some((event) => {
        const eventStart = event.start?.dateTime ?? (event.start?.date ? `${event.start.date}T00:00:00` : undefined);
        const eventEnd = event.end?.dateTime ?? (event.end?.date ? `${event.end.date}T00:00:00` : undefined);
        if (!eventStart || !eventEnd) return false;
        const start = new Date(eventStart);
        const end = new Date(eventEnd);
        return slotStartBuffered < end && slotEndBuffered > start;
      });

      if (!overlaps) {
        slots.push({ start: slotStart.toISOString(), end: slotEnd.toISOString() });
      }

      current = addMinutes(current, SLOT_MINUTES);
    }
  }

  return NextResponse.json({ slots });
}
