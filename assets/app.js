const STORAGE_KEY = "restaurant-recruitment-candidates-v1";
const APPLICATION_SOURCES = ["Indeed", "Airワーク", "グルメキャリー", "バイトル", "飲食店ドットコム", "Instagram", "紹介", "その他"];
const CANDIDATE_STATUSES = ["応募受付", "書類選考", "面接調整中", "一次面接", "二次面接", "採用", "不採用", "辞退", "保留"];
const HIRING_DECISIONS = ["採用", "保留", "不採用"];
const OVERALL_RATINGS = ["未評価", "S", "A", "B", "C", "D", "保留"];
const RATING_OPTIONS = ["★★★★★", "★★★★☆", "★★★☆☆", "★★☆☆☆", "★☆☆☆☆"];
const ALLOWED_RESUME_TYPES = ["application/pdf", "image/jpeg", "image/png"];
const EVALUATION_ITEMS = [
  ["firstImpression", "第一印象"],
  ["smile", "笑顔"],
  ["communication", "受け答え"],
  ["cleanliness", "清潔感"],
  ["restaurantExperience", "飲食経験"],
  ["sushiExperience", "寿司経験"],
  ["foreignLanguage", "外国語対応"]
];
const navigation = [["dashboard", "ダッシュボード"], ["applicants", "応募者"], ["interviews", "面接"], ["stores", "配属店舗"], ["analytics", "分析"], ["settings", "設定"]];
const jobs = [
  { id: "j1", title: "寿司職人", location: "店舗", type: "正社員", status: "公開中" },
  { id: "j2", title: "調理スタッフ", location: "店舗", type: "正社員", status: "公開中" },
  { id: "j3", title: "ホールスタッフ", location: "店舗", type: "正社員", status: "公開中" },
  { id: "j4", title: "店長候補", location: "店舗", type: "正社員", status: "公開中" },
  { id: "j5", title: "アルバイト（調理）", location: "店舗", type: "アルバイト", status: "公開中" },
  { id: "j6", title: "アルバイト（ホール）", location: "店舗", type: "アルバイト", status: "公開中" }
];
const defaultCandidates = [
  { id: "c1", name: "山田 太郎", email: "taro.yamada@example.com", phone: "", jobId: "j1", storeId: "s3", status: "一次面接", applicationSource: "Indeed", applicationSourceOther: "", appliedAt: "2026-07-05", interviewAt: "2026-07-06T14:00", interviewer: "山田", resumeName: "", resume: null, interviewHistory: "", evaluation: "", evaluationRatings: { firstImpression: "★★★★★", smile: "★★★★★", communication: "★★★★☆", cleanliness: "★★★★★", restaurantExperience: "★★★★☆", sushiExperience: "★★☆☆☆", foreignLanguage: "★★★★☆" }, hiringDecision: "保留", overallRating: "A", memo: "" },
  { id: "c2", name: "佐藤 花子", email: "hanako.sato@example.com", phone: "", jobId: "j3", storeId: "s2", status: "面接調整中", applicationSource: "Instagram", applicationSourceOther: "", appliedAt: "2026-07-05", interviewAt: "", interviewer: "鈴木", resumeName: "", resume: null, interviewHistory: "", evaluation: "", evaluationRatings: {}, hiringDecision: "保留", overallRating: "未評価", memo: "" },
  { id: "c3", name: "鈴木 一郎", email: "ichiro.suzuki@example.com", phone: "", jobId: "j6", storeId: "s1", status: "採用", applicationSource: "Airワーク", applicationSourceOther: "", appliedAt: "2026-06-20", interviewAt: "2026-07-05T10:00", interviewer: "中村", resumeName: "", resume: null, interviewHistory: "", evaluation: "", evaluationRatings: {}, hiringDecision: "採用", overallRating: "S", memo: "" },
  { id: "c4", name: "高橋 美咲", email: "misaki.takahashi@example.com", phone: "", jobId: "j2", storeId: "s3", status: "応募受付", applicationSource: "紹介", applicationSourceOther: "", appliedAt: "2026-07-02", interviewAt: "", interviewer: "", resumeName: "", resume: null, interviewHistory: "", evaluation: "", evaluationRatings: {}, hiringDecision: "保留", overallRating: "未評価", memo: "" }
];
const interviews = [
  { id: "i1", candidateId: "c1", scheduledAt: "2026-07-05T14:00", interviewer: "山田", format: "オンライン" },
  { id: "i2", candidateId: "c3", scheduledAt: "2026-07-05T10:00", interviewer: "中村", format: "対面" }
];
const stores = [
  { id: "s1", name: "五反田店", area: "東京", openings: 2 },
  { id: "s2", name: "渋谷店", area: "東京", openings: 2 },
  { id: "s3", name: "新宿店", area: "東京", openings: 2 },
  { id: "s4", name: "本部", area: "東京", openings: 1 }
];

let activePage = "dashboard";
let editingCandidateId = "";
let filters = { query: "", source: "all", todo: "all" };
let candidates = loadCandidates();

function loadCandidates() {
  const stored = localStorage.getItem(STORAGE_KEY);
  const parsed = stored ? JSON.parse(stored) : defaultCandidates;
  return parsed.map((candidate) => ({
    ...candidate,
    storeId: candidate.storeId || "s1",
    applicationSource: candidate.applicationSource || "Indeed",
    applicationSourceOther: candidate.applicationSourceOther || "",
    phone: candidate.phone || "",
    interviewHistory: candidate.interviewHistory || defaultInterviewHistory(candidate),
    evaluation: candidate.evaluation || "",
    evaluationRatings: normalizeEvaluationRatings(candidate.evaluationRatings),
    hiringDecision: normalizeHiringDecision(candidate.hiringDecision || inferHiringDecision(candidate.status)),
    overallRating: normalizeOverallRating(candidate.overallRating),
    resumeName: candidate.resume?.fileName || "",
    resume: normalizeResume(candidate.resume),
    memo: candidate.memo || ""
  }));
}

