"use client";

import { useLanguage } from "./LanguageProvider";

/** 菜单栏中英文切换按钮（当前语言高亮） */
export function LanguageToggle() {
  const { lang, setLang } = useLanguage();
  return (
    <button
      type="button"
      onClick={() => setLang(lang === "zh" ? "en" : "zh")}
      aria-label={lang === "zh" ? "Switch to English" : "切换到中文"}
      className="px-2 py-1 text-xs text-text-muted transition-colors hover:text-text"
    >
      <span className={lang === "zh" ? "font-semibold text-text" : ""}>中</span>
      <span className="mx-1 opacity-50">/</span>
      <span className={lang === "en" ? "font-semibold text-text" : ""}>EN</span>
    </button>
  );
}
