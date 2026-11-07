# Calendar 模板缺口清单

- 原版依据：`tpl-pages/calendar.html`（原版 SSR HTML，184,253 字节）+ 线上页 `https://www.boardui.com/templates/calendar` 文本交叉核对
- 复刻依据：`app/templates/calendar/page.tsx`（564 行）+ 共享外壳 `components/application/template-shell/template-shell.tsx`、`components/application/dashboard/dashboard-sidebar.tsx`、`components/application/app-shell/notification-bell.tsx`
- 盘点时间：2026-11-07
- 方法：逐个解析原版 SSR 全部交互节点，按页面自上而下、从左到右对照复刻。SSR 只渲染初始态，所有弹窗/菜单内容在 SSR 中均不出现（全文 `role=dialog/menu/listbox` 出现 0 次），这类内容一律记"待实测确认"，不编造。

## 元素总数 68 个

原版 SSR 共解析出 **68 个交互节点**（43 个 `<button>` + 24 个 `<a>` + 1 个 `<input>`）。其中桌面端与移动端侧栏各一份副本，逻辑元素去重后约 50 个。43 个按钮的构成：侧栏相关约 15 个（含移动端副本）、页头 5 个（Open navigation、Notifications、Inbox、Previous month、Next month、New event，另加月份中心按钮）、事件 chip 23 个。

缺口统计：第一节 12 项（含 4 项复刻多余交互/区块）、第二节 5 项、第三节 7 项。其中"待实测确认"项 5 项（原版行为 SSR 无法证明）。

---

## 第一节 可点击元素

### C-CLICK-1 日期格不可点 —— 复刻把 42 个格子全做成按钮（多余交互）

- 位置与标识：月历 42 个日期格（2026 年 7 月 26 日–9 月 5 日，6 行 x 7 列）。
- 原版行为：日期格为普通 `<div>`（`relative flex h-full flex-col overflow-hidden ...`），无 `<button>`、无 `cursor-pointer`、无选中态；点日期格无任何反应。
- 复刻现状：每个格子都是 `<button onClick={() => setSelectedKey(cell.key)}>`，点击设选中并出现 `ring-2 ring-inset ring-accent-500` 选中圈。
- 差在哪里：原版没有的交互，复刻多做；还多出一个原版没有的"选中日期"状态。

### C-CLICK-2 "Selected day" 整区为复刻自创 —— 多余区块

- 位置与标识：复刻在日历下方加的区块，标题为选中日期（如 "Sunday, August 2, 2026"）+ "N events"，下方每行一个事件按钮。
- 原版行为：SSR 中无此区域、无对应内容；原版页面在日历下方没有任何"选中日期"区。
- 复刻现状：有该区；每行事件按钮点击打开详情弹窗。
- 差在哪里：原版没有的整个区块，复刻多做。

### C-CLICK-3 "+2 more" 为纯文本，且 8 月 20 日应显示 4 个 chip

- 位置与标识：8 月 20 日格内，4 个事件 chip 上方的 "+2 more"。
- 原版行为："+2 more" 是普通 `<span>`（`text-[10px] font-medium text-text-secondary`），不可点；4 个事件 chip（Stand-up 11:30 / Team lunch 13:00 / Portfolio review 14:30 / 1:1 sync 16:30）全部可见。
- 复刻现状：只显示前 2 个 chip，"+2 more" 做成 `role="button"` 可点元素，点击后选中该日并打开当天第一个事件的详情。
- 差在哪里：chip 数量 4 对 2；"+2 more" 的可点性与点击行为均为复刻自创。

### C-CLICK-4 "Today · Aug 2026" 按钮 —— 原版无此按钮（多余入口）

- 位置与标识：复刻在月份切换器右侧的胶囊按钮 "Today · Aug 2026"。
- 原版行为：SSR 中无此按钮；原版月份切换器行只有 Previous month / 中心按钮 / Next month，右侧是 "New event"。
- 复刻现状：有此按钮，点击回到 2026 年 8 月并选中 8 月 2 日。
- 差在哪里：原版没有的入口，复刻多做。

### C-CLICK-5 月份切换器中心按钮 —— 点开什么待实测确认

- 位置与标识：月份切换器中心按钮，移动端显示 "Aug"、桌面端显示 "August 2026"（`flex-1 cursor-default ... sm:cursor-pointer`，无 `aria-expanded`）。
- 原版行为：点击后出现什么，SSR 未渲染，待实测确认（是否展开月份/年份选择器未知）。
- 复刻现状：点击展开选择器（12 个月缩写 + 上一年/下一年切换 + 当前月高亮）。
- 差在哪里：选择器本身是否与原版一致未经核实。

