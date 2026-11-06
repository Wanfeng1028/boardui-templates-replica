"use client";

import {
  RiAddFill,
  RiBankLine,
  RiCoinsFill,
  RiExchangeLine,
  RiRefund2Fill,
  RiWalletLine,
} from "@remixicon/react";

import { TemplateShell } from "@/components/application/template-shell/template-shell";
import { RevenueChartCard } from "@/components/application/dashboard/revenue-chart-card";
import { StatCards, type Stat } from "@/components/application/dashboard/stat-cards";
import { Button } from "@/components/base/buttons/button";
import { Badge } from "@/components/base/badges/badge";

/**
 * Finance template replica.
 * Official: boardui.com/templates/finance — total balance / income /
 * expenses / invested, cash flow, spending by category, portfolio.
 * Built only from free BoardUI components + mock data. Not the official Pro source.
 */

const FINANCE_STATS: Stat[] = [
  { icon: RiWalletLine, label: "Total balance", value: "$84,230", delta: "+3.2%", deltaColor: "lime" },
  { icon: RiCoinsFill, label: "Income", value: "$18,420", delta: "+6.1%", deltaColor: "lime" },
  { icon: RiRefund2Fill, label: "Expenses", value: "$9,140", delta: "+2.4%", deltaColor: "lime" },
  { icon: RiExchangeLine, label: "Invested", value: "$32,400", delta: "+8.4%", deltaColor: "lime" },
];

const CASHFLOW_DATA = [
  { label: "Jan", current: 15200, previous: 11800 },
  { label: "Feb", current: 14800, previous: 12100 },
  { label: "Mar", current: 16400, previous: 12900 },
  { label: "Apr", current: 15900, previous: 13400 },
  { label: "May", current: 17100, previous: 13800 },
  { label: "Jun", current: 17800, previous: 14200 },
  { label: "Jul", current: 18420, previous: 14900 },
  { label: "Aug", current: 17900, previous: 14600 },
  { label: "Sep", current: 18200, previous: 15100 },
  { label: "Oct", current: 18900, previous: 15400 },
  { label: "Nov", current: 18600, previous: 15200 },
  { label: "Dec", current: 19200, previous: 15800 },
];

const SPENDING = [
  { label: "Housing", value: "$2,140", pct: 37 },
  { label: "Food & dining", value: "$1,320", pct: 23 },
  { label: "Transport", value: "$860", pct: 15 },
  { label: "Entertainment", value: "$740", pct: 13 },
  { label: "Shopping", value: "$750", pct: 12 },
];

const TRANSACTIONS = [
  { name: "Salary — BoardUI", date: "Aug 1, 2026", amount: "+$8,400.00", tone: "lime" as const },
  { name: "Whole Foods Market", date: "Jul 30, 2026", amount: "-$186.20", tone: "rose" as const },
  { name: "Vercel", date: "Jul 28, 2026", amount: "-$20.00", tone: "rose" as const },
  { name: "Freelance — Landing page", date: "Jul 25, 2026", amount: "+$1,200.00", tone: "lime" as const },
  { name: "Uber", date: "Jul 24, 2026", amount: "-$32.40", tone: "rose" as const },
];

export default function FinanceTemplatePage() {
  return (
    <TemplateShell
      title="Finance"
      heading="Finance"
      icon={RiBankLine}
      selected="finance"
      actions={
        <Button variant="primary" size="medium" leadingIcon={RiAddFill}>
          Add transaction
        </Button>
      }
    >
      <StatCards variant="plain" stats={FINANCE_STATS} />

      <div className="flex w-full flex-col items-stretch gap-4 xl:flex-row">
        <RevenueChartCard data={CASHFLOW_DATA} title="Cash flow" />
        <section className="flex w-full flex-col gap-3 rounded-2xl bg-background-secondary-default p-4 xl:max-w-[360px]">
          <div className="flex flex-col gap-0.5">
            <p className="text-body-medium text-text-secondary">Portfolio</p>
            <div className="flex items-baseline gap-2">
              <p className="text-display-4-medium text-text-primary tabular-nums">7%</p>
              <Badge color="primary">+6.2%</Badge>
            </div>
            <p className="text-body-2-medium text-text-tertiary">Year to date</p>
          </div>
          <div className="flex flex-col gap-2.5">
            <p className="text-body-medium text-text-secondary">Spending by category · $5,810</p>
            {SPENDING.map((item) => (
              <div key={item.label} className="flex w-full flex-col gap-1">
                <div className="flex w-full items-center justify-between">
                  <p className="text-body-2-regular text-text-primary">{item.label}</p>
                  <p className="text-body-2-medium text-text-secondary tabular-nums">{item.value}</p>
                </div>
                <div className="h-1.5 w-full overflow-hidden rounded-full bg-background-tertiary-default">
                  <div className="h-full rounded-full bg-chart-2-active" style={{ width: `${item.pct}%` }} />
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>

      <section className="flex w-full flex-col gap-3 rounded-2xl bg-background-secondary-default p-4">
        <div className="flex w-full items-center justify-between">
          <p className="text-title-3-semibold text-text-primary">Spending</p>
          <span className="text-body-2-medium text-text-secondary">This month</span>
        </div>
        <div className="flex w-full flex-col">
          {TRANSACTIONS.map((tx) => (
            <div
              key={tx.name + tx.date}
              className="flex w-full items-center justify-between gap-3 border-b border-separator-border py-2.5 last:border-b-0"
            >
              <div className="flex min-w-0 flex-col">
                <p className="truncate text-body-medium text-text-primary">{tx.name}</p>
                <p className="text-body-2-regular text-text-tertiary">{tx.date}</p>
              </div>
              <span
                className={
                  tx.tone === "lime"
                    ? "text-body-medium text-status-lime-text tabular-nums"
                    : "text-body-medium text-status-rose-text tabular-nums"
                }
              >
                {tx.amount}
              </span>
            </div>
          ))}
        </div>
      </section>
    </TemplateShell>
  );
}
