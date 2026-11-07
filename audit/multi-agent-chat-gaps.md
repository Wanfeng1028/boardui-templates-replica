# Multi-Agent Chat 缺口清单

- 原版来源：`tpl-pages/multi-agent-chat.html`（BoardUI 站点 SSR 快照，含 `BAILOUT_TO_CLIENT_SIDE_RENDERING`，即菜单、弹窗、tooltip 等只在客户端渲染的内容不在静态 HTML 里）+ `browser.open` 抓线上页 `https://www.boardui.com/templates/multi-agent-chat` 交叉核对（线上抓取只返回营销文案，未返回页面 UI 文本，行为无法在线上核对）。
- 复刻来源：`app/templates/multi-agent-chat/page.tsx`（1662 行）。
- 盘点日期：2026-11-07。只盘点、不修。

## 元素总数：78 个

原版静态 HTML 中可交互元素共 78 个：顶部 Marketplace / Create / 搜索（5 个，含搜索输入框与关闭）、对话列表 7 个 agent、侧栏底部 Support / Settings / Board team / Open conversations（4 个）、对话头 agent pill / Copy conversation / Conversation options（3 个）、回复区 agent 名（含 Thinking…）/ Helpful / Unhelpful / Copy response（4 个）、输入区 Message 输入框 / Add attachment / Permission / 模型选择 / Voice input / Send（6 个）、编辑器 Close（1 个）、表情 16 个、形状 9 个、颜色 9 个、自定义颜色 1 个、Name / Label / Description 输入（3 个）、语言按钮 + 原生 select（2 个）、通知开关（1 个）、Preview voice / Agent voice 按钮 + 语音 select（3 个）、倍速单选 4 个。

另有 7 类交互不在静态 DOM 里（菜单关闭态不渲染）：Create 菜单项、Conversation options 菜单项、Marketplace 面板内容、附件菜单项、Permission 菜单项、模型下拉选项、自定义颜色选择器——内容与行为一律标"待实测确认"，不得编造。

---

## A. 可点击元素

### A1. Marketplace（顶部购物袋图标）—— 功能能用，内容待实测确认

- 位置与标识：侧栏顶部中间，`aria-label="Marketplace"`。
- 原版行为：点开 Marketplace 面板（面板内容不在静态 DOM 里，里面有什么 agent、长什么样，无法得知）。
- 复刻现状：打开 SettingsModal 的 marketplace 页，列出 6 个 agent（data analyst、social media manager、copywriter、support agent、product manager、ux researcher），点 Add 后追加到侧栏并选中，按钮变 Added。
- 差在哪里：Add 流程本身能用；但 6 个 agent 的名字、简介、头像、文案**全部是复刻编造的**，原版 Marketplace 的真实名单待实测确认。

### A2. Create bot or chat（顶部 + 号）—— 有缺口

- 位置与标识：侧栏顶部右侧，`aria-label="Create bot or chat"`，`aria-expanded="false"`（点开有菜单）。
- 原版行为：点开一个菜单（菜单项不在静态 DOM 里，推测为 New agent / New chat / New group 之类，待实测）。
- 复刻现状：直接打开 Marketplace（代码注释承认"no dedicated create flow exists in the replica"）。
- 差在哪里：去向不同——原版开菜单，复刻跳 Marketplace；新建 agent / 新建对话 / 新建群聊的入口在复刻里不存在。

### A3. Search conversations（搜索）—— 有缺口（搜索不生效）

- 位置与标识：侧栏顶部左侧，`aria-label="Search conversations"`，展开后出现输入框 + `aria-label="Close search"`。
- 原版行为：展开搜索框，输入应过滤对话列表（快照中输入框有 `placeholder="Search conversations…"`）。
- 复刻现状：展开/关闭能用；但输入框**没有 onChange/value，不接任何过滤逻辑**，打字对列表毫无作用，是个死输入框。
- 差在哪里：搜索功能本身是坏的；另 placeholder 少了原版的省略号 "…"（小）。

### A4. 对话列表 7 个 agent —— 切换无缺口，文字有缺口（见 C1）

- 位置与标识：侧栏对话列表，7 项（landing page designer、content reviewer、marketing bot、seo bot、research assistant、Security agent、Cloud engineer）。
- 原版行为：点击切换到该 agent 的对话。
- 复刻现状：点击切换能用，选中态样式有。
- 差在哪里：切换本身无缺口；列表第二行简介文字 5 处与原版不同，见 C1。

### A5. 群聊项（复刻自加）—— 有缺口

- 位置与标识：复刻侧栏列表首项，"Design + Marketing + Product" / "Start a conversation"，带三个小头像。
- 原版行为：原版静态 HTML 的侧栏列表只有 7 个 agent，**没有群聊行**（页面描述虽写 "individual and group conversations"，但群聊入口不在列表里，推测在 Create 菜单中，待实测）。
- 复刻现状：群聊行可点，点开显示自写的空态页（"A few minds. One conversation."）；且群聊态下 `submit()` 因 `agent === null` 直接 return，**发消息完全无效**（输入框 + Send 按钮成了摆设）。
- 差在哪里：① 群聊入口为复刻自加，原版不在此位置；② 群聊内发送是死功能。

### A6. Support / Settings（侧栏底部）—— 死按钮

