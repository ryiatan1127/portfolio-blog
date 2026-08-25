# 个人作品集 + 博客网站 — 设计文档

> 日期：2026-08-25（v4，可行性评审修订，与需求文档 v1.2 对齐）
> 状态：已评审

## 1. 目标

构建一个**可上线**的个人作品集/品牌站 + 博客。React/Next 技术栈，具备**滚动叙事、粒子/微交互**动效；博客功能丰富（标签/目录/归档/系列/搜索等）；视觉为**多巴胺低饱和 + 轻亚 + 可爱装饰元素**。核心约束**最经济**：托管 $0 起步，唯一可选支出是域名（~¥70/年）。

## 2. 架构

- **Next.js 15（App Router）+ TypeScript**，`output: 'export'` 静态导出，部署到任意静态托管（Vercel / Cloudflare Pages），零服务器、零月费。
- **单一仓库**，作品集与博客共用一套框架、设计系统与动效组件。
- **动效统一由 Motion 承担**，粒子由 tsparticles 承担。
- **博客由 MDX + gray-matter 驱动**，静态生成所有文章页；**构建时生成搜索索引 JSON**，前端做客户端搜索（无后端）。
- **无后端、无数据库、无评论系统**（评论 Giscus 已按用户决定移除，2026-08-25）。

## 3. 技术栈

| 层 | 选型 | 版本 | 说明 |
|---|---|---|---|
| 框架 | Next.js（App Router）+ TypeScript | 15.x | 静态导出 |
| 样式 | Tailwind CSS | v4 | 配合 CSS 变量做主题 token |
| 动效 | Motion（`motion/react`） | 最新 | 滚动叙事 / 微交互 / 转场 |
| 粒子 | `@tsparticles/react` + `@tsparticles/slim` | 最新 | slim 版控制体积 |
| 博客 | `gray-matter` + `next-mdx-remote-client` | 最新 | frontmatter 解析 + MDX 渲染 |
| 代码高亮 | `rehype-pretty-code` + `shiki` | 最新 | 行号 + 语言标注 + 主题 |
| 标题锚点 | `rehype-slug` + `github-slugger` | 最新 | 为 TOC 生成稳定 id |
| 字体 | 自托管 `@font-face` 多格式声明（`public/fonts/`）+ 系统字体回退 | — | 展示字花哨、正文可读 |
| 类型 | `@types/gray-matter` | — | gray-matter 无内置类型，缺失会致 TS 构建失败 |
| 测试 | Vitest + @testing-library/react + jsdom | 最新 | 数据层单测 + 组件冒烟 |
| 部署 | Vercel 或 Cloudflare Pages | — | $0 |

> 依赖版本统一以 `package-lock.json` 锁定（提交锁文件）；`rehype-pretty-code` 等 API 高频变动的插件锁定 major，升级需回归验证。

## 4. 站点结构与路由

| 路由 | 内容 |
|---|---|
| `/` | Hero（头像/emoji + slogan + 粒子 + 装饰）+ 关于我 + 精选作品 + 精选文章 + 页脚 |
| `/projects` | 完整作品集（玻璃卡片） |
| `/blog` | 文章列表（可按标签筛选 + 搜索入口） |
| `/blog/[slug]` | 文章页（MDX + 代码高亮 + TOC + 阅读进度 + 上一篇/下一篇 + 相关推荐 + 分享） |
| `/tags/[tag]` | 标签页：该标签下所有文章 |
| `/archive` | 归档页：按年份聚合全部文章 |
| `/series/[name]` | 系列页：同一系列文章 |
| `/search` | 站内搜索页 |

## 5. 目录结构

