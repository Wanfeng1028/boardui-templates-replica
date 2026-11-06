"use client";

import {
  RiAddLine,
  RiArrowDownSLine,
  RiArrowUpLine,
  RiCheckLine,
  RiCloseLine,
  RiFileCopyLine,
  RiDownloadLine,
  RiEarthLine,
  RiHeadphoneLine,
  RiLayoutGridLine,
  RiMicLine,
  RiMore2Fill,
  RiNotification3Line,
  RiSearchLine,
  RiSettings3Line,
  RiShieldLine,
  RiShoppingBag3Line,
  RiThumbDownLine,
  RiThumbUpLine,
  RiVolumeUpLine,
} from "@remixicon/react";
import { useId, useRef, useState } from "react";

import {
  Dropdown,
  DropdownDivider,
  DropdownGroup,
  DropdownItem,
  DropdownPopover,
  DropdownTrigger,
} from "@/components/base/dropdown/dropdown";
import { SettingsModal } from "@/components/application/settings/settings-modal";

import { Switch } from "@/components/base/switch/switch";
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
    body: "#8554F6",
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
/* Marketplace roster — agents the visitor can add from the           */
/* Marketplace modal. Same shape as AGENTS, each with a seeded first  */
/* exchange, so an added agent opens with a real conversation.        */
/* ------------------------------------------------------------------ */

const MARKETPLACE_AGENTS: Agent[] = [
  {
    id: "data-analyst",
    name: "data analyst",
    label: "Analytics",
    desc: "Reads the numbers before the narrative. Finds where users drop off and what actually moves retention.",
    body: "#88c81c",
    shape: "petal",
    userMsg: "What do last month's numbers say about churn?",
    replyP1:
      "Churn clusters around the second month: most cancellations come from teams that never invited a second member. The product works, but the habit never forms.",
    replyP2:
      "Try a nudge at day 21 — a shared template, not a discount. If the team adds one collaborator, renewal jumps sharply.",
  },
  {
    id: "social-manager",
    name: "social media manager",
    label: "Social",
    desc: "Turns the work into posts people reply to. One honest behind-the-scenes update beats three polished announcements.",
    body: "#E74241",
    shape: "flower",
    userMsg: "What should we post this week?",
    replyP1:
      "One behind-the-scenes post beats three polished announcements. Show the messy middle — the draft, the decision, the fix.",
    replyP2:
      "Post Tuesday and Thursday, then reply to every comment within the hour. The replies are the content.",
  },
  {
    id: "copywriter",
    name: "copywriter",
    label: "Writing",
    desc: "Cuts words until only the meaning is left. Headlines that say what happens, not how great the product is.",
    body: "#437EF7",
    shape: "slender",
    userMsg: "Can you tighten this landing page headline?",
    replyP1:
      "Cut the adjectives and keep the verb. A headline should say what happens when the reader clicks, not how great the product is.",
    replyP2:
      "Try one line with a number in it — numbers give the eye a place to land.",
  },
  {
    id: "support-agent",
    name: "support agent",
    label: "Support",
    desc: "Answers the refund question before it is asked. Leads with what can be done, not what the policy says.",
    body: "#36c15c",
    shape: "heart",
    userMsg: "How do we handle the refund questions?",
    replyP1:
      "Answer the refund question before it is asked: put the policy next to the price, in plain words, with no link to chase.",
    replyP2:
      "For the angry ones, lead with what you can do, not what the policy says. People remember the fix, not the rule.",
  },
  {
    id: "product-manager",
    name: "product manager",
    label: "Product",
    desc: "Finds the gap three customers described in different words. Writes the one-paragraph story before the feature.",
    body: "#f47327",
    shape: "pocket",
    userMsg: "What should we build next?",
    replyP1:
      "Build the thing three customers asked for in different words. If the requests sound different but point at the same gap, that is the roadmap.",
    replyP2:
      "Write the one-paragraph story first — who it helps, what changes. If the story is boring, the feature will be too.",
  },
  {
    id: "ux-researcher",
    name: "ux researcher",
    label: "UX",
    desc: "Watches where people hesitate. Five users, no script beyond the first task — hesitation is the finding.",
    body: "#E34798",
    shape: "cloud",
    userMsg: "How do we test the new onboarding flow?",
    replyP1:
      "Five people, no script beyond the first task. Watch where they hesitate — hesitation is the finding, not the mistake.",
    replyP2:
      "Record the session and count the back-button presses. Three or more means the step is unclear, not the user.",
  },
];

