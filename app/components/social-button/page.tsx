"use client";

import { useState, type ReactNode } from "react";
import Link from "next/link";
import { RiArrowLeftLine, RiCheckLine, RiFileCopyLine } from "@remixicon/react";
import { DocsLayout } from "@/components/application/docs/docs-layout";
import { RiShieldKeyholeLine } from "@remixicon/react";

function CodeBlock({ code, label = "Code" }: { code: string; label?: string }) {
  const [copied, setCopied] = useState(false);
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(code);
    } catch {
      const el = document.createElement("textarea");
      el.value = code;
      document.body.appendChild(el);
      el.select();
      document.execCommand("copy");
      document.body.removeChild(el);
    }
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1500);
  };
  return (
    <div className="overflow-hidden rounded-xl border border-border-button-default bg-background-secondary-default">
      <div className="flex items-center justify-between gap-2 border-b border-separator-border px-4 py-2">
        <span className="text-caption-1-medium text-text-tertiary">{label}</span>
        <button
          type="button"
          onClick={copy}
          className="inline-flex items-center gap-1 rounded-md px-2 py-1 text-caption-1-medium text-text-secondary outline-none hover:bg-background-tertiary-default hover:text-text-primary focus-visible:ring-2 focus-visible:ring-border-focus-ring"
        >
          {copied ? <RiCheckLine className="size-3.5" /> : <RiFileCopyLine className="size-3.5" />}
          {copied ? "Copied" : "Copy"}
        </button>
      </div>
      <pre dir="ltr" className="overflow-x-auto p-4 font-mono text-caption-1-regular text-text-primary">
        <code>{code}</code>
      </pre>
    </div>
  );
}

function Section({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="flex flex-col gap-4">
      <h2 className="text-title-2-medium text-text-primary">{title}</h2>
      {children}
    </section>
  );
}

function Demo({ children }: { children: ReactNode }) {
  return (
    <div className="rounded-3xl border border-border-button-default bg-background-primary-default p-6">
      {children}
    </div>
  );
}

function BackLink() {
  return (
    <Link
      href="/components"
      className="inline-flex w-fit items-center gap-1.5 rounded-md text-body-medium text-text-secondary outline-none hover:text-text-primary focus-visible:ring-2 focus-visible:ring-border-focus-ring"
    >
      <RiArrowLeftLine className="size-4" />
      Back to components
    </Link>
  );
}

import { SocialButton } from "@/components/base/social-button/social-button";

