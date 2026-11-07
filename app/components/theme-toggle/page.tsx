"use client";

import { RiArrowLeftLine } from "@remixicon/react";

import { AppShell } from "@/components/application/app-shell/app-shell";
import { Chip } from "@/components/base/badges/chip";
import { CodeTabs, PkgCommand } from "@/components/application/docs/code-tabs";
import { FileCodeBlock, InstallStep, InstallTabs } from "@/components/application/docs/install-tabs";
import { ThemeToggle } from "@/components/application/theme/theme-toggle";
import { LinkButton } from "@/components/base/buttons/link-button";
import { THEME_TOGGLE_TSX_CODE } from "./theme-toggle-source";

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

const PREVIEW_CODE = `import { ThemeToggle} from "@/components/application/theme/theme-toggle";

export function SidebarFooter() {
  return <ThemeToggle />;
}`;

const SETUP_CODE = `// app/layout.tsx
import Script from "next/script";
import "@/styles/globals.css";

const themeScript =
  '(function(){try{var dark=localStorage.getItem("boardui:theme")==="dark";document.documentElement.classList.toggle("dark",dark)}catch(e){document.documentElement.classList.remove("dark")}})();';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <Script id="boardui-theme" strategy="beforeInteractive">
          {themeScript}
        </Script>
        {children}
      </body>
    </html>
  );
}`;

const COLLAPSED_CODE = `<ThemeToggle collapsed />`;

/** Theme Toggle detail page: boardui.com/components/theme-toggle, in-site. */
export default function ThemeTogglePage() {
  return (
    <AppShell title="Theme Toggle" actions={null} columnClassName="max-w-[964px]">
      <div className="flex flex-col gap-8 pb-8">
        <div className="flex flex-col gap-3">
          <div className="flex items-center gap-2">
            <Chip variant="bold" color="lime">
              Free
            </Chip>
          </div>
          <p className="text-body-regular text-text-secondary">
            A manual light/dark control for application sidebars. The next theme reveals smoothly from the exact
            interaction point, the user&rsquo;s choice persists locally, and reduced-motion or unsupported browsers
            fall back to an immediate switch.
          </p>
        </div>

        <Section title="Preview">
          <Demo>
            <ThemeToggle />
          </Demo>
          <CodeBlock code={PREVIEW_CODE} />
        </Section>

        <Section title="Installation">
          <p className="text-body-regular text-text-secondary">
            Add the reusable theme toggle and its semantic theme dependencies using the CLI or manually:
          </p>
          <p className="text-body-regular text-text-secondary">
            Dark mode ready - this component follows BoardUI semantic tokens automatically.{" "}
            <a className="text-accent-500 hover:underline" href="/installation#dark-mode">
              Set up theme switching
            </a>
            .
          </p>
          <InstallTabs
            cli={
              <>
                <p className="text-headline-medium text-text-secondary">The CLI copies the component source (with its internal dependencies) into your project and installs any required npm packages.</p>
                <PkgCommand
                  npm="npx boardui@latest add theme-toggle"
                  pnpm="pnpm dlx boardui@latest add theme-toggle"
                  yarn="yarn dlx boardui@latest add theme-toggle"
                />
                <p className="text-body-regular text-text-secondary">
                  Using a shared UI package or custom import aliases?{" "}
                  <a className="text-accent-500 hover:underline" href="/installation#monorepos">
                    Configure your installation paths
                  </a>{" "}
                  before running the CLI. Copy-paste examples use the default imports.
                </p>
              </>
            }
            manual={
              <>
                <InstallStep index={1} title="Install the following dependencies">
                  <PkgCommand
                    npm="npm install @remixicon/react react-aria-components"
                    pnpm="pnpm add @remixicon/react react-aria-components"
                    yarn="yarn add @remixicon/react react-aria-components"
                  />
                </InstallStep>
                <InstallStep index={2} title={<>Create a <code className="font-mono text-[13px] text-text-primary">theme-toggle.tsx</code> file and paste the following into it.</>}>
                  <FileCodeBlock file="theme-toggle.tsx" code={THEME_TOGGLE_TSX_CODE} />
                </InstallStep>
                <InstallStep index={3} title="Update the import paths to match your project setup.">
                  <p className="text-body-regular text-text-secondary">
                    Using a shared UI package or custom import aliases?{" "}
                    <a className="text-accent-500 hover:underline" href="/installation#monorepos">
                      Configure your installation paths
                    </a>{" "}
                    before running the CLI. Copy-paste examples use the default imports.
                  </p>
                </InstallStep>
              </>
            }
          />
        </Section>

        <Section title="Project setup">
          <p className="text-body-regular text-text-secondary">
            Light is the default. Apply the saved{" "}
            <code className="font-mono text-caption-1-medium text-text-primary">boardui:theme</code> value before
            hydration to prevent a first-paint flash, and add{" "}
            <code className="font-mono text-caption-1-medium text-text-primary">suppressHydrationWarning</code>{" "}
            because the root class is set in the browser before React hydrates.
          </p>
          <CodeTabs tabs={[{ value: "Next.js", code: SETUP_CODE }]} />
          <p className="text-body-regular text-text-secondary">
            The toggle is manual-only: it does not read the operating-system theme. Its reduced-motion and
            unsupported-browser fallbacks switch immediately without the circular reveal.
          </p>
        </Section>

        <Section title="Collapsed sidebar">
          <p className="text-body-regular text-text-secondary">
            Set <code className="font-mono text-caption-1-medium text-text-primary">collapsed</code> for a 36px
            icon-only control that fits a compact sidebar rail while keeping the same accessible pressed state.
          </p>
          <CodeTabs tabs={[{ value: "usage", code: COLLAPSED_CODE }]} />
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
