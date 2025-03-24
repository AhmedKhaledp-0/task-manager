import { useState } from "react";
import Navbar from "../components/Navbar";
import ProjectForm from "../components/ProjectForm";
import TaskList from "../components/ProjectList";

const ProjectsPage = () => {
  const [refreshProjectList, setRefreshProjectList] = useState(0);

  const handleProjectCreated = () => {
    setRefreshProjectList((prev) => prev + 1);
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />

      <div className="container mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold mb-6">Projects Management</h1>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="md:col-span-1">
            <ProjectForm onProjectCreated={handleProjectCreated} />
          </div>

          <div className="md:col-span-2">
            <TaskList refreshTrigger={refreshProjectList} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectsPage;
