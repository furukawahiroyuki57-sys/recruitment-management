import { APPLICATION_SOURCES } from "../constants/applicationSources";
import type { Candidate, SourceStats } from "../types/domain";

export function getSourceLabel(candidate: Candidate): string {
  return candidate.applicationSource === "その他" && candidate.applicationSourceOther
    ? `その他（${candidate.applicationSourceOther}）`
    : candidate.applicationSource;
}

export function getSourceStats(candidates: Candidate[]): SourceStats[] {
  return APPLICATION_SOURCES.map((source) => {
    const matched = candidates.filter((candidate) => candidate.applicationSource === source);
    const hires = matched.filter((candidate) => candidate.status === "内定").length;
    return {
      source,
      applications: matched.length,
      hires,
      hireRate: matched.length ? Math.round((hires / matched.length) * 100) : 0
    };
  }).filter((stats) => stats.applications > 0);
}
