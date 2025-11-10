import { baseSummaryApi } from "../../shared/redux/query";
import type { ICreateSummaryServerProps } from "../models/server/summaryCreate.server-model";

export const summaryCreateApi = baseSummaryApi.injectEndpoints({
  endpoints: (build) => ({
    createSummary: build.mutation<void, ICreateSummaryServerProps>({
      query: ({ ...body }) => ({
        url: import.meta.env.VITE_API_URL + "summary-all-to-users",
        method: "POST",
        body,
      }),
    }),
  }),
});

export const { useCreateSummaryMutation } = summaryCreateApi;
