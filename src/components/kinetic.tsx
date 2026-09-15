import { useEffect, useRef, useState, type ReactNode, type CSSProperties } from "react";

/* ═══════════════════════════════════════════════════════
   CYBER PRIMITIVES — code rain, magnetic, glitch, holo pop
   ═══════════════════════════════════════════════════════ */

/* ── CODE RAIN BACKGROUND ────────────────────────────── */
const GLYPHS = "ｱｲｳｴｵｶｷｸｹｺｻｼｽｾｿﾀﾁﾂﾃﾄﾅﾆﾇﾈﾉ01</>{}[]λΨΦΩ∑∆⌁⌬⧉⟁";

export function CodeRain({ opacity = 0.5 }: { opacity?: number }) {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let raf = 0;
    let w = 0, h = 0;
    const fontSize = 14;
    let cols = 0;
    let drops: number[] = [];
    let speeds: number[] = [];

    const resize = () => {
      w = canvas.width = window.innerWidth;
      h = canvas.height = window.innerHeight;
      cols = Math.floor(w / fontSize);
      drops = Array.from({ length: cols }, () => Math.random() * -60);
      speeds = Array.from({ length: cols }, () => 0.3 + Math.random() * 0.6);
    };
    resize();
    window.addEventListener("resize", resize);

    let frame = 0;
    const draw = () => {
      frame++;
      // trail fade — heavier trail for that matrix smear
      ctx.fillStyle = "rgba(5, 6, 10, 0.085)";
      ctx.fillRect(0, 0, w, h);
      ctx.font = `${fontSize}px "JetBrains Mono", monospace`;

      for (let i = 0; i < cols; i++) {
        const ch = GLYPHS[Math.floor(Math.random() * GLYPHS.length)];
        const x = i * fontSize;
        const y = drops[i] * fontSize;

        // leading glyph is bright white-cyan
        ctx.fillStyle = "rgba(220, 255, 255, 0.85)";
        ctx.shadowColor = "#00f0ff";
        ctx.shadowBlur = 10;
        ctx.fillText(ch, x, y);
        ctx.shadowBlur = 0;

        // trailing glyph in neon cyan (dimmer)
        if (Math.random() > 0.5) {
          ctx.fillStyle = "rgba(0, 240, 255, 0.32)";
          ctx.fillText(GLYPHS[Math.floor(Math.random() * GLYPHS.length)], x, y - fontSize);
        }
        // occasional pink glitch glyph
        if (Math.random() > 0.94) {
          ctx.fillStyle = "rgba(255, 0, 127, 0.5)";
          ctx.fillText(GLYPHS[Math.floor(Math.random() * GLYPHS.length)], x, y - fontSize * 2);
        }

        if (y > h && Math.random() > 0.975) drops[i] = Math.random() * -30;
        drops[i] += speeds[i];
      }
      raf = requestAnimationFrame(draw);
    };
    draw();

    return () => { cancelAnimationFrame(raf); window.removeEventListener("resize", resize); };
  }, []);

  return <canvas ref={ref} className="code-rain" style={{ opacity }} aria-hidden />;
}

/* ── MAGNETIC WRAPPER ────────────────────────────────── */
export function Magnetic({ children, strength = 0.35, radius = 140, className = "", style }: {
  children: ReactNode; strength?: number; radius?: number; className?: string; style?: CSSProperties;
}) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia("(pointer: coarse)").matches) return;
    let raf = 0;
    const onMove = (e: PointerEvent) => {
      const r = el.getBoundingClientRect();
      const x = e.clientX - (r.left + r.width / 2);
      const y = e.clientY - (r.top + r.height / 2);
      const dist = Math.hypot(x, y);
      if (dist < radius) {
        cancelAnimationFrame(raf);
        raf = requestAnimationFrame(() => {
          el.style.transform = `translate(${x * strength}px, ${y * strength}px)`;
        });
      } else if (el.style.transform) {
        cancelAnimationFrame(raf);
        raf = requestAnimationFrame(() => { el.style.transform = ""; });
      }
    };
    const onLeave = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => { el.style.transform = ""; });
    };
    window.addEventListener("pointermove", onMove);
    el.addEventListener("pointerleave", onLeave);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("pointermove", onMove);
      el.removeEventListener("pointerleave", onLeave);
      el.style.transform = "";
    };
  }, [strength, radius]);

  return (
    <div ref={ref} className={`magnetic ${className}`} style={{ transition: "transform .3s cubic-bezier(.16,1,.3,1)", ...style }}>
      {children}
    </div>
  );
}

