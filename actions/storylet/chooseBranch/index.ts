import { handleVersionMismatch } from "actions/versionSync";
import { ThunkDispatch } from "redux-thunk";
import { VersionMismatch } from "services/BaseService";
import StoryletService, {
  IChooseBranchRequestData,
  IStoryletService,
} from "services/StoryletService";

import { processMessages } from "actions/app";
import { fetchMyself } from "actions/myself";
import { fetchOutfit } from "actions/outfit";

import chooseBranchFailure, {
  ChooseBranchFailureAction,
} from "./chooseBranchFailure";
import chooseBranchRequest, {
  ChooseBranchRequestedAction,
} from "./chooseBranchRequest";
import chooseBranchSuccess, {
  ChooseBranchSuccessAction,
} from "./chooseBranchSuccess";

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
      branchData: IChooseBranchRequestData & { qualityRequirements?: any[] }
    ) =>
    async (dispatch: ThunkDispatch<any, any, any>) => {
      // We're requesting
      dispatch(chooseBranchRequest());
      try {
        // Make the request
        const { data } = await service.chooseBranch(branchData);

        // OK, success!
        dispatch(chooseBranchSuccess(data));

        // Fetch Fate, too, in case we've spent it
        // dispatch(fetchFate());
        // dispatch(fetchActions());

        // fetch outfit + possessions
        dispatch(fetchMyself());
        dispatch(fetchOutfit());

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
