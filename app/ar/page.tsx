import type { Metadata } from "next";

import { DocumentTitle } from "@/components/application/app-shell/document-title";
import { LocaleHtml } from "@/components/application/docs/locale-html";
import { HomeHero } from "@/components/application/landing/home-hero";
import { localizeHomeData } from "@/components/application/landing/home-locale";
import { HomeSections } from "@/components/application/landing/home-sections";
import { MarketingNav } from "@/components/application/marketing/marketing-nav";
import { SiteFooter } from "@/components/application/blog/blog-article-footer";

const locale = "ar" as const;

export const metadata: Metadata = {
  title: { absolute: "BoardUI - نظام تصميم React للوحات التحكم" },
  alternates: {
    canonical: "https://ui.gemmae.dev/ar",
  },
  openGraph: {
    title: { absolute: "BoardUI - نظام تصميم React للوحات التحكم" },
    description:
      "BoardUI نظام تصميم لـ React يضم 103 مكوّنًا فريدًا، منها 19 مخططًا بيانيًا، بالإضافة إلى 10 قوالب Pro وأكثر من 400 رمز تصميم، مصمّمة في Figma.",
    type: "website",
    url: "https://ui.gemmae.dev/ar",
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
    <LocaleHtml locale="ar">
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
