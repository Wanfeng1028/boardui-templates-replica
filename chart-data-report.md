# 图表数据挖掘报告（BoardUI 复刻）

日期：2026-11-07。范围：`app/templates/dashboard`、`finance`、`marketing`、`ai-profile`、`medical-profile` 五页。
原版依据：`tpl-pages/` 下的 5 份服务端渲染 HTML 快照（dashboard / finance / marketing / ai-profile / medical-profile）。
结论先行：**只抠出一张图——dashboard 的 Contributions 热图（259 格真实值），已替换落盘；其余全部抠不出，原因逐项在第 4 节，附证据。**

## 0. 原版 HTML 里有什么、没有什么（决定成败的前提）

先查了三类藏数据的位置，结果如下：

- `__NEXT_DATA__` / `<script type="application/json">`：**5 个文件全都没有**（0 处）。最大的 `<script>` 是约 76KB 的 RSC flight payload（`self.__next_f.push`），里面只有组件树骨架和 chunk 引用，不含任何图表数据（关键词检索：Earnings / Mon / 958 / 7462 等在 payload 内均为 0 次）。
- Recharts 图表：**服务端渲染为空**。所有 Recharts 图表在 SSR HTML 里都是 `<div class="recharts-responsive-container"><div style="width:0;height:0;overflow:visible"></div></div>`，无 `<path>`、无坐标轴 `<text>`、无 tooltip。5 个文件合计 `<text>` 元素 0 个。凡是走 Recharts 的序列（dashboard 收益/收入、marketing ROAS/访客、medical 步数柱状图、ai-profile Tokens 曲线），原版 HTML 里都不存在，不是不够仔细，是根本没有。
- 有真实数据的只有两类 SSR 内容：① 带 `aria-label` + `data-tier` 的热图格子（dashboard 259 格、ai-profile 266 格、finance 每日花费 84 格）；② 纯文本节点（KPI 总值、漏斗、渠道花费、表格第 1 页、sleep 评分、Jul 10 活动详情等）。

## 1. 种子 / 重建清单（改动前）

| 页 | 位置 | 内容 | 性质 |
|---|---|---|---|
| dashboard/page.tsx:66 | `mulberry32` 定义 | 种子函数本体 | 工具函数 |
| dashboard/page.tsx:97 / 129 | `EARNINGS` / `REVENUE` | 周/月/年三档手写字面量，总值对得上官方（周收益 $7,462、周收入 $18,240），明细是编的 | 图表序列（非种子函数，但同样是重建值） |
| dashboard/page.tsx:170（旧） | `buildContributions` | `mulberry32(2026)`，259 格随机生成后强制缩放到总和 958 | 热图（已替换，见第 2 节） |
| dashboard/page.tsx:231 | `buildHires` | `mulberry32(56)`，第 5–56 位入职者 | 表格行，非图表 |
| dashboard/page.tsx:298 | `buildCustomers` | `mulberry32(660)`，第 13–660 行客户 + 前 12 行的产品/地区 | 表格行，非图表 |
| finance/page.tsx:50 | `mulberry32` 定义 | 种子函数本体 | 工具函数 |
| finance/page.tsx:173 | `buildTransactions` | `mulberry32(140)`，第 11–140 笔交易 | 表格行，非图表 |
| finance/page.tsx:124 | `DAILY` | 每日花费热图 84 格 | 已是真实值（已验证，见第 3 节） |
| marketing/page.tsx:97 / 111 | `ROAS_MONTHS` / `VISITOR_MONTHS` | 12 个月手写字面量，总值对得上官方（广告花费 $217.7K、访客 134,400），月度明细是编的 | 图表序列 |
| marketing/page.tsx:162 | `buildCampaigns` | `seed = i * 7919` 确定性生成，第 11–80 个 campaign | 表格行，非图表 |
| ai-profile/page.tsx:85 | `tokens` useMemo | 60 点正弦公式生成后缩放到 667.7M | 图表序列（非种子函数） |
| medical-profile/page.tsx:51 | `STEP_WEEKS` | 3 周 × 7 天手写值，仅第 1 周总和 31,600 是官方值，每日值是编的 | 图表序列 |
| medical-profile/page.tsx:197 | `generatedPatient` | 确定性生成，第 13–540 位患者 | 表格行，非图表 |

注：ai-profile 的热图（page.tsx:39，266 格）与柱状图（page.tsx:42，30 个高度）、medical 的 365 天圆环（page.tsx:72）此前已是转录真实值，本轮逐项复核无误（见第 3 节），未动。

## 2. 抠出的：dashboard Contributions 热图（已替换）

来源：`tpl-pages/dashboard.html`，259 个 `<button data-tier="N" aria-label="…">`，DOM 顺序逐个提取。

