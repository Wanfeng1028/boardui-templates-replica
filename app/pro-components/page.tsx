"use client";

import Link from "next/link";
import type { ReactNode } from "react";
import {
  RiArrowRightLine,
  RiBarChartLine,
  RiCalendarLine,
  RiChat3Line,
  RiKanbanView2,
} from "@remixicon/react";

import { AgentAvatar } from "@/components/application/pro/agent-avatar";
import { AgentCreator } from "@/components/application/pro/agent-creator";
import { AgentLimitsCard } from "@/components/application/pro/agent-limits-card";
import { AgentProgress } from "@/components/application/pro/agent-progress";
import { Calendar } from "@/components/application/pro/calendar";
import { Composer } from "@/components/application/pro/composer";
import { ComposerAttachments } from "@/components/application/pro/composer-attachments";
import { ComposerPanel } from "@/components/application/pro/composer-panel";
import { Questionnaire } from "@/components/application/pro/questionnaire";
import { TaskList } from "@/components/application/pro/task-list";
import { WebSearch } from "@/components/application/pro/web-search";

/**
 * Pro components showcase — 13 non-chart Pro components, re-implemented
 * from free BoardUI components + public page content only.
 * Not the official Pro source. multi-agent-chat and project-board reuse the
 * already 1:1 templates and are linked, not re-implemented here.
 */

function Section({
  id,
  name,
  registry,
  blurb,
  children,
}: {
  id: string;
  name: string;
  registry: string;
  blurb: string;
  children: ReactNode;
}) {
  return (
    <section id={id} aria-labelledby={`${id}-title`} className="flex w-full scroll-mt-6 flex-col gap-3">
      <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
        <h2 id={`${id}-title`} className="text-title-2-medium text-text-primary">{name}</h2>
        <code className="rounded-md bg-background-secondary-default px-2 py-0.5 text-caption-1-medium text-text-secondary">{registry}</code>
      </div>
      <p className="max-w-3xl text-body-regular text-text-secondary">{blurb}</p>
      {children}
    </section>
  );
}

function LinkCard({
  href,
  title,
  registry,
  blurb,
  icon,
}: {
  href: string;
  title: string;
  registry: string;
  blurb: string;
  icon: ReactNode;
}) {
  return (
    <Link
      href={href}
      className="flex w-full items-center gap-4 rounded-3xl border border-border-button-default bg-background-secondary-default p-5 outline-none transition-colors hover:border-border-button-hover focus-visible:ring-2 focus-visible:ring-border-focus-ring"
    >
      <span className="flex size-11 shrink-0 items-center justify-center rounded-2xl bg-accent-500/15 text-accent-600">{icon}</span>
      <span className="min-w-0 flex-1">
        <span className="flex flex-wrap items-baseline gap-x-3 gap-y-0.5">
          <span className="text-title-3-semibold text-text-primary">{title}</span>
          <code className="rounded-md bg-background-tertiary-default px-2 py-0.5 text-caption-1-medium text-text-secondary">{registry}</code>
        </span>
        <span className="mt-0.5 block text-body-regular text-text-secondary">{blurb}</span>
      </span>
      <RiArrowRightLine className="size-5 shrink-0 text-foreground-icon-tertiary" />
    </Link>
  );
}

const NAV = [
  { id: "web-search", label: "Web Search" },
  { id: "task-list", label: "Task List" },
  { id: "composer", label: "Composer" },
  { id: "composer-panel", label: "Composer Panel" },
  { id: "composer-attachments", label: "Composer Attachments" },
  { id: "agent-progress", label: "Agent Progress" },
  { id: "agent-limits-card", label: "Agent Limits Card" },
  { id: "questionnaire", label: "Questionnaire" },
  { id: "calendar", label: "Calendar" },
  { id: "project-board", label: "Project Board" },
  { id: "agent-avatar", label: "Agent Avatar" },
  { id: "agent-creator", label: "Agent Creator" },
  { id: "multi-agent-chat", label: "Multi-Agent Chat" },
];