- 位置与标识：侧栏底部，文字 Support、Settings。
- 原版行为：两个 button，静态 HTML 中无后续 DOM，点完发生什么无法推断（大概率打开对应面板）。
- 复刻现状：两个按钮**没有任何 onClick**，点了毫无反应。
- 差在哪里：死按钮。注意：AI Profile 的同名 Settings 在复刻里是接了 SettingsModal 的，MAC 这里却没接。

### A7. Board team（侧栏底部）—— 死按钮

- 位置与标识：侧栏底部，"Board team / hi@boardui.com"，`aria-expanded="false"`（原版点开有菜单）。
- 原版行为：点开团队菜单（菜单内容不在静态 DOM 里）。
- 复刻现状：按钮**没有任何 onClick**，点了毫无反应。
- 差在哪里：死按钮；原版菜单内容亦待实测。

### A8. Open conversations（移动端开侧栏）—— 元素缺失

- 位置与标识：原版 `aria-label="Open conversations"` 的按钮（窄屏下打开对话列表）。
- 原版行为：打开侧栏抽屉。
- 复刻现状：复刻里**没有这个按钮**；侧栏在 `md` 以下直接隐藏，窄屏下没有任何办法打开对话列表。
- 差在哪里：移动端入口缺失。

### A9. 对话头 agent pill —— 无缺口

- 位置与标识：对话头，头像 + agent 名的胶囊按钮。
- 原版行为：点击打开 agent 编辑器（与编辑器面板的对应关系可从 DOM 结构推断；编辑器当时正为 Security agent 打开）。
- 复刻现状：点击打开编辑器，能用。
- 差在哪里：无。

### A10. Copy conversation（对话头下载图标）—— 无缺口（图标未核对）

- 位置与标识：对话头，`aria-label="Copy conversation"` / `title="Copy conversation"`。
- 原版行为：复制整段对话（标题即行为）。
- 复刻现状：实现剪贴板复制 + 1.5 秒 "Copied" 对勾反馈，能用。
- 差在哪里：功能无缺口；图标未核对——复刻用的是下载箭头图标（RiDownloadLine），原版图标是复制还是下载样式，静态 HTML 的 SVG 路径未逐一比对。

### A11. Conversation options（对话头 … 菜单）—— 功能能用，菜单内容待实测确认

- 位置与标识：对话头，`aria-label="Conversation options"`，`aria-expanded="false"`。
- 原版行为：点开菜单，菜单项不在静态 DOM 里，内容无法得知。
- 复刻现状：菜单能开，三项 Rename conversation / Clear conversation / Delete conversation 均有真实 handler（重命名走内联输入，Enter 保存、Esc 取消；清空、删除均生效）。
- 差在哪里：功能本身能用；但三项是否为原版菜单的真实内容，无法证实，待实测确认。

### A12. 回复区 agent 名按钮（Thinking… 交叉淡入）—— 死按钮 + 缺 Thinking 状态

- 位置与标识：每条 agent 回复左下角，头像 + agent 名。
- 原版行为：按钮内含两层重叠文字——`aria-hidden` 的 "Thinking…"（opacity:0）与 agent 名（opacity:1），以 CSS grid 交叉淡入淡出；即生成时显示 Thinking…，完成后显示名字。点击该按钮大概率打开 agent 编辑器（与对话头 pill 同类，待实测）。
- 复刻现状：按钮**没有任何 onClick**；且只有名字，没有 Thinking… 层。
- 差在哪里：死按钮；生成等待态缺失（见 B2）。

### A13. Helpful / Unhelpful（回复区拇指）—— 死按钮

- 位置与标识：回复区右下角 hover 出现的操作组，`aria-label="Helpful response"` / `"Unhelpful response"`，`aria-pressed="false"`。
- 原版行为：点击应切换 `aria-pressed` 状态（点赞/点踩）。
- 复刻现状：两个按钮 `aria-pressed="false"` 写死，**没有任何 onClick**。
- 差在哪里：死按钮，点了状态不变。

### A14. Copy response（回复区复制）—— 死按钮

- 位置与标识：回复区右下角操作组，`aria-label="Copy response"`。
- 原版行为：复制该条回复。
- 复刻现状：**没有任何 onClick**。
- 差在哪里：死按钮。

### A15. Message 输入框 + Send —— 无缺口（后续回复文案为复刻自写）

- 位置与标识：底部输入区，`textarea aria-label="Message"`，`placeholder="Hi, what do you need today?"`；Send 按钮 `aria-label="Send message"`。
- 原版行为：输入、Enter 发送、Send 按钮发送；首轮对话内容见 C5。
- 复刻现状：Enter（非 Shift+Enter）发送、Send 发送均能用；发送后 700ms 出现跟进回复（每 agent 两条轮换 + Marketplace agent 通用回复）。
- 差在哪里：发送功能无缺口；但除首轮外所有跟进回复文案均为复刻自写，原版后续回复行为待实测。

### A16. Add attachment（+ 号）—— 死按钮

- 位置与标识：输入区左下，`aria-label="Add attachment"`，`aria-expanded="false"`（原版点开有菜单）。
- 原版行为：点开附件菜单（菜单项不在静态 DOM 里，待实测）。
- 复刻现状：**没有任何 onClick**。
- 差在哪里：死按钮。

### A17. Permission: Bypass all —— 死按钮 + 文字差异

