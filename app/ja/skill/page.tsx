"use client";

import { RiArrowRightSLine } from "@remixicon/react";

import { DocsLayout } from "@/components/application/docs/docs-layout";
import { CodeTabs, PkgCommand } from "@/components/application/docs/code-tabs";
import { PrevNext } from "@/components/application/docs/prev-next";
import { LinkButton } from "@/components/base/buttons/link-button";
import { LocaleHtml } from "@/components/application/docs/locale-html";

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

/** Agent Skills page, mirroring boardui.com/ja/skill. */
export default function SkillPage() {
  return (
    <LocaleHtml locale="ja">
      <DocsLayout variant="library" hidePrevNext locale="ja" title="エージェントスキル">
        <div className="flex flex-col gap-8 pb-8">
          <div className="flex flex-col gap-3">
            <p className="text-body-regular text-text-secondary">
              コマンド1つで、AIアシスタントがBoardUIの全コンポーネント、テンプレート、デザインルール、テーマ、パターン、アニメーションを把握できます。Claude
              Code、Codexなどのスキル対応エージェントが自動で読み込み、実際のBoardUIコンポーネントを使って構築します。
            </p>
            <p className="text-body-regular text-text-secondary">
              スキルは、オープンに従う{" "}
              <code className="font-mono text-caption-1-medium text-text-primary">SKILL.md</code>{" "}
              標準: エージェントが発見するマークダウン、サーバーは必要ありません。
              コンテンツは、すべてのインストールで boardui.com から新鮮に取得されます。
            </p>
          </div>

          <Section title="インストール">
            <p className="text-body-regular text-text-secondary">
              プロジェクトのルートでコマンド1つを実行します。保存先に合うタブを選んでください。標準の保存先は{" "}
              <code className="font-mono text-caption-1-medium text-text-primary">.claude/skills/boardui</code>{" "}
              プロジェクトでは、あなたのレポとチーム全体のエージェントがそれをピックアップするスキルが乗っています。グローバルとエージェントのディレクトリは、CodexやGeminiなどのユーザーワイドなインストールやクライアントをカバーしています。
            </p>
            <CodeTabs
              tabs={[
                { value: "Project (default)", code: "npx boardui@latest skill" },
                { value: "グローバル", code: "npx boardui@latest skill --global" },
                { value: "Codex & Gemini", code: "npx boardui@latest skill --client codex" },
                { value: "Custom path", code: "npx boardui@latest skill --path .agents/skills/boardui" },
              ]}
            />
            <p className="text-body-regular text-text-secondary">
              すでにBoardUI MCPサーバーに接続されていますか? エージェントが実行するように依頼してください{" "}
              <code className="font-mono text-caption-1-medium text-text-primary">install_skill</code>{" "}
              、必要なターミナル無し。
            </p>
          </Section>

          <Section title="内なるもの">
            <p className="text-body-regular text-text-secondary">
              ライアン{" "}
              <code className="font-mono text-caption-1-medium text-text-primary">SKILL.md</code>{" "}
              エージェントは、常に読み込みます。また、要求に応じて読み込まれる参照ファイル(プログレッシブ・ディスクロージャー、スキル標準):
            </p>
            <SubSection title="SKILL.md">
              <p className="text-body-regular text-text-secondary">
                The core file your agent always loads: the build workflow (detect setup, discover, install,
                compose, verify), a digest of the design rules, guidance on choosing the right component for the
                job, known gotchas, and how Pro licensing works.
              </p>
            </SubSection>
            <SubSection title="references/components.md">
              <p className="text-body-regular text-text-secondary">
                The full catalog, generated from the live registry: every component and template with description,
                install command, and a usage example.
              </p>
            </SubSection>
            <SubSection title="references/theming.md">
              <p className="text-body-regular text-text-secondary">
                Token architecture, the semantic color families, the composite type scale, dark mode mechanics,
                and how to rebrand the accent ramp.
              </p>
            </SubSection>
            <SubSection title="references/patterns.md">
              <p className="text-body-regular text-text-secondary">
                Page anatomy recipes: dashboard, table page, auth, AI chat, and settings, each as an annotated
                skeleton with real imports.
              </p>
            </SubSection>
            <SubSection title="references/motion.md">
              <p className="text-body-regular text-text-secondary">
                The hand-tuned micro-animation language: the duration scale, signature easings, the blur-in
                entrance, press feedback, springs.
              </p>
            </SubSection>
          </Section>

          <Section title="クライアントが通る場所">
            <p className="text-body-regular text-text-secondary">
              クロード・コードは、プロジェクトのスキルを発見します{" "}
              <code className="font-mono text-caption-1-medium text-text-primary">.claude/skills/</code>{" "}
              (デフォルトインストール) と in{" "}
              <code className="font-mono text-caption-1-medium text-text-primary">~/.claude/skills/</code>{" "}(
              <code className="font-mono text-caption-1-medium text-text-primary">--global</code>{" "}）。
              エージェントの慣習を読んで共有するCodex、Gemini CLI、およびその他のクライアント{" "}
              <code className="font-mono text-caption-1-medium text-text-primary">~/.agents/skills/</code>{" "}(
              <code className="font-mono text-caption-1-medium text-text-primary">--client codex</code>{" "}).
              その他:{" "}
              <code className="font-mono text-caption-1-medium text-text-primary">--path</code>{" "}
              で、クライアントが参照する場所にフォルダーを配置します。スキルはセッションの開始時に読み込まれるので、インストール後はエージェントを再起動するか、新しいチャットを開いてください。
            </p>
          </Section>

          <Section title="更新情報">
            <p className="text-body-regular text-text-secondary">
              スキルは、そのフロントマッターでバージョンスタンプを運びます,
              レジストリは、すべてのデプロイにそれを再構築:
              新しいコンポーネントは、自動的にカタログに表示されます. インストールを再実行する{" "}
              <code className="font-mono text-caption-1-medium text-text-primary">--force</code>{" "}
              インストールされたコマンドプリントとフェッチされたバージョンを更新し、変更した内容を見ることができます。
            </p>
            <PkgCommand
              npm="npx boardui@latest skill --force"
              pnpm="pnpm dlx boardui@latest skill --force"
              yarn="yarn dlx boardui@latest skill --force"
            />
          </Section>

        <Section title="スキル対MCP">
          <p className="text-body-regular text-text-secondary">
            彼らは互いに補完します。 スキルは、エージェントが常に持っている知識です: カタログ、ルール、パターン、ゼロセットアップですべてのセッションをロードしました。 MCP サーバー は実行用のツールです。コンポーネント全体のソース参照、ターミナルを使わないインストール、プロジェクト初期化、チャット内でのProライセンス有効化ができます。両方の導入がおすすめです。スキルは実際のBoardUIコンポーネントに基づく計画を支え、MCPはその実行を担います。
          </p>
          <div>
            <LinkButton href="/mcp" trailingIcon={RiArrowRightSLine}>
              MCP サーバー
            </LinkButton>
          </div>
        </Section>

        <Section title="BoardUI Pro">
          <p className="text-body-regular text-text-secondary">
            スキルのカタログは、Proコンポーネントとテンプレートもカバーし、PROをマークし、パブリックな使用例ではなく、ソースを生成しません。 Proライセンスを一度有効化(Pro license) <code className="font-mono text-caption-1-medium text-text-primary">npx boardui@latest login &lt;key&gt;</code> , あなたのレモンスクイージーレシートのキー), あなたのエージェントは、まさに無料のもののようにプロアイテムをインストールします. 一つなし, それは存在し、あなたにポイントを知っています プライシング ではなく、lookalike で推測します。
          </p>
          <div>
            <LinkButton href="/pricing" trailingIcon={RiArrowRightSLine}>
              プライシング
            </LinkButton>
          </div>
        </Section>

        <PrevNext
          prev={{ href: "/mcp", label: "MCPサーバー", sub: "エージェントがインストールを代行" }}
          next={{ href: "/rtl", label: "RTLサポート" }}
          locale="ja"
        />
      </div>
    </DocsLayout>
    </LocaleHtml>
  );
}
