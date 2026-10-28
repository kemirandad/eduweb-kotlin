"use client";

import { useMemo, useState } from "react";
import Editor, { type BeforeMount } from "@monaco-editor/react";
import { AlertCircle, CheckCircle2, Code2, ExternalLink, LoaderCircle, Play, RotateCcw, Smartphone } from "lucide-react";
import type { RoadmapLevel } from "@/data/roadmap";

type CodeEditorProps = { level: RoadmapLevel };
type RunState = "idle" | "running" | "success" | "error";

const starterCode: Record<number, string> = {
  0: `fun main() {\n    println("Hola, Android Senior Roadmap!")\n    println("Hoy comienza mi camino con Kotlin.")\n}`,
  1: `data class Gasto(val categoria: String, val valor: Double)\n\nfun totalPorCategoria(gastos: List<Gasto>): Map<String, Double> =\n    gastos.groupBy { it.categoria }\n        .mapValues { (_, items) -> items.sumOf { it.valor } }\n\nfun main() {\n    val gastos = listOf(\n        Gasto("Materiales", 25000.0),\n        Gasto("Transporte", 12000.0),\n        Gasto("Materiales", 8000.0)\n    )\n    totalPorCategoria(gastos).forEach { (categoria, total) ->\n        println("\${categoria}: \${'$'}\${total}")\n    }\n}`,
  2: `sealed interface ValidationResult {\n    data object Valid : ValidationResult\n    data class Invalid(val message: String) : ValidationResult\n}\n\nfun String.validateEmail(): ValidationResult =\n    if (contains('@') && contains('.')) ValidationResult.Valid\n    else ValidationResult.Invalid("Revisa el formato del correo")\n\nfun main() {\n    println("docente@escuela.edu".validateEmail())\n}`,
};

function initialCode(level: RoadmapLevel) {
  return starterCode[level.id] ?? (level.id >= 5
    ? `import androidx.compose.material3.MaterialTheme\nimport androidx.compose.material3.Surface\nimport androidx.compose.material3.Text\nimport androidx.compose.runtime.Composable\nimport androidx.compose.ui.tooling.preview.Preview\n\n@Composable\nfun DiarioDeClaseCard() {\n    Surface(color = MaterialTheme.colorScheme.surface) {\n        Text(text = "${level.title}")\n    }\n}\n\n@Preview(showBackground = true)\n@Composable\nfun DiarioDeClasePreview() {\n    MaterialTheme { DiarioDeClaseCard() }\n}`
    : `fun main() {\n    println("Level ${level.id}: ${level.title}")\n}`);
}

function formatResponse(payload: unknown): string {
  if (typeof payload === "string") return payload;
  if (!payload || typeof payload !== "object") return JSON.stringify(payload, null, 2);
  const data = payload as Record<string, unknown>;
  for (const key of ["stdout", "output", "result", "text", "message"]) {
    if (typeof data[key] === "string") return data[key] as string;
  }
  if (data.programOutput && typeof data.programOutput === "object") {
    const programOutput = data.programOutput as Record<string, unknown>;
    if (typeof programOutput.text === "string") return programOutput.text;
    if (typeof programOutput.output === "string") return programOutput.output;
  }
  return JSON.stringify(payload, null, 2);
}