```
portfolio-blog/
├── app/
│   ├── layout.tsx            # 根布局：字体、导航、页脚、转场
│   ├── page.tsx              # 首页
│   ├── globals.css           # Tailwind + 主题 token + @font-face
│   ├── projects/page.tsx
│   ├── blog/page.tsx
│   ├── blog/[slug]/page.tsx
│   ├── tags/[tag]/page.tsx
│   ├── archive/page.tsx
│   ├── series/[name]/page.tsx
│   ├── search/page.tsx
│   └── sitemap.ts
├── components/
│   ├── nav.tsx               # 导航（滚动变色）
│   ├── footer.tsx
│   ├── PageTransition.tsx
│   ├── ParticleBackground.tsx
│   ├── ScrollReveal.tsx
│   ├── SectionHeading.tsx
│   ├── ProjectCard.tsx       # 玻璃拟态卡片
│   ├── BlogCard.tsx
│   ├── ReadingProgress.tsx
│   ├── TableOfContents.tsx   # 文章目录
│   ├── PostNav.tsx           # 上一篇/下一篇
│   ├── RelatedPosts.tsx
│   ├── ShareButtons.tsx
│   ├── SearchBox.tsx         # 客户端搜索
│   └── decorations/
│       ├── Wing.tsx / MusicNote.tsx / Star.tsx / Heart.tsx / Bubble.tsx
├── lib/
│   ├── projects.ts
│   ├── posts.ts              # 文章数据层（含标签/系列/相关/前后篇/阅读时长）
│   ├── mdx.tsx               # MDXRemote + 代码高亮
│   ├── headings.ts           # 提取标题生成 TOC
│   ├── plaintext.ts          # Markdown→纯文本（wordCount 与搜索共用）
│   └── search.ts             # 搜索索引生成（Node 侧）
├── scripts/
│   └── build-search-index.mjs # prebuild 生成 public/search-index.json
├── content/
│   ├── projects.ts
│   ├── timeline.ts        # 「关于我」经历数据（NFR-4 内容与代码分离）
│   └── posts/*.mdx
├── public/
│   ├── fonts/                # 用户上传自定义字体
│   └── search-index.json     # 构建产物
└── 配置文件（next.config.ts / tsconfig / package.json / vitest.config.ts）
```

## 6. 模块职责

- **`lib/posts.ts`**：读取 `content/posts/*.mdx`，解析 frontmatter；导出 `getAllPosts()`、`getPostBySlug(slug)`、`getAllTags()`、`getPostsByTag(tag)`、`getAllSeries()`、`getPostsBySeries(name)`、`getRelatedPosts(slug, n)`、`getPrevNextPost(slug)`、`readingTime(content)`。纯逻辑，可单测。`getPostBySlug` 对不存在或 `draft` 文章返回 `undefined`（页面侧 `notFound()`）；构建期缓存读取结果（dev 下实时读盘）。
- **`lib/mdx.tsx`**：封装 `MDXRemote`，注入 rehype 插件（`rehype-pretty-code` 高亮、`rehype-slug` 锚点）与自定义组件（标题、代码、链接、图片），统一正文排版。
- **`lib/headings.ts`**：从 markdown 文本提取 `##`/`###` 标题，用 `github-slugger` 生成与 `rehype-slug` 一致的 id，供 TOC 使用。
- **`lib/plaintext.ts`**：剥离 Markdown 语法的纯文本工具，`wordCount`（阅读字数）与搜索索引共用同一逻辑。
- **`lib/search.ts` + `scripts/build-search-index.mjs`**：构建时把全部文章（标题/摘要/标签/正文纯文本，剥离 Markdown 语法）写为 `public/search-index.json`，前端 `SearchBox` 客户端过滤（输入防抖）。
- **`components/decorations/*`**：纯 SVG 可爱元素（翅膀、音符、星星、爱心、泡泡），作为点缀复用。

## 7. 动效设计

### 7.1 滚动叙事
- Motion 的 `whileInView`：区块滚入视口淡入 + 位移（`opacity 0→1`、`y 24→0`），带 `delay` 错落。
- 视差：Hero 背景随滚动轻微位移。
- 页面转场：`PageTransition` 以 `key={pathname}` 重挂载，确保客户端导航时淡入重放（静态导出下 layout 常驻，仅 initial 动画不会重放）。
- 可访问性：动效尊重 `prefers-reduced-motion`（`useReducedMotion` 降级为纯淡入/无位移），不强制用户观看动画。

### 7.2 粒子 / 微交互
- Hero 背景 tsparticles 粒子漂浮，鼠标悬停连线（grab）、点击爆裂（explode 模式）。
- 粒子组件经 `next/dynamic`（`ssr: false`）按需加载，避免拖慢首页 LCP（NFR-1）。
- 微交互：导航滚动变色、玻璃卡片 hover 抬升/发光、页面转场淡入。

### 7.3 博客炫酷（保持阅读舒适）
- 炫酷落在：列表卡片动效、文章页头部、阅读进度条、段落滚动淡入、TOC 高亮当前小节。
- 正文排版舒适：`max-w-prose`、行高 1.6、代码高亮、标题锚点，动效只用轻量淡入。
- 标题锚点加 `scroll-mt-24`，目录跳转不被固定导航遮挡。

### 7.4 装饰元素
- `decorations/` 的 SVG 元素点缀在 Hero、区块标题、页脚等位置，`whileInView` 轻微浮动/旋转，营造轻亚氛围，不遮挡内容。

## 8. 内容模型

### 8.1 博客 frontmatter（`content/posts/*.mdx`）

```yaml
title: string        # 标题
date: string         # YYYY-MM-DD
description: string  # 摘要（列表页 + SEO）
tags: string[]       # 标签
series?: string      # 可选，系列名
cover?: string       # 可选封面图
draft?: boolean      # true 时不发布
```

