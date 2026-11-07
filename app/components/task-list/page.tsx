"use client";

import { useState, type ReactNode } from "react";
import Link from "next/link";
import { RiArrowLeftLine, RiCheckLine, RiFileCopyLine, RiListCheck3 } from "@remixicon/react";
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

import { TaskList } from "@/components/application/pro/task-list";

export default function TaskListPage() {
  return (
    <AppShell title="Task List" icon={RiListCheck3} actions={null} columnClassName="max-w-[964px]">
      <div className="flex flex-col gap-10 pb-10">
        <p className="text-body-regular text-text-secondary">
          A streaming log of what an agent actually did. Tasks reveal one unit at a time, each animating its
          own height alongside a short blur and lift, so the thread grows the way the work does instead of
          jumping. A task shimmers its running title until every step has landed, then settles.
        </p>
        <Section title="Installation">
          <p className="text-body-regular text-text-secondary">
            Task List is part of BoardUI Pro. Your BoardUI Pro license unlocks this component and all of its
            source files. Activate your license once, then install it directly into your project with the CLI.
          </p>
          <CodeBlock label="1 — Activate your license" code={`npx boardui@latest login YOUR_LICENSE_KEY`} />
          <CodeBlock label="2 — Install the component" code={`npx boardui@latest add task-list`} />
        </Section>

        <Section title="In a chat">
          <p className="text-body-regular text-text-secondary">
            The surface it was built for. Sending the message starts the run, the log streams under the user
            turn, and the answer only arrives once onComplete fires. Keying the list on the turn id gives every
            send a fresh run.
          </p>
          <TaskList />
          <CodeBlock
            code={`const [phase, setPhase] = useState("idle");

// The log is keyed on the turn, so each send starts a fresh run.
{phase !== "idle" && (
  <TaskList
    key={turnId}
    tasks={tasks}
    onComplete={() => setPhase("answered")}
  />
)}`}
          />
        </Section>

        <Section title="Resource chips">
          <p className="text-body-regular text-text-secondary">
            A step can name the files or resources it touched. Pass chips and each renders inline after the
            label, with an optional glyph for the file type. Long names truncate rather than wrapping the row.
          </p>
          <CodeBlock
            code={`import { RiReactjsLine } from "@remixicon/react";

const steps = [
  {
    label: "Read",
    chips: [
      { label: "page.tsx", icon: <RiReactjsLine className="size-3.5 text-[#61dafb]" /> },
      { label: "layout.tsx", icon: <RiReactjsLine className="size-3.5 text-[#61dafb]" /> },
    ],
  },
];`}
          />
        </Section>

        <Section title="Timing and collapse">
          <p className="text-body-regular text-text-secondary">
            startDelay holds the first reveal so the log does not land on the same frame as the user turn, and
            stepInterval paces the rest. Set collapseOnComplete when the log is history rather than the main
            event, and each task folds away the moment its own steps have landed. Pass &quot;all&quot; instead
            to hold every task open until the run finishes and then close them as one motion, which suits a
            thread where an answer follows the log. Either way a reader can still open any task by clicking
            its header.
          </p>
          <CodeBlock
            code={`// Each task folds away as soon as its own steps land.
<TaskList
  tasks={tasks}
  startDelay={320}
  stepInterval={850}
  collapseOnComplete
/>

// Every task stays open until the whole run lands, then they close together.
<TaskList tasks={tasks} collapseOnComplete="all" />`}
          />
        </Section>

        <Section title="Driving it from real events">
          <p className="text-body-regular text-text-secondary">
            An interval is a stand-in. Real steps do not take equal time, so once you have a live stream, pass
            revealed and advance it as tool calls resolve. The internal timer switches off and every animation
            stays the same.
          </p>
          <CodeBlock
            code={`// Each task contributes one unit for its header plus one per step, so
// revealed counts units rather than steps. Drive it from real events
// and the internal timer stays out of the way.
<TaskList tasks={tasks} revealed={unitsSeen} />`}
          />
        </Section>

        <BackLink />
      </div>
    </AppShell>
  );
}
