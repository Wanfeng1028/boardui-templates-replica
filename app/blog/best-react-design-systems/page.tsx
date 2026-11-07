"use client";

import Link from "next/link";
import { RiArrowLeftLine } from "@remixicon/react";

import { DocsLayout } from "@/components/application/docs/docs-layout";
import {
  ArticleFigure,
  TemplateFigure,
} from "@/components/application/blog/blog-article-footer";
import { ComposerAttachments } from "@/components/application/pro/composer-attachments";
import {
  ArticleCta,
  MoreFromBlog,
  SiteFooter,
} from "@/components/application/blog/blog-article-footer";

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="flex flex-col gap-3">
      <h2 className="text-title-2-medium text-text-primary">{title}</h2>
      {children}
    </section>
  );
}

function P({ children }: { children: React.ReactNode }) {
  return <p className="text-body-regular text-text-secondary">{children}</p>;
}

function Bullets({ items }: { items: React.ReactNode[] }) {
  return (
    <ul className="flex list-disc flex-col gap-1.5 ps-5 text-body-regular text-text-secondary">
      {items.map((item, i) => (
        <li key={i}>{item}</li>
      ))}
    </ul>
  );
}

function Code({ children }: { children: React.ReactNode }) {
  return <code className="font-mono text-caption-1-medium text-text-primary">{children}</code>;
}

type SystemInfo = {
  n: number;
  name: string;
  img: string;
  imgAlt: string;
  meta: [string, string][];
  intro: React.ReactNode[];
  /** Figure after the intro paragraphs (BoardUI only: Composer Attachments). */
  afterIntro?: React.ReactNode;
  featuresTitle: string;
  features: React.ReactNode[];
  /** Block after the feature bullets (BoardUI only: "Pro adds..." + Marketing Dashboard). */
  afterFeatures?: React.ReactNode;
  pros: string[];
  cons: string[];
  noticed: string;
  bestFor: string;
};

const IMG = (file: string) =>
  `https://www.boardui.com/_next/image?url=%2Fblog%2Fbest-react-design-systems%2Fsites%2F${file}&w=1200&q=75`;

const COMPARISON: [string, string, string, string, string, string][] = [
  ["1", "BoardUI (ours)", "AI and agent products, dashboards", "React Aria, Tailwind CSS v4", "", "Pro from €149, one-time"],
  ["2", "shadcn/ui", "Owning every line of your own system", "Base UI, Radix or React Aria; Tailwind CSS v4", "", "Free"],
  ["3", "Untitled UI React", "Teams designing in the Untitled UI Figma kit", "React Aria, Tailwind CSS v4", "", "PRO from $349, one-time"],
  ["4", "HeroUI", "A finished React Aria look, installed from npm", "React Aria, Tailwind CSS v4", "", "Pro from $299, one-time"],
  ["5", "affectUI", "Agent components next to shadcn/ui", "Its own, CSS in each component", "", "Pro from $199, one-time ($249 from 6 November)"],
  ["6", "Mantine", "121 free core components, with hooks and forms", "Its own, CSS modules", "", "Free"],
  ["7", "Chakra UI", "Styling with props and tokens in TypeScript", "Ark UI, Emotion", "", "Pro blocks from $299, one-time"],
  ["8", "Ant Design", "Admin tools, plus AI chat with Ant Design X", "Its own, CSS-in-JS", "", "Free"],
  ["9", "beUI", "Animated components and free AI screens", "Its own, Tailwind CSS v4", "", "Pro $129 a year or $179 one-time"],
  ["10", "PrimeReact", "78 styled components in one package", "Its own, CSS-in-JS", "Small teams only", "$599 per developer, one-time (launch price)"],
];

