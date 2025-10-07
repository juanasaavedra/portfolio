"use client";

import { useCallback } from "react";
import { motion, useMotionTemplate, useMotionValue } from "framer-motion";
import { motionConfig } from "@/lib/theme";

interface Service {
  title: string;
  bullets: string[];
}

interface ServicesGridProps {
  services: Service[];
}

export function ServicesGrid({ services }: ServicesGridProps) {
  return (
    <section id="servicios" className="rounded-3xl border border-white/5 bg-black/40 p-6 backdrop-blur-xl">
      <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="text-sm uppercase tracking-[0.3em] text-accent">Servicios</p>
          <h3 className="text-3xl italic text-white">Diseño + código sin fricción</h3>
        </div>
        <p className="max-w-xl text-sm text-slate-300">
          Sistemas de diseño medibles, investigación con rigor y ejecución frontend con física visual. Cada tarjeta responde al cursor con un tilt suave.
        </p>
      </div>
      <div className="mt-10 grid gap-6 md:grid-cols-2">
        {services.map((service) => (
          <TiltCard key={service.title} service={service} />
        ))}
      </div>
    </section>
  );
}

function TiltCard({ service }: { service: Service }) {
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const rotateX = useMotionTemplate`${y}deg`;
  const rotateY = useMotionTemplate`${x}deg`;

  const handleMove = useCallback((event: React.MouseEvent<HTMLDivElement>) => {
    const bounds = event.currentTarget.getBoundingClientRect();
    const relativeX = (event.clientX - bounds.left) / bounds.width;
    const relativeY = (event.clientY - bounds.top) / bounds.height;
    const tiltX = (relativeY - 0.5) * -12;
    const tiltY = (relativeX - 0.5) * 12;
    x.set(Math.max(Math.min(tiltY, 6), -6));
    y.set(Math.max(Math.min(tiltX, 6), -6));
  }, [x, y]);

  const reset = useCallback(() => {
    x.set(0);
    y.set(0);
  }, [x, y]);

  return (
    <motion.div
      onMouseMove={handleMove}
      onMouseLeave={reset}
      style={{ rotateX, rotateY }}
      transition={motionConfig.transition}
      className="group relative overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-[#1a1a22] via-[#14141c] to-[#101016] p-[1px]"
    >
      <div className="relative h-full rounded-[calc(theme(borderRadius.3xl)-1px)] bg-black/60 p-6">
        <div className="absolute inset-0 border-2 border-dashed border-accent/30 opacity-0 transition-opacity duration-500 group-hover:opacity-100" style={{ strokeDasharray: "12 12" }} />
        <div className="flex items-center justify-between gap-4">
          <h4 className="text-2xl italic text-white">{service.title}</h4>
          <span className="text-xs font-mono uppercase tracking-[0.3em] text-slate-400">{service.bullets.length} deliverables</span>
        </div>
        <ul className="mt-6 space-y-3 text-sm text-slate-300">
          {service.bullets.map((bullet) => (
            <li key={bullet} className="flex items-center gap-3">
              <span className="h-1 w-6 rounded-full bg-accent transition-all group-hover:w-10" aria-hidden />
              <span className="border-b border-dashed border-transparent transition group-hover:border-accent">{bullet}</span>
            </li>
          ))}
        </ul>
      </div>
    </motion.div>
  );
}
