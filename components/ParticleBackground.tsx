"use client";

import { useEffect, useMemo, useState } from "react";
import Particles, { initParticlesEngine } from "@tsparticles/react";
import { loadSlim } from "@tsparticles/slim";
import { useReducedMotion } from "motion/react";

export function ParticleBackground({ className }: { className?: string }) {
  const [ready, setReady] = useState(false);
  const reduce = useReducedMotion(); // prefers-reduced-motion：减弱动效时不初始化粒子引擎（NFR-3）

  useEffect(() => {
    if (reduce) return;
    initParticlesEngine(async (engine) => { await loadSlim(engine); }).then(() => setReady(true));
  }, [reduce]);

  const options = useMemo(() => ({
    fullScreen: { enable: false },
    fpsLimit: 60,
    detectRetina: true,
    interactivity: {
      events: { onHover: { enable: true, mode: "grab" }, onClick: { enable: true, mode: "explode" } },
      modes: {
        grab: { distance: 140, links: { opacity: 0.4 } },
        explode: { distance: 120, quantity: 4, size: { min: 2, max: 4 } },
      },
    },
    particles: {
      number: { value: 40, density: { enable: true, area: 800 } },
      color: { value: "#d9a5c7" },
      links: { enable: true, distance: 120, color: "#a5c8d9", opacity: 0.18 },
      move: { enable: true, speed: 0.6 },
      opacity: { value: 0.4 },
      size: { value: { min: 1, max: 3 } },
    },
  }), []);

  if (reduce) return <div aria-hidden className={className} />; // 减弱动效：纯静态背景（由 Hero 渐变兜底填充）
  if (!ready) return null;
  return (
    <div aria-hidden className={className}>
      <Particles id="tsparticles" className="h-full w-full" options={options} />
    </div>
  );
}
