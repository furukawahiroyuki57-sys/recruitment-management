const APPLICATION_SOURCES = ["Airワーク", "Indeed", "グルメキャリー", "バイトル", "飲食店ドットコム", "求人ボックス", "エンゲージ", "タウンワーク", "リファラル（紹介）", "店舗看板", "Instagram", "TikTok", "X", "ホームページ", "その他"];
const navigation = [["dashboard", "Dashboard"], ["applicants", "Applicants"], ["interviews", "Interviews"], ["stores", "Stores"], ["analytics", "Analytics"], ["settings", "Settings"]];
const jobs = [
  { id: "j1", title: "フロントエンドエンジニア", location: "東京 / リモート", type: "正社員", status: "公開中" },
  { id: "j2", title: "カスタマーサクセス", location: "大阪", type: "正社員", status: "公開中" },
  { id: "j3", title: "採用アシスタント", location: "東京", type: "契約社員", status: "停止中" }
];
const candidates = [
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
const kpis = [
  { label: "Today's Applicants", value: "2", tone: "primary" },
  { label: "Pending", value: "3", tone: "warning" },
  { label: "Today's Interviews", value: "2", tone: "success" },
  { label: "Monthly Hires", value: "4", tone: "danger" }
];
let activePage = "dashboard";

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
  return `<span class="inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold ${toneClass(tone)}">${label}</span>`;
}

function card(content) {
  return `<section class="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">${content}</section>`;
}

function button(label, variant = "primary") {
  const classes = {
    primary: "bg-blue-600 text-white hover:bg-blue-700",
    secondary: "bg-white text-slate-700 ring-1 ring-slate-200 hover:bg-slate-50"
  };
  return `<button class="inline-flex min-h-10 items-center justify-center rounded-xl px-4 text-sm font-semibold shadow-sm transition ${classes[variant]}">${label}</button>`;
}

function input(label, name, placeholder = "", type = "text") {
  return `<label class="grid gap-1.5 text-sm font-medium text-slate-600">${label}<input name="${name}" type="${type}" placeholder="${placeholder}" class="min-h-10 rounded-xl border border-slate-200 bg-white px-3 text-slate-900 outline-none transition focus:border-blue-600 focus:ring-4 focus:ring-blue-100" /></label>`;
}

function select(label, name, options) {
  return `<label class="grid gap-1.5 text-sm font-medium text-slate-600">${label}<select name="${name}" class="min-h-10 rounded-xl border border-slate-200 bg-white px-3 text-slate-900 outline-none transition focus:border-blue-600 focus:ring-4 focus:ring-blue-100">${options.map((option) => `<option value="${option.value}">${option.label}</option>`).join("")}</select></label>`;
}

function table(columns, rows) {
  return `<div class="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm"><div class="w-full overflow-x-auto"><table class="w-full min-w-full table-auto text-left text-sm"><thead class="bg-slate-50 text-xs font-semibold uppercase tracking-wide text-slate-500"><tr>${columns.map((column) => `<th class="px-4 py-3">${column.label}</th>`).join("")}</tr></thead><tbody class="divide-y divide-slate-100">${rows.map((row) => `<tr class="align-top">${columns.map((column) => `<td class="px-4 py-3">${column.render(row)}</td>`).join("")}</tr>`).join("")}</tbody></table></div></div>`;
}

