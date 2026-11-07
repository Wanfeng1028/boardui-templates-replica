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

import { Table, TableBody, TableCell, TableColumn, TableHeader, TableRow } from "@/components/base/table/table";

const ROWS = [
  { id: "1", name: "Olivia Rhye", role: "Product Designer", status: "Active" },
  { id: "2", name: "Phoenix Baker", role: "Engineer", status: "Active" },
  { id: "3", name: "Lana Steiner", role: "Design Lead", status: "Invited" },
  { id: "4", name: "Demi Wilkinson", role: "Frontend Engineer", status: "Active" },
];

function CustomersTable({ size }: { size: "md" | "sm" }) {
  return (
    <Table size={size} aria-label="Customers">
      <TableHeader>
        <TableColumn id="name" isRowHeader>
          Name
        </TableColumn>
        <TableColumn id="role">Role</TableColumn>
        <TableColumn id="status">Status</TableColumn>
      </TableHeader>
      <TableBody>
        {ROWS.map((row) => (
          <TableRow key={row.id} id={row.id}>
            <TableCell>{row.name}</TableCell>
            <TableCell>{row.role}</TableCell>
            <TableCell>{row.status}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}

export default function TablePage() {
  return (
    <DocsLayout variant="library" title="Table">
      <div className="flex flex-col gap-10 pb-10">
        <p className="text-body-regular text-text-secondary">
          An accessible table primitive built on React Aria — semantic markup, keyboard navigation, row
          selection and sortable columns. Pair it with TanStack Table for sorting, filtering and pagination
          logic, as in the example below.
        </p>

        <Section title="Installation">
          <p className="text-body-regular text-text-secondary">
            You can add this table component using our CLI or manually. The CLI copies the component source
            (with its internal dependencies) into your project and installs any required npm packages.
          </p>
          <CodeBlock label="CLI" code={`npx boardui@latest add table`} />
        </Section>

        <Section title="Sizes">
          <p className="text-body-regular text-text-secondary">
            The table comes in 2 sizes: md (normal) and sm (compact, with tighter padding and smaller
            avatars). Switch between them by changing the size prop on the Table component.
          </p>
          <Demo>
            <div className="flex flex-col gap-6">
              <div className="flex flex-col gap-2">
                <span className="text-caption-1-medium text-text-tertiary">Normal · size=&quot;md&quot;</span>
                <CustomersTable size="md" />
              </div>
              <div className="flex flex-col gap-2">
                <span className="text-caption-1-medium text-text-tertiary">Compact · size=&quot;sm&quot;</span>
                <CustomersTable size="sm" />
              </div>
            </div>
          </Demo>
          <CodeBlock
            code={`<Table size="md" aria-label="Customers">  {/* rest of the table components */}</Table>

<Table size="sm" aria-label="Customers">  {/* compact: tighter padding, smaller avatars */}</Table>`}
          />
        </Section>

        <Section title="Table of Contents">
          <p className="text-body-regular text-text-secondary">
            This guide shows how to use TanStack Table — the headless engine for rows, columns, sorting,
            filtering and selection — together with the Table primitive to build your own data table. It
            covers the following topics:
          </p>
          <ul className="flex list-disc flex-col gap-1 ps-5 text-body-regular text-text-secondary">
            <li>Basic table with the Table primitive</li>
            <li>Row selection</li>
            <li>Sorting</li>
            <li>Filtering &amp; search</li>
            <li>Pagination</li>
            <li>Reusable components</li>
          </ul>
        </Section>

        <BackLink />
      </div>
    </DocsLayout>
  );
}
