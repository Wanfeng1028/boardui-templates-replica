"use client";

import {
  RiAdvertisementLine,
  RiCursorLine,
  RiMegaphoneLine,
  RiMouseLine,
  RiAddFill,
} from "@remixicon/react";

import { TemplateShell } from "@/components/application/template-shell/template-shell";
import { OrdersChartCard } from "@/components/application/dashboard/orders-chart-card";
import { RevenueChartCard } from "@/components/application/dashboard/revenue-chart-card";
import { StatCards, type Stat } from "@/components/application/dashboard/stat-cards";
import { Button } from "@/components/base/buttons/button";

/**
 * Marketing template replica.
 * Official: boardui.com/templates/marketing — ad spend / impressions /
 * conversions / CPC stat cards, acquisition funnel, last 30 days.
 * Built only from free BoardUI components + mock data. Not the official Pro source.
 */

const MARKETING_STATS: Stat[] = [
  { icon: RiAdvertisementLine, label: "Ad spend", value: "$24,380", delta: "+8.4%", deltaColor: "lime" },
  { icon: RiCursorLine, label: "Impressions", value: "1.94M", delta: "+12.6%", deltaColor: "lime" },
  { icon: RiMouseLine, label: "Conversions", value: "1,286", delta: "+5.2%", deltaColor: "lime" },
  { icon: RiAdvertisementLine, label: "Cost per click", value: "$1.24", delta: "-3.1%", deltaColor: "rose" },
];

const FUNNEL = [
  { label: "Visits", value: "96.4K", pct: 100 },
  { label: "Sign-ups", value: "38.6K", pct: 40 },
  { label: "Trials", value: "14.1K", pct: 15 },
];

const FUNNEL_DATA = [
  { label: "Jan", current: 7200, previous: 6100 },
  { label: "Feb", current: 7800, previous: 6400 },
  { label: "Mar", current: 8600, previous: 7100 },
  { label: "Apr", current: 8300, previous: 6900 },
  { label: "May", current: 9100, previous: 7400 },
  { label: "Jun", current: 9400, previous: 7600 },
  { label: "Jul", current: 9900, previous: 8100 },
  { label: "Aug", current: 9600, previous: 7900 },
  { label: "Sep", current: 10200, previous: 8300 },
  { label: "Oct", current: 10500, previous: 8600 },
  { label: "Nov", current: 10100, previous: 8400 },
  { label: "Dec", current: 10800, previous: 8800 },
];

export default function MarketingTemplatePage() {
  return (
    <TemplateShell
      title="Marketing"
      heading="Marketing"
      icon={RiMegaphoneLine}
      selected="marketing"
      actions={
        <Button variant="primary" size="medium" leadingIcon={RiAddFill}>
          New campaign
        </Button>
      }
    >
      <StatCards variant="plain" stats={MARKETING_STATS} />

      <div className="flex w-full flex-col items-stretch gap-4 xl:flex-row">
        <RevenueChartCard data={FUNNEL_DATA} title="Acquisition funnel" />
        <OrdersChartCard title="Conversions" />
      </div>

      <section className="flex w-full flex-col gap-4 rounded-2xl bg-background-secondary-default p-4">
        <div className="flex w-full items-center justify-between">
          <p className="text-title-3-semibold text-text-primary">Acquisition funnel</p>
          <span className="text-body-2-medium text-text-secondary">96.4K · +5.8% · Last 30 days</span>
        </div>
        <div className="flex w-full flex-col gap-3">
          {FUNNEL.map((step) => (
            <div key={step.label} className="flex w-full flex-col gap-1.5">
              <div className="flex w-full items-center justify-between">
                <p className="text-body-medium text-text-primary">{step.label}</p>
                <p className="text-body-medium text-text-secondary tabular-nums">{step.value}</p>
              </div>
              <div className="h-2 w-full overflow-hidden rounded-full bg-background-tertiary-default">
                <div
                  className="h-full rounded-full bg-chart-2-active"
                  style={{ width: `${step.pct}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </section>
    </TemplateShell>
  );
}
