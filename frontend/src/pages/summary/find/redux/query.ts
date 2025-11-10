import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { adapterToLocalSummaryFind } from "../adapters/local/summaryFind.local-adapter";
import type { IFindSummaryLocal } from "../models/local/summaryFind.local-model";
import type { IFindSummaryServer } from "../models/server/summaryFind.server-model";

export const summaryFindApi = createApi({
  reducerPath: "summaryFindApi",
  baseQuery: fetchBaseQuery({
    baseUrl: "",
  }),
  endpoints: ({ query }) => ({
    findAllSummary: query<IFindSummaryLocal[], void>({
      query: () => ({
        url: import.meta.env.VITE_API_URL + "public/surveys/encuesta-demo",
        method: "GET",
      }),
      transformResponse: (response: IFindSummaryServer[]) => {
        return adapterToLocalSummaryFind(response);
      },
    }),
  }),
});

export const { useFindAllSummaryQuery } = summaryFindApi;
