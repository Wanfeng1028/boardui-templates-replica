"use client";

import { useState } from "react";
import Link from "next/link";
import {
  RiArrowLeftLine,
  RiCheckLine,
  RiFileCopyLine,
  RiFileTextLine,
  RiFolder3Line,
  RiHome5Line,
  RiHomeLine,
  RiSettings3Line,
  RiUserLine,
} from "@remixicon/react";

import { DocsLayout } from "@/components/application/docs/docs-layout";
import { Avatar } from "@/components/base/avatar/avatar";
import { Chip } from "@/components/base/badges/chip";
import { Breadcrumb, BreadcrumbItem } from "@/components/base/breadcrumb/breadcrumb";

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

const INSTALL_CMD = "npx boardui@latest add breadcrumb";

const AVATARS_CODE = `{/* Items take arbitrary leading content - avatars, icons, dots */}
<Breadcrumb aria-label="Team">
  <BreadcrumbItem href="#">
    <Avatar size="xs" color="blue" initials="B" />
    Board team
  </BreadcrumbItem>
  <BreadcrumbItem current icon={RiHomeLine}>Home</BreadcrumbItem>
</Breadcrumb>`;

/** Breadcrumb detail page, mirroring boardui.com/components/breadcrumb. */
export default function BreadcrumbPage() {
  return (
    <DocsLayout variant="library" title="Breadcrumb">
      <div className="flex flex-col gap-8 pb-8">
        <div className="flex flex-col gap-3">
          <div className="flex items-center gap-2">
            <Chip variant="bold" color="lime">
              Free
            </Chip>
          </div>
          <p className="text-body-regular text-text-secondary">
            The ancestor trail from the dashboard header. Interactive items darken on hover with a soft background
            pill; the current page is non-interactive. Items accept leading icons or avatars.
          </p>
        </div>

        <Section title="Installation">
          <p className="text-body-regular text-text-secondary">
            You can add this breadcrumb component using our CLI or manually. The CLI copies the component source
            (with its internal dependencies) into your project and installs any required npm packages.
          </p>
          <div className="flex items-center justify-between gap-3 rounded-xl border border-border-button-default bg-background-secondary-default px-4 py-3">
            <code className="font-mono text-caption-1-medium text-text-primary">{INSTALL_CMD}</code>
            <CopyButton text={INSTALL_CMD} />
          </div>
          <p className="text-body-regular text-text-secondary">
            Dark mode ready — this component follows BoardUI semantic tokens automatically.
          </p>
        </Section>

        <Section title="With avatars">
          <p className="text-body-regular text-text-secondary">
            Items accept arbitrary leading content — pass an xs Avatar for team/user trails, or an icon component
            reference for glyphs.
          </p>
          <Demo>
            <div className="flex flex-col items-start gap-2">
              <Breadcrumb>
                <BreadcrumbItem href="/">Home</BreadcrumbItem>
                <BreadcrumbItem href="/components">Team</BreadcrumbItem>
                <BreadcrumbItem current>Billing</BreadcrumbItem>
              </Breadcrumb>
              <Breadcrumb>
                <BreadcrumbItem href="/">Library</BreadcrumbItem>
                <BreadcrumbItem href="/components">Charts</BreadcrumbItem>
                <BreadcrumbItem current>Revenue</BreadcrumbItem>
              </Breadcrumb>
              <Breadcrumb>
                <BreadcrumbItem href="/" icon={RiHome5Line}>
                  Home
                </BreadcrumbItem>
                <BreadcrumbItem href="/components" icon={RiSettings3Line}>
                  Settings
                </BreadcrumbItem>
                <BreadcrumbItem current icon={RiUserLine}>
                  Profile
                </BreadcrumbItem>
              </Breadcrumb>
              <Breadcrumb>
                <BreadcrumbItem href="/" icon={RiFolder3Line}>
                  Files
                </BreadcrumbItem>
                <BreadcrumbItem href="/components" icon={RiFolder3Line}>
                  Design
                </BreadcrumbItem>
                <BreadcrumbItem current icon={RiFileTextLine}>
                  Brief
                </BreadcrumbItem>
              </Breadcrumb>
              <Breadcrumb aria-label="Team">
                <BreadcrumbItem href="#">
                  <Avatar size="xs" color="blue" initials="B" />
                  Board team
                </BreadcrumbItem>
                <BreadcrumbItem current icon={RiHomeLine}>
                  Home
                </BreadcrumbItem>
              </Breadcrumb>
            </div>
          </Demo>
          <CodeBlock code={AVATARS_CODE} />
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
