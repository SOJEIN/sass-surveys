import { adapterToLocalSummaryFind } from "../../find/adapters/local/summaryFind.local-adapter";
import type { IFindSummaryLocal } from "../../find/models/local/summaryFind.local-model";
import type { IFindSummaryServer } from "../../find/models/server/summaryFind.server-model";
import { baseSummaryApi } from "../../shared/redux/query";

export const summaryFindApi = baseSummaryApi.injectEndpoints({
  endpoints: (build) => ({
    findAllSummary: build.query<IFindSummaryLocal[], void>({
      query: () => ({
        url: import.meta.env.VITE_API_URL + "summary-all-to-users",
        method: "GET",
      }),
      transformResponse: (response: IFindSummaryServer[]) => {
        return adapterToLocalSummaryFind(response);
      },
    }),
  }),
});

export const { useFindAllSummaryQuery } = summaryFindApi;
