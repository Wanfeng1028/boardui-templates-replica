"use client";

import {
  RiAddLine,
  RiArrowDownSLine,
  RiArrowRightSLine,
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
/* Avatar data — the original draws its "paper face" on canvas; here  */
/* it is rebuilt in SVG/CSS, behaviour-aligned, not pixel 1:1. The 16 */
/* expression names, 9 shape names and 9 radial gradients are        */
/* verbatim from the original. Per-agent defaults below are measured  */
/* from the live original (boardui-verify/mac-fix/orig-probe3.json +  */
/* orig-probe4.json, 2026-11-08): sidebar pastel fills, editor       */
/* description/name/label, pressed expression dot, selected shape     */
/* (aria-selected) and pressed colour dot (only Security has one —    */
/* Teal; the other six use custom pastel fills, no named colour).     */
/* The shape silhouettes themselves are our own reading of the        */
/* original's canvas shapes from screenshots — no vector data        */
/* survives for them.                                                 */
/* ------------------------------------------------------------------ */
/* ------------------------------------------------------------------ */

type AvatarShape =
  | "star" | "heart" | "cloud" | "diamond" | "shield"
  | "slender" | "pocket" | "petal" | "flower";

type AvatarExpression =
  | "Neutral" | "Happy" | "Angry" | "Thinking" | "Shook" | "Curious"
  | "Wink" | "Sleepy" | "Sad" | "Worried" | "Skeptical" | "Focused"
  | "Excited" | "Calm" | "Shy" | "Confused";

/** The original's 9 named colours (radial-gradient, closest-side circle
    at 50% 50%). The editor's colour dots use these verbatim
    (orig-probe4: Blue #437EF7→#004DE9, Teal #27b5a2→#00957c, Violet
    #8554F6→#3E00CD, Pink #E34798→#D3006D, Red #E74241→#CF0100, Orange
    #f47327→#d83f00, Cyan #1bb4ce→#0093ad, Lime #88c81c→#6aa400, Green
    #36c15c→#009f13). Agent.body, by contrast, is the pastel fill the
    original's canvas actually paints. */
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

/** Pastel fill for a named colour, as the original's canvas renders it:
    the named colour lightened towards white. Teal #27b5a2 lightened
    this way lands within a few units of the original's Security fill
    #B3E4E5, so picking a named colour in the editor keeps the pastel
    look instead of going vivid. */
function pastelOf(hex: string): string {
  const n = parseInt(hex.slice(1), 16);
  const mix = (c: number) => Math.round(c + (255 - c) * 0.65);
  const r = mix((n >> 16) & 255);
  const g = mix((n >> 8) & 255);
  const b = mix(n & 255);
  return `#${((r << 16) | (g << 8) | b).toString(16).padStart(6, "0")}`;
}

/** Deeper shade of a pastel fill, for the gradient edge and the
    right-side fold shadow: the pastel pulled 40% back towards its
    named colour (or towards a neutral deep tone for custom pastels). */
function deepOf(pastel: string, vivid?: string): string {
  const p = parseInt(pastel.slice(1), 16);
  const v = vivid ? parseInt(vivid.slice(1), 16) : 0x5a7d84;
  const mix = (pc: number, vc: number) => Math.round(pc + (vc - pc) * 0.4);
  const r = mix((p >> 16) & 255, (v >> 16) & 255);
  const g = mix((p >> 8) & 255, (v >> 8) & 255);
  const b = mix(p & 255, v & 255);
  return `#${((r << 16) | (g << 8) | b).toString(16).padStart(6, "0")}`;
}

const AVATAR_SHAPES: AvatarShape[] = [
  "star", "heart", "cloud", "diamond", "shield",
  "slender", "pocket", "petal", "flower",
];

/** The original's shape chips sit on a fixed elliptical arc around the
    editor avatar (measured live, orig-shapes-hyd.json): 9 chips of
    56×56, left-to-right along the arc, the agent's selected shape at
    index 4 (bottom centre, page [1228,347]). Positions below are
    relative to the avatar area (its left edge sits 8px inside the
    editor section, so the first chip is clipped invisible, the second
    shows a 9px edge, and the last two run past the panel's right
    edge — exactly as on the original). */
const SHAPE_RING_POS: { left: number; top: number }[] = [
  { left: -73, top: 120 },
  { left: -47, top: 186 },
  { left: 0, top: 239 },
  { left: 62, top: 274 },
  { left: 132, top: 286 },
  { left: 202, top: 274 },
  { left: 264, top: 239 },
  { left: 311, top: 186 },
  { left: 337, top: 120 },
];

/** Ring order for an agent: the 9 shapes rotated so the agent's shape
    lands at arc index 4 (bottom centre). */
function ringOrder(selected: AvatarShape): AvatarShape[] {
  const start = (AVATAR_SHAPES.indexOf(selected) - 4 + AVATAR_SHAPES.length) % AVATAR_SHAPES.length;
  return AVATAR_SHAPES.map((_, i) => AVATAR_SHAPES[(start + i) % AVATAR_SHAPES.length]);
}

/** Face silhouettes on a 0 0 40 40 viewBox. Star is a 5-point star,
    diamond a rhombus, slender a plump blob, pocket a rounded square —
    all read off the original's sidebar/editor screenshots; heart /
    cloud / shield / petal / flower follow the original's shape names
    (no vector data survives). */
const SHAPE_PATHS: Record<AvatarShape, string> = {
  star: "M20 2.2l4.7 9.9 10.8 1.4-7.9 7.4 2 10.7L20 26.4l-9.6 5.2 2-10.7-7.9-7.4 10.8-1.4L20 2.2Z",
  heart: "M20 36.5C10 29 3.5 22 3.5 14.5 3.5 9.5 7.5 6 12 6c3.2 0 6 1.8 8 4.5C22 7.8 24.8 6 28 6c4.5 0 8.5 3.5 8.5 8.5 0 7.5-6.5 14.5-16.5 22Z",
  cloud: "M13.5 34.5c-4.5 0-8-3.2-8-7.4 0-3.6 2.5-6.6 6-7.3.9-4.6 5-8.3 10-8.3 4.4 0 8.1 2.8 9.4 6.8 3.6.7 6.1 3.7 6.1 7.3 0 4.2-3.6 7.4-8.5 7.4H13.5Z",
  diamond: "M20 3.5L35.5 20 20 36.5 4.5 20 20 3.5Z",
  shield: "M20 2.5c8.5 0 15 6 15 14.5 0 9.5-6.5 18-15 20.5C11.5 35 5 26.5 5 17 5 8.5 11.5 2.5 20 2.5Z",
  slender: "M20 3.5c7.5 0 9.8 2.2 12.6 5.7C35.5 13 36 16.8 36 20s-.5 7-3.4 10.8C29.8 34.3 27.5 36.5 20 36.5S10.2 34.3 7.4 30.8C4.5 27 4 23 4 20s.5-7 3.4-10.8C10.2 5.7 12.5 3.5 20 3.5Z",
  pocket: "M10 4h20a6 6 0 0 1 6 6v20a6 6 0 0 1-6 6H10a6 6 0 0 1-6-6V10a6 6 0 0 1 6-6Z",
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
  /** Sidebar list intro: the agent's first reply paragraph, verbatim
      from the original (orig-lw-conv-*.json). */
  intro: string;
  /** Pastel fill the original's canvas paints (measured live). */
  body: string;
  /** Deeper shade of `body`: gradient edge + right-side fold shadow. */
  deep: string;
  /** Named colour pressed in the editor, if any — only Security has one
      (Teal, orig-probe4); the rest use custom pastel fills. */
  colorId?: string;
  shape: AvatarShape;
  /** Pressed expression dot in the editor (measured live). */
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
    desc: "Thoughtful layouts, clear hierarchy, and a little personality for your next landing page.",
    intro: "Give the hero one clear action. Lead with the outcome, pair it with a focused product preview, and move the secondary links below the fold.",
    body: "#B9DFD0",
    deep: "#8EC7AE",
    shape: "slender",
    expression: "Curious",
    userMsg: "How can we make the landing page feel clearer?",
    replyP1:
      "Give the hero one clear action. Lead with the outcome, pair it with a focused product preview, and move the secondary links below the fold.",
    replyP2:
      "For the next section, show three concrete benefits with short examples. That creates a natural path from understanding the product to trying it.",
  },
  {
    id: "reviewer",
    name: "content reviewer",
    label: "Writing",
    desc: "Makes your writing clear, concise, and unmistakably yours.",
    intro: "The shorter opening feels more welcoming. Start with a quick thank-you, explain the first useful step, and keep the main button close to that instruction.",
    body: "#EBC7AD",
    deep: "#DCA87E",
    shape: "pocket",
    expression: "Thinking",
    userMsg: "Can you help tighten our welcome email?",
    replyP1:
      "The shorter opening feels more welcoming. Start with a quick thank-you, explain the first useful step, and keep the main button close to that instruction.",
    replyP2:
      "Save the feature tour for a follow-up. A new customer should leave this email knowing exactly where to begin.",
  },
  {
    id: "marketing",
    name: "marketing bot",
    label: "Marketing",
    desc: "Turns a good idea into a campaign people remember.",
    intro: "Lead with the problem your audience recognizes. Build the campaign around one before-and-after story, then adapt it for email, social, and the launch page.",
    body: "#B4E4E3",
    deep: "#87CFCD",
    shape: "star",
    expression: "Happy",
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
    desc: "Helps the right people discover your work through search.",
    intro: "Start with a practical guide to the core topic. Support it with focused articles that answer the next questions readers are likely to ask.",
    body: "#B9ABED",
    deep: "#9A86E2",
    shape: "flower",
    expression: "Neutral",
    userMsg: "Help me plan a useful topic cluster for our blog.",
    replyP1:
      "Start with a practical guide to the core topic. Support it with focused articles that answer the next questions readers are likely to ask.",
    replyP2:
      "Link each article back to the guide and to one related next step. Clear titles and useful examples will make the structure easier for people to navigate.",
  },
  {
    id: "research",
    name: "research assistant",
    label: "Research",
    desc: "Connects the dots, asks better questions, and brings the evidence.",
    intro: "Ask about the last time the problem happened. Have customers walk through what they tried, where they got stuck, and what a good result would have looked like.",
    body: "#F5DEA3",
    deep: "#EACB77",
    shape: "petal",
    expression: "Thinking",
    userMsg: "How should we prepare for customer interviews?",
    replyP1:
      "Ask about the last time the problem happened. Have customers walk through what they tried, where they got stuck, and what a good result would have looked like.",
    replyP2:
      "Keep the first five interviews focused on the same questions. Compare the patterns afterward before deciding which assumption to test next.",
  },
  {
    id: "security",
    name: "Security agent",
    label: "Security",
    desc: "A careful second pair of eyes for permissions, privacy, and application security.",
    intro: "Review access permissions before inviting testers. Confirm that every request checks the current user’s access and that one account cannot read another account’s data.",
    body: "#B3E4E5",
    deep: "#85CCD3",
    colorId: "teal",
    shape: "shield",
    expression: "Neutral",
    userMsg: "What should we check before sharing the beta?",
    replyP1:
      "Review access permissions before inviting testers. Confirm that every request checks the current user’s access and that one account cannot read another account’s data.",
    replyP2:
      "Then check the password-reset flow, uploaded files, and sensitive information in logs. Keep a short checklist so the same checks run before each release.",
  },
  {
    id: "cloud",
    name: "Cloud engineer",
    label: "Cloud",
    desc: "Helps with server architecture, cloud infrastructure, deployments, and reliable services.",
    intro: "Give staging its own environment and data. Match the production configuration closely, while keeping credentials, storage, and deployment permissions separate.",
    body: "#F3BCA5",
    deep: "#E89B78",
    shape: "cloud",
    expression: "Thinking",
    userMsg: "How should we approach our staging deployment?",
    replyP1:
      "Give staging its own environment and data. Match the production configuration closely, while keeping credentials, storage, and deployment permissions separate.",
    replyP2:
      "Add a health check and a simple rollback path before automating releases. Then use a small deployment to verify logs, startup behavior, and connectivity.",
  },
];
/** The original's sidebar starts with NO group chat: groups only exist
    once created through "…" → Start a group chat → picker
    (orig-group-via-menu.json). The picker lists the 7 sidebar agents
    plus three more the original knows (Product planner, Support guide,
    Data analyst) — their pastel fills + shapes below were measured live
    from the original's picker (probe-picker-avatars.json + screenshot:
    planner = blue diamond, support = green heart, analyst = blue
    rounded square "pocket"). */
