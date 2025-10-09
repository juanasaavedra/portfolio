'use client';

import { useMutation } from '@tanstack/react-query';
import { useState, type ChangeEvent } from 'react';
import { bookingSchema } from '@/lib/validation';

interface Slot {
  start: string;
  end: string;
}

interface BookingFormProps {
  selectedSlot: Slot | null;
  onSuccess(): void;
}

export function BookingForm({ selectedSlot, onSuccess }: BookingFormProps) {
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [formState, setFormState] = useState({ name: '', email: '', topic: '', notes: '' });

  const mutation = useMutation({
    mutationFn: async () => {
      if (!selectedSlot) {
        throw new Error('Selecciona un horario');
      }

      const payload = {
        ...formState,
        start: selectedSlot.start
      };

      const parsed = bookingSchema.safeParse(payload);
      if (!parsed.success) {
        const fieldErrors = parsed.error.flatten().fieldErrors;
        setErrors(
          Object.entries(fieldErrors).reduce<Record<string, string>>((acc, [key, value]) => {
            acc[key] = value?.[0] ?? 'Campo inválido';
            return acc;
          }, {})
        );
        throw new Error('Revisa el formulario');
      }

      const response = await fetch('/api/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(parsed.data)
      });

      if (!response.ok) {
        const message = await response.json().catch(() => ({ message: 'Error desconocido' }));
        throw new Error(message.message || 'No fue posible completar la reserva');
      }

      return response.json();
    },
    onSuccess: () => {
      setErrors({});
      setFormState({ name: '', email: '', topic: '', notes: '' });
      onSuccess();
    }
  });

  const handleChange = (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormState((prev) => ({ ...prev, [event.target.name]: event.target.value }));
  };

  return (
    <form
      className="mt-8 rounded-3xl border border-white/10 bg-brand-panel/90 p-6 shadow-[0_18px_60px_rgba(0,0,0,0.28)]"
      onSubmit={(event) => {
        event.preventDefault();
        mutation.mutate();
      }}
      aria-live="polite"
    >
      <fieldset className="flex flex-col gap-4">
        <legend className="font-display text-2xl italic text-brand-text">Reserva tu tutoría</legend>
        <p className="text-sm text-brand-support">
          Selecciona un horario disponible y completa tus datos para agendar una sesión de 60 minutos.
        </p>
        <div className="grid gap-4 md:grid-cols-2">
          <label className="flex flex-col gap-1 text-sm">
            Nombre completo
            <input
              required
              name="name"
              value={formState.name}
              onChange={handleChange}
              className="rounded-xl border border-white/15 bg-black/40 px-3 py-2 text-brand-text placeholder:text-brand-text/40"
              placeholder="Tu nombre"
            />
            {errors.name && <span className="text-xs text-brand-accent">{errors.name}</span>}
          </label>
          <label className="flex flex-col gap-1 text-sm">
            Correo electrónico
            <input
              required
              type="email"
              name="email"
              value={formState.email}
              onChange={handleChange}
              className="rounded-xl border border-white/15 bg-black/40 px-3 py-2 text-brand-text placeholder:text-brand-text/40"
              placeholder="nombre@correo.com"
            />
            {errors.email && <span className="text-xs text-brand-accent">{errors.email}</span>}
          </label>
        </div>
        <label className="flex flex-col gap-1 text-sm">
          Tema o materia
          <input
            required
            name="topic"
            value={formState.topic}
            onChange={handleChange}
            className="rounded-xl border border-white/15 bg-black/40 px-3 py-2 text-brand-text placeholder:text-brand-text/40"
            placeholder="Ej. Cálculo diferencial"
          />
          {errors.topic && <span className="text-xs text-brand-accent">{errors.topic}</span>}
        </label>
        <label className="flex flex-col gap-1 text-sm">
          Notas adicionales
          <textarea
            name="notes"
            value={formState.notes}
            onChange={handleChange}
            rows={4}
            className="rounded-xl border border-white/15 bg-black/40 px-3 py-2 text-brand-text placeholder:text-brand-text/40"
            placeholder="Cuéntanos qué necesitas revisar"
          />
          {errors.notes && <span className="text-xs text-brand-accent">{errors.notes}</span>}
        </label>
        <button
          type="submit"
          disabled={!selectedSlot || mutation.isPending}
          className="mt-2 inline-flex items-center justify-center rounded-full border border-brand-support/60 bg-brand-accent px-6 py-3 font-semibold text-brand-base transition hover:bg-brand-support disabled:cursor-not-allowed disabled:border-white/10 disabled:bg-white/10"
        >
          {mutation.isPending ? 'Agendando…' : 'Confirmar reserva'}
        </button>
        <span className="text-xs text-brand-support">
          {selectedSlot
            ? `Has elegido ${new Intl.DateTimeFormat('es-CO', {
                dateStyle: 'full',
                timeStyle: 'short'
              }).format(new Date(selectedSlot.start))}`
            : 'Selecciona un horario para continuar'}
        </span>
        {mutation.isError && <p className="text-sm text-brand-accent">{(mutation.error as Error).message}</p>}
        {mutation.isSuccess && <p className="text-sm text-brand-support">Reserva confirmada. Revisa tu correo.</p>}
      </fieldset>
    </form>
  );
}
