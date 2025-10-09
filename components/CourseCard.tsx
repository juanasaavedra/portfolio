'use client';

import { useMutation } from '@tanstack/react-query';
import { useState } from 'react';
import { enrollmentSchema } from '@/lib/validation';

interface CourseCardProps {
  id: string;
  title: string;
  description: string;
  paymentLink: string;
}

export function CourseCard({ id, title, description, paymentLink }: CourseCardProps) {
  const [form, setForm] = useState({ name: '', email: '' });
  const [open, setOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const mutation = useMutation({
    mutationFn: async () => {
      const parsed = enrollmentSchema.safeParse({ ...form, courseId: id });
      if (!parsed.success) {
        const message = parsed.error.flatten().fieldErrors;
        setError(Object.values(message).map((v) => v?.[0]).filter(Boolean).join(', ') || 'Datos inválidos');
        throw new Error('Datos inválidos');
      }

      const res = await fetch('/api/enroll', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(parsed.data)
      });

      if (!res.ok) {
        const payload = await res.json().catch(() => ({ message: 'Error desconocido' }));
        setError(payload.message || 'No fue posible procesar la inscripción');
        throw new Error(payload.message || 'No fue posible procesar la inscripción');
      }

      return res.json();
    },
    onSuccess: () => {
      setError(null);
      setForm({ name: '', email: '' });
      setOpen(false);
    }
  });

  return (
    <article className="flex h-full flex-col justify-between rounded-[32px] border border-white/10 bg-gradient-to-br from-black/40 via-brand-panel/60 to-black/40 p-6 shadow-[0_18px_60px_rgba(0,0,0,0.28)]">
      <div className="space-y-3">
        <h3 className="font-display text-2xl italic text-brand-text">{title}</h3>
        <p className="text-sm text-brand-text/80">{description}</p>
      </div>
      <div className="mt-6 space-y-4">
        <button
          type="button"
          onClick={() => {
            setOpen((prev) => !prev);
            setError(null);
            mutation.reset();
          }}
          className="w-full rounded-full border border-brand-support/60 bg-brand-accent px-5 py-3 font-semibold text-brand-base transition hover:bg-brand-support"
        >
          Inscribirme
        </button>
        {open && (
          <form
            className="space-y-3 rounded-3xl border border-white/10 bg-black/30 p-4"
            onSubmit={(event) => {
              event.preventDefault();
              mutation.mutate();
            }}
          >
            <label className="flex flex-col gap-1 text-xs">
              Nombre
              <input
                name="name"
                value={form.name}
                onChange={(event) => setForm((prev) => ({ ...prev, name: event.target.value }))}
                className="rounded-xl border border-white/15 bg-black/40 px-3 py-2 text-sm text-brand-text placeholder:text-brand-text/40"
                placeholder="Tu nombre"
                required
              />
            </label>
            <label className="flex flex-col gap-1 text-xs">
              Correo
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={(event) => setForm((prev) => ({ ...prev, email: event.target.value }))}
                className="rounded-xl border border-white/15 bg-black/40 px-3 py-2 text-sm text-brand-text placeholder:text-brand-text/40"
                placeholder="tucorreo@ejemplo.com"
                required
              />
            </label>
            {error && <p className="text-xs text-brand-accent">{error}</p>}
            {mutation.isSuccess && <p className="text-xs text-brand-support">Revisa tu correo para confirmar el pago.</p>}
            <button
              type="submit"
              disabled={mutation.isPending}
              className="inline-flex w-full items-center justify-center rounded-full border border-brand-support/60 bg-brand-accent px-4 py-2 text-sm font-semibold text-brand-base transition hover:bg-brand-support disabled:cursor-not-allowed disabled:border-white/10 disabled:bg-white/10"
            >
              {mutation.isPending ? 'Enviando…' : 'Enviar'}
            </button>
            <a
              href={paymentLink}
              target="_blank"
              rel="noreferrer"
              className="inline-flex w-full items-center justify-center rounded-full border border-white/20 px-4 py-2 text-center text-sm text-brand-support hover:border-brand-accent"
            >
              Ver enlace de pago
            </a>
          </form>
        )}
      </div>
    </article>
  );
}
