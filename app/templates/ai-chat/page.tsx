"use client";

import {
  RiAddLine,
  RiAttachment2,
  RiBracesLine,
  RiCloseLine,
  RiCodeSSlashLine,
  RiDownloadLine,
  RiExpandDiagonalLine,
  RiFileCopyLine,
  RiGitBranchLine,
  RiMenuLine,
  RiMoonLine,
  RiMore2Fill,
  RiSearchLine,
  RiShareLine,
  RiSparklingLine,
  RiSunLine,
  RiTerminalBoxLine,
  RiArrowGoBackLine,
} from "@remixicon/react";
import { useCallback, useEffect, useRef, useState } from "react";

import {
  DASHBOARD_NAV,
  DashboardSidebar,
} from "@/components/application/dashboard/dashboard-sidebar";
import { AgentChatHistory, type ChatThreadSummary } from "@/components/application/agent-chat/agent-chat-history";
import { AgentComposer } from "@/components/application/agent-chat/agent-composer";
import { AgentMessage } from "@/components/application/agent-chat/agent-chat-message";
import { AgentThinking } from "@/components/application/agent-thinking/agent-thinking";
import { applyTheme, useThemeMode } from "@/components/application/theme/theme-toggle";
import { IconButton } from "@/components/base/buttons/icon-button";
import { cx } from "@/utils/cx";

/**
 * AI Chat template replica.
 * Official: boardui.com/templates/ai-chat — Agentic chat, "vibl coding
 * project / coding scenario" thread, Fable 5 / Main / project-sea, Code /
 * Changes / Browser panel, 12 uncommitted changes (+156/−23).
 *
 * Built only from free BoardUI components (AgentComposer, AgentMessage,
 * AgentThinking, AgentChatHistory) + local canned replies — no model key
 * needed. The free AgentChat monolith is NOT used as-is: it hardcodes the
 * starter nav (Chat / Dashboard / Components / Sign in / Sign up), while
 * this template must use the shared dashboard nav that links to the other
 * template routes. Its composer / message / thinking / history pieces are
 * reused here instead.
 *
 * Geometry follows the original + the free chat: 12px page frame, 16px gap,
 * 260px sidebar card, rounded-3xl chat surface.
 */

// Fixed anchor so server and client render the same relative times.
const NOW = 1794015600000;

type ChatMsg = { id: string; role: "user" | "assistant"; text: string; at: number };

type SeedThread = ChatThreadSummary & { messages: ChatMsg[] };

const MODELS = ["Fable 5", "Fable 4", "Fable 3 Mini"];
const EFFORTS = ["Low", "Medium", "High"] as const;

