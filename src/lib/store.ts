import { configureStore } from "@reduxjs/toolkit";
import commonReducer from "./features/commonSlice";

// Create the store with middleware and reducers
export const makeStore = () => {
  return configureStore({
    reducer: {
      common: commonReducer,
    },
  });
};

export type AppStore = ReturnType<typeof makeStore>;
export type RootState = ReturnType<AppStore["getState"]>;
export type AppDispatch = AppStore["dispatch"];