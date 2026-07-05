import { header } from "./Header";
import { sidebar } from "./Sidebar";
import type { PageId } from "../types/domain";

export function appLayout(activePage: PageId, title: string, content: string): string {
  return `
    <div class="min-h-screen bg-slate-50 lg:grid lg:grid-cols-[256px_1fr]">
      ${sidebar(activePage)}
      <div id="sidebarOverlay" class="fixed inset-0 z-30 hidden bg-slate-950/40 lg:hidden"></div>
      <div class="min-w-0">
        ${header(title)}
        <main class="p-4 lg:p-6">${content}</main>
      </div>
    </div>
  `;
}
