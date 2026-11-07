# Marketing 模板缺口清单

- 原版依据：`tpl-pages/marketing.html`（原版 SSR HTML，282,628 字节）+ 线上页 `https://www.boardui.com/templates/marketing` 文本交叉核对
- 复刻依据：`app/templates/marketing/page.tsx`（875 行）+ 共享外壳 `components/application/template-shell/template-shell.tsx`、`components/application/dashboard/dashboard-sidebar.tsx`、`components/application/app-shell/notification-bell.tsx`
- 盘点时间：2026-11-07
- 方法：逐个解析原版 SSR 全部交互节点，按页面自上而下、从左到右对照复刻。SSR 只渲染初始态，所有弹窗/菜单/抽屉内容在 SSR 中均不出现（全文 `role=dialog/menu/listbox` 出现 0 次），这类内容一律记"待实测确认"，不编造。

## 元素总数 129 个

原版 SSR 共解析出 **129 个交互节点**（76 个 `<button>` + 24 个 `<a>` + 13 个 `<input>` + 13 个 `<select>` + 3 个 `role=tab` 的 div）。其中桌面端与移动端侧栏各一份副本，逻辑元素去重后约 117 个。

缺口统计：第一节 15 项（含 1 项复刻多余交互）、第二节 8 项、第三节 13 项。其中"待实测确认"项 6 项（原版行为 SSR 无法证明）。

---

## 第一节 可点击元素

### M-CLICK-1 周期切换按钮 x4 —— 缺失

- 位置与标识：获客漏斗卡片 "Last 30 days"、Spend by channel 卡片 "Last 30 days"、Ad spend vs ROAS 卡片 "This year"、Visitors 卡片 "This year"，均为 `<button aria-label="Change period" aria-expanded="false">`，点开应为周期选择菜单。
- 原版行为：点击展开周期选择菜单（菜单内容 SSR 未渲染，选项待实测确认）。
- 复刻现状：四处均为纯文本，无按钮、无 onClick，点不动。
- 差在哪里：4 个入口全部缺失，周期不可切换。

### M-CLICK-2 Sessions 卡片 "Show 2 more" 展开按钮 —— 缺失

- 位置与标识：Sessions 卡片底部居中浮动的 pill 按钮（`aria-label="Show 2 more"`，chevron-down 图标，`absolute left-1/2 bottom-1`）。
- 原版行为：点击展开/收起列表（具体初始可见行数、展开后多出哪 2 行，SSR 无法判定——5 行在 SSR 中全部渲染且无隐藏 class，待实测确认）。
- 复刻现状：无此按钮，5 行全部直接展示。
- 差在哪里：展开/收起交互缺失。

### M-CLICK-3 表格搜索框 "Search campaigns" —— 缺失

- 位置与标识：Campaigns 表格筛选区，`<input aria-label="Search campaigns" placeholder="Search">`。
- 原版行为：输入过滤 campaign（是否即时过滤、匹配名称还是多字段，待实测确认）。
- 复刻现状：无此输入框，整页没有按名称搜索 campaign 的入口。
- 差在哪里：搜索入口缺失。

### M-CLICK-4 行选择 checkbox（全选 + 每行）—— 缺失

- 位置与标识：表头 `<input type="checkbox" aria-label="Select all campaigns on this page">` + 每行一个（`aria-label="Select <campaign 名>"`），共 11 个，react-aria 自定义样式 checkbox。
- 原版行为：勾选行；选中后是否出现批量操作条，SSR 未渲染，待实测确认。
- 复刻现状：无任何 checkbox。
- 差在哪里：行选择能力全部缺失。

### M-CLICK-5 每行直接操作按钮 Delete / Edit —— 缺失

- 位置与标识：每行 Actions 列（列宽固定 140px）内两个图标按钮，`aria-label="Delete"` / `aria-label="Edit"`，常驻可见（class 中无 hover 才出现的透明控制）。
- 原版行为：点 Delete 直接删除该行；点 Edit 打开编辑（编辑界面 SSR 未渲染，待实测确认）。
- 复刻现状：无这两个按钮；删除/编辑只能先点 "···" 菜单再选。
- 差在哪里：两个一级入口缺失，删除/编辑多一次点击。

