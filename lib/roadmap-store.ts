"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import { roadmap } from "@/data/roadmap";
import type { MentorFeedback } from "@/lib/progress";

type ReviewState = "not-submitted" | "approved" | "needs-work";

type ServerProgress = { levelId: number; checks: boolean[]; approved: boolean; latestReview: MentorFeedback | null }[];

type RoadmapState = {
  checks: Record<number, boolean[]>;
  reviews: Record<number, ReviewState>;
  latestReviews: Record<number, MentorFeedback>;
  saveError: string | null;
  syncStatus: "loading" | "connected" | "offline";
  hydrateFromServer: (progress: ServerProgress) => void;
  setReviewResult: (levelId: number, approved: boolean) => void;
  setSaveError: (message: string | null) => void;
  setSyncStatus: (status: "loading" | "connected" | "offline") => void;
  toggleCheck: (levelId: number, checkIndex: number) => Promise<void>;
  getCheckedCount: (levelId: number) => number;
  isLevelComplete: (levelId: number) => boolean;
  isUnlocked: (levelId: number) => boolean;
};

export const useRoadmapStore = create<RoadmapState>()(
  persist(
    (set, get) => ({
      checks: {},
      reviews: {},
      latestReviews: {},
      saveError: null,
      syncStatus: "loading",
      hydrateFromServer: (progress) => set(() => ({
        checks: Object.fromEntries(progress.map((item) => [item.levelId, item.checks])),
        reviews: Object.fromEntries(progress.map((item) => [item.levelId, item.approved ? "approved" : item.latestReview ? "needs-work" : "not-submitted"])),
        latestReviews: Object.fromEntries(progress.flatMap((item) => item.latestReview ? [[item.levelId, item.latestReview]] : [])),
        saveError: null,
        syncStatus: "connected",
      })),
      setReviewResult: (levelId, approved) => set((state) => ({ reviews: { ...state.reviews, [levelId]: approved ? "approved" : "needs-work" }, saveError: null })),
      setSaveError: (message) => set({ saveError: message }),
      setSyncStatus: (status) => set({ syncStatus: status }),
      toggleCheck: async (levelId, checkIndex) => {
        const level = roadmap.find((item) => item.id === levelId);
        if (!level) return;
        const current = get().checks[levelId] ?? Array(level.checklist.length).fill(false);
        const next = [...current];
        next[checkIndex] = !next[checkIndex];
        set((state) => ({ checks: { ...state.checks, [levelId]: next }, saveError: null }));
        try {
          const response = await fetch(`/api/progress/${levelId}`, { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ checks: next }) });
          const payload = await response.json();
          if (!response.ok) throw new Error(payload.error ?? "No se pudo guardar el progreso.");
          get().hydrateFromServer(payload.progress);
        } catch (error) {
          set({ checks: { ...get().checks, [levelId]: current }, saveError: error instanceof Error ? error.message : "No se pudo sincronizar el checklist.", syncStatus: "offline" });
        }
      },
      getCheckedCount: (levelId) => (get().checks[levelId] ?? []).filter(Boolean).length,
      isLevelComplete: (levelId) => {
        const level = roadmap.find((item) => item.id === levelId);
        if (!level) return false;
        const checks = get().checks[levelId] ?? [];
        return checks.length === level.checklist.length && checks.every(Boolean) && get().reviews[levelId] === "approved";
      },
      isUnlocked: (levelId) => levelId === 0 || get().isLevelComplete(levelId - 1),
    }),
    {
      name: "kotlin-up-roadmap-v1",
      version: 2,
      migrate: (persistedState) => ({ ...(persistedState as object), reviews: {}, saveError: null }),
    },
  ),
);

export type { ReviewState };
