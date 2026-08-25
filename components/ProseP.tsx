"use client";

import { motion, useReducedMotion } from "motion/react";
import type { HTMLAttributes } from "react";

// 正文段落轻量滚动淡入（FR-3.6）：只淡入一次、位移极小，不打断阅读；减弱动效时纯静态
type PProps = Omit<HTMLAttributes<HTMLParagraphElement>, "onAnimationStart" | "onDragStart" | "onDragEnd" | "onDrag">;

export function ProseP(props: PProps) {
  const reduce = useReducedMotion();
  return (
    <motion.p
      initial={reduce ? undefined : { opacity: 0, y: 8 }}
      whileInView={reduce ? undefined : { opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className="my-4 leading-7"
      {...props}
    />
  );
}
