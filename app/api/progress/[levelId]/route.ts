import { NextResponse } from "next/server";
import { roadmap } from "@/data/roadmap";
import { getCurrentUser } from "@/lib/current-user";
import { isValidChecks, recalculateUserProgress } from "@/lib/progress";
import { prisma } from "@/lib/prisma";
import { LevelStatus } from "@prisma/client";

export const runtime = "nodejs";

export async function PUT(request: Request, { params }: { params: Promise<{ levelId: string }> }) {
  try {
    const user = await getCurrentUser();
    if (!user) return NextResponse.json({ error: "Inicia sesión para guardar tu progreso." }, { status: 401 });
    const { levelId: rawLevelId } = await params;
    const levelId = Number(rawLevelId);
    const level = roadmap.find((item) => item.id === levelId);
    if (!level) return NextResponse.json({ error: "Nivel inválido." }, { status: 404 });

    let body: { checks?: unknown };
    try { body = await request.json(); } catch { return NextResponse.json({ error: "JSON inválido." }, { status: 400 }); }
    if (!isValidChecks(body.checks, level.checklist.length)) {
      return NextResponse.json({ error: "El checklist no coincide con este nivel." }, { status: 400 });
    }

    const snapshot = await recalculateUserProgress(user.id);
    if (!snapshot[levelId]?.unlocked) return NextResponse.json({ error: "Completa el nivel anterior antes de editar este checklist." }, { status: 403 });

    await prisma.levelProgress.update({
      where: { userId_levelId: { userId: user.id, levelId } },
      data: { checklistState: body.checks, status: LevelStatus.IN_PROGRESS },
    });
    const progress = await recalculateUserProgress(user.id);
    return NextResponse.json({ progress });
  } catch (error) {
    console.error("PUT /api/progress/[levelId] failed", error);
    return NextResponse.json({ error: "No se pudo guardar el checklist en PostgreSQL." }, { status: 503 });
  }
}
