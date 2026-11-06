"use client";

import { useMemo, useState } from "react";
import {
  RiAddFill,
  RiArrowRightSLine,
  RiCloseLine,
  RiKanbanView2,
  RiMoreFill,
  RiSendPlaneFill,
} from "@remixicon/react";

import { TemplateShell } from "@/components/application/template-shell/template-shell";
import { NotificationBell } from "@/components/application/app-shell/notification-bell";
import { Avatar } from "@/components/base/avatar/avatar";
import { Button } from "@/components/base/buttons/button";
import { IconButton } from "@/components/base/buttons/icon-button";
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

// Initials avatars (not the official page's randomuser.me photos): the photo
// host is unreachable from this sandbox's egress proxy and renders broken
// images, so the replica uses tinted initials instead.
const PEOPLE: Record<string, { initials: string; color: "neutral" | "blue" | "lime" | "pink" }> = {
  "Maya Chen": { initials: "MC", color: "blue" },
  "Priya Shah": { initials: "PS", color: "pink" },
  "Elif Kaya": { initials: "EK", color: "lime" },
  "Daniel Kim": { initials: "DK", color: "neutral" },
  "Noah Williams": { initials: "NW", color: "blue" },
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
const APP_DOT: Record<AppName, string> = {
  vibl: "bg-chart-5-active",
  firstview: "bg-chart-4-active",
  BoardUI: "bg-chart-neutral",
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
    <div className="flex items-center" aria-label={names.join(", ")}>
      {names.map((name) => {
        const person = PEOPLE[name];
        return (
          <Avatar
            key={name}
            size="xs"
            color={person?.color ?? "neutral"}
            initials={person?.initials ?? name.slice(0, 2)}
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
  const [menuFor, setMenuFor] = useState<string | null>(null);
  const [sortFor, setSortFor] = useState<ColumnId | null>(null);
  const [commentDraft, setCommentDraft] = useState("");
  const [createdCount, setCreatedCount] = useState(0);

  const [form, setForm] = useState({ title: "", app: "vibl" as AppName, priority: "Medium" as Priority, assignees: [] as string[] });

  const selectedTicket = useMemo(() => {
    if (!selected) return null;
    return board[selected.column].find((t) => t.id === selected.id) ?? null;
  }, [board, selected]);

  const totalTickets = useMemo(
    () => Object.values(board).reduce((sum, list) => sum + list.length, 0),
    [board],
  );

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
          <Button variant="primary" size="medium" leadingIcon={RiAddFill} onClick={() => openNew("backlog")}>
            New ticket
          </Button>
        </>
      }
    >
      <p className="px-1 text-body-2-regular text-text-secondary">
        {totalTickets} tickets across {COLUMNS.length} columns · drag a card to another column, or open it to edit.
      </p>

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
            const isDropTarget = dropColumn === column.id;
            return (
              <section
                key={column.id}
                aria-label={`${column.name} column`}
                onDragOver={(event) => {
                  event.preventDefault();
                  if (draggedId) setDropColumn(column.id);
                }}
                onDragLeave={() => setDropColumn((cur) => (cur === column.id ? null : cur))}
                onDrop={(event) => {
                  event.preventDefault();
                  if (!draggedId) return;
                  const from = (Object.keys(board) as ColumnId[]).find((key) =>
                    board[key].some((t) => t.id === draggedId),
                  );
                  if (from) moveTicket(draggedId, from, column.id);
                  setDraggedId(null);
                  setDropColumn(null);
                }}
                className={cx(
                  "relative flex h-full min-h-0 flex-col overflow-hidden rounded-2-5xl bg-background-secondary-default pt-3 ring-2 ring-inset transition-[box-shadow,background-color] duration-150 ease-out",
                  isDropTarget ? "bg-background-secondary-hover ring-accent-500" : "ring-transparent",
                )}
              >
                <div className="flex h-5 shrink-0 items-center justify-between px-3">
                  <div className="flex min-w-0 items-center gap-1.5">
                    <h2 className="truncate text-body-medium text-text-primary">{column.name}</h2>
                    <span className="text-body-medium text-text-secondary tabular-nums">
                      {tickets.length} / {column.limit}
                    </span>
                  </div>
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
                </div>

                <div className="flex min-h-0 flex-1 flex-col gap-1.5 overflow-y-auto px-2 py-2 max-lg:overflow-visible">
                  {tickets.length === 0 && (
                    <p className="rounded-xl border border-dashed border-border-button-default px-3 py-6 text-center text-body-2-regular text-text-tertiary">
                      No tickets — drop one here or add a new ticket.
                    </p>
                  )}
                  {tickets.map((ticket) => (
                    <div key={ticket.id} className="group relative shrink-0 pb-1.5">
                      <article
                        role="button"
                        tabIndex={0}
                        aria-label={`Open ${ticket.id}: ${ticket.title}`}
                        draggable
                        onDragStart={(event) => {
                          event.dataTransfer.setData("text/plain", ticket.id);
                          event.dataTransfer.effectAllowed = "move";
                          setDraggedId(ticket.id);
                        }}
                        onDragEnd={() => {
                          setDraggedId(null);
                          setDropColumn(null);
                        }}
                        onClick={() => {
                          setMenuFor(null);
                          setSelected({ column: column.id, id: ticket.id });
                        }}
                        onKeyDown={(event) => {
                          if (event.key === "Enter" || event.key === " ") {
                            event.preventDefault();
                            setSelected({ column: column.id, id: ticket.id });
                          }
                        }}
                        className={cx(
                          "relative flex w-full cursor-grab flex-col gap-2 rounded-xl bg-background-primary-default p-3 text-start shadow-[0_1px_1px_rgb(0_0_0/0.05)] ring-[2.5px] ring-transparent transition-[box-shadow,opacity] duration-200 ease-out motion-reduce:transition-none hover:shadow-sm hover:ring-border-button-hover active:cursor-grabbing",
                          draggedId === ticket.id && "opacity-40",
                        )}
                      >
                        <div className="flex min-h-[22px] items-start justify-between gap-3">
                          <div className="flex min-w-0 items-center text-body-2-medium text-text-secondary">
                            <span className="shrink-0 tabular-nums">{ticket.id}</span>
                            <RiArrowRightSLine className="size-[15px] shrink-0 text-foreground-icon-tertiary" aria-hidden />
                            <span className="truncate">{ticket.tag}</span>
                          </div>
                          <div className="flex shrink-0 items-center gap-1">
                            <AvatarStack names={ticket.assignees} />
                            <button
                              type="button"
                              aria-label={`Actions for ${ticket.id}`}
                              onClick={(event) => {
                                event.stopPropagation();
                                setMenuFor((cur) => (cur === ticket.id ? null : ticket.id));
                              }}
                              className="flex size-5 cursor-pointer items-center justify-center rounded-md text-foreground-icon-secondary opacity-0 transition-opacity hover:bg-background-tertiary-default focus-visible:opacity-100 group-hover:opacity-100"
                            >
                              <RiMoreFill className="size-4" aria-hidden />
                            </button>
                          </div>
                        </div>
                        <div className="flex flex-col items-start gap-2">
                          <div className="flex flex-wrap items-center gap-1.5">
                            <span className={cx("inline-flex items-center justify-center rounded-md px-1.5 py-0.5 text-body-2-medium", PRIORITY_PILL[ticket.priority])}>
                              {ticket.priority}
                            </span>
                            <span className="inline-flex items-center gap-1 rounded-md px-1.5 py-0.5 text-body-2-medium text-text-primary ring-1 ring-inset ring-border-button-default">
                              <span className={cx("size-1.5 rounded-full", APP_DOT[ticket.app])} aria-hidden />
                              {ticket.app}
                            </span>
                          </div>
                          <div className="flex w-full flex-col gap-[5px]">
                            <h3 className="text-body-medium text-text-primary">{ticket.title}</h3>
                            <p className="text-body-2-medium text-text-secondary">{ticket.dateLabel}</p>
                          </div>
                        </div>
                      </article>
                      {menuFor === ticket.id && (
                        <div className="absolute right-2 top-10 z-30 w-48 rounded-xl border border-border-button-default bg-background-primary-default p-1 shadow-lg">
                          <p className="px-2.5 pt-1.5 pb-1 text-caption-1-semibold text-text-tertiary uppercase">Move to</p>
                          {COLUMNS.filter((c) => c.id !== column.id).map((target) => (
                            <button
                              key={target.id}
                              type="button"
                              onClick={() => {
                                moveTicket(ticket.id, column.id, target.id);
                                setMenuFor(null);
                              }}
                              className="w-full cursor-pointer rounded-lg px-2.5 py-2 text-start text-body-medium text-text-primary hover:bg-background-secondary-hover"
                            >
                              {target.name}
                            </button>
                          ))}
                          <button
                            type="button"
                            onClick={() => {
                              setMenuFor(null);
                              setSelected({ column: column.id, id: ticket.id });
                            }}
                            className="w-full cursor-pointer rounded-lg px-2.5 py-2 text-start text-body-medium text-text-primary hover:bg-background-secondary-hover"
                          >
                            Open details
                          </button>
                        </div>
                      )}
                    </div>
                  ))}
                </div>

                <button
                  type="button"
                  onClick={() => openNew(column.id)}
                  className="mx-2 mb-2 flex shrink-0 cursor-pointer items-center gap-1 rounded-xl px-2 py-2 text-start text-body-medium text-text-secondary transition-colors hover:bg-background-tertiary-default focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-border-focus-ring"
                >
                  <RiAddFill className="size-4" aria-hidden />
                  Add ticket
                </button>
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
                <select
                  value={selected.column}
                  aria-label="Status"
                  onChange={(event) => moveTicket(selectedTicket.id, selected.column, event.target.value as ColumnId)}
                  className={inputClass}
                >
                  {COLUMNS.map((c) => (
                    <option key={c.id} value={c.id}>{c.name}</option>
                  ))}
                </select>
              </label>
              <label className="flex flex-col gap-1.5">
                <span className={labelClass}>Priority</span>
                <select
                  value={selectedTicket.priority}
                  aria-label="Priority"
                  onChange={(event) => updateTicket(selected.column, selectedTicket.id, { priority: event.target.value as Priority })}
                  className={inputClass}
                >
                  {(["Low", "Medium", "High", "Urgent"] as Priority[]).map((p) => (
                    <option key={p} value={p}>{p}</option>
                  ))}
                </select>
              </label>
              <label className="flex flex-col gap-1.5">
                <span className={labelClass}>Project</span>
                <select
                  value={selectedTicket.app}
                  aria-label="Project"
                  onChange={(event) => updateTicket(selected.column, selectedTicket.id, { app: event.target.value as AppName })}
                  className={inputClass}
                >
                  {(["vibl", "firstview", "BoardUI"] as AppName[]).map((a) => (
                    <option key={a} value={a}>{a}</option>
                  ))}
                </select>
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
                      <Avatar size="xs" color={PEOPLE[name].color} initials={PEOPLE[name].initials} alt="" className="size-5" />
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
                  <Avatar size="xs" color={comment.author === "Mertcan Esmergul" ? "neutral" : (PEOPLE[comment.author]?.color ?? "neutral")} initials={comment.author.split(" ").map((w) => w[0]).join("")} alt={comment.author} />
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
                <select value={form.app} aria-label="Project" onChange={(event) => setForm((prev) => ({ ...prev, app: event.target.value as AppName }))} className={inputClass}>
                  {(["vibl", "firstview", "BoardUI"] as AppName[]).map((a) => (
                    <option key={a} value={a}>{a}</option>
                  ))}
                </select>
              </label>
              <label className="flex flex-col gap-1.5">
                <span className={labelClass}>Priority</span>
                <select value={form.priority} aria-label="Priority" onChange={(event) => setForm((prev) => ({ ...prev, priority: event.target.value as Priority }))} className={inputClass}>
                  {(["Low", "Medium", "High", "Urgent"] as Priority[]).map((p) => (
                    <option key={p} value={p}>{p}</option>
                  ))}
                </select>
              </label>
            </div>

            <label className="flex flex-col gap-1.5">
              <span className={labelClass}>Column</span>
              <select value={newColumn} aria-label="Column" onChange={(event) => setNewColumn(event.target.value as ColumnId)} className={inputClass}>
                {COLUMNS.map((c) => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>
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
                      <Avatar size="xs" color={PEOPLE[name].color} initials={PEOPLE[name].initials} alt="" className="size-5" />
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
