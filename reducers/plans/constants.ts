import { IPlansState } from "types/plans";

export const INITIAL_STATE: IPlansState = {
  activePlans: [],
  completePlans: [],
  firstFetchHasOccurred: false, // flag so that we can fetch plans the first time we hit the tab
  isFetching: false,
  isSaving: true,
};
