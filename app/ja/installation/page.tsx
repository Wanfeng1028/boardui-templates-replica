"use client";

import { useState } from "react";
import Link from "next/link";
import { RiArrowLeftLine, RiArrowRightSLine, RiCheckLine, RiFileCopyLine } from "@remixicon/react";

import { DocsLayout } from "@/components/application/docs/docs-layout";
import { LocaleHtml } from "@/components/application/docs/locale-html";
import { LinkButton } from "@/components/base/buttons/link-button";
import { cx } from "@/utils/cx";
import { VITE_CONFIG_CODE, VITE_TSCONFIG_CODE, VITE_MAIN_CODE, RR_TSCONFIG_CODE, RR_ROOT_CODE, ASTRO_TSCONFIG_CODE, ASTRO_LAYOUT_CODE, ASTRO_USAGE_CODE, LAYOUT_CODE, BOARDUI_JSON_CODE, CONSUMING_GLOBALS_CODE, ADD_COMPONENT_CODE, DARK_LAYOUT_CODE, ACCENT_CODE, THEME_CSS, TYPOGRAPHY_CSS, GLOBALS_CSS, CX_TS } from "@/app/installation/page";

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
      {copied ? "コピーしました" : "コピー"}
    </button>
  );
}

function Section({ title, children, id }: { title: string; children: React.ReactNode; id?: string }) {
  return (
    <section id={id} className="flex flex-col gap-3">
      <h2 className="text-title-2-medium text-text-primary">{title}</h2>
      {children}
    </section>
  );
}

function Step({ n, title, children }: { n: number; title: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-2">
      <p className="text-caption-1-semibold text-text-secondary">
        {n} — {title}
      </p>
      {children}
    </div>
  );
}

function CodeBlock({ code }: { code: string }) {
  return (
    <pre className="overflow-x-auto rounded-xl border border-border-button-default bg-background-secondary-default p-4 font-mono text-caption-1-medium leading-6 text-text-primary">
      {code}
    </pre>
  );
}

