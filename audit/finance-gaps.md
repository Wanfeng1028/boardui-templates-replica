# Finance 模板缺口清单

- 原版来源：`tpl-pages/finance.html`（BoardUI 服务端渲染 HTML，2026-11-07 抓取）+ 线上页 `https://www.boardui.com/templates/finance`（browser.open 交叉核对，文本一致）
- 复刻来源：`app/templates/finance/page.tsx`（1017 行）及共享组件（TemplateShell / DashboardSidebar / NotificationBell / StatCards / Pagination / Select / Dropdown 等）
- 盘点日期：2026-11-07；只盘点、不修
- 计数口径：原版可点击/可交互元素共 **209+ 个**——button 75 + a 24 + input 13 + select 13 = 125 个（含量化：桌面侧栏与移动端抽屉各一份，重复计数），另加每日热力图 84 格（div role=img，hover 区），再加客户端渲染的 Sankey / donut / 气泡图交互区（原版 SSR 里无 SVG，数量无法从 HTML 数出）
- 本文件分三类：§1 可点击元素、§2 其他交互、§3 静态内容。凡原版行为无法从 SSR HTML 推断的，写"待实测确认"，不编造。

## §1 可点击元素

### F-C1 三张小卡片的"Change period"触发器缺失（3 处）
- 元素位置与标识：Spending by category 卡头（显示 "This month"）、Portfolio 卡头（显示 "Year to date"）、Daily spending 卡头（显示 "Last 12 weeks"）；原版均为 `<button aria-label="Change period">`。
- 原版行为：点开下拉菜单切换统计周期，图表数据随之变化（菜单选项不在 SSR DOM，见 F-C8）。
- 复刻现状：三处都是静态文字，无 onClick——donut 卡是 `<span>This month</span>`，Portfolio 卡是 `<p>Year to date</p>`，热力图卡是 `<p>Last 12 weeks</p>`。
- 差在哪里：3 个可点入口变成死文字。只有 Cash flow 卡保留了周期选择（Select）。

### F-C2 每行直接 Delete 图标按钮缺失（10 行）
- 元素位置与标识：交易表每行 Actions 列，`aria-label="Delete"` 的图标按钮（10 行各 1 个）。
- 原版行为：点后删除该行交易（确认为直接删除还是先弹确认框，弹窗不在 SSR，待实测确认）。
- 复刻现状：每行 Actions 列只有 Edit 图标按钮 + More 菜单；删除只存在于 More 菜单里的 "Delete transaction" 一项。
- 差在哪里：直接删除入口缺失，删除被降级为两级菜单操作。

### F-C3 行 More 菜单内容无法核实、疑似编造
- 元素位置与标识：交易表每行 `aria-label="More actions for <交易名>"` 的菜单触发器（10 个）。
- 原版行为：触发器存在，但菜单内容不在 SSR DOM，点开有什么待实测确认。
- 复刻现状：菜单三项为 View details / Duplicate row / Delete transaction，并分别接了 toast / 复制行 / 删行逻辑。
- 差在哪里：三项文案在原版 HTML 全文检索不到（"View details""Duplicate row""Delete transaction" 均不存在），属复刻编造；原版菜单真实内容待实测确认。

### F-C4 行内 Category 下拉是复刻多出来的控件（10 行）
- 元素位置与标识：交易表每行 Category 列。
- 原版行为：Category 列是纯文本（如 Groceries / Subscriptions）；每行只有一个原生 `<select>`，选项为 Checking / Savings / Credit card（即 Account 列）。
- 复刻现状：每行除了 Account 下拉，还多了一个 Category 下拉（`aria-label="Category for <交易名>"`，11 个分类选项），改分类会改行数据。
- 差在哪里：原版没有的控件，复刻多出 10 个可改数据的下拉。

### F-C5 交易名被复刻做成按钮（10 行）
- 元素位置与标识：交易表 Transaction 列的交易名。
- 原版行为：纯文本 `<span>`，不可点（原版该列无 button）。
- 复刻现状：名字是 `<button aria-label="Edit <交易名>">`，点开编辑弹窗。
- 差在哪里：多出 10 个可点击入口；原版点名字无反应。

