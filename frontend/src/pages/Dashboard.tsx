import { useState } from "react";
import ProjectForm from "../components/ProjectForm";
import ProjectList from "../components/ProjectList";

const Dashboard = () => {
  const [refreshTaskList, setRefreshTaskList] = useState(0);

  const refreshList = () => {
    setRefreshTaskList((prevState) => prevState + 1);
  };

  return (
    <>
      <ProjectForm />
      <button
        onClick={refreshList}
        className="mt-4 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
      >
        Refresh List
      </button>
      <ProjectList refreshTrigger={refreshTaskList} />
    </>
  );
};

export default Dashboard;
