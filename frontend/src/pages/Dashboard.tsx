import { Data, ProjectFormData } from "../types/Types";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCalendar, faPlus } from "@fortawesome/free-solid-svg-icons";

import Button from "../components/Button";
import { statsCardsList } from "../utils/list";
import Spinner from "../components/Spinner";
import { formatDate } from "../utils/utils";
import { useProjects } from "../hooks/useApi";
import { useState } from "react";
import ProjectFormModal from "../components/ProjectFormModal";
import { useCreateProject } from "../hooks/useApi";
import { getProjectStats, getTaskStats } from "../utils/utils";
import StatsCards from "../components/Dashboard/StatsCards";
import TaskOverview from "../components/Dashboard/TaskOverview";
import RecentTasks from "../components/Dashboard/RecentTasks";
import RecentProjects from "../components/Dashboard/RecentProjects";
import ProductivityTrends from "../components/Layout/ProductivityTrends";

const Dashboard = () => {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const createProjectMutation = useCreateProject();
  const handleAddProject = (data: ProjectFormData) => {
    createProjectMutation.mutate(data);
  };
  const navigate = useNavigate();
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
    status: string;
    priority: string;
    tasks?: any[];
    deadline: string;
    id: string;
    name: string;
    description?: string;
  }> = Array.isArray(projectsData) ? projectsData : [];
  const getProjectStats = () => {
    const totalProjects = projects.length;
    const completed = projects.filter((p) => p.status === "completed").length;
    const active = projects.filter((p) => p.status === "active").length;
    const highPriority = projects.filter((p) => p.priority === "high").length;

    return { totalProjects, completed, active, highPriority };
  };

  // const getTaskStats = () => {
  //   const allTasks = projects.flatMap((p) => p.tasks || []);
  //   const totalTasks = allTasks.length;
  //   const completedTasks = allTasks.filter(
  //     (t) => t.status === "completed"
  //   ).length;
  //   const inProgressTasks = allTasks.filter(
  //     (t) => t.status === "in-progress"
  //   ).length;
  //   const todoTasks = allTasks.filter((t) => t.status === "todo").length;
  //   const highPriorityTasks = allTasks.filter(
  //     (t) => t.priority === "high"
  //   ).length;

  //   return {
  //     totalTasks,
  //     completedTasks,
  //     inProgressTasks,
  //     todoTasks,
  //     highPriorityTasks,
  //   };
  // };

  const getUpcomingDeadlines = () => {
    const now = new Date();
    const sevenDaysLater = new Date();
    sevenDaysLater.setDate(now.getDate() + 7);

    return projects
      .filter((project) => {
        const deadline = new Date(project.deadline);
        return (
          deadline >= now &&
          deadline <= sevenDaysLater &&
          project.status === "active"
        );
      })
      .sort(
        (a, b) =>
          new Date(a.deadline).getTime() - new Date(b.deadline).getTime()
      )
      .slice(0, 3);
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

  const stats = getProjectStats();
  // const taskStats = getTaskStats();
  const upcomingDeadlines = getUpcomingDeadlines();

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
          <div className="bg-white dark:bg-zinc-800 rounded-xl shadow-sm border border-gray-200 dark:border-zinc-700 overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200 dark:border-zinc-700">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                Upcoming Deadlines
              </h2>
            </div>
            <div className="p-6">
              {upcomingDeadlines.length > 0 ? (
                <div className="space-y-4">
                  {upcomingDeadlines.map((project) => (
                    <div
                      key={project.id}
                      className="p-4 border border-gray-100 dark:border-zinc-700 rounded-lg hover:bg-gray-50 dark:hover:bg-zinc-700/50 cursor-pointer"
                      onClick={() => navigate(`/project/${project.id}`)}
                    >
                      <h3 className="font-medium text-gray-900 dark:text-white">
                        {project.name}
                      </h3>
                      <div className="flex items-center mt-2 text-sm text-gray-500 dark:text-gray-400">
                        <FontAwesomeIcon icon={faCalendar} className="mr-2" />
                        Due: {formatDate(project.deadline)}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-6 text-gray-500 dark:text-gray-400">
                  No upcoming deadlines
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Projects list */}
        <div className="xl:col-span-2">
          <div className="bg-white dark:bg-zinc-800 rounded-xl shadow-sm border border-gray-200 dark:border-zinc-700 overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200 dark:border-zinc-700">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                Recent Projects
              </h2>
            </div>
            <div className="p-6">
              {projects.length > 0 ? (
                <div className="grid gap-4 grid-cols-1 sm:grid-cols-2">
                  {projects.slice(0, 4).map((project) => (
                    <div
                      key={project.id}
                      onClick={() => navigate(`/project/${project.id}`)}
                      className="bg-gray-50 dark:bg-zinc-700/50 rounded-lg p-4 hover:shadow-md transition-all duration-200 border border-gray-100 dark:border-zinc-700 cursor-pointer"
                    >
                      <h3 className="font-medium text-gray-900 dark:text-white mb-2">
                        {project.name}
                      </h3>
                      {project.description && (
                        <p className="text-gray-600 dark:text-zinc-400 text-sm mb-3 line-clamp-2">
                          {project.description}
                        </p>
                      )}
                      <div className="flex justify-between items-center text-sm">
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-medium
                          ${
                            project.priority === "high"
                              ? "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300"
                              : project.priority === "moderate"
                              ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300"
                              : "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300"
                          }`}
                        >
                          {project.priority}
                        </span>
                        <span className="text-gray-500 dark:text-gray-400">
                          Due: {formatDate(project.deadline)}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-6 text-gray-500 dark:text-gray-400">
                  No projects found
                </div>
              )}

              {projects.length > 4 && (
                <div className="mt-4 text-center">
                  <Button
                    variant="secondary"
                    onClick={() => navigate("/projects")}
                  >
                    View All Projects
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
