import { useState, useEffect } from "react";
import ProjectList from "./ProjectList";
import Button from "../UI/Button";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faChevronLeft,
  faChevronRight,
  faPlus,
} from "@fortawesome/free-solid-svg-icons";
import ProjectFormModal from "./ProjectFormModal";
import { useCreateProject, useProjects } from "../../hooks/useApi";
import { Data, ProjectFormData } from "../../types/Types";

const Projects = () => {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [limit] = useState(10);
  const [totalPages, setTotalPages] = useState(0);

  const {
    data: projectsData,
    isLoading,
    error,
  } = useProjects(
    {
      select: (data: Data) => data,
    },
    currentPage,
    limit
  );

  const projects = projectsData?.data?.projects || [];
  useEffect(() => {
    if (projectsData?.data?.pages) {
      setTotalPages(projectsData.data.pages);
    }
  }, [projectsData]);

  const createProjectMutation = useCreateProject();
  const handleAddProject = (data: ProjectFormData) => {
    createProjectMutation.mutate(data);
  };

  const handlePageChange = (newPage: number) => {
    if (newPage > 0 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };

  return (
    <div className="max-w-7xl mx-auto flex flex-col h-full ">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          Projects
        </h1>
        <Button variant="primary" onClick={() => setIsAddModalOpen(true)}>
          <FontAwesomeIcon icon={faPlus} className="mr-2" />
          Add Project
        </Button>
      </div>

      <div className="overflow-auto">
        <ProjectList
          projects={projects}
          isLoading={isLoading}
          error={error?.message || null}
        />
      </div>

      {totalPages > 1 && (
        <div className="flex  justify-center items-center mt-auto space-x-2">
          <Button
            variant="secondary"
            onClick={() => handlePageChange(currentPage - 1)}
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
                  onClick={() => handlePageChange(pageToShow)}
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
              <>
                <button
                  onClick={() => handlePageChange(totalPages)}
                  className="px-3 py-1 rounded bg-gray-100 dark:bg-zinc-700 text-gray-700 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-zinc-600"
                >
                  {totalPages}
                </button>
              </>
            )}
          </div>

          <Button
            variant="secondary"
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="px-3 py-1"
          >
            <FontAwesomeIcon icon={faChevronRight} />
          </Button>
        </div>
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
