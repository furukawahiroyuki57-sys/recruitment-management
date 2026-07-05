export function textarea(label: string, name: string, placeholder = ""): string {
  return `
    <label class="grid gap-1.5 text-sm font-medium text-slate-600">
      ${label}
      <textarea name="${name}" placeholder="${placeholder}" rows="4" class="rounded-xl border border-slate-200 bg-white px-3 py-2 text-slate-900 outline-none transition focus:border-blue-600 focus:ring-4 focus:ring-blue-100"></textarea>
    </label>
  `;
}
