# BoardUI 复刻项目暗色模式验收报告

- 日期：2026-11-07
- 范围：12 个 URL（`/templates` 总览 + 10 套模板 + `/pro-components` + `/pro-components/charts`），每页 1440 / 768 / 390 三档
- 未验收：`/templates/multi-agent-chat`（按 parent 指令暂缓：`app/templates/multi-agent-chat/page.tsx` 正在由他人同步修 5 个功能缺失，等通知后再做暗色验收）
- 构建：`npm run build` 两次均一次通过（修复前、修复后各一次），21/21 静态页
- 未提交、未 push（由 parent 统一提交）
- 静态服务：`python3 -m http.server 8931 -d out/`（验收后已停）

## 验收方法

- Playwright headless shell（`~/.cache/ms-playwright/chromium_headless_shell-1243/.../chrome-headless-shell`），`NODE_PATH=~/workspace/muse-build/shot/node_modules`
- 每页截图前 `addInitScript` 写 `localStorage["boardui:theme"]="dark"`；实测 39/39 页 `.dark` 生效，body 背景 `rgb(18,18,18)`，39/39 页无横向溢出（`scrollWidth == clientWidth`）
- 两个方法学教训：
  1. 第一批截图是废的：`python http.server` 对 `/templates` 这类干净 URL 返回 301 到 `/templates/`，而 `out/templates/` 下没有 `index.html`，于是拍到的是目录列表页（`.dark=false`）。改走 `.html` 直链（`/templates.html`、`/templates/dashboard.html` 等）重拍后全部正常。
  2. 长页 `fullPage` 截图会重置 Recharts 入场动画，图表面板在全页截图里是空的（只有坐标轴）。所有 17 张图表卡改用视口滚动截图（滚入视口、等动画跑完再拍）复核，并与亮色对照。

## 每页结果（修复后）

| 页 | 1440 | 768 | 390 | 结论 |
|---|---|---|---|---|
| /templates 总览 | 通过 | 通过 | 通过 | 文字、链接、卡片对比度正常 |
| /templates/dashboard | 通过 | 通过 | 通过 | 折线/柱状/热力图可读；客户表、统计卡（滚到底部复核）可读 |
| /templates/project-board | 通过 | 通过 | 通过 | 优先级徽章（Low/High/Medium/Urgent）可读；看板横向滚动为既有行为 |
| /templates/marketing | 通过 | 通过 | 通过 | 漏斗、 donut、柱状+折线、营销活动表（滚到底部复核）可读 |
| /templates/calendar | 通过 | 通过 | 通过 | 月视图、选中日蓝框、事件文字、日详情面板可读 |
| /templates/finance | 通过 | 通过 | 通过 | Sankey 图标签可读；390 下右侧标签被裁与亮色完全一致（既有窄屏布局，非暗色问题，未动） |
| /templates/medical-profile | 通过 | 通过 | 通过 | 警报、步数、睡眠环、患者表（滚到底部复核）状态芯片均可读 |
| /templates/hr-management | 通过 | 通过 | 通过 | 招聘漏斗、雷达图、团队分布、员工表（滚到底部复核）可读 |
| /templates/ai-chat | 通过 | 通过 | 通过 | 聊天气泡、代码面板文字可读 |
| /templates/ai-image-generation | 通过 | 通过 | 通过 | 画廊卡片、提示词气泡、操作按钮可读 |
| /templates/ai-profile | 通过 | 通过 | 通过 | 贡献热力图、统计卡、Agents 柱状图可读 |
| /pro-components | 通过（修 1 处） | 通过（修 1 处） | 通过（修 1 处） | 见问题 1 |
| /pro-components/charts | 通过（修 1 处） | 通过 | 通过 | 17 张卡逐卡视口复核；见问题 2 |

## 发现的问题（共 2 个，均已修复）

### 问题 1：Agent Creator 语音偏好选中行文字不可见

- 位置：`/pro-components` → Agent Creator → Voice preference，选中行 Nova
- 现象：选中行背景是 `bg-accent-50`（`--color-accent-50` 在 `.dark` 下无覆盖，仍为近白的 blue-50），而行内标题用 `text-text-primary`（暗色下为白色）→ 白字 on 白底，"Nova" 完全看不见（副标题灰字勉强可见）。三档宽度均复现。
- 根因文件：`components/application/pro/agent-creator.tsx`
- 修复：选中态背景由 `bg-accent-50` 换成 `bg-accent-500/15`（与同一文件里 Emoji 选中态已有的写法一致，双主题都翻转正常；未用 raw 颜色、未写 `dark:` 覆盖）。

