import { card } from "../components/Card";
import { getRecruitmentOverview } from "../services/recruitmentService";
import { getSourceStats } from "../utils/sourceStats";

export function analyticsPage(): string {
  const { candidates } = getRecruitmentOverview();
  const stats = getSourceStats(candidates);

  return card(`
    <h3 class="text-base font-semibold text-slate-950">Source Performance</h3>
    <div class="mt-4 grid gap-4">
      ${stats.map((item) => `<div><div class="flex items-center justify-between text-sm"><strong>${item.source}</strong><span>${item.hires}/${item.applications} hires</span></div><div class="mt-2 h-2 rounded-full bg-slate-100"><div class="h-2 rounded-full bg-green-500" style="width: ${item.hireRate}%"></div></div></div>`).join("")}
    </div>
  `);
}
