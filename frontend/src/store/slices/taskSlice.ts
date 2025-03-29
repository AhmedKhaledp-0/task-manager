import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { Task } from "../../types/Types";
import { createTask, deleteTask, getTask, updateTask } from "../../lib/api";

export interface TaskState {
  tasks: Task[];
  loading: boolean;
  error: string | null;
  selectedTask: Task | null;
}

const initialState: TaskState = {
  tasks: [],
  loading: false,
  error: null,
  selectedTask: null,
};

// Async thunks
export const setTasksFromProjects = createAsyncThunk(
  "tasks/setTasksFromProjects",
  async (tasks: Task[]) => {
    return tasks;
  }
);

export const fetchTask = createAsyncThunk(
  "tasks/fetchTask",
  async (taskId: string) => {
    const response = await getTask(taskId);
    return response.data;
  }
);

export const createNewTask = createAsyncThunk(
  "tasks/createTask",
  async (taskData: any) => {
    const response = await createTask(taskData);
    return response.data;
  }
);

export const updateExistingTask = createAsyncThunk(
  "tasks/updateTask",
  async ({ id, data }: { id: string; data: any }) => {
    await updateTask(id, data);
    return { ...data, _id: id };
  }
);

export const deleteExistingTask = createAsyncThunk(
  "tasks/deleteTask",
  async (taskId: string) => {
    await deleteTask(taskId);
    return taskId;
  }
);

const taskSlice = createSlice({
  name: "tasks",
  initialState,
  reducers: {
    setSelectedTask: (state, action) => {
      state.selectedTask = action.payload;
    },
    clearSelectedTask: (state) => {
      state.selectedTask = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Set Tasks from Projects
      .addCase(setTasksFromProjects.fulfilled, (state, action) => {
        state.tasks = action.payload;
      })
      // Fetch Task
      .addCase(fetchTask.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTask.fulfilled, (state, action) => {
        state.loading = false;
        state.selectedTask = action.payload;
      })
      .addCase(fetchTask.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to fetch task";
      })
      // Create Task
      .addCase(createNewTask.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createNewTask.fulfilled, (state, action) => {
        state.loading = false;
        state.tasks.push(action.payload);
      })
      .addCase(createNewTask.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to create task";
      })
      // Update Task
      .addCase(updateExistingTask.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateExistingTask.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.tasks.findIndex(
          (task) => task._id === action.payload._id
        );
        if (index !== -1) {
          state.tasks[index] = action.payload;
        }
        if (state.selectedTask?._id === action.payload._id) {
          state.selectedTask = action.payload;
        }
      })
      .addCase(updateExistingTask.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to update task";
      })
      // Delete Task
      .addCase(deleteExistingTask.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteExistingTask.fulfilled, (state, action) => {
        state.loading = false;
        state.tasks = state.tasks.filter((task) => task._id !== action.payload);
        if (state.selectedTask?._id === action.payload) {
          state.selectedTask = null;
        }
      })
      .addCase(deleteExistingTask.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to delete task";
      });
  },
});

export const { setSelectedTask, clearSelectedTask } = taskSlice.actions;
export default taskSlice.reducer;
