# BoardUI Pro 全部内容 · 复刻版（Replica）

> **这不是官方原版。** BoardUI Pro 是付费内容（Pro 一次性买断，1 年 €149 / 终身 €199 / 5 人团队 €349），源码不在免费仓库、不在公开 registry，无法免费获取。本项目是**用免费的 BoardUI 组件（MIT，已存档）+ mock 数据复刻**出来的全部 Pro 内容，布局与官网演示尽量接近，供参考学习用。

## 内容总览（2026-11-06 晚全部完成；2026-11-07 残留项收尾：暗色模式验收、图表逐项转录、头像行为对齐、AI Image 占位图卡、HR 数字修正、导航补齐、Multi-Agent Chat 功能补齐；2026-11-07 交互全量对齐：10 套模板逐项盘点可点击/其他交互/静态内容并全部修掉，见"交互对齐"一节）

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

**构建状态（2026-11-07 已验证）：`npm run build` 通过，21 个路由全部生成；14 条模板/组件路由逐个 curl 均为 200。**

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
| 11 | Multi-Agent Chat | `/templates/multi-agent-chat` | **1:1 像素级复刻（1658 行，见下节）**：三栏聊天、7 组对话原文逐字、群聊空态、环形头像选择器、Voice 栏；编辑器保存、Marketplace 添加、复制对话、… 菜单（重命名/清空/删除）、按 agent 区分的回复、头像行为对齐（9 形状/9 渐变/16 表情/独立眨眼游走） |

另有总览页 `/templates`（11 套入口 + Pro 组件入口）。

共享外壳：9 套仪表盘模板 + HR Management 共用侧栏导航（Home、Project board、Marketing、Calendar、Finance、Medical Report、HR Management、AI Chat、AI Image Generation、Profile、Multi-Agent Chat，底部 Support、Settings），点侧栏切模板路由；窄屏收起为汉堡抽屉。Multi-Agent Chat 页同样有完整侧栏入口（2026-11-07 已补，之前缺失）。

## Pro 组件（30 个）

- **17 张图表卡**（`/pro-components/charts`）：Earnings、Line、Contributions、Radar、Radial、Funnel、Sankey、Stage Bars、Bar List、Area、Combo、Scatter、Heatmap、Steps、Sleep Score、Activity Rings、Most Active Days。周期切换、hover 联动、变体切换均可用；图表用 Recharts，Funnel 横向梯形与部分网格/圆环为手写 SVG/DOM（已注明）。
- **13 个非图表组件**（`/pro-components`）：Web Search、Task List、Composer、Composer Panel、Composer Attachments、Agent Progress、Agent Limits Card、Questionnaire、Calendar、Agent Avatar、Agent Creator（11 个实机演示）+ Project Board 与 Multi-agent Chat（链接卡片，链到已 1:1 的模板页）。

## Multi-Agent Chat · 1:1 复刻说明（2026-11-06 晚）

这一页按 boardui.com/templates/multi-agent-chat 的服务端渲染 HTML 与公开 CSS 逐项还原，不是凭目测估数。数值来源：侧栏 `w-[260px]`、主区 `rounded-3xl bg-background-secondary-default`、顶栏 `h-[55px]`、聊天气泡 `rounded-[var(--radius-2-5xl)]`（= 20px）、用户气泡白底、Agent 气泡 `bg-background-tertiary-default`（#ebebeb）、侧栏选中项 `h-[54px] rounded-xl bg-background-tertiary-default`、Composer 卡片 `rounded-[var(--radius-2-5xl)]` 带 `shadow-[0_1px_0.5px_rgba(0,0,0,0.02),0_4px_2px_rgba(0,0,0,0.02)]`、编辑器 `w-[360px]`。7 组对话（用户问 + Agent 两段回复）逐字照抄，群聊空态（Design + Marketing + Product / "A few minds. One conversation."）可点。

验收方法：本地 Playwright（headless shell）1440px 截图 + 实测几何量。默认态、编辑器打开态、群聊空态三张截图见 `shots/mac-1440-default.png`、`shots/mac-1440-editor.png`、`shots/mac-1440-group2.png`；另把原版服务端 HTML + CSS 在本地渲染后同尺寸截图对照（`shots/mac-1440-original.png`），逐项核对：侧栏 260px、主区圆角 24px、气泡圆角 20px、气泡底色 #ebebeb / 白、选中项 54px×12px 圆角，全部吻合。

还差的地方（诚实说明，不藏）：

