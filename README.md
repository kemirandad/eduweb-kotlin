# Kotlin/Up · Android Senior Roadmap

Plataforma Next.js para recorrer 15 niveles de Android nativo con Kotlin. Esta fase incluye la ruta navegable, el checklist y el gate de avance en estado local, además del editor Monaco con endpoints proxy para Kotlin Playground y un worker Android de Compose.

## Inicio local

1. Copia `.env.example` a `.env.local` y ajusta los servicios que vayas a usar.
2. Instala dependencias con `npm install`.
3. Arranca el desarrollo con `npm run dev` y abre `http://localhost:3000`.

Next.js 16 necesita Node.js 20.9 o superior.

El progreso se sincroniza con PostgreSQL y mantiene una copia local para la interfaz. En desarrollo local se crea una identidad guest en una cookie HttpOnly. En producción se usa Auth.js con GitHub OAuth y cada cuenta se vincula a un usuario de PostgreSQL.

## Autenticación y despliegue

- Configura `AUTH_SECRET`, `AUTH_GITHUB_ID` y `AUTH_GITHUB_SECRET` en `.env.local` y en el proveedor de hosting. Genera el secreto local con `npx auth secret`.
- Registra una OAuth App de GitHub para desarrollo con callback `http://localhost:3000/api/auth/callback/github` y otra para producción con callback `https://TU_DOMINIO/api/auth/callback/github`.
- En producción, configura también `DATABASE_URL`, `AI_PROVIDER`, `GEMINI_API_KEY` y `GEMINI_MODEL`. Nunca expongas estos secretos con prefijo `NEXT_PUBLIC_` ni los subas al repositorio.
- Aplica el esquema a la base remota con `npx prisma db push` durante la primera preparación y luego publica desde la rama `main`.
- La vista previa Compose requiere un worker externo y aislado. Déjala sin configurar hasta desplegar ese worker; `localhost:9000` solo sirve para desarrollo local.

## Ejecución de código

- Los niveles 0–4 envían el código a `POST /api/kotlin/run`. El endpoint reenvía al endpoint configurado en `KOTLIN_PLAYGROUND_RUN_URL` (por defecto, el servicio oficial de Kotlin Playground). El proxy evita depender de CORS en el editor y mantiene la dirección del compilador en configuración de servidor.
- Los niveles 5–14 envían el snippet a `POST /api/compose/preview`, que reenvía `{ code, levelId }` a `COMPOSE_PREVIEW_URL`. El worker debe compilar y renderizar dentro de un contenedor aislado, y responder `{ imageUrl, logs }`.
- El servidor web no ejecuta código de usuario dentro de su propio proceso. Los límites de tamaño/tiempo se aplican en las rutas Next.js; el aislamiento y límites de recursos deben estar configurados también en los servicios de compilación.

El mentor admite Gemini Developer API (predeterminado) y OpenAI. Envía una evaluación estructurada, guarda cada revisión en PostgreSQL y solo registra aprobación si el modelo devuelve `approved: true`; no existe una aprobación de respaldo simulada. Configura `GEMINI_API_KEY` en `.env.local` para Gemini o selecciona `AI_PROVIDER="openai"` y configura `OPENAI_API_KEY`. El código, la evidencia y la pregunta se envían al proveedor seleccionado.

Después de copiar `.env.example` a `.env.local`, configura `DATABASE_URL` y la clave del proveedor de IA seleccionado. Aplica el esquema con `npx prisma db push` y genera el cliente con `npx prisma generate`; luego reinicia Next.js. No compartas la clave API en el chat.
