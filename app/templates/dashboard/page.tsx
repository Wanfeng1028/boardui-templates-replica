"use client";

import { RiArrowLeftSLine, RiArrowRightSLine, RiHomeLine } from "@remixicon/react";
import { useState } from "react";

import { TemplateShell } from "@/components/application/template-shell/template-shell";
import { OrdersChartCard } from "@/components/application/dashboard/orders-chart-card";
import { RevenueChartCard } from "@/components/application/dashboard/revenue-chart-card";
import { StatCards } from "@/components/application/dashboard/stat-cards";
import { DataTableExample } from "@/components/application/data-table/data-table";
import { Avatar } from "@/components/base/avatar/avatar";
import { Button } from "@/components/base/buttons/button";
import { IconButton } from "@/components/base/buttons/icon-button";

/**
 * Dashboard template replica.
 * Official: boardui.com/templates/dashboard — "Welcome Mertcan", stat cards,
 * revenue/orders charts, customers table, recent hires.
 * Built only from free BoardUI components + mock data. Not the official Pro source.
 */

const HIRES = [
  { name: "Livia Saris", role: "Backend Engineer", joined: "Joined today", initials: "LS", color: "blue" as const },
  { name: "Jaydon Aminoff", role: "UI Designer", joined: "2 days ago", initials: "JA", color: "blue" as const },
  { name: "Maria Lubin", role: "User Researcher", joined: "5 days ago", initials: "ML", color: "pink" as const },
  { name: "Ann Press", role: "DevOps Engineer", joined: "A week ago", initials: "AP", color: "lime" as const },
];

function RecentHiresCard() {
  const [page, setPage] = useState(0);
  const total = 56;
  return (
    <section className="flex w-full flex-col gap-3 rounded-2xl bg-background-secondary-default p-4">
      <div className="flex w-full items-center justify-between">
        <div className="flex items-baseline gap-2">
          <p className="text-title-3-semibold text-text-primary">Recent hires</p>
          <span className="text-body-medium text-text-secondary tabular-nums">{total}</span>
        </div>
        <div className="flex items-center gap-1">
          <IconButton
            icon={RiArrowLeftSLine}
            size="small"
            aria-label="Previous hires"
            onClick={() => setPage((p) => Math.max(0, p - 1))}
          />
          <IconButton
            icon={RiArrowRightSLine}
            size="small"
            aria-label="Next hires"
            onClick={() => setPage((p) => p + 1)}
          />
        </div>
      </div>
      <div className="flex w-full flex-col">
        {HIRES.map((hire) => (
          <div
            key={hire.name}
            className="flex w-full items-center gap-3 border-b border-separator-border py-2.5 last:border-b-0"
          >
            <Avatar size="md" color={hire.color} initials={hire.initials} />
            <div className="flex min-w-0 flex-1 flex-col">
              <p className="truncate text-body-medium text-text-primary">{hire.name}</p>
              <p className="truncate text-body-2-regular text-text-secondary">{hire.role}</p>
            </div>
            <span className="shrink-0 text-body-2-regular whitespace-nowrap text-text-tertiary">
              {hire.joined}
            </span>
          </div>
        ))}
      </div>
      <p className="text-caption-1-regular text-text-tertiary">
        Page {page + 1} of {Math.ceil(total / HIRES.length)} · replica data
      </p>
    </section>
  );
}

export default function DashboardTemplatePage() {
  return (
    <TemplateShell title="Dashboard" heading="Welcome Mertcan" icon={RiHomeLine} selected="home">
      <StatCards variant="footer" />

      <div className="flex w-full flex-col items-stretch gap-4 xl:flex-row">
        <RevenueChartCard />
        <OrdersChartCard />
      </div>

      <DataTableExample />

      <div className="flex w-full flex-col gap-4 xl:flex-row">
        <RecentHiresCard />
        <section className="flex w-full flex-col justify-between gap-3 rounded-2xl bg-background-secondary-default p-4">
          <div className="flex flex-col gap-0.5">
            <p className="text-body-medium text-text-secondary">Earned so far</p>
            <p className="text-display-4-medium text-text-primary tabular-nums">7,462</p>
            <p className="text-body-2-medium text-text-tertiary">+14.8% · Weekly</p>
          </div>
          <Button variant="secondary" size="medium">
            View earnings
          </Button>
        </section>
      </div>
    </TemplateShell>
  );
}