### C-CLICK-6 事件 chip —— 入口一致，点开后的详情待实测确认

- 位置与标识：23 个事件 chip，均为 `<button>`（标题 + 时间，如 "Coffee 09:30"、"Payday" 全天无时间）。
- 原版行为：点击 chip 出现什么（详情弹窗/抽屉、字段、操作按钮），SSR 未渲染，待实测确认。
- 复刻现状：chip 为 `role="button"` 的 span（带 Enter/Space 键盘处理），点击打开详情弹窗（含色点、标题、日期、"{time} – 1 hour"、Delete event、Done 按钮）。
- 差在哪里：入口存在且 23 个 chip 齐全；但详情弹窗的内容、字段、操作是否与原版一致未经核实（弹窗内 "– 1 hour" 见 C-STAT-4）。

### C-CLICK-7 "New event" 按钮 —— 新建表单待实测确认

- 位置与标识：页头右侧主按钮 "New event"（Add 图标）。
- 原版行为：点击后打开的新建界面（字段与布局），SSR 未渲染，待实测确认。
- 复刻现状：打开新建弹窗（字段：Title 输入框 / Date 日期框 / Time 时间框 / All day checkbox / Colour 5 色圆点；标题框 Enter 提交；Add event 保存）。
- 差在哪里：入口存在；表单字段与行为是否为原版所有未经核实。

### C-CLICK-8 Inbox 按钮 —— 收件箱内容待实测确认

- 位置与标识：页头铃铛旁的 Inbox 图标按钮（`aria-label="Inbox"`，无角标）。
- 原版行为：点击后打开的收件箱内容，SSR 未渲染，待实测确认。
- 复刻现状：点击弹出 "Inbox / Upcoming events from August 2026" 列表（取当月起 5 条事件，点击某条打开详情并选中其日期）。
- 差在哪里：入口存在；弹窗内容与条数是否与原版一致未经核实。

### C-CLICK-9 月份前后 chevron —— 无缺口

- 原版 Previous month / Next month 按钮，复刻一致（`shiftMonth(±1)`，切换后关闭选择器）。

### C-CLICK-10 通知铃铛 —— 角标数字错、弹窗内容未经核实

- 位置与标识：页头铃铛按钮（`aria-label="Notifications" aria-expanded="false"`），角标数字为 **5**。
- 原版行为：点击打开通知中心；通知条目内容 SSR 未渲染，待实测确认。
- 复刻现状：角标数字为 **3**（`STARTER_NOTIFICATIONS` 仅 3 条未读）；弹窗内 5 条通知为复刻自编内容（与 Marketing 页同一共享组件，问题相同）。
- 差在哪里：角标 5 对 3，数字错误；弹窗内容未经核实。

### C-CLICK-11 面包屑链接跳转错

- 位置与标识：页头面包屑 "Board team"、"Mertcan"，原版均为 `<a href="/templates/dashboard">`。
- 原版行为：点击回到 Dashboard 模板页。
- 复刻现状：`TemplateShell` 中两项 `href="#"`。
- 差在哪里：点击无跳转（跳到页顶空锚）。与 Marketing 页同一问题。

### C-CLICK-12 侧栏导航多出两项

- 位置与标识：左侧栏主导航。原版 9 项：Home、Project board、Marketing、Calendar、Finance、Medical Report、AI Chat、AI Image Generation、Profile。
- 复刻现状：`DASHBOARD_NAV` 在 9 项之外多出 HR Management、Multi-Agent Chat 两项。
- 差在哪里：原版侧栏没有的两个入口，复刻多做了。与 Marketing 页同一问题。

### 无缺口（本节抽查已对齐）

- 侧栏折叠/展开、Quick Search（⌘L）、侧栏导航搜索 + 清除、主题切换（Use light mode / Use dark mode）、Support / Settings、团队/用户菜单按钮、移动端 Open/Close navigation、通知铃铛按钮本身、月份前后 chevron、New event 与 Inbox 按钮本身、23 个事件 chip 的存在。
- 团队菜单、用户菜单点开后的内容 SSR 未渲染，待实测确认（共享外壳）。

---

## 第二节 其他交互

### C-INT-1 hover：日期格 hover 态为复刻多做；chip hover 一致

