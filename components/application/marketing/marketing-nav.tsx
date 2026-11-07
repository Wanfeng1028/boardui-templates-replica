"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useRef, useState, type CSSProperties, type ReactNode } from "react";
import {
  RiDiscordFill,
  RiGithubFill,
  RiSearchLine,
  RiTwitterXFill,
} from "@remixicon/react";

import { Kbd } from "@/components/base/kbd/kbd";
import { ProLogo } from "@/components/foundations/brand/logo";
import { ThemeToggle } from "@/components/application/theme/theme-toggle";
import { LIBRARY_NAV, MARKETING_LINKS } from "@/components/application/docs/docs-nav";
import { cx } from "@/utils/cx";

/**
 * Marketing header + Quick Search, as on boardui.com/blog (curl 2026-11-08,
 * saved in ~/workspace/boardui-verify/orig4/blog.html).
 *
 * Header: logo (32px) + BoardUI wordmark, nav Components / Templates / Docs /
 * Blog, Quick Search pill (xl and up), X / Discord / GitHub icon links,
 * Get Pro, theme control. Below lg the nav links hide, exactly as on the
 * original — at 390px the bar shows the logo, social icons, theme toggle
 * and Get Pro, with no horizontal scroll.
 *
 * Two deliberate in-site adaptations, both reported, not hidden:
 * - the original's Get Pro is a <button> opening a pricing dialog; this
 *   replica has a standalone /pricing page (kept by the user), so Get Pro
 *   links there instead.
 * - the original's Quick Search opens a search dialog; this one does too,
 *   over this site's own nav (106 library items + docs + blog + pricing).
 */

const GLASS_STYLE = {
  "--lg-ms": "220ms",
  "--lg-shadow": "0 -2px 13px rgb(0 0 0 / 0.045)",
  "--lg-shadow-hover": "0 2px 20px rgb(0 0 0 / 0.06)",
  "--lg-lift": "-2px",
  "--lg-scale": "1",
} as CSSProperties;

const GLASS_TINT_STYLE = {
  "--lg-ms": "220ms",
  "--lg-tint": "rgb(255 255 255 / 0.06)",
  "--lg-tint-hover": "rgb(255 255 255 / 0.28)",
  "--lg-sheen": "0.5",
  "--lg-sheen-hover": "0.68",
  "--lg-rim-width": "0.3px",
  "--lg-rim-angle": "134deg",
  "--lg-rim-o": "1",
  "--lg-rim-o-hover": "1",
  "--lg-rim-hi": "rgb(0 0 0 / 0.1)",
  "--lg-rim-sh": "rgb(186 186 186 / 0.38)",
  "--lg-rim-bounce": "rgb(255 255 255 / 0.48)",
  "--lg-rim-dim": "rgb(0 0 0 / 0.011000000000000001)",
} as CSSProperties;

/** Liquid-glass host span, as the original wraps its header controls. */
function Glass({ rounded, children, className }: { rounded: string; children: ReactNode; className?: string }) {
  return (
    <span className={cx("lg-host group relative", rounded, className)} style={GLASS_STYLE}>
      <span aria-hidden className="pointer-events-none absolute inset-0 rounded-[inherit]" style={GLASS_TINT_STYLE}>
        <span
          aria-hidden
          className="absolute inset-0 rounded-[inherit]"
          style={{ backdropFilter: "blur(6px) saturate(160%)", WebkitBackdropFilter: "blur(6px) saturate(160%)" }}
        />
        <span aria-hidden className="lg-tint absolute inset-0 rounded-[inherit] lg-hover" />
        <span
          aria-hidden
          className="lg-sheen absolute inset-0 rounded-[inherit] lg-hover"
          style={{
            background:
              "linear-gradient(155deg, rgb(255 255 255 / 1) 0%, rgb(255 255 255 / 0) 30%, rgb(255 255 255 / 0) 68%, rgb(255 255 255 / 0.32) 100%)",
          }}
        />
        <span aria-hidden className="landing-glass-stroke lg-hover" />
      </span>
      {children}
    </span>
  );
}

