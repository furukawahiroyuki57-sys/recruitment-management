import { card } from "../components/Card";
import { getRecruitmentOverview } from "../services/recruitmentService";

export function storesPage(): string {
  const { stores } = getRecruitmentOverview();

  return `
    <section class="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
      ${stores.map((store) => card(`<p class="text-sm text-slate-500">${store.area}</p><h3 class="mt-2 text-lg font-semibold text-slate-950">${store.name}</h3><p class="mt-4 text-sm text-slate-600">Open positions: <strong>${store.openings}</strong></p>`)).join("")}
    </section>
  `;
}
