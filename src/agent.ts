/* ═══════════════════════════════════════════════════════
   AURA — hologram entity agent
   Reads the omni-sphere registry, parses intent, retrieves
   relevant flagship projects, computes aggregates, and
   answers with cited telemetry. Runs entirely locally.
   ═══════════════════════════════════════════════════════ */

import { omniProjects, profile, skills, type OmniProject } from "./data";

export type Citation = { code: string; title: string };
export type AgentAnswer = {
  heading: string;
  body: string[];
  cites: Citation[];
  metrics?: { value: string; label: string }[];
  follow: string[];
};

const STOP = new Set([
  "what", "is", "are", "the", "a", "an", "of", "in", "on", "with", "and", "or", "about",
  "can", "you", "tell", "me", "which", "how", "do", "does", "did", "project", "projects",
  "app", "apps", "system", "systems", "use", "uses", "using", "work", "works", "worked",
  "built", "build", "my", "i", "we", "they", "it", "its", "for", "to", "as", "at", "be",
  "by", "this", "that", "from", "have", "has", "had", "will", "would", "could", "should",
  "more", "most", "biggest", "largest", "best", "many", "much", "than", "then", "into",
  "explain", "show", "sphere", "node", "nodes", "flagship", "omni",
]);

const SYNONYMS: Record<string, string[]> = {
  kmp: ["kmp", "multiplatform", "kotlin multiplatform", "compose multiplatform"],
  compose: ["compose", "jetpack compose", "compose multiplatform", "material"],
  design: ["design system", "token", "tokens", "figma", "component", "components", "accessibility", "a11y"],
  ai: ["ai", "ml", "lite", "litert", "litert-lm", "gemini", "nano", "on-device", "local model", "llm", "model"],
  agentic: ["agent", "agentic", "planner", "plan", "steps", "task", "tasks", "workmanager", "override"],
  web: ["react", "vite", "three", "r3f", "gsap", "pwa", "portfolio", "3d", "shader", "shaders", "offline"],
  foldable: ["foldable", "fold", "folding", "tablet", "large screen", "window", "posture", "hinge", "media", "media3", "exoplayer", "player"],
  carbon: ["carbon", "co2", "energy", "battery", "benchmark", "lighthouse", "dark mode", "vector", "budget"],
  architecture: ["architecture", "clean", "module", "modules", "modular", "scalab", "scale", "di", "hilt", "dagger"],
  security: ["security", "secure", "encrypt", "keystore", "tls", "pinning", "owasp", "privacy", "drm"],
  performance: ["performance", "perf", "latency", "cold start", "memory", "oom", "benchmark", "fps"],
  contact: ["contact", "email", "hire", "reach", "talk", "connect", "phone", "hotline"],
  about: ["about", "who", "moe", "background"],
  certs: ["cert", "certs", "certificate", "certificates", "credential", "programming hub"],
  skills: ["skill", "skills", "stack", "tech", "technology", "capability", "matrix"],
  experience: ["experience", "career", "history", "worked", "roadmap", "timeline"],
};

