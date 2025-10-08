"use client";

import { Canvas } from "@react-three/fiber";
import { OrbitControls, PerspectiveCamera } from "@react-three/drei";
import { Suspense, useEffect, useMemo, useState } from "react";
import * as THREE from "three";
import clsx from "clsx";
import { useReducedMotion } from "framer-motion";

const loss = (w1: number, w2: number) => Math.sin(w1) * Math.cos(w2) + 0.1 * (w1 * w1 + w2 * w2);
const grad = (w1: number, w2: number) => [Math.cos(w1) * Math.cos(w2) + 0.2 * w1, -Math.sin(w1) * Math.sin(w2) + 0.2 * w2];

type OptimizerKey = "sgd" | "momentum" | "adam";

interface TrajectoryPoint {
  w1: number;
  w2: number;
  loss: number;
}

function computeTrajectory(optimizer: OptimizerKey, learningRate: number, epochs: number): TrajectoryPoint[] {
  const points: TrajectoryPoint[] = [];
  let w1 = 2.2;
  let w2 = -1.7;
  let velocity = [0, 0];
  let m = [0, 0];
  let v = [0, 0];
  const beta1 = 0.9;
  const beta2 = 0.999;
  const epsilon = 1e-8;
  for (let step = 1; step <= epochs; step++) {
    const [g1, g2] = grad(w1, w2);
    if (optimizer === "sgd") {
      w1 -= learningRate * g1;
      w2 -= learningRate * g2;
    } else if (optimizer === "momentum") {
      velocity[0] = 0.8 * velocity[0] + learningRate * g1;
      velocity[1] = 0.8 * velocity[1] + learningRate * g2;
      w1 -= velocity[0];
      w2 -= velocity[1];
    } else {
      m[0] = beta1 * m[0] + (1 - beta1) * g1;
      m[1] = beta1 * m[1] + (1 - beta1) * g2;
      v[0] = beta2 * v[0] + (1 - beta2) * g1 * g1;
      v[1] = beta2 * v[1] + (1 - beta2) * g2 * g2;
      const mHat = [m[0] / (1 - Math.pow(beta1, step)), m[1] / (1 - Math.pow(beta1, step))];
      const vHat = [v[0] / (1 - Math.pow(beta2, step)), v[1] / (1 - Math.pow(beta2, step))];
      w1 -= (learningRate * mHat[0]) / (Math.sqrt(vHat[0]) + epsilon);
      w2 -= (learningRate * mHat[1]) / (Math.sqrt(vHat[1]) + epsilon);
    }
    points.push({ w1, w2, loss: loss(w1, w2) });
  }
  return points;
}

function LossSurface() {
  const geometry = useMemo(() => {
    const geo = new THREE.PlaneGeometry(12, 12, 120, 120);
    const position = geo.attributes.position as THREE.BufferAttribute;
    for (let i = 0; i < position.count; i++) {
      const x = position.getX(i);
      const y = position.getY(i);
      const w1 = x / 2;
      const w2 = y / 2;
      const z = loss(w1, w2);
      position.setZ(i, z * 1.4);
    }
    position.needsUpdate = true;
    geo.computeVertexNormals();
    return geo;
  }, []);

  return (
    <mesh geometry={geometry} rotation={[-Math.PI / 2.4, 0, 0]} position={[0, -1.5, 0]}>
      <meshStandardMaterial
        color="#1f1f27"
        wireframe={false}
        metalness={0.1}
        roughness={0.5}
        emissive="#FF5DA2"
        emissiveIntensity={0.08}
      />
    </mesh>
  );
}

function Trajectory({ points, visible }: { points: TrajectoryPoint[]; visible: number }) {
  const lineRef = useMemo(() => {
    const curvePoints = points.slice(0, visible).map((p) => new THREE.Vector3(p.w1 * 2, p.loss * 1.4 - 1.5, p.w2 * 2));
    if (curvePoints.length < 2) return null;
    const curve = new THREE.CatmullRomCurve3(curvePoints, false, "catmullrom", 0.3);
    const curveGeometry = new THREE.TubeGeometry(curve, Math.max(1, curvePoints.length * 2), 0.04, 8, false);
    return curveGeometry;
  }, [points, visible]);

  if (!lineRef) return null;

  const lastPoint = points[Math.max(0, visible - 1)];

  return (
    <group>
      <mesh geometry={lineRef}>
        <meshStandardMaterial color="#FF5DA2" emissive="#FF5DA2" emissiveIntensity={0.5} />
      </mesh>
      {lastPoint ? (
        <mesh position={[lastPoint.w1 * 2, lastPoint.loss * 1.4 - 1.5, lastPoint.w2 * 2]}>
          <sphereGeometry args={[0.16, 32, 32]} />
          <meshStandardMaterial color="#FF7BB6" emissive="#FF7BB6" emissiveIntensity={0.7} />
        </mesh>
      ) : null}
    </group>
  );
}

