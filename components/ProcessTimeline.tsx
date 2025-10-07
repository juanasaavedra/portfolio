const STEPS = [
  "Descubrimiento",
  "Research",
  "Prototipo",
  "Dev",
  "QA / Handoff",
];

export function ProcessTimeline() {
  return (
    <section className="rounded-3xl border border-white/5 bg-black/40 p-6 backdrop-blur-xl">
      <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="text-sm uppercase tracking-[0.3em] text-accent">Proceso</p>
          <h3 className="text-3xl italic text-white">Metodología iterativa</h3>
        </div>
        <p className="max-w-lg text-sm text-slate-300">Del descubrimiento a la entrega sin perder precisión técnica ni narrativa visual.</p>
      </div>
      <div className="mt-10 grid gap-6 md:grid-cols-5">
        {STEPS.map((step, index) => (
          <div key={step} className="relative rounded-2xl border border-white/10 bg-gradient-to-b from-[#181820] via-[#14141d] to-[#0f0f15] p-6">
            <span className="absolute -top-4 left-6 flex h-8 w-8 items-center justify-center rounded-full bg-accent text-sm font-mono text-black shadow-[0_0_0_6px_rgba(255,93,162,0.15)]">
              {index + 1}
            </span>
            <div className="absolute left-1/2 top-6 -z-[1] hidden h-[2px] w-full -translate-x-1/2 bg-gradient-to-r from-accent/20 via-accent/60 to-accent/20 md:block" aria-hidden />
            <div className="absolute left-1/2 top-6 -translate-x-1/2">
              <span className="block h-4 w-4 rounded-full bg-accent shadow-[0_0_0_6px_rgba(255,93,162,0.15)]" />
              <span className="absolute inset-0 animate-pulseAccent rounded-full" aria-hidden />
            </div>
            <h4 className="mt-6 text-xl italic text-white">{step}</h4>
            <p className="mt-4 text-sm text-slate-300">
              {index === 0 && "Kickoff, objetivos y métricas compartidas."}
              {index === 1 && "Investigación, síntesis y prioridades medibles."}
              {index === 2 && "Prototipos de alta fidelidad, flujos y tests rápidos."}
              {index === 3 && "Implementación con CI/CD, historias claras y cobertura."}
              {index === 4 && "QA accesible, handoff con documentación viva."}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
