import { ProjectFormData } from "../types/Types";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import Button from "../components/UI/Button";
import Spinner from "../components/UI/Spinner";
import { useInsights } from "../hooks/useApi";
import { useState } from "react";
import ProjectFormModal from "../components/project/ProjectFormModal";
import { useCreateProject } from "../hooks/useApi";
import { getProjectStats, getTaskStats } from "../utils/utils";
import StatsCards from "../components/Dashboard/StatsCards";
import TaskOverview from "../components/Dashboard/TaskOverview";
import RecentTasks from "../components/Dashboard/RecentTasks";
import RecentProjects from "../components/Dashboard/RecentProjects";
import ProductivityTrends from "../components/ProductivityTrends";
const Dashboard = () => {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const createProjectMutation = useCreateProject();
  const navigate = useNavigate();
  const { data: insights, isLoading, error } = useInsights();

  const handleAddProject = (data: ProjectFormData) => {
    createProjectMutation.mutate(data);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[300px]">
        <Spinner />
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-300 px-4 py-3 rounded-lg">
        {error.message}
      </div>
    );
  }

  const stats = getProjectStats(insights);
  const taskStats = getTaskStats(insights);
  const recentTasks = insights?.tasks?.productivity?.lastSeven || [];
  const recentProjects = insights?.projects?.progresses || [];

  return (
    <div className="max-w-7xl mx-auto">
      {/* Header with Add Project button */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold text-gray-800 dark:text-gray-100">
          Dashboard
        </h1>
        <Button variant="primary" onClick={() => setIsAddModalOpen(true)}>
          <FontAwesomeIcon icon={faPlus} className="mr-2" />
          Add Project
        </Button>
      </div>

      <ProjectFormModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSubmit={handleAddProject}
        title="Add New Project"
      />

      {/* Stats Cards */}
      <StatsCards stats={stats} />
      {/* Produnctivity Trends */}
      <ProductivityTrends
        productivity={
          insights?.tasks?.productivity || {
            lastSeven: [],
            lastThirty: [],
            lastSixtyFive: [],
          }
        }
      />
      <div className="grid grid-cols-1 lg:grid-cols-1 xl:grid-cols-3 gap-8">
        <div className="xl:col-span-1">
          <TaskOverview taskStats={taskStats} />
          <RecentTasks tasks={recentTasks} />
        </div>
        <div className="xl:col-span-2">
          <RecentProjects projects={recentProjects} navigate={navigate} />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
