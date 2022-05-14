import { FINISH } from 'actiontypes/storylet';

/** ----------------------------------------------------------------------------
 * FINISH
 -----------------------------------------------------------------------------*/
export default function finish() {
  return async (dispatch: Function) => dispatch(finishStorylet());
}

export const finishStorylet = () => ({ type: FINISH });