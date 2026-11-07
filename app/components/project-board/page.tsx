"use client";

import { RiArrowLeftLine, RiArrowRightLine } from "@remixicon/react";

import { DocsLayout } from "@/components/application/docs/docs-layout";
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
export default function ProjectBoardPage() {
  return (
    <DocsLayout variant="library" title="Project Board">
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
            A complete kanban workspace for product and engineering teams, with five workflow stages, smooth drag
            and drop, animated ticket creation and detail panels, editable properties, comments, and token usage
            charts. Includes sorting, filtering, light and dark themes, and responsive navigation.
          </p>
        </div>

        <Section title="Installation">
          <h3 className="text-title-3-semibold text-text-primary">Project Board is a Pro template.</h3>
          <p className="text-body-regular text-text-secondary">
            Project Board is a BoardUI Pro template, sold separately.
          </p>
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
          <pre className={PRE_STYLE}>{`npx boardui@latest add template-project-board`}</pre>
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
            The template ships as a complete source package: the responsive sidebar and mobile drawer, five-column
            board with independently scrolling ticket stacks, sorting and filtering controls, animated empty
            states, and accessible ticket drag and drop. It includes the create-ticket dialog, ticket detail side
            panel with editable properties and comments, purple token usage charts, photographic team avatars, and
            every base component and demo data file they depend on.
          </p>
          <pre className={PRE_STYLE}>{`import { ProjectBoardShell } from "@/components/application/project-board/project-board-shell";

export default function ProjectBoardPage() {
  // Complete kanban workspace with ticket creation, detail panels,
  // comments, token charts, and responsive project navigation.
  return <ProjectBoardShell />;
}`}</pre>
          <TemplateCard
            href="/templates/project-board"
            title="Open the Project Board template"
            description="Kanban workspace with ticket panels, comments, and token charts."
          />
        </Section>

        <div>
          <LinkButton href="/components" leadingIcon={RiArrowLeftLine}>
            Back to components
          </LinkButton>
        </div>
      </div>
    </DocsLayout>
  );
}

// 已按原版逐字校对：boardui.com/components/project-board（2026-11-07，curl 抓取原版 SSR HTML + flight 数据核对）
