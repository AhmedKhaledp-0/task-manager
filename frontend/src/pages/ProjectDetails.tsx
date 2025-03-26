import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ProjectData, ProjectFormData } from "../types/Types";
import { deleteProject, getProjectById, updateProject } from "../lib/api";
import Button from "../components/Button";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faArrowLeft,
  faCalendar,
  faFlag,
  faListCheck,
  faPencil,
  faTrash,
} from "@fortawesome/free-solid-svg-icons";
import { useToast } from "../components/Toast";
import ProjectFormModal from "../components/ProjectFormModal";

const ProjectDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToast } = useToast();
  const [project, setProject] = useState<ProjectData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  useEffect(() => {
    const fetchProject = async () => {
      if (!id) return;

      try {
        setLoading(true);
        const response = await getProjectById(id);
        setProject(response.data);
        setError("");
      } catch (err: any) {
        setError(err.message || "Failed to load project details");
        addToast({
          type: "error",
          title: "Error",
          message: err.message || "Failed to load project details",
          duration: 5000,
        });
      } finally {
        setLoading(false);
      }
    };

    fetchProject();
  }, [id]);

  const handleDelete = async () => {
    if (!id || !window.confirm("Are you sure you want to delete this project?"))
      return;

    try {
      await deleteProject(id);
      addToast({
        type: "success",
        title: "Success",
        message: "Project deleted successfully",
        duration: 3000,
      });
      navigate("/projects");
    } catch (err: any) {
      setError(err.message || "Failed to delete project");
      addToast({
        type: "error",
        title: "Error",
        message: err.message || "Failed to delete project",
        duration: 5000,
      });
    }
  };

  const handleEdit = async (data: ProjectFormData) => {
    if (!id || !project) return;

    try {
      await updateProject(id, data);
      setProject({
        ...project,
        name: data.name,
        description: data.description,
        status: data.status as "active" | "complete",
        priority: data.priority as "low" | "moderate" | "high",
        deadline: data.deadline.toISOString(),
      });
      setIsEditModalOpen(false);
      addToast({
        type: "success",
        title: "Success",
        message: "Project updated successfully",
        duration: 3000,
      });
    } catch (err: any) {
      addToast({
        type: "error",
        title: "Error",
        message: err.message || "Failed to update project",
        duration: 5000,
      });
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300";
      case "moderate":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300";
      case "low":
        return "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-zinc-800 dark:text-zinc-300";
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "complete":
        return "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300";
      case "active":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-zinc-800 dark:text-zinc-300";
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[200px]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error || !project) {
    return (
      <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-300 px-4 py-3 rounded-lg">
        {error || "Project not found"}
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="mb-6">
        <div className="flex justify-between items-center mb-4">
          <Button variant="ghost" onClick={() => navigate(-1)}>
            <FontAwesomeIcon icon={faArrowLeft} className="mr-2" />
            Back to Projects
          </Button>
        </div>

        <div className="bg-white dark:bg-zinc-800 rounded-xl shadow-sm border border-gray-200 dark:border-zinc-700 overflow-hidden">
          <div className="p-6">
            <div className="flex flex-col md:flex-row gap-4 justify-between items-start mb-6">
              <div>
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                  {project?.name}
                </h1>
                <div className="flex flex-col md:flex-row    gap-2 text-sm text-gray-500 dark:text-zinc-400 ">
                  <div className="flex items-center">
                    <FontAwesomeIcon icon={faCalendar} className="mr-2" />
                    Due: {project && formatDate(project.deadline)}
                  </div>
                  <div className="flex items-center">
                    <FontAwesomeIcon icon={faFlag} className="mr-2" />
                    <span
                      className={`px-2.5 py-1 text-xs font-medium rounded-full ${getPriorityColor(
                        project?.priority || ""
                      )}`}
                    >
                      {project?.priority}
                    </span>
                  </div>
                  <div className="flex items-center">
                    <FontAwesomeIcon icon={faListCheck} className="mr-2" />
                    <span
                      className={`px-2.5 py-1 text-xs font-medium rounded-full ${getStatusColor(
                        project?.status || ""
                      )}`}
                    >
                      {project?.status}
                    </span>
                  </div>
                </div>
              </div>
              <div className="flex w-full md:w-auto gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setIsEditModalOpen(true)}
                  className="flex-1 min-w-[80px]"
                >
                  <FontAwesomeIcon icon={faPencil} className="mr-2" />
                  Edit
                </Button>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={handleDelete}
                  className="flex-1 min-w-[80px]"
                >
                  <FontAwesomeIcon icon={faTrash} className="mr-2" />
                  Delete
                </Button>
              </div>
            </div>

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
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Tasks
              </h2>
              {project?.tasks && project.tasks.length > 0 ? (
                <div className="space-y-4">
                  {project.tasks.map((task) => (
                    <div
                      key={task._id}
                      className="bg-gray-50 dark:bg-zinc-800/50 rounded-lg p-4 border border-gray-200 dark:border-zinc-700"
                    >
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="font-medium text-gray-900 dark:text-white">
                            {task.name}
                          </h3>
                          {task.description && (
                            <p className="text-sm text-gray-600 dark:text-zinc-400 mt-1">
                              {task.description}
                            </p>
                          )}
                        </div>
                        <span
                          className={`px-2.5 py-1 text-xs font-medium rounded-full ${getStatusColor(
                            task.status
                          )}`}
                        >
                          {task.status}
                        </span>
                      </div>
                      <div className="mt-3 flex items-center text-sm text-gray-500 dark:text-zinc-400">
                        <FontAwesomeIcon icon={faCalendar} className="mr-2" />
                        Due: {formatDate(task.deadline)}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500 dark:text-zinc-400 bg-gray-50 dark:bg-zinc-800/50 rounded-lg">
                  No tasks for this project yet.
                </div>
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
    </div>
  );
};

export default ProjectDetails;
