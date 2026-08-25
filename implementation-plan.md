# 个人作品集 + 博客网站 实现计划

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 构建一个可上线的个人作品集/品牌站 + 博客，含滚动叙事、粒子/微交互、玻璃拟态、可爱装饰元素；博客功能丰富（标签/目录/归档/系列/搜索/评论等），$0 起步部署。

**Architecture:** Next.js 15 App Router + TypeScript，`output: 'export'` 静态导出；动效统一用 Motion，粒子用 tsparticles，博客用 MDX + gray-matter 静态生成；评论用 Giscus；搜索用构建时索引 + 客户端过滤；无后端、无数据库。

**Tech Stack:** Next.js 15、TypeScript、Tailwind CSS v4、Motion（`motion/react`）、`@tsparticles/react` + `@tsparticles/slim`、`gray-matter` + `next-mdx-remote-client`、`rehype-pretty-code` + `shiki`、`rehype-slug` + `github-slugger`、`@giscus/react`、Vitest + Testing Library。

**Spec:** `design.md`（与本文档同目录，v3）

## Global Constraints

- Node ≥ 18.18（Next.js 15 最低要求，原 18.17 不够）；建议 Node 20 LTS。
- 包管理器 npm；依赖安装后提交 `package-lock.json`；`rehype-pretty-code` 等 API 高频变动的插件锁定 major 版本，升级需回归验证。
- 组件若用浏览器 API（`useScroll`/`useState`/`useEffect`/tsparticles/`fetch`）必须加 `"use client"`；纯数据函数（`lib/posts.ts`/`lib/projects.ts`/`lib/headings.ts`/`lib/search.ts`）保持服务端可用，不加 `"use client"`。
- 组件一律**命名导出**（默认导出与命名导入混用会导致编译错误，本计划已统一为命名导出）。
- 静态导出：`next.config.ts` 必须设 `output: "export"` 与 `images.unoptimized: true`。
- 所有中文文案简体中文。
- 目录结构：根级 `app/`、`components/`、`lib/`、`content/`、`public/`、`scripts/`（无 `src/`）。
- 博客文章放 `content/posts/*.mdx`；项目数据放 `content/projects.ts`；自定义字体放 `public/fonts/`；图片放 `public/images/`，引用路径 `/images/...`。
- 文章文件名用 **ASCII slug**（文件名即 URL 路径），避免中文/空格；标签与系列名可用中文（链接自动 encode）。
- 每个任务结束提交一次 commit。
- 别名 `@/*` 指向项目根。
- 颜色/圆角/阴影一律用 token（`--color-*` / `--shadow-*`）或 Tailwind 工具类，不写死色值（阴影色值同样入 token，如 `--shadow-glow`）。
- 导航折叠断点统一为 `md:`（768px），与 PRD FR-5.5 / design §9.5 一致。
- 数据层函数的输入输出类型以本计划 `lib/posts.ts` / `lib/projects.ts` 定义为准，后续任务严格沿用。
- **依赖版本矩阵（P0）**：`rehype-pretty-code` 与 `shiki` 必须使用互相兼容的组合（评审日：rehype-pretty-code 0.14.x ↔ shiki ^1.x；shiki v2/v4 兼容仍在跟进，勿直接装 latest）。`@tsparticles/react`（≥4 支持 React 19）、`@giscus/react`、`@testing-library/react`（≥16）须与 Next 15 自带的 React 19 peer 兼容。安装时核实、冲突时降级到兼容版本，全部以 `package-lock.json` 锁定（见 Task 1 Step 3）。

---

### Task 1: 项目脚手架 + 依赖安装

**Files:**
- Create: Next.js 骨架；`vitest.config.ts`、`vitest.setup.ts`
- Modify: `next.config.ts`、`package.json`、`tsconfig.json`

**Interfaces:**
- Consumes: 无
- Produces: 可 `npm run dev` / `npm run build` / `npm test` 的骨架。

- [x] **Step 1: 生成 Next.js 15 项目**

在**仓库根目录**（即本文件所在目录，已含三份 md 文档）直接生成，避免 `portfolio-blog/portfolio-blog` 双层嵌套：

```bash
npx create-next-app@15 . --typescript --tailwind --eslint --app --import-alias "@/*" --use-npm
```

> 目录非空时 create-next-app 会提示确认，选择继续；若因已有文件被拒，先移到临时目录生成再合并回根目录。
> 若 `--no-src-dir` 不被识别，去掉该 flag；默认不使用 src/（如交互询问 src 目录，选 No）。
> **agentic 执行注意（P0）**：create-next-app 的交互询问（Turbopack、src 目录等）会阻塞非交互执行——用 flag 全量指定选项（如 `--turbopack` / `--no-turbopack`、`--import-alias "@/*"`、`--use-npm`），或在管道中应答全部提示，避免挂起。

- [x] **Step 2: 验证骨架与 Tailwind 版本**

```bash
ls -1   # 应有 app/ public/ package.json tsconfig.json next.config.ts（md 文档保留）
npm ls tailwindcss   # 期望 v4；若为 v3，先升级到 v4：npm i -D tailwindcss@4 @tailwindcss/postcss，并按 v4 文档配 postcss.config.mjs
```

- [x] **Step 3: 安装运行时依赖**

```bash
npm install motion @tsparticles/react @tsparticles/slim gray-matter next-mdx-remote-client rehype-pretty-code shiki rehype-slug github-slugger @giscus/react
```

> **版本矩阵（P0，安装时核实）**：`rehype-pretty-code` 与 `shiki` 必须使用互相兼容的组合（评审日：rehype-pretty-code 0.14.x ↔ shiki ^1.x；shiki v2/v4 兼容仍在跟进，勿直接装 latest）。若 `npm install` 报 ERESOLVE，按 `npm view rehype-pretty-code peerDependencies` 的声明范围降级 shiki 后重装。`@tsparticles/react`（≥4 支持 React 19）、`@giscus/react`、`@testing-library/react`（≥16）须与 Next 15 自带的 React 19 peer 兼容，冲突时同样锁定兼容版本；全部以 `package-lock.json` 锁定并提交。

- [x] **Step 4: 安装测试依赖**

```bash
npm install -D vitest @vitejs/plugin-react @testing-library/react @testing-library/jest-dom @testing-library/user-event jsdom @types/gray-matter
```

> `@types/gray-matter`：gray-matter 无内置类型，缺失会导致 `matter(raw)` 在 strict 下报 TS7016、构建失败。

- [x] **Step 5: 配置静态导出（改写 `next.config.ts`）**

```ts
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export",
  images: { unoptimized: true },
};

export default nextConfig;
```

- [x] **Step 6: 写 Vitest 配置**

`vitest.config.ts`：

```ts
import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  test: { environment: "jsdom", setupFiles: ["./vitest.setup.ts"], include: ["**/*.test.{ts,tsx}"] },
});
```

`vitest.setup.ts`：

```ts
import "@testing-library/jest-dom/vitest";

// jsdom 无 IntersectionObserver：ScrollReveal（whileInView）/ TableOfContents 等组件测试依赖它，先补 mock
class MockIntersectionObserver implements IntersectionObserver {
  readonly root: Element | Document | null = null;
  readonly rootMargin = "0px";
  readonly thresholds: ReadonlyArray<number> = [];
  observe(): void {}
  unobserve(): void {}
  disconnect(): void {}
  takeRecords(): IntersectionObserverEntry[] { return []; }
}
globalThis.IntersectionObserver = MockIntersectionObserver as unknown as typeof IntersectionObserver;
```

- [x] **Step 7: 加脚本（`package.json` 的 scripts）**

```json
"test": "vitest run",
"test:watch": "vitest",
"prebuild": "node scripts/build-search-index.mjs",
"predev": "node scripts/build-search-index.mjs"
```

- [x] **Step 8: 建占位搜索脚本（创建 `scripts/build-search-index.mjs`）**

```js
import fs from "fs";
import path from "path";

const out = path.join(process.cwd(), "public", "search-index.json");
fs.mkdirSync(path.dirname(out), { recursive: true });
fs.writeFileSync(out, "[]");
```

> Task 19 会替换为真实实现；此处仅为让 `prebuild`/`predev` 可运行。

- [x] **Step 9: tsconfig 排除测试文件（修改 `tsconfig.json`）**

create-next-app 的 tsconfig 会把 `**/*.ts(x)` 全部纳入 `next build` 类型检查，导致测试文件及其 jest-dom matcher 类型参与构建；在 `exclude` 中排除：

```json
"exclude": ["node_modules", "**/*.test.*", "vitest.setup.ts"]
```

> Vitest 由 `vitest.config.ts` 驱动，不受该 exclude 影响，`npm test` 照常运行。

- [x] **Step 10: 验证构建**

```bash
npm run build
```

预期：构建成功，生成 `out/`。

> 首次构建即验证依赖组合无冲突；Task 12 首次渲染代码块时再确认高亮与行号，若异常回本步按版本矩阵调整（P0）。

- [x] **Step 11: Commit**

```bash
git init   # 若尚未初始化
git add -A && git commit -m "chore: scaffold Next.js portfolio with static export + testing"
```

---

### Task 2: 主题 token + 字体 + 全局布局

**Files:**
- Modify: `app/globals.css`
- Modify: `app/layout.tsx`
- Create: `components/nav.tsx`、`components/footer.tsx`、`lib/site.ts`
- Create: `public/fonts/README.md`

**Interfaces:**
- Consumes: Task 1 骨架
- Produces: `<Nav />`（含移动端汉堡菜单）、`<Footer />`；全局 token（`--bg/--bg-elevated/--text/--text-muted/--accent/--accent-2/--accent-3/--accent-4/--border/--font-display`）；`SITE_URL` 常量；预留 `public/fonts/`。

- [x] **Step 1: 写主题 token 与 @font-face（改写 `app/globals.css`）**

```css
@import "tailwindcss";

/* @font-face 同时声明三种格式：上传任一命名文件（display.woff2/ttf/otf）即用，无需改代码 */
@font-face {
  font-family: "Display";
  src: url("/fonts/display.woff2") format("woff2"),
       url("/fonts/display.ttf") format("truetype"),
       url("/fonts/display.otf") format("opentype");
  font-display: swap;
}

:root {
  --font-display: "Display", "PingFang SC", "Microsoft YaHei", sans-serif;
  --bg: #faf6f2;
  --bg-elevated: rgba(255, 255, 255, 0.55);
  --text: #3d3a45;
  --text-muted: #8b8794;
  --accent: #d9a5c7;
  --accent-2: #a5c8d9;
  --accent-3: #c7d9a5;
  --accent-4: #e0c9a5;
  --border: rgba(61, 58, 69, 0.12);
  --shadow-glow: 0 12px 32px -12px rgba(217, 165, 199, 0.5); /* 卡片 hover 发光（色值仅此处一处） */
}

@theme inline {
  --color-bg: var(--bg);
  --color-bg-elevated: var(--bg-elevated);
  --color-text: var(--text);
  --color-text-muted: var(--text-muted);
  --color-accent: var(--accent);
  --color-accent-2: var(--accent-2);
  --color-accent-3: var(--accent-3);
  --color-accent-4: var(--accent-4);
  --color-border: var(--border);
  --font-display: var(--font-display);
  --shadow-glow: var(--shadow-glow);
}

body {
  font-family: "PingFang SC", "Microsoft YaHei", "Helvetica Neue", Arial, sans-serif;
  background: var(--bg);
  color: var(--text);
  overflow-x: clip; /* 配合 Task 6 全出血 Hero（w-screen），防横向滚动条 */
}
```

