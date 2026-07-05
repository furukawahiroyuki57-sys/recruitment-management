export function mount(html: string): void {
  const root = document.querySelector<HTMLDivElement>("#app");
  if (root) root.innerHTML = html;
}
