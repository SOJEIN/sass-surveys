import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const baseSummaryApi = createApi({
  reducerPath: "baseSummaryApi",
  baseQuery: fetchBaseQuery({
    baseUrl: "",
  }),
  endpoints: () => ({}),
});
