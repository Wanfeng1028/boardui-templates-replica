# BoardUI Pro 全部内容 · 复刻版（Replica）

> **这不是官方原版。** BoardUI Pro 是付费内容（Pro 一次性买断，1 年 €149 / 终身 €199 / 5 人团队 €349），源码不在免费仓库、不在公开 registry，无法免费获取。本项目是**用免费的 BoardUI 组件（MIT，已存档）+ mock 数据复刻**出来的全部 Pro 内容，布局与官网演示尽量接近，供参考学习用。

## 内容总览（2026-11-06 晚全部完成）

Pro 注册表确认正好 **40 项：30 个 Pro 组件 + 10 套 Pro 模板**，本仓库全部复刻，外加 Calendar 演示页：

- **11 条模板路由**：10 套 Pro 模板（Dashboard、Project Board、Marketing、Finance、HR Management、Medical Profile、AI Chat、AI Image Generation、AI Profile、Multi-Agent Chat）+ Calendar 演示页。全部按 1:1 功能级重做，直接替换掉原来的近似版。
- **30 个 Pro 组件**：17 张图表卡（`/pro-components/charts`）+ 13 个 Agent/Composer/其他组件（`/pro-components`）。
- **多端**：桌面 1440、平板 768、手机 390 三档，侧栏窄屏收起为汉堡抽屉，无横向溢出。
- **交互**：全部可点击元素都能点、有状态变化（导航、切换、弹窗、表单、排序、筛选、分页、发送消息），不是静态截图。

## 跑起来

```bash
npm install
npm run dev      # 开发模式 http://localhost:3000
npm run build    # 生产构建（静态导出到 out/）
```

技术栈：Next.js 16.3.3 + React 19.2.4 + Tailwind CSS v4 + React Aria + Recharts（与 BoardUI 免费 starter 一致）。

**构建状态（2026-11-06 晚已验证）：`npm run build` 通过，21 个路由全部生成；14 条模板/组件路由逐个 curl 均为 200。**

> 构建注意：上游 starter 用 `next/font/google` 加载 Inter / JetBrains Mono，沙箱构建环境连不上 Google Fonts 会导致 Turbopack 报错。本复刻已把字体改为系统栈（`--font-inter` / `--font-mono-source` 定义在 `styles/theme.css`，`app/layout.tsx` 不再引 `next/font/google`）。若在能联网的环境部署，可改回 `next/font/google` 恢复 Inter。
>
> 另：`next.config.ts` 是 `output: "export"`（静态导出），`next start` 不能用，生产服务请用 `npx serve out` 或任意静态服务器；路由文件为 `out/<slug>.html`（无 trailingSlash）。

## 模板与路由

| # | 模板 | 路由 | 完成度 |
|---|---|---|---|
| 1 | Dashboard | `/templates/dashboard` | 1:1 重做（1118 行）："Welcome Mertcan"、KPI 卡、Recent hires（56 人 14 页）、Earnings/Revenue 图表（Weekly/Monthly/Yearly）、Contributions 热力图（37×7、958）、客户表（660 人 55 页，筛选/排序/行内编辑/工单弹窗） |
| 2 | Project Board | `/templates/project-board` | 1:1 重做（755 行）：5 列（Backlog/To do/In progress/Review/Done）、13 张票据逐字照录、详情侧面板（可编辑属性/评论/token 图）、New ticket 真新建、拖拽换列、排序 |
| 3 | Marketing | `/templates/marketing` | 1:1 重做（875 行）：4 张 KPI 卡、获客漏斗、Spend by channel、Sessions 三 tab、ROAS 组合图、Visitors 面积图、Campaigns 表 80 条（前 10 行逐字）、Filter/New campaign/排序 |
| 4 | Calendar | `/templates/calendar` | 1:1 重做（564 行）：2026 年 8 月真实日历、23 个事件 chips、月份切换、Inbox、事件详情弹窗、New event 弹窗 |
| 5 | Finance | `/templates/finance` | 1:1 重做（1017 行）：KPI、Cash flow Sankey（分项求和精确）、Spending 圆环、Portfolio 气泡、Daily spending 热力图（84 格取自原版 aria-label）、交易表 140 条 14 页、Add 弹窗 |
| 6 | Medical Profile | `/templates/medical-profile` | 1:1 重做（929 行）：患者卡、步数 31,600、睡眠 98、Most active days 32,459（365 天迷你三环逐天提取）、患者表 540 人 45 页 |
| 7 | HR Management | `/templates/hr-management` | 新建（792 行）：headcount KPI、最近入职、招聘漏斗、敬业度雷达、入职 vs 离职、团队 breakdown、员工表。**原版无演示页（404），按官方描述搭建，页顶已注明** |
| 8 | AI Chat | `/templates/ai-chat` | 1:1 重做（696 行）：Agentic chat、11 条原版线程、Fable 5 模型、Code/Changes/Browser 三栏、Composer、发送→Thinking→canned 回复、线程切换/新建/重命名/删除 |
| 9 | AI Image Generation | `/templates/ai-image-generation` | 1:1 重做（553 行）：20 条原版提示词全录、7 张图（免费素材占位）、Gallery/Styles、Like/Dislike、Regenerate、灯箱 |
| 10 | AI Profile | `/templates/ai-profile` | 1:1 重做（375 行）：Mertcan Esmergül、266 格热力图逐格照录（1,761 contributions）、30 根柱高逐值照录、Tokens 667.7M、Weekly/Monthly/Yearly 切换 |
| 11 | Multi-Agent Chat | `/templates/multi-agent-chat` | **1:1 像素级复刻（955 行，见下节）**：三栏聊天、7 组对话原文逐字、群聊空态、环形头像选择器、Voice 栏 |

