"use client";

import {
  RiCheckLine,
  RiArrowLeftSLine,
  RiArrowRightSLine,
  RiCloseLine,
  RiEditLine,
  RiShareLine,
  RiUserSmileLine,
} from "@remixicon/react";
import { useMemo, useState } from "react";

import { TemplateShell } from "@/components/application/template-shell/template-shell";
import { Avatar } from "@/components/base/avatar/avatar";
import { Badge } from "@/components/base/badges/badge";
import { Button } from "@/components/base/buttons/button";
import { IconButton } from "@/components/base/buttons/icon-button";
import { cx } from "@/utils/cx";

/**
 * AI Profile template replica.
 * Official: boardui.com/templates/ai-profile — Mertcan Esmergül @sitenley,
 * PRO, cover card, "Contributions this year $0 +14.8%", 9B lifetime tokens /
 * 562.7M peak tokens / 12h 54m longest task / 62 days top streak, Activity
 * (Weekly / Monthly / Yearly) contributions heatmap, Agents (32 agents,
 * December, 30-day bars), Tokens (667.7M tokens, +9.4%, Jun 14 → Today).
 *
 * Every number below is taken from the original page's server-rendered HTML:
 * all 266 heatmap cells (date, count, tier), all 30 agent-bar heights, the
 * exact stat values and labels. Built only from free BoardUI components +
 * hand-drawn SVG. The cover photo is the original file
 * (/templates/ai-profile-cover.png, downloaded from www.boardui.com).
 * Not the official Pro source: the Tokens chart's daily values are not in
 * the original's server-rendered HTML (Recharts renders client-side), so
 * the curve below is redrawn from the visible totals only — its exact
 * shape is unverified, pending a live screenshot.
 */

