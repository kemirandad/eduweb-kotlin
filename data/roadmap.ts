export type RoadmapLevel = {
  id: number;
  title: string;
  category: string;
  duration: string;
  summary: string;
  theory: string[];
  project: string;
  challenge: string;
  checklist: string[];
  codeMode: "kotlin" | "compose";
};

export const roadmap: RoadmapLevel[] = [
  {
    id: 0, title: "Preparación y mentalidad", category: "Punto de partida", duration: "3–5 días",
    summary: "Construye un sistema de trabajo sostenible: herramientas listas, rutina realista y evidencia desde el primer día.",
    theory: ["Android Studio, proyecto y estructura Android", "Gradle y Kotlin DSL", "Emulador, dispositivo físico, ADB y Logcat", "Git, GitHub y primer commit", "Aprendizaje activo, técnica Feynman y deuda de aprendizaje"],
    project: "Deja listo tu entorno Android, crea el repositorio y escribe una página con tu horario semanal comprometido. No hay app de código en este nivel.",
    challenge: "Escribe por qué dejaste Flutter y qué cambiarás para sostener esta ruta.",
    checklist: ["Android Studio y un proyecto vacío corren en emulador y dispositivo", "Explicas qué hace Gradle con tus propias palabras", "Tienes repositorio GitHub con primer commit", "Tienes un horario escrito y realista para tu jornada docente"],
    codeMode: "kotlin",
  },
  {
    id: 1, title: "Fundamentos de programación", category: "Lenguaje", duration: "2–3 semanas",
    summary: "Asegura los conceptos transferibles antes de profundizar en Kotlin: tipos, control, funciones y errores.",
    theory: ["val/var, tipos y mutabilidad", "Operadores, if/else, when y bucles", "Funciones puras y efectos secundarios", "Scope, excepciones y consola", "Complejidad: código que funciona y código claro"],
    project: "Crea un gestor de gastos CLI con categorías, totales, promedio diario y alerta de presupuesto; separa funciones, maneja errores y usa when.",
    challenge: "Guarda y carga los gastos desde un archivo de texto con kotlin.io.",
    checklist: ["Explicas con claridad la diferencia entre val y var", "Escribes when con varios tipos de condición", "El gestor calcula totales y presupuesto por categoría", "Las entradas inválidas se manejan sin que el programa se caiga"],
    codeMode: "kotlin",
  },
  {
    id: 2, title: "Kotlin: núcleo del lenguaje", category: "Lenguaje", duration: "5–7 semanas",
    summary: "Escribe Kotlin idiomático y modela estados y concurrencia de forma segura.",
    theory: ["Null safety y scope functions", "Data/sealed classes e interfaces", "Lambdas, higher-order functions y colecciones", "Generics, variance, delegation, inline y reified", "Coroutines, suspend, Flow, StateFlow y SharedFlow", "Anotaciones, reflection y DSLs"],
    project: "Construye una librería reutilizable de validación de formularios con sealed results, extension functions y validadores componibles.",
    challenge: "Convierte las validaciones a coroutines e incluye una verificación asíncrona simulada con delay().",
    checklist: ["Explicas cuándo usar let, also, apply, run y with", "Modelas loading/success/error con sealed class", "Explicas por qué una suspend function no bloquea", "Describes StateFlow con tus propias palabras"],
    codeMode: "kotlin",
  },
  {
    id: 3, title: "POO y principios de diseño", category: "Diseño", duration: "2–3 semanas",
    summary: "Aplica OOP con criterio, SOLID y composición en problemas cercanos a tu experiencia docente.",
    theory: ["Clases, constructores, herencia y polimorfismo", "Interfaces y clases abstractas", "Encapsulamiento y visibilidad", "Composición sobre herencia", "SOLID en ViewModel, Repository y UseCase", "Object, companion, enums y sealed classes"],
    project: "Crea un sistema de biblioteca escolar en consola con Libro, Estudiante y Préstamo; aplica interfaces, herencia donde tenga sentido y documenta tres principios SOLID.",
    challenge: "Refactoriza el gestor de gastos con responsabilidades únicas, interfaces de datos y composición.",
    checklist: ["Explicas SOLID con ejemplos propios", "Justificas una decisión entre herencia y composición", "Tu biblioteca separa claramente responsabilidades"],
    codeMode: "kotlin",
  },
  {
    id: 4, title: "Android SDK y plataforma", category: "Android", duration: "3–4 semanas",
    summary: "Entiende el ciclo de vida y los recursos que el sistema operativo gestiona por tu aplicación.",
    theory: ["Activity, Fragment, Service, Receiver y Provider", "Manifest, permisos e intent-filters", "Ciclo de vida y estado", "Context y prevención de memory leaks", "Recursos, localización y qualifiers", "Procesos, permisos runtime y ANR"],
    project: "Construye Diario de clase en XML/Views: lista y detalle de estudiantes, navegación por Intent, estado al rotar y soporte para tema e idiomas.",
    challenge: "Añade un permiso en tiempo de ejecución y maneja con cuidado su rechazo.",
    checklist: ["Dibujas y explicas el ciclo de vida de Activity", "La app conserva el estado después de rotar", "Explicas Application Context vs Activity Context con un ejemplo"],
    codeMode: "kotlin",
  },
  {
    id: 5, title: "Jetpack Compose", category: "UI moderna", duration: "4–6 semanas",
    summary: "Construye interfaces declarativas, con estado bien ubicado y experiencia adaptable.",
    theory: ["Composables, state hoisting y recomposición", "Layouts, modifiers y Material 3", "Tema claro/oscuro", "LazyColumn y formularios", "Navigation Compose y side effects", "Animación, accesibilidad y WindowSizeClass"],
    project: "Reconstruye Diario de clase en Compose, con tema dinámico, LazyColumn, validación, tres pantallas y una animación.",
    challenge: "Adapta la experiencia a teléfono y tablet con lista y detalle maestro.",
    checklist: ["Explicas state hoisting con un dibujo", "La lógica de negocio vive fuera de los Composables", "Revisas recomposiciones con Layout Inspector", "La app funciona en tema oscuro y tablet"],
    codeMode: "compose",
  },
  {
    id: 6, title: "Arquitectura profesional", category: "Arquitectura", duration: "6–8 semanas",
    summary: "Organiza la app por responsabilidades y compara MVVM/MVI sin sobre-ingeniería.",
    theory: ["Clean Architecture y reglas de dependencia", "Capas domain/data/presentation", "Repository y UseCases", "MVVM y StateFlow como fuente de verdad", "Hilt e inyección de dependencias", "MVI, modularización y trade-offs"],
    project: "Reconstruye Diario de clase con Clean Architecture, Repository, UseCases, Hilt y StateFlow por pantalla.",
    challenge: "Migra una funcionalidad a MVI con estado inmutable, Intent sellado y reducer.",
    checklist: ["Dibujas las capas y la regla de dependencia", "Justificas MVVM o MVI para un caso concreto", "Inyectas dependencias con Hilt", "Puedes seguir una funcionalidad por las capas de Now in Android"],
    codeMode: "compose",
  },
  {
    id: 7, title: "Persistencia de datos", category: "Datos", duration: "3–4 semanas",
    summary: "Guarda información de forma confiable y diseña experiencias offline-first.",
    theory: ["Room: entidades, DAO, migraciones y relaciones", "DataStore para preferencias", "Transacciones y consistencia", "Room vs DataStore", "Caché y estrategia offline-first"],
    project: "Persiste estudiantes, notas y asistencia en Room con relaciones reales; guarda tema e idioma en DataStore.",
    challenge: "Permite operar sin conexión con datos cacheados y sincroniza al volver la red.",
    checklist: ["Explicas cuándo usar Room o DataStore", "Modelas una relación uno-a-muchos", "No pierdes escrituras si la app se cierra abruptamente"],
    codeMode: "compose",
  },
  {
    id: 8, title: "Networking", category: "Datos", duration: "3–4 semanas",
    summary: "Integra una API remota con estados de red claros y mapeo de modelos.",
    theory: ["HTTP/REST y Retrofit", "Serialización y DTOs", "Errores, reintentos y conectividad", "Interceptors y autenticación", "Mapeo DTO → dominio", "Sincronización remota con Room"],
    project: "Conecta Diario de clase a una API de prueba, muestra errores y sincroniza los datos remotos con Room.",
    challenge: "Simula renovación de token ante 401 con un interceptor.",
    checklist: ["Manejas loading, éxito, error de servidor y sin conexión", "Los DTO no llegan directamente a la UI", "Explicas el propósito de un interceptor con un ejemplo"],
    codeMode: "compose",
  },
  {
    id: 9, title: "Testing", category: "Calidad", duration: "3–4 semanas",
    summary: "Demuestra comportamiento, protege regresiones y elige el nivel de prueba adecuado.",
    theory: ["JUnit y tests unitarios", "Fakes, mocks y stubs", "Pruebas de UseCases y ViewModels", "Coroutines y flujos en tests", "Compose UI testing", "Cobertura como señal, no como objetivo"],
    project: "Añade tests para UseCases, transiciones del ViewModel y tres flujos de UI en Compose.",
    challenge: "Usa TDD en la siguiente funcionalidad: primero el test, luego el código.",
    checklist: ["Domain tiene al menos 70% de cobertura útil", "Explicas mock, fake y stub", "Tests de ViewModel corren sin Android framework"],
    codeMode: "compose",
  },
  {
    id: 10, title: "Seguridad", category: "Calidad", duration: "3 semanas",
    summary: "Protege secretos y datos sensibles, y evalúa amenazas móviles comunes.",
    theory: ["OWASP Mobile Top 10", "Keystore y almacenamiento sensible", "Secretos y configuración local", "R8/ProGuard y builds release", "Biometría", "Certificate pinning y sus trade-offs"],
    project: "Audita Diario de clase: secretos fuera del repo, datos sensibles protegidos, R8 validado y biometría opcional.",
    challenge: "Implementa certificate pinning y documenta el riesgo de rotación de certificados.",
    checklist: ["No hay secretos en el historial del repositorio", "El release con R8 funciona como debug", "Explicas cinco riesgos del OWASP Mobile"],
    codeMode: "compose",
  },
  {
    id: 11, title: "Optimización y rendimiento", category: "Calidad", duration: "3–4 semanas",
    summary: "Mide antes de optimizar y elimina problemas que se sienten en dispositivos reales.",
    theory: ["Android Studio Profiler", "Memory leaks y LeakCanary", "Recomposición y estabilidad en Compose", "Baseline Profiles", "Imágenes, listas y paginación", "Macrobenchmark, microbenchmark y ANR"],
    project: "Perfila Diario de clase, corrige un leak, reduce recomposiciones y compara startup antes/después de Baseline Profile.",
    challenge: "Documenta problemas hallados en un emulador de gama baja.",
    checklist: ["Explicas la causa raíz de un leak", "Explicas cómo ayuda Baseline Profile", "Una lista de 100+ elementos hace scroll sin jank visible"],
    codeMode: "compose",
  },
  {
    id: 12, title: "Publicación y distribución", category: "Entrega", duration: "2–3 semanas",
    summary: "Lleva una app desde desarrollo hasta una pista de pruebas y monitorea su comportamiento.",
    theory: ["Play Console, políticas y ficha", "Firma, keystore y AAB", "Versionado y pistas de prueba", "Firebase Crashlytics/Analytics", "FCM y Remote Config", "CI/CD con GitHub Actions y Fastlane"],
    project: "Publica Diario de clase en Internal Testing con Firebase y pipeline que ejecute tests en cada push.",
    challenge: "Automatiza el release con Fastlane y versionCode incremental.",
    checklist: ["Tienes copia segura del keystore", "La app está en Internal Testing y Crashlytics recibe datos", "CI corre tests al hacer push"],
    codeMode: "compose",
  },
  {
    id: 13, title: "Freelancing: de desarrollador a negocio", category: "Carrera", duration: "Continuo desde el mes 10–12",
    summary: "Convierte experiencia técnica y tu conocimiento docente en una propuesta freelance clara.",
    theory: ["Workana/Upwork y perfil orientado a portafolio", "Propuestas personalizadas", "Tarifas, estimación y scope creep", "Contratos, anticipos y negociación", "Pagos internacionales desde Colombia", "Nicho de apps educativas"],
    project: "Completa un perfil freelance con portafolio, servicios claros y tres propuestas reales enviadas.",
    challenge: "Cierra tu primer proyecto freelance, aunque sea pequeño.",
    checklist: ["Tienes perfil completo en una plataforma", "Explicas tu propuesta de valor como Android developer con background docente", "Tienes un borrador de acuerdo de alcance"],
    codeMode: "compose",
  },
  {
    id: 14, title: "Nivel Senior: criterio y comunicación", category: "Senior", duration: "Continuo",
    summary: "Afina el juicio técnico, la comunicación y la capacidad de decidir bajo ambigüedad.",
    theory: ["Trade-offs técnicos y de negocio", "Code review y deuda técnica", "Mentoría y comunicación no técnica", "Requisitos ambiguos y supuestos documentados", "Arquitectura pragmática", "System design, entrevistas y open source"],
    project: "Escribe tres ADRs reales con contexto, alternativas y trade-offs de Diario de clase.",
    challenge: "Resuelve una entrevista simulada de system design mobile con requisitos ambiguos.",
    checklist: ["Defiendes decisiones de arquitectura con apertura", "Hiciste una contribución open source real", "Resuelves un diseño mobile básico sin bloquearte ante ambigüedad"],
    codeMode: "compose",
  },
];
