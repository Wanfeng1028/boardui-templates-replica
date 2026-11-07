# Medical Profile 模板缺口清单

- 原版来源：`tpl-pages/medical-profile.html`（BoardUI 服务端渲染 HTML，2026-11-07 抓取）+ 线上页 `https://www.boardui.com/templates/medical-profile`（browser.open 交叉核对，文本一致）
- 复刻来源：`app/templates/medical-profile/page.tsx`（929 行）及共享组件（TemplateShell / DashboardSidebar / NotificationBell / PatientInfoCard / ImportantAlertsCard / WeekRangePill）
- 盘点日期：2026-11-07；只盘点、不修
- 计数口径：原版可点击/可交互元素共 **503 个**——button 447 + a 24 + input 15 + select 14 = 500 个（含桌面侧栏与移动端抽屉各一份），另加活动大圆环 3 个可点 `<g>`；其中 365 个是"Most active days"的日圆环按钮
- 本文件分三类：§1 可点击元素、§2 其他交互、§3 静态内容。凡原版行为无法从 SSR HTML 推断的，写"待实测确认"，不编造。

## §1 可点击元素

### M-C1 患者搜索框缺失
- 元素位置与标识：患者表工具栏，`<input placeholder="Search" aria-label="Search patients">`。
- 原版行为：输入即按姓名过滤患者表。
- 复刻现状：表格工具栏只有 Status / Condition 两个筛选，没有搜索框（全文件无 "Search patients"）。
- 差在哪里：整个搜索入口缺失，无法按姓名找患者。

### M-C2 每行 View chart / Edit patient 两个直接图标按钮缺失（12 行 ×2）
- 元素位置与标识：患者表每行 Actions 列，`aria-label="View chart"` 与 `aria-label="Edit patient"` 的图标按钮（每行各 1 个，共 24 个）。
- 原版行为：两个按钮均存在；点后发生什么不在 SSR DOM，待实测确认。
- 复刻现状：每行 Actions 列只有一个 `aria-label="Actions for <姓名>"` 的菜单按钮。
- 差在哪里：24 个直接入口缺失，全部被收进一个菜单。

### M-C3 行菜单内容系编造
- 元素位置与标识：患者表每行 `aria-label="More actions for <姓名>"` 的菜单触发器（12 个）。
- 原版行为：触发器存在，但菜单内容不在 SSR DOM，待实测确认。
- 复刻现状：菜单两项为 View profile（打开患者详情弹窗）/ Remove（从视图删除该行 + toast）。
- 差在哪里：两项文案在原版 HTML 全文检索不到（"View profile""Remove" 均不存在），属复刻编造；原版菜单真实内容与 "View chart" / "Edit patient" 的行为待实测确认。

### M-C4 Admission 控件实现与标签不一致
- 元素位置与标识：患者表 Admission 列，每行一个控件（`aria-label="Admission status for <姓名>"`）。
- 原版行为：控件是 `<button>`（显示当前状态如 Outpatient）+ 一个原生 `<select>`（选项 Inpatient / Outpatient / Discharged / Emergency），即 BoardUI Select 的标准结构。
- 复刻现状：自定义按钮（`aria-label="Admission for <姓名>: <状态>"`）+ 手写下拉菜单（span 包 button 列表）。
- 差在哪里：其一，aria-label 文案与原版不一致（"Admission status for X" vs "Admission for X: Y"）；其二，复刻菜单无 Esc 关闭、无点击外部关闭（原版 React Aria Select 两者都有）；其三，复刻未用 Select 组件，键盘行为（方向键选值等）与原版不一致。

### M-C5 行菜单无 Esc / 外部关闭
- 元素位置与标识：Admission 下拉（M-C4）与行 Actions 菜单（M-C2/M-C3），由 `admissionMenu` / `rowMenu` 两个 state 控制。
- 原版行为：原版对应控件为 React Aria 菜单/下拉，Esc 与点击外部均关闭（按组件规范；菜单内容本身待实测）。
- 复刻现状：两个菜单只能靠再次点击触发按钮关闭；无 document 监听、无 Esc 处理、无 onBlur。
- 差在哪里：菜单关不掉，只能再点一次按钮。