// [date, count, tier] for all 266 heatmap cells, in the original's DOM order.
// __HEATMAP_DATA__
const HEATMAP: [string, number, number][] = [["Jan 1",0,0],["Jan 11",0,0],["Jan 20",23,4],["Jan 30",3,1],["Feb 8",1,1],["Feb 18",0,0],["Feb 28",10,3],["Mar 9",3,1],["Mar 19",12,3],["Mar 29",0,0],["Apr 7",4,1],["Apr 17",2,1],["Apr 26",12,3],["May 6",2,1],["May 16",13,3],["May 25",0,0],["Jun 4",6,2],["Jun 13",20,4],["Jun 23",1,1],["Jul 3",6,2],["Jul 12",4,1],["Jul 22",9,2],["Aug 1",0,0],["Aug 10",0,0],["Aug 20",0,0],["Aug 29",3,1],["Sep 8",13,3],["Sep 18",0,0],["Sep 27",2,1],["Oct 7",0,0],["Oct 16",4,1],["Oct 26",19,4],["Nov 5",0,0],["Nov 14",0,0],["Nov 24",11,3],["Dec 4",6,2],["Dec 13",9,2],["Dec 23",16,4],["Jan 2",0,0],["Jan 12",0,0],["Jan 22",36,5],["Jan 31",4,1],["Feb 10",3,1],["Feb 19",1,1],["Mar 1",3,1],["Mar 11",0,0],["Mar 20",6,2],["Mar 30",0,0],["Apr 9",9,2],["Apr 18",0,0],["Apr 28",9,2],["May 7",0,0],["May 17",3,1],["May 27",3,1],["Jun 5",3,1],["Jun 15",10,3],["Jun 24",13,3],["Jul 4",18,4],["Jul 14",9,2],["Jul 23",2,1],["Aug 2",3,1],["Aug 12",1,1],["Aug 21",4,1],["Aug 31",0,0],["Sep 9",6,2],["Sep 19",0,0],["Sep 29",0,0],["Oct 8",1,1],["Oct 18",8,2],["Oct 27",0,0],["Nov 6",24,4],["Nov 16",0,0],["Nov 25",11,3],["Dec 5",0,0],["Dec 15",0,0],["Dec 24",4,1],["Jan 4",0,0],["Jan 13",0,0],["Jan 23",1,1],["Feb 2",1,1],["Feb 11",20,4],["Feb 21",19,4],["Mar 2",6,2],["Mar 12",0,0],["Mar 22",0,0],["Mar 31",26,5],["Apr 10",6,2],["Apr 20",2,1],["Apr 29",0,0],["May 9",9,2],["May 18",1,1],["May 28",3,1],["Jun 7",2,1],["Jun 16",2,1],["Jun 26",0,0],["Jul 5",21,4],["Jul 15",9,2],["Jul 25",3,1],["Aug 3",21,4],["Aug 13",22,4],["Aug 23",4,1],["Sep 1",9,2],["Sep 11",13,3],["Sep 20",15,3],["Sep 30",29,5],["Oct 10",6,2],["Oct 19",0,0],["Oct 29",0,0],["Nov 7",6,2],["Nov 17",30,5],["Nov 27",1,1],["Dec 6",10,3],["Dec 16",27,5],["Dec 26",1,1],["Jan 5",0,0],["Jan 15",6,2],["Jan 24",0,0],["Feb 3",6,2],["Feb 13",6,2],["Feb 22",38,5],["Mar 4",15,3],["Mar 13",4,1],["Mar 23",9,2],["Apr 2",3,1],["Apr 11",6,2],["Apr 21",0,0],["May 1",10,3],["May 10",34,5],["May 20",3,1],["May 29",0,0],["Jun 8",1,1],["Jun 18",0,0],["Jun 27",0,0],["Jul 7",6,2],["Jul 16",9,2],["Jul 26",0,0],["Aug 5",1,1],["Aug 14",1,1],["Aug 24",6,2],["Sep 2",2,1],["Sep 12",1,1],["Sep 22",1,1],["Oct 1",4,1],["Oct 11",16,4],["Oct 21",6,2],["Oct 30",1,1],["Nov 9",2,1],["Nov 18",11,3],["Nov 28",14,3],["Dec 8",0,0],["Dec 17",21,4],["Dec 27",10,3],["Jan 6",6,2],["Jan 16",0,0],["Jan 26",14,3],["Feb 4",6,2],["Feb 14",10,3],["Feb 24",1,1],["Mar 5",9,2],["Mar 15",6,2],["Mar 24",34,5],["Apr 3",9,2],["Apr 13",13,3],["Apr 22",2,1],["May 2",3,1],["May 11",6,2],["May 21",6,2],["May 31",17,4],["Jun 9",0,0],["Jun 19",33,5],["Jun 29",6,2],["Jul 8",0,0],["Jul 18",6,2],["Jul 27",2,1],["Aug 6",0,0],["Aug 16",9,2],["Aug 25",9,2],["Sep 4",0,0],["Sep 13",1,1],["Sep 23",12,3],["Oct 3",2,1],["Oct 12",9,2],["Oct 22",2,1],["Nov 1",0,0],["Nov 10",4,1],["Nov 20",12,3],["Nov 29",0,0],["Dec 9",0,0],["Dec 19",6,2],["Dec 28",0,0],["Jan 8",3,1],["Jan 17",0,0],["Jan 27",4,1],["Feb 6",6,2],["Feb 15",9,2],["Feb 25",2,1],["Mar 7",9,2],["Mar 16",2,1],["Mar 26",12,3],["Apr 4",0,0],["Apr 14",14,3],["Apr 24",6,2],["May 3",3,1],["May 13",3,1],["May 22",6,2],["Jun 1",0,0],["Jun 11",15,3],["Jun 20",0,0],["Jun 30",0,0],["Jul 10",24,4],["Jul 19",1,1],["Jul 29",0,0],["Aug 7",3,1],["Aug 17",4,1],["Aug 27",6,2],["Sep 5",3,1],["Sep 15",4,1],["Sep 24",3,1],["Oct 4",0,0],["Oct 14",0,0],["Oct 23",6,2],["Nov 2",2,1],["Nov 12",3,1],["Nov 21",15,3],["Dec 1",14,3],["Dec 10",9,2],["Dec 20",4,1],["Dec 30",3,1],["Jan 9",15,3],["Jan 19",0,0],["Jan 28",0,0],["Feb 7",15,3],["Feb 17",6,2],["Feb 26",11,3],["Mar 8",0,0],["Mar 18",10,3],["Mar 27",6,2],["Apr 6",23,4],["Apr 15",35,5],["Apr 25",12,3],["May 5",9,2],["May 14",0,0],["May 24",6,2],["Jun 2",0,0],["Jun 12",11,3],["Jun 22",6,2],["Jul 1",33,5],["Jul 11",11,3],["Jul 21",1,1],["Jul 30",6,2],["Aug 9",2,1],["Aug 18",0,0],["Aug 28",13,3],["Sep 7",9,2],["Sep 16",21,4],["Sep 26",0,0],["Oct 5",4,1],["Oct 15",6,2],["Oct 25",12,3],["Nov 3",3,1],["Nov 13",3,1],["Nov 23",10,3],["Dec 2",15,3],["Dec 12",0,0],["Dec 21",2,1],["Dec 31",6,2]];

