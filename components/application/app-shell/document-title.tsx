"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

import { PAGE_TITLES } from "@/utils/page-titles";

/**
 * Sets document.title from the route -> title map (verbatim original
 * <title> values, see utils/page-titles.ts). Pages that render inside
 * AppShell / TemplateShell get this automatically; standalone pages
 * render <DocumentTitle /> themselves. An explicit `title` prop wins
 * over the map lookup.
 */
export function resolvePageTitle(pathname: string): string | undefined {
  const path = pathname.replace(/\/+$/, "") || "/";
  return PAGE_TITLES[path];
}

export function DocumentTitle({ title }: { title?: string }) {
  const pathname = usePathname() ?? "/";
  useEffect(() => {
    const want = title ?? resolvePageTitle(pathname);
    if (!want) return;
    document.title = want;
    // Next.js re-applies the root layout's metadata <title> when the
    // streamed RSC payload finishes resolving — seconds after hydration
    // on heavy pages — which would silently revert our title to the
    // default. Watch <head> and put the mapped title back whenever
    // anything changes it. The equality guard keeps our own write from
    // re-triggering the observer.
    const obs = new MutationObserver(() => {
      if (document.title !== want) document.title = want;
    });
    obs.observe(document.head, { childList: true, subtree: true, characterData: true });
    return () => obs.disconnect();
  }, [title, pathname]);
  return null;
}
