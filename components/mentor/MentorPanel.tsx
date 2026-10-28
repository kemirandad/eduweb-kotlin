"use client";

import { useState, type FormEvent } from "react";
import { AlertCircle, Bot, CheckCircle2, LoaderCircle, MessageCircleQuestion, Send, ShieldCheck } from "lucide-react";
import type { RoadmapLevel } from "@/data/roadmap";
import { useRoadmapStore } from "@/lib/roadmap-store";
import type { MentorFeedback } from "@/lib/progress";

export function MentorPanel({ level }: { level: RoadmapLevel }) {
  const [code, setCode] = useState("");
  const [evidence, setEvidence] = useState("");
  const [question, setQuestion] = useState("");
  const [feedback, setFeedback] = useState<MentorFeedback | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const previousReview = useRoadmapStore((state) => state.latestReviews[level.id]);
  const hydrateFromServer = useRoadmapStore((state) => state.hydrateFromServer);

  async function askMentor(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setFeedback(null);
    setBusy(true);
    try {
      const response = await fetch("/api/mentor/review", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ levelId: level.id, code, evidence, question }),
      });
      const payload = await response.json();
      if (!response.ok) throw new Error(payload.error ?? "El mentor no pudo revisar la entrega.");
      setFeedback(payload.review as MentorFeedback);
      hydrateFromServer(payload.progress);
      setQuestion("");
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "No fue posible contactar al mentor.");
    } finally {
      setBusy(false);
    }
  }

  const visibleFeedback = feedback ?? previousReview ?? null;

  return (
    <section className="edge-card glass-panel overflow-hidden rounded-[24px]">
      <div className="flex items-center gap-3 border-b border-white/[0.07] px-5 py-4">
        <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-accent-purple/15 text-accent-purple"><Bot size={18} /></span>
        <div className="min-w-0 flex-1"><h3 className="font-heading text-sm font-bold">Mentor socrático</h3><p className="text-[10px] text-text-secondary">Revisión de proyecto y preguntas guiadas · Nivel {level.id}</p></div>
        <span className="hidden items-center gap-1.5 rounded-full border border-ferxxo-green/15 bg-ferxxo-green/[0.05] px-2.5 py-1 text-[9px] text-ferxxo-green sm:inline-flex"><ShieldCheck size={11} /> No da la solución completa</span>
      </div>

      <form onSubmit={askMentor} className="space-y-3 p-5">
        <label className="block"><span className="mb-1.5 block text-[10px] font-semibold text-text-secondary">Tu pregunta <span className="font-normal">(opcional)</span></span><textarea value={question} onChange={(event) => setQuestion(event.target.value)} maxLength={1000} rows={2} placeholder="¿Qué parte del null safety debería revisar en esta función?" className="w-full resize-y rounded-xl border border-white/[0.08] bg-black/25 px-3 py-2.5 text-xs leading-5 text-text-primary outline-none placeholder:text-white/25 focus:border-accent-purple/50" /></label>
        <label className="block"><span className="mb-1.5 block text-[10px] font-semibold text-text-secondary">Evidencia del proyecto</span><textarea value={evidence} onChange={(event) => setEvidence(event.target.value)} maxLength={5000} rows={3} placeholder="Describe qué construiste y cómo verificaste que cumple los requisitos del proyecto…" className="w-full resize-y rounded-xl border border-white/[0.08] bg-black/25 px-3 py-2.5 text-xs leading-5 text-text-primary outline-none placeholder:text-white/25 focus:border-accent-purple/50" /></label>
        <label className="block"><span className="mb-1.5 block text-[10px] font-semibold text-text-secondary">Código Kotlin / Compose <span className="font-normal">(opcional si ya explicaste evidencia)</span></span><textarea value={code} onChange={(event) => setCode(event.target.value)} maxLength={40000} rows={8} spellCheck={false} placeholder={'fun main() {\n    // Pega aquí la parte relevante de tu solución\n}'} className="w-full resize-y rounded-xl border border-white/[0.08] bg-[#080b09] px-3 py-3 font-mono text-[11px] leading-5 text-[#baf7d2] outline-none placeholder:text-white/25 focus:border-ferxxo-dark" /></label>
        {error && <div role="alert" className="flex items-start gap-2 rounded-xl border border-red-400/20 bg-red-400/[0.06] p-3 text-[11px] leading-5 text-red-200"><AlertCircle size={14} className="mt-0.5 shrink-0" />{error}</div>}
        <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center"><p className="max-w-xl text-[10px] leading-4 text-text-secondary">El código, la evidencia y la pregunta se envían al proveedor de IA configurado para generar esta revisión. La respuesta se guarda con tu progreso en PostgreSQL.</p><button type="submit" disabled={busy} className="inline-flex h-10 shrink-0 items-center justify-center gap-2 rounded-xl bg-ferxxo-green px-4 text-xs font-bold text-black transition hover:bg-[#28ff98] disabled:cursor-wait disabled:opacity-60">{busy ? <><LoaderCircle size={14} className="animate-spin" /> Revisando…</> : <><Send size={13} /> Enviar al mentor</>}</button></div>
      </form>

      {visibleFeedback && <div aria-live="polite" className={`border-t p-5 ${visibleFeedback.approved ? "border-ferxxo-green/15 bg-ferxxo-green/[0.025]" : "border-accent-purple/15 bg-accent-purple/[0.025]"}`}>
        <div className="flex items-start gap-3"><span className={`mt-0.5 ${visibleFeedback.approved ? "text-ferxxo-green" : "text-accent-purple"}`}>{visibleFeedback.approved ? <CheckCircle2 size={17} /> : <MessageCircleQuestion size={17} />}</span><div className="min-w-0 flex-1"><div className="flex flex-wrap items-center gap-2"><p className="text-xs font-bold text-text-primary">{visibleFeedback.approved ? "Proyecto aprobado" : "Sigue iterando"}</p>{!feedback && <span className="text-[9px] text-text-secondary">Última revisión guardada</span>}</div><p className="mt-1 text-xs leading-5 text-text-secondary">{visibleFeedback.summary}</p><p className="mt-3 text-xs leading-5 text-text-primary">{visibleFeedback.feedback}</p>
          {visibleFeedback.observations.length > 0 && <ul className="mt-3 space-y-1.5">{visibleFeedback.observations.map((item, index) => <li key={`${index}-${item}`} className="text-[11px] leading-5 text-text-secondary">• {item}</li>)}</ul>}
          {visibleFeedback.questions.length > 0 && <div className="mt-3 rounded-xl border border-accent-purple/15 bg-accent-purple/[0.06] p-3"><p className="mb-1.5 text-[9px] font-bold uppercase tracking-[0.14em] text-accent-purple">Piensa en esto</p><ul className="space-y-1.5">{visibleFeedback.questions.map((item, index) => <li key={`${index}-${item}`} className="text-[11px] leading-5 text-text-primary">{item}</li>)}</ul></div>}
          <p className="mt-3 text-[10px] leading-5 text-ferxxo-green">Siguiente paso: {visibleFeedback.nextStep}</p></div></div>
      </div>}
    </section>
  );
}
