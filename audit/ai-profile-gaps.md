# AI Profile 缺口清单

- 原版来源：`tpl-pages/ai-profile.html`（BoardUI 站点 SSR 快照，含 `BAILOUT_TO_CLIENT_SIDE_RENDERING`，即部分内容只在客户端渲染，静态 HTML 里没有）+ `browser.open` 抓线上页 `https://www.boardui.com/templates/ai-profile` 交叉核对（线上抓取只返回营销文案，未返回页面 UI 文本，行为无法在线上核对）。
- 复刻来源：`app/templates/ai-profile/page.tsx` + 共用 `components/application/template-shell/template-shell.tsx`、`components/application/dashboard/dashboard-sidebar.tsx`。
- 盘点日期：2026-11-07。只盘点、不修。

## 元素总数：310 个

原版静态 HTML 中可交互元素共 310 个：外壳（侧栏桌面版 + 移动端抽屉，两套 DOM）37 个；页面内容 273 个（Share、Edit 各 1，Weekly/Monthly/Yearly 单选 3 个，热力图格子 266 个，Agents 月份 Previous/Next 2 个）。

---

## A. 可点击元素

### A1. Activity 周期单选：Weekly / Monthly / Yearly —— 有缺口（高）

- 位置与标识：Activity 卡片右上角 radiogroup，三个 `role="radio"` 按钮，文字 Weekly / Monthly / Yearly。
- 原版行为：快照中 **Weekly 为 `aria-checked="true"`（默认选中）**，Monthly、Yearly 为 false；且 Weekly 选中状态下热力图仍渲染**全部 266 个格子**。即原版的周期切换不把格子切成 7/35 个（或至少 Weekly 下仍是全年图）。
- 复刻现状：`useState("yearly")` 默认 Yearly；`range === "weekly"` 时只取 `HEATMAP.slice(-7)`（7 格），monthly 取后 35 格。
- 差在哪里：① 默认选中项不同（原版 Weekly，复刻 Yearly）；② 切换行为与原版快照矛盾——原版 Weekly 下仍是 266 格，复刻 Weekly 下只剩 7 格。Weekly/Monthly 点完到底该发生什么（改聚合方式？改图表范围？），静态 HTML 看不出，需实测确认。

### A2. Share 按钮 —— 行为待实测确认

- 位置与标识：页面头部操作区，文字 Share（无 aria-label）。
- 原版行为：静态 HTML 中无任何分享弹窗/菜单 DOM，点完发生什么无法推断。
- 复刻现状：点击复制当前 URL，按钮文字变 "Copied" 2 秒。
- 差在哪里：复制链接只是复刻的猜测实现，原版可能是打开分享菜单、复制资料链接或其他行为，需实测确认。

### A3. Edit 按钮 —— 行为待实测确认

- 位置与标识：页面头部操作区，文字 Edit（无 aria-label），与 Share 并排。
- 原版行为：静态 HTML 全文无 Save/Cancel/编辑表单 DOM（全文搜 "Save" 0 次），点 Edit 后是打开弹窗、进内联编辑还是跳页，无法推断。
- 复刻现状：点击进内联编辑态（名字/ handle 变输入框，头部变 Cancel + Save，保存后回写）。
- 差在哪里：内联编辑是复刻自创的交互形态，原版形态待实测确认；若原版是弹窗编辑，复刻的形态即为缺口。

### A4. Agents 月份切换 Previous / Next —— 数据存疑，待实测确认

- 位置与标识：Agents 卡片右上角月份切换器，两个图标按钮 `aria-label="Previous"` / `"Next"`，中间显示 December。
- 原版行为：静态 HTML 只有 December 一个月的数据（30 根柱子高度已核对，与复刻 `AGENT_BARS` 逐根一致）；点 Previous/Next 后其他月份的数据、是否真实存在，静态 HTML 里没有。
- 复刻现状：月份在 October～February 五个月间循环，柱子数据按"轮转 7 位"生成（`barSet` 把原数组移位）。
- 差在哪里：其他月份的柱子高度是复刻编造的移位数据，不是原版真实数据；原版是否真有 Oct/Nov/Jan/Feb 数据、切换时柱子如何变化，需实测确认。

