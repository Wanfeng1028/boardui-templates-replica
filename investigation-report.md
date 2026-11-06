# BoardUI 复刻项目调查报告：头像 canvas 动画与官方模板聊天是否接真实模型

- 调查日期：2026-11-07
- 调查范围：`~/workspace/boardui-templates-replica/`（只读调查，未改任何模板页、组件、样式文件）
- 证据来源：`tpl-pages/multi-agent-chat.html`、`tpl-pages/ai-chat.html`（官网演示页服务端 HTML 快照）、`docs/api-chat-route.ts.bak`、`INVENTORY.md`、`REPLICA-README.md`、本仓库复刻代码（`app/templates/multi-agent-chat/page.tsx`、`components/application/pro/agent-avatar.tsx`、`components/application/agent-chat/agent-chat.tsx`），以及 2026-11-06 实测抓取的官网页面文本：`boardui.com/llms.txt`、`boardui.com/components/multi-agent-chat`、`boardui.com/components/ai-chat`、`boardui.com/components/chat-starter`、`boardui.com/templates/multi-agent-chat`、`boardui.com/templates/ai-chat`
- 方法说明：SSR 快照只含服务端渲染的 HTML 与 RSC 数据，不含客户端 JS（JS 在 boardui.com 的 `/_next/static/` 下，未存入本仓库）。因此"快照里没有 fetch"只能证明快照层面没有，不足以单独定性；调查 5 的定性结论以官网组件文档页的原话为准，快照证据作佐证。子 agent 无 live browser，未做"在官网点发送"的实测。

## 结论总览（先说结论）

**调查 3——头像 canvas 动画：** 原版头像是一个 canvas 画的"纸片脸"：9 种几何剪影轮廓 + 可折叠层 + 两只会独立眨眼、独立游走的眼睛 + 16 种表情 + 立体转身动画，配色走 9 个径向渐变色。现有复刻的 SVG 脸只逼近了"形状 + 固定笑脸 + 同步眨眼"这一层；眼珠游走、16 种表情、形状 morph、折叠层、立体转身这些原版已公开的能力，复刻在模板页上基本都没做（但 `components/application/pro/agent-avatar.tsx` 里其实已经有游走 + 眨眼 + 转身的现成实现，只是没用到模板页上）。纯 CSS/SVG 可以进一步逼近到"肉眼难分辨"的程度，唯独 canvas 的折叠纸片 morph 质感和精确变形曲线无法逐像素还原——因为没有源码、没有像素数据。

**调查 5——官方模板聊天是否接真实模型：** 原版演示页也是 demo，不接真实模型。官网组件文档页原话："The preview uses labeled sample replies. Supply `onRespond` to connect your service"（预览用的是带标注的示例回复；要接自己的服务请传 `onRespond`）。**因此 REPLICA-README.md 里"官方模板接真实 agent"是错的，应改为与原版行为一致。** 这句话在 REPLICA-README.md 里有两处：第 68 行和第 78 行（注意：上游免费版 README.md 里没有这句话，错的是复刻的 REPLICA-README.md）。

---

## 调查 3：头像 canvas 动画到底画了什么

### 3.1 快照里的 canvas 证据（`tpl-pages/multi-agent-chat.html`，178,043 字节）

该文件出现 `canvas` 字样 78 次，共 30 个 `<canvas>` 标签（另有 8 次出现在 `ai-chat.html` 的页脚/模板描述里，与头像无关——ai-chat 快照里没有任何头像 canvas）。30 个头像 canvas 的分布：

