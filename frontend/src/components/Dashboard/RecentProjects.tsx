import { useNavigate } from "react-router-dom";
import { InsightsProject } from "../../types/Types";
import Button from "../Button";

const RecentProjects = ({
  projects,
  navigate,
}: {
  projects: InsightsProject[];
  navigate: ReturnType<typeof useNavigate>;
}) => (
  <div className="bg-white dark:bg-zinc-800 rounded-xl shadow-sm border border-gray-200 dark:border-zinc-700 overflow-hidden">
    <div className="px-6 py-4 border-b border-gray-200 dark:border-zinc-700">
      <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
        Recent Projects
      </h2>
    </div>
    <div className="p-6">
      {projects && projects.length > 0 ? (
        <div className="grid gap-4 grid-cols-1 sm:grid-cols-2">
          {projects.map(({ id, name, status, progress, priority }) => (
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
                    status === "completed" ? "bg-green-500" : "bg-blue-500"
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
          ))}
        </div>
      ) : (
        <div className="text-center py-6 text-gray-500 dark:text-gray-400">
          No projects found
        </div>
      )}

      {projects && projects.length > 4 && (
        <div className="mt-4 text-center">
          <Button variant="secondary" onClick={() => navigate("/projects")}>
            View All Projects
          </Button>
        </div>
      )}
    </div>
  </div>
);
export default RecentProjects;
