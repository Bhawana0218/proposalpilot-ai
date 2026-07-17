"use client";

import { Step, useAppStore } from "@/lib/store";
import {
  Compass,
  BarChart3,
  Layers,
  FileText,
  Plus,
  History,
  ChevronLeft,
  ChevronRight,
  Menu,
  X,
} from "lucide-react";
import { useState, useEffect } from "react";

const NAV_ITEMS: { key: Step; label: string; icon: typeof Compass }[] = [
  { key: "discover", label: "Discover", icon: Compass },
  { key: "analyze", label: "Analyze", icon: BarChart3 },
  { key: "architect", label: "Architect", icon: Layers },
  { key: "propose", label: "Proposal", icon: FileText },
];

export default function Sidebar({
  collapsed,
  setCollapsed,
}: {
  collapsed: boolean;
  setCollapsed: (v: boolean) => void;
}) {
  const { step, setStep, reset, proposal } = useAppStore();
  const currentIdx = NAV_ITEMS.findIndex((n) => n.key === step);
  const [mobileOpen, setMobileOpen] = useState(false);

  // Close mobile sidebar on step change
  useEffect(() => {
    setMobileOpen(false);
  }, [step]);

  return (
    <>
      {/* Mobile hamburger */}
      <button
        onClick={() => setMobileOpen(!mobileOpen)}
        className="fixed left-4 top-4 z-50 flex h-10 w-10 items-center justify-center rounded-xl glass sm:hidden"
      >
        {mobileOpen ? <X size={20} className="text-white" /> : <Menu size={20} className="text-white" />}
      </button>

      {/* Mobile overlay */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-30 bg-black/50 backdrop-blur-sm sm:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed left-0 top-0 z-40 flex h-screen flex-col border-r border-white/[0.06] glass transition-all duration-300 ${
          collapsed ? "w-[68px]" : "w-[240px]"
        } ${mobileOpen ? "translate-x-0" : "-translate-x-full sm:translate-x-0"}`}
      >
        {/* Logo */}
        <div className="flex h-16 items-center gap-3 border-b border-white/[0.06] px-4">
          <img
            src="/favicon.ico"
            alt="NexGeTech"
            className="h-9 w-9 shrink-0 rounded-lg object-cover"
          />
          {!collapsed && (
            <span className="font-display text-sm font-semibold text-white">
              NexGeTech
            </span>
          )}
        </div>

        {/* New Proposal */}
        <div className="px-3 pt-4 pb-2">
          <button
            onClick={() => { reset(); setMobileOpen(false); }}
            className={`flex w-full items-center gap-2 rounded-xl bg-gradient-to-r from-cyan-500/20 to-indigo-500/20 px-3 py-2.5 text-sm font-medium text-cyan-400 transition-all hover:from-cyan-500/30 hover:to-indigo-500/30 ${
              collapsed ? "justify-center" : ""
            }`}
          >
            <Plus size={18} />
            {!collapsed && <span>New Proposal</span>}
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 space-y-1 px-3 py-4">
          {NAV_ITEMS.map((item, i) => {
            const Icon = item.icon;
            const isActive = item.key === step;
            const isPast = currentIdx > -1 && i < currentIdx;

            return (
              <button
                key={item.key}
                onClick={() => {
                  if (isPast || (item.key === "propose" && proposal)) {
                    setStep(item.key);
                    setMobileOpen(false);
                  }
                }}
                className={`flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all ${
                  collapsed ? "justify-center" : ""
                } ${
                  isActive
                    ? "bg-white/[0.08] text-white shadow-glow"
                    : isPast
                    ? "text-cyan-400 hover:bg-white/[0.04]"
                    : "text-slate-600 cursor-not-allowed"
                }`}
              >
                <Icon size={18} />
                {!collapsed && <span>{item.label}</span>}
                {!collapsed && isActive && (
                  <div className="ml-auto h-1.5 w-1.5 rounded-full bg-cyan-400" />
                )}
              </button>
            );
          })}
        </nav>

        {/* Collapse toggle (desktop only) */}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="hidden sm:flex h-12 items-center justify-center border-t border-white/[0.06] text-slate-500 transition-colors hover:text-slate-300"
        >
          {collapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
        </button>
      </aside>
    </>
  );
}