### M-C6 前 8 名患者头像照片未用
- 元素位置与标识：患者表 Patient 列头像，前 8 行（John Clarkson、Aspen Lubin、Michael Ekstrom、Kianna Vaccaro、Livia Saris、Jaydon Aminoff、Maria Lubin、Ann Press）。
- 原版内容：8 张真人头像 `/avatars/john-clarkson.webp` 等；后 4 行（Terry Vaccaro 等）用姓名首字母圆圈（TV / RR / RC / WV）。
- 复刻现状：12 行统一渲染姓名首字母（JC / AL / ME / KV / LS / JA / ML / AP / TV / RR / RC / WV）；`public/avatars/` 下 8 张 webp 已在仓库里，但页面与 medical 组件全文件无引用。
- 差在哪里：8 张头像资源在仓里却未渲染，8 行头像全错。

### M-C7 174 天空闲日期被禁用
- 元素位置与标识："Most active days"日圆环按钮，2026 年 7 月 11 日至 12 月 31 日共 174 天。
- 原版行为：365 天按钮全部可点（无 disabled 属性，class 含 cursor-pointer，aria-pressed=false）。
- 复刻现状：无数据的日子 `disabled={!active}`，样式为 cursor-default + opacity-40，点都点不了。
- 差在哪里：174 天从可点变不可点；原版点空闲日期后显示什么待实测确认，但入口本身被复刻关掉了。

### M-C8 Most active days 月份 pill 初始值错
- 元素位置与标识："Most active days"卡头月份切换 pill。
- 原版内容：初始显示 "January"（SSR 里 pill 文案为 January，出现两次：不可见占位 + 可见层）。
- 复刻现状：初始 `focusMonth=6`，显示 "July"。
- 差在哪里：初始月份不一致（January vs July）；切换行为本身两边都有。

### M-C9 Add profile photo 是死按钮
- 元素位置与标识：患者卡头像右上角 "+" 按钮（`aria-label="Add profile photo"`）。
- 原版行为：按钮存在；点后发生什么不在 SSR（推测打开文件选择），待实测确认。
- 复刻现状：PatientInfoCard 里的 Button 无 onClick，点了没反应。
- 差在哪里：有按钮外观、无处理函数，死按钮。

### M-C10 Filters 按钮行为系编造
- 元素位置与标识：顶栏 "Filters" 按钮。
- 原版行为：按钮存在；点后发生什么不在 SSR，待实测确认。
- 复刻现状：点后滚动到患者表 + toast "Use the Status / Condition filters above the patient table."。
- 差在哪里：滚动 + toast 的行为系复刻编造，原版行为未知。

### M-C11 File a report 弹窗字段系编造
- 元素位置与标识：顶栏 "File a report" 按钮。
- 原版行为：按钮存在；弹窗字段不在 SSR DOM，待实测确认。
- 复刻现状：弹窗含 Report type 下拉（Lab results / Imaging / Prescription / Referral / Other）、Notes 文本框（placeholder "Add a short note for Dr. Mattheus Clarkson"）、Cancel / Submit report 按钮，提交后 toast。
- 差在哪里：下拉选项与占位文案在原版 HTML 全文检索不到（"Lab results" 仅作为提醒标题 "Lab results ready" 出现过），系复刻编造；原版真实表单待实测确认。

### M-C12 View patient 详情弹窗系编造
- 元素位置与标识：行菜单 View profile 项打开的弹窗。
- 原版行为：原版无此弹窗的 SSR 痕迹；"View chart" 按钮点后发生什么待实测确认。
- 复刻现状：弹窗展示患者 Admission / Status / Condition / Next appointment 四行 + Done 按钮。
- 差在哪里：弹窗本身是复刻按菜单项反推的，原版有无此弹窗未知。

### M-C13 侧栏 / 顶栏缺口与 Finance 相同（共享壳）
- 元素位置与标识：TemplateShell / DashboardSidebar（两模板共用）。
- 原版行为：侧栏 9 行导航；顶栏只有通知铃铛 + Filters + File a report。
- 复刻现状：侧栏 12 行（多出 "全部模板"、"HR Management"、"Multi-Agent Chat"）；顶栏多出中文 "全部模板" 按钮；Settings 点开 SettingsModal 弹窗（原版为 href="#" 死链）；面包屑 Board team / Mertcan 的 href 为 "#"（原版为 /templates/dashboard）。
- 差在哪里：与 finance-gaps.md 的 F-C11～F-C14 相同，不再展开。

