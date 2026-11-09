"use client";

import {
  RiAddLine,
  RiArrowDownSLine,
  RiArrowDropDownLine,
  RiArrowUpLine,
  RiAttachment2,
  RiCheckLine,
  RiCloseLine,
  RiDownloadLine,
  RiExpandDiagonalLine,
  RiFocus3Line,
  RiImageAddLine,
  RiImageAiLine,
  RiFileCopyLine,
  RiHeadphoneLine,
  RiExpandUpDownLine,
  RiFolder2Line,
  RiFolderLine,
  RiFolderOpenLine,
  RiGitMergeLine,

  RiListCheck3,
  RiMenuLine,
  RiMic2Line,
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
import { Fragment, useCallback, useEffect, useMemo, useRef, useState, useSyncExternalStore, type ComponentType, type ReactNode } from "react";
import { AnimatePresence, motion, type Variants } from "motion/react";
import {
  Dialog as AriaDialog,
  DialogTrigger as AriaDialogTrigger,
  Popover as AriaPopover,
  Pressable,
  Slider as AriaSlider,
  SliderThumb as AriaSliderThumb,
  SliderTrack as AriaSliderTrack,
} from "react-aria-components";


import { AllTemplatesButton } from "@/components/application/template-switcher/all-templates-button";
import { DocumentTitle } from "@/components/application/app-shell/document-title";

import { ComposerLoader } from "@/components/application/composer-loader/composer-loader";
import { AgentThinking } from "@/components/application/agent-thinking/agent-thinking";
import { LiquidGlassChip, LiquidGlassSurface, LIQUID_GLASS_RESET } from "@/components/application/liquid-glass/liquid-glass";
import { SettingsModal } from "@/components/application/settings/settings-modal";
import { ThemeToggle, useThemeMode } from "@/components/application/theme/theme-toggle";
import { IconButton } from "@/components/base/buttons/icon-button";
import { RadioDot } from "@/components/base/radio/radio";
import { Tooltip, TooltipTrigger } from "@/components/base/tooltip/tooltip";
import { useDismissOnOutsidePress, useTriggerToggle } from "@/utils/use-dismiss-on-outside-press";
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
        messages: [{ id: "m-vintage-messi", role: "user", text: MESSI_PROMPT, at: NOW - 1000 * 60 * 12 }],
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
// 20 gallery webps; three masonry columns, 8 / 7 / 6 top to bottom, as on
// the original live page).
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

// Original model menu (3oxmuz9pqr-wm.js, ModelMenu / ModelSettingsPanel):
// models + effort levels, defaults "Fable 5" and index 1 ("Medium").
const MODELS = ["Composer 2.5", "GPT-5.6 Sol", "Fable 5", "Sonnet 5"];
const EFFORT_LEVELS = ["Low", "Medium", "Balanced", "High", "Very High", "Max"];

// Original project menu (3oxmuz9pqr-wm.js, ProjectFolderMenu), default first.
const PROJECTS = [
  { prefix: "users/mertcan/", name: "project-sea" },
  { prefix: "users/desktop/", name: "vibl" },
  { prefix: "users/documents/", name: "boardui" },
];

// Original voice-on mic bars (3oxmuz9pqr-wm.js, Composer): 4 bars, the
// .bui-composer-mic-bar keyframes live in styles/globals.css.
const MIC_BARS = [
  { height: 8, duration: "0.9s", delay: "-0.4s" },
  { height: 15, duration: "0.7s", delay: "-0.15s" },
  { height: 11, duration: "1.05s", delay: "-0.6s" },
  { height: 14, duration: "0.8s", delay: "-0.3s" },
];

// Original attachment menu rows (3oxmuz9pqr-wm.js, AddMenu). The plugin
// SVGs are the originals from www.boardui.com/ai-chat/.
type AddMenuRow = {
  icon?: ComponentType<{ className?: string; "aria-hidden"?: boolean | "true" | "false" }>;
  image?: string;
  darkImage?: string;
  label: string;
  description?: string;
};
const ADD_ROWS: AddMenuRow[] = [
  { icon: RiAttachment2, label: "Files and folders" },
  { icon: RiFocus3Line, label: "Goal", description: "Set a goal for faster results" },
  { icon: RiListCheck3, label: "Plan mode", description: "Manage complex tasks" },
];
const PLUGIN_ROWS: AddMenuRow[] = [
  { image: "/ai-chat/plugin-documents.svg", darkImage: "/ai-chat/plugin-documents-dark.svg", label: "Documents", description: "Create and edit documents" },
  { image: "/ai-chat/plugin-spreadsheets.svg", label: "Spreadsheets", description: "Generate spreadsheets" },
  { image: "/ai-chat/plugin-presentations.svg", label: "Presentations", description: "Create marketing assets" },
  { image: "/ai-chat/plugin-codeblocks.svg", label: "Code blocks", description: "Write and edit existing code" },
];

// Shared popover surface for the model / project menus (3oxmuz9pqr-wm.js:
// the `x` class — 266px, origin-bottom-left, dropdown shadow, 150ms
// enter/exit with scale 0.95 + 2px blur). The attachment menu is wider
// (361px) with p-2 instead of p-2.5.
const MENU_POPOVER_CLASS = cx(
  "w-[266px] max-w-[calc(100vw-32px)] origin-bottom-left",
  "rounded-2xl border border-border-button-default bg-background-primary-default p-2.5 shadow-dropdown",
  "transition duration-150 ease-out",
  "data-[entering]:opacity-0 data-[entering]:scale-95 data-[entering]:blur-[2px]",
  "data-[exiting]:opacity-0 data-[exiting]:scale-95 data-[exiting]:blur-[2px]",
);
const ADD_POPOVER_CLASS = cx(
  "w-[361px] max-w-[calc(100vw-32px)] origin-bottom-left",
  "rounded-2xl border border-border-button-default bg-background-primary-default p-2 shadow-dropdown",
  "transition duration-150 ease-out",
  "data-[entering]:opacity-0 data-[entering]:scale-95 data-[entering]:blur-[2px]",
  "data-[exiting]:opacity-0 data-[exiting]:scale-95 data-[exiting]:blur-[2px]",
);

// Original generation-frame entrance variants (2x-mkcjonn738.js, D):
// outer fades with staggered children; the header slides up out of blur;
// the card grows 0 -> 250px tall while fading out of blur.
const GEN_OUTER_VARIANTS: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.4, ease: "easeOut", staggerChildren: 0.18 } },
};
const GEN_HEADER_VARIANTS: Variants = {
  hidden: { opacity: 0, y: 6, filter: "blur(6px)" },
  visible: { opacity: 1, y: 0, filter: "blur(0px)", transition: { duration: 0.5, ease: [0.25, 0.1, 0.25, 1] } },
};
const GEN_CARD_VARIANTS: Variants = {
  hidden: { height: 0, opacity: 0, filter: "blur(6px)" },
  visible: {
    height: 250,
    opacity: 1,
    filter: "blur(0px)",
    transition: {
      height: { duration: 0.55, ease: [0.22, 1, 0.36, 1] },
      opacity: { duration: 0.35, ease: "easeOut" },
      filter: { duration: 0.35, ease: "easeOut" },
    },
  },
};

// User-message entrance (2x-mkcjonn738.js, S + Line/w): the bubble is a
// motion.div, outer fades in 0.4s (children stagger 0.18s), the inner line
// rises 6px out of blur over 0.5s. Same numbers as the generation frame's
// v/b — they are the same variants in the original.
const MSG_OUTER_VARIANTS: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.4, ease: "easeOut", staggerChildren: 0.18 } },
};
const MSG_INNER_VARIANTS: Variants = {
  hidden: { opacity: 0, y: 6, filter: "blur(6px)" },
  visible: { opacity: 1, y: 0, filter: "blur(0px)", transition: { duration: 0.5, ease: [0.25, 0.1, 0.25, 1] } },
};

// Original composer placeholder (3oxmuz9pqr-wm.js, Composer): "Ask me"
// below 640px, "Ask me anything" otherwise.
const subscribeNarrow = (onChange: () => void) => {
  const mq = window.matchMedia("(max-width: 639px)");
  mq.addEventListener("change", onChange);
  return () => mq.removeEventListener("change", onChange);
};

