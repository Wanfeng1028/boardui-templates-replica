/**
 * Home landing data — copy captured from boardui.com/ (SSR HTML,
 * 2026-11-08, saved in verify/orig-home.html) unless noted.
 *
 * Showcase blurbs, chart blurbs and pricing tiers match the copy already
 * verified on this repo's /pricing page (same sections, same words).
 * FAQ answers are NOT in the SSR HTML (accordion panels render empty
 * until opened); the answers below were captured from the live site
 * (verify/faq-answers.json, 2026-11-08).
 */

export const TECH_BADGES = [
  "React v19.2",
  "Tailwind CSS v4",
  "React Aria v1.17",
  "TanStack Table v8.21",
] as const;

export type HeroPreviewTab = {
  label: string;
  href: string;
  /** iframe src for the live preview. */
  src: string;
};

/**
 * Hero preview rail — the original hero embeds the dashboard template with
 * this sidebar rail (aria-labels in the SSR HTML): Home, Project board,
 * Marketing, Calendar, Finance, Medical Report, AI Chat, AI Image
 * Generation, Profile. The rail rows are links to the template routes;
 * switching a tab swaps the live preview.
 */
export const HERO_PREVIEW_TABS: HeroPreviewTab[] = [
  { label: "Home", href: "/templates/dashboard", src: "/templates/dashboard" },
  { label: "Project board", href: "/templates/project-board", src: "/templates/project-board" },
  { label: "Marketing", href: "/templates/marketing", src: "/templates/marketing" },
  { label: "Calendar", href: "/templates/calendar", src: "/templates/calendar" },
  { label: "Finance", href: "/templates/finance", src: "/templates/finance" },
  { label: "Medical Report", href: "/templates/medical-profile", src: "/templates/medical-profile" },
  { label: "AI Chat", href: "/templates/ai-chat", src: "/templates/ai-chat" },
  { label: "AI Image Generation", href: "/templates/ai-image-generation", src: "/templates/ai-image-generation" },
  { label: "Profile", href: "/templates/ai-profile", src: "/templates/ai-profile" },
];

export type ShowcaseItem = { name: string; blurb: string; href: string };

export const SHOWCASE: ShowcaseItem[] = [
  { name: "Composer attachments", blurb: "File tiles landing one by one above the prompt, each with its upload ring.", href: "/components/composer-attachments" },
  { name: "Web search", blurb: "The searches an agent ran and the sources it opened, streaming in.", href: "/components/web-search" },
  { name: "Agent limits", blurb: "Context window usage with a token breakdown and plan limits.", href: "/components/agent-limits-card" },
  { name: "Data table", blurb: "Filter, sort and paginate complex data in a responsive table.", href: "/components/data-table" },
  { name: "Playful widgets", blurb: "Health widgets with live charts, activity rings and alerts.", href: "/components/activity-rings-card" },
  { name: "Sidebar", blurb: "Navigation with search, badges and account controls.", href: "/components/sidebar" },
  { name: "Contributor profile", blurb: "Contributor activity, token stats and streak insights at a glance.", href: "/components/ai-profile" },
  { name: "Agent progress", blurb: "Live multi-step progress and completion states.", href: "/components/agent-progress" },
  { name: "Composer loader", blurb: "An iridescent light orbiting the composer while the agent works.", href: "/components/composer-loader" },
  { name: "Agent thinking", blurb: "Thinking, searching and writing indicators for a working agent.", href: "/components/agent-thinking" },
  { name: "Image generation loader", blurb: "Image generation with an animated countdown and reveal.", href: "/components/ai-image-generation" },
  { name: "Calendar", blurb: "Month calendar with events and scheduling controls.", href: "/components/calendar" },
  { name: "Auth card", blurb: "Sign in, sign up and verification with provider buttons.", href: "/components/auth-card" },
  { name: "Meeting schedule", blurb: "Booking flow for dates, times, language and meeting details.", href: "/components/date-picker#meeting-scheduler" },
  { name: "Charts", blurb: "Bar, line and stacked charts with live data.", href: "/components/earnings-chart-card" },
  { name: "File upload", blurb: "Drag-and-drop uploads with validation and progress states.", href: "/components/file-upload" },
];

export type TemplateCard = { name: string; href: string; src: string };