> 不使用 `next/font/google`：其构建时需联网下载字体，网络受限会卡住/失败；正文用系统字体栈，展示字体全走自托管。
> 若不需要 `.ttf/.otf` 支持，可只保留 woff2 一行 src，避免缺失文件产生 404 请求。

- [x] **Step 2: 写字体说明（创建 `public/fonts/README.md`）**

```markdown
# 自定义字体目录

把展示字体文件命名为 `display.woff2` / `display.ttf` / `display.otf`（任选其一）放到本目录，即可在标题/Hero 使用（无需改代码）。

`@font-face` 已同时声明三种格式，浏览器按 woff2 → ttf → otf 顺序加载存在的文件。
```

- [x] **Step 3: 写导航（创建 `components/nav.tsx`，含移动端汉堡菜单）**

```tsx
"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { motion, useScroll, useMotionValueEvent } from "motion/react";

const links = [
  { href: "/", label: "首页" },
  { href: "/projects", label: "作品" },
  { href: "/blog", label: "博客" },
  { href: "/archive", label: "归档" },
  { href: "/search", label: "搜索" },
];

export function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const { scrollY } = useScroll();

  useMotionValueEvent(scrollY, "change", (latest) => setScrolled(latest > 24));

  // Esc 关闭移动端菜单（P2）
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") setOpen(false); };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  return (
    <motion.header
      initial={{ y: -60, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5 }}
      className={`fixed inset-x-0 top-0 z-50 transition-colors ${
        scrolled || open ? "border-b border-border bg-bg-elevated backdrop-blur" : "bg-transparent"
      }`}
    >
      <nav className="mx-auto flex max-w-5xl items-center justify-between px-6 py-4">
        <Link href="/" className="font-display text-lg font-semibold" onClick={() => setOpen(false)}>你的名字</Link>
        <ul className="hidden items-center gap-6 text-sm text-text-muted md:flex">
          {links.map((l) => (
            <li key={l.href}>
              <Link href={l.href} className="transition-colors hover:text-text">{l.label}</Link>
            </li>
          ))}
        </ul>
        <button
          type="button"
          aria-label={open ? "关闭菜单" : "打开菜单"}
          aria-expanded={open}
          onClick={() => setOpen((v) => !v)}
          aria-controls="mobile-menu"
          className="flex h-9 w-9 items-center justify-center rounded-lg border border-border text-text md:hidden"
        >
          {open ? "✕" : "☰"}
        </button>
      </nav>
      {open && (
        <motion.ul
          id="mobile-menu"
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          className="border-t border-border bg-bg-elevated px-6 py-4 backdrop-blur md:hidden"
        >
          {links.map((l) => (
            <li key={l.href}>
              <Link href={l.href} onClick={() => setOpen(false)} className="block py-2 text-sm text-text-muted hover:text-text">
                {l.label}
              </Link>
            </li>
          ))}
        </motion.ul>
      )}
    </motion.header>
  );
}
```

> 移动端（<`768px`，断点 `md:`）横向链接隐藏，显示汉堡按钮；菜单展开时点击链接自动收起（FR-5.5）；Esc 键关闭菜单（P2）；`aria-controls="mobile-menu"` 关联菜单（a11y）。

- [x] **Step 4: 写页脚（创建 `components/footer.tsx`）**

```tsx
export function Footer() {
  return (
    <footer className="border-t border-border py-10 text-center text-sm text-text-muted">
      <div className="flex items-center justify-center gap-5">
        <a href="https://github.com/YOUR_NAME" target="_blank" rel="noreferrer" className="hover:text-text">GitHub</a>
        <a href="mailto:YOU@example.com" className="hover:text-text">Email</a>
      </div>
      <p className="mt-4">© {new Date().getFullYear()} 你的名字</p>
    </footer>
  );
}
```

- [x] **Step 5: 站点常量 + 改写根布局（创建 `lib/site.ts`，修改 `app/layout.tsx`）**

`lib/site.ts`：

```ts
// 站点全局常量：部署绑定域名后，把这里替换为真实域名（sitemap / metadataBase 共用）
export const SITE_URL = "https://YOUR-DOMAIN.com";
export const SITE_NAME = "你的名字";
```

`app/layout.tsx`：

```tsx
import type { Metadata } from "next";
import { Nav } from "@/components/nav";
import { Footer } from "@/components/footer";
import { SITE_URL } from "@/lib/site";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: { default: "你的名字 — 作品集", template: "%s | 你的名字" },
  description: "个人作品集与博客：前端工程、独立开发与生活随笔。",
  openGraph: { type: "website", locale: "zh_CN" },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="zh-CN">
      <body className="antialiased">
        <Nav />
        <main className="mx-auto max-w-5xl px-6">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
```

> 正文与展示字体由 `globals.css` 统一声明，不再使用 `next/font/google`（Task 2 Step 1 说明）。

- [x] **Step 6: 验证**

```bash
npm run dev
```

打开 http://localhost:3000 ，确认导航（含归档/搜索链接）、页脚渲染；滚动导航出现玻璃背景；缩窄视口到 <768px 出现汉堡按钮，点击可展开全部导航项。

- [x] **Step 7: Commit**

```bash
git add -A && git commit -m "feat: add theme tokens, fonts, nav (with mobile menu) and footer"
```

---

### Task 3: 动效原子组件（ScrollReveal + SectionHeading）

**Files:**
- Create: `components/ScrollReveal.tsx`、`components/SectionHeading.tsx`
- Test: `components/ScrollReveal.test.tsx`

**Interfaces:**
- Produces: `ScrollReveal({ children, delay?, y?, className? })`、`SectionHeading({ eyebrow, title, as? })`（均为**命名导出**）。

- [x] **Step 1: 写失败测试（创建 `components/ScrollReveal.test.tsx`）**

```tsx
import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { ScrollReveal } from "./ScrollReveal";

describe("ScrollReveal", () => {
  it("渲染子内容", () => {
    render(<ScrollReveal>内容</ScrollReveal>);
    expect(screen.getByText("内容")).toBeInTheDocument();
  });
});
```

- [x] **Step 2: 运行确认失败**

```bash
npm test -- ScrollReveal
```

预期：FAIL（`Cannot find module './ScrollReveal'`）。

- [x] **Step 3: 实现（创建 `components/ScrollReveal.tsx`）**

```tsx
"use client";

import { motion, useReducedMotion } from "motion/react";
import type { ReactNode } from "react";

type Props = { children: ReactNode; delay?: number; y?: number; className?: string };

export function ScrollReveal({ children, delay = 0, y = 24, className }: Props) {
  const reduce = useReducedMotion();
  return (
    <motion.div
      className={className}
      initial={reduce ? { opacity: 0 } : { opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.6, delay, ease: "easeOut" }}
    >
      {children}
    </motion.div>
  );
}
```

> 尊重 `prefers-reduced-motion`：系统开启「减弱动效」时退化为纯淡入、无位移。

- [x] **Step 4: 运行确认通过**

```bash
npm test -- ScrollReveal
```

- [x] **Step 5: 实现 SectionHeading（创建 `components/SectionHeading.tsx`）**

```tsx
import { ScrollReveal } from "./ScrollReveal";

type Props = { eyebrow: string; title: string; as?: "h1" | "h2" };

export function SectionHeading({ eyebrow, title, as = "h2" }: Props) {
  const Tag = as;
  return (
    <ScrollReveal>
      <p className="text-sm font-medium tracking-widest text-accent">{eyebrow}</p>
      <Tag className="font-display mt-2 text-3xl font-semibold tracking-tight">{title}</Tag>
    </ScrollReveal>
  );
}
```

> `as="h1"` 供页面级标题使用（验收标准 8：每页唯一 h1）；区块标题保持 h2。

- [x] **Step 6: Commit**

```bash
git add -A && git commit -m "feat: add ScrollReveal and SectionHeading primitives"
```

---

### Task 4: 粒子背景（ParticleBackground）

**Files:**
- Create: `components/ParticleBackground.tsx`

**Interfaces:**
- Produces: `ParticleBackground({ className? })`（命名导出；由 Hero 经 `next/dynamic` 按需加载）。

- [x] **Step 1: 实现**

```tsx
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
```

> 点击使用 `explode` 爆裂模式（FR-4.2「点击爆粒子」）；组件本身经 `next/dynamic`（`ssr: false`）加载，见 Task 6。

- [x] **Step 2: 验证 + Commit**

```bash
npm run dev   # 无报错；Hero 接入后验证点击爆裂
git add -A && git commit -m "feat: add tsparticles background component"
```

> ⚠️ **explode 退路（P0）**：slim 包不一定包含 explode 点击模式——若接入 Hero 后点击无爆裂：a) 交互模式改 `push`/`repulse`（slim 内置）；b) 或改装 `@tsparticles/full`。二选一确认效果后再提交，保证验收标准 6。

---

### Task 5: 可爱装饰元素（decorations）

**Files:**
- Create: `components/decorations/Wing.tsx`、`MusicNote.tsx`、`Star.tsx`、`Heart.tsx`、`Bubble.tsx`
- Create: `components/decorations/index.ts`

**Interfaces:**
- Produces: `<Wing/>`、`<MusicNote/>`、`<Star/>`、`<Heart/>`、`<Bubble/>`（各接受 `className?`，纯 SVG，`aria-hidden`）。

- [x] **Step 1: 实现五个装饰组件**

`components/decorations/Wing.tsx`：

```tsx
export function Wing({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden>
      <path d="M12 3c3.5 2 5.5 5.2 5.5 9a5.5 5.5 0 0 1-11 0c0-3.8 2-7 5.5-9Z" />
      <path d="M6.5 13.5 3 16m3-2.5 2 4m8.5-4.5L21 16m-3-2.5-2 4" stroke="currentColor" strokeWidth="1.5" fill="none" />
    </svg>
  );
}
```

`components/decorations/MusicNote.tsx`：

```tsx
export function MusicNote({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden>
      <path d="M9 18.5A3.5 3.5 0 1 1 5.5 15 3.5 3.5 0 0 1 9 18.5Zm10-8A3.5 3.5 0 1 1 15.5 7 3.5 3.5 0 0 1 19 10.5Z" />
      <path d="M9 18.5V5l10-2v7.5" fill="none" stroke="currentColor" strokeWidth="1.5" />
    </svg>
  );
}
```

`components/decorations/Star.tsx`：

```tsx
export function Star({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden>
      <path d="M12 2.5 14.9 9l7.1.6-5.4 4.7 1.6 7-6.2-3.6L5.8 21l1.6-7L2 9.6 9.1 9 12 2.5Z" />
    </svg>
  );
}
```

`components/decorations/Heart.tsx`：

```tsx
export function Heart({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden>
      <path d="M12 21s-7.5-4.6-9.5-9A5.5 5.5 0 0 1 12 6.5 5.5 5.5 0 0 1 21.5 12c-2 4.4-9.5 9-9.5 9Z" />
    </svg>
  );
}
```

`components/decorations/Bubble.tsx`：

