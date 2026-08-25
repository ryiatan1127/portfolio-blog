// 剥离 Markdown 语法 → 纯文本：wordCount（阅读字数）与搜索索引（Task 19）共用同一逻辑
export function toPlainText(md: string): string {
  return md
    .replace(/```[\s\S]*?```/g, " ")          // 代码块
    .replace(/!\[[^\]]*\]\([^)]*\)/g, " ")     // 图片
    .replace(/\[([^\]]*)\]\([^)]*\)/g, "$1")   // 链接保留文字
    .replace(/[#>*`~\-_|]/g, " ")              // markdown 符号
    .replace(/\s+/g, " ")
    .trim();
}
