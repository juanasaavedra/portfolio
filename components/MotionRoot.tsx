"use client";

import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { usePathname } from "next/navigation";
import { ReactNode } from "react";
import { motionConfig } from "@/lib/theme";
import { PageTransition } from "./PageTransition";

export function MotionRoot({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const shouldReduceMotion = useReducedMotion();

  return (
    <>
      <PageTransition activeKey={pathname} />
      <AnimatePresence mode="wait" initial={!shouldReduceMotion}>
        <motion.main
          key={pathname}
          initial={shouldReduceMotion ? { opacity: 1 } : { opacity: 0, y: 24, filter: "blur(6px)" }}
          animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          exit={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, y: -24, filter: "blur(6px)" }}
          transition={{ ...motionConfig.transition, staggerChildren: motionConfig.stagger }}
          className="relative z-10"
        >
          {children}
        </motion.main>
      </AnimatePresence>
    </>
  );
}
