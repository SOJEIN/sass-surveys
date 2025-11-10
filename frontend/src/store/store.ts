import { configureStore } from '@reduxjs/toolkit';
import { summaryFindApi } from '../pages/summary/find/redux/query';

export const store = configureStore({
  reducer: { [summaryFindApi.reducerPath]: summaryFindApi.reducer },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(summaryFindApi.middleware)
});
