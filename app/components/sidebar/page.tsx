"use client";

import { useState } from "react";
import Link from "next/link";
import { RiArrowLeftLine, RiCheckLine, RiFileCopyLine, RiSideBarLine } from "@remixicon/react";

import { AppShell } from "@/components/application/app-shell/app-shell";
import { Button } from "@/components/base/buttons/button";
import { Chip } from "@/components/base/badges/chip";
import { DashboardSidebar } from "@/components/application/dashboard/dashboard-sidebar";

function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);
  return (
    <Button
      variant="secondary"
      size="small"
      leadingIcon={copied ? RiCheckLine : RiFileCopyLine}
      onClick={() => {
        void navigator.clipboard?.writeText(text)?.then(() => {
          setCopied(true);
          window.setTimeout(() => setCopied(false), 1600);
        });
      }}
    >
      {copied ? "Copied" : "Copy"}
    </Button>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="flex flex-col gap-4">
      <h2 className="text-title-2-medium text-text-primary">{title}</h2>
      {children}
    </section>
  );
}

/** Sidebar detail page: boardui.com/components/sidebar, in-site. */
export default function SidebarPage() {
  return (
    <AppShell title="Sidebar" icon={RiSideBarLine} actions={null} columnClassName="max-w-[964px]">
      <div className="flex flex-col gap-8 px-1 pb-10">
        <div className="flex items-center gap-2">
          <Chip color="lime" variant="subtle">
            Free
          </Chip>
          <span className="text-caption-1-medium text-text-tertiary">Blocks</span>
        </div>
        <p className="text-body-regular text-text-secondary">
          The floating navigation panel from the dashboard template - 260px wide, radius/3xl, white hairline border
          and the sidebar elevation shadow. Composes the team menu, quick search with Kbd hint, nav items with
          badges, an announcement card, and the user menu.
        </p>
        <div className="flex h-[600px] justify-center overflow-hidden rounded-3xl border border-border-button-default bg-background-primary-default p-6">
          <DashboardSidebar showThemeToggle={false} />
        </div>
        <Section title="Installation">
          <p className="text-body-regular text-text-secondary">
            You can add this sidebar block using our CLI or manually. The CLI also installs the avatar, badge, kbd,
            and announcement components it composes. The CLI copies the component source (with its internal
            dependencies) into your project and installs any required npm packages.
          </p>
          <div className="flex items-center justify-between gap-3 rounded-xl border border-border-button-default bg-background-secondary-default px-4 py-3">
            <code className="font-mono text-body-2-medium text-text-primary">npx boardui@latest add sidebar</code>
            <CopyButton text="npx boardui@latest add sidebar" />
          </div>
        </Section>
        <Section title="AI chat variant">
          <p className="text-body-regular text-text-secondary">
            The same floating panel tweaked for the AI Chat template: quick actions up top (New agent, Automations,
            Customize), a <code className="font-mono text-body-2-medium text-text-primary">Repositories</code> tree
            whose open repo lists recent chats with relative-time chips and a curved tree connector, and a plan card
            with an Upgrade button instead of the team menu. Ships with the AI Chat Pro template.
          </p>
        </Section>
        <Section title="Composition">
          <p className="text-body-regular text-text-secondary">
            The sidebar composes several smaller registry items -{" "}
            <code className="font-mono text-body-2-medium text-text-primary">avatar</code>,{" "}
            <code className="font-mono text-body-2-medium text-text-primary">badge</code>,{" "}
            <code className="font-mono text-body-2-medium text-text-primary">kbd</code>,{" "}
            <code className="font-mono text-body-2-medium text-text-primary">announcement</code>, and the chevron
            glyphs - plus its own team and user menus. Installing it with the CLI pulls the whole chain
            automatically; swap the nav items and menus with your own routes and data.
          </p>
        </Section>
        <Link
          href="/components"
          className="mt-2 inline-flex w-fit items-center gap-1.5 text-body-medium text-text-secondary"
        >
          <RiArrowLeftLine className="size-4" />
          Back to all components
        </Link>
      </div>
    </AppShell>
  );
}