### A5. Agents 的 Today 按钮 —— 行为待实测确认（小）

- 位置与标识：Agents 卡片底部右侧，文字 Today。
- 原版行为：静态 HTML 只有文字 "Today"，点完是否回到 December、是否重置其他状态，无法推断。
- 复刻现状：点击把月份重置为 December。
- 差在哪里：复刻的实现合理但未经证实，需实测确认。

### A6. 热力图格子（266 个）—— 点击无缺口

- 位置与标识：Activity 热力图全部格子，`aria-label` 如 "23 contributions on Jan 20" / "No contributions on Jan 1"。
- 原版行为：格子是 `tabindex="-1"` 的 button，静态 HTML 中无点击后展开/弹窗的 DOM；点击大概率无动作（仅 hover 有反馈，见 B1）。
- 复刻现状：格子同样无 onClick；266 个格子的日期、数量、tier 经脚本逐项比对，与原版 **266/266 全对**。
- 差在哪里：无。抽查了 Jan 20（23，tier 4）、Feb 22（38，tier 5）、Dec 31（6，tier 2）等，日期/数量/tier 全部一致。

### A7. 外壳：侧栏导航 / Quick Search / 折叠 / 主题切换 / Support / Settings / Board team / 头像菜单 —— 无缺口

- 抽查元素：Quick Search（⌘L，复刻含 ⌘L 快捷键监听）、Collapse sidebar（复刻 Collapse/Expand）、Use light mode / Use dark mode（复刻 theme-toggle 含同样 aria-label）、9 个模板导航链接（含 Home 徽章 152）、Support（原版 `href="#"`，复刻同样是 `#` 死链，行为一致）、Settings（见 A8）、Board team 菜单（复刻 `dashboard-team-menu.tsx` 有真实下拉）、头像菜单 Mertcan Esmergul（复刻 `dashboard-user-menu.tsx` 有真实菜单）、移动端 Open/Close navigation、导航搜索框（复刻含过滤逻辑 + Clear 按钮）。
- 差在哪里：无。以上元素在复刻里均存在且有 handler。

### A8. 外壳 Settings —— 行为差异，待确认（小）

- 位置与标识：侧栏底部 Settings 行。
- 原版行为：原版是 `href="#"` 的链接，静态 HTML 中无设置弹窗 DOM。
- 复刻现状：点击打开 SettingsModal 设置弹窗。
- 差在哪里：复刻的弹窗是自加行为，原版点 Settings 在模板演示页可能什么都不做；是否算缺口需实测确认（倾向于复刻的增强行为与原版不一致）。

### A9. 外壳多出的导航（复刻自加，非原版内容）—— 有缺口（静态结构差异）

- 位置与标识：TemplateShell 的面包屑（Board team / Mertcan / Profile）、页面大标题、"全部模板"按钮、侧栏首行"全部模板"导航项。
- 原版行为：原版 AI Profile 页无面包屑、无"全部模板"入口（原版文本节点中没有这些文字）。
- 复刻现状：全部存在（代码注释承认是为方便跳转而加）。
- 差在哪里：复刻比原版多出一整行导航 chrome；按 1:1 口径算多余内容。

---

## B. 其他交互（hover / 拖拽 / 键盘 / 输入 / 滚动 / 动画）

### B1. 热力图格子 hover —— 有缺口

