import { handleVersionMismatch } from "actions/versionSync";
import {
  FETCH_MYSELF_ERROR,
  FETCH_MYSELF_REQUESTED,
  FETCH_MYSELF_SUCCESS,
} from "actiontypes/myself";
import { ActionCreator } from "redux";
import { Failure, Success } from "services/BaseMonadicService";
import { VersionMismatch } from "services/BaseService";
import MyselfService, { IMyselfService } from "services/MyselfService";
import { IFetchMyselfResponseData } from "types/myself";

export type FetchMyselfRequested = { type: typeof FETCH_MYSELF_REQUESTED };
export type FetchMyselfSuccess = {
  type: typeof FETCH_MYSELF_SUCCESS;
  payload: IFetchMyselfResponseData;
};
export type FetchMyselfError = { type: typeof FETCH_MYSELF_ERROR };

export type FetchMyselfActions =
  | FetchMyselfRequested
  | FetchMyselfSuccess
  | FetchMyselfError;

export default function fetchMyself(setIsFetching = false) {
  const service: IMyselfService = new MyselfService();
  return async function (
    dispatch: Function
  ): Promise<Success<IFetchMyselfResponseData> | Failure | VersionMismatch> {
    if (setIsFetching) {
      dispatch(fetchMyselfRequested());
    }
    try {
      const result = await service.fetchMyself();

      if (result instanceof Success) {
        const { data } = result;
        dispatch(fetchMyselfSuccess(data));
      }
      return result;
    } catch (error) {
      if (error instanceof VersionMismatch) {
        dispatch(handleVersionMismatch(error));
      }
      throw error;
    }
  };
}

export const fetchMyselfRequested = () => ({ type: FETCH_MYSELF_REQUESTED });

export const fetchMyselfSuccess: ActionCreator<FetchMyselfSuccess> = (
  data: IFetchMyselfResponseData
) => ({
  type: FETCH_MYSELF_SUCCESS,
  payload: data,
});

export const fetchMyselfError = (error: any) => ({
  error,
  type: FETCH_MYSELF_ERROR,
});
