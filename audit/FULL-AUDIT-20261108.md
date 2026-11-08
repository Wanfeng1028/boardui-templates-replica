# BoardUI 全部模板 1:1 总审计（2026-11-08）

- 范围：全部 12 个模板页（10 个原版 Pro 模板 + HR Management + chat-starter 免费版块）。chat-starter 经核实为免费 starter 版块、非 Pro 模板（原站标题 "Chat Starter Template — Deploy a Working AI Chat in Two Minutes"），审计口径按免费版块计。
- 原站：https://www.boardui.com/templates/<name>（英文版为准；中文版作第二参照）。原站 SSR HTML 已下载到 ~/workspace/boardui-audit/orig/<name>.html。
- 复刻：https://ui.gemmae.dev/templates/<name>，代码 ~/workspace/boardui-templates-replica/app/templates/<name>/page.tsx。
- 方法：原站 SSR HTML + 复刻代码逐项比对。客户端渲染内容（菜单、弹窗、流程中间态）SSR 里没有的，一律标注“需 live 核验”，不许凭记忆编。分组审计（dashboard/finance/calendar、ai-chat/multi-agent-chat/chat-starter、ai-profile/medical-profile/hr）由三名审计员并行完成，编排者抽查复核；marketing / project-board / ai-image-generation 三个返工中模板按返工前已核实的证据列入，待返工完成后复核。
- 严重程度：High=一眼可见或功能缺失；Medium=细节差异；Low=像素级。
- 本轮只产清单，不修代码，不 push。修复另派。

## 总计

| 模板 | High | Medium | Low | 合计 | 需 live 核验 |
|---|---|---|---|---|---|
| dashboard | 6 | 8 | 5 | 19 | 10 |
| finance | 6 | 14 | 5 | 25 | 13 |
| calendar | 4 | 4 | 4 | 12 | 8 |
| ai-chat | 5 | 13 | 4 | 22 | 19 |
| multi-agent-chat | 3 | 13 | 3 | 19 | 14 |
| chat-starter | 3 | 7 | 3 | 13 | 11 |
| ai-profile | 4 | 2 | 2 | 8 | 5 |
| medical-profile | 8 | 7 | 4 | 19 | 11 |
| hr | 13 | 7 | 3 | 23 | 14 |
| marketing（返工中） | 3 | 0 | 0 | 3 | 1 |
| project-board（返工中） | 2 | 0 | 0 | 2 | 1 |
| ai-image-generation（返工中） | 4 | 0 | 0 | 4 | 4 |
| 共享外壳（SH-2 通知内容、SH-3 用户/团队菜单） | — | — | — | — | 2 |
| **合计** | **61** | **75** | **33** | **169** | **113** |

注：共享外壳 4 项（SH-1~SH-4）的 High/Medium/Low 已计入 dashboard / finance / calendar 各自的统计（三个页面都受影响），总计里不再重复加；共享外壳行的“需 live 核验”2 项（SH-2、SH-3）未包含在各模板的 live 数里，故 live 合计为各模板数 111 + 共享 2 = 113。multi-agent-chat 的 High 由分组报告的 1 项修正为 3 项（见“编排者纠正”第 1 条）。medical-profile 需 live 核验由分组报告表的 10 项修正为 11 项（见“编排者纠正”第 4 条）。

## 编排者纠正（分组报告中的错误结论，本文件以纠正后为准）

1. **multi-agent-chat MAC-00 结论推翻：两个可见原生 select 是 High 差距。** 分组报告称“原站 SSR 里本身就是两个原生 select，复刻照抄是对的”。编排者亲自核验原站 HTML 后推翻：原站的两个原生 `<select>` 位于 `hidden-select-container` 内，样式为 `position:fixed;width:1px;overflow:hidden` + `aria-hidden="true"`，是 react-aria 的隐藏伴生元素；可见控件是两个自定义按钮，aria-label 分别为 "Agent language"（显示 Auto-detect）与 "Agent voice"（显示 System voice），样式为 `rounded-2lg border border-border-button-default bg-background-primary-default shadow-xs`。我们复刻的两个可见原生 select（page.tsx:2224 语言、:2282 语音）仍是 High 差距；语音 select 另含多出的 "Mika" 选项（MAC-H1）。multi-agent-chat 的 High 由 1 项修正为 3 项，总计由 17 项修正为 19 项。
2. **Settings 死链的范围纠正：只对 ai-image-generation 证实为差距，ai-chat 待 live 核验。** 用户截图证实原站 ai-image-generation 的侧栏 Settings 点开设置弹窗（General/Profile/Appearance/Billing/Rules and Workflows/Tools/Storage 等），我们是死链接，属 High 差距。但原站 ai-chat 与 ai-image-generation 的 SSR 里 Settings 均为 `<a href="#">`（SSR 无法区分“死链”与“客户端挂弹窗处理器”，ai-image-generation 的 SSR 同样是 href="#" 却 live 打开弹窗），故不能仅凭 SSR 断定 ai-chat 的 Settings 是死链；ai-chat 的 Settings 标注“需 live 核验”，不计入已证实差距。hr / medical-profile / ai-profile 三页经核实原站 Settings 确为死链（与复刻一致，无差距）。
3. **ai-chat AC-M4 表述修正：CODE_LINES 确为 42 条非 44 条、行号错位属实，但 `breadcrumb={` 与 `sections={` 并非“整行缺失”，而是分别移位到第 25 / 41 条（第 12 条合并了两行所致）。** 差距成立，机理是合并+移位，修复时按原站 44 行逐行重排即可。
4. **medical-profile 需 live 核验数修正：分组报告表写 10 项，清单实际列出 11 项（M-2/M-3/M-4/M-5/M-8/M-9/M-11/M-12/M-14/M-18/M-19），以 11 项为准；** C 组总计 30 项不变（5+11+14）。

## 全局核查（编排者亲自核验，SSR + 代码证据）

### G-01 原生 select 与 BoardUI Select 数量对照（原站 SSR 自定义触发器 vs 复刻 page.tsx）
- 原站每个自定义下拉在 SSR 里对应一对：一个可见的 react-aria Button（aria-haspopup="listbox"）+ 一个隐藏的原生 select（`<select tabindex="-1">`，位于 data-testid="hidden-select-container" 内，仅供无障碍/表单提交）。两者数量恒相等，可作计数标尺。
- 原站 SSR 自定义触发器数：dashboard 15、finance 13、medical-profile 14、hr 13、marketing 13、multi-agent-chat 2；calendar / ai-chat / chat-starter / ai-profile / project-board / ai-image-generation 为 0（其下拉全在客户端渲染，SSR 无从计数）。
- 复刻 page.tsx 里 BoardUI `<Select` 用量：dashboard 8、finance 13、medical-profile 0、hr 0、marketing 0、multi-agent-chat 0、project-board 3（返工进行中）、其余 0。
- 复刻 page.tsx 里原生 `<select>` 数：marketing 7、medical-profile 3、multi-agent-chat 2、hr 1、其余 0（project-board 返工后已清零，工作区未提交）。
- 结论：medical-profile（原站 14 vs 我们 0 个 BoardUI Select + 3 个原生）与 hr（原站 13 vs 我们 0 + 1 个原生）缺口最大；dashboard（15 vs 8）亦缺口明显；finance 数量一致但需逐项核对是否为同一批下拉（分组报告 F-M1 已证实其中 Change period 四处模型不同：原站是 button 菜单触发器，复刻用的是 Select）。

### G-02 ai-chat 有 6 处渲染态“待实测确认”占位文案
- 位置：ai-chat/page.tsx 387 行（更多选项）、418 行（终端内容）、796 行（更多模型）、863 行（更多项目）、891 行（更多选项）、1127 行（Browser 视图内容）。
- 我们：六处菜单/面板直接向用户呈现“待实测确认”占位文案。分组报告已逐项列入 AC-H2/H3/H4/H5、AC-M12/M13。

### G-03 marketing Sessions 非 Channels 面板直接呈现占位文案（MK-03）
- 位置：marketing/page.tsx 约 641-644 行。
- 我们：sessionTab 不是 Channels 时，页面正中显示“待实测：原版 SSR 只渲染 Channels 面板，此面板数据需真机核对后补。”
- 原站：该面板真实内容待 live 核验。

### G-04 原站每个自定义下拉都有隐藏原生 select 伴生，勿把隐藏 select 误认为可见控件
- 判定方法：原站 SSR 里出现 `<select` 时，先看它是否在 `hidden-select-container` 内且 `tabindex="-1"`；是则为 react-aria 伴生元素，可见控件另有 aria-haspopup="listbox" 的按钮；只有可见控件是原生 select 时才算复刻照抄正确。本轮 multi-agent-chat 的 MAC-00 即因此误判，已纠正（见“编排者纠正”第 1 条）。

## 共享外壳（所有模板共用）

### SH-1 顶栏“全部模板”按钮 + 侧栏首行“全部模板”（/templates）
- 位置：TemplateShell 顶栏（template-shell.tsx:145，AllTemplatesButton 默认渲染）+ dashboard 侧栏首行（dashboard-sidebar.tsx:167）+ 各模板的同类入口。
- 原站：顶栏只有通知铃 + Filters + 主按钮；侧栏只有 9 项导航，无此入口；"全部模板"中英文案出现在英文页面上。
- 我们：模板切换入口遍布各模板页。
- 严重程度：Medium。备注：侧栏注释写明“kept per user instruction”，即用户亲令保留，**不要擅自删**，只记为与原站的已知 intentional 偏差。本项已计入 dashboard / finance / calendar 的统计。

### SH-2 通知中心弹窗内容未经证实
- 位置：通知铃弹窗。
- 原站：SSR 里无通知条目（role=dialog 出现 0 次）；角标数字是 5。
- 我们：starter-notifications.ts 5 条自编通知（Livia mentioned you / Workspace backup is ready / Review requested / API key rotated / Aspen mentioned you），标题与描述均为复刻自写；角标 5 已核实对上。
- 严重程度：Medium，需 live 核验条目内容。本项已计入 dashboard / finance / calendar 的统计。

### SH-3 用户菜单（Mertcan Esmergul）/ 团队菜单（Board team hi@boardui.com）点开后的内容未经证实
- 位置：顶栏/侧栏用户与团队菜单。
- 原站：SSR 里只有触发器，菜单内容不在 DOM。
- 我们：触发器都在（dashboard-user-menu.tsx / dashboard-team-menu.tsx）；菜单项内容未经证实。
- 严重程度：Medium，需 live 核验。本项已计入 dashboard / finance / calendar 的统计。

### SH-4 Checkbox 对勾描画动画缺失
- 位置：共享 Checkbox。
- 原站：SSR 里 `animate-check-draw` 出现 2 处（勾选态对勾 path 描画动画）。
- 我们：共享 `Checkbox`（components/base/checkbox/checkbox.tsx）全文无 `animate-check-draw`，勾选无描画动画。
- 严重程度：Low。本项已计入 dashboard / finance / calendar 的统计。

### SH-5 设置入口：ai-image-generation 是死链（High，证实）；ai-chat 待 live 核验；其余模板与原站一致
- 位置：各模板侧栏底部 Settings。
- 原站：ai-image-generation 的 Settings 点开设置弹窗（用户截图证实：左列 General / Profile / Appearance / Billing / Rules and Workflows / Tools / Storage / Desktop app / Plugins / Developer，Customized 区 Skills / Git；右列 General 面板）。ai-chat 的 Settings 在 SSR 里与 ai-image-generation 完全相同（均为 `<a href="#">`），无法仅凭 SSR 判定，需 live 核验。hr / medical-profile / ai-profile 三页原站 Settings 确为死链，与复刻一致，无差距。multi-agent-chat 已接通真正的 SettingsModal 组件。
- 我们：ai-image-generation 与 ai-chat 的 Settings 均为 `<a href="#">` 死链接（ai-chat/page.tsx:616、ai-image-generation/page.tsx:613）。
- 严重程度：ai-image-generation 为 High（计入 ai-image-generation 的 4 项）；ai-chat 为待 live 核验（不计入已证实差距）。SettingsModal 组件本身存在（components/application/settings/settings-modal），multi-agent-chat 已接通。


## marketing（返工中，待复核）

状态：原生下拉框返工已派工（2026-11-08 晚），本节为返工前核实的差距，待返工完成后复核。

### MK-01 [High] 7 处原生 select，原站全是 BoardUI 自定义下拉
- 位置：筛选器 Channel / Objective / Spend（page.tsx 约 829/836/843 行）、表格 Delivery 列（约 914 行）、新建 campaign 弹窗 Channel / Objective / Delivery（约 1059/1065/1071 行）。
- 原站：Delivery 单元格是 react-aria Button（type="button"，aria-haspopup="listbox"，data-react-aria-pressable），配白底边框按钮 + 状态圆点 + 16px chevron；筛选器同款。原站 SSR 全文无原生 select。
- 我们：7 处全是原生 `<select>`，点开是操作系统原生下拉框（用户截图为证）。
- 证据：原站 SSR（boardui-audit/orig/marketing.html）Delivery 按钮源码；复刻 page.tsx 上述行号。

### MK-02 [High] Delivery 触发器样式不对：我们是彩色 pill，原站是白底按钮 + 状态圆点
- 位置：表格 Delivery 列。
- 原站：白底按钮（bg-background-primary-default，border-border-button-default，shadow-xs，rounded-2lg，px-2.5 py-2）+ 状态圆点 + 文字 + chevron；圆点颜色 Active=绿（bg-status-dot-green-halo + green-500）、Paused=黄、Draft=靛蓝。
- 我们：彩色 pill（DELIVERY_STYLE：Active 绿底、Paused 黄底、Draft 灰底），无圆点。
- 证据：原站 SSR 10 个 Delivery 按钮逐个核对（Active 绿 / Paused 黄 / Draft 靛蓝）；复刻 DELIVERY_STYLE（page.tsx 约 198-202 行）。

### MK-03 [High] Sessions 非 Channels 面板直接呈现占位文案，需 live 核验
- 位置：marketing/page.tsx 约 641-644 行。
- 我们：sessionTab 不是 Channels 时，页面正中显示“待实测：原版 SSR 只渲染 Channels 面板，此面板数据需真机核对后补。”
- 原站：该面板真实内容待 live 核验。

## project-board（返工中，待复核）

状态：全量 1:1 返工已派工（2026-11-08 晚），本节为返工前核实的差距，待返工完成后复核。返工进行中：工作区已有未提交修改，Select 组件已引入，原生 select 已清零（以提交后为准）。

### PB-01 [High] 6 处原生 select，原站全是 BoardUI 自定义下拉
- 位置：ticket 详情面板 Status / Priority / Project（约 743/756/769 行）、新建 ticket 弹窗 Project / Priority（约 912/920 行）、新建列弹窗 Column（约 930 行）。
- 原站：SSR 全文无原生 select（"select" 命中全是 select-none 样式类与 /components/select 链接）；详情面板只在点击后客户端渲染，以 live 原站为准。
- 我们：6 处全是原生 `<select>`（用户截图：STATUS 下拉框为操作系统原生样式）。

### PB-02 [High] DS-38 详情面板数据与原站不符，需 live 核验精确值
- 位置：DS-38 "Agent handoff" 详情面板。
- 原站（用户截图，出自中文组件文档预览）：含 figma.com 资源链接、Token 用量 111.9百万 +4.9% 折线图（9月1日-9月16日）、Noah Williams 与 Elliot Lee 两条评论。
- 我们：描述 "Sketch how an agent asks for approval before a risky action..."、Token 用量 115.8K 柱状图、Priya Shah 一条评论。
- 证据：原站面板不在 SSR 里（'Token usage'/'Write a comment'/'Delete ticket' 均为 0 命中），以 live 原站为准逐字逐数对齐。

## ai-image-generation（返工中，待复核）

状态：模型菜单与生成流程返工已派工（2026-11-08 晚），本节为返工前核实的差距，待返工完成后复核。

### AI-01 [High] 模型菜单只有 "Fable 5 / Active" 加自编占位文案，原站是完整模型列表 + 努力程度滑杆，需 live 核验
- 位置：输入框模型菜单（page.tsx 约 785-793 行）。
- 原站（用户截图）：标题“型号”，选项 Composer 2.5、GPT-5.6 Sol、Fable 5（已选，蓝色圆点）、Sonnet 5，下方“努力程度”滑杆（左端“更快”、右端“更聪明”）。
- 我们：菜单里只有 "Fable 5 / Active" 加一句自编占位文案“更多模型待实测确认”。
- 证据：原站菜单不在 SSR 里（'Composer 2.5'/'GPT-5.6'/'Sonnet 5'/'Effort' 均为 0 命中），以 live 原站为准。

### AI-02 [High] 发消息无交互过程：我们的生成态不可见、图片直接呈现；原站有点阵占位 + 实时倒计时 + 渐进显现，需 live 核验
- 位置：发送流程（submit 约 206-220 行；生成卡片约 400-470 行）。
- 原站（用户截图）：发消息后卡片先显示点阵占位图（细密圆点网格）+ 底部“生成图像”文案 + 实时倒计时（如 4 s），图片随后才逐步显现。
- 我们：submit 只加用户气泡 + 1400ms busy 定时器；生成卡片里的 "Generating image" 文案与 "0 s" 倒计时被包在 opacity-0 里（根本看不见），图片 reveal 遮罩写死 132%（直接全显）。
- 证据：复刻代码上述行号；原站流程以 live 原站为准核对时序与动画。

### AI-03 [High] 其余“待实测确认”占位文案，需 live 核验各菜单真实内容
- 位置：page.tsx 约 304 行（更多选项）、860 行（更多项目）、888 行（更多选项）、1082 行（Styles 选项内容）、1144 行（更多操作）。
- 我们：五处菜单/面板直接呈现“待实测确认”类占位文案。
- 原站：待 live 核验各菜单的真实内容。

### AI-04 [High] 设置入口是死链接，原站打开设置弹窗（用户截图证实）
- 位置：侧栏底部 Settings（page.tsx:613）。
- 原站：点 Settings 打开设置弹窗（见 SH-5）。
- 我们：`<a href="#">` 死链接，点击无反应。
- 证据：用户 live 截图；原站 SSR 里 Settings 同为 `<a href="#">`（SSR 无法区分死链与客户端弹窗处理器，以 live 截图为准）。

## dashboard / finance / calendar（分组审计 A，详见 boardui-audit/gaps-dashboard-finance-calendar.md）

Dashboard 19 项（6 High / 8 Medium / 5 Low）、Finance 25 项（6 / 14 / 5）、Calendar 12 项（4 / 4 / 4），合计 56 项；共享外壳 4 项在三模板重复计，去重后独立项 48 项。以下为分组报告全文：


- 审计日期：2026-11-08
- 审计员：分组审计（只审计，不改代码、不 push、不 build）
- 原站依据：`~/workspace/boardui-audit/orig/` 下 SSR HTML（dashboard.html 363KB、finance.html 289KB、calendar.html 184KB）；三份原站 HTML 里 `role="dialog"` / `role="menu"` / `role="listbox"` 出现次数均为 0，即所有弹窗/菜单/抽屉内容都不在 SSR 里。
- 复刻依据：`~/workspace/boardui-templates-replica/app/templates/{dashboard,finance,calendar}/page.tsx`（当前工作区版本，2026-11-07 15:51/15:52）+ 共享组件（TemplateShell / DashboardSidebar / NotificationBell / Pagination / Select / Checkbox / StatCards）。
- 方法：python 从原站 HTML 提取可见文字与 aria-label / data-tier / style 百分比，与复刻代码里的写死数据逐项比对；前人差距笔记（`audit/*-gaps.md`）只作起点，每条都重新核实，结论以本次实测为准。
- 严重程度：High = 一眼可见或功能缺失；Medium = 细节差异或未经证实的自拟内容；Low = 像素级 / 无障碍命名级。
- 需 live 核验 = 原站行为在 SSR 里不存在，只能真机打开原站核对；报告里每项都已标注。

## 必查清单总结果（三个模板通用）

- (a) 原生 `<select>`：三份 `page.tsx` 里 grep `"<select"` 均为 0 处，全部下拉用的都是 BoardUI `Select`（`components/base/select/select.tsx`，包的是 `react-aria-components` 的 Select）。原站 SSR 里确有 15（dashboard）/ 13（finance）个 `<select>`，但逐个看都是 react-aria Select 渲染的隐藏原生 select（`<select tabindex="-1">`，外面包着 `data-rac` 的 div），不是手写原生下拉。结论：(a) 项三模板全部通过，无 High。
- (b) 占位/编造文案：三份 `page.tsx` 里 grep `TODO` / `待确认` / `更多模型` 均为 0 处。唯一出现 `待实测确认` 的是 finance/page.tsx:446 的代码注释（不在用户界面上）。但各模板的弹窗/菜单/空态文案大量系复刻自拟（见各节 High 项），属于 (b) 类的实质问题，已按项列出。
- (c) 文字与数据：逐项核对结果见各节末尾“已核实无差距”小节；KPI、首屏行数据、热力图数值全部对上，错的主要是自拟的图表拆分与周期数据。
- (d) 原站有、复刻缺失 vs 复刻多出：见各节。
- (e) 假交互：见各节（死分段器、只改标签的周期切换、setTimeout toast 等）。
- (f) 图表：dashboard 两图月/年数据自拟；finance Sankey/donut/气泡拆分自拟；数值逐项核对见各节。

