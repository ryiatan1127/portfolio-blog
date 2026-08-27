# 博客文章目录

一篇文章一个 `.mdx` 文件，文件名即 URL slug（如 `hello-world.mdx` → `/blog/hello-world`）。

## 中英两文件约定（正文口子）

| 用途 | 文件名 |
|---|---|
| 中文正文 | `<slug>.mdx`（现状，保持不动） |
| 英文正文 | `<slug>.en.mdx`（以后放） |

放好英文文件后，还需接线 `lib/posts.ts`（`readPosts` / `getPostBySlug`）与 `scripts/build-search-index.mjs`，按语言选择 `.en.mdx` —— 本次尚未接线，英文文件暂不生效。
