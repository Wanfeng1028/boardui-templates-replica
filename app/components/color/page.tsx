"use client";

import Link from "next/link";
import { RiArrowLeftLine } from "@remixicon/react";

import { DocsLayout } from "@/components/application/docs/docs-layout";
import { Chip } from "@/components/base/badges/chip";

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="flex flex-col gap-3">
      <h2 className="text-title-2-medium text-text-primary">{title}</h2>
      {children}
    </section>
  );
}

function Demo({ children }: { children: React.ReactNode }) {
  return (
    <div className="rounded-3xl border border-border-button-default bg-background-primary-default p-6">
      {children}
    </div>
  );
}

function Swatch({ swatchClass, token, note }: { swatchClass: string; token: string; note: string }) {
  return (
    <div className="flex items-center gap-3 rounded-xl border border-border-button-default bg-background-primary-default px-3 py-2.5">
      <span className={`size-8 shrink-0 rounded-lg border border-border-button-default ${swatchClass}`} aria-hidden />
      <span className="flex min-w-0 flex-col">
        <code className="truncate font-mono text-caption-1-medium text-text-primary">{token}</code>
        <span className="truncate text-caption-1-medium text-text-tertiary">{note}</span>
      </span>
    </div>
  );
}

const TEXT_TOKENS = [
  { swatchClass: "bg-text-primary", token: "text-text-primary", note: "Headings, body copy" },
  { swatchClass: "bg-text-secondary", token: "text-text-secondary", note: "Descriptions, metadata" },
  { swatchClass: "bg-text-tertiary", token: "text-text-tertiary", note: "Captions, placeholders" },
  { swatchClass: "bg-text-error-primary", token: "text-text-error-primary", note: "Error text" },
];

const SURFACE_TOKENS = [
  { swatchClass: "bg-background-primary-default", token: "bg-background-primary-default", note: "Cards, panels" },
  { swatchClass: "bg-background-secondary-default", token: "bg-background-secondary-default", note: "Code, wells" },
  { swatchClass: "bg-background-tertiary-default", token: "bg-background-tertiary-default", note: "Hover fills" },
  { swatchClass: "bg-background-full", token: "bg-background-full", note: "Page ground" },
];

const BORDER_TOKENS = [
  { swatchClass: "bg-border-button-default", token: "border-border-button-default", note: "Card and button borders" },
  { swatchClass: "bg-border-button-hover", token: "border-border-button-hover", note: "Hover borders" },
  { swatchClass: "bg-separator-border", token: "border-separator-border", note: "Hairline separators" },
  { swatchClass: "bg-border-error-default", token: "border-border-error-default", note: "Error borders" },
];

const ACCENT_LABELS = ["50", "100", "200", "300", "400", "500", "600", "700", "800", "900", "950"];

const ACCENT_RAMP = [
  "bg-accent-50",
  "bg-accent-100",
  "bg-accent-200",
  "bg-accent-300",
  "bg-accent-400",
  "bg-accent-500",
  "bg-accent-600",
  "bg-accent-700",
  "bg-accent-800",
  "bg-accent-900",
  "bg-accent-950",
];

const CHART_TOKENS = [
  { swatchClass: "bg-chart-1", token: "chart-1", note: "First series" },
  { swatchClass: "bg-chart-2", token: "chart-2", note: "Second series" },
  { swatchClass: "bg-chart-3", token: "chart-3", note: "Third series" },
  { swatchClass: "bg-chart-4", token: "chart-4", note: "Fourth series" },
  { swatchClass: "bg-chart-5", token: "chart-5", note: "Fifth series" },
];

const STATUS_TOKENS = [
  { swatchClass: "bg-status-lime-background", token: "status-lime", note: "Success, completed" },
  { swatchClass: "bg-status-blue-background", token: "status-blue", note: "Info, in review" },
  { swatchClass: "bg-status-yellow-background", token: "status-yellow", note: "Waiting, caution" },
  { swatchClass: "bg-status-rose-background", token: "status-rose", note: "Failed, error" },
  { swatchClass: "bg-status-purple-background", token: "status-purple", note: "Beta, highlight" },
  { swatchClass: "bg-status-cyan-background", token: "status-cyan", note: "Confirmed, values" },
];

