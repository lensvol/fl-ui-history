import { ActionCreator } from "redux";

import { ThunkDispatch } from "redux-thunk";

import { processMessages } from "actions/app";
import { fetchMyself } from "actions/myself";
import { fetchOutfit } from "actions/outfit";
import { handleVersionMismatch } from "actions/versionSync";

import {
  CHOOSE_REPORT_BRANCH_FAILURE,
  CHOOSE_REPORT_BRANCH_REQUESTED,
  CHOOSE_REPORT_BRANCH_SUCCESS,
} from "actiontypes/agents";

import AgentsService, {
  IAgentsService,
  IChooseReportBranchRequestData,
} from "services/AgentsService";
import { Success } from "services/BaseMonadicService";
import { VersionMismatch } from "services/BaseService";
import {
  ApiCharacterFriend,
  IApiStoryletResponseData,
} from "services/StoryletService";

export type ChooseReportBranchFailureAction = {
  type: typeof CHOOSE_REPORT_BRANCH_FAILURE;
  error: boolean;
  status?: number;
};

const chooseReportBranchFailure = (error: any) => ({
  type: CHOOSE_REPORT_BRANCH_FAILURE,
  error: true,
  status: error.response?.status,
});

export type ChooseReportBranchRequestedAction = {
  type: typeof CHOOSE_REPORT_BRANCH_REQUESTED;
};

const chooseReportBranchRequest: ActionCreator<
  ChooseReportBranchRequestedAction
> = () => ({
  type: CHOOSE_REPORT_BRANCH_REQUESTED,
});

export type ChooseReportBranchSuccessAction = {
  type: typeof CHOOSE_REPORT_BRANCH_SUCCESS;
  payload: IApiStoryletResponseData & {
    eligibleFriends?: ApiCharacterFriend[];
  };
};

export function chooseReportBranchSuccess(
  data: IApiStoryletResponseData
): ChooseReportBranchSuccessAction {
  return {
    type: CHOOSE_REPORT_BRANCH_SUCCESS,
    payload: {
      ...data,
      eligibleFriends: data.socialAct?.inviteeData.eligibleFriends,
    },
  };
}

export type ChooseReportBranchAction =
  | ChooseReportBranchFailureAction
  | ChooseReportBranchRequestedAction
  | ChooseReportBranchSuccessAction;

/** ----------------------------------------------------------------------------
 * CHOOSE A BRANCH
 -----------------------------------------------------------------------------*/
export default chooseReportBranch(new AgentsService());

export function chooseReportBranch(service: IAgentsService) {
  return (
      branchData: IChooseReportBranchRequestData & {
        qualityRequirements?: any[];
      }
    ) =>
    async (dispatch: ThunkDispatch<any, any, any>) => {
      // We're requesting
      dispatch(chooseReportBranchRequest());

      try {
        // Make the request
        const result = await service.chooseReportBranch(branchData);

        if (result instanceof Success) {
          // OK, success!
          dispatch(chooseReportBranchSuccess(result.data));

          // fetch outfit + possessions, if necessary
          if (result.data.hasUpdatedCharacter) {
            dispatch(fetchMyself());
            dispatch(fetchOutfit());
          }

          if (result.data.messages) {
            dispatch(processMessages(result.data.messages));
          }

          return result;
        }
      } catch (error) {
        if (error instanceof VersionMismatch) {
          dispatch(handleVersionMismatch(error));
        }

        dispatch(chooseReportBranchFailure(error));
      }
    };
}
