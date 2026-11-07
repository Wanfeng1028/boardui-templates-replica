"use client";

import {
  RiArrowRightLine,
  RiBankLine,
  RiCalendarLine,
  RiChatAiLine,
  RiDashboardLine,
  RiImageAiLine,
  RiKanbanView2,
  RiMegaphoneLine,
  RiAsterisk,
  RiTeamLine,
  RiUserSmileLine,
} from "@remixicon/react";
import Link from "next/link";

import { TemplateShell } from "@/components/application/template-shell/template-shell";

/**
 * Templates index — a hub listing the 11 replica templates.
 * All 11 are built only from free BoardUI components + mock data.
 * This is a replica. It is not the official BoardUI Pro templates.
 */

const TEMPLATES = [
  { slug: "dashboard", name: "Dashboard", desc: "Admin dashboard — stat cards, revenue/orders charts, customers table, recent hires.", icon: RiDashboardLine },
  { slug: "project-board", name: "Project Board", desc: "Kanban — Backlog / To do / In progress / Done with ticket cards.", icon: RiKanbanView2 },
  { slug: "marketing", name: "Marketing", desc: "Marketing dashboard — ad spend, impressions, conversions, acquisition funnel.", icon: RiMegaphoneLine },
  { slug: "calendar", name: "Calendar", desc: "Month view — August 2026 grid with events pinned to dates.", icon: RiCalendarLine },
  { slug: "finance", name: "Finance", desc: "Finance dashboard — balance, income, expenses, cash flow, spending, portfolio.", icon: RiBankLine },
  { slug: "medical-profile", name: "Medical Profile", desc: "Patient info, important alerts, steps, sleep score.", icon: RiAsterisk },
  { slug: "hr-management", name: "HR Management", desc: "Headcount KPIs, hiring pipeline, engagement radar, employees table. Built from the official description (no live demo).", icon: RiTeamLine },
  { slug: "ai-chat", name: "AI Chat", desc: "Coding agent chat — working chat with demo mode (no API key needed).", icon: RiChatAiLine },
  { slug: "ai-image-generation", name: "AI Image Generation", desc: "Gallery / Styles tabs with image generations and prompts.", icon: RiImageAiLine },
  { slug: "ai-profile", name: "AI Profile", desc: "Agent profile — lifetime tokens, activity, 32 agents.", icon: RiUserSmileLine },
  { slug: "multi-agent-chat", name: "Multi-Agent Chat", desc: "Agent roster, shared chat, per-agent settings panel.", icon: RiChatAiLine },
];

export default function TemplatesIndexPage() {
  return (
    <TemplateShell
      title="Templates"
      heading="全部模板 · 11 套"
      icon={RiDashboardLine}
      selected="all-templates"
      actions={null}
      hideAllTemplatesButton
    >
      <p className="px-1 text-body-regular text-text-secondary">
        共 <span className="text-body-medium text-text-primary">11 套模板</span>，每套一张卡片，点击任意卡片打开对应模板。
      </p>
      <p className="px-1 text-body-regular text-text-secondary">
        11 template routes replicated with free BoardUI components (MIT) and mock
        data — the 10 Pro templates plus the Calendar demo page. This is a replica
        for reference — it is not the official Pro source.
        The 30 Pro components are showcased separately at{" "}
        <Link href="/pro-components" className="text-accent-600 underline">
          /pro-components
        </Link>{" "}
        (13 agent/composer components) and{" "}
        <Link href="/pro-components/charts" className="text-accent-600 underline">
          /pro-components/charts
        </Link>{" "}
        (17 chart cards).
      </p>
      <div className="grid w-full grid-cols-1 gap-4 sm:grid-cols-2">
        {TEMPLATES.map((template) => (
          <Link
            key={template.slug}
            href={`/templates/${template.slug}`}
            className="group flex w-full items-start gap-3 rounded-2xl bg-background-secondary-default p-4 outline-none transition-colors hover:bg-background-tertiary-default focus-visible:ring-2 focus-visible:ring-border-focus-ring"
          >
            <span className="flex size-10 shrink-0 items-center justify-center rounded-2lg bg-accent-500 text-white">
              <template.icon className="size-5" aria-hidden />
            </span>
            <span className="flex min-w-0 flex-1 flex-col gap-0.5">
              <span className="flex items-center gap-1.5 text-body-medium text-text-primary">
                {template.name}
                <RiArrowRightLine
                  className="size-4 text-foreground-icon-secondary transition-transform group-hover:translate-x-0.5"
                  aria-hidden
                />
              </span>
              <span className="text-body-2-regular text-text-secondary">{template.desc}</span>
              <span className="text-caption-1-regular text-text-tertiary">/templates/{template.slug}</span>
            </span>
          </Link>
        ))}
      </div>
    </TemplateShell>
  );
}
