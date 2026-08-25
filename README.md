# 个人作品集 + 博客

Next.js + Motion + tsparticles + MDX 的静态站点。多巴胺低饱和 + 轻亚风格，滚动叙事 / 粒子微交互 / 玻璃拟态卡片，博客含标签、目录、归档、系列、搜索、评论等功能，$0 起步托管。

## 开发

```bash
npm run dev   # http://localhost:3000
```

> ⚠️ **搜索索引**：`predev` 会在启动时生成 `public/search-index.json`（构建产物，不入库）。dev 中新增/修改文章后需**重启 `npm run dev`**（或手动重跑 `node scripts/build-search-index.mjs`）索引才会刷新。
>
> ⚠️ **中文动态路由**：dev 模式下访问 `/tags/中文`、`/series/中文` 可能返回 500（Next.js `output: "export"` 下 dev 对非 ASCII params 的已知行为）；生产构建产物完全正常，以 `npm run build` 产物为准。

## 构建

```bash
npm run build   # 产出 out/（prebuild 会先生成搜索索引、sitemap.xml、robots.txt）
npm test        # Vitest 单测
```

## 部署

- **Vercel**：导入仓库后自动识别 Next.js，直接 Deploy。
- **Cloudflare Pages**：Build command `npm run build`，输出目录 `out`。

部署后把 `lib/site.ts` 的 `SITE_URL` 替换为真实域名（sitemap / OG 元数据共用），重新部署。

## 字体

把展示字体命名为 `public/fonts/display.woff2`（或 `display.ttf` / `display.otf`，任选其一）即可在标题/Hero 使用，无需改代码。`@font-face` 已同时声明三种格式；展示字体主要作用于拉丁字符，中文标题回退系统字体。

## 内容

- 文章：`content/posts/*.mdx`（frontmatter 见 requirements.md §5.1；文件名用 ASCII slug；`draft: true` 不发布）
- 项目：`content/projects.ts`
- 经历时间线：`content/timeline.ts`
- 图片：`public/images/`，以 `/images/...` 引用

## 评论

Giscus 配置见 `components/Comments.tsx`：先在 GitHub 仓库 Settings → General 开启 Discussions，再到 giscus.app 生成 `repoId`/`categoryId` 替换占位值。

## 本机 npm 源（可选）

本机直连 npmjs 不可达时，npm 已配置为 `https://registry.npmmirror.com` 并经本地代理（`127.0.0.1:7897`）访问：

```bash
npm config set registry https://registry.npmmirror.com
npm config set proxy http://127.0.0.1:7897
npm config set https-proxy http://127.0.0.1:7897
```

> `@types/gray-matter` 在 npmmirror 上未同步时，仓库内置了最小类型声明 `types/gray-matter.d.ts`，无需额外安装。