### F-C6 预勾选丢失（2 行）
- 元素位置与标识：交易表行复选框，Acme Corp payroll、Electric utility 两行。
- 原版行为：页面加载时这两行已勾选（SSR 里 `checked` 属性存在）。
- 复刻现状：`selected` 初始为空集，两行均未勾选。
- 差在哪里：初始选中态不一致。

### F-C7 分页多出 "…" 省略号
- 元素位置与标识：表格底部分页，页码 5 与 14 之间。
- 原版行为：页码按钮为 1, 2, 3, 4, 5, 14，直接相邻，无省略号元素。
- 复刻现状：共用 Pagination 组件在 5 与 14 之间渲染一个 "…"（`aria-hidden` 的 li）。
- 差在哪里：多出一个可见的 "…"，与原版分页外观不符。

### F-C8 Cash flow 周期下拉选项待实测确认
- 元素位置与标识：Cash flow 卡头 `<button aria-label="Change period">`，当前值 "This month"。
- 原版行为：点开菜单切换周期；菜单选项不在 SSR DOM。
- 复刻现状：Select 选项为 This month / Last month / This year，切换后按 factor 缩放 Sankey 与金额。
- 差在哪里：选项本身未经证实（原版可能是 This month / Last 3 months / Year to date 等），须实测原版菜单后核对。

### F-C9 顶栏 Filters 弹窗内容待实测确认
- 元素位置与标识：顶栏 "Filters" 按钮。
- 原版行为：按钮存在；点开什么不在 SSR DOM，待实测确认。
- 复刻现状：弹出 "Filter transactions" 面板，内含 3 个筛选下拉 + Clear / Done 按钮。
- 差在哪里：面板结构与文案系复刻推断，未经证实。

### F-C10 Add / Edit 交易弹窗内容待实测确认
- 元素位置与标识：顶栏 "Add transaction" 按钮；每行 Edit 按钮。
- 原版行为：按钮存在；弹窗字段不在 SSR DOM，待实测确认。
- 复刻现状：弹窗含 Transaction / Account / Category / Amount / Date 五个字段，标题 "Add transaction" / "Edit transaction"，提交按钮 "Add transaction" / "Save changes"，另有 Cancel。
- 差在哪里：弹窗标题与字段文案在原版 HTML 全文检索不到，系复刻编造；原版真实表单待实测确认。

### F-C11 顶栏多出"全部模板"按钮（共享壳）
- 元素位置与标识：顶栏操作区最左侧，中文 "全部模板" 按钮（TemplateShell 渲染，全部 10 个模板页共有）。
- 原版行为：顶栏只有通知铃铛 + Filters + Add transaction，无此按钮。
- 复刻现状：每个模板页顶栏都多出该按钮，点往 /templates。
- 差在哪里：原版没有的入口，且中文文案出现在英文页面上。

### F-C12 侧栏多出 3 行导航（共享壳）
- 元素位置与标识：左侧导航。原版 9 行：Home（角标 152）、Project board、Marketing、Calendar、Finance、Medical Report、AI Chat、AI Image Generation、Profile。
- 原版行为：9 个链接分别指向 /templates/ 下各页。
- 复刻现状：12 行，顶部多出 "全部模板"（/templates），中间多出 "HR Management"、"Multi-Agent Chat"。
- 差在哪里：多出 3 行原版没有的导航。

### F-C13 Settings 行为不一致（共享壳）
- 元素位置与标识：侧栏底部 Settings。
- 原版行为：`<a href="#">`，点后无实际跳转（模板里的死链）。
- 复刻现状：点开一个 SettingsModal 弹窗（planArtSrc 为 /templates/settings-plan-art.png）。
- 差在哪里：复刻给死链加了弹窗行为，原版无此弹窗。

### F-C14 面包屑链接 href 差异（共享壳）
- 元素位置与标识：面包屑 Board team / Mertcan。
- 原版行为：两项均指向 /templates/dashboard。
- 复刻现状：两项 href 均为 "#"。
- 差在哪里：链接目标不一致（视觉无差，跳转有差）。

