"use client";

import { useEffect, useRef, useState } from "react";
import { Bar, BarChart, Cell, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis } from "recharts";

import { ImportantAlertsCard } from "@/components/application/medical/important-alerts-card";
import { PatientInfoCard } from "@/components/application/medical/patient-info-card";
import { WeekRangePill } from "@/components/application/medical/week-range-pill";
import { cx } from "@/utils/cx";

import { chromeString, intlLocaleTag, weekRangeLabel, type SiteLocale } from "@/components/application/docs/locale-chrome";

/**
 * The getting-started hero's widget marquee, as on boardui.com/getting-started:
 * one row of six Medical Profile widgets (patient info, steps, sleep score,
 * most active days, activity, important alerts), duplicated for the seamless
 * 72s loop, scaled 0.55 inside a 200px strip.
 *
 * Reuse: PatientInfoCard and ImportantAlertsCard are the site's own
 * components, data-identical to the original's cards. The other four are
 * compact marquee variants built here — the standalone chart cards carry
 * different data (different weeks / months), and the template page's
 * versions are full-width sections, not 360x330 cards. Their data is
 * ports of the original's own client components (read from boardui.com's
 * JS chunks 2026-11-08): the template page's copies differ — wrong step
 * values, lime instead of teal bars, wrong sleep-ring colours — so do not
 * "fix" these cards by copying the template page. MINI_RINGS is the one
 * piece taken from the template page, and it matches the original's
 * ringPct values exactly (verified against the same chunks).
 *
 * The marquee animation + reveal keyframes live in styles/globals.css,
 * copied verbatim from the original's CSS bundle.
 */

const STEP_DAY_NAMES = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
const STEP_DAY_FULL: Record<string, string> = {
  Mon: "Monday", Tue: "Tuesday", Wed: "Wednesday", Thu: "Thursday",
  Fri: "Friday", Sat: "Saturday", Sun: "Sunday",
};

const SLEEP_ROWS = [
  { key: "duration", label: "Duration", value: "7h 50m", score: 49, max: 50, color: "var(--color-chart-5)", dot: "var(--color-chart-5)" },
  { key: "bedtime", label: "Bedtime", value: "20m earlier", score: 29, max: 30, color: "var(--color-chart-3)", dot: "var(--color-chart-3)" },
  { key: "interruptions", label: "Interruptions", value: "5m wake up", score: 20, max: 20, color: "var(--color-chart-6)", dot: "var(--color-chart-6)" },
];

/* Most active days — [Move%, Exercise%, Running%] per day, Jan 1–Dec 31.
 * Copied verbatim from app/templates/medical-profile/page.tsx (same data
 * the original's year calendar renders). Days after 10 July 2026 are
 * [0,0,0] — no data yet in the original. */
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