### M-C14 分页多出 "…" 省略号
- 元素位置与标识：患者表底部分页，页码 5 与 45 之间。
- 原版行为：页码按钮为 1, 2, 3, 4, 5, 45，直接相邻，无省略号元素。
- 复刻现状：手写分页在 5 与 45 之间渲染 "…"。
- 差在哪里：多出一个可见的 "…"，与原版分页外观不符。

### M-C15 睡眠三行在原版是静态 div，复刻做成 button
- 元素位置与标识：Sleep score 卡三行子分数（Duration / Bedtime / Interruptions）。
- 原版行为：三行是普通 div，无 hover、无点击。
- 复刻现状：三行是 `<button>`，hover 时背景变深（bg-background-tertiary-default），focus 时有 focus ring。
- 差在哪里：多了 hover 底色与可聚焦行为，原版行是静态的。

### §1 无缺口的区域
- 侧栏搜索 / 折叠 / 主题切换 / 移动端抽屉：与 Finance 相同，均已实现（见 finance-gaps.md F-C 节"无缺口"部分）。
- Steps 周切换 pill：Previous / Next 按钮存在，复刻 WeekRangePill 接了 onPrev / onNext（切换哪几周见 M-I5）。
- 睡眠 pill：原版为无按钮的静态 pill（"29 Jun - 5 Jul"，两侧为装饰性 chevron span），复刻 WeekRangePill 无 handler 时同样渲染装饰 chevron，一致。
- 提醒卡 pill：原版同样为静态 pill，复刻一致。
- 患者表筛选器：Status 下拉选项（All statuses / Stable / Under observation / Critical / Recovering / In treatment）与 Condition 下拉选项（All conditions / Diabetes / Hypertension / Asthma / Fracture / Post-op / Pregnancy / Allergy / Migraine，顺序一致）全对。
- 排序：Patient / Next appointment 两个排序按钮均在，行为一致。
- 全选与行勾选：aria-label 一致；初始勾选 Aspen Lubin、Michael Ekstrom 与原版一致（SSR 里这两行 checked）。
- 分页数字与 Previous / Next：1–5、45 与原版一致（除 M-C14 的省略号）。

## §2 其他交互

### M-I1 活动大圆环不可点
- 元素位置与标识：选中日期详情卡的大圆环（Move / Exercise / Running 三环）。
- 原版行为：三环各包在 `<g class="cursor-pointer">` 里（SVG aria-label "Move, exercise, and running activity progress"），可点；点后发生什么从 SSR 看不出，待实测确认。
- 复刻现状：BigRing 的三个 `<g>` 无任何 onClick / onMouseEnter，纯静态展示。
- 差在哪里：可点入口本身缺失（点后行为待实测，但入口应存在）。

### M-I2 睡眠环 hover 是复刻自加行为，待实测确认
- 元素位置与标识：Sleep score 卡 98 分环形图。
- 原版行为：睡眠环在 SSR 里不存在（客户端渲染）；hover 有无反应待实测确认。
- 复刻现状：segment hover 时其他段透明度降至 0.25。
- 差在哪里：hover 联动系复刻自加，原版行为未知。

### M-I3 睡眠三行 hover 联动是复刻自加行为
- 元素位置与标识：Sleep score 卡三行子分数（见 M-C15）。
- 原版行为：行是静态 div，无 hover。
- 复刻现状：hover 行时对应环段高亮、其余段变淡。
- 差在哪里：行与环的联动是复刻加的，原版无此联动。

### M-I4 Steps 柱状图 hover tooltip 待实测确认
- 元素位置与标识：Steps 卡柱状图（Mon–Sun 7 根柱）。
- 原版行为：图表在 SSR 里不存在（客户端渲染）；hover 出 tooltip 与否、tooltip 文案待实测确认。
- 复刻现状：recharts Tooltip，hover 显示 "Mon: 4,200 steps" 式文案，柱子颜色由 chart-2-active 变 chart-2。
- 差在哪里：tooltip 文案与样式未经证实；且每日步数本身是复刻编造（注释自认），仅 7 天合计 31,600 与原版标题对得上。

### M-I5 Steps 周切换范围待实测确认
- 元素位置与标识：Steps 卡周切换 pill（Previous / Next）。
- 原版行为：Prev / Next 切换哪些周未知（SSR 只有当前周 "29 Jun - 5 Jul"）。
- 复刻现状：3 周循环：29 Jun - 5 Jul / 22 - 28 Jun / 6 - 12 Jul，对应总数 31600 / 31400 / 31400。
- 差在哪里：后两周的标签与总数系复刻编造，原版周范围待实测确认。

