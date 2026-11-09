"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState, type ComponentType, type ReactNode } from "react";
import { RiDiscordFill, RiGithubFill, RiListUnordered, RiMenuLine, RiTwitterXFill } from "@remixicon/react";

import { DocumentTitle } from "@/components/application/app-shell/document-title";
import { SiteFooter } from "@/components/application/blog/blog-article-footer";
import { PrevNext } from "@/components/application/docs/prev-next";
import { DOCS_NAV, LIBRARY_NAV, prevNextFor } from "@/components/application/docs/docs-nav";
import { GetProLink, MarketingNav, QuickSearch } from "@/components/application/marketing/marketing-nav";
import { ThemeToggle } from "@/components/application/theme/theme-toggle";
import { IconButton } from "@/components/base/buttons/icon-button";
import { Drawer, DrawerBody, DrawerTrigger } from "@/components/base/drawer/drawer";
import { cx } from "@/utils/cx";

/**
 * Docs / library / marketing page frame, replacing AppShell on every
 * non-template page. Structure and copy are boardui.com's own (curl of
 * /components/date-picker, /docs/introduction, /docs/cli, /installation,
 * /mcp, /skill, /rtl and /blog, 2026-11-08, in ~/workspace/boardui-verify/orig4/):
 *
 * - library (/components/*, /installation, /mcp, /skill, /rtl): 260px
 *   rounded sidebar (logo, Quick Search, collapsible sections, New/Pro
 *   badges), breadcrumb "Board UI / Components|Docs / Page", theme toggle +
 *   X + Get Pro, h1, auto "On this page" TOC (xl), auto prev/next from the
 *   sidebar order, site footer.
 * - docs (/docs/*): max-w-6xl row, 224px sidebar (Get started / Components
 *   + Dark mode switch at the bottom), eyebrow + h1, site footer. No
 *   breadcrumb, no TOC, no prev/next — the original has none there either.
 * - marketing (/blog/*, /pricing): marketing header + centred main +
 *   site footer.
 *
 * AppShell stays the frame for /templates/*, /dashboard, /login, /signup
 * and / — this layout never renders the template chrome (sidebar nav,
 * "Board team > Mertcan" breadcrumb, Filters / Create ticket, or the fixed
 * "Buy once. Build forever." card), so none of it can leak onto these pages.
 *
 * <DocumentTitle /> is mounted in every variant: the route -> title map
 * (utils/page-titles.ts) keeps working exactly as it did under AppShell.
 *
 * Props mirror AppShell's so the migration is a tag swap: `icon` and
 * `columnClassName` are accepted and ignored (the original has no per-page
 * breadcrumb icon and its columns are max-w-[900px] / max-w-3xl).
 */

type IconComponent = ComponentType<{ className?: string; "aria-hidden"?: boolean | "true" | "false" }>;

export type DocsLayoutProps = {
  /** Page name: breadcrumb current item + h1 (unless hideHeading). Optional on marketing pages that render their own h1 (pricing). */
  title?: string;
  heading?: string;
  icon?: IconComponent;
  /** Toolbar under the h1 (the /components index tier filter). Nothing is rendered by default — no Filters / Create ticket. */
  actions?: ReactNode;
  children: ReactNode;
  className?: string;
  columnClassName?: string;
  documentTitle?: string;
  hideHeading?: boolean;
  variant?: "library" | "docs" | "marketing";
  /** Docs eyebrow above the h1, e.g. "Docs · Get started" (introduction only — the original's CLI page has none). */
  eyebrow?: string;
  /** Library prev/next. Pages that already render their own <PrevNext /> pass true to keep a single copy. */
  hidePrevNext?: boolean;
  /** Marketing footer. Blog articles render their own <SiteFooter /> and pass false. */
  footer?: boolean;
};

function slugify(text: string): string {
  const slug = text
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
  return slug || "section";
}

