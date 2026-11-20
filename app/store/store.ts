import { configureStore } from "@reduxjs/toolkit";
import UserChoicesReducer from "../features/userChoices/userChoicesSlice";

export const store = configureStore({
  reducer: {
    userChoices: UserChoicesReducer,
  },
});

export type AppStore = typeof store;
export type RootState = ReturnType<AppStore["getState"]>;
export type AppDispatch = AppStore["dispatch"];
