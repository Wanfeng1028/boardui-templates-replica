"use client";

import {
  RiAddLine,
  RiArrowDownSLine,
  RiArrowGoBackLine,
  RiArrowUpLine,
  RiBracesLine,
  RiCloseLine,
  RiCodeSSlashLine,
  RiExpandDiagonalLine,
  RiFileCopyLine,
  RiGlobalLine,
  RiHeadphoneLine,
  RiExpandUpDownLine,
  RiFolderLine,
  RiFolderOpenLine,
  RiGitBranchLine,
  RiLayoutGridLine,
  RiMenuLine,
  RiMicLine,
  RiMore2Fill,
  RiInfinityLine,
  RiRobotLine,
  RiSearchLine,
  RiSettingsLine,
  RiShareLine,
  RiShuffleLine,
  RiSideBarLine,
  RiTerminalBoxLine,
} from "@remixicon/react";
import { useCallback, useEffect, useRef, useState, type ReactNode } from "react";

import { AllTemplatesButton } from "@/components/application/template-switcher/all-templates-button";
import { DocumentTitle } from "@/components/application/app-shell/document-title";
import { ComposerLoader } from "@/components/application/composer-loader/composer-loader";
import { ThemeToggle } from "@/components/application/theme/theme-toggle";
import { IconButton } from "@/components/base/buttons/icon-button";
import { cx } from "@/utils/cx";

/**
 * AI Chat template replica.
 * Official: boardui.com/templates/ai-chat — Agentic chat, "vibl coding
 * project / coding scenario" thread, Fable 5 / Main / project-sea, Code /
 * Changes / Browser panel, 12 uncommitted changes (+156/−23), 57% ring.
 *
 * Source of truth: tpl-pages/ai-chat.html (BoardUI SSR snapshot).
 * The snapshot freezes the page mid-generation at 57%: exactly one user
 * message, no assistant reply, no thinking indicator. Anything the snapshot
 * does not show (avatar menu items, attachment menu items, model options,
 * Main / project-sea / Agent dropdown contents, More options, Browser tab,
 * Quick Search panel) is marked "待实测确认" in audit/ai-chat-gaps.md and
 * is NOT invented here: dropdowns that have no verified content show only
 * the verified value plus a disabled "待实测确认" row.
 *
 * The sidebar is the original agent sidebar (New agent / Automations /
 * Customize + Repositories with 4 collapsible groups + 11 threads), NOT the
 * all-templates navigation. Template switching is kept only as the
 * "全部模板" button in the top bar and the first row of the sidebar, as
 * requested. Sidebar / composer / status row / code panel are all local to
 * this file on purpose: the shared DashboardSidebar / AgentComposer carry
 * the wrong nav and the wrong composer behaviour for this template, and
 * shared components must not be edited by this task.
 */

// Fixed anchor so server and client render the same relative times.
const NOW = 1794015600000;

type ChatMsg = { id: string; role: "user"; text: string; at: number };

type ThreadItem = { id: string; title: string; badge: string; messages: ChatMsg[] };
type RepoGroup = { name: string; open: boolean; threads: ThreadItem[] };

const USER_MESSAGE =
  "update our color tokens for dark mode and add a reusable theme toggle to the registry. run lint and a production build when you're done.";

const REPOS: RepoGroup[] = [
  {
    name: "boardui",
    open: false,
    threads: [
      { id: "boardui-pro", title: "pro badge restyle", badge: "2h", messages: [] },
      { id: "installation-docs", title: "installation docs page", badge: "1d", messages: [] },
    ],
  },
  {
    name: "vibl coding project",
    open: true,
    threads: [
      { id: "vibl-landing", title: "landing page design", badge: "34m", messages: [] },
      { id: "image-generation", title: "image generation", badge: "now", messages: [] },
      {
        id: "coding-scenario",
        title: "coding scenario",
        badge: "now",
        messages: [{ id: "m-user-1", role: "user", text: USER_MESSAGE, at: NOW - 1000 * 60 * 4 }],
      },
      { id: "mobile-vue", title: "mobile app for vuejs...", badge: "5h", messages: [] },
      { id: "code-refactor", title: "code refactor dropdo...", badge: "18h", messages: [] },
    ],
  },
  {
    name: "strider landing page work",
    open: false,
    threads: [
      { id: "strider-hero", title: "hero section animation", badge: "3d", messages: [] },
      { id: "pricing-copy", title: "pricing table copy", badge: "4d", messages: [] },
    ],
  },
  {
    name: "pirate mini game iOS",
    open: false,
    threads: [
      { id: "pirate-game", title: "cannon physics tuning", badge: "1w", messages: [] },
      { id: "sprite-cleanup", title: "sprite sheet cleanup", badge: "2w", messages: [] },
    ],
  },
];

const ALL_THREADS = REPOS.flatMap((r) => r.threads.map((t) => ({ ...t, repo: r.name })));

// 44 lines of HomeDashboardDetail source, verbatim from the original SSR
// snapshot (tpl-pages/ai-chat.html, token-line 1–44; the snapshot renders
// the same block twice for mobile/desktop).
const CODE_LINES = [
  'import type { Metadata } from "next";',
  'import Link from "next/link";',
  'import { ComponentDetail } from "@/components/application/docs/component-detail";',
  'import { DashboardShell } from "@/components/application/dashboard/dashboard-shell";',
  '',
  'export const metadata: Metadata = {',
  '  title: "Home Dashboard Template — React + Tailwind (Pro)",',
  '  description:',
  '    "Full admin dashboard template for React + Tailwind CSS — sidebar navigation, KPI cards, bar chart, and a customers data table. A BoardUI Pro template.",',
  '};',
  '',
  'const PREVIEW_CODE = `import { DashboardShell } from "@/components/application/dashboard/dashboard-shell";',
  '',
  'export default function DashboardPage() {',
  '  // Full screen: floating sidebar, header, KPI cards,',
  '  // earnings bar chart, and the customers data table.',
  '  return <DashboardShell />;',
  '}`;',
  '',
  'export default function HomeDashboardDetail() {',
  '  return (',
  '    <ComponentDetail',
  '      wide',
  '      breadcrumb={[' ,
  '        { label: "Board UI", href: "/" },',
  '        { label: "Components", href: "/components" },',
  '        { label: "Home Dashboard" },',
  '      ]}',
  '      title="Home Dashboard"',
  '      description="A complete admin dashboard screen — floating sidebar navigation, header with search and notifications, KPI stat cards, an earnings bar chart, and a customers data table."',
  '      preview={',
  '        <div className="h-[760px] w-full overflow-hidden rounded-2xl border border-border-button-default">',
  '          <div className="origin-top-left scale-[0.8] [width:125%]">',
  '            <DashboardShell />',
  '          </div>',
  '        </div>',
  '      }',
  '      previewClassName="p-3 sm:p-4"',
  '      previewCode={PREVIEW_CODE}',
  '      sections={[' ,
  '        {',
  '          id: "full-template",',
  '          title: "Live template",',
  '          body: (',
];