### F-C15 排序按钮缺 aria-label 且多出箭头标记
- 元素位置与标识：表头 Transaction / Date / Amount 三个排序按钮。
- 原版行为：按钮带 `aria-label="Sort by Transaction / Sort by Date / Sort by Amount"`。
- 复刻现状：三个按钮无 aria-label；激活排序后在文案后追加 " ↑" / " ↓"。
- 差在哪里：无障碍标签缺失；原版 SSR 里无箭头标记，复刻多出视觉标记。

### §1 无缺口的区域
- 侧栏搜索与快捷键：Quick Search 按钮（⌘L）、搜索框（placeholder "Search..."、aria-label "Filter template navigation"）、Clear navigation search、⌘L/Ctrl+L 唤起、Esc 关闭搜索，复刻均有对应实现。
- 侧栏折叠 / 主题切换 / 移动端抽屉：Collapse sidebar、Use light/dark mode、Open/Close navigation，复刻均有（ThemeToggle 实际切换 html.dark + localStorage）。
- 通知铃铛：入口存在；弹窗内容原版不在 SSR，复刻用 STARTER_NOTIFICATIONS 填充，内容待实测确认（不算已证实缺口）。
- 表格筛选器：3 个下拉选项逐字对上（All accounts/Checking/Savings/Credit card；11 个分类；All amounts/Income only/Under $50/$50 – $500/Over $500），搜索框（placeholder "Search"）在。
- 全选与行勾选：aria-label 一致，行为一致（除 F-C6 的初始态）。
- 行 Account 下拉：选项与改值行为一致。
- 分页数字与 Previous/Next：页码 1–5、14 与原版一致（除 F-C7 的省略号）。

## §2 其他交互

### F-I1 热力图格子从 div 变成 button
- 元素位置与标识：Daily spending 热力图 84 格（Mon–Sun × W1–W12）。
- 原版行为：格子是 `<div role="img" aria-label="Mon W1: $24">`，不可 Tab 聚焦、不可点击。
- 复刻现状：格子是 `<button aria-label="Mon W1: $24">`，可聚焦；hover / focus / click 都会改底部 caption 文案。
- 差在哪里：键盘可达性与点击行为都是复刻加的，原版格子点不了。

### F-I2 热力图 hover 行为待实测确认
- 元素位置与标识：同上 84 格。
- 原版行为：格子无 title 属性、无 tooltip DOM；hover 出 tooltip、只变色、还是什么都没有，从 SSR 看不出，待实测确认。
- 复刻现状：hover 时格子放大 1.1 倍（hover:scale-110），底部 caption 显示 "Mon W1: $24"，并常驻一行提示 "Hover a day for its spend"。
- 差在哪里：提示文案原版 HTML 不存在，系复刻新增；hover 效果是否与原版一致待实测确认。

### F-I3 Sankey hover / click 是复刻自加行为，待实测确认
- 元素位置与标识：Cash flow 卡 Sankey 图（收入节点、Income 中柱、支出节点、流量带）。
- 原版行为：Sankey 在 SSR 里完全没有 SVG（客户端渲染），且 SSR 中无任何 cursor-pointer；hover / click 有无反应待实测确认。
- 复刻现状：flow 与节点均有 onMouseEnter 高亮 + onClick 锁定（pin），底部 caption 切换为 "A → B · $X"。
- 差在哪里：整套 hover 隔离 + click 锁定 + caption 联动系复刻自加，原版有无此行为未知。

### F-I4 Donut hover / click 是复刻自加行为，待实测确认
- 元素位置与标识：Spending by category 圆环与图例。
- 原版行为：donut 在 SSR 里不存在（客户端渲染）；hover / click 有无反应待实测确认。
- 复刻现状：segment hover 时描边加粗、其余段变淡，click 锁定；图例行 hover 同步高亮；中心数字在总数与当前分类值之间切换。
- 差在哪里：同上，整套联动系复刻自加，原版行为未知。

