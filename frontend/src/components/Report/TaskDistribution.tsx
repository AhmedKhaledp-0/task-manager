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
          taskStats.completed,
          taskStats.inProgress,
          taskStats.todo,
          taskStats.highPriority,
        ],
        backgroundColor: ["#4ADE80", "#5C9EF4", "#F4C715", "#F87171"],
      },
    ],
  };

  return (
    <div className="bg-white dark:bg-zinc-800 p-4 rounded-lg shadow w-full">
      <h2 className="text-lg font-semibold mb-2">Task Distribution</h2>
      <Pie data={data} />
    </div>
  );
};

export default TaskDistribution;
