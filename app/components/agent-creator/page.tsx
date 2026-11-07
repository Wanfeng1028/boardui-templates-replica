"use client";

import { useState } from "react";
import { RiArrowLeftLine, RiCheckLine, RiFileCopyLine } from "@remixicon/react";

import { DocsLayout } from "@/components/application/docs/docs-layout";
import { AgentCreator } from "@/components/application/pro/agent-creator";
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

function Demo({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex flex-col items-center gap-4 rounded-3xl border border-border-button-default bg-background-primary-default p-6">
      {children}
    </div>
  );
}

/** Agent Creator — boardui.com/components/agent-creator (Pro). */
export default function AgentCreatorPage() {
  const command = "npx boardui@latest add agent-creator";
  return (
    <DocsLayout variant="library" title="Agent Creator">
      <p className="text-body-regular text-text-secondary">
        Give every agent its own identity. A reusable sidebar with animated paper avatars, nine shapes, expressive
        faces, custom colors, profile fields, and voice, language, and notification preferences.
      </p>

      <Section title="Installation">
        <p className="text-body-regular text-text-secondary">
          Agent Creator is a BoardUI Pro block. Dark mode ready — this component follows BoardUI semantic tokens
          automatically.
        </p>
        <div className="flex items-center justify-between gap-3 rounded-3xl border border-border-button-default bg-background-secondary-default px-4 py-3">
          <code className="text-body-2-regular overflow-x-auto text-text-primary">{command}</code>
          <CopyButton text={command} />
        </div>
      </Section>

      <Section title="Use it in your product">
        <p className="text-body-regular text-text-secondary">
          Pass an <code className="text-body-2-regular text-text-primary">agent</code> and handle{" "}
          <code className="text-body-2-regular text-text-primary">onChange</code> to keep the complete profile in
          your own state. Save those changes to your service when needed. The block does not write to storage
          itself. Give its parent a fixed height and use it in a sidebar, drawer, or dialog. Pass{" "}
          <code className="text-body-2-regular text-text-primary">onClose</code> to show the close button.
        </p>
        <Demo>
          <div className="w-full max-w-[560px]">
            <AgentCreator />
          </div>
        </Demo>
      </Section>

      <Section title="Voice and preferences">
        <p className="text-body-regular text-text-secondary">
          Voice previews use the browser’s available speech voices, with Alice selected by default and a device voice
          as fallback. Playback speed, language, and notifications are controlled preferences for your application
          to consume; the block does not request notification permission or connect a voice service.
        </p>
      </Section>

      <Section title="Part of Multi-agent Chat">
        <p className="text-body-regular text-text-secondary">
          This is the same creator used in the Multi-agent Chat template. Use the block on its own or start with the
          complete workspace, including group conversations, the marketplace, and avatar transitions.
        </p>
        <LinkButton href="/templates/multi-agent-chat" variant="primary" size="medium">
          Open the Multi-agent Chat template
        </LinkButton>
      </Section>

      <div>
        <LinkButton href="/components" variant="secondary" size="medium" leadingIcon={RiArrowLeftLine}>
          Back to components
        </LinkButton>
      </div>
    </DocsLayout>
  );
}
