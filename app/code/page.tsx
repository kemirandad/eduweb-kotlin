import { DashboardLayout } from "@/components/DashboardLayout";
import { CodeEditor } from "@/components/editor/CodeEditor";
import { roadmap } from "@/data/roadmap";

export default function CodePage() {
  return <DashboardLayout eyebrow="LABORATORIO" title="Code Lab"><div className="mx-auto max-w-[1100px] space-y-5"><div className="glass-panel rounded-[22px] p-5"><p className="text-sm font-semibold">Editor del nivel 2 · Kotlin esencial</p><p className="mt-1 text-xs leading-5 text-text-secondary">El editor abre con un ejemplo de sealed classes. En cada checkpoint encontrarás el mismo laboratorio ajustado a su nivel.</p></div><CodeEditor level={roadmap[2]} /></div></DashboardLayout>;
}
