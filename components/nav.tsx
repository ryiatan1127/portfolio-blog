"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { AnimatePresence, motion, useReducedMotion, useScroll, useMotionValueEvent } from "motion/react";
import { LanguageToggle } from "./LanguageToggle";
import { useT } from "./LanguageProvider";

export function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [hovered, setHovered] = useState<string | null>(null); // 当前悬停的导航项：按钮下方浮现 rightwing 漂浮物
  const [logoHovered, setLogoHovered] = useState(false); // logo 悬停：浮现 fullwing（同样逻辑）
  const { scrollY } = useScroll();
  const t = useT();
  const reduce = useReducedMotion();

  const links = [
    { href: "/", label: t.nav.home },
    { href: "/projects", label: t.nav.projects },
    { href: "/blog", label: t.nav.blog },
    { href: "/archive", label: t.nav.archive },
    { href: "/search", label: t.nav.search },
  ];

  useMotionValueEvent(scrollY, "change", (latest) => setScrolled(latest > 24));

  // Esc 关闭移动端菜单（P2）
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") setOpen(false); };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  return (
    <motion.header
      initial={{ y: -60, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5 }}
      className={`fixed inset-x-0 top-0 z-50 transition-colors ${
        scrolled || open ? "backdrop-blur" : "bg-transparent"
      }`}
    >
      {/* 淡淡蕾丝背景（素材：public/images/lace-nav.png，未放图时静默无背景） */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-25"
        style={{
          backgroundImage: "url('/images/lace-nav.png')",
          backgroundRepeat: "repeat-x",
          backgroundSize: "auto 100%",
          backgroundPosition: "center",
        }}
      />
      <nav className="relative mx-auto flex max-w-5xl items-center justify-between px-6 py-4">
        {/* logo 同逻辑：hover 浮现 fullwing（原图 768×352，固定 40×87px 保持比例；文字在上层） */}
        <div
          className="relative"
          onMouseEnter={() => setLogoHovered(true)}
          onMouseLeave={() => setLogoHovered(false)}
        >
          <Link
            href="/"
            className="relative z-10 inline-block font-display text-xl font-semibold"
            onClick={() => setOpen(false)}
          >
            Ryia
          </Link>
          {/* 扩展 hover 区域 */}
          <span aria-hidden className="absolute inset-x-0 top-full z-0 h-12" />
          <AnimatePresence>
            {logoHovered && (
              <div
                aria-hidden
                className="
                  pointer-events-none
                  absolute
                  left-1/2
                  top-1/2
                  z-0
                  w-max
                  -translate-x-1/2
                  -translate-y-1/2
                "
              >
                <motion.img
                  src="/images/fullwing.png"
                  alt=""
                  initial={{ opacity: 0, y: -8, scale: 0.6 }}
                  animate={
                    reduce
                      ? { opacity: 1, scale: 1 }
                      : {
                          opacity: 1,
                          y: [0, -5, 0],
                          scale: 1,
                        }
                  }
                  exit={{
                    opacity: 0,
                    y: -8,
                    scale: 0.6,
                  }}
                  transition={{
                    opacity: { duration: 0.25 },
                    scale: {
                      type: "spring",
                      stiffness: 300,
                      damping: 20,
                    },
                    y: {
                      duration: 2.4,
                      repeat: Infinity,
                      ease: "easeInOut",
                    },
                  }}
                  className="
                    block
                    h-12
                    w-[105px]
                    max-w-none
                    shrink-0
                    object-contain
                    drop-shadow-[0_0_10px_rgba(217,165,199,0.55)]
                  "
                />
              </div>
            )}
          </AnimatePresence>
        </div>
        <ul className="hidden items-center gap-6 text-sm text-text-muted md:flex">
          {links.map((l) => (
            <li
              key={l.href}
              className="relative"
              onMouseEnter={() => setHovered(l.href)}
              onMouseLeave={() => setHovered((h) => (h === l.href ? null : h))}
            >
              {/* 文字永远在最上层 */}
              <Link
                href={l.href}
                className="relative z-10 inline-block transition-colors hover:text-text"
              >
                {l.label}
              </Link>

              {/* 扩展 hover 区域 */}
              <span
                aria-hidden
                className="absolute inset-x-0 top-full z-0 h-12"
              />

              <AnimatePresence>
                {hovered === l.href && (
                  <div
                    aria-hidden
                    className="
                      pointer-events-none
                      absolute
                      left-1/2
                      top-1/2
                      z-0
                      w-max
                      -translate-x-1/2
                      -translate-y-1/2
                    "
                  >
                    <motion.img
                      src="/images/rightwing.png"
                      alt=""
                      initial={{ opacity: 0, y: -8, scale: 0.6 }}
                      animate={
                        reduce
                          ? { opacity: 1, scale: 1 }
                          : {
                              opacity: 1,
                              y: [0, -5, 0],
                              scale: 1,
                            }
                      }
                      exit={{
                        opacity: 0,
                        y: -8,
                        scale: 0.6,
                      }}
                      transition={{
                        opacity: { duration: 0.25 },
                        scale: {
                          type: "spring",
                          stiffness: 300,
                          damping: 20,
                        },
                        y: {
                          duration: 2.4,
                          repeat: Infinity,
                          ease: "easeInOut",
                        },
                      }}
                      className="
                        block
                        h-7
                        w-9
                        max-w-none
                        shrink-0
                        object-contain
                        drop-shadow-[0_0_10px_rgba(217,165,199,0.55)]
                      "
                    />
                  </div>
                )}
              </AnimatePresence>
            </li>
          ))}
        </ul>
        <div className="flex items-center gap-2">
          <LanguageToggle />
          <button
            type="button"
            aria-label={open ? t.nav.closeMenu : t.nav.openMenu}
            aria-expanded={open}
            onClick={() => setOpen((v) => !v)}
            aria-controls="mobile-menu"
            className="flex h-9 w-9 items-center justify-center rounded-lg border border-border text-text md:hidden"
          >
            {open ? "✕" : "☰"}
          </button>
        </div>
      </nav>
      {open && (
        <motion.ul
          id="mobile-menu"
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          className="border-t border-border bg-bg-elevated px-6 py-4 backdrop-blur md:hidden"
        >
          {links.map((l) => (
            <li key={l.href}>
              <Link href={l.href} onClick={() => setOpen(false)} className="block py-2 text-sm text-text-muted hover:text-text">
                {l.label}
              </Link>
            </li>
          ))}
        </motion.ul>
      )}
    </motion.header>
  );
}