/* ------------------------------------------------------------------ */
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
  turnable = false,
  className,
}: {
  agent: Pick<Agent, "body" | "shape" | "name"> & { expression?: AvatarExpression };
  size?: number;
  blinkDelay?: string;
  turnable?: boolean;
  className?: string;
}) {
  const rawId = useId().replace(/:/g, "");
  const [turned, setTurned] = useState(false);
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
      className={cx("block transition-transform duration-500", turned && "[transform:rotateY(180deg)]")}
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
  if (turnable) {
    return (
      <span
        className={cx("relative block shrink-0 [perspective:600px]", className)}
        style={{ width: size, height: size }}
        role="img"
        aria-label={label}
      >
        <button
          type="button"
          onClick={() => setTurned((t) => !t)}
          aria-label={`Turn ${agent.name} avatar around`}
          title="Click to turn around"
          className="block cursor-pointer rounded-full outline-none focus-visible:ring-2 focus-visible:ring-border-focus-ring"
        >
          {svg}
        </button>
      </span>
    );
  }
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
}: {
  selectedId: string;
  onSelect: (id: string) => void;
  searchOpen: boolean;
  setSearchOpen: (v: boolean) => void;
  agents: Agent[];
  onOpenMarketplace: () => void;
}) {
  return (
    <div className="me-4 hidden min-h-0 shrink-0 md:block">
      <aside
        aria-label="Conversations"
        className="flex h-full min-h-0 w-[260px] shrink-0 flex-col rounded-3xl border border-border-button-white bg-background-secondary-default p-[7px] shadow-sidebar"
      >
        {/* Top row: search (expandable) / Marketplace / Create */}
        <div className="relative h-9 shrink-0">
          <div className="grid h-full grid-cols-3 gap-2">
            <div aria-hidden="true" />
            <div>
              <button type="button" className={pillBtn} aria-label="Marketplace" onClick={onOpenMarketplace}>
                <RiShoppingBag3Line className="size-5 shrink-0" aria-hidden />
              </button>
            </div>
            <div className="flex">
              {/* Create bot or chat — no dedicated create flow exists in the
                  replica, so it opens the Marketplace (add an agent to start
                  a conversation), the same action as the Marketplace button. */}
              <button
                type="button"
                onClick={onOpenMarketplace}
                className="flex w-full min-w-0 cursor-pointer items-center justify-center rounded-full bg-button-primary text-text-white outline-none focus-visible:ring-2 focus-visible:ring-border-focus-ring"
                aria-label="Create bot or chat"
              >
                <RiAddLine className="size-5" aria-hidden />
              </button>
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
                  placeholder="Search conversations"
                  aria-label="Search conversations"
                  onBlur={() => setSearchOpen(false)}
                  className="min-w-0 flex-1 bg-transparent text-body-regular text-text-primary outline-none placeholder:text-text-tertiary"
                />
                <button
                  type="button"
                  aria-label="Close search"
                  onClick={() => setSearchOpen(false)}
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
            <button
              type="button"
              onClick={() => onSelect(GROUP.id)}
              aria-current={selectedId === GROUP.id ? "page" : undefined}
              className={cx(
                "flex h-[54px] shrink-0 items-center gap-2.5 rounded-xl p-1.5 text-start outline-none transition-colors focus-visible:ring-2 focus-visible:ring-border-focus-ring",
                selectedId === GROUP.id
                  ? "bg-background-tertiary-default"
                  : "hover:bg-background-secondary-hover",
              )}
            >
              <span className="relative block size-10 shrink-0">
                <AgentAvatar
                  agent={{ body: "#36c15c", shape: "shield", name: "landing page designer" }}
                  size={22}
                  className="absolute -left-0.5 top-0"
                />
                <AgentAvatar
                  agent={{ body: "#E34798", shape: "star", name: "marketing bot" }}
                  size={22}
                  className="absolute -right-0.5 top-0"
                />
                <AgentAvatar
                  agent={{ body: "#1bb4ce", shape: "diamond", name: "Product planner" }}
                  size={22}
                  className="absolute bottom-0 left-1/2 -translate-x-1/2"
                />
              </span>
              <span className="flex min-w-0 flex-1 flex-col gap-0.5">
                <span className="truncate text-body-medium text-text-primary">{GROUP.name}</span>
                <span className="truncate text-body-regular text-text-tertiary">{GROUP.desc}</span>
              </span>
            </button>
            {agents.map((agent, i) => {
              const active = agent.id === selectedId;
              return (
                <button
                  key={agent.id}
                  type="button"
                  onClick={() => onSelect(agent.id)}
                  aria-current={active ? "page" : undefined}
                  className={cx(
                    "flex h-[54px] shrink-0 items-center gap-2.5 rounded-xl p-1.5 text-start outline-none transition-colors focus-visible:ring-2 focus-visible:ring-border-focus-ring",
                    active ? "bg-background-tertiary-default" : "hover:bg-background-secondary-hover",
                  )}
                >
                  <AgentAvatar agent={agent} size={40} blinkDelay={`${(i % 5) * 0.7}s`} />
                  <span className="flex min-w-0 flex-1 flex-col gap-0.5">
                    <span className="truncate text-body-medium text-text-primary">{agent.name}</span>
                    <span className="truncate text-body-regular text-text-tertiary">{agent.replyP1}</span>
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Footer: All templates / Support / Settings / Board team */}
        <footer className="mt-2 flex shrink-0 flex-col gap-1">
          {/* REPLICA NOTE: the original template sidebar has no cross-template
              navigation, so a visitor entering this page directly cannot leave
              it for another template. This row links back to /templates; same
              row style as Support / Settings below. */}
          <a
            href="/templates"
            className="inline-flex h-9 w-full cursor-pointer items-center justify-start gap-0.5 rounded-2lg bg-transparent p-2 text-body-medium text-text-secondary outline-none transition-colors hover:bg-background-secondary-hover active:bg-background-secondary-hover focus-visible:ring-2 focus-visible:ring-border-focus-ring"
          >
            <RiLayoutGridLine className="size-5 shrink-0" aria-hidden />
            <span className="inline-flex items-center justify-center px-1 shrink-0">All templates</span>
          </a>
          <button
            type="button"
            className="inline-flex h-9 w-full cursor-pointer items-center justify-start gap-0.5 rounded-2lg bg-transparent p-2 text-body-medium text-text-secondary outline-none transition-colors hover:bg-background-secondary-hover active:bg-background-secondary-hover focus-visible:ring-2 focus-visible:ring-border-focus-ring"
          >
            <RiHeadphoneLine className="size-5 shrink-0" aria-hidden />
            <span className="inline-flex items-center justify-center px-1 shrink-0">Support</span>
          </button>
          <button
            type="button"
            className="inline-flex h-9 w-full cursor-pointer items-center justify-start gap-0.5 rounded-2lg bg-transparent p-2 text-body-medium text-text-secondary outline-none transition-colors hover:bg-background-secondary-hover active:bg-background-secondary-hover focus-visible:ring-2 focus-visible:ring-border-focus-ring"
          >
            <RiSettings3Line className="size-5 shrink-0" aria-hidden />
            <span className="inline-flex items-center justify-center px-1 shrink-0">Settings</span>
          </button>
          <div className="mt-2">
            <button
              type="button"
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
            </button>
          </div>
        </footer>
      </aside>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Main chat                                                           */
/* ------------------------------------------------------------------ */

type ChatMsg = { id: number; role: "user" | "agent"; text: string };

function ReplyFooter({ agent }: { agent: Agent }) {
  return (
    <div className="flex items-center justify-between gap-2 px-3">
      <button
        type="button"
        aria-label={agent.name}
        className="my-1 flex min-w-0 items-center gap-1 rounded-lg text-start text-body-2-medium text-text-secondary outline-none focus-visible:ring-2 focus-visible:ring-border-focus-ring"
      >
        <span className="relative block shrink-0" style={{ width: 20, height: 20 }}>
          <span className="absolute start-0 top-0 block size-8 origin-top-left rtl:origin-top-right" style={{ transform: "scale(0.625)" }}>
            <AgentAvatar agent={agent} size={32} />
          </span>
        </span>
        <span>{agent.name}</span>
      </button>
      <div
        className="mt-1 flex shrink-0 items-center gap-1 opacity-0 transition-opacity duration-150 group-hover/reply:opacity-100 group-focus-within/reply:opacity-100"
        aria-label="Message actions"
      >
        <button
          type="button"
          aria-label="Helpful response"
          aria-pressed="false"
          className="flex size-[22px] cursor-pointer items-center justify-center rounded-md bg-background-tertiary-default text-foreground-icon-tertiary outline-none focus-visible:ring-2 focus-visible:ring-border-focus-ring"
        >
          <RiThumbUpLine className="size-3" aria-hidden />
        </button>
        <button
          type="button"
          aria-label="Unhelpful response"
          aria-pressed="false"
          className="flex size-[22px] cursor-pointer items-center justify-center rounded-md bg-background-tertiary-default text-foreground-icon-tertiary outline-none focus-visible:ring-2 focus-visible:ring-border-focus-ring"
        >
          <RiThumbDownLine className="size-3" aria-hidden />
        </button>
        <button
          type="button"
          aria-label="Copy response"
          className="flex size-[22px] cursor-pointer items-center justify-center rounded-md bg-background-tertiary-default text-foreground-icon-tertiary outline-none focus-visible:ring-2 focus-visible:ring-border-focus-ring"
        >
          <RiFileCopyLine className="size-3" aria-hidden />
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
  messages,
  groupName,
  onOpenEditor,
  onRename,
  onDelete,
  onClear,
}: {
  agent: Agent | null;
  messages: ChatMsg[];
  groupName: string;
  onOpenEditor: () => void;
  /** Rename the current agent (or the group when no agent is selected). */
  onRename: (name: string) => void;
  /** Delete the current agent conversation. Not offered for the group. */
  onDelete: () => void;
  /** Clear the current agent's messages. Not offered for the group. */
  onClear: () => void;
}) {
  const [copied, setCopied] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [renaming, setRenaming] = useState(false);
  const [renameValue, setRenameValue] = useState("");

  const copyConversation = async () => {
    const lines = messages.map((m) =>
      m.role === "user" ? `You: ${m.text}` : `${agent?.name ?? "Agent"}: ${m.text}`,
    );
    const text = lines.join("\n\n");
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
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1500);
  };

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

  return (
    <>
      <header className="flex h-[55px] shrink-0 items-start gap-2 px-3 pt-3">
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
              onClick={onOpenEditor}
              className="flex h-[31px] min-w-0 max-w-full cursor-pointer items-center gap-2 rounded-full bg-background-tertiary-default/60 px-2 pe-3 text-body-2-medium text-text-secondary outline-none transition-colors hover:bg-background-tertiary-default focus-visible:ring-2 focus-visible:ring-border-focus-ring"
            >
              <AgentAvatar agent={agent} size={20} />
              <span className="truncate">{agent.name}</span>
            </button>
          </div>
        ) : (
          <div className="flex min-w-0 flex-1 items-center">
            <span className="truncate text-body-2-medium text-text-secondary">{groupName}</span>
          </div>
        )}
        {/* REPLICA NOTE: the sidebar is hidden below md, so this header link is
            the only way out of this page on narrow screens. */}
        <a
          href="/templates"
          aria-label="All templates"
          title="All templates"
          className="cursor-pointer rounded p-1 text-foreground-icon-secondary outline-none focus-visible:ring-2 focus-visible:ring-border-focus-ring"
        >
          <RiLayoutGridLine className="size-4" aria-hidden />
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
            <RiMore2Fill className="size-4" aria-hidden />
          </DropdownTrigger>
          <DropdownPopover
            aria-label="Conversation options"
            placement="bottom end"
            className="w-[190px] p-2"
          >
            <DropdownGroup>
              <DropdownItem
                onSelect={() => {
                  setMenuOpen(false);
                  startRename();
                }}
                className="px-2 py-1.5"
              >
                <span className="truncate text-body-medium whitespace-nowrap text-text-primary">
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
                    <span className="truncate text-body-medium whitespace-nowrap text-text-primary">
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
                    <span className="truncate text-body-medium whitespace-nowrap text-text-error-primary">
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
          aria-label="Messages"
          tabIndex={0}
          className="h-full overflow-y-auto overscroll-contain pb-4 pt-2 outline-none [scrollbar-width:none] focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-border-focus-ring"
        >
          {agent === null ? (
            <GroupEmptyState />
          ) : (
            <>
              <div className="mb-4 mt-3 flex justify-center">
                <span className="rounded-full bg-background-tertiary-default px-[7px] py-1 text-body-2-medium text-text-secondary">
                  Today
                </span>
              </div>
              {messages.map((message) =>
                message.role === "user" ? (
                  <div
                    key={message.id}
                    className="me-3 ms-auto mt-3 w-fit max-w-[min(520px,calc(100%-24px))] rounded-[var(--radius-2-5xl)] bg-background-primary-default p-3 text-start text-body-regular whitespace-pre-wrap break-words text-text-primary"
                  >
                    {message.text}
                  </div>
                ) : (
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
                    <ReplyFooter agent={agent} />
                  </article>
                ),
              )}
            </>
          )}
        </div>
        <div aria-hidden="true" className="pointer-events-none absolute inset-x-0 top-0 z-10">
          <div
            className="absolute inset-x-0 top-0 h-6 backdrop-blur-[1px]"
            style={{ opacity: 0, maskImage: "linear-gradient(to bottom, black, transparent)" }}
          />
          <div
            className="absolute inset-x-0 top-0 h-4 backdrop-blur-[4px]"
            style={{ opacity: 0, maskImage: "linear-gradient(to bottom, black, transparent)" }}
          />
          <div
            className="absolute inset-x-0 top-0 h-6"
            style={{
              opacity: 0,
              background:
                "linear-gradient(to bottom, var(--color-background-secondary-default), transparent)",
            }}
          />
        </div>
      </div>
    </>
  );
}

function Composer({
  value,
  onValueChange,
  onSubmit,
}: {
  value: string;
  onValueChange: (v: string) => void;
  onSubmit: () => void;
}) {
  const [model, setModel] = useState("Fable 5");
  return (
    <div className="shrink-0 p-1">
      <div className="flex w-full flex-col">
        <div className="flex w-full flex-col rounded-[var(--radius-2-5xl)] bg-background-primary-default p-2.5 shadow-[0_1px_0.5px_rgba(0,0,0,0.02),0_4px_2px_rgba(0,0,0,0.02)]">
          <div className="flex flex-col gap-5 pt-1.5">
            <div className="px-1.5">
              <textarea
                rows={1}
                aria-label="Message"
                placeholder="Hi, what do you need today?"
                value={value}
                onChange={(e) => onValueChange(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    onSubmit();
                  }
                }}
                className="block max-h-[200px] w-full resize-none bg-transparent p-0 text-body-regular text-text-primary caret-accent-500 outline-none placeholder:text-text-tertiary"
              />
            </div>
            <div className="flex items-center justify-between gap-2">
              <div className="flex min-w-0 items-center gap-2">
                <button
                  type="button"
                  aria-label="Add attachment"
                  className="flex size-9 shrink-0 cursor-pointer items-center justify-center rounded-full bg-composer-panel-add-background p-2 outline-none transition-colors duration-150 ease hover:bg-composer-panel-add-hover-background focus-visible:ring-2 focus-visible:ring-border-focus-ring"
                >
                  <RiAddLine className="size-5 text-foreground-icon-primary transition-transform duration-200 ease" aria-hidden />
                </button>
                <button
                  type="button"
                  aria-label="Permission: Bypass all"
                  className="flex h-[30px] min-w-0 cursor-pointer items-center gap-1 rounded-full px-2 py-[5px] pe-2.5 outline-none transition-colors duration-150 ease hover:bg-background-tertiary-default focus-visible:ring-2 focus-visible:ring-border-focus-ring"
                >
                  <RiShieldLine className="size-4 shrink-0 text-foreground-icon-secondary" aria-hidden />
                  <span className="truncate text-body-2-medium text-text-secondary">
                    Permission: Bypass all
                  </span>
                </button>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  aria-expanded="false"
                  onClick={() => setModel(model === "Fable 5" ? "Fable 4" : "Fable 5")}
                  className="flex cursor-pointer items-center gap-0.5 rounded-full px-1 py-1 text-body-medium text-text-secondary outline-none hover:bg-background-tertiary-default focus-visible:ring-2 focus-visible:ring-border-focus-ring"
                >
                  <span className="whitespace-nowrap px-0.5 text-body-medium text-text-secondary">{model}</span>
                  <RiArrowDownSLine className="size-[18px] shrink-0 text-foreground-icon-secondary transition-transform duration-200 ease" aria-hidden />
                </button>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    aria-label="Voice input"
                    aria-pressed="false"
                    className="relative flex size-9 cursor-pointer items-center justify-center rounded-full border border-border-button-default bg-background-primary-default p-2 shadow-xs outline-none transition-colors duration-150 ease hover:bg-background-primary-hover focus-visible:ring-2 focus-visible:ring-border-focus-ring"
                  >
                    <RiMicLine className="size-5 text-foreground-icon-primary" aria-hidden />
                  </button>
                  <button
                    type="button"
                    aria-label="Send message"
                    onClick={onSubmit}
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

/* ------------------------------------------------------------------ */
/* Agent editor (right panel)                                          */
/* ------------------------------------------------------------------ */

function AgentEditor({
  agent,
  agents,
  onSave,
  onClose,
}: {
  agent: Agent;
  agents: Agent[];
  /** Persists the edited fields back to the page's agent list. */
  onSave: (patch: Partial<Agent>) => void;
  onClose: () => void;
}) {
  const [name, setName] = useState(agent.name);
  const [label, setLabel] = useState(agent.label);
  const [desc, setDesc] = useState(agent.desc);
  const [language, setLanguage] = useState("Auto-detect");
  const [voice, setVoice] = useState("System voice");
  const [notify, setNotify] = useState(true);
  const [colorIdx, setColorIdx] = useState(() => {
    const i = AVATAR_COLORS.findIndex((c) => c.from.toLowerCase() === agent.body.toLowerCase());
    return i >= 0 ? i : 0;
  });
  const [shapeIdx, setShapeIdx] = useState(0);
  const [avatar, setAvatar] = useState({ body: agent.body, shape: agent.shape });
  const [expression, setExpression] = useState<AvatarExpression>(agent.expression ?? "Neutral");

  /* Ring variants: the 7 roster agents + one variant per original colour,
     cycling through the 9 shapes. */
  const variants: { body: string; shape: Agent["shape"]; name: string }[] = [
    ...agents.map((a) => ({ body: a.body, shape: a.shape, name: a.name })),
    ...AVATAR_COLORS.map((c, i) => ({
      body: c.from,
      shape: AVATAR_SHAPES[i % AVATAR_SHAPES.length],
      name: `${c.label} ${AVATAR_SHAPES[i % AVATAR_SHAPES.length]}`,
    })),
  ];
  const ringR = 41.5;

  /* REPLICA NOTE: the original editor has no visible save affordance in the
     public template, but edits here used to be discarded on close — every
     field above was local useState with no callback. Save persists name,
     label, description and the picked avatar (body + shape + expression) to the page's
     agent list; closing via X saves too, so edits are never lost. */
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

        {/* Avatar picker: large avatar in the centre, variants in a ring */}
        <div className="relative mx-auto shrink-0" style={{ width: 300, height: 300 }}>
          {variants.map((v, i) => {
            const angle = (i / variants.length) * Math.PI * 2 - Math.PI / 2;
            const x = 50 + ringR * Math.cos(angle);
            const y = 50 + ringR * Math.sin(angle);
            return (
              <button
                key={v.name}
                type="button"
                aria-label={`Use ${v.name} avatar`}
                onClick={() => {
                  setShapeIdx(i);
                  setAvatar({ body: v.body, shape: v.shape });
                }}
                className={cx(
                  "absolute -translate-x-1/2 -translate-y-1/2 cursor-pointer rounded-full p-0.5 outline-none transition-shadow focus-visible:ring-2 focus-visible:ring-border-focus-ring",
                  i === shapeIdx ? "ring-2 ring-accent-500" : "hover:ring-2 hover:ring-border-button-default",
                )}
                style={{ left: `${x}%`, top: `${y}%` }}
              >
                <AgentAvatar agent={{ body: v.body, shape: v.shape, name: v.name, expression }} size={28} />
              </button>
            );
          })}
          <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
            <AgentAvatar agent={{ ...agent, body: avatar.body, shape: avatar.shape, expression }} size={150} turnable />
          </div>
        </div>

        {/* Shape options + colour dots */}
        <div className="flex shrink-0 flex-col items-center gap-3 pb-1">
          <div className="flex flex-wrap items-center justify-center gap-2">
            {AVATAR_SHAPES.map((s) => (
              <button
                key={s}
                type="button"
                aria-label={`Shape ${s}`}
                onClick={() => setAvatar((prev) => ({ ...prev, shape: s }))}
                className={cx(
                  "flex size-9 cursor-pointer items-center justify-center rounded-xl border outline-none transition-colors focus-visible:ring-2 focus-visible:ring-border-focus-ring",
                  avatar.shape === s
                    ? "border-border-button-default bg-background-primary-default"
                    : "border-transparent bg-transparent hover:bg-background-tertiary-default",
                )}
              >
                <AgentAvatar agent={{ body: "#d7d7d7", shape: s, name: s, expression }} size={24} />
              </button>
            ))}
          </div>
          <div className="flex items-center gap-1.5">
            {AVATAR_COLORS.map((c, i) => (
              <button
                key={c.id}
                type="button"
                aria-label={`Color ${c.label}`}
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
            <span
              className="flex size-5 items-center justify-center rounded-full text-[10px]"
              style={{ background: "conic-gradient(#ef4444,#f97316,#eab308,#22c55e,#3b82f6,#8b5cf6,#ec4899,#ef4444)" }}
              aria-label="Rainbow"
            />
          </div>
        </div>

        {/* Expression picker: the original's 16-name ring, as a compact
            grid of live mini previews. Only the names are evidence — the
            faces are our reading of each name, not a pixel copy. */}
        <div className="flex shrink-0 flex-col gap-2 pb-1">
          <p className="text-body-medium text-text-primary">Expression</p>
          <div className="grid grid-cols-8 gap-1.5" role="group" aria-label="Agent emotion">
            {EXPRESSION_ORDER.map((e) => (
              <button
                key={e}
                type="button"
                aria-label={`Expression ${e}`}
                aria-pressed={expression === e}
                title={e}
                onClick={() => setExpression(e)}
                className={cx(
                  "flex size-[34px] cursor-pointer items-center justify-center rounded-full outline-none transition-shadow focus-visible:ring-2 focus-visible:ring-border-focus-ring",
                  expression === e ? "bg-background-tertiary-default ring-2 ring-accent-500" : "hover:bg-background-tertiary-default",
                )}
              >
                <AgentAvatar agent={{ body: avatar.body, shape: avatar.shape, name: e, expression: e }} size={30} />
              </button>
            ))}
          </div>
          <p className="text-caption-1-regular text-text-tertiary">
            16 expressions, drawn from the name list in the original editor — our interpretation, not a pixel copy. Click the large preview to turn it around.
          </p>
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
                className="w-[62%] min-w-0 rounded-2lg bg-background-tertiary-default px-2.5 py-1.5 text-body-regular text-text-primary outline-none focus-visible:ring-2 focus-visible:ring-border-focus-ring"
              />
            </label>
            <label className="flex min-h-14 items-center justify-between gap-3 border-b border-separator-border py-3">
              <span className="shrink-0 text-body-medium text-text-primary">Label</span>
              <input
                value={label}
                onChange={(e) => setLabel(e.target.value)}
                aria-label="Agent label"
                className="w-[62%] min-w-0 rounded-2lg bg-background-tertiary-default px-2.5 py-1.5 text-body-regular text-text-primary outline-none focus-visible:ring-2 focus-visible:ring-border-focus-ring"
              />
            </label>
            <label className="flex flex-col items-start gap-2 py-3">
              <span className="text-body-medium text-text-primary">Description</span>
              <textarea
                rows={4}
                value={desc}
                onChange={(e) => setDesc(e.target.value)}
                aria-label="Agent description"
                className="w-full resize-none rounded-2lg bg-background-tertiary-default p-2.5 text-body-regular text-text-primary outline-none focus-visible:ring-2 focus-visible:ring-border-focus-ring"
              />
            </label>
          </div>

          <div className="flex w-full flex-col rounded-2xl bg-background-secondary-default px-3 ps-3">
            <div className="flex min-h-14 items-center justify-between gap-3 border-b border-separator-border py-3">
              <span className="flex items-center gap-2 text-body-medium text-text-primary">
                <RiEarthLine className="size-5 text-foreground-icon-secondary" aria-hidden />
                Language
              </span>
              <button
                type="button"
                aria-label="Agent language"
                onClick={() => setLanguage(language === "Auto-detect" ? "English" : "Auto-detect")}
                className="flex cursor-pointer items-center justify-between gap-1 rounded-2lg border border-border-button-default bg-background-primary-default px-[7px] py-1 text-body-2-medium text-text-primary shadow-xs outline-none transition-colors hover:bg-background-primary-hover hover:border-border-button-hover focus-visible:ring-2 focus-visible:ring-border-focus-ring"
              >
                <span className="truncate">{language}</span>
                <RiArrowDownSLine className="size-3.5 shrink-0 text-text-secondary" aria-hidden />
              </button>
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
              <button
                type="button"
                aria-label="Agent voice"
                onClick={() => setVoice(voice === "System voice" ? "Voice 1" : "System voice")}
                className="flex cursor-pointer items-center justify-between gap-1 rounded-2lg border border-border-button-default bg-background-primary-default px-[7px] py-1 text-body-2-medium text-text-primary shadow-xs outline-none transition-colors hover:bg-background-primary-hover hover:border-border-button-hover focus-visible:ring-2 focus-visible:ring-border-focus-ring"
              >
                <span className="truncate">{voice}</span>
                <RiArrowDownSLine className="size-3.5 shrink-0 text-text-secondary" aria-hidden />
              </button>
            </div>
            <div className="flex items-center justify-between gap-3 py-3">
              <span className="text-body-medium text-text-primary">Playback speed</span>
              <span className="text-body-2-medium text-text-secondary">1.0×</span>
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

function MarketplacePane({
  agents,
  onAdd,
}: {
  agents: Agent[];
  onAdd: (agent: Agent) => void;
}) {
  return (
    <div className="flex flex-col gap-2">
      <p className="text-body-regular text-text-secondary">
        Meet your next teammate. Add an agent to start a conversation with it.
      </p>
      {MARKETPLACE_AGENTS.map((a) => {
        const added = agents.some((x) => x.id === a.id);
        return (
          <div
            key={a.id}
            className="flex items-center gap-3 rounded-2xl border border-border-button-default bg-background-primary-default p-3"
          >
            <AgentAvatar agent={a} size={40} />
            <div className="min-w-0 flex-1">
              <p className="truncate text-body-medium text-text-primary">{a.name}</p>
              <p className="truncate text-body-regular text-text-tertiary">
                {a.label} — {a.desc}
              </p>
            </div>
            <button
              type="button"
              disabled={added}
              onClick={() => onAdd(a)}
              className={cx(
                "flex h-8 shrink-0 cursor-pointer items-center rounded-full px-3 text-body-2-medium outline-none focus-visible:ring-2 focus-visible:ring-border-focus-ring",
                added
                  ? "cursor-default bg-background-tertiary-default text-text-tertiary"
                  : "bg-button-primary text-text-white shadow-xs",
              )}
            >
              {added ? "Added" : "Add"}
            </button>
          </div>
        );
      })}
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
     saves name/avatar/description here, the Marketplace appends here, and
     the options menu renames/deletes here, so every change is visible in
     the sidebar and the chat header immediately. Nothing is persisted
     beyond the session (the original template is a demo the same way). */
  const [agents, setAgents] = useState<Agent[]>(AGENTS);
  const [groupName, setGroupName] = useState(GROUP.name);
  const [selectedId, setSelectedId] = useState("landing");
  const [editorOpen, setEditorOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [marketplaceOpen, setMarketplaceOpen] = useState(false);
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
  const messages = agent ? (convs[agent.id] ?? seedMessages(agent)) : [];

  const saveAgent = (patch: Partial<Agent>) => {
    if (!agent) return;
    setAgents((prev) => prev.map((a) => (a.id === agent.id ? { ...a, ...patch } : a)));
  };

  const addAgent = (added: Agent) => {
    setAgents((prev) => (prev.some((a) => a.id === added.id) ? prev : [...prev, added]));
    setConvs((prev) => (prev[added.id] ? prev : { ...prev, [added.id]: seedMessages(added) }));
    setSelectedId(added.id);
    setEditorOpen(false);
    setMarketplaceOpen(false);
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
    if (!agent) return;
    setConvs((prev) => ({ ...prev, [agent.id]: [] }));
  };

  const submit = () => {
    const text = input.trim();
    if (!text || !agent) return;
    const userMsg: ChatMsg = { id: nextId.current++, role: "user", text };
    setConvs((prev) => ({ ...prev, [agent.id]: [...(prev[agent.id] ?? []), userMsg] }));
    setInput("");
    /* Per-agent follow-ups, cycling — the seeded first exchange is verbatim
       from the original page; later replies come from this agent's voice. */
    const followUps = FOLLOW_UPS[agent.id] ?? [genericFollowUp(agent)];
    const idx = replyIdx.current[agent.id] ?? 0;
    replyIdx.current[agent.id] = idx + 1;
    const replyText = followUps[idx % followUps.length];
    window.setTimeout(() => {
      const reply: ChatMsg = { id: nextId.current++, role: "agent", text: replyText };
      setConvs((prev) => ({ ...prev, [agent.id]: [...(prev[agent.id] ?? []), reply] }));
    }, 700);
  };

  return (
    <div className="flex h-dvh min-h-0 overflow-hidden bg-background-full p-3 text-text-primary">
      <style>{`@keyframes bui-blink{0%,91%,100%{transform:scaleY(1)}94%,96%{transform:scaleY(.08)}}.bui-blink-l{animation:bui-blink 4.4s infinite;transform-box:fill-box;transform-origin:center}.bui-blink-r{animation:bui-blink 5.3s infinite;transform-box:fill-box;transform-origin:center}@keyframes bui-wander-l{0%,100%{transform:translate(0,0)}25%{transform:translate(2px,1px)}50%{transform:translate(-2px,0)}75%{transform:translate(1px,-1px)}}@keyframes bui-wander-r{0%,100%{transform:translate(0,0)}30%{transform:translate(-2px,1px)}55%{transform:translate(1.5px,-1px)}80%{transform:translate(-1px,1px)}}.bui-wander-l{animation:bui-wander-l 7s ease-in-out infinite}.bui-wander-r{animation:bui-wander-r 8.5s ease-in-out infinite;animation-delay:-2.3s}@keyframes bui-morph{from{transform:scale(.93);opacity:.55}to{transform:scale(1);opacity:1}}.bui-morph{animation:bui-morph .32s ease-out;transform-box:fill-box;transform-origin:center}@media (prefers-reduced-motion:reduce){.bui-blink-l,.bui-blink-r,.bui-wander-l,.bui-wander-r,.bui-morph{animation:none!important}}`}</style>
      <Sidebar
        selectedId={selectedId}
        onSelect={(id) => {
          setSelectedId(id);
          setEditorOpen(false);
        }}
        searchOpen={searchOpen}
        setSearchOpen={setSearchOpen}
        agents={agents}
        onOpenMarketplace={() => setMarketplaceOpen(true)}
      />
      <main
        aria-label="Agent conversation"
        className="flex min-h-0 min-w-0 flex-1 flex-col rounded-3xl bg-background-secondary-default"
      >
        <ChatMain
          agent={agent}
          messages={messages}
          groupName={groupName}
          onOpenEditor={() => setEditorOpen(true)}
          onRename={renameCurrent}
          onDelete={deleteCurrent}
          onClear={clearCurrent}
        />
        <Composer value={input} onValueChange={setInput} onSubmit={submit} />
      </main>
      {editorOpen && agent && (
        <AgentEditor
          agent={agent}
          agents={agents}
          onSave={saveAgent}
          onClose={() => setEditorOpen(false)}
        />
      )}
      <SettingsModal
        isOpen={marketplaceOpen}
        onClose={() => setMarketplaceOpen(false)}
        defaultPage="marketplace"
        planArtSrc="/templates/settings-plan-art.png"
        marketplace={<MarketplacePane agents={agents} onAdd={addAgent} />}
      />
    </div>
  );
}
