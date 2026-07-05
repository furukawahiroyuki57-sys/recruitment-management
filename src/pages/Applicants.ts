import { badge } from "../components/Badge";
import { button } from "../components/Button";
import { card } from "../components/Card";
import { input } from "../components/Input";
import { select } from "../components/Select";
import { table } from "../components/Table";
import { textarea } from "../components/Textarea";
import { APPLICATION_SOURCES } from "../constants/applicationSources";
import { getRecruitmentOverview } from "../services/recruitmentService";
import { getSourceLabel } from "../utils/sourceStats";
import type { Candidate, Job } from "../types/domain";

function jobTitle(jobs: Job[], jobId: string): string {
  return jobs.find((job) => job.id === jobId)?.title ?? "未設定";
}

export function applicantsPage(): string {
  const { candidates, jobs } = getRecruitmentOverview();
  const sourceOptions = APPLICATION_SOURCES.map((source) => ({ label: source, value: source }));
  const jobOptions = jobs.map((job) => ({ label: job.title, value: job.id }));

  return `
    <section class="grid gap-6 xl:grid-cols-[1fr_380px]">
      <div>
        <div class="mb-4 grid gap-3 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm md:grid-cols-[1fr_220px]">
          ${input("Search", "search", "Name, job, source")}
          ${select("Application Source", "source", [{ label: "All", value: "all" }, ...sourceOptions])}
        </div>
        ${table<Candidate>(
          [
            { key: "name", label: "Applicant", render: (row) => `<strong>${row.name}</strong><br><span class="text-slate-500">${row.email}</span>` },
            { key: "job", label: "Job", render: (row) => jobTitle(jobs, row.jobId) },
            { key: "source", label: "Source", render: (row) => badge(getSourceLabel(row), "primary") },
            { key: "status", label: "Status", render: (row) => badge(row.status, row.status === "内定" ? "success" : "warning") },
            { key: "resume", label: "Resume", render: (row) => row.resumeName }
          ],
          candidates
        )}
      </div>
      ${card(`
        <h3 class="text-base font-semibold text-slate-950">Applicant Registration</h3>
        <form class="mt-4 grid gap-4">
          ${input("Name", "name", "山田 太郎")}
          ${input("Email", "email", "example@company.com", "email")}
          ${select("Job", "jobId", jobOptions)}
          ${select("Application Source", "applicationSource", sourceOptions)}
          ${input("Other Source", "applicationSourceOther", "その他を選択した場合のみ使用")}
          ${textarea("Memo", "memo", "Notes for screening")}
          ${button("Save Applicant", "primary")}
        </form>
      `)}
    </section>
  `;
}
