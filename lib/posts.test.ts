import { describe, it, expect } from "vitest";
import { getAllPosts, getPostBySlug, getAllTags, getPostsByTag, getAllSeries, getPostsBySeries, getRelatedPosts, getPrevNextPost, readingTime } from "./posts";

describe("posts", () => {
  it("返回按日期倒序的文章列表（不含草稿）", () => {
    const posts = getAllPosts();
    expect(posts.length).toBeGreaterThan(0);
    expect(posts[0].slug).toBe("hello-world");
    expect(posts[0].title).toBe("你好，世界");
    expect(posts.some((p) => p.slug === "draft-post")).toBe(false);
  });

  it("按 slug 取单篇并返回正文", () => {
    const post = getPostBySlug("hello-world");
    expect(post?.slug).toBe("hello-world");
    expect(post?.content).toContain("这是正文");
  });

  it("不存在或草稿返回 undefined", () => {
    expect(getPostBySlug("no-such-post")).toBeUndefined();
    expect(getPostBySlug("draft-post")).toBeUndefined();
    expect(getPostBySlug("../hello-world")).toBeUndefined(); // slug 白名单：防路径穿越（NFR-7）
  });

  it("返回标签及数量（按数量倒序）", () => {
    expect(getAllTags()).toEqual([
      { tag: "入门", count: 2 },
      { tag: "生活", count: 1 },
      { tag: "动效", count: 1 },
    ]);
    expect(getPostsByTag("动效").length).toBe(1);
  });

  it("返回系列", () => {
    expect(getAllSeries()).toEqual(["我的博客"]);
    expect(getPostsBySeries("我的博客").length).toBe(2);
  });

  it("相关文章按共享标签排序，前后篇按序返回", () => {
    const related = getRelatedPosts("hello-world");
    expect(related[0]?.slug).toBe("second-post"); // 与 hello-world 共享「入门」标签
    const { newer, older } = getPrevNextPost("hello-world");
    expect(newer).toBeUndefined();
    expect(older?.slug).toBe("second-post");
  });

  it("阅读时长至少 1 分钟", () => {
    expect(readingTime("# 标题\n\n一些正文内容")).toBeGreaterThanOrEqual(1);
  });
});
