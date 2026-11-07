"use client";

import { useState } from "react";
import { RiArrowLeftLine, RiCheckLine, RiFileCopyLine } from "@remixicon/react";

import { DocsLayout } from "@/components/application/docs/docs-layout";
import { AgentThinking } from "@/components/application/agent-thinking/agent-thinking";
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

function Code({ code }: { code: string }) {
  return (
    <div className="overflow-x-auto rounded-3xl border border-border-button-default bg-background-secondary-default p-4">
      <pre className="text-body-2-regular whitespace-pre text-text-primary">{code}</pre>
    </div>
  );
}

const LABEL_CODE = `{/* Status copy and elapsed timer */}
<AgentThinking variant="spin" label="Searching the docs" />
<AgentThinking variant="wave" showTimer={false} />

{/* Tone defaults per variant (stars is subtle); override with \`tone\` */}
<AgentThinking variant="infinity" tone="accent" />

{/* Static label instead of the traveling shimmer */}
<AgentThinking variant="wave" shimmer={false} />`;

/** Agent Thinking — boardui.com/components/agent-thinking (free). */
export default function AgentThinkingPage() {
  const command = "npx boardui@latest add agent-thinking";
  return (
    <DocsLayout variant="library" title="Agent Thinking">
      <p className="text-body-regular text-text-secondary">
        The agent thinking state that sits above a chat composer while a response is being worked on. Four curated
        variants — a dot grid crossed by a diagonal wave, a dot grid with an orbiting head, twinkling stars, and an
        infinity comet — each pairing its indicator with a shimmering label and an elapsed timer.
      </p>

      <Section title="Installation">
        <p className="text-body-regular text-text-secondary">
          You can add this loader component using our CLI or manually. Dark mode ready — this component follows
          BoardUI semantic tokens automatically.
        </p>
        <div className="flex items-center justify-between gap-3 rounded-3xl border border-border-button-default bg-background-secondary-default px-4 py-3">
          <code className="text-body-2-regular overflow-x-auto text-text-primary">{command}</code>
          <CopyButton text={command} />
        </div>
      </Section>

      <Section title="Dot wave">
        <p className="text-body-regular text-text-secondary">
          A 3×3 dot grid crossed by a diagonal wavefront — a bright band enters at the top-left, glides to the
          bottom-right with a fading trail, and re-enters after a beat. The default variant.
        </p>
        <Demo>
          <AgentThinking variant="wave" />
        </Demo>
        <Code code={`<AgentThinking variant="wave" />`} />
      </Section>

      <Section title="Dot spin">
        <p className="text-body-regular text-text-secondary">
          The same grid with a bright head orbiting clockwise, trailing a comet tail — reads as steady rotation
          without a spinner glyph.
        </p>
        <Demo>
          <AgentThinking variant="spin" />
        </Demo>
        <Code code={`<AgentThinking variant="spin" />`} />
      </Section>

      <Section title="Stars">
        <p className="text-body-regular text-text-secondary">
          Five four-point sparkles twinkling in and out on a stagger. Defaults to the subtle tone so it reads
          quieter than the dot grids.
        </p>
        <Demo>
          <AgentThinking variant="stars" />
        </Demo>
        <Code code={`<AgentThinking variant="stars" />`} />
      </Section>

      <Section title="Infinity">
        <p className="text-body-regular text-text-secondary">
          A comet trail lapping a figure-eight over a faint track — continuous motion with no start or end, for
          long-running agent work.
        </p>
        <Demo>
          <AgentThinking variant="infinity" />
        </Demo>
        <Code code={`<AgentThinking variant="infinity" />`} />
      </Section>

      <Section title="Label, tone, and timer">
        <p className="text-body-regular text-text-secondary">
          Every variant shares the same options: <code className="text-body-2-regular text-text-primary">label</code>{" "}
          sets the status copy, <code className="text-body-2-regular text-text-primary">showTimer</code> toggles the
          elapsed seconds, <code className="text-body-2-regular text-text-primary">shimmer</code> toggles the
          traveling highlight, and <code className="text-body-2-regular text-text-primary">tone</code> overrides the
          per-variant default color. All motion falls back to a static state under{" "}
          <code className="text-body-2-regular text-text-primary">prefers-reduced-motion</code>.
        </p>
        <Demo>
          <div className="flex flex-col items-start gap-4">
            <AgentThinking variant="spin" label="Searching the docs" />
            <AgentThinking variant="wave" showTimer={false} />
            <AgentThinking variant="infinity" tone="accent" />
          </div>
        </Demo>
        <Code code={LABEL_CODE} />
      </Section>

      <div>
        <LinkButton href="/components" variant="secondary" size="medium" leadingIcon={RiArrowLeftLine}>
          Back to components
        </LinkButton>
      </div>
    </DocsLayout>
  );
}
