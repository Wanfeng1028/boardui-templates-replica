# 模板切换入口审计：改前 / 改后 / 三档宽度自查

- 仓库：`~/workspace/boardui-templates-replica/`（main 分支）
- 日期：2026-11-07
- 结论：**改完。`npm run build` 通过（21/21 页），未提交。** 三档宽度（1440 / 768 / 390）Playwright 实测 48 项全部通过：每个入口均可见、在视口内、可点击，点击后均到达 `/templates`。

## 1. 改前什么样（检查现状）

| 位置 | 改前 |
| --- | --- |
| 首页 `/` | 只有 `AgentChat` 聊天界面，**没有任何模板入口**。侧栏（`starterNav`）只有 Chat / Dashboard / Components and Blocks / Sign in / Sign up，找不到模板。 |
| 总览页 `/templates` | 页面本身存在（11 张卡片可点），但**只能靠直接输 URL 到达**，站内无任何入口指过去。标题是 `BoardUI Templates — Replica`，"11 套"只藏在一段英文说明里；文件头注释还写着过期的 `10 replica templates`；侧栏 `selected="home"`，会误把 Dashboard 一项高亮。 |
| 模板页（8 页走 `TemplateShell`：dashboard / finance / marketing / calendar / ai-profile / medical-profile / project-board，及总览页本身） | 顶栏只有各页自己的操作按钮（Filters / Create ticket / Share 等），**没有回总览的入口**。唯一切换方式是左侧栏 11 个单项导航（Home / Project board / …），桌面端（≥lg）可见，小屏要先点汉堡菜单打开抽屉才能看到，且没有"全部模板"这一行。 |
| 模板页（3 页本地壳：ai-chat / ai-image-generation / hr-management） | 同上：顶栏只有本页图标/操作按钮，无总览入口；切换只靠侧栏单项。 |
| multi-agent-chat | 例外，有两处入口但都不显眼：左侧栏底部一行文字链接 `All templates`（侧栏 <md 隐藏，小屏看不到）；顶栏一个**仅图标**的链接（无文字，`title="All templates"` 才有提示）。 |
| 390px 手机端 | 侧栏隐藏，顶栏无总览入口，只能靠汉堡抽屉里的单项逐个找。 |

## 2. 改后什么样

只改导航入口，未动任何模板页内容与交互逻辑。新增一个共享组件，其余各处都复用它，文案全站统一。

### 2.1 共享组件（新增）

`components/application/template-switcher/all-templates-button.tsx`

- `AllTemplatesButton`：文字按钮（不是只有图标），`ButtonLink`，secondary 样式，网格图标 `RiLayoutGridLine` + 文字 **"全部模板"**，链接 `/templates`。`size` 默认 medium，聊天类顶栏用 small。

### 2.2 每个模板页顶栏：显眼的"全部模板"文字按钮

| 模板页 | 位置 | 文案与样式 |
| --- | --- | --- |
| dashboard / finance / marketing / calendar / ai-profile / medical-profile / project-board（7 页，走 `TemplateShell`） | 顶栏 actions 行**首位**，在原有按钮（铃铛 / Filters / Create ticket 等）之前；窄屏时该行自动换行，按钮落到标题下方一行，仍可见。改动在 `components/application/template-shell/template-shell.tsx` 一处，所有 7 页同时生效 | "全部模板"，medium，secondary |
| hr-management（本地 `HrShell`） | 顶栏 actions 行首位 | "全部模板"，medium，secondary |
| ai-chat（本地壳） | 聊天顶栏右侧图标组首位，主题切换图标之前 | "全部模板"，small，secondary |
| ai-image-generation（本地壳） | 聊天顶栏右侧图标组首位，分享图标之前 | "全部模板"，small，secondary |
| multi-agent-chat | 顶栏右侧：原来**仅图标**的链接升级为文字按钮（会话标题 pill 之后、复制图标之前）；左侧栏底部原 `All templates` 文字链接文案统一为"全部模板" | "全部模板"，small，secondary |

### 2.3 侧栏：首行就是"全部模板"

- `components/application/dashboard/dashboard-sidebar.tsx` 的 `DASHBOARD_NAV` 首行新增：`{ key: "all-templates", label: "全部模板", icon: RiLayoutGridLine, href: "/templates" }`。所有模板页的桌面侧栏和手机抽屉里，"全部模板"都在 11 个单项之上。
- `components/application/app-shell/app-shell.tsx` 的 `starterNav` 首行同样新增"全部模板" → `/templates`。首页、`/dashboard`、`/components`、`/login`、`/signup` 的侧栏/抽屉也都有了。

### 2.4 首页 `/`：一眼看到的大按钮

`app/page.tsx` 顶部加一条 56px 通栏横条（聊天内容本身未动）：

