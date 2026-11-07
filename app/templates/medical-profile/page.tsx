"use client";

import {
  RiAddFill,
  RiAsterisk,
  RiCheckLine,
  RiCloseLine,
  RiEditLine,
  RiFileTextLine,
  RiFilter3Fill,
  RiMoonClearFill,
  RiRunLine,
  RiSearchLine,
} from "@remixicon/react";
import { useEffect, useMemo, useRef, useState } from "react";
import { Bar, BarChart, Cell, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

import { TemplateShell } from "@/components/application/template-shell/template-shell";
import { ImportantAlertsCard } from "@/components/application/medical/important-alerts-card";
import { PatientInfoCard } from "@/components/application/medical/patient-info-card";
import { WeekRangePill } from "@/components/application/medical/week-range-pill";
import { NotificationBell } from "@/components/application/app-shell/notification-bell";
import { Button } from "@/components/base/buttons/button";
import { IconButton } from "@/components/base/buttons/icon-button";
import { InputBase } from "@/components/base/input/input";
import { cx } from "@/utils/cx";

/**
 * Medical Profile template replica — 1:1 functional rebuild.
 * Source: boardui.com/templates/medical-profile server-rendered HTML.
 * Copied from that page: patient card (Mertcan Esmergül, 28 July 1997,
 * Male, A rh+, Dr. Mattheus Clarkson), steps 31,600 (29 Jun - 5 Jul),
 * sleep score 98 = Duration 49/50 + Bedtime 29/30 + Interruptions 20/20,
 * Most active days 32,459 with all 365 day rings (Jan 1 – Jul 10 carry
 * data, later days are empty — the original year runs to Jul 10, 2026),
 * activity detail for July 10, 2026 (Move 816 kcal / Exercise 1h 41m /
 * Running 5.2 km; rings 21/62/77%), alerts feed (12 this week), and the
 * 540-patient table (page 1 rows verbatim, pagination 45 pages).
 * Built only from free BoardUI components + mock data. Not the Pro source.
 *
 * Two values are NOT in the downloaded HTML and are marked as such:
 * - per-day step counts (the chart is client-rendered): the 7 values used
 *   sum exactly to the original 31,600 headline.
 * - absolute Move/Exercise/Running for days other than Jul 10: derived by
 *   scaling Jul 10's values by each day's ring fraction (goals inferred
 *   from Jul 10: Move 3,886 kcal, Exercise 163 min, Running 6.75 km).
 */

/* ------------------------------------------------------------------ */
/* Steps (week switching)                                              */
/* ------------------------------------------------------------------ */

const STEP_WEEKS = [
  { label: "29 Jun - 5 Jul", days: [4200, 5100, 3800, 5400, 4600, 3900, 4600], total: 31600 },
  { label: "22 - 28 Jun", days: [3900, 4700, 5100, 3600, 4800, 5200, 4100], total: 31400 },
  { label: "6 - 12 Jul", days: [4500, 3800, 4900, 5300, 4400, 3700, 4800], total: 31400 },
];
const STEP_DAY_NAMES = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

/* ------------------------------------------------------------------ */
/* Sleep score                                                         */
/* ------------------------------------------------------------------ */

/* Row dot colours are the originals (verified from the SSR styles):
   Duration chart-5, Bedtime chart-3, Interruptions chart-6. `color` is
   the ring-segment colour (unchanged — the ring itself is client-
   rendered, so its colours are not verifiable from SSR). */
const SLEEP_ROWS = [
  { key: "duration", label: "Duration", value: "7h 50m", score: 49, max: 50, color: "var(--color-chart-3-active)", dot: "var(--color-chart-5)" },
  { key: "bedtime", label: "Bedtime", value: "20m earlier", score: 29, max: 30, color: "var(--color-chart-2)", dot: "var(--color-chart-3)" },
  { key: "interruptions", label: "Interruptions", value: "5m wake up", score: 20, max: 20, color: "var(--color-chart-4)", dot: "var(--color-chart-6)" },
];

/* ------------------------------------------------------------------ */
/* Most active days — [Move%, Exercise%, Running%] per day, Jan 1–Dec 31 */
/* ------------------------------------------------------------------ */

const MINI_RINGS: [number, number, number][] = [[18,77,59],[19,47,90],[31,88,51],[59,57,38],[78,66,75],[37,60,74],[19,79,82],[34,75,90],[21,73,76],[21,73,35],[19,89,61],[33,93,65],[24,67,90],[46,33,72],[90,50,46],[24,82,73],[22,71,32],[30,60,86],[32,60,30],[55,81,75],[68,54,57],[32,67,61],[18,40,67],[23,46,31],[21,82,67],[26,33,94],[66,30,86],[21,85,40],[36,50,54],[29,78,48],[23,52,91],[79,76,65],[40,95,49],[79,68,80],[36,65,77],[62,66,38],[67,42,73],[64,90,45],[65,87,47],[23,42,40],[30,58,42],[18,55,94],[63,73,38],[82,89,47],[74,61,79],[68,69,39],[51,87,46],[21,90,62],[19,66,50],[85,81,69],[19,57,42],[19,44,88],[94,71,52],[37,78,52],[57,85,75],[26,92,45],[33,51,62],[42,83,30],[60,38,53],[77,90,84],[31,84,30],[28,30,80],[90,31,54],[43,79,71],[43,62,37],[58,85,85],[25,60,55],[57,54,35],[73,75,73],[50,73,65],[34,62,48],[30,45,36],[52,53,34],[40,55,37],[28,56,69],[32,49,83],[24,89,83],[30,40,82],[19,63,79],[87,59,41],[24,34,64],[21,55,48],[19,70,47],[57,80,62],[59,73,36],[19,82,93],[94,47,73],[43,39,81],[63,38,87],[43,32,43],[19,61,57],[38,76,85],[68,69,59],[31,71,81],[76,63,42],[18,92,39],[27,51,93],[48,74,48],[27,84,59],[19,79,59],[23,72,33],[93,42,52],[67,68,52],[26,65,41],[61,84,93],[18,65,89],[22,47,60],[34,37,74],[26,46,40],[18,57,47],[86,62,73],[23,77,45],[75,60,31],[26,30,62],[18,34,95],[81,77,85],[64,76,75],[35,95,89],[39,84,74],[19,70,70],[56,32,34],[40,94,32],[21,67,87],[42,84,73],[78,78,71],[32,93,95],[27,53,66],[19,50,48],[26,68,35],[40,34,70],[25,71,59],[53,68,42],[38,33,31],[25,61,80],[55,96,94],[51,51,80],[18,31,49],[18,49,67],[29,77,86],[18,41,58],[27,70,80],[18,93,75],[34,36,96],[22,85,61],[48,94,40],[18,52,43],[20,36,87],[53,50,87],[18,80,40],[51,45,78],[18,56,85],[18,45,73],[71,69,71],[66,64,63],[21,47,35],[71,92,91],[84,86,62],[35,67,41],[67,83,45],[41,75,70],[20,45,60],[62,38,37],[21,78,93],[18,46,63],[78,91,77],[54,44,60],[61,34,73],[43,46,32],[20,39,40],[18,62,34],[26,81,87],[31,56,51],[20,31,86],[90,81,40],[18,90,33],[27,70,49],[82,42,49],[66,33,69],[50,64,66],[74,74,43],[26,84,56],[23,95,37],[48,61,60],[83,92,55],[89,43,59],[49,79,91],[50,37,38],[20,81,33],[80,53,78],[33,70,31],[21,62,77],[0,0,0],[0,0,0],[0,0,0],[0,0,0],[0,0,0],[0,0,0],[0,0,0],[0,0,0],[0,0,0],[0,0,0],[0,0,0],[0,0,0],[0,0,0],[0,0,0],[0,0,0],[0,0,0],[0,0,0],[0,0,0],[0,0,0],[0,0,0],[0,0,0],[0,0,0],[0,0,0],[0,0,0],[0,0,0],[0,0,0],[0,0,0],[0,0,0],[0,0,0],[0,0,0],[0,0,0],[0,0,0],[0,0,0],[0,0,0],[0,0,0],[0,0,0],[0,0,0],[0,0,0],[0,0,0],[0,0,0],[0,0,0],[0,0,0],[0,0,0],[0,0,0],[0,0,0],[0,0,0],[0,0,0],[0,0,0],[0,0,0],[0,0,0],[0,0,0],[0,0,0],[0,0,0],[0,0,0],[0,0,0],[0,0,0],[0,0,0],[0,0,0],[0,0,0],[0,0,0],[0,0,0],[0,0,0],[0,0,0],[0,0,0],[0,0,0],[0,0,0],[0,0,0],[0,0,0],[0,0,0],[0,0,0],[0,0,0],[0,0,0],[0,0,0],[0,0,0],[0,0,0],[0,0,0],[0,0,0],[0,0,0],[0,0,0],[0,0,0],[0,0,0],[0,0,0],[0,0,0],[0,0,0],[0,0,0],[0,0,0],[0,0,0],[0,0,0],[0,0,0],[0,0,0],[0,0,0],[0,0,0],[0,0,0],[0,0,0],[0,0,0],[0,0,0],[0,0,0],[0,0,0],[0,0,0],[0,0,0],[0,0,0],[0,0,0],[0,0,0],[0,0,0],[0,0,0],[0,0,0],[0,0,0],[0,0,0],[0,0,0],[0,0,0],[0,0,0],[0,0,0],[0,0,0],[0,0,0],[0,0,0],[0,0,0],[0,0,0],[0,0,0],[0,0,0],[0,0,0],[0,0,0],[0,0,0],[0,0,0],[0,0,0],[0,0,0],[0,0,0],[0,0,0],[0,0,0],[0,0,0],[0,0,0],[0,0,0],[0,0,0],[0,0,0],[0,0,0],[0,0,0],[0,0,0],[0,0,0],[0,0,0],[0,0,0],[0,0,0],[0,0,0],[0,0,0],[0,0,0],[0,0,0],[0,0,0],[0,0,0],[0,0,0],[0,0,0],[0,0,0],[0,0,0],[0,0,0],[0,0,0],[0,0,0],[0,0,0],[0,0,0],[0,0,0],[0,0,0],[0,0,0],[0,0,0],[0,0,0],[0,0,0],[0,0,0],[0,0,0],[0,0,0],[0,0,0],[0,0,0],[0,0,0],[0,0,0],[0,0,0],[0,0,0],[0,0,0],[0,0,0],[0,0,0],[0,0,0]];

const MONTH_NAMES = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];
const MONTH_SHORT = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
const MONTH_DAYS = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];

