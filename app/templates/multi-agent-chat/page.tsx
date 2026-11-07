"use client";

import {
  RiAddLine,
  RiArrowDownSLine,
  RiArrowUpLine,
  RiAttachmentLine,
  RiCheckLine,
  RiCloseLine,
  RiCodeLine,
  RiFileCopyLine,
  RiFileTextLine,
  RiDownloadLine,
  RiEarthLine,
  RiHeadphoneLine,
  RiLayoutGridLine,
  RiListCheck,
  RiMenuLine,
  RiMicLine,
  RiMoreLine,
  RiNotification3Line,
  RiPlayFill,
  RiSearchLine,
  RiSettings3Line,
  RiShieldLine,
  RiShoppingBag3Line,
  RiSlideshowLine,
  RiStopFill,
  RiTableLine,
  RiTargetLine,
  RiThumbDownLine,
  RiThumbUpLine,
  RiVolumeUpLine,
} from "@remixicon/react";
import { useEffect, useId, useRef, useState } from "react";

import {
  Dropdown,
  DropdownDivider,
  DropdownGroup,
  DropdownItem,
  DropdownPopover,
  DropdownTrigger,
} from "@/components/base/dropdown/dropdown";
import { MENU_POPOVER_SURFACE } from "@/components/base/dropdown/menu-styles";
import { useDismissOnOutsidePress } from "@/utils/use-dismiss-on-outside-press";
import { SettingsModal, type SettingsPage } from "@/components/application/settings/settings-modal";

import { Switch } from "@/components/base/switch/switch";
import { DocumentTitle } from "@/components/application/app-shell/document-title";
import { cx } from "@/utils/cx";

/**
 * Multi-Agent Chat template — 1:1 replica of boardui.com/templates/multi-agent-chat.
 * Structure, classes, copy and tokens are taken from the public template page's
 * server-rendered HTML and BoardUI's public CSS (design tokens). Built only
 * from free BoardUI components + hand-drawn SVG avatars. Not the official
 * Pro source: the canvas avatar animation is rebuilt as SVG/CSS (see the
 * Avatar data block below), and the editor is a local panel.
 */

/* ------------------------------------------------------------------ */
/* Avatar data — from investigation-report.md section 3 (public       */
/* snapshot + official docs). The original draws its "paper face" on  */
/* canvas; here it is rebuilt in SVG/CSS, behaviour-aligned, not      */
/* pixel 1:1. The 16 expression names, 9 shape names and 9 radial     */
/* gradients are verbatim from the original; each expression's actual  */
/* eyes/mouth, each shape's path and the fold layer are our own        */
/* interpretation — the snapshot carries no pixel or vector data for   */
/* them. The per-agent colour/shape assignment below is also our own   */
/* choice: the original's per-agent defaults cannot be recovered.      */
/* ------------------------------------------------------------------ */

type AvatarShape =
  | "star" | "heart" | "cloud" | "diamond" | "shield"
  | "slender" | "pocket" | "petal" | "flower";

type AvatarExpression =
  | "Neutral" | "Happy" | "Angry" | "Thinking" | "Shook" | "Curious"
  | "Wink" | "Sleepy" | "Sad" | "Worried" | "Skeptical" | "Focused"
  | "Excited" | "Calm" | "Shy" | "Confused";

/** The original's 9 named colours (radial-gradient, closest-side circle
    at 50% 50%, plus a white highlight layer). `from` is the gradient
    start; Agent.body stores the `from` value so the gradient can be
    resolved back from it. */
const AVATAR_COLORS = [
  { id: "blue", label: "Blue", from: "#437EF7", to: "#004DE9" },
  { id: "teal", label: "Teal", from: "#27b5a2", to: "#00957c" },
  { id: "violet", label: "Violet", from: "#8554F6", to: "#3E00CD" },
  { id: "pink", label: "Pink", from: "#E34798", to: "#D3006D" },
  { id: "red", label: "Red", from: "#E74241", to: "#CF0100" },
  { id: "orange", label: "Orange", from: "#f47327", to: "#d83f00" },
  { id: "cyan", label: "Cyan", from: "#1bb4ce", to: "#0093ad" },
  { id: "lime", label: "Lime", from: "#88c81c", to: "#6aa400" },
  { id: "green", label: "Green", from: "#36c15c", to: "#009f13" },
] as const;

const AVATAR_SHAPES: AvatarShape[] = [
  "star", "heart", "cloud", "diamond", "shield",
  "slender", "pocket", "petal", "flower",
];

/** Face silhouettes on a 0 0 40 40 viewBox. Shield/star/diamond are the
    pre-existing replica paths; heart/cloud/slender/pocket/petal/flower
    are drawn to the original's shape names (no vector data survives). */
const SHAPE_PATHS: Record<AvatarShape, string> = {
  star: "M20 2.5c1.6 6.8 4.2 9.4 5.4 10.6 1.2 1.2 3.8 3.8 10.6 5.4-6.8 1.6-9.4 4.2-10.6 5.4-1.2 1.2-3.8 3.8-5.4 10.6-1.6-6.8-4.2-9.4-5.4-10.6-1.2-1.2-3.8-3.8-10.6-5.4 6.8-1.6 9.4-4.2 10.6-5.4 1.2-1.2 3.8-3.8 5.4-10.6Z",
  heart: "M20 36.5C10 29 3.5 22 3.5 14.5 3.5 9.5 7.5 6 12 6c3.2 0 6 1.8 8 4.5C22 7.8 24.8 6 28 6c4.5 0 8.5 3.5 8.5 8.5 0 7.5-6.5 14.5-16.5 22Z",
  cloud: "M13.5 34.5c-4.5 0-8-3.2-8-7.4 0-3.6 2.5-6.6 6-7.3.9-4.6 5-8.3 10-8.3 4.4 0 8.1 2.8 9.4 6.8 3.6.7 6.1 3.7 6.1 7.3 0 4.2-3.6 7.4-8.5 7.4H13.5Z",
  diamond: "M20 3.5c1.8 0 3.3 1 4.2 2.5l7.3 11.2c1.5 2.3 1.5 5.3 0 7.6L24.2 36c-.9 1.5-2.4 2.5-4.2 2.5s-3.3-1-4.2-2.5l-7.3-11.2c-1.5-2.3-1.5-5.3 0-7.6L15.8 6c.9-1.5 2.4-2.5 4.2-2.5Z",
  shield: "M20 2.5c8.5 0 15 6 15 14.5 0 9.5-6.5 18-15 20.5C11.5 35 5 26.5 5 17 5 8.5 11.5 2.5 20 2.5Z",
  slender: "M20 2c5.5 0 8.5 6 8.5 18S25.5 38 20 38 11.5 32 11.5 20 14.5 2 20 2Z",
  pocket: "M8 4h24v21c0 4.5-3.5 8-7.5 10.5L20 38l-4.5-2.5C11.5 33 8 29.5 8 25V4Z",
  petal: "M20 2.5C28 10 32.5 17.5 32.5 24.5a12.5 12.5 0 1 1-25 0C7.5 17.5 12 10 20 2.5Z",
  flower: "M20 6.5A6.8 6.8 0 0 1 31.7 13.25 6.8 6.8 0 0 1 31.7 26.75 6.8 6.8 0 0 1 20 33.5 6.8 6.8 0 0 1 8.3 26.75 6.8 6.8 0 0 1 8.3 13.25 6.8 6.8 0 0 1 20 6.5Z",
};

type EyeStyle = "open" | "wide" | "narrow" | "half" | "closed" | "arc" | "side";

type ExpressionSpec = {
  leftEye: EyeStyle;
  rightEye: EyeStyle;
  /** Stroke path, or a filled path when mouthFill is set. */
  mouth: string;
  mouthFill?: boolean;
  brows?: string;
  blush?: boolean;
  strongBlush?: boolean;
  lookX?: number;
  lookY?: number;
};

/** Our reading of the original's 16 expressions, in the original's ring
    order (investigation-report.md section 3.2). Only the names are
    evidence; every eye/mouth/brow below is drawn from the name. */
const EXPRESSIONS: Record<AvatarExpression, ExpressionSpec> = {
  Neutral: { leftEye: "open", rightEye: "open", mouth: "M16 26h8" },
  Happy: { leftEye: "arc", rightEye: "arc", mouth: "M14.5 24Q20 29.5 25.5 24", blush: true },
  Angry: { leftEye: "open", rightEye: "open", mouth: "M15.5 27.5Q20 24.5 24.5 27.5", brows: "M11 13.5L17 15.8M29 13.5L23 15.8" },
  Thinking: { leftEye: "side", rightEye: "side", mouth: "M17.5 26.5h5", brows: "M11.5 13.5Q14 12 16.5 13.5", lookX: 2 },
  Shook: { leftEye: "wide", rightEye: "wide", mouth: "M17.8 26.5a2.2 2.8 0 1 0 4.4 0 2.2 2.8 0 1 0-4.4 0Z", mouthFill: true, brows: "M11.5 13Q14 11 16.5 12.5M23.5 12.5Q26 11 28.5 13" },
  Curious: { leftEye: "wide", rightEye: "open", mouth: "M18.4 26a1.6 2 0 1 0 3.2 0 1.6 2 0 1 0-3.2 0Z", mouthFill: true, brows: "M11.5 12.5Q14 11 16.5 12.5" },
  Wink: { leftEye: "closed", rightEye: "open", mouth: "M15.5 25Q20 28.5 24.5 25", blush: true },
  Sleepy: { leftEye: "half", rightEye: "half", mouth: "M17 26.5h6" },
  Sad: { leftEye: "open", rightEye: "open", mouth: "M15.5 27Q20 24 24.5 27", brows: "M11 14.5Q14 12.5 17 14M23 14Q26 12.5 29 14.5" },
  Worried: { leftEye: "open", rightEye: "open", mouth: "M15.5 26Q17.8 27.6 20 26Q22.2 24.4 24.5 26", brows: "M11 13.5Q14 11.5 16.8 13M23.2 13Q26 11.5 29 13.5" },
  Skeptical: { leftEye: "side", rightEye: "open", mouth: "M16 26.5L24 25.5", brows: "M11.5 12.5Q14 11 16.5 12.5M23.5 14.5h5", lookX: 2 },
  Focused: { leftEye: "narrow", rightEye: "narrow", mouth: "M16.5 26h7", brows: "M11.5 14h5M23.5 14h5" },
  Excited: { leftEye: "wide", rightEye: "wide", mouth: "M14 24Q20 32 26 24Q20 27.5 14 24Z", mouthFill: true, brows: "M11.5 12.5Q14 11 16.5 12.5M23.5 12.5Q26 11 28.5 12.5", blush: true },
  Calm: { leftEye: "arc", rightEye: "arc", mouth: "M16.5 25.5Q20 28 23.5 25.5" },
  Shy: { leftEye: "open", rightEye: "open", mouth: "M16.5 25.5Q20 27.5 23.5 25.5", blush: true, strongBlush: true, lookY: 1 },
  Confused: { leftEye: "side", rightEye: "open", mouth: "M15.5 26Q17.8 27.4 20 26Q22.2 24.6 24.5 26", brows: "M11.5 12.5Q14 11 16.5 12.5M23.5 15.5Q26 14 28.5 15", lookX: -2 },
};

const EXPRESSION_ORDER: AvatarExpression[] = [
  "Neutral", "Happy", "Angry", "Thinking", "Shook", "Curious",
  "Wink", "Sleepy", "Sad", "Worried", "Skeptical", "Focused",
  "Excited", "Calm", "Shy", "Confused",
];

type Agent = {
  id: string;
  name: string;
  label: string;
  desc: string;
  /** Sidebar list intro, verbatim from the original's server-rendered HTML
      (for landing/marketing it matches replyP1; for the other five it does
      not — the replica used to show replyP1 here, which was wrong). */
  intro: string;
  body: string;
  /** Gradient key: stores the `from` value of one of AVATAR_COLORS. */
  shape: AvatarShape;
  /** Default "Neutral". Our reading of the original's 16 expressions. */
  expression?: AvatarExpression;
  userMsg: string;
  replyP1: string;
  replyP2: string;
};

