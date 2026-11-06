"use client";

import { RiAddFill, RiKanbanView2 } from "@remixicon/react";

import { TemplateShell } from "@/components/application/template-shell/template-shell";
import { Avatar } from "@/components/base/avatar/avatar";
import { Badge } from "@/components/base/badges/badge";
import { Button } from "@/components/base/buttons/button";

/**
 * Project Board template replica (Kanban).
 * Official: boardui.com/templates/project-board — "BoardUI Design Tasks",
 * Backlog / To do / In progress / Done columns with ticket cards.
 * Built only from free BoardUI components + mock data. Not the official Pro source.
 */

type Ticket = {
  id: string;
  tag: string;
  tagColor: "blue" | "purple" | "pink" | "emerald" | "orange";
  priority: "Low" | "Medium" | "High";
  title: string;
  since: string;
  assignee: string;
  assigneeColor: "neutral" | "blue" | "lime" | "pink";
};

const COLUMNS: { name: string; tickets: Ticket[] }[] = [
  {
    name: "Backlog",
    tickets: [
      { id: "DS-38", tag: "Agent handoff", tagColor: "purple", priority: "Low", title: "Explore approval cards for agent handoffs", since: "Since 14 Sep", assignee: "LS", assigneeColor: "blue" },
      { id: "FE-86", tag: "firstview", tagColor: "blue", priority: "Medium", title: "Add saved views for each project team", since: "Since 13 Sep", assignee: "JA", assigneeColor: "blue" },
      { id: "BE-23", tag: "Activity API", tagColor: "emerald", priority: "Medium", title: "Record an audit trail for agent actions", since: "Since 12 Sep", assignee: "ML", assigneeColor: "pink" },
    ],
  },
  {
    name: "To do",
    tickets: [
      { id: "DS-34", tag: "Foundations", tagColor: "orange", priority: "High", title: "Define semantic tokens for elevated surfaces", since: "Since 12 Sep", assignee: "AP", assigneeColor: "lime" },
      { id: "FE-91", tag: "firstview", tagColor: "blue", priority: "Medium", title: "Saved view switcher in the sidebar", since: "Since 11 Sep", assignee: "JA", assigneeColor: "blue" },
    ],
  },
  {
    name: "In progress",
    tickets: [
      { id: "DS-41", tag: "Agent handoff", tagColor: "purple", priority: "High", title: "Approval card states for agent actions", since: "Since 10 Sep", assignee: "LS", assigneeColor: "blue" },
      { id: "BE-27", tag: "Activity API", tagColor: "emerald", priority: "Low", title: "Audit trail filters by actor and action", since: "Since 9 Sep", assignee: "ML", assigneeColor: "pink" },
    ],
  },
  {
    name: "Done",
    tickets: [
      { id: "DS-29", tag: "Foundations", tagColor: "orange", priority: "Medium", title: "Semantic color tokens for charts", since: "Since 8 Sep", assignee: "AP", assigneeColor: "lime" },
      { id: "FE-80", tag: "firstview", tagColor: "blue", priority: "Low", title: "Project switcher in the sidebar", since: "Since 5 Sep", assignee: "JA", assigneeColor: "blue" },
    ],
  },
];

const PRIORITY_COLOR: Record<Ticket["priority"], "primary" | "neutral"> = {
  Low: "neutral",
  Medium: "neutral",
  High: "primary",
};

function TicketCard({ ticket }: { ticket: Ticket }) {
  return (
    <article className="flex w-full flex-col gap-2.5 rounded-2xl bg-background-secondary-default p-3.5">
      <div className="flex w-full items-center justify-between gap-2">
        <span className="text-body-2-medium text-text-tertiary tabular-nums">{ticket.id}</span>
        <Badge color={PRIORITY_COLOR[ticket.priority]}>{ticket.priority}</Badge>
      </div>
      <div className="flex flex-col gap-1">
        <p className="text-body-medium text-text-primary">{ticket.title}</p>
        <p className="text-body-2-regular text-text-secondary">{ticket.tag} · {ticket.since}</p>
      </div>
      <div className="flex w-full items-center justify-between">
        <Badge color="neutral">{ticket.tag}</Badge>
        <Avatar size="xs" color={ticket.assigneeColor} initials={ticket.assignee} />
      </div>
    </article>
  );
}

export default function ProjectBoardTemplatePage() {
  return (
    <TemplateShell
      title="Project board"
      heading="BoardUI Design Tasks"
      icon={RiKanbanView2}
      selected="project-board"
      actions={
        <Button variant="primary" size="medium" leadingIcon={RiAddFill}>
          New ticket
        </Button>
      }
    >
      <div className="grid w-full grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
        {COLUMNS.map((column) => (
          <section key={column.name} className="flex min-w-0 flex-col gap-3">
            <div className="flex items-center justify-between px-1">
              <p className="text-title-3-semibold text-text-primary">{column.name}</p>
              <span className="rounded-full bg-background-secondary-default px-2 py-0.5 text-body-2-medium text-text-secondary tabular-nums">
                {column.tickets.length}
              </span>
            </div>
            <div className="flex flex-col gap-3">
              {column.tickets.map((ticket) => (
                <TicketCard key={ticket.id} ticket={ticket} />
              ))}
            </div>
          </section>
        ))}
      </div>
    </TemplateShell>
  );
}