/** Templates section list, as on the original ("Agentic chat", "Image generation", …). */
export const TEMPLATE_CARDS: TemplateCard[] = [
  { name: "Agentic chat", href: "/templates/ai-chat", src: "/templates/ai-chat" },
  { name: "Image generation", href: "/templates/ai-image-generation", src: "/templates/ai-image-generation" },
  { name: "Project board", href: "/templates/project-board", src: "/templates/project-board" },
  { name: "Marketing", href: "/templates/marketing", src: "/templates/marketing" },
  { name: "Contributor profile", href: "/templates/ai-profile", src: "/templates/ai-profile" },
  { name: "Healthcare", href: "/templates/medical-profile", src: "/templates/medical-profile" },
  { name: "Analytics dashboard", href: "/templates/dashboard", src: "/templates/dashboard" },
  { name: "Calendar", href: "/templates/calendar", src: "/templates/calendar" },
];

export type ChartItem = { name: string; blurb: string; href: string };

export const CHARTS: ChartItem[] = [
  { name: "Funnel chart", blurb: "Tapered stages with conversion pills, curved or sharp, and stat tiles under every column.", href: "/components/funnel-chart-card" },
  { name: "Earnings chart", blurb: "Rounded bars over a track with a period switcher, count-up headline and hover outline.", href: "/components/earnings-chart-card" },
  { name: "Radar chart", blurb: "Filled polygon on the chart tokens - the count-up headline follows the axis you hover, and a stat tile per axis sits below.", href: "/components/radar-chart-card" },
  { name: "Radar comparison", blurb: "Outline-only series over the same grid with a live legend for side-by-side reads.", href: "/components/radar-chart-card#variants" },
  { name: "Sankey chart", blurb: "Flows tinted by their source with share labels on the sinks and hover isolation.", href: "/components/sankey-chart-card" },
  { name: "Stage bars", blurb: "The funnel as pill rows with name, value and share, plus a grid of stat tiles.", href: "/components/stage-bars-card" },
  { name: "Radial chart", blurb: "Concentric rings over the chart track with each name set along its own arc - hover a ring and the rest fall back while the headline and its tile follow.", href: "/components/radial-chart-card" },
  { name: "Speedometer", blurb: "Half gauge of stacked segments with the primary share in the centre and tiles below.", href: "/components/radial-chart-card#variants" },
  { name: "Area chart", blurb: "Stacked series with gradient fills - hover a month and the headline, legend and tiles follow.", href: "/components/area-chart-card" },
  { name: "Combo chart", blurb: "Bars on one axis, a cased line on the other - volume and rate read together on one canvas.", href: "/components/combo-chart-card" },
];

export type Tier = {
  name: string;
  badge?: string;
  blurb: string;
  cta: string;
  href: string;
  featured?: boolean;
  features: string[];
};

const SHARED_FEATURES = [
  "Use it in unlimited projects",
  "Keep the code forever",
  "Installation via CLI",
  "MCP support for AI agents",
  "Design tokens based on Tailwind CSS",
  "Dark mode variables",
  "Discord access",
  "3,000+ icon library",
];

/**
 * Pricing tiers, same copy as /pricing. Two in-site adaptations, both
 * reported: the original's Pro CTAs go to /api/checkout/* (no checkout
 * exists in this replica), so they point at /pro-components like the
 * /pricing page does; Starter's "Install now" keeps the original's
 * /installation target. No prices are shown — the original shows no
 * prices next to the tiers either, only the "€49 launch discount" badge.
 */
export const TIERS: Tier[] = [
  {
    name: "Starter",
    blurb: "The fundamentals of BoardUI, free. Perfect for indie developers.",
    cta: "Install now",
    href: "/installation",
    features: [
      "Free user license",
      ...SHARED_FEATURES.slice(0, 3),
      "Free component updates",
      ...SHARED_FEATURES.slice(3, 6),
      "Fundamental components",
      "Basic blocks and templates",
      ...SHARED_FEATURES.slice(6),
    ],
  },
  {
    name: "1 Year of Updates",
    blurb: "Every BoardUI Pro component, block, token and template.",
    cta: "Get Pro",
    href: "/pro-components",
    features: [
      "Single-user license",
      ...SHARED_FEATURES.slice(0, 3),
      "Pro updates for 1 year",
      ...SHARED_FEATURES.slice(3, 6),
      "Every Pro component",
      "Every Pro block & template",
      ...SHARED_FEATURES.slice(6),
    ],
  },
  {
    name: "Lifetime Access",
    badge: "€49 launch discount",
    blurb: "Every BoardUI Pro component, block, token and template.",
    cta: "Get Pro",
    href: "/pro-components",
    featured: true,
    features: [
      "Single-user license",
      ...SHARED_FEATURES.slice(0, 3),
      "Pro updates forever",
      ...SHARED_FEATURES.slice(3, 6),
      "Every Pro component",
      "Every Pro block & template",
      ...SHARED_FEATURES.slice(6),
    ],
  },
  {
    name: "Unlimited for Startups",
    blurb: "Everything in Pro, licensed for up to 5 developers.",
    cta: "Get Pro",
    href: "/pro-components",
    features: [
      "5-user license",
      ...SHARED_FEATURES.slice(0, 3),
      "Pro updates forever",
      ...SHARED_FEATURES.slice(3, 6),
      "Every Pro component",
      "Every Pro block & template",
      ...SHARED_FEATURES.slice(6),
    ],
  },
];