```tsx
export function Bubble({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden>
      <circle cx="12" cy="12" r="9" fill="none" stroke="currentColor" strokeWidth="1.5" />
      <circle cx="9" cy="10" r="1.6" />
    </svg>
  );
}
```

`components/decorations/index.ts`：

```ts
export { Wing } from "./Wing";
export { MusicNote } from "./MusicNote";
export { Star } from "./Star";
export { Heart } from "./Heart";
export { Bubble } from "./Bubble";
```

- [x] **Step 2: 验证 + Commit**

```bash
npm run dev   # 无报错
git add -A && git commit -m "feat: add cute decorative SVG elements"
```

---

### Task 6: Hero（头像/emoji + slogan + 粒子 + 装饰）

**Files:**
- Create: `components/hero.tsx`
- Modify: `app/page.tsx`

**Interfaces:**
- Consumes: `ParticleBackground`（dynamic 加载）、`decorations/*`
- Produces: `<Hero />`。

- [x] **Step 1: 实现 Hero**

```tsx
"use client";

import dynamic from "next/dynamic";
import { motion } from "motion/react";
import { Wing, MusicNote, Star } from "./decorations";

// 粒子经 dynamic + ssr:false 按需加载，避免 tsparticles 拖慢首页 LCP（NFR-1）
const ParticleBackground = dynamic(() => import("./ParticleBackground"), { ssr: false });

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
          你的名字
        </motion.h1>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.32 }}
          className="mt-2 text-xs uppercase tracking-[0.35em] text-text-muted"
        >
          YOUR NAME
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
```

> **全出血（P1）**：`left-1/2 -ml-[50vw] w-screen` 使 Hero 无视 `main` 的 `max-w-5xl` 约束铺满视口（配合 Task 2 的 `body { overflow-x: clip }` 防横向滚动条）。粒子就绪前由渐变兜底填充，不闪空背景；`prefers-reduced-motion` 开启时粒子层渲染为空、渐变兜底保持氛围。英文名副标（拉丁字符）命中展示字体 `font-display`，中文回退系统字体（验收标准 9）。

- [x] **Step 2: 首页接入（改写 `app/page.tsx`）**

```tsx
import { Hero } from "@/components/hero";

export default function Home() {
  return <Hero />;
}
```

- [x] **Step 3: 验证 + Commit**

```bash
npm run dev   # Hero 居中、头像圆框、粒子、装饰元素、slogan；点击粒子爆裂
git add -A && git commit -m "feat: add hero with avatar, slogan, particles and decorations"
```

---

### Task 7: 关于我滚动叙事

**Files:**
- Create: `content/timeline.ts`、`components/about.tsx`
- Modify: `app/page.tsx`

**Interfaces:**
- Produces: `timeline` 数据（`content/timeline.ts`，类型 `TimelineItem`）；`<About />` 读取数据渲染时间线。

- [x] **Step 1: 经历数据（创建 `content/timeline.ts`，与组件分离，NFR-4）**

```ts
export type TimelineItem = { year: string; text: string };

// 「关于我」经历数据：更新经历无需改组件代码（NFR-4）
export const timeline: TimelineItem[] = [
  { year: "2023", text: "开始做独立开发 / 副业项目" },
  { year: "2024", text: "在某公司担任前端工程师" },
  { year: "2026", text: "上线个人网站" },
];
```

- [x] **Step 2: 实现 About（创建 `components/about.tsx`）**

```tsx
import { ScrollReveal } from "./ScrollReveal";
import { SectionHeading } from "./SectionHeading";
import { timeline } from "@/content/timeline";

export function About() {
  return (
    <section className="py-24">
      <SectionHeading eyebrow="关于我" title="我的经历" />
      <div className="mt-10 space-y-6">
        {timeline.map((item, i) => (
          <ScrollReveal key={item.year} delay={i * 0.1}>
            <div className="flex gap-6 border-l border-border pl-6">
              <span className="font-mono text-accent">{item.year}</span>
              <p className="text-text-muted">{item.text}</p>
            </div>
          </ScrollReveal>
        ))}
      </div>
    </section>
  );
}
```

- [x] **Step 3: 首页接入**

`app/page.tsx`：

```tsx
import { Hero } from "@/components/hero";
import { About } from "@/components/about";

export default function Home() {
  return (<><Hero /><About /></>);
}
```

- [x] **Step 4: 验证 + Commit**

```bash
npm run dev   # 验证后 Ctrl+C 退出（dev server 不会自行退出，勿与 commit 用 && 串联）
git add -A && git commit -m "feat: add about section with scroll-reveal timeline"
```

---

### Task 8: 项目数据层 + 玻璃卡片

**Files:**
- Create: `content/projects.ts`、`lib/projects.ts`、`components/ProjectCard.tsx`
- Test: `lib/projects.test.ts`

**Interfaces:**
- Produces: `content/projects.ts` 导出 `Project` 类型与 `projects`；`lib/projects.ts` 导出 `getAllProjects()`、`getFeaturedProjects()`；`ProjectCard({ project })`。

- [x] **Step 1: 项目数据（创建 `content/projects.ts`）**

```ts
export type Project = {
  slug: string;
  title: string;
  description: string;
  tags: string[];
  image?: string;
  links: { demo?: string; repo?: string };
  featured: boolean;
};

export const projects: Project[] = [
  {
    slug: "example-project",
    title: "示例项目",
    description: "一句话描述这个项目解决了什么问题、用了什么技术。",
    tags: ["Next.js", "TypeScript"],
    links: { demo: "https://example.com", repo: "https://github.com/YOUR_NAME/repo" },
    featured: true,
  },
  {
    slug: "example-project-2",
    title: "示例项目 2",
    description: "第二个示例项目：验证非精选项目只出现在列表页、首页精选不展示。",
    tags: ["Motion", "MDX"],
    links: { repo: "https://github.com/YOUR_NAME/repo-2" },
    featured: false,
  },
];
```

> 首期 2 个项目（1 featured + 1 非 featured），对应需求 §5.3；无截图项目由卡片渐变占位。

- [x] **Step 2: 失败测试（创建 `lib/projects.test.ts`）**

```tsx
import { describe, it, expect } from "vitest";
import { getAllProjects, getFeaturedProjects } from "./projects";

describe("projects", () => {
  it("返回所有项目", () => { expect(getAllProjects().length).toBeGreaterThan(0); });
  it("只返回 featured 项目", () => { expect(getFeaturedProjects().every((p) => p.featured)).toBe(true); });
});
```

- [x] **Step 3: 运行确认失败**

```bash
npm test -- projects
```

- [x] **Step 4: 实现查询函数（创建 `lib/projects.ts`）**

```ts
import { projects, type Project } from "@/content/projects";

export function getAllProjects(): Project[] { return projects; }
export function getFeaturedProjects(): Project[] { return projects.filter((p) => p.featured); }
```

- [x] **Step 5: 运行确认通过**

```bash
npm test -- projects
```

- [x] **Step 6: 玻璃卡片（创建 `components/ProjectCard.tsx`）**

```tsx
"use client";

import { motion } from "motion/react";
import type { Project } from "@/content/projects";

export function ProjectCard({ project }: { project: Project }) {
  return (
    <motion.article
      whileHover={{ y: -6 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
      className="rounded-lg border border-border bg-bg-elevated p-6 backdrop-blur transition-shadow hover:shadow-glow"
    >
      <div className="mb-4 flex h-28 items-center justify-center rounded-md bg-gradient-to-br from-accent/30 to-accent-2/30 text-3xl">
        {project.image ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={project.image} alt={project.title} className="h-full w-full rounded-md object-cover" />
        ) : (
          <span className="text-text-muted">{project.title.slice(0, 1)}</span>
        )}
      </div>
      <h3 className="font-display text-lg font-semibold">{project.title}</h3>
      <p className="mt-2 text-sm text-text-muted">{project.description}</p>
      <div className="mt-4 flex flex-wrap gap-2">
        {project.tags.map((t) => (
          <span key={t} className="rounded-full border border-border px-2 py-0.5 text-xs text-text-muted">{t}</span>
        ))}
      </div>
      <div className="mt-5 flex gap-4 text-sm">
        {project.links.demo && <a href={project.links.demo} target="_blank" rel="noreferrer" className="text-accent hover:underline">演示</a>}
        {project.links.repo && <a href={project.links.repo} target="_blank" rel="noreferrer" className="text-accent hover:underline">源码</a>}
      </div>
    </motion.article>
  );
}
```

- [x] **Step 7: 验证 + Commit**

```bash
npm run dev   # 验证后 Ctrl+C 退出
git add -A && git commit -m "feat: add projects data layer and glassmorphism card"
```

---

### Task 9: 作品集列表页 /projects

**Files:**
- Create: `app/projects/page.tsx`

- [x] **Step 1: 实现页面**

```tsx
import type { Metadata } from "next";
import { SectionHeading } from "@/components/SectionHeading";
import { ProjectCard } from "@/components/ProjectCard";
import { ScrollReveal } from "@/components/ScrollReveal";
import { getAllProjects } from "@/lib/projects";

export const metadata: Metadata = {
  title: "作品集",
  description: "我做过的东西：项目展示与源码链接。",
};

export default function ProjectsPage() {
  const projects = getAllProjects();
  return (
    <section className="py-32">
      <SectionHeading as="h1" eyebrow="作品集" title="我做过的东西" />
      <div className="mt-10 grid gap-6 sm:grid-cols-2">
        {projects.map((p, i) => (
          <ScrollReveal key={p.slug} delay={i * 0.05}><ProjectCard project={p} /></ScrollReveal>
        ))}
      </div>
    </section>
  );
}
```

> `as="h1"`：页面级唯一 h1（验收标准 8）；SEO metadata（FR-5.3）。

- [x] **Step 2: 验证 + Commit**

```bash
npm run dev   # 打开 /projects 确认玻璃卡片网格
git add -A && git commit -m "feat: add projects listing page"
```

---

### Task 10: 博客数据层 lib/posts.ts（TDD）

**Files:**
- Create: `content/posts/hello-world.mdx`、`second-post.mdx`、`draft-post.mdx`、`lib/plaintext.ts`、`lib/posts.ts`
- Test: `lib/posts.test.ts`

**Interfaces:**
- Produces（后续任务严格沿用）：`PostMeta`、`Post`、`getAllPosts()`、`getPostBySlug(slug)`（不存在或 draft 返回 `undefined`）、`getAllTags()`、`getPostsByTag(tag)`、`getAllSeries()`、`getPostsBySeries(name)`、`getRelatedPosts(slug, n?)`、`getPrevNextPost(slug)`、`wordCount(content)`、`readingTime(content)`。

- [x] **Step 1: 示例文章（3 篇，对应需求 §5.3：2 篇共享标签 + 同一系列 + 1 篇草稿）**

`content/posts/hello-world.mdx`：

````mdx
---
title: 你好，世界
date: 2026-08-25
description: 第一篇博客，介绍这个网站。
tags: [生活, 入门]
series: 我的博客
---

## 这是二级标题

这是正文。用 **Markdown** 写内容。

### 这是三级标题

```js
console.log("hello");
```
````

`content/posts/second-post.mdx`：

````mdx
---
title: 你好，动效
date: 2026-08-20
description: 第二篇博客：介绍本站的滚动叙事与粒子动效。
tags: [动效, 入门]
series: 我的博客
---

## 滚动叙事

