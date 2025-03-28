import TaskForm from "../components/TaskForm";

const Tasks = () => {
  return (
    <div>
      <h1 className="text-3xl font-semibold text-gray-800 dark:text-gray-100">
        Tasks
        <TaskForm />
      </h1>
    </div>
  );
};

export default Tasks;
