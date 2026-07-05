export function emptyState(title: string, message: string): string {
  return `
    <div class="rounded-2xl border border-dashed border-slate-300 bg-white p-8 text-center shadow-sm">
      <h3 class="text-base font-semibold text-slate-950">${title}</h3>
      <p class="mt-2 text-sm text-slate-500">${message}</p>
    </div>
  `;
}