- 提取结果：259 条 `[日期, 次数, tier]`，按原版 DOM 顺序（7 行 × 37 列，行内日期约每 10 天一格；行首依次为 Jan 1、Jan 2、Jan 4、Jan 5、Jan 7、Jan 8、Jan 9）。示例：首格 `Jan 1 / 0 / tier 0`，`Jan 21 / 23 / tier 4`；末格 `Dec 31 / 2 / tier 1`。
- **原版自身不一致（重要）**：259 格次数之和为 **1,721**，而卡片标题写的是 **958**。旧的种子版是把随机值强制缩放到 958 求和；真实格子本身加起来就不是 958。本轮按 1:1 原则照录真实格子，不再向 958 缩放；标题的 958 保持原样（那是原版标题的原值）。文件内注释已写明这一矛盾。
- **tier 阈值纠正**：原版 `data-tier` 与旧代码 `heatTier` 的分段不一致。按两份 HTML 的全部 525 格（dashboard 259 + ai-profile 266）归纳，原版分段是 0 / 1–4 / 5–9 / 10–15 / 16–25 / 26+；旧代码是 10–19 / 20–29，错在 16–19 与 26–29 两档（dashboard 共 8 格受影响，如 Nov 3 的 19 应为 tier 4、Apr 3 的 26 应为 tier 5）。ai-profile 因字面量里直接存了 tier，未受影响。本轮 dashboard 改为直接使用转录的 tier，不再用 `heatTier` 计算，`heatTier` 函数已删除。

改动（仅 `app/templates/dashboard/page.tsx`，未动颜色、class、布局）：

- 新增 `DASHBOARD_HEATMAP` 字面量（page.tsx:174 起，259 条三元组），附来源注释 `Values transcribed from boardui.com/templates/dashboard SSR HTML, aria-labels + data-tier`。
- `buildContributions`（page.tsx:212）改为由字面量映射生成 `HeatCell`（`{ date, value, tier }`），删除 `mulberry32(2026)` 调用及强制缩放到 958 的循环。
- 月份标记推导修正：原 `cells[col * 7]` 是按旧种子版的列优先生成顺序取的；真实数据是行优先 DOM 顺序，改为 `cells[col]`（取第 0 行每列日期），12 个月标记齐全（Jan 列 0、Feb 列 4、Mar 列 6、Apr 列 10、May 列 13、Jun 列 16、Jul 列 19、Aug 列 22、Sep 列 25、Oct 列 28、Nov 列 31、Dec 列 34）。
- 网格渲染 `data-tier={heatTier(cell.value)}` 改为 `data-tier={cell.tier}`。
- 其余种子调用保留：`mulberry32(56)`（入职者第 5–56 行）、`mulberry32(660)`（客户第 13–660 行）仍在用，见第 4 节第 7 条——那是表格行，原版 HTML 只有第 1 页，无从抠。

## 3. 复核为真、无需改动的数据（本轮逐项验过）

- finance `DAILY`（finance/page.tsx:124）：84 个 `aria-label="Mon W1: $24"` 式标签与字面量逐格比对，**全部一致**，和 $4,390 与标题一致。
- ai-profile `HEATMAP`（ai-profile/page.tsx:39）：266 条 `[日期, 次数, tier]` 与 `ai-profile.html` 的 aria-label + data-tier 逐条比对，**全部一致**（含 tier）。
- ai-profile `AGENT_BARS`（ai-profile/page.tsx:42）：30 个柱高与 `ai-profile.html` 的 Agents 区 `height:Npx` 逐个比对，**全部一致**（73、141、118、4、…、34）。
- medical `MINI_RINGS`（medical-profile/page.tsx:72）：365 天 × 3 环，从 `medical-profile.html` 的 365 个 `viewBox="0 0 28 28"` SVG 的 `stroke-dasharray` 反推百分比，逐日比对，**全部一致**；其中仅 Jan 1–Jul 10（191 天）有非零值，与原版注释一致。Jul 10 大环 21/62/77 与文本 `816 kcal / 1h 41m / 5.2 km` 换算一致。
- medical sleep：`49/50、29/30、20/20` 及 `7h 50m / 20m earlier / 5m wake up` 在 HTML 文本中均有；总分 98 一致。
- marketing 文本类字面量：漏斗 96.4K / 38.6K / 14.1K / 5.2K、渠道花费 11,400 / 7,620 / 3,180 / 2,680、Sessions Channels 39 / 25 / 14 / 8 / 7、KPI $24,380 / 1.94M / 1,286 / $1.24、底部合计 $217.7K / 3.6x / 134,400 / 74,500 / 38,500 / 21,400，文本中全部能对上。
- dashboard KPI 总值：周收益 $7,462、周收入 $18,240 在 HTML 中均有（`$<!-- -->7,462` 形式）；入职前 4 人、客户前 12 行与代码中的 exact 行一致。

## 4. 抠不出的（逐项 + 证据）

### 4.1 dashboard：Earnings / Revenue 三档序列（EARNINGS、REVENUE）

- 证据：两张图都是 Recharts + ResponsiveContainer，SSR 只剩空容器（见第 0 节）；HTML 全文无 `__NEXT_DATA__`、无 JSON、无任何逐点数值；唯一可见的是标题总值 `$7,462`（+14.8%）与 `$18,240`（+9.4%），以及周/月/年切换按钮。周（7 点）、月（4 点）、年（12 点）× current/previous 共 138 个数无从得知。
- 现状：保持手写字面量（总值对得上），未编新值。

