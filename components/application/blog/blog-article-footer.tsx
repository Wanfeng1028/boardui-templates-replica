"use client";

import Link from "next/link";
import { RiArrowLeftLine, RiArrowRightLine, RiDiscordFill, RiGithubFill, RiTwitterXFill } from "@remixicon/react";

import { ButtonLink } from "@/components/base/buttons/button";
import { LOCALES, chromeString, localizedHrefFor, sidebarLabel, type SiteLocale } from "@/components/application/docs/locale-chrome";

/**
 * Shared tail for the two blog articles, mirroring boardui.com/blog/*:
 * the BoardUI CTA card, the "More from the blog" section, and the site
 * footer (brand blurb + six link columns + bottom bar).
 *
 * Links point at this site's own routes. Original links with no local
 * route (/llms.txt, /privacy, /terms, /license) are plain text, not links
 * — the same convention the article pages use for outside links. The
 * original "Get Pro" and "Affiliate" controls are buttons on boardui.com;
 * here "Get Pro" goes to the local Install Pro page and "Affiliate" is
 * plain text.
 */

export type BlogPostMeta = {
  slug: string;
  category: string;
  date: string;
  readTime: string;
  title: string;
  excerpt: string;
  cover: string;
};

export const BLOG_POSTS: BlogPostMeta[] = [
  {
    slug: "best-react-design-systems",
    category: "Comparisons",
    date: "Nov 1, 2026",
    readTime: "19 min read",
    title: "The 10 best React design systems and component libraries in 2026",
    excerpt:
      "Compare the 10 best React design systems in 2026: what each one is best for, key features, pros and cons, and pricing. BoardUI is our product and our pick.",
    cover: "https://www.boardui.com/blog/best-react-design-systems/cover-components.png",
  },
  {
    slug: "react-design-system-for-agentic-products",
    category: "Agentic UI",
    date: "Oct 28, 2026",
    readTime: "5 min read",
    title: "A React design system for agentic products",
    excerpt:
      "Many agent products still ship with interfaces that feel like prototypes. BoardUI gives you ready-made React components for agent workflows and dashboards, which you can install through MCP or CLI.",
    cover: "https://www.boardui.com/blog/react-design-system-for-agentic-products/cover.png",
  },
];

/** The end-of-article CTA card from boardui.com/blog/*. */
export function ArticleCta() {
  return (
    <div className="flex flex-col gap-5 rounded-3xl border border-border-button-default bg-background-primary-default p-6 sm:p-8 dark:bg-background-secondary-default">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src="/brand/boardui_logo_circle.webp" alt="BoardUI" width={36} height={36} className="size-9 shrink-0" />
      <div className="flex flex-col gap-2">
        <p className="text-title-3-medium text-text-primary">Build dashboards and agentic interfaces with BoardUI</p>
        <p className="text-body-regular text-pretty text-text-secondary">
          103 React and Tailwind CSS components, 19 chart cards and 10 Pro templates. Install them with one
          command and own every line of the source.
        </p>
      </div>
      <div className="flex flex-wrap items-center gap-2">
        <ButtonLink href="/components" variant="primary" size="medium" trailingIcon={RiArrowRightLine}>
          Browse components
        </ButtonLink>
        <ButtonLink href="/components/pro-installation" variant="secondary" size="medium">
          Get Pro
        </ButtonLink>
      </div>
    </div>
  );
}

function PostCard({ post }: { post: BlogPostMeta }) {
  return (
    <Link
      href={`/blog/${post.slug}`}
      className="group flex w-full flex-col gap-3 rounded-3xl border border-border-button-default bg-background-primary-default p-4 outline-none transition-colors hover:bg-background-secondary-default focus-visible:ring-2 focus-visible:ring-border-focus-ring"
    >
      <span className="block overflow-hidden rounded-2xl border border-separator-border bg-background-secondary-default">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={post.cover}
          alt=""
          className="aspect-[16/9] w-full object-cover transition-transform group-hover:scale-[1.02]"
        />
      </span>
      <span className="flex flex-col gap-2 px-1 pb-1">
        <span className="flex flex-wrap items-center gap-2">
          <span className="rounded-full border border-border-button-default bg-background-secondary-default px-2.5 py-0.5 text-caption-1-semibold text-text-secondary">
            {post.category}
          </span>
          <span className="text-caption-1-regular text-text-tertiary">
            {post.date} · {post.readTime}
          </span>
        </span>
        <span className="text-title-3-semibold text-text-primary">{post.title}</span>
        <span className="text-body-2-regular text-text-secondary">{post.excerpt}</span>
        <span className="inline-flex items-center gap-1.5 text-body-2-medium text-text-secondary transition-colors group-hover:text-text-primary">
          Read article
          <RiArrowRightLine className="size-4 transition-transform group-hover:translate-x-0.5" aria-hidden />
        </span>
      </span>
    </Link>
  );
}

