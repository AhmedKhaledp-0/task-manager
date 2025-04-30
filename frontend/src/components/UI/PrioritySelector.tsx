import {
  faFire,
  faEquals,
  faArrowDown,
  faChevronDown,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { FC, useState, useRef, useEffect, MouseEvent } from "react";
import Spinner from "./Spinner";

export type PriorityType = "high" | "moderate" | "low";

interface PrioritySelectorProps {
  priority: PriorityType;
  className?: string;
  isUpdating?: boolean;
  onPriorityChange: (newPriority: PriorityType) => void;
}

export const PrioritySelector: FC<PrioritySelectorProps> = ({
  priority,
  className = "",
  isUpdating = false,
  onPriorityChange,
}) => {
  const [showDropdown, setShowDropdown] = useState<boolean>(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const priorityConfig = {
    high: {
      bg: "bg-red-100 dark:bg-red-900/30",
      border: "border-red-200 dark:border-red-800",
      text: "text-red-800 dark:text-red-300",
      label: "High",
      icon: <FontAwesomeIcon icon={faFire} className="mr-1.5" />,
      hoverBg: "hover:bg-red-50 dark:hover:bg-red-900/20",
    },
    moderate: {
      bg: "bg-yellow-100 dark:bg-yellow-900/30",
      border: "border-yellow-200 dark:border-yellow-800",
      text: "text-yellow-800 dark:text-yellow-300",
      label: "Medium",
      icon: <FontAwesomeIcon icon={faEquals} className="mr-1.5" />,
      hoverBg: "hover:bg-yellow-50 dark:hover:bg-yellow-900/20",
    },
    low: {
      bg: "bg-green-100 dark:bg-green-900/30",
      border: "border-green-200 dark:border-green-800",
      text: "text-green-800 dark:text-green-300",
      label: "Low",
      icon: <FontAwesomeIcon icon={faArrowDown} className="mr-1.5" />,
      hoverBg: "hover:bg-green-50 dark:hover:bg-green-900/20",
    },
  };

  const priorities: PriorityType[] = ["high", "moderate", "low"];

  const { bg, border, text, icon, label } = priorityConfig[priority];

  const handlePriorityClick = (newPriority: PriorityType) => {
    if (newPriority === priority) {
      setShowDropdown(false);
      return;
    }

    onPriorityChange(newPriority);
    setShowDropdown(false);
  };

  const toggleDropdown = (e: MouseEvent) => {
    e.stopPropagation();
    setShowDropdown((prev) => !prev);
  };

  useEffect(() => {
    const handleClickOutside = (e: globalThis.MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node)
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
          {priorities.map((priorityKey) => (
            <div
              key={priorityKey}
              className={`px-3 py-1.5 cursor-pointer ${priorityConfig[priorityKey].hoverBg} flex items-center ${priorityConfig[priorityKey].text}`}
              onClick={() => handlePriorityClick(priorityKey)}
            >
              {priorityConfig[priorityKey].icon}
              <span className="text-xs">
                {priorityConfig[priorityKey].label}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default PrioritySelector;
