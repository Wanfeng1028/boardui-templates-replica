# AI Chat 缺口清单

- 原版来源：`tpl-pages/ai-chat.html`（BoardUI 站点 SSR 快照，227,951 字节）+ `browser.open` 抓线上页 `https://www.boardui.com/templates/ai-chat` 交叉核对（线上抓取只返回 "Agentic chat / 用户消息 / 57%" 三行文本，与快照一致）。
- 复刻来源：`app/templates/ai-chat/page.tsx`（696 行）+ 共享组件 `components/application/dashboard/dashboard-sidebar.tsx`、`components/application/agent-chat/agent-composer.tsx`、`agent-chat-message.tsx`、`agent-chat-history.tsx`、`agent-thinking.tsx`、`components/application/composer-loader/composer-loader.tsx`。
- 盘点日期：2026-11-07。只盘点、不修。

## 元素总数：48 个

原版 SSR 中可交互元素原始 79 个，含移动端/桌面端两套重复渲染（侧栏、代码面板各渲染两次），去重后逻辑元素 48 个：左侧栏 27 个（头像菜单、搜索图标、Quick Search pill、折叠、New agent、Automations、Customize、4 个仓库折叠组、11 条线程链接、亮/暗切换、Support、Settings、Upgrade），代码面板 7 个（Close code、Changes、Browser、Open terminal、Expand panel、Toggle panel、Undo changes），顶部栏 3 个（Open navigation、Close navigation、Open code），面包屑 1 个（vibl coding project），聊天头栏 2 个（Share chat、More options），输入框区 5 个（Add attachment、输入框、Fable 5、Voice input、Send message），状态行 3 个（Main、project-sea、Agent；57% 圆环本身不可点）。

另有 8 处内容不在静态 DOM 里（菜单关闭态不渲染）：头像菜单项、Add attachment 菜单项、Fable 5 模型下拉选项、Main / project-sea / Agent 三个下拉的内容、More options 菜单项、Browser tab 内容、Styles（本页无）、Undo 点后状态——内容与行为一律标"待实测确认"，不得编造。

快照状态说明：原版页面定格在"生成中 57%"：只有 1 条用户消息，没有助手回复，没有思考指示器文字，输入框为空。复刻里所有"助手已回复"状态下的东西（助手全文、Thinking 指示器、反馈操作）都无原版对照。

---

## A. 可点击元素

### A1. 左侧栏整体：原版是 agent 侧栏，复刻是模板导航侧栏 —— 有缺口（最严重）

- 位置与标识：页面最左侧，宽 260px。
- 原版行为：agent 工作台侧栏——顶部头像菜单、搜索、New agent / Automations / Customize 三个入口、Repositories 分组（4 个仓库折叠组 + 11 条线程链接）、底部主题切换、Support / Settings、Board team 卡片 + Upgrade。
- 复刻现状：`DashboardSidebar`（`DASHBOARD_NAV`）：全部模板 / Home / Project board / Marketing / Calendar / Finance / Medical Report / HR Management / AI Chat / AI Image Generation / Profile / Multi-Agent Chat 模板导航 + 筛选输入框 + Support / Settings + 团队菜单。点导航项会跳到其他模板页。
- 差在哪里：整个侧栏换错了东西。原版侧栏是"当前 agent 的仓库与对话"，复刻是"全站模板导航"。两者用途完全不同；复刻里没有任何 Repositories 分组和线程入口（线程被挪到了只在 2xl 宽度才出现的独立 history rail，见 A2）。这是本页最大的结构性缺口。

### A2. 线程列表：原版在侧栏内按仓库分组，复刻在 2xl 才出现的平铺 rail 里 —— 有缺口

- 位置与标识：原版在侧栏 "Repositories" 分区下；复刻在 `AgentChatHistory` rail（`hidden 2xl:flex`，宽 260px 的独立卡片，位于聊天面右侧）。
- 原版行为：4 个仓库折叠组——boardui（收起，2 条）、vibl coding project（展开，5 条）、strider landing page work（收起，2 条）、pirate mini game iOS（收起，2 条）；每条线程是 `href="#"` 链接，带紧凑时间徽标（2h、1d、34m、now、5h、18h、3d、4d、1w、2w）；当前线程 "coding scenario" 带 `aria-current="page"`；仓库组按钮带 `aria-expanded`，点开/收起子列表（grid-rows 0fr/1fr + opacity，300ms 过渡）。
- 复刻现状：rail 顶部是 "New chat" 按钮（+ 号），下方 "Recent" 标题，11 条线程平铺（标题用 "boardui · pro badge restyle" 这种 "仓库 · 线程" 拼法），每行 hover 出现 "More actions" 菜单（Rename / Mark as unread / Delete），未读有点标记，底部有账号菜单 + "Export N chats" 下载按钮；点线程切换 seed 消息。
- 差在哪里：
  - 分组与折叠全丢：复刻无仓库分组、无折叠组、无仓库文件夹图标。
  - 出现宽度不对：原版线程列表在所有宽度都有（移动端进抽屉）；复刻的 rail 只在 2xl（1536px）以上出现，1440px 宽屏下用户根本看不到线程列表。
  - 时间徽标两处错：原版 "image generation" 是 "now"，复刻是 "12m"（seed 时间 NOW-12 分钟）；原版 pirate 两条是 "1w"、"2w"，复刻相对时间函数没有"周"单位，显示 "7d"、"14d"。
  - hover 菜单是自造：原版线程行 hover 没有任何更多操作；复刻的 Rename / Mark as unread / Delete / Export 都是原版没有的功能。
  - "New chat" 语义不同：原版没有"新聊天"按钮，只有 "New agent"（新建 agent）；复刻的 "New chat" 新建一条空聊天并进空态（见 C4），原版无此流程。

### A3. New agent / Automations / Customize —— 有缺口（复刻缺失）

- 位置与标识：侧栏顶部导航区，三个 `href="#"` 链接，各带图标。
- 原版行为：点击（href="#"，占位链接，真实去向待实测确认）。
- 复刻现状：侧栏里完全没有这三个入口。
- 差在哪里：三个入口全部缺失。

### A4. 头像菜单 "Mertcan Esmergul" —— 存在，内容待实测确认