- 位置与标识：输入区，盾牌图标 + 文字，`aria-label="Permission: Bypass all"`，`aria-expanded="false"`（原版点开有菜单）。
- 原版行为：点开权限菜单（菜单项不在静态 DOM 里，待实测）；可见文字为 **"Bypass all"**（"Permission: " 只在 aria-label 里）。
- 复刻现状：**没有任何 onClick**；可见文字写成 "Permission: Bypass all"，比原版多出 "Permission: " 前缀。
- 差在哪里：死按钮；可见文字与原版不符。

### A18. 模型选择 Fable 5 —— 有缺口（假下拉）

- 位置与标识：输入区右侧，"Fable 5" + 下箭头，`aria-expanded="false"`（原版点开有下拉菜单）。
- 原版行为：点开模型下拉（选项不在静态 DOM 里，待实测）。
- 复刻现状：点击在 "Fable 5" 与 "Fable 4" 之间来回切换（`aria-expanded` 恒为 false）。
- 差在哪里：不是真下拉，"Fable 4" 选项为复刻编造；原版有哪些模型可选待实测。

### A19. Voice input（麦克风）—— 死按钮

- 位置与标识：输入区右侧，`aria-label="Voice input"`，`aria-pressed="false"`。
- 原版行为：点击应开始语音输入（具体为录音还是听写，待实测）。
- 复刻现状：**没有任何 onClick**，`aria-pressed` 写死 false。
- 差在哪里：死按钮。

### A20. 编辑器：表情 16 个 —— 功能能用，形态不同（见 B3 / C7）

- 位置与标识：编辑器顶部表情环，Neutral、Happy、Angry、Thinking、Shook、Curious、Wink、Sleepy、Sad、Worried、Skeptical、Focused、Excited、Calm、Shy、Confused（原版默认 Neutral 为 `aria-pressed="true"`）。
- 原版行为：点击切换 agent 表情，中央大头像表情随之变。
- 复刻现状：16 个按钮均有 onClick，切换表情能用，中央头像表情随之变。
- 差在哪里：切换功能无缺口；但呈现形态不同——原版是 268px 直径圆环上的 16 个彩色圆点（见 B3），复刻是 8 列网格里的 16 张小脸（见 C7）。

### A21. 编辑器：形状 9 个 —— 功能能用，拖拽缺失（见 B4）

- 位置与标识：编辑器形状行，Star / Heart / Cloud / Diamond / Shield / Slender / Pocket / Petal / Flower（原版 `role="option"`，Security agent 当前为 Shield `aria-selected="true"`），按钮 56px（`size-14`），内含 canvas 脸。
- 原版行为：点击选中形状；按钮带 `cursor-grab`，可拖拽（拖了会怎样待实测，见 B4）。
- 复刻现状：9 个按钮均有 onClick，点选能用；但只有点击，无拖拽；按钮 36px（`size-9`），`aria-label` 为 "Shape X"（原版为 "X shape"）。
- 差在哪里：点选无缺口；拖拽缺失；尺寸与 aria-label 文字与原版不同（小）。

### A22. 编辑器：颜色 9 个 —— 功能能用（小差异）

- 位置与标识：编辑器颜色点，Blue / Teal / Violet / Pink / Red / Orange / Cyan / Lime / Green（原版 `title` 为颜色名小写；Security agent 当前 Teal 为 `aria-pressed="true"`）。
- 原版行为：点击切换头像颜色。
- 复刻现状：9 个颜色点均有 onClick，切换能用。
- 差在哪里：点选无缺口；`aria-label` 文字不同（复刻 "Color X"，原版 "X avatar"），复刻无 `title`。

### A23. 编辑器：Custom avatar color（彩虹自定义颜色）—— 死按钮

- 位置与标识：颜色行末尾，`aria-label="Custom avatar color"`，`aria-expanded="false"`（原版点开颜色选择器）。
- 原版行为：点开自定义颜色选择器（内容不在静态 DOM 里，待实测）。
- 复刻现状：只是一个**不可点的 `<span>`** 彩虹圆点（`aria-label="Rainbow"`），无任何交互。
- 差在哪里：自定义颜色入口缺失。

### A24. 编辑器：Name / Label / Description 输入 —— 能用（小差异）

- 位置与标识：编辑器表单三行。
- 原版行为：文本输入；Description 为 `rows="2"`、`maxLength="500"`；placeholder 分别为 "Michael Scott"、"Manager, marketing, painter"、"Details for the agent"。
- 复刻现状：三处输入均能编辑，保存后回写。
- 差在哪里：复刻三个输入框**都没有 placeholder**；Description 为 `rows="4"` 且无 maxLength 限制。

### A25. 编辑器：Language —— 有缺口（不是真下拉，6 种语言选不了）

- 位置与标识：编辑器 Language 行，按钮 `aria-label="Agent language"` 显示 "Auto-detect" + 原生 `<select>`（未禁用，选中 Auto-detect）。
- 原版行为：原生下拉，选项共 9 个：空项 + Auto-detect、English、Turkish、Spanish、French、German、Japanese、Portuguese。
- 复刻现状：按钮点击只在 "Auto-detect" 与 "English" 之间来回切换。
- 差在哪里：Turkish / Spanish / French / German / Japanese / Portuguese 六种语言在复刻里根本选不了；也不是下拉形态。

### A26. 编辑器：通知开关 —— 无缺口

- 位置与标识：Notifications 行，`role="switch"` 的 checkbox，"Show a notice when a reply is ready."。
- 原版行为：开关通知。
- 复刻现状：Switch 组件接 state，切换能用。
- 差在哪里：无。

### A27. 编辑器：Preview voice —— 元素缺失