### M-CLICK-6 每行 "More actions" 菜单按钮 —— 内容未经核实

- 位置与标识：每行 Actions 列第三个按钮，`aria-label="More actions for <campaign 名>" aria-expanded="false"`。
- 原版行为：点击展开更多操作菜单；菜单有哪些项，SSR 未渲染，待实测确认。
- 复刻现状：有 "···" 按钮 + 下拉菜单，菜单内为 Edit campaign / Duplicate / Delete。
- 差在哪里：入口存在，但菜单内容未经核实；其中 Duplicate 一项无法确认原版是否有，Edit/Delete 与 M-CLICK-5 的直接按钮是两套入口，复刻只保留了菜单这一套。

### M-CLICK-7 三个筛选控件形态不同

- 位置与标识：Campaigns 表格上方，Channel / Objective / Spend 三个筛选器。原版为 react-aria Select：一个按钮触发器（显示当前值，如 "All channels"，`aria-expanded="false"`）+ 一个视觉隐藏的原生 `<select>`（选项含首个空选项 `''`，如 `['', 'All channels', 'Google Ads', 'Meta', 'X Ads', 'LinkedIn', 'Email', 'Referral']`）。
- 原版行为：点击触发器弹出 listbox 下拉选值；键盘导航按 react-aria 行为。
- 复刻现状：三个原生 `<select>`（`inputClass` 样式），无空选项。
- 差在哪里：筛选功能等价，但交互形态与视觉不同（弹层 vs 原生下拉），键盘行为也不同。

### M-CLICK-8 Delivery 状态控件形态不同

- 位置与标识：每行 Delivery 列。原版为按钮（显示当前值 Active/Paused/Draft，`aria-label="Delivery status for <campaign 名>"`）+ 隐藏原生 `<select>`（选项 `['', 'Active', 'Paused', 'Draft']`），即 react-aria Select。
- 原版行为：点击弹出下拉改状态。
- 复刻现状：原生 `<select>` 直接渲染在单元格内（带状态配色 class）。
- 差在哪里：改状态功能等价，但形态不同（弹出式下拉 vs 内联原生下拉）。

### M-CLICK-9 Filters 按钮 —— 行为未经核实

- 位置与标识：页头右侧 "Filters" 按钮（Filter3 图标），SSR 中无 `aria-expanded`。
- 原版行为：SSR 中筛选行默认可见；该按钮是开关筛选行显隐，还是打开更多筛选弹窗，SSR 无法证明，待实测确认。
- 复刻现状：做成筛选行显隐开关（`filtersOpen` 默认 true，点击切换，`aria-pressed`）。
- 差在哪里：复刻的开关行为未经核实，可能与原版不一致。

### M-CLICK-10 "New campaign" 按钮 —— 弹窗内容未经核实

- 位置与标识：页头右侧主按钮 "New campaign"（Add 图标）。
- 原版行为：点击后打开新建界面（弹窗/抽屉/表单字段），SSR 未渲染，待实测确认。
- 复刻现状：打开右侧抽屉编辑器 `CampaignEditor`（字段：Campaign name / Channel / Objective / Delivery / Spend (USD)，保存后插到表首）。
- 差在哪里：入口存在，但抽屉的字段、布局、保存行为是否与原版一致未经核实。

### M-CLICK-11 通知铃铛 —— 角标数字错、弹窗内容未经核实

- 位置与标识：页头铃铛按钮（`aria-label="Notifications" aria-expanded="false"`），角标数字为 **5**。
- 原版行为：点击打开通知中心；通知条目内容 SSR 未渲染，待实测确认。
- 复刻现状：角标数字为 **3**（`STARTER_NOTIFICATIONS` 仅 3 条未读）；弹窗内 5 条通知（Livia mentioned you、Workspace backup is ready、Review requested、API key rotated、Aspen mentioned you）为复刻自编内容。
- 差在哪里：角标 5 对 3，数字错误；弹窗内容未经核实。

