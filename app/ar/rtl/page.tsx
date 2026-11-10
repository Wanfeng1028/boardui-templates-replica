"use client";

import { RiArrowRightSLine } from "@remixicon/react";

import { DocsLayout } from "@/components/application/docs/docs-layout";
import { PkgCommand } from "@/components/application/docs/code-tabs";
import { PrevNext } from "@/components/application/docs/prev-next";
import { LinkButton } from "@/components/base/buttons/link-button";
import { LocaleHtml } from "@/components/application/docs/locale-html";
import { RtlComponentDemo, RtlProviderDemo, RtlTemplateDemo } from "../../rtl/rtl-demos";

function Section({ id, title, children }: { id: string; title: string; children: React.ReactNode }) {
  return (
    <section id={id} className="flex scroll-mt-14 flex-col gap-3">
      <h2 className="text-title-2-medium text-text-primary">{title}</h2>
      {children}
    </section>
  );
}

function SubSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-2">
      <h3 className="text-title-3-semibold text-text-primary">{title}</h3>
      {children}
    </div>
  );
}

function CodeBlock({ code }: { code: string }) {
  return (
    <pre dir="ltr" className="overflow-x-auto rounded-xl border border-border-button-default bg-background-secondary-default p-4 font-mono text-caption-1-medium leading-6 text-text-primary">
      {code}
    </pre>
  );
}

const LAYOUT_CODE = `import { DirectionProvider } from "@/components/foundations/direction/direction";
import "@/styles/globals.css";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ar" dir="rtl">
      <body>
        <DirectionProvider locale="ar">{children}</DirectionProvider>
      </body>
    </html>
  );
}`;

const MIXED_CODE = `// Works in Next.js, Vite, React Router, and other React apps.
<DirectionProvider locale="he">
  <AccountSettings />
</DirectionProvider>

// Providers can be nested for a region in another language.
<DirectionProvider locale="ar">
  <Dashboard />
  <DirectionProvider locale="en-US">
    <EnglishSupportPanel />
  </DirectionProvider>
</DirectionProvider>`;

const DIRECTION_SOURCE = `// components/foundations/direction/direction.tsx
"use client";

import type { HTMLAttributes, ReactNode } from "react";
import { I18nProvider, useLocale } from "react-aria-components";
import { cx } from "@/utils/cx";

export type Direction = "ltr" | "rtl";

export interface DirectionProviderProps extends Omit<HTMLAttributes<HTMLDivElement>, "dir" | "lang" | "children"> {
  /** BCP 47 language tag. Arabic and Hebrew resolve to RTL; Chinese to LTR. */
  locale: string;
  children: ReactNode;
}

/** Keeps CSS direction, React Aria keyboard behavior and portalled menus in sync.
 * Use at the app root, or nest providers for regions in another language.
 * The default display: contents boundary preserves the surrounding layout.
 */
export function DirectionProvider({ locale, ...props }: DirectionProviderProps) {
  return (
    <I18nProvider locale={locale}>
      <DirectionBoundary {...props} />
    </I18nProvider>
  );
}

function DirectionBoundary({ children, className, ...props }: Omit<DirectionProviderProps, "locale">) {
  const { locale, direction } = useLocale();
  return <div {...props} lang={locale} dir={direction} className={cx("contents", className)}>{children}</div>;
}

/** Also works inside a React Aria I18nProvider. */
export function useDirection(): Direction {
  return useLocale().direction;
}`;

const MIXED_CONTENT_CODE = `<Input label="البريد الإلكتروني" type="email" /> // value defaults to LTR
<Input label="الاسم" inputDir="auto" />

<p>تم إرسال رسالة إلى <bdi>sara@example.com</bdi></p>
<pre dir="ltr"><code>npm run build</code></pre>`;

const PORTAL_CODE = `import { createPortal } from "react-dom";
import { useDirection } from "@/components/foundations/direction/direction";

function CustomOverlay() {
  const direction = useDirection();
  return createPortal(<div dir={direction}>…</div>, document.body);
}`;

