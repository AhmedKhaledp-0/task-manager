import { useAppSelector } from "../../store/store";
import { selectAllProjects } from "../../store/selectors";

const ProjectProgress = () => {
  const projects = useAppSelector(selectAllProjects);

  console.log("Projects:", projects); // Check what projects contain

  return (
    <div className="bg-white dark:bg-zinc-800 p-4 rounded-lg shadow">
      <h2 className="text-lg font-semibold mb-4">Project Progress</h2>
      <div className="space-y-4">
        {projects?.length > 0 ? (
          projects.map((project, index) => {
            console.log("Project:", project); // Log each project

            const completedTasks = project.tasks?.filter(task => task.status === "completed").length || 0;
            const totalTasks = project.tasks?.length || 1; // Avoid division by zero
            const progress = (completedTasks / totalTasks) * 100;

            return (
              <div key={index}>
                <p className="text-sm font-medium">{project.name}</p>
                <div className="w-full bg-gray-200 rounded-full h-3 dark:bg-gray-700">
                  <div
                    className="bg-blue-500 h-3 rounded-full transition-all"
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
