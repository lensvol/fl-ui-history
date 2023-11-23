import * as StoryletActionTypes from "actiontypes/storylet";
import {
  IApiStoryletResponseData,
  ApiCharacterFriend,
} from "services/StoryletService";

export type ChooseBranchSuccessAction = {
  type: typeof StoryletActionTypes.CHOOSE_BRANCH_SUCCESS;
  payload: Pick<
    IApiStoryletResponseData,
    | "actions"
    | "canChangeOutfit"
    | "phase"
    | "storylets"
    | "storylet"
    | "rename"
    | "endStorylet"
    | "socialAct"
    | "externalSocialAct"
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
    externalSocialAct,
    secondChance,
    messages,
    setting,
  } = data;
  return {
    type: StoryletActionTypes.CHOOSE_BRANCH_SUCCESS,
    payload: {
      actions,
      canChangeOutfit,
      phase,
      storylets,
      storylet,
      rename,
      endStorylet,
      socialAct,
      externalSocialAct,
      secondChance,
      messages,
      eligibleFriends: socialAct?.inviteeData.eligibleFriends,
      setting,
    },
  };
}
