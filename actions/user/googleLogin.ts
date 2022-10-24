import { handleVersionMismatch } from "actions/versionSync";
import {
  GOOGLE_LOGIN_ERROR,
  GOOGLE_LOGIN_FAILURE,
  GOOGLE_LOGIN_REQUESTED,
  GOOGLE_LOGIN_SUCCESS,
} from "actiontypes/user";
import { ActionCreator } from "redux";
import { ThunkDispatch } from "redux-thunk";
import { Either, Failure } from "services/BaseMonadicService";
import { VersionMismatch } from "services/BaseService";
import UserService, { IUserService, LoginResponse } from "services/UserService";
import { bootstrap } from "actions/app";
import { IAppState } from "types/app";

import handleAccessCodeResult from "actions/user/handleAccessCodeResult";
import setJwt from "actions/user/setJwt";
import createBootstrapOptions from "actions/user/createBootstrapOptions";

export type GoogleLoginRequested = { type: typeof GOOGLE_LOGIN_REQUESTED };
export type GoogleLoginSuccess = {
  type: typeof GOOGLE_LOGIN_SUCCESS;
  payload: any;
};
export type GoogleLoginError = { type: typeof GOOGLE_LOGIN_ERROR };
export type GoogleLoginFailure = { type: typeof GOOGLE_LOGIN_FAILURE };

export type GoogleLoginActions =
  | GoogleLoginRequested
  | GoogleLoginFailure
  | GoogleLoginError
  | GoogleLoginSuccess;

const googleLoginRequested: ActionCreator<GoogleLoginRequested> = () => ({
  type: GOOGLE_LOGIN_REQUESTED,
});

const googleLoginSuccess: ActionCreator<GoogleLoginSuccess> = (data) => ({
  type: GOOGLE_LOGIN_SUCCESS,
  payload: {
    accessCodeResult: data.accessCodeResult,
    user: data.user,
  },
});

const googleLoginError: ActionCreator<GoogleLoginError> = (error) => ({
  error,
  type: GOOGLE_LOGIN_ERROR,
  loginError: true,
  status: error.response && error.response.status,
});

const googleLoginFailure: ActionCreator<GoogleLoginFailure> = (data) => ({
  type: GOOGLE_LOGIN_FAILURE,
  payload: data,
});

const userService: IUserService = new UserService();

/** ----------------------------------------------------------------------------
 * Google Login
 -----------------------------------------------------------------------------*/
export default function googleLogin(token: any) {
  return async (
    dispatch: ThunkDispatch<any, any, any>,
    getState: () => IAppState
  ) => {
    dispatch(googleLoginRequested());

    // Get access code from state
    const {
      accessCodes: { accessCode },
    } = getState();
    const accessCodeName = accessCode?.name;

    try {
      const result: Either<LoginResponse> = await userService.googleLogin({
        token,
        accessCodeName,
      });

      if (result instanceof Failure) {
        dispatch(googleLoginFailure(result));
        return result;
      }
      const { data } = result;
      const { hasCharacter } = data;

      // Set our JWT (if we got one)
      if (data.jwt) {
        setJwt(window, { jwt: data.jwt });
      }

      // Notify Redux that login succeeded
      dispatch(googleLoginSuccess(data));

      if (hasCharacter) {
        // Bootstrap app state
        dispatch(bootstrap(createBootstrapOptions()));
        // Handle access code result
        dispatch(handleAccessCodeResult(data));
      }

      return result;
    } catch (error) {
      if (error instanceof VersionMismatch) {
        dispatch(handleVersionMismatch(error));
        return error;
      }
      dispatch(googleLoginError(error));
      throw error;
    }
  };
}
