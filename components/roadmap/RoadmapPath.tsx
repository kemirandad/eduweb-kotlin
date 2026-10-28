"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowDown, ArrowRight, Check, LockKeyhole, Sparkles } from "lucide-react";
import { roadmap } from "@/data/roadmap";
import { useRoadmapStore } from "@/lib/roadmap-store";

export function RoadmapPath() {
  const isUnlocked = useRoadmapStore((state) => state.isUnlocked);
  const isLevelComplete = useRoadmapStore((state) => state.isLevelComplete);
  const getCheckedCount = useRoadmapStore((state) => state.getCheckedCount);
  const [hydrated, setHydrated] = React.useState(false);

  React.useEffect(() => setHydrated(true), []);

  return (
    <div className="mx-auto max-w-[1100px]">
      <section className="edge-card glass-panel relative mb-8 overflow-hidden rounded-[28px] p-6 md:p-8">
        <div className="pointer-events-none absolute -right-14 -top-20 h-64 w-64 rounded-full bg-ferxxo-green/[0.08] blur-[70px]" />
        <div className="relative flex flex-col justify-between gap-6 lg:flex-row lg:items-end">
          <div className="max-w-xl">
            <p className="mb-3 inline-flex items-center gap-2 rounded-full border border-ferxxo-green/20 bg-ferxxo-green/[0.07] px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.16em] text-ferxxo-green"><Sparkles size={13} /> Roadmap Android Senior</p>
            <h2 className="font-heading text-3xl font-bold leading-tight md:text-4xl">Tu camino. <span className="text-ferxxo-green">Tu ritmo.</span></h2>
            <p className="mt-3 max-w-lg text-sm leading-6 text-text-secondary">15 niveles desde preparar tu entorno hasta defender decisiones de arquitectura ante un cliente. Cada paso se gana con evidencia.</p>
          </div>
          <div className="grid grid-cols-2 gap-3 lg:min-w-[300px]">
            <div className="rounded-2xl border border-white/[0.07] bg-black/20 p-4"><p className="text-[10px] uppercase tracking-[0.16em] text-text-secondary">Niveles listos</p><p className="mt-1 font-heading text-2xl font-bold">{hydrated ? roadmap.filter((level) => isLevelComplete(level.id)).length : 0}<span className="ml-1 text-sm font-medium text-text-secondary">/ 15</span></p></div>
            <div className="rounded-2xl border border-white/[0.07] bg-black/20 p-4"><p className="text-[10px] uppercase tracking-[0.16em] text-text-secondary">Próximo checkpoint</p><p className="mt-1 font-heading text-lg font-bold text-ferxxo-green">{hydrated ? `${roadmap.find((level) => isUnlocked(level.id) && !isLevelComplete(level.id))?.id ?? 14} · desbloqueado` : "Cargando…"}</p></div>
          </div>
        </div>
      </section>

      <div className="mb-4 flex items-end justify-between">
        <div><p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-text-secondary">La ruta completa</p><h3 className="mt-1 font-heading text-xl font-bold">15 checkpoints</h3></div>
        <span className="hidden text-xs text-text-secondary sm:block">Desbloquea el siguiente al completar checklist + proyecto</span>
      </div>

      <div className="relative space-y-3">
        <div className="absolute bottom-5 left-[27px] top-5 w-px bg-gradient-to-b from-ferxxo-green/50 via-white/[0.08] to-transparent md:left-[34px]" />
        {roadmap.map((level, index) => {
          const unlocked = hydrated && isUnlocked(level.id);
          const complete = hydrated && isLevelComplete(level.id);
          const active = unlocked && !complete;
          const checked = hydrated ? getCheckedCount(level.id) : 0;
          return (
            <motion.div key={level.id} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: Math.min(index * 0.035, 0.45) }}>
              <Link href={unlocked ? `/roadmap/${level.id}` : "#locked"} aria-disabled={!unlocked} onClick={(event) => { if (!unlocked) event.preventDefault(); }} className={`group relative grid grid-cols-[56px_1fr_auto] items-center gap-3 rounded-[20px] border p-3.5 transition-all md:grid-cols-[68px_1fr_auto] md:gap-5 md:p-4 ${active ? "edge-card glass-panel border-ferxxo-green/20 hover:-translate-y-0.5 hover:border-ferxxo-green/45 hover:shadow-neon-sm" : complete ? "border-ferxxo-green/15 bg-ferxxo-green/[0.035]" : "border-white/[0.045] bg-white/[0.015] opacity-55"}`}>
                <div className={`relative z-10 flex h-11 w-11 items-center justify-center rounded-2xl border text-sm font-bold md:h-[52px] md:w-[52px] ${complete ? "border-ferxxo-green/40 bg-ferxxo-green text-black" : active ? "border-ferxxo-green/30 bg-[#10251a] text-ferxxo-green shadow-[0_0_24px_rgb(0_255_127_/_0.12)]" : "border-white/[0.08] bg-bg-surface text-white/35"}`}>
                  {complete ? <Check size={19} strokeWidth={3} /> : unlocked ? String(level.id).padStart(2, "0") : <LockKeyhole size={16} />}
                </div>
                <div className="min-w-0 py-1">
                  <div className="mb-1 flex flex-wrap items-center gap-2"><span className={`text-[9px] font-bold uppercase tracking-[0.16em] ${active ? "text-ferxxo-green" : "text-text-secondary"}`}>{level.category} · NIVEL {String(level.id).padStart(2, "0")}</span>{active && <span className="rounded-full bg-ferxxo-green/10 px-2 py-0.5 text-[9px] font-semibold text-ferxxo-green">EN CURSO</span>}</div>
                  <h4 className={`truncate font-heading text-sm font-bold md:text-base ${unlocked ? "text-text-primary" : "text-text-secondary"}`}>{level.title}</h4>
                  <p className="mt-1 hidden max-w-2xl truncate text-xs text-text-secondary sm:block">{level.summary}</p>
                  {active && <div className="mt-2 flex items-center gap-2"><div className="h-1 w-24 overflow-hidden rounded-full bg-white/[0.08]"><div className="h-full rounded-full bg-ferxxo-green" style={{ width: `${level.checklist.length ? (checked / level.checklist.length) * 100 : 0}%` }} /></div><span className="text-[10px] text-text-secondary">{checked}/{level.checklist.length} checklist</span></div>}
                </div>
                <div className="flex items-center gap-2 pr-1 text-right">
                  <span className="hidden text-[10px] text-text-secondary sm:block">{level.duration}</span>
                  {unlocked ? <ArrowRight size={16} className={`transition group-hover:translate-x-1 ${complete ? "text-ferxxo-green" : "text-text-secondary group-hover:text-ferxxo-green"}`} /> : <span className="hidden text-[10px] text-white/30 sm:block">Bloqueado</span>}
                </div>
              </Link>
              {index < roadmap.length - 1 && index % 2 === 0 && <div className="relative z-10 ml-[20px] flex h-3 items-center text-white/20 md:ml-[25px]"><ArrowDown size={12} /></div>}
            </motion.div>
          );
        })}
      </div>
      <p className="mt-7 text-center text-[11px] leading-5 text-text-secondary">El progreso se sincroniza con PostgreSQL cuando la base de datos está disponible; la interfaz conserva una copia local para seguir trabajando.</p>
    </div>
  );
}

