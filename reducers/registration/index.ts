import * as RegistrationActionTypes from "actiontypes/registration";

import flattenAvatars from "reducers/registration/flattenAvatars";
import { IRegistrationState } from "types/registration";

/**
 * Initial state
 * @type {Object}
 */
const INITIAL_STATE: IRegistrationState = {
  isFetching: false,
  isLoggingIn: false,
  isCreating: false,
  avatars: [],
  message: null,
  isSuccess: null,
};

/**
 * Registration Reducer
 * @param {Object} state
 * @param {[Object]} action
 */
export default function reducer(state = INITIAL_STATE, action: any) {
  const { payload = {} } = action;

  switch (action.type) {
    case RegistrationActionTypes.FETCH_REGISTER_REQUESTED:
      return { ...state, isFetching: true };

    case RegistrationActionTypes.FETCH_REGISTER_FAILURE:
      return { ...state, isFetching: false };

    case RegistrationActionTypes.FETCH_REGISTER_SUCCESS:
      return {
        ...state,
        avatars: flattenAvatars(payload),
        isFetching: false,
      };

    case RegistrationActionTypes.SIGNUP_REQUESTED:
      return { ...state, isLoggingIn: true };

    case RegistrationActionTypes.SIGNUP_FAILURE:
      return {
        ...state,
        isLoggingIn: false,
        isSuccess: payload?.isSuccess ?? false,
        message: payload?.message,
      };

    case RegistrationActionTypes.SIGNUP_SUCCESS:
      return {
        ...state,
        isLoggingIn: false,
        isSuccess: payload.isSuccess,
        message: payload.message,
      };

    case RegistrationActionTypes.CREATE_CHARACTER_REQUESTED:
      return { ...state, isCreating: true };

    case RegistrationActionTypes.CREATE_CHARACTER_FAILURE:
      return { ...state, isCreating: false };

    case RegistrationActionTypes.CREATE_CHARACTER_SUCCESS:
      return { ...state, isCreating: false };

    default:
      return state;
  }
}
