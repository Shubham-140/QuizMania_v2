import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  lightMode: false,
};

export const colorSlice = createSlice({
  name: "colorSlice",
  initialState,
  reducers: {
    toggleMode: (state) => {
      state.lightMode = !state.lightMode;
    },
  },
});

export const { toggleMode } = colorSlice.actions;
export default colorSlice.reducer;
