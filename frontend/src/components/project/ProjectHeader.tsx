import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { ProjectData } from "../../types/Types";
import {
  faCalendar,
  faFlag,
  faListCheck,
  faPencil,
  faTrash,
} from "@fortawesome/free-solid-svg-icons";
import {
  formatDate,
  getPriorityColor,
  getStatusColor,
} from "../../utils/utils";
import Button from "../Button";

const ProjectHeader = ({
  project,
  setIsEditModalOpen,
  handleDelete,
}: {
  project: ProjectData | null;
  setIsEditModalOpen: (isOpen: boolean) => void;
  handleDelete: () => void;
}) => {
  return (
    <div className="flex flex-col md:flex-row gap-4 justify-between items-start mb-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
          {project?.name}
        </h1>
        <div className="flex flex-col md:flex-row gap-2 text-sm text-gray-500 dark:text-zinc-400">
          <div className="flex items-center">
            <FontAwesomeIcon icon={faCalendar} className="mr-2" />
            Due: {project && formatDate(project.deadline)}
          </div>
          <div className="flex items-center">
            <FontAwesomeIcon icon={faFlag} className="mr-2" />
            <span
              className={`px-2.5 py-1 text-xs font-medium rounded-full ${getPriorityColor(
                project?.priority || ""
              )}`}
            >
              {project?.priority}
            </span>
          </div>
          <div className="flex items-center">
            <FontAwesomeIcon icon={faListCheck} className="mr-2" />
            <span
              className={`px-2.5 py-1 text-xs font-medium rounded-full ${getStatusColor(
                project?.status || ""
              )}`}
            >
              {project?.status}
            </span>
          </div>
        </div>
      </div>
      <div className="flex w-full md:w-auto gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => setIsEditModalOpen(true)}
          className="flex-1 min-w-[80px]"
        >
          <FontAwesomeIcon icon={faPencil} className="mr-2" />
          Edit
        </Button>
        <Button
          variant="destructive"
          size="sm"
          onClick={handleDelete}
          className="flex-1 min-w-[80px]"
        >
          <FontAwesomeIcon icon={faTrash} className="mr-2" />
          Delete
        </Button>
      </div>
    </div>
  );
};
export default ProjectHeader;
