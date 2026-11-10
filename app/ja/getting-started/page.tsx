"use client";

import { useEffect, useState, type CSSProperties } from "react";
import {
  RiArrowDownSLine,
  RiArrowRightLine,
  RiBarChartBoxLine,
  RiCheckLine,
  RiCodeSSlashLine,
  RiContrastLine,
  RiFileCopyLine,
  RiPencilRuler2Line,
  RiPlugLine,
  RiShieldCheckLine,
} from "@remixicon/react";

import { DocsLayout } from "@/components/application/docs/docs-layout";
import { LocaleHtml } from "@/components/application/docs/locale-html";
import { GettingStartedShowcase } from "@/components/application/docs/getting-started-showcase";
import { PrevNext } from "@/components/application/docs/prev-next";
import { HeroRays } from "@/components/application/landing/hero-rays/hero-rays";
import { HERO_RAYS_DEFAULTS } from "@/components/application/landing/hero-rays/hero-rays-config";
import { ProLogoMark } from "@/components/application/landing/pro-logo-mark";
import {
  Dropdown,
  DropdownItem,
  DropdownPopover,
  DropdownTrigger,
} from "@/components/base/dropdown/dropdown";
import { ButtonLink } from "@/components/base/buttons/button";
import { SegmentedControl, SegmentedControlItem } from "@/components/base/segmented-control/segmented-control";
import { cx } from "@/utils/cx";

