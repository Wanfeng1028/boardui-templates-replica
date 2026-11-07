"use client";

import { useState, type ReactNode } from "react";
import Link from "next/link";
import { RiArrowLeftLine, RiCheckLine, RiFileCopyLine, RiFolder3Line } from "@remixicon/react";
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

import { TreeViewPreview } from "@/components/application/docs/tree-view-preview";

export default function TreeViewPage() {
  return (
    <DocsLayout variant="library" title="Tree View">
      <div className="flex flex-col gap-10 pb-10">
        <p className="text-body-regular text-text-secondary">
          Navigate nested folders and structured content with expandable branches, smooth blur transitions, and
          keyboard navigation.
        </p>

        <Section title="Installation">
          <p className="text-body-regular text-text-secondary">
            You can add the tree view using our CLI or manually:
          </p>
          <CodeBlock label="CLI" code={`npx boardui@latest add tree-view`} />
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

        <Section title="Controlled and data-driven">
          <p className="text-body-regular text-text-secondary">
            Keep expansion and selection in your own state with <code>expandedKeys</code> and{" "}
            <code>selectedKeys</code>. Use <code>TreeViewCollection</code> to recursively render nested data.
            Every item needs a unique, stable <code>id</code>.
          </p>
          <p className="text-body-regular text-text-secondary">
            Branches expand and collapse with a smooth height, fade, and blur transition. Exiting rows leave
            keyboard navigation immediately, and reduced motion disables the animation.
          </p>
          <Demo>
            <TreeViewPreview />
          </Demo>
          <CodeBlock code={`import { useState } from "react";
import type { Key, Selection } from "react-aria-components";
import { TreeView, TreeViewCollection, TreeViewItem } from "@/components/base/tree-view/tree-view";

interface FileNode {
  id: string;
  name: string;
  children?: FileNode[];
}

const files: FileNode[] = [
  { id: "design", name: "Design", children: [
    { id: "logo", name: "Logo.svg" },
    { id: "colors", name: "Colors.fig" },
  ] },
  { id: "notes", name: "Project notes.md" },
];

function renderFile(item: FileNode) {
  return (
    <TreeViewItem id={item.id} label={item.name}>
      <TreeViewCollection items={item.children ?? []}>{renderFile}</TreeViewCollection>
    </TreeViewItem>
  );
}

export function Example() {
  const [expandedKeys, setExpandedKeys] = useState<Set<Key>>(new Set(["design"]));
  const [selectedKeys, setSelectedKeys] = useState<Selection>(new Set(["logo"]));

  return (
    <TreeView
      aria-label="Workspace files"
      items={files}
      expandedKeys={expandedKeys}
      onExpandedChange={setExpandedKeys}
      selectedKeys={selectedKeys}
      onSelectionChange={setSelectedKeys}
    >
      {renderFile}
    </TreeView>
  );
}
`}
          />
        </Section>

        <Section title="Multiple selection">
          <p className="text-body-regular text-text-secondary">
            Set <code>selectionMode=&quot;multiple&quot;</code> to toggle items independently. Hold Shift to
            select a range with the keyboard. Single selection is the default; use{" "}
            <code>selectionMode=&quot;none&quot;</code> with <code>onAction</code> for an action-only tree.
          </p>
          <CodeBlock
            code={`<TreeView
  aria-label="Documents to share"
  selectionMode="multiple"
  defaultExpandedKeys={["documents"]}
  defaultSelectedKeys={["overview", "guidelines"]}
>
  <TreeViewItem id="documents" label="Documents" trailingContent="3 files">
    <TreeViewItem id="overview" label="Overview.md" />
    <TreeViewItem id="guidelines" label="Guidelines.md" />
    <TreeViewItem id="changelog" label="Changelog.md" />
  </TreeViewItem>
</TreeView>`}
          />
        </Section>

        <Section title="Sizes, icons, and states">
          <p className="text-body-regular text-text-secondary">
            Use <code>size=&quot;sm&quot;</code> for compact rows and <code>showGuides=&#123;false&#125;</code>{" "}
            to hide guide lines. Branches get folder icons automatically; pass a Remix Icon component to{" "}
            <code>icon</code> or <code>expandedIcon</code> to customize them. Disabled items prevent
            interaction, and <code>renderEmptyState</code> supplies an empty message.
          </p>
          <CodeBlock
            code={`import { RiFolder3Line } from "@remixicon/react";

<TreeView aria-label="Repository files" size="sm" showGuides={false}>
  <TreeViewItem id="index" label="index.tsx" />
  <TreeViewItem id="private" label="Private files" isDisabled trailingContent="Restricted" />
  <TreeViewItem id="archive" label="Archive" icon={RiFolder3Line} trailingContent="Empty" />
</TreeView>

<TreeView aria-label="Search results" renderEmptyState={() => "No matching files."}>
  {[]}
</TreeView>`}
          />
        </Section>

        <Section title="Right-to-left">
          <p className="text-body-regular text-text-secondary">
            Set the locale with <code>DirectionProvider</code>. Indentation, guide lines, disclosure icons, and
            horizontal keyboard navigation follow the reading direction.
          </p>
          <CodeBlock
            code={`import { DirectionProvider } from "@/components/foundations/direction/direction";
import { TreeView, TreeViewItem } from "@/components/base/tree-view/tree-view";

<DirectionProvider locale="ar">
  <TreeView aria-label="ملفات المشروع" defaultExpandedKeys={["project"]}>
    <TreeViewItem id="project" label="المشروع">
      <TreeViewItem id="design" label="التصميم">
        <TreeViewItem id="logo" label="الشعار.svg" />
      </TreeViewItem>
      <TreeViewItem id="notes" label="الملاحظات.md" />
    </TreeViewItem>
  </TreeView>
</DirectionProvider>`}
          />
        </Section>

        <Section title="Keyboard navigation">
          <p className="text-body-regular text-text-secondary">
            Tab into the tree, then use Up and Down to move through visible items. Right expands a branch or
            moves to its first child; Left collapses it or returns to its parent. Home and End jump to the first
            and last visible items. Type a label to find it, and press Space to select.
          </p>
          <p className="text-body-regular text-text-secondary">
            Give every tree an <code>aria-label</code> or <code>aria-labelledby</code>. Wrap RTL regions in
            BoardUI&apos;s <code>DirectionProvider</code> with the appropriate locale; disclosure icons,
            indentation, and horizontal keys follow the direction automatically.
          </p>
        </Section>

        <BackLink />
      </div>
    </DocsLayout>
  );
}

// 已按原版逐字校对：boardui.com/components/tree-view（2026-11-07，curl 抓取原版 SSR HTML + flight 数据核对）