区块进入视口时淡入上移，逐条错落显现。

## 粒子背景

鼠标悬停连线，点击爆裂。
````

`content/posts/draft-post.mdx`：

````mdx
---
title: 未发布的草稿
date: 2026-08-18
description: 这篇不会被构建发布。
tags: [草稿]
draft: true
---

## 草稿正文

draft: true 的文章不应出现在列表、搜索索引与静态产物中。
````

> 文章文件名用 ASCII slug（文件名即 URL）。

- [x] **Step 2: 失败测试（创建 `lib/posts.test.ts`）**

```tsx
import { describe, it, expect } from "vitest";
import { getAllPosts, getPostBySlug, getAllTags, getPostsByTag, getAllSeries, getPostsBySeries, getRelatedPosts, getPrevNextPost, readingTime } from "./posts";

describe("posts", () => {
  it("返回按日期倒序的文章列表（不含草稿）", () => {
    const posts = getAllPosts();
    expect(posts.length).toBeGreaterThan(0);
    expect(posts[0].slug).toBe("hello-world");
    expect(posts[0].title).toBe("你好，世界");
    expect(posts.some((p) => p.slug === "draft-post")).toBe(false);
  });

  it("按 slug 取单篇并返回正文", () => {
    const post = getPostBySlug("hello-world");
    expect(post?.slug).toBe("hello-world");
    expect(post?.content).toContain("这是正文");
  });

  it("不存在或草稿返回 undefined", () => {
    expect(getPostBySlug("no-such-post")).toBeUndefined();
    expect(getPostBySlug("draft-post")).toBeUndefined();
    expect(getPostBySlug("../hello-world")).toBeUndefined(); // slug 白名单：防路径穿越（NFR-7）
  });

  it("返回标签及数量（按数量倒序）", () => {
    expect(getAllTags()).toEqual([
      { tag: "入门", count: 2 },
      { tag: "生活", count: 1 },
      { tag: "动效", count: 1 },
    ]);
    expect(getPostsByTag("动效").length).toBe(1);
  });

  it("返回系列", () => {
    expect(getAllSeries()).toEqual(["我的博客"]);
    expect(getPostsBySeries("我的博客").length).toBe(2);
  });

  it("相关文章按共享标签排序，前后篇按序返回", () => {
    const related = getRelatedPosts("hello-world");
    expect(related[0]?.slug).toBe("second-post"); // 与 hello-world 共享「入门」标签
    const { newer, older } = getPrevNextPost("hello-world");
    expect(newer).toBeUndefined();
    expect(older?.slug).toBe("second-post");
  });

  it("阅读时长至少 1 分钟", () => {
    expect(readingTime("# 标题\n\n一些正文内容")).toBeGreaterThanOrEqual(1);
  });
});
```

- [x] **Step 3: 运行确认失败**

```bash
npm test -- posts
```

- [x] **Step 4: 实现纯文本工具（创建 `lib/plaintext.ts`）**

```ts
// 剥离 Markdown 语法 → 纯文本：wordCount（阅读字数）与搜索索引（Task 19）共用同一逻辑
export function toPlainText(md: string): string {
  return md
    .replace(/```[\s\S]*?```/g, " ")          // 代码块
    .replace(/!\[[^\]]*\]\([^)]*\)/g, " ")     // 图片
    .replace(/\[([^\]]*)\]\([^)]*\)/g, "$1")   // 链接保留文字
    .replace(/[#>*`~\-_|]/g, " ")              // markdown 符号
    .replace(/\s+/g, " ")
    .trim();
}
```

- [x] **Step 5: 实现数据层（创建 `lib/posts.ts`）**

```ts
import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { toPlainText } from "./plaintext";

const postsDir = path.join(process.cwd(), "content", "posts");

export type PostMeta = {
  slug: string;
  title: string;
  date: string;
  description: string;
  tags: string[];
  series?: string;
  cover?: string;
  draft?: boolean;
};

export type Post = PostMeta & { content: string };

function readPosts(): PostMeta[] {
  const files = fs.readdirSync(postsDir).filter((f) => f.endsWith(".mdx"));
  const posts = files.map((f) => {
    const raw = fs.readFileSync(path.join(postsDir, f), "utf8");
    const { data } = matter(raw);
    return { slug: f.replace(/\.mdx$/, ""), ...(data as Omit<PostMeta, "slug">) };
  });
  return posts
    .filter((p) => !p.draft)
    .sort((a, b) => +new Date(b.date) - +new Date(a.date));
}

let cache: PostMeta[] | null = null;

export function getAllPosts(): PostMeta[] {
  // 构建期缓存，避免多页面重复读盘；dev 下实时读盘，新增文章无需重启
  if (process.env.NODE_ENV !== "production") return readPosts();
  if (!cache) cache = readPosts();
  return cache;
}

export function getPostBySlug(slug: string): Post | undefined {
  if (!/^[a-z0-9-]+$/i.test(slug)) return undefined; // slug 白名单：防路径穿越（NFR-7）
  const file = path.join(postsDir, `${slug}.mdx`);
  if (!fs.existsSync(file)) return undefined;
  const raw = fs.readFileSync(file, "utf8");
  const { data, content } = matter(raw);
  const meta = { slug, ...(data as Omit<PostMeta, "slug">) };
  if (meta.draft) return undefined; // 草稿不发布，也不可直链访问
  return { ...meta, content };
}

export function getAllTags(): { tag: string; count: number }[] {
  const counts = new Map<string, number>();
  for (const p of getAllPosts()) for (const t of p.tags) counts.set(t, (counts.get(t) ?? 0) + 1);
  return [...counts.entries()].map(([tag, count]) => ({ tag, count })).sort((a, b) => b.count - a.count);
}

export function getPostsByTag(tag: string): PostMeta[] {
  return getAllPosts().filter((p) => p.tags.includes(tag));
}

export function getAllSeries(): string[] {
  return [...new Set(getAllPosts().map((p) => p.series).filter((s): s is string => Boolean(s)))];
}

export function getPostsBySeries(name: string): PostMeta[] {
  return getAllPosts().filter((p) => p.series === name);
}

export function getRelatedPosts(slug: string, n = 3): PostMeta[] {
  const current = getPostBySlug(slug);
  if (!current) return [];
  return getAllPosts()
    .filter((p) => p.slug !== slug)
    .sort((a, b) => {
      // 共享标签数加权 + 同系列优先（P2 优化）
      const score = (p: PostMeta) =>
        p.tags.filter((t) => current.tags.includes(t)).length * 2 +
        (p.series && p.series === current.series ? 1 : 0);
      return score(b) - score(a);
    })
    .slice(0, n);
}

export function getPrevNextPost(slug: string): { newer?: PostMeta; older?: PostMeta } {
  const posts = getAllPosts();
  const idx = posts.findIndex((p) => p.slug === slug);
  if (idx === -1) return {};
  return { newer: posts[idx - 1], older: posts[idx + 1] };
}

export function wordCount(content: string): number {
  return toPlainText(content).replace(/\s+/g, "").length; // 与搜索索引（Task 19）共用纯文本逻辑
}

export function readingTime(content: string): number {
  const chinese = (content.match(/[一-龥]/g) || []).length;
  const others = content.replace(/[一-龥]/g, " ").split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.ceil(chinese / 300 + others / 200));
}
```

- [x] **Step 6: 运行确认通过**

```bash
npm test -- posts
```

- [x] **Step 7: Commit**

```bash
git add -A && git commit -m "feat: add posts data layer with tags, series, related, prev-next, reading time"
```

---

### Task 11: 博客列表页 /blog（含标签筛选）

**Files:**
- Create: `components/BlogCard.tsx`
- Create: `app/blog/page.tsx`

**Interfaces:**
- Consumes: `getAllPosts`、`getAllTags`
- Produces: `BlogCard({ post })`（含封面渲染）；`/blog` 路由。

- [x] **Step 1: 文章卡片（创建 `components/BlogCard.tsx`）**

```tsx
"use client";

import Link from "next/link";
import { motion } from "motion/react";
import type { PostMeta } from "@/lib/posts";

export function BlogCard({ post }: { post: PostMeta }) {
  return (
    <motion.article whileHover={{ x: 6 }} transition={{ type: "spring", stiffness: 300, damping: 20 }}>
      <Link href={`/blog/${post.slug}`} className="block rounded-lg border border-border bg-bg-elevated p-6 backdrop-blur transition-colors hover:border-accent">
        {post.cover && (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={post.cover} alt={post.title} className="mb-4 h-40 w-full rounded-md object-cover" />
        )}
        <p className="font-mono text-xs text-text-muted">{post.date}</p>
        <h3 className="font-display mt-2 text-lg font-semibold transition-colors hover:text-accent">{post.title}</h3>
        <p className="mt-2 text-sm text-text-muted">{post.description}</p>
        <div className="mt-4 flex flex-wrap gap-2">
          {post.tags.map((t) => (
            <Link key={t} href={`/tags/${encodeURIComponent(t)}`} className="rounded-full border border-border px-2 py-0.5 text-xs text-text-muted hover:border-accent">#{t}</Link>
          ))}
        </div>
      </Link>
    </motion.article>
  );
}
```

- [x] **Step 2: 列表页（创建 `app/blog/page.tsx`）**

```tsx
import type { Metadata } from "next";
import Link from "next/link";
import { BlogCard } from "@/components/BlogCard";
import { ScrollReveal } from "@/components/ScrollReveal";
import { SectionHeading } from "@/components/SectionHeading";
import { getAllPosts, getAllTags } from "@/lib/posts";

export const metadata: Metadata = {
  title: "博客",
  description: "我写的东西：技术、独立开发与生活随笔。",
};

export default function BlogPage() {
  const posts = getAllPosts();
  const tags = getAllTags();

  return (
    <section className="py-32">
      <SectionHeading as="h1" eyebrow="博客" title="我写的东西" />
      <div className="mt-8 flex flex-wrap items-center gap-2">
        {tags.map(({ tag, count }) => (
          <Link key={tag} href={`/tags/${encodeURIComponent(tag)}`} className="rounded-full border border-border px-3 py-1 text-sm text-text-muted transition-colors hover:border-accent hover:text-text">
            {tag} · {count}
          </Link>
        ))}
        <Link href="/search" className="ml-auto text-sm text-accent hover:underline">搜索文章 →</Link>
      </div>
      <div className="mt-8 space-y-4">
        {posts.map((p, i) => (
          <ScrollReveal key={p.slug} delay={i * 0.05}><BlogCard post={p} /></ScrollReveal>
        ))}
      </div>
    </section>
  );
}
```

- [x] **Step 3: 验证 + Commit**

```bash
npm run dev   # /blog 列表 + 标签栏
git add -A && git commit -m "feat: add blog listing page with tag filter links"
```

---

### Task 12: MDX 渲染 + 代码高亮（lib/mdx.tsx + 复制按钮）

**Files:**
- Create: `lib/mdx.tsx`、`components/CodeBlock.tsx`、`components/ProseP.tsx`

**Interfaces:**
- Produces: `MdxContent({ source })`（含代码高亮、标题锚点、复制按钮、完整正文排版）。

- [x] **Step 1: 复制按钮客户端组件（创建 `components/CodeBlock.tsx`）**

```tsx
"use client";

import { useRef, useState } from "react";

