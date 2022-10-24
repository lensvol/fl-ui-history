import { CLEAR_ACCESS_CODE_RESULT } from "actiontypes/accessCodes";

export type ClearAccessCodeResult = {
  type: typeof CLEAR_ACCESS_CODE_RESULT;
  payload: any;
};

export default function clearAccessCodeResult(
  result: any
): ClearAccessCodeResult {
  return { type: CLEAR_ACCESS_CODE_RESULT, payload: result };
}
