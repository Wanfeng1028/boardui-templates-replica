"use client";

import { useState } from "react";
import Link from "next/link";
import { RiArrowLeftLine, RiArrowRightLine, RiArticleLine, RiCheckLine, RiFileCopyLine } from "@remixicon/react";

import { AppShell } from "@/components/application/app-shell/app-shell";

function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);
  return (
    <button
      type="button"
      onClick={() => {
        const done = () => {
          setCopied(true);
          window.setTimeout(() => setCopied(false), 1500);
        };
        if (navigator.clipboard?.writeText) {
          navigator.clipboard.writeText(text).then(done).catch(done);
        } else {
          done();
        }
      }}
      className="inline-flex shrink-0 items-center gap-1 rounded-full border border-border-button-default bg-background-primary-default px-2.5 py-1 text-caption-1-semibold text-text-secondary transition-colors hover:text-text-primary"
    >
      {copied ? <RiCheckLine className="size-3.5" aria-hidden /> : <RiFileCopyLine className="size-3.5" aria-hidden />}
      {copied ? "Copied" : "Copy"}
    </button>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="flex flex-col gap-3">
      <h2 className="text-title-2-medium text-text-primary">{title}</h2>
      {children}
    </section>
  );
}

function SubSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="flex flex-col gap-3">
      <h3 className="text-title-3-semibold text-text-primary">{title}</h3>
      {children}
    </section>
  );
}

function CodeBlock({ code }: { code: string }) {
  return (
    <div className="flex items-start justify-between gap-3 rounded-xl border border-border-button-default bg-background-secondary-default px-4 py-3">
      <pre className="overflow-x-auto font-mono text-caption-1-medium leading-6 text-text-primary">{code}</pre>
      <CopyButton text={code} />
    </div>
  );
}

function DocLink({ href, label }: { href: string; label: string }) {
  return (
    <Link
      href={href}
      className="inline-flex items-center gap-1 text-body-medium text-accent-600 underline"
    >
      {label}
      <RiArrowRightLine className="size-4" aria-hidden />
    </Link>
  );
}

function P({ children }: { children: React.ReactNode }) {
  return <p className="text-body-regular text-text-secondary">{children}</p>;
}

/**
 * "A React design system for agentic products" — full text from
 * boardui.com/blog/react-design-system-for-agentic-products.
 * Links to boardui.com pages point at this site's own routes;
 * links to outside sites are shown as plain text, not links.
 */
