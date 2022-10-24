import { handleVersionMismatch } from "actions/versionSync";
import {
  FETCH_AUTH_METHODS_FAILURE,
  FETCH_AUTH_METHODS_REQUESTED,
  FETCH_AUTH_METHODS_SUCCESS,
} from "actiontypes/settings";
import { ActionCreator } from "redux";
import { Success } from "services/BaseMonadicService";
import { VersionMismatch } from "services/BaseService";
import SettingsService, {
  AuthMethod,
  FetchAuthMethodsResponse,
  ISettingsService,
} from "services/SettingsService";
import { ThunkDispatch } from "redux-thunk";

export type FetchAuthMethodsRequested = {
  type: typeof FETCH_AUTH_METHODS_REQUESTED;
};
export type FetchAuthMethodsSuccess = {
  type: typeof FETCH_AUTH_METHODS_SUCCESS;
  payload: AuthMethod[];
};
export type FetchAuthMethodsFailure = {
  type: typeof FETCH_AUTH_METHODS_FAILURE;
};

export type FetchAuthMethodsActions =
  | FetchAuthMethodsRequested
  | FetchAuthMethodsSuccess
  | FetchAuthMethodsFailure;

export const fetchAuthMethodsRequested: ActionCreator<
  FetchAuthMethodsRequested
> = () => ({
  type: FETCH_AUTH_METHODS_REQUESTED,
});

export const fetchAuthMethodsSuccess: ActionCreator<
  FetchAuthMethodsSuccess
> = ({ authMethods }: FetchAuthMethodsResponse) => ({
  payload: authMethods,
  type: FETCH_AUTH_METHODS_SUCCESS,
});

export const fetchAuthMethodsFailure: ActionCreator<
  FetchAuthMethodsFailure
> = () => ({
  type: FETCH_AUTH_METHODS_FAILURE,
});

export default function fetchAuthMethods() {
  return async (dispatch: ThunkDispatch<any, any, any>) => {
    const service: ISettingsService = new SettingsService();
    dispatch(fetchAuthMethodsRequested());
    try {
      const result = await service.fetchAuthMethods();
      if (result instanceof Success) {
        dispatch(fetchAuthMethodsSuccess(result.data));
      } else {
        dispatch(fetchAuthMethodsFailure(result));
      }
      return result;
    } catch (error) {
      dispatch(fetchAuthMethodsFailure());
      if (error instanceof VersionMismatch) {
        dispatch(handleVersionMismatch(error));
        return error;
      }
      throw error;
    }
  };
}
