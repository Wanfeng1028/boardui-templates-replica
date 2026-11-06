# BoardUI Pro 全部内容 · 盘点清单（2026-11-06）

> 来源：boardui.com/llms.txt、/r/registry-pro.json（40 项）、10 个模板页服务端 HTML。Pro 注册表确认：**30 个 Pro 组件 + 10 套 Pro 模板 = 40 项**。本仓库复刻范围 = 全部 40 项 + Calendar 演示页（见下）。

## 一、10 套 Pro 模板

| # | 模板 | 注册表名 | 演示页 | 状态 | 内容（llms.txt 描述 + 实测） |
|---|---|---|---|---|---|
| 1 | Dashboard（Home Dashboard） | template-home-dashboard | /templates/dashboard | 需 1:1 重做 | KPI 统计卡、营收趋势、Earnings 图表、Contributions 热力图、客户表；响应式 app shell。实测标题 "Welcome Mertcan"，有 Week/Month 切换、Filter、Create |
| 2 | Project Board | template-project-board | /templates/project-board | 需 1:1 重做 | 响应式看板：可排序票据、动画新建票据与详情面板、可编辑属性、评论、token 用量图表。实测列：Backlog / To do / In progress / Review / Done；New ticket |
| 3 | Marketing（Marketing Dashboard） | template-marketing | /templates/marketing | 需 1:1 重做 | Campaign KPI、获客漏斗、各渠道花费、流量来源、广告花费 vs ROAS、各渠道访客、Campaigns 数据表。实测标题 "Marketing"，Filter、New campaign |
| 4 | Calendar | （Pro 组件，见下；演示页存在） | /templates/calendar | 需 1:1 重做 | 月视图日历（2026 年 8 月）、事件 chips、详情弹窗、月份切换、收件箱。实测标题 "August 2026"，New event。注意：Calendar 在 Pro 注册表里是组件（calendar），不是模板；但演示页按模板页存在，仓库里保留 calendar 路由 |
| 5 | Finance（Finance Dashboard） | template-finance | /templates/finance | 需 1:1 重做 | 余额 KPI、现金流 Sankey、花费圆环、投资组合气泡、每日花费热力图、交易数据表。实测标题 "Finance"，This month、Filter、Add |
| 6 | Medical Profile（Medical Report） | template-medical-profile | /templates/medical-profile | 需 1:1 重做 | 患者概览：步数、睡眠分数、活动圆环、最活跃日图表。实测标题 "Medical Profile"，Filter |
| 7 | AI Chat | template-ai-chat | /templates/ai-chat | 需 1:1 重做 | 完整 AI 聊天应用：侧栏、可调代码面板、带模型/ effort 控制的 Composer |
| 8 | AI Image Generation | template-ai-image-generation | /templates/ai-image-generation | 需 1:1 重做 | 提示词对话 + 实时生成框与反馈操作 + 过往生成图库面板 |
| 9 | AI Profile | template-ai-profile | /templates/ai-profile | 需 1:1 重做 | AI 贡献档案：封面卡 + 活动热力图、30 天 Agent 柱状图、Token 趋势图。实测有 Calendar/Today/Edit/Week/Month |
| 10 | Multi-Agent Chat | template-multi-agent-chat | /templates/multi-agent-chat | **已 1:1 完成，勿动** | 7 组单人对话 + 群聊 + Agent Creator + Marketplace；955 行，1440px 实测。只补缺的页面/交互，不重做 |
| 11 | HR Management | template-hr | /templates/hr-management → **404，无演示页** | 需按描述新建 |  headcount KPI、最近入职、招聘漏斗、敬业度雷达、入职 vs 离职、团队 breakdown、员工数据表。无演示页可量，只能按描述 + 免费组件搭建，注明"无原版演示对照" |

**共享外壳：** 9 套仪表盘模板共用一个侧栏导航：Home、Project board、Marketing、Calendar、Finance、Medical Report、AI Chat、AI Image Generation、Profile、Support、Settings。侧栏点哪套就进哪套，模板之间可互相导航。Multi-Agent Chat 是独立三栏聊天应用，不共用该侧栏。

**现状：** 除 Multi-Agent Chat 外，其余 9 套各只有 1 个近似单页（23–150 行），全部要按 1:1 重做并补全交互；HR Management 需新建。

## 二、30 个 Pro 组件（注册表名）