### M-CLICK-12 面包屑链接跳转错

- 位置与标识：页头面包屑 "Board team"、"Mertcan"，原版均为 `<a href="/templates/dashboard">`。
- 原版行为：点击回到 Dashboard 模板页。
- 复刻现状：`TemplateShell` 中两项 `href="#"`。
- 差在哪里：点击无跳转（跳到页顶空锚）。

### M-CLICK-13 侧栏导航多出两项

- 位置与标识：左侧栏主导航。原版 9 项：Home、Project board、Marketing、Calendar、Finance、Medical Report、AI Chat、AI Image Generation、Profile。
- 原版行为：点哪项进哪套模板。
- 复刻现状：`DASHBOARD_NAV` 在 9 项之外多出 HR Management、Multi-Agent Chat 两项。
- 差在哪里：原版侧栏没有的两个入口，复刻多做了。

### M-CLICK-14 默认排序不一致

- 位置与标识：表格列头排序按钮 Campaign / Last updated / Spend（`aria-label="Sort by Campaign"` 等）。
- 原版行为：SSR 首屏 10 行顺序为 Jul 22, 2026 / Sep 16, 2026 / Dec 24, 2026 / Dec 08, 2026 / Oct 04, 2026 / Mar 23, 2026 / Aug 21, 2026 / Oct 24, 2026 / Mar 08, 2026 / Mar 01, 2026，即原始顺序，未按任何列排序；表头按钮无排序方向图标。
- 复刻现状：默认 `sortKey="date" sortDir="desc"`，首屏即按 Last updated 倒序（Dec 24 / Dec 08 / Oct 24 / Oct 04 / Sep 16 / Aug 21 / Jul 22 / Mar 23 / Mar 08 / Mar 01），且 Last updated 列头默认显示向下箭头。
- 差在哪里：打开页面第一眼的行顺序就与原版不同；排序按钮本身三项齐全，功能一致。

### M-CLICK-15 复刻多余交互：Donut 扇区与图例可点 —— 原版无此交互

- 位置与标识：Spend by channel 卡片的环形图与下方 4 行图例（Paid search / Paid social / Email / Affiliates）。
- 原版行为：环形图与图例行均为静态，无任何可点击节点（SSR 中该区域无 `<button>`，svg/circle/div 上也无 `cursor-pointer`）。
- 复刻现状：4 个扇区加 `onClick`（点击选中高亮、其余变暗），4 行图例做成 `<button aria-pressed>`（点击同样选中）。
- 差在哪里：原版没有的交互，复刻多做了；点的反应（高亮/变暗）也是复刻自创。

### 无缺口（本节抽查已对齐）

- 侧栏折叠/展开（Collapse sidebar，`aria-expanded`）、Quick Search 按钮（⌘L）、侧栏导航搜索框（`Filter template navigation`，placeholder "Search..."）+ 清除按钮、主题切换（Use light mode / Use dark mode 分段器）、Support / Settings 链接、团队菜单（Board team）与用户菜单（Mertcan Esmergul）按钮、移动端 Open navigation / Close navigation、通知铃铛按钮本身、Home 徽标 152。
- Sessions 三个 tab（Channels / Campaigns / Landing pages，`role=tab`，`aria-selected`），复刻为 `<button role="tab">`，切换功能一致（但后两个 tab 的内容数据见第三节 M-STAT-3）。
- 三个排序按钮、分页 Previous / 1–5 / … / 8 / Next（第 1 页时与原版一致；"…" 原版与复刻均为纯文本 span）。

---

## 第二节 其他交互

### M-INT-1 图表 hover：无 tooltip、表头切换为复刻自创

