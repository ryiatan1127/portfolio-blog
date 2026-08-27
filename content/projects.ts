// 项目数据统一入口：类型 + 中英两个版本（两个文件切换，见 LanguageProvider 的 useProjects）
export type { Project } from "./projects.types";
export { projects as projectsZh } from "./projects.zh";
export { projects as projectsEn } from "./projects.en";