export function LossLandscape() {
  const [optimizer, setOptimizer] = useState<OptimizerKey>("sgd");
  const [learningRate, setLearningRate] = useState(0.08);
  const [epochs, setEpochs] = useState(42);
  const [visibleSteps, setVisibleSteps] = useState(1);
  const shouldReduceMotion = useReducedMotion();

  const trajectory = useMemo(() => computeTrajectory(optimizer, learningRate, epochs), [optimizer, learningRate, epochs]);

  useEffect(() => {
    setVisibleSteps(1);
  }, [trajectory]);

  useEffect(() => {
    if (shouldReduceMotion) return;
    let frame = 0;
    const animate = () => {
      setVisibleSteps((prev) => {
        if (prev >= trajectory.length) {
          return prev;
        }
        frame = requestAnimationFrame(animate);
        return prev + 1;
      });
    };
    frame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(frame);
  }, [trajectory.length, shouldReduceMotion]);

  return (
    <section className="rounded-3xl border border-white/5 bg-black/40 p-6 backdrop-blur-xl">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="text-sm uppercase tracking-[0.3em] text-accent">Loss Landscape</p>
          <h3 className="text-2xl italic text-white">Descenso inteligente</h3>
        </div>
        <p className="font-mono text-xs text-slate-400">J(w₁, w₂) = sin(w₁)·cos(w₂) + 0.1(w₁² + w₂²)</p>
      </div>
      <div className="mt-6 grid gap-6 lg:grid-cols-[1fr,280px]">
        {shouldReduceMotion ? (
          <div className="flex h-72 items-center justify-center rounded-2xl border border-white/5 bg-gradient-to-br from-anthracite via-anthracite/70 to-black/60 p-8 text-center text-sm text-slate-300">
            Animación reducida. Ajusta parámetros para explorar el descenso.
          </div>
        ) : (
          <div className="relative h-80 w-full overflow-hidden rounded-2xl border border-white/5">
            <Canvas dpr={[1, 1.8]}>
              <Suspense fallback={null}>
                <PerspectiveCamera makeDefault position={[4, 4.5, 4]} fov={55} />
                <ambientLight intensity={0.4} />
                <directionalLight position={[5, 6, 3]} intensity={1} color="#FF7BB6" />
                <LossSurface />
                <Trajectory points={trajectory} visible={visibleSteps} />
                <OrbitControls enablePan={false} enableZoom={false} enableRotate={false} />
              </Suspense>
            </Canvas>
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-anthracite via-transparent" />
          </div>
        )}
        <div className="flex flex-col gap-4 text-sm">
          <fieldset>
            <legend className="mb-2 font-mono text-xs uppercase tracking-[0.3em] text-slate-400">Optimizador</legend>
            <div className="grid grid-cols-3 gap-2">
              {(
                [
                  { key: "sgd", label: "SGD" },
                  { key: "momentum", label: "Momentum" },
                  { key: "adam", label: "Adam" },
                ] as { key: OptimizerKey; label: string }[]
              ).map(({ key, label }) => (
                <button
                  key={key}
                  type="button"
                  onClick={() => setOptimizer(key)}
                  className={clsx(
                    "rounded-full border px-3 py-1.5 text-xs uppercase tracking-wide transition",
                    optimizer === key
                      ? "border-accent text-accent"
                      : "border-white/10 text-slate-400 hover:border-accent hover:text-accent"
                  )}
                  aria-pressed={optimizer === key}
                >
                  {label}
                </button>
              ))}
            </div>
          </fieldset>
          <label className="flex flex-col gap-2">
            <span className="font-mono text-xs uppercase tracking-[0.3em] text-slate-400">Learning rate {learningRate.toFixed(2)}</span>
            <input
              type="range"
              min={0.02}
              max={0.3}
              step={0.01}
              value={learningRate}
              onChange={(event) => setLearningRate(parseFloat(event.target.value))}
              className="accent-accent"
            />
          </label>
          <label className="flex flex-col gap-2">
            <span className="font-mono text-xs uppercase tracking-[0.3em] text-slate-400">Epochs {epochs}</span>
            <input
              type="range"
              min={10}
              max={120}
              step={2}
              value={epochs}
              onChange={(event) => setEpochs(parseInt(event.target.value))}
              className="accent-accent"
            />
          </label>
          <div className="rounded-2xl border border-white/5 bg-black/40 p-4 text-xs text-slate-300">
            Paso visible: {visibleSteps}/{trajectory.length}
          </div>
        </div>
      </div>
    </section>
  );
}