- 位置与标识：原版侧栏顶部，头像 "M" + 名字 + 上下箭头图标，`aria-expanded="false"`；复刻 `DashboardSidebar` 也有用户菜单（`aria-label="Mertcan Esmergul account menu"`）。
- 原版行为：点开账号菜单（菜单项不在静态 DOM 里，待实测确认）。
- 复刻现状：侧栏用户菜单存在；另在 history rail 底部还有第二个账号菜单（Usage left 百分比、退出到 /login）。
- 差在哪里：原版只有一个头像菜单；复刻多出一个 rail 底部账号菜单（Usage left、存储占比、退出登录均为复刻自造）。原版菜单的真实项目待实测确认，复刻菜单项是否对得上无法判定。

### A5. Search 图标按钮 / Quick Search ⌘L —— 有缺口（行为不同）

- 位置与标识：原版移动端侧栏顶部是 Search 图标按钮，桌面端侧栏是通栏 pill "Quick Search" + ⌘L 键位提示；复刻侧栏两者都有（Search 图标 + Quick Search 按钮）。
- 原版行为：打开搜索（⌘L 提示表明是全局命令面板；面板内容不在静态 DOM 里，待实测确认）。
- 复刻现状：两个按钮都只激活"筛选模板导航"输入框（`aria-label="Filter template navigation"`，Esc 关闭/清空），输入只过滤模板导航项。
- 差在哪里：复刻的搜索只能筛导航，不是全局命令面板；原版面板里有什么（搜对话？搜文件？搜命令？）待实测确认。

### A6. Collapse sidebar —— 基本一致，折叠后形态未核对

- 位置与标识：原版桌面端侧栏顶部头像菜单旁，`aria-label="Collapse sidebar"`；复刻同名按钮存在。
- 原版行为：收起侧栏（收起后形态不在静态 DOM 里）。
- 复刻现状：按钮存在，可切换 `collapsed` 态。
- 差在哪里：按钮本身对得上；折叠后的侧栏长什么样（原版是图标栏还是完全隐藏）未在本轮核对。

### A7. 主题切换（亮/暗）—— 无缺口

- 位置与标识：原版侧栏底部 `role="group" aria-label="Theme"` 分段器，"Use light mode"（`aria-pressed="true"`，`title="Light mode"`）/ "Use dark mode"（`title="Dark mode"`），带滑动指示圆点（transition-transform 200ms）；复刻侧栏 `ThemeToggle` 同款（同名 aria-label、同 title、同滑动指示）。
- 原版行为：点按切换亮/暗，写 localStorage（`boardui:theme`），翻 `.dark` class。
- 复刻现状：同一组件，行为一致。
- 差在哪里：无。抽查了两按钮的 label、title、aria-pressed、滑动指示。

### A8. Support / Settings —— 有缺口（Settings 行为不同）

- 位置与标识：原版侧栏底部两个 `href="#"` 链接；复刻侧栏同名两项。
- 原版行为：点击链接（href="#" 占位）。
- 复刻现状：Support 是导航项；Settings 点开 `SettingsModal` 弹窗（复刻自造）。
- 差在哪里：原版 Settings 只是个链接，没有弹窗；复刻凭空多了一个设置弹窗。

### A9. Board team / Pro Plan + Upgrade —— 有缺口

- 位置与标识：原版侧栏底部卡片：字母 "B" 头像（bg-blue-300，text-blue-900）+ "Board team" / "Pro Plan" + "Upgrade" 按钮；复刻侧栏底部 `DashboardTeamMenu` 卡片。
- 原版行为：Upgrade 是普通按钮（去向不在静态 DOM 里，待实测确认）；卡片本身是否可点未知。
- 复刻现状：卡片头像换成 logo 图片（`/brand/boardui_logo_circle.webp`），点开菜单有 10 项自造内容（View team profile、Folders、Messages 94、People、Billing、Company Details、Integrations、Notifications、Account Details、Sign out）；没有 Upgrade 按钮。
- 差在哪里：头像从字母 B 换成 logo 图；Upgrade 按钮缺失；菜单 10 项全部是复刻编造，原版卡片点开后是什么（如果可点的话）待实测确认。

### A10. 顶部栏：原版两个头栏，复刻合成一个 —— 有缺口

- 位置与标识：原版有两个头栏——①移动顶栏（`xl:hidden`，h-12，px-3，pt-[11px]）：Open navigation（`lg:hidden`，size-9 圆按钮）+ 标题 "Agentic chat" + 右侧 "Open code" 按钮；②桌面面包屑头（`px-4 pt-4`，无边框）：`nav aria-label="Chat location"` 面包屑 + 右侧 Share chat / More options。复刻只有一个头栏（h-12，带 `border-b`）：汉堡（`lg:hidden`）+ 标题 "Agentic chat" + 副标题 "vibl coding project / 当前线程" + 主题按钮 + Share + More + Terminal + Code。
- 原版行为：移动顶栏只在 xl 以下出现；面包屑头在桌面端出现，无底边框。
- 复刻现状：单头栏在所有宽度出现，带底边框。
- 差在哪里：
  - 结构差：原版"标题栏（移动）+ 面包屑栏（桌面）"两段式被复刻合成一段；面包屑不是标题副标题。
  - 面包屑丢失：原版 "vibl coding project" 是可点按钮（文件夹图标 + 文字），后跟 chevron 与 `aria-current="page"` 的 "coding scenario"；复刻是纯静态 span，不可点、无 nav 语义。
  - 多出两个按钮：复刻头栏的主题切换（单图标切换；原版主题切换只在侧栏，是分段器）和 Terminal 按钮（原版 Terminal 只在代码面板头里，聊天头栏没有）。

### A11. Share chat —— 有，行为是复刻自造，待实测确认

- 位置与标识：面包屑头右侧，icon-only 按钮（size-4 图标，group-hover 变色）；复刻头栏右侧同名按钮存在。
- 原版行为：未知（静态 DOM 里无菜单、无弹窗，分享是复制链接还是开弹窗，待实测确认）。
- 复刻现状：把全部消息拼成 transcript 写进剪贴板，顶部显示 "Chat copied to clipboard."（2 秒消失）。
- 差在哪里：按钮在，行为是复刻猜的；原版分享到底发生什么，待实测确认。

### A12. More options —— 有，菜单内容自造，待实测确认

- 位置与标识：面包屑头右侧，icon-only 按钮（横三点，size-4）；复刻同名按钮存在。
- 原版行为：点开菜单（菜单项不在静态 DOM 里，待实测确认）。
- 复刻现状：菜单三项——Export chat（下载 boardui-chats.json）、Mark as unread / Mark as read、Delete thread。
- 差在哪里：三项全是复刻编造，未经核对；原版菜单的真实项目待实测确认。