/** Plain-text markdown of this page, for the Copy Page button. */
const PAGE_MARKDOWN = `# はじめに

BoardUIの概要、インストール方法、AIエージェントの使い方、色と文字の仕組みまで。ゼロから動くプロジェクトを作るために必要な情報を、1ページにまとめています。

## Reactデザインシステム エージェントインターフェイス用

BoardUIはReactの設計システムです。103個のユニークなコンポーネント（19個のデータチャートを含む）、10個のプロテンプレート、400以上のデザイントークンを持ち、Figmaでデザインされています。

## なぜBoardUI

- ソースコードはあなたのもの — Components are copied into your project as plain React + Tailwind files. No runtime package, no lock-in, nothing you cannot open and edit.
- AIエージェント向け構築 — An MCP server installs components on request, and always-on design rules keep your agent on the token system instead of inventing its own.
- デフォルトでアクセス可能 — Every form component builds on React Aria: labels, focus management, keyboard behavior, and ARIA wiring come included.
- Figmaで最初に設計されている — Every component starts as a finished Figma frame and lands in code pixel for pixel, carried by 400+ design tokens.
- ダークモード内蔵 — Semantic tokens flip automatically under the .dark class. You never write a dark: override or a raw hex value.
- 一日からのデータ量 — 19 chart cards, dashboard blocks, and 10 full-page templates, made for products where the data is the interface.

## インストール

\`\`\`
npx boardui@latest init
npx boardui@latest add button select date-picker
\`\`\`

## MCP サーバー

BoardUIはMCPを話します：エージェントを一度接続すれば、103個すべてのコンポーネントを実際の使用例とともに閲覧でき、プロジェクトをセットアップしてソースファイルを書き込みます。同じチャット内で、ライセンスキーによるProの有効化もできます。

## 無料とプロ

無料 — 73個のコンポーネントとブロック、MITライセンス。BoardUI Pro — 買い切りで30個のProコンポーネントとブロック、および全10個のフルページテンプレートがアンロックされ、生涯アップデート付き。

## カラー

文字、背景、境界線、アイコン、チャートの色は、すべて用途に応じたトークンで定義しています。コンポーネント全体の統一感を保ち、ダークモードにも自動的に対応します。

## タイポグラフィ

Figmaの文字スタイルは、サイズ、太さ、行の高さ、字間をまとめた複合ユーティリティとして提供されます。text-sm font-medium のような断片を組み立てるのではなく、文字スタイルを選ぶだけで設定できます。
`;
function CopyPageButton() {
  const [copied, setCopied] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const copy = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
    } catch {
      // Clipboard access can be refused; leave the icon unchanged.
      return;
    }
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1500);
    setMenuOpen(false);
  };
  return (
    <div className="flex items-stretch">
      <button
        type="button"
        onClick={() => copy(PAGE_MARKDOWN)}
        className="inline-flex cursor-pointer items-center justify-center gap-0.5 rounded-s-2lg border border-e-0 border-border-button-default bg-background-primary-default p-2 shadow-xs transition-colors outline-none hover:bg-background-primary-hover focus-visible:ring-2 focus-visible:ring-border-focus-ring"
      >
        <span className="relative inline-flex size-5 shrink-0 items-center justify-center">
          <RiFileCopyLine
            className={cx(
              "absolute size-5 text-foreground-icon-secondary transition-[transform,opacity,filter] duration-200 ease-out",
              copied ? "scale-75 opacity-0 blur-[2px]" : "scale-100 opacity-100 blur-0",
            )}
            aria-hidden
          />
          <RiCheckLine
            className={cx(
              "absolute size-5 text-foreground-icon-secondary transition-[transform,opacity,filter] duration-200 ease-out",
              copied ? "scale-100 opacity-100 blur-0" : "scale-75 opacity-0 blur-[2px]",
            )}
            aria-hidden
          />
        </span>
        <span className="px-1 text-body-medium whitespace-nowrap text-text-primary">
          {copied ? "コピーしました" : "ページをコピー"}
        </span>
      </button>
      <Dropdown isOpen={menuOpen} onOpenChange={setMenuOpen}>
        <DropdownTrigger
          aria-label="AI向けコピーのオプション"
          className="inline-flex cursor-pointer items-center justify-center rounded-e-2lg border border-border-button-default bg-background-primary-default px-1.5 shadow-xs transition-colors hover:bg-background-primary-hover"
        >
          <RiArrowDownSLine
            className={cx(
              "size-5 shrink-0 text-foreground-icon-secondary transition-transform duration-200",
              menuOpen && "rotate-180",
            )}
            aria-hidden
          />
        </DropdownTrigger>
        <DropdownPopover aria-label="コピーオプション" placement="bottom end" className="w-[220px] p-2" dialogClassName="gap-1">
          <DropdownItem className="px-2 py-1.5" onSelect={() => copy(PAGE_MARKDOWN)}>
            <span className="flex-1 text-body-medium">コードをコピー</span>
          </DropdownItem>
          <DropdownItem className="px-2 py-1.5" onSelect={() => copy(window.location.href)}>
            <span className="flex-1 text-body-medium">ページリンクをコピー</span>
          </DropdownItem>
        </DropdownPopover>
      </Dropdown>
    </div>
  );
}

type PackageManager = "npm" | "pnpm" | "yarn";

/**
 * npm / pnpm / yarn switcher over one install command, as on the original:
 * segmented track, icon copy button, syntax-highlighted code panel.
 * The pink runner colour is the original's literal (#fb64b6); the command
 * itself rides the docs-command-accent token.
 */
