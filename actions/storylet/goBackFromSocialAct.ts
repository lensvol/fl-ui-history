import * as StoryletActionTypes from "actiontypes/storylet";
import * as phases from "constants/phases";
import { StoryletPhase } from "types/storylet";

export type GoBackFromSocialActAction = {
  type: typeof StoryletActionTypes.GO_BACK_FROM_SOCIAL_ACT;
  payload: { phase: StoryletPhase };
};

const goBackFromSocialAct = () => ({
  type: StoryletActionTypes.GO_BACK_FROM_SOCIAL_ACT,
  payload: { phase: phases.IN },
});

export default goBackFromSocialAct;