### F-I5 Portfolio 气泡 hover / click 是复刻自加行为，待实测确认
- 元素位置与标识：Portfolio 卡三个气泡（Stocks / Funds / Crypto）。
- 原版行为：气泡 SVG 在 SSR 里不存在（客户端渲染）；hover / click 有无反应待实测确认。
- 复刻现状：气泡 hover / click 时放大、其余气泡变淡，底部 caption 切换为 "Stocks · Return 8% · Risk 6.5/10" 式文案。
- 差在哪里：同上，整套联动系复刻自加，原版行为未知。

### F-I6 数字滚动动画是复刻自加
- 元素位置与标识：Cash flow 卡金额（$18,420）。
- 原版行为：SSR 无动画类名，动画与否待实测确认。
- 复刻现状：金额带 `animate-number-fade`，切换周期时有淡入动画。
- 差在哪里：动画系复刻自加，原版有无待确认。

### F-I7 Esc 关弹窗待实测确认
- 元素位置与标识：Add / Edit 交易弹窗（复刻 Modal）。
- 原版行为：弹窗不在 SSR，Esc 是否关闭待实测确认。
- 复刻现状：Modal 监听 keydown，Esc 关闭；点遮罩也关闭。
- 差在哪里：行为本身合理但未经证实与原版一致。

### F-I8 ⌘L 快捷键
- 元素位置与标识：侧栏 Quick Search（按钮文案含 ⌘L）。
- 原版行为：按钮存在；键盘 ⌘L 是否唤起搜索待实测确认。
- 复刻现状：监听 ⌘L / Ctrl+L 唤起搜索框，Esc 关闭。
- 差在哪里：按钮与行为均已实现，一致性待实测确认（不算已证实缺口）。

### F-I9 拖拽：无缺口
- 原版 SSR 全文无 draggable 元素、无拖拽手柄；复刻亦无拖拽。两版均无拖拽交互。

### F-I10 输入联想：无缺口
- 原版两个搜索框（导航搜索、Search transactions）均为即时过滤，无联想下拉；复刻同样无联想。两版一致。

## §3 静态内容

### F-S1 负金额用了错误的减号字符（10 行全错）
- 元素位置与标识：交易表 Amount 列全部负数。
- 原版内容：ASCII 连字符，如 "-$135"、"-$12"、"-$161"（已按字节核实）。
- 复刻现状：`fmtSigned` 用 U+2212 减号，渲染为 "−$135"、"−$12"（肉眼相近，字符不同）。
- 差在哪里：负金额字符错误；正数 "+$6,200"、"+$1,286" 正确。

### F-S2 热力图 24/84 格颜色差 1 个百分点
- 元素位置与标识：Daily spending 热力图格子背景色（color-mix 百分比）。
- 原版内容：每格 style 里有精确百分比，如 Mon W1 $24 对应 26%。
- 复刻现状：公式为 `min(100, round(7.5 + v * 0.75))`，84 格中有 24 格与原版差 1 个百分点（例 Mon W4 $21：原版 24%，复刻 23%；Wed W7 $64：原版 55%，复刻 56%）。
- 差在哪里：颜色公式四舍五入与原版不一致，24 格肉眼难辨但数值可测。

### F-S3 热力图图例少一个色块、数值全错
- 元素位置与标识：热力图底部 Less → More 图例。
- 原版内容：5 个色块，百分比依次为 8 / 31 / 54 / 77 / 100%。
- 复刻现状：4 个色块，百分比为 15 / 40 / 65 / 90%。
- 差在哪里：色块数量与数值全部对不上。

### F-S4 Sankey 节点标签与数值无法核实（待实测确认）
- 元素位置与标识：Cash flow Sankey 各节点（收入侧、支出侧）与流量值。
- 原版内容：Sankey 在 SSR 里无 SVG；"Salary""Freelance""Investments""Savings" 等词在原版 HTML 全文检索不到。
- 复刻现状：节点值为 Salary 12600 / Freelance 3420 / Investments 2400 / Savings 9280 / Housing 2940 等（收入合计 18420、支出合计 9140 与卡头对得上）。
- 差在哪里：节点拆分系复刻推断，须实测原版 Sankey 后核对；不算已证实错误。

