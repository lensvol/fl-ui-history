import { AppleAuthResponse } from "react-apple-signin-auth";

import { ActionCreator } from "redux";

import { ThunkDispatch } from "redux-thunk";

import { bootstrap } from "actions/app";
import createBootstrapOptions from "actions/user/createBootstrapOptions";
import handleAccessCodeResult from "actions/user/handleAccessCodeResult";
import setJwt from "actions/user/setJwt";
import { handleVersionMismatch } from "actions/versionSync";

import {
  APPLE_LOGIN_ERROR,
  APPLE_LOGIN_FAILURE,
  APPLE_LOGIN_REQUESTED,
  APPLE_LOGIN_SUCCESS,
} from "actiontypes/user";

import { Either, Failure } from "services/BaseMonadicService";
import { VersionMismatch } from "services/BaseService";
import UserService, { IUserService, LoginResponse } from "services/UserService";

import { IAppState } from "types/app";

export type AppleLoginRequested = {
  type: typeof APPLE_LOGIN_REQUESTED;
};

export type AppleLoginSuccess = {
  type: typeof APPLE_LOGIN_SUCCESS;
  payload: any;
};

export type AppleLoginError = {
  type: typeof APPLE_LOGIN_ERROR;
};

export type AppleLoginFailure = {
  type: typeof APPLE_LOGIN_FAILURE;
};

export type AppleLoginActions =
  AppleLoginRequested | AppleLoginSuccess | AppleLoginError | AppleLoginFailure;

const appleLoginRequested: ActionCreator<AppleLoginRequested> = () => ({
  type: APPLE_LOGIN_REQUESTED,
});

const appleLoginSuccess: ActionCreator<AppleLoginSuccess> = (data) => ({
  type: APPLE_LOGIN_SUCCESS,
  payload: {
    accessCodeResult: data.accessCodeResult,
    user: data.user,
  },
});

const appleLoginError: ActionCreator<AppleLoginError> = (error) => ({
  error,
  type: APPLE_LOGIN_ERROR,
  loginError: true,
  status: error.response && error.response.status,
});

const appleLoginFailure: ActionCreator<AppleLoginFailure> = (data) => ({
  type: APPLE_LOGIN_FAILURE,
  payload: data,
});

const userService: IUserService = new UserService();

/** ----------------------------------------------------------------------------
 * Apple Login
 -----------------------------------------------------------------------------*/
export default function appleLogin(authResponse: AppleAuthResponse) {
  return async (
    dispatch: ThunkDispatch<any, any, any>,
    getState: () => IAppState
  ) => {
    dispatch(appleLoginRequested());

    // Get access code from state
    const {
      accessCodes: { accessCode },
    } = getState();

    const accessCodeName = accessCode?.name;

    try {
      const result: Either<LoginResponse> = await userService.appleLogin({
        authResponse,
        accessCodeName,
      });

      if (result instanceof Failure) {
        dispatch(appleLoginFailure(result));

        return result;
      }

      const { data } = result;

      const { hasCharacter } = data;

      // Set our JWT (if we got one)
      if (data.jwt) {
        setJwt(window, {
          jwt: data.jwt,
        });
      }

      // Notify Redux that login succeeded
      dispatch(appleLoginSuccess(data));

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

      dispatch(appleLoginError(error));

      throw error;
    }
  };
}
