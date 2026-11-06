"use client";

import {
  RiAddFill,
  RiChatAiLine,
  RiImageAiLine,
  RiPaletteLine,
  RiRobotLine,
  RiFolderLine,
} from "@remixicon/react";
import Image from "next/image";
import { useState } from "react";

import {
  DashboardSidebar,
  type DashboardNavItem,
} from "@/components/application/dashboard/dashboard-sidebar";
import { Tab, TabList, TabPanel, Tabs } from "@/components/base/tabs/tabs";
import { Badge } from "@/components/base/badges/badge";
import { Button } from "@/components/base/buttons/button";

/**
 * AI Image Generation template replica.
 * Official: boardui.com/templates/ai-image-generation — Gallery / Styles
 * tabs, image grid with prompts ("Green ape, screenprint halftone",
 * "Cloud crown, editorial portrait", ...).
 *
 * Images here are stand-ins from BoardUI's free carousel assets (the
 * official generated images are Pro content and are not in the free repo);
 * the prompts, layout and tabs follow the official demo.
 * Built only from free BoardUI components. Not the official Pro source.
 */

const AI_NAV: DashboardNavItem[] = [
  { key: "new-agent", label: "New agent", icon: RiAddFill },
  { key: "automations", label: "Automations", icon: RiRobotLine },
  { key: "customize", label: "Customize", icon: RiPaletteLine },
  { key: "repositories", label: "Repositories", icon: RiFolderLine },
  { key: "ai-chat", label: "AI Chat", icon: RiChatAiLine, href: "/templates/ai-chat" },
  { key: "ai-image", label: "AI Image Generation", icon: RiImageAiLine, href: "/templates/ai-image-generation" },
];

const GENERATIONS = [
  { src: "/carousel/space-squid.webp", prompt: "Green ape, screenprint halftone", style: "Screenprint" },
  { src: "/carousel/floral.webp", prompt: "Cloud crown, editorial portrait", style: "Editorial" },
  { src: "/carousel/vending-machine.webp", prompt: "Cat with a beer, bold linework", style: "Linework" },
  { src: "/carousel/kitchen.webp", prompt: "Hanok bookshop, pastel duotone", style: "Duotone" },
  { src: "/carousel/seafood.webp", prompt: "Neon market stall, night rain", style: "Neon" },
  { src: "/carousel/sunrise.webp", prompt: "Desert sunrise, grainy film", style: "Film" },
  { src: "/carousel/shark-collage.webp", prompt: "Shark collage, cut paper", style: "Collage" },
];

const STYLES = [
  "Screenprint",
  "Editorial",
  "Linework",
  "Duotone",
  "Neon",
  "Film",
  "Collage",
  "Watercolor",
];

export default function AiImageGenerationTemplatePage() {
  const [navOpen, setNavOpen] = useState(false);
  return (
    <div className="relative flex h-dvh w-full gap-4 overflow-hidden bg-background-full p-3">
      <DashboardSidebar items={AI_NAV} selected="ai-image" className="hidden lg:flex" />
      {navOpen && (
        <div className="fixed inset-0 z-50 flex lg:hidden">
          <button
            type="button"
            aria-label="Close navigation"
            onClick={() => setNavOpen(false)}
            className="absolute inset-0 cursor-pointer bg-black/40"
          />
          <div className="relative flex h-full p-3">
            <DashboardSidebar
              mobile
              items={AI_NAV}
              selected="ai-image"
              onClose={() => setNavOpen(false)}
              className="flex"
            />
          </div>
        </div>
      )}

      <main className="relative flex min-h-0 min-w-0 flex-1 justify-center overflow-x-hidden overflow-y-auto bg-background-full sm:pt-3">
        <div className="flex w-full max-w-[1300px] flex-col gap-4">
          <header className="flex w-full flex-wrap items-end justify-between gap-2">
            <div className="flex flex-col gap-0.5">
              <h1 className="px-1 text-title-2-medium text-text-primary">Image Generation</h1>
              <p className="px-1 text-body-regular text-text-secondary">
                Gallery of generations · replica images, official prompts
              </p>
            </div>
            <Button variant="primary" size="medium" leadingIcon={RiAddFill}>
              New image
            </Button>
          </header>

          <Tabs defaultSelectedKey="gallery">
            <TabList aria-label="Image generation sections">
              <Tab id="gallery">Gallery</Tab>
              <Tab id="styles">Styles</Tab>
            </TabList>
            <TabPanel id="gallery" className="pt-4">
              <div className="grid w-full grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
                {GENERATIONS.map((gen) => (
                  <figure
                    key={gen.prompt}
                    className="group flex w-full flex-col gap-2.5 overflow-hidden rounded-2xl bg-background-secondary-default p-2.5"
                  >
                    <div className="relative aspect-[4/3] w-full overflow-hidden rounded-xl">
                      <Image
                        src={gen.src}
                        alt={gen.prompt}
                        fill
                        className="object-cover transition-transform duration-300 group-hover:scale-[1.03]"
                        sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 33vw"
                      />
                    </div>
                    <figcaption className="flex w-full items-center justify-between gap-2 px-1 pb-1">
                      <p className="min-w-0 truncate text-body-medium text-text-primary">{gen.prompt}</p>
                      <Badge color="neutral">{gen.style}</Badge>
                    </figcaption>
                  </figure>
                ))}
              </div>
            </TabPanel>
            <TabPanel id="styles" className="pt-4">
              <div className="flex w-full flex-wrap gap-2">
                {STYLES.map((style) => (
                  <Badge key={style} color="neutral">
                    {style}
                  </Badge>
                ))}
              </div>
              <p className="pt-3 text-body-regular text-text-secondary">
                Pick a style to steer the next generation. Replica data.
              </p>
            </TabPanel>
          </Tabs>
        </div>
      </main>
    </div>
  );
}
