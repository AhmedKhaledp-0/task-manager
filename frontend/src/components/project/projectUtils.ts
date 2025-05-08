import { ProjectData } from "../../types/Types";
import { FilterOption } from "../UI/SearchFilters";

export const STATUS_OPTIONS: FilterOption[] = [
  { value: "active", label: "Active" },
  { value: "completed", label: "Completed" },
];

export const PRIORITY_OPTIONS: FilterOption[] = [
  { value: "high", label: "High" },
  { value: "moderate", label: "Medium" },
  { value: "low", label: "Low" },
];

export const SORT_OPTIONS: FilterOption[] = [
  { value: "deadline", label: "Deadline" },
  { value: "name", label: "Project Name" },
  { value: "priority", label: "Priority" },
  { value: "status", label: "Status" },
];

export interface FilterState {
  searchTerm: string;
  statusFilter: string | null;
  priorityFilter: string | null;
  sortBy: string;
  sortDirection: "asc" | "desc";
}

export const DEFAULT_FILTERS: FilterState = {
  searchTerm: "",
  statusFilter: null,
  priorityFilter: null,
  sortBy: "deadline",
  sortDirection: "asc",
};

export const areFiltersActive = (filters: FilterState): boolean => {
  return (
    filters.searchTerm !== DEFAULT_FILTERS.searchTerm ||
    filters.statusFilter !== DEFAULT_FILTERS.statusFilter ||
    filters.priorityFilter !== DEFAULT_FILTERS.priorityFilter ||
    filters.sortBy !== DEFAULT_FILTERS.sortBy ||
    filters.sortDirection !== DEFAULT_FILTERS.sortDirection
  );
};

export const filterAndSortProjects = (
  projects: ProjectData[],
  filters: FilterState
): ProjectData[] => {
  let result = [...projects];

  if (filters.searchTerm) {
    const searchTermLower = filters.searchTerm.toLowerCase();
    result = result.filter(
      (project) =>
        project.name.toLowerCase().includes(searchTermLower) ||
        (project.description &&
          project.description.toLowerCase().includes(searchTermLower))
    );
  }

  if (filters.statusFilter) {
    result = result.filter(
      (project) => project.status === filters.statusFilter
    );
  }

  if (filters.priorityFilter) {
    result = result.filter(
      (project) => project.priority === filters.priorityFilter
    );
  }

  result.sort((a, b) => {
    let comparison = 0;

    switch (filters.sortBy) {
      case "name":
        comparison = a.name.localeCompare(b.name);
        break;
      case "deadline":
        comparison =
          new Date(a.deadline).getTime() - new Date(b.deadline).getTime();
        break;
      case "priority": {
        const priorityOrder = { high: 0, moderate: 1, low: 2 };
        comparison =
          priorityOrder[a.priority as keyof typeof priorityOrder] -
          priorityOrder[b.priority as keyof typeof priorityOrder];
        break;
      }
      case "status":
        comparison = a.status.localeCompare(b.status);
        break;
      default:
        comparison = 0;
    }

    return filters.sortDirection === "asc" ? comparison : -comparison;
  });

  return result;
};