"use client";

import { useState, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useAppStore } from "@/lib/store";
import AnimatedBackground from "@/components/AnimatedBackground";
import Sidebar from "@/components/Sidebar";
import DiscoverStep from "@/components/DiscoverStep";
import AnalyzeStep from "@/components/AnalyzeStep";
import DiscoveryChat from "@/components/DiscoveryChat";
import GeneratingScreen from "@/components/GeneratingScreen";
import ProposalDashboard from "@/components/ProposalDashboard";

const pageVariants = {
  initial: { opacity: 0, y: 16 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -16 },
};

const pageTransition = {
  duration: 0.35,
  ease: [0.16, 1, 0.3, 1] as const,
};

export default function Home() {
  const { step, error } = useAppStore();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 640);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  const sidebarWidth = isMobile ? 0 : sidebarCollapsed ? 68 : 240;

  return (
    <div className="relative min-h-screen">
      <AnimatedBackground />

      <Sidebar collapsed={sidebarCollapsed} setCollapsed={setSidebarCollapsed} />

      <main
        className="relative z-10 min-h-screen transition-all duration-300"
        style={{ paddingLeft: sidebarWidth }}
      >
        <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-6 rounded-xl border border-red-500/30 bg-red-500/10 px-5 py-3 text-sm text-red-400"
            >
              {error}
            </motion.div>
          )}

          <AnimatePresence mode="wait">
            {step === "discover" && (
              <motion.div key="discover" {...pageVariants} transition={pageTransition}>
                <DiscoverStep />
              </motion.div>
            )}
            {step === "analyze" && (
              <motion.div key="analyze" {...pageVariants} transition={pageTransition}>
                <AnalyzeStep />
              </motion.div>
            )}
            {step === "architect" && (
              <motion.div key="architect" {...pageVariants} transition={pageTransition}>
                <DiscoveryChat />
              </motion.div>
            )}
            {step === "generating" && (
              <motion.div key="generating" {...pageVariants} transition={pageTransition}>
                <GeneratingScreen />
              </motion.div>
            )}
            {step === "propose" && (
              <motion.div key="propose" {...pageVariants} transition={pageTransition}>
                <ProposalDashboard />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </main>
    </div>
  );
}
