import { useAppSelector } from "../../store/store";
import { selectAllProjects } from "../../store/selectors";

const ProjectProgress = () => {
  const projects = useAppSelector(selectAllProjects);

  return (
    <div className="bg-white dark:bg-zinc-800 p-4 rounded-lg shadow">
      <h2 className="text-lg font-semibold mb-4">Project Progress</h2>
      <div className="space-y-4">
        {projects?.length > 0 ? (
          projects.map((project, index) => {
            const totalTasks = project.tasks?.length || 0;
            const completedTasks = project.tasks?.filter(
              (task) => task.status === "completed"
            ).length || 0;

            const progress = totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0;

            return (
              <div key={index}>
                <p className="text-sm font-medium">{project.name ?? `Project ${index + 1}`}</p>
                <div className="w-full bg-gray-200 rounded-full h-3 dark:bg-gray-700">
                  <div
                    className="bg-blue-500 h-3 rounded-full transition-all duration-300"
                    style={{ width: `${progress}%` }}
                  ></div>
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  {completedTasks} / {totalTasks} tasks completed
                </p>
              </div>
            );
          })
        ) : (
          <p>No projects available</p>
        )}
      </div>
    </div>
  );
};

export default ProjectProgress;
