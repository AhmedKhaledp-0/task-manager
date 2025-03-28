import {
  faCircleCheck,
  faClock,
  faSpinner,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { FC } from "react";

type StatusType = "inProgress" | "done" | "toDo";

interface StatusBadgeProps {
  status: StatusType;
  className?: string;
}

export const StatusBadge: FC<StatusBadgeProps> = ({
  status,
  className = "",
}) => {
  // Configuration for each status type
  const statusConfig = {
    inProgress: {
      bg: "bg-yellow-100 dark:bg-yellow-900/30",
      border: "border-yellow-200 dark:border-yellow-800",
      text: "text-yellow-800 dark:text-yellow-300",
      label: "In Progress",
      icon: <FontAwesomeIcon icon={faClock} className="mr-1.5" />,
    },
    done: {
      bg: "bg-green-100 dark:bg-green-900/30",
      border: "border-green-200 dark:border-green-800",
      text: "text-green-800 dark:text-green-300",
      label: "Completed",
      icon: <FontAwesomeIcon icon={faCircleCheck} className="mr-1.5" />,
    },
    toDo: {
      bg: "bg-blue-100 dark:bg-blue-900/30",
      border: "border-blue-200 dark:border-blue-800",
      text: "text-blue-800 dark:text-blue-300",
      label: "To Do",
      icon: <FontAwesomeIcon icon={faSpinner} className="mr-1.5" />,
    },
  };

  const { bg, border, text, icon, label } = statusConfig[status];

  return (
    <span
      className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${bg} ${border} ${text} border ${className}`}
    >
      {icon}
      {label}
    </span>
  );
};

export default StatusBadge;
