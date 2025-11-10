import { configureStore } from "@reduxjs/toolkit";
import { baseSummaryApi } from "../pages/summary/shared/redux/query";

export const store = configureStore({
  reducer: { [baseSummaryApi.reducerPath]: baseSummaryApi.reducer },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(baseSummaryApi.middleware),
});
