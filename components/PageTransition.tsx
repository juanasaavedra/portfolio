"use client";

import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { useEffect, useState } from "react";
import { motionConfig, theme } from "@/lib/theme";

interface PageTransitionProps {
  activeKey: string;
}

export function PageTransition({ activeKey }: PageTransitionProps) {
  const shouldReduceMotion = useReducedMotion();
  const [keys, setKeys] = useState<string[]>([activeKey]);

  useEffect(() => {
    setKeys((prev) => (prev.includes(activeKey) ? prev : [...prev, activeKey]));
  }, [activeKey]);

  if (shouldReduceMotion) {
    return null;
  }

  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 z-40 overflow-hidden">
      <AnimatePresence mode="wait">
        {keys.map((key) => (
          <motion.div
            key={key}
            initial={{ clipPath: "circle(120% at 50% 50%)" }}
            animate={{ clipPath: "circle(0% at 50% 50%)" }}
            exit={{ clipPath: "circle(130% at 50% 50%)" }}
            transition={motionConfig.transition}
            onAnimationComplete={() => {
              setKeys((current) => (current[current.length - 1] === key ? [key] : current.filter((k) => k !== key)));
            }}
            className="absolute inset-0"
            style={{
              background: `radial-gradient(circle at 50% 50%, ${theme.accent}33, transparent 55%), linear-gradient(135deg, rgba(20,20,24,0.92), rgba(20,20,24,0.8))`,
            }}
          />
        ))}
      </AnimatePresence>
    </div>
  );
}
