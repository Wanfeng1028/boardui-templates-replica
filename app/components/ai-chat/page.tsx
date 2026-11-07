"use client";

import { useState } from "react";
import { RiArrowLeftLine, RiArrowRightLine, RiCheckLine, RiFileCopyLine, RiLayoutGridLine } from "@remixicon/react";

import { AppShell } from "@/components/application/app-shell/app-shell";
import { Button } from "@/components/base/buttons/button";
import { LinkButton } from "@/components/base/buttons/link-button";

function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);
  return (
    <Button
      variant="secondary"
      size="medium"
      leadingIcon={copied ? RiCheckLine : RiFileCopyLine}
      onClick={async () => {
        try {
          await navigator.clipboard.writeText(text);
          setCopied(true);
          window.setTimeout(() => setCopied(false), 2000);
        } catch {
          // Clipboard access can be refused; leave the icon unchanged.
        }
      }}
    >
      {copied ? "Copied" : "Copy"}
    </Button>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="flex flex-col gap-3">
      <h2 className="text-title-3-semibold text-text-primary">{title}</h2>
      {children}
    </section>
  );
}

function TemplateCard({ href, title, description }: { href: string; title: string; description: string }) {
  return (
    <div className="flex flex-col items-start gap-3 rounded-3xl border border-border-button-default bg-background-primary-default p-6">
      <h3 className="text-title-3-semibold text-text-primary">{title}</h3>
      <p className="text-body-regular text-text-secondary">{description}</p>
      <LinkButton href={href} variant="primary" size="medium" trailingIcon={RiArrowRightLine}>
        Open the template
      </LinkButton>
    </div>
  );
}

/** AI Chat — boardui.com/components/ai-chat (Pro template). */
export default function AiChatPage() {
  const command = "npx boardui@latest add template-ai-chat";
  return (
    <AppShell title="AI Chat" icon={RiLayoutGridLine} actions={null} columnClassName="max-w-[964px]">
      <p className="text-body-regular text-text-secondary">
        A complete coding-agent chat screen, in the style of Cursor or Claude Code — an agent sidebar with quick
        actions and a repositories tree of recent chats, a chat thread with user/assistant turns and feedback
        actions, a pill composer with attach, model picker, mic and send, a status bar with branch, project, mode
        and context meter, and a fixed-width side panel switching between uncommitted changes with a live code view
        and a browser preview. The chat column flexes to fill wider breakpoints while the code panel keeps its
        fixed width.
      </p>

      <Section title="Installation">
        <p className="text-body-regular text-text-secondary">
          AI Chat is a BoardUI Pro template, sold separately. Dark mode ready — this template follows BoardUI
          semantic tokens automatically.
        </p>
        <div className="flex items-center justify-between gap-3 rounded-3xl border border-border-button-default bg-background-secondary-default px-4 py-3">
          <code className="text-body-2-regular overflow-x-auto text-text-primary">{command}</code>
          <CopyButton text={command} />
        </div>
      </Section>

      <Section title="What's included">
        <p className="text-body-regular text-text-secondary">
          The template ships as a complete source package: the agent sidebar (quick search, New agent / Automations
          / Customize actions, the repositories tree with recent-chat rows, time chips and the curved tree connector,
          and the plan card with Upgrade button), the chat container (breadcrumb header, message thread with
          feedback actions and inline link chips, the composer with model picker, mic and send, and the status bar
          with the context ring), the changes/code side panel, and every base component they depend on.
        </p>
        <TemplateCard
          href="/templates/ai-chat"
          title="AI Chat template"
          description="See the full template running on this site — agent sidebar, chat thread, composer, and code panel."
        />
      </Section>

      <div>
        <LinkButton href="/components" variant="secondary" size="medium" leadingIcon={RiArrowLeftLine}>
          Back to components
        </LinkButton>
      </div>
    </AppShell>
  );
}
