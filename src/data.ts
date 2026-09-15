/* ═══════════════════════════════════════════════════════
   OMNI-SPHERE // SENIOR ARCHITECT REGISTRY (2026)
   ═══════════════════════════════════════════════════════ */

export const profile = {
  name: "Moe Kyaw Aung",
  nameMM: "မိုးကျော်အောင်",
  title: "Senior Android Developer",
  full: "Senior Android & Full-Stack Architect",
  location: "Tachileik, Myanmar ↔ Bangkok, Thailand",
  email: "moekyawaung@programmer.net",
  phone: "+95 9 889 000 889",
  secondPhone: "+959 666 000 050",
  github: "https://github.com/Dev-moe-kyawaung",
  linkedin: "https://www.linkedin.com/in/moe-kyaw-aung-2653093a1",
  gravatar: "https://gravatar.com/moekyawaung2026",
  avatar: "https://res.cloudinary.com/dye5qpwii/image/upload/v1778527878/IMG_20260430_053105_uef0yr.png",
  aboutImg: "https://res.cloudinary.com/dye5qpwii/image/upload/v1778763531/MKA_12_iv8kpm.webp",
  philosophy: "Code with culture. Build with purpose.",
  availability: "Open to work",
  languages: "Burmese · English · Kotlin",
  building: "KMP Design System · on-device AI assistant",
};

export type Metric = { value: string; label: string };

/* ── Omni-Sphere flagship project node ── */
export type OmniProject = {
  id: string;
  code: string;            // short 2-3 letter node tag
  title: string;
  category: string;
  tagline: string;
  accent: string;
  lat: number;             // sphere latitude (deg)
  lon: number;             // sphere longitude (deg)
  stack: string[];
  telemetry: string;
  metrics: Metric[];
  problem: string;
  constraints: string[];
  approach: string[];
  decisions: string[];
  layers: { name: string; detail: string };
  architecture: string;
  outcome: string;
  security: string;
  snippetTitle: string;
  snippet: string;
  sensors: { label: string; value: string; pct: number };
};

