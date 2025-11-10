import { createStore, useStore } from "zustand";

export type IStoreHomeFine = {};

export type IStoreHomeFineState = IStoreHomeFine & {};

export const homeFineStore = createStore<IStoreHomeFineState>(() => ({}));

export const useHomeFineStore = <T>(
  selector: (store: IStoreHomeFineState) => T
): T => {
  return useStore(homeFineStore, selector);
};
