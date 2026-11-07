# Dashboard 缺口清单

盘点日期：2026-11-07。只盘点、不修。

## 基线与计数方法

- 原版来源：`tpl-pages/dashboard.html`（BoardUI 线上页 `https://www.boardui.com/templates/dashboard` 的本地快照），并用 `browser.open` 抓线上页文本交叉核对过（线上与本地快照首屏数据一致：John Clarkson $3.412、Sep 05, 2026 等）。
- 复刻来源：`app/templates/dashboard/page.tsx`（源码）+ `out/templates/dashboard.html`（静态导出渲染结果，用于逐字逐项对照）。
- 元素总数：**404 个**（原版静态 DOM 里的可点击元素总数；其中热力图日格 259 个各不相同；其余 145 个含侧栏桌面/移动两份副本，去重后不同标识 348 个）。复刻渲染 DOM 为 414 个。
- 行为判定：弹窗/菜单/抽屉等按需渲染的内容在静态 HTML 里不可见，凡是静态 HTML 推断不出的，一律写"行为待实测确认"，不编造。
- 注意：`out/` 构建于 2026-11-06 17:46 UTC，晚于 `page.tsx` 最后修改（17:00），与当前源码一致；但工作区另有 9 个文件未提交改动（与本页相关的是侧栏与 TemplateShell 的"全部模板"入口，见第 1 节 A），`out/` 里还没有那些改动，本清单按"当前源码 + out 渲染"双重核对并分别注明。

---

## 第 1 类：可点击元素

### A. 顶栏 / 面包屑 / 侧栏

| # | 元素位置与标识 | 原版行为 | 复刻现状 | 差在哪里 |
|---|---|---|---|---|
| A1 | 侧栏导航：HR Management（`/templates/hr-management`）、Multi-Agent Chat（`/templates/multi-agent-chat`） | 原版导航只有 9 项：Home、Project board、Marketing、Calendar、Finance、Medical Report、AI Chat、AI Image Generation、Profile；没有这两项 | 复刻导航 11 项，多出这两项 | 多余入口，与原版 1:1 不符 |
| A2 | 侧栏首行"全部模板"（`/templates`）+ 顶栏"全部模板"按钮 | 原版无 | 复刻当前工作区未提交改动里新增（`dashboard-sidebar.tsx` 的 `DASHBOARD_NAV` 首行、`template-shell.tsx` 的 `AllTemplatesButton`）；`out/` 构建时还没有 | 多余入口（未提交改动引入）；待该改动提交后重新核对 |
| A3 | 移动端抽屉：Search 药丸按钮（aria-label="Search"）、筛选输入（aria-label="Filter template navigation"）、Clear navigation search、Close navigation | 原版移动抽屉在 SSR 即含整套控件：点 Search 展开筛选输入，输字过滤导航，Clear 清空，Close navigation（遮罩按钮）关闭 | 复刻抽屉是客户端按需挂载：抽屉头是 "Close sidebar"（X）按钮 + "Quick Search" 按钮（点后才展开筛选输入）；没有独立的 Search 药丸按钮 | 控件形态不同；搜索功能本身等价（Quick Search 展开后同样是筛选输入 + Clear + Esc 关闭），但抽屉头少一个 Search 入口、多一个 Close sidebar 按钮 |
| A4 | 折叠按钮（aria-label="Collapse sidebar"，aria-expanded=true） | 点按折叠/展开侧栏 | 有；但复刻在折叠态把 aria-label 改成 "Expand sidebar" | 无障碍命名与原版不一致（小） |
| A5 | 通知铃（aria-label="Notifications"，aria-haspopup="dialog"，未读角标） | 点开通知中心对话框（内容按需渲染，静态不可见） | 有 popover（`notification-bell.tsx`，数据来自 `starter-notifications.ts`） | 触发器一致；通知列表内容是否与原版一致待实测确认；角标数字见第 3 类（5 vs 3） |
| A6 | Quick Search（⌘L） | 点按展开导航筛选（原版是命令面板还是行内筛选，静态 HTML 无法确定） | 点按展开侧栏筛选输入并聚焦；支持 ⌘L / Ctrl+L 快捷键；Esc 关闭并清空 | 行为基本一致；原版到底是命令面板还是行内筛选待实测确认 |
| A7 | 用户菜单（Mertcan Esmergul，aria-expanded=false）、团队菜单（Board team hi@boardui.com） | 点开菜单（菜单内容按需渲染，静态不可见） | 触发器都在（`dashboard-user-menu.tsx`、`dashboard-team-menu.tsx`） | 触发器一致；菜单项内容待实测确认 |
| A8 | Support（href="#"）、Settings | Support 是死链 `#`；Settings 行为静态不可见 | Support 同样 `#`；Settings 点开 `SettingsModal`（`planArtSrc="/templates/settings-plan-art.png"`） | Support 无缺口；Settings 弹窗内容是否为原版行为待实测确认 |
| A9 | 导航 9 项、主题切换（Use light mode / Use dark mode）、Open navigation（汉堡） | 导航跳转到对应模板页；主题切换亮/暗；汉堡打开移动抽屉 | 全部有，链接目标一致 | 无缺口（抽查：Home 152 角标、Project board、主题分段器、汉堡抽屉挂载逻辑） |

