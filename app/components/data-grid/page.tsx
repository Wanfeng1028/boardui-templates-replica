"use client";

import { useState } from "react";
import Link from "next/link";
import { RiArrowLeftLine, RiCheckLine, RiFileCopyLine } from "@remixicon/react";

import { AppShell } from "@/components/application/app-shell/app-shell";
import { Chip } from "@/components/base/badges/chip";
import { FREE_COMPONENT_PREVIEWS } from "@/components/application/docs/component-previews-free";

/** Detail page for data-grid - content mirrors boardui.com/components/data-grid. */

function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);
  return (
    <button
      type="button"
      onClick={async () => {
        await navigator.clipboard.writeText(text);
        setCopied(true);
        window.setTimeout(() => setCopied(false), 2000);
      }}
      className="inline-flex shrink-0 cursor-pointer items-center gap-1.5 rounded-full border border-border-button-default bg-background-primary-default px-3 py-1.5 text-caption-1-medium text-text-primary"
    >
      {copied ? <RiCheckLine className="size-4 text-foreground-icon-secondary" aria-hidden /> : <RiFileCopyLine className="size-4 text-foreground-icon-secondary" aria-hidden />}
      {copied ? "Copied" : "Copy"}
    </button>
  );
}

const CODE_0_CODE = "const columns: DataGridColumn<Account>[] = [\n  {\n    key: \"account\",\n    header: \"Account\",\n    width: 220,\n    validate: (value) => (String(value).trim() ? undefined : \"Account cannot be empty.\"),\n  },\n  { key: \"stage\", header: \"Stage\", type: \"select\", options: [\"Discovery\", \"Proposal\", \"Closed won\"] },\n  { key: \"seats\", header: \"Seats\", type: \"number\", min: 0, summary: \"sum\" },\n  {\n    key: \"arr\",\n    header: \"ARR\",\n    type: \"number\",\n    min: 0,\n    editable: false,\n    summary: \"sum\",\n    formatSummary: (value) => `$${value.toLocaleString(\"en-US\")}`,\n  },\n];\n\n// Omit onDataChange to make every cell read-only.\n<DataGrid aria-label=\"Accounts\" data={data} columns={columns} getRowId={getRowId} />";

