"use client";

import { useState } from "react";
import { RiCheckLine, RiMicLine, RiSparklingLine } from "@remixicon/react";
import { AgentAvatarFace, type AvatarMood, type AvatarShape } from "@/components/application/pro/agent-avatar";
import { cx } from "@/utils/cx";

/**
 * Agent Creator (Pro replica) — controlled agent creation sidebar.
 * Built only from free BoardUI components plus mock data.
 * Not the official Pro source.
 * Animated avatar, emoji + shape pickers, custom colour,
 * profile fields, voice preference.
 */

const EMOJIS = ["🦊", "🐱", "🦉", "🤖", "🐸", "🐼", "🐰", "👻", "🦁"];
const SHAPES: { id: AvatarShape; label: string }[] = [
  { id: "circle", label: "Circle" },
  { id: "rounded", label: "Rounded" },
  { id: "blob", label: "Blob" },
];
const COLORS = ["#f59e0b", "#f472b6", "#8b5cf6", "#22c55e", "#0ea5e9", "#ef4444", "#f97316", "#64748b"];
const VOICES = [
  { id: "nova", label: "Nova", hint: "Warm, upbeat" },
  { id: "sage", label: "Sage", hint: "Calm, measured" },
  { id: "echo", label: "Echo", hint: "Bright, quick" },
];

