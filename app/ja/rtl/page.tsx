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
    <LocaleHtml locale="ja">
      <DocsLayout variant="library" hidePrevNext locale="ja" title="RTLサポート">
        <div className="flex flex-col gap-8 pb-8">
          <div className="flex flex-col gap-3">
            <p className="text-body-regular text-text-secondary">
              BoardUIの無料コンポーネント、Proブロック、テンプレートは、アラビア語、ヘブライ語などの右から左に書く言語に対応しています。
            </p>
          </div>

          <Section id="examples" title="コンポーネント例">
            <p className="text-body-regular text-text-secondary">
              言語を切り替えて操作を試してください。レイアウト、文字の配置、余白、ナビゲーションの矢印、スライダーの動作、オーバーレイの位置が、選んだ方向に従います。Proのチャートカードも含みます。
            </p>
            <RtlComponentDemo />
          </Section>

          <Section id="templates" title="テンプレート例">
            <p className="text-body-regular text-text-secondary">
              実際のテンプレートをアラビア語、ヘブライ語、英語サンプルコンテンツでご覧ください。言語を切り替えて、コピー、レイアウト、インタラクションを一緒に確認します。
            </p>
            <RtlTemplateDemo />
          </Section>

          <Section id="direction-provider" title="方向提供者">
            <p className="text-body-regular text-text-secondary">
              ロケールを明示すると、CSSの方向、キーボード操作、カレンダー、ポータル内のメニューを一致させられます。複数の言語が混在する領域ではプロバイダーを入れ子にできます。標準のcontentsラッパーは既存のレイアウトを維持します。
            </p>
            <RtlProviderDemo />
          </Section>

          <Section id="setup" title="RTLの設定">
            <p className="text-body-regular text-text-secondary">
              インストール{" "}
              <code className="font-mono text-caption-1-medium text-text-primary">DirectionProvider</code>{" "}
              。その後、アプリケーションの言語と方向を設定します。RTL専用のCLIフラグや、別バージョンのコンポーネントは不要です。
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
              RTL に解決します。{" "}
              <code className="font-mono text-caption-1-medium text-text-primary">he</code>{" "}
              ヘブライ語のために、{" "}
              <code className="font-mono text-caption-1-medium text-text-primary">en-US</code>について{" "}
              英語、または{" "}
              <code className="font-mono text-caption-1-medium text-text-primary">zh-CN</code> LTRのまま中国人のために。{" "}
              設定{" "}
              <code className="font-mono text-caption-1-medium text-text-primary">dir</code>{" "}
              だけではCSSのみが変わります。プロバイダーはReact Ariaのキーボード操作、カレンダー、ポータル内のメニューも設定します。
            </p>
            <SubSection title="混合言語地域">
              <CodeBlock code={MIXED_CODE} />
            </SubSection>
            <p className="text-body-regular text-text-secondary">
              手動で導入する場合は、 BoardUI setup を完了し、{" "}
              <code className="font-mono text-caption-1-medium text-text-primary">react-aria-components</code>{" "}
              をインストールして、以下のプロバイダーのソースをコピーしてください。
            </p>
            <div>
              <LinkButton href="/installation" trailingIcon={RiArrowRightSLine}>
                BoardUIのセットアップ
              </LinkButton>
            </div>
            <p className="text-caption-1-semibold text-text-secondary">
              components/foundations/direction/direction.tsx
            </p>
            <CodeBlock code={DIRECTION_SOURCE} />
          </Section>

          <Section id="existing-projects" title="既存のプロジェクト">
            <p className="text-body-regular text-text-secondary">
              BoardUIはソースコードをプロジェクトに追加します。プロバイダーを追加し、RTL対応前にインストールしたコンポーネントを更新してください。次を使う前に、独自の変更をバックアップしてください：{" "}
              <code className="font-mono text-caption-1-medium text-text-primary">--overwrite</code>{" "}
              を使うか、最新版のソースを編集済みのファイルにマージしてください。テンプレートに加え、ボタン、メニューのスタイル、アイコン、グローバルCSSなどの共有依存ファイルも更新してください。
            </p>
            <PkgCommand
              npm="npx boardui@latest add button select tabs --overwrite"
              pnpm="pnpm dlx boardui@latest add button select tabs --overwrite"
              yarn="yarn dlx boardui@latest add button select tabs --overwrite"
            />
            <p className="text-body-regular text-text-secondary">
              Proのコンポーネントとテンプレートも同じプロバイダーと論理方向のスタイルを使います。有効なライセンスでCLIから更新するか、更新済みのソースパッケージをダウンロードしてください。コンポーネントを再インストールせずに、実行時にロケールを切り替えられます。
            </p>
          </Section>

          <Section id="directional-styles" title="方向スタイル">
            <p className="text-body-regular text-text-secondary">
              利用条件{" "}
              <code className="font-mono text-caption-1-medium text-text-primary">ps / pe</code>,{" "}
              <code className="font-mono text-caption-1-medium text-text-primary">ms / me</code>,{" "}
              <code className="font-mono text-caption-1-medium text-text-primary">start / end</code>,{" "}
              と{" "}
              <code className="font-mono text-caption-1-medium text-text-primary">text-start / text-end</code>{" "}
              カスタムレイアウトで。 フレックスとグリッドは、自動的に領域の方向に従う。 ナビゲーショングリフの使用{" "}
              <code className="font-mono text-caption-1-medium text-text-primary">rtl:rotate-180</code>
              。BoardUIのボタンに渡したナビゲーションの矢印アイコンは、方向に合わせて反転します。
            </p>
            <p className="text-body-regular text-text-secondary">
              メールアドレス、URL、OTPの数字、ソースコードは、本来の左から右の順序を維持してください。次を使用します：{" "}
              <code className="font-mono text-caption-1-medium text-text-primary">inputDir</code>{" "}
              フィールドの値をラベルの独立で制御し、{" "}
              <code className="font-mono text-caption-1-medium text-text-primary">bdi</code>{" "}
              で、方向の異なる文字列を分離します。チャートの軸とデータは座標の順序を維持し、カードのレイアウトと操作部分はRTLに従います。
            </p>
            <SubSection title="混合コンテンツ">
              <CodeBlock code={MIXED_CONTENT_CODE} />
            </SubSection>
            <p className="text-body-regular text-text-secondary">
              BoardUIのオーバーレイはロケールを引き継ぎます。独自のポータルを作る場合は、元のDOM領域の外でも正しく表示されるよう、ルート要素に方向を渡してください。
            </p>
            <SubSection title="カスタムポータル">
              <CodeBlock code={PORTAL_CODE} />
            </SubSection>
            <p className="text-body-regular text-text-secondary">
              通知はデフォルトでスタックします。{" "}
              <code className="font-mono text-caption-1-medium text-text-primary">bottom-end</code>. 使用{" "}
              <code className="font-mono text-caption-1-medium text-text-primary">top-start</code>,{" "}
              <code className="font-mono text-caption-1-medium text-text-primary">top-end</code>, または{" "}
              <code className="font-mono text-caption-1-medium text-text-primary">bottom-start</code>{" "}
              論理的な角のため。 明示的{" "}
              <code className="font-mono text-caption-1-medium text-text-primary">ふりがな</code>{" "}
              そして、{" "}
              <code className="font-mono text-caption-1-medium text-text-primary">右から</code>{" "}
              位置は物理的意味を保持します。
            </p>
          </Section>

          <Section id="localization" title="ローカリゼーションとフォント">
            <p className="text-body-regular text-text-secondary">
              RTL対応はレイアウトと操作を扱います。上の例はアラビア語とヘブライ語のサンプル翻訳を含みます。アプリのラベル、アクセシブルな名前、通貨、メッセージは、アプリの翻訳層で管理してください。React Ariaはロケールに合った操作用の文言を提供します。次を使用してください：{" "}
              <code className="font-mono text-caption-1-medium text-text-primary">Intl.NumberFormat</code>{" "}
              そして、{" "}
              <code className="font-mono text-caption-1-medium text-text-primary">Intl.DateTimeFormat</code>{" "}
              アプリケーションデータのため。
            </p>
            <p className="text-body-regular text-text-secondary">
              Noto Sans ArabicやNoto Sans Hebrewなど、対象言語の文字を含むフォントを選んでください。フレームワークのフォント機能で読み込み、BoardUIの次の設定に追加します：{" "}
              <code className="font-mono text-caption-1-medium text-text-primary">--font-sans</code> stack.
              アラビア語のテキストは接続された形成および快適なラインの高さを必要とします;余分手紙の間隔を避けて下さい。中国語はLTRのレイアウトが付いている同じlocaleの基礎を使用します。
            </p>
            <p className="text-body-regular text-text-secondary">
              アプローチは、論理的なスタイルの原則に従っています。 シェードク/ui 用途・用途 React Aria の locale プロバイダー BoardUIの既存のインタラクションプリミティブ用。
            </p>
          </Section>

          <PrevNext
            prev={{ href: "/skill", label: "エージェントスキル", sub: "あなたの代理店のための知識" }}
            next={{ href: "/components/color", label: "カラー", sub: "セマンティックカラートークン" }}
            locale="ja"
          />
        </div>
      </DocsLayout>
    </LocaleHtml>
  );
}
