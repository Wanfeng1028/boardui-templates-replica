"use client";

import { useState } from "react";
import { RiCheckLine, RiFileCopyLine, RiArrowLeftLine } from "@remixicon/react";

import { AppShell } from "@/components/application/app-shell/app-shell";
import { Chip } from "@/components/base/badges/chip";
import { PatientInfoCard } from "@/components/application/medical/patient-info-card";
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

const INSTALL_CMD = "npx boardui@latest add patient-info-card";

const USAGE_CODE = `import { PatientInfoCard } from "@/components/application/medical/patient-info-card";

<PatientInfoCard />`;

const PHOTO_CODE = `const [photo, setPhoto] = useState<string | undefined>(undefined);

<PatientInfoCard
  photoSrc={photo}
  onAddPhoto={() => pickPhoto((url) => setPhoto(url))}
/>`;

/** Patient Info Card detail page. Source: registry + llms.txt (medical-profile section). */
export default function PatientInfoCardPage() {
  const [photo, setPhoto] = useState<string | undefined>(undefined);
  return (
    <AppShell title="Patient Info Card" actions={null} columnClassName="max-w-[964px]">
      <div className="flex flex-col gap-8 pb-8">
        <div className="flex flex-col gap-3">
          <div className="flex items-center gap-2">
            <Chip variant="bold" color="lime">
              Free
            </Chip>
          </div>
          <p className="text-body-regular text-text-secondary">
            Profile card with avatar and label/value detail rows. One of the cards of the Medical Profile
            template: the patient&rsquo;s photo, name and key details at a glance, with the add-photo action
            pinned to the avatar.
          </p>
        </div>

        <Section title="Preview">
          <p className="text-body-regular text-text-secondary">
            The avatar falls back to initials until a photo is set. Press the add-photo button below to see the
            photo slot fill — the demo swaps in a local sample portrait.
          </p>
          <Demo>
            <PatientInfoCard
              photoSrc={photo}
              onAddPhoto={() => setPhoto("/avatars/maria-lubin.webp")}
            />
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

        <Section title="The card">
          <p className="text-body-regular text-text-secondary">
            Avatar on top with the add-photo action, then label/value rows for the patient&rsquo;s details. It
            renders as-is with no props — the rows are the card&rsquo;s own content.
          </p>
          <CodeBlock code={USAGE_CODE} />
        </Section>

        <Section title="Profile photo">
          <p className="text-body-regular text-text-secondary">
            <code className="font-mono text-caption-1-medium text-text-primary">photoSrc</code> shows a photo in
            the avatar when set, and{" "}
            <code className="font-mono text-caption-1-medium text-text-primary">onAddPhoto</code> fires when the
            add-photo button is pressed — wire it to your own picker and store the result.
          </p>
          <CodeBlock code={PHOTO_CODE} />
        </Section>

        <Section title="In the Medical Profile template">
          <p className="text-body-regular text-text-secondary">
            The card ships beside the Important Alerts Card on the Medical Profile template.
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
