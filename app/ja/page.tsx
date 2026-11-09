import type { Metadata } from "next";
import { DocumentTitle } from "@/components/application/app-shell/document-title";
import { LocaleHtml } from "@/components/application/docs/locale-html";
import { HomeHero } from "@/components/application/landing/home-hero";
import { localizeHomeData } from "@/components/application/landing/home-locale";
import { HomeSections } from "@/components/application/landing/home-sections";
import { MarketingNav } from "@/components/application/marketing/marketing-nav";
import { SiteFooter } from "@/components/application/blog/blog-article-footer";

const locale = "ja" as const;

export const metadata: Metadata = {
  title: { absolute: "BoardUI — ダッシュボード向けReactデザインシステム" },
  alternates: { canonical: "https://ui.gemmae.dev/ja" },
  openGraph: {
    title: { absolute: "BoardUI — ダッシュボード向けReactデザインシステム" },
    description:
      "BoardUIは、Figmaで設計されたReactデザインシステムです。19種類のデータチャートを含む103種類のコンポーネント、10種類のProテンプレート、400以上のデザイントークンを備えています。",
    type: "website",
    url: "https://ui.gemmae.dev/ja",
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
    <LocaleHtml locale="ja">
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
