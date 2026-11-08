"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { RiArrowLeftLine, RiCheckLine, RiErrorWarningLine, RiFileCopyLine } from "@remixicon/react";

import { DocsLayout } from "@/components/application/docs/docs-layout";
import { Avatar } from "@/components/base/avatar/avatar";
import { Chip } from "@/components/base/badges/chip";
import { Button } from "@/components/base/buttons/button";
import { DirectionProvider } from "@/components/foundations/direction/direction";
import { Skeleton, SkeletonText } from "@/components/base/skeleton/skeleton";

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

const INSTALL_CMD = "npx boardui@latest add skeleton";

const LOADED_CODE = `<div aria-busy={!loaded}>
  <Skeleton shape="circle" isLoaded={loaded} className="size-10">
    <Avatar size="lg" initials="MC" color="blue" className="size-10" />
  </Skeleton>
  <Skeleton shape="text" isLoaded={loaded} className="w-fit">
    <span className="text-body-medium text-text-primary">Maya Chen</span>
  </Skeleton>
  <Skeleton shape="text" isLoaded={loaded}>
    <p className="text-body-regular text-text-secondary">Shipped the new onboarding flow…</p>
  </Skeleton>
</div>`;

const FAIL_CODE = `const [status, setStatus] = useState<"loading" | "error" | "loaded">("loading");

if (status === "loading") {
  return <SkeletonText lines={3} />; // grey placeholders only while loading
}
if (status === "error") {
  // Never leave the skeleton up: say what happened and offer a retry.
  return (
    <div role="alert">
      <p>Couldn't load this card. Check your connection and try again.</p>
      <Button variant="secondary" size="small" onClick={retry}>
        Retry
      </Button>
    </div>
  );
}
return <LoadedCard />;`;

const SHAPES_CODE = `<Skeleton shape="circle" className="size-12" />  // avatars
<Skeleton className="size-12" />                  // rect: images, cards (radius 12)
<Skeleton shape="text" className="h-5 w-40" />    // a line of text (radius 6)

<SkeletonText lines={2} />                        // a paragraph, last line shorter
<SkeletonText lines={4} lineClassName="h-3" />    // smaller text`;

const RTL_CODE = `import { DirectionProvider } from "@/components/foundations/direction/direction";

<DirectionProvider locale="ar">
  <Skeleton shape="circle" className="size-10" />
  <SkeletonText lines={2} />
</DirectionProvider>`;