export const omniProjects: OmniProject[] = [
  {
    id: "kmp-ds",
    code: "KMP",
    title: "KMP Design System Library",
    category: "Compose Multiplatform",
    tagline: "Publishable design-system library with token → Figma sync and adaptive, accessibility-first components.",
    accent: "#00e5ff",
    lat: 22, lon: 30,
    stack: ["Kotlin", "Compose Multiplatform", "Gradle", "klibs.io"],
    telemetry: "6 modules · 42 components · AA contrast verified",
    metrics: [
      { value: "42", label: "components" },
      { value: "100%", label: "token coverage" },
      { value: "AA", label: "contrast" },
    ],
    problem:
      "Product teams rebuilt the same buttons, text fields, and dialogs in every app — each with slightly different spacing, corner radii, and contrast behaviour. Brand consistency drifted, accessibility regressed silently, and a single spacing change meant editing dozens of screens across Android, iOS, and desktop targets.",
    constraints: [
      "One source of truth must drive Android, iOS, and desktop",
      "Designers work in Figma — tokens cannot live only in code",
      "Runtime theming (light/dark, brand variants) without recompiles",
      "Accessibility cannot be opt-in — it must be enforced by the API surface",
    ],
    approach: [
      "Modelled design tokens (color, type, spacing, shape, motion) as a versioned Kotlin API in a shared :core:design-system module",
      "Built a Gradle task that exports tokens to a JSON contract consumable by Figma variables, keeping design and code in lockstep",
      "Composed adaptive layouts using WindowSizeClass so components reflow across compact, medium, and expanded widths",
      "Made accessibility structural: semantics, content descriptions, and minimum touch targets are parameters of every component, not afterthoughts",
    ],
    decisions: [
      "Expose tokens as immutable value classes so misuse is a compile error",
      "Publish to klibs.io with semantic versioning so apps pin and upgrade deliberately",
      "Keep runtime theming in a single CompositionLocal provider to avoid prop-drilling theme state",
      "Ship a snapshot-testing harness (Paparazzi + Roborazzi) gating visual regressions in CI",
    ],
    layers: {
      name: "TOKEN → COMPONENT → SCREEN",
      detail:
        "Foundation layer holds raw tokens; components consume tokens only through the theme; screens compose components and never hard-code dimensions.",
    },
    architecture:
      "A shared Kotlin Multiplatform module exposes a `DesignSystemTheme` composable backed by a token registry. Each component is a thin, stateless composable that reads from the current theme, so theming, localisation, and accessibility all resolve at composition time from one place.",
    outcome:
      "Six product surfaces now share one visual language. A spacing change ships as a library version bump, and accessibility contrast is verified by CI rather than by eye. Onboarding a new screen dropped from days to hours.",
    security:
      "Tokens and assets are signed and checksum-verified on publish. The library ships with a strict ProGuard/R8 consumer configuration so no internal API leaks into consuming apps.",
    snippetTitle: "DesignSystemTheme.kt",
    snippet: `@Composable
fun DesignSystemTheme(
    brand: Brand = Brand.Default,
    darkTheme: Boolean = isSystemInDarkTheme(),
    content: @Composable () -> Unit
) {
    val colorScheme = remember(brand, darkTheme) {
        TokenRegistry.colorScheme(brand, darkTheme)
    }
    val typography = remember { TokenRegistry.typography() }
    CompositionLocalProvider(
        LocalDsColors provides colorScheme,
        LocalDsTypography provides typography
    ) {
        MaterialTheme(content = content)
    }
}

@Composable
fun DsPrimaryButton(
    text: String,
    onClick: () -> Unit,
    size: DsButtonSize = DsButtonSize.Medium,
    modifier: Modifier = Modifier
) {
    val colors = LocalDsColors.current
    val minTarget = 48.dp          // enforced touch target
    Button(
        onClick = onClick,
        modifier = modifier.heightIn(min = minTarget),
        shape = RoundedCornerShape(Token.shape.md),
        colors = ButtonDefaults.buttonColors(containerColor = colors.primary)
    ) { Text(text = text, style = LocalDsTypography.current.labelLarge) }
}`,
    sensors: { label: "TOKEN SYNC", value: "in lockstep", pct: 100 },
  },
  {
    id: "on-device-ai",
    code: "AI",
    title: "On-Device AI Code Assistant",
    category: "LiteRT-LM · KMP",
    tagline: "Local code generation and explanation that never leaves the machine — privacy-first, with a model swap UI.",
    accent: "#7c5cff",
    lat: -8, lon: 95,
    stack: ["Kotlin", "LiteRT-LM", "Compose", "KMP (Android/Desktop)"],
    telemetry: "~310 ms first token · 0 bytes egress",
    metrics: [
      { value: "~310ms", label: "first token" },
      { value: "0 B", label: "data egress" },
      { value: "3", label: "swap models" },
    ],
    problem:
      "Developers wanted inline code explanation and generation, but sending proprietary source to a cloud API was a non-starter for client work under NDA. Cloud assistants also broke entirely on flights and in low-connectivity regions — exactly where much of this work happens.",
    constraints: [
      "No source code may leave the device — hard privacy requirement",
      "Must run on mid-tier Android hardware without thermal collapse",
      "Users need to swap quantised models per task (explain vs generate)",
      "Latency budget: first token under ~400 ms to feel interactive",
    ],
    approach: [
      "Wrapped LiteRT-LM (TensorFlow Lite runtime for language models) behind a repository interface in shared KMP code",
      "Quantised models to int8 and memory-mapped weights so load time stays flat across sessions",
      "Streamed tokens into a Compose `LazyColumn` so output renders progressively instead of blocking",
      "Built a model-swap UI listing downloaded models with size, quantisation, and intended task",
    ],
    decisions: [
      "Abstract the inference engine behind `LmInference` so LiteRT-LM can be swapped without touching UI",
      "Run inference on a Dispatchers.Default thread pool, never on Main",
      "Persist conversation history in encrypted Room storage as the single source of truth",
      "Expose a `stop()` that cancels the coroutine job on user abort",
    ],
    layers: {
      name: "ENGINE → REPOSITORY → STREAM UI",
      detail:
        "Native engine wrapper → Kotlin repository (Flow-based streaming) → Compose UI that renders partial tokens as they arrive.",
    },
    architecture:
      "A shared `CodeAssistantRepository` exposes `Flow<String>` of streamed tokens. The Android target delegates to a LiteRT-LM-backed engine; the desktop target uses the same interface with a desktop runtime. UI never touches tensors, and swapping the engine is a DI change.",
    outcome:
      "Code explanation runs with zero network egress and ~310 ms to first token on target hardware. The model-swap UI lets engineers trade quality for speed per task without a rebuild.",
    security:
      "All prompts and completions stay on-device in an encrypted Room database. No telemetry or crash payload includes source text, and the model files are signature-checked before load.",
    snippetTitle: "CodeAssistantRepository.kt",
    snippet: `interface LmInference {
    fun load(modelId: String)
    fun stream(prompt: String): Flow<String>
    fun stop()
}

class CodeAssistantRepository @Inject constructor(
    private val engine: LmInference,
    private val historyDao: ChatDao,
    private val io: CoroutineDispatcher = Dispatchers.Default
) {
    fun explain(code: String): Flow<String> = flow {
        engine.load("code-explain-int8")
        engine.stream("Explain this:\\n$code").collect { emit(it) }
    }.flowOn(io).onCompletion { engine.stop() }
}`,
    sensors: { label: "EGRESS", value: "0 bytes", pct: 100 },
  },
  {
    id: "agentic-tasks",
    code: "AGT",
    title: "Agentic Task Manager",
    category: "Gemini Nano · KMP",
    tagline: "An AI that plans and executes multi-step tasks with visible reasoning and a user override at every step.",
    accent: "#ff2d95",
    lat: 40, lon: 165,
    stack: ["KMP", "Compose", "Gemini Nano / ML Kit", "WorkManager"],
    telemetry: "5-step plans · every step interruptible",
    metrics: [
      { value: "5", label: "step plans" },
      { value: "100%", label: "steps overridable" },
      { value: "0", label: "silent actions" },
    ],
    problem:
      "Task apps captured todos but did no work. Users still had to break 'renew vehicle permit' into five subtasks, remember deadlines, and chase each one manually. Automation was either absent or an opaque black box that acted without consent.",
    constraints: [
      "Reasoning must be visible — no silent agent actions",
      "Every planned step must be user-overridable",
      "Work must survive process death and run in background",
      "On-device model for planning privacy",
    ],
    approach: [
      "Modelled a task as a `Plan` of `Step` value objects with status, rationale, and rollback",
      "Used Gemini Nano (via ML Kit) to propose plans, then render each step's reasoning in the UI",
      "Scheduled side effects with WorkManager, keyed by step id, with exponential backoff",
      "Persisted plan state in Room so a killed process resumes exactly where it stopped",
    ],
    decisions: [
      "Agent proposes; user approves each step (no auto-execute)",
      "Each step carries a `rationale` string surfaced in the timeline",
      "Idempotent step execution keyed by a stable step id",
      "Expose an `abort(planId)` that cancels the whole WorkManager chain",
    ],
    layers: {
      name: "PLAN → STEP → WORKER",
      detail:
        "Planner produces immutable steps; a scheduler maps steps to WorkManager requests; each worker reports status back to Room.",
    },
    architecture:
      "Plans are immutable data. A `PlanScheduler` translates approved steps into a unique WorkManager chain; each worker writes its outcome to Room, and the UI observes Room as the single source of truth — so the agent's progress is always resumable and auditable.",
    outcome:
      "Multi-step errands now run with visible rationale and one-tap override per step. Background work survives process death, and every action is reversible.",
    security:
      "Plan data is encrypted at rest. No step executes network calls without an explicit user grant, and all agent actions are logged to a local audit table.",
    snippetTitle: "PlanScheduler.kt",
    snippet: `class PlanScheduler @Inject constructor(private val workManager: WorkManager) {
    fun enqueue(plan: Plan) {
        var chain = workManager.beginUniqueWork(
            plan.id, ExistingWorkPolicy.KEEP, StepWorker.request(plan.steps.first())
        )
        plan.steps.drop(1).forEach { step ->
            chain = chain.then(StepWorker.request(step))
        }
        chain.enqueue()
    }

    fun abort(planId: String) = workManager.cancelUniqueWork(planId)
}

data class Step(
    val id: String,
    val action: String,
    val rationale: String,   // surfaced to user
    val requiresGrant: Boolean
)`,
    sensors: { label: "OVERRIDE", value: "always on", pct: 100 },
  },
  {
    id: "3d-portfolio",
    code: "3D",
    title: "3D Interactive Portfolio",
    category: "React · R3F",
    tagline: "Liquid-glass shaders, scroll narratives, an AI chat agent, and full PWA offline support.",
    accent: "#00ffa3",
    lat: -35, lon: -60,
    stack: ["React", "Vite", "Three.js / R3F", "GSAP", "Tailwind"],
    telemetry: "60 fps · offline-capable PWA",
    metrics: [
      { value: "60", label: "fps target" },
      { value: "100", label: "lighthouse PWA" },
      { value: "AI", label: "chat agent" },
    ],
    problem:
      "Recruiters skim portfolios in under a minute. A static grid of cards communicates nothing about how an engineer thinks, and heavy 3D scenes tanked performance and failed offline, losing the reader entirely.",
    constraints: [
      "Must hold 60 fps on mid-range mobile",
      "Must work offline (PWA)",
      "3D must explain architecture, not just decorate",
      "Fast first paint — no blank white screen while bundles load",
    ],
    approach: [
      "Rendered an interactive sphere of project nodes in R3F with instanced meshes and depth-sorted layers",
      "Wrote liquid-glass shader materials (refraction + fresnel) for holographic panels",
      "Drove scroll narratives with GSAP timelines tied to section entry (depth-based transitions)",
      "Added a service worker for full offline asset caching and manifest for installability",
      "Lazy-loaded heavy 3D chunks; deferred non-critical work off the main thread",
    ],
    decisions: [
      "Compute node positions on CPU, stream transforms to GPU — no per-frame React re-renders",
      "Use depth-based transitions (camera dolly) to reveal case-study layers",
      "Cache 3D assets via service worker for offline PWA parity",
      "Keep AI agent responses local-first with graceful degradation",
    ],
    layers: {
      name: "SCENE → SHADER → NARRATIVE",
      detail:
        "3D scene graph → holographic shader materials → GSAP scroll timeline controlling camera depth per section.",
    },
    architecture:
      "A single R3F canvas hosts the omni-sphere. Node transforms are computed ahead of render; a GSAP timeline moves the camera through depth layers as the user scrolls, revealing hologram panels. Service worker caches all assets for offline PWA use.",
    outcome:
      "Holds 60 fps on mid-range phones, installs as a PWA, and communicates architecture through navigable 3D space instead of paragraphs.",
    security:
      "No third-party trackers; all assets served over TLS, cached locally, and the PWA has a strict Content-Security-Policy.",
    snippetTitle: "OmniSphere.tsx",
    snippet: `function OmniSphere({ nodes, onSelect }) {
  const group = useRef()
  useFrame((_, dt) => { group.current.rotation.y += dt * 0.05 })
  return (
    <group ref={group}>
      {nodes.map(n => (
        <Node key={n.id}
          position={latLonToVec3(n.lat, n.lon, 2.4)}
          onClick={() => onSelect(n.id)} />
      ))}
      <mesh scale={2.3}>
        <sphereGeometry args={[1, 64, 64]} />
        <liquidGlassMaterial />
      </mesh>
    </group>
  )}`,
    sensors: { label: "FRAME RATE", value: "60 fps", pct: 100 },
  },
  {
    id: "foldable-media",
    code: "FLD",
    title: "Foldable-First Media App",
    category: "Compose · Media3",
    tagline: "Canonical layouts and posture-aware playback with predictive back and large-screen optimisation.",
    accent: "#ffb703",
    lat: 12, lon: -125,
    stack: ["Compose", "WindowSizeClasses", "Media3", "KMP"],
    telemetry: "canonical layouts · posture-aware",
    metrics: [
      { value: "3", label: "window classes" },
      { value: "posture-aware", label: "playback" },
      { value: "predictive", label: "back" },
    ],
    problem:
      "Media apps broke on foldables: video kept playing into the hinge, lists rendered as one stretched column, and back gestures felt wrong on large screens.",
    constraints: [
      "Must respect folded/unfolded postures — no content across the hinge",
      "Large screens need list-detail canonical layouts",
      "Predictive back must preview the destination",
      "Playback must survive configuration changes",
    ],
    approach: [
      "Branched on WindowSizeClass (compact / medium / expanded) to pick canonical layouts",
      "Used WindowInfoTracker to detect folding posture and reflow around the hinge",
      "Held one Media3 ExoPlayer instance in a ViewModel, surviving rotation and fold changes",
      "Wired predictive back callbacks to show the destination preview before commit",
      "Kept a single source of truth for playback state in a state holder",
      "Rendered list-detail side-by-side on expanded, single-pane on compact",
    ],
    decisions: [
      "Hoist player to ViewModel — never recreate on fold/rotate",
      "Posture-aware: detect hinge and avoid spanning video across it",
      "Predictive back via OnBackPressedCallback with progress",
      "Adaptive navigation (nav rail on expanded, bottom bar on compact)",
    ],
    layers: {
      name: "WINDOW CLASS → LAYOUT → PLAYER",
      detail:
        "WindowSizeClass selects the canonical layout → posture info reflows around hinge → single player instance owned by ViewModel.",
    },
    architecture:
      "A `MediaStateHolder` owns the single ExoPlayer; UI reads state, never holds the player. Layout branches on WindowSizeClass; WindowInfoTracker feeds posture → scaffold adjusts (nav rail vs bottom bar; list-detail vs single pane). Predictive back previews the pop destination before committing.",
    outcome:
      "Playback is continuous across fold/rotate and correctly avoids the hinge; large screens get list-detail; predictive back previews navigation.",
    security:
      "DRM via Widevine (MediaDrm) with secure surface; no playback state persisted to disk unencrypted.",
    snippetTitle: "MediaStateHolder.kt",
    snippet: `class MediaStateHolder(app: Application) : AndroidViewModel(app) {
    private val _player = ExoPlayer.Builder(app).build()
    val player: Player get() = _player
    override fun onCleared() { _player.release(); super.onCleared() }
}

@Composable fun MediaScreen(holder: MediaStateHolder = viewModel()) {
    val sizeClass = currentWindowAdaptiveInfo().windowSizeClass
    if (sizeClass.windowWidthSizeClass == EXPANDED) ListDetailLayout(player = holder.player) else SinglePaneLayout(player = holder.player)
}`,
    sensors: { label: "POSTURE", value: "hinge-aware", pct: 100 },
  },
  {
    id: "carbon-aware",
    code: "CO2",
    title: "Carbon-Aware App Template",
    category: "KMP · Benchmark",
    tagline: "A starter template that budgets background work and reports estimated CO₂ per session.",
    accent: "#22d3ee",
    lat: -30, lon: 20,
    stack: ["KMP", "Compose", "Jetpack Benchmark", "Lighthouse CI"],
    telemetry: "dark-default · vector · budgeted work",
    metrics: [
      { value: "dark", label: "default" },
      { value: "vector", label: "assets" },
      { value: "CO₂", label: "reported" },
    ],
    problem:
      "App templates optimise for developer speed and ignore energy cost: raster assets, light-mode default, and unbounded background sync that drains battery and inflates carbon per user session.",
    constraints: [
      "Dark mode must be the default (OLED energy saving)",
      "Vector drawables over bitmaps",
      "Background work must run inside a budget",
      "Energy cost should be measurable and reported",
    ],
    approach: [
      "Shipped dark theme as the default with a light variant, cutting OLED display energy",
      "Replaced bitmap assets with vector drawables and adaptive icons",
      "Wrapped all background sync in WorkManager with a daily execution budget",
      "Added Jetpack Benchmark traces for startup and frame timing",
      "Wired Lighthouse CI to catch web-view energy regressions",
      "Estimated CO₂ per session from CPU/network telemetry, surfaced in a settings panel",
    ],
    decisions: [
      "Dark-default theme (measurable OLED saving)",
      "Vector-only assets (smaller APK, less decode energy)",
      "Daily WorkManager budget for background sync",
      "Benchmark + Lighthouse CI gating perf regressions",
    ],
    layers: {
      name: "UI → WORK BUDGET → TELEMETRY",
      detail:
        "Dark-default Compose UI → budgeted WorkManager sync → CO₂ estimate from CPU + network telemetry.",
    },
    architecture:
      "The template exposes a `WorkBudget` object capping daily background executions, a dark-default MaterialTheme, vector-only resources, and a `CarbonEstimator` that converts CPU time and bytes transferred into an estimated CO₂ figure shown to the user.",
    outcome:
      "A starter that is energy-aware by default: dark UI, vector art, budgeted background sync, and a visible CO₂-per-session estimate.",
    security:
      "Telemetry is anonymised and opt-in; no energy data leaves the device without consent.",
    snippetTitle: "WorkBudget.kt",
    snippet: `object WorkBudget {
    private const val DAILY_LIMIT = 12
    fun hasQuota(): Boolean = prefs.getInt("runs_today", 0) < DAILY_LIMIT
    fun consume() = prefs.edit { putInt("runs_today", runs + 1) }
}

object CarbonEstimator {
    fun estimate(cpuMs: Long, bytes: Long): Double =
        (cpuMs * 0.000_000_42) + (bytes / 1_000_000.0 * 0.000_81)
}`,
    sensors: { label: "BUDGET", value: "12/day", pct: 92 },
  },
];

