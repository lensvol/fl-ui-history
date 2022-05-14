import { DISPLAY_ACCESS_CODE_RESULT } from 'actiontypes/accessCodes';

export type DisplayAccessCodeResult = {
  type: typeof DISPLAY_ACCESS_CODE_RESULT,
  payload: any,
}

export default function displayAccessCodeResult(result: any): DisplayAccessCodeResult {
  return { type: DISPLAY_ACCESS_CODE_RESULT, payload: result };
}