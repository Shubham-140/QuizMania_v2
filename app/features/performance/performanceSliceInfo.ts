import { createSlice } from "@reduxjs/toolkit";

interface reduxType {
  score: number;
  timeTaken: number;
}

const initialState: reduxType = {
  score: 0,
  timeTaken: 0,
};

export const performanceInfoSlice = createSlice({
  name: "performanceInfoSlice",
  initialState,
  reducers: {
    setScore: (state, action) => {
      state.score = action.payload;
    },
    setTimeTaken: (state, action) => {
      state.timeTaken = action.payload;
    },
  },
});

export const { setScore, setTimeTaken } = performanceInfoSlice.actions;
export default performanceInfoSlice.reducer;
