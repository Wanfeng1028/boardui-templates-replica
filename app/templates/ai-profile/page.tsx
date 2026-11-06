"use client";

import {
  RiEditLine,
  RiShareLine,
  RiUserSmileLine,
  RiCoinsFill,
  RiFlashlightLine,
  RiTimeLine,
  RiFireLine,
} from "@remixicon/react";
import { useState } from "react";

import { TemplateShell } from "@/components/application/template-shell/template-shell";
import { RevenueChartCard } from "@/components/application/dashboard/revenue-chart-card";
import { StatCards, type Stat } from "@/components/application/dashboard/stat-cards";
import { Avatar } from "@/components/base/avatar/avatar";
import { Badge } from "@/components/base/badges/badge";
import { Button } from "@/components/base/buttons/button";
import { Tab, TabList, Tabs } from "@/components/base/tabs/tabs";

/**
 * AI Profile template replica.
 * Official: boardui.com/templates/ai-profile — Mertcan Esmergül @sitenley
 * PRO, lifetime tokens, activity, 32 agents.
 * Built only from free BoardUI components + mock data. Not the official Pro source.
 */

const PROFILE_STATS: Stat[] = [
  { icon: RiCoinsFill, label: "Lifetime tokens", value: "9B", delta: "+14.8%", deltaColor: "lime" },
  { icon: RiFlashlightLine, label: "Peak tokens", value: "562.7M", delta: "+6.2%", deltaColor: "lime" },
  { icon: RiTimeLine, label: "Longest task", value: "12h 54m", delta: "+2.1%", deltaColor: "lime" },
  { icon: RiFireLine, label: "Top streak", value: "62 days", delta: "+9.4%", deltaColor: "lime" },
];

const ACTIVITY: Record<string, { label: string; current: number; previous: number }[]> = {
  weekly: [
    { label: "Mon", current: 820, previous: 610 },
    { label: "Tue", current: 940, previous: 720 },
    { label: "Wed", current: 880, previous: 690 },
    { label: "Thu", current: 1020, previous: 780 },
    { label: "Fri", current: 960, previous: 740 },
    { label: "Sat", current: 720, previous: 540 },
    { label: "Sun", current: 680, previous: 510 },
  ],
  monthly: [
    { label: "W1", current: 5200, previous: 4100 },
    { label: "W2", current: 5800, previous: 4400 },
    { label: "W3", current: 6100, previous: 4700 },
    { label: "W4", current: 6600, previous: 5100 },
  ],
  yearly: [
    { label: "Jan", current: 18000, previous: 12000 },
    { label: "Feb", current: 21000, previous: 14000 },
    { label: "Mar", current: 24000, previous: 16000 },
    { label: "Apr", current: 22000, previous: 15000 },
    { label: "May", current: 26000, previous: 18000 },
    { label: "Jun", current: 28000, previous: 19000 },
    { label: "Jul", current: 31000, previous: 21000 },
    { label: "Aug", current: 29000, previous: 20000 },
    { label: "Sep", current: 33000, previous: 22000 },
    { label: "Oct", current: 35000, previous: 24000 },
    { label: "Nov", current: 34000, previous: 23000 },
    { label: "Dec", current: 38000, previous: 25000 },
  ],
};

const AGENTS = [
  { name: "landing page designer", desc: "Give the hero one clear action.", color: "blue" as const },
  { name: "content reviewer", desc: "The shorter opening feels more welcoming.", color: "blue" as const },
  { name: "marketing bot", desc: "Lead with the problem your audience recognizes.", color: "pink" as const },
  { name: "seo bot", desc: "Start with a practical guide to the core topic.", color: "lime" as const },
  { name: "research assistant", desc: "Ask about the last time the problem happened.", color: "pink" as const },
  { name: "security agent", desc: "A careful second pair of eyes for permissions and privacy.", color: "blue" as const },
  { name: "cloud engineer", desc: "Give staging its own environment and data.", color: "blue" as const },
  { name: "code reviewer", desc: "Read the diff before the tests.", color: "pink" as const },
];

export default function AiProfileTemplatePage() {
  const [range, setRange] = useState("weekly");
  return (
    <TemplateShell
      title="Profile"
      heading="Mertcan Esmergül"
      icon={RiUserSmileLine}
      selected="profile"
      actions={
        <>
          <Button variant="secondary" size="medium" leadingIcon={RiShareLine}>
            Share
          </Button>
          <Button variant="primary" size="medium" leadingIcon={RiEditLine}>
            Edit
          </Button>
        </>
      }
    >
      <section className="flex w-full flex-col gap-3 rounded-2xl bg-background-secondary-default p-4 sm:flex-row sm:items-center">
        <Avatar size="lg" color="blue" initials="M" className="size-16 text-title-1-medium" />
        <div className="flex min-w-0 flex-1 flex-col gap-0.5">
          <div className="flex flex-wrap items-center gap-2">
            <p className="text-title-1-medium text-text-primary">Mertcan Esmergül</p>
            <Badge color="primary">PRO</Badge>
          </div>
          <p className="text-body-regular text-text-secondary">@sitenley · Contributions this year +14.8%</p>
        </div>
        <p className="text-body-2-medium text-text-tertiary">June 14 · December</p>
      </section>

      <StatCards variant="plain" stats={PROFILE_STATS} />

      <section className="flex w-full flex-col gap-3">
        <Tabs
          defaultSelectedKey="weekly"
          onSelectionChange={(key) => setRange(String(key))}
        >
          <TabList aria-label="Activity range">
            <Tab id="weekly">Weekly</Tab>
            <Tab id="monthly">Monthly</Tab>
            <Tab id="yearly">Yearly</Tab>
          </TabList>
        </Tabs>
        <RevenueChartCard data={ACTIVITY[range]} title="Activity" />
      </section>

      <section className="flex w-full flex-col gap-3 rounded-2xl bg-background-secondary-default p-4">
        <div className="flex w-full items-center justify-between">
          <p className="text-title-3-semibold text-text-primary">Agents</p>
          <span className="text-body-2-medium text-text-secondary">32 agents</span>
        </div>
        <div className="grid w-full grid-cols-1 gap-3 sm:grid-cols-2">
          {AGENTS.map((agent) => (
            <div
              key={agent.name}
              className="flex w-full items-start gap-3 rounded-xl bg-background-inner-default p-3"
            >
              <Avatar size="md" color={agent.color} initials={agent.name.slice(0, 2).toUpperCase()} />
              <div className="flex min-w-0 flex-col gap-0.5">
                <p className="truncate text-body-medium text-text-primary">{agent.name}</p>
                <p className="text-body-2-regular text-text-secondary">{agent.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>
    </TemplateShell>
  );
}
