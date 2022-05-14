import { FlushPlans, ToggleEditMode } from 'actions/plans';
import { DeletePlanAction, DeletePlanSuccess } from 'actions/plans/deletePlan';
import { FetchPlansAction, FetchPlansSuccess } from 'actions/plans/fetchPlans';
import { SaveEditActions, SaveEditSuccess } from 'actions/plans/saveEditPlan';
import { CreatePlanAction } from 'actions/storylet/createPlan';
import * as PlansActionTypes from 'actiontypes/plans';


import deletePlanSuccess from 'reducers/plans/deletePlanSuccess';
import fetchPlansSuccess from 'reducers/plans/fetchPlansSuccess';
import saveEditSuccess from 'reducers/plans/saveEditSuccess';
import toggleEditMode from 'reducers/plans/toggleEditMode';
import { IPlansState } from 'types/plans';

import { INITIAL_STATE } from './constants';

type PlansActions =
  CreatePlanAction
  | DeletePlanAction
  | FetchPlansAction
  | FlushPlans
  | SaveEditActions
  | ToggleEditMode;

/**
 * Plans Reducer
 * @param {Object} state
 * @param {[Object]} action
 */
const Plans = (state: IPlansState = INITIAL_STATE, action: PlansActions) => {
  // const { payload = {} } = action;

  switch (action.type) {
    case PlansActionTypes.FETCH_PLANS_REQUESTED:
      return { ...state, isFetching: true };

    case PlansActionTypes.FETCH_PLANS_FAILURE:
      return { ...state, isFetching: false };

    case PlansActionTypes.FETCH_PLANS_SUCCESS:
      return fetchPlansSuccess(state, action as FetchPlansSuccess);

    case PlansActionTypes.TOGGLE_EDIT_MODE:
      return toggleEditMode(state, action);

    case PlansActionTypes.DELETE_PLAN_REQUESTED:
      return {
        ...state,
        isFetching: true,
      };

    case PlansActionTypes.DELETE_PLAN_SUCCESS:
      return deletePlanSuccess(state, action as DeletePlanSuccess);

    case PlansActionTypes.DELETE_PLAN_FAILURE:
      return {
        ...state,
        isFetching: false,
      };

    case PlansActionTypes.SAVE_EDIT_REQUESTED:
      return { ...state, isFetching: true };

    case PlansActionTypes.SAVE_EDIT_FAILURE:
      return { ...state, isFetching: false };

    case PlansActionTypes.SAVE_EDIT_SUCCESS:
      return saveEditSuccess(state, action as SaveEditSuccess);

    case PlansActionTypes.FLUSH_PLANS:
      return {
        ...state,
        activePlans: null,
        completePlans: null,
      };

    default:
      return state;
  }
};

export default Plans;
