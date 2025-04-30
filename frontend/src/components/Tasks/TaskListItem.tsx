import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { ProjectData, Task } from "../../types/Types";
import { formatDate } from "../../utils/utils";
import {
  faCalendar,
  faPencil,
  faTrash,
  faSave,
  faTimes,
} from "@fortawesome/free-solid-svg-icons";
import { useToast } from "../UI/Toast";
import Spinner from "../UI/Spinner";
import { useDeleteTask, useUpdateTask } from "../../hooks/useApi";
import { ChangeEvent, useState, MouseEvent } from "react";
import StatusSelector, { StatusType } from "../UI/StatusSelector";
import PrioritySelector, { PriorityType } from "../UI/PrioritySelector";
import Button from "../UI/Button";
import { useParams } from "react-router-dom";

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
  const { addToast } = useToast();
  const { id: projectId } = useParams();
  const { tasks = [] } = project || {};
  const updateTaskMutation = useUpdateTask();
  const deleteTaskMutation = useDeleteTask();

  // Track which property is updating for which task
  const [updatingProperty, setUpdatingProperty] = useState<{
    taskId: string | null;
    property: "status" | "priority" | "all" | null;
  }>({
    taskId: null,
    property: null,
  });

  const [editingTaskId, setEditingTaskId] = useState<string | null>(null);

  const [editForm, setEditForm] = useState<Partial<Task>>({
    name: "",
    description: "",
    priority: "low",
    status: "todo",
    deadline: "",
  });

  const handleStatusChange = (newStatus: StatusType, task: Task) => {
    if (newStatus === task.status) return;

    setUpdatingProperty({ taskId: task.id, property: "status" });

    updateTaskMutation.mutate(
      {
        id: task.id,
        data: { status: newStatus },
      },
      {
        onSuccess: () => {
          const updatedTask = { ...task, status: newStatus };
          if (onTaskUpdated) {
            onTaskUpdated(updatedTask);
          }
          setUpdatingProperty({ taskId: null, property: null });
        },
        onError: () => {
          setUpdatingProperty({ taskId: null, property: null });
        },
      }
    );
  };

  const handlePriorityChange = (newPriority: PriorityType, task: Task) => {
    if (newPriority === task.priority) return;

    setUpdatingProperty({ taskId: task.id, property: "priority" });

    updateTaskMutation.mutate(
      {
        id: task.id,
        data: { priority: newPriority },
      },
      {
        onSuccess: () => {
          const updatedTask = { ...task, priority: newPriority };
          if (onTaskUpdated) {
            onTaskUpdated(updatedTask);
          }
          setUpdatingProperty({ taskId: null, property: null });
        },
        onError: () => {
          setUpdatingProperty({ taskId: null, property: null });
        },
      }
    );
  };

  const handleDeleteTask = (e: MouseEvent, taskId: string) => {
    e.stopPropagation(); // Prevent opening the task modal

    if (!window.confirm("Are you sure you want to delete this task?")) return;

    deleteTaskMutation.mutate(
      {
        id: taskId,
        projectId: projectId || "",
      },
      {
        onSuccess: () => {
          if (onTaskDeleted) {
            onTaskDeleted(taskId);
          }
        },
        onError: (error) => {
          addToast({
            type: "error",
            title: "Error",
            message: error.message || "Failed to delete task",
            duration: 5000,
          });
        },
      }
    );
  };

  const handleEditClick = (e: MouseEvent, task: Task) => {
    e.stopPropagation(); // Prevent opening the task modal
    setEditingTaskId(task.id);
    setEditForm({
      name: task.name,
      description: task.description || "",
      priority: task.priority,
      status: task.status,
      deadline: new Date(task.deadline).toISOString().substring(0, 10),
    });
  };

  const handleCancelEdit = (e: MouseEvent) => {
    e.stopPropagation();
    setEditingTaskId(null);
  };

  const handleSaveEdit = (e: MouseEvent, task: Task) => {
    e.stopPropagation();

    if (!editForm.name?.trim()) {
      addToast({
        type: "error",
        title: "Error",
        message: "Task name is required",
        duration: 3000,
      });
      return;
    }

    const fullISODeadline = new Date(
      `${editForm.deadline}T23:59:59Z`
    ).toISOString();

    const updatedTask = {
      ...task,
      name: editForm.name,
      description: editForm.description,
      priority: editForm.priority as Task["priority"],
      status: editForm.status as Task["status"],
      deadline: fullISODeadline,
    };

    setUpdatingProperty({ taskId: task.id, property: "all" });

    updateTaskMutation.mutate(
      {
        id: task.id,
        data: updatedTask,
      },
      {
        onSuccess: () => {
          if (onTaskUpdated) {
            onTaskUpdated(updatedTask);
          }
          setUpdatingProperty({ taskId: null, property: null });
          setEditingTaskId(null);
        },
        onError: (error) => {
          addToast({
            type: "error",
            title: "Error",
            message: error.message || "Failed to update task",
            duration: 5000,
          });
          setUpdatingProperty({ taskId: null, property: null });
        },
      }
    );
  };

  const handleInputChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setEditForm((prev) => ({
      ...prev,
      [name]: value,
    }));
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
          {tasks.map((task) => (
            <div
              key={task.id}
              className="bg-gray-50 dark:bg-zinc-800/50 rounded-lg p-4 border border-gray-200 dark:border-zinc-700 transition-colors"
            >
              {editingTaskId === task.id ? (
                // Edit form
                <div className="space-y-3" onClick={(e) => e.stopPropagation()}>
                  <div className="flex flex-col md:flex-row gap-2 justify-between items-start">
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={editForm.name}
                      onChange={handleInputChange}
                      className="font-medium text-gray-900 dark:text-white bg-transparent border-b border-gray-300 dark:border-zinc-700 focus:outline-none focus:border-blue-500 w-full md:w-auto"
                      required
                    />

                    <div className="flex self-end gap-2">
                      <PrioritySelector
                        priority={editForm.priority as PriorityType}
                        onPriorityChange={(newPriority) => {
                          setEditForm((prev) => ({
                            ...prev,
                            priority: newPriority,
                          }));
                        }}
                      />
                      <StatusSelector
                        status={editForm.status as StatusType}
                        onStatusChange={(newStatus) => {
                          setEditForm((prev) => ({
                            ...prev,
                            status: newStatus,
                          }));
                        }}
                      />
                    </div>
                  </div>

                  <textarea
                    id="description"
                    name="description"
                    value={editForm.description}
                    onChange={handleInputChange}
                    rows={2}
                    placeholder="Task description"
                    className="mt-2 text-sm text-gray-600 dark:text-zinc-400 w-full bg-transparent border border-gray-200 dark:border-zinc-700 rounded-md p-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  />

                  <div className="mt-3 flex flex-wrap justify-between items-center text-sm">
                    <div className="flex items-center text-gray-500 dark:text-zinc-400">
                      <FontAwesomeIcon icon={faCalendar} className="mr-2" />
                      <input
                        type="date"
                        id="deadline"
                        name="deadline"
                        value={editForm.deadline}
                        onChange={handleInputChange}
                        className="bg-transparent border-b border-gray-300 dark:border-zinc-700 focus:outline-none focus:border-blue-500"
                        required
                      />
                    </div>

                    <div className="flex space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={handleCancelEdit}
                      >
                        <FontAwesomeIcon icon={faTimes} className="mr-1" />
                        Cancel
                      </Button>
                      <Button
                        variant="primary"
                        size="sm"
                        onClick={(e) => handleSaveEdit(e, task)}
                        disabled={
                          updatingProperty.taskId === task.id &&
                          updatingProperty.property === "all"
                        }
                      >
                        {updatingProperty.taskId === task.id &&
                        updatingProperty.property === "all" ? (
                          <>
                            <Spinner size="sm" color="white" className="mr-1" />
                          </>
                        ) : (
                          <>
                            <FontAwesomeIcon icon={faSave} className="mr-1" />
                            Save
                          </>
                        )}
                      </Button>
                    </div>
                  </div>
                </div>
              ) : (
                // View mode
                <>
                  <div className="flex flex-col md:flex-row gap-2 justify-between items-start">
                    <h3 className="font-medium text-gray-900 dark:text-white">
                      {task.name}
                    </h3>

                    <div className="flex self-end gap-2">
                      <PrioritySelector
                        priority={task.priority as PriorityType}
                        isUpdating={
                          updatingProperty.taskId === task.id &&
                          updatingProperty.property === "priority"
                        }
                        onPriorityChange={(newPriority) =>
                          handlePriorityChange(newPriority, task)
                        }
                      />
                      <StatusSelector
                        status={task.status as StatusType}
                        isUpdating={
                          updatingProperty.taskId === task.id &&
                          updatingProperty.property === "status"
                        }
                        onStatusChange={(newStatus) =>
                          handleStatusChange(newStatus, task)
                        }
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

                    <div
                      className="flex space-x-2"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <button
                        className="text-gray-500 hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-400 p-1"
                        onClick={(e) => handleEditClick(e, task)}
                        disabled={deleteTaskMutation.isPending}
                      >
                        <FontAwesomeIcon icon={faPencil} />
                      </button>

                      <button
                        className="text-gray-500 hover:text-red-600 dark:text-gray-400 dark:hover:text-red-400 p-1"
                        onClick={(e) => handleDeleteTask(e, task.id)}
                        disabled={deleteTaskMutation.isPending}
                      >
                        <FontAwesomeIcon icon={faTrash} />
                      </button>
                    </div>
                  </div>
                </>
              )}
            </div>
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