- 原版：三处图表均为 recharts（SSR 只渲染空容器 `<div class="recharts-responsive-container">`，图表客户端渲染）：ROAS 为 ComposedChart、Visitors 为 AreaChart、Spend by channel 环形图为第 3 个 recharts 容器（推断为 PieChart）。recharts 默认 hover 弹出 tooltip。
- 复刻现状：ROAS/Visitors 保留 recharts，但 `Tooltip content={() => null}`（tooltip 被置空，hover 不弹任何框），改为 hover 时切换卡片表头数值（显示悬停月份与当月数值）；环形图未用 recharts，改用自绘 SVG 圆环。
- 差在哪里：hover 时原版应有 tooltip，复刻没有；复刻的表头数值切换是否为原版行为，SSR 无法证明，待实测确认。

### M-INT-2 漏斗条动画：形状与颜色不同

- 原版：条形为 `absolute inset-y-0 start-0 rounded-lg transition-[width,background-color] duration-500 ease-out`，SSR 初始 `width:0`（挂载后展开到目标宽度），填充色为 `color-mix(in srgb, var(--color-chart-...) ...)`。
- 复刻现状：`transition-[width] duration-500`，但形状为 `rounded-full`、填充色固定 `bg-chart-2-active`，轨道为 `h-2.5 rounded-full bg-background-tertiary-default`。
- 差在哪里：动画时长一致；圆角（rounded-lg 对 rounded-full）与填充色不同。

### M-INT-3 Sessions 行条结构不同

- 原版：每行高 `h-9`，条形为行内绝对定位填充层（文字在条上层，按百分比填充背景）。
- 复刻现状：标签行 + 下方独立轨道条（`h-2` 轨道 + 百分比填充），两行式结构。
- 差在哪里：结构与视觉不同（文字上压填充条 vs 标签在上、轨道在下）。

### M-INT-4 键盘：弹窗/抽屉/菜单无 Esc 关闭

- 原版：⌘L / Ctrl+L 唤起 Quick Search（复刻一致）；弹窗与菜单为 react-aria 组件，默认支持 Esc 关闭（待实测确认）。
- 复刻现状：`app/templates/marketing/page.tsx` 全文无 `Escape` 处理——新建/编辑抽屉 `CampaignEditor`、行操作菜单均无 Esc 关闭；只有侧栏搜索框支持 Esc。
- 差在哪里：键盘 Esc 关闭缺失。

### M-INT-5 拖拽 —— 无缺口

- 原版全文 `draggable` 出现 0 次，全页无任何拖拽交互；复刻亦无拖拽。双方一致。

### M-INT-6 滚动联动 —— 无缺口

- 原版侧栏滚动区无 `backdrop-blur` 渐隐层，主内容区 `overflow-y-auto`；复刻同样无渐隐层、主内容区滚动一致。抽查无缺口。

### M-INT-7 输入框联想/过滤

- 原版：Quick Search 输入即时过滤导航（复刻一致）；Search campaigns 输入的过滤行为待实测确认。
- 复刻现状：Quick Search 一致；Search campaigns 入口缺失（见 M-CLICK-3），无从对照。
- 差在哪里：搜索 campaign 的输入过滤整体缺失。

### M-INT-8 开关/toggle —— 无缺口

- 本页无独立开关控件；主题切换为两个按钮组成的分段器（Use light mode / Use dark mode），复刻一致。

---

## 第三节 静态内容

### M-STAT-1 表格 10 行渠道全错（严重）

- 原版：渠道不以文字显示。每行名称前有一个 32px 圆角方块渠道图标（`size-8 rounded-lg bg-background-tertiary-default`），图标为各渠道品牌形（Meta 无限形、LinkedIn "in" 形等），`title` 属性即渠道名。10 行依次为：**Referral / Meta / LinkedIn / Referral / Referral / Referral / Referral / Meta / X Ads / Google Ads**。
- 复刻现状：名称下方加一行渠道文字，标注为 Meta / Google Ads / Meta / Email / X Ads / Google Ads / LinkedIn / Email / LinkedIn / Referral。
- 差在哪里：10 行渠道**全部不一致**；且原版无渠道文字，复刻多出一行渠道文字，图标也未做（复刻只写文字，无品牌图标）。

