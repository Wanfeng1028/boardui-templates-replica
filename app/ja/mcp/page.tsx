"use client";

import { useState } from "react";
import { RiArrowRightSLine, RiCheckLine, RiFileCopyLine } from "@remixicon/react";

import { DocsLayout } from "@/components/application/docs/docs-layout";
import { LocaleHtml } from "@/components/application/docs/locale-html";
import { PkgCommand } from "@/components/application/docs/code-tabs";
import { PrevNext } from "@/components/application/docs/prev-next";
import { LinkButton } from "@/components/base/buttons/link-button";
import { ButtonLink } from "@/components/base/buttons/button";
import { cx } from "@/utils/cx";

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
  const [copied, setCopied] = useState(false);
  const copy = () => {
    const done = () => {
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1500);
    };
    if (navigator.clipboard?.writeText) {
      navigator.clipboard.writeText(cmd).then(done).catch(done);
    } else {
      done();
    }
  };
  return (
    <div className="flex flex-col gap-2">
      <div className="flex w-full flex-col gap-0 rounded-2xl bg-background-secondary-default p-1">
        <div className="flex items-center justify-between">
          <span className="rounded-md px-2.5 py-1 text-body-medium text-text-primary">terminal</span>
          <div className="pe-1">
            <button
              type="button"
              aria-label="Copy"
              onClick={copy}
              className="flex size-7 cursor-pointer items-center justify-center rounded-2lg transition-colors outline-none hover:bg-background-primary-hover focus-visible:ring-2 focus-visible:ring-border-focus-ring"
            >
              <span className="relative inline-flex size-5 shrink-0 items-center justify-center">
                {copied ? (
                  <RiCheckLine className="size-5 text-foreground-icon-secondary" aria-hidden />
                ) : (
                  <RiFileCopyLine className="size-5 text-foreground-icon-secondary" aria-hidden />
                )}
              </span>
            </button>
          </div>
        </div>
        <div className="p-1">
          <div className="overflow-auto rounded-xl bg-docs-code-background px-5 py-3 shadow-[0px_2px_0px_0px_rgba(0,0,0,0.03),0px_1px_2px_0px_rgba(0,0,0,0.05),0px_6px_10px_0px_rgba(0,0,0,0.02)]">
            <code className="block font-mono text-[14px] leading-5 whitespace-pre text-text-secondary">{cmd}</code>
          </div>
        </div>
      </div>
      <div>
        <button
          type="button"
          onClick={copy}
          className="inline-flex cursor-pointer items-center justify-center gap-1.5 rounded-full border border-border-button-default bg-background-primary-default px-3.5 py-1.5 text-body-medium text-text-primary transition-colors outline-none hover:bg-background-primary-hover focus-visible:ring-2 focus-visible:ring-border-focus-ring"
        >
          {copied ? <RiCheckLine className="size-4" aria-hidden /> : <RiFileCopyLine className="size-4" aria-hidden />}
          {copied ? "コピーしました" : "コピーコマンド"}
        </button>
      </div>
    </div>
  );
}

const TOOLS: [string, string][] = [
  ["get_started", "Overview of BoardUI, the typical flow, RTL setup, and the Pro licensing rules."],
  ["list_components", "Every installable item with exact names, free and Pro, grouped by type."],
  ["get_component", "Description, dependencies, usage example, and full source for one item."],
  ["get_usage_examples", "Working code snippets from the item's docs page, Pro items included."],
  ["install_components", "Writes component source into the project and installs missing npm deps."],
  ["init_boardui", "One-time setup: Tailwind v4, runtime deps, theme and global styles, utils."],
  ["install_rules", "Writes the always-on design rules into AGENTS.md and .cursor/rules/."],
  ["get_skill", "Explains the agent skill: live SKILL.md, bundled files, install options per client."],
  ["install_skill", "Installs the BoardUI agent skill (catalog, theming, patterns) into .claude/skills/."],
  ["get_theme", "The theme tokens, type scale, global stylesheet, and RTL setup guidance."],
  ["activate_license", "Activates a BoardUI Pro license key on the machine and stores it."],
  ["license_status", "Whether a Pro license is active, with the key shown masked."],
  ["deactivate_license", "Releases the machine's Pro seat and removes the stored key."],
];

