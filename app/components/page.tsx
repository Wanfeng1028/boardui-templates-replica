"use client";

import { useState } from "react";

import {
  CatalogTierFilter,
  ComponentsCatalog,
  type CatalogTier,
} from "@/components/application/app-shell/app-shell";
import { DocsLayout } from "@/components/application/docs/docs-layout";

/** The starter's catalogue page: boardui.com/components, linking out. */
export default function ComponentsPage() {
  const [tier, setTier] = useState<CatalogTier>("all");
  return (
    <DocsLayout variant="library" title="Components" actions={<CatalogTierFilter tier={tier} onChange={setTier} />}>
      <ComponentsCatalog tier={tier} />
    </DocsLayout>
  );
}
