import { ActionCreator } from "redux";

import { ThunkDispatch } from "redux-thunk";

import { handleVersionMismatch } from "actions/versionSync";

import {
  FETCH_FAILURE,
  FETCH_REQUESTED,
  FETCH_SUCCESS,
} from "actiontypes/fate";

import { Either, Success } from "services/BaseMonadicService";
import { VersionMismatch } from "services/BaseService";
import FateService, {
  FetchFateResponse,
  IFateService,
} from "services/FateService";

const fetchFateRequested: ActionCreator<FetchFateRequested> = () => ({
  type: FETCH_REQUESTED,
});

const fetchFateSuccess: ActionCreator<FetchFateSuccess> = (
  data: FetchFateResponse
) => ({
  type: FETCH_SUCCESS,
  payload: data,
});

const fetchFateFailure: ActionCreator<FetchFateFailure> = (error: any) => ({
  type: FETCH_FAILURE,
  error: true,
  status: error.response && error.response.status,
});

type FetchFateFailure = {
  type: typeof FETCH_FAILURE;
};

type FetchFateRequested = {
  type: typeof FETCH_REQUESTED;
};

export type FetchFateSuccess = {
  type: typeof FETCH_SUCCESS;
  payload: FetchFateResponse;
};

export type FetchFateActions =
  FetchFateFailure | FetchFateRequested | FetchFateSuccess;

export default fetch(new FateService());

export function fetch(
  service: IFateService
): () => (
  dispatch: ThunkDispatch<any, any, any>
) => Promise<Either<FetchFateResponse> | VersionMismatch> {
  return () => async (dispatch) => {
    dispatch(fetchFateRequested());

    try {
      const result = await service.fetchFate();

      if (result instanceof Success) {
        const { data } = result;

        dispatch(fetchFateSuccess(data));
      }

      return result;
    } catch (error) {
      if (error instanceof VersionMismatch) {
        dispatch(handleVersionMismatch(error));

        return error;
      }

      dispatch(fetchFateFailure(error));

      throw error;
    }
  };
}