| 位置 | 数量 | 尺寸 | aria-label |
|---|---|---|---|
| 侧栏 7 个 agent 项 | 7 | 40×40 | 各 agent 名：`landing page designer`、`content reviewer`、`marketing bot`、`seo bot`、`research assistant`、`Security agent`、`Cloud engineer` |
| 顶栏头像胶囊 | 1 | 20×20 | `landing page designer` |
| 回复署名行（消息下方小头像） | 1 | 32×32（外层 span 缩放 0.625 后显示为 20×20） | `landing page designer` |
| 编辑器表情环 | 16 | 34×34（class `size-[34px]`，`aria-hidden`） | 见 3.2（16 种表情名） |
| 编辑器实时大预览 | 1 | 162×162 | `Security agent, live avatar preview` |
| 编辑器形状选择器 | 9 | 56×56 | 9 种 `X silhouette`（见 3.3） |

关键结构特征：

- **所有 canvas 在 SSR HTML 里都是空标签**，没有任何 `width`/`height` 属性、没有任何像素数据、没有任何内联绘图代码。画面是运行时由外部 JS（`/_next/static/` 下的 chunk，未存入本仓库）画上去的。所以：**canvas 里具体画了什么线条、眼睛多大、嘴是什么形状，无法从这个 HTML 文件反推。** 任何声称"原版眼睛是某某画法"的说法都没有证据。
- canvas 的 CSS 尺寸一律是 `style="width:XXpx;height:XXpx;max-width:100%;object-fit:contain"`，即 canvas 是按"图片"方式等比放进槽位的。
- 快照全文搜索 `blink`、`eye`、`wander`、`wink`（小写）均为 0 次；`eye` 出现 1 次（在 "eyes wander" 之外的无关文本里——实际是 `aria-label="Agent emotion"` 附近无此词；全文唯一的 eye 出现在 llms.txt 引用之外的 RSC 文本中，与绘图无关）。也就是说，**眨眼、眼珠移动这两个动画特征在快照 HTML 里没有任何痕迹**，它们的唯一来源是官方文档描述（见 3.4）。

### 3.2 表情环：16 种表情（证据完整）

编辑器里有一个直径 268px 的圆形选择器（`role="group" aria-label="Agent emotion"`，`size-[268px] rounded-full`），16 个 34px 圆形按钮沿半径 116px 排布，相邻间隔 22.5°（`rotate(0deg) / 22.5deg / 45deg … 337.5deg translateY(-116px)`）。16 个按钮的 aria-label 按角度顺序是：

`Neutral`、`Happy`、`Angry`、`Thinking`、`Shook`、`Curious`、`Wink`、`Sleepy`、`Sad`、`Worried`、`Skeptical`、`Focused`、`Excited`、`Calm`、`Shy`、`Confused`

每个按钮里都嵌一个 34px canvas（`aria-hidden`），按钮底色在快照里全部是同一个值 `hsl(181 49% 80%)`（浅青色，16 次全同）。这说明：表情切换时 canvas 重绘画的只是表情本身（眼睛/嘴的形态），底色不变；且**底色是统一的浅青，而不是每个表情一种颜色**。文档页还说："The emotion selector repeats as you scroll and supports arrow keys"（表情选择器滚动时循环重复，支持方向键）。

### 3.3 形状与颜色：9 种剪影 + 9 色径向渐变（证据完整）

形状选择器（`role="listbox" aria-label="Avatar shape"`，底部一排 56px 按钮）有 9 种形状，aria-label 为：`Star shape`、`Heart shape`、`Cloud shape`、`Diamond shape`、`Shield shape`、`Slender shape`、`Pocket shape`、`Petal shape`、`Flower shape`。每个形状按钮里是一个 56px canvas，aria-label 为对应的 `X silhouette`（如 `star silhouette`）。当前选中态是 `Shield shape`（按钮带 `bg-background-secondary-default ring-1`）。

颜色选择器（`role="group" aria-label="Avatar color"`，一排 26px 圆点）有 9 个命名色 + 1 个自定义色（`Custom avatar color`）。9 个色的径向渐变色值已全部从快照取到（格式均为 `radial-gradient(closest-side circle at 50% 50%, A 0%, B 100%)`，另叠加白色高光层）：

