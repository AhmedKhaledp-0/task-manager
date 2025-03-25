import { useState } from "react";
import ProjectList from "./ProjectList";
import Button from "./Button";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import ProjectFormModal from "./ProjectFormModal";
import { ProjectFormData } from "../types/Types";
import { createProject } from "../lib/api";
import { useToast } from "./Toast";

const Projects = () => {
  const [refreshTaskList, setRefreshTaskList] = useState(0);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const { addToast } = useToast();

  const refreshList = () => {
    setRefreshTaskList((prevState) => prevState + 1);
  };

  const handleAddProject = async (data: ProjectFormData) => {
    try {
      await createProject(data);
      addToast({
        type: "success",
        title: "Success",
        message: "Project created successfully",
        duration: 3000,
      });
      setIsAddModalOpen(false);
      refreshList();
    } catch (err: any) {
      addToast({
        type: "error",
        title: "Error",
        message: err.message || "Failed to create project",
        duration: 5000,
      });
    }
  };

  return (
    <div className="max-w-7xl mx-auto p-6">
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
        <ProjectList refreshTrigger={refreshTaskList} />
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
