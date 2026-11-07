"use client";

import { RiArrowRightLine, RiArticleLine } from "@remixicon/react";
import Link from "next/link";

import { AppShell } from "@/components/application/app-shell/app-shell";

/**
 * Blog index — mirrors boardui.com/blog.
 * Cover images are hot-linked from the original site (not downloaded).
 */

const POSTS = [
  {
    slug: "best-react-design-systems",
    category: "Comparisons",
    date: "Nov 1, 2026",
    readTime: "9 min read",
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

export default function BlogIndexPage() {
  return (
    <AppShell title="Blog" heading="Blog" icon={RiArticleLine} actions={null} columnClassName="max-w-[964px]">
      <div className="flex flex-col gap-8 pb-8">
        <p className="text-body-regular text-text-secondary">
          Notes on building React interfaces for agentic products — comparisons, component
          walkthroughs, and what we noticed while building with each library.
        </p>
        <div className="grid w-full grid-cols-1 gap-4 sm:grid-cols-2">
          {POSTS.map((post) => (
            <Link
              key={post.slug}
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
          ))}
        </div>
      </div>
    </AppShell>
  );
}
