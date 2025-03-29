import { configureStore } from "@reduxjs/toolkit";
import { TypedUseSelectorHook, useDispatch, useSelector } from "react-redux";

// Import reducer types
import themeReducer from "./slices/themeSlice";
import projectReducer from "./slices/projectSlice";
import taskReducer, { TaskState } from "./slices/taskSlice";

// Still figuring out how to type this
export interface RootState {
  tasks: TaskState;
  theme: any;
  projects: any;
}

export const store = configureStore({
  reducer: {
    tasks: taskReducer,
    theme: themeReducer,
    projects: projectReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

export type AppDispatch = typeof store.dispatch;

export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
