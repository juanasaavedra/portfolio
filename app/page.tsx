import dynamic from "next/dynamic";
import Link from "next/link";
import site from "@/content/site.es.json";
import { ServicesGrid } from "@/components/ServicesGrid";
import { CaseCard } from "@/components/CaseCard";
import { ProcessTimeline } from "@/components/ProcessTimeline";
import { ContactForm } from "@/components/ContactForm";
import { SectionReveal } from "@/components/SectionReveal";

const HeroScene = dynamic(() => import("@/components/HeroScene").then((mod) => mod.HeroScene), {
  ssr: false,
  loading: () => <div className="h-full w-full rounded-3xl bg-gradient-to-br from-[#1A1A24] to-[#101016]" />,
});

const VectorField = dynamic(() => import("@/components/VectorField").then((mod) => mod.VectorField), {
  ssr: false,
  loading: () => <div className="h-80 w-full rounded-3xl border border-white/5 bg-black/40" />,
});

const LossLandscape = dynamic(() => import("@/components/LossLandscape").then((mod) => mod.LossLandscape), {
  ssr: false,
  loading: () => <div className="h-80 w-full rounded-3xl border border-white/5 bg-black/40" />,
});

const NeuralDiagram = dynamic(() => import("@/components/NeuralDiagram").then((mod) => mod.NeuralDiagram), {
  ssr: false,
  loading: () => <div className="h-80 w-full rounded-3xl border border-white/5 bg-black/40" />,
});

export default function HomePage() {
  return (
    <>
      <section className="grid min-h-[80vh] items-center gap-10 md:grid-cols-[minmax(0,1fr),minmax(0,1.1fr)]">
        <div className="flex flex-col justify-center gap-6">
          <p className="text-xs font-mono uppercase tracking-[0.4em] text-accent">Juana Saavedra · Visual Computing</p>
          <h1 className="text-4xl italic text-white md:text-5xl">{site.hero.title}</h1>
          <p className="max-w-xl text-lg text-slate-300">{site.hero.subtitle}</p>
          <div className="flex flex-wrap gap-4">
            <Link
              href={`mailto:${site.hero.ctaPrimary.href}`}
              className="rounded-full border border-accent bg-accent/10 px-6 py-3 text-sm font-mono uppercase tracking-[0.35em] text-accent transition hover:border-accentSoft hover:text-accentSoft"
            >
              {site.hero.ctaPrimary.label}
            </Link>
            <Link
              href={site.hero.ctaSecondary.href}
              className="rounded-full border border-white/10 px-6 py-3 text-sm font-mono uppercase tracking-[0.35em] text-slate-200 transition hover:border-accent hover:text-accent"
            >
              {site.hero.ctaSecondary.label}
            </Link>
          </div>
          <div className="mt-6 grid grid-cols-3 gap-6 text-xs text-slate-400">
            <div>
              <p className="font-mono uppercase tracking-[0.35em] text-accent">Stack</p>
              <p className="mt-2 leading-relaxed">React · Next · R3F · Framer Motion · TypeScript</p>
            </div>
            <div>
              <p className="font-mono uppercase tracking-[0.35em] text-accent">Investigación</p>
              <p className="mt-2 leading-relaxed">Experimentación con cálculo multivariado y visualización.</p>
            </div>
            <div>
              <p className="font-mono uppercase tracking-[0.35em] text-accent">Entrega</p>
              <p className="mt-2 leading-relaxed">Rendimiento, accesibilidad y métricas claras.</p>
            </div>
          </div>
        </div>
        <div className="h-[480px] w-full md:h-[520px]">
          <HeroScene />
        </div>
      </section>

      <SectionReveal>
        <ServicesGrid services={site.services} />
      </SectionReveal>

      <SectionReveal className="space-y-6" id="visualizaciones">
        <header className="flex flex-col gap-2">
          <p className="text-sm font-mono uppercase tracking-[0.35em] text-accent">Visualizaciones</p>
          <h2 className="text-3xl italic text-white">Machine learning tangible</h2>
          <p className="max-w-3xl text-sm text-slate-300">
            Conecta usuarios con modelos matemáticos complejos. Cada módulo se adapta a preferencias de movimiento y ofrece controles interactivos.
          </p>
        </header>
        <div className="space-y-6">
          <VectorField />
          <LossLandscape />
          <NeuralDiagram />
        </div>
      </SectionReveal>

      <SectionReveal id="casos" className="space-y-8">
        <header className="flex flex-col gap-2">
          <p className="text-sm font-mono uppercase tracking-[0.35em] text-accent">Casos</p>
          <h2 className="text-3xl italic text-white">Proyectos seleccionados</h2>
          <p className="max-w-2xl text-sm text-slate-300">Cada proyecto integra investigación, visualización avanzada y métricas de impacto.</p>
        </header>
        <div className="grid gap-6 md:grid-cols-3">
          {site.cases.map((item) => (
            <CaseCard key={item.slug} item={item} />
          ))}
        </div>
      </SectionReveal>

      <SectionReveal>
        <ProcessTimeline />
      </SectionReveal>

      <SectionReveal className="grid gap-10 lg:grid-cols-[minmax(0,1fr),380px]">
        <div className="rounded-3xl border border-white/5 bg-black/40 p-6 backdrop-blur-xl">
          <p className="text-sm uppercase tracking-[0.3em] text-accent">Sobre mí</p>
          <h3 className="text-3xl italic text-white">Confianza basada en ciencia</h3>
          <p className="mt-4 text-sm text-slate-300">{site.about.bio}</p>
          <div className="mt-6 flex flex-wrap gap-3 text-xs font-mono uppercase tracking-[0.35em] text-slate-400">
            {site.about.skills.map((skill) => (
              <span key={skill} className="rounded-full border border-white/10 px-3 py-1">
                {skill}
              </span>
            ))}
          </div>
          <div className="mt-8 grid gap-3 text-xs text-slate-400 md:grid-cols-2">
            <div className="rounded-2xl border border-white/10 bg-black/40 p-4">
              <p className="font-mono uppercase tracking-[0.35em] text-accent">Colaboraciones</p>
              <ul className="mt-3 space-y-1">
                <li>IEEE Human Factors</li>
                <li>Startups IA LatAm</li>
              </ul>
            </div>
            <div className="rounded-2xl border border-white/10 bg-black/40 p-4">
              <p className="font-mono uppercase tracking-[0.35em] text-accent">Herramientas</p>
              <ul className="mt-3 space-y-1">
                <li>Observabilidad UX</li>
                <li>DataViz científicas</li>
              </ul>
            </div>
          </div>
        </div>
        <div className="rounded-3xl border border-white/5 bg-black/40 p-6 backdrop-blur-xl">
          <p className="text-sm uppercase tracking-[0.35em] text-accent">Testimonios</p>
          <div className="group mt-4 overflow-hidden">
            <div className="testimonial-marquee flex animate-marquee gap-6 group-hover:[animation-play-state:paused]">
              {site.about.testimonials.concat(site.about.testimonials).map((testimonial, index) => (
                <blockquote
                  key={`${testimonial.author}-${index}`}
                  className="min-w-[220px] max-w-xs rounded-2xl border border-white/10 bg-black/60 p-4 text-sm text-slate-200"
                >
                  “{testimonial.quote}”
                  <footer className="mt-3 text-xs text-accent">— {testimonial.author}</footer>
                </blockquote>
              ))}
            </div>
          </div>
        </div>
      </SectionReveal>

      <SectionReveal>
        <ContactForm title={site.contact.title} cta={site.contact.cta} />
      </SectionReveal>
    </>
  );
}