export function AiImageGenerationTemplate({ showTemplateSwitcher = false }: { showTemplateSwitcher?: boolean }) {
  const [navOpen, setNavOpen] = useState(false);

  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [repos, setRepos] = useState<RepoGroup[]>(REPOS);
  const [activeId, setActiveId] = useState("image-generation");
  const [messages, setMessages] = useState<ChatMsg[]>(REPOS[1].threads[1].messages);
  const [input, setInput] = useState("");
  const [busy, setBusy] = useState(false);
  const [model, setModel] = useState("Fable 5");
  const [effort, setEffort] = useState(1);
  const [project, setProject] = useState("project-sea");
  const [voiceOn, setVoiceOn] = useState(false);
  const [files, setFiles] = useState<string[]>([]);
  const [moreMenuOpen, setMoreMenuOpen] = useState(false);
  const [galleryOpen, setGalleryOpen] = useState(false);
  // Which user messages already have their generation frame mounted. The
  // original plays its thread on a timer (2x-mkcjonn738.js, O): the user
  // bubble first, the generation frame 900ms later.
  const [genVisible, setGenVisible] = useState<Record<string, boolean>>({});
  const genTimer = useRef<number | undefined>(undefined);
  // Which message's generation currently owns `busy`. The seeded Messi
  // frame and a user-submitted frame can overlap (submit within the first
  // ~5s); only the latest generation may clear `busy`, otherwise the
  // seeded frame's completion would re-enable Send mid-generation.
  const busyForId = useRef<string | null>(null);
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

  useEffect(() => () => window.clearTimeout(genTimer.current), []);

  // The seeded Messi thread plays like the original: bubble on mount, the
  // generation frame 900ms later.
  useEffect(() => {
    const t = window.setTimeout(() => setGenVisible((prev) => ({ ...prev, "m-vintage-messi": true })), 900);
    return () => window.clearTimeout(t);
  }, []);

  const activeThread =
    ALL_THREADS.find((t) => t.id === activeId) ?? ALL_THREADS[1];

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, busy, genVisible]);

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
      // Like the original's thread player: the user bubble appears at once,
      // the working state (AgentThinking + ComposerLoader glass) runs, and
      // the generation frame mounts 900ms later — the result is never shown
      // outright. The frame itself runs its own 4s countdown and calls
      // onGenerated when the image is revealed, which clears `busy`.
      const id = `u-${Date.now()}`;
      setMessages((prev) => [...prev, { id, role: "user", text: trimmed, at: Date.now() }]);
      setInput("");
      setBusy(true);
      busyForId.current = id;
      window.clearTimeout(genTimer.current);
      genTimer.current = window.setTimeout(() => {
        setGenVisible((prev) => ({ ...prev, [id]: true }));
      }, 900);
    },
    [busy],
  );

  const handleGenerated = useCallback((id: string) => {
    if (busyForId.current === id) {
      busyForId.current = null;
      setBusy(false);
    }
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
    onOpenSettings: () => setSettingsOpen(true),
  };

  // Height follows the preview container when embedded in a docs preview
  // (--template-preview-height set by TemplatePreview), and falls back to
  // the full viewport on the standalone route.
  return (
    <>
    <div className="relative flex h-[var(--template-preview-height,100dvh)] w-full gap-4 overflow-hidden bg-background-full p-3">
      <DocumentTitle />
      <style>{`@keyframes agent-drawer-in{from{transform:translateX(110%)}to{transform:translateX(0)}}@keyframes agent-card-in{from{opacity:0;filter:blur(8px);transform:scale(0.95)}to{opacity:1;filter:blur(0);transform:scale(1)}}`}</style>
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
              <IconButton icon={RiShareLine} size="small" aria-label="Share chat" onClick={shareChat} />
              <div className="relative">
                <IconButton icon={RiMore2Fill} size="small" aria-label="More options" onClick={() => setMoreMenuOpen((o) => !o)} />
                {moreMenuOpen && (
                  <>
                    <button type="button" aria-label="Close menu" onClick={() => setMoreMenuOpen(false)} className="fixed inset-0 z-10 cursor-default" />
                    <div className="absolute end-0 top-9 z-20 w-56 rounded-xl border border-border-button-default bg-background-primary-default p-1.5 shadow-card">
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
            <div className="flex min-h-full flex-col justify-end gap-3 px-4 pt-4 pb-6">
              {messages.map((message) => (
                <Fragment key={message.id}>
                  <motion.div
                    layout
                    variants={MSG_OUTER_VARIANTS}
                    initial="hidden"
                    animate="visible"
                    className="-me-1.5 ms-auto flex w-fit max-w-[calc(50%+6px)] flex-col rounded-2xl bg-background-primary-default px-3 py-[11px] text-start text-body-regular text-text-primary shadow-card"
                  >
                    <motion.div variants={MSG_INNER_VARIANTS}>
                      <p className="break-words whitespace-pre-wrap">{message.text}</p>
                    </motion.div>
                  </motion.div>
                  {genVisible[message.id] && <GenerationResult messageId={message.id} onGenerated={handleGenerated} />}
                </Fragment>
              ))}
            </div>
          </div>

          <div className="shrink-0 px-2.5 pt-3 pb-2.5">
            <LocalComposer
              value={input}
              onValueChange={setInput}
              onSubmit={() => submit(input)}
              busy={busy}
              model={model}
              onModelChange={setModel}
              effort={effort}
              onEffortChange={setEffort}
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

      <SettingsModal
        isOpen={settingsOpen}
        onClose={() => setSettingsOpen(false)}
        defaultPage="general"
        planArtSrc="/templates/settings-plan-art.png"
      />
    </div>
    {showTemplateSwitcher && (
      <AllTemplatesButton size="small" className="fixed right-4 bottom-28 z-50 shadow-lg xl:bottom-4" />
    )}
    </>
  );
}

export default function AiImageGenerationTemplatePage() {
  return <AiImageGenerationTemplate showTemplateSwitcher />;
}

/* ------------------------------------------------------------------ */
/* Generation result (live, from the original page): the Vintage        */
/* editorial Messi prompt completes into this frame — "Image generated" */
/* with the countdown at 0 seconds remaining, the result revealed       */
/* through a feathered radial mask, and Good / Bad / Copy feedback.    */
/* ------------------------------------------------------------------ */

/* ------------------------------------------------------------------ */
/* Generation result — the original's live ImageGenerationResponse     */
/* (2x-mkcjonn738.js, D). Mounts generating: a 200x250 card whose     */
/* canvas draws a 9px dot grid in the icon tokens, lit by a travelling */
/* wave, with "Generating image" + a split-flap countdown from 4s.     */
/* At 4000ms the countdown hits 0, the canvas fades, and the image is  */
/* revealed through a feathered radial mask (blur 10px -> 0, reveal    */
/* 0% -> 132%, 1.55s). "Image generated" + Good / Bad / Copy appear    */
/* only once the image is revealed; feedback toasts clear after        */
/* 2200ms.                                                             */
/*                                                                     */
/* NOTE (evidence conflict, verified 2026-11-08): the brief described  */
/* this canvas as blue 2x2 dots on a 3px grid with a blue gradient —   */
/* that drawing is a different component (3oxmuz9pqr-wm.js, `y`, the   */
/* WebGL-flame fallback). D's own canvas, transcribed here, is the     */
/* 9px grid + icon-token wave above; the 300ms canvas fade, the 4s     */
/* countdown, the 132% reveal and the 2200ms toast all match D.        */
/* ------------------------------------------------------------------ */

function GenerationResult({ messageId, onGenerated }: { messageId: string; onGenerated?: (id: string) => void }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const onGeneratedRef = useRef(onGenerated);
  const [generated, setGenerated] = useState(false);
  const [seconds, setSeconds] = useState(4);
  const [toast, setToast] = useState<string | null>(null);
  const toastTimer = useRef<number | undefined>(undefined);

  useEffect(() => {
    onGeneratedRef.current = onGenerated;
  }, [onGenerated]);
  useEffect(() => () => window.clearTimeout(toastTimer.current), []);

  const showToast = useCallback((text: string) => {
    window.clearTimeout(toastTimer.current);
    setToast(text);
    toastTimer.current = window.setTimeout(() => setToast(null), 2200);
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    const parent = canvas?.parentElement;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !parent || !ctx) return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const start = performance.now();
    let stopped = false;
    let raf = 0;
    let lastSeconds = 4;
    let rect = parent.getBoundingClientRect();
    let needsResize = true;
    const observer = new ResizeObserver(() => {
      rect = parent.getBoundingClientRect();
      needsResize = true;
    });
    observer.observe(parent);
    const readColors = () => {
      const cs = getComputedStyle(parent);
      return {
        active: cs.getPropertyValue("--color-foreground-icon-primary").trim(),
        neutral: cs.getPropertyValue("--color-foreground-icon-quaternary").trim(),
      };
    };
    let colors = readColors();
    let lastColorRead = performance.now();
    const smooth = (e: number, t: number, a: number) => {
      const i = Math.max(0, Math.min(1, (a - e) / (t - e)));
      return i * i * (3 - 2 * i);
    };
    const wave = (x: number, y: number, time: number, aspect: number) => {
      const nx = (x - 0.5) * aspect;
      const ny = y - 0.5;
      const s = Math.sqrt(nx * nx + ny * ny) / 0.5;
      const o = 1.8 / 0.7;
      const l = time % 1.3;
      const c = Math.ceil(1.8 / 0.7 / 1.3) + 1;
      let d = 0;
      for (let e = 0; e < c; e += 1) {
        const t = (l + 1.3 * e) / o;
        if (t > 1) continue;
        const a = s - t;
        d += Math.exp(-(a * a) / 0.01119008) * smooth(0, 0.1, t) * (1 - smooth(0.62, 1, t));
      }
      return Math.min(1, d);
    };
    const frame = (now: number) => {
      if (stopped) return;
      if (needsResize) {
        needsResize = false;
        const dpr = Math.min(window.devicePixelRatio || 1, 2);
        const w = Math.max(1, Math.round(rect.width * dpr));
        const h = Math.max(1, Math.round(rect.height * dpr));
        if (canvas.width !== w || canvas.height !== h) {
          canvas.width = w;
          canvas.height = h;
        }
        ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      }
      const elapsed = now - start;
      if (now - lastColorRead > 500) {
        colors = readColors();
        lastColorRead = now;
      }
      const { active, neutral } = colors;
      const cols = Math.ceil(rect.width / 9) + 1;
      const rows = Math.ceil(rect.height / 9) + 1;
      const ox = (rect.width - (cols - 1) * 9) / 2;
      const oy = (rect.height - (rows - 1) * 9) / 2;
      ctx.clearRect(0, 0, rect.width, rect.height);
      for (let row = 0; row < rows; row += 1) {
        const y = oy + 9 * row;
        const yn = y / rect.height;
        for (let col = 0; col < cols; col += 1) {
          const x = ox + 9 * col;
          const xn = x / rect.width;
          const o = reduced ? 0.24 : wave(xn, yn, elapsed / 1000, rect.width / rect.height);
          const alpha =
            Math.min(1, 7 * xn, (1 - xn) * 7, 7 * yn, (1 - yn) * 7) * (0.08 + 0.68 * o * 0.92);
          const r = 0.72 + 0.48 * o;
          ctx.globalAlpha = alpha;
          ctx.fillStyle = o > 0.22 ? active : neutral;
          ctx.beginPath();
          ctx.arc(x, y, r, 0, 2 * Math.PI);
          ctx.fill();
        }
      }
      ctx.globalAlpha = 1;
      // Clamp elapsed to [0, 4000]: the first rAF timestamp can predate
      // `start` (headless BeginFrame control), which would otherwise make
      // the countdown briefly read 5 — it starts at 4 by spec.
      const remaining = Math.ceil(Math.min(4000, Math.max(0, 4000 - elapsed)) / 1000);
      if (remaining !== lastSeconds) {
        lastSeconds = remaining;
        setSeconds(remaining);
      }
      raf = window.requestAnimationFrame(frame);
    };
    raf = window.requestAnimationFrame(frame);
    const done = window.setTimeout(() => {
      stopped = true;
      window.cancelAnimationFrame(raf);
      setSeconds(0);
      setGenerated(true);
      onGeneratedRef.current?.(messageId);
    }, 4000);
    return () => {
      stopped = true;
      observer.disconnect();
      window.clearTimeout(done);
      window.cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <motion.div
      layout
      variants={GEN_OUTER_VARIANTS}
      initial="hidden"
      animate="visible"
      className="flex w-full flex-col items-start gap-2"
    >
      <motion.div variants={GEN_HEADER_VARIANTS} className="flex w-[200px] items-baseline text-body-regular">
        {generated && <span className="text-text-primary">Image generated</span>}
      </motion.div>
      <motion.div variants={GEN_CARD_VARIANTS} initial="hidden" animate="visible" className="w-[200px] overflow-hidden">
        <div
          className="relative h-[250px] w-[200px] overflow-hidden rounded-2xl bg-background-primary-default shadow-card"
          aria-live="polite"
          aria-label={
            generated
              ? "Generated image: Vintage-style illustration of a football player in Argentina's striped kit"
              : "Generating image"
          }
        >
          <canvas
            ref={canvasRef}
            aria-hidden
            className={cx(
              "absolute inset-0 size-full transition-opacity duration-300",
              generated ? "opacity-0" : "opacity-100",
            )}
          />
          <div
            className={cx(
              "absolute inset-x-3 bottom-3 flex items-center justify-between gap-3",
              "text-body-2-medium text-text-tertiary transition-opacity duration-300",
              generated ? "opacity-0" : "opacity-100",
            )}
          >
            <span aria-label="Generating image" className="agent-progress-loading-text inline-block">
              Generating image
            </span>
            <FlipSeconds seconds={seconds} />
          </div>
          <motion.div
            className="absolute inset-0"
            initial={false}
            animate={
              generated
                ? { opacity: 1, filter: "blur(0px)", "--reveal": "132%" }
                : { opacity: 0, filter: "blur(10px)", "--reveal": "0%" }
            }
            transition={{ duration: 1.55, ease: [0.4, 0, 0.2, 1] }}
            style={
              {
                "--reveal": "0%",
                maskImage:
                  "radial-gradient(circle at 50% 50%, #000 calc(var(--reveal) - 26%), transparent var(--reveal))",
                WebkitMaskImage:
                  "radial-gradient(circle at 50% 50%, #000 calc(var(--reveal) - 26%), transparent var(--reveal))",
              } as React.CSSProperties
            }
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/ai-chat/generated-footballer.jpg"
              alt="Vintage-style illustration of a football player in Argentina's striped kit"
              sizes="200px"
              className="size-full object-cover"
            />
          </motion.div>
          <AnimatePresence>
            {toast && (
              <motion.div
                role="status"
                initial={{ opacity: 0, y: 8, filter: "blur(4px)" }}
                animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                exit={{ opacity: 0, y: 8, filter: "blur(4px)" }}
                transition={{ duration: 0.42, ease: [0.22, 1, 0.36, 1] }}
                className="absolute inset-x-3 bottom-3 rounded-lg px-2.5 py-1.5 text-center bg-neutral-950/80 text-body-2-medium text-white backdrop-blur-sm"
              >
                {toast}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
      {generated && (
        <motion.div initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.25 }}>
          <FeedbackRow onToast={showToast} />
        </motion.div>
      )}
    </motion.div>
  );
}

/* Split-flap countdown digit (2x-mkcjonn738.js, E/A): an 11px card whose
 * top half shows the new digit and bottom half the old one; on change the
 * old top half swings down (animate-flap-fall) and the new bottom half
 * swings up (animate-flap-rise). Keyframes in styles/globals.css. */
function DigitHalf({ digit, half }: { digit: string; half: "top" | "bottom" }) {
  return (
    <span className="block h-2 overflow-hidden bg-background-tertiary-default">
      <span
        className={cx(
          "block h-4 text-center leading-4 text-text-secondary tabular-nums",
          half === "bottom" && "-mt-2",
        )}
      >
        {digit}
      </span>
    </span>
  );
}

function FlipDigit({ digit }: { digit: string }) {
  const [state, setState] = useState({ settled: digit, from: digit, key: 0 });
  if (state.settled !== digit) {
    setState({ settled: digit, from: state.settled, key: state.key + 1 });
  }
  const changing = state.settled !== digit;
  const bottomDigit = changing ? state.settled : state.from;
  const key = changing ? state.key + 1 : state.key;
  return (
    <span
      aria-hidden
      className="relative block w-[11px] overflow-hidden rounded-[3px] bg-background-tertiary-default [perspective:70px]"
    >
      <DigitHalf digit={digit} half="top" />
      <DigitHalf digit={bottomDigit} half="bottom" />
      {key > 0 && (
        <span key={key} className="pointer-events-none absolute inset-0">
          <span className="animate-flap-fall absolute inset-x-0 top-0">
            <DigitHalf digit={bottomDigit} half="top" />
          </span>
          <span className="animate-flap-rise absolute inset-x-0 bottom-0">
            <DigitHalf digit={digit} half="bottom" />
          </span>
        </span>
      )}
    </span>
  );
}

function FlipSeconds({ seconds }: { seconds: number }) {
  return (
    <span className="flex shrink-0 items-center gap-px">
      {String(seconds)
        .split("")
        .map((d, i) => (
          <FlipDigit key={i} digit={d} />
        ))}
      <span aria-hidden> s</span>
      <span className="sr-only">{seconds} seconds remaining</span>
    </span>
  );
}

/* Feedback row (2x-mkcjonn738.js, T): Good / Bad / Copy are one-shot
 * buttons with hover tooltips, not toggles. Good / Bad fire a toast
 * ("Thanks for the feedback" / "Thanks — we'll use this to improve");
 * Copy morphs its icon to a check and shows a "Copied!" tooltip for
 * 1600ms. The toast itself is cleared by GenerationResult after 2200ms. */
function FeedbackButton({
  icon: Icon,
  label,
  tooltip,
  isTooltipOpen,
  onTooltipOpenChange,
  onPress,
  children,
}: {
  icon?: ComponentType<{ className?: string; "aria-hidden"?: boolean | "true" | "false" }>;
  label: string;
  tooltip?: string;
  isTooltipOpen?: boolean;
  onTooltipOpenChange?: (open: boolean) => void;
  onPress: () => void;
  children?: ReactNode;
}) {
  return (
    <TooltipTrigger delay={200} isOpen={isTooltipOpen} onOpenChange={onTooltipOpenChange}>
      <button
        type="button"
        aria-label={label}
        onClick={onPress}
        className="group flex cursor-pointer items-center rounded-lg bg-background-tertiary-default p-1.5 transition-colors duration-150 ease hover:bg-background-secondary-hover"
      >
        {children ??
          (Icon ? (
            <Icon
              className="size-4 text-foreground-icon-secondary transition-colors duration-150 ease group-hover:text-foreground-icon-primary"
              aria-hidden
            />
          ) : null)}
      </button>
      <Tooltip size="sm">{tooltip ?? label}</Tooltip>
    </TooltipTrigger>
  );
}

function FeedbackRow({ onToast }: { onToast: (text: string) => void }) {
  const [copied, setCopied] = useState(false);
  const [copyTipOpen, setCopyTipOpen] = useState(false);
  const copyTimer = useRef<number | undefined>(undefined);

  useEffect(() => () => window.clearTimeout(copyTimer.current), []);

  const onCopy = () => {
    window.clearTimeout(copyTimer.current);
    setCopied(true);
    setCopyTipOpen(true);
    copyTimer.current = window.setTimeout(() => {
      setCopied(false);
      setCopyTipOpen(false);
    }, 1600);
  };

  return (
    <div className="flex items-center gap-1.5">
      <FeedbackButton icon={RiThumbUpLine} label="Good response" onPress={() => onToast("Thanks for the feedback")} />
      <FeedbackButton icon={RiThumbDownLine} label="Bad response" onPress={() => onToast("Thanks — we'll use this to improve")} />
      <FeedbackButton
        label="Copy response"
        tooltip={copied ? "Copied!" : undefined}
        isTooltipOpen={copyTipOpen}
        onTooltipOpenChange={setCopyTipOpen}
        onPress={onCopy}
      >
        <span className="relative inline-flex size-4 shrink-0 items-center justify-center">
          <RiFileCopyLine
            aria-hidden
            className={cx(
              "absolute size-4 text-foreground-icon-secondary transition-all duration-200 ease-out group-hover:text-foreground-icon-primary",
              copied ? "scale-75 opacity-0 blur-[2px]" : "scale-100 opacity-100 blur-0",
            )}
          />
          <RiCheckLine
            aria-hidden
            className={cx(
              "absolute size-4 text-foreground-icon-secondary transition-all duration-200 ease-out group-hover:text-foreground-icon-primary",
              copied ? "scale-100 opacity-100 blur-0" : "scale-75 opacity-0 blur-[2px]",
            )}
          />
        </span>
      </FeedbackButton>
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
  onOpenSettings,
  mobile = false,
  onClose,
}: {
  repos: RepoGroup[];
  activeId: string;
  onToggleRepo: (name: string) => void;
  onSelectThread: (id: string) => void;
  collapsed: boolean;
  onToggleCollapse: () => void;
  onOpenSettings: () => void;
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
          <button type="button" aria-label="Settings" onClick={onOpenSettings} className="flex w-full cursor-pointer items-center gap-2 rounded-2lg p-2 text-start transition-colors duration-150 ease hover:bg-background-secondary-hover">
            <RiSettingsLine className="size-5 shrink-0 text-foreground-icon-secondary" aria-hidden />
            <span className="text-body-medium whitespace-nowrap text-text-secondary">Settings</span>
          </button>
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

const GLASS_PILL_STYLE = `
.bui-glass-pill > button,
.bui-glass-pill button[aria-label="Voice input"] {
  transition:
    background-color 480ms ease,
    border-color 480ms ease,
    box-shadow 480ms ease !important;
}
.bui-glass-on .bui-glass-pill > button,
.bui-glass-on .bui-glass-pill button[aria-label="Voice input"] {
  background-color: transparent !important;
  border-color: transparent !important;
  box-shadow: none !important;
}
`;

const GLASS_CONTROLS_STYLE = `
.bui-glass-controls .lg-host button {
  background-color: transparent !important;
  border-color: transparent !important;
  box-shadow: none !important;
}
/* The landing chips read as glass because they sit on a colourful shader.
   The composer is a flat near-white pill, so there is nothing to refract and
   the default 6% tint just shows the grey through. Declaring the tint on the
   layer itself beats the surface's inherited inline value, and keeps the
   hover variable working. */
.bui-glass-controls .lg-tint {
  --lg-tint: rgba(255, 255, 255, 0.88);
  --lg-tint-hover: rgba(255, 255, 255, 1);
}
.dark .bui-glass-controls .lg-tint {
  --lg-tint: rgba(255, 255, 255, 0.1);
  --lg-tint-hover: rgba(255, 255, 255, 0.16);
}
`;

function GlassComposer({ glass, children }: { glass: boolean; children: ReactNode }) {
  const isLight = useThemeMode() === "light";
  const ref = useRef<HTMLDivElement>(null);
  const [rects, setRects] = useState<Array<{ left: number; top: number; width: number; height: number; radius: number }>>([]);
  const [scale, setScale] = useState(1);

  const offsetOf = (el: HTMLElement, root: HTMLElement): { left: number; top: number } => {
    let left = 0;
    let top = 0;
    let node: HTMLElement | null = el;
    while (node && node !== root) {
      left += node.offsetLeft;
      top += node.offsetTop;
      node = node.offsetParent as HTMLElement | null;
    }
    return { left, top };
  };

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const update = () => {
      setScale(el.getBoundingClientRect().width / Math.max(1, el.offsetWidth));
      const buttons = Array.from(el.querySelectorAll("button"));
      const add = buttons.find((b) => b.getAttribute("aria-label") === "Add attachment");
      const voice = buttons.find((b) => b.getAttribute("aria-label") === "Voice input");
      const model = buttons.find((b) => !b.getAttribute("aria-label"));
      setRects([add, model, voice].filter((b): b is HTMLButtonElement => Boolean(b)).map((b) => ({ ...offsetOf(b, el), width: b.offsetWidth, height: b.offsetHeight, radius: b === model ? 12 : b.offsetHeight / 2 })));
    };
    const observer = new ResizeObserver(update);
    observer.observe(el);
    for (const b of Array.from(el.querySelectorAll("button"))) {
      observer.observe(b);
    }
    return () => observer.disconnect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div ref={ref} className={cx("relative", glass && "bui-glass-on")}>
      <style>{GLASS_PILL_STYLE}</style>
      <span aria-hidden className="pointer-events-none absolute inset-0">
        {rects.map((r, i) => (
          <span
            key={i}
            className="absolute"
            style={{
              left: r.left,
              top: r.top,
              width: r.width,
              height: r.height,
              borderRadius: r.radius,
              opacity: glass ? 1 : 0,
              transition: "opacity 480ms ease",
            }}
          >
            <LiquidGlassSurface
              radius={r.radius >= r.height / 2 ? "full" : r.radius}
              refract={0.02 >= Math.abs(scale - 1)}
              className="rounded-[inherit]"
              {...(scale > 1.05 ? { frost: Math.round(6 * scale) } : {})}
              {...(isLight ? { tintOpacity: 0.12 } : {})}
            />
          </span>
        ))}
      </span>
      {children}
    </div>
  );
}

function LocalComposer({
  value, onValueChange, onSubmit, busy, model, onModelChange, effort, onEffortChange,
  project, onProjectChange, voiceOn, onVoiceToggle, files, onFiles, onRemoveFile, inputRef,
}: {
  value: string;
  onValueChange: (v: string) => void;
  onSubmit: () => void;
  busy: boolean;
  model: string;
  onModelChange: (m: string) => void;
  effort: number;
  onEffortChange: (e: number) => void;
  project: string;
  onProjectChange: (p: string) => void;
  voiceOn: boolean;
  onVoiceToggle: () => void;
  files: string[];
  onFiles: (names: string[]) => void;
  onRemoveFile: (name: string) => void;
  inputRef: React.RefObject<HTMLInputElement | null>;
}) {
  const fileRef = useRef<HTMLInputElement>(null);
  const narrow = useSyncExternalStore(subscribeNarrow, () => window.matchMedia("(max-width: 639px)").matches, () => false);

  const onKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      onSubmit();
    }
  };

  return (
    <div className="flex w-full flex-col gap-2.5">
      {busy && <AgentThinking variant="infinity" className="px-1.5" />}
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
        <GlassComposer glass>
          <div className={cx("flex h-[52px] w-full items-center gap-2.5 rounded-full p-2", "bui-glass-controls bui-glass-pill relative bg-transparent shadow-none dark:bg-transparent")}>
            <style>{GLASS_CONTROLS_STYLE}</style>
            <input ref={fileRef} type="file" multiple className="hidden" aria-label="Choose files to attach" onChange={(e) => { const names = Array.from(e.target.files ?? []).map((f) => f.name); if (names.length > 0) onFiles(names); e.target.value = ""; }} />
            <LiquidGlassChip radius="full" className="rounded-full">
              <span className={cx("inline-flex", LIQUID_GLASS_RESET)}>
                <AddMenu onPickFiles={() => fileRef.current?.click()} />
              </span>
            </LiquidGlassChip>

            <label className="sr-only" htmlFor="agent-composer-input">Message</label>
            <input
              id="agent-composer-input"
              ref={inputRef}
              type="text"
              value={value}
              onChange={(e) => onValueChange(e.target.value)}
              onKeyDown={onKeyDown}
              placeholder={narrow ? "Ask me" : "Ask me anything"}
              autoComplete="off"
              aria-label="Message"
              className="h-5 min-w-0 flex-1 bg-transparent text-body-regular text-text-primary caret-accent-500 outline-none placeholder:text-text-tertiary [&:not(:focus)]:[mask-image:linear-gradient(to_right,#000_calc(100%-32px),transparent_100%)] rtl:[&:not(:focus)]:[mask-image:linear-gradient(to_left,#000_calc(100%-32px),transparent_100%)]"
            />

            <div className="relative shrink-0">
              <LiquidGlassChip radius={12}>
                <span className={cx("inline-flex", LIQUID_GLASS_RESET)}>
                  <ModelMenu model={model} onModelChange={onModelChange} effort={effort} onEffortChange={onEffortChange} />
                </span>
              </LiquidGlassChip>
            </div>

            <div className="flex shrink-0 items-center gap-2 ps-1.5">
              <button
                type="button"
                aria-label="Voice input"
                aria-pressed={voiceOn}
                onClick={onVoiceToggle}
                className="flex size-9 cursor-pointer items-center justify-center rounded-full border border-border-button-default bg-background-primary-default p-2 shadow-xs transition-colors duration-150 ease hover:bg-background-primary-hover"
              >
                {voiceOn ? (
                  <span aria-hidden className="flex h-5 items-center justify-center gap-[2.5px]">
                    {MIC_BARS.map((bar, i) => (
                      <span
                        key={i}
                        className="bui-composer-mic-bar w-[2.5px] rounded-full bg-accent-500"
                        style={{ height: bar.height, animationDuration: bar.duration, animationDelay: bar.delay }}
                      />
                    ))}
                  </span>
                ) : (
                  <RiMic2Line className="size-5 text-foreground-icon-primary" aria-hidden />
                )}
              </button>
              <button
                type="button"
                aria-label="Send message"
                disabled={busy}
                onClick={onSubmit}
                className={cx(
                  "flex size-9 cursor-pointer items-center justify-center rounded-full bg-button-primary p-2 transition-opacity duration-200 ease",
                  busy && "cursor-not-allowed opacity-40",
                )}
              >
                <RiArrowUpLine className="size-5 text-white" aria-hidden />
              </button>
            </div>
          </div>
        </GlassComposer>
      </ComposerLoader>

      {/* Status row below the pill (original position). */}
      <div className="px-1.5">
        <div className="flex h-[26px] w-full items-center justify-between">
          <div className="flex items-center gap-3">
            <button type="button" className="flex cursor-pointer items-center gap-1">
              <RiGitMergeLine className="size-4 shrink-0 -scale-y-100 text-foreground-icon-secondary" aria-hidden />
              <span className="flex items-center"><span className="text-body-2-medium whitespace-nowrap text-text-secondary">Main</span></span>
            </button>
            <ProjectMenu project={project} onProjectChange={onProjectChange} />
          </div>
          <div className="flex items-center gap-3">
            {/* Original: a plain button with a chevron — the Agent "dropdown"
                opens no menu (3oxmuz9pqr-wm.js, StatusBar `f`). */}
            <button type="button" className="flex cursor-pointer items-center gap-1">
              <RiInfinityLine className="size-4 shrink-0 text-foreground-icon-secondary" aria-hidden />
              <span className="flex items-center">
                <span className="text-body-2-medium whitespace-nowrap text-text-secondary">Agent</span>
                <RiArrowDropDownLine className="size-4 shrink-0 text-foreground-icon-secondary" aria-hidden />
              </span>
            </button>
            <ProgressRing progress={57} />
          </div>
        </div>
      </div>
    </div>
  );
}


/* ------------------------------------------------------------------ */
/* Composer menus — React Aria DialogTrigger + non-modal Popover,      */
/* the original's own wiring (3oxmuz9pqr-wm.js). Outside-press         */
/* dismissal and trigger-toggle come from the repo's utils, as in      */
/* components/base/popover.                                            */
/* ------------------------------------------------------------------ */

function useMenuState() {
  const [open, setOpen] = useState(false);
  const triggerRef = useRef<HTMLElement>(null);
  const popoverRef = useRef<HTMLElement>(null);
  useDismissOnOutsidePress(open, () => setOpen(false), [triggerRef, popoverRef]);
  const allowOpenChange = useTriggerToggle(open, triggerRef);
  const onOpenChange = (next: boolean) => {
    if (allowOpenChange(next)) setOpen(next);
  };
  return { open, setOpen, triggerRef, popoverRef, onOpenChange };
}

function ModelMenu({
  model,
  onModelChange,
  effort,
  onEffortChange,
}: {
  model: string;
  onModelChange: (m: string) => void;
  effort: number;
  onEffortChange: (e: number) => void;
}) {
  const { open, setOpen, triggerRef, popoverRef, onOpenChange } = useMenuState();
  return (
    <AriaDialogTrigger isOpen={open} onOpenChange={onOpenChange}>
      <Pressable ref={triggerRef}>
        <button
          type="button"
          className="flex h-8 shrink-0 cursor-pointer items-center justify-center gap-0.5 rounded-xl bg-background-primary-default py-1.5 pe-1 ps-2 outline-none transition-colors duration-150 ease hover:bg-background-primary-hover focus-visible:ring-2 focus-visible:ring-border-focus-ring"
        >
          <span className="px-0.5 text-body-medium whitespace-nowrap text-text-secondary">{model}</span>
          <RiArrowDownSLine
            className={cx(
              "size-[18px] shrink-0 text-foreground-icon-secondary transition-transform duration-200 ease",
              open && "rotate-180",
            )}
            aria-hidden
          />
        </button>
      </Pressable>
      <AriaPopover ref={popoverRef} isNonModal placement="top start" offset={8} className={MENU_POPOVER_CLASS}>
        <AriaDialog aria-label="Model settings" className="flex flex-col outline-none">
          <div className="flex flex-col">
            <div className="flex w-full flex-col gap-1.5 pt-1">
              <span className="ps-2 text-body-medium text-text-secondary">Models</span>
              <div className="flex w-full flex-col gap-1" role="radiogroup" aria-label="Model">
                {MODELS.map((m) => (
                  <button
                    key={m}
                    type="button"
                    role="radio"
                    aria-checked={m === model}
                    onClick={() => {
                      onModelChange(m);
                      setOpen(false);
                    }}
                    className={cx(
                      "flex w-full cursor-pointer items-center justify-between gap-2.5 rounded-2lg p-2 outline-none transition-colors",
                      m === model
                        ? "bg-background-primary-hover"
                        : "hover:bg-background-primary-hover focus-visible:bg-background-primary-hover",
                    )}
                  >
                    <span className="truncate text-body-medium whitespace-nowrap text-text-primary">{m}</span>
                    <RadioDot selected={m === model} />
                  </button>
                ))}
              </div>
            </div>
            <div className="-mx-2.5 mt-[7px] mb-3 h-px bg-border-button-default" />
            <div className="flex w-full flex-col">
              <span className="ps-2 text-body-medium text-text-secondary">
                Effort{" "}
                <motion.span
                  key={EFFORT_LEVELS[effort]}
                  initial={{ opacity: 0, filter: "blur(4px)" }}
                  animate={{ opacity: 1, filter: "blur(0px)" }}
                  transition={{ duration: 0.35, ease: "easeOut" }}
                  className="inline-block text-text-primary"
                >
                  {EFFORT_LEVELS[effort]}
                </motion.span>
              </span>
              <div className="flex w-full flex-col gap-1">
                <div className="flex w-full items-center justify-between px-2 pt-2 pb-[3px]">
                  <span className="text-body-2-medium whitespace-nowrap text-text-secondary">Faster</span>
                  <span className="text-body-2-medium whitespace-nowrap text-text-secondary">Smarter</span>
                </div>
                <div className="w-full px-2 pb-2">
                  <EffortSlider value={effort} onChange={onEffortChange} />
                </div>
              </div>
            </div>
          </div>
        </AriaDialog>
      </AriaPopover>
    </AriaDialogTrigger>
  );
}

// Original effort slider (3oxmuz9pqr-wm.js, EffortSlider): a React Aria
// slider with a custom 27px track — a fill that grows with the value,
// 3px tick bars that scatter away when Max is picked, and a 21px thumb.
// The Max flame overlay is ported verbatim from the original chunk
// 3oxmuz9pqr-wm.js: a WebGL fragment-shader plume, a 2D spark canvas and a
// non-WebGL fallback. The dark overlay rgba(16,24,40,0.62) is the
// original's own value.
const EFFORT_FLAME_VERTEX_SHADER = `
attribute vec2 a_pos;
void main() { gl_Position = vec4(a_pos, 0.0, 1.0); }
`;

const EFFORT_FLAME_FRAGMENT_SHADER = `
precision mediump float;
uniform vec2 u_res;
uniform float u_time;
uniform float u_power; // 0 -> 1 throttle-up after ignition

float hash(vec2 p) {
  return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453123);
}

float noise(vec2 p) {
  vec2 i = floor(p);
  vec2 f = fract(p);
  vec2 u = f * f * (3.0 - 2.0 * f);
  return mix(
    mix(hash(i), hash(i + vec2(1.0, 0.0)), u.x),
    mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), u.x),
    u.y
  );
}

float fbm(vec2 p) {
  float v = 0.0;
  float a = 0.5;
  for (int i = 0; i < 4; i++) {
    v += a * noise(p);
    p = p * 2.1 + vec2(37.4, 17.9);
    a *= 0.5;
  }
  return v;
}

void main() {
  vec2 uv = gl_FragCoord.xy / u_res;
  float d = 1.0 - uv.x;            // 0 at the nozzle (right) -> 1 far left
  float y = (uv.y - 0.5) * 2.0;    // -1 bottom .. 1 top

  // Turbulence blown leftward; second octave wobbles the plume axis
  float turb = fbm(vec2(uv.x * 5.5 + u_time * 3.2, uv.y * 3.5 + u_time * 0.4)) - 0.5;
  float sway = (fbm(vec2(u_time * 1.6, uv.x * 2.0)) - 0.5) * 0.55;

  // Plume envelope: wide at the nozzle, tapering left, edges licked by noise.
  // Throttle (u_power) grows the plume from a short narrow jet to full burn.
  float width = mix(1.05, 0.12, smoothstep(0.0, 1.0, d)) * mix(0.35, 1.0, u_power);
  float reach = mix(0.18, 1.05, u_power);
  float shape = 1.0 - smoothstep(width * 0.35, width, abs(y + sway * d + turb * (0.35 + d * 0.9)));
  float len = 1.0 - smoothstep(0.15 * u_power, reach, d + turb * 0.45 * u_power);
  float flame = clamp(shape * len, 0.0, 1.0);

  // Extra hot core hugging the nozzle centre line
  float core = (1.0 - smoothstep(0.0, 0.38 * mix(0.5, 1.0, u_power), d + turb * 0.15)) * (1.0 - smoothstep(0.0, 0.55, abs(y)));
  flame = clamp(flame + core * 0.6, 0.0, 1.0) * mix(0.6, 1.0, u_power);

  // Ambient glow so the flame feels emissive even past its tongues
  float glow = (1.0 - smoothstep(0.0, 0.85, d)) * (1.0 - smoothstep(0.2, 1.15, abs(y))) * 0.4 * u_power;

  // blue-600 -> blue-400 -> blue-200 -> white-hot. The white core is gated on
  // nozzle distance too, so only the plume root burns white and the body
  // stays saturated blue.
  vec3 c600 = vec3(0.082, 0.365, 0.988);
  vec3 c400 = vec3(0.318, 0.635, 1.0);
  vec3 c200 = vec3(0.741, 0.867, 1.0);
  vec3 col = mix(c600, c400, smoothstep(0.2, 0.6, flame));
  col = mix(col, c200, smoothstep(0.62, 0.95, flame) * (1.0 - smoothstep(0.1, 0.75, d)));
  float hot = smoothstep(0.9, 1.0, flame) * (1.0 - smoothstep(0.02, 0.3, d));
  col = mix(col, vec3(1.0), hot);

  float alpha = smoothstep(0.04, 0.55, flame) * 0.96 + glow;
  gl_FragColor = vec4(col, clamp(alpha, 0.0, 1.0));
}
`;

function EffortFlameSparks() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const rect = canvas.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    const dpr = window.devicePixelRatio || 1;
    canvas.width = width * dpr;
    canvas.height = height * dpr;
    ctx.scale(dpr, dpr);

    const makeSpark = (fromRight: boolean) => ({
      x: fromRight ? Math.random() * width : width + 4,
      y: 1 + Math.random() * (height - 2),
      speed: 18 + 90 * Math.random(),
      size: 0.6 + Math.random(),
      alpha: 0.4 + 0.55 * Math.random(),
    });

    const sparks = Array.from({ length: 40 }, () => makeSpark(true));
    let star: {
      x: number;
      y: number;
      speed: number;
      size: number;
      alpha: number;
      life: number;
    } | null = null;

    let raf = 0;
    let last = performance.now();
    const loop = (now: number) => {
      const dt = Math.min((now - last) / 1000, 0.05);
      last = now;
      ctx.clearRect(0, 0, width, height);
      for (const spark of sparks) {
        spark.x -= spark.speed * dt;
        if (spark.x < -6) Object.assign(spark, makeSpark(false));
        const grad = ctx.createLinearGradient(
          spark.x,
          spark.y,
          spark.x + 0.05 * spark.speed,
          spark.y,
        );
        grad.addColorStop(
          0,
          "rgba(255,255,255," + spark.alpha.toFixed(3) + ")",
        );
        grad.addColorStop(1, "rgba(255,255,255,0)");
        ctx.fillStyle = grad;
        ctx.fillRect(
          spark.x,
          spark.y - spark.size / 2,
          0.05 * spark.speed + spark.size,
          spark.size,
        );
      }

      if (!star && Math.random() < dt / 2.5) {
        star = {
          ...makeSpark(false),
          speed: 260 + 120 * Math.random(),
          size: 1.2,
          alpha: 0.9,
          life: 1,
        };
      }
      if (star) {
        star.x -= star.speed * dt;
        star.life -= 0.9 * dt;
        if (star.x < -40 || star.life <= 0) {
          star = null;
        } else {
          const a = star.alpha * Math.max(star.life, 0);
          const grad = ctx.createLinearGradient(star.x, star.y, star.x + 26, star.y);
          grad.addColorStop(0, "rgba(255,255,255," + a.toFixed(3) + ")");
          grad.addColorStop(1, "rgba(255,255,255,0)");
          ctx.fillStyle = grad;
          ctx.fillRect(star.x, star.y - 0.6, 26, 1.2);
        }
      }

      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, []);

  return <canvas ref={canvasRef} aria-hidden className="absolute inset-0 size-full" />;
}

function EffortFlameFallback() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const rect = canvas.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    const dpr = window.devicePixelRatio || 1;
    canvas.width = width * dpr;
    canvas.height = height * dpr;
    ctx.scale(dpr, dpr);

    const cols = Math.ceil(width / 3);
    const rows = Math.ceil(height / 3);
    const palette: Array<[number, number, number]> = [
      [142, 197, 255],
      [81, 162, 255],
      [43, 127, 255],
      [21, 93, 252],
    ];

    let raf = 0;
    let lastMs = 0;
    const loop = (now: number) => {
      raf = requestAnimationFrame(loop);
      if (now - lastMs <= 70) return;
      lastMs = now;
      ctx.clearRect(0, 0, width, height);
      for (let cx = 0; cx < cols; cx++) {
        const a = cx / (cols - 1);
        const density = 0.78 * Math.pow(a, 1.6);
        for (let cy = 0; cy < rows; cy++) {
          if (Math.random() < density) {
            const [r, g, b] = palette[(Math.random() * palette.length) | 0];
            const alpha = (0.15 + 0.85 * Math.random()) * (0.35 + 0.65 * a);
            ctx.fillStyle =
              "rgba(" + r + "," + g + "," + b + "," + alpha.toFixed(3) + ")";
            ctx.fillRect(3 * cx, 3 * cy, 2, 2);
          }
        }
      }
    };
    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, []);

  return (
    <motion.div
      aria-hidden
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      className="pointer-events-none absolute inset-0"
    >
      <div className="absolute inset-0 bg-gradient-to-l from-blue-300/90 via-blue-300/30 to-transparent" />
      <canvas ref={canvasRef} className="absolute inset-0 size-full" />
    </motion.div>
  );
}

