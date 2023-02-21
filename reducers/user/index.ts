import { SignUpActions } from "actions/registration/signUp";
import { UserActions } from "actions/user";
import { SIGNUP_SUCCESS } from "actiontypes/registration";
import * as UserActionTypes from "actiontypes/user";
import { IUserState } from "services/UserService";
import { CHANGE_USERNAME_SUCCESS } from "actiontypes/settings";
import { SettingsActions } from "actions/settings";

import signupSuccess from "./signupSuccess";

/**
 * Initial state
 * @type {Object}
 */
const initialState: IUserState = {
  hasCharacter: false,
  loggedIn: false,
  isFetching: false,
  isTwitterNagScreenOpen: false,
  user: undefined,
  privilegeLevel: undefined,
};

/**
 * User Reducer
 * @param {Object} state
 * @param {[Object]} action
 */
const User = (
  state = initialState,
  action: UserActions | SignUpActions | SettingsActions
): IUserState => {
  // const { payload = {} } = action;

  switch (action.type) {
    case UserActionTypes.LOGIN_REQUESTED:
      return {
        ...state,
        isFetching: true,
        loggedIn: false,
      };

    case UserActionTypes.LOGIN_FAILURE:
      return {
        ...state,
        isFetching: false,
        loggedIn: false,
      };

    case UserActionTypes.LOGIN_SUCCESS:
      return {
        ...state,
        isFetching: false,
        hasCharacter: action.payload.hasCharacter,
        loggedIn: true,
        user: action.payload.user,
        privilegeLevel: action.payload.privilegeLevel,
      };

    case SIGNUP_SUCCESS:
      return signupSuccess(state, action);

    case UserActionTypes.LOGOUT_SUCCESS:
      return {
        ...state,
        isFetching: false,
        loggedIn: false,
      };

    case UserActionTypes.TWITTER_LOGIN_SUCCESS:
    case UserActionTypes.FACEBOOK_LOGIN_SUCCESS: {
      return {
        ...state,
        hasCharacter: action.payload.hasCharacter,
        isFetching: false,
        loggedIn: true,
        user: action.payload.user,
      };
    }

    case UserActionTypes.FACEBOOK_LOGIN_FAILURE:
      return {
        ...state,
        isFetching: false,
        loggedIn: false,
      };

    case UserActionTypes.GOOGLE_LOGIN_FAILURE:
      return {
        ...state,
        loggedIn: false,
        isFetching: false,
      };

    case UserActionTypes.TWITTER_LOGIN_FAILURE:
      return {
        ...state,
        isFetching: false,
        loggedIn: false,
        isTwitterNagScreenOpen: true,
      };

    case UserActionTypes.FACEBOOK_LOGIN_ERROR:
      return {
        ...state,
        isFetching: false,
        loggedIn: false,
      };

    case UserActionTypes.GOOGLE_LOGIN_REQUESTED:
      return {
        ...state,
        isFetching: true,
        loggedIn: false,
      };

    case UserActionTypes.GOOGLE_LOGIN_ERROR:
      return {
        ...state,
        isFetching: false,
        loggedIn: false,
      };

    case UserActionTypes.GOOGLE_LOGIN_SUCCESS:
      return {
        ...state,
        isFetching: false,
        loggedIn: true,
        hasCharacter: action.payload.hasCharacter,
        user: action.payload.user,
      };

    case UserActionTypes.ALLOW_LOGIN_FROM_APP_SUCCESS:
      return {
        ...state,
        loggedIn: true,
      };

    case CHANGE_USERNAME_SUCCESS: {
      return {
        ...state,
        user: {
          name: action.payload.username,
          createdAt: state.user?.createdAt,
          id: state.user?.id,
        },
      };
    }

    default:
      return state;
  }
};

export default User;
