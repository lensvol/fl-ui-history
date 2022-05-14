import { handleVersionMismatch } from 'actions/versionSync';
import { ActionCreator } from 'redux';
import { Success } from 'services/BaseMonadicService';
import { VersionMismatch } from 'services/BaseService';

import MyselfService, {
  IMyselfService,
  SetAvatarImageResponse,
} from 'services/MyselfService';
import {
  MYSELF_CHANGED,
  NEW_AVATAR_IMAGE,
} from 'actiontypes/myself';
import { IQuality } from 'types/qualities';

export type NewAvatarImage = { type: typeof NEW_AVATAR_IMAGE, payload: { avatarImage: string } };
export type SetAvatarImageSuccess = {
  type: typeof MYSELF_CHANGED,
  payload: { possession: IQuality }[],
}

export default setAvatarImage(new MyselfService());

export function setAvatarImage(service: IMyselfService) {
  return ({ avatarImage }: { avatarImage: string }) => async (dispatch: Function) => {
    try {
      const result = await service.setAvatarImage({ avatarImage });
      if (result instanceof Success) {
        const { data } = result as Success<SetAvatarImageResponse>;
        dispatch(newAvatarImage(avatarImage));
        dispatch(setAvatarImageSuccess(data));
      }
      return result;
    } catch (error) {
      if (error instanceof VersionMismatch) {
        dispatch(handleVersionMismatch(error));
        return;
      }
      throw error;
    }
  };
}

export const newAvatarImage: ActionCreator<NewAvatarImage> = (avatarImage: string) => ({
  type: NEW_AVATAR_IMAGE,
  payload: { avatarImage },
});

export const setAvatarImageSuccess: ActionCreator<SetAvatarImageSuccess> = (
  { possessionsChanged }: { possessionsChanged: IQuality[] },
) => ({
  type: MYSELF_CHANGED,
  payload: possessionsChanged.map(p => ({ possession: p })),
});