### A13. Add attachment —— 死按钮

- 位置与标识：输入框 pill 左侧，React Aria 按钮（`aria-expanded="false"`，+ 号图标，带 `bg-ai-chat-composer-add-background`）。
- 原版行为：点开附件菜单（菜单项不在静态 DOM 里，待实测确认）。
- 复刻现状：`AgentComposer` 里的同名按钮**没有任何 onClick**，点按无反应；组件注释自认"附件插件面板是付费组件才有的，这里故意留空"。
- 差在哪里：外观在、功能全无，是死按钮。原版菜单内容待实测确认，但至少原版按钮是可展开的。

### A14. 输入框 "Ask me anything" —— 基本一致，两处小差

- 位置与标识：输入框 pill 中部，`type="text"`，`aria-label="Message"`，`placeholder="Ask me anything"`；复刻 `id="agent-composer-input"`，同 placeholder。
- 原版行为：输入文字；未聚焦且文字溢出时，文字右侧用 mask 淡出（`mask-image: linear-gradient(to right, #000 calc(100%-32px), transparent 100%)`，RTL 镜像）；输入框不在任何 `<form>` 里（全页 0 个 form 标签），Enter 是否发送待实测确认。
- 复刻现状：包在 `<form>` 里，Enter（不带 Shift）提交；无右侧淡出 mask；`autoComplete="off"`。
- 差在哪里：①复刻缺未聚焦文字淡出效果；② Enter 发送是复刻实现，原版无 form，Enter 行为待实测确认。

### A15. Fable 5 模型选择 —— 有缺口（位置与形态都错）

- 位置与标识：原版在输入框 pill **内部**右侧：圆角矩形按钮（`rounded-xl`，`bg-background-primary-default`），文字 "Fable 5" + 下拉箭头，`aria-expanded="false"`；复刻 pill 内是静态 span（不可点，`title="Answering with Fable 5"`）。
- 原版行为：点开模型下拉（选项不在静态 DOM 里；"Fable 4"、"Fable 3 Mini" 是复刻编的，原版选项待实测确认）。
- 复刻现状：pill 内的模型名不可点；复刻在消息区上方另造了一个模型菜单 pill（Fable 5 / Fable 4 / Fable 3 Mini，选中标 "Active"）。
- 差在哪里：原版模型选择器在输入框里、是按钮；复刻把它做成静态文字，又在错误的位置（消息区上方）另起了一个菜单；菜单选项未经核对。

### A16. Voice input —— 有缺口（复刻缺失）

- 位置与标识：原版输入框 pill 内，Send 左侧：size-9 圆形描边按钮（`border-border-button-default`，`bg-background-primary-default`，shadow-xs），麦克风图标，`aria-pressed="false"`。
- 原版行为：语音输入开关（`aria-pressed` 表明是 toggle；按下后发生什么待实测确认）。
- 复刻现状：完全没有语音按钮；只有生成中才出现的 Stop 按钮（`aria-label="Stop generating"`）。
- 差在哪里：语音入口整个缺失。

### A17. Send message —— 有小差

- 位置与标识：原版 pill 右侧 size-9 圆形主按钮（`bg-button-primary`，白色上箭头图标）；复刻同款（`bg-button-primary`，`RiArrowUpLine`）。
- 原版行为：点按发送（SSR 时输入框为空，按钮上**没有** disabled 属性）。
- 复刻现状：输入框为空时 `disabled` + `opacity-40`，不可点。
- 差在哪里：原版空输入时发送按钮仍是可点态；复刻把它禁用并变灰。空输入点发送原版会发生什么（空转还是忽略）待实测确认，但禁用态本身与快照不符。

### A18. Effort Low / Medium / High —— 复刻自造，原版无此控件

- 位置与标识：复刻在消息区上方有一组分段器（Low / Medium / High，`aria-pressed`，默认 Medium）。
- 原版行为：SSR 全文检索 "Low"、"Medium"、"High"、"Effort" 均为 0 次出现，原版本页没有任何 effort 控件。
- 复刻现状：分段器可点，会改变 canned 回复里的 effort 措辞。
- 差在哪里：整个控件是复刻凭空加的。

### A19. 状态行 Main / project-sea / Agent —— 有缺口（全是静态冒充按钮）

- 位置与标识：原版在输入框 pill **下方**的状态行（`h-[26px]`，`px-1.5`，左右两端对齐）；复刻把对应内容放在消息区**上方**的模型行里。
- 原版行为：左：Main 按钮（分支图标，无 chevron）；project-sea 按钮（文件夹图标 + 下拉箭头，React Aria，`aria-expanded="false"`，点开下拉，内容待实测）；右：Agent 按钮（图标 + "Agent" + 下拉箭头，点开下拉，内容待实测）+ 进度胶囊（圆环 + "57%"，见 A20）。
- 复刻现状：Main、project-sea 是静态 span（不可点）；"Agent" 是静态文本，无下拉；三者都在错误的位置。
- 差在哪里：位置错（上方 vs 输入框下方）；三个下拉/按钮全被做成不可点的静态文字；下拉内容本身待实测确认。

### A20. 进度 57% —— 有缺口（形态与位置都错）

- 位置与标识：原版状态行右端：16px 圆环 svg（`-rotate-90`，`stroke-dasharray="21.488493750554184 37.69911184307752"`）+ "57%" 文字，装在 `rounded-[40px] bg-background-tertiary-default` 胶囊里（`py-1 pe-2 ps-1.5`）。
- 原版行为：快照定格 57%（动态是否走动、走完显示什么，待实测确认）。
- 复刻现状：线性进度条（`h-1.5 w-16 sm:w-24`，`bg-accent-500`，`transition-[width] duration-300`）+ 百分比文字，放在消息区上方；初始 57%，提交后从 12% 走到 96% 再到 100% 显示 "Done"；`stopGenerating` 后回到 57%。
- 差在哪里：圆环变横条；位置从输入框下方挪到消息区上方；"Done" 文案与 12→96→100 的走法是复刻编的，原版走完后显示什么待实测确认。

### A21. 代码面板：Changes / Browser 双 pill —— 有缺口（复刻多出一个 Code tab）

