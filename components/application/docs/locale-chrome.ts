import { LOCALES, type SiteLocale } from "./site-locales";

export { LOCALES } from "./site-locales";
export type { SiteLocale } from "./site-locales";

// 来源是 boardui.com 自身 i18n 词典，只收与英文不同的译文。
// 缺失即回退英文。
export const SIDEBAR_LABELS: Record<string, Partial<Record<Exclude<SiteLocale, "en">, string>>> = {
  "Getting started": {
    "zh-hans": "快速入门",
    ja: "はじめに",
    ar: "البدء",
    "pt-br": "Primeiros passos",
  },
  "Let's begin": {
    "zh-hans": "开始使用",
    ja: "はじめに",
    ar: "لنبدأ",
    "pt-br": "Vamos começar",
  },
  "Installation": {
    "zh-hans": "安装",
    ja: "インストール",
    ar: "التثبيت",
    "pt-br": "Instalação",
  },
  "MCP Server": {
    "zh-hans": "MCP 服务器",
    ja: "MCPサーバー",
    ar: "خادم MCP",
    "pt-br": "Servidor MCP",
  },
  "Agent Skills": {
    "zh-hans": "智能体技能",
    ja: "エージェントスキル",
    ar: "مهارات الوكيل",
    "pt-br": "Skills para agentes",
  },
  "RTL Support": {
    "zh-hans": "RTL 支持",
    ja: "RTLサポート",
    ar: "دعم RTL",
    "pt-br": "Suporte a RTL",
  },
  "Foundations": {
    "zh-hans": "基础规范",
    ja: "基礎",
    ar: "الأساسيات",
    "pt-br": "Fundamentos",
  },
  "Color": {
    "zh-hans": "颜色",
    ja: "カラー",
    ar: "اللون",
    "pt-br": "Cores",
  },
  "Typography": {
    "zh-hans": "字体排版",
    ja: "タイポグラフィ",
    ar: "الخطوط",
    "pt-br": "Tipografia",
  },
  "Components": {
    "zh-hans": "组件",
    ja: "コンポーネント",
    ar: "المكوّنات",
    "pt-br": "Componentes",
  },
  "Templates": {
    "zh-hans": "模板",
    ja: "テンプレート",
    ar: "القوالب",
  },
  // Base
  "Base": {
    "zh-hans": "基础组件",
    ja: "基本コンポーネント",
    ar: "أساسي",
    "pt-br": "Básicos",
  },
  "Accordion": {
    "zh-hans": "手风琴",
    ja: "アコーディオン",
    ar: "الأكورديون",
    "pt-br": "Acordeão",
  },
  "Announcement": {
    "zh-hans": "公告",
    ja: "お知らせ",
    ar: "إعلان",
    "pt-br": "Anúncio",
  },
  "Avatar": {
    "zh-hans": "头像",
    ja: "アバター",
    ar: "الصورة الرمزية",
  },
  "Badge": {
    "zh-hans": "徽标",
    ja: "バッジ",
    ar: "شارة",
    "pt-br": "Selo",
  },
  "Breadcrumb": {
    "zh-hans": "面包屑导航",
    ja: "パンくずリスト",
    ar: "مسار التنقل",
    "pt-br": "Navegação estrutural",
  },
  "Button": {
    "zh-hans": "按钮",
    ja: "ボタン",
    ar: "زر",
    "pt-br": "Botão",
  },
  "Button Group": {
    "zh-hans": "按钮组",
    ja: "ボタングループ",
    ar: "مجموعة الأزرار",
    "pt-br": "Grupo de botões",
  },
  "Cascader": {},
  "Carousel": {
    "zh-hans": "轮播",
    ja: "カルーセル",
    ar: "عرض دوّار",
    "pt-br": "Carrossel",
  },
  "Checkbox": {
    "zh-hans": "复选框",
    ja: "チェックボックス",
    ar: "خانة الاختيار",
    "pt-br": "Caixa de seleção",
  },
  "Chip": {
    "zh-hans": "标签",
    ja: "チップ",
    ar: "الشريحة",
  },
  "Close Button": {
    "zh-hans": "关闭按钮",
    ja: "閉じるボタン",
    ar: "زر الإغلاق",
    "pt-br": "Botão de fechar",
  },
  "Color Picker": {
    "zh-hans": "颜色选择器",
    ja: "カラーピッカー",
    ar: "منتقي الألوان",
    "pt-br": "Seletor de cores",
  },
  "Combobox": {
    "zh-hans": "组合框",
    ja: "コンボボックス",
    ar: "مربع التحرير والسرد",
  },
  "Command Palette": {
    "zh-hans": "命令面板",
    ja: "コマンドパレット",
    ar: "لوحة الأوامر",
    "pt-br": "Paleta de comandos",
  },
  "Context Menu": {
    "zh-hans": "右键菜单",
    ja: "コンテキストメニュー",
    ar: "قائمة السياق",
    "pt-br": "Menu de contexto",
  },
  "Date Calendar": {
    "zh-hans": "日期日历",
    ja: "日付カレンダー",
    ar: "تقويم التاريخ",
    "pt-br": "Calendário de datas",
  },
  "Date Picker": {
    "zh-hans": "日期选择器",
    ja: "日付ピッカー",
    ar: "منتقي التاريخ",
    "pt-br": "Seletor de data",
  },
  "Divider": {
    "zh-hans": "分隔线",
    ja: "区切り線",
    ar: "فاصل",
    "pt-br": "Divisor",
  },
  "Drawer": {
    "zh-hans": "抽屉",
    ja: "ドロワー",
    ar: "اللوحة المنزلقة",
    "pt-br": "Gaveta",
  },
  "Dropdown": {
    "zh-hans": "下拉菜单",
    ja: "ドロップダウン",
    ar: "قائمة منسدلة",
    "pt-br": "Menu suspenso",
  },
  "File Upload": {
    "zh-hans": "文件上传",
    ja: "ファイルアップロード",
    ar: "رفع الملفات",
    "pt-br": "Upload de arquivos",
  },
  "Icon Button": {
    "zh-hans": "图标按钮",
    ja: "アイコンボタン",
    ar: "زر الأيقونة",
    "pt-br": "Botão de ícone",
  },
  "Input": {
    "zh-hans": "输入框",
    ja: "入力",
    ar: "إدخال",
    "pt-br": "Campo de texto",
  },
  "Input OTP": {
    "zh-hans": "验证码输入框",
    ja: "OTP入力",
    ar: "إدخال OTP",
    "pt-br": "Campo de código OTP",
  },
  "Link Button": {
    "zh-hans": "链接按钮",
    ja: "リンクボタン",
    ar: "زر الرابط",
    "pt-br": "Botão de link",
  },
  "Meter": {
    "zh-hans": "计量条",
    ja: "メーター",
    ar: "المقياس",
    "pt-br": "Medidor",
  },
  "Modal": {
    "zh-hans": "模态框",
    ja: "モーダル",
    ar: "النافذة المنبثقة",
  },
  "Notification": {
    "zh-hans": "通知",
    ja: "通知",
    ar: "إشعار",
    "pt-br": "Notificação",
  },
  "Number Field": {
    "zh-hans": "数字输入框",
    ja: "数値フィールド",
    ar: "حقل الأرقام",
    "pt-br": "Campo numérico",
  },
  "Pagination": {
    "zh-hans": "分页",
    ja: "ページネーション",
    ar: "التنقل بين الصفحات",
    "pt-br": "Paginação",
  },
  "Popover": {
    "zh-hans": "弹出框",
    ja: "ポップオーバー",
    ar: "النافذة العائمة",
  },
  "Progress": {
    "zh-hans": "进度",
    ja: "プログレス",
    ar: "التقدم",
    "pt-br": "Progresso",
  },
  "Radio": {
    "zh-hans": "单选框",
    ja: "ラジオボタン",
    ar: "زر الاختيار",
    "pt-br": "Botão de opção",
  },
  "Rate": {},
  "Search Field": {
    "zh-hans": "搜索框",
    ja: "検索フィールド",
    ar: "حقل البحث",
    "pt-br": "Campo de busca",
  },
  "Segmented Control": {
    "zh-hans": "分段控件",
    ja: "セグメントコントロール",
    ar: "عنصر التحكم المقسّم",
    "pt-br": "Controle segmentado",
  },
  "Select": {
    "zh-hans": "选择框",
    ja: "セレクト",
    ar: "قائمة الاختيار",
    "pt-br": "Seleção",
  },
  "Skeleton": {
    "zh-hans": "骨架屏",
    ja: "スケルトン",
    ar: "الهيكل التحميلي",
  },
  "Slider": {
    "zh-hans": "滑块",
    ja: "スライダー",
    ar: "المنزلق",
    "pt-br": "Controle deslizante",
  },
  "Social Button": {
    "zh-hans": "第三方登录按钮",
    ja: "ソーシャルボタン",
    ar: "زر اجتماعي",
    "pt-br": "Botão social",
  },
  "Spinner": {
    "zh-hans": "加载动画",
    ja: "スピナー",
    ar: "مؤشر التحميل",
  },
  "Switch": {
    "zh-hans": "开关",
    ja: "スイッチ",
    ar: "مفتاح التبديل",
    "pt-br": "Interruptor",
  },
  "Table": {
    "zh-hans": "表格",
    ja: "テーブル",
    ar: "جدول",
    "pt-br": "Tabela",
  },
  "Tabs": {
    "zh-hans": "选项卡",
    ja: "タブ",
    ar: "علامات التبويب",
    "pt-br": "Abas",
  },
  "Tag Group": {
    "zh-hans": "标签组",
    ja: "タググループ",
    ar: "مجموعة الوسوم",
    "pt-br": "Grupo de tags",
  },
  "Textarea": {
    "zh-hans": "多行文本框",
    ja: "テキストエリア",
    ar: "منطقة نص",
    "pt-br": "Área de texto",
  },
  "Time Field": {
    "zh-hans": "时间输入框",
    ja: "時刻フィールド",
    ar: "حقل الوقت",
    "pt-br": "Campo de hora",
  },
  "Toast": {
    "zh-hans": "轻提示",
    ja: "トースト",
    ar: "الإشعار المنبثق",
  },
  "Tooltip": {
    "zh-hans": "提示框",
    ja: "ツールチップ",
    ar: "تلميح الأداة",
    "pt-br": "Dica",
  },
  "Tree Select": {},
  "Tree View": {
    "zh-hans": "树形视图",
    ja: "ツリービュー",
    ar: "العرض الشجري",
    "pt-br": "Árvore",
  },
  // Blocks
  "Blocks": {
    "zh-hans": "组合组件",
    ja: "ブロック",
    ar: "كتل",
    "pt-br": "Blocos",
  },
  "Agent Creator": {
    "zh-hans": "智能体创建器",
    ja: "エージェント作成",
    ar: "منشئ الوكيل",
    "pt-br": "Criador de agentes",
  },
  "Agent Limits": {
    "zh-hans": "智能体额度",
    ja: "エージェントの使用制限",
    ar: "حدود الوكيل",
    "pt-br": "Limites do agente",
  },
  "Agent Progress": {
    "zh-hans": "智能体任务进度",
    ja: "エージェントの進捗",
    ar: "تقدم الوكيل",
    "pt-br": "Progresso do agente",
  },
  "Agent Thinking": {
    "zh-hans": "智能体思考状态",
    ja: "エージェントの思考",
    ar: "تفكير الوكيل",
    "pt-br": "Agente pensando",
  },
  "Auth Card": {
    "zh-hans": "身份验证卡片",
    ja: "認証カード",
    ar: "بطاقة المصادقة",
    "pt-br": "Card de autenticação",
  },
  "Calendar": {
    "zh-hans": "日历",
    ja: "カレンダー",
    ar: "التقويم",
    "pt-br": "Calendário",
  },
  "Composer": {
    "zh-hans": "对话输入框",
    ja: "コンポーザー",
    ar: "محرّر الرسائل",
    "pt-br": "Compositor",
  },
  "Composer Attachments": {
    "zh-hans": "输入框附件",
    ja: "コンポーザーの添付ファイル",
    ar: "مرفقات Composer",
    "pt-br": "Anexos do compositor",
  },
  "Composer Loader": {
    "zh-hans": "输入框加载状态",
    ja: "コンポーザーローダー",
    ar: "محمّل Composer",
    "pt-br": "Carregamento do compositor",
  },
  "Composer Panel": {
    "zh-hans": "对话输入面板",
    ja: "コンポーザーパネル",
    ar: "لوحة محرّر الرسائل",
    "pt-br": "Painel do Compositor",
  },
  "Data Grid": {
    "zh-hans": "数据网格",
    ja: "データグリッド",
    ar: "شبكة البيانات",
  },
  "Data Table": {
    "zh-hans": "数据表格",
    ja: "データテーブル",
    ar: "جدول البيانات",
    "pt-br": "Tabela de dados",
  },
  "Notification Center": {
    "zh-hans": "通知中心",
    ja: "通知センター",
    ar: "مركز الإشعارات",
    "pt-br": "Central de notificações",
  },
  "Questionnaire": {
    "zh-hans": "问卷",
    ja: "質問フォーム",
    ar: "استبيان",
    "pt-br": "Questionário",
  },
  "Settings Modal": {
    "zh-hans": "设置对话框",
    ja: "設定モーダル",
    ar: "نافذة الإعدادات",
    "pt-br": "Modal de configurações",
  },
  "Sidebar": {
    "zh-hans": "侧边栏",
    ja: "サイドバー",
    ar: "الشريط الجانبي",
    "pt-br": "Barra lateral",
  },
  "Stat Cards": {
    "zh-hans": "指标卡片",
    ja: "統計カード",
    ar: "بطاقات الإحصاءات",
    "pt-br": "Cards de indicadores",
  },
  "Task List": {
    "zh-hans": "任务列表",
    ja: "タスクリスト",
    ar: "قائمة المهام",
    "pt-br": "Lista de tarefas",
  },
  "Web Search": {
    "zh-hans": "网页搜索",
    ja: "ウェブ検索",
    ar: "البحث على الويب",
    "pt-br": "Busca na web",
  },
  // Charts
  "Charts": {
    "zh-hans": "图表",
    ja: "チャート",
    ar: "المخططات البيانية",
    "pt-br": "Gráficos",
  },
  "Activity Rings": {
    "zh-hans": "活动圆环",
    ja: "アクティビティリング",
    ar: "حلقات النشاط",
    "pt-br": "Anéis de atividade",
  },
  "Area Chart": {
    "zh-hans": "面积图",
    ja: "エリアチャート",
    ar: "مخطط المساحة",
    "pt-br": "Gráfico de área",
  },
  "Bar List": {
    "zh-hans": "条形列表",
    ja: "棒リスト",
    ar: "قائمة شريطية",
    "pt-br": "Lista de barras",
  },
  "Combo Chart": {
    "zh-hans": "组合图表",
    ja: "複合チャート",
    ar: "مخطط مركّب",
    "pt-br": "Gráfico combinado",
  },
  "Contributions": {
    "zh-hans": "贡献记录",
    ja: "貢献活動",
    ar: "المساهمات",
    "pt-br": "Contribuições",
  },
  "Earnings Chart": {
    "zh-hans": "收入图表",
    ja: "収益チャート",
    ar: "مخطط الأرباح",
    "pt-br": "Gráfico de ganhos",
  },
  "Funnel Chart": {
    "zh-hans": "漏斗图",
    ja: "ファネルチャート",
    ar: "مخطط القمع",
    "pt-br": "Gráfico de funil",
  },
  "Heatmap Chart": {
    "zh-hans": "热力图",
    ja: "ヒートマップチャート",
    ar: "مخطط الخريطة الحرارية",
    "pt-br": "Gráfico de mapa de calor",
  },
  "Line Chart": {
    "zh-hans": "折线图",
    ja: "折れ線チャート",
    ar: "مخطط خطي",
    "pt-br": "Gráfico de linhas",
  },
  "Most Active Days": {
    "zh-hans": "最活跃的日期",
    ja: "活動量の多い日",
    ar: "أكثر الأيام نشاطاً",
    "pt-br": "Dias Mais Ativos",
  },
  "Orders Chart": {
    "zh-hans": "订单图表",
    ja: "注文チャート",
    ar: "مخطط الطلبات",
    "pt-br": "Gráfico de pedidos",
  },
  "Radar Chart": {
    "zh-hans": "雷达图",
    ja: "レーダーチャート",
    ar: "مخطط الرادار",
    "pt-br": "Gráfico de radar",
  },
  "Radial Chart": {
    "zh-hans": "径向图",
    ja: "ラジアルチャート",
    ar: "مخطط شعاعي",
    "pt-br": "Gráfico radial",
  },
  "Revenue Chart": {
    "zh-hans": "营收图表",
    ja: "売上チャート",
    ar: "مخطط الإيرادات",
    "pt-br": "Gráfico de Receitas",
  },
  "Sankey Chart": {
    "zh-hans": "桑基图",
    ja: "サンキーチャート",
    ar: "مخطط سانكي",
    "pt-br": "Gráfico de Sankey",
  },
  "Scatter Chart": {
    "zh-hans": "散点图",
    ja: "散布図",
    ar: "مخطط التشتت",
    "pt-br": "Gráfico de dispersão",
  },
  "Sleep Score": {
    "zh-hans": "睡眠评分",
    ja: "睡眠スコア",
    ar: "درجة النوم",
    "pt-br": "Pontuação de Sono",
  },
  "Stage Bars": {
    "zh-hans": "阶段条形图",
    ja: "ステージバー",
    ar: "أشرطة المراحل",
    "pt-br": "Barras por etapa",
  },
  "Steps Chart": {
    "zh-hans": "步数图表",
    ja: "歩数チャート",
    ar: "مخطط الخطوات",
    "pt-br": "Gráfico de Passos",
  },
  "AI Chat": {
    "zh-hans": "AI 聊天",
    ja: "AIチャット",
    ar: "محادثة الذكاء الاصطناعي",
    "pt-br": "Chat com IA",
  },
  "AI Image Generation": {
    "zh-hans": "AI 图像生成",
    ja: "AI画像生成",
    ar: "توليد الصور بالذكاء الاصطناعي",
    "pt-br": "Geração de imagens com IA",
  },
  "AI Profile": {
    "zh-hans": "AI 个人资料",
    ja: "AIプロフィール",
    ar: "ملف الذكاء الاصطناعي",
    "pt-br": "Perfil de IA",
  },
  "Chat Starter": {
    "zh-hans": "聊天入门模板",
    ja: "チャットスターター",
    ar: "بداية المحادثة",
    "pt-br": "Iniciador de Conversação",
  },
  "Finance Dashboard": {
    "zh-hans": "财务仪表盘",
    ja: "金融ダッシュボード",
    ar: "لوحة التحكم المالية",
    "pt-br": "Dashboard financeiro",
  },
  "Home Dashboard": {
    "zh-hans": "主页仪表盘",
    ja: "ホームダッシュボード",
    ar: "لوحة التحكم الرئيسية",
    "pt-br": "Dashboard inicial",
  },
  "Marketing Dashboard": {
    "zh-hans": "营销仪表盘",
    ja: "マーケティングダッシュボード",
    ar: "لوحة تحكم التسويق",
    "pt-br": "Dashboard de marketing",
  },
  "Medical Profile": {
    "zh-hans": "医疗档案",
    ja: "医療プロフィール",
    ar: "الملف الطبي",
    "pt-br": "Perfil médico",
  },
  "Multi-agent Chat": {
    "zh-hans": "多智能体聊天",
    ja: "マルチエージェントチャット",
    ar: "دردشة متعددة الوكلاء",
    "pt-br": "Chat com vários agentes",
  },
  "Project Board": {
    "zh-hans": "项目看板",
    ja: "プロジェクトボード",
    ar: "لوحة المشروع",
    "pt-br": "Quadro de projetos",
  },
};

