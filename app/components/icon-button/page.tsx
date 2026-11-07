"use client";

import { useState } from "react";
import {
  RiArrowLeftLine,
  RiCheckLine,
  RiDeleteBinLine,
  RiEditLine,
  RiFileCopyLine,
  RiSearchLine,
} from "@remixicon/react";

import { AppShell } from "@/components/application/app-shell/app-shell";
import { IconButton } from "@/components/base/buttons/icon-button";
import { LinkButton } from "@/components/base/buttons/link-button";
import { cx } from "@/utils/cx";

function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);
  return (
    <button
      type="button"
      onClick={async () => {
        await navigator.clipboard.writeText(text);
        setCopied(true);
        window.setTimeout(() => setCopied(false), 1500);
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

const INSTALL_CMD = "npx boardui@latest add icon-button";

const SIZES_CODE = `<IconButton icon={RiEditLine} size="medium" aria-label="Edit" /> {/* 36px, 20px icon */}
<IconButton icon={RiEditLine} size="small" aria-label="Edit" />  {/* 32px, 16px icon */}

/* Disabled */
<IconButton icon={RiEditLine} aria-label="Edit" disabled />`;

/**
 * Icon Button — docs page replica.
 * Source: boardui.com/components/icon-button. Free component.
 */
export default function IconButtonPage() {
  return (
    <AppShell title="Icon Button" actions={null} columnClassName="max-w-[964px]">
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
            A square secondary icon-only button — medium 36px (20px icon) and small 32px (16px
            icon), both radius 10. Used for row actions, header bells, and toolbar controls.
          </p>
        </div>

        <Section title="Installation">
          <p className="text-body-regular text-text-secondary">
            You can add this icon button component using our CLI or manually. The CLI copies the
            component source (with its internal dependencies) into your project and installs any
            required npm packages.
          </p>
          <div className="flex items-center justify-between gap-3 rounded-xl border border-border-button-default bg-background-secondary-default px-4 py-3">
            <code className="overflow-x-auto font-mono text-body-2-regular text-text-primary">
              {INSTALL_CMD}
            </code>
            <CopyButton text={INSTALL_CMD} />
          </div>
          <p className="text-body-regular text-text-secondary">
            Dark mode ready — this component follows BoardUI semantic tokens automatically.
          </p>
        </Section>

        <Section title="Sizes & states">
          <p className="text-body-regular text-text-secondary">
            Pass any Remix Icon component reference via <code>icon</code>, pick a{" "}
            <code>size</code>, and always provide an <code>aria-label</code> — there&apos;s no
            visible text.
          </p>
          <Demo>
            <div className="flex items-center gap-2">
              <IconButton icon={RiEditLine} size="medium" aria-label="Edit" />
              <IconButton icon={RiSearchLine} size="medium" aria-label="Search" />
              <IconButton icon={RiDeleteBinLine} size="medium" aria-label="Delete" />
              <IconButton icon={RiEditLine} size="small" aria-label="Edit" />
              <IconButton icon={RiSearchLine} size="small" aria-label="Search" />
              <IconButton icon={RiEditLine} aria-label="Edit" disabled />
            </div>
          </Demo>
          <CodeBlock code={SIZES_CODE} />
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