- 位置与标识：原版面板头是 `role="group" aria-label="Panel view"` 的 pill 组，只有 Changes（`aria-pressed="true"`，`data-pill-selected`，蓝色 `data-pill-variant="blue"`，图标与文字均为 `text-accent-500`）和 Browser（`aria-pressed="false"`）两个 pill，hover 时 pill 背景 `bg-pill-tab-blue-hover-background` 淡入（200ms）；复刻 `CodePanelInner` 头是三个 tab（Code / Changes / Browser，`role="tablist"`）。
- 原版行为：点 Changes / Browser 切换面板视图；代码视图是 Changes tab 内容的一部分（不是独立 tab）。
- 复刻现状：多出一个 "Code" tab，点它只看代码；Changes tab 只看文件列表。
- 差在哪里：tab 结构被改了；原版两个 pill，复刻三个 tab。

### A22. 代码面板：Undo changes —— 有缺口（形态与行为）

- 位置与标识：原版在 Changes 汇总头卡右端：图标式按钮（`aria-label="Undo changes"`，回退箭头图标）；复刻在文件列表下方：带文字 "Undo changes" 的按钮。
- 原版行为：点按撤销（撤销后界面变成什么样，SSR 无从得知，待实测确认）。
- 复刻现状：点后清空文件列表，显示 "All changes undone. Nothing to commit." + "Restore changes" 按钮。
- 差在哪里：位置不同（头卡内 vs 列表下）；复刻的清空 + 恢复流程是自造的，原版撤销后状态待实测确认。

### A23. 代码面板：文件列表 —— 有缺口（多出两个文件，且行可点）

- 位置与标识：原版 Changes 内容区只列 **1 个**文件：`boardui/app/components/button.tsx` + `+74`（翠绿 `text-emerald-700`）+ "New" 徽标，前面带 React 原子 logo（svg，`#149ECA`）；整行是静态 div，**不可点**；汇总头卡文字 "12 Uncomitted changes"（注意原版拼写就是 Uncomitted，少一个 t）+ "+156"（翠绿）/ "-23"（红 `text-red-600`）。复刻列 3 个文件卡片。
- 原版行为：文件行不可点；汇总数字 12 / +156 / -23。
- 复刻现状：3 个文件——button.tsx +74 New、theme-toggle.tsx +41 New、theme.css +29 Modified；每行都是可点按钮，点后切到 Code tab；汇总数字颜色改为 `text-text-primary` / `text-text-error-primary`。
- 差在哪里：①多出两个文件（theme-toggle.tsx、theme.css 在原版 SSR 里 0 次出现，内容未经核对）；②文件行从不可点变成可点并切换 tab；③ +156 / -23 的颜色与原版不符（原版翠绿/正红，复刻主文字色/错误色）。

### A24. 代码面板：代码视图内容 —— 有缺口（内容完全不同）

- 位置与标识：原版 Changes tab 内、文件卡下方：行号 1–44 的代码区（`font-mono text-[13px] leading-[23px]`），带语法高亮 token 颜色（关键字 `#7ccf00` 绿、字符串灰等）。
- 原版行为：展示的 44 行代码是 HomeDashboardDetail 的源码：`import { Metadata } from "next"`、`ComponentDetail`、`DashboardShell`，metadata 标题 "Home Dashboard Template — React + Tailwind (Pro)"、描述 "Full admin dashboard template for React + Tailwind CSS …"、`PREVIEW_CODE`、`HomeDashboardDetail` 返回 `ComponentDetail`（`id: "full-template"`、`title: "Live template"`，预览 `div className="h-[760px] w-full overflow-hidden rounded-2xl border border-border-button-default"`，`scale-[0.8] [width:125%]`）。
- 复刻现状：28 行 `ThemeToggleButton` 代码片段（`useThemeMode`、`applyTheme`、亮暗切换），全部 `text-text-primary` 纯色，无语法高亮。
- 差在哪里：代码内容完全不同（原版是 Home Dashboard 详情页源码，复刻是主题切换组件源码）；行数不同（44 vs 28）；复刻无语法高亮。

### A25. 代码面板：Browser tab —— 内容待实测确认

- 位置与标识：原版面板头 Browser pill（未选中，内容不在 SSR 里）；复刻 Browser tab 有内容。
- 原版行为：点后显示什么，SSR 无从得知，待实测确认。
- 复刻现状：自造了一个 "localhost:3000" 地址栏 + 浏览器 chrome 圆点 + "Preview — Home Dashboard" 骨架屏 + "Live preview of the running app after the agent's edits."。
- 差在哪里：复刻内容全是编的；原版 Browser tab 的真实内容待实测确认。另原版全页检索 "localhost" 为 0 次，"Preview — Home Dashboard" 为 0 次。

### A26. 代码面板：Open terminal / Expand panel / Toggle panel —— 有缺口（缺 Toggle）

- 位置与标识：原版面板头右侧三个图标按钮（`aria-label="Open terminal"`、`"Expand panel"`、`"Toggle panel"`，size-4 图标）；复刻面板头有 Terminal、Expand、Close。
- 原版行为：Open terminal 打开终端条；Expand panel 放大面板；Toggle panel 收起/展开面板（具体形态待实测确认）。
- 复刻现状：Terminal 开关切换输入框上方的终端条（`TERMINAL_LINES`：lint/build 日志，内容自造，见 C3）；Expand 在 400/640 间切换；没有 Toggle panel 按钮，取而代之的是 Close 按钮。
- 差在哪里：复刻缺 "Toggle panel"；且复刻的 Expand（400↔640）与原版 Expand 后的宽度是否一致，待实测确认。

### A27. 代码面板：Close code / Open code —— 有缺口（桌面端关法不同）

- 位置与标识：原版移动端抽屉头有 "Code" 标题 + Close code 按钮（size-9 圆按钮）；桌面端面板（`hidden xl:flex`，固定宽 410px）没有 Close 按钮，靠 Toggle panel 收起；移动顶栏右侧有 "Open code" 按钮（`</>` 图标，size-9 圆按钮，仅 xl 以下可见）。复刻头栏有 Code 开关按钮（所有宽度），面板头有关闭按钮（所有宽度）。
- 原版行为：移动端点 Open code 打开抽屉，点 Close code / 遮罩关闭；桌面端面板常驻，Toggle panel 收起。
- 复刻现状：头栏 Code 按钮开关面板；面板头 Close 按钮关闭；移动端 `onExpand` 被写成直接关面板（`onExpand={() => setPanelOpen(false)}`），与 Expand 语义不符。
- 差在哪里：桌面端原版没有 Close 按钮，复刻多了一个；复刻移动端 Expand 点按即关闭面板，行为错误。

