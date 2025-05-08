import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  createProject,
  getProjects,
  updateProject,
  deleteProject,
  getProjectById,
  getDashboardInsights,
  createTask,
  getTask,
  updateTask,
  deleteTask,
} from "../lib/api";
import useAuth from "./useAuth";
import { ProjectFormData, Task, TaskFormData } from "../types/Types";
import queryClient from "../config/queryClient";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { useToast } from "../components/UI/Toast";

// Project-related hooks
export const useProjects = (opts = {}, page = 1, limit = 10) => {
  const { data: authData } = useAuth();
  const queryClient = useQueryClient();

  // Invalidate the projects query when authData changes
  useEffect(() => {
    if (authData) {
      queryClient.invalidateQueries({ queryKey: ["projects"] });
      queryClient.invalidateQueries({ queryKey: ["insights"] });
    }
  }, [authData, queryClient]);

  const { data, ...rest } = useQuery({
    queryKey: ["projects", page, limit],
    queryFn: () => getProjects(page, limit),
    staleTime: Infinity,
    enabled: !!authData,
    ...opts,
  });

  return { data, ...rest };
};

export const useCreateProject = (opts = {}) => {
  const { addToast } = useToast();

  return useMutation({
    mutationFn: async (data: ProjectFormData) => {
      const response = await createProject(data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["projects"] });
      queryClient.invalidateQueries({ queryKey: ["insights"] });
      addToast({
        type: "success",
        title: "Success",
        message: "Project created successfully",
        duration: 3000,
      });
      console.log("Project created successfully");
    },
    onError: (error: Error) => {
      addToast({
        type: "error",
        title: "Error",
        message: error.message || "Failed to create project",
        duration: 5000,
      });
      queryClient.invalidateQueries({ queryKey: ["projects"] });
      console.log("Error creating project:", error);
    },
    ...opts,
  });
};

export const useUpdateProject = (opts = {}) => {
  const { addToast } = useToast();
  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: ProjectFormData }) => {
      const response = await updateProject(id, data);
      return { ...response.data, id };
    },
    onSuccess: (variables) => {
      queryClient.invalidateQueries({ queryKey: ["projects"] });
      queryClient.invalidateQueries({ queryKey: ["project", variables.id] });
      queryClient.invalidateQueries({ queryKey: ["insights"] });
      console.log("Project updated successfully");
      addToast({
        type: "success",
        title: "Success",
        message: "Project updated successfully",
        duration: 3000,
      });
    },
    onError: (error: Error) => {
      addToast({
        type: "error",
        title: "Error",
        message: error.message || "Failed to update project",
        duration: 5000,
      });
    },
    ...opts,
  });
};

export const useDeleteProject = (opts = {}) => {
  const { addToast } = useToast();
  const navigate = useNavigate();

  return useMutation({
    mutationFn: async (id: string) => {
      const response = await deleteProject(id);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["projects"] });
      queryClient.invalidateQueries({ queryKey: ["insights"] });
      console.log("Project deleted successfully");

      addToast({
        type: "success",
        title: "Success",
        message: "Project deleted successfully",
        duration: 3000,
      });
      navigate("/projects");
    },
    onError: (error: Error) => {
      addToast({
        type: "error",
        title: "Error",
        message: error.message || "Failed to delete project",
        duration: 5000,
      });
    },
    ...opts,
  });
};

export const useProject = (id: string | undefined, opts = {}) => {
  const { data: authData } = useAuth();
  return useQuery({
    queryKey: ["project", id],
    queryFn: async () => {
      if (!id) throw new Error("Project ID is required");
      if (!authData)
        throw new Error("User must be authenticated to fetch project");

      const response = await getProjectById(id);
      return response.data;
    },
    enabled: !!id && !!authData,
    staleTime: 1000 * 60 * 5,
    ...opts,
  });
};

// Task-related hooks
export const useTask = (id: string | undefined, opts = {}) => {
  const { data: authData } = useAuth();
  return useQuery({
    queryKey: ["task", id],
    queryFn: async () => {
      if (!id) throw new Error("Task ID is required");
      if (!authData)
        throw new Error("User must be authenticated to fetch task");

      const response = await getTask(id);
      return response.data;
    },
    enabled: !!id && !!authData,
    staleTime: 1000 * 60 * 5,
    ...opts,
  });
};

export const useCreateTask = (opts = {}) => {
  const { addToast } = useToast();

  return useMutation({
    mutationFn: async (data: TaskFormData) => {
      const response = await createTask(data);
      return response.data;
    },
    onSuccess: (_, variables) => {
      // Invalidate related queries
      if (variables.projectId) {
        queryClient.invalidateQueries({ queryKey: ["project", variables.projectId] });
      }
      queryClient.invalidateQueries({ queryKey: ["insights"] });
      
      addToast({
        type: "success",
        title: "Success",
        message: "Task created successfully",
        duration: 3000,
      });
    },
    onError: (error: Error) => {
      addToast({
        type: "error",
        title: "Error",
        message: error.message || "Failed to create task",
        duration: 5000,
      });
    },
    ...opts,
  });
};

export const useUpdateTask = (opts = {}) => {
  const { addToast } = useToast();
  
  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: Partial<Task> }) => {
      const response = await updateTask(id, data);
      return response.data
    },
    onSuccess: (variables) => {
      queryClient.invalidateQueries({ queryKey: ["task", variables.id] });
      queryClient.invalidateQueries({ queryKey: ["insights"] });
      
      addToast({
        type: "success",
        title: "Success",
        message: "Task updated successfully",
        duration: 3000,
      });
    },
    onError: (error: Error) => {
      addToast({
        type: "error",
        title: "Error",
        message: error.message || "Failed to update task",
        duration: 5000,
      });
    },
    ...opts,
  });
};

export const useDeleteTask = (opts = {}) => {
  const { addToast } = useToast();
  
  return useMutation({
    mutationFn: async (taskData: { id: string; projectId?: string }) => {
      const response = await deleteTask(taskData.id);
      return { ...response, ...taskData };
    },
    onSuccess: (_, variables) => {
      // If projectId is provided, invalidate that project's data
      if (variables.projectId) {
        queryClient.invalidateQueries({ 
          queryKey: ["project", variables.projectId] 
        });
      }
      queryClient.invalidateQueries({ queryKey: ["insights"] });
      
      addToast({
        type: "success",
        title: "Success",
        message: "Task deleted successfully",
        duration: 3000,
      });
    },
    onError: (error: Error) => {
      addToast({
        type: "error",
        title: "Error",
        message: error.message || "Failed to delete task",
        duration: 5000,
      });
    },
    ...opts,
  });
};

export const useInsights = (opts = {}) => {
  const { data: authData } = useAuth();
  return useQuery({
    queryKey: ["insights"],
    queryFn: async () => {
      if (!authData)
        throw new Error("User must be authenticated to fetch insights");
      const response = await getDashboardInsights();
      return response.data;
    },
    enabled: !!authData,
    staleTime: 1000 * 60 * 5,
    ...opts,
  });
};
