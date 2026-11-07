"use client";

import {
  RiAddLine,
  RiArrowDownSLine,
  RiArrowUpLine,
  RiCloseLine,
  RiDownloadLine,
  RiExpandDiagonalLine,
  RiImageAddLine,
  RiImageAiLine,
  RiFileCopyLine,
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
  RiThumbDownLine,
  RiThumbUpLine,
} from "@remixicon/react";
import { Fragment, useCallback, useEffect, useRef, useState, type ReactNode } from "react";

import { AllTemplatesButton } from "@/components/application/template-switcher/all-templates-button";
import { DocumentTitle } from "@/components/application/app-shell/document-title";
import { ComposerLoader } from "@/components/application/composer-loader/composer-loader";
import { ThemeToggle } from "@/components/application/theme/theme-toggle";
import { IconButton } from "@/components/base/buttons/icon-button";
import { cx } from "@/utils/cx";

/**
 * AI Image Generation template replica.
 * Official: boardui.com/templates/ai-image-generation — "vibl coding
 * project / image generation" thread, Messi prompt, Fable 5 / Main /
 * project-sea, Gallery / Styles panel, 21 gallery images (the completed
 * Messi generation first, then the 20 gallery originals), 57% ring.
 *
 * Source of truth: tpl-pages/ai-image-generation.html (BoardUI SSR
 * snapshot) plus the live page (harness probe 2026-11-08): the live
 * thread completes the Messi generation — "Image generated" with the
 * countdown at 0 seconds remaining and the result revealed through a
 * feathered radial mask, with Good / Bad / Copy feedback — so the
 * generation result is rendered after the Messi prompt (see
 * GenerationResult below). Anything the snapshot does not show (avatar
 * menu items, attachment menu items, model options, Main / project-sea /
 * Agent dropdown contents, More options, Styles tab content, Enlarge /
 * Download / More actions behaviour) is marked "待实测确认" in
 * audit/ai-image-generation-gaps.md and is NOT invented here.
 *
 * The 20 gallery images are the originals, downloaded from
 * www.boardui.com/ai-chat/gallery/*.webp into public/ai-chat/gallery/
 * (all 20 HTTP 200, verified WebP). Sidebar / composer / status row are
 * local to this file on purpose: the shared DashboardSidebar /
 * AgentComposer carry the wrong nav and the wrong composer behaviour for
 * this template, and shared components must not be edited by this task.
 */

// Fixed anchor so server and client render the same relative times.
const NOW = 1794015600000;

type ChatMsg = { id: string; role: "user"; text: string; at: number };

type ThreadItem = { id: string; title: string; badge: string; messages: ChatMsg[] };
type RepoGroup = { name: string; open: boolean; threads: ThreadItem[] };

const MESSI_PROMPT =
  "Create a vintage editorial illustration of Lionel Messi dribbling in Argentina's home kit against a blue background.";

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
      {
        id: "image-generation",
        title: "image generation",
        badge: "now",
        messages: [{ id: "m-user-1", role: "user", text: MESSI_PROMPT, at: NOW - 1000 * 60 * 12 }],
      },
      { id: "coding-scenario", title: "coding scenario", badge: "now", messages: [] },
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

