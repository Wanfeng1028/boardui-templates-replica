"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { motion, useReducedMotion } from "motion/react";
import {
  RiAddFill,
  RiAddLine,
  RiArrowRightSLine,
  RiCloseLine,
  RiEqualizerLine,
  RiFolderLine,
  RiInboxLine,
  RiKanbanView2,
  RiLayoutLeftLine,
  RiMoreFill,
  RiSendPlaneFill,
  RiSortDesc,
} from "@remixicon/react";

import { TemplateShell } from "@/components/application/template-shell/template-shell";
import { NotificationBell } from "@/components/application/app-shell/notification-bell";
import { Avatar } from "@/components/base/avatar/avatar";
import { Button } from "@/components/base/buttons/button";
import { IconButton } from "@/components/base/buttons/icon-button";
import { Select, SelectItem } from "@/components/base/select/select";
import { cx } from "@/utils/cx";

/**
 * Project Board template replica (Kanban), 1:1 functional rebuild.
 * Official: boardui.com/templates/project-board — "BoardUI Design Tasks",
 * columns Backlog / To do / In progress / Review / Done, ticket cards,
 * New ticket flow and a ticket detail side panel (editable properties,
 * comments, purple token-usage chart).
 *
 * Values below (column sizes, ticket ids/titles/dates, assignees, priority
 * colours) are taken from the official page's server-rendered HTML:
 * card `rounded-xl bg-background-primary-default p-3`, column
 * `auto-cols-[273px] rounded-2-5xl bg-background-secondary-default`,
 * Low=blue / Medium=yellow / High=orange / Urgent=rose.
 * Built only from free BoardUI components + mock data. Not the official
 * Pro source.
 */

type Priority = "Low" | "Medium" | "High" | "Urgent";
type AppName = "vibl" | "firstview" | "BoardUI";
type ColumnId = "backlog" | "todo" | "progress" | "review" | "done";

type Comment = { author: string; text: string; when: string };

type Ticket = {
  id: string;
  tag: string;
  priority: Priority;
  app: AppName;
  title: string;
  dateLabel: string;
  sortDate: string;
  done: boolean;
  assignees: string[];
  description: string;
  comments: Comment[];
  tokens: number[];
};

// Assignee photos: the official page serves these from randomuser.me; the
// five portraits are downloaded into public/avatars/randomuser/ (same
// person -> same file the original uses) so the board works offline too.
const PEOPLE: Record<string, { initials: string; color: "neutral" | "blue" | "lime" | "pink"; photo: string }> = {
  "Maya Chen": { initials: "MC", color: "blue", photo: "/avatars/randomuser/44.jpg" },
  "Priya Shah": { initials: "PS", color: "pink", photo: "/avatars/randomuser/65.jpg" },
  "Elif Kaya": { initials: "EK", color: "lime", photo: "/avatars/randomuser/68.jpg" },
  "Daniel Kim": { initials: "DK", color: "neutral", photo: "/avatars/randomuser/46.jpg" },
  "Noah Williams": { initials: "NW", color: "blue", photo: "/avatars/randomuser/32.jpg" },
};

const COLUMNS: { id: ColumnId; name: string; limit: number }[] = [
  { id: "backlog", name: "Backlog", limit: 8 },
  { id: "todo", name: "To do", limit: 5 },
  { id: "progress", name: "In progress", limit: 4 },
  { id: "review", name: "Review", limit: 3 },
  { id: "done", name: "Done", limit: 6 },
];

const PRIORITY_RANK: Record<Priority, number> = { Urgent: 0, High: 1, Medium: 2, Low: 3 };
const PRIORITY_PILL: Record<Priority, string> = {
  Low: "bg-status-blue-background text-status-blue-text",
  Medium: "bg-status-yellow-background text-status-yellow-text",
  High: "bg-status-orange-background text-status-orange-text",
  Urgent: "bg-status-rose-background text-status-rose-text",
};
const APP_PREFIX: Record<AppName, string> = { BoardUI: "DS", firstview: "FE", vibl: "BE" };

