"use client";

import dynamic from "next/dynamic";
import { motion, useMotionTemplate, useMotionValue, useReducedMotion, useSpring } from "motion/react";
import { Wing, MusicNote, Star } from "./decorations";
import { useT } from "./LanguageProvider";

// 粒子经 dynamic + ssr:false 按需加载，避免拖慢首页 LCP（NFR-1）
const ParticleBackground = dynamic(() => import("./ParticleBackground").then((m) => m.ParticleBackground), { ssr: false });

// hover 发光色值（对应 --accent 粉 / --accent-2 蓝）
const GLOW_AVATAR = "0 0 36px rgba(217, 165, 199, 0.65)";
const GLOW_TITLE = "0 0 28px rgba(217, 165, 199, 0.65)";
const GLOW_SUBTITLE = "0 0 20px rgba(165, 200, 217, 0.6)";

export function Hero() {
  const t = useT();
  const reduce = useReducedMotion();

  // 鼠标跟随光晕：跟随指针的径向渐变，spring 平滑拖尾；初始放在屏外避免闪现
  const mx = useMotionValue(-1000);
  const my = useMotionValue(-1000);
  const sx = useSpring(mx, { stiffness: 120, damping: 20 });
  const sy = useSpring(my, { stiffness: 120, damping: 20 });
  const glowBg = useMotionTemplate`radial-gradient(600px circle at ${sx}px ${sy}px, rgba(217, 165, 199, 0.16), transparent 65%)`;

  return (
    <section
      onPointerMove={(e) => {
        const rect = e.currentTarget.getBoundingClientRect();
        mx.set(e.clientX - rect.left);
        my.set(e.clientY - rect.top);
      }}
      className="group relative left-1/2 -ml-[50vw] flex min-h-screen w-screen items-center justify-center overflow-hidden"
    >
      {/* 静态渐变兜底：粒子就绪前不闪空背景；减弱动效时粒子组件渲染空背景、由本层填充 */}
      <div aria-hidden className="absolute inset-0 bg-gradient-to-b from-accent/10 via-transparent to-transparent" />
      <ParticleBackground className="absolute inset-0" />
      {/* 悬停时整块 hero 泛起跟随鼠标的粉色光晕（平时隐藏，opacity 渐变显现） */}
      <motion.div
        aria-hidden
        style={{ background: glowBg }}
        className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100"
      />
      <Wing className="absolute left-[12%] top-[20%] h-10 w-10 text-accent-2 opacity-60" />
      <MusicNote className="absolute right-[14%] top-[28%] h-8 w-8 text-accent opacity-50" />
      <Star className="absolute bottom-[22%] left-[18%] h-7 w-7 text-accent-4 opacity-70" />

      <div className="relative z-10 text-center">
        {/* 🦋 头像：外层入场 + 悬浮循环（减弱动效时停循环）→ 内层 hover 发光放大；emoji 保持 flex 子项直接居中 */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={reduce ? { opacity: 1, scale: 1 } : { opacity: 1, scale: 1, y: [0, -6, 0] }}
          transition={{
            delay: 0.05,
            opacity: { duration: 0.4 },
            scale: { duration: 0.4 },
            y: { duration: 3.5, repeat: Infinity, ease: "easeInOut" },
          }}
          className="mb-5"
        >
          <motion.div
            whileHover={{ scale: 1.12, boxShadow: GLOW_AVATAR }}
            transition={{
              scale: { type: "spring", stiffness: 300, damping: 20 },
              boxShadow: { duration: 0.3, ease: "easeOut" },
            }}
            className="mx-auto flex h-20 w-20 items-center justify-center rounded-full border border-border bg-bg-elevated text-4xl backdrop-blur"
          >
            🦋
          </motion.div>
        </motion.div>
        <motion.p initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }} className="text-sm text-accent">
          {t.hero.eyebrow}
        </motion.p>
        {/* 大标题：hover 发光 + 放大 + 上浮；inline-block 让悬停区贴合文字 */}
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }}>
          <motion.h1
            whileHover={{ scale: 1.06, y: -6, textShadow: GLOW_TITLE }}
            transition={{
              scale: { type: "spring", stiffness: 300, damping: 20 },
              y: { type: "spring", stiffness: 300, damping: 20 },
              textShadow: { duration: 0.35, ease: "easeOut" },
            }}
            className="font-hero mt-3 inline-block cursor-default text-6xl font-bold tracking-tight sm:text-7xl"
          >
            RyiA
          </motion.h1>
        </motion.div>
        {/* 副标题：hover 泛蓝发光 + 轻微放大 */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.32 }}>
          <motion.p
            whileHover={{ scale: 1.04, color: "#a5c8d9", textShadow: GLOW_SUBTITLE }}
            transition={{
              scale: { type: "spring", stiffness: 300, damping: 20 },
              color: { duration: 0.3, ease: "easeOut" },
              textShadow: { duration: 0.35, ease: "easeOut" },
            }}
            className="font-display mt-2 inline-block cursor-default text-lg tracking-[0.15em] text-text-muted"
          >
            Ryia
          </motion.p>
        </motion.div>
        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mx-auto mt-5 max-w-xl text-text-muted"
        >
          {t.hero.slogan}
        </motion.p>
      </div>
    </section>
  );
}
