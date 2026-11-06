"use client";

import { useId, useMemo, useState } from "react";
import {
  RiAddFill,
  RiAdvertisementLine,
  RiArrowDownSLine,
  RiArrowUpSLine,
  RiCloseLine,
  RiCursorLine,
  RiFilter3Fill,
  RiMegaphoneLine,
  RiMoneyDollarCircleLine,
  RiMoreFill,
  RiMouseLine,
} from "@remixicon/react";
import {
  Area,
  AreaChart,
  Bar,
  CartesianGrid,
  ComposedChart,
  Line,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import { TemplateShell } from "@/components/application/template-shell/template-shell";
import { NotificationBell } from "@/components/application/app-shell/notification-bell";
import { StatCards, type Stat } from "@/components/application/dashboard/stat-cards";
import { Button } from "@/components/base/buttons/button";
import { IconButton } from "@/components/base/buttons/icon-button";
import { Chip } from "@/components/base/badges/chip";
import { cx } from "@/utils/cx";

/**
 * Marketing template replica, 1:1 functional rebuild.
 * Official: boardui.com/templates/marketing — "Marketing", Campaign KPI,
 * acquisition funnel, spend by channel, sessions, ad spend vs ROAS,
 * visitors, and the Campaigns data table.
 *
 * Values below (KPIs, funnel, channel spend, session shares, chart totals,
 * the first 10 table rows, pagination) are taken from the official page's
 * server-rendered HTML. Monthly chart series are reconstructed to sum to
 * the official totals ($217.7K ad spend, 134,400 visitors); the table is
 * extended to the official 80 campaigns (10 exact rows + 70 generated).
 * Built only from free BoardUI components + mock data. Not the official
 * Pro source.
 */

const MARKETING_STATS: Stat[] = [
  { icon: RiMoneyDollarCircleLine, label: "Ad spend", value: "$24,380", delta: "+8.4%", deltaColor: "lime" },
  { icon: RiCursorLine, label: "Impressions", value: "1.94M", delta: "+12.6%", deltaColor: "lime" },
  { icon: RiMouseLine, label: "Conversions", value: "1,286", delta: "+5.2%", deltaColor: "lime" },
  { icon: RiAdvertisementLine, label: "Cost per click", value: "$1.24", delta: "-3.1%", deltaColor: "rose" },
];

const FUNNEL = [
  { label: "Visits", value: "96.4K", pct: 100 },
  { label: "Sign-ups", value: "38.6K", pct: 40 },
  { label: "Trials", value: "14.1K", pct: 14.6 },
  { label: "Customers", value: "5.2K", pct: 5.4 },
];

const CHANNEL_SPEND = [
  { name: "Paid search", value: 11400, color: "var(--color-chart-6)", dot: "bg-chart-6" },
  { name: "Paid social", value: 7620, color: "var(--color-chart-5)", dot: "bg-chart-5" },
  { name: "Email", value: 3180, color: "var(--color-chart-1)", dot: "bg-chart-1" },
  { name: "Affiliates", value: 2680, color: "var(--color-chart-2)", dot: "bg-chart-2" },
];
const CHANNEL_TOTAL = 24880;

const SESSION_CHANNELS = [
  { name: "Google Ads", pct: 39, color: "bg-chart-6" },
  { name: "Meta", pct: 25, color: "bg-chart-5" },
  { name: "X Ads", pct: 14, color: "bg-chart-1" },
  { name: "LinkedIn", pct: 8, color: "bg-chart-3" },
  { name: "Email", pct: 7, color: "bg-chart-2" },
];
const SESSION_CAMPAIGNS = [
  { name: "Founder story video · Global", pct: 31 },
  { name: "Holiday gift guide · Global", pct: 24 },
  { name: "Newsletter promo · US", pct: 18 },
  { name: "Webinar signups · UK", pct: 15 },
  { name: "Spring launch · UK", pct: 12 },
];
const SESSION_PAGES = [
  { name: "/pricing", pct: 32 },
  { name: "/features", pct: 24 },
  { name: "/blog", pct: 18 },
  { name: "/", pct: 14 },
  { name: "/templates", pct: 12 },
];

const ROAS_MONTHS = [
  { label: "Jan", spend: 12.1, roas: 3.1 },
  { label: "Feb", spend: 13.4, roas: 3.3 },
  { label: "Mar", spend: 15.2, roas: 3.4 },
  { label: "Apr", spend: 16.8, roas: 3.5 },
  { label: "May", spend: 18.3, roas: 3.6 },
  { label: "Jun", spend: 19.6, roas: 3.8 },
  { label: "Jul", spend: 18.9, roas: 3.5 },
  { label: "Aug", spend: 20.4, roas: 3.7 },
  { label: "Sep", spend: 21.8, roas: 3.9 },
  { label: "Oct", spend: 19.5, roas: 3.6 },
  { label: "Nov", spend: 20.9, roas: 3.8 },
  { label: "Dec", spend: 20.8, roas: 4.0 },
];
const VISITOR_MONTHS = [
  { label: "Jan", organic: 5200, paid: 2600, social: 1500 },
  { label: "Feb", organic: 5600, paid: 2800, social: 1600 },
  { label: "Mar", organic: 6100, paid: 3100, social: 1800 },
  { label: "Apr", organic: 6400, paid: 3300, social: 1900 },
  { label: "May", organic: 6800, paid: 3500, social: 2000 },
  { label: "Jun", organic: 6600, paid: 3400, social: 1900 },
  { label: "Jul", organic: 6300, paid: 3200, social: 1800 },
  { label: "Aug", organic: 6500, paid: 3300, social: 1900 },
  { label: "Sep", organic: 6700, paid: 3400, social: 2000 },
  { label: "Oct", organic: 6400, paid: 3300, social: 1900 },
  { label: "Nov", organic: 6200, paid: 3200, social: 1800 },
  { label: "Dec", organic: 5700, paid: 3400, social: 1300 },
];

type Delivery = "Active" | "Paused" | "Draft";
type Campaign = {
  id: number;
  name: string;
  channel: string;
  delivery: Delivery;
  objective: string;
  updated: string;
  sortDate: string;
  spend: number;
};

const CHANNELS = ["Google Ads", "Meta", "X Ads", "LinkedIn", "Email", "Referral"];
const OBJECTIVES = ["Conversions", "Traffic", "Awareness", "Leads", "Retargeting"];

const EXACT_CAMPAIGNS: Campaign[] = [
  { id: 1, name: "Founder story video · Global", channel: "Meta", delivery: "Active", objective: "Awareness", updated: "Jul 22, 2026", sortDate: "2026-07-22", spend: 34800 },
  { id: 2, name: "Holiday gift guide · Global", channel: "Google Ads", delivery: "Paused", objective: "Traffic", updated: "Sep 16, 2026", sortDate: "2026-09-16", spend: 30884 },
  { id: 3, name: "Founder story video · US", channel: "Meta", delivery: "Active", objective: "Conversions", updated: "Dec 24, 2026", sortDate: "2026-12-24", spend: 1330 },
  { id: 4, name: "Newsletter promo · EU", channel: "Email", delivery: "Paused", objective: "Leads", updated: "Dec 08, 2026", sortDate: "2026-12-08", spend: 34445 },
  { id: 5, name: "Spring launch · UK", channel: "X Ads", delivery: "Draft", objective: "Awareness", updated: "Oct 04, 2026", sortDate: "2026-10-04", spend: 0 },
  { id: 6, name: "Brand search · US", channel: "Google Ads", delivery: "Paused", objective: "Leads", updated: "Mar 23, 2026", sortDate: "2026-03-23", spend: 19116 },
  { id: 7, name: "Cart retargeting · UK", channel: "LinkedIn", delivery: "Draft", objective: "Awareness", updated: "Aug 21, 2026", sortDate: "2026-08-21", spend: 0 },
  { id: 8, name: "Newsletter promo · US", channel: "Email", delivery: "Active", objective: "Awareness", updated: "Oct 24, 2026", sortDate: "2026-10-24", spend: 28095 },
  { id: 9, name: "Webinar signups · UK", channel: "LinkedIn", delivery: "Active", objective: "Awareness", updated: "Mar 08, 2026", sortDate: "2026-03-08", spend: 25305 },
  { id: 10, name: "Case study promo · UK", channel: "Referral", delivery: "Active", objective: "Retargeting", updated: "Mar 01, 2026", sortDate: "2026-03-01", spend: 333 },
];

const GENERATED_NAMES = [
  "Product demo reel", "Black Friday teaser", "Onboarding email drip", "Feature announcement",
  "Customer story", "Free trial push", "Seasonal sale", "Referral boost", "App install drive",
  "Community spotlight", "Pricing page push", "Template showcase", "Partner webinar", "Win-back email",
];
const GENERATED_REGIONS = ["Global", "US", "UK", "EU", "CA", "AU"];
const MONTH_NAMES = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

function buildCampaigns(): Campaign[] {
  const rows = [...EXACT_CAMPAIGNS];
  for (let i = 11; i <= 80; i++) {
    const seed = i * 7919;
    const name = GENERATED_NAMES[(seed >> 3) % GENERATED_NAMES.length];
    const region = GENERATED_REGIONS[seed % GENERATED_REGIONS.length];
    const month = seed % 11; // Jan–Nov only: generated rows stay in the past
    const day = (seed % 27) + 1;
    rows.push({
      id: i,
      name: `${name} · ${region}`,
      channel: CHANNELS[seed % CHANNELS.length],
      delivery: (["Active", "Paused", "Draft"] as Delivery[])[seed % 3],
      objective: OBJECTIVES[(seed >> 2) % OBJECTIVES.length],
      updated: `${MONTH_NAMES[month]} ${String(day).padStart(2, "0")}, 2026`,
      sortDate: `2026-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`,
      spend: seed % 36000,
    });
  }
  return rows;
}

const DELIVERY_STYLE: Record<Delivery, string> = {
  Active: "bg-status-lime-background text-status-lime-text",
  Paused: "bg-status-yellow-background text-status-yellow-text",
  Draft: "bg-background-tertiary-default text-text-secondary",
};

const inputClass =
  "w-full rounded-xl border border-border-button-default bg-background-primary-default px-2.5 py-2 text-body-medium text-text-primary outline-none focus-visible:ring-2 focus-visible:ring-border-focus-ring";
const labelClass = "text-caption-1-semibold text-text-tertiary uppercase tracking-[0.06em]";
const cardClass = "flex min-w-0 flex-col gap-4 rounded-2xl bg-background-secondary-default p-4";

function formatMoney(n: number) {
  return `$${n.toLocaleString("en-US")}`;
}

function Donut({ active, onSelect }: { active: string | null; onSelect: (name: string | null) => void }) {
  const r = 64;
  const circumference = 2 * Math.PI * r;
  let offset = 0;
  return (
    <div className="relative mx-auto size-40 shrink-0">
      <svg viewBox="0 0 160 160" className="size-full -rotate-90" role="img" aria-label="Spend by channel chart">
        <circle cx="80" cy="80" r={r} fill="none" stroke="var(--color-chart-track)" strokeWidth="22" />
        {CHANNEL_SPEND.map((channel) => {
          const frac = channel.value / CHANNEL_TOTAL;
          const dash = frac * circumference;
          const el = (
            <circle
              key={channel.name}
              cx="80"
              cy="80"
              r={r}
              fill="none"
              stroke={channel.color}
              strokeWidth={active === channel.name ? 26 : 22}
              strokeDasharray={`${Math.max(dash - 2, 1)} ${circumference - Math.max(dash - 2, 1)}`}
              strokeDashoffset={-offset}
              opacity={active && active !== channel.name ? 0.3 : 1}
              className="cursor-pointer transition-opacity"
              onClick={() => onSelect(active === channel.name ? null : channel.name)}
            >
              <title>{`${channel.name}: ${formatMoney(channel.value)}`}</title>
            </circle>
          );
          offset += dash;
          return el;
        })}
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <p className="text-title-2-medium text-text-primary tabular-nums">46%</p>
        <p className="text-body-2-regular text-text-tertiary">Paid search</p>
      </div>
    </div>
  );
}

function BarList({ rows }: { rows: { name: string; pct: number; color?: string }[] }) {
  return (
    <div className="flex w-full flex-col gap-3">
      {rows.map((row) => (
        <div key={row.name} className="flex w-full flex-col gap-1.5">
          <div className="flex w-full items-center justify-between">
            <p className="text-body-medium text-text-primary">{row.name}</p>
            <p className="text-body-medium text-text-secondary tabular-nums">{row.pct}%</p>
          </div>
          <div className="h-2 w-full overflow-hidden rounded-full bg-background-tertiary-default">
            <div className={cx("h-full rounded-full", row.color ?? "bg-chart-2-active")} style={{ width: `${row.pct}%` }} />
          </div>
        </div>
      ))}
    </div>
  );
}

export default function MarketingTemplatePage() {
  const [campaigns, setCampaigns] = useState<Campaign[]>(buildCampaigns);
  const [channelFilter, setChannelFilter] = useState("All channels");
  const [objectiveFilter, setObjectiveFilter] = useState("All objectives");
  const [spendFilter, setSpendFilter] = useState("All spend");
  const [filtersOpen, setFiltersOpen] = useState(true);
  const [sortKey, setSortKey] = useState<"name" | "date" | "spend">("date");
  const [sortDir, setSortDir] = useState<"asc" | "desc">("desc");
  const [page, setPage] = useState(1);
  const [sessionTab, setSessionTab] = useState<"Channels" | "Campaigns" | "Landing pages">("Channels");
  const [activeChannel, setActiveChannel] = useState<string | null>(null);
  const [roasHover, setRoasHover] = useState<number | null>(null);
  const [visitorHover, setVisitorHover] = useState<number | null>(null);
  const [actionFor, setActionFor] = useState<number | null>(null);
  const [editor, setEditor] = useState<{ mode: "new" | "edit"; campaign: Campaign } | null>(null);

  const gradientId = useId();
  const PAGE_SIZE = 10;

  const filtered = useMemo(() => {
    const rows = campaigns.filter((c) => {
      if (channelFilter !== "All channels" && c.channel !== channelFilter) return false;
      if (objectiveFilter !== "All objectives" && c.objective !== objectiveFilter) return false;
      if (spendFilter === "Under $1,000" && c.spend >= 1000) return false;
      if (spendFilter === "$1,000 – $5,000" && (c.spend < 1000 || c.spend > 5000)) return false;
      if (spendFilter === "$5,000 – $20,000" && (c.spend < 5000 || c.spend > 20000)) return false;
      if (spendFilter === "Over $20,000" && c.spend <= 20000) return false;
      return true;
    });
    rows.sort((a, b) => {
      const cmp =
        sortKey === "name"
          ? a.name.localeCompare(b.name)
          : sortKey === "date"
            ? a.sortDate.localeCompare(b.sortDate)
            : a.spend - b.spend;
      return sortDir === "asc" ? cmp : -cmp;
    });
    return rows;
  }, [campaigns, channelFilter, objectiveFilter, spendFilter, sortKey, sortDir]);

  const pageCount = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const safePage = Math.min(page, pageCount);
  const pageRows = filtered.slice((safePage - 1) * PAGE_SIZE, safePage * PAGE_SIZE);

  const roasPoint = roasHover !== null ? ROAS_MONTHS[roasHover] : null;
  const visitorPoint = visitorHover !== null ? VISITOR_MONTHS[visitorHover] : null;
  const visitorTotal = visitorPoint
    ? visitorPoint.organic + visitorPoint.paid + visitorPoint.social
    : 134400;

  function toggleSort(key: "name" | "date" | "spend") {
    if (sortKey === key) {
      setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    } else {
      setSortKey(key);
      setSortDir(key === "name" ? "asc" : "desc");
    }
    setPage(1);
  }

  function setDelivery(id: number, delivery: Delivery) {
    setCampaigns((prev) => prev.map((c) => (c.id === id ? { ...c, delivery } : c)));
  }

  function deleteCampaign(id: number) {
    setCampaigns((prev) => prev.filter((c) => c.id !== id));
    setActionFor(null);
  }

  function duplicateCampaign(campaign: Campaign) {
    const copy: Campaign = {
      ...campaign,
      id: Math.max(...campaigns.map((c) => c.id)) + 1,
      name: `${campaign.name} (copy)`,
      delivery: "Draft",
    };
    setCampaigns((prev) => [copy, ...prev]);
    setActionFor(null);
    setPage(1);
  }

  function saveEditor(draft: Campaign) {
    if (editor?.mode === "new") {
      setCampaigns((prev) => [{ ...draft, id: Math.max(...prev.map((c) => c.id)) + 1 }, ...prev]);
    } else {
      setCampaigns((prev) => prev.map((c) => (c.id === draft.id ? draft : c)));
    }
    setEditor(null);
    setPage(1);
  }

  function pageNumbers(): (number | "…")[] {
    if (pageCount <= 7) return Array.from({ length: pageCount }, (_, i) => i + 1);
    const pages = new Set<number>([1, 2, 3, 4, 5, pageCount]);
    if (safePage > 5) pages.add(safePage);
    const sorted = [...pages].sort((a, b) => a - b);
    const out: (number | "…")[] = [];
    sorted.forEach((p, i) => {
      if (i > 0 && p - sorted[i - 1] > 1) out.push("…");
      out.push(p);
    });
    return out;
  }

  const sortIcon = (key: "name" | "date" | "spend") =>
    sortKey !== key ? null : sortDir === "asc" ? (
      <RiArrowUpSLine className="size-4" aria-hidden />
    ) : (
      <RiArrowDownSLine className="size-4" aria-hidden />
    );

  return (
    <TemplateShell
      title="Marketing"
      heading="Marketing"
      icon={RiMegaphoneLine}
      selected="marketing"
      actions={
        <>
          <NotificationBell />
          <Button
            variant="secondary"
            size="medium"
            leadingIcon={RiFilter3Fill}
            aria-pressed={filtersOpen}
            onClick={() => setFiltersOpen((open) => !open)}
          >
            Filters
          </Button>
          <Button
            variant="primary"
            size="medium"
            leadingIcon={RiAddFill}
            onClick={() =>
              setEditor({
                mode: "new",
                campaign: {
                  id: 0,
                  name: "",
                  channel: "Google Ads",
                  delivery: "Draft",
                  objective: "Awareness",
                  updated: "Nov 06, 2026",
                  sortDate: "2026-11-06",
                  spend: 0,
                },
              })
            }
          >
            New campaign
          </Button>
        </>
      }
    >
      <StatCards variant="plain" stats={MARKETING_STATS} />

      {/* Row 2: funnel / spend by channel / sessions */}
      <div className="grid w-full grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
        <section className={cardClass} aria-label="Acquisition funnel">
          <div className="flex w-full flex-col gap-0.5">
            <p className="text-body-medium text-text-secondary">Acquisition funnel</p>
            <div className="flex items-center gap-2">
              <p className="text-title-1-medium whitespace-nowrap text-text-primary tabular-nums">96.4K</p>
              <Chip variant="bold" color="lime">+5.8%</Chip>
            </div>
            <p className="text-body-2-medium text-text-tertiary">Last 30 days</p>
          </div>
          <div className="flex w-full flex-col gap-3">
            {FUNNEL.map((step, i) => (
              <div key={step.label}>
                <div className="flex w-full flex-col gap-1.5">
                  <div className="flex w-full items-center justify-between">
                    <p className="text-body-medium text-text-primary">{step.label}</p>
                    <p className="text-body-medium text-text-secondary tabular-nums">{step.value}</p>
                  </div>
                  <div className="h-2.5 w-full overflow-hidden rounded-full bg-background-tertiary-default">
                    <div className="h-full rounded-full bg-chart-2-active transition-[width] duration-500" style={{ width: `${step.pct}%` }} />
                  </div>
                </div>
                {i < FUNNEL.length - 1 && (
                  <p className="mt-1.5 ps-1 text-body-2-regular text-text-tertiary tabular-nums">
                    ↓ {((FUNNEL[i + 1].pct / step.pct) * 100).toFixed(1)}% convert
                  </p>
                )}
              </div>
            ))}
          </div>
        </section>

        <section className={cardClass} aria-label="Spend by channel">
          <div className="flex w-full flex-col gap-0.5">
            <p className="text-body-medium text-text-secondary">Spend by channel</p>
            <div className="flex items-center gap-2">
              <p className="text-title-1-medium whitespace-nowrap text-text-primary tabular-nums">$24,880</p>
              <Chip variant="bold" color="lime">+8.4%</Chip>
            </div>
            <p className="text-body-2-medium text-text-tertiary">Last 30 days</p>
          </div>
          <Donut active={activeChannel} onSelect={setActiveChannel} />
          <div className="flex w-full flex-col gap-1">
            {CHANNEL_SPEND.map((channel) => (
              <button
                key={channel.name}
                type="button"
                aria-pressed={activeChannel === channel.name}
                onClick={() => setActiveChannel(activeChannel === channel.name ? null : channel.name)}
                className={cx(
                  "flex w-full cursor-pointer items-center justify-between rounded-lg px-2 py-1.5 text-start transition-colors hover:bg-background-tertiary-default",
                  activeChannel === channel.name && "bg-background-tertiary-default",
                )}
              >
                <span className="flex items-center gap-2 text-body-medium text-text-primary">
                  <span className={cx("size-2 rounded-full", channel.dot)} aria-hidden />
                  {channel.name}
                </span>
                <span className="text-body-medium text-text-secondary tabular-nums">
                  {formatMoney(channel.value)}
                  <span className="ms-2 text-text-tertiary">{Math.round((channel.value / CHANNEL_TOTAL) * 100)}%</span>
                </span>
              </button>
            ))}
          </div>
        </section>

        <section className={cardClass} aria-label="Sessions">
          <div className="flex w-full items-center justify-between gap-2">
            <p className="text-body-medium text-text-secondary">Sessions</p>
            <div className="flex rounded-full bg-background-tertiary-default p-0.5" role="tablist" aria-label="Sessions breakdown">
              {(["Channels", "Campaigns", "Landing pages"] as const).map((tab) => (
                <button
                  key={tab}
                  type="button"
                  role="tab"
                  aria-selected={sessionTab === tab}
                  onClick={() => setSessionTab(tab)}
                  className={cx(
                    "cursor-pointer rounded-full px-2.5 py-1 text-body-2-medium whitespace-nowrap transition-colors",
                    sessionTab === tab ? "bg-background-primary-default text-text-primary shadow-xs" : "text-text-secondary hover:text-text-primary",
                  )}
                >
                  {tab}
                </button>
              ))}
            </div>
          </div>
          {sessionTab === "Channels" && <BarList rows={SESSION_CHANNELS} />}
          {sessionTab === "Campaigns" && <BarList rows={SESSION_CAMPAIGNS.map((r) => ({ ...r, color: "bg-chart-5-active" }))} />}
          {sessionTab === "Landing pages" && <BarList rows={SESSION_PAGES.map((r) => ({ ...r, color: "bg-chart-4-active" }))} />}
          <p className="text-body-2-regular text-text-tertiary">
            {sessionTab === "Channels" ? "Share of sessions by acquisition channel." : sessionTab === "Campaigns" ? "Share of sessions by campaign." : "Share of sessions by landing page."}
          </p>
        </section>
      </div>

      {/* Row 3: ad spend vs ROAS / visitors */}
      <div className="grid w-full grid-cols-1 gap-4 lg:grid-cols-2">
        <section className="flex h-[344px] min-w-0 flex-col gap-6 rounded-2xl bg-background-secondary-default px-4 pt-4 pb-3" aria-label="Ad spend versus ROAS">
          <div className="flex w-full flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
            <div className="flex min-w-0 flex-col gap-0.5">
              <p className="w-full text-body-medium text-text-secondary">
                {roasPoint ? `${roasPoint.label} 2026` : "Ad spend · ROAS 3.6x"}
              </p>
              <div className="flex w-full items-center gap-2">
                <p className="text-title-1-medium whitespace-nowrap text-text-primary tabular-nums">
                  {roasPoint ? `$${roasPoint.spend.toFixed(1)}K` : "$217.7K"}
                </p>
                <Chip variant="bold" color="lime">{roasPoint ? `${roasPoint.roas.toFixed(1)}x ROAS` : "+9.4%"}</Chip>
              </div>
              <p className="text-body-2-medium text-text-tertiary tabular-nums">This year</p>
            </div>
            <dl className="flex shrink-0 items-center gap-4 text-body-2-medium text-text-secondary">
              <div className="flex items-center gap-1.5">
                <span className="size-2 rounded-full bg-chart-6" aria-hidden />
                <dt>Ad spend</dt>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="size-2 rounded-full bg-chart-5-active" aria-hidden />
                <dt>ROAS</dt>
              </div>
            </dl>
          </div>
          <div className="min-h-0 w-full flex-1">
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart
                data={ROAS_MONTHS}
                margin={{ top: 4, right: 6, bottom: 0, left: 0 }}
                onMouseMove={(state) => {
                  const index = Number(state?.activeTooltipIndex);
                  if (state?.isTooltipActive && Number.isFinite(index)) setRoasHover(index);
                }}
                onMouseLeave={() => setRoasHover(null)}
              >
                <CartesianGrid vertical={false} stroke="var(--color-chart-track)" />
                <YAxis yAxisId="spend" width={40} tickCount={4} tickFormatter={(v: number) => `$${v}K`} tickLine={false} axisLine={false} tick={{ fontSize: 12, fill: "var(--color-text-tertiary)" }} />
                <YAxis yAxisId="roas" orientation="right" width={32} domain={[2.5, 4.5]} tickCount={4} tickFormatter={(v: number) => `${v}x`} tickLine={false} axisLine={false} tick={{ fontSize: 12, fill: "var(--color-text-tertiary)" }} />
                <XAxis dataKey="label" tickLine={false} axisLine={false} tickMargin={12} interval="preserveStartEnd" tick={{ fontSize: 13, fill: "var(--color-text-tertiary)" }} />
                <Tooltip content={() => null} cursor={{ stroke: "var(--color-chart-cursor)", strokeWidth: 1, strokeDasharray: "4 4" }} />
                <Bar yAxisId="spend" dataKey="spend" fill="var(--color-chart-6)" radius={[4, 4, 0, 0]} maxBarSize={28} />
                <Line yAxisId="roas" type="monotone" dataKey="roas" stroke="var(--color-chart-5-active)" strokeWidth={2} dot={false} activeDot={{ r: 4 }} />
              </ComposedChart>
            </ResponsiveContainer>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="rounded-xl bg-background-tertiary-default px-3 py-2">
              <p className="text-body-2-regular text-text-tertiary">Ad spend · total</p>
              <p className="text-body-medium text-text-primary tabular-nums">$217.7K</p>
            </div>
            <div className="rounded-xl bg-background-tertiary-default px-3 py-2">
              <p className="text-body-2-regular text-text-tertiary">ROAS · average</p>
              <p className="text-body-medium text-text-primary tabular-nums">3.6x</p>
            </div>
          </div>
        </section>

        <section className="flex h-[344px] min-w-0 flex-col gap-6 rounded-2xl bg-background-secondary-default px-4 pt-4 pb-3" aria-label="Visitors">
          <div className="flex w-full flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
            <div className="flex min-w-0 flex-col gap-0.5">
              <p className="w-full text-body-medium text-text-secondary">{visitorPoint ? `${visitorPoint.label} 2026` : "Visitors"}</p>
              <div className="flex w-full items-center gap-2">
                <p className="text-title-1-medium whitespace-nowrap text-text-primary tabular-nums">{visitorTotal.toLocaleString("en-US")}</p>
                <Chip variant="bold" color="lime">+8.8%</Chip>
              </div>
              <p className="text-body-2-medium text-text-tertiary tabular-nums">This year</p>
            </div>
            <dl className="flex shrink-0 flex-wrap items-center gap-x-4 gap-y-1 text-body-2-medium text-text-secondary">
              <div className="flex items-center gap-1.5"><span className="size-2 rounded-full bg-chart-1" aria-hidden /><dt>Organic</dt></div>
              <div className="flex items-center gap-1.5"><span className="size-2 rounded-full bg-chart-6" aria-hidden /><dt>Paid</dt></div>
              <div className="flex items-center gap-1.5"><span className="size-2 rounded-full bg-chart-3" aria-hidden /><dt>Social</dt></div>
            </dl>
          </div>
          <div className="min-h-0 w-full flex-1">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart
                data={VISITOR_MONTHS}
                margin={{ top: 4, right: 6, bottom: 0, left: 0 }}
                stackOffset="none"
                onMouseMove={(state) => {
                  const index = Number(state?.activeTooltipIndex);
                  if (state?.isTooltipActive && Number.isFinite(index)) setVisitorHover(index);
                }}
                onMouseLeave={() => setVisitorHover(null)}
              >
                <defs>
                  <linearGradient id={`${gradientId}-organic`} x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="var(--color-chart-1)" stopOpacity={0.35} />
                    <stop offset="100%" stopColor="var(--color-chart-1)" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid vertical={false} stroke="var(--color-chart-track)" />
                <YAxis width={40} tickCount={4} tickFormatter={(v: number) => `${Math.round(v / 1000)}K`} tickLine={false} axisLine={false} tick={{ fontSize: 12, fill: "var(--color-text-tertiary)" }} />
                <XAxis dataKey="label" tickLine={false} axisLine={false} tickMargin={12} interval="preserveStartEnd" tick={{ fontSize: 13, fill: "var(--color-text-tertiary)" }} />
                <Tooltip content={() => null} cursor={{ stroke: "var(--color-chart-cursor)", strokeWidth: 1, strokeDasharray: "4 4" }} />
                <Area type="monotone" dataKey="organic" stackId="1" stroke="var(--color-chart-1-active)" strokeWidth={2} fill={`url(#${gradientId}-organic)`} dot={false} activeDot={{ r: 3 }} />
                <Area type="monotone" dataKey="paid" stackId="1" stroke="var(--color-chart-6-active)" strokeWidth={2} fill="var(--color-chart-6)" fillOpacity={0.12} dot={false} activeDot={{ r: 3 }} />
                <Area type="monotone" dataKey="social" stackId="1" stroke="var(--color-chart-3-active)" strokeWidth={2} fill="var(--color-chart-3)" fillOpacity={0.12} dot={false} activeDot={{ r: 3 }} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
          <div className="grid grid-cols-3 gap-3">
            {[
              ["Organic", "74,500"],
              ["Paid", "38,500"],
              ["Social", "21,400"],
            ].map(([label, value]) => (
              <div key={label} className="rounded-xl bg-background-tertiary-default px-3 py-2">
                <p className="text-body-2-regular text-text-tertiary">{label}</p>
                <p className="text-body-medium text-text-primary tabular-nums">{value}</p>
              </div>
            ))}
          </div>
        </section>
      </div>

      {/* Campaigns table */}
      <section className={cardClass} aria-label="Campaigns">
        <div className="flex w-full flex-col items-start gap-3 px-1 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-title-3-semibold text-text-primary">
            Total Results <span className="text-text-secondary tabular-nums">{filtered.length}</span>{" "}
            <span className="text-body-medium font-normal text-text-secondary">campaigns</span>
          </p>
          <p className="text-body-2-regular text-text-tertiary">
            Page {safePage} of {pageCount} · click a column header to sort
          </p>
        </div>

        {filtersOpen && (
          <div className="grid w-full grid-cols-1 gap-2 sm:grid-cols-3">
            <label className="flex flex-col gap-1.5">
              <span className={labelClass}>Channel</span>
              <select value={channelFilter} aria-label="Filter by channel" onChange={(event) => { setChannelFilter(event.target.value); setPage(1); }} className={inputClass}>
                <option>All channels</option>
                {CHANNELS.map((c) => (<option key={c} value={c}>{c}</option>))}
              </select>
            </label>
            <label className="flex flex-col gap-1.5">
              <span className={labelClass}>Objective</span>
              <select value={objectiveFilter} aria-label="Filter by objective" onChange={(event) => { setObjectiveFilter(event.target.value); setPage(1); }} className={inputClass}>
                <option>All objectives</option>
                {OBJECTIVES.map((o) => (<option key={o} value={o}>{o}</option>))}
              </select>
            </label>
            <label className="flex flex-col gap-1.5">
              <span className={labelClass}>Spend</span>
              <select value={spendFilter} aria-label="Filter by spend" onChange={(event) => { setSpendFilter(event.target.value); setPage(1); }} className={inputClass}>
                {["All spend", "Under $1,000", "$1,000 – $5,000", "$5,000 – $20,000", "Over $20,000"].map((s) => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            </label>
          </div>
        )}

        <div className="w-full overflow-x-auto">
          <table className="w-full min-w-[720px] border-collapse text-start">
            <thead>
              <tr className="border-b border-border-table">
                <th className="py-2 pe-3 text-start">
                  <button type="button" onClick={() => toggleSort("name")} className="flex cursor-pointer items-center gap-1 text-caption-1-semibold text-text-tertiary uppercase hover:text-text-primary">
                    Campaign {sortIcon("name")}
                  </button>
                </th>
                <th className="py-2 pe-3 text-start text-caption-1-semibold text-text-tertiary uppercase">Delivery</th>
                <th className="py-2 pe-3 text-start text-caption-1-semibold text-text-tertiary uppercase">Objective</th>
                <th className="py-2 pe-3 text-start">
                  <button type="button" onClick={() => toggleSort("date")} className="flex cursor-pointer items-center gap-1 text-caption-1-semibold text-text-tertiary uppercase hover:text-text-primary">
                    Last updated {sortIcon("date")}
                  </button>
                </th>
                <th className="py-2 pe-3 text-start">
                  <button type="button" onClick={() => toggleSort("spend")} className="flex cursor-pointer items-center gap-1 text-caption-1-semibold text-text-tertiary uppercase hover:text-text-primary">
                    Spend {sortIcon("spend")}
                  </button>
                </th>
                <th className="py-2 text-end text-caption-1-semibold text-text-tertiary uppercase">Actions</th>
              </tr>
            </thead>
            <tbody>
              {pageRows.map((campaign) => (
                <tr key={campaign.id} className="border-b border-border-table last:border-b-0 hover:bg-background-tertiary-default/50">
                  <td className="py-3 pe-3">
                    <p className="text-body-medium text-text-primary">{campaign.name}</p>
                    <p className="text-body-2-regular text-text-tertiary">{campaign.channel}</p>
                  </td>
                  <td className="py-3 pe-3">
                    <select
                      value={campaign.delivery}
                      aria-label={`Delivery status for ${campaign.name}`}
                      onChange={(event) => setDelivery(campaign.id, event.target.value as Delivery)}
                      className={cx("cursor-pointer rounded-md px-1.5 py-0.5 text-body-2-medium outline-none focus-visible:ring-2 focus-visible:ring-border-focus-ring", DELIVERY_STYLE[campaign.delivery])}
                    >
                      {(["Active", "Paused", "Draft"] as Delivery[]).map((d) => (
                        <option key={d} value={d}>{d}</option>
                      ))}
                    </select>
                  </td>
                  <td className="py-3 pe-3 text-body-medium text-text-secondary">{campaign.objective}</td>
                  <td className="py-3 pe-3 text-body-medium text-text-secondary tabular-nums">{campaign.updated}</td>
                  <td className="py-3 pe-3 text-body-medium text-text-primary tabular-nums">{formatMoney(campaign.spend)}</td>
                  <td className="relative py-3 text-end">
                    <IconButton
                      icon={RiMoreFill}
                      size="small"
                      aria-label={`Actions for ${campaign.name}`}
                      onClick={() => setActionFor((cur) => (cur === campaign.id ? null : campaign.id))}
                    />
                    {actionFor === campaign.id && (
                      <div className="absolute right-0 z-30 mt-1 w-40 rounded-xl border border-border-button-default bg-background-primary-default p-1 text-start shadow-lg">
                        <button type="button" onClick={() => { setActionFor(null); setEditor({ mode: "edit", campaign }); }} className="w-full cursor-pointer rounded-lg px-2.5 py-2 text-body-medium text-text-primary hover:bg-background-secondary-hover">
                          Edit campaign
                        </button>
                        <button type="button" onClick={() => duplicateCampaign(campaign)} className="w-full cursor-pointer rounded-lg px-2.5 py-2 text-body-medium text-text-primary hover:bg-background-secondary-hover">
                          Duplicate
                        </button>
                        <button type="button" onClick={() => deleteCampaign(campaign.id)} className="w-full cursor-pointer rounded-lg px-2.5 py-2 text-body-medium text-text-error-primary hover:bg-background-secondary-hover">
                          Delete
                        </button>
                      </div>
                    )}
                  </td>
                </tr>
              ))}
              {pageRows.length === 0 && (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-body-regular text-text-tertiary">
                    No campaigns match these filters — clear a filter to see more.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <nav className="flex w-full flex-wrap items-center justify-center gap-1" aria-label="Campaign pages">
          <Button variant="secondary" size="small" disabled={safePage <= 1} onClick={() => setPage((p) => Math.max(1, p - 1))}>
            Previous
          </Button>
          {pageNumbers().map((p, i) =>
            p === "…" ? (
              <span key={`gap-${i}`} className="px-1.5 text-body-medium text-text-tertiary">…</span>
            ) : (
              <button
                key={p}
                type="button"
                aria-current={p === safePage ? "page" : undefined}
                onClick={() => setPage(p)}
                className={cx(
                  "size-8 cursor-pointer rounded-lg text-body-medium tabular-nums transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-border-focus-ring",
                  p === safePage ? "bg-accent-500 text-white" : "text-text-secondary hover:bg-background-tertiary-default",
                )}
              >
                {p}
              </button>
            ),
          )}
          <Button variant="secondary" size="small" disabled={safePage >= pageCount} onClick={() => setPage((p) => Math.min(pageCount, p + 1))}>
            Next
          </Button>
        </nav>
      </section>

      {/* New / edit campaign drawer */}
      {editor && (
        <CampaignEditor
          initial={editor.campaign}
          isNew={editor.mode === "new"}
          onClose={() => setEditor(null)}
          onSave={saveEditor}
        />
      )}
    </TemplateShell>
  );
}

function CampaignEditor({
  initial,
  isNew,
  onClose,
  onSave,
}: {
  initial: Campaign;
  isNew: boolean;
  onClose: () => void;
  onSave: (draft: Campaign) => void;
}) {
  const [draft, setDraft] = useState<Campaign>(initial);
  return (
    <div className="fixed inset-0 z-50 flex justify-end" role="dialog" aria-modal="true" aria-label={isNew ? "New campaign" : "Edit campaign"}>
      <button type="button" aria-label="Close campaign editor" onClick={onClose} className="absolute inset-0 cursor-pointer bg-black/40" />
      <div className="relative flex h-full w-[440px] max-w-[94vw] flex-col gap-4 overflow-y-auto bg-background-primary-default p-4 shadow-xl sm:p-5">
        <div className="flex items-start justify-between gap-3">
          <div>
            <h2 className="text-title-3-semibold text-text-primary">{isNew ? "New campaign" : "Edit campaign"}</h2>
            <p className="text-body-2-regular text-text-secondary">
              {isNew ? "It will appear at the top of the Campaigns table." : draft.name}
            </p>
          </div>
          <IconButton icon={RiCloseLine} size="medium" aria-label="Close" onClick={onClose} />
        </div>

        <label className="flex flex-col gap-1.5">
          <span className={labelClass}>Campaign name</span>
          <input
            value={draft.name}
            autoFocus
            aria-label="Campaign name"
            placeholder="e.g. Founder story video · US"
            onChange={(event) => setDraft((prev) => ({ ...prev, name: event.target.value }))}
            className={inputClass}
          />
        </label>

        <div className="grid grid-cols-2 gap-3">
          <label className="flex flex-col gap-1.5">
            <span className={labelClass}>Channel</span>
            <select value={draft.channel} aria-label="Channel" onChange={(event) => setDraft((prev) => ({ ...prev, channel: event.target.value }))} className={inputClass}>
              {CHANNELS.map((c) => (<option key={c} value={c}>{c}</option>))}
            </select>
          </label>
          <label className="flex flex-col gap-1.5">
            <span className={labelClass}>Objective</span>
            <select value={draft.objective} aria-label="Objective" onChange={(event) => setDraft((prev) => ({ ...prev, objective: event.target.value }))} className={inputClass}>
              {OBJECTIVES.map((o) => (<option key={o} value={o}>{o}</option>))}
            </select>
          </label>
          <label className="flex flex-col gap-1.5">
            <span className={labelClass}>Delivery</span>
            <select value={draft.delivery} aria-label="Delivery" onChange={(event) => setDraft((prev) => ({ ...prev, delivery: event.target.value as Delivery }))} className={inputClass}>
              {(["Active", "Paused", "Draft"] as Delivery[]).map((d) => (
                <option key={d} value={d}>{d}</option>
              ))}
            </select>
          </label>
          <label className="flex flex-col gap-1.5">
            <span className={labelClass}>Spend (USD)</span>
            <input
              type="number"
              min={0}
              value={draft.spend}
              aria-label="Spend in USD"
              onChange={(event) => setDraft((prev) => ({ ...prev, spend: Math.max(0, Number(event.target.value) || 0) }))}
              className={inputClass}
            />
          </label>
        </div>

        <div className="mt-auto flex justify-end gap-2 border-t border-separator-border pt-3">
          <Button variant="secondary" size="medium" onClick={onClose}>
            Cancel
          </Button>
          <Button variant="primary" size="medium" leadingIcon={RiAddFill} disabled={!draft.name.trim()} onClick={() => onSave(draft)}>
            {isNew ? "Create campaign" : "Save changes"}
          </Button>
        </div>
      </div>
    </div>
  );
}
