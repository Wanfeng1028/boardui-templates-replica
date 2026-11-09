"use client";

import { usePathname } from "next/navigation";
import { RiTranslate2 } from "@remixicon/react";
import { Select, SelectItem } from "@/components/base/select/select";
import {
  LOCALES,
  LOCALE_IDS,
  flagFor,
  localeFromPathname,
  localizedHref,
  setSiteLanguageCookie,
  useSiteLanguageAudience,
  type SiteLocale,
} from "./site-language-config";

export function SiteLanguageSelector({
  compact = true,
  showIcon = true,
  className,
}: {
  compact?: boolean;
  showIcon?: boolean;
  className?: string;
}) {
  const pathname = usePathname();
  const locale = localeFromPathname(pathname ?? "/");
  const config = LOCALES[locale];
  const audience = useSiteLanguageAudience();

  if (!audience) return null;

  return (
    <Select
      size="sm"
      aria-label={config.languageLabel}
      selectedKey={locale}
      onSelectionChange={(key) => {
        if (typeof key !== "string") return;
        const next = key as SiteLocale;
        if (next === locale) return;
        setSiteLanguageCookie(next);
        window.location.assign(
          localizedHref(pathname ?? "/", next) +
            window.location.search +
            window.location.hash,
        );
      }}
      triggerClassName="gap-1 px-1.5 py-1"
      popoverClassName="w-40 p-1"
      className={className}
      renderValue={() => (
        <span className="flex items-center gap-1">
          {showIcon ? <RiTranslate2 className="size-4" aria-hidden /> : null}
          <span>{compact ? config.compactLabel : config.label}</span>
        </span>
      )}
    >
      {LOCALE_IDS.map((id) => (
        <SelectItem key={id} id={id} textValue={LOCALES[id].label}>
          <span className="flex items-center gap-2">
            {flagFor(id)}
            <span lang={LOCALES[id].bcp47} dir={LOCALES[id].direction}>
              {LOCALES[id].label}
            </span>
          </span>
        </SelectItem>
      ))}
    </Select>
  );
}