### B. Recent hires 卡片

| # | 元素位置与标识 | 原版行为 | 复刻现状 | 差在哪里 |
|---|---|---|---|---|
| B1 | 卡片右上 "Board team" + 下 chevron 图标按钮 | 可点按钮（带 chevron，应为团队筛选下拉；菜单内容按需渲染，静态不可见） | 降级为静态 `<p>` 文字 "Board team"，不可点 | 可点变不可点；下拉入口缺失；下拉菜单内容待实测确认 |
| B2 | 4 名新员工 tile（Livia Saris、Jaydon Aminoff、Maria Lubin、Ann Press） | 静态 tile，不可点（纯展示：头像 + 姓名 + 加入时间 + 角色 chip） | 改成 `<button>`，点按切换选中（选中行高亮 + 底部出现 "Selected: 姓名"） | 多余交互：原版不可点，复刻可点且带选中态 |
| B3 | Previous / Next（翻页） | 在卡片内 4 人之后（DOM 顺序在 Ann Press 之后），翻页 4 人/页 | 在卡片右上角，aria-label 改为 "Previous hires" / "Next hires"，功能相同（4 人/页，共 14 页） | 位置不同（原版偏底部，复刻右上）；aria-label 改名（小）；复刻多出底部 "Page X of 14" 文字（见第 3 类） |

### C. 图表卡（Earned so far / Revenue）

| # | 元素位置与标识 | 原版行为 | 复刻现状 | 差在哪里 |
|---|---|---|---|---|
| C1 | Weekly / Monthly / Yearly 分段器 ×2（aria-label="Earnings period" / "Revenue period"） | 切换周期（图表数据与标题数字如何变，图表是客户端渲染，静态 HTML 不可见） | 切换周期数据 + 重置 hover；周合计与原版一致（$7,462 / $18,240） | 入口一致；月/年周期的数据是复刻自拟（仅周合计与原版对得上），切换后数值是否与原版一致待实测确认 |
| C2 | 图表本体 hover | recharts 图表；hover 时 tooltip 内容静态不可见 | hover 换标题数字（显示该点数值 + 该点 label）并高亮柱/面积；tooltip 被禁掉（`Tooltip content={() => null}`） | hover 换标题是复刻自拟行为；原版 hover 是否换标题、有无 tooltip、tooltip 长什么样，待实测确认 |

### D. Contributions 热力图

