import { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import { fetchProjects, fetchProjectById } from "../store/slices/projectSlice";
import TaskForm from "../components/TaskForm";
import TaskListItem from "../components/TaskListItem";
import Spinner from "../components/Spinner";
import Button from "../components/Button";

const Tasks = () => {
  const dispatch = useAppDispatch();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { projects, loading, error } = useAppSelector((state) => state.projects);
  const { currentProject } = useAppSelector((state) => state.projects); // Get the selected project
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(null);

  useEffect(() => {
    dispatch(fetchProjects()); // Fetch all projects
  }, [dispatch]);

  useEffect(() => {
    if (selectedProjectId) {
      dispatch(fetchProjectById(selectedProjectId)); // Fetch project details when selected
    }
  }, [dispatch, selectedProjectId]);

  return (
    <div>
      <div className="flex flex-row items-center justify-between mb-4">
        <h1 className="text-3xl font-semibold text-gray-800 dark:text-gray-100 mb-4">
          Tasks
        </h1>
        <Button
          onClick={() => setIsModalOpen(true)}
          className=""
        >
          + Add Task
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
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
            Select a Project
          </h2>
          <select
            className="p-2 border border-gray-500 rounded-md text-black dark:text-white bg-transparent focus:outline-none focus:ring-2 focus:ring-gray-400 transition"
            onChange={(e) => setSelectedProjectId(e.target.value)}
          >
            <option value="" className="text-gray-700 dark:text-gray-300 dark:bg-gray-800">
              Select a Project
            </option>
            {projects.map((project) => (
              <option key={project._id} value={project._id} className="bg-white dark:bg-gray-800">
                {project.name}
              </option>
            ))}
          </select>


          {selectedProjectId && currentProject && (
            <div className="border-b pb-4">
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
