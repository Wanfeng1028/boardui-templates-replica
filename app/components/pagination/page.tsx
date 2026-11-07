"use client";

import { useState } from "react";
import {
  RiArrowLeftLine,
  RiCheckLine,
  RiFileCopyLine,
} from "@remixicon/react";

import { AppShell } from "@/components/application/app-shell/app-shell";
import { Pagination } from "@/components/base/pagination/pagination";
import { LinkButton } from "@/components/base/buttons/link-button";
import { cx } from "@/utils/cx";

function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);
  return (
    <button
      type="button"
      onClick={async () => {
        try {
          await navigator.clipboard.writeText(text);
          setCopied(true);
          window.setTimeout(() => setCopied(false), 1500);
        } catch {
          // Clipboard access can be refused; leave the icon unchanged.
        }
      }}
      className="flex shrink-0 items-center gap-1.5 rounded-full border border-border-button-default bg-background-primary-default px-3 py-1.5 text-caption-1-semibold text-text-secondary hover:text-text-primary"
      aria-label="Copy install command"
    >
      {copied ? <RiCheckLine className="size-4" /> : <RiFileCopyLine className="size-4" />}
      {copied ? "Copied" : "Copy"}
    </button>
  );
}

function CodeBlock({ code }: { code: string }) {
  return (
    <pre className="overflow-x-auto rounded-xl border border-border-button-default bg-background-secondary-default p-4 font-mono text-body-2-regular text-text-primary">
      <code>{code}</code>
    </pre>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="flex flex-col gap-4">
      <h2 className="text-title-2-medium text-text-primary">{title}</h2>
      {children}
    </section>
  );
}

function Demo({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex items-center justify-center rounded-3xl border border-border-button-default bg-background-primary-default p-6">
      {children}
    </div>
  );
}

const INSTALL_CMD = "npx boardui@latest add pagination";

const CONTROLLED_CODE = `import { useState } from "react";
import { Pagination } from "@/components/base/pagination/pagination";

export function Example() {
  const [page, setPage] = useState(1);

  return (
    <Pagination
      page={page}
      totalPages={10}
      onChange={setPage}
    />
  );
}`;
export default function PaginationPage() {
  const [page, setPage] = useState(6);
  return (
    <AppShell title="Pagination" actions={null} columnClassName="max-w-[964px]">
      <div className="flex flex-col gap-8 pb-8">
        <div className="flex flex-col gap-3">
          <span
            className={cx(
              "w-fit rounded-full border border-border-button-default px-2.5 py-0.5",
              "text-caption-1-semibold text-text-secondary",
            )}
          >
            Free
          </span>
          <p className="text-body-regular text-text-secondary">
            A controlled pager that reuses the secondary small Button for Previous / Next and renders 32px page
            cells. When there are many pages it collapses to leading and trailing dots around a sibling window,
            as in the example below.
          </p>
        </div>

        <Section title="Installation">
          <p className="text-body-regular text-text-secondary">
            You can add this pagination component using our CLI or manually:
          </p>
          <div className="flex items-center justify-between gap-3 rounded-xl border border-border-button-default bg-background-secondary-default px-4 py-3">
            <code className="overflow-x-auto font-mono text-body-2-regular text-text-primary">
              {INSTALL_CMD}
            </code>
            <CopyButton text={INSTALL_CMD} />
          </div>
          <p className="text-body-regular text-text-secondary">
            The CLI copies the component source (with its internal dependencies) into your project and installs
            any required npm packages.
          </p>
          <p className="text-body-regular text-text-secondary">
            Dark mode ready - this component follows BoardUI semantic tokens automatically. Set up theme switching.
          </p>
          <p className="text-body-regular text-text-secondary">
            Using a shared UI package or custom import aliases? Configure your installation paths before running the
            CLI. Copy-paste examples use the default imports.
          </p>
        </Section>

        <Section title="Table of Contents">
          <p className="text-body-regular text-text-secondary">
            Pagination is a <code>controlled</code> component - you own the current page state and it renders the
            page window, overflow dots and Previous / Next controls (which reuse the <code>Button</code>{" "}
            component). We&apos;ll cover the following topics:
          </p>
          <ul className="flex list-disc flex-col gap-1 ps-5 text-body-regular text-text-secondary">
            <li>Basic pagination</li>
            <li>Controlled page state</li>
            <li>Overflow &amp; the sibling window</li>
            <li>Reusing the Button component</li>
          </ul>
          <Demo>
            <div className="w-full">
              <Pagination page={page} totalPages={181} onChange={setPage} />
            </div>
          </Demo>
          <p className="text-body-2-regular text-text-tertiary">Current page: {page} of 181</p>
          <CodeBlock code={CONTROLLED_CODE} />
        </Section>

        <div>
          <LinkButton href="/components" leadingIcon={RiArrowLeftLine}>
            Back to components
          </LinkButton>
        </div>
      </div>
    </AppShell>
  );
}

// 已按原版逐字校对：boardui.com/components/pagination（2026-11-07，curl 抓取原版 SSR HTML + flight 数据核对）
