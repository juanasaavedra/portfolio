import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Link from "next/link";
import site from "@/content/site.es.json";
import { SectionReveal } from "@/components/SectionReveal";

const details: Record<string, { problem: string; process: string; ui: string; metrics: string[] }> = {
  "proyecto-a": {
    problem: "Las PMs necesitaban entender patrones de conversión sin depender del equipo de datos.",
    process: "Mapeé journeys, instrumenté eventos y prototipé escenarios con visualizaciones explorables en R3F.",
    ui: "Se diseñó una superficie de analítica con filtros multivariables, anotaciones y estados colaborativos en tiempo real.",
    metrics: ["Tiempo de insight ↓45%", "Conversión ↑30%", "NPS del dashboard 9/10"],
  },
  "proyecto-b": {
    problem: "Un equipo distribuido necesitaba consistencia y accesibilidad en todos los productos.",
    process: "Audité componentes, definí tokens dinámicos y documenté patrones accesibles con tests Axe automatizados.",
    ui: "El design system incluye librería de bloques, modo oscuro, guidelines inclusivas y playground interactivo.",
    metrics: ["Tiempo de entrega ↓40%", "Errores de accesibilidad 0", "Adopción interna 92%"],
  },
  "proyecto-c": {
    problem: "Había que explicar una red neuronal a perfiles no técnicos durante demos comerciales.",
    process: "Traducí pesos y gradientes en visualizaciones narrativas con animaciones controladas por scroll.",
    ui: "Desarrollé un lienzo WebGL con flujos comparables, explicación paso a paso y métricas en vivo.",
    metrics: ["Retención de sesión ↑", "Clarity score 4.7/5", "Tickets de soporte -35%"],
  },
};

interface CasePageProps {
  params: { slug: string };
}

export function generateStaticParams() {
  return site.cases.map((item) => ({ slug: item.slug }));
}

export function generateMetadata({ params }: CasePageProps): Metadata {
  const caseData = site.cases.find((item) => item.slug === params.slug);
  if (!caseData) {
    return { title: "Caso no encontrado" };
  }
  return {
    title: `${caseData.title} · ${site.brand}`,
    description: caseData.impact,
  };
}

export default function CasePage({ params }: CasePageProps) {
  const caseData = site.cases.find((item) => item.slug === params.slug);
  if (!caseData) {
    notFound();
  }
  const detail = details[params.slug];
  if (!detail) {
    notFound();
  }

  return (
    <article className="space-y-12">
      <SectionReveal>
        <header className="rounded-3xl border border-white/5 bg-black/40 p-8 backdrop-blur-xl">
          <Link href="/" className="text-xs font-mono uppercase tracking-[0.35em] text-slate-400 hover:text-accent">
            ← Volver
          </Link>
          <h1 className="mt-6 text-4xl italic text-white">{caseData.title}</h1>
          <p className="mt-4 max-w-3xl text-sm text-slate-300">{detail.problem}</p>
          <div className="mt-6 flex flex-wrap gap-3 text-xs font-mono uppercase tracking-[0.35em] text-slate-400">
            {caseData.tags.map((tag) => (
              <span key={tag} className="rounded-full border border-white/10 px-3 py-1">
                {tag}
              </span>
            ))}
            <span className="rounded-full border border-accent/40 px-3 py-1 text-accent">{caseData.impact}</span>
          </div>
        </header>
      </SectionReveal>

      <SectionReveal>
        <section className="rounded-3xl border border-white/5 bg-black/40 p-6 backdrop-blur-xl">
          <h2 className="text-2xl italic text-white">Proceso</h2>
          <p className="mt-4 text-sm text-slate-300">{detail.process}</p>
          <div className="mt-6 grid gap-4 md:grid-cols-3">
            <div className="rounded-2xl border border-white/10 bg-black/60 p-4 text-xs text-slate-300">
              <p className="font-mono uppercase tracking-[0.35em] text-accent">Research</p>
              <p className="mt-2">Workshops, entrevistas y trazabilidad de hipótesis.</p>
            </div>
            <div className="rounded-2xl border border-white/10 bg-black/60 p-4 text-xs text-slate-300">
              <p className="font-mono uppercase tracking-[0.35em] text-accent">Prototipo</p>
              <p className="mt-2">Flujos navegables, validación con usuarios y métricas tempranas.</p>
            </div>
            <div className="rounded-2xl border border-white/10 bg-black/60 p-4 text-xs text-slate-300">
              <p className="font-mono uppercase tracking-[0.35em] text-accent">Entrega</p>
              <p className="mt-2">Implementación en Next.js, handoff documentado y monitoreo.</p>
            </div>
          </div>
        </section>
      </SectionReveal>

      <SectionReveal>
        <section className="rounded-3xl border border-white/5 bg-black/40 p-6 backdrop-blur-xl">
          <h2 className="text-2xl italic text-white">UI Final</h2>
          <p className="mt-4 text-sm text-slate-300">{detail.ui}</p>
          <div className="mt-6 grid gap-4 md:grid-cols-2">
            <div className="h-56 rounded-2xl border border-white/10 bg-gradient-to-br from-[#1A1A24] via-[#15151d] to-[#0f0f13]" aria-hidden />
            <div className="h-56 rounded-2xl border border-white/10 bg-gradient-to-br from-[#15151d] via-[#101018] to-[#0b0b11]" aria-hidden />
          </div>
        </section>
      </SectionReveal>

      <SectionReveal>
        <section className="rounded-3xl border border-white/5 bg-black/40 p-6 backdrop-blur-xl">
          <h2 className="text-2xl italic text-white">Impacto</h2>
          <ul className="mt-4 grid gap-3 text-sm text-slate-300 md:grid-cols-3">
            {detail.metrics.map((metric) => (
              <li key={metric} className="rounded-2xl border border-accent/30 bg-black/60 p-4 text-center text-accent">
                {metric}
              </li>
            ))}
          </ul>
        </section>
      </SectionReveal>
    </article>
  );
}
