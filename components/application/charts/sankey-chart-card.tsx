"use client";

import { useEffect, useRef, useState } from "react";
import { ResponsiveContainer, Sankey, Tooltip } from "recharts";

import { ChartCardShell } from "./card-shell";

/**
 * Sankey Chart Card (replica).
 *
 * Sankey flow card: pill nodes, links coloured by their target, source and
 * share labels, and hover isolation — hovering a node or a link dims every
 * flow that does not touch it, and the headline names the hovered flow.
 */

const NODE_COLORS: Record<string, string> = {
  Organic: "var(--color-chart-1)",
  Paid: "var(--color-chart-4)",
  Social: "var(--color-chart-3)",
  Email: "var(--color-chart-8)",
  Landing: "var(--color-chart-2)",
  Pricing: "var(--color-chart-5)",
  Signup: "var(--color-chart-4)",
  Purchase: "var(--color-chart-1)",
};

const SANKEY_DATA = {
  nodes: [
    { name: "Organic" },
    { name: "Paid" },
    { name: "Social" },
    { name: "Email" },
    { name: "Landing" },
    { name: "Pricing" },
    { name: "Signup" },
    { name: "Purchase" },
  ],
  links: [
    { source: 0, target: 4, value: 18200 },
    { source: 0, target: 5, value: 6400 },
    { source: 1, target: 4, value: 9800 },
    { source: 1, target: 5, value: 7200 },
    { source: 2, target: 4, value: 11400 },
    { source: 2, target: 5, value: 3100 },
    { source: 3, target: 4, value: 4600 },
    { source: 3, target: 5, value: 2900 },
    { source: 4, target: 6, value: 12600 },
    { source: 4, target: 7, value: 5400 },
    { source: 5, target: 6, value: 4300 },
    { source: 5, target: 7, value: 8900 },
  ],
};

const TOTAL = SANKEY_DATA.links
  .filter((l) => l.source < 4)
  .reduce((s, l) => s + l.value, 0);

type NodeRenderProps = {
  x?: number;
  y?: number;
  width?: number;
  height?: number;
  index?: number;
  payload?: { name?: string; value?: number; depth?: number };
};

type LinkRenderProps = {
  sourceX?: number;
  targetX?: number;
  sourceY?: number;
  targetY?: number;
  sourceControlX?: number;
  targetControlX?: number;
  linkWidth?: number;
  index?: number;
  payload?: {
    source?: { name?: string };
    target?: { name?: string };
    value?: number;
  };
};

type TooltipProps = {
  active?: boolean;
  payload?: Array<{ payload?: { source?: { name?: string }; target?: { name?: string }; value?: number } }>;
};

function SankeyTooltip({ active, payload }: TooltipProps) {
  if (!active || !payload?.length) return null;
  const link = payload[0]?.payload;
  if (!link?.source || !link?.target) return null;
  return (
    <div className="rounded-xl border border-border-button-default bg-background-secondary-default px-3 py-2 text-body-2-medium text-text-primary shadow-lg">
      {link.source.name} → {link.target.name} · {link.value?.toLocaleString("en-US")} (
      {link.value ? Math.round((link.value / TOTAL) * 100) : 0}% of traffic)
    </div>
  );
}