/* ── Capability matrix (7 domains) ── */
export const skills = [
  { code: "S-1", group: "Android", note: "the craft itself", items: ["Kotlin", "Jetpack Compose", "Coroutines & Flow", "Room", "WorkManager", "CameraX", "Media3 / ExoPlayer", "Material 3"] },
  { code: "S-2", group: "Architecture", note: "systems that hold", items: ["Clean Architecture", "MVI / MVVM", "Multi-module", "Hilt / Dagger", "Repository pattern", "Offline-first", "KMP"] },
  { code: "S-3", group: "Backend & APIs", note: "services behind the UI", items: ["Firebase (Auth/Firestore/FCM)", "REST", "Retrofit / OkHttp", "Node.js", "PostgreSQL", "Python"] },
  { code: "S-4", group: "AI / ML", note: "intelligence at the edge", items: ["TensorFlow Lite", "LiteRT-LM", "Claude API", "ML Kit", "Gemini Nano", "Quantization"] },
  { code: "S-5", group: "Security", note: "trust as a feature", items: ["Keystore / AES-256", "Certificate pinning", "TLS 1.3", "OWASP MASVS", "R8 / obfuscation", "Biometrics", "DRM / Widevine"] },
  { code: "S-6", group: "DevOps / CI-CD", note: "shipping without drama", items: ["GitHub Actions", "Fastlane", "Gradle", "Docker", "Staged rollouts", "Screenshot testing", "Jetpack Benchmark", "Lighthouse CI"] },
  { code: "S-7", group: "Tools", note: "the daily instruments", items: ["Android Studio", "Git", "Figma", "VS Code", "Jira", "Baseline Profiles", "klibs.io"] },
];

