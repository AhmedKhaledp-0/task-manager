import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPencil, faTrash, faTimes } from "@fortawesome/free-solid-svg-icons";
import Button from "./Button";
import { useToast } from "./Toast";
import { Task } from "../types/Types";
import TaskEditForm from "./TaskEditForm";
import StatusBadge from "./StatusBadge";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import {
  deleteExistingTask,
  updateExistingTask,
} from "../store/slices/taskSlice";
import { formatDate, getPriorityColor } from "../utils/utils";

interface TaskModalProps {
  task: Task;
  isOpen: boolean;
  onClose: () => void;
  onTaskUpdated: (updatedTask?: Task) => void;
}

const TaskModal = ({
  task,
  isOpen,
  onClose,
  onTaskUpdated,
}: TaskModalProps) => {
  const dispatch = useAppDispatch();
  const { addToast } = useToast();
  const [isEditing, setIsEditing] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [currentTask, setCurrentTask] = useState<Task>(task);
  const loading = useAppSelector((state) => state.tasks.loading);

  if (task.id !== currentTask.id) {
    setCurrentTask(task);
  }

  if (!isOpen) return null;

  const handleDelete = async () => {
    if (!window.confirm("Are you sure you want to delete this task?")) return;

    try {
      setIsDeleting(true);
      await dispatch(deleteExistingTask(currentTask.id)).unwrap();
      addToast({
        type: "success",
        title: "Success",
        message: "Task deleted successfully",
        duration: 3000,
      });
      onClose();
      onTaskUpdated();
    } catch (err: any) {
      addToast({
        type: "error",
        title: "Error",
        message: err.message || "Failed to delete task",
        duration: 5000,
      });
    } finally {
      setIsDeleting(false);
    }
  };

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
  };

  const handleSaveEdit = async (updatedTask: Task) => {
    try {
      const result = await dispatch(
        updateExistingTask({
          id: currentTask.id,
          data: updatedTask,
        })
      ).unwrap();

      setCurrentTask(result);
      setIsEditing(false);
      onTaskUpdated(result);
    } catch (err: any) {
      addToast({
        type: "error",
        title: "Error",
        message: err.message || "Failed to update task",
        duration: 5000,
      });
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-zinc-800 rounded-xl shadow-lg w-full max-w-md max-h-[90vh] overflow-y-auto">
        <div className="p-5 border-b border-gray-200 dark:border-zinc-700 flex justify-between items-center">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
            {isEditing ? "Edit Task" : "Task Details"}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
          >
            <FontAwesomeIcon icon={faTimes} />
          </button>
        </div>

        <div className="p-5">
          {isEditing ? (
            <TaskEditForm
              task={currentTask}
              onSave={handleSaveEdit}
              onCancel={handleCancelEdit}
            />
          ) : (
            <>
              <h3 className="text-lg font-semibold text-gray-900 break-words whitespace-normal dark:text-white mb-3">
                {currentTask.name}
              </h3>

              <div className="space-y-4">
                {currentTask.description && (
                  <div>
                    <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Description
                    </h4>
                    <p className="text-gray-600 dark:text-zinc-400 whitespace-pre-wrap">
                      {currentTask.description}
                    </p>
                  </div>
                )}

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Status
                    </h4>
                    <StatusBadge status={currentTask.status} />
                  </div>

                  <div>
                    <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Priority
                    </h4>
                    <span
                      className={`inline-flex items-center justify-center px-2.5 py-1 rounded-full text-xs font-medium border ${getPriorityColor(
                        currentTask.priority
                      )}`}
                    >
                      {currentTask.priority}
                    </span>
                  </div>

                  <div>
                    <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Deadline
                    </h4>
                    <p className="text-gray-600 dark:text-zinc-400">
                      {formatDate(currentTask.deadline)}
                    </p>
                  </div>
                </div>
              </div>

              <div className="mt-6 flex justify-end gap-3">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleEdit}
                  disabled={isEditing || loading}
                >
                  <FontAwesomeIcon icon={faPencil} className="mr-2" />
                  Edit
                </Button>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={handleDelete}
                  disabled={isDeleting || loading}
                >
                  <FontAwesomeIcon icon={faTrash} className="mr-2" />
                  {isDeleting ? "Deleting..." : "Delete"}
                </Button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default TaskModal;
