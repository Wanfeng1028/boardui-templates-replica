"use client";

import { RiArrowLeftLine, RiArrowRightLine } from "@remixicon/react";

import { DocsLayout } from "@/components/application/docs/docs-layout";
import { CodeTabs } from "@/components/application/docs/code-tabs";
import { PrevNext } from "@/components/application/docs/prev-next";
import { ProLicenseCard } from "@/components/application/docs/pro-license-card";
import { TemplatePreview } from "@/components/application/docs/template-preview";
import { LinkButton } from "@/components/base/buttons/link-button";
import { cx } from "@/utils/cx";
import MultiAgentChatTemplatePage from "@/app/templates/multi-agent-chat/page";

const MAC_PREVIEW_CODE = `import { MultiAgentChat } from "@/components/application/multi-agent-chat/multi-agent-chat";

export default function ChatPage() {
  return <MultiAgentChat />;
}`;

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
    <DocsLayout variant="library" hidePrevNext title="Multi-agent Chat">
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

        <TemplatePreview title="Multi-agent chat" slug="multi-agent-chat" previewCode={MAC_PREVIEW_CODE}>
          <MultiAgentChatTemplatePage />
        </TemplatePreview>

        <Section title="Installation">
          <h3 className="text-headline-medium text-text-secondary">Multi-agent Chat is a BoardUI Pro template.</h3>
          <p className="text-body-regular text-text-secondary">
            Dark mode ready - this template follows BoardUI semantic tokens automatically.{" "}
            <a className="text-accent-500 hover:underline" href="/installation#dark-mode">
              Set up theme switching
            </a>
            .
          </p>
          <ProLicenseCard name="Multi-agent Chat" kind="template" installSlug="template-multi-agent-chat" />
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
          <CodeTabs
            tabs={[
              {
                value: "Avatar",
                code: `import { AgentAvatar } from "@/components/application/agent-avatar/agent-avatar";
import { FOLD_CONFIG } from "@/components/application/agent-avatar/model";

<AgentAvatar config={{ ...FOLD_CONFIG, foldShape: "slender", foldDepth: 15, lookAt: "wander" }} size={162} />`,
              },
            ]}
          />
        </Section>

        <Section title="Connect your agents">
          <p className="text-body-regular text-text-secondary">
            The preview uses labeled sample replies. Supply <code>onRespond</code> to connect your service; each
            participant receives the conversation and an abort signal. Implement the example endpoint in your
            application. Use <code>initialWorkspace</code> for your own starting agents and conversations, and{" "}
            <code>defaultEditorId=&#123;null&#125;</code> to start with the editor closed. Set{" "}
            <code>storageKey</code> to a custom key, or <code>null</code> to disable browser persistence.
          </p>
          <CodeTabs
            tabs={[
              {
                value: "Integration",
                code: `"use client";
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
}`,
              },
            ]}
          />
        </Section>

        <Section title="Marketplace and settings">
          <p className="text-body-regular text-text-secondary">
            Discover bots and plugins, browse detail pages, and manage what is installed. Marketplace
            installation is a local demo; connect your own account and permission flows for real integrations.
            Preferences and conversations save in the browser by default.
          </p>
        </Section>

        <PrevNext
          prev={{ href: "/components/medical-profile", label: "Medical Profile", sub: "Patient health report" }}
          next={{ href: "/components/project-board", label: "Project Board", sub: "Kanban workspace and ticket details" }}
        />

        <div>
          <LinkButton href="/components" leadingIcon={RiArrowLeftLine}>
            Back to components
          </LinkButton>
        </div>
      </div>
    </DocsLayout>
  );
}

// 已按原版逐字校对：boardui.com/components/multi-agent-chat（2026-11-07，curl 抓取原版 SSR HTML + flight 数据核对）