export type FaqItem = { question: string; answer: string };

/**
 * FAQ questions + answers, verbatim from the original homepage (live
 * probe 2026-11-08, verify/faq-answers.json — the answers only render
 * once an accordion item is opened, so SSR HTML alone does not carry
 * them). "How do I install a component?" says `npx boardui add button`
 * — quoted as the original says it, even though the install chip on the
 * page reads `npm boardui@latest add button-group`.
 */
export const FAQ_ITEMS: FaqItem[] = [
  { question: "Is BoardUI Pro a one-time payment?", answer: "Yes. Every plan is bought once and yours forever, with no subscription and no auto-renewal. Lifetime Access and Unlimited for Startups include every future update to the components, blocks and templates you have access to; 1 Year of Updates includes them for one year from purchase." },
  { question: "What is the difference between Starter and Pro?", answer: "Starter is free and covers the fundamentals: the base components, basic blocks and templates, design tokens and dark mode variables. Pro adds the full component set, every Pro block and template, and the complete icon library." },
  { question: "How do I install a component?", answer: "Through the CLI. Running npx boardui add button copies that component's source straight into your project, along with anything it depends on. There is no runtime package to install and nothing to keep in sync." },
  { question: "Do I own the code?", answer: "Yes. Because the CLI copies real source files into your repository rather than linking a dependency, the components are yours to read, edit and refactor. You are never blocked waiting on us to expose a prop." },
  { question: "Can I use it in client and commercial projects?", answer: "Yes, in unlimited projects. 1 Year of Updates and Lifetime Access cover a single developer; Unlimited for Startups covers five. What you build with it is yours, including the work you ship for clients." },
  { question: "What is the difference between 1 Year of Updates and Lifetime Access?", answer: "Both unlock every Pro component, block, token and template, and whatever you install is yours to keep forever. 1 Year of Updates includes new Pro components and updates for one year from purchase; Lifetime Access includes them for life. With the one-year plan, you can keep using and editing the code you installed in existing and new projects after that year ends. Only access to new Pro components and updates ends." },
  { question: "Do you offer refunds?", answer: "No. Buying Pro hands you the full source immediately, so there is nothing to return once it is on your machine, which is why source is normally sold final. Everything the paid tiers build on is free to try first, so you can see the code and the conventions before you pay. If something is broken or not as described, tell us on Discord and we will put it right." },
  { question: "What is BoardUI built on?", answer: "React and Tailwind CSS, with interactive components built on React Aria for keyboard and screen-reader behaviour. Everything is typed, and the design tokens are plain CSS variables you can retheme." },
  { question: "Does it support dark mode?", answer: "Out of the box. Components reference semantic tokens rather than fixed colours, so a single theme class flips the whole system, including anything you build on top of it with the same tokens." },
];

export const DISCORD_URL = "https://discord.gg/azcHkw8T6F";

/** MCP deeplinks, verbatim from the original homepage. */
export const MCP_CURSOR_LINK =
  "cursor://anysphere.cursor-deeplink/mcp/install?name=boardui&config=eyJjb21tYW5kIjoibnB4IiwiYXJncyI6WyIteSIsImJvYXJkdWlAbGF0ZXN0IiwibWNwIl19";
export const MCP_VSCODE_LINK =
  "vscode:mcp/install?%7B%22name%22%3A%22boardui%22%2C%22command%22%3A%22npx%22%2C%22args%22%3A%5B%22-y%22%2C%22boardui%40latest%22%2C%22mcp%22%5D%7D";
