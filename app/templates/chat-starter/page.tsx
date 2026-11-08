import { AgentChat } from "@/components/application/agent-chat/agent-chat";
import { DocumentTitle } from "@/components/application/app-shell/document-title";

/**
 * Chat Starter template — the live app at boardui.com/templates/chat-starter
 * ("Chat Starter Template — Deploy a Working AI Chat in Two Minutes").
 * The starter itself is the free agent-chat block: app sidebar, pill
 * composer with model chip and stop control, thinking indicator, streamed
 * replies with copy and read-aloud actions, a chat history rail, and the
 * setup notice while no provider key is configured. Answers run through
 * /api/chat on the visitor's own key; history stays in the browser.
 */
export default function ChatStarterTemplatePage() {
  return (
    <>
      <DocumentTitle />
      <AgentChat />
    </>
  );
}