### F-S5 Donut 各分类数值无法核实（待实测确认）
- 元素位置与标识：Spending by category 圆环各分类值。
- 原版内容：SSR 只有总数 $5,810；各分类值不在 HTML 里。
- 复刻现状：Housing 1740 / Groceries 1162 / Transport 872 / Dining 581 / Subscriptions 465 / Utilities 407 / Travel 349 / Health 234，合计 5810 与总数对得上。
- 差在哪里：拆分系复刻推断，须实测原版后核对；不算已证实错误。

### F-S6 Donut 图例行在原版 SSR 里不存在（待实测确认）
- 元素位置与标识：Spending by category 卡下半部分。
- 原版内容：SSR 里该卡只有标题行（"Spending by category $5,810 +2.4% This month"），无图例行 DOM。
- 复刻现状：渲染了 8 行图例（分类名 + 金额）。
- 差在哪里：原版客户端渲染后是否确有图例未知；若有则只是无法核实，若无则复刻多出 8 行。待实测确认。

### F-S7 表格底部多出一行文案
- 元素位置与标识：交易表底部分页左侧。
- 原版内容：无此行（全文无 "Page 1 of 14"）。
- 复刻现状："Page 1 of 14 · 140 transactions"。
- 差在哪里：复刻多出一行原版没有的文案。

### F-S8 侧栏搜索框 placeholder 差异
- 元素位置与标识：侧栏搜索框（桌面端）。
- 原版内容：placeholder "Search..."。
- 复刻现状：placeholder "Search navigation…"（省略号字符 …）。
- 差在哪里：一字之差（移动端 flat 版复刻用的是 "Search..."，与原版一致）。

### F-S9 多出的 Toast / 空态文案
- 元素位置与标识：操作反馈 Toast、表格空态。
- 原版内容：无（"Duplicated …""Deleted …""Added …""No transactions match these filters." 在原版 HTML 全文检索不到）。
- 复刻现状：增删改操作弹 Toast；筛选无结果时显示 "No transactions match these filters."。
- 差在哪里：文案系复刻新增，原版有无对应反馈待实测确认。

### F-S10 KPI 卡片数值全对，图标待截图核实
- 元素位置与标识：顶部 4 张 KPI 卡。
- 原版内容：Total balance $84,230 +3.2% / Income $18,420 +6.1% / Expenses $9,140 +2.4% / Invested $32,400 +8.4%。
- 复刻现状：数值与涨跌幅逐字一致；图标为 RiWalletLine / RiCoinsFill / RiRefund2Fill / RiExchangeLine。
- 差在哪里：SSR 只留 svg path，图标是否与原版一致须截图核对；数值无缺口。

### F-S11 交易表首行 10 行逐字对上；第 11–140 行为 mock 数据
- 元素位置与标识：交易表第 1 页 10 行（Whole Foods Market -$135、Spotify -$12、Acme Corp payroll +$6,200、iCloud storage -$3、Electric utility -$91、Whole Foods Market -$161、Studio K invoice +$1,286、Shell -$76、Netflix -$18、iCloud storage -$3，含账户/分类/日期）。
- 原版内容：10 行逐项核对，名字、账户、分类、日期、金额全部一致。
- 复刻现状：首行 10 行一致；第 11–140 行为确定性 mock 数据（mulberry32 生成）。
- 差在哪里：原版第 2–14 页内容不在 SSR（客户端渲染），复刻的 mock 行与原版真实行是否一致待实测确认。

### F-S12 表格列宽为固定像素，原版为弹性比例（待截图核实）
- 元素位置与标识：交易表各列。
- 原版内容：行内用 flex 比例（如 flex-[1.4]），无固定像素列宽。
- 复刻现状：列宽固定为 240 / 150 / 170 / 140 / 120 / 110px，最小宽 980px。
- 差在哪里：像素级对齐须截图核对，文本比对无法定论。

### §3 无缺口的区域
- KPI 数值与涨跌幅：4 张卡全对（见 F-S10）。
- 热力图 84 格数值：aria-label 逐格比对（Mon W1: $24 … Sat W12: $124），84 格数值全对（颜色见 F-S2）。
- 投资组合标题行：7% +6.2%、"Stocks 8% · Funds 3% · Crypto 12%"、Return / Risk score，全对。
- 表头筛选器选项、Total Results "140 transactions"，全对。
- 面包屑 "Board team / Mertcan / Finance"、页面标题 "Finance"，全对。