### A28. 代码面板：拖拽改宽 —— 有缺口（手柄形态与宽度）

- 位置与标识：原版在聊天面与面板之间有一条 `role="separator" aria-orientation="vertical" aria-label="Resize panels"` 拖拽条（`hidden xl:flex`，`w-5`，`cursor-col-resize`，`touch-none`），中间有抓手（`h-[25px] w-[15px]` 圆角小条，内含 3 条竖线，`opacity-0 group-hover/drag:opacity-100`，hover 才出现，150ms 过渡）。
- 原版行为：拖动改面板宽（可拖范围待实测确认）；面板默认宽 410px（aside 行内样式固定值）。
- 复刻现状：拖拽手柄是一个 button（`aria-label="Resize code panel"`，`onPointerDown`），无可见抓手、无 hover 出现；默认宽 400px，可拖 320–640px，Expand 到 640px。
- 差在哪里：手柄元素类型不同（separator vs button）；无可见抓手；默认宽 400 vs 原版 410；可拖范围未经核对。

### A29. 代码面板：移动端抽屉宽度 —— 有小差

- 位置与标识：原版抽屉 `w-[min(410px,calc(100%_-_12px))]`，`translate-x-[110%]` 滑入，300ms 过渡，带 `bg-black/40` 遮罩与 "Code" 头栏；复刻抽屉 `w-[min(480px,92vw)]`。
- 原版行为：滑入/滑出 300ms。
- 复刻现状：宽度上限 480px（原版 410px），遮罩与结构近似。
- 差在哪里：抽屉宽度差 70px。

---

## B. 其他交互

### B1. Hover 才出现的东西 —— 有缺口

- 原版 hover 行为（SSR class 可证）：
  - 侧栏导航行、线程链接、仓库组按钮：hover 背景 `hover:bg-background-secondary-hover`。
  - Share chat / More options 图标按钮：`group-hover:text-foreground-icon-hover`，图标 hover 变色。
  - 面板 Changes / Browser pill：hover 时 pill 背景 `bg-pill-tab-blue-hover-background` 从 `opacity-0` 淡入（200ms）。
  - 拖拽条抓手：`opacity-0 group-hover/drag:opacity-100`（150ms），只在 hover 拖拽条时出现。
  - 模型按钮、分支按钮、输入框 pill：hover 背景变化（`hover:bg-background-primary-hover`）。
  - 用户气泡：**没有任何** hover 出现的操作（SSR 里气泡是纯文本 div，无 hover 按钮）。
- 复刻现状：
  - 侧栏行、Share/More、pill、拖拽条 hover 大致有，但拖拽抓手不存在所以无 hover 出现。
  - 助手消息 hover 出现 Copy message / Read aloud / 相对时间戳（`group-hover/message:opacity-100`）——原版没有，属自造（见 A 段消息区）。
  - 线程行 hover 出现 "More actions" 菜单按钮（图标互换 `group-hover/row:opacity-0/100`）——原版没有，属自造。
- 差在哪里：原版"hover 出现"的只有抓手和 pill 背景；复刻在消息与线程行上各加了一套原版没有的 hover 操作。

### B2. 拖拽 —— 有缺口

- 仅一处可拖：代码面板宽度的 separator（见 A28）。原版是 `role="separator"` + 抓手 + `cursor-col-resize` + `touch-none`，只在 xl 出现。
- 复刻用 button + `onPointerDown` + window 级 pointermove/pointerup 实现拖拽，320–640px 夹取；无抓手、无 separator 语义、无 `touch-none`。
- 其他拖拽：原版本页无任何其他拖拽（无卡片拖拽、无排序）。

### B3. 键盘操作 —— 大多待实测确认

- Enter 发送：复刻 form 的 Enter 提交；原版输入框不在 form 里，Enter 是否发送、Shift+Enter 是否换行，待实测确认。
- Esc 关弹窗/菜单：复刻的菜单（模型菜单、More 菜单、线程菜单）只用全屏透明 backdrop 按钮关闭，**无 Esc 处理**；侧栏筛选输入框有 Esc 清空/关闭（复刻自有）。原版用 React Aria 菜单，Esc 通常可关，但未经实测，不得断言。
- ⌘L Quick Search：原版 pill 上标了 ⌘L，复刻的 Quick Search 按钮无键盘快捷键。
- Tab / 方向键：原版 React Aria 控件（菜单、tab、按钮）应支持键盘导航，复刻的自造菜单（div + button）键盘行为未经核对。
- 面板 separator 的键盘调整（`role="separator"` 通常支持方向键改宽）：原版是否支持，待实测确认；复刻 button 手柄不支持键盘改宽。

### B4. 输入框联想 —— 无

- 原版 SSR 里没有任何联想/补全 UI（输入框无 datalist、无下拉、无 @ 提及）。
- 复刻同样无联想。此项无缺口。

### B5. 滚动联动 —— 有小差

- 原版消息区：`overflow-y-auto [scrollbar-width:thin]`，内容区 `flex-col justify-end`（底部对齐），`px-4 pt-4`；侧栏滚动区 `[scrollbar-width:none]`（无滚动条）；代码区 `overflow-y-auto [scrollbar-width:thin]`。
- 复刻消息区：`overflow-y-auto scroll-smooth`，内容 `mx-auto max-w-3xl px-4 pt-5 pb-6`，提交后 JS `scrollTo({top: scrollHeight, behavior: "smooth"})` 滚到底。
- 差在哪里：原版消息是底部对齐、全宽（无 max-w-3xl 居中）；复刻是居中窄栏 + 平滑滚动。原版发送后是否自动滚到底，待实测确认。另 AGENTS.md 要求的"滚动顶部渐隐模糊"在原版消息区未见对应实现（原版无此遮罩），复刻也无——此项双方一致，不算缺口。

### B6. 动画效果 —— 有缺口

- 原版（SSR 可证）：
  - 用户气泡入场：初始 `opacity:0`，内层 `opacity:0; filter:blur(6px); transform:translateY(6px)`（淡入 + 去模糊 + 上浮）。
  - 仓库组展开/收起：`grid-template-rows 0fr↔1fr` + opacity，300ms ease-in-out。
  - 主题切换指示滑动：200ms。
  - 移动端代码抽屉：`translate-x-[110%]` → 0，300ms ease-in-out；遮罩 `opacity-0` 过渡 300ms。
  - 玻璃加载：composer pill 外圈渐变光带，SVG rect dash 动画 `bui-composer-loader-dash 4.5s linear infinite`，显隐过渡 450ms。
  - Changes/Browser pill hover 背景淡入 200ms；拖拽抓手淡入 150ms。
