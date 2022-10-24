import { handleVersionMismatch } from "actions/versionSync";
import {
  FETCH_ACCESS_CODE_FAILURE,
  FETCH_ACCESS_CODE_REQUESTED,
  FETCH_ACCESS_CODE_SUCCESS,
} from "actiontypes/accessCodes";
import { ActionCreator } from "redux";
import { ThunkDispatch } from "redux-thunk";
import AccessCodeService, {
  FetchAccessCodeResponse,
} from "services/AccessCodeService";
import { VersionMismatch } from "services/BaseService";

export type FetchAccessCodeRequested = {
  type: typeof FETCH_ACCESS_CODE_REQUESTED;
};
export type FetchAccessCodeSuccess = {
  type: typeof FETCH_ACCESS_CODE_SUCCESS;
  payload: any;
};
export type FetchAccessCodeFailure = { type: typeof FETCH_ACCESS_CODE_FAILURE };

export type FetchAccessCodeActions =
  | FetchAccessCodeRequested
  | FetchAccessCodeFailure
  | FetchAccessCodeSuccess;

/** ----------------------------------------------------------------------------
 * FETCH ACCESSCODE
 -----------------------------------------------------------------------------*/

const fetchAccessCodeRequest: ActionCreator<FetchAccessCodeRequested> = () => ({
  type: FETCH_ACCESS_CODE_REQUESTED,
});
const fetchAccessCodeSuccess: ActionCreator<FetchAccessCodeSuccess> = ({
  accessCode,
}: {
  accessCode: FetchAccessCodeResponse;
}) => ({
  type: FETCH_ACCESS_CODE_SUCCESS,
  payload: accessCode,
});
const fetchAccessCodeFailure: ActionCreator<FetchAccessCodeFailure> = (
  _e?: any
) => ({
  type: FETCH_ACCESS_CODE_FAILURE,
});

export default fetchAccessCode(new AccessCodeService());

export function fetchAccessCode(service: any) {
  return (code: string) => async (dispatch: ThunkDispatch<any, any, any>) => {
    dispatch(fetchAccessCodeRequest());
    try {
      const { data } = await service.fetchAccessCode(code);
      if (!data.isSuccess) {
        throw new Error();
      }
      // If we asked for a valid code, then dispatch
      dispatch(fetchAccessCodeSuccess(data));
      return data;
    } catch (e) {
      if (e instanceof VersionMismatch) {
        dispatch(handleVersionMismatch(e));
        return e;
      }
      // This is an invalid access code (or other failure)
      dispatch(fetchAccessCodeFailure(e));
      return e;
    }
  };
}
