import { NextResponse } from "next/server";

const MAX_CODE_LENGTH = 40_000;
const REQUEST_TIMEOUT_MS = 30_000;

export async function POST(request: Request) {
  let body: { code?: unknown };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "El cuerpo de la solicitud debe ser JSON válido." }, { status: 400 });
  }

  if (typeof body.code !== "string" || !body.code.trim()) {
    return NextResponse.json({ error: "Escribe código Kotlin antes de ejecutar." }, { status: 400 });
  }
  if (body.code.length > MAX_CODE_LENGTH) {
    return NextResponse.json({ error: `El código supera el límite de ${MAX_CODE_LENGTH.toLocaleString("es-CO")} caracteres.` }, { status: 413 });
  }

  const runUrl = process.env.KOTLIN_PLAYGROUND_RUN_URL;
  if (!runUrl) {
    return NextResponse.json({ error: "Falta configurar KOTLIN_PLAYGROUND_RUN_URL con el endpoint de ejecución de Kotlin Playground." }, { status: 503 });
  }

  try {
    const response = await fetch(runUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json", Accept: "application/json" },
      body: JSON.stringify({
        code: body.code,
        confType: "java",
        version: process.env.KOTLIN_COMPILER_VERSION ?? "2.4.21",
        args: "",
      }),
      signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS),
      cache: "no-store",
    });
    const raw = await response.text();
    let payload: unknown;
    try { payload = JSON.parse(raw); } catch { payload = { output: raw }; }
    if (!response.ok) return NextResponse.json({ error: "El servicio Kotlin Playground rechazó la ejecución.", details: payload }, { status: 502 });
    return NextResponse.json(payload);
  } catch (error) {
    const message = error instanceof Error && error.name === "TimeoutError" ? "La ejecución excedió el límite de 30 segundos." : "No se pudo conectar con Kotlin Playground. Revisa la URL y disponibilidad del servicio.";
    return NextResponse.json({ error: message }, { status: 502 });
  }
}
