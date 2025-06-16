import { SignUpActions } from "actions/registration/signUp";
import { SettingsActions } from "actions/settings";
import { UserActions } from "actions/user";

import { SIGNUP_SUCCESS } from "actiontypes/registration";
import * as UserActionTypes from "actiontypes/user";
import { CHANGE_USERNAME_SUCCESS } from "actiontypes/settings";

import signupSuccess from "reducers/user/signupSuccess";

import { IUserState } from "services/UserService";

/**
 * Initial state
 * @type {Object}
 */
const initialState: IUserState = {
  hasCharacter: false,
  loggedIn: false,
  isFetching: false,
  user: undefined,
  privilegeLevel: undefined,
};

/**
 * User Reducer
 * @param {IUserState} state
 * @param {UserActions | SignUpActions | SettingsActions} action
 */
const User = (
  state = initialState,
  action: UserActions | SignUpActions | SettingsActions
): IUserState => {
  switch (action.type) {
    case UserActionTypes.LOGIN_REQUESTED: {
      return {
        ...state,
        isFetching: true,
        loggedIn: false,
      };
    }

    case UserActionTypes.LOGIN_SUCCESS: {
      return {
        ...state,
        isFetching: false,
        hasCharacter: action.payload.hasCharacter,
        loggedIn: true,
        user: action.payload.user,
        privilegeLevel: action.payload.privilegeLevel,
      };
    }

    case SIGNUP_SUCCESS: {
      return signupSuccess(state, action);
    }

    case UserActionTypes.GOOGLE_LOGIN_SUCCESS:
    case UserActionTypes.FACEBOOK_LOGIN_SUCCESS: {
      return {
        ...state,
        hasCharacter: action.payload.hasCharacter,
        isFetching: false,
        loggedIn: true,
        user: action.payload.user,
      };
    }

    case UserActionTypes.LOGIN_FAILURE:
    case UserActionTypes.LOGOUT_SUCCESS:
    case UserActionTypes.FACEBOOK_LOGIN_FAILURE:
    case UserActionTypes.FACEBOOK_LOGIN_ERROR:
    case UserActionTypes.GOOGLE_LOGIN_FAILURE:
    case UserActionTypes.GOOGLE_LOGIN_ERROR: {
      return {
        ...state,
        loggedIn: false,
        isFetching: false,
      };
    }

    case UserActionTypes.GOOGLE_LOGIN_REQUESTED: {
      return {
        ...state,
        isFetching: true,
        loggedIn: false,
      };
    }

    case UserActionTypes.ALLOW_LOGIN_FROM_APP_SUCCESS: {
      return {
        ...state,
        loggedIn: true,
      };
    }

    case CHANGE_USERNAME_SUCCESS: {
      return {
        ...state,
        user: {
          name: action.payload.username,
          createdAt: state.user?.createdAt,
          id: state.user?.id,
          hasMessagingEmail: state.user?.hasMessagingEmail ?? false,
        },
      };
    }

    default:
      return state;
  }
};

export default User;