### 问题 2："上期"对比系列在暗色下不可见

- 位置：`/pro-components/charts` → Line Chart Card（Last year 虚线）；`/templates/dashboard` → Revenue 柱状图上期柱、Earned so far 面积图上期虚线；另涉及 Orders/Revenue 图例圆点与 Sankey 兜底色
- 现象：`--color-chart-neutral` 在 `.dark` 下是 `neutral-800`（实测解析后亮度 L=15.2%，近黑），画在深色卡片上完全看不见。亮色下同一 token 是 `neutral-300`（L=84.9%），虚线清晰可见——亮暗对照确认是暗色 token 错配，不是动画或数据问题。
- 根因文件：`styles/theme.css` `.dark` 区块（第 637 行）
- 修复：暗色 `--color-chart-neutral` 由 `var(--color-neutral-800)` 改为 `var(--color-neutral-500)`（中灰，亮色值未动；token 注释已同步说明它是数据系列、不是结构色）。

## 修复内容（git diff 只含以下 2 个文件）

- `styles/theme.css`：`.dark` 下 `--color-chart-neutral: var(--color-neutral-500)`（原 neutral-800），附注释。
- `components/application/pro/agent-creator.tsx`：语音选中行 `bg-accent-50` → `bg-accent-500/15`。
- 未动：布局、数据、导航、多智能体聊天逻辑、图表数据数组、hr 数字、ai-image-generation 占位图卡逻辑。工作区另有他人未提交的修改（dashboard、hr-management、ai-image-generation、multi-agent-chat、dashboard-sidebar），与本次无关，未碰。

## 复验结果（修复后重建 + 重拍）

- `npm run build` 一次通过，21/21 页。
- 全量重拍 39 张（`dark2-*`）：39/39 `.dark=true`、无横向溢出。
- 问题 1：1440/390 放大截图确认 "Nova" 白字落在深蓝 tint 底上，清晰可读；亮色对照也拍了，浅蓝底 + 深色字，清晰可读，无回归。
- 问题 2：视口截图确认 Line Chart Card 的 Last year 灰色虚线已出现；Dashboard Revenue 出现灰色上期柱（与蓝色本期柱成对）；Earned so far 出现上期虚线；亮色对照与修复前一致，无回归。
- 另滚到底部复核：dashboard 客户表、marketing 活动表、medical 患者表、hr 员工表、calendar 日详情——暗色下全部可读。

## 非暗色问题（记录，未修）

- Finance 390 档 Sankey 右侧标签被裁：亮色 390 同样被裁，是既有窄屏布局行为，不属暗色验收范围，未动。
- 首次全页截图里 Recharts 卡片空白是截图方法伪影（入场动画被 fullPage 重置），视口复核已证实图表本身暗色正常。

## 截图路径（`~/workspace/boardui-templates-replica/shots/dark/`）

- 修复前全量（39 张）：`dark-<页>-<1440|768|390>.png`，结果 `dark-shot-results.json`
- 修复后全量（39 张）：`dark2-<页>-<1440|768|390>.png`，结果 `dark2-shot-results.json`
- 图表视口复核（修复前，暗/亮对照）：`view-dark-charts-*.png`、`view-light-charts-*.png`
- 修复后关键复核：`view2-dark-charts-earnings-line.png`、`view2-dark-dashboard-revenue.png`、`view2-dark-dashboard-bottom.png`、`view2-dark-hr-bottom.png`、`view2-dark-marketing-bottom.png`、`view2-dark-medical-bottom.png`、`view2-dark-calendar-bottom.png`
- 语音行放大：`slices/zoom-voice-row.png`（修复前）、`slices/zoom2-voice-row-1440.png`（修复后）、`slices/dark2-pro-components-390-seg6.png`（修复后 390）
- 亮色回归对照：`view2-light-charts-earnings-line.png`、`view2-light-voice-row2.png`、`view-light-finance-390.png`
- 脚本：`dark-shot.js`、`dark-shot2.js`、`scroll-charts.js`、`scroll-verify2.js`、`scroll-bottom.js`、`probe-charts.js`、`probe2.js`、`light-regress.js`、`light-voice2.js`、`dbg.js`

## 待办

- 等 parent 通知 `app/templates/multi-agent-chat/page.tsx` 的功能修复完成，再对 `/templates/multi-agent-chat` 单独做暗色验收（只改颜色 class，不动功能逻辑）。
