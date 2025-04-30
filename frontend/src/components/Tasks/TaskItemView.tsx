import { MouseEvent } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCalendar,
  faPencil,
  faTrash,
} from "@fortawesome/free-solid-svg-icons";
import { Task } from "../../types/Types";
import { formatDate } from "../../utils/utils";
import StatusSelector, { StatusType } from "../UI/StatusSelector";
import PrioritySelector, { PriorityType } from "../UI/PrioritySelector";

interface TaskItemViewProps {
  task: Task;
  isUpdatingStatus: boolean;
  isUpdatingPriority: boolean;
  onEditClick: (e: MouseEvent) => void;
  onDeleteClick: (e: MouseEvent) => void;
  onStatusChange: (status: StatusType) => void;
  onPriorityChange: (priority: PriorityType) => void;
}

const TaskItemView = ({
  task,
  isUpdatingStatus,
  isUpdatingPriority,
  onEditClick,
  onDeleteClick,
  onStatusChange,
  onPriorityChange,
}: TaskItemViewProps) => {
  return (
    <>
      <div className="flex flex-col md:flex-row gap-2 justify-between items-start">
        <h3 className="font-medium text-gray-900 dark:text-white">
          {task.name}
        </h3>

        <div className="flex self-end gap-2">
          <PrioritySelector
            priority={task.priority as PriorityType}
            isUpdating={isUpdatingPriority}
            onPriorityChange={(newPriority) => onPriorityChange(newPriority)}
          />
          <StatusSelector
            status={task.status as StatusType}
            isUpdating={isUpdatingStatus}
            onStatusChange={(newStatus) => onStatusChange(newStatus)}
          />
        </div>
      </div>

      {task.description && (
        <div className="mt-2 text-sm text-gray-600 dark:text-zinc-400 line-clamp-2">
          {task.description}
        </div>
      )}

      <div className="mt-3 flex flex-wrap justify-between items-center text-sm">
        <div className="flex items-center text-gray-500 dark:text-zinc-400">
          <FontAwesomeIcon icon={faCalendar} className="mr-2" />
          Due: {formatDate(task.deadline)}
        </div>

        <div className="flex space-x-2" onClick={(e) => e.stopPropagation()}>
          <button
            className="text-gray-500 hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-400 p-1"
            onClick={onEditClick}
          >
            <FontAwesomeIcon icon={faPencil} />
          </button>

          <button
            className="text-gray-500 hover:text-red-600 dark:text-gray-400 dark:hover:text-red-400 p-1"
            onClick={onDeleteClick}
          >
            <FontAwesomeIcon icon={faTrash} />
          </button>
        </div>
      </div>
    </>
  );
};

export default TaskItemView;
