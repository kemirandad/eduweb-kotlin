import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/current-user";
import { recalculateUserProgress } from "@/lib/progress";

export const runtime = "nodejs";

export async function GET() {
  try {
    const user = await getCurrentUser();
    if (!user) return NextResponse.json({ error: "Inicia sesión para sincronizar tu progreso." }, { status: 401 });
    return NextResponse.json({ progress: await recalculateUserProgress(user.id) });
  } catch (error) {
    console.error("GET /api/progress failed", error);
    return NextResponse.json({ error: "No se pudo leer el progreso de PostgreSQL." }, { status: 503 });
  }
}
