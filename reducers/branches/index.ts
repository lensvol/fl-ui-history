import { CreatePlanSuccessAction } from "actions/storylet/createPlan";
import {
  CREATE_PLAN_SUCCESS,
  DELETE_PLAN_SUCCESS,
  CHOOSE_BRANCH_SUCCESS,
  CHOOSE_STORYLET_SUCCESS,
  FETCH_AVAILABLE_SUCCESS,
} from "actiontypes/storylet";

import parseBranches from "./parseBranches";
import withRemovedPlans from "./withRemovedPlans";
import withActivePlans from "./withActivePlans";
import { IBranchesState } from "types/branches";

const INITIAL_STATE: IBranchesState = {
  branches: [],
};

export default function reducer(
  state = INITIAL_STATE,
  action: { type: string; payload: any }
) {
  const { payload = {} } = action;

  switch (action.type) {
    case CHOOSE_BRANCH_SUCCESS:
    case CHOOSE_STORYLET_SUCCESS:
    case FETCH_AVAILABLE_SUCCESS:
      return parseBranches(state, payload);

    case CREATE_PLAN_SUCCESS: {
      return {
        ...state,
        branches: withActivePlans(
          state.branches,
          (action as CreatePlanSuccessAction).payload
        ),
      };
    }

    case DELETE_PLAN_SUCCESS:
      return { ...state, branches: withRemovedPlans(state.branches, payload) };

    default:
      return state;
  }
}