type PreProps = React.HTMLAttributes<HTMLPreElement> & { "data-language"?: string };

export function Pre(props: PreProps) {
  const ref = useRef<HTMLPreElement>(null);
  const [copied, setCopied] = useState(false);
  const lang = props["data-language"];

  const onCopy = async () => {
    const code = ref.current?.querySelector("code")?.textContent ?? "";
    try { await navigator.clipboard.writeText(code); setCopied(true); setTimeout(() => setCopied(false), 1500); } catch {}
  };

  return (
    <div className="group relative my-4">
      {lang && <span className="absolute left-3 top-2 text-xs uppercase text-text-muted">{lang}</span>}
      <pre ref={ref} {...props} className="overflow-x-auto rounded-lg border border-border bg-bg-elevated p-4 pt-8 text-sm" />
      <button onClick={onCopy} className="absolute right-2 top-2 rounded border border-border bg-bg px-2 py-0.5 text-xs text-text-muted opacity-0 transition-opacity group-hover:opacity-100">
        {copied ? "已复制" : "复制"}
      </button>
    </div>
  );
}
```

- [x] **Step 2: 段落滚动淡入（FR-3.6，创建 `components/ProseP.tsx`）**

```tsx
"use client";

import { motion, useReducedMotion } from "motion/react";
import type { HTMLAttributes } from "react";

// 正文段落轻量滚动淡入（FR-3.6）：只淡入一次、位移极小，不打断阅读；减弱动效时纯静态
export function ProseP(props: HTMLAttributes<HTMLParagraphElement>) {
  const reduce = useReducedMotion();
  return (
    <motion.p
      initial={reduce ? undefined : { opacity: 0, y: 8 }}
      whileInView={reduce ? undefined : { opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className="my-4 leading-7"
      {...props}
    />
  );
}
```

> 若后续评审决定正文完全不动效：删除该组件、`p` 映射改回静态 `<p>`，并在 requirements.md FR-3.6 标注降级为「仅文章头部淡入」。

- [x] **Step 3: MDX 封装（创建 `lib/mdx.tsx`）**

```tsx
import { MDXRemote } from "next-mdx-remote-client/rsc";
import rehypePrettyCode from "rehype-pretty-code";
import rehypeSlug from "rehype-slug";
import { Pre } from "@/components/CodeBlock";
import { ProseP } from "@/components/ProseP";

const options = {
  mdxOptions: {
    rehypePlugins: [rehypeSlug, [rehypePrettyCode, { theme: "github-light", keepBackground: false }]],
  },
};

const components = {
  pre: Pre,
  h2: (props: React.HTMLAttributes<HTMLHeadingElement>) => <h2 className="font-display mt-10 mb-4 scroll-mt-24 text-2xl font-semibold" {...props} />,
  h3: (props: React.HTMLAttributes<HTMLHeadingElement>) => <h3 className="font-display mt-8 mb-3 scroll-mt-24 text-xl font-semibold" {...props} />,
  p: (props: React.HTMLAttributes<HTMLParagraphElement>) => <ProseP {...props} />,
  a: (props: React.AnchorHTMLAttributes<HTMLAnchorElement>) => <a className="text-accent underline underline-offset-2" {...props} />,
  ul: (props: React.HTMLAttributes<HTMLUListElement>) => <ul className="my-4 list-disc pl-6" {...props} />,
  ol: (props: React.HTMLAttributes<HTMLOListElement>) => <ol className="my-4 list-decimal pl-6" {...props} />,
  blockquote: (props: React.HTMLAttributes<HTMLQuoteElement>) => <blockquote className="my-4 border-l-2 border-accent pl-4 text-text-muted" {...props} />,
  hr: () => <hr className="my-8 border-border" />,
  img: (props: React.ImgHTMLAttributes<HTMLImageElement>) => (
    // eslint-disable-next-line @next/next/no-img-element
    <img className="my-4 rounded-lg" alt={props.alt ?? ""} {...props} />
  ),
  table: (props: React.HTMLAttributes<HTMLTableElement>) => (
    <div className="my-4 overflow-x-auto">
      <table className="w-full border-collapse text-sm" {...props} />
    </div>
  ),
};

export function MdxContent({ source }: { source: string }) {
  return <MDXRemote source={source} components={components} options={options} />;
}
```

> 标题锚点加 `scroll-mt-24`，目录跳转不被固定导航遮挡；补齐 blockquote/table/hr/img 排版（长文不出现裸元素）。

- [x] **Step 4: 行号 + 语言标注样式（在 `app/globals.css` 末尾追加）**

```css
/* 代码块行号（在代码围栏 meta 里加 `data-line-numbers` 启用） */
code[data-line-numbers] { counter-reset: line; }
code[data-line-numbers] > [data-line]::before {
  counter-increment: line;
  content: counter(line);
  display: inline-block;
  width: 1.5rem;
  margin-right: 1rem;
  text-align: right;
  color: var(--text-muted);
  user-select: none;
}
```

> 语言标注（`js`/`ts` 等）已由 `Pre` 组件读取 `data-language` 渲染在代码块左上角；行号在需要时于围栏加 `data-line-numbers`，例如 ` ```js data-line-numbers `。
> ⚠️ 该 meta 写法随 `rehype-pretty-code` 版本变化（v0.14+ 对围栏 meta 的解析有调整）：安装后先写一篇带行号的文章验证，若行号不生效，按所装版本的文档改用 `showLineNumbers` 等 meta 并同步调整本步骤 CSS（版本组合已在 Task 1 锁定；若仍异常，回 Task 1 Step 3 按版本矩阵调整）。

- [x] **Step 5: 验证 + Commit**

```bash
npm run dev   # 验证后 Ctrl+C 退出
git add -A && git commit -m "feat: add MDX rendering with code highlighting and copy button"
```

---

### Task 13: 文章页基础（MDX + 阅读进度 + 阅读时长）

**Files:**
- Create: `components/ReadingProgress.tsx`
- Create: `app/blog/[slug]/page.tsx`

- [x] **Step 1: 阅读进度条（创建 `components/ReadingProgress.tsx`）**

```tsx
"use client";

import { motion, useScroll, useSpring } from "motion/react";

export function ReadingProgress() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 100, damping: 30, restDelta: 0.001 });
  return <motion.div style={{ scaleX }} className="fixed inset-x-0 top-0 z-[60] h-1 origin-left bg-accent" />;
}
```

- [x] **Step 2: 文章页（创建 `app/blog/[slug]/page.tsx`）**

```tsx
import { notFound } from "next/navigation";
import { MdxContent } from "@/lib/mdx";
import { ReadingProgress } from "@/components/ReadingProgress";
import { ScrollReveal } from "@/components/ScrollReveal";
import { getAllPosts, getPostBySlug, readingTime, wordCount } from "@/lib/posts";

export function generateStaticParams() {
  return getAllPosts().map((p) => ({ slug: p.slug }));
}

export default async function PostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  if (!post) notFound();   // getPostBySlug 对不存在/草稿返回 undefined，此处兜底生效

  return (
    <>
      <ReadingProgress />
      <article className="mx-auto max-w-2xl py-32">
        <ScrollReveal>
          <p className="font-mono text-sm text-text-muted">{post.date} · 约 {readingTime(post.content)} 分钟 · {wordCount(post.content)} 字</p>
          <h1 className="font-display mt-3 text-4xl font-bold tracking-tight">{post.title}</h1>
          <p className="mt-4 text-text-muted">{post.description}</p>
        </ScrollReveal>
        {post.cover && (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={post.cover} alt={post.title} className="mt-8 h-64 w-full rounded-lg object-cover" />
        )}
        <div className="mt-10"><MdxContent source={post.content} /></div>
      </article>
    </>
  );
}
```

- [x] **Step 3: 验证**

```bash
npm run dev   # 打开 /blog/hello-world，标题、代码高亮、进度条、阅读时长正常；/blog/draft-post 应 404
npm run build # 构建成功，out/blog/hello-world/index.html 已生成，out 中不含 draft-post
```

- [x] **Step 4: Commit**

```bash
git add -A && git commit -m "feat: add blog post page with MDX, reading progress and reading time"
```

---

### Task 14: 文章页增强（TOC + 上一篇/下一篇 + 相关 + 分享）

**Files:**
- Create: `lib/headings.ts`、`components/TableOfContents.tsx`、`components/PostNav.tsx`、`components/RelatedPosts.tsx`、`components/ShareButtons.tsx`
- Modify: `app/blog/[slug]/page.tsx`
- Test: `lib/headings.test.ts`

**Interfaces:**
- Consumes: `getPostBySlug`、`getRelatedPosts`、`getPrevNextPost`
- Produces: `extractHeadings(content)`、`<TableOfContents headings>`、`<PostNav newer? older?>`、`<RelatedPosts posts>`、`<ShareButtons title slug>`。

- [x] **Step 1: 失败测试（创建 `lib/headings.test.ts`）**

```tsx
import { describe, it, expect } from "vitest";
import { extractHeadings } from "./headings";

describe("extractHeadings", () => {
  it("提取 h2/h3 并生成 id", () => {
    const hs = extractHeadings("## 二级标题\n### 三级标题");
    expect(hs).toEqual([
      { level: 2, text: "二级标题", id: "二级标题" },
      { level: 3, text: "三级标题", id: "三级标题" },
    ]);
  });
  it("忽略代码块内的井号", () => {
    const hs = extractHeadings("```js\n# 不是标题\n```\n## 真的标题");
    expect(hs).toEqual([{ level: 2, text: "真的标题", id: "真的标题" }]);
  });
  it("约定：标题保持纯文本（含链接的标题 id 与 rehype-slug 不一致）", () => {
    const hs = extractHeadings("## 参考 [MDN](https://mdn.dev)");
    // raw markdown 经 github-slugger 与 rehype-slug（纯文本）结果不同 → 首期约定标题不含链接/行内代码
    expect(hs[0].id).not.toBe("参考-mdn");
  });
});
```

- [x] **Step 2: 运行确认失败**

```bash
npm test -- headings
```

- [x] **Step 3: 实现（创建 `lib/headings.ts`）**

```ts
import GithubSlugger from "github-slugger";

export type Heading = { text: string; level: 2 | 3; id: string };

