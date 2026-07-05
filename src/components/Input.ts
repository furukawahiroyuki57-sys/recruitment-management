export function input(label: string, name: string, placeholder = "", type = "text"): string {
  return `
    <label class="grid gap-1.5 text-sm font-medium text-slate-600">
      ${label}
      <input name="${name}" type="${type}" placeholder="${placeholder}" class="min-h-10 rounded-xl border border-slate-200 bg-white px-3 text-slate-900 outline-none transition focus:border-blue-600 focus:ring-4 focus:ring-blue-100" />
    </label>
  `;
}
