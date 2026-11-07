import type { Metadata } from "next";
import Link from "next/link";
import { DocumentTitle } from "@/components/application/app-shell/document-title";


import { ActivityRingsCard } from "@/components/application/charts/activity-rings-card";
import { AreaChartCard } from "@/components/application/charts/area-chart-card";
import { BarListCard } from "@/components/application/charts/bar-list-card";
import { ComboChartCard } from "@/components/application/charts/combo-chart-card";
import { ContributionsCard } from "@/components/application/charts/contributions-card";
import { EarningsChartCard } from "@/components/application/charts/earnings-chart-card";
import { FunnelChartCard } from "@/components/application/charts/funnel-chart-card";
import { HeatmapChartCard } from "@/components/application/charts/heatmap-chart-card";
import { LineChartCard } from "@/components/application/charts/line-chart-card";
import { MostActiveDaysCard } from "@/components/application/charts/most-active-days-card";
import { RadarChartCard } from "@/components/application/charts/radar-chart-card";
import { RadialChartCard } from "@/components/application/charts/radial-chart-card";
import { SankeyChartCard } from "@/components/application/charts/sankey-chart-card";
import { ScatterChartCard } from "@/components/application/charts/scatter-chart-card";
import { SleepScoreCard } from "@/components/application/charts/sleep-score-card";
import { StageBarsCard } from "@/components/application/charts/stage-bars-card";
import { StepsCard } from "@/components/application/charts/steps-card";
import { cx } from "@/utils/cx";

/**
 * Pro chart cards showcase — replica.
 *
 * All 17 Pro chart cards rebuilt from free BoardUI components (MIT) +
 * Recharts / SVG + mock data. No Pro source code is used here.
 */

const CARDS = [
  {
    slug: "earnings-chart-card",
    name: "Earnings Chart Card",
    desc: "柱状图卡：Week / Month / Year 周期切换，数字滚动 headline，hover 描边高亮。",
    wide: false,
    Card: EarningsChartCard,
  },
  {
    slug: "line-chart-card",
    name: "Line Chart Card",
    desc: "折线 / 面积图卡：渐变填充，曲线 / 折线 / 阶梯插值切换，动画 active 点。",
    wide: false,
    Card: LineChartCard,
  },
  {
    slug: "contributions-card",
    name: "Contributions Card",
    desc: "GitHub 风格贡献热力网格：可换强调色，hover 某天显示当日贡献数。",
    wide: true,
    Card: ContributionsCard,
  },
  {
    slug: "radar-chart-card",
    name: "Radar Chart Card",
    desc: "雷达图卡：填充 / 虚线 / 仅线 / 中心分数四种变体，hover 图例联动 headline，点击图例隔离系列。",
    wide: false,
    Card: RadarChartCard,
  },
  {
    slug: "radial-chart-card",
    name: "Radial Chart Card",
    desc: "径向柱状图卡：同心圆环、标签、网格底、单值仪表、堆叠半圆仪表五种变体。",
    wide: false,
    Card: RadialChartCard,
  },
  {
    slug: "funnel-chart-card",
    name: "Funnel Chart Card",
    desc: "横向漏斗：曲线 / 锐角收窄切换，居中转化 pill，单色选项，每阶段下方值与名称。",
    wide: false,
    Card: FunnelChartCard,
  },
  {
    slug: "sankey-chart-card",
    name: "Sankey Chart Card",
    desc: "Sankey 流量卡：pill 节点、目标着色连线、来源与占比标签，hover 隔离无关流量。",
    wide: true,
    Card: SankeyChartCard,
  },
  {
    slug: "stage-bars-card",
    name: "Stage Bars Card",
    desc: "漏斗阶段横向圆角 pill：每阶段名 / 值 / 占比，动画宽度，单色选项。",
    wide: false,
    Card: StageBarsCard,
  },
  {
    slug: "bar-list-card",
    name: "Bar List Card",
    desc: "分析 breakdown 列表：排名行 + 背后占比条，来源标签页，指标 caption，show-more pill。",
    wide: false,
    Card: BarListCard,
  },
  {
    slug: "area-chart-card",
    name: "Area Chart Card",
    desc: "多系列面积图：堆叠 / 重叠 / 100% 变体，渐变填充，周期切换，stat tiles 联动高亮。",
    wide: true,
    Card: AreaChartCard,
  },
  {
    slug: "combo-chart-card",
    name: "Combo Chart Card",
    desc: "柱状 + 折线组合图：左右独立轴，hover 变暗，脉冲 active 点。",
    wide: true,
    Card: ComboChartCard,
  },
  {
    slug: "scatter-chart-card",
    name: "Scatter Chart Card",
    desc: "散点 / 气泡图：分组系列，可选尺寸度量，hover 隔离，stat tiles。",
    wide: false,
    Card: ScatterChartCard,
  },
  {
    slug: "heatmap-chart-card",
    name: "Heatmap Chart Card",
    desc: "矩阵热力图（渠道 × 月份）：跟随主题的色阶，hover 联动 headline，Less → More 图例。",
    wide: true,
    Card: HeatmapChartCard,
  },
  {
    slug: "steps-card",
    name: "Steps Card",
    desc: "周步数柱状图：周切换，数字滚动 headline，hover 描边，达标与未达标分色。",
    wide: false,
    Card: StepsCard,
  },
  {
    slug: "sleep-score-card",
    name: "Sleep Score Card",
    desc: "分段分数环：hover 聚焦子分数与指标行，中心数字随之切换。",
    wide: false,
    Card: SleepScoreCard,
  },
  {
    slug: "activity-rings-card",
    name: "Activity Rings Card",
    desc: "Apple Watch 风格同心目标环 + stat tiles，hover 环或指标行联动高亮。",
    wide: false,
    Card: ActivityRingsCard,
  },
  {
    slug: "most-active-days-card",
    name: "Most Active Days Card",
    desc: "连续纵向月历：每天一个迷你活动环，hover 某天显示当日活动分。",
    wide: false,
    Card: MostActiveDaysCard,
  },
] as const;

