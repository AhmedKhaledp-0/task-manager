import {
  faCircleCheck,
  faCircleXmark,
  faInfoCircle,
  faWarning,
  faXmark,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import type React from "react";
import {
  useState,
  useEffect,
  createContext,
  useContext,
  FC,
  ReactNode,
} from "react";
import { ToastPosition, ToastProps } from "../../types/Types";

export const Toast: React.FC<ToastProps> = ({
  type = "info",
  title,
  message,
  duration = 5000,
  onClose,
  position = "top-center",
  showIcon = true,
  showCloseButton = true,
  className = "",
}) => {
  const [isVisible, setIsVisible] = useState(true);
  const [isLeaving, setIsLeaving] = useState(false);

  useEffect(() => {
    if (duration > 0) {
      const timer = setTimeout(() => {
        handleClose();
      }, duration);

      return () => clearTimeout(timer);
    }
  }, [duration]);

  const handleClose = () => {
    setIsLeaving(true);
    setTimeout(() => {
      setIsVisible(false);
      if (onClose) onClose();
    }, 300); // Animation duration
  };

  if (!isVisible) return null;

  // Configuration for each toast type with dark mode support
  const typeConfig = {
    info: {
      bg: "bg-white dark:bg-neutral-800",
      border: "border-l-4 border-primary-500 dark:border-primary-400",
      icon: (
        <FontAwesomeIcon
          icon={faInfoCircle}
          className="text-lg text-primary-500 dark:text-primary-400"
        />
      ),
      iconBg: "bg-primary-100 dark:bg-primary-900",
    },
    success: {
      bg: "bg-white dark:bg-neutral-800",
      border: "border-l-4 border-success-500 dark:border-success-400",
      icon: (
        <FontAwesomeIcon
          icon={faCircleCheck}
          className="text-lg text-success-500 dark:text-success-400"
        />
      ),
      iconBg: "bg-success-100 dark:bg-success-900",
    },
    warning: {
      bg: "bg-white dark:bg-neutral-800",
      border: "border-l-4 border-warning-500 dark:border-warning-400",
      icon: (
        <FontAwesomeIcon
          icon={faWarning}
          className="text-lg text-warning-500 dark:text-warning-400"
        />
      ),
      iconBg: "bg-warning-100 dark:bg-warning-900",
    },
    error: {
      bg: "bg-white dark:bg-neutral-800",
      border: "border-l-4 border-danger-500 dark:border-danger-400",
      icon: (
        <FontAwesomeIcon
          icon={faCircleXmark}
          className="text-lg text-danger-500 dark:text-danger-400"
        />
      ),
      iconBg: "bg-danger-100 dark:bg-danger-900",
    },
  };

  const { bg, border, icon, iconBg } = typeConfig[type];

  // Helper function to get position classes
  const getPositionClasses = (pos: ToastPosition): string => {
    switch (pos) {
      case "top-right":
        return "top-4 right-4";
      case "top-left":
        return "top-4 left-4";
      case "bottom-right":
        return "bottom-4 right-4";
      case "bottom-left":
        return "bottom-4 left-4";
      case "top-center":
        return "top-4 left-1/2 transform -translate-x-1/2";
      case "bottom-center":
        return "bottom-4 left-1/2 transform -translate-x-1/2";
      default:
        return "top-4 right-4";
    }
  };

  return (
    <div
      className={`
        fixed 
        ${getPositionClasses(position)} 
        max-w-sm 
        w-full 
        shadow-lg
        rounded-lg 
        overflow-hidden 
        ${bg}
        ${border}
        p-4 
        transition-all 
        duration-300 
        z-50
        backdrop-blur-sm
        backdrop-filter
        ${isLeaving ? "opacity-0 transform translate-y-2" : "opacity-100"} 
        ${className}
      `}
      role="alert"
    >
      <div className="flex items-start">
        {showIcon && (
          <div
            className={`flex-shrink-0 mr-3 rounded-full p-2 ${iconBg} flex items-center justify-center`}
          >
            {icon}
          </div>
        )}
        <div className="flex-1 pt-0.5">
          {title && (
            <div className="mb-1 font-semibold text-neutral-900 dark:text-white">
              {title}
            </div>
          )}
          <div className="text-sm text-neutral-800 dark:text-neutral-200">
            {message}
          </div>
        </div>
        {showCloseButton && (
          <button
            type="button"
            className="ml-4 transition-colors duration-200 text-neutral-500 hover:text-neutral-700 dark:text-neutral-400 dark:hover:text-neutral-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-neutral-500 dark:focus:ring-neutral-400"
            onClick={handleClose}
            aria-label="Close"
          >
            <FontAwesomeIcon icon={faXmark} />
          </button>
        )}
      </div>
    </div>
  );
};

interface ToastContextType {
  addToast: (toast: Omit<ToastProps, "onClose">) => string;
  removeToast: (id: string) => void;
}

export const ToastContext = createContext<ToastContextType | undefined>(
  undefined
);

interface Toast extends ToastProps {
  id: string;
}

export const ToastProvider: FC<{ children: ReactNode }> = ({ children }) => {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const addToast = (toast: Omit<ToastProps, "onClose">): string => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts((prevToasts) => [
      ...prevToasts,
      { ...toast, id, onClose: () => removeToast(id) },
    ]);
    return id;
  };

  const removeToast = (id: string) => {
    setToasts((prevToasts) => prevToasts.filter((toast) => toast.id !== id));
  };

  return (
    <ToastContext.Provider value={{ addToast, removeToast }}>
      {children}

      <div className="toast-container">
        {toasts.map((toast, index) => (
          <Toast
            key={toast.id}
            {...toast}
            className={`toast-item ${index > 0 ? "mt-3" : ""}`}
          />
        ))}
      </div>
    </ToastContext.Provider>
  );
};

// Hook for using toast
export const useToast = () => {
  const context = useContext(ToastContext);
  if (context === undefined) {
    throw new Error("useToast must be used within a ToastProvider");
  }
  return context;
};

export default Toast;
