import { emptyState } from "../components/EmptyState";

export function notFoundPage(): string {
  return emptyState("404", "The requested page could not be found.");
}
