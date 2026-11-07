"use client";

import { useState } from "react";
import { RiCheckLine, RiFileCopyLine, RiArrowLeftLine } from "@remixicon/react";

import { AppShell } from "@/components/application/app-shell/app-shell";
import { Chip } from "@/components/base/badges/chip";
import { ImportantAlertsCard } from "@/components/application/medical/important-alerts-card";
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
    <div className="rounded-3xl border border-border-button-default bg-background-primary-default p-6">
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

const INSTALL_CMD = "npx boardui@latest add important-alerts-card";

const USAGE_CODE = `import { ImportantAlertsCard } from "@/components/application/medical/important-alerts-card";

<ImportantAlertsCard />`;

/** Important Alerts Card detail page. Source: registry + llms.txt (medical-profile section). */
export default function ImportantAlertsCardPage() {
  return (
    <AppShell title="Important Alerts Card" actions={null} columnClassName="max-w-[964px]">
      <div className="flex flex-col gap-8 pb-8">
        <div className="flex flex-col gap-3">
          <div className="flex items-center gap-2">
            <Chip variant="bold" color="lime">
              Free
            </Chip>
          </div>
          <p className="text-body-regular text-text-secondary">
            Scrollable alert feed with tinted icon circles and date pills. One of the cards of the Medical Profile
            template: medication, vitals and appointment alerts, each with a soft date pill pinned to the
            row&rsquo;s top-right corner.
          </p>
        </div>

        <Section title="Preview">
          <p className="text-body-regular text-text-secondary">
            The feed runs flush to the card&rsquo;s bottom edge and clips there — the third row is visibly cut off
            by the card bounds, as in the design. Scroll to the bottom and a card-colored gradient fades in over
            the top edge so rows dissolve out instead of being sharply cut by the header.
          </p>
          <Demo>
            <ImportantAlertsCard />
          </Demo>
        </Section>

        <Section title="Installation">
          <p className="text-body-regular text-text-secondary">
            You can add this card using our CLI or manually. The CLI copies the component source (with its
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

        <Section title="The feed">
          <p className="text-body-regular text-text-secondary">
            Each row is a tinted icon circle, a title with a description, and a date pill. The week switcher above
            the feed is the shared <code className="font-mono text-caption-1-medium text-text-primary">WeekRangePill</code>,
            also used by the Most Active Days card. The scroll content ends with a 10px pad so the last alert
            doesn&rsquo;t sit hard against the edge once you reach the bottom.
          </p>
          <CodeBlock code={USAGE_CODE} />
        </Section>

        <Section title="In the Medical Profile template">
          <p className="text-body-regular text-text-secondary">
            The card ships beside the Patient Info Card on the Medical Profile template, in the same row as the
            activity and sleep cards.
          </p>
          <LinkButton href="/templates/medical-profile" variant="secondary">
            Open the Medical Profile template
          </LinkButton>
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
