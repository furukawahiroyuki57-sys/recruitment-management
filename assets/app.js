const STORAGE_KEY = "recruitment-management-v2-candidates";
const APPLICATION_SOURCES = ["Airワーク", "Indeed", "グルメキャリー", "バイトル", "飲食店ドットコム", "求人ボックス", "エンゲージ", "タウンワーク", "リファラル（紹介）", "店舗看板", "Instagram", "TikTok", "X", "ホームページ", "その他"];
const CANDIDATE_STATUSES = ["応募受付", "書類選考中", "面接調整中", "面接確定", "内定", "不採用"];
const navigation = [["dashboard", "Dashboard"], ["applicants", "Applicants"], ["interviews", "Interviews"], ["stores", "Stores"], ["analytics", "Analytics"], ["settings", "Settings"]];
const jobs = [
  { id: "j1", title: "フロントエンドエンジニア", location: "東京 / リモート", type: "正社員", status: "公開中" },
  { id: "j2", title: "カスタマーサクセス", location: "大阪", type: "正社員", status: "公開中" },
  { id: "j3", title: "採用アシスタント", location: "東京", type: "契約社員", status: "停止中" }
];
const defaultCandidates = [
  { id: "c1", name: "佐藤 花子", email: "hanako.sato@example.com", jobId: "j1", status: "面接確定", applicationSource: "Indeed", applicationSourceOther: "", appliedAt: "2026-07-05", interviewAt: "2026-07-05T14:00", interviewer: "山田", resumeName: "sato_hanako_resume.pdf" },
  { id: "c2", name: "田中 誠", email: "makoto.tanaka@example.com", jobId: "j2", status: "面接調整中", applicationSource: "Airワーク", applicationSourceOther: "", appliedAt: "2026-07-05", interviewAt: "", interviewer: "鈴木", resumeName: "tanaka_cv.docx" },
  { id: "c3", name: "鈴木 彩", email: "aya.suzuki@example.com", jobId: "j3", status: "内定", applicationSource: "リファラル（紹介）", applicationSourceOther: "", appliedAt: "2026-06-20", interviewAt: "2026-07-05T10:00", interviewer: "中村", resumeName: "suzuki_aya.pdf" },
  { id: "c4", name: "高橋 蓮", email: "ren.takahashi@example.com", jobId: "j1", status: "書類選考中", applicationSource: "その他", applicationSourceOther: "合同説明会", appliedAt: "2026-07-02", interviewAt: "", interviewer: "", resumeName: "takahashi_ren.pdf" }
];
const interviews = [
  { id: "i1", candidateId: "c1", scheduledAt: "2026-07-05T14:00", interviewer: "山田", format: "オンライン" },
  { id: "i2", candidateId: "c3", scheduledAt: "2026-07-05T10:00", interviewer: "中村", format: "対面" }
];
const stores = [
  { id: "s1", name: "渋谷店", area: "東京", openings: 3 },
  { id: "s2", name: "梅田店", area: "大阪", openings: 2 },
  { id: "s3", name: "横浜店", area: "神奈川", openings: 1 }
];

let activePage = "dashboard";
let editingCandidateId = "";
let filters = { query: "", source: "all" };
let candidates = loadCandidates();

