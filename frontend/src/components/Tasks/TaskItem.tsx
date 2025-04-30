import { ChangeEvent, MouseEvent, useState } from "react";
import { Task } from "../../types/Types";
import { useDeleteTask, useUpdateTask } from "../../hooks/useApi";
import { useToast } from "../UI/Toast";
import { StatusType } from "../UI/StatusSelector";
import { PriorityType } from "../UI/PrioritySelector";
import TaskItemView from "./TaskItemView";
import TaskItemForm from "./TaskItemForm";
import { useParams } from "react-router-dom";

interface TaskItemProps {
  task: Task;
  onTaskUpdated?: (updatedTask: Task) => void;
  onTaskDeleted?: (taskId: string) => void;
}

const TaskItem = ({ task, onTaskUpdated, onTaskDeleted }: TaskItemProps) => {
  const { addToast } = useToast();
  const { id: projectId } = useParams();
  const updateTaskMutation = useUpdateTask();
  const deleteTaskMutation = useDeleteTask();

  const [editingTaskId, setEditingTaskId] = useState<boolean>(false);
  const [updatingProperty, setUpdatingProperty] = useState<
    "status" | "priority" | "all" | null
  >(null);

  const [editForm, setEditForm] = useState<Partial<Task>>({
    name: "",
    description: "",
    priority: "low",
    status: "todo",
    deadline: "",
  });

  const handleEditClick = (e: MouseEvent) => {
    e.stopPropagation(); // Prevent opening the task modal
    setEditingTaskId(true);
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
    setEditingTaskId(false);
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

  const handleFormPriorityChange = (newPriority: PriorityType) => {
    setEditForm((prev) => ({
      ...prev,
      priority: newPriority,
    }));
  };

  const handleFormStatusChange = (newStatus: StatusType) => {
    setEditForm((prev) => ({
      ...prev,
      status: newStatus,
    }));
  };

  const handleSaveEdit = () => {
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

    setUpdatingProperty("all");

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
          setUpdatingProperty(null);
          setEditingTaskId(false);
        },
        onError: (error) => {
          addToast({
            type: "error",
            title: "Error",
            message: error.message || "Failed to update task",
            duration: 5000,
          });
          setUpdatingProperty(null);
        },
      }
    );
  };

  const handleStatusChange = (newStatus: StatusType) => {
    if (newStatus === task.status) return;

    setUpdatingProperty("status");

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
          setUpdatingProperty(null);
        },
        onError: () => {
          setUpdatingProperty(null);
        },
      }
    );
  };

  const handlePriorityChange = (newPriority: PriorityType) => {
    if (newPriority === task.priority) return;

    setUpdatingProperty("priority");

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
          setUpdatingProperty(null);
        },
        onError: () => {
          setUpdatingProperty(null);
        },
      }
    );
  };

  const handleDeleteTask = (e: MouseEvent) => {
    e.stopPropagation(); // Prevent opening the task modal

    if (!window.confirm("Are you sure you want to delete this task?")) return;

    deleteTaskMutation.mutate(
      {
        id: task.id,
        projectId: projectId || "",
      },
      {
        onSuccess: () => {
          if (onTaskDeleted) {
            onTaskDeleted(task.id);
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

  return (
    <div className="bg-gray-50 dark:bg-zinc-800/50 rounded-lg p-4 border border-gray-200 dark:border-zinc-700 transition-colors">
      {editingTaskId ? (
        <TaskItemForm
          editForm={editForm}
          isSaving={updatingProperty === "all"}
          onInputChange={handleInputChange}
          onPriorityChange={handleFormPriorityChange}
          onStatusChange={handleFormStatusChange}
          onSave={handleSaveEdit}
          onCancel={handleCancelEdit}
        />
      ) : (
        <TaskItemView
          task={task}
          isUpdatingStatus={updatingProperty === "status"}
          isUpdatingPriority={updatingProperty === "priority"}
          onEditClick={handleEditClick}
          onDeleteClick={handleDeleteTask}
          onStatusChange={handleStatusChange}
          onPriorityChange={handlePriorityChange}
        />
      )}
    </div>
  );
};

export default TaskItem;
