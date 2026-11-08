"use client";

import { useEffect, useId, useMemo, useRef, useState } from "react";
import { Area, Bar, ComposedChart, Line, ResponsiveContainer, Tooltip as RechartsTooltip } from "recharts";
import { useCountUp } from "@/hooks/use-count-up";
import { motion, useReducedMotion } from "motion/react";
import {
  RiAddFill,
  RiAddLine,
  RiArrowRightSLine,
  RiArrowUpLine,
  RiCheckboxBlankCircleLine,
  RiCheckboxCircleLine,
  RiCheckLine,
  RiCloseLine,
  RiEditLine,
  RiEqualizerLine,
  RiEyeLine,
  RiFileCopyLine,
  RiFolder6Line,
  RiFolderLine,
  RiInboxArchiveLine,
  RiInboxLine,
  RiKanbanView2,
  RiLayoutLeftLine,
  RiLinkM,
  RiMore2Fill,
  RiMoreFill,
  RiPieChart2Line,
  RiRestartLine,
  RiSortDesc,
  RiUserLine,
} from "@remixicon/react";

import { TemplateShell } from "@/components/application/template-shell/template-shell";
import { NotificationBell } from "@/components/application/app-shell/notification-bell";
import { Avatar } from "@/components/base/avatar/avatar";
import { Chip } from "@/components/base/badges/chip";
import { Button } from "@/components/base/buttons/button";
import { CloseButton } from "@/components/base/buttons/close-button";
import { IconButton } from "@/components/base/buttons/icon-button";
import { Checkbox } from "@/components/base/checkbox/checkbox";
import { Dropdown, DropdownItem, DropdownPopover, DropdownTrigger } from "@/components/base/dropdown/dropdown";
import { Select, SelectItem } from "@/components/base/select/select";
import { Textarea } from "@/components/base/textarea/textarea";
import { Tooltip, TooltipTrigger } from "@/components/base/tooltip/tooltip";
import { toast, Toaster } from "@/components/base/toast/toast";
import { Dialog, Heading, Modal, ModalOverlay } from "react-aria-components";
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

