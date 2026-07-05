import { appLayout } from "./layouts/AppLayout";
import { analyticsPage } from "./pages/Analytics";
import { applicantsPage } from "./pages/Applicants";
import { dashboardPage } from "./pages/Dashboard";
import { interviewsPage } from "./pages/Interviews";
import { notFoundPage } from "./pages/NotFound";
import { serverErrorPage } from "./pages/ServerError";
import { settingsPage } from "./pages/Settings";
import { storesPage } from "./pages/Stores";
import { mount } from "./lib/render";
import type { PageId } from "./types/domain";

const pageTitles: Record<PageId, string> = {
  dashboard: "Dashboard",
  applicants: "Applicants",
  interviews: "Interviews",
  stores: "Stores",
  analytics: "Analytics",
  settings: "Settings"
};

const pages: Record<PageId, () => string> = {
  dashboard: dashboardPage,
  applicants: applicantsPage,
  interviews: interviewsPage,
  stores: storesPage,
  analytics: analyticsPage,
  settings: settingsPage
};

let activePage: PageId = "dashboard";

function render(): void {
  const content = pages[activePage]?.() ?? notFoundPage();
  mount(appLayout(activePage, pageTitles[activePage] ?? "404", content));
  bindEvents();
}

function bindEvents(): void {
  document.querySelectorAll<HTMLButtonElement>("[data-page]").forEach((button) => {
    button.addEventListener("click", () => {
      const nextPage = button.dataset.page as PageId;
      activePage = pages[nextPage] ? nextPage : "dashboard";
      render();
    });
  });
  document.querySelector("#menuToggle")?.addEventListener("click", () => {
    document.querySelector("#sidebar")?.classList.remove("-translate-x-full");
    document.querySelector("#sidebarOverlay")?.classList.remove("hidden");
  });
  document.querySelector("#sidebarOverlay")?.addEventListener("click", closeSidebar);
}

function closeSidebar(): void {
  document.querySelector("#sidebar")?.classList.add("-translate-x-full");
  document.querySelector("#sidebarOverlay")?.classList.add("hidden");
}

window.addEventListener("error", () => {
  mount(appLayout("dashboard", "500", serverErrorPage()));
});

render();
