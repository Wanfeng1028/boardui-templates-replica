# AI Image Generation 缺口清单

- 原版来源：`tpl-pages/ai-image-generation.html`（BoardUI 站点 SSR 快照）+ `browser.open` 抓线上页 `https://www.boardui.com/templates/ai-image-generation` 交叉核对（线上抓取只返回 "57%" 一行文本，与快照的生成中状态一致）。
- 复刻来源：`app/templates/ai-image-generation/page.tsx`（609 行）+ 共享组件 `components/application/dashboard/dashboard-sidebar.tsx`、`components/application/agent-chat/agent-composer.tsx`、`components/application/composer-loader/composer-loader.tsx`、`components/base/tabs/tabs`。
- 盘点日期：2026-11-07。只盘点、不修。

## 元素总数：107 个

原版 SSR 中可交互元素原始 197 个，含移动端/桌面端两套重复渲染（侧栏、图库面板各渲染两次），去重后逻辑元素 107 个：左侧栏 27 个（与 AI Chat 同一套 agent 侧栏，惟当前线程是 "image generation"）、图库面板头 6 个（Close gallery、Gallery、Styles、New generation、Expand panel、Toggle panel）、顶部栏 3 个（Open navigation、Close navigation、Open gallery）、面包屑 1 个（vibl coding project）、聊天头栏 2 个（Share chat、More options）、输入框区 5 个（Add attachment、输入框、Fable 5、Voice input、Send message）、状态行 3 个（Main、project-sea、Agent）、图库卡片 60 个（20 张图 × Enlarge / Download / More actions 各 1 个）。

另有 7 处内容不在静态 DOM 里（菜单关闭态不渲染）：头像菜单项、Add attachment 菜单项、Fable 5 模型下拉选项、Main / project-sea / Agent 三个下拉的内容、More options 菜单项、More actions 菜单项、Styles tab 内容——内容与行为一律标"待实测确认"，不得编造。

快照状态说明：原版页面定格在"生成中 57%"：只有 1 条用户 prompt 气泡（Messi 插画），**没有任何生成结果图、没有任何反馈操作（Like / Dislike / Regenerate 之类）**，Styles 面板内容未渲染。复刻里所有"生成完成"状态下的东西（结果框、反馈行、灯箱、Styles 选项）都无原版对照。

---

## A. 可点击元素

### A1. 左侧栏整体：原版是 agent 侧栏，复刻是模板导航侧栏 —— 有缺口（最严重，与 AI Chat 相同）

- 位置与标识：页面最左侧，宽 260px。原版与 AI Chat 是同一套 agent 侧栏（头像菜单、New agent / Automations / Customize、Repositories 分组、主题切换、Support / Settings、Board team 卡片 + Upgrade），惟一区别是当前线程是 "image generation"（`aria-current="page"` 在此条上）。
- 原版行为：见 ai-chat-gaps.md A1–A9（同一侧栏）。
- 复刻现状：`DashboardSidebar`（`DASHBOARD_NAV`，`selected="ai-image"`），模板导航，与 AI Chat 复刻共用。
- 差在哪里：与 AI Chat 完全相同——侧栏换错了东西；New agent / Automations / Customize 缺失；Repositories 分组与 11 条线程缺失（线程只在 2xl rail 里平铺，本页复刻**没有** history rail，线程在 AI Image Generation 复刻里根本无处可去）；时间徽标两处错（"image generation" 原版 "now" vs 复刻无此徽标可对；"cannon physics tuning" "1w"、"sprite sheet cleanup" "2w" 同 AI Chat 的 7d/14d 问题）；Settings 打开自造弹窗；Board team 菜单 10 项自造、Upgrade 缺失；搜索只筛导航而非 ⌘L 面板；主题切换分段器无缺口。

### A2. 顶部栏与面包屑 —— 有缺口（与 AI Chat 相同，标题不同）

- 位置与标识：原版同样两个头栏——①移动顶栏（`xl:hidden`）：Open navigation + 标题 "Image generation" + 右侧 "Open gallery" 按钮；②桌面面包屑头：`nav aria-label="Chat location"`（"vibl coding project" 按钮 > `aria-current="page"` 的 "image generation"）+ Share chat / More options。复刻只有一个 h-12 带底边框的头栏：汉堡 + 标题 "Image generation" + 副标题 "vibl coding project / image generation" + Share + Open gallery（`xl:hidden`）+ New generation。
- 原版行为：同 AI Chat。
- 复刻现状：面包屑被压成静态副标题 span；"Open gallery" 按钮在头栏右簇（原版只在移动顶栏）；多出一个 "New generation" 按钮（原版聊天头栏没有，见 A8）。
- 差在哪里：面包屑丢失（不可点、无 nav 语义）；头栏结构与 AI Chat 同款问题；多出的 New generation 见 A8。

