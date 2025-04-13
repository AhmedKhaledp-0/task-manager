import { useState } from "react";
import { ProjectData } from "../types/Types";

interface ProjectDropdownProps {
  projects: ProjectData[];
  setSelectedProjectId: (id: string) => void;
}

const ProjectDropdown = ({
  projects,
  setSelectedProjectId,
}: ProjectDropdownProps) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative inline-block text-left">
      {/* Dropdown Button */}
      <button
        className="flex items-center justify-between w-64 px-4 py-2 border border-gray-700 
                   rounded-lg text-black dark:text-white bg-gray-100 dark:bg-gray-900 
                   hover:bg-gray-200 dark:hover:bg-gray-800 transition 
                   focus:ring-2 focus:ring-gray-700 shadow-md"
        onClick={() => setIsOpen(!isOpen)}
      >
        Select a Project
        <span className="ml-2">▼</span> {/* Downward arrow */}
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div
          className="absolute left-0 mt-2 w-64 bg-white dark:bg-gray-800 border border-gray-700 
                     rounded-lg shadow-lg transition-opacity opacity-100 scale-100 
                     transform origin-top duration-200 z-50"
        >
          {projects.map((project) => (
            <div
              key={project.id}
              className="flex items-center px-4 py-3 hover:bg-gray-100 dark:hover:bg-gray-700 
                         transition cursor-pointer"
              onClick={() => {
                setSelectedProjectId(project.id);
                setIsOpen(false);
              }}
            >
              <span className="mr-2 text-gray-500 dark:text-gray-300">📂</span>
              {project.name}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ProjectDropdown;
