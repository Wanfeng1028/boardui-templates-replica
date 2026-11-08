import { RiCloseLine } from "@remixicon/react";

/* ------------------------------------------------------------------ */
/* Shared by the Pro template pages (multi-agent-chat, ai-image-generation).
/* Pro banner — measured live (orig-probe2.json banner +              */
/* orig-marketplace-full.png): a fixed card at the viewport's bottom  */
/* left (280×194 @12,694 desktop, full-width @12,656 on mobile),     */
/* logo + "Dismiss Pro template prompt" × on top, "This template is  */
/* part of Pro" / "Buy once and install the full source with the     */
/* CLI." and a full-width blue "Get Pro" button. It overlays the     */
/* sidebar footer until dismissed.                                    */
/* ------------------------------------------------------------------ */

export function ProBanner({ onDismiss }: { onDismiss: () => void }) {
  return (
    <div className="fixed inset-x-3 bottom-3 z-60 flex w-auto flex-col items-start gap-3 overflow-hidden rounded-2xl border border-border-button-white bg-background-secondary-default p-4 shadow-waitlist sm:inset-x-auto sm:w-[280px]">
      {/* Top artwork, measured live (s2-orig-banner): the original paints a
          pastel ray wash across the top 200px of the card on canvas,
          masked to fade out at 38%, above a silver metal "b" tile —
          not the blue logo tile this card used to show. The wash is
          approximated here with a pastel gradient (the canvas itself
          has no public asset); the tile reuses the repo's own silver
          BoardUI Pro mark (public/brand/boardui_pro.png). */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 overflow-hidden"
        style={{
          height: 200,
          maskImage: "linear-gradient(rgb(0, 0, 0) 38%, transparent 100%)",
          WebkitMaskImage: "linear-gradient(rgb(0, 0, 0) 38%, transparent 100%)",
          background:
            "linear-gradient(100deg, rgba(147, 197, 253, 0.55) 0%, rgba(255, 255, 255, 0.15) 30%, rgba(249, 168, 212, 0.45) 62%, rgba(196, 181, 253, 0.4) 100%)",
        }}
      />
      <div className="relative flex w-full items-start justify-between gap-2">
        <span className="inline-flex size-10 shrink-0 select-none items-center justify-center overflow-hidden rounded-lg">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/brand/boardui_pro.png" alt="" loading="lazy" decoding="async" className="size-full object-cover" />
        </span>
        <button
          type="button"
          aria-label="Dismiss Pro template prompt"
          onClick={onDismiss}
          className="flex size-5 shrink-0 cursor-pointer items-center justify-center rounded-full text-foreground-icon-secondary outline-none transition-colors hover:bg-background-tertiary-default focus-visible:ring-2 focus-visible:ring-border-focus-ring"
        >
          <RiCloseLine className="size-4" aria-hidden />
        </button>
      </div>
      <div className="flex flex-col gap-1">
        <p className="text-body-medium text-text-primary">This template is part of Pro</p>
        <p className="text-body-regular text-text-secondary">Buy once and install the full source with the CLI.</p>
      </div>
      <a
        href="/pricing"
        className="flex h-9 w-full items-center justify-center rounded-full bg-button-primary text-body-medium text-text-white outline-none transition-opacity duration-150 ease hover:opacity-90 focus-visible:ring-2 focus-visible:ring-border-focus-ring"
      >
        Get Pro
      </a>
    </div>
  );
}
