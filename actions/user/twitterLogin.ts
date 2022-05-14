import {
  TWITTER_LOGIN_FAILURE,
  TWITTER_LOGIN_SUCCESS,
} from 'actiontypes/user';
import { bootstrap } from 'actions/app';
import {
  ActionCreator,
} from 'redux';

import { ThunkDispatch } from 'redux-thunk';

import handleAccessCodeResult from './handleAccessCodeResult';
import setJwt from './setJwt';
import createBootstrapOptions from './createBootstrapOptions';

export type TwitterLoginSuccess = {
  type: typeof TWITTER_LOGIN_SUCCESS,
  payload: any,
};
export type TwitterLoginFailure = { type: typeof TWITTER_LOGIN_FAILURE };

export type TwitterLoginActions = TwitterLoginSuccess | TwitterLoginFailure;

const twitterLoginSuccess: ActionCreator<TwitterLoginSuccess> = ({ accessCodeResult, user }) => ({
  type: TWITTER_LOGIN_SUCCESS,
  payload: { accessCodeResult, user, loggedIn: true },
});

export const twitterLoginFailure: ActionCreator<TwitterLoginFailure> = error => ({
  type: TWITTER_LOGIN_FAILURE,
  loggedIn: false,
  loginError: true,
  status: error.response && error.response.status,
});

/** ----------------------------------------------------------------------------
 * TWITTER
 -----------------------------------------------------------------------------*/
export default function twitterLogin(data: any) {
  return (dispatch: ThunkDispatch<any, any, any>) => {
    // Setting the JWT should be the very first thing we do.
    setJwt(window, data);

    // OK, we've logged in, so let Redux know
    dispatch(twitterLoginSuccess(data));

    // If we have a character, bootstrap the app with some API requests
    if (data.hasCharacter) {
      dispatch(bootstrap(createBootstrapOptions()));
      // Handle access code result
      dispatch(handleAccessCodeResult(data));
    }

    // Return data for caller to use
    return data;
  };
}