function saveCandidates() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(candidates));
}

function escapeHtml(value) {
  return String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function toneClass(tone) {
  return {
    default: "bg-slate-100 text-slate-700",
    primary: "bg-blue-50 text-blue-700",
    success: "bg-green-50 text-green-700",
    warning: "bg-amber-50 text-amber-700",
    danger: "bg-red-50 text-red-700"
  }[tone] || "bg-slate-100 text-slate-700";
}

function badge(label, tone = "default") {
  return `<span class="inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold ${toneClass(tone)}">${escapeHtml(label)}</span>`;
}

function overallRatingBadge(rating) {
  const classes = {
    S: "bg-purple-50 text-purple-700",
    A: "bg-green-50 text-green-700",
    B: "bg-blue-50 text-blue-700",
    C: "bg-amber-50 text-amber-700",
    D: "bg-red-50 text-red-700",
    "保留": "bg-slate-100 text-slate-700",
    "未評価": "bg-slate-50 text-slate-400"
  };
  const normalized = normalizeOverallRating(rating);
  return `<span class="inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold ${classes[normalized]}">${escapeHtml(normalized)}</span>`;
}

function card(content) {
  return `<section class="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">${content}</section>`;
}

function button(label, variant = "primary", attrs = "") {
  const classes = {
    primary: "bg-blue-600 text-white hover:bg-blue-700",
    secondary: "bg-white text-slate-700 ring-1 ring-slate-200 hover:bg-slate-50",
    danger: "bg-white text-red-700 ring-1 ring-red-200 hover:bg-red-50",
    ghost: "text-slate-600 hover:bg-slate-100"
  };
  return `<button ${attrs} class="inline-flex min-h-10 items-center justify-center rounded-xl px-4 text-sm font-semibold shadow-sm transition ${classes[variant]}">${escapeHtml(label)}</button>`;
}

function input(label, name, placeholder = "", type = "text", value = "") {
  return `<label class="grid gap-1.5 text-sm font-medium text-slate-600">${escapeHtml(label)}<input name="${name}" type="${type}" value="${escapeHtml(value)}" placeholder="${escapeHtml(placeholder)}" class="min-h-10 rounded-xl border border-slate-200 bg-white px-3 text-slate-900 outline-none transition focus:border-blue-600 focus:ring-4 focus:ring-blue-100" /></label>`;
}

function textarea(label, name, placeholder = "", value = "") {
  return `<label class="grid gap-1.5 text-sm font-medium text-slate-600">${escapeHtml(label)}<textarea name="${name}" rows="3" placeholder="${escapeHtml(placeholder)}" class="min-h-24 resize-y rounded-xl border border-slate-200 bg-white px-3 py-2 text-slate-900 outline-none transition focus:border-blue-600 focus:ring-4 focus:ring-blue-100">${escapeHtml(value)}</textarea></label>`;
}

function select(label, name, options, selected = "") {
  return `<label class="grid gap-1.5 text-sm font-medium text-slate-600">${escapeHtml(label)}<select name="${name}" class="min-h-10 rounded-xl border border-slate-200 bg-white px-3 text-slate-900 outline-none transition focus:border-blue-600 focus:ring-4 focus:ring-blue-100">${options.map((option) => `<option value="${escapeHtml(option.value)}" ${option.value === selected ? "selected" : ""}>${escapeHtml(option.label)}</option>`).join("")}</select></label>`;
}

function ratingSelect(label, name, selected = "★★★☆☆") {
  const options = RATING_OPTIONS.map((rating) => ({ label: rating, value: rating }));
  return select(label, name, options, selected);
}

function table(columns, rows, editable = false) {
  return `<div class="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm"><div class="w-full overflow-x-auto"><table class="w-full min-w-full table-auto text-left text-sm"><thead class="bg-slate-50 text-xs font-semibold uppercase tracking-wide text-slate-500"><tr>${columns.map((column) => `<th class="px-4 py-3">${escapeHtml(column.label)}</th>`).join("")}</tr></thead><tbody class="divide-y divide-slate-100">${rows.map((row) => {
    const editableAttrs = editable ? `class="cursor-pointer align-top transition hover:bg-blue-50/60 focus-within:bg-blue-50" data-candidate-id="${escapeHtml(row.id)}" tabindex="0" aria-label="${escapeHtml(row.name)}を編集"` : `class="align-top"`;
    return `<tr ${editableAttrs}>${columns.map((column) => `<td class="px-4 py-3">${column.render(row)}</td>`).join("")}</tr>`;
  }).join("")}</tbody></table></div></div>`;
}

function isInteractiveTarget(target) {
  return target instanceof Element && Boolean(target.closest("button, a, input, select, textarea"));
}

function emptyState(title, message) {
  return `<div class="rounded-2xl border border-dashed border-slate-300 bg-white p-8 text-center shadow-sm"><h3 class="text-base font-semibold text-slate-950">${escapeHtml(title)}</h3><p class="mt-2 text-sm text-slate-500">${escapeHtml(message)}</p></div>`;
}

function sourceLabel(candidate) {
  return candidate.applicationSource === "その他" && candidate.applicationSourceOther ? `その他（${candidate.applicationSourceOther}）` : candidate.applicationSource;
}

function sourceStats() {
  return APPLICATION_SOURCES.map((source) => {
    const matched = candidates.filter((candidate) => candidate.applicationSource === source);
    const hires = matched.filter((candidate) => candidate.status === "採用").length;
    return { source, applications: matched.length, hires, hireRate: matched.length ? Math.round((hires / matched.length) * 100) : 0 };
  }).filter((stats) => stats.applications > 0);
}

function jobTitle(jobId) {
  return jobs.find((job) => job.id === jobId)?.title || "未設定";
}

function storeName(storeId) {
  return stores.find((store) => store.id === storeId)?.name || "未設定";
}

function inferHiringDecision(status) {
  return HIRING_DECISIONS.includes(status) ? status : "保留";
}

function normalizeHiringDecision(decision) {
  return HIRING_DECISIONS.includes(decision) ? decision : "保留";
}

function normalizeOverallRating(rating) {
  return OVERALL_RATINGS.includes(rating) ? rating : "未評価";
}

function normalizeEvaluationRatings(ratings = {}) {
  return EVALUATION_ITEMS.reduce((result, [key]) => {
    result[key] = RATING_OPTIONS.includes(ratings[key]) ? ratings[key] : "★★★☆☆";
    return result;
  }, {});
}

function normalizeResume(resume) {
  if (!resume || !resume.dataUrl) return null;
  return {
    fileName: resume.fileName || "履歴書",
    fileType: resume.fileType || "application/octet-stream",
    uploadedAt: resume.uploadedAt || new Date().toISOString(),
    dataUrl: resume.dataUrl
  };
}

function defaultInterviewHistory(candidate) {
  if (!candidate.interviewAt) return "";
  const interviewer = candidate.interviewer ? `（担当: ${candidate.interviewer}）` : "";
  return `${formatDateTime(candidate.interviewAt)} ${candidate.status}${interviewer}`;
}

function statusTone(status) {
  if (status === "採用") return "success";
  if (["面接調整中", "一次面接", "二次面接"].includes(status)) return "primary";
  if (status === "保留") return "warning";
  if (["不採用", "辞退"].includes(status)) return "danger";
  return "default";
}

function formatDateTime(value) {
  if (!value) return "未設定";
  return new Intl.DateTimeFormat("ja-JP", { dateStyle: "medium", timeStyle: "short" }).format(new Date(value));
}

function formatTime(value) {
  if (!value) return "";
  return new Intl.DateTimeFormat("ja-JP", { hour: "2-digit", minute: "2-digit", hour12: false }).format(new Date(value));
}

function formatUploadedAt(value) {
  return value ? formatDateTime(value) : "未登録";
}

function isToday(value) {
  if (!value) return false;
  const date = new Date(value);
  const now = new Date();
  return date.getFullYear() === now.getFullYear() && date.getMonth() === now.getMonth() && date.getDate() === now.getDate();
}

function kpis() {
  return [
    { label: "応募者数", value: String(candidates.length), tone: "primary" },
    { label: "面接予定", value: String(candidates.filter((candidate) => ["面接調整中", "一次面接", "二次面接"].includes(candidate.status)).length), tone: "primary" },
    { label: "採用人数", value: String(candidates.filter((candidate) => candidate.status === "採用").length), tone: "success" },
    { label: "保留人数", value: String(candidates.filter((candidate) => candidate.status === "保留").length), tone: "warning" }
  ];
}

function todoDefinitions() {
  return [
    { key: "unhandled", label: "未対応", matches: (candidate) => ["応募受付", "書類選考"].includes(candidate.status) },
    { key: "unscheduledInterview", label: "面接日未設定", matches: (candidate) => candidate.status === "面接調整中" && !candidate.interviewAt },
    { key: "resultPending", label: "合否連絡待ち", matches: (candidate) => ["一次面接", "二次面接"].includes(candidate.status) }
  ];
}

function todoLabel(key) {
  return todoDefinitions().find((todo) => todo.key === key)?.label || "";
}

function matchesTodoFilter(candidate) {
  if (filters.todo === "all") return true;
  const todo = todoDefinitions().find((item) => item.key === filters.todo);
  return todo ? todo.matches(candidate) : true;
}

function filteredCandidates() {
  const query = filters.query.trim().toLowerCase();
  return candidates.filter((candidate) => {
    const ratingText = Object.values(candidate.evaluationRatings || {}).join(" ");
    const haystack = `${candidate.name} ${candidate.email} ${candidate.phone} ${jobTitle(candidate.jobId)} ${storeName(candidate.storeId)} ${sourceLabel(candidate)} ${candidate.status} ${candidate.evaluation} ${ratingText} ${candidate.hiringDecision} ${candidate.overallRating} ${candidate.memo}`.toLowerCase();
    const queryMatches = !query || haystack.includes(query);
    const sourceMatches = filters.source === "all" || candidate.applicationSource === filters.source;
    return queryMatches && sourceMatches && matchesTodoFilter(candidate);
  });
}

function layout(title, content) {
  return `<div class="min-h-screen bg-slate-50 lg:grid lg:grid-cols-[256px_1fr]">${sidebar()}<div id="sidebarOverlay" class="fixed inset-0 z-30 hidden bg-slate-950/40 lg:hidden"></div><div class="min-w-0">${header(title)}<main class="p-4 lg:p-6">${content}</main></div>${editModal()}</div>`;
}

function sidebar() {
  return `<aside id="sidebar" class="fixed inset-y-0 left-0 z-40 w-72 -translate-x-full bg-slate-950 text-white shadow-xl transition lg:static lg:w-64 lg:translate-x-0 lg:shadow-none"><div class="flex h-16 items-center gap-3 border-b border-white/10 px-5"><span class="grid h-10 w-10 place-items-center rounded-xl bg-blue-600 font-bold">採</span><div><h1 class="text-base font-bold">採用管理</h1><p class="text-xs text-slate-400">採用管理システム</p></div></div><nav class="grid gap-1 p-4">${navigation.map(([id, label]) => `<button class="rounded-xl px-4 py-3 text-left text-sm font-semibold transition ${id === activePage ? "bg-blue-600 text-white" : "text-slate-300 hover:bg-white/10 hover:text-white"}" data-page="${id}">${label}</button>`).join("")}</nav></aside>`;
}

function header(title) {
  return `<header class="sticky top-0 z-30 flex min-h-16 items-center justify-between gap-3 border-b border-slate-200 bg-white/90 px-4 backdrop-blur lg:px-6"><div class="flex min-w-0 items-center gap-3"><button id="menuToggle" class="grid h-10 w-10 place-items-center rounded-xl border border-slate-200 text-slate-600 lg:hidden" aria-label="サイドバーを開く">☰</button><div class="min-w-0"><p class="text-xs font-semibold uppercase tracking-wide text-blue-600">採用管理システム Ver2</p><h2 class="truncate text-xl font-bold text-slate-950">${escapeHtml(title)}</h2></div></div><div class="flex items-center gap-2"><button class="grid h-10 w-10 place-items-center rounded-xl border border-slate-200 text-slate-600" aria-label="通知">🔔</button><button class="grid h-10 w-10 place-items-center rounded-xl border border-slate-200 text-slate-600" aria-label="ダークモード切替">◐</button><button class="grid h-10 w-10 place-items-center rounded-full bg-slate-900 text-sm font-bold text-white" aria-label="プロフィール">採</button></div></header>`;
}

function dashboardPage() {
  return `<section class="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">${kpis().map((kpi) => card(`<p class="text-sm font-medium text-slate-500">${escapeHtml(kpi.label)}</p><strong class="mt-3 block text-3xl text-slate-950">${escapeHtml(kpi.value)}</strong><div class="mt-3">${badge("最新", kpi.tone)}</div>`)).join("")}</section><section class="mt-6 grid gap-6 xl:grid-cols-[1fr_380px]">${applicantTable(candidates)}<div class="grid gap-4">${sourcePanel()}${todayActionPanel()}</div></section>`;
}

function applicantTable(rows) {
  if (!rows.length) return emptyState("応募者がいません", "検索条件に一致する応募者はいません。");
  return table([
    { label: "応募者", render: (row) => `<strong>${escapeHtml(row.name)}</strong><br><span class="text-slate-500">${escapeHtml(row.email)}</span>` },
    { label: "募集区分", render: (row) => escapeHtml(jobTitle(row.jobId)) },
    { label: "希望店舗", render: (row) => escapeHtml(storeName(row.storeId)) },
    { label: "応募媒体", render: (row) => badge(sourceLabel(row), "primary") },
    { label: "履歴書", render: (row) => row.resume ? badge("履歴書あり", "success") : `<span class="text-slate-400">未登録</span>` },
    { label: "総合評価", render: (row) => overallRatingBadge(row.overallRating) },
    { label: "選考状況", render: (row) => badge(row.status, statusTone(row.status)) },
    { label: "操作", render: (row) => `<div class="flex flex-wrap gap-2"><button class="inline-flex items-center gap-1 rounded-lg border border-red-200 px-3 py-1.5 text-xs font-semibold text-red-700 transition hover:bg-red-50" data-delete-applicant-id="${escapeHtml(row.id)}" type="button" aria-label="${escapeHtml(row.name)}を削除"><span aria-hidden="true">🗑</span><span>削除</span></button><button class="rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-semibold text-blue-700 transition hover:border-blue-200 hover:bg-blue-50" data-edit-button type="button">✎ 編集</button></div>` }
  ], rows, true);
}

function sourcePanel() {
  return card(`<h3 class="text-base font-semibold text-slate-950">応募媒体</h3><div class="mt-4 grid gap-3">${sourceStats().map((stats) => `<article><div class="flex items-center justify-between gap-3 text-sm"><strong>${escapeHtml(stats.source)}</strong><span class="text-slate-500">${stats.applications}件</span></div><div class="mt-2 h-2 rounded-full bg-slate-100"><div class="h-2 rounded-full bg-blue-600" style="width: ${stats.hireRate}%"></div></div><p class="mt-1 text-xs text-slate-500">採用率 ${stats.hireRate}%</p></article>`).join("")}</div>`);
}

function todayInterviews() {
  return candidates
    .filter((candidate) => isToday(candidate.interviewAt))
    .sort((a, b) => new Date(a.interviewAt) - new Date(b.interviewAt));
}

function todoStats() {
  return todoDefinitions().map((todo) => ({
    key: todo.key,
    label: todo.label,
    count: candidates.filter(todo.matches).length
  }));
}

function todayActionPanel() {
  const interviewsToday = todayInterviews();
  const interviewRows = interviewsToday.length
    ? interviewsToday.map((candidate) => `<li class="grid gap-1 rounded-xl bg-slate-50 p-3 text-sm sm:grid-cols-[56px_1fr] sm:items-center"><time class="font-semibold text-slate-950">${formatTime(candidate.interviewAt)}</time><span>${escapeHtml(candidate.name)}　${escapeHtml(jobTitle(candidate.jobId))}／${escapeHtml(storeName(candidate.storeId))}</span></li>`).join("")
    : `<li class="rounded-xl bg-slate-50 p-3 text-sm text-slate-500">本日の面接予定はありません</li>`;
  const todoRows = todoStats().map((todo) => `<li class="flex items-center justify-between gap-3 rounded-xl border border-slate-100 px-3 py-2 text-sm"><span>□ ${escapeHtml(todo.label)}</span><button class="rounded-lg px-2 py-1 text-sm font-bold text-blue-700 transition hover:bg-blue-50" type="button" data-todo-filter="${escapeHtml(todo.key)}" aria-label="${escapeHtml(todo.label)}の応募者を表示">${todo.count}件</button></li>`).join("");
  return card(`
    <h3 class="text-base font-semibold text-slate-950">本日の予定・要対応</h3>
    <div class="mt-4 grid gap-5">
      <section>
        <h4 class="text-sm font-semibold text-slate-700">本日の面接予定</h4>
        <ul class="mt-2 grid gap-2">${interviewRows}</ul>
      </section>
      <section>
        <h4 class="text-sm font-semibold text-slate-700">要対応ToDo</h4>
        <ul class="mt-2 grid gap-2">${todoRows}</ul>
      </section>
    </div>
  `);
}

function resumeSection(candidate) {
  const resume = candidate.resume;
  const resumeDetails = resume
    ? `<div class="grid gap-2 rounded-xl border border-slate-100 bg-white p-3 text-sm">
        <div class="flex flex-wrap items-center justify-between gap-2">
          <div>
            <p class="font-semibold text-slate-950">${escapeHtml(resume.fileName)}</p>
            <p class="mt-1 text-xs text-slate-500">アップロード日時: ${escapeHtml(formatUploadedAt(resume.uploadedAt))}</p>
          </div>
          ${badge("登録済み", "success")}
        </div>
        <div class="flex flex-wrap gap-2 pt-1">
          <a href="${escapeHtml(resume.dataUrl)}" target="_blank" rel="noopener" class="inline-flex min-h-9 items-center justify-center rounded-xl bg-white px-3 text-xs font-semibold text-blue-700 ring-1 ring-slate-200 transition hover:bg-blue-50">プレビュー</a>
          <a href="${escapeHtml(resume.dataUrl)}" download="${escapeHtml(resume.fileName)}" class="inline-flex min-h-9 items-center justify-center rounded-xl bg-white px-3 text-xs font-semibold text-blue-700 ring-1 ring-slate-200 transition hover:bg-blue-50">ダウンロード</a>
          <button id="deleteResume" type="button" class="inline-flex min-h-9 items-center justify-center rounded-xl bg-red-50 px-3 text-xs font-semibold text-red-700 transition hover:bg-red-100">削除</button>
        </div>
      </div>`
    : `<p class="rounded-xl border border-dashed border-slate-200 bg-white p-3 text-sm text-slate-500">履歴書は未登録です。</p>`;
  return `
    <section class="rounded-2xl border border-slate-100 bg-slate-50 p-4">
      <h3 class="text-sm font-semibold text-slate-700">履歴書</h3>
      <div class="mt-3 grid gap-3">
        ${resumeDetails}
        <label id="resumeDropZone" class="grid cursor-pointer place-items-center rounded-xl border border-dashed border-slate-300 bg-white p-5 text-center text-sm text-slate-600 transition hover:border-blue-300 hover:bg-blue-50/50">
          <span class="font-semibold text-slate-700">PDF / JPG / PNG を選択またはドロップ</span>
          <span class="mt-1 text-xs text-slate-500">アップロード後、応募者データに一時保存されます。</span>
          <input id="resumeUpload" type="file" accept="application/pdf,image/jpeg,image/png" class="sr-only" />
        </label>
      </div>
    </section>
  `;
}

function contactMessageSection() {
  return `
    <section class="rounded-2xl border border-slate-100 bg-slate-50 p-4">
      <div class="flex flex-wrap items-center justify-between gap-2">
        <h3 class="text-sm font-semibold text-slate-700">連絡文作成</h3>
        <span id="copyMessageStatus" class="text-xs font-semibold text-green-700" aria-live="polite"></span>
      </div>
      <div class="mt-3 grid gap-2 sm:grid-cols-4">
        <button class="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-semibold text-slate-700 transition hover:bg-blue-50 hover:text-blue-700" type="button" data-message-template="interview">面接案内</button>
        <button class="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-semibold text-slate-700 transition hover:bg-green-50 hover:text-green-700" type="button" data-message-template="hire">採用通知</button>
        <button class="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-semibold text-slate-700 transition hover:bg-red-50 hover:text-red-700" type="button" data-message-template="reject">不採用通知</button>
        <button class="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-100" type="button" data-message-template="hold">保留連絡</button>
      </div>
      <label class="mt-3 grid gap-1.5 text-sm font-medium text-slate-600">生成文<textarea id="contactMessage" rows="8" class="min-h-40 resize-y rounded-xl border border-slate-200 bg-white px-3 py-2 text-slate-900 outline-none transition focus:border-blue-600 focus:ring-4 focus:ring-blue-100" placeholder="テンプレートを選択すると連絡文が生成されます。"></textarea></label>
      <div class="mt-3 flex justify-end">
        <button id="copyContactMessage" class="inline-flex min-h-10 items-center justify-center rounded-xl bg-white px-4 text-sm font-semibold text-slate-700 ring-1 ring-slate-200 transition hover:bg-slate-50" type="button">コピーする</button>
      </div>
    </section>
  `;
}

function applicantsPage() {
  const sourceOptions = APPLICATION_SOURCES.map((source) => ({ label: source, value: source }));
  const jobOptions = jobs.map((job) => ({ label: job.title, value: job.id }));
  const storeOptions = stores.map((store) => ({ label: store.name, value: store.id }));
  const todoFilterChip = filters.todo === "all" ? "" : `<div class="mb-3 flex flex-wrap items-center gap-2 rounded-2xl border border-blue-100 bg-blue-50 px-4 py-3 text-sm text-blue-800"><strong>ToDo: ${escapeHtml(todoLabel(filters.todo))}</strong><button id="clearTodoFilter" class="rounded-lg bg-white px-3 py-1 text-xs font-semibold text-blue-700 ring-1 ring-blue-100 transition hover:bg-blue-100" type="button">解除</button></div>`;
  return `<section class="grid gap-6 xl:grid-cols-[1fr_380px]"><div><div class="mb-4 grid gap-3 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm md:grid-cols-[1fr_220px]">${input("検索", "search", "氏名・募集区分・希望店舗・媒体・選考状況", "text", filters.query)}${select("応募媒体", "source", [{ label: "すべて", value: "all" }, ...sourceOptions], filters.source)}</div>${todoFilterChip}<div id="applicantResults">${applicantTable(filteredCandidates())}</div></div>${card(`<h3 class="text-base font-semibold text-slate-950">応募者登録</h3><form class="mt-4 grid gap-4">${input("氏名", "name", "山田 太郎")}${input("電話番号", "phone", "090-0000-0000", "tel")}${input("メール", "email", "example@company.com", "email")}${select("募集区分", "jobId", jobOptions)}${select("希望店舗", "storeId", storeOptions)}${select("応募媒体", "applicationSource", sourceOptions)}${input("その他媒体名", "applicationSourceOther", "その他を選択した場合のみ使用")}${button("応募者を保存", "primary")}</form>`)}</section>`;
}

function interviewsPage() {
  const visibleInterviews = interviews.filter((interview) => candidates.some((candidate) => candidate.id === interview.candidateId));
  return table([
    { label: "応募者", render: (row) => escapeHtml(candidates.find((candidate) => candidate.id === row.candidateId)?.name || "未設定") },
    { label: "募集区分", render: (row) => escapeHtml(jobTitle(candidates.find((candidate) => candidate.id === row.candidateId)?.jobId)) },
    { label: "希望店舗", render: (row) => escapeHtml(storeName(candidates.find((candidate) => candidate.id === row.candidateId)?.storeId)) },
    { label: "面接日時", render: (row) => escapeHtml(formatDateTime(row.scheduledAt)) },
    { label: "面接担当", render: (row) => escapeHtml(row.interviewer) },
    { label: "形式", render: (row) => badge(row.format, row.format === "オンライン" ? "primary" : "success") }
  ], visibleInterviews, false);
}

function storesPage() {
  return `<section class="grid gap-4 md:grid-cols-2 xl:grid-cols-3">${stores.map((store) => card(`<p class="text-sm text-slate-500">${escapeHtml(store.area)}</p><h3 class="mt-2 text-lg font-semibold text-slate-950">${escapeHtml(store.name)}</h3><p class="mt-4 text-sm text-slate-600">募集区分数: <strong>${store.openings}</strong></p>`)).join("")}</section>`;
}

function analyticsPage() {
  return sourcePanel();
}

function editModal() {
  if (!editingCandidateId) return "";
  const candidate = candidates.find((item) => item.id === editingCandidateId);
  if (!candidate) return "";
  const sourceOptions = APPLICATION_SOURCES.map((source) => ({ label: source, value: source }));
  const statusOptions = CANDIDATE_STATUSES.map((status) => ({ label: status, value: status }));
  const hiringDecisionOptions = HIRING_DECISIONS.map((decision) => ({ label: decision, value: decision }));
  const overallRatingOptions = OVERALL_RATINGS.map((rating) => ({ label: rating, value: rating }));
  const jobOptions = jobs.map((job) => ({ label: job.title, value: job.id }));
  const storeOptions = stores.map((store) => ({ label: store.name, value: store.id }));
  const evaluationFields = EVALUATION_ITEMS.map(([key, label]) => ratingSelect(label, `rating_${key}`, candidate.evaluationRatings[key])).join("");
  const showOther = candidate.applicationSource === "その他";
  return `
    <div class="fixed inset-0 z-50 grid place-items-center bg-slate-950/40 p-4" role="dialog" aria-modal="true" aria-labelledby="editCandidateTitle">
      <section class="max-h-[92vh] w-full max-w-2xl overflow-y-auto rounded-2xl bg-white shadow-xl">
        <div class="flex items-center justify-between gap-4 border-b border-slate-200 p-5">
          <h2 id="editCandidateTitle" class="text-lg font-semibold text-slate-950">応募者を編集</h2>
          <button id="closeEditModal" class="grid h-9 w-9 place-items-center rounded-xl text-slate-500 transition hover:bg-slate-100" type="button" aria-label="閉じる">×</button>
        </div>
        <form id="editCandidateForm" class="grid gap-4 p-5">
          <div class="grid gap-4 sm:grid-cols-2">
            ${input("氏名", "name", "", "text", candidate.name)}
            ${input("電話番号", "phone", "", "tel", candidate.phone)}
          </div>
          ${input("メール", "email", "", "email", candidate.email)}
          <div class="grid gap-4 sm:grid-cols-2">
            ${select("募集区分", "jobId", jobOptions, candidate.jobId)}
            ${select("希望店舗", "storeId", storeOptions, candidate.storeId)}
          </div>
          <div class="grid gap-4 sm:grid-cols-2">
            ${select("選考状況", "status", statusOptions, candidate.status)}
            ${select("応募媒体", "applicationSource", sourceOptions, candidate.applicationSource)}
          </div>
          <div class="grid gap-4 sm:grid-cols-2">
            <div id="otherSourceField" class="${showOther ? "" : "hidden"}">${input("その他媒体名", "applicationSourceOther", "", "text", candidate.applicationSourceOther)}</div>
            ${select("採否", "hiringDecision", hiringDecisionOptions, candidate.hiringDecision)}
          </div>
          ${select("総合評価", "overallRating", overallRatingOptions, candidate.overallRating)}
          ${textarea("面接履歴", "interviewHistory", "面接日時・担当者・結果など", candidate.interviewHistory)}
          <section class="rounded-2xl border border-slate-100 bg-slate-50 p-4">
            <h3 class="text-sm font-semibold text-slate-700">評価</h3>
            <div class="mt-3 grid gap-3 sm:grid-cols-2">${evaluationFields}</div>
          </section>
          ${resumeSection(candidate)}
          ${contactMessageSection()}
          ${textarea("メモ", "memo", "応募者に関するメモ", candidate.memo)}
          <div class="flex justify-end gap-3 border-t border-slate-100 pt-4">
            ${button("キャンセル", "secondary", "id=\"cancelEditCandidate\" type=\"button\"")}
            ${button("削除", "danger", "id=\"deleteApplicantFromModal\" type=\"button\"")}
            ${button("保存", "primary", "type=\"submit\"")}
          </div>
        </form>
      </section>
    </div>
  `;
}

function openEditModal(candidateId) {
  if (!candidateId) return;
  editingCandidateId = candidateId;
  render();
}

function closeEditModal() {
  editingCandidateId = "";
  render();
}

function updateCandidate(form) {
  const applicant = candidates.find((item) => item.id === editingCandidateId);
  if (!applicant) return;
  const data = new FormData(form);
  const applicationSource = String(data.get("applicationSource"));
  const evaluationRatings = EVALUATION_ITEMS.reduce((result, [key]) => {
    result[key] = String(data.get(`rating_${key}`));
    return result;
  }, {});
  Object.assign(applicant, {
    name: String(data.get("name")).trim(),
    email: String(data.get("email")).trim(),
    phone: String(data.get("phone")).trim(),
    jobId: String(data.get("jobId")),
    storeId: String(data.get("storeId")),
    status: String(data.get("status")),
    applicationSource,
    applicationSourceOther: applicationSource === "その他" ? String(data.get("applicationSourceOther")).trim() : "",
    interviewHistory: String(data.get("interviewHistory")).trim(),
    evaluation: Object.values(evaluationRatings).join(" "),
    evaluationRatings,
    hiringDecision: String(data.get("hiringDecision")),
    memo: String(data.get("memo")).trim()
  });
  applicant.overallRating = normalizeOverallRating(String(data.get("overallRating")));
  saveCandidates();
  editingCandidateId = "";
  render();
}

function messageContext(candidate) {
  return {
    name: candidate.name || "応募者",
    job: jobTitle(candidate.jobId),
    store: storeName(candidate.storeId),
    interviewAt: candidate.interviewAt ? formatDateTime(candidate.interviewAt) : ""
  };
}

function currentModalCandidate(candidate) {
  const form = document.querySelector("#editCandidateForm");
  if (!form) return candidate;
  const data = new FormData(form);
  return {
    ...candidate,
    name: String(data.get("name")).trim() || candidate.name,
    jobId: String(data.get("jobId") || candidate.jobId),
    storeId: String(data.get("storeId") || candidate.storeId)
  };
}

function generateContactMessage(candidate, templateType) {
  const context = messageContext(candidate);
  const interviewLine = context.interviewAt ? `\n面接日時：${context.interviewAt}` : "";
  const baseInfo = `\n募集区分：${context.job}\n配属店舗：${context.store}${interviewLine}`;
  const templates = {
    interview: `${context.name} 様\n\nこの度は${context.store}の${context.job}へご応募いただき、誠にありがとうございます。\n面接についてご案内いたします。${baseInfo}\n\nご都合が悪い場合は、お手数ですがご返信ください。\n当日お会いできますことを楽しみにしております。\n\n採用担当`,
    hire: `${context.name} 様\n\nこの度は${context.store}の${context.job}選考にご参加いただき、誠にありがとうございました。\n選考の結果、ぜひ採用としてお迎えしたくご連絡いたしました。${baseInfo}\n\n今後の勤務開始日や必要書類について、改めてご案内いたします。\n引き続きどうぞよろしくお願いいたします。\n\n採用担当`,
    reject: `${context.name} 様\n\nこの度は${context.store}の${context.job}へご応募いただき、誠にありがとうございました。\n慎重に選考いたしました結果、誠に残念ながら今回はご希望に添えない結果となりました。${baseInfo}\n\n貴重なお時間をいただきましたこと、心より御礼申し上げます。\n${context.name}様の今後のご活躍をお祈り申し上げます。\n\n採用担当`,
    hold: `${context.name} 様\n\nこの度は${context.store}の${context.job}選考にご参加いただき、誠にありがとうございます。\n現在、選考結果について社内で確認を進めております。${baseInfo}\n\n結果のご連絡まで今しばらくお待ちいただけますでしょうか。\nお待たせして恐れ入りますが、何卒よろしくお願いいたします。\n\n採用担当`
  };
  return templates[templateType] || "";
}

function setCopyMessageStatus(message) {
  const status = document.querySelector("#copyMessageStatus");
  if (status) status.textContent = message;
}

async function copyContactMessage() {
  const textareaElement = document.querySelector("#contactMessage");
  if (!textareaElement?.value.trim()) return;
  try {
    await navigator.clipboard.writeText(textareaElement.value);
  } catch (error) {
    textareaElement.select();
    document.execCommand("copy");
  }
  setCopyMessageStatus("コピーしました");
}

function readFileAsDataUrl(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.addEventListener("load", () => resolve(String(reader.result)));
    reader.addEventListener("error", reject);
    reader.readAsDataURL(file);
  });
}