// 21 gallery originals (prompt + file + original aspect-ratio, verbatim from
// the original page; the first is the completed Messi generation — the
// original /ai-chat/generated-footballer.jpg, not a gallery webp — then the
// 20 gallery webps; left masonry column = first 7, right column = rest 14).
const GALLERY_ITEMS = [
  { slug: "generated-footballer", prompt: "Vintage editorial Messi, Argentina kit", ratio: "449/600", src: "/ai-chat/generated-footballer.jpg" },
  { slug: "green-ape", prompt: "Green ape, screenprint halftone", ratio: "1/1" },
  { slug: "cloud-crown", prompt: "Cloud crown, editorial portrait", ratio: "1333/2000" },
  { slug: "cat-with-beer", prompt: "Cat with a beer, bold linework", ratio: "928/1232" },
  { slug: "hanok-bookshop", prompt: "Hanok bookshop, pastel duotone", ratio: "928/1232" },
  { slug: "nairobi-vibes", prompt: "Nairobi Vibes, blackletter poster", ratio: "928/1232" },
  { slug: "ronin-red", prompt: "Ronin in red, cel-shaded", ratio: "1120/2000" },
  { slug: "bloom-swirl", prompt: "Bloom swirl, impasto abstraction", ratio: "1/1" },
  { slug: "hoopoes", prompt: "Hoopoes in olive branches, gouache", ratio: "1333/2000" },
  { slug: "girls-and-blooms", prompt: "Girls and blooms, painterly crop", ratio: "896/1344" },
  { slug: "biker-rest", prompt: "Biker resting, watercolour manga", ratio: "1120/2000" },
  { slug: "beach-kid", prompt: "Beach kid, 35mm flash", ratio: "960/1200" },
  { slug: "reader-pink", prompt: "Reader on pink, crayon texture", ratio: "1/1" },
  { slug: "underwater-highway", prompt: "Underwater highway, flat vector", ratio: "1120/2000" },
  { slug: "perfume-still-life", prompt: "Perfume still life, grainy neon", ratio: "1120/2000" },
  { slug: "yellow-cabs", prompt: "Yellow cabs, palette-knife oil", ratio: "1497/2000" },
  { slug: "goldfish-living-room", prompt: "Goldfish living room, surreal collage", ratio: "1120/2000" },
  { slug: "linen-campaign", prompt: "Linen campaign, crimson backdrop", ratio: "1/1" },
  { slug: "helmet-portraits", prompt: "Helmet portraits, risograph grid", ratio: "1497/2000" },
  { slug: "racing-suit", prompt: "Racing suit editorial, metallic green", ratio: "1120/2000" },
  { slug: "massive-box", prompt: "MASSIV3 packaging, studio mockup", ratio: "1120/2000" },
];

export default function AiImageGenerationTemplatePage() {
  const [navOpen, setNavOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [repos, setRepos] = useState<RepoGroup[]>(REPOS);
  const [activeId, setActiveId] = useState("image-generation");
  const [messages, setMessages] = useState<ChatMsg[]>(REPOS[1].threads[1].messages);
  const [input, setInput] = useState("");
  const [busy, setBusy] = useState(false);
  const [model, setModel] = useState("Fable 5");
  const [project, setProject] = useState("project-sea");
  const [voiceOn, setVoiceOn] = useState(false);
  const [files, setFiles] = useState<string[]>([]);
  const [moreMenuOpen, setMoreMenuOpen] = useState(false);
  const [galleryOpen, setGalleryOpen] = useState(false);
  // Wide screens open with the gallery visible, like the original;
  // narrow screens start with the chat full-width and the gallery as a drawer.
  useEffect(() => {
    if (window.innerWidth >= 1280) setGalleryOpen(true);
  }, []);
  const [galleryWidth, setGalleryWidth] = useState(410);
  const [galleryExpanded, setGalleryExpanded] = useState(false);
  const [copied, setCopied] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const busyTimer = useRef<number | undefined>(undefined);

  useEffect(() => () => window.clearTimeout(busyTimer.current), []);

  const activeThread =
    ALL_THREADS.find((t) => t.id === activeId) ?? ALL_THREADS[1];

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, busy]);

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
      // The live original completes a generation with the result frame;
      // a newly submitted prompt only adds the user bubble and runs the
      // composer loader; no canned assistant reply is invented.
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

  // Height follows the preview container when embedded in a docs preview
  // (--template-preview-height set by TemplatePreview), and falls back to
  // the full viewport on the standalone route.
  return (
    <div className="relative flex h-[var(--template-preview-height,100dvh)] w-full gap-4 overflow-hidden bg-background-full p-3">
      <DocumentTitle />
      <style>{`@keyframes agent-msg-in{from{opacity:0;filter:blur(6px);transform:translateY(6px)}to{opacity:1;filter:blur(0);transform:translateY(0)}}@keyframes agent-drawer-in{from{transform:translateX(110%)}to{transform:translateX(0)}}@keyframes agent-card-in{from{opacity:0;filter:blur(8px);transform:scale(0.95)}to{opacity:1;filter:blur(0);transform:scale(1)}}`}</style>
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
            <span className="truncate text-headline-medium text-text-primary">Image generation</span>
            <div className="ms-auto flex shrink-0 items-center gap-1">
              <AllTemplatesButton size="small" />
              <IconButton icon={RiImageAiLine} size="small" aria-label="Open gallery" onClick={() => setGalleryOpen(true)} />
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
                <Fragment key={message.id}>
                  <p
                    className="ms-auto w-fit max-w-[calc(50%+6px)] rounded-2xl bg-background-primary-default px-3 py-[11px] text-start text-body-regular break-words whitespace-pre-wrap text-text-primary shadow-card"
                    style={{ animation: "agent-msg-in 0.45s ease-out both" }}
                  >
                    {message.text}
                  </p>
                  {message.id === "m-vintage-messi" && <GenerationResult />}
                </Fragment>
              ))}
            </div>
          </div>

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

        {/* Gallery panel */}
        {galleryOpen && (
          <GalleryPanel
            width={galleryWidth}
            expanded={galleryExpanded}
            onExpand={() => {
              setGalleryExpanded((e) => !e);
              setGalleryWidth((w) => (w >= 640 ? 410 : 640));
            }}
            onToggle={() => setGalleryOpen(false)}
            onClose={() => setGalleryOpen(false)}
            onResize={(w) => { setGalleryExpanded(false); setGalleryWidth(w); }}
            onNew={() => inputRef.current?.focus()}
          />
        )}
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Generation result (live, from the original page): the Vintage        */
/* editorial Messi prompt completes into this frame — "Image generated" */
/* with the countdown at 0 seconds remaining, the result revealed       */
/* through a feathered radial mask, and Good / Bad / Copy feedback.    */
/* ------------------------------------------------------------------ */