/** RTL Support page, mirroring boardui.com/rtl. */
export default function RtlPage() {
  return (
    <LocaleHtml locale="ar">
      <DocsLayout variant="library" hidePrevNext locale="ar" title="دعم RTL">
        <div className="flex flex-col gap-8 pb-8">
          <div className="flex flex-col gap-3">
            <p className="text-body-regular text-text-secondary">
              يدعم BoardUI الكتابة من اليمين إلى اليسار بالكامل للغة العربية والعبرية وغيرها من اللغات التي تُكتب من اليمين إلى اليسار، وذلك عبر المكوّنات المجانية وكتل Pro والقوالب.
            </p>
          </div>

          <Section id="examples" title="أمثلة على المكوّنات">
            <p className="text-body-regular text-text-secondary">
              بدّل اللغات وجرّب عناصر التحكم. يتبع التخطيط واتجاه النص والتباعد وأسهم التنقل وسلوك شريط التمرير وموضع التراكب الاتجاه المحدد. تتضمن الأمثلة بطاقة مخطط Pro.
            </p>
            <RtlComponentDemo />
          </Section>

          <Section id="templates" title="أمثلة القوالب">
            <p className="text-body-regular text-text-secondary">
              استكشف القوالب الفعلية بمحتوى نموذجي بالعربية والعبرية والإنجليزية. بدّل اللغات لترى النصوص والتخطيط والتفاعلات معاً.
            </p>
            <RtlTemplateDemo />
          </Section>

          <Section id="direction-provider" title="موفّر الاتجاه">
            <p className="text-body-regular text-text-secondary">
              يُبقي تحديد اللغة الصريح اتجاه CSS، والتنقل بلوحة المفاتيح، والتقويمات، والقوائم المنبثقة متزامنة. يمكن تداخل الموفرين للمناطق متعددة اللغات؛ وتحافظ غلاف المحتوى الافتراضي على تخطيطك.
            </p>
            <RtlProviderDemo />
          </Section>

          <Section id="setup" title="إعداد RTL">
            <p className="text-body-regular text-text-secondary">
              ثبّت <code className="font-mono text-caption-1-medium text-text-primary">DirectionProvider</code> ،
              ثم اضبط لغة تطبيقك واتجاهه. لا حاجة إلى علامة CLI خاصة بـ RTL أو إصدار منفصل من المكوّن.
            </p>
            <PkgCommand
              npm="npx boardui@latest add direction"
              pnpm="pnpm dlx boardui@latest add direction"
              yarn="yarn dlx boardui@latest add direction"
            />
            <p className="text-caption-1-semibold text-text-secondary">app/layout.tsx</p>
            <CodeBlock code={LAYOUT_CODE} />
            <p className="text-body-regular text-text-secondary">
              <code className="font-mono text-caption-1-medium text-text-primary">locale=&quot;ar&quot;</code>{" "}
              يُحلّل إلى RTL. استخدم <code className="font-mono text-caption-1-medium text-text-primary">he</code>{" "}
              للعبرية، <code className="font-mono text-caption-1-medium text-text-primary">en-US</code> للإنجليزية،
              أو <code className="font-mono text-caption-1-medium text-text-primary">zh-CN</code> للصينية، التي
              تبقى من اليسار إلى اليمين. ضبط{" "}
              <code className="font-mono text-caption-1-medium text-text-primary">dir</code> وحده يحدّث CSS؛
              كما يُهيّئ المزوّد التنقل بلوحة المفاتيح عبر React Aria، والتقويمات، والقوائم المنبثقة.
            </p>
            <SubSection title="مناطق متعددة اللغات">
              <CodeBlock code={MIXED_CODE} />
            </SubSection>
            <p className="text-body-regular text-text-secondary">
              للتثبيت اليدوي، أكمل BoardUI setup ، وثبّت{" "}
              <code className="font-mono text-caption-1-medium text-text-primary">react-aria-components</code> ،
              ثم انسخ شفرة المزوّد أدناه.
            </p>
            <div>
              <LinkButton href="/installation" trailingIcon={RiArrowRightSLine}>
                إعداد BoardUI
              </LinkButton>
            </div>
            <p className="text-caption-1-semibold text-text-secondary">
components/foundations/direction/direction.tsx
            </p>
          <CodeBlock code={DIRECTION_SOURCE} />
        </Section>

        <Section id="existing-projects" title="المشاريع الحالية">
          <p className="text-body-regular text-text-secondary">
            يقوم BoardUI بتثبيت الشيفرة المصدرية في مشروعك. أضف المزوّد، ثم حدّث المكوّنات المثبّتة قبل دعم
            RTL. احتفظ بنسخة احتياطية من تخصيصاتك قبل استخدام{" "}
            <code className="font-mono text-caption-1-medium text-text-primary">--overwrite</code>، أو ادمج
            المصدر الحالي في ملفاتك المعدَّلة. حدِّث التبعيات المشتركة مثل الأزرار وأنماط القوائم والأيقونات
            وCSS العام إضافة إلى قالبك.
          </p>
          <PkgCommand
            npm="npx boardui@latest add button select tabs --overwrite"
            pnpm="pnpm dlx boardui@latest add button select tabs --overwrite"
            yarn="yarn dlx boardui@latest add button select tabs --overwrite"
          />
          <p className="text-body-regular text-text-secondary">
            تستخدم مكوّنات وقوالب Pro نفس المزوّد والأنماط المنطقية. ثبّت التحديثات عبر CLI المرخّص لديك، أو
            نزّل حزمة المصدر المحدّثة. يمكن لتطبيقك تغيير اللغة أثناء التشغيل دون إعادة تثبيت المكوّنات.
          </p>
        </Section>

        <Section id="directional-styles" title="أنماط الاتجاه">
          <p className="text-body-regular text-text-secondary">
            استخدام <code className="font-mono text-caption-1-medium text-text-primary">ps / pe</code>،{" "}
            <code className="font-mono text-caption-1-medium text-text-primary">ms / me</code>،{" "}
            <code className="font-mono text-caption-1-medium text-text-primary">start / end</code>، و{" "}
            <code className="font-mono text-caption-1-medium text-text-primary">text-start / text-end</code> في
            التخطيطات المخصصة. يتبع Flex وgrid اتجاه المنطقة تلقائيًا. تستخدم رموز التنقل{" "}
            <code className="font-mono text-caption-1-medium text-text-primary">rtl:rotate-180</code>؛
            تُعكس الأيقونات الممرَّرة إلى أزرار BoardUI عند كونها أسهم تنقل.
          </p>
          <p className="text-body-regular text-text-secondary">
            احتفظ بعناوين البريد الإلكتروني وعناوين URL وأرقام OTP والشيفرة المصدرية بترتيبها الطبيعي من
            اليسار إلى اليمين. استخدم{" "}
            <code className="font-mono text-caption-1-medium text-text-primary">inputDir</code> للتحكم في قيمة
            الحقل بشكل مستقل عن تسميته، و{" "}
            <code className="font-mono text-caption-1-medium text-text-primary">bdi</code> لعزل النصوص
            المختلطة. تحتفظ محاور المخططات والبيانات بترتيب إحداثياتها؛ بينما يتبع تخطيط البطاقة وعناصر التحكم
            الخاصة بها اتجاه RTL.
          </p>
          <SubSection title="محتوى مختلط">
            <CodeBlock code={MIXED_CONTENT_CODE} />
          </SubSection>
          <p className="text-body-regular text-text-secondary">
            تحافظ طبقات BoardUI العلوية على إعدادات اللغة الخاصة بها. عند كتابة بوابة مخصصة، احمل اتجاه
            الكتابة إلى عنصرها الجذري حتى يتمكن من العرض بشكل صحيح خارج منطقة DOM الأصلية.
          </p>
          <SubSection title="بوابات مخصصة">
            <CodeBlock code={PORTAL_CODE} />
          </SubSection>
          <p className="text-body-regular text-text-secondary">
            تكدسات الإشعارات تعتمد افتراضياً على{" "}
            <code className="font-mono text-caption-1-medium text-text-primary">bottom-end</code>. استخدم{" "}
            <code className="font-mono text-caption-1-medium text-text-primary">top-start</code>،{" "}
            <code className="font-mono text-caption-1-medium text-text-primary">top-end</code>، أو{" "}
            <code className="font-mono text-caption-1-medium text-text-primary">bottom-start</code> للزوايا
            المنطقية. الزوايا الصريحة{" "}
            <code className="font-mono text-caption-1-medium text-text-primary">يسار</code> و{" "}
            <code className="font-mono text-caption-1-medium text-text-primary">يمين</code> تحتفظ المواضع
            بمعناها الفعلي.
          </p>
        </Section>

        <Section id="localization" title="التوطين والخطوط">
          <p className="text-body-regular text-text-secondary">
            يتولى دعم RTL معالجة التخطيط والتفاعلات. تتضمن الأمثلة أعلاه ترجمات نموذجية بالعربية والعبرية.
            تسميات تطبيقك والأسماء القابلة للوصول والعملات والرسائل تنتمي إلى طبقة الترجمة الخاصة بك. توفر
            React Aria سلاسل تفاعل مدركة للغة المحلية؛ استخدم{" "}
            <code className="font-mono text-caption-1-medium text-text-primary">Intl.NumberFormat</code> و{" "}
            <code className="font-mono text-caption-1-medium text-text-primary">Intl.DateTimeFormat</code>{" "}
            لبيانات التطبيق.
          </p>
          <p className="text-body-regular text-text-secondary">
            اختر خطاً يدعم لغتك، مثل Noto Sans Arabic أو Noto Sans Hebrew. حمّله باستخدام أدوات الخطوط في
            إطار عملك وأضفه إلى{" "}
            <code className="font-mono text-caption-1-medium text-text-primary">--font-sans</code> المكدّس.
            يحتاج النص العربي إلى تشكيل متصل وارتفاع سطر مريح؛ تجنّب التباعد الإضافي بين الحروف. تستخدم اللغة
            الصينية نفس أساس اللغة المحلية مع تخطيط LTR.
          </p>
          <p className="text-body-regular text-text-secondary">
            يتبع النهج مبدأ الأسلوب المنطقي المستخدم من قِبل shadcn/ui ويستخدم موفّر اللغة في React Aria
            لعناصر التفاعل الأولية الموجودة في BoardUI.
          </p>
        </Section>

        <PrevNext
          locale="ar"
          prev={{ href: "/skill", label: "مهارات الوكيل", sub: "معرفة لوكيلك الذكي" }}
          next={{ href: "/components/color", label: "اللون", sub: "رموز الألوان الدلالية" }}
        />
      </div>
    </DocsLayout>
    </LocaleHtml>
  );
}
