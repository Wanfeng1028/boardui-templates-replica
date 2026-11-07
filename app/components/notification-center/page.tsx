"use client";

import { useState } from "react";
import {
  RiArrowLeftLine,
  RiCheckLine,
  RiFileCopyLine,
} from "@remixicon/react";

import { AppShell } from "@/components/application/app-shell/app-shell";
import { NotificationCenterDemo } from "@/components/application/notification-center/notification-center-demo";
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

const INSTALL_CMD = "npx boardui@latest add notification-center";

const FILTERING_CODE = `<NotificationCenter
  notifications={notifications}
  defaultTab="mentions"
/>

{/* Controlled filtering */}
<NotificationCenter
  notifications={notifications}
  tab={activeTab}
  onTabChange={setActiveTab}
/>`;

const DATA_CODE = `const notification = {
  id: "deploy-failed",
  category: "system", // mentions | system | activity
  group: "Earlier this week",
  title: "Preview deployment failed",
  description: "The build stopped while validating routes.",
  timestamp: "Sat",
  unread: true,
  status: "error", // neutral | information | success | error
  actions: [
    { id: "retry", label: "Retry", variant: "primary" },
    { id: "logs", label: "View logs", variant: "secondary" },
  ],
};`;

function CodeBlock({ code }: { code: string }) {
  return (
    <pre className="overflow-x-auto rounded-xl border border-border-button-default bg-background-secondary-default p-4 font-mono text-body-2-regular text-text-primary">
      <code>{code}</code>
    </pre>
  );
}
export default function NotificationCenterPage() {
  return (
    <AppShell title="Notification Center" actions={null} columnClassName="max-w-[964px]">
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
            A complete activity inbox with three animated filter tabs, grouped timelines, unread states, avatar
            and status visuals, optional inline actions, mark-all-read behavior, and a composed empty state.
          </p>
        </div>

        <Section title="Installation">
          <p className="text-body-regular text-text-secondary">
            You can add the notification center application block using our CLI or manually:
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

        <Section title="Filtering">
          <p className="text-body-regular text-text-secondary">
            The center owns its active filter by default. Use <code>defaultTab</code> for the initial view, or
            combine <code>tab</code> and <code>onTabChange</code> when the surrounding product needs controlled
            state.
          </p>
          <Demo>
            <div className="w-full max-w-[420px]">
              <NotificationCenterDemo />
            </div>
          </Demo>
          <CodeBlock code={FILTERING_CODE} />
        </Section>

        <Section title="Notification data and actions">
          <p className="text-body-regular text-text-secondary">
            Every item declares its filter category and timeline group. Add an avatar or a semantic status icon,
            set <code>unread</code>, and attach small actions. Action presses mark that item read and report
            both IDs through <code>onAction</code>.
          </p>
          <CodeBlock code={DATA_CODE} />
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

// 已按原版逐字校对：boardui.com/components/notification-center（2026-11-07，curl 抓取原版 SSR HTML + flight 数据核对）
