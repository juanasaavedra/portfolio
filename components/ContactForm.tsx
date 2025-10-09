"use client";

import { FormEvent, useMemo, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { motionConfig } from "@/lib/theme";

interface ContactFormProps {
  title: string;
  cta: string;
}

export function ContactForm({ title, cta }: ContactFormProps) {
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = event.currentTarget;
    const data = new FormData(form);
    const name = (data.get("name") as string)?.trim();
    const email = (data.get("email") as string)?.trim();
    const message = (data.get("message") as string)?.trim();

    const newErrors: Record<string, string> = {};
    if (!name) newErrors.name = "Ingresa tu nombre";
    if (!email || !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) newErrors.email = "Email inválido";
    if (!message || message.length < 20) newErrors.message = "Cuéntame un poco más (≥20 caracteres)";

    setErrors(newErrors);
    if (Object.keys(newErrors).length === 0) {
      setStatus("success");
      form.reset();
    } else {
      setStatus("error");
    }
  };

  const message = useMemo(() => {
    if (status === "success") return "Gracias, responderé en menos de 24h.";
    if (status === "error") return "Revisa los campos destacados.";
    return "";
  }, [status]);

  return (
    <section id="contacto" className="rounded-3xl border border-white/5 bg-black/40 p-6 backdrop-blur-xl">
      <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="text-sm uppercase tracking-[0.3em] text-accent">Contacto</p>
          <h3 className="text-3xl italic text-white">{title}</h3>
        </div>
        <div className="flex flex-wrap gap-4 text-sm text-slate-300">
          <MagneticLink href="mailto:jusaavedrar@ieee.org" label="Email" />
          <MagneticLink href="https://wa.me/5215512345678" label="WhatsApp" />
        </div>
      </div>
      <form className="mt-8 grid gap-4 md:grid-cols-2" onSubmit={handleSubmit} noValidate>
        <label className="flex flex-col gap-2">
          <span className="font-mono text-xs uppercase tracking-[0.3em] text-slate-400">Nombre</span>
          <input
            name="name"
            type="text"
            required
            className="rounded-2xl border border-white/10 bg-black/60 px-4 py-3 text-sm text-white placeholder:text-slate-500 focus:border-accent"
            aria-invalid={errors.name ? "true" : "false"}
            aria-describedby={errors.name ? "error-name" : undefined}
          />
          {errors.name ? (
            <span id="error-name" className="text-xs text-accent">
              {errors.name}
            </span>
          ) : null}
        </label>
        <label className="flex flex-col gap-2">
          <span className="font-mono text-xs uppercase tracking-[0.3em] text-slate-400">Email</span>
          <input
            name="email"
            type="email"
            required
            className="rounded-2xl border border-white/10 bg-black/60 px-4 py-3 text-sm text-white placeholder:text-slate-500 focus:border-accent"
            aria-invalid={errors.email ? "true" : "false"}
            aria-describedby={errors.email ? "error-email" : undefined}
          />
          {errors.email ? (
            <span id="error-email" className="text-xs text-accent">
              {errors.email}
            </span>
          ) : null}
        </label>
        <label className="md:col-span-2 flex flex-col gap-2">
          <span className="font-mono text-xs uppercase tracking-[0.3em] text-slate-400">Mensaje</span>
          <textarea
            name="message"
            rows={5}
            required
            className="rounded-2xl border border-white/10 bg-black/60 px-4 py-3 text-sm text-white placeholder:text-slate-500 focus:border-accent"
            aria-invalid={errors.message ? "true" : "false"}
            aria-describedby={errors.message ? "error-message" : undefined}
          />
          {errors.message ? (
            <span id="error-message" className="text-xs text-accent">
              {errors.message}
            </span>
          ) : null}
        </label>
        <div className="md:col-span-2 flex items-center justify-between">
          <motion.button
            type="submit"
            whileTap={{ scale: 0.98 }}
            className="rounded-full border border-accent px-6 py-3 text-sm font-mono uppercase tracking-[0.35em] text-accent transition hover:border-accentSoft hover:text-accentSoft"
            transition={motionConfig.transition}
          >
            {cta}
          </motion.button>
          <span role="status" aria-live="polite" className="text-xs text-slate-400">
            {message}
          </span>
        </div>
      </form>
    </section>
  );
}

function MagneticLink({ href, label }: { href: string; label: string }) {
  const [offset, setOffset] = useState({ x: 0, y: 0 });

  return (
    <Link
      href={href}
      className="relative inline-flex h-12 w-32 items-center justify-center overflow-hidden rounded-full border border-white/10 bg-black/60 text-sm text-slate-200 transition hover:border-accent hover:text-accent"
      onMouseMove={(event) => {
        const rect = event.currentTarget.getBoundingClientRect();
        const x = ((event.clientX - rect.left) / rect.width - 0.5) * 16;
        const y = ((event.clientY - rect.top) / rect.height - 0.5) * 16;
        setOffset({ x, y });
      }}
      onMouseLeave={() => setOffset({ x: 0, y: 0 })}
      target={href.startsWith("http") ? "_blank" : undefined}
      rel={href.startsWith("http") ? "noreferrer" : undefined}
    >
      <span
        className="pointer-events-none"
        style={{ transform: `translate3d(${offset.x}px, ${offset.y}px, 0)` }}
      >
        {label}
      </span>
    </Link>
  );
}
