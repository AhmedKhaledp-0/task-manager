import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ProjectFormData, ProjectSchema } from "../types/Types";
import { FormField } from "./FormField";
import Button from "./Button";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes } from "@fortawesome/free-solid-svg-icons";

interface ProjectFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: ProjectFormData) => void;
  project?: ProjectFormData;
  title: string;
}

const ProjectFormModal = ({
  isOpen,
  onClose,
  onSubmit,
  project,
  title,
}: ProjectFormModalProps) => {
  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<ProjectFormData>({
    resolver: zodResolver(ProjectSchema),
    defaultValues: {
      name: "",
      description: "",
      status: "active",
      priority: "low",
      deadline: new Date(),
    },
  });

  useEffect(() => {
    if (project) {
      setValue("name", project.name);
      setValue("description", project.description || "");
      setValue("status", project.status);
      setValue("priority", project.priority);
      setValue("deadline", project.deadline);
      if (project.deadline) {
        const deadlineDate =
          project.deadline instanceof Date
            ? project.deadline
            : new Date(project.deadline);

        // Format date as YYYY-MM-DD for the input field
        const formattedDate = deadlineDate.toISOString().split("T")[0];
        setValue("deadline", formattedDate);
      }
    }
  }, [project, setValue]);

  const handleFormSubmit = async (data: ProjectFormData) => {
    try {
      const formattedData = {
        ...data,
        deadline: new Date(data.deadline),
      };
      onSubmit(formattedData);
      reset();
      onClose();
    } catch (error) {
      console.error("Error submitting form:", error);
    }
  };

  if (!isOpen) return null;

  const today = new Date().toISOString().split("T")[0];
  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex min-h-screen items-center justify-center px-4 pt-4 pb-20 text-center sm:block sm:p-0">
        <div
          className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity dark:bg-zinc-900 dark:bg-opacity-75"
          onClick={onClose}
        />

        <div className="inline-block transform overflow-hidden rounded-lg bg-white px-4 pb-4 pt-5 text-left align-bottom shadow-xl transition-all dark:bg-zinc-800 sm:my-8 sm:w-full sm:max-w-lg sm:p-6 sm:align-middle">
          <div className="absolute right-0 top-0 pr-4 pt-4">
            <button
              type="button"
              className="rounded-md bg-white text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:bg-zinc-800 dark:text-zinc-400 dark:hover:text-zinc-300"
              onClick={onClose}
            >
              <span className="sr-only">Close</span>
              <FontAwesomeIcon icon={faTimes} className="h-6 w-6" />
            </button>
          </div>

          <div className="sm:flex sm:items-start">
            <div className="mt-3 text-center sm:mt-0 sm:text-left w-full">
              <h3 className="text-lg font-semibold leading-6 text-gray-900 dark:text-white">
                {title}
              </h3>

              <form
                onSubmit={handleSubmit(handleFormSubmit)}
                className="mt-4 space-y-4"
              >
                <FormField
                  label="Project Name"
                  name="name"
                  register={register}
                  error={errors.name}
                  required
                />

                <FormField
                  label="Description"
                  name="description"
                  register={register}
                  error={errors.description}
                  type="textarea"
                  rows={3}
                />

                <FormField
                  label="Status"
                  name="status"
                  register={register}
                  error={errors.status}
                  type="select"
                  options={[
                    { value: "active", label: "Active" },
                    { value: "completed", label: "Completed" },
                  ]}
                  required
                />

                <FormField
                  label="Priority"
                  name="priority"
                  register={register}
                  error={errors.priority}
                  type="select"
                  options={[
                    { value: "low", label: "Low" },
                    { value: "moderate", label: "Moderate" },
                    { value: "high", label: "High" },
                  ]}
                  required
                />

                <FormField
                  label="Deadline"
                  name="deadline"
                  register={register}
                  error={errors.deadline}
                  type="date"
                  required
                  min={today}
                />

                <div className="mt-5 sm:mt-4 sm:flex sm:flex-row-reverse">
                  <Button
                    type="submit"
                    variant="primary"
                    className="w-full sm:w-auto sm:ml-3"
                    disabled={isSubmitting}
                  >
                    {isSubmitting
                      ? "Saving..."
                      : project
                      ? "Update Project"
                      : "Create Project"}
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    className="mt-3 w-full sm:mt-0 sm:w-auto"
                    onClick={onClose}
                  >
                    Cancel
                  </Button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectFormModal;
