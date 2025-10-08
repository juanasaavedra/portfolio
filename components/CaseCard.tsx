"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { motionConfig } from "@/lib/theme";

interface CaseItem {
  slug: string;
  title: string;
  tags: string[];
  impact: string;
}

interface CaseCardProps {
  item: CaseItem;
}

export function CaseCard({ item }: CaseCardProps) {
  return (
    <motion.article
      className="group relative overflow-hidden rounded-3xl border border-white/5 bg-gradient-to-br from-[#181820] via-[#13131a] to-[#0f0f15] p-6"
      whileHover={{ translateY: -6 }}
      transition={motionConfig.transition}
    >
      <div className="flex items-start justify-between gap-4">
        <h4 className="text-2xl italic text-white">{item.title}</h4>
        <span className="rounded-full border border-accent/40 px-3 py-1 text-xs font-mono uppercase tracking-[0.3em] text-accent">{item.impact}</span>
      </div>
      <div className="mt-6 flex flex-wrap gap-2 text-xs font-mono uppercase tracking-[0.3em] text-slate-400">
        {item.tags.map((tag) => (
          <span key={tag} className="rounded-full border border-white/10 px-3 py-1 transition group-hover:border-accent group-hover:text-accent">
            {tag}
          </span>
        ))}
      </div>
      <p className="mt-6 text-sm text-slate-300">Explora el caso completo con visualizaciones y métricas de impacto.</p>
      <Link
        href={`/casos/${item.slug}`}
        className="mt-8 inline-flex items-center gap-2 text-sm text-accent transition hover:text-accentSoft focus-visible:text-accentSoft"
      >
        Ver detalle
        <span aria-hidden className="transition-transform group-hover:translate-x-1">→</span>
      </Link>
    </motion.article>
  );
}
