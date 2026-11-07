# Project Board 缺口清单

盘点日期：2026-11-07。只盘点、不修。

## 基线与计数方法

- 原版来源：`tpl-pages/project-board.html`（BoardUI 线上页 `https://www.boardui.com/templates/project-board` 的本地快照），并用 `browser.open` 抓线上页文本交叉核对过（线上与本地快照一致：5 列、13 张卡片、列计数 3/8、3/5、2/4、1/3、4/6，人像来自 randomuser.me）。
- 复刻来源：`app/templates/project-board/page.tsx`（源码）+ `out/templates/project-board.html`（静态导出渲染结果，用于逐字逐项对照）。
- 元素总数：**74 个**（原版静态 DOM 里的可点击元素总数；去重后不同标识 59 个；含侧栏桌面/移动两份副本）。复刻渲染 DOM 为 61 个（去重 57 个）。
- 行为判定：弹窗/菜单/抽屉/详情面板等按需渲染的内容在静态 HTML 里不可见，凡是静态 HTML 推断不出的，一律写"行为待实测确认"，不编造。
- 注意：`out/` 构建于 2026-11-06 17:46 UTC，晚于 `page.tsx` 最后修改（16:12），与当前源码一致；但工作区另有 9 个文件未提交改动（与本页相关的是侧栏与 TemplateShell 的"全部模板"入口，见第 1 节 A），`out/` 里还没有那些改动，本清单按"当前源码 + out 渲染"双重核对并分别注明。

---

## 第 1 类：可点击元素

### A. 顶栏 / 面包屑 / 侧栏（与 Dashboard 共用 TemplateShell，结论相同处简写）

| # | 元素位置与标识 | 原版行为 | 复刻现状 | 差在哪里 |
|---|---|---|---|---|
| A1 | 面包屑 Board team / Mertcan | 跳转 `/templates/dashboard`（原版本页两个面包屑链接的 href 都是 `/templates/dashboard`） | href="#" 死链 | 缺口：面包屑跳转缺失（Dashboard 页原版本就是 `#`，本页原版不是） |
| A2 | 侧栏导航：HR Management、Multi-Agent Chat | 原版导航 9 项，无这两项 | 复刻导航 11 项，多出这两项 | 多余入口，与原版 1:1 不符 |
| A3 | 侧栏首行"全部模板" + 顶栏"全部模板"按钮 | 原版无 | 复刻当前工作区未提交改动里新增；`out/` 构建时还没有 | 多余入口（未提交改动引入）；待该改动提交后重新核对 |
| A4 | 通知铃（未读角标） | 角标 5；点开通知中心对话框（内容静态不可见） | 角标 3；有 popover | 数字错见第 3 类；通知内容待实测确认 |
| A5 | 导航 9 项、主题切换、Open navigation、Quick Search、用户/团队菜单、Support/Settings | 与 Dashboard 页相同 | 与 Dashboard 复刻相同 | 同 Dashboard 清单 A4–A9；菜单内容待实测确认 |
| A6 | 移动抽屉 Search 药丸按钮 / 筛选输入 / Clear / Close navigation | 原版抽屉 SSR 即含整套控件 | 复刻抽屉客户端挂载，头是 "Close sidebar" + "Quick Search" 按钮 | 控件形态不同，搜索功能等价（同 Dashboard 清单 A3） |

### B. 工具栏（标题 "BoardUI Design Tasks" 下方一行）

| # | 元素位置与标识 | 原版行为 | 复刻现状 | 差在哪里 |
|---|---|---|---|---|
| B1 | Open project inbox（图标按钮，aria-label="Open project inbox"） | 点开项目收件箱（面板/对话框形态与内容静态不可见） | 无此按钮 | 缺失：整个入口缺失 |
| B2 | Sort tickets（图标按钮，aria-expanded=false，菜单触发器） | 点开看板级排序菜单（菜单内容静态不可见） | 无看板级排序；只有每列 "More options" 里的列内排序 | 缺失：看板级排序入口缺失；复刻的列内排序不能替代 |
| B3 | Filter tickets（图标按钮，aria-expanded=false，菜单触发器） | 点开筛选菜单（内容静态不可见） | 无 | 缺失：整个筛选入口缺失 |
| B4 | Display options（图标按钮，aria-expanded=false，菜单触发器） | 点开显示选项菜单（内容静态不可见） | 无 | 缺失：整个显示选项入口缺失 |
| B5 | New ticket（顶栏主按钮） | 点开新建（形态与字段静态不可见） | 点开 New ticket 侧栏（默认 Backlog），见第 1 节 F | 入口一致；面板内容是否为原版待实测确认 |

