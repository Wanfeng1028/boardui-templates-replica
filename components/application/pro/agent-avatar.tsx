"use client";

import { useState } from "react";
import { RiRefreshLine } from "@remixicon/react";
import { cx } from "@/utils/cx";

/**
 * Agent Avatar (Pro replica) — animated paper avatar.
 * Built only from free BoardUI components plus hand-drawn SVG.
 * Not the official Pro source.
 * Wandering eyes, blinking, nine silhouettes, 3D turn on click.
 */

export type AvatarMood = "happy" | "calm" | "thinking" | "excited";
export type AvatarShape = "circle" | "rounded" | "blob";

const SILHOUETTES = [
  { id: "fox", label: "Fox", ears: "M18 34 L26 12 L40 30", body: "#f59e0b" },
  { id: "cat", label: "Cat", ears: "M20 32 L28 10 L42 28", body: "#f472b6" },
  { id: "bear", label: "Bear", ears: "M20 30 Q16 12 30 16 Q34 26 30 32", body: "#a16207" },
  { id: "owl", label: "Owl", ears: "M22 30 L30 12 L38 30", body: "#8b5cf6" },
  { id: "robot", label: "Robot", ears: "M24 26 h32 M28 26 v-8 M52 26 v-8", body: "#64748b" },
  { id: "bunny", label: "Bunny", ears: "M28 32 Q24 6 34 8 Q38 26 34 32 M52 32 Q56 6 46 8 Q42 26 46 32", body: "#f9a8d4" },
  { id: "panda", label: "Panda", ears: "M22 30 Q14 14 28 16 Q34 26 28 32 M58 30 Q66 14 52 16 Q46 26 52 32", body: "#334155" },
  { id: "frog", label: "Frog", ears: "M26 28 Q22 10 34 12 Q38 24 34 28 M54 28 Q58 10 46 12 Q42 24 46 28", body: "#22c55e" },
  { id: "ghost", label: "Ghost", ears: "M24 44 Q24 20 40 20 Q56 20 56 44 L50 38 L45 44 L40 38 L35 44 L30 38 Z", body: "#94a3b8" },
] as const;

const MOODS: { id: AvatarMood; label: string; mouth: string; eyes: string }[] = [
  { id: "happy", label: "Happy", mouth: "M32 52 Q40 60 48 52", eyes: "open" },
  { id: "calm", label: "Calm", mouth: "M34 54 Q40 57 46 54", eyes: "open" },
  { id: "thinking", label: "Thinking", mouth: "M34 55 L46 55", eyes: "side" },
  { id: "excited", label: "Excited", mouth: "M32 50 Q40 62 48 50", eyes: "open" },
];

export function AgentAvatarFace({
  silhouette,
  mood,
  color,
  shape,
  size = 96,
  turn = false,
}: {
  silhouette: string;
  mood: AvatarMood;
  color: string;
  shape: AvatarShape;
  size?: number;
  turn?: boolean;
}) {
  const sil = SILHOUETTES.find((s) => s.id === silhouette) ?? SILHOUETTES[0];
  const m = MOODS.find((x) => x.id === mood) ?? MOODS[0];
  const eyeY = m.id === "excited" ? 40 : 42;
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 80 80"
      role="img"
      aria-label={`${sil.label} avatar, ${m.label}`}
      className={cx("shrink-0 transition-transform duration-500", turn && "[transform:rotateY(180deg)]")}
      style={{ filter: "drop-shadow(0 4px 10px rgb(0 0 0 / 0.12))" }}
    >
      <style>{`@keyframes bui-blink { 0%, 92%, 100% { transform: scaleY(1); } 95% { transform: scaleY(0.08); } }
        @keyframes bui-wander { 0%, 100% { transform: translate(0px, 0px); } 25% { transform: translate(2px, 1px); } 50% { transform: translate(-2px, 0px); } 75% { transform: translate(1px, -1px); } }
        .bui-eye { animation: bui-blink 4.2s infinite; transform-origin: center; transform-box: fill-box; }
        .bui-pupils { animation: bui-wander 7s ease-in-out infinite; }`}</style>
      <path
        d={shape === "circle" ? "M40 6 A34 34 0 1 1 40 74 A34 34 0 1 1 40 6" : shape === "rounded" ? "M14 14 h52 a10 10 0 0 1 10 10 v32 a10 10 0 0 1 -10 10 h-52 a10 10 0 0 1 -10 -10 v-32 a10 10 0 0 1 10 -10" : "M40 6 C58 4 74 18 74 38 C74 58 58 74 40 74 C22 74 6 58 6 38 C6 18 22 4 40 6"}
        fill={color}
      />
      <path d={sil.ears} fill="none" stroke={color} strokeWidth="5" strokeLinecap="round" />
      <g className="bui-pupils">
        <g className="bui-eye">
          <ellipse cx={m.id === "thinking" ? 34 : 31} cy={eyeY} rx="4" ry="5" fill="#1f2937" />
        </g>
        <g className="bui-eye">
          <ellipse cx={m.id === "thinking" ? 50 : 49} cy={eyeY} rx="4" ry="5" fill="#1f2937" />
        </g>
        <circle cx={m.id === "thinking" ? 35.5 : 32.5} cy={eyeY - 1.5} r="1.4" fill="#fff" />
        <circle cx={m.id === "thinking" ? 51.5 : 50.5} cy={eyeY - 1.5} r="1.4" fill="#fff" />
      </g>
      <path d={m.mouth} fill="none" stroke="#1f2937" strokeWidth="2.5" strokeLinecap="round" />
      {m.id === "happy" && (
        <>
          <circle cx="22" cy="50" r="3" fill="#fda4af" opacity="0.7" />
          <circle cx="58" cy="50" r="3" fill="#fda4af" opacity="0.7" />
        </>
      )}
    </svg>
  );
}

