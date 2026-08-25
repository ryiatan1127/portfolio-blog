import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { ScrollReveal } from "./ScrollReveal";

describe("ScrollReveal", () => {
  it("渲染子内容", () => {
    render(<ScrollReveal>内容</ScrollReveal>);
    expect(screen.getByText("内容")).toBeInTheDocument();
  });
});
