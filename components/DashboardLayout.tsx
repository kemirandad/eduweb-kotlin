"use client";

import type { ReactNode } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Sidebar } from "./Sidebar";
import { ProgressSync } from "@/components/roadmap/ProgressSync";
import { useRoadmapStore } from "@/lib/roadmap-store";

type DashboardLayoutProps = {
  children: ReactNode;
  eyebrow?: string;
  title?: string;
};

export function DashboardLayout({ children, eyebrow = "TU ESPACIO DE APRENDIZAJE", title = "Dashboard" }: DashboardLayoutProps) {
  const syncStatus = useRoadmapStore((state) => state.syncStatus);
  return (
    <div className="min-h-screen overflow-x-hidden bg-bg-base text-text-primary">
      <div className="pointer-events-none fixed inset-0 bg-green-glow opacity-80" />
      <div className="pointer-events-none fixed -right-48 top-[-15rem] h-[34rem] w-[34rem] rounded-full bg-accent-purple/[0.055] blur-[120px]" />
      <Sidebar />
      <ProgressSync />
      <div className="relative z-30 flex items-center justify-between border-b border-white/[0.07] px-5 py-3 lg:hidden">
        <Link href="/" className="font-heading text-sm font-bold tracking-tight">KOTLIN<span className="text-ferxxo-green">/</span>UP</Link>
        <nav aria-label="Navegación móvil" className="flex gap-4 text-[11px] text-text-secondary">
          <Link href="/" className="hover:text-ferxxo-green">Inicio</Link>
          <Link href="/roadmap" className="hover:text-ferxxo-green">Roadmap</Link>
          <Link href="/code" className="hover:text-ferxxo-green">Code Lab</Link>
        </nav>
      </div>
      <main className="relative min-h-screen pl-0 lg:pl-[282px]">
        <header className="flex items-center justify-between px-6 pb-5 pt-7 md:px-10 md:pt-9">
          <div>
            <p className="mb-2 text-[10px] font-semibold uppercase tracking-[0.2em] text-ferxxo-green">{eyebrow}</p>
            <h1 className="font-heading text-2xl font-bold tracking-tight md:text-[32px]">{title}</h1>
          </div>
          <div className="flex items-center gap-3">
            <div className="hidden items-center gap-2 rounded-full border border-white/[0.08] bg-white/[0.025] px-3 py-2 text-[11px] text-text-secondary sm:flex">
              <span className={`h-1.5 w-1.5 rounded-full ${syncStatus === "connected" ? "bg-ferxxo-green shadow-[0_0_8px_#00FF7F]" : syncStatus === "offline" ? "bg-amber-400" : "animate-pulse bg-white/40"}`} />
              {syncStatus === "connected" ? "PostgreSQL conectado" : syncStatus === "offline" ? "Sin sincronía" : "Conectando…"}
            </div>
            <button type="button" aria-label="Notificaciones" className="relative flex h-10 w-10 items-center justify-center rounded-xl border border-white/[0.08] bg-white/[0.025] text-text-secondary transition hover:border-ferxxo-dark hover:text-ferxxo-green">♧<span className="absolute right-2 top-2 h-1.5 w-1.5 rounded-full bg-accent-purple" /></button>
          </div>
        </header>
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: "easeOut" }}
          className="px-6 pb-10 md:px-10"
        >
          {children}
        </motion.div>
      </main>
    </div>
  );
}
