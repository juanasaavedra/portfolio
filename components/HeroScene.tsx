"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, PerspectiveCamera } from "@react-three/drei";
import { Suspense, useMemo, useRef, useState } from "react";
import * as THREE from "three";
import { useReducedMotion } from "framer-motion";

const SURFACE_SEGMENTS = 90;

function AnimatedSurface({ wireframe }: { wireframe: boolean }) {
  const mesh = useRef<THREE.Mesh>(null);
  const geometry = useMemo(() => new THREE.PlaneGeometry(14, 14, SURFACE_SEGMENTS, SURFACE_SEGMENTS), []);

  useFrame(({ clock }) => {
    if (!mesh.current) return;
    const time = clock.getElapsedTime();
    const position = geometry.attributes.position as THREE.BufferAttribute;
    for (let i = 0; i < position.count; i++) {
      const x = position.getX(i);
      const y = position.getY(i);
      const z = Math.sin(x * 1.2 + time * 0.8) * Math.cos(y * 1.2 - time * 0.6) * 0.6;
      position.setZ(i, z);
    }
    position.needsUpdate = true;
    geometry.computeVertexNormals();
  });

  return (
    <mesh ref={mesh} rotation={[-Math.PI / 2.6, 0, 0]} geometry={geometry} position={[0, -1.4, 0]}>
      <meshStandardMaterial
        color={wireframe ? "#FF7BB6" : "#1f1f27"}
        wireframe={wireframe}
        emissive="#FF5DA2"
        emissiveIntensity={wireframe ? 0.26 : 0.12}
        metalness={0.15}
        roughness={0.4}
      />
    </mesh>
  );
}

function ParticleField() {
  const points = useRef<THREE.Points>(null);
  const count = 800;
  const positions = useMemo(() => {
    const arr = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      arr[i * 3] = (Math.random() - 0.5) * 18;
      arr[i * 3 + 1] = Math.random() * 6;
      arr[i * 3 + 2] = (Math.random() - 0.5) * 18;
    }
    return arr;
  }, [count]);

  useFrame(({ clock, pointer }) => {
    if (!points.current) return;
    const t = clock.getElapsedTime();
    const position = points.current.geometry.attributes.position as THREE.BufferAttribute;
    for (let i = 0; i < position.count; i++) {
      const base = i * 3;
      const y = position.getY(i) + Math.sin(t * 0.2 + base) * 0.002;
      position.setY(i, ((y + 6) % 6));
    }
    position.needsUpdate = true;
    points.current.rotation.y = pointer.x * 0.2;
  });

  return (
    <points ref={points} position={[0, -1, 0]}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" count={positions.length / 3} array={positions} itemSize={3} />
      </bufferGeometry>
      <pointsMaterial color="#FF5DA2" size={0.05} sizeAttenuation transparent opacity={0.7} />
    </points>
  );
}

function SceneGroup({ wireframe }: { wireframe: boolean }) {
  const group = useRef<THREE.Group>(null);

  useFrame(({ pointer }) => {
    if (!group.current) return;
    group.current.rotation.x = THREE.MathUtils.lerp(group.current.rotation.x, pointer.y * -0.3, 0.06);
    group.current.rotation.y = THREE.MathUtils.lerp(group.current.rotation.y, pointer.x * 0.3, 0.06);
  });

  return (
    <group ref={group}>
      <AnimatedSurface wireframe={wireframe} />
      <ParticleField />
    </group>
  );
}

export function HeroScene() {
  const [wireframe, setWireframe] = useState(false);
  const shouldReduceMotion = useReducedMotion();

  if (shouldReduceMotion) {
    return (
      <div className="relative h-full w-full overflow-hidden rounded-3xl reduced-motion-overlay">
        <svg className="absolute inset-0 h-full w-full" viewBox="0 0 400 400" aria-hidden>
          <defs>
            <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#FF5DA2" stopOpacity="0.25" />
              <stop offset="100%" stopColor="#FF7BB6" stopOpacity="0" />
            </linearGradient>
          </defs>
          <rect width="400" height="400" fill="#1A1A21" />
          <path d="M0 280 C120 220 160 360 320 280" stroke="#FF5DA2" strokeWidth="2" fill="none" />
          <circle cx="260" cy="160" r="52" stroke="#FF7BB6" strokeWidth="2" fill="none" />
        </svg>
        <button
          type="button"
          aria-label="Wireframe"
          className="absolute bottom-4 right-4 rounded-full border border-white/10 bg-black/40 px-4 py-2 text-xs uppercase tracking-widest text-slate-200"
          disabled
        >
          Wireframe
        </button>
      </div>
    );
  }

  return (
    <div className="relative h-full w-full overflow-hidden rounded-3xl">
      <Canvas dpr={[1, 1.8]} className="bg-transparent" shadows onCreated={({ gl }) => gl.setClearColor(new THREE.Color("#0f0f13"), 0.98)}>
        <Suspense fallback={null}>
          <PerspectiveCamera makeDefault position={[0, 4, 8]} fov={50} />
          <ambientLight intensity={0.35} />
          <directionalLight position={[6, 8, 4]} intensity={1.1} color="#FF7BB6" />
          <SceneGroup wireframe={wireframe} />
          <OrbitControls enablePan={false} enableZoom={false} enableRotate={false} />
        </Suspense>
      </Canvas>
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-anthracite via-anthracite/40" />
      <div className="absolute inset-x-0 bottom-0 flex justify-end p-6">
        <button
          type="button"
          onClick={() => setWireframe((prev) => !prev)}
          className="pointer-events-auto rounded-full border border-white/10 bg-black/40 px-5 py-2 text-xs uppercase tracking-[0.2em] text-slate-200 transition hover:border-accent hover:text-accent"
          aria-pressed={wireframe}
        >
          {wireframe ? "Wireframe ON" : "Wireframe OFF"}
        </button>
      </div>
    </div>
  );
}
