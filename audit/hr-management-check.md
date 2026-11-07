# HR Management 自查

- 日期：2026-11-07
- 范围：`app/templates/hr-management/page.tsx`（本地 `HrShell` + 页面内容）
- 背景：HR 没有原版（官方 `/templates/hr-management` 返回 404），无缺口清单可对照，本次为内部自查。上一轮已修过 3 处数字问题，本轮再扫一遍 KPI / 漏斗 / 雷达 / 表格之间的数据一致性，并核查布局与全部按钮。
- 方法：逐项读源码 + 手工重算全部交叉数字；未做浏览器实测点击（构建通过后可从 `out/templates/hr-management.html` 核对静态内容）。

## 1. 数字自查（全部重算）

### 1.1 KPI 三档之间

| 核对项 | 重算 | 结论 |
|---|---|---|
| Q2 新 hires 18 | 4-6 月 hires 5+6+7=18 | 对 |
| Q3 新 hires 24 | 7-9 月 hires 8+7+9=24 | 对 |
| 2026 新 hires 61 YTD | Q1 19 + Q2 18 + Q3 24=61 | 对 |
| Headcount 路径 219→227→230→248 | Q1 净 +8；Q2 净 +3（18 hires - 15 leavers）；Q3 净 +18（24 - 6）；合计 +29 | 对，与 2026 档 "+29 YTD" 一致 |
| Q3 "+6 vs Q2" | 24-18=6 | 对 |
| Q2 "−1 vs Q1" | 18-19=-1 | 对 |
| Q3 离职率 "-0.8 pts" | 5.0%-4.2%=0.8 | 对（箭头问题见 1.5） |

### 1.2 漏斗 vs KPI vs Hires/Leavers 图

- 漏斗末端 Hired 24 = Q3 新 hires 24，对。
- 总转化 24/1240=1.935%，文案 "1.9%"，对。
- 各段转化（按钮展开后显示）：Screened 486/1240=39.2%→39%；Interviewed 132/486=27.2%→27%；Offered 31/132=23.5%→23%；Hired 24/31=77.4%→77%，四处均对。
- 漏斗条百分比（相对 1240）：39% / 11%（132/1240=10.6%）/ 3%（31/1240=2.5%，JS Math.round 取 3）/ 2%（24/1240=1.9%），均对。
- Hires/Leavers 图：hires 合计 5+6+7+8+7+9=42，leavers 合计 5+6+4+3+2+1=21，净 +21，文案 "Net +21 over the last 6 months (42 hires, 21 leavers)"，对。
- Hires/Leavers 图与 KPI 档的 hires 数一致（Q2 18、Q3 24）。

### 1.3 雷达 vs KPI

- All teams 均值 (80+74+83+78+75)/5=78，与 Q3 "Avg. engagement 78%" 一致，对。
- 各队均值：Engineering 76.6→77；Design 77.4→77；Sales 74.2→74。雷达下拉切队时底部文案显示该均值，计算正确。
- 2026 档 engagement 77% 与雷达 All teams 78% 不相等：不视为矛盾，KPI 是全年档数值、雷达是当前快照，两者口径不同。

### 1.4 团队 breakdown vs 表格 vs Recent hires

- 团队人数合计 86+54+32+28+18+16+14=248，与 headcount 248 一致，对。
- 团队百分比四舍五入：35+22+13+11+7+6+6=100，对。
- Recent hires 5 人（Ava / Liam / Sofia / Noah / Maya）与表格中 start 最晚的 5 行逐人一致（姓名、角色、日期），对。
- 表格 12 人、每页 6 人、共 2 页；"Page 1 of 2 · 6 per page" 初始文案，对。
- 状态分布：Probation 2 人（均为 9 月入职的新人）、On leave 1 人、Active 9 人，合理。

### 1.5 发现的问题（数字类）

- **离职率箭头与符号矛盾（已修）**：三档离职率的 `up` 字段同时控制箭头方向与红绿色，离职率下降是好事却被标成上升。Q3 "−0.8 pts" 配 ↑ 绿标、Q2 "+0.4 pts" 配 ↓ 红标、2026 "−1.1 pts YoY" 配 ↑ 绿标，箭头方向与 delta 符号相反。
- 修法：`up` 改为只表示数值方向（箭头），新增 `good` 表示好坏（颜色），缺省等于 `up`；三处离职率改成 `up: false, good: true`（Q3、2026）与 `up: true, good: false`（Q2）。其余 9 个 KPI 不变。
- **未修（说明）**：2026 档离职率 "−1.1 pts YoY" 没有 YoY 基线可核，是陈述值、无法证伪，保留。新增员工（Add employee）不改 Q3 KPI：KPI 是 Q3 快照，新增入职日为 Nov 6（属 Q4），不改合理。

## 2. 布局自查（代码层面）

- KPI：`grid-cols-2 xl:grid-cols-4`；漏斗+雷达、Hires/Leavers+团队 breakdown 均为 `xl:flex-row` 两列，小屏上下堆叠，无写死宽度冲突。
- 雷达 SVG：5 个轴标签坐标逐个验算，全部落在 400×280 viewBox 内（Growth 顶部居中、Recognition/Balance 右侧、Leadership/Compensation 左侧），无裁切。
- 表格：`min-w-[720px]` + `overflow-x-auto`，窄屏横向滚动不撑破页面。
- 两个弹窗 `max-w-[420px]`、遮罩全屏，移动端 `items-end` 底部弹出，无溢出。
- 顶部说明横条（含中文"按官方描述搭建，无原版演示对照"）为有意保留的说明，非缺口。
- 未做浏览器三档宽度实测；构建后仅核对静态导出含关键文案。

