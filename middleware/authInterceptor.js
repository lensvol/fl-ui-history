import { logoutUser } from 'actions/user';

/**
 * Authorization check.
 *
 * If a 401 is returned from an api request, logout the user.
 * Ideally, this will impliment a token refresh method and only if that fails too
 * should it logout a user.
 */
export const authInterceptor = ({ dispatch }) => next => (action) => {
  if (action.status === 401) {
    dispatch(logoutUser());
  }

  return next(action);
};

export default authInterceptor;