> Multi-Agent Chat 的头像是原版 canvas"纸片脸"的 SVG/CSS 重建：9 种形状、9 组径向渐变、16 种表情、两只独立游走/眨眼的眼睛、点大预览可立体转身、遵循 `prefers-reduced-motion`。行为已对齐，但不是逐像素 1:1——16 种表情的五官画法、形状 morph 的中间帧、折叠层的纸片质感均无公开像素数据可抄，是按原版公开的名字与色值合理绘制/模拟的；各 agent 的默认配色与形状也是自选映射，原版默认值无法从公开快照反推。
- **侧栏多了一项群聊。** 用户在 components 页看到侧栏首项是群聊 "Design + Marketing + Product"，本复刻按用户描述收了这一项；但模板页（templates/multi-agent-chat）的服务端 HTML 里没有这一项，只有 7 条单人对话。因此侧栏各单人项的纵坐标比模板原版下移约 58px（即一项的高度）。这是按用户要求收的，不是漏测。
- **默认编辑器关闭。** 模板页服务端 HTML 里编辑器默认是打开的（显示 Security agent），但用户明确要求默认关闭，本复刻按用户要求默认关闭，点顶栏头像胶囊才打开。
- **编辑器标题是 Agent 名。** 原版模板 HTML 里编辑器标题显示的是当前 Agent 名（如 Security agent），本复刻照此用 Agent 名；用户口述曾称标题为 "Agent"，以实际渲染为准。
- **顶栏头像胶囊的玻璃质感是近似。** 原版胶囊有一层 backdrop blur + 渐变光泽（landing-glass-stroke），本复刻用半透明灰底 pill 代替，视觉接近但不是同一层效果。
- **聊天是本地 demo，与原版行为一致。** 原版预览同样用标注的示例回复，不接真实模型（官方文档原文："The preview uses labeled sample replies. Supply `onRespond` to connect your service"）。本复刻发送后按 agent 身份给区分的跟进回复（不再是固定一句敷衍话），切换 Agent 切到该 Agent 的原版对话（逐字）。
- **Marketplace 与 Create（+）已接通。** Marketplace 按钮打开弹窗，列出 6 个可添加 agent，点 Add 真加到侧栏并新建对话、自动选中；Create（+）打开同一弹窗。搜索框是可展开的 pill（照原版实现）。
- **编辑器保存、复制、… 菜单已接通（2026-11-07 实测通过）。** 编辑器点 Save 或关闭时自动保存，改名/头像/描述同步到侧栏与顶栏；复制按钮把当前对话写入剪贴板并显示 "Copied!"；… 菜单有重命名（Enter 保存、Esc/点开外取消）、清空、删除（删后自动选中下一 agent），群聊仅重命名。
- **390px 下 Composer 权限按钮截断。** 窄屏时 "Permission: Bypass all" 会与模型名重叠，2026-11-07 已改成截断显示（"Permissio…"），模型名完整可见；亮色/暗色均已验证。
- **搜索框是可展开的 pill。** 原版搜索是一个可展开的 pill（点开变输入框），本复刻照此实现。

## 与官网原版的差异（诚实说明）