function emptyState(title, message) {
  return `<div class="rounded-2xl border border-dashed border-slate-300 bg-white p-8 text-center shadow-sm"><h3 class="text-base font-semibold text-slate-950">${title}</h3><p class="mt-2 text-sm text-slate-500">${message}</p></div>`;
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

function layout(title, content) {
  return `<div class="min-h-screen bg-slate-50 lg:grid lg:grid-cols-[256px_1fr]">${sidebar()}<div id="sidebarOverlay" class="fixed inset-0 z-30 hidden bg-slate-950/40 lg:hidden"></div><div class="min-w-0">${header(title)}<main class="p-4 lg:p-6">${content}</main></div></div>`;
}

function sidebar() {
  return `<aside id="sidebar" class="fixed inset-y-0 left-0 z-40 w-72 -translate-x-full bg-slate-950 text-white shadow-xl transition lg:static lg:w-64 lg:translate-x-0 lg:shadow-none"><div class="flex h-16 items-center gap-3 border-b border-white/10 px-5"><span class="grid h-10 w-10 place-items-center rounded-xl bg-blue-600 font-bold">採</span><div><h1 class="text-base font-bold">Recruitment</h1><p class="text-xs text-slate-400">Management System</p></div></div><nav class="grid gap-1 p-4">${navigation.map(([id, label]) => `<button class="rounded-xl px-4 py-3 text-left text-sm font-semibold transition ${id === activePage ? "bg-blue-600 text-white" : "text-slate-300 hover:bg-white/10 hover:text-white"}" data-page="${id}">${label}</button>`).join("")}</nav></aside>`;
}

function header(title) {
  return `<header class="sticky top-0 z-30 flex min-h-16 items-center justify-between gap-3 border-b border-slate-200 bg-white/90 px-4 backdrop-blur lg:px-6"><div class="flex min-w-0 items-center gap-3"><button id="menuToggle" class="grid h-10 w-10 place-items-center rounded-xl border border-slate-200 text-slate-600 lg:hidden" aria-label="Open sidebar">☰</button><div class="min-w-0"><p class="text-xs font-semibold uppercase tracking-wide text-blue-600">Recruitment Management System Ver2</p><h2 class="truncate text-xl font-bold text-slate-950">${title}</h2></div></div><div class="flex items-center gap-2"><button class="grid h-10 w-10 place-items-center rounded-xl border border-slate-200 text-slate-600" aria-label="Notifications">🔔</button><button class="grid h-10 w-10 place-items-center rounded-xl border border-slate-200 text-slate-600" aria-label="Dark mode toggle">◐</button><button class="grid h-10 w-10 place-items-center rounded-full bg-slate-900 text-sm font-bold text-white" aria-label="Profile">HR</button></div></header>`;
}

function dashboardPage() {
  return `<section class="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">${kpis.map((kpi) => card(`<p class="text-sm font-medium text-slate-500">${kpi.label}</p><strong class="mt-3 block text-3xl text-slate-950">${kpi.value}</strong><div class="mt-3">${badge("Placeholder", kpi.tone)}</div>`)).join("")}</section><section class="mt-6 grid gap-6 xl:grid-cols-[1fr_380px]">${applicantTable()}<div class="grid gap-4">${sourcePanel()}${skeleton()}</div></section>`;
}

function applicantTable() {
  return table([
    { label: "Applicant", render: (row) => `<strong>${row.name}</strong><br><span class="text-slate-500">${row.email}</span>` },
    { label: "Job", render: (row) => jobTitle(row.jobId) },
    { label: "Source", render: (row) => badge(sourceLabel(row), "primary") },
    { label: "Status", render: (row) => badge(row.status, row.status === "内定" ? "success" : "default") }
  ], candidates);
}

function sourcePanel() {
  return card(`<h3 class="text-base font-semibold text-slate-950">Application Sources</h3><div class="mt-4 grid gap-3">${sourceStats().map((stats) => `<article><div class="flex items-center justify-between gap-3 text-sm"><strong>${stats.source}</strong><span class="text-slate-500">${stats.applications} applicants</span></div><div class="mt-2 h-2 rounded-full bg-slate-100"><div class="h-2 rounded-full bg-blue-600" style="width: ${stats.hireRate}%"></div></div><p class="mt-1 text-xs text-slate-500">Hire rate ${stats.hireRate}%</p></article>`).join("")}</div>`);
}

function applicantsPage() {
  const sourceOptions = APPLICATION_SOURCES.map((source) => ({ label: source, value: source }));
  const jobOptions = jobs.map((job) => ({ label: job.title, value: job.id }));
  return `<section class="grid gap-6 xl:grid-cols-[1fr_380px]"><div><div class="mb-4 grid gap-3 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm md:grid-cols-[1fr_220px]">${input("Search", "search", "Name, job, source")}${select("Application Source", "source", [{ label: "All", value: "all" }, ...sourceOptions])}</div>${applicantTable()}</div>${card(`<h3 class="text-base font-semibold text-slate-950">Applicant Registration</h3><form class="mt-4 grid gap-4">${input("Name", "name", "山田 太郎")}${input("Email", "email", "example@company.com", "email")}${select("Job", "jobId", jobOptions)}${select("Application Source", "applicationSource", sourceOptions)}${input("Other Source", "applicationSourceOther", "その他を選択した場合のみ使用")}${button("Save Applicant", "primary")}</form>`)}</section>`;
}

function interviewsPage() {
  return table([
    { label: "Applicant", render: (row) => candidates.find((candidate) => candidate.id === row.candidateId)?.name || "未設定" },
    { label: "Schedule", render: (row) => formatDateTime(row.scheduledAt) },
    { label: "Interviewer", render: (row) => row.interviewer },
    { label: "Format", render: (row) => badge(row.format, row.format === "オンライン" ? "primary" : "success") }
  ], interviews);
}

function storesPage() {
  return `<section class="grid gap-4 md:grid-cols-2 xl:grid-cols-3">${stores.map((store) => card(`<p class="text-sm text-slate-500">${store.area}</p><h3 class="mt-2 text-lg font-semibold text-slate-950">${store.name}</h3><p class="mt-4 text-sm text-slate-600">Open positions: <strong>${store.openings}</strong></p>`)).join("")}</section>`;
}

function analyticsPage() {
  return sourcePanel();
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
}

window.addEventListener("error", () => {
  document.querySelector("#app").innerHTML = layout("500", emptyState("500", "Something went wrong. Please try again later."));
});

render();
