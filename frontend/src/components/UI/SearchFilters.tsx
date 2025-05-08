import { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faFilter,
  faSearch,
  faSortAmountDown,
  faSortAmountUp,
  faXmark,
} from "@fortawesome/free-solid-svg-icons";
import Button from "./Button";

export type FilterOption = {
  value: string;
  label: string;
};

interface SearchFiltersProps {
  onSearch: (search: string) => void;
  onFilterChange: (filterType: string, value: string | null) => void;
  onSortChange: (sort: string, direction: "asc" | "desc") => void;
  statusOptions: FilterOption[];
  priorityOptions: FilterOption[];
  sortOptions: FilterOption[];
  showClearFilters?: boolean;
  onClearFilters?: () => void;
}

const SearchFilters = ({
  onSearch,
  onFilterChange,
  onSortChange,
  statusOptions,
  priorityOptions,
  sortOptions,
  showClearFilters = false,
  onClearFilters,
}: SearchFiltersProps) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState<string | null>(null);
  const [selectedPriority, setSelectedPriority] = useState<string | null>(null);
  const [selectedSort, setSelectedSort] = useState<string>("deadline");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");

  useEffect(() => {
    // Debounce search input to avoid excessive API calls
    const handler = setTimeout(() => {
      onSearch(searchTerm);
    }, 300);

    return () => {
      clearTimeout(handler);
    };
  }, [searchTerm, onSearch]);

  const handleStatusChange = (value: string) => {
    const newStatus = selectedStatus === value ? null : value;
    setSelectedStatus(newStatus);
    onFilterChange("status", newStatus);
  };

  const handlePriorityChange = (value: string) => {
    const newPriority = selectedPriority === value ? null : value;
    setSelectedPriority(newPriority);
    onFilterChange("priority", newPriority);
  };

  const handleSortChange = (value: string) => {
    setSelectedSort(value);
    onSortChange(value, sortDirection);
  };

  const toggleSortDirection = () => {
    const newDirection = sortDirection === "asc" ? "desc" : "asc";
    setSortDirection(newDirection);
    onSortChange(selectedSort, newDirection);
  };

  const handleClearFilters = () => {
    setSearchTerm("");
    setSelectedStatus(null);
    setSelectedPriority(null);
    setSelectedSort("deadline");
    setSortDirection("asc");
    if (onClearFilters) {
      onClearFilters();
    }
  };

  return (
    <div className="mb-6 space-y-4">
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-grow">
          <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
            <FontAwesomeIcon
              icon={faSearch}
              className="text-gray-400 dark:text-gray-500"
            />
          </div>
          <input
            type="text"
            className="block w-full p-2.5 pl-10 text-gray-900 border border-gray-300 rounded-lg bg-white focus:ring-blue-500 focus:border-blue-500 dark:bg-zinc-800 dark:border-zinc-700 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            placeholder="Search by name..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          {searchTerm && (
            <button
              className="absolute inset-y-0 right-0 flex items-center pr-3"
              onClick={() => setSearchTerm("")}
            >
              <FontAwesomeIcon
                icon={faXmark}
                className="text-gray-400 dark:text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
              />
            </button>
          )}
        </div>

        <Button
          variant={showFilters ? "primary" : "outline"}
          onClick={() => setShowFilters(!showFilters)}
          className="whitespace-nowrap"
        >
          <FontAwesomeIcon icon={faFilter} className="mr-2" />
          Filters
        </Button>

        <div className="flex gap-2">
          <select
            className="bg-white dark:bg-zinc-800 border border-gray-300 dark:border-zinc-700 text-gray-900 dark:text-white rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2.5"
            value={selectedSort}
            onChange={(e) => handleSortChange(e.target.value)}
          >
            {sortOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>

          <Button
            variant="outline"
            onClick={toggleSortDirection}
            className="px-3"
            title={sortDirection === "asc" ? "Ascending" : "Descending"}
          >
            <FontAwesomeIcon
              icon={sortDirection === "asc" ? faSortAmountUp : faSortAmountDown}
            />
          </Button>
        </div>
      </div>

      {showFilters && (
        <div className="p-4 bg-white dark:bg-zinc-800 rounded-lg border border-gray-200 dark:border-zinc-700 shadow-sm">
          <div className="flex flex-col sm:flex-row gap-6">
            <div className="space-y-2">
              <h3 className="font-medium text-gray-700 dark:text-gray-300">
                Status
              </h3>
              <div className="flex flex-wrap gap-2">
                {statusOptions.map((status) => (
                  <button
                    key={status.value}
                    onClick={() => handleStatusChange(status.value)}
                    className={`px-3 py-1.5 text-sm rounded-lg ${
                      selectedStatus === status.value
                        ? "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300 border-blue-300 dark:border-blue-800"
                        : "bg-gray-100 text-gray-800 dark:bg-zinc-700 dark:text-zinc-300 border-gray-200 dark:border-zinc-600"
                    } border`}
                  >
                    {status.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <h3 className="font-medium text-gray-700 dark:text-gray-300">
                Priority
              </h3>
              <div className="flex flex-wrap gap-2">
                {priorityOptions.map((priority) => (
                  <button
                    key={priority.value}
                    onClick={() => handlePriorityChange(priority.value)}
                    className={`px-3 py-1.5 text-sm rounded-lg ${
                      selectedPriority === priority.value
                        ? priority.value === "high"
                          ? "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300 border-red-300 dark:border-red-800"
                          : priority.value === "moderate"
                          ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300 border-yellow-300 dark:border-yellow-800"
                          : "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300 border-green-300 dark:border-green-800"
                        : "bg-gray-100 text-gray-800 dark:bg-zinc-700 dark:text-zinc-300 border-gray-200 dark:border-zinc-600"
                    } border`}
                  >
                    {priority.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {showClearFilters && (
            <div className="mt-4 flex justify-end">
              <Button variant="ghost" onClick={handleClearFilters}>
                <FontAwesomeIcon icon={faXmark} className="mr-2" />
                Clear Filters
              </Button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default SearchFilters;
