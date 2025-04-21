import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { statsCardsList } from "../../utils/list";
import { getProjectStats } from "../../utils/utils";

const StatsCards = ({
  stats,
}: {
  stats: ReturnType<typeof getProjectStats>;
}) => (
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-4 gap-6 mb-8">
    {statsCardsList.map((card) => (
      <div
        key={card.title}
        className="bg-white dark:bg-zinc-800 rounded-xl shadow-sm p-6 border border-gray-200 dark:border-zinc-700"
      >
        <div className="flex items-center">
          <div
            className={`p-3 flex justify-center items-center rounded-full bg-${card.color}-100 dark:bg-${card.color}-900/30 text-${card.color}-600 dark:text-${card.color}-400 mr-4`}
          >
            <FontAwesomeIcon icon={card.icon} className="h-5 w-5" />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
              {card.title}
            </p>
            <p className="text-2xl font-semibold text-gray-900 dark:text-white">
              {card.title === "Total Projects"
                ? stats.totalProjects
                : card.title === "Completed"
                ? stats.completed
                : card.title === "Active Projects"
                ? stats.active
                : stats.highPriority}
            </p>
          </div>
        </div>
      </div>
    ))}
  </div>
);

export default StatsCards;
