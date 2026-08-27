"use client";

import { useEffect, useRef } from "react";
import { useReducedMotion } from "motion/react";

type RGB = { r: number; g: number; b: number };

// 四色多巴胺低饱和色板（与全局 --accent* token 一致）：粒子各取一色，颜色可辨认
const PALETTE: RGB[] = [
  { r: 217, g: 165, b: 199 }, // --accent 低饱和粉 #d9a5c7
  { r: 165, g: 200, b: 217 }, // --accent-2 低饱和蓝 #a5c8d9
  { r: 199, g: 217, b: 165 }, // --accent-3 低饱和绿 #c7d9a5
  { r: 224, g: 201, b: 165 }, // --accent-4 低饱和奶油黄 #e0c9a5
];
const GLOW: RGB = { r: 165, g: 200, b: 217 }; // --accent-2 低饱和蓝（光晕/染色目标）

const LINK_DIST = 120; // 粒子间连线距离
const MOUSE_RADIUS = 140; // 光晕半径（= 染色范围）

type Particle = {
  x: number;
  y: number;
  vx: number;
  vy: number;
  r: number;
  tint: number; // 0..1：被光晕染成淡蓝的程度（移开后缓慢回落 → 慢慢消散）
  color: RGB; // 粒子本色（四色板随机取一）
};

// 漂浮贴纸（public/images/*.png，透明底，直接正常混合绘制）：与粒子同一套随机/漂移/环绕/缩放逻辑
// w = 选取权重（翅膀加重 → 数量更多）；minH/maxH = 渲染高度范围（fullwing 大、翅膀调小）
type SpriteSpec = { src: string; minH: number; maxH: number; w: number };
const SPRITE_SPECS: SpriteSpec[] = [
  { src: "/images/fullwing.png", minH: 40, maxH: 64, w: 4 },
  { src: "/images/heart.png", minH: 20, maxH: 36, w: 3 },
  { src: "/images/heartstar.png", minH: 18, maxH: 30, w: 3 },
  { src: "/images/moon.png", minH: 24, maxH: 40, w: 4 },
  { src: "/images/stars.png", minH: 16, maxH: 30, w: 4 },
  { src: "/images/starsing.png", minH: 16, maxH: 30, w: 4 },
  { src: "/images/shining.png", minH: 16, maxH: 30, w: 3 },
  { src: "/images/ding.png", minH: 14, maxH: 24, w: 3 },
  { src: "/images/ring.png", minH: 22, maxH: 38, w: 3 },
  { src: "/images/bows.png", minH: 18, maxH: 32, w: 4 },
  { src: "/images/leftwing.png", minH: 18, maxH: 32, w: 16 },
  { src: "/images/rightwing.png", minH: 18, maxH: 32, w: 16 },
  { src: "/images/IMG_20260827_173221.png", minH: 32, maxH: 56, w: 3 },
];

type Sprite = {
  x: number;
  y: number;
  vx: number;
  vy: number;
  w: number;
  h: number;
  img: HTMLImageElement | undefined;
  rot: number; // 固定朝上（正着），不旋转
  alpha: number;
};

