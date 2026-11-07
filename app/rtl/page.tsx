"use client";

import { useState } from "react";
import Link from "next/link";
import { RiArrowLeftLine, RiArrowRightSLine, RiCheckLine, RiFileCopyLine } from "@remixicon/react";

import { AppShell } from "@/components/application/app-shell/app-shell";
import { Button } from "@/components/base/buttons/button";
import { Chip } from "@/components/base/badges/chip";
import { LinkButton } from "@/components/base/buttons/link-button";
import { DirectionProvider } from "@/components/foundations/direction/direction";

function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);
  return (
    <button
      type="button"
      onClick={() => {
        const done = () => {
          setCopied(true);
          window.setTimeout(() => setCopied(false), 1500);
        };
        if (navigator.clipboard?.writeText) {
          navigator.clipboard.writeText(text).then(done).catch(done);
        } else {
          done();
        }
      }}
      className="inline-flex shrink-0 items-center gap-1 rounded-full border border-border-button-default bg-background-primary-default px-2.5 py-1 text-caption-1-semibold text-text-secondary transition-colors hover:text-text-primary"
    >
      {copied ? <RiCheckLine className="size-3.5" aria-hidden /> : <RiFileCopyLine className="size-3.5" aria-hidden />}
      {copied ? "Copied" : "Copy"}
    </button>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="flex flex-col gap-3">
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

function Command({ cmd }: { cmd: string }) {
  return (
    <div className="flex items-center justify-between gap-3 rounded-xl border border-border-button-default bg-background-secondary-default px-4 py-3">
      <code className="font-mono text-caption-1-medium text-text-primary">{cmd}</code>
      <CopyButton text={cmd} />
    </div>
  );
}

function Demo({ children }: { children: React.ReactNode }) {
  return (
    <div className="rounded-3xl border border-border-button-default bg-background-primary-default p-6">
      {children}
    </div>
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

const DIRECTION_SOURCE = `"use client";

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

const VISITORS: [string, string][] = [
  ["السعودية", "5,980"],
  ["مصر", "3,020"],
  ["الإمارات", "820"],
];

/** RTL Support page, mirroring boardui.com/rtl. */
export default function RtlPage() {
  return (
    <AppShell title="RTL Support" columnClassName="max-w-[964px]">
      <div className="flex flex-col gap-8 pb-8">
        <div className="flex flex-col gap-3">
          <p className="text-body-regular text-text-secondary">
            BoardUI fully supports RTL for Arabic, Hebrew, and other right-to-left languages across free
            components, Pro blocks, and templates.
          </p>
        </div>

        <Section title="Component examples">
          <p className="text-body-regular text-text-secondary">
            Switch languages and try the controls. Layout, text alignment, spacing, navigation arrows, slider
            behavior, and overlay placement follow the selected direction. The examples include a Pro chart
            card.
          </p>
          <p className="text-caption-1-semibold text-text-secondary">Right to left</p>
          <Demo>
            <div dir="rtl" lang="ar" className="flex flex-col gap-6">
              <div className="flex flex-col gap-3 rounded-3xl border border-border-button-default bg-background-secondary-default p-6">
                <h3 className="text-title-2-medium text-text-primary">تسجيل الدخول إلى BoardUI Pro</h3>
                <p className="text-body-regular text-text-secondary">
                  يتيح لك ترخيصك الوصول إلى جميع مكونات وقوالب Pro.
                </p>
                <Button variant="primary">تسجيل الدخول إلى BoardUI Pro</Button>
                <p className="text-center text-body-2-regular text-text-tertiary">أو تابع باستخدام</p>
                <p className="text-center text-body-regular text-text-secondary">جديد هنا؟ إنشاء حساب</p>
              </div>
              <div className="flex flex-col gap-3 rounded-3xl border border-border-button-default bg-background-secondary-default p-6">
                <h3 className="text-title-2-medium text-text-primary">اختيار نطاق التواريخ</h3>
                <p className="text-body-regular text-text-secondary">
                  اختر تاريخ البداية والنهاية، أو استخدم إحدى الفترات المحددة مسبقًا.
                </p>
                <div className="flex flex-wrap gap-2">
                  <Chip variant="bold" color="blue">البداية للمشاريع الجانبية والتجارب.</Chip>
                  <Chip variant="bold" color="lime">Pro للفرق المتنامية التي تحتاج إلى المزيد.</Chip>
                </div>
              </div>
              <div className="flex flex-col gap-3 rounded-3xl border border-border-button-default bg-background-secondary-default p-6">
                <div className="flex items-center justify-between gap-2">
                  <h3 className="text-title-2-medium text-text-primary">الزوار حسب البلد</h3>
                  <Chip variant="bold" color="blue">Pro</Chip>
                </div>
                <p className="text-body-2-regular text-text-tertiary">الزوار حسب البلد الزوار</p>
                <div className="flex flex-col gap-2">
                  {VISITORS.map(([country, count]) => (
                    <div key={country} className="flex items-center justify-between gap-3 border-b border-separator-border pb-2 last:border-b-0 last:pb-0">
                      <span className="text-body-medium text-text-primary">{country}</span>
                      <span dir="ltr" className="font-mono text-caption-1-medium text-text-secondary">{count}</span>
                    </div>
                  ))}
                </div>
              </div>
              <p className="text-body-regular text-text-secondary">
                الملف الشخصي, الأمان, تعديل تفضيلات حسابك, مستوى الصوت, رمز التحقق, إشعارات البريد الإلكتروني,
                تحديثات المنتج
              </p>
              <p className="text-body-regular text-text-secondary">
                إدارة حسابك وتفضيلاتك من مكان واحد. <bdi dir="ltr">sara@example.com</bdi>
              </p>
            </div>
          </Demo>
        </Section>

        <Section title="Template examples">
          <p className="text-body-regular text-text-secondary">
            Explore the actual templates with Arabic, Hebrew, and English sample content. Switch languages to
            see the copy, layout, and interactions together.
          </p>
          <div>
            <LinkButton href="/templates" trailingIcon={RiArrowRightSLine}>
              Browse templates
            </LinkButton>
          </div>
        </Section>

        <Section title="Direction Provider">
          <p className="text-body-regular text-text-secondary">
            An explicit locale keeps CSS direction, keyboard navigation, calendars, and portalled menus in sync.
            Nest providers for mixed-language regions; the default contents wrapper preserves your layout.
          </p>
          <Demo>
            <DirectionProvider locale="ar">
              <div dir="rtl" lang="ar" className="flex flex-col gap-3">
                <h3 className="text-title-2-medium text-text-primary">تسجيل الدخول إلى BoardUI Pro</h3>
                <p className="text-body-regular text-text-secondary">
                  يتيح لك ترخيصك الوصول إلى جميع مكونات وقوالب Pro.
                </p>
                <p className="text-center text-body-2-regular text-text-tertiary">أو تابع باستخدام</p>
                <p className="text-center text-body-regular text-text-secondary">جديد هنا؟ إنشاء حساب</p>
              </div>
            </DirectionProvider>
          </Demo>
        </Section>

        <Section title="Set up RTL">
          <p className="text-body-regular text-text-secondary">
            Install the <code className="font-mono text-caption-1-medium text-text-primary">DirectionProvider</code>,
            then set your application&apos;s language and direction. No RTL CLI flag or separate component
            version is needed.
          </p>
          <Command cmd="npx boardui@latest add direction" />
          <p className="text-caption-1-semibold text-text-secondary">app/layout.tsx</p>
          <CodeBlock code={LAYOUT_CODE} />
          <p className="text-body-regular text-text-secondary">
            <code className="font-mono text-caption-1-medium text-text-primary">locale=&quot;ar&quot;</code>{" "}
            resolves to RTL. Use <code className="font-mono text-caption-1-medium text-text-primary">he</code>{" "}
            for Hebrew, <code className="font-mono text-caption-1-medium text-text-primary">en-US</code> for
            English, or <code className="font-mono text-caption-1-medium text-text-primary">zh-CN</code> for
            Chinese, which remains LTR. Setting{" "}
            <code className="font-mono text-caption-1-medium text-text-primary">dir</code> alone updates CSS;
            the provider also configures React Aria keyboard navigation, calendars, and portalled menus.
          </p>
          <SubSection title="Mixed-language regions">
            <CodeBlock code={MIXED_CODE} />
          </SubSection>
          <p className="text-body-regular text-text-secondary">
            For manual installation, complete the BoardUI setup, install{" "}
            <code className="font-mono text-caption-1-medium text-text-primary">react-aria-components</code>,
            and copy the provider source below.
          </p>
          <div>
            <LinkButton href="/installation" trailingIcon={RiArrowRightSLine}>
              BoardUI setup
            </LinkButton>
          </div>
          <p className="text-caption-1-semibold text-text-secondary">
            components/foundations/direction/direction.tsx
          </p>
          <CodeBlock code={DIRECTION_SOURCE} />
        </Section>

        <Section title="Existing projects">
          <p className="text-body-regular text-text-secondary">
            BoardUI installs source into your project. Add the provider, then refresh components installed
            before RTL support. Back up your customizations before using{" "}
            <code className="font-mono text-caption-1-medium text-text-primary">--overwrite</code>, or merge
            the current source into your edited files. Refresh shared dependencies such as buttons, menu
            styles, icons, and global CSS as well as your template.
          </p>
          <Command cmd="npx boardui@latest add button select tabs --overwrite" />
          <p className="text-body-regular text-text-secondary">
            Pro components and templates use the same provider and logical styles. Install updates through your
            licensed CLI, or download the updated source package. Your application can switch locale at runtime
            without reinstalling components.
          </p>
        </Section>

        <Section title="Directional styles">
          <p className="text-body-regular text-text-secondary">
            Use <code className="font-mono text-caption-1-medium text-text-primary">ps / pe</code>,{" "}
            <code className="font-mono text-caption-1-medium text-text-primary">ms / me</code>,{" "}
            <code className="font-mono text-caption-1-medium text-text-primary">start / end</code>, and{" "}
            <code className="font-mono text-caption-1-medium text-text-primary">text-start / text-end</code> in
            custom layouts. Flex and grid follow the region&apos;s direction automatically. Navigation glyphs
            use <code className="font-mono text-caption-1-medium text-text-primary">rtl:rotate-180</code>;
            icons passed to BoardUI buttons are mirrored when they are navigation arrows.
          </p>
          <p className="text-body-regular text-text-secondary">
            Keep email addresses, URLs, OTP digits, and source code in their natural LTR order. Use{" "}
            <code className="font-mono text-caption-1-medium text-text-primary">inputDir</code> to control a
            field&apos;s value independently of its label, and{" "}
            <code className="font-mono text-caption-1-medium text-text-primary">bdi</code> to isolate mixed
            text. Chart axes and data retain their coordinate order; their card layout and controls follow RTL.
          </p>
          <SubSection title="Mixed content">
            <CodeBlock code={MIXED_CONTENT_CODE} />
          </SubSection>
          <p className="text-body-regular text-text-secondary">
            BoardUI overlays preserve their locale. When you write a custom portal, carry direction onto its
            root so it can render correctly outside the original DOM region.
          </p>
          <SubSection title="Custom portals">
            <CodeBlock code={PORTAL_CODE} />
          </SubSection>
          <p className="text-body-regular text-text-secondary">
            Notification stacks default to{" "}
            <code className="font-mono text-caption-1-medium text-text-primary">bottom-end</code>. Use{" "}
            <code className="font-mono text-caption-1-medium text-text-primary">top-start</code>,{" "}
            <code className="font-mono text-caption-1-medium text-text-primary">top-end</code>, or{" "}
            <code className="font-mono text-caption-1-medium text-text-primary">bottom-start</code> for
            logical corners. Explicit <code className="font-mono text-caption-1-medium text-text-primary">left</code>{" "}
            and <code className="font-mono text-caption-1-medium text-text-primary">right</code> positions
            retain their physical meaning.
          </p>
        </Section>

        <Section title="Localization & fonts">
          <p className="text-body-regular text-text-secondary">
            RTL support handles layout and interactions. The examples above include Arabic and Hebrew sample
            translations. Your application labels, accessible names, currencies, and messages belong to your
            translation layer. React Aria supplies locale-aware interaction strings; use{" "}
            <code className="font-mono text-caption-1-medium text-text-primary">Intl.NumberFormat</code> and{" "}
            <code className="font-mono text-caption-1-medium text-text-primary">Intl.DateTimeFormat</code> for
            application data.
          </p>
          <p className="text-body-regular text-text-secondary">
            Choose a font with coverage for your language, such as Noto Sans Arabic or Noto Sans Hebrew. Load
            it with your framework&apos;s font tools and add it to BoardUI&apos;s{" "}
            <code className="font-mono text-caption-1-medium text-text-primary">--font-sans</code> stack.
            Arabic text needs connected shaping and comfortable line height; avoid extra letter spacing.
            Chinese uses the same locale foundation with an LTR layout.
          </p>
          <p className="text-body-regular text-text-secondary">
            The approach follows the logical-style principle used by shadcn/ui and uses React Aria&apos;s locale
            provider for BoardUI&apos;s existing interaction primitives.
          </p>
        </Section>

        <Link
          href="/components"
          className="inline-flex items-center gap-1.5 text-body-medium text-text-secondary transition-colors hover:text-text-primary"
        >
          <RiArrowLeftLine className="size-4" aria-hidden />
          Back to all components
        </Link>
      </div>
    </AppShell>
  );
}
