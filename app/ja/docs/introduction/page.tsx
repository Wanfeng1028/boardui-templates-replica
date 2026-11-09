"use client";

import Link from "next/link";
import { RiArrowLeftLine, RiArrowRightSLine } from "@remixicon/react";
import { DocsLayout } from "@/components/application/docs/docs-layout";
import { LocaleHtml } from "@/components/application/docs/locale-html";
import { LinkButton } from "@/components/base/buttons/link-button";

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="mb-8">
      <h2 className="mb-4 text-xl font-semibold">{title}</h2>
      {children}
    </section>
  );
}

export default function Page() {
  return (
    <LocaleHtml locale="ja">
      <DocsLayout variant="docs" locale="ja" eyebrow="Docs・はじめる" title="導入事例">
        <Section title="BoardUIとは?">
          <p className="mb-4">
            BoardUIは、Tailwind CSSで実装し、Figmaで設計したReactコンポーネントのオープンソースコレクションです。Figma MCPサーバーを通じてマスターのFigmaファイルから直接コードに変換することで、デザインと実装を一致させています。
          </p>
          <p>デザインフェーズをスキップします。コピー、ペースト、ビルドだけです。</p>
        </Section>

        <Section title="テックスタック">
          <ul className="mb-4 list-disc pl-6">
            <li>React 19</li>
            <li>Next.js 16(アプリルータ) — ショーケースサイト用</li>
            <li>tailwind CSS v4 (CSS-first config 経由 @theme)</li>
            <li>TypeScript</li>
            <li>React Aria コンポーネント — アクセシビリティ プリミティブ, 必要に応じて per コンポーネントを追加</li>
          </ul>
        </Section>

        <Section title="自由対プロ">
          <ul className="mb-4 list-disc pl-6">
            <li>
              <strong>無料</strong> — ベースコンポーネント(ボタン、入力、チェックボックス、バッジ、アバターなど)。 許認可。 オープンソース。
            </li>
            <li>
              <strong>Pro</strong> — 構成されたブロック、ページテンプレート、複雑なパターン(データテーブル、コマンドメニュー、チャート、ダッシュボード)。ワンタイムライセンス料。
            </li>
          </ul>
        </Section>

        <Section title="出典、依存関係なし">
          <p className="mb-4">
            BoardUIはランタイムライブラリではありません。コンポーネントを追加すると、そのソースはプロジェクトにコピーされます。npm install、vendor lock-inはありません。コードを所有し、それを変更します。
          </p>
        </Section>

        <Section title="BoardUIと他のライブラリの比較">
          <p className="mb-4">
            BoardUIと、shadcn/uiからPrimeReactまでの他の9つのライブラリで同じ設定ダイアログを作り、それぞれをテストしました。
          </p>
          <p>Reactデザインシステム ベスト10の比較記事を読む（英語）。</p>
        </Section>

        <Section title="次のステップ">
          <p className="mb-4">ヘッドオーバーインストールガイドプロジェクトをセットアップするか、または参照するためにコンポーネントギャラリー。</p>
          <div className="mb-4 flex gap-4">
            <LinkButton href="/installation">インストールガイド</LinkButton>
            <LinkButton href="/components">コンポーネントギャラリー</LinkButton>
          </div>
        </Section>

        <Link href="/components" className="inline-flex items-center gap-1 text-sm font-medium hover:underline">
          <RiArrowLeftLine className="size-4" />
          すべてのコンポーネントに戻る
        </Link>
      </DocsLayout>
    </LocaleHtml>
  );
}
