import { FetchPlansSuccess } from "actions/plans/fetchPlans";
import { IPlansState } from "types/plans";

export default function fetchPlansSuccess(
  state: IPlansState,
  action: FetchPlansSuccess
) {
  const { payload } = action;
  const activePlans = payload.activePlans.map((plan) => ({
    ...plan,
    editMode: !plan.notes,
  }));

  const completePlans = payload.completePlans.map((plan) => ({
    ...plan,
    editMode: !plan.notes,
  }));

  return {
    ...state,
    activePlans,
    completePlans,
    isFetching: false,
    firstFetchHasOccurred: true,
  };
}
