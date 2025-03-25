import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export type ThemeMode = "light" | "dark";

interface ThemeState {
  mode: ThemeMode;
}

// Get initial theme from localStorage or default to light
const getInitialTheme = (): ThemeMode => {
  if (typeof window !== "undefined") {
    const storedTheme = localStorage.getItem("theme") as ThemeMode;
    return storedTheme === "dark" ? "dark" : "light";
  }
  return "light";
};

const initialState: ThemeState = {
  mode: getInitialTheme(),
};

export const themeSlice = createSlice({
  name: "theme",
  initialState,
  reducers: {
    setTheme: (state, action: PayloadAction<ThemeMode>) => {
      state.mode = action.payload;
      // Save to localStorage for persistence
      if (typeof window !== "undefined") {
        localStorage.setItem("theme", action.payload);
      }
    },
  },
});

export const { setTheme } = themeSlice.actions;

// Selector to get the theme
export const selectEffectiveTheme = (state: {
  theme: ThemeState;
}): ThemeMode => {
  return state.theme.mode;
};

export default themeSlice.reducer;
