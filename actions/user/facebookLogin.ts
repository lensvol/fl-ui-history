import { ActionCreator } from "redux";

import { handleVersionMismatch } from "actions/versionSync";
import {
  FACEBOOK_LOGIN_ERROR,
  FACEBOOK_LOGIN_FAILURE,
  FACEBOOK_LOGIN_REQUESTED,
  FACEBOOK_LOGIN_SUCCESS,
} from "actiontypes/user";
import { ThunkDispatch } from "redux-thunk";
import { Failure } from "services/BaseMonadicService";
import { VersionMismatch } from "services/BaseService";
import UserService from "services/UserService";
import { bootstrap } from "actions/app";
import { IAppState } from "types/app";

import setJwt from "actions/user/setJwt";

import handleAccessCodeResult from "actions/user/handleAccessCodeResult";
import createBootstrapOptions from "./createBootstrapOptions";

const facebookLoginRequested: ActionCreator<FacebookLoginRequested> = () => ({
  type: FACEBOOK_LOGIN_REQUESTED,
  isFetching: true,
});

const facebookLoginSuccess: ActionCreator<FacebookLoginSuccess> = (
  data: any
) => ({
  hasCharacter: true,
  type: FACEBOOK_LOGIN_SUCCESS,
  payload: {
    loggedIn: true,
    accessCodeResult: data.accessCodeResult,
    user: data.user,
  },
});

const facebookLoginFailure: ActionCreator<FacebookLoginFailure> = (
  data: any
) => ({
  type: FACEBOOK_LOGIN_FAILURE,
  payload: data,
});

const facebookLoginError: ActionCreator<FacebookLoginError> = (error: any) => ({
  type: FACEBOOK_LOGIN_ERROR,
  isFetching: false,
  error,
  status: error.response && error.response.status,
});

const userService = new UserService();

export type FacebookLoginRequested = { type: typeof FACEBOOK_LOGIN_REQUESTED };
export type FacebookLoginSuccess = {
  type: typeof FACEBOOK_LOGIN_SUCCESS;
  payload: any;
};
export type FacebookLoginError = { type: typeof FACEBOOK_LOGIN_ERROR };
export type FacebookLoginFailure = { type: typeof FACEBOOK_LOGIN_FAILURE };

export type FacebookLoginActions =
  | FacebookLoginRequested
  | FacebookLoginFailure
  | FacebookLoginError
  | FacebookLoginSuccess;

/** ----------------------------------------------------------------------------
 * FACEBOOK
 -----------------------------------------------------------------------------*/
export default facebookLogin(userService);

export function facebookLogin(service: UserService) {
  return (res: any) =>
    async (
      dispatch: ThunkDispatch<any, any, any>,
      getState: () => IAppState
    ) => {
      // We're logging in
      dispatch(facebookLoginRequested());

      // Get access code from state, if it's there
      const {
        accessCodes: { accessCode },
      } = getState();
      const accessCodeName = accessCode?.name;

      try {
        // Make the call to /api/facebook/processsignedrequest
        const result = await service.facebookLogin({ ...res, accessCodeName });

        // If we didn't get the stuff we needed from the back-end (probably
        // because the user initiated a FB login and cancelled), then log errors
        // and return
        if (result instanceof Failure) {
          dispatch(facebookLoginFailure(result));
          return result;
        }

        const { data } = result;

        // Add JWT to storage
        setJwt(window, data);

        // We've logged in successfully
        dispatch(facebookLoginSuccess(data));

        // If the user already has a character, then proceed
        if (data.hasCharacter) {
          // Run bootstrap actions
          dispatch(bootstrap(createBootstrapOptions()));
          // Send us to the home page
          // history.push(location.state ? location.state.from : '/');
          // Handle access code result
          dispatch(handleAccessCodeResult(data));
        }

        return result;
      } catch (error) {
        if (error instanceof VersionMismatch) {
          dispatch(handleVersionMismatch(error));
          return error;
        }
        // Dispatch an error action for our Airbrake listener
        dispatch(facebookLoginError(error));
        throw error;
      }
    };
}
