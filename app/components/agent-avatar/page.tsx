"use client";

import { useState } from "react";
import { RiCheckLine, RiFileCopyLine, RiArrowLeftLine, RiArrowRightLine } from "@remixicon/react";

import { AppShell } from "@/components/application/app-shell/app-shell";
import { Chip } from "@/components/base/badges/chip";
import { AgentAvatar, AgentAvatarFace } from "@/components/application/pro/agent-avatar";
import { LinkButton } from "@/components/base/buttons/link-button";
import { cx } from "@/utils/cx";

function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);
  return (
    <button
      type="button"
      onClick={() => {
        const done = () => {
          setCopied(true);
          window.setTimeout(() => setCopied(false), 1500);
        };
        if (navigator.clipboard?.writeText) {
          navigator.clipboard.writeText(text).then(done).catch(done);
        } else {
          done();
        }
      }}
      className="inline-flex shrink-0 items-center gap-1 rounded-full border border-border-button-default bg-background-primary-default px-2.5 py-1 text-caption-1-semibold text-text-secondary transition-colors hover:text-text-primary"
    >
      {copied ? <RiCheckLine className="size-3.5" aria-hidden /> : <RiFileCopyLine className="size-3.5" aria-hidden />}
      {copied ? "Copied" : "Copy"}
    </button>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="flex flex-col gap-3">
      <h2 className="text-title-2-medium text-text-primary">{title}</h2>
      {children}
    </section>
  );
}

function Demo({ children }: { children: React.ReactNode }) {
  return (
    <div className="rounded-3xl border border-border-button-default bg-background-primary-default p-6">
      {children}
    </div>
  );
}

function CodeBlock({ code }: { code: string }) {
  return (
    <pre className="overflow-x-auto rounded-xl border border-border-button-default bg-background-secondary-default p-4 font-mono text-caption-1-medium leading-6 text-text-primary">
      {code}
    </pre>
  );
}

const PRE_STYLE =
  "overflow-x-auto rounded-xl border border-border-button-default bg-background-secondary-default p-4 font-mono text-caption-1-medium leading-6 text-text-primary";

const LOGIN_CMD = "npx boardui@latest login YOUR_LICENSE_KEY";
const INSTALL_CMD = "npx boardui@latest add agent-avatar";

const FACE_CODE = `import { AgentAvatarFace } from "@/components/application/pro/agent-avatar";

<AgentAvatarFace silhouette="fox" mood="happy" color="#f59e0b" shape="blob" size={120} />

{/* Nine silhouettes: fox, cat, bear, owl, robot, bunny, panda, frog, ghost */}
{/* Four moods: happy, calm, thinking, excited */}
{/* Three shapes: circle, rounded, blob */}`;

const TURN_CODE = `const [turn, setTurn] = useState(false);

<button type="button" onClick={() => setTurn((t) => !t)} aria-label="Turn the avatar around">
  <AgentAvatarFace silhouette="fox" mood="happy" color="#f59e0b" shape="blob" size={120} turn={turn} />
</button>`;

