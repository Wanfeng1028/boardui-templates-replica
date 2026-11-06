# Multi-Agent Chat 头像逼近报告

- 日期：2026-11-07
- 范围：只改 `app/templates/multi-agent-chat/page.tsx`（未提交、未 push）；聊天逻辑、其他模板页、组件、样式文件均未碰。
- 依据：`investigation-report.md` 第 3 节（原版 canvas 头像的公开证据：16 表情名、9 形状名、9 组径向渐变色值、独立眨眼/游走、折叠层、立体转身、`prefers-reduced-motion`）。

## 做了哪些逼近

| 原版行为 | 本轮做法 | 落实 |
|---|---|---|
| 两只眼睛独立游走 | 左右眼各包独立 `<g>`：左眼 `bui-wander-l`（7s，复用 `agent-avatar.tsx` 的 `bui-wander` 轨迹），右眼 `bui-wander-r`（8.5s、不同轨迹、`-2.3s` 延迟） | 已做，全页所有头像生效 |
| 两只眼睛独立眨眼 | 左眼 `bui-blink-l`（4.4s），右眼 `bui-blink-r`（5.3s、延迟 = 左眼延迟 + 1.3s）；侧栏仍按 agent 错开 `blinkDelay` | 已做；Wink 表情即左眼闭、右眼睁 |
| 16 种表情 | `EXPRESSIONS` 数据表（眼型/嘴 path/可选眉毛/腮红），编辑器新增 Expression 网格（16 个实时迷你预览，8 列 × 2 行）；选中存到 `Agent.expression`（可选字段，默认 Neutral），头像按表情渲染；保存后侧栏/顶栏/署名行同步变 | 已做，16/16 |
| 9 种形状 | 补齐 heart / cloud / slender / pocket / petal / flower 的 path（shield / star / diamond 沿用旧 path）；删掉原版没有的 circle，全仓无残留 | 已做，9/9 |
| 9 组径向渐变 | `AVATAR_COLORS`，色值逐字取自调查报告 3.3 节；每头像实例用 `useId` 生成唯一 `radialGradient`（`cx 50% cy 42% r 68%`）+ 左上白色高光椭圆；未知色（如编辑器形状按钮的灰色）回退纯色填充 | 已做，9/9 |
| 形状 morph | 形状切换时脸部 `<g key={shape}>` 重挂，播放 0.32s scale/fade（`bui-morph`），视觉上是"变过去"而非硬切 | 近似（见"做不到"） |
| 立体转身 | 编辑器大预览可点：`rotateY(180deg)`（复用 `agent-avatar.tsx` 思路）+ `perspective: 600px`；Playwright 实测转后 transform 为 `matrix3d(-1, 0, 0, 0, 0, 1, 0, 0, 0, 0, -1, 0, 0, 0, 0, 1)` | 已做（仅编辑器大预览；侧栏头像在按钮内，不嵌套可点元素） |
| 减弱动效 | `@media (prefers-reduced-motion: reduce)` 一行停掉眨眼/游走/morph 全部动画 | 已做 |
| 编辑器形状/颜色选择器 | 形状 4 个 → 9 个；颜色圆点由 `EDITOR_COLORS`（已删）改为 9 组渐变（圆点本身就是径向渐变）；variants 环改为 7 个 agent + 9 色 × 9 形状轮换 | 已做 |

## 自选映射（原版各 agent 默认色无法反推，代码注释已注明）

- landing：Green `#36c15c → #009f13` / shield；reviewer：Blue `#437EF7 → #004DE9` / heart；marketing：Pink `#E34798 → #D3006D` / star；seo：Orange `#f47327 → #d83f00` / diamond；research：Teal `#27b5a2 → #00957c` / cloud；security：Violet `#8554F6 → #3E00CD` / shield；cloud：Cyan `#1bb4ce → #0093ad` / slender。
- Marketplace：data-analyst Lime / petal；social-manager Red / flower；copywriter Blue / slender；support-agent Green / heart；product-manager Orange / pocket；ux-researcher Pink / cloud。
- 侧栏群聊胶囊与群聊空态的三人头像同步换成新色值（绿盾 / 粉星 / 青菱）。
- 全部 agent 默认表情 Neutral。