- 位置与标识：编辑器 Voice 行，`aria-label="Preview voice"` 的按钮。
- 原版行为：按钮在快照中为**禁用态**（`disabled=""`），推测在选定语音后可用；点完应试听语音。
- 复刻现状：复刻编辑器里**根本没有这个按钮**。
- 差在哪里：元素缺失。

### A28. 编辑器：Agent voice —— 有缺口（编造选项 + 禁用态丢失）

- 位置与标识：编辑器 Voice 行，按钮 `aria-label="Agent voice"` + 原生 `<select>`。
- 原版行为：按钮与 select 在快照中**均为禁用态**（`disabled=""`）；select 选项只有 Off / System voice，当前选中 System voice。
- 复刻现状：按钮可用，点击在 "System voice" 与编造的 "Voice 1" 之间切换；无 Off 选项，无禁用态。
- 差在哪里："Voice 1" 为复刻编造；原版的禁用态与 Off 选项在复刻里都没有。

### A29. 编辑器：倍速 0.75× / 1× / 1.25× / 1.5× —— 有缺口（不可调）

- 位置与标识：编辑器 Playback speed 行，4 个 `role="radio"` 按钮。
- 原版行为：点选倍速。
- 复刻现状：只显示静态文字 "1.0×"，**不可点**。
- 差在哪里：倍速完全不可调。

### A30. 编辑器：Save 按钮 —— 复刻自加，原版快照中无此元素

- 位置与标识：复刻编辑器头部，Save 文字按钮。
- 原版行为：原版静态 HTML 全文搜 "Save" **0 次**，编辑器头部只有 agent 名（`<h2>Security agent</h2>`）+ 关闭 X 按钮；编辑是自动保存还是关闭即丢弃，静态 HTML 看不出。
- 复刻现状：Save 按钮存在，点击保存并关闭；X 按钮同样保存并关闭（注释称"closing via X saves too"）。
- 差在哪里：Save 是复刻自加的 UI；原版线上是否真有 Save、关闭是否保存，需实测确认后才能判定复刻做法对不对。

### A31. 编辑器：16 个头像变体环 —— 复刻自加，原版无此 UI

- 位置与标识：复刻编辑器 300×300 区域内环形排列的 16 个小头像按钮（7 个 roster agent + 9 个颜色）。
- 原版行为：编辑器顶部是 360px 高区域，内为 268px 直径的表情环 + 中央大头像；没有"头像变体环"这种东西。
- 复刻现状：环上 16 个按钮均可点，点选换头像。
- 差在哪里：整个环是复刻发明的 UI，原版没有；中央大头像的呈现方式也不同（见 C7）。

### A32. 复刻自加的 "All templates" 入口 —— 非原版内容

- 位置与标识：复刻侧栏底部 "All templates" 行 + 对话头网格图标链接（`/templates`）。
- 原版行为：原版 MAC 侧栏底部只有 Support / Settings / Board team；对话头只有 agent pill、Copy、… 菜单，没有模板跳转入口。
- 复刻现状：两处入口均存在。
- 差在哪里：复刻比原版多出两处导航入口（代码注释承认是为方便跳转而加）。

---

## B. 其他交互（hover / 拖拽 / 键盘 / 输入 / 滚动 / 动画）

### B1. 回复区操作组 hover 出现 —— 无缺口

- 位置与标识：每条 agent 回复右下角，Helpful / Unhelpful / Copy response 三个按钮。
- 原版行为：平时 `opacity-0`，`group-hover/reply` 与 `group-focus-within/reply` 时 `opacity-100`。
- 复刻现状：同样的 `group-hover/reply:opacity-100 group-focus-within/reply:opacity-100`，能用。
- 差在哪里：无（按钮本身是死的，见 A13/A14，那是另一回事）。

### B2. Thinking… 等待态 —— 有缺口

- 位置与标识：回复区 agent 名按钮内（见 A12）与提交后的等待过程。
- 原版行为：回复生成时按钮内显示 "Thinking…"（与名字交叉淡入淡出），生成完切回名字；快照中 "Thinking…" 出现 1 次（opacity:0 的隐藏层）。
- 复刻现状：提交后 700ms 内**没有任何等待指示**，回复直接出现；回复区也没有 Thinking… 层。
- 差在哪里：等待态缺失。

### B3. 表情环布局 —— 有缺口

- 位置与标识：编辑器顶部，`role="group" aria-label="Agent emotion"` 的容器。
- 原版行为：容器为 `relative size-[268px] touch-none rounded-full` 的圆环，16 个表情按钮以 `transform:rotate(Ndeg) translateY(-116px)` 定位在圆周上（`pointer-events-none` 容器 + `pointer-events-auto` 按钮）。
- 复刻现状：8 列网格（`grid grid-cols-8`）平铺。
- 差在哪里：布局形态完全不同（圆环 vs 网格）。

### B4. 拖拽 —— 有缺口（拖了会怎样待实测）

- 位置与标识：① 9 个形状按钮（`cursor-grab`，共 9 处）；② 表情环容器带 `touch-none`（暗示可指针拖动旋转圆环）。
- 原版行为：形状可拖拽、圆环可能可拖动旋转；具体拖拽目标与落点效果静态 HTML 看不出，待实测。
- 复刻现状：全站无任何拖拽实现，形状与表情只有点击。
- 差在哪里：拖拽交互整类缺失。

