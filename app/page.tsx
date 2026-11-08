import type { Metadata } from "next";

import { DocumentTitle } from "@/components/application/app-shell/document-title";
import { SiteFooter } from "@/components/application/blog/blog-article-footer";
import { MarketingNav } from "@/components/application/marketing/marketing-nav";
import { HomeHero } from "@/components/application/landing/home-hero";
import { HomeSections } from "@/components/application/landing/home-sections";

/**
 * Home is the marketing landing page, as on boardui.com: hero (ray field,
 * "React Design System for Agentic Interfaces", template preview) then the
 * component showcase, multi-agent template, composer loader, templates,
 * charts, pricing, MCP, GitHub free tier, FAQ, newsletter and final CTA,
 * closing with the site footer. Copy, order and links follow the original
 * homepage (SSR HTML captured 2026-11-08, verify/orig-home.html).
 *
 * The AI Chat app shell is NOT deleted — it still lives at
 * /templates/ai-chat; the home page simply stops being its shell. The
 * "Browse all templates" entry to /templates is kept in the hero preview
 * bar, the templates section and the final CTA.
 */
export const metadata: Metadata = {
  title: { absolute: "BoardUI - React Design System for Dashboards" },
  alternates: { canonical: "https://ui.gemmae.dev" },
  openGraph: {
    title: "BoardUI - React Design System for Dashboards",
    description:
      "Build agentic products and data-rich dashboards with 103 React components (19 chart cards), 10 Pro templates, Tailwind CSS, and editable source code.",
    type: "website",
    url: "https://ui.gemmae.dev",
    images: [
      {
        url: "/og_image.png",
        width: 1200,
        height: 630,
        alt: "BoardUI React design system components and dashboard templates",
      },
    ],
  },
};

export default function Page() {
  return (
    <div className="flex min-h-dvh flex-col bg-background-full">
      <DocumentTitle />
      <MarketingNav />
      <main className="flex flex-1 flex-col">
        <HomeHero />
        <HomeSections />
      </main>
      <div className="mx-auto w-full max-w-[1276px] px-3 sm:px-6">
        <SiteFooter />
      </div>
    </div>
  );
}