### M-STAT-2 漏斗卡片多出 "↓ x% convert" 行

- 原版：漏斗只有 4 步名称 + 数值（Visits 96.4K / Sign-ups 38.6K / Trials 14.1K / Customers 5.2K），全文 `convert` 出现 0 次，无任何转化率行。
- 复刻现状：每步之间插入 "↓ 40.0% convert"、"↓ 36.5% convert"、"↓ 36.9% convert" 共 3 行自算文字。
- 差在哪里：原版没有的 3 行文字，复刻多做。

### M-STAT-3 Sessions 后两个 tab 的内容为复刻自编

- 原版：SSR 只渲染 Channels 面板（Google Ads 39% / Meta 25% / X Ads 14% / LinkedIn 8% / Email 7%）；Campaigns、Landing pages 两个面板不在 SSR 中，其数据未知。
- 复刻现状：`SESSION_CAMPAIGNS`（Founder story video 31% / Holiday gift guide 24% / Newsletter promo 18% / Webinar signups 15% / Spring launch 12%）与 `SESSION_PAGES`（/pricing 32% / /features 24% / /blog 18% / / 14% / /templates 12%）均为自拟数值。
- 差在哪里：两个 tab 的内容数据无来源，待实测核对（可能对、可能错，现状是未经核实）。

### M-STAT-4 表格上方多出一行提示文字

- 原版：表格区只有 "Total Results 80 campaigns"，无其他说明行。
- 复刻现状：多出一行 "Page 1 of 8 · click a column header to sort"。
- 差在哪里：原版没有的提示文字。

### M-STAT-5 表格结构不同

- 原版：div 弹性布局（非 `<table>`），Campaign 列 `flex-[1.4]`，Actions 列固定宽 `w-[140px]`。
- 复刻现状：原生 `<table>`，`min-w-[720px]`。
- 差在哪里：布局实现不同，最终视觉需截图逐项核对。

### M-STAT-6 通知角标数字错

- 原版 5，复刻 3。见 M-CLICK-11。

### M-STAT-7 Sessions 卡片头部结构/样式不同

- 原版：react-aria TabList，tab 行为横向可滚动行（`overflow-x-auto [scrollbar-width:none]`），右侧有大写 caption "SESSIONS"（`text-caption-1-medium tracking-[0.06em] uppercase`）；选中 tab 为 accent 色文字。
- 复刻现状：圆角 pill 容器（`rounded-full bg-background-tertiary-default`）内放三个按钮 tab，左侧为 "Sessions" 普通文本。
- 差在哪里：头部结构与视觉不同。

### M-STAT-8 Spend by channel 环形图实现不同（数值无缺口）

- 数值一致：Paid search $11,400 / Paid social $7,620 / Email $3,180 / Affiliates $2,680，中心 "46% Paid search"。
- 差在哪里：原版环形图为 recharts（第 3 个 recharts 容器，客户端渲染），复刻为自绘 SVG 圆环；图例行原版为静态 div，复刻为按钮（见 M-CLICK-15）。数值对，实现不对。

### M-STAT-9 图表区高度不同，需截图核对

- 原版：ROAS 与 Visitors 图表区固定 `h-[196px]`；环形图区 `flex-1`（移动端最小 180px）。
- 复刻现状：两张图表卡片总高固定 `h-[344px]`，图表区 `flex-1` 自适应。
- 差在哪里：高度实现不同，最终视觉需截图核对。

### M-STAT-10 KPI 卡片 —— 无缺口

- Ad spend $24,380 +8.4%、Impressions 1.94M +12.6%、Conversions 1,286 +5.2%、Cost per click $1.24 -3.1%，四组标签/数值/涨跌幅与原版一致。（卡片图标未在 SSR 文本层逐项核对。）

### M-STAT-11 其余数值一致 —— 无缺口