## 前人笔记纠正：本次核实已关闭的项（不再是差距）

以下为前人笔记写过、但本次重核发现已经修好或原先就断言错误的项，写在这里以免重复返工：

1. **分页 "…" 不是差距（前人 finance F-C7 断言错误）**。原站 SSR 首屏分页就是 `1 2 3 4 5 … 55`（dashboard）和 `1 2 3 4 5 … 14`（finance），`…` 字符直接存在于原站 HTML；复刻共享 `Pagination`（`pagination.tsx:136` 渲染 `…`，`paginationRange` 在第 1 页 total 55/14 时算出 `[1,2,3,4,5,…,last]`）与原站一致。
2. **通知角标 5 vs 3 已修好**。`starter-notifications.ts` 现为 5 条且全部 `unread: true`，文件头注释写明“Five unread, matching the original template's notification badge (5)”；原站三页角标均为 5。数字已对上，只剩通知条目内容本身未经证实（见 SH-2）。
3. **面包屑 href 已修好**。`template-shell.tsx:114,118` 两项均为 `href="/templates/dashboard"`，与原站一致（前人 F-C14 / C-CLICK-11 关闭）。
4. **侧栏 HR Management / Multi-Agent Chat 已移除**。`dashboard-sidebar.tsx:157-161` 注释写明这两项“intentionally NOT here”，`DASHBOARD_NAV` 只有原站 9 项 + “全部模板”首行。
5. **Settings 已改回死链**。`dashboard-sidebar.tsx:545-548` 注释写明“Original is a dead link (href="#", no modal)… Do not re-attach a popup here”，Settings 的 NavItem 无 onClick（前人 F-C13 关闭）。
6. **侧栏搜索框 placeholder 已是 "Search..."**。`dashboard-sidebar.tsx:402,475` 两处均为 `placeholder="Search..."`，与原站一致（前人 finance F-S8 关闭）。
7. **Dashboard 前人已修项本次确认仍在**：B1 “Board team” 可点下拉（`page.tsx` RecentHiresCard 内 Dropdown）、B2 新员工 tile 回静态展示、B3 Previous/Next 回卡片底部文字按钮、S2 “previous total”行已删、S3 热力图提示+图例已删、S4 “Page 1 of 14”已删、S5 表格底部页码行已删、S15 图表卡头 `sm:gap-0.5`、D1 热力图 259 格回 `tabIndex={-1}` + `cursor-default`、F2 三个排序按钮 aria-label 已补、F5 Delivery 回静态 chip、F6 行名回静态文字、F8 每行补 Delete 按钮、F9 More actions aria-label 含人名。逐项 grep/读码确认，均在。
8. **Finance 前人已修项本次确认仍在**：F-C1 三处 Change period 触发器已恢复（Cash flow / donut / Portfolio / 热力图共 4 处 `aria-label="Change period"`，`finance/page.tsx:308,386,469,534`）、F-C2 每行 Delete 按钮已补（`aria-label="Delete"`，在 Edit 之前）、F-C4 行内 Category 下拉已删（Category 列回纯文本）、F-C5 交易名回静态 `<span>`、F-C6 预勾选 `new Set(["2","4"])` 已恢复、F-S1 负金额回 ASCII `-`（`fmtSigned`，`finance/page.tsx` 约 line 60）、F-S3 图例回 5 块 8/31/54/77/100%、F-I1 热力图 84 格回 `<div role="img">`。
9. **Calendar 前人已修项本次确认仍在**：C-CLICK-1 42 格回普通 `<div>`（`calendar/page.tsx` 约 line 330-360）、C-CLICK-2 “Selected day”区已删（全文无 "Selected day"）、C-CLICK-4 “Today · Aug 2026”按钮已删（全文无 "Today"）、C-CLICK-3 “+2 more” 回纯文本 `<span>` 且 8 月 20 日渲染全部 4 个 chip、C-STAT-1 当月格 `bg-background-primary-default max-sm:dark:bg-background-secondary-default sm:shadow-card`、非当月格 `bg-background-secondary-default sm:bg-background-tertiary-default`（与原站 cell class 逐字一致，本次从原站 HTML 提取的两类 cell class 各 1 种，复刻代码里同一组 class 完全相同）、C-STAT-4 详情弹窗 “– 1 hour” 已删（全文无 "1 hour"，只显示开始时间或 "All day"）、C-INT-2 页面级 Escape 监听已加（`calendar/page.tsx` 约 line 145-160）。

## 共享外壳差距（三个模板共用，计入每个模板的统计）

| ID | 位置 | 原站是什么 | 我们是什么 | 严重程度 | 需 live 核验 |
|---|---|---|---|---|---|
| SH-1 | 顶栏“全部模板”按钮 + 侧栏首行“全部模板”（`/templates`） | 原站顶栏只有通知铃 + Filters + 主按钮；侧栏只有 9 项导航，无此入口 | `template-shell.tsx:145`（`AllTemplatesButton`，默认渲染）+ `dashboard-sidebar.tsx:167` 侧栏首行；中文文案出现在英文页面上 | Medium | 否（SSR 可证实多出）。但注意：侧栏注释写明“kept per user instruction”，即用户亲令保留，**不要擅自删**，只记为与原站的已知 intentional 偏差 |
| SH-2 | 通知中心弹窗内容 | 原站 SSR 里无通知条目（role=dialog 出现 0 次）；角标数字是 5 | `starter-notifications.ts` 5 条自编通知（Livia mentioned you / Workspace backup is ready / Review requested / API key rotated / Aspen mentioned you），标题与描述均为复刻自写 | Medium | 是（条目内容只能 live 核对；角标 5 本次已核实对上） |
| SH-3 | 用户菜单（Mertcan Esmergul）/ 团队菜单（Board team hi@boardui.com）点开后的内容 | 原站 SSR 里只有触发器，菜单内容不在 DOM | 触发器都在（`dashboard-user-menu.tsx` / `dashboard-team-menu.tsx`）；菜单项内容未经证实 | Medium | 是 |
| SH-4 | Checkbox 对勾描画动画 | 原站 SSR 里 `animate-check-draw` 出现 2 处（勾选态对勾 path 描画动画） | 共享 `Checkbox`（`components/base/checkbox/checkbox.tsx`）全文无 `animate-check-draw`，勾选无描画动画 | Low | 否 |

---

## 一、Dashboard

### 差距

| ID | 位置 | 原站是什么 | 我们是什么 | 严重程度 | 需 live 核验 |
|---|---|---|---|---|---|
| D-H1 | 图表卡 Monthly / Yearly 周期数据（`dashboard/page.tsx:100-172` EARNINGS / REVENUE 的 monthly、yearly 数组） | 原站 SSR 里图表是客户端渲染，无任何月/年数值；周合计 $7,462 / $18,240 是唯一可核实的数 | Monthly：Earnings 周值 6840/7210/7490/7680（合计 $29,220）、Revenue 16800/18420/17960/19840（合计 $73,020）；Yearly：Earnings 各月 25400–33200（合计约 $361,000）、Revenue 各月 58900–78100（合计约 $835,000）。全部为复刻自拟，切换周期即显示未经证实的数字 | High | 是（月/年真实值只能 live 看原站图表） |
| D-H2 | 图表 hover 行为（`dashboard/page.tsx:426-430` 标题换数逻辑；`:481,508` 两处 `Tooltip content={() => null}`） | 原站用 recharts，hover 时 tooltip 内容在 SSR 里不可见；是否换标题未知 | hover 到某点就把卡片标题数字换成该点数值（`point ? point.current : totalCurrent`），同时把 recharts tooltip 整个禁掉 | High | 是（原站 hover 是否换标题、有无 tooltip、tooltip 长什么样，只能 live 核对） |
| D-H3 | Contributions 卡 Activity 分段器（`dashboard/page.tsx:597` `useState<Period>("weekly")`；`:644-650` onSelectionChange 只 `setPeriod`） | 原站有 Weekly / Monthly / Yearly 分段器（`aria-label="Activity period"`，SSR 可证实）；切换后网格是否重算，SSR 看不出 | `period` 状态除了 `selectedKeys` 外没有任何使用处：切换 Weekly/Monthly/Yearly 后 259 格数据、月份刻度、标题 958 全部不变，是空转的分段器 | High | 是（若原站切换会重算网格，则这是功能缺失；若原站也不变，则只是未证实——必须 live 定） |
| D-H4 | 顶栏 Filters 面板（`dashboard/page.tsx:1040-1075`，`filterOpen` 面板：“Filter customers”+ 3 个 Select + Clear / Done） | 原站顶栏只有 Filters 按钮本身；点后发生什么 SSR 里没有；表格上方本来就有 3 个筛选 Select（`aria-label="Filter by price/product/region"`，选项与复刻一致） | 点 Filters 打开第二份筛选控件（与表格内筛选重复），Clear 重置并关闭、Done 关闭、点面板外关闭；整套面板结构与文案系复刻推断 | High | 是（原站 Filters 点后行为只能 live 核对） |
| D-H5 | Create ticket 弹窗（`dashboard/page.tsx:685-745` CreateTicketModal：Customer 下拉 6 人 + Title 必填 + Priority Low/Medium/High/Urgent + Description；占位文案 `e.g. Delivery failed for order #4821` / `What happened, and what should support do?`；提交后 toast `Ticket created: <标题>`） | 原站只有顶栏 “Create ticket” 按钮和每行 Edit 按钮；弹窗字段 SSR 里没有 | 弹窗字段、必填规则、6 人客户下拉、优先级四档、占位文案、提交 toast 全部为复刻自拟 | High | 是（原站弹窗真实字段与流程只能 live 核对） |
| D-H6 | 每行 More actions 菜单（`dashboard/page.tsx:750-790` RowMoreMenu：View profile / Duplicate row / Download invoice / Archive customer；Duplicate 会插一行 `name (copy)`，Archive 直接删行并 toast） | 原站每行有 `aria-label="More actions for <人名>"` 触发器 ×12，菜单内容不在 SSR 里；"View profile" / "Duplicate row" / "Download invoice" / "Archive customer" 在原站 HTML 全文检索不到 | 菜单四项文案与改表逻辑均为复刻自拟 | High | 是（原站菜单真实内容只能 live 核对） |
| D-M1 | 表格排序按钮箭头（`dashboard/page.tsx:842-843` `sortMark`：激活后追加 `" ↑"` / `" ↓"`；`:904,907,908` 三处按钮） | 原站三个排序按钮只有 `aria-label="Sort by Customer name / Last updated / Price"`，SSR 里无箭头标记 | 排序激活后在文案后追加 ↑/↓，原站没有的视觉标记 | Medium | 否 |
| D-M2 | 表格空态文案（`dashboard/page.tsx:988`） | 原站 HTML 全文无 "No customers match these filters." | 筛选无结果时显示 "No customers match these filters."，系复刻新增文案 | Medium | 是（原站空态长什么样只能 live 看；SSR 无此句） |
| D-M3 | Toast 反馈（`dashboard/page.tsx:1014` `setTimeout(() => setToast(null), 3500)`；底部居中胶囊；`Ticket created: …` / `Duplicated …` / `Archived …` / `Deleted …`） | 原站 SSR 里无 toast（全文无 "Ticket created" / "Duplicated" / "Archived"） | 增删改操作都弹 toast，3.5 秒消失；反馈形态系复刻自加 | Medium | 是（原站有无 toast 只能 live 核对） |
| D-M4 | Recent hires “Board team”下拉菜单内容（`dashboard/page.tsx` RecentHiresCard 内 Dropdown；菜单只有 "Board team" 一项） | 原站卡片右上是可点按钮（带 chevron，应为团队筛选下拉）；菜单内容不在 SSR 里 | 触发器已修回可点按钮，但下拉菜单里只放了唯一已知项 "Board team"，其余菜单项未知 | Medium | 是 |
| D-M5 | 每行 Delete 直接删行（`dashboard/page.tsx:959-968`：点后直接 `setRows(filter)` + toast `Deleted <姓名>`，无确认框） | 原站每行有 `aria-label="Delete"` 的图标按钮 ×12；点后是直接删还是先弹确认框，SSR 看不到 | 直接删行，无确认；原站行为未知 | Medium | 是 |
| D-L1 | 每行 Edit / Delete 的 aria-label（`dashboard/page.tsx:959` `Edit ${c.name}`；`:963` `Delete ${c.name}`） | 原站 12 行的 aria-label 一律是通用词：`aria-label="Edit"` ×12、`aria-label="Delete"` ×12（本次从原站 HTML 提取确认） | 复刻改成含人名的 "Edit John Clarkson" / "Delete John Clarkson"，与原站命名不一致 | Low | 否 |
| D-L2 | Total Results 选中计数（`dashboard/page.tsx` CustomersTable 头部：`{selected.size > 0 ? ` · ${selected.size} selected` : ""}`） | 原站只有 "Total Results / 660 / customers"，无选中计数 | 勾选行后追加 " · N selected"，原站没有的文字（只在交互后出现） | Low | 否 |
| D-L3 | 热力图网格外层多出的无障碍属性（`dashboard/page.tsx` ContributionsCard 网格 div：`role="img" aria-label="Contributions heatmap, 958 contributions this year"`） | 原站网格 div 只有 `data-accent="violet"` + `contributions-grid grid gap-1 …` class，无 role / aria-label | 复刻多加 role + aria-label（读屏行为差异，视觉无差） | Low | 否 |
| D-L4 | 图表卡金额节点拆分（`dashboard/page.tsx` PeriodChartCard 标题：`{fmtMoney(headline)}` 单节点 "$7,462"） | 原站 "$" 与 "7,462" / "18,240" 分属两个文本节点 | 复刻合并为单个 "$7,462" 节点；可见文字完全相同，仅 DOM 节点拆分不同 | Low | 否 |

### 已核实无差距（dashboard，本次实测）

- KPI 四卡数值逐字一致：Customers 14,592 +5.3% / Unit sold 385 -2.1% / Orders 1,394 0.00% / Support tickets 708 +12.8%（`stat-cards.tsx:63-66` 与原站可见文字一致）。
- 热力图 259 格数值逐格一致：本次把原站 259 个 aria-label（`No contributions on Jan 1` / `23 contributions on Jan 21` …）转成数值，与复刻 `DASHBOARD_HEATMAP` 259 条逐项比对，**0 处不符**，合计均为 1,721（与卡片标题 958 不一致是原站自身的不一致，复刻如实保留）。
- 热力图月份刻度 Jan–Dec 12 个全在（复刻 `monthMarks` 逻辑模拟结果为 12 个月齐全）。
- Recent hires 首屏 4 人逐字一致：Livia Saris / Joined today / Backend Engineer、Jaydon Aminoff / 2 days ago / UI Designer、Maria Lubin / 5 days ago / User Researcher、Ann Press / A week ago / DevOps Engineer；总数 56 一致。
- 图表卡周合计一致：Earned so far $7,462 +14.8%、Revenue $18,240 +9.4%（复刻 weekly 数组求和：Earnings 820+940+1130+980+1240+1310+1042=7,462；Revenue 2140+2380+2650+2420+2890+3120+2640=18,240）。
- Customers 表首屏 12 行逐字一致：John Clarkson $3.412 Sep 05, 2026 / Aspen Lubin $1.899 Mar 25, 2026 / Michael Ekstrom $2.752 Aug 01, 2026 / Kianna Vaccaro $145 Apr 02, 2026 / Livia Saris $708 Nov 14, 2026 / Jaydon Aminoff $224 Jul 17, 2026 / Maria Lubin $2.959 Nov 15, 2026 / Ann Press $2.646 Sep 20, 2026 / Zaire Torff $3.770 Feb 04, 2026 / Gretchen Septimus $3.740 Apr 20, 2026 / Omar Vetrovs $1.747 Jul 10, 2026 / Talan Calzoni $3.976 Nov 13, 2026（价格千分位点号 `$3.412` 与原站一致；Purchase 状态与 Delivery 状态逐行一致）。
- 表格筛选器 3 个下拉选项逐字一致；分页 1–5 … 55 与原站一致（见前人纠正第 1 条）。
- 标题/面包屑：heading "Welcome Mertcan"、title "Home"，与原站一致。
- 未逐项核对、只记不判：hover 变色覆盖（原站 SSR 里 `hover:text-text-primary` 出现 56 次、`hover:bg-background-primary-hover` 62 次，复刻 `page.tsx` 内分别只有 3 次 / 1 次——但两者口径不可比，原站 SSR 把共享外壳 inline 进同一份 HTML，复刻把外壳拆进了组件文件，本次未逐项核对每个元素的 hover 态，**不下结论，需 live 逐项点检**，记为 Low 待核）。

### Dashboard 统计

- **High 6 / Medium 8（含共享 SH-1、SH-2、SH-3）/ Low 5（含共享 SH-4），共 19 项**（页面自身 High 6、Medium 5、Low 4）。

---

## 二、Finance

### 差距

