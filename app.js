const STORAGE_KEY = "recruitment-management-state-v1";
const MS_PER_DAY = 24 * 60 * 60 * 1000;

const defaultState = {
  policyDays: 365,
  selectedCandidateId: "c1",
  jobs: [
    { id: "j1", title: "フロントエンドエンジニア", location: "東京 / リモート", type: "正社員", status: "公開中" },
    { id: "j2", title: "カスタマーサクセス", location: "大阪", type: "正社員", status: "公開中" },
    { id: "j3", title: "採用アシスタント", location: "東京", type: "契約社員", status: "停止中" }
  ],
  candidates: [
    {
      id: "c1",
      name: "佐藤 花子",
      email: "hanako.sato@example.com",
      jobId: "j1",
      status: "面接確定",
      appliedAt: "2026-06-22",
      interviewAt: "2026-07-08T10:00",
      interviewer: "山田",
      resumeName: "sato_hanako_resume.pdf",
      notes: "一次面接。React経験を確認。"
    },
    {
      id: "c2",
      name: "田中 誠",
      email: "makoto.tanaka@example.com",
      jobId: "j2",
      status: "面接調整中",
      appliedAt: "2026-07-01",
      interviewAt: "",
      interviewer: "鈴木",
      resumeName: "tanaka_cv.docx",
      notes: "候補日を送付済み。"
    },
    {
      id: "c3",
      name: "鈴木 彩",
      email: "aya.suzuki@example.com",
      jobId: "j3",
      status: "不採用",
      appliedAt: "2025-05-20",
      interviewAt: "2025-06-03T14:00",
      interviewer: "中村",
      resumeName: "suzuki_aya.pdf",
      notes: "保管期限経過。"
    }
  ],
  auditLog: []
};

let state = loadState();
let activeView = "dashboard";

const els = {
  navItems: document.querySelectorAll(".nav-item"),
  viewTitle: document.querySelector("#viewTitle"),
  searchInput: document.querySelector("#searchInput"),
  statusFilter: document.querySelector("#statusFilter"),
  candidateRows: document.querySelector("#candidateRows"),
  candidateForm: document.querySelector("#candidateForm"),
  jobSelect: document.querySelector("#jobSelect"),
  resumeName: document.querySelector("#resumeName"),
  jobsList: document.querySelector("#jobsList"),
  upcomingList: document.querySelector("#upcomingList"),
  scheduleBoard: document.querySelector("#scheduleBoard"),
  retentionList: document.querySelector("#retentionList"),
  auditLog: document.querySelector("#auditLog"),
  jobDialog: document.querySelector("#jobDialog"),
  jobForm: document.querySelector("#jobForm")
};

function loadState() {
  const stored = localStorage.getItem(STORAGE_KEY);
  return stored ? JSON.parse(stored) : structuredClone(defaultState);
}

function saveState() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

function today() {
  const now = new Date();
  return new Date(now.getFullYear(), now.getMonth(), now.getDate());
}

function addDays(dateString, days) {
  return new Date(new Date(dateString).getTime() + days * MS_PER_DAY);
}

function dateValue(value) {
  return value ? new Date(value) : null;
}

function formatDate(value) {
  if (!value) return "未設定";
  return new Intl.DateTimeFormat("ja-JP", { dateStyle: "medium" }).format(new Date(value));
}

function formatDateTime(value) {
  if (!value) return "未設定";
  return new Intl.DateTimeFormat("ja-JP", { dateStyle: "medium", timeStyle: "short" }).format(new Date(value));
}

function getJob(jobId) {
  return state.jobs.find((job) => job.id === jobId) || { title: "未設定", location: "", type: "" };
}

function retention(candidate) {
  const due = addDays(candidate.appliedAt, state.policyDays);
  const daysLeft = Math.ceil((due - today()) / MS_PER_DAY);
  return { due, daysLeft, expired: daysLeft < 0 };
}

function filteredCandidates() {
  const query = els.searchInput.value.trim().toLowerCase();
  const status = els.statusFilter?.value || "all";
  return state.candidates.filter((candidate) => {
    const job = getJob(candidate.jobId);
    const haystack = `${candidate.name} ${candidate.email} ${candidate.status} ${job.title}`.toLowerCase();
    return (status === "all" || candidate.status === status) && (!query || haystack.includes(query));
  });
}

function switchView(view) {
  activeView = view;
  document.querySelectorAll(".view").forEach((node) => node.classList.remove("active"));
  document.querySelector(`#${view}View`).classList.add("active");
  els.navItems.forEach((item) => item.classList.toggle("active", item.dataset.view === view));
  els.viewTitle.textContent = { dashboard: "概要", candidates: "応募者", schedule: "日程", privacy: "個人情報" }[view];
}

function render() {
  saveState();
  renderMetrics();
  renderJobs();
  renderJobSelect();
  renderCandidates();
  renderSelectedCandidate();
  renderSchedule();
  renderRetention();
  renderAuditLog();
  document.querySelector("#policyDays").textContent = `${state.policyDays}日`;
}