/** Sidebar item decoration: the little elbow connector the original draws before each link. */
function TreeElbow() {
  return (
    <span
      aria-hidden
      className="pointer-events-none absolute inset-y-0 start-[12.5px] w-3 text-foreground-icon-quaternary"
    >
      <span className="absolute top-0 -bottom-0.5 start-0 w-px bg-current" />
      <svg width="12" height="6" viewBox="0 0 12 6" fill="none" className="absolute top-1/2 start-0 -translate-y-[5px] rtl:-scale-x-100">
        <path d="M0.5 0 Q0.5 5 5.5 5 H11.5" stroke="currentColor" strokeWidth="1" />
      </svg>
    </span>
  );
}

function Badge({ children }: { children: string }) {
  return (
    <span className="rounded-full bg-background-tertiary-default px-1.5 py-px text-caption-1-semibold text-text-secondary">
      {children}
    </span>
  );
}

function LibrarySidebarContent({ onNavigate }: { onNavigate?: () => void }) {
  const pathname = usePathname() ?? "/";
  const path = pathname.replace(/\/+$/, "") || "/";
  const [openSections, setOpenSections] = useState<Record<string, boolean>>({});
  const isOpen = (title: string) => openSections[title] !== false;

  return (
    <>
      <Link
        href="/"
        onClick={onNavigate}
        className="flex w-full items-center gap-2 px-1 outline-none focus-visible:ring-2 focus-visible:ring-border-focus-ring"
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/brand/boardui_logo.png" alt="BoardUI" width={24} height={24} className="shrink-0" />
        <span className="text-title-3-semibold text-text-primary">BoardUI</span>
      </Link>
      <QuickSearch variant="sidebar" />
      <nav
        aria-label="Component library"
        className="-mr-1 flex min-h-0 flex-1 flex-col gap-2 overflow-y-auto pe-1 [scrollbar-width:thin]"
      >
        <p className="sr-only" aria-live="polite">
          <span className="contents">106</span> items shown
        </p>
        {LIBRARY_NAV.map((section) => (
          <div key={section.title} className="flex flex-col gap-0.5">
            <button
              type="button"
              aria-expanded={isOpen(section.title)}
              onClick={() => setOpenSections((prev) => ({ ...prev, [section.title]: !isOpen(section.title) }))}
              className="flex w-full cursor-pointer items-center justify-between rounded-md px-2.5 pt-2 pb-1 text-caption-1-semibold tracking-wide text-text-tertiary uppercase transition-colors duration-150 ease outline-none hover:bg-background-secondary-hover focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-border-focus-ring"
            >
              <span className="-translate-y-px">{section.title}</span>
              <svg
                viewBox="0 0 24 24"
                width="24"
                height="24"
                fill="currentColor"
                aria-hidden
                className={cx(
                  "remixicon size-4 shrink-0 -translate-y-px transition-transform duration-150 ease",
                  isOpen(section.title) ? "" : "-rotate-90 rtl:rotate-90",
                )}
              >
                <path d="M11.9999 13.1714L16.9497 8.22168L18.3639 9.63589L11.9999 15.9999L5.63599 9.63589L7.0502 8.22168L11.9999 13.1714Z" />
              </svg>
            </button>
            {isOpen(section.title)
              ? section.items.map((item) => {
                  const active = item.href === path;
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={onNavigate}
                      aria-current={active ? "page" : undefined}
                      className={cx(
                        "relative flex items-center gap-2 rounded-md py-1.5 pe-2.5 ps-8 text-body-medium transition-colors duration-150 ease",
                        active
                          ? "bg-background-secondary-hover text-text-primary"
                          : "text-text-secondary hover:bg-background-secondary-hover hover:text-text-primary",
                      )}
                    >
                      <TreeElbow />
                      <span className="min-w-0 truncate">{item.label}</span>
                      {item.isNew ? <Badge>New</Badge> : null}
                      {item.isPro ? <Badge>Pro</Badge> : null}
                    </Link>
                  );
                })
              : null}
          </div>
        ))}
      </nav>
    </>
  );
}