function DocsPkgCommand({ npm, pnpm, yarn }: { npm: string; pnpm: string; yarn: string }) {
  const [pm, setPm] = useState<PackageManager>("npm");
  const [copied, setCopied] = useState(false);
  const cmd = pm === "npm" ? npm : pm === "pnpm" ? pnpm : yarn;
  const [runner, ...rest] = cmd.split(" ");
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(cmd);
    } catch {
      // Clipboard access can be refused; still show the confirmation.
    }
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1500);
  };
  return (
    <div className="flex w-full flex-col gap-0 rounded-2xl bg-background-secondary-default p-1">
      <div className="flex items-center justify-between">
        <SegmentedControl
          aria-label="Package manager"
          selectedKeys={[pm]}
          onSelectionChange={(keys) => {
            const [key] = [...(keys as Set<string>)];
            if (key === "npm" || key === "pnpm" || key === "yarn") setPm(key);
          }}
        >
          <SegmentedControlItem id="npm">npm</SegmentedControlItem>
          <SegmentedControlItem id="pnpm">pnpm</SegmentedControlItem>
          <SegmentedControlItem id="yarn">yarn</SegmentedControlItem>
        </SegmentedControl>
        <div className="pe-1">
          <button
            type="button"
            aria-label="Copy"
            onClick={copy}
            className="flex size-7 cursor-pointer items-center justify-center rounded-2lg transition-colors outline-none hover:bg-background-primary-hover focus-visible:ring-2 focus-visible:ring-border-focus-ring"
          >
            <span className="relative inline-flex size-5 shrink-0 items-center justify-center">
              <RiFileCopyLine
                className={cx(
                  "absolute size-5 text-foreground-icon-secondary transition-[transform,opacity,filter] duration-200 ease-out",
                  copied ? "scale-75 opacity-0 blur-[2px]" : "scale-100 opacity-100 blur-0",
                )}
                aria-hidden
              />
              <RiCheckLine
                className={cx(
                  "absolute size-5 text-foreground-icon-secondary transition-[transform,opacity,filter] duration-200 ease-out",
                  copied ? "scale-100 opacity-100 blur-0" : "scale-75 opacity-0 blur-[2px]",
                )}
                aria-hidden
              />
            </span>
          </button>
        </div>
      </div>
      <div className="p-1">
        <div className="flex h-14 items-center overflow-x-auto rounded-xl bg-docs-code-background px-5 py-3 shadow-[0px_2px_0px_0px_rgba(0,0,0,0.03),0px_1px_2px_0px_rgba(0,0,0,0.05),0px_6px_10px_0px_rgba(0,0,0,0.02)]">
          <code className="font-mono text-[14px] leading-5 whitespace-nowrap">
            <span className="text-[#fb64b6]">{runner}</span>
            <span className="text-text-secondary"> </span>
            <span className="text-docs-command-accent">{rest.join(" ")}</span>
          </code>
        </div>
      </div>
    </div>
  );
}

function Section({ id, title, children }: { id: string; title: string; children: React.ReactNode }) {
  return (
    <section className="flex scroll-mt-14 flex-col gap-4 pt-10">
      <h2 id={id} className="scroll-mt-14 text-title-2-medium text-text-primary">
        {title}
      </h2>
      {children}
    </section>
  );
}
const REDUCED_MOTION_QUERY = "(prefers-reduced-motion: reduce)";

function Hero() {
  const [reduceMotion, setReduceMotion] = useState(false);
  useEffect(() => {
    setReduceMotion(window.matchMedia(REDUCED_MOTION_QUERY).matches);
  }, []);
  return (
    <div className="relative mt-4 overflow-clip rounded-3xl border border-border-button-default pt-10 dark:border-separator-border">
      <div
        aria-hidden
        style={{ "--hero-shader-height": "1060px" } as CSSProperties}
        className="pointer-events-none absolute inset-x-0 top-0 z-0 h-[420px] overflow-hidden select-none sm:h-[620px] lg:h-[var(--hero-shader-height)]"
      >
        <HeroRays config={HERO_RAYS_DEFAULTS} paused={reduceMotion} className="absolute inset-0 size-full" />
      </div>
      <div className="relative z-10 mx-auto flex max-w-[560px] flex-col items-center px-6 text-center">
        <h2 className="text-[28px] leading-[34px] font-medium tracking-[-0.02em] text-text-primary sm:text-[36px] sm:leading-[43px]">
          <span className="block">Reactデザインシステム</span>
          <span className="block">エージェントインターフェイス用</span>
        </h2>
        <p className="mt-3 text-body-regular text-pretty text-text-secondary">
          BoardUIはReactの設計システムです。 103 ユニークなコンポーネントを含む 19 データチャート、プラス 10
          プロテンプレートと400以上のデザイントークン、Figmaでデザインされています。
        </p>
      </div>
      <GettingStartedShowcase />
    </div>
  );
}

