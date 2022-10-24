import {
  CLEAR_ACCESS_CODE_CHALLENGE,
  DISPLAY_ACCESS_CODE_CHALLENGE,
  CLEAR_ACCESS_CODE_RESULT,
  DISPLAY_ACCESS_CODE_RESULT,
  FETCH_ACCESS_CODE_FAILURE,
  FETCH_ACCESS_CODE_REQUESTED,
  FETCH_ACCESS_CODE_SUCCESS,
  FLUSH_ACCESS_CODE_STATE,
} from "actiontypes/accessCodes";

import {
  FACEBOOK_LOGIN_SUCCESS,
  GOOGLE_LOGIN_SUCCESS,
  LOGIN_SUCCESS,
  TWITTER_LOGIN_SUCCESS,
} from "actiontypes/user";
import { FetchAccessCodeResponse } from "services/AccessCodeService";

export interface IAccessCodesState {
  isFetching: boolean;
  accessCode: FetchAccessCodeResponse | undefined;
  challenge: any;
  active: boolean;
  result: any;
  displayChallenge: boolean;
  displayResult: boolean;
}

/**
 * Iniitial state
 * @type {Object}
 */
const INITIAL_STATE: IAccessCodesState = {
  isFetching: false,
  accessCode: undefined,
  challenge: {},
  active: false,
  result: {},
  displayChallenge: false,
  displayResult: false,
};

export default function reducer(
  state = INITIAL_STATE,
  action: { type: string; payload: any }
) {
  switch (action.type) {
    case FETCH_ACCESS_CODE_REQUESTED:
      return { ...state, isFetching: true };

    case FETCH_ACCESS_CODE_FAILURE:
      return { ...state, isFetching: false };

    case FETCH_ACCESS_CODE_SUCCESS:
      return {
        ...state,
        accessCode: action.payload,
        displayChallenge: true,
        isFetching: false,
      };

    case FLUSH_ACCESS_CODE_STATE:
      return INITIAL_STATE;

    case CLEAR_ACCESS_CODE_CHALLENGE:
      return {
        ...state,
        displayChallenge: false,
      };

    case DISPLAY_ACCESS_CODE_CHALLENGE:
      return {
        ...state,
        challenge: action.payload,
        displayChallenge: true,
      };

    case LOGIN_SUCCESS:
    case FACEBOOK_LOGIN_SUCCESS:
    case GOOGLE_LOGIN_SUCCESS:
    case TWITTER_LOGIN_SUCCESS:
      if (action.payload.accessCodeResult) {
        return {
          ...state,
          displayChallenge: false,
          displayResult: true,
          result: {
            message: action.payload.accessCodeResult.message,
            success: action.payload.accessCodeResult.isSuccess,
          },
        };
      }
      return state;

    case DISPLAY_ACCESS_CODE_RESULT:
      return {
        ...state,
        displayResult: true,
        result: {
          message: action.payload.message,
          success: action.payload.isSuccess,
        },
      };

    case CLEAR_ACCESS_CODE_RESULT:
      return {
        ...state,
        result: {},
        displayResult: false,
      };

    default:
      return state;
  }
}