| ID | 位置 | 原站是什么 | 我们是什么 | 严重程度 | 需 live 核验 |
|---|---|---|---|---|---|
| F-H1 | 4 张卡的 Change period 选项（`finance/page.tsx:100-108` CASHFLOW_PERIODS：This month / Last month / This year，factor 0.94 / 10.77，income 17,315 / 198,383；`:446-450` PORTFOLIO_PERIODS：Year to date / Last 12 months / All time；`:509-514` HEATMAP_PERIODS：Last 12 / 8 / 4 weeks） | 原站 4 处均为 `<button aria-label="Change period" aria-expanded="false">`（本次从原站 HTML 提取，共 4 个），菜单选项不在 SSR DOM 里 | 4 处选项列表全部为复刻暂定；Cash flow / donut 按 factor 等比缩放金额（Last month 0.94、This year 10.77 均为自拟系数，income 17,315 与 198,383 无原站来源） | High | 是（原站菜单真实选项只能 live 点开核对） |
| F-H2 | Cash flow Sankey 节点拆分（`finance/page.tsx:100-130` SANKEY_IN / SANKEY_OUT：Salary 12,600 / Freelance 3,420 / Investments 2,400；Savings 9,280 / Housing 2,940 / Groceries 1,860 / Dining 1,120 / Transport 920 / Travel 680 / Subscriptions 640 / Utilities 580 / Health 400） | Sankey 在原站 SSR 里完全没有 SVG；"Salary" / "Freelance" / "Investments" 在原站 HTML 全文出现 **0 次**（本次检索确认）；收入合计 18,420 与支出合计 9,140 只与卡头总数对得上，拆分无来源 | 节点标签与数值全部为复刻推断 | High | 是（只能 live 看原站 Sankey） |
| F-H3 | Spending donut 分类拆分（`finance/page.tsx:118-130` DONUT：Housing 1,740 / Groceries 1,162 / Transport 872 / Dining 581 / Subscriptions 465 / Utilities 407 / Travel 349 / Health 234，合计 5,810） | 原站 SSR 里只有总数 $5,810（+2.4%），各分类值不在 HTML 里；donut 本体是客户端渲染 | 8 个分类值全部为复刻推断（合计凑 5,810） | High | 是（只能 live 看原站圆环） |
| F-H4 | 顶栏 Filters 面板（`finance/page.tsx:950-990` 附近，`filterOpen` 面板：“Filter transactions”+ 3 个筛选 Select + Clear / Done） | 原站顶栏只有 Filters 按钮；点后发生什么不在 SSR 里；表格上方本来就有 3 个筛选 Select（选项与复刻一致） | 面板结构与文案系复刻推断，且与表格内筛选重复 | High | 是 |
| F-H5 | Add / Edit 交易弹窗（`finance/page.tsx:600-660` AddTransactionModal：Transaction / Account / Category / Amount / Date 五字段；标题 "Add transaction" / "Edit transaction"；提交按钮 "Add transaction" / "Save changes"；占位文案 `e.g. Whole Foods Market` / `-135 or +6200` / `Nov 07, 2026`；新建默认日期 "Nov 07, 2026"） | 原站只有顶栏 "Add transaction" 按钮与每行 Edit 按钮；弹窗标题与字段在原站 HTML 全文检索不到 | 弹窗标题、字段、占位文案、默认值全部为复刻编造 | High | 是 |
| F-H6 | 每行 More 菜单（`finance/page.tsx:670-700` TxMoreMenu：View details / Duplicate row / Delete transaction；Duplicate 插行、Delete 删行并 toast） | 原站每行有 `aria-label="More actions for <交易名>"` 触发器 ×10（本次提取确认），菜单内容不在 SSR 里；"View details" / "Duplicate row" / "Delete transaction" 在原站 HTML 全文检索不到 | 菜单三项文案与改表逻辑均为复刻编造 | High | 是 |
| F-M1 | Change period 触发器类型（`finance/page.tsx:308,386,469,534` 四处 `Select aria-label="Change period"`） | 原站四处都是 `<button aria-label="Change period" aria-expanded="false">`（菜单触发器，`data-rac` 的 react-aria Button，不是 Select） | 复刻用 BoardUI Select（listbox 弹窗）实现；外观上都显示当前值，但交互模型不同（菜单 vs 下拉列表，键盘行为与 aria 语义不同） | Medium | 是（菜单 vs 列表的行为差异需 live 确认原站点开形态） |
| F-M2 | Donut 图例行（`finance/page.tsx:440-460` 附近：8 行图例，分类名 + 金额，静态 div） | 原站 SSR 里该卡只有标题行（"Spending by category $5,810 +2.4% This month"），无图例行 DOM | 渲染了 8 行图例；原站客户端渲染后是否确有图例未知 | Medium | 是 |
| F-M3 | Portfolio 气泡位置与数值（`finance/page.tsx:430-455` BUBBLES：Stocks 8% / risk 6.5 / r 30；Funds 3% / 3.2 / 20；Crypto 12% / 9.1 / 40；`px`/`py` 坐标公式自拟） | 气泡 SVG 在原站 SSR 里不存在；可核实的只有标题行文字 "Stocks 8% · Funds 3% · Crypto 12%"、7%、+6.2%、Return / Risk score（这些复刻都对） | 气泡大小、坐标、risk 数值（6.5 / 3.2 / 9.1）无原站来源 | Medium | 是 |
| F-M4 | Portfolio 周期切换只改标签（`finance/page.tsx:456-470`：`periodId` 切换后 7% / +6.2% / 三个气泡全部不变，只换右上角标签） | 原站 Portfolio 卡头有 "Year to date" 的 Change period 按钮；切换后数值是否变化，SSR 看不出 | 切换 Year to date / Last 12 months / All time 后图表与数字纹丝不动，近似空转 | Medium | 是 |
| F-M5 | 表格排序按钮缺 aria-label 且多出箭头（`finance/page.tsx:762` `sortMark`；`:823,826,827` 三个排序按钮） | 原站三个按钮带 `aria-label="Sort by Transaction / Sort by Date / Sort by Amount"`（本次提取确认），SSR 里无箭头标记 | 复刻三个按钮无 aria-label；激活排序后追加 " ↑" / " ↓" | Medium | 否 |
| F-M6 | 表格底部多出一行文案（`finance/page.tsx:901`：`Page {safePage + 1} of {totalPages} · {filtered.length} transactions`，首屏渲染为 "Page 1 of 14 · 140 transactions"） | 原站表格底部只有分页按钮（Previous / 1–5 / … / 14 / Next），全文无 "Page 1 of 14" | 复刻多出一行原站没有的文案 | Medium | 否 |
| F-M7 | 热力图格子颜色公式差 1 个百分点（`finance/page.tsx:540` 附近 `pct = v => Math.min(100, Math.round(7.5 + v * 0.75))`） | 原站每格 style 里有精确百分比（本次从原站 HTML 提取 84 格 aria-label + 百分比逐项比对） | 84 格中有 **24 格**与原站差 1 个百分点：Mon W4 $21（原 24% / 复刻 23%）、Mon W5 $28（29% / 28%）、Mon W11 $29（30% / 29%）、Tue W4 $25（27% / 26%）、Tue W6 $28（29% / 28%）、Tue W8 $21（24% / 23%）、Wed W1 $52（47% / 46%）、Wed W7 $64（55% / 56%）、Wed W12 $72（61% / 62%）、Thu W1 $21（24% / 23%）、Thu W9 $25（27% / 26%）、Thu W10 $29（30% / 29%）、Fri W1 $64（55% / 56%）、Fri W3 $72（61% / 62%）、Fri W9 $88（73% / 74%）、Sat W1 $88（73% / 74%）、Sat W8 $96（79% / 80%）、Sat W10 $104（85% / 86%）、Sat W11 $112（91% / 92%）、Sun W3 $52（47% / 46%）、Sun W4 $44（41% / 40%）、Sun W7 $60（53% / 52%）、Sun W8 $52（47% / 46%）、Sun W9 $64（55% / 56%） | Medium | 否（数值可测，肉眼难辨） |
| F-M8 | Cash flow 卡底部多出一行 caption（`finance/page.tsx` CashFlowCard 底部：`Income $18,420 · Spending $9,140 · Savings $9,280`） | 原站该卡底部右侧只有 "Income" / "Spending" 两个词；"Spending $9,140" 与 "Savings $9,280" 在原站 HTML 全文出现 **0 次** | 复刻多出一行左侧 caption 文案 | Medium | 否 |
| F-M9 | Sankey 与 Donut 的分类值互相矛盾（同为 “This month” 支出拆分） | 原站 SSR 里两处拆分都不可见，无法判定谁对 | Sankey 支出侧：Housing 2,940 / Groceries 1,860 / Dining 1,120 / Transport 920 / Travel 680 / Subscriptions 640 / Utilities 580 / Health 400（合计 9,140）；Donut：Housing 1,740 / Groceries 1,162 / Dining 581 / Transport 872 / Travel 349 / Subscriptions 465 / Utilities 407 / Health 234（合计 5,810）。同一分类两个数，至多一个能与原站对上 | Medium | 是（live 看原站两处真实值才能定） |
| F-M10 | 表格空态文案（`finance/page.tsx:894`） | 原站 HTML 全文无 "No transactions match these filters." | 筛选无结果时显示该句，系复刻新增文案 | Medium | 是 |
| F-M11 | Toast 反馈（`finance/page.tsx:923` `setTimeout(..., 3500)`；`Deleted …` / `Added …` / `Updated …` / `Duplicated …`） | 原站 HTML 全文无 "Duplicated …" / "Deleted …" / "Added …" | 增删改操作弹 toast，3.5 秒消失；反馈形态系复刻自加 | Medium | 是 |
| F-L1 | 行 More 菜单触发器 aria-label（`finance/page.tsx` TxMoreMenu：`aria-label="More actions"` 通用） | 原站 10 行均为 `aria-label="More actions for <交易名>"`（本次提取确认） | 复刻丢了交易名（dashboard 同款菜单已修成含人名，finance 这处漏了） | Low | 否 |
| F-L2 | 每行 Edit 的 aria-label（`finance/page.tsx:875` `Edit ${t.name}`） | 原站 10 行一律是通用词 `aria-label="Edit"`（本次提取确认） | 复刻改成含人名的 "Edit Whole Foods Market" 等 | Low | 否 |
| F-L3 | Total Results 选中计数（`finance/page.tsx` TransactionsTable 头部：`{selected.size > 0 ? ` · ${selected.size} selected` : ""}`） | 原站只有 "Total Results / 140 / transactions"，无选中计数 | 勾选后追加 " · N selected"（首屏即有 2 行预勾选，故首屏就显示 "140 transactions · 2 selected"） | Low | 否 |
| F-L4 | 金额筛选桶语义未经证实（`finance/page.tsx` AMOUNT_BUCKETS：Under $50 与 $50–$500 只测负数，即 `a < 0 && |a| < 50`） | 原站选项文案是 "Under $50" / "$50 – $500" / "Over $500"，但桶的精确语义（是否含正数、边界开闭）SSR 看不出 | 复刻假定只筛支出；若原站 "Under $50" 含小额收入，则筛出结果不同 | Low | 是 |

### 已核实无差距（finance，本次实测）

- KPI 四卡数值逐字一致：Total balance $84,230 +3.2% / Income $18,420 +6.1% / Expenses $9,140 +2.4% / Invested $32,400 +8.4%。
- 热力图 84 格数值逐格一致（Mon W1 $24 … Sat W12 $124，本次从原站 aria-label 提取 84 格与复刻 `DAILY` 逐项比对，0 处不符）；数值合计 4,390，与卡头 "$4,390 +3.6%" 一致（复刻 `DAILY` 求和验证为 4,390）。
- 热力图图例 5 块 8 / 31 / 54 / 77 / 100% 与原站一致（原站 style 百分比序列末 5 个即 8/31/54/77/100）。
- 交易表首屏 10 行逐字一致：Whole Foods Market Savings Groceries Oct 28, 2026 -$135、Spotify Savings Subscriptions Jul 15, 2026 -$12、Acme Corp payroll Savings Income Jun 17, 2026 +$6,200、iCloud storage Savings Subscriptions Feb 03, 2026 -$3、Electric utility Credit card Utilities Jun 06, 2026 -$91、Whole Foods Market Savings Groceries Apr 05, 2026 -$161、Studio K invoice Checking Income Dec 14, 2026 +$1,286、Shell Credit card Transport Nov 01, 2026 -$76、Netflix Credit card Subscriptions Dec 14, 2026 -$18、iCloud storage Checking Subscriptions Apr 24, 2026 -$3（账户/分类/日期/金额全部一致；负金额 ASCII `-` 已修好）。
- 预勾选一致：原站 `checked` 出现 2 处（Acme Corp payroll、Electric utility），复刻 `new Set(["2","4"])` 一致。
- 表格筛选器选项逐字一致（All accounts / Checking / Savings / Credit card；11 个分类含 Investing；All amounts / Income only / Under $50 / $50 – $500 / Over $500）；搜索框 placeholder "Search" 一致；"Total Results 140 transactions" 一致；分页 1–5 … 14 与原站一致。
- Donut 总数 $5,810 与原站一致（仅拆分未知）；Cash flow 卡头 $18,420 +6.1% 与原站一致；Portfolio 标题行 7% +6.2% 与 "Stocks 8% · Funds 3% · Crypto 12%" 与原站一致。
- 每行 Delete 按钮 `aria-label="Delete"` 与原站一致；行 Account 下拉选项与原站一致。
- 前人 F-C7（分页 "…"）本次证伪，见“前人纠正”第 1 条。

### Finance 统计

- **High 6 / Medium 14（含共享 SH-1、SH-2、SH-3）/ Low 5（含共享 SH-4），共 25 项**（页面自身 High 6、Medium 11、Low 4）。

---

## 三、Calendar

### 差距

| ID | 位置 | 原站是什么 | 我们是什么 | 严重程度 | 需 live 核验 |
|---|---|---|---|---|---|
| C-H1 | 月份切换器中心按钮点开的选择器（`calendar/page.tsx:270-310`：`pickerOpen` 时展开 12 个月缩写网格 + 上一年/下一年切换 + 当前月高亮 `bg-accent-500`） | 原站中心按钮是 `<button type="button" class="flex-1 cursor-default … sm:cursor-pointer">`（本次从原站 HTML 提取：无 `aria-expanded`、无 aria-label，移动端 `cursor-default`），内含 `<span class="sm:hidden">Aug</span><span class="hidden sm:inline">August 2026</span>`；点开什么 SSR 未渲染 | 整个月份/年份选择器为复刻自拟（12 月缩写 + 年份切换 + 高亮样式）；原站是否有点开选择器、长什么样，未知 | High | 是（只能 live 点原站中心按钮） |
| C-H2 | 事件详情弹窗（`calendar/page.tsx:400-430`：色点 + 标题 + 日期 + 开始时间/"All day" + Delete event / Done 按钮；Delete 会真删事件） | 原站 23 个事件 chip 均为 `<button>`（入口可证实）；点开后出现什么（详情弹窗/抽屉、字段、操作按钮），SSR 未渲染（role=dialog 出现 0 次） | 详情弹窗的字段、按钮、删事件行为全部为复刻自拟 | High | 是 |
| C-H3 | New event 新建表单（`calendar/page.tsx:440-510`：Title 输入框（占位 "Event title"，Enter 提交）/ Date 日期框 / Time 时间框 / All day checkbox / Colour 5 色圆点；默认值日期 2026-08-02、时间 10:00、颜色 blue；Add event 保存后自动打开新建事件的详情） | 原站只有页头 "New event" 主按钮；新建界面字段与布局 SSR 未渲染 | 表单字段、默认值、Enter 提交、保存后跳详情，全部为复刻自拟 | High | 是 |
| C-H4 | Inbox 弹窗（`calendar/page.tsx:210-250`："Inbox / Upcoming events from August 2026"，取当月起 5 条事件，点击某条打开详情并选中其日期；无事件时 "No upcoming events."） | 原站页头有 `aria-label="Inbox"` 的图标按钮（无角标）；点开后的收件箱内容与条数 SSR 未渲染 | 弹窗标题、副标题、取 5 条的规则、空态文案全部为复刻自拟 | High | 是 |
| C-M1 | 事件 chip 的元素类型（`calendar/page.tsx:365-395`：`<span role="button" tabIndex={0} onClick={...} onKeyDown={Enter/Space}>`） | 原站 chip 是原生 `<button type="button">`（本次提取：chip class 为 `flex min-w-0 cursor-pointer … bg-calendar-event-lime-background`，外层是 button 元素；Enter/Space 天然可用） | 复刻用 span + role="button" 模拟；键盘 Enter/Space 能打开，但 Space 的 keydown 处理未 `preventDefault`，按空格可能同时滚动页面；元素语义与原站不同 | Medium | 否（SSR 可证实元素类型不同；Space 滚动需 live 点检） |
| C-L1 | 月份切换器中心按钮属性（`calendar/page.tsx:273-280`：`aria-expanded={pickerOpen}` + 全断点 `cursor-pointer`） | 原站该按钮无 `aria-expanded`；移动端 `cursor-default`、sm 及以上才 `cursor-pointer`（本次从原站 HTML 提取的 class 原文） | 复刻多加 aria-expanded，且移动端也是 cursor-pointer | Low | 否 |
| C-L2 | 详情弹窗与 Inbox 里的色点用了原生 palette class（`calendar/page.tsx:67-73` `TONE_DOT`：`bg-lime-500` / `bg-pink-500` / `bg-purple-500` / `bg-blue-500` / `bg-emerald-500`；用于 `:235` Inbox 行与 `:406` 详情弹窗） | 原站 chip 颜色走 `bg-calendar-event-<tone>-background` 等语义 token；弹窗里的色点样式 SSR 里没有（弹窗本身不在 SSR 里） | 复刻在弹窗/Inbox 里用 Tailwind 原生 palette，违反 BoardUI“语义 token only”规则（`AGENTS.md`）；与原站是否一致未知 | Low | 是（色点真实颜色只能 live 看原站弹窗） |
| C-L3 | 新建事件默认日期来自内部选中态（`calendar/page.tsx:113` `selectedKey` 初值 "2026-08-02"；`:185` 新建保存后 `setSelectedKey(formDate)`；Inbox 点某条也会改它） | 原站无“选中日期”概念（日期格不可点，SSR 可证实）；新建表单默认填哪天未知 | `selectedKey` 作为内部默认值残留，不驱动任何可见选中态，但新建表单的默认日期由此决定（用户不可见的默认值，未经证实） | Low | 是 |

### 已核实无差距（calendar，本次实测）

- 23 个事件 chip 的标题/时间/颜色与原站逐项一致：Coffee 09:30（Jul 28）、Payday（Jul 30，全天）、Brunch 11:00（Aug 1）、Stand-up 11:30 + 1:1 sync 16:30（Aug 2）、Gym 07:00（Aug 5）、Game night 19:00（Aug 8）、Holidays（Aug 11，全天）+ Birthday night at Bacalar’s 20:30（Aug 11）、Retro 15:00（Aug 14）、Planning 10:00 + Haircut 16:00（Aug 17）、Stand-up 11:30 / Team lunch 13:00 / Portfolio review 14:30 / 1:1 sync 16:30（Aug 20）、Dinner with friends 19:15（Aug 24）、Yoga 07:30（Aug 27）、Brunch 11:00（Aug 29）、Payday（Aug 31，全天）、Kickoff 09:00（Sep 1）、Standup 09:00（Sep 2）、Dentist 10:30（Sep 4）。
- 月历网格一致：2026 年 8 月 1 日为周六，42 格为 7 月 26 日–9 月 5 日；星期头 Sun–Sat；月份切换器 "Aug / August 2026"；页标题 "August 2026"（原站 `<h1>August 2026</h1>`）。
- 8 月 20 日显示全部 4 个 chip，上方 "+2 more" 为纯文本 `<span>`（原站该处为 `<span class="text-[10px] leading-3 font-medium text-text-secondary sm:text-body-2-medium">+2 more</span>`，复刻 class 一致；全页仅此一处 "+N more"，复刻 `extra = dayEvents.length - 2` 规则与之一致）。
- 日期格背景色与原站逐字一致（见“前人纠正”第 9 条）；格子最小高度 72 / 94 / 105 / 128 / 164px 五档与原站一致；chip 样式 class 与原站一致（含 `hover:brightness-95` 与 `bg-calendar-event-<tone>-background`）。
- 月份前后 chevron（Previous month / Next month）与复刻一致；New event 按钮文案与图标一致；Inbox 按钮入口一致（`aria-label="Inbox"`，无角标）。

### Calendar 统计

- **High 4 / Medium 4（含共享 SH-1、SH-2、SH-3）/ Low 4（含共享 SH-4），共 12 项**（页面自身 High 4、Medium 1、Low 3）。

---

## 总计

| 模板 | High | Medium | Low | 合计 |
|---|---|---|---|---|
| Dashboard | 6 | 8 | 5 | 19 |
| Finance | 6 | 14 | 5 | 25 |
| Calendar | 4 | 4 | 4 | 12 |
| **三模板合计** | **16** | **26** | **14** | **56** |

注：共享外壳 4 项（SH-1 ~ SH-4）在每个模板的统计里各计 1 次（三个页面都受影响）；去重后独立差距项为 56 - 8 = 48 项（共享 4 项被重复计了 2 次）。

## 最严重的 3 项差距（各一句话）

1. **Finance Sankey 节点拆分全系编造**：Salary / Freelance / Investments 在原站 HTML 全文出现 0 次，整张现金流图的收入与支出拆分无任何原站来源，需 live 看原站 Sankey 才能定真值。
2. **Dashboard 图表 Monthly / Yearly 数据全系编造**：月合计 $29,220、年合计约 $361,000（Earnings）等数字只在复刻代码里存在，原站 SSR 对月/年周期无任何数值，切换周期即向用户显示未经证实的数据。
3. **Calendar 四处弹窗内容全系编造**：月份选择器、事件详情、新建表单、Inbox 列表在原站 SSR 里一个都不存在（role=dialog/menu/listbox 出现 0 次），四套界面都是复刻自拟，需 live 逐个核对原站真实形态。

## 需 live 核验的项汇总（按模板）

- **Dashboard（10 项）**：D-H1 月/年图表值、D-H2 图表 hover/tooltip、D-H3 Activity 切换是否重算网格、D-H4 Filters 点后行为、D-H5 Create ticket 弹窗字段与流程、D-H6 More actions 菜单内容、D-M2 空态文案、D-M3 有无 toast、D-M4 “Board team”下拉菜单项、D-M5 Delete 是否确认；另有 SH-2 通知条目内容、SH-3 用户/团队菜单内容、hover 变色逐项点检（Low 待核）。
- **Finance（13 项）**：F-H1 四处周期菜单选项、F-H2 Sankey 真实拆分、F-H3 Donut 各分类真值、F-H4 Filters 点后行为、F-H5 Add/Edit 弹窗真实字段、F-H6 More 菜单真实内容、F-M1 周期触发器点开形态（菜单 vs 列表）、F-M2 Donut 有无图例行、F-M3 气泡真实位置与 risk 值、F-M4 Portfolio 切换后数值是否变化、F-M9 Sankey 与 Donut 孰真、F-M10 空态、F-M11 有无 toast、F-L4 金额桶语义；另有 SH-2、SH-3。
- **Calendar（8 项）**：C-H1 中心按钮点开什么、C-H2 chip 点开的详情内容与操作、C-H3 New event 新建表单字段与布局、C-H4 Inbox 内容与条数、C-M1 chip 按空格是否滚动页面、C-L2 弹窗色点真实颜色、C-L3 新建默认日期；另有 SH-2、SH-3。

## 附：本次实际读到的数字来源（防编造备查）

- Dashboard 热力图：原站 259 个 aria-label 提取 → 与复刻 259 条逐项比对，0 处不符，合计 1,721。
- Finance 热力图：原站 84 格 aria-label + style 百分比提取 → 数值 0 处不符（合计 4,390）；百分比 24 格差 1pp（清单见 F-M7）。
- Finance Sankey/Donut/气泡：原站 SSR 无 SVG；"Salary"/"Freelance"/"Investments" 全文 0 次；"Savings" 27 次均为表格 Account 下拉选项（Checking/Savings/Credit card）与分类词，非 Sankey 标签。
- 原站三页角标均为 5；原站三页侧栏导航均为 9 项（Home 152、Project board、Marketing、Calendar、Finance、Medical Report、AI Chat、AI Image Generation、Profile）。
- 原站三页 `role="dialog"` / `role="menu"` / `role="listbox"` 均为 0 次；原站 `<select>` 均为 react-aria 隐藏 select（`<select tabindex="-1">`），dashboard 15 个、finance 13 个、calendar 0 个。

## ai-chat / multi-agent-chat / chat-starter（分组审计 B，详见 boardui-audit/gaps-ai-chat-mac-chatstarter.md）

ai-chat 22 项（5 High / 13 Medium / 4 Low）、multi-agent-chat 19 项（3 / 13 / 3，High 已按编排者纠正第 1 条由 1 项修正为 3 项）、chat-starter 13 项（3 / 7 / 3），合计 54 项。注意：以下分组报告原文中的 MAC-00（“原生 select 不是差距”）已被编排者推翻，见文件顶部“编排者纠正”第 1 条；multi-agent-chat 的两个可见原生 select 应计为 High 差距（语言、语音各一处，语音另含多出的 Mika 选项）。以下为分组报告全文（MAC-00 段落保留原文以备查，以纠正为准）：