function dayIndex(month: number, day: number) {
  let idx = 0;
  for (let m = 0; m < month; m++) idx += MONTH_DAYS[m];
  return idx + day - 1;
}

function fmtExercise(totalMin: number) {
  const h = Math.floor(totalMin / 60);
  const m = totalMin % 60;
  return h > 0 ? `${h}h ${String(m).padStart(2, "0")}m` : `${m}m`;
}

/** Absolute activity for a day, scaled from Jul 10's known values. */
function activityFor(idx: number) {
  const [movePct, exPct, runPct] = MINI_RINGS[idx] ?? [0, 0, 0];
  if (movePct === 0 && exPct === 0 && runPct === 0) return null;
  return {
    movePct,
    exPct,
    runPct,
    moveKcal: Math.round((movePct / 100) * 3886),
    exerciseMin: Math.round((exPct / 100) * 163),
    runningKm: ((runPct / 100) * 6.75).toFixed(1),
  };
}

function MiniRing({ values, size = 28 }: { values: [number, number, number]; size?: number }) {
  const rings = [
    { r: 12, pct: values[0], stroke: "var(--color-chart-3-active)" },
    { r: 8.4, pct: values[1], stroke: "var(--color-chart-2)" },
    { r: 4.8, pct: values[2], stroke: "var(--color-chart-4)" },
  ];
  return (
    <svg viewBox="0 0 28 28" className="shrink-0" style={{ width: size, height: size }} aria-hidden="true">
      {rings.map((ring) => {
        const c = 2 * Math.PI * ring.r;
        return (
          <g key={ring.r} transform="rotate(-90 14 14)">
            <circle cx="14" cy="14" r={ring.r} fill="none" stroke={ring.stroke} strokeWidth="2.2" opacity="0.16" />
            {ring.pct > 0 && (
              <circle
                cx="14" cy="14" r={ring.r} fill="none" stroke={ring.stroke} strokeWidth="2.2"
                strokeLinecap="round" strokeDasharray={`${(ring.pct / 100) * c} ${c}`}
              />
            )}
          </g>
        );
      })}
    </svg>
  );
}