function EffortFlame() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [webglFailed, setWebglFailed] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const gl = canvas.getContext("webgl", {
      alpha: true,
      premultipliedAlpha: false,
    });
    if (!gl) {
      setWebglFailed(true);
      return;
    }
    const rect = canvas.getBoundingClientRect();
    const dpr = window.devicePixelRatio || 1;
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    gl.viewport(0, 0, canvas.width, canvas.height);

    const compile = (type: number, source: string) => {
      const shader = gl.createShader(type);
      if (!shader) return null;
      gl.shaderSource(shader, source);
      gl.compileShader(shader);
      return shader;
    };
    const vs = compile(gl.VERTEX_SHADER, EFFORT_FLAME_VERTEX_SHADER);
    const fs = compile(gl.FRAGMENT_SHADER, EFFORT_FLAME_FRAGMENT_SHADER);
    const program = gl.createProgram();
    if (!vs || !fs || !program) {
      setWebglFailed(true);
      return;
    }
    gl.attachShader(program, vs);
    gl.attachShader(program, fs);
    gl.linkProgram(program);
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
      setWebglFailed(true);
      return;
    }
    gl.useProgram(program);

    const buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(
      gl.ARRAY_BUFFER,
      new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]),
      gl.STATIC_DRAW,
    );
    const aPos = gl.getAttribLocation(program, "a_pos");
    gl.enableVertexAttribArray(aPos);
    gl.vertexAttribPointer(aPos, 2, gl.FLOAT, false, 0, 0);

    gl.uniform2f(gl.getUniformLocation(program, "u_res"), canvas.width, canvas.height);
    gl.enable(gl.BLEND);
    gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);

    const uTime = gl.getUniformLocation(program, "u_time");
    const uPower = gl.getUniformLocation(program, "u_power");

    let raf = 0;
    const startMs = performance.now();
    const loop = (now: number) => {
      const t = (now - startMs) / 1000;
      gl.uniform1f(uTime, t);
      const s = Math.min(t / 1.4, 1);
      gl.uniform1f(uPower, 1 - Math.pow(1 - s, 3));
      gl.clearColor(0, 0, 0, 0);
      gl.clear(gl.COLOR_BUFFER_BIT);
      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, []);

  if (webglFailed) return <EffortFlameFallback />;

  return (
    <motion.div
      aria-hidden
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      className="pointer-events-none absolute inset-0"
    >
      <div className="absolute inset-0 rounded-lg bg-[rgba(16,24,40,0.62)]" />
      <EffortFlameSparks />
      <canvas ref={canvasRef} className="absolute inset-0 size-full" />
    </motion.div>
  );
}
function EffortSlider({ value, onChange }: { value: number; onChange: (v: number) => void }) {
  const isMax = value === EFFORT_LEVELS.length - 1;
  const scatter = useMemo(
    () =>
      EFFORT_LEVELS.map(() => ({
        x: -(70 + 130 * Math.random()),
        y: (Math.random() - 0.5) * 70,
        rotate: (Math.random() - 0.5) * 720,
        delay: 0.3 * Math.random(),
      })),
    [isMax],
  );
  const d = value / (EFFORT_LEVELS.length - 1);
  return (
    <AriaSlider
      aria-label="Effort"
      minValue={0}
      maxValue={EFFORT_LEVELS.length - 1}
      step={1}
      value={value}
      onChange={onChange}
      className="w-full"
    >
      <div className="relative h-[27px] w-full overflow-hidden rounded-lg bg-background-secondary-default">
        <div
          className="absolute inset-y-0 start-0 rounded-lg bg-background-tertiary-hover transition-[width] duration-150 ease-out"
          style={{ width: `calc(${d} * (100% - 21px) + 21px)` }}
        />
        <div className="absolute inset-x-[9px] top-[7px] flex h-[13px] items-center justify-between">
          {EFFORT_LEVELS.map((label, i) => (
            <motion.span
              key={label}
              animate={
                isMax
                  ? { x: scatter[i].x, y: scatter[i].y, rotate: scatter[i].rotate, opacity: 0 }
                  : { x: 0, y: 0, rotate: 0, opacity: i > value ? 0.3 : 1 }
              }
              transition={
                isMax
                  ? { duration: 1.6, ease: [0.22, 0.5, 0.5, 1], delay: scatter[i].delay }
                  : { duration: 0.3, ease: "easeOut" }
              }
              className="h-full w-[3px] rounded-[2px] bg-foreground-icon-tertiary"
            />
          ))}
        </div>
        <AnimatePresence>{isMax && <EffortFlame />}</AnimatePresence>
        <div className="absolute inset-x-[10.5px] inset-y-0">
          <AriaSliderTrack className="h-full w-full">
            <AriaSliderThumb className="top-1/2 h-[27px] w-[21px] cursor-grab rounded-[7px] border border-border-checkbox-default bg-background-primary-default shadow-xs outline-none transition-shadow data-[dragging]:cursor-grabbing data-[focus-visible]:ring-2 data-[focus-visible]:ring-border-focus-ring" />
          </AriaSliderTrack>
        </div>
      </div>
    </AriaSlider>
  );
}