function FileBlock({ file, code }: { file: string; code: string }) {
  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center justify-between gap-3">
        <p className="font-mono text-caption-1-medium text-text-secondary">{file}</p>
        <CopyButton text={code} />
      </div>
      <CodeBlock code={code} />
    </div>
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


function PkgCommand({ npm, pnpm, yarn }: { npm: string; pnpm: string; yarn: string }) {
  const [pm, setPm] = useState<"npm" | "pnpm" | "yarn">("npm");
  const cmd = pm === "npm" ? npm : pm === "pnpm" ? pnpm : yarn;
  return (
    <div className="flex flex-col gap-2">
      <div className="flex flex-wrap gap-2">
        {(["npm", "pnpm", "yarn"] as const).map((name) => (
          <button
            key={name}
            type="button"
            onClick={() => setPm(name)}
            className={cx(
              "rounded-full border px-3 py-1 text-caption-1-semibold transition-colors",
              pm === name
                ? "border-border-button-default bg-background-tertiary-default text-text-primary"
                : "border-border-button-default bg-background-primary-default text-text-secondary hover:text-text-primary",
            )}
          >
            {name}
          </button>
        ))}
      </div>
      <Command cmd={cmd} />
    </div>
  );
}

const FRAMEWORKS = ["Next.js", "Vite", "React Router", "Astro"] as const;

const FRAMEWORK_LABELS: Record<(typeof FRAMEWORKS)[number], string> = { "Next.js": "Next.js", Vite: "Vite", "React Router": "React のルーター", Astro: "アストロ" };
export default function InstallationPage() {
  const [framework, setFramework] = useState<(typeof FRAMEWORKS)[number]>("Next.js");
  return (
    <LocaleHtml locale="ja">
      <DocsLayout variant="library" locale="ja" title="インストール">
      <div className="flex flex-col gap-8 pb-8">
        <div className="flex flex-col gap-3">
          <p className="text-body-regular text-text-secondary">
            BoardUIはReact 19とTailwind CSS v4を使う環境で動作します。以下でフレームワークを選んで手順を確認するか、手動の手順で基礎ファイルをコピーしてください。
          </p>
          <p className="text-body-regular text-text-secondary">
            BoardUI MCPサーバーを接続すると、以下の手順を省略して、エージェントにすべてのインストールを任せられます。
          </p>
          <div>
            <LinkButton href="/mcp" trailingIcon={RiArrowRightSLine}>
              MCP を始めよう
            </LinkButton>
          </div>
        </div>

        <Section title="クイックスタート">
          <p className="text-body-regular text-text-secondary">
            共有UIパッケージや独自のインポートエイリアスを使う場合は、最初のインストールを実行する前にモノレポとエイリアスの設定を参照してください。以下の標準設定は設定ファイルを必要としません。
          </p>
          <p className="text-body-regular text-text-secondary">
            React + Tailwind v4 プロジェクトで、{" "}
            <code className="font-mono text-caption-1-medium text-text-primary">サインイン</code> 必要なパッケージをインストールし、テーマ、タイポグラフィ、グローバルスタイルと{" "}
            <code className="font-mono text-caption-1-medium text-text-primary">cx</code> ユーティリティを書き込み、ルートレイアウトに追加する残りの行を表示します：
          </p>
          <Command cmd="npx boardui@latest init" />
          <p className="text-body-regular text-text-secondary">
            次にコンポーネントを追加します。内部の依存関係とnpmパッケージは自動的に解決されます：
          </p>
          <Command cmd="npx boardui@latest add button select date-picker" />
          <p className="text-body-regular text-text-secondary">
            CI、スクリプト、コーディングエージェントから CLI を実行しますか? 両方のコマンドに{" "}
            <code className="font-mono text-caption-1-medium text-text-primary">--yes</code> を追加してください。プロンプトに応答するターミナルがないと、CLI は推測で進めずに終了コード 1 で停止します。{" "}
            <code className="font-mono text-caption-1-medium text-text-primary">--yes</code> はそれらのプロンプトに既定の内容で答え、依存関係をインストールして既存のファイルをそのまま残します。
          </p>
        </Section>

        <Section title="フレームワークガイド">
          <p className="text-body-regular text-text-secondary">
            空のフォルダからフルセットアップ。各フレームワークがTailwindをワイヤーで縛る方法にのみステップが異なります。{" "}
            <code className="font-mono text-caption-1-medium text-text-primary">@/</code> エイリアスとグローバルスタイルシートをインポートします。
          </p>
          <div className="flex flex-wrap gap-2">
            {FRAMEWORKS.map((name) => (
              <button
                key={name}
                type="button"
                onClick={() => setFramework(name)}
                className={cx(
                  "rounded-full border px-3.5 py-1.5 text-caption-1-semibold transition-colors",
                  framework === name
                    ? "border-border-button-default bg-background-tertiary-default text-text-primary"
                    : "border-border-button-default bg-background-primary-default text-text-secondary hover:text-text-primary",
                )}
              >
                {FRAMEWORK_LABELS[name]}
              </button>
            ))}
          </div>
          {framework === "Next.js" ? (
            <div className="flex flex-col gap-4">
              <Step n={1} title="プロジェクトの作成(スキルアップ)。">
                <p className="text-body-regular text-text-secondary">
                  create-next-app デフォルト — TypeScript、Tailwind CSS、および{" "}
                  <code className="font-mono text-caption-1-medium text-text-primary">@/*</code> alias — BoardUI のデフォルト設定にマッチします。
                </p>
                <Command cmd="npx create-next-app@latest my-app" />
                <p className="text-body-2-regular text-text-tertiary">
                  # TypeScript: Yes · Tailwind CSS: Yes · import alias: @/* (the defaults)
                </p>
              </Step>
              <Step n={2} title="プロジェクトのルートで init を実行します。">
                <p className="text-body-regular text-text-secondary">
                  インストール <code className="font-mono text-caption-1-medium text-text-primary">react-aria-components</code>、{" "}
                  <code className="font-mono text-caption-1-medium text-text-primary">tailwind-merge</code>、{" "}
                  <code className="font-mono text-caption-1-medium text-text-primary">@remixicon/react</code> を書き込み、
                  スタイル/ と ユーティリティ/ を作成します。
                </p>
                <Command cmd="npx boardui@latest init" />
              </Step>
              <Step n={3} title="ルートレイアウトでスタイルシートをインポートし、Inter を読み込みます。">
                <p className="text-body-regular text-text-secondary">
                  BoardUI のテーマは書体を{" "}
                  <code className="font-mono text-caption-1-medium text-text-primary">--font-inter</code> から読み込みます。create-next-app の Geist フォントの代わりに <code className="font-mono text-caption-1-medium text-text-primary">next/font</code>{" "}
                  で Inter を読み込み、その変数を{" "}
                  <code className="font-mono text-caption-1-medium text-text-primary">&lt;html&gt;</code> に設定してください。設定しないと、テキストはシステムフォントで表示されます。
                </p>
                <CodeBlock code={LAYOUT_CODE} />
              </Step>
              <Step n={4} title="コンポーネントを追加します。">
                <Command cmd="npx boardui@latest add button" />
              </Step>
            </div>

          ) : framework === "Vite" ? (
            <div className="flex flex-col gap-4">
              <Step n={1} title="プロジェクトの作成(スキルアップ)。">
                <Command cmd="npm create vite@latest my-app -- --template react-ts" />
              </Step>
              <Step n={2} title="Tailwind CSS v4 をインストールし、Vite プラグインを登録します。">
                <p className="text-body-regular text-text-secondary">
                  プラグインがスタイルシートと{" "}
                  <code className="font-mono text-caption-1-medium text-text-primary">@theme</code> トークンを
                  処理します：
                </p>
                <Command cmd="npm install tailwindcss @tailwindcss/vite" />
                <FileBlock file="vite.config.ts" code={VITE_CONFIG_CODE} />
              </Step>
              <Step n={3} title="tsconfig.json に @/* インポートエイリアスを追加します。">
                <FileBlock file="tsconfig.json" code={VITE_TSCONFIG_CODE} />
              </Step>
              <Step n={4} title="init を実行します。">
                <p className="text-body-regular text-text-secondary">
                  デフォルトのスタイル、ベースカラー、デザインルールをインストールするかどうかを尋ねられます。
                  迷ったらデフォルトを受け入れてください。後から{" "}
                  <code className="font-mono text-caption-1-medium text-text-primary">boardui.json</code> で
                  変更できます。
                </p>
                <PkgCommand
                  npm="npx boardui@latest init"
                  pnpm="pnpm dlx boardui@latest init"
                  yarn="yarn dlx boardui@latest init"
                />
              </Step>
              <Step n={5} title="アプリのエントリでスタイルシートをインポートします。">
                <p className="text-body-regular text-text-secondary">
                  init ステップが{" "}
                  <code className="font-mono text-caption-1-medium text-text-primary">src/styles/globals.css</code>{" "}
                  を作成しました：
                </p>
                <FileBlock file="main.tsx" code={VITE_MAIN_CODE} />
              </Step>
              <Step n={6} title="コンポーネントを追加します。">
                <p className="text-body-regular text-text-secondary">例えば、Button：</p>
                <PkgCommand
                  npm="npx boardui@latest add button"
                  pnpm="pnpm dlx boardui@latest add button"
                  yarn="yarn dlx boardui@latest add button"
                />
              </Step>
            </div>
          ) : framework === "React Router" ? (
            <div className="flex flex-col gap-4">
              <Step n={1} title="プロジェクトの作成(スキルアップ)。">
                <p className="text-body-regular text-text-secondary">
                  React Router v7 は Remix の成功者です。これらの手順は両方に適用します。
                </p>
                <Command cmd="npx create-react-router@latest my-app" />
                <p className="text-body-2-regular text-text-tertiary">
                  # デフォルトのテンプレートには Tailwind CSS v4 が既に組み込まれています
                </p>
              </Step>
              <Step n={2} title="@/* インポートエイリアスを追加します。">
                <p className="text-body-regular text-text-secondary">
                  テンプレートは既に{" "}
                  <code className="font-mono text-caption-1-medium text-text-primary">vite-tsconfig-paths</code>
                  を使用しているため、tsconfig のエントリだけで十分です：
                </p>
                <FileBlock file="tsconfig.json" code={RR_TSCONFIG_CODE} />
              </Step>
              <Step n={3} title="init を実行し、アプリディレクトリをターゲティングします。">
                <PkgCommand
                  npm="npx boardui@latest init --dir app"
                  pnpm="pnpm dlx boardui@latest init --dir app"
                  yarn="yarn dlx boardui@latest init --dir app"
                />
              </Step>
              <Step n={4} title="ルートのスタイルシートをインポートします。">
                <FileBlock file="app/root.tsx" code={RR_ROOT_CODE} />
              </Step>
              <Step n={5} title="コンポーネントを追加し、アプリディレクトリをターゲティングします。">
                <PkgCommand
                  npm="npx boardui@latest add button --dir app"
                  pnpm="pnpm dlx boardui@latest add button --dir app"
                  yarn="yarn dlx boardui@latest add button --dir app"
                />
              </Step>
            </div>

          ) : (
            <div className="flex flex-col gap-4">
              <Step n={1} title="プロジェクトを作成し、React + Tailwind の統合を追加します。">
                <Command cmd="npm create astro@latest my-app" />
                <Command cmd="npx astro add react tailwind" />
                <p className="text-body-2-regular text-text-tertiary">
                  # React 統合と Tailwind CSS v4 Vite プラグインをインストールします
                </p>
              </Step>
              <Step n={2} title="@/* インポートエイリアスを追加します。">
                <FileBlock file="tsconfig.json" code={ASTRO_TSCONFIG_CODE} />
              </Step>
              <Step n={3} title="プロジェクトのルートで init を実行します。">
                <p className="text-body-regular text-text-secondary">
                  スタイルとユーティリティは自動的に{" "}
                  <code className="font-mono text-caption-1-medium text-text-primary">ディスク/</code> に書き込まれます。
                </p>
                <PkgCommand
                  npm="npx boardui@latest init"
                  pnpm="pnpm dlx boardui@latest init"
                  yarn="yarn dlx boardui@latest init"
                />
              </Step>
              <Step n={4} title="ベースレイアウトのスタイルシートをインポートします。">
                <FileBlock file="src/layouts/Layout.astro" code={ASTRO_LAYOUT_CODE} />
              </Step>
              <Step n={5} title="コンポーネントを追加し、.astro ファイルに水和します。">
                <p className="text-body-regular text-text-secondary">
                  インタラクティブなコンポーネントは、ページ上で水和するために{" "}
                  <code className="font-mono text-caption-1-medium text-text-primary">client:*</code> ディレクティブ
                  が必要です:
                </p>
                <PkgCommand
                  npm="npx boardui@latest add button"
                  pnpm="pnpm dlx boardui@latest add button"
                  yarn="yarn dlx boardui@latest add button"
                />
                <FileBlock file="src/pages/index.astro" code={ASTRO_USAGE_CODE} />
              </Step>
            </div>
          )}
          <p className="text-body-regular text-text-secondary">
            何か他のものを使用して? React 19 を Tailwind CSS v4 で実行するフレームワーク - ワイヤーアップ{" "}
            <code className="font-mono text-caption-1-medium text-text-primary">@/*</code> エイリアス, 実行{" "}
            <code className="font-mono text-caption-1-medium text-text-primary">npx boardui init</code>, スタイルシートをインポートします。または、以下の手順でCLIを完全にスキップします。
          </p>

        </Section>
        <Section title="Monorepos とカスタムエイリアス" id="monorepos">
          <p className="text-body-regular text-text-secondary">
            複数のアプリで使う共有UIパッケージにコンポーネントをインストールしたり、既存のフォルダーや
            インポートエイリアスに合わせたりできます。必要に応じて次を追加します：{" "}
            <code className="font-mono text-caption-1-medium text-text-primary">boardui.json</code> 目的地のパッケージの横{" "}
            <code className="font-mono text-caption-1-medium text-text-primary">package.json</code> それなしで、
            通常の根または <code className="font-mono text-caption-1-medium text-text-primary">ディスク/</code>{" "}
            レイアウトと <code className="font-mono text-caption-1-medium text-text-primary">@/</code> インポート
            は同じままです。
          </p>
          <Step n={1} title="宛先パッケージを設定します。">
            <p className="text-body-regular text-text-secondary">
              パッケージ名{" "}
              <code className="font-mono text-caption-1-medium text-text-primary">@workspace/ui</code> サインイン{" "}
              <code className="font-mono text-caption-1-medium text-text-primary">packages/ui</code> このコンフィグを作成し、
              エクスポートをパッケージマニフェストにマージします。ファイルの拡張子をパッケージのソースに適応するか、
              出力をビルドします。
            </p>
            <CodeBlock code={BOARDUI_JSON_CODE} />
            <p className="text-body-regular text-text-secondary">
              パスはこのパッケージからの相対パスで、パッケージ内を指す必要があります。変更するグループには、パスとエイリアスの両方を設定してください。省略したグループは標準の設定を使います。エイリアスはワイルドカードを含まないインポート接頭辞で、パッケージのexports、またはTypeScriptとバンドラーの設定で解決できる必要があります。
            </p>
          </Step>
          <Step n={2} title="共有パッケージからBoardUIを実行します。">
            <Command cmd="cd packages/ui" />
            <Command cmd="npx boardui@latest init" />
            <Command cmd="npx boardui@latest add button" />
            <p className="text-body-regular text-text-secondary">
              コンポーネントとnpm依存関係はこのパッケージにインストールします。例えば、{" "}
              <code className="font-mono text-caption-1-medium text-text-primary">@/utils/cx</code> なるほど{" "}
              <code className="font-mono text-caption-1-medium text-text-primary">@workspace/ui/utils/cx</code>
              . Free と Pro コンポーネントは同じコンフィグを使用します。MCP では、このパッケージの絶対パス
              をそのままパスします。 <code className="font-mono text-caption-1-medium text-text-primary">projectDir</code>.
            </p>
          </Step>
          <Step n={3} title="各消費アプリを接続します。">
            <p className="text-body-regular text-text-secondary">
              UIパッケージを各アプリのワークスペース依存関係に追加し、バンドラーがパッケージのTypeScriptとTSXをコンパイルできることを確認してください。BoardUIのスタイルシートをインポートし、Tailwindのソース検出に共有ソースを含めます：
            </p>
            <CodeBlock code={CONSUMING_GLOBALS_CODE} />
            <p className="text-body-regular text-text-secondary">
              ルートレイアウトやエントリポイントからこのアプリスタイルシートをインポートします。 調整する{" "}
              <code className="font-mono text-caption-1-medium text-text-primary">@source</code> stylesheet の場所に相対パスします。コンポーネントのインポートは、{" "}
              <code className="font-mono text-caption-1-medium text-text-primary">@workspace/ui/components/base/buttons/button</code>
              .
            </p>
          </Step>
          <p className="text-body-regular text-text-secondary">
            インストール前のパスを設定します。コンフィグを変更すると、既存のファイルを移動したり、アプリのインポートを更新したりしません。コンフィグを組み合わせる代わりに、コンフィグを使用してください。{" "}
            <code className="font-mono text-caption-1-medium text-text-primary">--path</code> または{" "}
            <code className="font-mono text-caption-1-medium text-text-primary">--dir</code>. フルページの
            テンプレートは、消費アプリに所属しています。そのルートとパブリックアセットは、ワークスペースパッケージに分割されません。マニュアルコピーペーストは元のインポートを保持しているため、それらを自分で調整します。
          </p>
        </Section>

        <Section title="手動取付け">
          <p className="text-body-regular text-text-secondary">
            手動で設定する場合は、Tailwind CSS v4を導入済みのプロジェクトを用意して、以下の手順に従ってください。
          </p>
          <Step n={1} title="必要なパッケージをインストールする">
            <Command cmd="npm install react-aria-components tailwind-merge @remixicon/react" />
          </Step>
          <Step n={2} title="作成する styles/theme.css デザイントークンを使って。">
            <FileBlock file="styles/theme.css" code={THEME_CSS} />
          </Step>
          <Step n={3} title="作成する styles/typography.css タイプスケールを使って。">
            <FileBlock file="styles/typography.css" code={TYPOGRAPHY_CSS} />
          </Step>
          <Step n={4} title="作成する styles/globals.css Tailwindのエントリーポイントとして。">
            <FileBlock file="styles/globals.css" code={GLOBALS_CSS} />
          </Step>
          <Step n={5} title="追加する utils/cx.ts class-merge ユーティリティ。">
            <FileBlock file="utils/cx.ts" code={CX_TS} />
          </Step>
          <Step n={6} title="ルートレイアウトでスタイルシートをインポートし、Inter を読み込みます。">
            <CodeBlock code={LAYOUT_CODE} />
          </Step>
        </Section>

        <Section title="コンポーネントを追加">
          <p className="text-body-regular text-text-secondary">
            部品は下で住んでいます{" "}
            <code className="font-mono text-caption-1-medium text-text-primary">components/base/…</code> そして輸入を経由して輸入して下さい <code className="font-mono text-caption-1-medium text-text-primary">@/</code>{" "}
            alias. 任意のコンポーネントページからコードをコピーするか、CLI を実行してインポートします。
          </p>
          <CodeBlock code={ADD_COMPONENT_CODE} />
          <p className="text-body-regular text-text-secondary">
            すべてをブラウズする{" "}
            <code className="font-mono text-caption-1-medium text-text-primary">npx boardui list</code>、個々のコンポーネントページから各コンポーネントのインストールコマンドをコピーするか、またはコピーします。
          </p>
        </Section>

        <Section title="BoardUI Pro">
          <p className="text-body-regular text-text-secondary">
            ライセンスが有効化されると、コンポーネントとテンプレートが同じCLIを介してインストールされます。 zipジャグリング、コピーペーストなし。 あなたのライセンスキーは、あなたのLemon Squeezyレシート(および下)にあります。{" "}
            <code className="font-mono text-caption-1-medium text-text-primary">My Orders</code> レモンスクイージー)。 1つの購入は、すべてのもののロックを解除し、更新が含まれています。
          </p>
          <p className="text-body-regular text-text-secondary">
            一度あなたの機械の免許証を活動化させます:
          </p>
          <Command cmd="npx boardui@latest login YOUR_LICENSE_KEY" />
          <p className="text-body-regular text-text-secondary">
            それから、Pro コンポーネントは、無料のものと同じように機能します。CLI は、ソースと任意の無料のコンポーネントをインストールします。
          </p>
          <Command cmd="npx boardui@latest add agent-progress" />
          <p className="text-body-regular text-text-secondary">
            テンプレートは同じように引きます。フルページ、使用するすべてのコンポーネント、およびプロジェクト内のイメージの土地を1つのコマンドで処理します。{" "}
            <code className="font-mono text-caption-1-medium text-text-primary">template-home-dashboard</code>,{" "}
            <code className="font-mono text-caption-1-medium text-text-primary">template-medical-profile</code>,{" "}
            <code className="font-mono text-caption-1-medium text-text-primary">template-ai-chat</code>,{" "}
            <code className="font-mono text-caption-1-medium text-text-primary">template-ai-image-generation</code>,{" "}
            <code className="font-mono text-caption-1-medium text-text-primary">template-ai-profile</code>):
          </p>
          <Command cmd="npx boardui@latest add template-ai-chat" />
          <p className="text-body-regular text-text-secondary">
            インストール済みのコンポーネントを最新版に更新するには、同じコマンドに次を付けて再実行します：{" "}
            <code className="font-mono text-caption-1-medium text-text-primary">--overwrite</code>. すべてのプロの部品はとマークされます{" "}
            <code className="font-mono text-caption-1-medium text-text-primary">Pro</code> バッジをオンに{" "}
            <Link href="/components" className="text-accent-600 underline">
              コンポーネントページ
            </Link>
            .
          </p>
          <p className="text-body-regular text-text-secondary">
            ログインした端末ごとに、ライセンスのシートを 1 つ使用します。シート数は「1年間の更新」と「永久アクセス」が 1 つ、「スタートアップ向け」が 5 つです。Lemon Squeezy で購入したライセンスには、販売時の上限がそのまま適用されます。{" "}
            <code className="font-mono text-caption-1-medium text-text-primary">npx boardui logout</code>{" "}
            現在の機械の座席を解放して下さい;CIで、スキップして下さい{" "}
            <code className="font-mono text-caption-1-medium text-text-primary">login</code> そして置きます{" "}
            <code className="font-mono text-caption-1-medium text-text-primary">BOARDUI_LICENSE_KEY</code>{" "}
            代わりに環境変数。 テンプレートは、あなたのLemon Squeezyの注文からの完全なプロジェクトのダウンロードとして利用可能です。 あなたの鍵を失いますか? 書きます hi@boardui.com .
          </p>
        </Section>

        <Section title="ダークモード">
          <p className="text-body-regular text-text-secondary">
            ダークモードはクラスによる手動切り替えです。標準はライトモードで、選択内容は次のキーに保存します：{" "}
            <code className="font-mono text-caption-1-medium text-text-primary">boardui:theme</code> 。OSの設定は参照しません。ハイドレーション前に保存済みのテーマを読み込むことで、再訪時にライトモードが一瞬表示されるのを防げます。
          </p>
          <CodeBlock code={DARK_LAYOUT_CODE} />
          <p className="text-body-regular text-text-secondary">
            再使用可能な制御を加えて下さい、それから置きます{" "}
            <code className="font-mono text-caption-1-medium text-text-primary">&lt;ThemeToggle /&gt;</code>{" "}
            サイドバーまたは設定面で。 目に見えるトグルを同期させ、選択を自動的に主張します。
          </p>
          <Command cmd="npx boardui@latest add theme-toggle" />
          <p className="text-body-regular text-text-secondary">
            コンポーネントはセマンティックユーティリティのみを使用します。光値をカスタマイズします。{" "}
            <code className="font-mono text-caption-1-medium text-text-primary">:root</code> ダークバリュー <code className="font-mono text-caption-1-medium text-text-primary">.dark</code> インスタグラム{" "}
            <code className="font-mono text-caption-1-medium text-text-primary">styles/theme.css</code>; コンポーネントレベルの回避{" "}
            <code className="font-mono text-caption-1-medium text-text-primary">dark:</code> オーバーライドと未加工構造色。 完全なマッピングを参照してください。{" "}
            <Link href="/components/color" className="text-accent-600 underline">
              カラーページ
            </Link>
            .
          </p>
        </Section>

        <Section title="アクセントカラー">
          <p className="text-body-regular text-text-secondary">
            CTAカラーはテーマの決定です, ないです。 コンポーネントの編集. すべてのインタラクティブな表面 - プライマリボタンの勾配, ゴーストとリンクボタン, チェックボックス, ラジオ, スイッチ, スライダー, タブ, 選択したサイドバー項目, フォーカスリング - 1から読みます{" "}
            <code className="font-mono text-caption-1-medium text-text-primary">--color-accent-50…950</code>{" "}
            ランプで <code className="font-mono text-caption-1-medium text-text-primary">styles/theme.css</code> デフォルトは青色です。テーマのインポートとシステム全体がライトとダークモードの両方で再入力した後、それらの11の変数をオーバーライドします。チャートとステータスの色は、独自の色合いを維持します。
          </p>
          <p className="text-caption-1-semibold text-text-secondary">
            styles/globals.css (またはインポートされたスタイルシート)
          </p>
          <CodeBlock code={ACCENT_CODE} />
          <p className="text-body-regular text-text-secondary">
            このブロックを手で書く必要はありません。任意のコンポーネントページを開き、右下のパレットボタンを押して色相をその場で試すか、完全なカスタムカラーを選んでください。カスタムカラーはプライマリボタンのグラデーションの始点である accent-500 にそのまま配置され、BoardUI が残りの 10 段階をその周りに生成します。見た目が整ったら、{" "}
            <code className="font-mono text-caption-1-medium text-text-primary">Copy theme CSS</code> このオーバーライドを正確にエクスポートします。{" "}
            <Link href="/components/color" className="text-accent-600 underline">
              カラーページ
            </Link>{" "}
            同じ制御インラインを持っています。
          </p>
        </Section>

        <Section title="テックスタック">
          <p className="text-body-regular text-text-secondary">
            BoardUIのコンポーネントはReact 19、TypeScript 5、Tailwind CSS v4で実装し、React Ariaでアクセシビリティに対応しています。ソースコードを所有でき、ランタイムパッケージや外部の保守担当者の対応待ちは不要です。チャートカードはRecharts、データテーブルはTanStack Tableを使用し、必要な場合はCLIが自動的にインストールします。
          </p>
        </Section>

        <Link
          href="/components"
          className="inline-flex items-center gap-1.5 text-body-medium text-text-secondary transition-colors hover:text-text-primary"
        >
          <RiArrowLeftLine className="size-4" aria-hidden />
          すべてのコンポーネントに戻る
        </Link>
      </div>
    </DocsLayout>
    </LocaleHtml>
  );
}

// 模型翻译：Add the @/* import alias to tsconfig.json.
// 模型翻译：Run init.
// 模型翻译：Import the stylesheet in your app entry.
// 模型翻译：Add the @/* import alias.（2 处）
// 模型翻译：For example, the Button:
// 模型翻译：The plugin handles the stylesheet and the @theme tokens for you:
// 模型翻译：It will prompt you for a few choices: a default style, a base color, and whether to install the design rules. When in doubt, accept the defaults — you can change them later in boardui.json.
// 模型翻译：The init step created src/styles/globals.css for you:
// 模型翻译：The template already uses vite-tsconfig-paths, so a tsconfig entry is all you need:
// 模型翻译：# the default template ships with Tailwind CSS v4 already wired up
// 模型翻译：# installs the React integration and the Tailwind CSS v4 Vite plugin
// 模型翻译：Add the @/* import alias.