export function sidebarLabel(label: string, locale: SiteLocale): string {
  if (locale === "en") return label;
  return SIDEBAR_LABELS[label]?.[locale] ?? label;
}

/** Fixed chrome copy (breadcrumb, table of contents, search, footer) that is not a sidebar label. Source: boardui.com's own i18n catalogue. Only strings that differ from English are listed; anything absent renders in English. */
export const CHROME_STRINGS: Record<string, Partial<Record<Exclude<SiteLocale, "en">, string>>> = {
  "On this page": { "zh-hans": "在此页面上", ja: "このページの内容", ar: "في هذه الصفحة", "pt-br": "Nesta página" },
  "Quick Search": { "zh-hans": "快速搜索", ja: "クイック検索", ar: "بحث سريع", "pt-br": "Busca rápida" },
  "Get Pro": { "zh-hans": "获取 Pro", ja: "Proを購入", ar: "احصل على Pro", "pt-br": "Obter Pro" },
  "Copy Page": { "zh-hans": "复制页面", ja: "ページをコピー", ar: "نسخ الصفحة", "pt-br": "Copiar página" },
  "Preview": { "zh-hans": "预览", ja: "プレビュー", ar: "معاينة", "pt-br": "Prévia" },
  "Code": { "zh-hans": "代码", ja: "コード", ar: "الكود", "pt-br": "Código" },
  "Docs pages": { "zh-hans": "文档页面", ja: "ドキュメントページ", ar: "صفحات التوثيق", "pt-br": "Páginas de documentos" },
  "Previous": { "zh-hans": "上一步", ja: "前へ", ar: "السابق", "pt-br": "Anterior" },
  "Next": { "zh-hans": "下一步", ja: "次へ", ar: "التالي", "pt-br": "Próximo" },
  "Next: {0}": { "zh-hans": "下一页：{0}", ja: "次へ：{0}", ar: "التالي: {0}", "pt-br": "Próximo: {0}" },
  "Previous: {0}": { "zh-hans": "上一篇：{0}", ja: "前へ：{0}", ar: "السابق: {0}", "pt-br": "Anterior: {0}" },
  "Tour the system": { "zh-hans": "游览系统", ja: "システム見学", ar: "جولة في النظام", "pt-br": "Visitar o sistema" },
  "Framework setup guides": { "zh-hans": "框架设置指南", ja: "フレームワークセットアップガイド", ar: "أدلة إعداد الإطار", "pt-br": "Guias de configuração de framework" },
  "Agents install for you": { "zh-hans": "智能体为您安装", ja: "エージェントがインストールを代行", ar: "الوكلاء يقومون بالتثبيت نيابةً عنك", "pt-br": "Agentes instalam para você" },
  "Knowledge for your agent": { "zh-hans": "为您的智能体人提供的知识", ja: "あなたの代理店のための知識", ar: "معرفة لوكيلك الذكي", "pt-br": "Conhecimento para o seu agente" },
  "Semantic color tokens": { "zh-hans": "语义颜色变量", ja: "セマンティックカラートークン", ar: "رموز الألوان الدلالية", "pt-br": "Tokens de cores semânticas" },
  "Open navigation": { "zh-hans": "打开导航", ja: "オープンナビゲーション", ar: "فتح التنقل", "pt-br": "Abrir navegação" },
  "Component library": { "zh-hans": "元件库", ja: "コンポーネントライブラリ", ar: "مكتبة المكوّنات", "pt-br": "Biblioteca de componentes" },
  "Docs": { "zh-hans": "文档", ja: "ドキュメント", ar: "التوثيق", "pt-br": "Documentação" },
  "Privacy": { "zh-hans": "隐私", ja: "プライバシー", ar: "الخصوصية", "pt-br": "Privacidade" },
  "Terms": { "zh-hans": "条款", ja: "利用規約", ar: "الشروط", "pt-br": "Termos" },
  "License": { "zh-hans": "许可证", ja: "ライセンス", ar: "الترخيص", "pt-br": "Licença" },
  "View all": { "zh-hans": "查看全部", ja: "すべて表示", ar: "عرض الكل", "pt-br": "Ver tudo" },
  "{0} items shown": { "zh-hans": "显示 {0} 项", ja: "{0} 件を表示", ar: "{0} عناصر معروضة", "pt-br": "{0} itens exibidos" },
  "Components": { "zh-hans": "组件", ja: "コンポーネント", ar: "المكونات", "pt-br": "Componentes" },
  "Blog": { "zh-hans": "博客", ja: "ブログ", ar: "المدونة" },
  "BoardUI is a dashboard design system and UI kit for React + Tailwind CSS, with data tables, charts and dashboard templates, designed in Figma.": { "zh-hans": "BoardUI 是一个用于 React + Tailwind CSS 的仪表盘设计系统和 UI 套件，带有数据表、图表和仪表盘模板，在 Figma 中设计。", ja: "BoardUIは、ReactとTailwind CSS向けのダッシュボード用デザインシステム兼UIキットです。Figmaで設計されたデータテーブル、チャート、ダッシュボードのテンプレートを提供しています。", ar: "BoardUI هو نظام تصميم لوحات التحكم وحزمة واجهة مستخدم لـ React + Tailwind CSS، يتضمن جداول بيانات ومخططات وقوالب لوحات تحكم، مصمَّمة في Figma.", "pt-br": "BoardUI é um sistema de design e kit de UI para dashboards em React + Tailwind CSS, com tabelas de dados, gráficos e templates de dashboards, criado no Figma." },

  "Affiliate": { "zh-hans": "联盟推广", ja: "アフィリエイト", ar: "التسويق بالعمولة", "pt-br": "Afiliados" },
  "Earn 40%": { "zh-hans": "赚 40%", ja: "報酬40%", ar: "اربح 40%", "pt-br": "Ganhe 40%" },
  "Contact": { "zh-hans": "联系方式", ja: "お問い合わせ", ar: "التواصل", "pt-br": "Contato" },
  "Install Pro": { "zh-hans": "安装 Pro", ja: "Proをインストール", ar: "تثبيت Pro", "pt-br": "Instalar o Pro" },
  "Pricing": { "zh-hans": "价格", ja: "料金", ar: "الأسعار", "pt-br": "Preços" },
  "Browse components": { "zh-hans": "浏览组件", ja: "コンポーネントを見る", ar: "تصفح المكوّنات", "pt-br": "Explorar componentes" },
  "Agentic": { "zh-hans": "智能体", ja: "エージェント", ar: "واجهات الوكلاء", "pt-br": "Agentes" },
  "Resources": { "zh-hans": "资源", ja: "リソース", ar: "الموارد", "pt-br": "Recursos" },
  "Company": { "zh-hans": "公司", ja: "会社案内", ar: "الشركة", "pt-br": "Empresa" },
  "New": { "zh-hans": "全新", ja: "新着", ar: "جديد", "pt-br": "Novo" },
  "Search": { "zh-hans": "搜索", ja: "検索", ar: "بحث", "pt-br": "Buscar" },
  "Follow BoardUI on X": { "zh-hans": "在 X 上关注 BoardUI", ja: "XでBoardUIをフォロー", ar: "تابع BoardUI على X", "pt-br": "Siga o BoardUI no X" },
  "Join the BoardUI Discord": { "zh-hans": "加入 BoardUI Discord 社区", ja: "BoardUIのDiscordに参加", ar: "انضم إلى BoardUI Discord", "pt-br": "Entre no Discord do BoardUI" },
  "BoardUI on GitHub": { "zh-hans": "GitHub 上的 BoardUI", ja: "GitHubのBoardUI", ar: "BoardUI على GitHub", "pt-br": "BoardUI no GitHub" },
  "29 Jun - 5 Jul": { "pt-br": "29 jun - 5 jul" },
  "Mertcan Esmergül": { "zh-hans": "梅尔特坎·埃斯梅尔居尔", ja: "メルトカン・エスメルゲル", ar: "ميرتجان إسمرغول" },
  "Add profile photo": { "zh-hans": "添加个人资料照片", ja: "プロフィール写真を追加", ar: "إضافة صورة شخصية", "pt-br": "Adicionar foto do perfil" },
  "Date of Birth": { "zh-hans": "出生日期", ja: "生年月日", ar: "تاريخ الميلاد", "pt-br": "Data de nascimento" },
  "Gender": { "zh-hans": "性别", ja: "性別", ar: "الجنس", "pt-br": "Sexo" },
  "Male": { "zh-hans": "男", ja: "男性", ar: "ذكر", "pt-br": "Masculino" },
  "Blood Type": { "zh-hans": "血型", ja: "血液型", ar: "فصيلة الدم", "pt-br": "Tipo de Sangue" },
  "GP Doctor": { "zh-hans": "全科医生", ja: "かかりつけ医", ar: "الطبيب العام", "pt-br": "Médico GP" },
  "Mattheus Clarkson": { "zh-hans": "马修斯·克拉克森", ja: "マテウス・クラークソン", ar: "ماتيوس كلاركسون" },
  "Important alerts": { "zh-hans": "重要提醒", ja: "重要なアラート", ar: "تنبيهات مهمة", "pt-br": "Alertas importantes" },
  "this week": { "zh-hans": "这周", ja: "今週の予定", ar: "هذا الأسبوع", "pt-br": "esta semana" },
  "High Heart rate": { "zh-hans": "高心率", ja: "高い心拍数", ar: "ارتفاع معدل ضربات القلب", "pt-br": "Frequência cardíaca elevada" },
  "Your heart rate rose above 120 BPM while you seemed to be inactive for 10 minutes starting at 8:59 AM, 12 June.": { "zh-hans": "从 6 月 12 日上午 8:59 开始，您似乎有 10 分钟没有活动，但心率升至 120 BPM 以上。", ja: "心拍数が120BPMを上回るので、6月8:59から6月12日にかけて10分は非アクティブに見えます。", ar: "ارتفع معدل ضربات قلبك فوق 120 ضربة في الدقيقة أثناء عدم نشاطك لمدة 10 دقائق، بدءًا من الساعة 8:59 صباحًا في 12 يونيو.", "pt-br": "A sua frequência cardíaca subiu acima de 120 BPM enquanto você parecia estar inativo por 10 minutos a partir das 8:59 AM, 12 de junho." },
  "Medical ID": { "zh-hans": "医疗ID", ja: "医療ID", ar: "الهوية الطبية", "pt-br": "ID médico" },
  "Your emergency contact and allergy information was updated in your Medical ID.": { "zh-hans": "您的医疗 ID 中已更新您的紧急联系人和过敏信息。", ja: "医療用IDに緊急連絡先とアレルギー情報が更新されました。", ar: "تم تحديث جهة اتصال الطوارئ ومعلومات الحساسية في هويتك الطبية.", "pt-br": "A sua informação de contato de emergência e alergia foi atualizada no seu ID Médico." },
  "Lab results ready": { "zh-hans": "实验室结果已准备好", ja: "実験室の結果は準備が整いました", ar: "نتائج التحاليل جاهزة", "pt-br": "Resultados do laboratório prontos" },
  "Your latest blood panel ordered by Dr. Mattheus Clarkson is back — cholesterol and glucose are within the normal range.": { "zh-hans": "马修斯·克拉克森 (Mattheus Clarkson) 医生为您安排的最新血液检查回来了 — 胆固醇和血糖均在正常范围内。", ja: "マテウス・クラークソン博士が注文した最新の血液パネルが戻ってきます - コレステロールとグルコースは正常な範囲内にあります。", ar: "ظهرت نتائج تحليل الدم الأخير الذي طلبه الدكتور ماتيوس كلاركسون؛ الكوليسترول والجلوكوز ضمن المعدل الطبيعي.", "pt-br": "O seu último exame de sangue encomendado pelo Dr. Mattheus Clarkson está de volta — o colesterol e a glicose estão dentro do intervalo normal." },
  "Medication reminder": { "zh-hans": "服药提醒", ja: "薬用リマインダー", ar: "تذكير بالدواء", "pt-br": "Aviso de medicação" },
  "You missed your 9:00 AM dose of Metoprolol. Take it as soon as possible unless your next dose is near.": { "zh-hans": "您错过了上午 9:00 服用的美托洛尔剂量。除非您的下一次服药时间临近，否则请尽快服用。", ja: "あなたはMetoprololのあなたの9:00 AMの線量を逃しました。あなたの次の線量が近くなければできるだけ早くそれを取って下さい。", ar: "فاتتك جرعة الميتوبرولول الساعة 9:00 صباحًا. تناولها في أقرب وقت ما لم يقترب موعد الجرعة التالية.", "pt-br": "Perdeu a dose de Metoprolol às 9h. Tome-a o mais depressa possível, a menos que a próxima dose esteja próxima." },
  "Irregular sleep": { "zh-hans": "睡眠不规律", ja: "不規則な眠り", ar: "نوم غير منتظم", "pt-br": "Dormência irregular" },
  "Your bedtime shifted by more than 2 hours on 3 of the last 7 nights, which can affect your sleep score.": { "zh-hans": "过去 7 晚中有 3 晚您的就寝时间变化超过 2 小时，这可能会影响您的睡眠得分。", ja: "あなたの就寝時間は、あなたの睡眠スコアに影響を与えることができる最後の7夜3で2時間以上シフトしました。", ar: "تغير وقت نومك بأكثر من ساعتين في 3 ليالٍ من آخر 7 ليالٍ، مما قد يؤثر على درجة نومك.", "pt-br": "Sua hora de dormir mudou mais de 2 horas em 3 das últimas 7 noites, o que pode afetar sua pontuação de sono." },
  "Low blood oxygen": { "zh-hans": "低血氧", ja: "低い血酸素", ar: "انخفاض الأكسجين في الدم", "pt-br": "Oxigênio de baixo sangue" },
  "Your blood oxygen dipped to 93% for a short period during sleep on the night of 4 June.": { "zh-hans": "6 月 4 日晚上，您在睡眠期间的血氧含量曾短暂下降至 93%。", ja: "6月4日の夜に眠りに短い期間で93%に浸るあなたの血の酸素。", ar: "انخفض مستوى الأكسجين في دمك إلى 93٪ لفترة قصيرة أثناء النوم ليلة 4 يونيو.", "pt-br": "O oxigênio do seu sangue mergulhou para 93% durante um curto período durante o sono na noite de 4 de Junho." },
  "Steps": { "zh-hans": "步数", ja: "歩数", ar: "الخطوات", "pt-br": "Passos" },
  "total steps": { "zh-hans": "总步数", ja: "総ステップ", ar: "إجمالي الخطوات", "pt-br": "passos totais" },
  "Monday": { "zh-hans": "星期一", ja: "月曜日", ar: "الاثنين", "pt-br": "Segunda-feira" },
  "Tuesday": { "zh-hans": "星期二", ja: "火曜日", ar: "الثلاثاء", "pt-br": "Terça-feira" },
  "Wednesday": { "zh-hans": "星期三", ja: "水曜日", ar: "الأربعاء", "pt-br": "Quarta-feira" },
  "Thursday": { "zh-hans": "星期四", ja: "木曜日", ar: "الخميس", "pt-br": "Quinta-feira" },
  "Friday": { "zh-hans": "周五", ja: "金曜日", ar: "الجمعة", "pt-br": "Sexta-feira" },
  "Saturday": { "zh-hans": "星期六", ja: "土曜日", ar: "السبت", "pt-br": "Sábado" },
  "Sunday": { "zh-hans": "周日", ja: "日曜日", ar: "الأحد", "pt-br": "Domingo" },
  "Mon": { "zh-hans": "周一", ja: "月", ar: "الاثنين", "pt-br": "Seg" },
  "Tue": { "zh-hans": "周二", ja: "火", ar: "الثلاثاء", "pt-br": "Ter" },
  "Wed": { "zh-hans": "周三", ja: "水", ar: "الأربعاء", "pt-br": "Qua" },
  "Thu": { "zh-hans": "周四", ja: "木", ar: "الخميس", "pt-br": "Qui" },
  "Fri": { "zh-hans": "周五", ja: "金", ar: "الجمعة", "pt-br": "Sex" },
  "Sat": { "zh-hans": "周六", ja: "土", ar: "السبت", "pt-br": "Sáb" },
  "Sun": { "zh-hans": "周日", ja: "日", ar: "الأحد", "pt-br": "Dom" },
  "Sleep score": { "zh-hans": "睡眠评分", ja: "睡眠スコア", ar: "درجة النوم", "pt-br": "Pontuação de sono" },
  "Excellent": { "zh-hans": "优秀", ja: "とても良い", ar: "ممتاز", "pt-br": "Excelente." },
  "Duration": { "zh-hans": "持续时间", ja: "時間", ar: "المدة", "pt-br": "Duração" },
  "Bedtime": { "zh-hans": "就寝时间", ja: "就寝時間", ar: "وقت النوم", "pt-br": "Hora de dormir" },
  "Interruptions": { "zh-hans": "打扰", ja: "中断", ar: "الانقطاعات", "pt-br": "Interrupções" },
  "20m earlier": { "zh-hans": "提前20m", ja: "20分早め", ar: "أبكر بـ20 دقيقة", "pt-br": "20m mais cedo" },
  "5m wake up": { "zh-hans": "5m醒来", ja: "5分の覚醒", ar: "5 دقائق استيقاظ", "pt-br": "5m acordar" },
  "Most active days": { "zh-hans": "最活跃的日子", ja: "活動量の多い日", ar: "الأيام الأكثر نشاطًا", "pt-br": "Dias mais ativos" },
  "Activity": { "zh-hans": "活动", ja: "活動内容", ar: "النشاط", "pt-br": "Atividade" },
  "Move": { "zh-hans": "移动", ja: "ふるまい", ar: "الحركة", "pt-br": "Mover" },
  "Exercise": { "zh-hans": "锻炼", ja: "トレーニング", ar: "التمرين", "pt-br": "Exercício" },
  "Running": { "zh-hans": "跑步", ja: "ランニング", ar: "الجري", "pt-br": "Em execução" },
  "BoardUI widgets showcase": { "zh-hans": "BoardUI 小部件展示", ja: "BoardUIウィジェットショーケース", ar: "عرض أدوات BoardUI", "pt-br": "Galeria de widgets BoardUI" },
  "January": { "zh-hans": "1月", ja: "1月", ar: "يناير", "pt-br": "Janeiro" },
  "February": { "zh-hans": "2月", ja: "2月", ar: "فبراير", "pt-br": "Fevereiro" },
  "March": { "zh-hans": "3月", ja: "3月", ar: "مارس", "pt-br": "Março" },
  "April": { "zh-hans": "4月", ja: "4月", ar: "أبريل", "pt-br": "Abril" },
  "May": { "zh-hans": "5月", ja: "5月", ar: "مايو", "pt-br": "Maio" },
  "June": { "zh-hans": "6月", ja: "6月", ar: "يونيو", "pt-br": "Junho" },
  "July": { "zh-hans": "7月", ja: "7月", ar: "يوليو", "pt-br": "Julho" },
  "August": { "zh-hans": "8月", ja: "8月", ar: "أغسطس", "pt-br": "Agosto" },
  "September": { "zh-hans": "9月", ja: "9月", ar: "سبتمبر", "pt-br": "Setembro" },
  "October": { "zh-hans": "10月", ja: "10月", ar: "أكتوبر", "pt-br": "Outubro" },
  "November": { "zh-hans": "11月", ja: "11月", ar: "نوفمبر", "pt-br": "Novembro" },
  "December": { "zh-hans": "12月", ja: "12月", ar: "ديسمبر", "pt-br": "Dezembro" },
  "Jan": { "zh-hans": "1月", ja: "1月", ar: "يناير" },
  "Feb": { "zh-hans": "2月", ja: "2月", ar: "فبراير", "pt-br": "Fev" },
  "Mar": { "zh-hans": "3月", ja: "3月", ar: "مارس" },
  "Apr": { "zh-hans": "4月", ja: "4月", ar: "أبريل", "pt-br": "Abr" },
  "Jun": { "zh-hans": "6月", ja: "6月", ar: "يونيو" },
  "Jul": { "zh-hans": "7月", ja: "7月", ar: "يوليو" },
  "Aug": { "zh-hans": "8月", ja: "8月", ar: "أغسطس", "pt-br": "Ago" },
  "Sep": { "zh-hans": "9月", ja: "9月", ar: "سبتمبر", "pt-br": "Set" },
  "Oct": { "zh-hans": "10月", ja: "10月", ar: "أكتوبر", "pt-br": "Out" },
  "Nov": { "zh-hans": "11月", ja: "11月", ar: "نوفمبر" },
  "Dec": { "zh-hans": "12月", ja: "12月", ar: "ديسمبر", "pt-br": "Dez" },
  "Move, exercise, and running activity progress": { "zh-hans": "移动、锻炼和跑步活动进度", ja: "移動、運動、および実行中の活動の進行", ar: "تقدم نشاط الحركة والتمرين والجري", "pt-br": "Progresso da atividade de movimento, exercício e execução" },
};

