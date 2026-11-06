# BoardUI 10 套 Pro 模板 · 复刻版（Replica）

> **这不是官方原版。** BoardUI 的 10 套 Pro 模板是付费内容（Pro 一次性买断，1 年 €149 / 终身 €199 / 5 人团队 €349），源码不在免费仓库、不在公开 registry，无法免费获取。本项目是**用免费的 BoardUI 组件（MIT，已存档）+ mock 数据复刻**出来的 10 个页面，布局与官网演示尽量接近，供参考学习用。

## 跑起来

```bash
npm install
npm run dev      # 开发模式 http://localhost:3000
npm run build    # 生产构建
npm start        # 生产模式
```

技术栈：Next.js 16.3.3 + React 19.2.4 + Tailwind CSS v4 + React Aria + Recharts（与 BoardUI 免费 starter 一致）。

**构建状态（2026-11-06 已验证）：`npm run build` 通过，19 个路由全部生成，10 套模板路由逐个 curl 均为 200 且含关键内容；Dashboard 与 Multi-Agent Chat 已截图验过渲染（见 `shots/`）。Multi-Agent Chat 于 2026-11-06 晚按 1:1 像素级重做（见下节）。**

> 构建注意：上游 starter 用 `next/font/google` 加载 Inter / JetBrains Mono，沙箱构建环境连不上 Google Fonts 会导致 Turbopack 报错。本复刻已把字体改为系统栈（`--font-inter` / `--font-mono-source` 定义在 `styles/theme.css`，`app/layout.tsx` 不再引 `next/font/google`）。若在能联网的环境部署，可改回 `next/font/google` 恢复 Inter。

## 10 套模板与路由

| # | 模板 | 路由 | 官方原版 | 本复刻用的免费组件 |
|---|---|---|---|---|
| 1 | Dashboard | `/templates/dashboard` | boardui.com/templates/dashboard | TemplateShell、StatCards（footer）、RevenueChartCard、OrdersChartCard、DataTableExample、Avatar、Button |
| 2 | Project Board | `/templates/project-board` | boardui.com/templates/project-board | TemplateShell、Badge、Avatar、Button（Kanban 四列 + 9 张票据卡，mock 数据） |
| 3 | Marketing | `/templates/marketing` | boardui.com/templates/marketing | TemplateShell、StatCards（plain，自定义 4 项）、RevenueChartCard（Acquisition funnel 数据）、OrdersChartCard、漏斗条 |
| 4 | Calendar | `/templates/calendar` | boardui.com/templates/calendar | TemplateShell、Button、程序生成的 2026 年 8 月月历网格（8 月 1 日是周六，已按真实日历排布），事件 mock 数据 |
| 5 | Finance | `/templates/finance` | boardui.com/templates/finance | TemplateShell、StatCards（plain，自定义 4 项）、RevenueChartCard（Cash flow 数据）、Badge、支出分类条、交易列表 |
| 6 | Medical Profile | `/templates/medical-profile` | boardui.com/templates/medical-profile | TemplateShell、PatientInfoCard（免费，数据与原版一致）、ImportantAlertsCard（免费，数据与原版一致）、WeekRangePill、Recharts 步数柱状图、睡眠卡片 |
| 7 | AI Chat | `/templates/ai-chat` | boardui.com/templates/ai-chat | 直接渲染免费的 AgentChat（全功能聊天，demo 模式无需 API key；加 `AI_API_KEY` 可接真实模型） |
| 8 | AI Image Generation | `/templates/ai-image-generation` | boardui.com/templates/ai-image-generation | DashboardSidebar（AI 导航）、Tabs（Gallery / Styles）、next/image 网格；图片用免费 carousel 素材作占位，提示词与原版一致 |
| 9 | AI Profile | `/templates/ai-profile` | boardui.com/templates/ai-profile | TemplateShell、Avatar、Badge（PRO）、StatCards（plain，自定义 4 项）、Tabs（Weekly / Monthly / Yearly 切换数据）、RevenueChartCard（Activity）、Agent 卡片网格 |
| 10 | Multi-Agent Chat | `/templates/multi-agent-chat` | boardui.com/templates/multi-agent-chat | **1:1 像素级复刻（2026-11-06 晚重做，见下节）**：三栏聊天（260px 侧栏 + 弹性主区 + 360px 编辑器）、7 组对话原文逐字照抄、群聊空态、环形头像选择器、Voice 栏；头像为手绘 SVG 卡通脸（原版为 canvas 动画） |

另有总览页 `/templates`，列出 10 套模板的入口。

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
- **图片是占位。** AI Image Generation 的 7 张图用的是免费仓库里的 carousel 素材（floral、kitchen、seafood 等），不是官方生成的原图；提示词与原版一致。
- **数据是 mock。** 所有数字（营收、订单、步数、代币等）都是按官网演示页的公开数字写的占位数据，不接真实后端。
- **AI Chat 侧边栏不同。** 官方模板的侧边栏是 agent 工作区（New agent / Automations / Customize / Repositories + 对话列表），本复刻直接用了免费的 AgentChat，它的侧边栏是 starter 导航（Chat / Dashboard / Components / Sign in / Sign up）。聊天界面、composer、思考指示器、历史栏是同一个产品。
- **Multi-Agent Chat 已 1:1 重做。** 见上节；聊天仍是本地 demo（发送后 canned 回复，不接模型）。
- **Medical Profile 的两个卡片是免费原装。** PatientInfoCard 与 ImportantAlertsCard 是免费仓库里的组件，数据与官网原版一致（同一份 mock 数据）。
- **没有 Pro 专属组件。** 10 套模板里 Pro 才有的 30 个组件一律没用，只用了免费的 69 项。

## 免费组件来源

- 本项目基于 BoardUI 免费仓库（BoardUI/boardui，MIT，2026-10-03 提交 ec5c5eb）搭建，组件在 `components/` 下，遵循 `AGENTS.md` 里的 BoardUI 设计规则（语义 token、复合排版工具类、`@/` 别名、Remixicon 图标）。
- 模板页的公开结构取自 boardui.com/templates/<slug> 的公开演示页（`tpl-pages/` 下是抓到的页面快照，仅作参考，不随应用发布）。

## 目录

- `app/templates/` — 10 套模板路由 + 总览页
- `app/dashboard/`、`app/page.tsx`（Chat）、`app/components/`、`app/login/`、`app/signup/` — 免费 starter 自带的页面
- `components/` — BoardUI 免费组件（base / application / foundations）
- `components/application/template-shell/` — 本复刻新增的模板外壳（Pro 导航 + 面包屑 + 标题 + 操作区）
- `tpl-pages/` — 官网 10 个模板页的 HTML 快照（参考用）
- `styles/`、`utils/`、`hooks/`、`public/` — 免费 starter 自带