- 漏斗 96.4K / +5.8% / Last 30 days；Spend by channel $24,880 / +8.4% / Last 30 days；ROAS 卡片 "Ad spend · ROAS 3.6x" / $217.7K / +9.4% / This year / "Ad spend · total $217.7K" / "ROAS · average 3.6x"；Visitors 134,400 / +8.8% / This year / Organic 74,500 / Paid 38,500 / Social 21,400；表头 Campaign / Delivery / Objective / Last updated / Spend / Actions；10 行名称/状态/目标/日期/花费一致；"Total Results 80 campaigns"；分页 1–5 / … / 8 一致。

### M-STAT-12 图片 —— 无缺口

- 原版整页仅 2 张图，均为 `/brand/boardui_logo_circle.webp`（Board team，桌面端与移动端侧栏各一）；复刻团队菜单同样用该图。

### M-STAT-13 漏斗条形状/颜色

- 见 M-INT-2：原版 `rounded-lg` + color-mix 填充；复刻 `rounded-full` + `bg-chart-2-active`。

---

## 待实测确认清单（需真机/浏览器实测，原版 SSR 无法证明）

1. 4 个 "Change period" 按钮点开的周期菜单选项（M-CLICK-1）。
2. "Show 2 more" 初始可见行数与展开后内容（M-CLICK-2）。
3. "Search campaigns" 的过滤行为（M-CLICK-3）。
4. 行 checkbox 选中后是否出现批量操作条及其内容（M-CLICK-4）。
5. 每行 Edit 点开的编辑界面、"More actions" 菜单的全部选项（M-CLICK-5/6）。
6. Filters 按钮的真实行为（M-CLICK-9）。
7. "New campaign" 点开的新建界面字段与布局（M-CLICK-10）。
8. 通知弹窗的条目内容（M-CLICK-11）。
9. Sessions 的 Campaigns / Landing pages 两个 tab 的真实数据（M-STAT-3）。
10. 图表 hover 是否弹出 tooltip、hover 是否改表头数值（M-INT-1）。
11. 弹窗/菜单是否支持 Esc 关闭（M-INT-4）。
12. 团队菜单、用户菜单点开后的内容（共享外壳，SSR 未渲染）。

---

## 修复结论（2026-11-07 本轮修复）

本次只改 `app/templates/marketing/page.tsx`，未动共享外壳与其他模板。

### 已修

