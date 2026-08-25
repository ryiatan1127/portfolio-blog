import GithubSlugger from "github-slugger";

export type Heading = { text: string; level: 2 | 3; id: string };

export function extractHeadings(content: string): Heading[] {
  const slugger = new GithubSlugger();
  const withoutCode = content.replace(/```[\s\S]*?```/g, "");
  const headings: Heading[] = [];
  for (const line of withoutCode.split("\n")) {
    const m = /^(#{2,3})\s+(.*)$/.exec(line);
    if (m) headings.push({ level: m[1].length as 2 | 3, text: m[2].trim(), id: slugger.slug(m[2].trim()) });
  }
  return headings;
}