export default function SocialButtonPage() {
  return (
    <DocsLayout variant="library" title="Social Button">
      <div className="flex flex-col gap-10 pb-10">
        <p className="text-body-regular text-text-secondary">
          Login buttons for 24 providers plus custom brands. Naming the brand supplies its logo, colour and
          accessible label together, so a stack of them cannot drift apart. Renders a button by default, or an
          anchor when given an href, since an OAuth start is a navigation.
        </p>

        <Section title="Installation">
          <p className="text-body-regular text-text-secondary">
            You can add the social button component using our CLI or manually. The CLI copies the component
            source (with its internal dependencies) into your project and installs any required npm packages.
          </p>
          <CodeBlock label="CLI" code={`npx boardui@latest add social-button`} />
        </Section>

        <Section title="Brands">
          <p className="text-body-regular text-text-secondary">
            All 24 logos ship inline with the component, so an install pulls no icon package. The full-colour
            marks come from SVG Logos (CC0), the monochrome glyphs from Simple Icons (CC0), and the four brands
            Simple Icons no longer carries from Bootstrap Icons (MIT). Amazon has no full-colour mark upstream,
            so under white it falls back to its brand-tinted glyph.
          </p>
          <CodeBlock
            label="SocialBrand"
            code={`type SocialBrand =
  | "google"
  | "apple"
  | "github"
  | "gitlab"
  | "microsoft"
  | "x"
  | "facebook"
  | "linkedin"
  | "discord"
  | "slack"
  | "figma"
  | "notion"
  | "dropbox"
  | "spotify"
  | "twitch"
  | "reddit"
  | "tiktok"
  | "instagram"
  | "telegram"
  | "whatsapp"
  | "amazon"
  | "bitbucket"
  | "auth0"
  | "okta"
  | "custom";`}
          />
        </Section>

        <Section title="Appearance">
          <p className="text-body-regular text-text-secondary">
            colorful is the default: the brand&apos;s own colour in the same gradient-and-shadow recipe as the
            primary Button, so it reads as a BoardUI control rather than a pasted-in widget. black is the same
            shape in high-contrast solid. white is outlined, and the only one that shows each provider&apos;s
            real multi-colour mark, since on a saturated fill that artwork would fight the background. For a
            stack of several providers, prefer white: a column of competing brand fills makes no single option
            readable.
          </p>
          <Demo>
            <div className="flex flex-wrap items-start gap-6">
              <div className="flex w-full max-w-[250px] flex-col gap-2">
                <SocialButton brand="google" appearance="white" fullWidth />
                <SocialButton brand="apple" appearance="white" fullWidth />
                <SocialButton brand="github" appearance="white" fullWidth />
              </div>
              <div className="flex flex-col gap-2">
                <SocialButton brand="google" appearance="colorful" />
                <SocialButton brand="google" appearance="black" />
              </div>
            </div>
          </Demo>
          <CodeBlock
            code={`{/* Colorful: the brand colour in the primary Button's gradient (default) */}
<SocialButton brand="google" appearance="colorful" />

{/* Black: the same shape in high-contrast solid */}
<SocialButton brand="google" appearance="black" />

{/* White: outlined, and the one that shows the real multi-colour mark */}
<SocialButton brand="google" appearance="white" />`}
          />
        </Section>

        <Section title="Sizes">
          <p className="text-body-regular text-text-secondary">
            medium (36px) and small (32px) are the base Button&apos;s own sizes to the pixel, radius and glyph
            size included, so these sit in a form beside a Button without a half-step in the rhythm. Both carry
            a fixed width (300px and 250px) so a column of providers lines up on its own; fullWidth hands that
            back to the container.
          </p>
          <Demo>
            <div className="flex flex-col gap-2">
              <SocialButton brand="slack" size="medium" />
              <SocialButton brand="slack" size="small" />
              <SocialButton brand="slack" fullWidth />
            </div>
          </Demo>
          <CodeBlock
            code={`<SocialButton brand="slack" size="medium" />  {/* 36px, like Button medium */}
<SocialButton brand="slack" size="small" />   {/* 32px, like Button small */}

{/* Drop the fixed width when the container should decide */}
<SocialButton brand="slack" fullWidth />`}
          />
        </Section>

        <Section title="Icon only">
          <p className="text-body-regular text-text-secondary">
            A square button showing just the logo, for the row of alternatives under an email field. The brand
            name moves to aria-label, so the control still announces itself.
          </p>
          <Demo>
            <div className="flex items-center gap-2">
              <SocialButton brand="google" appearance="white" iconOnly />
              <SocialButton brand="apple" appearance="white" iconOnly />
              <SocialButton brand="github" appearance="white" iconOnly />
            </div>
          </Demo>
          <CodeBlock
            code={`<SocialButton brand="google" appearance="white" iconOnly />
<SocialButton brand="apple" appearance="white" iconOnly />
<SocialButton brand="github" appearance="white" iconOnly />

{/* The brand name stays as the accessible name when the label is hidden */}`}
          />
        </Section>

        <Section title="Custom brand">
          <p className="text-body-regular text-text-secondary">
            For an identity provider that is not built in, pass brand=&quot;custom&quot; with a config. Only
            icon is required: label defaults to SSO and color to black.
          </p>
          <Demo>
            <div className="flex flex-col gap-2">
              <SocialButton
                brand="custom"
                config={{ icon: <RiShieldKeyholeLine className="size-5" />, label: "Okta SSO", color: "#0f172a" }}
              />
              <SocialButton brand="custom" config={{ icon: <RiShieldKeyholeLine className="size-5" /> }} />
            </div>
          </Demo>
          <CodeBlock
            code={`import { RiShieldKeyholeLine } from "@remixicon/react";

<SocialButton
  brand="custom"
  config={{
    icon: <RiShieldKeyholeLine className="size-5" />,
    label: "Okta SSO",
    color: "#0f172a",
  }}
/>

{/* label defaults to "SSO" and color to black */}
<SocialButton brand="custom" config={{ icon: <RiShieldKeyholeLine className="size-5" /> }} />`}
          />
        </Section>

        <Section title="Labels">
          <p className="text-body-regular text-text-secondary">
            The default label is Continue with a brand name. Pass children to say something else, since a
            sign-up screen and a login screen usually want different wording.
          </p>
          <Demo>
            <div className="flex flex-col gap-2">
              <SocialButton brand="google" />
              <SocialButton brand="google">Sign up with Google</SocialButton>
              <SocialButton brand="google">Log in</SocialButton>
            </div>
          </Demo>
          <CodeBlock
            code={`<SocialButton brand="google" />                        {/* Continue with Google */}
<SocialButton brand="google">Sign up with Google</SocialButton>
<SocialButton brand="google">Log in</SocialButton>`}
          />
        </Section>

        <Section title="Buttons and links">
          <p className="text-body-regular text-text-secondary">
            Passing href renders an anchor instead of a button. Most OAuth flows start by navigating to a
            provider URL, and an anchor gives that the right semantics, middle-click and keyboard behaviour for
            free.
          </p>
          <Demo>
            <div className="flex flex-col gap-2">
              <SocialButton brand="github" href="/api/auth/github" />
              <SocialButton brand="github" onClick={() => {}} />
            </div>
          </Demo>
          <CodeBlock
            code={`{/* An OAuth start is a navigation, so pass href and get an anchor */}
<SocialButton brand="github" href="/api/auth/github" />

{/* Otherwise it is a button */}
<SocialButton brand="github" onClick={() => signIn("github")} />`}
          />
        </Section>

        <Section title="Trademarks">
          <p className="text-body-regular text-text-secondary">
            The logos are trademarks of their respective owners, included here so you can build a sign-in
            screen. Several providers publish rules for their login buttons covering colour, clear space and
            wording, Google and Apple in particular, so check those before shipping a production login.
          </p>
        </Section>

        <BackLink />
      </div>
    </DocsLayout>
  );
}
