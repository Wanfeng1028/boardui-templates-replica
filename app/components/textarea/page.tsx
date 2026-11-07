"use client";

import { useState, type ReactNode } from "react";
import Link from "next/link";
import { RiArrowLeftLine, RiCheckLine, RiFileCopyLine, RiTextSnippet } from "@remixicon/react";
import { AppShell } from "@/components/application/app-shell/app-shell";

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

import { Textarea } from "@/components/base/textarea/textarea";

export default function TextareaPage() {
  const [note, setNote] = useState("Ship the release notes before Friday.");
  const [bio, setBio] = useState("Design engineer. I build dashboards for a living.");
  return (
    <AppShell title="Textarea" icon={RiTextSnippet} actions={null} columnClassName="max-w-[964px]">
      <div className="flex flex-col gap-10 pb-10">
        <p className="text-body-regular text-text-secondary">
          A multiline field built on React Aria - the same shell, label, hint and states as Input, plus auto-grow
          and character counting for notes, messages and settings pages.
        </p>

        <Section title="Preview">
          <Demo>
            <div className="w-full max-w-[400px]">
              <Textarea
                label="Release notes"
                isRequired
                tooltip
                placeholder="What changed in this version?"
                hint="Markdown is supported."
                rows={4}
              />
            </div>
          </Demo>
          <CodeBlock
            code={`import { Textarea } from "@/components/base/textarea/textarea";

export function Example() {
  return (
    <Textarea
      label="Release notes"
      isRequired
      tooltip
      placeholder="What changed in this version?"
      hint="Markdown is supported."
      rows={4}
    />
  );
}`}
          />
        </Section>

        <Section title="Installation">
          <p className="text-body-regular text-text-secondary">
            You can add the textarea component using our CLI or manually:
          </p>
          <CodeBlock label="CLI" code={`npx boardui@latest add textarea`} />
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
            <code>medium</code> and <code>small</code> match <code>Input</code>&apos;s insets, so the two
            components stack in a form without a seam. <code>rows</code> sets the resting height.
          </p>
          <Demo>
            <div className="flex w-full max-w-[400px] flex-col gap-4">
              <Textarea
                label="Description"
                hint="Medium is the default, 14px type in a 8px shell."
                placeholder="Tell us about this workspace"
              />
              <Textarea
                size="small"
                label="Description"
                hint="Small tightens the horizontal inset to match a small input."
                placeholder="Tell us about this workspace"
              />
            </div>
          </Demo>
          <CodeBlock
            code={`// medium (default) and small - the same two sizes as Input, so a
// textarea stacked under an input lines up on both edges.
<Textarea label="Description" placeholder="Tell us about this workspace" />
<Textarea size="small" label="Description" placeholder="Tell us about this workspace" />`}
          />
        </Section>

        <Section title="Auto resize">
          <p className="text-body-regular text-text-secondary">
            <code>autoResize</code> grows the field with its text, one line at a time, between{" "}
            <code>rows</code> and <code>maxRows</code>. Past the ceiling it scrolls. The height is measured from
            zero on every change, so the field shrinks back when text is deleted.
          </p>
          <Demo>
            <div className="w-full max-w-[400px]">
              <Textarea
                aria-label="Note"
                placeholder="Write as much as you need"
                value={note}
                onChange={setNote}
                autoResize
                rows={2}
                maxRows={8}
              />
            </div>
          </Demo>
          <CodeBlock
            code={`// Grows a line at a time from rows up to maxRows, then scrolls.
// autoResize hides the native grab handle, since the field sizes itself.
<Textarea
  label="Message"
  placeholder="Write as much as you need"
  autoResize
  rows={2}
  maxRows={8}
/>`}
          />
        </Section>

        <Section title="Character count">
          <p className="text-body-regular text-text-secondary">
            <code>showCount</code> puts the counter on the hint row. With <code>maxLength</code> it reads
            12/160 and the browser enforces the limit; without one it just counts.
          </p>
          <Demo>
            <div className="w-full max-w-[400px]">
              <Textarea
                label="Bio"
                value={bio}
                onChange={setBio}
                placeholder=""
                hint="Appears on your public profile."
                rows={3}
                maxLength={160}
                showCount
              />
            </div>
          </Demo>
          <CodeBlock
            code={`// maxLength is enforced by the browser; showCount renders the counter
// on the hint row. Works controlled or uncontrolled.
const [bio, setBio] = useState("");

<Textarea
  label="Bio"
  value={bio}
  onChange={setBio}
  hint="Appears on your public profile."
  maxLength={160}
  showCount
/>`}
          />
        </Section>

        <Section title="States">
          <p className="text-body-regular text-text-secondary">
            Hover and focus cross-fade the ring. <code>isDisabled</code> and <code>isInvalid</code> override both
            and repaint the field, hint and label. <code>resize=&quot;none&quot;</code> removes the native grab
            handle when a fixed height matters more than the reader&apos;s comfort.
          </p>
          <Demo>
            <div className="flex w-full max-w-[400px] flex-col gap-4">
              <Textarea label="Cover letter" placeholder="Why are you a good fit?" />
              <Textarea
                label="Cover letter"
                defaultValue="I have shipped design systems for six years."
              />
              <Textarea label="Cover letter" placeholder="Why are you a good fit?" isDisabled />
              <Textarea
                label="Cover letter"
                defaultValue="Too short."
                isInvalid
                hint="Please write at least 200 characters."
              />
            </div>
          </Demo>
          <CodeBlock
            code={`// Hover / focus cross-fade the ring automatically. isDisabled and
// isInvalid override them and repaint the field, hint and label.
<Textarea label="Cover letter" placeholder="Why are you a good fit?" />
<Textarea label="Cover letter" defaultValue="I have shipped design systems for six years." />
<Textarea label="Cover letter" placeholder="Why are you a good fit?" isDisabled />
<Textarea label="Cover letter" defaultValue="Too short." isInvalid hint="Please write at least 200 characters." />`}
          />
        </Section>

        <BackLink />
      </div>
    </AppShell>
  );
}

// 已按原版逐字校对：boardui.com/components/textarea（2026-11-07，curl 抓取原版 SSR HTML + flight 数据核对）
