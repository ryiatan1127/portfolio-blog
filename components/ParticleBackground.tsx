"use client";

import { useMemo } from "react";
import { Particles, ParticlesProvider } from "@tsparticles/react";
import type { ISourceOptions } from "@tsparticles/engine";
import { loadSlim } from "@tsparticles/slim";
import { useReducedMotion } from "motion/react";

export function ParticleBackground({ className }: { className?: string }) {
  const reduce = useReducedMotion(); // prefers-reduced-motion：减弱动效时不初始化粒子引擎（NFR-3）

  // @tsparticles/react v4 API：ParticlesProvider init 回调一次性初始化引擎（模块级单例）
  const options = useMemo<ISourceOptions>(() => ({
    fullScreen: { enable: false },
    fpsLimit: 60,
    detectRetina: true,
    interactivity: {
      // slim 包不含 explode 点击模式（P0 退路）：改用内置的 push 模式
      events: { onHover: { enable: true, mode: "grab" }, onClick: { enable: true, mode: "push" } },
      modes: {
        grab: { distance: 140, links: { opacity: 0.4 } },
        push: { quantity: 4 },
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

  return (
    <ParticlesProvider init={loadSlim}>
      <div aria-hidden className={className}>
        <Particles id="tsparticles" className="h-full w-full" options={options} />
      </div>
    </ParticlesProvider>
  );
}
