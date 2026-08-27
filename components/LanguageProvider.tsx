"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import type { ReactNode } from "react";
import { messages, type Locale } from "@/lib/i18n";
import { projectsZh, projectsEn, type Project } from "@/content/projects";
import { timelineZh, timelineEn, type TimelineItem } from "@/content/timeline";

type LanguageContextValue = { lang: Locale; setLang: (next: Locale) => void };

const LanguageContext = createContext<LanguageContextValue | null>(null);
const STORAGE_KEY = "lang";

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Locale>("zh");

  // 挂载后读取上次选择（localStorage），避免 SSR/客户端首帧不一致
  useEffect(() => {
    const saved = window.localStorage.getItem(STORAGE_KEY);
    if (saved === "zh" || saved === "en") setLangState(saved);
  }, []);

  const setLang = useCallback((next: Locale) => {
    setLangState(next);
    try { window.localStorage.setItem(STORAGE_KEY, next); } catch { /* 隐私模式下忽略 */ }
  }, []);

  // 同步 <html lang>，供无障碍与浏览器翻译使用
  useEffect(() => {
    document.documentElement.lang = lang === "en" ? "en" : "zh-CN";
  }, [lang]);

  const value = useMemo(() => ({ lang, setLang }), [lang, setLang]);
  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
}

export function useLanguage(): LanguageContextValue {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error("useLanguage 必须在 LanguageProvider 内使用");
  return ctx;
}

/** 当前语言的界面文案 */
export function useT() {
  return messages[useLanguage().lang];
}

/** 项目数据：按当前语言选中文/英文文件 */
export function useProjects(): Project[] {
  const { lang } = useLanguage();
  return lang === "en" ? projectsEn : projectsZh;
}

/** 「关于我」时间线：按当前语言选中文/英文文件 */
export function useTimeline(): TimelineItem[] {
  const { lang } = useLanguage();
  return lang === "en" ? timelineEn : timelineZh;
}
