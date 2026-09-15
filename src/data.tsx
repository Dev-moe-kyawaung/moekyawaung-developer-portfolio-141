/* ═══════════════════════════════════════════════════════
   NEURAL INTERFACE — CONTENT REGISTRY
   ═══════════════════════════════════════════════════════ */

export const profile = {
  name: "Moe Kyaw Aung",
  nameMM: "မိုးကျော်အောင်",
  title: "Senior Android Architect & Technical Founder",
  location: "Tachileik, Myanmar ↔ Bangkok, Thailand",
  email: "moekyawaung@programmer.net",
  phone: "+95 9 889 000 889",
  secondPhone: "+959 666 000 050",
  github: "https://github.com/Dev-moe-kyawaung",
  avatar: "https://res.cloudinary.com/dye5qpwii/image/upload/v1778527878/IMG_20260430_053105_uef0yr.png",
  building: "MoekyawTranslator — Burmese ↔ English AI",
  availability: "Open to senior & founding roles",
};

export const heroStats = [
  { end: 10, suffix: "M+", label: "users reached" },
  { end: 99.98, suffix: "%", decimals: 2, label: "crash-free sessions" },
  { end: 43, suffix: "", label: "apps shipped" },
  { end: 1200, suffix: "", label: "stores on POS Ultimate" },
];

export const tickerItems = [
  "Synaptic integrity 99.98%",
  "43 apps shipped to production",
  "10M+ users reached",
  "1,200 stores on POS Ultimate",
  "82+ verified certifications",
  "Open to senior & founding roles",
  "Tachileik ↔ Bangkok",
  "Kotlin · Compose · Clean Architecture",
];

/* ── case studies ────────────────────────────────────── */
export type Metric = { end: number; suffix: string; decimals?: number; label: string };
export type CaseStudy = {
  id: string;
  code: string;
  title: string;
  tag: string;
  accent: string;
  status: string;
  users: string;
  usersLabel: string;
  summary: string;
  problem: string;
  approach: string[];
  outcome: string;
  metrics: Metric[];
  stack: string[];
  url: string;
};

