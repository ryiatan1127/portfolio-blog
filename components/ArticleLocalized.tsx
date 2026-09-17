"use client";

import type { ReactNode } from "react";
import { useLanguage } from "./LanguageProvider";
import { PostMetaLine } from "./PostMetaLine";
import { TableOfContents } from "./TableOfContents";
import { ScrollReveal } from "./ScrollReveal";
import type { Heading } from "@/lib/headings";

type LangData = {
  title: string;
  description: string;
  date: string;
  readingTime: number;
  wordCount: number;
  headings: Heading[];
  body: ReactNode; // 服务端已编译好的正文（含代码高亮等）
};

/** 文章内容按语言切换：标题/描述/meta/目录/正文，服务端渲染好两版后由客户端选一 */
export function ArticleLocalized({ zh, en, cover }: { zh: LangData; en?: LangData; cover?: string }) {
  const { lang } = useLanguage();
  const v = lang === "en" && en ? en : zh;
  return (
    <>
      <ScrollReveal>
        <PostMetaLine date={v.date} readingTime={v.readingTime} wordCount={v.wordCount} />
        <h1 className="font-display mt-3 text-4xl font-bold tracking-tight">{v.title}</h1>
        <p className="mt-4 text-text-muted">{v.description}</p>
      </ScrollReveal>
      {cover && (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={cover} alt={v.title} className="mt-8 h-64 w-full rounded-lg object-cover" />
      )}
      <div className="mt-10 flex gap-8">
        <div className="min-w-0 max-w-prose flex-1">{v.body}</div>
        <aside className="hidden w-56 shrink-0 lg:block">
          <div className="sticky top-24"><TableOfContents headings={v.headings} /></div>
        </aside>
      </div>
    </>
  );
}