/* ── Experience / career roadmap ── */
export const experience = [
  { year: "2026", title: "Independent — Senior Android & KMP Architect", org: "MKA Studio · Tachileik ⇄ Bangkok", text: "Design-system and on-device AI architecture. KMP shared modules across Android + desktop. Mentoring engineers through Compose and KMP adoption.", tags: ["Android", "Architecture", "Mentoring", "AI/ML"], ach: "OPEN TO SENIOR & FOUNDING ROLES" },
  { year: "2024", title: "Technical Founder — POS Ultimate", org: "Merchant OS · Myanmar & Thailand", text: "Took a merchant OS from prototype to 1,200 live stores across two countries. Owned the dual-currency offline ledger, sync engine, and release pipeline end-to-end.", tags: ["Startup", "Android", "Architecture", "Performance"], ach: "1,200 STORES · 2 COUNTRIES" },
  { year: "2023", title: "Delivery & Performance Lead", org: "Independent", text: "Built release machinery: GitHub Actions, Fastlane signing, screenshot testing, staged rollouts, 90%+ coverage gates. Cut cold-start P90 to 620ms and reduced OOM crashes through bitmap lifecycle and memory-budget work.", tags: ["CI/CD", "Performance", "Memory"], ach: "COLD START 620MS · SHIP CYCLE → DAYS" },
  { year: "2022", title: "Architecture Lead", org: "Android portfolio-wide", text: "Adopted Clean Architecture, Hilt, and Flow across the portfolio. Drove the multi-module split that cut build times 68% and delivered 6-second incremental builds on 80+ modules.", tags: ["Architecture", "Android", "Performance"], ach: "80+ MODULES · 6S INCREMENTAL BUILDS" },
  { year: "2021", title: "Compose Migration", org: "Three production apps", text: "Moved production surfaces from XML to Jetpack Compose with MVI state handling and a shared design system. Mentored teammates with pairing sessions and review templates.", tags: ["Android", "Mentoring", "Architecture"], ach: "3 APPS MIGRATED · 0 REGRESSIONS" },
  { year: "2019", title: "First Ship", org: "Play Store", text: "Java and XML. First Android app reached the Play Store — and taught everything a first production app teaches about lifecycle, crashes, and real users.", tags: ["Android"], ach: "FIRST PRODUCTION RELEASE" },
];

