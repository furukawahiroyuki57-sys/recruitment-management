import { button } from "./Button";

export function modal(title: string, body: string, open = false): string {
  if (!open) return "";
  return `
    <div class="fixed inset-0 z-50 grid place-items-center bg-slate-950/40 p-4">
      <section class="w-full max-w-lg rounded-2xl bg-white p-5 shadow-xl">
        <div class="mb-4 flex items-center justify-between gap-4">
          <h2 class="text-lg font-semibold text-slate-950">${title}</h2>
          ${button("閉じる", "ghost", "data-modal-close")}
        </div>
        ${body}
      </section>
    </div>
  `;
}
