"use client";

import { useState } from "react";
import {
  RiArrowLeftLine,
  RiArrowRightLine,
  RiCheckLine,
  RiDownloadLine,
  RiExternalLinkLine,
  RiFileCopyLine,
} from "@remixicon/react";

import { DocsLayout } from "@/components/application/docs/docs-layout";
import { LinkButton } from "@/components/base/buttons/link-button";
import { cx } from "@/utils/cx";

function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);
  return (
    <button
      type="button"
      onClick={async () => {
        try {
          await navigator.clipboard.writeText(text);
          setCopied(true);
          window.setTimeout(() => setCopied(false), 1500);
        } catch {
          // Clipboard access can be refused; leave the icon unchanged.
        }
      }}
      className="flex shrink-0 items-center gap-1.5 rounded-full border border-border-button-default bg-background-primary-default px-3 py-1.5 text-caption-1-semibold text-text-secondary hover:text-text-primary"
      aria-label="Copy install command"
    >
      {copied ? <RiCheckLine className="size-4" /> : <RiFileCopyLine className="size-4" />}
      {copied ? "Copied" : "Copy"}
    </button>
  );
}

function CodeBlock({ code }: { code: string }) {
  return (
    <pre className="overflow-x-auto rounded-xl border border-border-button-default bg-background-secondary-default p-4 font-mono text-body-2-regular text-text-primary">
      <code>{code}</code>
    </pre>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="flex flex-col gap-4">
      <h2 className="text-title-2-medium text-text-primary">{title}</h2>
      {children}
    </section>
  );
}

function Demo({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex items-center justify-center rounded-3xl border border-border-button-default bg-background-primary-default p-6">
      {children}
    </div>
  );
}

const INSTALL_CMD = "npx boardui@latest add link-button";

const ICONS_CODE = `{/* Icons render at the size's scale - pass the Remix Icon reference */}
<LinkButton href="/changelog" trailingIcon={RiExternalLinkLine}>
  View changelog
</LinkButton>
<LinkButton size="small" leadingIcon={RiDownloadLine} onClick={download}>
  Download report
</LinkButton>
<LinkButton size="xs" variant="secondary" trailingIcon={RiArrowRightLine}>
  See all
</LinkButton>`;

/**
 * Link Button — docs page replica.
 * Source: boardui.com/components/link-button. Free component.
 */
export default function LinkButtonPage() {
  return (
    <DocsLayout variant="library" title="Link Button">
      <div className="flex flex-col gap-8 pb-8">
        <div className="flex flex-col gap-3">
          <span
            className={cx(
              "w-fit rounded-full border border-border-button-default px-2.5 py-0.5",
              "text-caption-1-semibold text-text-secondary",
            )}
          >
            Free
          </span>
          <p className="text-body-regular text-text-secondary">
            An inline text action on Button&apos;s size scale but without the container — no fill
            or border, just the label with an underline on hover. Primary (blue) and secondary
            (muted) variants; renders an anchor when href is passed, otherwise a button, so the
            same action works in copy or as a handler.
          </p>
        </div>

        <Section title="Installation">
          <p className="text-body-regular text-text-secondary">
            You can add this link button component using our CLI or manually. The CLI copies the
            component source (with its internal dependencies) into your project and installs any
            required npm packages.
          </p>
          <div className="flex items-center justify-between gap-3 rounded-xl border border-border-button-default bg-background-secondary-default px-4 py-3">
            <code className="overflow-x-auto font-mono text-body-2-regular text-text-primary">
              {INSTALL_CMD}
            </code>
            <CopyButton text={INSTALL_CMD} />
          </div>
          <p className="text-body-regular text-text-secondary">
            Dark mode ready — this component follows BoardUI semantic tokens automatically.
          </p>
        </Section>

        <Section title="Icons and sizes">
          <p className="text-body-regular text-text-secondary">
            <code>leadingIcon</code> / <code>trailingIcon</code> take a Remix Icon reference and
            render at the size&apos;s icon scale — 20px for medium, 18px for small, 14px for xs.
          </p>
          <Demo>
            <div className="flex flex-col items-center gap-3">
              <LinkButton href="/changelog" trailingIcon={RiExternalLinkLine}>
                View changelog
              </LinkButton>
              <LinkButton size="small" leadingIcon={RiDownloadLine} onClick={() => {}}>
                Download report
              </LinkButton>
              <LinkButton size="xs" variant="secondary" trailingIcon={RiArrowRightLine}>
                See all
              </LinkButton>
            </div>
          </Demo>
          <CodeBlock code={ICONS_CODE} />
        </Section>

        <div>
          <LinkButton href="/components" leadingIcon={RiArrowLeftLine}>
            Back to components
          </LinkButton>
        </div>
      </div>
    </DocsLayout>
  );
}
