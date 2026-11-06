import { AgentChat } from "@/components/application/agent-chat/agent-chat";

/**
 * AI Chat template replica.
 * Official: boardui.com/templates/ai-chat — coding agent UI with chat
 * history, Code / Changes / Browser tabs, uncommitted changes.
 *
 * This route renders BoardUI's free AgentChat, which follows the Pro AI chat
 * template's geometry (12px page frame, 16px gap, 260px sidebar card,
 * rounded-3xl chat surface) and works in demo mode without an API key
 * (scripted answers; add AI_API_KEY for a real model).
 *
 * Difference from the official template: the sidebar here is the starter
 * navigation (Chat / Dashboard / Components / Sign in / Sign up); the
 * official template's sidebar is the agent workspace (New agent /
 * Automations / Customize / Repositories + thread list). The chat surface,
 * composer, thinking indicator and history rail are the same product.
 *
 * Built only from free BoardUI components. Not the official Pro source.
 */
export default function AiChatTemplatePage() {
  return <AgentChat />;
}
