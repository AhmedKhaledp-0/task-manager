import { useState } from "react";
import Button from "./Button";
import { FormField } from "./FormField";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { TaskFormData, TaskSchema } from "../types/Types";


import { useCreateTask, useProjects } from "../hooks/useApi";
import Spinner from "./Spinner";

const TaskForm = () => {
  const [errorMessage, setErrorMessage] = useState("");
  
  const { data: projectsData, isLoading: projectsLoading, error: projectsError } = useProjects({
    select: (data: { data?: { projects?: any[] } }) => data?.data?.projects || []
  });
  const createTaskMutation = useCreateTask();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<TaskFormData>({
    resolver: zodResolver(TaskSchema),
    defaultValues: {
      status: "todo",
      priority: "moderate",
    },
  });

  const onSubmit = (data: TaskFormData) => {
    setErrorMessage("");
    createTaskMutation.mutate(data, {
      onSuccess: () => {
        reset();
      },
      onError: (error: Error) => {
        const errorMsg = error.message || "Failed to create task";
        setErrorMessage(errorMsg);
      }
    });
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

  const projects = Array.isArray(projectsData) ? projectsData : [];
  const projectOptions = projectsLoading
    ? [{ value: "", label: "Loading projects..." }]
    : projects && projects.length > 0
    ? projects.map((project) => ({
        value: project.id,
        label: project.name,
      }))
    : [{ value: "", label: "No projects available" }];

  if (projectsLoading) {
    return (
      <div className="flex justify-center py-6">
        <Spinner size="md" />
      </div>
    );
  }

  return (
    <>
      <form
        className="mt-8 flex flex-col p-6 gap-4 rounded-md shadow-md bg-white dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700"
        onSubmit={handleSubmit(onSubmit)}
      >
        {errorMessage && (
          <div className="bg-red-100 dark:bg-red-900/30 border border-red-400 dark:border-red-500 text-red-700 dark:text-red-400 px-4 py-3 rounded-md relative">
            <p className="text-sm">{errorMessage}</p>
          </div>
        )}

        {projectsError && (
          <div className="bg-red-100 dark:bg-red-900/30 border border-red-400 dark:border-red-500 text-red-700 dark:text-red-400 px-4 py-3 rounded-md relative">
            <p className="text-sm">Error loading projects. Please try again.</p>
          </div>
        )}

        <FormField
          type="text"
          label="Task name"
          name="name"
          register={register}
          error={errors.name}
          required={true}
          placeholder="Task name"
        />

        <FormField
          type="select"
          label="Project"
          name="projectId"
          register={register}
          error={errors.projectId}
          required={true}
          options={projectOptions}
        />

        <FormField
          type="date"
          label="Deadline"
          name="deadline"
          register={register}
          error={errors.deadline}
          required={true}
          min={new Date().toISOString().split("T")[0]}
        />

        <FormField
          type="select"
          label="Status"
          name="status"
          register={register}
          error={errors.status}
          required={true}
          options={statusOptions}
        />

        <FormField
          type="select"
          label="Priority"
          name="priority"
          register={register}
          error={errors.priority}
          required={true}
          options={priorityOptions}
        />

        <FormField
          type="textarea"
          label="Description"
          name="description"
          register={register}
          error={errors.description}
          rows={4}
          placeholder="Task description (optional)"
        />

        <Button
          type="submit"
          disabled={createTaskMutation.isPending}
          className="w-full mt-2"
        >
          {createTaskMutation.isPending ? "Creating..." : "Create Task"}
        </Button>
      </form>
    </>
  );
};

export default TaskForm;