const WHY_ITEMS = [
  {
    icon: RiCodeSSlashLine,
    title: "ソースコードはあなたのもの",
    text: "Components are copied into your project as plain React + Tailwind files. No runtime package, no lock-in, nothing you cannot open and edit.",
  },
  {
    icon: RiPlugLine,
    title: "AIエージェント向け構築",
    text: "An MCP server installs components on request, and always-on design rules keep your agent on the token system instead of inventing its own.",
  },
  {
    icon: RiShieldCheckLine,
    title: "デフォルトでアクセス可能",
    text: "Every form component builds on React Aria: labels, focus management, keyboard behavior, and ARIA wiring come included.",
  },
  {
    icon: RiPencilRuler2Line,
    title: "Figmaで最初に設計されている",
    text: "Every component starts as a finished Figma frame and lands in code pixel for pixel, carried by 400+ design tokens.",
  },
  {
    icon: RiContrastLine,
    title: "ダークモード内蔵",
    text: "Semantic tokens flip automatically under the .dark class. You never write a dark: override or a raw hex value.",
  },
  {
    icon: RiBarChartBoxLine,
    title: "一日からのデータ量",
    text: "19 chart cards, dashboard blocks, and 10 full-page templates, made for products where the data is the interface.",
  },
];

/** MCP client chips. The four brand marks are the original's own inline
 * SVGs, copied verbatim — the central vendor library holds Claude and
 * OpenAI only, with no Cursor / VS Code / Codex asset. */
