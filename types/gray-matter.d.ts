/**
 * gray-matter 类型声明（本地内置）。
 *
 * npmmirror 镜像未同步 @types/gray-matter（npmjs 直连在此环境不可达），
 * 因此把最小类型声明放入仓库；与 DefinitelyTyped 的 @types/gray-matter 用法一致
 * （`import matter from "gray-matter"`，配合 esModuleInterop）。
 */
declare module "gray-matter" {
  interface GrayMatterOptions {
    excerpt?: boolean;
    excerpt_separator?: string;
    engines?: Record<string, unknown>;
    language?: string;
    delimiters?: string | [string, string];
  }

  interface GrayMatterFile<T = string> {
    data: Record<string, any>;
    content: T;
    excerpt?: T;
    orig: Buffer;
    language?: string;
    matter: string;
    stringify(lang?: string): string;
  }

  function matter<T = string>(input: string | Buffer, options?: GrayMatterOptions): GrayMatterFile<T>;

  export = matter;
}