// Lines 14–17 sit inside the PREVIEW_CODE template literal in the original
// (all string-coloured); line 12 opens it, line 18 closes it.
const TEMPLATE_STRING_LINES = new Set([14, 15, 16, 17]);

const TOKEN_RE =
  /(\/\/.*$)|("(?:[^"\\]|\\.)*"|'(?:[^'\\]|\\.)*')|\b(import|type|export|const|function|return|default|from)\b|\b(PREVIEW_CODE)\b|\b([A-Z][A-Za-z0-9]*)\b/g;

function highlightLine(line: string, lineNo: number): ReactNode {
  if (line === "") return "\u00a0";
  if (TEMPLATE_STRING_LINES.has(lineNo)) {
    return <span style={{ color: "var(--color-neutral-500)" }}>{line}</span>;
  }
  if (lineNo === 12) {
    const tick = line.indexOf("`");
    return (
      <>
        {highlightTokens(line.slice(0, tick))}
        <span style={{ color: "var(--color-neutral-500)" }}>{line.slice(tick)}</span>
      </>
    );
  }
  if (lineNo === 18) {
    return <span style={{ color: "var(--color-neutral-500)" }}>{line}</span>;
  }
  return highlightTokens(line);
}

function highlightTokens(line: string): ReactNode {
  const out: ReactNode[] = [];
  let last = 0;
  let key = 0;
  for (const m of line.matchAll(TOKEN_RE)) {
    const idx = m.index ?? 0;
    if (idx > last) out.push(line.slice(last, idx));
    const [tok, comment, str, keyword, constant, klass] = m;
    if (comment || str) {
      out.push(
        <span key={key++} style={{ color: "var(--color-neutral-500)" }}>
          {tok}
        </span>,
      );
    } else if (keyword) {
      out.push(
        <span key={key++} style={{ color: "#7ccf00" }}>
          {tok}
        </span>,
      );
    } else if (constant) {
      out.push(
        <span key={key++} style={{ color: "#2b7fff" }}>
          {tok}
        </span>,
      );
    } else if (klass) {
      out.push(
        <span key={key++} style={{ color: "#00bc7d" }}>
          {tok}
        </span>,
      );
    } else {
      out.push(tok);
    }
    last = idx + tok.length;
  }
  if (last < line.length) out.push(line.slice(last));
  return <>{out}</>;
}