| 颜色 | 渐变起止 |
|---|---|
| Blue | `#437EF7` → `#004DE9` |
| Teal（当前选中，`aria-pressed="true"`） | `#27b5a2` → `#00957c` |
| Violet | `#8554F6` → `#3E00CD` |
| Pink | `#E34798` → `#D3006D` |
| Red | `#E74241` → `#CF0100` |
| Orange | `#f47327` → `#d83f00` |
| Cyan | `#1bb4ce` → `#0093ad` |
| Lime | `#88c81c` → `#6aa400` |
| Green | `#36c15c` → `#009f13` |

另有 `Agent voice`（语音）、`Playback speed`（播放速度）等编辑器字段，与头像绘制无关。

### 3.4 官方文档对头像的描述（决定性文字证据）

- `boardui.com/llms.txt`（2026-11-06 抓取）L379-380："Agent Avatar: Animated paper avatars with wandering eyes, expressive faces, nine silhouettes, and dimensional turn animations."（动画纸片头像：游走的眼睛、表情脸、九种剪影、立体转身动画。）
- `boardui.com/components/multi-agent-chat`（2026-11-06 抓取）"Animated avatars" 一节原话："Avatars share a lightweight Canvas renderer. Eyes wander and blink independently, shapes morph together with their folded layer, and reduced-motion preferences are respected."（头像共用一个轻量 Canvas 渲染器。眼睛独立游走、独立眨眼，形状与其折叠层一起变形，并遵循减弱动效偏好。）
- 同页给出的用法示例（可直接证明 API 形态）：
  `import { AgentAvatar } from "@/components/application/agent-avatar/agent-avatar";`
  `import { FOLD_CONFIG } from "@/components/application/agent-avatar/model";`
  `<AgentAvatar config={{ ...FOLD_CONFIG, foldShape: "slender", foldDepth: 15, lookAt: "wander" }} size={162} />`
  其中 `size={162}` 与快照里实时预览 canvas 的 162×162 完全吻合；`foldShape` / `foldDepth` / `lookAt: "wander"` 三个配置项证明：脸有"折叠层"（fold）概念、有折叠深度参数、有"注视模式"（wander 为其中之一）。
- `boardui.com/components/multi-agent-chat` "What's included"："Ten agents, seven starter conversations"——注意与快照的出入：快照侧栏实测只有 7 个 agent，官方称 10 个 agent；多出的 3 个未在模板页 HTML 中出现（可能来自 Marketplace 或新建），此处不展开，但"10 个"不应直接写进复刻文档当作模板页实测数。
- `INVENTORY.md` L61 的转述与 llms.txt 一致："动画纸片头像：游走的眼睛、表情脸、九种剪影、立体转身动画"。

### 3.5 结论①：canvas 画的脸大概是什么样（只写证据能支撑的）

证据能支撑的说法：

- **本质**：一张"纸片脸"（paper avatar），由 canvas 实时绘制，不是图片、不是 SVG。渲染器是轻量的、共享的（同一渲染器画所有尺寸的头像）。
- **形状**：脸的外轮廓是 9 种几何剪影之一（星形、心形、云形、菱形、盾形、细长形、口袋形、花瓣形、花形），轮廓带一个"折叠层"（fold），换形状时轮廓与折叠层一起变形（morph），折叠深度可配（示例 `foldDepth: 15`）。
- **配色**：脸的主色是 9 个径向渐变之一（色值见 3.3 表），另有白色高光层；编辑器当前选中 Teal（`#27b5a2 → #00957c`）。各 agent 默认脸色的具体色值**无法**从快照反推——侧栏 7 个 canvas 没有任何颜色信息；REPLICA-README 里"各 Agent 的具体配色是按粉彩描述分配的（原版 canvas 颜色无法从 HTML 反推）"这半句仍成立，但应补一句：编辑器 9 色色值是可以反推的（已取到，见 3.3）。
- **五官**：两只眼睛 + 嘴（表情脸）。眼睛的动画是"独立游走 + 独立眨眼"（两只眼不同步）；另有 `lookAt` 注视模式，`wander` 是其中一种取值（其他取值未知，无证据，不猜）。
- **表情**：16 种（Neutral / Happy / Angry / Thinking / Shook / Curious / Wink / Sleepy / Sad / Worried / Skeptical / Focused / Excited / Calm / Shy / Confused），表情环上切换；每种表情对应不同的眼睛/嘴画法，但**具体每种表情的嘴型、眉毛、眼型长什么样，快照里没有，无法反推**。
- **其他动画**：立体转身动画（dimensional turn）；遵循 `prefers-reduced-motion`（减弱动效时动画会停或减）。