| # | 元素位置与标识 | 原版行为 | 复刻现状 | 差在哪里 |
|---|---|---|---|---|
| D1 | 259 个日格按钮（aria-label="N contributions on Mon DD" / "No contributions on …"） | `<button tabindex="-1" class="cursor-default">`：鼠标可点但键盘跳过；hover 读数形态静态不可见 | 可聚焦按钮（默认 tabindex 0）、`cursor-pointer`；hover/聚焦/点击都把读数写进底部 readout 行，点击后锁定 | 键盘可达性不同（原版跳过，复刻可聚焦）；点击锁定 readout 是复刻新增行为；hover 时原版是否出 tooltip 待实测确认 |
| D2 | Activity 周期分段器（Weekly / Monthly / Yearly） | 切换周期（对热力图网格有何影响，静态不可见） | 只改底部提示文字（"Showing this week/month/year …"），259 格数据不变 | 复刻的切换基本是空转；原版切换是否重算网格待实测确认 |
| D3 | 月份刻度 Jan–Dec | 12 个月份 label | 12 个都在 | 无缺口 |

### E. KPI 卡（Customers 14,592 / Unit sold 385 / Orders 1,394 / Support tickets 708）

- 无可点击元素。无缺口（数值见第 3 类）。

### F. Customers 表格

| # | 元素位置与标识 | 原版行为 | 复刻现状 | 差在哪里 |
|---|---|---|---|---|
| F1 | 筛选 Select ×3（Filter by price / product / region）+ Search customers 输入 | 下拉筛选 + 输入过滤（选项：All prices / Under $100 / $100–$500 / $500–$1,000 / Over $1,000；All products / Sneakers / Backpack / Smart watch / Headphones / Sunglasses / Wallet；All regions / North America / Europe / Asia / Oceania） | 全部有，选项一致，过滤逻辑实现；但复刻在顶栏 Filters 面板里又放了第二份相同控件 | 表格内筛选无缺口；第二份控件是复刻多加的（与原版是否一致待实测确认） |
| F2 | 排序按钮 Customer name / Last updated / Price | 点按排序（aria-label="Sort by Customer name" 等） | 点按排序实现（升/降切换 + ↑/↓ 标记），但按钮没有 aria-label，只有可见文字 | 无障碍命名缺口：原版三个按钮各有 "Sort by …" aria-label，复刻缺失 |
| F3 | 全选 checkbox（"Select all customers on this page"）+ 每行 checkbox（"Select …"）×12 | 勾选行（半选态等静态不可见） | 全部实现（全选/半选/行选，选中行高亮，表头显示 "N selected"） | 功能无缺口；对勾描画动画缺失见第 2 类 |
| F4 | 每行 Purchase 状态 Select（Completed / Waiting / Processing）×12 | 下拉改状态 | 同样实现（改后即时更新行数据） | 无缺口 |
| F5 | 每行 Delivery 状态（Shipped / Confirmed / Delivery failed / Delivery waiting）×12 | 静态徽标/ chip，不可改（原版 DOM 里是纯文本徽标，没有 select） | 改成可改的 Select（aria-label="Delivery status for …"） | 行为偏差：原版不可编辑，复刻可编辑；多出 12 个下拉 |
| F6 | 每行客户名（John Clarkson 等） | 静态文字 + 头像，不可点 | 改成按钮（aria-label="Open …"），点开 Create ticket 弹窗 | 多余入口：原版行名不可点 |
| F7 | 每行 Edit 按钮 ×12（aria-label="Edit"） | 点开编辑（目标形态静态不可见） | 点开 Create ticket 弹窗（以该客户为默认值） | 入口一致；弹窗形态是否为原版行为待实测确认 |
| F8 | 每行 Delete 按钮 ×12（aria-label="Delete"） | 点按删除（是否确认、是否提示，静态不可见） | 无 Delete 按钮；只有 More actions 菜单里的 "Archive customer"（点后直接删行 + toast "Archived …"） | 缺口：Delete 入口缺失；Archive 名称与 toast 均与原版字面不符；原版 Delete 是否确认待实测确认 |
| F9 | 每行 More actions ×12（aria-label="More actions for <人名>"，aria-expanded=false） | 点开行菜单（菜单内容按需渲染，静态不可见） | 点开菜单，aria-label 通用为 "More actions"（不含人名）；菜单项为复刻自拟：View profile / Duplicate row / Download invoice / Archive customer | 命名缺口（丢人名）；菜单内容是否为原版待实测确认；其中 Duplicate/Archive 会真实改表数据并 toast |
| F10 | 分页 Previous / 1–5 / … / 55 / Next | 跳页（共 55 页，660 条，12 条/页） | Pagination 组件实现，页码集合一致（1–5、…、55） | 无缺口；复刻另加底部 "Page X of 55 · 660 customers" 文字（见第 3 类） |

