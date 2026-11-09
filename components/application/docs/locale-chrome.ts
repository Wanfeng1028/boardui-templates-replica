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
};

export function chromeString(key: string, locale: SiteLocale): string {
  if (locale === "en") return key;
  return CHROME_STRINGS[key]?.[locale] ?? key;
}

/** Unlocalized paths that already have a translated version. The locale chrome links to the locale route only for these; everything else keeps its English href so navigation never 404s. Extend as follow-up rounds add translated pages. */
export const BUILT_LOCALE_ROUTES: ReadonlySet<string> = new Set(["/", "/docs/introduction"]);

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