function renderMetrics() {
  const upcoming = state.candidates.filter((candidate) => {
    const interview = dateValue(candidate.interviewAt);
    if (!interview) return false;
    const diff = (interview - today()) / MS_PER_DAY;
    return diff >= 0 && diff <= 7;
  });
  document.querySelector("#metricCandidates").textContent = state.candidates.length;
  document.querySelector("#metricScheduling").textContent = state.candidates.filter((c) => c.status === "面接調整中").length;
  document.querySelector("#metricUpcoming").textContent = upcoming.length;
  document.querySelector("#metricExpired").textContent = state.candidates.filter((c) => retention(c).expired).length;
}

function renderJobs() {
  els.jobsList.innerHTML = "";
  state.jobs.forEach((job) => {
    const count = state.candidates.filter((candidate) => candidate.jobId === job.id).length;
    const item = document.createElement("article");
    item.className = "job-item";
    item.innerHTML = `
      <div>
        <strong>${job.title}</strong>
        <span>${job.location} / ${job.type}</span>
      </div>
      <span class="tag">${job.status}・${count}名</span>
    `;
    els.jobsList.appendChild(item);
  });
}

function renderJobSelect() {
  els.jobSelect.innerHTML = state.jobs.map((job) => `<option value="${job.id}">${job.title}</option>`).join("");
}

function renderCandidates() {
  const candidates = filteredCandidates();
  els.candidateRows.innerHTML = "";
  candidates.forEach((candidate) => {
    const due = retention(candidate);
    const row = document.createElement("tr");
    row.className = candidate.id === state.selectedCandidateId ? "selected" : "";
    row.dataset.id = candidate.id;
    row.innerHTML = `
      <td><strong>${candidate.name}</strong><br><span>${candidate.email}</span></td>
      <td>${getJob(candidate.jobId).title}</td>
      <td><span class="tag">${candidate.status}</span></td>
      <td>${formatDateTime(candidate.interviewAt)}</td>
      <td><span class="tag ${due.expired ? "danger" : due.daysLeft < 30 ? "warn" : ""}">${formatDate(due.due)}</span></td>
    `;
    els.candidateRows.appendChild(row);
  });
  if (!candidates.length) {
    els.candidateRows.innerHTML = `<tr><td colspan="5" class="empty">該当する応募者がありません</td></tr>`;
  }
}

function renderSelectedCandidate() {
  const candidate = state.candidates.find((item) => item.id === state.selectedCandidateId) || state.candidates[0];
  if (!candidate) {
    els.candidateForm.reset();
    return;
  }
  state.selectedCandidateId = candidate.id;
  Object.entries(candidate).forEach(([key, value]) => {
    if (els.candidateForm.elements[key] && key !== "resumeFile") {
      els.candidateForm.elements[key].value = value;
    }
  });
  els.resumeName.textContent = candidate.resumeName || "未登録";
}

function renderSchedule() {
  const scheduled = state.candidates
    .filter((candidate) => candidate.interviewAt)
    .sort((a, b) => new Date(a.interviewAt) - new Date(b.interviewAt));
  const upcoming = scheduled.filter((candidate) => new Date(candidate.interviewAt) >= today()).slice(0, 5);
  els.upcomingList.innerHTML = upcoming.length ? "" : `<div class="empty">予定はありません</div>`;
  upcoming.forEach((candidate) => els.upcomingList.appendChild(scheduleCard(candidate, "timeline-item")));
  els.scheduleBoard.innerHTML = scheduled.length ? "" : `<div class="empty">面接日時が設定されていません</div>`;
  scheduled.forEach((candidate) => els.scheduleBoard.appendChild(scheduleCard(candidate, "schedule-card")));
}

function scheduleCard(candidate, className) {
  const card = document.createElement("article");
  card.className = className;
  card.innerHTML = `
    <strong>${candidate.name}</strong>
    <time>${formatDateTime(candidate.interviewAt)}</time>
    <div class="calendar-row">
      <span>${getJob(candidate.jobId).title}</span>
      <span class="tag">${candidate.interviewer || "担当未定"}</span>
    </div>
  `;
  return card;
}

function renderRetention() {
  const sorted = [...state.candidates].sort((a, b) => retention(a).daysLeft - retention(b).daysLeft);
  els.retentionList.innerHTML = "";
  sorted.forEach((candidate) => {
    const due = retention(candidate);
    const item = document.createElement("article");
    item.className = "retention-item";
    const label = due.expired ? "期限切れ" : `残り${due.daysLeft}日`;
    item.innerHTML = `
      <strong>${candidate.name}</strong>
      <span>${candidate.resumeName || "履歴書未登録"}</span>
      <div class="calendar-row">
        <span>期限 ${formatDate(due.due)}</span>
        <span class="tag ${due.expired ? "danger" : due.daysLeft < 30 ? "warn" : ""}">${label}</span>
      </div>
    `;
    els.retentionList.appendChild(item);
  });
}