// 30 agent bars, December, in the original's order (px heights, container 206px).
const AGENT_BARS = [73, 141, 118, 4, 118, 18, 4, 4, 4, 95, 4, 158, 78, 45, 4, 45, 135, 88, 4, 4, 107, 21, 45, 105, 87, 66, 19, 128, 98, 34];

const MONTHS = ["October", "November", "December", "January", "February"];
const CURRENT_MONTH_INDEX = 2;

const STATS = [
  { value: "9B", label: "Lifetime tokens" },
  { value: "562.7M", label: "Peak tokens" },
  { value: "12h 54m", label: "Longest task" },
  { value: "62 days", label: "Top streak" },
];

function barSet(monthIndex: number): number[] {
  const shift = ((monthIndex - CURRENT_MONTH_INDEX) * 7 + AGENT_BARS.length) % AGENT_BARS.length;
  return AGENT_BARS.map((_, i) => AGENT_BARS[(i + shift) % AGENT_BARS.length]);
}

export default function AiProfileTemplatePage() {
  // The original defaults to Weekly (aria-checked="true" in the snapshot)
  // and still renders all 266 heatmap cells under Weekly — the period
  // selector does not slice the grid into 7/35 cells. What Weekly/Monthly
  // actually change in the original (aggregation? range?) is not visible
  // in the static HTML, so the selection is state only; the grid always
  // shows the full year.
  const [range, setRange] = useState<"weekly" | "monthly" | "yearly">("weekly");
  const [monthIndex, setMonthIndex] = useState(CURRENT_MONTH_INDEX);
  const [editing, setEditing] = useState(false);
  const [name, setName] = useState("Mertcan Esmergül");
  const [handle, setHandle] = useState("sitenley");
  const [draftName, setDraftName] = useState(name);
  const [draftHandle, setDraftHandle] = useState(handle);
  const [shared, setShared] = useState(false);

  const bars = useMemo(() => barSet(monthIndex), [monthIndex]);
  const month = MONTHS[monthIndex];

  // Token trend: 60 points, Jun 14 → Today (Dec 31), scaled so the total is
  // the original's 667.7M. The original renders this chart with Recharts on
  // the client, so its daily values are NOT in the server-rendered HTML and
  // the true curve shape cannot be recovered from the snapshot. This redraw
  // follows only what the snapshot shows: a rising trend (+9.4%) across the
  // period, ending higher than it starts. Shape unverified — needs a live
  // screenshot to confirm.
  const tokens = useMemo(() => {
    const raw: number[] = [];
    for (let i = 0; i < 60; i++) {
      const t = i / 59;
      const noise = (((i * 41) % 7) - 3) * 0.35;
      raw.push(8.5 + t * 8 + 1.6 * Math.sin(i / 11) + noise);
    }
    const sum = raw.reduce((a, b) => a + b, 0);
    const scale = 667.7 / sum;
    return raw.map((v, i) => {
      const date = new Date(Date.UTC(2026, 5, 14 + Math.round((i * 200) / 59)));
      const label = date.toLocaleDateString("en-US", { month: "short", day: "numeric", timeZone: "UTC" });
      return { label, value: v * scale };
    });
  }, []);

  const tokenPath = useMemo(() => {
    const w = 600;
    const h = 200;
    const max = Math.max(...tokens.map((t) => t.value)) * 1.15;
    const pts = tokens.map((t, i) => [((i / (tokens.length - 1)) * w).toFixed(1), (h - 8 - (t.value / max) * (h - 24)).toFixed(1)] as const);
    const line = pts.map(([x, y], i) => `${i === 0 ? "M" : "L"}${x} ${y}`).join(" ");
    return { line, area: `${line} L${w} ${h} L0 ${h} Z`, pts, max };
  }, [tokens]);

  const share = () => {
    const done = () => {
      setShared(true);
      window.setTimeout(() => setShared(false), 2000);
    };
    if (navigator.clipboard?.writeText) {
      navigator.clipboard.writeText(window.location.href).then(done).catch(done);
    } else {
      done();
    }
  };

  const startEdit = () => {
    setDraftName(name);
    setDraftHandle(handle);
    setEditing(true);
  };

  const saveEdit = () => {
    setName(draftName.trim() || name);
    setHandle(draftHandle.trim().replace(/^@/, "") || handle);
    setEditing(false);
  };

  return (
    <TemplateShell
      title="Profile"
      heading={name}
      icon={RiUserSmileLine}
      selected="profile"
      hideBreadcrumb
      hideHeading
      actions={
        editing ? (
          <>
            <Button variant="secondary" size="medium" leadingIcon={RiCloseLine} onClick={() => setEditing(false)}>
              Cancel
            </Button>
            <Button variant="primary" size="medium" leadingIcon={RiCheckLine} onClick={saveEdit}>
              Save
            </Button>
          </>
        ) : (
          <>
            <Button variant="secondary" size="medium" leadingIcon={RiShareLine} onClick={share}>
              {shared ? "Copied" : "Share"}
            </Button>
            <Button variant="primary" size="medium" leadingIcon={RiEditLine} onClick={startEdit}>
              Edit
            </Button>
          </>
        )
      }
    >
      {/* Cover card — the original's photo, downloaded from
          www.boardui.com/templates/ai-profile-cover.png */}
      <section className="flex w-full flex-col">
        <div className="relative h-40 w-full overflow-hidden rounded-[20px]">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/templates/ai-profile-cover.png" alt="" className="size-full object-cover object-[50%_45%]" />
        </div>
        <div className="relative flex w-full items-start gap-[15px] px-1 pt-3">
          <Avatar size="lg" color="blue" initials="M" className="-mt-10 size-16 shrink-0 text-title-1-medium ring-4 ring-background-full" />
          <div className="flex min-w-0 flex-1 flex-col gap-1">
            {editing ? (
              <>
                <input
                  aria-label="Display name"
                  value={draftName}
                  onChange={(e) => setDraftName(e.target.value)}
                  className="w-full max-w-xs rounded-lg border border-border-button-default bg-background-primary-default px-2 py-1 text-title-2-medium text-text-primary outline-none focus-visible:ring-2 focus-visible:ring-border-focus-ring"
                />
                <span className="flex items-center gap-1.5">
                  <span className="text-headline-medium text-text-secondary">@</span>
                  <input
                    aria-label="Handle"
                    value={draftHandle}
                    onChange={(e) => setDraftHandle(e.target.value)}
                    className="w-full max-w-[10rem] rounded-lg border border-border-button-default bg-background-primary-default px-2 py-1 text-headline-medium text-text-secondary outline-none focus-visible:ring-2 focus-visible:ring-border-focus-ring"
                  />
                  <Badge color="neutral">PRO</Badge>
                </span>
              </>
            ) : (
              <>
                <p className="truncate text-title-2-medium whitespace-nowrap text-text-primary">{name}</p>
                <span className="flex items-center gap-1.5">
                  <p className="truncate text-headline-medium whitespace-nowrap text-text-secondary">@{handle}</p>
                  <Badge color="neutral">PRO</Badge>
                </span>
              </>
            )}
          </div>
        </div>
      </section>

      {/* Contributions + stats + activity heatmap */}
      <section className="flex w-full flex-col gap-2">
        <div className="flex flex-col gap-0.5">
          <p className="text-body-medium text-text-secondary">Contributions this year</p>
          <div className="flex items-center gap-2">
            <p className="text-title-1-medium whitespace-nowrap text-text-primary tabular-nums">$0</p>
            <span className="inline-flex items-center justify-center rounded-md px-1.5 py-0.5 text-body-medium whitespace-nowrap bg-status-purple-background text-status-purple-text">+14.8%</span>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-2 sm:flex sm:items-stretch">
          {STATS.map((stat) => (
            <div key={stat.label} className="flex min-w-0 flex-col items-start rounded-2lg bg-background-secondary-default p-2.5 sm:flex-1">
              <p className="w-full truncate text-body-medium text-text-primary">{stat.value}</p>
              <p className="w-full truncate text-body-2-medium text-text-secondary">{stat.label}</p>
            </div>
          ))}
        </div>
        <div className="flex w-full items-center justify-between pt-1.5 ps-0.5">
          <p className="text-body-2-medium text-text-secondary">Activity</p>
          <div className="relative inline-flex items-start gap-0.5 rounded-2lg" role="radiogroup" aria-label="Activity period">
            {(["weekly", "monthly", "yearly"] as const).map((key) => (
              <button
                key={key}
                type="button"
                role="radio"
                aria-checked={range === key}
                onClick={() => setRange(key)}
                className={cx(
                  "relative z-10 inline-flex cursor-pointer items-center justify-center rounded-md px-2.5 py-1 text-center whitespace-nowrap transition-colors duration-200 ease outline-none focus-visible:ring-2 focus-visible:ring-border-focus-ring",
                  range === key ? "bg-background-primary-default text-body-medium text-text-primary shadow-xs" : "text-body-regular text-text-secondary hover:text-text-primary",
                )}
              >
                {key === "weekly" ? "Weekly" : key === "monthly" ? "Monthly" : "Yearly"}
              </button>
            ))}
          </div>
        </div>
        <div className="flex w-full overflow-x-auto sm:overflow-visible">
          <div
            data-accent="violet"
            className="contributions-grid grid w-max grid-cols-[repeat(38,13px)] gap-1 sm:w-full sm:grid-cols-[repeat(38,minmax(0,1fr))]"
          >
            {HEATMAP.map(([date, count, tier], i) => {
              const label = count === 0 ? `No contributions on ${date}` : `${count} contribution${count === 1 ? "" : "s"} on ${date}`;
              // Original cells: tabindex="-1" (not keyboard-focusable), no
              // title attribute, and animate-cell-pop only on tier > 0
              // cells (200 of 266). Delays in the original are pseudo-random
              // 66–778ms; the exact per-cell values are not recoverable, so
              // a deterministic value in the same range is used.
              return (
                <button
                  key={`${date}-${i}`}
                  type="button"
                  data-tier={tier}
                  tabIndex={-1}
                  aria-label={label}
                  className={cx(
                    "contribution-cell aspect-square w-full cursor-default rounded-[3px] outline-none focus-visible:ring-2 focus-visible:ring-border-focus-ring",
                    tier > 0 && "animate-cell-pop",
                  )}
                  style={tier > 0 ? { animationDelay: `${66 + ((i * 137) % 713)}ms` } : undefined}
                />
              );
            })}
          </div>
        </div>
      </section>

      {/* Agents — 30-day bar chart */}
      <section className="relative flex w-full flex-col rounded-[20px] bg-background-secondary-default py-3">
        <div className="relative z-10 -mb-8 flex w-full px-4 pt-1">
          <div className="flex flex-col gap-0.5">
            <p className="text-body-medium whitespace-nowrap text-text-secondary">Agents</p>
            <p className="text-title-2-medium whitespace-nowrap text-text-primary tabular-nums">32 agents</p>
          </div>
        </div>
        <div className="absolute top-4 end-4 z-20 flex h-8 w-[128px] min-w-[151px] shrink-0 items-center justify-between gap-1 rounded-2lg border border-border-button-default bg-background-primary-default px-1 py-1 shadow-xs">
          <button type="button" aria-label="Previous" onClick={() => setMonthIndex((m) => (m + MONTHS.length - 1) % MONTHS.length)} className="flex size-4 shrink-0 cursor-pointer items-center justify-center rounded-[3px] text-text-secondary outline-none transition-colors duration-150 ease hover:bg-background-secondary-hover focus-visible:ring-2 focus-visible:ring-border-focus-ring">
            <RiArrowLeftSLine className="size-4 rtl:rotate-180" aria-hidden />
          </button>
          <span className="relative flex-1 overflow-hidden text-center text-body-medium whitespace-nowrap text-text-primary">{month}</span>
          <button type="button" aria-label="Next" onClick={() => setMonthIndex((m) => (m + 1) % MONTHS.length)} className="flex size-4 shrink-0 cursor-pointer items-center justify-center rounded-[3px] text-text-secondary outline-none transition-colors duration-150 ease hover:bg-background-secondary-hover focus-visible:ring-2 focus-visible:ring-border-focus-ring">
            <RiArrowRightSLine className="size-4 rtl:rotate-180" aria-hidden />
          </button>
        </div>
        <div className="flex w-full items-end gap-[7px] px-4 pt-8" style={{ height: 206 }}>
          {bars.map((height, i) => (
            <div key={`${month}-${i}`} className="flex h-full min-w-0 flex-1 items-end rounded-sm">
              {/* Original bars are plain divs: no title, no hover readout. */}
              <div
                className={cx("animate-bar-rise w-full rounded-sm transition-[height,background-color] duration-300 ease", height <= 4 ? "bg-chart-track" : "bg-chart-agents-bar hover:bg-chart-agents-bar-active")}
                style={{ height: `${height}px`, animationDelay: `${i * 22}ms` }}
              />
            </div>
          ))}
        </div>
        {/* Original footer: plain "Jun 14" / "Today" text — no calendar icon,
            no "30 days · hover a bar" copy, no Today button. */}
        <div className="flex w-full items-start justify-between px-1.5 text-[11px] leading-[15px] font-medium tracking-[0.2px] whitespace-nowrap text-text-tertiary">
          <p>Jun 14</p>
          <p>Today</p>
        </div>
      </section>

      {/* Tokens — trend chart */}
      <section className="flex w-full flex-col rounded-[20px] bg-background-secondary-default py-3">
        <div className="relative z-10 -mb-8 flex w-full px-4 pt-1">
          <div className="flex flex-col gap-0.5">
            <p className="text-body-medium whitespace-nowrap text-text-secondary">Tokens</p>
            <div className="flex items-center gap-2">
              <p className="text-title-2-medium whitespace-nowrap text-text-primary tabular-nums">667.7M tokens</p>
              <span className="inline-flex items-center justify-center rounded-md px-1.5 py-0.5 text-body-medium whitespace-nowrap bg-status-purple-background text-status-purple-text">+9.4%</span>
            </div>
          </div>
        </div>
        <div className="animate-chart-reveal w-full" style={{ height: 200 }}>
          <svg
            viewBox="0 0 600 200"
            preserveAspectRatio="none"
            className="h-full w-full"
            role="img"
            aria-label="Token trend from Jun 14 to Today, 667.7M tokens, up 9.4 percent"
          >
            <defs>
              <linearGradient id="tokens-fill" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="var(--color-chart-agents-bar)" stopOpacity="0.45" />
                <stop offset="100%" stopColor="var(--color-chart-agents-bar)" stopOpacity="0" />
              </linearGradient>
            </defs>
            <path d={tokenPath.area} fill="url(#tokens-fill)" />
            <path d={tokenPath.line} fill="none" stroke="var(--color-chart-agents-bar)" strokeWidth="2" vectorEffect="non-scaling-stroke" />
          </svg>
        </div>
        {/* Original footer: only "Jun 14" and "Today" — no middle readout. */}
        <div className="mt-2 flex w-full items-start justify-between px-4 text-[11px] leading-[15px] font-medium tracking-[0.2px] whitespace-nowrap text-text-tertiary">
          <p>Jun 14</p>
          <p>Today</p>
        </div>
      </section>
    </TemplateShell>
  );
}