- 原版：事件 chip 有 `hover:brightness-95` + `transition-[filter] duration-150`（复刻一致）；日期格为不可点 div，无 hover 态。
- 复刻现状：chip hover 一致；日期格按钮带 hover/focus ring（多余，因原版格子不可点）。
- 差在哪里：日期格 hover 态为复刻多做。

### C-INT-2 键盘：弹窗无 Esc 关闭；日期格多出 42 个 Tab 停靠点

- 原版：事件 chip 是原生 `<button>`，Enter/Space 天然可用；日期格不可聚焦；弹窗/菜单为 react-aria 组件，默认支持 Esc 关闭（待实测确认）。
- 复刻现状：chip 用 span + `onKeyDown` 支持 Enter/Space（效果等价）；但事件详情弹窗与新建弹窗均无 `Escape` 处理（`app/templates/calendar/page.tsx` 全文无 `Escape`）；新建标题框支持 Enter 提交（原版是否如此未知）；42 个日期格按钮全部可 Tab 聚焦。
- 差在哪里：弹窗 Esc 关闭缺失；Tab 顺序比原版多出 42 个停靠点。

### C-INT-3 拖拽 —— 无缺口

- 原版全文 `draggable` 出现 0 次，全页无任何拖拽交互；复刻亦无拖拽。双方一致。

### C-INT-4 滚动/动画/尺寸 —— 无缺口（抽查）

- 月份切换器容器 `transition-[width] duration-300`，原版与复刻一致；日历格最小高度 72 / 94 / 105 / 128 / 164px 五档与原版 SSR class 一致；星期头 Sun–Sat；网格 7 列 x 6 行。抽查无缺口。

### C-INT-5 输入：新建表单字段均为复刻自拟

- 原版新建表单字段未知（见 C-CLICK-7）；复刻的标题/日期/时间/全天/颜色五组输入未经核实。输入行为待实测确认。

---

## 第三节 静态内容

### C-STAT-1 日期格背景色错（当月格与非当月格用反/混同）

- 原版：当月格 `bg-background-primary-default`（+ `sm:shadow-card`；移动端暗色下 `bg-background-secondary-default`）；上/下月格（7 月 26–31 日、9 月 1–5 日）`bg-background-secondary-default`（sm 及以上 `bg-background-tertiary-default`），无 opacity。
- 复刻现状：当月与非当月格均用 `bg-background-secondary-default`（sm 及以上 `bg-background-tertiary-default`），仅用 `opacity-60` 区分非当月；无 `shadow-card`。
- 差在哪里：当月格背景色与阴影不对；非当月格多出 `opacity-60`（原版无）。

### C-STAT-2 多出 "Today · Aug 2026" 按钮与 "Selected day" 区

- 见 C-CLICK-4 / C-CLICK-2：静态层面同样为原版没有的内容。

### C-STAT-3 8 月 20 日 chip 数量不对

- 原版显示全部 4 个 chip（见 C-CLICK-3）；复刻只显示 2 个。

### C-STAT-4 详情弹窗内 "– 1 hour" 为自拟时长

- 原版：事件只有开始时间（如 09:30、20:30），全天事件（Payday、Holidays）无时间；SSR 中无任何时长信息。
- 复刻现状：详情弹窗写 "{time} – 1 hour"（如 "09:30 – 1 hour"）。
- 差在哪里：1 小时时长为复刻假设，原版无此信息；新建事件的默认时间 10:00、默认颜色 blue 等亦为复刻自拟。

### C-STAT-5 数值与内容一致 —— 无缺口

- 2026 年 8 月月历（8 月 1 日为周六，42 格为 7 月 26 日–9 月 5 日）；23 个事件 chip 的标题/时间/颜色与原版一致（Coffee 09:30、Payday、Brunch 11:00、Stand-up 11:30、1:1 sync 16:30、Gym 07:00、Game night 19:00、Holidays、Birthday night at Bacalar's 20:30、Retro 15:00、Planning 10:00、Haircut 16:00、Team lunch 13:00、Portfolio review 14:30、Dinner with friends 19:15、Yoga 07:30、Kickoff 09:00、Standup 09:00、Dentist 10:30）；星期头 Sun–Sat；月份切换器 "Aug / August 2026"；标题 "August 2026"；事件 chip 样式 class 与原版一致（含 `hover:brightness-95` 与 `bg-calendar-event-<tone>-background`）。

### C-STAT-6 通知角标数字错

- 原版 5，复刻 3。见 C-CLICK-10。

### C-STAT-7 图片 —— 无缺口

- 原版整页仅 2 张图，均为 `/brand/boardui_logo_circle.webp`（Board team，桌面端与移动端侧栏各一）；复刻团队菜单同样用该图。