function LibrarySidebar() {
  return (
    <aside className="sticky top-3 m-3 hidden h-[calc(100vh-24px)] w-[260px] shrink-0 flex-col gap-3 overflow-hidden rounded-3xl border border-border-button-white bg-background-secondary-default p-3 shadow-sidebar lg:flex">
      <LibrarySidebarContent />
    </aside>
  );
}

function DocsSidebarContent({ onNavigate }: { onNavigate?: () => void }) {
  const pathname = usePathname() ?? "/";
  const path = pathname.replace(/\/+$/, "") || "/";
  return (
    <>
      <Link
        href="/"
        onClick={onNavigate}
        className="flex items-center gap-2 outline-none focus-visible:ring-2 focus-visible:ring-border-focus-ring"
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/brand/boardui_logo.png" alt="BoardUI" width={20} height={20} className="shrink-0" />
        <span className="text-title-3-semibold text-text-primary">BoardUI</span>
      </Link>
      <nav className="mt-8 flex flex-col gap-8" aria-label="Docs">
        {DOCS_NAV.map((section) => (
          <div key={section.title} className="flex flex-col gap-2">
            <span className="text-caption-1-semibold tracking-wide text-text-tertiary uppercase">{section.title}</span>
            <ul className="flex flex-col gap-0.5">
              {section.items.map((item) => {
                const active = item.href === path;
                return (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      onClick={onNavigate}
                      aria-current={active ? "page" : undefined}
                      className={cx(
                        "block rounded-md px-2 py-1 text-body-medium transition-colors outline-none hover:bg-background-secondary-hover hover:text-text-primary focus-visible:ring-2 focus-visible:ring-border-focus-ring",
                        active ? "bg-background-secondary-hover text-text-primary" : "text-text-secondary",
                      )}
                    >
                      {item.label}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </nav>
      <div className="mt-auto pt-8">
        <ThemeToggle />
      </div>
    </>
  );
}

function DocsSidebar() {
  return (
    <aside className="hidden w-56 shrink-0 lg:flex lg:flex-col">
      <DocsSidebarContent />
    </aside>
  );
}

function LibraryBreadcrumb({ title }: { title: string }) {
  const pathname = usePathname() ?? "/";
  const path = pathname.replace(/\/+$/, "") || "/";
  const isIndex = path === "/components";
  // The original links the parent crumb to /components in both cases —
  // "Docs" on /installation etc. is its own quirk, kept verbatim.
  const parentLabel = /^\/(installation|mcp|skill|rtl|getting-started)/.test(path) ? "Docs" : "Components";
  return (
    <nav
      aria-label="Documentation"
      className="flex w-full min-w-0 flex-1 items-center overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
    >
      <ol className="flex items-center gap-2.5 px-1">
        <li className="flex items-center">
          <Link
            href="/"
            className="-mx-1 flex items-center gap-1.5 rounded-md px-1 py-0.5 text-caption-1-medium whitespace-nowrap text-text-tertiary transition-colors duration-150 ease outline-none hover:bg-background-primary-hover hover:text-text-secondary focus-visible:ring-2 focus-visible:ring-border-focus-ring"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/brand/boardui_logo.png" alt="BoardUI" width={16} height={16} className="shrink-0" />
            Board UI
          </Link>
        </li>
        {isIndex ? null : (
          <>
            <svg viewBox="0 0 12 12" fill="none" aria-hidden className="size-3 shrink-0 text-text-tertiary rtl:rotate-180">
              <path d="M4.5 3L7.14645 5.64645C7.34171 5.84171 7.34171 6.15829 7.14645 6.35355L4.5 9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
            <li className="flex items-center">
              <Link
                href="/components"
                className="-mx-1 flex items-center gap-1.5 rounded-md px-1 py-0.5 text-caption-1-medium whitespace-nowrap text-text-tertiary transition-colors duration-150 ease outline-none hover:bg-background-primary-hover hover:text-text-secondary focus-visible:ring-2 focus-visible:ring-border-focus-ring"
              >
                {parentLabel}
              </Link>
            </li>
          </>
        )}
        <svg viewBox="0 0 12 12" fill="none" aria-hidden className="size-3 shrink-0 text-text-tertiary rtl:rotate-180">
          <path d="M4.5 3L7.14645 5.64645C7.34171 5.84171 7.34171 6.15829 7.14645 6.35355L4.5 9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        </svg>
        <li aria-current="page" className="flex items-center gap-1.5 text-caption-1-medium whitespace-nowrap text-text-secondary">
          {title}
        </li>
      </ol>
    </nav>
  );
}

type TocItem = { id: string; label: string };

function useToc(contentRef: React.RefObject<HTMLDivElement | null>, enabled: boolean) {
  const [items, setItems] = useState<TocItem[]>([]);
  const [current, setCurrent] = useState<string>("");

  useEffect(() => {
    if (!enabled) return;
    const root = contentRef.current;
    if (!root) return;
    const used = new Set<string>();
    const found: TocItem[] = [];
    root.querySelectorAll("h2").forEach((heading) => {
      // Doc sections only: a section's own heading (direct child of
      // <section>, or the section-heading type style). Demo internals also
      // render h2s (e.g. the date picker's "Meeting date, August 2026"
      // calendar heading) and must not enter the TOC.
      const isSectionHeading =
        heading.parentElement?.tagName === "SECTION" ||
        heading.classList.contains("text-title-2-medium");
      if (!isSectionHeading) return;
      const label = (heading.textContent ?? "").trim();
      if (!label) return;
      let id = heading.id;
      if (!id) {
        const base = slugify(label);
        id = base;
        let n = 2;
        while (used.has(id) || document.getElementById(id)) id = `${base}-${n++}`;
        heading.id = id;
      }
      used.add(id);
      found.push({ id, label });
    });
    setItems(found);
    setCurrent(found[0]?.id ?? "");
  }, [contentRef, enabled]);

  useEffect(() => {
    if (!enabled || items.length === 0) return;
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) setCurrent(entry.target.id);
        }
      },
      { rootMargin: "-80px 0px -70% 0px" },
    );
    items.forEach(({ id }) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, [items, enabled]);

  return { items, current };
}

function LibraryLayout({
  title,
  heading,
  actions,
  children,
  className,
  documentTitle,
  hideHeading,
  hidePrevNext,
}: Omit<DocsLayoutProps, "variant" | "eyebrow" | "footer">) {
  const pathname = usePathname() ?? "/";
  const contentRef = useRef<HTMLDivElement>(null);
  const { items: toc, current } = useToc(contentRef, true);
  const { prev, next } = hidePrevNext ? {} : prevNextFor(pathname);

  return (
    <div className={cx("flex min-h-screen w-full overflow-x-clip bg-background-full", className)}>
      <DocumentTitle title={documentTitle} />
      <LibrarySidebar />
      <div className="min-w-0 flex-1">
        <div className="component-detail mx-auto flex w-full max-w-[1560px] justify-center gap-12 px-6 pt-10 pb-14 sm:px-10">
          {/* relative + overflow-x-clip: AppShell's <main> was `relative …
 * overflow-x-hidden`. Some demos (e.g. date-picker's Meeting scheduler
 * preview) are absolutely positioned with no positioned ancestor, so the
 * content column must be their containing block and clip them — otherwise
 * they escape onto the sidebar and widen the document at 390px. */}
          <main className="relative flex w-full min-w-0 max-w-[1220px] flex-col gap-3 overflow-x-clip">
            <div className="flex flex-col gap-8">
              <div className="flex w-full flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex min-w-0 flex-1 items-center gap-2">
                  <DrawerTrigger>
                    <IconButton
                      icon={RiMenuLine}
                      size="medium"
                      aria-label="Open navigation"
                      className="lg:hidden"
                    />
                    <Drawer placement="start" size="sm" aria-label="Component library">
                      {({ close }) => (
                        <DrawerBody>
                          <LibrarySidebarContent onNavigate={close} />
                        </DrawerBody>
                      )}
                    </Drawer>
                  </DrawerTrigger>
                  <LibraryBreadcrumb title={title ?? ""} />
                </div>
                <div className="flex shrink-0 items-center gap-2">
                  <ThemeToggle collapsed />
                  <a
                    href="https://x.com/boardui"
                    target="_blank"
                    rel="noreferrer"
                    aria-label="Follow BoardUI on X"
                    className="relative inline-flex size-9 shrink-0 items-center justify-center overflow-visible rounded-2lg border border-border-button-default bg-background-primary-default text-foreground-icon-secondary shadow-xs transition-[background-color,border-color,box-shadow,color] duration-150 ease outline-none select-none hover:bg-background-primary-hover hover:border-border-button-hover hover:text-foreground-icon-primary focus-visible:ring-2 focus-visible:ring-border-focus-ring focus-visible:ring-offset-2"
                  >
                    <RiTwitterXFill className="size-5 shrink-0" aria-hidden />
                  </a>
                  <a
                    href="https://discord.gg/azcHkw8T6F"
                    target="_blank"
                    rel="noreferrer"
                    aria-label="Join the BoardUI Discord"
                    className="relative inline-flex size-9 shrink-0 items-center justify-center overflow-visible rounded-2lg border border-border-button-default bg-background-primary-default text-foreground-icon-secondary shadow-xs transition-[background-color,border-color,box-shadow,color] duration-150 ease outline-none select-none hover:bg-background-primary-hover hover:border-border-button-hover hover:text-foreground-icon-primary focus-visible:ring-2 focus-visible:ring-border-focus-ring focus-visible:ring-offset-2"
                  >
                    <RiDiscordFill className="size-5 shrink-0" aria-hidden />
                  </a>
                  <a
                    href="https://github.com/BoardUI/boardui"
                    target="_blank"
                    rel="noreferrer"
                    aria-label="BoardUI on GitHub"
                    className="relative hidden h-9 shrink-0 items-center justify-center gap-0.5 overflow-visible rounded-2lg border border-border-button-default bg-background-primary-default px-2 text-body-medium text-text-primary shadow-xs transition-[background-color,border-color,box-shadow,color] duration-150 ease outline-none select-none hover:bg-background-primary-hover hover:border-border-button-hover focus-visible:ring-2 focus-visible:ring-border-focus-ring focus-visible:ring-offset-2 sm:inline-flex"
                  >
                    <RiGithubFill className="size-5 shrink-0" aria-hidden />
                    <span className="inline-flex items-center justify-center px-1 shrink-0">
                      <span dir="ltr" className="tabular-nums" aria-hidden="true">
                        1,084
                      </span>
                    </span>
                  </a>
                  <GetProLink />
                </div>
              </div>
              <header className="flex flex-col gap-3">
                {hideHeading ? null : (
                  <h1 className="text-title-1-medium text-text-primary">{heading ?? title}</h1>
                )}
                {actions === undefined || actions === null ? null : <div className="flex flex-wrap items-center gap-2">{actions}</div>}
              </header>
              <div ref={contentRef} className="flex min-w-0 flex-col gap-4">
                {children}
              </div>
              {prev || next ? <PrevNext prev={prev} next={next} /> : null}
            </div>
          </main>
          {toc.length > 0 ? (
            <aside className="hidden w-[220px] shrink-0 xl:block">
              <div className="sticky top-10 translate-y-0.5">
                <nav aria-label="On this page" className="flex flex-col gap-3">
                  <p className="flex items-center gap-2 text-body-medium text-text-primary">
                    <RiListUnordered className="size-4 text-text-secondary" aria-hidden />
                    On this page
                  </p>
                  <ul className="flex flex-col border-s border-border-button-default">
                    {toc.map((item) => (
                      <li key={item.id} className="flex">
                        <a
                          href={`#${item.id}`}
                          aria-current={current === item.id ? "location" : undefined}
                          className={cx(
                            "-ml-px border-s-2 py-1.5 ps-4 text-body-medium transition-colors duration-150 ease",
                            current === item.id
                              ? "border-text-primary text-text-primary"
                              : "border-transparent text-text-secondary hover:text-text-primary",
                          )}
                        >
                          {item.label}
                        </a>
                      </li>
                    ))}
                  </ul>
                </nav>
              </div>
            </aside>
          ) : null}
        </div>
        <div className="mx-auto w-full max-w-[1200px] px-6 pb-14 sm:px-10">
          <SiteFooter />
        </div>
      </div>
    </div>
  );
}

function DocsVariantLayout({
  title,
  heading,
  children,
  className,
  documentTitle,
  eyebrow,
  hideHeading,
}: Omit<DocsLayoutProps, "variant" | "hidePrevNext" | "footer">) {
  return (
    <div className={cx("flex min-h-full flex-col overflow-x-clip bg-background-full", className)}>
      <DocumentTitle title={documentTitle} />
      <div className="mx-auto flex w-full max-w-6xl flex-1 flex-col px-8 py-12">
        <div className="mb-6 flex items-center gap-2 lg:hidden">
          <DrawerTrigger>
            <IconButton
              icon={RiMenuLine}
              size="medium"
              aria-label="Open navigation"
              className="lg:hidden"
            />
            <Drawer placement="start" size="sm" aria-label="Docs">
              {({ close }) => (
                <DrawerBody>
                  <DocsSidebarContent onNavigate={close} />
                </DrawerBody>
              )}
            </Drawer>
          </DrawerTrigger>
        </div>
        <div className="flex w-full flex-1 gap-12">
          <DocsSidebar />
          <article className="relative min-w-0 max-w-3xl flex-1 overflow-x-clip">
            <div className="flex flex-col gap-6">
              {eyebrow ? (
                <span className="text-caption-1-semibold tracking-wide text-text-tertiary uppercase">{eyebrow}</span>
              ) : null}
              {hideHeading ? null : (
                <h1 className="text-title-1-medium text-text-primary">{heading ?? title}</h1>
              )}
              {children}
            </div>
          </article>
        </div>
        <SiteFooter />
      </div>
    </div>
  );
}

function MarketingVariantLayout({
  title,
  heading,
  children,
  className,
  documentTitle,
  hideHeading,
  footer = true,
}: Omit<DocsLayoutProps, "variant" | "eyebrow" | "hidePrevNext">) {
  return (
    <div className={cx("flex min-h-screen flex-col overflow-x-clip bg-background-full", className)}>
      <DocumentTitle title={documentTitle} />
      <MarketingNav />
      <main className="mx-auto flex w-full max-w-[1200px] flex-1 flex-col gap-10 px-6 py-12 sm:gap-14 sm:py-16">
        {!hideHeading && (heading ?? title) ? (
          <h1 className="text-title-1-medium text-text-primary">{heading ?? title}</h1>
        ) : null}
        {children}
      </main>
      {footer ? (
        <div className="mx-auto w-full max-w-[1200px] px-6">
          <SiteFooter />
        </div>
      ) : null}
    </div>
  );
}

export function DocsLayout(props: DocsLayoutProps) {
  const { variant = "library" } = props;
  if (variant === "docs") return <DocsVariantLayout {...props} />;
  if (variant === "marketing") return <MarketingVariantLayout {...props} />;
  return <LibraryLayout {...props} />;
}
