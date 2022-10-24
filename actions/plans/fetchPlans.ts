import { handleVersionMismatch } from "actions/versionSync";
import {
  FETCH_PLANS_FAILURE,
  FETCH_PLANS_REQUESTED,
  FETCH_PLANS_SUCCESS,
} from "actiontypes/plans";
import * as PlansActionTypes from "actiontypes/plans";
import { ActionCreator } from "redux";
import { VersionMismatch } from "services/BaseService";
import PlansService from "services/PlansService";
import { IPlan } from "types/plans";

const plansService = new PlansService();

export type FetchPlansRequested = { type: typeof FETCH_PLANS_REQUESTED };
export type FetchPlansFailure = { type: typeof FETCH_PLANS_FAILURE };
export type FetchPlansSuccess = {
  type: typeof FETCH_PLANS_SUCCESS;
  payload: {
    activePlans: IPlan[];
    completePlans: IPlan[];
  };
};

export type FetchPlansAction =
  | FetchPlansRequested
  | FetchPlansFailure
  | FetchPlansSuccess;

/** ----------------------------------------------------------------------------
 * FETCH PLANS
 -----------------------------------------------------------------------------*/
export default function fetchPlans() {
  return async (dispatch: Function) => {
    dispatch(fetchPlansRequest());
    try {
      const { data } = await plansService.fetchPlans();
      dispatch(fetchPlansSuccess(data));
      return data;
    } catch (error) {
      if (error instanceof VersionMismatch) {
        dispatch(handleVersionMismatch(error));
      }
      dispatch(fetchPlansFailure(error));
      throw error;
    }
  };
}

export const fetchPlansRequest: ActionCreator<FetchPlansRequested> = () => ({
  type: PlansActionTypes.FETCH_PLANS_REQUESTED,
  isFetching: true,
});

export const fetchPlansSuccess: ActionCreator<FetchPlansSuccess> = (data: {
  active: IPlan[];
  complete: IPlan[];
}) => ({
  type: PlansActionTypes.FETCH_PLANS_SUCCESS,
  isFetching: false,
  payload: {
    activePlans: data.active,
    completePlans: data.complete,
  },
});

export const fetchPlansFailure: ActionCreator<FetchPlansFailure> = (
  error: any
) => ({
  type: PlansActionTypes.FETCH_PLANS_FAILURE,
  isFetching: false,
  error: true,
  status: error.response && error.response.status,
});
