/**
 * Library + docs navigation, copied verbatim from boardui.com
 * (curl of /components/date-picker + /docs/introduction, 2026-11-08,
 * saved in ~/workspace/boardui-verify/orig4/). Labels, hrefs, section
 * order and New/Pro badges are the original's; nothing is invented.
 * Section sizes verified against the original's own grouping:
 * Getting started 5, Foundations 4, Base 49, Blocks 19, Charts 19,
 * Templates 10 — 106 links in all. The replica adds Cascader, Rate and
 * Tree Select to Base (VibeHub terms, 2026-11-09): Base 52, 109 links.
 *
 * Two routes the original links to do not exist on this replica yet:
 * /privacy, /terms, /license (footer) — the hrefs are kept verbatim and
 * the gap is reported, not papered over with a different target.
 */

export type LibraryNavItem = { href: string; label: string; isNew?: boolean; isPro?: boolean; sub?: string };
export type LibraryNavSection = { title: string; items: LibraryNavItem[] };

export const LIBRARY_NAV: LibraryNavSection[] = [
  { title: "Getting started", items: [
    { href: "/getting-started", label: "Let's begin" },
    { href: "/installation", label: "Installation" },
    { href: "/mcp", label: "MCP Server" },
    { href: "/skill", label: "Agent Skills", isNew: true },
    { href: "/rtl", label: "RTL Support", isNew: true },
  ] },
  { title: "Foundations", items: [
    { href: "/components/color", label: "Color" },
    { href: "/components/typography", label: "Typography" },
    { href: "/components", label: "Components" },
    { href: "/components#templates", label: "Templates" },
  ] },
  { title: "Base", items: [
    { href: "/components/accordion", label: "Accordion", isNew: true },
    { href: "/components/announcement", label: "Announcement" },
    { href: "/components/avatar", label: "Avatar" },
    { href: "/components/badge", label: "Badge" },
    { href: "/components/breadcrumb", label: "Breadcrumb" },
    { href: "/components/button", label: "Button" },
    { href: "/components/button-group", label: "Button Group" },
    { href: "/components/cascader", label: "Cascader", isNew: true },
    { href: "/components/carousel", label: "Carousel", isNew: true },
    { href: "/components/checkbox", label: "Checkbox" },
    { href: "/components/chip", label: "Chip" },
    { href: "/components/close-button", label: "Close Button" },
    { href: "/components/color-picker", label: "Color Picker", isNew: true },
    { href: "/components/combobox", label: "Combobox", isNew: true },
    { href: "/components/command-palette", label: "Command Palette", isNew: true },
    { href: "/components/context-menu", label: "Context Menu", isNew: true },
    { href: "/components/date-calendar", label: "Date Calendar", isNew: true },
    { href: "/components/date-picker", label: "Date Picker" },
    { href: "/components/divider", label: "Divider" },
    { href: "/components/drawer", label: "Drawer", isNew: true },
    { href: "/components/dropdown", label: "Dropdown" },
    { href: "/components/file-upload", label: "File Upload" },
    { href: "/components/icon-button", label: "Icon Button" },
    { href: "/components/input", label: "Input" },
    { href: "/components/input-otp", label: "Input OTP" },
    { href: "/components/link-button", label: "Link Button" },
    { href: "/components/meter", label: "Meter", isNew: true },
    { href: "/components/modal", label: "Modal", isNew: true },
    { href: "/components/notification", label: "Notification" },
    { href: "/components/number-field", label: "Number Field", isNew: true },
    { href: "/components/pagination", label: "Pagination" },
    { href: "/components/popover", label: "Popover", isNew: true },
    { href: "/components/progress", label: "Progress", isNew: true },
    { href: "/components/radio", label: "Radio" },
    { href: "/components/rate", label: "Rate", isNew: true },
    { href: "/components/search-field", label: "Search Field", isNew: true },
    { href: "/components/segmented-control", label: "Segmented Control" },
    { href: "/components/select", label: "Select" },
    { href: "/components/skeleton", label: "Skeleton", isNew: true },
    { href: "/components/slider", label: "Slider" },
    { href: "/components/social-button", label: "Social Button" },
    { href: "/components/spinner", label: "Spinner", isNew: true },
    { href: "/components/switch", label: "Switch" },
    { href: "/components/table", label: "Table" },
    { href: "/components/tabs", label: "Tabs" },
    { href: "/components/tag-group", label: "Tag Group", isNew: true },
    { href: "/components/textarea", label: "Textarea", isNew: true },
    { href: "/components/time-field", label: "Time Field", isNew: true },
    { href: "/components/toast", label: "Toast", isNew: true },
    { href: "/components/tooltip", label: "Tooltip" },
    { href: "/components/tree-select", label: "Tree Select", isNew: true },
    { href: "/components/tree-view", label: "Tree View", isNew: true },
  ] },
  { title: "Blocks", items: [
    { href: "/components/agent-creator", label: "Agent Creator", isNew: true, isPro: true },
    { href: "/components/agent-limits-card", label: "Agent Limits", isNew: true, isPro: true },
    { href: "/components/agent-progress", label: "Agent Progress", isPro: true },
    { href: "/components/agent-thinking", label: "Agent Thinking", isNew: true },
    { href: "/components/auth-card", label: "Auth Card", isNew: true },
    { href: "/components/calendar", label: "Calendar", isPro: true },
    { href: "/components/composer", label: "Composer", isNew: true, isPro: true },
    { href: "/components/composer-attachments", label: "Composer Attachments", isNew: true, isPro: true },
    { href: "/components/composer-loader", label: "Composer Loader", isNew: true },
    { href: "/components/composer-panel", label: "Composer Panel", isNew: true, isPro: true },
    { href: "/components/data-grid", label: "Data Grid", isNew: true },
    { href: "/components/data-table", label: "Data Table" },
    { href: "/components/notification-center", label: "Notification Center" },
    { href: "/components/questionnaire", label: "Questionnaire", isNew: true, isPro: true },
    { href: "/components/settings-modal", label: "Settings Modal" },
    { href: "/components/sidebar", label: "Sidebar" },
    { href: "/components/stat-cards", label: "Stat Cards", isNew: true },
    { href: "/components/task-list", label: "Task List", isNew: true, isPro: true },
    { href: "/components/web-search", label: "Web Search", isNew: true, isPro: true },
  ] },
  { title: "Charts", items: [
    { href: "/components/activity-rings-card", label: "Activity Rings", isPro: true },
    { href: "/components/area-chart-card", label: "Area Chart", isNew: true, isPro: true },
    { href: "/components/bar-list-card", label: "Bar List", isNew: true, isPro: true },
    { href: "/components/combo-chart-card", label: "Combo Chart", isNew: true, isPro: true },
    { href: "/components/contributions-card", label: "Contributions", isPro: true },
    { href: "/components/earnings-chart-card", label: "Earnings Chart", isPro: true },
    { href: "/components/funnel-chart-card", label: "Funnel Chart", isNew: true, isPro: true },
    { href: "/components/heatmap-chart-card", label: "Heatmap Chart", isNew: true, isPro: true },
    { href: "/components/line-chart-card", label: "Line Chart", isPro: true },
    { href: "/components/most-active-days-card", label: "Most Active Days", isPro: true },
    { href: "/components/orders-chart-card", label: "Orders Chart", isNew: true },
    { href: "/components/radar-chart-card", label: "Radar Chart", isNew: true, isPro: true },
    { href: "/components/radial-chart-card", label: "Radial Chart", isNew: true, isPro: true },
    { href: "/components/revenue-chart-card", label: "Revenue Chart", isNew: true },
    { href: "/components/sankey-chart-card", label: "Sankey Chart", isNew: true, isPro: true },
    { href: "/components/scatter-chart-card", label: "Scatter Chart", isNew: true, isPro: true },
    { href: "/components/sleep-score-card", label: "Sleep Score", isPro: true },
    { href: "/components/stage-bars-card", label: "Stage Bars", isNew: true, isPro: true },
    { href: "/components/steps-card", label: "Steps Chart", isPro: true },
  ] },
  { title: "Templates", items: [
    { href: "/components/ai-chat", label: "AI Chat", isPro: true },
    { href: "/components/ai-image-generation", label: "AI Image Generation", isPro: true },
    { href: "/components/ai-profile", label: "AI Profile", isPro: true },
    { href: "/components/chat-starter", label: "Chat Starter", isNew: true },
    { href: "/components/finance-dashboard", label: "Finance Dashboard", isNew: true, isPro: true },
    { href: "/components/home-dashboard", label: "Home Dashboard", isPro: true },
    { href: "/components/marketing-dashboard", label: "Marketing Dashboard", isNew: true, isPro: true },
    { href: "/components/medical-profile", label: "Medical Profile", isPro: true },
    { href: "/components/multi-agent-chat", label: "Multi-agent Chat", isNew: true, isPro: true },
    { href: "/components/project-board", label: "Project Board", isNew: true, isPro: true },
  ] },
];

