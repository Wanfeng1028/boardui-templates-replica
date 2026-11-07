"use client";

import { RiArrowLeftLine, RiArrowRightLine } from "@remixicon/react";

import { AppShell } from "@/components/application/app-shell/app-shell";
import { LinkButton } from "@/components/base/buttons/link-button";
import { cx } from "@/utils/cx";

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="flex flex-col gap-4">
      <h2 className="text-title-2-medium text-text-primary">{title}</h2>
      {children}
    </section>
  );
}

function TemplateCard({
  href,
  title,
  description,
}: {
  href: string;
  title: string;
  description: string;
}) {
  return (
    <a
      href={href}
      className={cx(
        "group flex items-center justify-between gap-4 rounded-3xl border border-border-button-default",
        "bg-background-primary-default p-6 hover:border-border-button-hover",
      )}
    >
      <span className="flex flex-col gap-1">
        <span className="text-title-3-semibold text-text-primary">{title}</span>
        <span className="text-body-regular text-text-secondary">{description}</span>
      </span>
      <RiArrowRightLine className="size-5 shrink-0 text-foreground-icon-secondary transition-transform group-hover:translate-x-1" />
    </a>
  );
}

const PRE_STYLE = "overflow-x-auto rounded-xl border border-border-button-default bg-background-secondary-default p-4 font-mono text-caption-1-medium leading-6 text-text-primary";
export default function MultiAgentChatPage() {
  return (
    <AppShell title="Multi-agent Chat" actions={null} columnClassName="max-w-[964px]">
      <div className="flex flex-col gap-8 pb-8">
        <div className="flex flex-col gap-3">
          <span
            className={cx(
              "w-fit rounded-full border border-border-button-default px-2.5 py-0.5",
              "text-caption-1-semibold text-text-secondary",
            )}
          >
            Pro
          </span>
          <p className="text-body-regular text-text-secondary">
            A complete interface for agentic products. Bring agents into individual or group conversations, give
            each one a distinct identity, and connect the workspace to your own response service. Includes
            animated avatars, a reusable agent creator, a plugin marketplace, and automatic browser saving.
          </p>
        </div>

        <Section title="Installation">
          <h3 className="text-title-3-semibold text-text-primary">Multi-agent Chat is a Pro template.</h3>
          <p className="text-body-regular text-text-secondary">Multi-agent Chat is a BoardUI Pro template.</p>
          <p className="text-body-regular text-text-secondary">
            Dark mode ready - this template follows BoardUI semantic tokens automatically. Set up theme switching.
          </p>
          <p className="text-body-regular text-text-secondary">
            Your BoardUI Pro license unlocks this template and all of its source files. Activate your license
            once, then install it directly into your project with the CLI.
          </p>
          <p className="text-caption-1-semibold text-text-secondary">1 — Activate your license</p>
          <pre className={PRE_STYLE}>{`npx boardui@latest login YOUR_LICENSE_KEY`}</pre>
          <p className="text-body-regular text-text-secondary">
            Use the key from your Lemon Squeezy purchase email. You only need to do this once per machine.
          </p>
          <p className="text-caption-1-semibold text-text-secondary">2 — Install the template</p>
          <pre className={PRE_STYLE}>{`npx boardui@latest add template-multi-agent-chat`}</pre>
          <p className="text-body-regular text-text-secondary">
            The CLI copies the source and resolves every BoardUI and npm dependency for you.
          </p>
          <p className="text-body-regular text-text-secondary">
            This template is included in BoardUI Pro. Get BoardUI Pro now and install it end away.
          </p>
          <p className="text-body-regular text-text-secondary">
            Using a shared UI package or custom import aliases? Configure your installation paths before running the
            CLI. Copy-paste examples use the default imports.
          </p>
        </Section>

        <Section title="What’s included">
          <p className="text-body-regular text-text-secondary">
            Ten agents, seven starter conversations, individual and group chats, a searchable conversation
            sidebar, pinning, renaming, group editing, and compact context menus. The workspace includes the
            composer, a tabbed marketplace, settings, theme controls, and a responsive agent editor. Source,
            demo data, and the components they depend on ship with the template.
          </p>
          <pre className={PRE_STYLE}>{`import { MultiAgentChat } from "@/components/application/multi-agent-chat/multi-agent-chat";

export default function ChatPage() {
  return <MultiAgentChat />;
}`}</pre>
          <TemplateCard
            href="/templates/multi-agent-chat"
            title="Open the Multi-agent Chat template"
            description="Animated agents, individual and group chat, and a live avatar editor."
          />
        </Section>

        <Section title="Conversations that feel connected">
          <p className="text-body-regular text-text-secondary">
            Select agents as compact pills and watch their avatars gather. Starting a group carries that cluster
            from the picker into the chat. With the first message, waiting agents follow staggered arcs into the
            conversation badge while the answering avatar settles into its thinking state. Reduced-motion
            preferences skip the travel animations.
          </p>
        </Section>

        <Section title="An agent creator you can reuse">
          <p className="text-body-regular text-text-secondary">
            Customize names, descriptions, avatar shapes, expressions, colors, voices, and playback speed. The
            same sidebar is available as a standalone Agent Creator block, with controlled state for your own
            application.
          </p>
        </Section>

        <Section title="Animated avatars">
          <p className="text-body-regular text-text-secondary">
            Avatars share a lightweight Canvas renderer. Eyes wander and blink independently, shapes morph
            together with their folded layer, and reduced-motion preferences are respected. The emotion selector
            repeats as you scroll and supports arrow keys.
          </p>
          <pre className={PRE_STYLE}>{`import { AgentAvatar } from "@/components/application/agent-avatar/agent-avatar";
import { FOLD_CONFIG } from "@/components/application/agent-avatar/model";

<AgentAvatar config={{ ...FOLD_CONFIG, foldShape: "slender", foldDepth: 15, lookAt: "wander" }} size={162} />`}</pre>
        </Section>

        <Section title="Connect your agents">
          <p className="text-body-regular text-text-secondary">
            The preview uses labeled sample replies. Supply <code>onRespond</code> to connect your service; each
            participant receives the conversation and an abort signal. Implement the example endpoint in your
            application. Use <code>initialWorkspace</code> for your own starting agents and conversations, and{" "}
            <code>defaultEditorId=&#123;null&#125;</code> to start with the editor closed. Set{" "}
            <code>storageKey</code> to a custom key, or <code>null</code> to disable browser persistence.
          </p>
          <pre className={PRE_STYLE}>{`"use client";
import { MultiAgentChat } from "@/components/application/multi-agent-chat/multi-agent-chat";

export function Chat() {
  return <MultiAgentChat onRespond={async (agent, messages, signal) => {
    const response = await fetch("/api/agents/respond", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ agent, messages }),
      signal,
    });
    if (!response.ok) throw new Error("Agent response failed");
    const data = await response.json();
    return data.text;
  }} />;
}`}</pre>
        </Section>

        <Section title="Marketplace and settings">
          <p className="text-body-regular text-text-secondary">
            Discover bots and plugins, browse detail pages, and manage what is installed. Marketplace
            installation is a local demo; connect your own account and permission flows for real integrations.
            Preferences and conversations save in the browser by default.
          </p>
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

// 已按原版逐字校对：boardui.com/components/multi-agent-chat（2026-11-07，curl 抓取原版 SSR HTML + flight 数据核对）