- 审计日期：2026-11-08（本轮为分组复核审计）
- 方法：原站 SSR HTML（`~/workspace/boardui-audit/orig/`）逐项比对复刻代码，不做 live browser 核查，不改代码、不 push、不 build。
- 原站材料：`ai-chat.html`（227,951 字节）、`multi-agent-chat.html`（178,043 字节）、`chat-starter.html`（124,615 字节）。三份均含 `BAILOUT_TO_CLIENT_SIDE_RENDERING`，即菜单、弹窗、tooltip 等客户端渲染内容不在 SSR 里；凡 SSR 里没有的原站行为，本报告一律不编造，标注"需 live 核验"。
- 复刻材料：`app/templates/ai-chat/page.tsx`（1,132 行）、`app/templates/multi-agent-chat/page.tsx`（3,037 行）、`app/templates/chat-starter/page.tsx`（20 行，实际实现在共享组件 `components/application/agent-chat/`：`agent-chat.tsx` 687 行、`agent-chat-history.tsx` 543 行、`agent-chat-message.tsx` 221 行、`agent-composer.tsx` 192 行、`agent-chat-actions.tsx` 138 行、`demo-answers.ts`）。
- 前人笔记复核结论：ai-chat 与 multi-agent-chat 的前人差距笔记（2026-11-07，含当轮修复结论）本轮逐条重核——大部分声称已修的项确已落地（见各节"已确认修复"），但有 3 处与修复结论不符（ai-chat 代码视图仍非 44 行；MAC 的 Preview voice 并非禁用态、语音 select 反而多了 "Mika"；MAC 的 Save 按钮已删，比前人笔记"保留"更新）；chat-starter 无前人笔记，本轮从零审。
- 严重程度：High = 一眼可见或功能缺失；Medium = 细节差异或未经证实的自造内容；Low = 像素级或低频路径。
- 差距总数：ai-chat 5 High / 13 Medium / 4 Low（22 项）；multi-agent-chat 1 High / 13 Medium / 3 Low（17 项）；chat-starter 3 High / 7 Medium / 3 Low（13 项）。合计 52 项。
- 关于任务简报里"原生 select 每处都是 High"的前提：经核查不成立——原站 multi-agent-chat 的 SSR 里本身就是两个原生 `<select>`（语言、语音），复刻照抄原生 select 是对的（见 MAC-00）。本报告只把其中与原站选项逐字不符的 "Mika" 计为差距。

---

## 1. ai-chat（Pro 模板）

### 1.0 本轮已确认修复（前人笔记声称已修，本轮重核属实，不计入差距）

- 侧栏换回原版 agent 侧栏：头像 "Mertcan Esmergul"、New agent / Automations / Customize、Repositories 4 组折叠（boardui 收起、vibl 展开、strider/pirate 收起）、11 条线程及时间徽标（2h、1d、34m、now、now、5h、18h、3d、4d、1w、2w）逐字一致；线程回到侧栏内，2xl rail 已删；hover "More actions"、"New chat" 已删。
- 模型选择器回到输入框 pill 内、可点；Effort Low/Medium/High 已删；状态行 Main / project-sea / Agent 回到输入框下方 `h-[26px]`；进度改回 16px 圆环 + "57%" 胶囊（dash 换算值 21.488 与原站 `stroke-dasharray="21.488493750554184 37.69911184307752"` 一致）。
- 代码面板恢复 Changes / Browser 双 pill；文件列表只剩 `boardui/app/components/button.tsx` +74 + "New"，行不可点，React 原子 logo（#149ECA）；汇总 "12 Uncomitted changes"（含原站少一个 t 的拼写）、+156（翠绿）、-23（正红）一致；面板默认宽 410px；拖拽条改回 `role="separator"` + hover 才出现的三竖线抓手；移动抽屉 `w-[min(410px,calc(100%_-_12px))]` + 300ms 滑入。
- 顶栏改回两段式（移动顶栏 + 桌面无边框面包屑头 `nav aria-label="Chat location"`）；Settings 改回纯链接；Board team 改回字母 B 头像 + Upgrade 按钮；语音按钮已补；Send 空输入不再 disabled；用户消息逐字一致；输入框淡出 mask 已补；输入框移出 `<form>`；字体已改成本地打包的 Inter（`app/layout.tsx` 载入 `app/fonts/inter/` 全套 OTF，原先"系统字体栈替代 Inter"的缺口已修；mono 仍为系统栈，见 AC-L2）。
- 其他线程点击后消息区为空、不编造助手回复（原站快照只给当前线程 1 条用户消息），诚实做法，属优点。

### 1.1 High

#### AC-H1 头像菜单是死按钮
- 位置：`app/templates/ai-chat/page.tsx:518`，侧栏顶部 "Mertcan Esmergul" 按钮。
- 原站：同一位置按钮，`aria-label="Mertcan Esmergul"`，`aria-expanded="false"`，可展开账号菜单（菜单项不在 SSR 里，内容需 live 核验）。
- 我们：按钮无任何 `onClick`，`aria-expanded="false"` 写死，点击毫无反应；折叠态侧栏（`:505` 附近）与移动抽屉里的同一按钮同样无 handler。
- 严重程度：High。是否需 live 核验：是（菜单的真实项目）。

#### AC-H2 模型下拉里的中文占位行"更多模型待实测确认"
- 位置：`app/templates/ai-chat/page.tsx:796`，模型菜单内。
- 原站：模型下拉选项不在 SSR 里；SSR 只证实当前值 "Fable 5"。
- 我们：菜单只有 "Fable 5（Active）" + 一行中文 "更多模型待实测确认"。中文占位文案直接出现在英文界面里。
- 严重程度：High（用户可见的占位文案）。是否需 live 核验：是（原站真实选项只能 live 确认；修法是补实测选项，不是编造）。

#### AC-H3 project-sea 下拉里的中文占位行"更多项目待实测确认"
- 位置：`app/templates/ai-chat/page.tsx:863`，状态行 project-sea 菜单内。
- 原站：project-sea 下拉内容不在 SSR 里；SSR 只证实当前值 "project-sea"。
- 我们：菜单只有 "project-sea（Active）" + 一行中文 "更多项目待实测确认"。
- 严重程度：High。是否需 live 核验：是。

#### AC-H4 Agent 下拉里的中文占位行"更多选项待实测确认"
- 位置：`app/templates/ai-chat/page.tsx:891`，状态行 Agent 菜单内。
- 原站：Agent 下拉内容不在 SSR 里；SSR 只证实当前值 "Agent"。
- 我们：菜单只有 "Agent（Active）" + 一行中文 "更多选项待实测确认"。
- 严重程度：High。是否需 live 核验：是。

#### AC-H5 More options 菜单里的中文占位行"更多选项待实测确认"
- 位置：`app/templates/ai-chat/page.tsx:387`，面包屑头右侧 More 菜单内。
- 原站：More 菜单项不在 SSR 里。
- 我们：菜单只有 "Copy chat transcript" + 一行中文 "更多选项待实测确认"。
- 严重程度：High。是否需 live 核验：是。

### 1.2 Medium

#### AC-M1 状态行 Main 按钮是死按钮
- 位置：`app/templates/ai-chat/page.tsx:838-842`，状态行左端分支图标 + "Main" 按钮。
- 原站：同一位置是按钮（分支图标，无 chevron；点后行为不在 SSR 里）。
- 我们：`<button>` 无 `onClick`，点击无反应。
- 严重程度：Medium。是否需 live 核验：是（Main 点后行为）。

#### AC-M2 面包屑 "vibl coding project" 按钮是死按钮
- 位置：`app/templates/ai-chat/page.tsx:370`，桌面面包屑头内。
- 原站：面包屑第一段是可点按钮（文件夹图标 + 文字），后跟 chevron 与 `aria-current="page"` 的 "coding scenario"。
- 我们：按钮无 `onClick`，点击无反应；`aria-current="page"` 的当前线程为静态 span（与原站一致，原站当前段也是静态文本）。
- 严重程度：Medium。是否需 live 核验：是（面包屑按钮去向）。

#### AC-M3 Undo 后自造文案与恢复流程
- 位置：`app/templates/ai-chat/page.tsx:1105` 附近，Changes 面板内（`undone` 态）。
- 原站：SSR 只有 "Undo changes" 图标按钮；点后界面变成什么样不在 SSR 里。汇总行点 Undo 后原站是否变 "0 Uncomitted changes" 未知。
- 我们：点 Undo 后汇总变 "0 Uncomitted changes"，文件行消失，显示自造英文 "All changes undone. Nothing to commit." + "Restore changes" 按钮。
- 严重程度：Medium。是否需 live 核验：是。

#### AC-M4 代码视图只有 42 行，不是原站的 44 行（前人笔记"44 行逐字"不成立）
- 位置：`app/templates/ai-chat/page.tsx:122-165` 的 `CODE_LINES` 数组（实测 42 条，用 python 计数，非 44 条）。
- 原站：token 行 1–44。逐行对照缺失/合并三处：(a) 原站第 12 行 `const PREVIEW_CODE = \`` 与第 13 行 `import { DashboardShell } ...` 在复刻里合并成一行（第 12 条），第 13 条为空行；(b) 原站第 24 行 `breadcrumb={` 整行缺失，复刻第 24 条直接是 `{ label: "Board UI", href: "/" },`；(c) 原站第 39 行 `sections={` 整行缺失，复刻第 39 条直接是 `{`。渲染出的行号因此在 13、24、39–40 处与原站错位，末行只到 42 行 "body: ("。
- 我们：42 行。
- 严重程度：Medium（代码面板内一眼可数的行数差）。是否需 live 核验：否（SSR 证据充分）。

#### AC-M5 语音开关只有视觉态，无录音/转写
- 位置：`app/templates/ai-chat/page.tsx:805` 附近，Voice input 按钮（`aria-pressed` 切换 + 强调色）。
- 原站：语音按钮 `aria-pressed="false"` 的 toggle；按下后发生什么不在 SSR 里。
- 我们：按下只切换 `voiceOn` 状态与按钮样式，不接任何录音或语音转写。
- 严重程度：Medium。是否需 live 核验：是（原站语音行为）。

#### AC-M6 附件：文件选择器替代原站菜单
- 位置：`app/templates/ai-chat/page.tsx:756` 附近，Add attachment 按钮直通 hidden `<input type="file" multiple>`，选中文件以 chip 显示在输入框上方。
- 原站：附件按钮 `aria-expanded="false"`，点开的是菜单（菜单项不在 SSR 里）。
- 我们：无菜单，直接开系统文件选择框；chip 展示为复刻自定形态。
- 严重程度：Medium。是否需 live 核验：是（原站附件菜单项）。

#### AC-M7 Share 行为是复刻猜测
- 位置：`app/templates/ai-chat/page.tsx:317` 附近，`shareChat` 把全部消息拼成 transcript 写剪贴板，显示 "Chat copied to clipboard."（2 秒消失）。
- 原站：Share chat 按钮存在；点后发生什么（复制链接？开弹窗？）不在 SSR 里。
- 我们：行为为复刻编造。
- 严重程度：Medium。是否需 live 核验：是。

#### AC-M8 提交后 1400ms 定时模拟 + 圆环恒定 57%
- 位置：`app/templates/ai-chat/page.tsx:303`，`busyTimer` 的 `setTimeout(() => setBusy(false), 1400)`；`ProgressRing progress={57}`（`:896`）。
- 原站：快照定格在生成中 57%，无助手回复；进度是否走动、走完显示什么，SSR 无从得知。
- 我们：提交只追加用户气泡，ComposerLoader 转 1400ms 后停，圆环永远 57%，无助手回复（不编造回复是对的，但 1400ms 这个时长是自定常数）。
- 严重程度：Medium。是否需 live 核验：是（57% 之后原站的真实行为）。

#### AC-M9 折叠后侧栏形态是自造的 w-16 图标栏
- 位置：`app/templates/ai-chat/page.tsx:505` 附近，`collapsed && !mobile` 时渲染 `w-16` 图标栏（M 头像 + Expand + Search + New agent / Automations / Customize 图标 + B 头像）。
- 原站：Collapse sidebar 按钮存在；折叠后侧栏长什么样不在 SSR 里。
- 我们：折叠形态为复刻自定，未经核对。
- 严重程度：Medium。是否需 live 核验：是。

#### AC-M10 ⌘L 快捷键缺失
- 位置：全文件 grep `metaKey|ctrlKey|KeyL` 为 0 处；Quick Search pill 上仍显示 ⌘L 键位提示。
- 原站：桌面端 Quick Search pill 标 ⌘L。
- 我们：Quick Search 只能点按打开，无全局 ⌘L 监听；面板内只有 Esc 关闭。
- 严重程度：Medium。是否需 live 核验：否（SSR 键位提示即证据；原站 ⌘L 是否真触发面板仍需 live 确认面板内容本身）。

#### AC-M11 "全部模板"入口是原站没有的东西
- 位置：`app/templates/ai-chat/page.tsx:360,376`（移动顶栏与桌面面包屑头的 `AllTemplatesButton`）与 `:551`（侧栏首行 "全部模板" 链接）。
- 原站：全文检索 "All templates" / "全部模板" 均为 0 次；侧栏首行是头像菜单。
- 我们：三处模板切换入口为复刻自加（按任务要求保留的跨模板导航，仍属与原站的差异）。
- 严重程度：Medium。是否需 live 核验：否。

#### AC-M12 Browser tab 占位文案
- 位置：`app/templates/ai-chat/page.tsx:1127`，Browser tab 内容区："Browser 视图内容待实测确认"。
- 原站：Browser tab 内容不在 SSR 里。
- 我们：点开 Browser 只显示中文占位句（诚实但可见）。
- 严重程度：Medium（仅点击 Browser 后可见，故低于下拉菜单里的同类占位行）。是否需 live 核验：是。

#### AC-M13 终端条占位文案
- 位置：`app/templates/ai-chat/page.tsx:418`，终端条内容区："终端内容待实测确认"。
- 原站：终端条内容不在 SSR 里（终端只在点 "Open terminal" 后出现）。
- 我们：点开终端只显示中文占位句；原先自造的 lint/build 日志已删。
- 严重程度：Medium（仅点开终端后可见）。是否需 live 核验：是。

### 1.3 Low

#### AC-L1 菜单无 Esc 关闭
- 位置：模型 / project-sea / Agent / More 四个菜单只用全屏透明 backdrop 按钮关闭，无 Esc 处理（Quick Search 面板有 Esc）。
- 原站：用 React Aria 菜单，Esc 通常可关，未经实测不得断言。
- 严重程度：Low。是否需 live 核验：是。

#### AC-L2 代码字体仍为系统栈
- 位置：`app/layout.tsx` 注释自认 mono 字体 `--font-mono-source` 仍为系统栈。
- 原站：加载 Inter + JetBrains Mono。
- 我们：正文 Inter 已修，代码区字体仍非 JetBrains Mono。
- 严重程度：Low。是否需 live 核验：否。

#### AC-L3 拖拽范围与 Expand 宽度未经核对
- 位置：`app/templates/ai-chat/page.tsx` 的 `onResize` 夹取 320–640px，Expand 在 410/640 间切换。
- 原站：面板默认 410px；可拖范围与 Expand 后宽度不在 SSR 里。
- 我们：320–640 为复刻自定。
- 严重程度：Low。是否需 live 核验：是。

#### AC-L4 Enter 发送未经核对
- 位置：输入框 `onKeyDown` 里 Enter（不带 Shift）提交；输入框不在 `<form>` 里（与原站全页 0 个 form 一致）。
- 原站：Enter 是否发送、Shift+Enter 是否换行不在 SSR 里。
- 我们：Enter 提交为复刻实现。
- 严重程度：Low。是否需 live 核验：是。

---

## 2. multi-agent-chat（Pro 模板）

### 2.0 方法说明与前提纠正

- **MAC-00 原生 `<select>` 不是差距**：复刻里两处原生 `<select>`（语言，`page.tsx:2224`；语音，`page.tsx:2282`）与原站 SSR 完全一致——原站 SSR 里就是两个原生 `<select>`（语言：空项 + Auto-detect、English、Turkish、Spanish、French、German、Japanese、Portuguese；语音：空项 + Off、System voice，带 `disabled`）。任务简报"原站一律用 BoardUI react-aria Select"的前提在本模板不成立。两处 select 本身不计差距；语音 select 里多出的 "Mika" 选项另计（MAC-H1）。

### 2.1 本轮已确认修复（前人笔记声称已修，本轮重核属实，不计入差距）

- 侧栏简介 7/7 与原站逐字一致（本轮用程序比对原站 7 条 desc 全文与复刻 `intro` 字段，全部 MATCH；前人 C1 的 5 处差异已修）。
- 搜索框接上过滤 + placeholder "Search conversations…"（含省略号）；移动端 "Open conversations" 按钮已补；Support / Settings / Board team 已接菜单或弹窗（Support 菜单见 MAC-M2 的重复项 bug）。
- 回复区 agent 名按钮可点开编辑器 + Thinking… 交叉淡入层已补；Helpful / Unhelpful 可切换 `aria-pressed`；Copy response 可用；提交后 700ms 等待期内显示 Thinking…；消息列表接上 `onScroll`，顶部三层渐隐遮罩按滚动 ramp（前人 B6 的写死 opacity:0 已修）。
- 语言改回原生 select，9 个选项与原站完全一致；倍速改为 4 个 `role="radio"`（0.75×/1×/1.25×/1.5×）；自定义颜色改为可点按钮 + 原生颜色选择器；形状按钮改回 56px（`size-14`）+ `cursor-grab` + 拖拽到中央头像应用；颜色 `aria-label` 为 "Blue avatar" 式 + `title` 小写颜色名；Name/Label/Description placeholder 与 maxLength/rows 已补（"Michael Scott"、"Manager, marketing, painter"、"Details for the agent"，Description rows=2、maxLength=500）。
- 表情环改回 268px 圆环 + 22.5° 间隔排布（`rotate(Ndeg) translateY(-116px)`）；16 头像变体环与点击翻面已删（全文件 grep `rotateY` 仅剩注释提及，无实现）；编辑器无 Save 按钮（全文件 grep `>Save<` 为 0 处），改为即时保存回写，与原站 SSR（全文 "Save" 0 次）一致；群聊默认不行首项，改为经 "…" 菜单建群，群聊内发送已修好。
- Security agent 颜色为青色系（`body: #B3E4E5`，与原站表情圆点 `hsl(181 49% 80%)` 同色系；精确 hex 无法从 SSR 核对，见 MAC-L1）。
- 模型下拉改为真下拉且只列 "Fable 5"；Permission 可见文字改回 "Bypass all"；"Today" 日期 pill、首轮 landing 对话逐字一致。

### 2.2 High

#### MAC-H1 语音 select 多出原站没有的 "Mika" 选项
- 位置：`app/templates/multi-agent-chat/page.tsx:2291`，`<option value="mika">Mika</option>`。
- 原站：语音 select 选项只有空项 / Off / System voice（当前选中 System voice），且整个 select 带 `disabled`。
- 我们：选项为空项 / Off / System voice / **Mika**；代码注释（`:1954-1958`）自认 "Mika is not in the snapshot"。
- 严重程度：High（与原站逐字可比的选项差异，用户打开语音下拉即见）。是否需 live 核验：否（SSR 证据充分；若 live 证实原站确有 Mika，再恢复）。

### 2.3 Medium

#### MAC-M1 Preview voice 在原站禁用态下复刻可点并播放
- 位置：`app/templates/multi-agent-chat/page.tsx:2264-2267`，Preview voice 按钮 `onClick={previewVoice}`，无 `disabled`；`:1948-1991` 用 `window.speechSynthesis` 试听，可切换 Stop 态并弹 toast。
- 原站：Preview voice 按钮带 `disabled=""`，Agent voice 按钮与 select 同样禁用。
- 我们：按钮可用，点按真的发声（前人修复结论称"按原版为禁用态"补上按钮，与当前代码不符，属回归/改动）。
- 严重程度：Medium。是否需 live 核验：是（原站选定语音后按钮是否解除禁用）。

#### MAC-M2 Support 菜单 "Email support" 重复两项
- 位置：`app/templates/multi-agent-chat/page.tsx:919` 与 `:927`，两个完全相同的 DropdownItem（文字、行为均为 `mailto:hi@boardui.com`）。
- 原站：Support 菜单内容不在 SSR 里；但同一菜单出现两次相同项在任何实现里都是 bug。
- 我们：点开 Support 菜单可见两个 "Email support"。
- 严重程度：Medium。是否需 live 核验：否（重复本身即错；菜单真实项目仍需 live）。

