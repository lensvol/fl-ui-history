import { ToggleEditMode } from "actions/plans";
import { IPlansState } from "types/plans";

export default function toggleEditMode(
  state: IPlansState,
  action: ToggleEditMode
) {
  const { payload } = action;
  const activePlansEdit = state.activePlans.map((plan) => ({
    ...plan,
    editMode: plan.id === payload.planId ? !plan.editMode : plan.editMode,
  }));

  const completePlansEdit = state.completePlans.map((plan) => ({
    ...plan,
    editMode: plan.id === payload.planId ? !plan.editMode : plan.editMode,
  }));

  return {
    ...state,
    activePlansEdit,
    completePlansEdit,
  };
}
