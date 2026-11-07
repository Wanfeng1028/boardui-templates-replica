"use client";

import { useState } from "react";
import Link from "next/link";
import { RiArrowLeftLine, RiCheckLine, RiFileCopyLine } from "@remixicon/react";

import { AppShell } from "@/components/application/app-shell/app-shell";
import { Chip } from "@/components/base/badges/chip";
import { FREE_COMPONENT_PREVIEWS } from "@/components/application/docs/component-previews-free";

/** Detail page for file-upload - content mirrors boardui.com/components/file-upload. */

function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);
  return (
    <button
      type="button"
      onClick={async () => {
        await navigator.clipboard.writeText(text);
        setCopied(true);
        window.setTimeout(() => setCopied(false), 2000);
      }}
      className="inline-flex shrink-0 cursor-pointer items-center gap-1.5 rounded-full border border-border-button-default bg-background-primary-default px-3 py-1.5 text-caption-1-medium text-text-primary"
    >
      {copied ? <RiCheckLine className="size-4 text-foreground-icon-secondary" aria-hidden /> : <RiFileCopyLine className="size-4 text-foreground-icon-secondary" aria-hidden />}
      {copied ? "Copied" : "Copy"}
    </button>
  );
}

const CODE_0_CODE = "<FileUpload\n  allowedExtensions={[\"pdf\", \"png\"]}\n  maxBytes={4 * 1024 * 1024}\n  onUploadComplete={saveFile}\n/>";
const CODE_1_CODE = "import { RiFileCloudLine } from \"@remixicon/react\";\n\n<FileUpload\n  renderFileIcon={() => (\n    <RiFileCloudLine className=\"size-6 text-foreground-icon-secondary\" aria-hidden />\n  )}\n/>";

export default function FileUploadPage() {
  return (
    <AppShell title="File Upload" actions={null} columnClassName="max-w-[964px]">
      <div className="flex flex-col gap-6 pb-10">
        <div className="flex items-center gap-2">
          <Chip color="neutral">Free</Chip>
          <span className="text-caption-1-regular text-text-tertiary">ui.gemmae.dev/components/file-upload</span>
        </div>
        <p className="text-body-regular text-text-secondary">A keyboard-accessible drag-and-drop upload surface with extension and file-size validation, an animated perimeter progress indicator, and a completion callback for connecting your own storage layer.</p>
        <section className="flex flex-col gap-3">
          <h2 className="text-title-2-medium text-text-primary">Installation</h2>
          <p className="text-body-regular text-text-secondary">You can add the file upload component using our CLI or manually. The CLI copies the component source (with its internal dependencies) into your project and installs any required npm packages.</p>
          <div className="flex items-center gap-2 overflow-x-auto rounded-xl border border-border-button-default bg-background-secondary-default p-3">
            <code className="flex-1 whitespace-nowrap text-body-2-regular text-text-primary">npx boardui@latest add file-upload</code>
            <CopyButton text={"npx boardui@latest add file-upload"} />
          </div>
        </section>
        <section className="flex flex-col gap-3">
          <h2 className="text-title-2-medium text-text-primary">Validation</h2>
          <p className="text-body-regular text-text-secondary">Configure accepted file types with allowedExtensions and the size ceiling with maxBytes. The component updates its own helper text and rejection message from those props.</p>
          <div className="overflow-x-auto rounded-3xl border border-border-button-default bg-background-primary-default p-4">
              {(() => { const Preview = FREE_COMPONENT_PREVIEWS["/components/file-upload"]; return Preview ? <Preview /> : null; })()}
            </div>
          <pre className="overflow-x-auto rounded-xl border border-border-button-default bg-background-secondary-default p-4 text-body-2-regular text-text-primary"><code>{CODE_0_CODE}</code></pre>
        </section>
        <section className="flex flex-col gap-3">
          <h2 className="text-title-2-medium text-text-primary">File icon</h2>
          <p className="text-body-regular text-text-secondary">The built-in icon follows the selected extension. Use renderFileIcon when your product has its own file-type artwork or icon system.</p>
          <pre className="overflow-x-auto rounded-xl border border-border-button-default bg-background-secondary-default p-4 text-body-2-regular text-text-primary"><code>{CODE_1_CODE}</code></pre>
        </section>
        <div className="flex items-center gap-2 border-t border-separator-border pt-5">
          <RiArrowLeftLine className="size-4 text-foreground-icon-secondary" aria-hidden />
          <Link href="/components" className="text-body-medium text-text-secondary hover:text-text-primary">Back to Components</Link>
        </div>
      </div>
    </AppShell>
  );
}