const SEED_THREADS: SeedThread[] = [
  {
    id: "coding-scenario",
    title: "coding scenario",
    updatedAt: NOW,
    messages: [
      {
        id: "m-user-1",
        role: "user",
        text: "update our color tokens for dark mode and add a reusable theme toggle to the registry. run lint and a production build when you're done.",
        at: NOW - 1000 * 60 * 4,
      },
      {
        id: "m-agent-1",
        role: "assistant",
        text: "Done — I updated the color tokens for dark mode and added a reusable theme toggle to the registry.\n\n• Tokens: dark-mode values for the surfaces, borders and text tokens now live next to the light values, so every component flips with the .dark class.\n• ThemeToggle: a reusable switch that persists the choice and animates the transition, ready to drop into any page.\n• Lint passed with no errors, and the production build completed successfully.\n\nThe changes are in the code panel — 12 uncommitted changes (+156/−23).",
        at: NOW - 1000 * 60 * 3,
      },
    ],
  },
  {
    id: "boardui",
    title: "boardui · pro badge restyle",
    updatedAt: NOW - 1000 * 60 * 60 * 2,
    messages: [
      { id: "m-user-2", role: "user", text: "restyle the pro badge so it reads better on dark backgrounds.", at: NOW - 1000 * 60 * 60 * 2 },
      { id: "m-agent-2", role: "assistant", text: "Restyled the Pro badge: higher-contrast fill, tighter tracking, and a subtle border so it holds up on dark surfaces. The change is in boardui/app/components/button.tsx (+74).", at: NOW - 1000 * 60 * 60 * 2 + 45000 },
    ],
  },
  {
    id: "installation-docs",
    title: "installation docs page",
    updatedAt: NOW - 1000 * 60 * 60 * 24,
    messages: [
      { id: "m-user-3", role: "user", text: "draft the installation docs page for the new registry.", at: NOW - 1000 * 60 * 60 * 24 },
      { id: "m-agent-3", role: "assistant", text: "Drafted the installation page: prerequisites, the one-command install, and a troubleshooting section for the common registry errors.", at: NOW - 1000 * 60 * 60 * 24 + 60000 },
    ],
  },
  {
    id: "vibl-landing",
    title: "vibl coding project · landing page design",
    updatedAt: NOW - 1000 * 60 * 34,
    messages: [
      { id: "m-user-4", role: "user", text: "tighten the landing page hero — one clear action, less copy.", at: NOW - 1000 * 60 * 34 },
      { id: "m-agent-4", role: "assistant", text: "Tightened the hero to a single action with the outcome first, the product preview beside it, and the secondary links moved below the fold.", at: NOW - 1000 * 60 * 34 + 50000 },
    ],
  },
  {
    id: "image-generation",
    title: "image generation",
    updatedAt: NOW - 1000 * 60 * 12,
    messages: [
      { id: "m-user-5", role: "user", text: "generate a vintage editorial illustration of Messi dribbling in the Argentina home kit.", at: NOW - 1000 * 60 * 12 },
      { id: "m-agent-5", role: "assistant", text: "Generated it with Fable 5 — vintage editorial style, Argentina home kit, blue background. It is in the gallery on the AI Image Generation page.", at: NOW - 1000 * 60 * 12 + 40000 },
    ],
  },
  {
    id: "mobile-vue",
    title: "mobile app for vuejs...",
    updatedAt: NOW - 1000 * 60 * 60 * 5,
    messages: [
      { id: "m-user-6", role: "user", text: "sketch the mobile app structure for the vuejs client.", at: NOW - 1000 * 60 * 60 * 5 },
      { id: "m-agent-6", role: "assistant", text: "Sketched a three-tab mobile shell — Home, Projects, Profile — with the chat composer reachable from every tab.", at: NOW - 1000 * 60 * 60 * 5 + 55000 },
    ],
  },
  {
    id: "code-refactor",
    title: "code refactor dropdo...",
    updatedAt: NOW - 1000 * 60 * 60 * 18,
    messages: [
      { id: "m-user-7", role: "user", text: "refactor the dropdown so it works with keyboard navigation.", at: NOW - 1000 * 60 * 60 * 18 },
      { id: "m-agent-7", role: "assistant", text: "Refactored the dropdown onto react-aria-components: arrow-key navigation, type-ahead, and focus return on close.", at: NOW - 1000 * 60 * 60 * 18 + 70000 },
    ],
  },
  {
    id: "strider-hero",
    title: "strider landing page work · hero section animation",
    updatedAt: NOW - 1000 * 60 * 60 * 24 * 3,
    messages: [
      { id: "m-user-8", role: "user", text: "add a subtle entrance animation to the strider hero section.", at: NOW - 1000 * 60 * 60 * 24 * 3 },
      { id: "m-agent-8", role: "assistant", text: "Added a staggered fade-and-rise entrance for the hero, with reduced-motion respected.", at: NOW - 1000 * 60 * 60 * 24 * 3 + 50000 },
    ],
  },
  {
    id: "pricing-copy",
    title: "pricing table copy",
    updatedAt: NOW - 1000 * 60 * 60 * 24 * 4,
    messages: [
      { id: "m-user-9", role: "user", text: "rewrite the pricing table copy to lead with the free tier.", at: NOW - 1000 * 60 * 60 * 24 * 4 },
      { id: "m-agent-9", role: "assistant", text: "Rewrote the pricing copy: free tier first, one line per plan, and the upgrade reason stated plainly.", at: NOW - 1000 * 60 * 60 * 24 * 4 + 45000 },
    ],
  },
  {
    id: "pirate-game",
    title: "pirate mini game iOS · cannon physics tuning",
    updatedAt: NOW - 1000 * 60 * 60 * 24 * 7,
    messages: [
      { id: "m-user-10", role: "user", text: "the cannon feels floaty — tune the physics.", at: NOW - 1000 * 60 * 60 * 24 * 7 },
      { id: "m-agent-10", role: "assistant", text: "Tuned the cannon: heavier gravity on the arc, a snappier recoil, and tighter spread at close range.", at: NOW - 1000 * 60 * 60 * 24 * 7 + 60000 },
    ],
  },
  {
    id: "sprite-cleanup",
    title: "sprite sheet cleanup",
    updatedAt: NOW - 1000 * 60 * 60 * 24 * 14,
    messages: [
      { id: "m-user-11", role: "user", text: "clean up the sprite sheet — remove unused frames.", at: NOW - 1000 * 60 * 60 * 24 * 14 },
      { id: "m-agent-11", role: "assistant", text: "Removed 23 unused frames and repacked the sheet; the atlas is 18% smaller with no visual change.", at: NOW - 1000 * 60 * 60 * 24 * 14 + 50000 },
    ],
  },
];

