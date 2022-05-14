import { handleVersionMismatch } from 'actions/versionSync';
import {
  SIGNUP_FAILURE,
  SIGNUP_REQUESTED,
  SIGNUP_SUCCESS,
} from 'actiontypes/registration';

import { bootstrap } from 'actions/app';
import { ThunkDispatch } from 'redux-thunk';
import { VersionMismatch } from 'services/BaseService';

import RegisterService, { IRegisterService } from 'services/RegisterService';

export type SignUpRequested = { type: typeof SIGNUP_REQUESTED};
export type SignUpSuccess = { type: typeof SIGNUP_SUCCESS, payload: any };
export type SignUpFailure = { type: typeof SIGNUP_FAILURE };

export type SignUpActions = SignUpRequested | SignUpFailure | SignUpSuccess;

export const signUpRequested = () => ({
  type: SIGNUP_REQUESTED,
});

export const signUpSuccess = (data: any) => ({
  type: SIGNUP_SUCCESS,
  payload: data,
});

export const signUpFailure = (error?: any) => ({
  type: SIGNUP_FAILURE,
  status: error?.response?.status,
});

/** ----------------------------------------------------------------------------
 * SIGN UP
 -----------------------------------------------------------------------------*/
export default signUp(new RegisterService());

export function signUp(service: IRegisterService) {
  return (signupData: any) => async (dispatch: ThunkDispatch<any, any, any>) => {
    dispatch(signUpRequested());

    try {
      const { data } = await service.emailRegister(signupData);
      // Dispatch an action to let the Redux store know what's up
      dispatch(signUpSuccess(data));
      if (data.isSuccess && data.hasCharacter) {
        // Cool, we should now be logged in, so bootstrap the app state
        dispatch(bootstrap());
      }
      // Return the data (for callers that need to inspect it)
      return data;
    } catch (error) {
      if (error instanceof VersionMismatch) {
        dispatch(handleVersionMismatch(error));
        return error;
      }
      dispatch(signUpFailure(error));
      throw error;
    }
  };
}