const INITIAL_BOARD: Record<ColumnId, Ticket[]> = {
  backlog: [
    { id: "DS-38", tag: "Agent handoff", priority: "Low", app: "vibl", title: "Explore approval cards for agent handoffs", dateLabel: "Since 14 Sep", sortDate: "2026-09-14", done: false, assignees: ["Maya Chen", "Priya Shah"], description: "Sketch how an agent asks for approval before a risky action, and what the card shows while it waits.", comments: [{ author: "Priya Shah", text: "Drafted two variants — inline card vs. modal. Inline keeps the thread readable.", when: "14 Sep" }], tokens: [12400, 18200, 9600, 22100, 17400, 20800, 15300] },
    { id: "FE-86", tag: "Project board", priority: "Low", app: "firstview", title: "Add saved views for each project team", dateLabel: "Since 13 Sep", sortDate: "2026-09-13", done: false, assignees: ["Elif Kaya"], description: "Let each team save its own board filters and column order as a named view.", comments: [], tokens: [8200, 11400, 7900, 13600, 10200, 9800, 12100] },
    { id: "BE-23", tag: "Activity API", priority: "Medium", app: "vibl", title: "Record an audit trail for agent actions", dateLabel: "Since 12 Sep", sortDate: "2026-09-12", done: false, assignees: ["Daniel Kim"], description: "Every agent action writes an audit entry with actor, action and timestamp.", comments: [{ author: "Daniel Kim", text: "Endpoint sketched — rolling limits come in the next ticket.", when: "12 Sep" }], tokens: [15600, 19800, 14200, 21400, 18900, 17300, 20100] },
  ],
  todo: [
    { id: "DS-34", tag: "Foundations", priority: "High", app: "BoardUI", title: "Define semantic tokens for elevated surfaces", dateLabel: "Since 12 Sep", sortDate: "2026-09-12", done: false, assignees: ["Maya Chen"], description: "Name the tokens for cards and panels that sit above the page background, in light and dark.", comments: [{ author: "Maya Chen", text: "Elevated surface needs its own border token or the cards disappear on dark.", when: "12 Sep" }], tokens: [21400, 24600, 19800, 27300, 23100, 25900, 22400] },
    { id: "FE-82", tag: "Composer", priority: "Low", app: "firstview", title: "Add keyboard navigation to model picker", dateLabel: "Since 11 Sep", sortDate: "2026-09-11", done: false, assignees: ["Noah Williams", "Elif Kaya"], description: "Arrow keys move through models, Enter selects, Escape closes the picker.", comments: [], tokens: [9400, 11200, 8600, 12900, 10400, 11800, 9700] },
    { id: "BE-19", tag: "Usage API", priority: "Low", app: "vibl", title: "Return rolling limits with reset timestamps", dateLabel: "Since 10 Sep", sortDate: "2026-09-10", done: false, assignees: ["Daniel Kim"], description: "Usage responses include the rolling window limit and the next reset time.", comments: [], tokens: [10800, 13400, 9900, 15200, 12700, 14100, 11600] },
  ],
  progress: [
    { id: "FE-79", tag: "Agent progress", priority: "Medium", app: "firstview", title: "Animate nested task groups as they stream", dateLabel: "Since 9 Sep", sortDate: "2026-09-09", done: false, assignees: ["Elif Kaya", "Noah Williams"], description: "Task groups expand and animate in as the agent streams them, without layout jumps.", comments: [{ author: "Elif Kaya", text: "Height animation is in — now smoothing the nested reveal.", when: "9 Sep" }], tokens: [18900, 22300, 17400, 24600, 20800, 23100, 19700] },
    { id: "DS-31", tag: "Dark mode", priority: "Urgent", app: "BoardUI", title: "Tune chart contrast on dark dashboard cards", dateLabel: "Since 8 Sep", sortDate: "2026-09-08", done: false, assignees: ["Maya Chen"], description: "Chart lines wash out on dark cards — raise contrast for every series.", comments: [], tokens: [25600, 28900, 23400, 31200, 27800, 29400, 26100] },
  ],
  review: [
    { id: "FE-76", tag: "Questionnaire", priority: "Low", app: "vibl", title: "Polish the transition between plan questions", dateLabel: "Since 7 Sep", sortDate: "2026-09-07", done: false, assignees: ["Priya Shah"], description: "Plan-mode questions should slide to the next step instead of snapping.", comments: [{ author: "Priya Shah", text: "Ready for review — the slide height now follows each question.", when: "7 Sep" }], tokens: [7600, 9800, 7100, 11300, 8900, 10200, 8400] },
  ],
  done: [
    { id: "DS-27", tag: "Avatars", priority: "Low", app: "BoardUI", title: "Ship overlapping avatar groups for cards", dateLabel: "Completed 6 Sep", sortDate: "2026-09-06", done: true, assignees: ["Maya Chen"], description: "Overlapping avatar stacks for ticket cards, with a hover count.", comments: [], tokens: [13200, 15400, 12100, 16800, 14500, 15900, 13800] },
    { id: "FE-71", tag: "Studio canvas", priority: "Medium", app: "firstview", title: "Keep generated screens aligned while zooming", dateLabel: "Completed 5 Sep", sortDate: "2026-09-05", done: true, assignees: ["Noah Williams", "Daniel Kim"], description: "Canvas zoom keeps generated screens aligned to the grid.", comments: [], tokens: [14700, 16900, 13800, 18200, 15600, 17100, 14900] },
    { id: "BE-16", tag: "Registry", priority: "Low", app: "BoardUI", title: "Validate template dependencies during build", dateLabel: "Completed 4 Sep", sortDate: "2026-09-04", done: true, assignees: ["Daniel Kim"], description: "Build fails early when a template references a missing dependency.", comments: [], tokens: [9100, 10800, 8400, 12400, 9900, 11300, 9600] },
    { id: "DS-25", tag: "Motion", priority: "Low", app: "BoardUI", title: "Document reduced-motion behavior for blocks", dateLabel: "Completed 3 Sep", sortDate: "2026-09-03", done: true, assignees: ["Priya Shah"], description: "Write down what each animated block does when reduced motion is on.", comments: [], tokens: [6800, 8200, 6400, 9600, 7900, 8800, 7300] },
  ],
};

const TOKEN_DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

function formatTokens(n: number) {
  return n >= 1000 ? `${(n / 1000).toFixed(1)}K` : `${n}`;
}

const inputClass =
  "w-full rounded-xl border border-border-button-default bg-background-primary-default px-2.5 py-2 text-body-medium text-text-primary outline-none focus-visible:ring-2 focus-visible:ring-border-focus-ring";
const labelClass = "text-caption-1-semibold text-text-tertiary uppercase tracking-[0.06em]";

function AvatarStack({ names }: { names: string[] }) {
  return (
    <div className="flex items-center ps-1" aria-label={names.join(", ")}>
      {names.map((name) => {
        const person = PEOPLE[name];
        return (
          <Avatar
            key={name}
            size="xs"
            color={person?.color ?? "neutral"}
            initials={person?.initials ?? name.slice(0, 2)}
            src={person?.photo}
            alt={name}
            className="size-[22px] ring-2 ring-background-primary-default [&:not(:first-child)]:-ms-1.5"
          />
        );
      })}
    </div>
  );
}