export default function ProComponentsPage() {
  return (
    <main className="min-h-screen bg-background-full px-4 py-8 sm:px-6 lg:px-10">
      <div className="mx-auto flex w-full max-w-5xl flex-col gap-10">
        <header className="flex flex-col gap-3">
          <p className="text-caption-1-semibold text-accent-600">BoardUI Pro · Replica</p>
          <h1 className="text-title-1-medium text-text-primary">Pro components</h1>
          <p className="max-w-3xl text-body-regular text-text-secondary">
            Pro 组件复刻（免费组件实现，非官方源码）。13 non-chart Pro components below,
            rebuilt from free BoardUI components and public page content only.
            Charts live on their own page.
          </p>
          <div className="flex flex-wrap gap-2">
            <Link
              href="/pro-components/charts"
              className="inline-flex items-center gap-2 rounded-full bg-accent-500 px-4 py-2 text-body-2-medium text-white outline-none hover:bg-accent-600 focus-visible:ring-2 focus-visible:ring-border-focus-ring"
            >
              <RiBarChartLine className="size-4" /> 17 chart cards
              <RiArrowRightLine className="size-4" />
            </Link>
            <Link
              href="/templates"
              className="inline-flex items-center gap-2 rounded-full bg-background-secondary-default px-4 py-2 text-body-2-medium text-text-secondary outline-none hover:text-text-primary focus-visible:ring-2 focus-visible:ring-border-focus-ring"
            >
              All templates
            </Link>
          </div>
          <nav aria-label="Pro components" className="mt-2 flex flex-wrap gap-1.5">
            {NAV.map((n) => (
              <a
                key={n.id}
                href={`#${n.id}`}
                className="rounded-full bg-background-secondary-default px-3 py-1.5 text-caption-1-medium text-text-secondary outline-none hover:text-text-primary focus-visible:ring-2 focus-visible:ring-border-focus-ring"
              >
                {n.label}
              </a>
            ))}
          </nav>
        </header>

        <Section id="web-search" name="Web Search" registry="web-search" blurb="Streaming research trail: the agent's queries appear one at a time, each with the sources it opened. Sources are real, clickable links.">
          <WebSearch />
        </Section>

        <Section id="task-list" name="Task List" registry="task-list" blurb="Streaming agent task log: tasks reveal one at a time, with a soft blur-in and a shimmering running title on the task in progress.">
          <TaskList />
        </Section>

        <Section id="composer" name="Composer" registry="composer" blurb="Full AI chat composer: attachment and model menus, voice and send controls, a status bar, and the liquid-glass loading state from the free Composer Loader while it thinks.">
          <Composer />
        </Section>

        <Section id="composer-panel" name="Composer Panel" registry="composer-panel" blurb="Two-row composer: prompt on top, add / permissions / model / mic / send below, with status chips for branch, project folder, and the context meter.">
          <ComposerPanel />
        </Section>

        <Section id="composer-attachments" name="Composer Attachments" registry="composer-attachments" blurb="Composer Panel with attachment tiles above the prompt: image and document tiles drop in one by one, each drawing an upload ring as it lands.">
          <ComposerAttachments />
        </Section>

        <Section id="agent-progress" name="Agent Progress" registry="agent-progress" blurb="Collapsible multi-step AI task progress: pending, active, and done states with a progress bar. Runs once, then offers to run again.">
          <AgentProgress />
        </Section>

        <Section id="agent-limits-card" name="Agent Limits Card" registry="agent-limits-card" blurb="Context-window usage bar with an expandable token breakdown, collapsible groups, the plan cap, and the reset time.">
          <AgentLimitsCard />
        </Section>

        <Section id="questionnaire" name="Questionnaire" registry="questionnaire" blurb="Plan-mode question card: one question per step, checkbox or numbered rows, a free-text Other row, step pills, and Previous / Next.">
          <Questionnaire />
        </Section>

        <Section id="calendar" name="Calendar" registry="calendar" blurb="Month-view calendar: event chips, a detail popover, month switching, and an inbox list of the month's events. Starts on August 2026, like the template demo.">
          <Calendar />
        </Section>

        <Section id="project-board" name="Project Board" registry="project-board" blurb="The board already exists as a 1:1 template — the component version reuses it instead of rebuilding the kanban twice.">
          <LinkCard
            href="/templates/project-board"
            title="Project Board template"
            registry="project-board"
            blurb="Sortable kanban: Backlog / To do / In progress / Done with ticket cards."
            icon={<RiKanbanView2 className="size-5" />}
          />
        </Section>

        <Section id="agent-avatar" name="Agent Avatar" registry="agent-avatar" blurb="Animated paper avatar: hand-drawn SVG, wandering eyes that blink, nine silhouettes, and a 3D turn when you click it.">
          <AgentAvatar />
        </Section>

        <Section id="agent-creator" name="Agent Creator" registry="agent-creator" blurb="Controlled agent creation sidebar: live avatar preview, emoji and shape pickers, custom colour, profile fields, and voice preference.">
          <AgentCreator />
        </Section>

        <Section id="multi-agent-chat" name="Multi-Agent Chat" registry="multi-agent-chat" blurb="The agent workspace already exists as a 1:1 template — the component version reuses it instead of rebuilding the chat twice.">
          <LinkCard
            href="/templates/multi-agent-chat"
            title="Multi-Agent Chat template"
            registry="multi-agent-chat"
            blurb="Single and group chats, live avatar editor, BoardUI Composer, Marketplace."
            icon={<RiChat3Line className="size-5" />}
          />
        </Section>

        <footer className="flex items-center gap-2 border-t border-separator-border pt-4 pb-2 text-caption-1-regular text-text-tertiary">
          <RiCalendarLine className="size-3.5" aria-hidden />
          Replica built from free BoardUI components (MIT) + public page content. Not affiliated with BoardUI; no Pro source used.
        </footer>
      </div>
    </main>
  );
}
