"use client";

import { useState } from "react";
import Link from "next/link";
import { RiArrowDownSLine, RiArrowLeftLine, RiCheckLine, RiFileCopyLine } from "@remixicon/react";

import { AppShell } from "@/components/application/app-shell/app-shell";
import { Button } from "@/components/base/buttons/button";
import { Chip } from "@/components/base/badges/chip";
import { StatusDot } from "@/components/base/badges/status-dot";
import { Select, SelectItem } from "@/components/base/select/select";

function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);
  return (
    <Button
      variant="secondary"
      size="small"
      leadingIcon={copied ? RiCheckLine : RiFileCopyLine}
      onClick={() => {
        navigator.clipboard?.writeText(text)?.then(() => {
          setCopied(true);
          window.setTimeout(() => setCopied(false), 1600);
        }).catch(() => {
          // Clipboard access can be refused; leave the icon unchanged.
        });
      }}
    >
      {copied ? "Copied" : "Copy"}
    </Button>
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
    <div className="flex justify-center rounded-3xl border border-border-button-default bg-background-primary-default p-6">
      {children}
    </div>
  );
}

function Code({ code }: { code: string }) {
  return (
    <pre className="overflow-x-auto rounded-xl border border-border-button-default bg-background-secondary-default p-4 font-mono text-body-2-regular text-text-primary">
      <code>{code}</code>
    </pre>
  );
}

const LABEL_CODE = `{/* label names the select; placeholder shows until something is picked */}
<Select label="Role" placeholder="Select a role" className="w-[240px]">
  <SelectItem id="admin" textValue="Admin">Admin</SelectItem>
  <SelectItem id="editor" textValue="Editor">Editor</SelectItem>
  <SelectItem id="viewer" textValue="Viewer">Viewer</SelectItem>
</Select>`;

const STATUS_DOT_CODE = `import { StatusDot } from "@/components/base/badges/status-dot";

{/* Items take free-form content - dots, avatars, icons */}
<Select aria-label="Purchase status" defaultSelectedKey="completed" className="w-[142px]">
  <SelectItem id="completed" textValue="Completed">
    <StatusDot color="green" />
    Completed
  </SelectItem>
  <SelectItem id="waiting" textValue="Waiting">
    <StatusDot color="yellow" />
    Waiting
  </SelectItem>
  <SelectItem id="processing" textValue="Processing">
    <StatusDot color="indigo" />
    Processing
  </SelectItem>
</Select>`;

/** Select detail page: boardui.com/components/select, in-site. */
export default function SelectPage() {
  return (
    <AppShell title="Select" icon={RiArrowDownSLine} actions={null} columnClassName="max-w-[964px]">
      <div className="flex flex-col gap-8 px-1 pb-10">
        <div className="flex items-center gap-2">
          <Chip color="lime" variant="subtle">
            Free
          </Chip>
          <span className="text-caption-1-medium text-text-tertiary">Base</span>
        </div>
        <p className="text-body-regular text-text-secondary">
          A dropdown select built on React Aria - the trigger matches the Figma surface 1:1, the popover is
          non-modal so the page keeps scrolling, and items accept free-form content like status dots and avatars.
        </p>
        <Demo>
          <Select aria-label="Framework" defaultSelectedKey="react" className="w-[168px]">
            <SelectItem id="react" textValue="React">
              React
            </SelectItem>
            <SelectItem id="vue" textValue="Vue">
              Vue
            </SelectItem>
            <SelectItem id="svelte" textValue="Svelte">
              Svelte
            </SelectItem>
          </Select>
        </Demo>
        <Section title="Installation">
          <p className="text-body-regular text-text-secondary">
            You can add this select component using our CLI or manually. The CLI copies the component source (with
            its internal dependencies) into your project and installs any required npm packages.
          </p>
          <div className="flex items-center justify-between gap-3 rounded-xl border border-border-button-default bg-background-secondary-default px-4 py-3">
            <code className="font-mono text-body-2-medium text-text-primary">npx boardui@latest add select</code>
            <CopyButton text="npx boardui@latest add select" />
          </div>
        </Section>
        <Section title="Label and placeholder">
          <p className="text-body-regular text-text-secondary">
            Pass <code className="font-mono text-body-2-medium text-text-primary">label</code> for a visible field
            label: React Aria renders it as the select&apos;s label and names the trigger with it, so screen readers
            announce both. <code className="font-mono text-body-2-medium text-text-primary">placeholder</code> shows
            until something is picked. Selects without a visible label, like the filters above, take{" "}
            <code className="font-mono text-body-2-medium text-text-primary">aria-label</code> instead.
          </p>
          <Demo>
            {/* The repo's Select renders no Label element itself, so the visible
                label sits above the trigger; placeholder shows until picked. */}
            <div className="flex w-[240px] flex-col gap-1.5">
              <span className="text-body-2-medium text-text-secondary">Role</span>
              <Select placeholder="Select a role" className="w-full">
                <SelectItem id="admin" textValue="Admin">
                  Admin
                </SelectItem>
                <SelectItem id="editor" textValue="Editor">
                  Editor
                </SelectItem>
                <SelectItem id="viewer" textValue="Viewer">
                  Viewer
                </SelectItem>
              </Select>
            </div>
          </Demo>
          <Code code={LABEL_CODE} />
        </Section>
        <Section title="With status dot">
          <p className="text-body-regular text-text-secondary">
            Items render arbitrary children next to the label - always pass{" "}
            <code className="font-mono text-body-2-medium text-text-primary">textValue</code> so typeahead and the
            trigger label stay correct.
          </p>
          <Demo>
            <Select aria-label="Purchase status" defaultSelectedKey="completed" className="w-[142px]">
              <SelectItem id="completed" textValue="Completed">
                <StatusDot color="green" />
                Completed
              </SelectItem>
              <SelectItem id="waiting" textValue="Waiting">
                <StatusDot color="yellow" />
                Waiting
              </SelectItem>
              <SelectItem id="processing" textValue="Processing">
                <StatusDot color="indigo" />
                Processing
              </SelectItem>
            </Select>
          </Demo>
          <Code code={STATUS_DOT_CODE} />
        </Section>
        <Link
          href="/components"
          className="mt-2 inline-flex w-fit items-center gap-1.5 text-body-medium text-text-secondary"
        >
          <RiArrowLeftLine className="size-4" />
          Back to all components
        </Link>
      </div>
    </AppShell>
  );
}
