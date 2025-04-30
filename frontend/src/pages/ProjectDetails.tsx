import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ProjectFormData, Task } from "../types/Types";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft, faPlus } from "@fortawesome/free-solid-svg-icons";
import Button from "../components/UI/Button";
import ProjectFormModal from "../components/project/ProjectFormModal";
import CreateTaskModal from "../components/Tasks/CreateTaskModal";
import TaskListItem from "../components/Tasks/TaskListItem";
import Spinner from "../components/UI/Spinner";
import ProjectHeader from "../components/project/ProjectHeader";
import {
  useUpdateProject,
  useDeleteProject,
  useProject,
} from "../hooks/useApi";
import { useQueryClient } from "@tanstack/react-query";
import TaskModal from "../components/Tasks/TaskModal";

const ProjectDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const [isCreateTaskModalOpen, setIsCreateTaskModalOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const queryClient = useQueryClient();

  const { data: project, isLoading, error } = useProject(id);
  const deleteProjectMutation = useDeleteProject();
  const updateProjectMutation = useUpdateProject();

  const handleDelete = () => {
    if (!id || !window.confirm("Are you sure you want to delete this project?"))
      return;
    deleteProjectMutation.mutate(id);
  };

  const handleEdit = (data: ProjectFormData) => {
    if (!id) return;
    updateProjectMutation.mutate({ id, data });
  };

  const handleTaskClick = (task: Task) => {
    setSelectedTask(task);
    setIsTaskModalOpen(true);
  };

  const handleTaskUpdated = (updatedTask?: Task) => {
    if (!project || !project.tasks) return;

    if (updatedTask) {
      const updatedTasks = project.tasks.map((task: Task) =>
        task.id === updatedTask.id ? updatedTask : task
      );

      queryClient.setQueryData(["project", id], {
        ...project,
        tasks: updatedTasks,
      });
    }
  };

  const handleTaskCreated = (task: Task) => {
    if (!project || !project.tasks) return;

    queryClient.setQueryData(["project", id], {
      ...project,
      tasks: [...project.tasks, task],
    });
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[200px]">
        <Spinner size="lg" />
      </div>
    );
  }

  if (error || !project) {
    return (
      <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-300 px-4 py-3 rounded-lg">
        {error?.message || "Project not found"}
      </div>
    );
  }

  return (
    <>
      <div className="mb-6">
        <div className="flex justify-between items-center mb-4">
          <Button variant="ghost" onClick={() => navigate(-1)}>
            <FontAwesomeIcon icon={faArrowLeft} className="mr-2" />
            Back to Projects
          </Button>
        </div>
        <ProjectHeader
          project={project}
          setIsEditModalOpen={setIsEditModalOpen}
          handleDelete={handleDelete}
        />

        <div className="bg-white dark:bg-zinc-800 rounded-xl shadow-sm border border-gray-200 dark:border-zinc-700 overflow-hidden">
          <div className="p-6">
            {project?.description && (
              <div className="prose dark:prose-invert max-w-none mb-6">
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                  Description
                </h2>
                <p className="text-gray-600 dark:text-zinc-400 whitespace-pre-wrap">
                  {project.description}
                </p>
              </div>
            )}

            <div className="border-t border-gray-200 dark:border-zinc-700 pt-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                  Tasks
                </h2>
                <Button
                  size="sm"
                  onClick={() => setIsCreateTaskModalOpen(true)}
                >
                  <FontAwesomeIcon icon={faPlus} className="mr-2" />
                  Add Task
                </Button>
              </div>

              {project && (
                <TaskListItem
                  project={project}
                  onTaskClick={handleTaskClick}
                  loading={isLoading}
                />
              )}
            </div>
          </div>
        </div>
      </div>

      {project && (
        <ProjectFormModal
          isOpen={isEditModalOpen}
          onClose={() => setIsEditModalOpen(false)}
          onSubmit={handleEdit}
          project={{
            name: project.name,
            description: project.description || "",
            status: project.status,
            priority: project.priority,
            deadline: new Date(project.deadline),
          }}
          title="Edit Project"
        />
      )}

      {selectedTask && id && (
        <TaskModal
          isOpen={isTaskModalOpen}
          onClose={() => {
            setIsTaskModalOpen(false);
            setSelectedTask(null);
          }}
          task={selectedTask}
          onTaskUpdated={handleTaskUpdated}
          projectId={id}
        />
      )}

      {id && (
        <CreateTaskModal
          projectId={id}
          isOpen={isCreateTaskModalOpen}
          onClose={() => setIsCreateTaskModalOpen(false)}
          onTaskCreated={handleTaskCreated}
        />
      )}
    </>
  );
};

export default ProjectDetails;