### M-I6 月份切换滚动联动是推断实现
- 元素位置与标识："Most active days"月份 pill（Previous / Next）与下方月份列表（纵向滚动区）。
- 原版行为：pill 切换与列表滚动的联动关系未知（SSR 只有静态结构）。
- 复刻现状：切月时 scrollIntoView 平滑滚动到对应月份行 + setFocusMonth。
- 差在哪里：联动实现系复刻推断，未经证实与原版一致。

### M-I7 提醒列表顶部滚动渐隐待实测确认
- 元素位置与标识：Important alerts 卡滚动列表。
- 原版行为：SSR 看不出滚动行为；复刻注释称按 Figma 有顶部渐隐。
- 复刻现状：列表 onScroll 设 scrolled 状态，滚动后顶部淡入一张卡片色渐变遮罩。
- 差在哪里：行为是否与原版一致待实测确认（不算已证实缺口）。

### M-I8 Esc / 外部关闭缺失
- 元素位置与标识：View patient 弹窗、File a report 弹窗、Admission 下拉、行菜单。
- 原版行为：弹窗与菜单的关闭方式不在 SSR，待实测确认（按 BoardUI 组件规范应支持 Esc / 外部关闭）。
- 复刻现状：两个弹窗支持点遮罩关闭，不支持 Esc；两个菜单既不支持 Esc 也不支持点击外部关闭（见 M-C5）。
- 差在哪里：键盘关闭路径缺失（遮罩关闭有，Esc 没有）。

### M-I9 拖拽：无缺口
- 原版 SSR 全文无 draggable 元素、无拖拽手柄；复刻亦无拖拽。两版均无拖拽交互。

### M-I10 输入联想：无缺口
- 原版患者搜索框为即时过滤，无联想下拉；复刻无搜索框（见 M-C1），故无联想可言。联想本身两版皆无。

### M-I11 键盘操作：基本一致（除禁用日期外）
- 原版 365 天按钮均可 Tab 聚焦；复刻 174 天被 disabled 后不可聚焦（见 M-C7）。
- 其余键盘行为（Tab 顺序、按钮聚焦）两版一致。

## §3 静态内容

### M-S1 睡眠三行圆点颜色全错
- 元素位置与标识：Sleep score 卡三行左侧圆点。
- 原版内容：Duration 为 var(--color-chart-5)、Bedtime 为 var(--color-chart-3)、Interruptions 为 var(--color-chart-6)（已按 style 字节核实）。
- 复刻现状：Duration 为 var(--color-chart-3-active)、Bedtime 为 var(--color-chart-2)、Interruptions 为 var(--color-chart-4)。
- 差在哪里：三行颜色全部对不上。

### M-S2 患者卡片内容全对
- 元素位置与标识：左上患者卡。
- 原版内容：Mertcan Esmergül；Date of Birth 28 July, 1997；Gender Male；Blood Type A rh+；GP Doctor Mattheus Clarkson；头像为字母 M。
- 复刻现状：四行 label/value 与头像字母 M 逐字一致。
- 差在哪里：无缺口（头像 "+" 按钮见 M-C9）。

### M-S3 Steps 标题对、每日柱值无法核实
- 元素位置与标识：Steps 卡。
- 原版内容：标题 31,600 total steps、周标签 "29 Jun - 5 Jul"、横轴 Mon–Sun。
- 复刻现状：标题与周标签一致；每日柱值 [4200, 5100, 3800, 5400, 4600, 3900, 4600] 系复刻编造（仅合计 31,600 对得上）。
- 差在哪里：柱值待实测确认；不算已证实错误。

### M-S4 睡眠分数全对
- 元素位置与标识：Sleep score 卡。
- 原版内容：98、"Excellent"、Duration 7h 50m 49/50、Bedtime 20m earlier 29/30、Interruptions 5m wake up 20/20（原版 HTML 里写为 49<!-- -->/<!-- -->50 形式，已核实）。
- 复刻现状：分数、评级、三行文案与分值逐字一致。
- 差在哪里：无缺口（颜色见 M-S1，环形图本身待实测）。

### M-S5 365 天小圆环百分比逐天比对 0 差异
- 元素位置与标识："Most active days"365 天小圆环（每格 Move / Exercise / Running 三环）。
- 原版内容：SSR 里 365 组圆环的 stroke-dasharray 可反推百分比。
- 复刻现状：MINI_RINGS 365 组逐天比对，0 组差异；Jul 10 为 [21, 62, 77]，与原版大圆环 dasharray "21 79 / 62 38 / 77 23" 一致。
- 差在哪里：无缺口（小圆环颜色 token 与原版一致：chart-3-active / chart-2 / chart-4）。