type Comment = { author: string; body: string; time: string };

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
  tokenSeries: { label: string; value: number }[];
  tokenTotal: number;
  tokenChange: string;
  resources: { label: string; href: string }[];
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
    { id: "DS-38", tag: "Agent handoff", priority: "Low", app: "vibl", title: "Explore approval cards for agent handoffs", dateLabel: "Since 14 Sep", sortDate: "2026-09-14", done: false, assignees: ["Maya Chen", "Priya Shah"], description: "Give people a clear moment to review an agent’s work before it takes action. Explore an approval card that explains what will happen, which resources are involved, and what the user can change.\n\nDesign the approve, request changes, and declined states. The card should remain readable in a busy conversation and make the next step obvious without interrupting the flow.", comments: [{ author: "Noah Williams", body: "I’ve added this to our next review. Let me know if anything is blocking progress.", time: "2 hours ago" }, { author: "Elif Kaya", body: "The initial direction is a compact summary with an expandable action preview. Let’s validate the language before refining the visual states.", time: "5 hours ago" }], tokenSeries: [{ label: "Sep 1", value: 12.2 }, { label: "Sep 2", value: 6.7 }, { label: "Sep 3", value: 0 }, { label: "Sep 4", value: 0 }, { label: "Sep 5", value: 1.6 }, { label: "Sep 6", value: 21.8 }, { label: "Sep 7", value: 0 }, { label: "Sep 8", value: 12.3 }, { label: "Sep 9", value: 0 }, { label: "Sep 10", value: 4.2 }, { label: "Sep 11", value: 12.1 }, { label: "Sep 12", value: 16.9 }, { label: "Sep 13", value: 0 }, { label: "Sep 14", value: 0 }, { label: "Sep 15", value: 3.5 }, { label: "Sep 16", value: 20.6 }], tokenTotal: 111.9, tokenChange: "+4.9%", resources: [{ label: "figma.com", href: "https://www.figma.com/design/u0pDgMLRgYosD3lF19CZ3J/Board-UI" }] },
    { id: "FE-86", tag: "Project board", priority: "Low", app: "firstview", title: "Add saved views for each project team", dateLabel: "Since 13 Sep", sortDate: "2026-09-13", done: false, assignees: ["Elif Kaya"], description: "Let teams save a useful combination of project, assignee, and priority filters as a named board view. A saved view should bring someone back to the same working context without rebuilding filters every morning.\n\nKeep personal views separate from team views, show when a view has unsaved changes, and handle empty results with a clear way to reset filters.", comments: [{ author: "Maya Chen", body: "I’ve added this to our next review. Let me know if anything is blocking progress.", time: "2 hours ago" }], tokenSeries: [{ label: "Sep 1", value: 17.3 }, { label: "Sep 2", value: 20 }, { label: "Sep 3", value: 6.7 }, { label: "Sep 4", value: 12.8 }, { label: "Sep 5", value: 16.9 }, { label: "Sep 6", value: 17.6 }, { label: "Sep 7", value: 0 }, { label: "Sep 8", value: 0 }, { label: "Sep 9", value: 0 }, { label: "Sep 10", value: 11.1 }, { label: "Sep 11", value: 3.8 }, { label: "Sep 12", value: 16.6 }, { label: "Sep 13", value: 22.5 }, { label: "Sep 14", value: 0 }, { label: "Sep 15", value: 0 }, { label: "Sep 16", value: 10.6 }], tokenTotal: 155.9, tokenChange: "-29.2%", resources: [{ label: "motion.dev", href: "https://motion.dev/docs/react" }, { label: "react.dev", href: "https://react.dev/learn" }, { label: "react-aria.adobe.com", href: "https://react-aria.adobe.com/" }] },
    { id: "BE-23", tag: "Activity API", priority: "Medium", app: "vibl", title: "Record an audit trail for agent actions", dateLabel: "Since 12 Sep", sortDate: "2026-09-12", done: false, assignees: ["Daniel Kim"], description: "Create a reliable activity record for actions performed by agents. Each event should identify the actor, the affected resource, the outcome, and the time it happened.\n\nStore a correlation identifier so a sequence of related actions can be reconstructed. Exclude credentials and sensitive payloads, and keep the event schema versioned for future integrations.", comments: [{ author: "Daniel Kim", body: "Please check the final interaction with keyboard navigation too.", time: "2 hours ago" }], tokenSeries: [{ label: "Sep 1", value: 6.1 }, { label: "Sep 2", value: 0.8 }, { label: "Sep 3", value: 7.2 }, { label: "Sep 4", value: 0 }, { label: "Sep 5", value: 0 }, { label: "Sep 6", value: 0 }, { label: "Sep 7", value: 7.9 }, { label: "Sep 8", value: 0 }, { label: "Sep 9", value: 0.4 }, { label: "Sep 10", value: 4.2 }, { label: "Sep 11", value: 0 }, { label: "Sep 12", value: 8 }, { label: "Sep 13", value: 0 }, { label: "Sep 14", value: 0 }, { label: "Sep 15", value: 5.2 }, { label: "Sep 16", value: 1.8 }], tokenTotal: 41.6, tokenChange: "-10.9%", resources: [{ label: "developer.mozilla.org", href: "https://developer.mozilla.org/en-US/docs/Web/HTTP" }, { label: "nodejs.org", href: "https://nodejs.org/docs/latest/api/" }, { label: "postgresql.org", href: "https://www.postgresql.org/docs/" }] },
  ],
  todo: [
    { id: "DS-34", tag: "Foundations", priority: "High", app: "BoardUI", title: "Define semantic tokens for elevated surfaces", dateLabel: "Since 12 Sep", sortDate: "2026-09-12", done: false, assignees: ["Maya Chen"], description: "Define a consistent surface hierarchy for cards, menus, and floating panels. The new semantic tokens should make elevation feel intentional while preserving the quiet, neutral character of BoardUI.\n\nReview light and dark modes together. Document which surface, border, and shadow combination to use at each level so consumers can build new layouts without introducing one-off colors.", comments: [{ author: "Elif Kaya", body: "The surface audit is ready. Menus and dialogs need a little more separation in dark mode; token comparisons are the next step.", time: "2 hours ago" }, { author: "Daniel Kim", body: "I’ll take a look at this with the BoardUI team and share feedback here.", time: "5 hours ago" }], tokenSeries: [{ label: "Sep 1", value: 1.2 }, { label: "Sep 2", value: 0 }, { label: "Sep 3", value: 0.5 }, { label: "Sep 4", value: 1.8 }, { label: "Sep 5", value: 2.3 }, { label: "Sep 6", value: 1.2 }, { label: "Sep 7", value: 2.4 }, { label: "Sep 8", value: 2.2 }, { label: "Sep 9", value: 0 }, { label: "Sep 10", value: 0 }, { label: "Sep 11", value: 0 }, { label: "Sep 12", value: 0.5 }, { label: "Sep 13", value: 3.4 }, { label: "Sep 14", value: 0 }, { label: "Sep 15", value: 3.7 }, { label: "Sep 16", value: 0.4 }], tokenTotal: 19.6, tokenChange: "-31.0%", resources: [{ label: "tailwindcss.com", href: "https://tailwindcss.com/docs/theme" }] },
    { id: "FE-82", tag: "Composer", priority: "Low", app: "firstview", title: "Add keyboard navigation to model picker", dateLabel: "Since 11 Sep", sortDate: "2026-09-11", done: false, assignees: ["Noah Williams", "Elif Kaya"], description: "Make every model in the composer’s picker reachable without a mouse. Arrow keys should move through available models, Enter should confirm a selection, and Escape should return focus to the trigger.\n\nPreserve search input behavior, skip disabled models, and announce the active option and current selection to assistive technology.", comments: [{ author: "Daniel Kim", body: "I’ve added this to our next review. Let me know if anything is blocking progress.", time: "2 hours ago" }, { author: "Priya Shah", body: "The interaction checklist is ready. We’ll use the existing selection primitives so focus behavior stays consistent with other menus.", time: "5 hours ago" }], tokenSeries: [{ label: "Sep 1", value: 0 }, { label: "Sep 2", value: 24.1 }, { label: "Sep 3", value: 3.4 }, { label: "Sep 4", value: 16.6 }, { label: "Sep 5", value: 9.2 }, { label: "Sep 6", value: 20.2 }, { label: "Sep 7", value: 0 }, { label: "Sep 8", value: 8 }, { label: "Sep 9", value: 7.9 }, { label: "Sep 10", value: 0 }, { label: "Sep 11", value: 19.4 }, { label: "Sep 12", value: 0 }, { label: "Sep 13", value: 0 }, { label: "Sep 14", value: 0 }, { label: "Sep 15", value: 14.3 }, { label: "Sep 16", value: 0 }], tokenTotal: 123.1, tokenChange: "-49.0%", resources: [{ label: "motion.dev", href: "https://motion.dev/docs/react" }] },
    { id: "BE-19", tag: "Usage API", priority: "Low", app: "vibl", title: "Return rolling limits with reset timestamps", dateLabel: "Since 10 Sep", sortDate: "2026-09-10", done: false, assignees: ["Daniel Kim"], description: "Expose rolling usage limits with an accurate reset timestamp so interfaces can explain when capacity becomes available again. Return used, remaining, and total values for every applicable window.\n\nUse a stable timestamp format and handle overlapping windows, delayed updates, and exhausted limits. Consumers should not need to guess which limit is blocking a request.", comments: [{ author: "Noah Williams", body: "Please check the final interaction with keyboard navigation too.", time: "2 hours ago" }], tokenSeries: [{ label: "Sep 1", value: 13.7 }, { label: "Sep 2", value: 0 }, { label: "Sep 3", value: 14.1 }, { label: "Sep 4", value: 12.2 }, { label: "Sep 5", value: 0 }, { label: "Sep 6", value: 0 }, { label: "Sep 7", value: 11.2 }, { label: "Sep 8", value: 18.9 }, { label: "Sep 9", value: 19.2 }, { label: "Sep 10", value: 16.7 }, { label: "Sep 11", value: 0 }, { label: "Sep 12", value: 0 }, { label: "Sep 13", value: 21.7 }, { label: "Sep 14", value: 18.3 }, { label: "Sep 15", value: 0 }, { label: "Sep 16", value: 16.9 }], tokenTotal: 162.9, tokenChange: "+32.4%", resources: [{ label: "developer.mozilla.org", href: "https://developer.mozilla.org/en-US/docs/Web/HTTP" }, { label: "nodejs.org", href: "https://nodejs.org/docs/latest/api/" }] },
  ],
  progress: [
    { id: "FE-79", tag: "Agent progress", priority: "Medium", app: "firstview", title: "Animate nested task groups as they stream", dateLabel: "Since 9 Sep", sortDate: "2026-09-09", done: false, assignees: ["Elif Kaya", "Noah Williams"], description: "Help people follow an agent’s work as nested task groups arrive in a stream. New groups should expand naturally, completed steps should settle quietly, and the current action should remain easy to find.\n\nKeep the layout stable when several updates arrive together. Respect reduced-motion preferences and avoid moving the reader away from the section they are inspecting.", comments: [{ author: "Daniel Kim", body: "The scope looks good. Let’s review the first pass together before moving ahead.", time: "2 hours ago" }, { author: "Priya Shah", body: "I’ve added this to our next review. Let me know if anything is blocking progress.", time: "5 hours ago" }, { author: "Maya Chen", body: "The nested layout is working. We’re tuning the timing around rapid updates so the hierarchy stays readable while the agent is busy.", time: "Yesterday" }], tokenSeries: [{ label: "Sep 1", value: 0.2 }, { label: "Sep 2", value: 10 }, { label: "Sep 3", value: 3 }, { label: "Sep 4", value: 0 }, { label: "Sep 5", value: 0 }, { label: "Sep 6", value: 7 }, { label: "Sep 7", value: 2.9 }, { label: "Sep 8", value: 12.8 }, { label: "Sep 9", value: 0 }, { label: "Sep 10", value: 13.5 }, { label: "Sep 11", value: 0 }, { label: "Sep 12", value: 6.8 }, { label: "Sep 13", value: 5.5 }, { label: "Sep 14", value: 4.1 }, { label: "Sep 15", value: 13 }, { label: "Sep 16", value: 11 }], tokenTotal: 89.8, tokenChange: "+50.1%", resources: [{ label: "motion.dev", href: "https://motion.dev/docs/react" }] },
    { id: "DS-31", tag: "Dark mode", priority: "Urgent", app: "BoardUI", title: "Tune chart contrast on dark dashboard cards", dateLabel: "Since 8 Sep", sortDate: "2026-09-08", done: false, assignees: ["Maya Chen"], description: "Improve chart readability on dark dashboard surfaces without making the palette feel oversaturated. Review series colors, grid lines, labels, and hover states as a complete system.\n\nCheck overlapping areas and dense legends in particular. The final choices should use existing semantic chart tokens and remain distinguishable when several series are shown together.", comments: [{ author: "Elif Kaya", body: "The scope looks good. Let’s review the first pass together before moving ahead.", time: "2 hours ago" }, { author: "Daniel Kim", body: "I’ve added this to our next review. Let me know if anything is blocking progress.", time: "5 hours ago" }], tokenSeries: [{ label: "Sep 1", value: 13.2 }, { label: "Sep 2", value: 8.3 }, { label: "Sep 3", value: 9.2 }, { label: "Sep 4", value: 6.4 }, { label: "Sep 5", value: 16.8 }, { label: "Sep 6", value: 0 }, { label: "Sep 7", value: 10.5 }, { label: "Sep 8", value: 11.5 }, { label: "Sep 9", value: 0 }, { label: "Sep 10", value: 0 }, { label: "Sep 11", value: 6.8 }, { label: "Sep 12", value: 17.2 }, { label: "Sep 13", value: 11.4 }, { label: "Sep 14", value: 21.5 }, { label: "Sep 15", value: 13.3 }, { label: "Sep 16", value: 11.9 }], tokenTotal: 158, tokenChange: "+8.2%", resources: [{ label: "figma.com", href: "https://www.figma.com/design/u0pDgMLRgYosD3lF19CZ3J/Board-UI" }, { label: "tailwindcss.com", href: "https://tailwindcss.com/docs/theme" }, { label: "remixicon.com", href: "https://remixicon.com" }] },
  ],
  review: [
    { id: "FE-76", tag: "Questionnaire", priority: "Low", app: "vibl", title: "Polish the transition between plan questions", dateLabel: "Since 7 Sep", sortDate: "2026-09-07", done: false, assignees: ["Priya Shah"], description: "Make the transition between planning questions feel continuous. Preserve the user’s answers, keep the active question in view, and give the next set of choices enough breathing room to be understood.\n\nForward and backward navigation should feel equally natural. Support long answers, validation messages, and reduced motion without abrupt height changes.", comments: [{ author: "Maya Chen", body: "I’ve added this to our next review. Let me know if anything is blocking progress.", time: "2 hours ago" }, { author: "Noah Williams", body: "The implementation is ready for review. Please check the backward transition and confirm that focus lands on the next question heading.", time: "5 hours ago" }, { author: "Elif Kaya", body: "I’ll take a look at this with the vibl team and share feedback here.", time: "Yesterday" }], tokenSeries: [{ label: "Sep 1", value: 3 }, { label: "Sep 2", value: 1.6 }, { label: "Sep 3", value: 9.6 }, { label: "Sep 4", value: 10.6 }, { label: "Sep 5", value: 4.4 }, { label: "Sep 6", value: 6 }, { label: "Sep 7", value: 10.1 }, { label: "Sep 8", value: 2.2 }, { label: "Sep 9", value: 3.2 }, { label: "Sep 10", value: 0 }, { label: "Sep 11", value: 0 }, { label: "Sep 12", value: 4.4 }, { label: "Sep 13", value: 1.7 }, { label: "Sep 14", value: 1.8 }, { label: "Sep 15", value: 8.1 }, { label: "Sep 16", value: 10.8 }], tokenTotal: 77.5, tokenChange: "-36.8%", resources: [{ label: "react.dev", href: "https://react.dev/learn" }, { label: "react-aria.adobe.com", href: "https://react-aria.adobe.com/" }] },
  ],
  done: [
    { id: "DS-27", tag: "Avatars", priority: "Low", app: "BoardUI", title: "Ship overlapping avatar groups for cards", dateLabel: "Completed 6 Sep", sortDate: "2026-09-06", done: true, assignees: ["Maya Chen"], description: "Ship a compact avatar group for tickets and activity cards. Overlapping portraits should retain clear edges, predictable stacking, and accessible names for every person represented.\n\nInclude an overflow count for larger groups and initials when an image is unavailable. Keep sizing aligned with existing Avatar components.", comments: [{ author: "Priya Shah", body: "Please check the final interaction with keyboard navigation too.", time: "2 hours ago" }], tokenSeries: [{ label: "Sep 1", value: 0 }, { label: "Sep 2", value: 20.8 }, { label: "Sep 3", value: 0 }, { label: "Sep 4", value: 22.7 }, { label: "Sep 5", value: 19.8 }, { label: "Sep 6", value: 0 }, { label: "Sep 7", value: 22.8 }, { label: "Sep 8", value: 2.9 }, { label: "Sep 9", value: 7.6 }, { label: "Sep 10", value: 3 }, { label: "Sep 11", value: 16.5 }, { label: "Sep 12", value: 0 }, { label: "Sep 13", value: 0 }, { label: "Sep 14", value: 0 }, { label: "Sep 15", value: 20.6 }, { label: "Sep 16", value: 0 }], tokenTotal: 136.7, tokenChange: "-46.4%", resources: [{ label: "remixicon.com", href: "https://remixicon.com" }] },
    { id: "FE-71", tag: "Studio canvas", priority: "Medium", app: "firstview", title: "Keep generated screens aligned while zooming", dateLabel: "Completed 5 Sep", sortDate: "2026-09-05", done: true, assignees: ["Noah Williams", "Daniel Kim"], description: "Keep generated screens aligned to the Studio canvas while people zoom and pan. Screen bounds, selection outlines, and labels should all follow the same coordinate system.\n\nAvoid rounding drift at fractional zoom levels and preserve the point under the cursor when zooming. Large generated layouts should remain easy to navigate.", comments: [{ author: "Noah Williams", body: "Please check the final interaction with keyboard navigation too.", time: "2 hours ago" }], tokenSeries: [{ label: "Sep 1", value: 10.7 }, { label: "Sep 2", value: 15.3 }, { label: "Sep 3", value: 0 }, { label: "Sep 4", value: 21.8 }, { label: "Sep 5", value: 18.8 }, { label: "Sep 6", value: 0 }, { label: "Sep 7", value: 0 }, { label: "Sep 8", value: 3.2 }, { label: "Sep 9", value: 0 }, { label: "Sep 10", value: 15.5 }, { label: "Sep 11", value: 13.5 }, { label: "Sep 12", value: 9.9 }, { label: "Sep 13", value: 18.5 }, { label: "Sep 14", value: 16.4 }, { label: "Sep 15", value: 17.3 }, { label: "Sep 16", value: 4.6 }], tokenTotal: 165.5, tokenChange: "+37.1%", resources: [{ label: "react-aria.adobe.com", href: "https://react-aria.adobe.com/" }] },
    { id: "BE-16", tag: "Registry", priority: "Low", app: "BoardUI", title: "Validate template dependencies during build", dateLabel: "Completed 4 Sep", sortDate: "2026-09-04", done: true, assignees: ["Daniel Kim"], description: "Validate template dependencies before a release is packaged. Every imported file must resolve, shared registry dependencies must be declared, and paid sources must stay out of the public registry.\n\nReport actionable build errors with the importing file and missing dependency. Verify both the CLI payload and the downloadable template package.", comments: [{ author: "Noah Williams", body: "Dependency validation is now part of packaging. Both the registry output and template archives pass the release checks.", time: "2 hours ago" }, { author: "Elif Kaya", body: "I’ll take a look at this with the BoardUI team and share feedback here.", time: "5 hours ago" }], tokenSeries: [{ label: "Sep 1", value: 0 }, { label: "Sep 2", value: 0 }, { label: "Sep 3", value: 0 }, { label: "Sep 4", value: 0 }, { label: "Sep 5", value: 17.8 }, { label: "Sep 6", value: 0 }, { label: "Sep 7", value: 0 }, { label: "Sep 8", value: 0 }, { label: "Sep 9", value: 10.3 }, { label: "Sep 10", value: 17 }, { label: "Sep 11", value: 4.1 }, { label: "Sep 12", value: 2.1 }, { label: "Sep 13", value: 0 }, { label: "Sep 14", value: 13.9 }, { label: "Sep 15", value: 19.1 }, { label: "Sep 16", value: 12.2 }], tokenTotal: 96.5, tokenChange: "+342.1%", resources: [{ label: "nodejs.org", href: "https://nodejs.org/docs/latest/api/" }, { label: "postgresql.org", href: "https://www.postgresql.org/docs/" }] },
    { id: "DS-25", tag: "Motion", priority: "Low", app: "BoardUI", title: "Document reduced-motion behavior for blocks", dateLabel: "Completed 3 Sep", sortDate: "2026-09-03", done: true, assignees: ["Priya Shah"], description: "Document how animated blocks behave when reduced motion is enabled. Explain which transitions are removed, which state changes remain visible, and how focus communicates progress.\n\nInclude practical examples for streaming tasks, draggable cards, and dialogs. The guidance should help teams preserve clarity without relying on movement.", comments: [{ author: "Noah Williams", body: "I’ve added this to our next review. Let me know if anything is blocking progress.", time: "2 hours ago" }, { author: "Elif Kaya", body: "The guidance is published with examples for the main interactive blocks. Each pattern includes a reduced-motion alternative.", time: "5 hours ago" }, { author: "Daniel Kim", body: "I’ll take a look at this with the BoardUI team and share feedback here.", time: "Yesterday" }], tokenSeries: [{ label: "Sep 1", value: 4 }, { label: "Sep 2", value: 13.2 }, { label: "Sep 3", value: 1.1 }, { label: "Sep 4", value: 7.8 }, { label: "Sep 5", value: 7.9 }, { label: "Sep 6", value: 0.4 }, { label: "Sep 7", value: 4.4 }, { label: "Sep 8", value: 13.4 }, { label: "Sep 9", value: 8.3 }, { label: "Sep 10", value: 1.8 }, { label: "Sep 11", value: 13.9 }, { label: "Sep 12", value: 10 }, { label: "Sep 13", value: 0 }, { label: "Sep 14", value: 0 }, { label: "Sep 15", value: 9.4 }, { label: "Sep 16", value: 12.7 }], tokenTotal: 108.3, tokenChange: "+7.5%", resources: [{ label: "w3.org", href: "https://www.w3.org/WAI/" }] },
  ],
};