/** "More from the blog" — the other post, as on boardui.com/blog/*. */
export function MoreFromBlog({ currentSlug }: { currentSlug: string }) {
  const others = BLOG_POSTS.filter((p) => p.slug !== currentSlug);
  return (
    <section className="mt-20 flex flex-col gap-2" aria-labelledby="more-posts">
      <div className="flex items-center justify-between gap-4 border-b border-separator-border pb-4">
        <h2 id="more-posts" className="text-title-3-medium text-text-primary">
          More from the blog
        </h2>
        <Link
          href="/blog"
          className="inline-flex items-center gap-1 text-body-medium text-text-secondary transition-colors hover:text-text-primary"
        >
          <RiArrowLeftLine className="size-4 rtl:-scale-x-100" aria-hidden />
          All posts
        </Link>
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        {others.map((post) => (
          <PostCard key={post.slug} post={post} />
        ))}
      </div>
    </section>
  );
}

type FooterLink = { label: string; href?: string };

const FOOTER_COLUMNS: { title: string; links: FooterLink[] }[] = [
  {
    title: "Components",
    links: [
      { label: "Data Table", href: "/components/data-table" },
      { label: "Data Grid", href: "/components/data-grid" },
      { label: "Date Picker", href: "/components/date-picker" },
      { label: "Calendar", href: "/components/calendar" },
      { label: "Sidebar", href: "/components/sidebar" },
      { label: "Select", href: "/components/select" },
      { label: "File Upload", href: "/components/file-upload" },
      { label: "Theme Toggle", href: "/components/theme-toggle" },
      { label: "View all (103)", href: "/components" },
    ],
  },
  {
    title: "Charts",
    links: [
      { label: "Line Chart", href: "/components/line-chart-card" },
      { label: "Area Chart", href: "/components/area-chart-card" },
      { label: "Orders Chart", href: "/components/orders-chart-card" },
      { label: "Revenue Chart", href: "/components/revenue-chart-card" },
      { label: "Sankey Chart", href: "/components/sankey-chart-card" },
      { label: "Funnel Chart", href: "/components/funnel-chart-card" },
      { label: "Radar Chart", href: "/components/radar-chart-card" },
      { label: "Heatmap Chart", href: "/components/heatmap-chart-card" },
      { label: "View all (19)", href: "/components#charts" },
    ],
  },
  {
    title: "Agentic",
    links: [
      { label: "AI Chat", href: "/components/ai-chat" },
      { label: "Multi-agent Chat", href: "/components/multi-agent-chat" },
      { label: "Chat Starter", href: "/components/chat-starter" },
      { label: "Composer", href: "/components/composer" },
      { label: "Agent Thinking", href: "/components/agent-thinking" },
      { label: "Agent Progress", href: "/components/agent-progress" },
      { label: "Task List", href: "/components/task-list" },
      { label: "Agent Creator", href: "/components/agent-creator" },
    ],
  },
  {
    title: "Templates",
    links: [
      { label: "Home Dashboard", href: "/components/home-dashboard" },
      { label: "Finance Dashboard", href: "/components/finance-dashboard" },
      { label: "Marketing Dashboard", href: "/components/marketing-dashboard" },
      { label: "HR Management", href: "/components/hr-management" },
      { label: "Project Board", href: "/components/project-board" },
      { label: "Medical Profile", href: "/components/medical-profile" },
      { label: "AI Image Generation", href: "/components/ai-image-generation" },
      { label: "AI Profile", href: "/components/ai-profile" },
      { label: "View all (10)", href: "/components#templates" },
    ],
  },
  {
    title: "Resources",
    links: [
      { label: "Getting started", href: "/getting-started" },
      { label: "Installation", href: "/installation" },
      { label: "CLI", href: "/docs/cli" },
      { label: "MCP Server", href: "/mcp" },
      { label: "Agent Skills", href: "/skill" },
      { label: "RTL Support", href: "/rtl" },
      { label: "Blog", href: "/blog" },
      { label: "llms.txt" },
    ],
  },
  {
    title: "Company",
    links: [
      { label: "Pricing", href: "/pricing" },
      { label: "Install Pro", href: "/components/pro-installation" },
      { label: "Contact", href: "mailto:hi@boardui.com" },
    ],
  },
];