### A3. Share chat / More options —— 有，行为自造，待实测确认

- 位置与标识：面包屑头右侧两个 icon-only 按钮；复刻头栏右侧同名按钮存在。
- 原版行为：未知（菜单/弹窗均不在 SSR 里，待实测确认）。
- 复刻现状：Share 复制的是 Messi prompt 文本（`copyText(MESSI_PROMPT, "Prompt copied to clipboard.")`），并显示 notice；More options 未在本页复刻头栏实现（复刻头栏只有 Share / Open gallery / New generation，没有 More options 按钮——原版有）。
- 差在哪里：Share 的行为是复刻猜的（复制 prompt 而非分享对话）；More options 按钮在复刻头栏**缺失**。

### A4. 输入框区：Add attachment / 输入框 / Fable 5 / Voice input / Send —— 有缺口（与 AI Chat 相同）

- 位置与标识：原版 composer 与 AI Chat 同款（Add attachment、`type="text"` 输入框 "Ask me anything"、pill 内 Fable 5 按钮、Voice input、`Send message`）；复刻用同一 `AgentComposer` 组件。
- 原版行为：同 ai-chat-gaps.md A13–A17。
- 复刻现状：Add attachment 死按钮（无 onClick）；pill 内模型名是静态 span（不可点），模型菜单被挪到输入框上方（Fable 5 / Fable 4 / Fable 3 Mini，选项未经核对）；Voice input 完全缺失；Send 空输入时 disabled；输入框无原版的未聚焦文字淡出 mask；输入框包在 form 里（原版全页 0 个 form，Enter 行为待实测）。
- 差在哪里：与 AI Chat 完全相同。另本页复刻在模型菜单旁多了一个 "Style: X ×" 清除 pill（见 B5）。

### A5. 状态行 Main / project-sea / Agent / 57% —— 有缺口（与 AI Chat 相同）

- 位置与标识：原版在输入框 pill 下方的 `h-[26px]` 状态行（Main 按钮、project-sea 下拉、Agent 下拉、圆环 + "57%" 胶囊）；复刻把模型行放在消息区上方、把线性进度条放在生成框内。
- 原版行为：同 ai-chat-gaps.md A19–A20。
- 复刻现状：模型行在输入框上方（模型菜单 + "Style: X ×" + "Prompt the image, then Generate runs locally."）；生成框内是 "Agent" 静态文本 + 线性进度条 + 百分比；Main / project-sea 是静态 span（本页复刻的生成框内有 Main / project-sea 静态 pill，与 AI Chat 复刻同款）；Agent 无下拉。
- 差在哪里：与 AI Chat 相同——位置错、按钮变静态文字、圆环变横条、"Done" 走法自造。

### A6. 图库面板头：Gallery / Styles 双 pill —— 基本一致，一处语义差

- 位置与标识：原版面板头是 `role="group" aria-label="Panel view"` 的 pill 组：Gallery（`aria-pressed="true"`，蓝色选中态）/ Styles（`aria-pressed="false"`），与 AI Chat 代码面板同款 pill；复刻用 `Tabs` 组件（`TabList aria-label="Image generation sections"`，`Tab id="gallery" / "styles"`）。
- 原版行为：点 Gallery / Styles 切换面板视图（Styles 内容不在 SSR 里，待实测确认）。
- 复刻现状：两 tab 可切换；Styles 面板是自造的 8 个 style chip（见 B5）。
- 差在哪里：pill（`role="group"` + `aria-pressed`）被换成 tab（`role="tablist"` + `aria-selected`），语义不同；外观近似。另复刻在 pill 组上方多加了一整行头栏（"Gallery" 标题 + 图标 + "N images" 计数徽标 + New / Expand / Close 图标），原版面板头只有 pill 组 + 三个图标按钮，没有标题行、没有计数（见 A7）。

### A7. 图库面板头：New generation / Expand panel / Toggle panel / Close gallery —— 有缺口

- 位置与标识：原版面板头 pill 组右侧三个图标按钮：New generation（图片 + 加号图标，`rounded-md p-0.5`，hover 背景）、Expand panel（对角展开图标）、Toggle panel（分栏图标）；移动端抽屉头另有 "Gallery" 标题 + Close gallery 按钮（与 AI Chat 的 "Code" 抽屉头同款结构）。复刻面板头是独立标题行：Gallery 标题 + 计数徽标 + New generation（`RiAddLine` + 号）+ Expand panel + Close gallery。
- 原版行为：New generation 开始一次新生成（具体行为待实测确认）；Expand panel 放大面板（放大后宽度待实测）；Toggle panel 收起/展开面板；Close gallery 关闭抽屉/面板。
- 复刻现状：
  - New generation：只做 `setGalleryOpen(true)`（打开面板），并不开始新生成——点按后无可见变化（面板已开时）。
  - Expand panel：400px ↔ 560px 切换；原版展开后宽度待实测。
  - **Toggle panel：复刻缺失**（面板头无此按钮）。
  - Close gallery：有，可关闭。
  - 另复刻在**聊天头栏**多加了一个 New generation 按钮（原版聊天头栏没有）。
