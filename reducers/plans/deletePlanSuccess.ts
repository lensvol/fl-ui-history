import { DeletePlanSuccess } from "actions/plans/deletePlan";
import { IPlansState } from "types/plans";

export default function deletePlanSuccess(
  state: IPlansState,
  action: DeletePlanSuccess
) {
  const { toDelete } = action.payload;

  return {
    ...state,
    isFetching: false,
    activePlans: state.activePlans.filter(
      ({ branch: { id } }) => id !== toDelete
    ),
    completePlans: state.completePlans.filter(
      ({ branch: { id } }) => id !== toDelete
    ),
  };
}