function renderAuditLog() {
  els.auditLog.innerHTML = state.auditLog.length ? "" : `<div class="empty">ログはありません</div>`;
  state.auditLog.forEach((log) => {
    const item = document.createElement("article");
    item.className = "log-item";
    item.innerHTML = `<strong>${log.name}</strong><span>${formatDateTime(log.at)} / ${log.action}</span>`;
    els.auditLog.appendChild(item);
  });
}

function upsertCandidate(event) {
  event.preventDefault();
  const form = new FormData(els.candidateForm);
  const current = state.candidates.find((item) => item.id === state.selectedCandidateId);
  const file = els.candidateForm.elements.resumeFile.files[0];
  const values = {
    id: current?.id || crypto.randomUUID(),
    name: form.get("name").trim(),
    email: form.get("email").trim(),
    jobId: form.get("jobId"),
    status: form.get("status"),
    appliedAt: form.get("appliedAt"),
    interviewAt: form.get("interviewAt"),
    interviewer: form.get("interviewer").trim(),
    resumeName: file?.name || current?.resumeName || "",
    notes: form.get("notes").trim()
  };
  if (current) {
    Object.assign(current, values);
  } else {
    state.candidates.push(values);
    state.selectedCandidateId = values.id;
  }
  els.candidateForm.elements.resumeFile.value = "";
  render();
}

function newCandidate() {
  const id = crypto.randomUUID();
  state.candidates.push({
    id,
    name: "新規 応募者",
    email: "",
    jobId: state.jobs[0]?.id || "",
    status: "応募受付",
    appliedAt: new Date().toISOString().slice(0, 10),
    interviewAt: "",
    interviewer: "",
    resumeName: "",
    notes: ""
  });
  state.selectedCandidateId = id;
  switchView("candidates");
  render();
}

function purgeCandidate(candidate) {
  state.auditLog.unshift({
    at: new Date().toISOString(),
    name: candidate.name,
    action: "個人情報・履歴書を破棄"
  });
  state.candidates = state.candidates.filter((item) => item.id !== candidate.id);
  state.selectedCandidateId = state.candidates[0]?.id || "";
}

function exportCalendar() {
  const lines = ["BEGIN:VCALENDAR", "VERSION:2.0", "PRODID:-//Recruitment Management//JP"];
  state.candidates.filter((candidate) => candidate.interviewAt).forEach((candidate) => {
    const start = new Date(candidate.interviewAt);
    const end = new Date(start.getTime() + 60 * 60 * 1000);
    const stamp = (date) => date.toISOString().replace(/[-:]/g, "").split(".")[0] + "Z";
    lines.push(
      "BEGIN:VEVENT",
      `UID:${candidate.id}@recruitment-management.local`,
      `DTSTAMP:${stamp(new Date())}`,
      `DTSTART:${stamp(start)}`,
      `DTEND:${stamp(end)}`,
      `SUMMARY:面接 ${candidate.name}`,
      `DESCRIPTION:${getJob(candidate.jobId).title} / 担当 ${candidate.interviewer || "未定"}`,
      "END:VEVENT"
    );
  });
  lines.push("END:VCALENDAR");
  const blob = new Blob([lines.join("\r\n")], { type: "text/calendar;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = "interviews.ics";
  link.click();
  URL.revokeObjectURL(url);
}

els.navItems.forEach((item) => item.addEventListener("click", () => switchView(item.dataset.view)));
document.querySelectorAll("[data-view-link]").forEach((button) => {
  button.addEventListener("click", () => switchView(button.dataset.viewLink));
});
els.searchInput.addEventListener("input", render);
els.statusFilter.addEventListener("change", render);
els.candidateRows.addEventListener("click", (event) => {
  const row = event.target.closest("tr[data-id]");
  if (!row) return;
  state.selectedCandidateId = row.dataset.id;
  render();
});
els.candidateForm.addEventListener("submit", upsertCandidate);
document.querySelector("#newCandidateBtn").addEventListener("click", newCandidate);
document.querySelector("#deleteCandidateBtn").addEventListener("click", () => {
  const candidate = state.candidates.find((item) => item.id === state.selectedCandidateId);
  if (candidate) purgeCandidate(candidate);
  render();
});
document.querySelector("#purgeExpiredBtn").addEventListener("click", () => {
  state.candidates.filter((candidate) => retention(candidate).expired).forEach(purgeCandidate);
  render();
});
document.querySelector("#clearLogBtn").addEventListener("click", () => {
  state.auditLog = [];
  render();
});
document.querySelector("#addJobBtn").addEventListener("click", () => els.jobDialog.showModal());
els.jobForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const form = new FormData(els.jobForm);
  state.jobs.push({
    id: crypto.randomUUID(),
    title: form.get("title").trim(),
    location: form.get("location").trim(),
    type: form.get("type"),
    status: "公開中"
  });
  els.jobForm.reset();
  els.jobDialog.close();
  render();
});
document.querySelector("#exportCalendarBtn").addEventListener("click", exportCalendar);

render();
