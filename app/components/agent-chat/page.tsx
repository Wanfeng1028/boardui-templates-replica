"use client";

import { useState } from "react";
import Link from "next/link";
import { RiArrowLeftLine, RiCheckLine, RiFileCopyLine } from "@remixicon/react";

import { AppShell } from "@/components/application/app-shell/app-shell";
import { Chip } from "@/components/base/badges/chip";
import { AgentChat } from "@/components/application/agent-chat/agent-chat";
import { LinkButton } from "@/components/base/buttons/link-button";

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

function Demo({ children }: { children: React.ReactNode }) {
  return (
    <div className="overflow-hidden rounded-3xl border border-border-button-default bg-background-primary-default">
      {children}
    </div>
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

const KEY_CODE = `# One variable. The provider is read from the key itself:
#   sk-ant- ... Anthropic    sk-or- ... OpenRouter
#   sk- ... OpenAI           AIza ... Google Gemini
#   vck_ ... Vercel AI Gateway   gsk_ ... Groq   xai- ... xAI
AI_API_KEY=sk-...

# Pick a different model, or pin the provider for keys with no
# recognisable shape (Mistral, DeepSeek):
CHAT_MODEL=gpt-5
AI_PROVIDER=mistral # or deepseek

# Any OpenAI-compatible server works too, from Ollama on your laptop
# to LiteLLM in production:
AI_BASE_URL=http://localhost:11434/v1`;

const LOCAL_CODE = `npm install
cp .env.example .env.local # put your key in AI_API_KEY
npm run dev`;

/** Agent Chat detail page. Source: boardui.com/components/chat-starter (the registry block is agent-chat). */
export default function AgentChatPage() {
  return (
    <AppShell title="Agent Chat" actions={null} columnClassName="max-w-[964px]">
      <div className="flex flex-col gap-8 pb-8">
        <div className="flex flex-col gap-3">
          <div className="flex items-center gap-2">
            <Chip variant="bold" color="lime">
              Free
            </Chip>
          </div>
          <p className="text-body-regular text-text-secondary">
            A working chat app: app sidebar, streaming replies, thinking indicator, a composer pill with stop
            control, a chat-history rail with local thread switching, and a setup notice when no provider key is
            set. Behind it, one route reads your provider key server-side and streams answers with the Vercel AI
            SDK. Everything installs as source, so it is yours to change.
          </p>
        </div>

        <Section title="Preview">
          <p className="text-body-regular text-text-secondary">
            The live starter below runs against the built-in demo transport, so it answers without a key. With a
            key set, the same screen streams from your provider through <code className="font-mono text-caption-1-medium text-text-primary">/api/chat</code>.
          </p>
          <Demo>
            <div className="h-[560px] [--template-preview-height:560px]">
              <AgentChat contained />
            </div>
          </Demo>
        </Section>

        <Section title="Installation">
          <p className="text-body-regular text-text-secondary">
            You can add this chat app using our CLI or manually. The CLI copies the component source (with its
            internal dependencies) into your project and installs any required npm packages.
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
            One variable, <code className="font-mono text-caption-1-medium text-text-primary">AI_API_KEY</code>.
            The provider is read from the key itself, so there is nothing else to configure. Create the key with a
            spending limit where the provider offers one — the key never reaches the browser, but the chat is open
            to anyone who has the URL, so the cap is what bounds the cost.
          </p>
          <CodeBlock code={KEY_CODE} />
        </Section>

        <Section title="Run it locally">
          <p className="text-body-regular text-text-secondary">
            Clone your deployed repo, or the starter itself, and give it a key.
          </p>
          <CodeBlock code={LOCAL_CODE} />
        </Section>

        <Section title="What&rsquo;s included">
          <p className="text-body-regular text-text-secondary">
            Free components only, installed as source: the app sidebar with team and user menus, the composer and
            its loading treatment, the thinking indicator, the chat history rail with rename, unread and export,
            the message actions, and every base component they depend on. Plus{" "}
            <code className="font-mono text-caption-1-medium text-text-primary">app/api/chat/route.ts</code>, the
            runtime, and BoardUI&rsquo;s design rules for coding agents in{" "}
            <code className="font-mono text-caption-1-medium text-text-primary">AGENTS.md</code>, so the next
            screen an agent builds speaks the same language.
          </p>
          <Link href="/templates/ai-chat" className="text-body-medium text-text-secondary hover:text-text-primary">
            See it inside the AI Chat template →
          </Link>
        </Section>

        <div>
          <LinkButton href="/components" leadingIcon={RiArrowLeftLine}>
            Back to components
          </LinkButton>
        </div>
      </div>
    </AppShell>
  );
}