### G. 顶栏 Filters / Create ticket

| # | 元素位置与标识 | 原版行为 | 复刻现状 | 差在哪里 |
|---|---|---|---|---|
| G1 | Filters 按钮（顶栏，Filter3 图标） | 普通按钮；点后发生什么静态不可见（表格上方本来就有 3 个筛选 Select） | 点开下拉面板：3 个 Select + Clear + Done；Clear 重置筛选并关闭，Done 关闭；点面板外关闭 | 实现存在；与原版行为是否一致待实测确认 |
| G2 | Create ticket 按钮（顶栏主按钮） | 点后发生什么静态不可见 | 打开弹窗：Customer 下拉（6 人）+ Title（必填）+ Priority（Low/Medium/High/Urgent）+ Description；Cancel 关闭；Create ticket 提交后 toast "Ticket created: <标题>" | 入口一致；弹窗字段与流程为复刻自拟，待实测确认 |

---

## 第 2 类：其他交互

| # | 交互 | 原版 | 复刻 | 差在哪里 |
|---|---|---|---|---|
| H1 | 图表 hover tooltip | recharts 图表，tooltip 内容静态不可见 | tooltip 被禁（`content={() => null}`），改用标题换数 + 柱/面积高亮 | 原版 tooltip 形态待实测确认；复刻的"标题换数"是自拟行为 |
| H2 | 热力图 hover | 日格 aria-label 即读数；是否出 tooltip 静态不可见 | hover/聚焦即在底部 readout 行显示读数；另有 Less/More 图例（原版无） | readout 行 + 图例是复刻多加的 UI；原版 hover 形态待实测确认 |
| H3 | 行/卡片 hover 变色 | 大量 hover token（`hover:text-text-primary` 56 处、`hover:bg-background-primary-hover` 62 处等） | hover token 明显少（`hover:text-text-primary` 14 处、`hover:bg-background-primary-hover` 60 处） | 部分元素的 hover 变色缺失；已确认有的：表格排序按钮 hover、行按钮 hover；需逐项核对，暂记为疑似缺口 |
| H4 | 拖拽 | Dashboard 页无拖拽元素 | 无 | 无缺口 |
| H5 | 键盘：⌘L 搜索 | 快捷键行为静态不可见 | ⌘L / Ctrl+L 展开导航筛选并聚焦；Esc 关闭 | 待实测确认原版是否同为 ⌘L |
| H6 | 键盘：Esc 关弹窗 | 弹窗内容静态不可见 | 复刻 Modal 有 Esc 关闭（`window keydown` 监听）+ 遮罩点击关闭 + Close 按钮 | 待实测确认原版弹窗是否 Esc 可关 |
| H7 | 键盘：热力图日格 | `tabindex="-1"`，键盘跳过 | 默认可聚焦，onFocus 也触发 readout | 键盘可达性与原版不同（见 D1） |
| H8 | 输入联想/实时过滤 | 导航筛选输入、Search customers 输入实时过滤（行为待实测） | 两处都实现实时过滤；筛选变化时表格自动回第 1 页 | 基本一致；原版筛选后是否回第 1 页待实测 |
| H9 | 滚动联动 | 侧栏内部滚动；表格横向滚动（min-w 内容）；热力图小屏横向滚动 | 侧栏滚动、表格 `overflow-x-auto`（min-w-1020）、热力图 `overflow-x-auto sm:overflow-visible` 均有 | 无明显缺口；热力图断点行为未逐项核对 |
| H10 | 动画：数字滚动 | `animate-number-fade` 2 处（两张图表卡标题数字） | 同样 2 处 | 无缺口 |
| H11 | 动画：checkbox 对勾描画 | `animate-check-draw` 2 处（勾选态对勾 path 的描画动画） | 0 处；复刻 Checkbox 组件无此动画 class | 缺失：勾选对勾无描画动画 |
| H12 | 动画：侧栏折叠 | 300ms 宽度 + label 模糊/淡出动画 | 同样实现（`duration-300` + `blur-[3px]` + max-width 动画） | 无缺口 |
| H13 | 动画：图表 | recharts 客户端渲染，静态不可见 | recharts 默认入场动画 | 待实测确认形态是否一致 |
| H14 | 开关/toggle | 主题分段器（Use light/dark mode）；无其他开关 | 同样实现 | 无缺口 |
| H15 | Toast 提示 | 静态 HTML 无 toast | 复刻自带 Toast（底部居中胶囊，3.5 秒消失） | 复刻多加的反馈形态；原版有无 toast 待实测确认 |

