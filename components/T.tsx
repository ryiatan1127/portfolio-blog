"use client";

import { getMsg } from "@/lib/i18n";
import { useT } from "./LanguageProvider";

/** 在服务端组件里按翻译键渲染界面文案：<T k="nav.home" /> */
export function T({ k }: { k: string }) {
  return <>{getMsg(useT(), k)}</>;
}