const SYSTEMS: SystemInfo[] = [
  {
    n: 1,
    name: "BoardUI (our pick)",
    img: IMG("boardui.webp"),
    imgAlt: "The BoardUI website, with the headline React Design System for Agentic Interface",
    meta: [
      ["Website", "boardui.com"],
      ["GitHub", "BoardUI/boardui"],
      ["GitHub stars", "679"],
      ["npm downloads", "8.5k total (CLI runs)"],
      ["License", "MIT free tier, commercial Pro"],
      ["Pricing", "Free; Pro €149 to €349, one-time"],
    ],
    intro: [
      <>
        We built BoardUI, our React design system for agentic products, around the agent layer: the screens an AI
        product needs beyond a chat box. Underneath are React Aria Components and Tailwind CSS v4. The{" "}
        <Code>boardui</Code> CLI installs components, and Claude Code or Cursor can do the same through
        BoardUI&apos;s MCP server. It has 103 components, chart cards and blocks included, 73 of them free, all
        designed in-house in Figma on the same 400+ tokens the code uses.
      </>,
      <>
        Next to forms, overlays and charts, BoardUI has a composer with a model picker, thinking and progress
        states, task lists, research trails, usage limits and multi-agent chat. Our{" "}
        <Link href="/blog/react-design-system-for-agentic-products" className="text-accent-600 underline">
          post on agentic UI components
        </Link>{" "}
        walks through each one. Composer Attachments, part of Pro, shows the composer carrying files: image and
        document tiles land above the prompt one after another, with an upload ring drawing around each.
      </>,
    ],
    afterIntro: (
      <ArticleFigure name="Composer Attachments" slug="composer-attachments" pro>
        <ComposerAttachments />
      </ArticleFigure>
    ),
    featuresTitle: "BoardUI key features",
    features: [
      <>
        <strong className="text-text-primary">Agent screens:</strong> a composer, agent thinking, task list, web
        search, questionnaire, agent limits and multi-agent chat, most of them in Pro.
      </>,
      <>
        <strong className="text-text-primary">React Aria Components underneath:</strong> its dialogs, menus,
        selects and form fields get keyboard, focus and screen reader behavior from Adobe&apos;s accessibility
        library.
      </>,
      <>
        <strong className="text-text-primary">Tailwind CSS v4 and design tokens:</strong> 400+ tokens in plain
        CSS, and one 11-step accent ramp that re-tints buttons, form controls, tabs and focus rings in light and
        dark.
      </>,
      <>
        <strong className="text-text-primary">Source in your repo:</strong> the CLI copies each component&apos;s
        code into your project, so you can change any line.
      </>,
      <>
        <strong className="text-text-primary">MCP server and agent rules:</strong> your coding agent can list,
        read and install components, and <Code>init</Code> adds BoardUI&apos;s design rules for Cursor and your
        AGENTS.md.
      </>,
      <>
        <strong className="text-text-primary">Dashboards and charts:</strong> 19 chart cards, a free data table
        on TanStack Table, and a free data grid with editable cells, filters and CSV export.
      </>,
      <>
        <strong className="text-text-primary">Pro launch prices, paid once:</strong> €149 with a year of updates,
        €199 for lifetime updates, or €349 for up to five developers.
      </>,
    ],
    afterFeatures: (
      <>
        <P>
          Pro adds full dashboards and templates, such as this marketing dashboard:{" "}
          <Link href="/templates/marketing" className="text-accent-600 underline">
            Marketing Dashboard
          </Link>
        </P>
        <TemplateFigure name="Marketing Dashboard" slug="marketing-dashboard" src="/templates/marketing" />
      </>
    ),
    pros: [
      "Finished agent screens and templates, including multi-agent chat",
      "The CLI or your coding agent puts editable source in your repo",
      "React Aria handles keyboard and focus, so your team doesn't write that code",
      "Dashboards and charts that match the rest of BoardUI",
      "You pay for Pro once",
    ],
    cons: [
      "Most agent components, 17 of the 19 chart cards and all templates but Chat Starter need Pro",
      "A heavier page than most: 273 KB in our test, third heaviest of the ten",
      "No Figma kit for customers",
      "Still new: the CLI first shipped in July 2026, and the repo has 679 GitHub stars",
    ],
    noticed:
      "our second build, on CLI 0.5.9, passed all twelve keyboard and ARIA checks, but axe still flagged the error text at 3.8:1 contrast in light mode, below the 4.5:1 that WCAG AA asks for. axe can't read text on a gradient, so we measured the Save button from screenshots: with the pointer on it, part of its white label fell to 4.1:1.",
    bestFor: "building AI or agent products, or dashboards, from finished screens and code you own.",
  },
  {
    n: 2,
    name: "shadcn/ui",
    img: IMG("shadcn.webp"),
    imgAlt: "The shadcn/ui website, with the headline The Foundation for your Design System",
    meta: [
      ["Website", "ui.shadcn.com"],
      ["GitHub", "shadcn-ui/ui"],
      ["GitHub stars", "127k"],
      ["npm downloads", "16.7M/week (CLI)"],
      ["License", "MIT"],
      ["Pricing", "Free"],
    ],
    intro: [
      <>
        shadcn/ui is one of the most common starting points for a custom React design system. Its CLI copies each
        component into your repo, already styled with Tailwind CSS v4, on a headless base you pick at setup: Base
        UI (the default since July 2026), Radix or React Aria.
      </>,
      <>
        shadcn/ui added chat components in June 2026 and AI Elements in October. Its 66 components include chat
        parts such as Message, Bubble and Attachment, and AI Elements adds 21 copy-in patterns for prompts,
        reasoning, tool calls and sources.
      </>,
    ],
    featuresTitle: "shadcn/ui key features",
    features: [
      <>
        <strong className="text-text-primary">You own the code:</strong> every component is a file in your repo.
      </>,
      <>
        <strong className="text-text-primary">Pick your foundation:</strong> Base UI, Radix or React Aria, chosen
        when you set up the project.
      </>,
      <>
        <strong className="text-text-primary">AI Elements:</strong> 21 patterns for chat and agent interfaces,
        free.
      </>,
      <>
        <strong className="text-text-primary">Blocks:</strong> copy-in layouts, such as a dashboard with charts
        and a data table.
      </>,
      <>
        <strong className="text-text-primary">MCP server and skill:</strong> <Code>npx shadcn@latest mcp</Code>{" "}
        lets your coding agent browse and add components, and the skill gives it written instructions for working
        with them.
      </>,
    ],
    pros: [
      "Every component is yours to change",
      "The largest community here, with 127k GitHub stars",
      "Free AI Elements for chat and agent screens",
      "The third lightest page of the ten, at 221 KB",
    ],
    cons: [
      "You assemble and maintain the system yourself",
      "shadcn/ui doesn't link field errors to their inputs by default",
      "Your designers rely on community-made Figma kits",
    ],
    noticed:
      "setup took three commands. The field error showed, but it wasn't linked to its input, so a screen reader returning to the field won't read it, and axe flagged the Save button's hover color at 3.8:1.",
    bestFor: "owning every line of a system you design.",
  },
  {
    n: 3,
    name: "Untitled UI React",
    img: IMG("untitledui.webp"),
    imgAlt: "The Untitled UI React website, with the headline The ultimate open-source React UI component library",
    meta: [
      ["Website", "untitledui.com"],
      ["GitHub", "untitleduico/react"],
      ["GitHub stars", "2k"],
      ["npm downloads", "5.5k/week (CLI runs)"],
      ["License", "MIT free tier, commercial PRO"],
      ["Pricing", "Free; PRO from $349, one-time"],
    ],
    intro: [
      <>
        The Untitled UI Figma kit has a React counterpart: Untitled UI React, built on React Aria Components and
        Tailwind CSS v4. If your designers already work in that kit, your designs and your code share one source.
      </>,
      <>
        The free tier covers most base components, such as buttons, inputs, selects and toggles, plus 13 of the 37
        application categories, tables and charts among them. PRO adds the other application screens, marketing
        sections and page examples, as a one-time purchase per team size.
      </>,
    ],
    featuresTitle: "Untitled UI React key features",
    features: [
      <>
        <strong className="text-text-primary">A matching Figma kit:</strong> a free kit and a PRO kit that mirror
        the components.
      </>,
      <>
        <strong className="text-text-primary">Built on React Aria:</strong> accessible behavior under its
        interactive components.
      </>,
      <>
        <strong className="text-text-primary">Copy-in source:</strong> <Code>npx untitledui@latest</Code> puts
        the code in your repo.
      </>,
      <>
        <strong className="text-text-primary">Free tables and charts:</strong> among the 13 application
        categories you get without PRO.
      </>,
      <>
        <strong className="text-text-primary">MCP endpoint and agent rules:</strong> an official remote MCP server
        and an AGENT.md file for coding agents.
      </>,
    ],
    pros: [
      "Design and code stay in sync through the Figma kit",
      "React Aria accessibility, with the component source in your repo",
      "PRO adds the other 24 of its 37 application categories",
    ],
    cons: [
      "The toast and styled modals need PRO",
      "It ships no free AI components, and chat UI is PRO only",
      "Right-to-left layouts need a migration command",
    ],
    noticed:
      "the title, padding and toast in our build were our own, because the free tier had only a bare modal shell and no toast. The dialog passed all twelve keyboard and ARIA checks, and axe flagged the select placeholder at 4.2:1 in dark mode.",
    bestFor: "design teams working from the Untitled UI Figma kit.",
  },
];