type SearchItem = { href: string; label: string; section: string; isNew?: boolean; isPro?: boolean };

const SEARCH_ITEMS: SearchItem[] = [
  ...LIBRARY_NAV.flatMap((section) =>
    section.items.map((item) => ({ ...item, section: section.title })),
  ),
  { href: "/docs/introduction", label: "Introduction", section: "Docs" },
  { href: "/docs/cli", label: "CLI", section: "Docs" },
  { href: "/blog", label: "Blog", section: "Pages" },
  { href: "/pricing", label: "Pricing", section: "Pages" },
];

/**
 * Quick Search: the trigger button (pill in the marketing header, full-width
 * row in the library sidebar) plus the search dialog it opens. ⌘K / Ctrl+K
 * opens it from anywhere; Esc closes; Enter goes to the highlighted hit.
 */
export function QuickSearch({ variant }: { variant: "pill" | "sidebar" }) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [active, setActive] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return SEARCH_ITEMS.slice(0, 10);
    return SEARCH_ITEMS.filter(
      (item) => item.label.toLowerCase().includes(q) || item.href.toLowerCase().includes(q),
    ).slice(0, 10);
  }, [query]);

  useEffect(() => {
    if (!open) return;
    setActive(0);
    inputRef.current?.focus();
  }, [open ]);

  useEffect(() => {
    if (open) return;
    const onKey = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        setOpen(true);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open ]);

  const go = (href: string) => {
    setOpen(false);
    setQuery("");
    router.push(href);
  };

  return (
    <>
      {variant === "pill" ? (
        <Glass rounded="rounded-full" className="hidden w-[220px] xl:flex">
          <button
            type="button"
            aria-label="Quick Search"
            aria-haspopup="dialog"
            aria-expanded={open}
            onClick={() => setOpen(true)}
            className="relative z-10 flex w-full cursor-pointer items-center gap-2 rounded-full p-2 outline-none focus-visible:ring-2 focus-visible:ring-border-focus-ring focus-visible:ring-offset-2"
          >
            <span className="relative z-10 flex min-w-0 flex-1 items-center gap-2">
              <RiSearchLine className="size-5 shrink-0 text-black/35 dark:text-white/35" aria-hidden />
              <span className="truncate text-body-regular text-black/50 dark:text-white/50">Quick Search</span>
            </span>
            <span className="relative z-10 -translate-x-[2px] -translate-y-px">
              <kbd className="inline-flex items-center justify-center rounded-full bg-black/10 px-1 py-0.5 font-sans text-caption-1-semibold tracking-normal whitespace-nowrap text-black/50 dark:bg-white/10 dark:text-white/50">
                ⌘K
              </kbd>
            </span>
          </button>
        </Glass>
      ) : (
        <button
          type="button"
          aria-label="Quick Search"
          aria-haspopup="dialog"
          aria-expanded={open}
          onClick={() => setOpen(true)}
          className="flex w-full cursor-pointer items-center gap-2 rounded-full bg-background-tertiary-default p-2 transition-colors duration-150 hover:bg-background-tertiary-hover/55"
        >
          <span className="flex min-w-0 flex-1 items-center gap-2">
            <RiSearchLine className="size-5 shrink-0 text-foreground-icon-secondary" aria-hidden />
            <span className="text-body-medium whitespace-nowrap text-text-secondary">Quick Search</span>
          </span>
          <Kbd>⌘K</Kbd>
        </button>
      )}

      {open ? (
        <div
          className="fixed inset-0 z-[80] flex items-start justify-center bg-black/40 p-4 pt-[12vh]"
          onClick={() => setOpen(false)}
        >
          <div
            role="dialog"
            aria-label="Quick Search"
            className="w-full max-w-lg overflow-hidden rounded-3xl border border-border-button-default bg-background-primary-default shadow-lg"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="flex items-center gap-2 border-b border-separator-border px-4 py-3">
              <RiSearchLine className="size-5 shrink-0 text-foreground-icon-secondary" aria-hidden />
              <input
                ref={inputRef}
                value={query}
                onChange={(event) => {
                  setQuery(event.target.value);
                  setActive(0);
                }}
                onKeyDown={(event) => {
                  if (event.key === "Escape") {
                    event.preventDefault();
                    setOpen(false);
                  } else if (event.key === "ArrowDown") {
                    event.preventDefault();
                    setActive((a) => Math.min(a + 1, results.length - 1));
                  } else if (event.key === "ArrowUp") {
                    event.preventDefault();
                    setActive((a) => Math.max(a - 1, 0));
                  } else if (event.key === "Enter" && results[active]) {
                    event.preventDefault();
                    go(results[active].href);
                  }
                }}
                placeholder="Search components, docs, templates…"
                aria-label="Search"
                className="min-w-0 flex-1 bg-transparent text-body-medium text-text-primary outline-none placeholder:text-text-tertiary"
              />
              <Kbd>ESC</Kbd>
            </div>
            <ul className="max-h-[50vh] overflow-y-auto p-2">
              {results.length === 0 ? (
                <li className="px-3 py-4 text-body-regular text-text-tertiary">No results for “{query}”.</li>
              ) : (
                results.map((item, i) => (
                  <li key={item.href}>
                    <button
                      type="button"
                      onMouseEnter={() => setActive(i)}
                      onClick={() => go(item.href)}
                      className={cx(
                        "flex w-full cursor-pointer items-center justify-between gap-2 rounded-xl px-3 py-2 text-start",
                        i === active ? "bg-background-secondary-default" : "",
                      )}
                    >
                      <span className="flex min-w-0 items-center gap-2">
                        <span className="truncate text-body-medium text-text-primary">{item.label}</span>
                        {item.isNew ? (
                          <span className="rounded-full bg-background-tertiary-default px-1.5 py-px text-caption-1-semibold text-text-secondary">
                            New
                          </span>
                        ) : null}
                        {item.isPro ? (
                          <span className="rounded-full bg-background-tertiary-default px-1.5 py-px text-caption-1-semibold text-text-secondary">
                            Pro
                          </span>
                        ) : null}
                      </span>
                      <span className="shrink-0 text-caption-1-regular text-text-tertiary">{item.section}</span>
                    </button>
                  </li>
                ))
              )}
            </ul>
            <p className="border-t border-separator-border px-4 py-2 text-caption-1-regular text-text-tertiary">
              {results.length === 0 ? "0" : `${results.length}`} result{results.length === 1 ? "" : "s"}
              {query.trim() ? "" : " — type to search all 106 library items"}
            </p>
          </div>
        </div>
      ) : null}
    </>
  );
}