### C. 列头（Backlog / To do / In progress / Review / Done）

| # | 元素位置与标识 | 原版行为 | 复刻现状 | 差在哪里 |
|---|---|---|---|---|
| C1 | More options for <列名> ×5（列头右上 "…" 按钮） | 点开列菜单（菜单内容按需渲染，静态不可见） | 点开排序菜单：Sort by priority / Sort by newest / Sort by title A–Z | 触发器一致；菜单内容是否为原版待实测确认（复刻的"仅排序"菜单是自拟） |
| C2 | Add ticket to <列名> ×5 | 列头右上小 + 图标按钮（`size-5`，与 More options 并排） | 列底整宽文字按钮 "Add ticket"（`mx-2 mb-2`，带 + 图标） | 位置与形态都不同：原版在列头、图标按钮；复刻在列底、整宽文字按钮；accessible name 丢列名（原版 "Add ticket to Backlog"，复刻通用 "Add ticket"） |
| C3 | 列计数（Backlog 3/8、To do 3/5、In progress 2/4、Review 1/3、Done 4/6） | 纯文本 "3/8"（无空格） | 文本 "3 / 8"（带空格） | 文字细微差异（小） |

### D. 卡片（13 张）

| # | 元素位置与标识 | 原版行为 | 复刻现状 | 差在哪里 |
|---|---|---|---|---|
| D1 | 卡片本体（div role=button tabindex=0 aria-roledescription="sortable" aria-haspopup="dialog" aria-label="Open <id>: <标题>"，aria-describedby 指向实时播报区） | 点击打开详情对话框；可拖拽换列（dnd-kit 风格：无 draggable 属性，`touch-manipulation` + `cursor-grab`）；键盘拖拽支持情况静态不可见 | article role=button tabindex=0，同样 aria-label，onClick 打开右侧详情侧栏；HTML5 draggable 拖拽；Enter/Space 打开详情 | 入口与拖拽基本一致；复刻缺 `aria-roledescription="sortable"` 与 `aria-haspopup="dialog"`（无障碍属性缺口）；详情面板形态与内容是否为原版待实测确认；拖拽机制不同（见第 2 类） |
| D2 | Actions for <id>（每卡右上 "…" 按钮，hover 才出现） | 原版无此按钮（卡片内除本体外无任何按钮） | 复刻新增：平时 `opacity-0`，hover 卡片或聚焦时出现；点开菜单：Move to 各列 + Open details | 多余入口 + 多余 hover 行为：原版卡片上没有任何 hover 出现的操作按钮 |
| D3 | 卡片内头像组（Maya Chen、Priya Shah 等） | 人像照片（`<img>`），容器 `aria-label="Maya Chen, Priya Shah"` | 姓名首字母色块（Avatar initials），容器 aria-label 相同 | 照片变首字母，见第 3 类 S5；结构与无障碍标签一致 |

### E. 详情面板（点卡片后）

原版详情面板的任何内容都不在静态 HTML 里（`aria-haspopup="dialog"` 只证明会开对话框），以下复刻实现全部是自拟设计，逐项标待实测确认：

| # | 元素位置与标识 | 原版行为 | 复刻现状 | 差在哪里 |
|---|---|---|---|---|
| E1 | 面板本身 | 点卡片开对话框（形态未知：弹窗/侧栏/全屏未知） | 右侧 440px 侧栏（`fixed inset-0 flex justify-end`），遮罩点击关闭，X 关闭 | 形态是否为原版待实测确认 |
| E2 | 标题（可编辑 textarea）、Status / Priority / Project 三个 select、Opened 日期 | 未知 | 全部可改；Status 切换会移动卡片到对应列；Priority/Project 即时改卡片属性 | 待实测确认 |
| E3 | Assignees 多选 chips（5 人，aria-pressed） | 未知 | 点按增删负责人 | 待实测确认 |
| E4 | Description 文本域 | 未知 | 可编辑；复刻自拟了 13 张卡片的描述文案（原版静态 HTML 无任何描述文本） | 描述文案为复刻编写，待实测确认 |
| E5 | Token usage 柱状图（Mon–Sun，hover 显示数值） | 未知（原版静态 HTML 无 token 数据） | 7 柱自拟数值（每卡不同），hover 显示 "12.4K tokens" 等 | 图表与数值均为复刻自拟，待实测确认 |
| E6 | Comments 列表 + 输入框 + Post 按钮 | 未知（原版静态 HTML 无评论数据） | 评论为复刻编写；输入框 Enter 发送或点 Post；新评论署名 Mertcan Esmergul、日期 "6 Nov" | 评论内容为复刻编写，待实测确认 |
| E7 | Delete ticket / Done / Close | 未知 | Delete ticket 直接删卡并关闭面板（无确认）；Done 关闭面板 | 待实测确认；注意原版卡片菜单里有无删除入口未知 |