async function uploadResume(file) {
  const candidate = candidates.find((item) => item.id === editingCandidateId);
  if (!candidate || !file) return;
  if (!ALLOWED_RESUME_TYPES.includes(file.type)) {
    alert("PDF、JPG、PNG のいずれかを選択してください。");
    return;
  }
  const previousResume = candidate.resume;
  try {
    const dataUrl = await readFileAsDataUrl(file);
    candidate.resume = {
      fileName: file.name,
      fileType: file.type,
      uploadedAt: new Date().toISOString(),
      dataUrl
    };
    candidate.resumeName = file.name;
    saveCandidates();
    render();
  } catch (error) {
    candidate.resume = previousResume;
    alert("履歴書の保存に失敗しました。ファイルサイズを小さくして再度お試しください。");
  }
}

function deleteResume() {
  const candidate = candidates.find((item) => item.id === editingCandidateId);
  if (!candidate || !candidate.resume) return;
  if (!confirm("履歴書を削除しますか？")) return;
  candidate.resume = null;
  candidate.resumeName = "";
  saveCandidates();
  render();
}

function deleteApplicant(applicantId, showApplicantsPage = false) {
  const applicant = candidates.find((item) => item.id === applicantId);
  if (!applicant || !confirm("この応募者を削除しますか？")) return false;
  candidates = candidates.filter((item) => item.id !== applicantId);
  for (let index = interviews.length - 1; index >= 0; index -= 1) {
    if (interviews[index].candidateId === applicantId) interviews.splice(index, 1);
  }
  saveCandidates();
  editingCandidateId = "";
  if (showApplicantsPage) activePage = "applicants";
  render();
  return true;
}

