import { getTaskStats } from "../../utils/utils";

const TaskOverview = ({
  taskStats,
}: {
  taskStats: ReturnType<typeof getTaskStats>;
}) => (
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
);
export default TaskOverview;