function ProjectMenu({
  project,
  onProjectChange,
}: {
  project: string;
  onProjectChange: (p: string) => void;
}) {
  const { open, setOpen, triggerRef, popoverRef, onOpenChange } = useMenuState();
  return (
    <AriaDialogTrigger isOpen={open} onOpenChange={onOpenChange}>
      <Pressable ref={triggerRef}>
        <button
          type="button"
          className="flex cursor-pointer items-center gap-1 rounded-sm outline-none focus-visible:ring-2 focus-visible:ring-border-focus-ring"
        >
          <RiFolder2Line className="size-4 shrink-0 text-foreground-icon-secondary" aria-hidden />
          <span className="flex items-center">
            <span className="text-body-2-medium whitespace-nowrap text-text-secondary">{project}</span>
            <RiArrowDropDownLine
              className={cx(
                "size-4 shrink-0 text-foreground-icon-secondary transition-transform duration-200 ease",
                open && "rotate-180",
              )}
              aria-hidden
            />
          </span>
        </button>
      </Pressable>
      <AriaPopover ref={popoverRef} isNonModal placement="top start" offset={8} className={MENU_POPOVER_CLASS}>
        <AriaDialog aria-label="Local folders" className="outline-none">
          <div className="flex w-full flex-col gap-1.5 pt-1">
            <span className="ps-2 text-body-medium text-text-secondary">Local Folders</span>
            <div className="flex w-full flex-col gap-1">
              {PROJECTS.map((p) => (
                <button
                  key={p.name}
                  type="button"
                  aria-pressed={p.name === project}
                  onClick={() => {
                    onProjectChange(p.name);
                    setOpen(false);
                  }}
                  className={cx(
                    "flex w-full cursor-pointer items-center gap-2 rounded-2lg p-2 outline-none transition-colors",
                    p.name === project
                      ? "bg-background-primary-hover"
                      : "hover:bg-background-primary-hover focus-visible:bg-background-primary-hover",
                  )}
                >
                  <RiFolder2Line className="size-5 shrink-0 text-foreground-icon-secondary" aria-hidden />
                  <span className="truncate text-body-medium whitespace-nowrap">
                    <span className="text-text-secondary">{p.prefix}</span>
                    <span className="text-text-primary">{p.name}</span>
                  </span>
                </button>
              ))}
            </div>
          </div>
        </AriaDialog>
      </AriaPopover>
    </AriaDialogTrigger>
  );
}

