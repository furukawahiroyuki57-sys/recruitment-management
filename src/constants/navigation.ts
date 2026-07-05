import type { PageId } from "../types/domain";

export interface NavigationItem {
  id: PageId;
  label: string;
}

export const NAVIGATION_ITEMS: NavigationItem[] = [
  { id: "dashboard", label: "Dashboard" },
  { id: "applicants", label: "Applicants" },
  { id: "interviews", label: "Interviews" },
  { id: "stores", label: "Stores" },
  { id: "analytics", label: "Analytics" },
  { id: "settings", label: "Settings" }
];