- 复刻现状：
  - 用户气泡**无入场动画**（纯静态 `<p>`）。
  - 助手消息逐行 blur-in（`opacity 0→1, blur(5px)→0, y 4→0`，0.42s，`[0.22,0.61,0.36,1]`）——原版无助手消息，无法对照，属自造动画。
  - 仓库折叠动画缺失（rail 无分组）。
  - 抽屉滑入动画参数未核对（复刻抽屉无 translate-x 过渡类，靠条件渲染出现/消失）。
  - 玻璃加载与原版一致（见 C 节"无缺口"）。
  - 进度条 width 过渡 300ms 是复刻自造（原版是圆环，无 width 动画）。
- 差在哪里：用户气泡入场动画缺失；仓库折叠动画缺失；抽屉滑入动画未还原。

### B7. Toggle 开关状态变化 —— 部分缺口

- 主题切换：原版 `aria-pressed` + 滑动指示；复刻一致，无缺口。
- 仓库组 `aria-expanded`：原版 4 组（boardui false、vibl true、strider false、pirate false）；复刻无分组，全部缺失。
- 模型 / 附件 / project-sea 下拉 `aria-expanded`：原版均为 false（关闭态）；复刻模型菜单有开合态（但位置与选项自造），附件按钮无开合（死按钮），project-sea 无下拉。
- Voice input `aria-pressed="false"`：原版是 toggle；复刻按钮不存在。
- Changes / Browser `aria-pressed`：原版 Changes true / Browser false；复刻三 tab 用 `aria-selected`，语义与数量都不同。
- Effort `aria-pressed`：复刻自造，原版无。

---

## C. 静态内容

### C1. 文字内容 —— 两处数字差，其余一致

抽查对照（原版 SSR 文本 vs 复刻文案），逐字一致的：

- 侧栏："Mertcan Esmergul"、"New agent"、"Automations"、"Customize"、"Repositories"、"boardui"、"vibl coding project"、"strider landing page work"、"pirate mini game iOS"、11 条线程标题、"Support"、"Settings"、"Board team"、"Pro Plan"、"Upgrade"。
- 聊天区："Agentic chat"、"vibl coding project"、"coding scenario"、用户消息全文 "update our color tokens for dark mode and add a reusable theme toggle to the registry. run lint and a production build when you're done."、"Fable 5"、"Main"、"project-sea"、"Agent"、"57%"、"Ask me anything"、"Quick Search"、"⌘L"。
- 代码面板："Code"、"Changes"、"Browser"、"12 Uncomitted changes"（原版拼写即 Uncomitted，复刻保留了该拼写）、"+156"、"-23"、"boardui/app/components/button.tsx"、"+74"、"New"。

有差的：

- 时间徽标："image generation" 原版 "now" vs 复刻 "12m"；"cannon physics tuning" 原版 "1w" vs 复刻 "7d"；"sprite sheet cleanup" 原版 "2w" vs 复刻 "14d"（复刻相对时间函数无"周"单位）。
- 复刻自造文案（原版无）：助手回复全文（"Done — I updated the color tokens for dark mode …"）、空态 "What can I help with?" + "Demo mode: the answers are scripted. No model key needed." + 3 个建议 pill 文案、"Thinking"、"Demo mode"、"N messages" / "New chat" 状态文案、"Chat copied to clipboard."、"All changes undone. Nothing to commit."、"Restore changes"、"Export chat"、"Mark as unread"、"Delete thread"、终端日志（"✓ No errors — 0 warnings"、"✓ Production build passed in 4.2s" 等）、Browser tab 的 "localhost:3000" / "Preview — Home Dashboard" / "Live preview of the running app after the agent's edits."、"Low / Medium / High"、"Fable 4"、"Fable 3 Mini"、"Active"、文件 theme-toggle.tsx / theme.css 两行。

### C2. 数字 —— 一致（颜色除外）

- "12 Uncomitted changes"、"+156"、"-23"、"+74"、"57%" 五处数字全部一致。
- 颜色差：原版 "+156" 是 `text-emerald-700` 翠绿、"-23" 是 `text-red-600` 正红、文件行 "+74" 是 `text-emerald-700`；复刻汇总行用 `text-text-primary` / `text-text-error-primary`，文件行用 `text-text-secondary`。

### C3. 图片 —— 有缺口（头像形态）

- 原版本页 demo DOM 里 **0 张 `<img>`**：头像全是字母 div（侧栏 "M"、团队卡 "B"），文件行图标是内联 SVG（React 原子 logo，`#149ECA`）。
- 复刻团队菜单头像用 logo 图片（`/brand/boardui_logo_circle.webp`），与原版字母 "B"（bg-blue-300 / text-blue-900）不符。
- 终端条内容：原版 SSR 里无终端条（终端只在点 "Open terminal" 后出现，内容待实测）；复刻终端日志（lint/build 五行）是自造文案。

### C4. 图标 —— 基本一致，一处形态差

- 抽查：Open code（`</>`）、Share、More（横三点）、Terminal、Expand、Toggle panel、Add attachment（+ 号）、模型下拉箭头、Voice（麦克风）、Send（上箭头）、Main（分支）、project-sea（文件夹）、Agent（无限状图标）、仓库文件夹图标——复刻用的 RemixIcon 同款，形态基本一致。
- 形态差：原版主题切换是双图标分段器（太阳/月亮并排 + 滑动指示）；复刻聊天头栏多出的主题按钮是单图标切换（太阳月亮二选一显示），与原版分段器形态不同。

### C5. 颜色 / 字体 / 间距 / 布局 —— 有缺口

