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
import { ToastPosition, ToastProps } from "../types/Types";

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

  // Configuration for each toast type
  const typeConfig = {
    info: {
      bg: "bg-primary-50",
      border: "border-l-4 border-primary-500",
      icon: (
        <FontAwesomeIcon
          icon={faInfoCircle}
          className="text-primary-500 text-lg"
        />
      ),
      iconBg: "bg-primary-100",
    },
    success: {
      bg: "bg-success-50",
      border: "border-l-4 border-success-500",
      icon: (
        <FontAwesomeIcon
          icon={faCircleCheck}
          className="text-success-500 text-lg"
        />
      ),
      iconBg: "bg-success-100",
    },
    warning: {
      bg: "bg-warning-50",
      border: "border-l-4 border-warning-500",
      icon: (
        <FontAwesomeIcon
          icon={faWarning}
          className="text-warning-500 text-lg"
        />
      ),
      iconBg: "bg-warning-100",
    },
    error: {
      bg: "bg-danger-50",
      border: "border-l-4 border-danger-500",
      icon: (
        <FontAwesomeIcon
          icon={faCircleXmark}
          className="text-danger-500 text-lg"
        />
      ),
      iconBg: "bg-danger-100",
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
        shadow-hard
        rounded-lg 
        overflow-hidden 
        ${bg}
        ${border}
        p-4 
        transition-all 
        duration-300 
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
            <div className="font-semibold text-neutral-900 mb-1">{title}</div>
          )}
          <div className="text-sm text-neutral-700">{message}</div>
        </div>
        {showCloseButton && (
          <button
            type="button"
            className="ml-4 text-neutral-400 hover:text-neutral-600 focus:outline-none transition-colors duration-200"
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

// Toast Container Component

// Toast Context for managing toasts
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

      {toasts.map((toast) => (
        <Toast key={toast.id} {...toast} />
      ))}
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
