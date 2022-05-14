import * as StoryletActionTypes from 'actiontypes/storylet';

const INITIAL_STATE = {
  phase: undefined,
};

export default function reducer(state = INITIAL_STATE, action) {
  const { payload, type } = action;

  switch (type) {
    // Phase changes caused by 'success' actions
    case StoryletActionTypes.CHOOSE_BRANCH_SUCCESS:
    case StoryletActionTypes.CHOOSE_STORYLET_SUCCESS:
    case StoryletActionTypes.FETCH_AVAILABLE_SUCCESS:
    case StoryletActionTypes.GO_BACK_FROM_SOCIAL_ACT:
    case StoryletActionTypes.SEND_SOCIAL_INVITATION_SUCCESS:
    case StoryletActionTypes.RENAME_QUALITY_SUCCESS:
      return { phase: payload.phase };

    default:
      return state;
  }
}