/** Get Pro — the original's button opens a pricing dialog; this replica links to its /pricing page. */
export function GetProLink({ className }: { className?: string }) {
  return (
    <Glass rounded="rounded-2lg" className={cx("inline-flex", className)}>
      <Link
        href="/pricing"
        className="relative z-10 inline-flex h-8 shrink-0 items-center justify-center gap-0.5 rounded-2lg border border-transparent bg-transparent px-2 py-1 text-body-medium text-text-primary shadow-none transition-colors duration-150 ease outline-none select-none hover:border-transparent hover:bg-transparent focus-visible:ring-2 focus-visible:ring-border-focus-ring focus-visible:ring-offset-2 sm:h-9 sm:py-2"
      >
        <ProLogo size={20} decorative />
        <span className="inline-flex shrink-0 items-center justify-center px-1">Get Pro</span>
      </Link>
    </Glass>
  );
}

function SocialLink({
  href,
  label,
  children,
  className,
}: {
  href: string;
  label: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <Glass rounded="rounded-2lg" className={cx("inline-flex", className)}>
      <a
        href={href}
        target="_blank"
        rel="noreferrer"
        aria-label={label}
        className="relative z-10 inline-flex size-8 shrink-0 items-center justify-center rounded-2lg border border-transparent bg-transparent text-black shadow-none transition-colors duration-150 ease outline-none hover:border-transparent hover:bg-transparent hover:text-black focus-visible:ring-2 focus-visible:ring-border-focus-ring focus-visible:ring-offset-2 sm:size-9 dark:text-white dark:hover:text-white [&>svg]:size-5"
      >
        {children}
      </a>
    </Glass>
  );
}