### 8.2 项目数据（`content/projects.ts`）

```ts
type Project = {
  slug: string; title: string; description: string; tags: string[];
  image?: string;              // 截图可选；无则渐变色块 + 首字母/emoji 占位
  links: { demo?: string; repo?: string };
  featured: boolean;
}
```
> `cover` 存在时在文章列表卡片与文章头部渲染封面图（字段不闲置）。

### 8.3 时间线数据（`content/timeline.ts`）

```ts
type TimelineItem = { year: string; text: string };
export const timeline: TimelineItem[] = [/* 经历条目 */];
```

> 「关于我」经历与组件分离（NFR-4），更新经历无需改组件代码。

### 8.4 图片资源约定

- 图片统一放 `public/images/`，frontmatter `cover`、正文、项目数据均用 `/images/...` 根路径引用。
- 不引用站外图片 URL；无截图项目沿用「渐变色块 + 首字母/emoji」占位。

## 9. 设计系统

### 9.1 配色（多巴胺低饱和，mockup 阶段定稿）

- 基调为**奶油底 + 低饱和彩色点缀**，符合「多巴胺但低饱和 + 轻亚」。
- 起始 token（占位，最终值在 mockup 确认）：

```css
:root {
  --bg: #faf6f2;              /* 奶油底 */
  --bg-elevated: rgba(255,255,255,0.55); /* 玻璃卡片 */
  --text: #3d3a45;            /* 深灰紫，柔和 */
  --text-muted: #8b8794;
  --accent: #d9a5c7;          /* 低饱和粉 */
  --accent-2: #a5c8d9;        /* 低饱和蓝 */
  --accent-3: #c7d9a5;        /* 低饱和绿 */
  --accent-4: #e0c9a5;        /* 低饱和奶油黄 */
  --border: rgba(61,58,69,0.12);
}
```

- 用 Tailwind v4 `@theme inline` 映射为 `--color-*`，组件只引用 token，不写死色值。

### 9.2 字体（花哨展示 + 自托管）

- **展示字体（Hero/标题）**：花哨、装饰性强，由用户上传到 `public/fonts/`；`@font-face` 同时声明 `display.woff2` / `display.ttf` / `display.otf` 三种格式，任一放入即用、无需改代码；预留 `--font-display` 变量。
- **正文字体**：系统 CJK（`PingFang SC` / `Microsoft YaHei`）+ 拉丁回退，保证可读性与加载速度。

### 9.3 玻璃拟态卡片

- 圆角**偏小**（`rounded-lg` ~8px）；半透明背景（`--bg-elevated`）+ `backdrop-blur` + 细边框（`--border`）+ 柔和阴影。
- 适用于：项目卡片、文章卡片、导航栏滚动态。

### 9.4 装饰元素与 Hero

- Hero：头像/emoji + 姓名 + 一句话 slogan，粒子背景 + 翅膀/音符/星星点缀。
- 装饰 SVG 统一线框/低饱和填色，与整体轻亚风格一致。

### 9.5 导航（含移动端）

- 桌面端（≥`768px`）：顶部横向链接（首页/作品/博客/归档/搜索），滚动后玻璃拟态背景。
- 移动端（<`768px`）：汉堡按钮展开下拉面板（玻璃拟态），可访问全部导航项（FR-5.5）。

## 10. 部署与成本

- 静态导出 → Vercel（Next 原生、免费）或 Cloudflare Pages（$0）。
- 域名可选 ~¥70/年；不买则用免费子域名。
- **总成本 $0 起步。**

### 10.1 SEO 与站点元数据

- 全局 `metadataBase`（`lib/site.ts` 的 `SITE_URL` 常量，域名定稿后替换）。
- 每页 `title`/`description`：列表页、标签页、系列页、归档页、搜索页也通过 `generateMetadata` 提供。
- `sitemap.xml` 覆盖全部路由（含文章/标签/系列动态路由）；文章页补 `openGraph`。
- ⚠️ `app/sitemap.ts` / `app/robots.ts` 在 `output: 'export'` 下是否生成产物随 Next 版本而异：构建后须验证 `out/sitemap.xml` / `out/robots.txt`；若缺失，回退为构建脚本直接输出 `public/sitemap.xml` / `public/robots.txt` 静态文件。

## 11. 非目标（YAGNI）

- ❌ 后端 / 数据库 / 用户系统 / CMS。
- ❌ 评论（Giscus 已移除，2026-08-25 用户决定）。
- ❌ 3D / WebGL（后续升级方向）。
- ❌ 游戏化彩蛋（用户明确暂不做）。
- ❌ 多语言、PWA、RSS（按需后续加）。