- 字体：原版加载 Inter + JetBrains Mono（html class `inter_…` / `jetbrains_mono_…`）；复刻 `app/layout.tsx` 注释自认用系统字体栈替代 Inter（"metrics are the same"），代码字体亦为系统栈。视觉上字体不同。
- 页面框：原版 `p-3`（12px）+ `gap-4`（16px）；复刻一致。
- 侧栏宽：原版 260px（`w-[260px]` 的 aside，移动抽屉 `w-[260px]`）；复刻 `DashboardSidebar` 宽度未在本轮量取，不作断言；复刻 history rail 是 260px，但那是另一块东西。
- 聊天面：原版 `rounded-3xl bg-background-secondary-default`；复刻一致。
- 消息区布局：原版底部对齐（`justify-end`）、全宽、`px-4 pt-4`、用户气泡 `max-w-[calc(50%+6px)]`；复刻居中窄栏 `mx-auto max-w-3xl px-4 pt-5 pb-6`、用户气泡 `max-w-[75%]`。宽度与对齐都不同。
- 输入框区：原版 `px-2.5 pt-3 pb-2.5`（pill 高 52px，`p-2`）；复刻 `px-3 pb-3` + `max-w-3xl` 包裹。左右边距与最大宽度不同。
- 状态行：原版 `h-[26px]`、`px-1.5`，在输入框下方；复刻对应行在消息区上方（`px-4 pt-3`），位置错。
- 代码面板宽：原版桌面固定 410px；复刻默认 400px（差 10px），展开 640px（原版展开后宽度待实测）。
- 间距细节：原版面包屑头 `px-4 pt-4` 无边框；复刻头栏 h-12 带 `border-b`。

### C6. 无缺口的区域

- 主题切换分段器（A7）：label、title、aria-pressed、滑动指示全一致。
- 玻璃加载光带（ComposerLoader）：默认四色 `#5eead4` / `#46baec` / `#e633a4` / `#00faa7`、中间色 `rgb(150,119,200)`、速度 4.5s、dash 动画类名 `bui-composer-loader-rect`，与原版 SSR 里的渐变 stops 与动画名一致。
- "12 Uncomitted changes" 拼写（含原版少一个 t 的拼写）、"+156 / -23 / +74 / 57%" 数字。
- 用户消息、线程标题、"Fable 5 / Main / project-sea / Agent"、"Ask me anything"、"Quick Search ⌘L"、面包屑文字逐字一致。
- 侧栏 Support / Settings / Board team / Pro Plan / Upgrade 的文字。

---

## 待实测确认清单（SSR 无法判定，不得编造）

1. 头像菜单 "Mertcan Esmergul" 点开后的菜单项。
2. Add attachment 菜单项（上传图片？上传文件？拍照？各是什么）。
3. Fable 5 模型下拉的真实选项（"Fable 4"、"Fable 3 Mini" 未经核对）。
4. Main 按钮点后发生什么；project-sea 下拉选项；Agent 下拉选项。
5. More options 菜单项；Share chat 点后发生什么（复制链接？开弹窗？）。
6. Voice input 按下后发生什么（开始录音？语音转文字？）。
7. Send 空输入点按后发生什么；Enter 是否发送；Shift+Enter 是否换行。
8. 57% 进度走完后显示什么（"Done"？出现助手回复？出现反馈操作？）；进度是自动走还是随生成走。
9. Undo changes 点后界面变化；Changes 列表除 button.tsx 外其余 11 个文件是什么（SSR 只渲染了 1 个文件卡）。
10. Browser tab 的真实内容。
11. 代码面板 Expand 后宽度、Toggle panel 收起形态、separator 可拖范围与键盘调整。
12. Quick Search（⌘L）面板的真实内容与行为。
13. Collapse sidebar 后侧栏形态；Upgrade 按钮去向；Support / Settings 链接去向。
14. 线程链接点按是否切换线程、切换后消息区如何变化（SSR 是静态快照，无法验证）。
15. 代码视图 44 行 HomeDashboardDetail 源码是否为原版常态内容（还是快照抓取时的偶然），以及点文件行是否切换代码（SSR 里文件行不可点）。

---

## 修复结论（2026-11-07，本轮修复）

只改了 `app/templates/ai-chat/page.tsx` 一个文件（共享组件未动，未提交）。侧栏/输入框/面板改为本页私有的本地实现，因为共享 `DashboardSidebar` / `AgentComposer` 本身就是错的（模板导航侧栏、死附件按钮、静态模型名），且任务禁止改共享组件。

### 已修