另有总览页 `/templates`（11 套入口 + Pro 组件入口）。

共享外壳：9 套仪表盘模板 + HR Management 共用侧栏导航（Home、Project board、Marketing、Calendar、Finance、Medical Report、HR Management、AI Chat、AI Image Generation、Profile、Support、Settings），点侧栏切模板路由；窄屏收起为汉堡抽屉。

## Pro 组件（30 个）

- **17 张图表卡**（`/pro-components/charts`）：Earnings、Line、Contributions、Radar、Radial、Funnel、Sankey、Stage Bars、Bar List、Area、Combo、Scatter、Heatmap、Steps、Sleep Score、Activity Rings、Most Active Days。周期切换、hover 联动、变体切换均可用；图表用 Recharts，Funnel 横向梯形与部分网格/圆环为手写 SVG/DOM（已注明）。
- **13 个非图表组件**（`/pro-components`）：Web Search、Task List、Composer、Composer Panel、Composer Attachments、Agent Progress、Agent Limits Card、Questionnaire、Calendar、Agent Avatar、Agent Creator（11 个实机演示）+ Project Board 与 Multi-agent Chat（链接卡片，链到已 1:1 的模板页）。

## Multi-Agent Chat · 1:1 复刻说明（2026-11-06 晚）

这一页按 boardui.com/templates/multi-agent-chat 的服务端渲染 HTML 与公开 CSS 逐项还原，不是凭目测估数。数值来源：侧栏 `w-[260px]`、主区 `rounded-3xl bg-background-secondary-default`、顶栏 `h-[55px]`、聊天气泡 `rounded-[var(--radius-2-5xl)]`（= 20px）、用户气泡白底、Agent 气泡 `bg-background-tertiary-default`（#ebebeb）、侧栏选中项 `h-[54px] rounded-xl bg-background-tertiary-default`、Composer 卡片 `rounded-[var(--radius-2-5xl)]` 带 `shadow-[0_1px_0.5px_rgba(0,0,0,0.02),0_4px_2px_rgba(0,0,0,0.02)]`、编辑器 `w-[360px]`。7 组对话（用户问 + Agent 两段回复）逐字照抄，群聊空态（Design + Marketing + Product / "A few minds. One conversation."）可点。

验收方法：本地 Playwright（headless shell）1440px 截图 + 实测几何量。默认态、编辑器打开态、群聊空态三张截图见 `shots/mac-1440-default.png`、`shots/mac-1440-editor.png`、`shots/mac-1440-group2.png`；另把原版服务端 HTML + CSS 在本地渲染后同尺寸截图对照（`shots/mac-1440-original.png`），逐项核对：侧栏 260px、主区圆角 24px、气泡圆角 20px、气泡底色 #ebebeb / 白、选中项 54px×12px 圆角，全部吻合。

还差的地方（诚实说明，不藏）：