/* ── GLITCH TEXT (CSS-driven, triggers on interval) ──── */
export function Glitch({ children, className = "" }: { children: string; className?: string }) {
  return (
    <span className={`glitch ${className}`} data-text={children}>
      {children}
    </span>
  );
}

/* ── 3D PARALLAX LAYER ───────────────────────────────── */
export function Parallax({ children, speed = 0.07, className = "", style }: {
  children: ReactNode; speed?: number; className?: string; style?: CSSProperties;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [t, setT] = useState(0);

  useEffect(() => {
    let raf = 0;
    const onScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        const el = ref.current;
        if (!el) return;
        const r = el.getBoundingClientRect();
        const center = r.top + r.height / 2 - window.innerHeight / 2;
        setT(center * speed);
      });
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => { cancelAnimationFrame(raf); window.removeEventListener("scroll", onScroll); };
  }, [speed]);

  return (
    <div ref={ref} className={`parallax ${className}`} style={{ transform: `translateY(${t}px)`, ...style }}>
      {children}
    </div>
  );
}

/* ── HOLO POP REVEAL ─────────────────────────────────── */
export function HoloReveal({ children, delay = 0, className = "" }: {
  children: ReactNode; delay?: number; className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) {
        el.classList.add("holo-in");
        io.disconnect();
      }
    }, { threshold: 0.1 });
    io.observe(el);
    return () => io.disconnect();
  }, []);
  return (
    <div ref={ref} className={`holo-pop ${className}`} style={{ transitionDelay: `${delay}ms` }}>
      {children}
    </div>
  );
}

/* ── COUNT UP ────────────────────────────────────────── */
export function CountUp({ end, decimals = 0, suffix = "" }: { end: number; decimals?: number; suffix?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const [started, setStarted] = useState(false);
  const [val, setVal] = useState(0);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setStarted(true); io.disconnect(); } }, { threshold: 0.35 });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    if (!started) return;
    let raf = 0;
    const t0 = performance.now();
    const tick = (t: number) => {
      const p = Math.min(1, (t - t0) / 1600);
      setVal(end * (1 - Math.pow(1 - p, 3)));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [started, end]);

  return (
    <span ref={ref}>
      {decimals > 0 ? val.toFixed(decimals) : Math.round(val).toLocaleString("en-US")}
      <i>{suffix}</i>
    </span>
  );
}

/* ── LOGCAT TYPEWRITER ───────────────────────────────── */
export function Logcat({ lines }: { lines: { lvl: string; tag: string; msg: string }[] }) {
  const [shown, setShown] = useState<typeof lines>([]);
  const [partial, setPartial] = useState("");
  const [cur, setCur] = useState(0);

  useEffect(() => {
    let alive = true;
    let timer: ReturnType<typeof setTimeout>;
    const line = lines[cur % lines.length];
    let i = 0;
    const type = () => {
      if (!alive) return;
      if (i <= line.msg.length) {
        setPartial(line.msg.slice(0, i));
        i++;
        timer = setTimeout(type, 12 + Math.random() * 22);
      } else {
        setShown(prev => [...prev, line].slice(-4));
        setPartial("");
        setCur(c => c + 1);
      }
    };
    timer = setTimeout(type, 280);
    return () => { alive = false; clearTimeout(timer); };
  }, [cur, lines]);

  const active = lines[cur % lines.length];

  return (
    <div className="logcat">
      <div className="logcat-head">
        <span className="dot" style={{ background: "#ff2d55" }} />
        <span className="dot" style={{ background: "#ffcc00" }} />
        <span className="dot" style={{ background: "#00f0ff" }} />
        <span className="t">adb logcat · mka@tachileik</span>
      </div>
      <div className="logcat-body">
        {shown.map((l, i) => (
          <div key={i}>
            <span className={`lvl-${l.lvl}`}>{l.lvl}/</span>
            <span className="tag">{l.tag.padEnd(18)}</span>
            <span className="msg">: {l.msg}</span>
          </div>
        ))}
        <div>
          <span className={`lvl-${active.lvl}`}>{active.lvl}/</span>
          <span className="tag">{active.tag.padEnd(18)}</span>
          <span className="msg">: {partial}</span>
          <span className="cursor" />
        </div>
      </div>
    </div>
  );
}
