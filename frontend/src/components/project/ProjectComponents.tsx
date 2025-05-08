import { FC } from "react";
import Button from "../UI/Button";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faChevronLeft,
  faChevronRight,
} from "@fortawesome/free-solid-svg-icons";
import Spinner from "../UI/Spinner";

// Pagination component
export const Pagination: FC<{
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}> = ({ currentPage, totalPages, onPageChange }) => {
  if (totalPages <= 1) return null;

  return (
    <div className="flex justify-center items-center mt-auto space-x-2">
      <Button
        variant="secondary"
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="px-3 py-1"
      >
        <FontAwesomeIcon icon={faChevronLeft} />
      </Button>

      <div className="flex space-x-1">
        {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
          let pageToShow;
          if (totalPages <= 5) {
            pageToShow = i + 1;
          } else if (currentPage <= 3) {
            pageToShow = i + 1;
          } else if (currentPage >= totalPages - 2) {
            pageToShow = totalPages - 4 + i;
          } else {
            pageToShow = currentPage - 2 + i;
          }

          return (
            <button
              key={pageToShow}
              onClick={() => onPageChange(pageToShow)}
              className={`px-3 py-1 rounded ${
                currentPage === pageToShow
                  ? "bg-blue-600 text-white"
                  : "bg-gray-100 dark:bg-zinc-700 text-gray-700 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-zinc-600"
              }`}
            >
              {pageToShow}
            </button>
          );
        })}

        {totalPages > 5 && currentPage < totalPages - 2 && (
          <button
            onClick={() => onPageChange(totalPages)}
            className="px-3 py-1 rounded bg-gray-100 dark:bg-zinc-700 text-gray-700 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-zinc-600"
          >
            {totalPages}
          </button>
        )}
      </div>

      <Button
        variant="secondary"
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="px-3 py-1"
      >
        <FontAwesomeIcon icon={faChevronRight} />
      </Button>
    </div>
  );
};

// Empty state component
export const EmptyFilterState: FC<{
  onClearFilters: () => void;
}> = ({ onClearFilters }) => (
  <div className="bg-gray-50 dark:bg-zinc-800 rounded-lg p-8 text-center my-6 border border-gray-200 dark:border-zinc-700">
    <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
      No projects match your filters
    </h3>
    <p className="text-gray-500 dark:text-gray-400 mb-4">
      Try adjusting your search criteria or clear filters
    </p>
    <Button variant="outline" onClick={onClearFilters}>
      Clear Filters
    </Button>
  </div>
);

// Loading indicator component
export const LoadingIndicator: FC = () => (
  <div className="flex justify-center my-4">
    <div className="flex flex-col items-center">
      <Spinner size="md" />
      <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
        Loading all projects for filtering...
      </p>
    </div>
  </div>
);

// Filter results stats component
export const FilterResultsStats: FC<{
  filteredCount: number;
  totalCount: number;
}> = ({ filteredCount, totalCount }) => (
  <div className="mb-4 text-sm text-gray-500 dark:text-gray-400">
    Showing {filteredCount} of {totalCount} projects
  </div>
);