- 左侧文字：`BoardUI 模板复刻 · 共 11 套模板`
- 右侧 primary 大按钮：**"浏览全部模板"** → `/templates`
- 聊天区高度相应改为 `h-[calc(100dvh-3.5rem)]`，整页仍正好一屏，不出滚动条。

### 2.5 总览页 `/templates`：11 套写清楚

`app/templates/page.tsx`：

- 标题改为 **"全部模板 · 11 套"**（原 `BoardUI Templates — Replica`）。
- 标题下首行加粗写明：**"共 11 套模板，每套一张卡片，点击任意卡片打开对应模板。"**
- 11 套每套一张卡片可点（Dashboard / Project Board / Marketing / Calendar / Finance / Medical Profile / HR Management / AI Chat / AI Image Generation / AI Profile / Multi-Agent Chat），卡片带名称、简介与 `/templates/<slug>` 路径。
- 修正过期注释 `10 replica templates` → `11 replica templates`。
- 侧栏选中态由 `selected="home"` 改为 `selected="all-templates"`（不再误高亮 Dashboard）；本页隐藏指向自己的顶栏按钮（`hideAllTemplatesButton`，`TemplateShell` 新增 prop）。

## 3. 改动清单（9 改 + 1 新增，未提交）

| 文件 | 改动 |
| --- | --- |
| `components/application/template-switcher/all-templates-button.tsx`（新增） | 共享"全部模板"文字按钮 |
| `components/application/template-shell/template-shell.tsx` | 顶栏 actions 行首加按钮；新增 `hideAllTemplatesButton` prop |
| `components/application/dashboard/dashboard-sidebar.tsx` | `DASHBOARD_NAV` 首行加"全部模板" |
| `components/application/app-shell/app-shell.tsx` | `starterNav` 首行加"全部模板" |
| `app/page.tsx` | 顶部横条 + "浏览全部模板"大按钮 |
| `app/templates/page.tsx` | 标题/数量文案、选中态、隐藏自指按钮、修过期注释 |
| `app/templates/hr-management/page.tsx` | 本地壳顶栏 actions 行首加按钮 |
| `app/templates/ai-chat/page.tsx` | 顶栏右侧加 small 按钮 |
| `app/templates/ai-image-generation/page.tsx` | 顶栏右侧加 small 按钮 |
| `app/templates/multi-agent-chat/page.tsx` | 顶栏仅图标链接 → 文字按钮；底部链接文案统一为"全部模板" |

## 4. 三档宽度自查结果

### 4.1 方法

- `npm run build` 通过（21/21 页静态生成）。项目是 `output: export` 静态导出，`next start` 不可用，自查用 `audit/serve-clean.mjs`（clean-URL 静态服务器，`out/`）+ Playwright headless shell（`chromium_headless_shell-1243`）实测。
- 导出 HTML 核实：首页含"全部模板"（横条按钮 + 侧栏行）、"浏览全部模板"；每模板页导出 HTML 含顶栏按钮 + 侧栏行（`href="/templates"` 各 2 处）；总览页含 11 个不同模板卡片链接。
- Playwright 脚本 `audit/verify-widths.mjs`：8 个页面 × 3 档宽度，逐项查"找到 / 可见 / 在视口内 / 点击后到达 `/templates`"，截图 24 张存 `audit/shots/`。**48 项检查，0 失败**（完整记录见 `audit/width-check-results.json`，逐行日志见 `audit/width-check.log`）。
- 注：表中坐标是按钮内文字的位置（Playwright 文本定位解析到按钮内层 span），按钮本身 medium 高 36px、small 高 32px；位置坐标均为视口内左上角。

### 4.2 1440px（桌面）

| 页面 | 入口 | 位置（文字左上角 x,y） | 可见 / 可点 |
| --- | --- | --- | --- |
| 首页 `/` | 横条大按钮"浏览全部模板" | 1324,18 | 可见，点击到 `/templates` |
| 首页 `/` | 侧栏首行"全部模板" | 63,181 | 可见 |
| `/templates` | 标题"全部模板 · 11 套" | 288,56 | 可见 |
| `/templates` | 首张卡片 Dashboard | 288,204（562×108） | 可见，卡片可点 |
| `/templates` | 侧栏首行"全部模板"（高亮态） | 63,125 | 可见 |
| `/templates/dashboard` | 顶栏"全部模板"（actions 首位） | 1068,64 | 可见，点击到 `/templates` |
| `/templates/ai-chat` | 顶栏"全部模板" | 749,26 | 可见，点击到 `/templates` |
| `/templates/ai-image-generation` | 顶栏"全部模板" | 857,26 | 可见，点击到 `/templates` |
| `/templates/hr-management` | 顶栏"全部模板" | 1058,64 | 可见，点击到 `/templates` |
| `/templates/multi-agent-chat` | 顶栏"全部模板" | 1283,30 | 可见，点击到 `/templates` |
| `/templates/finance` | 顶栏"全部模板" | 1048,64 | 可见，点击到 `/templates` |
| 各模板页 | 侧栏首行"全部模板" | 63,125 | 可见 |