证据不能支撑、不要写进文档的说法：眼睛的具体画法（圆点还是椭圆、有无高光）、嘴的具体形状、眨眼频率/间隔、眼珠游走的范围与速度、折叠层的视觉形态（是阴影还是翻折边）、16 种表情各自对应的具体五官。这些在公开材料里都不存在。

### 3.6 结论②：现有 SVG + CSS 眨眼逼近的程度

分两处评价（两者不在同一水平，不要混为一谈）：

**（a）模板页 `app/templates/multi-agent-chat/page.tsx`（用户实际看到的页）：逼近程度低，只做了约三分之一。**

- 做了：4 种形状（shield / circle / star / diamond，只有原版 9 种里的 4 种，且 circle 是原版没有的）、粉彩纯色填充（7 个 agent 的色值 `#b9e4a8`、`#b9d9f5`、`#d8b9f2`、`#ffd9a0`、`#a8e3d3`、`#bccdea`、`#a9d2f2` 均为复刻者自编，与原版 9 色渐变无一吻合）、固定微笑嘴（`M15.5 25 Q20 28.5 24.5 25`，所有 agent 同一张嘴）、两只固定椭圆眼（`cx=14/26, cy=17.5, rx=2.3, ry=3.3`）、腮红、CSS 眨眼（`@keyframes bui-blink`，4.4s 周期，`0%,91%,100% scaleY(1) / 94%,96% scaleY(.08)`，两只眼同步眨，侧栏用 `blinkDelay={(i % 5) * 0.7}s` 错开不同 agent）。
- 没做：眼珠游走（眼睛位置完全固定）、16 种表情（只有一种笑脸，编辑器里没有表情选择器）、形状 morph（切换形状是瞬间换 path，无过渡）、折叠层（无）、立体转身（无）、径向渐变色（纯色填充，无高光层）。
- 文件头注释自己也承认："the canvas avatar animation is replaced by a static SVG face with a CSS blink"。

**（b）Pro 组件演示 `components/application/pro/agent-avatar.tsx`（`/pro-components` 页）：逼近程度高得多，但形状与表情仍是自编的。**

- 已有：眨眼（4.2s 周期）+ 眼珠游走（`bui-wander` 7s，`translate(2px,1px) / (-2px,0) / (1px,-1px)` 循环）+ 4 种 mood（happy / calm / thinking / excited，嘴型与眼位随 mood 变，thinking 时眼珠侧移）+ 点击 3D 转身（`rotateY(180deg)`）+ 9 种剪影切换 + 随机按钮。
- 但它的 9 种"剪影"是复刻者自创的动物耳朵（Fox / Cat / Bear / Owl / Robot / Bunny / Panda / Frog / Ghost），与原版 9 种几何剪影（star / heart / cloud / diamond / shield / slender / pocket / petal / flower）**完全不是同一种东西**；mood 只有 4 种 vs 原版 16 种；也没有折叠层与 morph。

### 3.7 结论③：能否用纯 CSS/SVG 进一步逼近——可以，但有明确上限

**可以做的（全部只用 CSS/SVG/少量 JS，不需要 canvas、不需要原版源码）：**