- 差在哪里：Toggle panel 缺失；New generation 是空操作（只开面板）；标题行与计数徽标是复刻多加的结构。

### A8. 图库卡片 Enlarge —— 有缺口（形态与行为）

- 位置与标识：原版每张图的 Enlarge 是**整图按钮**（`absolute inset-0`，`cursor-zoom-in`，`aria-expanded="false"`，无可见文字，hover 时图片 `scale-[1.03]`）；复刻每张图的整图也是 Enlarge 按钮（`aria-label="Enlarge …"`），外观近似。
- 原版行为：点整图放大（`aria-expanded="false"` 提示是展开态；放大后是灯箱弹窗还是原地展开，SSR 无从得知，待实测确认）。
- 复刻现状：点整图打开自造 lightbox 对话框（`role="dialog" aria-modal="true"`，遮罩关闭、标题、Like / Dislike / Download / Copy prompt）；另在 hover 遮罩右下角多加了一个全屏小图标按钮（原版无此图标）。
- 差在哪里：放大后的形态是复刻猜的（灯箱），原版是否弹窗、弹窗里有什么，待实测确认；多出的右下角全屏小图标原版没有。

### A9. 图库卡片 Download —— 有缺口（位置与可见性）

- 位置与标识：原版在 hover 遮罩内右上角：小按钮（`rounded-md bg-neutral-950/45 p-1 backdrop-blur-sm`，白色下载图标 size-3.5），平时**不可见**（遮罩 `opacity-0`，hover 才 `opacity-100`，200ms）；复刻在图下方 caption 区常驻显示（size-7 圆形按钮，灰色图标）。
- 原版行为：点按下载原图（下载文件名、格式，待实测确认）。
- 复刻现状：按钮常驻可见，点按下载替身图文件（文件名取 prompt 转 kebab-case + `.webp`）。
- 差在哪里：位置错（遮罩内右上 vs 图下方）；可见性错（hover 才出现 vs 常驻）；下载的文件是错的（替身图而非原图）。

### A10. 图库卡片 More actions —— 有缺口（位置与菜单内容）

- 位置与标识：原版在 hover 遮罩内右上角，Download 旁边：小按钮（同款 `bg-neutral-950/45 backdrop-blur-sm`，白色竖三点图标 size-3.5），平时不可见，hover 才出现；复刻在图下方 caption 区常驻显示（size-7 圆形按钮）。
- 原版行为：点开更多操作菜单（菜单项不在 SSR 里，待实测确认）。
- 复刻现状：菜单四项——Copy prompt、Like、Dislike、Remove（删除后显示 "Removed from the gallery."）。
- 差在哪里：位置与可见性同 A9；菜单四项全是复刻编造，原版菜单的真实项目待实测确认。

### A11. 图库面板：桌面宽 410px / 移动抽屉 —— 有小差

- 位置与标识：原版桌面图库面板是固定宽 410px 的 aside（`style="width:410px;min-width:410px;max-width:410px"`，`hidden xl:flex`），与 AI Chat 代码面板同宽；移动端抽屉 `w-[min(410px,calc(100%_-_12px))]`；两者之间同样有一条 `role="separator" aria-label="Resize panels"` 拖拽条（带 hover 才出现的三竖线抓手）。
- 原版行为：同 AI Chat 面板。
- 复刻现状：面板宽 400px（Expand 后 560px），移动端 `w-[min(480px,92vw)]`；拖拽手柄是 button（`aria-label` 缺失——复刻图库面板**没有**拖拽手柄，面板宽度不可拖）。
- 差在哪里：默认宽 400 vs 410；移动抽屉 480 vs 410；**图库面板完全不可拖拽**（原版有 separator 拖拽条）。

---

## B. 其他交互

### B1. Hover 才出现的东西 —— 有缺口

- 原版 hover 行为（SSR class 可证）：
  - 每张图：图片 `group-hover:scale-[1.03]`（300ms ease-out）。
  - 每张图：整图遮罩 `opacity-0 → group-hover:opacity-100`（200ms ease-out）：上下渐变黑纱（`bg-linear-to-b from-neutral-950/40 via-transparent to-neutral-950/55`）+ 右上角 Download / More actions 两个小按钮 + 底部白色 caption（caption 在遮罩内，随遮罩一起出现）。
  - 侧栏行、Share/More 图标、pill hover 背景、拖拽抓手 hover 出现：同 AI Chat。
  - 用户 prompt 气泡：无 hover 操作。