#### MAC-M3 跟进回复全部自造 + 700ms 固定延迟
- 位置：`app/templates/multi-agent-chat/page.tsx:424` 的 `FOLLOW_UPS`（每 agent 两条轮换）与 `:2906,2924` 的 `setTimeout(..., 700)`（群聊 700ms 交错）。
- 原站：SSR 只渲染 landing agent 的首轮对话（用户 "How can we make the landing page feel clearer?" + 两段回复）；后续回复的文案与延迟均不在 SSR 里。
- 我们：第二轮起的全部回复为复刻自写，700ms 为自定常数。
- 严重程度：Medium。是否需 live 核验：是。

#### MAC-M4 其余 6 个 agent 的首轮对话未经证实
- 位置：`app/templates/multi-agent-chat/page.tsx` 的 `AGENTS` 数据（content reviewer、marketing bot、seo bot、research assistant、Security agent、Cloud engineer 的 `userMsg` / `replyP1` / `replyP2`）。
- 原站：SSR 只渲染 landing agent 的对话；其余 6 套对话文字不在 SSR 里（其中 `replyP1` 与各 agent 的 desc 原文逐字相同已证实，但作为"首轮回复第一段"是否就是原站行为未知；`replyP2` 为复刻自写）。
- 我们：6 套对话直接作为种子对话展示。
- 严重程度：Medium。是否需 live 核验：是。

#### MAC-M5 群聊空态文案引用文件不在仓内
- 位置：`app/templates/multi-agent-chat/page.tsx:1127`，"A few minds. One conversation."；`:407` 的 `GROUP_DESC = "Start a conversation"`；`:2863-2864` 注释称组名规则来自 `orig-group-start.json`。
- 原站：SSR 全文 "Product planner" 0 次、群聊相关内容 0 次；群聊入口与空态均不在 SSR 里。
- 我们：空态文案与组名规则的引证文件（`orig-group-start.json` 等）在仓库内找不到（`find` 无结果），本次审计无法核实。
- 严重程度：Medium。是否需 live 核验：是（须 live 重核群聊空态与组名规则）。

#### MAC-M6 Marketplace 名单与工具引用文件不在仓内
- 位置：`app/templates/multi-agent-chat/page.tsx:2337-2370` 附近，`MARKETPLACE_BOTS` / `MARKETPLACE_TOOLS` / `MARKETPLACE_ESSENTIALS`，注释称"measured live (orig-marketplace-full.json + orig-probe2.json)"、工具图标称 "verbatim from the original's rendered Marketplace (orig-tool-svgs-full.json)"。
- 原站：Marketplace 面板内容不在 SSR 里。
- 我们：面板内容完整，但全部引证 JSON 文件在仓库内找不到，本次审计无法核实名单、分类与图标是否与原站一致。
- 严重程度：Medium。是否需 live 核验：是。

#### MAC-M7 Create 菜单三项原文未经核实
- 位置：`app/templates/multi-agent-chat/page.tsx:761-779`，New agent / New chat / New group。
- 原站：Create 按钮 `aria-expanded="false"`，菜单项不在 SSR 里；代码注释自认三项是"expected … set, pending live verification"。
- 我们：三项均有真实 handler（新建 agent 并开编辑器 / 清空对话 / 开建群 picker）。
- 严重程度：Medium。是否需 live 核验：是。

#### MAC-M8 Conversation options 菜单两项引用文件不在仓内
- 位置：`app/templates/multi-agent-chat/page.tsx:1318-1343`，分组标题 "In this conversation" 下的 "Edit \<agent\>" 与 "Start a group chat"；注释称 "Measured live (l2p-orig-menurect.json): a 266×108 dialog"。
- 原站：Conversation options 菜单项不在 SSR 里；前人笔记的三项 Rename / Clear / Delete 已删（全文件 grep "Rename conversation" 0 次）。
- 我们：当前两项的引证文件在仓库内找不到，本次审计无法核实。
- 严重程度：Medium。是否需 live 核验：是。

#### MAC-M9 Add 菜单 Goal / Plan mode / Plugins 引用文件不在仓内
- 位置：`app/templates/multi-agent-chat/page.tsx:1461-1484` 的 `ADD_MENU_GROUPS`（Add 组：Files and folders、Goal、Plan mode；Plugins 组：Documents、Spreadsheets、Presentations、Code blocks）与 `:1485` 的 `PLUGIN_ACTIONS`（点插件往输入框预填 "Create a document about " 等提示词）；`:1727` 附近注释称 Add 对话框 "measured from the live original … (l2-orig-plus.json)"，361×346。
- 原站：Add attachment 菜单项不在 SSR 里（只有 `aria-expanded="false"` 的 + 号按钮）。
- 我们：菜单完整且每项都有真实反应（Goal 输入行、Plan mode 横条、插件预填），但引证文件在仓库内找不到，本次审计无法核实菜单结构与文案。
- 严重程度：Medium。是否需 live 核验：是。

#### MAC-M10 Permission 菜单 "Ask every time / Deny all" 未经核实
- 位置：`app/templates/multi-agent-chat/page.tsx:1811`，`["Bypass all", "Ask every time", "Deny all"]`。
- 原站：Permission 菜单项不在 SSR 里；SSR 只证实可见文字 "Bypass all" 与 aria-label "Permission: Bypass all"。
- 我们："Ask every time / Deny all" 为通用权限模式推测，未经核对。
- 严重程度：Medium。是否需 live 核验：是。

#### MAC-M11 头像为 SVG 重绘，非原站 canvas 像素
- 位置：`app/templates/multi-agent-chat/page.tsx:467` 附近注释自认 "Behaviour-aligned, not pixel 1:1"；头像组件为 SVG/CSS 重绘（眨眼 4.4s/5.3s、游移 7s/8.5s、形状切换 0.32s 缩放淡入代替 morph）。
- 原站：头像是 canvas 绘制的纸片脸，眼睛独立眨动/游移，形状切换有 morph 变形；SSR 只有 78 处 canvas 元素，无像素/矢量数据可供还原。
- 我们：画法按名字想象，非原版像素；morph 被缩放淡入替代。
- 严重程度：Medium（已知无法从快照还原的部分，计 Medium 不计 High）。是否需 live 核验：是（须截图逐像素比对）。

#### MAC-M12 "全部模板"入口是原站没有的东西
- 位置：`app/templates/multi-agent-chat/page.tsx:1279`（对话头网格图标链接 `/templates`，`aria-label="全部模板"`）与 `:972`（Board team 菜单 "View templates" → `/templates`）。
- 原站：全文 "All templates" 0 次；对话头只有 agent pill、Copy、… 菜单。
- 我们：两处跨模板导航入口为复刻自加。
- 严重程度：Medium。是否需 live 核验：否。

#### MAC-M13 表情环旋转拖拽未实现
- 位置：表情环容器 `page.tsx:2072` 带 `touch-none`（与原站一致，暗示可指针拖动旋转圆环）。
- 原站：表情环容器 `touch-none`；拖了会怎样不在 SSR 里。
- 我们：形状拖拽已做（`draggable` + `onDragStart`，`:2048-2055`），表情环只有点击，无旋转拖拽。
- 严重程度：Medium。是否需 live 核验：是（原站圆环到底能不能拖、拖了发生什么）。

### 2.4 Low

#### MAC-L1 Security agent 颜色精确值无法核对
- 位置：`app/templates/multi-agent-chat/page.tsx` 的 security 项 `body: #B3E4E5`。
- 原站：编辑器快照只证实 Security agent 的颜色是 Teal（`aria-pressed="true"`）；Teal 在原站 canvas 里的精确色值不在 SSR 里。`#B3E4E5` 与原站表情圆点 `hsl(181 49% 80%)` 同色系，色系正确、数值待核。
- 严重程度：Low。是否需 live 核验：是（截图取色）。

#### MAC-L2 其余 6 个 agent 的颜色/形状/表情指派无快照对照
- 位置：`AGENTS` 数据里除 Security 外 6 个 agent 的 `body` / `shape` / `expression`。
- 原站：编辑器只为 Security agent 打开，其余 6 个的颜色/形状在 SSR 里无对照。
- 我们：6 个的指派为复刻自选。
- 严重程度：Low。是否需 live 核验：是。

#### MAC-L3 头像眨眼/游移周期为复刻设定值
- 位置：`app/templates/multi-agent-chat/page.tsx:2937` 内联 `<style>`，眨眼 4.4s/5.3s、游移 7s/8.5s。
- 原站：SSR 无动画时序数据。
- 我们：周期为复刻自定。
- 严重程度：Low。是否需 live 核验：是。

---

## 3. chat-starter（免费版块，非 Pro 模板）

### 3.0 定位判定

- 原站页面标题：`Chat Starter Template — Deploy a Working AI Chat in Two Minutes | BoardUI`（`orig/chat-starter.html` 的 `<title>`）。
- 复刻 `app/templates/chat-starter/page.tsx` 仅 20 行，注释自述："The starter itself is the free agent-chat block"；实现走共享免费组件 `AgentChat`（`showSetupWhenUnreachable`）。
- 结论：**chat-starter 是免费 starter 版块，不是 Pro 模板**。审计口径按免费版块计：与 ai-chat（Pro）的 composer / 侧栏 / 代码面板不作对等要求，只核对本页 SSR 可见内容。

### 3.1 本轮已确认一致（不计入差距）

- 空态逐字一致：标题 "What can I help with?"（原站 `<h2>`）、副文案 "This chat runs against your own API key. History stays in this browser."、3 个建议 pill（"Explain what this starter does" / "Write a product update in three sentences" / "Give me five names for a scheduling app"）。
- 侧栏导航逐字一致：Chat / Dashboard / Components and Blocks / Sign in / Sign up（复刻 `starterNav`，`app-shell.tsx:62-74`）+ Quick Search ⌘L + 主题分段器 + Support / Settings + Board team（logo 图 `/brand/boardui_logo_circle.webp`，与原站 `<img alt="Board team">` 一致）+ 头像 "Mertcan Esmergul"。
- 输入框区逐字一致：`<form class="flex h-[52px] ...">`、placeholder "Ask me anything"、Send 空输入时 `disabled`（原站 SSR 里 Send 按钮带 `disabled=""`，复刻 `disabled={value.trim().length === 0}` 一致）；状态行左 infinity 图标 + "Not configured"、右 sparkle 图标 + "New chat" 与原站一致（原站状态行右段确为 sparkle + "New chat"，经三处 "New chat" 出现位置逐一核对：头栏标题、状态行右段、history rail 按钮）。
- History rail 结构一致：顶部 "New chat" 按钮、"Recent"、空态 "Chats you start show up here."、底部账号菜单（`aria-label="Mertcan Esmergul account menu"`）与导出按钮（无对话时 `disabled` + `aria-label/title="No chats to export"`，与原站一致）。
- 头栏结构一致：absolute 覆盖式头栏（`border-b` + `border-transparent`，滚动后才 frost）、标题 "New chat"、右侧 Share chat（空态 `disabled`）与 "More actions for this chat" 按钮；原站无语音按钮，复刻 composer 同样无语音按钮（正确省略）。
- 布局参数：消息列 `max-w-3xl` 居中、`px-4 pt-[72px] pb-6` 与原站一致；history rail `hidden xl:flex`、宽 260px 与原站一致。

### 3.2 High

#### CS-H1 未配置时 SetupNotice 整卡替换了原站并存的空态与输入框
- 位置：`components/application/agent-chat/agent-chat.tsx:523-529` 附近条件渲染：`probe.status === "unconfigured" && messages.length === 0 && !demo` 时只渲染 `<SetupNotice>`，否则渲染空态 + 输入框。
- 原站：SSR 里空态（"What can I help with?" + 副文案 + 3 pill）与输入框（form + "Ask me anything" + 状态行 "Not configured"）同时存在；全文检索 "Add an API key" / "AI_API_KEY" / "Skip, show me" / "Demo mode" 均为 0 次。
- 我们：未配置时用户看不到空态与输入框，只看到 SetupNotice 卡片："Add an API key to start" + 三步 Vercel 指引（Settings → Environment Variables → 加 `AI_API_KEY` → Redeploy）+ `.env.local` 说明 + "Skip, show me the demo" 按钮（`agent-chat.tsx:602-619`）。卡片全部文案在原站 SSR 中零命中。
- 严重程度：High（首屏结构级差异：原站未配置态仍可看到空态与输入框，复刻则整块替换）。是否需 live 核验：是（本页含 `BAILOUT_TO_CLIENT_SIDE_RENDERING`，客户端水合后原站是否切出 setup 卡片，SSR 无法证伪；须 live 看未配置态的真实首屏）。

#### CS-H2 ProOfferCard 浮动售卖卡在原站 SSR 中零证据
- 位置：`components/application/agent-chat/agent-chat.tsx` 末尾 `{!contained && <ProOfferCard />}`；`components/application/app-shell/pro-offer-card.tsx:54`，标题 "Buy once. Build forever."，描述 "8 full-page templates and 23 Pro components, 17 of them chart cards. One payment. Keep the code forever, with Pro updates for one year or forever."；默认打开（除非 localStorage 里有 `boardui:pro-offer-dismissed`）。
- 原站：全文检索 "ProOffer" / "Pro Plan" / "Upgrade" / "Buy once" / "Upgrade to Max" 均为 0 次（"Pro" 的 16 次命中均为 JS chunk 名、JSON-LD 描述里的 "10 Pro templates" 等页面元数据，无售卖卡文案）。
- 我们：免费 starter 页首屏叠加一张 Pro 售卖浮层。
- 严重程度：High。是否需 live 核验：是（同上，须 live 确认原站免费页是否也弹此卡）。

#### CS-H3 Add attachment 是死按钮
- 位置：`components/application/agent-chat/agent-composer.tsx:100` 附近，Add attachment 按钮无任何 `onClick`（文件注释自认 "Attachment slot. Plain on purpose — the plugin panel behind this button in the Pro composer is part of what that component sells"）。
- 原站：同一位置按钮存在（`aria-label="Add attachment"`，+ 号图标）；点后行为不在 SSR 里。
- 我们：点击毫无反应。
- 严重程度：High。是否需 live 核验：是（原站免费版附件按钮点后行为）。

### 3.3 Medium

#### CS-M1 附件图标错：纸夹 vs 原站 "+"
- 位置：`components/application/agent-chat/agent-composer.tsx`，按钮用 `RiAttachment2`（纸夹）。
- 原站：附件按钮内的 SVG 路径以 `M14.8287 7.75737L9.1718 13.4142...` 开头，是 "+" 号图标（与 ai-chat 原站附件按钮同一图标）。
- 我们：纸夹图标，一眼可见的图标差异。
- 严重程度：Medium。是否需 live 核验：否。

#### CS-M2 Demo 模式与 5 条 canned 回答全系自造
- 位置：`components/application/agent-chat/demo-answers.ts`（5 条正则匹配回答 + FALLBACK，均含 "Demo mode: canned answer" 自白）与 `agent-chat.tsx:117,534,572`（`demoActive`、状态行 "Demo mode"、空态副文案 "Demo mode: the answers are scripted. Add AI_API_KEY for a real model."）。
- 原站：全文 "Demo mode" 0 次；demo 回答文案（如 "Five names for a scheduling app: Slotwise, Tidemark, Cadence, Dayline, and Meridian."）在 SSR 中零命中。
- 我们：点 "Skip, show me the demo" 后进入脚本化问答。
- 严重程度：Medium（仅走 demo 分支才可见；文案自带"这是 canned 回答"的自白，未冒充真模型）。是否需 live 核验：是（原站未配置态是否有 demo 入口）。

#### CS-M3 "More actions for this chat" 菜单三项自造
- 位置：`components/application/agent-chat/agent-chat-actions.tsx`，菜单三项 Export chats / Mark as unread / Delete chat。
- 原站：该按钮 `disabled=""`、`aria-expanded="false"`，菜单项不在 SSR 里。
- 我们：三项均有真实 handler（导出 JSON / 标未读 / 删对话）。
- 严重程度：Medium。是否需 live 核验：是。

#### CS-M4 Share 行为自造
- 位置：`components/application/agent-chat/agent-chat-actions.tsx` 的 `share()`：优先 `navigator.share`，否则写剪贴板，成功后 1600ms 内变对勾（`setTimeout(..., 1600)`）。
- 原站：Share chat 按钮 `disabled=""`（空态），点后行为不在 SSR 里。
- 我们：分享方式与成功反馈均为复刻自定。
- 严重程度：Medium。是否需 live 核验：是。

#### CS-M5 账号菜单内容自造
- 位置：`components/application/agent-chat/agent-chat-history.tsx` 的 `AccountMenu`：Usage left（Chats x/30、Storage 字节数、Upgrade to Max）、Invite a friend、Settings、Log out。
- 原站：账号菜单按钮 `aria-expanded="false"`，菜单项不在 SSR 里。
- 我们：菜单内容全部为复刻自定（Usage 数字用的是本地存储实测值，非编造百分比，但菜单结构本身未经核对）。
- 严重程度：Medium。是否需 live 核验：是。

#### CS-M6 线程行 hover 菜单自造
- 位置：`components/application/agent-chat/agent-chat-history.tsx` 的 `ThreadRow` / `RowMenu`：hover 出现 "More actions"（Rename / Mark as unread / Delete）+ 未读圆点 + 相对时间徽标（`relativeTime`，无"周"单位）。
- 原站：SSR 里零条线程行（空态只有 "Chats you start show up here."），线程行形态与操作均无证据。
- 我们：整套行交互为复刻自定。
- 严重程度：Medium。是否需 live 核验：是。

#### CS-M7 "全部模板"首行导航多余
- 位置：`components/application/app-shell/app-shell.tsx:67`，`starterNav` 首项 `{ key: "templates", label: "全部模板", href: "/templates" }`。
- 原站：侧栏导航只有 Chat / Dashboard / Components and Blocks / Sign in / Sign up，无模板切换行。
- 我们：首行多出 "全部模板"（与其他模板页的跨模板导航惯例一致，仍属与原站的差异）。
- 严重程度：Medium。是否需 live 核验：否。

### 3.4 Low

#### CS-L1 聊中头栏标题为推导值，原站未知
- 位置：`components/application/agent-chat/agent-chat.tsx` 的 `headerTitle()`：有消息时显示线程标题（首条用户消息前 48 字），否则 "New chat"。
- 原站：SSR 只有空态，头栏标题为 "New chat"；发消息后标题是否变线程名，SSR 无证据。
- 我们：标题随对话变化为复刻自定。
- 严重程度：Low。是否需 live 核验：是。

#### CS-L2 助手消息 hover 操作无 SSR 证据
- 位置：`components/application/agent-chat/agent-chat-message.tsx` 的 `MessageActions`：hover 出现 Copy message / Read aloud（`speechSynthesis`）+ 相对时间戳；段落 blur-in 动画（0.42s）。
- 原站：SSR 里零条助手消息；全文 "copy" / "Read aloud" 0 次。
- 我们：整套消息操作与动画无原站对照。
- 严重程度：Low。是否需 live 核验：是。

#### CS-L3 Thinking 指示器无 SSR 证据
- 位置：`components/application/agent-chat/agent-chat.tsx` 的 `showThinking` 与 `<AgentThinking variant="wave" label="Thinking">`。
- 原站：全文 "Thinking" 仅 1 次，且出现在 RSC payload 的组件导航列表项 "Agent Thinking"（`/components/agent-thinking` 链接），不是聊天区的思考指示器。
- 我们：提交后无文字时显示 Thinking 波形指示器。
- 严重程度：Low。是否需 live 核验：是。

---

## 4. 需 live 核验的项（汇总）

共 44 项。凡标注"需 live 核验"的项，均因原站行为不在 SSR 里（菜单关闭态不渲染 / BAILOUT 客户端渲染），不得凭记忆或推测下结论。

### ai-chat（19 项）
AC-H1 头像菜单项目；AC-H2/H3/H4/H5 四个下拉与 More 菜单的真实项目；AC-M1 Main 点后行为；AC-M2 面包屑按钮去向；AC-M3 Undo 后界面；AC-M5 语音行为；AC-M6 附件菜单项；AC-M7 Share 行为；AC-M8 57% 走完后的行为；AC-M9 折叠后侧栏形态；AC-M10 ⌘L 面板内容（快捷键本身已确认缺失）；AC-M12 Browser tab 真实内容；AC-M13 终端真实内容；AC-L1 菜单 Esc 行为；AC-L3 拖拽范围与 Expand 宽度；AC-L4 Enter/Shift+Enter 行为。

### multi-agent-chat（14 项）
MAC-M1 Preview voice 解除禁用的条件；MAC-M3 跟进回复的真实文案与延迟；MAC-M4 其余 6 个 agent 的首轮对话；MAC-M5 群聊空态与组名规则；MAC-M6 Marketplace 真实名单与工具；MAC-M7 Create 菜单原文；MAC-M8 Conversation options 菜单原文；MAC-M9 Add 菜单原文；MAC-M10 Permission 菜单原文；MAC-M11 头像像素与 morph；MAC-M13 表情环拖拽；MAC-L1/L2/L3 颜色与动画时序。

### chat-starter（11 项）
CS-H1 未配置态首屏是否真有 setup 卡；CS-H2 免费页是否弹 Pro 售卖卡；CS-H3 附件按钮点后行为；CS-M2 demo 入口是否存在；CS-M3 More 菜单原文；CS-M4 Share 行为；CS-M5 账号菜单原文；CS-M6 线程行操作；CS-L1 聊中头栏标题；CS-L2 消息操作；CS-L3 Thinking 指示器。

