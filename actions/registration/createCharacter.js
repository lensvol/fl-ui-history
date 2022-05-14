import { handleVersionMismatch } from 'actions/versionSync';
import {
  CREATE_CHARACTER_FAILURE,
  CREATE_CHARACTER_REQUESTED,
  CREATE_CHARACTER_SUCCESS,
} from 'actiontypes/registration';
import { bootstrap } from 'actions/app';
import { loginSuccess } from 'actions/user';
import { VersionMismatch } from 'services/BaseService';
import RegisterService from 'services/RegisterService';

export const createCharacterRequested = () => ({ type: CREATE_CHARACTER_REQUESTED });

export const createCharacterSuccess = data => ({
  type: CREATE_CHARACTER_SUCCESS,
  loggedIn: true,
  user: data.user,
});

export const createCharacterFailure = error => ({
  ...error, // TODO: bad idea; let's destructure explicitly
  type: CREATE_CHARACTER_FAILURE,
  status: error.response && error.response.status,
});

const service = new RegisterService();

/** ----------------------------------------------------------------------------
 * CREATE CHARACTER
 -----------------------------------------------------------------------------*/
export default function createCharacter(char) {
  return async (dispatch, getState) => {
    dispatch(createCharacterRequested());

    // Get access code from state
    const { accessCodes: { accessCode } } = getState();
    const accessCodeName = accessCode?.name;

    try {
      const { data } = await service.createCharacter({ ...char, accessCodeName });
      if (!data.isSuccess) {
        throw new Error();
      }

      dispatch(loginSuccess(data));
      // Bootstrap the app state
      dispatch(bootstrap());
      return data;
    } catch (error) {
      if (error instanceof VersionMismatch) {
        dispatch(handleVersionMismatch(error));
      }
      return dispatch(createCharacterFailure(error));
    }
  };
}
