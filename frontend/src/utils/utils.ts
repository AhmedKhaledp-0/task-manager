export const getPriorityColor = (priority: string) => {
  switch (priority) {
    case "high":
      return "bg-red-100 text-red-800 dark:bg-red-900/30 border-red-200 dark:border-red-800 dark:text-red-300";
    case "moderate":
      return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 border-yellow-200 dark:border-yellow-800 dark:text-yellow-300";
    case "low":
      return "bg-green-100 text-green-800 border-green-200 dark:border-green-800 dark:bg-green-900/30 dark:text-green-300";
    default:
      return "bg-gray-100 text-gray-800 dark:bg-zinc-800 dark:text-zinc-300";
  }
};

export const getStatusColor = (status: string) => {
  switch (status) {
    case "completed":
      return "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300";
    case "active":
      return "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300";
    default:
      return "bg-gray-100 text-gray-800 dark:bg-zinc-800 dark:text-zinc-300";
  }
};

export const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};

export const getTaskStatusColor = (status: string) => {
  switch (status) {
    case "completed":
      return "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300";
    case "in-progress":
      return "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300";
    case "todo":
      return "bg-gray-100 text-gray-800 dark:bg-zinc-800 dark:text-zinc-300";
    default:
      return "bg-gray-100 text-gray-800 dark:bg-zinc-800 dark:text-zinc-300";
  }
};
