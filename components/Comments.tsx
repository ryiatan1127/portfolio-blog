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
