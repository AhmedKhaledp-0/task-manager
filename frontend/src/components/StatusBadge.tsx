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
      bg: "bg-warning-50",
      border: "border-warning-200",
      text: "text-warning-700",
      label: "inProgress",
      icon: <FontAwesomeIcon icon={faClock} className="mr-1.5" />,
    },
    done: {
      bg: "bg-success-50",
      border: "border-success-200",
      text: "text-success-700",
      label: "done",
      icon: <FontAwesomeIcon icon={faCircleCheck} className="mr-1.5" />,
    },
    toDo: {
      bg: "bg-neutral-50",
      border: "border-neutral-200",
      text: "text-neutral-700",
      label: "To DO",
      icon: <FontAwesomeIcon icon={faSpinner} className="mr-1.5" />,
    },
  };

  const { bg, border, text, icon, label } = statusConfig[status];

  return (
    <span
      className={`inline-flex items-center px-4 py-2 rounded-full text-sm font-medium ${bg} ${border} ${text} border ${className}`}
    >
      {icon}
      {label}
    </span>
  );
};

export default StatusBadge;