const AGENTS: Agent[] = [
  {
    id: "landing",
    name: "landing page designer",
    label: "Design",
    desc: "Give the hero one clear action. Lead with the outcome, pair it with a focused product preview, and move the secondary links below the fold.",
    intro: "Give the hero one clear action. Lead with the outcome, pair it with a focused product preview, and move the secondary links below the fold.",
    body: "#36c15c",
    shape: "shield",
    userMsg: "How can we make the landing page feel clearer?",
    replyP1:
      "Give the hero one clear action. Lead with the outcome, pair it with a focused product preview, and move the secondary links below the fold.",
    replyP2:
      "For the next section, show three concrete benefits with short examples. That creates a natural path from understanding the product to trying it.",
  },
  {
    id: "reviewer",
    name: "content reviewer",
    label: "Review",
    desc: "The shorter opening feels more welcoming. Start with a quick thank-you, explain the first useful step, and keep the main button close to that instruction.",
    intro: "The shorter opening feels more welcoming. Start with a quick thank-you, explain the first useful step, and keep the main button close to that instruction.",
    body: "#437EF7",
    shape: "heart",
    userMsg: "Can we make this welcome message sound warmer?",
    replyP1:
      "The shorter opening feels more welcoming. Start with a quick thank-you, explain the first useful step, and keep the rest of the copy short. That will save the reader a step or two.",
    replyP2:
      "Add one line about who to contact if something is unclear. It gives new users a clear place to start.",
  },
  {
    id: "marketing",
    name: "marketing bot",
    label: "Marketing",
    desc: "Lead with the problem your audience recognizes. Build the campaign around one before-and-after story, then adapt it for email, social, and the launch page.",
    intro: "Lead with the problem your audience recognizes. Build the campaign around one before-and-after story, then adapt it for email, social, and the launch page.",
    body: "#E34798",
    shape: "star",
    userMsg: "What should our launch campaign focus on?",
    replyP1:
      "Lead with the problem your audience recognizes. Build the campaign around one before-and-after story, then adapt it for email, social, and the launch page.",
    replyP2:
      "Try two opening lines with a small audience first. Use the response to choose a direction before expanding the campaign.",
  },
  {
    id: "seo",
    name: "seo bot",
    label: "SEO",
    desc: "Start with a practical guide to the core topic. Support it with focused articles that answer the next questions readers are likely to ask.",
    intro: "Start with a practical guide to the core topic. Support it with focused articles that answer the next questions readers are likely to ask.",
    body: "#f47327",
    shape: "diamond",
    userMsg: "How should we improve our main article?",
    replyP1:
      "Start with a practical guide to the core topic. Support it with focused articles that answer the next question each reader is likely to have, and connect them clearly.",
    replyP2:
      "Keep titles direct and useful. That makes it easier to see how each page helps the reader.",
  },
  {
    id: "research",
    name: "research assistant",
    label: "Research",
    desc: "Ask about the last time the problem happened. Have customers walk through what they tried, where they got stuck, and what a good result would have looked like.",
    intro: "Ask about the last time the problem happened. Have customers walk through what they tried, where they got stuck, and what a good result would have looked like.",
    body: "#27b5a2",
    shape: "cloud",
    userMsg: "How should we run discovery interviews?",
    replyP1:
      "Ask about the last time the problem happened. Have customers walk through what they tried, where they got stuck, and what mattered most in that moment.",
    replyP2:
      "Keep notes simple and compare them across interviews. Patterns will appear more quickly than single stories.",
  },
  {
    id: "security",
    name: "Security agent",
    label: "Security",
    desc: "A careful second pair of eyes for permissions, privacy, and application security.",
    intro: "Review access permissions before inviting testers. Confirm that every request checks the current user’s access and that one account cannot read another account’s data.",
    // Original: Teal (the editor snapshot has Teal aria-pressed="true" for
    // Security agent). The replica used to assign Violet here — wrong.
    body: "#27b5a2",
    shape: "shield",
    userMsg: "How do we prepare for tester onboarding?",
    replyP1:
      "Review access permissions before inviting testers. Confirm that every request checks the current user and remove any access that is wider than necessary.",
    replyP2:
      "Set a plan for revoking access quickly. Then test that flow with one internal account before inviting anyone.",
  },
  {
    id: "cloud",
    name: "Cloud engineer",
    label: "Engineering",
    desc: "Give staging its own environment and data. Match the production configuration closely, while keeping credentials, storage, and deployment permissions separate.",
    intro: "Give staging its own environment and data. Match the production configuration closely, while keeping credentials, storage, and deployment permissions separate.",
    body: "#1bb4ce",
    shape: "slender",
    userMsg: "How should we approach our staging deployment?",
    replyP1:
      "Give staging its own environment and data. Match the production configuration closely, while keeping secrets and permissions separate.",
    replyP2:
      "Add a health check and a simple rollback path before automating releases. Then use a small deployment to confirm connectivity.",
  },
];

const GROUP = {
  id: "group",
  name: "Design + Marketing + Product",
  desc: "Start a conversation",
};

/* ------------------------------------------------------------------ */
/* Marketplace roster — REMOVED 2026-11-07: the previous list of six agents
   (data analyst, social media manager, copywriter, support agent, product
   manager, ux researcher) was invented by the replica; the original's
   Marketplace panel content is not in the server-rendered snapshot
   (client-side bailout), so it cannot be restored from the snapshot and the
   fabricated roster was deleted rather than kept. The Marketplace button
   still opens the panel, which now says so instead of listing fake agents. */

/* Follow-up replies — one voice per agent. The seeded first exchange */
/* is verbatim from the original page; later user messages get one of */
/* these, cycling, instead of a single generic demo line.             */
/* ------------------------------------------------------------------ */

const FOLLOW_UPS: Record<string, string[]> = {
  landing: [
    "That reads clearer already. One more pass: cut the second sentence of the hero — the outcome should land in the first line, and the product preview can carry the rest.",
    "Try moving the main action above the fold and giving it a single verb. If visitors hesitate, the choice is the problem, not the copy.",
  ],
  reviewer: [
    "Warmer, yes — and shorter helps too. Keep the thank-you to one line, then put the first useful step right next to the button.",
    "One small tweak: name a person to contact instead of a team inbox. A name makes the message feel written for someone.",
  ],
  marketing: [
    "That angle is working — the before-and-after story is the one people repeat. Run it as the email subject first; if it opens well, it will carry the launch page too.",
    "Before you scale it, test the second opening line on a small slice. The winner usually isn't the cleverer line, it's the more specific one.",
  ],
  seo: [
    "Good instinct — answer the next question before they ask it. Link the practical guide to two focused follow-ups and the cluster starts to rank as a set.",
    "Keep the title plain and searchable. Clever titles get shared; direct titles get found, and found is what compounds.",
  ],
  research: [
    "Exactly — ask about the last time it happened, not what they want. What people tried tells you more than what they say they need.",
    "Compare notes across three interviews before you conclude anything. One story is an anecdote; three is a pattern worth designing for.",
  ],
  security: [
    "Right — check the permission before the invitation goes out. Narrow access now is cheaper than revoking it under pressure later.",
    "Test the revoke flow with one internal account first. If revoking takes more than a minute, the plan needs work before any tester is invited.",
  ],
  cloud: [
    "Staging should match production closely — same config, separate data and credentials. The moment staging drifts, it stops catching real bugs.",
    "Add the health check before you automate anything. A deploy you can't roll back is a deploy you don't fully own yet.",
  ],
};

/** Fallback for agents added from the Marketplace, which have no dedicated follow-ups. */
function genericFollowUp(agent: Agent): string {
  return `As your ${agent.label.toLowerCase()}, my take: start from the outcome you want, then work backwards to the smallest step that proves it.\nTell me a little more about the situation and I will turn it into a concrete next step.`;
}

/* ------------------------------------------------------------------ */
/* Avatar — SVG/CSS rebuild of the original canvas "paper face".      */
/* Behaviour-aligned, not pixel 1:1 (see the Avatar data block above): */
/* 9 shapes + 9 radial gradients + white highlight, a translucent     */
/* fold band standing in for the canvas fold layer, two eyes that     */
/* wander and blink independently, 16 expressions from a data table,  */
/* a short scale/fade on shape change standing in for the morph, and  */
/* click-to-turn (rotateY) on the editor preview. Reduced motion      */
/* stops every avatar animation (see the page-level <style>).          */
/* ------------------------------------------------------------------ */

function AvatarEye({
  cx,
  style,
  lookX,
  lookY,
  blinkClass,
  wanderClass,
  blinkDelay,
}: {
  cx: number;
  style: EyeStyle;
  lookX: number;
  lookY: number;
  blinkClass: string | null;
  wanderClass: string | null;
  blinkDelay: string;
}) {
  const cy = 17.5 + lookY;
  const x = cx + (style === "side" ? lookX : 0);
  if (style === "closed") {
    return (
      <path
        d={`M${cx - 2.2} 17.5h4.4`}
        stroke="#262626"
        strokeWidth="1.8"
        fill="none"
        strokeLinecap="round"
      />
    );
  }
  if (style === "arc") {
    return (
      <path
        d={`M${cx - 2.4} 18.2Q${cx} 14.8 ${cx + 2.4} 18.2`}
        stroke="#262626"
        strokeWidth="1.8"
        fill="none"
        strokeLinecap="round"
      />
    );
  }
  const ry = style === "wide" ? 4.1 : style === "narrow" ? 2.2 : style === "half" ? 2.1 : 3.3;
  const rx = style === "wide" ? 2.9 : 2.3;
  const eye = (
    <g>
      <ellipse cx={x} cy={cy} rx={rx} ry={ry} fill="#262626" />
      <circle cx={x + 0.9} cy={cy - 1.2} r="0.8" fill="#fff" />
      {style === "half" && (
        <path
          d={`M${x - 2.4} ${cy - 1.6}h4.8`}
          stroke="#262626"
          strokeWidth="1.4"
          strokeLinecap="round"
        />
      )}
    </g>
  );
  const wandered = wanderClass ? <g className={wanderClass}>{eye}</g> : eye;
  return blinkClass ? (
    <g className={blinkClass} style={{ animationDelay: blinkDelay }}>
      {wandered}
    </g>
  ) : (
    wandered
  );
}

function AgentAvatar({
  agent,
  size = 40,
  blinkDelay = "0s",
  className,
}: {
  agent: Pick<Agent, "body" | "shape" | "name"> & { expression?: AvatarExpression };
  size?: number;
  blinkDelay?: string;
  className?: string;
}) {
  const rawId = useId().replace(/:/g, "");
  const expr = EXPRESSIONS[agent.expression ?? "Neutral"] ?? EXPRESSIONS.Neutral;
  const color = AVATAR_COLORS.find((c) => c.from.toLowerCase() === agent.body.toLowerCase());
  const gid = `bui-grad-${rawId}`;
  const cid = `bui-clip-${rawId}`;
  const d = SHAPE_PATHS[agent.shape];
  const rightDelay = blinkDelay === "0s" ? "1.3s" : `calc(${blinkDelay} + 1.3s)`;
  const openEye = (s: EyeStyle) => s !== "closed" && s !== "arc";
  const svg = (
    <svg
      viewBox="0 0 40 40"
      width={size}
      height={size}
      aria-hidden="true"
      className="block"
    >
      <defs>
        {color && (
          <radialGradient id={gid} cx="50%" cy="42%" r="68%">
            <stop offset="0%" stopColor={color.from} />
            <stop offset="100%" stopColor={color.to} />
          </radialGradient>
        )}
        <clipPath id={cid}>
          <path d={d} />
        </clipPath>
      </defs>
      {/* Shape morph: keyed remount replays a short scale/fade so a shape
          change reads as a morph, not a hard cut. The intermediate frames
          are our own easing, not the original canvas morph. */}
      <g key={agent.shape} className="bui-morph">
        <path d={d} fill={color ? `url(#${gid})` : agent.body} />
        <g clipPath={`url(#${cid})`}>
          <ellipse cx="13" cy="10" rx="9" ry="5.5" fill="#fff" opacity="0.38" transform="rotate(-18 13 10)" />
          {/* Fold-layer stand-in: a translucent dark band + a pale fold edge. */}
          <path d="M4 31Q20 37 36 30L36 40 4 40Z" fill="#000" opacity="0.08" />
          <path d="M4 31Q20 37 36 30" fill="none" stroke="#fff" strokeWidth="0.7" opacity="0.28" />
        </g>
      </g>
      <AvatarEye
        cx={14}
        style={expr.leftEye}
        lookX={expr.lookX ?? 0}
        lookY={expr.lookY ?? 0}
        blinkClass={openEye(expr.leftEye) ? "bui-blink-l" : null}
        wanderClass={openEye(expr.leftEye) ? "bui-wander-l" : null}
        blinkDelay={blinkDelay}
      />
      <AvatarEye
        cx={26}
        style={expr.rightEye}
        lookX={expr.lookX ?? 0}
        lookY={expr.lookY ?? 0}
        blinkClass={openEye(expr.rightEye) ? "bui-blink-r" : null}
        wanderClass={openEye(expr.rightEye) ? "bui-wander-r" : null}
        blinkDelay={rightDelay}
      />
      {expr.brows && (
        <path d={expr.brows} stroke="#262626" strokeWidth="1.5" fill="none" strokeLinecap="round" />
      )}
      {expr.mouthFill ? (
        <path d={expr.mouth} fill="#262626" />
      ) : (
        <path d={expr.mouth} stroke="#262626" strokeWidth="1.8" fill="none" strokeLinecap="round" />
      )}
      {expr.blush && (
        <>
          <ellipse cx="10.5" cy="22.5" rx={expr.strongBlush ? 2.6 : 2} ry="1.2" fill="#f2a0a0" opacity={expr.strongBlush ? 0.85 : 0.55} />
          <ellipse cx="29.5" cy="22.5" rx={expr.strongBlush ? 2.6 : 2} ry="1.2" fill="#f2a0a0" opacity={expr.strongBlush ? 0.85 : 0.55} />
        </>
      )}
    </svg>
  );
  const label = `${agent.name}, ${agent.expression ?? "Neutral"}`;
  return (
    <span
      className={cx("relative block shrink-0", className)}
      style={{ width: size, height: size }}
      role="img"
      aria-label={label}
    >
      {svg}
    </span>
  );
}