1. **眼珠游走**：零成本。`agent-avatar.tsx` 里现成的 `bui-wander`（7s 平移循环）直接复用到模板页的 `AgentAvatar` 上即可；想更像原版，可把两只眼拆成两个独立动画（不同周期/延迟），对应文档说的 "blink independently"。
2. **独立眨眼**：把现在的整组眼睛一起缩放，改成左右眼各包一个 `<g>`、各给不同的 `animation-delay` / 周期；Wink 表情就是一只眼闭一只眼睁，可直接用现成的 scaleY 动画实现。
3. **16 种表情**：把表情做成数据表——每种表情对应一组 SVG 参数（眼型：睁/闭/弯/斜；嘴 path：笑/平/撇/张；可选眉毛 path；Wink/Sleepy 等闭眼态）。16 个名字已从快照取全，逐个画 16 套五官是纯手绘工作量，没有技术障碍。注意：画出来的是"我们理解的 16 种表情"，不是原版逐像素的样子，文档里应注明这一点。
4. **9 种形状 + 径向渐变**：形状 path 已有 4 种，再补 5 种（heart / cloud / slender / pocket / petal / flower——按快照名单是 9 种，模板页已有 shield / star / diamond，缺 heart / cloud / slender / pocket / petal / flower 共 6 种，circle 应去掉因为它不在原版名单里）；颜色直接用 3.3 表里取到的 9 组渐变色值替换现在自编的粉彩纯色，并叠加白色高光椭圆（快照里颜色按钮自带高光层结构可参考）。
5. **形状 morph 与立体转身**：转身已有现成实现（`rotateY(180deg)`，可直接复用）；形状切换可用 CSS `transition` + FLIP 或 SMIL/`animate` 做 path 插值过渡，视觉上接近"变形"，但插值曲线是自己调的，不是原版的。
6. **减弱动效**：加 `@media (prefers-reduced-motion: reduce)` 停掉眨眼/游走，与原版行为对齐，一行 CSS 的事。

**做不到 1:1 的部分（附原因）：**

- **折叠层的精确质感**：原版脸带一个可配深度（`foldDepth`）的折叠层，canvas 逐像素画出的纸片翻折阴影/厚度，SVG 只能用"一层半透明深色 path + 模糊阴影"模拟，近看不是同一种质感。证据：用法示例里的 `FOLD_CONFIG` / `foldShape` / `foldDepth` 三个配置项只存在于官方文档，数值含义与渲染算法无公开材料。
- **形状 morph 的精确变形过程**：原版是 canvas 逐帧插值，中间态的每一帧都由它的 morph 算法决定；SVG 的 path 插值（需相同点数）或 CSS 变形只能做到"看起来在变"，中间态与原版逐帧对照必然不同。证据：快照里 canvas 是空标签，无任何中间帧数据。
- **16 种表情的逐像素还原**：表情名字有了，但每种表情的眼睛/嘴/眉毛具体画法没有任何公开像素或矢量数据；只能按名字合理绘制，无法验证与原版一致。

一句话：纯 CSS/SVG 能把"会眨眼、眼珠会动、16 种表情、9 种形状、会转身"这些**行为**全部做出来，达到肉眼难分辨；但"折叠纸片的质感"和"变形的每一帧"这两个**像素级细节**没有证据可抄，做不到 1:1，文档里应如实写"行为对齐、像素近似"而不是"1:1"。

---

## 调查 5：原版模板的聊天到底接不接真实模型

### 5.1 结论

**原版演示页（boardui.com/templates/multi-agent-chat 与 /templates/ai-chat）也是 demo，不接真实模型。**

**REPLICA-README.md 里"官方模板接真实 agent"是错的，应改为与原版行为一致。** 具体位置：

- REPLICA-README.md 第 68 行（Multi-Agent Chat 一节）："聊天仍是本地 demo。发送消息后给一条 canned 回复，没有接模型；官方模板接真实 agent。"
- REPLICA-README.md 第 78 行（"与官网原版的差异"一节）："聊天是本地 demo。AI Chat 与 Multi-Agent Chat 发送后均为 canned 回复，不接模型；官方模板接真实 agent。"

