"use client";

import { useState } from "react";
import Link from "next/link";
import { RiArrowLeftLine, RiCheckLine, RiFileCopyLine, RiSearchLine } from "@remixicon/react";

import { AppShell } from "@/components/application/app-shell/app-shell";
import { Chip } from "@/components/base/badges/chip";
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

const INSTALL_CMD = "npx boardui@latest add kbd";

const USAGE_CODE = `import { Kbd } from "@/components/base/kbd/kbd";

<Kbd>⌘K</Kbd>
<Kbd>⌘L</Kbd>
<Kbd>esc</Kbd>
<Kbd>⇧⌘P</Kbd>`;

const CONTEXT_CODE = `{/* Quick search trigger, as in the sidebar */}
<button type="button" className="flex items-center gap-2">
  <RiSearchLine className="size-4" aria-hidden />
  Quick search
  <Kbd>⌘K</Kbd>
</button>`;

/** Kbd detail page. The original site has no standalone page for it
 *  (boardui.com/components/kbd returns 404); this page is built from the
 *  registry description, llms.txt, and the Kbd section of
 *  boardui.com/components/badge. */
export default function KbdPage() {
  return (
    <AppShell title="Kbd" columnClassName="max-w-[964px]">
      <div className="flex flex-col gap-8 pb-8">
        <div className="flex flex-col gap-3">
          <div className="flex items-center gap-2">
            <Chip variant="bold" color="lime">
              Free
            </Chip>
          </div>
          <p className="text-body-regular text-text-secondary">
            Keyboard shortcut hint pill. Kbd shares the badge shape — a small pill that names the keys for a
            shortcut, used in the sidebar&apos;s quick search and in command palette footers.
          </p>
          <p className="text-body-regular text-text-secondary">
            Note: the original site has no standalone page for Kbd (boardui.com/components/kbd returns 404). The
            content here follows the registry description and the Kbd section of the original Badge page.
          </p>
        </div>

        <Section title="Installation">
          <p className="text-body-regular text-text-secondary">
            You can add this kbd component using our CLI or manually. The CLI copies the component source (with its
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

        <Section title="Usage">
          <p className="text-body-regular text-text-secondary">
            Render the keys as text children — a single key, a chord like ⌘K, or a word like esc. Kbd is a plain
            styled kbd element, so it takes any span props.
          </p>
          <Demo>
            <div className="flex flex-wrap items-center gap-2">
              <Kbd>⌘K</Kbd>
              <Kbd>⌘L</Kbd>
              <Kbd>esc</Kbd>
              <Kbd>⇧⌘P</Kbd>
              <Kbd>⌘S</Kbd>
            </div>
          </Demo>
          <CodeBlock code={USAGE_CODE} />
        </Section>

        <Section title="In context">
          <p className="text-body-regular text-text-secondary">
            The usual home for Kbd is next to the label of the thing the shortcut opens — the quick-search trigger
            in the sidebar, or a hint row under a command palette.
          </p>
          <Demo>
            <div className="flex flex-wrap items-center gap-3">
              <span className="inline-flex items-center gap-2 rounded-xl border border-border-button-default bg-background-secondary-default px-3 py-2 text-body-medium text-text-secondary">
                <RiSearchLine className="size-4" aria-hidden />
                Quick search
                <Kbd>⌘K</Kbd>
              </span>
              <span className="inline-flex items-center gap-2 text-body-medium text-text-secondary">
                Press <Kbd>esc</Kbd> to close
              </span>
            </div>
          </Demo>
          <CodeBlock code={CONTEXT_CODE} />
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