export const metadata: Metadata = {
  title: { absolute: "Charts | BoardUI" },
};

export default function ProChartsPage() {
  return (
    <main className="min-h-screen bg-background-full px-4 py-8 sm:px-6 lg:px-10">
      <DocumentTitle />
      <div className="mx-auto max-w-[1440px]">
        <header className="mb-6">
          <p className="text-caption-1-semibold text-text-tertiary">
            <Link href="/templates" className="hover:text-text-secondary">
              Templates
            </Link>
            {" / Pro Components / Charts"}
          </p>
          <h1 className="mt-2 text-title-1-medium text-text-primary">Pro 图表卡 · 17 张</h1>
          <p className="mt-2 max-w-3xl text-body-regular text-text-secondary">
            Pro 图表卡复刻（免费组件 + Recharts 实现，非官方源码）。全部 17 张卡只用免费 BoardUI
            组件（MIT）与公开页面内容复刻，数据均为 mock；每张卡的交互都可直接操作。
          </p>
        </header>

        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
          {CARDS.map(({ slug, name, desc, wide, Card }) => (
            <article key={slug} className={cx("min-w-0", wide && "lg:col-span-2")}>
              <div className="mb-2 px-1">
                <h2 className="text-title-3-semibold text-text-primary">
                  {name}
                  <code className="ms-2 rounded-md bg-background-tertiary-default px-1.5 py-0.5 text-body-2-medium font-normal text-text-secondary">
                    {slug}
                  </code>
                </h2>
                <p className="mt-0.5 text-body-2-regular text-text-secondary">{desc}</p>
              </div>
              <Card />
            </article>
          ))}
        </div>

        <footer className="mt-8 border-t border-separator-border pt-4 text-body-2-regular text-text-tertiary">
          复刻说明：图表用 Recharts 绘制；Funnel 横向梯形（Recharts Funnel 仅支持纵向）与
          Contributions / Heatmap / Most Active Days 的单元格网格、Sleep / Activity
          的圆环为手写 SVG / DOM；其余卡片均为 Recharts。数据均为演示 mock，与原版演示数字接近。
        </footer>
      </div>
    </main>
  );
}
