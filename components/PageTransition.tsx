"use client";

import { motion } from "motion/react";
import { usePathname } from "next/navigation";

export function PageTransition({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  return (
    // key=pathname：路由变化时重挂载，客户端导航也能重放淡入（静态导出下 layout 常驻）
    <motion.main
      key={pathname}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
      className="mx-auto max-w-5xl px-6"
    >
      {children}
    </motion.main>
  );
}
