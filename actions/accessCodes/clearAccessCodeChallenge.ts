import {
  CLEAR_ACCESS_CODE_CHALLENGE,
} from 'actiontypes/accessCodes';

export type ClearAccessCodeChallenge = { type: typeof CLEAR_ACCESS_CODE_CHALLENGE };

export default function clearAccessCodeChallenge(): ClearAccessCodeChallenge {
  return { type: CLEAR_ACCESS_CODE_CHALLENGE };
}