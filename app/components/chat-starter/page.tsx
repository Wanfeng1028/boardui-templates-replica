"use client";

import { useState } from "react";
import Link from "next/link";
import { RiArrowLeftLine, RiArrowRightLine, RiCheckLine, RiFileCopyLine } from "@remixicon/react";

import { AppShell } from "@/components/application/app-shell/app-shell";
import { Chip } from "@/components/base/badges/chip";
import { ButtonLink } from "@/components/base/buttons/button";

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

function CodeBlock({ code }: { code: string }) {
  return (
    <pre className="overflow-x-auto rounded-xl border border-border-button-default bg-background-secondary-default p-4 font-mono text-caption-1-medium leading-6 text-text-primary">
      {code}
    </pre>
  );
}

const INSTALL_CMD = "npx boardui@latest add agent-chat";

const RUN_LOCAL_CODE = `npm install
cp .env.example .env.local   # put your key in AI_API_KEY
npm run dev`;

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
    <AppShell title="Chat Starter" columnClassName="max-w-[964px]">
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

        <div className="rounded-3xl border border-border-button-default bg-background-primary-default p-6">
          <div className="flex flex-col items-start gap-3">
            <h2 className="text-title-2-medium text-text-primary">Live on this site</h2>
            <p className="text-body-regular text-text-secondary">
              This site is the chat starter itself — the home page is the working chat, with the sidebar, composer,
              thinking indicator, and history rail described above.
            </p>
            <ButtonLink href="/" trailingIcon={RiArrowRightLine}>
              Open the chat
            </ButtonLink>
          </div>
        </div>

        <Section title="Deploy to Vercel">
          <p className="text-body-regular text-text-secondary">
            Click Deploy, paste one API key when Vercel asks for it, and the first deploy already answers. Vercel
            copies the starter into your own GitHub account and builds it there. The key goes straight into your
            project’s environment and never touches BoardUI.
          </p>
          <p className="text-body-regular text-text-secondary">
            Requests bill to whoever owns the key, and anyone with the URL can send them. Create the key with a
            spending limit, and put a rate limit in front of /api/chat before pointing the public at it.
          </p>
        </Section>

        <Section title="Installation">
          <p className="text-body-regular text-text-secondary">
            Already have a Next.js project? The same screen installs with the CLI, runtime included.
          </p>
          <div className="flex items-center justify-between gap-3 rounded-xl border border-border-button-default bg-background-secondary-default px-4 py-3">
            <code className="font-mono text-caption-1-medium text-text-primary">{INSTALL_CMD}</code>
            <CopyButton text={INSTALL_CMD} />
          </div>
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
          <CodeBlock code={RUN_LOCAL_CODE} />
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
    </AppShell>
  );
}