## 5. 审计方法与证据说明

- 可见文字提取：用 Python `html.parser` 从三份 orig HTML 提取全部文本节点与 `aria-label` / `placeholder` / `title` / `alt` 属性，落盘 `~/workspace/boardui-audit/work/{ai-chat,multi-agent-chat,chat-starter}-texts.txt`（本轮中间文件）。
- 逐字比对：ai-chat 的 11 条线程标题与时间徽标、用户消息全文、"12 Uncomitted changes / +156 / -23 / +74 / 57%" 数字、"Fable 5 / Main / project-sea / Agent / Ask me anything" 均与 SSR 逐字一致；MAC 的 7 条 agent 简介用程序比对复刻 `intro` 字段，7/7 全文 MATCH；chat-starter 的空态三 pill、状态行、history 空态逐字一致。
- 行号引用：所有"我们是什么"均给出复刻文件行号，可直接打开核对；`CODE_LINES` 42 条用 python 计数，非人工目测。
- 无法核实的处理：MAC 代码注释引用的 live 实测 JSON（`orig-marketplace-full.json`、`orig-probe2.json`、`orig-group-start.json`、`l2p-orig-menurect.json`、`l2-orig-plus.json`、`probe-picker-avatars.json` 等）在仓库内 `find` 无结果，本报告将其对应内容列为"引用文件不在仓内、无法核实"，不采信也不否定，须 live 重核。
- 未做的事：未改任何代码，未 build，未 push；未做像素级量测（无渲染稿）；未核对图标 SVG 路径逐一比对（除 chat-starter 附件图标这一处路径可辨的例外）。

## ai-profile / medical-profile / hr（分组审计 C，详见 boardui-audit/gaps-ai-profile-medical-hr.md）

ai-profile 8 项（4 High / 2 Medium / 2 Low）、medical-profile 19 项（8 / 7 / 4）、hr 23 项（13 / 7 / 3），合计 50 项。以下为分组报告全文：


- 审计日期：2026-11-08
- 审计方式：只审计，不改代码、不 push、不 build。无 live browser，仅用原站 SSR HTML + 复刻代码比对。原站行为凡 SSR 里没有的，一律标注"需 live 核验"，不编造。
- 原站材料：`~/workspace/boardui-audit/orig/ai-profile.html`（252KB）、`medical-profile.html`（761KB）、`hr.html`（284KB）。三份均含 `BAILOUT_TO_CLIENT_SIDE_RENDERING`（各 2 处），即 Recharts 图表等部分为客户端渲染，SSR 里只有空容器。
- 复刻材料：`~/workspace/boardui-templates-replica/app/templates/{ai-profile,medical-profile,hr}/page.tsx`。
- 前人笔记已逐条重新核实，不照抄；核实后推翻的结论见各节末"前人笔记纠正"。
- 严重程度：High = 一眼可见或功能缺失；Medium = 细节差异；Low = 像素级/动画数值级。
- 行号说明：复刻行号指对应 `page.tsx`；原站证据为 orig HTML 里的原文片段（已用 python 提取核实，非凭记忆）。

## 总计

| 模板 | High | Medium | Low | 合计 | 需 live 核验的项数 |
|---|---|---|---|---|---|
| ai-profile | 4 | 2 | 2 | 8 | 5 |
| medical-profile | 8 | 7 | 4 | 19 | 10 |
| hr | 13 | 7 | 3 | 23 | 14 |
| 合计 | 25 | 16 | 9 | 50 | 30 |

---

## 一、ai-profile

### A-1 Share 按钮行为未证实：复刻猜测为"复制链接 + Copied 2 秒" —— High，需 live 核验

- 位置：页面头部操作区 Share 按钮。
- 原站：按钮存在，`<span ...>Share</span></button>`；SSR 全文无任何分享弹窗/菜单 DOM，点后行为无法推断。
- 我们：`page.tsx:113-122` `share()` 调 `navigator.clipboard.writeText(window.location.href)`，`116` 行 `window.setTimeout(() => setShared(false), 2000)`，`158` 行按钮文字在 `shared` 时变 `"Copied"`。
- 差距：复制链接只是复刻的猜测实现；原站可能是分享菜单、复制资料链接或其他行为。另 "Copied" 文案在原站全文 0 次。

### A-2 Edit 按钮形态未证实：复刻自创内联编辑 —— High，需 live 核验

- 位置：页面头部操作区 Edit 按钮，与 Share 并排。
- 原站：按钮存在，`<span ...>Edit</span></button>`；SSR 全文搜 "Save" 0 次，无编辑表单/弹窗 DOM。
- 我们：`125-135` 行 `startEdit`/`saveEdit`；`149-153` 行编辑态出现 Cancel + Save 按钮；名字/handle 变输入框（`178-215` 行附近）。
- 差距：内联编辑 + Cancel/Save 是复刻自创的形态；原站可能是弹窗编辑、跳页或其他形态。Save/Cancel 文案在原站 AI Profile 页 SSR 里不存在。

### A-3 Agents 其他月份柱子数据为移位编造 —— High，需 live 核验

- 位置：Agents 卡片右上角月份切换 Previous/Next（`aria-label="Previous"` / `"Next"`），中间显示月份。
- 原站：SSR 只有 December 一个月的数据，30 根柱子高度为 `73, 141, 118, 4, 118, 18, 4, 4, 4, 95, 4, 158, 78, 45, 4, 45, 135, 88, 4, 4, 107, 21, 45, 105, 87, 66, 19, 128, 98, 34`（容器高 206px，逐根核对一致）。
- 我们：`47` 行 `MONTHS = ["October", "November", "December", "January", "February"]`；`57-60` 行 `barSet()` 把原数组轮转 7 位生成其他月份。
- 差距：October/November/January/February 四个月的柱子高度是编造的移位数据；原站是否真有这四个月、切换时柱子如何变化，SSR 里没有。

### A-4 Tokens 曲线 60 点数据为合成数据 —— High，需 live 核验

- 位置：Tokens 卡片趋势图区（高 200px）。
- 原站：图是 Recharts 客户端渲染（SSR 只有 `<div class="recharts-responsive-container">` 空容器 + `height:200px`），每日数值不在 SSR 里；仅能证实标题 `667.7M tokens`、`+9.4%`、底部 `Jun 14` / `Today`。
- 我们：`81-103` 行 `tokens` 用 `8.5 + t*8 + 1.6*sin(i/11) + 噪声` 生成 60 点再缩放到总量 667.7M，手写 SVG 折线 + 面积填充（`320-340` 行）。
- 差距：曲线形状是合成的，与原站真实曲线是否一致无法从 SSR 判断，需 live 截图比对。文件头注释已如实标注此点，但差距本身仍在。

### A-5 封面卡片几何与头像尺寸不符 —— Medium

- 位置：页面顶部封面卡片 + 头像。
- 原站：整个封面是一个带边框的 section，`<section class="relative w-full overflow-hidden rounded-3xl border border-border-ai-profile-card">`；封面图容器 `absolute inset-x-0 top-0 h-[165px]`；头像为 `size-20`（80px）圆圈，字母 M 为 `text-[30px]`，内容区 `pt-[124px]`。
- 我们：`170-175` 行，封面图容器 `h-40`（160px）`rounded-[20px]`，无外层带边框 section；头像 `Avatar size="lg" ... -mt-10 size-16`（64px）。
- 差距：缺边框 section；封面高 160 vs 165px；头像 64 vs 80px。封面图本身已用原图（`public/templates/ai-profile-cover.png`，80,403 字节，与原站路径一致），此项无差距。

### A-6 热力图逐格入场动画 delay 数值与原站不符 —— Low

- 位置：266 个热力图格子。
- 原站：仅 tier > 0 的格子带 `animate-cell-pop`，delay 为 66～778ms 的伪随机值；实测抽查 Feb 22（38，tier 5）原站 `animation-delay:519ms`，Jan 20（23，tier 4）原站 `animation-delay:688ms`。
- 我们：`267` 行 `tier > 0 && "animate-cell-pop"`（范围已对）；delay 公式 `66 + ((i * 137) % 713)`，Feb 22 算出 683ms，Jan 20 算出 340ms。
- 差距：delay 取值规律不同，逐格数值无法从 SSR 恢复出原站的确切序列（原站每格 delay 只能逐格抄，复刻用的是公式近似）。

### A-7 Agents 柱子入场动画未证实 —— Low，需 live 核验

- 位置：Agents 30 根柱子。
- 原站：SSR 看不出柱子动画。
- 我们：柱子带 `animate-bar-rise` + 每根 22ms stagger。
- 差距：动画形态未经证实，需 live 录屏/截图比对。

### A-8 外壳多出"全部模板"入口 —— Medium

- 位置：顶栏右侧 + 侧栏首行。
- 原站：AI Profile 页 SSR 里无"全部模板"文字；侧栏为 9 项导航（Home 152 / Project board / Marketing / Calendar / Finance / Medical Report / AI Chat / AI Image Generation / Profile）。
- 我们：共享 `TemplateShell` 默认渲染 `<AllTemplatesButton />`（`template-shell.tsx:145`），侧栏首行同样有"全部模板"。
- 差距：多出一整套模板切换入口。备注：此前多轮笔记称该入口按用户要求保留，本次仅记录差异，不擅自判定去留；面包屑与页面大标题已修（本页传了 `hideBreadcrumb` `hideHeading`，`143-144` 行），此两项已无差距。

### AI Profile 已核实无差距（抽查）

- 热力图 266 格：逐项比对原站 `aria-label`（如 "38 contributions on Feb 22" / "No contributions on Jan 1"），日期与数量 266/266 全对，0 差异；格子 `tabindex="-1"`、无 `title`、tier 0 无动画，均与原站一致。
- Agents 30 根柱子高度逐根与原站一致（见 A-3）；月份切换器结构一致；底部 `Jun 14` / `Today` 为纯文本 `<p>`，与原站一致（无 Today 按钮）。
- 文字与数字：Mertcan Esmergül、@sitenley、PRO、Contributions this year、$0、+14.8%、9B Lifetime tokens、562.7M Peak tokens、12h 54m Longest task、62 days Top streak、Activity、Weekly/Monthly/Yearly、Agents、32 agents、December、Tokens、667.7M tokens、+9.4% 全部对上。
- 周期单选：默认 Weekly 已修（原站 Weekly `aria-checked="true"`），切换只改选中态、热力图恒为 266 格，与原站快照一致。
- 原生 `<select>`：本页 0 处。占位/编造文案 grep：无 TODO/待实测等中文占位；"Copied" 见 A-1。
- 封面图、芯片样式（+14.8%/+9.4% 均为 `rounded-md` `bg-status-purple-background`，无箭头）与原站一致。

### AI Profile 前人笔记纠正

- 前人清单 A5 曾把 Agents 底部的 "Today" 当按钮，已在前人修复中纠正（原站为普通 `<p>` 文本，复刻已删 Today 按钮），本次复核确认无此按钮。
- 前人清单 B1/B3/B4 的自加底部文案（热力图状态行、"30 days · hover a bar"、Tokens 中间读数）已删除，本次复核确认不存在。

---

## 二、medical-profile

### M-1 过滤器用原生 `<select>` ×2（原站一律用 BoardUI react-aria Select）—— High

- 位置：患者表工具栏 Status / Condition 筛选。
- 原站：两个筛选器均为 react-aria Select（可见按钮 + 隐藏的 `<select tabindex="-1">`，`data-testid="hidden-select-container"`）；选项与复刻一致：Status 为 All statuses / Stable / Under observation / Critical / Recovering / In treatment；Condition 为 All conditions / Diabetes / Hypertension / Asthma / Fracture / Post-op / Pregnancy / Allergy / Migraine。
- 我们：`669` 行 Status、685 行 Condition，均为原生 `<select>` + `<option>`，带 `rounded-2lg border` 等手写样式。
- 差距：按任务规则，原生 `<select>` 每处都是 High；键盘行为（方向键选值、Esc、焦点管理）与原站 react-aria Select 不一致。

### M-2 每行 "More actions" 触发器缺失 12 个 —— High

- 位置：患者表每行 Actions 列。
- 原站：每行除 View chart / Edit patient 外，还有一个菜单触发器，`aria-label="More actions for <姓名>"`，12 行各 1 个，共 12 个；菜单内容不在 SSR 里。
- 我们：全文 grep "More actions" 0 次；每行 Actions 列只有 View chart + Edit patient 两个图标按钮（`828-838` 行）。
- 差距：12 个触发器入口缺失。备注：前人修复时因菜单内容无法证实而把触发器一并删掉，但触发器本身在 SSR 里是明确存在的元素，删触发器与"不编造菜单内容"是两回事。

### M-3 View chart / Edit patient 点后只弹 toast 占位 —— High，需 live 核验

- 位置：患者表每行 Actions 列两个图标按钮。
- 原站：两个按钮存在（`aria-label="View chart"` / `"Edit patient"`，各 12 个）；点后发生什么不在 SSR 里。
- 我们：`831` 行 `showToast("Chart for <姓名>")`；`837` 行 `showToast("Edit patient: <姓名>")`；toast 3.5 秒后由 `setTimeout` 清除（`295-298` 行）。
- 差距：toast 回显是占位行为，不是原站已证实的行为；原站可能是打开图表页/编辑页/弹窗，需 live 核验。

### M-4 Filters 按钮行为编造（滚动 + toast）—— High，需 live 核验

- 位置：顶栏 Filters 按钮。
- 原站：按钮存在（文字 Filters）；点后行为不在 SSR 里。
- 我们：`380-385` 行，点击后 `scrollIntoView` 到患者表 + `showToast("Use the Status / Condition filters above the patient table.")`。
- 差距：滚动 + toast 是复刻编造的行为；原站行为未知，需 live 核验。

### M-5 "File a report" 弹窗字段编造 + 原生 `<select>` + 无 Esc 关闭 —— High，需 live 核验

- 位置：顶栏 "File a report" 按钮打开的弹窗（`900` 行起）。
- 原站：按钮存在（全文 "File a report" 仅出现 1 次，即按钮本身）；"Report type" 全文 0 次；弹窗字段不在 SSR DOM 里。
- 我们：弹窗含 Report type 下拉（`911` 行原生 `<select>`，选项 Lab results / Imaging / Prescription / Referral / Other，`917` 行）、Notes 文本框（`929` 行，placeholder "Add a short note for Dr. Mattheus Clarkson"）、Cancel / Submit report（`944` 行提交后 toast `"<type> report filed for Mertcan Esmergül."`）；弹窗只支持点遮罩/按钮关闭，无 Esc 监听（全文件 Esc 监听只有 Admission 菜单那一处，`281` 行）。
- 差距：下拉选项与占位文案在原站全文检索不到（"Lab results" 仅作为提醒标题 "Lab results ready" 出现过），属编造；原生 `<select>` 本身也是 High；原站真实表单与关闭方式需 live 核验。

### M-6 患者表 Status 徽标全错（形状/字号/颜色）—— High

- 位置：患者表 Status 列徽标。
- 原站：徽标为 `rounded-md`、`text-body-medium`，颜色走 status token：Stable `bg-status-lime-background text-status-lime-text`；Under observation `bg-status-yellow-background text-status-yellow-text`；Critical `bg-status-rose-background text-status-rose-text`；Recovering `bg-status-cyan-background text-status-cyan-text`；In treatment `bg-status-blue-background text-status-blue-text`。
- 我们：`238-244` 行 `STATUS_STYLE` 与 `811` 行渲染：Stable 用 status-lime（对），其余四项用 Tailwind 原色 `bg-amber-100 text-amber-800` / `bg-rose-100 text-rose-700` / `bg-sky-100 text-sky-700` / `bg-violet-100 text-violet-700`；形状为 `rounded-full`、`text-body-2-medium`。
- 差距：形状（圆角 pill vs 方角 md）、字号（body-2 vs body）、颜色 token（4/5 不对：Under observation 应为 yellow 不是 amber，Recovering 应为 cyan 不是 sky，In treatment 应为 blue 不是 violet；Critical 的 rose token 与 rose-100 色值也不同）全部不符，一眼可见。

### M-7 活动详情三行布局错 + 多出底部百分比文案 —— High

- 位置：选中日期详情卡（默认 July 10, 2026）。
- 原站：Move / Exercise / Running 三项横排三列，容器 `flex h-[57px] w-full shrink-0 items-stretch gap-2`，每项为 `rounded-2lg bg-background-inner-default` 卡片，label 在上、值在下（如 Move 上、"816 kcal" 下）；大圆环下方无百分比汇总文案。
- 我们：`599-618` 行，三项上下堆叠三行（label 左、值右）；`638` 行多出底部文案 `Move {pct}% · Exercise {pct}% · Running {pct}%`。
- 差距：布局由三列横排变三行堆叠，一眼可见；底部百分比文案在原站全文 0 次，属自加。数值本身无差距（Move 816 kcal / Exercise 1h 41m / Running 5.2 km 全对）。

### M-8 Steps 每日柱值与第 2/3 周数据编造 —— High，需 live 核验

- 位置：Steps 卡柱状图 + 周切换 pill。
- 原站：标题 31,600 total steps、周标签 "29 Jun - 5 Jul"、图表为 Recharts 空容器（SSR 无每日值、无 Mon–Sun 标签，`Mon` 全文 0 次）；SSR 只有当前一周。
- 我们：`53-57` 行 `STEP_WEEKS`：第一周每日 `[4200, 5100, 3800, 5400, 4600, 3900, 4600]`（合计 31,600 对得上）；另有两周 "22 - 28 Jun" / "6 - 12 Jul"，总数均为 31,400；周切换在三周间循环（`429-430` 行）。
- 差距：每日柱值与后两周的标签/总数均为复刻编造（文件头注释已承认每日值不在原站 HTML 里），需 live 核验原站真实柱值与周切换范围。

### M-9 睡眠环 hover 变淡为自加行为 —— Medium，需 live 核验

- 位置：Sleep score 卡 98 分环形图。
- 原站：睡眠环为 Recharts 客户端渲染（SSR 只有 `h-[104px]` 空容器 + 中央 "98" 文字）；hover 有无反应无法从 SSR 得知。
- 我们：`253` 行 `sleepHover` 状态；`488` 行环段 `opacity={sleepHover === null || sleepHover === row.key ? 1 : 0.25}`，hover 一段、其余段变淡。
- 差距：hover 联动系复刻自加，原站行为未知，需 live 核验。

### M-10 睡眠三行容器与圆点形状错 —— Medium

- 位置：Sleep score 卡三行子分数（Duration / Bedtime / Interruptions）。
- 原站：三行在同一个 `rounded-2lg bg-background-inner-default` 容器内，以分隔线排布；行首圆点为 12px 方形 `size-3 rounded-[4px]`，颜色分别为 chart-5 / chart-3 / chart-6（已核实复刻的 `dot` 字段颜色是对的）。
- 我们：`507-530` 行，三行是三个独立的 `rounded-xl bg-background-inner-default` 卡片；圆点为 `size-2.5 rounded-full`（10px 圆形）。
- 差距：容器结构（整体 vs 独立卡片）与圆点形状（方形 vs 圆形）不符。

### M-11 其余日期活动详情值按比例推算 —— Medium，需 live 核验

- 位置：选中日期详情卡（非 Jul 10 的日期）。
- 原站：仅 Jul 10 的绝对值在 SSR 里（Move 816 kcal / Exercise 1h 41m / Running 5.2 km，大圆环 21/62/77%）；其余 190 天只有环百分比，无绝对值。
- 我们：`activityFor()`（文件内函数）以 Jul 10 为基准缩放（Move 3886 kcal / Exercise 163 min / Running 6.75 km）推算其余日期的绝对值。
- 差距：推算值未经证实，需 live 核验原站其他日期的详情值。

### M-12 第 2–45 页患者行为生成数据 —— Medium，需 live 核验

- 位置：患者表第 2–45 页。
- 原站：SSR 只有第 1 页 12 行；第 2–45 页内容不在 SSR 里（客户端渲染）。
- 我们：`205` 行注释 + 生成函数，第 13–540 行为 FIRST/LAST 名单组合的确定性生成数据。
- 差距：生成行与原站真实行是否一致无法证实，需 live 核验。

### M-13 表格底部多出 "Page 1 of 45 · 12 per page" —— Medium

- 位置：患者表底部分页左侧。
- 原站：全文无 "Page 1 of"、无 "12 per page"。
- 我们：`857` 行 `<p>Page {safePage} of {totalPages} · 12 per page</p>`。
- 差距：多出一行原站没有的文案。

### M-14 自加提示与反馈文案 —— Medium（部分需 live 核验）

- 位置：月份列表下方、空态、选中条、toast。
- 原站：全文无以下文案（均为 0 次）："Tap a day to see its activity."、"No activity recorded for this day yet."、"Clear selection"、"N selected"。
- 我们：`587` 行月份列表下方提示（含 "Days after 10 July 2026 have no data yet in the original."）；`642` 行空态 "No activity recorded for this day yet."；`704-710` 行勾选后 "{checked.size} selected" 条 + "Clear selection" 按钮；另有各类 toast 文案。
- 差距：文案系复刻新增。说明：勾选条本身可能是原站客户端态，SSR 里没有不等于原站一定没有，但文案措辞未经证实，标为需 live 核验。

