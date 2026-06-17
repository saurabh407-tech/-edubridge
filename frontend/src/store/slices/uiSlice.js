import { createSlice } from "@reduxjs/toolkit";

// UI Slice
const uiSlice = createSlice({
  name: "ui",
  initialState: { darkMode: localStorage.getItem("darkMode") === "true", sidebarOpen: true },
  reducers: {
    toggleDarkMode: (state) => {
      state.darkMode = !state.darkMode;
      localStorage.setItem("darkMode", state.darkMode);
      document.documentElement.classList.toggle("dark", state.darkMode);
    },
    toggleSidebar: (state) => { state.sidebarOpen = !state.sidebarOpen; },
    setSidebar: (state, action) => { state.sidebarOpen = action.payload; },
  },
});

export const { toggleDarkMode, toggleSidebar, setSidebar } = uiSlice.actions;
export const uiReducer = uiSlice.reducer;
export default uiSlice.reducer;