/* MiniFace — a standalone expression face for the editor's emotion ring.
   The snapshot's ring dots each carry a blank 34px canvas (the live
   original draws the face on it), so the face itself is drawn here from
   the same EXPRESSIONS table the avatars use: eyes, brows, mouth and
   blush per emotion, on the dot's own background. */
function MiniFace({ expression, size = 28 }: { expression: AvatarExpression; size?: number }) {
  const expr = EXPRESSIONS[expression];
  const lookX = expr.lookX ?? 0;
  const lookY = expr.lookY ?? 0;
  return (
    <svg viewBox="0 0 40 40" width={size} height={size} aria-hidden="true" className="block shrink-0">
      <AvatarEye cx={14} style={expr.leftEye} lookX={lookX} lookY={lookY} blinkClass={null} wanderClass={null} blinkDelay="0s" />
      <AvatarEye cx={26} style={expr.rightEye} lookX={lookX} lookY={lookY} blinkClass={null} wanderClass={null} blinkDelay="0s" />
      {expr.brows && (
        <path d={expr.brows} stroke="#262626" strokeWidth="1.5" fill="none" strokeLinecap="round" />
      )}
      {expr.mouthFill ? (
        <path d={expr.mouth} fill="#262626" />
      ) : (
        <path d={expr.mouth} stroke="#262626" strokeWidth="1.8" fill="none" strokeLinecap="round" />
      )}
      {expr.blush && (
        <>
          <ellipse cx="10.5" cy="22.5" rx={expr.strongBlush ? 2.6 : 2} ry="1.2" fill="#f2a0a0" opacity={expr.strongBlush ? 0.85 : 0.55} />
          <ellipse cx="29.5" cy="22.5" rx={expr.strongBlush ? 2.6 : 2} ry="1.2" fill="#f2a0a0" opacity={expr.strongBlush ? 0.85 : 0.55} />
        </>
      )}
    </svg>
  );
}

/* ------------------------------------------------------------------ */
/* Sidebar                                                             */
/* ------------------------------------------------------------------ */

const pillBtn =
  "inline-flex h-9 w-full min-w-0 items-center justify-center gap-0.5 whitespace-nowrap rounded-full border-0 bg-background-tertiary-default p-2 text-body-medium text-foreground-icon-secondary shadow-none outline-none transition-colors duration-150 ease hover:bg-background-tertiary-hover focus-visible:ring-2 focus-visible:ring-border-focus-ring";

function Sidebar({
  selectedId,
  onSelect,
  searchOpen,
  setSearchOpen,
  agents,
  onOpenMarketplace,
  onOpenSettings,
  onCreateAgent,
  onNewChat,
  onNewGroup,
  forceVisible = false,
}: {
  selectedId: string;
  onSelect: (id: string) => void;
  searchOpen: boolean;
  setSearchOpen: (v: boolean) => void;
  agents: Agent[];
  onOpenMarketplace: () => void;
  onOpenSettings: () => void;
  onCreateAgent: () => void;
  onNewChat: () => void;
  onNewGroup: () => void;
  /** Rendered inside the mobile drawer: drop the `hidden md:block` shell. */
  forceVisible?: boolean;
}) {
  const [query, setQuery] = useState("");
  const q = query.trim().toLowerCase();
  const showGroup =
    !q || GROUP.name.toLowerCase().includes(q) || GROUP.desc.toLowerCase().includes(q);
  const visibleAgents = q
    ? agents.filter((a) =>
        [a.name, a.label, a.intro, a.desc].some((t) => t.toLowerCase().includes(q)),
      )
    : agents;
  return (
    <div className={cx("me-4 min-h-0 shrink-0", forceVisible ? "block" : "hidden md:block")}>
      <aside
        aria-label="Conversations"
        className="flex h-full min-h-0 w-[260px] shrink-0 flex-col rounded-3xl border border-border-button-white bg-background-secondary-default p-[7px] shadow-sidebar"
      >
        {/* Top row: search (expandable) / Marketplace / Create */}
        <div className="relative h-9 shrink-0">
          <div className="grid h-full grid-cols-3 gap-2">
            <div aria-hidden="true" />
            <div>
              <button type="button" className={pillBtn} aria-label="Marketplace" title="Marketplace" onClick={onOpenMarketplace}>
                <RiShoppingBag3Line className="size-5 shrink-0" aria-hidden />
              </button>
            </div>
            <div className="flex">
              {/* Create bot or chat — the original opens a menu here (its items
                  are not in the server-rendered snapshot, so the labels below
                  are the expected New agent / New chat / New group set,
                  pending live verification — NOT the Marketplace). */}
              <Dropdown>
                <DropdownTrigger
                  aria-label="Create bot or chat"
                  className="flex w-full min-w-0 cursor-pointer items-center justify-center rounded-full bg-button-primary text-text-white outline-none focus-visible:ring-2 focus-visible:ring-border-focus-ring"
                >
                  <RiAddLine className="size-5" aria-hidden />
                </DropdownTrigger>
                <DropdownPopover aria-label="Create bot or chat" placement="bottom end" className="w-[190px] p-2">
                  <DropdownGroup>
                    <DropdownItem onSelect={onCreateAgent} className="px-2 py-1.5">
                      <span className="truncate text-body-medium whitespace-nowrap text-text-primary">New agent</span>
                    </DropdownItem>
                    <DropdownItem onSelect={onNewChat} className="px-2 py-1.5">
                      <span className="truncate text-body-medium whitespace-nowrap text-text-primary">New chat</span>
                    </DropdownItem>
                    <DropdownItem onSelect={onNewGroup} className="px-2 py-1.5">
                      <span className="truncate text-body-medium whitespace-nowrap text-text-primary">New group</span>
                    </DropdownItem>
                  </DropdownGroup>
                </DropdownPopover>
              </Dropdown>
            </div>
          </div>
          <div
            className="absolute inset-y-0 start-0 z-10 overflow-hidden rounded-full bg-background-tertiary-default transition-[width] duration-300 ease-in-out"
            style={{ width: searchOpen ? "100%" : "calc((100% - 16px) / 3)" }}
          >
            {searchOpen ? (
              <div className="flex h-9 w-full items-center gap-2 rounded-full ps-3 pe-2">
                <RiSearchLine className="size-5 shrink-0 text-foreground-icon-tertiary" aria-hidden />
                <input
                  autoFocus
                  type="text"
                  placeholder="Search conversations…"
                  aria-label="Search conversations"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Escape") {
                      setQuery("");
                      setSearchOpen(false);
                    }
                  }}
                  className="min-w-0 flex-1 bg-transparent text-body-regular text-text-primary outline-none placeholder:text-text-tertiary"
                />
                <button
                  type="button"
                  aria-label="Close search"
                  title="Close search"
                  onClick={() => {
                    setQuery("");
                    setSearchOpen(false);
                  }}
                  className="flex size-6 shrink-0 cursor-pointer items-center justify-center rounded-full text-foreground-icon-secondary outline-none hover:bg-background-tertiary-hover focus-visible:ring-2 focus-visible:ring-border-focus-ring"
                >
                  <RiCloseLine className="size-4" aria-hidden />
                </button>
              </div>
            ) : (
              <button
                type="button"
                className="absolute inset-0 flex w-full min-w-0 cursor-pointer items-center justify-center rounded-full border-0 bg-background-tertiary-default text-foreground-icon-secondary shadow-none transition-opacity duration-150 outline-none hover:bg-background-tertiary-hover focus-visible:ring-2 focus-visible:ring-border-focus-ring"
                aria-label="Search conversations"
                title="Search conversations"
                onClick={() => setSearchOpen(true)}
              >
                <RiSearchLine className="size-5 shrink-0" aria-hidden />
              </button>
            )}
          </div>
        </div>

        {/* Chat list */}
        <div className="mt-2 flex min-h-0 flex-1 flex-col">
          <div
            tabIndex={0}
            className="flex h-full flex-col gap-2 overflow-y-auto overscroll-contain outline-none [scrollbar-width:none] focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-border-focus-ring"
          >
            {/* Group chat (first item) */}
            {showGroup && (
            <button
              type="button"
              onClick={() => onSelect(GROUP.id)}
              aria-current={selectedId === GROUP.id ? "page" : undefined}
              className={cx(
                "flex min-h-[54px] shrink-0 items-center gap-2.5 rounded-xl p-1.5 text-start outline-none transition-colors focus-visible:ring-2 focus-visible:ring-border-focus-ring",
                selectedId === GROUP.id
                  ? "bg-background-tertiary-default"
                  : "hover:bg-background-secondary-hover",
              )}
            >
              <span className="flex shrink-0 items-center">
                <AgentAvatar
                  agent={{ body: "#36c15c", shape: "shield", name: "landing page designer" }}
                  size={22}
                />
                <AgentAvatar
                  agent={{ body: "#E34798", shape: "star", name: "marketing bot" }}
                  size={22}
                  className="-ms-2"
                />
                <AgentAvatar
                  agent={{ body: "#1bb4ce", shape: "diamond", name: "Product planner" }}
                  size={22}
                  className="-ms-2"
                />
              </span>
              <span className="flex min-w-0 flex-1 flex-col gap-0.5">
                <span title={GROUP.name} className="line-clamp-2 break-words text-body-medium text-text-primary">{GROUP.name}</span>
                <span className="truncate text-body-regular text-text-tertiary">{GROUP.desc}</span>
              </span>
            </button>
            )}
            {visibleAgents.map((agent, i) => {
              const active = agent.id === selectedId;
              return (
                <button
                  key={agent.id}
                  type="button"
                  onClick={() => onSelect(agent.id)}
                  aria-current={active ? "page" : undefined}
                  className={cx(
                    "flex min-h-[54px] shrink-0 items-center gap-2.5 rounded-xl p-1.5 text-start outline-none transition-colors focus-visible:ring-2 focus-visible:ring-border-focus-ring",
                    active ? "bg-background-tertiary-default" : "hover:bg-background-secondary-hover",
                  )}
                >
                  <AgentAvatar agent={agent} size={40} blinkDelay={`${(i % 5) * 0.7}s`} />
                  <span className="flex min-w-0 flex-1 flex-col gap-0.5">
                    <span className="truncate text-body-medium text-text-primary">{agent.name}</span>
                    <span title={agent.intro} className="line-clamp-2 break-words text-body-regular text-text-tertiary">{agent.intro}</span>
                  </span>
                </button>
              );
            })}
            {visibleAgents.length === 0 && (
              <p className="px-2 py-3 text-body-regular text-text-tertiary">
                No conversations match “{query.trim()}”.
              </p>
            )}
          </div>
        </div>

        {/* Footer: All templates / Support / Settings / Board team */}
        <footer className="mt-2 flex shrink-0 flex-col gap-1">
          <Dropdown>
            <DropdownTrigger
              aria-label="Support"
              className="inline-flex h-9 w-full cursor-pointer items-center justify-start gap-0.5 rounded-2lg bg-transparent p-2 text-body-medium text-text-secondary outline-none transition-colors hover:bg-background-secondary-hover active:bg-background-secondary-hover focus-visible:ring-2 focus-visible:ring-border-focus-ring"
            >
              <RiHeadphoneLine className="size-5 shrink-0" aria-hidden />
              <span className="inline-flex items-center justify-center px-1 shrink-0">Support</span>
            </DropdownTrigger>
            <DropdownPopover aria-label="Support" placement="top start" className="w-[220px] p-2">
              <DropdownGroup>
                <DropdownItem
                  onSelect={() => {
                    window.location.href = "mailto:hi@boardui.com";
                  }}
                  className="px-2 py-1.5"
                >
                  <span className="truncate text-body-medium whitespace-nowrap text-text-primary">Email support</span>
                </DropdownItem>
                <DropdownItem
                  onSelect={() => {
                    window.location.href = "mailto:hi@boardui.com";
                  }}
                  className="px-2 py-1.5"
                >
                  <span className="truncate text-body-medium whitespace-nowrap text-text-primary">Email support</span>
                </DropdownItem>
              </DropdownGroup>
            </DropdownPopover>
          </Dropdown>
          <button
            type="button"
            onClick={onOpenSettings}
            className="inline-flex h-9 w-full cursor-pointer items-center justify-start gap-0.5 rounded-2lg bg-transparent p-2 text-body-medium text-text-secondary outline-none transition-colors hover:bg-background-secondary-hover active:bg-background-secondary-hover focus-visible:ring-2 focus-visible:ring-border-focus-ring"
          >
            <RiSettings3Line className="size-5 shrink-0" aria-hidden />
            <span className="inline-flex items-center justify-center px-1 shrink-0">Settings</span>
          </button>
          <div className="mt-2">
            <Dropdown>
              <DropdownTrigger
                aria-label="Board team"
                className="flex w-full cursor-pointer items-center justify-between overflow-hidden rounded-xl border-2 border-transparent bg-background-tertiary-default py-2 pe-4 ps-2.5 outline-none transition-[background-color,border-color] duration-300 ease-in-out hover:border-border-button-hover focus-visible:ring-2 focus-visible:ring-border-focus-ring focus-visible:ring-offset-2"
              >
                <span className="flex min-w-0 items-center gap-2">
                  <span className="inline-flex size-8 shrink-0 select-none items-center justify-center overflow-hidden rounded-full bg-blue-300 text-blue-900">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src="/brand/boardui_logo_circle.webp" alt="Board team" loading="lazy" decoding="async" className="size-full object-cover" />
                  </span>
                  <span className="flex min-w-0 flex-col items-start justify-center">
                    <span className="whitespace-nowrap text-body-medium text-text-primary">Board team</span>
                    <span className="whitespace-nowrap text-body-regular text-text-secondary">hi@boardui.com</span>
                  </span>
                </span>
                <span className="flex size-4 shrink-0 items-center justify-center rounded-[3px] bg-background-tertiary-hover">
                  <RiArrowDownSLine className="size-4 text-text-secondary" aria-hidden />
                </span>
              </DropdownTrigger>
              <DropdownPopover aria-label="Board team" placement="top start" className="w-[220px] p-2">
                <DropdownGroup>
                  <DropdownItem
                    onSelect={() => {
                      window.location.href = "mailto:hi@boardui.com";
                    }}
                    className="px-2 py-1.5"
                  >
                    <span className="truncate text-body-medium whitespace-nowrap text-text-primary">Email hi@boardui.com</span>
                  </DropdownItem>
                  <DropdownItem
                    onSelect={() => {
                      window.location.href = "/templates";
                    }}
                    className="px-2 py-1.5"
                  >
                    <span className="truncate text-body-medium whitespace-nowrap text-text-primary">View templates</span>
                  </DropdownItem>
                </DropdownGroup>
              </DropdownPopover>
            </Dropdown>
          </div>
        </footer>
      </aside>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Main chat                                                           */