function TokenChart({ tokens }: { tokens: number[] }) {
  const max = Math.max(...tokens, 1);
  const total = tokens.reduce((sum, n) => sum + n, 0);
  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-baseline justify-between">
        <p className="text-body-medium text-text-primary">Token usage</p>
        <p className="text-body-2-medium text-text-secondary tabular-nums">
          {formatTokens(total)} · last 7 days
        </p>
      </div>
      <div className="flex h-24 items-end gap-1.5 rounded-xl bg-background-secondary-default p-3">
        {tokens.map((value, i) => (
          <div key={TOKEN_DAYS[i]} className="group flex h-full min-w-0 flex-1 flex-col items-center justify-end gap-1" title={`${TOKEN_DAYS[i]} · ${formatTokens(value)} tokens`}>
            <span className="text-[10px] leading-none text-text-tertiary tabular-nums opacity-0 transition-opacity group-hover:opacity-100">
              {formatTokens(value)}
            </span>
            <div
              className="w-full max-w-6 rounded-t-sm bg-chart-5 transition-colors group-hover:bg-chart-5-active"
              style={{ height: `${Math.max(8, Math.round((value / max) * 100))}%` }}
            />
            <span className="text-[10px] leading-none text-text-tertiary">{TOKEN_DAYS[i]}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function ProjectBoardTemplatePage() {
  const [board, setBoard] = useState<Record<ColumnId, Ticket[]>>(INITIAL_BOARD);
  const [selected, setSelected] = useState<{ column: ColumnId; id: string } | null>(null);
  const [newOpen, setNewOpen] = useState(false);
  const [newColumn, setNewColumn] = useState<ColumnId>("backlog");
  const [draggedId, setDraggedId] = useState<string | null>(null);
  const [dropColumn, setDropColumn] = useState<ColumnId | null>(null);
  const [sortFor, setSortFor] = useState<ColumnId | null>(null);
  const [commentDraft, setCommentDraft] = useState("");
  const [createdCount, setCreatedCount] = useState(0);
  const [toolbarMenu, setToolbarMenu] = useState<"inbox" | "sort" | "filter" | "display" | null>(null);
  const [priorityFilter, setPriorityFilter] = useState<Set<Priority>>(new Set());
  const [displayOpts, setDisplayOpts] = useState({ assignees: true, dates: true, apps: true });
  // Keyboard drag (dnd-kit style): Space lifts the focused card, Left/Right
  // move it between columns, Space/Enter drops, Escape cancels.
  const [grabbed, setGrabbed] = useState<{ id: string; column: ColumnId } | null>(null);
  const [announcement, setAnnouncement] = useState("");
  const reduceMotion = useReducedMotion();
  const columnRefs = useRef<Record<string, HTMLElement | null>>({});
  const grabSnapshot = useRef<Record<ColumnId, Ticket[]> | null>(null);
  const dragRef = useRef<{ id: string; from: ColumnId; startX: number; startY: number; active: boolean } | null>(null);
  const lastDragEndRef = useRef(0);

  const [form, setForm] = useState({ title: "", app: "vibl" as AppName, priority: "Medium" as Priority, assignees: [] as string[] });

  // Esc closes the detail / new-ticket panels (the Dashboard modals do this;
  // the board panels previously had no Esc handling).
  useEffect(() => {
    if (!selected && !newOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setSelected(null);
        setNewOpen(false);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [selected, newOpen]);

  const selectedTicket = useMemo(() => {
    if (!selected) return null;
    return board[selected.column].find((t) => t.id === selected.id) ?? null;
  }, [board, selected]);

  function updateTicket(column: ColumnId, id: string, patch: Partial<Ticket>) {
    setBoard((prev) => ({
      ...prev,
      [column]: prev[column].map((t) => (t.id === id ? { ...t, ...patch } : t)),
    }));
  }

  function moveTicket(id: string, from: ColumnId, to: ColumnId) {
    if (from === to) return;
    setBoard((prev) => {
      const ticket = prev[from].find((t) => t.id === id);
      if (!ticket) return prev;
      const done = to === "done";
      const moved: Ticket = { ...ticket, done, dateLabel: done ? "Completed 6 Nov" : ticket.dateLabel };
      return { ...prev, [from]: prev[from].filter((t) => t.id !== id), [to]: [...prev[to], moved] };
    });
    setSelected((cur) => (cur && cur.id === id ? { column: to, id } : cur));
  }

  function deleteTicket(column: ColumnId, id: string) {
    setBoard((prev) => ({ ...prev, [column]: prev[column].filter((t) => t.id !== id) }));
    setSelected(null);
  }

  function sortColumn(column: ColumnId, mode: "priority" | "newest" | "title") {
    setBoard((prev) => {
      const sorted = [...prev[column]].sort((a, b) =>
        mode === "priority"
          ? PRIORITY_RANK[a.priority] - PRIORITY_RANK[b.priority]
          : mode === "newest"
            ? b.sortDate.localeCompare(a.sortDate)
            : a.title.localeCompare(b.title),
      );
      return { ...prev, [column]: sorted };
    });
    setSortFor(null);
  }

  function sortBoard(mode: "priority" | "newest" | "title") {
    (Object.keys(board) as ColumnId[]).forEach((c) => sortColumn(c, mode));
    setToolbarMenu(null);
    setAnnouncement(`Board sorted by ${mode === "priority" ? "priority" : mode === "newest" ? "newest" : "title A to Z"}.`);
  }

  function columnName(id: ColumnId) {
    return COLUMNS.find((c) => c.id === id)?.name ?? id;
  }

  function visibleTickets(list: Ticket[]) {
    return priorityFilter.size === 0 ? list : list.filter((t) => priorityFilter.has(t.priority));
  }

  /* Pointer drag (no `draggable` attribute, like the original's dnd-kit
     cards): press and move >6px to lift, the column under the pointer
     highlights, release drops the card at the end of that column. A plain
     click (no movement) still opens the detail panel. */
  function onCardPointerDown(event: React.PointerEvent, ticket: Ticket, column: ColumnId) {
    if (event.button !== 0 || grabbed) return;
    const startX = event.clientX;
    const startY = event.clientY;
    dragRef.current = { id: ticket.id, from: column, startX, startY, active: false };
    const onMove = (ev: PointerEvent) => {
      const d = dragRef.current;
      if (!d) return;
      if (!d.active) {
        if (Math.hypot(ev.clientX - startX, ev.clientY - startY) < 6) return;
        d.active = true;
        setDraggedId(ticket.id);
        setAnnouncement(`Picked up ${ticket.id}. Drag to a column to move it.`);
      }
      const el = document.elementFromPoint(ev.clientX, ev.clientY)?.closest?.("[data-column-id]") as HTMLElement | null;
      setDropColumn((el?.dataset.columnId as ColumnId | undefined) ?? null);
    };
    const onUp = (ev: PointerEvent) => {
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerup", onUp);
      const d = dragRef.current;
      dragRef.current = null;
      setDraggedId(null);
      setDropColumn(null);
      if (!d?.active) return;
      lastDragEndRef.current = Date.now();
      const el = document.elementFromPoint(ev.clientX, ev.clientY)?.closest?.("[data-column-id]") as HTMLElement | null;
      const over = el?.dataset.columnId as ColumnId | undefined;
      if (over && over !== d.from) {
        moveTicket(d.id, d.from, over);
        setAnnouncement(`Moved ${d.id} to ${columnName(over)}.`);
      } else {
        setAnnouncement(`Moved ${d.id} back to ${columnName(d.from)}.`);
      }
    };
    window.addEventListener("pointermove", onMove);
    window.addEventListener("pointerup", onUp);
  }

  /* Keyboard drag: Space lifts / drops the focused card, ArrowLeft /
     ArrowRight move it live between columns, Escape cancels (restores the
     board snapshot taken on lift). Enter still opens the detail panel. */
  function onCardKeyDown(event: React.KeyboardEvent, ticket: Ticket, column: ColumnId) {
    if (grabbed && grabbed.id === ticket.id) {
      if (event.key === "ArrowLeft" || event.key === "ArrowRight") {
        event.preventDefault();
        const idx = COLUMNS.findIndex((c) => c.id === grabbed.column);
        const next = COLUMNS[idx + (event.key === "ArrowRight" ? 1 : -1)];
        if (!next) {
          setAnnouncement(`Already at the ${event.key === "ArrowRight" ? "last" : "first"} column.`);
          return;
        }
        moveTicket(ticket.id, grabbed.column, next.id);
        setGrabbed({ id: ticket.id, column: next.id });
        setAnnouncement(`Moved ${ticket.id} to ${next.name}.`);
      } else if (event.key === " " || event.key === "Enter") {
        event.preventDefault();
        setGrabbed(null);
        grabSnapshot.current = null;
        setAnnouncement(`Dropped ${ticket.id} in ${columnName(grabbed.column)}.`);
      } else if (event.key === "Escape") {
        event.preventDefault();
        if (grabSnapshot.current) setBoard(grabSnapshot.current);
        grabSnapshot.current = null;
        setGrabbed(null);
        setAnnouncement(`Move cancelled. ${ticket.id} is back in ${columnName(column)}.`);
      }
      return;
    }
    if (event.key === " ") {
      event.preventDefault();
      grabSnapshot.current = board;
      setGrabbed({ id: ticket.id, column });
      setAnnouncement(`Picked up ${ticket.id}. Use Left and Right arrow keys to move, Space to drop, Escape to cancel.`);
    } else if (event.key === "Enter") {
      event.preventDefault();
      setSelected({ column, id: ticket.id });
    }
  }

  function createTicket() {
    const title = form.title.trim();
    if (!title) return;
    const id = `${APP_PREFIX[form.app]}-${100 + createdCount}`;
    const ticket: Ticket = {
      id,
      tag: form.app === "BoardUI" ? "Foundations" : form.app === "firstview" ? "Project board" : "Agent handoff",
      priority: form.priority,
      app: form.app,
      title,
      dateLabel: "Since 6 Nov",
      sortDate: "2026-11-06",
      done: newColumn === "done",
      assignees: form.assignees.length > 0 ? form.assignees : ["Maya Chen"],
      description: "",
      comments: [],
      tokens: [4200, 6800, 5100, 7900, 6400, 5800, 7100],
    };
    setBoard((prev) => ({ ...prev, [newColumn]: [ticket, ...prev[newColumn]] }));
    setCreatedCount((n) => n + 1);
    setForm({ title: "", app: "vibl", priority: "Medium", assignees: [] });
    setNewOpen(false);
    setSelected({ column: newColumn, id });
  }

  function openNew(column: ColumnId) {
    setNewColumn(column);
    setSelected(null);
    setNewOpen(true);
  }

  function toggleFormAssignee(name: string) {
    setForm((prev) => ({
      ...prev,
      assignees: prev.assignees.includes(name)
        ? prev.assignees.filter((n) => n !== name)
        : [...prev.assignees, name],
    }));
  }

  function postComment() {
    if (!selected || !selectedTicket || !commentDraft.trim()) return;
    updateTicket(selected.column, selectedTicket.id, {
      comments: [...selectedTicket.comments, { author: "Mertcan Esmergul", text: commentDraft.trim(), when: "6 Nov" }],
    });
    setCommentDraft("");
  }

  return (
    <TemplateShell
      title="Project board"
      heading="BoardUI Design Tasks"
      icon={RiKanbanView2}
      selected="project-board"
      actions={
        <>
          <NotificationBell />
          <div className="relative">
            <IconButton
              icon={RiInboxLine}
              size="medium"
              aria-label="Open project inbox"
              aria-expanded={toolbarMenu === "inbox"}
              aria-haspopup="menu"
              onClick={() => setToolbarMenu((cur) => (cur === "inbox" ? null : "inbox"))}
            />
            {toolbarMenu === "inbox" && (
              <div className="absolute right-0 z-30 mt-1 w-56 rounded-xl border border-border-button-default bg-background-primary-default p-1 shadow-lg">
                <p className="px-2.5 pt-1.5 pb-1 text-caption-1-semibold text-text-tertiary uppercase">Project inbox</p>
                {COLUMNS.map((c) => (
                  <button
                    key={c.id}
                    type="button"
                    onClick={() => {
                      columnRefs.current[c.id]?.scrollIntoView({ behavior: "smooth", inline: "center", block: "nearest" });
                      setToolbarMenu(null);
                    }}
                    className="flex w-full cursor-pointer items-center justify-between rounded-lg px-2.5 py-2 text-start text-body-medium text-text-primary hover:bg-background-secondary-hover"
                  >
                    {c.name}
                    <span className="text-text-tertiary tabular-nums">{board[c.id].length}</span>
                  </button>
                ))}
              </div>
            )}
          </div>
          <div className="relative">
            <IconButton
              icon={RiSortDesc}
              size="medium"
              aria-label="Sort tickets"
              aria-expanded={toolbarMenu === "sort"}
              aria-haspopup="menu"
              onClick={() => setToolbarMenu((cur) => (cur === "sort" ? null : "sort"))}
            />
            {toolbarMenu === "sort" && (
              <div className="absolute right-0 z-30 mt-1 w-48 rounded-xl border border-border-button-default bg-background-primary-default p-1 shadow-lg">
                {(
                  [
                    ["priority", "Sort by priority"],
                    ["newest", "Sort by newest"],
                    ["title", "Sort by title A–Z"],
                  ] as const
                ).map(([mode, label]) => (
                  <button
                    key={mode}
                    type="button"
                    onClick={() => sortBoard(mode)}
                    className="w-full cursor-pointer rounded-lg px-2.5 py-2 text-start text-body-medium text-text-primary hover:bg-background-secondary-hover"
                  >
                    {label}
                  </button>
                ))}
              </div>
            )}
          </div>
          <div className="relative">
            <IconButton
              icon={RiEqualizerLine}
              size="medium"
              aria-label="Filter tickets"
              aria-expanded={toolbarMenu === "filter"}
              aria-haspopup="menu"
              onClick={() => setToolbarMenu((cur) => (cur === "filter" ? null : "filter"))}
            />
            {toolbarMenu === "filter" && (
              <div className="absolute right-0 z-30 mt-1 w-52 rounded-xl border border-border-button-default bg-background-primary-default p-1 shadow-lg">
                <p className="px-2.5 pt-1.5 pb-1 text-caption-1-semibold text-text-tertiary uppercase">Filter by priority</p>
                {(["Urgent", "High", "Medium", "Low"] as Priority[]).map((p) => {
                  const active = priorityFilter.has(p);
                  const count = Object.values(board).flat().filter((t) => t.priority === p).length;
                  return (
                    <button
                      key={p}
                      type="button"
                      aria-pressed={active}
                      onClick={() =>
                        setPriorityFilter((prev) => {
                          const next = new Set(prev);
                          if (next.has(p)) next.delete(p);
                          else next.add(p);
                          return next;
                        })
                      }
                      className="flex w-full cursor-pointer items-center justify-between rounded-lg px-2.5 py-2 text-start text-body-medium text-text-primary hover:bg-background-secondary-hover"
                    >
                      <span>{active ? "✓ " : ""}{p}</span>
                      <span className="text-text-tertiary tabular-nums">{count}</span>
                    </button>
                  );
                })}
                <button
                  type="button"
                  disabled={priorityFilter.size === 0}
                  onClick={() => {
                    setPriorityFilter(new Set());
                    setToolbarMenu(null);
                  }}
                  className="w-full cursor-pointer rounded-lg px-2.5 py-2 text-start text-body-medium text-text-primary hover:bg-background-secondary-hover disabled:cursor-not-allowed disabled:opacity-50"
                >
                  Clear filters
                </button>
              </div>
            )}
          </div>
          <div className="relative">
            <IconButton
              icon={RiLayoutLeftLine}
              size="medium"
              aria-label="Display options"
              aria-expanded={toolbarMenu === "display"}
              aria-haspopup="menu"
              onClick={() => setToolbarMenu((cur) => (cur === "display" ? null : "display"))}
            />
            {toolbarMenu === "display" && (
              <div className="absolute right-0 z-30 mt-1 w-52 rounded-xl border border-border-button-default bg-background-primary-default p-1 shadow-lg">
                <p className="px-2.5 pt-1.5 pb-1 text-caption-1-semibold text-text-tertiary uppercase">Display options</p>
                {(
                  [
                    ["assignees", "Show assignees"],
                    ["dates", "Show dates"],
                    ["apps", "Show app chips"],
                  ] as const
                ).map(([key, label]) => (
                  <button
                    key={key}
                    type="button"
                    aria-pressed={displayOpts[key]}
                    onClick={() => setDisplayOpts((prev) => ({ ...prev, [key]: !prev[key] }))}
                    className="w-full cursor-pointer rounded-lg px-2.5 py-2 text-start text-body-medium text-text-primary hover:bg-background-secondary-hover"
                  >
                    {displayOpts[key] ? "✓ " : ""}{label}
                  </button>
                ))}
                <button
                  type="button"
                  onClick={() => setToolbarMenu(null)}
                  className="w-full cursor-pointer rounded-lg px-2.5 py-2 text-start text-body-medium text-text-primary hover:bg-background-secondary-hover"
                >
                  Done
                </button>
              </div>
            )}
          </div>
          <Button variant="primary" size="medium" leadingIcon={RiAddFill} onClick={() => openNew("backlog")}>
            New ticket
          </Button>
        </>
      }
    >
      <div id="board-live-region" aria-live="polite" className="sr-only">
        {announcement}
      </div>

      {/* Board: horizontal-scroll strip, 273px columns, exact original geometry */}
      <div
        className="-mx-3 min-h-0 flex-1 overflow-x-auto overflow-y-hidden overscroll-x-contain [scrollbar-width:thin] sm:-mx-6 lg:-me-7"
        role="region"
        aria-label="Project board columns"
        tabIndex={0}
      >
        <div className="grid h-full w-max grid-flow-col auto-cols-[273px] gap-2 px-3 sm:px-6 lg:pe-7 max-lg:h-auto">
          {COLUMNS.map((column) => {
            const tickets = board[column.id];
            const visible = visibleTickets(tickets);
            const isDropTarget = dropColumn === column.id;
            return (
              <section
                key={column.id}
                ref={(el) => {
                  columnRefs.current[column.id] = el;
                }}
                data-column-id={column.id}
                role="region"
                aria-label={`${column.name} tickets`}
                tabIndex={0}
                className={cx(
                  "relative flex h-full min-h-0 flex-col overflow-hidden rounded-2-5xl bg-background-secondary-default pt-3 ring-2 ring-inset transition-[box-shadow,background-color] duration-150 ease-out",
                  isDropTarget ? "bg-background-secondary-hover ring-accent-500" : "ring-transparent",
                )}
              >
                <div className="flex h-5 shrink-0 items-center justify-between px-3">
                  <div className="flex min-w-0 items-center gap-1.5">
                    <h2 className="truncate text-body-medium text-text-primary">{column.name}</h2>
                    <span className="text-body-medium text-text-secondary tabular-nums">
                      {tickets.length}/{column.limit}
                    </span>
                  </div>
                  <div className="flex items-center gap-1 text-foreground-icon-secondary">
                    <div className="relative">
                      <button
                        type="button"
                        aria-label={`More options for ${column.name}`}
                        onClick={() => setSortFor((cur) => (cur === column.id ? null : column.id))}
                        className="flex size-5 cursor-pointer items-center justify-center rounded-md text-foreground-icon-secondary transition-colors hover:bg-background-tertiary-default focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-border-focus-ring"
                      >
                        <RiMoreFill className="size-4" aria-hidden />
                      </button>
                      {sortFor === column.id && (
                        <div className="absolute right-0 z-30 mt-1 w-44 rounded-xl border border-border-button-default bg-background-primary-default p-1 shadow-lg">
                          {(
                            [
                              ["priority", "Sort by priority"],
                              ["newest", "Sort by newest"],
                              ["title", "Sort by title A–Z"],
                            ] as const
                          ).map(([mode, label]) => (
                            <button
                              key={mode}
                              type="button"
                              onClick={() => sortColumn(column.id, mode)}
                              className="w-full cursor-pointer rounded-lg px-2.5 py-2 text-start text-body-medium text-text-primary hover:bg-background-secondary-hover"
                            >
                              {label}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                    <button
                      type="button"
                      aria-label={`Add ticket to ${column.name}`}
                      onClick={() => openNew(column.id)}
                      className="flex size-5 cursor-pointer items-center justify-center rounded-md text-foreground-icon-secondary transition-colors duration-150 hover:bg-background-tertiary-default focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-border-focus-ring"
                    >
                      <RiAddLine className="size-5" aria-hidden />
                    </button>
                  </div>
                </div>

                <div className="flex min-h-0 flex-1 flex-col gap-1.5 overflow-y-auto px-2 py-2 max-lg:overflow-visible">
                  {visible.length === 0 && (
                    <p className="rounded-xl border border-dashed border-border-button-default px-3 py-6 text-center text-body-2-regular text-text-tertiary">
                      {tickets.length === 0
                        ? "No tickets — drop one here or add a new ticket."
                        : "No tickets match the current filter."}
                    </p>
                  )}
                  {visible.map((ticket) => (
                    <div key={ticket.id} className="group relative shrink-0 pb-1.5">
                      <motion.article
                        role="button"
                        tabIndex={0}
                        aria-roledescription="sortable"
                        aria-haspopup="dialog"
                        aria-describedby="board-live-region"
                        aria-label={`Open ${ticket.id}: ${ticket.title}`}
                        initial={reduceMotion ? false : { opacity: 0, filter: "blur(4px)" }}
                        animate={{ opacity: 1, filter: "blur(0px)" }}
                        transition={{ duration: 0.2, ease: "easeOut" }}
                        onPointerDown={(event) => onCardPointerDown(event, ticket, column.id)}
                        onClick={() => {
                          if (Date.now() - lastDragEndRef.current < 300) return;
                          setSelected({ column: column.id, id: ticket.id });
                        }}
                        onKeyDown={(event) => onCardKeyDown(event, ticket, column.id)}
                        className={cx(
                          "relative flex w-full cursor-grab touch-manipulation flex-col gap-2 rounded-xl bg-background-primary-default p-3 text-start shadow-[0_1px_1px_rgb(0_0_0/0.05)] ring-[2.5px] ring-transparent transition-[box-shadow,opacity] duration-200 ease-out motion-reduce:transition-none hover:shadow-sm hover:ring-border-button-hover active:cursor-grabbing dark:bg-background-primary-default/60",
                          draggedId === ticket.id && "opacity-40",
                          grabbed?.id === ticket.id && "ring-accent-500",
                        )}
                      >
                        <div className="flex min-h-[22px] items-start justify-between gap-3">
                          <div className="flex min-w-0 items-center text-body-2-medium text-text-secondary">
                            <span className="shrink-0 tabular-nums">{ticket.id}</span>
                            <RiArrowRightSLine className="size-[15px] shrink-0 text-foreground-icon-tertiary" aria-hidden />
                            <span className="truncate">{ticket.tag}</span>
                          </div>
                          {displayOpts.assignees && (
                            <div className="flex shrink-0 items-center gap-1">
                              <AvatarStack names={ticket.assignees} />
                            </div>
                          )}
                        </div>
                        <div className="flex flex-col items-start gap-2">
                          <div className="flex flex-wrap items-center gap-1.5">
                            <span className={cx("inline-flex items-center justify-center rounded-md px-1.5 py-0.5 text-body-2-medium", PRIORITY_PILL[ticket.priority])}>
                              {ticket.priority}
                            </span>
                            {displayOpts.apps && (
                              <span className="inline-flex items-center gap-1 rounded-md bg-background-primary-default px-1.5 py-0.5 text-body-2-medium text-text-primary ring-1 ring-inset ring-border-button-default">
                                <RiFolderLine className="size-[13px] shrink-0 opacity-30" aria-hidden />
                                <span className="text-text-secondary">{ticket.app}</span>
                              </span>
                            )}
                          </div>
                          <div className="flex w-full flex-col gap-[5px]">
                            <h3 className="text-body-medium text-text-primary">{ticket.title}</h3>
                            {displayOpts.dates && <p className="text-body-2-medium text-text-secondary">{ticket.dateLabel}</p>}
                          </div>
                        </div>
                      </motion.article>
                    </div>
                  ))}
                </div>
              </section>
            );
          })}
        </div>
      </div>

      {/* Ticket detail side panel */}
      {selectedTicket && selected && (
        <div className="fixed inset-0 z-50 flex justify-end" role="dialog" aria-modal="true" aria-label={`Ticket ${selectedTicket.id}`}>
          <button type="button" aria-label="Close ticket details" onClick={() => setSelected(null)} className="absolute inset-0 cursor-pointer bg-black/40" />
          <div className="relative flex h-full w-[440px] max-w-[94vw] flex-col gap-4 overflow-y-auto bg-background-primary-default p-4 shadow-xl sm:p-5">
            <div className="flex items-start justify-between gap-3">
              <div className="flex min-w-0 flex-col gap-1">
                <span className="text-body-2-medium text-text-tertiary tabular-nums">
                  {selectedTicket.id} · {selectedTicket.tag}
                </span>
                <textarea
                  value={selectedTicket.title}
                  aria-label="Ticket title"
                  rows={2}
                  onChange={(event) => updateTicket(selected.column, selectedTicket.id, { title: event.target.value })}
                  className="w-full resize-none rounded-lg bg-transparent px-1 py-0.5 text-title-3-semibold leading-snug text-text-primary outline-none focus-visible:ring-2 focus-visible:ring-border-focus-ring"
                />
              </div>
              <IconButton icon={RiCloseLine} size="medium" aria-label="Close" onClick={() => setSelected(null)} />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <label className="flex flex-col gap-1.5">
                <span className={labelClass}>Status</span>
                <Select
                  aria-label="Status"
                  selectedKey={selected.column}
                  onSelectionChange={(k) => moveTicket(selectedTicket.id, selected.column, String(k) as ColumnId)}
                  className="w-full"
                >
                  {COLUMNS.map((c) => (
                    <SelectItem key={c.id} id={c.id} textValue={c.name}>{c.name}</SelectItem>
                  ))}
                </Select>
              </label>
              <label className="flex flex-col gap-1.5">
                <span className={labelClass}>Priority</span>
                <Select
                  aria-label="Priority"
                  selectedKey={selectedTicket.priority}
                  onSelectionChange={(k) => updateTicket(selected.column, selectedTicket.id, { priority: String(k) as Priority })}
                  className="w-full"
                >
                  {(["Low", "Medium", "High", "Urgent"] as Priority[]).map((p) => (
                    <SelectItem key={p} id={p} textValue={p}>{p}</SelectItem>
                  ))}
                </Select>
              </label>
              <label className="flex flex-col gap-1.5">
                <span className={labelClass}>Project</span>
                <Select
                  aria-label="Project"
                  selectedKey={selectedTicket.app}
                  onSelectionChange={(k) => updateTicket(selected.column, selectedTicket.id, { app: String(k) as AppName })}
                  className="w-full"
                >
                  {(["vibl", "firstview", "BoardUI"] as AppName[]).map((a) => (
                    <SelectItem key={a} id={a} textValue={a}>{a}</SelectItem>
                  ))}
                </Select>
              </label>
              <div className="flex flex-col gap-1.5">
                <span className={labelClass}>Opened</span>
                <p className="rounded-xl bg-background-secondary-default px-2.5 py-2 text-body-medium text-text-primary">{selectedTicket.dateLabel}</p>
              </div>
            </div>

            <div className="flex flex-col gap-1.5">
              <span className={labelClass}>Assignees</span>
              <div className="flex flex-wrap gap-1.5">
                {Object.keys(PEOPLE).map((name) => {
                  const active = selectedTicket.assignees.includes(name);
                  return (
                    <button
                      key={name}
                      type="button"
                      aria-pressed={active}
                      onClick={() =>
                        updateTicket(selected.column, selectedTicket.id, {
                          assignees: active
                            ? selectedTicket.assignees.filter((n) => n !== name)
                            : [...selectedTicket.assignees, name],
                        })
                      }
                      className={cx(
                        "flex cursor-pointer items-center gap-1.5 rounded-full py-1 pe-2.5 ps-1 text-body-2-medium ring-1 ring-inset transition-colors",
                        active
                          ? "bg-accent-500 text-white ring-accent-500"
                          : "bg-background-secondary-default text-text-secondary ring-border-button-default hover:bg-background-secondary-hover",
                      )}
                    >
                      <Avatar size="xs" color={PEOPLE[name].color} initials={PEOPLE[name].initials} src={PEOPLE[name].photo} alt="" className="size-5" />
                      {name}
                    </button>
                  );
                })}
              </div>
            </div>

            <label className="flex flex-col gap-1.5">
              <span className={labelClass}>Description</span>
              <textarea
                value={selectedTicket.description}
                aria-label="Description"
                rows={4}
                placeholder="Add a description…"
                onChange={(event) => updateTicket(selected.column, selectedTicket.id, { description: event.target.value })}
                className={cx(inputClass, "resize-y")}
              />
            </label>

            <TokenChart tokens={selectedTicket.tokens} />

            <div className="flex flex-col gap-2">
              <p className="text-body-medium text-text-primary">
                Comments <span className="text-text-tertiary tabular-nums">({selectedTicket.comments.length})</span>
              </p>
              {selectedTicket.comments.length === 0 && (
                <p className="text-body-2-regular text-text-tertiary">No comments yet — start the discussion.</p>
              )}
              {selectedTicket.comments.map((comment, i) => (
                <div key={`${comment.author}-${i}`} className="flex gap-2.5 rounded-xl bg-background-secondary-default p-3">
                  <Avatar size="xs" color={comment.author === "Mertcan Esmergul" ? "neutral" : (PEOPLE[comment.author]?.color ?? "neutral")} initials={comment.author.split(" ").map((w) => w[0]).join("")} src={PEOPLE[comment.author]?.photo} alt={comment.author} />
                  <div className="flex min-w-0 flex-col gap-0.5">
                    <p className="text-body-2-medium text-text-primary">
                      {comment.author} <span className="font-normal text-text-tertiary">· {comment.when}</span>
                    </p>
                    <p className="text-body-2-regular text-text-secondary">{comment.text}</p>
                  </div>
                </div>
              ))}
              <div className="flex items-center gap-2">
                <input
                  value={commentDraft}
                  aria-label="Write a comment"
                  placeholder="Write a comment…"
                  onChange={(event) => setCommentDraft(event.target.value)}
                  onKeyDown={(event) => {
                    if (event.key === "Enter") postComment();
                  }}
                  className={inputClass}
                />
                <Button variant="primary" size="medium" leadingIcon={RiSendPlaneFill} onClick={postComment} disabled={!commentDraft.trim()}>
                  Post
                </Button>
              </div>
            </div>

            <div className="mt-auto flex justify-between border-t border-separator-border pt-3">
              <Button variant="secondary" size="medium" onClick={() => deleteTicket(selected.column, selectedTicket.id)}>
                Delete ticket
              </Button>
              <Button variant="primary" size="medium" onClick={() => setSelected(null)}>
                Done
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* New ticket side panel */}
      {newOpen && (
        <div className="fixed inset-0 z-50 flex justify-end" role="dialog" aria-modal="true" aria-label="New ticket">
          <button type="button" aria-label="Close new ticket" onClick={() => setNewOpen(false)} className="absolute inset-0 cursor-pointer bg-black/40" />
          <div className="relative flex h-full w-[440px] max-w-[94vw] flex-col gap-4 overflow-y-auto bg-background-primary-default p-4 shadow-xl sm:p-5">
            <div className="flex items-start justify-between gap-3">
              <div>
                <h2 className="text-title-3-semibold text-text-primary">New ticket</h2>
                <p className="text-body-2-regular text-text-secondary">
                  Adding to {COLUMNS.find((c) => c.id === newColumn)?.name}
                </p>
              </div>
              <IconButton icon={RiCloseLine} size="medium" aria-label="Close" onClick={() => setNewOpen(false)} />
            </div>

            <label className="flex flex-col gap-1.5">
              <span className={labelClass}>Title</span>
              <input
                value={form.title}
                autoFocus
                aria-label="Ticket title"
                placeholder="What needs doing?"
                onChange={(event) => setForm((prev) => ({ ...prev, title: event.target.value }))}
                onKeyDown={(event) => {
                  if (event.key === "Enter") createTicket();
                }}
                className={inputClass}
              />
            </label>

            <div className="grid grid-cols-2 gap-3">
              <label className="flex flex-col gap-1.5">
                <span className={labelClass}>Project</span>
                <Select aria-label="Project" selectedKey={form.app} onSelectionChange={(k) => setForm((prev) => ({ ...prev, app: String(k) as AppName }))} className="w-full">
                  {(["vibl", "firstview", "BoardUI"] as AppName[]).map((a) => (
                    <SelectItem key={a} id={a} textValue={a}>{a}</SelectItem>
                  ))}
                </Select>
              </label>
              <label className="flex flex-col gap-1.5">
                <span className={labelClass}>Priority</span>
                <Select aria-label="Priority" selectedKey={form.priority} onSelectionChange={(k) => setForm((prev) => ({ ...prev, priority: String(k) as Priority }))} className="w-full">
                  {(["Low", "Medium", "High", "Urgent"] as Priority[]).map((p) => (
                    <SelectItem key={p} id={p} textValue={p}>{p}</SelectItem>
                  ))}
                </Select>
              </label>
            </div>

            <label className="flex flex-col gap-1.5">
              <span className={labelClass}>Column</span>
              <Select aria-label="Column" selectedKey={newColumn} onSelectionChange={(k) => setNewColumn(String(k) as ColumnId)} className="w-full">
                {COLUMNS.map((c) => (
                  <SelectItem key={c.id} id={c.id} textValue={c.name}>{c.name}</SelectItem>
                ))}
              </Select>
            </label>

            <div className="flex flex-col gap-1.5">
              <span className={labelClass}>Assignees</span>
              <div className="flex flex-wrap gap-1.5">
                {Object.keys(PEOPLE).map((name) => {
                  const active = form.assignees.includes(name);
                  return (
                    <button
                      key={name}
                      type="button"
                      aria-pressed={active}
                      onClick={() => toggleFormAssignee(name)}
                      className={cx(
                        "flex cursor-pointer items-center gap-1.5 rounded-full py-1 pe-2.5 ps-1 text-body-2-medium ring-1 ring-inset transition-colors",
                        active
                          ? "bg-accent-500 text-white ring-accent-500"
                          : "bg-background-secondary-default text-text-secondary ring-border-button-default hover:bg-background-secondary-hover",
                      )}
                    >
                      <Avatar size="xs" color={PEOPLE[name].color} initials={PEOPLE[name].initials} src={PEOPLE[name].photo} alt="" className="size-5" />
                      {name}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="mt-auto flex justify-end gap-2 border-t border-separator-border pt-3">
              <Button variant="secondary" size="medium" onClick={() => setNewOpen(false)}>
                Cancel
              </Button>
              <Button variant="primary" size="medium" leadingIcon={RiAddFill} onClick={createTicket} disabled={!form.title.trim()}>
                Create ticket
              </Button>
            </div>
          </div>
        </div>
      )}
    </TemplateShell>
  );
}