function render() {
  const pages = { dashboard: dashboardPage, applicants: applicantsPage, interviews: interviewsPage, stores: storesPage, analytics: analyticsPage, settings: () => emptyState("設定", "今後の機能追加用ページです。") };
  const titles = { dashboard: "ダッシュボード", applicants: "応募者", interviews: "面接", stores: "配属店舗", analytics: "分析", settings: "設定" };
  const page = pages[activePage] ? pages[activePage]() : emptyState("404", "ページが見つかりません。");
  document.querySelector("#app").innerHTML = layout(titles[activePage] || "404", page);
  bindEvents();
}

function bindEvents() {
  document.querySelectorAll("[data-page]").forEach((item) => item.addEventListener("click", () => {
    activePage = item.dataset.page;
    editingCandidateId = "";
    render();
  }));
  document.querySelector("#menuToggle")?.addEventListener("click", () => {
    document.querySelector("#sidebar")?.classList.remove("-translate-x-full");
    document.querySelector("#sidebarOverlay")?.classList.remove("hidden");
  });
  document.querySelector("#sidebarOverlay")?.addEventListener("click", () => {
    document.querySelector("#sidebar")?.classList.add("-translate-x-full");
    document.querySelector("#sidebarOverlay")?.classList.add("hidden");
  });
  document.querySelector("input[name='search']")?.addEventListener("input", (event) => {
    filters = { ...filters, query: event.currentTarget.value };
    renderApplicantResults();
  });
  document.querySelector("select[name='source']")?.addEventListener("change", (event) => {
    filters = { ...filters, source: event.currentTarget.value };
    renderApplicantResults();
  });
  document.querySelector("#clearTodoFilter")?.addEventListener("click", () => {
    filters = { ...filters, todo: "all" };
    render();
  });
  document.querySelectorAll("[data-todo-filter]").forEach((buttonElement) => {
    buttonElement.addEventListener("click", () => {
      filters = { ...filters, todo: buttonElement.dataset.todoFilter, query: "" };
      activePage = "applicants";
      editingCandidateId = "";
      render();
    });
  });
  bindCandidateRows();
  document.querySelector("#closeEditModal")?.addEventListener("click", closeEditModal);
  document.querySelector("#cancelEditCandidate")?.addEventListener("click", closeEditModal);
  document.querySelector("#deleteApplicantFromModal")?.addEventListener("click", () => {
    deleteApplicant(editingCandidateId, true);
  });
  document.querySelector("#editCandidateForm")?.addEventListener("submit", (event) => {
    event.preventDefault();
    updateCandidate(event.currentTarget);
  });
  document.querySelector("#editCandidateForm select[name='applicationSource']")?.addEventListener("change", (event) => {
    document.querySelector("#otherSourceField")?.classList.toggle("hidden", event.currentTarget.value !== "その他");
  });
  document.querySelectorAll("[data-message-template]").forEach((buttonElement) => {
    buttonElement.addEventListener("click", () => {
      const candidate = candidates.find((item) => item.id === editingCandidateId);
      const textareaElement = document.querySelector("#contactMessage");
      if (!candidate || !textareaElement) return;
      textareaElement.value = generateContactMessage(currentModalCandidate(candidate), buttonElement.dataset.messageTemplate);
      setCopyMessageStatus("");
    });
  });
  document.querySelector("#copyContactMessage")?.addEventListener("click", copyContactMessage);
  document.querySelector("#resumeUpload")?.addEventListener("change", (event) => {
    uploadResume(event.currentTarget.files?.[0]);
  });
  document.querySelector("#deleteResume")?.addEventListener("click", deleteResume);
  const dropZone = document.querySelector("#resumeDropZone");
  dropZone?.addEventListener("dragover", (event) => {
    event.preventDefault();
    dropZone.classList.add("border-blue-400", "bg-blue-50");
  });
  dropZone?.addEventListener("dragleave", () => {
    dropZone.classList.remove("border-blue-400", "bg-blue-50");
  });
  dropZone?.addEventListener("drop", (event) => {
    event.preventDefault();
    dropZone.classList.remove("border-blue-400", "bg-blue-50");
    uploadResume(event.dataTransfer?.files?.[0]);
  });
}

