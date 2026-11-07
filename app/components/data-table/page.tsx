"use client";

import { useState } from "react";
import Link from "next/link";
import { RiArrowLeftLine, RiCheckLine, RiFileCopyLine } from "@remixicon/react";

import { DocsLayout } from "@/components/application/docs/docs-layout";
import { Chip } from "@/components/base/badges/chip";
import { FREE_COMPONENT_PREVIEWS } from "@/components/application/docs/component-previews-free";

/** Detail page for data-table - content mirrors boardui.com/components/data-table. */

function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);
  return (
    <button
      type="button"
      onClick={async () => {
        try {
          await navigator.clipboard.writeText(text);
          setCopied(true);
          window.setTimeout(() => setCopied(false), 2000);
        } catch {
          // Clipboard access can be refused; leave the icon unchanged.
        }
      }}
      className="inline-flex shrink-0 cursor-pointer items-center gap-1.5 rounded-full border border-border-button-default bg-background-primary-default px-3 py-1.5 text-caption-1-medium text-text-primary"
    >
      {copied ? <RiCheckLine className="size-4 text-foreground-icon-secondary" aria-hidden /> : <RiFileCopyLine className="size-4 text-foreground-icon-secondary" aria-hidden />}
      {copied ? "Copied" : "Copy"}
    </button>
  );
}

export default function DataTablePage() {
  return (
    <DocsLayout variant="library" title="Data Table">
      <div className="flex flex-col gap-6 pb-10">
        <div className="flex items-center gap-2">
          <Chip color="neutral">Free</Chip>
          <span className="text-caption-1-regular text-text-tertiary">ui.gemmae.dev/components/data-table</span>
        </div>
        <p className="text-body-regular text-text-secondary">A full data table block powered by TanStack Table - sortable columns with custom chevrons, row selection with indeterminate header state, per-row chips and actions, and a pagination footer. Rendering uses the BoardUI table primitives, so the logic and the look stay decoupled.</p>
        <section className="flex flex-col gap-3">
          <h2 className="text-title-2-medium text-text-primary">Installation</h2>
          <p className="text-body-regular text-text-secondary">You can add this data table block using our CLI or manually. The CLI also pulls the table, checkbox, chip, select, pagination, and segmented-control primitives it composes. The CLI copies the component source (with its internal dependencies) into your project and installs any required npm packages.</p>
          <div className="flex items-center gap-2 overflow-x-auto rounded-xl border border-border-button-default bg-background-secondary-default p-3">
            <code className="flex-1 whitespace-nowrap text-body-2-regular text-text-primary">npx boardui@latest add data-table</code>
            <CopyButton text={"npx boardui@latest add data-table"} />
          </div>
        </section>
        <section className="flex flex-col gap-3">
          <h2 className="text-title-2-medium text-text-primary">Preview</h2>
          <div className="overflow-x-auto rounded-3xl border border-border-button-default bg-background-primary-default p-4">
              {(() => { const Preview = FREE_COMPONENT_PREVIEWS["/components/data-table"]; return Preview ? <Preview /> : null; })()}
            </div>
        </section>
        <div className="flex items-center gap-2 border-t border-separator-border pt-5">
          <RiArrowLeftLine className="size-4 text-foreground-icon-secondary" aria-hidden />
          <Link href="/components" className="text-body-medium text-text-secondary hover:text-text-primary">Back to Components</Link>
        </div>
      </div>
    </DocsLayout>
  );
}
