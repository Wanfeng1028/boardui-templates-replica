"use client";

import { useState } from "react";
import Link from "next/link";
import { RiArrowLeftLine, RiArrowRightSLine, RiCheckLine, RiFileCopyLine } from "@remixicon/react";

import { DocsLayout } from "@/components/application/docs/docs-layout";
import { LinkButton } from "@/components/base/buttons/link-button";
import { LocaleHtml } from "@/components/application/docs/locale-html";

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

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="flex flex-col gap-3">
      <h2 className="text-title-2-medium text-text-primary">{title}</h2>
      {children}
    </section>
  );
}

function CodeBlock({ code }: { code: string }) {
  return (
    <pre className="overflow-x-auto rounded-xl border border-border-button-default bg-background-secondary-default p-4 font-mono text-caption-1-medium leading-6 text-text-primary">
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

function OptionTable({ rows }: { rows: [string, string][] }) {
  return (
    <div className="overflow-x-auto rounded-xl border border-border-button-default">
      <table className="w-full border-collapse text-start">
        <thead>
          <tr className="border-b border-separator-border bg-background-secondary-default">
            <th className="px-4 py-2.5 text-start text-caption-1-semibold text-text-secondary">オプション</th>
            <th className="px-4 py-2.5 text-start text-caption-1-semibold text-text-secondary">説明</th>
          </tr>
        </thead>
        <tbody>
          {rows.map(([option, description]) => (
            <tr key={option} className="border-b border-separator-border last:border-b-0">
              <td className="px-4 py-2.5 font-mono text-caption-1-medium text-text-primary">{option}</td>
              <td className="px-4 py-2.5 text-body-regular text-text-secondary">{description}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

const INIT_OPTIONS: [string, string][] = [
  ["-y, --yes", "Skip confirmation prompts"],
  ["-o, --overwrite", "Overwrite existing files"],
  ["-d, --dir <dir>", "Target directory (defaults to the project source root)"],
  ["--pro", "Also install dependencies used by BoardUI Pro components"],
  ["--postcss", "Set up @tailwindcss/postcss even when Tailwind already compiles another way"],
];

const ADD_OPTIONS: [string, string][] = [
  ["-a, --all", "Add every component in the registry"],
  ["-p, --path <path>", "Custom directory to write files into"],
  ["-d, --dir <dir>", "Target directory (defaults to the project source root)"],
  ["-o, --overwrite", "Overwrite existing files"],
  ["-y, --yes", "Skip prompts — keep existing files, install dependencies"],
];

const SKILL_OPTIONS: [string, string][] = [
  ["-g, --global", "Install to ~/.claude/skills/boardui instead of the project"],
  ["-c, --client <client>", "Install to ~/.agents/skills/boardui (codex, gemini)"],
  ["-p, --path <dir>", "Custom directory to install the skill into"],
  ["-f, --force", "Overwrite an existing install (how you update)"],
];

/** CLI docs page, mirroring boardui.com/docs/cli. */
export default function CliPage() {
  return (
    <LocaleHtml locale="ja">
      <DocsLayout variant="docs" locale="ja" title="CLI">
        <div className="flex flex-col gap-8 pb-8">
          <div className="flex flex-col gap-3">
            <p className="text-body-regular text-text-secondary">
              ザ・ザ・ザ・ザ・ザ・ザ・ザ・ザ・ザ・ザ・ザ・ザ・ザ・ザ・ザ・ザ・ザ・ザ・ザ・ザ・ザ・ザ・ザ・ザ・ザ・ザ・ザ・ザ・ザ・ザ・ザ・ザ・ザ・ザ・ザ・ザ・ザ・ザ・ザ・ザ・ザ・ザ・ザ・ザ・ザ・ザ・ザ・ザ・ザ・ザ・ <code className="font-mono text-caption-1-medium text-text-primary">ボードイ</code> CLI は、コンポーネントのソースファイルを直接プロジェクトにコピーします。ランタイムパッケージなし、コードはあなたのものです。各コンポーネントの内部の依存関係(ユーティリティ、アイコン、その他のコンポーネント)を独立して解決し、パッケージマネージャで不足している npm パッケージをインストールします。
            </p>
            <Command cmd="npx boardui@latest add button select date-picker" />
          </div>

          <Section title="サインイン">
            <p className="text-body-regular text-text-secondary">
              既存のNext.jsプロジェクトでBoardUIを設定:ランタイム依存関係をインストールします(){" "}
              <code className="font-mono text-caption-1-medium text-text-primary">react-aria-components</code>,{" "}
              <code className="font-mono text-caption-1-medium text-text-primary">tailwind-merge</code>,{" "}
              <code className="font-mono text-caption-1-medium text-text-primary">@remixicon/react</code>, Tailwind
              v4), 書き込み{" "}
              <code className="font-mono text-caption-1-medium text-text-primary">styles/theme.css</code>,{" "}
              <code className="font-mono text-caption-1-medium text-text-primary">styles/typography.css</code>,{" "}
              <code className="font-mono text-caption-1-medium text-text-primary">styles/globals.css</code>, と{" "}
              <code className="font-mono text-caption-1-medium text-text-primary">utils/cx.ts</code> 、その後、ルートレイアウトに追加する行
              (スタイルシートのインポートと Inter フォント) を表示します。
            </p>
            <p className="text-body-regular text-text-secondary">
              create-next-app 16.4 以降が{" "}
              <code className="font-mono text-caption-1-medium text-text-primary">@tailwindcss/turbopack</code>{" "}
              で行っているように、プロジェクトがすでに Tailwind v4 をコンパイルしている場合、init は PostCSS
              に手を加えません。それ以外の場合は{" "}
              <code className="font-mono text-caption-1-medium text-text-primary">@tailwindcss/postcss</code>{" "}
              をインストールし、 <code className="font-mono text-caption-1-medium text-text-primary">postcss.config.mjs</code>{" "}
              の行を表示します。どちらの場合でも PostCSS を設定するには{" "}
              <code className="font-mono text-caption-1-medium text-text-primary">--postcss</code> を渡してください。
            </p>
            <Command cmd="npx boardui@latest init" />
            <OptionTable rows={INIT_OPTIONS} />
          </Section>

          <Section title="追加する">
            <p className="text-body-regular text-text-secondary">
              1つまたは複数のコンポーネントを追加します。デフォルトでは、このサイトと同じ構造を維持します(){" "}
              <code className="font-mono text-caption-1-medium text-text-primary">components/base/…</code>,{" "}
              <code className="font-mono text-caption-1-medium text-text-primary">components/application/…</code>
              )、輸入は使用します{" "}
              <code className="font-mono text-caption-1-medium text-text-primary">@/</code>{" "}
              エイリアス、パスがなければ既存のファイルがスキップされます。{" "}
              <code className="font-mono text-caption-1-medium text-text-primary">--overwrite</code> . 対話式ピッカーの引数なしで実行します。
            </p>
            <Command cmd="npx boardui@latest add            # interactive picker" />
            <Command cmd="npx boardui@latest add table pagination" />
            <Command cmd="npx boardui@latest add --all" />
            <OptionTable rows={ADD_OPTIONS} />
          </Section>

<Section title="CI、スクリプト、コーディングエージェント">
          <p className="text-body-regular text-text-secondary">
            <code className="font-mono text-caption-1-medium text-text-primary">init</code> と{" "}
            <code className="font-mono text-caption-1-medium text-text-primary">add</code> は、パッケージをインストールする前や既存のファイルに手を加える前に確認します。CI、スクリプト、コーディングエージェントのように応答できるターミナルがない場合は、推測で進めずに終了コード 1 で停止します。{" "}
            <code className="font-mono text-caption-1-medium text-text-primary">--yes</code> を渡すと既定の動作を受け入れ、依存関係をインストールして既存のファイルを残します。既存のファイルを置き換えるには{" "}
            <code className="font-mono text-caption-1-medium text-text-primary">--overwrite</code> を追加し、ピッカーを使う代わりにコンポーネント名を指定するか{" "}
            <code className="font-mono text-caption-1-medium text-text-primary">--all</code> を渡してください。
          </p>
          <Command cmd="npx boardui@latest init --yes" />
          <Command cmd="npx boardui@latest add button select --yes" />
        </Section>

        <Section title="カスタムパスとモノレポス">
          <p className="text-body-regular text-text-secondary">
            オプションを追加 <code className="font-mono text-caption-1-medium text-text-primary">boardui.json</code>{" "}
            目的地のパッケージの横{" "}
            <code className="font-mono text-caption-1-medium text-text-primary">package.json</code>{" "}
            ファイルがどこに行っているかを構成し、使用するエイリアスをインポートします。 両方{" "}
            <code className="font-mono text-caption-1-medium text-text-primary">サインイン</code> そして、{" "}
            <code className="font-mono text-caption-1-medium text-text-primary">追加する</code> Pro コンポーネントを含む、それを読み込みます。それなしで、既存のルートと{" "}
            <code className="font-mono text-caption-1-medium text-text-primary">ディスク/</code> レイアウトは前のように振る舞います。
          </p>
          <p className="text-body-regular text-text-secondary">
            ペアリングの設定 <code className="font-mono text-caption-1-medium text-text-primary">paths</code>{" "}
            そして、 <code className="font-mono text-caption-1-medium text-text-primary">aliases</code>{" "}
            コンポーネント、ユーティリティ、ホック、スタイル、または lib のエントリ。CLI を実行すると、npm の依存関係がインストールされます。設定されたマッピングは組み合わせることはできません。{" "}
            <code className="font-mono text-caption-1-medium text-text-primary">--path</code> または{" "}
            <code className="font-mono text-caption-1-medium text-text-primary">--dir</code> ; これらのフラグは、未設定のプロジェクトで使用可能です。 config の変更は、以前にインストールしたファイルを移行しません。
          </p>
          <div>
            <LinkButton href="/installation" trailingIcon={RiArrowRightSLine}>
              共有UIパッケージの設定とアプリの消費
            </LinkButton>
          </div>
        </Section>

        <Section title="リスト">
          <p className="text-body-regular text-text-secondary">
            ベースコンポーネント、アプリケーションブロック、ファンデーションの種類によってグループ化されたすべての利用可能なコンポーネントを印刷します。
          </p>
          <Command cmd="npx boardui@latest list" />
        </Section>

        <Section title="スキルアップ">
          <p className="text-body-regular text-text-secondary">
            インストール BoardUIの代理店のスキル (<code className="font-mono text-caption-1-medium text-text-primary">SKILL.md</code>{" "}
            さらに、カタログ、テーマ、パターン参照など、ClaudeコードやCodexロードBoardUIの知識などのAIアシスタントが各セッションに読み込まれています。 プロジェクトへのデフォルト{" "}
            <code className="font-mono text-caption-1-medium text-text-primary">.claude/skills/boardui</code>;
            と再実行して下さい <code className="font-mono text-caption-1-medium text-text-primary">--force</code> 更新する。
          </p>
          <Command cmd="npx boardui@latest skill" />
          <OptionTable rows={SKILL_OPTIONS} />
          <div>
            <LinkButton href="/skill" trailingIcon={RiArrowRightSLine}>
              BoardUIの代理店のスキル
            </LinkButton>
          </div>
        </Section>

        <Section title="コンポーネントの更新">
          <p className="text-body-regular text-text-secondary">
            インストールされたコンポーネントはコピーです。編集は、サイレントに触れることはありません。レジストリからコンポーネントの最新バージョンをプルするには、再実行します。{" "}
            <code className="font-mono text-caption-1-medium text-text-primary">追加する</code> と、{" "}
            <code className="font-mono text-caption-1-medium text-text-primary">--overwrite</code> .
          </p>
          <Command cmd="npx boardui@latest add button --overwrite" />
        </Section>

        <Section title="匿名テレメトリー">
          <p className="text-body-regular text-text-secondary">
            成功後 <code className="font-mono text-caption-1-medium text-text-primary">サインイン</code> 、CLI は、バージョン、パッケージマネージャ、またはそのバージョンを含む匿名イベントを送信します。{" "}
            <code className="font-mono text-caption-1-medium text-text-primary">--pro</code> 使われました。成功後{" "}
            <code className="font-mono text-caption-1-medium text-text-primary">追加する</code> , 明示的に要求されたコンポーネント名を送信します。, しかし、自動的に解決された依存関係ではありません. 成功した後{" "}
            <code className="font-mono text-caption-1-medium text-text-primary">スキルアップ</code> インストールすると、スキルが配置された場所(プロジェクト、グローバル、またはエージェントディレクトリ)が、パス自体を決して送信します。オペレーティングシステムのユーザー設定ディレクトリにあるランダムなIDは、繰り返し実行を識別することができます。BoardUIは、プロジェクトパス、ソースコード、依存関係名、メールアドレス、その他のコマンド引数、またはテレメトリーを送信しません。{" "}
            <code className="font-mono text-caption-1-medium text-text-primary">リスト</code> .
          </p>
          <p className="text-body-regular text-text-secondary">
            設定でテレメトリーを無効にする{" "}
            <code className="font-mono text-caption-1-medium text-text-primary">BOARDUI_TELEMETRY_DISABLED=1</code>{" "}
            または <code className="font-mono text-caption-1-medium text-text-primary">DO_NOT_TRACK=1</code> .
          </p>
          <p className="text-body-regular text-text-secondary">
            イベントは、毎日、毎週、毎月のトレンドレポートに使用されるライフタイムカウンターと匿名の毎日のバケツとして保持されます。毎日のバケツは自動で期限が切れません。
          </p>
        </Section>

        <Section title="shadcn の両立性">
          <p className="text-body-regular text-text-secondary">
            レジストリはshadcn項目スキーマを使用します。そのため、すべてのコンポーネントもshadcn CLIでインストールします。
          </p>
          <CodeBlock code="npx shadcn@latest add https://www.boardui.com/r/button.json" />
        </Section>

        <Link
          href="/docs/introduction"
          className="inline-flex items-center gap-1.5 text-body-medium text-text-secondary transition-colors hover:text-text-primary"
        >
          <RiArrowLeftLine className="size-4" aria-hidden />
          はじめにに戻る
        </Link>
      </div>
    </DocsLayout>
    </LocaleHtml>
  );
}
