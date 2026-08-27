// 界面文案字典（中/英）：所有界面字集中于此，正文内容走 content/*.zh|en 两文件
export type Locale = "zh" | "en";

const zh = {
  nav: {
    home: "首页",
    projects: "作品",
    blog: "博客",
    archive: "归档",
    search: "搜索",
    openMenu: "打开菜单",
    closeMenu: "关闭菜单",
  },
  hero: {
    eyebrow: "你好呀，我的名字是",
    slogan: "一个想要做出可以改变世界的作品的在校大学生女孩",
  },
  about: { eyebrow: "关于我", title: "我的经历" },
  featured: {
    eyebrow: "精选",
    title: "代表作品",
    viewAll: "查看全部作品 →",
    writingEyebrow: "写作",
    writingTitle: "最新文章",
    viewAllPosts: "查看全部文章 →",
  },
  projectCard: { demo: "演示", source: "源码" },
  search: {
    label: "搜索文章",
    placeholder: "搜索文章标题、标签、正文…",
    empty: "没有匹配的结果",
    link: "搜索文章 →",
  },
  related: { title: "相关文章" },
  share: { share: "分享", copy: "复制链接", copied: "已复制链接" },
  toc: { title: "目录" },
  codeBlock: { copy: "复制", copied: "已复制" },
  postMeta: { approx: "约 ", minutes: "分钟", words: "字" },
  pages: {
    projects: { eyebrow: "作品集", title: "我做过的东西" },
    blog: { eyebrow: "博客", title: "我写的东西" },
    archive: { eyebrow: "归档", title: "全部文章" },
    search: { eyebrow: "搜索", title: "找文章" },
    tags: { eyebrow: "标签" },
    series: { eyebrow: "系列" },
    notFound: {
      title: "页面走丢了",
      body: "你访问的页面不存在，回首页看看吧。",
      back: "回到首页 →",
    },
  },
} as const;

// 由中文结构推出文案形状（叶子一律 string），英文版必须一一对应（漏键会报类型错误）
type DeepStrings<T> = { [K in keyof T]: T[K] extends string ? string : DeepStrings<T[K]> };
type MessagesShape = DeepStrings<typeof zh>;

const en: MessagesShape = {
  nav: {
    home: "Home",
    projects: "Projects",
    blog: "Blog",
    archive: "Archive",
    search: "Search",
    openMenu: "Open menu",
    closeMenu: "Close menu",
  },
  hero: {
    eyebrow: "Hi there, my name is",
    slogan: "A college girl who wants to build things that can change the world.",
  },
  about: { eyebrow: "About Me", title: "My Journey" },
  featured: {
    eyebrow: "Featured",
    title: "My Projects",
    viewAll: "View all projects →",
    writingEyebrow: "Writing",
    writingTitle: "My Blogs",
    viewAllPosts: "View all posts →",
  },
  projectCard: { demo: "Demo", source: "Source" },
  search: {
    label: "Search posts",
    placeholder: "Search post titles, tags, content…",
    empty: "No matching results",
    link: "Search posts →",
  },
  related: { title: "Related Posts" },
  share: { share: "Share", copy: "Copy link", copied: "Link copied" },
  toc: { title: "Contents" },
  codeBlock: { copy: "Copy", copied: "Copied" },
  postMeta: { approx: "", minutes: "min read", words: "words" },
  pages: {
    projects: { eyebrow: "Portfolio", title: "What I've Built" },
    blog: { eyebrow: "Blog", title: "What I've Written" },
    archive: { eyebrow: "Archive", title: "All Posts" },
    search: { eyebrow: "Search", title: "Find Posts" },
    tags: { eyebrow: "Tag" },
    series: { eyebrow: "Series" },
    notFound: {
      title: "Page Not Found",
      body: "The page you're looking for doesn't exist. Head back home.",
      back: "Back home →",
    },
  },
};

export const messages: Record<Locale, MessagesShape> = { zh, en };

/** 按点路径取值（如 "nav.home"）；找不到时原样返回路径，便于排查漏键 */
export function getMsg(obj: Record<string, unknown>, path: string): string {
  const value = path.split(".").reduce<unknown>(
    (acc, key) => (acc && typeof acc === "object" ? (acc as Record<string, unknown>)[key] : undefined),
    obj,
  );
  return typeof value === "string" ? value : path;
}
