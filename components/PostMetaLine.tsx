"use client";

import { useT } from "./LanguageProvider";

/** 文章 meta 行：日期 + 阅读时长 + 字数，单位随语言切换 */
export function PostMetaLine({ date, readingTime, wordCount }: { date: string; readingTime: number; wordCount: number }) {
  const t = useT();
  return (
    <p className="font-mono text-sm text-text-muted">
      {date} · {t.postMeta.approx}{readingTime} {t.postMeta.minutes} · {wordCount} {t.postMeta.words}
    </p>
  );
}