- 复刻现状：
  - 图片 hover 放大 `group-hover:scale-[1.03]`（300ms）**有**，与原版一致。
  - 图片 hover 右下角出现一个全屏小图标（`opacity-0 group-hover:opacity-100`）——原版无此图标。
  - Download / More actions 常驻显示在图下方，不随 hover 出现；无黑纱遮罩；caption 常驻图下方（不在遮罩内）。
- 差在哪里：黑纱遮罩 + hover 才出现的 Download/More/caption 全部缺失；多出一个原版没有的右下角全屏图标。

### B2. 图库卡片入场动画 —— 有缺口（复刻无）

- 原版：每张 figure 初始行内样式 `opacity:0; filter:blur(8px); transform:scale(0.95)`，`border-radius:10px`——卡片逐张淡入 + 去模糊 + 放大呈现（stagger 细节在客户端，SSR 只见初始态）。
- 复刻现状：卡片无任何入场动画，直接渲染。
- 差在哪里：20 张卡片的入场动画全部缺失。

### B3. 拖拽 —— 有缺口

- 原版：图库面板与聊天面之间有 `role="separator" aria-label="Resize panels"` 拖拽条（同 AI Chat，见 ai-chat-gaps.md A28）。
- 复刻现状：图库面板**没有任何**拖拽手柄，宽度只能靠 Expand 按钮在 400/560 间切换。
- 差在哪里：拖拽改宽功能整个缺失。

### B4. 键盘操作 —— 大多待实测确认

- Enter 发送 / Esc 关菜单 / ⌘L / Tab 方向键：与 AI Chat 相同（见 ai-chat-gaps.md B3）。复刻的 lightbox、模型菜单、More 菜单均无 Esc 处理；原版行为待实测确认。
- 灯箱 Esc 关闭：复刻 lightbox 无 Esc 处理；原版放大形态未知，无法对照。

### B5. Styles tab 与风格选择 —— 复刻自造，原版内容待实测确认

- 原版：Styles pill 存在，但 Styles 面板内容**完全不在 SSR 里**（未选中故未渲染）。风格选项叫什么、有几个、长什么样（文字 chip？图片缩略图？）、选后发生什么，一律待实测确认。
- 复刻现状：Styles 面板是 8 个文字 chip（Screenprint、Editorial、Linework、Duotone、Poster、Cel-shaded、Impasto、Watercolor——取自 20 条 prompt 的后缀词），点选后输入框上方出现 "Style: X ×" 清除 pill，下方提示 "Active style: X. Send a prompt to generate with it."；提交时把风格附到新生成上。
- 差在哪里：8 个选项、chip 形态、"Active style" 提示、清除 pill 全部是复刻编的，未经核对。

### B6. 生成过程与反馈操作 —— 复刻自造，原版快照中不存在

- 原版：快照定格 57%，只有 prompt 气泡 + 输入框。**没有**结果框、没有结果图、没有 Like / Dislike / Regenerate / Download / Copy prompt / Enlarge 反馈行、没有 "Generating…" 大百分比。meta 描述称模板有 "a live generation frame, feedback actions"，说明完成后可能出现，但具体形态、文案、位置一律待实测确认。
- 复刻现状：挂载后自动从 57% 走到 100%（每 240ms +9%），完成后显示自造的"生成框"（4/3 图片 + Like / Dislike / Regenerate / Download / Copy prompt / Enlarge 一行按钮 + prompt 文字）；生成中显示 "Generating…" + 大号百分比 + 模糊图（`opacity-40 blur-[2px]`）；提交新 prompt 后随机挑一张替身图当结果，并插到 gallery 顶部。
- 差在哪里：整个"生成完成"状态是复刻编的；"Generating…" 文案、大百分比数字、模糊过渡、反馈行六个按钮、随机替身结果、插队到 gallery 顶部，全部未经核对。另复刻结果图用的是 space-squid 章鱼替身图，与 Messi prompt 内容不符。

### B7. 灯箱（Enlarge 点后）—— 复刻自造，待实测确认

- 原版：Enlarge 是 `aria-expanded="false"` 的整图按钮，放大后形态未知（灯箱？原地展开？新页面？），待实测确认。
- 复刻现状：全屏 lightbox（`role="dialog"`，黑遮罩点按关闭、右上 Close viewer、标题、图片、风格徽标、Like / Dislike / Download / Copy prompt）。
- 差在哪里：灯箱结构与四项操作全是复刻猜的。

### B8. 点赞状态 —— 复刻自造，原版无此文案

- 原版：SSR 全文检索 "Like"、"Dislike"、"Liked" 均为 0 次出现；图库卡片 caption 只有 prompt 文字，无点赞状态。
- 复刻现状：卡片 caption 下方显示 "· Liked" / "· Disliked"；结果框 Like/Dislike 按钮可切换 "Liked" / "Disliked"；灯箱内同样有 Like/Dislike。
- 差在哪里：点赞状态文案与交互全是复刻加的。

