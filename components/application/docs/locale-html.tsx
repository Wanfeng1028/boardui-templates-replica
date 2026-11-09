"use client";

import { useEffect, type ReactNode } from "react";

import { DirectionProvider } from "@/components/foundations/direction/direction";
import { LOCALES, type SiteLocale } from "@/components/application/docs/site-language-config";

/**
 * Locale page wrapper. The static export shares one root layout, so the
 * static HTML always carries lang="en-US" dir="ltr"; this client component
 * corrects document.documentElement on mount and nests a DirectionProvider
 * with the locale's BCP 47 tag so React Aria keyboard navigation and
 * portalled menus follow the page direction. The initial static HTML keeps
 * the root layout's lang/dir until mount — a known static-export limitation.
 */
export function LocaleHtml({ locale, children }: { locale: SiteLocale; children: ReactNode }) {
  const config = LOCALES[locale];
  useEffect(() => {
    document.documentElement.lang = config.bcp47;
    document.documentElement.dir = config.direction;
  }, [config.bcp47, config.direction]);
  return <DirectionProvider locale={config.bcp47}>{children}</DirectionProvider>;
}