### B5. 头像动画（眨眼 / 游移 / 变形）—— 近似，非 1:1

- 位置与标识：全部纸片头像（侧栏、对话头、回复区、编辑器中央大头像）。
- 原版行为：原版头像是 canvas 绘制的纸片脸，眼睛独立眨动/游移，形状切换时有 morph 变形（快照无像素/矢量数据可供还原）。
- 复刻现状：SVG 重绘 + CSS 眨眼（4.4s/5.3s 周期）与游移（7s/8.5s）动画；形状切换用 0.32s 缩放淡入代替 morph；中央大头像点击可翻面（rotateY 180°，复刻自加行为，原版无此交互线索）。
- 差在哪里：眼睛/嘴/腮红的画法是复刻按名字想象的，非原版像素；morph 被缩放淡入替代；翻面为自加行为。

### B6. 滚动联动（顶部渐隐）—— 有缺口

- 位置与标识：消息列表顶部。
- 原版行为：原版 HTML 中有 10 处 `backdrop-blur`，含消息列表顶部的渐隐遮罩（滚动后出现）。
- 复刻现状：ChatMain 里三层遮罩的 `opacity` **写死为 0**，且无任何 `onScroll` 处理，遮罩永远不出现。
- 差在哪里：滚动渐隐是死样式，滚到底也不显示。

### B7. 键盘操作 —— 部分缺口

- Enter 发送：复刻有（`Enter && !e.shiftKey` 提交），与原版一致，无缺口。
- Esc 关闭编辑器：复刻编辑器无 Esc 处理；原版行为未知，待实测。
- 重命名输入框 Enter 保存 / Esc 取消：复刻有（但重命名本身是复刻菜单的自选功能，原版菜单内容待实测，见 A11）。
- ⌘L / 搜索快捷键：MAC 原版无此线索，复刻无，不判。

### B8. 输入联想 —— 无

- 原版静态 HTML 中无输入联想线索；复刻同样没有。无缺口。

---

## C. 静态内容（文字 / 数字 / 图片 / 图标 / 颜色 / 字体 / 间距 / 布局）

### C1. 侧栏对话列表简介文字（5/7 与原版不同）—— 有缺口

- 位置与标识：侧栏 7 项 agent 的第二行简介。
- 原版（逐字）：简介 = 各 agent 的 desc 原文。
- 复刻现状：简介显示的是 `replyP1`（首轮回复第一段），5 处与 desc 不同：

| agent | 原版简介（desc） | 复刻显示（replyP1） |
|---|---|---|
| content reviewer | …explain the first useful step, and keep the main button close to that instruction. | …explain the first useful step, and keep the rest of the copy short. That will save the reader a step or two. |
| seo bot | …answer the next questions readers are likely to ask. | …answer the next question each reader is likely to have, and connect them clearly. |
| research assistant | …where they got stuck, and what a good result would have looked like. | …where they got stuck, and what mattered most in that moment. |
| Security agent | …checks the current user's access and that one account cannot read another account's data. | …checks the current user and remove any access that is wider than necessary. |
| Cloud engineer | …while keeping credentials, storage, and deployment permissions separate. | …while keeping secrets and permissions separate. |

- 差在哪里：5 项简介文字与原版不符（landing page designer 与 marketing bot 两处一致，无缺口）。

### C2. Security agent 头像颜色错误 —— 有缺口

- 位置与标识：Security agent 的头像（侧栏、对话头、编辑器）。
- 原版行为：编辑器快照中颜色 Teal 为 `aria-pressed="true"`、形状 Shield 为 `aria-selected="true"`，即 Security agent 是 **Teal + Shield**。
- 复刻现状：`AGENTS` 中 security 的 `body` 为 `#8554F6`（Violet，紫色），形状 shield。
- 差在哪里：颜色错了（紫 vs 原版青色）。其余 6 个 agent 的颜色/形状在快照中无对照（编辑器只为 Security agent 打开），复刻的指派均为自选，未经证实。

### C3. 可见文字 "Permission: Bypass all" —— 有缺口（小）

- 原版可见文字为 "Bypass all"（"Permission: " 只在 aria-label 里）；复刻可见文字写成 "Permission: Bypass all"。见 A17。

### C4. 输入框 placeholder 缺失（4 处）—— 有缺口（小）

- 搜索框：原版 "Search conversations…"，复刻 "Search conversations"（少省略号）。
- Name 输入：原版 "Michael Scott"，复刻无 placeholder。
- Label 输入：原版 "Manager, marketing, painter"，复刻无 placeholder。
- Description 输入：原版 "Details for the agent"，复刻无 placeholder。

### C5. 首轮对话文字（landing agent）—— 无缺口；其余 6 个 agent 的对话文字待证实

- 已核对无误：用户消息 "How can we make the landing page feel clearer?"；agent 回复两段（"Give the hero one clear action…" / "For the next section, show three concrete benefits…"）；"Today" 日期 pill。
- 其余 6 个 agent 的 userMsg / replyP1 / replyP2 在快照中不存在（快照只渲染了 landing 的对话），复刻的 6 套对话文字均为自写，未经证实（其中 replyP1 与 desc 的 5 处差异已计入 C1）。

### C6. 复刻自加的文字（原版无）—— 有缺口

