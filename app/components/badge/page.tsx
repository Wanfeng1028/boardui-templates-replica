"use client";

import { useState } from "react";
import Link from "next/link";
import { RiArrowLeftLine, RiCheckLine, RiFileCopyLine } from "@remixicon/react";

import { DocsLayout } from "@/components/application/docs/docs-layout";
import { Chip } from "@/components/base/badges/chip";
import { Badge } from "@/components/base/badges/badge";
import { Kbd } from "@/components/base/kbd/kbd";

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

const INSTALL_CMD = "npx boardui@latest add badge";

const COLORS_CODE = `<Badge color="neutral">91</Badge>   {/* neutral pill (default) */}
<Badge color="primary">152</Badge>  {/* for primary/gradient surfaces */}`;

const KBD_CODE = `import { Kbd } from "@/components/base/kbd/kbd";

<Kbd>⌘L</Kbd>
<Kbd>⌘K</Kbd>
<Kbd>esc</Kbd>`;

/** Badge detail page, mirroring boardui.com/components/badge. */
export default function BadgePage() {
  return (
    <DocsLayout variant="library" title="Badge">
      <div className="flex flex-col gap-8 pb-8">
        <div className="flex flex-col gap-3">
          <div className="flex items-center gap-2">
            <Chip variant="bold" color="lime">
              Free
            </Chip>
          </div>
          <p className="text-body-regular text-text-secondary">
            Numeric counter pills for nav counts and unread totals, plus the Kbd keyboard-shortcut hint used in the
            sidebar&apos;s quick search.
          </p>
        </div>

        <Section title="Installation">
          <p className="text-body-regular text-text-secondary">
            You can add this badge component using our CLI or manually. The CLI copies the component source (with
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

        <Section title="Colors">
          <p className="text-body-regular text-text-secondary">
            neutral (the default) sits on light surfaces; primary is tuned for the blue gradient surfaces like the
            primary button and selected nav items.
          </p>
          <Demo>
            <div className="flex flex-wrap items-center gap-6">
              <span className="flex items-center gap-2 text-body-medium text-text-primary">
                Inbox <Badge color="neutral">91</Badge>
              </span>
              <span className="flex items-center gap-2 text-body-medium text-text-primary">
                Mentions <Badge color="primary">152</Badge>
              </span>
            </div>
          </Demo>
          <CodeBlock code={COLORS_CODE} />
        </Section>

        <Section title="Kbd">
          <p className="text-body-regular text-text-secondary">
            The Kbd shortcut hint shares the badge shape. It&apos;s a separate registry item — add it with npx
            boardui add kbd.
          </p>
          <Demo>
            <div className="flex flex-wrap items-center gap-2">
              <Kbd>⌘L</Kbd>
              <Kbd>⌘K</Kbd>
              <Kbd>esc</Kbd>
            </div>
          </Demo>
          <CodeBlock code={KBD_CODE} />
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
