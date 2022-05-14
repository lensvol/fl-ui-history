import * as StoryletActionTypes from 'actiontypes/storylet';

export type ChooseBranchFailureAction = {
  type: typeof StoryletActionTypes.CHOOSE_BRANCH_FAILURE,
  error: boolean,
  status?: number,
};

const chooseBranchFailure = (error: any) => ({
  type: StoryletActionTypes.CHOOSE_BRANCH_FAILURE,
  error: true,
  status: error.response?.status,
});

export default chooseBranchFailure;