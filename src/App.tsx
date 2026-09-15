import { useEffect, useMemo, useRef, useState } from "react";
import { TypeAnimation } from "react-type-animation";
import { FiX, FiExternalLink, FiGithub, FiSearch, FiTerminal, FiGlobe, FiActivity, FiPlay, FiCheck, FiCopy } from "react-icons/fi";
import {
  profile, omniProjects, skills, experience, achievements, verifiedCertificates, socials, emails, githubAccounts, lovableWebApps, mediaShowcase,
} from "./data";
import OmniSphere from "./components/OmniSphere";
import { Assistant } from "./components/Assistant";
import { CodeRain } from "./components/kinetic";

const NAV = [
  { id: "sphere", label: "SPHERE" },
  { id: "capability", label: "CAPABILITY" },
  { id: "record", label: "RECORD" },
  { id: "certs", label: "CERTS" },
  { id: "network", label: "NETWORK" },
  { id: "contact", label: "CONTACT" },
];

/* ── Scroll reveal (depth-based transition) ── */
function Reveal({ children, delay = 0, className = "" }: { children: React.ReactNode; delay?: number; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      entries => {
        entries.forEach(e => {
          if (e.isIntersecting) {
            setVisible(true);
            io.unobserve(el);
          }
        });
      },
      { threshold: 0.08 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);
  return (
    <div
      ref={ref}
      className={`reveal ${visible ? "is-visible" : ""} ${className}`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </div>
  );
}

export default function App() {
  const [focusId, setFocusId] = useState<string | null>(null);
  const [isCaseOpen, setIsCaseOpen] = useState(false);
  const [activeLayer, setActiveLayer] = useState<"PROBLEM" | "APPROACH" | "ARCHITECTURE" | "IMPACT">("PROBLEM");
  const [certSearch, setCertSearch] = useState("");
  const [certSector, setCertSector] = useState("All Sectors");
  const [copiedText, setCopiedText] = useState<string | null>(null);
  const [activeNav, setActiveNav] = useState("hero");
  const [progress, setProgress] = useState(0);
  const [menuOpen, setMenuOpen] = useState(false);

  const focusProject = useMemo(() => omniProjects.find(p => p.id === focusId) ?? null, [focusId]);
  const totalStack = useMemo(() => omniProjects.reduce((sum, p) => sum + p.stack.length, 0), []);

  /* Scroll spy + progress */
  useEffect(() => {
    const onScroll = () => {
      const doc = document.documentElement;
      setProgress(doc.scrollTop / Math.max(1, doc.scrollHeight - doc.clientHeight));
      const ids = ["hero", "sphere", "capability", "record", "certs", "network", "contact"];
      for (const id of ids) {
        const el = document.getElementById(id);
        if (el) {
          const rect = el.getBoundingClientRect();
          if (rect.top <= 130 && rect.bottom >= 130) {
            setActiveNav(id);
            break;
          }
        }
      }
    };
    onScroll();
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  /* Lock scroll when modal open */
  useEffect(() => {
    document.body.style.overflow = isCaseOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [isCaseOpen]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setIsCaseOpen(false);
        setMenuOpen(false);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const scrollTo = (id: string) => {
    setMenuOpen(false);
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  };

  const openCase = (id: string) => {
    setFocusId(id);
    setActiveLayer("PROBLEM");
    setIsCaseOpen(true);
  };

  const copy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedText(text);
    setTimeout(() => setCopiedText(null), 2200);
  };

  const filteredCerts = useMemo(() => {
    return verifiedCertificates.filter(c => {
      const matchSector = certSector === "All Sectors" || c.cat === certSector;
      const matchSearch =
        c.name.toLowerCase().includes(certSearch.toLowerCase()) || c.id.includes(certSearch);
      return matchSector && matchSearch;
    });
  }, [certSearch, certSector]);

  const certSectors = ["All Sectors", ...achievements.certifications.groups.map(g => g.name)];

  return (
    <div className="omni-root">
      {/* ambient layers */}
      <CodeRain opacity={0.22} />
      <div className="volumetric-beam" aria-hidden />
      <div className="holo-scanline" aria-hidden />
      <div className="holo-vignette" aria-hidden />

      {/* progress */}
      <div className="scroll-progress" style={{ width: `${progress * 100}%` }} />

      {/* ══ NAV ══ */}
      <header className="top-nav">
        <div className="nav-inner">
          <button className="brand" onClick={() => scrollTo("hero")} type="button">
            <span className="brand-glyph">◉</span>
            <span className="brand-text">
              <b>OMNI-SPHERE</b>
              <small>{profile.name} · Senior Android Architect</small>
            </span>
          </button>

          <nav className="nav-links">
            {NAV.map(n => (
              <button
                key={n.id}
                onClick={() => scrollTo(n.id)}
                className={`nav-link ${activeNav === n.id ? "active" : ""}`}
                type="button"
              >
                {n.label}
              </button>
            ))}
          </nav>

          <div className="nav-right">
            <button className="btn-ghost-nav" onClick={() => scrollTo("sphere")} type="button">
              <FiTerminal /> SPHERE
            </button>
            <button className="nav-burger" onClick={() => setMenuOpen(v => !v)} type="button" aria-label="Menu">
              {menuOpen ? <FiX /> : <FiGlobe />}
            </button>
          </div>
        </div>

        {menuOpen && (
          <div className="mobile-nav">
            {NAV.map(n => (
              <button key={n.id} onClick={() => scrollTo(n.id)} type="button">
                {n.label}
              </button>
            ))}
          </div>
        )}
      </header>

      {/* ══ HERO ══ */}
      <section id="hero" className="hero-section">
        <div className="hero-grid">
          <div className="hero-copy">
            <div className="status-pill">
              <span className="live-dot" /> AVAILABLE FOR SENIOR &amp; FOUNDING ROLES
            </div>

            <p className="hero-name-meta">{profile.nameMM} // {profile.name}</p>
            <h1 className="hero-title">
              OMNI-SPHERE<br />
              <span className="neon-cyan">HOLOGRAPHIC</span> SYSTEMS
            </h1>

            <div className="hero-type">
              <span className="prompt">◉</span>
              <TypeAnimation
                sequence={[
                  "Six flagship architectures projected in depth.",
                  2500,
                  "KMP design system · on-device AI · agentic planner.",
                  2500,
                  "Foldable-first media · carbon-aware engineering.",
                  2500,
                  "10M+ users reached · 99.98% crash-free.",
                  2500,
                ]}
                speed={55}
                repeat={Infinity}
              />
            </div>

            <p className="hero-desc">
              Senior Android &amp; KMP architect based between Tachileik and Bangkok. I design 
              layered systems — shared design languages, on-device intelligence, and budgeted 
              background work — so products stay fast, private, and provably scalable.
            </p>

            <div className="hero-ctas">
              <button className="btn-neon" onClick={() => scrollTo("sphere")} type="button">
                <FiGlobe /> ENTER THE SPHERE
              </button>
              <button className="btn-neon-pink" onClick={() => openCase("kmp-ds")} type="button">
                <FiActivity /> OPEN CASE STUDY
              </button>
              <a className="btn-ghost" href={profile.github} target="_blank" rel="noreferrer">
                <FiGithub /> GITHUB
              </a>
            </div>

            <div className="hero-badges">
              <span className="badge">{profile.languages}</span>
              <span className="badge">NOW BUILDING — {profile.building}</span>
            </div>
          </div>

          {/* Hologram portrait */}
          <Reveal className="hero-portrait-wrap" delay={120}>
            <div className="holo-portrait">
              <div className="portrait-frame">
                <img src={profile.avatar} alt={profile.name} />
                <div className="portrait-overlay" />
                <span className="corner tl" />
                <span className="corner tr" />
                <span className="corner bl" />
                <span className="corner br" />
                <div className="portrait-caption">
                  <span>{profile.title}</span>
                  <span>Tachileik ⇄ Bangkok</span>
                </div>
              </div>
              <div className="portrait-meta">
                <div>
                  <span>REACH</span>
                  <b className="neon-cyan">10M+ USERS</b>
                </div>
                <div>
                  <span>STABILITY</span>
                  <b>99.98% CRASH-FREE</b>
                </div>
              </div>
            </div>
          </Reveal>
        </div>

        {/* stats strip */}
        <div className="stats-strip">
          {[
            { value: "6", label: "FLAGSHIP SYSTEMS", sub: "projected as nodes" },
            { value: "82+", label: "CERTIFICATIONS", sub: "verified credentials" },
            { value: String(totalStack), label: "STACK ENTRIES", sub: "tracked across nodes" },
            { value: "99.98%", label: "CRASH-FREE", sub: "production SLA" },
          ].map(s => (
            <div className="stat-cell" key={s.label}>
              <b>{s.value}</b>
              <span>{s.label}</span>
              <small>{s.sub}</small>
            </div>
          ))}
        </div>
      </section>

      {/* ══ OMNI-SPHERE ══ */}
      <section id="sphere" className="sphere-section">
        <div className="section-head">
          <Reveal>
            <p className="sec-kicker">◉ OMNI-SPHERE // SIX FLAGSHIP NODES</p>
            <h2 className="sec-title">
              ROTATING <span className="neon-cyan">SPHERE</span>
            </h2>
            <p className="sec-note">
              Drag to rotate. Select any holographic node to open its multi-layer case study — 
              problem, constraints, approach, architecture, code, telemetry and security.
            </p>
          </Reveal>
        </div>

        <div className="sphere-stage">
          {/* volumetric light cone */}
          <div className="light-cone" aria-hidden />

          <Reveal className="sphere-canvas-wrap" delay={80}>
            <div className="holo-sphere-frame">
              <div className="holo-canvas-inner">
                <OmniSphere
                  projects={omniProjects}
                  activeId={focusId}
                  onSelect={openCase}
                />
              </div>
              <div className="holo-frame-label">
                <span>SPHERE · 6 NODES · DRAG TO ORBIT</span>
                <span className="neon-cyan">VOLUMETRIC LIGHT ACTIVE</span>
              </div>
            </div>
          </Reveal>

          {/* layered focus panel (depth-based) */}
          <Reveal className="focus-panel-wrap" delay={160}>
            <div className="depth-stage">
              <div className="holo-layer holo-layer-back">
                <div className="holo-panel focus-panel">
                  <div className="focus-head">
                    <span className="focus-code">
                      {focusProject ? focusProject.code : "ALL"}
                    </span>
                    <h3>{focusProject ? focusProject.title : "Omni-sphere aggregate"}</h3>
                    <p className="focus-cat">
                      {focusProject ? focusProject.category : "Six flagship architectures on one shared KMP spine"}
                    </p>
                  </div>

                  <p className="focus-tagline">
                    {focusProject
                      ? focusProject.tagline
                      : "Select a node to inspect its live sensors and open the layered case study."}
                  </p>

                  {/* sensor readout */}
                  <div className="sensor-list">
                    {(focusProject ? [focusProject.sensors] : omniProjects.map(p => p.sensors)).map((s, i) => (
                      <div className="sensor-row" key={`${s.label}-${i}`}>
                        <div className="sensor-meta">
                          <span className="sensor-label">{s.label}</span>
                          <span className="sensor-value">{s.value}</span>
                        </div>
                        <div className="sensor-bar">
                          <span style={{ width: `${Math.max(6, Math.min(100, s.pct))}%` }} />
                        </div>
                      </div>
                    ))}
                  </div>

                  {focusProject && (
                    <button className="btn-neon w-full" onClick={() => openCase(focusProject.id)} type="button">
                      OPEN MULTI-LAYER CASE STUDY
                    </button>
                  )}
                </div>
              </div>

              {focusProject && (
                <div className="holo-layer holo-layer-front">
                  <div className="holo-panel focus-mini">
                    <span className="focus-mini-label">LAYER MODEL</span>
                    <b>{focusProject.layers.name}</b>
                    <p>{focusProject.layers.detail}</p>
                  </div>
                </div>
              )}
            </div>
          </Reveal>
        </div>

        {/* floating hologram node cards */}
        <div className="node-grid">
          {omniProjects.map((p, i) => (
            <Reveal key={p.id} delay={i * 70}>
              <button
                className="node-card"
                onClick={() => openCase(p.id)}
                type="button"
                style={{ borderColor: `${p.accent}55` }}
              >
                <span className="node-glow" style={{ background: p.accent }} />
                <div className="node-top">
                  <span className="node-code" style={{ color: p.accent }}>{p.code}</span>
                  <span className="node-cat">{p.category}</span>
                </div>
                <h3>{p.title}</h3>
                <p className="node-tagline">{p.tagline}</p>
                <div className="node-metrics">
                  {p.metrics.map(m => (
                    <span key={m.label}>
                      <b style={{ color: p.accent }}>{m.value}</b>
                      <small>{m.label}</small>
                    </span>
                  ))}
                </div>
              </button>
            </Reveal>
          ))}
        </div>
      </section>

      {/* ══ CAPABILITY ══ */}
      <section id="capability" className="capability-section">
        <div className="section-head">
          <Reveal>
            <p className="sec-kicker">◉ CAPABILITY MATRIX // SEVEN DOMAINS</p>
            <h2 className="sec-title">SKILLS THAT <span className="neon-cyan">SCALE</span></h2>
          </Reveal>
        </div>

        <div className="capability-grid">
          {skills.map((s, i) => (
            <Reveal key={s.code} delay={i * 60}>
              <div className="holo-panel capability-card">
                <div className="cap-head">
                  <span className="cap-code">{s.code}</span>
                  <span className="cap-note">{s.note}</span>
                </div>
                <h3>{s.group}</h3>
                <div className="cap-items">
                  {s.items.map(it => (
                    <span key={it}>{it}</span>
                  ))}
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* ══ RECORD ══ */}
      <section id="record" className="record-section">
        <div className="section-head">
          <Reveal>
            <p className="sec-kicker">◉ FLIGHT RECORD // SEVEN YEARS</p>
            <h2 className="sec-title">ENGINEERING <span className="neon-cyan">TIMELINE</span></h2>
          </Reveal>
        </div>

        <div className="timeline">
          {experience.map(e => (
            <Reveal key={e.year}>
              <div className="timeline-row holo-panel">
                <div className="tl-year">{e.year}</div>
                <div className="tl-body">
                  <h3>{e.title}</h3>
                  <p className="tl-org">{e.org}</p>
                  <p className="tl-text">{e.text}</p>
                  <div className="tl-tags">
                    {e.tags.map(t => (
                      <span key={t}>#{t}</span>
                    ))}
                  </div>
                </div>
                <div className="tl-ach">{e.ach}</div>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* ══ CERTS ══ */}
      <section id="certs" className="certs-section">
        <div className="section-head">
          <Reveal>
            <p className="sec-kicker">◉ VERIFIED CREDENTIALS // 82+ RECORDS</p>
            <h2 className="sec-title">CERTIFICATION <span className="neon-cyan">ARCHIVE</span></h2>
            <p className="sec-note">
              Programming Hub credentials across nine engineering domains, each with a verifiable record ID.
            </p>
          </Reveal>
        </div>

        <Reveal>
          <div className="cert-controls">
            <div className="cert-search">
              <FiSearch />
              <input
                value={certSearch}
                onChange={e => setCertSearch(e.target.value)}
                placeholder="SEARCH CREDENTIALS BY NAME OR ID..."
              />
            </div>
            <div className="cert-filters">
              {certSectors.map(s => (
                <button
                  key={s}
                  onClick={() => setCertSector(s)}
                  className={certSector === s ? "cert-filter active" : "cert-filter"}
                  type="button"
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
        </Reveal>

        <div className="cert-grid">
          {filteredCerts.map((c, i) => (
            <Reveal key={`${c.id}-${i}`} delay={Math.min(i * 20, 400)}>
              <div className="holo-panel cert-card">
                <div className="cert-top">
                  <span className="cert-date">{c.date}</span>
                  <span className="cert-id">#{c.id.slice(-6)}</span>
                </div>
                <h4>{c.name}</h4>
                <p className="cert-cat">{c.cat}</p>
                <div className="cert-foot">
                  <span className="verified">
                    <FiCheck /> VERIFIED
                  </span>
                  <a
                    href={`https://www.programminghub.io/certificate?id=${c.id}`}
                    target="_blank"
                    rel="noreferrer"
                  >
                    VERIFY ↗
                  </a>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* ══ NETWORK ══ */}
      <section id="network" className="network-section">
        <div className="section-head">
          <Reveal>
            <p className="sec-kicker">◉ PORTAL MESH // GLOBAL FOOTPRINT</p>
            <h2 className="sec-title">REPOSITORIES &amp; <span className="neon-cyan">DEPLOYMENTS</span></h2>
          </Reveal>
        </div>

        <Reveal>
          <div className="network-block">
            <h3 className="net-head">
              <FiGithub /> {githubAccounts.length} GITHUB ACCOUNTS
            </h3>
            <div className="net-grid">
              {githubAccounts.map(g => (
                <a key={g} href={`https://github.com/${g}`} target="_blank" rel="noreferrer">
                  <span>{g}</span>
                  <FiExternalLink />
                </a>
              ))}
            </div>
          </div>
        </Reveal>

        <Reveal>
          <div className="network-block">
            <h3 className="net-head">
              <FiGlobe /> {lovableWebApps.length} DEPLOYED WEB APPLICATIONS
            </h3>
            <div className="net-grid web">
              {lovableWebApps.map(a => (
                <a key={a.name} href={a.url} target="_blank" rel="noreferrer">
                  <span>{a.name}</span>
                  <FiExternalLink />
                </a>
              ))}
            </div>
          </div>
        </Reveal>

        <Reveal>
          <div className="network-block">
            <h3 className="net-head">
              <FiPlay /> STUDIO RIGS &amp; VISUAL ARCHIVE
            </h3>
            <div className="media-grid">
              {mediaShowcase.map((m, i) =>
                m.type === "video" ? (
                  <a key={i} href={m.url} target="_blank" rel="noreferrer" className="media-tile video">
                    <FiPlay />
                    <span>{m.title}</span>
                    <small>{m.tag}</small>
                  </a>
                ) : (
                  <a key={i} href={m.url} target="_blank" rel="noreferrer" className="media-tile">
                    <img src={m.url} alt={m.title} loading="lazy" />
                    <div className="media-overlay">
                      <span>{m.title}</span>
                      <small>{m.tag}</small>
                    </div>
                  </a>
                )
              )}
            </div>
          </div>
        </Reveal>
      </section>

      {/* ══ CONTACT ══ */}
      <section id="contact" className="contact-section">
        <div className="section-head">
          <Reveal>
            <p className="sec-kicker">◉ DISPATCH TERMINAL // DIRECT LINES</p>
            <h2 className="sec-title">ESTABLISH <span className="neon-cyan">COMMUNICATION</span></h2>
            <p className="sec-note">
              Open to senior Android / KMP architect roles, founding-engineer positions, and 
              focused architecture reviews. Replies within 24 hours.
            </p>
          </Reveal>
        </div>

        <div className="contact-grid">
          <Reveal>
            <div className="holo-panel contact-panel">
              <div className="ct-head">
                <span className="ct-label">VOICE HOTLINES</span>
                <a className="ct-value" href={`tel:${profile.phone.replace(/\s/g, "")}`}>
                  {profile.phone}
                </a>
                <a className="ct-value" href={`tel:${profile.secondPhone.replace(/\s/g, "")}`}>
                  {profile.secondPhone}
                </a>
              </div>
              <div className="ct-body">
                <span className="ct-label">PRIMARY INBOX</span>
                <a className="ct-email" href={`mailto:${profile.email}`}>
                  {profile.email}
                </a>
                <div className="ct-meta">
                  <div>
                    <span>base</span>
                    <b>{profile.location}</b>
                  </div>
                  <div>
                    <span>github</span>
                    <b>Dev-moe-kyawaung</b>
                  </div>
                </div>
              </div>
            </div>
          </Reveal>

          <Reveal delay={80}>
            <div className="holo-panel contact-panel">
              <div className="ct-head">
                <span className="ct-label">{emails.length} EMAIL CHANNELS</span>
                <span className="ct-hint">click any address to copy</span>
              </div>
              <div className="email-grid">
                {emails.map(e => (
                  <button
                    key={e}
                    className="email-chip"
                    onClick={() => copy(e)}
                    type="button"
                    title="Copy to clipboard"
                  >
                    <span>{e}</span>
                    {copiedText === e ? <FiCheck /> : <FiCopy />}
                  </button>
                ))}
              </div>
              {copiedText && <div className="copied-toast">COPIED — {copiedText}</div>}
            </div>
          </Reveal>

          <Reveal delay={160}>
            <div className="holo-panel contact-panel">
              <div className="ct-head">
                <span className="ct-label">{socials.length} VERIFIED CHANNELS</span>
              </div>
              <div className="social-grid">
                {socials.map(s => (
                  <a key={s.name} href={s.url} target="_blank" rel="noreferrer">
                    <FiGlobe />
                    <span>{s.name}</span>
                  </a>
                ))}
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ══ FOOTER ══ */}
      <footer className="site-footer">
        <div className="footer-inner">
          <div>
            <p className="footer-brand">
              <span className="live-dot" /> OMNI-SPHERE // MOE KYAW AUNG (မိုးကျော်အောင်)
            </p>
            <p className="footer-sub">
              Senior Android &amp; KMP Architect · Tachileik 🇲🇲 ↔ Bangkok 🇹🇭
            </p>
          </div>
          <div className="footer-right">
            <p className="footer-meta">“{profile.philosophy}”</p>
            <p className="footer-copy">© 2026 MOE KYAW AUNG. ALL SYSTEMS NOMINAL.</p>
          </div>
        </div>
      </footer>

      {/* ══ MULTI-LAYER CASE STUDY MODAL ══ */}
      {isCaseOpen && focusProject && (
        <div className="case-overlay" onClick={() => setIsCaseOpen(false)} role="presentation">
          <div className="case-modal" onClick={e => e.stopPropagation()}>
            <div className="case-head">
              <div>
                <span className="case-code" style={{ color: focusProject.accent }}>
                  {focusProject.code} · {focusProject.category}
                </span>
                <h2>{focusProject.title}</h2>
                <p className="case-tagline">{focusProject.tagline}</p>
              </div>
              <button className="case-close" onClick={() => setIsCaseOpen(false)} type="button" aria-label="Close case study">
                <FiX />
              </button>
            </div>

            {/* layer tabs */}
            <div className="layer-tabs">
              {(["PROBLEM", "APPROACH", "ARCHITECTURE", "IMPACT"] as const).map(tab => (
                <button
                  key={tab}
                  className={activeLayer === tab ? "layer-tab active" : "layer-tab"}
                  onClick={() => setActiveLayer(tab)}
                  type="button"
                >
                  {tab}
                </button>
              ))}
            </div>

            <div className="case-body">
              {activeLayer === "PROBLEM" && (
                <>
                  <h3 className="blk-label">THE PROBLEM</h3>
                  <p className="blk-text">{focusProject.problem}</p>
                  <h3 className="blk-label">CONSTRAINTS</h3>
                  <ul className="blk-list">
                    {focusProject.constraints.map(c => (
                      <li key={c}>{c}</li>
                    ))}
                  </ul>
                </>
              )}

              {activeLayer === "APPROACH" && (
                <>
                  <h3 className="blk-label">APPROACH</h3>
                  <ul className="blk-list">
                    {focusProject.approach.map(a => (
                      <li key={a}>{a}</li>
                    ))}
                  </ul>
                  <h3 className="blk-label">KEY DECISIONS</h3>
                  <ul className="blk-list alt">
                    {focusProject.decisions.map(d => (
                      <li key={d}>{d}</li>
                    ))}
                  </ul>
                </>
              )}

              {activeLayer === "ARCHITECTURE" && (
                <>
                  <h3 className="blk-label">LAYER MODEL — {focusProject.layers.name}</h3>
                  <p className="blk-text">{focusProject.layers.detail}</p>
                  <p className="blk-text">{focusProject.architecture}</p>
                  <pre className="holo-code">
                    <code>{focusProject.snippet}</code>
                  </pre>
                  <div className="chip-row">
                    {focusProject.stack.map(s => (
                      <span className="chip" key={s}>{s}</span>
                    ))}
                  </div>
                </>
              )}

              {activeLayer === "IMPACT" && (
                <>
                  <h3 className="blk-label">TELEMETRY</h3>
                  <p className="blk-text">{focusProject.telemetry}</p>
                  <div className="metric-row">
                    {focusProject.metrics.map(m => (
                      <div className="metric-box" key={m.label}>
                        <b style={{ color: focusProject.accent }}>{m.value}</b>
                        <span>{m.label}</span>
                      </div>
                    ))}
                  </div>
                  <h3 className="blk-label">OUTCOME</h3>
                  <p className="blk-text">{focusProject.outcome}</p>
                  <h3 className="blk-label">SECURITY</h3>
                  <p className="blk-text">{focusProject.security}</p>
                </>
              )}
            </div>

            <div className="case-foot">
              <button className="btn-ghost" onClick={() => setIsCaseOpen(false)} type="button">
                DISMISS
              </button>
              <a
                className="btn-neon"
                href={profile.github}
                target="_blank"
                rel="noreferrer"
                style={{ borderColor: focusProject.accent, color: focusProject.accent }}
              >
                <FiGithub /> VIEW REPOSITORY
              </a>
            </div>
          </div>
        </div>
      )}

      {/* AURA hologram entity */}
      <Assistant />
    </div>
  );
}