/* Each ring is clickable in the original (<g class="cursor-pointer">);
   what a click does is not visible in SSR, so it surfaces the ring's
   values (pending live verification of the original behaviour). */
function BigRing({ values, onRingClick }: { values: [number, number, number]; onRingClick?: (label: string, pct: number) => void }) {
  const rings = [
    { r: 82, pct: values[0], stroke: "var(--color-chart-3)", label: "Move" },
    { r: 58, pct: values[1], stroke: "var(--color-chart-2)", label: "Exercise" },
    { r: 34, pct: values[2], stroke: "var(--color-chart-4)", label: "Running" },
  ];
  return (
    <svg viewBox="0 0 200 200" className="h-full max-h-[210px] w-full overflow-visible" role="img" aria-label="Move, exercise, and running activity progress">
      {rings.map((ring) => (
        <g key={ring.r} transform="rotate(-90 100 100)" className="cursor-pointer" onClick={() => onRingClick?.(ring.label, ring.pct)}>
          <circle cx="100" cy="100" r={ring.r} fill="none" stroke={ring.stroke} strokeWidth="18" opacity="0.16" />
          {ring.pct > 0 && (
            <circle
              cx="100" cy="100" r={ring.r} fill="none" stroke={ring.stroke} strokeWidth="18"
              strokeLinecap="round" strokeDasharray={`${ring.pct} ${100 - ring.pct}`} pathLength={100}
            />
          )}
        </g>
      ))}
    </svg>
  );
}

/* ------------------------------------------------------------------ */
/* Patient table                                                       */
/* ------------------------------------------------------------------ */

type Admission = "Inpatient" | "Outpatient" | "Discharged" | "Emergency";
type Status = "Stable" | "Under observation" | "Critical" | "Recovering" | "In treatment";

type Patient = {
  name: string;
  initials: string | null;
  admission: Admission;
  status: Status;
  conditions: string[];
  next: string; // e.g. "May 14, 2026"
  checked?: boolean;
};

// Page 1, verbatim from the original.
const PAGE1: Patient[] = [
  { name: "John Clarkson", initials: null, admission: "Outpatient", status: "Recovering", conditions: ["Pregnancy", "Post-op"], next: "May 14, 2026" },
  { name: "Aspen Lubin", initials: null, admission: "Inpatient", status: "In treatment", conditions: ["Hypertension"], next: "Oct 15, 2026", checked: true },
  { name: "Michael Ekstrom", initials: null, admission: "Inpatient", status: "Under observation", conditions: ["Asthma", "Migraine"], next: "Mar 25, 2026", checked: true },
  { name: "Kianna Vaccaro", initials: null, admission: "Inpatient", status: "Stable", conditions: ["Post-op"], next: "Oct 03, 2026" },
  { name: "Livia Saris", initials: null, admission: "Emergency", status: "Critical", conditions: ["Migraine", "Post-op"], next: "Dec 24, 2026" },
  { name: "Jaydon Aminoff", initials: null, admission: "Outpatient", status: "Stable", conditions: ["Diabetes"], next: "Feb 22, 2026" },
  { name: "Maria Lubin", initials: null, admission: "Inpatient", status: "Critical", conditions: ["Pregnancy"], next: "Apr 10, 2026" },
  { name: "Ann Press", initials: null, admission: "Discharged", status: "Stable", conditions: ["Hypertension"], next: "Aug 10, 2026" },
  { name: "Terry Vaccaro", initials: "TV", admission: "Discharged", status: "Recovering", conditions: ["Allergy", "Pregnancy"], next: "Dec 04, 2026" },
  { name: "Ruben Rosser", initials: "RR", admission: "Outpatient", status: "In treatment", conditions: ["Migraine", "Post-op"], next: "Oct 01, 2026" },
  { name: "Ruben Curtis", initials: "RC", admission: "Discharged", status: "Recovering", conditions: ["Allergy", "Fracture"], next: "Aug 21, 2026" },
  { name: "Wilson Vetrovs", initials: "WV", admission: "Discharged", status: "Stable", conditions: ["Pregnancy", "Diabetes"], next: "Aug 17, 2026" },
];

const FIRST = ["Ava", "Liam", "Sofia", "Noah", "Maya", "Ethan", "Zoe", "Lucas", "Nora", "Owen", "Ivy", "Caleb", "Lena", "Jonas", "Freya", "Oscar"];
const LAST = ["Bergström", "Kowalski", "Tanaka", "Novak", "Silva", "Moreau", "Kim", "Haddad", "Larsen", "Petrov", "Nguyen", "Costa", "Weber", "Ali", "Fischer", "Rossi"];
const ADMISSIONS: Admission[] = ["Inpatient", "Outpatient", "Discharged", "Emergency"];
const STATUSES: Status[] = ["Stable", "Under observation", "Critical", "Recovering", "In treatment"];
const CONDITIONS = ["Diabetes", "Hypertension", "Asthma", "Fracture", "Post-op", "Pregnancy", "Allergy", "Migraine"];
const APPT_MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

/** Deterministic generated rows for pages 2–45 (540 patients total). */
function generatedPatient(i: number): Patient {
  const first = FIRST[i % FIRST.length];
  const last = LAST[Math.floor(i / FIRST.length) % LAST.length];
  const n = i * 7 + 3;
  return {
    name: `${first} ${last}`,
    initials: `${first[0]}${last[0]}`,
    admission: ADMISSIONS[n % 4],
    status: STATUSES[(n >> 2) % 5],
    conditions: [CONDITIONS[n % 8], ...(n % 3 === 0 ? [CONDITIONS[(n + 5) % 8]] : [])],
    next: `${APPT_MONTHS[n % 12]} ${String((n % 28) + 1).padStart(2, "0")}, 2026`,
  };
}

const ALL_PATIENTS: Patient[] = [
  ...PAGE1,
  ...Array.from({ length: 540 - PAGE1.length }, (_, i) => generatedPatient(i)),
];

/* First 8 patients have real photo avatars in the original; the last 4
   use initials circles. Photos ship in public/avatars/. */