export const LIBRARY_NAV_FLAT: LibraryNavItem[] = LIBRARY_NAV.flatMap((s) => s.items);

/**
 * Previous / next table, measured page by page from boardui.com
 * (curl of every library page, 2026-11-08; raw scrape in
 * verify/prev-next-scraped.json, generator verify/gen-prev-next-table.py).
 * Each entry is exactly what the original renders in its "Docs pages" nav
 * for that page: prev/next target + the target's tagline (`sub`). It is
 * deliberately NOT a linear walk of the sidebar: /rtl's Next is Color
 * (/components/color, "Semantic color tokens") even though Color renders
 * no prev/next itself, and 45 of the 202 links carry no tagline on the
 * original, so those entries have no `sub`. Pages the original shows no
 * prev/next on (/components, /components/color, /components/typography,
 * /components/hr-management, /components/theme-toggle,
 * /components/pro-installation) have no entry and render none.
 * Verified samples: installation prev "Tour the system" / next "Agents
 * install for you"; mcp next "Knowledge for your agent"; rtl next
 * "Semantic color tokens"; accordion next "Dismissible banner messages";
 * date-picker next "Section separators".
 */
export const PREV_NEXT: Record<string, { prev?: LibraryNavItem; next?: LibraryNavItem }> = {
  "/getting-started": { next: { href: "/installation", label: "Installation", sub: "Framework setup guides" } },
  "/installation": { prev: { href: "/getting-started", label: "Let's begin", sub: "Tour the system" }, next: { href: "/mcp", label: "MCP Server", sub: "Agents install for you" } },
  "/mcp": { prev: { href: "/installation", label: "Installation", sub: "Framework setup guides" }, next: { href: "/skill", label: "Agent Skills", sub: "Knowledge for your agent" } },
  "/skill": { prev: { href: "/mcp", label: "MCP Server", sub: "Agents install for you" }, next: { href: "/rtl", label: "RTL Support" } },
  "/rtl": { prev: { href: "/skill", label: "Agent Skills", sub: "Knowledge for your agent" }, next: { href: "/components/color", label: "Color", sub: "Semantic color tokens" } },
  "/components/accordion": { prev: { href: "/components#templates", label: "Templates" }, next: { href: "/components/announcement", label: "Announcement", sub: "Dismissible banner messages" } },
  "/components/announcement": { prev: { href: "/components/accordion", label: "Accordion" }, next: { href: "/components/avatar", label: "Avatar", sub: "User images and initials" } },
  "/components/avatar": { prev: { href: "/components/announcement", label: "Announcement", sub: "Dismissible banner messages" }, next: { href: "/components/badge", label: "Badge", sub: "Small status labels" } },
  "/components/badge": { prev: { href: "/components/avatar", label: "Avatar", sub: "User images and initials" }, next: { href: "/components/breadcrumb", label: "Breadcrumb", sub: "Hierarchical path trail" } },
  "/components/breadcrumb": { prev: { href: "/components/badge", label: "Badge", sub: "Small status labels" }, next: { href: "/components/button", label: "Button", sub: "The core action" } },
  "/components/button": { prev: { href: "/components/breadcrumb", label: "Breadcrumb", sub: "Hierarchical path trail" }, next: { href: "/components/button-group", label: "Button Group", sub: "Segmented action row" } },
  "/components/button-group": { prev: { href: "/components/button", label: "Button", sub: "The core action" }, next: { href: "/components/cascader", label: "Cascader" } },
  "/components/cascader": { prev: { href: "/components/button-group", label: "Button Group", sub: "Segmented action row" }, next: { href: "/components/carousel", label: "Carousel", sub: "Swipeable slide deck" } },
  "/components/carousel": { prev: { href: "/components/cascader", label: "Cascader" }, next: { href: "/components/checkbox", label: "Checkbox", sub: "Animated tick control" } },
  "/components/checkbox": { prev: { href: "/components/carousel", label: "Carousel", sub: "Swipeable slide deck" }, next: { href: "/components/chip", label: "Chip", sub: "Compact removable tags" } },
  "/components/chip": { prev: { href: "/components/checkbox", label: "Checkbox", sub: "Animated tick control" }, next: { href: "/components/close-button", label: "Close Button", sub: "Dismiss affordance" } },
  "/components/close-button": { prev: { href: "/components/chip", label: "Chip", sub: "Compact removable tags" }, next: { href: "/components/color-picker", label: "Color Picker" } },
  "/components/color-picker": { prev: { href: "/components/close-button", label: "Close Button", sub: "Dismiss affordance" }, next: { href: "/components/combobox", label: "Combobox" } },
  "/components/combobox": { prev: { href: "/components/color-picker", label: "Color Picker" }, next: { href: "/components/command-palette", label: "Command Palette" } },
  "/components/command-palette": { prev: { href: "/components/combobox", label: "Combobox" }, next: { href: "/components/context-menu", label: "Context Menu" } },
  "/components/context-menu": { prev: { href: "/components/command-palette", label: "Command Palette" }, next: { href: "/components/date-calendar", label: "Date Calendar" } },
  "/components/date-calendar": { prev: { href: "/components/context-menu", label: "Context Menu" }, next: { href: "/components/date-picker", label: "Date Picker", sub: "Calendar date selection" } },
  "/components/date-picker": { prev: { href: "/components/date-calendar", label: "Date Calendar" }, next: { href: "/components/divider", label: "Divider", sub: "Section separators" } },
  "/components/divider": { prev: { href: "/components/date-picker", label: "Date Picker", sub: "Calendar date selection" }, next: { href: "/components/drawer", label: "Drawer" } },
  "/components/drawer": { prev: { href: "/components/divider", label: "Divider", sub: "Section separators" }, next: { href: "/components/dropdown", label: "Dropdown", sub: "Free-form action menu" } },
  "/components/dropdown": { prev: { href: "/components/drawer", label: "Drawer" }, next: { href: "/components/file-upload", label: "File Upload", sub: "Drag and drop files" } },
  "/components/file-upload": { prev: { href: "/components/dropdown", label: "Dropdown", sub: "Free-form action menu" }, next: { href: "/components/icon-button", label: "Icon Button", sub: "Square icon actions" } },
  "/components/icon-button": { prev: { href: "/components/file-upload", label: "File Upload", sub: "Drag and drop files" }, next: { href: "/components/input", label: "Input", sub: "Text fields with labels" } },
  "/components/input": { prev: { href: "/components/icon-button", label: "Icon Button", sub: "Square icon actions" }, next: { href: "/components/input-otp", label: "Input OTP", sub: "One-time code entry" } },
  "/components/input-otp": { prev: { href: "/components/input", label: "Input", sub: "Text fields with labels" }, next: { href: "/components/link-button", label: "Link Button", sub: "Inline text actions" } },
  "/components/link-button": { prev: { href: "/components/input-otp", label: "Input OTP", sub: "One-time code entry" }, next: { href: "/components/meter", label: "Meter" } },
  "/components/meter": { prev: { href: "/components/link-button", label: "Link Button", sub: "Inline text actions" }, next: { href: "/components/modal", label: "Modal" } },
  "/components/modal": { prev: { href: "/components/meter", label: "Meter" }, next: { href: "/components/notification", label: "Notification", sub: "Toast messages" } },
  "/components/notification": { prev: { href: "/components/modal", label: "Modal" }, next: { href: "/components/number-field", label: "Number Field" } },
  "/components/number-field": { prev: { href: "/components/notification", label: "Notification", sub: "Toast messages" }, next: { href: "/components/pagination", label: "Pagination", sub: "Page number navigation" } },
  "/components/pagination": { prev: { href: "/components/number-field", label: "Number Field" }, next: { href: "/components/popover", label: "Popover" } },
  "/components/popover": { prev: { href: "/components/pagination", label: "Pagination", sub: "Page number navigation" }, next: { href: "/components/progress", label: "Progress" } },
  "/components/progress": { prev: { href: "/components/popover", label: "Popover" }, next: { href: "/components/radio", label: "Radio", sub: "Single-choice options" } },
  "/components/radio": { prev: { href: "/components/progress", label: "Progress" }, next: { href: "/components/rate", label: "Rate" } },
  "/components/rate": { prev: { href: "/components/radio", label: "Radio", sub: "Single-choice options" }, next: { href: "/components/search-field", label: "Search Field" } },
  "/components/search-field": { prev: { href: "/components/rate", label: "Rate" }, next: { href: "/components/segmented-control", label: "Segmented Control", sub: "Exclusive view switcher" } },
  "/components/segmented-control": { prev: { href: "/components/search-field", label: "Search Field" }, next: { href: "/components/select", label: "Select", sub: "Styled value picker" } },
  "/components/select": { prev: { href: "/components/segmented-control", label: "Segmented Control", sub: "Exclusive view switcher" }, next: { href: "/components/skeleton", label: "Skeleton" } },
  "/components/skeleton": { prev: { href: "/components/select", label: "Select", sub: "Styled value picker" }, next: { href: "/components/slider", label: "Slider", sub: "Range value control" } },
  "/components/slider": { prev: { href: "/components/skeleton", label: "Skeleton" }, next: { href: "/components/social-button", label: "Social Button", sub: "OAuth provider sign-in" } },
  "/components/social-button": { prev: { href: "/components/slider", label: "Slider", sub: "Range value control" }, next: { href: "/components/spinner", label: "Spinner" } },
  "/components/spinner": { prev: { href: "/components/social-button", label: "Social Button", sub: "OAuth provider sign-in" }, next: { href: "/components/switch", label: "Switch", sub: "On/off toggle" } },
  "/components/switch": { prev: { href: "/components/spinner", label: "Spinner" }, next: { href: "/components/table", label: "Table", sub: "Styled data rows" } },
  "/components/table": { prev: { href: "/components/switch", label: "Switch", sub: "On/off toggle" }, next: { href: "/components/tabs", label: "Tabs", sub: "Panel switching" } },
  "/components/tabs": { prev: { href: "/components/table", label: "Table", sub: "Styled data rows" }, next: { href: "/components/tag-group", label: "Tag Group" } },
  "/components/tag-group": { prev: { href: "/components/tabs", label: "Tabs", sub: "Panel switching" }, next: { href: "/components/textarea", label: "Textarea", sub: "Multiline text fields" } },
  "/components/textarea": { prev: { href: "/components/tag-group", label: "Tag Group" }, next: { href: "/components/time-field", label: "Time Field" } },
  "/components/time-field": { prev: { href: "/components/textarea", label: "Textarea", sub: "Multiline text fields" }, next: { href: "/components/toast", label: "Toast" } },
  "/components/toast": { prev: { href: "/components/time-field", label: "Time Field" }, next: { href: "/components/tooltip", label: "Tooltip", sub: "Hover hint bubbles" } },
  "/components/tooltip": { prev: { href: "/components/toast", label: "Toast" }, next: { href: "/components/tree-select", label: "Tree Select" } },
  "/components/tree-select": { prev: { href: "/components/tooltip", label: "Tooltip", sub: "Hover hint bubbles" }, next: { href: "/components/tree-view", label: "Tree View" } },
  "/components/tree-view": { prev: { href: "/components/tree-select", label: "Tree Select" }, next: { href: "/components/agent-creator", label: "Agent Creator" } },
  "/components/agent-creator": { prev: { href: "/components/tree-view", label: "Tree View" }, next: { href: "/components/agent-limits-card", label: "Agent Limits", sub: "Usage meter card" } },
  "/components/agent-limits-card": { prev: { href: "/components/agent-creator", label: "Agent Creator" }, next: { href: "/components/agent-progress", label: "Agent Progress", sub: "Live task status" } },
  "/components/agent-progress": { prev: { href: "/components/agent-limits-card", label: "Agent Limits", sub: "Usage meter card" }, next: { href: "/components/agent-thinking", label: "Agent Thinking", sub: "Reasoning disclosure" } },
  "/components/agent-thinking": { prev: { href: "/components/agent-progress", label: "Agent Progress", sub: "Live task status" }, next: { href: "/components/auth-card", label: "Auth Card", sub: "Complete sign-in card" } },
  "/components/auth-card": { prev: { href: "/components/agent-thinking", label: "Agent Thinking", sub: "Reasoning disclosure" }, next: { href: "/components/calendar", label: "Calendar", sub: "Month view with events" } },
  "/components/calendar": { prev: { href: "/components/auth-card", label: "Auth Card", sub: "Complete sign-in card" }, next: { href: "/components/composer", label: "Composer", sub: "AI chat input" } },
  "/components/composer": { prev: { href: "/components/calendar", label: "Calendar", sub: "Month view with events" }, next: { href: "/components/composer-attachments", label: "Composer Attachments", sub: "Chat input with file tiles" } },
  "/components/composer-attachments": { prev: { href: "/components/composer", label: "Composer", sub: "AI chat input" }, next: { href: "/components/composer-loader", label: "Composer Loader", sub: "Streaming state shimmer" } },
  "/components/composer-loader": { prev: { href: "/components/composer-attachments", label: "Composer Attachments", sub: "Chat input with file tiles" }, next: { href: "/components/composer-panel", label: "Composer Panel", sub: "Two-row chat input" } },
  "/components/composer-panel": { prev: { href: "/components/composer-loader", label: "Composer Loader", sub: "Streaming state shimmer" }, next: { href: "/components/data-grid", label: "Data Grid" } },
  "/components/data-grid": { prev: { href: "/components/composer-panel", label: "Composer Panel", sub: "Two-row chat input" }, next: { href: "/components/data-table", label: "Data Table", sub: "Sorting, selection, paging" } },
  "/components/data-table": { prev: { href: "/components/data-grid", label: "Data Grid" }, next: { href: "/components/notification-center", label: "Notification Center", sub: "Grouped activity inbox" } },
  "/components/notification-center": { prev: { href: "/components/data-table", label: "Data Table", sub: "Sorting, selection, paging" }, next: { href: "/components/questionnaire", label: "Questionnaire", sub: "Plan-mode questions" } },
  "/components/questionnaire": { prev: { href: "/components/notification-center", label: "Notification Center", sub: "Grouped activity inbox" }, next: { href: "/components/settings-modal", label: "Settings Modal", sub: "Sectioned settings panel" } },
  "/components/settings-modal": { prev: { href: "/components/questionnaire", label: "Questionnaire", sub: "Plan-mode questions" }, next: { href: "/components/sidebar", label: "Sidebar", sub: "App navigation shell" } },
  "/components/sidebar": { prev: { href: "/components/settings-modal", label: "Settings Modal", sub: "Sectioned settings panel" }, next: { href: "/components/stat-cards", label: "Stat Cards", sub: "KPI number row" } },
  "/components/stat-cards": { prev: { href: "/components/sidebar", label: "Sidebar", sub: "App navigation shell" }, next: { href: "/components/task-list", label: "Task List", sub: "Agent task checklist" } },
  "/components/task-list": { prev: { href: "/components/stat-cards", label: "Stat Cards", sub: "KPI number row" }, next: { href: "/components/web-search", label: "Web Search", sub: "Search activity feed" } },
  "/components/web-search": { prev: { href: "/components/task-list", label: "Task List", sub: "Agent task checklist" }, next: { href: "/components/activity-rings-card", label: "Activity Rings", sub: "Concentric goal rings" } },
  "/components/activity-rings-card": { prev: { href: "/components/web-search", label: "Web Search", sub: "Search activity feed" }, next: { href: "/components/area-chart-card", label: "Area Chart", sub: "Filled trend curves" } },
  "/components/area-chart-card": { prev: { href: "/components/activity-rings-card", label: "Activity Rings", sub: "Concentric goal rings" }, next: { href: "/components/bar-list-card", label: "Bar List", sub: "Ranked horizontal bars" } },
  "/components/bar-list-card": { prev: { href: "/components/area-chart-card", label: "Area Chart", sub: "Filled trend curves" }, next: { href: "/components/combo-chart-card", label: "Combo Chart", sub: "Bars plus line" } },
  "/components/combo-chart-card": { prev: { href: "/components/bar-list-card", label: "Bar List", sub: "Ranked horizontal bars" }, next: { href: "/components/contributions-card", label: "Contributions", sub: "Activity heatmap grid" } },
  "/components/contributions-card": { prev: { href: "/components/combo-chart-card", label: "Combo Chart", sub: "Bars plus line" }, next: { href: "/components/earnings-chart-card", label: "Earnings Chart", sub: "Bars with count-up" } },
  "/components/earnings-chart-card": { prev: { href: "/components/contributions-card", label: "Contributions", sub: "Activity heatmap grid" }, next: { href: "/components/funnel-chart-card", label: "Funnel Chart", sub: "Stage conversion flow" } },
  "/components/funnel-chart-card": { prev: { href: "/components/earnings-chart-card", label: "Earnings Chart", sub: "Bars with count-up" }, next: { href: "/components/heatmap-chart-card", label: "Heatmap Chart", sub: "Density grid" } },
  "/components/heatmap-chart-card": { prev: { href: "/components/funnel-chart-card", label: "Funnel Chart", sub: "Stage conversion flow" }, next: { href: "/components/line-chart-card", label: "Line Chart", sub: "Simple trend lines" } },
  "/components/line-chart-card": { prev: { href: "/components/heatmap-chart-card", label: "Heatmap Chart", sub: "Density grid" }, next: { href: "/components/most-active-days-card", label: "Most Active Days", sub: "Weekly activity bars" } },
  "/components/most-active-days-card": { prev: { href: "/components/line-chart-card", label: "Line Chart", sub: "Simple trend lines" }, next: { href: "/components/orders-chart-card", label: "Orders Chart", sub: "Bars, year beside year" } },
  "/components/orders-chart-card": { prev: { href: "/components/most-active-days-card", label: "Most Active Days", sub: "Weekly activity bars" }, next: { href: "/components/radar-chart-card", label: "Radar Chart", sub: "Multi-axis comparison" } },
  "/components/radar-chart-card": { prev: { href: "/components/orders-chart-card", label: "Orders Chart", sub: "Bars, year beside year" }, next: { href: "/components/radial-chart-card", label: "Radial Chart", sub: "Circular progress arcs" } },
  "/components/radial-chart-card": { prev: { href: "/components/radar-chart-card", label: "Radar Chart", sub: "Multi-axis comparison" }, next: { href: "/components/revenue-chart-card", label: "Revenue Chart", sub: "Year against year" } },
  "/components/revenue-chart-card": { prev: { href: "/components/radial-chart-card", label: "Radial Chart", sub: "Circular progress arcs" }, next: { href: "/components/sankey-chart-card", label: "Sankey Chart", sub: "Flow between stages" } },
  "/components/sankey-chart-card": { prev: { href: "/components/revenue-chart-card", label: "Revenue Chart", sub: "Year against year" }, next: { href: "/components/scatter-chart-card", label: "Scatter Chart", sub: "Point distribution" } },
  "/components/scatter-chart-card": { prev: { href: "/components/sankey-chart-card", label: "Sankey Chart", sub: "Flow between stages" }, next: { href: "/components/sleep-score-card", label: "Sleep Score", sub: "Nightly score card" } },
  "/components/sleep-score-card": { prev: { href: "/components/scatter-chart-card", label: "Scatter Chart", sub: "Point distribution" }, next: { href: "/components/stage-bars-card", label: "Stage Bars", sub: "Segmented stage bars" } },
  "/components/stage-bars-card": { prev: { href: "/components/sleep-score-card", label: "Sleep Score", sub: "Nightly score card" }, next: { href: "/components/steps-card", label: "Steps Chart", sub: "Daily steps trend" } },
  "/components/steps-card": { prev: { href: "/components/stage-bars-card", label: "Stage Bars", sub: "Segmented stage bars" }, next: { href: "/components/ai-chat", label: "AI Chat", sub: "Full chat app" } },
  "/components/ai-chat": { prev: { href: "/components/steps-card", label: "Steps Chart", sub: "Daily steps trend" }, next: { href: "/components/ai-image-generation", label: "AI Image Generation", sub: "Prompt-to-image app" } },
  "/components/ai-image-generation": { prev: { href: "/components/ai-chat", label: "AI Chat", sub: "Full chat app" }, next: { href: "/components/ai-profile", label: "AI Profile", sub: "Contribution profile page" } },
  "/components/ai-profile": { prev: { href: "/components/ai-image-generation", label: "AI Image Generation", sub: "Prompt-to-image app" }, next: { href: "/components/chat-starter", label: "Chat Starter", sub: "Deployable chat starter" } },
  "/components/chat-starter": { prev: { href: "/components/ai-profile", label: "AI Profile", sub: "Contribution profile page" }, next: { href: "/components/finance-dashboard", label: "Finance Dashboard", sub: "Cash flow overview" } },
  "/components/finance-dashboard": { prev: { href: "/components/chat-starter", label: "Chat Starter", sub: "Deployable chat starter" }, next: { href: "/components/home-dashboard", label: "Home Dashboard", sub: "KPIs and revenue" } },
  "/components/home-dashboard": { prev: { href: "/components/finance-dashboard", label: "Finance Dashboard", sub: "Cash flow overview" }, next: { href: "/components/marketing-dashboard", label: "Marketing Dashboard", sub: "Campaign performance" } },
  "/components/marketing-dashboard": { prev: { href: "/components/home-dashboard", label: "Home Dashboard", sub: "KPIs and revenue" }, next: { href: "/components/medical-profile", label: "Medical Profile", sub: "Patient health report" } },
  "/components/medical-profile": { prev: { href: "/components/marketing-dashboard", label: "Marketing Dashboard", sub: "Campaign performance" }, next: { href: "/components/multi-agent-chat", label: "Multi-agent Chat" } },
  "/components/multi-agent-chat": { prev: { href: "/components/medical-profile", label: "Medical Profile", sub: "Patient health report" }, next: { href: "/components/project-board", label: "Project Board", sub: "Kanban workspace and ticket details" } },
  "/components/project-board": { prev: { href: "/components/multi-agent-chat", label: "Multi-agent Chat" } },
};

export function prevNextFor(pathname: string): { prev?: LibraryNavItem; next?: LibraryNavItem } {
  const path = pathname.replace(/\/+$/, "") || "/";
  return PREV_NEXT[path] ?? {};
}

/** Docs sidebar (boardui.com/docs/introduction): two sections; the Dark mode
 * row at the bottom is the theme switch, not a link. */
export const DOCS_NAV: LibraryNavSection[] = [
  { title: "Get started", items: [
    { href: "/getting-started", label: "Let's begin" },
    { href: "/docs/introduction", label: "Introduction" },
    { href: "/installation", label: "Installation" },
    { href: "/docs/cli", label: "CLI" },
    { href: "/mcp", label: "MCP server" },
  ] },
  { title: "Components", items: [{ href: "/components", label: "All components" }] },
];

/** Marketing header links (boardui.com/blog header). */
export const MARKETING_LINKS: LibraryNavItem[] = [
  { href: "/components", label: "Components" },
  { href: "/components#templates", label: "Templates" },
  { href: "/getting-started", label: "Docs" },
  { href: "/blog", label: "Blog" },
];
