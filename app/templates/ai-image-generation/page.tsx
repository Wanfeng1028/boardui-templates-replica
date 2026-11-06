"use client";

import {
  RiAddLine,
  RiCloseLine,
  RiFileCopyLine,
  RiDownloadLine,
  RiExpandDiagonalLine,
  RiFullscreenLine,
  RiGitBranchLine,
  RiImageAiLine,
  RiMenuLine,
  RiMore2Fill,
  RiRefreshLine,
  RiShareLine,
  RiSparklingLine,
  RiThumbDownLine,
  RiThumbUpLine,
} from "@remixicon/react";
import { useCallback, useEffect, useRef, useState } from "react";

import {
  DASHBOARD_NAV,
  DashboardSidebar,
} from "@/components/application/dashboard/dashboard-sidebar";
import { AgentComposer } from "@/components/application/agent-chat/agent-composer";
import { IconButton } from "@/components/base/buttons/icon-button";
import { Tab, TabList, TabPanel, Tabs } from "@/components/base/tabs/tabs";
import { cx } from "@/utils/cx";

/**
 * AI Image Generation template replica.
 * Official: boardui.com/templates/ai-image-generation — "vibl coding
 * project / image generation" thread, prompt "Create a vintage editorial
 * illustration of Lionel Messi dribbling in Argentina's home kit against a
 * blue background.", Fable 5 / Main / project-sea, Gallery / Styles tabs,
 * 20 gallery prompts with per-image Enlarge / Download / More actions.
 *
 * Built only from free BoardUI components. The 20 original prompts are
 * shown in the gallery list below; the 7 image tiles use BoardUI's free
 * carousel assets as stand-ins (the official generated images are Pro
 * content and are not in the free repo), each paired with the first 7
 * original prompts in order.
 *
 * Images use plain <img>: this repo builds with output: "export", and
 * next/image's default optimizer throws a runtime error under that setting.
 */

const MODELS = ["Fable 5", "Fable 4", "Fable 3 Mini"];

const ORIGINAL_PROMPTS = [
  "Green ape, screenprint halftone",
  "Cloud crown, editorial portrait",
  "Cat with a beer, bold linework",
  "Hanok bookshop, pastel duotone",
  "Nairobi Vibes, blackletter poster",
  "Ronin in red, cel-shaded",
  "Bloom swirl, impasto abstraction",
  "Hoopoes in olive branches, gouache",
  "Girls and blooms, painterly crop",
  "Biker resting, watercolour manga",
  "Beach kid, 35mm flash",
  "Reader on pink, crayon texture",
  "Underwater highway, flat vector",
  "Perfume still life, grainy neon",
  "Yellow cabs, palette-knife oil",
  "Goldfish living room, surreal collage",
  "Linen campaign, crimson backdrop",
  "Helmet portraits, risograph grid",
  "Racing suit editorial, metallic green",
  "MASSIV3 packaging, studio mockup",
];

const STYLES = [
  "Screenprint",
  "Editorial",
  "Linework",
  "Duotone",
  "Poster",
  "Cel-shaded",
  "Impasto",
  "Watercolor",
];

type Generation = {
  id: string;
  src: string;
  prompt: string;
  style: string;
  liked: boolean | null;
};

const GALLERY_SEED: Generation[] = [
  { id: "g1", src: "/carousel/space-squid.webp", prompt: ORIGINAL_PROMPTS[0], style: "Screenprint", liked: null },
  { id: "g2", src: "/carousel/floral.webp", prompt: ORIGINAL_PROMPTS[1], style: "Editorial", liked: null },
  { id: "g3", src: "/carousel/vending-machine.webp", prompt: ORIGINAL_PROMPTS[2], style: "Linework", liked: null },
  { id: "g4", src: "/carousel/kitchen.webp", prompt: ORIGINAL_PROMPTS[3], style: "Duotone", liked: null },
  { id: "g5", src: "/carousel/seafood.webp", prompt: ORIGINAL_PROMPTS[4], style: "Poster", liked: null },
  { id: "g6", src: "/carousel/sunrise.webp", prompt: ORIGINAL_PROMPTS[5], style: "Cel-shaded", liked: null },
  { id: "g7", src: "/carousel/shark-collage.webp", prompt: ORIGINAL_PROMPTS[6], style: "Impasto", liked: null },
];

