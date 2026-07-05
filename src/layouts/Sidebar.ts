import { NAVIGATION_ITEMS } from "../constants/navigation";
import type { PageId } from "../types/domain";

export function sidebar(activePage: PageId): string {
  return `
    <aside id="sidebar" class="fixed inset-y-0 left-0 z-40 w-72 -translate-x-full bg-slate-950 text-white shadow-xl transition lg:static lg:w-64 lg:translate-x-0 lg:shadow-none">
      <div class="flex h-16 items-center gap-3 border-b border-white/10 px-5">
        <span class="grid h-10 w-10 place-items-center rounded-xl bg-blue-600 font-bold">採</span>
        <div>
          <h1 class="text-base font-bold">Recruitment</h1>
          <p class="text-xs text-slate-400">Management System</p>
        </div>
      </div>
      <nav class="grid gap-1 p-4">
        ${NAVIGATION_ITEMS.map((item) => {
          const active = item.id === activePage ? "bg-blue-600 text-white" : "text-slate-300 hover:bg-white/10 hover:text-white";
          return `<button class="rounded-xl px-4 py-3 text-left text-sm font-semibold transition ${active}" data-page="${item.id}">${item.label}</button>`;
        }).join("")}
      </nav>
    </aside>
  `;
}
