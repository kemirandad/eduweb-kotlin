import { LevelWorkspace } from "@/components/roadmap/LevelWorkspace";

export default async function RoadmapLevelPage({ params }: { params: Promise<{ level: string }> }) {
  const { level } = await params;
  const levelId = Number(level);
  return <LevelWorkspace levelId={Number.isInteger(levelId) ? levelId : -1} />;
}