- 位置与标识：266 个热力图格子。
- 原版行为：格子无 `title` 属性，静态 HTML 中无 tooltip DOM（全文 `role="tooltip"` 0 处、`data-state` 0 处）；hover 后到底显示什么（原生 tooltip？跟随浮层？底部状态行？）静态 HTML 看不出，需实测确认。
- 复刻现状：格子有 `title`（原生 tooltip）+ hover 时底部状态行显示该日数据。
- 差在哪里：① 复刻底部状态行的两段文字在原版中**根本不存在**（"Hover a day to see its contributions." 与 "N contributions in the last year" 在原版全文出现 0 次），是复刻自加的文字；② 原版 hover 的真实形态待实测，复刻的形态未经证实。

### B2. 热力图格子入场动画 —— 有缺口（小）

- 位置与标识：266 个热力图格子。
- 原版行为：只有 tier > 0 的 200 个格子带 `animate-cell-pop`，tier 0 的 66 个格子无动画；delay 为 66～778ms 的伪随机值。
- 复刻现状：全部 266 个格子都带 `animate-cell-pop`，delay 为 `(i % 13) * 53ms`（0～636ms 阶梯值）。
- 差在哪里：tier 0 格子在原版不做动画，复刻做了；delay 数值规律也不同。

### B3. Agents 柱子 hover —— 有缺口（小）

- 位置与标识：Agents 30 根柱子。
- 原版行为：静态 HTML 中柱子 hover 后的反馈无法确认（柱子为 div，无可供推断的 tooltip DOM）。
- 复刻现状：hover 时底部文案变 "December 12 · 118 agents"，柱子有 `title`。
- 差在哪里：复刻底部常驻文案 "December · 30 days · hover a bar for its value" 中的 "30 days" / "hover a bar" 在原版全文出现 0 次，是自加文字；hover 真实形态待实测。

### B4. Tokens 趋势图 hover —— 有缺口

- 位置与标识：Tokens 卡片趋势图区（高 200px）。
- 原版行为：原版图是 **Recharts** 客户端渲染（`recharts-responsive-container`，SSR 只剩空容器），每日数值不在静态 HTML 里；hover 读数形态无法从快照得知。
- 复刻现状：手写 SVG 折线 + 面积填充，hover 显示圆点 + 底部中间读数。
- 差在哪里：① 曲线本身是复刻用正弦函数合成的 60 点数据，原版每日真实数值无法从快照恢复，曲线形状未经证实；② 底部中间文案 "Hover the chart for a day's tokens" 在原版全文出现 0 次，是自加文字（原版底部只有 "Jun 14" 与 "Today" 两端）。

### B5. 键盘操作 —— 有差异（小）

- 位置与标识：热力图格子。
- 原版行为：格子 `tabindex="-1"`，键盘 Tab 到不了。
- 复刻现状：格子可聚焦（focus 时显示对应日期数据，有 focus-visible 描边）。
- 差在哪里：复刻把原版明确不可聚焦的格子做成了可聚焦，键盘行为与原版不同（方向是更无障碍，但不是 1:1）。

### B6. 拖拽 / 输入联想 / 滚动联动 —— 无

- 原版静态 HTML 中无 `draggable`、无输入联想、无滚动联动线索；复刻同样没有。无缺口。

### B7. Agents 柱子入场动画 —— 未核对

- 复刻柱子有 `animate-bar-rise` + 每根 22ms  stagger；原版柱子动画静态 HTML 看不出，需实测截图/录屏比对，暂不判缺口。

---

## C. 静态内容（文字 / 数字 / 图片 / 图标 / 颜色 / 字体 / 间距 / 布局）

### C1. 封面图缺失 —— 有缺口

- 位置与标识：页面顶部封面卡片。
- 原版：真实照片 `<img src="/templates/ai-profile-cover.png" class="size-full object-cover object-[50%_45%]">`。
- 复刻现状：CSS 渐变（accent-500→600→800）+ 三个白色半透明圆 + 左上角徽章文字 "BoardUI · AI Profile"。
- 差在哪里：照片被渐变替代，且徽章文字 "BoardUI · AI Profile" 在原版中不存在，是自加文字。代码注释称原版封面是 Pro 内容故用渐变替代——原因成立，但按三类盘点口径仍算静态缺口。