export const caseStudies: CaseStudy[] = [
  {
    id: "pos",
    code: "N-01",
    title: "POS Ultimate Pro Max",
    tag: "Merchant operating system",
    accent: "#5ce8b6",
    status: "Flagship",
    users: "1,200",
    usersLabel: "live stores",
    summary: "Offline-first retail infrastructure running real commerce across Myanmar and Thailand — two currencies, unstable networks, zero tolerance for a lost sale.",
    problem:
      "Border merchants trade in MMK and THB on networks that fail daily. A sale cannot wait for connectivity, receipts must print instantly, and nightly reconciliation must balance to the last unit — on hardware with 2GB of RAM.",
    approach: [
      "Room as the single source of truth; every sale commits locally first, sync rides a WorkManager queue with conflict resolution",
      "Dual-currency ledger with fixed-point arithmetic — no float money, ever",
      "Hilt-scoped feature modules so receipts, inventory, and reporting ship independently",
      "CI pipeline with screenshot tests and staged Play rollout",
    ],
    outcome:
      "The system now runs 1,200 stores across two countries. Outages stopped being business events: sales continue offline and reconcile cleanly when signal returns.",
    metrics: [
      { end: 1200, suffix: "", label: "stores live" },
      { end: 99.98, suffix: "%", decimals: 2, label: "crash-free" },
      { end: 68, suffix: "%", label: "faster builds" },
    ],
    stack: ["Kotlin", "Compose", "Hilt", "Room", "WorkManager", "Firebase"],
    url: "https://github.com/moekyawaung-tech/POS-Ultimate-Pro-Max",
  },
  {
    id: "social",
    code: "N-02",
    title: "Social Dashboard",
    tag: "Realtime analytics",
    accent: "#53c7f0",
    status: "Live",
    users: "1.2M",
    usersLabel: "users reached",
    summary: "A multi-tenant telemetry surface that turns five disconnected social channels into one live, decision-ready stream.",
    problem:
      "Teams were making calls from stale screenshots stitched across five platforms. Nobody trusted the numbers, and by the time a trend was visible it was already gone.",
    approach: [
      "MVI reducer over StateFlow — every screen renders one immutable state",
      "WebSocket streams debounced into Room so the dashboard survives reconnects",
      "Multi-tenant theming and role-based views from a shared design system",
      "Incremental feature flags to ship analytics without release trains",
    ],
    outcome:
      "Decisions now ride sub-second data. The dashboard carries 1.2M users at 99.95% uptime, and new metric views ship in days instead of sprints.",
    metrics: [
      { end: 1.2, suffix: "M", decimals: 1, label: "users" },
      { end: 99.95, suffix: "%", decimals: 2, label: "uptime" },
      { end: 5, suffix: "→1", label: "channels unified" },
    ],
    stack: ["Kotlin", "Compose", "MVI", "Flow", "WebSocket", "Firebase"],
    url: "https://github.com/moekyawaung-tech/social-dashboard",
  },
  {
    id: "video",
    code: "N-03",
    title: "Video Player Pro",
    tag: "Adaptive media engine",
    accent: "#ffb454",
    status: "Live",
    users: "820K",
    usersLabel: "active users",
    summary: "A playback engine that stays calm across wildly different devices and bandwidth — from flagships to 2GB handsets on 2G.",
    problem:
      "Playback had to feel identical on a flagship and on a budget handset at a border market. Stalls, dropped frames, and dead gestures are the moments users blame the product for.",
    approach: [
      "One playback state machine around ExoPlayer / Media3 — UI never talks to the codec directly",
      "HLS adaptive bitrate with pre-buffer tuned for high-latency networks",
      "Gesture zones for brightness, volume, and seek with hysteresis to kill accidental drags",
      "PiP, subtitle parsing, and an offline cache managed by storage pressure signals",
    ],
    outcome:
      "820K users with a zero-dropped-frame release bar held across every device tier. Session completion rose because playback simply stopped being noticeable.",
    metrics: [
      { end: 820, suffix: "K", label: "users" },
      { end: 4.8, suffix: "★", decimals: 1, label: "store rating" },
      { end: 0, suffix: "", label: "dropped-frame target" },
    ],
    stack: ["ExoPlayer", "Media3", "HLS", "Compose", "Room"],
    url: "https://github.com/moekyawaung-tech/video-player",
  },
  {
    id: "translator",
    code: "N-04",
    title: "MoekyawTranslator",
    tag: "On-device language AI",
    accent: "#ff7a9e",
    status: "Building",
    users: "12K",
    usersLabel: "waitlist",
    summary: "Burmese ↔ English translation that works where coverage and privacy are not guaranteed — cloud quality, edge reliability.",
    problem:
      "Translation for Burmese speakers fails exactly where it is needed most: low coverage, low-end devices, and a justified distrust of sending conversations to a server.",
    approach: [
      "Two inference paths — Claude API for quality, quantized TFLite for the edge — behind one Compose surface",
      "A connectivity-aware router picks the path per request, degrading silently",
      "Conversation history stays in encrypted Room storage; nothing leaves the device by default",
    ],
    outcome:
      "12K people joined the waitlist before beta. Marginal inference cost on-device is effectively zero, which is what makes regional language AI viable at all.",
    metrics: [
      { end: 12, suffix: "K", label: "waitlist" },
      { end: 2, suffix: "", label: "inference paths" },
      { end: 0, suffix: "", label: "edge infra cost" },
    ],
    stack: ["Claude API", "TFLite", "Kotlin", "Compose", "Room"],
    url: "https://github.com/Dev-moe-kyawaung/",
  },
];

/* ── skills ──────────────────────────────────────────── */
export const skillBars = [
  { name: "Kotlin / Jetpack Compose", value: 97, color: "#5ce8b6" },
  { name: "Clean Architecture / MVI", value: 96, color: "#53c7f0" },
  { name: "Multi-module systems", value: 95, color: "#ffb454" },
  { name: "CI/CD & test strategy", value: 93, color: "#5ce8b6" },
  { name: "Data / offline sync", value: 92, color: "#53c7f0" },
  { name: "Product judgment", value: 91, color: "#ff7a9e" },
];

export const skillGroups = [
  { code: "SF-01", name: "Building surfaces", note: "interfaces people trust", color: "#5ce8b6", items: ["Jetpack Compose", "Material 3", "Design systems", "Motion", "Accessibility"] },
  { code: "SF-02", name: "Structuring systems", note: "code that stays calm", color: "#53c7f0", items: ["Clean Architecture", "Multi-module", "Hilt / DI", "Coroutines & Flow"] },
  { code: "SF-03", name: "Owning state", note: "data with a home", color: "#ffb454", items: ["Room", "Firebase", "Retrofit / OkHttp", "Offline sync"] },
  { code: "SF-04", name: "Shipping safely", note: "releases without drama", color: "#ff7a9e", items: ["GitHub Actions", "Fastlane", "MockK / Espresso", "Staged rollouts"] },
  { code: "SF-05", name: "Pushing the edge", note: "intelligence on-device", color: "#5ce8b6", items: ["TFLite", "Claude API", "CameraX / ML Kit", "Keystore security"] },
  { code: "SF-06", name: "Leading teams", note: "judgment, transferred", color: "#53c7f0", items: ["Architecture reviews", "Mentoring", "Agile / Scrum", "Hiring loops"] },
];

