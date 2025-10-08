"use client";

import { motion, useInView, useReducedMotion } from "framer-motion";
import { useRef } from "react";
import type { HTMLAttributes } from "react";
import { motionConfig } from "@/lib/theme";

interface SectionRevealProps extends HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

export function SectionReveal({ children, className, ...rest }: SectionRevealProps) {
  const ref = useRef<HTMLDivElement | null>(null);
  const inView = useInView(ref, { once: true, amount: 0.2 });
  const shouldReduceMotion = useReducedMotion();

  return (
    <motion.div
      ref={ref}
      className={className}
      {...rest}
      initial={shouldReduceMotion ? { opacity: 1 } : { opacity: 0, y: 24, filter: "blur(6px)" }}
      animate={inView ? { opacity: 1, y: 0, filter: "blur(0px)" } : {}}
      transition={{ ...motionConfig.transition, delay: motionConfig.stagger }}
    >
      {children}
    </motion.div>
  );
}
