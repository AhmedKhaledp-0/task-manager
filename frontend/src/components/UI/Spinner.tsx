import React from "react";

interface SpinnerProps {
  size?: "sm" | "md" | "lg";
  color?: string;
  className?: string;
}

const Spinner: React.FC<SpinnerProps> = ({
  size = "md",
  color = "gray",
  className = "",
}) => {
  const sizeClasses = {
    sm: "h-4 w-4",
    md: "h-8 w-8",
    lg: "h-12 w-12",
  };

  const colorClasses = {
    blue: "border-blue-500",
    green: "border-green-500",
    red: "border-red-500",
    yellow: "border-yellow-500",
    purple: "border-purple-500",
    gray: "border-gray-500",
    white: "border-white",
  };

  return (
    <div className={`flex items-center justify-center ${className}`}>
      <div
        className={`${
          sizeClasses[size]
        } animate-spin rounded-full border-2 border-t-transparent ${
          colorClasses[color as keyof typeof colorClasses]
        }`}
      />
    </div>
  );
};

export default Spinner;
