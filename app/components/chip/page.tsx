"use client";

import { useState } from "react";
import Link from "next/link";
import { RiArrowLeftLine, RiCheckLine, RiFileCopyLine } from "@remixicon/react";

import { DocsLayout } from "@/components/application/docs/docs-layout";
import { Chip } from "@/components/base/badges/chip";
import { StatusDot } from "@/components/base/badges/status-dot";

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
      {copied ? "Copied" : "Copy"}
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

function Demo({ children }: { children: React.ReactNode }) {
  return (
    <div className="rounded-3xl border border-border-button-default bg-background-primary-default p-6">
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

const INSTALL_CMD = "npx boardui@latest add chip";

const VARIANTS_CODE = `<Chip variant="bold" color="lime">Active</Chip>      {/* statuses, deltas */}
<Chip variant="subtle" color="cyan">$3.252</Chip>    {/* values */}
<Chip variant="caption" color="rose">Designer</Chip> {/* tags */}`;

const STATUS_DOT_CODE = `import { StatusDot } from "@/components/base/badges/status-dot";

<StatusDot color="green" />
<StatusDot color="yellow" />
<StatusDot color="indigo" />`;

type ChipColor = "lime" | "rose" | "yellow" | "cyan" | "neutral" | "gray" | "soft" | "purple" | "blue" | "orange";
type ChipVariant = "bold" | "subtle" | "caption";

const CHIP_ROWS: { variant: ChipVariant; chips: { color: ChipColor; label: string }[] }[] = [
  {
    variant: "bold",
    chips: [
      { color: "lime", label: "Active" },
      { color: "rose", label: "Failed" },
      { color: "yellow", label: "Waiting" },
      { color: "purple", label: "+14.8%" },
      { color: "blue", label: "In review" },
      { color: "orange", label: "Pending" },
      { color: "neutral", label: "Draft" },
    ],
  },
  {
    variant: "subtle",
    chips: [
      { color: "cyan", label: "$3.252" },
      { color: "lime", label: "Live" },
      { color: "blue", label: "v2.4.0" },
      { color: "gray", label: "Archived" },
      { color: "rose", label: "-3.2%" },
      { color: "yellow", label: "Queued" },
      { color: "purple", label: "Beta" },
    ],
  },
  {
    variant: "caption",
    chips: [
      { color: "rose", label: "Designer" },
      { color: "cyan", label: "Confirmed" },
      { color: "gray", label: "v2.4.0" },
      { color: "soft", label: "Archived" },
      { color: "lime", label: "Completed" },
      { color: "blue", label: "Backend" },
      { color: "neutral", label: "Tag" },
    ],
  },
];

/** Chip detail page, mirroring boardui.com/components/chip. */
export default function ChipPage() {
  return (
    <DocsLayout variant="library" title="Chip">
      <div className="flex flex-col gap-8 pb-8">
        <div className="flex flex-col gap-3">
          <div className="flex items-center gap-2">
            <Chip variant="bold" color="lime">
              Free
            </Chip>
          </div>
          <p className="text-body-regular text-text-secondary">
            Colored label chips in three emphasis levels — bold for statuses and deltas, subtle for values, caption
            for tags — across seven color pairs, plus the StatusDot indicator.
          </p>
        </div>

        <Section title="Installation">
          <p className="text-body-regular text-text-secondary">
            You can add this chip component using our CLI or manually. The CLI copies the component source (with
            its internal dependencies) into your project and installs any required npm packages.
          </p>
          <div className="flex items-center justify-between gap-3 rounded-xl border border-border-button-default bg-background-secondary-default px-4 py-3">
            <code className="font-mono text-caption-1-medium text-text-primary">{INSTALL_CMD}</code>
            <CopyButton text={INSTALL_CMD} />
          </div>
          <p className="text-body-regular text-text-secondary">
            Dark mode ready — this component follows BoardUI semantic tokens automatically.
          </p>
        </Section>

        <Section title="Variants & colors">
          <p className="text-body-regular text-text-secondary">
            Three emphasis levels via variant — each available in seven color pairs via color.
          </p>
          <Demo>
            <div className="flex flex-col gap-3">
              {CHIP_ROWS.map((row) => (
                <div key={row.variant} className="flex flex-wrap items-center gap-1.5">
                  <span className="w-16 shrink-0 text-caption-1-semibold text-text-tertiary">{row.variant}</span>
                  {row.chips.map((chip) => (
                    <Chip key={chip.label} variant={row.variant} color={chip.color}>
                      {chip.label}
                    </Chip>
                  ))}
                </div>
              ))}
            </div>
          </Demo>
          <CodeBlock code={VARIANTS_CODE} />
        </Section>

        <Section title="StatusDot">
          <p className="text-body-regular text-text-secondary">
            The StatusDot indicator pairs with chips inside selects and tables. It is a separate registry item: npx
            boardui add status-dot.
          </p>
          <Demo>
            <div className="flex items-center gap-4">
              <span className="flex items-center gap-2 text-body-regular text-text-secondary">
                <StatusDot color="green" /> Green
              </span>
              <span className="flex items-center gap-2 text-body-regular text-text-secondary">
                <StatusDot color="yellow" /> Yellow
              </span>
              <span className="flex items-center gap-2 text-body-regular text-text-secondary">
                <StatusDot color="indigo" /> Indigo
              </span>
            </div>
          </Demo>
          <CodeBlock code={STATUS_DOT_CODE} />
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
