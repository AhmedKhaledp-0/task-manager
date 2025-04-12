import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  createProject,
  getProjects,
  updateProject,
  deleteProject,
  getProjectById,
} from "../lib/api";
import useAuth from "./useAuth";
import { ProjectFormData } from "../types/Types";
import queryClient from "../config/queryClient";
import { useToast } from "../components/Toast";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";

export const useProjects = (opts = {}) => {
  const { data: authData } = useAuth();
  const queryClient = useQueryClient();

  // Invalidate the projects query when authData changes
  useEffect(() => {
    if (authData) {
      queryClient.invalidateQueries({ queryKey: ["projects"] });
    }
  }, [authData, queryClient]);

  const { data, ...rest } = useQuery({
    queryKey: ["projects"],
    queryFn: getProjects,
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
      if (!authData) throw new Error("User must be authenticated to fetch project");

      const response = await getProjectById(id);
      return response.data;
    },
    enabled: !!id && !!authData,
    staleTime: 1000 * 60 * 5,
    ...opts,
  });
};
