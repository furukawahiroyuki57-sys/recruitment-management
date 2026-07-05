import { candidates, interviews, jobs, kpis, stores } from "../constants/mockData";

export function getRecruitmentOverview() {
  return {
    candidates,
    interviews,
    jobs,
    kpis,
    stores
  };
}