- **头像是手绘 SVG 卡通脸，不是原版 canvas 动画。** 原版头像是 canvas 画的动画脸（会眨眼、眼珠移动），源码属 Pro、拿不到。本复刻用 SVG 画了粉彩盾形/圆形/星形/菱形脸，眼睛加了 CSS 眨眼动画（4.4s 周期），形状、颜色、位置按原版排布，但脸型细节与原版 canvas 不完全相同，且各 Agent 的具体配色是按“粉彩”描述分配的（原版 canvas 颜色无法从 HTML 反推）。
- **侧栏多了一项群聊。** 用户在 components 页看到侧栏首项是群聊 "Design + Marketing + Product"，本复刻按用户描述收了这一项；但模板页（templates/multi-agent-chat）的服务端 HTML 里没有这一项，只有 7 条单人对话。因此侧栏各单人项的纵坐标比模板原版下移约 58px（即一项的高度）。这是按用户要求收的，不是漏测。
- **默认编辑器关闭。** 模板页服务端 HTML 里编辑器默认是打开的（显示 Security agent），但用户明确要求默认关闭，本复刻按用户要求默认关闭，点顶栏头像胶囊才打开。
- **编辑器标题是 Agent 名。** 原版模板 HTML 里编辑器标题显示的是当前 Agent 名（如 Security agent），本复刻照此用 Agent 名；用户口述曾称标题为 "Agent"，以实际渲染为准。
- **顶栏头像胶囊的玻璃质感是近似。** 原版胶囊有一层 backdrop blur + 渐变光泽（landing-glass-stroke），本复刻用半透明灰底 pill 代替，视觉接近但不是同一层效果。
- **聊天仍是本地 demo。** 发送消息后给一条 canned 回复，没有接模型；官方模板接真实 agent。切换 Agent 会切到该 Agent 的原版对话（逐字）。
- **搜索框是可展开的 pill。** 原版搜索是一个可展开的 pill（点开变输入框），本复刻照此实现；Marketplace 与 Create（+）按钮仅为占位，不接后端。

## 与官网原版的差异（诚实说明）

- **不是官方源码。** 布局、文案、数据是按官网公开演示页复刻的，组件是免费版，代码结构与官方 Pro 模板不同。
- **图片是占位。** AI Image Generation 的 7 张图用的是免费仓库里的 carousel 素材，不是官方生成的原图；提示词与原版一致（20 条全录）。AI Profile 封面是 CSS 渐变（原版封面图属 Pro，不能用）。
- **数据是 mock。** 所有数字（营收、订单、步数、代币等）都是按官网演示页的公开数字写的占位数据，不接真实后端；部分图表月度序列是按官方总值反推的重建值（求和对得上，明细未逐项转录），已在各页注释中标明。
- **HR Management 无原版演示对照。** 官方 /templates/hr-management 是 404，该页按 llms.txt 的官方描述搭建，页顶已注明。
- **头像是手绘 SVG。** 原版 canvas 动画头像属 Pro，拿不到；本复刻用 SVG 卡通脸 + CSS 眨眼代替。
- **聊天是本地 demo。** AI Chat 与 Multi-Agent Chat 发送后均为 canned 回复，不接模型；官方模板接真实 agent。
- **负责人头像是首字母彩色头像。** 原版用 randomuser.me 真人照片，沙箱 egress 代理连不上该站，已改成 BoardUI 首字母彩色头像。
- **未做暗色模式专项验收。** 亮色为默认与验收口径。

## 免费组件来源

- 本项目基于 BoardUI 免费仓库（BoardUI/boardui，MIT，2026-10-03 提交 ec5c5eb）搭建，组件在 `components/` 下，遵循 `AGENTS.md` 里的 BoardUI 设计规则（语义 token、复合排版工具类、`@/` 别名、Remixicon 图标）。
- 模板页的公开结构取自 boardui.com/templates/<slug> 的公开演示页（`tpl-pages/` 下是抓到的页面快照，仅作参考，不随应用发布）；Pro 清单取自 boardui.com/llms.txt 与 /r/registry-pro.json（40 项），见 `INVENTORY.md`。

## 目录

- `app/templates/` — 11 条模板路由 + 总览页
- `app/pro-components/` — 30 个 Pro 组件展示页（`/pro-components` 13 个非图表 + `/pro-components/charts` 17 张图表卡）
- `components/application/charts/` — 17 张图表卡组件；`components/application/pro/` — 13 个非图表 Pro 组件
- `components/application/template-shell/` — 模板外壳（Pro 导航 + 面包屑 + 标题 + 操作区）
- `app/dashboard/`、`app/page.tsx`（Chat）、`app/components/`、`app/login/`、`app/signup/` — 免费 starter 自带的页面
- `components/` — BoardUI 免费组件（base / application / foundations）
- `INVENTORY.md` — Pro 全部 40 项盘点清单
- `tpl-pages/` — 官网 10 个模板页的 HTML 快照（参考用）
- `shots/` — 各模板三档截图（1440/768/390）与交互证据
- `styles/`、`utils/`、`hooks/`、`public/` — 免费 starter 自带