type PickerMember = { id: string; name: string; body: string; deep: string; shape: AvatarShape };
const PICKER_EXTRA: PickerMember[] = [
  { id: "planner", name: "Product planner", body: "#91B6EB", deep: "#7492BC", shape: "diamond" },
  { id: "support-guide", name: "Support guide", body: "#A6E0B5", deep: "#85B391", shape: "heart" },
  { id: "analyst", name: "Data analyst", body: "#9CC8E8", deep: "#7DA0BA", shape: "pocket" },
];

/** A group created from the picker. `members` are in pick order; the
    name joins each member's first name-word capitalised with " + "
    (orig: Cloud engineer + marketing bot + Product planner →
    "Cloud + Marketing + Product", orig-group-start.json). */
type GroupChat = {
  id: string;
  name: string;
  members: PickerMember[];
};

/** Sidebar subtitle of a created group (orig-group-start.json). */
const GROUP_DESC = "Start a conversation";

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
  bold = false,
}: {
  cx: number;
  style: EyeStyle;
  lookX: number;
  lookY: number;
  blinkClass: string | null;
  wanderClass: string | null;
  blinkDelay: string;
  /** Thicker strokes for the editor wheel glyphs (measured: the
      original's wheel faces are drawn bold). */
  bold?: boolean;
}) {
  const sw = bold ? 2.4 : 1.8;
  const cy = 17.5 + lookY;
  const x = cx + (style === "side" ? lookX : 0);
  if (style === "closed") {
    return (
      <path
        d={`M${cx - 2.2} 17.5h4.4`}
        stroke="#262626"
        strokeWidth={sw}
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
        strokeWidth={sw}
        fill="none"
        strokeLinecap="round"
      />
    );
  }
  const ry = (style === "wide" ? 4.1 : style === "narrow" ? 2.2 : style === "half" ? 2.1 : 3.3) + (bold ? 0.4 : 0);
  const rx = (style === "wide" ? 2.9 : 2.3) + (bold ? 0.4 : 0);
  const eye = (
    <g>
      {/* No white highlight: the original's eyes are solid black pills. */}
      <ellipse cx={x} cy={cy} rx={rx} ry={ry} fill="#262626" />
      {style === "half" && (
        <path
          d={`M${x - 2.4} ${cy - 1.6}h4.8`}
          stroke="#262626"
          strokeWidth={bold ? 2 : 1.4}
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
  agent: Pick<Agent, "body" | "deep" | "shape" | "name"> & { expression?: AvatarExpression };
  size?: number;
  blinkDelay?: string;
  className?: string;
}) {
  const rawId = useId().replace(/:/g, "");
  const expr = EXPRESSIONS[agent.expression ?? "Neutral"] ?? EXPRESSIONS.Neutral;
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
        {/* Pastel fill: light at upper-left, deeper at the edge — the
            original's radial gradient, measured off its sidebar faces. */}
        <radialGradient id={gid} cx="42%" cy="38%" r="75%">
          <stop offset="0%" stopColor={agent.body} />
          <stop offset="100%" stopColor={agent.deep} />
        </radialGradient>
        <clipPath id={cid}>
          <path d={d} />
        </clipPath>
      </defs>
      {/* Shape morph: keyed remount replays a short scale/fade so a shape
          change reads as a morph, not a hard cut. The intermediate frames
          are our own easing, not the original canvas morph. */}
      <g key={agent.shape} className="bui-morph">
        <path d={d} fill={`url(#${gid})`} />
        <g clipPath={`url(#${cid})`}>
          {/* Fold shadow: a deeper band down the right side, as on the
              original's large editor face and sidebar faces. */}
          <path d="M31 2C37.5 10 37.5 30 31 38L38 38 38 2Z" fill={agent.deep} opacity="0.45" />
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
      {/* No mouth: the original's avatars — sidebar and the large editor
          face — show eyes only. Mouths survive only on the wheel glyphs
          (MiniFace below). */}
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
      <AvatarEye cx={14} style={expr.leftEye} lookX={lookX} lookY={lookY} blinkClass={null} wanderClass={null} blinkDelay="0s" bold />
      <AvatarEye cx={26} style={expr.rightEye} lookX={lookX} lookY={lookY} blinkClass={null} wanderClass={null} blinkDelay="0s" bold />
      {expr.brows && (
        <path d={expr.brows} stroke="#262626" strokeWidth="2.1" fill="none" strokeLinecap="round" />
      )}
      {expr.mouthFill ? (
        <path d={expr.mouth} fill="#262626" />
      ) : (
        <path d={expr.mouth} stroke="#262626" strokeWidth="2.4" fill="none" strokeLinecap="round" />
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
  groups,
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
  /** Groups created from the picker (the original starts with none). */
  groups: GroupChat[];
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
  const visibleGroups = groups.filter(
    (g) => !q || g.name.toLowerCase().includes(q) || GROUP_DESC.toLowerCase().includes(q),
  );
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
            {/* Group chats (first items) — only groups the user created
                from the picker; the original starts with none. */}
            {visibleGroups.map((group) => (
              <button
                key={group.id}
                type="button"
                onClick={() => onSelect(group.id)}
                aria-current={selectedId === group.id ? "page" : undefined}
                className={cx(
                  "flex h-[54px] shrink-0 items-center gap-2.5 rounded-xl p-1.5 text-start outline-none transition-colors focus-visible:ring-2 focus-visible:ring-border-focus-ring",
                  selectedId === group.id
                    ? "bg-background-tertiary-default"
                    : "hover:bg-background-secondary-hover",
                )}
              >
                <span className="flex shrink-0 items-center">
                  {group.members.slice(0, 3).map((m, i) => (
                    <AgentAvatar
                      key={m.id}
                      agent={m}
                      size={22}
                      className={i > 0 ? "-ms-2" : undefined}
                    />
                  ))}
                </span>
                <span className="flex min-w-0 flex-1 flex-col gap-0.5">
                  <span title={group.name} className="truncate text-body-medium text-text-primary">{group.name}</span>
                  <span className="truncate text-body-regular text-text-tertiary">{GROUP_DESC}</span>
                </span>
              </button>
            ))}
            {visibleAgents.map((agent, i) => {
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
                    <span title={agent.intro} className="truncate text-body-regular text-text-tertiary">{agent.intro}</span>
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
          and the agent name — cross-fading while a reply generates: the
          "Thinking…" layer is in the DOM after every reply (it shows in
          the original's body text) and only becomes visible while a
          reply is being generated. Clicking it opens the agent editor,
          like the header pill. */}
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
          <span
            className={cx(
              "col-start-1 row-start-1 transition-opacity duration-200",
              thinking ? "opacity-100" : "opacity-0",
            )}
          >
            Thinking…
          </span>
          <span
            className={cx(
              "col-start-1 row-start-1 transition-opacity duration-200",
              thinking ? "opacity-0" : "opacity-100",
            )}
          >
            {agent.name}
          </span>
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

function GroupEmptyState({ members }: { members: PickerMember[] }) {
  const shown = members.slice(0, 3);
  return (
    <div className="flex h-full flex-col items-center justify-center px-6 py-10 text-center">
      <div className="relative mb-5 flex h-16 items-end justify-center">
        {shown.map((m, i) => (
          <AgentAvatar
            key={m.id}
            agent={m}
            size={40}
            className={cx(
              "relative",
              i === 1 ? "z-[2] -mt-3" : "z-[1]",
              i === 0 && shown.length > 1 ? "-me-2" : undefined,
              i === 2 ? "-ms-2" : undefined,
            )}
          />
        ))}
      </div>
      <p className="text-title-2-medium text-text-primary">A few minds. One conversation.</p>
      <p className="mt-2 max-w-md text-body-regular text-text-secondary">
        {members.map((m) => m.name).join(", ")} are here. Send a message to get
        everyone&rsquo;s perspective.
      </p>
    </div>
  );
}

function ChatMain({
  agent,
  agents,
  messages,
  group,
  thinking,
  onOpenEditor,
  onOpenMobileNav,
  onOpenGroupPicker,
}: {
  agent: Agent | null;
  agents: Agent[];
  messages: ChatMsg[];
  group: GroupChat | null;
  /** A reply is being generated — the latest agent message shows Thinking…. */
  thinking: boolean;
  /** Opens the editor; with an id, selects that agent first (group replies). */
  onOpenEditor: (agentId?: string) => void;
  onOpenMobileNav: () => void;
  /** Opens the "Chat with your agents" group picker. */
  onOpenGroupPicker: () => void;
}) {
  const [copied, setCopied] = useState(false);
  const [copiedResponseId, setCopiedResponseId] = useState<number | null>(null);
  const [feedback, setFeedback] = useState<Record<number, "helpful" | "unhelpful" | null>>({});
  const [menuOpen, setMenuOpen] = useState(false);
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
        {agent ? (
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
            </button>
          </div>
        ) : (
          <div className="flex min-w-0 flex-1 items-center gap-2">
            {group && (
              <span className="flex shrink-0 items-center">
                {group.members.slice(0, 3).map((m, i) => (
                  <AgentAvatar
                    key={m.id}
                    agent={m}
                    size={20}
                    className={i > 0 ? "-ms-2" : undefined}
                  />
                ))}
              </span>
            )}
            <span className="truncate text-body-2-medium text-text-secondary">{group?.name ?? ""}</span>
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
            offset={9}
            crossOffset={-5}
            className="w-[256px] overflow-x-hidden p-[6px]"
          >
            {/* Measured live (orig-convopts-lw.json): a 256×98 dialog at
                [799,57] with the section label "In this conversation",
                "Edit <agent>" and "Start a group chat". */}
            <DropdownGroup label="In this conversation" className="gap-1 pt-0">
              {agent ? (
                <DropdownItem
                  onSelect={() => {
                    setMenuOpen(false);
                    handleOpenEditor();
                  }}
                  className="px-2 py-1"
                >
                  <span className="min-w-0 truncate text-body-medium whitespace-nowrap text-text-primary">
                    Edit {agent.name}
                  </span>
                </DropdownItem>
              ) : null}
            </DropdownGroup>
            <DropdownGroup>
              <DropdownItem
                onSelect={() => {
                  setMenuOpen(false);
                  onOpenGroupPicker();
                }}
                className="px-2 py-1"
              >
                <span className="min-w-0 truncate text-body-medium whitespace-nowrap text-text-primary">
                  Start a group chat
                </span>
              </DropdownItem>
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
            <GroupEmptyState members={group?.members ?? []} />
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
/* Add menu — measured from the live original (orig-menu-rect.json):  */
/* a 361×346 dialog titled "Add" above the composer at [302,484],     */
/* 16px radius, 7 items in 2 groups ("Add" / "Plugins"), icon + bold  */
/* title + grey description on one line per row, NO dash between      */
/* title and description. The trigger's aria-label is "Add           */
/* attachment"; the original's DOM contains no "Add to chat" text.    */
/* Grey line icons for Add, coloured solid tiles with white icons    */
/* for Plugins.                                                       */
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
              <div className="relative flex min-w-0 shrink-0 items-center gap-2">
                {/* Add — measured from the live original: a 361×346 "Add"
                    dialog floating above the composer, its bottom edge
                    8px above this bottom row's top edge (menu bottom
                    830, row top 838) and its left edge aligned with
                    this row's left edge (302). A trigger-anchored
                    Popover cannot sit there (it would hang off the
                    button, inside the composer), so the panel is
                    absolutely positioned against this relative row
                    instead, reusing the BoardUI menu surface and
                    DropdownGroup / DropdownItem rows. While open the
                    trigger is a black "×"; clicking it closes the menu. */}
                <button
                  ref={addTriggerRef}
                  type="button"
                  aria-label="Add attachment"
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
                    aria-label="Add"
                    className={cx(
                      "bui-add-menu absolute bottom-[calc(100%+8px)] left-0 z-50 w-[361px] max-w-[calc(100vw-32px)]",
                      MENU_POPOVER_SURFACE,
                      "rounded-[16px] p-2",
                    )}
                  >
                    <div className="flex flex-col gap-1 outline-none">
                      {ADD_MENU_GROUPS.map((group) => (
                        <DropdownGroup key={group.label} label={group.label} className="pt-0">
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
                                    {item.desc}
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
                {/* Permission — measured live (orig-probe2): a 110×30 chip
                    showing only the mode ("Bypass all"); "Permission: "
                    lives in the aria-label only. The menu items are the
                    standard modes. */}
                <Dropdown>
                  <DropdownTrigger
                    aria-label={`Permission: ${permission}`}
                    className="flex h-[30px] w-[110px] shrink-0 cursor-pointer items-center justify-center gap-1 whitespace-nowrap rounded-full px-2 outline-none transition-colors duration-150 ease hover:bg-background-tertiary-default focus-visible:ring-2 focus-visible:ring-border-focus-ring"
                  >
                    <RiShieldLine className="size-4 shrink-0 text-foreground-icon-secondary" aria-hidden />
                    <span className="whitespace-nowrap text-body-medium text-text-secondary">
                      {permission}
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
              <div className="flex shrink-0 items-center gap-2">
                {/* Model — a real dropdown, but with only the one model the
                    snapshot shows ("Fable 5"). The old "Fable 4" toggle
                    option was invented and is gone; the original's other
                    options are not in the snapshot. */}
                <Dropdown>
                  <DropdownTrigger
                    aria-label="Model"
                    className="flex h-[32px] w-[87px] shrink-0 cursor-pointer items-center justify-center rounded-full text-body-medium text-text-secondary outline-none hover:bg-background-tertiary-default focus-visible:ring-2 focus-visible:ring-border-focus-ring"
                  >
                    <span className="whitespace-nowrap text-body-medium text-text-secondary">Fable 5</span>
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
  /** Persists an edit immediately — the original has no Save button at
      all (orig-probe3/4: savePresent false); edits apply live. */
  onSave: (patch: Partial<Agent>) => void;
  onClose: () => void;
}) {
  // Language codes match the original's native select: "" + auto/en/tr/es/
  // fr/de/ja/pt. Voice is disabled in the original (Off / System voice).
  const [language, setLanguage] = useState("auto");
  const [voice, setVoice] = useState("system");
  const [speed, setSpeed] = useState("1");
  const [previewing, setPreviewing] = useState(false);
  const [voiceToast, setVoiceToast] = useState<string | null>(null);
  const [notify, setNotify] = useState(true);
  const [customColor, setCustomColor] = useState(agent.body);
  const [dragOver, setDragOver] = useState(false);
  const colorInputRef = useRef<HTMLInputElement>(null);
  const rootRef = useRef<HTMLElement>(null);

  /* Derived from the agent record (the editor is fully controlled — every
     change below calls onSave at once, so the sidebar and chat update
     live, exactly like the original). */
  const expression = agent.expression ?? "Neutral";
  const colorIdx = agent.colorId
    ? AVATAR_COLORS.findIndex((c) => c.id === agent.colorId)
    : -1;

  /* Escape closes the editor only when the keypress targets the editor
     itself (or nothing focusable, i.e. body). A menu, picker or modal
     open on top handles its own Escape — without this guard the editor
     closed behind the "…" menu whenever Escape dismissed the menu. */
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== "Escape") return;
      const t = e.target as Node | null;
      if (t === document.body || (rootRef.current && t && rootRef.current.contains(t))) onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

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
      `Hi, I'm ${agent.name}. ${agent.desc}`,
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

  /** Picking a named colour paints its pastel (pastelOf), like the
      original's canvas; a custom colour applies as picked. */
  const pickColor = (i: number) => {
    const c = AVATAR_COLORS[i];
    const pastel = pastelOf(c.from);
    onSave({ body: pastel, deep: deepOf(pastel, c.from), colorId: c.id });
  };
  const pickCustomColor = (hex: string) => {
    setCustomColor(hex);
    onSave({ body: hex, deep: deepOf(hex), colorId: undefined });
  };

  return (
    <section
      ref={rootRef}
      aria-label="Agent editor"
      className="flex h-full min-h-0 flex-col bg-background-full ps-1 pe-2 max-lg:fixed max-lg:inset-y-2 max-lg:right-2 max-lg:z-40 max-lg:h-auto max-lg:w-[340px] max-lg:max-w-[calc(100vw-16px)] max-lg:rounded-3xl max-lg:shadow-sidebar lg:ms-4 lg:w-[340px] lg:shrink-0"
    >
      <div className="flex min-h-0 flex-1 flex-col overflow-x-hidden overflow-y-auto ps-1 [scrollbar-width:none]">
        <div className="flex shrink-0 items-center justify-between pb-3 pt-3">
          <p className="min-w-0 flex-1 truncate text-center text-title-3-semibold text-text-primary lg:text-start">{agent.name}</p>
          <button
            type="button"
            aria-label="Close agent editor"
            onClick={onClose}
            className="flex size-5 shrink-0 cursor-pointer items-center justify-center rounded-full text-foreground-icon-secondary outline-none transition-colors hover:bg-background-tertiary-default focus-visible:ring-2 focus-visible:ring-border-focus-ring"
          >
            <RiCloseLine className="size-5" aria-hidden />
          </button>
        </div>

        {/* Avatar: the original's 360px region — a 268px emotion ring of 16
            dots around a large central avatar, with the 9 shape chips on
            an elliptical arc around it (SHAPE_RING_POS, measured live).
            Each dot is a 34px circle in the agent's pastel colour holding
            the expression face (MiniFace, from the EXPRESSIONS table);
            the selected dot's ring is dark grey, not blue. There is no
            "Expression: …" caption anywhere on the original. Shapes can
            also be dragged from the arc onto the central preview. */}
        <div className="relative h-[360px] w-[calc(100%+8px)] shrink-0 overflow-hidden">
          <div role="listbox" aria-label="Agent shape" className="absolute inset-0">
            {ringOrder(agent.shape).map((sh, i) => {
              const cap = sh[0].toUpperCase() + sh.slice(1);
              const selectedShape = agent.shape === sh;
              const pos = SHAPE_RING_POS[i];
              return (
                <button
                  key={sh}
                  type="button"
                  role="option"
                  aria-selected={selectedShape}
                  aria-label={`${cap} shape`}
                  title={`${cap} shape — drag onto the preview to apply`}
                  draggable
                  onDragStart={(e) => {
                    e.dataTransfer.setData("text/plain", sh);
                    e.dataTransfer.effectAllowed = "copy";
                  }}
                  onClick={() => onSave({ shape: sh })}
                  className={cx(
                    "absolute flex size-14 cursor-grab items-center justify-center rounded-2xl outline-none transition-colors hover:bg-background-secondary-default focus-visible:ring-2 focus-visible:ring-border-focus-ring active:cursor-grabbing",
                    selectedShape
                      ? "bg-background-secondary-default ring-1 ring-border-button-default"
                      : "bg-transparent",
                  )}
                  style={{ left: pos.left, top: pos.top }}
                >
                  {/* Pure silhouette in the agent's pastel: the original's
                      shape chips hold a 56px canvas silhouette, no name. */}
                  <svg viewBox="0 0 40 40" width={40} height={40} aria-hidden="true" className="block" style={{ color: agent.body }}>
                    <path d={SHAPE_PATHS[sh]} fill="currentColor" />
                  </svg>
                </button>
              );
            })}
          </div>
          <div className="pointer-events-none absolute left-1/2 top-[18px] z-10 -translate-x-1/2">
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
                      onClick={() => onSave({ expression: e })}
                      className={cx(
                        "pointer-events-auto flex size-[34px] cursor-pointer items-center justify-center overflow-hidden rounded-full border-2 outline-none transition-[border-color,box-shadow] hover:ring-2 hover:ring-border-button-hover focus-visible:ring-2 focus-visible:ring-border-focus-ring",
                        expression === e
                          ? "border-foreground-icon-secondary"
                          : "border-transparent",
                      )}
                      style={{ backgroundColor: agent.body }}
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
              "absolute left-1/2 top-[152px] z-0 -translate-x-1/2 -translate-y-1/2 rounded-full outline-none transition-shadow",
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
                onSave({ shape });
              }
            }}
          >
            <AgentAvatar agent={agent} size={150} />
          </div>
        </div>

        {/* Colour dots (26px, measured live): the 9 named colours plus a
            custom-colour rainbow dot. Only Security has a named colour
            pressed (Teal); the rest sit on the custom dot. */}
        <div className="flex shrink-0 flex-col items-center gap-3 pb-1 pt-1">
          <div className="flex items-center gap-1.5">
            {AVATAR_COLORS.map((c, i) => (
              <button
                key={c.id}
                type="button"
                aria-label={`${c.label} avatar`}
                title={c.id}
                aria-pressed={i === colorIdx}
                onClick={() => pickColor(i)}
                className={cx(
                  "size-[26px] cursor-pointer rounded-full outline-none transition-transform focus-visible:ring-2 focus-visible:ring-border-focus-ring",
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
                "flex size-[26px] cursor-pointer items-center justify-center rounded-full outline-none transition-transform hover:scale-110 focus-visible:ring-2 focus-visible:ring-border-focus-ring",
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
              onChange={(e) => pickCustomColor(e.target.value)}
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
                value={agent.name}
                onChange={(e) => onSave({ name: e.target.value })}
                aria-label="Agent name"
                placeholder="Michael Scott"
                maxLength={48}
                className="w-[62%] min-w-0 rounded-2lg bg-background-tertiary-default px-2.5 py-1.5 text-body-regular text-text-primary outline-none placeholder:text-text-tertiary focus-visible:ring-2 focus-visible:ring-border-focus-ring"
              />
            </label>
            <label className="flex min-h-14 items-center justify-between gap-3 border-b border-separator-border py-3">
              <span className="shrink-0 text-body-medium text-text-primary">Label</span>
              <input
                value={agent.label}
                onChange={(e) => onSave({ label: e.target.value })}
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
                value={agent.desc}
                onChange={(e) => onSave({ desc: e.target.value })}
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
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* Marketplace pane — rendered inside the SettingsModal's marketplace  */
/* page. Lists the addable agents; Add appends one to the sidebar.    */
/* ------------------------------------------------------------------ */

/* ------------------------------------------------------------------ */
/* Marketplace roster — measured live (orig-marketplace-full.json +   */
/* orig-probe2.json marketplace buttons, 2026-11-08): Discover /      */
/* Plugins / Bots / Installed tabs; "Meet your next teammate" with 4  */
/* bot cards; "Tools for your workflow" with 4 tools; "Everyday       */
/* essentials" with 4 installed tools (Added). Bot avatars reuse the */
/* template's pastel avatar palette; tool marks are simplified        */
/* redraws of the brands' marks (no logo assets for these eight live */
/* in ~/workspace/vendor-logos/).                                     */
/* ------------------------------------------------------------------ */

type MarketplaceBot = { id: string; name: string; category: string; body: string; deep: string; shape: AvatarShape };
const MARKETPLACE_BOTS: MarketplaceBot[] = [
  { id: "pitch", name: "Pitch partner", category: "Writing", body: "#EBC7AD", deep: "#DCA87E", shape: "petal" },
  { id: "meeting", name: "Meeting notes", category: "Productivity", body: "#B9DFD0", deep: "#8EC7AE", shape: "pocket" },
  { id: "launch", name: "Launch planner", category: "Marketing", body: "#B9ABED", deep: "#9A86E2", shape: "flower" },
  { id: "code", name: "Code reviewer", category: "Development", body: "#B3E4E5", deep: "#85CCD3", shape: "cloud" },
];

type MarketplaceTool = { id: string; name: string; category: string; desc: string; installed: boolean };
const MARKETPLACE_TOOLS: MarketplaceTool[] = [
  { id: "notion", name: "Notion", category: "Productivity", desc: "Bring your notes, docs, and projects together.", installed: false },
  { id: "figma", name: "Figma", category: "Design", desc: "Keep designs and conversations in sync.", installed: false },
  { id: "linear", name: "Linear", category: "Project management", desc: "Turn the next step into an issue.", installed: false },
  { id: "appwrite", name: "Appwrite", category: "Development", desc: "A little help with your application backend.", installed: false },
];
const MARKETPLACE_ESSENTIALS: MarketplaceTool[] = [
  { id: "gmail", name: "Gmail", category: "Communication", desc: "Find the important details in your inbox.", installed: true },
  { id: "gcal", name: "Google Calendar", category: "Productivity", desc: "Make a little more room in your day.", installed: true },
  { id: "gdrive", name: "Google Drive", category: "Productivity", desc: "Your files, right where you need them.", installed: true },
  { id: "slack", name: "Slack", category: "Communication", desc: "Catch up with your team’s conversations.", installed: true },
];

/** Brand marks for the eight Marketplace tools, verbatim from the
    original's rendered Marketplace (orig-tool-svgs-full.json, probed
    2026-11-08): official vendor SVGs at native viewBox, inside the
    original's 36px tile (border-separator-border,
    bg-background-secondary-default, rounded-2lg) with the icon at
    60%. Linear keeps the original's dark:invert (its mark is #222326).
    Glyphs also live in ~/workspace/vendor-logos/svg/ (Mono + Color). */
function ToolMark({ id }: { id: string }) {
  const tile =
    "flex size-9 shrink-0 items-center justify-center rounded-2lg border border-separator-border bg-background-secondary-default";
  switch (id) {
    case "notion":
      return (
        <div className={tile} aria-hidden="true">
          <svg aria-hidden="true" viewBox="0 0 256 268" className="h-[60%] w-[60%]"><path fill="#fff" d="M16.092 11.538L164.09.608c18.179-1.56 22.85-.508 34.28 7.801l47.243 33.282C253.406 47.414 256 48.975 256 55.207v182.527c0 11.439-4.155 18.205-18.696 19.24L65.44 267.378c-10.913.517-16.11-1.043-21.825-8.327L8.826 213.814C2.586 205.487 0 199.254 0 191.97V29.726c0-9.352 4.155-17.153 16.092-18.188"></path><path d="M164.09.608L16.092 11.538C4.155 12.573 0 20.374 0 29.726v162.245c0 7.284 2.585 13.516 8.826 21.843l34.789 45.237c5.715 7.284 10.912 8.844 21.825 8.327l171.864-10.404c14.532-1.035 18.696-7.801 18.696-19.24V55.207c0-5.911-2.336-7.614-9.21-12.66l-1.185-.856L198.37 8.409C186.94.1 182.27-.952 164.09.608M69.327 52.22c-14.033.945-17.216 1.159-25.186-5.323L23.876 30.778c-2.06-2.086-1.026-4.69 4.163-5.207l142.274-10.395c11.947-1.043 18.17 3.12 22.842 6.758l24.401 17.68c1.043.525 3.638 3.637.517 3.637L71.146 52.095zm-16.36 183.954V81.222c0-6.767 2.077-9.887 8.3-10.413L230.02 60.93c5.724-.517 8.31 3.12 8.31 9.879v153.917c0 6.767-1.044 12.49-10.387 13.008l-161.487 9.361c-9.343.517-13.489-2.594-13.489-10.921M212.377 89.53c1.034 4.681 0 9.362-4.681 9.897l-7.783 1.542v114.404c-6.758 3.637-12.981 5.715-18.18 5.715c-8.308 0-10.386-2.604-16.609-10.396l-50.898-80.079v77.476l16.1 3.646s0 9.362-12.989 9.362l-35.814 2.077c-1.043-2.086 0-7.284 3.63-8.318l9.351-2.595V109.823l-12.98-1.052c-1.044-4.68 1.55-11.439 8.826-11.965l38.426-2.585l52.958 81.113v-71.76l-13.498-1.552c-1.043-5.733 3.111-9.896 8.3-10.404z"></path></svg>
        </div>
      );
    case "figma":
      return (
        <div className={tile} aria-hidden="true">
          <svg aria-hidden="true" viewBox="0 0 256 384" className="h-[60%] w-[60%]"><path fill="#0acf83" d="M64 384c35.328 0 64-28.672 64-64v-64H64c-35.328 0-64 28.672-64 64s28.672 64 64 64"></path><path fill="#a259ff" d="M0 192c0-35.328 28.672-64 64-64h64v128H64c-35.328 0-64-28.672-64-64"></path><path fill="#f24e1e" d="M0 64C0 28.672 28.672 0 64 0h64v128H64C28.672 128 0 99.328 0 64"></path><path fill="#ff7262" d="M128 0h64c35.328 0 64 28.672 64 64s-28.672 64-64 64h-64z"></path><path fill="#1abcfe" d="M256 192c0 35.328-28.672 64-64 64s-64-28.672-64-64s28.672-64 64-64s64 28.672 64 64"></path></svg>
        </div>
      );
    case "linear":
      return (
        <div className={tile} aria-hidden="true">
          <svg aria-hidden="true" viewBox="0 0 256 255.999966" className="h-[60%] w-[60%] dark:invert">
    <title>Linear</title>
    <g>
        <path d="M8.17351507,102.61269 L153.38731,247.826434 C155.506492,249.945871 154.484163,253.546047 151.537796,254.096394 C146.624112,255.014493 141.611832,255.651912 136.517857,255.991749 C135.430224,256.064224 134.367944,255.654216 133.5971,254.883372 L1.11657404,122.4029 C0.345783548,121.632056 -0.0643290124,120.569776 0.0082341699,119.482143 C0.348078154,114.388168 0.985591977,109.375888 1.9035369,104.462204 C2.45395044,101.515837 6.05412868,100.493508 8.17351507,102.61269 Z M4.08163806,161.409157 C3.11270474,157.795152 7.38226007,155.515399 10.0279718,158.161111 L97.8388892,245.972054 C100.484601,248.617766 98.2048481,252.887372 94.5908433,251.918311 C50.5602697,240.113381 15.8867212,205.43973 4.08163806,161.409157 Z M16.8085843,64.1644626 C18.0417047,62.028635 20.9559826,61.7013463 22.6999089,63.4453494 L192.554651,233.299989 C194.298654,235.043992 193.971621,237.958347 191.835537,239.191441 C188.24202,241.266062 184.538382,243.171405 180.73538,244.896457 C179.304068,245.545401 177.625881,245.218112 176.514687,244.106918 L11.8930308,79.4853127 C10.7818114,78.3741189 10.4544971,76.695932 11.1036452,75.2646202 C12.828595,71.4616177 14.7338864,67.7579799 16.8085843,64.1644626 Z M127.860072,0 C198.629979,0 256,57.3702771 256,128.139928 C256,165.709238 239.831733,199.502437 214.07401,222.940712 C212.587126,224.293659 210.305837,224.204026 208.884257,222.782702 L33.2172979,47.1157434 C31.7959738,45.6941631 31.7063407,43.4128738 33.0592877,41.9259895 C56.4975633,16.1681897 90.2907616,0 127.860072,0 Z" fill="#222326"></path>
    </g>
</svg>
        </div>
      );
    case "appwrite":
      return (
        <div className={tile} aria-hidden="true">
          <svg aria-hidden="true" viewBox="0 0 256 171" className="h-[60%] w-[60%]">
    <title>Appwrite</title>
    <g>
        <path d="M128.018861,11.4976205 C140.57991,4.20943701 155.173787,0.0362230359 170.742783,0.0362230359 C217.829688,0.0362230359 256,38.206535 256,85.2934403 C256,132.380346 217.829688,170.550658 170.742783,170.550658 C155.179965,170.550658 140.591368,166.380836 128.0331,159.097776 C99.2684359,175.733361 62.1434132,174.623064 33.9508568,153.348374 C9.61305016,135.009282 -3.08589011,105.074565 0.641534125,74.8296075 C4.36895836,44.5846499 23.9559075,18.6288844 52.0181053,6.74762994 C76.8681001,-3.7736098 105.017682,-1.8412185 128.018861,11.4976205 Z M29.8152259,43.4190301 C6.68862775,74.0656663 12.7848231,117.657486 43.4314593,140.784084 C74.0780955,163.910682 117.669915,157.814487 140.796513,127.16785 C156.288306,106.638616 158.667113,80.3005602 149.337382,58.1964063 C142.483862,42.0628925 129.709538,29.0520757 113.741119,21.8909269 L113.777489,21.857143 C84.8408261,8.83821324 49.7358247,17.0208829 29.8152259,43.4190301 Z M91.355197,55.446856 C93.9640678,55.446856 94.8192633,55.5963841 94.6684236,56.0475915 C94.5946532,56.2180264 94.3796632,57.0131582 94.092073,58.1647871 L93.9809576,58.612835 C93.6953314,59.7721124 93.3534354,61.215252 93.0118103,62.7212641 C92.4587314,65.1509636 91.2595282,70.2251176 90.0256204,75.4308007 L89.8010273,76.3781785 C89.4265216,77.9576923 89.0522319,79.535299 88.6951718,81.0410726 C87.0897128,87.8157423 85.0815774,96.4490193 84.1765393,100.212142 L84.1765393,100.212142 L82.6222346,107.140274 L79.1581683,107.140274 C77.2523416,107.140274 75.6954136,106.936969 75.6954136,106.687755 C75.6954136,105.784029 77.2011873,98.9582048 79.712996,88.5699407 C81.015464,82.8983683 83.3239671,73.3128338 84.7812097,67.2398966 C85.5639113,63.8530663 86.3156087,60.7628157 86.8451929,58.6480367 L86.9515301,58.2246377 C87.312179,56.7930154 87.549446,55.8974581 87.5907629,55.7957548 C87.6891366,55.5963841 89.3969043,55.446856 91.355197,55.446856 Z M69.4729484,72.5087927 C71.7814515,72.5087927 73.6885899,72.6596324 73.6885899,72.8603147 C73.6885899,73.1108398 71.8811369,75.2212838 69.6736308,77.679315 C67.464813,80.0888151 65.65736,82.3461639 65.65736,82.6976859 C65.65736,82.9980537 67.6143411,85.4088655 69.9753102,87.9154276 L69.9753102,87.9154276 L74.290637,92.5835882 L65.1563099,92.5835882 L61.9440803,89.1719879 C60.1877816,87.3146922 58.1271803,85.0547201 57.3769168,84.1523052 L57.3769168,84.1523052 L56.0206712,82.5468463 L60.6376774,77.5271636 L65.3071496,72.5087927 Z M104.555637,72.5087927 L109.070335,77.3789472 C111.580832,80.0376608 113.587656,82.3973182 113.587656,82.6465316 C113.587656,82.9468994 111.681829,85.2593374 109.32086,87.8668966 L109.32086,87.8668966 L105.056688,92.5337455 L100.388527,92.5835882 L95.7229898,92.5835882 L99.8874769,88.0164247 C102.194668,85.5570818 104.103118,83.2000477 104.202804,82.847214 C104.353643,82.1966358 101.593933,78.8820976 97.6760359,74.9681355 C96.624093,73.9135693 95.7702092,72.9613117 95.7702092,72.8091604 C95.7702092,72.6596324 97.7271902,72.5087927 100.186533,72.5087927 L100.186533,72.5087927 L104.555637,72.5087927 Z" fill="#F02E65"></path>
    </g>
</svg>
        </div>
      );
    case "gmail":
      return (
        <div className={tile} aria-hidden="true">
          <svg aria-hidden="true" viewBox="0 0 256 193" className="h-[60%] w-[60%]">
    <g>
        <path d="M58.1818182,192.049515 L58.1818182,93.1404244 L27.5066233,65.0770089 L0,49.5040608 L0,174.59497 C0,184.253152 7.82545455,192.049515 17.4545455,192.049515 L58.1818182,192.049515 Z" fill="#4285F4"></path>
        <path d="M197.818182,192.049515 L238.545455,192.049515 C248.203636,192.049515 256,184.224061 256,174.59497 L256,49.5040608 L224.844415,67.3422767 L197.818182,93.1404244 L197.818182,192.049515 Z" fill="#34A853"></path>
        <polygon fill="#EA4335" points="58.1818182 93.1404244 54.0077618 54.4932827 58.1818182 17.5040608 128 69.8676972 197.818182 17.5040608 202.487488 52.4960089 197.818182 93.1404244 128 145.504061"></polygon>
        <path d="M197.818182,17.5040608 L197.818182,93.1404244 L256,49.5040608 L256,26.2313335 C256,4.64587897 231.36,-7.65957557 214.109091,5.28587897 L197.818182,17.5040608 Z" fill="#FBBC04"></path>
        <path d="M0,49.5040608 L26.7588051,69.5731646 L58.1818182,93.1404244 L58.1818182,17.5040608 L41.8909091,5.28587897 C24.6109091,-7.65957557 0,4.64587897 0,26.2313335 L0,49.5040608 Z" fill="#C5221F"></path>
    </g>
</svg>
        </div>
      );
    case "gcal":
      return (
        <div className={tile} aria-hidden="true">
          <svg aria-hidden="true" viewBox="0 0 256 256" className="h-[60%] w-[60%]">
    <g>
        <polygon fill="#FFFFFF" points="195.368421 60.6315789 60.6315789 60.6315789 60.6315789 195.368421 195.368421 195.368421"></polygon>
        <polygon fill="#EA4335" points="195.368421 256 256 195.368421 225.684211 190.196005 195.368421 195.368421 189.835162 223.098002"></polygon>
        <path d="M1.42108547e-14,195.368421 L1.42108547e-14,235.789474 C1.42108547e-14,246.955789 9.04421053,256 20.2105263,256 L60.6315789,256 L66.8568645,225.684211 L60.6315789,195.368421 L27.5991874,190.196005 L1.42108547e-14,195.368421 Z" fill="#188038"></path>
        <path d="M256,60.6315789 L256,20.2105263 C256,9.04421053 246.955789,1.42108547e-14 235.789474,1.42108547e-14 L195.368421,1.42108547e-14 C191.679582,15.0358547 189.835162,26.1010948 189.835162,33.1957202 C189.835162,40.2903456 191.679582,49.4356319 195.368421,60.6315789 C208.777986,64.4714866 218.883249,66.3914404 225.684211,66.3914404 C232.485172,66.3914404 242.590435,64.4714866 256,60.6315789 Z" fill="#1967D2"></path>
        <polygon fill="#FBBC04" points="256 60.6315789 195.368421 60.6315789 195.368421 195.368421 256 195.368421"></polygon>
        <polygon fill="#34A853" points="195.368421 195.368421 60.6315789 195.368421 60.6315789 256 195.368421 256"></polygon>
        <path d="M195.368421,0 L20.2105263,0 C9.04421053,0 0,9.04421053 0,20.2105263 L0,195.368421 L60.6315789,195.368421 L60.6315789,60.6315789 L195.368421,60.6315789 L195.368421,0 Z" fill="#4285F4"></path>
        <path d="M88.2694737,165.153684 C83.2336842,161.751579 79.7473684,156.783158 77.8442105,150.214737 L89.5326316,145.397895 C90.5936842,149.44 92.4463158,152.572632 95.0905263,154.795789 C97.7178947,157.018947 100.917895,158.113684 104.656842,158.113684 C108.48,158.113684 111.764211,156.951579 114.509474,154.627368 C117.254737,152.303158 118.635789,149.338947 118.635789,145.751579 C118.635789,142.08 117.187368,139.082105 114.290526,136.757895 C111.393684,134.433684 107.755789,133.271579 103.410526,133.271579 L96.6568421,133.271579 L96.6568421,121.701053 L102.72,121.701053 C106.458947,121.701053 109.608421,120.690526 112.168421,118.669474 C114.728421,116.648421 116.008421,113.886316 116.008421,110.366316 C116.008421,107.233684 114.863158,104.741053 112.572632,102.871579 C110.282105,101.002105 107.385263,100.058947 103.865263,100.058947 C100.429474,100.058947 97.7010526,100.968421 95.68,102.804211 C93.6602819,104.644885 92.1418208,106.968942 91.2673684,109.557895 L79.6968421,104.741053 C81.2294737,100.395789 84.0421053,96.5557895 88.1684211,93.2378947 C92.2947368,89.92 97.5663158,88.2526316 103.966316,88.2526316 C108.698947,88.2526316 112.96,89.1621053 116.732632,90.9978947 C120.505263,92.8336842 123.469474,95.3768421 125.608421,98.6105263 C127.747368,101.861053 128.808421,105.498947 128.808421,109.541053 C128.808421,113.667368 127.814737,117.153684 125.827368,120.016842 C123.84,122.88 121.397895,125.069474 118.501053,126.602105 L118.501053,127.292632 C122.241568,128.834789 125.490747,131.367752 127.898947,134.618947 C130.341053,137.903158 131.570526,141.827368 131.570526,146.408421 C131.570526,150.989474 130.408421,155.082105 128.084211,158.669474 C125.76,162.256842 122.543158,165.086316 118.467368,167.141053 C114.374737,169.195789 109.776842,170.240124 104.673684,170.240124 C98.7621053,170.256842 93.3052632,168.555789 88.2694737,165.153684 L88.2694737,165.153684 Z M160.067368,107.149474 L147.233684,116.429474 L140.816842,106.694737 L163.84,90.0884211 L172.665263,90.0884211 L172.665263,168.421053 L160.067368,168.421053 L160.067368,107.149474 Z" fill="#4285F4"></path>
    </g>
</svg>
        </div>
      );
    case "gdrive":
      return (
        <div className={tile} aria-hidden="true">
          <svg aria-hidden="true" viewBox="0 0 256 229" className="h-[60%] w-[60%]">
    <g>
        <path d="M19.3542312,196.033928 L30.644172,215.534816 C32.9900287,219.64014 36.3622164,222.86588 40.3210929,225.211737 C51.6602421,210.818376 59.5534225,199.772864 64.000634,192.075201 C68.5137119,184.263529 74.0609657,172.045039 80.6423954,155.41973 C62.9064315,153.085282 49.4659974,151.918058 40.3210929,151.918058 C31.545465,151.918058 18.1051007,153.085282 0,155.41973 C0,159.964996 1.17298825,164.510261 3.51893479,168.615586 L19.3542312,196.033928 Z" fill="#0066DA"></path>
        <path d="M215.681443,225.211737 C219.64032,222.86588 223.012507,219.64014 225.358364,215.534816 L230.050377,207.470615 L252.483511,168.615586 C254.829368,164.510261 256.002446,159.964996 256.002446,155.41973 C237.79254,153.085282 224.376613,151.918058 215.754667,151.918058 C206.488712,151.918058 193.072785,153.085282 175.506888,155.41973 C182.010479,172.136093 187.484394,184.354584 191.928633,192.075201 C196.412073,199.863919 204.329677,210.909431 215.681443,225.211737 Z" fill="#EA4335"></path>
        <path d="M128.001268,73.3111515 C141.121182,57.4655263 150.162898,45.2470011 155.126415,36.6555757 C159.123121,29.7376196 163.521739,18.6920726 168.322271,3.51893479 C164.363395,1.1729583 159.818129,0 155.126415,0 L100.876121,0 C96.1841079,0 91.638842,1.31958557 87.6799655,3.51893479 C93.7861943,20.9210065 98.9675428,33.3058067 103.224011,40.6733354 C107.927832,48.8151881 116.186918,59.6944602 128.001268,73.3111515 Z" fill="#00832D"></path>
        <path d="M175.360141,155.41973 L80.6420959,155.41973 L40.3210929,225.211737 C44.2799694,227.557893 48.8252352,228.730672 53.5172481,228.730672 L202.485288,228.730672 C207.177301,228.730672 211.722567,227.411146 215.681443,225.211737 L175.360141,155.41973 Z" fill="#2684FC"></path>
        <path d="M128.001268,73.3111515 L87.680265,3.51893479 C83.7213885,5.86488134 80.3489013,9.09044179 78.0030446,13.1960654 L3.51893479,142.223575 C1.17298825,146.329198 0,150.874464 0,155.41973 L80.6423954,155.41973 L128.001268,73.3111515 Z" fill="#00AC47"></path>
        <path d="M215.241501,77.7099697 L177.999492,13.1960654 C175.653635,9.09044179 172.281148,5.86488134 168.322271,3.51893479 L128.001268,73.3111515 L175.360141,155.41973 L255.855999,155.41973 C255.855999,150.874464 254.682921,146.329198 252.337064,142.223575 L215.241501,77.7099697 Z" fill="#FFBA00"></path>
    </g>
</svg>
        </div>
      );
    case "slack":
      return (
        <div className={tile} aria-hidden="true">
          <svg aria-hidden="true" viewBox="0 0 256 256" className="h-[60%] w-[60%]"><path fill="#e01e5a" d="M53.841 161.32c0 14.832-11.987 26.82-26.819 26.82S.203 176.152.203 161.32c0-14.831 11.987-26.818 26.82-26.818H53.84zm13.41 0c0-14.831 11.987-26.818 26.819-26.818s26.819 11.987 26.819 26.819v67.047c0 14.832-11.987 26.82-26.82 26.82c-14.83 0-26.818-11.988-26.818-26.82z"></path><path fill="#36c5f0" d="M94.07 53.638c-14.832 0-26.82-11.987-26.82-26.819S79.239 0 94.07 0s26.819 11.987 26.819 26.819v26.82zm0 13.613c14.832 0 26.819 11.987 26.819 26.819s-11.987 26.819-26.82 26.819H26.82C11.987 120.889 0 108.902 0 94.069c0-14.83 11.987-26.818 26.819-26.818z"></path><path fill="#2eb67d" d="M201.55 94.07c0-14.832 11.987-26.82 26.818-26.82s26.82 11.988 26.82 26.82s-11.988 26.819-26.82 26.819H201.55zm-13.41 0c0 14.832-11.988 26.819-26.82 26.819c-14.831 0-26.818-11.987-26.818-26.82V26.82C134.502 11.987 146.489 0 161.32 0s26.819 11.987 26.819 26.819z"></path><path fill="#ecb22e" d="M161.32 201.55c14.832 0 26.82 11.987 26.82 26.818s-11.988 26.82-26.82 26.82c-14.831 0-26.818-11.988-26.818-26.82V201.55zm0-13.41c-14.831 0-26.818-11.988-26.818-26.82c0-14.831 11.987-26.818 26.819-26.818h67.25c14.832 0 26.82 11.987 26.82 26.819s-11.988 26.819-26.82 26.819z"></path></svg>
        </div>
      );
    default:
      return null;
  }
}

function MarketplacePane({ onClose }: { onClose: () => void }) {
  const [tab, setTab] = useState("Discover");
  const [query, setQuery] = useState("");
  const [added, setAdded] = useState<Record<string, boolean>>(() => {
    const init: Record<string, boolean> = {};
    for (const t of MARKETPLACE_ESSENTIALS) init[t.id] = true;
    return init;
  });
  const q = query.trim().toLowerCase();
  const match = (name: string, category: string, desc = "") =>
    !q || [name, category, desc].some((t) => t.toLowerCase().includes(q));
  const bots = MARKETPLACE_BOTS.filter((b) => match(b.name, b.category));
  const tools = MARKETPLACE_TOOLS.filter((t) => match(t.name, t.category, t.desc));
  const essentials = MARKETPLACE_ESSENTIALS.filter((t) => match(t.name, t.category, t.desc));
  const showBots = tab === "Discover" || tab === "Bots";
  const showTools = tab === "Discover" || tab === "Plugins";
  const showEssentials = tab === "Discover" || tab === "Plugins" || tab === "Installed";
  const tabs = ["Discover", "Plugins", "Bots", "Installed"];

  const toolCard = (tool: MarketplaceTool) => {
    const isAdded = added[tool.id] ?? tool.installed;
    return (
      <div key={tool.id} className="flex flex-col gap-2 rounded-2xl bg-background-secondary-default p-3">
        <button
          type="button"
          aria-label={`View ${tool.name}`}
          className="flex cursor-pointer items-center gap-2.5 text-start outline-none focus-visible:ring-2 focus-visible:ring-border-focus-ring"
        >
          <ToolMark id={tool.id} />
          <span className="flex min-w-0 flex-col">
            <span className="truncate text-body-medium text-text-primary">{tool.name}</span>
            <span className="truncate text-body-regular text-text-tertiary">{tool.category}</span>
          </span>
        </button>
        <p className="text-body-regular text-text-secondary">{tool.desc}</p>
        <button
          type="button"
          aria-label={isAdded ? `View added ${tool.name}` : `Add ${tool.name}`}
          onClick={() => setAdded((prev) => ({ ...prev, [tool.id]: true }))}
          className={cx(
            "flex h-8 w-full cursor-pointer items-center justify-center rounded-full border border-border-button-default text-body-medium outline-none transition-colors focus-visible:ring-2 focus-visible:ring-border-focus-ring",
            isAdded
              ? "bg-background-tertiary-default text-text-secondary"
              : "bg-background-primary-default text-text-primary hover:bg-background-primary-hover",
          )}
        >
          {isAdded ? "Added" : "Add"}
        </button>
      </div>
    );
  };

  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <div className="flex shrink-0 items-center justify-between px-8 pt-8">
        <h2 className="text-title-3-medium text-text-primary">Marketplace</h2>
        <button
          type="button"
          aria-label="Close marketplace"
          onClick={onClose}
          className="flex size-6 shrink-0 cursor-pointer items-center justify-center rounded-full bg-background-tertiary-default text-foreground-icon-secondary outline-none transition-colors duration-150 ease hover:bg-background-tertiary-hover focus-visible:ring-2 focus-visible:ring-border-focus-ring"
        >
          <RiCloseLine className="size-4" aria-hidden />
        </button>
      </div>
      <div className="min-h-0 flex-1 overflow-y-auto px-8 pb-8 [scrollbar-width:none]">
        <div className="relative mt-4 flex h-9 items-center gap-2 rounded-full bg-background-tertiary-default px-3">
          <RiSearchLine className="size-5 shrink-0 text-foreground-icon-tertiary" aria-hidden />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Find your next tool or teammate"
            aria-label="Find your next tool or teammate"
            className="min-w-0 flex-1 bg-transparent text-body-regular text-text-primary outline-none placeholder:text-text-tertiary"
          />
        </div>
        <div className="mt-4 flex items-center gap-1" role="tablist" aria-label="Marketplace sections">
          {tabs.map((t) => (
            <button
              key={t}
              type="button"
              role="tab"
              aria-selected={tab === t}
              onClick={() => setTab(t)}
              className={cx(
                "flex h-[30px] cursor-pointer items-center justify-center rounded-full px-3 text-body-medium outline-none transition-colors focus-visible:ring-2 focus-visible:ring-border-focus-ring",
                tab === t
                  ? "bg-background-tertiary-default text-text-primary"
                  : "text-text-secondary hover:bg-background-tertiary-default/60",
              )}
            >
              {t}
            </button>
          ))}
        </div>

        {showBots && bots.length > 0 && (
          <>
            <div className="mt-5 flex items-center justify-between gap-2">
              <h3 className="text-title-3-medium text-text-primary">Meet your next teammate</h3>
              <button
                type="button"
                onClick={() => setTab("Bots")}
                className="flex h-8 shrink-0 cursor-pointer items-center gap-0.5 rounded-full px-2 text-body-medium text-text-secondary outline-none hover:bg-background-tertiary-default focus-visible:ring-2 focus-visible:ring-border-focus-ring"
              >
                View all
                <RiArrowRightSLine className="size-4 shrink-0" aria-hidden />
              </button>
            </div>
            <div className="mt-3 grid grid-cols-4 gap-2">
              {bots.map((bot) => (
                <button
                  key={bot.id}
                  type="button"
                  aria-label={`View ${bot.name}`}
                  className="flex h-[130px] w-full cursor-pointer flex-col items-center justify-center gap-1 rounded-2xl bg-background-secondary-default p-2 outline-none transition-colors hover:bg-background-secondary-hover focus-visible:ring-2 focus-visible:ring-border-focus-ring"
                >
                  <AgentAvatar agent={bot} size={52} />
                  <span className="truncate text-body-medium text-text-primary">{bot.name}</span>
                  <span className="truncate text-body-regular text-text-tertiary">{bot.category}</span>
                </button>
              ))}
            </div>
          </>
        )}

        {showTools && tools.length > 0 && (
          <>
            <div className="mt-5 flex items-center justify-between gap-2">
              <h3 className="text-title-3-medium text-text-primary">Tools for your workflow</h3>
              <button
                type="button"
                onClick={() => setTab("Plugins")}
                className="flex h-8 shrink-0 cursor-pointer items-center gap-0.5 rounded-full px-2 text-body-medium text-text-secondary outline-none hover:bg-background-tertiary-default focus-visible:ring-2 focus-visible:ring-border-focus-ring"
              >
                View all
                <RiArrowRightSLine className="size-4 shrink-0" aria-hidden />
              </button>
            </div>
            <div className="mt-3 grid grid-cols-2 gap-x-9 gap-y-4">
              {tools.map((tool) => toolCard(tool))}
            </div>
          </>
        )}

        {showEssentials && essentials.length > 0 && (
          <>
            <div className="mt-5 flex items-center justify-between gap-2">
              <h3 className="text-title-3-medium text-text-primary">Everyday essentials</h3>
            </div>
            <div className="mt-3 grid grid-cols-2 gap-x-9 gap-y-4">
              {essentials.map((tool) => toolCard(tool))}
            </div>
          </>
        )}

        {bots.length === 0 && tools.length === 0 && essentials.length === 0 && (
          <p className="px-2 py-6 text-body-regular text-text-tertiary">
            No tools or teammates match “{query.trim()}”.
          </p>
        )}
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Page                                                                */
/* ------------------------------------------------------------------ */

/* ------------------------------------------------------------------ */
/* Group picker — measured live (orig-group-via-menu.json +           */
/* orig-probe2.json picker): a 520×526 dialog, "Chat with your       */
/* agents" / "Choose who’s joining the conversation.", the 10 agents  */
/* as centred wrap pills (40px), current agent pre-selected, and a   */
/* full-width "Start chat · N agent(s)" button.                        */
/* ------------------------------------------------------------------ */

function GroupPicker({
  agents,
  currentAgentId,
  onClose,
  onStart,
}: {
  agents: Agent[];
  currentAgentId: string | null;
  onClose: () => void;
  onStart: (members: PickerMember[]) => void;
}) {
  const all: PickerMember[] = [
    ...agents.map((a) => ({ id: a.id, name: a.name, body: a.body, deep: a.deep, shape: a.shape })),
    ...PICKER_EXTRA,
  ];
  const [selected, setSelected] = useState<string[]>(() =>
    currentAgentId ? [currentAgentId] : [],
  );

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  const toggle = (id: string) =>
    setSelected((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));
  const members = selected
    .map((id) => all.find((m) => m.id === id))
    .filter((m): m is PickerMember => Boolean(m));
  const n = members.length;

  return (
    <div
      className="fixed inset-0 z-[70] flex items-center justify-center bg-black/40 p-4"
      role="presentation"
      onClick={onClose}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Chat with your agents"
        onClick={(e) => e.stopPropagation()}
        className="flex h-[526px] max-h-[calc(100dvh-32px)] w-[520px] max-w-[calc(100vw-32px)] flex-col rounded-3xl bg-background-primary-default p-6 shadow-xl"
      >
        <div className="flex shrink-0 items-start justify-between gap-2">
          <div className="flex min-w-0 flex-col gap-1">
            <h2 className="text-title-2-medium text-text-primary">Chat with your agents</h2>
            <p className="text-body-regular text-text-secondary">Choose who’s joining the conversation.</p>
          </div>
          <button
            type="button"
            aria-label="Close group picker"
            onClick={onClose}
            className="flex size-6 shrink-0 cursor-pointer items-center justify-center rounded-full bg-background-tertiary-default text-foreground-icon-secondary outline-none transition-colors duration-150 ease hover:bg-background-tertiary-hover focus-visible:ring-2 focus-visible:ring-border-focus-ring"
          >
            <RiCloseLine className="size-4" aria-hidden />
          </button>
        </div>
        <div className="mt-auto flex min-h-0 flex-wrap content-center items-center justify-center gap-2 overflow-y-auto py-4 [scrollbar-width:none]">
          {all.map((m) => {
            const on = selected.includes(m.id);
            return (
              <button
                key={m.id}
                type="button"
                aria-pressed={on}
                onClick={() => toggle(m.id)}
                className={cx(
                  "flex h-10 shrink-0 cursor-pointer items-center gap-2 rounded-full border border-border-button-default px-3 outline-none transition-colors focus-visible:ring-2 focus-visible:ring-border-focus-ring",
                  on
                    ? "bg-background-tertiary-default"
                    : "bg-background-primary-default hover:bg-background-primary-hover",
                )}
              >
                <AgentAvatar agent={m} size={20} />
                <span className="whitespace-nowrap text-body-medium text-text-primary">{m.name}</span>
              </button>
            );
          })}
        </div>
        <button
          type="button"
          disabled={n === 0}
          onClick={() => onStart(members)}
          className="flex h-9 w-full shrink-0 cursor-pointer items-center justify-center rounded-full bg-button-primary text-body-medium text-text-white outline-none transition-opacity duration-150 ease hover:opacity-90 disabled:cursor-default disabled:opacity-50 focus-visible:ring-2 focus-visible:ring-border-focus-ring focus-visible:ring-offset-2"
        >
          Start chat · {n} agent{n === 1 ? "" : "s"}
        </button>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Pro banner — measured live (orig-probe2.json banner +              */
/* orig-marketplace-full.png): a fixed card at the viewport's bottom  */
/* left (280×194 @12,694 desktop, full-width @12,656 on mobile),     */
/* logo + "Dismiss Pro template prompt" × on top, "This template is  */
/* part of Pro" / "Buy once and install the full source with the     */
/* CLI." and a full-width blue "Get Pro" button. It overlays the     */
/* sidebar footer until dismissed.                                    */
/* ------------------------------------------------------------------ */

function ProBanner({ onDismiss }: { onDismiss: () => void }) {
  return (
    <div className="fixed inset-x-3 bottom-3 z-60 flex w-auto flex-col items-start gap-3 overflow-hidden rounded-2xl border border-border-button-white bg-background-secondary-default p-4 shadow-waitlist sm:inset-x-auto sm:w-[280px]">
      <div className="flex w-full items-start justify-between gap-2">
        <span className="inline-flex size-8 shrink-0 select-none items-center justify-center overflow-hidden rounded-lg bg-blue-300 text-blue-900">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/brand/boardui_logo_circle.webp" alt="" loading="lazy" decoding="async" className="size-full object-cover" />
        </span>
        <button
          type="button"
          aria-label="Dismiss Pro template prompt"
          onClick={onDismiss}
          className="flex size-5 shrink-0 cursor-pointer items-center justify-center rounded-full text-foreground-icon-secondary outline-none transition-colors hover:bg-background-tertiary-default focus-visible:ring-2 focus-visible:ring-border-focus-ring"
        >
          <RiCloseLine className="size-4" aria-hidden />
        </button>
      </div>
      <div className="flex flex-col gap-1">
        <p className="text-body-medium text-text-primary">This template is part of Pro</p>
        <p className="text-body-regular text-text-secondary">Buy once and install the full source with the CLI.</p>
      </div>
      <a
        href="/pricing"
        className="flex h-9 w-full items-center justify-center rounded-full bg-button-primary text-body-medium text-text-white outline-none transition-opacity duration-150 ease hover:opacity-90 focus-visible:ring-2 focus-visible:ring-border-focus-ring"
      >
        Get Pro
      </a>
    </div>
  );
}

function seedMessages(agent: Agent): ChatMsg[] {
  return [
    { id: 1, role: "user", text: agent.userMsg },
    { id: 2, role: "agent", text: `${agent.replyP1}\n${agent.replyP2}` },
  ];
}

export default function MultiAgentChatTemplatePage() {
  /* REPLICA NOTE: the roster is state, not the module const — the editor
     saves name/avatar/description here (live, no Save button), so every
     change is visible in the sidebar and the chat header immediately.
     Nothing is persisted beyond the session (the original template is a
     demo the same way). Default state matches the original (measured
     live): the landing conversation is selected, the editor is open for
     the Security agent, and there is no group chat yet. */
  const [agents, setAgents] = useState<Agent[]>(AGENTS);
  const [groups, setGroups] = useState<GroupChat[]>([]);
  const [selectedId, setSelectedId] = useState("landing");
  const [editorOpen, setEditorOpen] = useState(true);
  const [editorAgentId, setEditorAgentId] = useState("security");
  const [pickerOpen, setPickerOpen] = useState(false);
  const [proDismissed, setProDismissed] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [settingsPage, setSettingsPage] = useState<SettingsPage>("general");
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [groupMsgsById, setGroupMsgsById] = useState<Record<string, ChatMsg[]>>({});
  const [thinking, setThinking] = useState(false);
  const [input, setInput] = useState("");
  const [convs, setConvs] = useState<Record<string, ChatMsg[]>>(() => {
    const init: Record<string, ChatMsg[]> = {};
    for (const a of AGENTS) init[a.id] = seedMessages(a);
    return init;
  });
  const nextId = useRef(100);
  const replyIdx = useRef<Record<string, number>>({});

  const group = groups.find((g) => g.id === selectedId) ?? null;
  const agent =
    group ? null : (agents.find((a) => a.id === selectedId) ?? agents[0] ?? null);
  const editorAgent =
    agents.find((a) => a.id === editorAgentId) ?? agent ?? agents[0] ?? null;
  const messages = agent ? (convs[agent.id] ?? seedMessages(agent)) : (groupMsgsById[selectedId] ?? []);

  /** Editor edits apply to the editor's own agent (which need not be the
      selected conversation's agent — by default the editor shows the
      Security agent while the landing conversation is selected). */
  const saveEditorAgent = (patch: Partial<Agent>) => {
    if (!editorAgent) return;
    setAgents((prev) => prev.map((a) => (a.id === editorAgent.id ? { ...a, ...patch } : a)));
  };

  const openEditor = (agentId?: string) => {
    if (agentId) setEditorAgentId(agentId);
    else if (agent) setEditorAgentId(agent.id);
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
      intro: "Hi — I'm a new agent. Tell me what you'd like me to help with and I'll get started.",
      body: "#B9D2F2",
      deep: "#8FB4E8",
      shape: "star",
      userMsg: "Hello! What should we work on?",
      replyP1: "Hi — I'm a new agent. Tell me what you'd like me to help with and I'll get started.",
      replyP2: "You can change my name, label, description and appearance in the editor on the right.",
    };
    setAgents((prev) => [...prev, created]);
    setConvs((prev) => ({ ...prev, [id]: seedMessages(created) }));
    setSelectedId(id);
    setEditorAgentId(id);
    setEditorOpen(true);
  };

  const newChat = () => {
    if (agent) setConvs((prev) => ({ ...prev, [agent.id]: [] }));
    else setGroupMsgsById((prev) => ({ ...prev, [selectedId]: [] }));
    setEditorOpen(false);
  };

  /** Group name rule (orig-group-start.json): each member's first
      name-word, capitalised, joined with " + ", in pick order. */
  const createGroup = (members: PickerMember[]) => {
    const firstWord = (name: string) => {
      const w = name.trim().split(/\s+/)[0] ?? name;
      return w.charAt(0).toUpperCase() + w.slice(1);
    };
    const created: GroupChat = {
      id: `group-${Date.now()}`,
      name: members.map((m) => firstWord(m.name)).join(" + "),
      members,
    };
    setGroups((prev) => [...prev, created]);
    setSelectedId(created.id);
    setPickerOpen(false);
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
      // Group chat: each roster member of the group replies in its own
      // voice, staggered. Picker-only members (Product planner, Support
      // guide, Data analyst) have no agent record, so they do not reply.
      const gid = selectedId;
      setGroupMsgsById((prev) => ({ ...prev, [gid]: [...(prev[gid] ?? []), userMsg] }));
      const members = (group?.members ?? [])
        .map((m) => agents.find((a) => a.id === m.id))
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
          setGroupMsgsById((prev) => ({ ...prev, [gid]: [...(prev[gid] ?? []), reply] }));
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

  // Height follows the preview container when embedded in a docs preview
  // (--template-preview-height set by TemplatePreview), and falls back to
  // the full viewport on the standalone route.
  return (
    <div className="flex h-[var(--template-preview-height,100dvh)] min-h-0 overflow-hidden bg-background-full p-3 text-text-primary">
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
        groups={groups}
        onOpenMarketplace={() => openSettings("marketplace")}
        onOpenSettings={() => openSettings("general")}
        onCreateAgent={createAgent}
        onNewChat={newChat}
        onNewGroup={() => setPickerOpen(true)}
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
              groups={groups}
              onOpenMarketplace={() => openSettings("marketplace")}
              onOpenSettings={() => openSettings("general")}
              onCreateAgent={createAgent}
              onNewChat={newChat}
              onNewGroup={() => setPickerOpen(true)}
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
          group={group}
          thinking={thinking}
          onOpenEditor={openEditor}
          onOpenMobileNav={() => setMobileNavOpen(true)}
          onOpenGroupPicker={() => setPickerOpen(true)}
        />
        <Composer value={input} onValueChange={setInput} onSubmit={submit} />
      </main>
      {editorOpen && editorAgent && (
        <>
          {/* Mobile only: the editor is a fixed right drawer over a dimmed
              backdrop (measured live: panel [42,8,340,828] inside a fixed
              inset-0 z-40 backdrop). On desktop the section below is a
              plain in-flow flex sibling (340px, main column 784px). */}
          <div
            aria-hidden="true"
            onClick={() => setEditorOpen(false)}
            className="fixed inset-0 z-30 bg-background-secondary-default/70 backdrop-blur-sm lg:hidden"
          />
          <AgentEditor
            key={editorAgent.id}
            agent={editorAgent}
            onSave={saveEditorAgent}
            onClose={() => setEditorOpen(false)}
          />
        </>
      )}
      {pickerOpen && (
        <GroupPicker
          agents={agents}
          currentAgentId={agent?.id ?? null}
          onClose={() => setPickerOpen(false)}
          onStart={createGroup}
        />
      )}
      <SettingsModal
        isOpen={settingsOpen}
        onClose={() => setSettingsOpen(false)}
        defaultPage={settingsPage}
        planArtSrc="/templates/settings-plan-art.png"
        marketplace={<MarketplacePane onClose={() => setSettingsOpen(false)} />}
      />
      {!proDismissed && <ProBanner onDismiss={() => setProDismissed(true)} />}
    </div>
  );
}
