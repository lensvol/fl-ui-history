import { handleVersionMismatch } from 'actions/versionSync';
import { LOGOUT_SUCCESS } from 'actiontypes/user';
import { ActionCreator } from 'redux';
import { ThunkDispatch } from 'redux-thunk';
import { VersionMismatch } from 'services/BaseService';
import UserService, { IUserService } from 'services/UserService';

import { closeSidebar } from 'actions/sidebar';
import clearAuthenticationTokens from 'features/startup/clearAuthenticationTokens';

export type LogoutSuccess = { type: typeof LOGOUT_SUCCESS };

export type LogoutActions = LogoutSuccess;

const service: IUserService = new UserService();

const logoutSuccess: ActionCreator<LogoutSuccess> = () => ({
  type: LOGOUT_SUCCESS,
  isFetching: false,
  loggedIn: false,
  loginError: false,
});

/** ----------------------------------------------------------------------------
 * LOGOUT - logout a user
 -----------------------------------------------------------------------------*/
export default function logoutUser() {
  return async (dispatch: ThunkDispatch<any, any, any>) => {
    // Remove any authentication tokens in local/session storage
    clearAuthenticationTokens();

    // Ensure that we close the sidebar when we're trying to log out
    dispatch(closeSidebar());
    try {
      // Let the store know we're logging out. No matter what, we're
      // going to clobber the store and go to /login
      dispatch(logoutSuccess());
      // Let the API know we're logging out
      await service.logout();
      window.location.href = '/login';
    } catch (error) {
      if (error instanceof VersionMismatch) {
        dispatch(handleVersionMismatch(error));
      }
      // Swallow errors; let's log the hell out without crashing, eh?
      console.error(error);
    }
  };
}
