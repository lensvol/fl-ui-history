import { ThunkDispatch } from "redux-thunk";

import fetchAgents from "actions/agents/fetchAgents";
import { processMessages } from "actions/app";
import { fetchMyself } from "actions/myself";
import { fetchOutfit } from "actions/outfit";
import chooseBranchFailure, {
  ChooseBranchFailureAction,
} from "actions/storylet/chooseBranch/chooseBranchFailure";
import chooseBranchRequest, {
  ChooseBranchRequestedAction,
} from "actions/storylet/chooseBranch/chooseBranchRequest";
import chooseBranchSuccess, {
  ChooseBranchSuccessAction,
} from "actions/storylet/chooseBranch/chooseBranchSuccess";
import { handleVersionMismatch } from "actions/versionSync";

import { VersionMismatch } from "services/BaseService";
import StoryletService, {
  IChooseBranchRequestData,
  IStoryletService,
} from "services/StoryletService";

export type ChooseBranchAction =
  | ChooseBranchFailureAction
  | ChooseBranchRequestedAction
  | ChooseBranchSuccessAction;

/** ----------------------------------------------------------------------------
 * CHOOSE A BRANCH
 -----------------------------------------------------------------------------*/
export default chooseBranch(new StoryletService());

export function chooseBranch(service: IStoryletService) {
  return (
      branchData: IChooseBranchRequestData & {
        qualityRequirements?: any[];
      }
    ) =>
    async (dispatch: ThunkDispatch<any, any, any>) => {
      // We're requesting
      dispatch(chooseBranchRequest());

      try {
        // Make the request
        const { data } = await service.chooseBranch(branchData);

        // OK, success!
        dispatch(chooseBranchSuccess(data));

        // fetch outfit + possessions, if necessary
        if (data.hasUpdatedCharacter) {
          dispatch(fetchMyself());
          dispatch(fetchOutfit());
          dispatch(fetchAgents());
        }

        const { messages } = data;

        if (messages) {
          dispatch(processMessages(messages));
        }
      } catch (error) {
        if (error instanceof VersionMismatch) {
          dispatch(handleVersionMismatch(error));
        }

        dispatch(chooseBranchFailure(error));
      }
    };
}