const SYSTEMS_2: SystemInfo[] = [
  {
    n: 4,
    name: "HeroUI",
    img: IMG("heroui.webp"),
    imgAlt: "The HeroUI website, with the headline Beautiful by default. Customizable by design.",
    meta: [
      ["Website", "heroui.com"],
      ["GitHub", "heroui-inc/heroui"],
      ["GitHub stars", "31.1k"],
      ["npm downloads", "1.1M/week"],
      ["License", "Apache-2.0"],
      ["Pricing", "Free; Pro from $299, one-time"],
    ],
    intro: [
      <>
        HeroUI puts React Aria&apos;s accessibility in an npm package, and its components work without wrapping
        your app in a provider. Once called NextUI, it rebuilt version 3 on React Aria Components and Tailwind CSS
        v4, with styling through CSS variables and classes. It has 73 open-source components, and HeroUI Pro adds
        65 more, among them 14 AI and chat components such as Prompt Input and Chain Of Thought.
      </>,
    ],
    featuresTitle: "HeroUI key features",
    features: [
      <>
        <strong className="text-text-primary">React Aria foundation:</strong> keyboard, focus and screen reader
        behavior from Adobe&apos;s library.
      </>,
      <>
        <strong className="text-text-primary">Tailwind CSS v4 theming:</strong> OKLCH color variables, so the
        accent changes with three lines of CSS.
      </>,
      <>
        <strong className="text-text-primary">npm updates:</strong> new versions arrive as package updates, with
        no code to merge.
      </>,
      <>
        <strong className="text-text-primary">Agent integrations:</strong> an official MCP server and a skill for
        coding agents.
      </>,
      <>
        <strong className="text-text-primary">Free Figma kit:</strong> HeroUI&apos;s own kit for version 3, free
        on Figma Community.
      </>,
    ],
    pros: [
      "Looks finished on install",
      "Form validation, focus and error linking work straight from the docs",
      "Updates install from npm",
      "HeroUI publishes its Figma kit for free",
    ],
    cons: [
      "AI and chat components require Pro",
      "Component code stays in the npm package, outside your repo",
      "The recommended setup loads every component's CSS, 42 KB in our test",
    ],
    noticed:
      "validation worked from the docs' first example, and all twelve keyboard and ARIA checks passed. axe flagged the error text's contrast in both themes.",
    bestFor: "React Aria accessibility with a finished look, in a package you update from npm.",
  },
  {
    n: 5,
    name: "affectUI",
    img: IMG("affectui.webp"),
    imgAlt: "The affectUI website, with the headline UI for AI agents",
    meta: [
      ["Website", "affectui.com"],
      ["GitHub", "flohoeller/affectui"],
      ["GitHub stars", "411"],
      ["npm downloads", "Not on npm"],
      ["License", "MIT free tier, commercial Pro"],
      ["Pricing", "Free; Pro from $199, one-time ($249 from 6 November)"],
    ],
    intro: [
      <>
        Each affectUI component is a single file that carries its own CSS and dark mode, written on native HTML
        elements with no headless library or Tailwind CSS underneath.
      </>,
      <>
        You&apos;d install it for the agent parts: of its 71 components, 30 are for agents and 10 for chat. The
        catalog adds 15 screens, 11 blocks, 24 illustrations and 8 motion effects, for 129 items in all. Of those,
        40 are free, among them 17 illustrations, Thinking Loader and Tool Call Card. affectUI has no dialog, text
        field, select or switch, free or Pro, and its compare pages recommend shadcn/ui for forms and dialogs.
      </>,
    ],
    featuresTitle: "affectUI key features",
    features: [
      <>
        <strong className="text-text-primary">Agent and chat components:</strong> 30 for what agents do and 10
        for chat, such as Thinking Loader and Tool Call Card.
      </>,
      <>
        <strong className="text-text-primary">One file per component:</strong> each carries its own CSS and dark
        mode, with no Tailwind CSS or styling library to install.
      </>,
      <>
        <strong className="text-text-primary">Install with the shadcn CLI or MCP:</strong> the source is copied
        into your repo, and the official MCP server can hand it to your coding agent.
      </>,
      <>
        <strong className="text-text-primary">Illustrations and motion:</strong> 24 illustrations, 17 of them
        free, and 8 motion effects.
      </>,
      <>
        <strong className="text-text-primary">Pro with lifetime updates:</strong> $199 for one person, rising to
        $249 on 6 November, or $499 for a team of ten, paid once.
      </>,
    ],
    pros: [
      "40 of its 71 components are for agents or chat",
      "Each component is one file, CSS and dark mode included",
      "Works without Tailwind CSS",
      "Lifetime updates for one Pro payment",
    ],
    cons: [
      "No dialog, text field, select or switch, so forms need another library",
      "The toast is Pro, and its free stand-in, the Notification Stack, doesn't announce itself to screen readers",
      "No Figma kit to design with",
      "One contributor and 411 GitHub stars, on a repo started in October 2026",
    ],
    noticed:
      "we built the dialog, text field, select and switch with shadcn/ui, as affectUI's compare pages suggest, so most of the dialog is shadcn/ui's and its page weight nearly matches the shadcn/ui build. axe found nothing, but it can't read affectUI's button labels, because each one carries a shimmer layer, so we measured them from screenshots: they passed at the hover shade we set, which affectUI leaves to you. Ten of the twelve keyboard and ARIA checks passed: as in the shadcn/ui build, the field error wasn't linked to its input, and the free Notification Stack we used as the toast isn't announced to screen readers.",
    bestFor: "shadcn/ui projects that need agent components, one file each.",
  },
  {
    n: 6,
    name: "Mantine",
    img: IMG("mantine.webp"),
    imgAlt: "The Mantine website, with the headline A fully featured React components library",
    meta: [
      ["Website", "mantine.dev"],
      ["GitHub", "mantinedev/mantine"],
      ["GitHub stars", "31.9k"],
      ["npm downloads", "3.7M/week"],
      ["License", "MIT"],
      ["Pricing", "Free"],
    ],
    intro: [
      <>
        Mantine&apos;s 121 core components come free, along with hooks, forms, notifications and 22 chart
        components, 16 of them on Recharts, a charting library. Its styles ship as plain CSS files.
      </>,
    ],
    featuresTitle: "Mantine key features",
    features: [
      <>
        <strong className="text-text-primary">121 core components:</strong> inputs, overlays, navigation, data
        display and more.
      </>,
      <>
        <strong className="text-text-primary">Hooks and forms:</strong> <Code>@mantine/hooks</Code> and{" "}
        <Code>@mantine/form</Code>, from the same team.
      </>,
      <>
        <strong className="text-text-primary">Charts:</strong> 22 chart components, 16 of them built on Recharts.
      </>,
      <>
        <strong className="text-text-primary">Dark mode with one setting:</strong>{" "}
        <Code>defaultColorScheme=&quot;auto&quot;</Code> follows the system.
      </>,
      <>
        <strong className="text-text-primary">An MCP server package:</strong> <Code>@mantine/mcp-server</Code>{" "}
        and three agent skills.
      </>,
    ],
    pros: [
      "121 core components, charts, hooks and forms for free",
      "Ships 200 KB of JavaScript, the least in our test",
      "Dark mode takes one setting",
      "The browser runs no styling library",
    ],
    cons: [
      "Mantine makes no Figma kit",
      "No components for AI screens",
      "npm installs the source outside your repo",
      "The full stylesheet adds 36 KB of CSS",
    ],
    noticed:
      "every keyboard and ARIA check passed, and the page carried the least JavaScript of the ten. Contrast was where Mantine slipped, with the select's placeholder at 2.1:1 and axe flagging the error text in both themes.",
    bestFor: "covering most needs with one free kit, if you don't plan to edit the component code.",
  },
  {
    n: 7,
    name: "Chakra UI",
    img: IMG("chakra.webp"),
    imgAlt: "The Chakra UI website, with the headline Chakra UI is a component system for building products with speed",
    meta: [
      ["Website", "chakra-ui.com"],
      ["GitHub", "chakra-ui/chakra-ui"],
      ["GitHub stars", "40.7k"],
      ["npm downloads", "2.2M/week"],
      ["License", "MIT"],
      ["Pricing", "Free; Pro blocks from $299, one-time"],
    ],
    intro: [
      <>
        You style Chakra UI components through props and recipes, named sets of style variants, and keep your
        tokens in TypeScript. Version 3 builds on Ark UI and styles with Emotion. Chakra UI Pro sells 330+
        ready-made blocks, five of them for AI.
      </>,
    ],
    featuresTitle: "Chakra UI key features",
    features: [
      <>
        <strong className="text-text-primary">Style props and recipes:</strong> style any component with props,
        and define variants once.
      </>,
      <>
        <strong className="text-text-primary">Semantic tokens:</strong> light and dark values side by side, in
        TypeScript.
      </>,
      <>
        <strong className="text-text-primary">Figma kit:</strong> an official one, made for version 3.
      </>,
      <>
        <strong className="text-text-primary">Charts on Recharts:</strong> 10 chart types.
      </>,
      <>
        <strong className="text-text-primary">MCP server for agents:</strong> <Code>@chakra-ui/react-mcp</Code>,
        plus three agent skills.
      </>,
    ],
    pros: [
      "The official Figma kit is free",
      "A complete token system in TypeScript",
      "A CLI snippet sets up dark mode, with no code for you to write",
      "Passed all twelve of our keyboard and ARIA checks",
    ],
    cons: [
      "Styling runs in JavaScript: Emotion writes the CSS as the page loads",
      "Matching the exact brand color took us a 45-line custom palette",
      "Without Pro, you get no AI components",
    ],
    noticed:
      "its switch reaches screen readers as a checkbox, because the hidden input underneath isn't marked as a switch. axe flagged the light-mode error text at 3.8:1.",
    bestFor: "props-based styling, with tokens kept in TypeScript.",
  },
];

