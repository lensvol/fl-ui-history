import { handleVersionMismatch } from 'actions/versionSync';
import {
  ALLOW_LOGIN_FROM_APP_FAILURE,
  ALLOW_LOGIN_FROM_APP_REQUESTED,
  ALLOW_LOGIN_FROM_APP_SUCCESS,
} from 'actiontypes/user';
import * as UserActionTypes from 'actiontypes/user';
import { ActionCreator } from 'redux';
import { ThunkDispatch } from 'redux-thunk';
import {
  Either,
  Success,
} from 'services/BaseMonadicService';
import { VersionMismatch } from 'services/BaseService';
import UserService, {
  FetchUserResponse,
  IUserService,
} from 'services/UserService';

export type FetchUserSuccess = { type: typeof ALLOW_LOGIN_FROM_APP_SUCCESS };
export type FetchUserFailure = { type: typeof ALLOW_LOGIN_FROM_APP_FAILURE };
export type FetchUserRequested = { type: typeof ALLOW_LOGIN_FROM_APP_REQUESTED };

export type FetchUserActions = FetchUserRequested | FetchUserFailure | FetchUserSuccess;

const fetchUserSuccess: ActionCreator<FetchUserSuccess> = (data: FetchUserResponse) => ({
  type: UserActionTypes.ALLOW_LOGIN_FROM_APP_SUCCESS,
  payload: data,
});

const fetchUserRequested: ActionCreator<FetchUserRequested> = () => ({
  type: UserActionTypes.ALLOW_LOGIN_FROM_APP_REQUESTED,
});

const fetchUserFailed: ActionCreator<FetchUserFailure> = (error: any) => ({
  type: UserActionTypes.ALLOW_LOGIN_FROM_APP_FAILURE,
  status: error.response && error.response.status,
});

const userService: IUserService = new UserService();

export default function fetchUser() {
  return async (dispatch: ThunkDispatch<any, any, any>) => {
    dispatch(fetchUserRequested());
    try {
      const result: Either<FetchUserResponse> = await userService.fetchUser();
      if (result instanceof Success) {
        const { data } = result;
        dispatch(fetchUserSuccess(data));
      } else {
        dispatch(fetchUserFailed(result));
      }
      return result;
    } catch (error) {
      if (error instanceof VersionMismatch) {
        dispatch(handleVersionMismatch(error));
        return error;
      }
      dispatch(fetchUserFailed(error));
      throw error;
    }
  };
}