/* ── Verified 82+ certificates ── */
export const verifiedCertificates = [
  { name: "C Programming", cat: "Programming", id: "1720080366600", date: "Jul 4, 2024" },
  { name: "C++ Systems Mastery", cat: "Programming", id: "1720080489120", date: "Jul 5, 2024" },
  { name: "Java Advanced Enterprise", cat: "Programming", id: "1720080512300", date: "Jul 6, 2024" },
  { name: "Python Scripting & Core", cat: "Programming", id: "1720080598100", date: "Jul 7, 2024" },
  { name: "Kotlin Mobile Development", cat: "Mobile", id: "1720080612400", date: "Jul 8, 2024" },
  { name: "Android Architecture Components", cat: "Mobile", id: "1720080645100", date: "Jul 9, 2024" },
  { name: "Jetpack Compose UI Framework", cat: "Mobile", id: "1720080698200", date: "Jul 10, 2024" },
  { name: "Flutter & Dart Mobile Engine", cat: "Mobile", id: "1720080723100", date: "Jul 11, 2024" },
  { name: "React Native Cross-Platform", cat: "Mobile", id: "1720080789400", date: "Jul 12, 2024" },
  { name: "React.js Web Engineering", cat: "Web Dev", id: "1720080812300", date: "Jul 13, 2024" },
  { name: "Vue.js Framework Architecture", cat: "Web Dev", id: "1720080845600", date: "Jul 14, 2024" },
  { name: "Angular Enterprise Systems", cat: "Web Dev", id: "1720080891200", date: "Jul 15, 2024" },
  { name: "Node.js & Express REST APIs", cat: "Web Dev", id: "1720080923400", date: "Jul 16, 2024" },
  { name: "HTML5 & CSS3 Master", cat: "Web Dev", id: "1720080967800", date: "Jul 17, 2024" },
  { name: "Tailwind CSS UI Styling", cat: "Web Dev", id: "1720080998100", date: "Jul 18, 2024" },
  { name: "TypeScript Systems Engineering", cat: "Web Dev", id: "1720081034500", date: "Jul 19, 2024" },
  { name: "Firebase Backend Suite", cat: "Databases", id: "1720081078900", date: "Jul 20, 2024" },
  { name: "PostgreSQL Relational DB", cat: "Databases", id: "1720081112300", date: "Jul 21, 2024" },
  { name: "MongoDB NoSQL Architecture", cat: "Databases", id: "1720081145600", date: "Jul 22, 2024" },
  { name: "Redis In-Memory Cache", cat: "Databases", id: "1720081198200", date: "Jul 23, 2024" },
  { name: "SQL Query Optimization", cat: "Databases", id: "1720081234500", date: "Jul 24, 2024" },
  { name: "Room Local DB for Android", cat: "Databases", id: "1720081278900", date: "Jul 25, 2024" },
  { name: "Machine Learning Fundamentals", cat: "AI / ML", id: "1720081312300", date: "Jul 26, 2024" },
  { name: "TensorFlow Lite On-Device ML", cat: "AI / ML", id: "1720081345600", date: "Jul 27, 2024" },
  { name: "Deep Learning & Neural Networks", cat: "AI / ML", id: "1720081398200", date: "Jul 28, 2024" },
  { name: "Natural Language Processing NLP", cat: "AI / ML", id: "1720081434500", date: "Jul 29, 2024" },
  { name: "Claude API LLM Integration", cat: "AI / ML", id: "1720081512300", date: "Jul 31, 2024" },
  { name: "Ethical Hacking & Pen Testing", cat: "Security", id: "1720081545600", date: "Aug 1, 2024" },
  { name: "Cybersecurity Kali Linux Protocols", cat: "Security", id: "1720081598200", date: "Aug 2, 2024" },
  { name: "GitHub Actions CI/CD Pipeline", cat: "Security", id: "1720081634500", date: "Aug 3, 2024" },
  { name: "Docker Space Containerization", cat: "Security", id: "1720081678900", date: "Aug 4, 2024" },
  { name: "Azure DevOps Enterprise Pipelines", cat: "Security", id: "1720081712300", date: "Aug 5, 2024" },
  { name: "Blockchain Architecture", cat: "Blockchain", id: "1720081798200", date: "Aug 7, 2024" },
  { name: "Smart Contract Development", cat: "Blockchain", id: "1720081834500", date: "Aug 8, 2024" },
  { name: "Clean Architecture Pattern Design", cat: "Software Eng.", id: "1720081878900", date: "Aug 9, 2024" },
  { name: "SOLID Principles in OOP", cat: "Software Eng.", id: "1720081912300", date: "Aug 10, 2024" },
  { name: "Design Patterns Gang of Four", cat: "Software Eng.", id: "1720081945600", date: "Aug 11, 2024" },
  { name: "Data Structures & Algorithms", cat: "Software Eng.", id: "1720081998200", date: "Aug 12, 2024" },
  { name: "Startup MVP Engineering Lab", cat: "Business", id: "1720082034500", date: "Aug 13, 2024" },
  { name: "Agile Scrum Leadership", cat: "Business", id: "1720082078900", date: "Aug 14, 2024" },
];

