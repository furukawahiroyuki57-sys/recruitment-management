export function header(title: string): string {
  return `
    <header class="sticky top-0 z-30 flex min-h-16 items-center justify-between gap-3 border-b border-slate-200 bg-white/90 px-4 backdrop-blur lg:px-6">
      <div class="flex min-w-0 items-center gap-3">
        <button id="menuToggle" class="grid h-10 w-10 place-items-center rounded-xl border border-slate-200 text-slate-600 lg:hidden" aria-label="Open sidebar">☰</button>
        <div class="min-w-0">
          <p class="text-xs font-semibold uppercase tracking-wide text-blue-600">Recruitment Management System Ver2</p>
          <h2 class="truncate text-xl font-bold text-slate-950">${title}</h2>
        </div>
      </div>
      <div class="flex items-center gap-2">
        <button class="grid h-10 w-10 place-items-center rounded-xl border border-slate-200 text-slate-600" aria-label="Notifications">🔔</button>
        <button class="grid h-10 w-10 place-items-center rounded-xl border border-slate-200 text-slate-600" aria-label="Dark mode toggle">◐</button>
        <button class="grid h-10 w-10 place-items-center rounded-full bg-slate-900 text-sm font-bold text-white" aria-label="Profile">HR</button>
      </div>
    </header>
  `;
}