export default function DataGridPage() {
  return (
    <AppShell title="Data Grid" actions={null} columnClassName="max-w-[964px]">
      <div className="flex flex-col gap-6 pb-10">
        <div className="flex items-center gap-2">
          <Chip color="neutral">Free</Chip>
          <span className="text-caption-1-regular text-text-tertiary">ui.gemmae.dev/components/data-grid</span>
        </div>
        <p className="text-body-regular text-text-secondary">A spreadsheet for your application. Edit cells, select ranges, filter records, and work through thousands of rows with a frozen first column and live summaries.</p>
        <section className="flex flex-col gap-3">
          <h2 className="text-title-2-medium text-text-primary">Installation</h2>
          <p className="text-body-regular text-text-secondary">Add the free Data Grid with our CLI. It includes the BoardUI controls and private data helpers it uses. The CLI copies the component source (with its internal dependencies) into your project and installs any required npm packages.</p>
          <div className="flex items-center gap-2 overflow-x-auto rounded-xl border border-border-button-default bg-background-secondary-default p-3">
            <code className="flex-1 whitespace-nowrap text-body-2-regular text-text-primary">npx boardui@latest add data-grid</code>
            <CopyButton text={"npx boardui@latest add data-grid"} />
          </div>
        </section>
        <section className="flex flex-col gap-3">
          <h2 className="text-title-2-medium text-text-primary">Columns and editing</h2>
          <p className="text-body-regular text-text-secondary">Pass typed columns, your data, and a unique, stable getRowId. Provide onDataChange to enable editing. Text, number, and select editors reuse BoardUI inputs and selects. Set bounds with min and max, or reject values with validate. Use format for cell display and formatSummary for sum, average, or count footers. Set editable on individual columns. Formatting changes presentation; editing, copying, and exporting use the underlying values.</p>
          <div className="overflow-x-auto rounded-3xl border border-border-button-default bg-background-primary-default p-4">
              {(() => { const Preview = FREE_COMPONENT_PREVIEWS["/components/data-grid"]; return Preview ? <Preview /> : null; })()}
            </div>
          <pre className="overflow-x-auto rounded-xl border border-border-button-default bg-background-secondary-default p-4 text-body-2-regular text-text-primary"><code>{CODE_0_CODE}</code></pre>
        </section>
        <section className="flex flex-col gap-3">
          <h2 className="text-title-2-medium text-text-primary">Search, filter, and export</h2>
          <p className="text-body-regular text-text-secondary">Search across all columns, click a heading to cycle through ascending, descending, and original order, or filter by exact values. Select columns automatically appear in the Filter menu; add filterable to other columns. Hide columns, resize their dividers, and switch between comfortable and compact rows. The first visible column stays frozen beside the row numbers. On narrow screens it scrolls with the other columns so every cell remains reachable. Row checkboxes select records independently of cell ranges; the header checkbox toggles all filtered rows. Selecting rows shows the count and Delete, Copy, and Export actions in the toolbar. Copy uses tab-separated values; export downloads a CSV, both using visible columns and selected visible records. Delete requires onDataChange and can be undone. Clear the selection to return to the search and view controls. Summaries always reflect the filtered records.</p>
        </section>
        <section className="flex flex-col gap-3">
          <h2 className="text-title-2-medium text-text-primary">Keyboard and clipboard</h2>
          <p className="text-body-regular text-text-secondary">Tab into the grid and use arrow keys to move between cells. Hold Shift to extend a range, or drag across cells with the mouse. Home and End move across a row; add Cmd or Ctrl to jump to the first or last record. Page Up and Page Down move by a viewport. Cmd/Ctrl+A selects all cells. Select a cell with options to reveal its dropdown, then click the chevron to choose a value. Double-click, Enter, or F2 opens the cell editor. Enter saves and moves down; Shift+Enter moves up. Tab saves and moves to the next cell. Escape cancels. Copy a range and paste tab-separated spreadsheet data with the usual keyboard shortcuts. Invalid values reject the entire paste. Undo and redo apply to cell edits, pastes, and row deletions, with up to 100 transactions kept for the mounted grid. Give each grid an aria-label. Wrap right-to-left regions in DirectionProvider; frozen columns, menus, and horizontal arrow keys follow the reading direction.</p>
        </section>
        <section className="flex flex-col gap-3">
          <h2 className="text-title-2-medium text-text-primary">10,000 rows, a small viewport</h2>
          <p className="text-body-regular text-text-secondary">The preview above contains 10,000 actual records. Fixed-height virtualization mounts only the rows in and around the viewport. The header and summary remain outside the scrolling body; a progressive blur softens the top edge as you scroll. Set height to change the viewport height. Search, sorting, filtering, and summaries run in the browser over the provided data. Cell selection and edits follow stable row IDs as records move. Persist changes in your onDataChange handler. Remount the grid with a new React key when switching to a different dataset to reset view state and edit history.</p>
        </section>
        <section className="flex flex-col gap-3">
          <h2 className="text-title-2-medium text-text-primary">Right-to-left and read-only</h2>
          <p className="text-body-regular text-text-secondary">Use DirectionProvider to set the reading direction. This read-only example freezes the first column on the right and mirrors horizontal keyboard navigation. Your column labels and record values can use any language.</p>
        </section>
        <div className="flex items-center gap-2 border-t border-separator-border pt-5">
          <RiArrowLeftLine className="size-4 text-foreground-icon-secondary" aria-hidden />
          <Link href="/components" className="text-body-medium text-text-secondary hover:text-text-primary">Back to Components</Link>
        </div>
      </div>
    </AppShell>
  );
}
