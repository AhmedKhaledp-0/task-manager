import { Line } from "react-chartjs-2";
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Tooltip, Legend } from "chart.js";
import { useAppSelector } from "../../store/store";
import { selectAllProjects } from "../../store/selectors";
import { getTaskStats } from "../ProjectTaskStates";

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Tooltip, Legend);

const ProductivityTrends = () => {
  const projects = useAppSelector(selectAllProjects);
  const taskStats = getTaskStats(projects);

  const data = {
    labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
    datasets: [
      {
        label: "Completed Tasks",
        data: taskStats.completed, // Now structured as an array per month
        backgroundColor: "rgba(100, 100, 255, 0.2)",
        borderColor: "rgba(100, 100, 255, 1)",
        fill: true,
      },
      {
        label: "In Progress Tasks",
        data: taskStats.inProgress, // Now structured as an array per month
        backgroundColor: "rgba(50, 200, 100, 0.2)",
        borderColor: "rgba(50, 200, 100, 1)",
        fill: true,
      },
    ],
  };

  return (
    <div className="bg-white dark:bg-zinc-800 text-gray-700 dark:text-gray-300 p-4 rounded-lg shadow">
      <h2 className="text-lg font-semibold mb-2">Productivity Trends</h2>
      <Line data={data} />
    </div>
  );
};

export default ProductivityTrends;