/* ------------------------------------------------------------------ */

type ChatMsg = {
  id: number;
  role: "user" | "agent";
  text: string;
  /** Group replies only: which roster agent wrote this message. */
  agentId?: string;
  /** Name of a file attached to a user message, if any. */
  attachment?: string;
};

function ReplyFooter({
  agent,
  thinking,
  onOpenEditor,
  feedback,
  onFeedback,
  copied,
  onCopy,
}: {
  agent: Agent;
  /** True while this agent's reply is being generated. */
  thinking: boolean;
  onOpenEditor: (agentId?: string) => void;
  feedback: "helpful" | "unhelpful" | null;
  onFeedback: (v: "helpful" | "unhelpful") => void;
  copied: boolean;
  onCopy: () => void;
}) {
  return (
    <div className="flex items-center justify-between gap-2 px-3">
      {/* The original button holds two overlapping layers — "Thinking…"
          (opacity 0) and the agent name (opacity 1) — cross-fading while a
          reply generates. This replica mounts only one of the two: the
          "Thinking…" label exists in the DOM only while a reply is being
          generated, so it can never flash on first load. Clicking it opens
          the agent editor, like the header pill. */}
      <button
        type="button"
        aria-label={agent.name}
        onClick={() => onOpenEditor(agent.id)}
        className="my-1 flex min-w-0 cursor-pointer items-center gap-1 rounded-lg text-start text-body-2-medium text-text-secondary outline-none focus-visible:ring-2 focus-visible:ring-border-focus-ring"
      >
        <span className="relative block shrink-0" style={{ width: 20, height: 20 }}>
          <span className="absolute start-0 top-0 block size-8 origin-top-left rtl:origin-top-right" style={{ transform: "scale(0.625)" }}>
            <AgentAvatar agent={agent} size={32} />
          </span>
        </span>
        <span className="grid">
          {thinking ? (
            <span className="col-start-1 row-start-1">Thinking…</span>
          ) : (
            <span className="col-start-1 row-start-1">{agent.name}</span>
          )}
        </span>
      </button>
      <div
        className="mt-1 flex shrink-0 items-center gap-1 opacity-0 transition-opacity duration-150 group-hover/reply:opacity-100 group-focus-within/reply:opacity-100"
        aria-label="Message actions"
      >
        <button
          type="button"
          aria-label="Helpful response"
          aria-pressed={feedback === "helpful"}
          onClick={() => onFeedback("helpful")}
          className={cx(
            "flex size-[22px] cursor-pointer items-center justify-center rounded-md outline-none focus-visible:ring-2 focus-visible:ring-border-focus-ring",
            feedback === "helpful"
              ? "bg-background-primary-default text-text-primary ring-1 ring-border-button-default"
              : "bg-background-tertiary-default text-foreground-icon-tertiary",
          )}
        >
          <RiThumbUpLine className="size-3" aria-hidden />
        </button>
        <button
          type="button"
          aria-label="Unhelpful response"
          aria-pressed={feedback === "unhelpful"}
          onClick={() => onFeedback("unhelpful")}
          className={cx(
            "flex size-[22px] cursor-pointer items-center justify-center rounded-md outline-none focus-visible:ring-2 focus-visible:ring-border-focus-ring",
            feedback === "unhelpful"
              ? "bg-background-primary-default text-text-primary ring-1 ring-border-button-default"
              : "bg-background-tertiary-default text-foreground-icon-tertiary",
          )}
        >
          <RiThumbDownLine className="size-3" aria-hidden />
        </button>
        <button
          type="button"
          aria-label={copied ? "Copied to clipboard" : "Copy response"}
          title={copied ? "Copied!" : "Copy response"}
          onClick={onCopy}
          className="flex size-[22px] cursor-pointer items-center justify-center rounded-md bg-background-tertiary-default text-foreground-icon-tertiary outline-none focus-visible:ring-2 focus-visible:ring-border-focus-ring"
        >
          {copied ? (
            <RiCheckLine className="size-3 text-text-primary" aria-hidden />
          ) : (
            <RiFileCopyLine className="size-3" aria-hidden />
          )}
        </button>
      </div>
    </div>
  );
}

function GroupEmptyState() {
  return (
    <div className="flex h-full flex-col items-center justify-center px-6 py-10 text-center">
      <div className="relative mb-5 flex h-16 items-end justify-center">
        <AgentAvatar agent={{ body: "#36c15c", shape: "shield", name: "landing page designer" }} size={40} className="relative z-[1] -me-2" />
        <AgentAvatar agent={{ body: "#E34798", shape: "star", name: "marketing bot" }} size={40} className="relative z-[2] -mt-3" />
        <AgentAvatar agent={{ body: "#1bb4ce", shape: "diamond", name: "Product planner" }} size={40} className="relative z-[1] -ms-2" />
      </div>
      <p className="text-title-2-medium text-text-primary">A few minds. One conversation.</p>
      <p className="mt-2 max-w-md text-body-regular text-text-secondary">
        landing page designer, marketing bot, Product planner are here. Send a message to get
        everyone&rsquo;s perspective.
      </p>
    </div>
  );
}

function ChatMain({
  agent,
  agents,
  messages,
  groupName,
  thinking,
  onOpenEditor,
  onOpenMobileNav,
  onRename,
  onDelete,
  onClear,
}: {
  agent: Agent | null;
  agents: Agent[];
  messages: ChatMsg[];
  groupName: string;
  /** A reply is being generated — the latest agent message shows Thinking…. */
  thinking: boolean;
  /** Opens the editor; with an id, selects that agent first (group replies). */
  onOpenEditor: (agentId?: string) => void;
  onOpenMobileNav: () => void;
  /** Rename the current agent (or the group when no agent is selected). */
  onRename: (name: string) => void;
  /** Delete the current agent conversation. Not offered for the group. */
  onDelete: () => void;
  /** Clear the current agent's messages. Not offered for the group. */
  onClear: () => void;
}) {
  const [copied, setCopied] = useState(false);
  const [copiedResponseId, setCopiedResponseId] = useState<number | null>(null);
  const [feedback, setFeedback] = useState<Record<number, "helpful" | "unhelpful" | null>>({});
  const [menuOpen, setMenuOpen] = useState(false);
  const [renaming, setRenaming] = useState(false);
  const [renameValue, setRenameValue] = useState("");
  const listRef = useRef<HTMLDivElement>(null);
  const [fade, setFade] = useState(0);

  const onListScroll = () => {
    const el = listRef.current;
    if (el) setFade(Math.min(el.scrollTop / 24, 1));
  };

  const copyText = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
    } catch {
      const ta = document.createElement("textarea");
      ta.value = text;
      document.body.appendChild(ta);
      ta.select();
      document.execCommand("copy");
      document.body.removeChild(ta);
    }
  };

  const copyResponse = (message: ChatMsg) => {
    void copyText(message.text).then(() => {
      setCopiedResponseId(message.id);
      window.setTimeout(() => setCopiedResponseId((id) => (id === message.id ? null : id)), 1500);
    });
  };

  const messageAgentName = (m: ChatMsg) =>
    (m.agentId ? agents.find((a) => a.id === m.agentId)?.name : undefined) ??
    agent?.name ??
    "Agent";

  const copyConversation = async () => {
    const lines = messages.map((m) =>
      m.role === "user" ? `You: ${m.text}` : `${messageAgentName(m)}: ${m.text}`,
    );
    await copyText(lines.join("\n\n"));
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1500);
  };

  const toggleFeedback = (id: number, value: "helpful" | "unhelpful") => {
    setFeedback((prev) => ({ ...prev, [id]: prev[id] === value ? null : value }));
  };

  let lastAgentIdx = -1;
  messages.forEach((m, i) => {
    if (m.role === "agent") lastAgentIdx = i;
  });

  const startRename = () => {
    setRenameValue(agent ? agent.name : groupName);
    setRenaming(true);
  };

  /* Inline rename: Enter saves, Escape or clicking away discards. (A
     cancel flag was tried first and removed: when the input unmounts
     without focus, no blur fires, so a stale flag swallowed the next
     Enter save. Blur discarding needs no flag.) */
  const commitRename = () => {
    const next = renameValue.trim();
    if (next) onRename(next);
    setRenaming(false);
  };

  /* Opening the editor from the header capsule or a reply footer must
     dismiss the Conversation options menu first: the menu is anchored to
     the header, and once the editor panel opens the main column narrows —
     a menu left open would sit on top of the user bubbles. */
  const handleOpenEditor = (agentId?: string) => {
    setMenuOpen(false);
    onOpenEditor(agentId);
  };

  return (
    <>
      <header className="flex h-[55px] shrink-0 items-start gap-2 px-3 pt-3">
        {/* Mobile only: opens the conversation list drawer. The original has
            this button (aria-label "Open conversations", md:hidden); the
            sidebar is hidden below md, so without it there is no way to
            reach the list on narrow screens. */}
        <button
          type="button"
          aria-label="Open conversations"
          onClick={onOpenMobileNav}
          className="relative inline-flex size-8 -ms-2 shrink-0 cursor-pointer items-center justify-center rounded-2lg border-0 bg-transparent text-foreground-icon-primary shadow-none outline-none transition-colors duration-150 ease hover:bg-background-primary-hover focus-visible:ring-2 focus-visible:ring-border-focus-ring md:hidden"
        >
          <RiMenuLine className="size-4 shrink-0" aria-hidden />
        </button>
        {renaming ? (
          <div className="flex min-w-0 flex-1">
            <input
              autoFocus
              value={renameValue}
              onChange={(e) => setRenameValue(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") commitRename();
                if (e.key === "Escape") setRenaming(false);
              }}
              onBlur={() => setRenaming(false)}
              aria-label="Conversation name"
              className="h-[31px] min-w-0 max-w-full rounded-full bg-background-tertiary-default px-3 text-body-2-medium text-text-primary outline-none focus-visible:ring-2 focus-visible:ring-border-focus-ring"
            />
          </div>
        ) : agent ? (
          <div className="flex min-w-0 flex-1">
            <button
              type="button"
              aria-label={`Edit ${agent.name}`}
              title="Edit agent"
              onClick={() => handleOpenEditor()}
              className="flex h-[31px] min-w-0 max-w-full cursor-pointer items-center gap-2 rounded-full bg-background-tertiary-default/60 px-2 pe-3 text-body-2-medium text-text-secondary outline-none transition-colors hover:bg-background-tertiary-default focus-visible:ring-2 focus-visible:ring-border-focus-ring"
            >
              <AgentAvatar agent={agent} size={20} />
              <span className="truncate">{agent.name}</span>
              <RiArrowDownSLine className="size-4 shrink-0 text-foreground-icon-tertiary" aria-hidden />
            </button>
          </div>
        ) : (
          <div className="flex min-w-0 flex-1 items-center">
            <span className="truncate text-body-2-medium text-text-secondary">{groupName}</span>
          </div>
        )}
        {/* Template-switcher entry: an icon-only grid button in the header
            (the original template has no cross-template navigation; the
            text button that used to sit here broke the original's header).
            It lives inside the main column, a flex sibling of the editor
            panel, so opening the editor shrinks the column instead of
            covering this button. */}
        <a
          href="/templates"
          aria-label="全部模板"
          title="全部模板"
          className="relative inline-flex size-8 shrink-0 cursor-pointer items-center justify-center rounded-2lg border-0 bg-transparent text-foreground-icon-secondary shadow-none outline-none transition-colors duration-150 ease hover:bg-background-primary-hover focus-visible:ring-2 focus-visible:ring-border-focus-ring"
        >
          <RiLayoutGridLine className="size-4 shrink-0" aria-hidden />
        </a>
        <button
          type="button"
          aria-label={copied ? "Copied to clipboard" : "Copy conversation"}
          title={copied ? "Copied!" : "Copy conversation"}
          onClick={copyConversation}
          className="cursor-pointer rounded p-1 text-foreground-icon-secondary outline-none focus-visible:ring-2 focus-visible:ring-border-focus-ring"
        >
          {copied ? (
            <RiCheckLine className="size-4 text-text-primary" aria-hidden />
          ) : (
            <RiDownloadLine className="size-4" aria-hidden />
          )}
        </button>
        <Dropdown isOpen={menuOpen} onOpenChange={setMenuOpen}>
          <DropdownTrigger
            aria-label="Conversation options"
            className="cursor-pointer rounded p-1 text-foreground-icon-secondary outline-none focus-visible:ring-2 focus-visible:ring-border-focus-ring"
          >
            <RiMoreLine className="size-4" aria-hidden />
          </DropdownTrigger>
          <DropdownPopover
            aria-label="Conversation options"
            placement="bottom end"
            className="w-[220px] overflow-x-hidden p-2"
          >
            <DropdownGroup>
              <DropdownItem
                onSelect={() => {
                  setMenuOpen(false);
                  startRename();
                }}
                className="px-2 py-1.5"
              >
                <span className="min-w-0 truncate text-body-medium whitespace-nowrap text-text-primary">
                  {agent ? "Rename conversation" : "Rename group"}
                </span>
              </DropdownItem>
              {agent ? (
                <>
                  <DropdownItem
                    onSelect={() => {
                      setMenuOpen(false);
                      onClear();
                    }}
                    className="px-2 py-1.5"
                  >
                    <span className="min-w-0 truncate text-body-medium whitespace-nowrap text-text-primary">
                      Clear conversation
                    </span>
                  </DropdownItem>
                  <DropdownDivider />
                  <DropdownItem
                    onSelect={() => {
                      setMenuOpen(false);
                      onDelete();
                    }}
                    className="px-2 py-1.5"
                  >
                    <span className="min-w-0 truncate text-body-medium whitespace-nowrap text-text-error-primary">
                      Delete conversation
                    </span>
                  </DropdownItem>
                </>
              ) : null}
            </DropdownGroup>
          </DropdownPopover>
        </Dropdown>
      </header>
      <div className="relative min-h-0 flex-1">
        <div
          ref={listRef}
          onScroll={onListScroll}
          aria-label="Messages"
          tabIndex={0}
          className="h-full overflow-y-auto overscroll-contain pb-4 pt-2 outline-none [scrollbar-width:none] focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-border-focus-ring"
        >
          {agent === null && messages.length === 0 ? (
            <GroupEmptyState />
          ) : (
            <>
              <div className="mb-4 mt-3 flex justify-center">
                <span className="rounded-full bg-background-tertiary-default px-[7px] py-1 text-body-2-medium text-text-secondary">
                  Today
                </span>
              </div>
              {messages.map((message, messageIdx) => {
                if (message.role === "user") {
                  return (
                    <div
                      key={message.id}
                      className="me-3 ms-auto mt-3 w-fit max-w-[min(520px,calc(100%-24px))] rounded-[var(--radius-2-5xl)] bg-background-primary-default p-3 text-start text-body-regular whitespace-pre-wrap break-words text-text-primary"
                    >
                      {message.attachment && (
                        <span className="mb-1.5 flex items-center gap-1.5 text-body-2-medium text-text-secondary">
                          <RiAttachmentLine className="size-3.5 shrink-0" aria-hidden />
                          <span className="truncate">{message.attachment}</span>
                        </span>
                      )}
                      {message.text}
                    </div>
                  );
                }
                const msgAgent =
                  (message.agentId ? agents.find((a) => a.id === message.agentId) : undefined) ??
                  agent;
                return (
                  <article
                    key={message.id}
                    className="group/reply mx-3 mt-3 w-fit max-w-[min(520px,calc(100%-24px))] text-body-regular"
                  >
                    <div className="rounded-[var(--radius-2-5xl)] bg-background-tertiary-default p-3">
                      <div className="flex flex-col gap-3">
                        {message.text.split("\n").map((para, i) => (
                          <p key={i} className="break-words text-body-regular text-text-primary">
                            {para}
                          </p>
                        ))}
                      </div>
                    </div>
                    {msgAgent && (
                      <ReplyFooter
                        agent={msgAgent}
                        thinking={thinking && messageIdx === lastAgentIdx}
                        onOpenEditor={handleOpenEditor}
                        feedback={feedback[message.id] ?? null}
                        onFeedback={(v) => toggleFeedback(message.id, v)}
                        copied={copiedResponseId === message.id}
                        onCopy={() => copyResponse(message)}
                      />
                    )}
                  </article>
                );
              })}
            </>
          )}
        </div>
        <div aria-hidden="true" className="pointer-events-none absolute inset-x-0 top-0 z-10">
          <div
            className="absolute inset-x-0 top-0 h-6 backdrop-blur-[1px]"
            style={{ opacity: fade, maskImage: "linear-gradient(to bottom, black, transparent)" }}
          />
          <div
            className="absolute inset-x-0 top-0 h-4 backdrop-blur-[4px]"
            style={{ opacity: fade, maskImage: "linear-gradient(to bottom, black, transparent)" }}
          />
          <div
            className="absolute inset-x-0 top-0 h-6"
            style={{
              opacity: fade,
              background:
                "linear-gradient(to bottom, var(--color-background-secondary-default), transparent)",
            }}
          />
        </div>
      </div>
    </>
  );
}