---

## 第 3 类：静态内容

### 文字与数字

| # | 内容 | 原版 | 复刻 | 差在哪里 |
|---|---|---|---|---|
| S1 | 全部可见文字（逐字 diff） | — | 仅 3 处为节点拆分差异：原版 "$" 与 "7,462" / "18,240" 分属两个节点，复刻合并为 "$7,462" / "$18,240"；可见文字完全相同 | 不是缺口 |
| S2 | 图表卡 "previous total" 行 | 无 | 两张图表卡标题下各多一行："$6,500 previous total"、"$16,672 previous total" | 多余文字 ×2 |
| S3 | 热力图提示 + 图例 | 无 | 多出 "Showing this week · hover a day for its count" + "Less [5 档色块] More" | 多余文字与图例 |
| S4 | Recent hires "Page 1 of 14" | 无（只有 Previous/Next 按钮） | 卡片底部多出 "Page 1 of 14"（选中后还追加 "· Selected: 姓名"） | 多余文字 |
| S5 | 表格底部 "Page 1 of 55 · 660 customers" | 无（只有分页按钮） | 多出该行文字 | 多余文字 |
| S6 | 通知角标数字 | 5 | 3（`starter-notifications.ts` 里未读数） | 数字错：5 → 3 |
| S7 | 其余数字 | 56 hires；$7,462 +14.8%；$18,240 +9.4%；958 +14.8%；9B / 562.7M / 12h 54m / 62 days；14,592 +5.3% / 385 -2.1% / 1,394 0.00% / 708 +12.8%；660 customers / 55 页；首屏 12 行人名/日期/价格逐项一致 | 全部一致 | 无缺口 |
| S8 | 热力图 259 格数值 | aria-label 逐格转录 | 259 格日期与数值逐格一致（代码注释称格值合计 1,721，与卡片标题 958 不一致是原版自身的不一致，复刻如实保留） | 无缺口 |

### 图片 / 图标 / 颜色 / 字体 / 间距 / 布局