### C2. 复刻自加的文字（原版无）—— 有缺口

以下文字在原版全文出现 0 次，复刻里有：

- 热力图底部："Hover a day to see its contributions." / "N contributions in the last year"（B1）。
- Agents 底部："December · 30 days · hover a bar for its value"（B3）。
- Tokens 底部中间："Hover the chart for a day's tokens" / hover 读数（B4）。
- 封面徽章："BoardUI · AI Profile"（C1）。
- 外壳：面包屑 "Board team / Mertcan / Profile"、"全部模板"（A9）。

### C3. 文字与数字（已核对无误）—— 无缺口

抽查并逐项对上的内容：Mertcan Esmergül、@sitenley、PRO、Contributions this year、$0、+14.8%、9B Lifetime tokens、562.7M Peak tokens、12h 54m Longest task、62 days Top streak、Activity、Weekly/Monthly/Yearly、Agents、32 agents、December、Tokens、667.7M tokens、+9.4%、Jun 14、Today；热力图 266 格日期/数量/tier 全对（脚本比对 0 差异）；Agents 30 根柱子高度全对（73, 141, 118, 4, 118, 18, 4, 4, 4, 95, 4, 158, 78, 45, 4, 45, 135, 88, 4, 4, 107, 21, 45, 105, 87, 66, 19, 128, 98, 34）。

### C4. Tokens 曲线形状 —— 有缺口（数据无法恢复）

- 原版：Recharts 客户端渲染，每日数值不在静态 HTML 中，曲线真实形状无法从快照得知。
- 复刻现状：正弦合成曲线（60 点，`9 + 3.5*sin(i/4.5) + ...`），总量缩放到 667.7M。
- 差在哪里：曲线形状是编造的，需线上实测截图比对才能判定差距。

### C5. 热力图月份标签 —— 无缺口

- 原版热力图区无任何月份文字标签（January～November 出现 0 次）；复刻同样无月份标签。一致。

### C6. 字体 / 颜色 / 间距 / 布局 —— 未逐项核对

- 本次只核对了 DOM 文字、数值与结构，未做像素级量测（原版为客户端渲染页，无本地可量测的渲染稿）。封面高度、头像尺寸、卡片圆角等数值未逐项比对，需截图量测轮次另行核对，暂不判缺口。

---

## 缺口汇总（AI Profile）

| # | 缺口 | 严重度 |
|---|------|--------|
| A1 | 周期单选默认项与切换行为与原版矛盾（Weekly 默认 + 266 格 vs 复刻 Yearly 默认 + 切片） | 高 |
| A2 | Share 行为待实测（复刻猜测为复制链接） | 待确认 |
| A3 | Edit 形态待实测（复刻自创内联编辑，原版无表单 DOM） | 待确认 |
| A4 | Previous/Next 其他月份柱子数据为编造移位 | 待确认 |
| A5 | Today 按钮行为待实测 | 小 |
| A8 | Settings 复刻开弹窗，原版为 `#` 死链 | 小 |
| A9 | 面包屑/大标题/"全部模板"为复刻自加 | 中 |
| B1 | 热力图 hover 形态未证实 + 底部状态行文字自加 | 中 |
| B2 | 热力图入场动画：tier 0 格子不应有动画；delay 规律不同 | 小 |
| B3 | Agents 底部 "30 days · hover a bar" 文字自加 | 小 |
| B4 | Tokens 图为 Recharts，复刻 SVG 正弦曲线为编造；底部中间文案自加 | 中 |
| B5 | 热力图格子原版 tabindex=-1，复刻可聚焦 | 小 |
| C1 | 封面照片被渐变替代 + 徽章文字自加 | 中 |
| C2 | 多处自加文字（见清单） | 中 |
| C4 | Tokens 曲线形状无法从快照证实 | 待确认 |

---

## 修复结论（2026-11-07 本轮修复）

### 已修