/* ------------------------------------------------------------------ */
/* Add to chat menu — measured from the live original (browser        */
/* 1919x998): a 359px "Add to chat" dialog above the composer, 7      */
/* items in 2 groups, icon + bold title + grey description on one    */
/* line per row. Grey line icons for Add, coloured solid tiles with   */
/* white icons for Plugins.                                           */
/* ------------------------------------------------------------------ */

type AddMenuItemId =
  | "files"
  | "goal"
  | "plan"
  | "documents"
  | "spreadsheets"
  | "presentations"
  | "code";

const ADD_MENU_GROUPS: {
  label: string;
  items: { id: AddMenuItemId; title: string; desc?: string }[];
}[] = [
  {
    label: "Add",
    items: [
      { id: "files", title: "Files and folders" },
      { id: "goal", title: "Goal", desc: "Set a goal for faster results" },
      { id: "plan", title: "Plan mode", desc: "Manage complex tasks" },
    ],
  },
  {
    label: "Plugins",
    items: [
      { id: "documents", title: "Documents", desc: "Create and edit documents" },
      { id: "spreadsheets", title: "Spreadsheets", desc: "Generate spreadsheets" },
      { id: "presentations", title: "Presentations", desc: "Create marketing assets" },
      { id: "code", title: "Code blocks", desc: "Write and edit existing code" },
    ],
  },
];

/** Starter prompt each plugin pre-fills into the composer input. */
const PLUGIN_ACTIONS: Record<
  "documents" | "spreadsheets" | "presentations" | "code",
  { label: string; prompt: string }
> = {
  documents: { label: "Documents", prompt: "Create a document about " },
  spreadsheets: { label: "Spreadsheets", prompt: "Generate a spreadsheet for " },
  presentations: { label: "Presentations", prompt: "Create a presentation about " },
  code: { label: "Code blocks", prompt: "Write or edit code for " },
};

/** The menu's icon slot: a 24px box so grey line icons and coloured
    plugin tiles line the rows up. Plugin tiles are solid semantic
    colours (blue / purple / teal) with a white icon. */
function AddMenuIcon({ kind }: { kind: AddMenuItemId }) {
  const tile = (bg: string, Icon: typeof RiTableLine) => (
    <span className={cx("flex size-6 shrink-0 items-center justify-center rounded-lg", bg)}>
      <Icon className="size-4 text-text-white" aria-hidden />
    </span>
  );
  const plain = (Icon: typeof RiTableLine) => (
    <span className="flex size-6 shrink-0 items-center justify-center">
      <Icon className="size-5 text-foreground-icon-secondary" aria-hidden />
    </span>
  );
  switch (kind) {
    case "files":
      return plain(RiAttachmentLine);
    case "goal":
      return plain(RiTargetLine);
    case "plan":
      return plain(RiListCheck);
    case "documents":
      return plain(RiFileTextLine);
    case "spreadsheets":
      return tile("bg-accent-500", RiTableLine);
    case "presentations":
      return tile("bg-chart-5-active", RiSlideshowLine);
    case "code":
      return tile("bg-chart-1-active", RiCodeLine);
  }
}

