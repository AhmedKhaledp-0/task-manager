import { useState } from "react";
import ProjectList from "./ProjectList";
import Button from "../UI/Button";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import ProjectFormModal from "./ProjectFormModal";
import SearchFilters from "../UI/SearchFilters";
import { useProjectsData } from "./useProjectsData";
import {
  Pagination,
  EmptyFilterState,
  LoadingIndicator,
  FilterResultsStats,
} from "./ProjectComponents";
import { STATUS_OPTIONS, PRIORITY_OPTIONS, SORT_OPTIONS } from "./projectUtils";

const Projects = () => {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  const {
    projectsToDisplay,
    currentPageProjects,
    filteredProjects,
    hasActiveFilters,
    totalPages,
    currentPage,
    isLoading,
    isLoadingAllPages,
    error,

    handleSearch,
    handleFilterChange,
    handleSortChange,
    handleClearFilters,
    handlePageChange,
    handleAddProject,
  } = useProjectsData();

  return (
    <div className="max-w-7xl mx-auto flex flex-col h-full">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          Projects
        </h1>
        <Button variant="primary" onClick={() => setIsAddModalOpen(true)}>
          <FontAwesomeIcon icon={faPlus} className="mr-2" />
          Add Project
        </Button>
      </div>

      <SearchFilters
        onSearch={handleSearch}
        onFilterChange={handleFilterChange}
        onSortChange={handleSortChange}
        statusOptions={STATUS_OPTIONS}
        priorityOptions={PRIORITY_OPTIONS}
        sortOptions={SORT_OPTIONS}
        showClearFilters={hasActiveFilters}
        onClearFilters={handleClearFilters}
      />

      {isLoadingAllPages && <LoadingIndicator />}

      {hasActiveFilters &&
        filteredProjects.length === 0 &&
        !isLoadingAllPages && (
          <EmptyFilterState onClearFilters={handleClearFilters} />
        )}

      {hasActiveFilters &&
        filteredProjects.length > 0 &&
        !isLoadingAllPages && (
          <FilterResultsStats
            filteredCount={filteredProjects.length}
            totalCount={currentPageProjects.length}
          />
        )}

      <div className="overflow-auto flex-grow">
        <ProjectList
          projects={projectsToDisplay}
          isLoading={isLoading}
          error={error?.message || null}
        />
      </div>

      {totalPages > 1 && !hasActiveFilters && (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={handlePageChange}
        />
      )}

      <ProjectFormModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSubmit={handleAddProject}
        title="Add New Project"
      />
    </div>
  );
};

export default Projects;