### A. 图表卡（17 个）
| 注册表名 | 组件名 | 要点 |
|---|---|---|
| earnings-chart-card | Earnings Chart Card | 柱状图卡，周期切换、数字滚动 headline、hover 描边 |
| line-chart-card | Line Chart Card | 折线/面积图卡，渐变填充、曲线/折线插值、动画 active 点 |
| contributions-card | Contributions Card | GitHub 风格贡献热力网格，可换强调色 |
| radar-chart-card | Radar Chart Card | 雷达图卡，填充/虚线/仅线/中心分数变体，hover 联动 headline，多系列图例 |
| radial-chart-card | Radial Chart Card | 径向柱状图卡：同心圆环（素面/标签/网格底）、单值仪表、堆叠半圆仪表 |
| funnel-chart-card | Funnel Chart Card | 横向漏斗，曲线/锐角收窄、居中转化 pill、单色选项、每列下方值/名 footer |
| sankey-chart-card | Sankey Chart Card | Sankey 流量卡，pill 节点、目标着色连线、来源与占比标签、hover 隔离 |
| stage-bars-card | Stage Bars Card | 漏斗阶段横向圆角 pill，每阶段名/值/占比，动画宽度、单色选项 |
| bar-list-card | Bar List Card | 分析 breakdown 列表：排名行 + 背后占比条、标签页列表、指标 caption、show-more pill |
| area-chart-card | Area Chart Card | 多系列面积图，堆叠/重叠/100% 变体，渐变填充、周期下拉、stat tiles |
| combo-chart-card | Combo Chart Card | 柱状+折线组合图，左右独立轴、hover 变暗、脉冲 active 点 |
| scatter-chart-card | Scatter Chart Card | 散点/气泡图，分组系列、可选尺寸度量、hover 隔离、stat tiles |
| heatmap-chart-card | Heatmap Chart Card | 矩阵热力图（行×列），跟随主题的色阶、hover 联动 headline、Less → More 图例 |
| steps-card | Steps Card | 周步数柱状图，周切换、数字滚动 headline、hover 描边 |
| sleep-score-card | Sleep Score Card | 分段分数环，hover 聚焦子分数与指标行 |
| activity-rings-card | Activity Rings Card | Apple Watch 风格同心目标环 + stat tiles |
| most-active-days-card | Most Active Days Card | 连续纵向月历，每天一个迷你活动环 |

### B. Agent / Composer / 其他（13 个）
| 注册表名 | 组件名 | 要点 |
|---|---|---|
| web-search | Web Search | 流式研究轨迹：Agent 跑过的查询与打开的来源，带真实站点标记 |
| task-list | Task List | 流式 Agent 任务日志：任务逐步揭示，柔和高度、模糊、闪烁的运行中标题 |
| composer | Composer | AI 聊天 Composer 全套：附件与模型菜单、语音与发送控制、状态栏、控件的液态玻璃加载态 |
| composer-panel | Composer Panel | 两行 AI 聊天 Composer：上行提示词，下行添加/权限/模型/麦克风/发送控制，卡片挂状态标签（分支、项目文件夹、上下文 meter） |
| composer-attachments | Composer Attachments | 带附件的 Composer Panel：提示词上方图片与文档 tiles，逐个落下、上传圆环描绘 |
| agent-progress | Agent Progress | 可折叠多步 AI 任务进度，活动/待定/完成动画态 |
| agent-limits-card | Agent Limits Card | 上下文窗口用量条，可展开 token 明细、可折叠分组、计划用量上限与重置时间 |
| questionnaire | Questionnaire | Plan 模式提问聊天卡：每步一问，复选框或编号行、自由文本 Other 行、步骤 pills 与 Previous/Next，卡片随每问高度滑动 |
| calendar | Calendar | 月视图日历，事件 chips、详情弹窗、月份切换、收件箱 |
| project-board | Project Board | 可排序看板，票据详情侧面板、可编辑属性、评论、紫色 token 图表、跨列平滑拖放 |
| agent-avatar | Agent Avatar | 动画纸片头像：游走的眼睛、表情脸、九种剪影、立体转身动画 |
| agent-creator | Agent Creator | 受控 Agent 创建侧栏：动画头像、表情与形状选择器、自定义颜色、档案字段、语音偏好 |
| multi-agent-chat | Multi-agent Chat | Agent 工作区：单人/群聊、实时头像编辑器、BoardUI Composer（已在模板里 1:1，组件版照模板复用） |

## 三、交付结构（仓库内）

- `app/templates/<slug>/page.tsx`：10 套模板各一路由（+ 新增 `app/templates/hr-management/`）。
- `app/pro-components/charts/page.tsx`：17 张图表卡展示页。
- `app/pro-components/page.tsx`：13 个非图表 Pro 组件展示页（+ 链接到图表页）。
- `components/application/charts/`：图表卡组件；`components/application/pro/`：非图表 Pro 组件。
- `app/templates/page.tsx`：总览页（补 HR Management 与 Pro 组件入口）——由统筹最后统一改，工人勿动。
- Multi-Agent Chat（`app/templates/multi-agent-chat/`）已 1:1，勿动。
