# 可行性分析与修改建议（评审报告）

> 评审对象：`requirements.md`（v1.1）、`design.md`（v3）、`implementation-plan.md`（v3，23 个 Task）
> 评审日期：2026-08-25 ｜ 结论：**总体可行，建议按计划实施**（风险中低，前置修正见 §5）

---

## 1. 总体结论

- 三份文档体系完整、对齐度很高：需求（PRD）→ 设计 → 可逐 Task 执行的实现计划，且计划本身已沉淀两轮评审修订（v2/v3 共 30+ 条），把大部分已知坑（版本矩阵、create-next-app 交互阻塞、dev server 不退出、静态导出限制等）都提前处理了，可执行性在同类文档中属于上乘。
- 技术选型全部为成熟方案，无不可实现项：Next.js 15 静态导出 + Motion + tsparticles + MDX + Giscus 的组合已被大量静态博客验证过。
- 主要风险集中在三处，均可控：
  1. **依赖版本矩阵**（rehype-pretty-code ↔ shiki、React 19 peer 兼容）——安装期即验证，计划已有对策；
  2. **静态导出边界行为**（sitemap/robots 是否生成、中文动态路由产物）——需构建后实测，本文给出回退方案；
  3. **少量三文档间不一致**与计划代码片段里的细节问题（见 §4/§5）。

---

## 2. 文档一致性核对（发现的不一致）