/* ── experience ──────────────────────────────────────── */
export const experience = [
  { year: "2026", title: "Independent — Senior Android Architect", text: "Architecture reviews, founding-engineer engagements, and MoekyawTranslator: regional language AI that runs on-device.", ach: "OPEN TO SENIOR & FOUNDING ROLES" },
  { year: "2024", title: "Technical Founder — POS Ultimate", text: "Took a merchant OS from prototype to 1,200 live stores across Myanmar and Thailand, with a dual-currency offline ledger.", ach: "1,200 STORES · 2 COUNTRIES" },
  { year: "2023", title: "Delivery Systems", text: "Built the release machinery: GitHub Actions, Fastlane signing, screenshot testing, staged rollouts, 90%+ coverage gates.", ach: "SHIP CYCLE: WEEKS → DAYS" },
  { year: "2022", title: "Architecture Lead", text: "Adopted Clean Architecture, Hilt, and Flow across the portfolio. Drove the multi-module split that cut build times 68%.", ach: "80+ MODULES · 6S INCREMENTAL BUILDS" },
  { year: "2021", title: "Compose Migration", text: "Moved production surfaces from XML to Jetpack Compose with MVI state handling and a shared design system.", ach: "3 APPS MIGRATED" },
  { year: "2019", title: "First Ship", text: "Java and XML. First Android app reached the Play Store — and taught me everything a first production app teaches.", ach: "FIRST PRODUCTION RELEASE" },
];

/* ── about ───────────────────────────────────────────── */
export type Segment = { t: string; strong?: boolean };
export const aboutParagraphs: Segment[][] = [
  [
    { t: "I'm " }, { t: "Moe", strong: true },
    { t: " — an Android architect from Tachileik, working between Myanmar and Thailand. For seven years I've built the systems behind products used by " },
    { t: "more than ten million people", strong: true },
    { t: ": retail infrastructure, realtime dashboards, media engines, and the occasional experiment that turned into a company." },
  ],
  [
    { t: "My work sits where product ambition meets hard constraints — intermittent networks, " },
    { t: "two currencies, 2GB handsets", strong: true },
    { t: ", and users who simply cannot afford a broken app. I like that pressure. It keeps architecture honest." },
  ],
  [
    { t: "I believe the best systems feel inevitable: " },
    { t: "calm under load, obvious to the next engineer, and boring to release", strong: true },
    { t: ". That's the standard I hold every module, pipeline, and team I shape." },
  ],
];

export const aboutFacts = [
  { k: "Based", v: "Tachileik ↔ Bangkok" },
  { k: "Focus", v: "Android at scale" },
  { k: "Status", v: "Open to work", accent: true },
  { k: "Building", v: "MoekyawTranslator" },
];

export const signals = [
  { k: "Senior staff roles", v: "yes" },
  { k: "Founding engineer", v: "yes" },
  { k: "Architecture reviews", v: "yes" },
  { k: "Response time", v: "< 24h" },
];

/* ── contact ─────────────────────────────────────────── */
export const emails = [
  "moekyawaung@programmer.net", "moekyawaung@engineer.com", "moekyawaung@technologist.com",
  "moekyawaung@techie.com", "moekyawaung@collector.org", "moekyawaung@hackermail.com",
  "moekyawaung@graduate.org", "moekyawaung@asia.com", "moekyawaung@contractor.net",
  "moekyawaung@linuxmail.org", "moekyawaung@mail.com", "moekyawaung@iname.com",
];

export const socials = [
  { name: "GitHub", url: "https://github.com/Dev-moe-kyawaung" },
  { name: "LinkedIn", url: "https://www.linkedin.com/in/moe-kyaw-aung-2653093a1" },
  { name: "YouTube", url: "https://www.youtube.com/channel/UCuTXUguZb4xjeL2nX8WJG" },
  { name: "Bluesky", url: "https://bsky.app/profile/moekyawaung96.bsky.social" },
  { name: "Gravatar", url: "https://gravatar.com/moekyawaung2026" },
  { name: "Vimeo", url: "https://vimeo.com/user252414232" },
  { name: "Tumblr", url: "https://www.tumblr.com/moekyawaung" },
  { name: "Flickr", url: "https://www.flickr.com/people/204037451@N06" },
];
