import { FieldError, UseFormRegister } from "react-hook-form";
import { z, ZodType } from "zod";
import { ChangePasswordData } from "../lib/api";

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
  confirmPassword: string;
};

export type ForgetPasswordData = {
  email: string;
};

export type ResetPasswordData = {
  newPassword: string;
  confirmPassword: string;
};

export type ProjectFormData = {
  name: string;
  deadline: Date;
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
  id: string;
  name: string;
  description?: string;
  status: "todo" | "in-progress" | "completed";
  priority: "low" | "moderate" | "high";
  deadline: string;
  createdAt: string;
  updatedAt: string;
}

export interface ProjectData {
  id: string;
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

export const SignUpSchema: ZodType<SignUpFormData> = z
  .object({
    firstName: z
      .string()
      .trim()
      .min(1, "First name is required")
      .max(50, "First name is too long")
      .regex(
        /^[a-zA-Z\s-]+$/,
        "First name should only contain letters, spaces, or hyphens"
      ),
    lastName: z
      .string()
      .trim()
      .min(1, "Last name is required")
      .max(50, "Last name is too long")
      .regex(
        /^[a-zA-Z\s-]+$/,
        "Last name should only contain letters, spaces, or hyphens"
      ),
    email: z
      .string()
      .trim()
      .email("Invalid email address")
      .min(1, "Email is required")
      .max(255, "Email is too long"),
    password: z
      .string()
      .min(8, "Password must be at least 8 characters")
      .max(30, "Password is too long")
      .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
      .regex(/[a-z]/, "Password must contain at least one lowercase letter")
      .regex(/[0-9]/, "Password must contain at least one number")
      .regex(
        /[^A-Za-z0-9]/,
        "Password must contain at least one special character"
      ),
    confirmPassword: z
      .string()
      .min(1, "Confirm password is required")
      .max(30, "Confirm password is too long"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export const forgetPasswordSchema: ZodType<ForgetPasswordData> = z.object({
  email: z.string().email("Invalid email address"),
});

export const ResetPasswordSchema: ZodType<ResetPasswordData> = z
  .object({
    newPassword: z
      .string()
      .min(8, "Password must be at least 8 characters")
      .max(30, "Password is too long")
      .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
      .regex(/[a-z]/, "Password must contain at least one lowercase letter")
      .regex(/[0-9]/, "Password must contain at least one number")
      .regex(
        /[^A-Za-z0-9]/,
        "Password must contain at least one special character"
      ),
    confirmPassword: z
      .string()
      .min(1, "Confirm password is required")
      .max(30, "Confirm password is too long"),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export const SignInSchema: ZodType<SignInFormData> = z.object({
  email: z
    .string()
    .trim()
    .email("Invalid email address")
    .min(1, "Email is required")
    .max(255, "Email is too long"),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .max(30, "Password is too long")
    .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
    .regex(/[a-z]/, "Password must contain at least one lowercase letter")
    .regex(/[0-9]/, "Password must contain at least one number")
    .regex(
      /[^A-Za-z0-9]/,
      "Password must contain at least one special character"
    ),
});
export const ChangePasswordSchema: ZodType<ChangePasswordData> = z
  .object({
    oldPassword: z.string().min(1, "Current password is required"),
    newPassword: z
      .string()
      .min(8, "Password must be at least 8 characters")
      .max(30, "Password is too long")
      .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
      .regex(/[a-z]/, "Password must contain at least one lowercase letter")
      .regex(/[0-9]/, "Password must contain at least one number")
      .regex(
        /[^A-Za-z0-9]/,
        "Password must contain at least one special character"
      ),
    confirmPassword: z
      .string()
      .min(1, "Confirm password is required")
      .max(30, "Confirm password is too long"),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  })
  .refine((data) => data.oldPassword !== data.newPassword, {
    message: "New password must be different from current password",
    path: ["newPassword"],
  });

export interface ChangePasswordFormProps {
  onSuccess?: () => void;
  onCancel?: () => void;
}

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
      id: string;
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