export const achievements = {
  certifications: {
    total: "82+",
    note: "Programming Hub — verified, dated, and categorized across nine domains. Google Developers Launchpad alumnus.",
    groups: [
      { name: "Programming", count: 13 }, { name: "Web Dev", count: 13 }, { name: "Mobile", count: 7 },
      { name: "Databases", count: 6 }, { name: "AI / ML", count: 11 }, { name: "Security", count: 10 },
      { name: "Blockchain", count: 4 }, { name: "Software Eng.", count: 7 }, { name: "Business", count: 11 },
    ],
  },
  openSource: {
    total: "20",
    note: "Public repositories and 30+ GitHub organizations covering Android, KMP, security tooling, and AI.",
    stats: [
      { end: 20, suffix: "", label: "public repos" },
      { end: 30, suffix: "+", label: "GitHub orgs" },
      { end: 43, suffix: "", label: "linked accounts" },
    ],
  },
  launches: {
    total: "1,200",
    note: "Merchant stores live on POS Ultimate, plus 20 consumer products shipped to production.",
    stats: [
      { end: 1200, suffix: "", label: "stores live" },
      { end: 20, suffix: "", label: "products shipped" },
      { end: 10, suffix: "M+", label: "users reached" },
    ],
  },
  milestones: [
    "10M+ lifetime users reached across the portfolio",
    "99.98% crash-free sessions sustained in production",
    "68% build-time reduction after multi-module split",
    "Cold-start P90 optimized to 620ms",
    "82+ verified certifications, Google Developers Launchpad",
    "1,200 merchant stores running on POS Ultimate",
    "KMP design system shared across Android + desktop",
    "On-device AI with zero data egress",
  ],
};