const MCP_CLIENTS: { name: string; fill: string; d: string }[] = [
  { name: "Claude Code", fill: "#D97757", d: "m4.7144 15.9555 4.7174-2.6471.079-.2307-.079-.1275h-.2307l-.7893-.0486-2.6956-.0729-2.3375-.0971-2.2646-.1214-.5707-.1215-.5343-.7042.0546-.3522.4797-.3218.686.0608 1.5179.1032 2.2767.1578 1.6514.0972 2.4468.255h.3886l.0546-.1579-.1336-.0971-.1032-.0972L6.973 9.8356l-2.55-1.6879-1.3356-.9714-.7225-.4918-.3643-.4614-.1578-1.0078.6557-.7225.8803.0607.2246.0607.8925.686 1.9064 1.4754 2.4893 1.8336.3643.3035.1457-.1032.0182-.0728-.164-.2733-1.3539-2.4467-1.445-2.4893-.6435-1.032-.17-.6194c-.0607-.255-.1032-.4674-.1032-.7285L6.287.1335 6.6997 0l.9957.1336.419.3642.6192 1.4147 1.0018 2.2282 1.5543 3.0296.4553.8985.2429.8318.091.255h.1579v-.1457l.1275-1.706.2368-2.0947.2307-2.6957.0789-.7589.3764-.9107.7468-.4918.5828.2793.4797.686-.0668.4433-.2853 1.8517-.5586 2.9021-.3643 1.9429h.2125l.2429-.2429.9835-1.3053 1.6514-2.0643.7286-.8196.85-.9046.5464-.4311h1.0321l.759 1.1293-.34 1.1657-1.0625 1.3478-.8804 1.1414-1.2628 1.7-.7893 1.36.0729.1093.1882-.0183 2.8535-.607 1.5421-.2794 1.8396-.3157.8318.3886.091.3946-.3278.8075-1.967.4857-2.3072.4614-3.4364.8136-.0425.0304.0486.0607 1.5482.1457.6618.0364h1.621l3.0175.2247.7892.522.4736.6376-.079.4857-1.2142.6193-1.6393-.3886-3.825-.9107-1.3113-.3279h-.1822v.1093l1.0929 1.0686 2.0035 1.8092 2.5075 2.3314.1275.5768-.3218.4554-.34-.0486-2.2039-1.6575-.85-.7468-1.9246-1.621h-.1275v.17l.4432.6496 2.3436 3.5214.1214 1.0807-.17.3521-.6071.2125-.6679-.1214-1.3721-1.9246L14.38 17.959l-1.1414-1.9428-.1397.079-.674 7.2552-.3156.3703-.7286.2793-.6071-.4614-.3218-.7468.3218-1.4753.3886-1.9246.3157-1.53.2853-1.9004.17-.6314-.0121-.0425-.1397.0182-1.4328 1.9672-2.1796 2.9446-1.7243 1.8456-.4128.164-.7164-.3704.0667-.6618.4008-.5889 2.386-3.0357 1.4389-1.882.929-1.0868-.0062-.1579h-.0546l-6.3385 4.1164-1.1293.1457-.4857-.4554.0608-.7467.2307-.2429 1.9064-1.3114Z" },
  { name: "Cursor", fill: "currentColor", d: "M11.503.131 1.891 5.678a.84.84 0 0 0-.42.726v11.188c0 .3.162.575.42.724l9.609 5.55a1 1 0 0 0 .998 0l9.61-5.55a.84.84 0 0 0 .42-.724V6.404a.84.84 0 0 0-.42-.726L12.497.131a1.01 1.01 0 0 0-.996 0M2.657 6.338h18.55c.263 0 .43.287.297.515L12.23 22.918c-.062.107-.229.064-.229-.06V12.335a.59.59 0 0 0-.295-.51l-9.11-5.257c-.109-.063-.064-.23.061-.23" },
  { name: "VS Code", fill: "#007ACC", d: "M23.15 2.587L18.21.21a1.494 1.494 0 0 0-1.705.29l-9.46 8.63-4.12-3.128a.999.999 0 0 0-1.276.057L.327 7.261A1 1 0 0 0 .326 8.74L3.899 12 .326 15.26a1 1 0 0 0 .001 1.479L1.65 17.94a.999.999 0 0 0 1.276.057l4.12-3.128 9.46 8.63a1.492 1.492 0 0 0 1.704.29l4.942-2.377A1.5 1.5 0 0 0 24 20.06V3.939a1.5 1.5 0 0 0-.85-1.352zm-5.146 14.861L10.826 12l7.178-5.448v10.896z" },
  { name: "Codex", fill: "currentColor", d: "M22.2819 9.8211a5.9847 5.9847 0 0 0-.5157-4.9108 6.0462 6.0462 0 0 0-6.5098-2.9A6.0651 6.0651 0 0 0 4.9807 4.1818a5.9847 5.9847 0 0 0-3.9977 2.9 6.0462 6.0462 0 0 0 .7427 7.0966 5.98 5.98 0 0 0 .511 4.9107 6.051 6.051 0 0 0 6.5146 2.9001A5.9847 5.9847 0 0 0 13.2599 24a6.0557 6.0557 0 0 0 5.7718-4.2058 5.9894 5.9894 0 0 0 3.9977-2.9001 6.0557 6.0557 0 0 0-.7475-7.0729zm-9.022 12.6081a4.4755 4.4755 0 0 1-2.8764-1.0408l.1419-.0804 4.7783-2.7582a.7948.7948 0 0 0 .3927-.6813v-6.7369l2.02 1.1686a.071.071 0 0 1 .038.052v5.5826a4.504 4.504 0 0 1-4.4945 4.4944zm-9.6607-4.1254a4.4708 4.4708 0 0 1-.5346-3.0137l.142.0852 4.783 2.7582a.7712.7712 0 0 0 .7806 0l5.8428-3.3685v2.3324a.0804.0804 0 0 1-.0332.0615L9.74 19.9502a4.4992 4.4992 0 0 1-6.1408-1.6464zM2.3408 7.8956a4.485 4.485 0 0 1 2.3655-1.9728V11.6a.7664.7664 0 0 0 .3879.6765l5.8144 3.3543-2.0201 1.1685a.0757.0757 0 0 1-.071 0l-4.8303-2.7865A4.504 4.504 0 0 1 2.3408 7.872zm16.5963 3.8558L13.1038 8.364 15.1192 7.2a.0757.0757 0 0 1 .071 0l4.8303 2.7913a4.4944 4.4944 0 0 1-.6765 8.1042v-5.6772a.79.79 0 0 0-.407-.667zm2.0107-3.0231l-.142-.0852-4.7735-2.7818a.7759.7759 0 0 0-.7854 0L9.409 9.2297V6.8974a.0662.0662 0 0 1 .0284-.0615l4.8303-2.7866a4.4992 4.4992 0 0 1 6.6802 4.66zM8.3065 12.863l-2.02-1.1638a.0804.0804 0 0 1-.038-.0567V6.0742a4.4992 4.4992 0 0 1 7.3757-3.4537l-.142.0805L8.704 5.459a.7948.7948 0 0 0-.3927.6813zm1.0976-2.3654l2.602-1.4998 2.6069 1.4998v2.9994l-2.5974 1.4997-2.6067-1.4997Z" },
];

