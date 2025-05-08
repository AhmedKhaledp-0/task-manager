import { useState, useCallback, useMemo, useEffect, useRef } from "react";
import TaskForm from "../components/Tasks/TaskForm";
import TaskListItem from "../components/Tasks/TaskListItem";
import Spinner from "../components/UI/Spinner";
import Button from "../components/UI/Button";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faPlus,
  faSearch,
  faChevronDown,
} from "@fortawesome/free-solid-svg-icons";
import { useProject } from "../hooks/useApi";
import { Task, ProjectData } from "../types/Types";
import SearchFilters, { FilterOption } from "../components/UI/SearchFilters";
import { useProjectsData } from "../components/project/useProjectsData";

const Tasks = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(
    null
  );
  const [isProjectSelectorOpen, setIsProjectSelectorOpen] = useState(false);
  const [projectSearchTerm, setProjectSearchTerm] = useState("");

  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string | null>(null);
  const [priorityFilter, setPriorityFilter] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState<string>("deadline");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");
  const [filteredTasks, setFilteredTasks] = useState<Task[]>([]);
  const [hasActiveFilters, setHasActiveFilters] = useState(false);

  const {
    projectsToDisplay: allProjects,
    isLoading: projectsLoading,
    error: projectsError,
  } = useProjectsData(1, 100);

  const projectSelectorRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        projectSelectorRef.current &&
        !projectSelectorRef.current.contains(event.target as Node)
      ) {
        setIsProjectSelectorOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  useEffect(() => {
    if (allProjects && allProjects.length > 0 && !selectedProjectId) {
      setSelectedProjectId(allProjects[0].id);
    }
  }, [allProjects, selectedProjectId]);

  const filteredProjects = useMemo(() => {
    if (!allProjects || allProjects.length === 0) return [];

    if (!projectSearchTerm) return allProjects;

    const searchTermLower = projectSearchTerm.toLowerCase();
    return allProjects.filter(
      (project: ProjectData) =>
        project.name.toLowerCase().includes(searchTermLower) ||
        (project.description &&
          project.description.toLowerCase().includes(searchTermLower))
    );
  }, [allProjects, projectSearchTerm]);

  const {
    data: currentProject,
    isLoading: projectLoading,
    error: projectError,
  } = useProject(selectedProjectId ?? undefined, {
    enabled: !!selectedProjectId,
  });

  useEffect(() => {
    if (!currentProject || !currentProject.tasks) {
      setFilteredTasks([]);
      return;
    }

    const activeFilters =
      searchTerm !== "" ||
      statusFilter !== null ||
      priorityFilter !== null ||
      sortBy !== "deadline" ||
      sortDirection !== "asc";

    setHasActiveFilters(activeFilters);

    let result = [...currentProject.tasks];

    if (searchTerm) {
      result = result.filter(
        (task) =>
          task.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          (task.description &&
            task.description.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }

    if (statusFilter) {
      result = result.filter((task) => task.status === statusFilter);
    }

    if (priorityFilter) {
      result = result.filter((task) => task.priority === priorityFilter);
    }

    result.sort((a, b) => {
      let comparison = 0;

      switch (sortBy) {
        case "name":
          comparison = a.name.localeCompare(b.name);
          break;
        case "deadline":
          if (!a.deadline && !b.deadline) comparison = 0;
          else if (!a.deadline) comparison = 1;
          else if (!b.deadline) comparison = -1;
          else
            comparison =
              new Date(a.deadline).getTime() - new Date(b.deadline).getTime();
          break;
        case "priority":
          const priorityOrder = { high: 0, moderate: 1, low: 2 };
          comparison =
            priorityOrder[a.priority as keyof typeof priorityOrder] -
            priorityOrder[b.priority as keyof typeof priorityOrder];
          break;
        case "status": {
          const statusOrder = { todo: 0, inProgress: 1, completed: 2 };
          comparison =
            statusOrder[a.status as keyof typeof statusOrder] -
            statusOrder[b.status as keyof typeof statusOrder];
          break;
        }
        case "updatedAt":
          comparison =
            new Date(a.updatedAt).getTime() - new Date(b.updatedAt).getTime();
          break;
        default:
          comparison = 0;
      }

      return sortDirection === "asc" ? comparison : -comparison;
    });

    setFilteredTasks(result);
  }, [
    currentProject,
    searchTerm,
    statusFilter,
    priorityFilter,
    sortBy,
    sortDirection,
  ]);

  const statusOptions: FilterOption[] = useMemo(
    () => [
      { value: "todo", label: "To Do" },
      { value: "inProgress", label: "In Progress" },
      { value: "completed", label: "Completed" },
    ],
    []
  );

  const priorityOptions: FilterOption[] = useMemo(
    () => [
      { value: "high", label: "High" },
      { value: "moderate", label: "Medium" },
      { value: "low", label: "Low" },
    ],
    []
  );

  const sortOptions: FilterOption[] = useMemo(
    () => [
      { value: "deadline", label: "Deadline" },
      { value: "name", label: "Task Name" },
      { value: "priority", label: "Priority" },
      { value: "status", label: "Status" },
      { value: "updatedAt", label: "Last Updated" },
    ],
    []
  );

  const handleSearch = useCallback((term: string) => {
    setSearchTerm(term);
  }, []);

  const handleFilterChange = useCallback(
    (filterType: string, value: string | null) => {
      if (filterType === "status") {
        setStatusFilter(value);
      } else if (filterType === "priority") {
        setPriorityFilter(value);
      }
    },
    []
  );

  const handleSortChange = useCallback(
    (sort: string, direction: "asc" | "desc") => {
      setSortBy(sort);
      setSortDirection(direction);
    },
    []
  );

  const handleClearFilters = useCallback(() => {
    setSearchTerm("");
    setStatusFilter(null);
    setPriorityFilter(null);
    setSortBy("deadline");
    setSortDirection("asc");
  }, []);

  const handleSelectProject = useCallback((project: ProjectData) => {
    setSelectedProjectId(project.id);
    setIsProjectSelectorOpen(false);
    setProjectSearchTerm("");
  }, []);

  const CustomTaskListItem = () => {
    if (!currentProject) return null;

    const filteredProject = {
      ...currentProject,
      tasks: filteredTasks,
    };

    return <TaskListItem project={filteredProject} />;
  };

  const selectedProjectName = useMemo(() => {
    if (!selectedProjectId || !allProjects) return "Select a Project";
    const project = allProjects.find(
      (p: ProjectData) => p.id === selectedProjectId
    );
    return project ? project.name : "Select a Project";
  }, [selectedProjectId, allProjects]);

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
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
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

      {projectsLoading ? (
        <div className="flex justify-center py-8">
          <Spinner size="lg" />
        </div>
      ) : projectsError ? (
        <p className="text-red-500 text-center">{projectsError.message}</p>
      ) : (
        <div className="space-y-6">
          <div className="mb-6">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              Select a Project
            </h2>
            <div className="relative" ref={projectSelectorRef}>
              <button
                onClick={() => setIsProjectSelectorOpen(!isProjectSelectorOpen)}
                className="flex items-center justify-between w-full px-4 py-3 bg-white dark:bg-zinc-800 border border-gray-300 dark:border-zinc-700 rounded-lg shadow-sm text-left focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <span className="block truncate">{selectedProjectName}</span>
                <FontAwesomeIcon
                  icon={faChevronDown}
                  className={`ml-2 transition-transform duration-200 ${
                    isProjectSelectorOpen ? "transform rotate-180" : ""
                  }`}
                />
              </button>

              {isProjectSelectorOpen && (
                <div className="absolute z-10 mt-1 w-full bg-white dark:bg-zinc-800 shadow-lg max-h-96 rounded-md overflow-auto border border-gray-300 dark:border-zinc-700">
                  <div className="sticky top-0 z-10 bg-white dark:bg-zinc-800 p-2 border-b border-gray-300 dark:border-zinc-700">
                    <div className="relative">
                      <input
                        type="text"
                        placeholder="Search projects..."
                        value={projectSearchTerm}
                        onChange={(e) => setProjectSearchTerm(e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 dark:border-zinc-700 rounded-md bg-gray-50 dark:bg-zinc-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      />
                      <FontAwesomeIcon
                        icon={faSearch}
                        className="absolute right-3 top-3 text-gray-400 dark:text-gray-500"
                      />
                    </div>
                  </div>

                  {filteredProjects.length === 0 ? (
                    <div className="px-4 py-6 text-center text-gray-500 dark:text-gray-400">
                      {projectSearchTerm
                        ? "No matching projects found"
                        : "No projects available"}
                    </div>
                  ) : (
                    <ul className="py-1">
                      {filteredProjects.map((project: ProjectData) => (
                        <li
                          key={project.id}
                          onClick={() => handleSelectProject(project)}
                          className="px-4 py-3 hover:bg-gray-100 dark:hover:bg-zinc-700 cursor-pointer flex items-start"
                        >
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center">
                              <div
                                className={`w-3 h-3 rounded-full mr-2 ${
                                  project.status === "active"
                                    ? "bg-green-500"
                                    : project.status === "completed"
                                    ? "bg-blue-500"
                                    : "bg-yellow-500"
                                }`}
                              ></div>
                              <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                                {project.name}
                              </p>
                            </div>
                            {project.description && (
                              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 truncate">
                                {project.description}
                              </p>
                            )}
                          </div>
                          <div className="ml-2 flex-shrink-0">
                            <span
                              className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                                project.priority === "high"
                                  ? "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
                                  : project.priority === "moderate"
                                  ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200"
                                  : "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                              }`}
                            >
                              {project.priority === "high"
                                ? "High"
                                : project.priority === "moderate"
                                ? "Medium"
                                : "Low"}
                            </span>
                          </div>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              )}
            </div>
          </div>

          {selectedProjectId && (
            <>
              {projectLoading ? (
                <Spinner size="md" />
              ) : projectError ? (
                <p className="text-red-500">{projectError.message}</p>
              ) : currentProject ? (
                <div className="pb-4">
                  <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                    {currentProject.name}
                  </h2>

                  <SearchFilters
                    onSearch={handleSearch}
                    onFilterChange={handleFilterChange}
                    onSortChange={handleSortChange}
                    statusOptions={statusOptions}
                    priorityOptions={priorityOptions}
                    sortOptions={sortOptions}
                    showClearFilters={hasActiveFilters}
                    onClearFilters={handleClearFilters}
                  />

                  {hasActiveFilters && currentProject.tasks && (
                    <div className="mb-4 text-sm text-gray-500 dark:text-gray-400">
                      Showing {filteredTasks.length} of{" "}
                      {currentProject.tasks.length} tasks
                    </div>
                  )}

                  {hasActiveFilters &&
                    filteredTasks.length === 0 &&
                    currentProject.tasks &&
                    currentProject.tasks.length > 0 && (
                      <div className="bg-gray-50 dark:bg-zinc-800 rounded-lg p-8 text-center my-6 border border-gray-200 dark:border-zinc-700">
                        <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                          No tasks match your filters
                        </h3>
                        <p className="text-gray-500 dark:text-gray-400 mb-4">
                          Try adjusting your search criteria or clear filters
                        </p>
                        <Button variant="outline" onClick={handleClearFilters}>
                          Clear Filters
                        </Button>
                      </div>
                    )}

                  {(!hasActiveFilters ||
                    (hasActiveFilters && filteredTasks.length > 0)) && (
                    <CustomTaskListItem />
                  )}
                </div>
              ) : null}
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default Tasks;
