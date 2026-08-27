import type { Project } from "./projects.types";

// 项目数据（英文版）：与中文版同 slug 一一对应，新增项目时两份同步维护
export const projects: Project[] = [
  {
    slug: "example-project",
    title: "Example Project",
    description: "One line describing what problem this project solves and the tech behind it.",
    tags: ["Next.js", "TypeScript"],
    links: { demo: "https://example.com", repo: "https://github.com/ryiatan1127/repo" },
    featured: true,
  },
  {
    slug: "example-project-2",
    title: "Example Project 2",
    description: "A second example project: verifies that non-featured projects only appear on the list page, not the homepage.",
    tags: ["Motion", "MDX"],
    links: { repo: "https://github.com/ryiatan1127/repo-2" },
    featured: false,
  },
];
