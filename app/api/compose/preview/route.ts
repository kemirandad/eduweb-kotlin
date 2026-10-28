import { NextResponse } from "next/server";

const MAX_CODE_LENGTH = 60_000;
const REQUEST_TIMEOUT_MS = 90_000;

export async function POST(request: Request) {
  let body: { code?: unknown; levelId?: unknown };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "El cuerpo de la solicitud debe ser JSON válido." }, { status: 400 });
  }

  if (typeof body.code !== "string" || !body.code.trim() || body.code.length > MAX_CODE_LENGTH) {
    return NextResponse.json({ error: `El código Compose debe tener entre 1 y ${MAX_CODE_LENGTH.toLocaleString("es-CO")} caracteres.` }, { status: 400 });
  }
  if (typeof body.levelId !== "number" || !Number.isInteger(body.levelId) || body.levelId < 5 || body.levelId > 14) {
    return NextResponse.json({ error: "El preview Compose está disponible para los niveles 5–14." }, { status: 400 });
  }

  const workerUrl = process.env.COMPOSE_PREVIEW_URL;
  if (!workerUrl) {
    return NextResponse.json({ error: "El worker aislado de Compose no está configurado. Define COMPOSE_PREVIEW_URL para habilitar la generación del preview." }, { status: 503 });
  }

  try {
    const response = await fetch(workerUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json", Accept: "application/json" },
      body: JSON.stringify({ code: body.code, levelId: body.levelId }),
      signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS),
      cache: "no-store",
    });
    const raw = await response.text();
    let payload: unknown;
    try { payload = JSON.parse(raw); } catch { payload = { logs: raw }; }
    if (!response.ok) return NextResponse.json({ error: "El worker Compose no pudo generar el preview.", details: payload }, { status: 502 });
    return NextResponse.json(payload);
  } catch (error) {
    const message = error instanceof Error && error.name === "TimeoutError" ? "El worker Compose excedió el límite de 90 segundos." : "No se pudo conectar con el worker Compose.";
    return NextResponse.json({ error: message }, { status: 502 });
  }
}