### B9. 输入框联想 —— 无

- 原版与复刻均无联想 UI。此项无缺口。

### B10. 滚动联动 —— 有小差

- 原版消息区与 AI Chat 相同（底部对齐 `justify-end`，`overflow-y-auto [scrollbar-width:thin]`，`px-4 pt-4`）；图库区 `overflow-y-auto [scrollbar-width:thin]`，双列 masonry 内滚动。
- 复刻消息区居中 `max-w-3xl` + 提交后 `scrollIntoView` 到结果框；图库区是 grid（见 C5）。
- 差在哪里：消息区布局差同 AI Chat；图库滚动容器结构差（masonry 列 vs grid）。

### B11. 动画效果 —— 有缺口

- 原版（SSR 可证）：prompt 气泡入场（`opacity:0` + 内层 `blur(6px) translateY(6px)`，同 AI Chat 用户气泡）；图库卡片入场（opacity 0 / blur 8px / scale 0.95）；图片 hover 放大 300ms；遮罩淡入 200ms；仓库折叠 300ms；主题切换 200ms；抽屉滑入 300ms；玻璃加载 4.5s。
- 复刻现状：气泡无入场动画；卡片无入场动画；图片 hover 放大有；遮罩淡入无（无遮罩）；玻璃加载与原版一致；进度条 width 过渡 300ms 与图片模糊过渡是自造。
- 差在哪里：气泡与卡片两处入场动画缺失；遮罩淡入缺失。

### B12. Toggle 开关状态变化 —— 部分缺口

- 主题切换、仓库组、模型/附件/project-sea 下拉、Voice `aria-pressed`、Gallery/Styles `aria-pressed`：与 AI Chat 相同（见 ai-chat-gaps.md B7）。
- Enlarge `aria-expanded="false"`：原版 20 张图各一个；复刻整图按钮无 `aria-expanded` 属性。
- 风格 chip `aria-pressed`：复刻自造，原版 Styles 内容未知。

---

## C. 静态内容

### C1. 文字内容 —— prompt 全一致，自造文案多

抽查对照（原版 SSR 文本 vs 复刻文案），逐字一致的：

- 20 条图库 prompt 全一致：Green ape, screenprint halftone；Cloud crown, editorial portrait；Cat with a beer, bold linework；Hanok bookshop, pastel duotone；Nairobi Vibes, blackletter poster；Ronin in red, cel-shaded；Bloom swirl, impasto abstraction；Hoopoes in olive branches, gouache；Girls and blooms, painterly crop；Biker resting, watercolour manga；Beach kid, 35mm flash；Reader on pink, crayon texture；Underwater highway, flat vector；Perfume still life, grainy neon；Yellow cabs, palette-knife oil；Goldfish living room, surreal collage；Linen campaign, crimson backdrop；Helmet portraits, risograph grid；Racing suit editorial, metallic green；MASSIV3 packaging, studio mockup。
- Messi prompt 全文一致："Create a vintage editorial illustration of Lionel Messi dribbling in Argentina's home kit against a blue background."
- "Image generation"、"vibl coding project"、"Fable 5"、"Main"、"project-sea"、"Agent"、"57%"、"Ask me anything"、"Gallery"、"Styles"、"New generation"、侧栏全部文字一致（时间徽标问题同 AI Chat：1w/2w vs 7d/14d）。

复刻自造文案（原版无）：

- "N images" 计数徽标（原版面板头无计数）。
- "in gallery" / "placeholder" 标签、"Prompts 8–20 · gradient placeholders — the original images are Pro-only"、"All 20 original prompts" 列表。
- "Images are stand-ins from BoardUI's free carousel assets; prompts 8–20 use gradient placeholder tiles — the original generated images are Pro-only. The prompts themselves are the originals from the template."（免责段）。
- "Pick a style to steer the next generation. The active style is attached to your next prompt."、"Active style: X. Send a prompt to generate with it."、"Style: X ×"、"Prompt the image, then Generate runs locally."。
- "Generating…"、"Like / Dislike / Regenerate / Download / Copy prompt / Enlarge"、"Liked / Disliked"、"Removed from the gallery."、"Downloading …"、"Prompt copied to clipboard."、"Gallery is empty. Generate an image to fill it again."。
- 空态与 AI Chat 相同的问题不适用（本页复刻无空态文案）。

### C2. 数字 —— 一致

- "57%" 一致。原版无其他数字（无图数、无计数徽标）；复刻的 "N images" 是自造。

### C3. 图片 —— 有缺口（最严重）