### F. New ticket 面板（点 New ticket 或 Add ticket 后）

| # | 元素位置与标识 | 原版行为 | 复刻现状 | 差在哪里 |
|---|---|---|---|---|
| F1 | 面板本身 | 点 New ticket 后的形态与字段静态不可见 | 右侧 440px 侧栏（与详情面板同款） | 形态是否为原版待实测确认 |
| F2 | Title 输入（Enter 创建）、Project / Priority / Column 三个 select、Assignees 多选、Cancel / Create ticket | 未知 | 全部实现；标题必填（空标题禁用提交）；新建卡片 id 为 "BE-100" 起自增（按 Project 取前缀 DS/FE/BE）；日期写死 "Since 6 Nov"；提交后自动打开新建卡片的详情面板 | 字段与流程为复刻自拟，待实测确认；新建卡片编号规则与日期写法是否与原版一致未知 |

### G. 看板容器与列区域

| # | 元素位置与标识 | 原版行为 | 复刻现状 | 差在哪里 |
|---|---|---|---|---|
| G1 | 看板外层容器（role=region aria-label="Project board columns" tabindex=0） | 横向滚动条带 | 同样实现（`role="region"` + 同名 aria-label + tabIndex=0，横向滚动） | 无缺口 |
| G2 | 每列列表容器（role=region aria-label="<列名> tickets" tabindex=0，如 "Backlog tickets"） | 每列是可聚焦的 region | 复刻列容器是 `<section aria-label="<列名> column">`，无 role=region、无 "<列名> tickets" 标签、不可聚焦 | 区域标签缺口：列的 region 语义与无障碍名称缺失 |

---

## 第 2 类：其他交互

| # | 交互 | 原版 | 复刻 | 差在哪里 |
|---|---|---|---|---|
| H1 | 拖拽换列 | dnd-kit 风格：卡片无 `draggable` 属性（全页 0 处），`role=button` + `aria-roledescription="sortable"` + `touch-manipulation` + `cursor-grab`/`active:cursor-grabbing`；卡片外层有 motion 入场动画（`opacity:1;filter:blur(0px);transform:none`）；拖后落点规则静态不可见 | HTML5 原生 draggable：`draggable` + onDragStart/End，目标列高亮（`ring-accent-500` + 底色变 hover），被拖卡片 `opacity-40`；拖到 Done 列时日期改写为 "Completed 6 Nov"（写死），卡片追加到目标列末尾 | 机制不同（指针事件库 vs 原生 DnD）；复刻无卡片入场动画；拖到 Done 的日期改写与末尾追加规则是否为原版待实测确认 |
| H2 | 键盘拖拽 | 疑似支持：sortable + `aria-describedby` 指向的实时播报区（播报区内容按需渲染，静态不可见）；能否键盘拖拽无法从静态 HTML 确认 | 无键盘拖拽：Enter/Space 只开详情；移动卡片只能靠鼠标拖拽或 hover 菜单里的 Move to | 键盘操作缺口（待实测确认原版是否支持键盘拖拽；若支持，复刻缺失） |
| H3 | 键盘：卡片 Enter/Space | role=button tabindex=0，键盘可达 | onKeyDown 实现 Enter/Space 打开详情 | 无缺口 |
| H4 | 键盘：Esc 关面板 | 详情/新建面板内容静态不可见 | 两个侧栏面板都没有 Esc 处理（只有遮罩点击与 X/Close 按钮）；Dashboard 的 Modal 有 Esc，Project Board 没有 | 键盘缺口：Esc 不能关面板（与原版比较待实测，但复刻自身两页不一致） |
| H5 | 键盘：评论 Enter 发送 / 新建标题 Enter 创建 | 未知 | 都实现（Enter 触发 postComment / createTicket） | 待实测确认 |
| H6 | hover：卡片 | `hover:shadow-sm hover:ring-border-button-hover` | 同样实现 | 无缺口 |
| H7 | hover：卡片操作按钮 | 原版卡片上无任何 hover 出现的东西 | Actions "…" 按钮平时透明，hover 卡片时出现（`group-hover:opacity-100`） | 多余 hover 行为（见 D2） |
| H8 | hover：TokenChart 柱 | 原版无此图表 | 详情面板内柱 hover 显示数值（`group-hover:opacity-100`）+ 柱变 active 色 | 复刻自拟图表的 hover 行为，待实测确认 |
| H9 | hover：头像组 | 原版头像组无特殊 hover | 复刻无 | 无缺口 |
| H10 | 输入联想 | 本页无联想输入（工具栏筛选是菜单式） | 同样无；详情/新建面板的输入框是普通输入 | 无缺口 |
| H11 | 滚动联动 | 看板横向滚动（列宽 273px）；列内纵向滚动 | 同样实现（外层 `overflow-x-auto`，列内 `overflow-y-auto`，`max-lg:overflow-visible`） | 无缺口；复刻空列文案 "No tickets — drop one here or add a new ticket." 是自拟（原版空列文案未知） |
| H12 | 动画：卡片入场 | motion 入场动画（opacity/blur/transform，静态 HTML 可见初始态 style） | 无入场动画；只有拖动时的 `transition-[box-shadow,opacity]` | 缺失：卡片入场动画 |
| H13 | 动画：拖动过渡 | `transition-[box-shadow,opacity] duration-200 ease-out motion-reduce:transition-none` | 同样实现 | 无缺口 |
| H14 | 动画：reduced motion | `motion-reduce:transition-none` 13 处（每卡） | 同样 13 处 | 无缺口 |
| H15 | 开关/toggle | 无 | 无 | 无缺口 |