### M-15 Admission 控件细节错：用 "▾" 字符 + 未用 BoardUI Select —— Medium

- 位置：患者表 Admission 列每行控件。
- 原站：react-aria Select 按钮（当前状态 + SVG chevron 图标）+ 隐藏的原生 `<select tabindex="-1">`（选项 Inpatient / Outpatient / Discharged / Emergency）；`aria-label="Admission status for <姓名>"`。
- 我们：`780` 行 aria-label 已改回原站文案；`786` 行用文本字符 `<span aria-hidden>▾</span>` 代替 SVG chevron；下拉为手写菜单（`admissionMenu` state），未用 BoardUI Select 组件，键盘方向键选值等行为与原站不一致；Esc 关闭与点击外部关闭已补（`281` 行起监听），此两项无差距。
- 差距：chevron 形态（字符 vs SVG）与组件实现（手写菜单 vs react-aria Select）。

### M-16 排序按钮形态错 —— Low

- 位置：表头 Patient / Next appointment 排序按钮。
- 原站：`aria-label="Sort by Patient"` / `"Sort by Next appointment"`，按钮文字为 "Patient" / "Next appointment"（`text-body-medium`），配 24px SVG chevron。
- 我们：表头按钮无 aria-label，文字为 "Patient ↑/↓" / "Next appointment ↑/↓"（`text-body-2-medium`），用 ↑/↓ 字符表示方向，未排序时无任何方向标记。
- 差距：aria-label 缺失、字号与方向指示形态不符。

### M-17 表格用原生 `<table>`，原站为 div 结构 —— Low

- 位置：患者表整体。
- 原站：全文 `<table` 出现 0 次，表格为 div 行结构（表头、行、分页均为 div/button 组合）。
- 我们：原生 `<table>` + `<thead>`/`<tbody>`，`min-w-[760px]`。
- 差距：实现结构不同；视觉是否一致需截图核实，暂定 Low。

### M-18 睡眠环段颜色未证实 —— Low，需 live 核验

- 位置：Sleep score 卡环形图三段。
- 原站：环为 Recharts 客户端渲染，段颜色不在 SSR 里。
- 我们：`SLEEP_ROWS` 里环段颜色为 chart-3-active / chart-2 / chart-4（行首圆点颜色已按 SSR 核实为 chart-5 / chart-3 / chart-6，两者是不同字段）。
- 差距：环段颜色未经证实，需 live 核验。

### M-19 Steps tooltip 文案未证实 —— Low，需 live 核验

- 位置：Steps 卡柱状图 hover。
- 原站：图表客户端渲染，tooltip 有无、文案均不在 SSR 里。
- 我们：`444` 行起 recharts Tooltip，hover 显示 "Mon: 4,200 steps" 式文案，柱子颜色由 chart-2-active 变 chart-2。
- 差距：tooltip 文案与样式未经证实，需 live 核验。

### Medical Profile 已核实无差距（抽查）

- 患者卡：Mertcan Esmergül、Date of Birth 28 July, 1997、Gender Male、Blood Type A rh+、GP Doctor Mattheus Clarkson、头像字母 M，全对；Add profile photo 已接隐藏 file input（`page.tsx` 传 `onAddPhoto`，共享 PatientInfoCard 已加 prop）。
- 睡眠分数：98、Excellent、Duration 7h 50m 49/50、Bedtime 20m earlier 29/30、Interruptions 5m wake up 20/20，全对；圆点颜色已修为 chart-5/chart-3/chart-6；三行已改回静态 div。
- 365 天小圆环：复刻 `MINI_RINGS` 365 组，Jul 10 下标 190 的值为 [21, 62, 77]，与原站大圆环 dasharray "21 79 / 62 38 / 77 23" 一致；有数据的 191 天为 Jan 1–Jul 10，与原站一致；空闲日期已全部可点（无 disabled）。
- 月份 pill 初始值已修回 January（原站 SSR 的 pill 文案为 January）。
- 提醒 6 条（High Heart rate / Medical ID / Lab results ready / Medication reminder / Irregular sleep / Low blood oxygen，含日期与正文）逐字对；卡头 "Important alerts / 12 this week" 对。
- 患者表首 12 行逐字对（姓名、Admission、Status、Condition、日期）；筛选选项、总数 "Total Results 540 patients"、初始勾选（Aspen Lubin、Michael Ekstrom）、全选 checkbox（原站共 13 个 checkbox，含 "Select all patients on this page"）均对。
- 前 8 名患者头像已改用 `public/avatars/` 下 8 张 webp；后 4 行用首字母圆圈，与原站一致。
- 大圆环三个 `<g>` 已加 `cursor-pointer` 与 onClick（点后行为见 M-3 类 toast 占位，需 live 核验原站行为）。

### Medical Profile 前人笔记纠正（重要）

- **M-C14 分页 "…"：前人称"原站无省略号"——错。** 本次 orig HTML 里分页为 `1 2 3 4 5 … 45`，省略号以 `<li aria-hidden="true">…</li>` 存在；复刻 `354-360` 行同样渲染 "…"，**此项无差距**，前人结论作废。
- **M-C3 的后续**：前人修复删掉了行菜单触发器，但触发器本身在原站 SSR 里明确存在（见 M-2），删除触发器是过度删除。
- 其余前人已修项本次复核确认仍成立：M-C1 搜索框、M-C2 View/Edit 按钮、M-C4 aria-label 与 Esc/外部关闭、M-C6 头像、M-C7 空闲日期可点、M-C8 月份 January、M-C9 Add photo、M-C15 睡眠行静态化、M-S1 圆点颜色。

---

## 三、hr

### 前提纠正（先读）

任务书称"原站 HR Management 模板没有官方演示（原站 /templates/hr 是 404），审计以官方描述为准"。**该前提与本次提供的材料不符**：`~/workspace/boardui-audit/orig/hr.html` 是 284KB 的完整原站 SSR（`<title>HR Management Template — React + Tailwind Admin Dashboard | BoardUI</title>`，含 `BAILOUT_TO_CLIENT_SIDE_RENDERING` 2 处、13 个隐藏 `<select>`、全部 10 行员工数据；文件内 meta 描述为 "BoardUI Pro HR template: headcount KPIs, recent hires, hiring pipeline, engagement radar, hires vs. attrition, team breakdowns, and an employees data table."）。本次 HR 审计以该 SSR 为准，不再按"无演示"处理。前人 `hr-management-check.md`（称"无原版"、Q2/Q3/2026 三档 KPI、漏斗 1240 等）所指是旧版复刻，与现行 `hr/page.tsx`（单套 KPI、无档位切换）多处不符，旧数字结论作废。

### HR 返工结果（2026-11-08，提交 441330b）

返工范围：`app/templates/hr/page.tsx`（唯一改动文件）。验证：`npm run build` 通过（exit 0，`/templates/hr` 预渲染）；`npx tsc --noEmit` 零错；本地 HTTP + Playwright 1440/768/390 三宽截图与交互自测全过（报告 `audit/shots/hr-refix-20261108/shot-report.json`，截图同目录 `hr-refix-20261108-*-*.png`）。

证据来源更正（本次返工从原站客户端 JS chunk 中挖到真实数据，以下审计原文结论作废）：
- 原站 `https://www.boardui.com/templates/hr` 引用的 `_next/static` chunk（50 个，已存 `audit/shots/hr-refix-20261108/chunks/`）含 HR 页模块：员工名单由 seeded PRNG（mulberry32，seed 23）+ 固定表客户端生成；三个 Change period 菜单的全部选项与数值；More actions 菜单 4 项；漏斗/雷达/Hires 的全部档位数据。
- H-6、H-8、H-9、H-15 的"无依据/编造"结论随之推翻，见各条。

逐项：
- H-1 已修复：三处恢复真实按钮（日历图标 + 文字 + chevron，aria-label="Change period"）；菜单选项与切换值取自原站 JS chunk（漏斗 Last 30 days / Last 90 days / This year；雷达 Q3 / Q2 / Q1 survey；Hires This year / Last 6 months / Last year），切换后数值与 delta 均按原站数据重算，实测通过（漏斗 90d：1,240 +4.8%；雷达 Q1：73 Fair；Hires Last year：111 -3.2%）。
- H-2 已修复：每行 Edit / Delete / More actions 三个图标按钮，aria-label 逐字与原站一致（Edit/Delete 各 10 个，More actions for <姓名> 10 个）；More 菜单 4 项取自原站 JS chunk（View profile / Copy email / Download contract / Archive employee）；Delete 点后移除该行、Total Results 248 → 247，实测通过。Edit 点后行为、菜单项点后行为原站 JS 里无 handler（inert），仍需 live 确认。
- H-3 已修复：11 个 BoardUI Checkbox（表头 Select all employees on this page + 每行 Select <姓名>）；初始选中 Aspen Lubin + Michael Ekstrom（与 SSR 一致）；单选后表头 indeterminate，实测通过。SSR 全文无 "N selected" 文案，不加选中条。
- H-4 已修复：Salary 列加排序按钮（aria-label="Sort by Salary"），asc → desc → unsorted 循环；实测 asc 首行 Nolan Calzoni $42K（248 人最低薪）。
- H-5 已修复：Total Results / 248 employees 移到表格区表头（与搜索框/三个筛选器同一行），breakdown 底部已删；实测 248 employees，删行后变 247。
- H-6 已修复（审计结论更正）：第 2–25 页不再是空态。原站 JS chunk 含完整生成器，已逐字移植（seed 23）；前 10 行与 SSR 逐字节一致；实测第 2 页首行 Leilani Botosh、第 25 页 8 行、共 248 行。空态文案按原站 chunk 改为 "No employees match your filters."（原复刻 "these filters" 是错的）。
- H-7 部分修复：Team 原生 select 已换 BoardUI Select，点开菜单 5 项（Engineering / Sales / Support / Marketing / Design）；弹窗字段与 Team 选项本身原站无数据（原站不发货弹窗），仍标记未证实。注：弹窗 DOM 里有一个原生 select，那是 react-aria Select 渲染的隐藏表单 select，位于视口 (-1, 0)、被弹窗遮罩盖住，用户不可见、不可点；用户看到的 Team 控件是 BoardUI Select 触发器。
- H-8 已核实无改动（审计结论更正）：Sources（Referrals 52 / LinkedIn 38 / Job boards 24 / Inbound 17 / Agencies 10）与 Locations（Remote 84 / Berlin 62 / London 48 / New York 34 / Singapore 20）与原站 JS chunk 逐字一致，原审计"编造"结论是错的；复刻数字不动。
- H-9 已修复（审计结论更正）：月度值取自原站 JS chunk（This year hires [8,11,14,9,12,16,10,13,15,12,14,12]，合计 146；attrition 均值 4.3%），替换了原来的反推值；Last 6 months / Last year 两档亦按 chunk 落地，实测 Last year 合计 111、-3.2%。
- H-10 已修复（编造行为已删）：All↔Active 二态切换已删除，Filters 按钮恢复为普通按钮；原站 JS 里该按钮无 handler（inert），真实行为仍需 live 确认。
- H-11 已修复：View（eye）按钮与 View employee 详情弹窗已删。
- H-12 已修复（审计行数更正）：Departments 改回 7 行静态 div（Engineering 96 / Sales 44 / Support 38 / Marketing 26 / Design 22 / Operations 14 / People 8，合计 248），删 button、删点按过滤、删提示文案；原审计称 5 行是错的（SSR 只渲染前 5 行是因折叠，chunk 里共 7 行）。静态行为已按 SSR 还原，仍需 live 确认无点击行为。
- H-13 已修复（审计行数更正）：初始显示 5 行 + 渐隐 mask + "Show 2 more" 圆形展开按钮，点开展示全部 7 行、按钮变 "Show fewer"；原审计称"初始 3 行"是错的（SSR 含 5 个 h-9 行，折叠上限是 5）。返工中曾出现展开后末 2 行重复的 bug，已修（提交内含修复），实测展开后 Operations / People 各出现 1 次。
- H-14 已修复：4 张 KPI 芯片与漏斗 "+6.2%" 芯片改 rounded-md、删箭头；数值与颜色不动；截图已验。
- H-15 部分修复：雷达中心圆改 size-[84px] + bg-background-inner-default，中心值/文案按档位重算（Q3：80 Strong；Q1：73 Fair）；6 轴轴名与分数取自原站 JS chunk（Growth / Compensation / Culture / Management / Balance / Tools；Q3 [84,71,88,79,66,91]），与复刻原值一致，原审计"无法证实"已推翻。剩余：雷达形态（原站 Recharts vs 复刻手绘六边形 SVG，复刻已有 4 层同心环）需 live 截图比对；`alertBelow: 60` 行为未核实（Q2 有一轴 58 分）。
- H-16 已修复触发器：Board team 改回真实 button（文字 + chevron）；原站 JS 里该按钮无菜单、无 handler，菜单内容仍列入 live-needs（原站可能根本没有菜单）。
- H-17 已修复：4 张卡片改回静态 div（删点按过滤与滚动），头像 size-9，角色条 rounded-md bg-background-recent-hire-role text-caption-1-medium；Previous/Next 保持 disabled（BoardUI Button secondary small，flex-1）。静态行为仍需 live 确认。
- H-18 已修复：placeholder 改为 "Search"；搜索范围按原站 JS chunk 为姓名 + 角色（不含团队），已实现。
- H-19 已修复：Hires 底部改回两张图例卡（grid-cols-2 sm:grid-cols-6、各 col-span-3、rounded-2lg bg-background-inner-default、12px 圆点 chart-2/chart-3、数值 text-body-medium）；截图已验。
- H-20 已修复：表格容器改 rounded-2xl border border-border-table（去 secondary 底色），min-w [900px]，表头行加 border-y；截图已验。
- H-21 已修复：漏斗条 h-5、条内图标 size-3.5、数值 text-body-medium + 百分比 text-caption-1-medium；迷你卡片 grid-cols-3 bg-background-inner-default、圆点 size-3、数值 text-body-medium；截图已验。剩余：条宽入场动画形态（SSR 宽 0 → 客户端动画展开）需 live 核验。OCR 复审追加修复（提交 efedb3a）：漏斗条宽去掉 12% 下限，改为精确百分比（Offers 5% / Hires 3% 实测 18px / 11px，图标仍在轨道左端可见，与原站一致）。
- H-22 已修复：行内 Status 下拉宽改 w-[130px]，当前值前加 StatusDot（Active 绿 / Contract 靛蓝 / On leave 黄，与 SSR 逐行一致）；截图已验。
- H-23 已修复：状态筛选 aria-label 改为 "Filter by work status"；实测 3 个筛选器 label 各 1 个。

审计外发现（不在 H-1–H-23 内，未改）：页面网格布局与原站不同（复刻 Recent hires 全宽一行，漏斗+雷达第二行，Hires+breakdown 第三行；原站为 3 列网格：Recent hires + 漏斗 + 雷达第一行，Hires + breakdown 第二行）；KPI 卡内部布局与原站略有出入。建议下一轮单独立项。

剩余 live-needs（HR，7 项）：
- H-15 雷达形态 live 截图比对（Recharts vs 手绘 SVG）与 alertBelow:60 行为。
- H-7 Add employee 弹窗真实字段与 Team 选项（原站无此弹窗，live 也只能确认"原站点 Add employee 后发生什么"）。
- H-10 Filters 按钮 live 点后行为。
- H-16 Board team 按钮 live 点后行为（原站 JS 显示无菜单）。
- H-2 Edit 点后行为、More 菜单 4 项点后行为、Delete 点后除删行外的 toast/确认（原站 JS 显示三者均 inert）。
- H-12/H-17 live 确认 Departments 行与 Recent hires 卡片无点击行为。
- H-21 漏斗条入场动画形态（SSR 宽 0 → 客户端动画展开）。

### H-1 三个 "Change period" 按钮缺失 —— High

- 位置：Hiring pipeline 卡（Last 30 days）、Team engagement 卡（Q3 survey）、Hires 卡（This year）右上角。
- 原站：三处均为真实按钮，`aria-label="Change period"`，react-aria 结构（日历图标 + 文字 + 下拉 chevron），`aria-expanded="false"`；点后菜单内容不在 SSR 里。
- 我们：三处均为静态文字：`504` 行 `<span>Last 30 days</span>`（漏斗卡副文案）、`545` 行 `<span>Q3 survey</span>`、`563` 行 `<span>This year</span>`，无 button、无 onClick。
- 差距：3 个可点入口缺失；菜单选项与切换行为需 live 核验。

### H-2 行操作错位：Edit 与 More actions 缺失，View 为自创 —— High

- 位置：员工表每行 Actions 列。
- 原站：每行 3 个图标按钮，`aria-label="Edit"`、`"Delete"`、`"More actions for <姓名>"`，各 10 个，共 30 个；点后行为不在 SSR 里（More 菜单内容未知）。
- 我们：`800` 行 `aria-label="View <姓名>"`（eye 图标）+ `805` 行 `aria-label="Remove <姓名>"`（trash 图标），每行 2 个。
- 差距：Edit 缺失 10 个、More actions 缺失 10 个；View（eye）是原站没有的入口；Remove 的 aria-label 与原站 "Delete" 不符，且"移出视图 + toast"行为未经证实，需 live 核验。

### H-3 行勾选全缺 —— High

- 位置：员工表每行首列 + 表头全选。
- 原站：每行一个 checkbox，`aria-label="Select <姓名>"` ×10；表头一个，`aria-label="Select all employees on this page"`；全文件 `type="checkbox"` 共 11 个。
- 我们：表格无任何 checkbox（全文 grep checkbox 0 次）；也无 "N selected" 选中条。
- 差距：11 个勾选入口缺失，批量选择功能缺失。

### H-4 排序缺 Salary —— High

- 位置：员工表表头。
- 原站：三个排序按钮，`aria-label="Sort by Employee"` / `"Sort by Salary"` / `"Sort by Start date"`，文字分别为 Employee / Salary / Start date，配 SVG chevron。
- 我们：`751` 行起只有 Employee 与 Start date 两个排序按钮（`toggleSort("name")` / `toggleSort("start")`）；Salary 列为纯文本表头，无排序。
- 差距：Salary 排序入口缺失。

### H-5 "Total Results / 248 employees" 放错位置 —— High

- 位置：表格区表头 vs breakdown 区。
- 原站："Total Results" 全文仅出现 1 次，在表格区表头（`<p>Total Results</p><p>248 employees</p>`，与搜索框/三个筛选器同一行）。
- 我们：`660-661` 行把 "Total Results / 248 employees" 放在 breakdown（Team breakdown）卡片底部；表格区表头只有 "Employees" 标题 + 搜索/筛选，无 Total Results。
- 差距：同一元素放错卡片：breakdown 多出、表格缺失。

### H-6 第 2–25 页为空态 —— High

- 位置：员工表分页。
- 原站：共 248 人、25 页（分页按钮 1 2 3 4 5 … 25，省略号为 `<li aria-hidden="true">…</li>`）；第 2–25 页内容不在 SSR 里（客户端渲染），但原站显然有 238 名后续员工。
- 我们：`380` 行注释承认"只第 1 页 10 行可恢复"；`385` 行 `pageRows = safePage === 1 ? employees.slice(0, perPage) : []`；`totalPages = 25` 写死。
- 差距：点第 2 页及以后显示 "No employees match these filters." 空态（`pageRows.length === 0` 分支），即翻页即空表，是功能缺失而非数据未证实。

### H-7 Add employee 弹窗编造 + 原生 `<select>` —— High，需 live 核验

- 位置：顶栏 "Add employee" 按钮打开的弹窗（`889` 行起）。
- 原站："Add employee" 按钮存在；弹窗字段不在 SSR 里。
- 我们：弹窗含 Name / Role 两个输入框、Team 下拉（`910` 行原生 `<select>`，选项为 TEAMS 的 5 个团队）、Cancel / Add employee；提交后新增一行（start 写死 "Nov 6, 2026"、salary "—"）+ toast。
- 差距：弹窗字段、Team 选项、新增行默认值均为编造；原生 `<select>` 本身按任务规则也是 High；原站真实表单需 live 核验。

### H-8 Hiring sources / Locations 两组数据编造 —— High，需 live 核验

- 位置：Team breakdown 卡片的 Hiring sources / Locations 两个 tab 面板。
- 原站：三个 tab 标签存在（Departments 默认选中、Hiring sources、Locations）；SSR 只渲染了 Departments 面板（Engineering 96 / Sales 44 / Support 38 / Marketing 26 / Design 22，合计 248）；"Referrals / LinkedIn / Job boards / Inbound / Agencies / Remote / Berlin / London / New York / Singapore" 在原站全文均为 0 次。
- 我们：`186` 行 `SOURCES`（Referrals 52 / LinkedIn 38 / Job boards 24 / Inbound 17 / Agencies 10）与 `194` 行 `LOCATIONS`（Remote 84 / Berlin 62 / London 48 / New York 34 / Singapore 20），切换 tab 即展示。
- 差距：两组共 10 行数字在 SSR 里无任何依据，属编造；原站真实面板内容需 live 核验。