/** Count-up over 320ms with cubic ease-out, as the original's useCountUp. */
function useCountUp(value: number, duration = 320) {
  const [display, setDisplay] = useState(value);
  const prevRef = useRef(value);
  useEffect(() => {
    const from = prevRef.current;
    if (from === value) return;
    let raf = 0;
    const start = performance.now();
    const tick = (now: number) => {
      const u = Math.min(1, (now - start) / duration);
      const next = Math.round(from + (value - from) * (1 - Math.pow(1 - u, 3)));
      prevRef.current = next;
      setDisplay(next);
      if (u < 1) raf = requestAnimationFrame(tick);
      else prevRef.current = value;
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [value, duration]);
  return display;
}

/** The original's seeded hash (its module 37923): one deterministic float per seed. */
function hash01(seed: number) {
  let a = Math.imul(0x9e3779b9 ^ seed, 0x9e3779b1);
  a = Math.imul(a ^ (a >>> 16), 0x85ebca6b);
  a = Math.imul(a ^ (a >>> 13), 0xc2b2ae35);
  a = (a ^ (a >>> 16)) >>> 0;
  return a / 0x100000000;
}

/** The original's ringPct: per-day activity percentages for the year calendar. */
function ringPct(month: number, day: number, ring: number) {
  const h = hash01(1000 * month + 10 * day + ring);
  return ring === 0 ? 0.18 + h * h * 0.77 : 0.3 + 0.66 * h;
}

function fmtExercise(totalMin: number) {
  const h = Math.floor(totalMin / 60);
  const m = totalMin % 60;
  return h > 0 ? `${h}h ${m}m` : `${m}m`;
}

/** Absolute activity for a day, as the original's dayActivity computes it. */
function dayActivity(month: number, day: number) {
  const move = ringPct(month, day, 0);
  const exercise = ringPct(month, day, 1);
  const running = ringPct(month, day, 2);
  return {
    move: { pct: move, value: `${Math.round(500 + 1500 * move).toLocaleString("en-US")} kcal` },
    exercise: { pct: exercise, value: fmtExercise(Math.round(20 + 130 * exercise)) },
    running: { pct: running, value: `${(1 + 5.5 * running).toFixed(1)} km` },
  };
}

/** One week's steps, exactly as the original's StepsCard generates them:
 * a seeded hash per (week, day); Thu x0.8 / Wed x0.85 on week 0 only. */
function stepWeek(weekIdx: number) {
  const days = STEP_DAY_NAMES.map((label, t) => {
    let value = 100 * Math.round((1800 + 7000 * hash01(100 * weekIdx + t)) / 100);
    if (weekIdx === 0 && label === "Thu") value = 100 * Math.round((0.8 * value) / 100);
    if (weekIdx === 0 && label === "Wed") value = 100 * Math.round((0.85 * value) / 100);
    return { label, value };
  });
  return { days, total: days.reduce((s, d) => s + d.value, 0) };
}

/** Week pill label, as the original computes it from 29 Jun 2026. */
function stepWeekLabel(weekIdx: number) {
  const start = new Date(2026, 5, 29);
  start.setDate(start.getDate() + 7 * weekIdx);
  const end = new Date(start);
  end.setDate(end.getDate() + 6);
  const sm = MONTH_SHORT[start.getMonth()];
  const em = MONTH_SHORT[end.getMonth()];
  return start.getMonth() === end.getMonth()
    ? `${start.getDate()} - ${end.getDate()} ${em}`
    : `${start.getDate()} ${sm} - ${end.getDate()} ${em}`;
}

/** Localized week pill for the steps card: pt-br week 0 comes from the original's dict; other pt-br weeks use localized month shorts in the same template; zh/ja/ar are numeric M/D or D/M via Intl; en keeps stepWeekLabel. */
function formatStepWeekLabel(weekIdx: number, locale: SiteLocale): string {
  if (locale === "en") return stepWeekLabel(weekIdx);
  const start = new Date(2026, 5, 29);
  start.setDate(start.getDate() + 7 * weekIdx);
  const end = new Date(start);
  end.setDate(end.getDate() + 6);
  if (locale === "pt-br" && weekIdx === 0) return chromeString("29 Jun - 5 Jul", locale);
  if (locale === "pt-br") {
    const sm = chromeString(MONTH_SHORT[start.getMonth()], locale);
    const em = chromeString(MONTH_SHORT[end.getMonth()], locale);
    return start.getMonth() === end.getMonth()
      ? `${start.getDate()} - ${end.getDate()} ${em}`
      : `${start.getDate()} ${sm} - ${end.getDate()} ${em}`;
  }
  const fmt = new Intl.DateTimeFormat(intlLocaleTag(locale), { month: "numeric", day: "numeric" });
  return `${fmt.format(start)} - ${fmt.format(end)}`;
}

/** 28px three-ring day cell, as in the medical template's year calendar. */
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

/** Compact steps card: title + week total on the left, week pill on the right, bars below.
 * A port of the original's StepsCard: hash-generated weeks, teal chart-1 bars
 * with a track background + hover cursor outline, hover shows that day's name/value. */
function ShowcaseStepsCard({ locale }: { locale: SiteLocale }) {
  const [weekIdx, setWeekIdx] = useState(0);
  const [hoveredBar, setHoveredBar] = useState<number | null>(null);
  const week = stepWeek(weekIdx);
  const hovered = hoveredBar !== null && hoveredBar < week.days.length;
  const headline = useCountUp(hovered ? week.days[hoveredBar as number].value : week.total);
  const title = hovered ? chromeString(STEP_DAY_FULL[week.days[hoveredBar as number].label], locale) : chromeString("Steps", locale);
  return (
    <section className="flex h-full w-full min-w-0 flex-col gap-4 rounded-[20px] bg-background-secondary-default p-2.5">
      <div className="flex w-full items-start justify-between gap-2 px-1.5 pt-1.5">
        <div className="flex min-w-0 flex-1 flex-col gap-0.5">
          <p className="text-body-medium text-text-secondary">{title}</p>
          <div className="flex items-baseline gap-1">
            <p key={String(hoveredBar)} className="animate-number-fade text-title-1-medium whitespace-nowrap text-text-primary tabular-nums">
              {headline.toLocaleString("en-US")}
            </p>
            <span className="text-caption-1-medium whitespace-nowrap text-text-secondary">{hovered ? "steps" : chromeString("total steps", locale)}</span>
          </div>
        </div>
        <WeekRangePill
          label={formatStepWeekLabel(weekIdx, locale)}
          onPrev={() => setWeekIdx((i) => i - 1)}
          onNext={() => setWeekIdx((i) => i + 1)}
          className="min-w-[151px]"
        />
      </div>
      <div className="-mx-[5.5px] min-h-0 flex-1">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={week.days}
            margin={{ top: 4, right: 0, bottom: 0, left: 0 }}
            barCategoryGap={4.5}
            onMouseMove={(e) => {
              const t = Number(e?.activeTooltipIndex);
              if (e?.isTooltipActive && Number.isInteger(t)) setHoveredBar(t);
              else setHoveredBar(null);
            }}
            onMouseLeave={() => setHoveredBar(null)}
          >
            <Tooltip cursor={false} content={() => null} isAnimationActive={false} />
            <Bar
              dataKey="value"
              fill="var(--color-chart-1)"
              radius={[10, 10, 10, 10]}
              maxBarSize={50}
              background={(props: { x?: number; y?: number; width?: number; height?: number; index?: number }) => {
                const { x = 0, y = 0, width = 0, height = 0, index = -1 } = props;
                return (
                  <g>
                    <rect x={x} y={y} width={width} height={height} rx={10} ry={10} fill="var(--color-chart-track)" />
                    <rect
                      className="transition-opacity duration-150 ease-out"
                      x={x - 3} y={y - 3} width={width + 6} height={height + 6} rx={13} ry={13}
                      fill="none" stroke="var(--color-chart-cursor)" strokeWidth={2}
                      opacity={index === hoveredBar ? 1 : 0}
                    />
                  </g>
                );
              }}
              activeBar={false}
              isAnimationActive
              animationDuration={450}
            >
              {week.days.map((d, i) => (
                <Cell key={d.label} fill={i === hoveredBar ? "var(--color-chart-1-active)" : "var(--color-chart-1)"} />
              ))}
            </Bar>
            <XAxis dataKey="label" tickLine={false} axisLine={false} tickMargin={8} height={26} tick={{ fontSize: 12, fill: "var(--color-text-secondary)" }} tickFormatter={(value: string) => chromeString(value, locale)} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </section>
  );
}

/** Compact sleep score card: title + Excellent on the left, static pill on the right,
 * Recharts donut + sub-scores. A port of the original's SleepScoreCard: the ring
 * is a Pie donut (inner 37 / outer 52, segments chart-5/3/6 + transparent
 * remainder, paddingAngle 4, cornerRadius 99); hovering a segment shows its score. */
function ShowcaseSleepCard({ locale }: { locale: SiteLocale }) {
  const [hovered, setHovered] = useState<number | null>(null);
  const total = SLEEP_ROWS.reduce((s, r) => s + r.score, 0);
  const max = SLEEP_ROWS.reduce((s, r) => s + r.max, 0);
  const pieData = [
    ...SLEEP_ROWS.map((r) => ({ value: r.score, fill: r.color })),
    { value: max - total, fill: "transparent" },
  ];
  const shown = hovered !== null && hovered < SLEEP_ROWS.length ? SLEEP_ROWS[hovered].score : total;
  return (
    <section className="flex h-full w-full min-w-0 flex-col gap-4 rounded-[20px] bg-background-secondary-default p-2.5">
      <div className="flex w-full items-start justify-between gap-2 px-1.5 pt-1.5">
        <div className="flex min-w-0 flex-1 flex-col gap-0.5">
          <p className="text-body-medium text-text-secondary">{chromeString("Sleep score", locale)}</p>
          <p className="text-title-1-medium whitespace-nowrap text-text-primary">
            {total >= 90 ? chromeString("Excellent", locale) : total >= 75 ? chromeString("Good", locale) : total >= 50 ? chromeString("Fair", locale) : chromeString("Poor", locale)}
          </p>
        </div>
        <WeekRangePill label={weekRangeLabel(locale)} className="min-w-[151px]" />
      </div>
      <div className="relative -mt-2 h-[104px] w-full shrink-0">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie data={[{ value: 1 }]} dataKey="value" cx="50%" cy="50%" innerRadius={37} outerRadius={52} fill="var(--color-chart-track)" stroke="none" isAnimationActive={false} />
            <Pie
              data={pieData} dataKey="value" cx="50%" cy="50%" innerRadius={37} outerRadius={52}
              startAngle={90} endAngle={-270} cornerRadius={99} paddingAngle={4} stroke="none"
              onMouseEnter={(_, i) => setHovered(i)} onMouseLeave={() => setHovered(null)}
              isAnimationActive animationDuration={450}
            >
              {pieData.map((d, i) => (
                <Cell
                  key={i} fill={d.fill}
                  opacity={hovered !== null && hovered !== i && i < SLEEP_ROWS.length ? 0.7 : 1}
                  className="transition-opacity duration-200 ease-out"
                />
              ))}
            </Pie>
          </PieChart>
        </ResponsiveContainer>
        <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
          <span key={String(hovered)} className="animate-number-fade text-display-4-medium text-text-primary tabular-nums">{shown}</span>
        </div>
      </div>
      <div className="flex w-full flex-1 flex-col rounded-2lg bg-background-inner-default ps-2.5">
        {SLEEP_ROWS.map((row, i) => (
          <div
            key={row.key}
            className={cx(
              "flex w-full flex-1 items-center justify-between py-2 pe-2.5",
              i < SLEEP_ROWS.length - 1 && "border-b border-separator-border-strong",
            )}
          >
            <div className="flex items-center gap-1.5">
              <span className="size-3 shrink-0 rounded-[4px]" style={{ backgroundColor: row.dot }} />
              <span className="text-body-regular whitespace-nowrap text-text-secondary">
                {chromeString(row.label, locale)}: {chromeString(row.value, locale)}
              </span>
            </div>
            <span className="text-body-medium whitespace-nowrap text-text-primary tabular-nums">
              {row.score}/{row.max}
            </span>
          </div>
        ))}
      </div>
    </section>
  );
}

/** Compact most-active-days card: year calendar in a scrollable inner panel, month pill on top.
 * A port of the original's MostActiveDaysCard: on mount it scrolls to July (month 6)
 * and the pill follows the visible month; prev/next step one month (clamped, no wrap).
 * Day selection is shared with the activity card via the marquee. */
function ShowcaseMostActiveDaysCard({ selectedDay, onSelectDay, locale }: {
  selectedDay: { month: number; day: number } | null;
  onSelectDay: (d: { month: number; day: number }) => void;
  locale: SiteLocale;
}) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const monthRowRefs = useRef<(HTMLDivElement | null)[]>([]);
  const [visibleMonth, setVisibleMonth] = useState(0);

  const scrollToMonth = (m: number, behavior: ScrollBehavior = "smooth") => {
    const target = Math.min(11, Math.max(0, m));
    const container = containerRef.current;
    const row = monthRowRefs.current[target];
    if (!container || !row) return;
    const top = Math.max(0, row.getBoundingClientRect().top - container.getBoundingClientRect().top + container.scrollTop - 9);
    container.scrollTo({ top, behavior });
  };

  useEffect(() => {
    const raf = requestAnimationFrame(() => scrollToMonth(6, "smooth"));
    return () => cancelAnimationFrame(raf);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    let raf = 0;
    const update = () => {
      const top = container.getBoundingClientRect().top;
      let current = 0;
      monthRowRefs.current.forEach((row, i) => {
        if (row && row.getBoundingClientRect().top - top <= 24) current = i;
      });
      setVisibleMonth(current);
    };
    const onScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(update);
    };
    container.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      cancelAnimationFrame(raf);
      container.removeEventListener("scroll", onScroll);
    };
  }, []);

  return (
    <section className="flex h-full w-full min-w-0 flex-col gap-4 rounded-[20px] bg-background-secondary-default p-2.5">
      <div className="flex w-full items-start justify-between gap-2 px-1.5 pt-1.5">
        <div className="flex min-w-0 flex-1 flex-col gap-0.5">
          <p className="text-body-medium whitespace-nowrap text-text-secondary">{chromeString("Most active days", locale)}</p>
          <div className="flex items-baseline gap-1">
            <p className="text-title-1-medium whitespace-nowrap text-text-primary tabular-nums">32,459</p>
            <span className="text-caption-1-medium whitespace-nowrap text-text-secondary">{chromeString("total steps", locale)}</span>
          </div>
        </div>
        <WeekRangePill
          label={chromeString(MONTH_NAMES[visibleMonth], locale)}
          onPrev={() => scrollToMonth(visibleMonth - 1)}
          onNext={() => scrollToMonth(visibleMonth + 1)}
          className="min-w-[128px]"
        />
      </div>
      <div className="min-h-0 w-full flex-1 overflow-hidden rounded-2lg bg-background-inner-default px-2.5">
        <div ref={containerRef} className="h-full w-full overflow-y-auto overscroll-contain">
          <div className="relative flex flex-col gap-4 py-2.5">
            {MONTH_NAMES.map((name, m) => (
              <div
                key={name}
                data-month={m}
                ref={(el) => {
                  monthRowRefs.current[m] = el;
                }}
                className="flex flex-col gap-2.5"
              >
                <p className="ps-1 text-title-3-medium text-text-primary">{chromeString(MONTH_SHORT[m], locale)}</p>
                <div className="grid grid-cols-7 gap-x-[5px]">
                  {Array.from({ length: MONTH_DAYS[m] }, (_, d) => d + 1).map((day) => {
                    const values = MINI_RINGS[dayIndex(m, day)] ?? [0, 0, 0];
                    const isSelected = selectedDay?.month === m && selectedDay?.day === day;
                    return (
                      <button
                        key={day}
                        type="button"
                        aria-pressed={isSelected}
                        aria-label={`Activity for ${name} ${day}`}
                        onClick={() => onSelectDay({ month: m, day })}
                        className={cx(
                          "flex h-[78px] cursor-pointer flex-col items-center justify-center gap-2.5 rounded-2lg border-2 p-2.5 outline-none transition-colors duration-150 ease focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-border-focus-ring",
                          isSelected
                            ? "border-border-button-hover bg-background-primary-default"
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
        </div>
      </div>
    </section>
  );
}

/** Compact activity card: three stat tiles over the concentric Move / Exercise / Running rings.
 * A port of the original's ActivityRingsCard: hovering a ring spotlights it
 * (hover colour, others dim); a day selected in the Most active days card swaps
 * the tiles to that day's values via dayActivity. */
function ShowcaseActivityCard({ selectedDay, locale }: { selectedDay: { month: number; day: number } | null; locale: SiteLocale }) {
  const [hovered, setHovered] = useState<string | null>(null);
  const base = [
    { label: "Move", value: "1,592 kcal", goalPct: 82, color: "var(--color-chart-3)", hoverColor: "var(--color-chart-3-active)" },
    { label: "Exercise", value: "1h 45m", goalPct: 60, color: "var(--color-chart-2)", hoverColor: "var(--color-chart-2-active)" },
    { label: "Running", value: "5.2 km", goalPct: 75, color: "var(--color-chart-4)", hoverColor: "var(--color-chart-4-active)" },
  ];
  const ringRadii = [82, 58, 34];
  const tiles = selectedDay
    ? (() => {
        const a = dayActivity(selectedDay.month, selectedDay.day);
        return [
          { ...base[0], value: a.move.value, goalPct: Math.round(100 * a.move.pct) },
          { ...base[1], value: a.exercise.value, goalPct: Math.round(100 * a.exercise.pct) },
          { ...base[2], value: a.running.value, goalPct: Math.round(100 * a.running.pct) },
        ];
      })()
    : base;
  return (
    <section className="flex h-full w-full min-w-0 flex-col gap-4 rounded-[20px] bg-background-secondary-default p-2.5">
      <div className="flex w-full flex-col gap-[11px]">
        <p className="px-1.5 pt-1.5 text-body-medium text-text-secondary">
          {selectedDay ? `Activity for ${MONTH_NAMES[selectedDay.month]} ${selectedDay.day}, 2026` : chromeString("Activity", locale)}
        </p>
        <div className="flex h-[57px] w-full shrink-0 items-stretch gap-2">
          {tiles.map((tile) => (
            <div
              key={tile.label}
              className={cx(
                "flex flex-1 flex-col items-start justify-end gap-px rounded-2lg bg-background-inner-default px-2.5 py-2 transition-opacity duration-200 ease-out",
                hovered !== null && hovered !== tile.label && "opacity-50",
              )}
            >
              <div className="flex items-center gap-1.5">
                <span className="size-3 shrink-0 rounded-[4px]" style={{ backgroundColor: tile.color }} />
                <span className="text-body-regular whitespace-nowrap text-text-secondary">{chromeString(tile.label, locale)}</span>
              </div>
              <span className="text-body-medium whitespace-nowrap text-text-primary">{tile.value}</span>
            </div>
          ))}
        </div>
      </div>
      <div className="flex min-h-0 w-full flex-1 items-center justify-center">
        <svg viewBox="0 0 200 200" className="h-full max-h-[210px] w-full overflow-visible" role="img" aria-label={chromeString("Move, exercise, and running activity progress", locale)} onMouseLeave={() => setHovered(null)}>
          {tiles.map((tile, a) => {
            const dimmed = hovered !== null && hovered !== tile.label;
            return (
              <g key={tile.label} className="cursor-pointer" transform="rotate(-90 100 100)" onMouseEnter={() => setHovered(tile.label)}>
                <circle cx="100" cy="100" r={ringRadii[a]} fill="none" stroke={tile.color} strokeWidth="18" opacity={dimmed ? 0.06 : 0.16} className="transition-opacity duration-200 ease-out" />
                <circle
                  cx="100" cy="100" r={ringRadii[a]} pathLength={100} fill="none"
                  stroke={hovered === tile.label ? tile.hoverColor : tile.color} strokeWidth="18"
                  strokeLinecap="round" strokeDasharray={`${tile.goalPct} ${100 - tile.goalPct}`}
                  opacity={dimmed ? 0.5 : 1} className="transition-[stroke,stroke-dasharray,opacity] duration-200 ease-out"
                />
              </g>
            );
          })}
        </svg>
      </div>
    </section>
  );
}

function ShowcaseCard({ delay, children }: { delay: string; children: React.ReactNode }) {
  return (
    <div
      className="landing-reveal mr-[11px] h-[182px] w-[198px] shrink-0 overflow-hidden [contain:layout_style_paint] sm:mr-5 sm:h-[330px] sm:w-[360px]"
      style={{ "--landing-reveal-delay": delay } as React.CSSProperties}
    >
      <div className="h-[330px] w-[360px] origin-top-left scale-[0.55] rtl:origin-top-right sm:scale-100">
        {children}
      </div>
    </div>
  );
}

/** The hero's widget marquee: two copies of the six-card row for the seamless loop.
 * The selected day is shared state (as in the original's LandingMarquee):
 * picking a day in Most active days swaps the activity card's values, in both copies. */
export function GettingStartedShowcase({ locale = "en" }: { locale?: SiteLocale } = {}) {
  const [selectedDay, setSelectedDay] = useState<{ month: number; day: number } | null>(null);
  const cards: { delay: string; node: React.ReactNode }[] = [
    { delay: "0.1s", node: <PatientInfoCard locale={locale} /> },
    { delay: "0.3s", node: <ShowcaseStepsCard locale={locale} /> },
    { delay: "0.4s", node: <ShowcaseSleepCard locale={locale} /> },
    { delay: "0.2s", node: <ShowcaseMostActiveDaysCard selectedDay={selectedDay} onSelectDay={setSelectedDay} locale={locale} /> },
    { delay: "0.5s", node: <ShowcaseActivityCard selectedDay={selectedDay} locale={locale} /> },
    { delay: "0s", node: <ImportantAlertsCard locale={locale} /> },
  ];
  return (
    <div className="relative z-10 mt-8 h-[200px] overflow-hidden">
      <div className="w-[182%] origin-top-left scale-[0.55]">
        <section aria-label={chromeString("BoardUI widgets showcase", locale)} className="w-full overflow-x-clip">
          <div className="animate-landing-marquee flex w-max">
            <div className="flex">
              {cards.map((card, i) => (
                <ShowcaseCard key={i} delay={card.delay}>
                  {card.node}
                </ShowcaseCard>
              ))}
            </div>
            <div className="flex" aria-hidden="true">
              {cards.map((card, i) => (
                <ShowcaseCard key={i} delay={card.delay}>
                  {card.node}
                </ShowcaseCard>
              ))}
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