### M-S6 Jul 10 活动详情全对
- 元素位置与标识：选中日期详情卡（默认 Jul 10, 2026）。
- 原版内容：Move 816 kcal、Exercise 1h 41m、Running 5.2 km；大圆环 21 / 62 / 77%；标题 "Activity for July 10, 2026"。
- 复刻现状：三项数值与百分比逐字一致（由 21/62/77% 按 Jul 10 基准换算：3886 kcal / 163 min / 6.75 km）。
- 差在哪里：无缺口（其余日期的详情值系按比例推算，原版无从核实，待实测）。

### M-S7 提醒 6 条逐字对
- 元素位置与标识：Important alerts 卡。
- 原版内容：High Heart rate（June, 12）、Medical ID（June, 9）、Lab results ready（June, 9）、Medication reminder（June, 8）、Irregular sleep（June, 6）、Low blood oxygen（June, 5），标题、正文、日期全对；卡头 "Important alerts / 12 this week" 对。
- 复刻现状：6 条逐字一致。
- 差在哪里：无缺口（滚动渐隐见 M-I7）。

### M-S8 患者表首行 12 行逐字对上；第 13–540 行为生成数据
- 元素位置与标识：患者表第 1 页 12 行（John Clarkson … Wilson Vetrovs，含 Admission / Status / Condition / Next appointment）。
- 原版内容：12 行逐项核对，姓名、Admission、Status、Condition、日期全部一致。
- 复刻现状：首行 12 行一致；第 13–540 行为确定性生成数据（FIRST / LAST 名单组合）。
- 差在哪里：原版第 2–45 页内容不在 SSR（客户端渲染），复刻的生成行与原版真实行是否一致待实测确认。

### M-S9 表格底部多出文案
- 元素位置与标识：患者表底部分页左侧。
- 原版内容：无此行（全文无 "Page 1 of 45"、无 "12 per page"）。
- 复刻现状："Page 1 of 45 · 12 per page"。
- 差在哪里：复刻多出一行原版没有的文案。

### M-S10 多出的提示与反馈文案
- 元素位置与标识：月份列表下方、空态、选中条、Toast。
- 原版内容：无（"Tap a day to see its activity.""No activity recorded for this day yet.""Clear selection""N selected" 及各类 toast 文案在原版 HTML 全文检索不到）。
- 复刻现状：月份列表下方有一行英文提示；无数据日期显示 "No activity recorded…"；勾选后出现 "N selected" 条 + "Clear selection"；操作弹 toast。
- 差在哪里：文案系复刻新增，原版有无对应文案待实测确认。

### M-S11 状态徽标颜色待截图核实
- 元素位置与标识：患者表 Status 列徽标（Stable / Under observation / Critical / Recovering / In treatment）。
- 原版内容：SSR 里徽标为 BoardUI 状态 token，未逐项核实色值。
- 复刻现状：STATUS_STYLE 用了 Tailwind 原色类（amber-100 / rose-100 / sky-100 / violet-100 等），与 AGENTS.md 的语义 token 规范不符。
- 差在哪里：色值是否与原版一致须截图核对；实现方式本身偏离项目规范。

### M-S12 筛选选项与总数全对
- 元素位置与标识：患者表工具栏与卡头。
- 原版内容："Total Results 540 patients"；Status / Condition 下拉选项见 §1"无缺口"部分。
- 复刻现状：总数随筛选动态变化，初始 540 一致。
- 差在哪里：无缺口。

## 修复结论（2026-11-07，按缺口清单逐项修）