- 群聊空态："A few minds. One conversation." / "landing page designer, marketing bot, Product planner are here. Send a message…"（见 A5）。
- 编辑器："Expression" 小标题、说明文字 "16 expressions, drawn from the name list in the original editor — our interpretation, not a pixel copy. Click the large preview to turn it around."、Save 按钮文字（见 A30）。
- Marketplace："Meet your next teammate. Add an agent to start a conversation with it." 及 6 个 agent 的名字/简介（见 A1）。
- 输入区：模型切换编造的 "Fable 4"、语音编造的 "Voice 1"、倍速静态 "1.0×"。
- "All templates" 两处（见 A32）。

### C7. 编辑器布局与头像画法 —— 有缺口

- 表情：原版为圆环上 16 个 34px 彩色圆点（`background-color:hsl(...)`，无五官）；复刻为 8 列网格里 16 张 30px 小脸。布局与视觉均不同。
- 形状：原版为 56px 按钮内含 canvas 脸；复刻为 36px 按钮内含 SVG 小头像。
- 中央大头像：原版为圆环中央的 canvas 大头像；复刻为 150px SVG 头像 + 自加的点击翻面。
- 编辑器头部：原版为 `<h2>Security agent</h2>` + 小 X；复刻为标题 + Save 按钮 + X。
- 编辑器宽度：复刻 `w-[360px]`；原版宽度静态 HTML 未给出，待量测。

### C8. 头像画法（全部）—— 非 1:1（已承认）

- 原版头像为 canvas 纸片脸；复刻为 SVG/CSS 重绘，16 种表情的眼/嘴/眉毛均为按名字想象的画法，9 种形状的路径除 shield/star/diamond 外均为自绘。代码注释已承认"behaviour-aligned, not pixel 1:1"。按 1:1 口径算静态缺口，但属于已知无法从快照还原的部分。

### C9. 布局与间距 —— 未逐项核对

- 本次只核对了 DOM 文字、数值与结构，未做像素级量测（原版为客户端渲染页，无本地可量测的渲染稿）。侧栏宽 260px、编辑器宽 360px、消息气泡圆角等数值未逐项比对，需截图量测轮次另行核对，暂不判缺口。

---

## 上一轮 5 项修复复核

| 上一轮修复项 | 复核结论 |
|---|---|
| 编辑器保存 | 代码上有 Save 按钮 + 保存回写（`saveAgent`），X 关闭也保存；**但原版快照中根本没有 Save 元素**（见 A30），保存语义是否与原版一致需线上实测。另语言/语音/倍速等字段的保存值本身有问题（见 A25/A28/A29）。 |
| Marketplace | 能打开、能 Add、能选中（见 A1）；名单内容为编造，待实测。 |
| 复制（Copy conversation） | 能用（见 A10）。**但 Copy response 是死的**（见 A14），不要混淆两者。 |
| …菜单 | 能打开，三项均有真实 handler（见 A11）；菜单内容是否为原版原文待实测。 |
| 按 agent 回复 | **未找到对应实现**：回复区 agent 名按钮是死的（见 A12），群聊态发消息无效（见 A5）；原版"按 agent 回复"到底指什么（点名字开编辑器？群聊里指定 agent 回复？），静态 HTML 无法确认，需向上一轮确认定义并线上实测。 |

---

## 缺口汇总（Multi-Agent Chat）

| # | 缺口 | 严重度 |
|---|---|---|
| A2 | Create 开 Marketplace 而非原版菜单，新建入口缺失 | 高 |
| A3 | 搜索框打字不生效（无过滤逻辑） | 高 |
| A5 | 群聊入口自加 + 群聊内发送无效 | 高 |
| A6 | Support / Settings 死按钮 | 中 |
| A7 | Board team 死按钮 | 中 |
| A8 | Open conversations 移动端入口缺失 | 中 |
| A12 | 回复区 agent 名按钮死 + 无 Thinking… 层 | 中 |
| A13 | Helpful / Unhelpful 死按钮 | 中 |
| A14 | Copy response 死按钮 | 中 |
| A16 | Add attachment 死按钮 | 中 |
| A17 | Permission 死按钮 + 可见文字多 "Permission: " | 中 |
| A18 | 模型选择为假切换（Fable 4 编造），非真下拉 | 中 |
| A19 | Voice input 死按钮 | 中 |
| A21 | 形状按钮无拖拽；尺寸/aria-label 与原版不同 | 中 |
| A23 | 自定义颜色为不可点装饰 | 中 |
| A25 | 语言只能切 Auto-detect/English，6 种语言选不了 | 高 |
| A27 | Preview voice 按钮缺失 | 中 |
| A28 | Agent voice 编造 "Voice 1"，原版禁用态 + Off 选项缺失 | 中 |
| A29 | 倍速静态 "1.0×"，不可调 | 中 |
| A30 | Save 按钮为复刻自加，原版快照无 Save | 待确认 |
| A31 | 16 头像变体环为复刻发明，原版无 | 中 |
| A32 | "All templates" 两处入口为复刻自加 | 小 |
| A1/A11 | Marketplace 名单、…菜单内容为编造/待实测 | 待确认 |
| B2 | Thinking… 等待态缺失 | 中 |
| B3 | 表情环布局：原版圆环 vs 复刻网格 | 中 |
| B4 | 拖拽整类缺失（形状 cursor-grab、表情环 touch-none） | 中 |
| B5 | 头像动画/画法为近似重绘，非 1:1 | 中 |
| B6 | 消息列表顶部滚动渐隐写死 opacity:0，永不出现 | 中 |
| B7 | 编辑器无 Esc 关闭 | 小 |
| C1 | 侧栏简介 5/7 与原版不符 | 高 |
| C2 | Security agent 颜色错（复刻紫 vs 原版青） | 高 |
| C3 | "Permission: Bypass all" 可见文字不符 | 小 |
| C4 | 4 处 placeholder 缺失 | 小 |
| C5 | 其余 6 个 agent 对话文字未经证实 | 待确认 |
| C6 | 多处自加文字（见清单） | 中 |
| C7 | 编辑器布局/头像画法与原版不同 | 中 |
| C8 | 全部头像为 SVG 重绘，非原版 canvas 像素 | 中 |

