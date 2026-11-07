"use client";

import { useState } from "react";
import Link from "next/link";
import { RiArrowLeftLine, RiCheckLine, RiFileCopyLine } from "@remixicon/react";

import { DocsLayout } from "@/components/application/docs/docs-layout";
import { Chip } from "@/components/base/badges/chip";
import { CloseButton } from "@/components/base/buttons/close-button";

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

const INSTALL_CMD = "npx boardui@latest add close-button";

const SIZES_CODE = `<CloseButton size="2xs" aria-label="Close" /> {/* 16px, 1.6px stroke */}
<CloseButton size="xs" aria-label="Close" /> {/* 20px, 2px stroke */}
<CloseButton size="sm" aria-label="Close" /> {/* 24px, 2px stroke */}
<CloseButton size="md" aria-label="Close" /> {/* 32px, 2.5px stroke */}`;

const CONTEXT_CODE = `<header className="flex items-center justify-between p-4">
  <p className="text-body-medium text-text-primary">Modal title</p>
  <CloseButton size="md" aria-label="Close modal" onClick={onClose} />
</header>`;
export default function CloseButtonPage() {
  return (
    <DocsLayout variant="library" title="Close Button">
      <div className="flex flex-col gap-8 pb-8">
        <div className="flex flex-col gap-3">
          <div className="flex items-center gap-2">
            <Chip variant="bold" color="lime">
              Free
            </Chip>
          </div>
          <p className="text-body-regular text-text-secondary">
            The circular ✕ used to dismiss compact surfaces, announcements, toasts, modals, and drawers. Every
            size renders its own glyph with a literal (not scaled) stroke - 1.6px at 2xs, 2px at xs/sm, and
            2.5px at md - so the weight stays pixel-true.
          </p>
        </div>

        <Section title="Installation">
          <p className="text-body-regular text-text-secondary">
            You can add this close button component using our CLI or manually:
          </p>
          <div className="flex items-center justify-between gap-3 rounded-xl border border-border-button-default bg-background-secondary-default px-4 py-3">
            <code className="font-mono text-caption-1-medium text-text-primary">{INSTALL_CMD}</code>
            <CopyButton text={INSTALL_CMD} />
          </div>
          <p className="text-body-regular text-text-secondary">
            The CLI copies the component source (with its internal dependencies) into your project and installs any
            required npm packages.
          </p>
          <p className="text-body-regular text-text-secondary">
            Dark mode ready - this component follows BoardUI semantic tokens automatically. Set up theme switching.
          </p>
          <p className="text-body-regular text-text-secondary">
            Using a shared UI package or custom import aliases? Configure your installation paths before running the
            CLI. Copy-paste examples use the default imports.
          </p>
        </Section>

        <Section title="Sizes">
          <p className="text-body-regular text-text-secondary">
            Four sizes via the <code>size</code> prop - 16, 20, 24, and 32px. Always pass an{" "}
            <code>aria-label</code>, the control has no visible text.
          </p>
          <Demo>
            <div className="flex items-center gap-4">
              <span className="flex items-center gap-2 text-body-regular text-text-secondary">
                <CloseButton size="2xs" aria-label="Close" /> 2xs
              </span>
              <span className="flex items-center gap-2 text-body-regular text-text-secondary">
                <CloseButton size="xs" aria-label="Close" /> xs
              </span>
              <span className="flex items-center gap-2 text-body-regular text-text-secondary">
                <CloseButton size="sm" aria-label="Close" /> sm
              </span>
              <span className="flex items-center gap-2 text-body-regular text-text-secondary">
                <CloseButton size="md" aria-label="Close" /> md
              </span>
            </div>
          </Demo>
          <CodeBlock code={SIZES_CODE} />
        </Section>

        <Section title="In a modal header">
          <Demo>
            <header className="flex items-center justify-between p-4">
              <p className="text-body-medium text-text-primary">Modal title</p>
              <CloseButton size="md" aria-label="Close modal" />
            </header>
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
    </DocsLayout>
  );
}

// 已按原版逐字校对：boardui.com/components/close-button（2026-11-07，curl 抓取原版 SSR HTML + flight 数据核对）