const MESSI_PROMPT =
  "Create a vintage editorial illustration of Lionel Messi dribbling in Argentina's home kit against a blue background.";

type Feedback = boolean | null;

export default function AiImageGenerationTemplatePage() {
  const [navOpen, setNavOpen] = useState(false);
  const [gallery, setGallery] = useState<Generation[]>(GALLERY_SEED);
  const [galleryOpen, setGalleryOpen] = useState(false);
  // Wide screens open with the gallery visible, like the original;
  // narrow screens start with the conversation full-width and the gallery
  // as a drawer.
  useEffect(() => {
    if (window.innerWidth >= 1280) setGalleryOpen(true);
  }, []);
  const [galleryExpanded, setGalleryExpanded] = useState(false);
  const [model, setModel] = useState(MODELS[0]);
  const [modelMenuOpen, setModelMenuOpen] = useState(false);
  const [activeStyle, setActiveStyle] = useState<string | null>(null);
  const [input, setInput] = useState("");
  const [busy, setBusy] = useState(false);
  const [progress, setProgress] = useState(57);
  const [result, setResult] = useState<Generation>({
    id: "messi",
    src: "/carousel/space-squid.webp",
    prompt: MESSI_PROMPT,
    style: "Editorial",
    liked: null,
  });
  const [resultFeedback, setResultFeedback] = useState<Feedback>(null);
  const [lightbox, setLightbox] = useState<Generation | null>(null);
  const [moreFor, setMoreFor] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);
  const resultRef = useRef<HTMLDivElement>(null);

  // The original thread is mid-generation at 57%; finish it on mount.
  useEffect(() => {
    const step = window.setInterval(() => {
      setProgress((p) => {
        if (p >= 100) {
          window.clearInterval(step);
          return 100;
        }
        return Math.min(100, p + 9);
      });
    }, 240);
    return () => window.clearInterval(step);
  }, []);

  const runGeneration = useCallback((prompt: string, style: string | null) => {
    const trimmed = prompt.trim();
    if (!trimmed || busy) return;
    setBusy(true);
    setProgress(4);
    setResultFeedback(null);
    const pool = GALLERY_SEED;
    const pick = pool[Math.floor(Math.random() * pool.length)];
    const step = window.setInterval(() => {
      setProgress((p) => Math.min(96, p + 8));
    }, 200);
    window.setTimeout(() => {
      window.clearInterval(step);
      setProgress(100);
      const gen: Generation = {
        id: `gen-${Date.now()}`,
        src: pick.src,
        prompt: trimmed,
        style: style ?? "Editorial",
        liked: null,
      };
      setResult(gen);
      setGallery((prev) => [gen, ...prev]);
      setBusy(false);
      resultRef.current?.scrollIntoView({ behavior: "smooth", block: "nearest" });
    }, 1800);
  }, [busy]);

  const submit = useCallback(
    (text: string) => {
      runGeneration(text, activeStyle);
      setInput("");
    },
    [runGeneration, activeStyle],
  );

  const copyText = useCallback((text: string, label: string) => {
    const done = () => {
      setNotice(label);
      window.setTimeout(() => setNotice(null), 2000);
    };
    if (navigator.clipboard?.writeText) {
      navigator.clipboard.writeText(text).then(done).catch(done);
    } else {
      done();
    }
  }, []);

  const downloadImage = useCallback((gen: Generation) => {
    const link = document.createElement("a");
    link.href = gen.src;
    link.download = `${gen.prompt.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "")}.webp`;
    document.body.appendChild(link);
    link.click();
    link.remove();
    setNotice(`Downloading “${gen.prompt}”.`);
    window.setTimeout(() => setNotice(null), 2000);
  }, []);

  const deleteGeneration = useCallback((id: string) => {
    setGallery((prev) => prev.filter((g) => g.id !== id));
    setMoreFor(null);
    setNotice("Removed from the gallery.");
    window.setTimeout(() => setNotice(null), 2000);
  }, []);

  const setLike = useCallback((id: string, value: boolean) => {
    if (id === result.id) {
      setResultFeedback((prev) => (prev === value ? null : value));
      return;
    }
    setGallery((prev) => prev.map((g) => (g.id === id ? { ...g, liked: g.liked === value ? null : value } : g)));
  }, [result.id]);

  const newGeneration = useCallback(() => {
    setGalleryOpen(true);
  }, []);

  const done = progress >= 100 && !busy;

  return (
    <div className="relative flex h-dvh w-full gap-4 overflow-hidden bg-background-full p-3">
      <DashboardSidebar items={DASHBOARD_NAV} selected="ai-image" className="hidden lg:flex" />

      {navOpen && (
        <div className="fixed inset-0 z-50 flex lg:hidden">
          <button type="button" aria-label="Close navigation" onClick={() => setNavOpen(false)} className="absolute inset-0 cursor-pointer bg-black/40" />
          <div className="relative flex h-full p-3">
            <DashboardSidebar mobile items={DASHBOARD_NAV} selected="ai-image" onClose={() => setNavOpen(false)} className="flex" />
          </div>
        </div>
      )}

      <div className="relative flex min-h-0 min-w-0 flex-1 gap-3 overflow-hidden">
        {/* Conversation column */}
        <div className="relative flex h-full min-w-0 flex-1 flex-col overflow-hidden rounded-3xl bg-background-secondary-default">
          <header className="flex h-12 shrink-0 items-center gap-2 border-b border-separator-border px-4">
            <IconButton icon={navOpen ? RiCloseLine : RiMenuLine} size="small" aria-label="Open navigation" onClick={() => setNavOpen((o) => !o)} className="lg:hidden" />
            <div className="flex min-w-0 flex-col leading-none">
              <span className="truncate text-headline-medium text-text-primary">Image generation</span>
              <span className="truncate text-body-2-regular text-text-tertiary">vibl coding project / image generation</span>
            </div>
            <div className="ms-auto flex shrink-0 items-center gap-1">
              <IconButton icon={RiShareLine} size="small" aria-label="Share chat" onClick={() => copyText(MESSI_PROMPT, "Prompt copied to clipboard.")} />
              <IconButton icon={RiImageAiLine} size="small" aria-label="Open gallery" onClick={() => setGalleryOpen((o) => !o)} className={cx(galleryOpen && "bg-background-secondary-hover", "xl:hidden")} />
              <IconButton icon={RiAddLine} size="small" aria-label="New generation" onClick={newGeneration} />
            </div>
          </header>
          {notice && (
            <p role="status" className="shrink-0 px-4 pt-2 text-body-2-medium text-text-secondary">{notice}</p>
          )}

          <div className="min-h-0 flex-1 overflow-y-auto scroll-smooth">
            <div className="mx-auto flex w-full max-w-3xl flex-col gap-5 px-4 pt-5 pb-6">
              {/* User prompt */}
              <p className="ms-auto flex w-fit max-w-[75%] flex-col rounded-2xl bg-background-primary-default px-3 py-[11px] text-start text-body-regular break-words whitespace-pre-wrap text-text-primary shadow-card">
                {MESSI_PROMPT}
              </p>

              {/* Live generation box */}
              <div ref={resultRef} className="flex flex-col gap-2 rounded-2xl border border-border-button-default bg-background-primary-default p-3">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="flex items-center gap-1.5 text-body-medium text-text-primary">
                    <RiSparklingLine className="size-4 shrink-0 text-foreground-icon-secondary" aria-hidden />
                    {model}
                  </span>
                  <span className="flex items-center gap-1 rounded-full border border-border-button-default px-2 py-0.5 text-body-2-medium text-text-secondary">
                    <RiGitBranchLine className="size-3.5 shrink-0" aria-hidden /> Main
                  </span>
                  <span className="rounded-full border border-border-button-default px-2 py-0.5 text-body-2-medium text-text-secondary">project-sea</span>
                  <span className="ms-auto flex items-center gap-2 text-body-2-medium text-text-secondary">
                    Agent
                    <span className="h-1.5 w-16 overflow-hidden rounded-full bg-background-tertiary-default">
                      <span className="block h-full rounded-full bg-accent-500 transition-[width] duration-300" style={{ width: `${progress}%` }} />
                    </span>
                    {done ? "Done" : `${progress}%`}
                  </span>
                </div>

                <div className="relative aspect-[4/3] w-full overflow-hidden rounded-xl bg-background-tertiary-default">
                  {done || busy ? (
                    <img src={result.src} alt={result.prompt} className={cx("absolute inset-0 h-full w-full object-cover transition-opacity duration-500", done ? "opacity-100" : "opacity-40 blur-[2px]")} />
                  ) : null}
                  {!done && (
                    <div className="absolute inset-0 flex flex-col items-center justify-center gap-2">
                      <p className="text-body-medium text-text-primary">Generating…</p>
                      <p className="text-title-2-medium text-text-primary tabular-nums">{progress}%</p>
                      <p className="max-w-[80%] text-center text-body-2-regular text-text-secondary">Fable 5 · {result.style} · {result.prompt}</p>
                    </div>
                  )}
                </div>

                {done && (
                  <div className="flex flex-wrap items-center gap-1.5 pt-1">
                    <button type="button" aria-label="Like generation" aria-pressed={resultFeedback === true} onClick={() => setLike(result.id, true)} className={cx("flex cursor-pointer items-center gap-1.5 rounded-full border px-2.5 py-1.5 text-body-2-medium transition-colors", resultFeedback === true ? "border-accent-500 bg-accent-50 text-text-primary" : "border-border-button-default bg-background-primary-default text-text-secondary hover:text-text-primary")}>
                      <RiThumbUpLine className="size-4" aria-hidden /> {resultFeedback === true ? "Liked" : "Like"}
                    </button>
                    <button type="button" aria-label="Dislike generation" aria-pressed={resultFeedback === false} onClick={() => setLike(result.id, false)} className={cx("flex cursor-pointer items-center gap-1.5 rounded-full border px-2.5 py-1.5 text-body-2-medium transition-colors", resultFeedback === false ? "border-accent-500 bg-accent-50 text-text-primary" : "border-border-button-default bg-background-primary-default text-text-secondary hover:text-text-primary")}>
                      <RiThumbDownLine className="size-4" aria-hidden /> {resultFeedback === false ? "Disliked" : "Dislike"}
                    </button>
                    <button type="button" onClick={() => runGeneration(result.prompt, result.style)} className="flex cursor-pointer items-center gap-1.5 rounded-full border border-border-button-default bg-background-primary-default px-2.5 py-1.5 text-body-2-medium text-text-secondary hover:text-text-primary">
                      <RiRefreshLine className="size-4" aria-hidden /> Regenerate
                    </button>
                    <button type="button" onClick={() => downloadImage(result)} className="flex cursor-pointer items-center gap-1.5 rounded-full border border-border-button-default bg-background-primary-default px-2.5 py-1.5 text-body-2-medium text-text-secondary hover:text-text-primary">
                      <RiDownloadLine className="size-4" aria-hidden /> Download
                    </button>
                    <button type="button" onClick={() => copyText(result.prompt, "Prompt copied to clipboard.")} className="flex cursor-pointer items-center gap-1.5 rounded-full border border-border-button-default bg-background-primary-default px-2.5 py-1.5 text-body-2-medium text-text-secondary hover:text-text-primary">
                      <RiFileCopyLine className="size-4" aria-hidden /> Copy prompt
                    </button>
                    <button type="button" aria-label="Enlarge generation" onClick={() => setLightbox(result)} className="ms-auto flex cursor-pointer items-center gap-1.5 rounded-full border border-border-button-default bg-background-primary-default px-2.5 py-1.5 text-body-2-medium text-text-secondary hover:text-text-primary">
                      <RiFullscreenLine className="size-4" aria-hidden /> Enlarge
                    </button>
                  </div>
                )}
                <p className="text-body-2-regular text-text-tertiary">
                  {result.prompt}
                  {activeStyle ? ` · Style: ${activeStyle}` : ""}
                </p>
              </div>

              <p className="px-1 text-body-2-regular text-text-tertiary">
                Images are stand-ins from BoardUI&apos;s free carousel assets; the prompts are the originals from the template.
              </p>
            </div>
          </div>

          {/* Composer */}
          <div className="shrink-0 px-3 pb-3">
            <div className="mx-auto w-full max-w-3xl">
              <div className="mb-2 flex flex-wrap items-center gap-2">
                <div className="relative">
                  <button type="button" onClick={() => setModelMenuOpen((o) => !o)} className="flex cursor-pointer items-center gap-1.5 rounded-full border border-border-button-default bg-background-primary-default px-2.5 py-1.5 text-body-medium text-text-primary shadow-xs hover:bg-background-primary-hover">
                    <RiSparklingLine className="size-4 shrink-0 text-foreground-icon-secondary" aria-hidden />
                    {model}
                  </button>
                  {modelMenuOpen && (
                    <>
                      <button type="button" aria-label="Close model menu" onClick={() => setModelMenuOpen(false)} className="fixed inset-0 z-10 cursor-default" />
                      <div className="absolute bottom-10 start-0 z-20 w-44 rounded-xl border border-border-button-default bg-background-primary-default p-1.5 shadow-card">
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
                {activeStyle && (
                  <button type="button" aria-label="Clear style" onClick={() => setActiveStyle(null)} className="flex cursor-pointer items-center gap-1 rounded-full border border-accent-500 bg-accent-50 px-2.5 py-1.5 text-body-2-medium text-text-primary">
                    Style: {activeStyle} ×
                  </button>
                )}
                <span className="text-body-2-regular text-text-tertiary">Prompt the image, then Generate runs locally.</span>
              </div>
              <AgentComposer value={input} onValueChange={setInput} onSubmit={() => submit(input)} onStop={() => setBusy(false)} busy={busy} model={model} provider="Demo mode" messageCount={1} />
            </div>
          </div>
        </div>

        {/* Gallery panel */}
        {galleryOpen && (
          <>
            <button type="button" aria-label="Close gallery panel" onClick={() => setGalleryOpen(false)} className="absolute inset-0 z-30 cursor-pointer bg-black/40 xl:hidden" />
            <section aria-label="Gallery panel" className="absolute inset-y-3 right-3 z-40 flex w-[min(480px,92vw)] flex-col overflow-hidden rounded-3xl border border-border-button-default bg-background-secondary-default shadow-card xl:static xl:inset-auto xl:z-auto xl:w-auto xl:shrink-0 xl:shadow-none">
              <div className={cx("flex h-full w-full flex-col", galleryExpanded ? "xl:w-[560px]" : "xl:w-[400px]")}>
                <GalleryPanel
                  gallery={gallery}
                  expanded={galleryExpanded}
                  onExpand={() => setGalleryExpanded((e) => !e)}
                  onClose={() => setGalleryOpen(false)}
                  onNew={newGeneration}
                  activeStyle={activeStyle}
                  onStyle={(s) => setActiveStyle((prev) => (prev === s ? null : s))}
                  onEnlarge={setLightbox}
                  onDownload={downloadImage}
                  onCopy={(g) => copyText(g.prompt, "Prompt copied to clipboard.")}
                  onDelete={deleteGeneration}
                  moreFor={moreFor}
                  onMore={setMoreFor}
                  onLike={(id, v) => setLike(id, v)}
                />
              </div>
            </section>
          </>
        )}
      </div>

      {/* Lightbox */}
      {lightbox && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4" role="dialog" aria-modal="true" aria-label={lightbox.prompt}>
          <button type="button" aria-label="Close image viewer" onClick={() => setLightbox(null)} className="absolute inset-0 cursor-pointer bg-black/70" />
          <div className="relative flex max-h-full w-full max-w-3xl flex-col gap-3 overflow-hidden rounded-3xl bg-background-primary-default p-4 shadow-card">
            <div className="flex items-center justify-between gap-2">
              <p className="min-w-0 truncate text-title-3-semibold text-text-primary">{lightbox.prompt}</p>
              <IconButton icon={RiCloseLine} size="small" aria-label="Close viewer" onClick={() => setLightbox(null)} />
            </div>
            <div className="relative aspect-[4/3] w-full overflow-hidden rounded-2xl">
              <img src={lightbox.src} alt={lightbox.prompt} className="absolute inset-0 h-full w-full object-cover" />
            </div>
            <div className="flex flex-wrap items-center gap-1.5">
              <span className="rounded-full border border-border-button-default px-2.5 py-1 text-body-2-medium text-text-secondary">{lightbox.style}</span>
              <button type="button" aria-label="Like image" aria-pressed={lightbox.liked === true} onClick={() => setLike(lightbox.id, true)} className={cx("flex cursor-pointer items-center gap-1.5 rounded-full border px-2.5 py-1.5 text-body-2-medium", lightbox.liked === true ? "border-accent-500 bg-accent-50 text-text-primary" : "border-border-button-default text-text-secondary hover:text-text-primary")}>
                <RiThumbUpLine className="size-4" aria-hidden /> Like
              </button>
              <button type="button" aria-label="Dislike image" aria-pressed={lightbox.liked === false} onClick={() => setLike(lightbox.id, false)} className={cx("flex cursor-pointer items-center gap-1.5 rounded-full border px-2.5 py-1.5 text-body-2-medium", lightbox.liked === false ? "border-accent-500 bg-accent-50 text-text-primary" : "border-border-button-default text-text-secondary hover:text-text-primary")}>
                <RiThumbDownLine className="size-4" aria-hidden /> Dislike
              </button>
              <button type="button" onClick={() => downloadImage(lightbox)} className="flex cursor-pointer items-center gap-1.5 rounded-full border border-border-button-default px-2.5 py-1.5 text-body-2-medium text-text-secondary hover:text-text-primary">
                <RiDownloadLine className="size-4" aria-hidden /> Download
              </button>
              <button type="button" onClick={() => copyText(lightbox.prompt, "Prompt copied to clipboard.")} className="flex cursor-pointer items-center gap-1.5 rounded-full border border-border-button-default px-2.5 py-1.5 text-body-2-medium text-text-secondary hover:text-text-primary">
                <RiFileCopyLine className="size-4" aria-hidden /> Copy prompt
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function GalleryPanel({
  gallery, expanded, onExpand, onClose, onNew, activeStyle, onStyle, onEnlarge, onDownload, onCopy, onDelete, moreFor, onMore, onLike,
}: {
  gallery: Generation[];
  expanded: boolean;
  onExpand: () => void;
  onClose: () => void;
  onNew: () => void;
  activeStyle: string | null;
  onStyle: (s: string) => void;
  onEnlarge: (g: Generation) => void;
  onDownload: (g: Generation) => void;
  onCopy: (g: Generation) => void;
  onDelete: (id: string) => void;
  moreFor: string | null;
  onMore: (id: string | null) => void;
  onLike: (id: string, v: boolean) => void;
}) {
  return (
    <div className="flex h-full min-h-0 w-full flex-col">
      <header className="flex h-12 shrink-0 items-center gap-1 border-b border-separator-border px-3">
        <span className="flex items-center gap-1.5 ps-1 text-headline-medium text-text-primary">
          <RiImageAiLine className="size-5 shrink-0 text-foreground-icon-secondary" aria-hidden /> Gallery
        </span>
        <span className="rounded-full bg-background-primary-default px-2 py-0.5 text-body-2-medium text-text-secondary">{gallery.length} images</span>
        <div className="ms-auto flex shrink-0 items-center gap-0.5">
          <IconButton icon={RiAddLine} size="small" aria-label="New generation" onClick={onNew} />
          <IconButton icon={RiExpandDiagonalLine} size="small" aria-label="Expand panel" onClick={onExpand} className={cx(expanded && "bg-background-secondary-hover", "hidden xl:flex")} />
          <IconButton icon={RiCloseLine} size="small" aria-label="Close gallery" onClick={onClose} />
        </div>
      </header>

      <Tabs defaultSelectedKey="gallery" className="flex min-h-0 flex-1 flex-col">
        <TabList aria-label="Image generation sections" className="shrink-0 px-3 pt-2">
          <Tab id="gallery">Gallery</Tab>
          <Tab id="styles">Styles</Tab>
        </TabList>
        <TabPanel id="gallery" className="min-h-0 flex-1 overflow-y-auto px-3 pt-3 pb-4">
          {gallery.length === 0 ? (
            <p className="pt-2 text-body-regular text-text-secondary">Gallery is empty. Generate an image to fill it again.</p>
          ) : (
            <div className="grid w-full grid-cols-1 gap-3 min-[480px]:grid-cols-2">
              {gallery.map((gen) => (
                <figure key={gen.id} className="group flex w-full flex-col gap-2 overflow-hidden rounded-2xl border border-border-button-default bg-background-primary-default p-2">
                  <button type="button" onClick={() => onEnlarge(gen)} aria-label={`Enlarge ${gen.prompt}`} className="relative block aspect-[4/3] w-full cursor-pointer overflow-hidden rounded-xl">
                    <img src={gen.src} alt={gen.prompt} className="absolute inset-0 h-full w-full object-cover transition-transform duration-300 group-hover:scale-[1.03]" />
                    <span className="absolute inset-x-2 bottom-2 flex items-center justify-end gap-1 opacity-0 transition-opacity group-hover:opacity-100 group-focus-within:opacity-100">
                      <span className="flex size-8 items-center justify-center rounded-full bg-black/60 text-white" title="Enlarge"><RiFullscreenLine className="size-4" aria-hidden /></span>
                    </span>
                  </button>
                  <figcaption className="flex w-full items-start justify-between gap-2 px-1 pb-1">
                    <span className="flex min-w-0 flex-col gap-0.5">
                      <span title={gen.prompt} className="line-clamp-2 text-body-medium text-text-primary">{gen.prompt}</span>
                      <span className="text-body-2-regular text-text-tertiary">{gen.style}{gen.liked === true ? " · Liked" : gen.liked === false ? " · Disliked" : ""}</span>
                    </span>
                    <span className="flex shrink-0 items-center gap-0.5">
                      <button type="button" aria-label={`Download ${gen.prompt}`} onClick={() => onDownload(gen)} className="flex size-7 cursor-pointer items-center justify-center rounded-full text-foreground-icon-secondary hover:bg-background-secondary-hover hover:text-foreground-icon-primary">
                        <RiDownloadLine className="size-4" aria-hidden />
                      </button>
                      <span className="relative">
                        <button type="button" aria-label={`More actions for ${gen.prompt}`} aria-expanded={moreFor === gen.id} onClick={() => onMore(moreFor === gen.id ? null : gen.id)} className="flex size-7 cursor-pointer items-center justify-center rounded-full text-foreground-icon-secondary hover:bg-background-secondary-hover hover:text-foreground-icon-primary">
                          <RiMore2Fill className="size-4" aria-hidden />
                        </button>
                        {moreFor === gen.id && (
                          <>
                            <button type="button" aria-label="Close actions menu" onClick={() => onMore(null)} className="fixed inset-0 z-10 cursor-default" />
                            <span className="absolute end-0 top-8 z-20 w-44 rounded-xl border border-border-button-default bg-background-primary-default p-1.5 shadow-card">
                              <button type="button" onClick={() => { onMore(null); onCopy(gen); }} className="flex w-full cursor-pointer items-center gap-2 rounded-lg px-2 py-1.5 text-start text-body-medium text-text-primary hover:bg-background-secondary-hover">
                                <RiFileCopyLine className="size-4 shrink-0" aria-hidden /> Copy prompt
                              </button>
                              <button type="button" onClick={() => { onMore(null); onLike(gen.id, true); }} className="flex w-full cursor-pointer items-center gap-2 rounded-lg px-2 py-1.5 text-start text-body-medium text-text-primary hover:bg-background-secondary-hover">
                                <RiThumbUpLine className="size-4 shrink-0" aria-hidden /> Like
                              </button>
                              <button type="button" onClick={() => { onMore(null); onLike(gen.id, false); }} className="flex w-full cursor-pointer items-center gap-2 rounded-lg px-2 py-1.5 text-start text-body-medium text-text-primary hover:bg-background-secondary-hover">
                                <RiThumbDownLine className="size-4 shrink-0" aria-hidden /> Dislike
                              </button>
                              <button type="button" onClick={() => onDelete(gen.id)} className="flex w-full cursor-pointer items-center gap-2 rounded-lg px-2 py-1.5 text-start text-body-medium text-text-error-primary hover:bg-background-secondary-hover">
                                <RiCloseLine className="size-4 shrink-0" aria-hidden /> Remove
                              </button>
                            </span>
                          </>
                        )}
                      </span>
                    </span>
                  </figcaption>
                </figure>
              ))}
            </div>
          )}
          <div className="pt-4">
            <p className="pb-2 text-body-2-medium text-text-tertiary">All 20 original prompts</p>
            <ul className="flex flex-col gap-1">
              {ORIGINAL_PROMPTS.map((prompt, i) => (
                <li key={prompt} className="flex items-center gap-2 text-body-2-regular text-text-secondary">
                  <span className="w-6 shrink-0 text-end tabular-nums text-text-tertiary">{i + 1}</span>
                  <span className="min-w-0 truncate">{prompt}</span>
                  {i < 7 && <span className="shrink-0 rounded-md bg-background-primary-default px-1.5 py-0.5 text-body-2-medium text-text-tertiary">in gallery</span>}
                </li>
              ))}
            </ul>
          </div>
        </TabPanel>
        <TabPanel id="styles" className="min-h-0 flex-1 overflow-y-auto px-3 pt-3 pb-4">
          <p className="pb-3 text-body-regular text-text-secondary">Pick a style to steer the next generation. The active style is attached to your next prompt.</p>
          <div className="flex flex-wrap gap-2">
            {STYLES.map((style) => (
              <button key={style} type="button" aria-pressed={activeStyle === style} onClick={() => onStyle(style)} className={cx("cursor-pointer rounded-full border px-3 py-1.5 text-body-medium transition-colors", activeStyle === style ? "border-accent-500 bg-accent-50 text-text-primary" : "border-border-button-default bg-background-primary-default text-text-secondary hover:text-text-primary")}>
                {style}
              </button>
            ))}
          </div>
          {activeStyle && (
            <p className="pt-3 text-body-2-medium text-text-secondary">Active style: {activeStyle}. Send a prompt to generate with it.</p>
          )}
        </TabPanel>
      </Tabs>
    </div>
  );
}
