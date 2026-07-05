import { card } from "../components/Card";
import { badge } from "../components/Badge";
import { table } from "../components/Table";
import { getRecruitmentOverview } from "../services/recruitmentService";
import { getSourceLabel, getSourceStats } from "../utils/sourceStats";
import type { Candidate, Job } from "../types/domain";

function jobTitle(jobs: Job[], jobId: string): string {
  return jobs.find((job) => job.id === jobId)?.title ?? "未設定";
}

export function dashboardPage(): string {
  const { candidates, jobs, kpis } = getRecruitmentOverview();
  const sourceStats = getSourceStats(candidates);

  return `
    <section class="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      ${kpis.map((kpi) => card(`<p class="text-sm font-medium text-slate-500">${kpi.label}</p><strong class="mt-3 block text-3xl text-slate-950">${kpi.value}</strong><div class="mt-3">${badge("Placeholder", kpi.tone)}</div>`)).join("")}
    </section>

    <section class="mt-6 grid gap-6 xl:grid-cols-[1fr_380px]">
      ${table<Candidate>(
        [
          { key: "name", label: "Applicant", render: (row) => `<strong>${row.name}</strong><br><span class="text-slate-500">${row.email}</span>` },
          { key: "job", label: "Job", render: (row) => jobTitle(jobs, row.jobId) },
          { key: "source", label: "Source", render: (row) => badge(getSourceLabel(row), "primary") },
          { key: "status", label: "Status", render: (row) => badge(row.status, row.status === "内定" ? "success" : "default") }
        ],
        candidates
      )}

      <div class="grid gap-4">
        ${card(`
          <h3 class="text-base font-semibold text-slate-950">Application Sources</h3>
          <div class="mt-4 grid gap-3">
            ${sourceStats.map((stats) => `
              <article>
                <div class="flex items-center justify-between gap-3 text-sm">
                  <strong>${stats.source}</strong>
                  <span class="text-slate-500">${stats.applications} applicants</span>
                </div>
                <div class="mt-2 h-2 rounded-full bg-slate-100">
                  <div class="h-2 rounded-full bg-blue-600" style="width: ${stats.hireRate}%"></div>
                </div>
                <p class="mt-1 text-xs text-slate-500">Hire rate ${stats.hireRate}%</p>
              </article>
            `).join("")}
          </div>
        `)}
      </div>
    </section>
  `;
}
