"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import {
  RiAddFill,
  RiArrowLeftSLine,
  RiArrowRightSLine,
  RiDownload2Line,
  RiEditLine,
  RiFileCopyLine,
  RiFilter3Fill,
  RiHomeLine,
  RiMore2Fill,
  RiSearchLine,
  RiUserLine,
} from "@remixicon/react";

import { TemplateShell } from "@/components/application/template-shell/template-shell";
import { NotificationBell } from "@/components/application/app-shell/notification-bell";
import { StatCards } from "@/components/application/dashboard/stat-cards";
import { Avatar } from "@/components/base/avatar/avatar";
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
import { SegmentedControl, SegmentedControlItem } from "@/components/base/segmented-control/segmented-control";
import { Select, SelectItem } from "@/components/base/select/select";
import { Textarea } from "@/components/base/textarea/textarea";
import { cx } from "@/utils/cx";

/**
 * Dashboard template replica (1:1 functional rebuild).
 * Official: boardui.com/templates/dashboard — "Welcome Mertcan", recent hires,
 * earnings + revenue charts, contributions heatmap, KPI cards, customers table.
 * Values below are read off the official page's server HTML (sidebar 260px,
 * content column max-w 1300px, KPI cards h-132px, chart cards h-337px,
 * hires/earnings cards h-329px, table 660 customers / 55 pages).
 * Built only from free BoardUI components + mock data. Not the official Pro source.
 */

type Period = "weekly" | "monthly" | "yearly";