/**
 * Marketing header, verbatim from boardui.com/blog: max-w-[1276px], 68/72px,
 * logo 32px + wordmark, nav gap 26px, Quick Search pill, X / Discord /
 * GitHub, Get Pro, theme control (segmented above sm, single button below).
 */
export function MarketingNav() {
  return (
    <header className="w-full">
      <div className="mx-auto flex min-h-[68px] w-full max-w-[1276px] items-center justify-between gap-x-4 gap-y-2 px-3 py-3 sm:min-h-[72px] sm:flex-wrap sm:px-6 xl:flex-nowrap xl:px-0">
        <div className="flex min-w-0 items-center gap-8">
          <Link
            aria-label="BoardUI"
            href="/"
            className="flex shrink-0 items-center gap-[11px] outline-none focus-visible:ring-2 focus-visible:ring-border-focus-ring"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/brand/boardui_logo.png" alt="BoardUI" width={32} height={32} className="size-8 shrink-0" />
            <span className="hidden text-body-semibold text-text-primary sm:inline min-[360px]:inline">BoardUI</span>
          </Link>
          <nav className="hidden items-center gap-[26px] text-body-medium text-text-secondary lg:flex" aria-label="Site">
            {MARKETING_LINKS.map((link) => (
              <Link
                key={link.href + link.label}
                href={link.href}
                className="transition-colors duration-150 ease outline-none hover:text-text-primary focus-visible:ring-2 focus-visible:ring-border-focus-ring"
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </div>
        <div className="flex shrink-0 items-center gap-2">
          <QuickSearch variant="pill" />
          <div className="flex items-center gap-2">
            <SocialLink href="https://x.com/boardui" label="Follow BoardUI on X">
              <RiTwitterXFill aria-hidden />
            </SocialLink>
            <SocialLink href="https://discord.gg/azcHkw8T6F" label="Join the BoardUI Discord">
              <RiDiscordFill aria-hidden />
            </SocialLink>
          </div>
          <Glass rounded="rounded-2lg" className="hidden sm:block">
            <a
              href="https://github.com/BoardUI/boardui"
              target="_blank"
              rel="noreferrer"
              aria-label="BoardUI on GitHub"
              className="relative z-10 inline-flex h-8 items-center justify-center gap-0.5 rounded-2lg border border-transparent bg-transparent p-2 text-body-medium text-text-primary shadow-none transition-colors duration-150 ease outline-none select-none hover:border-transparent hover:bg-transparent focus-visible:ring-2 focus-visible:ring-border-focus-ring focus-visible:ring-offset-2 sm:h-9 sm:py-2"
            >
              <RiGithubFill className="size-5 shrink-0" aria-hidden />
              <span className="inline-flex shrink-0 items-center justify-center px-1" />
            </a>
          </Glass>
          <GetProLink />
          <Glass rounded="rounded-full" className="sm:hidden">
            <span className="relative z-10 block">
              <ThemeToggle collapsed />
            </span>
          </Glass>
          <Glass rounded="rounded-full" className="hidden sm:block">
            <span className="relative z-10 block">
              <ThemeToggle appearance="glass-segmented" size="small" />
            </span>
          </Glass>
        </div>
      </div>
    </header>
  );
}
