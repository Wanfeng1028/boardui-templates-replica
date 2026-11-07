"use client";

import { useState } from "react";
import Link from "next/link";
import { RiArrowLeftLine, RiCheckLine, RiFileCopyLine } from "@remixicon/react";

import { AppShell } from "@/components/application/app-shell/app-shell";
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

const INSTALL_CMD = "npx boardui@latest add status-dot";

const STATUS_DOT_CODE = `import { StatusDot } from "@/components/base/badges/status-dot";

<StatusDot color="green" />
<StatusDot color="yellow" />
<StatusDot color="indigo" />`;

/**
 * Status Dot detail page. BoardUI has no standalone page for it:
 * boardui.com/components/status-dot returns 404, and the component is
 * documented on boardui.com/components/chip and in the registry
 * (description below) and llms.txt instead.
 */
export default function StatusDotPage() {
  return (
    <AppShell title="Status Dot" columnClassName="max-w-[964px]">
      <div className="flex flex-col gap-8 pb-8">
        <div className="flex flex-col gap-3">
          <div className="flex items-center gap-2">
            <Chip variant="bold" color="lime">
              Free
            </Chip>
          </div>
          <p className="text-body-regular text-text-secondary">
            Colored status indicator dot used inside selects and tables.
          </p>
          <p className="text-caption-1-medium text-text-tertiary">
            Source note: BoardUI documents Status Dot on the Chip page (boardui.com/components/chip), not on a
            standalone page — boardui.com/components/status-dot returns 404. Description from the BoardUI registry
            and llms.txt.
          </p>
        </div>

        <Section title="Installation">
          <p className="text-body-regular text-text-secondary">
            You can add the status dot using our CLI or manually. The CLI copies the component source (with its
            internal dependencies) into your project and installs any required npm packages.
          </p>
          <div className="flex items-center justify-between gap-3 rounded-xl border border-border-button-default bg-background-secondary-default px-4 py-3">
            <code className="font-mono text-caption-1-medium text-text-primary">{INSTALL_CMD}</code>
            <CopyButton text={INSTALL_CMD} />
          </div>
          <p className="text-body-regular text-text-secondary">
            Dark mode ready — this component follows BoardUI semantic tokens automatically.
          </p>
        </Section>

        <Section title="Colors">
          <p className="text-body-regular text-text-secondary">
            A 12×12 status indicator: a 6px solid dot centered on a tinted halo. Green, yellow, and indigo pairs,
            taken from the status dropdown dots in the dashboard. In dark mode only the halo drops to 40% opacity;
            the center dot stays solid. The dot pairs with chips inside selects and tables.
          </p>
          <Demo>
            <div className="flex flex-col gap-4">
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
              <div className="flex flex-col gap-2 border-t border-separator-border pt-4">
                <span className="flex items-center gap-2 text-body-regular text-text-primary">
                  <StatusDot color="green" /> Acme Dashboard — Live
                </span>
                <span className="flex items-center gap-2 text-body-regular text-text-primary">
                  <StatusDot color="yellow" /> Staging — Degraded
                </span>
                <span className="flex items-center gap-2 text-body-regular text-text-primary">
                  <StatusDot color="indigo" /> Archive — Read only
                </span>
              </div>
            </div>
          </Demo>
          <CodeBlock code={STATUS_DOT_CODE} />
        </Section>

        <Section title="Accessibility">
          <p className="text-body-regular text-text-secondary">
            The dot is decorative and hidden from screen readers — always pair it with a text label that names the
            status, as in the rows above.
          </p>
        </Section>

        <Link
          href="/components"
          className="inline-flex items-center gap-1.5 text-body-medium text-text-secondary transition-colors hover:text-text-primary"
        >
          <RiArrowLeftLine className="size-4" aria-hidden />
          Back to all components
        </Link>
      </div>
    </AppShell>
  );
}
