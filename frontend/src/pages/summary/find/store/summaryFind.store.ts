import { createStore, useStore } from "zustand";

export type IStoreSummaryFind = {};

export type IStoreSummaryFindState = IStoreSummaryFind & {};

export const summaryFindStore = createStore<IStoreSummaryFindState>(() => ({}));
export const useSummaryFindStore = <T>(
  selector: (store: IStoreSummaryFindState) => T
): T => {
  return useStore(summaryFindStore, selector);
};
