import { handleVersionMismatch } from 'actions/versionSync';
import {
  DELETE_PLAN_FAILURE,
  DELETE_PLAN_REQUESTED,
  DELETE_PLAN_SUCCESS,
} from 'actiontypes/plans';
// import * as PlansActionTypes from 'actiontypes/plans';
import { clearCache } from 'actions/storylet';
import { ActionCreator } from 'redux';
import { VersionMismatch } from 'services/BaseService';
import PlansService from 'services/PlansService';
import { IPlansService } from 'types/plans';

export type DeletePlanRequested = { type: typeof DELETE_PLAN_REQUESTED };
export type DeletePlanFailure = { type: typeof DELETE_PLAN_FAILURE };
export type DeletePlanSuccess = {
  type: typeof DELETE_PLAN_SUCCESS,
  payload: { toDelete: number },
};

export type DeletePlanAction = DeletePlanRequested | DeletePlanFailure | DeletePlanSuccess;

/** ----------------------------------------------------------------------------
 * DELETE PLAN
 -----------------------------------------------------------------------------*/

export default deletePlan(new PlansService());

export function deletePlan(service: IPlansService) {
  return (branchId: number) => async (dispatch: Function) => {
    dispatch(deletePlanRequest());
    try {
      // Note that we don't care about the response
      await service.deletePlan(branchId);
      dispatch(deletePlanSuccess(branchId));

      // This nulls the storylet state, which will force us to fetch it again the next time the user hits
      // the Story tab. This is probably to avoid letting plan editing push players into Menace states
      dispatch(clearCache());
    } catch (error) {
      if ( error instanceof VersionMismatch) {
        dispatch(handleVersionMismatch(error));
        return error;
      }
      dispatch(deletePlanFailure());
      throw error;
    }
  };
}

export const deletePlanRequest: ActionCreator<DeletePlanRequested> = () => ({ type: DELETE_PLAN_REQUESTED });

export const deletePlanSuccess: ActionCreator<DeletePlanSuccess> = (branchId: number) => ({
  type: DELETE_PLAN_SUCCESS,
  payload: {
    toDelete: branchId,
  },
});

export const deletePlanFailure: ActionCreator<DeletePlanFailure> = () => ({ type: DELETE_PLAN_FAILURE });