export function SankeyChartCard({ className }: { className?: string }) {
  const [hoverNode, setHoverNode] = useState<string | null>(null);
  const [hoverLink, setHoverLink] = useState<number | null>(null);
  const [chartWidth, setChartWidth] = useState(640);
  const wrapRef = useRef<HTMLDivElement>(null);

  // In-chart node labels only fit on wider cards; on phones the headline,
  // tooltip and the legend below carry the names instead.
  useEffect(() => {
    const el = wrapRef.current;
    if (!el) return;
    const measure = () => setChartWidth(el.clientWidth);
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const showLabels = chartWidth >= 480;

  const hoveredLink =
    hoverLink !== null ? SANKEY_DATA.links[hoverLink] : null;
  const hoveredNodeName = hoverNode;
  const linkForHeadline = hoveredLink
    ? { from: SANKEY_DATA.nodes[hoveredLink.source].name, to: SANKEY_DATA.nodes[hoveredLink.target].name, value: hoveredLink.value }
    : null;

  const renderNode = (props: NodeRenderProps) => {
    const { x = 0, y = 0, width = 0, height = 0, payload } = props;
    const name = payload?.name ?? "";
    const color = NODE_COLORS[name] ?? "var(--color-chart-neutral)";
    const value = payload?.value ?? 0;
    const depth = payload?.depth ?? (x < 160 ? 0 : 1);
    const dimmed = hoverNode !== null && hoverNode !== name;
    const labelX = depth === 0 ? x + width + 8 : x - 8;
    const label = showLabels ? `${name} · ${Math.round((value / TOTAL) * 100)}%` : name;
    return (
      <g
        key={`node-${name}`}
        opacity={dimmed ? 0.35 : 1}
        onMouseEnter={() => setHoverNode(name)}
        onMouseLeave={() => setHoverNode(null)}
        style={{ cursor: "pointer" }}
      >
        <rect x={x} y={y} width={width} height={height} rx={5} fill={color} />
        {showLabels ? (
          <text
            x={labelX}
            y={y + height / 2}
            dy="0.32em"
            textAnchor={depth === 0 ? "start" : "end"}
            fontSize={12}
            fill="var(--color-text-secondary)"
          >
            {label}
          </text>
        ) : null}
      </g>
    );
  };

  const renderLink = (props: LinkRenderProps) => {
    const { sourceX = 0, targetX = 0, sourceY = 0, targetY = 0, sourceControlX = 0, targetControlX = 0, linkWidth = 0, index = 0, payload } = props;
    const targetName = payload?.target?.name ?? "";
    const sourceName = payload?.source?.name ?? "";
    const color = NODE_COLORS[targetName] ?? "var(--color-chart-neutral)";
    const touchesHover =
      hoverNode === null && hoverLink === null
        ? true
        : hoverLink === index || hoverNode === sourceName || hoverNode === targetName;
    const d = `M${sourceX},${sourceY} C${sourceControlX},${sourceY} ${targetControlX},${targetY} ${targetX},${targetY}`;
    return (
      <path
        key={`link-${index}`}
        d={d}
        fill="none"
        stroke={color}
        strokeWidth={Math.max(linkWidth, 1)}
        strokeOpacity={touchesHover ? 0.55 : 0.07}
        onMouseEnter={() => setHoverLink(index)}
        onMouseLeave={() => setHoverLink(null)}
        style={{ cursor: "pointer" }}
      />
    );
  };

  return (
    <ChartCardShell
      title="Cash flow"
      subtitle="Where visitors come from and where they convert"
      className={className}
    >
      <div>
        <p className="text-body-medium text-text-secondary">
          {linkForHeadline
            ? `${linkForHeadline.from} → ${linkForHeadline.to}`
            : hoveredNodeName
              ? hoveredNodeName
              : "Total sessions"}
        </p>
        <p className="animate-number-fade text-title-1-medium text-text-primary tabular-nums">
          {linkForHeadline
            ? `${linkForHeadline.value.toLocaleString("en-US")} (${Math.round((linkForHeadline.value / TOTAL) * 100)}%)`
            : hoveredNodeName
              ? `${(SANKEY_DATA.nodes.find((n) => n.name === hoveredNodeName) ? SANKEY_DATA.links.filter((l) => SANKEY_DATA.nodes[l.source].name === hoveredNodeName || SANKEY_DATA.nodes[l.target].name === hoveredNodeName).reduce((s, l) => s + l.value, 0) : 0).toLocaleString("en-US")}`
              : TOTAL.toLocaleString("en-US")}
        </p>
        <p className="text-body-2-medium text-text-tertiary tabular-nums">
          {linkForHeadline ? "share of all sessions" : hoveredNodeName ? "sessions touching this node" : "sessions in the last 30 days"}
        </p>
      </div>
      <div className="h-64 w-full" ref={wrapRef}>
        <ResponsiveContainer width="100%" height="100%">
          <Sankey
            data={SANKEY_DATA}
            nodeWidth={10}
            nodePadding={14}
            node={renderNode}
            link={renderLink}
            margin={{ top: 8, right: showLabels ? 110 : 16, bottom: 8, left: 0 }}
          >
            <Tooltip content={<SankeyTooltip />} />
          </Sankey>
        </ResponsiveContainer>
      </div>
      <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-body-2-medium text-text-secondary">
        {SANKEY_DATA.nodes.map((n) => (
          <span key={n.name} className="flex items-center gap-1.5">
            <span className="size-2 rounded-full" style={{ background: NODE_COLORS[n.name] }} aria-hidden />
            {n.name}
          </span>
        ))}
      </div>
      <p className="text-body-2-regular text-text-tertiary">
        Hover a pill or a flow to isolate it — everything else fades out.
      </p>
    </ChartCardShell>
  );
}