/** The site footer from boardui.com, as it appears under blog articles. */
export function SiteFooter({ locale = "en" }: { locale?: SiteLocale }) {
  return (
    <footer className="mt-20 flex flex-col gap-10 border-t border-separator-border pt-10 pb-4">
      <div className="flex flex-col gap-6">
        <p className="max-w-md text-body-regular text-text-secondary">
          {chromeString(
            "BoardUI is a dashboard design system and UI kit for React + Tailwind CSS, with data tables, charts and dashboard templates, designed in Figma.",
            locale,
          )}
        </p>
        <div className="flex flex-wrap items-center gap-2">
          <a
            href="https://x.com/boardui"
            target="_blank"
            rel="noreferrer"
            aria-label={chromeString("Follow BoardUI on X", locale)}
            className="relative inline-flex size-9 shrink-0 items-center justify-center overflow-visible rounded-2lg border border-border-button-default bg-background-primary-default text-foreground-icon-secondary shadow-xs transition-[background-color,border-color,box-shadow,color] duration-150 ease outline-none select-none hover:bg-background-primary-hover hover:border-border-button-hover hover:text-foreground-icon-primary focus-visible:ring-2 focus-visible:ring-border-focus-ring focus-visible:ring-offset-2"
          >
            <RiTwitterXFill className="size-5 shrink-0" aria-hidden />
          </a>
          <a
            href="https://discord.gg/azcHkw8T6F"
            target="_blank"
            rel="noreferrer"
            aria-label={chromeString("Join the BoardUI Discord", locale)}
            className="relative inline-flex size-9 shrink-0 items-center justify-center overflow-visible rounded-2lg border border-border-button-default bg-background-primary-default text-foreground-icon-secondary shadow-xs transition-[background-color,border-color,box-shadow,color] duration-150 ease outline-none select-none hover:bg-background-primary-hover hover:border-border-button-hover hover:text-foreground-icon-primary focus-visible:ring-2 focus-visible:ring-border-focus-ring focus-visible:ring-offset-2"
          >
            <RiDiscordFill className="size-5 shrink-0" aria-hidden />
          </a>
          <a
            href="https://github.com/BoardUI/boardui"
            target="_blank"
            rel="noreferrer"
            aria-label={chromeString("BoardUI on GitHub", locale)}
            className="relative inline-flex h-9 shrink-0 items-center justify-center gap-0.5 overflow-visible rounded-2lg border border-border-button-default bg-background-primary-default px-2 text-body-medium text-text-primary shadow-xs transition-[background-color,border-color,box-shadow,color] duration-150 ease outline-none select-none hover:bg-background-primary-hover hover:border-border-button-hover focus-visible:ring-2 focus-visible:ring-border-focus-ring focus-visible:ring-offset-2"
          >
            <RiGithubFill className="size-5 shrink-0" aria-hidden />
            <span className="inline-flex items-center justify-center px-1 shrink-0">
              <span dir="ltr" className="tabular-nums" aria-hidden="true">
                1,084
              </span>
            </span>
          </a>
        </div>
        <ButtonLink
          href={localizedHrefFor("/components/pro-installation", locale)}
          variant="secondary"
          size="medium"
          className="w-fit"
        >
          {chromeString("Get Pro", locale)}
        </ButtonLink>
      </div>
      <nav aria-label="Footer" className="grid grid-cols-2 gap-x-6 gap-y-10 md:grid-cols-3 lg:grid-cols-6">
        {FOOTER_COLUMNS.map((column) => (
          <div key={column.title} className="flex flex-col gap-3">
            <h2
              id={
                column.title === "Components"
                  ? "footer-components"
                  : column.title === "Charts"
                    ? "footer-charts"
                    : column.title === "Agentic"
                      ? "footer-agentic"
                      : column.title === "Templates"
                        ? "footer-templates"
                        : undefined
              }
              className="text-caption-1-semibold tracking-wide text-text-tertiary uppercase"
            >
              {sidebarLabel(column.title, locale)}
            </h2>
            <ul className="flex flex-col gap-2">
              {column.links.map((link) => (
                <li key={link.label}>
                  {link.href ? (
                    <Link
                      href={localizedHrefFor(link.href, locale)}
                      className="text-body-regular whitespace-nowrap text-text-secondary transition-colors hover:text-text-primary"
                    >
                      {sidebarLabel(link.label, locale)}
                    </Link>
                  ) : (
                    <span className="text-body-regular whitespace-nowrap text-text-secondary">
                      {sidebarLabel(link.label, locale)}
                    </span>
                  )}
                </li>
              ))}
              {column.title === "Company" && (
                <li>
                  <span className="inline-flex flex-wrap items-center gap-1.5 text-body-regular text-text-secondary">
                    {chromeString("Affiliate", locale)}
                    <span className="rounded-full bg-background-tertiary-default px-1.5 py-px text-caption-1-semibold text-text-secondary">
                      {chromeString("Earn 40%", locale)}
                    </span>
                  </span>
                </li>
              )}
            </ul>
          </div>
        ))}
      </nav>
      <div className="flex flex-wrap items-center justify-between gap-3 border-t border-separator-border pt-4">
        <span className="text-body-regular text-text-secondary">{LOCALES[locale].label}</span>
        <p className="text-body-regular text-text-secondary">
          © 2026 Board UI · <span>{chromeString("Privacy", locale)}</span> ·{" "}
          <span>{chromeString("Terms", locale)}</span> · <span>{chromeString("License", locale)}</span>
        </p>
      </div>
    </footer>
  );
}

