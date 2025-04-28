import { RootState } from './store';
import { ThemeMode } from './slices/themeSlice';

// Theme selectors
export const selectThemeMode = (state: RootState) => state.theme.mode as ThemeMode; 