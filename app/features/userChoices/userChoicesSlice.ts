import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  numberOfQuestions: 10,
  totalTime: 120,
};

export const UserChoicesSlice = createSlice({
  name: "UserChoicesSlice",
  initialState,
  reducers: {
    setNumberOfQues: (state, action) => {
      state.numberOfQuestions = action.payload;
    },
    setTotalTime: (state, action) => {
      state.totalTime = action.payload;
    },
  },
});

export const { setNumberOfQues, setTotalTime } = UserChoicesSlice.actions;
export default UserChoicesSlice.reducer;