const inputClass =
  "w-full rounded-xl border border-border-button-default bg-background-primary-default px-2.5 py-2 text-body-medium text-text-primary outline-none focus-visible:ring-2 focus-visible:ring-border-focus-ring";
const labelClass = "text-caption-1-semibold text-text-tertiary uppercase tracking-[0.06em]";

const STATUS_ICON = {
  backlog: RiInboxArchiveLine,
  todo: RiCheckboxBlankCircleLine,
  progress: RiPieChart2Line,
  review: RiEyeLine,
  done: RiCheckboxCircleLine,
} as const;

function StatusIcon({ status, className }: { status: ColumnId; className?: string }) {
  const Icon = STATUS_ICON[status];
  return <Icon aria-hidden className={cx("size-[18px] shrink-0 text-foreground-icon-secondary", className)} />;
}

function FavoriteStarIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 17 17" className={cx("size-[17px] shrink-0", className)} fill="none" aria-hidden>
      <path
        d="M7.5767 2.7199A1 1 0 0 1 9.4233 2.7199 L10.3815 5.0236A1 1 0 0 0 11.2249 5.6363 L13.7119 5.8357A1 1 0 0 1 14.2825 7.5920 L12.3877 9.2151A1 1 0 0 0 12.0655 10.2066 L12.6444 12.6335A1 1 0 0 1 11.1505 13.7189 L9.0213 12.4184A1 1 0 0 0 7.9787 12.4184 L5.8495 13.7189A1 1 0 0 1 4.3556 12.6335 L4.9345 10.2066A1 1 0 0 0 4.6123 9.2151 L2.7175 7.5920A1 1 0 0 1 3.2881 5.8357 L5.7751 5.6363A1 1 0 0 0 6.6185 5.0236Z"
        stroke="currentColor"
        strokeWidth="1"
      />
    </svg>
  );
}

