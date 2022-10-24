import { handleVersionMismatch } from "actions/versionSync";
import {
  LOGIN_FAILURE,
  LOGIN_REQUESTED,
  LOGIN_SUCCESS,
} from "actiontypes/user";
import { ActionCreator } from "redux";
import { ThunkDispatch } from "redux-thunk";
import { Either, Success } from "services/BaseMonadicService";
import { VersionMismatch } from "services/BaseService";
import UserService, { IUserService, LoginResponse } from "services/UserService";

import { bootstrap } from "actions/app";
import { IAppState } from "types/app";
import handleAccessCodeResult from "actions/user/handleAccessCodeResult";
import createBootstrapOptions from "actions/user/createBootstrapOptions";

export type LoginRequested = { type: typeof LOGIN_REQUESTED };
export type LoginSuccess = { type: typeof LOGIN_SUCCESS; payload: any };
export type LoginFailure = { type: typeof LOGIN_FAILURE };

export type LoginActions = LoginRequested | LoginFailure | LoginSuccess;

const loginRequested: ActionCreator<LoginRequested> = () => ({
  type: LOGIN_REQUESTED,
});

export const loginSuccess: ActionCreator<LoginSuccess> = (
  data: LoginResponse
) => ({
  type: LOGIN_SUCCESS,
  isFetching: false,
  payload: {
    accessCodeResult: data.accessCodeResult,
    hasCharacter: data.hasCharacter,
    user: data.user,
    privilegeLevel: data.privilegeLevel,
  },
});

export const loginFailure: ActionCreator<LoginFailure> = () => ({
  type: LOGIN_FAILURE,
  isFetching: false,
  loggedIn: false,
  loginError: true,
});

const service: IUserService = new UserService();

/** ----------------------------------------------------------------------------
 * LOGIN - login a user
 -----------------------------------------------------------------------------*/
export default function loginUser(
  creds: { emailAddress: string; password: string },
  location: any,
  history: any
) {
  return async (
    dispatch: ThunkDispatch<
      Promise<Either<LoginResponse> | VersionMismatch>,
      any,
      any
    >,
    getState: () => IAppState
  ) => {
    dispatch(loginRequested());

    const state = getState();
    const {
      accessCodes: { accessCode },
    } = state;
    const accessCodeName = accessCode?.name;

    try {
      const result: Either<LoginResponse> = await service.login({
        ...creds,
        accessCodeName,
      });

      if (result instanceof Success) {
        const { data } = result;
        dispatch(loginSuccess(data));
        dispatch(bootstrap(createBootstrapOptions()));
        history.push(location.state ? location.state.from : "/");
        // Handle access code result
        dispatch(handleAccessCodeResult(data));
      } else {
        dispatch(loginFailure()); // ???
      }
      return result;
    } catch (error) {
      if (error instanceof VersionMismatch) {
        dispatch(handleVersionMismatch(error));
        return error;
      }
      dispatch(loginFailure());
      throw error;
    }
  };
}