export default function AiChatTemplatePage() {
  const [navOpen, setNavOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [repos, setRepos] = useState<RepoGroup[]>(REPOS);
  const [activeId, setActiveId] = useState("coding-scenario");
  const [messages, setMessages] = useState<ChatMsg[]>(REPOS[1].threads[2].messages);
  const [input, setInput] = useState("");
  const [busy, setBusy] = useState(false);
  const [model, setModel] = useState("Fable 5");
  const [project, setProject] = useState("project-sea");
  const [voiceOn, setVoiceOn] = useState(false);
  const [files, setFiles] = useState<string[]>([]);
  const [moreMenuOpen, setMoreMenuOpen] = useState(false);
  const [panelOpen, setPanelOpen] = useState(false);
  // Wide screens open with the code panel visible, like the original;
  // narrow screens start with the chat full-width and the panel as a drawer.
  useEffect(() => {
    if (window.innerWidth >= 1280) setPanelOpen(true);
  }, []);
  const [panelWidth, setPanelWidth] = useState(410);
  const [panelExpanded, setPanelExpanded] = useState(false);
  const [terminalOpen, setTerminalOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const busyTimer = useRef<number | undefined>(undefined);

  useEffect(() => () => window.clearTimeout(busyTimer.current), []);

  const activeThread =
    ALL_THREADS.find((t) => t.id === activeId) ?? ALL_THREADS[2];

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, busy, terminalOpen]);

  const toggleRepo = useCallback((name: string) => {
    setRepos((prev) => prev.map((r) => (r.name === name ? { ...r, open: !r.open } : r)));
  }, []);

  const selectThread = useCallback(
    (id: string) => {
      if (busy) return;
      const thread = ALL_THREADS.find((t) => t.id === id);
      if (!thread) return;
      setActiveId(id);
      setMessages(thread.messages);
      setNavOpen(false);
    },
    [busy],
  );

  const submit = useCallback(
    (text: string) => {
      const trimmed = text.trim();
      if (!trimmed || busy) return;
      // The original snapshot freezes at 57% with no assistant reply, so a
      // submitted prompt only adds the user bubble and runs the composer
      // loader; no canned assistant reply is invented.
      setMessages((prev) => [...prev, { id: `u-${Date.now()}`, role: "user", text: trimmed, at: Date.now() }]);
      setInput("");
      setBusy(true);
      window.clearTimeout(busyTimer.current);
      busyTimer.current = window.setTimeout(() => setBusy(false), 1400);
    },
    [busy],
  );

  const stopGenerating = useCallback(() => {
    window.clearTimeout(busyTimer.current);
    setBusy(false);
  }, []);

  const shareChat = useCallback(() => {
    const transcript = messages.map((m) => `You: ${m.text}`).join("\n\n");
    const done = () => {
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    };
    if (navigator.clipboard?.writeText) {
      navigator.clipboard.writeText(transcript).then(done).catch(done);
    } else {
      done();
    }
  }, [messages]);

  const sidebarProps = {
    repos,
    activeId,
    onToggleRepo: toggleRepo,
    onSelectThread: selectThread,
    collapsed: sidebarCollapsed,
    onToggleCollapse: () => setSidebarCollapsed((c) => !c),
  };

  return (
    <div className="relative flex h-dvh w-full gap-4 overflow-hidden bg-background-full p-3">
      <DocumentTitle />
      <style>{`@keyframes agent-msg-in{from{opacity:0;filter:blur(6px);transform:translateY(6px)}to{opacity:1;filter:blur(0);transform:translateY(0)}}@keyframes agent-drawer-in{from{transform:translateX(110%)}to{transform:translateX(0)}}`}</style>
      <div className="hidden xl:flex">
        <AgentSidebar {...sidebarProps} />
      </div>

      {navOpen && (
        <div className="fixed inset-0 z-50 flex xl:hidden">
          <button type="button" aria-label="Close navigation" onClick={() => setNavOpen(false)} className="absolute inset-0 cursor-pointer bg-black/40" />
          <div className="relative flex h-full p-3">
            <AgentSidebar {...sidebarProps} mobile onClose={() => setNavOpen(false)} />
          </div>
        </div>
      )}

      <div className="relative flex min-h-0 min-w-0 flex-1 gap-3 overflow-hidden">
        {/* Chat surface */}
        <div className="relative flex h-full min-w-0 flex-1 flex-col overflow-hidden rounded-3xl bg-background-secondary-default">
          {/* Mobile top bar (original: xl:hidden) */}
          <header className="flex h-12 shrink-0 items-center gap-2 px-3 pt-[11px] xl:hidden">
            <IconButton icon={navOpen ? RiCloseLine : RiMenuLine} size="small" aria-label="Open navigation" onClick={() => setNavOpen((o) => !o)} />
            <span className="truncate text-headline-medium text-text-primary">Agentic chat</span>
            <div className="ms-auto flex shrink-0 items-center gap-1">
              <AllTemplatesButton size="small" />
              <IconButton icon={RiCodeSSlashLine} size="small" aria-label="Open code" onClick={() => setPanelOpen(true)} />
            </div>
          </header>

          {/* Desktop breadcrumb header (original: px-4 pt-4, no border) */}
          <header className="hidden shrink-0 items-center gap-2 px-4 pt-4 xl:flex">
            <nav aria-label="Chat location" className="flex min-w-0 items-center gap-1">
              <button type="button" className="flex min-w-0 cursor-pointer items-center gap-1.5 rounded-lg px-1 py-0.5 text-body-medium text-text-secondary hover:bg-background-secondary-hover">
                <RiFolderLine className="size-4 shrink-0 text-foreground-icon-secondary" aria-hidden />
                <span className="truncate">vibl coding project</span>
              </button>
              <RiArrowDownSLine className="size-4 shrink-0 -rotate-90 text-foreground-icon-tertiary" aria-hidden />
              <span aria-current="page" className="truncate text-body-medium text-text-primary">{activeThread.title}</span>
            </nav>
            <div className="ms-auto flex shrink-0 items-center gap-1">
              <AllTemplatesButton size="small" />
              <IconButton icon={RiShareLine} size="small" aria-label="Share chat" onClick={shareChat} />
              <div className="relative">
                <IconButton icon={RiMore2Fill} size="small" aria-label="More options" onClick={() => setMoreMenuOpen((o) => !o)} />
                {moreMenuOpen && (
                  <>
                    <button type="button" aria-label="Close menu" onClick={() => setMoreMenuOpen(false)} className="fixed inset-0 z-10 cursor-default" />
                    <div className="absolute end-0 top-9 z-20 w-56 rounded-xl border border-border-button-default bg-background-primary-default p-1.5 shadow-card">
                      <button type="button" onClick={() => { setMoreMenuOpen(false); shareChat(); }} className="flex w-full cursor-pointer items-center gap-2 rounded-lg px-2 py-1.5 text-start text-body-medium text-text-primary hover:bg-background-secondary-hover">
                        <RiFileCopyLine className="size-4 shrink-0" aria-hidden /> Copy chat transcript
                      </button>
                      <p className="px-2 py-1.5 text-body-2-regular text-text-tertiary">更多选项待实测确认</p>
                    </div>
                  </>
                )}
              </div>
            </div>
          </header>
          {copied && (
            <p role="status" className="shrink-0 px-4 pt-2 text-body-2-medium text-text-secondary">Chat copied to clipboard.</p>
          )}

          <div ref={scrollRef} className="min-h-0 flex-1 overflow-y-auto [scrollbar-width:thin]">
            <div className="flex min-h-full flex-col justify-end gap-5 px-4 pt-4 pb-6">
              {messages.map((message) => (
                <p
                  key={message.id}
                  className="ms-auto w-fit max-w-[calc(50%+6px)] rounded-2xl bg-background-primary-default px-3 py-[11px] text-start text-body-regular break-words whitespace-pre-wrap text-text-primary shadow-card"
                  style={{ animation: "agent-msg-in 0.45s ease-out both" }}
                >
                  {message.text}
                </p>
              ))}
            </div>
          </div>

          {terminalOpen && (
            <div className="mx-3 mb-2 shrink-0 overflow-hidden rounded-xl border border-border-button-default bg-background-primary-default">
              <div className="flex items-center justify-between border-b border-separator-border px-3 py-1.5">
                <span className="flex items-center gap-1.5 text-body-2-medium text-text-secondary"><RiTerminalBoxLine className="size-4" aria-hidden /> Terminal</span>
                <button type="button" aria-label="Close terminal" onClick={() => setTerminalOpen(false)} className="cursor-pointer text-text-tertiary hover:text-text-primary"><RiCloseLine className="size-4" aria-hidden /></button>
              </div>
              <p className="px-3 py-2 text-body-2-regular text-text-tertiary">终端内容待实测确认</p>
            </div>
          )}

          <div className="shrink-0 px-2.5 pt-3 pb-2.5">
            <LocalComposer
              value={input}
              onValueChange={setInput}
              onSubmit={() => submit(input)}
              onStop={stopGenerating}
              busy={busy}
              model={model}
              onModelChange={setModel}
              project={project}
              onProjectChange={setProject}
              voiceOn={voiceOn}
              onVoiceToggle={() => setVoiceOn((v) => !v)}
              files={files}
              onFiles={(names) => setFiles((prev) => [...prev, ...names])}
              onRemoveFile={(name) => setFiles((prev) => prev.filter((f) => f !== name))}
              inputRef={inputRef}
            />
          </div>
        </div>

        {/* Code panel */}
        {panelOpen && (
          <CodePanel
            width={panelWidth}
            expanded={panelExpanded}
            onExpand={() => {
              setPanelExpanded((e) => !e);
              setPanelWidth((w) => (w >= 640 ? 410 : 640));
            }}
            onToggle={() => setPanelOpen(false)}
            onClose={() => setPanelOpen(false)}
            onResize={(w) => { setPanelExpanded(false); setPanelWidth(w); }}
            terminalOpen={terminalOpen}
            onTerminal={() => setTerminalOpen((o) => !o)}
          />
        )}
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Agent sidebar (original) + template-switcher entry (kept)           */
/* ------------------------------------------------------------------ */

function AgentSidebar({
  repos,
  activeId,
  onToggleRepo,
  onSelectThread,
  collapsed,
  onToggleCollapse,
  mobile = false,
  onClose,
}: {
  repos: RepoGroup[];
  activeId: string;
  onToggleRepo: (name: string) => void;
  onSelectThread: (id: string) => void;
  collapsed: boolean;
  onToggleCollapse: () => void;
  mobile?: boolean;
  onClose?: () => void;
}) {
  const [quickOpen, setQuickOpen] = useState(false);
  const [query, setQuery] = useState("");
  const hits = ALL_THREADS.filter((t) =>
    t.title.toLowerCase().includes(query.trim().toLowerCase()),
  );

  if (collapsed && !mobile) {
    return (
      <aside className="flex h-full w-16 shrink-0 flex-col items-center gap-1 overflow-hidden bg-background-full py-3" aria-label="Agent sidebar collapsed">
        <span className="inline-flex size-8 shrink-0 select-none items-center justify-center rounded-full bg-background-tertiary-default text-headline-semibold text-text-secondary">M</span>
        <button type="button" aria-label="Expand sidebar" onClick={onToggleCollapse} className="mt-2 flex size-9 cursor-pointer items-center justify-center rounded-full text-foreground-icon-secondary hover:bg-background-secondary-hover">
          <RiSideBarLine className="size-5" aria-hidden />
        </button>
        <button type="button" aria-label="Quick Search" onClick={() => setQuickOpen(true)} className="flex size-9 cursor-pointer items-center justify-center rounded-full bg-background-tertiary-default text-foreground-icon-secondary hover:bg-background-tertiary-hover/55">
          <RiSearchLine className="size-5" aria-hidden />
        </button>
        <a href="#" aria-label="New agent" className="flex size-9 items-center justify-center rounded-full text-foreground-icon-secondary hover:bg-background-secondary-hover"><RiAddLine className="size-5" aria-hidden /></a>
        <a href="#" aria-label="Automations" className="flex size-9 items-center justify-center rounded-full text-foreground-icon-secondary hover:bg-background-secondary-hover"><RiRobotLine className="size-5" aria-hidden /></a>
        <a href="#" aria-label="Customize" className="flex size-9 items-center justify-center rounded-full text-foreground-icon-secondary hover:bg-background-secondary-hover"><RiShuffleLine className="size-5" aria-hidden /></a>
        <span className="mt-auto inline-flex size-8 shrink-0 select-none items-center justify-center rounded-full bg-blue-300 text-[18px] font-medium text-blue-900">B</span>
        {quickOpen && (
          <QuickSearchOverlay query={query} onQuery={setQuery} hits={hits} onSelect={(id) => { setQuickOpen(false); onSelectThread(id); }} onClose={() => setQuickOpen(false)} />
        )}
      </aside>
    );
  }

  return (
    <aside className="flex h-full w-[260px] shrink-0 flex-col justify-between overflow-hidden bg-background-full p-3" aria-label="Agent sidebar">
      <div className="flex min-h-0 w-full flex-col gap-3">
        <div className="flex w-full flex-row items-center justify-between">
          <button type="button" aria-label="Mertcan Esmergul" aria-expanded="false" className="relative flex min-w-0 cursor-pointer items-center gap-2 rounded-full outline-none focus-visible:ring-2 focus-visible:ring-border-focus-ring">
            <span className="inline-flex size-8 shrink-0 select-none items-center justify-center overflow-hidden rounded-full bg-background-tertiary-default text-headline-semibold text-text-secondary">M</span>
            <span className="flex min-w-0 items-center gap-0.5">
              <span className="truncate text-body-medium whitespace-nowrap text-text-primary">Mertcan Esmergul</span>
              <RiExpandUpDownLine className="size-4 shrink-0 text-foreground-icon-tertiary" aria-hidden />
            </span>
          </button>
          {mobile ? (
            <button type="button" aria-label="Search" onClick={() => setQuickOpen(true)} className="flex size-9 cursor-pointer items-center justify-center rounded-full bg-background-tertiary-default text-foreground-icon-secondary transition-colors duration-150 hover:bg-background-tertiary-hover/55">
              <RiSearchLine className="size-5" aria-hidden />
            </button>
          ) : (
            <button type="button" aria-label="Collapse sidebar" onClick={onToggleCollapse} className="cursor-pointer text-foreground-icon-secondary">
              <RiSideBarLine className="size-5 -scale-x-100 rtl:scale-x-100" aria-hidden />
            </button>
          )}
        </div>

        {!mobile && (
          <button type="button" aria-label="Quick Search" onClick={() => setQuickOpen(true)} className="flex w-full cursor-pointer items-center gap-2 rounded-full bg-background-tertiary-default p-2 transition-colors duration-150 hover:bg-background-tertiary-hover/55">
            <span className="flex min-w-0 flex-1 items-center gap-2">
              <RiSearchLine className="size-5 shrink-0 text-foreground-icon-secondary" aria-hidden />
              <span className="truncate text-body-medium text-text-secondary">Quick Search</span>
            </span>
            <kbd className="shrink-0 rounded-md bg-background-primary-default px-1.5 py-0.5 text-caption-1-medium text-text-tertiary">⌘L</kbd>
          </button>
        )}

        <div className="flex min-h-0 flex-1 flex-col gap-6 overflow-y-auto [scrollbar-width:none]">
          <nav className="flex w-full shrink-0 flex-col gap-1">
            {/* Template-switcher entry, kept as requested (first row). */}
            <a href="/templates" className="flex w-full items-center gap-2 rounded-2lg p-2 transition-colors duration-150 ease hover:bg-background-secondary-hover">
              <RiLayoutGridLine className="size-5 shrink-0 text-foreground-icon-secondary" aria-hidden />
              <span className="text-body-medium whitespace-nowrap text-text-secondary">全部模板</span>
            </a>
            <a href="#" aria-label="New agent" className="flex w-full items-center gap-2 rounded-2lg p-2 transition-colors duration-150 ease hover:bg-background-secondary-hover">
              <RiAddLine className="size-5 shrink-0 text-foreground-icon-secondary" aria-hidden />
              <span className="text-body-medium whitespace-nowrap text-text-secondary">New agent</span>
            </a>
            <a href="#" aria-label="Automations" className="flex w-full items-center gap-2 rounded-2lg p-2 transition-colors duration-150 ease hover:bg-background-secondary-hover">
              <RiRobotLine className="size-5 shrink-0 text-foreground-icon-secondary" aria-hidden />
              <span className="text-body-medium whitespace-nowrap text-text-secondary">Automations</span>
            </a>
            <a href="#" aria-label="Customize" className="flex w-full items-center gap-2 rounded-2lg p-2 transition-colors duration-150 ease hover:bg-background-secondary-hover">
              <RiShuffleLine className="size-5 shrink-0 text-foreground-icon-secondary" aria-hidden />
              <span className="text-body-medium whitespace-nowrap text-text-secondary">Customize</span>
            </a>
          </nav>

          <div className="flex w-full flex-col gap-2.5">
            <span className="text-body-medium text-text-secondary">Repositories</span>
            <nav className="flex w-full flex-col gap-1">
              {repos.map((repo) => (
                <div key={repo.name} className="flex w-full flex-col">
                  <button type="button" aria-expanded={repo.open} onClick={() => onToggleRepo(repo.name)} className="flex w-full cursor-pointer items-center gap-2 rounded-2lg p-2 transition-colors duration-150 ease hover:bg-background-secondary-hover">
                    {repo.open ? (
                      <RiFolderOpenLine className="size-5 shrink-0 text-foreground-icon-secondary" aria-hidden />
                    ) : (
                      <RiFolderLine className="size-5 shrink-0 text-foreground-icon-secondary" aria-hidden />
                    )}
                    <span className="truncate text-body-medium whitespace-nowrap text-text-secondary">{repo.name}</span>
                  </button>
                  <div aria-hidden={!repo.open} className={cx("grid transition-[grid-template-rows,opacity] duration-300 ease-in-out", repo.open ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0")}>
                    <div className="overflow-hidden">
                      <div className="relative flex w-full flex-col gap-0.5 pt-0.5">
                        {repo.threads.map((thread) => (
                          <a
                            key={thread.id}
                            href="#"
                            onClick={(e) => { e.preventDefault(); onSelectThread(thread.id); if (onClose) onClose(); }}
                            aria-current={thread.id === activeId ? "page" : undefined}
                            tabIndex={repo.open ? 0 : -1}
                            className={cx(
                              "flex w-full items-center gap-2.5 rounded-2lg py-[5px] pe-2 ps-9 transition-colors duration-150 ease hover:bg-background-secondary-hover",
                              thread.id === activeId && "bg-background-secondary-hover",
                            )}
                          >
                            <span className="min-w-0 flex-1 truncate text-body-medium text-text-secondary">{thread.title}</span>
                            <span className="inline-flex shrink-0 items-center justify-center rounded-sm bg-background-tertiary-default px-1 py-px text-caption-1-medium whitespace-nowrap text-text-secondary">{thread.badge}</span>
                          </a>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </nav>
          </div>
        </div>
      </div>

      <div className="flex w-full flex-col gap-3 pt-3">
        <ThemeToggle appearance="sidebar-segmented" />
        <nav className="flex w-full flex-col gap-1">
          <a href="#" aria-label="Support" className="flex w-full items-center gap-2 rounded-2lg p-2 transition-colors duration-150 ease hover:bg-background-secondary-hover">
            <RiHeadphoneLine className="size-5 shrink-0 text-foreground-icon-secondary" aria-hidden />
            <span className="text-body-medium whitespace-nowrap text-text-secondary">Support</span>
          </a>
          <a href="#" aria-label="Settings" className="flex w-full items-center gap-2 rounded-2lg p-2 transition-colors duration-150 ease hover:bg-background-secondary-hover">
            <RiSettingsLine className="size-5 shrink-0 text-foreground-icon-secondary" aria-hidden />
            <span className="text-body-medium whitespace-nowrap text-text-secondary">Settings</span>
          </a>
        </nav>
        <div className="flex w-full items-center justify-between rounded-xl bg-background-secondary-default py-2 pe-3 ps-2.5">
          <span className="flex min-w-0 items-center gap-2">
            <span className="inline-flex size-8 shrink-0 select-none items-center justify-center overflow-hidden rounded-full bg-blue-300 text-[18.824px] leading-[22.588px] font-medium text-blue-900">B</span>
            <span className="flex min-w-0 flex-col items-start justify-center">
              <span className="truncate text-body-medium whitespace-nowrap text-text-primary">Board team</span>
              <span className="truncate text-body-regular whitespace-nowrap text-text-secondary">Pro Plan</span>
            </span>
          </span>
          <a href="#" className="inline-flex h-8 shrink-0 items-center justify-center rounded-lg border border-border-button-default bg-background-primary-default px-2 py-1.5 text-body-medium text-text-primary shadow-xs hover:bg-background-primary-hover">
            Upgrade
          </a>
        </div>
      </div>

      {quickOpen && (
        <QuickSearchOverlay query={query} onQuery={setQuery} hits={hits} onSelect={(id) => { setQuickOpen(false); onSelectThread(id); if (onClose) onClose(); }} onClose={() => setQuickOpen(false)} />
      )}
    </aside>
  );
}

function QuickSearchOverlay({
  query, onQuery, hits, onSelect, onClose,
}: {
  query: string;
  onQuery: (q: string) => void;
  hits: { id: string; title: string; badge: string; repo: string }[];
  onSelect: (id: string) => void;
  onClose: () => void;
}) {
  return (
    <div className="fixed inset-0 z-[70] flex items-start justify-center p-4 pt-[15vh]" role="dialog" aria-modal="true" aria-label="Quick Search">
      <button type="button" aria-label="Close search" onClick={onClose} className="absolute inset-0 cursor-pointer bg-black/40" />
      <div className="relative w-full max-w-lg overflow-hidden rounded-2xl border border-border-button-default bg-background-primary-default shadow-card">
        <div className="flex items-center gap-2 border-b border-separator-border px-3 py-2.5">
          <RiSearchLine className="size-5 shrink-0 text-foreground-icon-secondary" aria-hidden />
          <input
            autoFocus
            type="text"
            value={query}
            onChange={(e) => onQuery(e.target.value)}
            onKeyDown={(e) => { if (e.key === "Escape") onClose(); }}
            placeholder="Quick Search"
            aria-label="Quick Search"
            className="min-w-0 flex-1 bg-transparent text-body-regular text-text-primary outline-none placeholder:text-text-tertiary"
          />
          <kbd className="shrink-0 rounded-md bg-background-secondary-default px-1.5 py-0.5 text-caption-1-medium text-text-tertiary">ESC</kbd>
        </div>
        <div className="max-h-72 overflow-y-auto p-1.5">
          {hits.length === 0 ? (
            <p className="px-2 py-3 text-body-regular text-text-tertiary">No matching threads.</p>
          ) : (
            hits.map((t) => (
              <button key={t.id} type="button" onClick={() => onSelect(t.id)} className="flex w-full cursor-pointer items-center gap-2 rounded-lg px-2 py-1.5 text-start hover:bg-background-secondary-hover">
                <span className="min-w-0 flex-1 truncate text-body-medium text-text-primary">{t.title}</span>
                <span className="shrink-0 text-body-2-regular text-text-tertiary">{t.repo}</span>
                <span className="shrink-0 rounded-sm bg-background-tertiary-default px-1 py-px text-caption-1-medium text-text-secondary">{t.badge}</span>
              </button>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Local composer: original pill + status row (57% ring)               */
/* ------------------------------------------------------------------ */

function ProgressRing({ progress }: { progress: number }) {
  const dash = ((progress / 100) * 37.69911184307752).toFixed(3);
  return (
    <span className="flex items-center gap-1 rounded-[40px] bg-background-tertiary-default py-1 pe-2 ps-1.5">
      <svg aria-hidden="true" width="16" height="16" viewBox="0 0 16 16" className="shrink-0 -rotate-90">
        <circle cx="8" cy="8" r="6" fill="none" stroke="var(--color-neutral-300)" strokeWidth="2.5" />
        <circle cx="8" cy="8" r="6" fill="none" stroke="var(--color-neutral-500)" strokeWidth="2.5" strokeLinecap="round" strokeDasharray={`${dash} 37.69911184307752`} />
      </svg>
      <span className="text-body-2-medium whitespace-nowrap text-text-secondary">{progress}%</span>
    </span>
  );
}

function LocalComposer({
  value, onValueChange, onSubmit, onStop, busy, model, onModelChange,
  project, onProjectChange, voiceOn, onVoiceToggle, files, onFiles, onRemoveFile, inputRef,
}: {
  value: string;
  onValueChange: (v: string) => void;
  onSubmit: () => void;
  onStop: () => void;
  busy: boolean;
  model: string;
  onModelChange: (m: string) => void;
  project: string;
  onProjectChange: (p: string) => void;
  voiceOn: boolean;
  onVoiceToggle: () => void;
  files: string[];
  onFiles: (names: string[]) => void;
  onRemoveFile: (name: string) => void;
  inputRef: React.RefObject<HTMLInputElement | null>;
}) {
  const [modelMenuOpen, setModelMenuOpen] = useState(false);
  const [projectMenuOpen, setProjectMenuOpen] = useState(false);
  const [agentMenuOpen, setAgentMenuOpen] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const onKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      onSubmit();
    }
  };

  return (
    <div className="flex w-full flex-col gap-2.5">
      {files.length > 0 && (
        <div className="flex flex-wrap gap-1.5 px-1">
          {files.map((f) => (
            <span key={f} className="flex items-center gap-1 rounded-full border border-border-button-default bg-background-primary-default px-2.5 py-1 text-body-2-medium text-text-secondary">
              <span className="max-w-40 truncate">{f}</span>
              <button type="button" aria-label={`Remove ${f}`} onClick={() => onRemoveFile(f)} className="cursor-pointer text-text-tertiary hover:text-text-primary">
                <RiCloseLine className="size-3.5" aria-hidden />
              </button>
            </span>
          ))}
        </div>
      )}
      <ComposerLoader active={busy}>
        <div className="relative">
          <div className={cx("flex h-[52px] w-full items-center gap-2.5 rounded-full p-2", busy ? "bg-transparent" : "bg-background-primary-default shadow-xs")}>
            <input ref={fileRef} type="file" multiple className="hidden" aria-label="Choose files to attach" onChange={(e) => { const names = Array.from(e.target.files ?? []).map((f) => f.name); if (names.length > 0) onFiles(names); e.target.value = ""; }} />
            <button
              type="button"
              aria-label="Add attachment"
              aria-expanded="false"
              onClick={() => fileRef.current?.click()}
              className="flex size-9 shrink-0 cursor-pointer items-center justify-center rounded-full bg-ai-chat-composer-add-background text-foreground-icon-primary transition-colors duration-150 ease hover:bg-ai-chat-composer-add-hover-background"
            >
              <RiAddLine className="size-5" aria-hidden />
            </button>

            <label className="sr-only" htmlFor="agent-composer-input">Message</label>
            <input
              id="agent-composer-input"
              ref={inputRef}
              type="text"
              value={value}
              onChange={(e) => onValueChange(e.target.value)}
              onKeyDown={onKeyDown}
              placeholder="Ask me anything"
              autoComplete="off"
              aria-label="Message"
              className="h-5 min-w-0 flex-1 bg-transparent text-body-regular text-text-primary caret-accent-500 outline-none placeholder:text-text-tertiary [&:not(:focus)]:[mask-image:linear-gradient(to_right,#000_calc(100%-32px),transparent_100%)] rtl:[&:not(:focus)]:[mask-image:linear-gradient(to_left,#000_calc(100%-32px),transparent_100%)]"
            />

            <div className="relative shrink-0">
              <button
                type="button"
                aria-expanded={modelMenuOpen}
                onClick={() => setModelMenuOpen((o) => !o)}
                className="flex h-8 shrink-0 cursor-pointer items-center justify-center gap-0.5 rounded-xl bg-background-primary-default py-1.5 pe-1 ps-2 outline-none transition-colors duration-150 ease hover:bg-background-primary-hover focus-visible:ring-2 focus-visible:ring-border-focus-ring"
              >
                <span className="px-0.5 text-body-medium whitespace-nowrap text-text-secondary">{model}</span>
                <RiArrowDownSLine className={cx("size-[18px] shrink-0 text-foreground-icon-secondary transition-transform duration-200 ease", modelMenuOpen && "rotate-180")} aria-hidden />
              </button>
              {modelMenuOpen && (
                <>
                  <button type="button" aria-label="Close model menu" onClick={() => setModelMenuOpen(false)} className="fixed inset-0 z-10 cursor-default" />
                  <div className="absolute end-0 bottom-10 z-20 w-44 rounded-xl border border-border-button-default bg-background-primary-default p-1.5 shadow-card">
                    <button type="button" onClick={() => setModelMenuOpen(false)} className="flex w-full cursor-pointer items-center justify-between rounded-lg px-2 py-1.5 text-start text-body-medium text-text-primary hover:bg-background-secondary-hover">
                      Fable 5
                      <span className="text-body-2-medium text-text-tertiary">Active</span>
                    </button>
                    <p className="px-2 py-1.5 text-body-2-regular text-text-tertiary">更多模型待实测确认</p>
                  </div>
                </>
              )}
            </div>

            <div className="flex shrink-0 items-center gap-2 ps-1.5">
              <button
                type="button"
                aria-label="Voice input"
                aria-pressed={voiceOn}
                onClick={onVoiceToggle}
                className={cx(
                  "flex size-9 cursor-pointer items-center justify-center rounded-full border border-border-button-default bg-background-primary-default shadow-xs transition-colors duration-150 ease hover:bg-background-primary-hover",
                  voiceOn && "border-accent-500 bg-accent-50",
                )}
              >
                <RiMicLine className="size-5 text-foreground-icon-primary" aria-hidden />
              </button>
              {busy ? (
                <button type="button" onClick={onStop} aria-label="Stop generating" className="flex size-9 cursor-pointer items-center justify-center rounded-full bg-background-secondary-default text-foreground-icon-secondary transition-colors hover:bg-background-secondary-hover">
                  <RiCloseLine className="size-5" aria-hidden />
                </button>
              ) : (
                <button
                  type="button"
                  aria-label="Send message"
                  onClick={onSubmit}
                  className="flex size-9 cursor-pointer items-center justify-center rounded-full bg-button-primary text-white transition-opacity duration-200 ease"
                >
                  <RiArrowUpLine className="size-5" aria-hidden />
                </button>
              )}
            </div>
          </div>
        </div>
      </ComposerLoader>

      {/* Status row below the pill (original position). */}
      <div className="px-1.5">
        <div className="flex h-[26px] w-full items-center justify-between">
          <div className="flex items-center gap-3">
            <button type="button" className="flex cursor-pointer items-center gap-1">
              <RiGitBranchLine className="size-4 shrink-0 -scale-y-100 text-foreground-icon-secondary" aria-hidden />
              <span className="flex items-center"><span className="text-body-2-medium whitespace-nowrap text-text-secondary">Main</span></span>
            </button>
            <div className="relative">
              <button
                type="button"
                aria-expanded={projectMenuOpen}
                onClick={() => setProjectMenuOpen((o) => !o)}
                className="flex cursor-pointer items-center gap-1 rounded-sm outline-none focus-visible:ring-2 focus-visible:ring-border-focus-ring"
              >
                <RiFolderLine className="size-4 shrink-0 text-foreground-icon-secondary" aria-hidden />
                <span className="flex items-center">
                  <span className="text-body-2-medium whitespace-nowrap text-text-secondary">{project}</span>
                  <RiArrowDownSLine className={cx("size-4 shrink-0 text-foreground-icon-secondary transition-transform duration-200 ease", projectMenuOpen && "rotate-180")} aria-hidden />
                </span>
              </button>
              {projectMenuOpen && (
                <>
                  <button type="button" aria-label="Close project menu" onClick={() => setProjectMenuOpen(false)} className="fixed inset-0 z-10 cursor-default" />
                  <div className="absolute start-0 bottom-7 z-20 w-44 rounded-xl border border-border-button-default bg-background-primary-default p-1.5 shadow-card">
                    <button type="button" onClick={() => { onProjectChange("project-sea"); setProjectMenuOpen(false); }} className="flex w-full cursor-pointer items-center justify-between rounded-lg px-2 py-1.5 text-start text-body-medium text-text-primary hover:bg-background-secondary-hover">
                      project-sea
                      <span className="text-body-2-medium text-text-tertiary">Active</span>
                    </button>
                    <p className="px-2 py-1.5 text-body-2-regular text-text-tertiary">更多项目待实测确认</p>
                  </div>
                </>
              )}
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="relative">
              <button
                type="button"
                aria-expanded={agentMenuOpen}
                onClick={() => setAgentMenuOpen((o) => !o)}
                className="flex cursor-pointer items-center gap-1"
              >
                <RiInfinityLine className="size-4 shrink-0 text-foreground-icon-secondary" aria-hidden />
                <span className="flex items-center">
                  <span className="text-body-2-medium whitespace-nowrap text-text-secondary">Agent</span>
                  <RiArrowDownSLine className={cx("size-4 shrink-0 text-foreground-icon-secondary transition-transform duration-200 ease", agentMenuOpen && "rotate-180")} aria-hidden />
                </span>
              </button>
              {agentMenuOpen && (
                <>
                  <button type="button" aria-label="Close agent menu" onClick={() => setAgentMenuOpen(false)} className="fixed inset-0 z-10 cursor-default" />
                  <div className="absolute end-0 bottom-7 z-20 w-44 rounded-xl border border-border-button-default bg-background-primary-default p-1.5 shadow-card">
                    <button type="button" onClick={() => setAgentMenuOpen(false)} className="flex w-full cursor-pointer items-center justify-between rounded-lg px-2 py-1.5 text-start text-body-medium text-text-primary hover:bg-background-secondary-hover">
                      Agent
                      <span className="text-body-2-medium text-text-tertiary">Active</span>
                    </button>
                    <p className="px-2 py-1.5 text-body-2-regular text-text-tertiary">更多选项待实测确认</p>
                  </div>
                </>
              )}
            </div>
            <ProgressRing progress={57} />
          </div>
        </div>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Code panel: 410px, Changes/Browser pills, separator drag            */
/* ------------------------------------------------------------------ */

function CodePanel({
  width, expanded, onExpand, onToggle, onClose, onResize, terminalOpen, onTerminal,
}: {
  width: number;
  expanded: boolean;
  onExpand: () => void;
  onToggle: () => void;
  onClose: () => void;
  onResize: (w: number) => void;
  terminalOpen: boolean;
  onTerminal: () => void;
}) {
  const dragRef = useRef<{ startX: number; startWidth: number } | null>(null);

  const onDragStart = (event: React.PointerEvent) => {
    event.preventDefault();
    dragRef.current = { startX: event.clientX, startWidth: width };
    const move = (e: PointerEvent) => {
      if (!dragRef.current) return;
      const next = dragRef.current.startWidth + (dragRef.current.startX - e.clientX);
      onResize(Math.min(640, Math.max(320, next)));
    };
    const up = () => {
      dragRef.current = null;
      window.removeEventListener("pointermove", move);
      window.removeEventListener("pointerup", up);
    };
    window.addEventListener("pointermove", move);
    window.addEventListener("pointerup", up);
  };

  const onSeparatorKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === "ArrowLeft") { event.preventDefault(); onResize(Math.min(640, Math.max(320, width + 16))); }
    if (event.key === "ArrowRight") { event.preventDefault(); onResize(Math.min(640, Math.max(320, width - 16))); }
  };

  return (
    <>
      {/* Desktop panel (original: fixed 410px aside, hidden xl:flex) */}
      <div className="relative hidden h-full shrink-0 xl:flex" style={{ width, minWidth: width, maxWidth: width, flexBasis: width }}>
        <div
          role="separator"
          aria-orientation="vertical"
          aria-label="Resize panels"
          tabIndex={0}
          onKeyDown={onSeparatorKeyDown}
          onPointerDown={onDragStart}
          className="group/drag absolute inset-y-0 -start-2.5 z-10 hidden w-5 cursor-col-resize touch-none justify-center outline-none focus-visible:ring-2 focus-visible:ring-border-focus-ring xl:flex"
        >
          <span className="absolute top-1/2 flex h-[25px] w-[15px] -translate-y-1/2 items-center justify-center gap-0.5 rounded-sm border border-border-button-default bg-background-primary-default shadow-xs transition-opacity duration-150 ease opacity-0 group-hover/drag:opacity-100 group-focus-visible/drag:opacity-100">
            <span className="h-[13px] w-px bg-foreground-icon-quaternary" />
            <span className="h-[13px] w-px bg-foreground-icon-quaternary" />
            <span className="h-[13px] w-px bg-foreground-icon-quaternary" />
          </span>
        </div>
        <aside className="flex h-full w-full shrink-0 flex-col gap-2.5 overflow-hidden pt-2" aria-label="Code panel">
          <CodePanelInner
            expanded={expanded}
            onExpand={onExpand}
            onToggle={onToggle}
            onClose={onClose}
            terminalOpen={terminalOpen}
            onTerminal={onTerminal}
            mobile={false}
          />
        </aside>
      </div>

      {/* Mobile drawer (original: w-[min(410px,calc(100%_-_12px))]) */}
      <div className="fixed inset-0 z-50 flex xl:hidden">
        <button type="button" aria-label="Close code" onClick={onClose} className="absolute inset-0 cursor-pointer bg-black/40" />
        <div className="absolute inset-y-0 end-0 flex w-[min(410px,calc(100%_-_12px))] flex-col bg-background-full p-3 shadow-sidebar" style={{ animation: "agent-drawer-in 0.3s ease-in-out both" }}>
          <div className="flex items-center justify-between px-1 pb-2">
            <span className="text-headline-medium text-text-primary">Code</span>
            <IconButton icon={RiCloseLine} size="small" aria-label="Close code" onClick={onClose} />
          </div>
          <div className="flex min-h-0 flex-1 flex-col overflow-hidden rounded-3xl border border-border-button-default bg-background-secondary-default">
            <CodePanelInner
              expanded={false}
              onExpand={onClose}
              onToggle={onClose}
              onClose={onClose}
              terminalOpen={terminalOpen}
              onTerminal={onTerminal}
              mobile
            />
          </div>
        </div>
      </div>
    </>
  );
}

function CodePanelInner({
  expanded, onExpand, onToggle, onClose, terminalOpen, onTerminal, mobile,
}: {
  expanded: boolean;
  onExpand: () => void;
  onToggle: () => void;
  onClose: () => void;
  terminalOpen: boolean;
  onTerminal: () => void;
  mobile: boolean;
}) {
  const [tab, setTab] = useState<"changes" | "browser">("changes");
  const [undone, setUndone] = useState(false);

  return (
    <div className="flex h-full min-h-0 w-full flex-col">
      <div className="flex h-[30px] w-full shrink-0 items-center justify-between px-1 pt-0">
        <div role="group" aria-label="Panel view" className="relative inline-flex items-center gap-1">
          <button
            type="button"
            aria-pressed={tab === "changes"}
            data-pill-selected={tab === "changes" ? "" : undefined}
            data-pill-variant="blue"
            onClick={() => setTab("changes")}
            className="group relative z-10 flex shrink-0 cursor-pointer items-center gap-1 rounded-full px-2 py-[5px] outline-none transition-colors duration-150 ease focus-visible:ring-2 focus-visible:ring-border-focus-ring"
          >
            <span aria-hidden="true" className={cx("pointer-events-none absolute inset-0 rounded-full bg-pill-tab-blue-hover-background transition-opacity duration-200 ease-out", tab === "changes" ? "opacity-0" : "opacity-0 group-hover:opacity-100")} />
            <RiBracesLine className={cx("relative z-10 size-5 shrink-0", tab === "changes" ? "text-accent-500" : "text-foreground-icon-secondary")} aria-hidden />
            <span className={cx("relative z-10 text-body-medium whitespace-nowrap", tab === "changes" ? "text-accent-500" : "text-text-secondary")}>Changes</span>
          </button>
          <button
            type="button"
            aria-pressed={tab === "browser"}
            data-pill-variant="blue"
            onClick={() => setTab("browser")}
            className="group relative z-10 flex shrink-0 cursor-pointer items-center gap-1 rounded-full px-2 py-[5px] outline-none transition-colors duration-150 ease focus-visible:ring-2 focus-visible:ring-border-focus-ring"
          >
            <span aria-hidden="true" className={cx("pointer-events-none absolute inset-0 rounded-full bg-pill-tab-blue-hover-background transition-opacity duration-200 ease-out", tab === "browser" ? "opacity-0" : "opacity-0 group-hover:opacity-100")} />
            <RiGlobalLine className={cx("relative z-10 size-5 shrink-0", tab === "browser" ? "text-accent-500" : "text-foreground-icon-secondary")} aria-hidden />
            <span className={cx("relative z-10 text-body-medium whitespace-nowrap", tab === "browser" ? "text-accent-500" : "text-text-secondary")}>Browser</span>
          </button>
        </div>
        <div className="flex items-center gap-2 pe-px">
          <button type="button" aria-label="Open terminal" onClick={onTerminal} className="group cursor-pointer outline-none">
            <RiTerminalBoxLine className={cx("size-4 transition-colors duration-150 group-hover:text-foreground-icon-hover group-focus-visible:text-foreground-icon-hover", terminalOpen ? "text-foreground-icon-primary" : "text-foreground-icon-secondary")} aria-hidden />
          </button>
          <button type="button" aria-label="Expand panel" onClick={onExpand} className="group cursor-pointer outline-none">
            <RiExpandDiagonalLine className={cx("size-4 transition-colors duration-150 group-hover:text-foreground-icon-hover group-focus-visible:text-foreground-icon-hover", expanded ? "text-foreground-icon-primary" : "text-foreground-icon-secondary")} aria-hidden />
          </button>
          {mobile ? (
            <button type="button" aria-label="Close code" onClick={onClose} className="group cursor-pointer outline-none">
              <RiCloseLine className="size-4 text-foreground-icon-secondary transition-colors duration-150 group-hover:text-foreground-icon-hover" aria-hidden />
            </button>
          ) : (
            <button type="button" aria-label="Toggle panel" onClick={onToggle} className="group cursor-pointer outline-none">
              <RiSideBarLine className="size-4 text-foreground-icon-secondary transition-colors duration-150 group-hover:text-foreground-icon-hover group-focus-visible:text-foreground-icon-hover" aria-hidden />
            </button>
          )}
        </div>
      </div>

      {tab === "changes" && (
        <div className="flex min-h-0 w-full flex-1 flex-col overflow-hidden">
          <div className="flex w-full flex-col">
            <div className="flex w-full flex-col justify-center rounded-t-2lg border-x border-t border-background-secondary-default px-2.5 pt-1.5 pb-3.5">
              <div className="flex w-full items-center gap-1.5">
                <div className="flex min-w-0 flex-1 items-center gap-1.5">
                  <span className="text-body-2-medium whitespace-nowrap text-text-secondary">{undone ? "0 Uncomitted changes" : "12 Uncomitted changes"}</span>
                  {!undone && (
                    <>
                      <span className="text-body-regular whitespace-nowrap text-emerald-700">+156</span>
                      <span className="text-body-regular whitespace-nowrap text-red-600">-23</span>
                    </>
                  )}
                </div>
                {!undone && (
                  <button type="button" aria-label="Undo changes" onClick={() => setUndone(true)} className="cursor-pointer">
                    <RiArrowGoBackLine className="size-4 text-foreground-icon-secondary" aria-hidden />
                  </button>
                )}
              </div>
            </div>
            {!undone && (
              <div className="z-10 -mt-[7px] flex w-full items-center justify-between rounded-2lg bg-background-secondary-default py-1 pe-[5px] ps-1.5">
                <div className="flex min-w-0 items-center gap-1">
                  <svg aria-hidden="true" viewBox="0 0 16 15" className="h-[14.25px] w-4 shrink-0">
                    <g stroke="#149ECA" strokeWidth="0.9" fill="none">
                      <ellipse cx="8" cy="7.125" rx="7.2" ry="2.85" />
                      <ellipse cx="8" cy="7.125" rx="7.2" ry="2.85" transform="rotate(60 8 7.125)" />
                      <ellipse cx="8" cy="7.125" rx="7.2" ry="2.85" transform="rotate(120 8 7.125)" />
                    </g>
                    <circle cx="8" cy="7.125" r="1.4" fill="#149ECA" />
                  </svg>
                  <p className="truncate text-body-regular text-text-primary">
                    boardui/app/components/button.tsx <span className="text-emerald-700">+74</span>
                  </p>
                </div>
                <span className="inline-flex shrink-0 items-center justify-center rounded-sm bg-background-tertiary-default px-1 py-px text-caption-1-medium whitespace-nowrap text-text-secondary">New</span>
              </div>
            )}
          </div>
          <div className="pt-[3px]" />
          {undone ? (
            <div className="flex flex-col items-start gap-2 px-1.5 pt-2">
              <p className="text-body-regular text-text-secondary">All changes undone. Nothing to commit.</p>
              <button type="button" onClick={() => setUndone(false)} className="flex cursor-pointer items-center gap-1.5 rounded-lg border border-border-button-default bg-background-primary-default px-2.5 py-1.5 text-body-medium text-text-primary hover:bg-background-primary-hover">
                <RiArrowGoBackLine className="size-4" aria-hidden /> Restore changes
              </button>
            </div>
          ) : (
            <div className="min-h-0 w-full flex-1 overflow-y-auto ps-1.5 font-mono text-[13px] leading-[23px] [scrollbar-width:thin]">
              <code dir="ltr" className="block">
                {CODE_LINES.map((line, i) => (
                  <span key={i} className="flex min-h-[23px] items-start gap-[13px]" style={{ color: "var(--color-text-secondary)" }}>
                    <span className="w-5 shrink-0 text-end text-text-tertiary select-none">{i + 1}</span>
                    <span className="min-w-0 flex-1 break-words whitespace-pre-wrap">{highlightLine(line, i + 1)}</span>
                  </span>
                ))}
              </code>
            </div>
          )}
        </div>
      )}

      {tab === "browser" && (
        <div className="flex min-h-0 flex-1 items-start justify-center overflow-y-auto px-4 py-8">
          <p className="text-body-regular text-text-tertiary">Browser 视图内容待实测确认</p>
        </div>
      )}
    </div>
  );
}
