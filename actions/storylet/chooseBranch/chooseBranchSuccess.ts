import { CHOOSE_BRANCH_SUCCESS } from "actiontypes/storylet";

import {
  ApiCharacterFriend,
  IApiStoryletResponseData,
} from "services/StoryletService";

export type ChooseBranchSuccessAction = {
  type: typeof CHOOSE_BRANCH_SUCCESS;
  payload: Pick<
    IApiStoryletResponseData,
    | "actions"
    | "canChangeOutfit"
    | "phase"
    | "storylets"
    | "storylet"
    | "rename"
    | "maxHandSize"
    | "elapsed"
    | "endStorylet"
    | "socialAct"
    | "secondChance"
    | "setting"
    | "messages"
  > & {
    eligibleFriends?: ApiCharacterFriend[];
  };
};

export default function chooseBranchSuccess(
  data: IApiStoryletResponseData
): ChooseBranchSuccessAction {
  const {
    actions,
    canChangeOutfit,
    phase,
    storylets,
    storylet,
    rename,
    endStorylet,
    socialAct,
    secondChance,
    messages,
    setting,
    elapsed,
    maxHandSize,
  } = data;

  return {
    type: CHOOSE_BRANCH_SUCCESS,
    payload: {
      actions,
      canChangeOutfit,
      phase,
      storylets,
      storylet,
      rename,
      endStorylet,
      socialAct,
      secondChance,
      messages,
      eligibleFriends: socialAct?.inviteeData.eligibleFriends,
      setting,
      elapsed,
      maxHandSize,
    },
  };
}