建议改法（只改后半句，前半句是对的）："聊天仍是本地 demo。发送消息后给一条 canned 回复，没有接模型；**与原版演示页行为一致——原版预览同样用示例回复，接真实服务需自己实现响应端点。**"

### 5.2 证据①：官网组件文档页的原话（决定性证据）

`boardui.com/components/multi-agent-chat`（2026-11-06 抓取），"Connect your agents" 一节原文：

> "The preview uses labeled sample replies. Supply `onRespond` to connect your service; each participant receives the conversation and an abort signal. Implement the example endpoint in your application. Use `initialWorkspace` for your own starting agents and conversations, and `defaultEditorId={null}` to start with the editor closed. Set `storageKey` to a custom key, or `null` to disable browser persistence."

并附官方示例代码（`MultiAgentChat` 的 `onRespond` 回调）：

```js
<MultiAgentChat onRespond={async (agent, messages, signal) => {
  const response = await fetch("/api/agents/respond", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ agent, messages }),
    signal,
  });
  if (!response.ok) throw new Error("Agent response failed");
  const data = await response.json();
  return data.text;
}} />
```

要点：

- "The preview uses labeled sample replies"——**预览用的就是示例回复**，即演示页本身不接模型。这是官方亲口说的，不是从 HTML 猜的。
- 接真实服务的方式是调用方传 `onRespond` 回调；示例端点是 **`/api/agents/respond`**，由使用者"in your application"自己实现。官方没有提供这个端点的实现，也没有说它背后是哪个模型。
- 同页 "Marketplace and settings" 一节："Marketplace installation is a local demo; connect your own account and permission flows for real integrations."（Marketplace 安装是本地演示；真实集成要接自己的账号与授权流程。）——同一模板里多个功能都是"本地演示 + 自己接"的模式。
- 同页 "What's included"："Ten agents, seven starter conversations … Source, demo data, and the components they depend on ship with the template."（随模板发货的是源码、演示数据和依赖组件。）——"demo data" 再次确认演示内容是写死的数据。

### 5.3 证据②：两份演示页快照里没有任何接模型的痕迹

对 `tpl-pages/multi-agent-chat.html`（178,043 字节）与 `tpl-pages/ai-chat.html`（227,951 字节）全文检索（大小写不敏感）：

| 检索词 | multi-agent-chat.html | ai-chat.html |
|---|---|---|
| `fetch(` | 0 | 0 |
| `/api/`（含 `/api/chat`） | 0 | 0 |
| `websocket` / `WebSocket` / `EventSource` | 0 | 0 |
| `claude` / `gpt-` / `gemini` / `openai` / `anthropic` | 0 | 0 |
| `AI_API_KEY` / `api_key` / `missing_api_key` | 0 | 0 |
| `mock` / `demo` / `canned` / `streamText` | 0 | 0 |
| `fable` / `Fable` | 1（仅 composer 模型按钮显示的 `Fable 5`） | 1（同上） |
| `model` | 2（均为页脚 `/llms.txt` 与 MCP 的无关文本） | 2（同上） |

补充说明：

- 两份快照里的全部对话内容（Multi-Agent Chat 的 7 组对话、AI Chat 的 11 条线程）都是**预渲染在 SSR HTML 里**的写死文本，不是运行时拉取的。
- 唯一的"模型"字样 `Fable 5` 是 composer 模型选择器上显示的标签（复刻页里点它会在 `Fable 5` / `Fable 4` 之间切换）。没有任何真实模型商叫 Fable，这是一个演示用的虚构模型名；它只证明"原版 composer 有模型选择器 UI"，不能证明背后接了模型。
- 局限重申：快照不含客户端 JS chunk，单凭"快照里没有 fetch"不能 100% 排除演示页运行时发请求；但结合 5.2 的官方原话，定性已足够。
- `boardui.com/components/ai-chat` 页（2026-11-06 抓取）全文只描述界面（侧栏、线程、composer、状态栏、代码面板），**只字未提接模型、API key 或示例回复**；`boardui.com/templates/ai-chat` 与 `/templates/multi-agent-chat` 的抓取文本也只有演示线程的写死文案（如 "Agentic chat / update our color tokens for dark mode … / 57%"），同样无任何接模型的说法。AI Chat 没有像 Multi-Agent Chat 那样一句定性的官方原话，但两份快照的零命中 + 演示线程全预渲染 + 同一"模板 = 源码 + 演示数据"的发货模式，足以认定它与 Multi-Agent Chat 同为 demo。

