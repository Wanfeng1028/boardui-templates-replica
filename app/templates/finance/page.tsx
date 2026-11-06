"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import {
  RiAddFill,
  RiBankLine,
  RiCoinsFill,
  RiEditLine,
  RiExchangeLine,
  RiFileCopyLine,
  RiFilter3Fill,
  RiMore2Fill,
  RiRefund2Fill,
  RiSearchLine,
  RiUserLine,
  RiWalletLine,
} from "@remixicon/react";

import { TemplateShell } from "@/components/application/template-shell/template-shell";
import { NotificationBell } from "@/components/application/app-shell/notification-bell";
import { StatCards, type Stat } from "@/components/application/dashboard/stat-cards";
import { Chip } from "@/components/base/badges/chip";
import { StatusDot } from "@/components/base/badges/status-dot";
import { Button } from "@/components/base/buttons/button";
import { CloseButton } from "@/components/base/buttons/close-button";
import { IconButton } from "@/components/base/buttons/icon-button";
import { Checkbox } from "@/components/base/checkbox/checkbox";
import {
  Dropdown,
  DropdownGroup,
  DropdownItem,
  DropdownPopover,
  DropdownTrigger,
} from "@/components/base/dropdown/dropdown";
import { Input, InputBase } from "@/components/base/input/input";
import { Pagination } from "@/components/base/pagination/pagination";
import { Select, SelectItem } from "@/components/base/select/select";
import { cx } from "@/utils/cx";

/**
 * Finance template replica (1:1 functional rebuild).
 * Official: boardui.com/templates/finance — balance KPIs, cash-flow Sankey,
 * spending donut, portfolio bubbles, daily-spending heatmap, transactions table.
 * Values below are read off the official page's server HTML (KPI cards
 * h-132px, cash-flow card h-480px, trio cards h-329px, table 140
 * transactions / 14 pages, heatmap cells from the page's aria-labels).
 * Built only from free BoardUI components + mock data. Not the official Pro source.
 */

