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
import { Bar, ComposedChart, Line, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

import {
  DASHBOARD_NAV,
  DashboardSidebar,
} from "@/components/application/dashboard/dashboard-sidebar";
import { AllTemplatesButton } from "@/components/application/template-switcher/all-templates-button";
import { NotificationBell } from "@/components/application/app-shell/notification-bell";
import { Avatar } from "@/components/base/avatar/avatar";
import { Select, SelectItem } from "@/components/base/select/select";
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
  // Height follows the preview container when embedded in a docs preview
  // (--template-preview-height set by TemplatePreview), and falls back to
  // the full viewport on the standalone route.
  return (
    <div className="relative flex h-[var(--template-preview-height,100dvh)] w-full gap-4 overflow-hidden bg-background-full p-3">
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
 * attrition and time-to-hire, where down is good. */
type Kpi = { label: string; value: string; delta: string; up: boolean; good?: boolean };

/* Single KPI set, from the live template: no period switcher on the original. */
const KPIS: Kpi[] = [
  { label: "Employees", value: "248", delta: "+4.2%", up: true },
  { label: "Open roles", value: "12", delta: "+8.3%", up: true },
  { label: "Time to hire", value: "24 days", delta: "-8.3%", up: false, good: true },
  { label: "Attrition", value: "3.8%", delta: "-0.6%", up: false, good: true },
];

const FUNNEL = [
  { stage: "Applications", value: 412 },
  { stage: "Screens", value: 156 },
  { stage: "Interviews", value: 68 },
  { stage: "Offers", value: 21 },
  { stage: "Hires", value: 12 },
];

const RADAR_AXES = ["Growth", "Compensation", "Culture", "Management", "Balance", "Tools"];
// Q3 survey, all teams: average 80/100 ("Strong").
const RADAR_SCORES = [84, 71, 88, 79, 66, 91];

/**
 * Monthly hires (bars) vs attrition % (line), Jan–Dec. The original only
 * exposes the totals in text — 146 hires this year, attrition averaging
 * 4.3% — so the monthly split below is reconstructed to reconcile with
 * those totals (hires sum to 146, attrition averages 4.3%), not copied
 * from the original's chart data.
 */
const HIRES_ATTRITION = [
  { month: "Jan", hires: 9, attrition: 4.8 },
  { month: "Feb", hires: 11, attrition: 4.5 },
  { month: "Mar", hires: 13, attrition: 4.2 },
  { month: "Apr", hires: 10, attrition: 4.6 },
  { month: "May", hires: 12, attrition: 4.1 },
  { month: "Jun", hires: 14, attrition: 3.9 },
  { month: "Jul", hires: 11, attrition: 4.4 },
  { month: "Aug", hires: 13, attrition: 4.2 },
  { month: "Sep", hires: 15, attrition: 3.8 },
  { month: "Oct", hires: 12, attrition: 4.5 },
  { month: "Nov", hires: 14, attrition: 4.3 },
  { month: "Dec", hires: 12, attrition: 4.3 },
];

const TEAMS = [
  { name: "Engineering", count: 96, color: "var(--color-chart-1)" },
  { name: "Sales", count: 44, color: "var(--color-chart-2)" },
  { name: "Support", count: 38, color: "var(--color-chart-3)" },
  { name: "Marketing", count: 26, color: "var(--color-chart-4)" },
  { name: "Design", count: 22, color: "var(--color-chart-5)" },
];

const RECENT_HIRES = [
  { name: "Livia Saris", role: "Backend Engineer", team: "Sales", when: "Joined today", avatar: "/avatars/livia-saris.webp" },
  { name: "Jaydon Aminoff", role: "UI Designer", team: "Support", when: "2 days ago", avatar: "/avatars/jaydon-aminoff.webp" },
  { name: "Maria Lubin", role: "User Researcher", team: "Marketing", when: "5 days ago", avatar: "/avatars/maria-lubin.webp" },
  { name: "Ann Press", role: "DevOps Engineer", team: "Operations", when: "A week ago", avatar: "/avatars/ann-press.webp" },
];

type Employee = {
  name: string;
  role: string;
  team: string;
  start: string;
  status: "Active" | "On leave" | "Contract";
  salary: string;
  avatar?: string;
};

const EMPLOYEES: Employee[] = [
  { name: "John Clarkson", role: "Backend Engineer", team: "Engineering", start: "Apr 06, 2023", status: "Active", salary: "$78K", avatar: "/avatars/john-clarkson.webp" },
  { name: "Aspen Lubin", role: "Legal Counsel", team: "Operations", start: "Mar 03, 2026", status: "Active", salary: "$125K", avatar: "/avatars/aspen-lubin.webp" },
  { name: "Michael Ekstrom", role: "Finance Ops", team: "Operations", start: "Jun 19, 2026", status: "Active", salary: "$48K", avatar: "/avatars/michael-ekstrom.webp" },
  { name: "Kianna Vaccaro", role: "Design Lead", team: "Design", start: "Oct 05, 2025", status: "Active", salary: "$64K", avatar: "/avatars/kianna-vaccaro.webp" },
  { name: "Livia Saris", role: "SDR", team: "Sales", start: "Nov 19, 2025", status: "Contract", salary: "$147K", avatar: "/avatars/livia-saris.webp" },
  { name: "Jaydon Aminoff", role: "Support Specialist", team: "Support", start: "Nov 27, 2025", status: "Active", salary: "$103K", avatar: "/avatars/jaydon-aminoff.webp" },
  { name: "Maria Lubin", role: "Content Lead", team: "Marketing", start: "Oct 05, 2024", status: "On leave", salary: "$88K", avatar: "/avatars/maria-lubin.webp" },
  { name: "Ann Press", role: "Legal Counsel", team: "Operations", start: "Jul 22, 2022", status: "Active", salary: "$110K", avatar: "/avatars/ann-press.webp" },
  { name: "Dulce Calzoni", role: "Product Designer", team: "Design", start: "Aug 03, 2024", status: "Active", salary: "$65K" },
  { name: "Gretchen Rosser", role: "User Researcher", team: "Design", start: "Jan 24, 2025", status: "Active", salary: "$78K" },
];

function initialsOf(name: string) {
  return name.split(" ").map((w) => w[0]).join("").slice(0, 2).toUpperCase();
}

function salaryInBand(salary: string, band: string) {
  const value = Number(salary.replace(/[^0-9]/g, ""));
  if (band === "Under $60K") return value < 60;
  if (band === "$60K – $90K") return value >= 60 && value <= 90;
  if (band === "$90K – $120K") return value > 90 && value <= 120;
  if (band === "Over $120K") return value > 120;
  return true;
}

/** Radar chart (hexagon, 6 axes) with hover tooltips. */
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
    </svg>
  );
}

