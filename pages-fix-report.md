# BoardUI 复刻 — 任务 4 / 任务 6 修补报告

日期：2026-11-07
范围：仅改 `app/templates/ai-image-generation/page.tsx` 与 `app/templates/hr-management/page.tsx` 两个文件，未碰其他文件，未提交未 push。

## 任务 4 — AI Image Generation 只有 7 张图

### 核实结果：属实

- `public/carousel/` 里确实只有 7 张图：`floral.webp`、`kitchen.webp`、`seafood.webp`、`shark-collage.webp`、`space-squid.webp`、`sunrise.webp`、`vending-machine.webp`。
- 页面 `GALLERY_SEED` 引用了全部 7 张，按顺序配对前 7 条提示词：
  1. Green ape, screenprint halftone → space-squid.webp
  2. Cloud crown, editorial portrait → floral.webp
  3. Cat with a beer, bold linework → vending-machine.webp
  4. Hanok bookshop, pastel duotone → kitchen.webp
  5. Nairobi Vibes, blackletter poster → seafood.webp
  6. Ronin in red, cel-shaded → sunrise.webp
  7. Bloom swirl, impasto abstraction → shark-collage.webp
- 其余 13 条提示词（第 8–20 条）之前只是 Gallery 面板底部的纯文字列表。

### 改动（只改 `app/templates/ai-image-generation/page.tsx`）

- 新增 `PLACEHOLDER_GRADIENTS` / `PLACEHOLDER_TILES`：第 8–20 条提示词各一张图卡，渐变按提示词内容选色（橄榄绿、粉花、 dusty 蓝、海天蓝、粉、深海、霓虹紫、出租黄、暖金、深红、石墨灰、金属绿、工作室灰），只用 BoardUI 主题 token（`--color-chart-*` / `--color-neutral-*`），无 hex、无原始色值，符合项目 AGENTS.md 颜色规则。
- 图卡与 7 张真图卡片同形：同一网格（`grid-cols-1 min-[480px]:grid-cols-2 gap-3`）、同一外框（`rounded-2xl border bg-background-primary-default p-2`）、同一 `aspect-[4/3] rounded-xl` 图区、同一 caption 结构（提示词两行截断 + 风格名）。图区中央放 `RiImageAiLine` 图标，左上角黑底半透明 pill 明确写 **Placeholder**，caption 第二行写 `风格 · Placeholder`，不假装是原图。
- 占位区放在真图网格之后、条件渲染之外（删空图库时仍可见），标题写明 "Prompts 8–20 · gradient placeholders — the original images are Pro-only"。
- 底部 "All 20 original prompts" 列表保留，第 1–7 条仍标 "in gallery"，第 8–20 条改为标 "placeholder"。
- 对话栏底部说明文案同步更新，文件头注释同步说明占位方案。

## 任务 6 — HR Management 页面检查

### 检查结果：有 3 处数字对不上，均已修；其余检查无问题

**问题 1 — "Hires vs leavers" 月度图与 KPI/漏斗矛盾（已修）**
- 原图 Apr–Sep 入职合计 61 人，Q2（4–6 月）28 人、Q3（7–9 月）33 人；但 KPI 写 Q2 新入职 18 人、Q3 24 人，漏斗 Hired 也是 24 人。且 61 人恰等于全年 YTD 入职数，等于默认 Q1 零入职，不合理。
- 改为 Apr 5 / May 6 / Jun 7（Q2=18）、Jul 8 / Aug 7 / Sep 9（Q3=24），半年合计 42 人；离职 Apr 5 / May 6 / Jun 4 / Jul 3 / Aug 2 / Sep 1（半年 21 人）。
- 文案 "Net +40 over the last 6 months (61 hires, 21 leavers)" 改为 "Net +21 over the last 6 months (42 hires, 21 leavers)"。
- 全链路自洽验证：年初 219 人 → Q1 入职 19、离职 11（净 +8 → 227）→ Q2 净 +3（→ 230）→ Q3 净 +18（→ 248）；YTD 入职 61、离职 32、净 +29，与 2026 周期 KPI（248 人、+29 YTD、61 入职）全部对上。校验逻辑以注释写进 `HIRES_LEAVERS` 上方。

**问题 2 — Q2 "New hires" 增量文案与 YTD 总数矛盾（已修）**
- 原 Q2 写 "+2 vs Q1"，倒推 Q1 入职 16 人，则全年入职 16+18+24=58，与 2026 周期 "New hires 61 YTD" 矛盾（Q1 应为 19 人）。
- 改为 "−1 vs Q1"，指示器改为向下（`up: false`，与 Attrition 下降用同一 rose 样式）。

**问题 3 — Engagement radar "All teams" 均值与 KPI 不符（已修）**
- 原 "All teams" 五轴 [78, 72, 81, 76, 68] 均值 75，与 Q3 KPI "Avg. engagement 78%" 对不上（面板默认文案会显示 "avg 75/100"）。
- 改为 [80, 74, 83, 78, 75]，均值 78.0，与 KPI 一致。

**检查过、无问题的项**
- 团队人数合计 86+54+32+28+18+16+14 = 248，与 headcount KPI 248 一致。
- 漏斗 1240 → 486 → 132 → 31 → 24 严格递减；"24 hires from 1,240 applicants (1.9%)"：24/1240 = 1.94% ≈ 1.9%，正确。
- Recent hires 5 人全部在员工表里，姓名/角色/团队/入职日期一致。
- 员工表 12 行、每页 6 行、2 页；各团队、状态分布合理，无空数据；排序/筛选/分页/查看/删除/新增对话框逻辑通读无错。
- 布局：KPI、漏斗、雷达、柱状图、团队 breakdown、Recent hires、员工表均为正常响应式结构，未见错乱；文案无错别字；面包屑 `href="#"` 为全站统一的占位写法，非死链，未动。

## 构建验证

`npm run build` 一次通过（Next.js 16.3.3，TypeScript 通过，21/21 静态页生成），`/templates/ai-image-generation` 与 `/templates/hr-management` 均在路由表内。构建时其他工人的页面未报错，无需重试。
