import { useState, useEffect } from "react";

function App() {
  const [status, setStatus] = useState({
    server: false,
    database: false,
  });

  useEffect(() => {
    const checkStatus = async () => {
      try {
        const response = await fetch("http://localhost:3000/api/status");
        const data = await response.json();
        setStatus(data);
      } catch (error) {
        console.error("Error checking status:", error);
      }
    };

    checkStatus();
    const interval = setInterval(checkStatus, 5000); // Check every 5 seconds
    return () => clearInterval(interval);
  }, []);

  return (
    <main className="h-screen w-screen flex items-center justify-center bg-gray-900">
      <div className="text-center space-y-4">
        <h1 className="text-3xl font-bold text-white mb-8">
          Task Mangment Initialization Status
        </h1>
        <div className="space-y-4 p-4 m-4 text-center bg-gray-800 rounded-lg ">
          <div className="flex items-center space-x-2">
            <div
              className={`w-3 h-3 rounded-full ${
                status.server ? "bg-green-500" : "bg-red-500"
              }`}
            ></div>
            <span className="text-white">
              Backend Server: {status.server ? "Running" : "Offline"}
            </span>
          </div>
          <div className="flex items-center space-x-2">
            <div
              className={`w-3 h-3 rounded-full ${
                status.database ? "bg-green-500" : "bg-red-500"
              }`}
            ></div>
            <span className="text-white">
              Database Connection:{" "}
              {status.database ? "Connected" : "Disconnected"}
            </span>
          </div>
        </div>
      </div>
    </main>
  );
}

export default App;
