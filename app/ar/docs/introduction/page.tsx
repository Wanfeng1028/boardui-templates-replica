"use client";

import Link from "next/link";
import { RiArrowLeftLine, RiArrowRightSLine } from "@remixicon/react";
import { DocsLayout } from "@/components/application/docs/docs-layout";
import { LocaleHtml } from "@/components/application/docs/locale-html";
import { LinkButton } from "@/components/base/buttons/link-button";

function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="space-y-4">
      <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-50">
        {title}
      </h2>
      {children}
    </section>
  );
}

export default function IntroductionPage() {
  return (
    <LocaleHtml locale="ar">
      <DocsLayout
        variant="docs"
        locale="ar"
        eyebrow="التوثيق · البدء"
        title="مقدمة"
      >
        <div className="space-y-8">
          <Section title="ما هو BoardUI؟">
            <p>
              BoardUI هو مجموعة مفتوحة المصدر من مكوّنات React مبنية باستخدام
              Tailwind CSS ومصمَّمة في Figma. تُترجم المكوّنات مباشرةً من ملف
              Figma الرئيسي عبر خادم Figma MCP، مما يبقي التصميم والشيفرة
              متزامنَين.
            </p>
            <p>تخطَّ مرحلة التصميم. فقط انسخ والصق وابنِ.</p>
          </Section>

          <Section title="مجموعة التقنيات">
            <ul className="list-disc space-y-2 pl-6">
              <li>React 19</li>
              <li>Next.js 16 (App Router) — لموقع العرض</li>
              <li>
                Tailwind CSS v4 (إعداد CSS-first عبر{" "}
                <code className="rounded bg-gray-100 px-1 py-0.5 font-mono text-sm dark:bg-gray-800">
                  @theme
                </code>
                )
              </li>
              <li>TypeScript</li>
              <li>
                React Aria Components — عناصر إمكانية الوصول الأساسية، تُضاف
                لكل مكوّن حسب الحاجة
              </li>
            </ul>
          </Section>

          <Section title="المجاني مقابل المدفوع">
            <ul className="list-disc space-y-2 pl-6">
              <li>
                <strong>المجاني</strong> — المكوّنات الأساسية (Button، Input،
                Checkbox، Badge، Avatar، إلخ). رخصة مرنة. مفتوح المصدر.
              </li>
              <li>
                <strong>Pro</strong> — كتل مركّبة، قوالب صفحات، أنماط معقدة
                (جداول بيانات، قوائم أوامر، مخططات، لوحات تحكم). رسوم ترخيص
                لمرة واحدة.
              </li>
            </ul>
          </Section>

          <Section title="مصدر لا تبعية">
            <p>
              BoardUI ليس مكتبة وقت تشغيل. عند إضافة مكوّن، تُنسخ شيفرته
              المصدرية إلى مشروعك — لا npm install، ولا ارتباط بمورّد معين.
              أنت تمتلك الشيفرة؛ عدّلها كما تشاء.
            </p>
          </Section>

          <Section title="كيف يُقارَن BoardUI بالمكتبات الأخرى">
            <p>
              بنينا نافذة الإعدادات نفسها باستخدام BoardUI وتسع مكتبات أخرى،
              من shadcn/ui إلى PrimeReact، واختبرنا كلًّا منها.
            </p>
            <p>
              اقرأ{" "}
              <Link
                href="/blog/comparing-react-design-systems"
                className="font-medium text-blue-600 underline underline-offset-4 hover:text-blue-500 dark:text-blue-500"
              >
                مقارنتنا لأفضل 10 أنظمة تصميم لـ React
              </Link>{" "}
              (بالإنجليزية).
            </p>
          </Section>

          <Section title="الخطوات التالية">
            <p>
              توجّه إلى{" "}
              <Link
                href="/installation"
                className="font-medium text-blue-600 underline underline-offset-4 hover:text-blue-500 dark:text-blue-500"
              >
                دليل التثبيت
              </Link>{" "}
              لإعداد مشروع، أو تصفح{" "}
              <Link
                href="/components"
                className="font-medium text-blue-600 underline underline-offset-4 hover:text-blue-500 dark:text-blue-500"
              >
                معرض المكوّنات
              </Link>
              .
            </p>
            <div className="flex flex-wrap gap-3">
              <LinkButton href="/installation">دليل التثبيت</LinkButton>
              <LinkButton href="/components">معرض المكوّنات</LinkButton>
            </div>
          </Section>

          <Link
            href="/components"
            className="inline-flex items-center gap-1 text-sm font-medium text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-50"
          >
            <RiArrowLeftLine className="size-4" aria-hidden="true" />
            العودة إلى جميع المكوّنات
          </Link>
        </div>
      </DocsLayout>
    </LocaleHtml>
  );
}
