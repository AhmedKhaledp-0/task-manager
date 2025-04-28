import { useState } from "react";
import { Task } from "../../types/Types";
import { useToast } from "../UI/Toast";
import Button from "../UI/Button";

interface TaskEditFormProps {
  task: Task;
  onSave: (updatedTask: Task) => void;
  onCancel: () => void;
}

const TaskEditForm = ({ task, onSave, onCancel }: TaskEditFormProps) => {
  const { addToast } = useToast();
  const [name, setName] = useState(task.name);
  const [description, setDescription] = useState(task.description || "");
  const [status, setStatus] = useState(task.status);
  const [priority, setPriority] = useState(task.priority);
  const [deadline, setDeadline] = useState(
    new Date(task.deadline).toISOString().substring(0, 10)
  );
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!name.trim()) {
      setError("Task name is required");
      return;
    }

    try {
      setIsSaving(true);

      addToast({
        type: "success",
        title: "Success",
        message: "Task updated successfully",
        duration: 3000,
      });

      const fullISODeadline = new Date(`${deadline}T23:59:59Z`).toISOString();

      const updatedTask: Task = {
        ...task,
        name,
        description,
        status: status as Task["status"],
        priority: priority as Task["priority"],
        deadline: fullISODeadline,
      };

      onSave(updatedTask);
    } catch (err: any) {
      setError(err.message || "Failed to update task");
      addToast({
        type: "error",
        title: "Error",
        message: err.message || "Failed to update task",
        duration: 5000,
      });
    } finally {
      setIsSaving(false);
    }
  };

  const statusOptions = [
    { value: "todo", label: "To Do" },
    { value: "inProgress", label: "In Progress" },
    { value: "completed", label: "Completed" },
  ];

  const priorityOptions = [
    { value: "low", label: "Low" },
    { value: "moderate", label: "Medium" },
    { value: "high", label: "High" },
  ];

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <div className="bg-red-100 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-300 px-4 py-3 rounded-lg text-sm">
          {error}
        </div>
      )}

      <div>
        <label
          htmlFor="name"
          className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
        >
          Task Name
        </label>
        <input
          type="text"
          id="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 dark:border-zinc-700 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-zinc-800 dark:text-white"
          required
        />
      </div>

      <div>
        <label
          htmlFor="description"
          className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
        >
          Description
        </label>
        <textarea
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={3}
          className="w-full px-3 py-2 border border-gray-300 dark:border-zinc-700 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-zinc-800 dark:text-white"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label
            htmlFor="status"
            className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
          >
            Status
          </label>
          <select
            id="status"
            value={status}
            onChange={(e) => setStatus(e.target.value as Task["status"])}
            className="w-full px-3 py-2 border border-gray-300 dark:border-zinc-700 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-zinc-800 dark:text-white"
          >
            {statusOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label
            htmlFor="priority"
            className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
          >
            Priority
          </label>
          <select
            id="priority"
            value={priority}
            onChange={(e) => setPriority(e.target.value as Task["priority"])}
            className="w-full px-3 py-2 border border-gray-300 dark:border-zinc-700 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-zinc-800 dark:text-white"
          >
            {priorityOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div>
        <label
          htmlFor="deadline"
          className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
        >
          Deadline
        </label>
        <input
          type="date"
          id="deadline"
          value={deadline}
          onChange={(e) => setDeadline(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 dark:border-zinc-700 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-zinc-800 dark:text-white"
          required
        />
      </div>

      <div className="flex justify-end space-x-3 pt-3">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" disabled={isSaving}>
          {isSaving ? "Saving..." : "Save Changes"}
        </Button>
      </div>
    </form>
  );
};

export default TaskEditForm;