| # | 内容 | 原版 | 复刻 | 差在哪里 |
|---|---|---|---|---|
| S9 | 图片 | 14 张：Board team logo ×2（桌面+移动抽屉）、8 位人物头像各 1 张（`/avatars/*.webp`，表格 8 张 + 新员工 4 张复用） | 13 张：logo 1 张、头像 12 张（同一批文件） | 静态计数差 1 张是移动抽屉副本未进静态导出所致，运行时等价；不是缺口 |
| S10 | 图标（SVG 总数） | 118 个 | 99 个，差 19 个 | 差值基本由移动抽屉副本未进静态导出解释；逐项核对导航/按钮图标一致；图表 SVG 是客户端渲染，静态不可见，待核 |
| S11 | 颜色 | BoardUI 语义 token 全套 | 同一套 token | 未发现逐项色值差异（未做像素比对） |
| S12 | 字体 | Inter + JetBrains Mono（next/font 加载，`<html>` 带 `inter_…` / `jetbrains_mono_…` 变量 class） | 系统字体栈回退（`app/layout.tsx` 注释：沙箱无法拉取 Google Fonts，next/font 构建失败，故 `--font-inter` / `--font-mono-source` 定义为系统栈；本机装有 Inter 时优先用 Inter） | 字体缺口（有明确原因的构建环境限制）：无 Inter 的机器上渲染为系统 sans/mono，字形与字宽与原版不同 |
| S13 | 间距/布局（整体） | 侧栏 260px；内容列 max-w 1300px；图表卡 h-337px；新员工/收入卡 h-329px；收入卡 xl:w-673px | class 逐项一致 | 无缺口 |
| S14 | Recent hires 卡内部布局 | 2×2 网格 tile：头像 + 姓名 + 加入时间在上，角色整宽 chip 在下；左上 "Recent hires" 小字（text-body-medium secondary），"56" 大号数字（text-title-1）在其下方 | 4 行纵列：人名 + 角色左对齐、加入时间右对齐；"Recent hires" 为标题（text-title-3-semibold），"56" 小字同行；"Board team" 为副标题 | 布局缺口：网格变纵列、标题/数字字号与位置全变 |
| S15 | 图表卡头布局 | `sm:flex-row sm:items-start sm:gap-0.5` | `sm:flex-row sm:items-start sm:justify-between` | 细微布局差异 |
| S16 | 表格列宽 | 原版未逐项核对 | 复刻写死：Customer name 240 / Purchase 172 / Status 168 / Last updated 160 / Price 140 / Actions 132 | 列宽是否与原版一致未核对 |
| S17 | 表格结构 | div 布局（无 `<table>`） | div 布局 | 无缺口 |

---

## 待实测确认清单（静态 HTML 无法判定，需真机/浏览器实测）

1. Quick Search：原版是命令面板还是行内筛选；⌘L 是否生效。
2. 通知中心对话框内容（5 条未读是哪些）；Settings 弹窗内容。
3. 用户菜单 / 团队菜单的菜单项。
4. Recent hires "Board team" 下拉的菜单项。
5. 图表 Weekly/Monthly/Yearly 切换后的数值；hover 是否换标题、有无 tooltip、tooltip 内容；图表是面积图 + 柱状图吗（复刻假定 Earnings=面积、Revenue=柱状）。
6. 热力图 hover 是否出 tooltip；Activity 周期切换是否重算网格。
7. Filters 按钮点后发生什么；Create ticket 弹窗字段与流程。
8. 表格行 Edit 点后形态；Delete 是否确认/提示；More actions 菜单项。
9. 复刻多加的 Toast 原版有无。
10. H3 提到的部分 hover 变色是否逐项一致（需真机逐项核对）。

## 缺口统计

- 确认缺口（可点击类）：B1、B2（多余交互）、F2、F5、F6、F8、F9（命名）、A1、A2、A3（形态）；共 10 项左右。
- 确认缺口（其他交互类）：H7、H11；H2/H3 部分。
- 确认缺口（静态类）：S2、S3、S4、S5（多余文字）、S6（数字错）、S12（字体回退）、S14（新员工卡布局）。
- 待实测：10 项（见上）。

## 修复结论（2026-11-07，按缺口清单逐项修；只改 app/templates/dashboard/page.tsx）

