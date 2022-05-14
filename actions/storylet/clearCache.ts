import * as StoryletActionTypes from 'actiontypes/storylet';
import { ActionCreator } from 'redux';

export type ClearCacheAction = {
  type: typeof StoryletActionTypes.CLEAR_CACHE,
};

/** ----------------------------------------------------------------------------
 * CLEAR CACHE
 -----------------------------------------------------------------------------*/
const clearCache: ActionCreator<ClearCacheAction> = () => ({ type: StoryletActionTypes.CLEAR_CACHE });

export default clearCache;

