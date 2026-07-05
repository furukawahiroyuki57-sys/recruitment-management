import { badge } from "../components/Badge";
import { table } from "../components/Table";
import { getRecruitmentOverview } from "../services/recruitmentService";
import { formatDateTime } from "../utils/date";
import type { Interview } from "../types/domain";

export function interviewsPage(): string {
  const { candidates, interviews } = getRecruitmentOverview();

  return table<Interview>(
    [
      { key: "candidate", label: "Applicant", render: (row) => candidates.find((candidate) => candidate.id === row.candidateId)?.name ?? "未設定" },
      { key: "scheduledAt", label: "Schedule", render: (row) => formatDateTime(row.scheduledAt) },
      { key: "interviewer", label: "Interviewer", render: (row) => row.interviewer },
      { key: "format", label: "Format", render: (row) => badge(row.format, row.format === "オンライン" ? "primary" : "success") }
    ],
    interviews
  );
}
