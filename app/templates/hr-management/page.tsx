"use client";

import {
  RiAddFill,
  RiArrowDownSLine,
  RiArrowUpSLine,
  RiBriefcaseLine,
  RiCloseLine,
  RiDeleteBinLine,
  RiEyeLine,
  RiFilter3Fill,
  RiMenuLine,
  RiSearchLine,
  RiTeamLine,
  RiUserAddLine,
  RiUserSharedLine,
} from "@remixicon/react";
import { useEffect, useMemo, useState, type ReactNode } from "react";
import { Bar, BarChart, Cell, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

import {
  DASHBOARD_NAV,
  DashboardSidebar,
} from "@/components/application/dashboard/dashboard-sidebar";
import { AllTemplatesButton } from "@/components/application/template-switcher/all-templates-button";
import { DocumentTitle } from "@/components/application/app-shell/document-title";
import { NotificationBell } from "@/components/application/app-shell/notification-bell";
import { Avatar } from "@/components/base/avatar/avatar";
import { Breadcrumb, BreadcrumbItem } from "@/components/base/breadcrumb/breadcrumb";
import { Button } from "@/components/base/buttons/button";
import { IconButton } from "@/components/base/buttons/icon-button";
import { cx } from "@/utils/cx";

/**
 * HR Management template — built from the official description only.
 * NOTE: /templates/hr-management has no original demo page (404), so there
 * is no original to compare against. Sections follow INVENTORY.md:
 * headcount KPIs, recent hires, hiring funnel, engagement radar,
 * hires vs leavers, team breakdown, employee data table.
 * Built only from free BoardUI components + mock data. Not the Pro source.
 *
 * The shared sidebar (DASHBOARD_NAV) is the original 9-item nav plus the
 * "全部模板" first row — HR Management is intentionally not a nav row
 * (the original sidebar has no such row), so no item is highlighted here;
 * the page is reached from the /templates index.
 */

/* ------------------------------------------------------------------ */
/* Local shell (same layout as TemplateShell)                           */
/* ------------------------------------------------------------------ */

function HrShell({
  actions,
  children,
}: {
  actions?: ReactNode;
  children: ReactNode;
}) {
  const [navOpen, setNavOpen] = useState(false);
  return (
    <div className="relative flex h-dvh w-full gap-4 overflow-hidden bg-background-full p-3">
      <DocumentTitle />
      <DashboardSidebar items={DASHBOARD_NAV} selected="hr-management" className="hidden lg:flex" />
      {navOpen && (
        <div className="fixed inset-0 z-50 flex lg:hidden">
          <button type="button" aria-label="Close navigation" onClick={() => setNavOpen(false)} className="absolute inset-0 cursor-pointer bg-black/40" />
          <div className="relative flex h-full p-3">
            <DashboardSidebar mobile items={DASHBOARD_NAV} selected="hr-management" onClose={() => setNavOpen(false)} className="flex" />
          </div>
        </div>
      )}
      <main className="relative flex min-h-0 min-w-0 flex-1 justify-center overflow-x-hidden overflow-y-auto bg-background-full sm:pt-3">
        <div className="flex w-full max-w-[1300px] flex-col gap-2.5">
          <header className="flex w-full flex-col gap-2">
            <Breadcrumb>
              <BreadcrumbItem href="/templates/dashboard">
                <Avatar size="xs" color="blue" initials="B" />
                Board team
              </BreadcrumbItem>
              <BreadcrumbItem href="/templates/dashboard">
                <Avatar size="xs" color="neutral" initials="M" />
                Mertcan
              </BreadcrumbItem>
              <BreadcrumbItem current icon={RiTeamLine}>
                HR Management
              </BreadcrumbItem>
            </Breadcrumb>
            <div className="flex w-full flex-wrap items-end justify-between gap-2">
              <div className="flex min-w-0 items-center gap-1.5">
                <IconButton
                  icon={navOpen ? RiCloseLine : RiMenuLine}
                  size="medium"
                  aria-label="Open navigation"
                  onClick={() => setNavOpen((open) => !open)}
                  className="lg:hidden"
                />
                <h1 className="px-1 text-title-2-medium whitespace-nowrap text-text-primary">HR Management</h1>
              </div>
              <div className="flex flex-wrap items-center justify-end gap-2.5">
                <AllTemplatesButton />
                {actions}
              </div>
            </div>
          </header>
          <div className="flex w-full flex-col gap-4 pb-4">{children}</div>
        </div>
      </main>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Data                                                                */
/* ------------------------------------------------------------------ */

/* `up` is the direction the value moved (arrow); `good` is whether that
 * move is favorable (chip color), defaulting to `up`. They differ for
 * attrition, where down is good: Q3 4.2% is down 0.8 pts, so the chip
 * shows a down arrow in green — previously it showed an up arrow next to
 * a "−0.8 pts" delta. */
type Kpi = { label: string; value: string; delta: string; up: boolean; good?: boolean };

const KPI_PERIODS: { label: string; kpis: Kpi[] }[] = [
  {
    label: "Q3 2026",
    kpis: [
      { label: "Total headcount", value: "248", delta: "+18 YoY", up: true },
      { label: "New hires", value: "24", delta: "+6 vs Q2", up: true },
      { label: "Attrition rate", value: "4.2%", delta: "-0.8 pts", up: false, good: true },
      { label: "Avg. engagement", value: "78%", delta: "+3 pts", up: true },
    ],
  },
  {
    label: "Q2 2026",
    kpis: [
      { label: "Total headcount", value: "230", delta: "+11 YoY", up: true },
      { label: "New hires", value: "18", delta: "−1 vs Q1", up: false },
      { label: "Attrition rate", value: "5.0%", delta: "+0.4 pts", up: true, good: false },
      { label: "Avg. engagement", value: "75%", delta: "+1 pt", up: true },
    ],
  },
  {
    label: "2026",
    kpis: [
      { label: "Total headcount", value: "248", delta: "+29 YTD", up: true },
      { label: "New hires", value: "61", delta: "YTD", up: true },
      { label: "Attrition rate", value: "4.6%", delta: "-1.1 pts YoY", up: false, good: true },
      { label: "Avg. engagement", value: "77%", delta: "+4 pts YoY", up: true },
    ],
  },
];

const FUNNEL = [
  { stage: "Applied", value: 1240 },
  { stage: "Screened", value: 486 },
  { stage: "Interviewed", value: 132 },
  { stage: "Offered", value: 31 },
  { stage: "Hired", value: 24 },
];

const RADAR_AXES = ["Growth", "Recognition", "Balance", "Leadership", "Compensation"];
// "All teams" averages 78/100, matching the Q3 "Avg. engagement 78%" KPI.
const RADAR_TEAMS: Record<string, number[]> = {
  "All teams": [80, 74, 83, 78, 75],
  Engineering: [84, 70, 76, 79, 74],
  Design: [80, 82, 85, 74, 66],
  Sales: [71, 76, 73, 81, 70],
};

/**
 * Monthly hires vs leavers, Apr–Sep 2026. These reconcile with the KPI
 * periods above: Q2 hires 18 (5+6+7), Q3 hires 24 (8+7+9), matching the
 * Q2/Q3 "New hires" KPIs and the funnel's 24 hires; YTD hires are
 * 61 (Q1 19 + Q2 18 + Q3 24). Net +21 over these 6 months, and with Q1
 * net +8 (219 → 227) the headcount path is 219 → 227 → 230 → 248,
 * i.e. +29 YTD as the 2026 KPI states.
 */
const HIRES_LEAVERS = [
  { month: "Apr", hires: 5, leavers: 5 },
  { month: "May", hires: 6, leavers: 6 },
  { month: "Jun", hires: 7, leavers: 4 },
  { month: "Jul", hires: 8, leavers: 3 },
  { month: "Aug", hires: 7, leavers: 2 },
  { month: "Sep", hires: 9, leavers: 1 },
];

const TEAMS = [
  { name: "Engineering", count: 86, color: "var(--color-chart-1)" },
  { name: "Sales", count: 54, color: "var(--color-chart-2)" },
  { name: "Design", count: 32, color: "var(--color-chart-3)" },
  { name: "Product", count: 28, color: "var(--color-chart-4)" },
  { name: "People", count: 18, color: "var(--color-chart-5)" },
  { name: "Finance", count: 16, color: "var(--color-chart-1)" },
  { name: "Support", count: 14, color: "var(--color-chart-2)" },
];

const RECENT_HIRES = [
  { name: "Ava Bergström", role: "Product Designer", team: "Design", start: "Sep 22, 2026" },
  { name: "Liam Kowalski", role: "Frontend Engineer", team: "Engineering", start: "Sep 15, 2026" },
  { name: "Sofia Tanaka", role: "Sales Manager", team: "Sales", start: "Sep 8, 2026" },
  { name: "Noah Novak", role: "Data Analyst", team: "Product", start: "Sep 1, 2026" },
  { name: "Maya Silva", role: "People Partner", team: "People", start: "Aug 25, 2026" },
];

type Employee = {
  name: string;
  role: string;
  team: string;
  location: string;
  start: string;
  status: "Active" | "On leave" | "Probation";
};

const EMPLOYEES: Employee[] = [
  { name: "Ava Bergström", role: "Product Designer", team: "Design", location: "Berlin", start: "Sep 22, 2026", status: "Probation" },
  { name: "Liam Kowalski", role: "Frontend Engineer", team: "Engineering", location: "Warsaw", start: "Sep 15, 2026", status: "Probation" },
  { name: "Sofia Tanaka", role: "Sales Manager", team: "Sales", location: "Tokyo", start: "Sep 8, 2026", status: "Active" },
  { name: "Noah Novak", role: "Data Analyst", team: "Product", location: "Prague", start: "Sep 1, 2026", status: "Active" },
  { name: "Maya Silva", role: "People Partner", team: "People", location: "Lisbon", start: "Aug 25, 2026", status: "Active" },
  { name: "Ethan Moreau", role: "Backend Engineer", team: "Engineering", location: "Paris", start: "Aug 18, 2026", status: "Active" },
  { name: "Zoe Kim", role: "UX Researcher", team: "Design", location: "Seoul", start: "Aug 11, 2026", status: "On leave" },
  { name: "Lucas Larsen", role: "Account Executive", team: "Sales", location: "Copenhagen", start: "Aug 4, 2026", status: "Active" },
  { name: "Nora Petrov", role: "Engineering Manager", team: "Engineering", location: "Sofia", start: "Jul 28, 2026", status: "Active" },
  { name: "Owen Nguyen", role: "Financial Analyst", team: "Finance", location: "Sydney", start: "Jul 21, 2026", status: "Active" },
  { name: "Ivy Costa", role: "Support Lead", team: "Support", location: "Porto", start: "Jul 14, 2026", status: "Active" },
  { name: "Caleb Weber", role: "Product Manager", team: "Product", location: "Munich", start: "Jul 7, 2026", status: "Active" },
];

const STATUS_STYLE: Record<Employee["status"], string> = {
  Active: "bg-status-lime-background text-status-lime-text",
  "On leave": "bg-amber-100 text-amber-800",
  Probation: "bg-sky-100 text-sky-700",
};

function initialsOf(name: string) {
  return name.split(" ").map((w) => w[0]).join("").slice(0, 2).toUpperCase();
}

/** Radar chart (pentagon, 5 axes) with hover tooltips. */
function EngagementRadar({ values, onHover }: { values: number[]; onHover: (axis: string | null, value: number | null) => void }) {
  const cx0 = 200;
  const cy0 = 140;
  const R = 92;
  const points = RADAR_AXES.map((_, i) => {
    const angle = (Math.PI * 2 * i) / RADAR_AXES.length - Math.PI / 2;
    return { x: cx0 + R * Math.cos(angle), y: cy0 + R * Math.sin(angle) };
  });
  const valuePoints = values.map((v, i) => {
    const angle = (Math.PI * 2 * i) / RADAR_AXES.length - Math.PI / 2;
    const r = (v / 100) * R;
    return { x: cx0 + r * Math.cos(angle), y: cy0 + r * Math.sin(angle) };
  });
  const polygon = valuePoints.map((p) => `${p.x.toFixed(1)},${p.y.toFixed(1)}`).join(" ");
  return (
    <svg viewBox="0 0 400 280" className="mx-auto w-full max-w-[340px]" role="img" aria-label="Engagement radar chart">
      {[0.25, 0.5, 0.75, 1].map((f) => (
        <polygon
          key={f}
          points={points.map((p) => `${(cx0 + (p.x - cx0) * f).toFixed(1)},${(cy0 + (p.y - cy0) * f).toFixed(1)}`).join(" ")}
          fill="none"
          stroke="var(--color-border-button-default)"
          strokeWidth="1"
        />
      ))}
      {points.map((p) => (
        <line key={p.x} x1={cx0} y1={cy0} x2={p.x} y2={p.y} stroke="var(--color-border-button-default)" strokeWidth="1" />
      ))}
      <polygon points={polygon} fill="var(--color-chart-2)" fillOpacity="0.25" stroke="var(--color-chart-2)" strokeWidth="2" strokeLinejoin="round" />
      {valuePoints.map((p, i) => (
        <g key={RADAR_AXES[i]}>
          <circle
            cx={p.x} cy={p.y} r="14" fill="transparent"
            onMouseEnter={() => onHover(RADAR_AXES[i], values[i])}
            onMouseLeave={() => onHover(null, null)}
            style={{ cursor: "pointer" }}
          />
          <circle cx={p.x} cy={p.y} r="4.5" fill="var(--color-chart-2)" stroke="var(--color-background-primary-default)" strokeWidth="2" />
        </g>
      ))}
      {RADAR_AXES.map((axis, i) => {
        const angle = (Math.PI * 2 * i) / RADAR_AXES.length - Math.PI / 2;
        const lx = cx0 + (R + 20) * Math.cos(angle);
        const ly = cy0 + (R + 20) * Math.sin(angle);
        const anchor = lx < cx0 - 12 ? "end" : lx > cx0 + 12 ? "start" : "middle";
        return (
          <text key={axis} x={lx} y={ly} textAnchor={anchor} dominantBaseline="middle" fontSize="12" fill="var(--color-text-secondary)">
            {axis}
          </text>
        );
      })}
    </svg>
  );
}

export default function HrManagementTemplatePage() {
  const [periodIdx, setPeriodIdx] = useState(0);
  const [funnelStage, setFunnelStage] = useState<number | null>(null);
  const [radarTeam, setRadarTeam] = useState("All teams");
  const [radarHover, setRadarHover] = useState<{ axis: string; value: number } | null>(null);
  const [teamFilter, setTeamFilter] = useState<string | null>(null);
  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [sortKey, setSortKey] = useState<"name" | "start" | null>(null);
  const [sortDir, setSortDir] = useState<1 | -1>(1);
  const [page, setPage] = useState(1);
  const [viewEmployee, setViewEmployee] = useState<Employee | null>(null);
  const [removed, setRemoved] = useState<string[]>([]);
  const [toast, setToast] = useState<string | null>(null);
  const [hireOpen, setHireOpen] = useState(false);
  const [hireName, setHireName] = useState("");
  const [hireRole, setHireRole] = useState("");
  const [hireTeam, setHireTeam] = useState("Engineering");
  const [extraHires, setExtraHires] = useState<Employee[]>([]);

  // Esc closes either dialog, matching the shared Modal behavior.
  useEffect(() => {
    if (!viewEmployee && !hireOpen) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setViewEmployee(null);
        setHireOpen(false);
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [viewEmployee, hireOpen]);

  const period = KPI_PERIODS[periodIdx];
  const radarValues = RADAR_TEAMS[radarTeam] ?? RADAR_TEAMS["All teams"];
  const maxTeam = Math.max(...TEAMS.map((t) => t.count));

  const employees = useMemo(() => {
    let rows = [...extraHires, ...EMPLOYEES].filter((e) => !removed.includes(e.name));
    if (teamFilter) rows = rows.filter((e) => e.team === teamFilter);
    if (statusFilter !== "All") rows = rows.filter((e) => e.status === statusFilter);
    if (query.trim()) {
      const q = query.trim().toLowerCase();
      rows = rows.filter((e) => `${e.name} ${e.role} ${e.team} ${e.location}`.toLowerCase().includes(q));
    }
    if (sortKey === "name") rows = [...rows].sort((a, b) => sortDir * a.name.localeCompare(b.name));
    if (sortKey === "start") rows = [...rows].sort((a, b) => sortDir * (new Date(a.start).getTime() - new Date(b.start).getTime()));
    return rows;
  }, [extraHires, removed, teamFilter, statusFilter, query, sortKey, sortDir]);

  const perPage = 6;
  const totalPages = Math.max(1, Math.ceil(employees.length / perPage));
  const safePage = Math.min(page, totalPages);
  const pageRows = employees.slice((safePage - 1) * perPage, safePage * perPage);

  const toggleSort = (key: "name" | "start") => {
    if (sortKey === key) setSortDir((d) => (d === 1 ? -1 : 1));
    else {
      setSortKey(key);
      setSortDir(1);
    }
    setPage(1);
  };

  const addHire = () => {
    const name = hireName.trim();
    const role = hireRole.trim() || "New hire";
    if (!name) return;
    setExtraHires((prev) => [
      { name, role, team: hireTeam, location: "Remote", start: "Nov 6, 2026", status: "Probation" },
      ...prev,
    ]);
    setHireOpen(false);
    setHireName("");
    setHireRole("");
    setToast(`${name} added to the employee table.`);
    window.setTimeout(() => setToast(null), 3500);
  };

  return (
    <HrShell
      actions={
        <>
          <NotificationBell />
          <Button variant="secondary" size="medium" leadingIcon={RiFilter3Fill} onClick={() => setStatusFilter(statusFilter === "All" ? "Active" : "All")}>
            {statusFilter === "All" ? "Filters" : `Status: ${statusFilter}`}
          </Button>
          <Button variant="primary" size="medium" leadingIcon={RiAddFill} onClick={() => setHireOpen(true)}>
            Add employee
          </Button>
        </>
      }
    >
      <div className="flex items-start gap-2 rounded-2xl border border-border-button-default bg-background-secondary-default p-3">
        <RiTeamLine className="mt-0.5 size-5 shrink-0 text-foreground-icon-secondary" aria-hidden />
        <p className="text-body-regular text-text-secondary">
          Built from the official template description — <span className="text-text-primary">按官方描述搭建，无原版演示对照</span>.
          The original /templates/hr-management page returns 404, so there is no demo page to match against.
        </p>
      </div>

      {/* Headcount KPIs */}
      <div className="flex flex-wrap items-center gap-2">
        {KPI_PERIODS.map((p, i) => (
          <button
            key={p.label}
            type="button"
            aria-pressed={periodIdx === i}
            onClick={() => setPeriodIdx(i)}
            className={cx(
              "cursor-pointer rounded-full px-3 py-1.5 text-body-2-medium outline-none transition-colors focus-visible:ring-2 focus-visible:ring-border-focus-ring",
              periodIdx === i ? "bg-accent-500 text-white" : "bg-background-secondary-default text-text-secondary hover:bg-background-tertiary-default",
            )}
          >
            {p.label}
          </button>
        ))}
      </div>
      <div className="grid w-full grid-cols-2 gap-4 xl:grid-cols-4">
        {period.kpis.map((kpi) => (
          <section key={kpi.label} className="flex flex-col gap-1.5 rounded-2xl bg-background-secondary-default p-4">
            <p className="text-body-medium text-text-secondary">{kpi.label}</p>
            <p className="text-title-1-medium text-text-primary tabular-nums">{kpi.value}</p>
            <span className={cx("flex w-fit items-center gap-0.5 rounded-full px-2 py-0.5 text-body-2-medium", (kpi.good ?? kpi.up) ? "bg-status-lime-background text-status-lime-text" : "bg-rose-100 text-rose-700")}>
              {kpi.up ? <RiArrowUpSLine className="size-3.5" aria-hidden /> : <RiArrowDownSLine className="size-3.5" aria-hidden />}
              {kpi.delta}
            </span>
          </section>
        ))}
      </div>

      <div className="flex w-full flex-col gap-4 xl:flex-row">
        {/* Hiring funnel */}
        <section className="flex min-w-0 flex-1 flex-col gap-3 rounded-2xl bg-background-secondary-default p-4">
          <div className="flex items-center justify-between gap-2">
            <p className="text-body-medium text-text-secondary">Hiring funnel</p>
            <span className="text-body-2-medium text-text-tertiary">1,240 applicants</span>
          </div>
          <div className="flex flex-col gap-2">
            {FUNNEL.map((stage, i) => {
              const pct = Math.round((stage.value / FUNNEL[0].value) * 100);
              const conv = i === 0 ? null : `${((stage.value / FUNNEL[i - 1].value) * 100).toFixed(0)}% of previous`;
              const active = funnelStage === i;
              return (
                <button
                  key={stage.stage}
                  type="button"
                  aria-pressed={active}
                  onClick={() => setFunnelStage(active ? null : i)}
                  className={cx(
                    "w-full cursor-pointer rounded-xl px-3 py-2.5 text-start outline-none transition-colors focus-visible:ring-2 focus-visible:ring-border-focus-ring",
                    active ? "bg-background-tertiary-default" : "bg-background-inner-default hover:bg-background-tertiary-default",
                  )}
                >
                  <span className="flex items-center justify-between gap-2">
                    <span className="text-body-medium text-text-primary">{stage.stage}</span>
                    <span className="text-body-medium text-text-primary tabular-nums">
                      {stage.value.toLocaleString("en-US")}
                      <span className="ms-1.5 text-body-2-regular text-text-tertiary">{pct}%</span>
                    </span>
                  </span>
                  <span className="mt-2 block h-2 w-full overflow-hidden rounded-full bg-background-tertiary-default">
                    <span className="block h-full rounded-full bg-chart-2" style={{ width: `${Math.max(pct, 2)}%` }} />
                  </span>
                  {active && conv && <span className="mt-1.5 block text-body-2-regular text-text-secondary">{conv} · {stage.value} candidates</span>}
                  {active && !conv && <span className="mt-1.5 block text-body-2-regular text-text-secondary">All applicants enter here.</span>}
                </button>
              );
            })}
          </div>
          <p className="text-body-2-regular text-text-tertiary">Tap a stage to see its conversion. Overall: 24 hires from 1,240 applicants (1.9%).</p>
        </section>

        {/* Engagement radar */}
        <section className="flex min-w-0 flex-1 flex-col gap-3 rounded-2xl bg-background-secondary-default p-4">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <p className="text-body-medium text-text-secondary">Engagement radar</p>
            <select
              value={radarTeam}
              onChange={(e) => setRadarTeam(e.target.value)}
              aria-label="Radar team"
              className="cursor-pointer rounded-2lg border border-border-button-default bg-background-primary-default px-2 py-1.5 text-body-2-medium text-text-primary shadow-xs outline-none focus-visible:ring-2 focus-visible:ring-border-focus-ring"
            >
              {Object.keys(RADAR_TEAMS).map((t) => (
                <option key={t}>{t}</option>
              ))}
            </select>
          </div>
          <EngagementRadar
            values={radarValues}
            onHover={(axis, value) => setRadarHover(axis && value !== null ? { axis, value } : null)}
          />
          <p className="min-h-5 text-center text-body-medium text-text-primary tabular-nums" aria-live="polite">
            {radarHover ? `${radarHover.axis}: ${radarHover.value}/100` : `${radarTeam} · avg ${Math.round(radarValues.reduce((a, b) => a + b, 0) / radarValues.length)}/100 — hover a point for its score`}
          </p>
        </section>
      </div>

      <div className="flex w-full flex-col gap-4 xl:flex-row">
        {/* Hires vs leavers */}
        <section className="flex min-w-0 flex-1 flex-col gap-3 rounded-2xl bg-background-secondary-default p-4">
          <div className="flex items-center justify-between gap-2">
            <p className="text-body-medium text-text-secondary">Hires vs leavers</p>
            <span className="flex items-center gap-3 text-body-2-medium text-text-tertiary">
              <span className="flex items-center gap-1"><span className="size-2.5 rounded-full bg-chart-2" aria-hidden /> Hires</span>
              <span className="flex items-center gap-1"><span className="size-2.5 rounded-full bg-rose-400" aria-hidden /> Leavers</span>
            </span>
          </div>
          <div className="h-[220px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={HIRES_LEAVERS} margin={{ top: 4, right: 4, bottom: 0, left: 0 }} barCategoryGap="28%">
                <XAxis dataKey="month" tickLine={false} axisLine={false} tickMargin={8} tick={{ fontSize: 12, fill: "var(--color-text-tertiary)" }} />
                <YAxis width={30} tickLine={false} axisLine={false} tick={{ fontSize: 12, fill: "var(--color-text-tertiary)" }} />
                <Tooltip
                  cursor={{ fill: "var(--color-background-tertiary-default)" }}
                  content={({ active, payload }) =>
                    active && payload?.length ? (
                      <span className="rounded-lg bg-background-primary-default px-2.5 py-1.5 text-body-2-medium text-text-primary shadow-dropdown">
                        {payload[0].payload.month}: {payload[0].payload.hires} hires, {payload[0].payload.leavers} leavers
                      </span>
                    ) : null
                  }
                />
                <Bar dataKey="hires" fill="var(--color-chart-2)" radius={[4, 4, 0, 0]} />
                <Bar dataKey="leavers" fill="#fb7185" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
          <p className="text-body-2-regular text-text-tertiary">Net +21 over the last 6 months (42 hires, 21 leavers).</p>
        </section>

        {/* Team breakdown */}
        <section className="flex min-w-0 flex-1 flex-col gap-3 rounded-2xl bg-background-secondary-default p-4">
          <div className="flex items-center justify-between gap-2">
            <p className="text-body-medium text-text-secondary">Team breakdown</p>
            <span className="text-body-2-medium text-text-tertiary">248 total</span>
          </div>
          <div className="flex flex-col gap-2">
            {TEAMS.map((team) => {
              const pct = Math.round((team.count / 248) * 100);
              const active = teamFilter === team.name;
              return (
                <button
                  key={team.name}
                  type="button"
                  aria-pressed={active}
                  onClick={() => {
                    setTeamFilter(active ? null : team.name);
                    setPage(1);
                  }}
                  className={cx(
                    "w-full cursor-pointer rounded-xl px-3 py-2 text-start outline-none transition-colors focus-visible:ring-2 focus-visible:ring-border-focus-ring",
                    active ? "bg-background-tertiary-default" : "bg-background-inner-default hover:bg-background-tertiary-default",
                  )}
                >
                  <span className="flex items-center justify-between gap-2">
                    <span className="flex items-center gap-2 text-body-medium text-text-primary">
                      <span className="size-2.5 shrink-0 rounded-full" style={{ backgroundColor: team.color }} aria-hidden />
                      {team.name}
                    </span>
                    <span className="text-body-medium text-text-primary tabular-nums">
                      {team.count}
                      <span className="ms-1.5 text-body-2-regular text-text-tertiary">{pct}%</span>
                    </span>
                  </span>
                  <span className="mt-2 block h-2 w-full overflow-hidden rounded-full bg-background-tertiary-default">
                    <span className="block h-full rounded-full" style={{ width: `${(team.count / maxTeam) * 100}%`, backgroundColor: team.color }} />
                  </span>
                </button>
              );
            })}
          </div>
          <p className="text-body-2-regular text-text-tertiary">
            {teamFilter ? `Filtering the employee table to ${teamFilter} — tap again to clear.` : "Tap a team to filter the employee table below."}
          </p>
        </section>
      </div>

      {/* Recent hires */}
      <section className="flex w-full flex-col gap-3 rounded-2xl bg-background-secondary-default p-4">
        <div className="flex items-center gap-2">
          <RiUserAddLine className="size-5 text-foreground-icon-primary" aria-hidden />
          <p className="text-body-medium text-text-secondary">Recent hires</p>
        </div>
        <div className="grid w-full gap-2 sm:grid-cols-2 xl:grid-cols-5">
          {RECENT_HIRES.map((h) => (
            <button
              key={h.name}
              type="button"
              onClick={() => {
                setQuery(h.name.split(" ")[0]);
                setPage(1);
                document.getElementById("employee-table")?.scrollIntoView({ behavior: "smooth" });
              }}
              className="flex cursor-pointer items-center gap-2.5 rounded-xl bg-background-inner-default px-3 py-2.5 text-start outline-none transition-colors hover:bg-background-tertiary-default focus-visible:ring-2 focus-visible:ring-border-focus-ring"
            >
              <span className="inline-flex size-9 shrink-0 items-center justify-center rounded-full bg-background-tertiary-default text-body-2-medium text-text-secondary">
                {initialsOf(h.name)}
              </span>
              <span className="min-w-0">
                <span className="block truncate text-body-medium text-text-primary">{h.name}</span>
                <span className="block truncate text-body-2-regular text-text-tertiary">{h.role} · {h.start}</span>
              </span>
            </button>
          ))}
        </div>
      </section>

      {/* Employee table */}
      <section id="employee-table" className="flex w-full scroll-mt-4 flex-col gap-3 rounded-2xl bg-background-secondary-default p-4">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <RiBriefcaseLine className="size-5 text-foreground-icon-primary" aria-hidden />
            <p className="text-body-medium text-text-secondary">Employees</p>
            <span className="text-body-2-medium text-text-tertiary tabular-nums">{employees.length} shown</span>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <label className="flex items-center gap-2 rounded-2lg border border-border-button-default bg-background-primary-default px-2.5 py-1.5">
              <RiSearchLine className="size-4 shrink-0 text-foreground-icon-tertiary" aria-hidden />
              <input
                value={query}
                onChange={(e) => {
                  setQuery(e.target.value);
                  setPage(1);
                }}
                placeholder="Search name, role, team…"
                aria-label="Search employees"
                className="w-[160px] bg-transparent text-body-2-medium text-text-primary outline-none placeholder:text-text-tertiary sm:w-[200px]"
              />
            </label>
            <select
              value={statusFilter}
              onChange={(e) => {
                setStatusFilter(e.target.value as Employee["status"] | "All");
                setPage(1);
              }}
              aria-label="Filter by employment status"
              className="cursor-pointer rounded-2lg border border-border-button-default bg-background-primary-default px-2 py-1.5 text-body-2-medium text-text-primary shadow-xs outline-none focus-visible:ring-2 focus-visible:ring-border-focus-ring"
            >
              {["All", "Active", "On leave", "Probation"].map((s) => (
                <option key={s}>{s}</option>
              ))}
            </select>
          </div>
        </div>
        {teamFilter && (
          <div className="flex items-center gap-2">
            <span className="rounded-full bg-accent-500 px-2.5 py-1 text-body-2-medium text-white">Team: {teamFilter}</span>
            <button type="button" onClick={() => setTeamFilter(null)} className="cursor-pointer text-body-2-medium text-text-secondary underline outline-none hover:text-text-primary focus-visible:ring-2 focus-visible:ring-border-focus-ring">
              Clear
            </button>
          </div>
        )}
        <div className="w-full overflow-x-auto">
          <table className="w-full min-w-[720px] border-collapse text-start">
            <thead>
              <tr className="border-b border-border-table">
                <th className="py-2 pe-2 text-start">
                  <button type="button" onClick={() => toggleSort("name")} className="cursor-pointer text-body-2-medium text-text-tertiary outline-none hover:text-text-primary focus-visible:ring-2 focus-visible:ring-border-focus-ring">
                    Employee {sortKey === "name" ? (sortDir === 1 ? "↑" : "↓") : ""}
                  </button>
                </th>
                <th className="py-2 pe-2 text-start text-body-2-medium text-text-tertiary">Role</th>
                <th className="py-2 pe-2 text-start text-body-2-medium text-text-tertiary">Team</th>
                <th className="py-2 pe-2 text-start text-body-2-medium text-text-tertiary">Location</th>
                <th className="py-2 pe-2 text-start">
                  <button type="button" onClick={() => toggleSort("start")} className="cursor-pointer text-body-2-medium text-text-tertiary outline-none hover:text-text-primary focus-visible:ring-2 focus-visible:ring-border-focus-ring">
                    Start date {sortKey === "start" ? (sortDir === 1 ? "↑" : "↓") : ""}
                  </button>
                </th>
                <th className="py-2 pe-2 text-start text-body-2-medium text-text-tertiary">Status</th>
                <th className="py-2 text-end text-body-2-medium text-text-tertiary">Actions</th>
              </tr>
            </thead>
            <tbody>
              {pageRows.map((e) => (
                <tr key={e.name} className="border-b border-border-table last:border-b-0">
                  <td className="py-2 pe-2">
                    <span className="flex items-center gap-2">
                      <span className="inline-flex size-8 shrink-0 items-center justify-center rounded-full bg-background-tertiary-default text-body-2-medium text-text-secondary">
                        {initialsOf(e.name)}
                      </span>
                      <span className="whitespace-nowrap text-body-medium text-text-primary">{e.name}</span>
                    </span>
                  </td>
                  <td className="whitespace-nowrap py-2 pe-2 text-body-medium text-text-secondary">{e.role}</td>
                  <td className="whitespace-nowrap py-2 pe-2 text-body-medium text-text-secondary">{e.team}</td>
                  <td className="whitespace-nowrap py-2 pe-2 text-body-medium text-text-secondary">{e.location}</td>
                  <td className="whitespace-nowrap py-2 pe-2 text-body-medium text-text-primary tabular-nums">{e.start}</td>
                  <td className="py-2 pe-2">
                    <span className={cx("inline-block whitespace-nowrap rounded-full px-2.5 py-1 text-body-2-medium", STATUS_STYLE[e.status])}>
                      {e.status}
                    </span>
                  </td>
                  <td className="py-2 text-end">
                    <span className="inline-flex gap-1">
                      <button type="button" aria-label={`View ${e.name}`} onClick={() => setViewEmployee(e)} className="inline-flex size-8 cursor-pointer items-center justify-center rounded-full text-foreground-icon-secondary outline-none hover:bg-background-tertiary-default focus-visible:ring-2 focus-visible:ring-border-focus-ring">
                        <RiEyeLine className="size-4" aria-hidden />
                      </button>
                      <button
                        type="button"
                        aria-label={`Remove ${e.name}`}
                        onClick={() => {
                          setRemoved((prev) => [...prev, e.name]);
                          setToast(`${e.name} removed from this view.`);
                          window.setTimeout(() => setToast(null), 3500);
                        }}
                        className="inline-flex size-8 cursor-pointer items-center justify-center rounded-full text-foreground-icon-secondary outline-none hover:bg-background-tertiary-default hover:text-text-error-primary focus-visible:ring-2 focus-visible:ring-border-focus-ring"
                      >
                        <RiDeleteBinLine className="size-4" aria-hidden />
                      </button>
                    </span>
                  </td>
                </tr>
              ))}
              {pageRows.length === 0 && (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-body-regular text-text-secondary">No employees match these filters.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        <div className="flex flex-wrap items-center justify-between gap-2">
          <p className="text-body-2-regular text-text-tertiary">Page {safePage} of {totalPages} · {perPage} per page</p>
          <nav className="flex items-center gap-1" aria-label="Employee pages">
            <button type="button" disabled={safePage <= 1} onClick={() => setPage((p) => Math.max(1, p - 1))} className="cursor-pointer rounded-lg px-2.5 py-1.5 text-body-2-medium text-text-secondary outline-none hover:bg-background-tertiary-default focus-visible:ring-2 focus-visible:ring-border-focus-ring disabled:cursor-default disabled:opacity-40">
              Previous
            </button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((n) => (
              <button
                key={n}
                type="button"
                aria-current={n === safePage ? "page" : undefined}
                onClick={() => setPage(n)}
                className={cx(
                  "size-8 cursor-pointer rounded-lg text-body-2-medium outline-none transition-colors focus-visible:ring-2 focus-visible:ring-border-focus-ring",
                  n === safePage ? "bg-accent-500 text-white" : "text-text-secondary hover:bg-background-tertiary-default",
                )}
              >
                {n}
              </button>
            ))}
            <button type="button" disabled={safePage >= totalPages} onClick={() => setPage((p) => Math.min(totalPages, p + 1))} className="cursor-pointer rounded-lg px-2.5 py-1.5 text-body-2-medium text-text-secondary outline-none hover:bg-background-tertiary-default focus-visible:ring-2 focus-visible:ring-border-focus-ring disabled:cursor-default disabled:opacity-40">
              Next
            </button>
          </nav>
        </div>
      </section>

      {/* View employee dialog */}
      {viewEmployee && (
        <div className="fixed inset-0 z-50 flex items-end justify-center p-3 sm:items-center" role="dialog" aria-modal="true" aria-label="Employee profile">
          <button type="button" aria-label="Close employee profile" onClick={() => setViewEmployee(null)} className="absolute inset-0 cursor-pointer bg-black/40" />
          <div className="relative w-full max-w-[420px] rounded-3xl border border-border-button-default bg-background-primary-default p-5 shadow-dropdown">
            <div className="flex items-start justify-between gap-2">
              <span className="inline-flex size-12 items-center justify-center rounded-full bg-background-tertiary-default text-title-3-semibold text-text-secondary">
                {initialsOf(viewEmployee.name)}
              </span>
              <button type="button" aria-label="Close" onClick={() => setViewEmployee(null)} className="flex size-8 cursor-pointer items-center justify-center rounded-full text-foreground-icon-secondary outline-none hover:bg-background-tertiary-default focus-visible:ring-2 focus-visible:ring-border-focus-ring">
                <RiCloseLine className="size-5" aria-hidden />
              </button>
            </div>
            <p className="mt-3 text-title-2-medium text-text-primary">{viewEmployee.name}</p>
            <div className="mt-3 flex flex-col gap-2">
              {[
                ["Role", viewEmployee.role],
                ["Team", viewEmployee.team],
                ["Location", viewEmployee.location],
                ["Start date", viewEmployee.start],
                ["Status", viewEmployee.status],
              ].map(([label, value]) => (
                <div key={label} className="flex items-center justify-between rounded-xl bg-background-inner-default px-3 py-2.5">
                  <span className="text-body-2-regular text-text-secondary">{label}</span>
                  <span className="text-body-medium text-text-primary">{value}</span>
                </div>
              ))}
            </div>
            <div className="mt-5 flex justify-end">
              <Button variant="primary" size="medium" onClick={() => setViewEmployee(null)}>Done</Button>
            </div>
          </div>
        </div>
      )}

      {/* Add employee dialog */}
      {hireOpen && (
        <div className="fixed inset-0 z-50 flex items-end justify-center p-3 sm:items-center" role="dialog" aria-modal="true" aria-label="Add employee">
          <button type="button" aria-label="Close add employee" onClick={() => setHireOpen(false)} className="absolute inset-0 cursor-pointer bg-black/40" />
          <div className="relative w-full max-w-[420px] rounded-3xl border border-border-button-default bg-background-primary-default p-5 shadow-dropdown">
            <div className="flex items-start justify-between gap-2">
              <p className="text-title-2-medium text-text-primary">Add employee</p>
              <button type="button" aria-label="Close" onClick={() => setHireOpen(false)} className="flex size-8 cursor-pointer items-center justify-center rounded-full text-foreground-icon-secondary outline-none hover:bg-background-tertiary-default focus-visible:ring-2 focus-visible:ring-border-focus-ring">
                <RiCloseLine className="size-5" aria-hidden />
              </button>
            </div>
            <label className="mt-4 block">
              <span className="text-body-medium text-text-primary">Name</span>
              <input autoFocus value={hireName} onChange={(e) => setHireName(e.target.value)} onKeyDown={(e) => { if (e.key === "Enter") addHire(); }} placeholder="Full name" aria-label="Employee name" className="mt-1.5 w-full rounded-xl border border-border-button-default bg-background-tertiary-default px-3 py-2 text-body-regular text-text-primary outline-none placeholder:text-text-tertiary focus-visible:ring-2 focus-visible:ring-border-focus-ring" />
            </label>
            <label className="mt-3 block">
              <span className="text-body-medium text-text-primary">Role</span>
              <input value={hireRole} onChange={(e) => setHireRole(e.target.value)} onKeyDown={(e) => { if (e.key === "Enter") addHire(); }} placeholder="Role" aria-label="Employee role" className="mt-1.5 w-full rounded-xl border border-border-button-default bg-background-tertiary-default px-3 py-2 text-body-regular text-text-primary outline-none placeholder:text-text-tertiary focus-visible:ring-2 focus-visible:ring-border-focus-ring" />
            </label>
            <label className="mt-3 block">
              <span className="text-body-medium text-text-primary">Team</span>
              <select value={hireTeam} onChange={(e) => setHireTeam(e.target.value)} aria-label="Employee team" className="mt-1.5 w-full cursor-pointer rounded-xl border border-border-button-default bg-background-tertiary-default px-3 py-2 text-body-regular text-text-primary outline-none focus-visible:ring-2 focus-visible:ring-border-focus-ring">
                {TEAMS.map((t) => (
                  <option key={t.name}>{t.name}</option>
                ))}
              </select>
            </label>
            <div className="mt-5 flex justify-end gap-2">
              <Button variant="secondary" size="medium" onClick={() => setHireOpen(false)}>Cancel</Button>
              <Button variant="primary" size="medium" leadingIcon={RiUserSharedLine} onClick={addHire}>Add employee</Button>
            </div>
          </div>
        </div>
      )}

      {toast && (
        <div className="fixed bottom-4 left-1/2 z-[60] -translate-x-1/2 rounded-full bg-background-primary-default px-4 py-2 text-body-medium text-text-primary shadow-dropdown" role="status">
          {toast}
        </div>
      )}
    </HrShell>
  );
}
