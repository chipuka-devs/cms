import { configureStore } from "@reduxjs/toolkit";

import contributionsReducer from "./contributions/contributionSlice";

export const store = configureStore({
  reducer: {
    contribution: contributionsReducer,
  },
});
