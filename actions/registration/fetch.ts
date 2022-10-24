import { handleVersionMismatch } from "actions/versionSync";
import {
  FETCH_REGISTER_FAILURE,
  FETCH_REGISTER_REQUESTED,
  FETCH_REGISTER_SUCCESS,
} from "actiontypes/registration";
import { ActionCreator } from "redux";
import { ThunkAction } from "redux-thunk";
import { VersionMismatch } from "services/BaseService";

import RegisterService, {
  FetchRegisterResponse,
} from "services/RegisterService";
import { Success, Failure, Either } from "services/BaseMonadicService";

export type FetchRegisterRequested = { type: typeof FETCH_REGISTER_REQUESTED };
export type FetchRegisterSuccess = {
  type: typeof FETCH_REGISTER_SUCCESS;
  payload: FetchRegisterResponse;
};

export type FetchRegisterFailure = {
  type: typeof FETCH_REGISTER_FAILURE;
};

const service = new RegisterService();

export const fetchRequested: ActionCreator<FetchRegisterRequested> = () => ({
  type: FETCH_REGISTER_REQUESTED,
});

export const fetchSuccess: ActionCreator<FetchRegisterSuccess> = (
  data: FetchRegisterResponse
) => ({
  type: FETCH_REGISTER_SUCCESS,
  payload: data,
});

export const fetchFailure: ActionCreator<FetchRegisterFailure> = (
  error: any
) => ({
  type: FETCH_REGISTER_FAILURE,
  error: true,
  status: error.response && error.response.status,
});

/** ----------------------------------------------------------------------------
 * FETCH
 -----------------------------------------------------------------------------*/
export default function fetch(): ThunkAction<
  Promise<Either<FetchRegisterResponse>>,
  any,
  any,
  any
> {
  return async (dispatch) => {
    dispatch(fetchRequested());
    try {
      const { data } = await service.fetch();
      dispatch(fetchSuccess(data));
      return { data } as Success<FetchRegisterResponse>;
    } catch (error) {
      if (error instanceof VersionMismatch) {
        dispatch(handleVersionMismatch(error));
        return { message: error.message } as Failure;
      }
      dispatch(fetchFailure(error));
      throw error;
    }
  };
}
