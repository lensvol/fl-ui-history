import { FetchProfileSuccess } from 'actions/profile/fetchProfile';
import { IProfileState } from 'types/profile';

export default function fetchProfileSuccess(state: IProfileState, action: FetchProfileSuccess): IProfileState {
  const {
    characterName,
    currentArea,
    expandedEquippedPossessions,
    isLoggedInUsersProfile,
    profileCharacter,
    standardEquippedPossessions,
  } = action.payload;
  return {
    ...state,
    characterName,
    currentArea,
    isLoggedInUsersProfile,
    profileCharacter,
    expandedEquipped: expandedEquippedPossessions,
    isFetching: false,
    lookingAtOwnProfile: isLoggedInUsersProfile,
    standardEquipped: standardEquippedPossessions,
  };
}