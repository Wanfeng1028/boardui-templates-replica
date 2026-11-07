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

/** AI Profile — boardui.com/components/ai-profile (Pro template). */
export default function AiProfilePage() {
  const command = "npx boardui@latest add template-ai-profile";
  return (
    <AppShell title="AI Profile" icon={RiLayoutGridLine} actions={null} columnClassName="max-w-[964px]">
      <p className="text-body-regular text-text-secondary">
        A GitHub-style contributions profile for AI work — cover photo and identity card, contributions headline with
        stat tiles, an activity heatmap, a 30-day agents bar chart with month switcher (idle days collapse to grey
        stubs), and a tokens trend line with sharp joins. Fully responsive, down to a slide-in drawer on mobile.
      </p>

      <Section title="Installation">
        <p className="text-body-regular text-text-secondary">
          AI Profile is a BoardUI Pro template, sold separately. Dark mode ready — this template follows BoardUI
          semantic tokens automatically.
        </p>
        <div className="flex items-center justify-between gap-3 rounded-3xl border border-border-button-default bg-background-secondary-default px-4 py-3">
          <code className="text-body-2-regular overflow-x-auto text-text-primary">{command}</code>
          <CopyButton text={command} />
        </div>
      </Section>

      <Section title="What's included">
        <p className="text-body-regular text-text-secondary">
          The template ships as a complete source package: the responsive app shell, the profile card (cover photo,
          avatar, share/edit actions, contribution stats, and the activity heatmap), the agents bar chart with its
          month switcher, the tokens trend chart, and every base component and data file they depend on.
        </p>
        <TemplateCard
          href="/templates/ai-profile"
          title="AI Profile template"
          description="See the full template running on this site — profile card, contributions heatmap, and agents and tokens charts."
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