const SYSTEMS_3: SystemInfo[] = [
  {
    n: 8,
    name: "Ant Design",
    img: IMG("antd.webp"),
    imgAlt: "The Ant Design website, with the headline Ant Design",
    meta: [
      ["Website", "ant.design"],
      ["GitHub", "ant-design/ant-design"],
      ["GitHub stars", "100k"],
      ["npm downloads", "5.0M/week"],
      ["License", "MIT"],
      ["Pricing", "Free"],
    ],
    intro: [
      <>
        Ant Design grew out of Ant Group&apos;s own enterprise products, and its large table, form and date
        components suit data-dense admin interfaces. Ant Design X adds 17 free AI components for chat interfaces,
        such as Bubble, Sender, Think and ThoughtChain.
      </>,
    ],
    featuresTitle: "Ant Design key features",
    features: [
      <>
        <strong className="text-text-primary">A data-dense component set:</strong> 72 components, including a
        form component and a table with sorting, filters, pagination, row selection and virtual scrolling.
      </>,
      <>
        <strong className="text-text-primary">Ant Design X:</strong> 17 AI components for chat interfaces.
      </>,
      <>
        <strong className="text-text-primary">Design tokens:</strong> light, dark and compact algorithms through
        one provider.
      </>,
      <>
        <strong className="text-text-primary">Right-to-left support:</strong> one <Code>direction</Code> setting.
      </>,
      <>
        <strong className="text-text-primary">Agent tooling:</strong> an MCP server in the <Code>antd</Code> CLI,
        a skill and llms.txt.
      </>,
    ],
    pros: [
      "Made for dense admin screens",
      "Free AI components in Ant Design X",
      "MIT and free",
      "Right-to-left layouts from a single setting",
    ],
    cons: [
      "309 KB, the heaviest page in our test",
      "Its Next.js guide needed a workaround on Next.js 16",
      "Sketch design files, with no official Figma version",
    ],
    noticed:
      "one Tab press from the last button moved focus out of the dialog, and axe flagged the select placeholder and the error text for contrast in both themes.",
    bestFor: "internal admin tools, with Ant Design X for AI chat.",
  },
  {
    n: 9,
    name: "beUI",
    img: IMG("beui.webp"),
    imgAlt: "The beUI website, with the headline Animated components for React and React Native",
    meta: [
      ["Website", "beui.dev"],
      ["GitHub", "starc007/ui-components"],
      ["GitHub stars", "1.9k"],
      ["npm downloads", "Not on npm"],
      ["License", "MIT free tier, commercial Pro"],
      ["Pricing", "Free; Pro $129 a year or $179 one-time"],
    ],
    intro: [
      <>
        beUI makes components for both React and React Native. The free React ones animate with the Motion
        animation library and use Tailwind CSS v4 for styling. They install with the shadcn CLI and read
        shadcn/ui&apos;s color tokens, so a shadcn/ui project can use them as they are. beUI writes its own
        keyboard and ARIA code and doesn&apos;t build on a headless library.
      </>,
      <>
        If you&apos;re building an agent screen, the free library has 18 AI components, such as Prompt Input, Tool
        Approval, Agent Activity and Voice Orb, next to 56 components, 24 blocks and 17 charts. beUI Pro adds more
        than 350 web blocks and templates, and 50 React Native blocks and screens.
      </>,
    ],
    featuresTitle: "beUI key features",
    features: [
      <>
        <strong className="text-text-primary">Animated by default:</strong> components move with Motion, like the
        morphing modal we used for the dialog.
      </>,
      <>
        <strong className="text-text-primary">18 free AI components:</strong> chat, prompt input, tool approvals
        and results, agent activity, citations, file diffs and a voice orb.
      </>,
      <>
        <strong className="text-text-primary">Charts and a table:</strong> 17 charts drawn with SVG and Motion,
        and a virtualized table with sorting, row selection and column resizing.
      </>,
      <>
        <strong className="text-text-primary">Made for shadcn/ui projects:</strong> components install with the
        shadcn CLI, as in <Code>npx shadcn@latest add @beui/button-base</Code>, and use shadcn/ui&apos;s color
        tokens.
      </>,
      <>
        <strong className="text-text-primary">A hosted MCP server:</strong> coding agents also get a skill and
        llms.txt.
      </>,
    ],
    pros: [
      "The cleanest accessibility results in our test",
      "At 216 KB, the lightest page in our test",
      "18 AI components and 17 charts without buying Pro",
      "React Native components from the same team, for mobile apps",
    ],
    cons: [
      "The Select takes no label, so you add your own",
      "Pressing Escape to dismiss a select closes the whole dialog",
      "Every dialog is an animated modal",
      "Your designers start without a Figma kit",
    ],
    noticed:
      "axe found nothing, all twelve keyboard and ARIA checks passed, and no text fell below 4.5:1 contrast. beUI has no plain dialog, so we used its Center Morph Modal, and its Select takes no label, so we wrapped it in one ourselves. Pressing Escape in the open select closed the whole dialog instead of just the list.",
    bestFor: "adding motion and free AI screens to your product, on the web and in React Native.",
  },
  {
    n: 10,
    name: "PrimeReact",
    img: IMG("primereact.webp"),
    imgAlt: "The PrimeReact website, with the headline Premium UI Suite for React",
    meta: [
      ["Website", "primereact.dev"],
      ["GitHub", "primefaces/primereact"],
      ["GitHub stars", "8.3k (v10 repo)"],
      ["npm downloads", "450k/week (6% on v11)"],
      ["License", "PrimeUI license (v11)"],
      ["Pricing", "Free Community key for small teams; Commercial $599 per developer, one-time (launch price, $799 list)"],
    ],
    intro: [
      <>
        PrimeReact ships 78 styled components, a DataTable among them, in one package. Version 11 also changed its
        license: versions up to 10.9.9 stay MIT, and version 11 needs a PrimeUI key. Small teams that qualify get
        a free Community key, with fewer than five developers, fewer than ten employees and under $1M in revenue
        among the conditions. Other teams pay $599 per developer for the Commercial license, one-time, until 31
        December 2026 ($799 list).
      </>,
    ],
    featuresTitle: "PrimeReact key features",
    features: [
      <>
        <strong className="text-text-primary">78 styled components:</strong> with themes such as Aura, Material
        and Lara.
      </>,
      <>
        <strong className="text-text-primary">DataTable and TreeTable:</strong> sorting, filtering, editing,
        grouping and CSV export.
      </>,
      <>
        <strong className="text-text-primary">Four modes:</strong> styled, Tailwind, unstyled primitives and
        headless hooks.
      </>,
      <>
        <strong className="text-text-primary">Dark mode by default:</strong> components follow the system.
      </>,
      <>
        <strong className="text-text-primary">For coding agents:</strong> <Code>@primereact/mcp</Code> and six
        agent skills.
      </>,
    ],
    pros: [
      "One install command brings in 78 styled components",
      "A DataTable that sorts, filters, edits and groups",
      "Dark mode without configuration",
    ],
    cons: [
      "Upgrading to version 11 means leaving open source",
      "Until you add a key, every page shows a license badge",
      "Without the Commercial license, charts cost $399 per developer",
      "10 of 12 keyboard and ARIA checks in our test",
    ],
    noticed:
      "without a key, every page showed an \"Invalid PrimeUI License\" badge. The dialog set no aria-modal and left the page behind it exposed to screen readers, the field error wasn't linked to its input, and axe flagged the toast's unnamed close button.",
    bestFor: "78 styled components from one package, if you qualify for the Community key or buy a license.",
  },
];

