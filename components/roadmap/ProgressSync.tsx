"use client";

import { useEffect } from "react";
import { useRoadmapStore } from "@/lib/roadmap-store";

export function ProgressSync() {
  const hydrateFromServer = useRoadmapStore((state) => state.hydrateFromServer);
  const setSaveError = useRoadmapStore((state) => state.setSaveError);
  const setSyncStatus = useRoadmapStore((state) => state.setSyncStatus);

  useEffect(() => {
    const controller = new AbortController();
    fetch("/api/progress", { cache: "no-store", signal: controller.signal })
      .then(async (response) => {
        const payload = await response.json();
        if (!response.ok) throw new Error(payload.error ?? "No se pudo conectar con PostgreSQL.");
        hydrateFromServer(payload.progress);
      })
      .catch((error: unknown) => {
        if (error instanceof DOMException && error.name === "AbortError") return;
        setSyncStatus("offline");
        setSaveError(error instanceof Error ? error.message : "El progreso está disponible solo en este navegador.");
      });
    return () => controller.abort();
  }, [hydrateFromServer, setSaveError, setSyncStatus]);

  return null;
}
