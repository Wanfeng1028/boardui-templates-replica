"use client";

import { useState } from "react";
import { RiArrowLeftLine, RiCheckLine, RiFileCopyLine, RiLayoutGridLine } from "@remixicon/react";

import { AppShell } from "@/components/application/app-shell/app-shell";
import { Avatar } from "@/components/base/avatar/avatar";
import { Button } from "@/components/base/buttons/button";
import { LinkButton } from "@/components/base/buttons/link-button";

function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);
  return (
    <Button
      variant="secondary"
      size="medium"
      leadingIcon={copied ? RiCheckLine : RiFileCopyLine}
      onClick={async () => {
        try {
          await navigator.clipboard.writeText(text);
          setCopied(true);
          window.setTimeout(() => setCopied(false), 2000);
        } catch {
          // Clipboard access can be refused; leave the icon unchanged.
        }
      }}
    >
      {copied ? "Copied" : "Copy"}
    </Button>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="flex flex-col gap-3">
      <h2 className="text-title-3-semibold text-text-primary">{title}</h2>
      {children}
    </section>
  );
}

function Demo({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex flex-col items-center gap-4 rounded-3xl border border-border-button-default bg-background-primary-default p-6">
      {children}
    </div>
  );
}

function Code({ code }: { code: string }) {
  return (
    <div className="overflow-x-auto rounded-3xl border border-border-button-default bg-background-secondary-default p-4">
      <pre className="text-body-2-regular whitespace-pre text-text-primary">{code}</pre>
    </div>
  );
}

const SIZES_CODE = `<Avatar size="xs" initials="M" /> {/* 20px */}
<Avatar size="sm" initials="M" /> {/* 24px */}
<Avatar size="md" initials="M" /> {/* 32px */}
<Avatar size="lg" initials="M" /> {/* 36px */}`;

const TINTS_CODE = `<Avatar color="neutral" initials="M" /> {/* neutral surface */}
<Avatar color="blue" initials="B" />    {/* blue tint */}`;

const PHOTO_CODE = `{/* Photo avatars take a src + alt; initials are the fallback */}
<Avatar size="md" src="/avatars/livia-saris.webp" alt="Livia Saris" />`;

/** Avatar — boardui.com/components/avatar (free). */
export default function AvatarPage() {
  const command = "npx boardui@latest add avatar";
  return (
    <AppShell title="Avatar" icon={RiLayoutGridLine} actions={null} columnClassName="max-w-[964px]">
      <p className="text-body-regular text-text-secondary">
        A photo or initials avatar in four sizes (20 / 24 / 32 / 36px) with neutral and blue initial tints — used
        across tables, breadcrumbs, menus, and the sidebar.
      </p>

      <Section title="Installation">
        <p className="text-body-regular text-text-secondary">
          You can add this avatar component using our CLI or manually. Dark mode ready — this component follows
          BoardUI semantic tokens automatically.
        </p>
        <div className="flex items-center justify-between gap-3 rounded-3xl border border-border-button-default bg-background-secondary-default px-4 py-3">
          <code className="text-body-2-regular overflow-x-auto text-text-primary">{command}</code>
          <CopyButton text={command} />
        </div>
      </Section>

      <Section title="Sizes">
        <p className="text-body-regular text-text-secondary">
          Four sizes via the <code className="text-body-2-regular text-text-primary">size</code> prop —{" "}
          <code className="text-body-2-regular text-text-primary">xs</code> (20px) through{" "}
          <code className="text-body-2-regular text-text-primary">lg</code> (36px). The initials type scale follows
          the container.
        </p>
        <Demo>
          <div className="flex items-end gap-4">
            <Avatar size="xs" initials="M" />
            <Avatar size="sm" initials="M" />
            <Avatar size="md" initials="M" />
            <Avatar size="lg" initials="M" />
          </div>
        </Demo>
        <Code code={SIZES_CODE} />
      </Section>

      <Section title="Initial tints">
        <p className="text-body-regular text-text-secondary">
          Initials render on a <code className="text-body-2-regular text-text-primary">neutral</code> or{" "}
          <code className="text-body-2-regular text-text-primary">blue</code> surface via the{" "}
          <code className="text-body-2-regular text-text-primary">color</code> prop.
        </p>
        <Demo>
          <div className="flex items-end gap-4">
            <Avatar color="neutral" initials="M" />
            <Avatar color="blue" initials="B" />
          </div>
        </Demo>
        <Code code={TINTS_CODE} />
      </Section>

      <Section title="Photo">
        <p className="text-body-regular text-text-secondary">
          Pass <code className="text-body-2-regular text-text-primary">src</code> and{" "}
          <code className="text-body-2-regular text-text-primary">alt</code> for a photo avatar. Initials act as the
          fallback while the image loads or if it fails.
        </p>
        <Demo>
          <div className="flex items-end gap-4">
            <Avatar size="md" src="/avatars/livia-saris.webp" alt="Livia Saris" />
          </div>
        </Demo>
        <Code code={PHOTO_CODE} />
      </Section>

      <div>
        <LinkButton href="/components" variant="secondary" size="medium" leadingIcon={RiArrowLeftLine}>
          Back to components
        </LinkButton>
      </div>
    </AppShell>
  );
}
