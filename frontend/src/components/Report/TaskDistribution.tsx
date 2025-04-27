import { Pie } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { useAppSelector } from "../../store/store";
import { selectAllProjects } from "../../store/selectors";
import { getTaskStats } from "../ProjectTaskStates";

ChartJS.register(ArcElement, Tooltip, Legend);

const TaskDistribution = () => {
  const projects = useAppSelector(selectAllProjects);
  const { completed, inProgress, todo, highPriority } = getTaskStats(projects);

  const data = {
    labels: ["Completed", "In Progress", "To Do", "High Priority"],
    datasets: [
      {
        data: [completed, inProgress, todo, highPriority],
        backgroundColor: ["#4ADE80", "#5C9EF4", "#F4C715", "#F87171"],
        borderWidth: 1,
      },
    ],
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md dark:bg-zinc-800 w-full md:max-w-md">
      <h2 className="text-lg font-semibold mb-4">Task Distribution</h2>
      <ResponsiveContainer width="100%" height={250}>
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={0}
            outerRadius={100}
            paddingAngle={0}
            dataKey="value"
          >
            {data.map((_entry, index) => (
              <Cell
                key={`cell-${index}`}
                fill={COLORS[index % COLORS.length]}
              />
            ))}
          </Pie>
          <Tooltip />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};

export default TaskDistribution;