---

## 待实测确认清单（需真机/浏览器实测，原版 SSR 无法证明）

1. 月份切换器中心按钮点开什么（是否有月份/年份选择器）（C-CLICK-5）。
2. 事件 chip 点开的详情内容与操作按钮（C-CLICK-6）。
3. "New event" 点开的新建表单字段与布局（C-CLICK-7）。
4. Inbox 点开的收件箱内容与条数（C-CLICK-8）。
5. 通知弹窗的条目内容（C-CLICK-10）。
6. 团队菜单、用户菜单点开后的内容（共享外壳，SSR 未渲染）。
7. 弹窗/菜单是否支持 Esc 关闭（C-INT-2）。
8. "Show 2 more" 式展开、日期格点击在原版是否真无反应（C-CLICK-1/3 的反向验证：确认原版日期格与 "+2 more" 确实不可点，而非 SSR 未渲染其行为）。

---

## 修复结论（2026-11-07 本轮修复）

本次只改 `app/templates/calendar/page.tsx`，未动共享外壳与其他模板。

### 已修

- **C-CLICK-1 日期格不可点**：42 个日期格由 `<button onClick={() => setSelectedKey(...)}>` 改为普通 `<div>`，删除点击设选中、选中 `ring-2 ring-inset ring-accent-500` 圈、hover/focus ring；42 个多余 Tab 停靠点随之消除（C-INT-2 的一部分）。
- **C-CLICK-2 "Selected day" 区**：整区删除（标题日期 + 事件数 + 每行事件按钮），原版页面日历下方无此区域。
- **C-CLICK-4 "Today · Aug 2026" 按钮**：删除该胶囊按钮及外层 flex 包装行；月份切换器单独保留。
- **C-CLICK-3 "+2 more"**：改为纯文本 `<span>`（class 与原版一致：`text-[10px] leading-3 font-medium text-text-secondary sm:text-body-2-medium`），不可点；8 月 20 日显示全部 4 个 chip（Stand-up 11:30 / Team lunch 13:00 / Portfolio review 14:30 / 1:1 sync 16:30）。实现为：某日事件数 > 2 时在 chip 上方显示 `+N more` 纯文本 span（N = 事件数 − 2），全部 chip 照常渲染；原版 SSR 全页仅 8 月 20 日一处出现 "+2 more"，与此规则一致。
- **C-STAT-1 日期格背景色**：逐字对照原版 cell class 改回——当月格 `bg-background-primary-default max-sm:dark:bg-background-secondary-default sm:shadow-card`；上/下月格 `bg-background-secondary-default sm:bg-background-tertiary-default`；删除非当月格的 `opacity-60`。证据：`tpl-pages/calendar.html` 中 8 月 20 日格与 7 月 26 日格的 class。
- **C-STAT-4 详情弹窗自拟时长**：删除 "{time} – 1 hour"，只显示开始时间（无时间则显示 "All day"）；原版事件只有开始时间、无时长信息。
- **C-INT-2 Esc**：页面级 Escape 监听，关闭事件详情弹窗、新建事件弹窗、Inbox 弹窗、月份选择器（原版 react-aria 弹窗默认支持 Esc 关闭，待实测确认）。

### 未修（本次任务范围外或修不了）

- C-CLICK-5 月份切换器中心按钮点开什么（是否有月份/年份选择器）、C-CLICK-6 事件 chip 点开的详情内容与操作按钮、C-CLICK-7 "New event" 新建表单字段、C-CLICK-8 Inbox 弹窗内容与条数：弹窗/菜单内容在 SSR 里看不到，**需真机实测**；复刻现有的选择器/详情弹窗/新建表单/Inbox 列表均为此前自拟实现，本次除 Esc 与删时长外未动。
- C-CLICK-10 通知角标（原版 5 对复刻 3）与通知弹窗内容：共享组件 `notification-bell.tsx`，属另一组范围，未动。
- C-CLICK-11 面包屑 `href="#"`、C-CLICK-12 侧栏多出 HR Management / Multi-Agent Chat 两项：均在共享外壳，属另一组范围，未动。

### 保留说明

- `selectedKey` 状态仍保留，仅作为新建事件的默认日期内部值（"New event" 打开时填入日期框），不再驱动任何可见选中态；Inbox 点某条事件仍会更新该默认值。
- 事件 chip 仍为 `span + role="button"`（带 Enter/Space 键盘处理），未改成原生 `<button>`；入口与原版等价，元素类型差异不在本次修复清单内。
