"use client";

import { useState } from "react";
import Link from "next/link";
import { RiArrowLeftLine, RiCheckLine, RiFileCopyLine, RiQuestionnaireLine } from "@remixicon/react";

import { AppShell } from "@/components/application/app-shell/app-shell";
import { Button } from "@/components/base/buttons/button";
import { Chip } from "@/components/base/badges/chip";
import { Questionnaire } from "@/components/application/pro/questionnaire";

function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);
  return (
    <Button
      variant="secondary"
      size="small"
      leadingIcon={copied ? RiCheckLine : RiFileCopyLine}
      onClick={() => {
        navigator.clipboard?.writeText(text)?.then(() => {
          setCopied(true);
          window.setTimeout(() => setCopied(false), 1600);
        }).catch(() => {
          // Clipboard access can be refused; leave the icon unchanged.
        });
      }}
    >
      {copied ? "Copied" : "Copy"}
    </Button>
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

function Code({ code }: { code: string }) {
  return (
    <pre className="overflow-x-auto rounded-xl border border-border-button-default bg-background-secondary-default p-4 font-mono text-body-2-regular text-text-primary">
      <code>{code}</code>
    </pre>
  );
}

const MULTIPLE_SELECT_CODE = `{/* The default: every row is a checkbox and Next moves on */}
<Questionnaire
  select="multiple"
  questions={[
    {
      id: "controls",
      question: "Which harness controls should stay in the top bar?",
      options: [
        { value: "upsell", label: "Show up sell toggle", description: "Forces the upsell card up." },
        { value: "wallpaper", label: "Wallpaper picker", description: "The chat wallpaper choices." },
      ],
      other: true, // adds the free-text row; typing ticks it
      stepLabel: "Top bar", // pill label, "Step 1" otherwise
    },
  ]}
  onComplete={(answers) => {
    // answers.controls → { values: ["upsell", "wallpaper"], other: "Model picker" }
  }}
/>`;

const SINGLE_SELECT_CODE = `{/* Single select numbers the rows; a pick moves on after 180ms */}
<Questionnaire
  select="single"
  advanceDelay={180}
  questions={[
    {
      id: "permission",
      question: "How should the permission pill behave while an agent is running?",
      options: [
        { value: "lock", label: "Lock it", description: "Changes wait until the run finishes." },
        { value: "queue", label: "Queue the change", description: "Applies from the next turn." },
        { value: "apply", label: "Apply immediately", description: "Interrupts the current tool call." },
      ],
      other: { placeholder: "Describe the behaviour" },
    },
  ]}
  onComplete={(answers) => {
    // answers.permission → { values: ["queue"] } or { values: [], other: "..." }
  }}
/>`;

const MIXED_MODES_CODE = `{/* Mix modes per question: the card-level select is only the default */}
<Questionnaire questions={[{ id: "a", select: "multiple", /* … */ }, { id: "b", select: "single", /* … */ }]} />`;

const CONTROLLED_CODE = `const [step, setStep] = useState(0);
const [answers, setAnswers] = useState<QuestionnaireAnswers>({});

<Questionnaire
  questions={questions}
  step={step}
  onStepChange={setStep}
  answers={answers}
  onAnswersChange={setAnswers}
  onComplete={(final) => submitPlan(final)}
  onDismiss={() => setOpen(false)}
  labels={{ previous: "Back", next: "Continue", complete: "Send answers" }}
/>`;

const UNCONTROLLED_CODE = `{/* Or start somewhere and let the card own it */}
<Questionnaire questions={questions} defaultStep={1} defaultAnswers={{ controls: { values: ["upsell"] } }} />`;

/** Questionnaire detail page: boardui.com/components/questionnaire, in-site. */
export default function QuestionnairePage() {
  return (
    <AppShell title="Questionnaire" icon={RiQuestionnaireLine} actions={null} columnClassName="max-w-[964px]">
      <div className="flex flex-col gap-8 px-1 pb-10">
        <div className="flex items-center gap-2">
          <Chip color="purple" variant="subtle">
            Pro
          </Chip>
          <span className="text-caption-1-medium text-text-tertiary">Blocks</span>
        </div>
        <p className="text-body-regular text-text-secondary">
          The questions an agent asks before it commits to a plan, as a card in the chat thread. One question per
          step: the prompt across the top, the answers as bordered rows with a checkbox or a number key, an optional
          free-text Other row, and a footer with a pill per step next to Previous and Next. Questions slide in the
          direction of travel while the card animates to the next one&apos;s height.
        </p>
        <Questionnaire />
        <Section title="Installation">
          <p className="text-body-regular text-text-secondary">Questionnaire is part of BoardUI Pro.</p>
          <div className="flex items-center justify-between gap-3 rounded-xl border border-border-button-default bg-background-secondary-default px-4 py-3">
            <code className="font-mono text-body-2-medium text-text-primary">npx boardui@latest add questionnaire</code>
            <CopyButton text="npx boardui@latest add questionnaire" />
          </div>
        </Section>
        <Section title="Multiple select">
          <p className="text-body-regular text-text-secondary">
            The default mode. Every row is a checkbox card: press anywhere on it to tick it, and as many as you like.{" "}
            <code className="font-mono text-body-2-medium text-text-primary">Next</code> moves to the next question,{" "}
            <code className="font-mono text-body-2-medium text-text-primary">Previous</code> goes back with the ticks
            intact, and the step pills jump straight to any question. The last question&apos;s button reads{" "}
            <code className="font-mono text-body-2-medium text-text-primary">Done</code> and fires{" "}
            <code className="font-mono text-body-2-medium text-text-primary">onComplete</code> with every answer.
          </p>
          <Code code={MULTIPLE_SELECT_CODE} />
        </Section>
        <Section title="Single select">
          <p className="text-body-regular text-text-secondary">
            Set <code className="font-mono text-body-2-medium text-text-primary">select</code> to{" "}
            <code className="font-mono text-body-2-medium text-text-primary">single</code> on the card or on a
            question. The checkboxes become number keys, and picking a row, with a click or its digit, moves on by
            itself after <code className="font-mono text-body-2-medium text-text-primary">advanceDelay</code> so the
            choice is seen landing. Coming back shows the pick highlighted. The Other row waits for text instead:
            Enter sends it.
          </p>
          <Code code={SINGLE_SELECT_CODE} />
          <Code code={MIXED_MODES_CODE} />
        </Section>
        <Section title="Answers and steps">
          <p className="text-body-regular text-text-secondary">
            Answers are keyed by question id:{" "}
            <code className="font-mono text-body-2-medium text-text-primary">values</code> holds the picked option
            values in option order, and <code className="font-mono text-body-2-medium text-text-primary">other</code>{" "}
            the free text while that row is selected. Own them with{" "}
            <code className="font-mono text-body-2-medium text-text-primary">answers</code> and{" "}
            <code className="font-mono text-body-2-medium text-text-primary">onAnswersChange</code>, and the visible
            question with <code className="font-mono text-body-2-medium text-text-primary">step</code> and{" "}
            <code className="font-mono text-body-2-medium text-text-primary">onStepChange</code>, or seed either with
            the <code className="font-mono text-body-2-medium text-text-primary">default</code> props and let the card
            run itself. <code className="font-mono text-body-2-medium text-text-primary">onDismiss</code> shows the
            corner dismiss; <code className="font-mono text-body-2-medium text-text-primary">labels</code> rewords the
            buttons and the Other row.
          </p>
          <Code code={CONTROLLED_CODE} />
          <Code code={UNCONTROLLED_CODE} />
        </Section>
        <Link
          href="/components"
          className="mt-2 inline-flex w-fit items-center gap-1.5 text-body-medium text-text-secondary"
        >
          <RiArrowLeftLine className="size-4" />
          Back to all components
        </Link>
      </div>
    </AppShell>
  );
}
