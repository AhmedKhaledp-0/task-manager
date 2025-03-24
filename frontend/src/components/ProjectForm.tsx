import { useState } from "react";
import Button from "./Button";
import { FormField } from "./FormField";
import { useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ProjectFormData, ProjectSchema } from "../types/Types";
import { createProject } from "../lib/api";

const ProjectForm = () => {
  const [errorMessage, setErrorMessage] = useState("");
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ProjectFormData>({
    resolver: zodResolver(ProjectSchema),
  });

  const {
    mutate: CreateProject,
    isPending,
    isError,
  } = useMutation({
    mutationFn: (data: ProjectFormData) => createProject(data),
    onSuccess: () => {
      setErrorMessage("");
      // Notify parent component
    },
    onError: (error: Error) => {
      setErrorMessage(error.message || "Invalid credentials");
    },
  });

  const onSubmit = (data: ProjectFormData) => {
    setErrorMessage("");
    CreateProject(data);
  };

  return (
    <>
      <form
        className="mt-8 flex flex-col p-6 gap-2 rounded-md shadow-md"
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

        <Button type="submit" disabled={isPending} className="w-full">
          {isPending ? "Creating..." : "Create"}
        </Button>
      </form>
    </>
  );
};

export default ProjectForm;
