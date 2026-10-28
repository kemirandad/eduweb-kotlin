# Kotlin/Up · Android Senior Roadmap

Plataforma Next.js para recorrer 15 niveles de Android nativo con Kotlin. Esta fase incluye la ruta navegable, el checklist y el gate de avance en estado local, además del editor Monaco con endpoints proxy para Kotlin Playground y un worker Android de Compose.

## Inicio local

1. Copia `.env.example` a `.env.local` y ajusta los servicios que vayas a usar.
2. Instala dependencias con `npm install`.
3. Arranca el desarrollo con `npm run dev` y abre `http://localhost:3000`.

Next.js 16 necesita Node.js 20.9 o superior.

El progreso se sincroniza con PostgreSQL y mantiene una copia local para la interfaz. En desarrollo local se crea una identidad guest en una cookie HttpOnly; esta identidad está deshabilitada en producción hasta configurar GitHub OAuth.

## Ejecución de código

- Los niveles 0–4 envían el código a `POST /api/kotlin/run`. El endpoint reenvía al endpoint configurado en `KOTLIN_PLAYGROUND_RUN_URL` (por defecto, el servicio oficial de Kotlin Playground). El proxy evita depender de CORS en el editor y mantiene la dirección del compilador en configuración de servidor.
- Los niveles 5–14 envían el snippet a `POST /api/compose/preview`, que reenvía `{ code, levelId }` a `COMPOSE_PREVIEW_URL`. El worker debe compilar y renderizar dentro de un contenedor aislado, y responder `{ imageUrl, logs }`.
- El servidor web no ejecuta código de usuario dentro de su propio proceso. Los límites de tamaño/tiempo se aplican en las rutas Next.js; el aislamiento y límites de recursos deben estar configurados también en los servicios de compilación.

El mentor admite Gemini Developer API (predeterminado) y OpenAI. Envía una evaluación estructurada, guarda cada revisión en PostgreSQL y solo registra aprobación si el modelo devuelve `approved: true`; no existe una aprobación de respaldo simulada. Configura `GEMINI_API_KEY` en `.env.local` para Gemini o selecciona `AI_PROVIDER="openai"` y configura `OPENAI_API_KEY`. El código, la evidencia y la pregunta se envían al proveedor seleccionado.

Después de copiar `.env.example` a `.env.local`, configura `DATABASE_URL` y la clave del proveedor de IA seleccionado. Aplica el esquema con `npx prisma db push` y genera el cliente con `npx prisma generate`; luego reinicia Next.js. No compartas la clave API en el chat.
