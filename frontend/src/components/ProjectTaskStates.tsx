interface Project {
  name?: string;
  status: string;
  priority: string;
  tasks?: Task[];
  deadline?: string;
}

interface Task {
  status: string;
  priority: string;
}

export const getProjectStats = (projects: Project[]=[]) => {
  if (!Array.isArray(projects)) {
    console.error("Invalid data type for projects:", projects);
    return {
      completed: 0,
      active: 0,
      highPriority: 0,
      total: 0,
    };
  }
  const completed = projects.filter((p) => p.status === "completed").length;
  const active = projects.filter((p) => p.status === "active").length;
  const highPriority = projects.filter((p) => p.priority === "high").length;

  return {
    completed,
    active,
    highPriority,
    total: projects.length,
  };
};

export const getTaskStats = (projects: Project[]=[]) => {
  if (!Array.isArray(projects)) {
    console.error("Invalid data type for projects:", projects);
    return {
      completed: 0,
      inProgress: 0,
      todo: 0,
      highPriority: 0,
      total: 0,
    };
  }
  const allTasks = projects.flatMap((p) => p.tasks || []);
  const completedTasks = allTasks.filter((t) => t.status === "completed").length;
  const inProgressTasks = allTasks.filter((t) => t.status === "in-progress").length;
  const todoTasks = allTasks.filter((t) => t.status === "todo").length;
  const highPriorityTasks = allTasks.filter((t) => t.priority === "high").length;

  return {
    completed: completedTasks,
    inProgress: inProgressTasks,
    todo: todoTasks,
    highPriority: highPriorityTasks,
    total: allTasks.length,
  };
};

export const getUpcomingDeadlines = (projects: Project[]=[]) => {
  if (!Array.isArray(projects)) {
    console.error("Invalid data type for projects:", projects);
    return [];
  }
  return projects
    .filter((project) => {
      if (!project.deadline) return false;
      const deadline = new Date(project.deadline);
      return deadline > new Date();
    })
    .sort((a, b) => new Date(a.deadline!).getTime() - new Date(b.deadline!).getTime())
    .slice(0, 5);
};
