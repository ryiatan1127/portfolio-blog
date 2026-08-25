"use client";

import dynamic from "next/dynamic";
import { motion } from "motion/react";
import { Wing, MusicNote, Star } from "./decorations";

// 粒子经 dynamic + ssr:false 按需加载，避免拖慢首页 LCP（NFR-1）
const ParticleBackground = dynamic(() => import("./ParticleBackground").then((m) => m.ParticleBackground), { ssr: false });

export function Hero() {
  return (
    <section className="relative left-1/2 -ml-[50vw] flex min-h-screen w-screen items-center justify-center overflow-hidden">
      {/* 静态渐变兜底：粒子就绪前不闪空背景；减弱动效时粒子组件渲染空背景、由本层填充 */}
      <div aria-hidden className="absolute inset-0 bg-gradient-to-b from-accent/10 via-transparent to-transparent" />
      <ParticleBackground className="absolute inset-0" />
      <Wing className="absolute left-[12%] top-[20%] h-10 w-10 text-accent-2 opacity-60" />
      <MusicNote className="absolute right-[14%] top-[28%] h-8 w-8 text-accent opacity-50" />
      <Star className="absolute bottom-[22%] left-[18%] h-7 w-7 text-accent-4 opacity-70" />

      <div className="relative z-10 text-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.05 }}
          className="mx-auto mb-5 flex h-20 w-20 items-center justify-center rounded-full border border-border bg-bg-elevated text-4xl backdrop-blur"
        >
          🦋
        </motion.div>
        <motion.p initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }} className="text-sm text-accent">
          你好，我是
        </motion.p>
        <motion.h1
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25 }}
          className="font-display mt-3 text-5xl font-bold tracking-tight sm:text-6xl"
        >
          Ryia
        </motion.h1>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.32 }}
          className="mt-2 text-xs uppercase tracking-[0.35em] text-text-muted"
        >
          Ryia
        </motion.p>
        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mx-auto mt-5 max-w-xl text-text-muted"
        >
          一句话介绍自己，例如：前端工程师 / 独立开发者，热爱构建有生命力的交互体验。
        </motion.p>
      </div>
    </section>
  );
}
