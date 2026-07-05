export interface SelectOption {
  label: string;
  value: string;
}

export function select(label: string, name: string, options: SelectOption[]): string {
  return `
    <label class="grid gap-1.5 text-sm font-medium text-slate-600">
      ${label}
      <select name="${name}" class="min-h-10 rounded-xl border border-slate-200 bg-white px-3 text-slate-900 outline-none transition focus:border-blue-600 focus:ring-4 focus:ring-blue-100">
        ${options.map((option) => `<option value="${option.value}">${option.label}</option>`).join("")}
      </select>
    </label>
  `;
}