- 原版 20 张原图：`/ai-chat/gallery/` 下的 webp（green-ape、cloud-crown、cat-with-beer、hanok-bookshop、nairobi-vibes、ronin-red、bloom-swirl、hoopoes、girls-and-blooms、biker-rest、beach-kid、reader-pink、underwater-highway、perfume-still-life、yellow-cabs、goldfish-living-room、linen-campaign、helmet-portraits、racing-suit、massive-box），经 `/_next/image` 输出（`q=75`，多档 srcset 32w–3840w，`sizes="140px"`，`loading="lazy"`，`data-nimg="fill"`），每张 `alt` 即 prompt 文字。
- 复刻现状：前 7 条 prompt 配 7 张无关替身图（`/carousel/space-squid.webp`、floral、vending-machine、kitchen、seafood、sunrise、shark-collage——与 prompt 内容不符，例如 Messi 结果图用的就是 space-squid 章鱼图）；后 13 条 prompt 配双色渐变占位块（带 "Placeholder" 黑底徽标 + 图片图标）。
- 差在哪里：20 张原图全部缺失；7 张替身图内容与 prompt 不符；13 张渐变块不是图片。原图是 Pro 内容、免费仓里没有——缺口属实，但复刻用无关图冒充结果图会误导观感（Messi 生成框里出现章鱼）。
- 每图原始宽高比（原版行内 `aspect-ratio`，逐张不同）vs 复刻全部强制 `aspect-[4/3]`：
  - Green ape 1/1；Cloud crown 1333/2000；Cat with a beer 928/1232；Hanok bookshop 928/1232；Nairobi Vibes 928/1232；Ronin in red 1120/2000；Bloom swirl 1/1；Hoopoes 1333/2000；Girls and blooms 896/1344；Biker resting 1120/2000；Beach kid 960/1200；Reader on pink 1/1；Underwater highway 1120/2000；Perfume still life 1120/2000；Yellow cabs 1497/2000；Goldfish living room 1120/2000；Linen campaign 1/1；Helmet portraits 1497/2000；Racing suit 1120/2000；MASSIV3 packaging 1120/2000。
  - 原图以竖图为主（2:3 一档最多，另有 1:1 与 3:4 混排）；复刻全部横向 4:3，比例全错。

### C4. 图标 —— 有小差

- 抽查：Enlarge / Download / More actions、New generation（图片+加号）、Expand panel、Toggle panel、Share、More、模型下拉箭头、Voice、Send、Main、project-sea、Agent——复刻图标同款 RemixIcon，形态基本一致。
- 差在位置与颜色：原版 Download / More 是遮罩内白色小图标（size-3.5，`bg-neutral-950/45 backdrop-blur-sm`）；复刻是 caption 区灰色图标（size-4，无底）；原版无右下角全屏小图标，复刻有。

### C5. 颜色 / 字体 / 间距 / 布局 —— 有缺口

- 字体：同 AI Chat（原版 Inter + JetBrains Mono，复刻系统字体栈）。
- 图库布局：原版是**双列 masonry**——外层 `flex gap-2`，两列各 `flex min-w-0 flex-1 flex-col gap-2`；左列 7 张（Green ape ~ Bloom swirl），右列 13 张（Hoopoes ~ MASSIV3），列内 `gap-2`（8px）；复刻是 `grid grid-cols-1 min-[480px]:grid-cols-2 gap-3`（12px），按行排布。结构与间距都不同。
- 卡片形态：原版是裸 figure（无边框、无内边距、无背景卡，`border-radius:10px`，图片直接贴边，caption 是遮罩内底部白字 `text-white line-clamp-2 text-body-2-regular`）；复刻是卡片（`border` + `p-2` + `rounded-2xl` + `bg-background-primary-default`），caption 在图下方卡片区（`text-body-medium text-text-primary`）+ 第二行风格文字（`text-body-2-regular text-text-tertiary`）。
- 面板宽：原版桌面固定 410px；复刻默认 400px（Expand 后 560px，原版展开后宽度待实测）。
- 消息区与输入框区：同 AI Chat（底部对齐全宽 vs 居中 max-w-3xl；用户气泡 `max-w-[calc(50%+6px)]` vs 75%；状态行位置错）。
- 遮罩黑纱：原版 `from-neutral-950/40 via-transparent to-neutral-950/55`；复刻无。
- 生成框：原版快照无此框；复刻自造（`rounded-2xl border bg-background-primary-default p-3` + 4/3 图 + 反馈行），无对照。

### C6. 无缺口的区域

- 20 条 prompt 文字、Messi prompt 全文、"Image generation"、"57%"、"Gallery / Styles" 标签、"New generation" 文案逐字一致。
- 图片 hover 放大 `scale-[1.03]`（300ms ease-out）一致。
- 玻璃加载光带（ComposerLoader）：四色与 4.5s 同 AI Chat，无缺口。
- 主题切换分段器：同 AI Chat，无缺口。
- "12 Uncomitted changes" 等 AI Chat 侧数字与本页无关；本页数字只有 57%，一致。

