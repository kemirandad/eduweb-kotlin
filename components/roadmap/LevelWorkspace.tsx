"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { ArrowLeft, ArrowRight, BadgeCheck, BookOpen, Check, Circle, Clock3, LockKeyhole, Sparkles } from "lucide-react";
import { DashboardLayout } from "@/components/DashboardLayout";
import { CodeEditor } from "@/components/editor/CodeEditor";
import { MentorPanel } from "@/components/mentor/MentorPanel";
import { roadmap } from "@/data/roadmap";
import { useRoadmapStore, type ReviewState } from "@/lib/roadmap-store";

type LevelWorkspaceProps = { levelId: number };
const EMPTY_CHECKS: boolean[] = [];

export function LevelWorkspace({ levelId }: LevelWorkspaceProps) {
  const level = roadmap.find((item) => item.id === levelId);
  const [hydrated, setHydrated] = useState(false);
  const checks = useRoadmapStore((state) => state.checks[levelId] ?? EMPTY_CHECKS);
  const review: ReviewState = useRoadmapStore((state) => state.reviews[levelId] ?? "not-submitted");
  const toggleCheck = useRoadmapStore((state) => state.toggleCheck);
  const getCheckedCount = useRoadmapStore((state) => state.getCheckedCount);
  const isUnlocked = useRoadmapStore((state) => state.isUnlocked);
  const isLevelComplete = useRoadmapStore((state) => state.isLevelComplete);

  useEffect(() => setHydrated(true), []);

  const checkedCount = hydrated ? getCheckedCount(levelId) : 0;
  const checklistComplete = Boolean(level && checkedCount === level.checklist.length);
  const unlocked = hydrated && isUnlocked(levelId);
  const complete = hydrated && isLevelComplete(levelId);
  const progress = useMemo(() => level ? Math.round((checkedCount / level.checklist.length) * 100) : 0, [checkedCount, level]);

  if (!level) return <DashboardLayout eyebrow="ROADMAP" title="Nivel no encontrado"><p className="text-text-secondary">No existe ese nivel.</p><Link href="/roadmap" className="mt-4 inline-flex text-ferxxo-green">Volver al roadmap</Link></DashboardLayout>;

  if (hydrated && !unlocked) {
    return <DashboardLayout eyebrow={`NIVEL ${String(level.id).padStart(2, "0")}`} title={level.title}><div className="mx-auto mt-10 max-w-xl rounded-3xl border border-white/[0.08] bg-bg-surface p-8 text-center"><LockKeyhole className="mx-auto text-text-secondary" size={30} /><h2 className="mt-4 font-heading text-xl font-bold">Este checkpoint sigue bloqueado</h2><p className="mt-2 text-sm leading-6 text-text-secondary">Completa el checklist y consigue la aprobación del proyecto del nivel {level.id - 1} para continuar.</p><Link href="/roadmap" className="mt-6 inline-flex rounded-xl bg-ferxxo-green px-4 py-2.5 text-xs font-bold text-black">Volver al camino</Link></div></DashboardLayout>;
  }

  return (
    <DashboardLayout eyebrow={`NIVEL ${String(level.id).padStart(2, "0")} · ${level.category.toUpperCase()}`} title={level.title}>
      <div className="mx-auto max-w-[1100px]">
        <Link href="/roadmap" className="mb-5 inline-flex items-center gap-2 text-xs text-text-secondary transition hover:text-ferxxo-green"><ArrowLeft size={14} /> Todos los niveles</Link>
        <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_280px]">
          <div className="space-y-5">
            <section className="edge-card glass-panel overflow-hidden rounded-[24px] p-5 md:p-7">
              <div className="flex flex-wrap items-start justify-between gap-4"><div className="max-w-2xl"><div className="mb-3 flex flex-wrap items-center gap-2"><span className="rounded-full border border-ferxxo-green/20 bg-ferxxo-green/[0.07] px-2.5 py-1 text-[9px] font-bold uppercase tracking-[0.14em] text-ferxxo-green">Checkpoint {String(level.id).padStart(2, "0")}</span><span className="inline-flex items-center gap-1 text-[10px] text-text-secondary"><Clock3 size={12} /> {level.duration}</span></div><h2 className="font-heading text-xl font-bold leading-snug md:text-2xl">{level.title}</h2><p className="mt-2 max-w-xl text-sm leading-6 text-text-secondary">{level.summary}</p></div><div className="rounded-2xl border border-ferxxo-green/15 bg-ferxxo-green/[0.04] px-4 py-3"><p className="text-[9px] font-semibold uppercase tracking-[0.16em] text-text-secondary">Checklist</p><p className="mt-1 font-heading text-xl font-bold text-ferxxo-green">{checkedCount}<span className="text-sm text-text-secondary">/{level.checklist.length}</span></p></div></div>
              <div className="mt-5 h-1.5 overflow-hidden rounded-full bg-white/[0.07]"><div className="h-full rounded-full bg-ferxxo-green shadow-neon-sm transition-all duration-500" style={{ width: `${progress}%` }} /></div>
            </section>

            <section className="glass-panel rounded-[24px] p-5 md:p-6">
              <div className="mb-4 flex items-center gap-3"><span className="flex h-9 w-9 items-center justify-center rounded-xl bg-accent-purple/10 text-accent-purple"><BookOpen size={17} /></span><div><h3 className="font-heading text-sm font-bold">Teoría clave</h3><p className="text-[10px] text-text-secondary">Basado en el Roadmap Android Kotlin Senior</p></div></div>
              <div className="grid gap-2 sm:grid-cols-2">{level.theory.map((topic, index) => <div key={topic} className="flex items-start gap-3 rounded-xl border border-white/[0.05] bg-white/[0.02] p-3"><span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-md bg-white/[0.06] text-[9px] font-bold text-text-secondary">{String(index + 1).padStart(2, "0")}</span><p className="text-xs leading-5 text-text-secondary">{topic}</p></div>)}</div>
            </section>

            <section className="glass-panel rounded-[24px] p-5 md:p-6">
              <div className="mb-4 flex items-center justify-between gap-3"><div className="flex items-center gap-3"><span className="flex h-9 w-9 items-center justify-center rounded-xl bg-ferxxo-green/10 text-ferxxo-green"><Check size={17} /></span><div><h3 className="font-heading text-sm font-bold">Checklist de dominio</h3><p className="text-[10px] text-text-secondary">Marca cada objetivo cuando puedas demostrarlo.</p></div></div><span className="text-[10px] font-semibold text-ferxxo-green">{checkedCount}/{level.checklist.length}</span></div>
              <div className="space-y-2">{level.checklist.map((item, index) => { const checked = checks[index] ?? false; return <button key={item} type="button" onClick={() => toggleCheck(level.id, index)} className={`flex w-full items-start gap-3 rounded-xl border p-3.5 text-left transition ${checked ? "border-ferxxo-green/20 bg-ferxxo-green/[0.045]" : "border-white/[0.055] bg-white/[0.015] hover:border-white/[0.12]"}`}><span className={`mt-0.5 flex h-[18px] w-[18px] shrink-0 items-center justify-center rounded-md border ${checked ? "border-ferxxo-green bg-ferxxo-green text-black" : "border-white/20 text-transparent"}`}>{checked ? <Check size={12} strokeWidth={3} /> : <Circle size={12} />}</span><span className={`text-xs leading-5 ${checked ? "text-text-primary" : "text-text-secondary"}`}>{item}</span></button>; })}</div>
            </section>

            <section className="edge-card glass-panel rounded-[24px] p-5 md:p-6">
              <div className="mb-4 flex items-center gap-3"><span className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#ffcc66]/10 text-[#ffcc66]"><BadgeCheck size={17} /></span><div><h3 className="font-heading text-sm font-bold">Proyecto obligatorio</h3><p className="text-[10px] text-text-secondary">Entrega evidencia y solicita revisión para desbloquear el próximo nivel.</p></div></div>
              <p className="rounded-xl border border-white/[0.05] bg-black/20 p-4 text-xs leading-6 text-text-secondary">{level.project}</p>
              <div className="mt-4 flex items-center justify-between gap-3 rounded-xl border border-white/[0.06] bg-white/[0.02] p-4"><div className="min-w-0"><p className="text-[9px] font-bold uppercase tracking-[0.14em] text-text-secondary">Estado de revisión</p><p className={`mt-1 text-xs font-semibold ${review === "approved" ? "text-ferxxo-green" : review === "needs-work" ? "text-accent-purple" : "text-text-primary"}`}>{review === "approved" ? "Aprobado por el mentor IA" : review === "needs-work" ? "Requiere ajustes según el mentor" : "Aún no enviado al mentor"}</p></div>{review === "approved" && <span className="inline-flex h-8 shrink-0 items-center gap-1.5 rounded-lg bg-ferxxo-green/10 px-3 text-[10px] font-bold text-ferxxo-green"><Check size={13} /> Aprobado</span>}</div>
            </section>

            <section className="glass-panel rounded-[24px] p-5 md:p-6"><div className="mb-3 flex items-center gap-3"><span className="flex h-9 w-9 items-center justify-center rounded-xl bg-accent-purple/10 text-accent-purple"><Sparkles size={17} /></span><div><h3 className="font-heading text-sm font-bold">Desafío de profundización</h3><p className="text-[10px] text-text-secondary">Después de completar el proyecto</p></div></div><p className="rounded-xl border border-white/[0.05] bg-white/[0.02] p-4 text-xs leading-6 text-text-secondary">{level.challenge}</p></section>

            <CodeEditor key={level.id} level={level} />
            <MentorPanel level={level} />

            {complete && level.id < roadmap.length - 1 && <Link href={`/roadmap/${level.id + 1}`} className="flex items-center justify-between rounded-2xl border border-ferxxo-green/25 bg-ferxxo-green/[0.07] p-4 transition hover:bg-ferxxo-green/[0.11]"><span><span className="block text-[9px] font-bold uppercase tracking-[0.15em] text-ferxxo-green">Siguiente checkpoint desbloqueado</span><span className="mt-1 block font-heading text-sm font-bold">Nivel {String(level.id + 1).padStart(2, "0")} · {roadmap[level.id + 1].title}</span></span><ArrowRight className="text-ferxxo-green" size={18} /></Link>}
            {complete && level.id === roadmap.length - 1 && <div className="rounded-2xl border border-ferxxo-green/25 bg-ferxxo-green/[0.07] p-5 text-center"><Sparkles className="mx-auto text-ferxxo-green" size={22} /><p className="mt-2 font-heading font-bold">Roadmap completado</p><p className="mt-1 text-xs text-text-secondary">Ahora empieza el aprendizaje continuo de nivel senior.</p></div>}
          </div>

          <aside className="space-y-4 lg:sticky lg:top-6 lg:self-start">
            <div className="glass-panel rounded-[22px] p-5"><p className="text-[9px] font-bold uppercase tracking-[0.18em] text-text-secondary">Ritmo recomendado</p><p className="mt-2 font-heading text-lg font-bold">{level.duration}</p><p className="mt-2 text-xs leading-5 text-text-secondary">Bloques cortos y constantes. Explica cada concepto con tus propias palabras antes de marcarlo.</p><div className="mt-4 h-px bg-white/[0.07]" /><p className="mt-4 text-[10px] font-semibold text-ferxxo-green">Un paso consistente por día cuenta.</p></div>
            <div className="glass-panel rounded-[22px] p-5"><p className="text-[9px] font-bold uppercase tracking-[0.18em] text-text-secondary">Gate de avance</p><div className="mt-4 space-y-3"><div className="flex items-start gap-2.5"><span className={`mt-0.5 flex h-5 w-5 items-center justify-center rounded-full ${checklistComplete ? "bg-ferxxo-green text-black" : "bg-white/[0.07] text-text-secondary"}`}>{checklistComplete ? <Check size={12} /> : <span className="text-[9px]">1</span>}</span><div><p className="text-[11px] font-semibold">Checklist completo</p><p className="mt-0.5 text-[10px] text-text-secondary">{checkedCount}/{level.checklist.length} objetivos</p></div></div><div className="flex items-start gap-2.5"><span className={`mt-0.5 flex h-5 w-5 items-center justify-center rounded-full ${review === "approved" ? "bg-ferxxo-green text-black" : "bg-white/[0.07] text-text-secondary"}`}>{review === "approved" ? <Check size={12} /> : <span className="text-[9px]">2</span>}</span><div><p className="text-[11px] font-semibold">Proyecto aprobado</p><p className="mt-0.5 text-[10px] text-text-secondary">{review === "approved" ? "Aprobado por IA" : "Pendiente"}</p></div></div></div></div>
            <div className="rounded-[22px] border border-accent-purple/20 bg-accent-purple/[0.07] p-5"><div className="mb-2 flex items-center gap-2 text-accent-purple"><Sparkles size={14} /><p className="text-[9px] font-bold uppercase tracking-[0.16em]">Mentor IA</p></div><p className="text-xs leading-5 text-text-secondary">Comparte tu evidencia y el código. El mentor identifica puntos a revisar y te guía con preguntas sin entregarte la solución.</p></div>
          </aside>
        </div>
      </div>
    </DashboardLayout>
  );
}
