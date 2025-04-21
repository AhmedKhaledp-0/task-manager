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
    case "inProgress":
      return "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300";
    case "todo":
      return "bg-gray-100 text-gray-800 dark:bg-zinc-800 dark:text-zinc-300";
    default:
      return "bg-gray-100 text-gray-800 dark:bg-zinc-800 dark:text-zinc-300";
  }
};

export const getProjectStats = (insights: any) => {
  if (!insights)
    return { totalProjects: 0, completed: 0, active: 0, highPriority: 0 };

  const projectsGeneral = insights.projects.general;
  type StatusItem = { status: string; _count: number };
  type PriorityItem = { priority: string; _count: number };

  const statuesCount = Object.values(projectsGeneral.status) as StatusItem[];

  const activeCount =
    statuesCount.filter((item) => item.status === "active")[0]?._count || 0;

  const completedCount =
    statuesCount.filter((item) => item.status === "completed")[0]?._count || 0;

  const priorityCount = Object.values(
    projectsGeneral.priority
  ) as PriorityItem[];
  const highPriorityCount =
    priorityCount.filter((item) => item.priority === "high")[0]?._count || 0;

  return {
    totalProjects: projectsGeneral.total || 0,
    completed: completedCount,
    active: activeCount,
    highPriority: highPriorityCount,
  };
};

export const getTaskStats = (insights: any) => {
  if (!insights)
    return {
      total: 0,
      completed: 0,
      inProgress: 0,
      todo: 0,
      highPriority: 0,
    };

  const tasksGeneral = insights.tasks.general;
  type StatusItem = { status: string; _count: number };
  type PriorityItem = { priority: string; _count: number };
  const statuesCount = Object.values(tasksGeneral.status) as StatusItem[];
  const priorityCount = Object.values(tasksGeneral.priority) as PriorityItem[];

  const totalCount = tasksGeneral.total || 0;

  const completedCount =
    statuesCount.filter((item) => item.status === "completed")[0]?._count || 0;
  const inProgressCount =
    statuesCount.filter((item) => item.status === "inProgress")[0]?._count || 0;
  const todoCount =
    statuesCount.filter((item) => item.status === "todo")[0]?._count || 0;

  const highPriorityCount =
    priorityCount.filter((item) => item.priority === "high")[0]?._count || 0;

  return {
    total: totalCount || 0,
    completed: completedCount,
    inProgress: inProgressCount,
    todo: todoCount,
    highPriority: highPriorityCount,
  };
};
