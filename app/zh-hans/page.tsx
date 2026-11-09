import type { Metadata } from "next";
import { DocumentTitle } from "@/components/application/app-shell/document-title";
import { LocaleHtml } from "@/components/application/docs/locale-html";
import { HomeHero } from "@/components/application/landing/home-hero";
import { localizeHomeData } from "@/components/application/landing/home-locale";
import { HomeSections } from "@/components/application/landing/home-sections";
import { MarketingNav } from "@/components/application/marketing/marketing-nav";
import { SiteFooter } from "@/components/application/blog/blog-article-footer";

const locale = "zh-hans" as const;

export const metadata: Metadata = {
  title: { absolute: "BoardUI — 面向仪表盘的 React 设计系统" },
  alternates: { canonical: "https://ui.gemmae.dev/zh-hans" },
  openGraph: {
    title: { absolute: "BoardUI — 面向仪表盘的 React 设计系统" },
    description:
      "BoardUI 是一个在 Figma 中设计的 React 设计系统，包含 103 个独立组件，其中有 19 个数据图表，另有 10 个 Pro 模板和 400 多个设计变量。",
    type: "website",
    url: "https://ui.gemmae.dev/zh-hans",
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
    <LocaleHtml locale="zh-hans">
      <div className="flex min-h-dvh flex-col bg-background-full">
        <DocumentTitle />
        <MarketingNav locale={locale} />
        <main className="flex flex-1 flex-col">
          <HomeHero locale={locale} data={localizeHomeData(locale)} />
          <HomeSections locale={locale} data={localizeHomeData(locale)} />
        </main>
        <div className="mx-auto w-full max-w-[1276px] px-3 sm:px-6">
          <SiteFooter locale={locale} />
        </div>
      </div>
    </LocaleHtml>
  );
}
