import type { Metadata } from "next";
import { Nav } from "@/components/nav";
import { Footer } from "@/components/footer";
import { SITE_URL } from "@/lib/site";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: { default: "你的名字 — 作品集", template: "%s | 你的名字" },
  description: "个人作品集与博客：前端工程、独立开发与生活随笔。",
  openGraph: { type: "website", locale: "zh_CN" },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="zh-CN">
      <body className="antialiased">
        <Nav />
        <main className="mx-auto max-w-5xl px-6">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