| # | 位置 | 问题 | 建议 |
|---|---|---|---|
| C1 | PRD FR-5.5 / 设计 §9.5 vs 计划 Task 2 | 规范写 **<768px** 折叠汉堡菜单，计划 Nav 却用 `sm:` 断点（**<640px**） | 统一为 `md:`（`hidden md:flex` / `md:hidden`） |
| C2 | PRD FR-5.2 vs 设计 §9.5 / 计划 Task 2 | PRD 只列「首页/作品/博客」3 项导航，实际实现 5 项（含归档/搜索） | PRD FR-5.2 补充「归档 / 搜索」 |
| C3 | PRD FR-3.9 vs 计划 Task 17 | PRD 写归档「按时间/**标签**聚合」，计划只按年份分组 | 归档页顶部补一个标签云（复用 `getAllTags()`），或把 PRD 措辞改为「按时间聚合 + 标签见独立页」 |
| C4 | 设计 §4 /blog 描述 vs 计划 Task 11 | 设计注明博客列表含「搜索入口」，计划 /blog 页只有标签 chips，无搜索入口 | Task 11 在列表页补一个「搜索文章 →」链接到 `/search` |
| C5 | PRD NFR-4（内容与代码分离） vs 计划 Task 7 | 「关于我」时间线数据硬编码在 `components/about.tsx` 里，改经历要动组件代码 | 抽出为 `content/timeline.ts` 数据文件，组件只做渲染（与项目数据同模式） |
| C6 | 计划 Task 14 Step 9 | 注释说「正文内容用 `max-w-prose` 包裹」，但代码片段里正文容器只有 `min-w-0 flex-1`，未实际收窄 | 正文 div 加 `max-w-prose`（或内部再包一层），落实 NFR-5「正文宽度受限」 |
| C7 | PRD §5.3 vs 计划 Task 10/8 | 首期内容要求均已满足（3 文含 1 草稿、2 项目 1 featured） | ✓ 无需改 |

---

## 3. 技术可行性要点与风险（含外部核实）

### 3.1 依赖版本矩阵（计划已列 P0，补充依据）
- `rehype-pretty-code` 0.14.x ↔ `shiki` ^1.x 是经过验证的稳定组合；shiki v4 的适配仍在 [rehype-pretty-code issue #266](https://github.com/rehype-pretty/rehype-pretty-code/issues/266) 推进中——**勿直接装 latest**，安装时用 `npm view rehype-pretty-code peerDependencies` 核实，计划的策略正确。
- `@tsparticles/react` 4.x 已支持 React 19（[npm 4.0.5](https://socket.dev/npm/package/@tsparticles/react/overview/4.0.5)），与 Next 15 自带 React 19 兼容。
- `@giscus/react`、`@testing-library/react`（≥16）按计划在安装时核实 peer 即可。

### 3.2 静态导出（`output: "export"`）边界行为
- **sitemap/robots**：`app/sitemap.ts` / `app/robots.ts` 在 `output: 'export'` 下**需要构建后实测**（历史上曾有版本不生成，[Next.js robots 文档](https://nextjs.react.com.tw/docs/app/api-reference/file-conventions/metadata/robots) 为动态生成约定）。Task 22 已有验证步骤 ✓；**若未生成，回退方案**：删掉两个文件，改由 `scripts/build-search-index.mjs` 同类的构建脚本直接写 `public/sitemap.xml` / `public/robots.txt` 静态文件。
- `notFound()`：静态导出无服务端，`generateStaticParams` 只生成已发布文章，草稿/不存在的 slug 在产物中根本不存在、由托管平台回 404——`notFound()` 兜底只在 dev 生效，行为正确 ✓（`out/404.html` 由 `not-found.tsx` 生成 ✓）。
- **中文动态路由**（`/tags/入门`、`/series/我的博客`）：`generateStaticParams` + `encodeURIComponent` 链接一致 ✓；产物目录含中文，部署到 Vercel/CF 后需实测一次访问。计划已有 dev 验证步骤，建议 Task 23 部署后补一条「访问中文标签页」的验收。
- `images.unoptimized: true` + 原生 `<img>`：正确做法 ✓。

### 3.3 计划代码片段里已规避的坑（确认无问题）
- TOC 锚点 id：`extractHeadings` 与 `rehype-slug` 共用 `github-slugger`，且其对中文**原样保留**，id 一致 ✓；「标题保持纯文本」的约定与测试用例合理 ✓。
- 粒子 `explode` 模式不在 slim 包的退路（push/repulse 或 full 包）✓。
- 移动端菜单 Esc 关闭、`aria-expanded`、`prefers-reduced-motion` 降级均已覆盖 ✓。
- Task 16/18 移除重复 `decodeURIComponent`（Next 15 params 已解码）✓，这是常见 bug，计划已避免。
- `@theme inline` 字体映射（`--font-display: var(--font-display)`）为 Tailwind v4 合法模式，`font-display` 工具类可用 ✓。

---

## 4. 计划代码片段中的问题清单（按严重程度排序）

| # | 位置 | 问题 | 修改建议 |
|---|---|---|---|
| P1 | 计划 Task 2 Step 3（Nav） | 断点 `sm:`（640px）与规范 768px 不符 | 全部改为 `md:` |
| P2 | 计划 Task 8 Step 6（ProjectCard） | `hover:shadow-[0_12px_32px_-12px_rgba(217,165,199,0.5)]` **硬编码色值**，违反全局约束「颜色一律用 token」 | 在 `:root` 加 `--shadow-glow` token，卡片引用 `hover:shadow-glow` |
| P3 | 计划 Task 13/14（文章页） | 正文未实际收窄到 `max-w-prose`（见 C6） | 正文容器补 `max-w-prose` |
| P4 | 计划 Task 10（`getPostBySlug`） | `path.join(postsDir, slug + ".mdx")` 无校验，dev 下 `..%2f..%2f` 可越权读任意 .mdx 文件（NFR-7 安全面） | slug 加白名单校验：`if (!/^[a-z0-9-]+$/i.test(slug)) return undefined;` |
| P5 | 计划 Task 3/14（组件测试） | jsdom **没有 IntersectionObserver**，`ScrollReveal`（whileInView）等组件测试可能报错 | `vitest.setup.ts` 加 IntersectionObserver 简易 mock |
| P6 | 计划 Task 10/19 | `wordCount()` 的 Markdown 剥离与搜索索引 `toPlainText()` 逻辑重复且不一致 | 抽公共 `lib/plaintext.ts`，两处复用 |
| P7 | 计划 Task 19 | dev 模式下 `predev` 只跑一次，新增/修改文章后搜索索引不更新（要重启 dev 才刷新） | README 注明「dev 中新增文章后需重启 `npm run dev`」；或脚本支持 `--watch` |
| P8 | 计划 Task 19（SearchBox） | 输入框无 `aria-label` / `role="search"`，可访问性小缺陷 | 补 `aria-label="搜索文章"`，外层 `<form role="search">` |
| P9 | 计划 Task 2（Nav） | 汉堡按钮缺 `aria-controls`（已有 `aria-expanded`） | 补 `aria-controls="mobile-menu"` 并给菜单 `id` |
| P10 | 计划 Task 2/6 与验收标准 9 | 自托管展示字体多为**拉丁字体**，Hero 中文姓名/中文标题不会命中 Display 字体（回退系统中文字体），「无代码使用展示字体」对中文不生效 | 验收标准 9 注明「拉丁字符生效、中文回退系统字体」；Hero 姓名旁加英文/拼音副标，让展示字体有可见落点 |
| P11 | 计划 Task 14（TOC） | 目录只在 `lg` 屏显示，移动端无目录入口 | 可接受（P2），或移动端加可折叠「目录」按钮 |
| P12 | 计划 Task 10（`getRelatedPosts`） | 仅按共享标签数排序，同系列文章不优先 | 排序时同 `series` 加权（P2 优化） |

---

## 5. 修改建议优先级汇总

### 必须改（影响验收或安全，实施前/中处理）
1. 断点统一 `md:`（C1/P1）——直接关系验收标准 5。
2. sitemap/robots 静态导出验证 + 静态文件回退方案（§3.2）——关系验收标准 8。
3. `getPostBySlug` slug 白名单校验（P4）——NFR-7 安全。
4. 正文 `max-w-prose` 收窄（C6/P3）——NFR-5 可读性验收。
5. ProjectCard 硬编码色值改 token（P2）——计划自己的全局约束。
6. PRD 措辞对齐：FR-5.2 补导航项、FR-3.9 归档范围（C2/C3）。

### 建议改（维护性与体验，低成本的确定性收益）
7. 时间线数据化 `content/timeline.ts`（C5）——NFR-4。
8. /blog 补搜索入口（C4）。
9. `vitest.setup.ts` 加 IntersectionObserver mock（P5）。
10. `wordCount` 与 `toPlainText` 复用公共函数（P6）。
11. 搜索索引 dev 刷新说明（P7）。
12. 归档页补标签云（C3）或同步改 PRD 措辞。

### 可选改（打磨）
13. SearchBox/Nav 的 aria 补全（P8/P9）。
14. Hero 英文副标 + 验收标准 9 注明中文回退（P10）。
15. 移动端 TOC 折叠、相关文章同系列优先（P11/P12）。

---

## 6. 工作量与风险评级

- **工作量**：按计划的 23 个 Task 顺序执行（含 TDD 步骤与每 Task 一次 commit），单人预估 **3~5 个工作日**；大部分时间是依赖安装/构建验证与动效调试，纯编码量不大。
- **风险评级：中低**。Top 3 风险与对冲：
  1. 依赖版本组合 → Task 1 安装期即验证，冲突按版本矩阵降级（P0 已覆盖）；
  2. 中文路由/静态导出产物 → Task 16/18 与 Task 23 部署后各实测一次；
  3. 首页 LCP → 粒子已 `next/dynamic` 懒载 + 渐变兜底 + Task 23 Lighthouse 验证，超标有降参预案（40→25、关 links）。

---

## 7. 结论

**可行，建议照此实施。** 三文档无架构级问题，需求、设计、计划三方对齐良好；只需在实施前把 §5「必须改」的 6 项落入计划（多为 1~2 行的改动），并在 Task 1（依赖核实）、Task 22（sitemap/robots 实测）、Task 23（部署后中文路由 + Lighthouse 实测）三个节点做计划中已安排的验证，即可按计划推进。
