"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { BlockMath } from "react-katex";
import "katex/dist/katex.min.css";
import clsx from "clsx";
import { useReducedMotion } from "framer-motion";

const PRESETS = {
  ripple: {
    label: "Ripple",
    fn: (x: number, y: number, amplitude: number, frequency: number) => {
      const r = Math.sqrt(x * x + y * y) + 0.0001;
      const value = Math.sin(r * frequency) * amplitude;
      return [value * (x / r), value * (y / r)];
    },
  },
  saddle: {
    label: "Saddle",
    fn: (x: number, y: number, amplitude: number, frequency: number) => [2 * x * amplitude, -2 * y * amplitude],
  },
  peaks: {
    label: "Peaks",
    fn: (x: number, y: number, amplitude: number, frequency: number) => {
      const f = Math.sin(x * frequency) + Math.cos(y * frequency);
      return [amplitude * f, amplitude * Math.sin(x * frequency - y * frequency)];
    },
  },
};

type PresetKey = keyof typeof PRESETS;

export function VectorField() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const prefersReducedMotion = useReducedMotion();
  const [amplitude, setAmplitude] = useState(1.2);
  const [frequency, setFrequency] = useState(1.2);
  const [preset, setPreset] = useState<PresetKey>("ripple");
  const [shouldAnimate, setShouldAnimate] = useState(!prefersReducedMotion);

  useEffect(() => {
    if (prefersReducedMotion) {
      setShouldAnimate(false);
    }
  }, [prefersReducedMotion]);

  const drawField = useMemo(() => PRESETS[preset].fn, [preset]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrame = 0;
    const size = 320;
    canvas.width = size;
    canvas.height = size;

    const render = (time: number) => {
      ctx.clearRect(0, 0, size, size);
      ctx.fillStyle = "rgba(20,20,24,0.94)";
      ctx.fillRect(0, 0, size, size);
      ctx.strokeStyle = "rgba(255,123,182,0.4)";
      ctx.lineWidth = 1;

      const step = 32;
      const scale = 6;
      for (let x = step / 2; x < size; x += step) {
        for (let y = step / 2; y < size; y += step) {
          const nx = (x - size / 2) / scale;
          const ny = (y - size / 2) / scale;
          const t = shouldAnimate ? Math.sin(time * 0.0006) * 0.4 : 0;
          const [dx, dy] = drawField(nx + t, ny - t, amplitude, frequency);
          const length = Math.sqrt(dx * dx + dy * dy) + 0.0001;
          const normX = (dx / length) * 10;
          const normY = (dy / length) * 10;

          ctx.save();
          ctx.translate(x, y);
          ctx.beginPath();
          ctx.moveTo(-normX * 0.5, -normY * 0.5);
          ctx.lineTo(normX * 0.5, normY * 0.5);
          ctx.stroke();

          ctx.beginPath();
          ctx.fillStyle = "#FF5DA2";
          ctx.moveTo(normX * 0.5, normY * 0.5);
          ctx.lineTo(normX * 0.5 - normX * 0.2 - normY * 0.2, normY * 0.5 - normY * 0.2 + normX * 0.2);
          ctx.lineTo(normX * 0.5 - normX * 0.2 + normY * 0.2, normY * 0.5 - normY * 0.2 - normX * 0.2);
          ctx.closePath();
          ctx.fill();
          ctx.restore();
        }
      }
      if (shouldAnimate) {
        animationFrame = requestAnimationFrame(render);
      }
    };

    render(0);

    return () => {
      cancelAnimationFrame(animationFrame);
    };
  }, [amplitude, frequency, drawField, shouldAnimate]);

  return (
    <section className="rounded-3xl border border-white/5 bg-black/40 p-6 backdrop-blur-xl">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="text-sm uppercase tracking-[0.3em] text-accent">Vector Field</p>
          <h3 className="text-2xl italic text-white">Gradientes en movimiento</h3>
        </div>
        <BlockMath math="\\nabla f(x,y)" className="text-accent" />
      </div>
      <div className="mt-6 grid gap-6 lg:grid-cols-[1fr,280px]">
        <div className="relative flex items-center justify-center">
          <canvas ref={canvasRef} className="h-80 w-full rounded-2xl border border-white/5 bg-black/40" aria-label="Visualización de campo vectorial" />
          <div className="pointer-events-none absolute inset-0 rounded-2xl border border-white/5" />
        </div>
        <div className="flex flex-col gap-5 text-sm">
          <fieldset>
            <legend className="mb-2 font-mono text-xs uppercase tracking-[0.3em] text-slate-400">Preset</legend>
            <div className="flex gap-2">
              {(Object.keys(PRESETS) as PresetKey[]).map((key) => (
                <button
                  key={key}
                  type="button"
                  onClick={() => setPreset(key)}
                  className={clsx(
                    "rounded-full border px-3 py-1.5 text-xs uppercase tracking-wide transition",
                    preset === key
                      ? "border-accent text-accent"
                      : "border-white/10 text-slate-400 hover:border-accent hover:text-accent"
                  )}
                  aria-pressed={preset === key}
                >
                  {PRESETS[key].label}
                </button>
              ))}
            </div>
          </fieldset>
          <label className="flex flex-col gap-2">
            <span className="font-mono text-xs uppercase tracking-[0.3em] text-slate-400">Amplitud {amplitude.toFixed(1)}</span>
            <input
              type="range"
              min={0.2}
              max={2.5}
              step={0.1}
              value={amplitude}
              onChange={(event) => setAmplitude(parseFloat(event.target.value))}
              className="accent-accent"
            />
          </label>
          <label className="flex flex-col gap-2">
            <span className="font-mono text-xs uppercase tracking-[0.3em] text-slate-400">Frecuencia {frequency.toFixed(1)}</span>
            <input
              type="range"
              min={0.5}
              max={3}
              step={0.1}
              value={frequency}
              onChange={(event) => setFrequency(parseFloat(event.target.value))}
              className="accent-accent"
            />
          </label>
          <button
            type="button"
            onClick={() => setShouldAnimate((prev) => !prev)}
            className="rounded-full border border-white/10 px-3 py-2 font-mono text-xs uppercase tracking-[0.3em] text-slate-300 transition hover:border-accent hover:text-accent"
            aria-pressed={shouldAnimate}
          >
            {shouldAnimate ? "Animación activa" : "Animación detenida"}
          </button>
        </div>
      </div>
    </section>
  );
}
