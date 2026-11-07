# BoardUI 全量盘点（2026-11-07）

## 官方总数

| 类别 | 数量 | 来源 |
|---|---|---|
| 免费 UI 组件（registry:ui） | 56 | /r/registry.json |
| 免费 block（registry:block） | 17 | /r/registry.json |
| 免费 lib（registry:lib） | 15 | /r/registry.json |
| 免费小计 | 88 | |
| Pro 组件 | 30 | /r/registry-pro.json |
| Pro 模板 | 10 | /r/registry-pro.json |
| Pro 小计 | 40 | |
| 官网 /components 页链接 | 99 | https://www.boardui.com/components |
| llms.txt 组件页 | 102 | https://www.boardui.com/llms.txt |

注：56+17+30 = 103，与官网宣称"103 组件"一致。

## 我们复刻前

| 类别 | 数量 |
|---|---|
| app/components/ 详情页 | 78 |
| app/templates/ 模板 | 11（含 calendar，Pro 注册表外） |
| components/ 源码文件 | 135 |

## 缺口（补齐前）

| 类别 | 缺数 | 名单 |
|---|---|---|
| 免费 UI 详情页 | 26 | accordion、badge、checkbox-card、color-picker、combobox、command-palette、context-menu、date-calendar、date-range-picker、drawer、kbd、meeting-scheduler、meter、modal、number-field、popover、progress、radio-card、search-field、skeleton、spinner、status-dot、switch-card、tag-group、time-field、toast |
| 免费 block 详情页 | 7 | agent-chat、agent-log、app-shell、important-alerts-card、orders-chart-card、patient-info-card、theme-toggle |
| Pro 组件详情页 | 2 | agent-avatar、composer |
| 新增：hr-management 组件页 | 1 | hr-management |
| 新增：pro-installation 文档页 | 1 | pro-installation |
| **合计** | **37** | |

## 补齐分工

- 工人 A：免费 UI 13 个（accordion、badge、checkbox-card、color-picker、combobox、command-palette、context-menu、date-calendar、date-range-picker、drawer、kbd、meeting-scheduler、meter）
- 工人 B：免费 UI 13 个（modal、number-field、popover、progress、radio-card、search-field、skeleton、spinner、status-dot、switch-card、tag-group、time-field、toast）
- 工人 C：免费 block 7 个 + Pro 2 个 + lib/模板核查
- 工人 D：hr-management、pro-installation + 其他页面评估 + /templates 跳转核查

## 补齐后（2026-11-07 晚，提交 f449d17，已 push）

| 类别 | 数量 |
|---|---|
| app/components/ 详情页 | **115**（78 原有 + 37 新增） |
| /components 目录条目 | **114**（pro-installation 为文档页，不进目录，与原版一致） |
| app/templates/ 模板 | 11（含 calendar，Pro 注册表外） |
| components/ 源码文件 | 135 + 新增 19（含 8 个全新免费组件源码 + scroll-fade 等） |
| 全站外链 href | **0**（boardui.com 1 处 + x.com 1 处已改纯文本） |

### 补齐结果

- 37/37 全部补齐，缺口 0。
- 免费源码：8 个全新组件按注册表原样装入（accordion、color-picker、combobox、command-palette、context-menu、date-picker/date-calendar、drawer、meeting-scheduler 相关）；7 个 block 核心源码本地早已存在且与注册表字节一致，仅新建详情页（app-shell 的 15 个 docs 预览文件缺失，见下）。
- 共享文件 6 个按注册表升级（input trailingAddon/FieldError、notification paused/dismissed、chip CHIP_COLORS、date-picker shared showToday/isUnavailable、dropdown menu-styles z-110、input hint-text 导出），均为加法、向后兼容。
- 目录同步：components-index.ts +36 条（26 Base + 9 Blocks + 1 Templates）。

### 验证

- `npx tsc --noEmit` 零报错；`npm run build` 通过，115 个 /components 路由静态生成，BUILD_ID ZJVK7lKIDdMGyZPlI6mbw。
- OCR 审查：63 个可审文件全覆盖，0 High/Critical；规则筛查 0 `any`、0 `==`、0 eval/innerHTML、0 var、0 真实密钥；accordion/toast 抽查与注册表字节一致。
- 线上 curl 验证见本轮交付报告。

### 残留（补不了/未补）

1. **app-shell 的 15 个 docs 预览文件缺失**：注册表 app-shell bundle 里 15 个 docs 预览文件本地没有，详情页已建、核心源码字节一致，预览文件缺失不影响详情页本身。证据：工人 C 汇报。
2. **官方 /templates 返回 307 跳转**：目标地址未确认，无法复刻该列表页本身；本站 /templates 列表页已存在且 11 个模板全部可达。
3. **其他官方页面（blog、docs/cli、docs/introduction、installation、mcp、skill、rtl、pricing）**：本轮任务范围是组件/模板/详情页缺口，未建这些文档页；pro-installation 文档页已建。是否建这些文档页待用户定。
4. **头像像素 1:1**：原版 canvas 动画头像无公开像素数据，沿用此前已说明的 SVG 近似（见 README 残留项）。

## lib 核查补充（2026-11-07 晚，提交 28d535b）

- 15 个免费 lib 按注册表路径逐个核：13 个已在，2 个缺。
- 已补：`rules` → `docs/agent-rules.md`（5357 字节，按注册表原样装入，与注册表字节一致）。
- 未补：`agent-runtime` → `app/api/chat/route.ts`，因静态导出已移入 `docs/api-chat-route.ts.bak`（有意排除，恢复会破坏静态导出构建；模板不依赖它）。
- lib 覆盖：**14/15**（1 个有意排除）。