function mulberry32(seed: number) {
  return () => {
    seed |= 0;
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const MONTHS_SHORT = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
const fmtInt = (n: number) => Math.round(n).toLocaleString("en-US");
const fmtMoney = (n: number) => `$${fmtInt(n)}`;
const fmtSigned = (n: number) => `${n >= 0 ? "+" : "−"}$${fmtInt(Math.abs(n))}`;

const FINANCE_STATS: Stat[] = [
  { icon: RiWalletLine, label: "Total balance", value: "$84,230", delta: "+3.2%", deltaColor: "lime" },
  { icon: RiCoinsFill, label: "Income", value: "$18,420", delta: "+6.1%", deltaColor: "lime" },
  { icon: RiRefund2Fill, label: "Expenses", value: "$9,140", delta: "+2.4%", deltaColor: "rose" },
  { icon: RiExchangeLine, label: "Invested", value: "$32,400", delta: "+8.4%", deltaColor: "lime" },
];

/* ------------------------------------------------------------------ */
/* Cash-flow Sankey: Income $18,420 = Salary 12,600 + Freelance 3,420  */
/* + Investments 2,400; out: Savings 9,280 + spending 9,140.           */
/* ------------------------------------------------------------------ */

type SankeyNode = { id: string; label: string; value: number; color: string };

const SANKEY_IN: SankeyNode[] = [
  { id: "salary", label: "Salary", value: 12600, color: "var(--color-chart-6)" },
  { id: "freelance", label: "Freelance", value: 3420, color: "var(--color-chart-4)" },
  { id: "investments", label: "Investments", value: 2400, color: "var(--color-chart-5)" },
];

const SANKEY_OUT: SankeyNode[] = [
  { id: "savings", label: "Savings", value: 9280, color: "var(--color-chart-2)" },
  { id: "housing", label: "Housing", value: 2940, color: "var(--color-chart-1)" },
  { id: "groceries", label: "Groceries", value: 1860, color: "var(--color-chart-3)" },
  { id: "dining", label: "Dining", value: 1120, color: "var(--color-chart-8)" },
  { id: "transport", label: "Transport", value: 920, color: "var(--color-chart-7)" },
  { id: "travel", label: "Travel", value: 680, color: "var(--color-chart-4)" },
  { id: "subscriptions", label: "Subscriptions", value: 640, color: "var(--color-chart-5)" },
  { id: "utilities", label: "Utilities", value: 580, color: "var(--color-chart-6)" },
  { id: "health", label: "Health", value: 400, color: "var(--color-chart-3)" },
];

const CASHFLOW_PERIODS = [
  { id: "month", label: "This month", factor: 1, income: 18420, delta: "+6.1%" },
  { id: "last-month", label: "Last month", factor: 0.94, income: 17315, delta: "+4.8%" },
  { id: "year", label: "This year", factor: 10.77, income: 198383, delta: "+12.3%" },
] as const;

/* ------------------------------------------------------------------ */
/* Spending donut: 8 categories summing to the official $5,810.        */
/* ------------------------------------------------------------------ */

const DONUT = [
  { label: "Housing", value: 1740, color: "var(--color-chart-6)" },
  { label: "Groceries", value: 1162, color: "var(--color-chart-2)" },
  { label: "Transport", value: 872, color: "var(--color-chart-4)" },
  { label: "Dining", value: 581, color: "var(--color-chart-3)" },
  { label: "Subscriptions", value: 465, color: "var(--color-chart-5)" },
  { label: "Utilities", value: 407, color: "var(--color-chart-1)" },
  { label: "Travel", value: 349, color: "var(--color-chart-8)" },
  { label: "Health", value: 234, color: "var(--color-chart-7)" },
];
const DONUT_TOTAL = DONUT.reduce((s, d) => s + d.value, 0); // 5,810

/* ------------------------------------------------------------------ */
/* Daily spending heatmap: exact cell values from the official page's   */
/* aria-labels (Mon-Sun x W1-W12).                                     */
/* ------------------------------------------------------------------ */

const DAILY: Record<string, number[]> = {
  Mon: [24, 18, 32, 21, 28, 35, 22, 30, 26, 38, 29, 33],
  Tue: [18, 22, 16, 25, 19, 28, 24, 21, 30, 24, 27, 22],
  Wed: [52, 46, 58, 49, 62, 55, 64, 58, 70, 61, 66, 72],
  Thu: [21, 26, 19, 30, 24, 27, 22, 32, 25, 29, 34, 26],
  Fri: [64, 58, 72, 66, 78, 70, 82, 74, 88, 79, 84, 92],
  Sat: [88, 76, 94, 82, 102, 90, 108, 96, 118, 104, 112, 124],
  Sun: [46, 40, 52, 44, 56, 50, 60, 52, 64, 56, 61, 68],
};
const DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

/* ------------------------------------------------------------------ */
/* Transactions table: first 10 rows are the official page's first     */
/* page; rows 11-140 are deterministic mock data.                      */
/* ------------------------------------------------------------------ */

type Account = "Checking" | "Savings" | "Credit card";
const ACCOUNTS: Account[] = ["Checking", "Savings", "Credit card"];
const CATEGORIES = ["Housing", "Groceries", "Transport", "Dining", "Subscriptions", "Utilities", "Travel", "Health", "Income", "Investing"];

type Tx = {
  id: string;
  name: string;
  account: Account;
  category: string;
  date: string;
  dateTs: number;
  amount: number;
};

const MERCHANTS = [
  "Whole Foods Market", "Spotify", "Netflix", "Shell", "Uber", "Amazon", "Trader Joe's",
  "Chipotle", "Delta Air Lines", "Airbnb", "Apple", "Google Cloud", "Starbucks", "Lyft",
  "Target", "CVS Pharmacy", "Equinox", "HBO Max", "Southwest", "Etsy",
];

function buildTransactions(): Tx[] {
  const exact: Array<Omit<Tx, "id">> = [
    { name: "Whole Foods Market", account: "Savings", category: "Groceries", date: "Oct 28, 2026", dateTs: new Date(2026, 9, 28).getTime(), amount: -135 },
    { name: "Spotify", account: "Savings", category: "Subscriptions", date: "Jul 15, 2026", dateTs: new Date(2026, 6, 15).getTime(), amount: -12 },
    { name: "Acme Corp payroll", account: "Savings", category: "Income", date: "Jun 17, 2026", dateTs: new Date(2026, 5, 17).getTime(), amount: 6200 },
    { name: "iCloud storage", account: "Savings", category: "Subscriptions", date: "Feb 03, 2026", dateTs: new Date(2026, 1, 3).getTime(), amount: -3 },
    { name: "Electric utility", account: "Credit card", category: "Utilities", date: "Jun 06, 2026", dateTs: new Date(2026, 5, 6).getTime(), amount: -91 },
    { name: "Whole Foods Market", account: "Savings", category: "Groceries", date: "Apr 05, 2026", dateTs: new Date(2026, 3, 5).getTime(), amount: -161 },
    { name: "Studio K invoice", account: "Checking", category: "Income", date: "Dec 14, 2026", dateTs: new Date(2026, 11, 14).getTime(), amount: 1286 },
    { name: "Shell", account: "Credit card", category: "Transport", date: "Nov 01, 2026", dateTs: new Date(2026, 10, 1).getTime(), amount: -76 },
    { name: "Netflix", account: "Credit card", category: "Subscriptions", date: "Dec 14, 2026", dateTs: new Date(2026, 11, 14).getTime(), amount: -18 },
    { name: "iCloud storage", account: "Checking", category: "Subscriptions", date: "Apr 24, 2026", dateTs: new Date(2026, 3, 24).getTime(), amount: -3 },
  ];
  const rng = mulberry32(140);
  const rows: Tx[] = exact.map((t, i) => ({ ...t, id: String(i) }));
  for (let i = 10; i < 140; i++) {
    const month = Math.floor(rng() * 12);
    const day = 1 + Math.floor(rng() * 28);
    const isIncome = rng() < 0.18;
    rows.push({
      id: String(i),
      name: MERCHANTS[Math.floor(rng() * MERCHANTS.length)],
      account: ACCOUNTS[Math.floor(rng() * ACCOUNTS.length)],
      category: isIncome ? "Income" : CATEGORIES[Math.floor(rng() * 8)],
      date: `${MONTHS_SHORT[month]} ${String(day).padStart(2, "0")}, 2026`,
      dateTs: new Date(2026, month, day).getTime(),
      amount: isIncome ? 500 + Math.floor(rng() * 5700) : -(3 + Math.floor(rng() * 397)),
    });
  }
  return rows;
}

const AMOUNT_BUCKETS = [
  { id: "all", label: "All amounts", test: (_a: number) => true },
  { id: "income", label: "Income only", test: (a: number) => a > 0 },
  { id: "under-50", label: "Under $50", test: (a: number) => a < 0 && Math.abs(a) < 50 },
  { id: "50-500", label: "$50 – $500", test: (a: number) => a < 0 && Math.abs(a) >= 50 && Math.abs(a) <= 500 },
  { id: "over-500", label: "Over $500", test: (a: number) => Math.abs(a) > 500 },
];

/* ------------------------------------------------------------------ */
/* Shared bits: modal, toast.                                          */
/* ------------------------------------------------------------------ */

function Modal({
  open,
  onClose,
  title,
  children,
}: {
  open: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4" role="dialog" aria-modal="true" aria-label={title}>
      <button type="button" aria-label="Close dialog" onClick={onClose} className="absolute inset-0 cursor-pointer bg-black/40" />
      <div className="relative flex max-h-[90vh] w-full max-w-[480px] flex-col gap-4 overflow-y-auto rounded-3xl border border-border-button-default bg-background-primary-default p-5 shadow-lg">
        <div className="flex w-full items-center justify-between">
          <p className="text-title-3-semibold text-text-primary">{title}</p>
          <CloseButton aria-label="Close dialog" onClick={onClose} />
        </div>
        {children}
      </div>
    </div>
  );
}

function Toast({ message }: { message: string | null }) {
  if (!message) return null;
  return (
    <div className="fixed bottom-4 left-1/2 z-[70] -translate-x-1/2 rounded-full border border-border-button-default bg-background-primary-default px-4 py-2 text-body-medium text-text-primary shadow-lg">
      {message}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Cash-flow Sankey card (h-480px). Hover/click a node to isolate its  */
/* flows; period select rescales every flow.                            */
/* ------------------------------------------------------------------ */

type Flow = { id: string; from: string; to: string; value: number; color: string; y1t: number; y1b: number; y2t: number; y2b: number; x1: number; x2: number };

function buildSankey(factor: number) {
  const scale = 272 / 18420;
  const round10 = (v: number) => Math.round((v * factor) / 10) * 10;
  const inNodes = SANKEY_IN.map((n) => ({ ...n, value: round10(n.value) }));
  const outNodes = SANKEY_OUT.map((n) => ({ ...n, value: round10(n.value) }));
  const total = 18420 * factor;
  const inH = inNodes.map((n) => (n.value / total) * 272);
  const outH = outNodes.map((n) => (n.value / total) * 272);
  const inY: number[] = [];
  const outY: number[] = [];
  let y = 14;
  inH.forEach((h) => { inY.push(y); y += h + 10; });
  y = 0;
  outH.forEach((h) => { outY.push(y); y += h + 6; });
  const centerY = 24;
  const centerH = 272;
  const flows: Flow[] = [];
  let cy = centerY;
  inNodes.forEach((n, i) => {
    const h = inH[i];
    flows.push({ id: `in-${n.id}`, from: n.label, to: "Income", value: n.value, color: n.color, y1t: inY[i], y1b: inY[i] + h, y2t: cy, y2b: cy + h, x1: 172, x2: 354 });
    cy += h;
  });
  cy = centerY;
  outNodes.forEach((n, i) => {
    const h = outH[i];
    flows.push({ id: `out-${n.id}`, from: "Income", to: n.label, value: n.value, color: n.color, y1t: cy, y1b: cy + h, y2t: outY[i], y2b: outY[i] + h, x1: 406, x2: 588 });
    cy += h;
  });
  return { inNodes, outNodes, inH, outH, inY, outY, centerY, centerH, flows, total };
}

function CashFlowCard() {
  const [periodId, setPeriodId] = useState<string>("month");
  const period = CASHFLOW_PERIODS.find((p) => p.id === periodId) ?? CASHFLOW_PERIODS[0];
  const [hovered, setHovered] = useState<string | null>(null);
  const [pinned, setPinned] = useState<string | null>(null);
  const active = hovered ?? pinned;
  const s = useMemo(() => buildSankey(period.factor), [period.factor]);

  const flowPath = (f: Flow) => {
    const mx = (f.x1 + f.x2) / 2;
    return `M ${f.x1} ${f.y1t} C ${mx} ${f.y1t}, ${mx} ${f.y2t}, ${f.x2} ${f.y2t} L ${f.x2} ${f.y2b} C ${mx} ${f.y2b}, ${mx} ${f.y1b}, ${f.x1} ${f.y1b} Z`;
  };
  const flowActive = (f: Flow) => !active || f.id === active || f.from === active || f.to === active;
  const caption = () => {
    if (active) {
      const f = s.flows.find((fl) => fl.id === active || fl.from === active || fl.to === active);
      if (f) return `${f.from} → ${f.to} · ${fmtMoney(f.value)}`;
      return active;
    }
    return `Income ${fmtMoney(period.income)} · Spending ${fmtMoney(Math.round(9140 * period.factor))} · Savings ${fmtMoney(Math.round(9280 * period.factor))}`;
  };

  return (
    <section className="flex h-[480px] w-full min-w-0 flex-col gap-4 rounded-2xl bg-background-secondary-default px-4 pt-4 pb-3">
      <div className="flex w-full items-start justify-between gap-3">
        <div className="flex min-w-0 flex-1 flex-col gap-0.5">
          <p className="w-full truncate text-body-medium text-text-secondary">Cash flow</p>
          <div className="flex w-full items-center gap-2">
            <p className="animate-number-fade text-title-1-medium whitespace-nowrap text-text-primary tabular-nums">{fmtMoney(period.income)}</p>
            <Chip variant="bold" color="lime">{period.delta}</Chip>
          </div>
        </div>
        <Select aria-label="Change period" className="w-[140px] shrink-0" selectedKey={periodId} onSelectionChange={(k) => setPeriodId(String(k))}>
          {CASHFLOW_PERIODS.map((p) => (
            <SelectItem key={p.id} id={p.id} textValue={p.label}>{p.label}</SelectItem>
          ))}
        </Select>
      </div>
      <div className="relative min-h-0 w-full flex-1 overflow-x-auto">
        <svg viewBox="0 0 800 320" className="h-full min-w-[560px] w-full" role="img" aria-label={`Cash flow Sankey: income ${fmtMoney(period.income)} split into savings and spending`}>
          {s.flows.map((f) => (
            <path
              key={f.id}
              d={flowPath(f)}
              fill={f.color}
              opacity={flowActive(f) ? 0.55 : 0.1}
              onMouseEnter={() => setHovered(f.id)}
              onMouseLeave={() => setHovered(null)}
              onClick={() => setPinned(pinned === f.id ? null : f.id)}
              className="cursor-pointer transition-opacity duration-150"
            />
          ))}
          {s.inNodes.map((n, i) => (
            <g key={n.id} onMouseEnter={() => setHovered(n.label)} onMouseLeave={() => setHovered(null)} onClick={() => setPinned(pinned === n.label ? null : n.label)} className="cursor-pointer">
              <rect x={120} y={s.inY[i]} width={52} height={Math.max(6, s.inH[i])} rx={8} fill={n.color} />
              <text x={112} y={s.inY[i] + s.inH[i] / 2 - 1} textAnchor="end" fontSize={12} fill="var(--color-text-primary)">{n.label}</text>
              <text x={112} y={s.inY[i] + s.inH[i] / 2 + 13} textAnchor="end" fontSize={11} fill="var(--color-text-tertiary)">{fmtMoney(n.value)}</text>
            </g>
          ))}
          <g onMouseEnter={() => setHovered("Income")} onMouseLeave={() => setHovered(null)} onClick={() => setPinned(pinned === "Income" ? null : "Income")} className="cursor-pointer">
            <rect x={354} y={s.centerY} width={52} height={s.centerH} rx={8} fill="var(--color-chart-2)" />
            <text x={380} y={s.centerY + s.centerH / 2 - 2} textAnchor="middle" fontSize={12} fontWeight={600} fill="#fff">Income</text>
            <text x={380} y={s.centerY + s.centerH / 2 + 13} textAnchor="middle" fontSize={10} fill="#fff">{fmtMoney(period.income)}</text>
          </g>
          {s.outNodes.map((n, i) => (
            <g key={n.id} onMouseEnter={() => setHovered(n.label)} onMouseLeave={() => setHovered(null)} onClick={() => setPinned(pinned === n.label ? null : n.label)} className="cursor-pointer">
              <rect x={588} y={s.outY[i]} width={52} height={Math.max(6, s.outH[i])} rx={8} fill={n.color} />
              <text x={648} y={s.outY[i] + s.outH[i] / 2 + 4} fontSize={12} fill="var(--color-text-primary)">{n.label} · <tspan fill="var(--color-text-tertiary)">{fmtMoney(n.value)}</tspan></text>
            </g>
          ))}
        </svg>
      </div>
      <div className="flex w-full items-center justify-between gap-2">
        <p className="min-h-4 text-caption-1-regular text-text-tertiary" aria-live="polite">{caption()}</p>
        <p className="flex shrink-0 gap-6 text-caption-1-medium text-text-tertiary">
          <span>Income</span>
          <span>Spending</span>
        </p>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* Spending donut card (h-329px): hover a segment or legend row.       */
/* ------------------------------------------------------------------ */

function SpendingDonutCard() {
  const [active, setActive] = useState<string | null>(null);
  const r = 62;
  const c = 2 * Math.PI * r;
  let offset = 0;
  const segments = DONUT.map((d) => {
    const len = (d.value / DONUT_TOTAL) * c;
    const seg = { ...d, len: Math.max(0, len - 2), offset };
    offset += len;
    return seg;
  });
  const current = active ? DONUT.find((d) => d.label === active) : null;
  return (
    <section className="flex h-auto min-h-[329px] w-full min-w-0 flex-col gap-4 rounded-2xl bg-background-secondary-default px-4 pt-4 pb-3 sm:h-[329px]">
      <div className="flex w-full items-start justify-between gap-3">
        <div className="flex min-w-0 flex-1 flex-col gap-0.5">
          <p className="w-full truncate text-body-medium text-text-secondary">Spending by category</p>
          <div className="flex w-full items-center gap-2">
            <p className="animate-number-fade text-title-1-medium whitespace-nowrap text-text-primary tabular-nums">{fmtMoney(DONUT_TOTAL)}</p>
            <Chip variant="bold" color="lime">+2.4%</Chip>
          </div>
        </div>
        <span className="shrink-0 text-body-2-medium text-text-tertiary">This month</span>
      </div>
      <div className="flex min-h-0 w-full flex-1 flex-col items-center gap-4 sm:flex-row">
        <div className="relative size-32 shrink-0 sm:size-36">
          <svg viewBox="0 0 160 160" className="size-full -rotate-90">
            <circle cx={80} cy={80} r={r} fill="none" stroke="var(--color-chart-track)" strokeWidth={26} />
            {segments.map((seg) => (
              <circle
                key={seg.label}
                cx={80}
                cy={80}
                r={r}
                fill="none"
                stroke={seg.color}
                strokeWidth={active === seg.label ? 30 : 26}
                strokeDasharray={`${seg.len} ${c - seg.len}`}
                strokeDashoffset={-seg.offset}
                opacity={!active || active === seg.label ? 1 : 0.35}
                onMouseEnter={() => setActive(seg.label)}
                onMouseLeave={() => setActive(null)}
                onClick={() => setActive(active === seg.label ? null : seg.label)}
                className="cursor-pointer transition-all duration-150"
              />
            ))}
          </svg>
          <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
            <p className="text-title-3-semibold text-text-primary tabular-nums">{current ? fmtMoney(current.value) : fmtMoney(DONUT_TOTAL)}</p>
            <p className="text-caption-1-regular text-text-tertiary">{current ? `${current.label} · ${Math.round((current.value / DONUT_TOTAL) * 100)}%` : "This month"}</p>
          </div>
        </div>
        <div className="flex w-full min-w-0 flex-1 flex-col">
          {DONUT.map((d) => (
            <button
              key={d.label}
              type="button"
              onMouseEnter={() => setActive(d.label)}
              onMouseLeave={() => setActive(null)}
              onClick={() => setActive(active === d.label ? null : d.label)}
              className={cx("flex w-full cursor-pointer items-center gap-2 rounded-lg px-1 py-1 text-start", active === d.label && "bg-background-secondary-hover")}
            >
              <span className="size-2.5 shrink-0 rounded-full" style={{ backgroundColor: d.color }} aria-hidden />
              <span className="min-w-0 flex-1 truncate text-body-2-regular text-text-primary">{d.label}</span>
              <span className="shrink-0 text-body-2-medium text-text-secondary tabular-nums">{fmtMoney(d.value)}</span>
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* Portfolio bubbles card (h-329px): Return vs Risk score.             */
/* ------------------------------------------------------------------ */

const BUBBLES = [
  { name: "Stocks", ret: 8, risk: 6.5, r: 30, color: "var(--color-chart-6)" },
  { name: "Funds", ret: 3, risk: 3.2, r: 20, color: "var(--color-chart-2)" },
  { name: "Crypto", ret: 12, risk: 9.1, r: 40, color: "var(--color-chart-3)" },
];

function PortfolioCard() {
  const [active, setActive] = useState<string | null>(null);
  const px = (risk: number) => 46 + (risk / 10) * 248;
  const py = (ret: number) => 172 - (ret / 14) * 150;
  const current = active ? BUBBLES.find((b) => b.name === active) : null;
  return (
    <section className="flex h-[329px] w-full min-w-0 flex-col gap-4 rounded-2xl bg-background-secondary-default px-4 pt-4 pb-3">
      <div className="flex w-full items-start justify-between gap-3">
        <div className="flex min-w-0 flex-1 flex-col gap-0.5">
          <p className="w-full truncate text-body-medium text-text-secondary">Portfolio</p>
          <div className="flex w-full items-center gap-2">
            <p className="text-title-1-medium whitespace-nowrap text-text-primary tabular-nums">7%</p>
            <Chip variant="bold" color="lime">+6.2%</Chip>
          </div>
          <p className="text-body-2-medium text-text-tertiary">Year to date</p>
        </div>
      </div>
      <div className="relative min-h-0 w-full flex-1">
        <svg viewBox="0 0 340 190" className="h-full w-full" role="img" aria-label="Portfolio bubbles: Stocks 8 percent, Funds 3 percent, Crypto 12 percent return by risk score">
          {[0, 5, 10, 14].map((v) => (
            <g key={v}>
              <line x1={40} x2={330} y1={py(v)} y2={py(v)} stroke="var(--color-chart-track)" strokeDasharray="3 3" />
              <text x={40} y={py(v) + 4} textAnchor="end" fontSize={10} fill="var(--color-text-tertiary)">{v}%</text>
            </g>
          ))}
          {[0, 2.5, 5, 7.5, 10].map((v) => (
            <text key={v} x={px(v)} y={184} textAnchor="middle" fontSize={10} fill="var(--color-text-tertiary)">{v}</text>
          ))}
          <text x={185} y={188} textAnchor="middle" fontSize={11} fill="var(--color-text-secondary)">Risk score</text>
          <text x={10} y={95} textAnchor="middle" fontSize={11} fill="var(--color-text-secondary)" transform="rotate(-90 10 95)">Return</text>
          {BUBBLES.map((b) => (
            <g
              key={b.name}
              opacity={!active || active === b.name ? 1 : 0.35}
              onMouseEnter={() => setActive(b.name)}
              onMouseLeave={() => setActive(null)}
              onClick={() => setActive(active === b.name ? null : b.name)}
              className="cursor-pointer transition-opacity duration-150"
            >
              <circle cx={px(b.risk)} cy={py(b.ret)} r={active === b.name ? b.r + 4 : b.r} fill={b.color} fillOpacity={0.85} stroke="var(--color-background-secondary-default)" strokeWidth={2} />
              <text x={px(b.risk)} y={py(b.ret) - 1} textAnchor="middle" fontSize={11} fontWeight={600} fill="#fff">{b.name}</text>
              <text x={px(b.risk)} y={py(b.ret) + 13} textAnchor="middle" fontSize={11} fill="#fff">{b.ret}%</text>
            </g>
          ))}
        </svg>
      </div>
      <p className="min-h-4 text-caption-1-regular text-text-tertiary" aria-live="polite">
        {current ? `${current.name} · Return ${current.ret}% · Risk ${current.risk}/10` : "Stocks 8% · Funds 3% · Crypto 12%"}
      </p>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* Daily spending heatmap card (h-329px): exact values, Less → More.    */
/* ------------------------------------------------------------------ */

function DailySpendingCard() {
  const [hovered, setHovered] = useState<{ day: string; week: number; value: number } | null>(null);
  const pct = (v: number) => Math.min(100, Math.round(7.5 + v * 0.75));
  return (
    <section className="flex h-[329px] w-full min-w-0 flex-col gap-4 rounded-2xl bg-background-secondary-default px-4 pt-4 pb-3">
      <div className="flex w-full items-start justify-between gap-3">
        <div className="flex min-w-0 flex-1 flex-col gap-0.5">
          <p className="w-full truncate text-body-medium text-text-secondary">Daily spending</p>
          <div className="flex w-full items-center gap-2">
            <p className="text-title-1-medium whitespace-nowrap text-text-primary tabular-nums">$4,390</p>
            <Chip variant="bold" color="lime">+3.6%</Chip>
          </div>
          <p className="text-body-2-medium text-text-tertiary">Last 12 weeks</p>
        </div>
      </div>
      <div className="flex min-h-0 w-full flex-1 flex-col justify-center gap-1">
        <div className="flex items-center gap-1">
          <span className="w-8 shrink-0" />
          {Array.from({ length: 12 }, (_, w) => (
            <span key={w} className="flex-1 text-center text-[10px] text-text-tertiary">W{w + 1}</span>
          ))}
        </div>
        {DAYS.map((day) => (
          <div key={day} className="flex items-center gap-1">
            <span className="w-8 shrink-0 text-end text-[11px] text-text-tertiary">{day}</span>
            {DAILY[day].map((v, w) => (
              <button
                key={w}
                type="button"
                aria-label={`${day} W${w + 1}: $${v}`}
                onMouseEnter={() => setHovered({ day, week: w + 1, value: v })}
                onMouseLeave={() => setHovered(null)}
                onFocus={() => setHovered({ day, week: w + 1, value: v })}
                onBlur={() => setHovered(null)}
                onClick={() => setHovered({ day, week: w + 1, value: v })}
                className="h-4 min-w-0 flex-1 rounded-[4px] outline-none transition-transform duration-100 focus-visible:ring-2 focus-visible:ring-border-focus-ring hover:scale-110"
                style={{ backgroundColor: `color-mix(in srgb, var(--color-chart-6) ${pct(v)}%, var(--color-chart-track))` }}
              />
            ))}
          </div>
        ))}
        <div className="flex w-full items-center justify-between pt-1">
          <p className="min-h-4 text-caption-1-regular text-text-tertiary" aria-live="polite">
            {hovered ? `${hovered.day} W${hovered.week}: $${hovered.value}` : "Hover a day for its spend"}
          </p>
          <p className="flex shrink-0 items-center gap-1 text-caption-1-regular text-text-tertiary">
            Less
            {[15, 40, 65, 90].map((p) => (
              <span key={p} className="inline-block size-2.5 rounded-[2px]" style={{ backgroundColor: `color-mix(in srgb, var(--color-chart-6) ${p}%, var(--color-chart-track))` }} />
            ))}
            More
          </p>
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* Add transaction modal (header Add + table row Edit).                 */
/* ------------------------------------------------------------------ */

function AddTransactionModal({
  open,
  onClose,
  initial,
  onSaved,
}: {
  open: boolean;
  onClose: () => void;
  initial?: Tx;
  onSaved: (tx: Omit<Tx, "id">) => void;
}) {
  const [name, setName] = useState("");
  const [account, setAccount] = useState<Account>("Checking");
  const [category, setCategory] = useState("Groceries");
  const [amount, setAmount] = useState("");
  const [date, setDate] = useState("Nov 07, 2026");
  useEffect(() => {
    if (open) {
      setName(initial?.name ?? "");
      setAccount(initial?.account ?? "Checking");
      setCategory(initial?.category ?? "Groceries");
      setAmount(initial ? String(initial.amount) : "");
      setDate(initial?.date ?? "Nov 07, 2026");
    }
  }, [open, initial]);
  const parsed = Number(amount.replace(/[^0-9.+-]/g, ""));
  const canSubmit = name.trim().length > 0 && amount.trim() !== "" && Number.isFinite(parsed) && parsed !== 0;
  return (
    <Modal open={open} onClose={onClose} title={initial ? "Edit transaction" : "Add transaction"}>
      <Input label="Transaction" placeholder="e.g. Whole Foods Market" value={name} onChange={(v) => setName(v)} />
      <div className="flex w-full gap-3">
        <div className="flex min-w-0 flex-1 flex-col gap-1">
          <span className="text-body-medium text-text-secondary">Account</span>
          <Select aria-label="Transaction account" selectedKey={account} onSelectionChange={(k) => setAccount(String(k) as Account)}>
            {ACCOUNTS.map((a) => (
              <SelectItem key={a} id={a} textValue={a}>{a}</SelectItem>
            ))}
          </Select>
        </div>
        <div className="flex min-w-0 flex-1 flex-col gap-1">
          <span className="text-body-medium text-text-secondary">Category</span>
          <Select aria-label="Transaction category" selectedKey={category} onSelectionChange={(k) => setCategory(String(k))}>
            {CATEGORIES.map((c) => (
              <SelectItem key={c} id={c} textValue={c}>{c}</SelectItem>
            ))}
          </Select>
        </div>
      </div>
      <div className="flex w-full gap-3">
        <div className="flex min-w-0 flex-1 flex-col gap-1">
          <Input label="Amount" placeholder="-135 or +6200" value={amount} onChange={(v) => setAmount(v)} />
        </div>
        <div className="flex min-w-0 flex-1 flex-col gap-1">
          <Input label="Date" placeholder="Nov 07, 2026" value={date} onChange={(v) => setDate(v)} />
        </div>
      </div>
      <div className="flex w-full justify-end gap-2">
        <Button variant="secondary" size="medium" onClick={onClose}>Cancel</Button>
        <Button
          variant="primary"
          size="medium"
          leadingIcon={RiAddFill}
          disabled={!canSubmit}
          onClick={() => {
            const ts = Date.parse(date);
            onSaved({
              name: name.trim(),
              account,
              category,
              date: date.trim() || "Nov 07, 2026",
              dateTs: Number.isFinite(ts) ? ts : new Date(2026, 10, 7).getTime(),
              amount: parsed,
            });
            onClose();
          }}
        >
          {initial ? "Save changes" : "Add transaction"}
        </Button>
      </div>
    </Modal>
  );
}

/* ------------------------------------------------------------------ */
/* Transactions table: 140 rows, 10 per page, filters + search + sort  */
/* + selection + editable account/category + row actions + pagination.  */
/* ------------------------------------------------------------------ */

type TxFilters = { account: string; category: string; amount: string; query: string };

function TxMoreMenu({ onAction }: { onAction: (label: string) => void }) {
  const [isOpen, setIsOpen] = useState(false);
  const items = [
    { icon: RiUserLine, label: "View details" },
    { icon: RiFileCopyLine, label: "Duplicate row" },
    { icon: RiEditLine, label: "Delete transaction" },
  ];
  return (
    <Dropdown isOpen={isOpen} onOpenChange={setIsOpen}>
      <DropdownTrigger
        aria-label="More actions"
        className={cx(
          "relative inline-flex size-8 shrink-0 cursor-pointer items-center justify-center rounded-2lg border border-border-button-default bg-background-primary-default text-foreground-icon-primary shadow-xs",
          "hover:border-border-button-hover hover:bg-background-primary-hover",
          isOpen && "border-border-button-active bg-background-primary-active",
        )}
      >
        <RiMore2Fill className="size-4 shrink-0" aria-hidden />
      </DropdownTrigger>
      <DropdownPopover aria-label="More actions" placement="bottom end" className="w-[220px] p-2">
        <DropdownGroup>
          {items.map(({ icon: Icon, label }) => (
            <DropdownItem key={label} onSelect={() => { setIsOpen(false); onAction(label); }} className="px-2 py-1.5">
              <Icon className="size-[18px] shrink-0 text-foreground-icon-secondary" aria-hidden />
              <span className="truncate text-body-medium whitespace-nowrap text-text-primary">{label}</span>
            </DropdownItem>
          ))}
        </DropdownGroup>
      </DropdownPopover>
    </Dropdown>
  );
}

function TransactionsTable({
  rows,
  setRows,
  filters,
  setFilters,
  onEdit,
  showToast,
}: {
  rows: Tx[];
  setRows: (rows: Tx[]) => void;
  filters: TxFilters;
  setFilters: (f: TxFilters) => void;
  onEdit: (t: Tx) => void;
  showToast: (msg: string) => void;
}) {
  const [page, setPage] = useState(0);
  const [sort, setSort] = useState<{ key: "name" | "dateTs" | "amount"; dir: "asc" | "desc" } | null>(null);
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const perPage = 10;

  useEffect(() => {
    setPage(0);
  }, [filters.account, filters.category, filters.amount, filters.query]);

  const filtered = useMemo(() => {
    const bucket = AMOUNT_BUCKETS.find((b) => b.id === filters.amount) ?? AMOUNT_BUCKETS[0];
    const q = filters.query.trim().toLowerCase();
    const list = rows.filter(
      (t) =>
        bucket.test(t.amount) &&
        (filters.account === "all" || t.account === filters.account) &&
        (filters.category === "all" || t.category === filters.category) &&
        (q === "" || t.name.toLowerCase().includes(q)),
    );
    if (sort) {
      list.sort((a, b) => {
        const av = a[sort.key];
        const bv = b[sort.key];
        const cmp = typeof av === "string" ? av.localeCompare(bv as string) : (av as number) - (bv as number);
        return sort.dir === "asc" ? cmp : -cmp;
      });
    }
    return list;
  }, [rows, filters, sort]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / perPage));
  const safePage = Math.min(page, totalPages - 1);
  const pageRows = filtered.slice(safePage * perPage, safePage * perPage + perPage);
  const pageSelected = pageRows.filter((r) => selected.has(r.id)).length;
  const allPageSelected = pageRows.length > 0 && pageSelected === pageRows.length;

  const updateRow = (id: string, patch: Partial<Tx>) => {
    setRows(rows.map((r) => (r.id === id ? { ...r, ...patch } : r)));
  };

  const toggleSort = (key: "name" | "dateTs" | "amount") => {
    setSort((s) => (s?.key === key ? { key, dir: s.dir === "asc" ? "desc" : "asc" } : { key, dir: "asc" }));
  };
  const sortMark = (key: "name" | "dateTs" | "amount") => (sort?.key === key ? (sort.dir === "asc" ? " ↑" : " ↓") : "");

  return (
    <section className="flex w-full flex-col rounded-2xl border border-border-table pt-2 pb-3">
      <div className="flex w-full flex-col items-start gap-3 px-3 py-1 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-col justify-center">
          <p className="text-body-medium whitespace-nowrap text-text-tertiary">Total Results</p>
          <p className="text-body-medium whitespace-nowrap text-text-primary">
            {filtered.length.toLocaleString()} transactions{selected.size > 0 ? ` · ${selected.size} selected` : ""}
          </p>
        </div>
        <div className="-mx-3 flex w-[calc(100%+1.5rem)] items-center gap-2.5 overflow-x-auto px-3 sm:mx-0 sm:w-auto sm:flex-wrap sm:justify-end sm:overflow-visible sm:px-0">
          <Select aria-label="Filter by account" className="shrink-0" popoverClassName="min-w-40" selectedKey={filters.account} onSelectionChange={(k) => setFilters({ ...filters, account: String(k) })}>
            <SelectItem id="all" textValue="All accounts">All accounts</SelectItem>
            {ACCOUNTS.map((a) => (
              <SelectItem key={a} id={a} textValue={a}>{a}</SelectItem>
            ))}
          </Select>
          <Select aria-label="Filter by category" className="shrink-0" popoverClassName="min-w-40" selectedKey={filters.category} onSelectionChange={(k) => setFilters({ ...filters, category: String(k) })}>
            <SelectItem id="all" textValue="All categories">All categories</SelectItem>
            {CATEGORIES.map((c) => (
              <SelectItem key={c} id={c} textValue={c}>{c}</SelectItem>
            ))}
          </Select>
          <Select aria-label="Filter by amount" className="shrink-0" popoverClassName="min-w-40" selectedKey={filters.amount} onSelectionChange={(k) => setFilters({ ...filters, amount: String(k) })}>
            {AMOUNT_BUCKETS.map((b) => (
              <SelectItem key={b.id} id={b.id} textValue={b.label}>{b.label}</SelectItem>
            ))}
          </Select>
          <InputBase
            aria-label="Search transactions"
            placeholder="Search"
            leadingIcon={RiSearchLine}
            value={filters.query}
            onChange={(e) => setFilters({ ...filters, query: e.target.value })}
            fieldClassName="min-w-[153px] flex-1 rounded-full bg-background-secondary-default sm:w-[153px] sm:min-w-0 sm:flex-none"
            className="text-body-medium"
          />
        </div>
      </div>

      <div className="mt-2 w-full overflow-x-auto">
        <div className="min-w-[980px]">
          <div className="flex w-full items-center border-b border-border-table px-3 py-2 text-body-2-medium text-text-tertiary">
            <span className="flex w-10 shrink-0 items-center">
              <Checkbox
                aria-label="Select all transactions on this page"
                isSelected={allPageSelected}
                isIndeterminate={pageSelected > 0 && !allPageSelected}
                onChange={(v) => {
                  setSelected((prev) => {
                    const next = new Set(prev);
                    pageRows.forEach((r) => {
                      if (v) next.add(r.id);
                      else next.delete(r.id);
                    });
                    return next;
                  });
                }}
              />
            </span>
            <button type="button" onClick={() => toggleSort("name")} className="w-[240px] shrink-0 cursor-pointer text-start hover:text-text-primary">Transaction{sortMark("name")}</button>
            <span className="w-[150px] shrink-0">Account</span>
            <span className="w-[170px] shrink-0">Category</span>
            <button type="button" onClick={() => toggleSort("dateTs")} className="w-[140px] shrink-0 cursor-pointer text-start hover:text-text-primary">Date{sortMark("dateTs")}</button>
            <button type="button" onClick={() => toggleSort("amount")} className="w-[120px] shrink-0 cursor-pointer text-start hover:text-text-primary">Amount{sortMark("amount")}</button>
            <span className="w-[110px] shrink-0">Actions</span>
          </div>
          {pageRows.map((t) => (
            <div key={t.id} className={cx("flex w-full items-center border-b border-separator-border px-3 py-2.5 last:border-b-0", selected.has(t.id) && "bg-background-secondary-hover")}>
              <span className="flex w-10 shrink-0 items-center">
                <Checkbox
                  aria-label={`Select ${t.name}`}
                  isSelected={selected.has(t.id)}
                  onChange={(v) => {
                    setSelected((prev) => {
                      const next = new Set(prev);
                      if (v) next.add(t.id);
                      else next.delete(t.id);
                      return next;
                    });
                  }}
                />
              </span>
              <button type="button" onClick={() => onEdit(t)} className="flex w-[240px] min-w-0 shrink-0 cursor-pointer items-center text-start" aria-label={`Edit ${t.name}`}>
                <span className="truncate text-body-medium text-text-primary">{t.name}</span>
              </button>
              <span className="w-[150px] shrink-0 pe-3">
                <Select aria-label={`Account for ${t.name}`} size="sm" className="w-[128px]" selectedKey={t.account} onSelectionChange={(k) => updateRow(t.id, { account: String(k) as Account })}>
                  {ACCOUNTS.map((a) => (
                    <SelectItem key={a} id={a} textValue={a}>{a}</SelectItem>
                  ))}
                </Select>
              </span>
              <span className="w-[170px] shrink-0 pe-3">
                <Select aria-label={`Category for ${t.name}`} size="sm" className="w-[148px]" selectedKey={t.category} onSelectionChange={(k) => updateRow(t.id, { category: String(k) })}>
                  {CATEGORIES.map((c) => (
                    <SelectItem key={c} id={c} textValue={c}>{c}</SelectItem>
                  ))}
                </Select>
              </span>
              <span className="w-[140px] shrink-0 text-body-medium whitespace-nowrap text-text-secondary tabular-nums">{t.date}</span>
              <span className="w-[120px] shrink-0">
                {t.amount > 0 ? (
                  <span className="inline-flex items-center justify-center rounded-md px-1.5 py-0.5 text-body-medium whitespace-nowrap bg-status-lime-background text-status-lime-text tabular-nums">{fmtSigned(t.amount)}</span>
                ) : (
                  <span className="text-body-medium whitespace-nowrap text-text-primary tabular-nums">{fmtSigned(t.amount)}</span>
                )}
              </span>
              <span className="flex w-[110px] shrink-0 items-center gap-1.5">
                <IconButton icon={RiEditLine} size="small" aria-label={`Edit ${t.name}`} onClick={() => onEdit(t)} />
                <TxMoreMenu
                  onAction={(label) => {
                    if (label === "Duplicate row") {
                      const copy: Tx = { ...t, id: `copy-${t.id}-${Date.now()}` };
                      setRows([copy, ...rows]);
                      showToast(`Duplicated ${t.name}`);
                    } else if (label === "Delete transaction") {
                      setRows(rows.filter((r) => r.id !== t.id));
                      showToast(`Deleted ${t.name}`);
                    } else {
                      showToast(`${label}: ${t.name}`);
                    }
                  }}
                />
              </span>
            </div>
          ))}
          {pageRows.length === 0 && (
            <p className="px-3 py-8 text-center text-body-medium text-text-tertiary">No transactions match these filters.</p>
          )}
        </div>
      </div>

      <div className="flex w-full flex-col items-center gap-3 px-3 pt-3 sm:flex-row sm:justify-between">
        <p className="text-body-2-medium text-text-tertiary">
          Page {safePage + 1} of {totalPages} · {filtered.length.toLocaleString()} transactions
        </p>
        <Pagination page={safePage + 1} totalPages={totalPages} onChange={(p) => setPage(p - 1)} aria-label="Transactions pagination" />
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* Page.                                                               */
/* ------------------------------------------------------------------ */

export default function FinanceTemplatePage() {
  const [transactions, setTransactions] = useState<Tx[]>(() => buildTransactions());
  const [filters, setFilters] = useState<TxFilters>({ account: "all", category: "all", amount: "all", query: "" });
  const [filterOpen, setFilterOpen] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<Tx | undefined>(undefined);
  const [toast, setToast] = useState<string | null>(null);

  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(() => setToast(null), 3500);
    return () => clearTimeout(t);
  }, [toast]);

  const filterRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!filterOpen) return;
    const onDown = (e: MouseEvent) => {
      if (filterRef.current && !filterRef.current.contains(e.target as Node)) setFilterOpen(false);
    };
    document.addEventListener("mousedown", onDown);
    return () => document.removeEventListener("mousedown", onDown);
  }, [filterOpen]);

  const openAdd = (tx?: Tx) => {
    setEditing(tx);
    setModalOpen(true);
  };

  return (
    <TemplateShell
      title="Finance"
      heading="Finance"
      icon={RiBankLine}
      selected="finance"
      actions={
        <>
          <NotificationBell />
          <div className="relative" ref={filterRef}>
            <Button variant="secondary" size="medium" leadingIcon={RiFilter3Fill} aria-expanded={filterOpen} onClick={() => setFilterOpen((o) => !o)}>
              Filters
            </Button>
            {filterOpen && (
                <div className="absolute right-0 z-40 mt-2 flex w-[280px] flex-col gap-3 rounded-2xl border border-border-button-default bg-background-primary-default p-3 shadow-lg">
                  <p className="text-body-medium text-text-primary">Filter transactions</p>
                  <Select aria-label="Filter by account" selectedKey={filters.account} onSelectionChange={(k) => setFilters({ ...filters, account: String(k) })}>
                    <SelectItem id="all" textValue="All accounts">All accounts</SelectItem>
                    {ACCOUNTS.map((a) => (
                      <SelectItem key={a} id={a} textValue={a}>{a}</SelectItem>
                    ))}
                  </Select>
                  <Select aria-label="Filter by category" selectedKey={filters.category} onSelectionChange={(k) => setFilters({ ...filters, category: String(k) })}>
                    <SelectItem id="all" textValue="All categories">All categories</SelectItem>
                    {CATEGORIES.map((c) => (
                      <SelectItem key={c} id={c} textValue={c}>{c}</SelectItem>
                    ))}
                  </Select>
                  <Select aria-label="Filter by amount" selectedKey={filters.amount} onSelectionChange={(k) => setFilters({ ...filters, amount: String(k) })}>
                    {AMOUNT_BUCKETS.map((b) => (
                      <SelectItem key={b.id} id={b.id} textValue={b.label}>{b.label}</SelectItem>
                    ))}
                  </Select>
                  <div className="flex justify-end gap-2">
                    <Button variant="secondary" size="medium" onClick={() => { setFilters({ account: "all", category: "all", amount: "all", query: "" }); setFilterOpen(false); }}>
                      Clear
                    </Button>
                    <Button variant="primary" size="medium" onClick={() => setFilterOpen(false)}>Done</Button>
                  </div>
                </div>
            )}
          </div>
          <Button variant="primary" size="medium" leadingIcon={RiAddFill} onClick={() => openAdd()}>
            Add transaction
          </Button>
        </>
      }
    >
      <StatCards variant="plain" stats={FINANCE_STATS} />

      <CashFlowCard />

      <div className="grid w-full grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
        <SpendingDonutCard />
        <PortfolioCard />
        <DailySpendingCard />
      </div>

      <TransactionsTable
        rows={transactions}
        setRows={setTransactions}
        filters={filters}
        setFilters={setFilters}
        onEdit={(t) => openAdd(t)}
        showToast={setToast}
      />

      <AddTransactionModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        initial={editing}
        onSaved={(tx) => {
          if (editing) {
            setTransactions(transactions.map((r) => (r.id === editing.id ? { ...tx, id: editing.id } : r)));
            setToast(`Updated ${tx.name}`);
          } else {
            setTransactions([{ ...tx, id: `new-${Date.now()}` }, ...transactions]);
            setToast(`Added ${tx.name} (${fmtSigned(tx.amount)})`);
          }
        }}
      />
      <Toast message={toast} />
    </TemplateShell>
  );
}