### H-9 Hires 月度拆分编造 —— High，需 live 核验

- 位置：Hires · Attrition 卡片图表区。
- 原站：图表为 Recharts 空容器（`h-[196px]`），月份数据不在 SSR 里；仅能证实标题 "Hires · Attrition 4.3%"、总数 146、`+8.4%`、"This year"、底部图例 "Hires · total 146" / "Attrition · average 4.3%"。
- 我们：`160` 行 `HIRES_ATTRITION` 12 个月 hires/attrition（如 Jan 9 / 4.8 … Dec 12 / 4.3），文件内注释自认是"按总数反推"（hires 合计 146、attrition 均值 4.3%）；`567` 行 ComposedChart（柱 + 折线）渲染。
- 差距：月度拆分是反推编造，与原站真实月度值是否一致无法证实，需 live 核验。

### H-10 Filters 按钮行为编造 —— High，需 live 核验

- 位置：顶栏 Filters 按钮。
- 原站：按钮存在（文字 Filters，配 filter 图标）；点后行为不在 SSR 里。
- 我们：`421` 行，点击在 "All statuses" 与 "Active" 之间切换状态筛选，按钮文案随之变 "Status: Active"。
- 差距：All↔Active 二态切换是复刻编造的行为；原站行为未知，需 live 核验。

### H-11 View employee 详情弹窗编造 —— High，需 live 核验

- 位置：行 eye 按钮打开的弹窗。
- 原站：无 View 入口（见 H-2），无此弹窗的 SSR 痕迹。
- 我们：`800` 行 eye 按钮打开弹窗，展示 Role / Department / Start date / Salary / Status 五行 + Done 按钮。
- 差距：弹窗本身是按自创入口反推的编造实现；原站有无此弹窗、点 Edit/Delete 后发生什么，需 live 核验。

### H-12 Breakdown 部门行可点过滤为自创交互 —— High，需 live 核验

- 位置：Team breakdown 卡片 Departments 面板 5 行。
- 原站：5 行均为静态 div（`relative flex h-9 items-center justify-between`，无 pressable 属性、无 tabindex、无 button），仅展示名称与数量；行内背景条 SSR 宽度为 0。
- 我们：`638-664` 行，Departments 行做成 `<button>`，点按过滤员工表（`teamFilter` state）+ 再点清除，并配提示文案 "Tap a team to filter the employee table below." / "Filtering the employee table to X — tap again to clear."。
- 差距：静态行变可点过滤器是自创交互；提示文案在原站全文 0 次。SSR 结构是行不可点的强证据，但客户端行为仍标需 live 核验。

### H-13 "Show 2 more" 按钮缺失 —— High

- 位置：Team breakdown 卡片 Departments 列表底部。
- 原站：列表带底部渐隐 mask（`mask-image:linear-gradient(to bottom, black calc(100% - 44px), transparent)`）+ 一个 `aria-label="Show 2 more"` 的圆形展开按钮（`absolute left-1/2 ... bottom-1`）。
- 我们：一次展示全部 5 行 + 每行下方进度条，无折叠、无 mask、无 "Show 2 more" 按钮（全文 grep 0 次）。
- 差距：展开入口缺失；列表初始只显示 3 行的折叠形态也未还原。

### H-14 KPI 与漏斗芯片：多了箭头图标 + 圆角 pill —— Medium

- 位置：4 张 KPI 卡片的 delta 芯片；Hiring pipeline 卡的 "+6.2%" 芯片。
- 原站：芯片为 `rounded-md` 纯文字，无箭头图标；Employees `+4.2%` 为 lime 底、Open roles `+8.3%` 为 tertiary 灰底（`bg-background-tertiary-default text-text-secondary`）。
- 我们：`439-440` 行 KPI 芯片为 `rounded-full` + `RiArrowUpSLine`/`RiArrowDownSLine` 箭头图标；`501-502` 行漏斗 "+6.2%" 同样为 rounded-full + 上箭头。
- 差距：形状（pill vs 方角 md）与箭头图标均为自加，一眼可见。数值与颜色倾向本身是对的（Employees/Time to hire/Attrition 为 lime，Open roles 为灰）。

### H-15 雷达分数与轴名无法证实；中心圆尺寸/底色不符 —— Medium，需 live 核验

- 位置：Team engagement 卡片雷达图。
- 原站：雷达为 Recharts 空容器，仅中心可证实：`size-[84px]` 圆，`bg-background-inner-default`，文字 "80" + "Strong"；轴名 Growth / Compensation / Culture / Management / Balance / Tools 在原站全文均为 0 次（"Management" 的 13 次命中均为其他上下文），轴分数无从得知。
- 我们：`151` 行 `RADAR_SCORES = [84, 71, 88, 79, 66, 91]`，`RADAR_AXES` 为上述 6 轴；`EngagementRadar` 为手写六边形 SVG（`230-280` 行附近）；中心圆 `303` 行为 `size-[104px]` `bg-background-primary-default`。
- 差距：6 轴分数与轴名未经证实（文件注释称来自 live probe，但本次 SSR 无法证实）；中心圆 104 vs 84px、底色 primary vs inner 不符；雷达形态（手绘 SVG vs Recharts）需 live 截图比对。

### H-16 Recent hires "Board team" 由按钮变静态文字 —— Medium，需 live 核验

- 位置：Recent hires 卡片右上角 "Board team"。
- 原站：为 `<button>`（文字 Board team + chevron 下拉图标），应为下拉触发器；菜单内容不在 SSR 里。
- 我们：`450-456` 行附近为静态 `<span>` + chevron 图标，无 button、无 onClick。
- 差距：可点入口变静态展示；下拉菜单内容未知，需 live 核验。

### H-17 Recent hires 卡片由静态 div 变可点按钮 + 角色芯片样式错 —— Medium，需 live 核验

- 位置：Recent hires 卡片 4 张（Livia Saris / Jaydon Aminoff / Maria Lubin / Ann Press）。
- 原站：4 张卡片均为静态 div（`rounded-2lg bg-background-inner-default p-2.5`），头像 `size-9`（36px）；角色为 `rounded-md bg-background-recent-hire-role` 的 `text-caption-1-medium` 通栏条；底部 Previous/Next 按钮均为 `disabled`（本次核实：两按钮均带 disabled 属性与 aria-disabled）。
- 我们：`462-466` 行卡片为 `<button>`，点按按名字过滤表格并滚动到表格；头像用 `Avatar size="sm"`；角色条为 `rounded-lg bg-background-tertiary-default` 的 `text-body-2-regular`。
- 差距：静态卡变过滤按钮是自创交互；角色条圆角/底色/字号不符。底部 Previous/Next 均为 disabled 与原站一致，无差距。

### H-18 搜索框 placeholder 不符 —— Medium，需 live 核验

- 位置：员工表搜索框。
- 原站：`aria-label="Search employees"`，`placeholder="Search"`；搜索范围（是否含 role/team）不在 SSR 里。
- 我们：`686` 行 `placeholder="Search name, role, team…"`。
- 差距：占位文案不符；"按角色/团队搜"的范围宣称未经证实，需 live 核验。

### H-19 Hires 底部图例卡片变纯文本 —— Medium

- 位置：Hires · Attrition 卡片底部。
- 原站：`grid-cols-2 sm:grid-cols-6` 的两张卡片（各 `col-span-3`），`rounded-2lg bg-background-inner-default`，带 12px 圆点： "Hires · total 146"（chart-2 点）、"Attrition · average 4.3%"（chart-3 点），数值为 `text-body-medium`。
- 我们：`586-589` 行，四行纯文本 `<p>`（"Hires · total" / "146" / "Attrition · average" / "4.3%"），无卡片、无圆点。
- 差距：图例卡片结构缺失；数值本身是对的。

### H-20 表格容器与结构差异 —— Medium

- 位置：员工表整体。
- 原站：表格区为 `rounded-2xl border border-border-table` 的 section（无 secondary 底色），行为 div 结构，`min-w-[900px]`；表头行带 `border-y`。
- 我们：表格区为 `rounded-2xl bg-background-secondary-default` 的 section，内用原生 `<table>`，`min-w-[720px]`。
- 差距：容器底色/边框与最小宽度不符；视觉差异程度需截图核实。

### H-21 漏斗条与迷你卡片样式差异 —— Low

- 位置：Hiring pipeline 卡片。
- 原站：漏斗条高 `h-5`，条内图标 `size-3.5`，数值区为 `text-body-medium` + 百分比 `text-caption-1-medium`；底部 5 张迷你卡片为 `grid-cols-3`、`bg-background-inner-default`，圆点 `size-3`，数值为 `text-body-medium`；条宽 SSR 为 0（客户端动画展开）。
- 我们：漏斗条 `512` 行为 `h-8`；`528` 行迷你卡片为 `bg-background-primary-default`，圆点 `size-4`，数值为 `text-title-3-semibold`；条宽直接按百分比渲染。
- 差距：条高、圆点尺寸、卡片底色与数值字号不符；条宽的入场动画形态需 live 核验。漏斗数值与百分比本身全对（412/156/68/21/12，100%/38%/17%/5%/3%）。

### H-22 状态下拉无圆点前缀 —— Low

- 位置：员工表每行 Status 下拉。
- 原站：Work status 按钮宽 `w-[130px]`，当前值前带彩色圆点（Active 为绿点 halo，`bg-status-dot-green-halo` 内 `bg-green-500` 的 `size-1.5` 点）。
- 我们：`779` 行 BoardUI Select，宽 `w-[128px]`，只显示文字，无圆点。
- 差距：圆点指示缺失；是否影响识别待截图核实。

### H-23 状态筛选 aria-label 差异 —— Low

- 位置：员工表筛选器。
- 原站：`aria-label="Filter by work status"`；另两个为 "Filter by department" / "Filter by salary"。
- 我们：`707` 行 `aria-label="Filter by employment status"`（department 与 salary 的 label 与原站一致）。
- 差距：仅无障碍标签措辞差异，不可见。

### HR 已核实无差距（抽查）

- KPI 四项全对：Employees 248 +4.2% / Open roles 12 +8.3% / Time to hire 24 days -8.3% / Attrition 3.8% -0.6%；无档位切换器（原站 KPI 区无切换器，复刻单套 KPI 是对的）。
- Recent hires：总数 56、4 人姓名/角色/时间（Livia Saris Backend Engineer Joined today / Jaydon Aminoff UI Designer 2 days ago / Maria Lubin User Researcher 5 days ago / Ann Press DevOps Engineer A week ago）全对；底部 Previous/Next 均为 disabled，与原站一致。
- 漏斗数值与百分比全对（见 H-21）；底部 5 张迷你卡片存在且数值全对。
- Departments 面板 7 行全对（Engineering 96 / Sales 44 / Support 38 / Marketing 26 / Design 22 / Operations 14 / People 8，合计 248）；三个 tab 标签存在且 Departments 默认选中。
- 员工表首 10 行全对（姓名/角色/团队/入职日/状态/薪资逐项核对，10/10）；三个筛选器选项全对（部门 7 项、状态 3 项、薪资 4 项）；分页数字 1–5 … 25 与原站一致（含省略号）。
- 过滤器与行内状态下拉均用 BoardUI Select（非原生），与原站 react-aria Select 实现一致；Add employee 弹窗的 Team 下拉除外（见 H-7）。
- 顶栏 Filters / Add employee 按钮存在；通知铃铛存在；面包屑 Board team / Mertcan / HR Team 与原站一致。

### HR 前人笔记纠正（重要）

- **前提推翻**：前人称"HR 没有原版（官方 /templates/hr-management 返回 404）"——与本次提供的 `orig/hr.html`（284KB 完整 SSR）矛盾。本次 HR 审计以该 SSR 为准；"凡是无法从官方描述证实的内容标注无法证实"的前提不再适用。
- **旧数字作废**：前人自查里的 Q2/Q3/2026 三档 KPI（61 hires、漏斗 1240 等）在现行复刻与原站 SSR 里均不存在，不再作为审计依据。
- **旧结论修正**：前人称"分页省略号已删"与"侧栏删 HR 行"等共享壳改动，与原站 HR SSR（分页确有 "…"，见 H-6）无关；HR 页自身的分页省略号与原站一致，无差距。

---

## 四、需 live 核验的项（汇总，23 项）

无 live browser，故以下均未核实。每一项都写清了"原站 SSR 里没有、复刻这边是什么"，live 时按此清单逐项确认即可。注：H-7/H-8/H-9 的"数据不存在"本身已证实是编造，live 的作用是拿到真实值而非判定有无差距，仍计入需 live 数。

### ai-profile（5 项）
- A-1 Share 点后行为（复制链接 vs 分享菜单）
- A-2 Edit 形态（内联编辑 vs 弹窗/跳页）
- A-3 Agents 其他四个月柱子数据与切换行为
- A-4 Tokens 曲线真实形状
- A-7 Agents 柱子入场动画

### medical-profile（11 项）
- M-2 More actions 菜单内容
- M-3 View chart / Edit patient 点后行为
- M-4 Filters 点后行为
- M-5 File a report 真实表单字段与关闭方式
- M-8 Steps 每日柱值与周切换范围
- M-9 睡眠环 hover 行为
- M-11 非 Jul 10 日期活动详情绝对值
- M-12 第 2–45 页患者真实行
- M-14 "N selected" 选中条在原站是否存在（文案措辞）
- M-18 睡眠环段颜色
- M-19 Steps tooltip 有无与文案

### hr（7 项，2026-11-08 返工后剩余；其余 7 项已由原站 JS chunk 解决，见 HR 返工结果小节）
- H-15 雷达形态 live 截图比对（Recharts vs 手绘 SVG）与 alertBelow:60 行为
- H-7 Add employee 真实表单（原站无此弹窗，live 确认点 Add employee 后发生什么）
- H-10 Filters 点后行为
- H-16 "Board team" 下拉菜单内容（原站 JS 显示无菜单）
- H-2 Edit / Delete / More actions 点后行为与 More 菜单 4 项点后行为（原站 JS 显示三者均 inert）
- H-12 Breakdown 部门行是否可点 / H-17 Recent hires 卡片是否可点
- H-21 漏斗条入场动画形态

## 五、方法与局限

- 提取方法：python 从 orig HTML 提取可见文字、aria-label、`<select>`/`<option>`、按钮文本、style 里的高度/dasharray/颜色 token，与复刻 `page.tsx` 里的写死数据逐项比对。AI 热力图 266/266、Agents 柱子 30/30、Medical 365 环（抽查 Jul 10 [21,62,77]）、HR 员工 10/10 均为脚本比对结果，非目测。
- 未做的事：未改代码、未 push、未 build；未做 live browser 核验；未做像素级截图量测（字体/颜色/间距/布局的像素级差异不在本次范围，除 SSR 里能直接读到的 class 差异外）。
- 共享组件（TemplateShell / DashboardSidebar / PatientInfoCard / ImportantAlertsCard / WeekRangePill / NotificationBell）只核对了本页用法与关键文案，未逐行深审；外壳类差距（如"全部模板"入口、Settings 死链）以现状记录为准，Settings 本次核实为死链（与原站 `href="#"` 一致，无差距）。

## 需 live 核验汇总（106 项，各模板数相加；共享项去重后约 98 项）

以下均因原站行为不在 SSR 里（菜单关闭态不渲染 / BAILOUT 客户端渲染），不得凭记忆或推测下结论，须用 live browser 打开原站逐项点开核对。

- dashboard（10 项）：月/年图表真值、图表 hover/tooltip、Activity 切换是否重算网格、Filters 点后行为、Create ticket 弹窗字段与流程、More actions 菜单内容、空态文案、有无 toast、“Board team”下拉菜单项、Delete 是否确认；另有通知条目内容、用户/团队菜单内容、hover 变色逐项点检。
- finance（13 项）：四处周期菜单选项、Sankey 真实拆分、Donut 各分类真值、Filters 点后行为、Add/Edit 弹窗真实字段、More 菜单真实内容、周期触发器点开形态（菜单 vs 列表）、Donut 有无图例行、气泡真实位置与 risk 值、Portfolio 切换后数值是否变化、Sankey 与 Donut 孰真、空态、有无 toast、金额桶语义；另有通知条目、用户/团队菜单内容。
- calendar（8 项）：中心按钮点开什么、chip 点开的详情内容与操作、New event 新建表单字段与布局、Inbox 内容与条数、chip 按空格是否滚动页面、弹窗色点真实颜色、新建默认日期；另有通知条目、用户/团队菜单内容。
- ai-chat（19 项）：头像菜单项目；四个下拉与 More 菜单的真实项目；Main 点后行为；面包屑按钮去向；Undo 后界面；语音行为；附件菜单项；Share 行为；57% 走完后的行为；折叠后侧栏形态；⌘L 面板内容；Browser tab 真实内容；终端真实内容；菜单 Esc 行为；拖拽范围与 Expand 宽度；Enter/Shift+Enter 行为；另有 Settings 点后行为（见 SH-5）。
- multi-agent-chat（14 项）：Preview voice 解除禁用的条件；跟进回复的真实文案与延迟；其余 6 个 agent 的首轮对话；群聊空态与组名规则；Marketplace 真实名单与工具；Create 菜单原文；Conversation options 菜单原文；Add 菜单原文；Permission 菜单原文；头像像素与 morph；表情环拖拽；颜色与动画时序。
- chat-starter（11 项）：未配置态首屏是否真有 setup 卡；免费页是否弹 Pro 售卖卡；附件按钮点后行为；demo 入口是否存在；More 菜单原文；Share 行为；账号菜单原文；线程行操作；聊中头栏标题；消息操作；Thinking 指示器。
- ai-profile（5 项）：Share 点后行为；Edit 形态；Agents 其他四个月柱子数据与切换行为；Tokens 曲线真实形状；Agents 柱子入场动画。
- medical-profile（11 项）：More actions 菜单内容；View chart / Edit patient 点后行为；Filters 点后行为；File a report 真实表单字段与关闭方式；Steps 每日柱值与周切换范围；睡眠环 hover 行为；非 Jul 10 日期活动详情绝对值；第 2–45 页患者真实行；"N selected" 选中条在原站是否存在；睡眠环段颜色；Steps tooltip 有无与文案。
- hr（7 项，2026-11-08 返工后剩余）：雷达形态 live 截图比对（Recharts vs 手绘 SVG）与 alertBelow:60 行为；Add employee 真实表单；Filters 点后行为；"Board team" 下拉菜单内容；Edit / Delete / More actions 点后行为与 More 菜单 4 项点后行为；Breakdown 部门行 / Recent hires 卡片是否可点；漏斗条入场动画形态。
- marketing（1 项）：Sessions 非 Channels 面板的真实内容。
- project-board（1 项）：DS-38 详情面板精确值（Token 图表、评论、资源链接）。
- ai-image-generation（4 项）：模型菜单真实选项与努力程度滑杆；发消息生成流程的时序与动画；其余菜单真实内容；设置弹窗内容。

## 截图路径（供修复轮并排比对）

- 原站 live 截图：本轮无 live browser，未拍摄。修复轮须用 live browser 按“需 live 核验汇总”逐项打开原站拍摄，存放到 `~/workspace/boardui-audit/shots-orig/<模板>/`，文件名注明状态（如 `model-menu-open-1440.png`、`generating-4s-1440.png`、`settings-modal-1440.png`）。
- 复刻同状态截图：本轮未拍摄（未 build）。修复轮在本地 build + HTTP 服务 + Playwright 拍摄，存放到 `~/workspace/boardui-audit/shots-replica/<模板>/`，与原站同状态截图并排比对。
- 原站 SSR HTML（本轮证据）：`~/workspace/boardui-audit/orig/<模板>.html`（12 个文件齐全）。
- 分组报告原文：`~/workspace/boardui-audit/gaps-dashboard-finance-calendar.md`、`~/workspace/boardui-audit/gaps-ai-chat-mac-chatstarter.md`、`~/workspace/boardui-audit/gaps-ai-profile-medical-hr.md`；中间提取文本在 `~/workspace/boardui-audit/work/`。

## 方法与局限

- 提取方法：python 从原站 HTML 提取可见文字、aria-label、`<select>`/`<option>`、按钮文本、style 里的高度/dasharray/颜色 token，与复刻代码里的写死数据逐项比对；热力图等数值均为脚本比对结果，非目测。
- 前人差距笔记（`audit/*-gaps.md`）只作起点，每条都重新核实；核实后推翻的结论已写入各节“前人笔记纠正”/“前人纠正”小节（finance 分页 "…"、medical 分页 "…"、HR“无原版”前提、ai-chat 代码行数等）。
- 未做的事：HR 模板已返工并 build + push（见 HR 返工结果小节），其余模板未改任何代码，未 build，未 push；未做 live browser 核验（106 项待 live）；未做像素级截图量测（字体/颜色/间距/布局的像素级差异不在本次范围，除 SSR 里能直接读到的 class 差异外）；未逐一核对图标 SVG 路径（除 chat-starter 附件图标这一处路径可辨的例外）。
- 返工中模板（marketing / project-board / ai-image-generation）以返工前状态为准，返工完成后须按本清单逐项复核并更新本文件。