// Original attachment menu (3oxmuz9pqr-wm.js, AddMenu). In the original
// preview the rows only close the menu; here "Files and folders" also
// opens this page's existing file picker, so attaching keeps working.
function AddMenu({ onPickFiles }: { onPickFiles: () => void }) {
  const { open, setOpen, triggerRef, popoverRef, onOpenChange } = useMenuState();
  const close = () => setOpen(false);
  return (
    <AriaDialogTrigger isOpen={open} onOpenChange={onOpenChange}>
      <Pressable ref={triggerRef}>
        <button
          type="button"
          aria-label="Add attachment"
          className="flex size-9 shrink-0 cursor-pointer items-center justify-center rounded-full bg-ai-chat-composer-add-background p-2 text-foreground-icon-primary outline-none transition-colors duration-150 ease hover:bg-ai-chat-composer-add-hover-background focus-visible:ring-2 focus-visible:ring-border-focus-ring"
        >
          <RiAddLine
            className={cx("size-5 text-foreground-icon-primary transition-transform duration-200 ease", open && "rotate-45")}
            aria-hidden
          />
        </button>
      </Pressable>
      <AriaPopover ref={popoverRef} isNonModal placement="top start" offset={8} className={ADD_POPOVER_CLASS}>
        <AriaDialog aria-label="Add to chat" className="flex flex-col gap-2 outline-none">
          <AddMenuSection
            label="Add"
            rows={ADD_ROWS}
            onSelect={(label) => {
              close();
              if (label === "Files and folders") onPickFiles();
            }}
          />
          <AddMenuSection label="Plugins" rows={PLUGIN_ROWS} onSelect={close} />
        </AriaDialog>
      </AriaPopover>
    </AriaDialogTrigger>
  );
}

