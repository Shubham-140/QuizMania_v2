import { configureStore } from "@reduxjs/toolkit";
import ModeReducer from "../features/color/colorSlice";
import PerformanceReducer from "../features/performance/performanceSliceInfo";
import UserChoicesReducer from "../features/userChoices/userChoicesSlice";

export const store = () =>
  configureStore({
    reducer: {
      mode: ModeReducer,
      performance: PerformanceReducer,
      userChoices: UserChoicesReducer,
    },
  });

export type AppStore = ReturnType<typeof store>;
export type RootState = ReturnType<AppStore["getState"]>;
export type AppDispatch = AppStore["dispatch"];