const AVATARS: Record<string, string> = {
  "John Clarkson": "/avatars/john-clarkson.webp",
  "Aspen Lubin": "/avatars/aspen-lubin.webp",
  "Michael Ekstrom": "/avatars/michael-ekstrom.webp",
  "Kianna Vaccaro": "/avatars/kianna-vaccaro.webp",
  "Livia Saris": "/avatars/livia-saris.webp",
  "Jaydon Aminoff": "/avatars/jaydon-aminoff.webp",
  "Maria Lubin": "/avatars/maria-lubin.webp",
  "Ann Press": "/avatars/ann-press.webp",
};

const STATUS_STYLE: Record<Status, string> = {
  Stable: "bg-status-lime-background text-status-lime-text",
  "Under observation": "bg-amber-100 text-amber-800",
  Critical: "bg-rose-100 text-rose-700",
  Recovering: "bg-sky-100 text-sky-700",
  "In treatment": "bg-violet-100 text-violet-700",
};

function initialsOf(name: string) {
  return name.split(" ").map((w) => w[0]).join("").slice(0, 2).toUpperCase();
}

export default function MedicalProfileTemplatePage() {
  const [weekIdx, setWeekIdx] = useState(0);
  const [hoveredBar, setHoveredBar] = useState<number | null>(null);
  const [sleepHover, setSleepHover] = useState<string | null>(null);
  const [focusMonth, setFocusMonth] = useState(0); // January — the original pill starts on January
  const [selectedDay, setSelectedDay] = useState({ month: 6, day: 10 });
  const [statusFilter, setStatusFilter] = useState("All statuses");
  const [conditionFilter, setConditionFilter] = useState("All conditions");
  const [query, setQuery] = useState("");
  const [page, setPage] = useState(1);
  const [sortKey, setSortKey] = useState<"name" | "next" | null>(null);
  const [sortDir, setSortDir] = useState<1 | -1>(1);
  const [admissionEdits, setAdmissionEdits] = useState<Record<string, Admission>>({});
  const [photoSrc, setPhotoSrc] = useState<string | undefined>(undefined);
  const photoInputRef = useRef<HTMLInputElement>(null);
  const [checked, setChecked] = useState<Set<string>>(
    () => new Set(PAGE1.filter((p) => p.checked).map((p) => p.name)),
  );
  const [admissionMenu, setAdmissionMenu] = useState<string | null>(null);
  const [reportOpen, setReportOpen] = useState(false);
  const [reportType, setReportType] = useState("Lab results");
  const [reportNote, setReportNote] = useState("");
  const [toast, setToast] = useState<string | null>(null);
  const monthRowRefs = useRef<(HTMLDivElement | null)[]>([]);
  const toastTimer = useRef<number | null>(null);
  const admissionMenuRefs = useRef<Record<string, HTMLSpanElement | null>>({});

  // Admission menu: Esc + click-outside close, like the original React Aria Select.
  useEffect(() => {
    if (!admissionMenu) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setAdmissionMenu(null);
    };
    const onDown = (e: MouseEvent) => {
      const el = admissionMenuRefs.current[admissionMenu];
      if (el && !el.contains(e.target as Node)) setAdmissionMenu(null);
    };
    document.addEventListener("keydown", onKey);
    document.addEventListener("mousedown", onDown);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.removeEventListener("mousedown", onDown);
    };
  }, [admissionMenu]);

  const showToast = (msg: string) => {
    setToast(msg);
    if (toastTimer.current) window.clearTimeout(toastTimer.current);
    toastTimer.current = window.setTimeout(() => setToast(null), 3500);
  };

  const week = STEP_WEEKS[weekIdx];
  const stepData = week.days.map((steps, i) => ({ day: STEP_DAY_NAMES[i], steps }));
  const selIdx = dayIndex(selectedDay.month, selectedDay.day);
  const selActivity = activityFor(selIdx);
  const selRings: [number, number, number] = MINI_RINGS[selIdx] ?? [0, 0, 0];

  const filtered = useMemo(() => {
    let rows = ALL_PATIENTS;
    if (statusFilter !== "All statuses") rows = rows.filter((p) => p.status === statusFilter);
    if (conditionFilter !== "All conditions") rows = rows.filter((p) => p.conditions.includes(conditionFilter));
    const q = query.trim().toLowerCase();
    if (q !== "") rows = rows.filter((p) => p.name.toLowerCase().includes(q));
    if (sortKey === "name") {
      rows = [...rows].sort((a, b) => sortDir * a.name.localeCompare(b.name));
    } else if (sortKey === "next") {
      rows = [...rows].sort((a, b) => sortDir * (new Date(a.next).getTime() - new Date(b.next).getTime()));
    }
    return rows;
  }, [query, statusFilter, conditionFilter, sortKey, sortDir]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / 12));
  const safePage = Math.min(page, totalPages);
  const pageRows = filtered.slice((safePage - 1) * 12, safePage * 12);
  const allChecked = pageRows.length > 0 && pageRows.every((p) => checked.has(p.name));

  const toggleSort = (key: "name" | "next") => {
    if (sortKey === key) setSortDir((d) => (d === 1 ? -1 : 1));
    else {
      setSortKey(key);
      setSortDir(1);
    }
    setPage(1);
  };

  const toggleCheck = (name: string) => {
    setChecked((prev) => {
      const next = new Set(prev);
      if (next.has(name)) next.delete(name);
      else next.add(name);
      return next;
    });
  };

  const toggleCheckAll = () => {
    setChecked((prev) => {
      const next = new Set(prev);
      if (allChecked) pageRows.forEach((p) => next.delete(p.name));
      else pageRows.forEach((p) => next.add(p.name));
      return next;
    });
  };

  const pageNumbers = useMemo(() => {
    const nums: (number | "…")[] = [];
    for (let n = 1; n <= Math.min(5, totalPages); n++) nums.push(n);
    if (totalPages > 5) {
      nums.push("…");
      nums.push(totalPages);
    }
    return nums;
  }, [totalPages]);

  const scrollToMonth = (m: number) => {
    setFocusMonth(m);
    monthRowRefs.current[m]?.scrollIntoView({ behavior: "smooth", block: "nearest" });
  };

  return (
    <TemplateShell
      title="Medical Report"
      heading="Medical Profile"
      icon={RiAsterisk}
      selected="medical"
      actions={
        <>
          <NotificationBell />
          <Button
            variant="secondary"
            size="medium"
            leadingIcon={RiFilter3Fill}
            onClick={() => {
              document.getElementById("patient-table")?.scrollIntoView({ behavior: "smooth" });
              showToast("Use the Status / Condition filters above the patient table.");
            }}
          >
            Filters
          </Button>
          <Button variant="primary" size="medium" leadingIcon={RiAddFill} onClick={() => setReportOpen(true)}>
            File a report
          </Button>
        </>
      }
    >
      <div className="flex w-full flex-col gap-4 xl:flex-row">
        <PatientInfoCard
          photoSrc={photoSrc}
          onAddPhoto={() => photoInputRef.current?.click()}
        />
        <input
          ref={photoInputRef}
          type="file"
          accept="image/*"
          aria-label="Choose profile photo"
          className="hidden"
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) {
              setPhotoSrc((prev) => {
                if (prev) URL.revokeObjectURL(prev);
                return URL.createObjectURL(file);
              });
            }
            e.target.value = "";
          }}
        />
        <ImportantAlertsCard />
      </div>

      <div className="flex w-full flex-col gap-4 xl:flex-row">
        {/* Steps — 31,600 total, week switcher */}
        <section className="flex min-w-0 flex-1 flex-col gap-3 rounded-2xl bg-background-secondary-default p-4">
          <div className="flex w-full items-start justify-between gap-2">
            <div className="flex items-center gap-2">
              <RiRunLine className="size-5 text-foreground-icon-primary" aria-hidden />
              <p className="text-body-medium text-text-secondary">Steps</p>
            </div>
            <WeekRangePill
              label={week.label}
              onPrev={() => setWeekIdx((i) => (i + STEP_WEEKS.length - 1) % STEP_WEEKS.length)}
              onNext={() => setWeekIdx((i) => (i + 1) % STEP_WEEKS.length)}
            />
          </div>
          <div className="flex items-baseline gap-2">
            <p className="text-title-1-medium whitespace-nowrap text-text-primary tabular-nums">
              {week.total.toLocaleString("en-US")}
            </p>
            <span className="text-caption-1-medium whitespace-nowrap text-text-secondary">total steps</span>
          </div>
          <div className="h-[180px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={stepData} margin={{ top: 4, right: 4, bottom: 0, left: 0 }} barCategoryGap="30%">
                <XAxis dataKey="day" tickLine={false} axisLine={false} tickMargin={8} tick={{ fontSize: 12, fill: "var(--color-text-tertiary)" }} />
                <YAxis width={36} tickLine={false} axisLine={false} tick={{ fontSize: 12, fill: "var(--color-text-tertiary)" }} />
                <Tooltip
                  cursor={{ fill: "var(--color-background-tertiary-default)" }}
                  content={({ active, payload }) =>
                    active && payload?.length ? (
                      <span className="rounded-lg bg-background-primary-default px-2.5 py-1.5 text-body-2-medium text-text-primary shadow-dropdown">
                        {payload[0].payload.day}: {(payload[0].value as number).toLocaleString("en-US")} steps
                      </span>
                    ) : null
                  }
                />
                <Bar dataKey="steps" radius={[4, 4, 0, 0]} onMouseEnter={(_, i) => setHoveredBar(i)} onMouseLeave={() => setHoveredBar(null)}>
                  {stepData.map((_, i) => (
                    <Cell key={i} fill={hoveredBar === i ? "var(--color-chart-2)" : "var(--color-chart-2-active)"} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </section>

        {/* Sleep score — 98, segmented ring + sub-scores */}
        <section className="flex min-w-0 flex-1 flex-col gap-3 rounded-2xl bg-background-secondary-default p-4">
          <div className="flex w-full items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <RiMoonClearFill className="size-5 text-foreground-icon-primary" aria-hidden />
              <p className="text-body-medium text-text-secondary">Sleep score</p>
            </div>
            <WeekRangePill label="29 Jun - 5 Jul" />
          </div>
          <div className="flex items-center gap-4">
            <div className="relative size-[92px] shrink-0">
              <svg viewBox="0 0 100 100" className="size-full -rotate-90" role="img" aria-label="Sleep score 98 out of 100">
                <circle cx="50" cy="50" r="42" fill="none" stroke="var(--color-background-tertiary-default)" strokeWidth="9" />
                {SLEEP_ROWS.map((row, i) => {
                  const before = SLEEP_ROWS.slice(0, i).reduce((s, r) => s + r.score, 0);
                  const frac = row.score / 100;
                  const offset = before / 100;
                  return (
                    <circle
                      key={row.key}
                      cx="50" cy="50" r="42" fill="none" stroke={row.color} strokeWidth="9"
                      strokeLinecap="butt" pathLength={100}
                      strokeDasharray={`${frac * 100 - 1.5} ${100 - frac * 100 + 1.5}`}
                      strokeDashoffset={-offset * 100}
                      opacity={sleepHover === null || sleepHover === row.key ? 1 : 0.25}
                      onMouseEnter={() => setSleepHover(row.key)}
                      onMouseLeave={() => setSleepHover(null)}
                      style={{ cursor: "pointer" }}
                    />
                  );
                })}
              </svg>
              <span className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-title-1-medium leading-none text-text-primary tabular-nums">98</span>
                <span className="text-caption-1-regular text-text-tertiary">/ 100</span>
              </span>
            </div>
            <div className="flex min-w-0 flex-col">
              <p className="text-title-1-medium whitespace-nowrap text-text-primary">Excellent</p>
              <p className="text-body-2-regular text-text-secondary">Sleep score for 29 Jun - 5 Jul</p>
            </div>
          </div>
          <div className="flex flex-col gap-2">
            {SLEEP_ROWS.map((row) => (
              <div
                key={row.key}
                className="flex w-full items-center justify-between rounded-xl bg-background-inner-default px-3 py-2.5 text-start"
              >
                <span className="flex items-center gap-2 text-body-2-regular text-text-secondary">
                  <span className="size-2.5 rounded-full" style={{ backgroundColor: row.dot }} aria-hidden />
                  {row.label}
                  <span aria-hidden>:</span>
                  {row.value}
                </span>
                <span className="text-body-medium text-text-primary tabular-nums">
                  {row.score} <span className="text-text-tertiary">/ {row.max}</span>
                </span>
              </div>
            ))}
          </div>
        </section>
      </div>

      {/* Most active days + activity detail */}
      <div className="flex w-full flex-col gap-4 xl:flex-row">
        <section className="flex min-w-0 flex-1 flex-col gap-3 rounded-2xl bg-background-secondary-default p-4">
          <div className="flex w-full items-start justify-between gap-2">
            <div className="flex min-w-0 flex-col gap-0.5">
              <p className="text-body-medium text-text-secondary">Most active days</p>
              <div className="flex items-baseline gap-1.5">
                <p className="text-title-1-medium whitespace-nowrap text-text-primary tabular-nums">32,459</p>
                <span className="text-caption-1-medium whitespace-nowrap text-text-secondary">total steps</span>
              </div>
            </div>
            <WeekRangePill
              label={MONTH_NAMES[focusMonth]}
              onPrev={() => scrollToMonth((focusMonth + 11) % 12)}
              onNext={() => scrollToMonth((focusMonth + 1) % 12)}
              className="w-[130px]"
            />
          </div>
          <div className="flex max-h-[380px] flex-col gap-1 overflow-y-auto overscroll-contain pe-1 [scrollbar-width:thin]">
            {MONTH_NAMES.map((name, m) => (
              <div
                key={name}
                ref={(el) => {
                  monthRowRefs.current[m] = el;
                }}
                className="flex items-start gap-2 rounded-xl py-1"
              >
                <span className="w-9 shrink-0 ps-1 pt-2 text-title-3-medium text-text-primary">{MONTH_SHORT[m]}</span>
                <div className="flex min-w-0 flex-1 gap-1 overflow-x-auto pb-1 [scrollbar-width:none]">
                  {Array.from({ length: MONTH_DAYS[m] }, (_, d) => d + 1).map((day) => {
                    const idx = dayIndex(m, day);
                    const values = MINI_RINGS[idx] ?? [0, 0, 0];
                    const isSelected = selectedDay.month === m && selectedDay.day === day;
                    return (
                      <button
                        key={day}
                        type="button"
                        aria-label={`Activity for ${name} ${day}`}
                        aria-pressed={isSelected}
                        onClick={() => {
                          setSelectedDay({ month: m, day });
                          setFocusMonth(m);
                        }}
                        className={cx(
                          "flex h-[78px] w-[52px] shrink-0 cursor-pointer flex-col items-center justify-center gap-2.5 rounded-2lg border-2 p-2.5 outline-none transition-colors duration-150 ease focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-border-focus-ring",
                          isSelected
                            ? "border-accent-500 bg-background-primary-default"
                            : "border-transparent hover:bg-background-primary-hover",
                        )}
                      >
                        <span className="text-body-medium whitespace-nowrap text-text-primary">{day}</span>
                        <MiniRing values={values} />
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
          <p className="text-body-2-regular text-text-tertiary">
            Tap a day to see its activity. Days after 10 July 2026 have no data yet in the original.
          </p>
        </section>

        {/* Activity detail for the selected day */}
        <section className="flex w-full shrink-0 flex-col gap-3 rounded-2xl bg-background-secondary-default p-4 xl:w-[340px]">
          <p className="text-body-medium text-text-secondary">
            Activity for {MONTH_NAMES[selectedDay.month]} {selectedDay.day}, 2026
          </p>
          {selActivity ? (
            <>
              <div className="flex flex-col gap-2">
                <div className="flex items-center justify-between rounded-2lg bg-background-inner-default px-2.5 py-2">
                  <span className="flex items-center gap-1.5 text-body-regular text-text-secondary">
                    <span className="size-3 shrink-0 rounded-[4px]" style={{ backgroundColor: "var(--color-chart-3)" }} aria-hidden />
                    Move
                  </span>
                  <span className="text-body-medium text-text-primary tabular-nums">{selActivity.moveKcal.toLocaleString("en-US")} kcal</span>
                </div>
                <div className="flex items-center justify-between rounded-2lg bg-background-inner-default px-2.5 py-2">
                  <span className="flex items-center gap-1.5 text-body-regular text-text-secondary">
                    <span className="size-3 shrink-0 rounded-[4px]" style={{ backgroundColor: "var(--color-chart-2)" }} aria-hidden />
                    Exercise
                  </span>
                  <span className="text-body-medium text-text-primary tabular-nums">{fmtExercise(selActivity.exerciseMin)}</span>
                </div>
                <div className="flex items-center justify-between rounded-2lg bg-background-inner-default px-2.5 py-2">
                  <span className="flex items-center gap-1.5 text-body-regular text-text-secondary">
                    <span className="size-3 shrink-0 rounded-[4px]" style={{ backgroundColor: "var(--color-chart-4)" }} aria-hidden />
                    Running
                  </span>
                  <span className="text-body-medium text-text-primary tabular-nums">{selActivity.runningKm} km</span>
                </div>
              </div>
              <div className="flex min-h-0 w-full flex-1 items-center justify-center">
                <BigRing
                  values={selRings}
                  onRingClick={(label) => {
                    if (!selActivity) return;
                    const detail =
                      label === "Move"
                        ? `${selActivity.moveKcal.toLocaleString("en-US")} kcal`
                        : label === "Exercise"
                          ? fmtExercise(selActivity.exerciseMin)
                          : `${selActivity.runningKm} km`;
                    const pct = label === "Move" ? selActivity.movePct : label === "Exercise" ? selActivity.exPct : selActivity.runPct;
                    showToast(`${label} · ${pct}% · ${detail}`);
                  }}
                />
              </div>
              <p className="text-center text-body-2-regular text-text-tertiary">
                Move {selActivity.movePct}% · Exercise {selActivity.exPct}% · Running {selActivity.runPct}%
              </p>
            </>
          ) : (
            <p className="py-8 text-center text-body-regular text-text-secondary">No activity recorded for this day yet.</p>
          )}
        </section>
      </div>

      {/* Patient table */}
      <section id="patient-table" className="flex w-full scroll-mt-4 flex-col gap-3 rounded-2xl bg-background-secondary-default p-4">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-baseline gap-2">
            <p className="text-body-medium text-text-tertiary">Total Results</p>
            <p className="text-body-medium text-text-primary tabular-nums">{filtered.length} patients</p>
          </div>
          <div className="-mx-3 flex w-[calc(100%+1.5rem)] items-center gap-2.5 overflow-x-auto px-3 sm:mx-0 sm:w-auto">
            <InputBase
              aria-label="Search patients"
              placeholder="Search"
              leadingIcon={RiSearchLine}
              value={query}
              onChange={(e) => {
                setQuery(e.target.value);
                setPage(1);
              }}
              fieldClassName="min-w-[153px] flex-1 rounded-full bg-background-secondary-default sm:w-[153px] sm:min-w-0 sm:flex-none"
              className="text-body-medium"
            />
            <label className="flex shrink-0 items-center gap-1.5 text-body-2-medium text-text-secondary">
              Status
              <select
                value={statusFilter}
                onChange={(e) => {
                  setStatusFilter(e.target.value);
                  setPage(1);
                }}
                aria-label="Filter by status"
                className="cursor-pointer rounded-2lg border border-border-button-default bg-background-primary-default px-2 py-1.5 text-body-2-medium text-text-primary shadow-xs outline-none focus-visible:ring-2 focus-visible:ring-border-focus-ring"
              >
                {["All statuses", ...STATUSES].map((s) => (
                  <option key={s}>{s}</option>
                ))}
              </select>
            </label>
            <label className="flex shrink-0 items-center gap-1.5 text-body-2-medium text-text-secondary">
              Condition
              <select
                value={conditionFilter}
                onChange={(e) => {
                  setConditionFilter(e.target.value);
                  setPage(1);
                }}
                aria-label="Filter by condition"
                className="cursor-pointer rounded-2lg border border-border-button-default bg-background-primary-default px-2 py-1.5 text-body-2-medium text-text-primary shadow-xs outline-none focus-visible:ring-2 focus-visible:ring-border-focus-ring"
              >
                {["All conditions", ...CONDITIONS].map((s) => (
                  <option key={s}>{s}</option>
                ))}
              </select>
            </label>
          </div>
        </div>

        {checked.size > 0 && (
          <div className="flex items-center justify-between rounded-xl bg-background-tertiary-default px-3 py-2">
            <span className="text-body-medium text-text-primary">{checked.size} selected</span>
            <button
              type="button"
              onClick={() => setChecked(new Set())}
              className="cursor-pointer text-body-2-medium text-text-secondary underline outline-none hover:text-text-primary focus-visible:ring-2 focus-visible:ring-border-focus-ring"
            >
              Clear selection
            </button>
          </div>
        )}

        <div className="w-full overflow-x-auto">
          <table className="w-full min-w-[760px] border-collapse text-start">
            <thead>
              <tr className="border-b border-border-table">
                <th className="w-10 py-2 pe-2 text-start">
                  <input
                    type="checkbox"
                    checked={allChecked}
                    onChange={toggleCheckAll}
                    aria-label="Select all patients on this page"
                    className="size-4 cursor-pointer accent-current"
                  />
                </th>
                <th className="py-2 pe-2 text-start">
                  <button type="button" onClick={() => toggleSort("name")} className="cursor-pointer text-body-2-medium text-text-tertiary outline-none hover:text-text-primary focus-visible:ring-2 focus-visible:ring-border-focus-ring">
                    Patient {sortKey === "name" ? (sortDir === 1 ? "↑" : "↓") : ""}
                  </button>
                </th>
                <th className="py-2 pe-2 text-start text-body-2-medium text-text-tertiary">Admission</th>
                <th className="py-2 pe-2 text-start text-body-2-medium text-text-tertiary">Status</th>
                <th className="py-2 pe-2 text-start text-body-2-medium text-text-tertiary">Condition</th>
                <th className="py-2 pe-2 text-start">
                  <button type="button" onClick={() => toggleSort("next")} className="cursor-pointer text-body-2-medium text-text-tertiary outline-none hover:text-text-primary focus-visible:ring-2 focus-visible:ring-border-focus-ring">
                    Next appointment {sortKey === "next" ? (sortDir === 1 ? "↑" : "↓") : ""}
                  </button>
                </th>
                <th className="py-2 text-end text-body-2-medium text-text-tertiary">Actions</th>
              </tr>
            </thead>
            <tbody>
              {pageRows.map((p) => {
                const admission = admissionEdits[p.name] ?? p.admission;
                const isChecked = checked.has(p.name);
                return (
                  <tr key={p.name} className="border-b border-border-table last:border-b-0">
                    <td className="py-2 pe-2">
                      <input
                        type="checkbox"
                        checked={isChecked}
                        onChange={() => toggleCheck(p.name)}
                        aria-label={`Select ${p.name}`}
                        className="size-4 cursor-pointer accent-current"
                      />
                    </td>
                    <td className="py-2 pe-2">
                      <span className="flex items-center gap-2">
                        {AVATARS[p.name] ? (
                          <img src={AVATARS[p.name]} alt="" className="size-8 shrink-0 rounded-full object-cover" />
                        ) : (
                          <span className="inline-flex size-8 shrink-0 select-none items-center justify-center overflow-hidden rounded-full bg-background-tertiary-default text-body-2-medium text-text-secondary">
                            {p.initials ?? initialsOf(p.name)}
                          </span>
                        )}
                        <span className="whitespace-nowrap text-body-medium text-text-primary">{p.name}</span>
                      </span>
                    </td>
                    <td className="py-2 pe-2">
                      <span
                        ref={(el) => {
                          admissionMenuRefs.current[p.name] = el;
                        }}
                        className="relative inline-block"
                      >
                        <button
                          type="button"
                          aria-label={`Admission status for ${p.name}`}
                          aria-expanded={admissionMenu === p.name}
                          onClick={() => setAdmissionMenu(admissionMenu === p.name ? null : p.name)}
                          className="flex cursor-pointer items-center justify-between gap-1 rounded-2lg border border-border-button-default bg-background-primary-default px-2 py-1 text-body-2-medium text-text-primary shadow-xs outline-none transition-colors hover:bg-background-primary-hover focus-visible:ring-2 focus-visible:ring-border-focus-ring"
                        >
                          {admission}
                          <span aria-hidden>▾</span>
                        </button>
                        {admissionMenu === p.name && (
                          <span className="absolute start-0 top-10 z-20 flex flex-col rounded-xl border border-border-button-default bg-background-primary-default p-1 shadow-dropdown">
                            {ADMISSIONS.map((a) => (
                              <button
                                key={a}
                                type="button"
                                onClick={() => {
                                  setAdmissionEdits((prev) => ({ ...prev, [p.name]: a }));
                                  setAdmissionMenu(null);
                                }}
                                className={cx(
                                  "cursor-pointer whitespace-nowrap rounded-lg px-2.5 py-1.5 text-start text-body-2-medium outline-none hover:bg-background-tertiary-default focus-visible:ring-2 focus-visible:ring-border-focus-ring",
                                  a === admission ? "text-text-primary" : "text-text-secondary",
                                )}
                              >
                                {a}
                              </button>
                            ))}
                          </span>
                        )}
                      </span>
                    </td>
                    <td className="py-2 pe-2">
                      <span className={cx("inline-block whitespace-nowrap rounded-full px-2.5 py-1 text-body-2-medium", STATUS_STYLE[p.status])}>
                        {p.status}
                      </span>
                    </td>
                    <td className="py-2 pe-2">
                      <span className="flex flex-wrap gap-1">
                        {p.conditions.map((c) => (
                          <span key={c} className="whitespace-nowrap rounded-full bg-background-tertiary-default px-2 py-0.5 text-body-2-medium text-text-secondary">
                            {c}
                          </span>
                        ))}
                      </span>
                    </td>
                    <td className="whitespace-nowrap py-2 pe-2 text-body-medium text-text-primary tabular-nums">{p.next}</td>
                    <td className="py-2 text-end">
                      <span className="inline-flex items-center justify-end gap-1">
                        <IconButton
                          icon={RiFileTextLine}
                          size="small"
                          aria-label="View chart"
                          onClick={() => showToast(`Chart for ${p.name}`)}
                        />
                        <IconButton
                          icon={RiEditLine}
                          size="small"
                          aria-label="Edit patient"
                          onClick={() => showToast(`Edit patient: ${p.name}`)}
                        />
                      </span>
                    </td>
                  </tr>
                );
              })}
              {pageRows.length === 0 && (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-body-regular text-text-secondary">
                    No patients match these filters.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-2">
          <p className="text-body-2-regular text-text-tertiary">
            Page {safePage} of {totalPages} · 12 per page
          </p>
          <nav className="flex items-center gap-1" aria-label="Patient pages">
            <button
              type="button"
              disabled={safePage <= 1}
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              className="cursor-pointer rounded-lg px-2.5 py-1.5 text-body-2-medium text-text-secondary outline-none transition-colors hover:bg-background-tertiary-default focus-visible:ring-2 focus-visible:ring-border-focus-ring disabled:cursor-default disabled:opacity-40"
            >
              Previous
            </button>
            {pageNumbers.map((n, i) =>
              n === "…" ? (
                <span key={`gap-${i}`} className="px-1 text-body-2-medium text-text-tertiary">…</span>
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
            <button
              type="button"
              disabled={safePage >= totalPages}
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              className="cursor-pointer rounded-lg px-2.5 py-1.5 text-body-2-medium text-text-secondary outline-none transition-colors hover:bg-background-tertiary-default focus-visible:ring-2 focus-visible:ring-border-focus-ring disabled:cursor-default disabled:opacity-40"
            >
              Next
            </button>
          </nav>
        </div>
      </section>

      {/* File a report dialog */}
      {reportOpen && (
        <div className="fixed inset-0 z-50 flex items-end justify-center p-3 sm:items-center" role="dialog" aria-modal="true" aria-label="File a report">
          <button type="button" aria-label="Close file a report" onClick={() => setReportOpen(false)} className="absolute inset-0 cursor-pointer bg-black/40" />
          <div className="relative w-full max-w-[420px] rounded-3xl border border-border-button-default bg-background-primary-default p-5 shadow-dropdown">
            <div className="flex items-start justify-between gap-2">
              <p className="text-title-2-medium text-text-primary">File a report</p>
              <button type="button" aria-label="Close" onClick={() => setReportOpen(false)} className="flex size-8 cursor-pointer items-center justify-center rounded-full text-foreground-icon-secondary outline-none hover:bg-background-tertiary-default focus-visible:ring-2 focus-visible:ring-border-focus-ring">
                <RiCloseLine className="size-5" aria-hidden />
              </button>
            </div>
            <label className="mt-4 block">
              <span className="text-body-medium text-text-primary">Report type</span>
              <select
                value={reportType}
                onChange={(e) => setReportType(e.target.value)}
                aria-label="Report type"
                className="mt-1.5 w-full cursor-pointer rounded-xl border border-border-button-default bg-background-tertiary-default px-3 py-2 text-body-regular text-text-primary outline-none focus-visible:ring-2 focus-visible:ring-border-focus-ring"
              >
                {["Lab results", "Imaging", "Prescription", "Referral", "Other"].map((t) => (
                  <option key={t}>{t}</option>
                ))}
              </select>
            </label>
            <label className="mt-3 block">
              <span className="text-body-medium text-text-primary">Notes</span>
              <textarea
                rows={3}
                value={reportNote}
                onChange={(e) => setReportNote(e.target.value)}
                placeholder="Add a short note for Dr. Mattheus Clarkson"
                aria-label="Report notes"
                className="mt-1.5 w-full resize-none rounded-xl border border-border-button-default bg-background-tertiary-default p-3 text-body-regular text-text-primary outline-none placeholder:text-text-tertiary focus-visible:ring-2 focus-visible:ring-border-focus-ring"
              />
            </label>
            <div className="mt-5 flex justify-end gap-2">
              <Button variant="secondary" size="medium" onClick={() => setReportOpen(false)}>
                Cancel
              </Button>
              <Button
                variant="primary"
                size="medium"
                leadingIcon={RiCheckLine}
                onClick={() => {
                  setReportOpen(false);
                  setReportNote("");
                  showToast(`${reportType} report filed for Mertcan Esmergül.`);
                }}
              >
                Submit report
              </Button>
            </div>
          </div>
        </div>
      )}

      {toast && (
        <div className="fixed bottom-4 left-1/2 z-[60] -translate-x-1/2 rounded-full bg-background-primary-default px-4 py-2 text-body-medium text-text-primary shadow-dropdown" role="status">
          {toast}
        </div>
      )}
    </TemplateShell>
  );
}
