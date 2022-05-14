import * as StoryletActionTypes from 'actiontypes/storylet';
import { ActionCreator } from 'redux';

export type PutInAction = {
  type: typeof StoryletActionTypes.PUT_IN,
};

/** ----------------------------------------------------------------------------
 * PUT IN
 -----------------------------------------------------------------------------*/
export const putIn: ActionCreator<PutInAction> = () => ({ type: StoryletActionTypes.PUT_IN });
export default putIn;
