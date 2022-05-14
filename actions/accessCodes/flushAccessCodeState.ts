import {
  FLUSH_ACCESS_CODE_STATE,
} from 'actiontypes/accessCodes';

export type FlushAccessCodeState = { type: typeof FLUSH_ACCESS_CODE_STATE };

export default function flushAccessCodeState() {
  return (dispatch: Function) => dispatch({ type: FLUSH_ACCESS_CODE_STATE });
}