import { describe, it, expect } from "vitest";
import { extractHeadings } from "./headings";

describe("extractHeadings", () => {
  it("提取 h2/h3 并生成 id", () => {
    const hs = extractHeadings("## 二级标题\n### 三级标题");
    expect(hs).toEqual([
      { level: 2, text: "二级标题", id: "二级标题" },
      { level: 3, text: "三级标题", id: "三级标题" },
    ]);
  });
  it("忽略代码块内的井号", () => {
    const hs = extractHeadings("```js\n# 不是标题\n```\n## 真的标题");
    expect(hs).toEqual([{ level: 2, text: "真的标题", id: "真的标题" }]);
  });
  it("约定：标题保持纯文本（含链接的标题 id 与 rehype-slug 不一致）", () => {
    const hs = extractHeadings("## 参考 [MDN](https://mdn.dev)");
    // raw markdown 经 github-slugger 与 rehype-slug（纯文本）结果不同 → 首期约定标题不含链接/行内代码
    expect(hs[0].id).not.toBe("参考-mdn");
  });
});
