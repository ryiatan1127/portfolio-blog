"use client";

import Giscus from "@giscus/react";

// ⚙️ Giscus 评论配置步骤（完成后把 repo/repoId/category/categoryId 四个值替换为生成值）：
// 1. 把代码推到 GitHub 公开仓库（评论需要公开仓库 + 开启 Discussions）
// 2. 仓库 Settings → General → Features 勾选 Discussions
// 3. 打开 https://giscus.app
//    - 在 "Repository" 输入你的仓库名（如 yourname/portfolio-blog），点 Search → 生成 repoId
//    - 在 "Discussion Category" 选一个分类（如 Announcements）→ 生成 categoryId
// 4. 把下面四个值替换为 giscus.app 生成的值，重新 build 部署即可
// 5. 可选：giscus.app 页面下方还有主题、语言等选项，可调整后与本组件对齐
const GISCUS_REPO = "YOUR_NAME/portfolio-blog";
const GISCUS_REPO_ID = "R_kgDOXXXXXX";
const GISCUS_CATEGORY = "Announcements";
const GISCUS_CATEGORY_ID = "DIC_kwDOXXXXXX";

// 仍是占位值时（未配置），渲染提示而非失效的 iframe
const isConfigured =
  GISCUS_REPO !== "YOUR_NAME/portfolio-blog" &&
  GISCUS_REPO_ID !== "R_kgDOXXXXXX" &&
  GISCUS_CATEGORY_ID !== "DIC_kwDOXXXXXX";

export function Comments() {
  if (!isConfigured) {
    return (
      <section className="mt-12">
        <p className="rounded-lg border border-dashed border-border p-4 text-sm text-text-muted">
          评论功能待配置：打开 <code className="font-mono">components/Comments.tsx</code>，按文件顶部注释完成
          Giscus 配置（需 GitHub 仓库开启 Discussions）。
        </p>
      </section>
    );
  }
  return (
    <section className="mt-12">
      <Giscus
        repo={GISCUS_REPO}
        repoId={GISCUS_REPO_ID}
        category={GISCUS_CATEGORY}
        categoryId={GISCUS_CATEGORY_ID}
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
