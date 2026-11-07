"use client";

import { useState } from "react";
import Link from "next/link";
import { RiArrowLeftLine, RiCheckLine, RiFileCopyLine } from "@remixicon/react";

import { AppShell } from "@/components/application/app-shell/app-shell";
import { Chip } from "@/components/base/badges/chip";
import { Button } from "@/components/base/buttons/button";
import { ComposerLoader } from "@/components/application/composer-loader/composer-loader";
import { Composer } from "@/components/application/pro/composer";

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

const INSTALL_CMD = "npx boardui@latest add composer-loader";

const CONVERSATION_CODE = `const [waiting, setWaiting] = useState(false);

async function send(message: string) {
  setWaiting(true);           // light fades in, AgentThinking appears
  await complete(message);
  setWaiting(false);          // reply landed — everything fades out
}

{waiting && <AgentThinking variant="infinity" />}
<ComposerLoader active={waiting}>
  <Composer className="bg-transparent shadow-none" />
</ComposerLoader>`;

const TUNING_CODE = `{/* Everything ships tuned; override per surface as needed */}
<ComposerLoader
  colors={["#5eead4", "#46baec", "#e633a4", "#00faa7"]}
  speed={4.5}        // seconds per lap
  arc={120}          // how much of the rim the band occupies
  intensity={0.7}
  bloom={16}         // how far the light bleeds inward, px
  bloomStrength={0.3}
  reverse={false}
  radius={26}        // omit for a full pill
>
  ...
</ComposerLoader>`;

/** Composer Loader detail page, mirroring boardui.com/components/composer-loader. */
export default function ComposerLoaderPage() {
  const [waiting, setWaiting] = useState(true);
  return (
    <AppShell title="Composer Loader" columnClassName="max-w-[964px]">
      <div className="flex flex-col gap-8 pb-8">
        <div className="flex flex-col gap-3">
          <div className="flex items-center gap-2">
            <Chip variant="bold" color="lime">
              Free
            </Chip>
          </div>
          <p className="text-body-regular text-text-secondary">
            The loading state that wraps a chat composer while the agent works — an iridescent light band traveling
            the pill’s rim at constant speed, led by a crisp refraction line with a soft bloom bleeding inward
            behind it. Toggling it on and off fades the whole effect, so the composer reads as lighting up rather
            than switching.
          </p>
        </div>

        <Section title="Installation">
          <p className="text-body-regular text-text-secondary">
            You can add this loading effect using our CLI or manually. The CLI copies the component source (with
            its internal dependencies) into your project and installs any required npm packages.
          </p>
          <div className="flex items-center justify-between gap-3 rounded-xl border border-border-button-default bg-background-secondary-default px-4 py-3">
            <code className="font-mono text-caption-1-medium text-text-primary">{INSTALL_CMD}</code>
            <CopyButton text={INSTALL_CMD} />
          </div>
          <p className="text-body-regular text-text-secondary">
            Dark mode ready — this component follows BoardUI semantic tokens automatically.
          </p>
        </Section>

        <Section title="In a conversation">
          <p className="text-body-regular text-text-secondary">
            The real-life scene: the user’s message lands, the composer lights up while the AgentThinking thinks
            above it and the composer controls morph into liquid glass, then the reply arrives and everything fades
            back. Drive it all with one waiting flag — the fade-in and fade-out are built in.
          </p>
          <Demo>
            <div className="flex flex-col gap-4">
              <ComposerLoader active={waiting}>
                <Composer className="bg-transparent shadow-none" />
              </ComposerLoader>
              <div className="flex items-center gap-2">
                <Button variant={waiting ? "secondary" : "primary"} onClick={() => setWaiting((v) => !v)}>
                  {waiting ? "Simulate reply arriving" : "Simulate sending"}
                </Button>
                <span className="text-body-regular text-text-secondary">
                  {waiting ? "Waiting for a reply — the light is on." : "Idle — the light has faded out."}
                </span>
              </div>
            </div>
          </Demo>
          <CodeBlock code={CONVERSATION_CODE} />
        </Section>

        <Section title="The composer itself">
          <p className="text-body-regular text-text-secondary">
            The pill in these previews is the Composer, the AI Chat template’s input shipped as its own Pro block:
            working attachment and model menus, mic and send controls, the status bar, and the liquid-glass
            treatment the demo uses. Composer Loader wraps any composer you already have; pair it with this one for
            the exact look above.
          </p>
        </Section>

        <Section title="Tuning">
          <p className="text-body-regular text-text-secondary">
            The default light is the tuned house style. colors spreads four stops across the pill, arc sets how
            much of the rim the band occupies, bloom and bloomStrength shape how far the light bleeds inward, and
            speed is seconds per lap. The band travels at constant speed and bends around the end caps; motion stops
            under prefers-reduced-motion.
          </p>
          <Demo>
            <ComposerLoader
              colors={["#5eead4", "#46baec", "#e633a4", "#00faa7"]}
              speed={4.5}
              arc={120}
              intensity={0.7}
              bloom={16}
              bloomStrength={0.3}
              active
            >
              <div className="flex h-12 items-center px-4 text-body-regular text-text-placeholder">
                Tuned light — 120° arc, 4.5s per lap
              </div>
            </ComposerLoader>
          </Demo>
          <CodeBlock code={TUNING_CODE} />
        </Section>

        <Link
          href="/components"
          className="inline-flex items-center gap-1.5 text-body-medium text-text-secondary transition-colors hover:text-text-primary"
        >
          <RiArrowLeftLine className="size-4" aria-hidden />
          Back to all components
        </Link>
      </div>
    </AppShell>
  );
}