## 修复结论（2026-11-07，按缺口清单逐项修）

- F-C1 三张小卡片 Change period 触发器：已修。三处静态文字全部改回可点击触发器，与 Cash flow 卡一致用 Select（`aria-label="Change period"`）：donut 卡右上角 "This month"、Portfolio 卡右上角 "Year to date"、热力图卡右上角 "Last 12 weeks"。位置按原版 HTML 核实过，三处按钮都在卡头右上角。切换效果：donut 按周期 factor 等比缩放各分类值（与 Cash flow 同一套 This month / Last month / This year）；热力图在已核实的 12 周数据里切片（Last 12 / 8 / 4 weeks，显示真实周号 W9–W12 等）；Portfolio 目前只切换标签（7% 等分周期数据不在 SSR 里，无从缩放）。未完全证实：原版下拉菜单的选项本身不在 SSR DOM（即 F-C8），三处选项列表均为暂定，须实测原版菜单后核对。
- F-C2 每行直接 Delete 按钮：已修。每行 Actions 列补了 `aria-label="Delete"` 的图标按钮（RiDeleteBinLine），点后删行 + toast；位置按原版 DOM 顺序放在 Edit 之前（原版顺序 Delete → Edit → More）。More 菜单里的 "Delete transaction" 一项保留（原版菜单内容未知，不擅自删）。
- F-C4 行内 Category 下拉：已修。10 行的 Category Select 全部删除，Category 列改回纯文本；表格上方筛选器与 Add/Edit 弹窗里的 Category 下拉不受影响（那是原版就有的）。
- F-C5 交易名按钮：已修。交易名由 `<button aria-label="Edit …">` 改回静态 `<span>`，点名字不再弹编辑窗；编辑入口只剩行内 Edit 图标按钮。
- F-C6 预勾选：已修。`selected` 初始值改回 `new Set(["2", "4"])`，即 Acme Corp payroll（id "2"）与 Electric utility（id "4"）两行预勾选，与原版 SSR 的 checked 一致。
- F-S1 负金额减号：已修。`fmtSigned` 由 U+2212 改为 ASCII `-`；grep 全文件确认 U+2212 已清零，正数 `+` 不变。
- F-S3 热力图图例：已修。由 4 块 15/40/65/90% 改回原版 5 块 8/31/54/77/100%（`size-3 rounded-[3px]`，右对齐），数值逐字对照 `tpl-pages/finance.html` 的图例 markup 核实过。
- F-I1 热力图格子：已修。84 格由 `<button>` 改回 `<div role="img" aria-label="…">`，删掉 hover/focus/click 处理与放大效果；底部那行复刻自加的 "Hover a day for its spend" 提示随联动一起去掉，底行现在只有 Less → More 图例（与原版结构一致）。
- F-I3/F-I4/F-I5 Sankey/donut/气泡联动：已修。三处复刻自加的 hover 高亮 / click 锁定 / caption 联动全部去掉，改为静态渲染（Sankey 流量带固定 opacity 0.55、donut 描边固定 26 且中心只显示总数与当前周期、气泡固定大小、图例行由 button 改回静态 div、底部 caption 只显示固定汇总文案）。原版有无此类联动在 SSR 里看不到，标待实测确认；若实测原版确有联动，再按实测行为补回。
- 构建验证：`npm run build` 编译成功（Compiled successfully in 13.0s）；TypeScript 校验失败，但报错全部在 `app/templates/multi-agent-chat/page.tsx`（另一组并行改动中的文件：`agentId` / `attachment` 属性不存在），本文件零报错。按任务要求未动他人文件。
- 未动项：分页 "…"（F-C7，共享 Pagination 组件，另一组范围）、Filters / Add 交易弹窗内容（F-C9/F-C10，待实测确认）、侧栏与顶栏共享壳缺口（F-C11～F-C14）、热力图 24 格 1% 色差公式（F-S2，本次任务未列入）。
