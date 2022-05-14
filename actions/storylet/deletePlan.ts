import * as PlansActionCreators from 'actions/plans';
import { handleVersionMismatch } from 'actions/versionSync';
import * as StoryletActionTypes from 'actiontypes/storylet';
import { VersionMismatch } from 'services/BaseService';
import PlansService from 'services/PlansService';

const service = new PlansService();

/** ----------------------------------------------------------------------------
 * DELETE PLAN
 -----------------------------------------------------------------------------*/
export default function deletePlan(branchId: number) {
  return (dispatch: Function) => {
    dispatch(deletePlanRequest());
    service.deletePlan(branchId).then(() => {
      dispatch(deletePlanSuccess(branchId));
      dispatch(PlansActionCreators.fetchPlans());
    }).catch((error) => {
      if (error instanceof VersionMismatch) {
        dispatch(handleVersionMismatch(error));
      }
      dispatch(deletePlanFailure(error));
    });
  };
}

const deletePlanRequest = () => ({
  type: StoryletActionTypes.DELETE_PLAN_REQUESTED,
  isFetching: true,
});

const deletePlanSuccess = (branchId: number) => ({
  type: StoryletActionTypes.DELETE_PLAN_SUCCESS,
  isFetching: false,
  removePlanFrom: branchId,
  payload: { branchId },
});

const deletePlanFailure = (error: any) => ({
  type: StoryletActionTypes.DELETE_PLAN_FAILURE,
  isFetching: false,
  error: true,
  status: error.response && error.response.status,
});
