"use client";

import { useState } from "react";
import {
  RiArrowLeftLine,
  RiCheckLine,
  RiFileCopyLine,
} from "@remixicon/react";

import { AppShell } from "@/components/application/app-shell/app-shell";
import { InputOtp } from "@/components/base/input-otp/input-otp";
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

const INSTALL_CMD = "npx boardui@latest add input-otp";

const CONTROLLED_CODE = `const [code, setCode] = useState("");

<InputOtp
  value={code}
  onChange={setCode}
  onComplete={(value) => verify(value)}
  aria-label="Verification code"
/>`;

const LENGTH_CODE = `{/* Four boxes instead of six */}
<InputOtp length={4} aria-label="PIN" />

{/* Split into groups: 000 000 */}
<InputOtp groupEvery={3} aria-label="Verification code" />

{/* States */}
<InputOtp isInvalid aria-label="Verification code" />
<InputOtp isDisabled defaultValue="1234" aria-label="Verification code" />`;

/**
 * Input OTP — docs page replica.
 * Source: boardui.com/components/input-otp. Free component.
 */
export default function InputOtpPage() {
  const [code, setCode] = useState("");
  const [completed, setCompleted] = useState<string | null>(null);
  return (
    <AppShell title="Input OTP" actions={null} columnClassName="max-w-[964px]">
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
            A one-time-code field: six boxes, one digit each. Looks like six inputs and behaves
            like one value — typing advances, Backspace steps back, arrows move without editing,
            and a pasted or autofilled code spreads itself across the boxes.
          </p>
        </div>

        <Section title="Installation">
          <p className="text-body-regular text-text-secondary">
            You can add this OTP input using our CLI or manually. The CLI copies the component
            source (with its internal dependencies) into your project and installs any required
            npm packages.
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

        <Section title="Controlled value">
          <p className="text-body-regular text-text-secondary">
            The value is a single string, not an array of characters. Pass <code>value</code> +{" "}
            <code>onChange</code> to control it, or <code>defaultValue</code> to leave it
            uncontrolled. <code>onComplete</code> fires the moment the last box fills, which is
            usually where you submit.
          </p>
          <Demo>
            <div className="flex flex-col items-center gap-3">
              <InputOtp
                value={code}
                onChange={(value) => {
                  setCode(value);
                  setCompleted(null);
                }}
                onComplete={(value) => setCompleted(value)}
                aria-label="Verification code"
              />
              <p className="text-body-2-regular text-text-tertiary">
                {completed ? `Completed: ${completed}` : code ? `Value: ${code}` : "Type a code — completing all six boxes fires onComplete."}
              </p>
            </div>
          </Demo>
          <CodeBlock code={CONTROLLED_CODE} />
        </Section>

        <Section title="Length, grouping and states">
          <p className="text-body-regular text-text-secondary">
            <code>length</code> sets the number of boxes and <code>groupEvery</code> splits them
            into runs, which makes a long code easier to read back. <code>isInvalid</code> gives
            the boxes a red edge over the same tint a failed <code>Input</code> uses.
          </p>
          <Demo>
            <div className="flex flex-col items-center gap-5">
              <InputOtp length={4} aria-label="PIN" />
              <InputOtp groupEvery={3} aria-label="Verification code" />
              <InputOtp isInvalid aria-label="Verification code" />
              <InputOtp isDisabled defaultValue="1234" aria-label="Verification code" />
            </div>
          </Demo>
          <CodeBlock code={LENGTH_CODE} />
        </Section>

        <Section title="Paste and autofill">
          <p className="text-body-regular text-text-secondary">
            Pasting into any box distributes the digits from that point onward rather than
            dropping everything but the first character. The same path handles OS autofill: iOS
            and Chrome deliver the whole code into a single box, so each box carries{" "}
            <code>autoComplete=&quot;one-time-code&quot;</code> and accepts more than one
            character. Non-digits are stripped throughout, and the boxes use{" "}
            <code>inputMode=&quot;numeric&quot;</code> so phones show a number pad without the
            spinners and stray characters a <code>number</code> input would bring.
          </p>
          <Demo>
            <InputOtp defaultValue="204915" aria-label="Verification code" />
          </Demo>
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
