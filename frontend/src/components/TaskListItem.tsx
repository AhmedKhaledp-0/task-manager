import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { ProjectData, Task } from "../types/Types";
import StatusBadge from "./StatusBadge";
import { formatDate, getPriorityColor } from "../utils/utils";
import { faCalendar } from "@fortawesome/free-solid-svg-icons";
import { useToast } from "./Toast";
import { useAppDispatch } from "../store/hooks";
import { fetchTask, setSelectedTask } from "../store/slices/taskSlice";
import Spinner from "./Spinner";

interface TaskListItemProps {
  project: ProjectData;
  onTaskClick: (task: Task) => void;
  loading?: boolean;
}

const TaskListItem = ({
  project,
  onTaskClick,
  loading = false,
}: TaskListItemProps) => {
  const { addToast } = useToast();
  const dispatch = useAppDispatch();
  const { tasks = [] } = project || {};

  const handleTaskClick = async (task: Task) => {
    try {
      await dispatch(fetchTask(task._id)).unwrap();
      dispatch(setSelectedTask(task));
      onTaskClick(task);
    } catch (err: any) {
      addToast({
        type: "error",
        title: "Error",
        message: err.message || "Failed to load task details",
        duration: 5000,
      });
    }
  };

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
          {tasks.map(
            ({ _id, name, description, priority, status, deadline }) => (
              <div
                key={_id}
                className="bg-gray-50 dark:bg-zinc-800/50 rounded-lg p-4 border border-gray-200 dark:border-zinc-700 cursor-pointer hover:bg-gray-100 dark:hover:bg-zinc-700/50 transition-colors"
                onClick={() =>
                  handleTaskClick({
                    _id,
                    name,
                    description,
                    priority,
                    status,
                    deadline,
                  } as Task)
                }
              >
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-medium text-gray-900 dark:text-white">
                      {name}
                    </h3>
                    {description && (
                      <p className="text-sm text-gray-600 dark:text-zinc-400 mt-1">
                        {description}
                      </p>
                    )}
                  </div>
                  <div className="flex space-x-2">
                    <span
                      className={`px-2.5 py-1 text-xs font-medium rounded-full ${getPriorityColor(
                        priority
                      )}`}
                    >
                      {priority}
                    </span>
                    <StatusBadge
                      status={status}
                      className="scale-75 origin-right"
                    />
                  </div>
                </div>
                <div className="mt-3 flex items-center text-sm text-gray-500 dark:text-zinc-400">
                  <FontAwesomeIcon icon={faCalendar} className="mr-2" />
                  Due: {formatDate(deadline)}
                </div>
              </div>
            )
          )}
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