function mulberry32(seed: number) {
  return () => {
    seed |= 0;
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const fmtInt = (n: number) => Math.round(n).toLocaleString("en-US");
const fmtMoney = (n: number) => `$${fmtInt(n)}`;
const fmtPrice = (n: number) => `$${n.toLocaleString("en-US").replace(/,/g, ".")}`;

function deltaOf(current: number, previous: number) {
  if (previous === 0) return { label: "New", color: "neutral" as const };
  const change = ((current - previous) / previous) * 100;
  const rounded = Math.round(change * 10) / 10;
  return {
    label: `${rounded > 0 ? "+" : ""}${rounded}%`,
    color: (rounded > 0 ? "lime" : rounded < 0 ? "rose" : "neutral") as "lime" | "rose" | "neutral",
  };
}

/* ------------------------------------------------------------------ */
/* Earnings + revenue series (period totals match the official page:   */
/* Earnings $7,462 +14.8% weekly, Revenue $18,240 +9.4% weekly).       */
/* ------------------------------------------------------------------ */

type ChartPoint = { label: string; current: number; previous: number };

const EARNINGS: Record<Period, ChartPoint[]> = {
  weekly: [
    { label: "Mon", current: 820, previous: 720 },
    { label: "Tue", current: 940, previous: 860 },
    { label: "Wed", current: 1130, previous: 990 },
    { label: "Thu", current: 980, previous: 910 },
    { label: "Fri", current: 1240, previous: 1080 },
    { label: "Sat", current: 1310, previous: 1120 },
    { label: "Sun", current: 1042, previous: 820 },
  ],
  monthly: [
    { label: "W1", current: 6840, previous: 6100 },
    { label: "W2", current: 7210, previous: 6400 },
    { label: "W3", current: 7490, previous: 6650 },
    { label: "W4", current: 7680, previous: 6820 },
  ],
  yearly: [
    { label: "Jan", current: 26800, previous: 22100 },
    { label: "Feb", current: 25400, previous: 21200 },
    { label: "Mar", current: 28900, previous: 23900 },
    { label: "Apr", current: 27600, previous: 23100 },
    { label: "May", current: 30100, previous: 24800 },
    { label: "Jun", current: 29400, previous: 24300 },
    { label: "Jul", current: 31800, previous: 26100 },
    { label: "Aug", current: 30900, previous: 25400 },
    { label: "Sep", current: 32400, previous: 26700 },
    { label: "Oct", current: 33100, previous: 27200 },
    { label: "Nov", current: 31800, previous: 26100 },
    { label: "Dec", current: 33200, previous: 27300 },
  ],
};

const REVENUE: Record<Period, ChartPoint[]> = {
  weekly: [
    { label: "Mon", current: 2140, previous: 1980 },
    { label: "Tue", current: 2380, previous: 2190 },
    { label: "Wed", current: 2650, previous: 2420 },
    { label: "Thu", current: 2420, previous: 2240 },
    { label: "Fri", current: 2890, previous: 2640 },
    { label: "Sat", current: 3120, previous: 2860 },
    { label: "Sun", current: 2640, previous: 2342 },
  ],
  monthly: [
    { label: "W1", current: 16800, previous: 15100 },
    { label: "W2", current: 18420, previous: 16400 },
    { label: "W3", current: 17960, previous: 16100 },
    { label: "W4", current: 19840, previous: 17600 },
  ],
  yearly: [
    { label: "Jan", current: 62400, previous: 52800 },
    { label: "Feb", current: 58900, previous: 50100 },
    { label: "Mar", current: 67100, previous: 56900 },
    { label: "Apr", current: 64800, previous: 55200 },
    { label: "May", current: 70200, previous: 59800 },
    { label: "Jun", current: 68900, previous: 58400 },
    { label: "Jul", current: 73400, previous: 62100 },
    { label: "Aug", current: 71800, previous: 60900 },
    { label: "Sep", current: 75600, previous: 64200 },
    { label: "Oct", current: 77200, previous: 65500 },
    { label: "Nov", current: 74900, previous: 63100 },
    { label: "Dec", current: 78100, previous: 66200 },
  ],
};

/* ------------------------------------------------------------------ */
/* ------------------------------------------------------------------ */
/* Contributions heatmap: 259 cells verbatim from the official page's   */
/* server HTML (aria-label + data-tier, DOM order, 7 rows x 37 cols).   */
/* NOTE: the cells sum to 1,721, not the card headline's 958 — the      */
/* original page itself is inconsistent there; these are the real       */
/* per-day counts, not rescaled to the headline.                        */
/* ------------------------------------------------------------------ */

const MONTHS_SHORT = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

// [date, count, tier] for all 259 heatmap cells, in the original's DOM order.
// Values transcribed from boardui.com/templates/dashboard SSR HTML, aria-labels + data-tier.
const DASHBOARD_HEATMAP: [string, number, number][] = [
  ["Jan 1",0,0], ["Jan 11",0,0], ["Jan 21",23,4], ["Jan 31",3,1], ["Feb 10",1,1], ["Feb 19",0,0], ["Mar 1",10,3], ["Mar 11",3,1],
  ["Mar 21",12,3], ["Mar 31",0,0], ["Apr 10",4,1], ["Apr 20",2,1], ["Apr 30",12,3], ["May 9",2,1], ["May 19",13,3], ["May 29",0,0],
  ["Jun 8",6,2], ["Jun 18",20,4], ["Jun 28",1,1], ["Jul 8",6,2], ["Jul 18",4,1], ["Jul 27",9,2], ["Aug 6",0,0], ["Aug 16",0,0],
  ["Aug 26",0,0], ["Sep 5",3,1], ["Sep 15",13,3], ["Sep 25",0,0], ["Oct 5",2,1], ["Oct 14",0,0], ["Oct 24",4,1], ["Nov 3",19,4],
  ["Nov 13",0,0], ["Nov 23",0,0], ["Dec 3",11,3], ["Dec 13",6,2], ["Dec 23",9,2], ["Jan 2",0,0], ["Jan 12",0,0], ["Jan 22",36,5],
  ["Feb 1",4,1], ["Feb 11",3,1], ["Feb 21",1,1], ["Mar 3",3,1], ["Mar 13",0,0], ["Mar 22",6,2], ["Apr 1",0,0], ["Apr 11",9,2],
  ["Apr 21",0,0], ["May 1",9,2], ["May 11",0,0], ["May 21",3,1], ["May 31",3,1], ["Jun 9",3,1], ["Jun 19",10,3], ["Jun 29",13,3],
  ["Jul 9",18,4], ["Jul 19",9,2], ["Jul 29",2,1], ["Aug 8",3,1], ["Aug 18",1,1], ["Aug 27",4,1], ["Sep 6",0,0], ["Sep 16",6,2],
  ["Sep 26",0,0], ["Oct 6",0,0], ["Oct 16",1,1], ["Oct 26",8,2], ["Nov 5",0,0], ["Nov 14",24,4], ["Nov 24",0,0], ["Dec 4",11,3],
  ["Dec 14",0,0], ["Dec 24",0,0], ["Jan 4",0,0], ["Jan 14",0,0], ["Jan 24",1,1], ["Feb 2",1,1], ["Feb 12",20,4], ["Feb 22",19,4],
  ["Mar 4",6,2], ["Mar 14",0,0], ["Mar 24",0,0], ["Apr 3",26,5], ["Apr 13",6,2], ["Apr 22",2,1], ["May 2",0,0], ["May 12",9,2],
  ["May 22",1,1], ["Jun 1",3,1], ["Jun 11",2,1], ["Jun 21",2,1], ["Jul 1",0,0], ["Jul 10",21,4], ["Jul 20",9,2], ["Jul 30",3,1],
  ["Aug 9",21,4], ["Aug 19",22,4], ["Aug 29",4,1], ["Sep 8",9,2], ["Sep 18",13,3], ["Sep 27",15,3], ["Oct 7",29,5], ["Oct 17",6,2],
  ["Oct 27",0,0], ["Nov 6",0,0], ["Nov 16",6,2], ["Nov 26",30,5], ["Dec 6",1,1], ["Dec 15",10,3], ["Dec 25",27,5], ["Jan 5",0,0],
  ["Jan 15",6,2], ["Jan 25",0,0], ["Feb 4",6,2], ["Feb 14",6,2], ["Feb 24",38,5], ["Mar 5",15,3], ["Mar 15",4,1], ["Mar 25",9,2],
  ["Apr 4",3,1], ["Apr 14",6,2], ["Apr 24",0,0], ["May 4",10,3], ["May 14",34,5], ["May 23",3,1], ["Jun 2",0,0], ["Jun 12",1,1],
  ["Jun 22",0,0], ["Jul 2",0,0], ["Jul 12",6,2], ["Jul 22",9,2], ["Aug 1",0,0], ["Aug 11",1,1], ["Aug 20",1,1], ["Aug 30",6,2],
  ["Sep 9",2,1], ["Sep 19",1,1], ["Sep 29",1,1], ["Oct 9",4,1], ["Oct 19",16,4], ["Oct 29",6,2], ["Nov 7",1,1], ["Nov 17",2,1],
  ["Nov 27",11,3], ["Dec 7",14,3], ["Dec 17",0,0], ["Dec 27",21,4], ["Jan 7",6,2], ["Jan 17",0,0], ["Jan 26",14,3], ["Feb 5",6,2],
  ["Feb 15",10,3], ["Feb 25",1,1], ["Mar 7",9,2], ["Mar 17",6,2], ["Mar 27",34,5], ["Apr 6",9,2], ["Apr 15",13,3], ["Apr 25",2,1],
  ["May 5",3,1], ["May 15",6,2], ["May 25",6,2], ["Jun 4",17,4], ["Jun 14",0,0], ["Jun 24",33,5], ["Jul 3",6,2], ["Jul 13",0,0],
  ["Jul 23",6,2], ["Aug 2",2,1], ["Aug 12",0,0], ["Aug 22",9,2], ["Sep 1",9,2], ["Sep 11",0,0], ["Sep 20",1,1], ["Sep 30",12,3],
  ["Oct 10",2,1], ["Oct 20",9,2], ["Oct 30",2,1], ["Nov 9",0,0], ["Nov 19",4,1], ["Nov 29",12,3], ["Dec 8",0,0], ["Dec 18",0,0],
  ["Dec 28",6,2], ["Jan 8",3,1], ["Jan 18",0,0], ["Jan 28",4,1], ["Feb 7",6,2], ["Feb 17",9,2], ["Feb 26",2,1], ["Mar 8",9,2],
  ["Mar 18",2,1], ["Mar 28",12,3], ["Apr 7",0,0], ["Apr 17",14,3], ["Apr 27",6,2], ["May 7",3,1], ["May 16",3,1], ["May 26",6,2],
  ["Jun 5",0,0], ["Jun 15",15,3], ["Jun 25",0,0], ["Jul 5",0,0], ["Jul 15",24,4], ["Jul 25",1,1], ["Aug 3",0,0], ["Aug 13",3,1],
  ["Aug 23",4,1], ["Sep 2",6,2], ["Sep 12",3,1], ["Sep 22",4,1], ["Oct 2",3,1], ["Oct 12",0,0], ["Oct 21",0,0], ["Oct 31",6,2],
  ["Nov 10",2,1], ["Nov 20",3,1], ["Nov 30",15,3], ["Dec 10",14,3], ["Dec 20",9,2], ["Dec 30",4,1], ["Jan 9",15,3], ["Jan 19",0,0],
  ["Jan 29",0,0], ["Feb 8",15,3], ["Feb 18",6,2], ["Feb 28",11,3], ["Mar 10",0,0], ["Mar 20",10,3], ["Mar 29",6,2], ["Apr 8",23,4],
  ["Apr 18",35,5], ["Apr 28",12,3], ["May 8",9,2], ["May 18",0,0], ["May 28",6,2], ["Jun 7",0,0], ["Jun 16",11,3], ["Jun 26",6,2],
  ["Jul 6",33,5], ["Jul 16",11,3], ["Jul 26",1,1], ["Aug 5",6,2], ["Aug 15",2,1], ["Aug 25",0,0], ["Sep 3",13,3], ["Sep 13",9,2],
  ["Sep 23",21,4], ["Oct 3",0,0], ["Oct 13",4,1], ["Oct 23",6,2], ["Nov 2",12,3], ["Nov 12",3,1], ["Nov 21",3,1], ["Dec 1",10,3],
  ["Dec 11",15,3], ["Dec 21",0,0], ["Dec 31",2,1],
];

type HeatCell = { date: Date; value: number; tier: number };

function buildContributions(): { cells: HeatCell[]; total: number } {
  const cells: HeatCell[] = DASHBOARD_HEATMAP.map(([label, value, tier]) => {
    const [mon, day] = label.split(" ");
    return { date: new Date(2026, MONTHS_SHORT.indexOf(mon), Number(day)), value, tier };
  });
  return { cells, total: cells.reduce((s, c) => s + c.value, 0) };
}

/* ------------------------------------------------------------------ */
/* Recent hires: first 4 rows are the official page's, then generated. */
/* ------------------------------------------------------------------ */

const HIRE_ROLES = ["Backend Engineer", "UI Designer", "User Researcher", "DevOps Engineer", "Product Manager", "Data Analyst", "Frontend Engineer", "QA Engineer"];
const HIRE_FIRST = ["Kai", "Mira", "Owen", "Nora", "Felix", "Ivy", "Hugo", "Lena", "Omar", "Zoe", "Eli", "Rosa", "Max", "Tara"];
const HIRE_LAST = ["Chen", "Novak", "Silva", "Kaur", "Berg", "Costa", "Weber", "Lind", "Moreau", "Petrov", "Haugen", "Reyes", "Fischer", "Dube"];

type Hire = { name: string; role: string; joined: string; initials: string; color: "blue" | "pink" | "lime" | "neutral"; avatar?: string };

function buildHires(): Hire[] {
  const rng = mulberry32(56);
  const base: Hire[] = [
    { name: "Livia Saris", role: "Backend Engineer", joined: "Joined today", initials: "LS", color: "blue", avatar: "/avatars/livia-saris.webp" },
    { name: "Jaydon Aminoff", role: "UI Designer", joined: "2 days ago", initials: "JA", color: "blue", avatar: "/avatars/jaydon-aminoff.webp" },
    { name: "Maria Lubin", role: "User Researcher", joined: "5 days ago", initials: "ML", color: "pink", avatar: "/avatars/maria-lubin.webp" },
    { name: "Ann Press", role: "DevOps Engineer", joined: "A week ago", initials: "AP", color: "lime", avatar: "/avatars/ann-press.webp" },
  ];
  const joinedLabels = ["A week ago", "2 weeks ago", "2 weeks ago", "3 weeks ago", "A month ago", "A month ago", "2 months ago"];
  const colors: Hire["color"][] = ["blue", "pink", "lime", "neutral"];
  for (let i = 4; i < 56; i++) {
    const first = HIRE_FIRST[Math.floor(rng() * HIRE_FIRST.length)];
    const last = HIRE_LAST[Math.floor(rng() * HIRE_LAST.length)];
    base.push({
      name: `${first} ${last}`,
      role: HIRE_ROLES[Math.floor(rng() * HIRE_ROLES.length)],
      joined: joinedLabels[Math.floor(rng() * joinedLabels.length)],
      initials: `${first[0]}${last[0]}`,
      color: colors[Math.floor(rng() * colors.length)],
    });
  }
  return base;
}

/* ------------------------------------------------------------------ */
/* Customers table: first 12 rows are the official page's first page;  */
/* rows 13-660 are deterministic mock data. Prices use the official     */
/* page's "$3.412" thousands-dot format.                                */
/* ------------------------------------------------------------------ */

type Purchase = "waiting" | "completed" | "processing";
type CustStatus = "Shipped" | "Confirmed" | "Delivery failed" | "Delivery waiting";

type Customer = {
  id: string;
  name: string;
  avatar?: string;
  initials: string;
  initialsColor: "blue" | "neutral";
  purchase: Purchase;
  status: CustStatus;
  product: string;
  region: string;
  price: number;
  updated: string;
  updatedTs: number;
};

const PRODUCTS = ["Sneakers", "Backpack", "Smart watch", "Headphones", "Sunglasses", "Wallet"];
const REGIONS = ["North America", "Europe", "Asia", "Oceania"];
const FIRST_NAMES = ["Ava", "Liam", "Sofia", "Noah", "Mia", "Ethan", "Isla", "Lucas", "Amara", "Leo", "Nina", "Oscar", "Ella", "Hugo", "Freya", "Milo"];
const LAST_NAMES = ["Kim", "Garcia", "Muller", "Tanaka", "Smith", "Dubois", "Costa", "Novak", "Larsen", "Silva", "Weber", "Kaur", "Berg", "Rossi", "Park", "Haugen"];

function buildCustomers(): Customer[] {
  const exact: Array<Omit<Customer, "id" | "product" | "region" | "initialsColor">> = [
    { name: "John Clarkson", avatar: "/avatars/john-clarkson.webp", initials: "JC", purchase: "waiting", status: "Delivery failed", price: 3412, updated: "Sep 05, 2026", updatedTs: new Date(2026, 8, 5).getTime() },
    { name: "Aspen Lubin", avatar: "/avatars/aspen-lubin.webp", initials: "AL", purchase: "waiting", status: "Delivery failed", price: 1899, updated: "Mar 25, 2026", updatedTs: new Date(2026, 2, 25).getTime() },
    { name: "Michael Ekstrom", avatar: "/avatars/michael-ekstrom.webp", initials: "ME", purchase: "completed", status: "Shipped", price: 2752, updated: "Aug 01, 2026", updatedTs: new Date(2026, 7, 1).getTime() },
    { name: "Kianna Vaccaro", avatar: "/avatars/kianna-vaccaro.webp", initials: "KV", purchase: "completed", status: "Shipped", price: 145, updated: "Apr 02, 2026", updatedTs: new Date(2026, 3, 2).getTime() },
    { name: "Livia Saris", avatar: "/avatars/livia-saris.webp", initials: "LS", purchase: "processing", status: "Delivery failed", price: 708, updated: "Nov 14, 2026", updatedTs: new Date(2026, 10, 14).getTime() },
    { name: "Jaydon Aminoff", avatar: "/avatars/jaydon-aminoff.webp", initials: "JA", purchase: "processing", status: "Delivery waiting", price: 224, updated: "Jul 17, 2026", updatedTs: new Date(2026, 6, 17).getTime() },
    { name: "Maria Lubin", avatar: "/avatars/maria-lubin.webp", initials: "ML", purchase: "completed", status: "Shipped", price: 2959, updated: "Nov 15, 2026", updatedTs: new Date(2026, 10, 15).getTime() },
    { name: "Ann Press", avatar: "/avatars/ann-press.webp", initials: "AP", purchase: "processing", status: "Delivery waiting", price: 2646, updated: "Sep 20, 2026", updatedTs: new Date(2026, 8, 20).getTime() },
    { name: "Zaire Torff", initials: "ZT", purchase: "completed", status: "Confirmed", price: 3770, updated: "Feb 04, 2026", updatedTs: new Date(2026, 1, 4).getTime() },
    { name: "Gretchen Septimus", initials: "GS", purchase: "completed", status: "Shipped", price: 3740, updated: "Apr 20, 2026", updatedTs: new Date(2026, 3, 20).getTime() },
    { name: "Omar Vetrovs", initials: "OV", purchase: "waiting", status: "Delivery failed", price: 1747, updated: "Jul 10, 2026", updatedTs: new Date(2026, 6, 10).getTime() },
    { name: "Talan Calzoni", initials: "TC", purchase: "completed", status: "Confirmed", price: 3976, updated: "Nov 13, 2026", updatedTs: new Date(2026, 10, 13).getTime() },
  ];
  const rng = mulberry32(660);
  const rows: Customer[] = exact.map((c, i) => ({
    ...c,
    id: String(i),
    product: PRODUCTS[Math.floor(rng() * PRODUCTS.length)],
    region: REGIONS[Math.floor(rng() * REGIONS.length)],
    initialsColor: "neutral" as const,
  }));
  const purchases: Purchase[] = ["waiting", "completed", "processing"];
  const statuses: CustStatus[] = ["Shipped", "Confirmed", "Delivery failed", "Delivery waiting"];
  for (let i = 12; i < 660; i++) {
    const first = FIRST_NAMES[Math.floor(rng() * FIRST_NAMES.length)];
    const last = LAST_NAMES[Math.floor(rng() * LAST_NAMES.length)];
    const month = Math.floor(rng() * 12);
    const day = 1 + Math.floor(rng() * 28);
    rows.push({
      id: String(i),
      name: `${first} ${last}`,
      initials: `${first[0]}${last[0]}`,
      initialsColor: rng() > 0.5 ? "blue" : "neutral",
      purchase: purchases[Math.floor(rng() * purchases.length)],
      status: statuses[Math.floor(rng() * statuses.length)],
      product: PRODUCTS[Math.floor(rng() * PRODUCTS.length)],
      region: REGIONS[Math.floor(rng() * REGIONS.length)],
      price: 20 + Math.floor(rng() * 3980),
      updated: `${MONTHS_SHORT[month]} ${String(day).padStart(2, "0")}, 2026`,
      updatedTs: new Date(2026, month, day).getTime(),
    });
  }
  return rows;
}

const PRICE_BUCKETS = [
  { id: "all", label: "All prices", test: (_p: number) => true },
  { id: "under-100", label: "Under $100", test: (p: number) => p < 100 },
  { id: "100-500", label: "$100 – $500", test: (p: number) => p >= 100 && p <= 500 },
  { id: "500-1000", label: "$500 – $1,000", test: (p: number) => p > 500 && p <= 1000 },
  { id: "over-1000", label: "Over $1,000", test: (p: number) => p > 1000 },
];

const PURCHASE_META: Record<Purchase, { label: string; dot: "green" | "yellow" | "indigo" }> = {
  completed: { label: "Completed", dot: "green" },
  waiting: { label: "Waiting", dot: "yellow" },
  processing: { label: "Processing", dot: "indigo" },
};

const STATUS_DOT: Record<CustStatus, "green" | "yellow" | "indigo"> = {
  Shipped: "green",
  Confirmed: "indigo",
  "Delivery waiting": "yellow",
  "Delivery failed": "yellow",
};

/* ------------------------------------------------------------------ */
/* Shared bits: delta chip, modal, toast.                              */
/* ------------------------------------------------------------------ */

function DeltaChip({ current, previous }: { current: number; previous: number }) {
  const d = deltaOf(current, previous);
  return <Chip variant="bold" color={d.color}>{d.label}</Chip>;
}

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
/* Period chart card: Earnings (area) / Revenue (bars), Weekly /       */
/* Monthly / Yearly segmented control, hover swaps the headline.       */
/* ------------------------------------------------------------------ */

function PeriodChartCard({
  label,
  series,
  variant,
  periodLabel,
  className,
  flexGrow = true,
}: {
  label: string;
  series: Record<Period, ChartPoint[]>;
  variant: "area" | "bars";
  periodLabel: string;
  className?: string;
  /** Revenue is flex-1 in the original; Earnings is w-full with no flex-1. */
  flexGrow?: boolean;
}) {
  const [period, setPeriod] = useState<Period>("weekly");
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const data = series[period];
  const totalCurrent = data.reduce((s, p) => s + p.current, 0);
  const totalPrevious = data.reduce((s, p) => s + p.previous, 0);
  const hovering = activeIndex !== null && activeIndex < data.length;
  const point = hovering ? data[activeIndex] : null;
  const headline = point ? point.current : totalCurrent;
  const comparison = point ? point.previous : totalPrevious;
  const yMax = Math.max(...data.map((d) => Math.max(d.current, d.previous)));
  const money = (v: number) => (v >= 1000 ? `$${(v / 1000).toFixed(v % 1000 === 0 ? 0 : 1)}k` : `$${v}`);

  return (
    <section className={cx("flex h-[337px] min-w-0 flex-col gap-6 rounded-2xl bg-background-secondary-default px-4 pt-4 pb-3", flexGrow && "flex-1", className)}>
      <div className="flex w-full flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div className="flex min-w-0 flex-col gap-0.5">
          <p className="w-full text-body-medium text-text-secondary">{point ? point.label : label}</p>
          <div className="flex w-full items-center gap-2">
            <p key={activeIndex ?? "total"} className="animate-number-fade text-title-1-medium whitespace-nowrap text-text-primary tabular-nums">
              {fmtMoney(headline)}
            </p>
            <DeltaChip current={headline} previous={comparison} />
          </div>
          <p className="text-body-2-medium text-text-tertiary tabular-nums">
            {fmtMoney(comparison)} {point ? "previous period" : "previous total"}
          </p>
        </div>
        <SegmentedControl
          aria-label={periodLabel}
          selectedKeys={[period]}
          onSelectionChange={(keys) => {
            const [key] = keys;
            if (key === "weekly" || key === "monthly" || key === "yearly") {
              setPeriod(key);
              setActiveIndex(null);
            }
          }}
        >
          <SegmentedControlItem id="weekly">Weekly</SegmentedControlItem>
          <SegmentedControlItem id="monthly">Monthly</SegmentedControlItem>
          <SegmentedControlItem id="yearly">Yearly</SegmentedControlItem>
        </SegmentedControl>
      </div>
      <div className="min-h-0 w-full flex-1">
        <ResponsiveContainer width="100%" height="100%">
          {variant === "bars" ? (
            <BarChart
              data={data}
              margin={{ top: 4, right: 6, bottom: 0, left: 0 }}
              onMouseMove={(state) => {
                const index = Number(state?.activeTooltipIndex);
                if (state?.isTooltipActive && Number.isFinite(index)) setActiveIndex(index);
              }}
              onMouseLeave={() => setActiveIndex(null)}
            >
              <CartesianGrid vertical={false} stroke="var(--color-chart-track)" strokeDasharray="3 3" />
              <XAxis dataKey="label" tickLine={false} axisLine={false} tickMargin={12} tick={{ fontSize: 13, fill: "var(--color-text-tertiary)" }} />
              <YAxis width={44} domain={[0, yMax * 1.15]} tickCount={4} tickFormatter={money} tickLine={false} axisLine={false} tick={{ fontSize: 12, fill: "var(--color-text-tertiary)" }} />
              <Tooltip content={() => null} cursor={{ fill: "var(--color-chart-track)", opacity: 0.35 }} />
              <Bar dataKey="previous" fill="var(--color-chart-neutral)" radius={[4, 4, 0, 0]} maxBarSize={18} />
              <Bar dataKey="current" radius={[4, 4, 0, 0]} maxBarSize={18}>
                {data.map((_, i) => (
                  <Cell key={i} fill={i === activeIndex ? "var(--color-chart-6-active)" : "var(--color-chart-6)"} />
                ))}
              </Bar>
            </BarChart>
          ) : (
            <AreaChart
              data={data}
              margin={{ top: 4, right: 6, bottom: 0, left: 0 }}
              onMouseMove={(state) => {
                const index = Number(state?.activeTooltipIndex);
                if (state?.isTooltipActive && Number.isFinite(index)) setActiveIndex(index);
              }}
              onMouseLeave={() => setActiveIndex(null)}
            >
              <defs>
                <linearGradient id="earningsFill" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="var(--color-chart-2)" stopOpacity={0.35} />
                  <stop offset="100%" stopColor="var(--color-chart-2)" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid vertical={false} stroke="var(--color-chart-track)" strokeDasharray="3 3" />
              <XAxis dataKey="label" tickLine={false} axisLine={false} tickMargin={12} tick={{ fontSize: 13, fill: "var(--color-text-tertiary)" }} />
              <YAxis width={44} domain={[0, yMax * 1.15]} tickCount={4} tickFormatter={money} tickLine={false} axisLine={false} tick={{ fontSize: 12, fill: "var(--color-text-tertiary)" }} />
              <Tooltip content={() => null} cursor={{ stroke: "var(--color-chart-cursor)", strokeWidth: 1, strokeDasharray: "4 4" }} />
              <Area type="monotone" dataKey="previous" stroke="var(--color-chart-neutral)" strokeWidth={2} strokeDasharray="5 5" fill="transparent" dot={false} activeDot={false} />
              <Area type="monotone" dataKey="current" stroke="var(--color-chart-2-active)" strokeWidth={2} fill="url(#earningsFill)" dot={false} activeDot={{ r: 4, fill: "var(--color-chart-2-active)", stroke: "var(--color-background-primary-default)", strokeWidth: 2 }} />
            </AreaChart>
          )}
        </ResponsiveContainer>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* Recent hires card (h-329px, 4 per page, 56 total).                  */
/* ------------------------------------------------------------------ */

function RecentHiresCard() {
  const hires = useMemo(() => buildHires(), []);
  const [page, setPage] = useState(0);
  const [selected, setSelected] = useState<string | null>(null);
  const perPage = 4;
  const totalPages = Math.ceil(hires.length / perPage);
  const visible = hires.slice(page * perPage, page * perPage + perPage);
  return (
    <section className="relative flex h-[329px] min-w-0 flex-1 flex-col rounded-2xl bg-background-secondary-default p-2">
      <div className="flex w-full items-center justify-between px-2 pt-2">
        <div className="flex items-baseline gap-2">
          <p className="text-title-3-semibold text-text-primary">Recent hires</p>
          <span className="text-body-medium text-text-secondary tabular-nums">{hires.length}</span>
        </div>
        <div className="flex items-center gap-1">
          <IconButton icon={RiArrowLeftSLine} size="small" aria-label="Previous hires" disabled={page === 0} onClick={() => setPage((p) => Math.max(0, p - 1))} />
          <IconButton icon={RiArrowRightSLine} size="small" aria-label="Next hires" disabled={page >= totalPages - 1} onClick={() => setPage((p) => Math.min(totalPages - 1, p + 1))} />
        </div>
      </div>
      <p className="px-2 pt-0.5 text-body-2-regular text-text-tertiary">Board team</p>
      <div className="flex w-full flex-1 flex-col justify-center px-2">
        {visible.map((hire, hi) => (
          <button
            key={`${hire.name}-${page * perPage + hi}`}
            type="button"
            onClick={() => setSelected(selected === hire.name ? null : hire.name)}
            aria-pressed={selected === hire.name}
            className={cx(
              "flex w-full cursor-pointer items-center gap-3 rounded-xl border-b border-separator-border px-1 py-2.5 text-start last:border-b-0",
              selected === hire.name && "bg-background-secondary-hover",
            )}
          >
            {hire.avatar ? (
              <Avatar size="md" src={hire.avatar} alt="" />
            ) : (
              <Avatar size="md" color={hire.color} initials={hire.initials} />
            )}
            <span className="flex min-w-0 flex-1 flex-col">
              <span className="truncate text-body-medium text-text-primary">{hire.name}</span>
              <span className="truncate text-body-2-regular text-text-secondary">{hire.role}</span>
            </span>
            <span className="shrink-0 text-body-2-regular whitespace-nowrap text-text-tertiary">{hire.joined}</span>
          </button>
        ))}
      </div>
      <p className="px-2 pb-1 text-caption-1-regular text-text-tertiary">
        Page {page + 1} of {totalPages}
        {selected ? ` · Selected: ${selected}` : ""}
      </p>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* Contributions card: 958 this year, 4 stat tiles, Activity period,   */
/* GitHub-style heatmap with hover readout.                            */
/* ------------------------------------------------------------------ */

function ContributionsCard() {
  const { cells } = useMemo(() => buildContributions(), []);
  const [period, setPeriod] = useState<Period>("weekly");
  const [hovered, setHovered] = useState<HeatCell | null>(null);
  const monthMarks = useMemo(() => {
    const marks: { col: number; label: string }[] = [];
    let last = "";
    for (let col = 0; col < 37; col++) {
      const date = cells[col]?.date;
      if (!date) continue;
      const m = MONTHS_SHORT[date.getMonth()];
      if (m !== last) {
        const prev = marks[marks.length - 1];
        if (!prev || col - prev.col >= 2) marks.push({ col, label: m });
        last = m;
      }
    }
    return marks;
  }, [cells]);
  const tiles = [
    { value: "9B", label: "Lifetime tokens" },
    { value: "562.7M", label: "Peak tokens" },
    { value: "12h 54m", label: "Longest task" },
    { value: "62 days", label: "Top streak" },
  ];
  const readout = (cell: HeatCell) =>
    cell.value === 0
      ? `No contributions on ${MONTHS_SHORT[cell.date.getMonth()]} ${cell.date.getDate()}`
      : `${cell.value} contribution${cell.value === 1 ? "" : "s"} on ${MONTHS_SHORT[cell.date.getMonth()]} ${cell.date.getDate()}`;
  return (
    <section className="flex h-auto min-w-0 flex-1 flex-col gap-4 overflow-hidden rounded-2xl bg-background-secondary-default p-4 sm:h-[337px]">
      <div className="flex w-full flex-col gap-0.5">
        <p className="w-full text-body-medium text-text-secondary">Contributions this year</p>
        <div className="flex w-full items-center gap-2">
          <p className="text-title-1-medium whitespace-nowrap text-text-primary tabular-nums">958</p>
          <Chip variant="bold" color="lime">+14.8%</Chip>
        </div>
      </div>
      <div className="-mx-2 grid grid-cols-2 gap-2 sm:flex sm:items-stretch">
        {tiles.map((tile) => (
          <div key={tile.label} className="flex min-w-0 flex-col items-start rounded-2lg bg-background-inner-default p-2.5 shadow-card sm:flex-1">
            <p className="w-full truncate text-body-medium text-text-primary">{tile.value}</p>
            <p className="w-full truncate text-body-medium text-text-secondary">{tile.label}</p>
          </div>
        ))}
      </div>
      <div className="-mt-2 flex min-h-0 w-full flex-1 flex-col gap-1">
        <div className="flex w-full items-center justify-between gap-2">
          <p className="text-body-medium text-text-secondary">Activity</p>
          <SegmentedControl
            aria-label="Activity period"
            selectedKeys={[period]}
            onSelectionChange={(keys) => {
              const [key] = keys;
              if (key === "weekly" || key === "monthly" || key === "yearly") setPeriod(key);
            }}
          >
            <SegmentedControlItem id="weekly">Weekly</SegmentedControlItem>
            <SegmentedControlItem id="monthly">Monthly</SegmentedControlItem>
            <SegmentedControlItem id="yearly">Yearly</SegmentedControlItem>
          </SegmentedControl>
        </div>
        <div className="flex min-h-0 w-full flex-1 flex-col gap-1.5 overflow-x-auto sm:overflow-visible">
          <div className="contributions-grid flex w-max flex-col gap-1.5 sm:w-full sm:max-w-[500px]" data-accent="violet">
            <div className="relative h-4 w-full">
              {monthMarks.map((m) => (
                <span key={m.label} className="absolute text-caption-1-regular text-text-tertiary" style={{ left: `${(m.col / 37) * 100}%` }}>
                  {m.label}
                </span>
              ))}
            </div>
            <div className="grid gap-1 grid-cols-[repeat(37,13px)] sm:grid-cols-[repeat(37,minmax(0,1fr))]" role="img" aria-label="Contributions heatmap, 958 contributions this year">
              {cells.map((cell, i) => (
                <button
                  key={i}
                  type="button"
                  data-tier={cell.tier}
                  aria-label={readout(cell)}
                  onMouseEnter={() => setHovered(cell)}
                  onMouseLeave={() => setHovered(null)}
                  onFocus={() => setHovered(cell)}
                  onBlur={() => setHovered(null)}
                  onClick={() => setHovered(cell)}
                  className="contribution-cell aspect-square w-full cursor-pointer rounded-[3px] outline-none focus-visible:ring-2 focus-visible:ring-border-focus-ring"
                />
              ))}
            </div>
            <div className="flex w-full items-center justify-between">
              <p className="min-h-4 text-caption-1-regular text-text-tertiary" aria-live="polite">
                {hovered ? readout(hovered) : `Showing ${period === "weekly" ? "this week" : period === "monthly" ? "this month" : "this year"} · hover a day for its count`}
              </p>
              <p className="flex shrink-0 items-center gap-1 text-caption-1-regular text-text-tertiary">
                Less
                {[0, 1, 2, 3, 4, 5].map((tier) => (
                  <span key={tier} className="contribution-cell inline-block size-2.5 rounded-[2px]" data-tier={tier} />
                ))}
                More
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* Create ticket modal (header Create + table row Edit).                */
/* ------------------------------------------------------------------ */

function CreateTicketModal({
  open,
  onClose,
  initialCustomer,
  onCreated,
}: {
  open: boolean;
  onClose: () => void;
  initialCustomer?: string;
  onCreated: (title: string) => void;
}) {
  const [customer, setCustomer] = useState(initialCustomer ?? "John Clarkson");
  const [title, setTitle] = useState("");
  const [priority, setPriority] = useState("Medium");
  const [description, setDescription] = useState("");
  useEffect(() => {
    if (open) {
      setCustomer(initialCustomer ?? "John Clarkson");
      setTitle("");
      setPriority("Medium");
      setDescription("");
    }
  }, [open, initialCustomer]);
  const canSubmit = title.trim().length > 0;
  return (
    <Modal open={open} onClose={onClose} title="Create ticket">
      <div className="flex flex-col gap-1">
        <span className="text-body-medium text-text-secondary">Customer</span>
        <Select aria-label="Ticket customer" selectedKey={customer} onSelectionChange={(k) => setCustomer(String(k))}>
          {["John Clarkson", "Aspen Lubin", "Michael Ekstrom", "Kianna Vaccaro", "Livia Saris", "Maria Lubin"].map((name) => (
            <SelectItem key={name} id={name} textValue={name}>{name}</SelectItem>
          ))}
        </Select>
      </div>
      <Input label="Title" placeholder="e.g. Delivery failed for order #4821" value={title} onChange={(v) => setTitle(v)} />
      <div className="flex flex-col gap-1">
        <span className="text-body-medium text-text-secondary">Priority</span>
        <Select aria-label="Ticket priority" selectedKey={priority} onSelectionChange={(k) => setPriority(String(k))}>
          {["Low", "Medium", "High", "Urgent"].map((p) => (
            <SelectItem key={p} id={p} textValue={p}>{p}</SelectItem>
          ))}
        </Select>
      </div>
      <Textarea label="Description" placeholder="What happened, and what should support do?" value={description} onChange={(v) => setDescription(v)} rows={3} />
      <div className="flex w-full justify-end gap-2">
        <Button variant="secondary" size="medium" onClick={onClose}>Cancel</Button>
        <Button variant="primary" size="medium" leadingIcon={RiAddFill} disabled={!canSubmit} onClick={() => { onCreated(title.trim()); onClose(); }}>
          Create ticket
        </Button>
      </div>
    </Modal>
  );
}

/* ------------------------------------------------------------------ */
/* Customers table: 660 rows, 12 per page, filters + search + sort +   */
/* selection + editable purchase/status + row actions + pagination.     */
/* ------------------------------------------------------------------ */

type Filters = { price: string; product: string; region: string; query: string };

function RowMoreMenu({ onAction }: { onAction: (label: string) => void }) {
  const [isOpen, setIsOpen] = useState(false);
  const items = [
    { icon: RiUserLine, label: "View profile" },
    { icon: RiFileCopyLine, label: "Duplicate row" },
    { icon: RiDownload2Line, label: "Download invoice" },
    { icon: RiEditLine, label: "Archive customer" },
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

function CustomersTable({
  rows,
  setRows,
  filters,
  setFilters,
  onEdit,
  showToast,
}: {
  rows: Customer[];
  setRows: (rows: Customer[]) => void;
  filters: Filters;
  setFilters: (f: Filters) => void;
  onEdit: (c: Customer) => void;
  showToast: (msg: string) => void;
}) {
  const [page, setPage] = useState(0);
  const [sort, setSort] = useState<{ key: "name" | "updatedTs" | "price"; dir: "asc" | "desc" } | null>(null);
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const perPage = 12;

  useEffect(() => {
    setPage(0);
  }, [filters.price, filters.product, filters.region, filters.query]);

  const filtered = useMemo(() => {
    const bucket = PRICE_BUCKETS.find((b) => b.id === filters.price) ?? PRICE_BUCKETS[0];
    const q = filters.query.trim().toLowerCase();
    const list = rows.filter(
      (c) =>
        bucket.test(c.price) &&
        (filters.product === "all" || c.product === filters.product) &&
        (filters.region === "all" || c.region === filters.region) &&
        (q === "" || c.name.toLowerCase().includes(q)),
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

  const updateRow = (id: string, patch: Partial<Customer>) => {
    setRows(rows.map((r) => (r.id === id ? { ...r, ...patch } : r)));
  };

  const toggleSort = (key: "name" | "updatedTs" | "price") => {
    setSort((s) => (s?.key === key ? { key, dir: s.dir === "asc" ? "desc" : "asc" } : { key, dir: "asc" }));
  };

  const sortMark = (key: "name" | "updatedTs" | "price") =>
    sort?.key === key ? (sort.dir === "asc" ? " ↑" : " ↓") : "";

  return (
    <section className="flex w-full flex-col rounded-2xl border border-border-table pt-2 pb-3">
      <div className="flex w-full flex-col items-start gap-3 px-3 py-1 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-col justify-center">
          <p className="text-body-medium whitespace-nowrap text-text-tertiary">Total Results</p>
          <p className="text-body-medium whitespace-nowrap text-text-primary">
            {filtered.length.toLocaleString()} customers{selected.size > 0 ? ` · ${selected.size} selected` : ""}
          </p>
        </div>
        <div className="-mx-3 flex w-[calc(100%+1.5rem)] items-center gap-2.5 overflow-x-auto px-3 sm:mx-0 sm:w-auto sm:flex-wrap sm:justify-end sm:overflow-visible sm:px-0">
          <Select aria-label="Filter by price" className="shrink-0" popoverClassName="min-w-40" selectedKey={filters.price} onSelectionChange={(k) => setFilters({ ...filters, price: String(k) })}>
            {PRICE_BUCKETS.map((b) => (
              <SelectItem key={b.id} id={b.id} textValue={b.label}>{b.label}</SelectItem>
            ))}
          </Select>
          <Select aria-label="Filter by product" className="shrink-0" popoverClassName="min-w-40" selectedKey={filters.product} onSelectionChange={(k) => setFilters({ ...filters, product: String(k) })}>
            <SelectItem id="all" textValue="All products">All products</SelectItem>
            {PRODUCTS.map((p) => (
              <SelectItem key={p} id={p} textValue={p}>{p}</SelectItem>
            ))}
          </Select>
          <Select aria-label="Filter by region" className="shrink-0" popoverClassName="min-w-40" selectedKey={filters.region} onSelectionChange={(k) => setFilters({ ...filters, region: String(k) })}>
            <SelectItem id="all" textValue="All regions">All regions</SelectItem>
            {REGIONS.map((r) => (
              <SelectItem key={r} id={r} textValue={r}>{r}</SelectItem>
            ))}
          </Select>
          <InputBase
            aria-label="Search customers"
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
        <div className="min-w-[1020px]">
          <div className="flex w-full items-center border-b border-border-table px-3 py-2 text-body-2-medium text-text-tertiary">
            <span className="flex w-10 shrink-0 items-center">
              <Checkbox
                aria-label="Select all customers on this page"
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
            <button type="button" onClick={() => toggleSort("name")} className="w-[240px] shrink-0 cursor-pointer text-start hover:text-text-primary">Customer name{sortMark("name")}</button>
            <span className="w-[172px] shrink-0">Purchase</span>
            <span className="w-[168px] shrink-0">Status</span>
            <button type="button" onClick={() => toggleSort("updatedTs")} className="w-[160px] shrink-0 cursor-pointer text-start hover:text-text-primary">Last updated{sortMark("updatedTs")}</button>
            <button type="button" onClick={() => toggleSort("price")} className="w-[140px] shrink-0 cursor-pointer text-start hover:text-text-primary">Price{sortMark("price")}</button>
            <span className="w-[132px] shrink-0">Actions</span>
          </div>
          {pageRows.map((c) => (
            <div key={c.id} className={cx("flex w-full items-center border-b border-separator-border px-3 py-2.5 last:border-b-0", selected.has(c.id) && "bg-background-secondary-hover")}>
              <span className="flex w-10 shrink-0 items-center">
                <Checkbox
                  aria-label={`Select ${c.name}`}
                  isSelected={selected.has(c.id)}
                  onChange={(v) => {
                    setSelected((prev) => {
                      const next = new Set(prev);
                      if (v) next.add(c.id);
                      else next.delete(c.id);
                      return next;
                    });
                  }}
                />
              </span>
              <button
                type="button"
                onClick={() => onEdit(c)}
                className="flex w-[240px] min-w-0 shrink-0 cursor-pointer items-center gap-2 text-start"
                aria-label={`Open ${c.name}`}
              >
                {c.avatar ? (
                  <Avatar size="sm" src={c.avatar} alt="" />
                ) : (
                  <Avatar size="sm" color={c.initialsColor} initials={c.initials} />
                )}
                <span className="truncate text-body-medium text-text-primary">{c.name}</span>
              </button>
              <span className="w-[172px] shrink-0 pe-3">
                <Select
                  aria-label={`Purchase status for ${c.name}`}
                  size="sm"
                  className="w-[142px]"
                  selectedKey={c.purchase}
                  onSelectionChange={(k) => updateRow(c.id, { purchase: String(k) as Purchase })}
                >
                  {(Object.keys(PURCHASE_META) as Purchase[]).map((p) => (
                    <SelectItem key={p} id={p} textValue={PURCHASE_META[p].label}>
                      <StatusDot color={PURCHASE_META[p].dot} />
                      {PURCHASE_META[p].label}
                    </SelectItem>
                  ))}
                </Select>
              </span>
              <span className="w-[168px] shrink-0 pe-3">
                <Select
                  aria-label={`Delivery status for ${c.name}`}
                  size="sm"
                  className="w-[142px]"
                  selectedKey={c.status}
                  onSelectionChange={(k) => updateRow(c.id, { status: String(k) as CustStatus })}
                >
                  {(["Shipped", "Confirmed", "Delivery failed", "Delivery waiting"] as CustStatus[]).map((s) => (
                    <SelectItem key={s} id={s} textValue={s}>
                      <StatusDot color={STATUS_DOT[s]} />
                      {s}
                    </SelectItem>
                  ))}
                </Select>
              </span>
              <span className="w-[160px] shrink-0 text-body-medium whitespace-nowrap text-text-secondary tabular-nums">{c.updated}</span>
              <span className="w-[140px] shrink-0 text-body-medium whitespace-nowrap text-text-primary tabular-nums">{fmtPrice(c.price)}</span>
              <span className="flex w-[132px] shrink-0 items-center gap-1.5">
                <IconButton icon={RiEditLine} size="small" aria-label={`Edit ${c.name}`} onClick={() => onEdit(c)} />
                <RowMoreMenu
                  onAction={(label) => {
                    if (label === "Duplicate row") {
                      const copy: Customer = { ...c, id: `copy-${c.id}-${Date.now()}`, name: `${c.name} (copy)` };
                      setRows([copy, ...rows]);
                      showToast(`Duplicated ${c.name}`);
                    } else if (label === "Archive customer") {
                      setRows(rows.filter((r) => r.id !== c.id));
                      showToast(`Archived ${c.name}`);
                    } else {
                      showToast(`${label}: ${c.name}`);
                    }
                  }}
                />
              </span>
            </div>
          ))}
          {pageRows.length === 0 && (
            <p className="px-3 py-8 text-center text-body-medium text-text-tertiary">No customers match these filters.</p>
          )}
        </div>
      </div>

      <div className="flex w-full flex-col items-center gap-3 px-3 pt-3 sm:flex-row sm:justify-between">
        <p className="text-body-2-medium text-text-tertiary">
          Page {safePage + 1} of {totalPages} · {filtered.length.toLocaleString()} customers
        </p>
        <Pagination page={safePage + 1} totalPages={totalPages} onChange={(p) => setPage(p - 1)} aria-label="Customers pagination" />
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* Page.                                                               */
/* ------------------------------------------------------------------ */

export default function DashboardTemplatePage() {
  const [customers, setCustomers] = useState<Customer[]>(() => buildCustomers());
  const [filters, setFilters] = useState<Filters>({ price: "all", product: "all", region: "all", query: "" });
  const [filterOpen, setFilterOpen] = useState(false);
  const [ticketOpen, setTicketOpen] = useState(false);
  const [ticketCustomer, setTicketCustomer] = useState<string | undefined>(undefined);
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

  const openTicket = (customer?: string) => {
    setTicketCustomer(customer);
    setTicketOpen(true);
  };

  return (
    <TemplateShell
      title="Home"
      heading="Welcome Mertcan"
      icon={RiHomeLine}
      selected="home"
      actions={
        <>
          <NotificationBell />
          <div className="relative" ref={filterRef}>
            <Button variant="secondary" size="medium" leadingIcon={RiFilter3Fill} aria-expanded={filterOpen} onClick={() => setFilterOpen((o) => !o)}>
              Filters
            </Button>
            {filterOpen && (
                <div className="absolute right-0 z-40 mt-2 flex w-[280px] flex-col gap-3 rounded-2xl border border-border-button-default bg-background-primary-default p-3 shadow-lg">
                  <p className="text-body-medium text-text-primary">Filter customers</p>
                  <Select aria-label="Filter by price" selectedKey={filters.price} onSelectionChange={(k) => setFilters({ ...filters, price: String(k) })}>
                    {PRICE_BUCKETS.map((b) => (
                      <SelectItem key={b.id} id={b.id} textValue={b.label}>{b.label}</SelectItem>
                    ))}
                  </Select>
                  <Select aria-label="Filter by product" selectedKey={filters.product} onSelectionChange={(k) => setFilters({ ...filters, product: String(k) })}>
                    <SelectItem id="all" textValue="All products">All products</SelectItem>
                    {PRODUCTS.map((p) => (
                      <SelectItem key={p} id={p} textValue={p}>{p}</SelectItem>
                    ))}
                  </Select>
                  <Select aria-label="Filter by region" selectedKey={filters.region} onSelectionChange={(k) => setFilters({ ...filters, region: String(k) })}>
                    <SelectItem id="all" textValue="All regions">All regions</SelectItem>
                    {REGIONS.map((r) => (
                      <SelectItem key={r} id={r} textValue={r}>{r}</SelectItem>
                    ))}
                  </Select>
                  <div className="flex justify-end gap-2">
                    <Button variant="secondary" size="medium" onClick={() => { setFilters({ price: "all", product: "all", region: "all", query: "" }); setFilterOpen(false); }}>
                      Clear
                    </Button>
                    <Button variant="primary" size="medium" onClick={() => setFilterOpen(false)}>Done</Button>
                  </div>
                </div>
            )}
          </div>
          <Button variant="primary" size="medium" leadingIcon={RiAddFill} onClick={() => openTicket()}>
            Create ticket
          </Button>
        </>
      }
    >
      <div className="flex w-full flex-col gap-4 xl:flex-row">
        <RecentHiresCard />
        <PeriodChartCard label="Earned so far" series={EARNINGS} variant="area" periodLabel="Earnings period" flexGrow={false} className="h-[329px] w-full xl:w-[673px] xl:shrink-0" />
      </div>

      <div className="flex w-full flex-col items-stretch gap-4 lg:flex-row lg:items-start">
        <PeriodChartCard label="Revenue" series={REVENUE} variant="bars" periodLabel="Revenue period" />
        <ContributionsCard />
      </div>

      <StatCards variant="plain" />

      <CustomersTable
        rows={customers}
        setRows={setCustomers}
        filters={filters}
        setFilters={setFilters}
        onEdit={(c) => openTicket(c.name)}
        showToast={setToast}
      />

      <CreateTicketModal
        open={ticketOpen}
        onClose={() => setTicketOpen(false)}
        initialCustomer={ticketCustomer}
        onCreated={(title) => setToast(`Ticket created: ${title}`)}
      />
      <Toast message={toast} />
    </TemplateShell>
  );
}