/** Agent Avatar detail page. No standalone docs page exists on boardui.com — content mirrors the "Animated avatars" section of boardui.com/components/multi-agent-chat. */
export default function AgentAvatarPage() {
  return (
    <AppShell title="Agent Avatar" actions={null} columnClassName="max-w-[964px]">
      <div className="flex flex-col gap-8 pb-8">
        <div className="flex flex-col gap-3">
          <div className="flex items-center gap-2">
            <Chip color="neutral">Pro</Chip>
          </div>
          <p className="text-body-regular text-text-secondary">
            Animated paper avatars with wandering eyes, expressive faces, nine silhouettes, and dimensional turn
            animations. Avatars share a lightweight renderer: eyes wander and blink independently, shapes morph
            together with their folded layer, and reduced-motion preferences are respected.
          </p>
        </div>

        <Section title="Preview">
          <p className="text-body-regular text-text-secondary">
            The live avatar editor: pick a silhouette and a mood below, or click the avatar itself for a 3D turn.
            Eyes wander and blink while you look at it.
          </p>
          <Demo>
            <AgentAvatar />
          </Demo>
        </Section>

        <Section title="Installation">
          <h3 className="text-title-3-semibold text-text-primary">Agent Avatar is a Pro component.</h3>
          <p className="text-body-regular text-text-secondary">
            Your BoardUI Pro license unlocks this component and all of its source files. Activate your license
            once, then install it directly into your project with the CLI.
          </p>
          <p className="text-caption-1-semibold text-text-secondary">1 — Activate your license</p>
          <div className="flex items-center justify-between gap-3 rounded-xl border border-border-button-default bg-background-secondary-default px-4 py-3">
            <code className="font-mono text-caption-1-medium text-text-primary">{LOGIN_CMD}</code>
            <CopyButton text={LOGIN_CMD} />
          </div>
          <p className="text-body-regular text-text-secondary">
            Use the key from your Lemon Squeezy purchase email. You only need to do this once per machine.
          </p>
          <p className="text-caption-1-semibold text-text-secondary">2 — Install the component</p>
          <div className="flex items-center justify-between gap-3 rounded-xl border border-border-button-default bg-background-secondary-default px-4 py-3">
            <code className="font-mono text-caption-1-medium text-text-primary">{INSTALL_CMD}</code>
            <CopyButton text={INSTALL_CMD} />
          </div>
          <p className="text-body-regular text-text-secondary">
            The CLI copies the source and resolves every BoardUI and npm dependency for you.
          </p>
        </Section>

        <Section title="Animated avatars">
          <p className="text-body-regular text-text-secondary">
            Each avatar is a paper face: a silhouette body, a folded layer, and a pair of eyes that wander and
            blink on their own timing. The emotion selector repeats as you scroll and supports arrow keys, so the
            face can be changed without reaching for the mouse.
          </p>
          <Demo>
            <div className="flex flex-wrap items-end justify-center gap-6">
              <span className="flex flex-col items-center gap-2">
                <AgentAvatarFace silhouette="owl" mood="calm" color="#8b5cf6" shape="blob" size={96} />
                <span className="text-caption-1-regular text-text-tertiary">Owl · calm</span>
              </span>
              <span className="flex flex-col items-center gap-2">
                <AgentAvatarFace silhouette="robot" mood="thinking" color="#64748b" shape="rounded" size={96} />
                <span className="text-caption-1-regular text-text-tertiary">Robot · thinking</span>
              </span>
              <span className="flex flex-col items-center gap-2">
                <AgentAvatarFace silhouette="frog" mood="excited" color="#22c55e" shape="circle" size={96} />
                <span className="text-caption-1-regular text-text-tertiary">Frog · excited</span>
              </span>
            </div>
          </Demo>
        </Section>

        <Section title="Silhouettes and moods">
          <p className="text-body-regular text-text-secondary">
            <code className="font-mono text-caption-1-medium text-text-primary">AgentAvatarFace</code> renders one
            face: a silhouette id, a mood, a body color, a shape, and a size. The full{" "}
            <code className="font-mono text-caption-1-medium text-text-primary">AgentAvatar</code> editor above
            wraps it with the silhouette picker, the mood picker, and the turn button.
          </p>
          <CodeBlock code={FACE_CODE} />
        </Section>

        <Section title="Turn animation">
          <p className="text-body-regular text-text-secondary">
            The turn is dimensional: the face rotates around its vertical axis and settles back, a 3D turn rather
            than a flat flip. Pass{" "}
            <code className="font-mono text-caption-1-medium text-text-primary">turn</code> to drive it yourself,
            or let the editor own it.
          </p>
          <CodeBlock code={TURN_CODE} />
        </Section>

        <Section title="In the Multi-agent Chat template">
          <p className="text-body-regular text-text-secondary">
            Ten animated agents, individual and group chats, a searchable conversation sidebar, and a live agent
            creator — the avatars are the template&rsquo;s identities.
          </p>
          <a
            href="/templates/multi-agent-chat"
            className={cx(
              "group flex items-center justify-between gap-4 rounded-3xl border border-border-button-default",
              "bg-background-primary-default p-6 hover:border-border-button-hover",
            )}
          >
            <span className="flex flex-col gap-1">
              <span className="text-title-3-semibold text-text-primary">Open the Multi-agent Chat template</span>
              <span className="text-body-regular text-text-secondary">
                Animated agents, individual and group chat, and a live avatar editor.
              </span>
            </span>
            <RiArrowRightLine className="size-5 shrink-0 text-foreground-icon-secondary transition-transform group-hover:translate-x-1" />
          </a>
          <pre className={PRE_STYLE}>{`npx boardui@latest add template-multi-agent-chat`}</pre>
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