/**
 * A captioned live figure inside a blog article, as on boardui.com/blog/*:
 * the component preview (or template embed) with the name, an optional Pro
 * badge, and a "Docs and install" link to the component's detail page.
 */
export function ArticleFigure({
  name,
  slug,
  pro = false,
  children,
}: {
  name: string;
  slug: string;
  pro?: boolean;
  children: React.ReactNode;
}) {
  return (
    <figure className="flex flex-col gap-3">
      {children}
      <figcaption className="flex flex-wrap items-center justify-between gap-2 px-1 text-body-regular text-text-secondary">
        <span className="flex items-center gap-2">
          <span className="text-text-primary">{name}</span>
          {pro ? (
            <span className="rounded-sm bg-background-tertiary-default px-1 py-px text-[10px] leading-4 font-semibold tracking-wide text-text-secondary uppercase">
              Pro
            </span>
          ) : null}
        </span>
        <Link
          href={`/components/${slug}`}
          className="group inline-flex items-center gap-1 text-body-medium text-text-secondary transition-colors hover:text-text-primary"
        >
          Docs and install
          <RiArrowRightLine
            className="size-4 transition-transform duration-150 group-hover:translate-x-0.5 rtl:-scale-x-100"
            aria-hidden
          />
        </Link>
      </figcaption>
    </figure>
  );
}

/** A captioned figure whose preview is a live template page in an iframe. */
export function TemplateFigure({ name, slug, src }: { name: string; slug: string; src: string }) {
  return (
    <ArticleFigure name={name} slug={slug} pro>
      <span className="block h-[480px] overflow-hidden rounded-3xl border border-border-button-default bg-background-secondary-default">
        <iframe
          src={src}
          title={`${name} preview`}
          loading="lazy"
          tabIndex={-1}
          aria-hidden
          className="pointer-events-none size-full border-0"
        />
      </span>
    </ArticleFigure>
  );
}
