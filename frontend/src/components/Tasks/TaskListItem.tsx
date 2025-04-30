import { ProjectData, Task } from "../../types/Types";
import Spinner from "../UI/Spinner";
import TaskItem from "./TaskItem";

interface TaskListItemProps {
  project: ProjectData;
  loading?: boolean;
  onTaskUpdated?: (updatedTask: Task) => void;
  onTaskDeleted?: (taskId: string) => void;
}

const TaskListItem = ({
  project,
  loading = false,
  onTaskUpdated,
  onTaskDeleted,
}: TaskListItemProps) => {
  const { tasks = [] } = project || {};

  if (loading) {
    return (
      <div className="flex justify-center items-center py-8 bg-gray-50 dark:bg-zinc-800/50 rounded-lg">
        <Spinner size="md" />
        <span className="ml-2 text-gray-600 dark:text-zinc-400">
          Loading tasks...
        </span>
      </div>
    );
  }

  return (
    <>
      {tasks.length > 0 ? (
        <div className="space-y-4">
          {tasks.map((task) => (
            <TaskItem
              key={task.id}
              task={task}
              onTaskUpdated={onTaskUpdated}
              onTaskDeleted={onTaskDeleted}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-8 text-gray-500 dark:text-zinc-400 bg-gray-50 dark:bg-zinc-800/50 rounded-lg">
          No tasks for this project yet.
        </div>
      )}
    </>
  );
};

export default TaskListItem;