### 5.4 证据③：`docs/api-chat-route.ts.bak`——它到底是什么，别把它当成模板的后端

这个文件是免费 starter 的 `/api/chat` 路由（Vercel AI SDK 流式端点），不是 Pro 模板的后端。文件头注释原文：

> "The chat runtime every BoardUI agent template talks to. This file is the contract the starter's chat screen installs against, and the one any later live chat screen should share …"

它确实能接真实模型：一个环境变量 `AI_API_KEY`，按 key 前缀识别 provider（`sk-ant-` Anthropic 默认 `claude-haiku-4-5`；`sk-or-` OpenRouter 默认 `openai/gpt-5-nano`；`sk-` OpenAI 默认 `gpt-5.4-mini`；`AIza` Google 默认 `gemini-2.5-flash`；`vck_` Vercel AI Gateway；`gsk_` Groq 默认 `llama-3.3-70b-versatile`；`xai-` xAI 默认 `grok-4-fast-non-reasoning`；另支持 Mistral / DeepSeek 需 `AI_PROVIDER` 指明，及任意 OpenAI 兼容服务 `AI_BASE_URL` + `CHAT_MODEL`）。另有 `GET` 配置探针（返回 `configured` / `provider` / `model` / `reason`），供 UI 在无 key 时显示 setup 提示而非报错。

但必须区分三个不同的东西，README 的错误正是把它们混成了一个：

| | 是什么 | 接不接真实模型 |
|---|---|---|
| **(a) boardui.com 上的公开演示页**（`/templates/multi-agent-chat`、`/templates/ai-chat`） | 官网给人看的演示 | **不接**。Multi-Agent Chat 官方原话是 "preview uses labeled sample replies"；AI Chat 无任何接模型的证据 |
| **(b) 买 Pro 后装到自己项目里的模板源码** | 源码 + 演示数据 + `onRespond` 回调壳 | **默认不接**。示例端点 `/api/agents/respond` 要自己实现；背后接什么模型由实现者定，官方不提供 |
| **(c) 免费 chat-starter**（`app/page.tsx` + `/api/chat`） | 可部署的聊天 starter，BYO key | **接**。前提是部署者自己填 `AI_API_KEY`；无 key 时 UI 显示 setup 提示 |

本仓库现状也佐证了这种区分：`app/api/` 目录已不存在（路由被移出构建，只剩 `docs/api-chat-route.ts.bak`）；免费 starter 的 `components/application/agent-chat/agent-chat.tsx` 用 `SwitchingTransport(new DefaultChatTransport({ api: "/api/chat" }), new DemoTransport())`，即**先试 `/api/chat`，不通则降级为本地 demo**——连免费 starter 在本仓库当前形态下跑起来也是 demo。

### 5.5 结论：如果要给复刻接一个免费模型，可行性方案（只给方案，不申请 key、不改代码）

目标：让复刻的 Multi-Agent Chat / AI Chat 在发送后得到真实模型回复，同时保持"与原版行为一致"的文档口径（即明确写这是我们自己接的，不是原版自带的）。

**推荐方案 A（复用现有 .bak 路由，最小改动）：**