const EXAMPLE_PROMPTS = [
  "“ このプロジェクトにBoardUIを導入して、ボタン、セレクト、日付ピッカーを追加してください。 ”",
  "“ BoardUI Proを購入しました。ライセンスキーはXXXXです。有効化してAIチャットのテンプレートをインストールしてください。 ”",
  "“ BoardUIの認証カードとソーシャルボタンでサインイン画面を作ってください。 ”",
  "“ このBoardUIプロジェクトで、Proブロックとテンプレートを含め、アラビア語とヘブライ語のRTLを有効にしてください。 ”",
  "“ BoardUIのボタンにはどのようなプロパティがありますか？アイコン付きのバリエーションも見せてください。 ”",
  "“ BoardUIのデータテーブルを追加し、/api/ordersのエンドポイントに接続してください。 ”",
  "“ BoardUIのテーマトークンを見せて、プライマリボタンをブランドに合うスタイルに変更してください。 ”",
  "“ BoardUIの統計カード、エリアチャート、棒リストで売上ダッシュボードを作ってください。 ”",
];

const CLIENTS = ["Claude Code", "Cursor", "VS Code", "Codex", "その他のお客様"] as const;

const SHADCN_MCP_CODE = `{
  "registries": {
    "@boardui": "https://www.boardui.com/r/{name}.json"
  }
}`;


const MCP_STDIO_CODE = `{
  "mcpServers": {
    "boardui": {
      "command": "npx",
      "args": ["-y", "boardui@latest", "mcp"]
    }
  }
}`;

const VSCODE_MCP_CODE = `{
  "servers": {
    "boardui": {
      "command": "npx",
      "args": ["-y", "boardui@latest", "mcp"]
    }
  }
}`;

// One-click install deep links (standard Cursor / VS Code MCP install URL
// schemes; the configs above are the verbatim server configs).
const CURSOR_INSTALL_URL =
  "cursor://anysphere.cursor-deeplink/mcp/install?name=boardui&config=" +
  encodeURIComponent(
    JSON.stringify({ mcpServers: { boardui: { command: "npx", args: ["-y", "boardui@latest", "mcp"] } } }),
  );
const VSCODE_INSTALL_URL =
  "vscode:mcp/install?" +
  encodeURIComponent(
    JSON.stringify({ servers: { boardui: { command: "npx", args: ["-y", "boardui@latest", "mcp"] } } }),
  );