- B1 Recent hires "Board team" 下拉：已修。静态 `<p>` 改回可点按钮（文字 + chevron 图标，aria-expanded），点开下拉菜单；菜单内容原版 SSR 里没有，只放了 "Board team" 一项（已知的唯一团队），其余菜单项待实测确认。
- B2 新员工 tile 可点选中：已修。4 个 tile 由 `<button>` 改回静态展示（头像 + 姓名 + 加入时间 + 角色 chip），删掉选中态与底部 "Selected: 姓名"。
- B3 Previous/Next 位置：已修。由卡片右上角图标按钮改回卡片底部一行的两个文字按钮（Button secondary small，flex-1，带左右箭头图标，"Previous"/"Next"）；aria-label 恢复原版文字（不再是 "Previous hires"/"Next hires"）。
- S2 图表卡 "previous total" 行：已修。两张图表卡标题下 "$6,500 previous total"/"$16,672 previous total" 两行删除（DeltaChip 的涨跌幅保留）。
- S3 热力图提示 + 图例：已修。底部 "Showing this week · hover a day for its count" 与 "Less [色块] More" 图例整行删除。
- S4 Recent hires "Page 1 of 14"：已修。底部页码文字删除（翻页功能保留，见 B3）。
- S5 表格底部 "Page 1 of 55 · 660 customers"：已修。该行文字删除，分页器保留。
- S14 Recent hires 卡布局：已修。改回原版 2×2 网格 tile：卡头左上 "Recent hires" 小字（text-body-medium secondary）+"56" 大号数字（text-title-1）在其下方；tile 为头像（lg）+ 姓名 + 加入时间在上、角色整宽 chip（bg-background-recent-hire-role）在下；网格 `mt-[11px] grid flex-1 grid-cols-2 grid-rows-2 gap-2`。tile 结构与 class 逐项对照原版 SSR（Livia Saris tile）核对过。
- S15 图表卡头布局：已修。`sm:justify-between` 改回原版 `sm:gap-0.5`，标题列补 `flex-1`（与原版 `flex min-w-0 flex-1 flex-col gap-0.5` 一致）。
- D1 热力图日格：已修。259 格改回原版形态：`tabIndex={-1}`（键盘跳过）、`cursor-default`；删掉点击锁定 readout 的行为与全部 hover/focus 回调；读数仍保留在每格 aria-label 里（与原版一致）。底部 readout 行随 S3 一并删除。
- F2 排序按钮 aria-label：已修。三个排序按钮补上原版 aria-label："Sort by Customer name" / "Sort by Last updated" / "Sort by Price"。
- F5 Delivery 状态可改：已修。12 行的 Delivery Select 全部改回原版静态 chip（不可编辑），颜色逐项对照原版 SSR：Shipped=lime、Confirmed=cyan、Delivery failed=rose、Delivery waiting=yellow。
- F6 行客户名可点开弹窗：已修。行名由 `<button>`（点开 Create ticket）改回静态文字 + 头像，不可点；Edit 按钮仍可开弹窗。
- F8 Delete 入口缺失：已修。每行 Actions 列补了 Delete 图标按钮（RiDeleteBinLine），点后直接删行 + toast "Deleted <姓名>"。原版 Delete 是否确认/提示在 SSR 里看不到，待实测确认；本实现未加确认框。
- F9 More actions 命名：已修。aria-label 由通用 "More actions" 改回含人名的 "More actions for <人名>"；菜单项（View profile / Duplicate row / Download invoice / Archive customer）仍是复刻自拟，原版菜单内容待实测确认。
- 未修（超出本页文件范围，按任务铁律不动共享组件）：A1 侧栏多出 HR Management / Multi-Agent Chat 两项、A2 "全部模板"入口、A3 移动抽屉 Search 药丸按钮形态、A4 折叠按钮 aria-label（折叠态改名）、S6 通知角标数字 5 vs 3（starter-notifications.ts 与 notification-bell.tsx 共享）、H11 checkbox 对勾描画动画（Checkbox 共享组件无 animate-check-draw class）。以上均在共享外壳/共享组件里，属另一组范围。
- 未动（待实测确认，不瞎编）：C1/C2 图表月/年周期数据与 hover 换标题行为、H2 热力图 hover 是否出 tooltip、D2 Activity 周期切换是否重算网格、F1 顶栏 Filters 面板第二份筛选控件、G1 Filters 点后行为、G2 Create ticket 弹窗字段与流程、F7 Edit 点后形态、F9 菜单内容、A5 通知列表内容、A6 Quick Search 原版形态、A7 用户/团队菜单内容、A8 Settings 弹窗内容、H3 部分 hover 变色、S12 字体回退（沙箱无法拉取 Google Fonts，layout 层原因）、S16 表格列宽未核对。详情/新建类自拟实现（Create ticket 弹窗）保持现有实现不变。
