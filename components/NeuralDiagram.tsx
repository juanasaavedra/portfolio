"use client";

import { useMemo, useState } from "react";
import clsx from "clsx";

interface Node {
  id: string;
  layer: number;
  activation: number;
}

const LAYERS = [3, 5, 4, 2];

const ACTIVATIONS = {
  relu: {
    label: "ReLU",
    transform: (value: number) => Math.max(0, value),
  },
  tanh: {
    label: "tanh",
    transform: (value: number) => Math.tanh(value),
  },
  sigmoid: {
    label: "Sigmoid",
    transform: (value: number) => 1 / (1 + Math.exp(-value)),
  },
};

type ActivationKey = keyof typeof ACTIVATIONS;

export function NeuralDiagram() {
  const [activation, setActivation] = useState<ActivationKey>("relu");
  const [showWeights, setShowWeights] = useState(true);

  const nodes = useMemo<Node[]>(() => {
    const data: Node[] = [];
    LAYERS.forEach((count, layer) => {
      for (let i = 0; i < count; i++) {
        const seed = Math.sin(layer * 7.3 + i * 3.1) * 0.5 + 0.5;
        data.push({ id: `${layer}-${i}`, layer, activation: seed });
      }
    });
    return data;
  }, []);

  return (
    <section className="rounded-3xl border border-white/5 bg-black/40 p-6 backdrop-blur-xl">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="text-sm uppercase tracking-[0.3em] text-accent">Neural Flow</p>
          <h3 className="text-2xl italic text-white">Capas activadas</h3>
        </div>
        <div className="flex items-center gap-3 text-xs text-slate-400">
          <span className="flex items-center gap-2"><span className="h-3 w-3 rounded-full bg-accent" /> activación alta</span>
          <span className="flex items-center gap-2"><span className="h-3 w-3 rounded-full bg-accent/40" /> activación baja</span>
        </div>
      </div>
      <div className="mt-6 grid gap-6 lg:grid-cols-[1fr,280px]">
        <div className="relative overflow-hidden rounded-2xl border border-white/5 bg-gradient-to-br from-[#1A1A24] via-[#17171f] to-[#0f0f13] p-6">
          <svg viewBox="0 0 600 320" className="h-80 w-full" role="img" aria-labelledby="neural-diagram-title neural-diagram-desc">
            <title id="neural-diagram-title">Diagrama de red neuronal</title>
            <desc id="neural-diagram-desc">Conexiones entre capas con activaciones animadas.</desc>
            {nodes.map((node) => {
              const radius = 18 + ACTIVATIONS[activation].transform(node.activation) * 10;
              const intensity = ACTIVATIONS[activation].transform(node.activation);
              const xSpacing = 600 / (LAYERS.length + 1);
              const ySpacing = 280 / (LAYERS[node.layer] + 1);
              const cx = xSpacing * (node.layer + 1);
              const cy = ySpacing * (parseInt(node.id.split("-")[1]) + 1) + 20;
              return (
                <g key={node.id}>
                  {LAYERS[node.layer + 1]
                    ? Array.from({ length: LAYERS[node.layer + 1] }).map((_, next) => {
                        const nySpacing = 280 / (LAYERS[node.layer + 1] + 1);
                        const nx = xSpacing * (node.layer + 2);
                        const ny = nySpacing * (next + 1) + 20;
                        return (
                          <line
                            key={`${node.id}-${next}`}
                            x1={cx + radius}
                            y1={cy}
                            x2={nx - 20}
                            y2={ny}
                            stroke="#FF7BB6"
                            strokeOpacity={showWeights ? 0.35 + intensity * 0.4 : 0.15}
                            strokeWidth={showWeights ? 1.5 : 1}
                          >
                            <title>peso → {((intensity - 0.5) * 0.8).toFixed(2)}</title>
                          </line>
                        );
                      })
                    : null}
                  <circle
                    cx={cx}
                    cy={cy}
                    r={radius}
                    className={clsx("transition-all duration-500 ease-out", showWeights ? "stroke-accent" : "stroke-white/10")}
                    strokeWidth={showWeights ? 1.8 : 1}
                    fill={`rgba(255,93,162,${0.35 + intensity * 0.5})`}
                  >
                    <title>Activación: {intensity.toFixed(2)}</title>
                  </circle>
                </g>
              );
            })}
          </svg>
        </div>
        <div className="flex flex-col gap-4 text-sm">
          <fieldset>
            <legend className="mb-2 font-mono text-xs uppercase tracking-[0.3em] text-slate-400">Activación</legend>
            <div className="grid grid-cols-3 gap-2">
              {(Object.keys(ACTIVATIONS) as ActivationKey[]).map((key) => (
                <button
                  key={key}
                  type="button"
                  onClick={() => setActivation(key)}
                  className={clsx(
                    "rounded-full border px-3 py-1.5 text-xs uppercase tracking-wide transition",
                    activation === key
                      ? "border-accent text-accent"
                      : "border-white/10 text-slate-400 hover:border-accent hover:text-accent"
                  )}
                  aria-pressed={activation === key}
                >
                  {ACTIVATIONS[key].label}
                </button>
              ))}
            </div>
          </fieldset>
          <label className="flex items-center justify-between gap-4">
            <span className="font-mono text-xs uppercase tracking-[0.3em] text-slate-400">Mostrar pesos</span>
            <button
              type="button"
              onClick={() => setShowWeights((prev) => !prev)}
              className={clsx(
                "relative inline-flex h-7 w-14 items-center rounded-full border border-white/10 bg-black/60 px-1 transition",
                showWeights ? "ring-1 ring-accent" : ""
              )}
              aria-pressed={showWeights}
            >
              <span
                className={clsx(
                  "inline-block h-5 w-5 rounded-full bg-accent transition-transform",
                  showWeights ? "translate-x-7" : "translate-x-0"
                )}
              />
            </button>
          </label>
          <div className="rounded-2xl border border-white/5 bg-black/40 p-4 text-xs leading-relaxed text-slate-300">
            <p className="font-mono text-[10px] uppercase tracking-[0.35em] text-accent">Leyenda</p>
            <ul className="mt-3 space-y-2">
              <li>Radio = intensidad después de {ACTIVATIONS[activation].label}</li>
              <li>Color = escala en rosados, más brillante → mayor activación.</li>
              <li>Pesos = anchura + opacidad de las líneas.</li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