function AddMenuSection({
  label,
  rows,
  onSelect,
}: {
  label: string;
  rows: AddMenuRow[];
  onSelect: (label: string) => void;
}) {
  return (
    <div className="flex w-full flex-col gap-1.5 pt-1">
      <span className="ps-2 text-body-medium text-text-secondary">{label}</span>
      <div className="flex w-full flex-col gap-1">
        {rows.map((row) => {
          const Icon = row.icon;
          return (
            <button
              key={row.label}
              type="button"
              onClick={() => onSelect(row.label)}
              className="flex w-full cursor-pointer items-center gap-2 rounded-2lg px-2 py-1.5 outline-none transition-colors hover:bg-background-primary-hover focus-visible:bg-background-primary-hover"
            >
              {Icon ? <Icon className="size-5 shrink-0 text-foreground-icon-secondary" aria-hidden /> : null}
              {row.image ? (
                <>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={row.image}
                    alt=""
                    width={24}
                    height={24}
                    aria-hidden
                    className={cx("size-6 shrink-0", row.darkImage && "theme-asset-light")}
                  />
                  {row.darkImage ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={row.darkImage}
                      alt=""
                      width={24}
                      height={24}
                      aria-hidden
                      className="theme-asset-dark size-6 shrink-0"
                    />
                  ) : null}
                </>
              ) : null}
              <span className="truncate text-body-medium whitespace-nowrap">
                <span className="text-text-primary">{row.label}</span>
                {row.description ? <span className="ms-1.5 text-text-secondary">{row.description}</span> : null}
              </span>
            </button>
          );
        })}
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
                {GALLERY_ITEMS.slice(0, 8).map((item, i) => (
                  <GalleryFigure key={item.slug} item={item} index={i} moreFor={moreFor} onMore={setMoreFor} />
                ))}
              </div>
              <div className="flex min-w-0 flex-1 flex-col gap-2">
                {GALLERY_ITEMS.slice(8, 15).map((item, i) => (
                  <GalleryFigure key={item.slug} item={item} index={i + 8} moreFor={moreFor} onMore={setMoreFor} />
                ))}
              </div>
              <div className="flex min-w-0 flex-1 flex-col gap-2">
                {GALLERY_ITEMS.slice(15).map((item, i) => (
                  <GalleryFigure key={item.slug} item={item} index={i + 15} moreFor={moreFor} onMore={setMoreFor} />
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
