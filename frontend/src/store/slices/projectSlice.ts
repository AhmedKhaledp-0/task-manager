import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { ProjectData, ProjectFormData } from "../../types/Types";
import {
  createProject,
  deleteProject,
  getProjectById,
  getProjects,
  updateProject,
} from "../../lib/api";

export interface ProjectsState {
  projects: ProjectData[];
  currentProject: ProjectData | null;
  loading: boolean;
  error: string | null;
}

const initialState: ProjectsState = {
  projects: [],
  currentProject: null,
  loading: false,
  error: null,
};

// Async thunks for API calls
export const fetchProjects = createAsyncThunk(
  "projects/fetchProjects",
  async (_, { rejectWithValue }) => {
    try {
      const response = await getProjects();
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.message || "Failed to load projects");
    }
  }
);

export const fetchProjectById = createAsyncThunk(
  "projects/fetchProjectById",
  async (id: string, { rejectWithValue }) => {
    try {
      const response = await getProjectById(id);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.message || "Failed to load project details");
    }
  }
);

export const addProject = createAsyncThunk(
  "projects/addProject",
  async (projectData: ProjectFormData, { rejectWithValue }) => {
    try {
      const response = await createProject(projectData);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.message || "Failed to create project");
    }
  }
);

export const removeProject = createAsyncThunk(
  "projects/removeProject",
  async (id: string, { rejectWithValue }) => {
    try {
      await deleteProject(id);
      return id;
    } catch (error: any) {
      return rejectWithValue(error.message || "Failed to delete project");
    }
  }
);

export const editProject = createAsyncThunk(
  "projects/editProject",
  async (
    { id, newData }: { id: string; newData: any },
    { rejectWithValue }
  ) => {
    try {
      const response = await updateProject(id, newData);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.message || "Failed to update project");
    }
  }
);

const projectsSlice = createSlice({
  name: "projects",
  initialState,
  reducers: {
    clearCurrentProject: (state) => {
      state.currentProject = null;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch all projects
      .addCase(fetchProjects.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        fetchProjects.fulfilled,
        (state, action: PayloadAction<ProjectData[]>) => {
          state.loading = false;
          state.projects = action.payload;
        }
      )
      .addCase(fetchProjects.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // Fetch single project
      .addCase(fetchProjectById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        fetchProjectById.fulfilled,
        (state, action: PayloadAction<ProjectData>) => {
          state.loading = false;
          state.currentProject = action.payload;
        }
      )
      .addCase(fetchProjectById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // Add project
      .addCase(addProject.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        addProject.fulfilled,
        (state, action: PayloadAction<ProjectData>) => {
          state.loading = false;
          state.projects.push(action.payload);
        }
      )
      .addCase(addProject.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // Remove project
      .addCase(removeProject.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        removeProject.fulfilled,
        (state, action: PayloadAction<string>) => {
          state.loading = false;
          state.projects = state.projects.filter(
            (project) => project.id !== action.payload
          );
          if (
            state.currentProject &&
            state.currentProject.id === action.payload
          ) {
            state.currentProject = null;
          }
        }
      )
      .addCase(removeProject.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // Edit project
      .addCase(editProject.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        editProject.fulfilled,
        (state, action: PayloadAction<ProjectData>) => {
          state.loading = false;
          const index = state.projects.findIndex(
            (project) => project.id === action.payload.id
          );
          if (index !== -1) {
            state.projects[index] = action.payload;
          }
          if (
            state.currentProject &&
            state.currentProject.id === action.payload.id
          ) {
            state.currentProject = action.payload;
          }
        }
      )
      .addCase(editProject.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearCurrentProject, clearError } = projectsSlice.actions;

export default projectsSlice.reducer;
