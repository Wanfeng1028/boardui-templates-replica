"use client";

import Link from "next/link";
import { RiArrowLeftLine, RiGithubFill } from "@remixicon/react";

import { DocsLayout } from "@/components/application/docs/docs-layout";
import { AgentChat } from "@/components/application/agent-chat/agent-chat";
import { CodeTabs, PkgCommand } from "@/components/application/docs/code-tabs";
import { TemplatePreview } from "@/components/application/docs/template-preview";
import { Chip } from "@/components/base/badges/chip";
import { ButtonLink } from "@/components/base/buttons/button";

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="flex flex-col gap-3">
      <h2 className="text-title-2-medium text-text-primary">{title}</h2>
      {children}
    </section>
  );
}

const PREVIEW_CODE = `import { AgentChat } from "@/components/application/agent-chat/agent-chat";

export default function Page() {
  // Full screen: app sidebar, chat with composer and
  // thinking indicator, history rail kept in the browser.
  // Answers through /api/chat on your own provider key.
  return <AgentChat />;
}`;

const RUN_LOCAL_TABS = [
  {
    value: "npm",
    code: `npm install
cp .env.example .env.local   # put your key in AI_API_KEY
npm run dev`,
  },
  {
    value: "pnpm",
    code: `pnpm install
cp .env.example .env.local   # put your key in AI_API_KEY
pnpm dev`,
  },
];

const VERCEL_DEPLOY_URL =
  "https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2FBoardUI%2Fboardui&env=AI_API_KEY&envDescription=Your+model+provider+key%3A+OpenAI%2C+Anthropic%2C+Google%2C+OpenRouter%2C+or+Vercel+AI+Gateway.+The+provider+is+read+from+the+key+itself.&envLink=https%3A%2F%2Fwww.boardui.com%2Fcomponents%2Fchat-starter&project-name=boardui-chat-starter&repository-name=boardui-chat-starter";

function VercelMark({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" aria-hidden="true" className={className}>
      <path d="M23 21.6479H1L12 2.35205L23 21.6479Z" />
    </svg>
  );
}

const KEY_ROWS: { prefix: string; provider: string }[] = [
  { prefix: "sk-ant-...", provider: "Anthropic" },
  { prefix: "sk-or-...", provider: "OpenRouter" },
  { prefix: "sk-...", provider: "OpenAI" },
  { prefix: "AIza...", provider: "Google Gemini" },
  { prefix: "vck_...", provider: "Vercel AI Gateway" },
  { prefix: "gsk_...", provider: "Groq" },
  { prefix: "xai-...", provider: "xAI" },
];