export function chromeString(key: string, locale: SiteLocale): string {
  if (locale === "en") return key;
  return CHROME_STRINGS[key]?.[locale] ?? key;
}

/** Intl locale tag for a site locale. Arabic must use the Gregorian calendar with Latin digits ("ar-u-ca-gregory-nu-latn"): the bare "ar" tag defaults to the Islamic calendar. */
export function intlLocaleTag(locale: SiteLocale): string {
  switch (locale) {
    case "zh-hans": return "zh-CN";
    case "ja": return "ja-JP";
    case "ar": return "ar-u-ca-gregory-nu-latn";
    case "pt-br": return "pt-BR";
    default: return "en-US";
  }
}

/** Birth date "28 July, 1997": English keeps the literal; other locales format 28 Jul 1997 via Intl (verified against the original's renders: zh "1997年7月28日", ja "1997年7月28日", ar "28 يوليو 1997", pt-br "28 de jul. de 1997"). */
export function formatBirthDate(locale: SiteLocale): string {
  if (locale === "en") return "28 July, 1997";
  return new Intl.DateTimeFormat(intlLocaleTag(locale), { day: "numeric", month: "short", year: "numeric" }).format(new Date(1997, 6, 28));
}

const MONTH_NAMES_EN = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

/** Alert date (month index, day): English keeps the original's "June, 12" form; other locales format via Intl {day, month} (zh "6月12日", ja "6月12日", ar "12 يونيو", pt-br "12 de jun."). */
export function formatAlertDate(month: number, day: number, locale: SiteLocale): string {
  if (locale === "en") return `${MONTH_NAMES_EN[month]}, ${day}`;
  return new Intl.DateTimeFormat(intlLocaleTag(locale), { day: "numeric", month: "short" }).format(new Date(2026, month, day));
}

