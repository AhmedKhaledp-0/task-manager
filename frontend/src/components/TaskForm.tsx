import { useState } from "react";
import Button from "./Button";
import { FormField } from "./FormField";
import { useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { TaskFormData, TaskSchema } from "../types/Types";
import { createTask } from "../lib/api";
import { useToast } from "./Toast";

const TaskForm = () => {
  const { addToast } = useToast();
  const [errorMessage, setErrorMessage] = useState("");
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<TaskFormData>({
    resolver: zodResolver(TaskSchema),
    defaultValues: {
      status: "active",
      priority: "moderate",
    },
  });

  const {
    mutate: CreateProject,
    isPending,
    isError,
  } = useMutation({
    mutationFn: (data: TaskFormData) => createTask(data),
    onSuccess: () => {
      setErrorMessage("");
      addToast({
        type: "success",
        title: "Task Created",
        message: "Your task has been created successfully!",
        duration: 5000,
      });
      reset();
    },
    onError: (error: Error) => {
      const errorMsg = error.message || "Failed to task project";
      setErrorMessage(errorMsg);
      addToast({
        type: "error",
        title: "Error",
        message: errorMsg,
        duration: 8000,
      });
    },
  });

  const onSubmit = (data: TaskFormData) => {
    setErrorMessage("");
    CreateProject(data);
  };

  const statusOptions = [
    { value: "active", label: "Active" },
    { value: "completed", label: "Completed" },
  ];

  const priorityOptions = [
    { value: "low", label: "Low" },
    { value: "moderate", label: "Medium" },
    { value: "high", label: "High" },
  ];

  return (
    <>
      <form
        className="mt-8 flex flex-col p-6 gap-4 rounded-md shadow-md"
        onSubmit={handleSubmit(onSubmit)}
      >
        {isError && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-md relative">
            <p className="text-sm">{errorMessage || "Invalid credentials"}</p>
          </div>
        )}

        <FormField
          type="text"
          label="Project name"
          name="name"
          register={register}
          error={errors.name}
          required={true}
          placeholder="Project name"
        />

        <FormField
          type="date"
          label="Deadline"
          name="deadline"
          register={register}
          error={errors.deadline}
          required={true}
          min={new Date().getDate()}
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
          placeholder="Project description (optional)"
        />

        <Button type="submit" disabled={isPending} className="w-full mt-2">
          {isPending ? "Creating..." : "Create"}
        </Button>
      </form>
    </>
  );
};

export default TaskForm;