const ALL_SYSTEMS = [...SYSTEMS, ...SYSTEMS_2, ...SYSTEMS_3];

function SystemSection({ system }: { system: SystemInfo }) {
  return (
    <section className="flex flex-col gap-3">
      <h2 className="text-title-2-medium text-text-primary">
        {system.n}. {system.name}
      </h2>
      <span className="block overflow-hidden rounded-3xl border border-border-button-default bg-background-secondary-default">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={system.img} alt={system.imgAlt} className="aspect-[16/9] w-full object-cover object-top" />
      </span>
      <dl className="grid grid-cols-1 gap-x-6 gap-y-1.5 rounded-2xl border border-border-button-default bg-background-secondary-default p-4 sm:grid-cols-2">
        {system.meta.map(([label, value]) => (
          <div key={label} className="flex items-baseline gap-2">
            <dt className="shrink-0 text-caption-1-semibold text-text-tertiary">{label}</dt>
            <dd className="min-w-0 text-body-2-regular text-text-primary">{value}</dd>
          </div>
        ))}
      </dl>
      {system.intro.map((para, i) => (
        <P key={i}>{para}</P>
      ))}
      {system.afterIntro}
      <h3 className="text-title-3-semibold text-text-primary">{system.featuresTitle}</h3>
      <Bullets items={system.features} />
      {system.afterFeatures}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="flex flex-col gap-2 rounded-2xl border border-border-button-default bg-background-secondary-default p-4">
          <h4 className="text-body-medium text-text-primary">Pros</h4>
          <ul className="flex list-disc flex-col gap-1.5 ps-5 text-body-2-regular text-text-secondary">
            {system.pros.map((pro) => (
              <li key={pro}>{pro}</li>
            ))}
          </ul>
        </div>
        <div className="flex flex-col gap-2 rounded-2xl border border-border-button-default bg-background-secondary-default p-4">
          <h4 className="text-body-medium text-text-primary">Cons</h4>
          <ul className="flex list-disc flex-col gap-1.5 ps-5 text-body-2-regular text-text-secondary">
            {system.cons.map((con) => (
              <li key={con}>{con}</li>
            ))}
          </ul>
        </div>
      </div>
      <P>
        <strong className="text-text-primary">What we noticed:</strong> {system.noticed}
      </P>
      <P>
        <strong className="text-text-primary">Best for:</strong> {system.bestFor}
      </P>
    </section>
  );
}