export default function ColorPage() {
  return (
    <DocsLayout variant="library" title="Color">
      <div className="flex flex-col gap-8 pb-8">
        <div className="flex flex-col gap-3">
          <div className="flex items-center gap-2">
            <Chip variant="bold" color="lime">
              Free
            </Chip>
          </div>
          <p className="text-body-regular text-text-secondary">
            The semantic color tokens every BoardUI component is built from - foreground, text, background, and
            border roles, named 1:1 with the Figma variables.
          </p>
        </div>

        <Section title="How the system works">
          <p className="text-body-regular text-text-secondary">
            Colors are layered in two tiers. <strong className="font-medium text-text-primary">Primitives</strong>{" "}
            are the raw palette - Tailwind&apos;s default OKLCH scales plus a handful of Figma-tuned overrides in{" "}
            <code>styles/theme.css</code>.{" "}
            <strong className="font-medium text-text-primary">Semantic tokens</strong> sit on top and reference
            those primitives by purpose - what the color is for, never what it looks like.{" "}
            <code>--color-text-secondary</code> says &ldquo;supporting copy&rdquo;, not &ldquo;neutral
            500&rdquo;.
          </p>
          <p className="text-body-regular text-text-secondary">
            Components consume only the semantic layer. That single indirection is what makes the system
            maintainable: retune a primitive or remap a semantic token and every component updates at once - no
            component files change. It&apos;s also the path to dark mode: the <code>.dark</code> block in{" "}
            <code>theme.css</code> re-points the same tokens at dark values, so components never need{" "}
            <code>dark:</code> prefixes.
          </p>
          <p className="text-body-regular text-text-secondary">
            Token names mirror the Figma variable paths (<code>text/primary</code> →{" "}
            <code>--color-text-primary</code>), so a design spec translates to code without a lookup table. Note
            the doubled prefix in class names - <code>text-text-primary</code>,{" "}
            <code>bg-background-primary-default</code> - the first segment is the Tailwind utility, the rest is
            the token&apos;s full semantic path.
          </p>
        </Section>

        <Section title="One token system, two themes">
          <p className="text-body-regular text-text-secondary">
            Add <code>.dark</code> to the root element. BoardUI remaps the same semantic tokens, so every
            component changes with it.
          </p>
          <ol className="flex flex-col gap-4">
            <li className="flex flex-col gap-1">
              <span className="text-caption-1-semibold text-text-tertiary">01 · Map each theme</span>
              <span className="text-body-regular text-text-secondary">
                Keep light values in <code>:root</code> and dark values in <code>.dark</code>.
              </span>
            </li>
            <li className="flex flex-col gap-1">
              <span className="text-caption-1-semibold text-text-tertiary">02 · Use semantic colors</span>
              <span className="text-body-regular text-text-secondary">
                Use tokens like <code>bg-background-primary-default</code>, not raw colors.
              </span>
            </li>
            <li className="flex flex-col gap-1">
              <span className="text-caption-1-semibold text-text-tertiary">03 · Keep it centralized</span>
              <span className="text-body-regular text-text-secondary">
                Avoid component-level <code>dark:</code> overrides so changes stay predictable.
              </span>
            </li>
          </ol>
          <p className="text-body-regular text-text-secondary">
            Includes persistence and a no-flash initialization script.
          </p>
        </Section>

        <Section title="Foreground">
          <p className="text-body-regular text-text-secondary">
            Icon fills and inverse/on-color foregrounds - everything drawn on top of a surface that isn&apos;t
            running text.
          </p>
        </Section>

        <Section title="Text">
          <p className="text-body-regular text-text-secondary">
            The type hierarchy: primary for headings and key values, secondary for supporting copy, tertiary for
            hints, plus disabled and error states.
          </p>
          <Demo>
            <div className="grid gap-2 sm:grid-cols-2">
              {TEXT_TOKENS.map((t) => (
                <Swatch key={t.token} swatchClass={t.swatchClass} token={t.token} note={t.note} />
              ))}
            </div>
          </Demo>
        </Section>

        <Section title="Background">
          <p className="text-body-regular text-text-secondary">
            Surface fills. Full is the outer canvas; primary, secondary, and tertiary describe progressively
            nested surfaces and their interaction states.
          </p>
          <Demo>
            <div className="grid gap-2 sm:grid-cols-2">
              {SURFACE_TOKENS.map((t) => (
                <Swatch key={t.token} swatchClass={t.swatchClass} token={t.token} note={t.note} />
              ))}
            </div>
          </Demo>
        </Section>

        <Section title="Border">
          <p className="text-body-regular text-text-secondary">
            Hairlines and focus rings. Button borders step darker through hover and active; the focus ring is the
            single blue accent.
          </p>
          <Demo>
            <div className="grid gap-2 sm:grid-cols-2">
              {BORDER_TOKENS.map((t) => (
                <Swatch key={t.token} swatchClass={t.swatchClass} token={t.token} note={t.note} />
              ))}
            </div>
          </Demo>
        </Section>

        <Section title="One accent, every CTA">
          <p className="text-body-regular text-text-secondary">
            Every interactive surface - primary button gradients, checkboxes, radios, switches, sliders, tabs, the
            selected sidebar item, focus rings - reads from a single{" "}
            <code>--color-accent-50…950</code> ramp that defaults to blue. Pick any hue below (or a fully custom
            color) and watch this page re-tint live; charts and status colors deliberately stay put.
          </p>
          <p className="text-body-regular text-text-secondary">
            A custom color lands exactly on <code>--color-accent-500</code>, the stop primary buttons start their
            gradient on and focus rings use; the other ten stops are built around it. Buttons put white text on
            it, so pick a color dark enough to read.
          </p>
          <p className="text-body-regular text-text-secondary">
            Take it home: copy the eleven-variable override and paste it after your <code>theme.css</code>{" "}
            import.
          </p>
          <Demo>
            <div className="flex overflow-hidden rounded-xl border border-border-button-default">
              {ACCENT_RAMP.map((tone, i) => (
                <span key={tone} className={`h-16 flex-1 ${tone}`} title={`accent-${ACCENT_LABELS[i]}`} />
              ))}
            </div>
            <div className="mt-2 flex justify-between font-mono text-caption-1-medium text-text-tertiary">
              <span>accent-50</span>
              <span>accent-500</span>
              <span>accent-950</span>
            </div>
          </Demo>
        </Section>

        <Section title="Graphs">
          <p className="text-body-regular text-text-secondary">
            Chart colors. Track is the background bar/ring behind a series, cursor the hover outline and dashed
            reference line, neutral an &ldquo;other&rdquo;-style data slice. The numbered accents are a
            categorical ramp — each pairs a base fill with a one-tone-darker active used for hover emphasis (the
            400 → 500 recipe every chart follows). In charts these are consumed as CSS variables (e.g.{" "}
            <code>fill=&ldquo;var(--color-chart-1)&rdquo;</code>) rather than classes.
          </p>
          <Demo>
            <div className="grid gap-2 sm:grid-cols-2">
              {CHART_TOKENS.map((t) => (
                <Swatch key={t.token} swatchClass={t.swatchClass} token={t.token} note={t.note} />
              ))}
            </div>
          </Demo>
        </Section>

        <Section title="State">
          <p className="text-body-regular text-text-secondary">
            Semantic feedback colors whose meaning stays stable across themes.
          </p>
          <Demo>
            <div className="grid gap-2 sm:grid-cols-2">
              {STATUS_TOKENS.map((t) => (
                <Swatch key={t.token} swatchClass={t.swatchClass} token={t.token} note={t.note} />
              ))}
            </div>
          </Demo>
        </Section>

        <Link
          href="/components"
          className="inline-flex items-center gap-1.5 text-body-medium text-text-secondary transition-colors hover:text-text-primary"
        >
          <RiArrowLeftLine className="size-4" aria-hidden />
          Back to all components
        </Link>
      </div>
    </DocsLayout>
  );
}

// 已按原版逐字校对：boardui.com/components/color（2026-11-07，curl 抓取原版 SSR HTML + flight 数据核对）