function Composer({
  value,
  onValueChange,
  onSubmit,
}: {
  value: string;
  onValueChange: (v: string) => void;
  onSubmit: (attachment?: string) => void;
}) {
  const [permission, setPermission] = useState("Bypass all");
  const [listening, setListening] = useState(false);
  const [attachment, setAttachment] = useState<{ name: string } | null>(null);
  /* Add to chat menu + the feedback each of its items produces in the
     composer: a goal row/chip, a plan-mode banner, and the active
     plugin line (plus its pre-filled starter prompt). */
  const [addMenuOpen, setAddMenuOpen] = useState(false);
  const [goalInputOpen, setGoalInputOpen] = useState(false);
  const [goalDraft, setGoalDraft] = useState("");
  const [goal, setGoal] = useState("");
  const [planMode, setPlanMode] = useState(false);
  const [activePlugin, setActivePlugin] = useState<{
    id: "documents" | "spreadsheets" | "presentations" | "code";
    label: string;
  } | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const addTriggerRef = useRef<HTMLButtonElement>(null);
  const addMenuRef = useRef<HTMLDivElement>(null);

  /* The menu is a custom-positioned panel (see the trigger below), so
     dismissal is wired by hand with the same util the Dropdown recipe
     uses: outside press closes it, the trigger toggles it. */
  useDismissOnOutsidePress(addMenuOpen, () => setAddMenuOpen(false), [addTriggerRef, addMenuRef]);

  useEffect(() => {
    if (!addMenuOpen) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setAddMenuOpen(false);
    };
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [addMenuOpen]);

  const pickFile = (accept: string) => {
    const el = fileRef.current;
    if (!el) return;
    el.accept = accept;
    el.click();
  };

  const submit = () => {
    onSubmit(attachment?.name);
    setAttachment(null);
  };

  const confirmGoal = () => {
    const next = goalDraft.trim();
    if (next) setGoal(next);
    setGoalInputOpen(false);
  };

  /** Every Add menu item does something visible: Files opens the file
      picker (chip travels with the sent message), Goal opens a goal
      input row, Plan mode raises a banner, and each plugin pre-fills
      a starter prompt and raises its own status line. */
  const handleAddMenuSelect = (id: AddMenuItemId) => {
    setAddMenuOpen(false);
    if (id === "files") {
      pickFile("*/*");
      return;
    }
    if (id === "goal") {
      setGoalDraft(goal);
      setGoalInputOpen(true);
      return;
    }
    if (id === "plan") {
      setPlanMode(true);
      return;
    }
    const plugin = PLUGIN_ACTIONS[id];
    setActivePlugin({ id, label: plugin.label });
    onValueChange(value.trim() ? `${value.trimEnd()} ${plugin.prompt}` : plugin.prompt);
    textareaRef.current?.focus();
  };

  const noticeIconBtn =
    "flex size-5 shrink-0 cursor-pointer items-center justify-center rounded-full text-foreground-icon-secondary outline-none hover:bg-background-tertiary-hover focus-visible:ring-2 focus-visible:ring-border-focus-ring";

  return (
    <div className="shrink-0 p-1">
      <div className="flex w-full flex-col">
        <div className="relative flex w-full flex-col rounded-[var(--radius-2-5xl)] bg-background-primary-default p-2.5 shadow-[0_1px_0.5px_rgba(0,0,0,0.02),0_4px_2px_rgba(0,0,0,0.02)]">
          <div className="flex flex-col gap-5 pt-1.5">
            <div className="px-1.5">
              {/* Feedback rows for the Add menu, above the text input, so
                  every menu item visibly does something. */}
              {goalInputOpen && (
                <div className="mb-2 flex items-center gap-2 rounded-xl bg-background-tertiary-default px-2.5 py-1.5">
                  <RiTargetLine className="size-4 shrink-0 text-foreground-icon-secondary" aria-hidden />
                  <input
                    autoFocus
                    type="text"
                    value={goalDraft}
                    onChange={(e) => setGoalDraft(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") confirmGoal();
                      if (e.key === "Escape") setGoalInputOpen(false);
                    }}
                    placeholder="Set a goal for faster results…"
                    aria-label="Goal"
                    className="min-w-0 flex-1 bg-transparent text-body-2-medium text-text-primary outline-none placeholder:text-text-tertiary"
                  />
                  <button type="button" aria-label="Save goal" onClick={confirmGoal} className={noticeIconBtn}>
                    <RiCheckLine className="size-4" aria-hidden />
                  </button>
                  <button type="button" aria-label="Cancel goal" onClick={() => setGoalInputOpen(false)} className={noticeIconBtn}>
                    <RiCloseLine className="size-4" aria-hidden />
                  </button>
                </div>
              )}
              {goal && !goalInputOpen && (
                <span className="mb-2 flex w-fit max-w-full items-center gap-1.5 rounded-full bg-background-tertiary-default py-1 pe-1 ps-2.5 text-body-2-medium text-text-secondary">
                  <RiTargetLine className="size-3.5 shrink-0" aria-hidden />
                  <span className="truncate">Goal: {goal}</span>
                  <button type="button" aria-label="Remove goal" onClick={() => setGoal("")} className={noticeIconBtn}>
                    <RiCloseLine className="size-3.5" aria-hidden />
                  </button>
                </span>
              )}
              {planMode && (
                <div className="mb-2 flex items-center gap-2 rounded-xl bg-background-tertiary-default px-2.5 py-1.5">
                  <RiListCheck className="size-4 shrink-0 text-foreground-icon-secondary" aria-hidden />
                  <span className="min-w-0 flex-1 truncate text-body-2-medium text-text-secondary">
                    Plan mode on — I&rsquo;ll break complex tasks into steps before acting.
                  </span>
                  <button type="button" aria-label="Turn off plan mode" onClick={() => setPlanMode(false)} className={noticeIconBtn}>
                    <RiCloseLine className="size-4" aria-hidden />
                  </button>
                </div>
              )}
              {activePlugin && (
                <div className="mb-2 flex items-center gap-2 rounded-xl bg-background-tertiary-default px-2.5 py-1.5">
                  <AddMenuIcon kind={activePlugin.id} />
                  <span className="min-w-0 flex-1 truncate text-body-2-medium text-text-secondary">
                    {activePlugin.label} ready — describe what you want below.
                  </span>
                  <button type="button" aria-label="Dismiss plugin" onClick={() => setActivePlugin(null)} className={noticeIconBtn}>
                    <RiCloseLine className="size-4" aria-hidden />
                  </button>
                </div>
              )}
              {attachment && (
                <span className="mb-2 flex w-fit max-w-full items-center gap-1.5 rounded-full bg-background-tertiary-default py-1 pe-1 ps-2.5 text-body-2-medium text-text-secondary">
                  <RiAttachmentLine className="size-3.5 shrink-0" aria-hidden />
                  <span className="truncate">{attachment.name}</span>
                  <button
                    type="button"
                    aria-label="Remove attachment"
                    onClick={() => setAttachment(null)}
                    className="flex size-5 shrink-0 cursor-pointer items-center justify-center rounded-full outline-none hover:bg-background-tertiary-hover focus-visible:ring-2 focus-visible:ring-border-focus-ring"
                  >
                    <RiCloseLine className="size-3.5" aria-hidden />
                  </button>
                </span>
              )}
              <textarea
                ref={textareaRef}
                rows={1}
                aria-label="Hi, what do you need today?"
                placeholder={listening ? "Listening…" : "Hi, what do you need today?"}
                value={value}
                onChange={(e) => onValueChange(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    submit();
                  }
                }}
                className="block max-h-[200px] w-full resize-none bg-transparent p-0 text-body-regular text-text-primary caret-accent-500 outline-none placeholder:text-text-tertiary"
              />
              <input
                ref={fileRef}
                type="file"
                aria-hidden="true"
                tabIndex={-1}
                className="hidden"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) setAttachment({ name: file.name });
                  e.target.value = "";
                }}
              />
            </div>
            <div className="flex items-center justify-between gap-2">
              <div className="flex min-w-0 items-center gap-2">
                {/* Add to chat — measured from the live original: a 359px
                    "Add to chat" dialog floating above the composer, its
                    bottom edge 2px above the input box top edge and its
                    left edge aligned with this button's left edge. A
                    trigger-anchored Popover cannot sit there (it would
                    hang off the button, inside the composer), so the
                    panel is absolutely positioned against the composer
                    panel instead, reusing the BoardUI menu surface and
                    DropdownGroup / DropdownItem rows. While open the
                    trigger is a black "×"; clicking it closes the menu. */}
                <button
                  ref={addTriggerRef}
                  type="button"
                  aria-label="Add to chat"
                  aria-expanded={addMenuOpen}
                  aria-haspopup="dialog"
                  onClick={() => setAddMenuOpen((v) => !v)}
                  className={cx(
                    "flex size-9 shrink-0 cursor-pointer items-center justify-center rounded-full p-2 outline-none transition-colors duration-150 ease focus-visible:ring-2 focus-visible:ring-border-focus-ring",
                    addMenuOpen
                      ? "bg-text-primary hover:bg-text-primary"
                      : "bg-composer-panel-add-background hover:bg-composer-panel-add-hover-background",
                  )}
                >
                  {addMenuOpen ? (
                    <RiCloseLine className="size-5 text-text-white" aria-hidden />
                  ) : (
                    <RiAddLine className="size-5 text-foreground-icon-primary" aria-hidden />
                  )}
                </button>
                {addMenuOpen && (
                  <div
                    ref={addMenuRef}
                    role="dialog"
                    aria-label="Add to chat"
                    className={cx(
                      "bui-add-menu absolute bottom-[calc(100%+2px)] left-2.5 z-50 w-[359px]",
                      MENU_POPOVER_SURFACE,
                      "rounded-[14px] p-3",
                    )}
                  >
                    <div className="flex flex-col gap-1 outline-none">
                      {ADD_MENU_GROUPS.map((group) => (
                        <DropdownGroup key={group.label} label={group.label}>
                          {group.items.map((item) => (
                            <DropdownItem
                              key={item.id}
                              onSelect={() => handleAddMenuSelect(item.id)}
                              className="px-2 py-1.5"
                            >
                              <AddMenuIcon kind={item.id} />
                              <span className="flex min-w-0 flex-1 items-baseline gap-1 truncate">
                                <span className="shrink-0 text-body-semibold text-text-primary">
                                  {item.title}
                                </span>
                                {item.desc ? (
                                  <span className="truncate text-body-2-regular text-text-secondary">
                                    — {item.desc}
                                  </span>
                                ) : null}
                              </span>
                            </DropdownItem>
                          ))}
                        </DropdownGroup>
                      ))}
                    </div>
                  </div>
                )}
                {/* Permission — the original shows only the mode ("Bypass
                    all") with "Permission: " in the aria-label, but the
                    visible text is widened here to the full "Permission:
                    Bypass all" so the prefix is never clipped. The menu
                    items are the standard modes; the original's menu
                    content is not in the snapshot. */}
                <Dropdown>
                  <DropdownTrigger
                    aria-label={`Permission: ${permission}`}
                    className="flex h-[30px] shrink-0 cursor-pointer items-center gap-1 whitespace-nowrap rounded-full px-2 py-[5px] pe-2.5 outline-none transition-colors duration-150 ease hover:bg-background-tertiary-default focus-visible:ring-2 focus-visible:ring-border-focus-ring"
                  >
                    <RiShieldLine className="size-4 shrink-0 text-foreground-icon-secondary" aria-hidden />
                    <span className="whitespace-nowrap text-body-medium text-text-secondary">
                      Permission: {permission}
                    </span>
                  </DropdownTrigger>
                  <DropdownPopover aria-label="Permission" placement="top start" className="w-[190px] p-2">
                    <DropdownGroup>
                      {["Bypass all", "Ask every time", "Deny all"].map((mode) => (
                        <DropdownItem
                          key={mode}
                          selected={permission === mode}
                          onSelect={() => setPermission(mode)}
                          className="px-2 py-1.5"
                        >
                          <span className="truncate text-body-medium whitespace-nowrap text-text-primary">{mode}</span>
                        </DropdownItem>
                      ))}
                    </DropdownGroup>
                  </DropdownPopover>
                </Dropdown>
              </div>
              <div className="flex items-center gap-2">
                {/* Model — a real dropdown, but with only the one model the
                    snapshot shows ("Fable 5"). The old "Fable 4" toggle
                    option was invented and is gone; the original's other
                    options are not in the snapshot. */}
                <Dropdown>
                  <DropdownTrigger
                    aria-label="Model"
                    className="flex cursor-pointer items-center gap-0.5 rounded-full px-1 py-1 text-body-medium text-text-secondary outline-none hover:bg-background-tertiary-default focus-visible:ring-2 focus-visible:ring-border-focus-ring"
                  >
                    <span className="whitespace-nowrap px-0.5 text-body-medium text-text-secondary">Fable 5</span>
                    <RiArrowDownSLine className="size-[18px] shrink-0 text-foreground-icon-secondary transition-transform duration-200 ease" aria-hidden />
                  </DropdownTrigger>
                  <DropdownPopover aria-label="Model" placement="top end" className="w-[190px] p-2">
                    <DropdownGroup>
                      <DropdownItem selected onSelect={() => {}} className="px-2 py-1.5">
                        <span className="flex w-full items-center justify-between gap-2 truncate text-body-medium whitespace-nowrap text-text-primary">
                          Fable 5
                          <RiCheckLine className="size-4 shrink-0" aria-hidden />
                        </span>
                      </DropdownItem>
                    </DropdownGroup>
                  </DropdownPopover>
                </Dropdown>
                <div className="flex items-center gap-2">
                  {/* Voice input — toggles a listening state (pressed +
                      placeholder). No transcription is wired up: the
                      original's behaviour here is not in the snapshot. */}
                  <button
                    type="button"
                    aria-label={listening ? "Stop voice input" : "Voice input"}
                    aria-pressed={listening}
                    onClick={() => setListening((v) => !v)}
                    className={cx(
                      "relative flex size-9 cursor-pointer items-center justify-center rounded-full border p-2 shadow-xs outline-none transition-colors duration-150 ease focus-visible:ring-2 focus-visible:ring-border-focus-ring",
                      listening
                        ? "border-accent-500 bg-accent-500 hover:bg-accent-600"
                        : "border-border-button-default bg-background-primary-default hover:bg-background-primary-hover",
                    )}
                  >
                    <RiMicLine className={cx("size-5", listening ? "text-white" : "text-foreground-icon-primary")} aria-hidden />
                  </button>
                  <button
                    type="button"
                    aria-label="Send message"
                    onClick={submit}
                    className="flex size-9 cursor-pointer items-center justify-center rounded-full bg-button-primary p-2 outline-none transition-opacity duration-200 ease hover:opacity-90 focus-visible:ring-2 focus-visible:ring-border-focus-ring focus-visible:ring-offset-2"
                  >
                    <RiArrowUpLine className="size-5 text-white" aria-hidden />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* Agent editor (right panel)                                          */
/* ------------------------------------------------------------------ */