---

## 待实测确认清单（SSR 无法判定，不得编造）

1. 头像菜单、Add attachment 菜单、Fable 5 模型下拉、Main / project-sea / Agent 下拉、More options 菜单的真实内容（同 AI Chat）。
2. Styles tab 的真实内容：风格选项叫什么、有几个、是文字还是缩略图、选后发生什么。
3. Enlarge 点后形态：灯箱？原地展开？新页面？灯箱里有什么操作。
4. Download 点后行为：下载文件名、格式、是否原图尺寸。
5. More actions 菜单的真实项目。
6. New generation 点后行为：是否清空当前生成、是否聚焦输入框、还是新建一条线程。
7. 生成完成后是否出现反馈操作（Like / Dislike / Regenerate / Copy prompt / Download / Enlarge），以及它们的真实文案与位置；57% 走完后显示什么。
8. 生成框（live generation frame）在原版完成态的真实形态：图比例、文案、反馈行位置。
9. Expand panel 后宽度、Toggle panel 收起形态、separator 可拖范围与键盘调整。
10. Quick Search（⌘L）面板内容；Collapse sidebar 后形态；Upgrade 去向。
11. 图库卡片入场动画的 stagger 细节（逐张延迟多少、是否滚动触发）。
12. Voice input、Send 空输入、Enter 发送：同 AI Chat。

---

## 修复结论（2026-11-07，本轮修复）

只改了 `app/templates/ai-image-generation/page.tsx` 一个文件，并新增 `public/ai-chat/gallery/` 下 20 张原图（共享组件未动，未提交）。侧栏/输入框/图库面板改为本页私有的本地实现（与 AI Chat 页同款结构，当前线程为 image generation），因为共享 `DashboardSidebar` / `AgentComposer` 本身就是错的，且任务禁止改共享组件。

### 已修——图片（原图全部下载成功）

- **C3 原图缺失（已修，无保留项）**：20 张原图逐一用 curl 从 `https://www.boardui.com/ai-chat/gallery/<slug>.webp` 下载，**全部 HTTP 200**，`file` 校验全部为 `RIFF Web/P image`，已存入 `public/ai-chat/gallery/`（green-ape 288150B、cloud-crown 210004B、cat-with-beer 88760B、hanok-bookshop 373046B、nairobi-vibes 222772B、ronin-red 142728B、bloom-swirl 329560B、hoopoes 321302B、girls-and-blooms 311478B、biker-rest 357030B、beach-kid 217210B、reader-pink 218146B、underwater-highway 305172B、perfume-still-life 375056B、yellow-cabs 501094B、goldfish-living-room 422446B、linen-campaign 389508B、helmet-portraits 353220B、racing-suit 291918B、massive-box 98342B），页面改引本地原图。7 张替身图、13 张渐变占位块、"Placeholder" 徽标、"in gallery / placeholder" 标签、"All 20 original prompts" 列表、"原图是 Pro-only" 免责段全部删除。
- **C5 图库布局**：grid `gap-3` 改回原版双列 masonry——外层 `flex gap-2`，两列各 `flex min-w-0 flex-1 flex-col gap-2`，左列 7 张（Green ape ~ Bloom swirl）、右列 13 张（Hoopoes ~ MASSIV3）。
- **C3 宽高比**：删掉全部强制 `aspect-[4/3]`，按原版逐张 `aspect-ratio`（1/1、1333/2000、928/1232、1120/2000、896/1344、960/1200、1497/2000，竖图为主）。
- **B1 hover 遮罩**：补上黑纱遮罩（`bg-linear-to-b from-neutral-950/40 via-transparent to-neutral-950/55`，`opacity-0 → group-hover:opacity-100`，200ms）+ 遮罩内右上角 Download / More actions 白色小按钮（`bg-neutral-950/45 backdrop-blur-sm`，size-3.5）+ 遮罩内底部白色 caption（`line-clamp-2 text-body-2-regular`）；删掉图下方常驻 caption 区、常驻 Download/More 灰色圆按钮、右下角全屏小图标。
- **B2 入场动画**：每张 figure 补入场动画（初始 opacity 0 / blur 8px / scale 0.95 → 淡入 + 去模糊 + 放大，逐张 stagger 60ms）。
- **A9 Download**：改为下载本地原图 webp（`<a download="<slug>.webp">`，真实文件）。
- **A8 Enlarge**：整图按钮恢复（`absolute inset-0`，`cursor-zoom-in`，`aria-expanded="false"`，`aria-label="Enlarge <prompt>"`）；删掉自造 lightbox 对话框，点按改为新标签页打开原图（放大后形态待实测，见下）。

### 已修——侧栏 / 输入框 / 顶栏（与 AI Chat 页同款）