---

## 第 3 类：静态内容

### 文字与数字

| # | 内容 | 原版 | 复刻 | 差在哪里 |
|---|---|---|---|---|
| S1 | 全部可见文字（逐字 diff） | — | 原版缺失 0 项：列名、计数、13 张卡片的 id/tag/优先级/应用名/标题/日期逐字一致 | 无缺口 |
| S2 | 提示行 | 无 | 多出 "13 tickets across 5 columns · drag a card to another column, or open it to edit." | 多余文字 |
| S3 | 列底 "Add ticket"、卡片菜单 "Move to / Open details"、详情/新建面板全部文字 | 无（原版无这些控件与面板） | 复刻新增 | 多余文字（控件新增的派生） |
| S4 | 列计数 | 3/8、3/5、2/4、1/3、4/6 | 3 / 8、3 / 5、2 / 4、1 / 3、4 / 6（带空格） | 文字细微差异（小） |
| S5 | 通知角标数字 | 5 | 3 | 数字错：5 → 3（同 Dashboard） |

### 图片 / 图标 / 颜色 / 字体 / 间距 / 布局

| # | 内容 | 原版 | 复刻 | 差在哪里 |
|---|---|---|---|---|
| S6 | 图片 | 19 张：Board team logo ×2（桌面+移动抽屉）+ 18 张人像照片（`https://randomuser.me/api/portraits/…`，Maya Chen women/44、Priya Shah women/65、Elif Kaya women/68、Daniel Kim men/46、Noah Williams men/32） | 1 张：logo 1 张；18 张人像全部缺失 | 重大缺口：18 张人像照片缺失，复刻用姓名首字母色块代替（`page.tsx` 注释说明：randomuser.me 沙箱 egress 不可达、会渲染破图，故用首字母代替） |
| S7 | 图标（SVG 总数） | 80 个 | 61 个，差 19 个 | 差值主要由移动抽屉副本未进静态导出解释；其余见 S8 |
| S8 | 应用 chip 图标 | 文件夹图标（RemixIcon folder，`opacity-30`）+ 应用名（`text-text-secondary`），chip 底 `bg-background-primary-default` + `ring-1` | 彩色圆点（`size-1.5 rounded-full`，按应用取 chart 色）+ 应用名（`text-text-primary`） | 图标错：13 张卡片的应用 chip 图标与文字颜色都与原版不同 |
| S9 | 颜色：卡片暗色态 | `dark:bg-background-primary-default/60`（暗色下卡片 60% 不透明） | 无此 class | 暗色缺口：暗色模式下卡片底色与原版不同 |
| S10 | 颜色：其余 | 优先级色 Low 蓝 / Medium 黄 / High 橙 / Urgent 玫瑰；列底色、圆角一致 | 一致 | 无缺口 |
| S11 | 字体 | Inter + JetBrains Mono（next/font） | 系统字体栈回退（同 Dashboard 清单 S12：沙箱无法拉取 Google Fonts） | 字体缺口（有明确原因的构建环境限制） |
| S12 | 间距/布局 | 列宽 273px（`auto-cols-[273px]`）、卡片 `rounded-xl bg-background-primary-default p-3`、列 `rounded-2-5xl bg-background-secondary-default`、卡片内 id/tag 行、优先级 + 应用 chip 行、标题 + 日期行 | class 逐项一致 | 无缺口 |
| S13 | 头像组间距 | 容器带 `ps-1` | 无 `ps-1` | 细微间距差异 |
| S14 | 列头 Add 按钮位置 | 列头右上（与 More options 并排） | 列底整宽按钮 | 布局缺口（见 C2） |
| S15 | 面包屑链接 | `/templates/dashboard` | `#` | 行为缺口（见 A1） |

