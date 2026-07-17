"use client";

import { motion } from "framer-motion";
import { ReactNode } from "react";

export default function GlassCard({
  children,
  className = "",
  hover = true,
  delay = 0,
}: {
  children: ReactNode;
  className?: string;
  hover?: boolean;
  delay?: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay, ease: [0.16, 1, 0.3, 1] }}
      whileHover={hover ? { y: -2, scale: 1.005 } : undefined}
      className={`glass-card p-6 ${className}`}
    >
      {children}
    </motion.div>
  );
}
