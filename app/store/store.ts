import { configureStore } from "@reduxjs/toolkit";
import { combineReducers } from "redux";
import {
  persistReducer,
  persistStore,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from "redux-persist";
import storage from "redux-persist/lib/storage";

import PerformanceReducer from "../features/performance/performanceSliceInfo";
import UserChoicesReducer from "../features/userChoices/userChoicesSlice";

const rootReducer = combineReducers({
  performance: PerformanceReducer,
  userChoices: UserChoicesReducer,
});

const persistConfig = {
  key: "root",
  storage,
  whitelist: ["performance"],
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
});

// Kick off rehydration without PersistGate (avoids blocking first paint)
persistStore(store);

export type AppStore = typeof store;
export type RootState = ReturnType<typeof rootReducer>;
export type AppDispatch = AppStore["dispatch"];