---

## 待实测确认清单（静态 HTML 无法判定，需真机/浏览器实测）

1. Open project inbox 点后形态与内容。
2. Sort tickets / Filter tickets / Display options 三个菜单的内容与行为。
3. 每列 More options 菜单内容（复刻的"仅排序"菜单是否为原版）。
4. 卡片详情对话框形态（弹窗/侧栏）与全部内容（字段、评论、token 图表、删除流程）。
5. New ticket 面板字段与流程；新建卡片编号规则与日期写法。
6. 拖拽：落点规则（插到何处）、拖到 Done 是否改日期、拖动时有无占位指示。
7. 键盘拖拽：原版是否支持（空格提起、方向键移动）。
8. Esc 是否关闭详情/新建面板。
9. 空列文案（复刻的 "No tickets — drop one here or add a new ticket." 是否为原版）。
10. 通知中心、用户/团队菜单、Settings 内容（与 Dashboard 共用）。

## 缺口统计

- 确认缺口（可点击类）：A1、A2、B1、B2、B3、B4、C2（位置与命名）、D2（多余）、G2；共 9 项左右。
- 确认缺口（其他交互类）：H2（键盘拖拽，待原版确认后定级）、H4、H7（多余）、H12。
- 确认缺口（静态类）：S2、S3（多余文字）、S4（小）、S5（数字错）、S6（18 张人像缺失，重大）、S8（应用 chip 图标错）、S9（暗色）、S11（字体回退）、S14。
- 待实测：10 项（见上）。其中 E1–E7、F1–F2（详情/新建面板全部内容）是最大的一块未知：复刻的两个侧栏面板是完整自拟实现，原版静态 HTML 无任何对应内容可对照。

## 修复结论（2026-11-07，按缺口清单逐项修；只改 app/templates/project-board/page.tsx）

