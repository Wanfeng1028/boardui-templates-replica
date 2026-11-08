"use client";

import {
  RiAddFill,
  RiArchiveLine,
  RiArrowDownSLine,
  RiArrowLeftLine,
  RiArrowRightLine,
  RiCalendarLine,
  RiChat3Line,
  RiCheckLine,
  RiCloseLine,
  RiDeleteBin6Line,
  RiDownload2Line,
  RiEditLine,
  RiFileCopyLine,
  RiFilePaper2Line,
  RiFilter3Fill,
  RiMenuLine,
  RiMore2Fill,
  RiPhoneLine,
  RiSearchLine,
  RiShakeHandsLine,
  RiTeamLine,
  RiTimeLine,
  RiUserAddLine,
  RiUserLine,
  RiUserMinusLine,
  RiUserSearchLine,
  RiUserSharedLine,
} from "@remixicon/react";
import { useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import { Focusable } from "react-aria-components";
import { Bar, ComposedChart, Line, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

import {
  DASHBOARD_NAV,
  DashboardSidebar,
} from "@/components/application/dashboard/dashboard-sidebar";
import { AllTemplatesButton } from "@/components/application/template-switcher/all-templates-button";
import { DocumentTitle } from "@/components/application/app-shell/document-title";
import { NotificationBell } from "@/components/application/app-shell/notification-bell";
import { Avatar } from "@/components/base/avatar/avatar";
import { Select, SelectItem } from "@/components/base/select/select";
import { Breadcrumb, BreadcrumbItem } from "@/components/base/breadcrumb/breadcrumb";
import { Button } from "@/components/base/buttons/button";
import { IconButton } from "@/components/base/buttons/icon-button";
import { Checkbox } from "@/components/base/checkbox/checkbox";
import { Chip, type ChipColor } from "@/components/base/badges/chip";
import { StatusDot } from "@/components/base/badges/status-dot";
import { ChevronDownSmall, ChevronSortDown } from "@/components/foundations/icons/chevrons";
import {
  Dropdown,
  DropdownTrigger,
  DropdownPopover,
  DropdownGroup,
  DropdownItem,
} from "@/components/base/dropdown/dropdown";
import { Tooltip as AriaTooltip, TooltipTrigger } from "@/components/base/tooltip/tooltip";
import { cx } from "@/utils/cx";

/**
 * HR Management template — aligned to the original live demo at
 * boardui.com/templates/hr.
 *
 * Sources (2026-11-08): the original SSR (`boardui-audit/orig/hr.html`,
 * 284KB) plus the original's own shipped client chunks, downloaded from
 * boardui.com and kept under
 * `audit/shots/hr-refix-20261108/chunks/`:
 *   - `2tsnqzsbljhb-.js` — the HR page module: the seeded employee
 *     generator (248 rows), funnel/radar/hires period ranges, breakdown
 *     tab data, table/filter/sort/pagination behaviour.
 *   - `3fg6q12on6wg_.js` — the shared period-dropdown + chart-header
 *     components (trigger, menu, delta formatting).
 * Nothing in this file is invented: every number, label and menu item
 * below is copied from those two sources. Where the original renders a
 * control with no behaviour in its own JS (Filters button, Board team
 * button, Edit button), this replica renders the same inert trigger.
 * Built only from free BoardUI components. Not the Pro source.
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
                HR Team
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
                <h1 className="px-1 text-title-2-medium whitespace-nowrap text-text-primary">HR Team</h1>
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
/* Data — all values copied from the original's shipped JS chunk       */
/* ------------------------------------------------------------------ */

/* `tone` is whether the delta reads as good (lime chip) or neutral
 * (grey chip) on the original — Open roles is the only neutral one. */
type Kpi = { label: string; value: string; delta: string; tone: "good" | "neutral"; icon: typeof RiTeamLine };

/* Single KPI set, from the original: no period switcher on the original. */
const KPIS: Kpi[] = [
  { label: "Employees", value: "248", delta: "+4.2%", tone: "good", icon: RiTeamLine },
  { label: "Open roles", value: "12", delta: "+8.3%", tone: "neutral", icon: RiUserSearchLine },
  { label: "Time to hire", value: "24 days", delta: "-8.3%", tone: "good", icon: RiTimeLine },
  { label: "Attrition", value: "3.8%", delta: "-0.6%", tone: "good", icon: RiUserMinusLine },
];

/** Delta chip text + colour, exactly as the original's describeDelta:
 *  +x.x% lime, -x.x% rose, 0.0% neutral. */
function formatDelta(delta: number): { label: string; color: "lime" | "rose" | "neutral" } {
  const v = Math.round(1000 * Math.abs(delta)) / 10;
  if (v === 0) return { label: "0.0%", color: "neutral" };
  return { label: `${delta > 0 ? "+" : "-"}${v}%`, color: delta > 0 ? "lime" : "rose" };
}

function DeltaChip({ delta }: { delta: number }) {
  const { label, color } = formatDelta(delta);
  return (
    <span
      className={cx(
        "inline-flex items-center justify-center rounded-md px-1.5 py-0.5 text-body-medium whitespace-nowrap",
        color === "lime" && "bg-status-lime-background text-status-lime-text",
        color === "rose" && "bg-status-rose-background text-status-rose-text",
        color === "neutral" && "bg-background-tertiary-default text-text-secondary",
      )}
    >
      {label}
    </span>
  );
}

const FUNNEL_STAGES = [
  { stage: "Applications", color: "var(--color-chart-2)", icon: RiFilePaper2Line },
  { stage: "Screens", color: "var(--color-chart-6)", icon: RiPhoneLine },
  { stage: "Interviews", color: "var(--color-chart-5)", icon: RiChat3Line },
  { stage: "Offers", color: "var(--color-chart-3)", icon: RiShakeHandsLine },
  { stage: "Hires", color: "var(--color-chart-8)", icon: RiUserAddLine },
];

/* Hiring-pipeline period ranges, verbatim from the original chunk:
 * Last 30 days (default) / Last 90 days / This year. */
const FUNNEL_RANGES = [
  { id: "30d", label: "Last 30 days", stages: [412, 156, 68, 21, 12], delta: 0.062 },
  { id: "90d", label: "Last 90 days", stages: [1240, 462, 210, 64, 38], delta: 0.048 },
  { id: "year", label: "This year", stages: [4680, 1710, 790, 244, 141], delta: -0.015 },
] as const;

const RADAR_AXES = ["Growth", "Compensation", "Culture", "Management", "Balance", "Tools"];

/* Engagement-survey period ranges, verbatim from the original chunk:
 * Q3 (default) / Q2 / Q1. The Q3 scores are the ones the SSR centre
 * circle averages to 80 ("Strong"). */
const RADAR_RANGES = [
  { id: "q3", label: "Q3 survey", scores: [84, 71, 88, 79, 66, 91] },
  { id: "q2", label: "Q2 survey", scores: [78, 69, 85, 74, 58, 86] },
  { id: "q1", label: "Q1 survey", scores: [74, 72, 81, 70, 62, 79] },
] as const;

/** Centre-circle caption, exactly as the original's radar card:
 *  >=90 Excellent, >=75 Strong, >=50 Fair, else "Needs work". */
function radarCaption(avg: number): string {
  if (avg >= 90) return "Excellent";
  if (avg >= 75) return "Strong";
  if (avg >= 50) return "Fair";
  return "Needs work";
}

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"] as const;

/* Hires-vs-attrition period ranges, verbatim from the original chunk.
 * "This year" hires sum to 146 and attrition averages 4.3%, matching
 * the SSR headline and legend tiles. */
const HIRES_RANGES = [
  {
    id: "year",
    label: "This year",
    months: [...MONTHS],
    hires: [8, 11, 14, 9, 12, 16, 10, 13, 15, 12, 14, 12],
    attrition: [5.2, 4.8, 4.6, 4.9, 4.4, 4.1, 4.3, 4, 3.9, 4.1, 3.8, 3.8],
    delta: 0.084,
  },
  {
    id: "h2",
    label: "Last 6 months",
    months: ["Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
    hires: [10, 13, 15, 12, 14, 12],
    attrition: [4.3, 4, 3.9, 4.1, 3.8, 3.8],
    delta: 0.061,
  },
  {
    id: "prev",
    label: "Last year",
    months: [...MONTHS],
    hires: [6, 8, 10, 7, 9, 12, 8, 10, 11, 9, 11, 10],
    attrition: [6.1, 5.8, 5.6, 5.9, 5.4, 5.2, 5.4, 5.1, 5, 5.2, 4.9, 5],
    delta: -0.032,
  },
] as const;

/* Team-breakdown tab data, verbatim from the original chunk (`et`).
 * Departments has 7 rows (96+44+38+26+22+14+8 = 248); the list shows
 * the first 5 with a "Show 2 more" expander. Hiring sources and
 * Locations are the full 5-row panels. */
const TEAMS = [
  { name: "Engineering", count: 96 },
  { name: "Sales", count: 44 },
  { name: "Support", count: 38 },
  { name: "Marketing", count: 26 },
  { name: "Design", count: 22 },
  { name: "Operations", count: 14 },
  { name: "People", count: 8 },
];

const SOURCES = [
  { name: "Referrals", count: 52 },
  { name: "LinkedIn", count: 38 },
  { name: "Job boards", count: 24 },
  { name: "Inbound", count: 17 },
  { name: "Agencies", count: 10 },
];

const LOCATIONS = [
  { name: "Remote", count: 84 },
  { name: "Berlin", count: 62 },
  { name: "London", count: 48 },
  { name: "New York", count: 34 },
  { name: "Singapore", count: 20 },
];

const BREAKDOWN_TABS = [
  { id: "departments", label: "Departments" },
  { id: "sources", label: "Hiring sources" },
  { id: "locations", label: "Locations" },
] as const;

type BreakdownTab = (typeof BREAKDOWN_TABS)[number]["id"];

/* The Add-employee dialog's Team options are NOT in the original SSR
 * or JS (the original button has no dialog in its shipped code), so
 * these 5 teams are the pre-existing replica choice, kept and marked
 * unverified — do not treat them as original data. */
const DIALOG_TEAMS = ["Engineering", "Sales", "Support", "Marketing", "Design"];

const RECENT_HIRES = [
  { name: "Livia Saris", role: "Backend Engineer", when: "Joined today", avatar: "/avatars/livia-saris.webp" },
  { name: "Jaydon Aminoff", role: "UI Designer", when: "2 days ago", avatar: "/avatars/jaydon-aminoff.webp" },
  { name: "Maria Lubin", role: "User Researcher", when: "5 days ago", avatar: "/avatars/maria-lubin.webp" },
  { name: "Ann Press", role: "DevOps Engineer", when: "A week ago", avatar: "/avatars/ann-press.webp" },
];

type StatusId = "active" | "leave" | "contract";

const STATUS_LABEL: Record<StatusId, string> = {
  active: "Active",
  leave: "On leave",
  contract: "Contract",
};

const STATUS_DOT: Record<StatusId, "green" | "yellow" | "indigo"> = {
  active: "green",
  leave: "yellow",
  contract: "indigo",
};

type Employee = {
  id: string;
  name: string;
  role: string;
  team: string;
  deptColor: ChipColor;
  start: string;
  status: StatusId;
  /** Raw annual salary in dollars; null when unknown (user-added row). */
  salary: number | null;
  avatar?: string;
  initialsColor?: "blue" | "neutral";
};

function initialsOf(name: string) {
  return name.split(" ").map((w) => w[0]).join("").slice(0, 2).toUpperCase();
}

function salaryText(salary: number | null): string {
  return salary === null ? "—" : `$${Math.round(salary / 1000)}K`;
}

function salaryInBand(salary: number | null, band: string) {
  if (salary === null) return false;
  const value = Math.round(salary / 1000);
  if (band === "Under $60K") return value < 60;
  if (band === "$60K – $90K") return value >= 60 && value <= 90;
  if (band === "$90K – $120K") return value > 90 && value <= 120;
  if (band === "Over $120K") return value > 120;
  return true;
}

/**
 * The original's employee generator, copied verbatim from its shipped
 * client chunk: a seeded mulberry32 PRNG (seed 23) plus fixed
 * department/role/name tables generates all 248 employees
 * deterministically. Running it here reproduces exactly the rows the
 * live page shows on pages 1–25 — verified: the first 10 generated
 * rows match the SSR byte-for-byte (name, role, department, start
 * date, status, salary), and the SSR's two pre-checked rows are the
 * generated rows 1 and 2 (Aspen Lubin, Michael Ekstrom).
 */
function generateEmployees(): Employee[] {
  const DEPT_META = [
    { label: "Engineering", color: "blue" },
    { label: "Design", color: "purple" },
    { label: "Sales", color: "lime" },
    { label: "Marketing", color: "yellow" },
    { label: "Support", color: "cyan" },
    { label: "Operations", color: "rose" },
  ] as const;
  const ROLE_MAP: Record<string, string[]> = {
    Engineering: ["Backend Engineer", "Frontend Engineer", "DevOps Engineer", "Engineering Manager", "QA Engineer"],
    Design: ["Product Designer", "UI Designer", "User Researcher", "Design Lead"],
    Sales: ["Account Executive", "Sales Engineer", "SDR", "Head of Sales"],
    Marketing: ["Growth Marketer", "Content Lead", "Performance Marketer", "Brand Designer"],
    Support: ["Support Specialist", "Support Lead", "Technical Writer"],
    Operations: ["People Ops", "Finance Ops", "Office Manager", "Legal Counsel"],
  };
  const NAMED = [
    { name: "John Clarkson", avatar: "/avatars/john-clarkson.webp" },
    { name: "Aspen Lubin", avatar: "/avatars/aspen-lubin.webp" },
    { name: "Michael Ekstrom", avatar: "/avatars/michael-ekstrom.webp" },
    { name: "Kianna Vaccaro", avatar: "/avatars/kianna-vaccaro.webp" },
    { name: "Livia Saris", avatar: "/avatars/livia-saris.webp" },
    { name: "Jaydon Aminoff", avatar: "/avatars/jaydon-aminoff.webp" },
    { name: "Maria Lubin", avatar: "/avatars/maria-lubin.webp" },
    { name: "Ann Press", avatar: "/avatars/ann-press.webp" },
  ];
  const FIRST_NAMES = ["Marcus", "Cheyenne", "Alfredo", "Talan", "Roger", "Cristofer", "Emery", "Kadin", "Nolan", "Ruben", "Skylar", "Hanna", "Corey", "Miracle", "Zaire", "Cooper", "Leilani", "Alena", "Terry", "Jaxson", "Kaiya", "Omar", "Phoenix", "Adison", "Gretchen", "Nova", "Ellis", "Dulce", "Wilson"];
  const LAST_NAMES = ["Culhane", "Herwitz", "Septimus", "Bergson", "Curtis", "Vetrovs", "Rhiel", "Dokidis", "Kenter", "Stanton", "Baptista", "Workman", "Torff", "Calzoni", "Rosser", "Geidt", "Bator", "Vaccaro", "Lipshutz", "Botosh"];
  let seed = 23;
  const rand = () => {
    seed |= 0;
    let e = Math.imul((seed = (seed + 0x6d2b79f5) | 0) ^ (seed >>> 15), 1 | seed);
    return (((e = e + Math.imul(e ^ (e >>> 7), 61 | e) ^ e) ^ (e >>> 14)) >>> 0) / 0x100000000;
  };
  const pick = <T,>(arr: readonly T[]): T => arr[Math.floor(rand() * arr.length)];
  return Array.from({ length: 248 }, (_, a) => {
    const dept = pick(DEPT_META);
    const role = pick(ROLE_MAP[dept.label]);
    const status: StatusId = 0.82 > rand() ? "active" : 0.55 > rand() ? "leave" : "contract";
    const salary = 42000 + 1000 * Math.floor(118 * rand());
    const month = pick(MONTHS);
    const day = 1 + Math.floor(28 * rand());
    const year = 2020 + Math.floor(7 * rand());
    const start = `${month} ${String(day).padStart(2, "0")}, ${year}`;
    const base = {
      id: String(a),
      role,
      team: dept.label,
      deptColor: dept.color as ChipColor,
      status,
      salary,
      start,
    };
    if (a < NAMED.length) {
      return { ...base, name: NAMED[a].name, avatar: NAMED[a].avatar };
    }
    return {
      ...base,
      name: `${pick(FIRST_NAMES)} ${pick(LAST_NAMES)}`,
      initialsColor: rand() > 0.5 ? "blue" : "neutral",
    };
  });
}

const ALL_EMPLOYEES = generateEmployees();

/** The original's pre-selected rows (SSR `checked`): rows 1 and 2. */
const INITIAL_SELECTED = new Set(["1", "2"]);

/* ------------------------------------------------------------------ */
/* Shared bits (mirroring the original's own components)               */
/* ------------------------------------------------------------------ */

type PeriodRange = { id: string; label: string };

/** "Change period" dropdown, mirroring the original's period control:
 *  calendar icon + current label + chevron trigger; menu lists the
 *  ranges with a check on the selected one. */
function PeriodDropdown({
  ranges,
  value,
  onChange,
}: {
  ranges: readonly PeriodRange[];
  value: string;
  onChange: (id: string) => void;
}) {
  const [open, setOpen] = useState(false);
  const selected = ranges.find((r) => r.id === value) ?? ranges[0];
  return (
    <Dropdown isOpen={open} onOpenChange={setOpen}>
      <DropdownTrigger
        aria-label="Change period"
        aria-expanded={open}
        className="flex h-8 shrink-0 items-center gap-1.5 rounded-2lg border border-border-button-default bg-background-primary-default ps-2 shadow-xs pe-1.5 transition-colors duration-150 ease-out hover:bg-background-primary-hover"
      >
        <RiCalendarLine className="size-4 shrink-0 text-text-secondary" aria-hidden />
        <span className="text-body-medium whitespace-nowrap text-text-primary">{selected.label}</span>
        <RiArrowDownSLine
          className={cx("size-4 shrink-0 text-text-secondary transition-transform duration-200 ease-out", open && "rotate-180")}
          aria-hidden
        />
      </DropdownTrigger>
      <DropdownPopover aria-label="Period" placement="bottom end" className="w-[188px] p-2" dialogClassName="gap-1">
        <DropdownGroup>
          {ranges.map((r) => (
            <DropdownItem
              key={r.id}
              selected={r.id === value}
              onSelect={() => {
                onChange(r.id);
                setOpen(false);
              }}
              className="px-2 py-1.5"
            >
              <span className="flex-1 text-body-medium">{r.label}</span>
              {r.id === value && <RiCheckLine className="size-4 shrink-0 text-text-secondary" aria-hidden />}
            </DropdownItem>
          ))}
        </DropdownGroup>
      </DropdownPopover>
    </Dropdown>
  );
}

type SortKey = "name" | "salary" | "started";
type SortState = { key: SortKey; dir: "asc" | "desc" } | null;

/** Sortable table header, mirroring the original's sort button:
 *  label + 24px sort chevron (rotated when ascending). */
function SortHeaderButton({
  label,
  sortKey,
  sort,
  onSort,
}: {
  label: string;
  sortKey: SortKey;
  sort: SortState;
  onSort: (key: SortKey) => void;
}) {
  const active = sort?.key === sortKey;
  return (
    <button
      type="button"
      aria-label={`Sort by ${label}`}
      onClick={() => onSort(sortKey)}
      className="flex cursor-pointer items-center gap-0.5 rounded-sm outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-border-focus-ring"
    >
      <span className={cx("text-body-medium whitespace-nowrap", active ? "text-text-primary" : "text-text-tertiary")}>{label}</span>
      <span className="flex size-6 shrink-0 items-center justify-center">
        <ChevronSortDown
          className={cx(
            "size-6 transition-[transform,color] duration-150 ease",
            active ? "text-text-secondary" : "text-text-tertiary",
            active && sort?.dir === "asc" && "rotate-180",
          )}
        />
      </span>
    </button>
  );
}

/** Non-sortable table header: label plus the empty chevron slot the
 *  original renders for column alignment. */
function SortHeaderLabel({ label }: { label: string }) {
  return (
    <div className="flex items-center gap-0.5">
      <span className="text-body-medium whitespace-nowrap text-text-tertiary">{label}</span>
      <span className="flex size-6 shrink-0 items-center justify-center" />
    </div>
  );
}

/** Icon-only row action with a hover tooltip, mirroring the original:
 *  the original's Edit and Delete buttons are plain icon buttons with
 *  a tooltip and no click behaviour of their own. */
function RowActionButton({
  icon,
  label,
  onClick,
}: {
  icon: typeof RiEditLine;
  label: string;
  onClick?: () => void;
}) {
  return (
    <TooltipTrigger delay={200}>
      <Focusable>
        <IconButton icon={icon} size="small" aria-label={label} onClick={onClick} />
      </Focusable>
      <AriaTooltip size="md">{label}</AriaTooltip>
    </TooltipTrigger>
  );
}

/** The original's More-actions menu items, verbatim from its JS. The
 *  items only close the menu when picked (the original wires no other
 *  behaviour to them). */
const MORE_MENU_ACTIONS = [
  { icon: RiUserLine, label: "View profile" },
  { icon: RiFileCopyLine, label: "Copy email" },
  { icon: RiDownload2Line, label: "Download contract" },
  { icon: RiArchiveLine, label: "Archive employee" },
] as const;

function RowMoreMenu({ name }: { name: string }) {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <Dropdown isOpen={isOpen} onOpenChange={setIsOpen}>
      <TooltipTrigger delay={200}>
        <DropdownTrigger
          aria-label={`More actions for ${name}`}
          className={cx(
            "relative inline-flex size-8 shrink-0 items-center justify-center rounded-2lg",
            "border border-border-button-default bg-background-primary-default text-foreground-icon-primary shadow-xs",
            "transition-[background-color,border-color,box-shadow,color] duration-150 ease",
            "hover:border-border-button-hover hover:bg-background-primary-hover",
            isOpen && "border-border-button-active bg-background-primary-active",
          )}
        >
          <RiMore2Fill className="size-4 shrink-0" aria-hidden />
        </DropdownTrigger>
        <AriaTooltip size="md">More actions</AriaTooltip>
      </TooltipTrigger>
      <DropdownPopover aria-label={`More actions for ${name}`} placement="bottom end" className="w-[220px] p-2">
        <DropdownGroup>
          {MORE_MENU_ACTIONS.map(({ icon: Icon, label }) => (
            <DropdownItem key={label} onSelect={() => setIsOpen(false)} className="px-2 py-1.5">
              <Icon className="size-[18px] shrink-0 text-foreground-icon-secondary" aria-hidden />
              <span className="truncate text-body-medium whitespace-nowrap text-text-primary">{label}</span>
            </DropdownItem>
          ))}
        </DropdownGroup>
      </DropdownPopover>
    </Dropdown>
  );
}

/** Radar chart (hexagon, 6 axes) with the axis labels around the chart
 *  and the overall score in a centre circle, as on the original.
 *  Label positions are percentages of the wrapper, so they track the
 *  SVG at any width.
 *
 *  NOTE — morphology is a known open point: the original renders this
 *  with Recharts and this replica hand-draws the hexagon. Axis names
 *  and scores themselves are verified (original chunk: Q3 survey
 *  [84, 71, 88, 79, 66, 91], average 80, caption "Strong"). */
function EngagementRadar({
  values,
  centerValue,
  centerCaption,
}: {
  values: readonly number[];
  centerValue: number;
  centerCaption: string;
}) {
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
  // Clockwise from the top vertex: label side per axis.
  const LABEL_POS: Record<string, string> = {
    Growth: "left-1/2 top-0 -translate-x-1/2 text-center",
    Compensation: "left-[73%] top-[37%] -translate-y-1/2 text-start",
    Culture: "left-[73%] top-[62%] -translate-y-1/2 text-start",
    Management: "left-1/2 top-[76%] -translate-x-1/2 text-center",
    Balance: "left-[27%] top-[62%] -translate-x-full -translate-y-1/2 text-end",
    Tools: "left-[27%] top-[37%] -translate-x-full -translate-y-1/2 text-end",
  };
  return (
    <div className="relative mx-auto aspect-[340/314] w-full max-w-[340px]">
      <svg viewBox="0 0 400 280" className="absolute inset-x-0 top-[12%] h-[76%] w-full" role="img" aria-label="Engagement radar chart">
        {[0.25, 0.5, 0.75, 1].map((f) => (
          <polygon
            key={f}
            points={points.map((p) => `${(cx0 + (p.x - cx0) * f).toFixed(1)},${(cy0 + (p.y - cy0) * f).toFixed(1)}`).join(" ")}
            fill="none"
            stroke="var(--color-border-button-default)"
            strokeWidth="1"
          />
        ))}
        {points.map((p, i) => (
          <line key={RADAR_AXES[i]} x1={cx0} y1={cy0} x2={p.x} y2={p.y} stroke="var(--color-border-button-default)" strokeWidth="1" />
        ))}
        <polygon points={polygon} fill="var(--color-chart-2)" fillOpacity="0.25" stroke="var(--color-chart-2)" strokeWidth="2" strokeLinejoin="round" />
        {valuePoints.map((p, i) => (
          <circle key={RADAR_AXES[i]} cx={p.x} cy={p.y} r="4.5" fill="var(--color-chart-2)" stroke="var(--color-background-primary-default)" strokeWidth="2" />
        ))}
      </svg>
      <div className="absolute top-1/2 left-1/2 flex size-[84px] -translate-x-1/2 -translate-y-1/2 flex-col items-center justify-center rounded-full bg-background-inner-default shadow-card backdrop-blur-[2px]">
        <span className="text-title-1-medium leading-none text-text-primary tabular-nums">{centerValue}</span>
        <span className="mt-1 max-w-[72px] truncate text-caption-1-medium text-text-tertiary">{centerCaption}</span>
      </div>
      {RADAR_AXES.map((axis, i) => (
        <div key={axis} className={cx("absolute flex flex-col", LABEL_POS[axis])}>
          <span className="text-body-medium whitespace-nowrap text-text-tertiary">{axis}</span>
          <span className="text-title-3-semibold text-text-primary tabular-nums">{values[i]}</span>
        </div>
      ))}
    </div>
  );
}

export default function HrManagementTemplatePage() {
  const [funnelRange, setFunnelRange] = useState<string>("30d");
  const [radarRange, setRadarRange] = useState<string>("q3");
  const [hiresRange, setHiresRange] = useState<string>("year");
  const [breakdownTab, setBreakdownTab] = useState<BreakdownTab>("departments");
  const [breakdownExpanded, setBreakdownExpanded] = useState(false);
  const [breakdownHover, setBreakdownHover] = useState<string | null>(null);
  const [query, setQuery] = useState("");
  const [departmentFilter, setDepartmentFilter] = useState("All departments");
  const [statusFilter, setStatusFilter] = useState("All statuses");
  const [salaryFilter, setSalaryFilter] = useState("All salaries");
  const [statusOverrides, setStatusOverrides] = useState<Record<string, StatusId>>({});
  const [sort, setSort] = useState<SortState>(null);
  const [page, setPage] = useState(1);
  // Pre-selected exactly as the original SSR ships them (rows 1 and 2).
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set(INITIAL_SELECTED));
  const [removed, setRemoved] = useState<string[]>([]);
  const [toast, setToast] = useState<string | null>(null);
  // One shared timer: two independent setTimeout(3500) calls let the
  // earlier toast's timer wipe a newer toast (add then remove within
  // 3.5s showed no toast at all). A new toast always restarts the clock.
  const toastTimer = useRef<number | null>(null);
  const showToast = (message: string) => {
    if (toastTimer.current !== null) window.clearTimeout(toastTimer.current);
    setToast(message);
    toastTimer.current = window.setTimeout(() => setToast(null), 3500);
  };
  const [hireOpen, setHireOpen] = useState(false);
  const [hireName, setHireName] = useState("");
  const [hireRole, setHireRole] = useState("");
  const [hireTeam, setHireTeam] = useState("Engineering");
  const [extraHires, setExtraHires] = useState<Employee[]>([]);

  // Esc closes the dialog, matching the shared Modal behavior.
  useEffect(() => {
    if (!hireOpen) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setHireOpen(false);
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [hireOpen]);

  const funnel = FUNNEL_RANGES.find((r) => r.id === funnelRange) ?? FUNNEL_RANGES[0];
  const radar = RADAR_RANGES.find((r) => r.id === radarRange) ?? RADAR_RANGES[0];
  const hires = HIRES_RANGES.find((r) => r.id === hiresRange) ?? HIRES_RANGES[0];
  const radarAvg = Math.round(radar.scores.reduce((a, b) => a + b, 0) / radar.scores.length);
  const hiresTotal = hires.hires.reduce((a, b) => a + b, 0);
  const hiresAvg = (hires.attrition.reduce((a, b) => a + b, 0) / hires.attrition.length).toFixed(1);
  const hiresSeries = hires.months.map((month, i) => ({
    month,
    hires: hires.hires[i],
    attrition: hires.attrition[i],
  }));

  const breakdownRows = breakdownTab === "departments" ? TEAMS : breakdownTab === "sources" ? SOURCES : LOCATIONS;
  const breakdownMax = Math.max(...breakdownRows.map((t) => t.count));
  const BREAKDOWN_LIMIT = 5;
  const breakdownHasMore = breakdownRows.length > BREAKDOWN_LIMIT;
  const breakdownVisible = breakdownExpanded || !breakdownHasMore ? breakdownRows : breakdownRows.slice(0, BREAKDOWN_LIMIT);

  const employees = useMemo(() => {
    let rows = [...extraHires, ...ALL_EMPLOYEES]
      .map((e) => ({ ...e, status: statusOverrides[e.id] ?? e.status }))
      .filter((e) => !removed.includes(e.id));
    if (departmentFilter !== "All departments") rows = rows.filter((e) => e.team === departmentFilter);
    if (statusFilter !== "All statuses") {
      const wanted: StatusId = statusFilter === "Active" ? "active" : statusFilter === "On leave" ? "leave" : "contract";
      rows = rows.filter((e) => e.status === wanted);
    }
    if (salaryFilter !== "All salaries") rows = rows.filter((e) => salaryInBand(e.salary, salaryFilter));
    if (query.trim()) {
      // The original matches name and role only (not team).
      const q = query.trim().toLowerCase();
      rows = rows.filter((e) => e.name.toLowerCase().includes(q) || e.role.toLowerCase().includes(q));
    }
    if (sort) {
      rows = [...rows].sort((a, b) => {
        const cmp =
          sort.key === "name"
            ? a.name.localeCompare(b.name)
            : sort.key === "salary"
              ? (a.salary ?? 0) - (b.salary ?? 0)
              : Date.parse(a.start) - Date.parse(b.start);
        return sort.dir === "asc" ? cmp : -cmp;
      });
    }
    return rows;
  }, [extraHires, removed, departmentFilter, statusFilter, salaryFilter, statusOverrides, query, sort]);

  const perPage = 10;
  const totalPages = Math.max(1, Math.ceil(employees.length / perPage));
  const safePage = Math.min(page, totalPages);
  const pageRows = employees.slice((safePage - 1) * perPage, safePage * perPage);
  const pageNumbers: (number | "…")[] = (() => {
    if (totalPages <= 7) return Array.from({ length: totalPages }, (_, i) => i + 1);
    if (safePage <= 3) return [1, 2, 3, 4, 5, "…", totalPages];
    if (safePage >= totalPages - 2) return [1, "…", totalPages - 4, totalPages - 3, totalPages - 2, totalPages - 1, totalPages];
    return [1, "…", safePage - 1, safePage, safePage + 1, "…", totalPages];
  })();

  const allPageSelected = pageRows.length > 0 && pageRows.every((e) => selectedIds.has(e.id));
  const somePageSelected = pageRows.some((e) => selectedIds.has(e.id));

  const toggleSort = (key: SortKey) => {
    // Same column cycles asc -> desc -> unsorted, exactly as the original.
    setSort((prev) =>
      prev && prev.key === key ? (prev.dir === "asc" ? { key, dir: "desc" } : null) : { key, dir: "asc" },
    );
    setPage(1);
  };

  const toggleSelectAll = (value: boolean) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      for (const e of pageRows) {
        if (value) next.add(e.id);
        else next.delete(e.id);
      }
      return next;
    });
  };

  const toggleSelectOne = (id: string, value: boolean) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (value) next.add(id);
      else next.delete(id);
      return next;
    });
  };

  const addHire = () => {
    const name = hireName.trim();
    const role = hireRole.trim() || "New hire";
    if (!name) return;
    const deptColor: Record<string, ChipColor> = {
      Engineering: "blue",
      Design: "purple",
      Sales: "lime",
      Marketing: "yellow",
      Support: "cyan",
      Operations: "rose",
    };
    setExtraHires((prev) => [
      {
        id: `hire-${name.toLowerCase().replace(/[^a-z0-9]+/g, "-")}-${Date.now()}`,
        name,
        role,
        team: hireTeam,
        deptColor: deptColor[hireTeam] ?? "blue",
        start: "Nov 6, 2026",
        status: "active",
        salary: null,
        initialsColor: "blue",
      },
      ...prev,
    ]);
    setHireOpen(false);
    setHireName("");
    setHireRole("");
    showToast(`${name} added to the employee table.`);
  };

  return (
    <HrShell
      actions={
        <>
          <NotificationBell />
          {/* The original's Filters button has no click behaviour in its
              shipped JS — it is a plain trigger. */}
          <Button variant="secondary" size="medium" leadingIcon={RiFilter3Fill}>
            Filters
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
            <span className="flex size-10 items-center justify-center rounded-xl bg-background-primary-default">
              <kpi.icon className="size-5 text-foreground-icon-primary" aria-hidden />
            </span>
            <p className="text-body-medium text-text-secondary">{kpi.label}</p>
            <p className="text-title-1-medium text-text-primary tabular-nums">{kpi.value}</p>
            <span
              className={cx(
                "flex w-fit items-center gap-0.5 rounded-md px-1.5 py-0.5 text-body-2-medium",
                kpi.tone === "good" ? "bg-status-lime-background text-status-lime-text" : "bg-background-tertiary-default text-text-secondary",
              )}
            >
              {kpi.delta}
            </span>
          </section>
        ))}
      </div>

      {/* Recent hires */}
      <section className="flex w-full flex-col gap-3 rounded-2xl bg-background-secondary-default p-4">
        <div className="flex items-start justify-between gap-2">
          <div className="flex min-w-0 flex-col gap-0.5">
            <p className="text-body-medium text-text-secondary">Recent hires</p>
            <p className="text-title-1-medium whitespace-nowrap text-text-primary tabular-nums">56</p>
          </div>
          {/* The original's Board team control is a plain button with no
              menu in its shipped JS — trigger only. */}
          <button type="button" className="flex cursor-pointer items-center gap-1.5 rounded-2lg px-0.5 outline-none focus-visible:ring-2 focus-visible:ring-border-focus-ring">
            <span className="text-body-medium whitespace-nowrap text-text-primary">Board team</span>
            <ChevronDownSmall className="size-4 shrink-0 text-text-secondary" />
          </button>
        </div>
        <div className="mt-[11px] grid w-full flex-1 grid-cols-2 gap-2">
          {RECENT_HIRES.map((h) => (
            <div
              key={h.name}
              className="flex min-w-0 flex-col items-start justify-between rounded-2lg bg-background-inner-default p-2.5 shadow-card"
            >
              <div className="flex w-full min-w-0 items-center gap-2">
                <Avatar size="lg" src={h.avatar} alt={h.name} initials={initialsOf(h.name)} />
                <div className="flex min-w-0 flex-1 flex-col items-start justify-center">
                  <p className="w-full truncate text-body-medium text-text-primary">{h.name}</p>
                  <p className="w-full truncate text-body-2-medium text-text-secondary">{h.when}</p>
                </div>
              </div>
              <Chip variant="caption" color="soft" className="mt-2 w-full bg-background-recent-hire-role">
                {h.role}
              </Chip>
            </div>
          ))}
        </div>
        <div className="mt-2 flex w-full items-center gap-2">
          <Button variant="secondary" size="small" leadingIcon={RiArrowLeftLine} disabled className="flex-1">
            Previous
          </Button>
          <Button variant="secondary" size="small" trailingIcon={RiArrowRightLine} disabled className="flex-1">
            Next
          </Button>
        </div>
      </section>

      <div className="flex w-full flex-col gap-4 xl:flex-row">
        {/* Hiring pipeline */}
        <section className="flex min-w-0 flex-1 flex-col gap-3 rounded-2xl bg-background-secondary-default p-4">
          <div className="flex w-full items-start justify-between gap-3">
            <div className="flex min-w-0 flex-1 flex-col gap-0.5">
              <p className="w-full truncate text-body-medium text-text-secondary">Hiring pipeline</p>
              <div className="flex w-full items-center gap-2">
                <p className="text-title-1-medium whitespace-nowrap text-text-primary tabular-nums">{funnel.stages[0].toLocaleString("en-US")}</p>
                <DeltaChip delta={funnel.delta} />
              </div>
            </div>
            <PeriodDropdown ranges={FUNNEL_RANGES} value={funnelRange} onChange={(id) => setFunnelRange(id)} />
          </div>
          <div className="grid w-full content-center items-center gap-x-3 gap-y-3 py-2" style={{ gridTemplateColumns: "auto minmax(0, 1fr) auto" }}>
            {FUNNEL_STAGES.map((stage, i) => {
              const value = funnel.stages[i];
              const pct = Math.round((value / funnel.stages[0]) * 100);
              return (
                <div key={stage.stage} className="contents">
                  <span className="text-end text-body-regular whitespace-nowrap text-text-secondary">{stage.stage}</span>
                  <div className="relative h-5 min-w-0 overflow-hidden rounded-full bg-chart-track">
                    <div className="absolute inset-y-0 start-0 rounded-full transition-[width,background-color] duration-500 ease-out" style={{ width: `${Math.max(pct, 12)}%`, backgroundColor: stage.color }} />
                    <span className="pointer-events-none absolute inset-y-0 start-1 flex items-center">
                      <stage.icon className="size-3.5 shrink-0" style={{ color: "var(--color-neutral-950)" }} aria-hidden />
                    </span>
                  </div>
                  <span className="flex items-baseline justify-end gap-1.5 whitespace-nowrap">
                    <span className="text-body-medium text-text-primary tabular-nums">{value.toLocaleString("en-US")}</span>
                    <span className="text-caption-1-medium text-text-tertiary tabular-nums">{pct}%</span>
                  </span>
                </div>
              );
            })}
          </div>
          <div className="-mx-2 -mb-1 grid grid-cols-3 gap-2">
            {FUNNEL_STAGES.map((stage, i) => (
              <div key={stage.stage} className="flex min-w-0 flex-col items-start gap-px rounded-2lg bg-background-inner-default px-2.5 py-2">
                <div className="flex min-w-0 max-w-full items-center gap-1.5">
                  <span className="size-3 shrink-0 rounded-[4px]" style={{ backgroundColor: stage.color }} aria-hidden />
                  <span className="truncate text-body-regular text-text-secondary">{stage.stage}</span>
                </div>
                <span className="text-body-medium whitespace-nowrap text-text-primary tabular-nums">{funnel.stages[i].toLocaleString("en-US")}</span>
              </div>
            ))}
          </div>
        </section>

        {/* Engagement radar */}
        <section className="flex min-w-0 flex-1 flex-col gap-3 rounded-2xl bg-background-secondary-default p-4">
          <div className="flex w-full items-start justify-between gap-3">
            <div className="flex min-w-0 flex-1 flex-col gap-0.5">
              <p className="w-full truncate text-body-medium text-text-secondary">Team engagement</p>
            </div>
            <PeriodDropdown ranges={RADAR_RANGES} value={radarRange} onChange={(id) => setRadarRange(id)} />
          </div>
          <EngagementRadar values={radar.scores} centerValue={radarAvg} centerCaption={radarCaption(radarAvg)} />
        </section>
      </div>

      <div className="flex w-full flex-col gap-4 xl:flex-row">
        {/* Hires vs attrition */}
        <section className="flex min-w-0 flex-1 flex-col gap-3 rounded-2xl bg-background-secondary-default p-4">
          <div className="flex w-full items-start justify-between gap-3">
            <div className="flex min-w-0 flex-1 flex-col gap-0.5">
              <p className="w-full truncate text-body-medium text-text-secondary">Hires · Attrition {hiresAvg}%</p>
              <div className="flex w-full items-center gap-2">
                <p className="text-title-1-medium whitespace-nowrap text-text-primary tabular-nums">{hiresTotal}</p>
                <DeltaChip delta={hires.delta} />
              </div>
            </div>
            <PeriodDropdown ranges={HIRES_RANGES} value={hiresRange} onChange={(id) => setHiresRange(id)} />
          </div>
          <div className="h-[196px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart data={hiresSeries} margin={{ top: 4, right: 4, bottom: 0, left: 0 }} barCategoryGap="28%">
                <YAxis yAxisId="left" width={30} domain={[0, 18]} ticks={[0, 6, 12, 18]} tickLine={false} axisLine={false} tick={{ fontSize: 12, fill: "var(--color-text-tertiary)" }} />
                <YAxis yAxisId="right" orientation="right" width={36} domain={[0, 6]} ticks={[0, 2, 4, 6]} tickFormatter={(v: number) => `${v}%`} tickLine={false} axisLine={false} tick={{ fontSize: 12, fill: "var(--color-text-tertiary)" }} />
                <XAxis dataKey="month" ticks={["Jan", "Mar", "May", "Jul", "Sep", "Dec"].filter((m) => (hires.months as readonly string[]).includes(m))} tickLine={false} axisLine={false} tickMargin={8} tick={{ fontSize: 12, fill: "var(--color-text-tertiary)" }} />
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
          <div className="-mb-1 grid grid-cols-2 gap-2 sm:grid-cols-6">
            <div className="col-span-1 flex min-w-0 flex-col items-start gap-px rounded-2lg bg-background-inner-default px-2.5 py-2 sm:col-span-3">
              <div className="flex min-w-0 max-w-full items-center gap-1.5">
                <span className="size-3 shrink-0 rounded-[4px]" style={{ backgroundColor: "var(--color-chart-2)" }} aria-hidden />
                <span className="truncate text-body-regular text-text-secondary">Hires · total</span>
              </div>
              <span className="text-body-medium whitespace-nowrap text-text-primary tabular-nums">{hiresTotal}</span>
            </div>
            <div className="col-span-1 flex min-w-0 flex-col items-start gap-px rounded-2lg bg-background-inner-default px-2.5 py-2 sm:col-span-3">
              <div className="flex min-w-0 max-w-full items-center gap-1.5">
                <span className="size-3 shrink-0 rounded-[4px]" style={{ backgroundColor: "var(--color-chart-3)" }} aria-hidden />
                <span className="truncate text-body-regular text-text-secondary">Attrition · average</span>
              </div>
              <span className="text-body-medium whitespace-nowrap text-text-primary tabular-nums">{hiresAvg}%</span>
            </div>
          </div>
        </section>

        {/* Team breakdown: Departments / Hiring sources / Locations tabs */}
        <section className="flex min-w-0 flex-1 flex-col gap-3 rounded-2xl bg-background-secondary-default p-4">
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-4" role="tablist" aria-label="Team breakdown">
              {BREAKDOWN_TABS.map((tab) => (
                <button
                  key={tab.id}
                  type="button"
                  role="tab"
                  aria-selected={breakdownTab === tab.id}
                  onClick={() => {
                    setBreakdownTab(tab.id);
                    setBreakdownExpanded(false);
                  }}
                  className={cx(
                    "cursor-pointer border-b-2 pb-1 text-body-medium whitespace-nowrap outline-none transition-colors focus-visible:ring-2 focus-visible:ring-border-focus-ring",
                    breakdownTab === tab.id ? "border-accent-500 text-accent-500" : "border-transparent text-text-primary hover:text-text-secondary",
                  )}
                >
                  {tab.label}
                </button>
              ))}
            </div>
            <p className="text-caption-1-medium uppercase text-text-tertiary">People</p>
          </div>
          <div className="relative -mx-2 -mb-1 flex flex-col">
            <div
              className="flex flex-col gap-1"
              style={
                breakdownHasMore && !breakdownExpanded
                  ? { maskImage: "linear-gradient(to bottom, black calc(100% - 44px), transparent)" }
                  : undefined
              }
            >
              {breakdownVisible.map((row) => {
                const hovered = breakdownHover === row.name;
                return (
                  <div
                    key={row.name}
                    onMouseEnter={() => setBreakdownHover(row.name)}
                    onMouseLeave={() => setBreakdownHover(null)}
                    className="relative flex h-9 items-center justify-between gap-3 rounded-lg px-2.5"
                  >
                    <div
                      className="absolute inset-y-0 start-0 rounded-lg transition-[width,background-color] duration-500 ease-out"
                      style={{
                        width: `${(row.count / breakdownMax) * 100}%`,
                        backgroundColor: hovered
                          ? "color-mix(in srgb, var(--color-chart-6-active) 26%, transparent)"
                          : "color-mix(in srgb, var(--color-chart-6) 14%, transparent)",
                      }}
                    />
                    <span className="relative flex min-w-0 items-center gap-2">
                      <span className="truncate text-body-regular text-text-primary">{row.name}</span>
                    </span>
                    <span className="relative shrink-0 text-body-medium text-text-primary tabular-nums">{row.count}</span>
                  </div>
                );
              })}
            </div>
            {breakdownHasMore && (
              <button
                type="button"
                onClick={() => setBreakdownExpanded((v) => !v)}
                aria-label={breakdownExpanded ? "Show fewer" : `Show ${breakdownRows.length - BREAKDOWN_LIMIT} more`}
                className={cx(
                  "absolute left-1/2 flex h-5 w-10 -translate-x-1/2 cursor-pointer items-center justify-center rounded-full border border-border-button-default bg-background-primary-default shadow-xs outline-none transition-colors duration-150 hover:bg-background-primary-hover focus-visible:ring-2 focus-visible:ring-border-focus-ring",
                  breakdownExpanded ? "-bottom-2" : "bottom-1",
                )}
              >
                <RiArrowDownSLine
                  className={cx("size-3.5 text-text-secondary transition-transform duration-200 ease-out", breakdownExpanded && "rotate-180")}
                  aria-hidden
                />
              </button>
            )}
          </div>
        </section>
      </div>

      {/* Employee table */}
      <section id="employee-table" className={cx("flex w-full flex-col rounded-2xl border border-border-table pt-2", totalPages > 1 ? "pb-3" : "pb-0")}>
        <div className="flex w-full flex-col items-start gap-3 px-3 py-1 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-col justify-center">
            <p className="text-body-medium whitespace-nowrap text-text-tertiary">Total Results</p>
            <p className="text-body-medium whitespace-nowrap text-text-primary">{employees.length.toLocaleString("en-US")} employees</p>
          </div>
          <div className="-mx-3 flex w-[calc(100%+1.5rem)] items-center gap-2.5 overflow-x-auto px-3 sm:mx-0 sm:w-auto sm:flex-wrap sm:justify-end sm:overflow-visible sm:px-0">
            <Select
              aria-label="Filter by department"
              selectedKey={departmentFilter}
              onSelectionChange={(key) => {
                if (typeof key === "string") {
                  setDepartmentFilter(key);
                  setPage(1);
                }
              }}
              className="w-[172px] shrink-0"
            >
              {["All departments", "Engineering", "Design", "Sales", "Marketing", "Support", "Operations"].map((d) => (
                <SelectItem key={d} id={d} textValue={d}>{d}</SelectItem>
              ))}
            </Select>
            <Select
              aria-label="Filter by work status"
              selectedKey={statusFilter}
              onSelectionChange={(key) => {
                if (typeof key === "string") {
                  setStatusFilter(key);
                  setPage(1);
                }
              }}
              className="w-[132px] shrink-0"
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
              className="w-[148px] shrink-0"
            >
              {["All salaries", "Under $60K", "$60K – $90K", "$90K – $120K", "Over $120K"].map((band) => (
                <SelectItem key={band} id={band} textValue={band}>{band}</SelectItem>
              ))}
            </Select>
            <label className="flex min-w-[153px] flex-1 items-center gap-2 rounded-full bg-background-secondary-default px-2.5 py-1.5 sm:w-[153px] sm:min-w-0 sm:flex-none">
              <RiSearchLine className="size-4 shrink-0 text-foreground-icon-tertiary" aria-hidden />
              <input
                value={query}
                onChange={(e) => {
                  setQuery(e.target.value);
                  setPage(1);
                }}
                placeholder="Search"
                aria-label="Search employees"
                className="min-w-0 flex-1 bg-transparent text-body-medium text-text-primary outline-none placeholder:text-text-tertiary"
              />
            </label>
          </div>
        </div>
        <div className="mt-2 w-full overflow-x-auto">
          <table className="w-full min-w-[900px] border-collapse text-start">
            <thead>
              <tr className="border-y border-separator-border bg-background-secondary-default">
                <th className="px-3 py-2.5 text-start">
                  <span className="flex items-center gap-2">
                    <Checkbox
                      isSelected={allPageSelected}
                      isIndeterminate={somePageSelected && !allPageSelected}
                      onChange={toggleSelectAll}
                      aria-label="Select all employees on this page"
                    />
                    <SortHeaderButton label="Employee" sortKey="name" sort={sort} onSort={toggleSort} />
                  </span>
                </th>
                <th className="px-3 py-2.5 text-start">
                  <SortHeaderLabel label="Status" />
                </th>
                <th className="px-3 py-2.5 text-start">
                  <SortHeaderLabel label="Department" />
                </th>
                <th className="px-3 py-2.5 text-start">
                  <SortHeaderButton label="Start date" sortKey="started" sort={sort} onSort={toggleSort} />
                </th>
                <th className="px-3 py-2.5 text-start">
                  <SortHeaderButton label="Salary" sortKey="salary" sort={sort} onSort={toggleSort} />
                </th>
                <th className="px-3 py-2.5 text-start">
                  <SortHeaderLabel label="Actions" />
                </th>
              </tr>
            </thead>
            <tbody>
              {pageRows.map((e) => (
                <tr key={e.id} className="border-b border-separator-border last:border-b-0">
                  <td className="px-3 py-2.5">
                    <span className="flex items-center gap-2">
                      <Checkbox
                        isSelected={selectedIds.has(e.id)}
                        onChange={(value) => toggleSelectOne(e.id, value)}
                        aria-label={`Select ${e.name}`}
                      />
                      <span className="flex min-w-0 items-center gap-2">
                        {e.avatar ? (
                          <Avatar size="sm" src={e.avatar} alt="" initials={initialsOf(e.name)} />
                        ) : (
                          <Avatar size="sm" color={e.initialsColor ?? "neutral"} initials={initialsOf(e.name)} />
                        )}
                        <span className="flex min-w-0 flex-col">
                          <span className="truncate text-body-medium text-text-primary">{e.name}</span>
                          <span className="truncate text-body-2-medium text-text-secondary">{e.role}</span>
                        </span>
                      </span>
                    </span>
                  </td>
                  <td className="px-3 py-2.5">
                    <Select
                      aria-label={`Work status for ${e.name}`}
                      selectedKey={e.status}
                      onSelectionChange={(key) => {
                        if (typeof key === "string") {
                          setStatusOverrides((prev) => ({ ...prev, [e.id]: key as StatusId }));
                        }
                      }}
                      size="sm"
                      className="w-[130px]"
                    >
                      {(["active", "leave", "contract"] as const).map((st) => (
                        <SelectItem key={st} id={st} textValue={STATUS_LABEL[st]}>
                          <StatusDot color={STATUS_DOT[st]} />
                          {STATUS_LABEL[st]}
                        </SelectItem>
                      ))}
                    </Select>
                  </td>
                  <td className="px-3 py-2.5">
                    <Chip variant="bold" color={e.deptColor}>{e.team}</Chip>
                  </td>
                  <td className="whitespace-nowrap px-3 py-2.5 text-body-medium text-text-primary tabular-nums">{e.start}</td>
                  <td className="px-3 py-2.5">
                    <Chip variant="subtle" color="gray">{salaryText(e.salary)}</Chip>
                  </td>
                  <td className="px-3 py-2.5 text-end">
                    <span className="inline-flex gap-2.5">
                      <RowActionButton
                        icon={RiDeleteBin6Line}
                        label="Delete"
                        onClick={() => {
                          setRemoved((prev) => [...prev, e.id]);
                          showToast(`${e.name} removed from this view.`);
                        }}
                      />
                      <RowActionButton icon={RiEditLine} label="Edit" />
                      <RowMoreMenu name={e.name} />
                    </span>
                  </td>
                </tr>
              ))}
              {pageRows.length === 0 && (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-body-regular text-text-secondary">No employees match your filters.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        {totalPages > 1 && (
          <div className="flex flex-wrap items-center justify-end gap-2 px-3 pt-3">
            <nav className="flex items-center gap-1" aria-label="Employee pages">
              <button type="button" disabled={safePage <= 1} onClick={() => setPage((p) => Math.max(1, p - 1))} className="cursor-pointer rounded-lg px-2.5 py-1.5 text-body-2-medium text-text-secondary outline-none hover:bg-background-tertiary-default focus-visible:ring-2 focus-visible:ring-border-focus-ring disabled:cursor-default disabled:opacity-40">
                Previous
              </button>
              {pageNumbers.map((n, i) =>
                n === "…" ? (
                  <span key={`ellipsis-${i}`} className="px-1 text-body-2-medium text-text-tertiary">…</span>
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
        )}
      </section>

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
            {/* NOTE — unverified: the original ships no Add-employee
                dialog in its SSR or JS, so these fields (and the Team
                options) are the replica's own stand-in, not original
                data. */}
            <label className="mt-4 block">
              <span className="text-body-medium text-text-primary">Name</span>
              <input autoFocus value={hireName} onChange={(e) => setHireName(e.target.value)} onKeyDown={(e) => { if (e.key === "Enter") addHire(); }} placeholder="Full name" aria-label="Employee name" className="mt-1.5 w-full rounded-xl border border-border-button-default bg-background-tertiary-default px-3 py-2 text-body-regular text-text-primary outline-none placeholder:text-text-tertiary focus-visible:ring-2 focus-visible:ring-border-focus-ring" />
            </label>
            <label className="mt-3 block">
              <span className="text-body-medium text-text-primary">Role</span>
              <input value={hireRole} onChange={(e) => setHireRole(e.target.value)} onKeyDown={(e) => { if (e.key === "Enter") addHire(); }} placeholder="Role" aria-label="Employee role" className="mt-1.5 w-full rounded-xl border border-border-button-default bg-background-tertiary-default px-3 py-2 text-body-regular text-text-primary outline-none placeholder:text-text-tertiary focus-visible:ring-2 focus-visible:ring-border-focus-ring" />
            </label>
            <div className="mt-3">
              <span className="text-body-medium text-text-primary">Team</span>
              <Select
                aria-label="Employee team"
                selectedKey={hireTeam}
                onSelectionChange={(key) => {
                  if (typeof key === "string") setHireTeam(key);
                }}
                className="mt-1.5 w-full"
              >
                {DIALOG_TEAMS.map((t) => (
                  <SelectItem key={t} id={t} textValue={t}>{t}</SelectItem>
                ))}
              </Select>
            </div>
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