function CopyLinkIcon({ className }: { className?: string }) {
  return (
    <span aria-hidden className={cx("relative inline-flex shrink-0 items-center justify-center size-[18px]", className)}>
      <RiLinkM
        aria-hidden
        className="absolute size-[18px] scale-100 opacity-100 blur-[0px] transition-all duration-200 ease-out group-data-[copied=true]:scale-75 group-data-[copied=true]:opacity-0 group-data-[copied=true]:blur-[2px] motion-reduce:transition-none"
      />
      <RiCheckLine
        aria-hidden
        className="absolute size-[18px] scale-75 opacity-0 blur-[2px] transition-all duration-200 ease-out group-data-[copied=true]:scale-100 group-data-[copied=true]:opacity-100 group-data-[copied=true]:blur-[0px] motion-reduce:transition-none"
      />
    </span>
  );
}

// B3 implements this chart card per the original bundle.
type TokensChartCardProps = {
  title?: string;
  className?: string;
  series: { label: string; value: number }[];
  total: number;
  change: string;
  variant?: "area" | "bar";
  startLabel: string;
  endLabel: string;
  plotHeight?: number;
};

type DotProps = {
  cx?: number | string | null;
  cy?: number | string | null;
  payload?: { value?: number } | null;
};

function PulsingDot({ cx, cy, payload }: DotProps) {
  if (cx == null || cy == null) return null;
  const color = payload?.value === 0 ? "var(--color-neutral-400)" : "var(--color-purple-500)";
  return (
    <g>
      <circle cx={cx} cy={cy} r={5} fill={color} opacity={0.3}>
        <animate attributeName="r" values="5;13" dur="1.4s" repeatCount="indefinite" />
        <animate attributeName="opacity" values="0.35;0" dur="1.4s" repeatCount="indefinite" />
      </circle>
      <circle cx={cx} cy={cy} r={5} fill={color} stroke="var(--color-background-secondary-default)" strokeWidth={3} />
    </g>
  );
}