/** Skeleton detail page, mirroring boardui.com/components/skeleton. */
export default function SkeletonPage() {
  const [loaded, setLoaded] = useState(false);

  // Failed-load demo: the first attempt fails, every retry succeeds. A
  // skeleton only means "loading": on failure it must give way to an
  // explicit error and a retry, never stay up on its own.
  const [failRun, setFailRun] = useState(0);
  const [failStatus, setFailStatus] = useState<"idle" | "loading" | "error" | "loaded">("idle");
  useEffect(() => {
    if (failRun === 0) return;
    setFailStatus("loading");
    const timer = window.setTimeout(() => {
      setFailStatus(failRun === 1 ? "error" : "loaded");
    }, 1200);
    return () => window.clearTimeout(timer);
  }, [failRun]);
  return (
    <DocsLayout variant="library" title="Skeleton">
      <div className="flex flex-col gap-8 pb-8">
        <div className="flex flex-col gap-3">
          <div className="flex items-center gap-2">
            <Chip variant="bold" color="lime">
              Free
            </Chip>
          </div>
          <p className="text-body-regular text-text-secondary">
            Hold the shape of content while it loads, so the page does not jump when it arrives.
          </p>
        </div>

        <Section title="Installation">
          <p className="text-body-regular text-text-secondary">
            You can add the skeleton using our CLI or manually. The CLI copies the component source (with its
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

        <Section title="Anatomy">
          <p className="text-body-regular text-text-secondary">
            Placeholders take their tint from the text colour, so they read on any surface in light and dark mode.
            A sheen of light sweeps each one, drawn in layers like the progress sweep: a crisp line, a tight
            glow, and a wide bloom.
          </p>
        </Section>

        <Section title="Loading into content">
          <p className="text-body-regular text-text-secondary">
            Wrap the real content in a Skeleton and it measures the placeholder from it, so the layout never
            shifts. When isLoaded turns true, the block fades away while the content sharpens in from a soft blur.
          </p>
          <Demo>
            <div className="flex flex-col gap-4">
              <div aria-busy={!loaded} className="flex flex-col gap-3">
                <div className="flex items-center gap-3">
                  <Skeleton shape="circle" isLoaded={loaded} className="size-10">
                    <Avatar size="lg" initials="MC" color="blue" className="size-10" />
                  </Skeleton>
                  <div className="flex flex-col gap-1.5">
                    <Skeleton shape="text" isLoaded={loaded} className="w-fit">
                      <span className="text-body-medium text-text-primary">Maya Chen</span>
                    </Skeleton>
                    <Skeleton shape="text" isLoaded={loaded} className="w-fit">
                      <span className="text-body-regular text-text-secondary">Design lead, Acme</span>
                    </Skeleton>
                  </div>
                </div>
                <Skeleton shape="text" isLoaded={loaded}>
                  <p className="text-body-regular text-text-secondary">
                    Shipped the new onboarding flow. Activation is up 18% in the first week, and support tickets
                    about setup are down by half.
                  </p>
                </Skeleton>
              </div>
              <div>
                <Button variant="secondary" size="small" onClick={() => setLoaded((value) => !value)}>
                  {loaded ? "Reload" : "Load content"}
                </Button>
              </div>
            </div>
          </Demo>
          <CodeBlock code={LOADED_CODE} />
        </Section>

        <Section title="Failed to load">
          <p className="text-body-regular text-text-secondary">
            A skeleton only means loading. If the request fails, replace it with an explicit error and a retry —
            never leave the skeleton up on its own. The first attempt below fails on purpose; retrying loads the
            card.
          </p>
          <Demo>
            <div className="flex flex-col gap-4">
              <div aria-busy={failStatus === "loading"} className="flex flex-col gap-3">
                {failStatus === "error" ? (
                  <div role="alert" className="flex flex-col items-start gap-3">
                    <div className="flex items-start gap-2.5">
                      <RiErrorWarningLine className="mt-0.5 size-5 shrink-0 text-text-error-primary" aria-hidden />
                      <div className="flex flex-col gap-0.5">
                        <p className="text-body-medium text-text-primary">Couldn&apos;t load this card</p>
                        <p className="text-body-regular text-text-secondary">
                          Check your connection and try again.
                        </p>
                      </div>
                    </div>
                    <Button variant="secondary" size="small" onClick={() => setFailRun((run) => run + 1)}>
                      Retry
                    </Button>
                  </div>
                ) : failStatus === "loaded" ? (
                  <>
                    <div className="flex items-center gap-3">
                      <Avatar size="lg" initials="MC" color="blue" className="size-10" />
                      <div className="flex flex-col gap-1.5">
                        <span className="text-body-medium text-text-primary">Maya Chen</span>
                        <span className="text-body-regular text-text-secondary">Design lead, Acme</span>
                      </div>
                    </div>
                    <p className="text-body-regular text-text-secondary">
                      Shipped the new onboarding flow. Activation is up 18% in the first week, and support tickets
                      about setup are down by half.
                    </p>
                  </>
                ) : failStatus === "idle" ? (
                  <p className="text-body-regular text-text-tertiary">
                    Press &ldquo;Load card&rdquo; to simulate a request — the first attempt fails on purpose.
                  </p>
                ) : (
                  <>
                    <div className="flex items-center gap-3">
                      <Skeleton shape="circle" className="size-10" />
                      <SkeletonText lines={2} />
                    </div>
                    <SkeletonText lines={2} lineClassName="h-3" />
                  </>
                )}
              </div>
              <div>
                {failStatus === "idle" ? (
                  <Button variant="secondary" size="small" onClick={() => setFailRun(1)}>
                    Load card
                  </Button>
                ) : failStatus === "loaded" ? (
                  <Button variant="secondary" size="small" onClick={() => setFailRun((run) => run + 1)}>
                    Reload
                  </Button>
                ) : null}
              </div>
            </div>
          </Demo>
          <CodeBlock code={FAIL_CODE} />
        </Section>

        <Section title="Shapes and text">
          <p className="text-body-regular text-text-secondary">
            shape takes rect, text, or circle; size it with classes. SkeletonText draws a paragraph of lines with
            a shorter last one.
          </p>
          <Demo>
            <div className="flex flex-col gap-4">
              <div className="flex items-center gap-4">
                <Skeleton shape="circle" className="size-12" />
                <Skeleton className="size-12" />
                <Skeleton shape="text" className="h-5 w-40" />
              </div>
              <SkeletonText lines={2} />
              <SkeletonText lines={4} lineClassName="h-3" />
            </div>
          </Demo>
          <CodeBlock code={SHAPES_CODE} />
        </Section>

        <Section title="Right-to-left">
          <p className="text-body-regular text-text-secondary">
            Inside DirectionProvider, the sheen sweeps from right to left with its line still leading.
          </p>
          <Demo>
            <DirectionProvider locale="ar">
              <div className="flex flex-col gap-4">
                <Skeleton shape="circle" className="size-10" />
                <SkeletonText lines={2} />
              </div>
            </DirectionProvider>
          </Demo>
          <CodeBlock code={RTL_CODE} />
        </Section>

        <Section title="Accessibility">
          <p className="text-body-regular text-text-secondary">
            Placeholders are hidden from screen readers, and content waiting behind them is inert. Mark the region
            that is loading with aria-busy so assistive technology knows to wait. Reduced motion replaces the
            sweep with a gentle pulse.
          </p>
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
