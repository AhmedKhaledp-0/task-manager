import { FieldError, UseFormRegister } from "react-hook-form";
import { z, ZodType } from "zod";

export type FormFieldProps = {
  type?: string;
  label: string;
  name: string;
  register: UseFormRegister<any>;
  error?: FieldError;
  required?: boolean | string;
  value?: string;
  placeholder?: string;
  options?: { value: string; label: string }[];
  rows?: number;
  min?: number | string;
};

export type SignInFormData = {
  email: string;
  password: string;
};

export type SignUpFormData = {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
};

export type ForgetPasswordData = {
  email: string;
};

export type ProjectFormData = {
  name: string;
  deadline: Date | string;
  status: string;
  priority: string;
  description?: string;
  tasks?: [];
};

export type TaskFormData = {
  name: string;
  priority: string;
  status: string;
  deadline: Date;
  projectId: string;
  description?: string;
};

export interface Task {
  _id: string;
  name: string;
  description?: string;
  status: "todo" | "in-progress" | "completed";
  priority: "low" | "moderate" | "high";
  deadline: string;
  createdAt: string;
  updatedAt: string;
}

export interface ProjectData {
  _id: string;
  name: string;
  description?: string;
  status: "active" | "completed";
  priority: "low" | "moderate" | "high";
  deadline: string;
  tasks?: Task[];
}

export interface User {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
}

export const ProjectSchema: ZodType<ProjectFormData> = z.object({
  name: z.string().nonempty("Project name is required"),
  deadline: z.coerce.date().min(new Date(), "Deadline must be in the future"),
  status: z.string().nonempty("Status is required"),
  priority: z.string().nonempty("Priority is required"),
  description: z.string().optional(),
});

export type ValidFieldNames = "firstName" | "lastName" | "email" | "password";

export const SignUpSchema: ZodType<SignUpFormData> = z.object({
  firstName: z.string().nonempty("First name is required"),
  lastName: z.string().nonempty("Last name is required"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export const forgetPasswordSchema: ZodType<ForgetPasswordData> = z.object({
  email: z.string().email("Invalid email address"),
});

export const SignInSchema: ZodType<SignInFormData> = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export const TaskSchema: ZodType<TaskFormData> = z.object({
  name: z.string().nonempty("Task name is required"),
  deadline: z.coerce.date().min(new Date(), "Deadline must be in the future"),
  status: z.string().nonempty("Status is required"),
  priority: z.string().nonempty("Priority is required"),
  projectId: z.string().nonempty("Project is required"),
  description: z.string().optional(),
});

export type ToastType = "info" | "success" | "warning" | "error";
export type ToastPosition =
  | "top-right"
  | "top-left"
  | "bottom-right"
  | "bottom-left"
  | "top-center"
  | "bottom-center";

export interface ToastProps {
  type?: ToastType;
  title?: string;
  message: string;
  duration?: number;
  onClose?: () => void;
  position?: ToastPosition;
  showIcon?: boolean;
  showCloseButton?: boolean;
  className?: string;
}

export interface ToastContainerProps {
  children: React.ReactNode;
  position?: ToastPosition;
  className?: string;
}

export interface AuthContextType {
  data: User;
}

export interface Data {
  data: {
    projects: {
      _id: string;
      name: string;
      description?: string;
      status: "active" | "completed";
      priority: "low" | "moderate" | "high";
      deadline: string;
      tasks?: [];
    }[];
  };
}

export interface ErrorMessage {
  message?: string;
}
