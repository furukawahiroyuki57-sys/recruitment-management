export function card(content: string, className = ""): string {
  return `<section class="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm ${className}">${content}</section>`;
}