function RunDot(props: DotProps) {
  if (props.payload?.value === 0) return null;
  return <PulsingDot {...props} />;
}

const PRIORITY_CHIP_COLOR: Record<Priority, "blue" | "yellow" | "orange" | "rose"> = {
  Low: "blue",
  Medium: "yellow",
  High: "orange",
  Urgent: "rose",
};
const PRIORITY_CHIP_HOVER: Record<Priority, string> = {
  Low: "hover:bg-ticket-detail-low-hover",
  Medium: "hover:bg-ticket-detail-medium-hover",
  High: "hover:bg-ticket-detail-high-hover",
  Urgent: "hover:bg-ticket-detail-urgent-hover",
};

function TokensChartCard({ title = "Tokens", className, series, total, change, variant = "area", startLabel, endLabel, plotHeight = 200 }: TokensChartCardProps) {
  const gradientId = useId();
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  const segments = useMemo(() => {
    const result: { key: string; dashed: boolean; from: number; to: number }[] = [];
    let i = 0;
    while (i < series.length) {
      const idle = series[i].value === 0;
      let end = i;
      while (end + 1 < series.length && (series[end + 1].value === 0) === idle) end++;
      if (idle) {
        result.push({ key: `idle-${i}`, dashed: true, from: i, to: end });
      } else {
        result.push({ key: `run-${i}`, dashed: false, from: Math.max(0, i - 1), to: Math.min(series.length - 1, end + 1) });
      }
      i = end + 1;
    }
    return result;
  }, [series]);

  const chartData = useMemo(
    () =>
      series.map((point, i) => ({
        ...point,
        ...Object.fromEntries(segments.map((s) => [s.key, i >= s.from && i <= s.to ? point.value : null])),
      })),
    [series, segments],
  );

  const isHovering = activeIndex !== null && activeIndex < series.length;
  const displayValue = isHovering ? series[activeIndex].value : total;
  const fallbackDate = (i: number) => {
    const date = new Date(Date.UTC(2026, 5, 14 + i));
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    return `${months[date.getUTCMonth()]} ${date.getUTCDate()}`;
  };
  const displayLabel = isHovering ? (series[activeIndex].label ?? fallbackDate(activeIndex)) : title;
  const display = useCountUp(Math.round(10 * displayValue)) / 10;

  return (
    <section className={cx("flex w-full flex-col rounded-[20px] bg-background-secondary-default py-3", className)}>
      <div className="relative z-10 -mb-8 flex w-full px-4 pt-1">
        <div className="flex flex-col gap-0.5">
          <p className="text-body-medium whitespace-nowrap text-text-secondary">{displayLabel}</p>
          <div className="flex items-center gap-2">
            <p key={String(activeIndex)} className="animate-number-fade text-title-2-medium whitespace-nowrap text-text-primary tabular-nums">
              {display.toFixed(1)}M tokens
            </p>
            <Chip variant="bold" color="purple">{change}</Chip>
          </div>
        </div>
      </div>
      <div className="w-full animate-chart-reveal" style={{ height: plotHeight }}>
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart
            data={chartData}
            margin={{ top: 27, right: 0, bottom: 2, left: 0 }}
            onMouseMove={(e) => {
              const idx = Number(e?.activeTooltipIndex);
              if (e?.isTooltipActive && Number.isInteger(idx)) setActiveIndex(idx);
              else setActiveIndex(null);
            }}
            onMouseLeave={() => setActiveIndex(null)}
          >
            <defs>
              <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="var(--color-purple-400)" stopOpacity={0.32} />
                <stop offset="100%" stopColor="var(--color-purple-400)" stopOpacity={0} />
              </linearGradient>
            </defs>
            <RechartsTooltip content={() => null} cursor={{ stroke: "var(--color-chart-cursor)", strokeWidth: 1, strokeDasharray: "4 4" }} />
            {variant === "bar" ? (
              <Bar dataKey="value" fill="var(--color-chart-agents-bar)" activeBar={{ fill: "var(--color-chart-agents-bar-active)" }} radius={[3, 3, 0, 0]} maxBarSize={16} isAnimationActive={false} />
            ) : (
              <Area type="linear" dataKey="value" stroke="none" fill={`url(#${gradientId})`} isAnimationActive={false} />
            )}
            {variant === "area" &&
              segments.map((s) => (
                <Line
                  key={s.key}
                  type="linear"
                  dataKey={s.key}
                  stroke={s.dashed ? "var(--color-neutral-400)" : "var(--color-purple-400)"}
                  strokeWidth={2}
                  strokeDasharray={s.dashed ? "5 5" : undefined}
                  dot={false}
                  activeDot={s.dashed ? <PulsingDot /> : <RunDot />}
                  isAnimationActive={false}
                />
              ))}
          </ComposedChart>
        </ResponsiveContainer>
      </div>
      <div className="mt-2 flex w-full items-start justify-between px-4 text-[11px] leading-[15px] font-medium tracking-[0.2px] whitespace-nowrap text-text-tertiary">
        <p>{startLabel}</p>
        <p>{endLabel}</p>
      </div>
    </section>
  );
}

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