/** Chat Starter detail page, mirroring boardui.com/components/chat-starter. */
export default function ChatStarterPage() {
  return (
    <DocsLayout variant="library" title="Chat Starter">
      <div className="flex flex-col gap-8 pb-8">
        <div className="flex flex-col gap-3">
          <div className="flex items-center gap-2">
            <Chip variant="bold" color="lime">
              Free
            </Chip>
          </div>
          <p className="text-body-regular text-text-secondary">
            A working AI chat app, free and deployable in a click. The app sidebar, a pill composer with model chip
            and stop control, a thinking indicator, streamed replies with copy and read-aloud actions, and a chat
            history rail that lives in the visitor’s browser. Behind it, one route reads your provider key
            server-side and streams answers with the Vercel AI SDK. Everything installs as source, so it is yours
            to change.
          </p>
        </div>

        <section id="preview" className="flex scroll-mt-14 flex-col gap-2 pt-4">
          <TemplatePreview title="Chat starter" slug="chat-starter" previewCode={PREVIEW_CODE}>
            <AgentChat contained />
          </TemplatePreview>
        </section>

        <Section title="Deploy to Vercel">
          <div className="flex flex-col gap-5 rounded-2xl border border-separator-border bg-background-secondary-default p-6">
            <p className="text-headline-medium text-text-secondary">
              Click Deploy, paste one API key when Vercel asks for it, and the first deploy already answers. Vercel
              copies the starter into your own GitHub account and builds it there. The key goes straight into your
              project’s environment and never touches BoardUI.
            </p>
            <div className="flex flex-wrap gap-2">
              <ButtonLink href={VERCEL_DEPLOY_URL} target="_blank" rel="noreferrer" leadingIcon={VercelMark}>
                Deploy to Vercel
              </ButtonLink>
              <ButtonLink
                href="https://github.com/BoardUI/boardui"
                target="_blank"
                rel="noreferrer"
                variant="secondary"
                leadingIcon={RiGithubFill}
              >
                View on GitHub
              </ButtonLink>
            </div>
            <p className="text-body-regular text-text-tertiary">
              Requests bill to whoever owns the key, and anyone with the URL can send them. Create the key with a
              spending limit, and put a rate limit in front of /api/chat before pointing the public at it.
            </p>
          </div>
        </Section>

        <Section title="Installation">
          <p className="text-body-regular text-text-secondary">
            Already have a Next.js project? The same screen installs with the CLI, runtime included.
          </p>
          <PkgCommand
            npm="npx boardui@latest add agent-chat"
            pnpm="pnpm dlx boardui@latest add agent-chat"
            yarn="yarn dlx boardui@latest add agent-chat"
          />
          <p className="text-body-regular text-text-secondary">
            Dark mode ready — this component follows BoardUI semantic tokens automatically.
          </p>
        </Section>

        <Section title="Bring your own key">
          <p className="text-body-regular text-text-secondary">
            One variable, AI_API_KEY. The provider is read from the key itself, so there is nothing else to
            configure:
          </p>
          <div className="overflow-hidden rounded-xl border border-border-button-default">
            {KEY_ROWS.map((row) => (
              <div
                key={row.prefix}
                className="flex items-center justify-between gap-3 border-b border-separator-border bg-background-primary-default px-4 py-2.5 last:border-b-0"
              >
                <code className="font-mono text-caption-1-medium text-text-primary">{row.prefix}</code>
                <span className="text-body-regular text-text-secondary">{row.provider}</span>
              </div>
            ))}
          </div>
          <p className="text-body-regular text-text-secondary">
            Create the key with a spending limit where the provider offers one. OpenRouter can cap the credits a
            key may spend, and OpenAI has usage limits per project. The key never reaches the browser, but the chat
            is open to anyone who has the URL, so the cap is what bounds the cost.
          </p>
          <p className="text-body-regular text-text-secondary">
            Set CHAT_MODEL to pick a different model. For Mistral or DeepSeek, whose keys have no recognisable
            shape, add AI_PROVIDER=mistral or AI_PROVIDER=deepseek. Any OpenAI-compatible server, from Ollama on
            your laptop to LiteLLM in production, works with AI_BASE_URL and CHAT_MODEL. Every provider’s usual
            variable (OPENAI_API_KEY, ANTHROPIC_API_KEY, and so on) works too.
          </p>
        </Section>

        <Section title="Run it locally">
          <p className="text-body-regular text-text-secondary">
            Clone your deployed repo, or the starter itself, and give it a key:
          </p>
          <CodeTabs tabs={RUN_LOCAL_TABS} />
        </Section>

        <Section title="What’s included">
          <p className="text-body-regular text-text-secondary">
            Free components only, installed as source: the app sidebar with team and user menus, the composer and
            its loading treatment, the thinking indicator, the chat history rail with rename, unread and export, the
            message actions, and every base component they depend on. The deployed app also carries a dashboard with
            the two free charts and sign-in and sign-up screens built from the same free components, so the sidebar
            only links to pages that exist. Plus app/api/chat/route.ts, the runtime, and BoardUI’s design rules for
            coding agents in AGENTS.md, so the next screen an agent builds speaks the same language. Pro templates
            install into the same project when you want them.
          </p>
        </Section>

        <Link
          href="/components"
          className="inline-flex items-center gap-1.5 text-body-medium text-text-secondary transition-colors hover:text-text-primary"
        >
          <RiArrowLeftLine className="size-4" aria-hidden />
          Back to all components
        </Link>
      </div>
    </DocsLayout>
  );
}
