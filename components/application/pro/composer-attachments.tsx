"use client";

import { useEffect, useState } from "react";
import { RiCloseLine, RiFileTextLine, RiImageLine, RiAddLine } from "@remixicon/react";
import { ComposerPanel } from "@/components/application/pro/composer-panel";
import { cx } from "@/utils/cx";

/**
 * Composer Attachments (Pro replica) — Composer Panel with attachment tiles.
 * Built only from free BoardUI components plus mock data.
 * Not the official Pro source.
 * Image + document tiles sit above the prompt, drop in one by one,
 * and each draws an upload ring while it lands.
 */

type Attachment = {
  id: number;
  kind: "image" | "doc";
  name: string;
  size: string;
  progress: number; // 0..100
  color: string;
};

const PRESETS: Omit<Attachment, "id" | "progress">[] = [
  { kind: "image", name: "hero-mock.png", size: "248 KB", color: "bg-chart-2" },
  { kind: "doc", name: "brief.md", size: "12 KB", color: "bg-chart-1" },
  { kind: "image", name: "logo-v2.svg", size: "8 KB", color: "bg-chart-3" },
];

function UploadRing({ progress, done }: { progress: number; done: boolean }) {
  const r = 13;
  const c = 2 * Math.PI * r;
  return (
    <span className="relative flex size-8 shrink-0 items-center justify-center" aria-label={done ? "Upload complete" : `Uploading ${Math.round(progress)}%`}>
      <svg width="32" height="32" viewBox="0 0 32 32" className="-rotate-90">
        <circle cx="16" cy="16" r={r} fill="none" strokeWidth="2.5" className="stroke-background-tertiary-default" />
        <circle
          cx="16" cy="16" r={r} fill="none" strokeWidth="2.5" strokeLinecap="round"
          className="stroke-accent-500 transition-[stroke-dashoffset] duration-150"
          strokeDasharray={c}
          strokeDashoffset={c * (1 - progress / 100)}
        />
      </svg>
      <span className="absolute text-caption-2-medium text-text-secondary tabular-nums">
        {done ? "✓" : Math.round(progress)}
      </span>
    </span>
  );
}

export function ComposerAttachments({ className }: { className?: string }) {
  const [attachments, setAttachments] = useState<Attachment[]>([]);
  const [nextId, setNextId] = useState(1);

  // Tiles drop in one by one on mount, each with its own upload ring.
  useEffect(() => {
    const timers: number[] = [];
    PRESETS.forEach((preset, i) => {
      timers.push(window.setTimeout(() => {
        setAttachments((list) => [...list, { ...preset, id: i + 1, progress: 0 }]);
        setNextId(i + 2);
      }, 350 + i * 500));
    });
    return () => timers.forEach((t) => window.clearTimeout(t));
  }, []);

  // Advance each unfinished upload.
  useEffect(() => {
    if (attachments.every((a) => a.progress >= 100)) return;
    const id = window.setInterval(() => {
      setAttachments((list) => list.map((a) => (a.progress >= 100 ? a : { ...a, progress: Math.min(100, a.progress + 12 + Math.random() * 10) })));
    }, 180);
    return () => window.clearInterval(id);
  }, [attachments]);

  const addTile = () => {
    const preset = PRESETS[(nextId - 1) % PRESETS.length];
    setAttachments((list) => [...list, { ...preset, id: nextId, progress: 0, name: preset.name.replace(/(\.[^.]+)$/, `-${nextId}$1`) }]);
    setNextId((n) => n + 1);
  };

  return (
    <div className={cx("flex w-full flex-col gap-2.5", className)}>
      <div className="flex w-full flex-col gap-2">
        {attachments.map((a) => (
          <div
            key={a.id}
            className="flex w-full items-center gap-3 rounded-2xl border border-border-button-default bg-background-secondary-default px-3 py-2.5"
            style={{ animation: "bui-tile-drop 0.35s ease-out" }}
          >
            <style>{`@keyframes bui-tile-drop { from { opacity: 0; transform: translateY(-8px); } to { opacity: 1; transform: translateY(0); } }`}</style>
            <span className={cx("flex size-9 shrink-0 items-center justify-center rounded-xl text-white", a.color)}>
              {a.kind === "image" ? <RiImageLine className="size-4" /> : <RiFileTextLine className="size-4" />}
            </span>
            <span className="min-w-0 flex-1">
              <span className="block truncate text-body-2-medium text-text-primary">{a.name}</span>
              <span className="block text-caption-1-regular text-text-tertiary tabular-nums">
                {a.size} · {a.progress >= 100 ? "Attached" : "Uploading…"}
              </span>
            </span>
            <UploadRing progress={a.progress} done={a.progress >= 100} />
            <button
              type="button"
              aria-label={`Remove ${a.name}`}
              onClick={() => setAttachments((list) => list.filter((x) => x.id !== a.id))}
              className="flex size-7 shrink-0 cursor-pointer items-center justify-center rounded-full bg-background-tertiary-default text-text-secondary outline-none hover:text-text-primary focus-visible:ring-2 focus-visible:ring-border-focus-ring"
            >
              <RiCloseLine className="size-4" />
            </button>
          </div>
        ))}
        <button
          type="button"
          onClick={addTile}
          className="inline-flex w-fit cursor-pointer items-center gap-1.5 rounded-full border border-dashed border-border-button-default px-3 py-1.5 text-caption-1-medium text-text-secondary outline-none hover:text-text-primary focus-visible:ring-2 focus-visible:ring-border-focus-ring"
        >
          <RiAddLine className="size-3.5" /> Add attachment
        </button>
      </div>
      <ComposerPanel />
    </div>
  );
}