1. 把 `docs/api-chat-route.ts.bak` 恢复为 `app/api/chat/route.ts`（文件本身已完整：9 家 provider + custom 端点 + `GET` 配置探针 + `maxDuration = 30` + `smoothStream`），并把 `next.config.ts` 的静态导出（`output: "export"`）改为可跑服务端的部署（静态导出跑不了 API 路由，这是前置条件，需用户定部署方式）。
2. 在服务端环境变量里放一个免费 key（三选一，按免费额度从大到小）：**OpenRouter 免费模型**（`sk-or-…`，默认模型 `openai/gpt-5-nano`，OpenRouter 上 `:free` 后缀模型不计费，但需注意免费模型有速率限制且可能排队）；**Groq 免费层**（`gsk_…`，默认 `llama-3.3-70b-versatile`，免费档有每分钟 token 上限）；**Google Gemini 免费层**（`AIza…`，默认 `gemini-2.5-flash`，免费档有每日请求上限）。key 只能放服务端环境变量，绝不能进 `NEXT_PUBLIC_` 变量（.bak 文件头 SECURITY 一节有明确警告）。
3. 把 Multi-Agent Chat 的 `submit()` 改成调 `onRespond` 式回调：把当前 agent + 对话历史 POST 到 `/api/chat`（消息格式按 AI SDK UI-message stream，即 `useChat` 的默认契约），流式回显；AI Chat 页同理。`Fable 5` / `Fable 4` 的模型选择器可映射为 `CHAT_MODEL` 的两个取值（如 `openai/gpt-5-nano` 与另一免费模型），而不是现在写死的切换文案。
4. 成本与风控：免费档都有速率/日限额，公开部署前必须在路由前加限流（README 与 .bak 的 COST 警告原文都强调了这一点：无 key 上限的公开聊天端点等于替别人付账）；另建议保留现在的 canned 回复作无 key 时的降级（与免费 starter 的 `DemoTransport` 思路一致），并在 UI 上保留"Demo mode / 未配置 key"的提示。

**备选方案 B（严格按官方示例走）：**

1. 不恢复 `/api/chat`，而是按官方文档新建 `/api/agents/respond`（接收 `{ agent, messages }`，返回 `{ text }`），内部再调免费 provider（直调 OpenRouter/Groq/Gemini 的 OpenAI 兼容端点，或复用 .bak 里的 provider 解析逻辑）。
2. 好处是与官方 `onRespond` 契约完全一致（每个 agent 各自收到对话 + abort signal，多 agent 群聊时可逐个调）；代价是多写一层转发，且流式要自己接（官方示例返回的只是 `data.text`，不是流）。

**不推荐的方案**：在浏览器端直接调模型商 API（key 会进 bundle，任何人都能读走盗刷）；以及为演示页申请任何付费 key（免费档够用，且本任务不授权申请 key）。

**工作量估计**：方案 A 约半天（恢复路由 + 改部署方式 + 接 `submit()` + 限流 + 无 key 降级）；方案 B 再加半天。两者都不需要动头像、布局或任何已 1:1 的部分。

---

## 附：本次调查核对过的其他事实（供写文档时引用）

- 模板页快照侧栏 7 个 agent 名与复刻 `AGENTS` 完全一致；复刻的 7 组对话 replyP1/replyP2 与快照逐字一致（抽查通过）。
- 复刻模板页发送后的回复文案是写死的："Noted — I'll take a look at that for the ${agent.name} and draft a tighter version.\nThis is a replica demo reply; no model is connected."（`page.tsx` L923-929，700ms 延迟后出现）。
- AI Chat 复刻页 `page.tsx` L44 注释自述 "local canned replies — no model key"，L237-239 有两段 canned 回复模板；"Fable 5" 模型名与快照一致。
- 快照里编辑器默认打开（显示 Security agent），复刻按用户要求默认关闭——这是已知且已记录的差异，与本次调查无关。
- 官网抓取时间均为 2026-11-06 16:54–16:55 UTC；llms.txt 共 444 行，关键句在 L258-263（Agent runtime / Agent Chat）、L379-380（Agent Avatar）、L392-393（Multi-agent Chat Template）。
