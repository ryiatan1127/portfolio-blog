import { describe, it, expect } from "vitest";
import { getAllProjects, getFeaturedProjects } from "./projects";

describe("projects", () => {
  it("返回所有项目", () => { expect(getAllProjects().length).toBeGreaterThan(0); });
  it("只返回 featured 项目", () => { expect(getFeaturedProjects().every((p) => p.featured)).toBe(true); });
});
