import { handleVersionMismatch } from "actions/versionSync";
import * as FateActionTypes from "actiontypes/fate";
import { ActionCreator } from "redux";
import { Either, Success } from "services/BaseMonadicService";
import { VersionMismatch } from "services/BaseService";
import FateService, {
  FetchFateResponse,
  IFateService,
} from "services/FateService";
import { ThunkDispatch } from "redux-thunk";

const fetchFateRequested: ActionCreator<FetchFateRequested> = () => ({
  type: FateActionTypes.FETCH_REQUESTED,
});

const fetchFateSuccess: ActionCreator<FetchFateSuccess> = (
  data: FetchFateResponse
) => ({
  type: FateActionTypes.FETCH_SUCCESS,
  payload: data,
});

const fetchFateFailure: ActionCreator<FetchFateFailure> = (error: any) => ({
  type: FateActionTypes.FETCH_FAILURE,
  error: true,
  status: error.response && error.response.status,
});

export type FetchFateFailure = { type: typeof FateActionTypes.FETCH_FAILURE };
export type FetchFateRequested = {
  type: typeof FateActionTypes.FETCH_REQUESTED;
};
export type FetchFateSuccess = {
  type: typeof FateActionTypes.FETCH_SUCCESS;
  payload: FetchFateResponse;
};

export type FetchFateActions =
  | FetchFateFailure
  | FetchFateRequested
  | FetchFateSuccess;

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
