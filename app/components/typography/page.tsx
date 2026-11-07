"use client";

import { useState, type ReactNode } from "react";
import Link from "next/link";
import { RiArrowLeftLine, RiCheckLine, RiFileCopyLine } from "@remixicon/react";
import { DocsLayout } from "@/components/application/docs/docs-layout";

function CodeBlock({ code, label = "Code" }: { code: string; label?: string }) {
  const [copied, setCopied] = useState(false);
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(code);
    } catch {
      const el = document.createElement("textarea");
      el.value = code;
      document.body.appendChild(el);
      el.select();
      document.execCommand("copy");
      document.body.removeChild(el);
    }
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1500);
  };
  return (
    <div className="overflow-hidden rounded-xl border border-border-button-default bg-background-secondary-default">
      <div className="flex items-center justify-between gap-2 border-b border-separator-border px-4 py-2">
        <span className="text-caption-1-medium text-text-tertiary">{label}</span>
        <button
          type="button"
          onClick={copy}
          className="inline-flex items-center gap-1 rounded-md px-2 py-1 text-caption-1-medium text-text-secondary outline-none hover:bg-background-tertiary-default hover:text-text-primary focus-visible:ring-2 focus-visible:ring-border-focus-ring"
        >
          {copied ? <RiCheckLine className="size-3.5" /> : <RiFileCopyLine className="size-3.5" />}
          {copied ? "Copied" : "Copy"}
        </button>
      </div>
      <pre dir="ltr" className="overflow-x-auto p-4 font-mono text-caption-1-regular text-text-primary">
        <code>{code}</code>
      </pre>
    </div>
  );
}

function Section({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="flex flex-col gap-4">
      <h2 className="text-title-2-medium text-text-primary">{title}</h2>
      {children}
    </section>
  );
}

function Demo({ children }: { children: ReactNode }) {
  return (
    <div className="rounded-3xl border border-border-button-default bg-background-primary-default p-6">
      {children}
    </div>
  );
}

function BackLink() {
  return (
    <Link
      href="/components"
      className="inline-flex w-fit items-center gap-1.5 rounded-md text-body-medium text-text-secondary outline-none hover:text-text-primary focus-visible:ring-2 focus-visible:ring-border-focus-ring"
    >
      <RiArrowLeftLine className="size-4" />
      Back to components
    </Link>
  );
}