export default function AgenticProductsPostPage() {
  return (
    <AppShell title="Blog" heading="Blog" icon={RiArticleLine} actions={null} columnClassName="max-w-[964px]">
      <article className="flex flex-col gap-8 pb-8">
        <header className="flex flex-col gap-3">
          <div className="flex flex-wrap items-center gap-2">
            <span className="rounded-full border border-border-button-default bg-background-secondary-default px-2.5 py-0.5 text-caption-1-semibold text-text-secondary">
              Agentic UI
            </span>
            <span className="text-caption-1-regular text-text-tertiary">Oct 28, 2026 · 5 min read</span>
          </div>
          <h1 className="text-title-1-medium text-text-primary">A React design system for agentic products</h1>
          <span className="block overflow-hidden rounded-3xl border border-border-button-default bg-background-secondary-default">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="https://www.boardui.com/blog/react-design-system-for-agentic-products/cover.png"
              alt="BoardUI agentic UI components"
              className="aspect-[16/9] w-full object-cover"
            />
          </span>
          <P>
            In August 2025, Gartner predicted that 40% of enterprise apps would include task-specific AI agents
            by the end of 2026, up from less than 5% in 2025. Yet you sign up for a new agent product and find a
            chat box from a tutorial. The agent thinks behind a gray spinner and answers in a wall of raw markdown.
          </P>
          <P>
            If you&apos;re building an agent, you spend your months on the model and the tools. You leave the
            interface for the weeks before launch and ship the composer, the loading states and the usage meter
            looking like a prototype.
          </P>
          <P>
            BoardUI is a React design system for agentic products. We designed and coded its agent screens on
            Tailwind CSS: the composer, thinking states, task lists, research trails, usage limits and multi-agent
            chat. You install the parts you need and change them in your own repo while you keep working on the
            agent.
          </P>
        </header>

        <Section title="How we built the light around the composer">
          <P>
            We built five versions of Composer Loader, the light that circles the composer while an agent works: a
            gradient sweeping the ring, comets running along the edge, the two together, colored mist behind
            frosted glass, and an edge light. We shipped the edge light. A single blurred glow reads as flat
            paint, so the edge light draws the same beam three times, a crisp line in front with a tight glow and
            a wide bloom behind it.
          </P>
          <P>
            Then we opened it on an iPhone and all three layers drew with hard edges. WebKit, the engine behind
            Safari and Chrome on iPhone, ignores CSS blur on SVG shapes. We moved the blur into an SVG filter,
            which WebKit renders.
          </P>
          <P>
            Composer Loader is free: <DocLink href="/components/composer-loader" label="Composer Loader" />
          </P>
        </Section>

        <Section title="Install the agent UI with one command">
          <P>
            Composer Panel is the prompt bar of a coding agent: a model picker with an effort slider, an attachment
            menu, a mic, a status tab for the branch and context use, and a permission picker with four modes
            (Auto, Manual, Plan mode, Bypass all). It&apos;s part of Pro. After you activate your license key
            with <code className="font-mono text-caption-1-medium text-text-primary">boardui login</code>, one
            command adds the panel to your repo. You wire it to your agent through{" "}
            <code className="font-mono text-caption-1-medium text-text-primary">onSubmit</code>,{" "}
            <code className="font-mono text-caption-1-medium text-text-primary">onModelChange</code>,{" "}
            <code className="font-mono text-caption-1-medium text-text-primary">onEffortChange</code> and{" "}
            <code className="font-mono text-caption-1-medium text-text-primary">onPermissionChange</code>.
          </P>
          <P>
            <DocLink href="/components/composer-panel" label="Composer Panel" />
          </P>
          <P>
            The CLI copies the source into your project and adds the npm packages each component needs. This adds
            the free Agent Thinking:
          </P>
          <CodeBlock code="npx boardui@latest add agent-thinking" />
          <P>
            To hand the job to your coding agent, add the BoardUI MCP server and ask for the screen you want. Your
            agent reads the component list and the usage examples and writes the files. You&apos;ll find setup for
            Cursor and VS Code on the <Link href="/components" className="text-accent-600 underline">MCP page</Link>.
          </P>
          <P>Add BoardUI to Claude Code or Codex</P>
          <CodeBlock code={"claude mcp add boardui -- npx -y boardui@latest mcp\ncodex mcp add boardui -- npx -y boardui@latest mcp"} />
        </Section>

        <Section title="Agent components and dashboards on one design system">
          <P>
            We design the components manually in Figma using the same 400+ tokens as the code. That consistency
            carries across agent interfaces and dashboards, so a chart inside a chat thread feels like part of the
            same product. You can customize both sets through 11 accent tokens, with dark mode built in.
          </P>
          <P>The task list and the research trail share a log engine and animate their rows the same way.</P>
          <P>
            To see BoardUI next to shadcn/ui, HeroUI, Mantine and six others, read{" "}
            <Link href="/blog/best-react-design-systems" className="text-accent-600 underline">
              our comparison of the 10 best React design systems
            </Link>
            , where we built the same settings dialog with each.
          </P>
        </Section>

        <Section title="The agentic UI components and what each one does">
          <SubSection title="Thinking and progress">
            <P>
              Before the first word of an answer, Agent Thinking shows a timer and a label you choose, such as
              &ldquo;Searching the docs&rdquo;. It&apos;s free, with four animations to switch between:{" "}
              <DocLink href="/components/agent-thinking" label="Agent Thinking" />
            </P>
            <P>
              For longer runs, Agent Progress steps through a plan at a pace you set and marks the active step.
              Collapsed, it shrinks to one row with the current step and how many steps are left.
            </P>
          </SubSection>
          <SubSection title="Task list">
            <P>
              Each task your agent works on gets its own row in Task List, with its steps and the files it touched.
              With <code className="font-mono text-caption-1-medium text-text-primary">collapseOnComplete=&quot;all&quot;</code>,
              finished tasks stay open until the whole run ends and then close together.
            </P>
            <P>
              <DocLink href="/components/task-list" label="Task List" />
            </P>
          </SubSection>
          <SubSection title="Research trail">
            <P>
              Web Search stacks the logos of the sites each step read, and a chevron opens their titles and
              domains. Each step can also show its query and a tally such as &ldquo;5 results&rdquo;. The first
              version listed every source in a bordered table, and in a running thread that table outweighed
              everything around it.
            </P>
            <P>
              <DocLink href="/components/web-search" label="Web Search" />
            </P>
          </SubSection>
          <SubSection title="Clarifying questions">
            <P>
              Your agent can check its assumptions with Questionnaire before it starts the work, one question per
              step. On single-choice questions the options are numbered, so your users can answer with the number
              keys, and a pick moves on to the next question. Multiple-choice questions use checkboxes, and an
              optional Other row takes a free-text answer.
            </P>
            <P>
              <DocLink href="/components/questionnaire" label="Questionnaire" />
            </P>
          </SubSection>
          <SubSection title="Context and usage limits">
            <P>
              When a long conversation starts forgetting its first messages, Agent Limits Card shows where the
              context window went: the system prompt, tools, memory files and messages. It also lists each plan
              limit with the time it resets.
            </P>
            <P>
              <DocLink href="/components/agent-limits-card" label="Agent Limits" />
            </P>
          </SubSection>
          <SubSection title="Agent identity">
            <P>
              We draw each avatar live on a canvas, and each one runs its own clock for blinks and glances. In
              Agent Creator you give an agent a name, a description and a voice, and pick one of nine paper shapes
              with an expression and a color.
            </P>
            <P>
              <DocLink href="/components/agent-creator" label="Agent Creator" />
            </P>
          </SubSection>
        </Section>

        <Section title="Run several agents in one workspace">
          <P>
            Multi-agent Chat is a Pro template built on Composer Panel and Agent Creator. It ships with ten sample
            agents, seven starter conversations, one-to-one and group chats, and a searchable sidebar with pinning
            and renaming. In a group chat the agents answer one at a time, and the avatar of the agent answering
            spins twice and faces you before its reply streams in. You plug your backend in through an{" "}
            <code className="font-mono text-caption-1-medium text-text-primary">onRespond</code> function that
            receives the agent, the messages and an abort signal.
          </P>
          <P>
            <DocLink href="/templates/multi-agent-chat" label="Multi-agent Chat" />
          </P>
          <P>
            Three more Pro templates cover single-agent products. AI Chat is a coding-agent screen in the style of
            Cursor or Claude Code, and AI Image Generation runs on the same shell. AI Profile turns a user&apos;s
            agent activity into a contributions profile with agent and token charts.
          </P>
          <P>
            Chat Starter is free and connects to a real model: set one{" "}
            <code className="font-mono text-caption-1-medium text-text-primary">AI_API_KEY</code> from OpenAI,
            Anthropic, Google, OpenRouter, Groq, xAI or the Vercel AI Gateway, and it reads the provider from the
            key.
          </P>
        </Section>

        <Section title="Use BoardUI for your dashboards, agent or not">
          <P>
            Agent products need more than chat interfaces. BoardUI also includes 19 chart cards, a sortable and
            paginated Data Table, and a free Data Grid with editable cells, filters and CSV export. Pro adds
            Finance, Marketing and Home dashboards, plus Medical Profile and Project Board templates.
          </P>
          <P>
            <DocLink href="/templates/finance" label="Finance Dashboard" />
          </P>
        </Section>

        <Section title="Start free, add the agent set when you need it">
          <P>
            The free tier has 73 components, Agent Thinking, Composer Loader, Chat Starter and the Data Grid among
            them, plus the MCP server and the agent rules.{" "}
            <Link href="/pro-components" className="text-accent-600 underline">Pro</Link> adds the rest of the
            agent set and the 10 Pro templates as a one-time purchase. At launch pricing, as of October 2026, Pro
            costs €149 with a year of updates, €199 with lifetime updates, or €349 for a team of up to five
            developers.
          </P>
          <P>Run init in your project, then add components by name:</P>
          <CodeBlock code="npx boardui@latest init" />
        </Section>

        <Link
          href="/blog"
          className="inline-flex items-center gap-1.5 text-body-medium text-text-secondary transition-colors hover:text-text-primary"
        >
          <RiArrowLeftLine className="size-4" aria-hidden />
          Back to all articles
        </Link>
      </article>
    </AppShell>
  );
}