export default function HrManagementTemplatePage() {
  const [funnelStage, setFunnelStage] = useState<number | null>(null);
  const [radarHover, setRadarHover] = useState<{ axis: string; value: number } | null>(null);
  const [teamFilter, setTeamFilter] = useState<string | null>(null);
  const [query, setQuery] = useState("");
  const [departmentFilter, setDepartmentFilter] = useState("All departments");
  const [statusFilter, setStatusFilter] = useState("All statuses");
  const [salaryFilter, setSalaryFilter] = useState("All salaries");
  const [statusOverrides, setStatusOverrides] = useState<Record<string, Employee["status"]>>({});
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

  const maxTeam = Math.max(...TEAMS.map((t) => t.count));

  const employees = useMemo(() => {
    let rows = [...extraHires, ...EMPLOYEES]
      .map((e) => ({ ...e, status: statusOverrides[e.name] ?? e.status }))
      .filter((e) => !removed.includes(e.name));
    if (teamFilter) rows = rows.filter((e) => e.team === teamFilter);
    if (departmentFilter !== "All departments") rows = rows.filter((e) => e.team === departmentFilter);
    if (statusFilter !== "All statuses") rows = rows.filter((e) => e.status === statusFilter);
    if (salaryFilter !== "All salaries") rows = rows.filter((e) => salaryInBand(e.salary, salaryFilter));
    if (query.trim()) {
      const q = query.trim().toLowerCase();
      rows = rows.filter((e) => `${e.name} ${e.role} ${e.team}`.toLowerCase().includes(q));
    }
    if (sortKey === "name") rows = [...rows].sort((a, b) => sortDir * a.name.localeCompare(b.name));
    if (sortKey === "start") rows = [...rows].sort((a, b) => sortDir * (new Date(a.start).getTime() - new Date(b.start).getTime()));
    return rows;
  }, [extraHires, removed, teamFilter, departmentFilter, statusFilter, salaryFilter, statusOverrides, query, sortKey, sortDir]);

  const perPage = 10;
  // The original ships 248 employees across 25 pages; only the first
  // page's 10 rows are recoverable from the live page, so later pages
  // show the empty state.
  const totalPages = 25;
  const safePage = Math.min(page, totalPages);
  const pageRows = safePage === 1 ? employees.slice(0, perPage) : [];
  const pageNumbers: (number | "…")[] = (() => {
    if (totalPages <= 7) return Array.from({ length: totalPages }, (_, i) => i + 1);
    if (safePage <= 3) return [1, 2, 3, 4, 5, "…", totalPages];
    if (safePage >= totalPages - 2) return [1, "…", totalPages - 4, totalPages - 3, totalPages - 2, totalPages - 1, totalPages];
    return [1, "…", safePage - 1, safePage, safePage + 1, "…", totalPages];
  })();

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
      { name, role, team: hireTeam, start: "Nov 6, 2026", status: "Active", salary: "—" },
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
          <Button variant="secondary" size="medium" leadingIcon={RiFilter3Fill} onClick={() => setStatusFilter(statusFilter === "All statuses" ? "Active" : "All statuses")}>
            {statusFilter === "All statuses" ? "Filters" : `Status: ${statusFilter}`}
          </Button>
          <Button variant="primary" size="medium" leadingIcon={RiAddFill} onClick={() => setHireOpen(true)}>
            Add employee
          </Button>
        </>
      }
    >
      {/* Headcount KPIs */}
      <div className="grid w-full grid-cols-2 gap-4 xl:grid-cols-4">
        {KPIS.map((kpi) => (
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

      {/* Recent hires */}
      <section className="flex w-full flex-col gap-3 rounded-2xl bg-background-secondary-default p-4">
        <div className="flex items-center gap-2">
          <RiUserAddLine className="size-5 text-foreground-icon-primary" aria-hidden />
          <p className="text-body-medium text-text-secondary">Recent hires</p>
          <span className="text-body-2-medium text-text-tertiary tabular-nums">56</span>
        </div>
        <p className="text-body-2-regular text-text-tertiary">Board team</p>
        <div className="grid w-full gap-2 sm:grid-cols-2 xl:grid-cols-4">
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
              <Avatar size="sm" src={h.avatar} alt={h.name} initials={initialsOf(h.name)} />
              <span className="min-w-0">
                <span className="block truncate text-body-medium text-text-primary">{h.name}</span>
                <span className="block truncate text-body-2-regular text-text-tertiary">{h.when}</span>
                <span className="block truncate text-body-2-regular text-text-tertiary">{h.role}</span>
              </span>
            </button>
          ))}
        </div>
        <div className="flex items-center gap-1">
          <button type="button" disabled aria-label="Previous hires" className="cursor-pointer rounded-lg px-2.5 py-1.5 text-body-2-medium text-text-secondary outline-none hover:bg-background-tertiary-default focus-visible:ring-2 focus-visible:ring-border-focus-ring disabled:cursor-default disabled:opacity-40">
            Previous
          </button>
          <button type="button" disabled aria-label="Next hires" className="cursor-pointer rounded-lg px-2.5 py-1.5 text-body-2-medium text-text-secondary outline-none hover:bg-background-tertiary-default focus-visible:ring-2 focus-visible:ring-border-focus-ring disabled:cursor-default disabled:opacity-40">
            Next
          </button>
        </div>
      </section>

      <div className="flex w-full flex-col gap-4 xl:flex-row">
        {/* Hiring pipeline */}
        <section className="flex min-w-0 flex-1 flex-col gap-3 rounded-2xl bg-background-secondary-default p-4">
          <div className="flex items-center justify-between gap-2">
            <p className="text-body-medium text-text-secondary">Hiring pipeline</p>
          </div>
          <div className="flex items-baseline gap-2">
            <p className="text-title-1-medium text-text-primary tabular-nums">412</p>
            <span className="flex items-center gap-0.5 rounded-full bg-status-lime-background px-2 py-0.5 text-body-2-medium text-status-lime-text">
              <RiArrowUpSLine className="size-3.5" aria-hidden />
              +6.2%
            </span>
            <span className="text-body-2-medium text-text-tertiary">Last 30 days</span>
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
                    </span>
                  </span>
                  <span className="mt-2 block h-2 w-full overflow-hidden rounded-full bg-background-tertiary-default">
                    <span className="block h-full rounded-full bg-chart-2" style={{ width: `${Math.max(pct, 2)}%` }} />
                  </span>
                  <span className="mt-1 block text-end text-body-2-regular text-text-tertiary tabular-nums">{pct}%</span>
                  {active && conv && <span className="mt-1.5 block text-body-2-regular text-text-secondary">{conv} · {stage.value} candidates</span>}
                  {active && !conv && <span className="mt-1.5 block text-body-2-regular text-text-secondary">All applicants enter here.</span>}
                </button>
              );
            })}
          </div>
          <div className="flex flex-col gap-1.5 border-t border-separator-border pt-3">
            {FUNNEL.map((stage) => (
              <div key={stage.stage} className="flex items-center justify-between gap-2">
                <span className="text-body-medium text-text-primary">{stage.stage}</span>
                <span className="text-body-medium text-text-primary tabular-nums">{stage.value.toLocaleString("en-US")}</span>
              </div>
            ))}
          </div>
        </section>

        {/* Engagement radar */}
        <section className="flex min-w-0 flex-1 flex-col gap-3 rounded-2xl bg-background-secondary-default p-4">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <p className="text-body-medium text-text-secondary">Team engagement</p>
            <span className="text-body-2-medium text-text-tertiary">Q3 survey</span>
          </div>
          <EngagementRadar
            values={RADAR_SCORES}
            onHover={(axis, value) => setRadarHover(axis && value !== null ? { axis, value } : null)}
          />
          <div className="grid grid-cols-3 gap-2">
            {RADAR_AXES.map((axis, i) => (
              <div key={axis} className="flex flex-col items-center gap-0.5 rounded-xl bg-background-inner-default px-2 py-2">
                <span className="text-body-2-regular text-text-tertiary">{axis}</span>
                <span className="text-body-medium text-text-primary tabular-nums">{RADAR_SCORES[i]}</span>
              </div>
            ))}
          </div>
          <div className="flex flex-col items-center gap-0.5">
            <p className="text-title-1-medium text-text-primary tabular-nums">80</p>
            <p className="text-body-medium text-text-secondary">Strong</p>
          </div>
          <p className="min-h-5 text-center text-body-medium text-text-primary tabular-nums" aria-live="polite">
            {radarHover ? `${radarHover.axis}: ${radarHover.value}/100` : ""}
          </p>
        </section>
      </div>

      <div className="flex w-full flex-col gap-4 xl:flex-row">
        {/* Hires vs attrition */}
        <section className="flex min-w-0 flex-1 flex-col gap-3 rounded-2xl bg-background-secondary-default p-4">
          <div className="flex items-center justify-between gap-2">
            <p className="text-body-medium text-text-secondary">Hires · Attrition 4.3%</p>
          </div>
          <div className="flex items-baseline gap-2">
            <p className="text-title-1-medium text-text-primary tabular-nums">146</p>
            <span className="flex items-center gap-0.5 rounded-full bg-status-lime-background px-2 py-0.5 text-body-2-medium text-status-lime-text">
              <RiArrowUpSLine className="size-3.5" aria-hidden />
              +8.4%
            </span>
            <span className="text-body-2-medium text-text-tertiary">This year</span>
          </div>
          <div className="h-[220px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart data={HIRES_ATTRITION} margin={{ top: 4, right: 4, bottom: 0, left: 0 }} barCategoryGap="28%">
                <YAxis yAxisId="left" width={30} domain={[0, 18]} ticks={[0, 6, 12, 18]} tickLine={false} axisLine={false} tick={{ fontSize: 12, fill: "var(--color-text-tertiary)" }} />
                <YAxis yAxisId="right" orientation="right" width={36} domain={[0, 6]} ticks={[0, 2, 4, 6]} tickFormatter={(v: number) => `${v}%`} tickLine={false} axisLine={false} tick={{ fontSize: 12, fill: "var(--color-text-tertiary)" }} />
                <XAxis dataKey="month" ticks={["Jan", "Mar", "May", "Jul", "Sep", "Dec"]} tickLine={false} axisLine={false} tickMargin={8} tick={{ fontSize: 12, fill: "var(--color-text-tertiary)" }} />
                <Tooltip
                  cursor={{ fill: "var(--color-background-tertiary-default)" }}
                  content={({ active, payload }) =>
                    active && payload?.length ? (
                      <span className="rounded-lg bg-background-primary-default px-2.5 py-1.5 text-body-2-medium text-text-primary shadow-dropdown">
                        {payload[0].payload.month}: {payload[0].payload.hires} hires, {payload[0].payload.attrition}% attrition
                      </span>
                    ) : null
                  }
                />
                <Bar yAxisId="left" dataKey="hires" fill="var(--color-chart-2)" radius={[4, 4, 0, 0]} />
                <Line yAxisId="right" type="monotone" dataKey="attrition" stroke="var(--color-chart-5)" strokeWidth={2} dot={false} />
              </ComposedChart>
            </ResponsiveContainer>
          </div>
          <p className="text-body-2-regular text-text-tertiary">Hires · total</p>
          <p className="text-body-medium text-text-primary tabular-nums">146</p>
          <p className="text-body-2-regular text-text-tertiary">Attrition · average</p>
          <p className="text-body-medium text-text-primary tabular-nums">4.3%</p>
        </section>

        {/* Departments */}
        <section className="flex min-w-0 flex-1 flex-col gap-3 rounded-2xl bg-background-secondary-default p-4">
          <div className="flex items-center justify-between gap-2">
            <p className="text-body-medium text-text-secondary">Departments</p>
          </div>
          <p className="text-caption-1-medium uppercase text-text-tertiary">People</p>
          <div className="flex flex-col gap-2">
            {TEAMS.map((team) => {
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
                    </span>
                  </span>
                  <span className="mt-2 block h-2 w-full overflow-hidden rounded-full bg-background-tertiary-default">
                    <span className="block h-full rounded-full" style={{ width: `${(team.count / maxTeam) * 100}%`, backgroundColor: team.color }} />
                  </span>
                </button>
              );
            })}
          </div>
          <p className="text-body-2-regular text-text-tertiary">Total Results</p>
          <p className="text-body-medium text-text-primary tabular-nums">248 employees</p>
          <p className="text-body-2-regular text-text-tertiary">
            {teamFilter ? `Filtering the employee table to ${teamFilter} — tap again to clear.` : "Tap a team to filter the employee table below."}
          </p>
        </section>
      </div>

      {/* Employee table */}
      <section id="employee-table" className="flex w-full scroll-mt-4 flex-col gap-3 rounded-2xl bg-background-secondary-default p-4">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <RiBriefcaseLine className="size-5 text-foreground-icon-primary" aria-hidden />
            <p className="text-body-medium text-text-secondary">Employees</p>
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
            <Select
              aria-label="Filter by department"
              selectedKey={departmentFilter}
              onSelectionChange={(key) => {
                if (typeof key === "string") {
                  setDepartmentFilter(key);
                  setPage(1);
                }
              }}
              className="w-[172px]"
            >
              {["All departments", "Engineering", "Design", "Sales", "Marketing", "Support", "Operations"].map((d) => (
                <SelectItem key={d} id={d} textValue={d}>{d}</SelectItem>
              ))}
            </Select>
            <Select
              aria-label="Filter by employment status"
              selectedKey={statusFilter}
              onSelectionChange={(key) => {
                if (typeof key === "string") {
                  setStatusFilter(key);
                  setPage(1);
                }
              }}
              className="w-[132px]"
            >
              {["All statuses", "Active", "On leave", "Contract"].map((st) => (
                <SelectItem key={st} id={st} textValue={st}>{st}</SelectItem>
              ))}
            </Select>
            <Select
              aria-label="Filter by salary"
              selectedKey={salaryFilter}
              onSelectionChange={(key) => {
                if (typeof key === "string") {
                  setSalaryFilter(key);
                  setPage(1);
                }
              }}
              className="w-[148px]"
            >
              {["All salaries", "Under $60K", "$60K – $90K", "$90K – $120K", "Over $120K"].map((band) => (
                <SelectItem key={band} id={band} textValue={band}>{band}</SelectItem>
              ))}
            </Select>
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
                <th className="py-2 pe-2 text-start text-body-2-medium text-text-tertiary">Status</th>
                <th className="py-2 pe-2 text-start text-body-2-medium text-text-tertiary">Department</th>
                <th className="py-2 pe-2 text-start">
                  <button type="button" onClick={() => toggleSort("start")} className="cursor-pointer text-body-2-medium text-text-tertiary outline-none hover:text-text-primary focus-visible:ring-2 focus-visible:ring-border-focus-ring">
                    Start date {sortKey === "start" ? (sortDir === 1 ? "↑" : "↓") : ""}
                  </button>
                </th>
                <th className="py-2 pe-2 text-start text-body-2-medium text-text-tertiary">Salary</th>
                <th className="py-2 text-end text-body-2-medium text-text-tertiary">Actions</th>
              </tr>
            </thead>
            <tbody>
              {pageRows.map((e) => (
                <tr key={e.name} className="border-b border-border-table last:border-b-0">
                  <td className="py-2 pe-2">
                    <span className="flex items-center gap-2">
                      <Avatar size="sm" src={e.avatar} alt={e.name} initials={initialsOf(e.name)} />
                      <span className="min-w-0">
                        <span className="block whitespace-nowrap text-body-medium text-text-primary">{e.name}</span>
                        <span className="block whitespace-nowrap text-body-2-regular text-text-tertiary">{e.role}</span>
                      </span>
                    </span>
                  </td>
                  <td className="py-2 pe-2">
                    <Select
                      aria-label={`Status for ${e.name}`}
                      selectedKey={e.status}
                      onSelectionChange={(key) => {
                        if (typeof key === "string") {
                          setStatusOverrides((prev) => ({ ...prev, [e.name]: key as Employee["status"] }));
                        }
                      }}
                      size="sm"
                      className="w-[128px]"
                    >
                      {(["Active", "On leave", "Contract"] as const).map((st) => (
                        <SelectItem key={st} id={st} textValue={st}>{st}</SelectItem>
                      ))}
                    </Select>
                  </td>
                  <td className="whitespace-nowrap py-2 pe-2 text-body-medium text-text-secondary">{e.team}</td>
                  <td className="whitespace-nowrap py-2 pe-2 text-body-medium text-text-primary tabular-nums">{e.start}</td>
                  <td className="whitespace-nowrap py-2 pe-2 text-body-medium text-text-primary tabular-nums">{e.salary}</td>
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
                  <td colSpan={6} className="py-8 text-center text-body-regular text-text-secondary">No employees match these filters.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        <div className="flex flex-wrap items-center justify-end gap-2">
          <nav className="flex items-center gap-1" aria-label="Employee pages">
            <button type="button" disabled={safePage <= 1} onClick={() => setPage((p) => Math.max(1, p - 1))} className="cursor-pointer rounded-lg px-2.5 py-1.5 text-body-2-medium text-text-secondary outline-none hover:bg-background-tertiary-default focus-visible:ring-2 focus-visible:ring-border-focus-ring disabled:cursor-default disabled:opacity-40">
              Previous
            </button>
            {pageNumbers.map((n) =>
              n === "…" ? (
                <span key="ellipsis" className="px-1 text-body-2-medium text-text-tertiary">…</span>
              ) : (
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
              ),
            )}
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
              <Avatar size="lg" src={viewEmployee.avatar} alt={viewEmployee.name} initials={initialsOf(viewEmployee.name)} />
              <button type="button" aria-label="Close" onClick={() => setViewEmployee(null)} className="flex size-8 cursor-pointer items-center justify-center rounded-full text-foreground-icon-secondary outline-none hover:bg-background-tertiary-default focus-visible:ring-2 focus-visible:ring-border-focus-ring">
                <RiCloseLine className="size-5" aria-hidden />
              </button>
            </div>
            <p className="mt-3 text-title-2-medium text-text-primary">{viewEmployee.name}</p>
            <div className="mt-3 flex flex-col gap-2">
              {[
                ["Role", viewEmployee.role],
                ["Department", viewEmployee.team],
                ["Start date", viewEmployee.start],
                ["Salary", viewEmployee.salary],
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
