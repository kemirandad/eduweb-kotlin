"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { roadmap } from "@/data/roadmap";
import { useRoadmapStore } from "@/lib/roadmap-store";

const primaryLinks = [
  { label: "Overview", href: "/", icon: "◫" },
  { label: "Roadmap", href: "/roadmap", icon: "⌁" },
  { label: "Code Lab", href: "/code", icon: "⌘" },
  { label: "My notes", href: "/notes", icon: "▤" },
];

export function Sidebar() {
  const pathname = usePathname();
  const isUnlocked = useRoadmapStore((state) => state.isUnlocked);
  const isLevelComplete = useRoadmapStore((state) => state.isLevelComplete);
  const completedCount = useRoadmapStore((state) => roadmap.filter((level) => state.isLevelComplete(level.id)).length);
  const [hydrated, setHydrated] = useState(false);
  useEffect(() => setHydrated(true), []);
  const currentLevel = hydrated ? roadmap.find((level) => isUnlocked(level.id) && !isLevelComplete(level.id))?.id ?? 14 : 0;

  return (
    <motion.aside
      initial={{ x: -18, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ duration: 0.45, ease: "easeOut" }}
      className="glass-panel fixed inset-y-3 left-3 z-40 hidden w-[258px] flex-col overflow-hidden rounded-[26px] lg:flex"
    >
      <div className="flex items-center gap-3 px-6 pb-7 pt-6">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-ferxxo-green text-lg font-bold text-black shadow-neon-sm">K</div>
        <div>
          <p className="font-heading text-sm font-bold tracking-tight text-text-primary">KOTLIN<span className="text-ferxxo-green">/</span>UP</p>
          <p className="mt-0.5 text-[10px] font-semibold uppercase tracking-[0.2em] text-text-secondary">Android senior path</p>
        </div>
      </div>

      <div className="mx-5 mb-5 rounded-2xl border border-white/[0.07] bg-white/[0.025] p-3.5">
        <div className="mb-2.5 flex items-center justify-between text-[11px]">
          <span className="font-medium text-text-secondary">Tu camino</span>
          <span className="font-semibold text-ferxxo-green">{hydrated ? String(completedCount).padStart(2, "0") : "00"} <span className="text-text-secondary">/ 15</span></span>
        </div>
        <div className="h-1.5 overflow-hidden rounded-full bg-white/[0.08]">
          <div className="h-full rounded-full bg-ferxxo-green shadow-[0_0_12px_rgba(0,255,127,.55)] transition-all" style={{ width: `${(completedCount / roadmap.length) * 100}%` }} />
        </div>
      </div>

      <nav aria-label="Navegación principal" className="space-y-1 px-3">
        <p className="px-3 pb-2 text-[10px] font-semibold uppercase tracking-[0.18em] text-white/35">Workspace</p>
        {primaryLinks.map((link) => {
          const active = pathname === link.href || (link.href !== "/" && pathname.startsWith(link.href));
          return (
            <Link
              key={link.href}
              href={link.href}
              className={`group flex items-center gap-3 rounded-xl px-3 py-2.5 text-[13px] font-medium transition-all ${active ? "bg-ferxxo-green/[0.1] text-ferxxo-green shadow-[inset_2px_0_0_#00FF7F]" : "text-text-secondary hover:bg-white/[0.045] hover:text-text-primary"}`}
            >
              <span className="w-5 text-center text-base leading-none opacity-80">{link.icon}</span>
              {link.label}
              {link.label === "Code Lab" && <span className="ml-auto rounded-full bg-accent-purple/15 px-2 py-0.5 text-[9px] font-bold uppercase tracking-wide text-accent-purple">Beta</span>}
            </Link>
          );
        })}
      </nav>

      <div className="mt-8 px-3">
        <div className="mb-3 flex items-center justify-between px-3">
          <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-white/35">En progreso</p>
          <Link href="/roadmap" className="text-[10px] text-text-secondary transition hover:text-ferxxo-green">Ver todos ↗</Link>
        </div>
        <div className="space-y-1">
          {roadmap.slice(0, 3).map((level) => {
            const done = hydrated && isLevelComplete(level.id);
            const active = hydrated && level.id === currentLevel;
            const locked = hydrated && !isUnlocked(level.id);
            return <Link key={level.id} href={locked ? "/roadmap" : `/roadmap/${level.id}`} className="flex items-center gap-3 rounded-xl px-3 py-2 transition hover:bg-white/[0.04]">
              <span className={`flex h-7 w-7 items-center justify-center rounded-lg border text-[10px] font-bold ${done ? "border-ferxxo-green/30 bg-ferxxo-green/10 text-ferxxo-green" : active ? "border-ferxxo-green/25 bg-ferxxo-green text-black" : "border-white/[0.08] bg-white/[0.025] text-white/30"}`}>
                {done ? "✓" : locked ? "·" : String(level.id).padStart(2, "0")}
              </span>
              <span className={`truncate text-xs ${locked ? "text-white/35" : "text-text-secondary"}`}>{level.title}</span>
            </Link>
          })}
        </div>
      </div>

      <div className="mt-auto p-3">
        <div className="edge-card glass-panel rounded-2xl p-4">
          <div className="mb-2 flex items-center gap-2">
            <span className="flex h-6 w-6 items-center justify-center rounded-lg bg-accent-purple/15 text-xs text-accent-purple">✦</span>
            <span className="text-xs font-semibold text-text-primary">Racha de estudio</span>
          </div>
          <p className="font-heading text-2xl font-bold text-text-primary">4 <span className="text-sm font-medium text-text-secondary">días</span></p>
          <p className="mt-1 text-[10px] leading-relaxed text-text-secondary">Un paso constante te acerca a tu primer proyecto freelance.</p>
        </div>
        <button className="mt-3 flex w-full items-center gap-3 rounded-xl px-3 py-3 text-left transition hover:bg-white/[0.04]" type="button">
          <span className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-ferxxo-dark to-accent-purple/70 text-xs font-bold text-white">U</span>
          <span className="min-w-0 flex-1"><span className="block truncate text-xs font-semibold text-text-primary">Tu perfil</span><span className="block text-[10px] text-text-secondary">Docente · En formación</span></span>
          <span className="text-text-secondary">···</span>
        </button>
      </div>
    </motion.aside>
  );
}
