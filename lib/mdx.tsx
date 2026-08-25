import { MDXRemote } from "next-mdx-remote-client/rsc";
import type { PluggableList } from "unified";
import rehypePrettyCode from "rehype-pretty-code";
import rehypeSlug from "rehype-slug";
import { Pre } from "@/components/CodeBlock";
import { ProseP } from "@/components/ProseP";

const options = {
  mdxOptions: {
    // rehype-pretty-code 的 Options 类型与 unified Pluggable 元组类型不匹配，按 PluggableList 断言
    rehypePlugins: [
      rehypeSlug,
      [rehypePrettyCode, { theme: "github-light", keepBackground: false }],
    ] as PluggableList,
  },
};

const components = {
  pre: Pre,
  h2: (props: React.HTMLAttributes<HTMLHeadingElement>) => <h2 className="font-display mt-10 mb-4 scroll-mt-24 text-2xl font-semibold" {...props} />,
  h3: (props: React.HTMLAttributes<HTMLHeadingElement>) => <h3 className="font-display mt-8 mb-3 scroll-mt-24 text-xl font-semibold" {...props} />,
  p: (props: React.HTMLAttributes<HTMLParagraphElement>) => <ProseP {...props} />,
  a: (props: React.AnchorHTMLAttributes<HTMLAnchorElement>) => <a className="text-accent underline underline-offset-2" {...props} />,
  ul: (props: React.HTMLAttributes<HTMLUListElement>) => <ul className="my-4 list-disc pl-6" {...props} />,
  ol: (props: React.HTMLAttributes<HTMLOListElement>) => <ol className="my-4 list-decimal pl-6" {...props} />,
  blockquote: (props: React.HTMLAttributes<HTMLQuoteElement>) => <blockquote className="my-4 border-l-2 border-accent pl-4 text-text-muted" {...props} />,
  hr: () => <hr className="my-8 border-border" />,
  img: (props: React.ImgHTMLAttributes<HTMLImageElement>) => (
    // eslint-disable-next-line @next/next/no-img-element
    <img className="my-4 rounded-lg" alt={props.alt ?? ""} {...props} />
  ),
  table: (props: React.HTMLAttributes<HTMLTableElement>) => (
    <div className="my-4 overflow-x-auto">
      <table className="w-full border-collapse text-sm" {...props} />
    </div>
  ),
};

export function MdxContent({ source }: { source: string }) {
  return <MDXRemote source={source} components={components} options={options} />;
}
