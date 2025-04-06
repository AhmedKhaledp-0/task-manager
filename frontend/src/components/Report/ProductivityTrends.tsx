import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend,
} from "chart.js";
import { useMemo } from "react";
import { useAppSelector } from "../../store/store";
import { selectAllProjects } from "../../store/selectors";
import { getTaskStats } from "../ProjectTaskStates";

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Tooltip, Legend);

const ProductivityTrends = () => {
  const projects = useAppSelector(selectAllProjects);

  const { completed, inProgress, todo } = useMemo(() => getTaskStats(projects ), [projects]);

  const formatMonthlyStats = (tasksCount: number) =>
    Array(12)
      .fill(0)
      .map((_, i) => (i < new Date().getMonth() + 1 ? tasksCount : 0));

  const data = {
    labels: [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ],
    datasets: [
      {
        label: "Completed Tasks",
        data: formatMonthlyStats(completed),
        backgroundColor: "#1b9b48",
        borderColor: "#4ADE80",
        fill: true,
      },
      {
        label: "In Progress Tasks",
        data: formatMonthlyStats(inProgress),
        backgroundColor: "#1a5fb2",
        borderColor: "#5C9EF4",
        fill: true,
      },
      {
        label: "TO DO Tasks",
        data: formatMonthlyStats(todo),
        backgroundColor: "#c9a112",
        borderColor: "#F4C715",
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