function loadCandidates() {
  const stored = localStorage.getItem(STORAGE_KEY);
  const parsed = stored ? JSON.parse(stored) : defaultCandidates;
  return parsed.map((candidate) => ({
    ...candidate,
    applicationSource: candidate.applicationSource || "Indeed",
    applicationSourceOther: candidate.applicationSourceOther || ""
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

function card(content) {
  return `<section class="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">${content}</section>`;
}

function button(label, variant = "primary", attrs = "") {
  const classes = {
    primary: "bg-blue-600 text-white hover:bg-blue-700",
    secondary: "bg-white text-slate-700 ring-1 ring-slate-200 hover:bg-slate-50",
    ghost: "text-slate-600 hover:bg-slate-100"
  };
  return `<button ${attrs} class="inline-flex min-h-10 items-center justify-center rounded-xl px-4 text-sm font-semibold shadow-sm transition ${classes[variant]}">${escapeHtml(label)}</button>`;
}

function input(label, name, placeholder = "", type = "text", value = "") {
  return `<label class="grid gap-1.5 text-sm font-medium text-slate-600">${escapeHtml(label)}<input name="${name}" type="${type}" value="${escapeHtml(value)}" placeholder="${escapeHtml(placeholder)}" class="min-h-10 rounded-xl border border-slate-200 bg-white px-3 text-slate-900 outline-none transition focus:border-blue-600 focus:ring-4 focus:ring-blue-100" /></label>`;
}

function select(label, name, options, selected = "") {
  return `<label class="grid gap-1.5 text-sm font-medium text-slate-600">${escapeHtml(label)}<select name="${name}" class="min-h-10 rounded-xl border border-slate-200 bg-white px-3 text-slate-900 outline-none transition focus:border-blue-600 focus:ring-4 focus:ring-blue-100">${options.map((option) => `<option value="${escapeHtml(option.value)}" ${option.value === selected ? "selected" : ""}>${escapeHtml(option.label)}</option>`).join("")}</select></label>`;
}

function table(columns, rows, editable = false) {
  return `<div class="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm"><div class="w-full overflow-x-auto"><table class="w-full min-w-full table-auto text-left text-sm"><thead class="bg-slate-50 text-xs font-semibold uppercase tracking-wide text-slate-500"><tr>${columns.map((column) => `<th class="px-4 py-3">${escapeHtml(column.label)}</th>`).join("")}</tr></thead><tbody class="divide-y divide-slate-100">${rows.map((row) => {
    const editableAttrs = editable ? `class="cursor-pointer align-top transition hover:bg-blue-50/60 focus-within:bg-blue-50" data-candidate-id="${escapeHtml(row.id)}" tabindex="0" aria-label="${escapeHtml(row.name)}を編集"` : `class="align-top"`;
    return `<tr ${editableAttrs}>${columns.map((column) => `<td class="px-4 py-3">${column.render(row)}</td>`).join("")}</tr>`;
  }).join("")}</tbody></table></div></div>`;
}

function emptyState(title, message) {
  return `<div class="rounded-2xl border border-dashed border-slate-300 bg-white p-8 text-center shadow-sm"><h3 class="text-base font-semibold text-slate-950">${escapeHtml(title)}</h3><p class="mt-2 text-sm text-slate-500">${escapeHtml(message)}</p></div>`;
}

function skeleton() {
  return `<div class="animate-pulse space-y-3 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"><div class="h-4 rounded bg-slate-200"></div><div class="h-4 rounded bg-slate-200"></div><div class="h-4 w-2/3 rounded bg-slate-200"></div></div>`;
}

function sourceLabel(candidate) {
  return candidate.applicationSource === "その他" && candidate.applicationSourceOther ? `その他（${candidate.applicationSourceOther}）` : candidate.applicationSource;
}

function sourceStats() {
  return APPLICATION_SOURCES.map((source) => {
    const matched = candidates.filter((candidate) => candidate.applicationSource === source);
    const hires = matched.filter((candidate) => candidate.status === "内定").length;
    return { source, applications: matched.length, hires, hireRate: matched.length ? Math.round((hires / matched.length) * 100) : 0 };
  }).filter((stats) => stats.applications > 0);
}

function jobTitle(jobId) {
  return jobs.find((job) => job.id === jobId)?.title || "未設定";
}

function formatDateTime(value) {
  if (!value) return "未設定";
  return new Intl.DateTimeFormat("ja-JP", { dateStyle: "medium", timeStyle: "short" }).format(new Date(value));
}

function isToday(value) {
  if (!value) return false;
  const date = new Date(value);
  const now = new Date();
  return date.getFullYear() === now.getFullYear() && date.getMonth() === now.getMonth() && date.getDate() === now.getDate();
}

function kpis() {
  return [
    { label: "Today's Applicants", value: String(candidates.filter((candidate) => isToday(candidate.appliedAt)).length), tone: "primary" },
    { label: "Pending", value: String(candidates.filter((candidate) => !["内定", "不採用"].includes(candidate.status)).length), tone: "warning" },
    { label: "Today's Interviews", value: String(candidates.filter((candidate) => isToday(candidate.interviewAt)).length), tone: "success" },
    { label: "Monthly Hires", value: String(candidates.filter((candidate) => candidate.status === "内定").length), tone: "danger" }
  ];
}

function filteredCandidates() {
  const query = filters.query.trim().toLowerCase();
  return candidates.filter((candidate) => {
    const haystack = `${candidate.name} ${candidate.email} ${jobTitle(candidate.jobId)} ${sourceLabel(candidate)} ${candidate.status}`.toLowerCase();
    const queryMatches = !query || haystack.includes(query);
    const sourceMatches = filters.source === "all" || candidate.applicationSource === filters.source;
    return queryMatches && sourceMatches;
  });
}

function layout(title, content) {
  return `<div class="min-h-screen bg-slate-50 lg:grid lg:grid-cols-[256px_1fr]">${sidebar()}<div id="sidebarOverlay" class="fixed inset-0 z-30 hidden bg-slate-950/40 lg:hidden"></div><div class="min-w-0">${header(title)}<main class="p-4 lg:p-6">${content}</main></div>${editModal()}</div>`;
}

function sidebar() {
  return `<aside id="sidebar" class="fixed inset-y-0 left-0 z-40 w-72 -translate-x-full bg-slate-950 text-white shadow-xl transition lg:static lg:w-64 lg:translate-x-0 lg:shadow-none"><div class="flex h-16 items-center gap-3 border-b border-white/10 px-5"><span class="grid h-10 w-10 place-items-center rounded-xl bg-blue-600 font-bold">採</span><div><h1 class="text-base font-bold">Recruitment</h1><p class="text-xs text-slate-400">Management System</p></div></div><nav class="grid gap-1 p-4">${navigation.map(([id, label]) => `<button class="rounded-xl px-4 py-3 text-left text-sm font-semibold transition ${id === activePage ? "bg-blue-600 text-white" : "text-slate-300 hover:bg-white/10 hover:text-white"}" data-page="${id}">${label}</button>`).join("")}</nav></aside>`;
}

function header(title) {
  return `<header class="sticky top-0 z-30 flex min-h-16 items-center justify-between gap-3 border-b border-slate-200 bg-white/90 px-4 backdrop-blur lg:px-6"><div class="flex min-w-0 items-center gap-3"><button id="menuToggle" class="grid h-10 w-10 place-items-center rounded-xl border border-slate-200 text-slate-600 lg:hidden" aria-label="Open sidebar">☰</button><div class="min-w-0"><p class="text-xs font-semibold uppercase tracking-wide text-blue-600">Recruitment Management System Ver2</p><h2 class="truncate text-xl font-bold text-slate-950">${escapeHtml(title)}</h2></div></div><div class="flex items-center gap-2"><button class="grid h-10 w-10 place-items-center rounded-xl border border-slate-200 text-slate-600" aria-label="Notifications">🔔</button><button class="grid h-10 w-10 place-items-center rounded-xl border border-slate-200 text-slate-600" aria-label="Dark mode toggle">◐</button><button class="grid h-10 w-10 place-items-center rounded-full bg-slate-900 text-sm font-bold text-white" aria-label="Profile">HR</button></div></header>`;
}

function dashboardPage() {
  return `<section class="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">${kpis().map((kpi) => card(`<p class="text-sm font-medium text-slate-500">${escapeHtml(kpi.label)}</p><strong class="mt-3 block text-3xl text-slate-950">${escapeHtml(kpi.value)}</strong><div class="mt-3">${badge("Live", kpi.tone)}</div>`)).join("")}</section><section class="mt-6 grid gap-6 xl:grid-cols-[1fr_380px]">${applicantTable(candidates)}<div class="grid gap-4">${sourcePanel()}${skeleton()}</div></section>`;
}

function applicantTable(rows) {
  if (!rows.length) return emptyState("No applicants", "検索条件に一致する応募者はいません。");
  return table([
    { label: "Applicant", render: (row) => `<strong>${escapeHtml(row.name)}</strong><br><span class="text-slate-500">${escapeHtml(row.email)}</span>` },
    { label: "Job", render: (row) => escapeHtml(jobTitle(row.jobId)) },
    { label: "Source", render: (row) => badge(sourceLabel(row), "primary") },
    { label: "Status", render: (row) => badge(row.status, row.status === "内定" ? "success" : row.status === "不採用" ? "danger" : "default") },
    { label: "", render: () => `<button class="rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-semibold text-blue-700 transition hover:border-blue-200 hover:bg-blue-50" data-edit-button type="button">✎ 編集</button>` }
  ], rows, true);
}

function sourcePanel() {
  return card(`<h3 class="text-base font-semibold text-slate-950">Application Sources</h3><div class="mt-4 grid gap-3">${sourceStats().map((stats) => `<article><div class="flex items-center justify-between gap-3 text-sm"><strong>${escapeHtml(stats.source)}</strong><span class="text-slate-500">${stats.applications} applicants</span></div><div class="mt-2 h-2 rounded-full bg-slate-100"><div class="h-2 rounded-full bg-blue-600" style="width: ${stats.hireRate}%"></div></div><p class="mt-1 text-xs text-slate-500">Hire rate ${stats.hireRate}%</p></article>`).join("")}</div>`);
}

function applicantsPage() {
  const sourceOptions = APPLICATION_SOURCES.map((source) => ({ label: source, value: source }));
  const jobOptions = jobs.map((job) => ({ label: job.title, value: job.id }));
  return `<section class="grid gap-6 xl:grid-cols-[1fr_380px]"><div><div class="mb-4 grid gap-3 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm md:grid-cols-[1fr_220px]">${input("Search", "search", "Name, job, source", "text", filters.query)}${select("Application Source", "source", [{ label: "All", value: "all" }, ...sourceOptions], filters.source)}</div><div id="applicantResults">${applicantTable(filteredCandidates())}</div></div>${card(`<h3 class="text-base font-semibold text-slate-950">Applicant Registration</h3><form class="mt-4 grid gap-4">${input("Name", "name", "山田 太郎")}${input("Email", "email", "example@company.com", "email")}${select("Job", "jobId", jobOptions)}${select("Application Source", "applicationSource", sourceOptions)}${input("Other Source", "applicationSourceOther", "その他を選択した場合のみ使用")}${button("Save Applicant", "primary")}</form>`)}</section>`;
}

function interviewsPage() {
  return table([
    { label: "Applicant", render: (row) => escapeHtml(candidates.find((candidate) => candidate.id === row.candidateId)?.name || "未設定") },
    { label: "Schedule", render: (row) => escapeHtml(formatDateTime(row.scheduledAt)) },
    { label: "Interviewer", render: (row) => escapeHtml(row.interviewer) },
    { label: "Format", render: (row) => badge(row.format, row.format === "オンライン" ? "primary" : "success") }
  ], interviews, false);
}

function storesPage() {
  return `<section class="grid gap-4 md:grid-cols-2 xl:grid-cols-3">${stores.map((store) => card(`<p class="text-sm text-slate-500">${escapeHtml(store.area)}</p><h3 class="mt-2 text-lg font-semibold text-slate-950">${escapeHtml(store.name)}</h3><p class="mt-4 text-sm text-slate-600">Open positions: <strong>${store.openings}</strong></p>`)).join("")}</section>`;
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
  const jobOptions = jobs.map((job) => ({ label: job.title, value: job.id }));
  const showOther = candidate.applicationSource === "その他";
  return `
    <div class="fixed inset-0 z-50 grid place-items-center bg-slate-950/40 p-4" role="dialog" aria-modal="true" aria-labelledby="editCandidateTitle">
      <section class="w-full max-w-2xl rounded-2xl bg-white shadow-xl">
        <div class="flex items-center justify-between gap-4 border-b border-slate-200 p-5">
          <h2 id="editCandidateTitle" class="text-lg font-semibold text-slate-950">応募者を編集</h2>
          <button id="closeEditModal" class="grid h-9 w-9 place-items-center rounded-xl text-slate-500 transition hover:bg-slate-100" type="button" aria-label="閉じる">×</button>
        </div>
        <form id="editCandidateForm" class="grid gap-4 p-5">
          <div class="grid gap-4 sm:grid-cols-2">
            ${input("氏名", "name", "", "text", candidate.name)}
            ${input("メール", "email", "", "email", candidate.email)}
          </div>
          <div class="grid gap-4 sm:grid-cols-2">
            ${select("応募求人", "jobId", jobOptions, candidate.jobId)}
            ${select("ステータス", "status", statusOptions, candidate.status)}
          </div>
          <div class="grid gap-4 sm:grid-cols-2">
            ${select("応募媒体", "applicationSource", sourceOptions, candidate.applicationSource)}
            <div id="otherSourceField" class="${showOther ? "" : "hidden"}">${input("その他媒体名", "applicationSourceOther", "", "text", candidate.applicationSourceOther)}</div>
          </div>
          <div class="flex justify-end gap-3 border-t border-slate-100 pt-4">
            ${button("キャンセル", "secondary", "id=\"cancelEditCandidate\" type=\"button\"")}
            ${button("保存", "primary", "type=\"submit\"")}
          </div>
        </form>
      </section>
    </div>
  `;
}

function openEditModal(candidateId) {
  editingCandidateId = candidateId;
  render();
}

function closeEditModal() {
  editingCandidateId = "";
  render();
}

function updateCandidate(form) {
  const candidate = candidates.find((item) => item.id === editingCandidateId);
  if (!candidate) return;
  const data = new FormData(form);
  const applicationSource = String(data.get("applicationSource"));
  Object.assign(candidate, {
    name: String(data.get("name")).trim(),
    email: String(data.get("email")).trim(),
    jobId: String(data.get("jobId")),
    status: String(data.get("status")),
    applicationSource,
    applicationSourceOther: applicationSource === "その他" ? String(data.get("applicationSourceOther")).trim() : ""
  });
  saveCandidates();
  editingCandidateId = "";
  render();
}

function render() {
  const pages = { dashboard: dashboardPage, applicants: applicantsPage, interviews: interviewsPage, stores: storesPage, analytics: analyticsPage, settings: () => emptyState("Settings", "Future use only.") };
  const titles = { dashboard: "Dashboard", applicants: "Applicants", interviews: "Interviews", stores: "Stores", analytics: "Analytics", settings: "Settings" };
  const page = pages[activePage] ? pages[activePage]() : emptyState("404", "The requested page could not be found.");
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
  bindCandidateRows();
  document.querySelector("#closeEditModal")?.addEventListener("click", closeEditModal);
  document.querySelector("#cancelEditCandidate")?.addEventListener("click", closeEditModal);
  document.querySelector("#editCandidateForm")?.addEventListener("submit", (event) => {
    event.preventDefault();
    updateCandidate(event.currentTarget);
  });
  document.querySelector("#editCandidateForm select[name='applicationSource']")?.addEventListener("change", (event) => {
    document.querySelector("#otherSourceField")?.classList.toggle("hidden", event.currentTarget.value !== "その他");
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
    row.addEventListener("click", () => openEditModal(row.dataset.candidateId));
    row.addEventListener("keydown", (event) => {
      if (event.key === "Enter" || event.key === " ") openEditModal(row.dataset.candidateId);
    });
  });
}

window.addEventListener("error", () => {
  document.querySelector("#app").innerHTML = layout("500", emptyState("500", "Something went wrong. Please try again later."));
});

render();
