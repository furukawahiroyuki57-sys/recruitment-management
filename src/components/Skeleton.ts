export function skeleton(lines = 3): string {
  return `
    <div class="animate-pulse space-y-3 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      ${Array.from({ length: lines }, (_, index) => `<div class="h-4 rounded bg-slate-200 ${index === lines - 1 ? "w-2/3" : "w-full"}"></div>`).join("")}
    </div>
  `;
}
