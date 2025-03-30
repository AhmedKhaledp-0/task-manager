export const getProjectStats = (projects) => {
    const totalProjects = projects.length;
    const completed = projects.filter((p) => p.status === "completed").length;
    const active = projects.filter((p) => p.status === "active").length;
    const highPriority = projects.filter((p) => p.priority === "high").length;
  
    return { totalProjects, completed, active, highPriority };
  };
  
  export const getTaskStats = (projects) => {
    const allTasks = projects.flatMap((p) => p.tasks || []);
    const totalTasks = allTasks.length;
    const completedTasks = allTasks.filter((t) => t.status === "completed").length;
    const inProgressTasks = allTasks.filter((t) => t.status === "in-progress").length;
    const todoTasks = allTasks.filter((t) => t.status === "todo").length;
    const highPriorityTasks = allTasks.filter((t) => t.priority === "high").length;
  
    return {
      totalTasks,
      completedTasks,
      inProgressTasks,
      todoTasks,
      highPriorityTasks,
    };
  };
  
  export const getUpcomingDeadlines = (projects) => {
    const now = new Date();
    const sevenDaysLater = new Date();
    sevenDaysLater.setDate(now.getDate() + 7);
  
    return projects
      .filter((project) => {
        const deadline = new Date(project.deadline);
        return deadline >= now && deadline <= sevenDaysLater && project.status === "active";
      })
      .sort((a, b) => new Date(a.deadline).getTime() - new Date(b.deadline).getTime())
      .slice(0, 3);
  };