export interface TableColumn<T> {
  key: string;
  label: string;
  render: (row: T) => string;
}

export function table<T>(columns: TableColumn<T>[], rows: T[]): string {
  return `
    <div class="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
      <div class="w-full overflow-x-auto">
        <table class="w-full min-w-full table-auto text-left text-sm">
          <thead class="bg-slate-50 text-xs font-semibold uppercase tracking-wide text-slate-500">
            <tr>${columns.map((column) => `<th class="px-4 py-3">${column.label}</th>`).join("")}</tr>
          </thead>
          <tbody class="divide-y divide-slate-100">
            ${rows.map((row) => `<tr class="align-top">${columns.map((column) => `<td class="px-4 py-3">${column.render(row)}</td>`).join("")}</tr>`).join("")}
          </tbody>
        </table>
      </div>
    </div>
  `;
}