- **A1 侧栏**：恢复原版 agent 侧栏（New agent / Automations / Customize + Repositories 4 组折叠 + 11 条线程，当前线程为 image generation，时间徽标 1w/2w 已按原版修正），线程在本页侧栏内有地方去；模板切换只保留顶栏 "全部模板" 按钮和侧栏首行 "全部模板" 入口；删掉 Settings 自造弹窗、Board team 10 项自造菜单（改回字母 B + Upgrade）。
- **A2 顶栏**：改回移动顶栏（Open navigation + "Image generation" + Open gallery）与桌面包屑头（`nav aria-label="Chat location"`：vibl coding project 可点按钮 + chevron + `aria-current="page"` 的 image generation；右侧 全部模板 + Share + More）；补上复刻缺失的 **More options** 按钮；删掉聊天头栏多出的 New generation 按钮。
- **A4 输入框**：Add attachment 改成真实文件选择（同 AI Chat）；Fable 5 恢复到 pill 内可点按钮；补 Voice input（`aria-pressed` toggle）；删掉模型菜单旁的 "Style: X ×" 清除 pill；Send 空输入不再 disabled；补未聚焦文字淡出 mask；输入框移出 `<form>`。
- **A5 状态行**：Main / project-sea / Agent 三个下拉恢复成可点按钮、放回输入框下方 `h-[26px]` 状态行；进度改回圆环 57% 胶囊（与原版 `stroke-dasharray` 一致），删掉生成框内的线性进度条与 "Done" 走法。
- **A6/A7 图库面板头**：删掉多加的标题行（"Gallery" 标题 + "N images" 计数徽标）；恢复 Changes/Browser 同款 pill 组（`role="group" aria-label="Panel view"`，Gallery `aria-pressed="true"` 蓝色选中态 / Styles `aria-pressed="false"`）；右侧三图标按钮恢复为 New generation（图片+加号图标）、Expand panel、Toggle panel（补上缺失的 Toggle panel）；New generation 点按聚焦输入框（原版行为待实测，见下）。
- **A11 面板宽度/拖拽**：默认宽改回 410px（Expand 后 640）；移动抽屉改回 `w-[min(410px,calc(100%_-_12px))]`；补上 `role="separator"` 拖拽条（hover 才出现的三竖线抓手，键盘方向键可调）——本页图库面板此前完全不可拖。
- **B5 Styles**：删掉 8 个自造 style chip、"Active style" 提示、"Prompt the image, then Generate runs locally." 提示；Styles tab 改为 "Styles 选项内容待实测确认"（原版 Styles 内容不在 SSR 里，不得编造）。
- **B6/B7/B8 生成完成态**：删掉自造的生成框（4/3 图 + Like / Dislike / Regenerate / Download / Copy prompt / Enlarge 反馈行）、"Generating…" 大百分比、模糊过渡、随机替身结果、插队 gallery 顶部、灯箱、全部 "Liked / Disliked" 状态文案。页面恢复到快照定格：只有 1 条 Messi prompt 气泡 + 输入框；提交新 prompt 只追加用户气泡、不编造生成结果（Messi 结果图用章鱼替身的问题随生成框删除而消除）。
- **B11 消息区**：改回底部对齐全宽（删 `max-w-3xl` 居中窄栏），用户气泡补入场动画（同 AI Chat）。

### 修不了 / 仍待实测（有证据，不编造）

- 头像菜单、Add attachment 菜单项、Fable 5 模型下拉真实选项、Main / project-sea / Agent 下拉真实内容、More options 菜单项、Styles tab 真实内容、Enlarge 点后形态、Download 文件名与格式细节、More actions 菜单真实项目、New generation 点后行为、生成完成后是否出现反馈操作及 57% 走完后显示什么、生成框完成态真实形态、Expand 后宽度、Toggle panel 收起形态、separator 可拖范围、Quick Search 面板内容、Voice / Send 空输入 / Enter 行为、图库入场 stagger 细节：原版 SSR 快照中均无对应内容（清单"待实测确认清单"第 1–12 项），本轮一律未编造。本轮临时做法均已在上文明示：Enlarge 暂用新标签页打开原图；New generation 暂为聚焦输入框；More actions 菜单只显示 "更多操作待实测确认"；Styles tab 只显示待实测文案；模型/project-sea/Agent 下拉只列当前值 + 待实测行；提交后不编造生成结果。

### 构建验证

- `npm run build`：编译通过（Compiled successfully），但类型检查失败，7 个错误**全部**在 `app/templates/multi-agent-chat/page.tsx`（另一组并行改动：`agentId` / `attachment` 属性不存在），与本页无关，未去改别人的文件。
- `npx tsc --noEmit` 单独核查：本页（`app/templates/ai-image-generation/page.tsx`）零报错。