export function AgentCreator({ className }: { className?: string }) {
  const [emoji, setEmoji] = useState("🦊");
  const [shape, setShape] = useState<AvatarShape>("blob");
  const [color, setColor] = useState("#f59e0b");
  const [mood, setMood] = useState<AvatarMood>("happy");
  const [name, setName] = useState("Scout");
  const [role, setRole] = useState("Research assistant");
  const [bio, setBio] = useState("Reads the web, checks the sources, and writes the summary.");
  const [voice, setVoice] = useState("nova");
  const [saved, setSaved] = useState(false);

  const silhouette = emoji === "🐱" ? "cat" : emoji === "🦉" ? "owl" : emoji === "🤖" ? "robot" : emoji === "🐸" ? "frog" : emoji === "🐼" ? "panda" : emoji === "🐰" ? "bunny" : emoji === "👻" ? "ghost" : "fox";

  return (
    <div className={cx("flex w-full flex-col gap-4 rounded-3xl border border-border-button-default bg-background-secondary-default p-4 sm:p-5", className)}>
      <div className="flex items-center gap-3">
        <div className="relative shrink-0">
          <AgentAvatarFace silhouette={silhouette} mood={mood} color={color} shape={shape} size={72} />
          <span className="absolute -bottom-1 -end-1 flex size-6 items-center justify-center rounded-full bg-background-primary-default text-base leading-none shadow-sm ring-1 ring-border-button-default">
            {emoji}
          </span>
        </div>
        <div className="min-w-0">
          <p className="truncate text-title-3-semibold text-text-primary">{name || "Unnamed agent"}</p>
          <p className="truncate text-body-2-regular text-text-secondary">{role || "No role yet"}</p>
          <p className="text-caption-1-regular text-text-tertiary">Live preview · updates as you type</p>
        </div>
      </div>

      <fieldset>
        <legend className="text-caption-1-semibold text-text-secondary">Emoji</legend>
        <div className="mt-1.5 flex flex-wrap gap-1.5">
          {EMOJIS.map((e) => (
            <button
              key={e}
              type="button"
              onClick={() => setEmoji(e)}
              aria-pressed={emoji === e}
              aria-label={`Emoji ${e}`}
              className={cx(
                "flex size-9 cursor-pointer items-center justify-center rounded-xl text-lg outline-none focus-visible:ring-2 focus-visible:ring-border-focus-ring",
                emoji === e ? "bg-accent-500/15 ring-2 ring-accent-500" : "bg-background-primary-default hover:bg-background-tertiary-default",
              )}
            >
              {e}
            </button>
          ))}
        </div>
      </fieldset>

      <div className="grid w-full grid-cols-1 gap-4 sm:grid-cols-2">
        <fieldset>
          <legend className="text-caption-1-semibold text-text-secondary">Shape</legend>
          <div className="mt-1.5 flex flex-wrap gap-1.5">
            {SHAPES.map((s) => (
              <button
                key={s.id}
                type="button"
                onClick={() => setShape(s.id)}
                aria-pressed={shape === s.id}
                className={cx(
                  "cursor-pointer rounded-full px-3 py-1.5 text-caption-1-medium outline-none focus-visible:ring-2 focus-visible:ring-border-focus-ring",
                  shape === s.id ? "bg-accent-500 text-white" : "bg-background-tertiary-default text-text-secondary hover:text-text-primary",
                )}
              >
                {s.label}
              </button>
            ))}
          </div>
        </fieldset>
        <fieldset>
          <legend className="text-caption-1-semibold text-text-secondary">Colour</legend>
          <div className="mt-1.5 flex flex-wrap gap-1.5">
            {COLORS.map((c) => (
              <button
                key={c}
                type="button"
                onClick={() => setColor(c)}
                aria-pressed={color === c}
                aria-label={`Colour ${c}`}
                className={cx(
                  "flex size-7 cursor-pointer items-center justify-center rounded-full outline-none focus-visible:ring-2 focus-visible:ring-border-focus-ring",
                  color === c && "ring-2 ring-offset-2 ring-accent-500",
                )}
                style={{ backgroundColor: c }}
              >
                {color === c && <RiCheckLine className="size-3.5 text-white" />}
              </button>
            ))}
          </div>
        </fieldset>
      </div>

      <div className="grid w-full grid-cols-1 gap-3 sm:grid-cols-2">
        <label className="flex flex-col gap-1.5">
          <span className="text-caption-1-semibold text-text-secondary">Name</span>
          <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Agent name" className="w-full rounded-xl border border-border-button-default bg-background-primary-default px-3 py-2 text-body-regular text-text-primary placeholder:text-text-placeholder outline-none focus-visible:ring-2 focus-visible:ring-border-focus-ring" />
        </label>
        <label className="flex flex-col gap-1.5">
          <span className="text-caption-1-semibold text-text-secondary">Role</span>
          <input value={role} onChange={(e) => setRole(e.target.value)} placeholder="What does it do?" className="w-full rounded-xl border border-border-button-default bg-background-primary-default px-3 py-2 text-body-regular text-text-primary placeholder:text-text-placeholder outline-none focus-visible:ring-2 focus-visible:ring-border-focus-ring" />
        </label>
      </div>
      <label className="flex flex-col gap-1.5">
        <span className="text-caption-1-semibold text-text-secondary">Bio</span>
        <textarea value={bio} onChange={(e) => setBio(e.target.value)} rows={2} placeholder="One or two lines about this agent…" className="w-full resize-none rounded-xl border border-border-button-default bg-background-primary-default px-3 py-2 text-body-regular text-text-primary placeholder:text-text-placeholder outline-none focus-visible:ring-2 focus-visible:ring-border-focus-ring" />
      </label>

      <fieldset>
        <legend className="flex items-center gap-1.5 text-caption-1-semibold text-text-secondary">
          <RiMicLine className="size-3.5" /> Voice preference
        </legend>
        <div className="mt-1.5 flex w-full flex-col gap-2">
          {VOICES.map((v) => (
            <button
              key={v.id}
              type="button"
              onClick={() => setVoice(v.id)}
              aria-pressed={voice === v.id}
              className={cx(
                "flex w-full cursor-pointer items-center gap-3 rounded-2xl border px-3.5 py-2.5 text-start outline-none focus-visible:ring-2 focus-visible:ring-border-focus-ring",
                voice === v.id ? "border-accent-500 bg-accent-500/15" : "border-border-button-default bg-background-primary-default",
              )}
            >
              <span className={cx("flex size-6 items-center justify-center rounded-full border text-caption-1-semibold", voice === v.id ? "border-accent-500 bg-accent-500 text-white" : "border-border-button-default text-text-secondary")}>
                {voice === v.id ? <RiCheckLine className="size-3.5" /> : v.label.slice(0, 1)}
              </span>
              <span className="min-w-0 flex-1">
                <span className="block text-body-medium text-text-primary">{v.label}</span>
                <span className="block text-body-2-regular text-text-secondary">{v.hint}</span>
              </span>
            </button>
          ))}
        </div>
      </fieldset>

      <div className="flex w-full flex-wrap items-center gap-2 border-t border-separator-border pt-3">
        <button
          type="button"
          onClick={() => { setSaved(true); window.setTimeout(() => setSaved(false), 2500); }}
          className="inline-flex cursor-pointer items-center gap-1.5 rounded-full bg-accent-500 px-4 py-2 text-body-2-medium text-white outline-none hover:bg-accent-600 focus-visible:ring-2 focus-visible:ring-border-focus-ring"
        >
          <RiSparklingLine className="size-4" /> {saved ? "Saved!" : "Create agent"}
        </button>
        <span className="text-caption-1-regular text-text-tertiary">
          {saved ? `${name || "Agent"} is ready (demo — nothing was stored).` : "Mood: " + mood + " · Shape: " + shape}
        </span>
      </div>
    </div>
  );
}