export function extractHeadings(content: string): Heading[] {
  const slugger = new GithubSlugger();
  const withoutCode = content.replace(/```[\s\S]*?```/g, "");
  const headings: Heading[] = [];
  for (const line of withoutCode.split("\n")) {
    const m = /^(#{2,3})\s+(.*)$/.exec(line);
    if (m) headings.push({ level: m[1].length as 2 | 3, text: m[2].trim(), id: slugger.slug(m[2].trim()) });
  }
  return headings;
}
```

> 与 `rehype-slug` 共用 `github-slugger`，生成的锚点 id 一致（中文标题两者均原样保留）。

- [x] **Step 4: 运行确认通过**

```bash
npm test -- headings
```

- [x] **Step 5: 实现 TOC（创建 `components/TableOfContents.tsx`）**

```tsx
"use client";

import { useEffect, useState } from "react";
import type { Heading } from "@/lib/headings";

export function TableOfContents({ headings }: { headings: Heading[] }) {
  const [active, setActive] = useState("");

  useEffect(() => {
    const els = headings.map((h) => document.getElementById(h.id)).filter((e): e is HTMLElement => Boolean(e));
    const observer = new IntersectionObserver(
      (entries) => { for (const e of entries) if (e.isIntersecting) setActive(e.target.id); },
      { rootMargin: "-20% 0px -70% 0px" }
    );
    els.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [headings]);

  if (headings.length === 0) return null;
  return (
    <nav className="rounded-lg border border-border bg-bg-elevated p-4 text-sm backdrop-blur">
      <p className="mb-2 font-semibold text-text">目录</p>
      <ul className="space-y-1">
        {headings.map((h) => (
          <li key={h.id} style={{ paddingLeft: h.level === 3 ? 16 : 0 }}>
            <a href={`#${h.id}`} className={active === h.id ? "text-accent" : "text-text-muted hover:text-accent"}>{h.text}</a>
          </li>
        ))}
      </ul>
    </nav>
  );
}
```

- [x] **Step 6: 实现上一篇/下一篇（创建 `components/PostNav.tsx`）**

```tsx
import Link from "next/link";
import type { PostMeta } from "@/lib/posts";

export function PostNav({ newer, older }: { newer?: PostMeta; older?: PostMeta }) {
  return (
    <nav className="mt-12 flex justify-between gap-4 border-t border-border pt-6 text-sm">
      {newer ? <Link href={`/blog/${newer.slug}`} className="text-text-muted hover:text-accent">← {newer.title}</Link> : <span />}
      {older ? <Link href={`/blog/${older.slug}`} className="text-right text-text-muted hover:text-accent">{older.title} →</Link> : <span />}
    </nav>
  );
}
```

- [x] **Step 7: 实现相关推荐（创建 `components/RelatedPosts.tsx`）**

```tsx
import Link from "next/link";
import type { PostMeta } from "@/lib/posts";

export function RelatedPosts({ posts }: { posts: PostMeta[] }) {
  if (posts.length === 0) return null;
  return (
    <section className="mt-12">
      <h2 className="font-display text-xl font-semibold">相关文章</h2>
      <div className="mt-4 space-y-3">
        {posts.map((p) => (
          <Link key={p.slug} href={`/blog/${p.slug}`} className="block rounded-lg border border-border bg-bg-elevated p-4 backdrop-blur transition-colors hover:border-accent">
            <span className="font-semibold">{p.title}</span>
            <span className="ml-3 text-sm text-text-muted">{p.date}</span>
          </Link>
        ))}
      </div>
    </section>
  );
}
```

- [x] **Step 8: 实现分享按钮（创建 `components/ShareButtons.tsx`）**

```tsx
"use client";

import { useState } from "react";

export function ShareButtons({ title, slug }: { title: string; slug: string }) {
  const [copied, setCopied] = useState(false);
  const url = typeof window !== "undefined" ? `${window.location.origin}/blog/${slug}` : "";

  const copy = async () => {
    try { await navigator.clipboard.writeText(url); setCopied(true); setTimeout(() => setCopied(false), 1500); } catch {}
  };
  const share = async () => {
    const data = { title, url };
    if (navigator.share) { try { await navigator.share(data); } catch {} }
    else copy();
  };

  return (
    <div className="mt-8 flex gap-3 text-sm">
      <button onClick={copy} className="rounded-lg border border-border px-3 py-1.5 text-text-muted hover:border-accent">{copied ? "已复制链接" : "复制链接"}</button>
      <button onClick={share} className="rounded-lg border border-border px-3 py-1.5 text-text-muted hover:border-accent">分享</button>
    </div>
  );
}
```

- [x] **Step 9: 文章页接入（修改 `app/blog/[slug]/page.tsx`）**

> 同时把 Task 13 里的 `<article className="mx-auto max-w-2xl py-32">` 改为 `max-w-4xl`，正文内容用 `max-w-prose` 收窄（NFR-5 正文宽度受限），给右侧 TOC 让出空间。
> **标题约定（P1）**：首期文章标题保持纯文本（不含链接/行内代码），保证 `extractHeadings` 与 `rehype-slug` 的锚点 id 一致（差异用例见 Step 1 测试）。

**文件顶部**补导入：

```tsx
import { extractHeadings } from "@/lib/headings";
import { TableOfContents } from "@/components/TableOfContents";
import { PostNav } from "@/components/PostNav";
import { RelatedPosts } from "@/components/RelatedPosts";
import { ShareButtons } from "@/components/ShareButtons";
import { getRelatedPosts, getPrevNextPost } from "@/lib/posts";
```

**组件函数体内**（`notFound()` 兜底之后）计算：

```tsx
const headings = extractHeadings(post.content);
const related = getRelatedPosts(slug);
const { newer, older } = getPrevNextPost(slug);
```

**`<article>` 内**渲染（正文 + 右侧 TOC，之后依次是分享、相关、前后篇）：

```tsx
<div className="flex gap-8">
  <div className="min-w-0 max-w-prose flex-1"><MdxContent source={post.content} /></div>
  <aside className="hidden w-56 shrink-0 lg:block"><div className="sticky top-24"><TableOfContents headings={headings} /></div></aside>
</div>
<ShareButtons title={post.title} slug={slug} />
<RelatedPosts posts={related} />
<PostNav newer={newer} older={older} />
```

- [x] **Step 10: 验证 + Commit**

```bash
npm run dev   # /blog/hello-world 出现目录、分享、相关、前后篇；点目录跳转标题不被导航遮挡
git add -A && git commit -m "feat: add TOC, prev-next, related and share to post page"
```

---

### Task 15: 评论 Giscus

**Files:**
- Create: `components/Comments.tsx`
- Modify: `app/blog/[slug]/page.tsx`

**Interfaces:**
- Produces: `<Comments />`（Giscus 嵌入，占位配置，用户替换为自己的仓库参数）。

- [x] **Step 1: 实现 Comments**

```tsx
"use client";

import Giscus from "@giscus/react";

export function Comments() {
  return (
    <section className="mt-12">
      <Giscus
        repo="YOUR_NAME/portfolio-blog"
        repoId="R_kgDOXXXXXX"
        category="Announcements"
        categoryId="DIC_kwDOXXXXXX"
        mapping="pathname"
        strict="0"
        reactionsEnabled="1"
        emitMetadata="0"
        inputPosition="top"
        theme="light"
        lang="zh-CN"
        loading="lazy"
      />
    </section>
  );
}
```

> `theme` 目前写死 `"light"`：未来加暗色主题时改为 `"dark"`/`"auto"` 并与主题切换联动。

- [x] **Step 2: 文章页接入**

在 `<RelatedPosts posts={related} />` 之后补 `<Comments />` 及导入。

- [x] **Step 3: 记录待办**

> ⚠️ `repoId`/`categoryId` 需用户到 giscus.app 生成（先在 GitHub 仓库 Settings → General 开启 Discussions）。在 `README.md` 中注明。

- [x] **Step 4: Commit**

```bash
git add -A && git commit -m "feat: add Giscus comments component"
```

---

### Task 16: 标签页 /tags/[tag]

**Files:**
- Create: `app/tags/[tag]/page.tsx`

- [x] **Step 1: 实现**

```tsx
import type { Metadata } from "next";
import { BlogCard } from "@/components/BlogCard";
import { ScrollReveal } from "@/components/ScrollReveal";
import { SectionHeading } from "@/components/SectionHeading";
import { getAllTags, getPostsByTag } from "@/lib/posts";

export function generateStaticParams() {
  return getAllTags().map(({ tag }) => ({ tag }));
}

export async function generateMetadata({ params }: { params: Promise<{ tag: string }> }): Promise<Metadata> {
  const { tag } = await params;
  return { title: `#${tag}`, description: `标签「${tag}」下的全部文章。` };
}

export default async function TagPage({ params }: { params: Promise<{ tag: string }> }) {
  const { tag } = await params;
  // ⚠️ Next 传入的 params 已解码，不要再 decodeURIComponent（含 % 的标签会二次解码抛 URIError）
  const posts = getPostsByTag(tag);

  return (
    <section className="py-32">
      <SectionHeading as="h1" eyebrow="标签" title={`#${tag}`} />
      <div className="mt-8 space-y-4">
        {posts.map((p, i) => (
          <ScrollReveal key={p.slug} delay={i * 0.05}><BlogCard post={p} /></ScrollReveal>
        ))}
      </div>
    </section>
  );
}
```

- [x] **Step 2: 验证 + Commit**

```bash
npm run dev   # /tags/入门 显示该标签文章
git add -A && git commit -m "feat: add tag page"
```

---

### Task 17: 归档页 /archive

**Files:**
- Create: `app/archive/page.tsx`

**Interfaces:**
- Produces: `/archive` 路由（按年份聚合 + 标签云，对齐 PRD FR-3.9）。

- [x] **Step 1: 实现**

```tsx
import type { Metadata } from "next";
import Link from "next/link";
import { SectionHeading } from "@/components/SectionHeading";
import { getAllPosts, getAllTags } from "@/lib/posts";

export const metadata: Metadata = {
  title: "归档",
  description: "全部文章按年份归档。",
};

export default function ArchivePage() {
  const posts = getAllPosts();
  const tags = getAllTags();
  const byYear = new Map<string, typeof posts>();
  for (const p of posts) {
    const year = p.date.slice(0, 4);
    byYear.set(year, [...(byYear.get(year) ?? []), p]);
  }

  return (
    <section className="py-32">
      <SectionHeading as="h1" eyebrow="归档" title="全部文章" />
      <div className="mt-10 space-y-10">
        {/* 标签云：标签聚合（PRD FR-3.9），筛选见标签页 */}
        <div className="flex flex-wrap gap-2">
          {tags.map(({ tag, count }) => (
            <Link key={tag} href={`/tags/${encodeURIComponent(tag)}`} className="rounded-full border border-border px-3 py-1 text-sm text-text-muted transition-colors hover:border-accent hover:text-text">
              {tag} · {count}
            </Link>
          ))}
        </div>
        {[...byYear.entries()].map(([year, list]) => (
          <div key={year}>
            <h2 className="font-display text-2xl font-semibold text-accent">{year}</h2>
            <ul className="mt-4 space-y-3">
              {list.map((p) => (
                <li key={p.slug} className="flex items-baseline gap-4">
                  <span className="font-mono text-sm text-text-muted">{p.date}</span>
                  <Link href={`/blog/${p.slug}`} className="hover:text-accent">{p.title}</Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </section>
  );
}
```

- [x] **Step 2: 验证 + Commit**

```bash
npm run dev   # /archive 按年份聚合
git add -A && git commit -m "feat: add archive page grouped by year"
```

---

### Task 18: 系列页 /series/[name]

**Files:**
- Create: `app/series/[name]/page.tsx`

- [x] **Step 1: 实现**

```tsx
import type { Metadata } from "next";
import { BlogCard } from "@/components/BlogCard";
import { ScrollReveal } from "@/components/ScrollReveal";
import { SectionHeading } from "@/components/SectionHeading";
import { getAllSeries, getPostsBySeries } from "@/lib/posts";

export function generateStaticParams() {
  return getAllSeries().map((name) => ({ name }));
}

export async function generateMetadata({ params }: { params: Promise<{ name: string }> }): Promise<Metadata> {
  const { name } = await params;
  return { title: `系列：${name}`, description: `「${name}」系列的全部文章。` };
}

export default async function SeriesPage({ params }: { params: Promise<{ name: string }> }) {
  const { name } = await params;
  // ⚠️ Next 传入的 params 已解码，不要再 decodeURIComponent
  const posts = getPostsBySeries(name);

  return (
    <section className="py-32">
      <SectionHeading as="h1" eyebrow="系列" title={name} />
      <div className="mt-8 space-y-4">
        {posts.map((p, i) => (
          <ScrollReveal key={p.slug} delay={i * 0.05}><BlogCard post={p} /></ScrollReveal>
        ))}
      </div>
    </section>
  );
}
```

- [x] **Step 2: 验证 + Commit**

```bash
npm run dev   # /series/我的博客
git add -A && git commit -m "feat: add series page"
```

---

### Task 19: 站内搜索（索引脚本 + SearchBox + /search）

**Files:**
- Create: `scripts/build-search-index.mjs`、`components/SearchBox.tsx`、`app/search/page.tsx`
- Modify: `package.json`（恢复 `prebuild`/`predev`）

**Interfaces:**
- Produces: `public/search-index.json`；`<SearchBox />`；`/search` 路由。

- [x] **Step 1: 索引脚本（重写 `scripts/build-search-index.mjs`）**

```js
import fs from "fs";
import path from "path";
import matter from "gray-matter";

// 剥离 Markdown 语法，正文只留纯文本：搜索更准、JSON 更小
// ⚠️ 与 lib/plaintext.ts 的 toPlainText 逻辑保持同步（本脚本为 .mjs，Node 20 无法直接 import TS；升级 Node ≥ 22.18 后可改为单点复用）
function toPlainText(md) {
  return md
    .replace(/```[\s\S]*?```/g, " ")          // 代码块
    .replace(/!\[[^\]]*\]\([^)]*\)/g, " ")     // 图片
    .replace(/\[([^\]]*)\]\([^)]*\)/g, "$1")   // 链接保留文字
    .replace(/[#>*`~\-_|]/g, " ")              // markdown 符号
    .replace(/\s+/g, " ")
    .trim();
}

const dir = path.join(process.cwd(), "content", "posts");
const out = path.join(process.cwd(), "public", "search-index.json");

const files = fs.readdirSync(dir).filter((f) => f.endsWith(".mdx"));
const index = files
  .map((f) => {
    const raw = fs.readFileSync(path.join(dir, f), "utf8");
    const { data, content } = matter(raw);
    return {
      slug: f.replace(/\.mdx$/, ""),
      title: data.title ?? "",
      description: data.description ?? "",
      tags: data.tags ?? [],
      content: toPlainText(content),
      draft: data.draft ?? false,
    };
  })
  .filter((p) => !p.draft)
  .map(({ draft, ...rest }) => rest);

fs.writeFileSync(out, JSON.stringify(index));
```

- [x] **Step 2: 恢复脚本（修改 `package.json`）**

确认 `scripts` 含：

```json
"prebuild": "node scripts/build-search-index.mjs",
"predev": "node scripts/build-search-index.mjs"
```

> 同时在 `.gitignore` 追加 `public/search-index.json`（构建产物，predev/prebuild 自动生成，不入库，避免内容变更污染 diff）。
> dev 下索引由 `predev` 在启动时生成：新增/修改文章后需重启 `npm run dev`（或手动重跑 `node scripts/build-search-index.mjs`）索引才会刷新——README（Task 23）中注明。

- [x] **Step 3: 搜索组件（创建 `components/SearchBox.tsx`，输入防抖）**

```tsx
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

type Doc = { slug: string; title: string; description: string; tags: string[]; content: string };

export function SearchBox() {
  const [docs, setDocs] = useState<Doc[]>([]);
  const [q, setQ] = useState("");
  const [debounced, setDebounced] = useState("");

  useEffect(() => {
    fetch("/search-index.json").then((r) => r.json()).then(setDocs).catch(() => {});
  }, []);

  useEffect(() => {
    const t = setTimeout(() => setDebounced(q.trim()), 150);
    return () => clearTimeout(t);
  }, [q]);

  const results = debounced
    ? docs.filter((d) => `${d.title} ${d.description} ${d.tags.join(" ")} ${d.content}`.toLowerCase().includes(debounced.toLowerCase())).slice(0, 20)
    : [];

  return (
    <form role="search" className="w-full">
      <input
        type="search"
        value={q}
        onChange={(e) => setQ(e.target.value)}
        aria-label="搜索文章"
        placeholder="搜索文章标题、标签、正文…"
        className="w-full rounded-lg border border-border bg-bg-elevated px-4 py-3 text-text outline-none backdrop-blur placeholder:text-text-muted focus:border-accent"
      />
      <ul className="mt-6 space-y-3">
        {debounced && results.map((r) => (
          <li key={r.slug}>
            <Link href={`/blog/${r.slug}`} className="block rounded-lg border border-border bg-bg-elevated p-4 backdrop-blur transition-colors hover:border-accent">
              <span className="font-semibold">{r.title}</span>
              <span className="ml-3 text-sm text-text-muted">{r.description}</span>
            </Link>
          </li>
        ))}
        {debounced && results.length === 0 && <li className="text-text-muted">没有匹配的结果</li>}
      </ul>
    </form>
  );
}
```

> `role="search"` + `aria-label` + `type="search"`：搜索可访问性（NFR-3）。

- [x] **Step 4: 搜索页（创建 `app/search/page.tsx`）**

```tsx
import type { Metadata } from "next";
import { SearchBox } from "@/components/SearchBox";
import { SectionHeading } from "@/components/SectionHeading";

export const metadata: Metadata = {
  title: "搜索",
  description: "站内搜索文章标题、标签与正文。",
};

export default function SearchPage() {
  return (
    <section className="py-32">
      <SectionHeading as="h1" eyebrow="搜索" title="找文章" />
      <div className="mt-8"><SearchBox /></div>
    </section>
  );
}
```

- [x] **Step 5: 验证 + Commit**

```bash
npm run dev   # /search 搜索「你好」能出结果
git add -A && git commit -m "feat: add client-side search with build-time index"
```

---

### Task 20: 首页精选区块

**Files:**
- Create: `components/featured.tsx`
- Modify: `app/page.tsx`

- [x] **Step 1: 实现精选**

```tsx
import Link from "next/link";
import { BlogCard } from "./BlogCard";
import { ProjectCard } from "./ProjectCard";
import { ScrollReveal } from "./ScrollReveal";
import { SectionHeading } from "./SectionHeading";
import { getAllPosts } from "@/lib/posts";
import { getFeaturedProjects } from "@/lib/projects";

export function Featured() {
  const projects = getFeaturedProjects().slice(0, 3);
  const posts = getAllPosts().slice(0, 3);

  return (
    <>
      <section className="py-24">
        {/* 首页唯一 h1 在 Hero，区块标题保持 h2 */}
        <SectionHeading eyebrow="精选" title="代表作品" />
        <div className="mt-10 grid gap-6 sm:grid-cols-2">
          {projects.map((p, i) => (<ScrollReveal key={p.slug} delay={i * 0.05}><ProjectCard project={p} /></ScrollReveal>))}
        </div>
        <ScrollReveal className="mt-8"><Link href="/projects" className="text-accent hover:underline">查看全部作品 →</Link></ScrollReveal>
      </section>
      <section className="py-24">
        <SectionHeading eyebrow="写作" title="最新文章" />
        <div className="mt-10 space-y-4">
          {posts.map((p, i) => (<ScrollReveal key={p.slug} delay={i * 0.05}><BlogCard post={p} /></ScrollReveal>))}
        </div>
        <ScrollReveal className="mt-8"><Link href="/blog" className="text-accent hover:underline">查看全部文章 →</Link></ScrollReveal>
      </section>
    </>
  );
}
```

- [x] **Step 2: 首页接入**

`app/page.tsx`：

```tsx
import { Hero } from "@/components/hero";
import { About } from "@/components/about";
import { Featured } from "@/components/featured";

export default function Home() {
  return (<><Hero /><About /><Featured /></>);
}
```

- [x] **Step 3: 验证 + Commit**

```bash
npm run dev   # 验证后 Ctrl+C 退出
git add -A && git commit -m "feat: add featured projects and posts to homepage"
```

---

### Task 21: 微交互打磨（转场、响应式）

**Files:**
- Create: `components/PageTransition.tsx`
- Modify: `app/layout.tsx`

- [x] **Step 1: 转场组件（创建 `components/PageTransition.tsx`）**

```tsx
"use client";

import { motion } from "motion/react";
import { usePathname } from "next/navigation";

export function PageTransition({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  return (
    // key=pathname：路由变化时重挂载，客户端导航也能重放淡入（静态导出下 layout 常驻）
    <motion.main
      key={pathname}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
      className="mx-auto max-w-5xl px-6"
    >
      {children}
    </motion.main>
  );
}
```

- [x] **Step 2: 布局接入**

`app/layout.tsx` 把 `<main className="mx-auto max-w-5xl px-6">{children}</main>` 换成 `<PageTransition>{children}</PageTransition>` 并补导入。

- [x] **Step 3: 验证 + Commit**

```bash
npm run dev   # 移动视口导航不溢出、汉堡菜单可用、页面切换淡入重放
git add -A && git commit -m "feat: add page transition and responsive polish"
```

---

### Task 22: SEO + sitemap（含新路由）

**Files:**
- Create: `app/sitemap.ts`、`app/robots.ts`、`app/not-found.tsx`
- Modify: `app/blog/[slug]/page.tsx`（文章级 metadata）

- [x] **Step 1: sitemap（创建 `app/sitemap.ts`）**

```tsx
import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/site";
import { getAllPosts, getAllTags, getAllSeries } from "@/lib/posts";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = SITE_URL;
  const posts = getAllPosts().map((p) => ({ url: `${base}/blog/${p.slug}`, lastModified: p.date }));
  const tags = getAllTags().map(({ tag }) => ({ url: `${base}/tags/${encodeURIComponent(tag)}` }));
  const series = getAllSeries().map((name) => ({ url: `${base}/series/${encodeURIComponent(name)}` }));
  return [
    { url: base, lastModified: new Date() },
    { url: `${base}/projects`, lastModified: new Date() },
    { url: `${base}/blog`, lastModified: new Date() },
    { url: `${base}/archive`, lastModified: new Date() },
    { url: `${base}/search`, lastModified: new Date() },
    ...posts, ...tags, ...series,
  ];
}
```

> ⚠️ **静态导出回退（P0 验证项）**：`output: 'export'` 下 `app/sitemap.ts` / `app/robots.ts` 是否生成产物随 Next 版本而异。Step 4 构建后**必须确认** `out/sitemap.xml`、`out/robots.txt` 存在；若缺失，删除这两个文件，改为在 `scripts/build-search-index.mjs` 中同步生成 `public/sitemap.xml` / `public/robots.txt`（静态路由 + 用 gray-matter 读 `content/posts/*.mdx` 补文章/标签/系列 URL，逻辑与本步一致），重新构建验证。

- [x] **Step 2: 文章级 metadata（修改 `app/blog/[slug]/page.tsx`）**

```tsx
import type { Metadata } from "next";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  if (!post) return {};
  return {
    title: post.title,
    description: post.description,
    openGraph: { title: post.title, description: post.description, type: "article" },
  };
}
```

- [x] **Step 3: robots + 404 页（创建 `app/robots.ts`、`app/not-found.tsx`）**

`app/robots.ts`：

```ts
import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/site";

export default function robots(): MetadataRoute.Robots {
  return { rules: [{ userAgent: "*", allow: "/" }], sitemap: `${SITE_URL}/sitemap.xml` };
}
```

`app/not-found.tsx`：

```tsx
import Link from "next/link";
import { SectionHeading } from "@/components/SectionHeading";

export default function NotFound() {
  return (
    <section className="py-32 text-center">
      <SectionHeading as="h1" eyebrow="404" title="页面走丢了" />
      <p className="mt-6 text-text-muted">你访问的页面不存在，回首页看看吧。</p>
      <Link href="/" className="mt-8 inline-block text-accent hover:underline">回到首页 →</Link>
    </section>
  );
}
```

> 静态导出会生成 `out/404.html`，各托管平台自动作为 404 页提供。

- [x] **Step 4: 验证 + Commit**

```bash
npm run build   # 确认 out/sitemap.xml、out/robots.txt、out/404.html 生成，含新路由（sitemap/robots 缺失时按 Step 1 注的回退处理）
git add -A && git commit -m "feat: add SEO metadata, sitemap, robots and 404 page"
```

---

### Task 23: 部署 + 域名 + Giscus 配置

**Files:**
- Create: `README.md`

- [ ] **Step 1: 推送代码**

```bash
git remote add origin https://github.com/YOUR_NAME/portfolio-blog.git
git push -u origin main
```

- [ ] **Step 2: 部署 Vercel（推荐）**

1. vercel.com 用 GitHub 登录 → Add New → Project 导入仓库。
2. 框架自动识别 Next.js，Deploy。
3. 得到 `https://portfolio-blog.vercel.app`。

> **部署后立即**把 `lib/site.ts` 的 `SITE_URL` 替换为免费域名并重新部署（sitemap/OG 不带占位域名上线）；绑定自定义域名（Step 4）时再替换一次。

- [ ] **Step 3: （可选）Cloudflare Pages**

dash.cloudflare.com → Workers & Pages → Create → Pages → 连接仓库，Build command `npm run build`，输出目录 `out`。

- [ ] **Step 4: （可选）绑定域名**

域名设置里加自定义域名（~¥70/年），按提示配 DNS（CNAME）；绑定后把 `lib/site.ts` 的 `SITE_URL` 替换为真实域名并重新部署。

- [ ] **Step 5: 配置 Giscus**

1. GitHub 仓库 Settings → General → 勾选 Discussions。
2. 打开 giscus.app，填入仓库名，生成 `repoId`/`categoryId`，替换 `components/Comments.tsx` 里的占位值。

- [ ] **Step 6: Lighthouse 验证（NFR-1）**

```bash
npx lighthouse https://<你的域名> --only-categories=performance --view
```

> 记录首页 LCP：目标 < 2.5s。若超标：确认粒子已 `next/dynamic` 懒载、首屏图片已压缩；必要时降低 Task 4 `options.particles.number.value`（40 → 25）或关闭 `links`。

- [x] **Step 7: 写 README**

```markdown
# 个人作品集 + 博客

Next.js + Motion + tsparticles + MDX 的静态站点。

## 开发
npm run dev

## 构建
npm run build   # 产出 out/（prebuild 会先生成搜索索引）

## 部署
- Vercel：自动识别 Next.js
- Cloudflare Pages：Build command `npm run build`，输出目录 `out`

## 字体
把展示字体命名为 `public/fonts/display.woff2`（或 `display.ttf` / `display.otf`，任选其一）即可在标题使用，无需改代码。

## 内容
- 文章：`content/posts/*.mdx`（frontmatter 见 requirements.md §5.1）
- 项目：`content/projects.ts`
- 图片：`public/images/`，以 `/images/...` 引用

## 评论
Giscus 配置见 `components/Comments.tsx`（需先在 GitHub 仓库开启 Discussions）。
```

- [x] **Step 8: Commit**

```bash
git add -A && git commit -m "docs: add deployment and giscus instructions"
```

---

## 后续按需扩展（非本期）

- 暗/亮主题切换、更多微交互细节。
- 3D / WebGL（React Three Fiber）。
- 多语言、PWA、RSS。

---

## 修订记录（v3，2026-08-25）

可行性评审修订（与 requirements.md v1.1 / design.md v3 对齐）：

- **R1** 全局约束 + Task 1：新增依赖版本矩阵（rehype-pretty-code ↔ shiki 兼容组合、React 19 peer 兼容），安装时核实并锁定 lockfile（P0-1）。
- **R2** Task 1 Step 1：注明 create-next-app 交互询问会阻塞 agentic 执行，用 flag 全量指定选项或管道应答（P0-3）。
- **R3** Task 4：粒子尊重 `prefers-reduced-motion`、canvas 容器 `aria-hidden`；`explode` 模式不在 slim 包时提供退路（push/repulse 或 full 包）（P0-2/P1-2）。
- **R4** Task 6 + Task 2：Hero 全出血（`left-1/2 -ml-[50vw] w-screen`）+ 静态渐变兜底；`body` 加 `overflow-x: clip`（P1-3）。
- **R5** Task 12：新增 `ProseP` 客户端组件实现 FR-3.6「段落滚动淡入」，尊重减弱动效（P1-1）。
- **R6** Task 14：TOC 标题约定纯文本并补测试用例（含链接的标题 id 与 rehype-slug 不一致）（P1-5）。
- **R7** Task 19：`public/search-index.json` 加入 `.gitignore`（构建产物）（P1-4）。
- **R8** Task 22：新增 `app/robots.ts` 与 `app/not-found.tsx`（P2）。
- **R9** Task 23：部署后立即替换 `SITE_URL` 为免费域名；新增 Lighthouse LCP 验证步骤（NFR-1）（P2）。
- **R10** Task 2：移动端菜单支持 Esc 关闭（P2）。

评审修订（v2，2026-08-25），与 design.md v3 / requirements.md v1.1 对齐：

- **A1** Task 3：ScrollReveal / SectionHeading 改为命名导出（全局约束新增「组件一律命名导出」）。
- **A2** Task 7/8/12/20：`npm run dev && git commit` 拆分为「验证」+「单独 commit」（dev server 不退出，`&&` 后的 commit 永不执行）。
- **A3** Task 1：脚手架改为在仓库根执行 `npx create-next-app@15 .`，避免 `portfolio-blog/portfolio-blog` 嵌套。
- **A4** Task 2：移除 `next/font/google`（Geist，构建需联网下载字体），正文用系统字体栈，展示字体全走自托管。
- **A5** Task 1：devDependencies 增加 `@types/gray-matter`。
- **B1** Task 2：导航增加移动端汉堡菜单（FR-5.5，响应式可导航）。
- **B2** Task 3/9/11/16/17/18/19：SectionHeading 增加 `as` prop，页面级标题用 h1（验收标准 8 每页唯一 h1）。
- **B3** requirements FR-3.5 提升为 P0/Must（与验收标准 3 对齐）。
- **B4** Task 4：点击粒子由 push 改为 explode 爆裂模式（FR-4.2）。
- **B5** Task 8/11/13：`cover` 字段在文章卡片、文章头部渲染（不再闲置）。
- **B6** Task 12：标题锚点加 `scroll-mt-24`，目录跳转不被固定导航遮挡。
- **B7** Task 21：PageTransition 加 `key={pathname}`，客户端导航重放淡入。
- **B8** Task 2：@font-face 多格式声明（woff2/ttf/otf 任一放入即用，满足 NFR-10/验收标准 9）。
- **C1** Task 16/18：移除重复 `decodeURIComponent`（Next 的 params 已解码，二次解码遇 `%` 会抛 URIError）。
- **C2** 全局约束：Node ≥ 18.18（Next 15 要求），建议 20 LTS。
- **C3** Task 10：`getPostBySlug` 返回 `Post | undefined`（不存在/draft 返回 undefined），页面 `notFound()` 兜底生效。
- **C4** 全局约束：提交 package-lock.json，高频变动插件锁定 major。
- **C5** Task 1：tsconfig exclude 测试文件，避免 `next build` 类型检查测试与 jest-dom matcher。
- **C6** Task 1：脚手架后校验 Tailwind v4，v3 需升级（`@theme inline` 为 v4 语法）。
- **D1** Task 6：粒子组件 `next/dynamic`（`ssr:false`）按需加载，保首页 LCP（NFR-1）。
- **D2** Task 3：ScrollReveal 尊重 `prefers-reduced-motion`。
- **D3** Task 19：搜索索引剥离 Markdown 语法；SearchBox 输入防抖。
- **D4** Task 2/9/11/16/17/18/19/22：`lib/site.ts` 的 `SITE_URL` + `metadataBase` + 各页 `generateMetadata` + sitemap 统一。
- **D5** Task 12：MDX 组件映射补 blockquote/table/hr/img 排版。
- **D6** Task 10：数据层构建期缓存（dev 实时读盘）。
- **D7** 全局约束：文章 slug 用 ASCII；标签/系列可用中文。
- **D8** Task 12：行号 meta 写法按 rehype-pretty-code 实际版本验证。
- **D9** Task 15：Giscus theme 注释预留暗色主题联动。
- **E1/E3/E4** requirements §5.3 首期内容扩充（3 文 2 项目 + 1 草稿）、§5.4 图片目录约定；Task 8/10 数据与测试同步扩充。
- **Spec** 路径修正为同目录 `design.md`。

可行性评审修订（v4，2026-08-25），落地 `feasibility-review.md` 的修改建议（requirements 同步升 v1.2 / design 升 v4）：

- **F1** 全局约束 + Task 2：导航折叠断点 `sm:`（640px）统一为 `md:`（768px），与 PRD FR-5.5 / design §9.5 一致。
- **F2** Task 2/8：阴影色值 token 化——新增 `--shadow-glow`，ProjectCard 不再硬编码 rgba（全局约束「不写死色值」覆盖阴影）。
- **F3** Task 10：`getPostBySlug` 加 slug 白名单校验（防路径穿越，NFR-7）；`wordCount` 与搜索共用新 `lib/plaintext.ts`；`getRelatedPosts` 同系列加权。
- **F4** Task 1：`vitest.setup.ts` 补 IntersectionObserver mock（jsdom 缺失，ScrollReveal 等组件测试依赖）。
- **F5** Task 7：「关于我」时间线数据化（`content/timeline.ts`），落实 NFR-4。
- **F6** Task 11：/blog 补「搜索文章 →」入口（design §4 注明）。
- **F7** Task 14：正文 `max-w-prose` 收窄（NFR-5）。
- **F8** Task 17：归档页补标签云（PRD FR-3.9 对齐）。
- **F9** Task 19：SearchBox 补 `role="search"` / `aria-label` / `type="search"`；注明 dev 下搜索索引刷新方式；脚本内 toPlainText 与 `lib/plaintext.ts` 同步说明。
- **F10** Task 22：sitemap/robots 在 `output: 'export'` 下构建后必须验证，缺失时回退为构建脚本输出 `public/` 静态文件。
- **F11** Task 6：Hero 补英文名副标（展示字体对中文不生效的可见落点）；requirements 验收标准 9 注明中文回退系统字体。
- **F12** Task 2：汉堡按钮补 `aria-controls="mobile-menu"`（配合菜单 `id`）。
