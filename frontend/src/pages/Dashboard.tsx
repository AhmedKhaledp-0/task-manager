import { InsightsProject, ProjectFormData, Task } from "../types/Types";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus } from "@fortawesome/free-solid-svg-icons";

import Button from "../components/Button";
import { statsCardsList } from "../utils/list";
import Spinner from "../components/Spinner";
import { formatDate } from "../utils/utils";
import { useInsights } from "../hooks/useApi";
import { useState } from "react";
import ProjectFormModal from "../components/ProjectFormModal";
import { useCreateProject } from "../hooks/useApi";
const Dashboard = () => {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const createProjectMutation = useCreateProject();
  const handleAddProject = (data: ProjectFormData) => {
    createProjectMutation.mutate(data);
  };
  const navigate = useNavigate();

  const { data: insights, isLoading, error } = useInsights();

  const getProjectStats = () => {
    if (!insights)
      return { totalProjects: 0, completed: 0, active: 0, highPriority: 0 };

    const projectsGeneral = insights.projects.general;
    type StatusItem = { status: string; _count: number };
    type PriorityItem = { priority: string; _count: number };

    const statuesCount = Object.values(projectsGeneral.status) as StatusItem[];

    const activeCount =
      statuesCount.filter((item) => item.status === "active")[0]?._count || 0;

    const completedCount =
      statuesCount.filter((item) => item.status === "completed")[0]?._count ||
      0;

    const priorityCount = Object.values(
      projectsGeneral.priority
    ) as PriorityItem[];
    const highPriorityCount =
      priorityCount.filter((item) => item.priority === "high")[0]?._count || 0;

    return {
      totalProjects: projectsGeneral.total || 0,
      completed: completedCount,
      active: activeCount,
      highPriority: highPriorityCount,
    };
  };

  const getTaskStats = () => {
    if (!insights)
      return {
        total: 0,
        completed: 0,
        inProgress: 0,
        todo: 0,
        highPriority: 0,
      };

    const tasksGeneral = insights.tasks.general;
    type StatusItem = { status: string; _count: number };
    type PriorityItem = { priority: string; _count: number };
    const statuesCount = Object.values(tasksGeneral.status) as StatusItem[];
    const priorityCount = Object.values(
      tasksGeneral.priority
    ) as PriorityItem[];

    const totalCount = tasksGeneral.total || 0;

    const completedCount =
      statuesCount.filter((item) => item.status === "completed")[0]?._count ||
      0;
    const inProgressCount =
      statuesCount.filter((item) => item.status === "inProgress")[0]?._count ||
      0;
    const todoCount =
      statuesCount.filter((item) => item.status === "todo")[0]?._count || 0;

    const highPriorityCount =
      priorityCount.filter((item) => item.priority === "high")[0]?._count || 0;

    return {
      total: totalCount || 0,
      completed: completedCount,
      inProgress: inProgressCount,
      todo: todoCount,
      highPriority: highPriorityCount,
    };
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
  const taskStats = getTaskStats();

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
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-4 gap-6 mb-8">
        {statsCardsList.map((card) => (
          <div
            key={card.title}
            className="bg-white dark:bg-zinc-800 rounded-xl shadow-sm p-6 border border-gray-200 dark:border-zinc-700"
          >
            <div className="flex items-center">
              <div
                className={`p-3 flex justify-center items-center rounded-full bg-${card.color}-100 dark:bg-${card.color}-900/30 text-${card.color}-600 dark:text-${card.color}-400 mr-4`}
              >
                <FontAwesomeIcon icon={card.icon} className="h-5 w-5" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                  {card.title}
                </p>
                <p className="text-2xl font-semibold text-gray-900 dark:text-white">
                  {card.title === "Total Projects"
                    ? stats.totalProjects
                    : card.title === "Completed"
                    ? stats.completed
                    : card.title === "Active Projects"
                    ? stats.active
                    : stats.highPriority}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-1 xl:grid-cols-3 gap-8">
        <div className="xl:col-span-1">
          {/* Task Statistics */}
          <div className="bg-white dark:bg-zinc-800 rounded-xl shadow-sm border border-gray-200 dark:border-zinc-700 overflow-hidden mb-8">
            <div className="px-6 flex justify-between items-center py-4 border-b border-gray-200 dark:border-zinc-700">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                Task Overview
              </h2>
              <div className="flex items-center py-1 px-2 rounded-md bg-zinc-200 text-zinc-800 dark:bg-zinc-700 dark:text-zinc-200 justify-center ">
                {taskStats.total}
              </div>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    Completed
                  </span>
                  <span className="font-semibold text-green-600 dark:text-green-400">
                    {taskStats.completed}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    In Progress
                  </span>
                  <span className="font-semibold text-amber-600 dark:text-amber-400">
                    {taskStats.inProgress}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    To Do
                  </span>
                  <span className="font-semibold text-blue-600 dark:text-blue-400">
                    {taskStats.todo}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    High Priority
                  </span>
                  <span className="font-semibold text-red-600 dark:text-red-400">
                    {taskStats.highPriority}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Upcoming Deadlines */}
          <div className="bg-white dark:bg-zinc-800 rounded-xl shadow-sm border border-gray-200 dark:border-zinc-700 overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200 dark:border-zinc-700">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                Recently Completed Tasks
              </h2>
            </div>
            <div className="p-6">
              {insights?.tasks?.productivity?.lastSeven?.length > 0 ? (
                <div className="space-y-4">
                  {insights.tasks.productivity.lastSeven.map(
                    ({ id, name, priority, updatedAt }: Task) => (
                      <div
                        key={id}
                        className="p-4 border border-gray-100 dark:border-zinc-700 rounded-lg hover:bg-gray-50 dark:hover:bg-zinc-700/50"
                      >
                        <h3 className="font-medium text-gray-900 dark:text-white">
                          {name}
                        </h3>
                        <div className="flex items-center justify-between mt-2 text-sm">
                          <span
                            className={`px-2 py-1 rounded-full text-xs font-medium
                          ${
                            priority === "high"
                              ? "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300"
                              : priority === "moderate"
                              ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300"
                              : "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300"
                          }`}
                          >
                            {priority}
                          </span>
                          <span className="text-gray-500 dark:text-gray-400">
                            {formatDate(updatedAt)}
                          </span>
                        </div>
                      </div>
                    )
                  )}
                </div>
              ) : (
                <div className="text-center py-6 text-gray-500 dark:text-gray-400">
                  No completed tasks in the last 7 days
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
              {insights?.projects?.progresses?.length > 0 ? (
                <div className="grid gap-4 grid-cols-1 sm:grid-cols-2">
                  {insights.projects.progresses.map(
                    ({
                      id,
                      name,
                      status,
                      progress,
                      priority,
                    }: InsightsProject) => (
                      <div
                        key={id}
                        onClick={() => navigate(`/project/${id}`)}
                        className="bg-gray-50 dark:bg-zinc-700/50 rounded-lg p-4 hover:shadow-md transition-all duration-200 border border-gray-100 dark:border-zinc-700 cursor-pointer"
                      >
                        <h3 className="font-medium text-gray-900 dark:text-white mb-2">
                          {name}
                        </h3>

                        {/* Progress bar */}
                        <div className="w-full bg-gray-200 dark:bg-zinc-600 rounded-full h-2.5 mb-3">
                          <div
                            className={`h-2.5 rounded-full ${
                              status === "completed"
                                ? "bg-green-500"
                                : "bg-blue-500"
                            }`}
                            style={{ width: `${progress || 0}%` }}
                          ></div>
                        </div>

                        <div className="flex justify-between items-center text-sm">
                          <span
                            className={`px-2 py-1 rounded-full text-xs font-medium
                          ${
                            priority === "high"
                              ? "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300"
                              : priority === "moderate"
                              ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300"
                              : "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300"
                          }`}
                          >
                            {priority}
                          </span>
                          <span
                            className={`px-2 py-1 rounded-full text-xs font-medium
                          ${
                            status === "completed"
                              ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300"
                              : "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300"
                          }`}
                          >
                            {status}
                          </span>
                        </div>
                      </div>
                    )
                  )}
                </div>
              ) : (
                <div className="text-center py-6 text-gray-500 dark:text-gray-400">
                  No projects found
                </div>
              )}

              {insights?.projects?.progresses?.length > 4 && (
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