### 4.2 marketing：ROAS_MONTHS（12 个月花费 + ROAS）、VISITOR_MONTHS（12 个月 organic / paid / social）

- 证据：同上，两张图均为 Recharts 空容器；可见的只有合计：广告花费 $217.7K、ROAS 均值 3.6x、访客总数 134,400、分渠道 74,500 / 38,500 / 21,400。12 个月的拆分（各 12 / 36 个数）不在 HTML 里。
- 现状：保持手写字面量（各分渠道求和与官方合计一致：organic 74,500、paid 38,500、social 21,400；花费 12.1+…+20.8 = 217.7K），未编新值。

### 4.3 marketing：Sessions 的 Campaigns / Landing pages 两档

- 证据：Sessions 卡片只有 Channels 档（39 / 25 / 14 / 8 / 7）在 SSR 文本中；Campaigns 档（31 / 24 / 18 / 15 / 12）与 Landing pages 档（32 / 24 / 18 / 14 / 12）在 HTML 文本中出现 0 次——tab 内容是客户端切换渲染，SSR 只含默认档。
- 现状：保持现有字面量，未动。

### 4.4 finance：Sankey（SANKEY_IN / SANKEY_OUT）、Spending donut（DONUT）、Portfolio bubbles（BUBBLES）

- 证据：`finance.html` 中 `<circle>`、`<rect>`、`stroke-dasharray`、`aria-label="Portfolio bubbles…"` 全部为 0；`Salary`、`12,600`、`1,740` 等拆分值在全文中出现 0 次；三张图的 SVG/图例根本不在 SSR 里（客户端渲染）。可见的只有三个标题总值：Cash flow $18,420、Spending $5,810、Portfolio 7%（+6.2%）。
- 现状：保持现有字面量。求和自洽（Sankey 流入 12,600+3,420+2,400 = 流出 9,280+…+400 = 18,420；donut 8 项合计 5,810），但逐项拆分无法从 HTML 证实或证伪。

### 4.5 ai-profile：Tokens 60 点曲线

- 证据：原版 Tokens 图也是 Recharts 空容器（`ai-profile.html` 中 Tokens 卡片内只有 `recharts-responsive-container` 空 div）；可见的只有 `667.7M tokens`、`+9.4%`、`Jun 14` → `Today` 两个轴端标签。60 个点的逐日值不在 HTML 里。
- 现状：保持正弦公式生成（缩放到 667.7M），未编新值。

### 4.6 medical：STEP_WEEKS 每日步数（3 周 × 7 天）

- 证据：Steps 柱状图是 Recharts 空容器；全文只有周总值 `31,600`（第 1 周）。第 1 周 7 个每日值、以及第 2 / 3 周的每日值与周总值（代码写 31,400）均不在 HTML 里。
- 现状：保持手写值（第 1 周 7 值之和 31,600 对得上），未编新值。

### 4.7 五页表格第 2 页及以后的所有行

- 证据：SSR 只含第 1 页。抽查：dashboard 客户前 12 名、`Joined today` 各出现 1 次；finance `Whole Foods Market` 出现 2 次（第 1 页第 1、6 行）；marketing 10 个 campaign 名各出现 1 次；medical 患者前 12 名各出现 1 次。`__NEXT_DATA__` 与 flight payload 中也没有这些行（payload 仅含组件树骨架）。
- 受影响：dashboard 入职者第 5–56 行（`mulberry32(56)`）、客户第 13–660 行及前 12 行的产品/地区（`mulberry32(660)`，原表无产品/地区列，只有筛选下拉里的选项词）；finance 交易第 11–140 行（`mulberry32(140)`）；marketing campaign 第 11–80 行（`seed = i * 7919`）；medical 患者第 13–540 行（`generatedPatient`）。这些不是图表，按任务范围未动；数据本身也抠不出。

## 5. 构建验证

`npm run build`（2026-11-07，改动后一次通过，无需重试）：

- `Compiled successfully`，TypeScript 通过，21/21 静态页生成，含 `/templates/dashboard`、`/templates/finance`、`/templates/marketing`、`/templates/ai-profile`、`/templates/medical-profile`。
- 本轮只改了 `app/templates/dashboard/page.tsx` 一个文件（git diff 仅此文件 + 其他工人并行的 ai-image-generation、hr-management 两文件，与本任务无关，未碰）。

## 6. 附带发现（不在本次任务范围，供统筹决定）

- medical 睡眠卡片在原版里还有一张高 104px 的 Recharts 图（Sleep score 标题后第二个 `recharts-responsive-container`，SSR 为空），复刻版没有这张图；因 SSR 为空，其数据同样抠不出，且补图属于布局改动，未动手。
- finance 现金流的周期下拉（This month / Last month / This year）在 SSR 里只露出选中项 `This month`，其余选项无法核实；复刻版的 `CASHFLOW_PERIODS`（含 0.94 / 10.77 缩放系数）未动。
- dashboard 热图原版月份行是 12 个均分 `<span>`（`justify-between`），复刻版用的是按列位置绝对定位的标记——本轮按任务口径（只改数据）未改布局，只修正了标记的取数下标。