export function ParticleBackground({ className }: { className?: string }) {
  const reduce = useReducedMotion(); // prefers-reduced-motion：减弱动效时不启动粒子系统（NFR-3）
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (reduce) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let width = 0;
    let height = 0;
    let raf = 0;
    let last = performance.now();
    let particles: Particle[] = [];

    // 漂浮贴纸：异步加载，全部就绪（含失败）后才按面积生成；失败项以 undefined 跳过绘制
    let sprites: Sprite[] = [];
    let spritesReady = false;
    const spriteImgs: (HTMLImageElement | undefined)[] = new Array(SPRITE_SPECS.length).fill(undefined);
    let spriteLoaded = 0;
    SPRITE_SPECS.forEach((spec, i) => {
      const im = new Image();
      const markDone = () => {
        spriteLoaded++;
        if (spriteLoaded === SPRITE_SPECS.length) {
          spritesReady = true;
          sprites = spawnSprites();
        }
      };
      im.onload = () => {
        spriteImgs[i] = im;
        markDone();
      };
      im.onerror = markDone;
      im.src = spec.src;
    });

    // 权重随机取一种贴纸
    const pickSpec = (): SpriteSpec => {
      const total = SPRITE_SPECS.reduce((s, x) => s + x.w, 0);
      let r = Math.random() * total;
      for (const spec of SPRITE_SPECS) {
        r -= spec.w;
        if (r <= 0) return spec;
      }
      return SPRITE_SPECS[0];
    };

    const spawnSprite = (): Sprite => {
      const spec = pickSpec();
      const idx = SPRITE_SPECS.indexOf(spec);
      const img = spriteImgs[idx];
      const h = spec.minH + Math.random() * (spec.maxH - spec.minH);
      const w = img ? h * (img.naturalWidth / img.naturalHeight) : h;
      return {
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.6, // 比粒子慢，像在慢慢漂
        vy: (Math.random() - 0.5) * 0.6,
        w,
        h,
        img,
        rot: 0, // 正着不旋转
        alpha: 0.45 + Math.random() * 0.25,
      };
    };

    // 漂浮物数量按可视面积（约每 7 万 px² 一个，12~40 个），与粒子同思路
    const spawnSprites = (): Sprite[] => {
      const count = Math.max(12, Math.min(40, Math.round((width * height) / 70000)));
      return Array.from({ length: count }, spawnSprite);
    };

    // 鼠标位置（平滑跟随）与光晕强度（移入快增强、移开慢消散）
    const mouse = { x: -9999, y: -9999, tx: -9999, ty: -9999, present: false };
    let glow = 0;

    const spawn = (): Particle => ({
      x: Math.random() * width,
      y: Math.random() * height,
      vx: (Math.random() - 0.5) * 0.8,
      vy: (Math.random() - 0.5) * 0.8,
      r: 2 + Math.random() * 5,
      tint: 0,
      color: PALETTE[Math.floor(Math.random() * PALETTE.length)],
    });

    const init = () => {
      // 按可视面积计算粒子数：大屏不稀疏、小屏不过密（约每 13000px² 一个）
      const count = Math.max(60, Math.min(170, Math.round((width * height) / 13000)));
      particles = Array.from({ length: count }, spawn);
    };

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const rect = canvas.getBoundingClientRect();
      width = Math.max(1, rect.width);
      height = Math.max(1, rect.height);
      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      init();
      if (spritesReady) sprites = spawnSprites(); // 与粒子同步：resize 后重铺漂浮物
    };

    const onMove = (e: PointerEvent) => {
      const rect = canvas.getBoundingClientRect();
      mouse.tx = e.clientX - rect.left;
      mouse.ty = e.clientY - rect.top;
      mouse.present = true;
    };
    const onLeave = () => {
      mouse.present = false;
    };

    // 颜色插值：粒子从粉色渐变到淡蓝
    const mix = (a: RGB, b: RGB, t: number): string => {
      const r = Math.round(a.r + (b.r - a.r) * t);
      const g = Math.round(a.g + (b.g - a.g) * t);
      const bl = Math.round(a.b + (b.b - a.b) * t);
      return `rgb(${r},${g},${bl})`;
    };

    const frame = (ts: number) => {
      raf = requestAnimationFrame(frame);
      const dt = Math.min((ts - last) / 1000, 0.05); // 钳制 dt：切后台恢复不跳变
      last = ts;
      if (document.hidden) return; // 标签页隐藏时暂停绘制（省电）

      // 鼠标平滑跟随（指数趋近）
      const ease = 1 - Math.exp(-dt * 10);
      mouse.x += (mouse.tx - mouse.x) * ease;
      mouse.y += (mouse.ty - mouse.y) * ease;

      // 光晕强度：进入快（×5/s）、离开慢（×1.4/s）→ 移开慢慢消散
      const glowTarget = mouse.present ? 1 : 0;
      const glowEase = 1 - Math.exp(-dt * (glowTarget > glow ? 5 : 1.4));
      glow += (glowTarget - glow) * glowEase;

      // 染色程度：进入光晕快（×3.2/s）、离开慢（×1.1/s）
      const grow = 1 - Math.exp(-dt * 3.2);
      const decay = 1 - Math.exp(-dt * 1.1);

      for (const p of particles) {
        p.x += p.vx;
        p.y += p.vy;
        // 边界环绕
        if (p.x < -10) p.x = width + 10;
        else if (p.x > width + 10) p.x = -10;
        if (p.y < -10) p.y = height + 10;
        else if (p.y > height + 10) p.y = -10;

        // 光晕内染色目标：中心最强，边缘柔和衰减
        const dist = Math.hypot(p.x - mouse.x, p.y - mouse.y);
        const target = dist < MOUSE_RADIUS ? 1 - dist / MOUSE_RADIUS : 0;
        p.tint += (target - p.tint) * (target > p.tint ? grow : decay);
      }

      ctx.clearRect(0, 0, width, height);

      // 漂浮贴纸（透明底 PNG，正常混合，画在粒子/连线之下）：慢速漂移 + 边界环绕（正着不旋转，与粒子一致）
      if (spritesReady) {
        for (const s of sprites) {
          if (!s.img) continue;
          s.x += s.vx;
          s.y += s.vy;
          if (s.x < -s.w - 20) s.x = width + s.w + 20;
          else if (s.x > width + s.w + 20) s.x = -s.w - 20;
          if (s.y < -s.h - 20) s.y = height + s.h + 20;
          else if (s.y > height + s.h + 20) s.y = -s.h - 20;
          ctx.globalAlpha = s.alpha;
          ctx.save();
          ctx.translate(s.x + s.w / 2, s.y + s.h / 2);
          ctx.rotate(s.rot);
          ctx.drawImage(s.img, -s.w / 2, -s.h / 2, s.w, s.h);
          ctx.restore();
        }
        ctx.globalAlpha = 1;
      }

      // 粒子间连线（近的连线更亮）
      ctx.lineWidth = 2;
      for (let i = 0; i < particles.length; i++) {
        const a = particles[i];
        for (let j = i + 1; j < particles.length; j++) {
          const b = particles[j];
          const d = Math.hypot(a.x - b.x, a.y - b.y);
          if (d < LINK_DIST) {
            ctx.strokeStyle = `rgba(165,200,217,${0.18 * (1 - d / LINK_DIST)})`;
            ctx.beginPath();
            ctx.moveTo(a.x, a.y);
            ctx.lineTo(b.x, b.y);
            ctx.stroke();
          }
        }
        // 鼠标连线（grab 交互，随光晕强度淡入淡出）
        if (mouse.present) {
          const d = Math.hypot(a.x - mouse.x, a.y - mouse.y);
          if (d < MOUSE_RADIUS) {
            ctx.strokeStyle = `rgba(165,200,217,${0.3 * glow * (1 - d / MOUSE_RADIUS)})`;
            ctx.beginPath();
            ctx.moveTo(a.x, a.y);
            ctx.lineTo(mouse.x, mouse.y);
            ctx.stroke();
          }
        }
      }

      // 鼠标光晕：淡蓝径向渐变（画在粒子下方，不遮粒子）
      if (glow > 0.01) {
        const g = ctx.createRadialGradient(mouse.x, mouse.y, 0, mouse.x, mouse.y, MOUSE_RADIUS);
        g.addColorStop(0, `rgba(165,200,217,${0.32 * glow})`);
        g.addColorStop(0.55, `rgba(165,200,217,${0.12 * glow})`);
        g.addColorStop(1, "rgba(165,200,217,0)");
        ctx.fillStyle = g;
        ctx.beginPath();
        ctx.arc(mouse.x, mouse.y, MOUSE_RADIUS, 0, Math.PI * 2);
        ctx.fill();
      }

      // 粒子：被光晕染色 → 颜色向淡蓝渐变，略微提亮
      for (const p of particles) {
        ctx.fillStyle = mix(p.color, GLOW, p.tint);
        ctx.globalAlpha = 0.6 + p.tint * 0.35;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.globalAlpha = 1;
    };

    resize();
    raf = requestAnimationFrame(frame);
    window.addEventListener("resize", resize);
    window.addEventListener("pointermove", onMove);
    window.addEventListener("blur", onLeave);
    document.documentElement.addEventListener("pointerleave", onLeave);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("blur", onLeave);
      document.documentElement.removeEventListener("pointerleave", onLeave);
    };
  }, [reduce]);

  if (reduce) return <div aria-hidden className={className} />; // 减弱动效：纯静态背景（Hero 渐变兜底填充）
  return (
    <div aria-hidden className={className}>
      <canvas ref={canvasRef} className="h-full w-full" />
    </div>
  );
}