/* ── Network ── */
export const githubAccounts = [
  "Dev-moe-kyawaung", "moekyawaung-tech", "Moekyawaung-cyber", "moekyawaung-china", "moekyawaung-developer",
  "moekyawaung-microsoft", "moekyawaung-google", "moekyawaung-bangkok", "moekyawaung-micro", "moekyaw-aung-mm",
  "moekyawaung-mk", "moekyaw-developer", "Moekyawaung-mm", "moekyawaung-hack", "moekyawaung-graduate",
  "Moekyawaung-Linux", "Moekyawaung-coder", "moekyawaung-designer", "Moekyawaung2026", "moekyawaung-web",
  "MoeKyawAung-code", "moekyawaung-creator", "moekyawaung-webdeveloper", "Moekyawaung-co", "moekyawaung-edu",
  "moekyawaung-senior", "Moekyawaung-Development", "Moe-KyawAung", "moekyawaung-vivov30pro", "moekyawaungmka",
  "moekyawaungmka2032-boop", "moekyawaungmka2034-coder", "moekyaw-dev-mm", "moekyawaung-dev", "happy-cv-creator",
];

export const lovableWebApps = [
  { name: "Happy CV Creator", url: "https://happy-cv-creator.lovable.app" },
  { name: "MKA Bio Hub", url: "https://moekyawaungmybio.lovable.app/" },
  { name: "The CV Palette", url: "https://the-cv-palette.lovable.app" },
  { name: "URL Shortener Pro", url: "https://moekyaw-url.lovable.app" },
  { name: "Dev Profile 2026", url: "https://moekyawaung-dev.lovable.app" },
  { name: "Main Interstellar Hub", url: "https://moe-kyaw-aung.lovable.app" },
  { name: "MKA Mobile Suite", url: "https://moekyawaungmka.lovable.app" },
  { name: "CV Beacon System", url: "https://cv-beacon.lovable.app/" },
  { name: "Persuasion Hub", url: "https://profile-persuasion-hub.lovable.app" },
  { name: "Friendly Haven Cloud", url: "https://friendly-haven-io.lovable.app" },
  { name: "Joy Codify Life", url: "https://joy-codify-life.lovable.app/" },
  { name: "Spark Coach AI", url: "https://spark-coach-create.lovable.app" },
  { name: "Color Code Chronicles", url: "https://color-code-chronicles.lovable.app" },
  { name: "Pixel Perfect Snap", url: "https://pixel-perfect-snap-39.lovable.app" },
  { name: "App Skill Gallery", url: "https://app-skill-gallery.lovable.app" },
  { name: "Myanmar Hub", url: "https://moekyawaung-myanmar.lovable.app" },
];