export default function TypographyPage() {
  return (
    <DocsLayout variant="library" title="Typography">
      <div className="flex flex-col gap-10 pb-10">
        <p className="text-body-regular text-text-secondary">
          Type scale, weights, and text styles. BoardUI ships one composite utility per style — each sets
          size, weight, line-height and letter-spacing together — so text never gets rebuilt from loose
          size and weight classes. The scale runs Display 1–4, Title 1–3, Headline, Body, Body 2 and Caption
          1–2, each in regular, medium, semibold and bold.
        </p>

        <Section title="How the system works">
          <p className="text-body-regular text-text-secondary">
            Every style is a <strong className="font-medium text-text-primary">composite token</strong>: one class
            such as <code>text-body-medium</code> sets font size, line height, letter spacing, and weight
            together, defined in <code>styles/typography.css</code>. You never combine{" "}
            <code>text-sm</code> with <code>font-medium</code> and <code>leading-5</code> by hand - a single
            token guarantees the exact metrics the Figma text style specifies.
          </p>
          <p className="text-body-regular text-text-secondary">
            The naming is <code>text-&#123;family&#125;-&#123;weight&#125;</code> - 13 families × 4 weights
            (Regular 400, Medium 500, Semibold 600, Bold 700). Color is applied separately with the semantic
            text tokens, so a typical label reads{" "}
            <code>text-body-medium text-text-secondary</code>: one class for the metrics, one for the color.
          </p>
          <p className="text-body-regular text-text-secondary">
            Because these classes live in the <code>text-*</code> namespace, they are registered with{" "}
            <code>cx()</code> (our tailwind-merge wrapper) as font-size utilities - otherwise a merge with a
            color class would silently drop them. If you add or rename a style, mirror it in{" "}
            <code>utils/cx.ts</code>.
          </p>
        </Section>
        <Section title="Large Title">
          <p className="text-caption-1-medium text-text-tertiary">64px / 80px</p>
          <p className="text-body-regular text-text-secondary">Hero numerals and marketing-scale headings.</p>
          <Demo>
            <div className="flex flex-col">
                <div className="flex flex-col gap-1 border-b border-separator-border py-4 last:border-b-0">
                  <div className="flex flex-wrap items-baseline justify-between gap-2">
                    <span className="text-caption-1-medium text-text-tertiary">Regular · 400</span>
                    <span className="font-mono text-caption-1-regular text-text-tertiary">text-large-title-regular</span>
                  </div>
                  <span className="text-large-title-regular text-text-primary">The five boxing wizards jump quickly.</span>
                </div>
                <div className="flex flex-col gap-1 border-b border-separator-border py-4 last:border-b-0">
                  <div className="flex flex-wrap items-baseline justify-between gap-2">
                    <span className="text-caption-1-medium text-text-tertiary">Medium · 500</span>
                    <span className="font-mono text-caption-1-regular text-text-tertiary">text-large-title-medium</span>
                  </div>
                  <span className="text-large-title-medium text-text-primary">The five boxing wizards jump quickly.</span>
                </div>
                <div className="flex flex-col gap-1 border-b border-separator-border py-4 last:border-b-0">
                  <div className="flex flex-wrap items-baseline justify-between gap-2">
                    <span className="text-caption-1-medium text-text-tertiary">Semibold · 600</span>
                    <span className="font-mono text-caption-1-regular text-text-tertiary">text-large-title-semibold</span>
                  </div>
                  <span className="text-large-title-semibold text-text-primary">The five boxing wizards jump quickly.</span>
                </div>
                <div className="flex flex-col gap-1 border-b border-separator-border py-4 last:border-b-0">
                  <div className="flex flex-wrap items-baseline justify-between gap-2">
                    <span className="text-caption-1-medium text-text-tertiary">Bold · 700</span>
                    <span className="font-mono text-caption-1-regular text-text-tertiary">text-large-title-bold</span>
                  </div>
                  <span className="text-large-title-bold text-text-primary">The five boxing wizards jump quickly.</span>
                </div>
            </div>
          </Demo>
        </Section>
        <Section title="Display 1">
          <p className="text-caption-1-medium text-text-tertiary">56px / 72px</p>
          <p className="text-body-regular text-text-secondary">Full-page hero headings.</p>
          <Demo>
            <div className="flex flex-col">
                <div className="flex flex-col gap-1 border-b border-separator-border py-4 last:border-b-0">
                  <div className="flex flex-wrap items-baseline justify-between gap-2">
                    <span className="text-caption-1-medium text-text-tertiary">Regular · 400</span>
                    <span className="font-mono text-caption-1-regular text-text-tertiary">text-display-1-regular</span>
                  </div>
                  <span className="text-display-1-regular text-text-primary">The five boxing wizards jump quickly.</span>
                </div>
                <div className="flex flex-col gap-1 border-b border-separator-border py-4 last:border-b-0">
                  <div className="flex flex-wrap items-baseline justify-between gap-2">
                    <span className="text-caption-1-medium text-text-tertiary">Medium · 500</span>
                    <span className="font-mono text-caption-1-regular text-text-tertiary">text-display-1-medium</span>
                  </div>
                  <span className="text-display-1-medium text-text-primary">The five boxing wizards jump quickly.</span>
                </div>
                <div className="flex flex-col gap-1 border-b border-separator-border py-4 last:border-b-0">
                  <div className="flex flex-wrap items-baseline justify-between gap-2">
                    <span className="text-caption-1-medium text-text-tertiary">Semibold · 600</span>
                    <span className="font-mono text-caption-1-regular text-text-tertiary">text-display-1-semibold</span>
                  </div>
                  <span className="text-display-1-semibold text-text-primary">The five boxing wizards jump quickly.</span>
                </div>
                <div className="flex flex-col gap-1 border-b border-separator-border py-4 last:border-b-0">
                  <div className="flex flex-wrap items-baseline justify-between gap-2">
                    <span className="text-caption-1-medium text-text-tertiary">Bold · 700</span>
                    <span className="font-mono text-caption-1-regular text-text-tertiary">text-display-1-bold</span>
                  </div>
                  <span className="text-display-1-bold text-text-primary">The five boxing wizards jump quickly.</span>
                </div>
            </div>
          </Demo>
        </Section>
        <Section title="Display 2">
          <p className="text-caption-1-medium text-text-tertiary">48px / 64px</p>
          <p className="text-body-regular text-text-secondary">Large section heroes.</p>
          <Demo>
            <div className="flex flex-col">
                <div className="flex flex-col gap-1 border-b border-separator-border py-4 last:border-b-0">
                  <div className="flex flex-wrap items-baseline justify-between gap-2">
                    <span className="text-caption-1-medium text-text-tertiary">Regular · 400</span>
                    <span className="font-mono text-caption-1-regular text-text-tertiary">text-display-2-regular</span>
                  </div>
                  <span className="text-display-2-regular text-text-primary">The five boxing wizards jump quickly.</span>
                </div>
                <div className="flex flex-col gap-1 border-b border-separator-border py-4 last:border-b-0">
                  <div className="flex flex-wrap items-baseline justify-between gap-2">
                    <span className="text-caption-1-medium text-text-tertiary">Medium · 500</span>
                    <span className="font-mono text-caption-1-regular text-text-tertiary">text-display-2-medium</span>
                  </div>
                  <span className="text-display-2-medium text-text-primary">The five boxing wizards jump quickly.</span>
                </div>
                <div className="flex flex-col gap-1 border-b border-separator-border py-4 last:border-b-0">
                  <div className="flex flex-wrap items-baseline justify-between gap-2">
                    <span className="text-caption-1-medium text-text-tertiary">Semibold · 600</span>
                    <span className="font-mono text-caption-1-regular text-text-tertiary">text-display-2-semibold</span>
                  </div>
                  <span className="text-display-2-semibold text-text-primary">The five boxing wizards jump quickly.</span>
                </div>
                <div className="flex flex-col gap-1 border-b border-separator-border py-4 last:border-b-0">
                  <div className="flex flex-wrap items-baseline justify-between gap-2">
                    <span className="text-caption-1-medium text-text-tertiary">Bold · 700</span>
                    <span className="font-mono text-caption-1-regular text-text-tertiary">text-display-2-bold</span>
                  </div>
                  <span className="text-display-2-bold text-text-primary">The five boxing wizards jump quickly.</span>
                </div>
            </div>
          </Demo>
        </Section>
        <Section title="Display 3">
          <p className="text-caption-1-medium text-text-tertiary">40px / 54px</p>
          <p className="text-body-regular text-text-secondary">Prominent stats and page heroes.</p>
          <Demo>
            <div className="flex flex-col">
                <div className="flex flex-col gap-1 border-b border-separator-border py-4 last:border-b-0">
                  <div className="flex flex-wrap items-baseline justify-between gap-2">
                    <span className="text-caption-1-medium text-text-tertiary">Regular · 400</span>
                    <span className="font-mono text-caption-1-regular text-text-tertiary">text-display-3-regular</span>
                  </div>
                  <span className="text-display-3-regular text-text-primary">The five boxing wizards jump quickly.</span>
                </div>
                <div className="flex flex-col gap-1 border-b border-separator-border py-4 last:border-b-0">
                  <div className="flex flex-wrap items-baseline justify-between gap-2">
                    <span className="text-caption-1-medium text-text-tertiary">Medium · 500</span>
                    <span className="font-mono text-caption-1-regular text-text-tertiary">text-display-3-medium</span>
                  </div>
                  <span className="text-display-3-medium text-text-primary">The five boxing wizards jump quickly.</span>
                </div>
                <div className="flex flex-col gap-1 border-b border-separator-border py-4 last:border-b-0">
                  <div className="flex flex-wrap items-baseline justify-between gap-2">
                    <span className="text-caption-1-medium text-text-tertiary">Semibold · 600</span>
                    <span className="font-mono text-caption-1-regular text-text-tertiary">text-display-3-semibold</span>
                  </div>
                  <span className="text-display-3-semibold text-text-primary">The five boxing wizards jump quickly.</span>
                </div>
                <div className="flex flex-col gap-1 border-b border-separator-border py-4 last:border-b-0">
                  <div className="flex flex-wrap items-baseline justify-between gap-2">
                    <span className="text-caption-1-medium text-text-tertiary">Bold · 700</span>
                    <span className="font-mono text-caption-1-regular text-text-tertiary">text-display-3-bold</span>
                  </div>
                  <span className="text-display-3-bold text-text-primary">The five boxing wizards jump quickly.</span>
                </div>
            </div>
          </Demo>
        </Section>
        <Section title="Display 4">
          <p className="text-caption-1-medium text-text-tertiary">32px / 44px</p>
          <p className="text-body-regular text-text-secondary">Page titles; the largest style used inside the app shell.</p>
          <Demo>
            <div className="flex flex-col">
                <div className="flex flex-col gap-1 border-b border-separator-border py-4 last:border-b-0">
                  <div className="flex flex-wrap items-baseline justify-between gap-2">
                    <span className="text-caption-1-medium text-text-tertiary">Regular · 400</span>
                    <span className="font-mono text-caption-1-regular text-text-tertiary">text-display-4-regular</span>
                  </div>
                  <span className="text-display-4-regular text-text-primary">The five boxing wizards jump quickly.</span>
                </div>
                <div className="flex flex-col gap-1 border-b border-separator-border py-4 last:border-b-0">
                  <div className="flex flex-wrap items-baseline justify-between gap-2">
                    <span className="text-caption-1-medium text-text-tertiary">Medium · 500</span>
                    <span className="font-mono text-caption-1-regular text-text-tertiary">text-display-4-medium</span>
                  </div>
                  <span className="text-display-4-medium text-text-primary">The five boxing wizards jump quickly.</span>
                </div>
                <div className="flex flex-col gap-1 border-b border-separator-border py-4 last:border-b-0">
                  <div className="flex flex-wrap items-baseline justify-between gap-2">
                    <span className="text-caption-1-medium text-text-tertiary">Semibold · 600</span>
                    <span className="font-mono text-caption-1-regular text-text-tertiary">text-display-4-semibold</span>
                  </div>
                  <span className="text-display-4-semibold text-text-primary">The five boxing wizards jump quickly.</span>
                </div>
                <div className="flex flex-col gap-1 border-b border-separator-border py-4 last:border-b-0">
                  <div className="flex flex-wrap items-baseline justify-between gap-2">
                    <span className="text-caption-1-medium text-text-tertiary">Bold · 700</span>
                    <span className="font-mono text-caption-1-regular text-text-tertiary">text-display-4-bold</span>
                  </div>
                  <span className="text-display-4-bold text-text-primary">The five boxing wizards jump quickly.</span>
                </div>
            </div>
          </Demo>
        </Section>
        <Section title="Title 1">
          <p className="text-caption-1-medium text-text-tertiary">24px / 34px</p>
          <p className="text-body-regular text-text-secondary">Card headline figures (step totals, earnings).</p>
          <Demo>
            <div className="flex flex-col">
                <div className="flex flex-col gap-1 border-b border-separator-border py-4 last:border-b-0">
                  <div className="flex flex-wrap items-baseline justify-between gap-2">
                    <span className="text-caption-1-medium text-text-tertiary">Regular · 400</span>
                    <span className="font-mono text-caption-1-regular text-text-tertiary">text-title-1-regular</span>
                  </div>
                  <span className="text-title-1-regular text-text-primary">The five boxing wizards jump quickly.</span>
                </div>
                <div className="flex flex-col gap-1 border-b border-separator-border py-4 last:border-b-0">
                  <div className="flex flex-wrap items-baseline justify-between gap-2">
                    <span className="text-caption-1-medium text-text-tertiary">Medium · 500</span>
                    <span className="font-mono text-caption-1-regular text-text-tertiary">text-title-1-medium</span>
                  </div>
                  <span className="text-title-1-medium text-text-primary">The five boxing wizards jump quickly.</span>
                </div>
                <div className="flex flex-col gap-1 border-b border-separator-border py-4 last:border-b-0">
                  <div className="flex flex-wrap items-baseline justify-between gap-2">
                    <span className="text-caption-1-medium text-text-tertiary">Semibold · 600</span>
                    <span className="font-mono text-caption-1-regular text-text-tertiary">text-title-1-semibold</span>
                  </div>
                  <span className="text-title-1-semibold text-text-primary">The five boxing wizards jump quickly.</span>
                </div>
                <div className="flex flex-col gap-1 border-b border-separator-border py-4 last:border-b-0">
                  <div className="flex flex-wrap items-baseline justify-between gap-2">
                    <span className="text-caption-1-medium text-text-tertiary">Bold · 700</span>
                    <span className="font-mono text-caption-1-regular text-text-tertiary">text-title-1-bold</span>
                  </div>
                  <span className="text-title-1-bold text-text-primary">The five boxing wizards jump quickly.</span>
                </div>
            </div>
          </Demo>
        </Section>
        <Section title="Title 2">
          <p className="text-caption-1-medium text-text-tertiary">20px / 26px</p>
          <p className="text-body-regular text-text-secondary">Section headings inside pages and panels.</p>
          <Demo>
            <div className="flex flex-col">
                <div className="flex flex-col gap-1 border-b border-separator-border py-4 last:border-b-0">
                  <div className="flex flex-wrap items-baseline justify-between gap-2">
                    <span className="text-caption-1-medium text-text-tertiary">Regular · 400</span>
                    <span className="font-mono text-caption-1-regular text-text-tertiary">text-title-2-regular</span>
                  </div>
                  <span className="text-title-2-regular text-text-primary">The five boxing wizards jump quickly.</span>
                </div>
                <div className="flex flex-col gap-1 border-b border-separator-border py-4 last:border-b-0">
                  <div className="flex flex-wrap items-baseline justify-between gap-2">
                    <span className="text-caption-1-medium text-text-tertiary">Medium · 500</span>
                    <span className="font-mono text-caption-1-regular text-text-tertiary">text-title-2-medium</span>
                  </div>
                  <span className="text-title-2-medium text-text-primary">The five boxing wizards jump quickly.</span>
                </div>
                <div className="flex flex-col gap-1 border-b border-separator-border py-4 last:border-b-0">
                  <div className="flex flex-wrap items-baseline justify-between gap-2">
                    <span className="text-caption-1-medium text-text-tertiary">Semibold · 600</span>
                    <span className="font-mono text-caption-1-regular text-text-tertiary">text-title-2-semibold</span>
                  </div>
                  <span className="text-title-2-semibold text-text-primary">The five boxing wizards jump quickly.</span>
                </div>
                <div className="flex flex-col gap-1 border-b border-separator-border py-4 last:border-b-0">
                  <div className="flex flex-wrap items-baseline justify-between gap-2">
                    <span className="text-caption-1-medium text-text-tertiary">Bold · 700</span>
                    <span className="font-mono text-caption-1-regular text-text-tertiary">text-title-2-bold</span>
                  </div>
                  <span className="text-title-2-bold text-text-primary">The five boxing wizards jump quickly.</span>
                </div>
            </div>
          </Demo>
        </Section>
        <Section title="Title 3">
          <p className="text-caption-1-medium text-text-tertiary">18px / 24–26px</p>
          <p className="text-body-regular text-text-secondary">Sub-section headings, calendar month titles.</p>
          <Demo>
            <div className="flex flex-col">
                <div className="flex flex-col gap-1 border-b border-separator-border py-4 last:border-b-0">
                  <div className="flex flex-wrap items-baseline justify-between gap-2">
                    <span className="text-caption-1-medium text-text-tertiary">Regular · 400</span>
                    <span className="font-mono text-caption-1-regular text-text-tertiary">text-title-3-regular</span>
                  </div>
                  <span className="text-title-3-regular text-text-primary">The five boxing wizards jump quickly.</span>
                </div>
                <div className="flex flex-col gap-1 border-b border-separator-border py-4 last:border-b-0">
                  <div className="flex flex-wrap items-baseline justify-between gap-2">
                    <span className="text-caption-1-medium text-text-tertiary">Medium · 500</span>
                    <span className="font-mono text-caption-1-regular text-text-tertiary">text-title-3-medium</span>
                  </div>
                  <span className="text-title-3-medium text-text-primary">The five boxing wizards jump quickly.</span>
                </div>
                <div className="flex flex-col gap-1 border-b border-separator-border py-4 last:border-b-0">
                  <div className="flex flex-wrap items-baseline justify-between gap-2">
                    <span className="text-caption-1-medium text-text-tertiary">Semibold · 600</span>
                    <span className="font-mono text-caption-1-regular text-text-tertiary">text-title-3-semibold</span>
                  </div>
                  <span className="text-title-3-semibold text-text-primary">The five boxing wizards jump quickly.</span>
                </div>
                <div className="flex flex-col gap-1 border-b border-separator-border py-4 last:border-b-0">
                  <div className="flex flex-wrap items-baseline justify-between gap-2">
                    <span className="text-caption-1-medium text-text-tertiary">Bold · 700</span>
                    <span className="font-mono text-caption-1-regular text-text-tertiary">text-title-3-bold</span>
                  </div>
                  <span className="text-title-3-bold text-text-primary">The five boxing wizards jump quickly.</span>
                </div>
            </div>
          </Demo>
        </Section>
        <Section title="Headline">
          <p className="text-caption-1-medium text-text-tertiary">16px / 22px</p>
          <p className="text-body-regular text-text-secondary">Emphasized body copy and lead paragraphs.</p>
          <Demo>
            <div className="flex flex-col">
                <div className="flex flex-col gap-1 border-b border-separator-border py-4 last:border-b-0">
                  <div className="flex flex-wrap items-baseline justify-between gap-2">
                    <span className="text-caption-1-medium text-text-tertiary">Regular · 400</span>
                    <span className="font-mono text-caption-1-regular text-text-tertiary">text-headline-regular</span>
                  </div>
                  <span className="text-headline-regular text-text-primary">The five boxing wizards jump quickly.</span>
                </div>
                <div className="flex flex-col gap-1 border-b border-separator-border py-4 last:border-b-0">
                  <div className="flex flex-wrap items-baseline justify-between gap-2">
                    <span className="text-caption-1-medium text-text-tertiary">Medium · 500</span>
                    <span className="font-mono text-caption-1-regular text-text-tertiary">text-headline-medium</span>
                  </div>
                  <span className="text-headline-medium text-text-primary">The five boxing wizards jump quickly.</span>
                </div>
                <div className="flex flex-col gap-1 border-b border-separator-border py-4 last:border-b-0">
                  <div className="flex flex-wrap items-baseline justify-between gap-2">
                    <span className="text-caption-1-medium text-text-tertiary">Semibold · 600</span>
                    <span className="font-mono text-caption-1-regular text-text-tertiary">text-headline-semibold</span>
                  </div>
                  <span className="text-headline-semibold text-text-primary">The five boxing wizards jump quickly.</span>
                </div>
                <div className="flex flex-col gap-1 border-b border-separator-border py-4 last:border-b-0">
                  <div className="flex flex-wrap items-baseline justify-between gap-2">
                    <span className="text-caption-1-medium text-text-tertiary">Bold · 700</span>
                    <span className="font-mono text-caption-1-regular text-text-tertiary">text-headline-bold</span>
                  </div>
                  <span className="text-headline-bold text-text-primary">The five boxing wizards jump quickly.</span>
                </div>
            </div>
          </Demo>
        </Section>
        <Section title="Body">
          <p className="text-caption-1-medium text-text-tertiary">14px / 20px</p>
          <p className="text-body-regular text-text-secondary">The default UI text: labels, table cells, nav items.</p>
          <Demo>
            <div className="flex flex-col">
                <div className="flex flex-col gap-1 border-b border-separator-border py-4 last:border-b-0">
                  <div className="flex flex-wrap items-baseline justify-between gap-2">
                    <span className="text-caption-1-medium text-text-tertiary">Regular · 400</span>
                    <span className="font-mono text-caption-1-regular text-text-tertiary">text-body-regular</span>
                  </div>
                  <span className="text-body-regular text-text-primary">The five boxing wizards jump quickly.</span>
                </div>
                <div className="flex flex-col gap-1 border-b border-separator-border py-4 last:border-b-0">
                  <div className="flex flex-wrap items-baseline justify-between gap-2">
                    <span className="text-caption-1-medium text-text-tertiary">Medium · 500</span>
                    <span className="font-mono text-caption-1-regular text-text-tertiary">text-body-medium</span>
                  </div>
                  <span className="text-body-medium text-text-primary">The five boxing wizards jump quickly.</span>
                </div>
                <div className="flex flex-col gap-1 border-b border-separator-border py-4 last:border-b-0">
                  <div className="flex flex-wrap items-baseline justify-between gap-2">
                    <span className="text-caption-1-medium text-text-tertiary">Semibold · 600</span>
                    <span className="font-mono text-caption-1-regular text-text-tertiary">text-body-semibold</span>
                  </div>
                  <span className="text-body-semibold text-text-primary">The five boxing wizards jump quickly.</span>
                </div>
                <div className="flex flex-col gap-1 border-b border-separator-border py-4 last:border-b-0">
                  <div className="flex flex-wrap items-baseline justify-between gap-2">
                    <span className="text-caption-1-medium text-text-tertiary">Bold · 700</span>
                    <span className="font-mono text-caption-1-regular text-text-tertiary">text-body-bold</span>
                  </div>
                  <span className="text-body-bold text-text-primary">The five boxing wizards jump quickly.</span>
                </div>
            </div>
          </Demo>
        </Section>
        <Section title="Body 2">
          <p className="text-caption-1-medium text-text-tertiary">13px / 18px</p>
          <p className="text-body-regular text-text-secondary">Dense contexts: compact tables, secondary descriptions.</p>
          <Demo>
            <div className="flex flex-col">
                <div className="flex flex-col gap-1 border-b border-separator-border py-4 last:border-b-0">
                  <div className="flex flex-wrap items-baseline justify-between gap-2">
                    <span className="text-caption-1-medium text-text-tertiary">Regular · 400</span>
                    <span className="font-mono text-caption-1-regular text-text-tertiary">text-body-2-regular</span>
                  </div>
                  <span className="text-body-2-regular text-text-primary">The five boxing wizards jump quickly.</span>
                </div>
                <div className="flex flex-col gap-1 border-b border-separator-border py-4 last:border-b-0">
                  <div className="flex flex-wrap items-baseline justify-between gap-2">
                    <span className="text-caption-1-medium text-text-tertiary">Medium · 500</span>
                    <span className="font-mono text-caption-1-regular text-text-tertiary">text-body-2-medium</span>
                  </div>
                  <span className="text-body-2-medium text-text-primary">The five boxing wizards jump quickly.</span>
                </div>
                <div className="flex flex-col gap-1 border-b border-separator-border py-4 last:border-b-0">
                  <div className="flex flex-wrap items-baseline justify-between gap-2">
                    <span className="text-caption-1-medium text-text-tertiary">Semibold · 600</span>
                    <span className="font-mono text-caption-1-regular text-text-tertiary">text-body-2-semibold</span>
                  </div>
                  <span className="text-body-2-semibold text-text-primary">The five boxing wizards jump quickly.</span>
                </div>
                <div className="flex flex-col gap-1 border-b border-separator-border py-4 last:border-b-0">
                  <div className="flex flex-wrap items-baseline justify-between gap-2">
                    <span className="text-caption-1-medium text-text-tertiary">Bold · 700</span>
                    <span className="font-mono text-caption-1-regular text-text-tertiary">text-body-2-bold</span>
                  </div>
                  <span className="text-body-2-bold text-text-primary">The five boxing wizards jump quickly.</span>
                </div>
            </div>
          </Demo>
        </Section>
        <Section title="Caption 1">
          <p className="text-caption-1-medium text-text-tertiary">12px / 16px · tracking 0.15px</p>
          <p className="text-body-regular text-text-secondary">Axis labels, unit suffixes, timestamps.</p>
          <Demo>
            <div className="flex flex-col">
                <div className="flex flex-col gap-1 border-b border-separator-border py-4 last:border-b-0">
                  <div className="flex flex-wrap items-baseline justify-between gap-2">
                    <span className="text-caption-1-medium text-text-tertiary">Regular · 400</span>
                    <span className="font-mono text-caption-1-regular text-text-tertiary">text-caption-1-regular</span>
                  </div>
                  <span className="text-caption-1-regular text-text-primary">The five boxing wizards jump quickly.</span>
                </div>
                <div className="flex flex-col gap-1 border-b border-separator-border py-4 last:border-b-0">
                  <div className="flex flex-wrap items-baseline justify-between gap-2">
                    <span className="text-caption-1-medium text-text-tertiary">Medium · 500</span>
                    <span className="font-mono text-caption-1-regular text-text-tertiary">text-caption-1-medium</span>
                  </div>
                  <span className="text-caption-1-medium text-text-primary">The five boxing wizards jump quickly.</span>
                </div>
                <div className="flex flex-col gap-1 border-b border-separator-border py-4 last:border-b-0">
                  <div className="flex flex-wrap items-baseline justify-between gap-2">
                    <span className="text-caption-1-medium text-text-tertiary">Semibold · 600</span>
                    <span className="font-mono text-caption-1-regular text-text-tertiary">text-caption-1-semibold</span>
                  </div>
                  <span className="text-caption-1-semibold text-text-primary">The five boxing wizards jump quickly.</span>
                </div>
                <div className="flex flex-col gap-1 border-b border-separator-border py-4 last:border-b-0">
                  <div className="flex flex-wrap items-baseline justify-between gap-2">
                    <span className="text-caption-1-medium text-text-tertiary">Bold · 700</span>
                    <span className="font-mono text-caption-1-regular text-text-tertiary">text-caption-1-bold</span>
                  </div>
                  <span className="text-caption-1-bold text-text-primary">The five boxing wizards jump quickly.</span>
                </div>
            </div>
          </Demo>
        </Section>
        <Section title="Caption 2">
          <p className="text-caption-1-medium text-text-tertiary">11px / 15px · tracking 0.2px</p>
          <p className="text-body-regular text-text-secondary">The smallest legible annotations (badges, fine print).</p>
          <Demo>
            <div className="flex flex-col">
                <div className="flex flex-col gap-1 border-b border-separator-border py-4 last:border-b-0">
                  <div className="flex flex-wrap items-baseline justify-between gap-2">
                    <span className="text-caption-1-medium text-text-tertiary">Regular · 400</span>
                    <span className="font-mono text-caption-1-regular text-text-tertiary">text-caption-2-regular</span>
                  </div>
                  <span className="text-caption-2-regular text-text-primary">The five boxing wizards jump quickly.</span>
                </div>
                <div className="flex flex-col gap-1 border-b border-separator-border py-4 last:border-b-0">
                  <div className="flex flex-wrap items-baseline justify-between gap-2">
                    <span className="text-caption-1-medium text-text-tertiary">Medium · 500</span>
                    <span className="font-mono text-caption-1-regular text-text-tertiary">text-caption-2-medium</span>
                  </div>
                  <span className="text-caption-2-medium text-text-primary">The five boxing wizards jump quickly.</span>
                </div>
                <div className="flex flex-col gap-1 border-b border-separator-border py-4 last:border-b-0">
                  <div className="flex flex-wrap items-baseline justify-between gap-2">
                    <span className="text-caption-1-medium text-text-tertiary">Semibold · 600</span>
                    <span className="font-mono text-caption-1-regular text-text-tertiary">text-caption-2-semibold</span>
                  </div>
                  <span className="text-caption-2-semibold text-text-primary">The five boxing wizards jump quickly.</span>
                </div>
                <div className="flex flex-col gap-1 border-b border-separator-border py-4 last:border-b-0">
                  <div className="flex flex-wrap items-baseline justify-between gap-2">
                    <span className="text-caption-1-medium text-text-tertiary">Bold · 700</span>
                    <span className="font-mono text-caption-1-regular text-text-tertiary">text-caption-2-bold</span>
                  </div>
                  <span className="text-caption-2-bold text-text-primary">The five boxing wizards jump quickly.</span>
                </div>
            </div>
          </Demo>
        </Section>

        <BackLink />
      </div>
    </DocsLayout>
  );
}

// 已按原版逐字校对：boardui.com/components/typography（2026-11-07，curl 抓取原版 SSR HTML + flight 数据核对）
