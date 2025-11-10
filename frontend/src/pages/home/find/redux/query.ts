import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

// Placeholder RTK Query API for the Home/Find feature.
// Fill `endpoints` with real queries/mutations when needed.
export const homeApi = createApi({
  reducerPath: "homeApi",
  baseQuery: fetchBaseQuery({ baseUrl: "" }),
  endpoints: () => ({}),
});

// No hooks to export yet — add lines like
// export const { useYourQueryHook } = homeApi;
// when you add endpoints above.
