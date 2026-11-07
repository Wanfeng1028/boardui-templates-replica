"use client";

import Link from "next/link";
import { RiArrowLeftLine } from "@remixicon/react";

import { DocsLayout } from "@/components/application/docs/docs-layout";
import { Chip } from "@/components/base/badges/chip";
import { ComposerAttachments } from "@/components/application/pro/composer-attachments";

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

const QUEUE_CODE = `const [files, setFiles] = useState<ComposerAttachment[]>([]);

function attach(picked: File[]) {
  setFiles((prev) => [
    ...prev,
    ...picked.map((file) => ({
      id: crypto.randomUUID(),
      name: file.name,
      kind: kindOf(file),
      progress: 0,           // queued: lands after the ones before it
    })),
  ]);
}

<ComposerWithAttachments
  attachments={files}
  onAttachmentsChange={setFiles}   // dismissals come back through here
  uploadDuration={1100}            // one simulated upload, ms
  uploadGap={240}                  // pause before the next ring starts, ms
  onUploadComplete={(file) => console.log("landed", file.name)}
  onAllUploaded={() => console.log("all landed")}
/>`;

const KINDS_CODE = `{/* Six tile kinds: images show the thumbnail, the rest carry the plugin document icons */}
<ComposerAttachmentStrip
  attachments={[
    { id: "1", name: "cat.jpg", kind: "image", src: "/uploads/cat.jpg" },
    { id: "2", name: "payroll.docx", kind: "document" },
    { id: "3", name: "timetable.xlsx", kind: "spreadsheet" },
    { id: "4", name: "launch.key", kind: "presentation" },
    { id: "5", name: "types.tsx", kind: "code" },
    { id: "6", name: "birthday.mp4", kind: "video" },
  ]}
  onRemove={(id) => remove(id)}
/>

{/* Or one tile at a time */}
<ComposerAttachmentTile attachment={file} onRemove={() => remove(file.id)} />`;

const OWN_UPLOADER_CODE = `{/* Real uploads: feed the ring from your own progress events on the core panel */}
<ComposerPanel
  attachments={files.map((file) => ({
    ...file,
    progress: uploads[file.id],   // 0–100 draws the ring, undefined means landed
  }))}
  onRemoveAttachment={(id) => cancel(id)}
/>`;
export default function ComposerAttachmentsPage() {
  return (
    <DocsLayout variant="library" title="Composer Attachments">
      <div className="flex flex-col gap-8 pb-8">
        <div className="flex flex-col gap-3">
          <div className="flex items-center gap-2">
            <Chip variant="bold" color="purple">
              Pro
            </Chip>
          </div>
          <p className="text-body-regular text-text-secondary">
            The Composer Panel carrying attachments: a strip of 56px tiles above the prompt, the thumbnail for
            images and the plugin document icon with the file name for everything else, each with its dismiss in
            the corner. Queued files land one after another, the accent ring drawing clockwise around the tile the
            way the File Upload block traces its drop zone while a 9px percentage counts up in the corner, then at
            100 the percentage blurs out and the dismiss blurs in on the same spot.
          </p>
        </div>

        <Section title="Installation">
          <h3 className="text-title-3-semibold text-text-primary">Composer Attachments is a Pro component.</h3>
          <p className="text-body-regular text-text-secondary">
            Dark mode ready - this component follows BoardUI semantic tokens automatically. Set up theme switching.
          </p>
          <p className="text-body-regular text-text-secondary">
            Your BoardUI Pro license unlocks this component and all of its source files. Activate your license
            once, then install it directly into your project with the CLI.
          </p>
          <p className="text-caption-1-semibold text-text-secondary">1 — Activate your license</p>
          <CodeBlock code={`npx boardui@latest login YOUR_LICENSE_KEY`} />
          <p className="text-body-regular text-text-secondary">
            Use the key from your Lemon Squeezy purchase email. You only need to do this once per machine.
          </p>
          <p className="text-caption-1-semibold text-text-secondary">2 — Install the component</p>
          <CodeBlock code={`npx boardui@latest add composer-attachments`} />
          <p className="text-body-regular text-text-secondary">
            The CLI copies the source and resolves every BoardUI and npm dependency for you.
          </p>
          <p className="text-body-regular text-text-secondary">
            This component is included in BoardUI Pro. Get BoardUI Pro now and install it end away.
          </p>
          <p className="text-body-regular text-text-secondary">
            Using a shared UI package or custom import aliases? Configure your installation paths before running the
            CLI. Copy-paste examples use the default imports.
          </p>
        </Section>

        <Section title="Upload queue">
          <p className="text-body-regular text-text-secondary">
            <code>ComposerWithAttachments</code> owns the queue. Any file in <code>attachments</code> with{" "}
            <code>progress: 0</code> waits its turn, then scales in, draws its ring and counts up in the corner;
            files without a <code>progress</code> value show as landed straight away. The upload is simulated so
            the block stays backend-agnostic: tune it with <code>uploadDuration</code> and{" "}
            <code>uploadGap</code>, and listen with <code>onUploadComplete</code> and{" "}
            <code>onAllUploaded</code>. Add files whenever you like; they join the back of the queue.
          </p>
          <Demo>
            <ComposerAttachments />
          </Demo>
          <CodeBlock code={QUEUE_CODE} />
        </Section>

        <Section title="Tile kinds">
          <p className="text-body-regular text-text-secondary">
            Six kinds. <code>image</code> fills the tile with its <code>src</code> and gets a frosted white
            dismiss; the document, spreadsheet, presentation, code and video kinds carry the 24px plugin icons
            the add menu already ships, with the file name in 9px underneath, truncated to the tile. Both{" "}
            <code>ComposerAttachmentStrip</code> and the single <code>ComposerAttachmentTile</code> are exported
            for surfaces outside the composer.
          </p>
          <CodeBlock code={KINDS_CODE} />
        </Section>

        <Section title="Bring your own uploader">
          <p className="text-body-regular text-text-secondary">
            The ring is just a number. Skip the queue and hand <code>ComposerPanel</code> the attachments
            yourself, mapping each file&apos;s real transfer progress onto <code>progress</code>: the ring
            follows it, and clearing the value marks the file landed.
          </p>
          <CodeBlock code={OWN_UPLOADER_CODE} />
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

// 已按原版逐字校对：boardui.com/components/composer-attachments（2026-11-07，curl 抓取原版 SSR HTML + flight 数据核对）
