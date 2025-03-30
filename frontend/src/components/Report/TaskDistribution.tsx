import { Pie } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { useAppSelector } from "../../store/store";
import { selectAllProjects } from "../../store/selectors";
import { getTaskStats } from "../ProjectTaskStates";

ChartJS.register(ArcElement, Tooltip, Legend);

const TaskDistribution = () => {
  const projects = useAppSelector(selectAllProjects);
  const taskStats = getTaskStats(projects);

  const data = {
    labels: ["Completed", "In Progress", "To Do", "High Priority"],
    datasets: [
      {
        data: [
          taskStats.completedTasks,
          taskStats.inProgressTasks,
          taskStats.todoTasks,
          taskStats.highPriorityTasks,
        ],
        backgroundColor: ["#4CAF50", "#2196F3", "#BDBDBD", "#F44336"],
      },
    ],
  };

  return (
    <div className="bg-white dark:bg-zinc-800 p-4 rounded-lg shadow">
      <h2 className="text-lg font-semibold mb-2">Task Distribution</h2>
      <Pie data={data} />
    </div>
  );
};

export default TaskDistribution;