export function CodeEditor({ level }: CodeEditorProps) {
  const [code, setCode] = useState(() => initialCode(level));
  const [output, setOutput] = useState("El resultado de tu ejecución aparecerá aquí.");
  const [runState, setRunState] = useState<RunState>("idle");
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const isCompose = level.id >= 5;
  const statusLabel = useMemo(() => runState === "running" ? "EJECUTANDO" : runState === "success" ? "COMPLETADO" : runState === "error" ? "ERROR" : "LISTO", [runState]);

  const beforeMount: BeforeMount = (monaco) => {
    monaco.languages.register({ id: "kotlin" });
    monaco.languages.setMonarchTokensProvider("kotlin", {
      keywords: ["package", "import", "class", "interface", "object", "fun", "val", "var", "if", "else", "when", "for", "while", "return", "suspend", "data", "sealed", "override", "private", "public", "in", "is", "as", "null", "true", "false"],
      tokenizer: {
        root: [
          [/\/\/.*$/, "comment"],
          [/"([^"\\]|\\.)*$/, "string.invalid"],
          [/"([^"\\]|\\.)*"/, "string"],
          [/@?[a-zA-Z_$][\w$]*/, { cases: { "@keywords": "keyword", "@default": "identifier" } }],
          [/\d+(\.\d+)?/, "number"],
          [/[{}()[\]]/, "delimiter.bracket"],
          [/[;,.]/, "delimiter"],
        ],
      },
    });
  };

  async function runKotlin() {
    setRunState("running");
    setOutput("Conectando con Kotlin Playground…");
    try {
      const response = await fetch("/api/kotlin/run", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code }),
      });
      const payload = await response.json();
      if (!response.ok) throw new Error(payload.error ?? "El compilador no pudo ejecutar este código.");
      setOutput(formatResponse(payload));
      setRunState("success");
    } catch (error) {
      setOutput(error instanceof Error ? error.message : "No fue posible ejecutar el código.");
      setRunState("error");
    }
  }

  async function runComposePreview() {
    setRunState("running");
    setPreviewUrl(null);
    setOutput("Preparando preview de Compose…");
    try {
      const response = await fetch("/api/compose/preview", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code, levelId: level.id }),
      });
      const payload = await response.json();
      if (!response.ok) throw new Error(payload.error ?? "El worker de Compose no pudo crear el preview.");
      setPreviewUrl(payload.imageUrl ?? payload.screenshotUrl ?? null);
      setOutput(payload.logs ?? payload.message ?? "Preview de Compose generado.");
      setRunState("success");
    } catch (error) {
      setOutput(error instanceof Error ? error.message : "No fue posible generar el preview.");
      setRunState("error");
    }
  }

  return (
    <section className="edge-card glass-panel overflow-hidden rounded-[24px]">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/[0.07] px-4 py-3 md:px-5">
        <div className="flex items-center gap-3"><span className="flex h-8 w-8 items-center justify-center rounded-xl bg-ferxxo-green/10 text-ferxxo-green">{isCompose ? <Smartphone size={16} /> : <Code2 size={16} />}</span><div><p className="text-xs font-semibold text-text-primary">{isCompose ? "Compose Preview" : "Kotlin Playground"}</p><p className="text-[10px] text-text-secondary">{isCompose ? "Niveles 5–14 · Worker Android" : "Kotlin/JVM · niveles 0–4"}</p></div></div>
        <div className="flex items-center gap-2">
          <span className="hidden items-center gap-1.5 text-[9px] font-bold uppercase tracking-[0.12em] text-text-secondary sm:flex">{runState === "running" ? <LoaderCircle size={12} className="animate-spin text-ferxxo-green" /> : runState === "error" ? <AlertCircle size={12} className="text-red-400" /> : runState === "success" ? <CheckCircle2 size={12} className="text-ferxxo-green" /> : <span className="h-1.5 w-1.5 rounded-full bg-ferxxo-green" />}{statusLabel}</span>
          <button type="button" onClick={() => setCode(initialCode(level))} className="flex h-8 items-center gap-1.5 rounded-lg border border-white/[0.08] px-2.5 text-[10px] font-medium text-text-secondary transition hover:border-white/20 hover:text-text-primary"><RotateCcw size={12} /> Restablecer</button>
          {isCompose ? <button type="button" disabled={runState === "running"} onClick={runComposePreview} className="flex h-8 items-center gap-2 rounded-lg bg-ferxxo-green px-3 text-[10px] font-bold text-black transition hover:bg-[#28ff98] disabled:cursor-wait disabled:opacity-60"><Play size={12} fill="currentColor" /> Ejecutar Compose Preview</button> : <button type="button" disabled={runState === "running"} onClick={runKotlin} className="flex h-8 items-center gap-2 rounded-lg bg-ferxxo-green px-3 text-[10px] font-bold text-black transition hover:bg-[#28ff98] disabled:cursor-wait disabled:opacity-60"><Play size={12} fill="currentColor" /> Ejecutar Kotlin</button>}
        </div>
      </div>

      <div className="grid min-h-[430px] md:grid-cols-[minmax(0,1.2fr)_minmax(300px,.8fr)]">
        <div className="min-h-[330px] border-b border-white/[0.07] md:border-b-0 md:border-r">
          <div className="flex h-9 items-center gap-2 border-b border-white/[0.05] px-4 text-[10px] text-text-secondary"><span className="h-2 w-2 rounded-full bg-[#ff5f57]" /><span className="h-2 w-2 rounded-full bg-[#febc2e]" /><span className="h-2 w-2 rounded-full bg-[#28c840]" /><span className="ml-2">main.kt</span></div>
          <Editor height="390px" language="kotlin" theme="vs-dark" value={code} onChange={(value) => setCode(value ?? "")} beforeMount={beforeMount} options={{ minimap: { enabled: false }, fontSize: 13, fontFamily: "JetBrains Mono, Consolas, monospace", lineNumbers: "on", scrollBeyondLastLine: false, automaticLayout: true, padding: { top: 14 }, tabSize: 4, wordWrap: "on", roundedSelection: false, renderLineHighlight: "gutter", scrollbar: { verticalScrollbarSize: 7, horizontalScrollbarSize: 7 }, overviewRulerBorder: false }} />
        </div>
        <div className="flex min-h-[270px] flex-col bg-black/20">
          <div className="flex h-9 items-center justify-between border-b border-white/[0.05] px-4"><span className="text-[10px] font-semibold uppercase tracking-[0.14em] text-text-secondary">{previewUrl ? "Preview / output" : "Output"}</span><span className="text-[9px] text-white/30">{isCompose ? "Compose worker" : "Kotlin Playground API"}</span></div>
          {previewUrl && <img src={previewUrl} alt="Preview generado por Compose" className="max-h-[230px] w-full border-b border-white/[0.06] object-contain" />}
          <pre aria-live="polite" className={`flex-1 whitespace-pre-wrap break-words p-4 font-mono text-[11px] leading-5 ${runState === "error" ? "text-red-300" : "text-[#baf7d2]"}`}>{output}</pre>
          <div className="flex items-center justify-between border-t border-white/[0.05] px-4 py-3"><span className="text-[9px] text-text-secondary">{isCompose ? "Preview renderizado en entorno aislado" : "Salida del compilador"}</span>{!isCompose && <a href="https://play.kotlinlang.org/" target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 text-[9px] text-text-secondary transition hover:text-ferxxo-green">Abrir Playground <ExternalLink size={10} /></a>}</div>
        </div>
      </div>
      {isCompose && <p className="border-t border-white/[0.06] px-4 py-2.5 text-[10px] text-text-secondary">El endpoint de preview requiere un worker Android configurado en el backend. El código se valida y reenvía al servicio; esta aplicación no ejecuta contenedores dentro del proceso web.</p>}
    </section>
  );
}
