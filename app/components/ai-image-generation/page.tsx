"use client";

import { RiArrowLeftLine, RiArrowRightLine } from "@remixicon/react";

import { DocsLayout } from "@/components/application/docs/docs-layout";
import { ProLicenseCard } from "@/components/application/docs/pro-license-card";
import { TemplatePreview } from "@/components/application/docs/template-preview";
import { LinkButton } from "@/components/base/buttons/link-button";
import AiImageGenerationTemplatePage from "@/app/templates/ai-image-generation/page";

const AIG_PREVIEW_CODE = `import { AiChatShell } from "@/components/application/ai-chat/ai-chat-shell";

export default function AiImageGenerationPage() {
  // Same shell as AI Chat, opened on the image-generation
  // thread: the right panel becomes the generations gallery.
  return <AiChatShell defaultScenario="image-generation" />;
}`;

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

/** AI Image Generation — boardui.com/components/ai-image-generation (Pro template). */
export default function AiImageGenerationPage() {
  return (
    <DocsLayout variant="library" title="AI Image Generation">
      <p className="text-body-regular text-text-secondary">
        An image-generation agent screen built on the AI Chat shell. The prompt thread renders a live generation
        frame that unfolds into the conversation, counts down while a canvas ripple animates, then reveals the result
        through a feathered radial mask; feedback actions offer copy-with-confirmation and toast responses. The right
        panel swaps the code view for a masonry gallery of past generations with per-tile download and overflow
        actions.
      </p>

      <TemplatePreview title="AI image generation" slug="ai-image-generation" previewCode={AIG_PREVIEW_CODE}>
        <AiImageGenerationTemplatePage />
      </TemplatePreview>

      <Section title="Installation">
        <p className="text-headline-medium text-text-secondary">
          AI Image Generation is a BoardUI Pro template, sold separately.
        </p>
        <p className="text-body-regular text-text-secondary">
          Dark mode ready - this template follows BoardUI semantic tokens automatically.{" "}
          <a className="text-accent-500 hover:underline" href="/installation#dark-mode">
            Set up theme switching
          </a>
          .
        </p>
        <ProLicenseCard name="AI Image Generation" kind="template" installSlug="template-ai-image-generation" />
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
    </DocsLayout>
  );
}