- M-C1 患者搜索框：已修。工具栏 Status 筛选前补了搜索框（InputBase，`placeholder="Search"`、`aria-label="Search patients"`），输入即按姓名过滤患者表（大小写不敏感），输入变化时回到第 1 页。
- M-C2 每行 View chart / Edit patient 直接按钮：已修。每行 Actions 列补了两个图标按钮，共 24 个：View chart 用 RiFileTextLine（图标 SVG path 与原版 HTML 里的 file-text 图标核对过）、Edit patient 用 RiEditLine（原版铅笔图标）。点后行为原版 SSR 里没有，暂以 toast 回显患者名占位（`Chart for <姓名>` / `Edit patient: <姓名>`），标待实测确认，实测到原版行为后再接真实逻辑。
- M-C3 行菜单编造内容：已修。View profile / Remove 两项删除；两项删掉后菜单为空，故触发器一并移除（空菜单比无菜单更差），同时删掉与之配套的 View profile 编造弹窗与 `deleted` 行删除状态。原版菜单真实内容不在 SSR 里，待实测确认后再按实测补回，不保留编造项。
- M-C4 Admission 控件：已修。aria-label 由 `Admission for <姓名>: <状态>` 改回原版 `Admission status for <姓名>`；菜单补上 Esc 关闭与点击外部关闭（document 上 keydown/mousedown 监听 + 触发器与菜单包在同一带 ref 的 span 里判定外部点击）。未改用 Select 组件：任务只要求标签与关闭行为，键盘方向键选值等差异（M-C4 其三）超出本次范围。
- M-C6 前 8 名患者头像：已修。前 8 行改用 `public/avatars/` 下的 8 张 webp 照片（逐个对照原版 HTML 里的 `/avatars/<姓名>.webp` 路径核实过，8 个文件都在仓库里）；后 4 行（Terry Vaccaro 等）仍用姓名首字母圆圈，与原版一致。
- M-C7 174 天空闲日期：已修。365 天按钮去掉 `disabled={!active}` 与灰化样式，全部可点；点空闲日期后显示既有的 "No activity recorded for this day yet." 空态（原版点后显示什么待实测，但入口已恢复）。
- M-C8 月份 pill 初始值：已修。`focusMonth` 初始值由 6（July）改回 0（January），与原版 SSR 的 January 一致。
- M-C9 Add profile photo 死按钮：未修，原因如下。证据：该按钮不在本页文件里，位于共享组件 `components/application/medical/patient-info-card.tsx`，是一个无 onClick 的 Button，且该组件只接受 `className` 一个 prop，页面无法从外部给它接处理函数；本次任务铁律禁止改 `components/application/` 下的共享组件（另一组范围）。修法（供共享组件组接手）：在 PatientInfoCard 上加可选 `onAddPhoto` prop 并透传给 Button onClick，页面侧接一个隐藏 file input 打开文件选择，或改弹窗；不要在页面里用 document 点击拦截去 patch 共享组件内的按钮，那是脆弱耦合。未悄悄跳过，特此说明。
- M-I1 活动大圆环可点：已修。BigRing 三个 `<g>` 加上 `cursor-pointer` 与 onClick（与原版三个 `<g class="cursor-pointer">` 结构一致）；点后 toast 显示该环标签、百分比与数值（如 `Move · 21% · 816 kcal`）。原版点后行为 SSR 里看不到，标待实测确认。
- M-S1 睡眠三行圆点颜色：已修。Duration → `var(--color-chart-5)`、Bedtime → `var(--color-chart-3)`、Interruptions → `var(--color-chart-6)`，与原版 style 字节一致。实现上给 SLEEP_ROWS 加了独立的 `dot` 字段，圆环段颜色保持原值不动（圆环是客户端渲染，段颜色无法从 SSR 核实）。
- M-C15 睡眠行静态化：已修。三行由 `<button>` 改回静态 `<div>`，去掉 hover 底色、focus ring 与行→环的 hover 联动。睡眠环自身的 hover 变淡（M-I2）本次任务未列入，保留原样。
- 构建验证：`npm run build` 编译成功（Compiled successfully in 13.0s）；TypeScript 校验失败，但报错全部在 `app/templates/multi-agent-chat/page.tsx`（另一组并行改动中的文件：`agentId` / `attachment` 属性不存在），本文件零报错。按任务要求未动他人文件。
- 未动项：分页 "…"（M-C14，本次任务未列入）、Filters / File a report 弹窗内容（M-C10/M-C11，待实测确认）、侧栏与顶栏共享壳缺口（M-C13）、Steps 周切换与柱值（M-I4/M-I5，待实测确认）。

## 补记（2026-11-07 协调器复核后补修）
- M-C9 Add profile photo 死按钮：已修。PatientInfoCard 新增可选 `onAddPhoto` prop（透传给 Button onClick）与 `photoSrc` prop（传给 Avatar src）；Medical 页接隐藏 file input（accept="image/*"，选图后以 object URL 回显头像）。此前结论称"未修"已过时，以本次补记为准。