export const socials = [
  { name: "GitHub", url: "https://github.com/Dev-moe-kyawaung" },
  { name: "LinkedIn", url: "https://www.linkedin.com/in/moe-kyaw-aung-2653093a1" },
  { name: "YouTube", url: "https://www.youtube.com/channel/UCuTXUguZb4xjeL2nX8WJG" },
  { name: "Gravatar", url: "https://gravatar.com/moekyawaung2026" },
  { name: "Bluesky", url: "https://bsky.app/profile/moekyawaung96.bsky.social" },
  { name: "Tumblr", url: "https://www.tumblr.com/moekyawaung" },
  { name: "Flickr", url: "https://www.flickr.com/people/204037451@N06" },
  { name: "Vimeo", url: "https://vimeo.com/user252414232" },
  { name: "Slack", url: "https://moekyawaung.slack.com/" },
  { name: "PayPal", url: "https://www.paypal.com/paypalme/my/profile" },
  { name: "Strikingly", url: "http://moekyawaung2026.strikingly.com" },
  { name: "Lovable", url: "https://moekyawaung.lovable.app" },
];

export const emails = [
  "moekyawaung@programmer.net", "moekyawaung@collector.org", "moekyawaung@technologist.com",
  "moekyawaung@techie.com", "moekyawaung@graphic-designer.com", "moekyawaung@cybergal.com",
  "moekyawaung@webname.com", "moekyawaung@hackermail.com", "moekyawaung@graduate.org",
  "moekyawaung@engineer.com", "moekyawaung@asia.com", "moekyawaung@contractor.net",
  "moekyawaung@linuxmail.org", "moekyawaung@usa.com", "moekyawaung@europe.com",
  "moekyawaung@mail.com", "moekyawaung@iname.com", "moekyawaung@socialogist.com",
  "moekyawaung@secretary.net", "moekyawaung@publicist.com",
];

export const mediaShowcase = [
  { type: "image", url: "https://res.cloudinary.com/dye5qpwii/image/upload/v1778763531/MKA_12_iv8kpm.webp", title: "Engineering Command Setup", tag: "HARDWARE" },
  { type: "image", url: "https://res.cloudinary.com/dye5qpwii/image/upload/v1778747388/image-1_1_khsx9s.png", title: "Architecture Flowchart", tag: "SCHEMATIC" },
  { type: "image", url: "https://res.cloudinary.com/dye5qpwii/image/upload/v1778763531/MKA_3_zqrhhr.webp", title: "POS Merchant Rig", tag: "RETAIL" },
  { type: "image", url: "https://res.cloudinary.com/dye5qpwii/image/upload/v1778763532/MKA_11_jbijtv.webp", title: "Multi-Module Workspace", tag: "WORKSPACE" },
  { type: "image", url: "https://res.cloudinary.com/dye5qpwii/image/upload/v1778795799/2024119_20_b94fen.jpg", title: "Tachileik Lab Testing", tag: "LAB" },
  { type: "image", url: "https://res.cloudinary.com/dye5qpwii/image/upload/v1778795801/MKA_22_felevo.webp", title: "Bangkok Studio Rig", tag: "STUDIO" },
  { type: "image", url: "https://res.cloudinary.com/dye5qpwii/image/upload/v1778763536/preview_ls5ptn.webp", title: "App Collection Matrix", tag: "DEPLOYMENT" },
  { type: "video", url: "https://res.cloudinary.com/dye5qpwii/video/upload/v1779052711/Javier_Black-Dark-Ring.mp4", title: "3D Dark Ring Kinetic", tag: "3D MOTION" },
];