桌面截图已目视确认：首页横条 + 侧栏首行、Dashboard 页顶栏按钮在铃铛/Filters/Create ticket 之前，均显眼（见 `audit/shots/home-1440.png`、`template-dashboard-1440.png`）。

### 4.3 768px（平板）

| 页面 | 入口 | 位置（文字左上角 x,y） | 可见 / 可点 |
| --- | --- | --- | --- |
| 首页 `/` | 横条大按钮"浏览全部模板" | 652,18 | 可见，点击到 `/templates` |
| 首页 `/` | 侧栏"全部模板"（点汉堡抽屉） | 63,125 | 抽屉内可见 |
| `/templates` | 标题"全部模板 · 11 套" | 54,61 | 可见 |
| `/templates` | 首张卡片 Dashboard | 12,234（364×126） | 可见 |
| `/templates/dashboard` | 顶栏"全部模板" | 396,64 | 可见，点击到 `/templates` |
| `/templates/ai-chat` | 顶栏"全部模板" | 491,26 | 可见，点击到 `/templates` |
| `/templates/ai-image-generation` | 顶栏"全部模板" | 563,26 | 可见，点击到 `/templates` |
| `/templates/hr-management` | 顶栏"全部模板" | 386,64 | 可见，点击到 `/templates` |
| `/templates/multi-agent-chat` | 顶栏"全部模板" | 611,30 | 可见，点击到 `/templates` |
| `/templates/finance` | 顶栏"全部模板" | 376,64 | 可见，点击到 `/templates` |
| 各模板页 | 侧栏"全部模板"（点汉堡抽屉） | 63,125 | 抽屉内可见 |

### 4.4 390px（手机）

| 页面 | 入口 | 位置（文字左上角 x,y） | 可见 / 可点 |
| --- | --- | --- | --- |
| 首页 `/` | 横条大按钮"浏览全部模板" | 274,18 | 可见，点击到 `/templates` |
| 首页 `/` | 侧栏"全部模板"（点汉堡抽屉） | 63,125 | 抽屉内可见 |
| `/templates` | 标题"全部模板 · 11 套" | 54,49 | 可见 |
| `/templates` | 首张卡片 Dashboard | 12,302（366×126） | 可见，单列卡片 |
| `/templates/dashboard` | 顶栏"全部模板"（换行到标题下方一行） | 160,96 | 可见，点击到 `/templates` |
| `/templates/ai-chat` | 顶栏"全部模板" | 113,26 | 可见，点击到 `/templates` |
| `/templates/ai-image-generation` | 顶栏"全部模板" | 185,26 | 可见，点击到 `/templates` |
| `/templates/hr-management` | 顶栏"全部模板"（换行到标题下方一行） | 160,96 | 可见，点击到 `/templates` |
| `/templates/multi-agent-chat` | 顶栏"全部模板" | 233,30 | 可见，点击到 `/templates` |
| `/templates/finance` | 顶栏"全部模板"（换行到标题下方一行） | 160,96 | 可见，点击到 `/templates` |
| 各模板页 | 侧栏"全部模板"（点汉堡抽屉） | 63,125 | 抽屉内可见 |

390px 截图已目视确认（`audit/shots/home-390.png`、`templates-index-390.png`、`template-dashboard-390.png`、`template-ai-chat-390.png`、`template-ai-image-390.png`、`template-multi-agent-390.png`）：横条按钮、总览标题与卡片、三个聊天页顶栏按钮均完整可见可点。

## 5. 已知问题（未修，需定夺）

- **ai-chat 在 390px 下顶栏标题被挤到只剩 1 个字符**（`Agentic chat` 显示为 `A`，副标题 `vibl coding…` 显示为 `v`）。原因：该顶栏本来就有汉堡 + 5 个图标按钮，再加一个文字按钮后标题区被压缩。按钮本身完整可见可点，聊天功能不受影响；ai-image-generation 同宽下标题截为 `Image g…` 仍可读，multi-agent-chat 标题截为 `landing page desi…` 正常。
- 修这个要动模板顶栏布局（例如把按钮移到模型选择行、或收起部分图标），已超出"只改导航入口"的范围，本轮未动。如需修，请定方案后再做。

## 6. 证据文件

- 本文件：`audit/template-switching.md`
- 宽度自查脚本：`audit/verify-widths.mjs`（48 项，0 失败）；清 URL 静态服务器：`audit/serve-clean.mjs`
- 逐行结果：`audit/width-check-results.json`、`audit/width-check.log`
- 截图 24 张：`audit/shots/<页面>-<1440|768|390>.png`（每页每档一张）
- 自查服务器已停；构建产物 `out/` 为本次构建生成，未提交。
