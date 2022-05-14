import * as PlansActionCreators from 'actions/plans';
import { handleVersionMismatch } from 'actions/versionSync';
import * as StoryletActionTypes from 'actiontypes/storylet';
import { ActionCreator } from 'redux';
import { VersionMismatch } from 'services/BaseService';
import PlansService from 'services/PlansService';
import { ICreatePlanRequestData } from 'types/plans';

const service = new PlansService();

export type CreatePlanRequestedAction = {
  type: typeof StoryletActionTypes.CREATE_PLAN_REQUESTED,
};

export type CreatePlanSuccessAction = {
  type: typeof StoryletActionTypes.CREATE_PLAN_SUCCESS,
  payload: { branchId: number },
};

export type CreatePlanFailureAction = {
  type: typeof StoryletActionTypes.CREATE_PLAN_FAILURE,
  error: boolean,
  status?: number,
};

export type CreatePlanAction = CreatePlanRequestedAction | CreatePlanFailureAction | CreatePlanSuccessAction;

/** ----------------------------------------------------------------------------
 * CREATE PLAN
 -----------------------------------------------------------------------------*/
export default function createPlan(branchData: ICreatePlanRequestData) {
  return async (dispatch: Function) => {
    dispatch(createPlanRequest());
    try {
      await service.createPlan(branchData);
      dispatch(createPlanSuccess(branchData.id));
      return await dispatch(PlansActionCreators.fetchPlans());
    } catch (error) {
      if (error instanceof VersionMismatch) {
        dispatch(handleVersionMismatch(error));
      }
      dispatch(createPlanFailure(error));
    }
  };
}

const createPlanRequest: ActionCreator<CreatePlanRequestedAction> = () => ({
  type: StoryletActionTypes.CREATE_PLAN_REQUESTED,
  isFetching: true,
});

const createPlanSuccess: ActionCreator<CreatePlanSuccessAction> = (branchId: number) => ({
  type: StoryletActionTypes.CREATE_PLAN_SUCCESS,
  payload: { branchId },
});

const createPlanFailure = (error: any) => ({
  type: StoryletActionTypes.CREATE_PLAN_FAILURE,
  error: true,
  status: error.response && error.response.status,
});