function renderApplicantResults() {
  const results = document.querySelector("#applicantResults");
  if (!results) return;
  results.innerHTML = applicantTable(filteredCandidates());
  bindCandidateRows();
}

function bindCandidateRows() {
  document.querySelectorAll("[data-candidate-id]").forEach((row) => {
    row.addEventListener("click", (event) => {
      if (isInteractiveTarget(event.target)) return;
      openEditModal(row.dataset.candidateId);
    });
    row.addEventListener("keydown", (event) => {
      if (isInteractiveTarget(event.target)) return;
      if (event.key === "Enter" || event.key === " ") openEditModal(row.dataset.candidateId);
    });
  });
  document.querySelectorAll("[data-edit-button]").forEach((buttonElement) => {
    buttonElement.addEventListener("click", (event) => {
      event.stopPropagation();
      const candidateId = event.currentTarget.closest("[data-candidate-id]")?.dataset.candidateId;
      if (candidateId) openEditModal(candidateId);
    });
  });
  document.querySelectorAll("[data-delete-applicant-id]").forEach((buttonElement) => {
    buttonElement.addEventListener("click", (event) => {
      event.stopPropagation();
      deleteApplicant(event.currentTarget.dataset.deleteApplicantId);
    });
  });
}

window.addEventListener("error", () => {
  document.querySelector("#app").innerHTML = layout("500", emptyState("500", "エラーが発生しました。時間をおいて再度お試しください。"));
});

render();
