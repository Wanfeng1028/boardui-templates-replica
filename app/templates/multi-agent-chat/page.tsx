"use client";

import {
  RiAddLine,
  RiArrowDownSLine,
  RiArrowUpLine,
  RiCloseLine,
  RiFileCopyLine,
  RiDownloadLine,
  RiEarthLine,
  RiHeadphoneLine,
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
import { useRef, useState } from "react";

import { Switch } from "@/components/base/switch/switch";
import { cx } from "@/utils/cx";

/**
 * Multi-Agent Chat template — 1:1 replica of boardui.com/templates/multi-agent-chat.
 * Structure, classes, copy and tokens are taken from the public template page's
 * server-rendered HTML and BoardUI's public CSS (design tokens). Built only
 * from free BoardUI components + hand-drawn SVG avatars. Not the official
 * Pro source: the canvas avatar animation is replaced by a static SVG face
 * with a CSS blink, and the editor is a local panel.
 */

type Agent = {
  id: string;
  name: string;
  label: string;
  desc: string;
  body: string;
  shape: "shield" | "circle" | "star" | "diamond";
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
    body: "#b9e4a8",
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
    body: "#b9d9f5",
    shape: "circle",
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
    body: "#d8b9f2",
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
    body: "#ffd9a0",
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
    body: "#a8e3d3",
    shape: "circle",
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
    body: "#bccdea",
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
    body: "#a9d2f2",
    shape: "circle",
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
/* Avatar — hand-drawn pastel cartoon face (SVG). The original uses a */
/* canvas animation (blinking eyes); here the eyes blink via CSS.     */
/* ------------------------------------------------------------------ */

function FacePath({ shape, body }: { shape: Agent["shape"]; body: string }) {
  if (shape === "circle") {
    return <circle cx="20" cy="20" r="17.5" fill={body} />;
  }
  if (shape === "star") {
    return (
      <path
        d="M20 2.5c1.6 6.8 4.2 9.4 5.4 10.6 1.2 1.2 3.8 3.8 10.6 5.4-6.8 1.6-9.4 4.2-10.6 5.4-1.2 1.2-3.8 3.8-5.4 10.6-1.6-6.8-4.2-9.4-5.4-10.6-1.2-1.2-3.8-3.8-10.6-5.4 6.8-1.6 9.4-4.2 10.6-5.4 1.2-1.2 3.8-3.8 5.4-10.6Z"
        fill={body}
      />
    );
  }
  if (shape === "diamond") {
    return (
      <path
        d="M20 3.5c1.8 0 3.3 1 4.2 2.5l7.3 11.2c1.5 2.3 1.5 5.3 0 7.6L24.2 36c-.9 1.5-2.4 2.5-4.2 2.5s-3.3-1-4.2-2.5l-7.3-11.2c-1.5-2.3-1.5-5.3 0-7.6L15.8 6c.9-1.5 2.4-2.5 4.2-2.5Z"
        fill={body}
      />
    );
  }
  return (
    <path
      d="M20 2.5c8.5 0 15 6 15 14.5 0 9.5-6.5 18-15 20.5C11.5 35 5 26.5 5 17 5 8.5 11.5 2.5 20 2.5Z"
      fill={body}
    />
  );
}

function AgentAvatar({
  agent,
  size = 40,
  blinkDelay = "0s",
  className,
}: {
  agent: Pick<Agent, "body" | "shape" | "name">;
  size?: number;
  blinkDelay?: string;
  className?: string;
}) {
  return (
    <span
      className={cx("relative block shrink-0", className)}
      style={{ width: size, height: size }}
      role="img"
      aria-label={agent.name}
    >
      <svg viewBox="0 0 40 40" width={size} height={size} aria-hidden="true" className="block">
        <FacePath shape={agent.shape} body={agent.body} />
        <g className="bui-blink" style={{ animationDelay: blinkDelay }}>
          <ellipse cx="14" cy="17.5" rx="2.3" ry="3.3" fill="#262626" />
          <ellipse cx="26" cy="17.5" rx="2.3" ry="3.3" fill="#262626" />
        </g>
        <path
          d="M15.5 25 Q20 28.5 24.5 25"
          stroke="#262626"
          strokeWidth="1.8"
          fill="none"
          strokeLinecap="round"
        />
        <ellipse cx="10.5" cy="22.5" rx="2" ry="1.2" fill="#f2a0a0" opacity="0.55" />
        <ellipse cx="29.5" cy="22.5" rx="2" ry="1.2" fill="#f2a0a0" opacity="0.55" />
      </svg>
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
}: {
  selectedId: string;
  onSelect: (id: string) => void;
  searchOpen: boolean;
  setSearchOpen: (v: boolean) => void;
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
              <button type="button" className={pillBtn} aria-label="Marketplace">
                <RiShoppingBag3Line className="size-5 shrink-0" aria-hidden />
              </button>
            </div>
            <div className="flex">
              <button
                type="button"
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
                  agent={{ body: "#b9e4a8", shape: "shield", name: "landing page designer" }}
                  size={22}
                  className="absolute -left-0.5 top-0"
                />
                <AgentAvatar
                  agent={{ body: "#d8b9f2", shape: "star", name: "marketing bot" }}
                  size={22}
                  className="absolute -right-0.5 top-0"
                />
                <AgentAvatar
                  agent={{ body: "#a9d2f2", shape: "diamond", name: "Product planner" }}
                  size={22}
                  className="absolute bottom-0 left-1/2 -translate-x-1/2"
                />
              </span>
              <span className="flex min-w-0 flex-1 flex-col gap-0.5">
                <span className="truncate text-body-medium text-text-primary">{GROUP.name}</span>
                <span className="truncate text-body-regular text-text-tertiary">{GROUP.desc}</span>
              </span>
            </button>
            {AGENTS.map((agent, i) => {
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

        {/* Footer: Support / Settings / Board team */}
        <footer className="mt-2 flex shrink-0 flex-col gap-1">
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
        <AgentAvatar agent={{ body: "#b9e4a8", shape: "shield", name: "landing page designer" }} size={40} className="relative z-[1] -me-2" />
        <AgentAvatar agent={{ body: "#d8b9f2", shape: "star", name: "marketing bot" }} size={40} className="relative z-[2] -mt-3" />
        <AgentAvatar agent={{ body: "#a9d2f2", shape: "diamond", name: "Product planner" }} size={40} className="relative z-[1] -ms-2" />
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
  onOpenEditor,
}: {
  agent: Agent | null;
  messages: ChatMsg[];
  onOpenEditor: () => void;
}) {
  return (
    <>
      <header className="flex h-[55px] shrink-0 items-start gap-2 px-3 pt-3">
        {agent ? (
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
            <span className="truncate text-body-2-medium text-text-secondary">{GROUP.name}</span>
          </div>
        )}
        <button
          type="button"
          aria-label="Copy conversation"
          title="Copy conversation"
          className="cursor-pointer rounded p-1 text-foreground-icon-secondary outline-none focus-visible:ring-2 focus-visible:ring-border-focus-ring"
        >
          <RiDownloadLine className="size-4" aria-hidden />
        </button>
        <button
          type="button"
          aria-label="Conversation options"
          className="cursor-pointer rounded p-1 text-foreground-icon-secondary outline-none focus-visible:ring-2 focus-visible:ring-border-focus-ring"
        >
          <RiMore2Fill className="size-4" aria-hidden />
        </button>
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
                  className="flex h-[30px] shrink-0 cursor-pointer items-center gap-1 rounded-full px-2 py-[5px] pe-2.5 outline-none transition-colors duration-150 ease hover:bg-background-tertiary-default focus-visible:ring-2 focus-visible:ring-border-focus-ring"
                >
                  <RiShieldLine className="size-4 shrink-0 text-foreground-icon-secondary" aria-hidden />
                  <span className="whitespace-nowrap text-body-2-medium text-text-secondary">
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

const EDITOR_COLORS = [
  "#3b82f6",
  "#14b8a6",
  "#8b5cf6",
  "#d946ef",
  "#ef4444",
  "#f97316",
  "#60a5fa",
  "#22c55e",
  "#16a34a",
];

function AgentEditor({ agent, onClose }: { agent: Agent; onClose: () => void }) {
  const [name, setName] = useState(agent.name);
  const [label, setLabel] = useState(agent.label);
  const [desc, setDesc] = useState(agent.desc);
  const [language, setLanguage] = useState("Auto-detect");
  const [voice, setVoice] = useState("System voice");
  const [notify, setNotify] = useState(true);
  const [colorIdx, setColorIdx] = useState(0);
  const [shapeIdx, setShapeIdx] = useState(0);

  const variants: { body: string; shape: Agent["shape"]; name: string }[] = [
    ...AGENTS.map((a) => ({ body: a.body, shape: a.shape, name: a.name })),
    { body: "#f5b8c4", shape: "circle" as const, name: "variant pink" },
    { body: "#fde68a", shape: "shield" as const, name: "variant yellow" },
    { body: "#c4b5fd", shape: "star" as const, name: "variant violet" },
    { body: "#fca5a5", shape: "diamond" as const, name: "variant red" },
    { body: "#86efac", shape: "circle" as const, name: "variant mint" },
    { body: "#fda4af", shape: "shield" as const, name: "variant rose" },
    { body: "#93c5fd", shape: "star" as const, name: "variant sky" },
    { body: "#fdba74", shape: "circle" as const, name: "variant peach" },
    { body: "#d9f99d", shape: "diamond" as const, name: "variant lime" },
  ];
  const ringR = 41.5;

  return (
    <aside
      aria-label="Agent editor"
      className="ms-4 hidden w-[360px] shrink-0 flex-col rounded-3xl border border-border-button-white bg-background-secondary-default shadow-sidebar lg:flex"
    >
      <div className="flex min-h-0 flex-1 flex-col overflow-y-auto p-3 [scrollbar-width:none]">
        <div className="flex shrink-0 items-center justify-between px-1 pb-2">
          <p className="truncate text-title-3-semibold text-text-primary">{agent.name}</p>
          <button
            type="button"
            aria-label="Close agent editor"
            onClick={onClose}
            className="flex size-8 shrink-0 cursor-pointer items-center justify-center rounded-full text-foreground-icon-secondary outline-none transition-colors hover:bg-background-tertiary-default focus-visible:ring-2 focus-visible:ring-border-focus-ring"
          >
            <RiCloseLine className="size-5" aria-hidden />
          </button>
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
                onClick={() => setShapeIdx(i)}
                className={cx(
                  "absolute -translate-x-1/2 -translate-y-1/2 cursor-pointer rounded-full p-0.5 outline-none transition-shadow focus-visible:ring-2 focus-visible:ring-border-focus-ring",
                  i === shapeIdx ? "ring-2 ring-accent-500" : "hover:ring-2 hover:ring-border-button-default",
                )}
                style={{ left: `${x}%`, top: `${y}%` }}
              >
                <AgentAvatar agent={{ body: v.body, shape: v.shape, name: v.name }} size={28} />
              </button>
            );
          })}
          <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
            <AgentAvatar agent={variants[shapeIdx] ?? agent} size={150} />
          </div>
        </div>

        {/* Shape options + colour dots */}
        <div className="flex shrink-0 flex-col items-center gap-3 pb-1">
          <div className="flex items-center gap-2">
            {(["shield", "circle", "star", "diamond"] as const).map((s, i) => (
              <button
                key={s}
                type="button"
                aria-label={`Shape ${s}`}
                onClick={() => setShapeIdx(i)}
                className={cx(
                  "flex size-9 cursor-pointer items-center justify-center rounded-xl border outline-none transition-colors focus-visible:ring-2 focus-visible:ring-border-focus-ring",
                  shapeIdx === i
                    ? "border-border-button-default bg-background-primary-default"
                    : "border-transparent bg-transparent hover:bg-background-tertiary-default",
                )}
              >
                <AgentAvatar agent={{ body: "#d7d7d7", shape: s, name: s }} size={24} />
              </button>
            ))}
          </div>
          <div className="flex items-center gap-1.5">
            {EDITOR_COLORS.map((c, i) => (
              <button
                key={c}
                type="button"
                aria-label={`Color ${c}`}
                onClick={() => setColorIdx(i)}
                className={cx(
                  "size-5 cursor-pointer rounded-full outline-none transition-transform focus-visible:ring-2 focus-visible:ring-border-focus-ring",
                  i === colorIdx ? "scale-110 ring-2 ring-offset-2 ring-border-focus-ring" : "hover:scale-110",
                )}
                style={{ backgroundColor: c }}
              />
            ))}
            <span
              className="flex size-5 items-center justify-center rounded-full text-[10px]"
              style={{ background: "conic-gradient(#ef4444,#f97316,#eab308,#22c55e,#3b82f6,#8b5cf6,#ec4899,#ef4444)" }}
              aria-label="Rainbow"
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
/* Page                                                                */
/* ------------------------------------------------------------------ */

function seedMessages(agent: Agent): ChatMsg[] {
  return [
    { id: 1, role: "user", text: agent.userMsg },
    { id: 2, role: "agent", text: `${agent.replyP1}\n${agent.replyP2}` },
  ];
}

export default function MultiAgentChatTemplatePage() {
  const [selectedId, setSelectedId] = useState("landing");
  const [editorOpen, setEditorOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [input, setInput] = useState("");
  const [convs, setConvs] = useState<Record<string, ChatMsg[]>>(() => {
    const init: Record<string, ChatMsg[]> = {};
    for (const a of AGENTS) init[a.id] = seedMessages(a);
    return init;
  });
  const nextId = useRef(100);

  const agent = selectedId === GROUP.id ? null : AGENTS.find((a) => a.id === selectedId) ?? AGENTS[0];
  const messages = agent ? (convs[agent.id] ?? seedMessages(agent)) : [];

  const submit = () => {
    const text = input.trim();
    if (!text || !agent) return;
    const userMsg: ChatMsg = { id: nextId.current++, role: "user", text };
    setConvs((prev) => ({ ...prev, [agent.id]: [...(prev[agent.id] ?? []), userMsg] }));
    setInput("");
    window.setTimeout(() => {
      const reply: ChatMsg = {
        id: nextId.current++,
        role: "agent",
        text: `Noted — I'll take a look at that for the ${agent.name} and draft a tighter version.\nThis is a replica demo reply; no model is connected.`,
      };
      setConvs((prev) => ({ ...prev, [agent.id]: [...(prev[agent.id] ?? []), reply] }));
    }, 700);
  };

  return (
    <div className="flex h-dvh min-h-0 overflow-hidden bg-background-full p-3 text-text-primary">
      <style>{`@keyframes bui-blink{0%,91%,100%{transform:scaleY(1)}94%,96%{transform:scaleY(.08)}}.bui-blink{animation:bui-blink 4.4s infinite;transform-box:fill-box;transform-origin:center}`}</style>
      <Sidebar
        selectedId={selectedId}
        onSelect={(id) => {
          setSelectedId(id);
          setEditorOpen(false);
        }}
        searchOpen={searchOpen}
        setSearchOpen={setSearchOpen}
      />
      <main
        aria-label="Agent conversation"
        className="flex min-h-0 min-w-0 flex-1 flex-col rounded-3xl bg-background-secondary-default"
      >
        <ChatMain agent={agent} messages={messages} onOpenEditor={() => setEditorOpen(true)} />
        <Composer value={input} onValueChange={setInput} onSubmit={submit} />
      </main>
      {editorOpen && agent && <AgentEditor agent={agent} onClose={() => setEditorOpen(false)} />}
    </div>
  );
}
