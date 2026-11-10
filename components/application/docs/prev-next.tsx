import Link from "next/link";
import { RiArrowLeftLine, RiArrowRightLine } from "@remixicon/react";

import { cx } from "@/utils/cx";
import { chromeString, type SiteLocale } from "@/components/application/docs/locale-chrome";

export type PrevNextLink = {
  href: string;
  label: string;
  sub?: string;
  /** English target name for the aria-label: the original keeps the target untranslated there ("Next: Installation"). */
  enLabel?: string;
};

const LINK_CLASS =
  "flex flex-col gap-0.5 rounded-xl border border-border-button-default bg-background-primary-default px-3.5 py-2.5 shadow-xs transition-colors duration-150 ease select-none hover:bg-background-primary-hover hover:border-border-button-hover active:bg-background-primary-active active:border-border-button-active outline-none focus-visible:ring-2 focus-visible:ring-border-focus-ring focus-visible:ring-offset-2";

/**
 * Previous / next docs footer, as on boardui.com component pages.
 * Both links are optional: a page with no previous (or next) renders only
 * the one that exists.
 */
export function PrevNext({
  prev,
  next,
  locale = "en",
}: {
  prev?: PrevNextLink;
  next?: PrevNextLink;
  locale?: SiteLocale;
}) {
  if (!prev && !next) return null;
  return (
    <div className="mt-14 flex flex-col gap-6">
      <nav aria-label={chromeString("Docs pages", locale)} className="flex items-center justify-between gap-2">
        {prev ? (
          <Link
            href={prev.href}
            aria-label={chromeString("Previous: {0}", locale).replace("{0}", prev.enLabel ?? prev.label)}
            className={LINK_CLASS}
          >
            <span className="flex items-center gap-1.5 text-body-medium text-text-primary">
              <RiArrowLeftLine className="size-[18px] shrink-0 rtl:-scale-x-100" aria-hidden />
              {prev.label}
            </span>
            {prev.sub ? (
              <span className="text-caption-1-medium text-text-tertiary">{prev.sub}</span>
            ) : null}
          </Link>
        ) : (
          <span />
        )}
        {next ? (
          <Link
            href={next.href}
            aria-label={chromeString("Next: {0}", locale).replace("{0}", next.enLabel ?? next.label)}
            className={cx(LINK_CLASS, "items-end")}
          >
            <span className="flex flex-row-reverse items-center gap-1.5 text-body-medium text-text-primary">
              <RiArrowRightLine className="size-[18px] shrink-0 rtl:-scale-x-100" aria-hidden />
              {next.label}
            </span>
            {next.sub ? (
              <span className="text-caption-1-medium text-text-tertiary">{next.sub}</span>
            ) : null}
          </Link>
        ) : null}
      </nav>
    </div>
  );
}
