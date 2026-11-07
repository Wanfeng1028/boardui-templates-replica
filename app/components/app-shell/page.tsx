"use client";

import { useState } from "react";
import { RiCheckLine, RiFileCopyLine, RiArrowLeftLine } from "@remixicon/react";

import { AppShell } from "@/components/application/app-shell/app-shell";
import { Chip } from "@/components/base/badges/chip";
import { Button } from "@/components/base/buttons/button";
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

function CodeBlock({ code }: { code: string }) {
  return (
    <pre className="overflow-x-auto rounded-xl border border-border-button-default bg-background-secondary-default p-4 font-mono text-caption-1-medium leading-6 text-text-primary">
      {code}
    </pre>
  );
}

const INSTALL_CMD = "npx boardui@latest add app-shell";

const FRAME_CODE = `import { AppShell } from "@/components/application/app-shell/app-shell";

export default function ChatPage() {
  return (
    <AppShell title="Chat">
      <p>Your page goes here.</p>
    </AppShell>
  );
}`;

const ACTIONS_CODE = `{/* The default header carries the bell, Filters and Create ticket. */}
<AppShell title="Chat" />

{/* Pass null for a bare header, or your own actions. */}
<AppShell title="Chat" actions={null} />

{/* Narrower content column (the default is 1300px). */}
<AppShell title="Chat" columnClassName="max-w-[964px]" />`;

/** App Shell detail page. Source: registry description (no standalone docs page on boardui.com). */
export default function AppShellPage() {
  return (
    <AppShell title="App Shell" actions={null} columnClassName="max-w-[964px]">
      <div className="flex flex-col gap-8 pb-8">
        <div className="flex flex-col gap-3">
          <div className="flex items-center gap-2">
            <Chip variant="bold" color="lime">
              Free
            </Chip>
          </div>
          <p className="text-body-regular text-text-secondary">
            Page frame for the chat starter: the sidebar, a phone drawer, and a titled content card, carrying the
            starter&rsquo;s own navigation so the sidebar only links to pages the app has. Every page on this site
            is framed by it — the breadcrumb, the title, and the header actions you see above are the shell
            itself.
          </p>
        </div>

        <Section title="Preview">
          <p className="text-body-regular text-text-secondary">
            A shell inside the shell: the same frame, titled “Preview”, holding sample content. On a wide screen
            the sidebar sits on the left; below the large breakpoint it rides in as an overlay drawer from the
            menu button.
          </p>
          <div className="h-[560px] overflow-hidden rounded-3xl border border-border-button-default">
            <AppShell title="Preview" actions={null} className="h-full">
              <div className="flex flex-col gap-3 rounded-3xl border border-border-button-default bg-background-primary-default p-6">
                <h3 className="text-title-3-semibold text-text-primary">Content goes here</h3>
                <p className="text-body-regular text-text-secondary">
                  The shell owns the sidebar, the breadcrumb and the header. Everything below the title is yours.
                </p>
                <div>
                  <Button variant="secondary" size="small">
                    A sample action
                  </Button>
                </div>
              </div>
            </AppShell>
          </div>
        </Section>

        <Section title="Installation">
          <p className="text-body-regular text-text-secondary">
            You can add this page frame using our CLI or manually. The CLI copies the component source (with its
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

        <Section title="The frame">
          <p className="text-body-regular text-text-secondary">
            One component wraps a whole page: the dashboard sidebar on the left, a titled content card in the
            middle, and the notification bell plus header actions on the right. The sidebar carries the
            starter&rsquo;s own navigation, so it only links to pages the app has — the home page is a chat with no
            other template entry, so the templates index is the way in from there.
          </p>
          <CodeBlock code={FRAME_CODE} />
        </Section>

        <Section title="Header actions and column">
          <p className="text-body-regular text-text-secondary">
            <code className="font-mono text-caption-1-medium text-text-primary">title</code> sets the breadcrumb
            and the heading; <code className="font-mono text-caption-1-medium text-text-primary">heading</code>{" "}
            overrides the heading alone. <code className="font-mono text-caption-1-medium text-text-primary">actions</code> replaces
            the default header set, and{" "}
            <code className="font-mono text-caption-1-medium text-text-primary">columnClassName</code> resizes the
            content column.
          </p>
          <CodeBlock code={ACTIONS_CODE} />
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