## 3. 按钮逐个核查（无死按钮）

全部按钮均有 onClick / onChange，逐项核对如下：

| 按钮 | 反应 |
|---|---|
| KPI 周期 Q3 2026 / Q2 2026 / 2026 | 切 KPI 数据 |
| 漏斗 5 段 | 展开/收起该段转化说明 |
| 雷达团队下拉 | 切雷达数据与均值文案 |
| 雷达 5 个顶点 | hover 显示该轴分数 |
| 团队 breakdown 7 行 | 过滤表格 / 再点清除 |
| Recent hires 5 张卡片 | 按名字过滤表格并滚动到表格 |
| 搜索框、状态下拉 | 过滤表格并回第 1 页 |
| 排序 Employee / Start date ×2 | 升降序切换并回第 1 页 |
| 每行 View / Remove | 打开详情弹窗 / 移出视图 + toast |
| 分页 Previous / 数字 / Next | 翻页（含禁用态） |
| 详情弹窗 Close / Done、新增弹窗 Close / Cancel / Add employee | 关闭 / 提交新增并 toast |
| 团队过滤 chip 的 Clear | 清除团队过滤 |
| 顶栏 Filters | 在 All 与 Active 间切换（见下） |
| 顶栏 Add employee | 打开新增弹窗 |
| 通知铃 | 打开通知中心 popover（共享组件） |
| 侧栏导航 / 折叠 / 主题切换 / 汉堡抽屉 | 共享侧栏行为 |
| 顶栏"全部模板"、侧栏首行"全部模板" | 跳 /templates（见第 4 节） |

- **修了一处**：两个弹窗原来只支持点遮罩/按钮关闭、无 Esc 关闭，与共享 Modal 行为不一致；已加 `useEffect` 监听 Esc，任一弹窗打开时 Esc 关闭。
- **已知 quirk（未改）**：顶栏 Filters 按钮只在 All 与 Active 之间切换，与表格内状态下拉共用同一 state；下拉选了 Probation 等状态后按钮文案会显示 "Status: X"，点按回到 All。有反应、不是死按钮，但行为较窄，记录在案。

## 4. 模板切换入口

- 顶栏"全部模板"按钮在：`HrShell` 内渲染 `<AllTemplatesButton />`（模板切换组加的，本轮未动）。
- 侧栏首行"全部模板"在：`DASHBOARD_NAV` 首行，本轮保留。
- 本轮从 `DASHBOARD_NAV` 删了 HR Management 与 Multi-Agent Chat 两行（原版侧栏本无这两项，见各缺口清单 A1 / F-C12 / M-C13 / M-CLICK-13），HR 页 `selected="hr-management"` 因此无对应行、无高亮——与原版一致，页面仍可从 `/templates` 索引进入。
- 面包屑 Board team / Mertcan 的 href 由 `#` 改回 `/templates/dashboard`（共享壳修复，HR 本地壳同步改）。

## 5. 本轮修了什么（HR 页）

1. 面包屑两处 `href="#"` → `/templates/dashboard`。
2. 离职率 KPI 箭头与符号矛盾：`up`/`good` 分离，三处离职率修正。
3. 两个弹窗加 Esc 关闭。
4. 过时注释修正：页头注释原称"共享侧栏包含 HR Management"，改为说明 HR 不在导航行、从索引进入。

## 附：本轮同时修的共享壳（供追溯）

- 面包屑 href `#` → `/templates/dashboard`（`template-shell.tsx`，HR 本地壳同步）。
- 通知角标 3 → 5：`starter-notifications.ts` 中两条 Yesterday 通知改为未读。
- Settings 改回死链：侧栏 Settings 去掉弹窗、`SettingsModal` 卸载；原版为 `href="#"`。
- 分页 "…" 删掉：共享 `Pagination` 不再渲染省略号，页码直接相邻。
- 侧栏导航删 HR Management / Multi-Agent Chat 两行，保留用户要求的"全部模板"首行。
- 侧栏搜索框 placeholder "Search navigation…" → "Search..."（finance-gaps F-S8）。
- 字体：Inter 已换上——`app/fonts/inter/` 新增 4 个完整 OTF（400/500/600/700，各 2852 字形，字重值已核），`app/layout.tsx` 用 `next/font/local` 加载、`--font-inter` 由其变量 class 提供；`styles/theme.css` 移除本地 `--font-inter` 定义避免冲突。JetBrains Mono 本机无任何字体文件、无法离线获取，`--font-mono-source` 仍为系统等宽栈（见 layout.tsx 与 theme.css 注释）。
- 已知冲突（未擅自定）：dashboard-gaps.md F10 称 Dashboard 原版分页为 1–5 / … / 55（含省略号），与 Finance（1–5 / 14）、Medical（1–5 / 45）的无省略号原版不一致；共享 Pagination 按本次任务口径去了省略号，Dashboard 如需恢复需单独加变体，由 Dashboard 组定夺。
