import { RootState } from './store';
import { ProjectsState } from './slices/projectSlice';
import { ThemeMode } from './slices/themeSlice';

// Project selectors
export const selectAllProjects = (state: RootState) => (state.projects as ProjectsState).projects;
export const selectCurrentProject = (state: RootState) => (state.projects as ProjectsState).currentProject;
export const selectProjectsLoading = (state: RootState) => (state.projects as ProjectsState).loading;
export const selectProjectsError = (state: RootState) => (state.projects as ProjectsState).error;

// Theme selectors
export const selectThemeMode = (state: RootState) => state.theme.mode as ThemeMode; 