const CODE_LINES = [
  'import { applyTheme } from "@/components/application/theme/theme-toggle";',
  'import { RiMoonLine, RiSunLine } from "@remixicon/react";',
  '',
  '// Reusable theme toggle for the registry.',
  '// Persists the choice and flips the .dark class,',
  '// so every token below follows automatically.',
  'export function ThemeToggleButton() {',
  '  const mode = useThemeMode();',
  '  const next = mode === "dark" ? "light" : "dark";',
  '  return (',
  '    <button',
  '      type="button"',
  '      aria-label={mode === "dark" ? "Use light mode" : "Use dark mode"}',
  '      onClick={() => applyTheme(next)}',
  '    >',
  '      {mode === "dark" ? <RiSunLine /> : <RiMoonLine />}',
  '    </button>',
  '  );',
  '}',
  '',
  '// Dark-mode color tokens (excerpt):',
  '// --color-background-primary-default',
  '// --color-background-secondary-default',
  '// --color-text-primary / --color-text-secondary',
  '// --color-border-button-default',
  '// --color-accent-500 / --color-accent-600',
  '',
  'export const themeToggle = {',
  '  light: "bg-background-primary-default",',
  '  dark: "bg-background-secondary-default",',
  '};',
];

const CHANGED_FILES = [
  { path: "boardui/app/components/button.tsx", added: 74, status: "New" },
  { path: "boardui/app/components/theme-toggle.tsx", added: 41, status: "New" },
  { path: "boardui/styles/theme.css", added: 29, status: "Modified" },
];

const TERMINAL_LINES = [
  "$ npm run lint",
  "✓ No errors — 0 warnings",
  "$ npm run build",
  "✓ Compiled successfully",
  "✓ Production build passed in 4.2s",
];

function pickReply(prompt: string, model: string, effort: string): string {
  const text = prompt.toLowerCase();
  if (/dark mode|theme|token|color/.test(text)) {
    return `Done — the dark-mode color tokens are updated and the theme toggle is in the registry.\n\n• Tokens: dark values for surfaces, borders and text now sit beside the light values, so the whole UI flips with the .dark class.\n• ThemeToggle: a reusable switch that persists the choice (${model}, ${effort.toLowerCase()} effort).\n\nLint passed, production build passed. The diff is in the code panel.`;
  }
  if (/lint|build|test/.test(text)) {
    return `Ran both for you with ${model} (${effort.toLowerCase()} effort).\n\n• Lint: passed with no errors.\n• Production build: compiled successfully.\n\nOpen the terminal strip in the code panel to see the full log.`;
  }
  if (/image|messi|picture|illustration|generate/.test(text)) {
    return `That is an image job — the AI Image Generation page handles it. The Messi editorial illustration is already in its gallery (Fable 5, Main, project-sea).\n\nWant me to open it, or tweak the prompt first?`;
  }
  if (/^(hi|hello|hey)\b/.test(text.trim())) {
    return `Hello. I am the demo agent for this template — answers here are canned, no model key needed. Try asking me to update the color tokens, or run lint and a build.`;
  }
  return `Got it — working through that with ${model} (${effort.toLowerCase()} effort).\n\nDemo mode, so this reply is canned: in the real template the agent would edit the code, show the diff in the panel on the right, and report back once lint and the production build pass.`;
}