function tokenize(q: string): string[] {
  return q.toLowerCase().split(/[^a-z0-9+#.\-]+/).filter(Boolean);
}

function expand(tokens: string[]): Set<string> {
  const out = new Set<string>();
  for (const t of tokens) {
    if (STOP.has(t)) continue;
    out.add(t);
    for (const key of Object.keys(SYNONYMS)) {
      let matched = false;
      for (const s of SYNONYMS[key]) {
        if (s === t || s.startsWith(t) || (t.length > 3 && s.includes(t))) {
          matched = true;
          break;
        }
      }
      if (matched) {
        out.add(key);
      }
    }
  }
  return out;
}

function scoreProject(p: OmniProject, terms: Set<string>): number {
  let s = 0;
  const hay: Array<[string, number]> = [
    [p.title, 5], [p.category, 4], [p.tagline, 3], [p.problem, 2], [p.architecture, 2],
    [p.outcome, 2], [p.security, 1], [p.telemetry, 1],
  ];
  for (const [text, w] of hay) {
    const lower = text.toLowerCase();
    for (const t of terms) {
      if (lower.includes(t)) s += w;
    }
  }
  for (const st of p.stack) {
    const lower = st.toLowerCase();
    for (const t of terms) {
      if (lower.includes(t)) s += 3;
    }
  }
  for (const d of p.decisions) {
    const lower = d.toLowerCase();
    for (const t of terms) {
      if (lower.includes(t)) s += 1.5;
    }
  }
  return s;
}

const cite = (p: OmniProject): Citation => ({ code: p.code, title: p.title });

const FOLLOW = [
  "Explain the KMP design system",
  "How does the on-device AI work?",
  "Walk me through the agentic planner",
  "Why is the portfolio 3D?",
  "How do you handle foldables?",
  "How do I hire you?",
];

function followFrom(seed: string, n = 2): string[] {
  const pool = [...FOLLOW];
  let h = 0;
  for (const ch of seed) {
    h = (h * 31 + ch.charCodeAt(0)) >>> 0;
  }
  for (let i = pool.length - 1; i > 0; i--) {
    h = (h * 1103515245 + 12345) >>> 0;
    const j = h % (i + 1);
    const tmp = pool[i];
    pool[i] = pool[j];
    pool[j] = tmp;
  }
  return pool.slice(0, n);
}

function intentOf(q: string): string {
  const s = q.toLowerCase();
  if (/(contact|email|hire|reach|talk|connect|available|open to)/.test(s)) return "contact";
  if (/(about|who are you|yourself|background|story)/.test(s)) return "about";
  if (/(cert|credential|programming hub)/.test(s)) return "certs";
  if (/(skill|stack|tech|capability|matrix)/.test(s)) return "skills";
  if (/(experience|career|history|roadmap|timeline|worked)/.test(s)) return "experience";
  if (/(kmp|multiplatform|design system|token|figma|component)/.test(s)) return "kmp";
  if (/(on-device|litert|local model|privacy|egress|ai assistant|code assistant)/.test(s)) return "ai";
  if (/(agent|agentic|planner|task manager|override)/.test(s)) return "agentic";
  if (/(react|vite|three|r3f|gsap|pwa|shader)/.test(s)) return "web";
  if (/(foldable|fold|tablet|large screen|window|posture|hinge|media3|player)/.test(s)) return "foldable";
  if (/(carbon|co2|energy|battery|lighthouse|budget)/.test(s)) return "carbon";
  if (/(architecture|module|modular|scale|clean|di|hilt)/.test(s)) return "architecture";
  if (/(security|encrypt|keystore|tls|pinning|owasp|drm)/.test(s)) return "security";
  if (/(performance|latency|cold start|memory|oom|fps)/.test(s)) return "performance";
  if (/(sphere|node|orbit|omni|how many|list|show all)/.test(s)) return "sphere";
  return "retrieve";
}

function find(id: string): OmniProject {
  const p = omniProjects.find(x => x.id === id);
  if (!p) {
    throw new Error("Unknown project: " + id);
  }
  return p;
}

export function ask(question: string): AgentAnswer {
  const q = question.trim();
  if (q.length < 2) {
    return {
      heading: "AURA hologram online",
      body: [
        "I am projected into the omni-sphere. Ask about any flagship system — KMP design system, on-device AI, agentic planner, 3D portfolio, foldable media, or carbon-aware architecture.",
      ],
      cites: [],
      follow: FOLLOW.slice(0, 3),
    };
  }

  const it = intentOf(q);
  const terms = expand(tokenize(q));
  const ranked = omniProjects
    .map(p => ({ p, s: scoreProject(p, terms) }))
    .filter(x => x.s > 0)
    .sort((a, b) => b.s - a.s);
  const FM = followFrom(q, 3);

  if (it === "contact") {
    return {
      heading: "Comms frequencies open",
      body: [
        `Direct signal to Moe Kyaw Aung: ${profile.email} — replies within 24 hours. Voice lines on file: ${profile.phone} and ${profile.secondPhone}.`,
        `He operates between ${profile.location}, currently ${profile.availability.toLowerCase()} for senior Android roles, founding-engineer positions, architecture reviews, and focused KMP work.`,
      ],
      cites: [],
      metrics: [
        { value: "< 24h", label: "response window" },
        { value: "2", label: "voice lines" },
      ],
      follow: FM,
    };
  }

  if (it === "about") {
    return {
      heading: "Operator profile — Moe Kyaw Aung",
      body: [
        "Moe is a Senior Android Developer from Tachileik, operating between Myanmar and Thailand. Seven years building systems behind products used by more than ten million people: retail infrastructure, realtime dashboards, media engines, and on-device AI.",
        "His current focus is KMP architecture — a publishable design system shared across Android and desktop, and an on-device code assistant with zero data egress. Philosophy on record: “" + profile.philosophy + "”",
      ],
      cites: [cite(find("kmp-ds")), cite(find("on-device-ai")), cite(find("3d-portfolio"))],
      follow: FM,
    };
  }

  if (it === "certs") {
    return {
      heading: "Verified credentials",
      body: [
        "82+ certificates from Programming Hub across nine domains: Programming, Mobile, Web Dev, Databases, AI/ML, Security, Blockchain, Software Engineering, and Business. Plus Google Developers Launchpad alumnus.",
        "Every record in the archive panel carries a credential ID and a direct verification link — no vanity numbers.",
      ],
      cites: [],
      follow: FM,
    };
  }

  if (it === "skills") {
    const groups = skills.map(s => s.group).join(", ");
    return {
      heading: "Capability matrix",
      body: [
        `Seven capability groups on file: ${groups}.`,
        "The spine is Kotlin + Compose Multiplatform, Clean Architecture with multi-module isolation, Hilt for compile-time wiring, Room as offline ground truth, WorkManager for budgeted background work, and LiteRT-LM / Gemini Nano for on-device intelligence.",
      ],
      cites: [cite(find("kmp-ds")), cite(find("on-device-ai"))],
      follow: FM,
    };
  }

  if (it === "experience") {
    return {
      heading: "Flight record",
      body: [
        "2019 — First Play Store release (Java/XML). 2021 — Compose migration across three production apps with zero regressions. 2022 — Architecture Lead: Clean Architecture, Hilt, 80+ module split cutting build times 68%. 2023 — Delivery & Performance Lead: GitHub Actions, Fastlane, 620ms cold-start P90. 2024 — Technical Founder of POS Ultimate, 1,200 stores. 2026 — Independent KMP + on-device AI architecture.",
      ],
      cites: [cite(find("kmp-ds")), cite(find("carbon-aware"))],
      follow: FM,
    };
  }

  if (it === "kmp" || it === "ai" || it === "agentic" || it === "web" || it === "foldable" || it === "carbon") {
    const id = it === "kmp" ? "kmp-ds"
      : it === "ai" ? "on-device-ai"
      : it === "agentic" ? "agentic-tasks"
      : it === "web" ? "3d-portfolio"
      : it === "foldable" ? "foldable-media" : "carbon-aware";
    const p = find(id);
    return {
      heading: `${p.title} — ${p.category}`,
      body: [p.problem, p.architecture, p.outcome],
      cites: [cite(p)],
      metrics: p.metrics,
      follow: FM,
    };
  }

  if (it === "architecture") {
    return {
      heading: "Architecture blueprint",
      body: [
        "Strict dependency direction: the domain layer is pure Kotlin and knows nothing about Android. Feature modules (:feature:*) sit over core modules (:core:domain, :core:data, :core:network), wired by Hilt. Room is the ground truth; the network is a reconciler.",
        "Multi-module by default: 80+ Gradle modules, version catalogs, ~6-second incremental builds. Shared code targets Android and desktop via Kotlin Multiplatform.",
      ],
      cites: [cite(find("kmp-ds")), cite(find("carbon-aware"))],
      metrics: [
        { value: "80+", label: "modules" },
        { value: "6s", label: "incremental build" },
        { value: "68%", label: "faster builds" },
      ],
      follow: FM,
    };
  }

  if (it === "security") {
    return {
      heading: "Security posture",
      body: [
        "Keystore-backed AES-256 GCM at rest, TLS 1.3 with certificate pinning in transit, biometric gates, R8 obfuscation, OWASP MASVS-aligned review, and Widevine DRM for protected media.",
        "On-device AI keeps prompts and completions local — zero source egress — and the carbon template makes all telemetry opt-in.",
      ],
      cites: [cite(find("on-device-ai")), cite(find("foldable-media"))],
      follow: FM,
    };
  }

  if (it === "performance") {
    return {
      heading: "Performance engineering",
      body: [
        "Cold-start P90 cut to 620ms; OOM crashes reduced through bitmap lifecycle discipline and strict memory budgeting for 2GB devices.",
        "Guarded in CI by Jetpack Benchmark traces, screenshot tests, and Lighthouse CI so regressions are caught before release, not after.",
      ],
      cites: [cite(find("carbon-aware")), cite(find("3d-portfolio"))],
      metrics: [
        { value: "620ms", label: "cold-start P90" },
        { value: "60", label: "fps target" },
      ],
      follow: FM,
    };
  }

  if (it === "sphere") {
    const stackCount = omniProjects.reduce((a, p) => a + p.stack.length, 0);
    return {
      heading: "Omni-sphere manifest",
      body: [
        `${omniProjects.length} flagship nodes are tracked on the sphere. Aggregate telemetry: ${stackCount} tracked stack entries and a shared KMP spine across Android and desktop.`,
        "Rotate the sphere to inspect each node; select one to open its multi-layer case study.",
      ],
      cites: omniProjects.map(cite),
      follow: FM,
    };
  }

  if (ranked.length === 0) {
    return {
      heading: "No matching telemetry",
      body: [
        "The registry covers six flagship systems: the KMP design system, on-device AI code assistant, agentic task manager, 3D interactive portfolio, foldable-first media app, and carbon-aware template. Ask about one of those — or about architecture, security, or contact.",
      ],
      cites: [],
      follow: FOLLOW.slice(0, 3),
    };
  }

  const top = ranked.slice(0, 3).map(x => x.p);
  return {
    heading: `Telemetry on “${q}”`,
    body: top.map(p => `${p.code} ${p.title} — ${p.tagline}`),
    cites: top.map(cite),
    follow: FM,
  };
}

export const SUGGESTED = [
  "Explain the KMP design system",
  "How does the on-device AI work?",
  "Walk me through the agentic planner",
  "Why is the portfolio a 3D sphere?",
  "How do you handle foldables?",
  "How do I hire you?",
];
