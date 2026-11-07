"use client";

import { useState } from "react";
import {
  RiArrowLeftLine,
  RiCheckLine,
  RiFileCopyLine,
  RiMailLine,
  RiPhoneLine,
} from "@remixicon/react";

import { DocsLayout } from "@/components/application/docs/docs-layout";
import { Input } from "@/components/base/input/input";
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

const INSTALL_CMD = "npx boardui@latest add input";

const SIZES_CODE = `<Input label="Email" hint="This is a hint about this input." placeholder="you@company.com" />
<Input label="Email" hint="This is a hint about this input." placeholder="you@company.com" size="small" />`;

const STATES_CODE = `<Input label="Email" hint="This is a hint about this input." placeholder="you@company.com" />
<Input label="Email" hint="This is a hint about this input." placeholder="you@company.com" isRequired />
<Input label="Email" hint="Enter a valid email address." placeholder="you@company.com" isInvalid />
<Input label="Email" hint="This is a hint about this input." placeholder="you@company.com" isDisabled />`;

const ERROR_CODE = `<Input label="Name" hint="Shown on your profile." placeholder="Ada Lovelace" />
<Input label="Name" hint="Enter your name to continue." placeholder="Ada Lovelace" isInvalid />`;

const PHONE_CODE = `<Input label="Phone Number" hint="This is a hint about this input." placeholder="+1 (555) 000-1234" type="tel" />
<Input label="Phone Number" hint="This is a hint about this input." placeholder="+1 (555) 000-1234" type="tel" size="small" />`;

/**
 * Input — docs page replica.
 * Source: boardui.com/components/input. Free component.
 */
export default function InputPage() {
  return (
    <DocsLayout variant="library" title="Input">
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
            A labelled text field built on React Aria — leading and trailing adornments, hint
            text, and required/invalid states with a cross-fading focus ring.
          </p>
        </div>

        <Section title="Installation">
          <p className="text-body-regular text-text-secondary">
            You can add this input component using our CLI or manually. The CLI copies the
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

        <Section title="Sizes">
          <Demo>
            <div className="flex w-full max-w-[320px] flex-col gap-4">
              <Input
                label="Email"
                hint="This is a hint about this input."
                placeholder="you@company.com"
                leadingIcon={RiMailLine}
              />
              <Input
                label="Email"
                hint="This is a hint about this input."
                placeholder="you@company.com"
                leadingIcon={RiMailLine}
                size="small"
              />
            </div>
          </Demo>
          <CodeBlock code={SIZES_CODE} />
        </Section>

        <Section title="States">
          <Demo>
            <div className="flex w-full max-w-[320px] flex-col gap-4">
              <Input
                label="Email"
                hint="This is a hint about this input."
                placeholder="you@company.com"
                leadingIcon={RiMailLine}
              />
              <Input
                label="Email"
                hint="This is a hint about this input."
                placeholder="you@company.com"
                leadingIcon={RiMailLine}
                isRequired
              />
              <Input
                label="Email"
                hint="Enter a valid email address."
                placeholder="you@company.com"
                leadingIcon={RiMailLine}
                isInvalid
              />
              <Input
                label="Email"
                hint="This is a hint about this input."
                placeholder="you@company.com"
                leadingIcon={RiMailLine}
                isDisabled
              />
            </div>
          </Demo>
          <CodeBlock code={STATES_CODE} />
        </Section>

        <Section title="Error message">
          <p className="text-body-regular text-text-secondary">
            <code>errorMessage</code> replaces the hint while the field is invalid, in React
            Aria&apos;s error slot, so the input is described by it. With{" "}
            <code>isRequired</code> alone, React Aria validates natively on submit: it blocks
            the form, marks the field invalid and moves focus to it, and keeps the browser&apos;s
            own bubble from showing, so the message is what people see. With{" "}
            <code>validationBehavior=&quot;aria&quot;</code>, nothing blocks the submit, and the
            field is invalid only when you pass <code>isInvalid</code> or <code>validate</code>{" "}
            returns an error.
          </p>
          <Demo>
            <div className="flex w-full max-w-[320px] flex-col gap-4">
              <Input label="Name" hint="Shown on your profile." placeholder="Ada Lovelace" />
              <Input
                label="Name"
                hint="Enter your name to continue."
                placeholder="Ada Lovelace"
                isInvalid
              />
            </div>
          </Demo>
          <CodeBlock code={ERROR_CODE} />
        </Section>

        <Section title="Phone number">
          <Demo>
            <div className="flex w-full max-w-[320px] flex-col gap-4">
              <Input
                label="Phone Number"
                hint="This is a hint about this input."
                placeholder="+1 (555) 000-1234"
                leadingIcon={RiPhoneLine}
                type="tel"
              />
              <Input
                label="Phone Number"
                hint="This is a hint about this input."
                placeholder="+1 (555) 000-1234"
                leadingIcon={RiPhoneLine}
                type="tel"
                size="small"
              />
            </div>
          </Demo>
          <CodeBlock code={PHONE_CODE} />
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
