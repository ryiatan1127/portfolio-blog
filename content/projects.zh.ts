import type { Project } from "./projects.types";

// 项目数据（中文版）：更新项目无需改组件代码（NFR-4）；无截图项目由卡片渐变占位
export const projects: Project[] = [
  {
    slug: "example-project",
    title: "示例项目",
    description: "一句话描述这个项目解决了什么问题、用了什么技术。",
    tags: ["Next.js", "TypeScript"],
    links: { demo: "https://example.com", repo: "https://github.com/ryiatan1127/repo" },
    featured: true,
  },
  {
    slug: "example-project-2",
    title: "示例项目 2",
    description: "第二个示例项目：验证非精选项目只出现在列表页、首页精选不展示。",
    tags: ["Motion", "MDX"],
    links: { repo: "https://github.com/ryiatan1127/repo-2" },
    featured: false,
  },
];