- **M-STAT-1 表格渠道全错**：10 行渠道值按原版 SSR 顺序改回 Referral / Meta / LinkedIn / Referral / Referral / Referral / Referral / Meta / X Ads / Google Ads（证据：`tpl-pages/marketing.html` 中 10 个渠道图标 `title` 属性依次出现）；名称下方的渠道文字行删除，改为原版样式的 32px 圆角方块图标 + `title`（Remix 品牌图标：Referral=RiGlobalLine、Meta=RiMetaFill、LinkedIn=RiLinkedinFill、X Ads=RiTwitterXFill、Google Ads=RiGoogleFill；70 行生成数据里的 Email 用 RiMailLine）。
- **M-CLICK-1 周期切换按钮 x4**：漏斗 / Spend by channel 两处 "Last 30 days" 与 ROAS / Visitors 两处 "This year" 纯文本，改为 `aria-label="Change period"` 的按钮（日历图标 + 当前周期文字 + chevron，带 `aria-expanded`），点开下拉菜单选周期后更新显示。菜单选项内容 SSR 未渲染，选项（Last 7 days / Last 30 days / Last 90 days / This year）为暂拟，**需实测核对原版菜单选项**。
- **M-CLICK-2 "Show 2 more"**：Sessions 卡片加相对定位 pill 按钮（`aria-label="Show 2 more"`，`absolute left-1/2 bottom-1`，chevron-down 图标，与原版 class 一致）；默认显示 Channels 前 3 行，点开展示全部 5 行，按钮变为 "Show less"（chevron 上翻）。初始可见行数 SSR 无法证明（SSR 中 5 行全部渲染且无隐藏 class），3 行是按"5 行 − 2 more"推断，**需实测核对**。
- **M-CLICK-3 搜索框**：表格区 Total Results 下方加搜索框（搜索图标 + `<input aria-label="Search campaigns" placeholder="Search">`），输入即时按 campaign 名称过滤（大小写不敏感），输入时重置到第 1 页。匹配范围（仅名称还是多字段）SSR 无法证明，**需实测核对**。
- **M-CLICK-4 行选择 checkbox**：表头加全选 checkbox（`aria-label="Select all campaigns on this page"`，半选时 indeterminate）+ 每行一个（`aria-label="Select <campaign 名>"`），共 11 个。选中后是否出现批量操作条 SSR 未渲染，本次未加批量条，**待实测确认**。
- **M-CLICK-5 每行 Delete / Edit**：Actions 列加常驻 Delete 图标按钮（`aria-label="Delete"`，点即删除该行）与 Edit 图标按钮（`aria-label="Edit"`，点开编辑抽屉）；原有 "···" 按钮保留，`aria-label` 按原版改为 "More actions for <campaign 名>"。
- **M-CLICK-14 默认排序**：`sortKey` 初始值由 `"date"` 改为 `null`，首屏恢复原版原始顺序（Jul 22 / Sep 16 / Dec 24 / Dec 08 / Oct 04 / Mar 23 / Aug 21 / Oct 24 / Mar 08 / Mar 01），列头无默认排序箭头；点击列头后才排序。
- **M-STAT-2 漏斗**：删除 3 行自算的 "↓ x% convert" 文字。
- **M-CLICK-15 Donut**：删除扇区 `onClick` 与选中高亮/变暗逻辑，扇区改为静态圆环；下方 4 行图例由 `<button aria-pressed>` 改为静态 div，删除 hover 背景与点击行为。
- **M-STAT-4**：删除表格上方多出的 "Page 1 of 8 · click a column header to sort" 提示行。
- **M-STAT-3 Sessions**：删除 `SESSION_CAMPAIGNS` / `SESSION_PAGES` 两组自编数值；Campaigns / Landing pages 两个 tab 改为"待实测：原版 SSR 只渲染 Channels 面板，此面板数据需真机核对后补"的提示，不再编数值。
- **M-INT-1 tooltip**：ROAS 与 Visitors 两处图表删除 `Tooltip content={() => null}`，恢复 recharts 默认 tooltip。hover 时切换卡片表头数值的行为保留（SSR 无法证明是否为原版行为，**待实测确认**）。
- **M-INT-4 Esc**：页面级 Escape 监听，关闭新建/编辑抽屉、行操作菜单、周期选择菜单。

### 未修（本次任务范围外或修不了）

- M-CLICK-6 "More actions" 菜单内容（Duplicate 一项原版是否有）SSR 未渲染，**需实测**；本次只改了按钮的 `aria-label`，菜单项未动。
- M-CLICK-7/8 筛选器与 Delivery 状态控件形态（原生 select vs 原版 react-aria 弹出式下拉）、M-STAT-5 表格结构（原生 `<table>` vs 原版 div 弹性布局）、M-STAT-7 Sessions 头部结构、M-STAT-8 环形图实现（自绘 SVG vs 原版 recharts PieChart）、M-STAT-9 图表区高度、M-INT-2 漏斗条圆角/颜色、M-INT-3 Sessions 行条结构：实现形态差异，不在本次任务的修复清单内，未动。
- M-CLICK-9 Filters 按钮行为、M-CLICK-10 "New campaign" 抽屉字段、M-CLICK-11 通知角标（原版 5 对复刻 3）与通知弹窗内容：前两项 SSR 无法证明，**需实测**；通知角标与弹窗内容在共享组件 `notification-bell.tsx`，属另一组范围，未动。
- M-CLICK-12 面包屑 `href="#"`、M-CLICK-13 侧栏多出 HR Management / Multi-Agent Chat 两项：均在共享外壳（`template-shell.tsx` / `dashboard-sidebar.tsx`），属另一组范围，未动。
- M-STAT-6 通知角标数字错：同 M-CLICK-11，共享组件范围，未动。
