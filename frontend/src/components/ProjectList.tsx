import { useNavigate } from "react-router-dom";
import Spinner from "./Spinner";
import { formatDate, getPriorityColor, getStatusColor } from "../utils/utils";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCalendar } from "@fortawesome/free-solid-svg-icons";
import { ProjectData } from "../types/Types";

interface pr {
  projects: ProjectData[];
  isLoading: boolean;
  error: string | null;
}

const ProjectList = ({ projects, isLoading, error }: pr) => {
  const navigate = useNavigate();

  const handleProjectClick = (id: string) => {
    navigate(`/project/${id}`);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[200px]">
        <Spinner />
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-300 px-4 py-3 rounded-lg">
        {error}
      </div>
    );
  }

  if (projects.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500 dark:text-zinc-400">
        No projects found. Create a project first.
      </div>
    );
  }

  return (
    <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3">
      {projects.map((project) => (
        <div
          key={project.id}
          onClick={() => handleProjectClick(project.id)}
          className="bg-white dark:bg-zinc-800 rounded-xl shadow-sm hover:shadow-md transition-all duration-200 border border-gray-200 dark:border-zinc-700 overflow-hidden cursor-pointer hover:border-blue-500 dark:hover:border-blue-400"
        >
          <div className="p-6">
            <div className="flex items-start justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900 break-words whitespace-normal dark:text-white">
                {project.name}
              </h3>
              <span
                className={`px-2.5 py-1 text-xs font-medium rounded-full ${getPriorityColor(
                  project.priority
                )}`}
              >
                {project.priority}
              </span>
            </div>

            {project.description && (
              <p className="text-gray-600 dark:text-zinc-400 text-sm mb-4 line-clamp-2">
                {project.description}
              </p>
            )}

            <div className="flex items-center justify-between text-sm text-gray-500 dark:text-zinc-400">
              <div className="flex items-center">
                <FontAwesomeIcon icon={faCalendar} className="mr-2" />
                Due: {formatDate(project.deadline)}
              </div>
              <span
                className={`px-2.5 py-1 text-xs font-medium rounded-full ${getStatusColor(
                  project.status
                )}`}
              >
                {project.status}
              </span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ProjectList;