/** MCP server page, mirroring boardui.com/mcp. */
export default function McpPage() {
  const [client, setClient] = useState<(typeof CLIENTS)[number]>("Claude Code");
  return (
    <LocaleHtml locale="ja">
      <DocsLayout variant="library" hidePrevNext title="MCPサーバー" locale="ja">
        <div className="flex flex-col gap-8 pb-8">
          <div className="flex flex-col gap-3">
            <p className="text-body-regular text-text-secondary">
              BoardUIはMCPサーバーを提供しているので、AIエージェントにインストールを任せられます。Claude Code、Cursor、VS Code、CodexなどのMCPクライアントから、レジストリの参照、コンポーネントのソースと使用例の確認、新規プロジェクトのセットアップ、ファイルの直接書き込みができます。作りたいものを伝えるだけで、ターミナルとの行き来は不要です。
            </p>
            <p className="text-body-regular text-text-secondary">
              サーバはstdioを経由してローカルで実行します{" "}
              <code className="font-mono text-caption-1-medium text-text-primary">npx</code> で動作し、外部でのホストは不要です。無料コンポーネントは設定なしで利用でき、エージェントがライセンスキーを有効化すると、同じチャット内でBoardUI Proを利用できます。
            </p>
            <p className="text-body-regular text-text-secondary">
              以下のすべてのクライアントに共通する点として、MCPツールはセッション開始時に登録されます。セッションの途中でサーバーを追加した場合は、クライアントを再起動するか、新しいチャットを開いてください。そうしないと、接続済みでもツールが使えない状態になります。
            </p>
          </div>

          <Section title="セットアップ">
            <p className="text-body-regular text-text-secondary">
              お使いのクライアントを選んでください。CursorとVS Codeはワンクリック、Claude CodeとCodexはコマンド1つで導入できます。
            </p>
            <div className="flex flex-wrap gap-2">
              {CLIENTS.map((name) => (
                <button
                  key={name}
                  type="button"
                  onClick={() => setClient(name)}
                  className={cx(
                    "rounded-full border px-3.5 py-1.5 text-caption-1-semibold transition-colors",
                    client === name
                      ? "border-border-button-default bg-background-tertiary-default text-text-primary"
                      : "border-border-button-default bg-background-primary-default text-text-secondary hover:text-text-primary",
                  )}
                >
                  {name}
                </button>
              ))}
            </div>
            {client === "Claude Code" || client === "Codex" ? (
              <>
                <p className="text-body-regular text-text-secondary">
                  プロジェクトディレクトリに 1 つのコマンドを追加します。{" "}
                  <code className="font-mono text-caption-1-medium text-text-primary">--scope user</code> すべてのプロジェクトを有効にし、Claudeコード(または新しいセッションを開く)を再起動すると、ツールがバインドされます。
                </p>
                <Command cmd="claude mcp add boardui -- npx -y boardui@latest mcp" />
              </>
            ) : client === "Cursor" ? (
              <>
                <p className="text-body-regular text-text-secondary">
                ワンクリックでインストールするか、{" "}
                <code className="font-mono text-caption-1-medium text-text-primary">.cursor/mcp.json</code>{" "}
                にサーバーご自身で追加してから、Settings, Tools &amp; MCP で有効にしてください。
              </p>
                <div>
                  <ButtonLink href={CURSOR_INSTALL_URL}>Cursorに追加</ButtonLink>
                </div>
                <FileBlock file=".cursor/mcp.json" code={MCP_STDIO_CODE} />
              </>
            ) : client === "VS Code" ? (
              <>
                <p className="text-body-regular text-text-secondary">
                ワンクリックでインストールするか、{" "}
                <code className="font-mono text-caption-1-medium text-text-primary">.vscode/mcp.json</code>{" "}
                にサーバーを追加し、その横にある Start を押してください。
              </p>
                <div>
                  <ButtonLink href={VSCODE_INSTALL_URL}>VS Codeに追加</ButtonLink>
                </div>
                <FileBlock file=".vscode/mcp.json" code={VSCODE_MCP_CODE} />
              </>
            ) : (
              <>
                <p className="text-body-regular text-text-secondary">
                  Windsurf、Zed、Cline、およびその他のすべてのMCPクライアントは、同じstdioサーバーを使用します。MCPサーバーを保持する場所にこの設定をポイントします。
                </p>
                <FileBlock file="mcp.json" code={MCP_STDIO_CODE} />
              </>
            )}
          </Section>

          <Section title="Monorepos とカスタムエイリアス">
            <p className="text-body-regular text-text-secondary">
              ローカルMCPサーバーは同じオプションを読みます{" "}
              <code className="font-mono text-caption-1-medium text-text-primary">boardui.json</code> CLI として。{" "}
              宛先パッケージの横にそれを置きます{" "}
              <code className="font-mono text-caption-1-medium text-text-primary">package.json</code> パッケージの絶対パスをそのまま渡して下さい{" "}
              <code className="font-mono text-caption-1-medium text-text-primary">projectDir</code> とりあえず{" "}
              <code className="font-mono text-caption-1-medium text-text-primary">init_boardui</code>,{" "}
              <code className="font-mono text-caption-1-medium text-text-primary">install_components</code>, と{" "}
              <code className="font-mono text-caption-1-medium text-text-primary">install_rules</code> .ファイルとnpm依存関係は、設定されたインポートエイリアスで、そのパッケージにインストールします。
            </p>
            <p className="text-body-regular text-text-secondary">
              同じパスを渡して下さい{" "}
              <code className="font-mono text-caption-1-medium text-text-primary">projectDir</code> とりあえず{" "}
              <code className="font-mono text-caption-1-medium text-text-primary">get_component</code> そして、{" "}
              <code className="font-mono text-caption-1-medium text-text-primary">get_usage_examples</code>{" "}
              マッチングソースと例. それなしで, これらの読み取りツールは、元のレジストリのインポートを返します. パッケージのエクスポートと各アプリのスタイルはまだセットアップが必要です.
            </p>
            <div>
              <LinkButton href="/installation" trailingIcon={RiArrowRightSLine}>
                共有 UI パッケージの設定
              </LinkButton>
            </div>
          </Section>

          <Section title="あなたのエージェントを尋ねる">
            <p className="text-body-regular text-text-secondary">
              接続したら、エージェントをプレーン言語で話します。 いくつかのスターター:
            </p>
            <ul className="flex flex-col gap-1.5">
              {EXAMPLE_PROMPTS.map((prompt) => (
                <li key={prompt} className="flex items-start gap-2 text-body-regular text-text-secondary">
                  <span aria-hidden className="mt-[9px] size-1.5 shrink-0 rounded-full bg-foreground-icon-tertiary" />
                  {prompt}
                </li>
              ))}
            </ul>
          </Section>

<Section title="ツール">
          <p className="text-body-regular text-text-secondary">サーバがあなたのエージェントに露出するもの:</p>
          <div className="overflow-x-auto rounded-xl border border-border-button-default">
            <table className="w-full border-collapse text-start">
              <thead>
                <tr className="border-b border-separator-border bg-background-secondary-default">
                  <th className="px-4 py-2.5 text-start text-caption-1-semibold text-text-secondary">ツール</th>
                  <th className="px-4 py-2.5 text-start text-caption-1-semibold text-text-secondary">それが何をするのか</th>
                </tr>
              </thead>
              <tbody>
                {TOOLS.map(([tool, description]) => (
                  <tr key={tool} className="border-b border-separator-border last:border-b-0">
                    <td className="px-4 py-2.5 font-mono text-caption-1-medium text-text-primary">{tool}</td>
                    <td className="px-4 py-2.5 text-body-regular text-text-secondary">{description}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Section>

        <Section title="常にデザインルール">
          <p className="text-body-regular text-text-secondary">
            MCP ツールがオンデマンド: エージェントは、それが尋ねるとき、あなたのテーマだけを見て、独自の間隔、色、およびタイプを発明しないようにするモデル。だから{" "}
            <code className="font-mono text-caption-1-medium text-text-primary">init_boardui</code> (と{" "}
            <code className="font-mono text-caption-1-medium text-text-primary">npx boardui init</code>) また、エージェントがすべてのセッションをロードする常にオンの指示ファイルとして設計基盤をインストールします。フェンスされたセクション{" "}
            <code className="font-mono text-caption-1-medium text-text-primary">AGENTS.md</code> Cursorのルール{" "}
            <code className="font-mono text-caption-1-medium text-text-primary">.cursor/rules/boardui.mdc</code>
            . それらは皮色トークン、合成のタイプ スケール、間隔および半径の大会、暗モードをピンで止め、{" "}
            <code className="font-mono text-caption-1-medium text-text-primary">cx()</code>ファイルの残りの部分に触れることなく、セクションをリフレッシュして再実行します。
          </p>
          <p className="text-body-regular text-text-secondary">
            この前にプロジェクトを初期化しましたか? エージェントが実行されるように依頼する{" "}
            <code className="font-mono text-caption-1-medium text-text-primary">install_rules</code> .
          </p>
          <p className="text-body-regular text-text-secondary">
            フルカタログ、テーマ、ページパターンで、常に知識をロードしたいですか? インストール BoardUIの代理店のスキル MCP と一緒に ({" "}
            <code className="font-mono text-caption-1-medium text-text-primary">install_skill</code>, または{" "}
            <code className="font-mono text-caption-1-medium text-text-primary">npx boardui skill</code>).
          </p>
          <div>
            <LinkButton href="/skill" trailingIcon={RiArrowRightSLine}>
              BoardUIの代理店のスキル
            </LinkButton>
          </div>
        </Section>

        <Section title="MCP を上回るBoardUI Pro">
          <p className="text-body-regular text-text-secondary">
            プロのコンポーネントとテンプレートが表示される{" "}
            <code className="font-mono text-caption-1-medium text-text-primary">list_components</code> すべてのユーザーのために。 ライセンスがなければ、エージェントは、ソースの代わりに、説明、パブリック使用例、および購入指示を取得します。 あなたがProを購入すると、購入メールからライセンスキーをチャットに貼り付けます。 エージェントは、エージェントはそれをアクティブにします{" "}
            <code className="font-mono text-caption-1-medium text-text-primary">activate_license</code> (片席、随時発売){" "}
            <code className="font-mono text-caption-1-medium text-text-primary">deactivate_license</code>), そして、Proの項目から直接無料のもののようにインストールします. キーは、すべてのProのダウンロードでサーバー側検証されます.
          </p>
          <p className="text-body-regular text-text-secondary">
            すでにログインしている{" "}
            <code className="font-mono text-caption-1-medium text-text-primary">boardui login</code>? MCP サーバーは、同じ保存されたライセンスを使用して、何もやり直しません。
          </p>
        </Section>

        <Section title="匿名テレメトリー">
          <p className="text-body-regular text-text-secondary">
            インストールが成功すると、CLIと同じ匿名のイベント（コンポーネント名、パッケージマネージャー、バージョン）をMCP経由として報告します。プロジェクトのパス、プロンプト、ソースコードは含みません。無効にする設定は{" "}
            <code className="font-mono text-caption-1-medium text-text-primary">BOARDUI_TELEMETRY_DISABLED=1</code>{" "}
            または <code className="font-mono text-caption-1-medium text-text-primary">DO_NOT_TRACK=1</code> サーバの環境で。
          </p>
        </Section>

        <Section title="shadcn の MCP を代わりに使用">
          <p className="text-body-regular text-text-secondary">
            BoardUIのレジストリはshadcnのスキーマに対応しています。すでにshadcn MCPサーバーを使っているエージェントからもBoardUIにアクセスできます。次の設定に名前空間を追加してください：{" "}
            <code className="font-mono text-caption-1-medium text-text-primary">components.json</code> お問い合わせ{" "}
            <code className="font-mono text-caption-1-medium text-text-primary">@boardui/button</code>.
            上記のBoardUIサーバーなら、使用例、プロジェクトのセットアップ、Proライセンスの機能も利用できます。
          </p>
          <FileBlock file="components.json" code={SHADCN_MCP_CODE} />
        </Section>

        <Section title="内部の仕組み">
          <p className="text-body-regular text-text-secondary">
            <code className="font-mono text-caption-1-medium text-text-primary">npx boardui@latest mcp</code>{" "}
            はCLIと同じエンジンを起動し、stdioでMCP通信を行います。boardui.comから公開レジストリを取得し、コンポーネント間の依存関係を再帰的に解決して、標準の構成または指定した設定に従ってファイルを書き込みます：{" "}
            <code className="font-mono text-caption-1-medium text-text-primary">boardui.json</code>{" "}
            マッピング。 セットアップをチェックするために手動で実行することもできます。
          </p>
          <PkgCommand npm="npx boardui@latest mcp" pnpm="pnpm dlx boardui@latest mcp" yarn="yarn dlx boardui@latest mcp" />
        </Section>

        <PrevNext
          locale="ja"
          prev={{ href: "/installation", label: "インストール", sub: "フレームワークセットアップガイド" }}
          next={{ href: "/skill", label: "エージェントスキル", sub: "あなたの代理店のための知識" }}
        />
      </div>
    </DocsLayout>
  </LocaleHtml>
  );
}
