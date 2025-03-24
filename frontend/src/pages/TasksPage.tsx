import { useState } from "react";
import Navbar from "../components/Navbar";
import TaskForm from "../components/TaskForm";
import TaskList from "../components/ProjectList";

const TasksPage = () => {
  const [refreshTaskList, setRefreshTaskList] = useState(0);

  const handleTaskCreated = () => {
    setRefreshTaskList((prev) => prev + 1);
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />

      <div className="container mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold mb-6">Tasks Management</h1>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="md:col-span-1">
            <TaskForm onTaskCreated={handleTaskCreated} />
          </div>

          <div className="md:col-span-2">
            <TaskList refreshTrigger={refreshTaskList} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default TasksPage;
