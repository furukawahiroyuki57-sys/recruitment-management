import { emptyState } from "../components/EmptyState";

export function serverErrorPage(): string {
  return emptyState("500", "Something went wrong. Please try again later.");
}
