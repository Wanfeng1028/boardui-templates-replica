"use client";

import { useState } from "react";
import { RiArrowLeftLine, RiCheckLine, RiFileCopyLine } from "@remixicon/react";

import { DocsLayout } from "@/components/application/docs/docs-layout";
import { AuthCard } from "@/components/application/auth/auth-card";
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

const LAYOUTS_CODE = `{/* Stacked: full-width buttons with labels, under the form */}
<AuthCard layout="stacked" providers={["google", "apple", "github"]} />

{/* Inline: icon-only squares, under the form */}
<AuthCard
  layout="inline"
  providers={["google", "apple", "github", "x", "figma", "slack"]}
/>

{/* Grid: icon-only buttons across equal columns */}
<AuthCard layout="grid" providers={["apple", "google", "figma"]} />`;

const SPLIT_CODE = `import { AuthMediaCarousel } from "@/components/application/auth/auth-media-carousel";

<AuthCard
  mode="signup"
  layout="grid"
  centered
  confirmPassword
  providers={["apple", "google", "figma"]}
  footnote="By clicking continue, you agree to our Terms of Service and Privacy Policy."
  media={
    <AuthMediaCarousel
      slides={[
        { src: "/art/one.webp" },
        { src: "/art/two.webp" },
        { src: "/art/three.webp" },
        { src: "/art/four.webp" },
      ]}
    />
  }
/>

{/* Any node works — a single image, a video, a gradient */}
<AuthCard media={<img src="/art/one.webp" alt="" className="size-full object-cover" />} />`;

const LOGO_CODE = `{/* logo takes a node, so it is your mark, not a src the card owns */}
<AuthCard
  centered
  logo={<ProLogoMark scale={40 / 56} animated />}
  title="Sign in to BoardUI Pro"
  description="Your license unlocks every Pro component and template."
/>

{/* Left-aligned when centered is off */}
<AuthCard mode="signup" logo={<AppLogo className="size-10" />} />`;

const MODES_CODE = `<AuthCard mode="signin" />   {/* Welcome back, remember me, forgot password */}
<AuthCard mode="signup" />   {/* Adds a name field and the terms line */}`;

const VERIFY_CODE = `<AuthCard
  mode="verify"
  email="mertcan@boardui.com"
  codeLength={6}
  onComplete={(code) => verifyCode(code)}
  onResend={() => resend()}
/>

{/* Four boxes instead of six */}
<AuthCard mode="verify" email={email} codeLength={4} />`;

const PROVIDERS_CODE = `{/* Any of the 24 social button brands, in any order */}
<AuthCard providers={["google", "microsoft", "okta"]} />

{/* Email only: pass an empty array and the divider disappears with it */}
<AuthCard providers={[]} />`;

const WIRING_CODE = `<AuthCard
  mode="signup"
  // The form is uncontrolled; you get its FormData on submit.
  onSubmit={(data) => {
    const email = data.get("email");
    const password = data.get("password");
    // ...hand these to your auth library
  }}
  onProvider={(provider) => signIn(provider)}
  switchHref="/sign-in"
/>`;