function GenerationResult() {
  const [feedback, setFeedback] = useState<"good" | "bad" | null>(null);
  const [copied, setCopied] = useState(false);
  const copyTimer = useRef<number | undefined>(undefined);

  useEffect(() => () => window.clearTimeout(copyTimer.current), []);

  const onCopy = () => {
    navigator.clipboard?.writeText("Vintage editorial Messi, Argentina kit").catch(() => {});
    setCopied(true);
    window.clearTimeout(copyTimer.current);
    copyTimer.current = window.setTimeout(() => setCopied(false), 2000);
  };

  const feedbackBtn =
    "group flex cursor-pointer items-center rounded-lg bg-background-tertiary-default p-1.5 hover:bg-background-secondary-hover outline-none focus-visible:ring-2 focus-visible:ring-border-focus-ring";
  const feedbackIcon = "size-4 text-foreground-icon-secondary";

  return (
    <div className="flex w-full flex-col items-start gap-2">
      <div className="flex w-[200px] items-baseline text-body-regular">
        <span className="text-text-primary">Image generated</span>
      </div>
      <div className="w-[200px] overflow-hidden">
        <div
          className="relative h-[250px] w-[200px] overflow-hidden rounded-2xl bg-background-primary-default shadow-card"
          aria-live="polite"
          aria-label="Generated image: Vintage-style illustration of a football player in Argentina's striped kit"
        >
          <canvas aria-hidden className="absolute inset-0 size-full opacity-0" width={200} height={250} />
          <div
            className="absolute inset-0"
            style={
              {
                "--reveal": "132%",
                maskImage:
                  "radial-gradient(circle at 50% 50%, #000 calc(var(--reveal) - 26%), transparent var(--reveal))",
              } as React.CSSProperties
            }
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/ai-chat/generated-footballer.jpg"
              alt="Vintage-style illustration of a football player in Argentina's striped kit"
              className="size-full object-cover"
            />
          </div>
          <div className="absolute inset-x-3 bottom-3 flex items-center justify-between gap-3 text-body-2-medium text-text-tertiary opacity-0">
            <span className="agent-progress-loading-text">Generating image</span>
            <span className="flex items-baseline gap-0.5">
              <span>0</span>
              <span>s</span>
              <span className="sr-only">0 seconds remaining</span>
            </span>
          </div>
        </div>
      </div>
      <div className="flex items-center gap-1.5">
        <button type="button" aria-label="Good response" aria-pressed={feedback === "good"} onClick={() => setFeedback((f) => (f === "good" ? null : "good"))} className={cx(feedbackBtn, feedback === "good" && "bg-background-secondary-hover")}>
          <RiThumbUpLine className={feedbackIcon} aria-hidden />
        </button>
        <button type="button" aria-label="Bad response" aria-pressed={feedback === "bad"} onClick={() => setFeedback((f) => (f === "bad" ? null : "bad"))} className={cx(feedbackBtn, feedback === "bad" && "bg-background-secondary-hover")}>
          <RiThumbDownLine className={feedbackIcon} aria-hidden />
        </button>
        <button type="button" aria-label="Copy response" onClick={onCopy} className={feedbackBtn}>
          <RiFileCopyLine className={feedbackIcon} aria-hidden />
        </button>
        {copied && (
          <span role="status" className="text-body-2-medium text-text-secondary">
            Copied to clipboard.
          </span>
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
/* Gallery panel: 410px, Gallery/Styles pills, masonry, separator     */
/* ------------------------------------------------------------------ */

function GalleryPanel({
  width, expanded, onExpand, onToggle, onClose, onResize, onNew,
}: {
  width: number;
  expanded: boolean;
  onExpand: () => void;
  onToggle: () => void;
  onClose: () => void;
  onResize: (w: number) => void;
  onNew: () => void;
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
        <aside className="flex h-full w-full shrink-0 flex-col gap-2.5 overflow-hidden pt-2" aria-label="Gallery panel">
          <GalleryPanelInner
            expanded={expanded}
            onExpand={onExpand}
            onToggle={onToggle}
            onClose={onClose}
            onNew={onNew}
            mobile={false}
          />
        </aside>
      </div>

      {/* Mobile drawer (original: w-[min(410px,calc(100%_-_12px))]) */}
      <div className="fixed inset-0 z-50 flex xl:hidden">
        <button type="button" aria-label="Close gallery" onClick={onClose} className="absolute inset-0 cursor-pointer bg-black/40" />
        <div className="absolute inset-y-0 end-0 flex w-[min(410px,calc(100%_-_12px))] flex-col bg-background-full p-3 shadow-sidebar" style={{ animation: "agent-drawer-in 0.3s ease-in-out both" }}>
          <div className="flex items-center justify-between px-1 pb-2">
            <span className="text-headline-medium text-text-primary">Gallery</span>
            <IconButton icon={RiCloseLine} size="small" aria-label="Close gallery" onClick={onClose} />
          </div>
          <div className="flex min-h-0 flex-1 flex-col overflow-hidden rounded-3xl border border-border-button-default bg-background-secondary-default">
            <GalleryPanelInner
              expanded={false}
              onExpand={onClose}
              onToggle={onClose}
              onClose={onClose}
              onNew={() => { onClose(); onNew(); }}
              mobile
            />
          </div>
        </div>
      </div>
    </>
  );
}

function GalleryPanelInner({
  expanded, onExpand, onToggle, onClose, onNew, mobile,
}: {
  expanded: boolean;
  onExpand: () => void;
  onToggle: () => void;
  onClose: () => void;
  onNew: () => void;
  mobile: boolean;
}) {
  const [tab, setTab] = useState<"gallery" | "styles">("gallery");
  const [moreFor, setMoreFor] = useState<string | null>(null);

  return (
    <div className="flex h-full min-h-0 w-full flex-col">
      <div className="flex h-[30px] w-full shrink-0 items-center justify-between px-1 pt-0">
        <div role="group" aria-label="Panel view" className="relative inline-flex items-center gap-1">
          <button
            type="button"
            aria-pressed={tab === "gallery"}
            data-pill-selected={tab === "gallery" ? "" : undefined}
            data-pill-variant="blue"
            onClick={() => setTab("gallery")}
            className="group relative z-10 flex shrink-0 cursor-pointer items-center gap-1 rounded-full px-2 py-[5px] outline-none transition-colors duration-150 ease focus-visible:ring-2 focus-visible:ring-border-focus-ring"
          >
            <span aria-hidden="true" className={cx("pointer-events-none absolute inset-0 rounded-full bg-pill-tab-blue-hover-background transition-opacity duration-200 ease-out", tab === "gallery" ? "opacity-0" : "opacity-0 group-hover:opacity-100")} />
            <RiImageAiLine className={cx("relative z-10 size-5 shrink-0", tab === "gallery" ? "text-accent-500" : "text-foreground-icon-secondary")} aria-hidden />
            <span className={cx("relative z-10 text-body-medium whitespace-nowrap", tab === "gallery" ? "text-accent-500" : "text-text-secondary")}>Gallery</span>
          </button>
          <button
            type="button"
            aria-pressed={tab === "styles"}
            data-pill-variant="blue"
            onClick={() => setTab("styles")}
            className="group relative z-10 flex shrink-0 cursor-pointer items-center gap-1 rounded-full px-2 py-[5px] outline-none transition-colors duration-150 ease focus-visible:ring-2 focus-visible:ring-border-focus-ring"
          >
            <span aria-hidden="true" className={cx("pointer-events-none absolute inset-0 rounded-full bg-pill-tab-blue-hover-background transition-opacity duration-200 ease-out", tab === "styles" ? "opacity-0" : "opacity-0 group-hover:opacity-100")} />
            <RiImageAddLine className={cx("relative z-10 size-5 shrink-0", tab === "styles" ? "text-accent-500" : "text-foreground-icon-secondary")} aria-hidden />
            <span className={cx("relative z-10 text-body-medium whitespace-nowrap", tab === "styles" ? "text-accent-500" : "text-text-secondary")}>Styles</span>
          </button>
        </div>
        <div className="flex items-center gap-2 pe-px">
          <button type="button" aria-label="New generation" onClick={onNew} className="group flex cursor-pointer items-center rounded-md p-0.5 transition-colors duration-150 ease hover:bg-background-primary-hover" tabIndex={0}>
            <RiImageAddLine className="size-[18px] text-foreground-icon-secondary transition-colors duration-150 ease group-hover:text-foreground-icon-primary" aria-hidden />
          </button>
          <button type="button" aria-label="Expand panel" onClick={onExpand} className="group flex cursor-pointer items-center rounded-md p-0.5 transition-colors duration-150 ease hover:bg-background-primary-hover" tabIndex={0}>
            <RiExpandDiagonalLine className={cx("size-[18px] transition-colors duration-150 ease group-hover:text-foreground-icon-primary", expanded ? "text-foreground-icon-primary" : "text-foreground-icon-secondary")} aria-hidden />
          </button>
          {mobile ? (
            <button type="button" aria-label="Close gallery" onClick={onClose} className="group flex cursor-pointer items-center rounded-md p-0.5 transition-colors duration-150 ease hover:bg-background-primary-hover" tabIndex={0}>
              <RiCloseLine className="size-[18px] text-foreground-icon-secondary transition-colors duration-150 ease group-hover:text-foreground-icon-primary" aria-hidden />
            </button>
          ) : (
            <button type="button" aria-label="Toggle panel" onClick={onToggle} className="group flex cursor-pointer items-center rounded-md p-0.5 transition-colors duration-150 ease hover:bg-background-primary-hover" tabIndex={0}>
              <RiSideBarLine className="size-[18px] text-foreground-icon-secondary transition-colors duration-150 ease group-hover:text-foreground-icon-primary" aria-hidden />
            </button>
          )}
        </div>
      </div>

      {tab === "gallery" && (
        <div className="min-h-0 w-full flex-1 overflow-y-auto [scrollbar-width:thin]">
          <div className="flex flex-col gap-2">
            <div className="flex gap-2">
              <div className="flex min-w-0 flex-1 flex-col gap-2">
                {GALLERY_ITEMS.slice(0, 7).map((item, i) => (
                  <GalleryFigure key={item.slug} item={item} index={i} moreFor={moreFor} onMore={setMoreFor} />
                ))}
              </div>
              <div className="flex min-w-0 flex-1 flex-col gap-2">
                {GALLERY_ITEMS.slice(7).map((item, i) => (
                  <GalleryFigure key={item.slug} item={item} index={i + 7} moreFor={moreFor} onMore={setMoreFor} />
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {tab === "styles" && (
        <div className="flex min-h-0 flex-1 items-start justify-center overflow-y-auto px-4 py-8">
          <p className="text-body-regular text-text-tertiary">Styles 选项内容待实测确认</p>
        </div>
      )}
    </div>
  );
}

function GalleryFigure({
  item, index, moreFor, onMore,
}: {
  item: (typeof GALLERY_ITEMS)[number];
  index: number;
  moreFor: string | null;
  onMore: (id: string | null) => void;
}) {
  const src = item.src ?? `/ai-chat/gallery/${item.slug}.webp`;
  const open = moreFor === item.slug;
  return (
    <figure
      className="group relative block overflow-hidden"
      style={{ borderRadius: 10, opacity: 0, animation: `agent-card-in 0.5s ease-out ${index * 60}ms both` }}
    >
      <div className="relative w-full bg-background-secondary-default" style={{ aspectRatio: item.ratio }}>
        <img
          alt={item.prompt}
          loading="lazy"
          decoding="async"
          src={src}
          className="object-cover transition-transform duration-300 ease-out group-hover:scale-[1.03]"
          style={{ position: "absolute", height: "100%", width: "100%", left: 0, top: 0, right: 0, bottom: 0 }}
        />
        <button
          type="button"
          aria-label={`Enlarge ${item.prompt}`}
          aria-expanded="false"
          onClick={() => window.open(src, "_blank", "noopener")}
          className="absolute inset-0 cursor-zoom-in outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-border-focus-ring"
        />
        <div className="pointer-events-none absolute inset-0 flex flex-col justify-between bg-linear-to-b from-neutral-950/40 via-transparent to-neutral-950/55 p-1.5 opacity-0 transition-opacity duration-200 ease-out group-hover:opacity-100">
          <span className="pointer-events-auto flex justify-end gap-1">
            <a
              href={src}
              download={`${item.slug}.webp`}
              aria-label={`Download ${item.prompt}`}
              className="flex cursor-pointer items-center rounded-md bg-neutral-950/45 p-1 backdrop-blur-sm transition-colors hover:bg-neutral-950/65"
            >
              <RiDownloadLine className="size-3.5 text-white" aria-hidden />
            </a>
            <span className="relative">
              <button
                type="button"
                aria-label={`More actions for ${item.prompt}`}
                aria-expanded={open}
                onClick={(e) => { e.stopPropagation(); onMore(open ? null : item.slug); }}
                className="flex cursor-pointer items-center rounded-md bg-neutral-950/45 p-1 backdrop-blur-sm transition-colors hover:bg-neutral-950/65"
              >
                <RiMore2Fill className="size-3.5 text-white" aria-hidden />
              </button>
              {open && (
                <>
                  <button type="button" aria-label="Close actions menu" onClick={() => onMore(null)} className="fixed inset-0 z-10 cursor-default" />
                  <span className="absolute end-0 top-8 z-20 w-44 rounded-xl border border-border-button-default bg-background-primary-default p-1.5 shadow-card">
                    <p className="px-2 py-1.5 text-body-2-regular text-text-tertiary">更多操作待实测确认</p>
                  </span>
                </>
              )}
            </span>
          </span>
          <figcaption className="px-0.5 text-white line-clamp-2 text-body-2-regular">{item.prompt}</figcaption>
        </div>
      </div>
    </figure>
  );
}
