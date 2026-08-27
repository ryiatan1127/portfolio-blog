import { projectsZh, projectsEn, type Project } from "@/content/projects";
import type { Locale } from "@/lib/i18n";

// 按语言取项目数据（客户端界面走 LanguageProvider 的 useProjects）
export function getAllProjects(lang: Locale = "zh"): Project[] { return lang === "en" ? projectsEn : projectsZh; }
export function getFeaturedProjects(lang: Locale = "zh"): Project[] { return getAllProjects(lang).filter((p) => p.featured); }
