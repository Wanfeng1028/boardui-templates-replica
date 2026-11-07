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
