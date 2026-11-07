"use client";

import { useState } from "react";
import {
  RiArrowLeftLine,
  RiCheckLine,
  RiFileCopyLine,
} from "@remixicon/react";

import { AppShell } from "@/components/application/app-shell/app-shell";
import { Notification } from "@/components/base/notification/notification";
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

const INSTALL_CMD = "npx boardui@latest add notification";

const STATUS_CODE = `<Notification
  status="information"
  title="New version available"
  description="Refresh to start using the latest dashboard updates."
/>

<Notification
  status="success"
  title="Changes saved"
  description="Your workspace settings have been updated."
/>

<Notification
  status="error"
  title="Upload failed"
  description="Check the file size and try again."
/>`;

const ICONS_CODE = `import { RiSparklingFill } from "@remixicon/react";

{/* Custom icon */}
<Notification
  icon={RiSparklingFill}
  title="Custom icon"
  description="Use any Remix icon."
/>

{/* Avatar with presence */}
<Notification
  avatar={{
    src: "/avatars/livia-saris.webp",
    alt: "Livia Saris",
    presence: "busy",
  }}
  title="Livia Saris"
  timestamp="just now"
  description="Mentioned you in the launch checklist."
/>`;

const ACTIONS_CODE = `<Notification
  status="information"
  title="Backup ready"
  description="Your latest workspace backup is ready to download."
  actions={[
    { label: "Not now", variant: "secondary", onClick: dismiss },
    { label: "Download", variant: "primary", onClick: download },
  ]}
/>`;

const POSITION_CODE = `import {
  Notification,
  NotificationViewport,
} from "@/components/base/notification/notification";

<NotificationViewport position="top-center">
  <Notification
    status="information"
    title="New version available"
    description="Refresh to start using the latest dashboard updates."
  />
</NotificationViewport>

{/* Available positions:
    top-left, top-center, top-right,
    bottom-left, bottom-center, bottom-right */}`;

const COUNTDOWN_CODE = `const [notifications, setNotifications] = useState([]);

function showNotification(variant) {
  setNotifications((current) => [
    ...current,
    { id: crypto.randomUUID(), variant },
  ]);
}

<Button onClick={() => showNotification("success")}>Replay notification</Button>
<Button onClick={() => showNotification("information")}>Information</Button>
<Button onClick={() => showNotification("error")}>Error</Button>
<Button onClick={() => showNotification("avatar")}>With avatar</Button>
<Button onClick={() => showNotification("actions")}>With buttons</Button>

<NotificationViewport>
  {notifications.map((notification) => (
    <Notification
      {...variants[notification.variant]}
      key={notification.id}
      autoDismissDuration={2500}
      introDelay={0}
      onDismiss={() =>
        setNotifications((current) =>
          current.filter((item) => item.id !== notification.id)
        )
      }
    />
  ))}
</NotificationViewport>`;
export default function NotificationPage() {
  return (
    <AppShell title="Notification" actions={null} columnClassName="max-w-[964px]">
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
            A flexible floating message for product feedback and activity - six viewport positions plus
            information, success, error, custom-icon, avatar, action-button, and timed auto-dismiss variants in
            one component.
          </p>
        </div>

        <Section title="Installation">
          <p className="text-body-regular text-text-secondary">
            You can add the notification component using our CLI or manually:
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

        <Section title="States">
          <p className="text-body-regular text-text-secondary">
            Set <code>status</code> to <code>information</code>, <code>success</code>, or{" "}
            <code>error</code>. Each state supplies the semantic live-region role, default icon, and accent
            colors.
          </p>
          <Demo>
            <div className="flex w-full max-w-[420px] flex-col gap-3">
              <Notification
                status="success"
                title="Deployment finished"
                description="boardui.com is live on production."
                timestamp="2m ago"
              />
              <Notification
                status="information"
                title="New version available"
                description="BoardUI 2.4.0 is ready to install."
                timestamp="12m ago"
              />
              <Notification
                status="error"
                title="Build failed"
                description="The deploy step exited with an error."
                timestamp="26m ago"
              />
              <Notification
                status="neutral"
                title="Weekly digest ready"
                description="Your Monday summary is waiting."
                timestamp="1h ago"
              />
            </div>
          </Demo>
          <CodeBlock code={STATUS_CODE} />
        </Section>

        <Section title="Icons and avatars">
          <p className="text-body-regular text-text-secondary">
            Pass any Remix icon through <code>icon</code>, or replace the icon with an avatar. Avatar
            notifications can show online, busy, or offline presence.
          </p>
          <Demo>
            <div className="w-full max-w-[420px]">
              <Notification
                status="information"
                title="John Clarkson mentioned you"
                description="“Can you review the new dashboard mockups?”"
                timestamp="Just now"
                avatar={{ src: "/avatars/john-clarkson.webp", alt: "John Clarkson" }}
                actions={[{ label: "View" }, { label: "Dismiss", variant: "secondary" }]}
              />
            </div>
          </Demo>
          <CodeBlock code={ICONS_CODE} />
        </Section>

        <Section title="Action buttons">
          <p className="text-body-regular text-text-secondary">
            The <code>actions</code> array renders small BoardUI buttons and supports primary, secondary, and
            danger variants.
          </p>
          <CodeBlock code={ACTIONS_CODE} />
        </Section>

        <Section title="Position">
          <p className="text-body-regular text-text-secondary">
            Use the <code>position</code> prop on <code>NotificationViewport</code> to anchor the stack to any
            corner or horizontal center of the browser viewport.
          </p>
          <CodeBlock code={POSITION_CODE} />
        </Section>

        <Section title="Timed dismissal">
          <p className="text-body-regular text-text-secondary">
            Set <code>autoDismissDuration</code> in milliseconds to show a synchronized 3px countdown bar and
            dismiss the notification when it reaches zero. Use <code>NotificationViewport</code> to portal
            repeated notifications to a smoothly animated stack at the edge of the browser viewport.
          </p>
          <CodeBlock code={COUNTDOWN_CODE} />
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

// 已按原版逐字校对：boardui.com/components/notification（2026-11-07，curl 抓取原版 SSR HTML + flight 数据核对）