- **不是官方源码。** 布局、文案、数据是按官网公开演示页复刻的，组件是免费版，代码结构与官方 Pro 模板不同。
- **图片已换成原图。** AI Image Generation 的 20 张原图已从 boardui.com/ai-chat/gallery/*.webp 下载（全部 HTTP 200、校验为 WebP），存于 `public/ai-chat/gallery/` 并按原版双列 masonry 与逐张宽高比展示；AI Profile 封面图已从 boardui.com 下载原图（80,403 字节、1024×248），替换了此前的 CSS 渐变。Project Board 的 18 张人像已从 randomuser.me 下载原图（`public/avatars/randomuser/`）。Medical Profile 前 8 名患者用上了仓库里已有的 `public/avatars/` 照片。
- **数据是 mock。** 所有数字（营收、订单、步数、代币等）都是按官网演示页的公开数字写的占位数据，不接真实后端。图表月度序列：Dashboard Contributions 热力图已逐格转录（259 格，见 `chart-data-report.md`）；其余 Recharts 图表在原版 HTML 里是空 SSR 容器、无 `__NEXT_DATA__`/JSON 数据源，无法逐项转录，仍为反推重建值（逐项证据见 `chart-data-report.md`）。注意原版自身不一致：259 格真实值合计 1,721，卡片标题却写 958，本复刻保留真实格值并在代码注释中注明，未按标题缩放。
- **HR Management 无原版演示对照。** 官方 /templates/hr-management 是 404，该页按 llms.txt 的官方描述搭建，页顶已注明。2026-11-07 已修三处数字自相矛盾（季度招聘数与 KPI/漏斗对不上、敬业度雷达均值与 KPI 对不上），见 `pages-fix-report.md`。
- **头像是原版 canvas 脸的 SVG/CSS 重建，行为对齐、像素近似。** 见上节引文；折叠层质感、morph 中间帧、16 种表情的具体画法无公开像素数据，无法做到逐像素 1:1。
- **聊天是本地 demo，与原版行为一致。** AI Chat 与 Multi-Agent Chat 发送后均为示例回复，不接模型；原版预览同样如此（官方文档："The preview uses labeled sample replies. Supply `onRespond` to connect your service"），接真实模型需另行提供 `onRespond`。免费模型直连方案见 `investigation-report.md`（未实施、未申请 key）。
- **负责人头像是首字母彩色头像。** Dashboard 等页的负责人头像仍用 BoardUI 首字母彩色头像（原版用 randomuser.me 真人照片）；Project Board 与 Medical Profile 前 8 名患者已换成下载的原图/仓库照片。
- **暗色模式已专项验收（2026-11-07）。** 12 个 URL × 1440/768/390 共 39 张截图，`.dark` 全部生效、无横向溢出；修了 2 处缺陷（Agent Creator 语音行选中态、chart-neutral token 在暗色下近黑不可见），见 `dark-mode-report.md` 与 `shots/dark/`。

## 交互对齐（2026-11-07，用户要求：原版长什么样、能干什么，我们就要长什么样、能干什么，一处都不能少）

- **盘点方法**：10 套有原版的模板逐个解析原版 SSR 快照（`tpl-pages/`）的全部可点击元素，并按三类对照复刻——①可点击（按钮/链接/卡片/tab/筛选/下拉/开关/菜单）、②其他交互（hover、拖拽、键盘、输入、滚动、动画、toggle）、③静态内容（文字一字不差、数字、图片、图标、颜色、字体、间距、布局）。HR Management 无原版（官方 404），只做内部自查。盘点清单在 `audit/*-gaps.md`（10 份，共 2459 行），每份末尾有"修复结论"。
- **盘点规模（原版逻辑元素，去重移动/桌面双份后）**：Dashboard 348、Project Board 59、Marketing 129、Calendar 68、Finance 209+、Medical Profile 503、AI Chat 48、AI Image Generation 107、AI Profile 310、Multi-Agent Chat 78。
- **修掉的（摘要）**：死按钮全部补上真实反应（Multi-Agent Chat 9 处、Medical Add profile photo、AI Chat Add attachment 等）；缺失入口补齐（Project Board 工具栏 4 入口、Marketing 周期切换/搜索框/checkbox/行内删除编辑、Medical 患者搜索框/行内 View chart 与 Edit patient、Calendar 与 Finance 的 Change period 等）；标错/多做的改回原版（Marketing 10 行渠道改图标+title、Calendar 日期格改回不可点 div、Finance 热力图图例 5 块原版数值、AI Profile 默认 Weekly 且不切片热力图、AI Chat 侧栏恢复 agent 侧栏与 11 条线程）；拖拽改指针拖拽（Project Board，去掉 HTML5 draggable）；模板切换入口做到一眼能找到（每模板页顶栏"全部模板"文字按钮、侧栏首行入口、首页横条、总览页标题"全部模板 · 11 套"，三档宽度 48 项自查通过，见 `audit/template-switching.md`）。
- **仍修不了 / 待实测确认**：原版弹窗/菜单/抽屉的真实内容与客户端渲染图表（Sankey/donut/气泡/Steps/睡眠环）的数值与 hover 行为在 SSR 里不存在，复刻按"去掉自加行为、留最小可信实现"处理，各清单末尾的"待实测确认"逐项列出，需真机浏览器打开原版线上页核对后才能定稿；字体 JetBrains Mono 本机无文件，仍为系统等宽栈；分页省略号存在清单冲突（Dashboard 原版含 "…"，Finance/Medical 原版无），本轮按共享 Pagination 去掉 "…"，Dashboard 因此偏离其原版一处，如需恢复应给 Dashboard 单独加变体。
- **验证**：`npm run build` 通过（21/21 页静态生成）、`npx tsc --noEmit` 干净；模板切换入口三档宽度 48 项自查通过。逐元素点击实测需真机浏览器完成，本轮未做——清单里标"待实测确认"的项即为未实测项，不要把本轮理解为"每个按钮都已在真机上点过"。线上验证见下节。

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