## 每种表情的落实（16/16，均为"我们理解的画法"，非原版逐像素）

- Neutral：睁眼 + 一字嘴。Happy：弯眼（∩）+ 大笑 + 腮红。Angry：怒眉 + 撇嘴。Thinking：眼珠侧移 + 单眉上扬 + 平嘴。Shook：睁大眼 + 扬眉 + 张圆嘴。Curious：一大一小眼 + 单眉 + 小圆嘴。Wink：左闭右睁 + 笑 + 腮红。Sleepy：半闭眼 + 眼睑线 + 平嘴。Sad：内高眉 + 撇嘴。Worried：内扬眉 + 波浪嘴。Skeptical：一眉扬一眉平 + 斜视 + 斜嘴。Focused：眯眼 + 平眉 + 一字嘴。Excited：睁大眼 + 扬眉 + 张大笑（填充）+ 腮红。Calm：弯眼 + 小笑。Shy：眼下移 + 浓腮红 + 小笑。Confused：一眉扬一眉垂 + 斜视 + 波浪嘴。
- 闭眼/弯眼态（Happy、Wink 左眼、Calm）不挂眨眼/游走动画（已是闭合态）；其余眼型均独立眨眼 + 独立游走。

## 做不到的部分与原因（诚实说明，不声称 1:1）

- **折叠层的纸片质感**：原版 `foldShape` / `foldDepth` 是 canvas 逐像素画的翻折阴影/厚度，无公开算法与数值。SVG 只能用"底部半透明深色带 + 一条淡色折边线"模拟（已按形状裁剪），近看不是同一种质感。
- **形状 morph 的逐帧中间态**：原版是 canvas 逐帧插值，中间帧由其 morph 算法决定；本轮是 0.32s 的 scale/fade 过渡，"看起来在变"，逐帧对照必然不同。
- **16 种表情各自的具体五官画法**：快照只有 16 个名字，无任何像素/矢量数据；本轮 16 套五官是按名字合理绘制的，无法验证与原版一致。
- 一句话口径：**行为对齐、像素近似**，不是 1:1。

## 验证

- `npx tsc --noEmit`：通过（0 错误）。
- `npm run build`：通过，`/templates/multi-agent-chat` 正常预渲染。
- Playwright 自查（`shots/mac-avatar/mac-avatar-shot.js`，`serve out -l 3100`，1440×900）：DOM 自检——`radialGradient` 实例 45 个、表情按钮 16 个、形状按钮 9 个、颜色按钮 9 个；截图 3 张见下。
- 功能探针（`shots/mac-avatar/mac-avatar-probe.js`）：点选 Wink 后大预览 `aria-label` 变为 "landing page designer, Wink"；点大预览转身 transform 为 rotateY(180deg) 的 matrix3d；点 Save 后侧栏该 agent 头像变为 "landing page designer, Wink"；`prefers-reduced-motion` CSS 在位。
- 截图（1440 宽）：
  - `shots/mac-avatar/mac-avatar-default-1440.png`——侧栏 7 头像 + 顶栏胶囊
  - `shots/mac-avatar/mac-avatar-editor-1440.png`——编辑器大预览 + 9 形状 + 9 渐变色点 + 表情网格
  - `shots/mac-avatar/mac-avatar-expressions-1440.png`——表情网格近景
- 目视结论：侧栏 7 头像形状/渐变清晰可辨；编辑器大预览（绿盾 Neutral 脸）正常；16 表情迷你预览在 30px 下可区分。

## 给 REPLICA-README.md 的建议段落（本轮权限只许改 page.tsx，未动 README，请 parent 粘贴）

> Multi-Agent Chat 的头像是原版 canvas"纸片脸"的 SVG/CSS 重建：9 种形状、9 组径向渐变、16 种表情、两只独立游走/眨眼的眼睛、点大预览可立体转身、遵循 `prefers-reduced-motion`。行为已对齐，但不是逐像素 1:1——16 种表情的五官画法、形状 morph 的中间帧、折叠层的纸片质感均无公开像素数据可抄，是按原版公开的名字与色值合理绘制/模拟的；各 agent 的默认配色与形状也是自选映射，原版默认值无法从公开快照反推。
