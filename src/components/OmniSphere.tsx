import { useEffect, useRef, useState } from "react";
import type { OmniProject } from "../data";

interface Props {
  projects: OmniProject[];
  activeId: string | null;
  onSelect: (id: string) => void;
}

type Pt = { x: number; y: number; z: number };

export default function OmniSphere({ projects, activeId, onSelect }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [hoverId, setHoverId] = useState<string | null>(null);
  const [dragging, setDragging] = useState(false);

  // rotation state kept in refs so the raf loop reads fresh values
  type NodePos = { x: number; y: number; z: number };
  const rotY = useRef(0.6);
  const rotX = useRef(0.25);
  const isDrag = useRef(false);
  const hoverRef = useRef<string | null>(null);
  const nodeScreen = useRef<Map<string, NodePos>>(new Map());

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let dpr = Math.min(window.devicePixelRatio || 1, 2);
    let w = 0;
    let h = 0;

    const fit = () => {
      const rect = canvas.getBoundingClientRect();
      w = rect.width;
      h = rect.height;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    fit();
    window.addEventListener("resize", fit);

    // sphere helpers
    const R = () => Math.min(w, h) * 0.36;

    const latLonToVec3 = (latDeg: number, lonDeg: number, r: number): Pt => {
      const lat = (latDeg * Math.PI) / 180;
      const lon = (lonDeg * Math.PI) / 180;
      const x = r * Math.cos(lat) * Math.sin(lon);
      const y = r * Math.sin(lat);
      const z = r * Math.cos(lat) * Math.cos(lon);
      // spin around Y
      const x2 = x * Math.cos(rotY.current) + z * Math.sin(rotY.current);
      const z2 = -x * Math.sin(rotY.current) + z * Math.cos(rotY.current);
      // tilt around X
      const y2 = y * Math.cos(rotX.current) - z2 * Math.sin(rotX.current);
      const z3 = y * Math.sin(rotX.current) + z2 * Math.cos(rotX.current);
      return { x: x2, y: y2, z: z3 };
    };

    const project = (p: Pt) => {
      const fov = 620;
      const scale = fov / (fov + p.z);
      return { x: w / 2 + p.x * scale, y: h / 2 + p.y * scale, z: p.z };
    };

    // pointer handling
    let lastPointer = { x: 0, y: 0 };

    const onDown = (e: PointerEvent) => {
      isDrag.current = true;
      setDragging(true);
      const r = canvas.getBoundingClientRect();
      lastPointer = { x: e.clientX - r.left, y: e.clientY - r.top };
    };

    const onMove = (e: PointerEvent) => {
      const r = canvas.getBoundingClientRect();
      const px = e.clientX - r.left;
      const py = e.clientY - r.top;

      if (isDrag.current) {
        rotY.current += (px - lastPointer.x) * 0.008;
        rotX.current = Math.max(-0.9, Math.min(0.9, rotX.current + (py - lastPointer.y) * 0.006));
        lastPointer = { x: px, y: py };
      }

      // hover hit-test against projected nodes
      let found: string | null = null;
      let best = 26;
      nodeScreen.current.forEach((pos, id) => {
        if (pos.z < 0) return;
        const d = Math.hypot(pos.x - px, pos.y - py);
        if (d < best) {
          best = d;
          found = id;
        }
      });
      hoverRef.current = found;
      setHoverId(found);
      canvas.style.cursor = found ? "pointer" : isDrag.current ? "grabbing" : "grab";
    };

    const onUp = () => {
      isDrag.current = false;
      setDragging(false);
    };

    canvas.addEventListener("pointerdown", onDown);
    window.addEventListener("pointermove", onMove);
    window.addEventListener("pointerup", onUp);

    const onClick = () => {
      if (hoverRef.current) onSelect(hoverRef.current);
    };
    canvas.addEventListener("click", onClick);

    let raf = 0;
    let t = 0;

    const draw = () => {
      t += 0.012;
      if (!isDrag.current) rotY.current += 0.0032;
      ctx.clearRect(0, 0, w, h);

      const cx = w / 2;
      const cy = h / 2;
      const r = R();

      // volumetric halo
      const halo = ctx.createRadialGradient(cx, cy, r * 0.15, cx, cy, r * 2.6);
      const pulse = 0.12 + Math.sin(t) * 0.04;
      halo.addColorStop(0, `rgba(0, 229, 255, ${pulse + 0.06})`);
      halo.addColorStop(0.5, `rgba(124, 92, 255, ${pulse * 0.4})`);
      halo.addColorStop(1, "transparent");
      ctx.fillStyle = halo;
      ctx.beginPath();
      ctx.arc(cx, cy, r * 2.6, 0, Math.PI * 2);
      ctx.fill();

      // glass sphere body
      const body = ctx.createRadialGradient(cx - r * 0.3, cy - r * 0.35, r * 0.1, cx, cy, r);
      body.addColorStop(0, "rgba(180, 245, 255, 0.16)");
      body.addColorStop(0.6, "rgba(20, 60, 120, 0.10)");
      body.addColorStop(1, "rgba(4, 10, 24, 0.55)");
      ctx.beginPath();
      ctx.arc(cx, cy, r, 0, Math.PI * 2);
      ctx.fillStyle = body;
      ctx.fill();
      ctx.strokeStyle = `rgba(0, 229, 255, ${0.32 + Math.sin(t * 1.5) * 0.08}`;
      ctx.lineWidth = 1.2;
      ctx.stroke();

      // wireframe latitude rings
      ctx.lineWidth = 0.7;
      [-60, -30, 0, 30, 60].forEach((lat) => {
        ctx.beginPath();
        for (let lon = 0; lon <= 360; lon += 6) {
          const p = project(latLonToVec3(lat, lon, r));
          const a = Math.max(0.05, (p.z + r) / (2 * r));
          ctx.strokeStyle = `rgba(0, 229, 255, ${a * 0.28})`;
          if (lon === 0) ctx.moveTo(p.x, p.y);
          else ctx.lineTo(p.x, p.y);
        }
        ctx.stroke();
      });

      // project the six nodes
      nodeScreen.current.clear();
      const projected = projects.map((p) => {
        const v = latLonToVec3(p.lat, p.lon, r * 1.04);
        const sp = project(v);
        nodeScreen.current.set(p.id, sp);
        return { p, sp };
      });

      // draw back-facing nodes first (dimmer)
      projected
        .filter((n) => n.sp.z < 0)
        .forEach(({ sp }) => {
          ctx.beginPath();
          ctx.arc(sp.x, sp.y, 3, 0, Math.PI * 2);
          ctx.fillStyle = "rgba(120, 190, 230, 0.28)";
          ctx.fill();
        });

      // draw front nodes with glow
      projected
        .filter((n) => n.sp.z >= 0)
        .forEach(({ p, sp }) => {
          const isActive = activeId === p.id;
          const isHover = hoverId === p.id;
          const base = isActive ? 8 : isHover ? 7 : 5.5;
          // outer halo
          ctx.beginPath();
          ctx.arc(sp.x, sp.y, base * 2.4, 0, Math.PI * 2);
          ctx.fillStyle = isActive ? "rgba(0, 229, 255, 0.22)" : "rgba(0, 229, 255, 0.08)";
          ctx.fill();
          if (isActive || isHover) {
            ctx.beginPath();
            ctx.arc(sp.x, sp.y, base * 1.7, 0, Math.PI * 2);
            ctx.strokeStyle = "rgba(0, 229, 255, 0.65)";
            ctx.lineWidth = 1;
            ctx.stroke();
          }
          // core
          ctx.beginPath();
          ctx.arc(sp.x, sp.y, base, 0, Math.PI * 2);
          ctx.fillStyle = p.accent;
          ctx.shadowColor = p.accent;
          ctx.shadowBlur = isActive ? 22 : 12;
          ctx.fill();
          ctx.shadowBlur = 0;
          // label chip
          if (isActive || isHover) {
            const label = `${p.code} ${p.title}`;
            ctx.font = "600 11px 'IBM Plex Mono', monospace";
            const tw = ctx.measureText(label).width;
            ctx.fillStyle = "rgba(3, 8, 20, 0.92)";
            ctx.fillRect(sp.x - tw / 2 - 8, sp.y - base - 30, tw + 16, 20);
            ctx.strokeStyle = "rgba(0, 229, 255, 0.6)";
            ctx.lineWidth = 1;
            ctx.strokeRect(sp.x - tw / 2 - 8, sp.y - base - 30, tw + 16, 20);
            ctx.fillStyle = "#d8f6ff";
            ctx.textAlign = "center";
            ctx.fillText(label, sp.x, sp.y - base - 16);
            ctx.textAlign = "left";
          }
        });

      // orbiting dust particles (volumetric light motes)
      for (let i = 0; i < 40; i++) {
        const a = t * 0.5 + i * 0.42;
        const rr = r * (1.4 + (i % 5) * 0.12);
        const px = cx + Math.cos(a) * rr * 1.25;
        const py = cy + Math.sin(a) * rr * 0.42 + Math.sin(t + i) * 6;
        ctx.beginPath();
        ctx.arc(px, py, 0.9, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(0, 229, 255, ${0.16 + Math.sin(t * 2 + i) * 0.08})`;
        ctx.fill();
      }

      raf = requestAnimationFrame(draw);
    };
    draw();

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", fit);
      canvas.removeEventListener("pointerdown", onDown);
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerup", onUp);
      canvas.removeEventListener("click", onClick);
    };
  }, [projects, activeId, onSelect]);

  return (
    <canvas
      ref={canvasRef}
      className={`w-full h-full touch-none ${dragging ? "cursor-grabbing" : "cursor-grab"}`}
      aria-label="Holographic omni-sphere of flagship architecture projects"
    />
  );
}
