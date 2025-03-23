import  { ButtonHTMLAttributes, ReactNode } from "react";

type ButtonVariant = "primary" | "secondary" | "outline" | "ghost" | "destructive";
type ButtonSize = "sm" | "md" | "lg";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  className?: string;
  children: ReactNode;
}

const Button = ({
  variant = "primary",
  size = "md",
  className = "",
  children,
  ...props
}: ButtonProps) => {
  const baseClasses = "font-medium rounded-xl transition-colors  ";
  
  const variantClasses = {
    primary: "bg-blue-600 text-white hover:bg-blue-700 ",
    secondary: "bg-gray-200 text-gray-800 hover:bg-gray-300 ",
    outline: "bg-transparent border border-gray-300 text-gray-700 hover:bg-gray-100 ",
    ghost: "bg-transparent text-gray-700 hover:bg-gray-100 hover:text-gray-900 ",
    destructive: "bg-red-600 text-white hover:bg-red-700 ",
  };

  const sizeClasses = {
    sm: "text-xs px-3 py-1.5",
    md: "text-sm px-4 py-2",
    lg: "text-base px-6 py-2.5",
  };

  const classes = `${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${className}`;

  return (
    <button className={classes} {...props}>
      {children}
    </button>
  );
};

export default Button;

