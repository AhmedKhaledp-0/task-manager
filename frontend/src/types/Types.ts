import { FieldError, UseFormRegister } from "react-hook-form";
import { z, ZodType } from "zod";

export type FormFieldProps = {
  type?: string;
  label: string;
  name: string;
  register: UseFormRegister<any>;
  error?: FieldError;
  required?: boolean | string;
  placeholder?: string;
  options?: { value: string; label: string }[];
  rows?: number;
  min?: number;
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

export type ProjectFormData = {
  name: string;
  deadline: Date;
  status: string;
  priority: string;
  description?: string;
  tasks?: [];
};

export interface Project {
  _id: string;
  name: string;
  deadline: string;
  status: string;
  priority: string;
  description?: string;
  tasks?: [];
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

export const SignInSchema: ZodType<SignInFormData> = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
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