function Faq({ q, children }: { q: string; children: React.ReactNode }) {
  return (
    <section className="flex flex-col gap-2">
      <h3 className="text-title-3-semibold text-text-primary">{q}</h3>
      <P>{children}</P>
    </section>
  );
}

/**
 * "The 10 best React design systems and component libraries in 2026" — full text
 * from boardui.com/blog/best-react-design-systems.
 * Links to boardui.com pages point at this site's own routes; links to outside
 * sites are shown as plain text, not links.
 */
export default function BestReactDesignSystemsPostPage() {
  return (
    <DocsLayout variant="marketing" footer={false} title="Blog" heading="Blog" hideHeading>
      <article className="flex flex-col gap-8 pb-8">
        <header className="flex flex-col gap-3">
          <div className="flex flex-wrap items-center gap-2">
            <span className="rounded-full border border-border-button-default bg-background-secondary-default px-2.5 py-0.5 text-caption-1-semibold text-text-secondary">
              Comparisons
            </span>
            <span className="text-caption-1-regular text-text-tertiary">Nov 1, 2026 · 19 min read</span>
          </div>
          <h1 className="text-title-1-medium text-text-primary">
            The 10 best React design systems and component libraries in 2026
          </h1>
          <span className="block overflow-hidden rounded-3xl border border-border-button-default bg-background-secondary-default">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="https://www.boardui.com/blog/best-react-design-systems/cover-components.png"
              alt="React design system components"
              className="aspect-[16/9] w-full object-cover"
            />
          </span>
          <P>
            Compare the 10 best React design systems in 2026: what each one is best for, key features, pros and
            cons, and pricing. BoardUI is our product and our pick.
          </P>
          <P>
            We built the same settings dialog with 10 React design systems, our own BoardUI among them. axe, an
            automated accessibility checker, flagged at least one issue in eight of the ten builds, ours included,
            and most of those issues were text contrast.
          </P>
          <P>
            Six of the ten get over 400k npm downloads a week: shadcn/ui, HeroUI, Mantine, Chakra UI, Ant Design
            and PrimeReact. BoardUI, Untitled UI React, affectUI and beUI are newer, and all four copy their source
            into your repo. BoardUI sits first as our pick, and each library gets a short note on what we noticed
            when we built its dialog.
          </P>
        </header>

        <Section title="What is a React design system?">
          <P>
            A React design system is a set of ready-made components, such as buttons, inputs, dialogs and tables,
            plus the decisions that tie them together: tokens, the named values for color, type, spacing and
            motion, and the rules for using them. A component library leaves those decisions to you, and most
            libraries on this list sit somewhere between the two.
          </P>
          <P>
            A good one lets you assemble screens from finished parts and spend your time on features. Every screen
            draws on the same tokens, so colors and spacing match across your product.
          </P>
        </Section>

        <Section title="What to look for in a React design system">
          <Bullets
            items={[
              <>
                <strong className="text-text-primary">An accessible foundation:</strong> a headless library, one
                that ships behavior with no styling, such as React Aria Components, Base UI or Radix. It handles
                focus, keyboard use and ARIA, the labels and roles a screen reader reads. When the library gets
                those right, you don&apos;t have to build them.
              </>,
              <>
                <strong className="text-text-primary">A modern stack:</strong> React 19, TypeScript and Next.js
                support, with styling that fits your team, from Tailwind CSS v4 to CSS-in-JS.
              </>,
              <>
                <strong className="text-text-primary">Theming and dark mode:</strong> one set of tokens you can
                edit for both themes and your brand color, with light or dark mode following the user&apos;s system
                setting.
              </>,
              <>
                <strong className="text-text-primary">Copy-in or npm:</strong> copying the source into your repo
                lets you edit every line, though you merge upstream fixes yourself. Choose an npm package if you
                want fixes to arrive as updates and can live with changing only what its props and styles expose.
              </>,
              <>
                <strong className="text-text-primary">AI and agent support:</strong> an official MCP server, which
                lets an AI tool look up a library&apos;s components and docs, and an llms.txt file, a plain-text
                guide to the docs written for AI tools. Through the server, coding agents such as Claude Code and
                Cursor can find and install the components.
              </>,
              <>
                <strong className="text-text-primary">Design files:</strong> a Figma kit that matches the code, if
                your designers work in Figma.
              </>,
            ]}
          />
        </Section>

        <Section title="How we chose the best React design systems">
          <P>
            To make this list, a library needed active maintainers, support for React 19 and Next.js, and an
            official MCP server. BoardUI comes first because it&apos;s ours and our pick. We put the other nine in
            order ourselves, judging how finished the components look by default, how accessible they are, how easy
            they are to theme and edit, and what they offer for AI and agent screens.
          </P>
          <P>
            For a hands-on check, we built the settings dialog on 30 and 31 October 2026: a form with a text
            field, a select, a switch and a toast, in one violet accent (#7C3AED) with dark mode that follows the
            system. Each build followed that library&apos;s own docs. We checked every dialog with axe and with
            twelve scripted keyboard and ARIA checks, such as whether Escape closes the dialog and focus returns
            to the button that opened it. Both ran in Chromium; we didn&apos;t run a screen reader. Only affectUI
            and beUI came back clean from axe, though most of affectUI&apos;s dialog was shadcn/ui&apos;s and axe
            couldn&apos;t read its button labels. We also weighed the compressed HTML, JavaScript and CSS that each
            build&apos;s page downloads on load. The &ldquo;What we noticed&rdquo; note under each library comes
            from that build. We checked stars, downloads and prices on the day of each build.
          </P>
          <P>
            Our test also found setup problems in BoardUI: the CLI reported success after writing nothing when no
            terminal was attached, the docs&apos; color tool missed the exact brand color, and the setup guide
            never loaded the Inter font. We fixed those, released CLI 0.5.9, and built BoardUI&apos;s dialog again
            on 31 October. Before that second build we also gave BoardUI&apos;s Select a <Code>label</Code> prop
            and its Input an <Code>errorMessage</Code> prop, two gaps the first build had worked around. Both builds
            passed all twelve checks, axe flagged the same error text in each, and both pages weighed 273 KB. The
            second build differed in two places. The corrected violet raised the hovered Save button&apos;s lowest
            contrast from 3.2:1 to 4.1:1, and after a failed save, focus moved to the Name field, where the first
            build had left it on Save. BoardUI&apos;s notes come from that second build. The other nine libraries
            stayed on the versions we first installed, so none of them got fixes from their makers after we found
            their problems.
          </P>
        </Section>

        <Section title="Comparison table: the 10 best React design systems at a glance">
          <div className="overflow-x-auto rounded-3xl border border-border-table bg-background-primary-default">
            <table className="w-full min-w-[720px] border-collapse text-left">
              <thead>
                <tr className="border-b border-border-table">
                  <th className="px-4 py-3 text-caption-1-semibold text-text-tertiary">#</th>
                  <th className="px-4 py-3 text-caption-1-semibold text-text-tertiary">Library</th>
                  <th className="px-4 py-3 text-caption-1-semibold text-text-tertiary">Best for</th>
                  <th className="px-4 py-3 text-caption-1-semibold text-text-tertiary">Built on</th>
                  <th className="px-4 py-3 text-caption-1-semibold text-text-tertiary">Free version</th>
                  <th className="px-4 py-3 text-caption-1-semibold text-text-tertiary">Price</th>
                </tr>
              </thead>
              <tbody>
                {COMPARISON.map(([n, lib, best, built, free, price]) => (
                  <tr key={n} className="border-b border-separator-border last:border-b-0">
                    <td className="px-4 py-3 text-body-2-regular text-text-secondary">{n}</td>
                    <td className="px-4 py-3 text-body-2-medium text-text-primary">{lib}</td>
                    <td className="px-4 py-3 text-body-2-regular text-text-secondary">{best}</td>
                    <td className="px-4 py-3 text-body-2-regular text-text-secondary">{built}</td>
                    <td className="px-4 py-3 text-body-2-regular text-text-secondary">{free}</td>
                    <td className="px-4 py-3 text-body-2-regular text-text-secondary">{price}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <P>
            In the &ldquo;Built on&rdquo; column, the first name is the layer that handles keyboard and screen
            reader behavior, and the second is how styles reach the page. Tailwind CSS and CSS modules ship plain
            CSS files, while Emotion and other CSS-in-JS libraries write styles from JavaScript as the page loads.
          </P>
        </Section>

        {ALL_SYSTEMS.map((system) => (
          <SystemSection key={system.n} system={system} />
        ))}

        <Section title="Which React design system should you choose?">
          <Bullets
            items={[
              <>
                <strong className="text-text-primary">An AI or agent product:</strong> BoardUI, our own, though
                most of its agent components need Pro. If you&apos;re already on shadcn/ui, add its free AI
                Elements, or agent components from affectUI or beUI.
              </>,
              <>
                <strong className="text-text-primary">Starting a design system of your own:</strong> shadcn/ui.
              </>,
              <>
                <strong className="text-text-primary">Your designers work in Figma:</strong> Untitled UI React.
              </>,
              <>
                <strong className="text-text-primary">React Aria as an npm dependency:</strong> HeroUI.
              </>,
              <>
                <strong className="text-text-primary">Free components with hooks and a form library:</strong>{" "}
                Mantine.
              </>,
              <>
                <strong className="text-text-primary">Admin panels full of tables and filters:</strong> Ant
                Design.
              </>,
            ]}
          />
          <P>
            If accessibility comes first, start from a library on React Aria, such as HeroUI, Untitled UI React or
            BoardUI, and check text contrast against your own colors whichever you pick.
          </P>
        </Section>

        <Section title="Frequently asked questions">
          <Faq q="What is the best React design system in 2026?">
            We pick BoardUI, our own, for AI and agent products. If you want to design your own system and own
            every line, start with shadcn/ui. Ant Design suits data-dense admin screens. For one free kit with
            hooks and forms, pick Mantine.
          </Faq>
          <Faq q="What's the difference between a design system and a component library?">
            A design system is a component library plus the decisions about how it looks, such as tokens, type and
            spacing. React Aria Components, Base UI and Radix are unstyled component libraries, and BoardUI,
            Untitled UI React and Ant Design are design systems.
          </Faq>
          <Faq q="What are the best shadcn/ui alternatives?">
            BoardUI, which is ours, and Untitled UI React copy source into your repo the way shadcn/ui does, and
            both build on React Aria and Tailwind CSS v4. HeroUI has the same React Aria base and a finished look,
            and you update it from npm. affectUI and beUI work more as add-ons to shadcn/ui: both install through
            its CLI, and affectUI recommends shadcn/ui for forms and dialogs.
          </Faq>
          <Faq q="What are the best MUI alternatives?">
            Try Mantine for a free kit of 121 core components, Chakra UI if you like styling with props, or Ant
            Design if your app is built around tables and forms. If you want Tailwind CSS v4, BoardUI, shadcn/ui,
            HeroUI, Untitled UI React and beUI all use it.
          </Faq>
          <Faq q="Which React design system works best with Claude Code or Cursor?">
            BoardUI, shadcn/ui, Untitled UI React, affectUI and beUI put the component source in your repo, where
            your coding agent can edit it. All ten publish an official MCP server, so the agent can look up
            components and examples in any of them. Several ship instructions for agents too: BoardUI&apos;s{" "}
            <Code>init</Code> writes design rules for Cursor and your AGENTS.md, HeroUI&apos;s{" "}
            <Code>heroui agents-md</Code> downloads its docs and adds an index of them to AGENTS.md, and Untitled
            UI React publishes an AGENT.md. BoardUI&apos;s CLI asks before it writes files, so an agent running it
            in a shell passes <Code>--yes</Code>.
          </Faq>
        </Section>

        <ArticleCta />

        <Link
          href="/blog"
          className="inline-flex items-center gap-1.5 text-body-medium text-text-secondary transition-colors hover:text-text-primary"
        >
          <RiArrowLeftLine className="size-4" aria-hidden />
          Back to all articles
        </Link>
      </article>
      <MoreFromBlog currentSlug="best-react-design-systems" />
      <SiteFooter />
    </DocsLayout>
  );
}