export default function AiChatTemplatePage() {
  const theme = useThemeMode();
  const [navOpen, setNavOpen] = useState(false);
  const [threads, setThreads] = useState<SeedThread[]>(SEED_THREADS);
  const [activeId, setActiveId] = useState("coding-scenario");
  const [messages, setMessages] = useState<ChatMsg[]>(SEED_THREADS[0].messages);
  const [input, setInput] = useState("");
  const [busy, setBusy] = useState(false);
  const [model, setModel] = useState(MODELS[0]);
  const [effort, setEffort] = useState<(typeof EFFORTS)[number]>("Medium");
  const [modelMenuOpen, setModelMenuOpen] = useState(false);
  const [moreMenuOpen, setMoreMenuOpen] = useState(false);
  const [panelOpen, setPanelOpen] = useState(false);
  // Wide screens open with the code panel visible, like the original;
  // narrow screens start with the chat full-width and the panel as a drawer.
  useEffect(() => {
    if (window.innerWidth >= 1280) setPanelOpen(true);
  }, []);
  const [panelTab, setPanelTab] = useState<"code" | "changes" | "browser">("code");
  const [panelWidth, setPanelWidth] = useState(400);
  const [panelExpanded, setPanelExpanded] = useState(false);
  const [terminalOpen, setTerminalOpen] = useState(false);
  const [changesUndone, setChangesUndone] = useState(false);
  const [copied, setCopied] = useState(false);
  const [progress, setProgress] = useState(57);
  const scrollRef = useRef<HTMLDivElement>(null);
  const dragRef = useRef<{ startX: number; startWidth: number } | null>(null);
  const pendingRef = useRef<{ interval?: number; timeout?: number }>({});

  const clearPending = useCallback(() => {
    if (pendingRef.current.interval !== undefined) window.clearInterval(pendingRef.current.interval);
    if (pendingRef.current.timeout !== undefined) window.clearTimeout(pendingRef.current.timeout);
    pendingRef.current = {};
  }, []);

  useEffect(() => clearPending, [clearPending]);

  const activeThread = threads.find((t) => t.id === activeId) ?? threads[0];

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, busy, terminalOpen]);

  const submit = useCallback(
    (text: string) => {
      const trimmed = text.trim();
      if (!trimmed || busy) return;
      const userMsg: ChatMsg = { id: `u-${Date.now()}`, role: "user", text: trimmed, at: Date.now() };
      setMessages((prev) => [...prev, userMsg]);
      setInput("");
      setBusy(true);
      setProgress(12);
      const reply = pickReply(trimmed, model, effort);
      pendingRef.current.interval = window.setInterval(() => {
        setProgress((p) => Math.min(96, p + 14));
      }, 220);
      pendingRef.current.timeout = window.setTimeout(() => {
        pendingRef.current = {};
        setProgress(100);
        setMessages((prev) => [...prev, { id: `a-${Date.now()}`, role: "assistant", text: reply, at: Date.now() }]);
        setBusy(false);
      }, 1100);
    },
    [busy, model, effort],
  );

  const stopGenerating = useCallback(() => {
    clearPending();
    setBusy(false);
    setProgress(57);
  }, [clearPending]);

  const selectThread = useCallback(
    (id: string) => {
      if (busy) return;
      const thread = threads.find((t) => t.id === id);
      if (!thread) return;
      setActiveId(id);
      setMessages(thread.messages);
      setProgress(57);
    },
    [busy, threads],
  );

  const startNewChat = useCallback(() => {
    if (busy) return;
    const id = `t-${Date.now()}`;
    const thread: SeedThread = { id, title: "New chat", updatedAt: Date.now(), messages: [] };
    setThreads((prev) => [thread, ...prev]);
    setActiveId(id);
    setMessages([]);
    setProgress(0);
  }, [busy]);

  const renameThread = useCallback((id: string, title: string) => {
    setThreads((prev) => prev.map((t) => (t.id === id ? { ...t, title } : t)));
  }, []);

  const toggleUnread = useCallback((id: string) => {
    setThreads((prev) => prev.map((t) => (t.id === id ? { ...t, unread: !t.unread } : t)));
  }, []);

  const deleteThread = useCallback(
    (id: string) => {
      const rest = threads.filter((t) => t.id !== id);
      setThreads(rest);
      if (id === activeId && rest.length > 0) {
        setActiveId(rest[0].id);
        setMessages(rest[0].messages);
      }
    },
    [activeId, threads],
  );

  const exportThreads = useCallback(() => {
    const blob = new Blob([JSON.stringify(threads, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "boardui-chats.json";
    document.body.appendChild(link);
    link.click();
    link.remove();
    window.setTimeout(() => URL.revokeObjectURL(url), 0);
  }, [threads]);

  const shareChat = useCallback(() => {
    const transcript = messages
      .map((m) => `${m.role === "user" ? "You" : "Assistant"}: ${m.text}`)
      .join("\n\n");
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

  const onDragStart = (event: React.PointerEvent) => {
    event.preventDefault();
    dragRef.current = { startX: event.clientX, startWidth: panelWidth };
    const move = (e: PointerEvent) => {
      if (!dragRef.current) return;
      const next = dragRef.current.startWidth + (dragRef.current.startX - e.clientX);
      setPanelWidth(Math.min(640, Math.max(320, next)));
    };
    const up = () => {
      dragRef.current = null;
      window.removeEventListener("pointermove", move);
      window.removeEventListener("pointerup", up);
    };
    window.addEventListener("pointermove", move);
    window.addEventListener("pointerup", up);
  };

  const shownChanges = changesUndone ? [] : CHANGED_FILES;

  return (
    <div className="relative flex h-dvh w-full gap-4 overflow-hidden bg-background-full p-3">
      <DashboardSidebar items={DASHBOARD_NAV} selected="ai-chat" className="hidden lg:flex" />

      {navOpen && (
        <div className="fixed inset-0 z-50 flex lg:hidden">
          <button type="button" aria-label="Close navigation" onClick={() => setNavOpen(false)} className="absolute inset-0 cursor-pointer bg-black/40" />
          <div className="relative flex h-full p-3">
            <DashboardSidebar mobile items={DASHBOARD_NAV} selected="ai-chat" onClose={() => setNavOpen(false)} className="flex" />
          </div>
        </div>
      )}

      <div className="relative flex min-h-0 min-w-0 flex-1 gap-3 overflow-hidden">
        {/* Chat surface */}
        <div className="relative flex h-full min-w-0 flex-1 flex-col overflow-hidden rounded-3xl bg-background-secondary-default">
          <header className="flex h-12 shrink-0 items-center gap-2 border-b border-separator-border px-4">
            <IconButton icon={navOpen ? RiCloseLine : RiMenuLine} size="small" aria-label="Open navigation" onClick={() => setNavOpen((o) => !o)} className="lg:hidden" />
            <div className="flex min-w-0 flex-col leading-none">
              <span className="truncate text-headline-medium text-text-primary">Agentic chat</span>
              <span className="truncate text-body-2-regular text-text-tertiary">vibl coding project / {activeThread.title}</span>
            </div>
            <div className="ms-auto flex shrink-0 items-center gap-1">
              <IconButton icon={theme === "dark" ? RiSunLine : RiMoonLine} size="small" aria-label={theme === "dark" ? "Use light mode" : "Use dark mode"} onClick={() => applyTheme(theme === "dark" ? "light" : "dark")} />
              <IconButton icon={RiShareLine} size="small" aria-label="Share chat" onClick={shareChat} />
              <div className="relative">
                <IconButton icon={RiMore2Fill} size="small" aria-label="More options" onClick={() => setMoreMenuOpen((o) => !o)} />
                {moreMenuOpen && (
                  <>
                    <button type="button" aria-label="Close menu" onClick={() => setMoreMenuOpen(false)} className="fixed inset-0 z-10 cursor-default" />
                    <div className="absolute end-0 top-9 z-20 w-48 rounded-xl border border-border-button-default bg-background-primary-default p-1.5 shadow-card">
                      <button type="button" onClick={() => { setMoreMenuOpen(false); exportThreads(); }} className="flex w-full cursor-pointer items-center gap-2 rounded-lg px-2 py-1.5 text-start text-body-medium text-text-primary hover:bg-background-secondary-hover">
                        <RiDownloadLine className="size-4 shrink-0" aria-hidden /> Export chat
                      </button>
                      <button type="button" onClick={() => { setMoreMenuOpen(false); toggleUnread(activeId); }} className="flex w-full cursor-pointer items-center gap-2 rounded-lg px-2 py-1.5 text-start text-body-medium text-text-primary hover:bg-background-secondary-hover">
                        <RiFileCopyLine className="size-4 shrink-0" aria-hidden /> {activeThread.unread ? "Mark as read" : "Mark as unread"}
                      </button>
                      <button type="button" onClick={() => { setMoreMenuOpen(false); deleteThread(activeId); }} className="flex w-full cursor-pointer items-center gap-2 rounded-lg px-2 py-1.5 text-start text-body-medium text-text-primary hover:bg-background-secondary-hover">
                        <RiCloseLine className="size-4 shrink-0" aria-hidden /> Delete thread
                      </button>
                    </div>
                  </>
                )}
              </div>
              <IconButton icon={RiTerminalBoxLine} size="small" aria-label="Open terminal" onClick={() => setTerminalOpen((o) => !o)} className={cx(terminalOpen && "bg-background-secondary-hover")} />
              <IconButton icon={RiCodeSSlashLine} size="small" aria-label={panelOpen ? "Close code" : "Open code"} onClick={() => setPanelOpen((o) => !o)} className={cx(panelOpen && "bg-background-secondary-hover")} />
            </div>
          </header>
          {copied && (
            <p role="status" className="shrink-0 px-4 pt-2 text-body-2-medium text-text-secondary">Chat copied to clipboard.</p>
          )}

          {/* Model / effort / branch / agent progress row */}
          <div className="flex shrink-0 flex-wrap items-center gap-2 px-4 pt-3">
            <div className="relative">
              <button type="button" onClick={() => setModelMenuOpen((o) => !o)} className="flex cursor-pointer items-center gap-1.5 rounded-full border border-border-button-default bg-background-primary-default px-2.5 py-1.5 text-body-medium text-text-primary shadow-xs hover:bg-background-primary-hover">
                <RiSparklingLine className="size-4 shrink-0 text-foreground-icon-secondary" aria-hidden />
                {model}
              </button>
              {modelMenuOpen && (
                <>
                  <button type="button" aria-label="Close model menu" onClick={() => setModelMenuOpen(false)} className="fixed inset-0 z-10 cursor-default" />
                  <div className="absolute start-0 top-10 z-20 w-44 rounded-xl border border-border-button-default bg-background-primary-default p-1.5 shadow-card">
                    {MODELS.map((m) => (
                      <button key={m} type="button" onClick={() => { setModel(m); setModelMenuOpen(false); }} className={cx("flex w-full cursor-pointer items-center justify-between rounded-lg px-2 py-1.5 text-start text-body-medium hover:bg-background-secondary-hover", m === model ? "text-text-primary" : "text-text-secondary")}>
                        {m}
                        {m === model && <span className="text-body-2-medium text-text-tertiary">Active</span>}
                      </button>
                    ))}
                  </div>
                </>
              )}
            </div>
            <div className="flex items-center gap-0.5 rounded-full border border-border-button-default bg-background-primary-default p-0.5" role="group" aria-label="Effort">
              {EFFORTS.map((e) => (
                <button key={e} type="button" aria-pressed={effort === e} onClick={() => setEffort(e)} className={cx("cursor-pointer rounded-full px-2.5 py-1 text-body-2-medium transition-colors", effort === e ? "bg-background-secondary-default text-text-primary shadow-xs" : "text-text-secondary hover:text-text-primary")}>
                  {e}
                </button>
              ))}
            </div>
            <span className="hidden items-center gap-1 rounded-full border border-border-button-default bg-background-primary-default px-2.5 py-1.5 text-body-2-medium text-text-secondary sm:flex">
              <RiGitBranchLine className="size-3.5 shrink-0" aria-hidden /> Main
            </span>
            <span className="hidden rounded-full border border-border-button-default bg-background-primary-default px-2.5 py-1.5 text-body-2-medium text-text-secondary md:inline">project-sea</span>
            <span className="ms-auto flex items-center gap-2 text-body-2-medium text-text-secondary">
              Agent
              <span className="h-1.5 w-16 overflow-hidden rounded-full bg-background-tertiary-default sm:w-24">
                <span className="block h-full rounded-full bg-accent-500 transition-[width] duration-300" style={{ width: `${progress}%` }} />
              </span>
              {progress >= 100 ? "Done" : `${progress}%`}
            </span>
          </div>

          <div ref={scrollRef} className="min-h-0 flex-1 overflow-y-auto scroll-smooth">
            <div className="mx-auto flex w-full max-w-3xl flex-col gap-5 px-4 pt-5 pb-6">
              {messages.length === 0 ? (
                <div className="flex flex-col items-center gap-4 pt-16 text-center">
                  <h2 className="text-title-2-medium text-text-primary">What can I help with?</h2>
                  <p className="text-body-regular text-text-secondary">Demo mode: the answers are scripted. No model key needed.</p>
                  <div className="flex flex-wrap justify-center gap-2">
                    {["Update the color tokens for dark mode", "Run lint and a production build", "What can this template do?"].map((s) => (
                      <button key={s} type="button" onClick={() => submit(s)} className="cursor-pointer rounded-full bg-background-primary-default px-3.5 py-2 text-body-regular text-text-secondary shadow-xs transition-colors hover:bg-background-primary-hover">
                        {s}
                      </button>
                    ))}
                  </div>
                </div>
              ) : (
                messages.map((message) => (
                  <AgentMessage key={message.id} role={message.role} text={message.text} streaming={busy && message.id === messages[messages.length - 1]?.id && message.role === "assistant"} at={message.at} />
                ))
              )}
              {busy && <AgentThinking variant="wave" label="Thinking" className="px-1" />}
            </div>
          </div>

          {terminalOpen && (
            <div className="mx-3 mb-2 shrink-0 overflow-hidden rounded-xl border border-border-button-default bg-background-primary-default">
              <div className="flex items-center justify-between border-b border-separator-border px-3 py-1.5">
                <span className="flex items-center gap-1.5 text-body-2-medium text-text-secondary"><RiTerminalBoxLine className="size-4" aria-hidden /> Terminal</span>
                <button type="button" aria-label="Close terminal" onClick={() => setTerminalOpen(false)} className="cursor-pointer text-text-tertiary hover:text-text-primary"><RiCloseLine className="size-4" aria-hidden /></button>
              </div>
              <pre className="overflow-x-auto px-3 py-2 text-body-2-regular whitespace-pre text-text-secondary">{TERMINAL_LINES.join("\n")}</pre>
            </div>
          )}

          <div className="shrink-0 px-3 pb-3">
            <div className="mx-auto w-full max-w-3xl">
              <AgentComposer value={input} onValueChange={setInput} onSubmit={() => submit(input)} onStop={stopGenerating} busy={busy} model={model} provider="Demo mode" messageCount={messages.length} />
            </div>
          </div>
        </div>

        {/* Thread rail (original thread list), wide screens only */}
        <AgentChatHistory threads={threads} activeId={activeId} onSelect={selectThread} onNewChat={startNewChat} onRename={renameThread} onToggleUnread={toggleUnread} onDelete={deleteThread} onExport={exportThreads} disabled={busy} className="hidden 2xl:flex" />

        {/* Code panel */}
        {panelOpen && (
          <>
            <button type="button" aria-label="Close code panel" onClick={() => setPanelOpen(false)} className="absolute inset-0 z-30 cursor-pointer bg-black/40 xl:hidden" />
            <section aria-label="Code panel" className="absolute inset-y-3 right-3 z-40 flex w-[min(480px,92vw)] flex-col overflow-hidden rounded-3xl border border-border-button-default bg-background-secondary-default shadow-card xl:static xl:inset-auto xl:z-auto xl:w-auto xl:shrink-0 xl:shadow-none">
              <div className="hidden h-full w-full xl:block" style={{ width: panelExpanded ? 640 : panelWidth }}>
                <CodePanelInner
                  tab={panelTab}
                  onTab={setPanelTab}
                  undone={changesUndone}
                  files={shownChanges}
                  onUndo={() => setChangesUndone(true)}
                  onRestore={() => setChangesUndone(false)}
                  onClose={() => setPanelOpen(false)}
                  onExpand={() => { setPanelExpanded((e) => !e); setPanelWidth((w) => (w >= 640 ? 400 : 640)); }}
                  expanded={panelExpanded}
                  onDragStart={onDragStart}
                  terminalOpen={terminalOpen}
                  onTerminal={() => setTerminalOpen((o) => !o)}
                />
              </div>
              <div className="flex min-h-0 w-full flex-1 flex-col xl:hidden">
                <CodePanelInner
                  tab={panelTab}
                  onTab={setPanelTab}
                  undone={changesUndone}
                  files={shownChanges}
                  onUndo={() => setChangesUndone(true)}
                  onRestore={() => setChangesUndone(false)}
                  onClose={() => setPanelOpen(false)}
                  onExpand={() => setPanelOpen(false)}
                  expanded={false}
                  onDragStart={onDragStart}
                  terminalOpen={terminalOpen}
                  onTerminal={() => setTerminalOpen((o) => !o)}
                />
              </div>
            </section>
          </>
        )}
      </div>
    </div>
  );
}

function CodePanelInner({
  tab, onTab, undone, files, onUndo, onRestore, onClose, onExpand, expanded, onDragStart, terminalOpen, onTerminal,
}: {
  tab: "code" | "changes" | "browser";
  onTab: (t: "code" | "changes" | "browser") => void;
  undone: boolean;
  files: typeof CHANGED_FILES;
  onUndo: () => void;
  onRestore: () => void;
  onClose: () => void;
  onExpand: () => void;
  expanded: boolean;
  onDragStart: (e: React.PointerEvent) => void;
  terminalOpen: boolean;
  onTerminal: () => void;
}) {
  return (
    <div className="relative flex h-full min-h-0 w-full flex-col">
      {/* drag handle (desktop) */}
      <button type="button" aria-label="Resize code panel" onPointerDown={onDragStart} className="absolute inset-y-0 -left-2 z-10 hidden w-4 cursor-ew-resize xl:block" />
      <header className="flex h-12 shrink-0 items-center gap-1 border-b border-separator-border px-3">
        <div className="flex items-center gap-0.5 rounded-full bg-background-primary-default p-0.5" role="tablist" aria-label="Code panel tabs">
          {([["code", "Code", RiCodeSSlashLine], ["changes", "Changes", RiBracesLine], ["browser", "Browser", RiSearchLine]] as const).map(([key, label, Icon]) => (
            <button key={key} type="button" role="tab" aria-selected={tab === key} onClick={() => onTab(key)} className={cx("flex cursor-pointer items-center gap-1 rounded-full px-2.5 py-1 text-body-2-medium transition-colors", tab === key ? "bg-background-secondary-default text-text-primary shadow-xs" : "text-text-secondary hover:text-text-primary")}>
              <Icon className="size-3.5" aria-hidden /> {label}
            </button>
          ))}
        </div>
        <div className="ms-auto flex shrink-0 items-center gap-0.5">
          <IconButton icon={RiTerminalBoxLine} size="small" aria-label="Open terminal" onClick={onTerminal} className={cx(terminalOpen && "bg-background-secondary-hover")} />
          <IconButton icon={RiExpandDiagonalLine} size="small" aria-label="Expand panel" onClick={onExpand} className={cx(expanded && "bg-background-secondary-hover")} />
          <IconButton icon={RiCloseLine} size="small" aria-label="Close code" onClick={onClose} />
        </div>
      </header>

      {tab === "code" && (
        <div className="min-h-0 flex-1 overflow-y-auto">
          <div className="flex items-center justify-between px-4 pt-3 pb-1">
            <p className="truncate text-body-2-medium text-text-secondary">boardui/app/components/button.tsx</p>
            <span className="shrink-0 rounded-md bg-status-purple-background px-1.5 py-0.5 text-body-2-medium text-status-purple-text">+74 New</span>
          </div>
          <pre className="overflow-x-auto px-4 pb-4 text-body-2-regular leading-6 whitespace-pre text-text-secondary">
            {CODE_LINES.map((line, i) => (
              <span key={i} className="block">
                <span className="me-3 inline-block w-5 text-end text-text-tertiary select-none">{i + 1}</span>
                <span className="text-text-primary">{line}</span>
              </span>
            ))}
          </pre>
        </div>
      )}

      {tab === "changes" && (
        <div className="min-h-0 flex-1 overflow-y-auto px-4 py-3">
          <div className="flex items-center justify-between gap-2">
            <p className="text-title-3-semibold text-text-primary">{undone ? "0 Uncomitted changes" : "12 Uncomitted changes"}</p>
            <p className="shrink-0 text-body-2-medium whitespace-nowrap"><span className="text-text-primary">+156</span> <span className="text-text-error-primary">−23</span></p>
          </div>
          {undone ? (
            <div className="flex flex-col items-start gap-2 pt-4">
              <p className="text-body-regular text-text-secondary">All changes undone. Nothing to commit.</p>
              <button type="button" onClick={onRestore} className="flex cursor-pointer items-center gap-1.5 rounded-lg border border-border-button-default bg-background-primary-default px-2.5 py-1.5 text-body-medium text-text-primary hover:bg-background-primary-hover">
                <RiArrowGoBackLine className="size-4" aria-hidden /> Restore changes
              </button>
            </div>
          ) : (
            <>
              <div className="flex flex-col gap-1.5 pt-3">
                {files.map((file) => (
                  <button key={file.path} type="button" onClick={() => onTab("code")} className="flex w-full cursor-pointer items-center gap-2 rounded-xl border border-border-button-default bg-background-primary-default px-3 py-2 text-start hover:bg-background-primary-hover">
                    <RiFileCopyLine className="size-4 shrink-0 text-foreground-icon-secondary" aria-hidden />
                    <span className="min-w-0 flex-1 truncate text-body-medium text-text-primary">{file.path}</span>
                    <span className="shrink-0 text-body-2-medium text-text-secondary">+{file.added}</span>
                    <span className="shrink-0 rounded-md bg-status-purple-background px-1.5 py-0.5 text-body-2-medium text-status-purple-text">{file.status}</span>
                  </button>
                ))}
              </div>
              <button type="button" onClick={onUndo} className="mt-3 flex cursor-pointer items-center gap-1.5 rounded-lg border border-border-button-default bg-background-primary-default px-2.5 py-1.5 text-body-medium text-text-primary hover:bg-background-primary-hover">
                <RiArrowGoBackLine className="size-4" aria-hidden /> Undo changes
              </button>
            </>
          )}
        </div>
      )}

      {tab === "browser" && (
        <div className="min-h-0 flex-1 overflow-y-auto px-4 py-3">
          <div className="flex items-center gap-2 rounded-lg border border-border-button-default bg-background-primary-default px-2.5 py-1.5">
            <RiSearchLine className="size-4 shrink-0 text-foreground-icon-secondary" aria-hidden />
            <span className="min-w-0 flex-1 truncate text-body-2-medium text-text-secondary">localhost:3000</span>
          </div>
          <div className="mt-3 overflow-hidden rounded-xl border border-border-button-default bg-background-primary-default">
            <div className="flex items-center gap-2 border-b border-separator-border px-3 py-2">
              <span className="size-2.5 rounded-full bg-chart-1" />
              <span className="size-2.5 rounded-full bg-chart-2" />
              <span className="size-2.5 rounded-full bg-chart-3" />
              <span className="ms-2 text-body-2-medium text-text-tertiary">Preview — Home Dashboard</span>
            </div>
            <div className="flex flex-col gap-2 p-3">
              <div className="h-8 w-2/3 rounded-lg bg-background-tertiary-default" />
              <div className="grid grid-cols-3 gap-2">
                <div className="h-14 rounded-lg bg-background-tertiary-default" />
                <div className="h-14 rounded-lg bg-background-tertiary-default" />
                <div className="h-14 rounded-lg bg-background-tertiary-default" />
              </div>
              <div className="h-24 rounded-lg bg-background-tertiary-default" />
              <p className="pt-1 text-body-2-regular text-text-tertiary">Live preview of the running app after the agent&apos;s edits.</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