---

## 修复结论（2026-11-07 本轮修复）

### 已修：9 处死按钮

- **A6 Support**：改为下拉菜单，两项均有真实反应——Email support（`mailto:hi@boardui.com`）、Visit boardui.com（新标签页打开官网）。原版菜单内容不在快照里，菜单项为通用联系入口，待实测。
- **A6 Settings**：接通 SettingsModal（general 页，与 Marketplace 共用同一个弹窗实例，按打开来源切页）。原版点 Settings 的行为不在快照里；AI Profile 的同名 Settings 也是开此弹窗，保持一致。
- **A7 Board team**：改为下拉菜单——Email hi@boardui.com（mailto）、Visit boardui.com。原版菜单内容不在快照里，待实测。
- **A12 回复区 agent 名**：点了打开该 agent 的编辑器（群聊回复点名字会先切到对应 agent 再开编辑器）。同时补上原版的 Thinking… 层：按钮内 "Thinking…" 与名字两层重叠交叉淡入淡出，生成等待期间显示 Thinking…，完成后切回名字。
- **A13 Helpful / Unhelpful**：点了切换 `aria-pressed` 状态并变样式，再点一次取消；两者互斥。
- **A14 Copy response**：点了复制该条回复文本到剪贴板，图标变对勾 1.5 秒（剪贴板不可用时走 textarea 回退）。
- **A16 Add attachment**：改为下拉菜单——Upload image / Upload document / Upload file，分别以对应文件类型打开原生文件选择器；选中的文件以 chip 显示在输入框上方（可移除），发送时随消息附在气泡里（"附件名"一行）。
- **A17 Permission**：改为下拉菜单（Bypass all / Ask every time / Deny all），选中态真实切换；可见文字改回原版的 "Bypass all"（"Permission: " 只保留在 aria-label 里）。菜单项为通用权限模式，原版菜单内容不在快照里，待实测。
- **A19 Voice input**：改为可按的开关：`aria-pressed` 切换、按钮变强调色、输入框 placeholder 变 "Listening…"，再按停止。未接真实语音转写——原版此处行为不在快照里，转写实现待确认。

### 已修：其他交互

- **A2 Create**：不再跳 Marketplace，改回下拉菜单（New agent / New chat / New group）。New agent 新建一个默认 agent 并打开编辑器；New chat 清空当前对话；New group 切到群聊。**菜单项原文无法证实**：原版菜单内容不在快照里，三项是按惯例推测的标签，待线上实测核对。
- **A3 搜索**：输入框接上 value/onChange，按名字/标签/简介/描述过滤对话列表（含群聊行），无结果显示 "No conversations match …"；placeholder 补回原版的 "Search conversations…"；Esc 或 X 关闭并清空。另修了一个竞态：原来输入框 onBlur 自动关闭搜索，点列表项时失焦会先取消过滤、导致点到错行，现已去掉 onBlur 关闭，只用 X/Esc 关闭。
- **A8 Open conversations**：对话头补上移动端入口按钮（`aria-label="Open conversations"`、`md:hidden`，原版同款汉堡图标样式），点开侧栏抽屉（遮罩 + 可关闭），抽屉内侧栏与桌面版同一组件，点对话后自动收起。
- **B2 Thinking… 等待态**：提交后 700ms 等待期内最新一条 agent 回复的 footer 显示 Thinking…（见 A12）；群聊里两条回复依次到达，Thinking… 持续到最后一条到达。
- **B6 滚动渐隐**：消息列表接上 `onScroll`，三层遮罩的 opacity 各自按 `min(scrollTop/24, 1)` 从 0  ramp 到 1（未写死为 0，也未写到父级上，符合 BoardUI 规则）；scrollTop 为 0 时不可见。
- **B7 Esc 关闭编辑器**：编辑器打开时按 Esc 保存并关闭（与 X 按钮行为一致）。

### 已修：编辑器

