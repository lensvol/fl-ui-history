import { handleVersionMismatch } from 'actions/versionSync';
import * as PlansActionTypes from 'actiontypes/plans';
import {
  clearCache,
} from 'actions/storylet';
import { VersionMismatch } from 'services/BaseService';
import PlansService from 'services/PlansService';
import { IEditPlanRequestData, IPlan, IPlansService } from 'types/plans';
import { ActionCreator } from 'redux';

export type SaveEditRequested = { type: typeof PlansActionTypes.SAVE_EDIT_REQUESTED };
export type SaveEditFailure = { type: typeof PlansActionTypes.SAVE_EDIT_FAILURE };
export type SaveEditSuccess = {
  type: typeof PlansActionTypes.SAVE_EDIT_SUCCESS,
  payload: {
    activePlans: IPlan[],
    completePlans: IPlan[],
  },
};

export type SaveEditActions = SaveEditRequested | SaveEditSuccess | SaveEditFailure;

/** ----------------------------------------------------------------------------
 * SAVE EDIT PLAN
 -----------------------------------------------------------------------------*/
export default saveEditPlan(new PlansService());

export function saveEditPlan(service: IPlansService) {
  return (planData: IEditPlanRequestData) => async (dispatch: Function) => {
    dispatch(editPlanRequest());
    try {
      const { data } = await service.editPlan(planData);
      dispatch(editPlanSuccess(data));
      dispatch(clearCache());
      return data;
    } catch (error) {
      if (error instanceof VersionMismatch) {
        dispatch(handleVersionMismatch(error));
        return;
      }
      dispatch(editPlanFailure());
      throw error;
    }
  };
}

export const editPlanRequest: ActionCreator<SaveEditRequested> = () => ({
  type: PlansActionTypes.SAVE_EDIT_REQUESTED,
});

export const editPlanSuccess: ActionCreator<SaveEditSuccess> = (data: { active: IPlan[], complete: IPlan[] }) => ({
  type: PlansActionTypes.SAVE_EDIT_SUCCESS,
  payload: {
    activePlans: data.active,
    completePlans: data.complete,
  },
});

export const editPlanFailure: ActionCreator<SaveEditFailure> = () => ({ type: PlansActionTypes.SAVE_EDIT_FAILURE });