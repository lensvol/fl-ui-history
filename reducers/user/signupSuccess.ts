import { SignUpSuccess } from 'actions/registration/signUp';
import { IUserState } from 'services/UserService';

export default function signupSuccess(state: IUserState, action: SignUpSuccess): IUserState {
  const {
    hasCharacter,
    privilegeLevel,
    user,
  } = action.payload;

  return {
    ...state,
    hasCharacter,
    privilegeLevel,
    user,
    isFetching: false,
    loggedIn: true,
  };
}