import * as StoryletActionTypes from "actiontypes/storylet";
import { ActionCreator } from "redux";

export type ChooseBranchRequestedAction = {
  type: typeof StoryletActionTypes.CHOOSE_BRANCH_REQUESTED;
};

const chooseBranchRequest: ActionCreator<ChooseBranchRequestedAction> = () => ({
  type: StoryletActionTypes.CHOOSE_BRANCH_REQUESTED,
});

export default chooseBranchRequest;
