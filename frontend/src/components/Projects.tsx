import { useState } from "react";
import ProjectList from "./ProjectList";
import Button from "./Button";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import ProjectFormModal from "./ProjectFormModal";
import { useCreateProject, useProjects } from "../hooks/useApi";
import { Data, ProjectFormData, Task } from "../types/Types";

const Projects = () => {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  const {
    data: projectsData,
    isLoading,
    error,
  } = useProjects({
    select: (data: Data) => {
      return data?.data?.projects || [];
    },
  });

  const projects: Array<{
    id: string;
    name: string;
    description?: string;
    status: "active" | "completed";
    priority: "low" | "moderate" | "high";
    deadline: string;
    tasks?: Task[];
  }> = Array.isArray(projectsData) ? projectsData : [];
  const createProjectMutation = useCreateProject();
  const handleAddProject = (data: ProjectFormData) => {
    createProjectMutation.mutate(data);
  };

  return (
    <div className="max-w-7xl mx-auto">
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
