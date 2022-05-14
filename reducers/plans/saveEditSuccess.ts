import { SaveEditSuccess } from 'actions/plans/saveEditPlan';
import { IPlansState } from 'types/plans';

export default function saveEditSuccess(state: IPlansState, action: SaveEditSuccess) {
  const { payload } = action;
  const { activePlans, completePlans } = payload;

  return {
    ...state,
    activePlans,
    completePlans,
    isFetching: false,
  };
}