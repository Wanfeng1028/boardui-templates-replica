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

function CommandRow({ label, command }: { label: string; command: string }) {
  return (
    <div className="flex flex-col gap-2">
      <p className="text-body-2-medium text-text-secondary">{label}</p>
      <div className="flex items-center justify-between gap-3 rounded-3xl border border-border-button-default bg-background-secondary-default px-4 py-3">
        <code className="text-body-2-regular overflow-x-auto text-text-primary">{command}</code>
        <CopyButton text={command} />
      </div>
    </div>
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

/** AI Image Generation — boardui.com/components/ai-image-generation (Pro template). */
export default function AiImageGenerationPage() {
  return (
    <AppShell title="AI Image Generation" icon={RiLayoutGridLine} actions={null} columnClassName="max-w-[964px]">
      <p className="text-body-regular text-text-secondary">
        An image-generation agent screen built on the AI Chat shell. The prompt thread renders a live generation
        frame that unfolds into the conversation, counts down while a canvas ripple animates, then reveals the result
        through a feathered radial mask; feedback actions offer copy-with-confirmation and toast responses. The right
        panel swaps the code view for a masonry gallery of past generations with per-tile download and overflow
        actions.
      </p>

      <Section title="Installation">
        <p className="text-body-regular text-text-secondary">
          AI Image Generation is a BoardUI Pro template, sold separately. Dark mode ready — this template follows
          BoardUI semantic tokens automatically.
        </p>
        <p className="text-body-regular text-text-secondary">
          AI Image Generation is a Pro template. Your BoardUI Pro license unlocks this template and all of its
          source files. Activate your license once, then install it directly into your project with the CLI.
        </p>
        <CommandRow label="01 — Activate your license" command="npx boardui@latest login YOUR_LICENSE_KEY" />
        <CommandRow label="02 — Install the template" command="npx boardui@latest add template-ai-image-generation" />
      </Section>

      <Section title="What's included">
        <p className="text-body-regular text-text-secondary">
          The template ships as a complete source package: the agent sidebar, the prompt thread with the generation
          frame (height-unfold entrance, live countdown, canvas ripple placeholder and the feathered mask reveal),
          the feedback row with copy confirmation and toasts, the composer and status bar, the masonry gallery panel
          with hover actions, and every base component they depend on.
        </p>
        <TemplateCard
          href="/templates/ai-image-generation"
          title="AI Image Generation template"
          description="See the full template running on this site — prompt thread, live generation frame, and masonry gallery."
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
