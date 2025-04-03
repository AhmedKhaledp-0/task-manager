import { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import { fetchProjects, fetchProjectById } from "../store/slices/projectSlice";
import TaskForm from "../components/TaskForm";
import TaskListItem from "../components/TaskListItem";
import Spinner from "../components/Spinner";
import Button from "../components/Button";
import ProjectDropdown from "../components/ProjectDropdown";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus } from "@fortawesome/free-solid-svg-icons";

const Tasks = () => {
  const dispatch = useAppDispatch();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { projects, loading, error } = useAppSelector(
    (state) => state.projects
  );
  const { currentProject } = useAppSelector((state) => state.projects);
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(
    null
  );

  useEffect(() => {
    dispatch(fetchProjects()); // Fetch all projects
  }, [dispatch]);

  useEffect(() => {
    if (selectedProjectId) {
      dispatch(fetchProjectById(selectedProjectId)); // Fetch project details when selected
    }
  }, [dispatch, selectedProjectId]);

  return (
    <div className="max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          Tasks
        </h1>
        <Button variant="primary" onClick={() => setIsModalOpen(true)}>
          <FontAwesomeIcon icon={faPlus} className="mr-2" />
          Add Task
        </Button>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
          <div className="bg-white dark:bg-zinc-800 p-6 rounded-lg shadow-lg w-[600px] max-w-full h-auto max-h-[90vh] relative overflow-y-auto">
            <div className="mb-4">
              <h2 className="font-bold text-2xl">Create New Task</h2>
              <button
                onClick={() => setIsModalOpen(false)}
                className="absolute top-4 right-4 text-gray-600 dark:text-gray-300 hover:text-red-500 text-xl"
              >
                ✕
              </button>
            </div>
            <TaskForm />
          </div>
        </div>
      )}

      {loading ? (
        <div className="flex justify-center py-8">
          <Spinner size="lg" />
        </div>
      ) : error ? (
        <p className="text-red-500 text-center">{error}</p>
      ) : (
        <div className="space-y-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
              Select a Project
            </h2>
            <ProjectDropdown
              projects={projects}
              setSelectedProjectId={setSelectedProjectId}
            />
          </div>

          {selectedProjectId && currentProject && (
            <div className="pb-4">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                {currentProject.name}
              </h2>
              <TaskListItem project={currentProject} onTaskClick={() => {}} />
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Tasks;
