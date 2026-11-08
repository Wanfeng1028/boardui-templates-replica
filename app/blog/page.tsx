"use client";

import { RiArrowRightLine, RiRssFill } from "@remixicon/react";
import Link from "next/link";

import { DocsLayout } from "@/components/application/docs/docs-layout";
import { BLOG_POSTS as POSTS } from "@/components/application/blog/blog-article-footer";

/**
 * Blog index — mirrors boardui.com/blog.
 * Cover images are hot-linked from the original site (not downloaded).
 */

export default function BlogIndexPage() {
  return (
    <DocsLayout variant="marketing" title="Blog" heading="Blog">
      <div className="flex flex-col gap-8 pb-8">
        <p className="text-body-regular text-text-secondary">
          Guides, comparisons and notes on building dashboards and agentic interfaces with React and Tailwind CSS,
          from the team behind BoardUI.
        </p>
        <a
          href="/blog/rss.xml"
          className="inline-flex w-fit items-center gap-1.5 text-body-medium text-text-secondary transition-colors hover:text-text-primary"
        >
          <RiRssFill className="size-4" aria-hidden />
          RSS feed
        </a>
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
    </DocsLayout>
  );
}