export default function ProjectBoardTemplatePage() {
  const [board, setBoard] = useState<Record<ColumnId, Ticket[]>>(INITIAL_BOARD);
  const [selected, setSelected] = useState<{ column: ColumnId; id: string } | null>(null);
  const [newOpen, setNewOpen] = useState(false);
  const [newColumn, setNewColumn] = useState<ColumnId>("backlog");
  const [draggedId, setDraggedId] = useState<string | null>(null);
  const [dropColumn, setDropColumn] = useState<ColumnId | null>(null);
  const [sortFor, setSortFor] = useState<ColumnId | null>(null);
  const [commentDraft, setCommentDraft] = useState("");
  const [favorites, setFavorites] = useState<Set<string>>(new Set());
  const [scrollFade, setScrollFade] = useState(0);
  const [toastMessage, setToastMessage] = useState("");
  const [actionsOpen, setActionsOpen] = useState(false);
  const [descEditing, setDescEditing] = useState(false);
  const [descDraft, setDescDraft] = useState("");
  const toastTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);

  function showToast(message: string) {
    if (toastTimeout.current) clearTimeout(toastTimeout.current);
    setToastMessage(message);
    toast(message, { duration: 1600 });
    toastTimeout.current = setTimeout(() => setToastMessage(""), 1600);
  }

  async function copyTicketLink() {
    if (!selectedTicket) return;
    try {
      const url = new URL(window.location.href);
      url.hash = `ticket=${encodeURIComponent(selectedTicket.id)}`;
      await navigator.clipboard.writeText(url.toString());
      showToast("Ticket link copied");
    } catch {
      showToast("Could not copy the ticket link. Please try again.");
    }
  }

  async function copyTicketId() {
    if (!selectedTicket) return;
    try {
      await navigator.clipboard.writeText(selectedTicket.id);
      showToast("Ticket ID copied");
    } catch {
      showToast("Could not copy the ticket ID. Please try again.");
    }
  }

  useEffect(() => {
    setDescEditing(false);
    setActionsOpen(false);
  }, [selected?.id]);
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
      tokenSeries: [],
      tokenTotal: 0,
      tokenChange: "+0.0%",
      resources: [],
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
      comments: [...selectedTicket.comments, { author: "you", body: commentDraft.trim(), time: "Just now" }],
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
      <Toaster />

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
      {selectedTicket && selected && (() => {
        const isFav = favorites.has(selectedTicket.id);
        const toggleFav = () => {
          setFavorites((prev) => {
            const next = new Set(prev);
            if (next.has(selectedTicket.id)) {
              next.delete(selectedTicket.id);
            } else {
              next.add(selectedTicket.id);
            }
            return next;
          });
        };
        const base =
          "relative flex size-9 shrink-0 items-center justify-center rounded-2lg border border-border-button-default bg-background-primary-default text-foreground-icon-primary shadow-xs transition-colors hover:border-border-button-hover hover:bg-background-primary-hover";
        const sharedSelectTrigger =
          "w-auto min-w-0 justify-start rounded-md border-0 bg-transparent p-1 text-body-medium text-text-primary shadow-none [&>svg]:hidden";
        const selectPopover = "z-[120] w-[220px] rounded-[14px] p-1";
        return (
        <ModalOverlay isOpen isDismissable onOpenChange={(open) => { if (!open) setSelected(null); }} className="fixed inset-0 z-100 flex items-stretch justify-end overflow-hidden p-3 max-sm:p-2">
          <Modal className="h-full w-full max-w-[609px] outline-none">
            <Dialog aria-label={`${selectedTicket.id} ticket details`} className="flex h-full min-h-0 flex-col overflow-hidden rounded-3xl bg-ticket-detail-surface outline-none">
              <header className="flex shrink-0 items-center justify-between gap-3 px-6 pt-6 pb-5 max-sm:px-4 max-sm:pt-4">
                <div className="flex min-w-0 flex-wrap items-center gap-1.5 text-body-2-medium text-text-secondary">
                  <span className="shrink-0">BoardUI Design Tasks</span>
                  <RiArrowRightSLine className="size-[15px] shrink-0 rtl:rotate-180" aria-hidden />
                  <span className="shrink-0">{selectedTicket.id}</span>
                  <RiArrowRightSLine className="size-[15px] shrink-0 rtl:rotate-180" aria-hidden />
                  <span className="truncate">{selectedTicket.title}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <TooltipTrigger delay={200}>
                    <IconButton
                      icon={FavoriteStarIcon}
                      size="small"
                      className={cx(base, "[&>svg]:size-[17px]", isFav && "text-ticket-detail-favorite [&_path]:fill-current")}
                      aria-label={isFav ? "Remove from favorites" : "Add to favorites"}
                      aria-pressed={isFav}
                      onClick={toggleFav}
                    />
                    <Tooltip placement="bottom" className="z-[120]">{isFav ? "Remove from favorites" : "Add to favorites"}</Tooltip>
                  </TooltipTrigger>
                  <TooltipTrigger delay={200}>
                    <IconButton
                      icon={CopyLinkIcon}
                      size="small"
                      className={cx(base, "group")}
                      data-copied={toastMessage === "Ticket link copied"}
                      aria-label="Copy ticket link"
                      onClick={copyTicketLink}
                    />
                    <Tooltip placement="bottom" className="z-[120]">{toastMessage === "Ticket link copied" ? "Ticket link copied" : "Copy ticket link"}</Tooltip>
                  </TooltipTrigger>
                  <Dropdown isOpen={actionsOpen} onOpenChange={setActionsOpen}>
                    <DropdownTrigger aria-label="Ticket actions" className={cx(base, "flex items-center justify-center border border-border-button-default bg-background-primary-default shadow-xs hover:bg-background-primary-hover")}>
                      <RiMore2Fill className="size-[18px]" aria-hidden />
                    </DropdownTrigger>
                    <DropdownPopover aria-label="Ticket actions" className="z-[120] w-[220px] rounded-[14px] p-1" placement="bottom end">
                      <DropdownItem className="px-2 py-1.5" onSelect={() => { setDescDraft(selectedTicket.description); setDescEditing(true); setActionsOpen(false); }}>
                        <RiEditLine className="size-[18px] shrink-0 text-foreground-icon-secondary" aria-hidden />
                        <span className="truncate text-body-medium whitespace-nowrap">Edit description</span>
                      </DropdownItem>
                      <DropdownItem className="px-2 py-1.5" onSelect={copyTicketId}>
                        <RiFileCopyLine className="size-[18px] shrink-0 text-foreground-icon-secondary" aria-hidden />
                        <span className="truncate text-body-medium whitespace-nowrap">{toastMessage === "Ticket ID copied" ? "Ticket ID copied" : "Copy ticket ID"}</span>
                      </DropdownItem>
                      <DropdownItem className="px-2 py-1.5" onSelect={() => { setActionsOpen(false); moveTicket(selectedTicket.id, selected.column, selected.column === "done" ? "todo" : "done"); }}>
                        {selected.column === "done" ? <RiRestartLine className="size-[18px] shrink-0 text-foreground-icon-secondary" aria-hidden /> : <RiCheckboxCircleLine className="size-[18px] shrink-0 text-foreground-icon-secondary" aria-hidden />}
                        <span className="truncate text-body-medium whitespace-nowrap">{selected.column === "done" ? "Reopen ticket" : "Mark as done"}</span>
                      </DropdownItem>
                    </DropdownPopover>
                  </Dropdown>
                  <CloseButton size="sm" className="self-start" aria-label="Close ticket details" onClick={() => setSelected(null)} />
                </div>
                <span className="sr-only" role="status">{toastMessage}</span>
              </header>

              <div className="relative min-h-0 flex-1">
                <div
                  role="region"
                  aria-label="Ticket content"
                  tabIndex={0}
                  onScroll={(e) => setScrollFade(Math.min(1, Math.max(0, e.currentTarget.scrollTop / 24)))}
                  className="h-full min-h-0 overflow-y-auto overscroll-contain outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-border-focus-ring"
                >
                  <div className="flex min-h-full flex-col">
                    <div className="flex flex-col gap-5 px-6 max-sm:px-4">
                      <section className="flex flex-col gap-3" aria-label="Description">
                        <div className="flex items-center gap-[13px] text-body-medium">
                          <span className="text-text-secondary">Created by</span>
                          <span className="flex items-center gap-1.5 text-text-primary">
                            <Avatar size="xs" color={PEOPLE["Maya Chen"].color} initials={PEOPLE["Maya Chen"].initials} src={PEOPLE["Maya Chen"].photo} alt="Maya Chen" className="size-[18px]" />
                            Maya Chen
                          </span>
                        </div>
                        <div className="flex flex-col gap-1.5">
                          <Heading slot="title" className="text-headline-medium text-text-primary wrap-anywhere">{selectedTicket.title}</Heading>
                          {descEditing ? (
                            <form
                              className="flex flex-col gap-3"
                              onSubmit={(e) => {
                                e.preventDefault();
                                if (descDraft.trim()) {
                                  updateTicket(selected.column, selectedTicket.id, { description: descDraft.trim() });
                                  setDescEditing(false);
                                }
                              }}
                            >
                              <Textarea aria-label="Ticket description" value={descDraft} onChange={setDescDraft} rows={4} maxLength={5000} autoFocus />
                              <div className="flex justify-end gap-2">
                                <Button variant="secondary" size="small" onClick={() => setDescEditing(false)}>Cancel</Button>
                                <Button type="submit" size="small" disabled={!descDraft.trim()}>Save description</Button>
                              </div>
                            </form>
                          ) : (
                            <p className="whitespace-pre-wrap text-body-regular text-text-secondary wrap-anywhere">{selectedTicket.description}</p>
                          )}
                        </div>
                      </section>

                      <div role="group" aria-label="Ticket properties" className="flex items-start gap-5 max-sm:flex-col max-sm:gap-2">
                        <span className="w-[70px] shrink-0 pt-0.5 text-body-medium text-text-secondary">Properties</span>
                        <div className="flex min-w-0 flex-wrap items-center gap-x-5 gap-y-3">
                          <Select
                            aria-label="Ticket status"
                            size="sm"
                            className="-m-1"
                            popoverClassName={selectPopover}
                            selectedKey={selected.column}
                            onSelectionChange={(k) => moveTicket(selectedTicket.id, selected.column, String(k) as ColumnId)}
                            triggerClassName={cx(sharedSelectTrigger, "hover:bg-background-primary-hover")}
                            renderValue={
                              <span className="flex items-center gap-1.5">
                                <StatusIcon status={selected.column} />
                                {COLUMNS.find((c) => c.id === selected.column)?.name}
                              </span>
                            }
                          >
                            {COLUMNS.map((c) => (
                              <SelectItem key={c.id} id={c.id} textValue={c.name} className="px-2 py-1.5 text-body-medium">
                                <span className="flex items-center gap-1.5">
                                  <StatusIcon status={c.id} />
                                  {c.name}
                                </span>
                              </SelectItem>
                            ))}
                          </Select>
                          <Select
                            aria-label="Ticket priority"
                            size="sm"
                            className="-m-1"
                            popoverClassName={selectPopover}
                            selectedKey={selectedTicket.priority}
                            onSelectionChange={(k) => updateTicket(selected.column, selectedTicket.id, { priority: String(k) as Priority })}
                            triggerClassName={cx(sharedSelectTrigger, "hover:bg-transparent")}
                            renderValue={
                              <Chip
                                color={PRIORITY_CHIP_COLOR[selectedTicket.priority]}
                                className={cx(
                                  "px-[7px] py-0.5 text-body-medium transition-colors duration-150",
                                  PRIORITY_CHIP_HOVER[selectedTicket.priority],
                                  selectedTicket.priority === "Low" && "bg-ticket-detail-low-background text-ticket-detail-low-text",
                                )}
                              >
                                {selectedTicket.priority}
                              </Chip>
                            }
                          >
                            {(["Low", "Medium", "High", "Urgent"] as Priority[]).map((p) => (
                              <SelectItem key={p} id={p} textValue={p} className="px-2 py-1.5 text-body-medium">{p}</SelectItem>
                            ))}
                          </Select>
                          <Dropdown>
                            <DropdownTrigger aria-label="Edit assignees" className="-m-1 flex items-center gap-1.5 rounded-md p-1 text-body-medium text-text-primary hover:bg-background-primary-hover">
                              {selectedTicket.assignees.length > 0 ? (
                                <>
                                  <span className="flex items-center -space-x-1.5">
                                    {selectedTicket.assignees.slice(0, 3).map((name) => {
                                      const person = PEOPLE[name];
                                      return person ? (
                                        <Avatar key={name} size="xs" color={person.color} initials={person.initials} src={person.photo} alt={name} className="size-[18px] ring-2 ring-ticket-detail-surface" />
                                      ) : null;
                                    })}
                                  </span>
                                  <span>{selectedTicket.assignees[0]}{selectedTicket.assignees.length > 1 ? ` +${selectedTicket.assignees.length - 1}` : ""}</span>
                                </>
                              ) : (
                                <>
                                  <RiUserLine className="size-[18px] text-foreground-icon-tertiary" aria-hidden />
                                  <span className="text-text-tertiary">Assignee</span>
                                </>
                              )}
                            </DropdownTrigger>
                            <DropdownPopover aria-label="Ticket assignees" className="z-[120] w-[220px] rounded-[14px] p-1" placement="bottom end">
                              {Object.keys(PEOPLE).map((name) => (
                                <Checkbox
                                  key={name}
                                  isSelected={selectedTicket.assignees.includes(name)}
                                  onChange={(checked) =>
                                    updateTicket(selected.column, selectedTicket.id, {
                                      assignees: checked ? [...selectedTicket.assignees, name] : selectedTicket.assignees.filter((n) => n !== name),
                                    })
                                  }
                                  className="rounded-2lg px-2 py-1.5 hover:bg-background-secondary-hover"
                                >
                                  <span className="flex items-center gap-2">
                                    <Avatar size="xs" color={PEOPLE[name].color} initials={PEOPLE[name].initials} src={PEOPLE[name].photo} alt={name} className="size-[18px]" />
                                    {name}
                                  </span>
                                </Checkbox>
                              ))}
                            </DropdownPopover>
                          </Dropdown>
                          <Select
                            aria-label="Ticket project"
                            size="sm"
                            className="-m-1"
                            popoverClassName={selectPopover}
                            selectedKey={selectedTicket.app}
                            onSelectionChange={(k) => updateTicket(selected.column, selectedTicket.id, { app: String(k) as AppName })}
                            triggerClassName={cx(sharedSelectTrigger, "hover:bg-background-primary-hover")}
                            renderValue={
                              <span className="flex items-center gap-1.5">
                                <RiFolder6Line className="size-[18px] text-foreground-icon-secondary" aria-hidden />
                                {selectedTicket.app}
                              </span>
                            }
                          >
                            {(["vibl", "firstview", "BoardUI"] as AppName[]).map((a) => (
                              <SelectItem key={a} id={a} textValue={a} className="px-2 py-1.5 text-body-medium">{a}</SelectItem>
                            ))}
                          </Select>
                        </div>
                      </div>

                      <div className="flex items-start gap-5 max-sm:flex-col max-sm:gap-2" aria-label="Resources">
                        <span className="w-[71px] shrink-0 pt-0.5 text-body-medium text-text-secondary">Resources</span>
                        <div className="flex flex-wrap gap-2">
                          {selectedTicket.resources.map((r) => (
                            <a key={r.href} href={r.href} target="_blank" rel="noreferrer" className="rounded-md outline-none focus-visible:ring-2 focus-visible:ring-border-focus-ring">
                              <Chip className="bg-ticket-detail-resource-background px-[7px] py-0.5 text-body-medium text-ticket-detail-resource-text">{r.label}</Chip>
                            </a>
                          ))}
                        </div>
                      </div>

                      <TokensChartCard title="Tokens burned" series={selectedTicket.tokenSeries} total={selectedTicket.tokenTotal} change={selectedTicket.tokenChange} startLabel="Sep 1" endLabel="Sep 16" plotHeight={190} />
                    </div>

                    <section aria-label="Comments" className="mt-auto flex flex-col gap-2.5 px-3 pb-3">
                      <div className="flex flex-col" aria-live="polite">
                        {selectedTicket.comments.map((comment, i) => {
                          const person = PEOPLE[comment.author];
                          const isYou = comment.author === "you";
                          return (
                            <article key={`${comment.author}-${i}`} className="relative flex flex-col gap-[3px] rounded-2xl p-3 after:pointer-events-none after:absolute after:top-9 after:-bottom-3 after:start-[23.5px] after:w-px after:bg-border-button-default last:after:hidden">
                              <div className="flex min-w-0 items-center gap-2">
                                <Avatar
                                  size="xs"
                                  color={isYou ? "neutral" : (person?.color ?? "neutral")}
                                  initials={isYou ? "ME" : (person?.initials ?? comment.author.slice(0, 2))}
                                  src={isYou ? undefined : person?.photo}
                                  alt={isYou ? "You" : comment.author}
                                  className="size-6"
                                />
                                <div className="flex min-w-0 flex-wrap items-center gap-x-2">
                                  <span className="truncate text-body-medium text-text-primary">{isYou ? "You" : comment.author}</span>
                                  <span className="shrink-0 text-body-2-medium text-text-tertiary">{comment.time}</span>
                                </div>
                              </div>
                              <p className="ps-[29px] whitespace-pre-wrap text-body-medium text-text-secondary wrap-anywhere">{comment.body}</p>
                            </article>
                          );
                        })}
                        <form className="relative" onSubmit={(e) => { e.preventDefault(); postComment(); }}>
                          <Textarea
                            aria-label="Add a comment"
                            placeholder="Enter your comment"
                            value={commentDraft}
                            onChange={setCommentDraft}
                            rows={1}
                            maxLength={2000}
                            resize="none"
                            fieldClassName="h-[72px] rounded-xl bg-background-secondary-default pt-3 pb-10"
                          />
                          <Button type="submit" aria-label="Post comment" size="small" disabled={!commentDraft.trim()} className="absolute end-2 bottom-2 size-6 rounded-full p-0">
                            <RiArrowUpLine className="size-[13.333px]" aria-hidden />
                          </Button>
                        </form>
                      </div>
                    </section>
                  </div>
                </div>
                <div aria-hidden className="pointer-events-none absolute inset-x-0 top-0 z-10 h-6">
                  <div className="absolute inset-0 backdrop-blur-[1px] [mask-image:linear-gradient(to_bottom,black,transparent)]" style={{ opacity: scrollFade }} />
                  <div className="absolute inset-x-0 top-0 h-4 backdrop-blur-[4px] [mask-image:linear-gradient(to_bottom,black,transparent)]" style={{ opacity: scrollFade }} />
                  <div className="absolute inset-0 bg-linear-to-b from-ticket-detail-surface to-transparent" style={{ opacity: scrollFade }} />
                </div>
              </div>
            </Dialog>
          </Modal>
        </ModalOverlay>
        );
      })()}

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