/** Auth Card — boardui.com/components/auth-card (free). */
export default function AuthCardPage() {
  const command = "npx boardui@latest add auth-card";
  return (
    <DocsLayout variant="library" title="Auth Card">
      <p className="text-body-regular text-text-secondary">
        Sign-in and sign-up blocks built on the social login buttons. The providers sit under the email form and
        arrange three ways from the same array: stacked with labels, inline as compact icons, or spread across equal
        columns. Pass media for the two-column split with artwork. A verify mode covers the one-time-code step. The
        form is uncontrolled and hands you its FormData, so it wraps whatever auth library you already use.
      </p>

      <Section title="Installation">
        <p className="text-body-regular text-text-secondary">
          You can add the auth card block using our CLI or manually. Dark mode ready — this component follows
          BoardUI semantic tokens automatically.
        </p>
        <div className="flex items-center justify-between gap-3 rounded-3xl border border-border-button-default bg-background-secondary-default px-4 py-3">
          <code className="text-body-2-regular overflow-x-auto text-text-primary">{command}</code>
          <CopyButton text={command} />
        </div>
      </Section>

      <Section title="Layouts">
        <p className="text-body-regular text-text-secondary">
          Both layouts put the providers after the email form, since that is the path the card is built around.{" "}
          <code className="text-body-2-regular text-text-primary">stacked</code> gives each provider a full-width
          button with its name, which suits a dedicated sign-in page where there is room to spell them out.{" "}
          <code className="text-body-2-regular text-text-primary">inline</code> shrinks them to icon-only squares,
          compact enough for a modal or a narrow panel and able to carry more providers in the same space. Both read
          the same <code className="text-body-2-regular text-text-primary">providers</code> array, so switching is
          one prop.
        </p>
        <Demo>
          <div className="w-full max-w-[400px]">
            <AuthCard layout="stacked" providers={["google", "apple", "github"]} headingLevel={2} />
          </div>
        </Demo>
        <Demo>
          <div className="w-full max-w-[400px]">
            <AuthCard
              layout="inline"
              providers={["google", "apple", "github", "x", "figma", "slack"]}
              headingLevel={2}
            />
          </div>
        </Demo>
        <Code code={LAYOUTS_CODE} />
      </Section>

      <Section title="Split with artwork">
        <p className="text-body-regular text-text-secondary">
          Passing <code className="text-body-2-regular text-text-primary">media</code> turns the card into a
          two-column split: the form on the left, whatever you hand it on the right. It is the shape for a dedicated
          sign-up page, where there is room for artwork and the extra fields that go with it. Below{" "}
          <code className="text-body-2-regular text-text-primary">md</code> the media is dropped rather than
          stacked, since a tall image above the fields pushes the form off a phone screen for no gain.
        </p>
        <p className="text-body-regular text-text-secondary">
          <code className="text-body-2-regular text-text-primary">media</code> takes any node, so a single image or
          a video works.{" "}
          <code className="text-body-2-regular text-text-primary">AuthMediaCarousel</code> ships alongside the card
          for the common case: hand it a list of images and it crossfades between them on its own, holding on the
          first under <code className="text-body-2-regular text-text-primary">prefers-reduced-motion</code>. It
          offers no arrows on purpose — artwork beside a sign-in form is atmosphere, and controls invite the visitor
          away from what they came to do.
        </p>
        <p className="text-body-regular text-text-secondary">
          Three options usually travel with it:{" "}
          <code className="text-body-2-regular text-text-primary">centered</code> for the heading,{" "}
          <code className="text-body-2-regular text-text-primary">confirmPassword</code> to pair the two password
          fields on one row, and <code className="text-body-2-regular text-text-primary">footnote</code> for small
          print that sits under the card rather than crowding the CTA. The providers use{" "}
          <code className="text-body-2-regular text-text-primary">layout=&quot;grid&quot;</code>, which spreads
          icon-only buttons across equal columns so they read as one row of controls.
        </p>
        <Code code={SPLIT_CODE} />
      </Section>

      <Section title="With a logo">
        <p className="text-body-regular text-text-secondary">
          <code className="text-body-2-regular text-text-primary">logo</code> puts a mark above the title,
          following <code className="text-body-2-regular text-text-primary">centered</code> for its alignment. It
          takes a node rather than an image path on purpose: the card stays brand-agnostic, so an installed copy
          carries none of BoardUI&apos;s artwork and drops in your own. The demo passes the animated Pro badge.
        </p>
        <Demo>
          <div className="w-full max-w-[400px]">
            <AuthCard
              centered
              logo={<Avatar size="md" color="blue" initials="B" />}
              title="Sign in to BoardUI Pro"
              description="Your license unlocks every Pro component and template."
              headingLevel={2}
            />
          </div>
        </Demo>
        <Code code={LOGO_CODE} />
      </Section>

      <Section title="Sign in and sign up">
        <p className="text-body-regular text-text-secondary">
          <code className="text-body-2-regular text-text-primary">mode</code> switches the copy and the fields.{" "}
          <code className="text-body-2-regular text-text-primary">signin</code> carries remember me and a
          forgot-password link; <code className="text-body-2-regular text-text-primary">signup</code> adds a name
          field and the terms line, and drops the two controls that only make sense on a return visit.
        </p>
        <Demo>
          <div className="w-full max-w-[400px]">
            <AuthCard mode="signin" headingLevel={2} />
          </div>
        </Demo>
        <Demo>
          <div className="w-full max-w-[400px]">
            <AuthCard mode="signup" headingLevel={2} />
          </div>
        </Demo>
        <Code code={MODES_CODE} />
      </Section>

      <Section title="Verification code">
        <p className="text-body-regular text-text-secondary">
          <code className="text-body-2-regular text-text-primary">mode=&quot;verify&quot;</code> is the step after
          signing in or up: the OTP boxes replace the email and password fields, a resend action replaces the link to
          the other mode, and the providers disappear entirely, since whoever is looking at this has already chosen
          how they sign in. It keeps the same left-aligned shape as the other two modes, so the step reads as part
          of the same flow, and takes a mail mark by default, which{" "}
          <code className="text-body-2-regular text-text-primary">logo</code> overrides.
        </p>
        <p className="text-body-regular text-text-secondary">
          Pass <code className="text-body-2-regular text-text-primary">email</code> to name the address in the
          description, and <code className="text-body-2-regular text-text-primary">onComplete</code> to act the
          moment the last digit lands rather than waiting for the button.
        </p>
        <Demo>
          <div className="w-full max-w-[400px]">
            <AuthCard mode="verify" email="mertcan@boardui.com" codeLength={6} headingLevel={2} />
          </div>
        </Demo>
        <Code code={VERIFY_CODE} />
      </Section>

      <Section title="Providers">
        <p className="text-body-regular text-text-secondary">
          Any of the social button&apos;s 24 brands, in the order you list them. They use the outlined{" "}
          <code className="text-body-2-regular text-text-primary">white</code> appearance, which is the one that
          shows each provider&apos;s real multi-colour mark: a stack of saturated brand fills competes with itself
          and makes no single option readable.
        </p>
        <Demo>
          <div className="w-full max-w-[400px]">
            <AuthCard providers={["google", "microsoft", "okta"]} headingLevel={2} />
          </div>
        </Demo>
        <Code code={PROVIDERS_CODE} />
      </Section>

      <Section title="Wiring it up">
        <p className="text-body-regular text-text-secondary">
          The card is the shell, not an opinion about authentication. The form is uncontrolled and{" "}
          <code className="text-body-2-regular text-text-primary">onSubmit</code> hands you its{" "}
          <code className="text-body-2-regular text-text-primary">FormData</code>, while{" "}
          <code className="text-body-2-regular text-text-primary">onProvider</code> fires with the brand that was
          clicked, so both go straight to NextAuth, Clerk, Supabase or your own endpoint.
        </p>
        <Code code={WIRING_CODE} />
      </Section>

      <div>
        <LinkButton href="/components" variant="secondary" size="medium" leadingIcon={RiArrowLeftLine}>
          Back to components
        </LinkButton>
      </div>
    </DocsLayout>
  );
}