const TYPE_ROWS: { sample: string; token: string; label?: string }[] = [
  { sample: "データを転送します。", token: "text-title-1-medium", label: "テキスト タイトル-1 中" },
  { sample: "データを転送します。", token: "text-title-2-medium", label: "text-title-2-medium テキスト タイトル2-medium" },
  { sample: "データを転送します。", token: "text-headline-medium", label: "テキストヘッドライン - 中" },
  { sample: "データを転送します。", token: "text-body-medium", label: "テキスト ボディ媒体" },
  { sample: "データを転送します。", token: "text-caption-1-semibold", label: "テキストキャプション-1-セミボルト" },
];
export default function GettingStartedPage() {
  return (
    <LocaleHtml locale="ja">
    <DocsLayout variant="library" title="はじめに" hideHeading hidePrevNext locale="ja">
      <header className="flex flex-col gap-3">
        <div className="flex items-center justify-between gap-4">
          <h1 className="text-title-1-medium text-text-primary">はじめに</h1>
          <div className="shrink-0">
            <CopyPageButton />
          </div>
        </div>
        <p className="text-headline-medium text-text-secondary">
          BoardUIの概要、インストール方法、AIエージェントの使い方、色と文字の仕組みまで。ゼロから動くプロジェクトを作るために必要な情報を、1ページにまとめています。
        </p>
      </header>

      <Hero />

      <Section id="why" title="なぜBoardUI">
        <div className="grid gap-1.5 rounded-[32px] bg-background-secondary-default p-1.5 sm:grid-cols-2 dark:bg-background-primary-default">
          {WHY_ITEMS.map((item) => (
            <div
              key={item.title}
              className="flex flex-col gap-3 rounded-[26px] bg-background-primary-default p-5 shadow-xs dark:bg-background-secondary-default"
            >
              <item.icon className="size-5 text-accent-600 dark:text-accent-400" aria-hidden />
              <div className="flex flex-col gap-1">
                <h3 className="text-body-semibold text-text-primary">{item.title}</h3>
                <p className="text-body-regular text-text-secondary">{item.text}</p>
              </div>
            </div>
          ))}
        </div>
      </Section>

      <Section id="installation" title="インストール">
        <p className="text-body-regular text-text-secondary">
          モノレポや独自のインポートエイリアスを使う場合は、共有UIパッケージにインストールできます。次のガイドに従ってください：{" "}
          <a className="text-accent-500 hover:underline" href="/installation#monorepos">
            Monorepoセットアップガイド
          </a>{" "}
          これらのコマンドを実行する前に。
        </p>
        <p className="-mt-1.5 text-headline-medium text-text-secondary">
          1つのコマンドは、React + Tailwind CSS v4 プロジェクトを設定します。ランタイム依存関係、テーマトークン、グローバルスタイル、{" "}
          <code className="rounded-md bg-background-secondary-default px-1.5 py-0.5 font-mono text-[13px] text-text-primary">
            cx
          </code>{" "}
          実用性および常にオンの代理店の設計規則。
        </p>
        <DocsPkgCommand
          npm="npx boardui@latest init"
          pnpm="pnpm dlx boardui@latest init"
          yarn="yarn dlx boardui@latest init"
        />
        <p className="text-headline-medium text-text-secondary">
          必要なコンポーネントを追加してください。内部の依存関係とnpmパッケージは自動的に解決されます：
        </p>
        <DocsPkgCommand
          npm="npx boardui@latest add button select date-picker"
          pnpm="pnpm dlx boardui@latest add button select date-picker"
          yarn="yarn dlx boardui@latest add button select date-picker"
        />
        <ButtonLink
          href="/installation"
          variant="secondary"
          trailingIcon={RiArrowRightLine}
          className="mt-1 self-start"
        >
          フレームワークガイドとマニュアルセットアップ
        </ButtonLink>
      </Section>

      <Section id="mcp" title="MCP サーバー">
        <p className="-mt-1.5 text-headline-medium text-text-secondary">
          BoardUIはMCPを話します:あなたの代理店を一度接続し、それはすべてをブラウズします 103 コンポーネントと実際の使用例を参照し、プロジェクトをセットアップしてソースファイルを書き込めます。同じチャット内で、ライセンスキーによるProの有効化もできます。
        </p>
        <div className="flex flex-wrap items-center gap-2">
          {MCP_CLIENTS.map((client) => (
            <span
              key={client.name}
              className="flex items-center gap-2 rounded-full border border-border-button-default bg-background-primary-default py-1.5 pr-3.5 pl-2.5 text-body-medium text-text-primary dark:border-separator-border dark:bg-background-secondary-default"
            >
              <svg
                viewBox="0 0 24 24"
                role="img"
                aria-hidden="true"
                style={{ width: 16, height: 16 }}
                className="shrink-0"
                fill={client.fill}
                xmlns="http://www.w3.org/2000/svg"
              >
                <path d={client.d} />
              </svg>
              {client.name}
            </span>
          ))}
        </div>
        <ButtonLink href="/mcp" variant="primary" trailingIcon={RiArrowRightLine} className="mt-1 self-start">
          エージェントを接続する
        </ButtonLink>
      </Section>
<Section id="free-and-pro" title="無料とプロ">
        <div className="grid gap-3 sm:grid-cols-2">
          <div className="flex flex-col gap-2 rounded-3xl border border-border-button-default bg-background-primary-default p-5 dark:border-separator-border dark:bg-background-secondary-default">
            <div className="mb-1.5">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/brand/boardui_logo.png" alt="BoardUI" width={48} height={48} className="shrink-0" />
            </div>
            <h3 className="-mb-1 text-body-semibold text-text-primary">無料</h3>
            <p className="text-body-regular text-text-secondary">
              73 種類のコンポーネントとブロック。ボタン、入力、テーブル、ドロップダウン、日付ピッカー、サイドバー、認証カードに加え、トークンと文字スタイルの体系をすべて利用できます。MITライセンスでプロジェクト数は無制限。CLI、MCP、コピー＆ペーストでインストールできます。
            </p>
            <div className="mt-auto w-full pt-2">
              <ButtonLink href="/components" variant="secondary" trailingIcon={RiArrowRightLine} className="w-full">
                すべてのコンポーネントを見る
              </ButtonLink>
            </div>
          </div>
          <div className="flex flex-col gap-2 rounded-3xl border border-border-button-default bg-background-primary-default p-5 dark:border-separator-border dark:bg-background-secondary-default">
            <div className="mb-1.5">
              <ProLogoMark scale={48 / 56} animated={false} />
            </div>
            <h3 className="-mb-1 text-body-semibold text-text-primary">BoardUI Pro</h3>
            <p className="text-body-regular text-text-secondary">
              ワンタイム購入のアンロック 30 種類のProコンポーネントとブロック。チャートカード、エージェント向けコンポーネント、AIチャットコンポーザーに加え、すべての 10 フルページのテンプレート、生涯の更新。 ライセンスを一度有効化し、Proは無料のもののように正確に作業をインストールします。
            </p>
            <div className="mt-auto w-full pt-2">
              <ButtonLink href="/pricing" variant="secondary" trailingIcon={RiArrowRightLine} className="w-full">
                料金を見る
              </ButtonLink>
            </div>
          </div>
        </div>
      </Section>

      <Section id="color" title="カラー">
        <p className="-mt-1.5 text-headline-medium text-text-secondary">
          文字、背景、境界線、アイコン、チャートの色は、すべて用途に応じたトークンで定義しています。コンポーネント全体の統一感を保ち、ダークモードにも自動的に対応します。アクセントの色階調はCTAと選択状態に使われ、1か所の上書きでブランドカラーに変更できます。
        </p>
        <div className="flex flex-col gap-3 rounded-2xl border border-border-button-default bg-background-primary-default p-5 dark:border-separator-border dark:bg-background-secondary-default">
          <div className="flex gap-1.5">
            {[100, 200, 300, 400, 500, 600, 700].map((shade) => (
              <span key={shade} className={`h-9 flex-1 rounded-lg bg-accent-${shade}`} />
            ))}
          </div>
          <p className="font-mono text-[12px] text-text-tertiary">
            accent-100 … accent-700 · text-text-primary · bg-background-secondary-default ·
            border-separator-border
          </p>
        </div>
        <ButtonLink
          href="/components/color"
          variant="secondary"
          trailingIcon={RiArrowRightLine}
          className="mt-1 self-start"
        >
          完全なトークン参照
        </ButtonLink>
      </Section>

      <Section id="typography" title="タイポグラフィ">
        <p className="-mt-1.5 text-headline-medium text-text-secondary">
          Figmaの文字スタイルは、サイズ、太さ、行の高さ、字間をまとめたユーティリティとして提供します。個別の値を組み合わせず、文字スタイルを選ぶだけで設定できます：{" "}
          <code className="rounded-md bg-background-secondary-default px-1.5 py-0.5 font-mono text-[13px] text-text-primary">
            text-sm font-medium
          </code>{" "}
          フラグメント。
        </p>
        <div className="flex flex-col rounded-2xl border border-border-button-default bg-background-primary-default p-5 dark:border-separator-border dark:bg-background-secondary-default">
          {TYPE_ROWS.map((row, i) => (
            <div
              key={row.token}
              className={cx(
                "flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1 py-3",
                i > 0 && "border-t border-separator-border",
              )}
            >
              <span className={`${row.token} text-text-primary`}>{row.sample}</span>
              <span className="font-mono text-[12px] text-text-tertiary">{row.label ?? row.token}</span>
            </div>
          ))}
        </div>
        <ButtonLink
          href="/components/typography"
          variant="secondary"
          trailingIcon={RiArrowRightLine}
          className="mt-1 self-start"
        >
          フルタイプスケール
        </ButtonLink>
      </Section>

      <p className="pt-8 text-body-regular text-text-tertiary">
        お問い合わせ{" "}
        <a className="text-accent-500 hover:underline" href="https://discord.gg/azcHkw8T6F">
          Discordで質問する
        </a>{" "}
        そして、私たちは、通常、同じ日に、オープンで答えます。
      </p>

      <PrevNext
        locale="ja"
        next={{ href: "/installation", label: "インストール", sub: "フレームワークセットアップガイド" }}
      />
    </DocsLayout>
  </LocaleHtml>
  );
}
