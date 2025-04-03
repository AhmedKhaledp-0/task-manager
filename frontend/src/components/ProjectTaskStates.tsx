interface Project {
  status: string;
  priority: string;
  tasks?: Task[];
  deadline?: string;
}

interface Task {
  status: string;
  priority: string;
}

export const getProjectStats = (projects: Project[]) => {
  const completed = projects.filter((p: Project) => p.status === "completed").length;
  const active = projects.filter((p: Project) => p.status === "active").length;
  const highPriority = projects.filter((p: Project) => p.priority === "high").length;

  return {
    completed,
    active,
    highPriority,
    total: projects.length,
  };
};

export const getTaskStats = (projects: Project[]) => {
  const allTasks = projects.flatMap((p: Project) => p.tasks || []);
  const completedTasks = allTasks.filter((t: Task) => t.status === "completed").length;
  const inProgressTasks = allTasks.filter((t: Task) => t.status === "in-progress").length;
  const todoTasks = allTasks.filter((t: Task) => t.status === "todo").length;
  const highPriorityTasks = allTasks.filter((t: Task) => t.priority === "high").length;

  return {
    completed: completedTasks,
    inProgress: inProgressTasks,
    todo: todoTasks,
    highPriority: highPriorityTasks,
    total: allTasks.length,
  };
};

export const getUpcomingDeadlines = (projects: Project[]) => {
  return projects
    .filter((project: Project) => {
      if (!project.deadline) return false;
      const deadline = new Date(project.deadline);
      return deadline > new Date();
    })
    .sort((a: Project, b: Project) => 
      new Date(a.deadline!).getTime() - new Date(b.deadline!).getTime()
    )
    .slice(0, 5);
};