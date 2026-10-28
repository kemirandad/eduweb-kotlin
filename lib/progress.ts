import { LevelStatus, Prisma } from "@prisma/client";
import { roadmap } from "@/data/roadmap";
import { prisma } from "@/lib/prisma";

export type MentorFeedback = {
  approved: boolean;
  summary: string;
  feedback: string;
  observations: string[];
  questions: string[];
  nextStep: string;
};

function toChecks(value: Prisma.JsonValue, length: number) {
  const parsed = Array.isArray(value) ? value : [];
  return Array.from({ length }, (_, index) => parsed[index] === true);
}

export async function ensureUserRoadmap(userId: string) {
  for (const level of roadmap) {
    await prisma.roadmapLevel.upsert({
      where: { id: level.id },
      update: { title: level.title, slug: `nivel-${level.id}`, summary: level.summary, order: level.id },
      create: { id: level.id, title: level.title, slug: `nivel-${level.id}`, summary: level.summary, order: level.id },
    });
  }
  await prisma.levelProgress.createMany({
    data: roadmap.map((level) => ({
      userId,
      levelId: level.id,
      status: level.id === 0 ? LevelStatus.IN_PROGRESS : LevelStatus.LOCKED,
      checklistState: Array(level.checklist.length).fill(false),
    })),
    skipDuplicates: true,
  });
}

export async function recalculateUserProgress(userId: string) {
  await ensureUserRoadmap(userId);
  const [progressRows, submissions] = await Promise.all([
    prisma.levelProgress.findMany({ where: { userId }, orderBy: { levelId: "asc" } }),
    prisma.codeSubmission.findMany({ where: { userId }, orderBy: { createdAt: "desc" } }),
  ]);

  let previousComplete = true;
  const result = [];
  for (const level of roadmap) {
    const row = progressRows.find((candidate) => candidate.levelId === level.id);
    const checks = toChecks(row?.checklistState ?? [], level.checklist.length);
    const approved = submissions.some((submission) => submission.levelId === level.id && submission.isApproved);
    const complete = checks.length === level.checklist.length && checks.every(Boolean) && approved;
    const unlocked = level.id === 0 || previousComplete;
    const status = complete ? LevelStatus.COMPLETED : unlocked ? LevelStatus.IN_PROGRESS : LevelStatus.LOCKED;

    if (row && (row.status !== status || (complete && !row.completedAt) || (!complete && row.completedAt))) {
      await prisma.levelProgress.update({
        where: { id: row.id },
        data: { status, completedAt: complete ? row.completedAt ?? new Date() : null },
      });
    }
    const latest = submissions.find((submission) => submission.levelId === level.id);
    let latestReview: MentorFeedback | null = null;
    if (latest?.aiFeedback) {
      try { latestReview = JSON.parse(latest.aiFeedback) as MentorFeedback; } catch { latestReview = { approved: false, summary: "Revisión anterior", feedback: latest.aiFeedback, observations: [], questions: [], nextStep: "Envía una nueva revisión." }; }
    }
    result.push({ levelId: level.id, status, checks, approved, complete, unlocked, latestReview });
    previousComplete = complete;
  }
  return result;
}

export function isValidChecks(value: unknown, expectedLength: number): value is boolean[] {
  return Array.isArray(value) && value.length === expectedLength && value.every((item) => typeof item === "boolean");
}
