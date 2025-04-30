import {
  faCircleCheck,
  faClock,
  faSpinner,
  faChevronDown,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { FC, useState, useRef, useEffect, MouseEvent } from "react";
import Spinner from "./Spinner";

export type StatusType = "inProgress" | "completed" | "todo";

interface StatusSelectorProps {
  status: StatusType;
  className?: string;
  isUpdating?: boolean;
  onStatusChange: (newStatus: StatusType) => void;
}

export const StatusSelector: FC<StatusSelectorProps> = ({
  status,
  className = "",
  isUpdating = false,
  onStatusChange,
}) => {
  const [showDropdown, setShowDropdown] = useState<boolean>(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const statusConfig = {
    inProgress: {
      bg: "bg-yellow-100 dark:bg-yellow-900/30",
      border: "border-yellow-200 dark:border-yellow-800",
      text: "text-yellow-800 dark:text-yellow-300",
      label: "In Progress",
      icon: <FontAwesomeIcon icon={faClock} className="mr-1.5" />,
      hoverBg: "hover:bg-yellow-50 dark:hover:bg-yellow-900/20",
    },
    completed: {
      bg: "bg-green-100 dark:bg-green-900/30",
      border: "border-green-200 dark:border-green-800",
      text: "text-green-800 dark:text-green-300",
      label: "Completed",
      icon: <FontAwesomeIcon icon={faCircleCheck} className="mr-1.5" />,
      hoverBg: "hover:bg-green-50 dark:hover:bg-green-900/20",
    },
    todo: {
      bg: "bg-blue-100 dark:bg-blue-900/30",
      border: "border-blue-200 dark:border-blue-800",
      text: "text-blue-800 dark:text-blue-300",
      label: "To Do",
      icon: <FontAwesomeIcon icon={faSpinner} className="mr-1.5" />,
      hoverBg: "hover:bg-blue-50 dark:hover:bg-blue-900/20",
    },
  };

  const statuses: StatusType[] = ["todo", "inProgress", "completed"];

  const { bg, border, text, icon, label } = statusConfig[status];

  const handleStatusClick = (newStatus: StatusType) => {
    if (newStatus === status) {
      setShowDropdown(false);
      return;
    }

    onStatusChange(newStatus);
    setShowDropdown(false);
  };

  const toggleDropdown = (e: MouseEvent) => {
    e.stopPropagation();
    setShowDropdown((prev) => !prev);
  };

  useEffect(() => {
    const handleClickOutside = (event: globalThis.MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setShowDropdown(false);
      }
    };

    if (showDropdown) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showDropdown]);

  if (isUpdating) {
    return (
      <div className="w-8 flex items-center justify-center">
        <Spinner size="sm" />
      </div>
    );
  }

  return (
    <div
      className="relative"
      onClick={(e) => e.stopPropagation()}
      ref={dropdownRef}
    >
      <button
        onClick={toggleDropdown}
        className={`flex items-center px-2.5 py-1 rounded-full text-xs font-medium border relative
          ${bg} ${border} ${text} ${className}`}
      >
        {icon}
        {label}
        <FontAwesomeIcon icon={faChevronDown} className="ml-1.5" />
      </button>

      {showDropdown && (
        <div className="absolute right-0 mt-1 w-36 bg-white dark:bg-zinc-800 rounded-md shadow-lg z-10 border border-gray-200 dark:border-zinc-700 py-1">
          {statuses.map((statusKey) => (
            <div
              key={statusKey}
              className={`px-3 py-1.5 cursor-pointer ${statusConfig[statusKey].hoverBg} flex items-center ${statusConfig[statusKey].text}`}
              onClick={() => handleStatusClick(statusKey)}
            >
              {statusConfig[statusKey].icon}
              <span className="text-xs">{statusConfig[statusKey].label}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default StatusSelector;