function AgentEditor({
  agent,
  onSave,
  onClose,
}: {
  agent: Agent;
  /** Persists the edited fields back to the page's agent list. */
  onSave: (patch: Partial<Agent>) => void;
  onClose: () => void;
}) {
  const [name, setName] = useState(agent.name);
  const [label, setLabel] = useState(agent.label);
  const [desc, setDesc] = useState(agent.desc);
  // Language codes match the original's native select: "" + auto/en/tr/es/
  // fr/de/ja/pt. Voice is disabled in the original (Off / System voice).
  const [language, setLanguage] = useState("auto");
  const [voice, setVoice] = useState("system");
  const [speed, setSpeed] = useState("1");
  const [previewing, setPreviewing] = useState(false);
  const [voiceToast, setVoiceToast] = useState<string | null>(null);
  const [notify, setNotify] = useState(true);
  const [colorIdx, setColorIdx] = useState(() => {
    const i = AVATAR_COLORS.findIndex((c) => c.from.toLowerCase() === agent.body.toLowerCase());
    return i >= 0 ? i : -1;
  });
  const [customColor, setCustomColor] = useState("#437EF7");
  const [avatar, setAvatar] = useState({ body: agent.body, shape: agent.shape });
  const [expression, setExpression] = useState<AvatarExpression>(agent.expression ?? "Neutral");
  const [dragOver, setDragOver] = useState(false);
  const colorInputRef = useRef<HTMLInputElement>(null);

  /* REPLICA NOTE: the original editor has no visible save affordance in the
     public template, but edits here used to be discarded on close — every
     field above was local useState with no callback. Save persists name,
     label, description and the picked avatar (body + shape + expression) to the page's
     agent list; closing via X saves too, so edits are never lost. */
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") saveAndClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  });

  const saveAndClose = () => {
    onSave({
      name: name.trim() || agent.name,
      label,
      desc,
      body: avatar.body,
      shape: avatar.shape,
      expression,
    });
    onClose();
  };

  /* Stop any preview speech when the editor unmounts. */
  useEffect(() => {
    return () => {
      if (typeof window !== "undefined" && "speechSynthesis" in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  /** Preview voice — the original ships this button and the voice select
      disabled (Off / System voice only, in the snapshot). They are enabled
      here: the preview reads the agent's name + description aloud with the
      browser's speech synthesis, at the chosen playback speed. "Mika" is
      not in the snapshot; it maps to a device voice named Mika when one
      exists, and falls back to the system voice otherwise. */
  const previewVoice = () => {
    if (!("speechSynthesis" in globalThis)) {
      setVoiceToast("Voice preview is not supported in this browser.");
      window.setTimeout(() => setVoiceToast(null), 3500);
      return;
    }
    if (previewing) {
      window.speechSynthesis.cancel();
      setPreviewing(false);
      return;
    }
    if (voice === "off") {
      setVoiceToast("Voice is off — pick a voice to preview it.");
      window.setTimeout(() => setVoiceToast(null), 3500);
      return;
    }
    const utter = new SpeechSynthesisUtterance(
      `Hi, I'm ${name.trim() || agent.name}. ${desc.trim() || agent.desc}`,
    );
    utter.rate = parseFloat(speed) || 1;
    const voices = window.speechSynthesis.getVoices();
    const picked = voice === "mika" ? voices.find((v) => /mika/i.test(v.name)) : undefined;
    if (picked) {
      utter.voice = picked;
    } else if (voice === "mika") {
      setVoiceToast("No voice named Mika on this device — using the system voice.");
      window.setTimeout(() => setVoiceToast(null), 3500);
    }
    utter.onend = () => setPreviewing(false);
    utter.onerror = () => setPreviewing(false);
    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(utter);
    setPreviewing(true);
  };

  return (
    <aside
      aria-label="Agent editor"
      className="ms-4 hidden w-[360px] shrink-0 flex-col rounded-3xl border border-border-button-white bg-background-secondary-default shadow-sidebar lg:flex"
    >
      <div className="flex min-h-0 flex-1 flex-col overflow-y-auto p-3 [scrollbar-width:none]">
        <div className="flex shrink-0 items-center justify-between px-1 pb-2">
          <p className="truncate text-title-3-semibold text-text-primary">{agent.name}</p>
          <div className="flex shrink-0 items-center gap-1">
            <button
              type="button"
              onClick={saveAndClose}
              className="flex h-8 cursor-pointer items-center rounded-full bg-button-primary px-3 text-body-2-medium text-text-white shadow-xs outline-none focus-visible:ring-2 focus-visible:ring-border-focus-ring"
            >
              Save
            </button>
            <button
              type="button"
              aria-label="Close agent editor"
              onClick={saveAndClose}
              className="flex size-8 shrink-0 cursor-pointer items-center justify-center rounded-full text-foreground-icon-secondary outline-none transition-colors hover:bg-background-tertiary-default focus-visible:ring-2 focus-visible:ring-border-focus-ring"
            >
              <RiCloseLine className="size-5" aria-hidden />
            </button>
          </div>
        </div>

        {/* Avatar: the original's 360px region — a 268px emotion ring of 16
            dots around a large central avatar. In the snapshot each dot is
            a plain 34px circle (all hsl(181 49% 80%)) holding a blank
            canvas; the live original draws the expression face on that
            canvas, so each dot here draws the same face as an SVG
            (MiniFace, from the EXPRESSIONS table) with the name on hover
            and in the caption below. Shapes can also be dragged from the
            row below onto the central preview. */}
        <div className="relative h-[360px] shrink-0 overflow-hidden">
          <div className="pointer-events-none absolute left-1/2 top-[30px] z-10 -translate-x-1/2">
            <div role="group" aria-label="Agent emotion" className="pointer-events-auto relative size-[268px] touch-none rounded-full">
              <div className="pointer-events-none absolute inset-0">
                {EXPRESSION_ORDER.map((e, i) => (
                  <div
                    key={e}
                    className="absolute left-1/2 top-1/2 -ml-[17px] -mt-[17px] size-[34px]"
                    style={{ transform: `rotate(${i * 22.5}deg) translateY(-116px)` }}
                  >
                    <button
                      type="button"
                      aria-label={e}
                      aria-pressed={expression === e}
                      title={e}
                      onClick={() => setExpression(e)}
                      className={cx(
                        "pointer-events-auto flex size-[34px] cursor-pointer items-center justify-center overflow-hidden rounded-full border-2 outline-none transition-[border-color,box-shadow,transform] hover:ring-2 hover:ring-border-button-hover focus-visible:ring-2 focus-visible:ring-border-focus-ring",
                        expression === e
                          ? "scale-110 border-foreground-icon-primary ring-2 ring-border-focus-ring"
                          : "border-transparent",
                      )}
                      style={{ backgroundColor: "hsl(181 49% 80%)" }}
                    >
                      <MiniFace expression={e} size={28} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
          <div
            className={cx(
              "absolute left-1/2 top-[164px] z-0 -translate-x-1/2 -translate-y-1/2 rounded-full outline-none transition-shadow",
              dragOver && "ring-2 ring-accent-500",
            )}
            onDragOver={(e) => {
              e.preventDefault();
              setDragOver(true);
            }}
            onDragLeave={() => setDragOver(false)}
            onDrop={(e) => {
              e.preventDefault();
              setDragOver(false);
              const shape = e.dataTransfer.getData("text/plain") as AvatarShape;
              if ((AVATAR_SHAPES as string[]).includes(shape)) {
                setAvatar((prev) => ({ ...prev, shape }));
              }
            }}
          >
            <AgentAvatar agent={{ ...agent, body: avatar.body, shape: avatar.shape, expression }} size={150} />
          </div>
        </div>

        {/* Selected expression, always visible: the ring dots are small, so
            the current emotion's name is spelled out here as well as on
            each dot's hover tooltip. */}
        <p aria-live="polite" className="shrink-0 pb-1 text-center text-body-2-medium text-text-secondary">
          Expression: <span className="text-text-primary">{expression}</span>
        </p>

        {/* Shape options + colour dots */}
        <div className="flex shrink-0 flex-col items-center gap-3 pb-1">
          <div className="grid w-full grid-cols-3 gap-2" role="listbox" aria-label="Agent shape">
            {AVATAR_SHAPES.map((s) => {
              const cap = s[0].toUpperCase() + s.slice(1);
              const selectedShape = avatar.shape === s;
              return (
                <button
                  key={s}
                  type="button"
                  role="option"
                  aria-selected={selectedShape}
                  aria-label={`${cap} shape`}
                  title={`${cap} shape — drag onto the preview to apply`}
                  draggable
                  onDragStart={(e) => {
                    e.dataTransfer.setData("text/plain", s);
                    e.dataTransfer.effectAllowed = "copy";
                  }}
                  onClick={() => setAvatar((prev) => ({ ...prev, shape: s }))}
                  className={cx(
                    "flex min-h-[76px] cursor-grab flex-col items-center justify-center gap-1 rounded-2xl border px-1 py-2 outline-none transition-colors hover:bg-background-secondary-default focus-visible:ring-2 focus-visible:ring-border-focus-ring active:cursor-grabbing",
                    selectedShape
                      ? "border-border-button-default bg-background-primary-default ring-1 ring-border-button-default"
                      : "border-transparent bg-transparent",
                  )}
                >
                  {/* Pure silhouette, no face: the shape itself is the
                      preview (the snapshot's shape buttons hold a 56px
                      canvas silhouette, no visible name). */}
                  <svg viewBox="0 0 40 40" width={40} height={40} aria-hidden="true" className="block text-foreground-icon-secondary">
                    <path d={SHAPE_PATHS[s]} fill="currentColor" />
                  </svg>
                  <span className={cx("text-body-2-medium", selectedShape ? "text-text-primary" : "text-text-secondary")}>
                    {cap}
                  </span>
                </button>
              );
            })}
          </div>
          <div className="flex items-center gap-1.5">
            {AVATAR_COLORS.map((c, i) => (
              <button
                key={c.id}
                type="button"
                aria-label={`${c.label} avatar`}
                title={c.id}
                aria-pressed={i === colorIdx}
                onClick={() => {
                  setColorIdx(i);
                  setAvatar((prev) => ({ ...prev, body: c.from }));
                }}
                className={cx(
                  "size-5 cursor-pointer rounded-full outline-none transition-transform focus-visible:ring-2 focus-visible:ring-border-focus-ring",
                  i === colorIdx ? "scale-110 ring-2 ring-offset-2 ring-border-focus-ring" : "hover:scale-110",
                )}
                style={{ background: `radial-gradient(closest-side circle at 50% 50%, ${c.from} 0%, ${c.to} 100%)` }}
              />
            ))}
            {/* Custom avatar colour — the original opens a colour picker
                (aria-expanded). This opens the native colour picker; the
                picked colour applies to the avatar immediately. */}
            <button
              type="button"
              aria-label="Custom avatar color"
              title="Custom avatar color"
              onClick={() => colorInputRef.current?.click()}
              className={cx(
                "flex size-5 cursor-pointer items-center justify-center rounded-full outline-none transition-transform hover:scale-110 focus-visible:ring-2 focus-visible:ring-border-focus-ring",
                colorIdx === -1 && "scale-110 ring-2 ring-offset-2 ring-border-focus-ring",
              )}
              style={{ background: "conic-gradient(#ef4444,#f97316,#eab308,#22c55e,#3b82f6,#8b5cf6,#ec4899,#ef4444)" }}
            />
            <input
              ref={colorInputRef}
              type="color"
              aria-hidden="true"
              tabIndex={-1}
              value={customColor}
              onChange={(e) => {
                setCustomColor(e.target.value);
                setColorIdx(-1);
                setAvatar((prev) => ({ ...prev, body: e.target.value }));
              }}
              className="sr-only"
            />
          </div>
        </div>

        {/* Form: label left, value in a grey box right */}
        <div className="flex shrink-0 flex-col gap-3 pb-3">
          <div className="flex w-full flex-col rounded-2xl bg-background-secondary-default px-3 ps-3">
            <label className="flex min-h-14 items-center justify-between gap-3 border-b border-separator-border py-3">
              <span className="shrink-0 text-body-medium text-text-primary">Name</span>
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                aria-label="Agent name"
                placeholder="Michael Scott"
                maxLength={48}
                className="w-[62%] min-w-0 rounded-2lg bg-background-tertiary-default px-2.5 py-1.5 text-body-regular text-text-primary outline-none placeholder:text-text-tertiary focus-visible:ring-2 focus-visible:ring-border-focus-ring"
              />
            </label>
            <label className="flex min-h-14 items-center justify-between gap-3 border-b border-separator-border py-3">
              <span className="shrink-0 text-body-medium text-text-primary">Label</span>
              <input
                value={label}
                onChange={(e) => setLabel(e.target.value)}
                aria-label="Agent label"
                placeholder="Manager, marketing, painter"
                maxLength={60}
                className="w-[62%] min-w-0 rounded-2lg bg-background-tertiary-default px-2.5 py-1.5 text-body-regular text-text-primary outline-none placeholder:text-text-tertiary focus-visible:ring-2 focus-visible:ring-border-focus-ring"
              />
            </label>
            <label className="flex flex-col items-start gap-2 py-3">
              <span className="text-body-medium text-text-primary">Description</span>
              <textarea
                rows={4}
                value={desc}
                onChange={(e) => setDesc(e.target.value)}
                aria-label="Agent description"
                placeholder="Details for the agent"
                maxLength={500}
                className="min-h-[96px] w-full resize-none rounded-2lg bg-background-tertiary-default p-2.5 text-body-regular text-text-primary outline-none placeholder:text-text-tertiary focus-visible:ring-2 focus-visible:ring-border-focus-ring"
              />
            </label>
          </div>

          <div className="flex w-full flex-col rounded-2xl bg-background-secondary-default px-3 ps-3">
            <div className="flex min-h-14 items-center justify-between gap-3 border-b border-separator-border py-3">
              <span className="flex items-center gap-2 text-body-medium text-text-primary">
                <RiEarthLine className="size-5 text-foreground-icon-secondary" aria-hidden />
                Language
              </span>
              {/* Native select, exactly like the original: an empty option
                  plus Auto-detect, English, Turkish, Spanish, French,
                  German, Japanese, Portuguese. */}
              <span className="relative flex items-center">
                <select
                  aria-label="Agent language"
                  value={language}
                  onChange={(e) => setLanguage(e.target.value)}
                  className="cursor-pointer appearance-none rounded-2lg border border-border-button-default bg-background-primary-default py-1 pe-6 ps-[7px] text-body-2-medium text-text-primary shadow-xs outline-none transition-colors hover:bg-background-primary-hover hover:border-border-button-hover focus-visible:ring-2 focus-visible:ring-border-focus-ring"
                >
                  <option value="">{" "}</option>
                  <option value="auto">Auto-detect</option>
                  <option value="en">English</option>
                  <option value="tr">Turkish</option>
                  <option value="es">Spanish</option>
                  <option value="fr">French</option>
                  <option value="de">German</option>
                  <option value="ja">Japanese</option>
                  <option value="pt">Portuguese</option>
                </select>
                <RiArrowDownSLine className="pointer-events-none absolute end-1.5 size-3.5 shrink-0 text-text-secondary" aria-hidden />
              </span>
            </div>
            <div className="flex items-center gap-3 py-3">
              <RiNotification3Line className="size-5 shrink-0 text-foreground-icon-secondary" aria-hidden />
              <div className="flex min-w-0 flex-1 flex-col gap-1">
                <span className="text-body-medium text-text-primary">Notifications</span>
                <p className="text-caption-1-regular text-text-secondary">
                  Show a notice when a reply is ready.
                </p>
              </div>
              <Switch isSelected={notify} onChange={setNotify} aria-label="Notify when this agent finishes" />
            </div>
          </div>

          <div className="flex w-full flex-col rounded-2xl bg-background-secondary-default px-3 ps-3">
            <div className="flex min-h-14 items-center justify-between gap-3 border-b border-separator-border py-3">
              <span className="flex items-center gap-2 text-body-medium text-text-primary">
                <RiVolumeUpLine className="size-5 text-foreground-icon-secondary" aria-hidden />
                Voice
              </span>
              <span className="flex items-center gap-1.5">
                <button
                  type="button"
                  aria-label={previewing ? "Stop voice preview" : "Preview voice"}
                  aria-pressed={previewing}
                  title={previewing ? "Stop voice preview" : "Preview voice"}
                  onClick={previewVoice}
                  className={cx(
                    "flex size-7 cursor-pointer items-center justify-center rounded-2lg border border-border-button-default shadow-xs outline-none transition-colors hover:bg-background-primary-hover focus-visible:ring-2 focus-visible:ring-border-focus-ring",
                    previewing
                      ? "bg-accent-500 text-text-white hover:bg-accent-600"
                      : "bg-background-primary-default text-text-secondary",
                  )}
                >
                  {previewing ? (
                    <RiStopFill className="size-[18px] shrink-0" aria-hidden />
                  ) : (
                    <RiPlayFill className="size-[18px] shrink-0" aria-hidden />
                  )}
                </button>
                <span className="relative flex items-center">
                  <select
                    aria-label="Agent voice"
                    value={voice}
                    onChange={(e) => setVoice(e.target.value)}
                    className="cursor-pointer appearance-none rounded-2lg border border-border-button-default bg-background-primary-default py-1 pe-6 ps-[7px] text-body-2-medium text-text-primary shadow-xs outline-none transition-colors hover:bg-background-primary-hover hover:border-border-button-hover focus-visible:ring-2 focus-visible:ring-border-focus-ring"
                  >
                    <option value="">{" "}</option>
                    <option value="off">Off</option>
                    <option value="system">System voice</option>
                    <option value="mika">Mika</option>
                  </select>
                  <RiArrowDownSLine className="pointer-events-none absolute end-1.5 size-3.5 shrink-0 text-text-secondary" aria-hidden />
                </span>
              </span>
            </div>
            {voiceToast && (
              <p role="status" className="py-2 text-body-2-regular text-text-secondary">
                {voiceToast}
              </p>
            )}
            <div className="flex items-center justify-between gap-3 py-3">
              <span className="text-body-medium text-text-primary">Playback speed</span>
              <div role="radiogroup" aria-label="Playback speed" className="relative inline-flex items-start gap-0.5 rounded-2lg">
                {(["0.75", "1", "1.25", "1.5"] as const).map((v) => (
                  <button
                    key={v}
                    type="button"
                    role="radio"
                    aria-checked={speed === v}
                    onClick={() => setSpeed(v)}
                    className={cx(
                      "relative z-10 inline-flex min-w-0 flex-1 cursor-pointer items-center justify-center rounded-md px-1 py-1 text-center whitespace-nowrap outline-none transition-colors duration-200 ease focus-visible:ring-2 focus-visible:ring-border-focus-ring",
                      speed === v
                        ? "bg-background-primary-default text-body-medium text-text-primary shadow-xs"
                        : "text-body-regular text-text-secondary hover:text-text-primary",
                    )}
                  >
                    {v}×
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
}

/* ------------------------------------------------------------------ */
/* Marketplace pane — rendered inside the SettingsModal's marketplace  */
/* page. Lists the addable agents; Add appends one to the sidebar.    */
/* ------------------------------------------------------------------ */

function MarketplacePane() {
  return (
    <div className="flex flex-col gap-2">
      <p className="text-body-regular text-text-secondary">
        The Marketplace listing is not included in the original page&apos;s
        server-rendered snapshot, so no agent list can be shown here yet.
        The roster that used to appear here was invented and has been
        removed; it will be restored from the live page once verified.
      </p>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Page                                                                */
/* ------------------------------------------------------------------ */

function seedMessages(agent: Agent): ChatMsg[] {
  return [
    { id: 1, role: "user", text: agent.userMsg },
    { id: 2, role: "agent", text: `${agent.replyP1}\n${agent.replyP2}` },
  ];
}

export default function MultiAgentChatTemplatePage() {
  /* REPLICA NOTE: the roster is state, not the module const — the editor
     saves name/avatar/description here, and the options menu renames/
     deletes here, so every change is visible in the sidebar and the chat
     header immediately. Nothing is persisted beyond the session (the
     original template is a demo the same way). */
  const [agents, setAgents] = useState<Agent[]>(AGENTS);
  const [groupName, setGroupName] = useState(GROUP.name);
  const [selectedId, setSelectedId] = useState("landing");
  const [editorOpen, setEditorOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [settingsPage, setSettingsPage] = useState<SettingsPage>("general");
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [groupMsgs, setGroupMsgs] = useState<ChatMsg[]>([]);
  const [thinking, setThinking] = useState(false);
  const [input, setInput] = useState("");
  const [convs, setConvs] = useState<Record<string, ChatMsg[]>>(() => {
    const init: Record<string, ChatMsg[]> = {};
    for (const a of AGENTS) init[a.id] = seedMessages(a);
    return init;
  });
  const nextId = useRef(100);
  const replyIdx = useRef<Record<string, number>>({});

  const agent =
    selectedId === GROUP.id ? null : (agents.find((a) => a.id === selectedId) ?? agents[0] ?? null);
  const messages = agent ? (convs[agent.id] ?? seedMessages(agent)) : groupMsgs;

  const saveAgent = (patch: Partial<Agent>) => {
    if (!agent) return;
    setAgents((prev) => prev.map((a) => (a.id === agent.id ? { ...a, ...patch } : a)));
  };

  const openEditor = (agentId?: string) => {
    if (agentId) setSelectedId(agentId);
    setEditorOpen(true);
  };

  const openSettings = (page: SettingsPage) => {
    setSettingsPage(page);
    setSettingsOpen(true);
  };

  /* Create menu actions. The original's menu items are not in the
     snapshot, so these are the expected New agent / New chat / New group
     set — the labels are pending live verification. */
  const createAgent = () => {
    const id = `custom-${Date.now()}`;
    const created: Agent = {
      id,
      name: "New agent",
      label: "Custom",
      desc: "A new agent. Give it a name, a label and a description in the editor.",
      intro: "A new agent. Give it a name, a label and a description in the editor.",
      body: "#437EF7",
      shape: "star",
      userMsg: "Hello! What should we work on?",
      replyP1: "Hi — I'm a new agent. Tell me what you'd like me to help with and I'll get started.",
      replyP2: "You can change my name, label, description and appearance in the editor on the right.",
    };
    setAgents((prev) => [...prev, created]);
    setConvs((prev) => ({ ...prev, [id]: seedMessages(created) }));
    setSelectedId(id);
    setEditorOpen(true);
  };

  const newChat = () => {
    if (agent) setConvs((prev) => ({ ...prev, [agent.id]: [] }));
    else setGroupMsgs([]);
    setEditorOpen(false);
  };

  const newGroup = () => {
    setSelectedId(GROUP.id);
    setEditorOpen(false);
  };

  const renameCurrent = (name: string) => {
    if (agent) {
      setAgents((prev) => prev.map((a) => (a.id === agent.id ? { ...a, name } : a)));
    } else {
      setGroupName(name);
    }
  };

  const deleteCurrent = () => {
    if (!agent) return;
    const id = agent.id;
    const remaining = agents.filter((a) => a.id !== id);
    setAgents(remaining);
    setConvs((prev) => {
      const next = { ...prev };
      delete next[id];
      return next;
    });
    setEditorOpen(false);
    setSelectedId(remaining[0]?.id ?? GROUP.id);
  };

  const clearCurrent = () => {
    if (!agent) {
      setGroupMsgs([]);
      return;
    }
    setConvs((prev) => ({ ...prev, [agent.id]: [] }));
  };

  const nextFollowUp = (member: Agent) => {
    const followUps = FOLLOW_UPS[member.id] ?? [genericFollowUp(member)];
    const idx = replyIdx.current[member.id] ?? 0;
    replyIdx.current[member.id] = idx + 1;
    return followUps[idx % followUps.length];
  };

  const submit = (attachment?: string) => {
    const text = input.trim();
    if (!text) return;
    const userMsg: ChatMsg = {
      id: nextId.current++,
      role: "user",
      text,
      ...(attachment ? { attachment } : {}),
    };
    setInput("");
    if (!agent) {
      // Group chat — this used to be dead (submit() returned early when no
      // agent was selected). Each roster member of the group now replies in
      // its own voice, staggered: "按 agent 回复". "Product planner" is
      // named in the group empty state but has no agent record in the
      // snapshot, so it does not reply.
      setGroupMsgs((prev) => [...prev, userMsg]);
      const members = ["landing", "marketing"]
        .map((id) => agents.find((a) => a.id === id))
        .filter((a): a is Agent => Boolean(a));
      if (members.length === 0) return;
      setThinking(true);
      members.forEach((member, i) => {
        const replyText = nextFollowUp(member);
        window.setTimeout(() => {
          const reply: ChatMsg = {
            id: nextId.current++,
            role: "agent",
            text: replyText,
            agentId: member.id,
          };
          setGroupMsgs((prev) => [...prev, reply]);
          if (i === members.length - 1) setThinking(false);
        }, 700 * (i + 1));
      });
      return;
    }
    setConvs((prev) => ({ ...prev, [agent.id]: [...(prev[agent.id] ?? []), userMsg] }));
    /* Per-agent follow-ups, cycling — the seeded first exchange is verbatim
       from the original page; later replies come from this agent's voice. */
    setThinking(true);
    const replyText = nextFollowUp(agent);
    window.setTimeout(() => {
      const reply: ChatMsg = { id: nextId.current++, role: "agent", text: replyText };
      setConvs((prev) => ({ ...prev, [agent.id]: [...(prev[agent.id] ?? []), reply] }));
      setThinking(false);
    }, 700);
  };

  return (
    <div className="flex h-dvh min-h-0 overflow-hidden bg-background-full p-3 text-text-primary">
      <DocumentTitle />
      <style>{`@keyframes bui-blink{0%,91%,100%{transform:scaleY(1)}94%,96%{transform:scaleY(.08)}}.bui-blink-l{animation:bui-blink 4.4s infinite;transform-box:fill-box;transform-origin:center}.bui-blink-r{animation:bui-blink 5.3s infinite;transform-box:fill-box;transform-origin:center}@keyframes bui-wander-l{0%,100%{transform:translate(0,0)}25%{transform:translate(2px,1px)}50%{transform:translate(-2px,0)}75%{transform:translate(1px,-1px)}}@keyframes bui-wander-r{0%,100%{transform:translate(0,0)}30%{transform:translate(-2px,1px)}55%{transform:translate(1.5px,-1px)}80%{transform:translate(-1px,1px)}}.bui-wander-l{animation:bui-wander-l 7s ease-in-out infinite}.bui-wander-r{animation:bui-wander-r 8.5s ease-in-out infinite;animation-delay:-2.3s}@keyframes bui-morph{from{transform:scale(.93);opacity:.55}to{transform:scale(1);opacity:1}}.bui-morph{animation:bui-morph .32s ease-out;transform-box:fill-box;transform-origin:center}@keyframes bui-add-menu{from{opacity:0;transform:scale(.97) translateY(4px)}to{opacity:1;transform:scale(1) translateY(0)}}.bui-add-menu{animation:bui-add-menu .15s ease-out;transform-origin:bottom left}@media (prefers-reduced-motion:reduce){.bui-blink-l,.bui-blink-r,.bui-wander-l,.bui-wander-r,.bui-morph,.bui-add-menu{animation:none!important}}`}</style>
      <Sidebar
        selectedId={selectedId}
        onSelect={(id) => {
          setSelectedId(id);
          setEditorOpen(false);
        }}
        searchOpen={searchOpen}
        setSearchOpen={setSearchOpen}
        agents={agents}
        onOpenMarketplace={() => openSettings("marketplace")}
        onOpenSettings={() => openSettings("general")}
        onCreateAgent={createAgent}
        onNewChat={newChat}
        onNewGroup={newGroup}
      />
      {mobileNavOpen && (
        <div className="fixed inset-0 z-50 flex md:hidden">
          <button
            type="button"
            aria-label="Close conversations"
            onClick={() => setMobileNavOpen(false)}
            className="absolute inset-0 cursor-pointer bg-black/40"
          />
          <div className="relative flex h-full p-3">
            <Sidebar
              selectedId={selectedId}
              onSelect={(id) => {
                setSelectedId(id);
                setEditorOpen(false);
                setMobileNavOpen(false);
              }}
              searchOpen={searchOpen}
              setSearchOpen={setSearchOpen}
              agents={agents}
              onOpenMarketplace={() => openSettings("marketplace")}
              onOpenSettings={() => openSettings("general")}
              onCreateAgent={createAgent}
              onNewChat={newChat}
              onNewGroup={newGroup}
              forceVisible
            />
          </div>
        </div>
      )}
      <main
        aria-label="Agent conversation"
        className="flex min-h-0 min-w-0 flex-1 flex-col rounded-3xl bg-background-secondary-default"
      >
        <ChatMain
          agent={agent}
          agents={agents}
          messages={messages}
          groupName={groupName}
          thinking={thinking}
          onOpenEditor={openEditor}
          onOpenMobileNav={() => setMobileNavOpen(true)}
          onRename={renameCurrent}
          onDelete={deleteCurrent}
          onClear={clearCurrent}
        />
        <Composer value={input} onValueChange={setInput} onSubmit={submit} />
      </main>
      {editorOpen && agent && (
        <AgentEditor agent={agent} onSave={saveAgent} onClose={() => setEditorOpen(false)} />
      )}
      <SettingsModal
        isOpen={settingsOpen}
        onClose={() => setSettingsOpen(false)}
        defaultPage={settingsPage}
        planArtSrc="/templates/settings-plan-art.png"
        marketplace={<MarketplacePane />}
      />
    </div>
  );
}
