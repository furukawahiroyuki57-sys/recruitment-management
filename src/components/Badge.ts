import { toneClasses } from "../constants/theme";
import type { StatusTone } from "../types/domain";

export function badge(label: string, tone: StatusTone = "default"): string {
  return `<span class="inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold ${toneClasses[tone]}">${label}</span>`;
}
