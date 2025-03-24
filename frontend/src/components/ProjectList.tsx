import { useEffect, useState } from "react";
import { getProjects } from "../lib/api";
import { Project } from "../types/Types";

const ProjectList = ({ refreshTrigger }: { refreshTrigger: number }) => {
  const [projects, setProjects] = useState<Project[]>([]);
  console.log(projects);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        setLoading(true);
        const response = await getProjects();
        setProjects(response.data || []);
        setError("");
      } catch (err: any) {
        setError(err.message || "Failed to load tasks");
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, [refreshTrigger]);

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "bg-red-100 text-red-800";
      case "moderate":
        return "bg-yellow-100 text-yellow-800";
      case "low":
        return "bg-green-100 text-green-800";
      default:
        return "bg-gray-100";
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-green-100 text-green-800";
      case "in-progress":
        return "bg-blue-100 text-blue-800";
      case "todo":
        return "bg-gray-100 text-gray-800";
      default:
        return "bg-gray-100";
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString();
  };

  if (loading) {
    return <div className="text-center py-8">Loading tasks...</div>;
  }

  if (error) {
    return (
      <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
        {error}
      </div>
    );
  }

  if (projects.length === 0) {
    return (
      <div className="text-center py-8">
        No projects found. Create a project first.
      </div>
    );
  }

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">Your Projects and Tasks</h2>
      {projects.map((project) => (
        <div
          key={project._id}
          className="mb-8 bg-white shadow rounded-lg overflow-hidden"
        >
          <div className="bg-gray-50 px-6 py-4 border-b">
            <h3 className="text-xl font-medium">{project.name}</h3>
            <div className="mt-2 flex flex-wrap gap-2">
              <span
                className={`px-3 py-1 text-xs leading-5 font-semibold rounded-full ${getPriorityColor(
                  project.priority
                )}`}
              >
                {project.priority}
              </span>
              <span
                className={`px-3 py-1 text-xs leading-5 font-semibold rounded-full ${getStatusColor(
                  project.status
                )}`}
              >
                {project.status}
              </span>
              <span className="px-3 py-1 text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                Due: {formatDate(project.deadline)}
              </span>
            </div>
          </div>

          <div className="px-6 py-4 text-gray-600">
            {project.description || "No description available"}
          </div>

          <div className="px-6 pb-6">
            <h4 className="text-lg font-medium mb-3">Tasks</h4>

            {project.tasks && project.tasks.length > 0 ? (
              <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
                {project.tasks.map((task: any) => (
                  <div
                    key={task._id}
                    className="bg-gray-50 rounded-lg p-4 shadow-sm border border-gray-100 hover:shadow-md transition-shadow"
                  >
                    <div className="font-medium text-gray-900 mb-2">
                      {task.name}
                    </div>

                    {task.description && (
                      <div className="text-sm text-gray-500 mb-3">
                        {task.description}
                      </div>
                    )}

                    <div className="flex flex-wrap gap-2 mt-2">
                      <span
                        className={`px-2 py-1 text-xs leading-5 font-semibold rounded-full ${getStatusColor(
                          task.status
                        )}`}
                      >
                        {task.status}
                      </span>
                      <span
                        className={`px-2 py-1 text-xs leading-5 font-semibold rounded-full ${getPriorityColor(
                          task.priority
                        )}`}
                      >
                        {task.priority}
                      </span>
                    </div>

                    <div className="text-sm text-gray-500 mt-3 flex items-center">
                      <svg
                        className="h-4 w-4 mr-1"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                        />
                      </svg>
                      Due: {formatDate(task.deadline)}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-gray-500 bg-gray-50 p-4 rounded-lg text-center">
                No tasks for this project yet.
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

export default ProjectList;