export function AgentAvatar({ className }: { className?: string }) {
  const [sil, setSil] = useState("fox");
  const [mood, setMood] = useState<AvatarMood>("happy");
  const [turn, setTurn] = useState(false);
  const color = (SILHOUETTES.find((s) => s.id === sil) ?? SILHOUETTES[0]).body;

  return (
    <div className={cx("flex w-full flex-col items-center gap-4 rounded-3xl border border-border-button-default bg-background-secondary-default p-4", className)}>
      <button
        type="button"
        onClick={() => setTurn((t) => !t)}
        aria-label="Turn the avatar around"
        className="cursor-pointer rounded-full outline-none focus-visible:ring-2 focus-visible:ring-border-focus-ring"
        title="Click to turn around"
      >
        <AgentAvatarFace silhouette={sil} mood={mood} color={color} shape="blob" size={120} turn={turn} />
      </button>
      <p className="text-caption-1-regular text-text-tertiary">Click the avatar for a 3D turn · eyes wander and blink</p>
      <div className="flex flex-wrap justify-center gap-1.5">
        {SILHOUETTES.map((s) => (
          <button
            key={s.id}
            type="button"
            onClick={() => setSil(s.id)}
            aria-pressed={sil === s.id}
            className={cx(
              "cursor-pointer rounded-full px-2.5 py-1 text-caption-1-medium outline-none focus-visible:ring-2 focus-visible:ring-border-focus-ring",
              sil === s.id ? "bg-accent-500 text-white" : "bg-background-tertiary-default text-text-secondary hover:text-text-primary",
            )}
          >
            {s.label}
          </button>
        ))}
      </div>
      <div className="flex flex-wrap justify-center gap-1.5">
        {MOODS.map((m) => (
          <button
            key={m.id}
            type="button"
            onClick={() => setMood(m.id)}
            aria-pressed={mood === m.id}
            className={cx(
              "cursor-pointer rounded-full border px-2.5 py-1 text-caption-1-medium outline-none focus-visible:ring-2 focus-visible:ring-border-focus-ring",
              mood === m.id ? "border-accent-500 text-accent-600" : "border-border-button-default text-text-secondary",
            )}
          >
            {m.label}
          </button>
        ))}
        <button
          type="button"
          onClick={() => setSil(SILHOUETTES[Math.floor(Math.random() * SILHOUETTES.length)].id)}
          className="inline-flex cursor-pointer items-center gap-1 rounded-full bg-background-tertiary-default px-2.5 py-1 text-caption-1-medium text-text-secondary outline-none hover:text-text-primary focus-visible:ring-2 focus-visible:ring-border-focus-ring"
        >
          <RiRefreshLine className="size-3.5" /> Surprise me
        </button>
      </div>
    </div>
  );
}