- **A1 周期单选**：默认改为 Weekly；三个选项切换只改选中态，热力图恒为 266 格全年图，不再切片成 7/35 格。Weekly/Monthly 在原版到底改变什么（聚合方式？范围？）静态 HTML 看不出，仍待实测。
- **C1 封面照片**：原版封面图可下载——`curl https://www.boardui.com/templates/ai-profile-cover.png` 返回 HTTP 200、80,403 字节、1024×248（内容实为 JPEG 数据，沿用原版 .png 路径），已存为 `public/templates/ai-profile-cover.png`，页面改用 `<img src="/templates/ai-profile-cover.png" class="size-full object-cover object-[50%_45%]">`。渐变替代与 "BoardUI · AI Profile" 徽章文字一并删除。
- **B1 热力图底部状态行**：整行删除（"Hover a day to see its contributions." / "N contributions in the last year" 均为自加文字，原版无）。格子同步改回原版形态：`tabindex="-1"`、无 `title`、无 hover/focus 回调。
- **B2 热力图入场动画**：`animate-cell-pop` 只加在 tier > 0 的 200 个格子上；delay 改为 66～778ms 区间内的确定性伪随机值。原版每格精确 delay 值无法从快照恢复，本轮数值仍是近似，未逐格证实。
- **B3/Agents 底部**：整段底部替换为原版快照原文：左侧 `<p>Jun 14</p>`、右侧 `<p>Today</p>` 的纯文本行（`px-1.5` 小字 tertiary）。"December · 30 days · hover a bar" 自加文案、柱子 hover 读数、`title`/无障碍 label 全部删除。附带纠正：快照显示 Agents 底部的 "Today" 是普通 `<p>` 文本，**不是按钮**，清单 A5 把它当按钮是误判；复刻原有的 Today 重置月份按钮随之删除。月份 Previous/Next 切换与移位数据未动（其他月份真实数据待实测，见 A4）。
- **B4/C4 Tokens 图**：底部中间读数与 hover 圆点/回调全部删除，底部只剩 "Jun 14" / "Today" 两端，与原版静态 DOM 一致。曲线按原版可见数值重画：60 点、Jun 14 → Today、总量缩放到 667.7M、整体呈上升趋势（呼应 +9.4%），去掉了原先规律明显的正弦合成形。**形状仍无法证实**：原版是 Recharts 客户端渲染，每日数值不在快照里，当前曲线只是"上升趋势"的示意，需线上实测截图比对后才能定稿。
- **构建验证**：`npm run build` 通过（含 `/templates/ai-profile`）；`npx tsc --noEmit` 干净。构建中途两次因其他并行组正在跑构建而被锁挡住（"Another next build process is already running"），等待后重试通过。

### 未修（修不了 / 不在本轮范围）

- **A9 面包屑 / "全部模板" / 页面大标题**：这些全部渲染在共享的 `components/application/template-shell/template-shell.tsx` 与 `components/application/dashboard/dashboard-sidebar.tsx` 里，不在本模板页文件内。按任务铁律（不改共享组件）未动。顶栏 "全部模板" 按钮与侧栏首行入口已按任务要求保留。需外壳组在 TemplateShell 侧去掉面包屑与大标题，或给页面留隐藏开关。
- **A2 Share / A3 Edit / A4 其他月份柱子 / A5 Today**：行为与数据无法从静态快照证实，本轮未改（Share 仍为复制链接、Edit 仍为内联编辑、月份切换仍为移位数据），待实测后再定。

## 补记（2026-11-07 协调器复核后补修）
- A9 面包屑 / 大标题：已修。TemplateShell 的 `hideBreadcrumb` / `hideHeading` prop 之前只声明未生效，现已接上条件渲染；AI Profile 页已传 `hideBreadcrumb` `hideHeading`，面包屑与大标题不再渲染。顶栏"全部模板"按钮与侧栏首行入口保留（用户要求的模板切换入口）。此前结论称"未动"已过时，以本次补记为准。