/** Week pill "29 Jun - 5 Jul": pt-br comes from the original's dict ("29 jun - 5 jul"); zh/ja/ar are numeric M/D or D/M via Intl (zh "6/29 - 7/5", ja "6/29 - 7/5", ar "29/6 - 5/7"); en is the literal. */
export function weekRangeLabel(locale: SiteLocale): string {
  if (locale === "en") return "29 Jun - 5 Jul";
  if (locale === "pt-br") return chromeString("29 Jun - 5 Jul", locale);
  const fmt = new Intl.DateTimeFormat(intlLocaleTag(locale), { month: "numeric", day: "numeric" });
  return `${fmt.format(new Date(2026, 5, 29))} - ${fmt.format(new Date(2026, 6, 5))}`;
}

/** Unlocalized paths that already have a translated version. The locale chrome links to the locale route only for these; everything else keeps its English href so navigation never 404s. Extend as follow-up rounds add translated pages. */
export const BUILT_LOCALE_ROUTES: ReadonlySet<string> = new Set(["/", "/docs/introduction", "/getting-started", "/installation", "/docs/cli", "/mcp", "/skill", "/rtl"]);

/** Localize an href for a locale page: prefix it only when that route has a translated version, otherwise keep the English href. A "#hash" suffix is preserved. */
export function localizedHrefFor(href: string, locale: SiteLocale): string {
  if (locale === "en") return href;
  const hashIndex = href.indexOf("#");
  const path = hashIndex >= 0 ? href.slice(0, hashIndex) : href;
  const hash = hashIndex >= 0 ? href.slice(hashIndex) : "";
  if (!BUILT_LOCALE_ROUTES.has(path)) return href;
  return LOCALES[locale].prefix + (path === "/" ? "" : path) + hash;
}

/** Strip a locale prefix (e.g. "/zh-hans") from a pathname, so prev/next lookup and nav matching can run on the unlocalized path. Returns the pathname unchanged when it has no locale prefix. */
export function stripLocalePrefix(pathname: string): string {
  for (const locale of Object.keys(LOCALES) as SiteLocale[]) {
    const prefix = LOCALES[locale].prefix;
    if (prefix && (pathname === prefix || pathname.startsWith(prefix + "/"))) {
      return pathname.slice(prefix.length) || "/";
    }
  }
  return pathname;
}

/** Localize one nav item (label via the sidebar dictionary, href via the built-routes set). */
export function localizeNavItem<T extends { href: string; label: string }>(item: T, locale: SiteLocale): T {
  return { ...item, href: localizedHrefFor(item.href, locale), label: sidebarLabel(item.label, locale) };
}

/** Localize a sectioned nav (sidebar): section titles and every item. */
export function localizeNavSections<T extends { title: string; items: { href: string; label: string }[] }>(sections: T[], locale: SiteLocale): T[] {
  return sections.map((section) => ({
    ...section,
    title: sidebarLabel(section.title, locale),
    items: section.items.map((item) => localizeNavItem(item, locale)),
  }));
}
