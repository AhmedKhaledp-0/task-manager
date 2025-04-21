import { Task } from "../../types/Types";
import { formatDate } from "../../utils/utils";

const RecentTasks = ({ tasks }: { tasks: Task[] }) => (
  <div className="bg-white dark:bg-zinc-800 rounded-xl shadow-sm border border-gray-200 dark:border-zinc-700 overflow-hidden">
    <div className="px-6 py-4 border-b border-gray-200 dark:border-zinc-700">
      <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
        Recently Completed Tasks
      </h2>
    </div>
    <div className="p-6">
      {tasks && tasks.length > 0 ? (
        <div className="space-y-4">
          {tasks.map(({ id, name, priority, updatedAt }) => (
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
          ))}
        </div>
      ) : (
        <div className="text-center py-6 text-gray-500 dark:text-gray-400">
          No completed tasks in the last 7 days
        </div>
      )}
    </div>
  </div>
);
export default RecentTasks;