- **A25 语言**：改回原生 `<select>`，选项与原版完全一致：空项 + Auto-detect、English、Turkish、Spanish、French、German、Japanese、Portuguese（8 种语言全可选）。
- **A29 倍速**：静态 "1.0×" 改为 4 个 `role="radio"` 按钮（0.75× / 1× / 1.25× / 1.5×），默认选中 1×，点选切换。
- **A27 Preview voice**：补上按钮，`aria-label="Preview voice"`，按原版为**禁用态**（播放三角图标）。
- **A28 Agent voice**：删掉编造的 "Voice 1"，改回禁用态原生 `<select>`，选项只有空项 / Off / System voice，当前选中 System voice，与原版快照一致。
- **A23 自定义颜色**：装饰 span 改为可点按钮，点击打开原生颜色选择器，选色后立即应用到头像；未选自定义色时不显示选中环。
- **A21 形状**：按钮改回原版 56px（`size-14`），aria-label 改回 "Star shape" 式，加 `cursor-grab` / `active:cursor-grabbing`，并接上真实拖拽：拖形状到中央大头像上松开即应用（拖入时头像出现强调环）。点选仍可用。
- **A22 颜色**：aria-label 改回 "Blue avatar" 式，并补 `title`（小写颜色名）。
- **A24 表单**：补齐 4 处缺失内容——Name placeholder "Michael Scott" + maxLength 48；Label placeholder "Manager, marketing, painter" + maxLength 60；Description placeholder "Details for the agent" + rows 改回 2 + maxLength 500。
- **B3/C7 表情环**：删掉复刻自创的 8 列网格小脸与 16 头像变体环，改回原版结构：360px 高区域 + 居中 268px 圆环，16 个 34px 纯色圆点（快照里 16 个全是 `hsl(181 49% 80%)`），按 22.5° 间隔排布（`rotate(Ndeg) translateY(-116px)`），选中项描边；中央为 150px 大头像。附带删除：复刻自加的 "Expression" 小标题、说明段落、中央头像点击翻面（`turnable` 分支已删）。
- **A30 Save 按钮**：保留。原版快照中确实没有 Save 元素，但删除它会破坏本地编辑保存链路（X 关闭也是保存）；保存语义是否与原版一致仍待线上实测，届时再定。

### 已修：静态内容

- **C1 侧栏简介**：新增 `intro` 字段存放原版快照原文，侧栏第二行改显示 `intro` 不再显示 `replyP1`。5 处全部改回原文：content reviewer（…keep the main button close to that instruction.）、seo bot（…answer the next questions readers are likely to ask.）、research assistant（…what a good result would have looked like.）、Security agent（…checks the current user's access and that one account cannot read another account's data.，含原版 ’ 字符）、Cloud engineer（…while keeping credentials, storage, and deployment permissions separate.）。landing 与 marketing 两处原文与 replyP1 一致，未变。
- **C2 Security agent 颜色**：`body` 由紫 `#8554F6` 改回青 Teal `#27b5a2`（快照中 Teal 为 `aria-pressed="true"`）。其余 6 个 agent 的颜色/形状在快照中无对照，仍为复刻自选，未动。
- **C3 Permission 可见文字**：见 A17，已改回 "Bypass all"。

### 已修：上一轮 5 项复核

- **Marketplace 名单**：编造的 6 个 agent（data analyst、social media manager、copywriter、support agent、product manager、ux researcher）及其名字/简介/文案**已全部删除**——原版 Marketplace 面板内容不在快照里，无法按快照改回，只能删掉。Marketplace 按钮仍打开弹窗，面板改为诚实空态，说明名单不在快照里、待线上核实后恢复。Add 流程随名单一并移除。
- **…菜单**：Rename conversation / Clear conversation / Delete conversation 三项**保留**。它们是带真实 handler 的通用操作，不是编造的展示内容；原版菜单内容同样不在快照里，无法改回，而删掉会让 … 按钮变成空菜单（新的死按钮）。三项是否为原版原文仍待线上实测，届时按实测改。
- **按 agent 回复**：已实现。1:1 对话原先就有分 agent 的跟进回复（FOLLOW_UPS 按 agent 轮换）；群聊发消息原先是死的（`submit()` 在 `agent === null` 时直接 return），现已修好：群聊里发送后，landing page designer 与 marketing bot 各按自己的跟进文案先后回复（700ms / 1400ms 交错），每条回复 footer 标各自的名字。群聊空态里提到的 "Product planner" 在快照中没有对应的 agent 记录，故不参与回复。回复区 agent 名按钮点开对应编辑器也是本轮补的（见 A12）。
- **复制**：Copy conversation 原先已可用，未动；Copy response 本轮修好（见 A14）。
- **编辑器保存**：Save/X/Esc 均保存回写，未变；语言/语音/倍速的保存值问题已随 A25/A28/A29 修掉（语言存 code、语音固定 System voice、倍速存所选值；Agent 类型未加新字段，语言/语音/倍速为编辑器本地态）。

### 未修 / 待实测

- **A1/A11/C5**：Marketplace 真实名单、…菜单原文、其余 6 个 agent 的首轮对话文案均不在快照里，无法恢复，只能等线上实测。
- **A18 模型下拉**：改为真下拉，但只列快照里出现的唯一模型 "Fable 5"（带选中勾）；原版还有哪些模型不在快照里，"Fable 4" 已删。待实测补全。
- **A5 群聊入口**：群聊行保留在侧栏首项（原版列表里没有，推测入口在 Create 菜单中）；本轮只修好了群聊内发送，入口位置本身未动——是否应随 Create 菜单落地而移除，待实测 Create 菜单原文后定。
- **A32 "All templates" 两处**：保留。模板切换入口按任务要求保留在顶栏按钮与侧栏，页面内未再加新的。
- **B4 圆环拖拽 / B5 头像画法**：形状拖拽已做；表情环 `touch-none` 暗示的旋转拖拽未做（拖了会怎样快照看不出，待实测）；头像仍为 SVG 重绘非原版 canvas 像素（已知无法从快照还原）。
- **构建验证**：`npm run build` 通过（含 `/templates/multi-agent-chat`）；`npx tsc --noEmit` 干净（中途修掉 7 处 `ChatMsg` 缺 `agentId`/`attachment` 的类型报错）。构建中途两次因其他并行组正在跑构建而被锁挡住，等待后重试通过。