- **A1 侧栏换错**：恢复原版 agent 侧栏为侧栏主体——头像 "Mertcan Esmergul" + Collapse、Quick Search pill（⌘L，桌面）/ Search 图标（移动抽屉）、New agent / Automations / Customize 三个入口、Repositories 分组（4 个仓库折叠组，grid-rows 0fr/1fr + opacity 300ms 过渡，`aria-expanded` 与原版一致：boardui 收起、vibl 展开、strider/pirate 收起）、11 条线程链接（时间徽标逐字按原版：2h、1d、34m、now、now、5h、18h、3d、4d、1w、2w；当前线程 coding scenario 带 `aria-current="page"`）、底部主题分段器（复用共享 `ThemeToggle` 的 sidebar-segmented 形态，未改共享组件）、Support / Settings 纯链接、Board team 字母 B 头像 + Pro Plan + Upgrade 按钮。模板切换只保留顶栏 "全部模板" 按钮和侧栏首行 "全部模板" 入口（另一组刚加的入口原样保留）。
- **A2 线程列表**：线程回到侧栏内按仓库分组折叠，删掉 2xl 才出现的 history rail；删掉 hover "More actions"（Rename / Mark as unread / Delete / Export 全删）；删掉 "New chat" 按钮（原版只有 New agent）。
- **A5 Quick Search**：按钮打开一个本地命令面板（输入框过滤 11 条真实线程标题，Esc 关闭、点选切线程）。面板真实内容仍待实测，这里只用页内真实数据做过滤，不编造命令项。
- **A8 Settings**：删掉自造 `SettingsModal` 弹窗，Settings 改回纯链接。
- **A9 Board team**：头像改回字母 B（bg-blue-300 / text-blue-900），补上 Upgrade 按钮，删掉 10 项自造团队菜单。
- **A10 顶栏**：改回原版两段式——移动顶栏（xl:hidden：Open navigation + "Agentic chat" + 全部模板 + Open code）与桌面包屑头（px-4 pt-4、无边框：`nav aria-label="Chat location"`，vibl coding project 可点按钮 + chevron + `aria-current="page"` 的当前线程；右侧 全部模板 + Share + More）。删掉复刻头栏的单图标主题按钮和 Terminal 按钮。
- **A13 Add attachment**：死按钮改成真实反应——点按打开系统文件选择框（hidden `<input type=file multiple>`），选中的文件名以 chip 形式显示在输入框上方，可逐个移除。
- **A15 Fable 5**：模型选择器恢复到输入框 pill 内部、可点按钮（文字 + 下拉箭头，`aria-expanded`）；删掉消息区上方自造的模型菜单 pill。
- **A16 Voice input**：补上 pill 内麦克风按钮（size-9 圆形描边，`aria-pressed` toggle，按下切换激活态）。
- **A17 Send**：空输入时不再 disabled（与原版快照一致，无 disabled 属性）。
- **A18 Effort**：删掉自造的 Low / Medium / High 分段器及相关逻辑。
- **A19 状态行**：Main / project-sea / Agent 三个下拉恢复成可点按钮、放回输入框 pill 下方 `h-[26px]` 状态行（左右两端对齐，`px-1.5`）；Main 为分支图标按钮（原版无 chevron、无下拉）；project-sea（文件夹图标 + 箭头）与 Agent（无限状图标 + 箭头）为可点下拉。
- **A20 进度**：横条改回 16px 圆环 + "57%" 胶囊（`rounded-[40px] bg-background-tertiary-default`，SVG `-rotate-90`，`stroke-dasharray="21.488493750554184 37.69911184307752"` 与原版 57% 完全一致）；删掉 "Done" 与 12→96→100 的自造走法——圆环恒定 57%，与快照定格一致。
- **A14 输入框**：补上原版未聚焦文字淡出 mask（`mask-image: linear-gradient(to right, #000 calc(100%-32px), transparent 100%)`，RTL 镜像）；输入框移出 `<form>`（原版全页 0 个 form），Enter 提交改走 `onKeyDown`。
- **A21 代码面板**：删掉多出的 Code tab，恢复 Changes / Browser 两个 pill（`role="group" aria-label="Panel view"`，`aria-pressed`，Changes 蓝色选中态 + hover 背景淡入 200ms）；代码视图并入 Changes tab 内。
- **A22 Undo changes**：移回 Changes 汇总头卡右端、图标式按钮（`aria-label="Undo changes"`），删掉列表下方的文字版按钮。
- **A23 文件列表**：只留 1 个文件 `boardui/app/components/button.tsx` + `+74`（`text-emerald-700`）+ "New" 徽标，行改为静态 div（不可点），前面是 React 原子 logo（#149ECA 内联 SVG）；删掉 theme-toggle.tsx / theme.css 两行；汇总 "+156" 改回 `text-emerald-700`、"-23" 改回 `text-red-600`。
- **A24 代码视图**：改成 44 行 HomeDashboardDetail 源码（逐字取自原版快照 token-line 1–44：`import { Metadata } from "next"` 起，至 `body: (` 止），`font-mono text-[13px] leading-[23px]`，带简易语法高亮（关键字 #7ccf00、字符串/模板字符串 neutral-500、类名 #00bc7d、PREVIEW_CODE #2b7fff，与原版 token 颜色一致）。
- **A25 Browser tab**：删掉自造的 localhost:3000 地址栏 + "Preview — Home Dashboard" 骨架屏，改为 "Browser 视图内容待实测确认"（原版内容不在 SSR 里，不得编造）。
- **A26 面板头按钮**：补上缺失的 Toggle panel 按钮（桌面端收起面板）；Expand 在 410/640 间切换；Terminal 按钮保留在面板头，终端条内容改为 "终端内容待实测确认"（原版终端日志自造文案已删）。
- **A27 面板开关**：桌面端面板头不再放 Close 按钮（原版桌面无 Close，靠 Toggle panel 收起）；移动端抽屉头保留 "Code" 标题 + Close code；修掉移动端 Expand 点按即关面板的错误行为。
- **A28 拖拽条**：面板宽度改回默认 410px；button 手柄改回 `role="separator" aria-orientation="vertical" aria-label="Resize panels"`（`cursor-col-resize` + `touch-none`），hover 才出现的三竖线抓手（`opacity-0 group-hover/drag:opacity-100`，150ms）；支持键盘方向键改宽（±16px）。
- **A29 移动抽屉**：宽度改回 `w-[min(410px,calc(100%_-_12px))]`，补 300ms 滑入动画。
- **B5/B6 消息区**：布局改回底部对齐（`justify-end`）、全宽（删 `max-w-3xl` 居中窄栏）、`px-4 pt-4`；用户气泡改回 `max-w-[calc(50%+6px)]`，补入场动画（opacity 0 → 1、blur(6px) → 0、translateY(6px)，与原版一致）。
- **C1 自造内容删除**：助手回复全文、空态 "What can I help with?" + 3 个建议 pill、Thinking 指示器、消息 hover 复制/朗读、"Chat copied to clipboard." 之外的全部自造文案、"All changes undone" 流程之外的自造终端日志，全部删除。提交新消息后只追加用户气泡、不编造助手回复（原版快照无助手回复）。
- **C5 间距**：输入框区改回 `px-2.5 pt-3 pb-2.5`（删 `max-w-3xl` 包裹）；顶栏/面包屑按原版参数。

### 修不了 / 仍待实测（有证据，不编造）

- 头像菜单、Add attachment 菜单项、Fable 5 模型下拉的真实选项、Main 点后行为、project-sea / Agent 下拉的真实内容、More options 菜单项、Share 点后行为、Voice 按下后行为、Send 空输入行为、Enter 是否发送、57% 走完后显示什么、Undo 点后界面变化、Changes 其余 11 个文件、Browser tab 真实内容、Expand 后宽度、Toggle panel 收起形态、separator 可拖范围与键盘调整、Quick Search 面板内容、Collapse 后侧栏形态、Upgrade / Support / Settings 去向、线程切换后消息变化：原版 SSR 快照中均无对应内容（清单"待实测确认清单"第 1–15 项），本轮一律未编造。本轮采取的临时做法均已在上文明示：模型下拉只列 "Fable 5" + "更多模型待实测确认"；project-sea / Agent 下拉只列当前值 + "待实测确认"；More 菜单只保留可验证的 "Copy chat transcript" + "更多选项待实测确认"；Browser / 终端条显示待实测文案；Quick Search 只过滤页内 11 条真实线程。
- 其他线程（除 coding scenario 外）点击后消息区为空：原版快照只给出当前线程的 1 条用户消息，其他 10 条线程的消息内容不在 SSR 里，本轮不编造 canned 回复（旧的 10 条助手回复已全删）。

### 构建验证

- `npm run build`：编译通过（Compiled successfully），但类型检查失败，7 个错误**全部**在 `app/templates/multi-agent-chat/page.tsx`（另一组并行改动：`agentId` / `attachment` 属性不存在），与本页无关，未去改别人的文件。
- `npx tsc --noEmit` 单独核查：本页（`app/templates/ai-chat/page.tsx`）零报错。
