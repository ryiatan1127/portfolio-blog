# 博客文章目录

一篇文章一个 `.mdx` 文件，文件名即 URL slug（如 `hello-world.mdx` → `/blog/hello-world`）。

## 中英两文件约定（正文口子）

| 用途 | 文件名 |
|---|---|
| 中文正文 | `<slug>.mdx`（现状，保持不动） |
| 英文正文 | `<slug>.en.mdx`（有就放，切到 EN 时生效） |

正文已接线（无需再改代码）：放好 `<slug>.en.mdx` 后，切换语言到 EN 时，文章页会显示英文版（标题 / 描述 / 目录 / 正文 / 阅读时长 / 字数都随语言切换）；无英文版时回退中文。

实现要点：
- `lib/posts.ts` 的 `getPostBySlug(slug, lang)` 按语言读 `<slug>.mdx` 或 `<slug>.en.mdx`；`readPosts()` 与 `scripts/build-search-index.mjs` 均排除 `.en.mdx`（英文版不参与列表 / 搜索索引 / 站点地图）。
- `app/blog/[slug]/page.tsx` 服务端同时渲染中英两版正文，交给客户端组件 `components/ArticleLocalized.tsx` 按当前语言切换。
