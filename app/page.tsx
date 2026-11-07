import { RiLayoutGridLine } from "@remixicon/react";

import { AgentChat } from "@/components/application/agent-chat/agent-chat";
import { ButtonLink } from "@/components/base/buttons/button";

/**
 * Home is the chat starter — it had no template entry at all, so a visitor
 * landing here could not discover the 11 templates. A slim banner above the
 * chat carries the one obvious entry: a primary "浏览全部模板" button to
 * /templates. The chat keeps the rest of the viewport
 * (h-[calc(100dvh-3.5rem)] overrides AgentChat's h-dvh via tailwind-merge),
 * and the sidebar gains the same destination as its first row (starterNav).
 */
export default function Page() {
  return (
    <div className="flex min-h-dvh flex-col bg-background-full">
      <div className="flex h-14 shrink-0 items-center justify-between gap-3 border-b border-separator-border bg-background-primary-default px-4">
        <p className="min-w-0 truncate text-body-medium text-text-secondary">
          BoardUI 模板复刻 · 共{" "}
          <span className="text-text-primary">11 套模板</span>
        </p>
        <ButtonLink
          href="/templates"
          variant="primary"
          size="medium"
          leadingIcon={RiLayoutGridLine}
          className="shrink-0"
        >
          浏览全部模板
        </ButtonLink>
      </div>
      <AgentChat className="h-[calc(100dvh-3.5rem)]" />
    </div>
  );
}