- B1 Open project inbox：已修。工具栏补了图标按钮（RiInboxLine，aria-label="Open project inbox"，aria-expanded），点开下拉菜单：按列列出各列卡片数，点击某列滚动到该列并关闭菜单。原版收件箱面板形态与内容在 SSR 里不可见，菜单内容待实测确认。
- B2 Sort tickets（看板级排序）：已修。工具栏补了图标按钮（RiSortDesc，aria-label="Sort tickets"），菜单三项 Sort by priority / Sort by newest / Sort by title A–Z，对全部 5 列同时排序。原版菜单内容待实测确认。
- B3 Filter tickets：已修。工具栏补了图标按钮（RiEqualizerLine，aria-label="Filter tickets"），菜单为优先级多选（Urgent/High/Medium/Low，各带全板计数），勾选后只显示对应优先级卡片，附 Clear filters。原版筛选菜单内容待实测确认；列计数仍按列内实际卡片数显示（不过滤）。
- B4 Display options：已修。工具栏补了图标按钮（RiLayoutLeftLine，aria-label="Display options"），菜单三项开关：Show assignees / Show dates / Show app chips，实时控制卡片上头像组、日期行、应用 chip 是否显示，附 Done 关闭。原版显示选项内容待实测确认。
- C2 Add ticket 位置与形态：已修。列底整宽文字按钮 "Add ticket" 删除；列头 More options 旁补了小 + 图标按钮（size-5，aria-label="Add ticket to <列名>"），点后打开对应列的新建面板。
- C3 列计数空格：已修。"3 / 8" 改回原版 "3/8"（5 列全部）。
- S2 提示行：已修。"13 tickets across 5 columns · drag a card to another column, or open it to edit." 删除。
- S4 列计数（同 C3）：已修，见 C3。
- S6 18 张人像照片：已修。原版 randomuser.me 直连可达（curl 5 个 URL 全部 HTTP 200），5 张原图已下载到 public/avatars/randomuser/（Maya Chen women/44、Priya Shah women/65、Elif Kaya women/68、Daniel Kim men/46、Noah Williams men/32，128×128 JPEG，人名与原版 HTML 的 img alt/src 逐一对照），卡片头像组、详情面板负责人 chips、新建面板负责人 chips、评论头像全部改用照片（Avatar src，首字母仍作回退）。不再用首字母色块。
- S8 应用 chip 图标：已修。彩色圆点改回原版文件夹图标（RiFolderLine，size-[13px]，opacity-30）+ 应用名（text-text-secondary），chip 底 bg-background-primary-default + ring-1；逐项对照原版 SSR（vibl chip）核对过。
- S9 卡片暗色态：已修。卡片补 `dark:bg-background-primary-default/60`（原版暗色 60% 不透明）。
- S13 头像组间距：已修。AvatarStack 容器补 `ps-1`（与原版一致）。
- D1 卡片无障碍属性：已修。卡片补 `aria-roledescription="sortable"` 与 `aria-haspopup="dialog"`；补 `aria-describedby="board-live-region"`，页面加了 sr-only 的 aria-live 播报区（拖拽/键盘移动时播报）。
- D2 卡片 hover Actions 按钮：已修。卡片右上 "…" 按钮及其菜单（Move to 各列 + Open details）整段删除；卡片上不再有 hover 出现的操作按钮。移列改走拖拽或键盘拖拽（见 H1/H2）。
- G2 列区域标签：已修。列容器改回 `<section role="region" aria-label="<列名> tickets" tabIndex={0}>`（原为无 role、aria-label "<列名> column"、不可聚焦）。
- H1 拖拽机制：已修。HTML5 draggable 全部去掉（卡片无 draggable 属性，列上无 onDragOver/onDrop）。改用指针拖拽：按住移动超 6px 提起（被拖卡片 opacity-40，目标列 ring-accent-500 高亮），松手落到指针所在列末尾；普通点击（无移动）仍打开详情面板（300ms 内忽略拖拽后的 click）。与原版的差异：原版用 dnd-kit（指针传感器 + 占位指示 + 插入位置计算），本实现无拖动占位指示、落点恒为目标列末尾（与原版"拖到 Done 改日期/末尾追加"是否一致待实测）；拖动时无跟随指针的卡片镜像，原版行为亦待实测。
- H2 键盘拖拽：已修。卡片聚焦时 Space 提起/放下（dnd-kit 风格），提起后 ArrowLeft/ArrowRight 在列间实时移动（播报区播报落点），Enter 放下后仍可开详情，Esc 取消并恢复提起前的整板快照。差异：原版是否支持键盘拖拽在 SSR 里无法确认（audit 原文"疑似支持"），本实现按 dnd-kit 常规行为做；副作用：Space 不再直接打开详情（改为提起/放下），Enter 仍打开详情。
- H4 Esc 关面板：已修。详情面板与新建面板加了 Esc 关闭（window keydown 监听，与 Dashboard 的 Modal 一致）；遮罩点击与 X/Close 按钮保留。
- H12 卡片入场动画：已修。卡片改用 motion.article（motion/react，仓库已有依赖）：opacity 0 + blur(4px) → opacity 1 + blur(0)，200ms ease-out；useReducedMotion 时跳过动画。原版是 motion 初始态 style（opacity:1; filter:blur(0)），本实现只还原了入场方向与终态，精确时长/位移未证实。
- E1–E7、F1–F2 详情/新建面板：未动。原版静态 HTML 里没有面板内容，复刻的两个侧栏面板是自拟实现，按任务要求保持现有实现，标"待实测确认"，不瞎编改动。
- 未修（超出本页文件范围，按任务铁律不动共享组件）：A1 面包屑死链（TemplateShell 里两个 BreadcrumbItem 写死 href="#"，须共享外壳组改）、A2 侧栏多出 HR Management / Multi-Agent Chat 两项、A3 "全部模板"入口、A4 通知角标 5 vs 3（共享）、A6 移动抽屉形态（共享）、S5 通知角标（同 A4）、S11 字体回退（layout 层原因）。另：H11 空列文案 "No tickets — drop one here or add a new ticket." 仍是复刻自拟（原版空列文案未知），保留并待实测。
- 构建验证：见本轮最终汇报（npm run build；此前一轮已通过 Compiled successfully in 4.8s、21/21 静态页）。
