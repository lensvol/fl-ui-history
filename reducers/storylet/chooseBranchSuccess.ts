import { ChooseBranchSuccessAction } from 'actions/storylet/chooseBranch/chooseBranchSuccess';
import { IStoryletState } from 'types/storylet';

export default function chooseBranchSuccess(state: IStoryletState, action: ChooseBranchSuccessAction): IStoryletState {
  const {
    canChangeOutfit,
    eligibleFriends,
    endStorylet,
    externalSocialAct,
    messages,
    phase,
    rename,
    secondChance,
    socialAct,
    storylet,
    storylets,
  } = action.payload;


  return {
    ...state,
    canChangeOutfit,
    eligibleFriends,
    endStorylet,
    phase,
    messages,
    rename,
    externalSocialAct,
    secondChance,
    addedFriendId: 0,
    isChoosing: false,
    message: null,
    socialAct: socialAct ?? null,
    storylet: storylet || state.storylet,
    storylets: storylets ?? null,
  };
}