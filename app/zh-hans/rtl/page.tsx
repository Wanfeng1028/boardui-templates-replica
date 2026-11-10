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
    <LocaleHtml locale="zh-hans">
      <DocsLayout variant="library" hidePrevNext title="RTL 支持" locale="zh-hans">
        <div className="flex flex-col gap-8 pb-8">
          <div className="flex flex-col gap-3">
            <p className="text-body-regular text-text-secondary">
              BoardUI 跨免费组件、Pro 块和模板完全支持阿拉伯语、希伯来语和其他从右到左语言的 RTL。
            </p>
          </div>

          <Section id="examples" title="组件示例">
            <p className="text-body-regular text-text-secondary">
              切换语言并尝试控件。布局、文本对齐、间距、导航箭头、滑块行为和叠加放置遵循选定的方向。这些示例包括 Pro 图表卡。
            </p>
            <RtlComponentDemo />
          </Section>

          <Section id="templates" title="模板示例">
            <p className="text-body-regular text-text-secondary">
              探索包含阿拉伯语、希伯来语和英语示例内容的实际模板。切换语言以同时查看文案、布局和交互。
            </p>
            <RtlTemplateDemo />
          </Section>

          <Section id="direction-provider" title="方向提供者">
            <p className="text-body-regular text-text-secondary">
              明确的区域设置使 CSS 方向、键盘导航、日历和门户菜单保持同步。混合语言地区的 Nest 提供商；默认内容包装器保留您的布局。
            </p>
            <RtlProviderDemo />
          </Section>

          <Section id="setup" title="设置 RTL">
            <p className="text-body-regular text-text-secondary">
              安装 <code className="font-mono text-caption-1-medium text-text-primary">DirectionProvider</code>，
              然后设置应用程序的语言和方向。不需要 RTL CLI 标志或单独的组件版本。
            </p>
            <PkgCommand
              npm="npx boardui@latest add direction"
              pnpm="pnpm dlx boardui@latest add direction"
              yarn="yarn dlx boardui@latest add direction"
            />
            <p className="text-caption-1-semibold text-text-secondary">应用程序/布局.tsx</p>
            <CodeBlock code={LAYOUT_CODE} />
            <p className="text-body-regular text-text-secondary">
              <code className="font-mono text-caption-1-medium text-text-primary">locale=&quot;ar&quot;</code>{" "}
              解析为 RTL。使用 <code className="font-mono text-caption-1-medium text-text-primary">he</code>{" "}
              对于希伯来语， <code className="font-mono text-caption-1-medium text-text-primary">en-US</code> 对于英语，或{" "}
              <code className="font-mono text-caption-1-medium text-text-primary">zh-CN</code> 对于中文，仍然是
              LTR。设置{" "}
              <code className="font-mono text-caption-1-medium text-text-primary">dir</code> 单独更新CSS；该提供商还配置
              React Aria 键盘导航、日历和门户菜单。
            </p>
            <SubSection title="混合语言地区">
              <CodeBlock code={MIXED_CODE} />
            </SubSection>
            <p className="text-body-regular text-text-secondary">
              对于手动安装，请完成 BoardUI setup ，安装{" "}
              <code className="font-mono text-caption-1-medium text-text-primary">react-aria-components</code>，
              然后复制下面的提供程序源。
            </p>
            <div>
              <LinkButton href="/installation" trailingIcon={RiArrowRightSLine}>
                BoardUI设置
              </LinkButton>
            </div>
            <p className="text-caption-1-semibold text-text-secondary">
              组件/基础/方向/direction.tsx
            </p>
            <CodeBlock code={DIRECTION_SOURCE} />
          </Section>

          <Section id="existing-projects" title="现有项目">
            <p className="text-body-regular text-text-secondary">
              BoardUI 将源代码安装到您的项目中。添加提供程序，然后刷新在 RTL 支持之前安装的组件。使用前备份您的自定义设置{" "}
              <code className="font-mono text-caption-1-medium text-text-primary">--overwrite</code>，或将当前源合并到您编辑的文件中。刷新共享依赖项，例如按钮、菜单样式、图标和全局 CSS 以及模板。
            </p>
            <PkgCommand
              npm="npx boardui@latest add button select tabs --overwrite"
              pnpm="pnpm dlx boardui@latest add button select tabs --overwrite"
              yarn="yarn dlx boardui@latest add button select tabs --overwrite"
            />
            <p className="text-body-regular text-text-secondary">
              Pro 组件和模板使用相同的提供程序和逻辑样式。通过您许可的 CLI 安装更新，或下载更新的源包。您的应用程序可以在运行时切换区域设置，而无需重新安装组件。
            </p>
          </Section>

          <Section id="directional-styles" title="定向风格">
            <p className="text-body-regular text-text-secondary">
              使用 <code className="font-mono text-caption-1-medium text-text-primary">ps / pe</code>，{" "}
              <code className="font-mono text-caption-1-medium text-text-primary">ms / me</code>，{" "}
              <code className="font-mono text-caption-1-medium text-text-primary">start / end</code>， 和{" "}
              <code className="font-mono text-caption-1-medium text-text-primary">text-start / text-end</code> 在自定义布局中。
              Flex 和 grid 自动遵循区域的方向。导航字形的使用{" "}
              <code className="font-mono text-caption-1-medium text-text-primary">rtl:rotate-180</code>；
              当传递给 BoardUI 按钮的图标是导航箭头时，它们会被镜像。
            </p>
            <p className="text-body-regular text-text-secondary">
              按自然 LTR 顺序保留电子邮件地址、URL、OTP 数字和源代码。使用{" "}
              <code className="font-mono text-caption-1-medium text-text-primary">inputDir</code> 独立于其标签来控制字段的值，以及{" "}
              <code className="font-mono text-caption-1-medium text-text-primary">bdi</code> 隔离混合文本。图表轴和数据保留其坐标顺序；他们的卡片布局和控件遵循 RTL。
            </p>
            <SubSection title="混合内容">
              <CodeBlock code={MIXED_CONTENT_CODE} />
            </SubSection>
            <p className="text-body-regular text-text-secondary">
              BoardUI 覆盖层保留其区域设置。当您编写自定义门户时，请将方向传递到其根，以便它可以在原始 DOM 区域之外正确呈现。
            </p>
            <SubSection title="定制门户">
              <CodeBlock code={PORTAL_CODE} />
            </SubSection>
            <p className="text-body-regular text-text-secondary">
              通知堆栈默认为{" "}
              <code className="font-mono text-caption-1-medium text-text-primary">bottom-end</code>。使用{" "}
              <code className="font-mono text-caption-1-medium text-text-primary">top-start</code>，{" "}
              <code className="font-mono text-caption-1-medium text-text-primary">top-end</code>， 或{" "}
              <code className="font-mono text-caption-1-medium text-text-primary">bottom-start</code> 对于逻辑角点。显式的{" "}
              <code className="font-mono text-caption-1-medium text-text-primary">左</code> 和{" "}
              <code className="font-mono text-caption-1-medium text-text-primary">对</code> 位置保留其物理意义。
            </p>
          </Section>

          <Section id="localization" title="本地化和字体">
            <p className="text-body-regular text-text-secondary">
              RTL 支持处理布局和交互。上面的示例包括阿拉伯语和希伯来语示例翻译。您的应用程序标签、可访问的名称、货币和消息都属于您的翻译层。
              React Aria 提供区域感知交互字符串；使用{" "}
              <code className="font-mono text-caption-1-medium text-text-primary">Intl.NumberFormat</code> 和{" "}
              <code className="font-mono text-caption-1-medium text-text-primary">Intl.DateTimeFormat</code> 用于应用程序数据。
            </p>
            <p className="text-body-regular text-text-secondary">
              选择覆盖您的语言的字体，例如 Noto Sans 阿拉伯语或 Noto Sans 希伯来语。使用框架的字体工具加载它并将其添加到 BoardUI 中{" "}
              <code className="font-mono text-caption-1-medium text-text-primary">--font-sans</code> 堆栈。阿拉伯文字需要连贯的造型和舒适的行高；避免额外的字母间距。中文使用相同的语言环境基础和 LTR 布局。
            </p>
            <p className="text-body-regular text-text-secondary">
              该方法遵循逻辑风格原则 shadcn/ui 和用途 React Aria 的语言环境提供者 对于 BoardUI 现有的交互原语。
            </p>
          </Section>

          <PrevNext
            locale="zh-hans"
            prev={{ href: "/skill", label: "智能体技能", sub: "为您的智能体人提供的知识" }}
            next={{ href: "/components/color", label: "颜色", sub: "语义颜色变量" }}
          />
        </div>
      </DocsLayout>
    </LocaleHtml>
  );
}
