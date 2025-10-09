'use client';

import { useQuery } from '@tanstack/react-query';
import { addDays, format, formatISO, parseISO } from 'date-fns';
import { es } from 'date-fns/locale';
import { useMemo, useState } from 'react';

interface Slot {
  start: string;
  end: string;
}

interface CalendarWidgetProps {
  selectedSlot?: Slot | null;
  onSelect(slot: Slot): void;
}

async function getAvailability(start: string) {
  const response = await fetch(`/api/availability?start=${encodeURIComponent(start)}`, { cache: 'no-store' });

  if (!response.ok) {
    throw new Error('No fue posible cargar la disponibilidad');
  }

  const data = await response.json();
  return data.slots as Slot[];
}

export function CalendarWidget({ selectedSlot, onSelect }: CalendarWidgetProps) {
  const [startDate, setStartDate] = useState(() => formatISO(new Date(), { representation: 'complete' }));

  const { data: slots, isLoading, isError } = useQuery({
    queryKey: ['availability', startDate],
    queryFn: () => getAvailability(startDate),
    staleTime: 1000 * 30
  });

  const groupedSlots = useMemo(() => {
    if (!slots) return {} as Record<string, Slot[]>;
    return slots.reduce<Record<string, Slot[]>>((acc, slot) => {
      const dayKey = format(parseISO(slot.start), 'yyyy-MM-dd');
      acc[dayKey] = acc[dayKey] ? [...acc[dayKey], slot] : [slot];
      return acc;
    }, {});
  }, [slots]);

  const dayOrder = useMemo(() => Object.keys(groupedSlots).sort(), [groupedSlots]);

  const goNext = () => {
    const next = addDays(parseISO(startDate), 7);
    setStartDate(formatISO(next, { representation: 'complete' }));
  };

  const goPrev = () => {
    const prev = addDays(parseISO(startDate), -7);
    const now = new Date();
    if (prev < now) {
      setStartDate(formatISO(now, { representation: 'complete' }));
    } else {
      setStartDate(formatISO(prev, { representation: 'complete' }));
    }
  };

  return (
    <section className="rounded-3xl border border-white/10 bg-brand-panel/80 p-6 shadow-[0_18px_60px_rgba(0,0,0,0.28)]">
      <header className="mb-4 flex items-center justify-between">
        <h2 className="font-display text-2xl italic text-brand-text">Selecciona un horario</h2>
        <div className="flex items-center gap-2 text-sm">
          <button onClick={goPrev} className="rounded-full border border-white/20 px-3 py-1 hover:border-brand-accent" type="button">
            ◀
          </button>
          <button onClick={goNext} className="rounded-full border border-white/20 px-3 py-1 hover:border-brand-accent" type="button">
            ▶
          </button>
        </div>
      </header>
      {isLoading && <p className="text-sm text-brand-support">Cargando disponibilidad…</p>}
      {isError && <p className="text-sm text-brand-support">No pudimos obtener la disponibilidad.</p>}
      <div className="mt-4 grid gap-4 md:grid-cols-2">
        {dayOrder.map((day) => (
          <div key={day} className="rounded-2xl border border-white/10 bg-black/20 p-4">
            <p className="font-display text-lg italic text-brand-support">
              {format(parseISO(day), "EEEE d 'de' MMMM", { locale: es })}
            </p>
            <div className="mt-3 flex flex-wrap gap-2">
              {groupedSlots[day]?.map((slot) => {
                const isActive = selectedSlot?.start === slot.start;
                return (
                  <button
                    key={slot.start}
                    type="button"
                    onClick={() => onSelect(slot)}
                    className={`rounded-full border px-4 py-2 text-sm transition ${
                      isActive
                        ? 'border-brand-accent bg-brand-accent text-brand-base'
                        : 'border-white/20 bg-transparent text-brand-text hover:border-brand-accent'
                    }`}
                  >
                    {format(parseISO(slot.start), 'HH:mm')} — {format(parseISO(slot.end), 'HH:mm')}
                  </button>
                );
              })}
            </div>
          </div>
        ))}
        {!isLoading && dayOrder.length === 0 && <p className="text-sm text-brand-support">No hay cupos disponibles en este rango.</p>}
      </div>
    </section>
  );
}
