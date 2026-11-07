"use client";

import { useState } from "react";
import { RiCheckLine, RiFileCopyLine, RiArrowLeftLine } from "@remixicon/react";

import { AppShell } from "@/components/application/app-shell/app-shell";
import { Chip } from "@/components/base/badges/chip";
import { Composer } from "@/components/application/pro/composer";
import { AgentThinking } from "@/components/application/agent-thinking/agent-thinking";
import { ComposerLoader } from "@/components/application/composer-loader/composer-loader";
import { LinkButton } from "@/components/base/buttons/link-button";

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

const LOGIN_CMD = "npx boardui@latest login YOUR_LICENSE_KEY";
const INSTALL_CMD = "npx boardui@latest add composer";

const WORKING_CODE = `const [working, setWorking] = useState(false);

{working && <AgentThinking variant="infinity" />}
<ComposerLoader active={working}>
  {/* the controls morph to liquid glass while the agent works */}
  <Composer />
</ComposerLoader>`;

const PARTS_CODE = `{/* The pill alone — attachment menu, input, model picker, mic, send */}
<Composer />`;

/** Composer detail page: boardui.com/components/composer, in-site. */
export default function ComposerPage() {
  const [showWorking, setShowWorking] = useState(false);
  return (
    <AppShell title="Composer" actions={null} columnClassName="max-w-[964px]">
      <div className="flex flex-col gap-8 pb-8">
        <div className="flex flex-col gap-3">
          <div className="flex items-center gap-2">
            <Chip color="neutral">Pro</Chip>
          </div>
          <p className="text-body-regular text-text-secondary">
            The AI chat composer from the AI Chat template as a standalone block: a pill input with working
            attachment and model menus, voice and send controls, the status bar with branch, project, agent mode
            and context meter, and a liquid-glass treatment that takes over the controls while the agent works.
          </p>
        </div>

        <Section title="Preview">
          <p className="text-body-regular text-text-secondary">
            Pick a model from the menu, attach from the plus menu, or send a message — while the reply is
            “working”, the loader orbits the pill and the send button becomes a stop button. No model is called;
            the reply is a demo.
          </p>
          <Demo>
            <Composer />
          </Demo>
        </Section>

        <Section title="Installation">
          <h3 className="text-title-3-semibold text-text-primary">Composer is a Pro component.</h3>
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
          <p className="text-body-regular text-text-secondary">
            Dark mode ready — this component follows BoardUI semantic tokens automatically.
          </p>
        </Section>

        <Section title="Working state">
          <p className="text-body-regular text-text-secondary">
            The full agent-working treatment, looping: the AgentThinking thinks above the pill, the free
            ComposerLoader light orbits it, and the controls morph into liquid glass. Everything fades back when
            the reply lands. Toggle it here to see the treatment on this page&rsquo;s composer.
          </p>
          <Demo>
            <div className="flex flex-col gap-3">
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setShowWorking((w) => !w)}
                  aria-pressed={showWorking}
                  className="cursor-pointer rounded-full border border-border-button-default bg-background-secondary-default px-3 py-1.5 text-caption-1-semibold text-text-secondary hover:text-text-primary"
                >
                  {showWorking ? "Stop the working state" : "Show the working state"}
                </button>
              </div>
              {showWorking && <AgentThinking variant="infinity" />}
              <ComposerLoader active={showWorking}>
                <Composer />
              </ComposerLoader>
            </div>
          </Demo>
          <CodeBlock code={WORKING_CODE} />
        </Section>

        <Section title="The parts">
          <p className="text-body-regular text-text-secondary">
            The pill ships as one export — attachment and model menus, input, mic and send — with the status row
            (model, sent count, and the live status line) built in. The attachment and model menus are fully
            working popovers. The taller two-row layout with the permission picker and the status tab lives on
            Composer Panel, and the file-tile strip lives on Composer Attachments.
          </p>
          <CodeBlock code={PARTS_CODE} />
          <div className="flex flex-wrap gap-2">
            <LinkButton href="/components/composer-panel" variant="secondary">
              Composer Panel
            </LinkButton>
            <LinkButton href="/components/composer-attachments" variant="secondary">
              Composer Attachments
            </LinkButton>
            <LinkButton href="/components/composer-loader" variant="secondary">
              Composer Loader
            </LinkButton>
          </div>
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
